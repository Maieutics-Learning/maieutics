// newai-selfu36-driver.js — U36 diverse-world + dynamic-scorer.
//
// Licensed by U35 WALLED-AT-SCALE (structural wall, stop scaling; architecture
// track forced) + inhibition-papers mapping (Norman 2007 dynamic schedule;
// McNab preparatory; Anderson 2016 reactive; Henson monitor; Nakajima early
// filter — sequenced follow-ups, NOT this wave).
//
// NO stack surgery: H48 via u32FreshStack (inSeqMakeModel); forward/backward/
// params/snapshot/seed-streams all pinned. stackHash stays 258d2f06….
// Arms (NEW paths; history never written), H48 only:
//   c0: diverse diet + STATIC scorer (alpha=0; diet-only control).
//   c1: diverse diet + DYNAMIC scorer (Norman-style schedule, parameter-free).
// Every train ledger carries stackHash + P0 + u36DriverHash. CPU/in-worker.
// COMPLETE-gated, resume skips COMPLETE. NO PUSH.
//
// D1 (filed deviation, same session, bars unchanged): prereg §Design named the
// diverse mix "50% W6 + 25% R2 + 25% R4, reusing filed U31f regime code". The
// filed U31f R2/R4 recipes need the frozen-trunk context stack (Mf + MP +
// HDold + S/SC/HF/INH + Mo — 5+ filed models per step) and R4 relabels the
// round-2 target, which would break train-eval label match (evals are standard
// y). Driver implements the diet intent cheaply with identical labels and no
// extra loads, shared by BOTH arms (so COMPOSE still isolates dynamics):
//   roll 0-1 (50%): W6 base pick-max (U34 block verbatim).
//   roll 2 (25%): OOD-bind inputs — qk!=v filtered pick-max (R3-flavoured;
//     same labels; rejection-sample max 10, fallback to last).
//   roll 3 (25%): easiness spectrum — uniform-pick over C=6 (no disagree;
//     easy+hard mix; cheap stand-in for the R2 crowded-neighbourhood idea).
// R4 hop-relabel is DROPPED (train labels stay standard y/v so eval transfer
// is clean; hop pressure stays via the trunk's own round-1→round-2 path).
// U36-DIET remains a measurement; U36-COMPOSE is same-diet c1−c0.
//
// Dynamic scorer (parameter-free schedule, no new learned params):
//   alpha(t) = 0.15 + 0.10*sin(2πt/200), t = global step (train).
//   adjusted_o = mean_o − alpha*(K−cnt_o)/K, cnt from head argmax votes
//     (stop-gradient: penalty constant for the backward; HIGH alpha sharpens
//     the winner = HIGH inhibition, LOW alpha lets competitors live).
// Train (c1): CE(adjusted_mean2, y) replaces CE(mean2, y); per-head aux,
//   round-1, oracle-aux(wCo=0 — none in U36), lam, clip all unchanged.
// Eval: c1 uses alpha=BASE (0.15, time-average); c0 uses alpha=0. Oracle
//   forward adjusted with the same arm alpha (own votes), so the gap bar is
//   scorer-consistent per arm.
//
// RUN (execute_js, fs in scope):
//   const src = await fs.readTextFile("src/evidence/decomp/newai-selfu36-driver.js");
//   (0, eval)(src + "\n//# sourceURL=newai-selfu36-driver.js");
//   await globalThis.SelfU36Init(fs);
//   const log = (m) => console.log(m);
//   await globalThis.runU36Wave0(fs, log);
//   await globalThis.runU36Train(fs, log, {seed, arm});  // arm c0|c1
//   await globalThis.runU36Eval(fs, log, {seed, arm});
//   await globalThis.runU36Verdict(fs, log);
globalThis.SelfU36Init = async function (fs) {
  const src = await fs.readTextFile("src/evidence/decomp/newai-selfu34-driver.js");
  (0, eval)(src + "\n//# sourceURL=newai-selfu34-driver.js");
  await globalThis.SelfU34Init(fs);
  if (typeof globalThis.u32FreshStack !== "function") throw new Error("u36 stack load failed");
};
const U36_EXPECT_STACK = "258d2f060684ce382778e203959ab791abb5df79af174deef19ff568886d4d6e";
const U36_ALPHA_BASE = 0.15, U36_ALPHA_AMP = 0.10, U36_ALPHA_PERIOD = 200;
function u36AlphaAt(step) { return U36_ALPHA_BASE + U36_ALPHA_AMP * Math.sin(2 * Math.PI * step / U36_ALPHA_PERIOD); }
function u36TrainPath(seed, arm) { return "src/evidence/decomp/d-newai-self-u36-" + arm + "-s" + seed + "-800st.json"; }
function u36EvalPath(seed, arm) { return "src/evidence/decomp/d-newai-self-u36-eval-" + arm + "-s" + seed + "-800st.json"; }
const U36_VERDICT_PATH = "src/evidence/decomp/d-newai-self-u36-verdict.json";
const U36_WAVE0_PATH = "src/evidence/decomp/d-newai-self-u36-wave0.json";
// Adjust mean logits by competitor penalty (penalty holder computes votes).
function u36AdjustMean(meanLogits, headArgs, alpha) {
  const K = headArgs.length, cnt = [0, 0, 0, 0];
  for (const a of headArgs) cnt[a]++;
  const out = new Float64Array(4);
  for (let o = 0; o < 4; o++) out[o] = meanLogits[o] - alpha * (K - cnt[o]) / K;
  return { adj: out, cnt };
}
function u36HeadArgs(logitsK) {
  return logitsK.map((lg) => { let b = 0; for (let o = 1; o < 4; o++) if (lg[o] > lg[b]) b = o; return b; });
}
// One diverse-diet candidate pick. Returns the picked episode e.
// Uses current M for pick-max (rolls 0-2) or uniform (roll 3).
function u36PickEpisode(M, dataRng, fixedMasks) {
  const C = 6;
  const roll = dataRng.int(4);
  if (roll === 3) {
    // uniform-pick: easy+hard mix, no disagree.
    const cands = [];
    for (let c = 0; c < C; c++) { const ub = dataRng.int(2) === 0; cands.push(ub ? inSeqGenShift(dataRng, 0) : inSeqGenShift(dataRng, null)); }
    return { e: cands[dataRng.int(C)], roll };
  }
  // pick-max (rolls 0,1 base; roll 2 OOD-filtered).
  const cands = [];
  for (let c = 0; c < C; c++) {
    let e = null;
    if (roll === 2) {
      // OOD-bind: qk != v (rejection-sample, cheap, same labels).
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
  return { e: cands[pk], roll };
}
// Production step: U34 c0 body verbatim + diverse diet + dynamic round-2 scorer.
// alphaFn(step) supplies the schedule for c1; c0 passes () => 0.
function u36TrainOneStep(M, params, opt, dataRng, fixedMasks, step, alphaFn) {
  const B = 16, C = 6, auxW = 0.5, lam = 2.0, K = 5;
  void C;
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  const alpha = alphaFn(step);
  let lsum = 0, dietCount = [0, 0, 0];
  for (let b = 0; b < B; b++) {
    const { e, roll } = u36PickEpisode(M, dataRng, fixedMasks);
    if (roll <= 1) dietCount[0]++; else if (roll === 2) dietCount[1]++; else dietCount[2]++;
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
    let dMean2, loss2;
    if (alpha === 0) {
      const ce2 = inCELossGrad(mean2, e.y);
      dMean2 = new Float64Array(4); for (let o = 0; o < 4; o++) dMean2[o] = ce2.d[o] / B;
      loss2 = ce2.loss;
    } else {
      const ha = u36HeadArgs(fw2.logitsK);
      const { adj } = u36AdjustMean(mean2, ha, alpha);
      const ceA = inCELossGrad(adj, e.y);
      dMean2 = new Float64Array(4); for (let o = 0; o < 4; o++) dMean2[o] = ceA.d[o] / B;
      loss2 = ceA.loss;
    }
    const mean1 = inMeanLogits({ logitsK: fw1.logitsK });
    const ce1m = inCELossGrad(mean1, e.y);
    const dMean1 = new Float64Array(4); for (let o = 0; o < 4; o++) dMean1[o] = ce1m.d[o] * 0.3 / B;
    lsum += loss2 + auxW * ceHv.loss;
    const dc = inSeqBackward(M, fw2, dMean2, perHead2, null, null, fixedMasks);
    inSeqBackward(M, fw1, dMean1, perHead1, dHv, dc, fixedMasks);
    const meanW = new Float64Array(M.Wh[0].v.length);
    for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) meanW[i] += M.Wh[k].v[i] / K;
    for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) M.Wh[k].g[i] += lam * (M.Wh[k].v[i] - meanW[i]) / (B * M.H);
  }
  let s = 0; for (const p of params) for (let i = 0; i < p.g.length; i++) s += p.g[i] * p.g[i];
  const n = Math.sqrt(s);
  if (n > 1.0) { const sc = 1.0 / n; for (const p of params) for (let i = 0; i < p.g.length; i++) p.g[i] *= sc; }
  let gnorm = 0; for (const p of params) for (let i = 0; i < p.g.length; i++) gnorm += p.g[i] * p.g[i];
  gnorm = Math.sqrt(gnorm);
  opt.step(params);
  return { loss: lsum / B, gnorm, dietCount };
}
// Wave 0: (a) isolated dynamic-term gradcheck (absolute, held penalty);
// (b) twin determinism per arm (P0 + 1-step exact, 3 seeds).
globalThis.runU36Wave0 = async function (fs, log) {
  try { const prev = JSON.parse(await fs.readTextFile(U36_WAVE0_PATH)); if (prev && prev.verdict === "COMPLETE") { log(U36_WAVE0_PATH + " exists, skip"); return prev; } } catch (e) {}
  // (a) isolated gradcheck: CE(adjust(mean)) — pure softmax math, must pass absolute.
  const G0 = await globalThis.IntrinsicInit(fs);
  const grng = G0.makeRng(31337);
  let wworst = 0, nbad = 0;
  const NT = 24, eeps = 1e-6;
  for (let t = 0; t < NT; t++) {
    const mean = new Float64Array(4);
    for (let o = 0; o < 4; o++) mean[o] = (grng.int(2000) - 1000) / 500;
    const ha = [grng.int(4), grng.int(4), grng.int(4), grng.int(4), grng.int(4)];
    const y = grng.int(4);
    const alpha = 0.15;
    const lossOf = (m) => inCELossGrad(u36AdjustMean(m, ha, alpha).adj, y).loss;
    const ceA = inCELossGrad(u36AdjustMean(mean, ha, alpha).adj, y);
    const ana = Array.from(ceA.d);
    for (let o = 0; o < 4; o++) {
      const a0 = mean[o];
      mean[o] = a0 + eeps; const lp = lossOf(mean);
      mean[o] = a0 - eeps; const lm = lossOf(mean);
      mean[o] = a0;
      const num = (lp - lm) / (2 * eeps);
      const rel = Math.abs(ana[o] - num) / Math.max(1e-8, Math.abs(ana[o]) + Math.abs(num));
      if (rel > wworst) wworst = rel;
      if (rel > 1e-5) nbad++;
    }
  }
  const gradPass = nbad === 0;
  log("u36-wave0 dyn-gradcheck worst=" + wworst.toExponential(2) + " nBad=" + nbad + "/" + (NT * 4));
  if (!gradPass) throw new Error("U36 Wave-0 HALT: dynamic-term gradcheck FAIL worst=" + wworst);
  // (b) twins per arm.
  const twins = [];
  for (const arm of ["c0", "c1"]) {
    const alphaFn = arm === "c1" ? u36AlphaAt : (() => 0);
    for (const s of [0, 1, 2]) {
      const X = await globalThis.u32FreshStack(fs, s);
      const Y = await globalThis.u32FreshStack(fs, s);
      const p0 = globalThis.u32MaxAbsDiff(globalThis.u32SnapshotParams(X.M), globalThis.u32SnapshotParams(Y.M));
      for (const p of X.params) p.g.fill(0);
      for (const p of Y.params) p.g.fill(0);
      u36TrainOneStep(X.M, X.params, X.opt, X.dataRng, X.fixedMasks, 0, alphaFn);
      u36TrainOneStep(Y.M, Y.params, Y.opt, Y.dataRng, Y.fixedMasks, 0, alphaFn);
      const st = globalThis.u32MaxAbsDiff(globalThis.u32SnapshotParams(X.M), globalThis.u32SnapshotParams(Y.M));
      twins.push({ arm, seed: s, p0diff: p0.max, step1diff: st.max, pass: p0.max === 0 && st.max === 0 });
      log("u36-wave0 twin " + arm + " s" + s + " p0=" + p0.max + " step1=" + st.max);
      if (p0.max !== 0 || st.max !== 0) throw new Error("U36 Wave-0 HALT: twin nondeterminism " + arm + " s" + s);
    }
  }
  const body = { spec: "self-u36-diverse-dynamic-prereg", wave: 0, verdict: "COMPLETE", dynGradcheck: { worst: wworst, nBad: nbad, pass: gradPass }, twins, deviations: ["D1 (diet recipe, filed in driver header): R2 margin-filter -> uniform-pick + OOD qk!=v (no frozen loads); R4 hop-relabel DROPPED (train-eval label match); both arms share diet so COMPOSE still isolates dynamics."] };
  await fs.writeTextFile(U36_WAVE0_PATH, JSON.stringify(body));
  log("u36-wave0 COMPLETE dyn-grad + twins PASS (D1 filed)");
  return body;
};
// Wave 1: diverse-diet trunk train for one seed x arm (fresh init, pinned streams).
globalThis.runU36Train = async function (fs, log, opts) {
  const { seed, arm } = opts;
  if (arm !== "c0" && arm !== "c1") throw new Error("arm must be c0|c1");
  const ledgerPath = u36TrainPath(seed, arm);
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  const h = await globalThis.u33StackHash(fs);
  if (h.hex !== U36_EXPECT_STACK) throw new Error("U36-PIN HALT: stack drift at train time " + h.hex.slice(0, 16));
  const drvSrc = await fs.readTextFile("src/evidence/decomp/newai-selfu36-driver.js");
  const drvHash = await u32Sha256Hex(drvSrc);
  const t = await globalThis.u32FreshStack(fs, seed);
  const P0 = globalThis.u32SnapshotParams(t.M);
  const alphaFn = arm === "c1" ? u36AlphaAt : (() => 0);
  const steps = 800, t0 = Date.now(), curve = [];
  let dietTot = [0, 0, 0];
  for (let step = 0; step < steps; step++) {
    for (const p of t.params) p.g.fill(0);
    const r = u36TrainOneStep(t.M, t.params, t.opt, t.dataRng, t.fixedMasks, step, alphaFn);
    dietTot[0] += r.dietCount[0]; dietTot[1] += r.dietCount[1]; dietTot[2] += r.dietCount[2];
    if (step % 100 === 0 || step === steps - 1) curve.push({ step, loss: +r.loss.toFixed(6) });
    if (step % 200 === 0) log("u36-train " + arm + " s" + seed + " step " + step + "/800 loss=" + r.loss.toFixed(4) + " alpha=" + alphaFn(step).toFixed(3));
  }
  const P = globalThis.u32SnapshotParams(t.M);
  const body = {
    spec: "self-u36-diverse-dynamic-prereg", track: "U36-DYNDIET", arm, seed, steps,
    B: 16, lr: 5e-3, K: 5, H: 48, C: 6, auxW: 0.5, lam: 2.0,
    diet: "50/25/25 base/ood/uniform (D1)", scorer: arm === "c1" ? "dynamic alpha=0.15+0.10*sin(2πt/200)" : "static alpha=0",
    alphaBase: 0.15, alphaAmp: 0.10, alphaPeriod: 200, evalAlpha: arm === "c1" ? 0.15 : 0,
    bootstraps: "b%K slices (same as cur-pick)", verdict: "COMPLETE",
    recipeMatch: "C6/auxW0.5/800st/lam2.0/B16/lr5e-3/K5/H48/armCode76/diverse-diet + " + (arm === "c1" ? "dynamic-scorer" : "static-scorer"),
    stackHash: h.hex, stackFiles: h.perFile.map((f) => f.path), u36DriverHash: drvHash,
    wallMs: Date.now() - t0, curve, divCos: +inMeanCos(t.M).toFixed(4), dietTot, P0, P,
  };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("u36-train " + arm + " s" + seed + " COMPLETE loss0=" + curve[0].loss + " lossN=" + curve[curve.length - 1].loss + " divCos=" + body.divCos + " diet=" + dietTot.join("/"));
  return body;
};
// Wave 2: paired evals (model ALWAYS loaded from ledger; arm scorer at round-2).
globalThis.runU36Eval = async function (fs, log, opts) {
  const { seed, arm } = opts;
  const trainPath = u36TrainPath(seed, arm), evalPath = u36EvalPath(seed, arm);
  try { const prev = JSON.parse(await fs.readTextFile(evalPath)); if (prev && prev.verdict === "COMPLETE") { log(evalPath + " exists, skip"); return prev; } } catch (e) {}
  const G = await globalThis.IntrinsicInit(fs);
  const tr = JSON.parse(await fs.readTextFile(trainPath));
  if (tr.verdict !== "COMPLETE") throw new Error("train ledger missing " + trainPath);
  const cur = await globalThis.u33StackHash(fs);
  if (cur.hex !== tr.stackHash) throw new Error("U36-PIN HALT: stack drift since train " + trainPath);
  const M = inSeqMakeModel(G.makeRng(1));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(M.E, tr.P.E); load(M.W1, tr.P.W1); load(M.b1, tr.P.b1);
  load(M.Wf, tr.P.Wf); load(M.bf, tr.P.bf); load(M.Wc, tr.P.Wc); load(M.bc, tr.P.bc);
  for (let k = 0; k < 5; k++) { load(M.Wh[k], tr.P.Wh[k]); load(M.bh[k], tr.P.bh[k]); }
  load(M.Hv, tr.P.Hv); load(M.bv, tr.P.bv);
  const alphaE = arm === "c1" ? U36_ALPHA_BASE : 0;
  let evalMasks = null; { const fr = G.makeRng(91000 + seed); evalMasks = []; for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr.int(10) < 5 ? 2 : 0; evalMasks.push(m); } }
  const srng = G.makeRng(52500 + seed), frng = G.makeRng(52400 + seed);
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  const scoreTwo = (fw) => {
    if (alphaE === 0) return argmax4(inMeanLogits({ logitsK: fw.logitsK }));
    const mean = inMeanLogits({ logitsK: fw.logitsK });
    const ha = u36HeadArgs(fw.logitsK);
    return argmax4(u36AdjustMean(mean, ha, alphaE).adj);
  };
  const N = 200;
  let scr = 0, two = 0, orc = 0;
  for (let i = 0; i < N; i++) {
    const e = inSeqGenShift(srng, null);
    const fw1 = inSeqForward(M, e.x, new Float64Array(8), evalMasks);
    const vhat = argmax4(fw1.hvLog);
    if (vhat === e.v) scr++;
    const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
    if (scoreTwo(inSeqForward(M, x2m, fw1.cNew, evalMasks)) === e.y) two++;
    const xo = [9, 9, 9, 9, 9, 9, e.qk, e.k, e.v, 8];
    if (scoreTwo(inSeqForward(M, xo, fw1.cNew, evalMasks)) === e.y) orc++;
  }
  let fF = 0;
  for (let i = 0; i < N; i++) {
    const e = inSeqGenShift(frng, 0);
    if (argmax4(inMeanLogits({ logitsK: inSeqForward(M, e.x, new Float64Array(8), evalMasks).logitsK })) === e.y) fF++;
  }
  const body = {
    spec: "self-u36-diverse-dynamic-prereg", track: "U36-DYNDIET", arm, seed, steps: 800,
    verdict: "COMPLETE", n: N, frozenTest: true, evalOf: trainPath, stackHash: cur.hex, evalAlpha: alphaE,
    accScratch: +(scr / N).toFixed(4), accTwo: +(two / N).toFixed(4),
    accOracle: +(orc / N).toFixed(4), accFwd: +(fF / N).toFixed(4),
  };
  await fs.writeTextFile(evalPath, JSON.stringify(body));
  log("u36-eval " + arm + " s" + seed + " scr=" + body.accScratch + " two=" + body.accTwo + " orc=" + body.accOracle + " (alphaE=" + alphaE + ")");
  return body;
};
// Verdict: PIN + DIET + COMPOSE + ABS + RET + ORACLE-CHECK + FLOOR (+FRESH by record).
globalThis.runU36Verdict = async function (fs, log) {
  const canonEv = [];
  for (const seed of [0, 1, 2]) canonEv.push(JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-u33-eval-canon-s" + seed + "-800st.json")));
  const perSeed = [];
  for (const seed of [0, 1, 2]) {
    const T = {}, E = {};
    for (const arm of ["c0", "c1"]) {
      T[arm] = JSON.parse(await fs.readTextFile(u36TrainPath(seed, arm)));
      E[arm] = JSON.parse(await fs.readTextFile(u36EvalPath(seed, arm)));
    }
    const pinHash = ["c0", "c1"].every((a) => T[a].stackHash === U36_EXPECT_STACK && E[a].stackHash === U36_EXPECT_STACK);
    const p0ok = ["c0", "c1"].every((a) => T[a].P0 && T[a].P);
    const e0 = E.c0, e1 = E.c1, eC = canonEv[seed];
    const dDiet = +(e0.accTwo - eC.accTwo).toFixed(4);
    const dTwo = +(e1.accTwo - e0.accTwo).toFixed(4);
    const dAbs = +(e1.accTwo - eC.accTwo).toFixed(4);
    const gap0 = +(e0.accOracle - e0.accTwo).toFixed(4), gap1 = +(e1.accOracle - e1.accTwo).toFixed(4);
    perSeed.push({
      seed,
      pin: { match: pinHash && p0ok, pass: pinHash && p0ok },
      c0: { scr: e0.accScratch, two: e0.accTwo, orc: e0.accOracle, dDiet },
      c1: { scr: e1.accScratch, two: e1.accTwo, orc: e1.accOracle },
      canon: { scr: eC.accScratch, two: eC.accTwo },
      compose: { dTwo, pass: dTwo >= 0.05 },
      abs: { dAbs, pass: dAbs >= 0.05 },
      ret: { dScr: +(e1.accScratch - e0.accScratch).toFixed(4), pass: e1.accScratch >= e0.accScratch - 0.03 },
      oracle: { gap1, gap0, dGap: +(gap1 - gap0).toFixed(4), pass: gap1 <= gap0 + 0.02 },
      floor: { c0: e0.accScratch >= 0.50 && e0.accTwo >= 0.45, c1: e1.accScratch >= 0.50 && e1.accTwo >= 0.45 },
    });
    const r = perSeed[seed];
    log("u36-verdict s" + seed + " PIN=" + (r.pin.pass ? "ok" : "FAIL") +
      " canon=" + r.canon.scr + "/" + r.canon.two +
      " c0=" + r.c0.scr + "/" + r.c0.two + "(dDiet " + r.c0.dDiet + ")" +
      " c1=" + r.c1.scr + "/" + r.c1.two + "(dTwo " + dTwo + " dAbs " + dAbs + " gap " + gap1 + "vs" + gap0 + ")");
  }
  const q = (f) => perSeed.filter((s) => f(s)).length;
  const pinN = q((s) => s.pin.pass);
  const composeN = q((s) => s.compose.pass), absN = q((s) => s.abs.pass);
  const retN = q((s) => s.ret.pass), oracleN = q((s) => s.oracle.pass);
  const floorN = q((s) => s.floor.c0 && s.floor.c1);
  let verdict = "";
  if (pinN < 3) verdict = "PIN-FAIL";
  else if (floorN < 3) verdict = "FLOOR-FAIL";
  else if (composeN < 2 && Math.abs(perSeed[0].c0.dDiet) < 0.05 && Math.abs(perSeed[1].c0.dDiet) < 0.05 && Math.abs(perSeed[2].c0.dDiet) < 0.05) verdict = "WALLED-AGAIN";
  else if (composeN < 2) verdict = "DIET-ONLY";
  else if (absN < 2 || retN < 2 || oracleN < 2) verdict = "DYN-PARTIAL";
  else verdict = "DYN-WORKS";
  // Refine WALLED vs DIET-ONLY: DIET-ONLY needs diet lift on 2/3 (informational; verdict text carries dDiet).
  const dietLiftN = q((s) => Math.abs(s.c0.dDiet) >= 0.05);
  if (verdict === "DIET-ONLY" && dietLiftN < 2) verdict = "WALLED-AGAIN";
  const body = {
    spec: "self-u36-diverse-dynamic-prereg", verdict,
    bars: {
      "U36-PIN": pinN + "/3 (stackHash " + U36_EXPECT_STACK.slice(0, 12) + "… all 6 ledgers + P0)",
      "U36-DIET": "dDiet " + perSeed.map((s) => s.c0.dDiet.toFixed(3)).join("/") + " (two_c0-diverse − two_canon; measurement)",
      "U36-COMPOSE": composeN + "/3 (two_c1 − two_c0 ≥ +0.05, same diet)",
      "U36-ABS": absN + "/3 (two_c1 − two_canon ≥ +0.05)",
      "U36-RET": retN + "/3 (scr_c1 ≥ scr_c0 − 0.03)",
      "U36-ORACLE-CHECK": oracleN + "/3 (gap_c1 ≤ gap_c0 + 0.02)",
      "U36-FLOOR": floorN + "/3 (scr ≥ 0.50, two ≥ 0.45, all 6)",
      "U36-FRESH": "battery 3x IMPLEMENTABLE unanimous, 12/12 HEALTH -> v1.0 STANDS",
    },
    perSeed,
    deviations: ["D1 (Wave-0, in driver header + wave0 ledger): R2 margin-filter -> uniform-pick + OOD qk!=v (no frozen loads); R4 hop-relabel DROPPED (train-eval label match); both arms share diet so COMPOSE still isolates dynamics."],
  };
  await fs.writeTextFile(U36_VERDICT_PATH, JSON.stringify(body));
  log("u36-verdict " + verdict + " COMPOSE " + composeN + "/3 ABS " + absN + "/3 RET " + retN + "/3 ORACLE " + oracleN + "/3 FLOOR " + floorN + "/3 DIET " + perSeed.map((s) => s.c0.dDiet).join("/"));
  return body;
};
