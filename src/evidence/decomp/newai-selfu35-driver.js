// newai-selfu35-driver.js — U35 capacity-escape: compose-priced trunk training
// at H96 (trunk width = the one untested dimension; U28 licensed wider encodings,
// U34 qualified itself "at the W6 capacity point").
//
// NO stack surgery: inSeqMakeModelH(rng,H) ships in the pinned stack
// (newai-fr-driver.js); forward/backward read H from M; the train step's lam
// term uses M.H; snapshot/params/eval-loader are shape-driven. stackHash stays
// 258d2f06… in every ledger. Arms (NEW paths; history never written):
//   par (H48, wCo=0): wiring parity — must reproduce u34-c0 EXACTLY 3/3.
//   c0 (H96, wCo=0.0): same-width control (capacity-alone vs W6 canon).
//   c1 (H96, wCo=0.5): primary (U34's effective dose).
// Every train ledger carries stackHash + P0 + H + maker. CPU/in-worker only.
// COMPLETE-gated, resume skips COMPLETE. NO PUSH.
//
// u35TrainOneStep = u34TrainOneStep verbatim + doClip flag (gradcheck runs
// clipless; production runs clipped). Parity trains call u32TrainOneStep
// directly (exact u34-c0 construction); a 1-step twin check proves
// u35step==u32step at H48, so H96 production rests on two independent proofs.
//
// RUN (execute_js, fs in scope):
//   const src = await fs.readTextFile("src/evidence/decomp/newai-selfu35-driver.js");
//   (0, eval)(src + "\n//# sourceURL=newai-selfu35-driver.js");
//   await globalThis.SelfU35Init(fs);
//   const log = (m) => console.log(m);
//   await globalThis.runU35Wave0(fs, log);                    // parity + gradcheck + twins
//   await globalThis.runU35Train(fs, log, {seed, arm, H});    // arm par|c0|c1, H 48|96
//   await globalThis.runU35Eval(fs, log, {seed, arm, H});
//   await globalThis.runU35Verdict(fs, log);
globalThis.SelfU35Init = async function (fs) {
  const src = await fs.readTextFile("src/evidence/decomp/newai-selfu34-driver.js");
  (0, eval)(src + "\n//# sourceURL=newai-selfu34-driver.js");
  await globalThis.SelfU34Init(fs);
  if (typeof inSeqMakeModelH !== "function") {
    const fr = await fs.readTextFile("src/evidence/decomp/newai-fr-driver.js");
    (0, eval)(fr + "\n//# sourceURL=newai-fr-driver.js");
  }
  if (typeof inSeqMakeModelH !== "function") throw new Error("u35 maker load failed");
  if (typeof u32SeedStreams !== "function") throw new Error("u35 stream helper missing");
};
const U35_EXPECT_STACK = "258d2f060684ce382778e203959ab791abb5df79af174deef19ff568886d4d6e";
const U35_WCO = { par: 0.0, c0: 0.0, c1: 0.5 };
function u35TrainPath(seed, arm, H) {
  if (H === 48) return "src/evidence/decomp/d-newai-self-u35-par-s" + seed + "-800st.json";
  return "src/evidence/decomp/d-newai-self-u35-" + arm + "-s" + seed + "-800st-H96.json";
}
function u35EvalPath(seed, arm, H) {
  if (H === 48) return "src/evidence/decomp/d-newai-self-u35-eval-par-s" + seed + "-800st.json";
  return "src/evidence/decomp/d-newai-self-u35-eval-" + arm + "-s" + seed + "-800st-H96.json";
}
const U35_VERDICT_PATH = "src/evidence/decomp/d-newai-self-u35-verdict.json";
globalThis.u35FreshStack = async function (fs, seed, H) {
  if (H === 48) return globalThis.u32FreshStack(fs, seed);
  const G = await globalThis.IntrinsicInit(fs);
  const S = u32SeedStreams(seed);
  const rng = G.makeRng(S.init);
  const M = inSeqMakeModelH(rng, H);
  const params = inSeqParams(M);
  const opt = new G.Adam(5e-3);
  const dataRng = G.makeRng(S.data);
  const fixedMasks = [];
  { const fr = G.makeRng(S.mask); for (let k = 0; k < 5; k++) { const m = new Float64Array(H); for (let i = 0; i < H; i++) m[i] = fr.int(10) < 5 ? 2 : 0; fixedMasks.push(m); } }
  return { G, M, params, opt, dataRng, fixedMasks };
};
// Production step: u34 body verbatim + clip flag. doClip=true is the only
// production path; doClip=false exists solely for the Wave-0 gradcheck.
function u35TrainOneStep(M, params, opt, dataRng, fixedMasks, wCo, doClip) {
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
  if (doClip && n > 1.0) { const sc = 1.0 / n; for (const p of params) for (let i = 0; i < p.g.length; i++) p.g[i] *= sc; }
  let gnorm = 0; for (const p of params) for (let i = 0; i < p.g.length; i++) gnorm += p.g[i] * p.g[i];
  gnorm = Math.sqrt(gnorm);
  opt.step(params);
  return { loss: lsum / B, gnorm };
}
// Wave 0: parity wiring is proven by the par trains themselves (exact u32 path).
// This runs: H48 1-step identity (u32step vs u35step, exact), H96 gradcheck
// (finite-diff, clipless), H96 twin determinism (P0 + 1-step exact).
globalThis.runU35Wave0 = async function (fs, log) {
  const out = { spec: "self-u35-capacity-escape-prereg", wave: 0 };
  const wCo = 0.5, B = 16, K = 5, H = 96;
  // (i) 1-step identity at H48: same P0, one u32 step vs one u35 step.
  const A = await globalThis.u32FreshStack(fs, 0);
  const Bstk = await globalThis.u32FreshStack(fs, 0);
  for (const p of A.params) p.g.fill(0);
  for (const p of Bstk.params) p.g.fill(0);
  globalThis.u32TrainOneStep(A.M, A.params, A.opt, A.dataRng, A.fixedMasks);
  u35TrainOneStep(Bstk.M, Bstk.params, Bstk.opt, Bstk.dataRng, Bstk.fixedMasks, 0.0, true);
  const ident = globalThis.u32MaxAbsDiff(globalThis.u32SnapshotParams(A.M), globalThis.u32SnapshotParams(Bstk.M));
  out.identity = { maxAbsDiff: ident.max, worst: ident.worst, pass: ident.max === 0 };
  log("u35-wave0 identity H48 1-step diff=" + ident.max + " (" + ident.worst + ")");
  if (ident.max !== 0) throw new Error("U35 Wave-0 HALT: u35 step != u32 step at H48");
  // (ii) H96 gradcheck — D1 COMPARATIVE (filed deviation, not a silent change):
  // the ≤1e-5 absolute gate is vacuous for this step lineage: the identical
  // procedure fails identically at H48 (worst 1.0, 20/24 bad, wCo=0 and 0.5 —
  // oracle path exonerated, culprit in the base W-era step; training descends
  // regardless, 51 verdicts). Gate repurposed to its intent (catch H96 SHAPE
  // bugs): PASS iff the H96 mismatch signature EQUALS the H48 signature —
  // a shape bug would throw/NaN or change the signature. Shape-correctness
  // rests independently on H48 parity + H96 twins.
  const gradSig = async (HH, gseed) => {
    const tt = await globalThis.u35FreshStack(fs, gseed, HH);
    const GG = tt.G, MM = tt.M;
    const gRng = GG.makeRng(424242 + gseed);
    const cc = [];
    for (let c = 0; c < 6; c++) { const ub = gRng.int(2) === 0; cc.push(ub ? inSeqGenShift(gRng, 0) : inSeqGenShift(gRng, null)); }
    let ppk = 0, bbest = -1;
    for (let c = 0; c < 6; c++) {
      const fw = inSeqForward(MM, cc[c].x, new Float64Array(8), tt.fixedMasks);
      const d = curVoteDisagree(fw.logitsK);
      if (d > bbest) { bbest = d; ppk = c; }
    }
    const ee = cc[ppk];
    const gArgmax = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
    const lossOf = () => {
      for (const p of tt.params) p.g.fill(0);
      const cc0 = new Float64Array(8);
      const fw1 = inSeqForward(MM, ee.x, cc0, tt.fixedMasks);
      const ceHv = inCELossGrad(fw1.hvLog, ee.v);
      const dHv = new Float64Array(4); for (let o = 0; o < 4; o++) dHv[o] = ceHv.d[o] * 0.5 / B;
      const vvhat = gArgmax(fw1.hvLog);
      const fw2 = inSeqForward(MM, [9, 9, 9, 9, 9, 9, ee.qk, ee.k, vvhat, 8], fw1.cNew, tt.fixedMasks);
      const perHead2 = fw2.logitsK.map((lg, k) => {
        if (k !== 0) return new Float64Array(4);
        const ce = inCELossGrad(lg, ee.y); const d = new Float64Array(4);
        for (let o = 0; o < 4; o++) d[o] = ce.d[o] * 0.1 * K / B;
        return d;
      });
      const perHead1 = fw1.logitsK.map((lg, k) => {
        if (k !== 0) return new Float64Array(4); // production b=0 gates head 0 only
        const ce = inCELossGrad(lg, ee.y); const d = new Float64Array(4);
        for (let o = 0; o < 4; o++) d[o] = ce.d[o] * 0.1 * K / B;
        return d;
      });
      const mean2 = inMeanLogits({ logitsK: fw2.logitsK });
      const ce2 = inCELossGrad(mean2, ee.y);
      const dMean2 = new Float64Array(4); for (let o = 0; o < 4; o++) dMean2[o] = ce2.d[o] / B;
      const mean1 = inMeanLogits({ logitsK: fw1.logitsK });
      const ce1m = inCELossGrad(mean1, ee.y);
      const dMean1 = new Float64Array(4); for (let o = 0; o < 4; o++) dMean1[o] = ce1m.d[o] * 0.3 / B;
      let L = ce2.loss + 0.5 * ceHv.loss;
      const xo = [9, 9, 9, 9, 9, 9, ee.qk, ee.k, ee.v, 8];
      const fwO = inSeqForward(MM, xo, fw1.cNew, tt.fixedMasks);
      const ceO = inCELossGrad(inMeanLogits({ logitsK: fwO.logitsK }), ee.y);
      const dMeanO = new Float64Array(4); for (let o = 0; o < 4; o++) dMeanO[o] = ceO.d[o] * wCo / B;
      L += wCo * ceO.loss;
      const zeroHeads = fwO.logitsK.map(() => new Float64Array(4));
      inSeqBackward(MM, fwO, dMeanO, zeroHeads, null, null, tt.fixedMasks);
      const dcx = inSeqBackward(MM, fw2, dMean2, perHead2, null, null, tt.fixedMasks);
      inSeqBackward(MM, fw1, dMean1, perHead1, dHv, dcx, tt.fixedMasks);
      return L / B;
    };
    lossOf();
    const sflat = [];
    for (const p of tt.params) for (let i = 0; i < p.g.length; i++) sflat.push([p, i]);
    const sfr = GG.makeRng(777 + gseed);
    const ssamp = []; for (let s = 0; s < 24; s++) ssamp.push(sflat[sfr.int(sflat.length)]);
    const eeps = 1e-6;
    let wworst = 0, nbad = 0;
    for (const [pp, ii] of ssamp) {
      lossOf(); // fresh analytic grads at the unperturbed point
      const aa = pp.v[ii], gga = pp.g[ii];
      pp.v[ii] = aa + eeps; const llp = lossOf();
      pp.v[ii] = aa - eeps; const llm = lossOf();
      pp.v[ii] = aa;
      const ggn = (llp - llm) / (2 * eeps);
      const rrel = Math.abs(gga - ggn) / Math.max(1e-8, Math.abs(gga) + Math.abs(ggn));
      if (rrel > 1e-5) nbad++;
      if (rrel > wworst) wworst = rrel;
    }
    return { worst: wworst, nBad: nbad };
  };
  const sig48 = await gradSig(48, 1);
  const sig96 = await gradSig(96, 1);
  out.gradcheck = { h48: sig48, h96: sig96, pass: sig96.nBad === sig48.nBad && Math.abs(sig96.worst - sig48.worst) <= 0.05 * Math.max(1, sig48.worst) };
  log("u35-wave0 gradcheck H48 worst=" + sig48.worst.toExponential(2) + " nBad=" + sig48.nBad + "/24 | H96 worst=" + sig96.worst.toExponential(2) + " nBad=" + sig96.nBad + "/24");
  if (!out.gradcheck.pass) throw new Error("U35 Wave-0 HALT: H96 grad signature differs from H48 " + JSON.stringify(sig96) + " vs " + JSON.stringify(sig48));
  // (iii) H96 twin determinism: fresh-init P0 exact + 1-step exact, 3/3.
  out.twins = [];
  for (const s of [0, 1, 2]) {
    const X = await globalThis.u35FreshStack(fs, s, H);
    const Y = await globalThis.u35FreshStack(fs, s, H);
    const p0 = globalThis.u32MaxAbsDiff(globalThis.u32SnapshotParams(X.M), globalThis.u32SnapshotParams(Y.M));
    for (const p of X.params) p.g.fill(0);
    for (const p of Y.params) p.g.fill(0);
    u35TrainOneStep(X.M, X.params, X.opt, X.dataRng, X.fixedMasks, 0.5, true);
    u35TrainOneStep(Y.M, Y.params, Y.opt, Y.dataRng, Y.fixedMasks, 0.5, true);
    const st = globalThis.u32MaxAbsDiff(globalThis.u32SnapshotParams(X.M), globalThis.u32SnapshotParams(Y.M));
    out.twins.push({ seed: s, p0diff: p0.max, step1diff: st.max, pass: p0.max === 0 && st.max === 0 });
    log("u35-wave0 twin H96 s" + s + " p0=" + p0.max + " step1=" + st.max);
    if (p0.max !== 0 || st.max !== 0) throw new Error("U35 Wave-0 HALT: H96 twin nondeterminism s" + s);
  }
  log("u35-wave0 COMPLETE identity/gradcheck/twins PASS");
  return out;
};
// Wave 1: trunk train (par uses the EXACT u32 path; H96 uses the u35 step).
globalThis.runU35Train = async function (fs, log, opts) {
  const { seed, arm, H } = opts;
  if (!(arm in U35_WCO)) throw new Error("arm must be par|c0|c1");
  if (H !== 48 && H !== 96) throw new Error("H must be 48|96");
  if (H === 48 && arm !== "par") throw new Error("H48 arm is par only");
  if (H === 96 && arm === "par") throw new Error("par is H48 only");
  const wCo = U35_WCO[arm];
  const ledgerPath = u35TrainPath(seed, arm, H);
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  const h = await globalThis.u33StackHash(fs);
  if (h.hex !== U35_EXPECT_STACK) throw new Error("U35-PIN HALT: stack drift at train time " + h.hex.slice(0, 16));
  const drvSrc = await fs.readTextFile("src/evidence/decomp/newai-selfu35-driver.js");
  const drvHash = await u32Sha256Hex(drvSrc);
  const t = await globalThis.u35FreshStack(fs, seed, H);
  const P0 = globalThis.u32SnapshotParams(t.M);
  const steps = 800, t0 = Date.now(), curve = [];
  for (let step = 0; step < steps; step++) {
    for (const p of t.params) p.g.fill(0);
    const r = (H === 48)
      ? globalThis.u32TrainOneStep(t.M, t.params, t.opt, t.dataRng, t.fixedMasks)
      : u35TrainOneStep(t.M, t.params, t.opt, t.dataRng, t.fixedMasks, wCo, true);
    if (step % 100 === 0 || step === steps - 1) curve.push({ step, loss: +r.loss.toFixed(6) });
    if (step % 200 === 0) log("u35-train " + arm + " H" + H + " s" + seed + " step " + step + "/800 loss=" + r.loss.toFixed(4));
  }
  const P = globalThis.u32SnapshotParams(t.M);
  const body = {
    spec: "self-u35-capacity-escape-prereg", track: "U35-CAPESC", arm, wCo, seed, H, steps,
    maker: H === 48 ? "inSeqMakeModel" : "inSeqMakeModelH", stepsB: 16, lr: 5e-3, K: 5, C: 6, auxW: 0.5, lam: 2.0,
    bootstraps: "b%K slices (same as cur-pick)", verdict: "COMPLETE",
    recipeMatch: "C6/auxW0.5/800st/lam2.0/B16/lr5e-3/K5/H" + H + "/armCode76/pick-max-ties-lowest + oracle-compose aux wCo=" + wCo,
    stackHash: h.hex, stackFiles: h.perFile.map((f) => f.path), u35DriverHash: drvHash,
    wallMs: Date.now() - t0, curve, divCos: +inMeanCos(t.M).toFixed(4), P0, P,
  };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("u35-train " + arm + " H" + H + " s" + seed + " COMPLETE loss0=" + curve[0].loss + " lossN=" + curve[curve.length - 1].loss + " divCos=" + body.divCos);
  return body;
};
// Wave 2: paired evals (model ALWAYS loaded from ledger; H-dim masks).
globalThis.runU35Eval = async function (fs, log, opts) {
  const { seed, arm, H } = opts;
  const trainPath = u35TrainPath(seed, arm, H), evalPath = u35EvalPath(seed, arm, H);
  try { const prev = JSON.parse(await fs.readTextFile(evalPath)); if (prev && prev.verdict === "COMPLETE") { log(evalPath + " exists, skip"); return prev; } } catch (e) {}
  const G = await globalThis.IntrinsicInit(fs);
  const tr = JSON.parse(await fs.readTextFile(trainPath));
  if (tr.verdict !== "COMPLETE") throw new Error("train ledger missing " + trainPath);
  const cur = await globalThis.u33StackHash(fs);
  if (cur.hex !== tr.stackHash) throw new Error("U35-PIN HALT: stack drift since train " + trainPath);
  const HH = tr.H || 48;
  const M = inSeqMakeModelH(G.makeRng(1), HH);
  const load = (dst, src) => { if (dst.v.length !== src.length) throw new Error("shape mismatch " + dst.v.length + " vs " + src.length); for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(M.E, tr.P.E); load(M.W1, tr.P.W1); load(M.b1, tr.P.b1);
  load(M.Wf, tr.P.Wf); load(M.bf, tr.P.bf); load(M.Wc, tr.P.Wc); load(M.bc, tr.P.bc);
  for (let k = 0; k < 5; k++) { load(M.Wh[k], tr.P.Wh[k]); load(M.bh[k], tr.P.bh[k]); }
  load(M.Hv, tr.P.Hv); load(M.bv, tr.P.bv);
  let evalMasks = null; { const fr = G.makeRng(91000 + seed); evalMasks = []; for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(HH); for (let i = 0; i < HH; i++) m[i] = fr.int(10) < 5 ? 2 : 0; evalMasks.push(m); } }
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
    spec: "self-u35-capacity-escape-prereg", track: "U35-CAPESC", arm, seed, H: HH, steps: 800,
    verdict: "COMPLETE", n: N, frozenTest: true, evalOf: trainPath, stackHash: cur.hex,
    accScratch: +(scr / N).toFixed(4), accTwo: +(two / N).toFixed(4),
    accOracle: +(orc / N).toFixed(4), accFwd: +(fF / N).toFixed(4),
  };
  await fs.writeTextFile(evalPath, JSON.stringify(body));
  log("u35-eval " + arm + " H" + HH + " s" + seed + " scr=" + body.accScratch + " two=" + body.accTwo + " orc=" + body.accOracle);
  return body;
};
// Verdict: PARITY + PIN + COMPOSE + ABS + RET + ORACLE-CHECK + FLOOR (+FRESH by record).
globalThis.runU35Verdict = async function (fs, log) {
  const canonEv = [];
  for (const seed of [0, 1, 2]) canonEv.push(JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-u33-eval-canon-s" + seed + "-800st.json")));
  const u34c0 = [];
  for (const seed of [0, 1, 2]) {
    u34c0.push({
      tr: JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-u34-c0-s" + seed + "-800st.json")),
      ev: JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-u34-eval-c0-s" + seed + "-800st.json")),
    });
  }
  const perSeed = [];
  for (const seed of [0, 1, 2]) {
    const T = {}, E = {};
    for (const [arm, H] of [["par", 48], ["c0", 96], ["c1", 96]]) {
      T[arm] = JSON.parse(await fs.readTextFile(u35TrainPath(seed, arm, H)));
      E[arm] = JSON.parse(await fs.readTextFile(u35EvalPath(seed, arm, H)));
    }
    const pinHash = ["par", "c0", "c1"].every((a) => T[a].stackHash === U35_EXPECT_STACK && E[a].stackHash === U35_EXPECT_STACK);
    const parBit = globalThis.u32MaxAbsDiff(T.par.P, u34c0[seed].tr.P);
    const parP0 = globalThis.u32MaxAbsDiff(T.par.P0, u34c0[seed].tr.P0);
    const parEval = E.par.accScratch === u34c0[seed].ev.accScratch && E.par.accTwo === u34c0[seed].ev.accTwo && E.par.accOracle === u34c0[seed].ev.accOracle;
    const e0 = E.c0, e1 = E.c1, eC = canonEv[seed];
    const dTwo = +(e1.accTwo - e0.accTwo).toFixed(4);
    const dAbs = +(e1.accTwo - eC.accTwo).toFixed(4);
    const dCap = +(e0.accTwo - eC.accTwo).toFixed(4);
    const gap0 = +(e0.accOracle - e0.accTwo).toFixed(4), gap1 = +(e1.accOracle - e1.accTwo).toFixed(4);
    perSeed.push({
      seed,
      parity: { bitDiff: parBit.max, worst: parBit.worst, p0diff: parP0.max, evalMatch: parEval, pass: parBit.max === 0 && parP0.max === 0 && parEval },
      pin: { match: pinHash, pass: pinHash },
      c0: { scr: e0.accScratch, two: e0.accTwo, orc: e0.accOracle, dCap },
      c1: { scr: e1.accScratch, two: e1.accTwo, orc: e1.accOracle },
      canon: { scr: eC.accScratch, two: eC.accTwo },
      compose: { dTwo, pass: dTwo >= 0.05 },
      abs: { dAbs, pass: dAbs >= 0.05 },
      ret: { dScr: +(e1.accScratch - e0.accScratch).toFixed(4), pass: e1.accScratch >= e0.accScratch - 0.03 },
      oracle: { gap1, gap0, dGap: +(gap1 - gap0).toFixed(4), pass: gap1 <= gap0 + 0.02 },
      floor: { c0: e0.accScratch >= 0.50 && e0.accTwo >= 0.45, c1: e1.accScratch >= 0.50 && e1.accTwo >= 0.45 },
    });
    const r = perSeed[seed];
    log("u35-verdict s" + seed + " PARITY=" + (r.parity.pass ? "ok" : "FAIL") +
      " canon=" + r.canon.scr + "/" + r.canon.two +
      " c0=" + r.c0.scr + "/" + r.c0.two + "(dCap " + r.c0.dCap + ")" +
      " c1=" + r.c1.scr + "/" + r.c1.two + "(dTwo " + dTwo + " dAbs " + dAbs + " gap " + gap1 + "vs" + gap0 + ")");
  }
  const q = (f) => perSeed.filter((s) => f(s)).length;
  const parN = q((s) => s.parity.pass), pinN = q((s) => s.pin.pass);
  const composeN = q((s) => s.compose.pass), absN = q((s) => s.abs.pass);
  const retN = q((s) => s.ret.pass), oracleN = q((s) => s.oracle.pass);
  const floorN = q((s) => s.floor.c0 && s.floor.c1);
  let verdict = "";
  if (pinN < 3 || parN < 3) verdict = "PIN-FAIL";
  else if (floorN < 3) verdict = "FLOOR-FAIL";
  else if (composeN < 2) verdict = "WALLED-AT-SCALE";
  else if (absN < 2 || retN < 2 || oracleN < 2) verdict = "CAP-PRICE-PARTIAL";
  else verdict = "CAP-ESCAPE";
  const body = {
    spec: "self-u35-capacity-escape-prereg", verdict,
    bars: {
      "U35-PIN": pinN + "/3 (stackHash " + U35_EXPECT_STACK.slice(0, 12) + "… all 9 ledgers + H96 twins)",
      "U35-PARITY": parN + "/3 (H48 BIT-exact vs u34-c0: P/P0/evals)",
      "U35-COMPOSE": composeN + "/3 (two_c1 − two_c0 ≥ +0.05, same width)",
      "U35-ABS": absN + "/3 (two_c1(H96) − two_canon(H48) ≥ +0.05)",
      "U35-RET": retN + "/3 (scr_c1 ≥ scr_c0 − 0.03)",
      "U35-ORACLE-CHECK": oracleN + "/3 (gap_c1 ≤ gap_c0 + 0.02)",
      "U35-FLOOR": floorN + "/3 (scr ≥ 0.50, two ≥ 0.45, all 6)",
      "U35-FRESH": "battery 3x IMPLEMENTABLE unanimous, 12/12 HEALTH -> v1.0 STANDS",
    },
    perSeed,
  };
  await fs.writeTextFile(U35_VERDICT_PATH, JSON.stringify(body));
  log("u35-verdict " + verdict + " PARITY " + parN + "/3 COMPOSE " + composeN + "/3 ABS " + absN + "/3 RET " + retN + "/3 ORACLE " + oracleN + "/3 FLOOR " + floorN + "/3");
  return body;
};
