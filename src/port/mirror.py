"""Dual-runtime bench mirror (mirror-v10).

Pure Python + numpy ONLY. No torch, no browser APIs, no I/O at import.
Runs unmodified under CPython/numpy (Kaggle lane) and Pyodide/numpy (parity
verification in this repo). Ports, exact op order, float64 throughout:
  - nn.js mulberry32/makeRng (imul mix, int/uniform, Box-Muller normal+spare)
  - tasks.js assocR.gen (Fisher-Yates keys, values, query, Q=8)
  - novel-driver.js shuffleIn + genReverse (flat pairs, query value, echo)
  - nn.js AttnModel.forward at r=1 (E rows, Wq/Wk/Wv/Wa causal attention with
    1/sqrt(d), Lz gate mix, L1/rms/silu/L2, mean-pool eb, one depth step over
    full memory, rC rms + Lout head; eps 1e-8; Linear row-major outF x inF)

Forward parity only (no training/backward). JS bitwise-note: Python ^ and |
on int32-range values match JS ToInt32 semantics bit-for-bit (low-bit ops on
two's complement); only shifts (>>>), imul (modular multiply) and addition
overflow need explicit emulation, handled by _u/_s/_imul/_shru.
"""

import math

import numpy as np

# ---------------------------------------------------------------- RNG ------
U32MASK = 0xFFFFFFFF


def _u(x):
    return int(x) & U32MASK


def _s(x):
    x = int(x) & U32MASK
    return x - 0x100000000 if x & 0x80000000 else x


def _imul(a, b):
    return _s(_u(a) * _u(b))


def _shru(a, n):
    return _u(a) >> n


class Rng:
    """Exact port of nn.js makeRng(seed) numeric path."""

    def __init__(self, seed):
        self.a = _s(seed if seed else 1)
        self.spare = None

    def f(self):
        self.a = _s(self.a + 0x6D2B79F5)
        t = _imul(self.a ^ _shru(self.a, 15), self.a | 1)
        t = t ^ _s(t + _imul(t ^ _shru(t, 7), t | 61))
        return _u(t ^ _shru(t, 14)) / 4294967296.0

    def uniform(self, a, b):
        return a + (b - a) * self.f()

    def int(self, n):
        return math.floor(self.f() * n)

    def normal(self, scale):
        # Unused in forward parity; ported for completeness (train-sequel).
        if self.spare is not None:
            v = self.spare * scale
            self.spare = None
            return v
        u = 0.0
        v = self.f()
        while u == 0:
            u = self.f()
        m = math.sqrt(-2.0 * math.log(u))
        self.spare = m * math.sin(2.0 * math.pi * v)
        return m * math.cos(2.0 * math.pi * v) * scale


# --------------------------------------------------------------- tasks -----
QMARK = 8


def shuffle_in(rng, arr):
    for i in range(len(arr) - 1, 0, -1):
        j = rng.int(i + 1)
        arr[i], arr[j] = arr[j], arr[i]
    return arr


def assoc_gen(rng, n_pairs):
    """Exact port of TASKS.assocR.gen. Returns (x, y)."""
    keys = shuffle_in(rng, [0, 1, 2, 3])
    ks = keys[:n_pairs]
    x, vals = [], []
    for k in ks:
        v = rng.int(4)
        vals.append(v)
        x.append(k)
        x.append(4 + v)
    qi = rng.int(n_pairs)
    x.append(ks[qi])
    x.append(QMARK)
    return x, vals[qi]


def gen_reverse(rng, n_pairs):
    """Exact port of novel-driver.js genReverse. Returns dict like the JS."""
    keys = shuffle_in(rng, [0, 1, 2, 3])[:n_pairs]
    pairs = [[k, 4 + rng.int(4)] for k in keys]
    j = rng.int(n_pairs)
    flat = []
    for k, v in shuffle_in(rng, [p[:] for p in pairs]):
        flat.append(k)
        flat.append(v)
    return {
        "flat": flat,
        "y": pairs[j][0],
        "echo": pairs[j][1] - 4,
        "x": flat + [pairs[j][1], QMARK],
    }


# --------------------------------------------------------------- model -----
def rms_forward(x):
    s = float(np.mean(x * x))
    inv = 1.0 / math.sqrt(s + 1e-8)
    return x * inv


def sig_forward(x):
    return 1.0 / (1.0 + np.exp(-x))


def silu_forward(x):
    return x * sig_forward(x)


class Linear:
    def __init__(self, w_flat, b_flat, in_f, out_f):
        w = np.array(w_flat, dtype=np.float64)
        b = np.array(b_flat, dtype=np.float64)
        assert w.size == out_f * in_f, (w.size, out_f, in_f)
        assert b.size == out_f, (b.size, out_f)
        self.W = w.reshape(out_f, in_f)
        self.b = b

    def __call__(self, x):
        return self.W.dot(x) + self.b


def attn_forward(q, k_ys, v_ys, n, d):
    inv = 1.0 / math.sqrt(d)
    sc = np.array([float(np.dot(q, k_ys[j])) for j in range(n)]) * inv
    mx = float(np.max(sc))
    w = np.exp(sc - mx)
    w = w / float(np.sum(w))
    a = np.zeros(d)
    for j in range(n):
        a = a + w[j] * v_ys[j]
    return a, w


class AttnModel:
    """Eval-forward port of nn.js AttnModel (r=1 assumed by caller)."""

    def __init__(self, params, h=48, d=16, m=96, vocab=9, classes=4):
        self.h, self.d = h, d
        p = params
        assert len(p) == 17, len(p)
        self.E = np.array(p[0], dtype=np.float64).reshape(vocab, h)
        self.Wq = Linear(p[1], p[2], 2 * h, d)
        self.Wk = Linear(p[3], p[4], h, d)
        self.Wv = Linear(p[5], p[6], h, d)
        self.Wa = Linear(p[7], p[8], d, h)
        self.Lz = Linear(p[9], p[10], 3 * h, h)
        self.L1 = Linear(p[11], p[12], 3 * h, m)
        self.L2 = Linear(p[13], p[14], m, h)
        self.Lout = Linear(p[15], p[16], h, classes)

    def cell(self, s, e, ab):
        u = np.concatenate([s, e, ab])
        zv = sig_forward(self.Lz(u))
        cand = self.L2(silu_forward(rms_forward(self.L1(u))))
        mix = (1.0 - zv) * s + zv * cand
        return rms_forward(mix)

    def forward(self, x):
        h, d = self.h, self.d
        emb = [np.array(self.E[tok], dtype=np.float64) for tok in x]
        L = len(x)
        S = [np.zeros(h)]
        s = S[0]
        for t in range(L):
            if t > 0:
                q = self.Wq(np.concatenate([s, emb[t]]))
                k_ys = [self.Wk(S[j + 1]) for j in range(t)]
                v_ys = [self.Wv(S[j + 1]) for j in range(t)]
                a, _ = attn_forward(q, k_ys, v_ys, t, d)
                ab = self.Wa(a)
            else:
                ab = np.zeros(h)
            s = self.cell(s, emb[t], ab)
            S.append(s)
        eb = sum(emb) / float(L)
        eb_n = rms_forward(eb)
        # depth (r=1): re-query full memory with current state
        q = self.Wq(np.concatenate([s, eb_n]))
        k_ys = [self.Wk(S[j + 1]) for j in range(L)]
        v_ys = [self.Wv(S[j + 1]) for j in range(L)]
        a, _ = attn_forward(q, k_ys, v_ys, L, d)
        s = self.cell(s, eb_n, self.Wa(a))
        return self.Lout(rms_forward(s))


def argmax_first(a):
    best, bi = a[0], 0
    for i in range(1, len(a)):
        if a[i] > best:
            best, bi = a[i], i
    return bi
