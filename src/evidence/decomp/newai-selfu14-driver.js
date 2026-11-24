// newai-selfu1-driver.js — U1 checkpoints-not-freezers: same W6+M2-nb init, UNFREEZE ALL.
// CPU/in-worker Float64. Twin-matched streams as in m2r2/m3r3. Deviations filed openly in prereg.
globalThis.SelfU14Init = async function (fs) {
  for (const p of ["src/evidence/decomp/intrinsic-driver.js", "src/evidence/decomp/newai-driver.js", "src/evidence/decomp/newai-v102-driver.js", "src/evidence/decomp/newai-fr-driver.js", "src/evidence/decomp/newai-div-driver.js", "src/evidence/decomp/newai-cur-driver.js", "src/evidence/decomp/newai-winner-driver.js", "src/evidence/decomp/newai-selfmr-driver.js", "src/evidence/decomp/newai-selfm2r2-driver.js", "src/evidence/decomp/newai-selfm3r3-driver.js"]) {
    const src = await fs.readTextFile(p); (0, eval)(src + "\n//# sourceURL=" + p);
  }
  if (!globalThis.genAdaptEpisode) throw new Error("u14 stack load failed");
};
function u14ArmCode(arm) { if (arm === "u14-plain") return 133; if (arm === "u14-ewc") return 134; return 133; }
// U14 shared core: single-episode full-graph backward (U1 gate path, B=1), Fisher, alignment.
// Diet code mirrors runU14Train exactly (pick-best-of-C standard + adapt episodes) so Fisher sees the protected mapping.
function u14EntropyOf(hv) {
  let mx = hv[0]; for (let o = 1; o < 4; o++) if (hv[o] > mx) mx = hv[o];
  let s = 0; const p = new Float64Array(4);
  for (let o = 0; o < 4; o++) { p[o] = Math.exp(hv[o] - mx); s += p[o]; }
  for (let o = 0; o < 4; o++) p[o] /= s;
  let Hh = 0; for (let o = 0; o < 4; o++) Hh -= p[o] * Math.log(p[o] + 1e-12);
  return Hh / Math.log(4);
}
function u14Argmax4(a) { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; }
function u14ZeroAll(G, M, MP, RP) {
  for (const p of inSeqParams(M)) p.g.fill(0);
  MP.Wq.g.fill(0); MP.Watt.g.fill(0); MP.batt.g.fill(0);
  RP.Wc.g.fill(0); RP.bc.g.fill(0); RP.we.g.fill(0); RP.wb.g.fill(0); RP.wd.g.fill(0); RP.b.g.fill(0);
}
// One episode forward+backward, gate path (U1 recipe), B=1 scaling. Caller zeroes first via u14ZeroAll.
// rng: caller-owned stream (Fisher/alignment streams; train diet streams untouched). Returns loss.
function u14EpisodeBackward(M, MP, RP, rng, masks, diet) {
  const C = 6, H = 48, auxW = 0.5;
  let e, sup;
  if (diet === "std") {
    const cands = [];
    for (let c = 0; c < C; c++) { const ub = rng.int(2) === 0; cands.push(ub ? inSeqGenShift(rng, 0) : inSeqGenShift(rng, null)); }
    let pk = 0, best = -1;
    for (let c = 0; c < C; c++) {
      const fw = inSeqForward(M, cands[c].x, new Float64Array(8), masks);
      const d = curVoteDisagree(fw.logitsK);
      if (d > best) { best = d; pk = c; }
    }
    e = cands[pk];
    const supE = [inSeqGenShift(rng, null), inSeqGenShift(rng, null), inSeqGenShift(rng, null), inSeqGenShift(rng, null)];
    sup = supE.map(se => ({ qkId: se.qk, vId: 4 + se.v, forceZero: false }));
  } else {
    const ep = genAdaptEpisode(rng);
    e = ep.query;
    sup = ep.sup.map(se => ({ qkId: se.qk, vId: 4 + se.v, forceZero: false }));
  }
  const fw1 = inSeqForward(M, e.x, new Float64Array(8), masks);
  const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = M.E.v[e.qk * 12 + d];
  const fr = m2ReadForward(M, MP, Eqk, sup); fr.qkId = e.qk;
  let z = RP.bc.v[0]; for (let i = 0; i < H; i++) z += RP.Wc.v[i] * fw1.h[i];
  const beta = 1 / (1 + Math.exp(-z));
  const dis = curVoteDisagree(fw1.logitsK);
  const Hh = u14EntropyOf(fw1.hvLog);
  const g = 1 / (1 + Math.exp(-(RP.we.v[0] * Hh + RP.wb.v[0] * beta + RP.wd.v[0] * dis + RP.b.v[0])));
  const ensV = new Float64Array(4); for (let o = 0; o < 4; o++) ensV[o] = fw1.hvLog[o] + g * fr.readLogits[o];
  const ceHv = inCELossGrad(ensV, e.v);
  const vhat = u14Argmax4(ensV);
  const wrong1 = vhat === e.v ? 0 : 1;
  const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
  const fw2 = inSeqForward(M, x2m, fw1.cNew, masks);
  const mean2 = inMeanLogits({ logitsK: fw2.logitsK });
  const ce2 = inCELossGrad(mean2, e.y);
  const loss = ce2.loss + auxW * ceHv.loss + 0.5 * (-(wrong1 * Math.log(beta + 1e-12) + (1 - wrong1) * Math.log(1 - beta + 1e-12)));
  const dMean2 = new Float64Array(4); for (let o = 0; o < 4; o++) dMean2[o] = ce2.d[o];
  const dc2 = u1SeqBackwardFull(M, fw2, dMean2, null, null, null, masks);
  const dEns = new Float64Array(4); for (let o = 0; o < 4; o++) dEns[o] = ceHv.d[o] * auxW;
  const dRead = new Float64Array(4); for (let o = 0; o < 4; o++) dRead[o] = dEns[o] * g;
  let dg = 0; for (let o = 0; o < 4; o++) dg += dEns[o] * fr.readLogits[o];
  const dsig = dg * g * (1 - g);
  const dBetaGate = dsig * RP.wb.v[0];
  RP.we.g[0] += dsig * Hh; RP.wb.g[0] += dsig * beta; RP.wd.g[0] += dsig * dis; RP.b.g[0] += dsig;
  const dz = dBetaGate * beta * (1 - beta) + 0.5 * (beta - wrong1);
  RP.bc.g[0] += dz;
  for (let i = 0; i < H; i++) RP.Wc.g[i] += dz * fw1.h[i];
  u1ReadBackward(M, MP, fr, dRead);
  const dhC = new Float64Array(H); for (let i = 0; i < H; i++) dhC[i] = dz * RP.Wc.v[i];
  u1SeqBackwardFull(M, fw1, null, null, dEns, dc2, masks);
  u1CriticHBackward(M, fw1, dhC);
  return loss;
}
// Diagonal empirical Fisher on trunk params at current M (call at champion init).
// Own rng stream (60000+seed) — train diet streams untouched. Returns {Fhat, mean, max, topDecileShare}.
async function u14Fisher(G, M, MP, RP, seed, N, masks) {
  const trunk = inSeqParams(M);
  const acc = trunk.map(p => new Float64Array(p.g.length));
  const rng = G.makeRng(60000 + seed);
  for (let n = 0; n < N; n++) {
    u14ZeroAll(G, M, MP, RP);
    u14EpisodeBackward(M, MP, RP, rng, masks, "std");
    for (let pi = 0; pi < trunk.length; pi++) {
      const g = trunk[pi].g, a = acc[pi];
      for (let i = 0; i < g.length; i++) a[i] += g[i] * g[i];
    }
  }
  let total = 0, count = 0, mx = 0;
  for (const a of acc) for (let i = 0; i < a.length; i++) { a[i] /= N; total += a[i]; count++; if (a[i] > mx) mx = a[i]; }
  const mean = total / Math.max(1, count);
  const Fhat = acc.map(a => { const o = new Float64Array(a.length); for (let i = 0; i < a.length; i++) o[i] = a[i] / Math.max(1e-30, mean); return o; });
  // top-decile share of raw Fisher mass
  const flat = [];
  for (const a of acc) for (let i = 0; i < a.length; i++) flat.push(a[i]);
  flat.sort((x, y) => y - x);
  const k = Math.max(1, Math.floor(flat.length / 10));
  let top = 0; for (let i = 0; i < k; i++) top += flat[i];
  return { Fhat, mean, max: mx, topDecileShare: top / Math.max(1e-30, total) };
}
// Gradient-alignment cosine between standard-loss and adapt-loss mean grads at given M (endpoint probe).
// Dedicated diet streams (same distributions as train/eval; no pairing needed for a cosine statistic).
async function u14AlignCos(G, M, MP, RP, seed, masks) {
  const trunk = inSeqParams(M);
  const accS = trunk.map(p => new Float64Array(p.g.length));
  const accA = trunk.map(p => new Float64Array(p.g.length));
  // Dedicated streams (same diet distributions as eval; pairing with eval episodes unnecessary for a cosine statistic).
  for (let n = 0; n < 32; n++) {
    u14ZeroAll(G, M, MP, RP);
    const rng2 = G.makeRng(70000 + seed * 131 + n);
    u14EpisodeBackward(M, MP, RP, rng2, masks, "std");
    for (let pi = 0; pi < trunk.length; pi++) { const g = trunk[pi].g, a = accS[pi]; for (let i = 0; i < g.length; i++) a[i] += g[i] / 32; }
  }
  for (let n = 0; n < 32; n++) {
    u14ZeroAll(G, M, MP, RP);
    const rng2 = G.makeRng(71000 + seed * 131 + n);
    u14EpisodeBackward(M, MP, RP, rng2, masks, "adapt");
    for (let pi = 0; pi < trunk.length; pi++) { const g = trunk[pi].g, a = accA[pi]; for (let i = 0; i < g.length; i++) a[i] += g[i] / 32; }
  }
  let dot = 0, ns = 0, na = 0;
  for (let pi = 0; pi < trunk.length; pi++) {
    const a = accS[pi], b = accA[pi];
    for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; ns += a[i] * a[i]; na += b[i] * b[i]; }
  }
  return dot / Math.max(1e-30, Math.sqrt(ns * na));
}

async function loadU1W6(fs, G, seed) {
  let tr = null;
  try { tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-w-w6-s" + seed + ".json")); }
  catch (e) { tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-w-w6-s" + seed + "-800st.json")); }
  const M = inSeqMakeModel(G.makeRng(1));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(M.E, tr.P.E); load(M.W1, tr.P.W1); load(M.b1, tr.P.b1);
  load(M.Wf, tr.P.Wf); load(M.bf, tr.P.bf); load(M.Wc, tr.P.Wc); load(M.bc, tr.P.bc);
  for (let k = 0; k < 5; k++) { load(M.Wh[k], tr.P.Wh[k]); load(M.bh[k], tr.P.bh[k]); }
  load(M.Hv, tr.P.Hv); load(M.bv, tr.P.bv);
  return M;
}
async function loadU1M2nb(fs, G, seed) {
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-m2-nb-s" + seed + "-800st.json"));
  const MP = m2MakeParams(G.makeRng(2));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(MP.Wq, tr.P.Wq); load(MP.Watt, tr.P.Watt); load(MP.batt, tr.P.batt);
  return MP;
}
function u1MakeParams(rng) {
  const Wc = inParam(rng, 48, 48); const bc = inParam(rng, 1, 48); bc.v[0] = 0;
  const we = inParam(rng, 1, 1); const wb = inParam(rng, 1, 1); const wd = inParam(rng, 1, 1); const b = inParam(rng, 1, 1);
  we.v[0] = 0; wb.v[0] = 0; wd.v[0] = 0; b.v[0] = 0;
  return { Wc, bc, we, wb, wd, b };
}
// Full read backward WITH E grads (unfrozen; m2r2 version discards E by design).
const U1_SQRTD = 3.4641016151377544;
function u1ReadBackward(M, MP, fw, dRead) {
  const D = 12, n = fw.keys.length;
  const dctx = new Float64Array(D);
  for (let o = 0; o < 4; o++) {
    MP.batt.g[o] += dRead[o];
    for (let d = 0; d < D; d++) { MP.Watt.g[o * D + d] += dRead[o] * fw.ctx[d]; dctx[d] += dRead[o] * MP.Watt.v[o * D + d]; }
  }
  const da = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    if (fw.supIds[i].forceZero) { da[i] = 0; continue; }
    let dot = 0; for (let d = 0; d < D; d++) dot += dctx[d] * fw.vals[i].raw[d];
    da[i] = dot;
    for (let d = 0; d < D; d++) M.E.g[fw.supIds[i].vId * D + d] += dctx[d] * fw.a[i];
  }
  let ada = 0; for (let i = 0; i < n; i++) ada += da[i] * fw.a[i];
  const ds = new Float64Array(n);
  for (let i = 0; i < n; i++) ds[i] = fw.a[i] * (da[i] - ada);
  const dq = new Float64Array(D);
  for (let i = 0; i < n; i++) for (let d = 0; d < D; d++) dq[d] += ds[i] * fw.keys[i][d] / U1_SQRTD;
  for (let d = 0; d < D; d++) {
    let s = 0; for (let j = 0; j < D; j++) s += 0; // placeholder (dq already in q-space)
    void s;
  }
  // dq is dL/dq; q = Wq * Eqk → dWq += dq outer Eqk; dEqk = Wq^T dq → into E at qkId
  for (let o = 0; o < D; o++) for (let j = 0; j < D; j++) MP.Wq.g[o * D + j] += dq[o] * fw.Eqk_q[j];
  // NOTE: keys also depend on E (k = E[qkId]); add key grads:
  for (let i = 0; i < n; i++) {
    // ds[i] flows to score sc[i] = q.keys[i]/sqrtD → dkey = ds[i]*q/sqrtD; dval-score via da already in E above
    for (let d = 0; d < D; d++) {
      // q vector recompute not stored; approximate via stored fw.q
      M.E.g[fw.supIds[i].qkId * D + d] += ds[i] * fw.q[d] / U1_SQRTD;
    }
  }
  const dEqk = new Float64Array(D);
  for (let j = 0; j < D; j++) { let s = 0; for (let o = 0; o < D; o++) s += MP.Wq.v[o * D + j] * dq[o]; dEqk[j] = s; }
  // Eqk owner is the query token's qk embedding; accumulate into a scratch holder via first support qk slot is WRONG —
  // correct owner: query qkId not stored in fr. Caller passes EqkQid separately; we stash on fw.
  if (fw.qkId != null) for (let d = 0; d < D; d++) M.E.g[fw.qkId * D + d] += dEqk[d];
}
// Extra h-path for critic beta: dhCritic (length H) backpropagated through silu+W1 into M (E/W1/b1).
function u1CriticHBackward(M, fw, dhC) {
  const { D, LEN, H } = M;
  for (let o = 0; o < H; o++) {
    const sig = 1 / (1 + Math.exp(-fw.hPre[o]));
    const d = dhC[o] * (fw.h[o] + sig * (1 - fw.h[o]));
    M.b1.g[o] += d;
    const off = o * (LEN * D + M.CD);
    for (let i = 0; i < LEN * D + M.CD; i++) { M.W1.g[off + i] += d * fw.inp[i]; }
    // E part of dinp (first LEN*D entries map to token ids)
    for (let t = 0; t < LEN; t++) {
      const id = fw.x[t] >= 0 && fw.x[t] < 10 ? fw.x[t] : 9;
      const ioff = t * D;
      for (let dd = 0; dd < D; dd++) M.E.g[id * D + dd] += d * M.W1.v[off + ioff + dd];
    }
  }
}
function u1SeqBackwardFull(M, fw, dMeanLogits, dHeadList, dHvLogits, dcNew, masks) {
  const { D, CD, H, C, K, LEN } = M;
  const dh = new Float64Array(H);
  if (dHvLogits) {
    for (let o = 0; o < C; o++) {
      M.bv.g[o] += dHvLogits[o];
      const off = o * H;
      for (let i = 0; i < H; i++) { M.Hv.g[off + i] += dHvLogits[o] * fw.h[i]; dh[i] += dHvLogits[o] * M.Hv.v[off + i]; }
    }
  }
  const perHead = dHeadList || [];
  for (let k = 0; k < K; k++) {
    const mask = masks ? masks[k] : null;
    const dLg = new Float64Array(C);
    if (dMeanLogits) for (let o = 0; o < C; o++) dLg[o] += dMeanLogits[o] / K;
    if (perHead[k]) for (let o = 0; o < C; o++) dLg[o] += perHead[k][o];
    for (let o = 0; o < C; o++) {
      M.bh[k].g[o] += dLg[o];
      const off = o * H;
      for (let i = 0; i < H; i++) {
        const hh = mask ? fw.h[i] * mask[i] : fw.h[i];
        M.Wh[k].g[off + i] += dLg[o] * hh;
        dh[i] += dLg[o] * M.Wh[k].v[off + i] * (mask ? mask[i] : 1);
      }
    }
  }
  // carry params + carry->h feedback (full BPTT; v102/intrinsic omit dh-carry by design)
  const dc = dcNew ? dcNew.slice() : new Float64Array(CD);
  const dcOld = new Float64Array(CD);
  const dhCarry = new Float64Array(H);
  for (let o = 0; o < CD; o++) {
    const df = dc[o] * (fw.cOld[o] - fw.cand[o]);
    const dCand = dc[o] * (1 - fw.f[o]);
    dcOld[o] = dc[o] * fw.f[o]; // cOld via inp path added below through dinp
    const dsf = df * fw.f[o] * (1 - fw.f[o]);
    const dsc = dCand * (1 - fw.cand[o] * fw.cand[o]);
    M.bf.g[o] += dsf; M.bc.g[o] += dsc;
    for (let i = 0; i < H; i++) {
      M.Wf.g[o * H + i] += dsf * fw.h[i];
      M.Wc.g[o * H + i] += dsc * fw.h[i];
      dhCarry[i] += dsf * M.Wf.v[o * H + i] + dsc * M.Wc.v[o * H + i];
    }
  }
  for (let i = 0; i < H; i++) dh[i] += dhCarry[i];
  const dinp = new Float64Array(LEN * D + CD);
  for (let o = 0; o < H; o++) {
    const sig = 1 / (1 + Math.exp(-fw.hPre[o]));
    const d = dh[o] * (fw.h[o] + sig * (1 - fw.h[o]));
    M.b1.g[o] += d;
    const off = o * (LEN * D + CD);
    for (let i = 0; i < LEN * D + CD; i++) { M.W1.g[off + i] += d * fw.inp[i]; dinp[i] += d * M.W1.v[off + i]; }
  }
  for (let t = 0; t < LEN; t++) {
    const id = fw.x[t] >= 0 && fw.x[t] < 10 ? fw.x[t] : 9;
    const off = id * D;
    for (let d = 0; d < D; d++) M.E.g[off + d] += dinp[t * D + d];
  }
  const dcOldFromInp = dinp.slice(LEN * D);
  for (let o = 0; o < CD; o++) dcOld[o] += dcOldFromInp[o];
  return dcOld;
}
globalThis.u14GradCheck = async function (fs, log) {
  await globalThis.SelfU14Init(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const rng = G.makeRng(4342);
  const M = inSeqMakeModel(rng);
  const MP = m2MakeParams(G.makeRng(4344));
  const RP = u1MakeParams(G.makeRng(4343));
  const LAMG = 100;
  const trunkG = inSeqParams(M);
  const FISHG = await u14Fisher(G, M, MP, RP, 7, 20, null);
  const TSG = trunkG.map(p => Float64Array.from(p.v));
  const grng = G.makeRng(4345);
  const ep = genAdaptEpisode(grng);
  const e = ep.query, supE = ep.sup;
  const masks = null;
  const sup = supE.map(se => ({ qkId: se.qk, vId: 4 + se.v, forceZero: false }));
  const entropyOf = (hv) => {
    let mx = hv[0]; for (let o = 1; o < 4; o++) if (hv[o] > mx) mx = hv[o];
    let s = 0; const p = new Float64Array(4);
    for (let o = 0; o < 4; o++) { p[o] = Math.exp(hv[o] - mx); s += p[o]; }
    for (let o = 0; o < 4; o++) p[o] /= s;
    let H = 0; for (let o = 0; o < 4; o++) H -= p[o] * Math.log(p[o] + 1e-12);
    return H / Math.log(4);
  };
  const lossFnDetachedNote = "scope: gate-input grads via H/dis detached (filed); vhat/wrong fixed to base (stability skip); beta/hv/read/carry paths exact; EWC penalty exact";
  const f1b = inSeqForward(M, e.x, new Float64Array(8), masks);
  const Eqb = new Float64Array(12); for (let d = 0; d < 12; d++) Eqb[d] = M.E.v[e.qk * 12 + d];
  const frb = m2ReadForward(M, MP, Eqb, sup);
  let zb = RP.bc.v[0]; for (let i = 0; i < 48; i++) zb += RP.Wc.v[i] * f1b.h[i];
  const betab = 1 / (1 + Math.exp(-zb));
  const dis0 = curVoteDisagree(f1b.logitsK);
  const H0 = entropyOf(f1b.hvLog);
  const gb = 1 / (1 + Math.exp(-(RP.we.v[0] * H0 + RP.wb.v[0] * betab + RP.wd.v[0] * dis0 + RP.b.v[0])));
  const ensb = new Float64Array(4); for (let o = 0; o < 4; o++) ensb[o] = f1b.hvLog[o] + gb * frb.readLogits[o];
  let vhat0 = 0; for (let o = 1; o < 4; o++) if (ensb[o] > ensb[vhat0]) vhat0 = o;
  const wrong10 = vhat0 === e.v ? 0 : 1;
  const penOf = () => {
    let pen = 0;
    for (let pi = 0; pi < trunkG.length; pi++) {
      const P = trunkG[pi], F = FISHG.Fhat[pi], T = TSG[pi];
      for (let i = 0; i < P.v.length; i++) { const d = P.v[i] - T[i]; pen += F[i] * d * d; }
    }
    return 0.5 * LAMG * pen;
  };
  const lossFn = () => {
    const f1 = inSeqForward(M, e.x, new Float64Array(8), masks);
    const Eq = new Float64Array(12); for (let d = 0; d < 12; d++) Eq[d] = M.E.v[e.qk * 12 + d];
    const fr = m2ReadForward(M, MP, Eq, sup);
    let z = RP.bc.v[0]; for (let i = 0; i < 48; i++) z += RP.Wc.v[i] * f1.h[i];
    const beta = 1 / (1 + Math.exp(-z));
    const g = 1 / (1 + Math.exp(-(RP.we.v[0] * H0 + RP.wb.v[0] * beta + RP.wd.v[0] * dis0 + RP.b.v[0])));
    const ens = new Float64Array(4); for (let o = 0; o < 4; o++) ens[o] = f1.hvLog[o] + g * fr.readLogits[o];
    const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat0, 8];
    const f2 = inSeqForward(M, x2m, f1.cNew, masks);
    const ce2 = inCELossGrad(inMeanLogits({ logitsK: f2.logitsK }), e.y);
    const ceH = inCELossGrad(ens, e.v);
    return ce2.loss + 0.5 * ceH.loss + 0.5 * (-(wrong10 * Math.log(beta + 1e-12) + (1 - wrong10) * Math.log(1 - beta + 1e-12))) + penOf();
  };
  const allParams = [...inSeqParams(M), MP.Wq, MP.Watt, MP.batt, RP.Wc, RP.bc, RP.we, RP.wb, RP.wd, RP.b];
  for (const p of allParams) p.g.fill(0);
  const f1 = inSeqForward(M, e.x, new Float64Array(8), masks);
  const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = M.E.v[e.qk * 12 + d];
  const fr = m2ReadForward(M, MP, Eqk, sup); fr.qkId = e.qk;
  fr.q = fr.q || null;
  let z = RP.bc.v[0]; for (let i = 0; i < 48; i++) z += RP.Wc.v[i] * f1.h[i];
  const beta = 1 / (1 + Math.exp(-z));
  const dis = curVoteDisagree(f1.logitsK);
  const H = entropyOf(f1.hvLog);
  const g = 1 / (1 + Math.exp(-(RP.we.v[0] * H + RP.wb.v[0] * beta + RP.wd.v[0] * dis + RP.b.v[0])));
  const ensV = new Float64Array(4); for (let o = 0; o < 4; o++) ensV[o] = f1.hvLog[o] + g * fr.readLogits[o];
  const ceHv = inCELossGrad(ensV, e.v);
  let vhat = 0; for (let o = 1; o < 4; o++) if (ensV[o] > ensV[vhat]) vhat = o;
  const wrong1 = vhat === e.v ? 0 : 1;
  const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
  const f2 = inSeqForward(M, x2m, f1.cNew, masks);
  const ce2 = inCELossGrad(inMeanLogits({ logitsK: f2.logitsK }), e.y);
  const dMean2 = new Float64Array(4); for (let o = 0; o < 4; o++) dMean2[o] = ce2.d[o];
  const dc2 = u1SeqBackwardFull(M, f2, dMean2, null, null, null, masks);
  const dEns = new Float64Array(4); for (let o = 0; o < 4; o++) dEns[o] = ceHv.d[o] * 0.5;
  const dRead = new Float64Array(4); for (let o = 0; o < 4; o++) dRead[o] = dEns[o] * g;
  let dg = 0; for (let o = 0; o < 4; o++) dg += dEns[o] * fr.readLogits[o];
  const dsig = dg * g * (1 - g);
  const dBetaGate = dsig * RP.wb.v[0];
  RP.we.g[0] += dsig * H; RP.wb.g[0] += dsig * beta; RP.wd.g[0] += dsig * dis; RP.b.g[0] += dsig;
  const dz = dBetaGate * beta * (1 - beta) + 0.5 * (beta - wrong1);
  RP.bc.g[0] += dz;
  for (let i = 0; i < 48; i++) RP.Wc.g[i] += dz * f1.h[i];
  u1ReadBackward(M, MP, fr, dRead);
  const dhC = new Float64Array(48); for (let i = 0; i < 48; i++) dhC[i] = dz * RP.Wc.v[i];
  u1SeqBackwardFull(M, f1, null, null, dEns, dc2, masks);
  u1CriticHBackward(M, f1, dhC);
  for (let pi = 0; pi < trunkG.length; pi++) {
    const P = trunkG[pi], F = FISHG.Fhat[pi], T = TSG[pi];
    for (let i = 0; i < P.g.length; i++) P.g[i] += LAMG * F[i] * (P.v[i] - T[i]);
  }
  const eps = 1e-6;
  let worst = 0, worstWhere = "";
  const checkParam = (P, name) => {
    for (let i = 0; i < Math.min(P.v.length, 8); i++) {
      P.v[i] += eps; const a1 = lossFn();
      // NOTE (U1-filed): vhat-stability heuristic — numeric and analytic share the fixed-vhat scope.
      P.v[i] -= 2 * eps; const a0 = lossFn();
      P.v[i] += eps;
      const num = (a1 - a0) / (2 * eps), an = P.g[i];
      const denom = Math.max(1e-12, Math.abs(num) + Math.abs(an));
      const rel = Math.abs(num - an) / denom;
      if (Math.abs(num) < 1e-9 && Math.abs(an) < 1e-9) continue;
      if (rel > worst) { worst = rel; worstWhere = name + "[" + i + "] num=" + num + " an=" + an; }
    }
  };
  checkParam(RP.we, "we"); checkParam(RP.wb, "wb"); checkParam(RP.wd, "wd"); checkParam(RP.b, "b");
  checkParam(RP.Wc, "Wc"); checkParam(MP.Wq, "Wq"); checkParam(MP.Watt, "Watt");
  checkParam(M.W1, "W1"); checkParam(M.E, "E"); checkParam(M.Hv, "Hv");
  log("u14-gradcheck worstRel=" + worst.toExponential(2) + " at " + worstWhere + " fisherMean=" + FISHG.mean.toExponential(2) + " fisherMax=" + FISHG.max.toExponential(2));
  return { worstRel: worst, worstWhere, fisherMean: FISHG.mean, fisherMax: FISHG.max };
};
globalThis.runU14Train = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const steps = 800, B = 16, lr = 5e-3, K = 5, H = 48, C = 6, auxW = 0.5;
  const tag = arm + "-s" + seed + "-" + steps + "st";
  const ledgerPath = "src/evidence/decomp/d-newai-self-" + tag + ".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  await globalThis.SelfU14Init(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const M = await loadU1W6(fs, G, seed);
  const MP = await loadU1M2nb(fs, G, seed);
  const RP = u1MakeParams(G.makeRng(75000 + seed * 7919 + u14ArmCode(arm) * 131));
  const allParams = [...inSeqParams(M), MP.Wq, MP.Watt, MP.batt, RP.Wc, RP.bc, RP.we, RP.wb, RP.wd, RP.b];
  const opt = new G.Adam(lr);
  const dataRng = G.makeRng(42000 + seed * 104729 + 55);
  let fixedMasks = null; { const fr = G.makeRng(91000 + seed); fixedMasks = []; for (let k = 0; k < K; k++) { const m = new Float64Array(H); for (let i = 0; i < H; i++) m[i] = fr.int(10) < 5 ? 2 : 0; fixedMasks.push(m); } }
  const entropyOf = (hv) => {
    let mx = hv[0]; for (let o = 1; o < 4; o++) if (hv[o] > mx) mx = hv[o];
    let s = 0; const p = new Float64Array(4);
    for (let o = 0; o < 4; o++) { p[o] = Math.exp(hv[o] - mx); s += p[o]; }
    for (let o = 0; o < 4; o++) p[o] /= s;
    let Hh = 0; for (let o = 0; o < 4; o++) Hh -= p[o] * Math.log(p[o] + 1e-12);
    return Hh / Math.log(4);
  };
  const isEwc = (arm === "u14-ewc");
  const LAM = 100, FISHERN = 400;
  const trunkParams = inSeqParams(M);
  const FISH = await u14Fisher(G, M, MP, RP, seed, FISHERN, fixedMasks);
  const thetaStar = trunkParams.map(p => Float64Array.from(p.v));
  const Fhat = FISH.Fhat;
  const FSTAT = { lambda: LAM, n: FISHERN, mean: FISH.mean, max: FISH.max, topDecileShare: +FISH.topDecileShare.toFixed(4) };
  log("u14-fisher s" + seed + " mean=" + FISH.mean.toExponential(2) + " max=" + FISH.max.toExponential(2) + " topDec=" + FSTAT.topDecileShare);
  const t0 = Date.now(), curve = [];
  const curvePen = [];
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  const isFlat = false; // U14 gate path only (flat control answered in U1)
  for (let step = 0; step < steps; step++) {
    for (const p of allParams) p.g.fill(0);
    let lsum = 0;
    for (let b = 0; b < B; b++) {
      const isAdapt = dataRng.int(2) === 1;
      let e, sup;
      if (!isAdapt) {
        const cands = [];
        for (let c = 0; c < C; c++) { const ub = dataRng.int(2) === 0; cands.push(ub ? inSeqGenShift(dataRng, 0) : inSeqGenShift(dataRng, null)); }
        let pk = 0, best = -1;
        for (let c = 0; c < C; c++) {
          const fw = inSeqForward(M, cands[c].x, new Float64Array(8), fixedMasks);
          const d = curVoteDisagree(fw.logitsK);
          if (d > best) { best = d; pk = c; }
        }
        e = cands[pk];
        const supE = [inSeqGenShift(dataRng, null), inSeqGenShift(dataRng, null), inSeqGenShift(dataRng, null), inSeqGenShift(dataRng, null)];
        sup = supE.map(se => ({ qkId: se.qk, vId: 4 + se.v, forceZero: false }));
      } else {
        const ep = genAdaptEpisode(dataRng);
        e = ep.query;
        sup = ep.sup.map(se => ({ qkId: se.qk, vId: 4 + se.v, forceZero: false }));
      }
      const fw1 = inSeqForward(M, e.x, new Float64Array(8), fixedMasks);
      const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = M.E.v[e.qk * 12 + d];
      const fr = m2ReadForward(M, MP, Eqk, sup); fr.qkId = e.qk;
      let z = RP.bc.v[0]; for (let i = 0; i < H; i++) z += RP.Wc.v[i] * fw1.h[i];
      const beta = 1 / (1 + Math.exp(-z));
      const dis = curVoteDisagree(fw1.logitsK);
      const Hh = entropyOf(fw1.hvLog);
      const g = isFlat ? 0 : 1 / (1 + Math.exp(-(RP.we.v[0] * Hh + RP.wb.v[0] * beta + RP.wd.v[0] * dis + RP.b.v[0])));
      const ensV = new Float64Array(4); for (let o = 0; o < 4; o++) ensV[o] = fw1.hvLog[o] + g * fr.readLogits[o];
      const ceHv = inCELossGrad(ensV, e.v);
      const vhat = argmax4(ensV);
      const wrong1 = vhat === e.v ? 0 : 1;
      const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
      const fw2 = inSeqForward(M, x2m, fw1.cNew, fixedMasks);
      const mean2 = inMeanLogits({ logitsK: fw2.logitsK });
      const ce2 = inCELossGrad(mean2, e.y);
      lsum += ce2.loss + auxW * ceHv.loss + 0.5 * (-(wrong1 * Math.log(beta + 1e-12) + (1 - wrong1) * Math.log(1 - beta + 1e-12)));
      const dMean2 = new Float64Array(4); for (let o = 0; o < 4; o++) dMean2[o] = ce2.d[o] / B;
      const dc2 = u1SeqBackwardFull(M, fw2, dMean2, null, null, null, fixedMasks);
      const dEns = new Float64Array(4); for (let o = 0; o < 4; o++) dEns[o] = ceHv.d[o] * auxW / B;
      const dRead = new Float64Array(4); for (let o = 0; o < 4; o++) dRead[o] = dEns[o] * g;
      if (!isFlat) {
        let dg = 0; for (let o = 0; o < 4; o++) dg += dEns[o] * fr.readLogits[o];
        const dsig = dg * g * (1 - g);
        const dBetaGate = dsig * RP.wb.v[0];
        RP.we.g[0] += dsig * Hh; RP.wb.g[0] += dsig * beta; RP.wd.g[0] += dsig * dis; RP.b.g[0] += dsig;
        const dz = dBetaGate * beta * (1 - beta) + 0.5 * (beta - wrong1) / B;
        RP.bc.g[0] += dz;
        for (let i = 0; i < H; i++) RP.Wc.g[i] += dz * fw1.h[i];
        u1ReadBackward(M, MP, fr, dRead);
        const dhC = new Float64Array(H); for (let i = 0; i < H; i++) dhC[i] = dz * RP.Wc.v[i];
        u1SeqBackwardFull(M, fw1, null, null, dEns, dc2, fixedMasks);
        u1CriticHBackward(M, fw1, dhC);
      } else {
        const dz = 0.5 * (beta - wrong1) / B;
        RP.bc.g[0] += dz;
        for (let i = 0; i < H; i++) RP.Wc.g[i] += dz * fw1.h[i];
        // flat: no read grad (g=0, read detached); still learn compose+carry via fw2 path already done (dc2 discarded for fw1? need fw1 hv+carry grads from compose only)
        // hv target still trains trunk retrieval flat-only: dEns flows to hv
        u1SeqBackwardFull(M, fw1, null, null, dEns, dc2, fixedMasks);
        const dhC = new Float64Array(H); for (let i = 0; i < H; i++) dhC[i] = dz * RP.Wc.v[i];
        u1CriticHBackward(M, fw1, dhC);
      }
      void fw1; void fw2; void fr;
    }
    if (isEwc) { for (let pi = 0; pi < trunkParams.length; pi++) { const P = trunkParams[pi], F = Fhat[pi], T = thetaStar[pi]; for (let i = 0; i < P.g.length; i++) P.g[i] += LAM * F[i] * (P.v[i] - T[i]); } }
    let s = 0; for (const p of allParams) for (let i = 0; i < p.g.length; i++) s += p.g[i] * p.g[i];
    const n = Math.sqrt(s); if (n > 1.0) { const sc = 1.0 / n; for (const p of allParams) for (let i = 0; i < p.g.length; i++) p.g[i] *= sc; }
    opt.step(allParams);
    if (step % 100 === 0 || step === steps - 1) { let pen = 0; for (let pi = 0; pi < trunkParams.length; pi++) { const P = trunkParams[pi], F = Fhat[pi], T = thetaStar[pi]; for (let i = 0; i < P.g.length; i++) { const d = P.v[i] - T[i]; pen += F[i] * d * d; } } pen = LAM * 0.5 * pen; curvePen.push({ step, pen: +pen.toFixed(6), ratio: +((pen / Math.max(1e-12, lsum / B))).toFixed(4) }); curve.push({ step, loss: +(lsum / B).toFixed(6) }); }
  }
  const save = (o) => Array.from(o.v);
  const body = { spec: "self-u14-ewc-prereg", track: "U14", arm, seed, steps, B, lr, initTrunk: "W6-s" + seed, initNotebook: "M2-nb-s" + seed, unfrozen: true, ewc: isEwc, fisher: FSTAT, verdict: "COMPLETE", wallMs: Date.now() - t0, curve, curvePen,
    P: { E: save(M.E), W1: save(M.W1), b1: save(M.b1), Wf: save(M.Wf), bf: save(M.bf), Wc: save(M.Wc), bc: save(M.bc), Wh: M.Wh.map(save), bh: M.bh.map(save), Hv: save(M.Hv), bv: save(M.bv),
      Wq: save(MP.Wq), Watt: save(MP.Watt), batt: save(MP.batt),
      cWc: save(RP.Wc), cbc: save(RP.bc), we: save(RP.we), wb: save(RP.wb), wd: save(RP.wd), b: save(RP.b) } };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("u14-train " + tag + " loss0=" + curve[0].loss + " lossN=" + curve[curve.length - 1].loss);
  return body;
};
globalThis.runU14Eval = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const steps = 800, N = 200;
  const tag = arm + "-s" + seed + "-" + steps + "st";
  const ledgerPath = "src/evidence/decomp/d-newai-self-eval-" + tag + ".json";
  const force = opts && opts.force;
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE" && !force) { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  await globalThis.SelfU14Init(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-" + tag + ".json"));
  const M = inSeqMakeModel(G.makeRng(2));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(M.E, tr.P.E); load(M.W1, tr.P.W1); load(M.b1, tr.P.b1);
  load(M.Wf, tr.P.Wf); load(M.bf, tr.P.bf); load(M.Wc, tr.P.Wc); load(M.bc, tr.P.bc);
  for (let k = 0; k < 5; k++) { load(M.Wh[k], tr.P.Wh[k]); load(M.bh[k], tr.P.bh[k]); }
  load(M.Hv, tr.P.Hv); load(M.bv, tr.P.bv);
  const MP = m2MakeParams(G.makeRng(3));
  load(MP.Wq, tr.P.Wq); load(MP.Watt, tr.P.Watt); load(MP.batt, tr.P.batt);
  const RP = u1MakeParams(G.makeRng(4));
  load(RP.Wc, tr.P.cWc); load(RP.bc, tr.P.cbc); load(RP.we, tr.P.we); load(RP.wb, tr.P.wb); load(RP.wd, tr.P.wd); load(RP.b, tr.P.b);
  let evalMasks = null; { const fr2 = G.makeRng(91000 + seed); evalMasks = []; for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr2.int(10) < 5 ? 2 : 0; evalMasks.push(m); } }
  const entropyOf = (hv) => {
    let mx = hv[0]; for (let o = 1; o < 4; o++) if (hv[o] > mx) mx = hv[o];
    let s = 0; const p = new Float64Array(4);
    for (let o = 0; o < 4; o++) { p[o] = Math.exp(hv[o] - mx); s += p[o]; }
    for (let o = 0; o < 4; o++) p[o] /= s;
    let Hh = 0; for (let o = 0; o < 4; o++) Hh -= p[o] * Math.log(p[o] + 1e-12);
    return Hh / Math.log(4);
  };
  const argmax4 = (a) => { let b = 0; for (let i = 0; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  const srng = G.makeRng(52500 + seed);
  let scr = 0, two = 0;
  const supRng = G.makeRng(42000 + seed * 104729 + 999);
  for (let i = 0; i < N; i++) {
    const e = inSeqGenShift(srng, null);
    const supE = [inSeqGenShift(supRng, null), inSeqGenShift(supRng, null), inSeqGenShift(supRng, null), inSeqGenShift(supRng, null)];
    const sup = supE.map(se => ({ qkId: se.qk, vId: 4 + se.v, forceZero: false }));
    const fw1 = inSeqForward(M, e.x, new Float64Array(8), evalMasks);
    const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = M.E.v[e.qk * 12 + d];
    const fr = m2ReadForward(M, MP, Eqk, sup);
    let z = RP.bc.v[0]; for (let j = 0; j < 48; j++) z += RP.Wc.v[j] * fw1.h[j];
    const beta = 1 / (1 + Math.exp(-z));
    const dis = curVoteDisagree(fw1.logitsK);
    const Hh = entropyOf(fw1.hvLog);
    const g = 1 / (1 + Math.exp(-(RP.we.v[0] * Hh + RP.wb.v[0] * beta + RP.wd.v[0] * dis + RP.b.v[0])));
    const ensV = new Float64Array(4); for (let o = 0; o < 4; o++) ensV[o] = fw1.hvLog[o] + g * fr.readLogits[o];
    if (argmax4(ensV) === e.v) scr++;
    const vhat = argmax4(ensV);
    const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
    const fw2 = inSeqForward(M, x2m, fw1.cNew, evalMasks);
    if (argmax4(inMeanLogits({ logitsK: fw2.logitsK })) === e.y) two++;
  }
  const arng = G.makeRng(61000 + seed);
  let adaptY = 0, adaptV = 0, gAdapt = 0, gStd = 0, gWrong = 0, gRight = 0, nW = 0, nR = 0;
  for (let i = 0; i < N; i++) {
    const ep = genAdaptEpisode(arng);
    const sup = ep.sup.map(se => ({ qkId: se.qk, vId: 4 + se.v, forceZero: false }));
    const e = ep.query;
    const fw1 = inSeqForward(M, e.x, new Float64Array(8), evalMasks);
    const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = M.E.v[e.qk * 12 + d];
    const fr = m2ReadForward(M, MP, Eqk, sup);
    let z = RP.bc.v[0]; for (let j = 0; j < 48; j++) z += RP.Wc.v[j] * fw1.h[j];
    const beta = 1 / (1 + Math.exp(-z));
    const dis = curVoteDisagree(fw1.logitsK);
    const Hh = entropyOf(fw1.hvLog);
    const g = 1 / (1 + Math.exp(-(RP.we.v[0] * Hh + RP.wb.v[0] * beta + RP.wd.v[0] * dis + RP.b.v[0])));
    gAdapt += g;
    const ensV = new Float64Array(4); for (let o = 0; o < 4; o++) ensV[o] = fw1.hvLog[o] + g * fr.readLogits[o];
    const vhat = argmax4(ensV);
    if (vhat === e.v) adaptV++;
    if (vhat === e.v) { gRight += g; nR++; } else { gWrong += g; nW++; }
    const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
    const fw2 = inSeqForward(M, x2m, fw1.cNew, evalMasks);
    if (argmax4(inMeanLogits({ logitsK: fw2.logitsK })) === e.y) adaptY++;
  }
  const srng2 = G.makeRng(52501 + seed);
  const supRng2 = G.makeRng(42001 + seed * 104729 + 999);
  for (let i = 0; i < N; i++) {
    const e = inSeqGenShift(srng2, null);
    const supE = [inSeqGenShift(supRng2, null), inSeqGenShift(supRng2, null), inSeqGenShift(supRng2, null), inSeqGenShift(supRng2, null)];
    const sup = supE.map(se => ({ qkId: se.qk, vId: 4 + se.v, forceZero: false }));
    const fw1 = inSeqForward(M, e.x, new Float64Array(8), evalMasks);
    const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = M.E.v[e.qk * 12 + d];
    const fr = m2ReadForward(M, MP, Eqk, sup);
    void fr;
    let z = RP.bc.v[0]; for (let j = 0; j < 48; j++) z += RP.Wc.v[j] * fw1.h[j];
    const beta = 1 / (1 + Math.exp(-z));
    const dis = curVoteDisagree(fw1.logitsK);
    const Hh = entropyOf(fw1.hvLog);
    const g = 1 / (1 + Math.exp(-(RP.we.v[0] * Hh + RP.wb.v[0] * beta + RP.wd.v[0] * dis + RP.b.v[0])));
    gStd += g;
  }
  // EWC mechanism reports: rebuild champion-init triple, recompute Fisher identically, drift + alignment at endpoint.
  const M0 = await loadU1W6(fs, G, seed);
  const MP0 = await loadU1M2nb(fs, G, seed);
  const RP0 = u1MakeParams(G.makeRng(75000 + seed * 7919 + u14ArmCode(arm) * 131));
  let fixedMasks0 = null; { const fr = G.makeRng(91000 + seed); fixedMasks0 = []; for (let k = 0; k < 5; k++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr.int(10) < 5 ? 2 : 0; fixedMasks0.push(m); } }
  const FISH0 = await u14Fisher(G, M0, MP0, RP0, seed, 400, fixedMasks0);
  const trunkE = inSeqParams(M);
  const trunk0 = inSeqParams(M0);
  let driftF = 0, driftU = 0, cnt = 0;
  for (let pi = 0; pi < trunkE.length; pi++) {
    const P = trunkE[pi], T = trunk0[pi], F = FISH0.Fhat[pi];
    for (let i = 0; i < P.v.length; i++) { const d = P.v[i] - T.v[i]; driftF += F[i] * d * d; driftU += d * d; cnt++; }
  }
  driftF /= Math.max(1, cnt); driftU /= Math.max(1, cnt);
  const alignCos = await u14AlignCos(G, M, MP, RP, seed, evalMasks);
  const body = { spec: "self-u14-ewc-prereg", track: "U14", arm, seed, steps, verdict: "COMPLETE", n: N, unfrozen: true, ewc: (arm === "u14-ewc"),
    accScratch: +(scr / N).toFixed(4), accTwo: +(two / N).toFixed(4), adaptY: +(adaptY / N).toFixed(4), adaptV: +(adaptV / N).toFixed(4),
    meanGateAdapt: +(gAdapt / N).toFixed(4), meanGateStd: +(gStd / N).toFixed(4),
    meanGateWrong1: +(nW ? gWrong / nW : 0).toFixed(4), meanGateRight1: +(nR ? gRight / nR : 0).toFixed(4),
    gateWeights: { we: +RP.we.v[0].toFixed(4), wb: +RP.wb.v[0].toFixed(4), wd: +RP.wd.v[0].toFixed(4), b: +RP.b.v[0].toFixed(4) },
    driftFwt: +driftF.toExponential(4), driftUnwt: +driftU.toExponential(4), alignCos: +alignCos.toFixed(4),
    fisherMean: FISH0.mean, fisherMax: FISH0.max, fisherTopDecile: +FISH0.topDecileShare.toFixed(4),
    penRatioTrain: tr.curvePen ? tr.curvePen[tr.curvePen.length - 1].ratio : null };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("u14-eval " + tag + " adaptY=" + body.adaptY + " adaptV=" + body.adaptV + " two=" + body.accTwo + " driftF=" + body.driftFwt + " align=" + body.alignCos);
  return body;
};
