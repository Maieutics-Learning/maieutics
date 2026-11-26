// U61-EXT4 driver (diet-only clone of the filed predecessor driver; that file is untouched): vetoSUP joint objective (task + LAM_SUP*BCE), 5 arms, 20 seeds, quorum 15/20 (v1.1 Q1).
// newai-selfu61-driver.js — U61-EXT4 (E-EXT4 program) supervised veto objective under balanced Phase-2.
//
// Design (prereg self-u61-ext4-prereg.md v1.0): 4 arms × 20 seeds. Phase 1 trains
// the standard two-round association (U38-c0 diet verbatim: U36-D1 + 12.5%
// mismatch, no gate) to criterion-or-cap, then freezes a checkpoint. Phase 2 runs
// a balanced diet (50% context-B rows labeled 0, 20% context-A rows labeled true y)
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
//   const src = await fs.readTextFile("src/evidence/decomp/newai-selfu61-driver.js");
//   (0, eval)(src + "\n//# sourceURL=newai-selfu61-driver.js");
//   await globalThis.SelfU61Init(fs);
//   await globalThis.runU61Wave0(fs, log);
//   await globalThis.runU61Train(fs, log, {seed, arm, phase}); // arm noveto|global|veto|unfrozen; phase 1|2
//   await globalThis.runU61Eval(fs, log, {seed, arm});
//   await globalThis.runU61Verdict(fs, log);
globalThis.SelfU61Init = async function (fs) {
  const src = await fs.readTextFile("src/evidence/decomp/newai-selfu36-driver.js");
  (0, eval)(src + "\n//# sourceURL=newai-selfu36-driver.js");
  await globalThis.SelfU36Init(fs);
  if (typeof globalThis.u36HeadArgs !== "function") throw new Error("u61 stack load failed");
  if (typeof globalThis.u38GateFwd === "undefined") {
    const s38 = await fs.readTextFile("src/evidence/decomp/newai-selfu38-driver.js");
    (0, eval)(s38 + "\n//# sourceURL=newai-selfu38-driver.js");
  }
};
const U61_EXPECT_STACK = "258d2f060684ce382778e203959ab791abb5df79af174deef19ff568886d4d6e";
const U61_K = 10;
const U61_VETO_LR = 1.0;
const U61_LAM_SUP = 1.0; // filed own-objective weight (no sweep without new prereg)
function u61Phase1Path(seed, arm) { const a = (arm === "vetoSUP" || arm === "vetoTASK") ? "veto" : arm; return "src/evidence/decomp/d-newai-self-u57-phase1-" + a + "-s" + seed + ".json"; } // REUSE: veto arms share U57 veto-arm trunk
function u61Phase2Path(seed, arm) { return "src/evidence/decomp/d-newai-self-u61-phase2-" + arm + "-s" + seed + ".json"; }
function u61EvalPath(seed, arm) { return "src/evidence/decomp/d-newai-self-u61-eval-" + arm + "-s" + seed + ".json"; }
const U61_VERDICT_PATH = "src/evidence/decomp/d-newai-self-u61-verdict.json";
const U61_WAVE0_PATH = "src/evidence/decomp/d-newai-self-u61-wave0.json";
function u61Sig(s) { return 1 / (1 + Math.exp(-s)); }
function u61MakeVeto() { return { w: new Float64Array(2), b: -2, gw: new Float64Array(2), gb: 0 }; }
function u61Nu(veto, ctx, arm) { const cx = (arm === "vetoSUP" || arm === "vetoTASK" || arm === "unfrozen"); return arm === "noveto" ? 0 : cx ? u61Sig(veto.w[ctx]) : u61Sig(veto.b); } // VETO3: cut shared spring
// Standard R1 row: U38 roll<4 branch (pick-max over 6 candidates by vote-disagree).
function u61PickR1(M, dataRng, fixedMasks) {
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
// Phase-2 step (new): balanced rows, blend veto, arm-specific plasticity.
function u61Phase2Step(M, params, veto, opt, dataRng, fixedMasks, arm) {
  const B = 16, auxW = 0.5, lam = 2.0, K = 5;
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  const frozen = (arm === "vetoSUP" || arm === "vetoTASK"); // D2 repair: U57's (arm==="veto") never fires under U61's split arm names; filed design is frozen trunk + VETO3 (SUP-PIN trunk-grad-0 assert)
  const useCtx = (arm === "vetoSUP" || arm === "vetoTASK" || arm === "unfrozen");
  for (const p of params) p.g.fill(0);
  veto.gw.fill(0); veto.gb = 0;
  let lsum = 0, nuA = 0, nuB = 0, nA = 0, nB = 0;
  for (let b = 0; b < B; b++) {
    const e = u61PickR1(M, dataRng, fixedMasks);
    const ctx = dataRng.int(10) < 5 ? 1 : 0; // 50% B
    const label = ctx === 1 ? 0 : e.y;
    const fw1 = inSeqForward(M, e.x, new Float64Array(8), fixedMasks);
    const ceHv = inCELossGrad(fw1.hvLog, e.v);
    const dHv = new Float64Array(4); for (let o = 0; o < 4; o++) dHv[o] = ceHv.d[o] * auxW / B;
    const vhat = argmax4(fw1.hvLog);
    const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
    const fw2 = inSeqForward(M, x2m, fw1.cNew, fixedMasks);
    const mean2 = inMeanLogits({ logitsK: fw2.logitsK });
    const nu = u61Nu(veto, ctx, arm);
    if (ctx === 0) { nuA += nu; nA++; } else { nuB += nu; nB++; }
    const eff = new Float64Array(4);
    for (let o = 0; o < 4; o++) eff[o] = (1 - nu) * mean2[o] + nu * (o === 0 ? U61_K : 0);
    const ce = inCELossGrad(eff, label);
    lsum += ce.loss;
    const dEff = new Float64Array(4); for (let o = 0; o < 4; o++) dEff[o] = ce.d[o] / B;
    const dMean2 = new Float64Array(4); for (let o = 0; o < 4; o++) dMean2[o] = (1 - nu) * dEff[o];
    let dnu = 0; for (let o = 0; o < 4; o++) dnu += dEff[o] * ((o === 0 ? U61_K : 0) - mean2[o]);
    dnu /= B;
    const gg = nu * (1 - nu);
    if (arm === "vetoSUP") { lsum += U61_LAM_SUP * (-(ctx * Math.log(nu + 1e-12) + (1 - ctx) * Math.log(1 - nu + 1e-12))); veto.gw[ctx] += U61_LAM_SUP * (nu - ctx) / B; } // own objective: non-vanishing direct supervision
    if (arm === "vetoSUP" || arm === "vetoTASK" || arm === "unfrozen") veto.gw[ctx] += dnu * gg; // split-bias: B-rows cannot drag A
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
      if (p.g[i] !== 0) throw new Error("U61-FROZEN-VIOLATION: trunk grad nonzero in veto arm");
    }
  }
  if (arm === "vetoSUP" || arm === "vetoTASK" || arm === "unfrozen") { veto.w[0] -= U61_VETO_LR * veto.gw[0]; veto.w[1] -= U61_VETO_LR * veto.gw[1]; }
  else if (arm === "global") { veto.b -= U61_VETO_LR * veto.gb; }
  veto.gw.fill(0); veto.gb = 0;
  return { loss: lsum / B, nuA: nA ? nuA / nA : 0, nuB: nB ? nuB / nB : 0 };
}
// Wave 0: load-check + VETO3 2-param gradcheck (+unchanged global scalar) + twins + diet/K/chance/probe checks.
globalThis.runU61Wave0 = async function (fs, log) {
  try { const prev = JSON.parse(await fs.readTextFile(U61_WAVE0_PATH)); if (prev && prev.verdict === "COMPLETE") { log(U61_WAVE0_PATH + " exists, skip"); return prev; } } catch (e) {}
  for (const f of ["u32FreshStack", "u32SnapshotParams", "u32MaxAbsDiff", "u33StackHash", "u32Sha256Hex", "IntrinsicInit", "inSeqForward", "inSeqBackward", "inMeanLogits", "inCELossGrad", "curVoteDisagree", "inSeqGenShift", "u38TrainOneStep"]) {
    if (typeof globalThis[f] !== "function") throw new Error("U61 Wave-0 HALT: missing stack fn " + f);
  }
  log("u61-wave0 stack fns present (13/13)");
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
      for (let o = 0; o < 4; o++) { const eff = (1 - nu) * m2[o] + nu * (o === 0 ? U61_K : 0); L += dE[o] * eff; }
      L += U61_LAM_SUP * (-(ctx * Math.log(nu + 1e-12) + (1 - ctx) * Math.log(1 - nu + 1e-12)));
      return L;
    };
    const nu = 1 / (1 + Math.exp(-(ctx === 0 ? wA : wB)));
    let dnu = 0; for (let o = 0; o < 4; o++) dnu += dE[o] * ((o === 0 ? U61_K : 0) - m2[o]);
    const gg = nu * (1 - nu);
    const ana = [ctx === 0 ? dnu * gg + U61_LAM_SUP * (nu - ctx) : 0, ctx === 1 ? dnu * gg + U61_LAM_SUP * (nu - ctx) : 0];
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
  log("u61-wave0 veto-gradcheck worst=" + wworst.toExponential(2) + " nBad=" + nbad + "/64 joint (task + LAM_SUP*BCE — checks the new supervision term; global scalar = U54 path)");
  if (nbad !== 0) throw new Error("U61 Wave-0 HALT: veto gradcheck FAIL");
  // (b) twins: phase-1 step + phase-2 step per arm.
  const twins = [];
  for (const arm of ["noveto", "global", "vetoSUP", "vetoTASK", "unfrozen"]) {
    for (const s of [0, 1, 2]) {
      const X = await globalThis.u32FreshStack(fs, s);
      const Y = await globalThis.u32FreshStack(fs, s);
      const Xv = u61MakeVeto(), Yv = u61MakeVeto();
      for (const p of X.params) p.g.fill(0);
      for (const p of Y.params) p.g.fill(0);
      u38TrainOneStep(X.M, X.params, null, X.opt, X.dataRng, X.fixedMasks, false);
      u38TrainOneStep(Y.M, Y.params, null, Y.opt, Y.dataRng, Y.fixedMasks, false);
      const st1 = globalThis.u32MaxAbsDiff(globalThis.u32SnapshotParams(X.M), globalThis.u32SnapshotParams(Y.M));
      const r1 = u61Phase2Step(X.M, X.params, Xv, X.opt, X.dataRng, X.fixedMasks, arm);
      const r2 = u61Phase2Step(Y.M, Y.params, Yv, Y.opt, Y.dataRng, Y.fixedMasks, arm);
      const st2 = globalThis.u32MaxAbsDiff(globalThis.u32SnapshotParams(X.M), globalThis.u32SnapshotParams(Y.M));
      const vd = Math.max(Math.abs(Xv.w[0] - Yv.w[0]), Math.abs(Xv.w[1] - Yv.w[1]), Math.abs(Xv.b - Yv.b));
      const pass = st1.max === 0 && st2.max === 0 && vd === 0;
      twins.push({ arm, seed: s, p1diff: st1.max, p2diff: st2.max, vetoDiff: vd, pass });
      log("u61-wave0 twin " + arm + " s" + s + " p1=" + st1.max + " p2=" + st2.max + " veto=" + vd.toExponential(1) + " loss=" + r1.loss.toFixed(4) + "/" + r2.loss.toFixed(4));
      if (!pass) throw new Error("U61 Wave-0 HALT: twin nondeterminism " + arm + " s" + s);
    }
  }
  // (c) diet balance: B-fraction over 2000 draws (seed-fixed rng).
  const drng = G0.makeRng(777);
  let nb = 0; for (let i = 0; i < 2000; i++) if (drng.int(10) < 5) nb++;
  const bfrac = nb / 2000;
  log("u61-wave0 diet B-fraction=" + bfrac.toFixed(3) + " (expect ~0.50)");
  if (Math.abs(bfrac - 0.5) > 0.03) throw new Error("U61 Wave-0 HALT: diet balance off");
  // (d) K-sanity: nu=1 forces class 0; nu=0 reproduces mean2 argmax.
  const m2t = new Float64Array([1.0, 3.0, 0.5, 2.0]);
  const eff1 = [0, 1, 2, 3].map((o) => (1 - 1) * m2t[o] + 1 * (o === 0 ? U61_K : 0));
  const eff0 = [0, 1, 2, 3].map((o) => (1 - 0) * m2t[o]);
  const am = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  if (am(eff1) !== 0 || am(eff0) !== 1) throw new Error("U61 Wave-0 HALT: K-sanity fail");
  log("u61-wave0 K-sanity ok (nu=1→0, nu=0→argmax mean2)");
  // (e) chance math: 4-class probes → chance 0.25; floor 0.45 above chance. Epsilon absolute-on-rate.
  // (f) probe reproducibility: same stream → identical inputs twice.
  const prng1 = G0.makeRng(53100), prng2 = G0.makeRng(53100);
  const e1 = inSeqGenShift(prng1, null), e2 = inSeqGenShift(prng2, null);
  const sameX = e1.x.every((v, i) => v === e2.x[i]) && e1.qk === e2.qk && e1.k === e2.k && e1.v === e2.v && e1.y === e2.y;
  if (!sameX) throw new Error("U61 Wave-0 HALT: probe stream not reproducible");
  log("u61-wave0 probe-stream reproducible");
  const body = { spec: "self-u61-ext4-prereg", track: "U61-EXT4", wave: 0, verdict: "COMPLETE", vetoGradcheck: { worst: wworst, nBad: nbad }, twins, dietBfrac: +bfrac.toFixed(4), kSanity: true, chancePerProbe: 0.25, floorNote: "0.45 > chance 0.25 (guard, not competence bar)", evalN: 200 };
  await fs.writeTextFile(U61_WAVE0_PATH, JSON.stringify(body));
  log("u61-wave0 COMPLETE");
  return body;
};
// Wave 1: phase 1 (per arm-seed, to criterion-or-cap) then phase 2 (800 steps).
globalThis.runU61Train = async function (fs, log, opts) {
  const { seed, arm, phase } = opts;
  if (!["noveto", "global", "vetoSUP", "vetoTASK", "unfrozen"].includes(arm)) throw new Error("arm must be noveto|global|vetoSUP|vetoTASK|unfrozen");
  if (phase !== 2) throw new Error("U61 Phase-1 reused from U57 ledgers (battery-ratified); train phase must be 2"); // Phase-1 block below retained dead
  const ledgerPath = phase === 1 ? u61Phase1Path(seed, arm) : u61Phase2Path(seed, arm);
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  const h = await globalThis.u33StackHash(fs);
  if (h.hex !== U61_EXPECT_STACK) throw new Error("U61-PIN HALT: stack drift " + h.hex.slice(0, 16));
  const drvSrc = await fs.readTextFile("src/evidence/decomp/newai-selfu61-driver.js");
  const drvHash = await u32Sha256Hex(drvSrc);
  const t = await globalThis.u32FreshStack(fs, seed);
  const P0 = globalThis.u32SnapshotParams(t.M);
  const veto = u61MakeVeto();
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
      if (step % 200 === 0) log("u61-p1 " + arm + " s" + seed + " step " + step + "/800");
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
      spec: "self-u61-ext4-prereg", track: "U61-EXT4", arm, seed, phase: 1, steps, criterionAt,
      diet: "U38-c0 (U36-D1 + 12.5% mismatch, no gate)", verdict: "COMPLETE",
      recipeMatch: "C6/auxW0.5/lam2.0/B16/K5/H48/armCode76/diverse+mismatch",
      stackHash: h.hex, u61DriverHash: drvHash, wallMs: Date.now() - t0, curve,
      checkpoint: { acc: +(ckHit / 200).toFixed(4), n: 200, inputsHash: inHash },
      P0, P, Veto0, Veto: [veto.w[0], veto.w[1], veto.b],
    };
    await fs.writeTextFile(ledgerPath, JSON.stringify(body));
    log("u61-p1 " + arm + " s" + seed + " COMPLETE steps=" + steps + " criterionAt=" + criterionAt + " ckpt=" + body.checkpoint.acc);
    return body;
  }
  // Phase 2: load own phase-1 P, run 800 steps balanced.
  const p1 = JSON.parse(await fs.readTextFile(u61Phase1Path(seed, arm)));
  if (p1.verdict !== "COMPLETE") throw new Error("phase-1 ledger missing " + u61Phase1Path(seed, arm));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(t.M.E, p1.P.E); load(t.M.W1, p1.P.W1); load(t.M.b1, p1.P.b1);
  load(t.M.Wf, p1.P.Wf); load(t.M.bf, p1.P.bf); load(t.M.Wc, p1.P.Wc); load(t.M.bc, p1.P.bc);
  for (let k = 0; k < 5; k++) { load(t.M.Wh[k], p1.P.Wh[k]); load(t.M.bh[k], p1.P.bh[k]); }
  load(t.M.Hv, p1.P.Hv); load(t.M.bv, p1.P.bv);
  const ck = await u32Sha256Hex(JSON.stringify(p1.P));
  for (let step = 0; step < 800; step++) {
    for (const p of t.params) p.g.fill(0);
    const r = u61Phase2Step(t.M, t.params, veto, t.opt, t.dataRng, t.fixedMasks, arm);
    if (step % 100 === 0 || step === 799) {
      curve.push({ step, loss: +r.loss.toFixed(6) });
      vetoCurve.push({ step, nuA: +r.nuA.toFixed(4), nuB: +r.nuB.toFixed(4), wA: +veto.w[0].toFixed(4), wB: +veto.w[1].toFixed(4), b: +veto.b.toFixed(4) });
    }
    if (step % 200 === 0) log("u61-p2 " + arm + " s" + seed + " step " + step + "/800 loss=" + r.loss.toFixed(4) + " nu=" + r.nuA.toFixed(2) + "/" + r.nuB.toFixed(2));
  }
  const P = globalThis.u32SnapshotParams(t.M);
  const body = {
    spec: "self-u61-ext4-prereg", track: "U61-EXT4", arm, seed, phase: 2, steps: 800,
    diet: "balanced 50/50 (B rows label 0, A rows label y), R1 inputs", verdict: "COMPLETE",
    stackHash: h.hex, u61DriverHash: drvHash, wallMs: Date.now() - t0, curve, vetoCurve,
    phase1: u61Phase1Path(seed, arm), phase1CkHash: ck,
    P0: p1.P, P, Veto0, Veto: [veto.w[0], veto.w[1], veto.b],
  };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("u61-p2 " + arm + " s" + seed + " COMPLETE lossN=" + curve[curve.length - 1].loss + " nu=" + vetoCurve[vetoCurve.length - 1].nuA + "/" + vetoCurve[vetoCurve.length - 1].nuB);
  return body;
};
// Wave 2: frozen probes CTX-A / CTX-B / RET-A (N=200 each, fixed streams).
globalThis.runU61Eval = async function (fs, log, opts) {
  const { seed, arm } = opts;
  const trainPath = u61Phase2Path(seed, arm), evalPath = u61EvalPath(seed, arm);
  try { const prev = JSON.parse(await fs.readTextFile(evalPath)); if (prev && prev.verdict === "COMPLETE") { log(evalPath + " exists, skip"); return prev; } } catch (e) {}
  const G = await globalThis.IntrinsicInit(fs);
  const tr = JSON.parse(await fs.readTextFile(trainPath));
  if (tr.verdict !== "COMPLETE") throw new Error("phase-2 ledger missing " + trainPath);
  const cur = await globalThis.u33StackHash(fs);
  if (cur.hex !== tr.stackHash) throw new Error("U61-PIN HALT: stack drift since train");
  const M = inSeqMakeModel(G.makeRng(1));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(M.E, tr.P.E); load(M.W1, tr.P.W1); load(M.b1, tr.P.b1);
  load(M.Wf, tr.P.Wf); load(M.bf, tr.P.bf); load(M.Wc, tr.P.Wc); load(M.bc, tr.P.bc);
  for (let k = 0; k < 5; k++) { load(M.Wh[k], tr.P.Wh[k]); load(M.bh[k], tr.P.bh[k]); }
  load(M.Hv, tr.P.Hv); load(M.bv, tr.P.bv);
  const vw = tr.Veto;
  const nuOf = (ctx) => arm === "noveto" ? 0 : (arm === "vetoSUP" || arm === "vetoTASK" || arm === "unfrozen") ? u61Sig(vw[ctx]) : u61Sig(vw[2]);
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
      const eff = [0, 1, 2, 3].map((o) => (1 - nu) * mean2[o] + nu * (o === 0 ? U61_K : 0));
      if (argmax4(eff) === labelOf(e)) hit++;
    }
    return { acc: hit / 200, nuMean: nuSum / 200, inps };
  };
  const ctxA = runProbe(53400, 0, (e) => e.y);
  const ctxB = runProbe(53500, 1, () => 0);
  const retA = runProbe(53100, 0, (e) => e.y);
  const hashOf = async (inps) => u32Sha256Hex(JSON.stringify(inps.map((r) => [Array.from(r[0]), r[1], r[2], r[3], r[4]])));
  const p1 = JSON.parse(await fs.readTextFile(u61Phase1Path(seed, arm)));
  const retHash = await hashOf(retA.inps);
  if (retHash !== p1.checkpoint.inputsHash) throw new Error("U61-PROBE-DRIFT HALT: RET-A inputs differ from checkpoint probe");
  const body = {
    spec: "self-u61-ext4-prereg", track: "U61-EXT4", arm, seed, verdict: "COMPLETE", n: 200,
    frozenTest: true, evalOf: trainPath, stackHash: cur.hex,
    accCtxA: +ctxA.acc.toFixed(4), accCtxB: +ctxB.acc.toFixed(4), accRetA: +retA.acc.toFixed(4),
    vetoA: +retA.nuMean.toFixed(4), vetoB: +ctxB.nuMean.toFixed(4),
    checkpointAcc: p1.checkpoint.acc, retInputsHash: retHash,
  };
  await fs.writeTextFile(evalPath, JSON.stringify(body));
  log("u61-eval " + arm + " s" + seed + " ctxA=" + body.accCtxA + " ctxB=" + body.accCtxB + " retA=" + body.accRetA + " (ckpt " + p1.checkpoint.acc + ") veto=" + body.vetoA + "/" + body.vetoB);
  return body;
};
// Verdict (20 seeds, quorum 15/20 v1.1 Q1): PIN + CTX + NOERASE + ISOLATE + FLOOR (+ cause). P5 already closed: misfire kills E-EXT2 line only.
globalThis.runU61Verdict = async function (fs, log) {
  const perSeed = [];
  for (let seed = 0; seed < 20; seed++) {
    const T = {}, E = {};
    for (const arm of ["noveto", "global", "vetoSUP", "vetoTASK", "unfrozen"]) {
      T[arm] = JSON.parse(await fs.readTextFile(u61Phase2Path(seed, arm)));
      E[arm] = JSON.parse(await fs.readTextFile(u61EvalPath(seed, arm)));
    }
    const P1 = {};
    for (const arm of ["noveto", "global", "vetoSUP", "vetoTASK", "unfrozen"]) P1[arm] = JSON.parse(await fs.readTextFile(u61Phase1Path(seed, arm))); // D3 repair: u61Phase1Path maps vetoSUP/vetoTASK to the shared U57 veto file; the old ["veto"] key left P1.vetoSUP undefined (verdict crash)
    const pinHash = ["noveto", "global", "vetoSUP", "vetoTASK", "unfrozen"].every((a) => T[a].stackHash === U61_EXPECT_STACK && E[a].stackHash === U61_EXPECT_STACK && P1[a].stackHash === U61_EXPECT_STACK);
    const ckSame = ["global", "vetoSUP", "vetoTASK", "unfrozen"].every((a) => P1[a].checkpoint.inputsHash === P1.noveto.checkpoint.inputsHash);
    const frozenKept = (() => { // D6 repair: stale T.veto key (split-arm rename); check BOTH veto arms' Phase-2 P vs P0 — frozen trunk per filed design
      const a = JSON.stringify(T.vetoSUP.P), b = JSON.stringify(T.vetoSUP.P0);
      const c = JSON.stringify(T.vetoTASK.P), d = JSON.stringify(T.vetoTASK.P0);
      return a === b && c === d;
    })();
    const ev = E.vetoSUP, er = E.vetoTASK, eu = E.unfrozen, eg = E.global, en = E.noveto;
    const lowComp = ev.checkpointAcc < 0.28;
    const ctx = { a: ev.accCtxA, b: ev.accCtxB, ckpt: ev.checkpointAcc, lowComp, pass: ev.accCtxA >= ev.checkpointAcc - 0.03 && ev.accCtxB >= 0.95 };
    const noerase = { d: +(ev.accRetA - ev.checkpointAcc).toFixed(4), vetoA: ev.vetoA, pass: Math.abs(ev.accRetA - ev.checkpointAcc) <= 0.02 && ev.vetoA <= 0.05, misfire: ev.vetoA > 0.05 };
    const isolate = { uCtx: eu.accCtxA >= eu.checkpointAcc - 0.03 && eu.accCtxB >= 0.95, uRetFail: Math.abs(eu.accRetA - eu.checkpointAcc) > 0.02, pass: (eu.accCtxA >= eu.checkpointAcc - 0.03 && eu.accCtxB >= 0.95) && Math.abs(eu.accRetA - eu.checkpointAcc) > 0.02 };
    const floor = { pass: en.accCtxA >= 0.45 && ev.accCtxA >= 0.45 && eg.accCtxA >= 0.45 && er.accCtxA >= 0.45 && eu.accCtxA >= 0.45 }; // all 5 evaluated arms
    perSeed.push({
      seed,
      pin: { match: pinHash && ckSame && frozenKept, pass: pinHash && ckSame && frozenKept, frozenKept },
      arms: { noveto: { ctxA: en.accCtxA, ctxB: en.accCtxB, ret: en.accRetA }, global: { ctxA: eg.accCtxA, ctxB: eg.accCtxB, ret: eg.accRetA }, vetoSUP: { ctxA: ev.accCtxA, ctxB: ev.accCtxB, ret: ev.accRetA, ckpt: ev.checkpointAcc, vetoA: ev.vetoA, vetoB: ev.vetoB }, vetoTASK: { ctxA: er.accCtxA, ctxB: er.accCtxB, ret: er.accRetA, ckpt: er.checkpointAcc, vetoA: er.vetoA, vetoB: er.vetoB }, unfrozen: { ctxA: eu.accCtxA, ctxB: eu.accCtxB, ret: eu.accRetA, ckpt: eu.checkpointAcc } },
      ctx, noerase, isolate, floor,
    });
    const r = perSeed[seed];
    log("u61-verdict s" + seed + " PIN=" + (r.pin.pass ? "ok" : "FAIL") + " veto=" + r.arms.vetoSUP.ctxA + "/" + r.arms.vetoSUP.ctxB + " ret=" + r.arms.vetoSUP.ret + "(ckpt " + r.arms.vetoSUP.ckpt + ") vetoAB=" + r.arms.vetoSUP.vetoA + "/" + r.arms.vetoSUP.vetoB + " rep=" + r.arms.vetoTASK.vetoA + " unfr=" + r.arms.unfrozen.ctxA + "/" + r.arms.unfrozen.ctxB + "/" + r.arms.unfrozen.ret + " noveto=" + r.arms.noveto.ctxA + "/" + r.arms.noveto.ctxB);
  }
  const q = (f) => perSeed.filter((s) => f(s)).length;
  const pinN = q((s) => s.pin.pass), ctxN = q((s) => s.ctx.pass), noeN = q((s) => s.noerase.pass);
  const isoN = q((s) => s.isolate.pass), floorN = q((s) => s.floor.pass);
  const misN = q((s) => s.noerase.misfire);
  const repMean = perSeed.reduce((s, x) => s + x.arms.vetoTASK.vetoA, 0) / perSeed.length;
  let verdict = "", cause = "clean";
  if (pinN < 20) { verdict = "PIN-FAIL"; cause = "pin"; }
  else if (floorN < 15) { verdict = "FLOOR-FAIL"; cause = "floor"; }
  else if (Math.abs(repMean - 0.059) > 0.02) { verdict = "TASK-NOREP"; cause = "replication control off (mean vetoTASK vetoA " + repMean.toFixed(4) + " vs U57 0.059 — audit U57 before interpreting candidate)"; }
  else if (misN >= 7) { verdict = "SUP-PERSISTS"; cause = "candidate vetoA breach at quorum DESPITE direct supervision (leak deeper than objective; veto line dead)"; }
  else if (ctxN < 15) { verdict = "SUP-PERSISTS"; cause = "ctx-joint fail at quorum (cannot implement policy even supervised)"; }
  else if (noeN < 15) { verdict = "SUP-PERSISTS"; cause = "noerasure-breach with clean vetoA (association not preservable under suppression)"; }
  else if (isoN < 15) {
    const unfrHolds = q((s) => (s.arms.unfrozen.accCtxA >= s.arms.unfrozen.ckpt - 0.03 && s.arms.unfrozen.accCtxB >= 0.95) && Math.abs(s.arms.unfrozen.accRetA - s.arms.unfrozen.ckpt) <= 0.02);
    verdict = "SUP-PERSISTS"; cause = "isolate fail at quorum (unfrHolds " + unfrHolds + "/20" + (unfrHolds >= 15 ? "; freezing redundant" : "; neither isolate nor holds") + ")";
  }
  else verdict = "SUP-FIXED";
  if (verdict === "SUP-FIXED") cause = "clean (candidate holds under balanced with own objective; replication leaks as expected)";
  const body = {
    spec: "self-u61-ext4-prereg", track: "U61-EXT4", verdict, cause,
    bars: {
      "SUP-PIN": pinN + "/20 (stack + checkpoint identity + VETO3 weights byte-frozen + trunk-grad-0 assert)",
      "SUP-CTX": ctxN + "/20 (quorum 15/20 v1.1 Q1; vetoSUP CTX-A>=ckpt-0.03 AND CTX-B>=0.95; A1 relative)",
      "SUP-NOERASE": noeN + "/20 (quorum 15/20 v1.1 Q1; |ret-ckpt|<=0.02 AND vetoA<=0.05)",
      "SUP-ISOLATE": isoN + "/20 (quorum 15/20 v1.1 Q1; UNFROZEN behavior-pass relative + retention-fail; A1)",
      "SUP-FLOOR": floorN + "/20 (quorum 15/20 v1.1 Q1; CTX-A>=0.45 all 5 arms; floor-first gating)",
      "LOWCOMP-FLAG": perSeed.filter((s) => s.ctx.lowComp).length + "/20 seeds ckpt<0.28 (diagnostic, no quorum change)",
      "REPLICATION-CHECK": "vetoTASK mean vetoA " + repMean.toFixed(4) + " vs U57 0.059 (tolerance 0.02; else TASK-NOREP)",
      "MISFIRE-COUNT": misN + "/20 (candidate misfire=vetoA>0.05; >=7 kills EXT4 line; P5 already closed, not a P5 event)",
    },
    perSeed,
  };
  await fs.writeTextFile(U61_VERDICT_PATH, JSON.stringify(body));
  log("u61-verdict " + verdict + " cause=" + cause + " PIN " + pinN + "/20 CTX " + ctxN + "/20 NOERASE " + noeN + "/20 ISOLATE " + isoN + "/20 FLOOR " + floorN + "/20 MISFIRE " + misN + "/20");
  return body;
};
// v1.1 Wave-0 sanity (review-adopted + 15/20 quorum — full logic, runs ONLY under fresh countersign):
// W0-RAND: scrambled ctx pilot (vetoSUP-only, 1 seed x 200 steps pilot — Wave-1's 100-train
//   count UNCHANGED). A seeded coin flips ctx per row before label/nu/loss use, destroying
//   the ctx->label contingency while keeping marginals. Gate: veto must NOT separate
//   (mean|nuA-nuB| small, SUP-CTX would fail); else HALT-RAND (leak/circularity).
//   Separate arm instances: each run calls u32FreshStack fresh (own params/opt/rng);
//   veto arms assert trunk-grad-0 every step (see u61Phase2Step frozen branch), so the
//   shared frozen trunk is identical initialization, never shared mutable state.
// W0-TRIV: obvious-cue diet (vetoSUP-only pilot, ctx perfectly predicts label, A-rows fixed
//   to y=3 far from 0). Gate: veto MUST separate cleanly (would-be SUP-CTX pass); else HALT-TRIV.
// Both go/no-go only: LAM_SUP=1.0, lr, K, balanced 50/50, U54 probes all unchanged.
function u61Phase2StepScrambled(M, params, veto, opt, dataRng, fixedMasks, arm, scrRng) {
  const B = 16, auxW = 0.5, lam = 2.0, K = 5;
  const argmax4 = (a) => { let b = 0; for (let i = 0; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  const frozen = (arm === "vetoSUP" || arm === "vetoTASK"); // D2 repair: U57's (arm==="veto") never fires under U61's split arm names; filed design is frozen trunk + VETO3 (SUP-PIN trunk-grad-0 assert)
  const useCtx = (arm === "vetoSUP" || arm === "vetoTASK" || arm === "unfrozen");
  void useCtx;
  for (const p of params) p.g.fill(0);
  veto.gw.fill(0); veto.gb = 0;
  let lsum = 0, nuA = 0, nuB = 0, nA = 0, nB = 0;
  for (let b = 0; b < B; b++) {
    const e = u61PickR1(M, dataRng, fixedMasks);
    const ctxTrue = dataRng.int(10) < 5 ? 1 : 0;
    const ctx = scrRng.int(2) === 0 ? ctxTrue : 1 - ctxTrue; // destroy contingency
    const label = ctx === 1 ? 0 : e.y;
    const fw1 = inSeqForward(M, e.x, new Float64Array(8), fixedMasks);
    const ceHv = inCELossGrad(fw1.hvLog, e.v);
    const dHv = new Float64Array(4); for (let o = 0; o < 4; o++) dHv[o] = ceHv.d[o] * auxW / B;
    const vhat = argmax4(fw1.hvLog);
    const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
    const fw2 = inSeqForward(M, x2m, fw1.cNew, fixedMasks);
    const mean2 = inMeanLogits({ logitsK: fw2.logitsK });
    const nu = u61Nu(veto, ctx, arm);
    if (ctxTrue === 0) { nuA += nu; nA++; } else { nuB += nu; nB++; }
    const eff = new Float64Array(4);
    for (let o = 0; o < 4; o++) eff[o] = (1 - nu) * mean2[o] + nu * (o === 0 ? U61_K : 0);
    const ce = inCELossGrad(eff, label);
    lsum += ce.loss;
    const dEff = new Float64Array(4); for (let o = 0; o < 4; o++) dEff[o] = ce.d[o] / B;
    const dMean2 = new Float64Array(4); for (let o = 0; o < 4; o++) dMean2[o] = (1 - nu) * dEff[o];
    let dnu = 0; for (let o = 0; o < 4; o++) dnu += dEff[o] * ((o === 0 ? U61_K : 0) - mean2[o]);
    dnu /= B;
    const gg = nu * (1 - nu);
    if (arm === "vetoSUP") { lsum += U61_LAM_SUP * (-(ctx * Math.log(nu + 1e-12) + (1 - ctx) * Math.log(1 - nu + 1e-12))); veto.gw[ctx] += U61_LAM_SUP * (nu - ctx) / B; }
    if (arm === "vetoSUP" || arm === "vetoTASK" || arm === "unfrozen") veto.gw[ctx] += dnu * gg;
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
      if (p.g[i] !== 0) throw new Error("U61-FROZEN-VIOLATION: trunk grad nonzero in veto arm");
    }
  }
  if (arm === "vetoSUP" || arm === "vetoTASK" || arm === "unfrozen") { veto.w[0] -= U61_VETO_LR * veto.gw[0]; veto.w[1] -= U61_VETO_LR * veto.gw[1]; }
  else if (arm === "global") { veto.b -= U61_VETO_LR * veto.gb; }
  veto.gw.fill(0); veto.gb = 0;
  return { loss: lsum / B, nuA: nA ? nuA / nA : 0, nuB: nB ? nuB / nB : 0, nA, nB }; // D5: counts for pilot-average gating
}
globalThis.runU61Wave0Rand = async function (fs, log) {
  const h = await globalThis.u33StackHash(fs);
  if (h.hex !== U61_EXPECT_STACK) throw new Error("U61-PIN HALT: stack drift");
  const G = await globalThis.IntrinsicInit(fs);
  const t = await globalThis.u32FreshStack(fs, 0);
  const veto = u61MakeVeto();
  const scrRng = G.makeRng(97531);
  let tA = 0, tB = 0, cA = 0, cB = 0; // D5: accumulate over the WHOLE pilot — last-batch means (B=16, ~3 true-A rows) are pure noise
  for (let step = 0; step < 200; step++) {
    const r = u61Phase2StepScrambled(t.M, t.params, veto, t.opt, t.dataRng, t.fixedMasks, "vetoSUP", scrRng);
    tA += r.nuA * r.nA; cA += r.nA; tB += r.nuB * r.nB; cB += r.nB;
    if (step % 100 === 0) log("u61-w0-rand vetoSUP pilot step " + step + "/200 nuA=" + r.nuA.toFixed(3) + " nuB=" + r.nuB.toFixed(3) + " (batch; gate uses pilot average)");
  }
  const nuA = cA ? tA / cA : 0, nuB = cB ? tB / cB : 0; // pilot-average: same 50/50 mixture both groups by construction
  const sep = Math.abs(nuA - nuB);
  log("u61-w0-rand scrambled pilot sep=" + sep.toFixed(4) + " (expect ~0, must NOT separate)");
  const body = { spec: "self-u61-ext4-prereg", track: "U61-EXT4", wave: "0-rand", verdict: "COMPLETE", nuA: +nuA.toFixed(4), nuB: +nuB.toFixed(4), sep: +sep.toFixed(4), steps: 200 };
  if (sep > 0.2) throw new Error("U61 HALT-RAND: veto separates on scrambled ctx (leak/circularity) sep=" + sep.toFixed(3)); // D-pin: 0.2 pilot gate — at chance (nu~0.5 both) sep~0; separation on noise stops the line. Go/no-go only.
  await fs.writeTextFile("src/evidence/decomp/d-newai-self-u61-wave0-rand.json", JSON.stringify(body));
  return body;
};
globalThis.runU61Wave0Triv = async function (fs, log) {
  const h = await globalThis.u33StackHash(fs);
  if (h.hex !== U61_EXPECT_STACK) throw new Error("U61-PIN HALT: stack drift");
  const G = await globalThis.IntrinsicInit(fs);
  const t = await globalThis.u32FreshStack(fs, 1);
  const veto = u61MakeVeto();
  let nuA = 0, nuB = 0, tA = 0, tB = 0, cA = 0, cB = 0; // D5: pilot averages (last-batch TRIV gate would be batch noise too)
  for (let step = 0; step < 200; step++) {
    for (const p of t.params) p.g.fill(0);
    veto.gw.fill(0); veto.gb = 0;
    let lsum = 0, sA = 0, sB = 0, nA = 0, nB = 0;
    for (let b = 0; b < 16; b++) {
      const e = u61PickR1(t.M, t.dataRng, t.fixedMasks);
      const ctx = t.dataRng.int(10) < 5 ? 1 : 0;
      const label = ctx === 1 ? 0 : 3; // trivial: A-rows always y=3, far from 0
      const fw1 = inSeqForward(t.M, e.x, new Float64Array(8), t.fixedMasks);
      const vhat = (() => { let bb = 0; for (let i = 1; i < 4; i++) if (fw1.hvLog[i] > fw1.hvLog[bb]) bb = i; return bb; })();
      const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
      const fw2 = inSeqForward(t.M, x2m, fw1.cNew, t.fixedMasks);
      const mean2 = inMeanLogits({ logitsK: fw2.logitsK });
      const nu = u61Nu(veto, ctx, "vetoSUP");
      if (ctx === 0) { sA += nu; nA++; } else { sB += nu; nB++; }
      const eff = new Float64Array(4);
      for (let o = 0; o < 4; o++) eff[o] = (1 - nu) * mean2[o] + nu * (o === 0 ? U61_K : 0);
      const ce = inCELossGrad(eff, label);
      lsum += ce.loss;
      const dEff = new Float64Array(4); for (let o = 0; o < 4; o++) dEff[o] = ce.d[o] / 16;
      let dnu = 0; for (let o = 0; o < 4; o++) dnu += dEff[o] * ((o === 0 ? U61_K : 0) - mean2[o]);
      dnu /= 16;
      const gg = nu * (1 - nu);
      lsum += U61_LAM_SUP * (-(ctx * Math.log(nu + 1e-12) + (1 - ctx) * Math.log(1 - nu + 1e-12)));
      veto.gw[ctx] += (U61_LAM_SUP * (nu - ctx) + dnu * gg) / 1;
    }
    veto.w[0] -= U61_VETO_LR * veto.gw[0] / 16; veto.w[1] -= U61_VETO_LR * veto.gw[1] / 16;
    veto.gw.fill(0); veto.gb = 0;
    nuA = nA ? sA / nA : 0; nuB = nB ? sB / nB : 0;
    tA += nuA * nA; cA += nA; tB += nuB * nB; cB += nB; // D5: accumulate whole pilot
    void lsum;
    if (step % 100 === 0) log("u61-w0-triv vetoSUP pilot step " + step + "/200 nuA=" + nuA.toFixed(3) + " nuB=" + nuB.toFixed(3) + " (batch; gate uses pilot average)");
  }
  nuA = cA ? tA / cA : 0; nuB = cB ? tB / cB : 0; // D5: pilot-average gate
  const sep = nuB - nuA;
  log("u61-w0-triv obvious-cue pilot sep(B-A)=" + sep.toFixed(4) + " (expect large positive)");
  const body = { spec: "self-u61-ext4-prereg", track: "U61-EXT4", wave: "0-triv", verdict: "COMPLETE", nuA: +nuA.toFixed(4), nuB: +nuB.toFixed(4), sep: +sep.toFixed(4), steps: 200 };
  if (!(nuB > 0.7 && nuA < 0.3)) throw new Error("U61 HALT-TRIV: veto blind even to obvious cue nuA=" + nuA.toFixed(3) + " nuB=" + nuB.toFixed(3)); // D-pin: obvious-cue gate (B=suppress nu->1, A=release nu->0); failure = power/design flaw. Go/no-go only.
  await fs.writeTextFile("src/evidence/decomp/d-newai-self-u61-wave0-triv.json", JSON.stringify(body));
  return body;
};
