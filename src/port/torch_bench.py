"""Torch bench port P0 (torchport-v10): eval-forward ONLY, no training.

Kaggle-side module (bundled with mirror.py + runner into one kernel script).
Architecture mirrors src/port/mirror.py exactly: same layer shapes, same
JS param order [E, Wq.W, Wq.b, Wk.W, Wk.b, Wv.W, Wv.b, Wa.W, Wa.b, Lz.W, Lz.b,
L1.W, L1.b, L2.W, L2.b, Lout.W, Lout.b], float64 throughout, r=1 eval.
No browser APIs, no I/O at import (loader takes parsed params).
"""

import torch

H, D, M, VOCAB, CLASSES = 48, 16, 96, 9, 4
EPS = 1e-8


def _lin(w_flat, b_flat, in_f, out_f):
    lin = torch.nn.Linear(in_f, out_f, dtype=torch.float64)
    with torch.no_grad():
        lin.weight.copy_(torch.tensor(w_flat, dtype=torch.float64).reshape(out_f, in_f))
        lin.bias.copy_(torch.tensor(b_flat, dtype=torch.float64))
    return lin


def rms(x):
    return x * torch.rsqrt((x * x).mean() + EPS)


def sig(x):
    return torch.sigmoid(x)


def silu(x):
    return x * torch.sigmoid(x)


def attn(q, k_ys, v_ys, n, d):
    sc = torch.stack([torch.dot(q, k_ys[j]) for j in range(n)]) * (1.0 / (d ** 0.5))
    w = torch.softmax(sc - torch.max(sc), dim=0)
    a = torch.zeros(d, dtype=torch.float64)
    for j in range(n):
        a = a + w[j] * v_ys[j]
    return a


class TAttn:
    def __init__(self, params):
        p = params
        assert len(p) == 17, len(p)
        self.E = torch.nn.Parameter(torch.tensor(p[0], dtype=torch.float64).reshape(VOCAB, H))
        self.Wq = _lin(p[1], p[2], 2 * H, D)
        self.Wk = _lin(p[3], p[4], H, D)
        self.Wv = _lin(p[5], p[6], H, D)
        self.Wa = _lin(p[7], p[8], D, H)
        self.Lz = _lin(p[9], p[10], 3 * H, H)
        self.L1 = _lin(p[11], p[12], 3 * H, M)
        self.L2 = _lin(p[13], p[14], M, H)
        self.Lout = _lin(p[15], p[16], H, CLASSES)

    def cell(self, s, e, ab):
        u = torch.cat([s, e, ab])
        zv = sig(self.Lz(u))
        cand = self.L2(silu(rms(self.L1(u))))
        return rms((1.0 - zv) * s + zv * cand)

    def forward(self, x):
        h, d = H, D
        emb = [self.E[tok].clone() for tok in x]
        L = len(x)
        S = [torch.zeros(h, dtype=torch.float64)]
        s = S[0]
        for t in range(L):
            if t > 0:
                q = self.Wq(torch.cat([s, emb[t]]))
                k_ys = [self.Wk(S[j + 1]) for j in range(t)]
                v_ys = [self.Wv(S[j + 1]) for j in range(t)]
                ab = self.Wa(attn(q, k_ys, v_ys, t, d))
            else:
                ab = torch.zeros(h, dtype=torch.float64)
            s = self.cell(s, emb[t], ab)
            S.append(s)
        eb = sum(emb) / float(L)
        eb_n = rms(eb)
        q = self.Wq(torch.cat([s, eb_n]))
        k_ys = [self.Wk(S[j + 1]) for j in range(L)]
        v_ys = [self.Wv(S[j + 1]) for j in range(L)]
        s = self.cell(s, eb_n, self.Wa(attn(q, k_ys, v_ys, L, d)))
        return self.Lout(rms(s))


def load_model(params):
    return TAttn(params)


# ---------------------------------------------------------------- training --
# P1 (torchport-p1). Shared-namespace pattern: mirror.py is concatenated ABOVE
# this file in Kaggle bundles (no imports of own parts); when mirror.py sits
# beside this file (local/CPython) the import wins. Either way bare names work.
try:
    from mirror import Rng as _Rng, assoc_gen as _ag
    _HAVE_MIRROR = True
except ImportError:
    _HAVE_MIRROR = False


def _new_rng(seed):
    if _HAVE_MIRROR:
        return _Rng(seed)
    return globals()["Rng"](seed)


def _agen(drng, n):
    if _HAVE_MIRROR:
        return _ag(drng, n)
    return globals()["assoc_gen"](drng, n)


def bind_labels(x):
    out = [None] * len(x)
    for t in range(1, len(x) - 2, 2):
        out[t] = x[t - 1]
    return out


def shuffle_in(rng, arr):
    for i in range(len(arr) - 1, 0, -1):
        j = rng.int(i + 1)
        arr[i], arr[j] = arr[j], arr[i]
    return arr


def gen_cycle_set(rng):
    keys = shuffle_in(rng, [0, 1, 2, 3])[:3]
    pairs = [[keys[i], 4 + rng.int(4)] for i in range(3)]
    flat = []
    for k, v in shuffle_in(rng, [p[:] for p in pairs]):
        flat.append(k)
        flat.append(v)
    fi = rng.int(3)
    ri = rng.int(3)
    return {"flat": flat, "kf": pairs[fi][0], "vf": pairs[fi][1] - 4,
            "vr": pairs[ri][1] - 4, "kr": pairs[ri][0]}


def forward_full(model, x):
    """logits + per-position readout logits (for bindLabels aux)."""
    h = H
    emb = [model.E[tok].clone() for tok in x]
    L = len(x)
    S = [torch.zeros(h, dtype=torch.float64)]
    s = S[0]
    pos = []
    for t in range(L):
        if t > 0:
            q = model.Wq(torch.cat([s, emb[t]]))
            k_ys = [model.Wk(S[j + 1]) for j in range(t)]
            v_ys = [model.Wv(S[j + 1]) for j in range(t)]
            ab = model.Wa(attn(q, k_ys, v_ys, t, D))
        else:
            ab = torch.zeros(h, dtype=torch.float64)
        s = model.cell(s, emb[t], ab)
        S.append(s)
        pos.append(model.Lout(rms(s)))
    eb = sum(emb) / float(L)
    eb_n = rms(eb)
    q = model.Wq(torch.cat([s, eb_n]))
    k_ys = [model.Wk(S[j + 1]) for j in range(L)]
    v_ys = [model.Wv(S[j + 1]) for j in range(L)]
    s = model.cell(s, eb_n, model.Wa(attn(q, k_ys, v_ys, L, D)))
    return model.Lout(rms(s)), pos


def _cycle_parts(model, P, B):
    """Returns (main, aux) unscaled-by-B part and B-scaled aux part.

    Main part still needs /B (caller sums sets like JS per-job dz/B);
    aux part already carries 1/(B*n). See scale note on cycle_set_loss.
    """
    flat, kf, vr = P["flat"], P["kf"], P["vr"]
    F, Fpos = forward_full(model, flat + [kf, 8])
    RV = [forward_full(model, flat + [4 + v, 8]) for v in range(4)]
    R, Rpos = forward_full(model, flat + [4 + vr, 8])
    FK = [forward_full(model, flat + [k, 8]) for k in range(4)]
    sm = lambda o: torch.softmax(o, dim=0)
    pF = sm(F)
    pRV = [sm(o[0]) for o in RV]
    E = sum(pF[v] * pRV[v][kf] for v in range(4))
    pR = sm(R)
    pFK = [sm(o[0]) for o in FK]
    E2 = sum(pR[k] * pFK[k][vr] for k in range(4))
    loss_main = -torch.log(E + 1e-12) - torch.log(E2 + 1e-12)
    aux_sum = torch.zeros((), dtype=torch.float64)
    jobs = [(F, Fpos, flat + [kf, 8]), (R, Rpos, flat + [4 + vr, 8])]
    for v in range(4):
        jobs.append((RV[v][0], RV[v][1], flat + [4 + v, 8]))
    for k in range(4):
        jobs.append((FK[k][0], FK[k][1], flat + [k, 8]))
    for _lg, ppos, jx in jobs:
        labs = bind_labels(jx)
        n = len(jx)
        for t in range(n):
            if labs[t] is None:
                continue
            aux_sum = aux_sum + (-torch.log_softmax(ppos[t], dim=0)[labs[t]] / (B * n))
    return loss_main, aux_sum


def cycle_main(model, P, B):
    """Main (no-aux) cycle scalar for one set, divided by B like JS."""
    main, _ = _cycle_parts(model, P, B)
    return main / B


def cycle_aux(model, P, B):
    """Aux-only cycle scalar for one set (already 1/(B*n) scaled)."""
    _, aux = _cycle_parts(model, P, B)
    return aux


def cycle_set_loss(model, P, B, use_aux=True):
    """One cycleStep-equivalent scalar (divided by B), incl. bindLabels aux."""
    main, aux = _cycle_parts(model, P, B)
    # NOTE: caller sums 8 sets; the /B below is per-set (JS divides each job's
    # contribution by B once). aux already carries its own 1/(B*n) scale.
    return main / B + (aux if use_aux else 0.0)


def distill_batch_loss(model, teacher, drng, B, W):
    loss = torch.zeros((), dtype=torch.float64)
    for _ in range(B):
        x, _y = _agen(drng, 1 + drng.int(3))
        with torch.no_grad():
            pt = torch.softmax(teacher.forward(x), dim=0)
        ps_log = torch.log_softmax(model.forward(x), dim=0)
        loss = loss + torch.sum(pt * (torch.log(pt + 1e-12) - ps_log))
    return loss * (W / B)


def model_params(model):
    out = [model.E]
    for lin in (model.Wq, model.Wk, model.Wv, model.Wa, model.Lz,
                model.L1, model.L2, model.Lout):
        out.append(lin.weight)
        out.append(lin.bias)
    return out


def train_round(model, teacher, seed_rng, seed_drng, steps, B=8, W=4):
    """One distill4 round recipe (fresh-Adam managed by caller)."""
    rng = _new_rng(seed_rng)
    drng = _new_rng(seed_drng)
    hist = []
    opt = torch.optim.Adam(model_params(model), lr=5e-3)
    for _ in range(steps):
        opt.zero_grad()
        cyc = torch.zeros((), dtype=torch.float64)
        for _ in range(B):
            cyc = cyc + cycle_set_loss(model, gen_cycle_set(rng), B)
        con = distill_batch_loss(model, teacher, drng, B, W)
        (cyc + con).backward()
        opt.step()
        hist.append((float(cyc.detach()), float(con.detach())))
    return hist
