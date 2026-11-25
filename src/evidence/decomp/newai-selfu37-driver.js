// newai-selfu37-driver.js — U37 learned per-class inhibition.
//
// Escalation licensed by U36 DIET-ONLY (scheduled dynamics decorative 0/3;
// diet shuffles without quorum move). One variable: scheduled vs LEARNED
// scorer on the frozen U36-D1 diet. NO stack surgery; stackHash stays
// 258d2f06…. H48 only. CPU/in-worker. COMPLETE-gated. NO PUSH.
//
// c0 control: U36-c1 recipe VERBATIM (diverse diet + alpha(t) schedule,
//   eval alpha=BASE). Proves the baseline the learned arm must beat.
// c1 primary: diverse diet + learned inh[4] (init 0.15 each, fixed, filed L3):
//   adjusted_o = mean_o − inh[o]·(K−cnt_o)/K, cnt from head votes (stop-grad).
//   inh trains through the CE grad via the same Adam (params list extended).
// Ablation (teeth): c1 eval re-scores the same rows with inh zeroed; the lift
//   must live in inh (INH-USE ≥ +0.03) or it does not count (hollow guard).
// Every train ledger carries stackHash + P0/P + Inh0/Inh + u37DriverHash.
//
// RUN (execute_js, fs in scope):
//   const src = await fs.readTextFile("src/evidence/decomp/newai-selfu37-driver.js");
//   (0, eval)(src + "\n//# sourceURL=newai-selfu37-driver.js");
//   await globalThis.SelfU37Init(fs);
//   const log = (m) => console.log(m);
//   await globalThis.runU37Wave0(fs, log);
//   await globalThis.runU37Train(fs, log, {seed, arm});  // arm c0|c1
//   await globalThis.runU37Eval(fs, log, {seed, arm});
//   await globalThis.runU37Verdict(fs, log);
globalThis.SelfU37Init = async function (fs) {
  const src = await fs.readTextFile("src/evidence/decomp/newai-selfu36-driver.js");
  (0, eval)(src + "\n//# sourceURL=newai-selfu36-driver.js");
  await globalThis.SelfU36Init(fs);
  if (typeof globalThis.u36PickEpisode !== "function") throw new Error("u37 stack load failed");
};
const U37_EXPECT_STACK = "258d2f060684ce382778e203959ab791abb5df79af174deef19ff568886d4d6e";
const U37_INH_INIT = 0.15;
function u37TrainPath(seed, arm) { return "src/evidence/decomp/d-newai-self-u37-" + arm + "-s" + seed + "-800st.json"; }
function u37EvalPath(seed, arm) { return "src/evidence/decomp/d-newai-self-u37-eval-" + arm + "-s" + seed + "-800st.json"; }
const U37_VERDICT_PATH = "src/evidence/decomp/d-newai-self-u37-verdict.json";
const U37_WAVE0_PATH = "src/evidence/decomp/d-newai-self-u37-wave0.json";
function u37MakeInh() { return { v: new Float64Array([U37_INH_INIT, U37_INH_INIT, U37_INH_INIT, U37_INH_INIT]), g: new Float64Array(4) }; }
// Learned step: U36 body + per-class inh (replaces schedule alpha).
function u37TrainOneStepLearned(M, params, inh, opt, dataRng, fixedMasks) {
  const B = 16, auxW = 0.5, lam = 2.0, K = 5;
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  let lsum = 0;
  for (let b = 0; b < B; b++) {
    const { e } = u36PickEpisode(M, dataRng, fixedMasks);
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
    const ha = u36HeadArgs(fw2.logitsK);
    const cnt = [0, 0, 0, 0]; for (const a of ha) cnt[a]++;
    const adj = new Float64Array(4);
    for (let o = 0; o < 4; o++) adj[o] = mean2[o] - inh.v[o] * (K - cnt[o]) / K;
    const ceA = inCELossGrad(adj, e.y);
    const dMean2 = new Float64Array(4); for (let o = 0; o < 4; o++) dMean2[o] = ceA.d[o] / B;
    for (let o = 0; o < 4; o++) inh.g[o] += -ceA.d[o] * (K - cnt[o]) / K / B;
    lsum += ceA.loss;
    const mean1 = inMeanLogits({ logitsK: fw1.logitsK });
    const ce1m = inCELossGrad(mean1, e.y);
    const dMean1 = new Float64Array(4); for (let o = 0; o < 4; o++) dMean1[o] = ce1m.d[o] * 0.3 / B;
    lsum += auxW * ceHv.loss;
    const dc = inSeqBackward(M, fw2, dMean2, perHead2, null, null, fixedMasks);
    inSeqBackward(M, fw1, dMean1, perHead1, dHv, dc, fixedMasks);
    const meanW = new Float64Array(M.Wh[0].v.length);
    for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) meanW[i] += M.Wh[k].v[i] / K;
    for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) M.Wh[k].g[i] += lam * (M.Wh[k].v[i] - meanW[i]) / (B * M.H);
  }
  let s = 0;
  for (const p of params) for (let i = 0; i < p.g.length; i++) s += p.g[i] * p.g[i];
  for (let i = 0; i < 4; i++) s += inh.g[i] * inh.g[i];
  const n = Math.sqrt(s);
  if (n > 1.0) {
    const sc = 1.0 / n;
    for (const p of params) for (let i = 0; i < p.g.length; i++) p.g[i] *= sc;
    for (let i = 0; i < 4; i++) inh.g[i] *= sc;
  }
  let gnorm = 0;
  for (const p of params) for (let i = 0; i < p.g.length; i++) gnorm += p.g[i] * p.g[i];
  for (let i = 0; i < 4; i++) gnorm += inh.g[i] * inh.g[i];
  gnorm = Math.sqrt(gnorm);
  opt.step(params.concat([inh]));
  return { loss: lsum / B, gnorm };
}
// Wave 0: (a) isolated learned-term gradcheck (mean-grad + inh-grad, absolute);
// (b) twin determinism per arm incl. Inh (P0/P/Inh 1-step exact).
globalThis.runU37Wave0 = async function (fs, log) {
  try { const prev = JSON.parse(await fs.readTextFile(U37_WAVE0_PATH)); if (prev && prev.verdict === "COMPLETE") { log(U37_WAVE0_PATH + " exists, skip"); return prev; } } catch (e) {}
  const G0 = await globalThis.IntrinsicInit(fs);
  const grng = G0.makeRng(37371);
  let wworst = 0, nbad = 0;
  const NT = 16, eeps = 1e-6;
  for (let t = 0; t < NT; t++) {
    const mean = new Float64Array(4);
    for (let o = 0; o < 4; o++) mean[o] = (grng.int(2000) - 1000) / 500;
    const ha = [grng.int(4), grng.int(4), grng.int(4), grng.int(4), grng.int(4)];
    const cnt = [0, 0, 0, 0]; for (const a of ha) cnt[a]++;
    const inh = new Float64Array(4);
    for (let o = 0; o < 4; o++) inh[o] = 0.05 + grng.int(300) / 1000;
    const y = grng.int(4);
    const adjOf = (m, iv) => {
      const a = new Float64Array(4);
      for (let o = 0; o < 4; o++) a[o] = m[o] - iv[o] * (5 - cnt[o]) / 5;
      return a;
    };
    const ceA = inCELossGrad(adjOf(mean, inh), y);
    // analytic: dMean = dAdj; dInh[o] = -dAdj[o]*(K-cnt)/K
    for (let o = 0; o < 4; o++) {
      const a0 = mean[o];
      mean[o] = a0 + eeps; const lp = inCELossGrad(adjOf(mean, inh), y).loss;
      mean[o] = a0 - eeps; const lm = inCELossGrad(adjOf(mean, inh), y).loss;
      mean[o] = a0;
      const num = (lp - lm) / (2 * eeps);
      const rel = Math.abs(ceA.d[o] - num) / Math.max(1e-8, Math.abs(ceA.d[o]) + Math.abs(num));
      if (rel > wworst) wworst = rel;
      if (rel > 1e-5) nbad++;
    }
    for (let o = 0; o < 4; o++) {
      const ana = -ceA.d[o] * (5 - cnt[o]) / 5;
      const i0 = inh[o];
      inh[o] = i0 + eeps; const lp = inCELossGrad(adjOf(mean, inh), y).loss;
      inh[o] = i0 - eeps; const lm = inCELossGrad(adjOf(mean, inh), y).loss;
      inh[o] = i0;
      const num = (lp - lm) / (2 * eeps);
      const rel = Math.abs(ana - num) / Math.max(1e-8, Math.abs(ana) + Math.abs(num));
      if (rel > wworst) wworst = rel;
      if (rel > 1e-5) nbad++;
    }
  }
  const gradPass = nbad === 0;
  log("u37-wave0 learned-gradcheck worst=" + wworst.toExponential(2) + " nBad=" + nbad + "/" + (NT * 8));
  if (!gradPass) throw new Error("U37 Wave-0 HALT: learned-term gradcheck FAIL worst=" + wworst);
  const twins = [];
  for (const arm of ["c0", "c1"]) {
    for (const s of [0, 1, 2]) {
      const X = await globalThis.u32FreshStack(fs, s);
      const Y = await globalThis.u32FreshStack(fs, s);
      const Xi = u37MakeInh(), Yi = u37MakeInh();
      const p0 = globalThis.u32MaxAbsDiff(globalThis.u32SnapshotParams(X.M), globalThis.u32SnapshotParams(Y.M));
      let imax = 0; for (let i = 0; i < 4; i++) imax = Math.max(imax, Math.abs(Xi.v[i] - Yi.v[i]));
      for (const p of X.params) p.g.fill(0);
      for (const p of Y.params) p.g.fill(0);
      Xi.g.fill(0); Yi.g.fill(0);
      if (arm === "c0") {
        u36TrainOneStep(X.M, X.params, X.opt, X.dataRng, X.fixedMasks, 0, u36AlphaAt);
        u36TrainOneStep(Y.M, Y.params, Y.opt, Y.dataRng, Y.fixedMasks, 0, u36AlphaAt);
      } else {
        u37TrainOneStepLearned(X.M, X.params, Xi, X.opt, X.dataRng, X.fixedMasks);
        u37TrainOneStepLearned(Y.M, Y.params, Yi, Y.opt, Y.dataRng, Y.fixedMasks);
      }
      const st = globalThis.u32MaxAbsDiff(globalThis.u32SnapshotParams(X.M), globalThis.u32SnapshotParams(Y.M));
      let istep = 0; for (let i = 0; i < 4; i++) istep = Math.max(istep, Math.abs(Xi.v[i] - Yi.v[i]));
      twins.push({ arm, seed: s, p0diff: p0.max, step1diff: st.max, inh0diff: imax, inh1diff: istep, pass: p0.max === 0 && st.max === 0 && imax === 0 && istep === 0 });
      log("u37-wave0 twin " + arm + " s" + s + " p0=" + p0.max + " step1=" + st.max + " inh1=" + istep.toExponential(1));
      if (p0.max !== 0 || st.max !== 0 || imax !== 0 || istep !== 0) throw new Error("U37 Wave-0 HALT: twin nondeterminism " + arm + " s" + s);
    }
  }
  const body = { spec: "self-u37-learned-inhib-prereg", wave: 0, verdict: "COMPLETE", learnedGradcheck: { worst: wworst, nBad: nbad, pass: gradPass }, twins };
  await fs.writeTextFile(U37_WAVE0_PATH, JSON.stringify(body));
  log("u37-wave0 COMPLETE learned-grad + twins PASS");
  return body;
};
// Wave 1: trunk train per seed x arm. c0 = scheduled (U36-c1 verbatim call),
// c1 = learned inh.
globalThis.runU37Train = async function (fs, log, opts) {
  const { seed, arm } = opts;
  if (arm !== "c0" && arm !== "c1") throw new Error("arm must be c0|c1");
  const ledgerPath = u37TrainPath(seed, arm);
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  const h = await globalThis.u33StackHash(fs);
  if (h.hex !== U37_EXPECT_STACK) throw new Error("U37-PIN HALT: stack drift at train time " + h.hex.slice(0, 16));
  const drvSrc = await fs.readTextFile("src/evidence/decomp/newai-selfu37-driver.js");
  const drvHash = await u32Sha256Hex(drvSrc);
  const t = await globalThis.u32FreshStack(fs, seed);
  const P0 = globalThis.u32SnapshotParams(t.M);
  const inh = u37MakeInh();
  const Inh0 = Array.from(inh.v);
  const steps = 800, t0 = Date.now(), curve = [], inhCurve = [];
  for (let step = 0; step < steps; step++) {
    for (const p of t.params) p.g.fill(0);
    inh.g.fill(0);
    let r;
    if (arm === "c0") r = u36TrainOneStep(t.M, t.params, t.opt, t.dataRng, t.fixedMasks, step, u36AlphaAt);
    else r = u37TrainOneStepLearned(t.M, t.params, inh, t.opt, t.dataRng, t.fixedMasks);
    if (step % 100 === 0 || step === steps - 1) { curve.push({ step, loss: +r.loss.toFixed(6) }); if (arm === "c1") inhCurve.push({ step, inh: Array.from(inh.v).map((x) => +x.toFixed(4)) }); }
    if (step % 200 === 0) log("u37-train " + arm + " s" + seed + " step " + step + "/800 loss=" + r.loss.toFixed(4) + (arm === "c1" ? " inh=[" + Array.from(inh.v).map((x) => x.toFixed(3)).join(",") + "]" : ""));
  }
  const P = globalThis.u32SnapshotParams(t.M);
  const body = {
    spec: "self-u37-learned-inhib-prereg", track: "U37-LEARNINH", arm, seed, steps,
    B: 16, lr: 5e-3, K: 5, H: 48, C: 6, auxW: 0.5, lam: 2.0,
    diet: "U36-D1 50/25/25 base/ood/uniform", scorer: arm === "c1" ? "learned inh[4] init 0.15" : "scheduled alpha(t) (U36-c1 verbatim)",
    bootstraps: "b%K slices (same as cur-pick)", verdict: "COMPLETE",
    recipeMatch: "C6/auxW0.5/800st/lam2.0/B16/lr5e-3/K5/H48/armCode76/diverse-diet + " + (arm === "c1" ? "learned-inh" : "scheduled"),
    stackHash: h.hex, stackFiles: h.perFile.map((f) => f.path), u37DriverHash: drvHash,
    wallMs: Date.now() - t0, curve, inhCurve, divCos: +inMeanCos(t.M).toFixed(4), P0, P, Inh0, Inh: Array.from(inh.v),
  };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("u37-train " + arm + " s" + seed + " COMPLETE loss0=" + curve[0].loss + " lossN=" + curve[curve.length - 1].loss + " divCos=" + body.divCos + (arm === "c1" ? " inh=[" + body.Inh.map((x) => (+x).toFixed(3)).join(",") + "]" : ""));
  return body;
};
// Wave 2: paired evals with arm scorer + c1 forced-zero ablation (same rows).
globalThis.runU37Eval = async function (fs, log, opts) {
  const { seed, arm } = opts;
  const trainPath = u37TrainPath(seed, arm), evalPath = u37EvalPath(seed, arm);
  try { const prev = JSON.parse(await fs.readTextFile(evalPath)); if (prev && prev.verdict === "COMPLETE") { log(evalPath + " exists, skip"); return prev; } } catch (e) {}
  const G = await globalThis.IntrinsicInit(fs);
  const tr = JSON.parse(await fs.readTextFile(trainPath));
  if (tr.verdict !== "COMPLETE") throw new Error("train ledger missing " + trainPath);
  const cur = await globalThis.u33StackHash(fs);
  if (cur.hex !== tr.stackHash) throw new Error("U37-PIN HALT: stack drift since train " + trainPath);
  const M = inSeqMakeModel(G.makeRng(1));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(M.E, tr.P.E); load(M.W1, tr.P.W1); load(M.b1, tr.P.b1);
  load(M.Wf, tr.P.Wf); load(M.bf, tr.P.bf); load(M.Wc, tr.P.Wc); load(M.bc, tr.P.bc);
  for (let k = 0; k < 5; k++) { load(M.Wh[k], tr.P.Wh[k]); load(M.bh[k], tr.P.bh[k]); }
  load(M.Hv, tr.P.Hv); load(M.bv, tr.P.bv);
  const inh = arm === "c1" ? Float64Array.from(tr.Inh) : null;
  const schedA = 0.15;
  let evalMasks = null; { const fr = G.makeRng(91000 + seed); evalMasks = []; for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr.int(10) < 5 ? 2 : 0; evalMasks.push(m); } }
  const srng = G.makeRng(52500 + seed), frng = G.makeRng(52400 + seed);
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  const scoreTwo = (fw, inhVec) => {
    const mean = inMeanLogits({ logitsK: fw.logitsK });
    if (!inhVec) {
      if (arm === "c0") {
        const ha = u36HeadArgs(fw.logitsK);
        return argmax4(u36AdjustMean(mean, ha, schedA).adj);
      }
      return argmax4(mean);
    }
    const ha = u36HeadArgs(fw.logitsK);
    const adj = new Float64Array(4);
    for (let o = 0; o < 4; o++) adj[o] = mean[o] - inhVec[o] * (5 - [0, 0, 0, 0].map((_, i) => ha.filter((a) => a === i).length)[o]) / 5;
    return argmax4(adj);
  };
  const N = 200;
  let scr = 0, two = 0, twoAbl = 0, orc = 0;
  for (let i = 0; i < N; i++) {
    const e = inSeqGenShift(srng, null);
    const fw1 = inSeqForward(M, e.x, new Float64Array(8), evalMasks);
    const vhat = argmax4(fw1.hvLog);
    if (vhat === e.v) scr++;
    const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
    const fw2 = inSeqForward(M, x2m, fw1.cNew, evalMasks);
    if (arm === "c1") {
      if (scoreTwo(fw2, inh) === e.y) two++;
      if (scoreTwo(fw2, new Float64Array(4)) === e.y) twoAbl++;
    } else {
      if (scoreTwo(fw2, null) === e.y) two++;
      twoAbl = two;
    }
    const xo = [9, 9, 9, 9, 9, 9, e.qk, e.k, e.v, 8];
    const fwO = inSeqForward(M, xo, fw1.cNew, evalMasks);
    if (arm === "c1") { if (scoreTwo(fwO, inh) === e.y) orc++; }
    else if (scoreTwo(fwO, null) === e.y) orc++;
  }
  let fF = 0;
  for (let i = 0; i < N; i++) {
    const e = inSeqGenShift(frng, 0);
    if (argmax4(inMeanLogits({ logitsK: inSeqForward(M, e.x, new Float64Array(8), evalMasks).logitsK })) === e.y) fF++;
  }
  const body = {
    spec: "self-u37-learned-inhib-prereg", track: "U37-LEARNINH", arm, seed, steps: 800,
    verdict: "COMPLETE", n: N, frozenTest: true, evalOf: trainPath, stackHash: cur.hex,
    accScratch: +(scr / N).toFixed(4), accTwo: +(two / N).toFixed(4), accTwoAbl: +(twoAbl / N).toFixed(4),
    accOracle: +(orc / N).toFixed(4), accFwd: +(fF / N).toFixed(4), inh: arm === "c1" ? Array.from(inh) : undefined,
  };
  await fs.writeTextFile(evalPath, JSON.stringify(body));
  log("u37-eval " + arm + " s" + seed + " scr=" + body.accScratch + " two=" + body.accTwo + " twoAbl=" + body.accTwoAbl + " orc=" + body.accOracle);
  return body;
};
// Verdict: PIN + COMPOSE + ABS + RET + ORACLE-CHECK + INH-USE + FLOOR.
globalThis.runU37Verdict = async function (fs, log) {
  const canonEv = [];
  for (const seed of [0, 1, 2]) canonEv.push(JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-u33-eval-canon-s" + seed + "-800st.json")));
  const perSeed = [];
  for (const seed of [0, 1, 2]) {
    const T = {}, E = {};
    for (const arm of ["c0", "c1"]) {
      T[arm] = JSON.parse(await fs.readTextFile(u37TrainPath(seed, arm)));
      E[arm] = JSON.parse(await fs.readTextFile(u37EvalPath(seed, arm)));
    }
    const pinHash = ["c0", "c1"].every((a) => T[a].stackHash === U37_EXPECT_STACK && E[a].stackHash === U37_EXPECT_STACK);
    const p0ok = ["c0", "c1"].every((a) => T[a].P0 && T[a].P && T[a].Inh0 && T[a].Inh);
    const e0 = E.c0, e1 = E.c1, eC = canonEv[seed];
    const dTwo = +(e1.accTwo - e0.accTwo).toFixed(4);
    const dAbs = +(e1.accTwo - eC.accTwo).toFixed(4);
    const gap0 = +(e0.accOracle - e0.accTwo).toFixed(4), gap1 = +(e1.accOracle - e1.accTwo).toFixed(4);
    const inhUse = +(e1.accTwo - e1.accTwoAbl).toFixed(4);
    perSeed.push({
      seed,
      pin: { match: pinHash && p0ok, pass: pinHash && p0ok },
      c0: { scr: e0.accScratch, two: e0.accTwo, orc: e0.accOracle },
      c1: { scr: e1.accScratch, two: e1.accTwo, twoAbl: e1.accTwoAbl, orc: e1.accOracle, inh: e1.inh },
      canon: { scr: eC.accScratch, two: eC.accTwo },
      compose: { dTwo, pass: dTwo >= 0.05 },
      abs: { dAbs, pass: dAbs >= 0.05 },
      ret: { dScr: +(e1.accScratch - e0.accScratch).toFixed(4), pass: e1.accScratch >= e0.accScratch - 0.03 },
      oracle: { gap1, gap0, dGap: +(gap1 - gap0).toFixed(4), pass: gap1 <= gap0 + 0.02 },
      inhUse: { d: inhUse, pass: inhUse >= 0.03 },
      floor: { c0: e0.accScratch >= 0.50 && e0.accTwo >= 0.45, c1: e1.accScratch >= 0.50 && e1.accTwo >= 0.45 },
    });
    const r = perSeed[seed];
    log("u37-verdict s" + seed + " PIN=" + (r.pin.pass ? "ok" : "FAIL") +
      " canon=" + r.canon.scr + "/" + r.canon.two +
      " c0=" + r.c0.scr + "/" + r.c0.two + " c1=" + r.c1.scr + "/" + r.c1.two + "(abl " + r.c1.twoAbl + ")" +
      " dTwo=" + dTwo + " dAbs=" + dAbs + " inhUse=" + inhUse + " gap=" + gap1 + "vs" + gap0);
  }
  const q = (f) => perSeed.filter((s) => f(s)).length;
  const pinN = q((s) => s.pin.pass);
  const composeN = q((s) => s.compose.pass), absN = q((s) => s.abs.pass);
  const retN = q((s) => s.ret.pass), oracleN = q((s) => s.oracle.pass), inhN = q((s) => s.inhUse.pass);
  const floorN = q((s) => s.floor.c0 && s.floor.c1);
  let verdict = "";
  if (pinN < 3) verdict = "PIN-FAIL";
  else if (floorN < 3) verdict = "FLOOR-FAIL";
  else if (composeN < 2) verdict = "SCHED-ONLY";
  else if (absN < 2 || retN < 2 || oracleN < 2 || inhN < 2) verdict = "LEARN-PARTIAL";
  else verdict = "LEARN-WORKS";
  const body = {
    spec: "self-u37-learned-inhib-prereg", verdict,
    bars: {
      "U37-PIN": pinN + "/3 (stackHash " + U37_EXPECT_STACK.slice(0, 12) + "… all 6 ledgers + P0/P/Inh)",
      "U37-COMPOSE": composeN + "/3 (two_c1 − two_c0 ≥ +0.05, same diet)",
      "U37-ABS": absN + "/3 (two_c1 − two_canon ≥ +0.05)",
      "U37-RET": retN + "/3 (scr_c1 ≥ scr_c0 − 0.03)",
      "U37-ORACLE-CHECK": oracleN + "/3 (gap_c1 ≤ gap_c0 + 0.02)",
      "U37-INH-USE": inhN + "/3 (two − twoAbl ≥ +0.03, same rows)",
      "U37-FLOOR": floorN + "/3 (scr ≥ 0.50, two ≥ 0.45, all 6)",
      "U37-FRESH": "battery 3x IMPLEMENTABLE unanimous, 12/12 HEALTH -> v1.0 STANDS",
    },
    perSeed,
  };
  await fs.writeTextFile(U37_VERDICT_PATH, JSON.stringify(body));
  log("u37-verdict " + verdict + " COMPOSE " + composeN + "/3 ABS " + absN + "/3 RET " + retN + "/3 ORACLE " + oracleN + "/3 INH-USE " + inhN + "/3 FLOOR " + floorN + "/3");
  return body;
};
