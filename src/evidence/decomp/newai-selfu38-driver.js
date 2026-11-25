// newai-selfu38-driver.js — U38 state-conditioned gate + low-cue arm.
//
// Licensed by U37 SCHED-ONLY (global scorer knobs hollow) + Turn-164 paper
// re-read (Zheng #1 state-conditioned gate; McNab predictivity; Liu boundary
// low-cue regime) + Turn-165 triple-check (STANDS, low-cue arm mandatory).
// NO stack surgery; stackHash stays 258d2f06…. H48 only. CPU/in-worker.
// COMPLETE-gated, resume skips COMPLETE. NO PUSH.
//
// Gate (21 params: gw[20], gb; init zeros → g=0.5, deterministic, filed L3):
//   inp = [E[qk] (12-dim query embedding) | cNew (8-dim round-1 carry-out)],
//   g = sigmoid(w·inp + b), round-2 context cNew' = g · cNew (elementwise).
//   Gate grads flow through BOTH paths (gated context + gate input, incl. the
//   extra E[qk] embedding grad). Oracle path gated with its own g
//   (arm-consistent scorer). fwd/base-k0 eval has no round-2, ungated.
//
// D1 (filed in prereg §Design + here): diet extends frozen U36-D1 with a 12.5%
// MISMATCH slice (roll 7/8): clean round-1 on eA (vhat_A, label y_A) but the
// round-2 context comes from a donor forward on eB (cNew_B); gate input is
// [E[qk_A] | cNew_B]. BOTH arms share every row (c0 trains mismatch rows with
// the gate fixed open = robustness control), so COMPOSE still isolates the
// gate. Rolls (dataRng.int(8)): 0-3 base pick-max (50%), 4-5 OOD qk!=v
// pick-max (25%), 6 uniform-pick (12.5%), 7 mismatch (12.5%, single draws).
//
// c0 control: diverse diet + NO gate (g≡1, no gate params).
// c1 primary: diverse diet + learned gate (same Adam, init zeros).
// Every train ledger carries stackHash + P0/P + Gate0/Gate + u38DriverHash.
//
// RUN (execute_js, fs in scope):
//   const src = await fs.readTextFile("src/evidence/decomp/newai-selfu38-driver.js");
//   (0, eval)(src + "\n//# sourceURL=newai-selfu38-driver.js");
//   await globalThis.SelfU38Init(fs);
//   const log = (m) => console.log(m);
//   await globalThis.runU38Wave0(fs, log);
//   await globalThis.runU38Train(fs, log, {seed, arm});  // arm c0|c1
//   await globalThis.runU38Eval(fs, log, {seed, arm});
//   await globalThis.runU38Verdict(fs, log);
globalThis.SelfU38Init = async function (fs) {
  const src = await fs.readTextFile("src/evidence/decomp/newai-selfu36-driver.js");
  (0, eval)(src + "\n//# sourceURL=newai-selfu36-driver.js");
  await globalThis.SelfU36Init(fs);
  if (typeof globalThis.u36HeadArgs !== "function") throw new Error("u38 stack load failed");
};
const U38_EXPECT_STACK = "258d2f060684ce382778e203959ab791abb5df79af174deef19ff568886d4d6e";
function u38TrainPath(seed, arm) { return "src/evidence/decomp/d-newai-self-u38-" + arm + "-s" + seed + "-800st.json"; }
function u38EvalPath(seed, arm) { return "src/evidence/decomp/d-newai-self-u38-eval-" + arm + "-s" + seed + "-800st.json"; }
const U38_VERDICT_PATH = "src/evidence/decomp/d-newai-self-u38-verdict.json";
const U38_WAVE0_PATH = "src/evidence/decomp/d-newai-self-u38-wave0.json";
function u38Sig(s) { return 1 / (1 + Math.exp(-s)); }
function u38MakeGate() { return { w: { v: new Float64Array(20), g: new Float64Array(20) }, b: { v: new Float64Array([0]), g: new Float64Array(1) } }; }
// Gate forward: returns {inp[20], s, g}. Reads live M.E.
function u38GateFwd(M, gate, qk, cNew) {
  const inp = new Float64Array(20);
  for (let d = 0; d < 12; d++) inp[d] = M.E.v[qk * 12 + d];
  for (let d = 0; d < 8; d++) inp[12 + d] = cNew[d];
  let s = gate.b.v[0];
  for (let i = 0; i < 20; i++) s += gate.w.v[i] * inp[i];
  return { inp, s, g: u38Sig(s) };
}
// Diet pick. Returns {eA, eB|null, mismatch} — eA carries labels (v/y/qk/k).
function u38PickDiet(M, dataRng, fixedMasks) {
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
// Production step. useGate=false (c0): g≡1, no gate grads.
function u38TrainOneStep(M, params, gate, opt, dataRng, fixedMasks, useGate) {
  const B = 16, auxW = 0.5, lam = 2.0, K = 5;
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  let lsum = 0;
  for (let b = 0; b < B; b++) {
    const { eA, eB, mismatch } = u38PickDiet(M, dataRng, fixedMasks);
    const e = eA;
    const fw1 = inSeqForward(M, e.x, new Float64Array(8), fixedMasks);
    const ceHv = inCELossGrad(fw1.hvLog, e.v);
    const dHv = new Float64Array(4); for (let o = 0; o < 4; o++) dHv[o] = ceHv.d[o] * auxW / B;
    const vhat = argmax4(fw1.hvLog);
    // Context + gate input (clean or donor).
    let cCtx, gInfo;
    if (mismatch) {
      const fwB = inSeqForward(M, eB.x, new Float64Array(8), fixedMasks);
      cCtx = fwB.cNew;
      if (useGate) {
        gInfo = u38GateFwd(M, gate, e.qk, cCtx);
        gInfo.fwB = fwB;
      }
      // fwB params get carry-grad only (its hv/logits unused) — handled below.
      if (!useGate) gInfo = { g: 1, fwB };
      else gInfo.donor = true;
    } else {
      cCtx = fw1.cNew;
      gInfo = useGate ? u38GateFwd(M, gate, e.qk, cCtx) : { g: 1 };
    }
    const g = gInfo.g;
    const cGated = new Float64Array(8);
    for (let d = 0; d < 8; d++) cGated[d] = g * cCtx[d];
    const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
    const fw2 = inSeqForward(M, x2m, cGated, fixedMasks);
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
    const dcGated = inSeqBackward(M, fw2, dMean2, perHead2, null, null, fixedMasks);
    // Gate backward (both paths) — c0 skips (g≡1, no params).
    let dcForClean = dcGated;
    if (useGate) {
      let dot = 0;
      for (let d = 0; d < 8; d++) dot += dcGated[d] * cCtx[d];
      const dLds = dot * g * (1 - g);
      for (let i = 0; i < 20; i++) gate.w.g[i] += dLds * gInfo.inp[i] / B;
      gate.b.g[0] += dLds / B;
      // Extra E[qk] grad (gate path).
      for (let d = 0; d < 12; d++) M.E.g[e.qk * 12 + d] += dLds * gate.w.v[d] / B;
      // Total carry grad = context path + gate-input path.
      const dcTot = new Float64Array(8);
      for (let d = 0; d < 8; d++) dcTot[d] = (g * dcGated[d] + dLds * gate.w.v[12 + d]) / B;
      // NOTE: M.E.g scale — E grads elsewhere are per-batch sums; divide by B
      // here to match the dMean/B convention of this step (filed micro-choice).
      if (mismatch) {
        inSeqBackward(M, gInfo.fwB, null, null, null, dcTot, fixedMasks);
        inSeqBackward(M, fw1, dMean1, perHead1, dHv, null, fixedMasks);
      } else {
        inSeqBackward(M, fw1, dMean1, perHead1, dHv, dcTot, fixedMasks);
      }
      dcForClean = null;
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
    void dcForClean;
    const meanW = new Float64Array(M.Wh[0].v.length);
    for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) meanW[i] += M.Wh[k].v[i] / K;
    for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) M.Wh[k].g[i] += lam * (M.Wh[k].v[i] - meanW[i]) / (B * M.H);
  }
  const plist = useGate ? params.concat([gate.w, gate.b]) : params;
  let s = 0;
  for (const p of plist) for (let i = 0; i < p.g.length; i++) s += p.g[i] * p.g[i];
  const n = Math.sqrt(s);
  if (n > 1.0) { const sc = 1.0 / n; for (const p of plist) for (let i = 0; i < p.g.length; i++) p.g[i] *= sc; }
  let gnorm = 0;
  for (const p of plist) for (let i = 0; i < p.g.length; i++) gnorm += p.g[i] * p.g[i];
  gnorm = Math.sqrt(gnorm);
  opt.step(plist);
  return { loss: lsum / B, gnorm };
}
// Wave 0: (a) isolated gate gradcheck (absolute); (b) twin determinism incl. gate.
globalThis.runU38Wave0 = async function (fs, log) {
  try { const prev = JSON.parse(await fs.readTextFile(U38_WAVE0_PATH)); if (prev && prev.verdict === "COMPLETE") { log(U38_WAVE0_PATH + " exists, skip"); return prev; } } catch (e) {}
  const G0 = await globalThis.IntrinsicInit(fs);
  const grng = G0.makeRng(38123);
  let wworst = 0, nbad = 0;
  const NT = 16, eeps = 1e-6;
  for (let t = 0; t < NT; t++) {
    const inp = new Float64Array(20), w = new Float64Array(20);
    for (let i = 0; i < 20; i++) { inp[i] = (grng.int(2000) - 1000) / 500; w[i] = (grng.int(2000) - 1000) / 2000; }
    const bb = (grng.int(2000) - 1000) / 2000;
    const c = new Float64Array(8), dc = new Float64Array(8);
    for (let d = 0; d < 8; d++) { c[d] = (grng.int(2000) - 1000) / 500; dc[d] = (grng.int(2000) - 1000) / 500; }
    for (let d = 0; d < 8; d++) inp[12 + d] = c[d]; // real setting: shared variable
    let s = bb; for (let i = 0; i < 20; i++) s += w[i] * inp[i];
    const g = u38Sig(s);
    const L = (() => { let q = 0; for (let d = 0; d < 8; d++) q += dc[d] * g * c[d]; return q; })();
    void L;
    const gg = g * (1 - g);
    let dot = 0; for (let d = 0; d < 8; d++) dot += dc[d] * c[d];
    // Tie check to the real setting: inp[12+d] IS c[d] (shared variable), so
    // joint-perturb c below and compare against the total analytic (both paths).
    const dLds = dot * gg;
    const anaW = [], anaInp = [], anaC = [];
    for (let i = 0; i < 20; i++) { anaW.push(dLds * inp[i]); anaInp.push(dLds * w[i]); }
    const anaB = dLds;
    for (let d = 0; d < 8; d++) anaC.push(g * dc[d] + dLds * w[12 + d]);
    const lossOf = (ww, bbb, cc, ii) => {
      let ss = bbb; for (let j = 0; j < 20; j++) ss += ww[j] * ii[j];
      const ggg = u38Sig(ss);
      let q = 0; for (let d = 0; d < 8; d++) q += dc[d] * ggg * cc[d];
      return q;
    };
    for (let i = 0; i < 20; i++) {
      const a0 = w[i];
      w[i] = a0 + eeps; const lp = lossOf(w, bb, c, inp);
      w[i] = a0 - eeps; const lm = lossOf(w, bb, c, inp);
      w[i] = a0;
      const num = (lp - lm) / (2 * eeps);
      const rel = Math.abs(anaW[i] - num) / Math.max(1e-8, Math.abs(anaW[i]) + Math.abs(num));
      if (rel > wworst) wworst = rel;
      if (rel > 1e-5) nbad++;
    }
    {
      const lp = lossOf(w, bb + eeps, c, inp), lm = lossOf(w, bb - eeps, c, inp);
      const num = (lp - lm) / (2 * eeps);
      const rel = Math.abs(anaB - num) / Math.max(1e-8, Math.abs(anaB) + Math.abs(num));
      if (rel > wworst) wworst = rel;
      if (rel > 1e-5) nbad++;
    }
    for (let d = 0; d < 8; d++) {
      const a0 = c[d];
      c[d] = a0 + eeps; inp[12 + d] = a0 + eeps; const lp = lossOf(w, bb, c, inp);
      c[d] = a0 - eeps; inp[12 + d] = a0 - eeps; const lm = lossOf(w, bb, c, inp);
      c[d] = a0; inp[12 + d] = a0;
      const num = (lp - lm) / (2 * eeps);
      const rel = Math.abs(anaC[d] - num) / Math.max(1e-8, Math.abs(anaC[d]) + Math.abs(num));
      if (rel > wworst) wworst = rel;
      if (rel > 1e-5) nbad++;
    }
    for (let i = 0; i < 20; i++) {
      const a0 = inp[i];
      inp[i] = a0 + eeps; const lp = lossOf(w, bb, c, inp);
      inp[i] = a0 - eeps; const lm = lossOf(w, bb, c, inp);
      inp[i] = a0;
      const num = (lp - lm) / (2 * eeps);
      const rel = Math.abs(anaInp[i] - num) / Math.max(1e-8, Math.abs(anaInp[i]) + Math.abs(num));
      if (rel > wworst) wworst = rel;
      if (rel > 1e-5) nbad++;
    }
  }
  const gradPass = nbad === 0;
  log("u38-wave0 gate-gradcheck worst=" + wworst.toExponential(2) + " nBad=" + nbad + "/" + (NT * 49));
  if (!gradPass) throw new Error("U38 Wave-0 HALT: gate gradcheck FAIL worst=" + wworst);
  const twins = [];
  for (const arm of ["c0", "c1"]) {
    for (const s of [0, 1, 2]) {
      const X = await globalThis.u32FreshStack(fs, s);
      const Y = await globalThis.u32FreshStack(fs, s);
      const Xg = u38MakeGate(), Yg = u38MakeGate();
      const p0 = globalThis.u32MaxAbsDiff(globalThis.u32SnapshotParams(X.M), globalThis.u32SnapshotParams(Y.M));
      let gmax = 0;
      for (let i = 0; i < 20; i++) gmax = Math.max(gmax, Math.abs(Xg.w.v[i] - Yg.w.v[i]));
      gmax = Math.max(gmax, Math.abs(Xg.b.v[0] - Yg.b.v[0]));
      for (const p of X.params) p.g.fill(0);
      for (const p of Y.params) p.g.fill(0);
      u38TrainOneStep(X.M, X.params, Xg, X.opt, X.dataRng, X.fixedMasks, arm === "c1");
      u38TrainOneStep(Y.M, Y.params, Yg, Y.opt, Y.dataRng, Y.fixedMasks, arm === "c1");
      const st = globalThis.u32MaxAbsDiff(globalThis.u32SnapshotParams(X.M), globalThis.u32SnapshotParams(Y.M));
      let gstep = 0;
      for (let i = 0; i < 20; i++) gstep = Math.max(gstep, Math.abs(Xg.w.v[i] - Yg.w.v[i]));
      gstep = Math.max(gstep, Math.abs(Xg.b.v[0] - Yg.b.v[0]));
      twins.push({ arm, seed: s, p0diff: p0.max, step1diff: st.max, gate0diff: gmax, gate1diff: gstep, pass: p0.max === 0 && st.max === 0 && gmax === 0 && gstep === 0 });
      log("u38-wave0 twin " + arm + " s" + s + " p0=" + p0.max + " step1=" + st.max + " gate1=" + gstep.toExponential(1));
      if (p0.max !== 0 || st.max !== 0 || gmax !== 0 || gstep !== 0) throw new Error("U38 Wave-0 HALT: twin nondeterminism " + arm + " s" + s);
    }
  }
  const body = { spec: "self-u38-stategate-prereg", wave: 0, verdict: "COMPLETE", gateGradcheck: { worst: wworst, nBad: nbad, pass: gradPass }, twins };
  await fs.writeTextFile(U38_WAVE0_PATH, JSON.stringify(body));
  log("u38-wave0 COMPLETE gate-grad + twins PASS");
  return body;
};
// Wave 1: trunk train per seed x arm.
globalThis.runU38Train = async function (fs, log, opts) {
  const { seed, arm } = opts;
  if (arm !== "c0" && arm !== "c1") throw new Error("arm must be c0|c1");
  const ledgerPath = u38TrainPath(seed, arm);
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  const h = await globalThis.u33StackHash(fs);
  if (h.hex !== U38_EXPECT_STACK) throw new Error("U38-PIN HALT: stack drift at train time " + h.hex.slice(0, 16));
  const drvSrc = await fs.readTextFile("src/evidence/decomp/newai-selfu38-driver.js");
  const drvHash = await u32Sha256Hex(drvSrc);
  const t = await globalThis.u32FreshStack(fs, seed);
  const P0 = globalThis.u32SnapshotParams(t.M);
  const gate = u38MakeGate();
  const Gate0 = Array.from(gate.w.v).concat(Array.from(gate.b.v));
  const steps = 800, t0 = Date.now(), curve = [], gateCurve = [];
  for (let step = 0; step < steps; step++) {
    for (const p of t.params) p.g.fill(0);
    gate.w.g.fill(0); gate.b.g.fill(0);
    const r = u38TrainOneStep(t.M, t.params, gate, t.opt, t.dataRng, t.fixedMasks, arm === "c1");
    if (step % 100 === 0 || step === steps - 1) {
      curve.push({ step, loss: +r.loss.toFixed(6) });
      if (arm === "c1") gateCurve.push({ step, b: +gate.b.v[0].toFixed(4), wMean: +([...gate.w.v].reduce((a, x) => a + Math.abs(x), 0) / 20).toFixed(4) });
    }
    if (step % 200 === 0) log("u38-train " + arm + " s" + seed + " step " + step + "/800 loss=" + r.loss.toFixed(4));
  }
  const P = globalThis.u32SnapshotParams(t.M);
  const Gate = Array.from(gate.w.v).concat(Array.from(gate.b.v));
  const body = {
    spec: "self-u38-stategate-prereg", track: "U38-STATEGATE", arm, seed, steps,
    B: 16, lr: 5e-3, K: 5, H: 48, C: 6, auxW: 0.5, lam: 2.0,
    diet: "U36-D1 + 12.5% mismatch (D1)", scorer: arm === "c1" ? "learned state gate [E[qk]|cNew] 21 params init 0" : "no gate (g=1)",
    bootstraps: "b%K slices (same as cur-pick)", verdict: "COMPLETE",
    recipeMatch: "C6/auxW0.5/800st/lam2.0/B16/lr5e-3/K5/H48/armCode76/diverse-diet+mismatch + " + (arm === "c1" ? "state-gate" : "no-gate"),
    stackHash: h.hex, stackFiles: h.perFile.map((f) => f.path), u38DriverHash: drvHash,
    wallMs: Date.now() - t0, curve, gateCurve, divCos: +inMeanCos(t.M).toFixed(4), P0, P, Gate0, Gate,
  };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("u38-train " + arm + " s" + seed + " COMPLETE loss0=" + curve[0].loss + " lossN=" + curve[curve.length - 1].loss + " divCos=" + body.divCos);
  return body;
};
// Wave 2: paired evals (standard + swapped-g + predictivity + lowcue + fF).
globalThis.runU38Eval = async function (fs, log, opts) {
  const { seed, arm } = opts;
  const trainPath = u38TrainPath(seed, arm), evalPath = u38EvalPath(seed, arm);
  try { const prev = JSON.parse(await fs.readTextFile(evalPath)); if (prev && prev.verdict === "COMPLETE") { log(evalPath + " exists, skip"); return prev; } } catch (e) {}
  const G = await globalThis.IntrinsicInit(fs);
  const tr = JSON.parse(await fs.readTextFile(trainPath));
  if (tr.verdict !== "COMPLETE") throw new Error("train ledger missing " + trainPath);
  const cur = await globalThis.u33StackHash(fs);
  if (cur.hex !== tr.stackHash) throw new Error("U38-PIN HALT: stack drift since train " + trainPath);
  const M = inSeqMakeModel(G.makeRng(1));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(M.E, tr.P.E); load(M.W1, tr.P.W1); load(M.b1, tr.P.b1);
  load(M.Wf, tr.P.Wf); load(M.bf, tr.P.bf); load(M.Wc, tr.P.Wc); load(M.bc, tr.P.bc);
  for (let k = 0; k < 5; k++) { load(M.Wh[k], tr.P.Wh[k]); load(M.bh[k], tr.P.bh[k]); }
  load(M.Hv, tr.P.Hv); load(M.bv, tr.P.bv);
  const gate = arm === "c1" ? { w: { v: Float64Array.from(tr.Gate.slice(0, 20)) }, b: { v: Float64Array.from(tr.Gate.slice(20, 21)) } } : null;
  const gOf = (qk, cNew) => {
    if (!gate) return 1;
    let s = gate.b.v[0];
    for (let d = 0; d < 12; d++) s += gate.w.v[d] * M.E.v[qk * 12 + d];
    for (let d = 0; d < 8; d++) s += gate.w.v[12 + d] * cNew[d];
    return u38Sig(s);
  };
  let evalMasks = null; { const fr = G.makeRng(91000 + seed); evalMasks = []; for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr.int(10) < 5 ? 2 : 0; evalMasks.push(m); } }
  const srng = G.makeRng(52500 + seed), frng = G.makeRng(52400 + seed), lowrng = G.makeRng(52600 + seed);
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  const N = 200;
  // Pass 1: round-1 on standard rows; store cNew/qk/vhat/rows + clean g.
  const rows = [];
  for (let i = 0; i < N; i++) {
    const e = inSeqGenShift(srng, null);
    const fw1 = inSeqForward(M, e.x, new Float64Array(8), evalMasks);
    const vhat = argmax4(fw1.hvLog);
    const g = gOf(e.qk, fw1.cNew);
    rows.push({ e, vhat, cNew: fw1.cNew.slice(), g });
  }
  const gCleanMean = rows.reduce((a, r) => a + r.g, 0) / N;
  // Swapped-g means (mismatch measurement, no round-2 needed).
  let gSwapMean = 0;
  for (let i = 0; i < N; i++) gSwapMean += gOf(rows[i].e.qk, rows[N - 1 - i].cNew);
  gSwapMean /= N;
  // Predictivity split on clean g median.
  const gs = rows.map((r) => r.g).sort((a, b) => a - b);
  const med = (gs[99] + gs[100]) / 2;
  let scr = 0, two = 0, twoOpen = 0, orc = 0, hiN = 0, hiHit = 0, loN = 0, loHit = 0;
  for (const r of rows) {
    const { e, vhat } = r;
    const fw1 = inSeqForward(M, e.x, new Float64Array(8), evalMasks);
    if (argmax4(fw1.hvLog) === e.v) scr++;
    const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
    const cG = new Float64Array(8);
    for (let d = 0; d < 8; d++) cG[d] = r.g * fw1.cNew[d];
    if (argmax4(inMeanLogits({ logitsK: inSeqForward(M, x2m, cG, evalMasks).logitsK })) === e.y) {
      two++;
      if (r.g > med) hiHit++; else loHit++;
    } else if (!(r.g > med)) { void 0; }
    if (r.g > med) hiN++; else loN++;
    if (arm === "c1") {
      if (argmax4(inMeanLogits({ logitsK: inSeqForward(M, x2m, fw1.cNew, evalMasks).logitsK })) === e.y) twoOpen++;
    } else twoOpen = two;
    const xo = [9, 9, 9, 9, 9, 9, e.qk, e.k, e.v, 8];
    const go = gOf(e.qk, fw1.cNew);
    const cGo = new Float64Array(8);
    for (let d = 0; d < 8; d++) cGo[d] = go * fw1.cNew[d];
    if (argmax4(inMeanLogits({ logitsK: inSeqForward(M, xo, cGo, evalMasks).logitsK })) === e.y) orc++;
  }
  const predGap = (hiN && loN) ? +(hiHit / hiN - loHit / loN).toFixed(4) : 0;
  // Low-cue rows: 3rd flat-position pair zeroed (positions 4,5 -> 9).
  let twoLow = 0, hiNL = 0, hiHitL = 0, loNL = 0, loHitL = 0;
  const gLows = [];
  const lowRows = [];
  for (let i = 0; i < N; i++) {
    const e0 = inSeqGenShift(lowrng, null);
    const flat = e0.x.slice(0, 6);
    flat[4] = 9; flat[5] = 9;
    const x = flat.concat([e0.qk, e0.k, 0, 8]);
    const e = { flat, qk: e0.qk, k: e0.k, v: e0.v, y: e0.y, x };
    const fw1 = inSeqForward(M, x, new Float64Array(8), evalMasks);
    const vhat = argmax4(fw1.hvLog);
    const g = gOf(e.qk, fw1.cNew);
    gLows.push(g);
    lowRows.push({ e, vhat, cNew: fw1.cNew.slice(), g });
  }
  const gl = gLows.sort((a, b) => a - b);
  const medL = (gl[99] + gl[100]) / 2;
  for (const r of lowRows) {
    const { e, vhat } = r;
    const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
    const cG = new Float64Array(8);
    for (let d = 0; d < 8; d++) cG[d] = r.g * r.cNew[d];
    const hit = argmax4(inMeanLogits({ logitsK: inSeqForward(M, x2m, cG, evalMasks).logitsK })) === e.y;
    if (hit) twoLow++;
    if (r.g > medL) { hiNL++; if (hit) hiHitL++; } else { loNL++; if (hit) loHitL++; }
  }
  const predGapLow = (hiNL && loNL) ? +(hiHitL / hiNL - loHitL / loNL).toFixed(4) : 0;
  let fF = 0;
  for (let i = 0; i < N; i++) {
    const e = inSeqGenShift(frng, 0);
    if (argmax4(inMeanLogits({ logitsK: inSeqForward(M, e.x, new Float64Array(8), evalMasks).logitsK })) === e.y) fF++;
  }
  const body = {
    spec: "self-u38-stategate-prereg", track: "U38-STATEGATE", arm, seed, steps: 800,
    verdict: "COMPLETE", n: N, frozenTest: true, evalOf: trainPath, stackHash: cur.hex,
    accScratch: +(scr / N).toFixed(4), accTwo: +(two / N).toFixed(4), accTwoOpen: +(twoOpen / N).toFixed(4),
    accOracle: +(orc / N).toFixed(4), accFwd: +(fF / N).toFixed(4),
    accTwoLow: +(twoLow / N).toFixed(4),
    gate: arm === "c1" ? { gCleanMean: +gCleanMean.toFixed(4), gSwapMean: +gSwapMean.toFixed(4), med: +med.toFixed(4), predGap, medLow: +medL.toFixed(4), predGapLow, w: Array.from(gate.w.v).map((x) => +x.toFixed(4)), b: +gate.b.v[0].toFixed(4) } : undefined,
  };
  await fs.writeTextFile(evalPath, JSON.stringify(body));
  log("u38-eval " + arm + " s" + seed + " scr=" + body.accScratch + " two=" + body.accTwo + " open=" + body.accTwoOpen + " orc=" + body.accOracle + " low=" + body.accTwoLow + (arm === "c1" ? " g=" + body.gate.gCleanMean + "/" + body.gate.gSwapMean + " pred=" + predGap + "/" + predGapLow : ""));
  return body;
};
// Verdict: PIN + COMPOSE + ABS + RET + ORACLE-CHECK + USES + SHUTS + PREDICTIVITY + LOWCUE + FLOOR.
globalThis.runU38Verdict = async function (fs, log) {
  const canonEv = [];
  for (const seed of [0, 1, 2]) canonEv.push(JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-u33-eval-canon-s" + seed + "-800st.json")));
  const perSeed = [];
  for (const seed of [0, 1, 2]) {
    const T = {}, E = {};
    for (const arm of ["c0", "c1"]) {
      T[arm] = JSON.parse(await fs.readTextFile(u38TrainPath(seed, arm)));
      E[arm] = JSON.parse(await fs.readTextFile(u38EvalPath(seed, arm)));
    }
    const pinHash = ["c0", "c1"].every((a) => T[a].stackHash === U38_EXPECT_STACK && E[a].stackHash === U38_EXPECT_STACK);
    const p0ok = ["c0", "c1"].every((a) => T[a].P0 && T[a].P && T[a].Gate0 && T[a].Gate);
    const e0 = E.c0, e1 = E.c1, eC = canonEv[seed];
    const dTwo = +(e1.accTwo - e0.accTwo).toFixed(4);
    const dAbs = +(e1.accTwo - eC.accTwo).toFixed(4);
    const gap0 = +(e0.accOracle - e0.accTwo).toFixed(4), gap1 = +(e1.accOracle - e1.accTwo).toFixed(4);
    const uses = +(e1.accTwo - e1.accTwoOpen).toFixed(4);
    const shuts = +(e1.gate.gSwapMean - e1.gate.gCleanMean).toFixed(4);
    perSeed.push({
      seed,
      pin: { match: pinHash && p0ok, pass: pinHash && p0ok },
      c0: { scr: e0.accScratch, two: e0.accTwo, orc: e0.accOracle, low: e0.accTwoLow },
      c1: { scr: e1.accScratch, two: e1.accTwo, open: e1.accTwoOpen, orc: e1.accOracle, low: e1.accTwoLow, gate: e1.gate },
      canon: { scr: eC.accScratch, two: eC.accTwo },
      compose: { dTwo, pass: dTwo >= 0.05 },
      abs: { dAbs, pass: dAbs >= 0.05 },
      ret: { dScr: +(e1.accScratch - e0.accScratch).toFixed(4), pass: e1.accScratch >= e0.accScratch - 0.03 },
      oracle: { gap1, gap0, dGap: +(gap1 - gap0).toFixed(4), pass: gap1 <= gap0 + 0.02 },
      uses: { d: uses, pass: uses >= 0.02 },
      shuts: { d: shuts, pass: shuts <= -0.20 },
      pred: { gap: e1.gate.predGap, pass: e1.gate.predGap >= 0.10 },
      lowcue: { gapLow: e1.gate.predGapLow, dLow: +(e1.accTwoLow - e0.accTwoLow).toFixed(4), pass: e1.gate.predGapLow >= 0.05 && e1.accTwoLow >= e0.accTwoLow - 0.03 },
      floor: { c0: e0.accScratch >= 0.50 && e0.accTwo >= 0.45, c1: e1.accScratch >= 0.50 && e1.accTwo >= 0.45 },
    });
    const r = perSeed[seed];
    log("u38-verdict s" + seed + " PIN=" + (r.pin.pass ? "ok" : "FAIL") +
      " canon=" + r.canon.scr + "/" + r.canon.two +
      " c0=" + r.c0.scr + "/" + r.c0.two + " c1=" + r.c1.scr + "/" + r.c1.two + "(open " + r.c1.open + ")" +
      " dTwo=" + dTwo + " dAbs=" + dAbs + " uses=" + uses + " shuts=" + shuts + " pred=" + r.pred.gap + " low=" + r.lowcue.gapLow + "/" + r.lowcue.dLow + " gap=" + gap1 + "vs" + gap0);
  }
  const q = (f) => perSeed.filter((s) => f(s)).length;
  const pinN = q((s) => s.pin.pass);
  const composeN = q((s) => s.compose.pass), absN = q((s) => s.abs.pass);
  const retN = q((s) => s.ret.pass), oracleN = q((s) => s.oracle.pass);
  const usesN = q((s) => s.uses.pass), shutsN = q((s) => s.shuts.pass);
  const predN = q((s) => s.pred.pass), lowN = q((s) => s.lowcue.pass);
  const floorN = q((s) => s.floor.c0 && s.floor.c1);
  let verdict = "";
  if (pinN < 3) verdict = "PIN-FAIL";
  else if (floorN < 3) verdict = "FLOOR-FAIL";
  else if (composeN < 2) verdict = "GATE-DEAD";
  else if (absN < 2 || retN < 2 || oracleN < 2 || usesN < 2 || shutsN < 2 || predN < 2 || lowN < 2) verdict = "GATE-PARTIAL";
  else verdict = "GATE-WORKS";
  const body = {
    spec: "self-u38-stategate-prereg", verdict,
    bars: {
      "U38-PIN": pinN + "/3 (stackHash " + U38_EXPECT_STACK.slice(0, 12) + "… all 6 ledgers + P0/P/Gate)",
      "U38-COMPOSE": composeN + "/3 (two_c1 − two_c0 ≥ +0.05, same diet)",
      "U38-ABS": absN + "/3 (two_c1 − two_canon ≥ +0.05)",
      "U38-RET": retN + "/3 (scr_c1 ≥ scr_c0 − 0.03)",
      "U38-ORACLE-CHECK": oracleN + "/3 (gap_c1 ≤ gap_c0 + 0.02)",
      "U38-GATE-USES": usesN + "/3 (two − twoOpen ≥ +0.02, same rows)",
      "U38-GATE-SHUTS": shutsN + "/3 (gSwap − gClean ≤ −0.20)",
      "U38-PREDICTIVITY": predN + "/3 (hi-g − lo-g ≥ +0.10, standard)",
      "U38-LOWCUE": lowN + "/3 (splitLow ≥ +0.05 AND two_c1_low ≥ two_c0_low − 0.03)",
      "U38-FLOOR": floorN + "/3 (scr ≥ 0.50, two ≥ 0.45, all 6 standard)",
      "U38-FRESH": "battery 3x IMPLEMENTABLE unanimous, 12/12 HEALTH, 3x SELFSERVED=serves -> v1.0 STANDS",
    },
    perSeed,
    deviations: ["D1 (diet, filed in prereg §Design + driver header): U36-D1 + 12.5% mismatch slice (roll 7/8, donor-context rows); both arms share it, COMPOSE still isolates the gate."],
  };
  await fs.writeTextFile(U38_VERDICT_PATH, JSON.stringify(body));
  log("u38-verdict " + verdict + " COMPOSE " + composeN + "/3 ABS " + absN + "/3 RET " + retN + "/3 ORACLE " + oracleN + "/3 USES " + usesN + "/3 SHUTS " + shutsN + "/3 PRED " + predN + "/3 LOW " + lowN + "/3 FLOOR " + floorN + "/3");
  return body;
};
