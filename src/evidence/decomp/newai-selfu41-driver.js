// newai-selfu41-driver.js — U41 corrected u38 step (single /B) + retrains + evals.
// Countersigned program Turn-179 (prereg v1.1 + battery 3x IMPLEMENTABLE).
// The ONLY recipe change vs u38: carry + gate grads divided by B once
// (dMean-style inputs already carry /B, like u32/u34/u36). Everything else
// byte-identical logic. Stack pin 258d2f06. COMPLETE-gated. NO PUSH.
//
// RUN (execute_js, fs in scope):
//   const src = await fs.readTextFile("src/evidence/decomp/newai-selfu41-driver.js");
//   (0, eval)(src + "\n//# sourceURL=newai-selfu41-driver.js");
//   await globalThis.SelfU41Init(fs);
//   const log = (m) => console.log(m);
//   await globalThis.runU41Wave0(fs, log);   // HALTs if R0 out of 0.5-2.0
//   await globalThis.runU41Train(fs, log, {seed, arm});
//   await globalThis.runU41Eval(fs, log, {seed, arm});
//   await globalThis.runU41Verdict(fs, log);
globalThis.SelfU41Init = async function (fs) {
  const src = await fs.readTextFile("src/evidence/decomp/newai-selfu38-driver.js");
  (0, eval)(src + "\n//# sourceURL=newai-selfu38-driver.js");
  await globalThis.SelfU38Init(fs);
};
const U41_EXPECT_STACK = "258d2f060684ce382778e203959ab791abb5df79af174deef19ff568886d4d6e";
function u41TrainPath(seed, arm) { return "src/evidence/decomp/d-newai-self-u41-" + arm + "-s" + seed + "-800st.json"; }
function u41EvalPath(seed, arm) { return "src/evidence/decomp/d-newai-self-u41-eval-" + arm + "-s" + seed + "-800st.json"; }
const U41_WAVE0_PATH = "src/evidence/decomp/d-newai-self-u41-wave0.json";
const U41_VERDICT_PATH = "src/evidence/decomp/d-newai-self-u41-verdict.json";
const u41Argmax4 = (a) => { let b = 0; for (let i = 0; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
// Corrected production step: u38TrainOneStep body with SINGLE /B.
function u41TrainOneStep(M, params, gate, opt, dataRng, fixedMasks, useGate) {
  const B = 16, auxW = 0.5, lam = 2.0, K = 5;
  const argmax4 = u41Argmax4;
  let lsum = 0;
  for (let b = 0; b < B; b++) {
    const { eA, eB, mismatch } = u38PickDiet(M, dataRng, fixedMasks);
    const e = eA;
    const fw1 = inSeqForward(M, e.x, new Float64Array(8), fixedMasks);
    const ceHv = inCELossGrad(fw1.hvLog, e.v);
    const dHv = new Float64Array(4); for (let o = 0; o < 4; o++) dHv[o] = ceHv.d[o] * auxW / B;
    const vhat = argmax4(fw1.hvLog);
    let cCtx, gInfo;
    if (mismatch) {
      const fwB = inSeqForward(M, eB.x, new Float64Array(8), fixedMasks);
      cCtx = fwB.cNew;
      gInfo = useGate ? u38GateFwd(M, gate, e.qk, cCtx) : { g: 1, fwB };
      if (useGate) { gInfo.fwB = fwB; gInfo.donor = true; }
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
    let dcForClean = dcGated;
    if (useGate) {
      let dot = 0;
      for (let d = 0; d < 8; d++) dot += dcGated[d] * cCtx[d];
      const dLds = dot * g * (1 - g);
      for (let i = 0; i < 20; i++) gate.w.g[i] += dLds * gInfo.inp[i];       // FIX: single /B (input already /B)
      gate.b.g[0] += dLds;                                                   // FIX: single /B
      for (let d = 0; d < 12; d++) M.E.g[e.qk * 12 + d] += dLds * gate.w.v[d]; // FIX: single /B
      const dcTot = new Float64Array(8);
      for (let d = 0; d < 8; d++) dcTot[d] = g * dcGated[d] + dLds * gate.w.v[12 + d]; // FIX
      if (mismatch) {
        inSeqBackward(M, gInfo.fwB, null, null, null, dcTot, fixedMasks);
        inSeqBackward(M, fw1, dMean1, perHead1, dHv, null, fixedMasks);
      } else {
        inSeqBackward(M, fw1, dMean1, perHead1, dHv, dcTot, fixedMasks);
      }
      dcForClean = null;
    } else {
      if (mismatch) {
        inSeqBackward(M, gInfo.fwB, null, null, null, dcGated, fixedMasks);  // FIX: single /B
        inSeqBackward(M, fw1, dMean1, perHead1, dHv, null, fixedMasks);
      } else {
        inSeqBackward(M, fw1, dMean1, perHead1, dHv, dcGated, fixedMasks);   // FIX: single /B
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

globalThis.runU41Wave0 = async function (fs, log) {
  try { const prev = JSON.parse(await fs.readTextFile(U41_WAVE0_PATH)); if (prev && prev.verdict === "COMPLETE") { log(U41_WAVE0_PATH + " exists, skip"); return prev; } } catch (e) {}
  const h = await globalThis.u33StackHash(fs);
  if (h.hex !== U41_EXPECT_STACK) throw new Error("U41-PIN HALT: stack drift " + h.hex.slice(0, 16));
  const G = await globalThis.IntrinsicInit(fs);
  const perSeed = [];
  for (const seed of [0, 1, 2]) {
    // twin 1-step determinism on corrected step.
    const mk = () => globalThis.u32FreshStack(fs, seed);
    const run1 = async () => {
      const t = await mk();
      const gate = u38MakeGate();
      for (const p of t.params) p.g.fill(0);
      u41TrainOneStep(t.M, t.params, gate, t.opt, t.dataRng, t.fixedMasks, true);
      return { P: globalThis.u32SnapshotParams(t.M), Gb: gate.b.v[0], Gw: Array.from(gate.w.v) };
    };
    const a = await run1(), b = await run1();
    let mx = 0;
    const flat = (v) => (Array.isArray(v) ? v.flat(Infinity) : [v]);
    for (const k of Object.keys(a.P)) { const f0 = flat(a.P[k]), f1 = flat(b.P[k]); for (let i = 0; i < f0.length; i++) mx = Math.max(mx, Math.abs(f0[i] - f1[i])); }
    for (let i = 0; i < 20; i++) mx = Math.max(mx, Math.abs(a.Gw[i] - b.Gw[i]));
    mx = Math.max(mx, Math.abs(a.Gb - b.Gb));
    // batch analytic-vs-FD on gate.b (corrected step): must be ~1.
    const t = await mk();
    const gate = u38MakeGate();
    for (const p of t.params) p.g.fill(0);
    const B = 16, batch = [];
    for (let i = 0; i < B; i++) batch.push(u38PickDiet(t.M, t.dataRng, t.fixedMasks));
    const lossOf = (bv) => {
      gate.b.v[0] = bv;
      let lsum = 0;
      for (const { eA, eB, mismatch } of batch) {
        const e = eA;
        const fw1 = inSeqForward(t.M, e.x, new Float64Array(8), t.fixedMasks);
        const vhat = u41Argmax4(fw1.hvLog);
        let cCtx;
        if (mismatch) cCtx = inSeqForward(t.M, eB.x, new Float64Array(8), t.fixedMasks).cNew;
        else cCtx = fw1.cNew;
        const gg = u38GateFwd(t.M, gate, e.qk, cCtx).g;
        const cG = new Float64Array(8); for (let d = 0; d < 8; d++) cG[d] = gg * cCtx[d];
        const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
        lsum += inCELossGrad(inMeanLogits({ logitsK: inSeqForward(t.M, x2m, cG, t.fixedMasks).logitsK }), e.y).loss;
      }
      return lsum / B;
    };
    // analytic: single corrected backward over the same batch.
    gate.b.v[0] = 0;
    for (let i = 0; i < B; i++) {
      const { eA, eB, mismatch } = batch[i];
      const e = eA;
      const fw1 = inSeqForward(t.M, e.x, new Float64Array(8), t.fixedMasks);
      const vhat = u41Argmax4(fw1.hvLog);
      let cCtx, gInfo;
      if (mismatch) {
        const fwB = inSeqForward(t.M, eB.x, new Float64Array(8), t.fixedMasks);
        cCtx = fwB.cNew; gInfo = u38GateFwd(t.M, gate, e.qk, cCtx); gInfo.fwB = fwB;
      } else { cCtx = fw1.cNew; gInfo = u38GateFwd(t.M, gate, e.qk, cCtx); }
      const gg = gInfo.g;
      const cG = new Float64Array(8); for (let d = 0; d < 8; d++) cG[d] = gg * cCtx[d];
      const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
      const fw2 = inSeqForward(t.M, x2m, cG, t.fixedMasks);
      const ce = inCELossGrad(inMeanLogits({ logitsK: fw2.logitsK }), e.y);
      const dM = new Float64Array(4); for (let o = 0; o < 4; o++) dM[o] = ce.d[o] / B;
      const z = [new Float64Array(4), new Float64Array(4), new Float64Array(4), new Float64Array(4), new Float64Array(4)];
      const dcG = inSeqBackward(t.M, fw2, dM, z, null, null, t.fixedMasks);
      let dot = 0; for (let d = 0; d < 8; d++) dot += dcG[d] * cCtx[d];
      gate.b.g[0] += dot * gg * (1 - gg);
    }
    const analytic = gate.b.g[0];
    const eps = 1e-4;
    const fd = (lossOf(eps) - lossOf(-eps)) / (2 * eps);
    gate.b.v[0] = 0;
    const R0 = analytic / fd;
    perSeed.push({ seed, twinMaxAbsDiff: mx, analytic: +analytic.toExponential(3), fd: +fd.toExponential(3), R0: +R0.toFixed(4), r0pass: R0 > 0.5 && R0 < 2.0 && mx === 0 });
  }
  const ok = perSeed.every((s) => s.r0pass);
  const out = { spec: "self-u41-fixstep-prereg", track: "U41-FIXSTEP", wave: 0, verdict: "COMPLETE", stackHash: h.hex, perSeed, wave0pass: ok };
  await fs.writeTextFile(U41_WAVE0_PATH, JSON.stringify(out));
  log("u41-wave0 R0=" + perSeed.map((s) => s.R0).join(",") + " twin=" + perSeed.map((s) => s.twinMaxAbsDiff).join(",") + " " + (ok ? "PASS" : "HALT"));
  if (!ok) throw new Error("U41-W0 HALT: corrected step unverified");
  return out;
};

globalThis.runU41Train = async function (fs, log, opts) {
  const { seed, arm } = opts;
  if (arm !== "c0" && arm !== "c1") throw new Error("arm must be c0|c1");
  const ledgerPath = u41TrainPath(seed, arm);
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  const h = await globalThis.u33StackHash(fs);
  if (h.hex !== U41_EXPECT_STACK) throw new Error("U41-PIN HALT: stack drift at train " + h.hex.slice(0, 16));
  const drvSrc = await fs.readTextFile("src/evidence/decomp/newai-selfu41-driver.js");
  const drvHash = await u32Sha256Hex(drvSrc);
  const t = await globalThis.u32FreshStack(fs, seed);
  const P0 = globalThis.u32SnapshotParams(t.M);
  const gate = u38MakeGate();
  const Gate0 = Array.from(gate.w.v).concat(Array.from(gate.b.v));
  const steps = 800, t0 = Date.now(), curve = [], gateCurve = [];
  for (let step = 0; step < steps; step++) {
    for (const p of t.params) p.g.fill(0);
    gate.w.g.fill(0); gate.b.g.fill(0);
    const r = u41TrainOneStep(t.M, t.params, gate, t.opt, t.dataRng, t.fixedMasks, arm === "c1");
    if (step % 100 === 0 || step === steps - 1) {
      curve.push({ step, loss: +r.loss.toFixed(6) });
      if (arm === "c1") gateCurve.push({ step, b: +gate.b.v[0].toFixed(4), wMean: +([...gate.w.v].reduce((a, x) => a + Math.abs(x), 0) / 20).toFixed(4) });
    }
    if (step % 200 === 0) log("u41-train " + arm + " s" + seed + " step " + step + "/800 loss=" + r.loss.toFixed(4));
  }
  const P = globalThis.u32SnapshotParams(t.M);
  const Gate = Array.from(gate.w.v).concat(Array.from(gate.b.v));
  const body = {
    spec: "self-u41-fixstep-prereg", track: "U41-FIXSTEP", arm, seed, steps,
    B: 16, lr: 5e-3, K: 5, H: 48, C: 6, auxW: 0.5, lam: 2.0,
    diet: "U36-D1 + 12.5% mismatch (D1)", scorer: arm === "c1" ? "learned state gate [E[qk]|cNew] 21 params init 0 (CORRECTED single-/B)" : "no gate (g=1, CORRECTED carry /B)",
    bootstraps: "b%K slices", verdict: "COMPLETE",
    recipeMatch: "u38-recipe + single-/B-carry+gate",
    stackHash: h.hex, stackFiles: h.perFile.map((f) => f.path), u41DriverHash: drvHash,
    wallMs: Date.now() - t0, curve, gateCurve, divCos: +inMeanCos(t.M).toFixed(4), P0, P, Gate0, Gate,
  };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("u41-train " + arm + " s" + seed + " COMPLETE loss0=" + curve[0].loss + " lossN=" + curve[curve.length - 1].loss);
  return body;
};

globalThis.runU41Eval = async function (fs, log, opts) {
  const { seed, arm } = opts;
  const trainPath = u41TrainPath(seed, arm), evalPath = u41EvalPath(seed, arm);
  try { const prev = JSON.parse(await fs.readTextFile(evalPath)); if (prev && prev.verdict === "COMPLETE") { log(evalPath + " exists, skip"); return prev; } } catch (e) {}
  const G = await globalThis.IntrinsicInit(fs);
  const tr = JSON.parse(await fs.readTextFile(trainPath));
  if (tr.verdict !== "COMPLETE") throw new Error("train ledger missing " + trainPath);
  const cur = await globalThis.u33StackHash(fs);
  if (cur.hex !== tr.stackHash) throw new Error("U41-PIN HALT: stack drift since train " + trainPath);
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
    return 1 / (1 + Math.exp(-s));
  };
  let evalMasks = null; { const fr = G.makeRng(91000 + seed); evalMasks = []; for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr.int(10) < 5 ? 2 : 0; evalMasks.push(m); } }
  const srng = G.makeRng(52500 + seed), frng = G.makeRng(52400 + seed), lowrng = G.makeRng(52600 + seed);
  const argmax4 = u41Argmax4;
  const N = 200;
  const rows = [];
  for (let i = 0; i < N; i++) {
    const e = inSeqGenShift(srng, null);
    const fw1 = inSeqForward(M, e.x, new Float64Array(8), evalMasks);
    const vhat = argmax4(fw1.hvLog);
    const g = gOf(e.qk, fw1.cNew);
    rows.push({ e, vhat, cNew: fw1.cNew.slice(), g });
  }
  const gCleanMean = rows.reduce((a, r) => a + r.g, 0) / N;
  let gSwapMean = 0;
  for (let i = 0; i < N; i++) gSwapMean += gOf(rows[i].e.qk, rows[N - 1 - i].cNew);
  gSwapMean /= N;
  let shut = 0;
  for (let i = 0; i < N; i++) if (gOf(rows[i].e.qk, rows[N - 1 - i].cNew) < 0.5) shut++;
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
  let twoLow = 0;
  const gLows = [];
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
    const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
    const cG = new Float64Array(8);
    for (let d = 0; d < 8; d++) cG[d] = g * fw1.cNew[d];
    if (argmax4(inMeanLogits({ logitsK: inSeqForward(M, x2m, cG, evalMasks).logitsK })) === e.y) twoLow++;
  }
  let fF = 0;
  for (let i = 0; i < N; i++) {
    const e = inSeqGenShift(frng, 0);
    if (argmax4(inMeanLogits({ logitsK: inSeqForward(M, e.x, new Float64Array(8), evalMasks).logitsK })) === e.y) fF++;
  }
  const body = {
    spec: "self-u41-fixstep-prereg", track: "U41-FIXSTEP", arm, seed, steps: 800,
    verdict: "COMPLETE", n: N, frozenTest: true, evalOf: trainPath, stackHash: cur.hex,
    accScratch: +(scr / N).toFixed(4), accTwo: +(two / N).toFixed(4), accTwoOpen: +(twoOpen / N).toFixed(4),
    accOracle: +(orc / N).toFixed(4), accFwd: +(fF / N).toFixed(4),
    accTwoLow: +(twoLow / N).toFixed(4),
    gate: arm === "c1" ? { gCleanMean: +gCleanMean.toFixed(4), gSwapMean: +gSwapMean.toFixed(4), shutRateSwapped: +(shut / N).toFixed(4), med: +med.toFixed(4), predGap, w: Array.from(gate.w.v).map((x) => +x.toFixed(4)), b: +gate.b.v[0].toFixed(4) } : undefined,
  };
  await fs.writeTextFile(evalPath, JSON.stringify(body));
  log("u41-eval " + arm + " s" + seed + " scr=" + body.accScratch + " two=" + body.accTwo + " open=" + body.accTwoOpen + " orc=" + body.accOracle + " low=" + body.accTwoLow + (arm === "c1" ? " g=" + body.gate.gCleanMean + "/" + body.gate.gSwapMean + " shut=" + body.gate.shutRateSwapped : ""));
  return body;
};

globalThis.runU41Verdict = async function (fs, log) {
  const J = async (p) => JSON.parse(await fs.readTextFile(p));
  const perSeed = [], disp = [], shuts = [];
  for (const arm of ["c0", "c1"]) for (const seed of [0, 1, 2]) {
    const tr = await J("src/evidence/decomp/d-newai-self-u41-" + arm + "-s" + seed + "-800st.json");
    const ev = await J("src/evidence/decomp/d-newai-self-u41-eval-" + arm + "-s" + seed + "-800st.json");
    perSeed.push({ arm, seed, loss0: tr.curve[0].loss, lossN: tr.curve[tr.curve.length - 1].loss, scr: ev.accScratch, two: ev.accTwo, orc: ev.accOracle });
    if (arm === "c1") {
      let mx = 0;
      for (let i = 0; i < 21; i++) mx = Math.max(mx, Math.abs(tr.Gate[i] - tr.Gate0[i]));
      disp.push(mx);
      const tr38 = await J("src/evidence/decomp/d-newai-self-u38-c1-s" + seed + "-800st.json");
      let mx38 = 0;
      for (let i = 0; i < 21; i++) mx38 = Math.max(mx38, Math.abs(tr38.Gate[i] - tr38.Gate0[i]));
      perSeed[perSeed.length - 1].gateDisp = +mx.toFixed(4);
      perSeed[perSeed.length - 1].gateDispU38 = +mx38.toFixed(4);
      perSeed[perSeed.length - 1].shut = ev.gate.shutRateSwapped;
      shuts.push(ev.gate.shutRateSwapped);
    }
  }
  const w0 = await J(U41_WAVE0_PATH);
  const minDispRatio = Math.min(...disp.map((d, i) => {
    const tr38 = perSeed.filter((s) => s.arm === "c1")[i];
    return d / tr38.gateDispU38;
  }));
  const fixConfirmed = w0.wave0pass && minDispRatio >= 1.2;
  const q = (arr, f) => arr.filter(f).length;
  const unhalt = q(shuts, (s) => s > 0.2) >= 2;
  const body = {
    spec: "self-u41-fixstep-prereg", track: "U41-FIXSTEP",
    verdict: fixConfirmed ? "FIX-CONFIRMED" : "FIX-FAILED",
    bars: { R0: w0.perSeed.map((s) => s.R0).join(","), minDispRatio: +minDispRatio.toFixed(3), shut: shuts.join(",") },
    perSeed,
    deviations: ["single /B on carry+gate paths (only recipe change)"],
    license: fixConfirmed
      ? (unhalt ? "D5 UN-HALTED under U39 prereg (fresh countersign needed); U38 SUSPECT-STEP marks on c1-trains may be lifted by a follow-up compare (not done here)"
        : "gate story continues input-side (B1+U3 direction: redesign gate input; D5 stays halted)")
      : "corrected step unverified — no license; U40 INTEGRATION-BUG stands as filed",
  };
  await fs.writeTextFile(U41_VERDICT_PATH, JSON.stringify(body, null, 1));
  log("u41-verdict " + body.verdict + " dispRatio=" + minDispRatio.toFixed(3) + " shut=" + shuts.join(","));
  return body;
};
