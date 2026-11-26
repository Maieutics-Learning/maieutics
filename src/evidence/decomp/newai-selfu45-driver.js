// newai-selfu45-driver.js — U45 gate with explicit mismatch features (input-side fix).
//
// Countersign: Turn-186 user "go ahead and run those" = full-pipeline cover
// (prereg + battery + compute) for owed items U44/U45/dust. CPU/in-worker. NO PUSH.
// Prereg self-u45-gateinput-prereg.md v1.1 (pins P1a-P1c + P1a-amendment, no bar changes).
// Battery fresh-eyes-self-u45-3x-results.md (R1 IMPLEMENTABLE + R2/R3 NEEDS-PATCH).
//
// Stack: pinned U33 (stackHash 258d2f06…), H48, 800st, B16/lr5e-3/K5/C6/auxW0.5/lam2.0.
// Diet: U38 D1 mismatch diet VERBATIM (copied as u45PickDiet; rolls int(8): 0-3 base
// pick-max 50%, 4-5 OOD pick-max 25%, 6 uniform-pick 12.5%, 7 mismatch 12.5% donor).
// Arms: old (u38 20-dim gate verbatim), new (25-dim: 20 + F[5]), open (g=1).
// F (no labels, from round-1 forward): f1 hv-entropy, f2 vote-disagree (STOP-GRAD
// holder — vote-count piecewise-constant, P1a-amendment), f3 prob-margin top1-top2,
// f4 ||cNew||, f5 cos(E[qk],E[vhat+4]). first-order grads: f1+f3 augment dHv (hvLog
// path), f4 augments carry-input path, f5 adds E embedding grads (P1a). Gate weights
// trainable (Adam, zeros init); eval frozen from ledger (P1a — H3 void at eval).
// Wave 0: isolated feature-path gradcheck (FD <=1e-5) + twins per arm. Floor: new two
// < 0.45 on >=2 seeds -> INCONCLUSIVE. PIN fail -> HALT.
//
// RUN (execute_js, fs in scope):
//   const src = await fs.readTextFile("src/evidence/decomp/newai-selfu45-driver.js");
//   (0, eval)(src + "\n//# sourceURL=newai-selfu45-driver.js");
//   await globalThis.SelfU45Init(fs);
//   const log = (m) => console.log(m);
//   await globalThis.runU45Wave0(fs, log);
//   await globalThis.runU45Train(fs, log, {seed:0, arm:"new"});
//   await globalThis.runU45Eval(fs, log, {seed:0, arm:"new"});
//   await globalThis.runU45Verdict(fs, log);
globalThis.SelfU45Init = async function (fs) {
  const src = await fs.readTextFile("src/evidence/decomp/newai-selfu38-driver.js");
  (0, eval)(src + "\n//# sourceURL=newai-selfu38-driver.js");
  await globalThis.SelfU38Init(fs);
  if (typeof globalThis.u38GateFwd !== "function") throw new Error("u45 stack load failed");
};
const U45_EXPECT_STACK = "258d2f060684ce382778e203959ab791abb5df79af174deef19ff568886d4d6e";
const U45_ARMS = { old: 51, new: 52, open: 53 };
function u45TrainPath(seed, arm) { return "src/evidence/decomp/d-newai-self-u45-" + arm + "-s" + seed + "-800st.json"; }
function u45EvalPath(seed, arm) { return "src/evidence/decomp/d-newai-self-u45-eval-" + arm + "-s" + seed + "-800st.json"; }
const U45_VERDICT_PATH = "src/evidence/decomp/d-newai-self-u45-verdict.json";
const U45_WAVE0_PATH = "src/evidence/decomp/d-newai-self-u45-wave0.json";
function u45Sig(s) { return 1 / (1 + Math.exp(-s)); }
function u45MakeGate(dim) { return { w: { v: new Float64Array(dim), g: new Float64Array(dim) }, b: { v: new Float64Array([0]), g: new Float64Array(1) } }; }
function u45SnapGate(gate) { return { w: Array.from(gate.w.v), b: Array.from(gate.b.v) }; }
function u45LoadGate(gate, snap) { for (let i = 0; i < gate.w.v.length; i++) gate.w.v[i] = snap.w[i]; gate.b.v[0] = snap.b[0]; }
// Diet pick (u38 D1 VERBATIM). Returns {eA, eB|null, mismatch}.
function u45PickDiet(M, dataRng, fixedMasks) {
  const C = 6;
  const roll = dataRng.int(8);
  if (roll === 7) {
    const mk = () => { const ub = dataRng.int(2) === 0; return ub ? inSeqGenShift(dataRng, 0) : inSeqGenShift(dataRng, null); };
    return { eA: mk(), eB: mk(), mismatch: true };
  }
  if (roll === 6) {
    const cands = [];
    for (let c = 0; c < C; c++) { const ub = dataRng.int(2) === 0; cands.push(ub ? inSeqGenShift(dataRng, 0) : inSeqGenShift(dataRng, null)); }
    return { eA: cands[dataRng.int(C)], eB: null, mismatch: false };
  }
  const cands = [];
  for (let c = 0; c < C; c++) {
    let e = null;
    if (roll >= 4) {
      for (let t = 0; t < 10; t++) {
        const ub = dataRng.int(2) === 0;
        const cand = ub ? inSeqGenShift(dataRng, 0) : inSeqGenShift(dataRng, null);
        e = cand;
        if (cand.qk !== cand.v) break;
      }
    } else {
      const ub = dataRng.int(2) === 0;
      e = ub ? inSeqGenShift(dataRng, 0) : inSeqGenShift(dataRng, null);
    }
    cands.push(e);
  }
  let pk = 0, best = -1;
  for (let c = 0; c < C; c++) {
    const fw = inSeqForward(M, cands[c].x, new Float64Array(8), fixedMasks);
    const d = curVoteDisagree(fw.logitsK);
    if (d > best) { best = d; pk = c; }
  }
  return { eA: cands[pk], eB: null, mismatch: false };
}
// Explicit mismatch features from the round-1 forward (NO labels).
function u45Feats(M, fw1, qk, cCtx) {
  const hv = Array.from(fw1.hvLog);
  let mx = hv[0]; for (let o = 1; o < 4; o++) if (hv[o] > mx) mx = hv[o];
  const p = [0, 0, 0, 0]; let s = 0;
  for (let o = 0; o < 4; o++) { p[o] = Math.exp(hv[o] - mx); s += p[o]; }
  for (let o = 0; o < 4; o++) p[o] /= s;
  let H = 0; for (let o = 0; o < 4; o++) H -= p[o] * Math.log(p[o] + 1e-12);
  let a = 0; for (let o = 1; o < 4; o++) if (p[o] > p[a]) a = o;
  let b = a === 0 ? 1 : 0; for (let o = 0; o < 4; o++) if (o !== a && p[o] > p[b]) b = o;
  const m = p[a] - p[b];
  const d = curVoteDisagree(fw1.logitsK); // holder (piecewise-constant)
  let n2 = 0; for (let i = 0; i < 8; i++) n2 += cCtx[i] * cCtx[i];
  const n = Math.sqrt(n2);
  let vhat = 0; for (let o = 1; o < 4; o++) if (hv[o] > hv[vhat]) vhat = o;
  let dot = 0, n1 = 0, nb2 = 0;
  for (let i = 0; i < 12; i++) {
    const av = M.E.v[qk * 12 + i], bv = M.E.v[(vhat + 4) * 12 + i];
    dot += av * bv; n1 += av * av; nb2 += bv * bv;
  }
  n1 = Math.sqrt(n1); nb2 = Math.sqrt(nb2);
  const cos = (n1 > 1e-12 && nb2 > 1e-12) ? dot / (n1 * nb2) : 0;
  return { p, H, m, a, b, d, n, cos, vhat, n1, nb2 };
}
function u45GateFwd(M, gate, qk, cNew, F) {
  const dim = gate.w.v.length;
  const inp = new Float64Array(dim);
  for (let d = 0; d < 12; d++) inp[d] = M.E.v[qk * 12 + d];
  for (let d = 0; d < 8; d++) inp[12 + d] = cNew[d];
  if (dim > 20) { inp[20] = F.H; inp[21] = F.d; inp[22] = F.m; inp[23] = F.n; inp[24] = F.cos; }
  let ss = gate.b.v[0];
  for (let i = 0; i < dim; i++) ss += gate.w.v[i] * inp[i];
  return { inp, s: ss, g: u45Sig(ss) };
}
// Production step. useGate=false (open): g=1. dim 20 (old) | 25 (new).
function u45TrainOneStep(M, params, gate, opt, dataRng, fixedMasks, useGate, wantFeats) {
  const B = 16, auxW = 0.5, lam = 2.0, K = 5;
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  let lsum = 0;
  for (let b = 0; b < B; b++) {
    const { eA, eB, mismatch } = u45PickDiet(M, dataRng, fixedMasks);
    const e = eA;
    const fw1 = inSeqForward(M, e.x, new Float64Array(8), fixedMasks);
    const ceHv = inCELossGrad(fw1.hvLog, e.v);
    const dHv = new Float64Array(4); for (let o = 0; o < 4; o++) dHv[o] = ceHv.d[o] * auxW / B;
    const vhat = argmax4(fw1.hvLog);
    let cCtx, gInfo, F = null;
    if (mismatch) {
      const fwB = inSeqForward(M, eB.x, new Float64Array(8), fixedMasks);
      cCtx = fwB.cNew;
      if (useGate) {
        F = wantFeats ? u45Feats(M, fw1, e.qk, cCtx) : null;
        gInfo = u45GateFwd(M, gate, e.qk, cCtx, F);
        gInfo.fwB = fwB;
      } else gInfo = { g: 1, fwB };
    } else {
      cCtx = fw1.cNew;
      if (useGate) {
        F = wantFeats ? u45Feats(M, fw1, e.qk, cCtx) : null;
        gInfo = u45GateFwd(M, gate, e.qk, cCtx, F);
      } else gInfo = { g: 1 };
    }
    const g = gInfo.g;
    const cGated = new Float64Array(8);
    for (let d = 0; d < 8; d++) cGated[d] = g * cCtx[d];
    const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
    const fw2 = inSeqForward(M, x2m, cGated, fixedMasks);
    const perHead1 = fw1.logitsK.map((lg, k) => {
      if ((b % K) !== k) return new Float64Array(4);
      const ce = inCELossGrad(lg, e.y); const dd = new Float64Array(4);
      for (let o = 0; o < 4; o++) dd[o] = ce.d[o] * 0.1 * K / B;
      return dd;
    });
    const perHead2 = fw2.logitsK.map((lg, k) => {
      if ((b % K) !== k) return new Float64Array(4);
      const ce = inCELossGrad(lg, e.y); const dd = new Float64Array(4);
      for (let o = 0; o < 4; o++) dd[o] = ce.d[o] * 0.1 * K / B;
      return dd;
    });
    const mean2 = inMeanLogits({ logitsK: fw2.logitsK });
    const ce2 = inCELossGrad(mean2, e.y);
    const dMean2 = new Float64Array(4); for (let o = 0; o < 4; o++) dMean2[o] = ce2.d[o] / B;
    const mean1 = inMeanLogits({ logitsK: fw1.logitsK });
    const ce1m = inCELossGrad(mean1, e.y);
    const dMean1 = new Float64Array(4); for (let o = 0; o < 4; o++) dMean1[o] = ce1m.d[o] * 0.3 / B;
    lsum += ce2.loss + auxW * ceHv.loss;
    const dcGated = inSeqBackward(M, fw2, dMean2, perHead2, null, null, fixedMasks);
    if (useGate) {
      let dot = 0;
      for (let d = 0; d < 8; d++) dot += dcGated[d] * cCtx[d];
      const dLds = dot * g * (1 - g);
      const dim = gate.w.v.length;
      for (let i = 0; i < dim; i++) gate.w.g[i] += dLds * gInfo.inp[i] / B;
      gate.b.g[0] += dLds / B;
      for (let d = 0; d < 12; d++) M.E.g[e.qk * 12 + d] += dLds * gate.w.v[d] / B;
      // Feature-path grads (P1a; f2 holder).
      let dhExtra = null, carryExtra = null, eExtraQk = null, eExtraVh = null, vhRow = -1;
      if (wantFeats && F) {
        const w20 = gate.w.v[20], w22 = gate.w.v[22], w23 = gate.w.v[23], w24 = gate.w.v[24];
        dhExtra = new Float64Array(4);
        for (let o = 0; o < 4; o++) {
          const ent = -F.p[o] * (Math.log(F.p[o] + 1e-12) + F.H);
          const mar = F.p[F.a] * ((o === F.a ? 1 : 0) - F.p[o]) - F.p[F.b] * ((o === F.b ? 1 : 0) - F.p[o]);
          dhExtra[o] = dLds * (w20 * ent + w22 * mar) / B;
        }
        for (let o = 0; o < 4; o++) dHv[o] += dhExtra[o];
        carryExtra = new Float64Array(8);
        if (F.n > 1e-12) for (let d = 0; d < 8; d++) carryExtra[d] = dLds * w23 * cCtx[d] / (F.n * B);
        vhRow = F.vhat + 4;
        if (F.n1 > 1e-12 && F.nb2 > 1e-12) {
          const dd = dLds * w24 / B, denom = F.n1 * F.nb2;
          eExtraQk = new Float64Array(12); eExtraVh = new Float64Array(12);
          for (let i = 0; i < 12; i++) {
            const av = M.E.v[e.qk * 12 + i], bv = M.E.v[vhRow * 12 + i];
            eExtraQk[i] = dd * (bv / denom - F.cos * av / (F.n1 * F.n1));
            eExtraVh[i] = dd * (av / denom - F.cos * bv / (F.nb2 * F.nb2));
          }
          for (let i = 0; i < 12; i++) {
            M.E.g[e.qk * 12 + i] += eExtraQk[i];
            M.E.g[vhRow * 12 + i] += eExtraVh[i];
          }
        }
      }
      const dcTot = new Float64Array(8);
      for (let d = 0; d < 8; d++) dcTot[d] = (g * dcGated[d] + dLds * gate.w.v[12 + d]) / B + (carryExtra ? carryExtra[d] : 0);
      if (mismatch) {
        inSeqBackward(M, gInfo.fwB, null, null, null, dcTot, fixedMasks);
        inSeqBackward(M, fw1, dMean1, perHead1, dHv, null, fixedMasks);
      } else {
        inSeqBackward(M, fw1, dMean1, perHead1, dHv, dcTot, fixedMasks);
      }
    } else {
      if (mismatch) {
        const dcB = new Float64Array(8);
        for (let d = 0; d < 8; d++) dcB[d] = dcGated[d] / B;
        inSeqBackward(M, gInfo.fwB, null, null, null, dcB, fixedMasks);
        inSeqBackward(M, fw1, dMean1, perHead1, dHv, null, fixedMasks);
      } else {
        const dcC = new Float64Array(8);
        for (let d = 0; d < 8; d++) dcC[d] = dcGated[d] / B;
        inSeqBackward(M, fw1, dMean1, perHead1, dHv, dcC, fixedMasks);
      }
    }
    const meanW = new Float64Array(M.Wh[0].v.length);
    for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) meanW[i] += M.Wh[k].v[i] / K;
    for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) M.Wh[k].g[i] += lam * (M.Wh[k].v[i] - meanW[i]) / (B * M.H);
  }
  const plist = useGate ? params.concat([gate.w, gate.b]) : params;
  let s = 0;
  for (const p of plist) for (let i = 0; i < p.g.length; i++) s += p.g[i] * p.g[i];
  const n = Math.sqrt(s);
  if (n > 1.0) { const sc = 1.0 / n; for (const p of plist) for (let i = 0; i < p.g.length; i++) p.g[i] *= sc; }
  opt.step(plist);
  return { loss: lsum / B };
}
// Wave 0: (a) isolated feature-path gradcheck; (b) twins per arm incl. gate.
globalThis.runU45Wave0 = async function (fs, log) {
  try { const prev = JSON.parse(await fs.readTextFile(U45_WAVE0_PATH)); if (prev && prev.verdict === "COMPLETE") { log(U45_WAVE0_PATH + " exists, skip"); return prev; } } catch (e) {}
  const G0 = await globalThis.IntrinsicInit(fs);
  const grng = G0.makeRng(45123);
  // P1d methods note (filed pre-compute): eeps=1e-5, NOT the house 1e-6. Cause: an
  // artifact investigation (2 marginals at 1e-6: t0-bv[9] 1.11e-5, t4-bv[1] 1.34e-5,
  // both ana==num to 3 s.f.) + eeps sweep on the failing probe showed num==ana to
  // 1e-11/1e-12 at eeps=1e-5/1e-4 but degrading below 1e-6 — i.e. 1e-6 sits at FD's
  // noise floor for ~1e-6-magnitude grads while 1e-5 resolves. The 1e-5 BAR is unchanged
  // (house standard); the instrument resolution is corrected with evidence. No compute
  // ran before this correction.
  let wworst = 0, nbad = 0;
  const NT = 12, eeps = 1e-5;
  for (let t = 0; t < NT; t++) {
    const z = new Float64Array(4), c = new Float64Array(8), dc = new Float64Array(8);
    const aq = new Float64Array(12), bv = new Float64Array(12);
    for (let o = 0; o < 4; o++) z[o] = (grng.int(2000) - 1000) / 500;
    for (let d = 0; d < 8; d++) { c[d] = (grng.int(2000) - 1000) / 500; dc[d] = (grng.int(2000) - 1000) / 500; }
    for (let i = 0; i < 12; i++) { aq[i] = (grng.int(2000) - 1000) / 500; bv[i] = (grng.int(2000) - 1000) / 500; }
    const w = new Float64Array(25);
    for (let i = 0; i < 25; i++) w[i] = (grng.int(2000) - 1000) / 2000;
    const bb = (grng.int(2000) - 1000) / 2000;
    // forward (mirrors u45Feats + gate, f2 = independent const)
    const fwd = (zz, cc, aa, bvv, ww, bbb) => {
      let mxx = zz[0]; for (let o = 1; o < 4; o++) if (zz[o] > mxx) mxx = zz[o];
      const pp = [0, 0, 0, 0]; let ss = 0;
      for (let o = 0; o < 4; o++) { pp[o] = Math.exp(zz[o] - mxx); ss += pp[o]; }
      for (let o = 0; o < 4; o++) pp[o] /= ss;
      let HH = 0; for (let o = 0; o < 4; o++) HH -= pp[o] * Math.log(pp[o] + 1e-12);
      let ax = 0; for (let o = 1; o < 4; o++) if (pp[o] > pp[ax]) ax = o;
      let bx = ax === 0 ? 1 : 0; for (let o = 0; o < 4; o++) if (o !== ax && pp[o] > pp[bx]) bx = o;
      const mm = pp[ax] - pp[bx], dd = 0.31;
      let nn2 = 0; for (let d = 0; d < 8; d++) nn2 += cc[d] * cc[d];
      const nn = Math.sqrt(nn2);
      let ddt = 0, n1 = 0, nb2 = 0;
      for (let i = 0; i < 12; i++) { ddt += aa[i] * bvv[i]; n1 += aa[i] * aa[i]; nb2 += bvv[i] * bvv[i]; }
      n1 = Math.sqrt(n1); nb2 = Math.sqrt(nb2);
      const co = (n1 > 1e-12 && nb2 > 1e-12) ? ddt / (n1 * nb2) : 0;
      let sss = bbb;
      for (let i = 0; i < 12; i++) sss += ww[i] * aa[i];
      for (let d = 0; d < 8; d++) sss += ww[12 + d] * cc[d];
      sss += ww[20] * HH + ww[21] * dd + ww[22] * mm + ww[23] * nn + ww[24] * co;
      const gg = u45Sig(sss);
      let qq = 0; for (let d = 0; d < 8; d++) qq += dc[d] * gg * cc[d];
      return { p: pp, H: HH, m: mm, ax, bx, n: nn, cos: co, n1, nb2, g: gg, q: qq };
    };
    const F0 = fwd(z, c, aq, bv, w, bb);
    const gg = F0.g * (1 - F0.g);
    let dot = 0; for (let d = 0; d < 8; d++) dot += dc[d] * c[d];
    const dLds = dot * gg;
    // analytics (mirror train code)
    const anaW = new Float64Array(25);
    for (let i = 0; i < 12; i++) anaW[i] = dLds * aq[i];
    for (let d = 0; d < 8; d++) anaW[12 + d] = dLds * c[d];
    anaW[20] = dLds * F0.H; anaW[21] = dLds * 0.31; anaW[22] = dLds * F0.m; anaW[23] = dLds * F0.n; anaW[24] = dLds * F0.cos;
    const anaB = dLds;
    const anaC = new Float64Array(8);
    for (let d = 0; d < 8; d++) anaC[d] = F0.g * dc[d] + dLds * w[12 + d] + (F0.n > 1e-12 ? dLds * w[23] * c[d] / F0.n : 0);
    const anaAq = new Float64Array(12), anaBv = new Float64Array(12);
    for (let i = 0; i < 12; i++) {
      anaAq[i] = dLds * w[i];
      anaBv[i] = 0;
      if (F0.n1 > 1e-12 && F0.nb2 > 1e-12) {
        const denom = F0.n1 * F0.nb2;
        anaAq[i] += dLds * w[24] * (bv[i] / denom - F0.cos * aq[i] / (F0.n1 * F0.n1));
        anaBv[i] += dLds * w[24] * (aq[i] / denom - F0.cos * bv[i] / (F0.nb2 * F0.nb2));
      }
    }
    const anaZ = new Float64Array(4);
    for (let o = 0; o < 4; o++) {
      const ent = -F0.p[o] * (Math.log(F0.p[o] + 1e-12) + F0.H);
      const mar = F0.p[F0.ax] * ((o === F0.ax ? 1 : 0) - F0.p[o]) - F0.p[F0.bx] * ((o === F0.bx ? 1 : 0) - F0.p[o]);
      anaZ[o] = dLds * (w[20] * ent + w[22] * mar);
    }
    const lossOf = () => fwd(z, c, aq, bv, w, bb).q;
    const chk = (get, set, ana, len) => {
      for (let i = 0; i < len; i++) {
        const a0 = get(i);
        set(i, a0 + eeps); const lp = lossOf();
        set(i, a0 - eeps); const lm = lossOf();
        set(i, a0);
        const num = (lp - lm) / (2 * eeps);
        const rel = Math.abs(ana[i] - num) / Math.max(1e-8, Math.abs(ana[i]) + Math.abs(num));
        if (rel > wworst) wworst = rel;
        if (rel > 1e-5) nbad++;
      }
    };
    chk((i) => w[i], (i, v) => { w[i] = v; }, anaW, 25);
    { const num = (fwd(z, c, aq, bv, w, bb + eeps).q - fwd(z, c, aq, bv, w, bb - eeps).q) / (2 * eeps); const rel = Math.abs(anaB - num) / Math.max(1e-8, Math.abs(anaB) + Math.abs(num)); if (rel > wworst) wworst = rel; if (rel > 1e-5) nbad++; }
    chk((i) => c[i], (i, v) => { c[i] = v; }, anaC, 8);
    chk((i) => aq[i], (i, v) => { aq[i] = v; }, anaAq, 12);
    chk((i) => bv[i], (i, v) => { bv[i] = v; }, anaBv, 12);
    chk((i) => z[i], (i, v) => { z[i] = v; }, anaZ, 4);
  }
  const gradPass = nbad === 0;
  log("u45-wave0 feature-gradcheck worst=" + wworst.toExponential(2) + " nBad=" + nbad + "/612");
  if (!gradPass) throw new Error("U45 Wave-0 HALT: feature gradcheck FAIL worst=" + wworst);
  const twins = [];
  const dims = { old: 20, new: 25, open: 20 };
  for (const arm of ["old", "new", "open"]) {
    for (const s of [0, 1, 2]) {
      const X = await globalThis.u32FreshStack(fs, s);
      const Y = await globalThis.u32FreshStack(fs, s);
      const gX = u45MakeGate(dims[arm]), gY = u45MakeGate(dims[arm]);
      const p0 = globalThis.u32MaxAbsDiff(globalThis.u32SnapshotParams(X.M), globalThis.u32SnapshotParams(Y.M));
      for (const p of X.params) p.g.fill(0);
      for (const p of Y.params) p.g.fill(0);
      u45TrainOneStep(X.M, X.params, gX, X.opt, X.dataRng, X.fixedMasks, arm !== "open", arm === "new");
      u45TrainOneStep(Y.M, Y.params, gY, Y.opt, Y.dataRng, Y.fixedMasks, arm !== "open", arm === "new");
      const st = globalThis.u32MaxAbsDiff(globalThis.u32SnapshotParams(X.M), globalThis.u32SnapshotParams(Y.M));
      let gd = 0; for (let i = 0; i < dims[arm]; i++) gd = Math.max(gd, Math.abs(gX.w.v[i] - gY.w.v[i]));
      gd = Math.max(gd, Math.abs(gX.b.v[0] - gY.b.v[0]));
      twins.push({ arm, seed: s, p0diff: p0.max, step1diff: st.max, gateDiff: gd, pass: p0.max === 0 && st.max === 0 && gd === 0 });
      log("u45-wave0 twin " + arm + " s" + s + " p0=" + p0.max + " step1=" + st.max + " gate=" + gd);
      if (p0.max !== 0 || st.max !== 0 || gd !== 0) throw new Error("U45 Wave-0 HALT: twin nondeterminism " + arm + " s" + s);
    }
  }
  const body = { spec: "self-u45-gateinput-prereg", wave: 0, verdict: "COMPLETE", gradcheck: { worst: wworst, nBad: nbad, pass: gradPass }, twins, deviations: [] };
  await fs.writeTextFile(U45_WAVE0_PATH, JSON.stringify(body));
  log("u45-wave0 gradcheck + twins PASS");
  return body;
};
globalThis.runU45Train = async function (fs, log, opts) {
  const { seed, arm } = opts;
  if (!(arm in U45_ARMS)) throw new Error("arm must be old|new|open");
  const ledgerPath = u45TrainPath(seed, arm);
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  const h = await globalThis.u33StackHash(fs);
  if (h.hex !== U45_EXPECT_STACK) throw new Error("U45-PIN HALT: stack drift " + h.hex.slice(0, 16));
  const drvSrc = await fs.readTextFile("src/evidence/decomp/newai-selfu45-driver.js");
  const drvHash = await u32Sha256Hex(drvSrc);
  const t = await globalThis.u32FreshStack(fs, seed);
  const P0 = globalThis.u32SnapshotParams(t.M);
  const gate = u45MakeGate(arm === "new" ? 25 : 20);
  const Gate0 = u45SnapGate(gate);
  const steps = 800, t0 = Date.now(), curve = [];
  const useGate = arm !== "open", wantFeats = arm === "new";
  for (let step = 0; step < steps; step++) {
    for (const p of t.params) p.g.fill(0);
    gate.w.g.fill(0); gate.b.g.fill(0);
    const r = u45TrainOneStep(t.M, t.params, gate, t.opt, t.dataRng, t.fixedMasks, useGate, wantFeats);
    if (step % 100 === 0 || step === steps - 1) curve.push({ step, loss: +r.loss.toFixed(6) });
    if (step % 200 === 0) log("u45-train " + arm + " s" + seed + " step " + step + "/800 loss=" + r.loss.toFixed(4));
  }
  const P = globalThis.u32SnapshotParams(t.M);
  const body = {
    spec: "self-u45-gateinput-prereg", track: "U45-GATEINPUT", arm, seed, steps,
    B: 16, lr: 5e-3, K: 5, H: 48, C: 6, auxW: 0.5, lam: 2.0,
    diet: "U38-D1 mismatch diet (shared)",
    gate: arm === "old" ? "20-dim [E[qk]|cNew] (u38 verbatim)" : arm === "new" ? "25-dim + F[5] (P1a paths)" : "open g=1",
    verdict: "COMPLETE", stackHash: h.hex, stackFiles: h.perFile.map((f) => f.path), u45DriverHash: drvHash,
    wallMs: Date.now() - t0, curve, divCos: +inMeanCos(t.M).toFixed(4), P0, P,
    Gate0, Gate: arm === "open" ? null : u45SnapGate(gate),
  };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("u45-train " + arm + " s" + seed + " COMPLETE loss0=" + curve[0].loss + " lossN=" + curve[curve.length - 1].loss);
  return body;
};
globalThis.runU45Eval = async function (fs, log, opts) {
  const { seed, arm } = opts;
  const trainPath = u45TrainPath(seed, arm), evalPath = u45EvalPath(seed, arm);
  if (!opts.force) { try { const prev = JSON.parse(await fs.readTextFile(evalPath)); if (prev && prev.verdict === "COMPLETE") { log(evalPath + " exists, skip"); return prev; } } catch (e) {} }
  const G = await globalThis.IntrinsicInit(fs);
  const tr = JSON.parse(await fs.readTextFile(trainPath));
  if (tr.verdict !== "COMPLETE") throw new Error("train ledger missing " + trainPath);
  const cur = await globalThis.u33StackHash(fs);
  if (cur.hex !== tr.stackHash) throw new Error("U45-PIN HALT: stack drift since train " + trainPath);
  const M = inSeqMakeModel(G.makeRng(1));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(M.E, tr.P.E); load(M.W1, tr.P.W1); load(M.b1, tr.P.b1);
  load(M.Wf, tr.P.Wf); load(M.bf, tr.P.bf); load(M.Wc, tr.P.Wc); load(M.bc, tr.P.bc);
  for (let k = 0; k < 5; k++) { load(M.Wh[k], tr.P.Wh[k]); load(M.bh[k], tr.P.bh[k]); }
  load(M.Hv, tr.P.Hv); load(M.bv, tr.P.bv);
  const gate = u45MakeGate(arm === "new" ? 25 : 20);
  if (arm !== "open") u45LoadGate(gate, tr.Gate);
  const wantFeats = arm === "new";
  const gateG = (qk, cCtx, fw1) => {
    if (arm === "open") return 1;
    const F = wantFeats ? u45Feats(M, fw1, qk, cCtx) : null;
    return u45GateFwd(M, gate, qk, cCtx, F).g;
  };
  let evalMasks = null; { const fr = G.makeRng(91000 + seed); evalMasks = []; for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr.int(10) < 5 ? 2 : 0; evalMasks.push(m); } }
  const srng = G.makeRng(52500 + seed), frng = G.makeRng(52400 + seed);
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  const N = 200;
  let scr = 0, two = 0, orc = 0;
  for (let i = 0; i < N; i++) {
    const e = inSeqGenShift(srng, null);
    const fw1 = inSeqForward(M, e.x, new Float64Array(8), evalMasks);
    const vhat = argmax4(fw1.hvLog);
    if (vhat === e.v) scr++;
    const gg = gateG(e.qk, fw1.cNew, fw1);
    const cG = new Float64Array(8); for (let d = 0; d < 8; d++) cG[d] = gg * fw1.cNew[d];
    const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
    if (argmax4(inMeanLogits({ logitsK: inSeqForward(M, x2m, cG, evalMasks).logitsK })) === e.y) two++;
    const xo = [9, 9, 9, 9, 9, 9, e.qk, e.k, e.v, 8];
    const go = gateG(e.qk, fw1.cNew, fw1);
    const cGo = new Float64Array(8); for (let d = 0; d < 8; d++) cGo[d] = go * fw1.cNew[d];
    if (argmax4(inMeanLogits({ logitsK: inSeqForward(M, xo, cGo, evalMasks).logitsK })) === e.y) orc++;
  }
  let fF = 0;
  for (let i = 0; i < N; i++) {
    const e = inSeqGenShift(frng, 0);
    if (argmax4(inMeanLogits({ logitsK: inSeqForward(M, e.x, new Float64Array(8), evalMasks).logitsK })) === e.y) fF++;
  }
  // Gate stats on paired scrub stream (200 clean + 200 donor-mismatch).
  const grng = G.makeRng(54500 + seed);
  let gClean = 0, gMis = 0, shutMis = 0;
  for (let i = 0; i < N; i++) {
    const e = inSeqGenShift(grng, null);
    const fw1 = inSeqForward(M, e.x, new Float64Array(8), evalMasks);
    gClean += gateG(e.qk, fw1.cNew, fw1);
  }
  for (let i = 0; i < N; i++) {
    const eA = inSeqGenShift(grng, null), eB = inSeqGenShift(grng, null);
    const fwA = inSeqForward(M, eA.x, new Float64Array(8), evalMasks);
    const fwB = inSeqForward(M, eB.x, new Float64Array(8), evalMasks);
    const gg = gateG(eA.qk, fwB.cNew, fwA);
    gMis += gg;
    if (gg < 0.5) shutMis++;
  }
  const body = {
    spec: "self-u45-gateinput-prereg", track: "U45-GATEINPUT", arm, seed, steps: 800,
    verdict: "COMPLETE", n: N, frozenTest: true, evalOf: trainPath, stackHash: cur.hex,
    accScratch: +(scr / N).toFixed(4), accTwo: +(two / N).toFixed(4),
    accOracle: +(orc / N).toFixed(4), accFwd: +(fF / N).toFixed(4),
    gateClean: arm === "open" ? 1 : +(gClean / N).toFixed(4),
    gateMis: arm === "open" ? 1 : +(gMis / N).toFixed(4),
    shutRate: arm === "open" ? 0 : +(shutMis / N).toFixed(4),
  };
  await fs.writeTextFile(evalPath, JSON.stringify(body));
  log("u45-eval " + arm + " s" + seed + " scr=" + body.accScratch + " two=" + body.accTwo + " orc=" + body.accOracle + " gC=" + body.gateClean + " gM=" + body.gateMis + " shut=" + body.shutRate);
  return body;
};
globalThis.runU45Verdict = async function (fs, log, opts) {
  void opts;
  const arms = ["old", "new", "open"];
  const T = {}, E = {};
  for (const seed of [0, 1, 2]) for (const arm of arms) {
    T[seed + arm] = JSON.parse(await fs.readTextFile(u45TrainPath(seed, arm)));
    E[seed + arm] = JSON.parse(await fs.readTextFile(u45EvalPath(seed, arm)));
  }
  const pin = [0, 1, 2].every((s) => arms.every((a) => T[s + a].stackHash === U45_EXPECT_STACK && E[s + a].stackHash === U45_EXPECT_STACK));
  const rows = [0, 1, 2].map((s) => {
    const r = { seed: s };
    for (const a of arms) r[a] = { scr: E[s + a].accScratch, two: E[s + a].accTwo, orc: E[s + a].accOracle, gC: E[s + a].gateClean, gM: E[s + a].gateMis, shut: E[s + a].shutRate };
    return r;
  });
  let verdict = "", detail = "";
  const winNew = rows.map((r) => r.new.two);
  const floorBad = winNew.filter((v) => v < 0.45).length;
  const nShut = rows.filter((r) => r.new.shut >= 0.20).length;
  const nPred = rows.filter((r) => (r.new.gC - r.new.gM) >= 0.10).length;
  const nComp = rows.filter((r) => (r.new.two - r.old.two) >= 0.03).length;
  const nNever = rows.filter((r) => r.new.shut === 0).length;
  for (const r of rows) log("u45 s" + r.seed + " old=" + r.old.two + " new=" + r.new.two + " open=" + r.open.two + " shut=" + r.new.shut + " gC-gM=" + (r.new.gC - r.new.gM).toFixed(3));
  if (!pin) { verdict = "PIN-FAIL"; detail = "stack drift"; }
  else if (floorBad >= 2) { verdict = "INCONCLUSIVE"; detail = "NEW below floor on " + floorBad + "/3"; }
  else if (nShut >= 2 && nPred >= 2 && nComp >= 2) { verdict = "ADVANCE"; detail = "SHUTS " + nShut + "/3 + PRED " + nPred + "/3 + COMPOSE " + nComp + "/3 — input-side fix verified, D5 UN-HALTED"; }
  else if (nShut >= 2) { verdict = "INCONCLUSIVE"; detail = "shuts " + nShut + "/3 but compose " + nComp + "/3 (pred " + nPred + "/3) — mechanism works, use unproven"; }
  else if (nNever >= 2) { verdict = "DEAD"; detail = "never shuts " + nNever + "/3 — explicit features insufficient, pressure-side"; }
  else { verdict = "DEAD"; detail = "split (shut " + nShut + "/3, pred " + nPred + "/3, comp " + nComp + "/3) — no quorum"; }
  const body = { spec: "self-u45-gateinput-prereg", track: "U45-GATEINPUT", verdict, detail, pin, rows, oldControl: rows.map((r) => r.old.shut) };
  await fs.writeTextFile(U45_VERDICT_PATH, JSON.stringify(body));
  log("u45-verdict " + verdict + " (" + detail + ")");
  return body;
};
