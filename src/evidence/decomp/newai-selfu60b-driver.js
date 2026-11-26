// newai-selfu60b-driver.js — U60b-PRICED priced regime pressure (same whiteboard, paid).
//
// Same diet/substrate/probes/guard as U60 + auxiliary quarter-prediction loss ON the carry.
// Wraps the filed U60 driver (diet sampler, probe machinery, qv operator) verbatim.
//
// Prereg: src/evidence/decomp/self-u60b-priced-prereg.md v1.0 (STANDS, 10x battery).
// Cover: user 2026-11-26 full-pipeline "write up then compute U60b" + per-wave 10x reviews.
// NO PUSH without order.
//
// Driver-spec D-pins (filed at build, zero data):
//  D1 price: linear probe Q (4x8 weights + 4 bias, init uniform from rng 96000+seed via
//    G.makeRng().int-based draws mapped to [-0.1,0.1]) on round-2 carry fw2.cNew; term
//    auxQW*CE(softmax(Q*cNew+b), q)/B, auxQW=0.5. q from block structure (self-supervised).
//    Q params trained jointly in the same Adam (pushed into t.params). Task draws identical
//    to U60 (quarter bookkeeping consumes no dataRng) so the diet sequence per seed matches.
//  D2 routing: quarter grad enters as the carry-grad (dc) argument of inSeqBackward for fw2
//    (same slot that carries round-2→round-1 context grads); Q's own grads are standard
//    linear-softmax CE. inCELossGrad reused for 4-class quarter logits.
//  D3 readout: QUARTER-READOUT diagnostic on frozen priced trunks (clean-rot probe streams):
//    carry-Q accuracy vs 25% chance (qk-echo ceiling ~50% discussed in closeout, not gated).
//
// RUN (execute_js, fs in scope; ONLY under fresh countersign):
//   const src = await fs.readTextFile("src/evidence/decomp/newai-selfu60b-driver.js");
//   (0, eval)(src + "\n//# sourceURL=newai-selfu60b-driver.js");
//   await globalThis.SelfU60bInit(fs);
//   await globalThis.runU60bWave0(fs, log);
//   await globalThis.runU60bTrain(fs, log);
//   await globalThis.runU60bProbes(fs, log);
//   await globalThis.runU60bVerdict(fs, log);
globalThis.SelfU60bInit = async function (fs) {
  const u60src = await fs.readTextFile("src/evidence/decomp/newai-selfu60-driver.js");
  (0, eval)(u60src + "\n//# sourceURL=newai-selfu60-driver.js");
  await globalThis.SelfU60Init(fs);
  for (const f of ["u60TrainOneStep", "u60RegimeRow", "u60BlockBounds", "u60Quarter", "u60LoadRegime", "u60EvalMasks", "u60StreamQV", "runU60Wave0"]) {
    if (typeof globalThis[f] === "undefined" && typeof eval(f) === "undefined")
      throw new Error("U60b stack load failed: missing " + f);
  }
};
const U60B_EXPECT_STACK = "258d2f060684ce382778e203959ab791abb5df79af174deef19ff568886d4d6e";
const U60B_AUXQW = 0.5;
const U60B_TRUNKS = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19];
const U60B_STREAMS = 80;
const U60B_CELLS = ["clean-stat", "noisy-stat", "clean-rot", "noisy-rot"];
function u60bPricedPath(seed) { return "src/evidence/decomp/d-newai-self-u60b-priced-s" + seed + "-800st.json"; }
function u60bProbePath(trunk, cell) { return "src/evidence/decomp/d-newai-self-u60b-probes-t" + trunk + "-c" + cell + ".json"; }
const U60B_WAVE0_PATH = "src/evidence/decomp/d-newai-self-u60b-wave0.json";
const U60B_VERDICT_PATH = "src/evidence/decomp/d-newai-self-u60b-verdict.json";
function u60bMakeQ(G, seed) {
  const rng = G.makeRng(96000 + seed);
  const w = new Float64Array(32), b = new Float64Array(4);
  for (let i = 0; i < 32; i++) w[i] = (rng.int(2001) - 1000) / 10000; // [-0.1, 0.1]
  return { w: { v: w, g: new Float64Array(32) }, b: { v: b, g: new Float64Array(4) } };
}
function u60bQLoss(Q, cNew, q) {
  const logits = new Float64Array(4);
  for (let o = 0; o < 4; o++) { let s = Q.b.v[o]; for (let d = 0; d < 8; d++) s += Q.w.v[o * 8 + d] * cNew[d]; logits[o] = s; }
  const ce = inCELossGrad(logits, q);
  return { loss: ce.loss, d: ce.d };
}
// Priced train step: verbatim u60TrainOneStep + quarter term routed via fw2 carry-grad slot.
function u60bTrainOneStep(M, params, opt, dataRng, fixedMasks, G, seed, step, Q, auxQW) {
  const B = 16, C = 6, auxW = 0.5, lam = 2.0, K = 5;
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  let lsum = 0, qsum = 0;
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
    let dcQ = null;
    if (auxQW > 0) {
      const j = Math.floor(n / 400);
      const bj = u60BlockBounds(G, seed, j);
      const q = u60Quarter(bj, n % 400);
      const qr = u60bQLoss(Q, fw2.cNew, q);
      qsum += qr.loss;
      const sc = auxQW / B;
      const d = new Float64Array(4); for (let o = 0; o < 4; o++) d[o] = qr.d[o] * sc;
      for (let o = 0; o < 4; o++) { Q.b.g[o] += d[o]; for (let dd = 0; dd < 8; dd++) Q.w.g[o * 8 + dd] += d[o] * fw2.cNew[dd]; }
      dcQ = new Float64Array(8);
      for (let dd = 0; dd < 8; dd++) { let s = 0; for (let o = 0; o < 4; o++) s += Q.w.v[o * 8 + dd] * d[o]; dcQ[dd] = s; }
    }
    const dc = inSeqBackward(M, fw2, dMean2, perHead2, null, dcQ, fixedMasks);
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
  return { loss: lsum / B, qloss: qsum / B, gnorm };
}
function u60bLoadPriced(M, led) {
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(M.E, led.P.E); load(M.W1, led.P.W1); load(M.b1, led.P.b1);
  load(M.Wf, led.P.Wf); load(M.bf, led.P.bf); load(M.Wc, led.P.Wc); load(M.bc, led.P.bc);
  for (let k = 0; k < 5; k++) { load(M.Wh[k], led.P.Wh[k]); load(M.bh[k], led.P.bh[k]); }
  load(M.Hv, led.P.Hv); load(M.bv, led.P.bv);
}
globalThis.runU60bWave0 = async function (fs, log) {
  try { const prev = JSON.parse(await fs.readTextFile(U60B_WAVE0_PATH)); if (prev && prev.verdict === "COMPLETE") { log(U60B_WAVE0_PATH + " exists, skip"); return prev; } } catch (e) {}
  const h = await globalThis.u33StackHash(fs);
  if (h.hex !== U60B_EXPECT_STACK) throw new Error("U60b-PIN HALT: stack drift " + h.hex.slice(0, 16));
  const G = await globalThis.IntrinsicInit(fs);
  log("u60b-wave0 stack PIN ok");
  // twin determinism: sampler + Q-init.
  for (const seed of [0, 1]) {
    const Q1 = u60bMakeQ(G, seed), Q2 = u60bMakeQ(G, seed);
    let same = Q1.w.v.length === Q2.w.v.length;
    for (let i = 0; i < 32 && same; i++) if (Q1.w.v[i] !== Q2.w.v[i]) same = false;
    if (!same) throw new Error("U60b Wave-0 HALT: Q-init not reproducible seed=" + seed);
  }
  log("u60b-wave0 Q-init reproducible");
  // AUX-PRICE gate: one priced step vs one unpriced step from twin stacks must differ in Wf/Wc grads.
  {
    const tA = await u32FreshStack(fs, 0);
    const tB = await u32FreshStack(fs, 0);
    const QA = u60bMakeQ(tA.G, 0);
    tA.params.push(QA.w, QA.b);
    for (const p of tA.params) p.g.fill(0);
    for (const p of tB.params) p.g.fill(0);
    u60bTrainOneStep(tA.M, tA.params, tA.opt, tA.dataRng, tA.fixedMasks, tA.G, 0, 0, QA, U60B_AUXQW);
    u60bTrainOneStep(tB.M, tB.params, tB.opt, tB.dataRng, tB.fixedMasks, tB.G, 0, 0, u60bMakeQ(tB.G, 0), 0);
    const gA = tA.M.Wf.g, gB = tB.M.Wf.g;
    let md = 0;
    for (let i = 0; i < gA.length; i++) { const d = Math.abs(gA[i] - gB[i]); if (d > md) md = d; }
    let qg = 0; for (let i = 0; i < 32; i++) qg += Math.abs(QA.w.g[i]);
    log("u60b-wave0 aux-price: Wf-grade-diff=" + md + " Q-grad-mass=" + qg.toFixed(6));
    if (!(md > 0)) throw new Error("U60b Wave-0 HALT-PRICE: quarter price does not reach carry path");
    if (!(qg > 0)) throw new Error("U60b Wave-0 HALT-PRICE: Q probe learns nothing");
  }
  log("u60b-wave0 AUX-PRICE gate PASS (price reaches carry)");
  // dry-run: priced step + probe crash-test on canon trunk 0 (reads only).
  {
    const t = await u32FreshStack(fs, 0);
    const Q = u60bMakeQ(t.G, 0);
    t.params.push(Q.w, Q.b);
    for (const p of t.params) p.g.fill(0);
    const r = u60bTrainOneStep(t.M, t.params, t.opt, t.dataRng, t.fixedMasks, t.G, 0, 0, Q, U60B_AUXQW);
    log("u60b-wave0 priced dry-step loss=" + r.loss.toFixed(4) + " qloss=" + r.qloss.toFixed(4));
  }
  const body = { spec: "self-u60b-priced-prereg", track: "U60b-PRICED", wave: 0, verdict: "COMPLETE", stackHash: h.hex, auxQW: U60B_AUXQW };
  await fs.writeTextFile(U60B_WAVE0_PATH, JSON.stringify(body));
  return body;
};
globalThis.runU60bTrain = async function (fs, log) {
  const h = await globalThis.u33StackHash(fs);
  if (h.hex !== U60B_EXPECT_STACK) throw new Error("U60b-PIN HALT: stack drift");
  for (const seed of U60B_TRUNKS) {
    const path = u60bPricedPath(seed);
    try { const prev = JSON.parse(await fs.readTextFile(path)); if (prev && prev.verdict === "COMPLETE") { log(path + " exists, skip"); continue; } } catch (e) {}
    const t = await u32FreshStack(fs, seed);
    const Q = u60bMakeQ(t.G, seed);
    t.params.push(Q.w, Q.b);
    const P0 = u32SnapshotParams(t.M);
    const Q0 = { w: Array.from(Q.w.v), b: Array.from(Q.b.v) };
    const steps = 800, t0 = Date.now(), curve = [], qcurve = [];
    for (let step = 0; step < steps; step++) {
      for (const p of t.params) p.g.fill(0);
      const r = u60bTrainOneStep(t.M, t.params, t.opt, t.dataRng, t.fixedMasks, t.G, seed, step, Q, U60B_AUXQW);
      if (step % 100 === 0 || step === steps - 1) { curve.push({ step, loss: +r.loss.toFixed(6) }); qcurve.push({ step, qloss: +r.qloss.toFixed(6) }); }
      if (step % 200 === 0) log("u60b-train s" + seed + " step " + step + "/800 loss=" + r.loss.toFixed(4) + " qloss=" + r.qloss.toFixed(4));
    }
    const P = u32SnapshotParams(t.M);
    const Qf = { w: Array.from(Q.w.v), b: Array.from(Q.b.v) };
    const divCos = (typeof inMeanCos === "function") ? +inMeanCos(t.M).toFixed(4) : null;
    const body = { spec: "self-u60b-priced-prereg", track: "U60b-PRICED", kind: "priced", seed, steps, B: 16, lr: 5e-3, K: 5, H: 48, C: 6, auxW: 0.5, lam: 2.0, auxQW: U60B_AUXQW, verdict: "COMPLETE", recipeMatch: "U60 regime recipe + aux quarter-loss on carry", stackHash: h.hex, wallMs: Date.now() - t0, frozen: true, curve, qcurve, divCos, P0, P, Q0, Q: Qf };
    await fs.writeTextFile(path, JSON.stringify(body));
    log("u60b-train s" + seed + " COMPLETE loss0=" + curve[0].loss + " lossN=" + curve[curve.length - 1].loss + " qlossN=" + qcurve[qcurve.length - 1].qloss);
  }
  return "ALL-PRICED-TRAINS-COMPLETE";
};
globalThis.runU60bProbes = async function (fs, log) {
  const h = await globalThis.u33StackHash(fs);
  if (h.hex !== U60B_EXPECT_STACK) throw new Error("U60b-PIN HALT: stack drift");
  const G = await globalThis.IntrinsicInit(fs);
  for (const trunk of U60B_TRUNKS) {
    const led = JSON.parse(await fs.readTextFile(u60bPricedPath(trunk)));
    const M = inSeqMakeModel(G.makeRng(1));
    u60bLoadPriced(M, led);
    const evalMasks = u60EvalMasks(G, trunk);
    const b = u58Boundaries(G, trunk);
    for (const cell of U60B_CELLS) {
      const path = u60bProbePath(trunk, cell);
      try { const prev = JSON.parse(await fs.readTextFile(path)); if (prev && prev.verdict === "COMPLETE") { log(path + " exists, skip"); continue; } } catch (e) {}
      const streams = [];
      for (let s = 0; s < U60B_STREAMS; s++) {
        const rng = G.makeRng(62000 + trunk * 1000 + U60B_CELLS.indexOf(cell) * 100 + s);
        u58RunStream._b = b;
        const r = u58RunStream(M, evalMasks, rng, cell);
        streams.push({ s, meanErr: +r.meanErr.toFixed(5), aval: +r.aval.toFixed(5), bspikes: r.bspikes.map((v) => +v.toFixed(5)), bresp: +r.bresp.toFixed(5) });
      }
      await fs.writeTextFile(path, JSON.stringify({ spec: "self-u60b-priced-prereg", track: "U60b-PRICED", trunk, cell, verdict: "COMPLETE", stackHash: h.hex, boundaries: b, n: 400, streamsPerCell: U60B_STREAMS, streams }));
      log("u60b-probes t" + trunk + " " + cell + " COMPLETE (80 streams)");
    }
  }
  return "ALL-PROBES-COMPLETE";
};
globalThis.runU60bVerdict = async function (fs, log) {
  const u60w0 = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-u60-wave0.json"));
  const cmax = u60w0.canonBand.max, cmean = u60w0.canonBand.mean;
  const G = await globalThis.IntrinsicInit(fs);
  // MANIP guard first (filed order): priced-trunk qv vs FILED canon band (reuse, same operator).
  const manip = [];
  for (const trunk of U60B_TRUNKS) {
    const led = JSON.parse(await fs.readTextFile(u60bPricedPath(trunk)));
    const M = inSeqMakeModel(G.makeRng(1));
    u60bLoadPriced(M, led);
    const evalMasks = u60EvalMasks(G, trunk);
    const b = u58Boundaries(G, trunk);
    let s = 0;
    for (let st = 0; st < U60B_STREAMS; st++) {
      const rng = G.makeRng(62000 + trunk * 1000 + U60B_CELLS.indexOf("clean-rot") * 100 + st);
      s += u60StreamQV(M, evalMasks, rng, b);
    }
    const qv = s / U60B_STREAMS;
    manip.push({ trunk, qv: +qv.toFixed(6), pass: qv > cmax });
    log("u60b-manip t" + trunk + " qv=" + qv.toFixed(6) + (qv > cmax ? " PASS" : " fail") + " (canon max " + cmax.toFixed(6) + ")");
  }
  const manipN = manip.filter((x) => x.pass).length;
  // QUARTER-READOUT diagnostic (report, NO quorum): carry-Q accuracy on clean-rot probe rows.
  const readout = [];
  for (const trunk of U60B_TRUNKS) {
    const led = JSON.parse(await fs.readTextFile(u60bPricedPath(trunk)));
    const M = inSeqMakeModel(G.makeRng(1));
    u60bLoadPriced(M, led);
    const Qw = led.Q.w, Qb = led.Q.b;
    const evalMasks = u60EvalMasks(G, trunk);
    const b = u58Boundaries(G, trunk);
    let hit = 0, tot = 0;
    for (let st = 0; st < 8; st++) {
      const rng = G.makeRng(62000 + trunk * 1000 + U60B_CELLS.indexOf("clean-rot") * 100 + st);
      for (let r = 0; r < 400; r++) {
        const q = u60Quarter(b, r);
        const row = u58Row(rng, false, [[0, 1], [2, 3], [0, 1], [2, 3]][q]);
        const fw1 = inSeqForward(M, row.x, new Float64Array(8), evalMasks);
        const vhat = u58Argmax4(fw1.hvLog);
        const x2m = [9, 9, 9, 9, 9, 9, row.qk, row.k, vhat, 8];
        const fw2 = inSeqForward(M, x2m, fw1.cNew, evalMasks);
        let bo = 0, bv = -Infinity;
        for (let o = 0; o < 4; o++) { let s2 = Qb[o]; for (let d = 0; d < 8; d++) s2 += Qw[o * 8 + d] * fw2.cNew[d]; if (s2 > bv) { bv = s2; bo = o; } }
        if (bo === q) hit++;
        tot++;
      }
    }
    readout.push({ trunk, acc: +(hit / tot).toFixed(4) });
  }
  const racc = readout.reduce((a, x) => a + x.acc, 0) / readout.length;
  log("u60b-readout mean carry-Q quarter accuracy=" + racc.toFixed(4) + " (chance 0.25, qk-echo ceiling ~0.50)");
  const perTrunk = [];
  for (const trunk of U60B_TRUNKS) {
    const L = {};
    for (const cell of U60B_CELLS) L[cell] = JSON.parse(await fs.readTextFile(u60bProbePath(trunk, cell)));
    const pin = U60B_CELLS.every((c) => L[c].stackHash === U60B_EXPECT_STACK);
    const vec = { aval: [], bsw: [], merr: [], cellOf: [] };
    for (const cell of U60B_CELLS) for (const st of L[cell].streams) {
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
  else if (manipN < 15) { verdict = "MANIP-FAIL"; cause = "pressure never installed even priced (" + manipN + "/20 above canon max)"; }
  else if (uwT >= 6) { verdict = "UNDERPOWERED"; cause = "precision (fixed-tolerance POWER trip on 6+ trunks)"; }
  else if (ndN < 15) { verdict = "DET3b-COLLAPSED"; cause = "nondegeneracy"; }
  else if (disN < 15) { verdict = "DET3b-ENTANGLED"; cause = "dissociation (need 4/5 at quorum)"; }
  else if (indN < 15) { verdict = "DET3b-ENTANGLED"; cause = "independence (|r|>=0.7)"; }
  else { verdict = "DET3b-HEALTHY"; cause = "priced regime pressure installs carry marking"; }
  const body = { spec: "self-u60b-priced-prereg", track: "U60b-PRICED", verdict, cause, manip: { pass: manipN + "/20", canonMax: cmax, canonMean: cmean, perTrunk: manip }, readout: { meanAcc: +racc.toFixed(4), chance: 0.25, perTrunk: readout }, bars: { "DET3b-PIN": pinN + "/20", "DET3b-MANIP": manipN + "/20", "DET3b-NONDEGEN": ndN + "/20", "DET3b-DISSOCIATE": disN + "/20", "DET3b-INDEPEND": indN + "/20", "DET3b-POWER": (20 - uwT) + "/20 (non-underpowered)" }, perTrunk };
  await fs.writeTextFile(U60B_VERDICT_PATH, JSON.stringify(body));
  log("u60b-verdict " + verdict + " cause=" + cause);
  return body;
};
