// U57-EXT2 driver (cloned from U54-EXT2): VETO3 split-bias (no shared b), 20 seeds, quorum 14/20.
// newai-selfu57-driver.js — U57-EXT2 (E-EXT2 program) split-bias veto under B-heavy Phase-2.
//
// Design (prereg self-u57-ext2-prereg.md v1.0): 4 arms × 20 seeds. Phase 1 trains
// the standard two-round association (U38-c0 diet verbatim: U36-D1 + 12.5%
// mismatch, no gate) to criterion-or-cap, then freezes a checkpoint. Phase 2 runs
// a B-heavy diet (80% context-B rows labeled 0, 20% context-A rows labeled true y)
// with arm-specific plasticity. Phase 3 probes CTX-A / CTX-B / RET-A.
//
// VETO3 (the fix under test): nu = sigmoid(w[ctx]) (VETO + UNFROZEN — TWO
// params, no shared bias, init w=[0,0] open), nu = sigmoid(b) (GLOBAL scalar,
// unchanged U54 control, b init -2), nu = 0 (NO-VETO). Round-2 runs on FULL
// ungated context (association path intact by construction); final logits are
//   eff = (1-nu)*mean2 + nu*[K,0,0,0], K=10 (mechanism constant).
// nu=1 forces class 0 exactly (argmax of [10,0,0,0]); nu=0 reproduces the
// checkpoint computation up to sigmoid residual. Context cue reaches ONLY the
// veto (2 params veto/unfrozen + 1 scalar global, manual SGD lr=1.0); the trunk never sees context (no stack
// change — stackHash stays 258d2f06…).
//
// v1.0-underspecified parameters FIXED HERE pre-compute (Wave-0 review rules):
// Phase-1 = to-criterion (>=0.98 on 100-row R1-A probe checked every 50 steps)
// or 800 steps max; Phase-2 = 800 steps fixed (erasure pressure for ISOLATE;
// answers u2/u3/u6). If the criterion never binds it is filed as D1 (cap
// operative, all arms identical by construction).
// B-label = constant 0 ("say nothing" target): makes suppression exact and
// measurable; CTX-B metric P(output==0). Construction proof (GLOBAL single
// scalar cannot do A-normal + B-zero) holds regardless.
//
// Trunk backward mirrors u38-c0 exactly (same scaling micro-choices), with
// dMean2 computed from the blend: dL/dlogits2 = (1-nu)*dL/deff,
// dL/dnu = dot(dL/deff, T - mean2), T=[10,0,0,0]. Aux per-head losses stay on
// UNBLENDED logits (u38 weights). Heritage: u38-c0 path + u41 fixed step.
// New analytic surface = veto chain only → Wave-0 numeric gradcheck on it.
//
// RUN (execute_js, fs in scope):
//   const src = await fs.readTextFile("src/evidence/decomp/newai-selfu57-driver.js");
//   (0, eval)(src + "\n//# sourceURL=newai-selfu57-driver.js");
//   await globalThis.SelfU57Init(fs);
//   await globalThis.runU57Wave0(fs, log);
//   await globalThis.runU57Train(fs, log, {seed, arm, phase}); // arm noveto|global|veto|unfrozen; phase 1|2
//   await globalThis.runU57Eval(fs, log, {seed, arm});
//   await globalThis.runU57Verdict(fs, log);
globalThis.SelfU57Init = async function (fs) {
  const src = await fs.readTextFile("src/evidence/decomp/newai-selfu36-driver.js");
  (0, eval)(src + "\n//# sourceURL=newai-selfu36-driver.js");
  await globalThis.SelfU36Init(fs);
  if (typeof globalThis.u36HeadArgs !== "function") throw new Error("u57 stack load failed");
  if (typeof globalThis.u38GateFwd === "undefined") {
    const s38 = await fs.readTextFile("src/evidence/decomp/newai-selfu38-driver.js");
    (0, eval)(s38 + "\n//# sourceURL=newai-selfu38-driver.js");
  }
};
const U57_EXPECT_STACK = "258d2f060684ce382778e203959ab791abb5df79af174deef19ff568886d4d6e";
const U57_K = 10;
const U57_VETO_LR = 1.0;
function u57Phase1Path(seed, arm) { return "src/evidence/decomp/d-newai-self-u57-phase1-" + arm + "-s" + seed + ".json"; }
function u57Phase2Path(seed, arm) { return "src/evidence/decomp/d-newai-self-u57-phase2-" + arm + "-s" + seed + ".json"; }
function u57EvalPath(seed, arm) { return "src/evidence/decomp/d-newai-self-u57-eval-" + arm + "-s" + seed + ".json"; }
const U57_VERDICT_PATH = "src/evidence/decomp/d-newai-self-u57-verdict.json";
const U57_WAVE0_PATH = "src/evidence/decomp/d-newai-self-u57-wave0.json";
function u57Sig(s) { return 1 / (1 + Math.exp(-s)); }
function u57MakeVeto() { return { w: new Float64Array(2), b: -2, gw: new Float64Array(2), gb: 0 }; }
function u57Nu(veto, ctx, arm) { const cx = (arm === "veto" || arm === "unfrozen"); return arm === "noveto" ? 0 : cx ? u57Sig(veto.w[ctx]) : u57Sig(veto.b); } // VETO3: cut shared spring
// Standard R1 row: U38 roll<4 branch (pick-max over 6 candidates by vote-disagree).
function u57PickR1(M, dataRng, fixedMasks) {
  const C = 6, cands = [];
  for (let c = 0; c < C; c++) {
    const ub = dataRng.int(2) === 0;
    cands.push(ub ? inSeqGenShift(dataRng, 0) : inSeqGenShift(dataRng, null));
  }
  let pk = 0, best = -1;
  for (let c = 0; c < C; c++) {
    const fw = inSeqForward(M, cands[c].x, new Float64Array(8), fixedMasks);
    const d = curVoteDisagree(fw.logitsK);
    if (d > best) { best = d; pk = c; }
  }
  return cands[pk];
}
// Phase-1 step = u38 c0 step verbatim (diverse diet + mismatch, no gate).
// Re-declared by delegation: identical code path via u38TrainOneStep(useGate=false).
// Phase-2 step (new): B-heavy rows, blend veto, arm-specific plasticity.
function u57Phase2Step(M, params, veto, opt, dataRng, fixedMasks, arm) {
  const B = 16, auxW = 0.5, lam = 2.0, K = 5;
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  const frozen = (arm === "veto");
  const useCtx = (arm === "veto" || arm === "unfrozen");
  for (const p of params) p.g.fill(0);
  veto.gw.fill(0); veto.gb = 0;
  let lsum = 0, nuA = 0, nuB = 0, nA = 0, nB = 0;
  for (let b = 0; b < B; b++) {
    const e = u57PickR1(M, dataRng, fixedMasks);
    const ctx = dataRng.int(10) < 8 ? 1 : 0; // 80% B
    const label = ctx === 1 ? 0 : e.y;
    const fw1 = inSeqForward(M, e.x, new Float64Array(8), fixedMasks);
    const ceHv = inCELossGrad(fw1.hvLog, e.v);
    const dHv = new Float64Array(4); for (let o = 0; o < 4; o++) dHv[o] = ceHv.d[o] * auxW / B;
    const vhat = argmax4(fw1.hvLog);
    const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
    const fw2 = inSeqForward(M, x2m, fw1.cNew, fixedMasks);
    const mean2 = inMeanLogits({ logitsK: fw2.logitsK });
    const nu = u57Nu(veto, ctx, arm);
    if (ctx === 0) { nuA += nu; nA++; } else { nuB += nu; nB++; }
    const eff = new Float64Array(4);
    for (let o = 0; o < 4; o++) eff[o] = (1 - nu) * mean2[o] + nu * (o === 0 ? U57_K : 0);
    const ce = inCELossGrad(eff, label);
    lsum += ce.loss;
    const dEff = new Float64Array(4); for (let o = 0; o < 4; o++) dEff[o] = ce.d[o] / B;
    const dMean2 = new Float64Array(4); for (let o = 0; o < 4; o++) dMean2[o] = (1 - nu) * dEff[o];
    let dnu = 0; for (let o = 0; o < 4; o++) dnu += dEff[o] * ((o === 0 ? U57_K : 0) - mean2[o]);
    dnu /= B;
    const gg = nu * (1 - nu);
    if (arm === "veto" || arm === "unfrozen") veto.gw[ctx] += dnu * gg; // VETO3: B-rows cannot drag A
    else if (arm === "global") veto.gb += dnu * gg;
    const perHead1 = fw1.logitsK.map((lg, k) => {
      if ((b % K) !== k) return new Float64Array(4);
      const c2 = inCELossGrad(lg, e.y); const d = new Float64Array(4);
      for (let o = 0; o < 4; o++) d[o] = c2.d[o] * 0.1 * K / B;
      return d;
    });
    const perHead2 = fw2.logitsK.map((lg, k) => {
      if ((b % K) !== k) return new Float64Array(4);
      const c2 = inCELossGrad(lg, e.y); const d = new Float64Array(4);
      for (let o = 0; o < 4; o++) d[o] = c2.d[o] * 0.1 * K / B;
      return d;
    });
    const mean1 = inMeanLogits({ logitsK: fw1.logitsK });
    const ce1m = inCELossGrad(mean1, e.y);
    const dMean1 = new Float64Array(4); for (let o = 0; o < 4; o++) dMean1[o] = ce1m.d[o] * 0.3 / B;
    const dcGated = frozen ? null : inSeqBackward(M, fw2, dMean2, perHead2, null, null, fixedMasks);
    if (!frozen) {
      const dcC = new Float64Array(8);
      for (let d = 0; d < 8; d++) dcC[d] = dcGated[d] / B;
      inSeqBackward(M, fw1, dMean1, perHead1, dHv, dcC, fixedMasks);
    }
  }
  if (!frozen) {
    const meanW = new Float64Array(M.Wh[0].v.length);
    for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) meanW[i] += M.Wh[k].v[i] / K;
    for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) M.Wh[k].g[i] += lam * (M.Wh[k].v[i] - meanW[i]) / (B * M.H);
    const plist = params;
    let s = 0;
    for (const p of plist) for (let i = 0; i < p.g.length; i++) s += p.g[i] * p.g[i];
    const n = Math.sqrt(s);
    if (n > 1.0) { const sc = 1.0 / n; for (const p of plist) for (let i = 0; i < p.g.length; i++) p.g[i] *= sc; }
    opt.step(plist);
  } else {
    for (const p of params) for (let i = 0; i < p.g.length; i++) {
      if (p.g[i] !== 0) throw new Error("U57-FROZEN-VIOLATION: trunk grad nonzero in veto arm");
    }
  }
  if (arm === "veto" || arm === "unfrozen") { veto.w[0] -= U57_VETO_LR * veto.gw[0]; veto.w[1] -= U57_VETO_LR * veto.gw[1]; }
  else if (arm === "global") { veto.b -= U57_VETO_LR * veto.gb; }
  veto.gw.fill(0); veto.gb = 0;
  return { loss: lsum / B, nuA: nA ? nuA / nA : 0, nuB: nB ? nuB / nB : 0 };
}
// Wave 0: load-check + VETO3 2-param gradcheck (+unchanged global scalar) + twins + diet/K/chance/probe checks.
globalThis.runU57Wave0 = async function (fs, log) {
  try { const prev = JSON.parse(await fs.readTextFile(U57_WAVE0_PATH)); if (prev && prev.verdict === "COMPLETE") { log(U57_WAVE0_PATH + " exists, skip"); return prev; } } catch (e) {}
  for (const f of ["u32FreshStack", "u32SnapshotParams", "u32MaxAbsDiff", "u33StackHash", "u32Sha256Hex", "IntrinsicInit", "inSeqForward", "inSeqBackward", "inMeanLogits", "inCELossGrad", "curVoteDisagree", "inSeqGenShift", "u38TrainOneStep"]) {
    if (typeof globalThis[f] !== "function") throw new Error("U57 Wave-0 HALT: missing stack fn " + f);
  }
  log("u57-wave0 stack fns present (13/13)");
  const G0 = await globalThis.IntrinsicInit(fs);
  // (a) veto gradcheck: numeric vs analytic through the blend.
  const grng = G0.makeRng(53123);
  let wworst = 0, nbad = 0;
  for (let t = 0; t < 32; t++) {
    const wA = (grng.int(2000) - 1000) / 1000, wB = (grng.int(2000) - 1000) / 1000, bb = (grng.int(2000) - 1000) / 2000;
    const m2 = new Float64Array(4), dE = new Float64Array(4);
    for (let o = 0; o < 4; o++) { m2[o] = (grng.int(2000) - 1000) / 500; dE[o] = (grng.int(2000) - 1000) / 500; }
    const ctx = grng.int(2);
    const lossOf = (wa, wb) => {
      const nu = 1 / (1 + Math.exp(-(ctx === 0 ? wa : wb)));
      let L = 0;
      for (let o = 0; o < 4; o++) { const eff = (1 - nu) * m2[o] + nu * (o === 0 ? U57_K : 0); L += dE[o] * eff; }
      return L;
    };
    const nu = 1 / (1 + Math.exp(-(ctx === 0 ? wA : wB)));
    let dnu = 0; for (let o = 0; o < 4; o++) dnu += dE[o] * ((o === 0 ? U57_K : 0) - m2[o]);
    const gg = nu * (1 - nu);
    const ana = [ctx === 0 ? dnu * gg : 0, ctx === 1 ? dnu * gg : 0];
    const vars = [[wA, 0], [wB, 1]];
    const eeps = 1e-6;
    for (const [av, ix] of vars) {
      const bump = (v, i2, sgn) => i2 === 0 ? [v + sgn * eeps, wB] : [wA, v + sgn * eeps];
      const lp = lossOf(...bump(av, ix, 1)), lm = lossOf(...bump(av, ix, -1));
      const num = (lp - lm) / (2 * eeps);
      void av;
      const rel = Math.abs(ana[ix] - num) / Math.max(1e-8, Math.abs(ana[ix]) + Math.abs(num));
      if (rel > wworst) wworst = rel;
      if (rel > 1e-5) nbad++;
    }
  }
  log("u57-wave0 veto-gradcheck worst=" + wworst.toExponential(2) + " nBad=" + nbad + "/64 (VETO3 2-param; global scalar = unchanged U54 path)");
  if (nbad !== 0) throw new Error("U57 Wave-0 HALT: veto gradcheck FAIL");
  // (b) twins: phase-1 step + phase-2 step per arm.
  const twins = [];
  for (const arm of ["noveto", "global", "veto", "unfrozen"]) {
    for (const s of [0, 1, 2]) {
      const X = await globalThis.u32FreshStack(fs, s);
      const Y = await globalThis.u32FreshStack(fs, s);
      const Xv = u57MakeVeto(), Yv = u57MakeVeto();
      for (const p of X.params) p.g.fill(0);
      for (const p of Y.params) p.g.fill(0);
      u38TrainOneStep(X.M, X.params, null, X.opt, X.dataRng, X.fixedMasks, false);
      u38TrainOneStep(Y.M, Y.params, null, Y.opt, Y.dataRng, Y.fixedMasks, false);
      const st1 = globalThis.u32MaxAbsDiff(globalThis.u32SnapshotParams(X.M), globalThis.u32SnapshotParams(Y.M));
      const r1 = u57Phase2Step(X.M, X.params, Xv, X.opt, X.dataRng, X.fixedMasks, arm);
      const r2 = u57Phase2Step(Y.M, Y.params, Yv, Y.opt, Y.dataRng, Y.fixedMasks, arm);
      const st2 = globalThis.u32MaxAbsDiff(globalThis.u32SnapshotParams(X.M), globalThis.u32SnapshotParams(Y.M));
      const vd = Math.max(Math.abs(Xv.w[0] - Yv.w[0]), Math.abs(Xv.w[1] - Yv.w[1]), Math.abs(Xv.b - Yv.b));
      const pass = st1.max === 0 && st2.max === 0 && vd === 0;
      twins.push({ arm, seed: s, p1diff: st1.max, p2diff: st2.max, vetoDiff: vd, pass });
      log("u57-wave0 twin " + arm + " s" + s + " p1=" + st1.max + " p2=" + st2.max + " veto=" + vd.toExponential(1) + " loss=" + r1.loss.toFixed(4) + "/" + r2.loss.toFixed(4));
      if (!pass) throw new Error("U57 Wave-0 HALT: twin nondeterminism " + arm + " s" + s);
    }
  }
  // (c) diet balance: B-fraction over 2000 draws (seed-fixed rng).
  const drng = G0.makeRng(777);
  let nb = 0; for (let i = 0; i < 2000; i++) if (drng.int(10) < 8) nb++;
  const bfrac = nb / 2000;
  log("u57-wave0 diet B-fraction=" + bfrac.toFixed(3) + " (expect ~0.80)");
  if (Math.abs(bfrac - 0.8) > 0.03) throw new Error("U57 Wave-0 HALT: diet balance off");
  // (d) K-sanity: nu=1 forces class 0; nu=0 reproduces mean2 argmax.
  const m2t = new Float64Array([1.0, 3.0, 0.5, 2.0]);
  const eff1 = [0, 1, 2, 3].map((o) => (1 - 1) * m2t[o] + 1 * (o === 0 ? U57_K : 0));
  const eff0 = [0, 1, 2, 3].map((o) => (1 - 0) * m2t[o]);
  const am = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  if (am(eff1) !== 0 || am(eff0) !== 1) throw new Error("U57 Wave-0 HALT: K-sanity fail");
  log("u57-wave0 K-sanity ok (nu=1→0, nu=0→argmax mean2)");
  // (e) chance math: 4-class probes → chance 0.25; floor 0.45 above chance. Epsilon absolute-on-rate.
  // (f) probe reproducibility: same stream → identical inputs twice.
  const prng1 = G0.makeRng(53100), prng2 = G0.makeRng(53100);
  const e1 = inSeqGenShift(prng1, null), e2 = inSeqGenShift(prng2, null);
  const sameX = e1.x.every((v, i) => v === e2.x[i]) && e1.qk === e2.qk && e1.k === e2.k && e1.v === e2.v && e1.y === e2.y;
  if (!sameX) throw new Error("U57 Wave-0 HALT: probe stream not reproducible");
  log("u57-wave0 probe-stream reproducible");
  const body = { spec: "self-u57-ext2-prereg", track: "U57-EXT2", wave: 0, verdict: "COMPLETE", vetoGradcheck: { worst: wworst, nBad: nbad }, twins, dietBfrac: +bfrac.toFixed(4), kSanity: true, chancePerProbe: 0.25, floorNote: "0.45 > chance 0.25 (guard, not competence bar)", evalN: 200 };
  await fs.writeTextFile(U57_WAVE0_PATH, JSON.stringify(body));
  log("u57-wave0 COMPLETE");
  return body;
};
// Wave 1: phase 1 (per arm-seed, to criterion-or-cap) then phase 2 (800 steps).
globalThis.runU57Train = async function (fs, log, opts) {
  const { seed, arm, phase } = opts;
  if (!["noveto", "global", "veto", "unfrozen"].includes(arm)) throw new Error("arm must be noveto|global|veto|unfrozen");
  if (phase !== 1 && phase !== 2) throw new Error("phase must be 1|2");
  const ledgerPath = phase === 1 ? u57Phase1Path(seed, arm) : u57Phase2Path(seed, arm);
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  const h = await globalThis.u33StackHash(fs);
  if (h.hex !== U57_EXPECT_STACK) throw new Error("U57-PIN HALT: stack drift " + h.hex.slice(0, 16));
  const drvSrc = await fs.readTextFile("src/evidence/decomp/newai-selfu57-driver.js");
  const drvHash = await u32Sha256Hex(drvSrc);
  const t = await globalThis.u32FreshStack(fs, seed);
  const P0 = globalThis.u32SnapshotParams(t.M);
  const veto = u57MakeVeto();
  const Veto0 = [veto.w[0], veto.w[1], veto.b];
  const G = await globalThis.IntrinsicInit(fs);
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  let evalMasks = null;
  {
    const fr = G.makeRng(91000 + seed); evalMasks = [];
    for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr.int(10) < 5 ? 2 : 0; evalMasks.push(m); }
  }
  const curve = [], vetoCurve = [], t0 = Date.now();
  if (phase === 1) {
    // To criterion (>=0.98 on 100-row R1-A probe every 50 steps) or 800 max (C1 strong-brain).
    let steps = 0, criterionAt = -1;
    for (let step = 0; step < 800; step++) {
      for (const p of t.params) p.g.fill(0);
      u38TrainOneStep(t.M, t.params, null, t.opt, t.dataRng, t.fixedMasks, false);
      steps++;
      if (step % 100 === 0 || step === 399) curve.push({ step, note: "phase1" });
      if ((step + 1) % 50 === 0 || step === 399) {
        const prng = G.makeRng(54000 + seed);
        let hit = 0;
        for (let i = 0; i < 100; i++) {
          const e = inSeqGenShift(prng, null);
          const fw1 = inSeqForward(t.M, e.x, new Float64Array(8), evalMasks);
          const vhat = argmax4(fw1.hvLog);
          const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
          if (argmax4(inMeanLogits({ logitsK: inSeqForward(t.M, x2m, fw1.cNew, evalMasks).logitsK })) === e.y) hit++;
        }
        const acc = hit / 100;
        curve.push({ step, probeAcc: +acc.toFixed(4) });
        if (acc >= 0.98 && criterionAt < 0) { criterionAt = step + 1; break; }
      }
      if (step % 200 === 0) log("u57-p1 " + arm + " s" + seed + " step " + step + "/800");
    }
    // Checkpoint number: RET-A probe inputs (stream 53100+seed) at freeze time.
    const retRng = G.makeRng(53100 + seed);
    const retInputs = [];
    for (let i = 0; i < 200; i++) retInputs.push(inSeqGenShift(retRng, null));
    let ckHit = 0;
    for (const e of retInputs) {
      const fw1 = inSeqForward(t.M, e.x, new Float64Array(8), evalMasks);
      const vhat = argmax4(fw1.hvLog);
      const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
      if (argmax4(inMeanLogits({ logitsK: inSeqForward(t.M, x2m, fw1.cNew, evalMasks).logitsK })) === e.y) ckHit++;
    }
    const inHash = await u32Sha256Hex(JSON.stringify(retInputs.map((e) => [e.x, e.qk, e.k, e.v, e.y])));
    const P = globalThis.u32SnapshotParams(t.M);
    const body = {
      spec: "self-u57-ext2-prereg", track: "U57-EXT2", arm, seed, phase: 1, steps, criterionAt,
      diet: "U38-c0 (U36-D1 + 12.5% mismatch, no gate)", verdict: "COMPLETE",
      recipeMatch: "C6/auxW0.5/lam2.0/B16/K5/H48/armCode76/diverse+mismatch",
      stackHash: h.hex, u57DriverHash: drvHash, wallMs: Date.now() - t0, curve,
      checkpoint: { acc: +(ckHit / 200).toFixed(4), n: 200, inputsHash: inHash },
      P0, P, Veto0, Veto: [veto.w[0], veto.w[1], veto.b],
    };
    await fs.writeTextFile(ledgerPath, JSON.stringify(body));
    log("u57-p1 " + arm + " s" + seed + " COMPLETE steps=" + steps + " criterionAt=" + criterionAt + " ckpt=" + body.checkpoint.acc);
    return body;
  }
  // Phase 2: load own phase-1 P, run 800 steps B-heavy.
  const p1 = JSON.parse(await fs.readTextFile(u57Phase1Path(seed, arm)));
  if (p1.verdict !== "COMPLETE") throw new Error("phase-1 ledger missing " + u57Phase1Path(seed, arm));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(t.M.E, p1.P.E); load(t.M.W1, p1.P.W1); load(t.M.b1, p1.P.b1);
  load(t.M.Wf, p1.P.Wf); load(t.M.bf, p1.P.bf); load(t.M.Wc, p1.P.Wc); load(t.M.bc, p1.P.bc);
  for (let k = 0; k < 5; k++) { load(t.M.Wh[k], p1.P.Wh[k]); load(t.M.bh[k], p1.P.bh[k]); }
  load(t.M.Hv, p1.P.Hv); load(t.M.bv, p1.P.bv);
  const ck = await u32Sha256Hex(JSON.stringify(p1.P));
  for (let step = 0; step < 800; step++) {
    for (const p of t.params) p.g.fill(0);
    const r = u57Phase2Step(t.M, t.params, veto, t.opt, t.dataRng, t.fixedMasks, arm);
    if (step % 100 === 0 || step === 799) {
      curve.push({ step, loss: +r.loss.toFixed(6) });
      vetoCurve.push({ step, nuA: +r.nuA.toFixed(4), nuB: +r.nuB.toFixed(4), wA: +veto.w[0].toFixed(4), wB: +veto.w[1].toFixed(4), b: +veto.b.toFixed(4) });
    }
    if (step % 200 === 0) log("u57-p2 " + arm + " s" + seed + " step " + step + "/800 loss=" + r.loss.toFixed(4) + " nu=" + r.nuA.toFixed(2) + "/" + r.nuB.toFixed(2));
  }
  const P = globalThis.u32SnapshotParams(t.M);
  const body = {
    spec: "self-u57-ext2-prereg", track: "U57-EXT2", arm, seed, phase: 2, steps: 800,
    diet: "B-heavy 80/20 (B rows label 0, A rows label y), R1 inputs", verdict: "COMPLETE",
    stackHash: h.hex, u57DriverHash: drvHash, wallMs: Date.now() - t0, curve, vetoCurve,
    phase1: u57Phase1Path(seed, arm), phase1CkHash: ck,
    P0: p1.P, P, Veto0, Veto: [veto.w[0], veto.w[1], veto.b],
  };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("u57-p2 " + arm + " s" + seed + " COMPLETE lossN=" + curve[curve.length - 1].loss + " nu=" + vetoCurve[vetoCurve.length - 1].nuA + "/" + vetoCurve[vetoCurve.length - 1].nuB);
  return body;
};
// Wave 2: frozen probes CTX-A / CTX-B / RET-A (N=200 each, fixed streams).
globalThis.runU57Eval = async function (fs, log, opts) {
  const { seed, arm } = opts;
  const trainPath = u57Phase2Path(seed, arm), evalPath = u57EvalPath(seed, arm);
  try { const prev = JSON.parse(await fs.readTextFile(evalPath)); if (prev && prev.verdict === "COMPLETE") { log(evalPath + " exists, skip"); return prev; } } catch (e) {}
  const G = await globalThis.IntrinsicInit(fs);
  const tr = JSON.parse(await fs.readTextFile(trainPath));
  if (tr.verdict !== "COMPLETE") throw new Error("phase-2 ledger missing " + trainPath);
  const cur = await globalThis.u33StackHash(fs);
  if (cur.hex !== tr.stackHash) throw new Error("U57-PIN HALT: stack drift since train");
  const M = inSeqMakeModel(G.makeRng(1));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(M.E, tr.P.E); load(M.W1, tr.P.W1); load(M.b1, tr.P.b1);
  load(M.Wf, tr.P.Wf); load(M.bf, tr.P.bf); load(M.Wc, tr.P.Wc); load(M.bc, tr.P.bc);
  for (let k = 0; k < 5; k++) { load(M.Wh[k], tr.P.Wh[k]); load(M.bh[k], tr.P.bh[k]); }
  load(M.Hv, tr.P.Hv); load(M.bv, tr.P.bv);
  const vw = tr.Veto, useCtx = (arm === "veto" || arm === "unfrozen");
  const nuOf = (ctx) => arm === "noveto" ? 0 : (arm === "veto" || arm === "unfrozen") ? u57Sig(vw[ctx]) : u57Sig(vw[2]);
  let evalMasks = null;
  {
    const fr = G.makeRng(91000 + seed); evalMasks = [];
    for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr.int(10) < 5 ? 2 : 0; evalMasks.push(m); }
  }
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  const runProbe = (streamId, ctx, labelOf) => {
    const rng = G.makeRng(streamId + seed);
    let hit = 0, nuSum = 0;
    const inps = [];
    for (let i = 0; i < 200; i++) {
      const e = inSeqGenShift(rng, null);
      inps.push([e.x, e.qk, e.k, e.v, e.y]);
      const fw1 = inSeqForward(M, e.x, new Float64Array(8), evalMasks);
      const vhat = argmax4(fw1.hvLog);
      const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
      const mean2 = inMeanLogits({ logitsK: inSeqForward(M, x2m, fw1.cNew, evalMasks).logitsK });
      const nu = nuOf(ctx);
      nuSum += nu;
      const eff = [0, 1, 2, 3].map((o) => (1 - nu) * mean2[o] + nu * (o === 0 ? U57_K : 0));
      if (argmax4(eff) === labelOf(e)) hit++;
    }
    return { acc: hit / 200, nuMean: nuSum / 200, inps };
  };
  const ctxA = runProbe(53400, 0, (e) => e.y);
  const ctxB = runProbe(53500, 1, () => 0);
  const retA = runProbe(53100, 0, (e) => e.y);
  const hashOf = async (inps) => u32Sha256Hex(JSON.stringify(inps.map((r) => [Array.from(r[0]), r[1], r[2], r[3], r[4]])));
  const p1 = JSON.parse(await fs.readTextFile(u57Phase1Path(seed, arm)));
  const retHash = await hashOf(retA.inps);
  if (retHash !== p1.checkpoint.inputsHash) throw new Error("U57-PROBE-DRIFT HALT: RET-A inputs differ from checkpoint probe");
  const body = {
    spec: "self-u57-ext2-prereg", track: "U57-EXT2", arm, seed, verdict: "COMPLETE", n: 200,
    frozenTest: true, evalOf: trainPath, stackHash: cur.hex,
    accCtxA: +ctxA.acc.toFixed(4), accCtxB: +ctxB.acc.toFixed(4), accRetA: +retA.acc.toFixed(4),
    vetoA: +retA.nuMean.toFixed(4), vetoB: +ctxB.nuMean.toFixed(4),
    checkpointAcc: p1.checkpoint.acc, retInputsHash: retHash,
  };
  await fs.writeTextFile(evalPath, JSON.stringify(body));
  log("u57-eval " + arm + " s" + seed + " ctxA=" + body.accCtxA + " ctxB=" + body.accCtxB + " retA=" + body.accRetA + " (ckpt " + p1.checkpoint.acc + ") veto=" + body.vetoA + "/" + body.vetoB);
  return body;
};
// Verdict (20 seeds, quorum 14/20): PIN + CTX + NOERASE + ISOLATE + FLOOR (+ cause). P5 already closed: misfire kills E-EXT2 line only.
globalThis.runU57Verdict = async function (fs, log) {
  const perSeed = [];
  for (let seed = 0; seed < 20; seed++) {
    const T = {}, E = {};
    for (const arm of ["noveto", "global", "veto", "unfrozen"]) {
      T[arm] = JSON.parse(await fs.readTextFile(u57Phase2Path(seed, arm)));
      E[arm] = JSON.parse(await fs.readTextFile(u57EvalPath(seed, arm)));
    }
    const P1 = {};
    for (const arm of ["noveto", "global", "veto", "unfrozen"]) P1[arm] = JSON.parse(await fs.readTextFile(u57Phase1Path(seed, arm)));
    const pinHash = ["noveto", "global", "veto", "unfrozen"].every((a) => T[a].stackHash === U57_EXPECT_STACK && E[a].stackHash === U57_EXPECT_STACK && P1[a].stackHash === U57_EXPECT_STACK);
    const ckSame = ["global", "veto", "unfrozen"].every((a) => P1[a].checkpoint.inputsHash === P1.noveto.checkpoint.inputsHash);
    const frozenKept = (() => {
      const a = JSON.stringify(T.veto.P), b = JSON.stringify(T.veto.P0);
      return a === b;
    })();
    const ev = E.veto, eu = E.unfrozen, eg = E.global, en = E.noveto;
    const lowComp = ev.checkpointAcc < 0.28;
    const ctx = { a: ev.accCtxA, b: ev.accCtxB, ckpt: ev.checkpointAcc, lowComp, pass: ev.accCtxA >= ev.checkpointAcc - 0.03 && ev.accCtxB >= 0.95 };
    const noerase = { d: +(ev.accRetA - ev.checkpointAcc).toFixed(4), vetoA: ev.vetoA, pass: Math.abs(ev.accRetA - ev.checkpointAcc) <= 0.02 && ev.vetoA <= 0.05, misfire: ev.vetoA > 0.05 };
    const isolate = { uCtx: eu.accCtxA >= eu.checkpointAcc - 0.03 && eu.accCtxB >= 0.95, uRetFail: Math.abs(eu.accRetA - eu.checkpointAcc) > 0.02, pass: (eu.accCtxA >= eu.checkpointAcc - 0.03 && eu.accCtxB >= 0.95) && Math.abs(eu.accRetA - eu.checkpointAcc) > 0.02 };
    const floor = { pass: en.accCtxA >= 0.45 && ev.accCtxA >= 0.45 && eg.accCtxA >= 0.45 && eu.accCtxA >= 0.45 };
    perSeed.push({
      seed,
      pin: { match: pinHash && ckSame && frozenKept, pass: pinHash && ckSame && frozenKept, frozenKept },
      arms: { noveto: { ctxA: en.accCtxA, ctxB: en.accCtxB, ret: en.accRetA }, global: { ctxA: eg.accCtxA, ctxB: eg.accCtxB, ret: eg.accRetA }, veto: { ctxA: ev.accCtxA, ctxB: ev.accCtxB, ret: ev.accRetA, ckpt: ev.checkpointAcc, vetoA: ev.vetoA, vetoB: ev.vetoB }, unfrozen: { ctxA: eu.accCtxA, ctxB: eu.accCtxB, ret: eu.accRetA, ckpt: eu.checkpointAcc } },
      ctx, noerase, isolate, floor,
    });
    const r = perSeed[seed];
    log("u57-verdict s" + seed + " PIN=" + (r.pin.pass ? "ok" : "FAIL") + " veto=" + r.arms.veto.ctxA + "/" + r.arms.veto.ctxB + " ret=" + r.arms.veto.ret + "(ckpt " + r.arms.veto.ckpt + ") vetoAB=" + r.arms.veto.vetoA + "/" + r.arms.veto.vetoB + " unfr=" + r.arms.unfrozen.ctxA + "/" + r.arms.unfrozen.ctxB + "/" + r.arms.unfrozen.ret + " noveto=" + r.arms.noveto.ctxA + "/" + r.arms.noveto.ctxB);
  }
  const q = (f) => perSeed.filter((s) => f(s)).length;
  const pinN = q((s) => s.pin.pass), ctxN = q((s) => s.ctx.pass), noeN = q((s) => s.noerase.pass);
  const isoN = q((s) => s.isolate.pass), floorN = q((s) => s.floor.pass);
  const misN = q((s) => s.noerase.misfire);
  let verdict = "", cause = "clean";
  if (pinN < 20) { verdict = "PIN-FAIL"; cause = "pin"; }
  else if (floorN < 14) { verdict = "FLOOR-FAIL"; cause = "floor"; }
  else if (misN >= 7) { verdict = "EXT-PERSISTS"; cause = "vetoA breach at quorum despite decoupled mapping (starvation beats decoupling; P5 already closed — kills E-EXT2 line)"; }
  else if (ctxN < 14) { verdict = "EXT-PERSISTS"; cause = "ctx-joint fail at quorum (cannot implement policy even decoupled)"; }
  else if (noeN < 14) { verdict = "EXT-PERSISTS"; cause = "noerasure-breach with clean vetoA (association not preservable under suppression)"; }
  else if (isoN < 14) {
    const unfrHolds = q((s) => (s.arms.unfrozen.accCtxA >= s.arms.unfrozen.ckpt - 0.03 && s.arms.unfrozen.accCtxB >= 0.95) && Math.abs(s.arms.unfrozen.accRetA - s.arms.unfrozen.ckpt) <= 0.02);
    verdict = "EXT-PERSISTS"; cause = "isolate fail at quorum (unfrHolds " + unfrHolds + "/20" + (unfrHolds >= 14 ? "; freezing redundant" : "; neither isolate nor holds") + ")";
  }
  else verdict = "EXT-ADVANCE";
  if (verdict === "EXT-ADVANCE") cause = "clean";
  const body = {
    spec: "self-u57-ext2-prereg", track: "U57-EXT2", verdict, cause,
    bars: {
      "EXT-PIN": pinN + "/20 (stack + checkpoint-inputs identical + VETO3 weights byte-frozen)",
      "EXT-CTX": ctxN + "/20 (quorum 14/20; veto CTX-A>=ckpt-0.03 AND CTX-B>=0.95; A1 relative)",
      "EXT-NOERASE": noeN + "/20 (quorum 14/20; |ret-ckpt|<=0.02 AND vetoA<=0.05)",
      "EXT-ISOLATE": isoN + "/20 (quorum 14/20; UNFROZEN behavior-pass relative + retention-fail; A1)",
      "EXT-FLOOR": floorN + "/20 (quorum 14/20; CTX-A>=0.45 all evaluated arms)",
      "LOWCOMP-FLAG": perSeed.filter((s) => s.ctx.lowComp).length + "/20 seeds ckpt<0.28 (diagnostic, no quorum change)",
      "MISFIRE-COUNT": misN + "/20 (misfire=vetoA>0.05; >=7 kills E-EXT2 line; P5 already closed, not a P5 event)",
    },
    perSeed,
  };
  await fs.writeTextFile(U57_VERDICT_PATH, JSON.stringify(body));
  log("u57-verdict " + verdict + " cause=" + cause + " PIN " + pinN + "/3 CTX " + ctxN + "/3 NOERASE " + noeN + "/3 ISOLATE " + isoN + "/3 FLOOR " + floorN + "/3 MISFIRE " + misN + "/3");
  return body;
};
