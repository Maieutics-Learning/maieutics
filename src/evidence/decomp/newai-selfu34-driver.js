// newai-selfu34-driver.js — U34 compose-priced trunk training.
//
// Licensed way through the U31e/U31f self-direction wall (TRAINS-BUT-BLIND +
// SUBSTRATE-ABSENT): price the compose circuit DURING trunk training via an
// oracle-compose aux term, on the pinned U33 stack + identical W6 streams.
// Arms (NEW paths; W6/U31/u32/u33 history never written):
//   c0 control   wCo=0.0 (exact canonical replication; setup validity)
//   c1 primary   wCo=0.5
//   c2 secondary wCo=1.0 (dose direction, reported)
// Every train ledger carries stackHash (11-file U33 hash, PIN field verbatim)
// + P0 init checkpoint + u34DriverHash provenance. CPU/in-worker only.
// COMPLETE-gated, resume skips COMPLETE. NO PUSH.
//
// The oracle-aux term (prereg binding): round-2 forward with TRUE v,
//   xo=[9,9,9,9,9,9,qk,k,v,8], CE(mean logits, y), weight wCo/B added to the
//   batch loss + backpropagated through the round-2 path ONLY (the returned
//   context grad is discarded — nothing flows back into round-1 from it).
// c0 (wCo=0) executes the EXACT u32TrainOneStep (no oracle block at all),
// so c0 is bit-identical to u33-canon-A by construction, not by luck.
//
// RUN (execute_js, fs in scope):
//   const src = await fs.readTextFile("src/evidence/decomp/newai-selfu34-driver.js");
//   (0, eval)(src + "\n//# sourceURL=newai-selfu34-driver.js");
//   await globalThis.SelfU34Init(fs);
//   const log = (m) => console.log(m);
//   await globalThis.runU34Train(fs, log, {seed, arm});  // arm "c0"|"c1"|"c2"
//   await globalThis.runU34Eval(fs, log, {seed, arm});
//   await globalThis.runU34Verdict(fs, log);
globalThis.SelfU34Init = async function (fs) {
  const src = await fs.readTextFile("src/evidence/decomp/newai-selfu33-driver.js");
  (0, eval)(src + "\n//# sourceURL=newai-selfu33-driver.js");
  await globalThis.SelfU33Init(fs);
  if (!globalThis.u32FreshStack) throw new Error("u34 stack load failed");
};
const U34_EXPECT_STACK = "258d2f060684ce382778e203959ab791abb5df79af174deef19ff568886d4d6e";
const U34_ARMS = { c0: 0.0, c1: 0.5, c2: 1.0 };
function u34TrainPath(seed, arm) { return "src/evidence/decomp/d-newai-self-u34-" + arm + "-s" + seed + "-800st.json"; }
function u34EvalPath(seed, arm) { return "src/evidence/decomp/d-newai-self-u34-eval-" + arm + "-s" + seed + "-800st.json"; }
const U34_VERDICT_PATH = "src/evidence/decomp/d-newai-self-u34-verdict.json";
// U34 train step: EXACT copy of u32TrainOneStep (W6 recipe) + oracle-compose
// aux block, guarded so wCo=0 never executes it. c0 never calls this fn.
function u34TrainOneStep(M, params, opt, dataRng, fixedMasks, wCo) {
  const B = 16, C = 6, auxW = 0.5, lam = 2.0, K = 5;
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  let lsum = 0;
  for (let b = 0; b < B; b++) {
    const cands = [];
    for (let c = 0; c < C; c++) { const ub = dataRng.int(2) === 0; cands.push(ub ? inSeqGenShift(dataRng, 0) : inSeqGenShift(dataRng, null)); }
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
    // ORACLE-COMPOSE AUX (prereg): clean-signal price on the compose circuit.
    if (wCo !== 0) {
      const xo = [9, 9, 9, 9, 9, 9, e.qk, e.k, e.v, 8];
      const fwO = inSeqForward(M, xo, fw1.cNew, fixedMasks);
      const meanO = inMeanLogits({ logitsK: fwO.logitsK });
      const ceO = inCELossGrad(meanO, e.y);
      const dMeanO = new Float64Array(4); for (let o = 0; o < 4; o++) dMeanO[o] = ceO.d[o] * wCo / B;
      const zeroHeads = fwO.logitsK.map(() => new Float64Array(4));
      lsum += wCo * ceO.loss;
      inSeqBackward(M, fwO, dMeanO, zeroHeads, null, null, fixedMasks);
    }
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
  return { loss: lsum / B, gnorm };
}
// Wave 1: trunk train for one seed x arm (fresh init, pinned streams).
globalThis.runU34Train = async function (fs, log, opts) {
  const { seed, arm } = opts;
  if (!(arm in U34_ARMS)) throw new Error("arm must be c0|c1|c2");
  const wCo = U34_ARMS[arm];
  const ledgerPath = u34TrainPath(seed, arm);
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  const h = await globalThis.u33StackHash(fs);
  if (h.hex !== U34_EXPECT_STACK) throw new Error("U34-PIN HALT: stack drift at train time " + h.hex.slice(0, 16));
  const drvSrc = await fs.readTextFile("src/evidence/decomp/newai-selfu34-driver.js");
  const drvHash = await u32Sha256Hex(drvSrc);
  const t = await globalThis.u32FreshStack(fs, seed);
  const P0 = globalThis.u32SnapshotParams(t.M);
  const steps = 800, t0 = Date.now(), curve = [];
  for (let step = 0; step < steps; step++) {
    for (const p of t.params) p.g.fill(0);
    const r = (wCo === 0)
      ? globalThis.u32TrainOneStep(t.M, t.params, t.opt, t.dataRng, t.fixedMasks)
      : u34TrainOneStep(t.M, t.params, t.opt, t.dataRng, t.fixedMasks, wCo);
    if (step % 100 === 0 || step === steps - 1) curve.push({ step, loss: +r.loss.toFixed(6) });
    if (step % 200 === 0) log("u34-train " + arm + " s" + seed + " step " + step + "/800 loss=" + r.loss.toFixed(4));
  }
  const P = globalThis.u32SnapshotParams(t.M);
  const body = {
    spec: "self-u34-trunkcomp-prereg", track: "U34-COMPOSE", arm, wCo, seed, steps,
    B: 16, lr: 5e-3, K: 5, H: 48, C: 6, auxW: 0.5, lam: 2.0,
    bootstraps: "b%K slices (same as cur-pick)", verdict: "COMPLETE",
    recipeMatch: "C6/auxW0.5/800st/lam2.0/B16/lr5e-3/K5/H48/armCode76/pick-max-ties-lowest + oracle-compose aux wCo=" + wCo + " — W6 recipe on pinned stack",
    stackHash: h.hex, stackFiles: h.perFile.map((f) => f.path), u34DriverHash: drvHash,
    wallMs: Date.now() - t0, curve, divCos: +inMeanCos(t.M).toFixed(4), P0, P,
  };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("u34-train " + arm + " s" + seed + " COMPLETE loss0=" + curve[0].loss + " lossN=" + curve[curve.length - 1].loss + " divCos=" + body.divCos);
  return body;
};
// Wave 2: paired evals (model ALWAYS loaded from ledger file; eval code is the
// u33 paired-eval body verbatim, only paths/spec/track differ).
globalThis.runU34Eval = async function (fs, log, opts) {
  const { seed, arm } = opts;
  const trainPath = u34TrainPath(seed, arm), evalPath = u34EvalPath(seed, arm);
  try { const prev = JSON.parse(await fs.readTextFile(evalPath)); if (prev && prev.verdict === "COMPLETE") { log(evalPath + " exists, skip"); return prev; } } catch (e) {}
  const G = await globalThis.IntrinsicInit(fs);
  const tr = JSON.parse(await fs.readTextFile(trainPath));
  if (tr.verdict !== "COMPLETE") throw new Error("train ledger missing " + trainPath);
  const cur = await globalThis.u33StackHash(fs);
  if (cur.hex !== tr.stackHash) throw new Error("U34-PIN HALT: stack drift since train " + trainPath);
  const M = inSeqMakeModel(G.makeRng(1));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(M.E, tr.P.E); load(M.W1, tr.P.W1); load(M.b1, tr.P.b1);
  load(M.Wf, tr.P.Wf); load(M.bf, tr.P.bf); load(M.Wc, tr.P.Wc); load(M.bc, tr.P.bc);
  for (let k = 0; k < 5; k++) { load(M.Wh[k], tr.P.Wh[k]); load(M.bh[k], tr.P.bh[k]); }
  load(M.Hv, tr.P.Hv); load(M.bv, tr.P.bv);
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
    const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
    const fw2 = inSeqForward(M, x2m, fw1.cNew, evalMasks);
    if (argmax4(inMeanLogits({ logitsK: fw2.logitsK })) === e.y) two++;
    const xo = [9, 9, 9, 9, 9, 9, e.qk, e.k, e.v, 8];
    if (argmax4(inMeanLogits({ logitsK: inSeqForward(M, xo, fw1.cNew, evalMasks) })) === e.y) orc++;
  }
  let fF = 0;
  for (let i = 0; i < N; i++) {
    const e = inSeqGenShift(frng, 0);
    if (argmax4(inMeanLogits({ logitsK: inSeqForward(M, e.x, new Float64Array(8), evalMasks).logitsK })) === e.y) fF++;
  }
  const body = {
    spec: "self-u34-trunkcomp-prereg", track: "U34-COMPOSE", arm, seed, steps: 800,
    verdict: "COMPLETE", n: N, frozenTest: true, evalOf: trainPath, stackHash: cur.hex,
    accScratch: +(scr / N).toFixed(4), accTwo: +(two / N).toFixed(4),
    accOracle: +(orc / N).toFixed(4), accFwd: +(fF / N).toFixed(4),
  };
  await fs.writeTextFile(evalPath, JSON.stringify(body));
  log("u34-eval " + arm + " s" + seed + " scr=" + body.accScratch + " two=" + body.accTwo + " orc=" + body.accOracle);
  return body;
};
// Verdict: PIN + COMPOSE + RET + ORACLE-CHECK + FLOOR (+FRESH by record).
globalThis.runU34Verdict = async function (fs, log) {
  const canonTr = [], canonEv = [];
  for (const seed of [0, 1, 2]) {
    canonTr.push(JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-u33-canon-s" + seed + "-800st.json")));
    canonEv.push(JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-u33-eval-canon-s" + seed + "-800st.json")));
  }
  const perSeed = [];
  for (const seed of [0, 1, 2]) {
    const T = {}, E = {};
    for (const arm of ["c0", "c1", "c2"]) {
      T[arm] = JSON.parse(await fs.readTextFile(u34TrainPath(seed, arm)));
      E[arm] = JSON.parse(await fs.readTextFile(u34EvalPath(seed, arm)));
    }
    const pinHash = ["c0", "c1", "c2"].every((a) => T[a].stackHash === U34_EXPECT_STACK && E[a].stackHash === U34_EXPECT_STACK);
    const p0cmp = globalThis.u32MaxAbsDiff(T.c0.P0, canonTr[seed].P0);
    const bit = globalThis.u32MaxAbsDiff(T.c0.P, canonTr[seed].P);
    const eC = canonEv[seed];
    const gapC = eC.accOracle - eC.accTwo;
    const row = { seed, pin: { match: pinHash, p0diff: p0cmp.max, bitDiff: bit.max, worst: bit.worst, pass: pinHash && p0cmp.max === 0 && bit.max === 0 }, arms: {} };
    for (const arm of ["c1", "c2"]) {
      const e = E[arm];
      const dTwo = +(e.accTwo - eC.accTwo).toFixed(4);
      const dScr = +(e.accScratch - eC.accScratch).toFixed(4);
      const gap = +(e.accOracle - e.accTwo).toFixed(4);
      row.arms[arm] = {
        scr: e.accScratch, two: e.accTwo, orc: e.accOracle,
        dTwo, compose: dTwo >= 0.05,
        dScr, ret: e.accScratch >= eC.accScratch - 0.03,
        gap, gapVsCanon: +(gap - gapC).toFixed(4), oracleCheck: gap <= gapC + 0.02,
        floor: e.accScratch >= 0.50 && e.accTwo >= 0.45,
      };
    }
    row.c0eval = { scr: E.c0.accScratch, two: E.c0.accTwo };
    perSeed.push(row);
    const r1 = row.arms.c1;
    log("u34-verdict s" + seed + " PIN=" + (row.pin.pass ? "ok" : "FAIL") +
      " canon=" + eC.accScratch + "/" + eC.accTwo +
      " c1=" + r1.scr + "/" + r1.two + " dTwo=" + r1.dTwo + " dScr=" + r1.dScr + " gap=" + r1.gap + "(canon " + gapC.toFixed(4) + ")" +
      " c2=" + row.arms.c2.two + "/" + row.arms.c2.scr);
  }
  const q = (f) => perSeed.filter((s) => f(s)).length;
  const pinN = q((s) => s.pin.pass);
  const composeN = q((s) => s.arms.c1.compose);
  const retN = q((s) => s.arms.c1.ret);
  const oracleN = q((s) => s.arms.c1.oracleCheck);
  const floorC1N = q((s) => s.arms.c1.floor);
  const floorC2N = q((s) => s.arms.c2.floor);
  let verdict = "";
  if (pinN < 3) verdict = "PIN-FAIL";
  else if (floorC1N < 3 || floorC2N < 3) verdict = "FLOOR-FAIL";
  else if (composeN < 2) verdict = "WALLED-AGAIN";
  else if (retN < 2 || oracleN < 2) verdict = "COMP-PRICE-PARTIAL";
  else verdict = "COMP-PRICE-WORKS";
  const body = {
    spec: "self-u34-trunkcomp-prereg", verdict,
    bars: {
      "U34-PIN": pinN + "/3 (stackHash " + U34_EXPECT_STACK.slice(0, 12) + "… + c0 P0/P BIT-exact vs u33-canon-A)",
      "U34-COMPOSE": composeN + "/3 (two_c1 − two_canon ≥ +0.05)",
      "U34-RET": retN + "/3 (scr_c1 ≥ scr_canon − 0.03)",
      "U34-ORACLE-CHECK": oracleN + "/3 ((orc−two)_c1 ≤ (orc−two)_canon + 0.02)",
      "U34-FLOOR": "c1 " + floorC1N + "/3 + c2 " + floorC2N + "/3 (scr ≥ 0.50, two ≥ 0.45)",
      "U34-FRESH": "battery 3x IMPLEMENTABLE unanimous, 12/12 HEALTH -> v1.0 STANDS",
    },
    perSeed,
  };
  await fs.writeTextFile(U34_VERDICT_PATH, JSON.stringify(body));
  log("u34-verdict " + verdict + " PIN " + pinN + "/3 COMPOSE " + composeN + "/3 RET " + retN + "/3 ORACLE " + oracleN + "/3 FLOOR c1 " + floorC1N + "/3 c2 " + floorC2N + "/3");
  return body;
};
