// newai-selfu60-driver.js — U60-DET3 regime-trained substrate (answers U58 carry-null).
//
// Diet-only change, NO stack surgery (pinned 11 files untouched, stackHash 258d2f06…).
// Reuses U58-DET2 v1.5 probe machinery VERBATIM by evaluating the filed U58 driver
// (u58RunStream, u58Boundaries, U58_HOT, u58Row, OLS/mean/SD/corr, verdict operators).
// New: regime trunk training (W6 recipe + quarter-rotating-hot row sampler) + REGIME-MANIP
// carry quarter-variance guard.
//
// Prereg: src/evidence/decomp/self-u60-det3-prereg.md v1.0 (STANDS, 10x battery).
// Cover: user 2026-11-26 countersign new substrate = driver + Waves 0-2 + per-wave 10x reviews.
// NO PUSH without order.
//
// Driver-spec D-pins (filed at build, zero data):
//  D1 regime sampler: global row n = step*16+b (0..12799); block j = floor(n/400) (32 blocks).
//    Block boundaries bj from block rng 62000+seed*1000+j (as filed): bj = [100±U{0..20},
//    200±U{0..20}, 300±U{0..20}] with U{0..20} = rng.int(41)-20; quarter q from bj by the same
//    rule as probes (r>b[2]?3:r>b[1]?2:r>b[0]?1:0). Base row = EXACT W6 two-branch call
//    (ub ? inSeqGenShift(dataRng,0) : inSeqGenShift(dataRng,null)). Then if dataRng.int(10)<7,
//    rejection-sample via inSeqGenShift(dataRng,null) until qk in HOT[q] (tries<=50, else accept).
//    Labels y/v as generated, NEVER relabeled. Pick-max C=6 + all gradient terms verbatim
//    from u32TrainOneStep (copy, only candidate generation replaced).
//  D2 QV metric (guard, same rows as probes, no interference): for each clean-rot stream,
//    quarters from trunk boundaries b; qmean[q][d] = mean carry over rows in quarter;
//    stream qv = mean over d=0..7 of variance across q=0..3 of qmean; trunk qv = mean over
//    80 clean-rot streams. Canon band: per-trunk qv recomputed on filed canon trunks with the
//    SAME operator (filed ledgers lack carry, so recompute reads-only); band upper edge = max
//    over 20 canon trunks. Regime trunk passes iff qv > canon max (strict elevation).
//    Quorum 15/20 per prereg; else MANIP-FAIL, do NOT interpret DET3 bars.
//  D3 Probe RNGs identical to v1.5 (62000+trunk*1000+cell*100+s) so regime probes are
//    directly comparable to filed canon probes.
//
// RUN (execute_js, fs in scope; ONLY under fresh countersign):
//   const src = await fs.readTextFile("src/evidence/decomp/newai-selfu60-driver.js");
//   (0, eval)(src + "\n//# sourceURL=newai-selfu60-driver.js");
//   await globalThis.SelfU60Init(fs);
//   await globalThis.runU60Wave0(fs, log);
//   await globalThis.runU60Train(fs, log);
//   await globalThis.runU60Probes(fs, log);
//   await globalThis.runU60Verdict(fs, log);
globalThis.SelfU60Init = async function (fs) {
  const u58src = await fs.readTextFile("src/evidence/decomp/newai-selfu58-driver.js");
  (0, eval)(u58src + "\n//# sourceURL=newai-selfu58-driver.js");
  await globalThis.SelfU58Init(fs);
  for (const f of ["u32FreshStack", "u32TrainOneStep", "u32SnapshotParams", "u32MaxAbsDiff",
    "u58RunStream", "u58Boundaries", "u58Row", "u58Mean", "u58SD", "u58OLS", "u58Corr"]) {
    if (typeof globalThis[f] === "undefined")
      throw new Error("U60 stack load failed: missing " + f);
  }
  if (typeof globalThis.runU58Wave0 !== "function" || typeof globalThis.runU58Probes20 !== "function")
    throw new Error("U60 stack load failed: missing U58 wave fns");
};
const U60_EXPECT_STACK = "258d2f060684ce382778e203959ab791abb5df79af174deef19ff568886d4d6e";
const U60_TRUNKS = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19];
const U60_STREAMS = 80;
const U60_CELLS = ["clean-stat", "noisy-stat", "clean-rot", "noisy-rot"];
const U60_HOT = [[0,1],[2,3],[0,1],[2,3]];
function u60RegimePath(seed) { return "src/evidence/decomp/d-newai-self-u60-regime-s" + seed + "-800st.json"; }
function u60ProbePath(trunk, cell) { return "src/evidence/decomp/d-newai-self-u60-probes-t" + trunk + "-c" + cell + ".json"; }
const U60_WAVE0_PATH = "src/evidence/decomp/d-newai-self-u60-wave0.json";
const U60_VERDICT_PATH = "src/evidence/decomp/d-newai-self-u60-verdict.json";
function u60Quarter(b, r) { return r > b[2] ? 3 : r > b[1] ? 2 : r > b[0] ? 1 : 0; }
function u60BlockBounds(G, seed, j) {
  const brng = G.makeRng(62000 + seed * 1000 + j);
  const d = () => brng.int(41) - 20;
  return [100 + d(), 200 + d(), 300 + d()];
}
// One regime training candidate for global row n (D1): base W6 two-branch, then 0.7 hot-match.
function u60RegimeRow(dataRng, G, seed, n) {
  const j = Math.floor(n / 400);
  const b = u60BlockBounds(G, seed, j);
  const rInBlock = n % 400;
  const q = u60Quarter(b, rInBlock);
  const ub = dataRng.int(2) === 0;
  let e = ub ? inSeqGenShift(dataRng, 0) : inSeqGenShift(dataRng, null);
  if (dataRng.int(10) < 7) {
    let tries = 0;
    while (tries < 50) {
      const c = inSeqGenShift(dataRng, null);
      tries++;
      if (c.qk === U60_HOT[q][0] || c.qk === U60_HOT[q][1]) { e = c; break; }
      if (tries >= 50) { e = c; break; }
    }
  }
  return e;
}
// Regime train step: verbatim u32TrainOneStep except candidate generation (D1).
function u60TrainOneStep(M, params, opt, dataRng, fixedMasks, G, seed, step) {
  const B = 16, C = 6, auxW = 0.5, lam = 2.0, K = 5;
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  let lsum = 0;
  for (let b = 0; b < B; b++) {
    const n = step * B + b;
    const cands = [];
    for (let c = 0; c < C; c++) cands.push(u60RegimeRow(dataRng, G, seed, n));
    let pk = 0, best = -1;
    for (let c = 0; c < C; c++) {
      const fw = inSeqForward(M, cands[c].x, new Float64Array(8), fixedMasks);
      const d = curVoteDisagree(fw.logitsK);
      if (d > best) { best = d; pk = c; }
    }
    const e = cands[pk];
    const c0 = new Float64Array(8);
    const fw1 = inSeqForward(M, e.x, c0, fixedMasks);
    const ceHv = inCELossGrad(fw1.hvLog, e.v);
    const dHv = new Float64Array(4); for (let o = 0; o < 4; o++) dHv[o] = ceHv.d[o] * auxW / B;
    const vhat = argmax4(fw1.hvLog);
    const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
    const fw2 = inSeqForward(M, x2m, fw1.cNew, fixedMasks);
    const perHead1 = fw1.logitsK.map((lg, k) => {
      if ((b % K) !== k) return new Float64Array(4);
      const ce = inCELossGrad(lg, e.y); const d = new Float64Array(4);
      for (let o = 0; o < 4; o++) d[o] = ce.d[o] * 0.1 * K / B;
      return d;
    });
    const perHead2 = fw2.logitsK.map((lg, k) => {
      if ((b % K) !== k) return new Float64Array(4);
      const ce = inCELossGrad(lg, e.y); const d = new Float64Array(4);
      for (let o = 0; o < 4; o++) d[o] = ce.d[o] * 0.1 * K / B;
      return d;
    });
    const mean2 = inMeanLogits({ logitsK: fw2.logitsK });
    const ce2 = inCELossGrad(mean2, e.y);
    const dMean2 = new Float64Array(4); for (let o = 0; o < 4; o++) dMean2[o] = ce2.d[o] / B;
    const mean1 = inMeanLogits({ logitsK: fw1.logitsK });
    const ce1m = inCELossGrad(mean1, e.y);
    const dMean1 = new Float64Array(4); for (let o = 0; o < 4; o++) dMean1[o] = ce1m.d[o] * 0.3 / B;
    lsum += ce2.loss + auxW * ceHv.loss;
    const dc = inSeqBackward(M, fw2, dMean2, perHead2, null, null, fixedMasks);
    inSeqBackward(M, fw1, dMean1, perHead1, dHv, dc, fixedMasks);
    const meanW = new Float64Array(M.Wh[0].v.length);
    for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) meanW[i] += M.Wh[k].v[i] / K;
    for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) M.Wh[k].g[i] += lam * (M.Wh[k].v[i] - meanW[i]) / (B * M.H);
  }
  let s = 0; for (const p of params) for (let i = 0; i < p.g.length; i++) s += p.g[i] * p.g[i];
  const n2 = Math.sqrt(s);
  if (n2 > 1.0) { const sc = 1.0 / n2; for (const p of params) for (let i = 0; i < p.g.length; i++) p.g[i] *= sc; }
  let gnorm = 0; for (const p of params) for (let i = 0; i < p.g.length; i++) gnorm += p.g[i] * p.g[i];
  gnorm = Math.sqrt(gnorm);
  opt.step(params);
  return { loss: lsum / B, gnorm };
}
// QV operator (D2): quarter-mean carry variance, clean-rot streams.
function u60StreamQV(M, evalMasks, rng, b) {
  const N = 400, BURN = 50;
  const car = [];
  for (let r = 0; r < N; r++) {
    const q = u60Quarter(b, r);
    const row = u58Row(rng, false, U60_HOT[q]);
    const fw1 = inSeqForward(M, row.x, new Float64Array(8), evalMasks);
    const vhat = u58Argmax4(fw1.hvLog);
    const x2m = [9, 9, 9, 9, 9, 9, row.qk, row.k, vhat, 8];
    const fw2 = inSeqForward(M, x2m, fw1.cNew, evalMasks);
    car.push(Array.from(fw2.cNew));
  }
  const qs = [[0, b[0]], [b[0] + 1, b[1]], [b[1] + 1, b[2]], [b[2] + 1, N - 1]];
  const qmean = qs.map(([lo, hi]) => {
    const m = new Array(8).fill(0);
    for (let r = lo; r <= hi; r++) for (let d = 0; d < 8; d++) m[d] += car[r][d];
    const n = hi - lo + 1;
    return m.map((v) => v / n);
  });
  let v = 0;
  for (let d = 0; d < 8; d++) {
    const m = (qmean[0][d] + qmean[1][d] + qmean[2][d] + qmean[3][d]) / 4;
    v += ((qmean[0][d] - m) ** 2 + (qmean[1][d] - m) ** 2 + (qmean[2][d] - m) ** 2 + (qmean[3][d] - m) ** 2) / 4;
  }
  return v / 8;
}
function u60LoadRegime(M, led) {
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(M.E, led.P.E); load(M.W1, led.P.W1); load(M.b1, led.P.b1);
  load(M.Wf, led.P.Wf); load(M.bf, led.P.bf); load(M.Wc, led.P.Wc); load(M.bc, led.P.bc);
  for (let k = 0; k < 5; k++) { load(M.Wh[k], led.P.Wh[k]); load(M.bh[k], led.P.bh[k]); }
  load(M.Hv, led.P.Hv); load(M.bv, led.P.bv);
}
function u60EvalMasks(G, trunk) {
  const fr = G.makeRng(91000 + trunk); const evalMasks = [];
  for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr.int(10) < 5 ? 2 : 0; evalMasks.push(m); }
  return evalMasks;
}
function u60CanonPath(seed) { return "src/evidence/decomp/d-newai-self-u33-canon-s" + seed + "-800st.json"; }
globalThis.runU60Wave0 = async function (fs, log) {
  try { const prev = JSON.parse(await fs.readTextFile(U60_WAVE0_PATH)); if (prev && prev.verdict === "COMPLETE") { log(U60_WAVE0_PATH + " exists, skip"); return prev; } } catch (e) {}
  const h = await globalThis.u33StackHash(fs);
  if (h.hex !== U60_EXPECT_STACK) throw new Error("U60-PIN HALT: stack drift " + h.hex.slice(0, 16));
  const G = await globalThis.IntrinsicInit(fs);
  log("u60-wave0 stack PIN ok");
  // twin determinism of regime sampler: same (seed,n) twice -> identical rows (fresh RNGs, same draws).
  for (const seed of [0, 1]) {
    for (const n of [0, 400, 399, 12799]) {
      const r1 = G.makeRng(42000 + seed * 104729 + 55), r2 = G.makeRng(42000 + seed * 104729 + 55);
      // advance both to row n by drawing n rows first (deterministic check on a short span).
      const adv = (r, k) => { for (let i = 0; i < k; i++) u60RegimeRow(r, G, seed, i); };
      adv(r1, 0); adv(r2, 0);
      const a = u60RegimeRow(r1, G, seed, n), c = u60RegimeRow(r2, G, seed, n);
      if (JSON.stringify(a) !== JSON.stringify(c)) throw new Error("U60 Wave-0 HALT: regime sampler not reproducible seed=" + seed + " n=" + n);
    }
  }
  log("u60-wave0 regime sampler reproducible");
  // canon qv band: recompute SAME operator on filed canon trunks (reads only).
  const canonQV = [];
  for (const trunk of U60_TRUNKS) {
    const canon = JSON.parse(await fs.readTextFile(u60CanonPath(trunk)));
    const M = inSeqMakeModel(G.makeRng(1));
    u60LoadRegime(M, canon);
    const evalMasks = u60EvalMasks(G, trunk);
    const b = u58Boundaries(G, trunk);
    let s = 0;
    for (let st = 0; st < 8; st++) {
      const rng = G.makeRng(62000 + trunk * 1000 + U60_CELLS.indexOf("clean-rot") * 100 + st);
      s += u60StreamQV(M, evalMasks, rng, b);
    }
    canonQV.push({ trunk, qv: +(s / 8).toFixed(6) });
  }
  const vals = canonQV.map((x) => x.qv);
  const cmax = Math.max(...vals), cmean = vals.reduce((a, x) => a + x, 0) / vals.length;
  log("u60-wave0 canon qv band: mean=" + cmean.toFixed(6) + " max=" + cmax.toFixed(6));
  // diet check: per-quarter hot-fraction ~0.85 on regime sampler (rotating HOT).
  {
    const b0 = u60BlockBounds(G, 0, 0);
    const repN = [5, 150, 250, 350];
    for (let q = 0; q < 4; q++) {
      const rng = G.makeRng(777002 + q);
      const hot = U60_HOT[q];
      let n = 0;
      for (let i = 0; i < 1000; i++) {
        const e = u60RegimeRow(rng, G, 0, repN[q]);
        if (e.qk === hot[0] || e.qk === hot[1]) n++;
      }
      const f = n / 1000;
      log("u60-wave0 regime hot q" + q + " frac=" + f.toFixed(3) + " (expect ~0.85)");
      if (Math.abs(f - 0.85) > 0.08) throw new Error("U60 Wave-0 HALT: regime hot mixture off q=" + q + " f=" + f.toFixed(3));
    }
  }
  log("u60-wave0 regime hot mixture ok (~0.85 per quarter)");
  // dry-run: 1 stream per cell on canon trunk 0 (crash-test only).
  {
    const canon = JSON.parse(await fs.readTextFile(u60CanonPath(0)));
    const M = inSeqMakeModel(G.makeRng(1));
    u60LoadRegime(M, canon);
    const evalMasks = u60EvalMasks(G, 0);
    const b = u58Boundaries(G, 0);
    for (const cell of U60_CELLS) {
      const rng = G.makeRng(62000 + 0 * 1000 + U60_CELLS.indexOf(cell) * 100);
      u58RunStream._b = b;
      u58RunStream(M, evalMasks, rng, cell);
    }
  }
  log("u60-wave0 dry-run 4 streams ok");
  const t0 = Date.now();
  const body = { spec: "self-u60-det3-prereg", track: "U60-DET3", wave: 0, verdict: "COMPLETE", stackHash: h.hex, canonQV, canonBand: { mean: +cmean.toFixed(6), max: +cmax.toFixed(6) }, timingNote: "trains+probes projected in run logs", builtMs: Date.now() - t0 };
  await fs.writeTextFile(U60_WAVE0_PATH, JSON.stringify(body));
  return body;
};
globalThis.runU60Train = async function (fs, log) {
  const h = await globalThis.u33StackHash(fs);
  if (h.hex !== U60_EXPECT_STACK) throw new Error("U60-PIN HALT: stack drift");
  for (const seed of U60_TRUNKS) {
    const path = u60RegimePath(seed);
    try { const prev = JSON.parse(await fs.readTextFile(path)); if (prev && prev.verdict === "COMPLETE") { log(path + " exists, skip"); continue; } } catch (e) {}
    const t = await u32FreshStack(fs, seed);
    const P0 = u32SnapshotParams(t.M);
    const steps = 800, t0 = Date.now(), curve = [];
    for (let step = 0; step < steps; step++) {
      for (const p of t.params) p.g.fill(0);
      const r = u60TrainOneStep(t.M, t.params, t.opt, t.dataRng, t.fixedMasks, t.G, seed, step);
      if (step % 100 === 0 || step === steps - 1) curve.push({ step, loss: +r.loss.toFixed(6) });
      if (step % 200 === 0) log("u60-train s" + seed + " step " + step + "/800 loss=" + r.loss.toFixed(4));
    }
    const P = u32SnapshotParams(t.M);
    const divCos = (typeof inMeanCos === "function") ? +inMeanCos(t.M).toFixed(4) : null;
    const body = { spec: "self-u60-det3-prereg", track: "U60-DET3", kind: "regime", seed, steps, B: 16, lr: 5e-3, K: 5, H: 48, C: 6, auxW: 0.5, lam: 2.0, verdict: "COMPLETE", recipeMatch: "W6 recipe + quarter-rotating-hot sampler (diet-only)", stackHash: h.hex, wallMs: Date.now() - t0, frozen: true, curve, divCos, P0, P };
    await fs.writeTextFile(path, JSON.stringify(body));
    log("u60-train s" + seed + " COMPLETE loss0=" + curve[0].loss + " lossN=" + curve[curve.length - 1].loss);
  }
  return "ALL-REGIME-TRAINS-COMPLETE";
};
globalThis.runU60Probes = async function (fs, log) {
  const h = await globalThis.u33StackHash(fs);
  if (h.hex !== U60_EXPECT_STACK) throw new Error("U60-PIN HALT: stack drift");
  const G = await globalThis.IntrinsicInit(fs);
  for (const trunk of U60_TRUNKS) {
    const led = JSON.parse(await fs.readTextFile(u60RegimePath(trunk)));
    const M = inSeqMakeModel(G.makeRng(1));
    u60LoadRegime(M, led);
    const evalMasks = u60EvalMasks(G, trunk);
    const b = u58Boundaries(G, trunk);
    for (const cell of U60_CELLS) {
      const path = u60ProbePath(trunk, cell);
      try { const prev = JSON.parse(await fs.readTextFile(path)); if (prev && prev.verdict === "COMPLETE") { log(path + " exists, skip"); continue; } } catch (e) {}
      const streams = [];
      for (let s = 0; s < U60_STREAMS; s++) {
        const rng = G.makeRng(62000 + trunk * 1000 + U60_CELLS.indexOf(cell) * 100 + s);
        u58RunStream._b = b;
        const r = u58RunStream(M, evalMasks, rng, cell);
        streams.push({ s, meanErr: +r.meanErr.toFixed(5), aval: +r.aval.toFixed(5), bspikes: r.bspikes.map((v) => +v.toFixed(5)), bresp: +r.bresp.toFixed(5) });
      }
      await fs.writeTextFile(path, JSON.stringify({ spec: "self-u60-det3-prereg", track: "U60-DET3", trunk, cell, verdict: "COMPLETE", stackHash: h.hex, boundaries: b, n: 400, streamsPerCell: U60_STREAMS, streams }));
      log("u60-probes t" + trunk + " " + cell + " COMPLETE (80 streams)");
    }
  }
  return "ALL-PROBES-COMPLETE";
};
globalThis.runU60Verdict = async function (fs, log) {
  const w0 = JSON.parse(await fs.readTextFile(U60_WAVE0_PATH));
  const cmax = w0.canonBand.max;
  const G = await globalThis.IntrinsicInit(fs);
  // MANIP guard first (filed gating order).
  const manip = [];
  for (const trunk of U60_TRUNKS) {
    const led = JSON.parse(await fs.readTextFile(u60RegimePath(trunk)));
    const M = inSeqMakeModel(G.makeRng(1));
    u60LoadRegime(M, led);
    const evalMasks = u60EvalMasks(G, trunk);
    const b = u58Boundaries(G, trunk);
    let s = 0;
    for (let st = 0; st < U60_STREAMS; st++) {
      const rng = G.makeRng(62000 + trunk * 1000 + U60_CELLS.indexOf("clean-rot") * 100 + st);
      s += u60StreamQV(M, evalMasks, rng, b);
    }
    const qv = s / U60_STREAMS;
    manip.push({ trunk, qv: +qv.toFixed(6), pass: qv > cmax });
    log("u60-manip t" + trunk + " qv=" + qv.toFixed(6) + (qv > cmax ? " PASS" : " fail") + " (canon max " + cmax.toFixed(6) + ")");
  }
  const manipN = manip.filter((x) => x.pass).length;
  const perTrunk = [];
  for (const trunk of U60_TRUNKS) {
    const L = {};
    for (const cell of U60_CELLS) L[cell] = JSON.parse(await fs.readTextFile(u60ProbePath(trunk, cell)));
    const pin = U60_CELLS.every((c) => L[c].stackHash === U60_EXPECT_STACK);
    const vec = { aval: [], bsw: [], merr: [], cellOf: [] };
    for (const cell of U60_CELLS) for (const st of L[cell].streams) {
      vec.aval.push(st.aval); vec.bsw.push(st.bresp); vec.merr.push(st.meanErr); vec.cellOf.push(cell);
    }
    const idx = (pred) => vec.cellOf.map((c, i) => (pred(c) ? i : -1)).filter((i) => i >= 0);
    const at = (arr, ii) => ii.map((i) => arr[i]);
    const cs = (arr, cell) => { const a = at(arr, idx((c) => c === cell)); return { m: u58Mean(a), se: u58SD(a) / Math.sqrt(a.length) }; };
    const rA = u58OLS(vec.merr, vec.aval), rB = u58OLS(vec.merr, vec.bsw);
    const nosread = rA.singular || rB.singular;
    const A = nosread ? vec.aval : rA.resid, B = nosread ? vec.bsw : rB.resid;
    const K2 = nosread ? 2 : 1;
    const gSn = cs(A, "noisy-stat"), gSc = cs(A, "clean-stat");
    const gRn = cs(A, "noisy-rot"), gRc = cs(A, "clean-rot");
    const gS = gSn.m - gSc.m, seS = Math.sqrt(gSn.se * gSn.se + gSc.se * gSc.se);
    const gR = gRn.m - gRc.m, seR = Math.sqrt(gRn.se * gRn.se + gSc.se * gSc.se);
    const cross = Math.abs(gR - gS), seC = Math.sqrt(seS * seS + seR * seR);
    const bR = at(B, idx((c) => c.indexOf("rot") >= 0));
    const sR = u58Mean(bR), seSR = u58SD(bR) / Math.sqrt(bR.length);
    const bS = at(B, idx((c) => c.indexOf("stat") >= 0));
    const sS = u58Mean(bS), seSS = u58SD(bS) / Math.sqrt(bS.length);
    const r = u58Corr(vec.aval, vec.bsw);
    const nondegen = (gS - 2 * K2 * seS > 0) && (gR - 2 * K2 * seR > 0) && (sR - 2 * K2 * seSR > 0);
    const subs = [
      { name: "gap_STAT", pass: gS - 2 * K2 * seS > 0, uw: 2 * seS > 0.25 },
      { name: "gap_ROT", pass: gR - 2 * K2 * seR > 0, uw: 2 * seR > 0.25 },
      { name: "cross", pass: gS > 0 && gR > 0 && cross <= 0.5 * Math.min(gS, gR), uw: 2 * seC > 0.25 },
      { name: "spike_ROT", pass: sR - 2 * K2 * seSR > 0, uw: 2 * seSR > 0.25 },
      { name: "spike_STAT", pass: (Math.abs(sS) <= 2 * seSS) && (sR > 0 && sS <= sR / 2), uw: (sR > 0) && (2 * seSS > Math.abs(sR) / 2) },
    ];
    const disN = subs.filter((s) => s.pass).length;
    const dissociate = nondegen && disN >= 4;
    const independ = dissociate && Math.abs(r) < 0.7;
    const uwN = subs.filter((s) => s.uw).length;
    perTrunk.push({ trunk, pin, nosread, gaps: { gS: +gS.toFixed(4), gR: +gR.toFixed(4), cross: +cross.toFixed(4) }, spikes: { rot: +sR.toFixed(4), stat: +sS.toFixed(4) }, r: +r.toFixed(4), nondegen, subs: subs.map((s) => s.name + "=" + (s.pass ? "1" : "0")), disN, dissociate, independ, uwN });
  }
  const q = (f) => perTrunk.filter((s) => f(s)).length;
  const pinN = q((s) => s.pin), ndN = q((s) => s.nondegen), disN = q((s) => s.dissociate), indN = q((s) => s.independ), uwT = q((s) => s.uwN > 0);
  let verdict, cause;
  if (pinN < 20) { verdict = "PIN-FAIL"; cause = "pin"; }
  else if (manipN < 15) { verdict = "MANIP-FAIL"; cause = "regime pressure never installed (" + manipN + "/20 above canon max)"; }
  else if (uwT >= 6) { verdict = "UNDERPOWERED"; cause = "precision (fixed-tolerance POWER trip on 6+ trunks)"; }
  else if (ndN < 15) { verdict = "DET3-COLLAPSED"; cause = "nondegeneracy"; }
  else if (disN < 15) { verdict = "DET3-ENTANGLED"; cause = "dissociation (need 4/5 at quorum)"; }
  else if (indN < 15) { verdict = "DET3-ENTANGLED"; cause = "independence (|r|>=0.7)"; }
  else { verdict = "DET3-HEALTHY"; cause = "regime pressure installs carry marking"; }
  const body = { spec: "self-u60-det3-prereg", track: "U60-DET3", verdict, cause, manip: { pass: manipN + "/20", canonMax: cmax, perTrunk: manip }, bars: { "DET3-PIN": pinN + "/20", "DET3-MANIP": manipN + "/20", "DET3-NONDEGEN": ndN + "/20", "DET3-DISSOCIATE": disN + "/20", "DET3-INDEPEND": indN + "/20", "DET3-POWER": (20 - uwT) + "/20 (non-underpowered)" }, perTrunk };
  await fs.writeTextFile(U60_VERDICT_PATH, JSON.stringify(body));
  log("u60-verdict " + verdict + " cause=" + cause);
  return body;
};
