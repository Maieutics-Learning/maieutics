// newai-selfu56-driver.js — U56-EXT1b veto-leak sidecar (frozen U54 checkpoints, veto-only).
//
// VETO3: nu = sig(w[ctx]), TWO params, no shared bias. Init 0, lr=1.0,
// 800 steps, BCE(nu,ctx) on balanced 50/50 A/B draws (no trunk forward in
// training — pure logistic fit). Eval: frozen U54 Phase-1 P + K=10 blend on
// U54 Phase-3 probe streams verbatim. 20 fits per checkpoint (60 total).
//
// RUN (execute_js, fs in scope; ONLY under fresh countersign):
//   const src = await fs.readTextFile("src/evidence/decomp/newai-selfu56-driver.js");
//   (0, eval)(src + "\n//# sourceURL=newai-selfu56-driver.js");
//   await globalThis.SelfU56Init(fs);
//   await globalThis.runU56Wave0(fs, log);
//   await globalThis.runU56Fits(fs, log);    // 60 veto fits
//   await globalThis.runU56Evals(fs, log);   // 60 evals
//   await globalThis.runU56Verdict(fs, log);
globalThis.SelfU56Init = async function (fs) {
  const src = await fs.readTextFile("src/evidence/decomp/newai-selfu54-driver.js");
  (0, eval)(src + "\n//# sourceURL=newai-selfu54-driver.js");
  await globalThis.SelfU54Init(fs);
  for (const f of ["u33StackHash", "u32Sha256Hex", "IntrinsicInit", "inSeqMakeModel",
    "inSeqForward", "inMeanLogits", "inSeqGenShift"]) {
    if (typeof globalThis[f] !== "function") throw new Error("U56 stack load failed: missing " + f);
  }
};
const U56_EXPECT_STACK = "258d2f060684ce382778e203959ab791abb5df79af174deef19ff568886d4d6e";
const U56_K = 10, U56_LR = 1.0, U56_STEPS = 800, U56_FITS = 20;
function u56FitPath(ckpt, s) { return "src/evidence/decomp/d-newai-self-u56-fit-c" + ckpt + "-s" + s + ".json"; }
function u56EvalPath(ckpt, s) { return "src/evidence/decomp/d-newai-self-u56-eval-c" + ckpt + "-s" + s + ".json"; }
function u56P1Path(seed, arm) { return "src/evidence/decomp/d-newai-self-u54-phase1-" + arm + "-s" + seed + ".json"; }
const U56_VERDICT_PATH = "src/evidence/decomp/d-newai-self-u56-verdict.json";
const U56_WAVE0_PATH = "src/evidence/decomp/d-newai-self-u56-wave0.json";
function u56Sig(x) { return 1 / (1 + Math.exp(-x)); }
globalThis.runU56Wave0 = async function (fs, log) {
  try { const prev = JSON.parse(await fs.readTextFile(U56_WAVE0_PATH)); if (prev && prev.verdict === "COMPLETE") { log(U56_WAVE0_PATH + " exists, skip"); return prev; } } catch (e) {}
  const h = await globalThis.u33StackHash(fs);
  if (h.hex !== U56_EXPECT_STACK) throw new Error("U56-PIN HALT: stack drift " + h.hex.slice(0, 16));
  const G = await globalThis.IntrinsicInit(fs);
  // veto BCE gradcheck: numeric vs analytic on the 2-param surface.
  const grng = G.makeRng(77123); let worst = 0, nbad = 0;
  for (let t = 0; t < 32; t++) {
    const w = [(grng.int(2000) - 1000) / 500, (grng.int(2000) - 1000) / 500];
    const ctx = grng.int(2), tgt = ctx;
    const lossOf = (a, b) => { const nu = 1 / (1 + Math.exp(-(ctx === 0 ? a : b))); return -(tgt * Math.log(nu + 1e-12) + (1 - tgt) * Math.log(1 - nu + 1e-12)); };
    const nu = 1 / (1 + Math.exp(-w[ctx]));
    const ana = nu - tgt, eeps = 1e-6;
    const num = (lossOf(ctx === 0 ? w[0] + eeps : w[0], ctx === 1 ? w[1] + eeps : w[1]) - lossOf(ctx === 0 ? w[0] - eeps : w[0], ctx === 1 ? w[1] - eeps : w[1])) / (2 * eeps);
    const rel = Math.abs(ana - num) / Math.max(1e-8, Math.abs(ana) + Math.abs(num));
    if (rel > worst) worst = rel; if (rel > 1e-5) nbad++;
  }
  log("u56-wave0 veto-gradcheck worst=" + worst.toExponential(2) + " nBad=" + nbad + "/32");
  if (nbad !== 0) throw new Error("U56 Wave-0 HALT: veto gradcheck FAIL");
  // twins: same stream -> identical fit (12/12 across ckpt x stream-spot-check).
  for (const ckpt of [0, 1, 2]) for (const s of [0, 1]) {
    const fit = (sd) => {
      const rng = G.makeRng(71800 + ckpt * 100 + sd), w = [0, 0];
      for (let st = 0; st < U56_STEPS; st++) {
        let g0 = 0, g1 = 0;
        for (let b = 0; b < 16; b++) { const ctx = rng.int(2); const nu = u56Sig(w[ctx]); const g = (nu - ctx) / 16; if (ctx === 0) g0 += g; else g1 += g; }
        w[0] -= U56_LR * g0; w[1] -= U56_LR * g1;
      }
      return w;
    };
    const a = fit(s), c = fit(s);
    if (a[0] !== c[0] || a[1] !== c[1]) throw new Error("U56 Wave-0 HALT: twin nondeterminism c" + ckpt + " s" + s);
  }
  log("u56-wave0 twins 12/12 exact");
  // checkpoint identity: all 4 Phase-1 arms byte-identical P per seed (else HALT).
  for (const seed of [0, 1, 2]) {
    const Ps = [];
    for (const arm of ["noveto", "global", "veto", "unfrozen"]) Ps.push(JSON.stringify(JSON.parse(await fs.readTextFile(u56P1Path(seed, arm))).P));
    if (!(Ps[0] === Ps[1] && Ps[1] === Ps[2] && Ps[2] === Ps[3])) throw new Error("U56 Wave-0 HALT: Phase-1 P differs across arms s" + seed);
  }
  log("u56-wave0 checkpoint identity 3/3 (4 arms identical per seed)");
  // probe-stream identity vs U54: RET-A inputs hash must match U54 checkpoint probe.
  {
    const rng = G.makeRng(53100); const inps = [];
    for (let i = 0; i < 200; i++) inps.push(inSeqGenShift(rng, null));
    const hh = await u32Sha256Hex(JSON.stringify(inps.map((e) => [e.x, e.qk, e.k, e.v, e.y])));
    const p1 = JSON.parse(await fs.readTextFile(u56P1Path(0, "noveto")));
    if (hh !== p1.checkpoint.inputsHash) throw new Error("U56 Wave-0 HALT: probe stream drift vs U54");
  }
  log("u56-wave0 probe-stream identity ok");
  const body = { spec: "self-u56-ext1b-prereg", track: "U56-EXT1b", wave: 0, verdict: "COMPLETE", stackHash: h.hex, gradcheck: { worst, nBad: nbad } };
  await fs.writeTextFile(U56_WAVE0_PATH, JSON.stringify(body));
  return body;
};
globalThis.runU56Fits = async function (fs, log) {
  const h = await globalThis.u33StackHash(fs);
  if (h.hex !== U56_EXPECT_STACK) throw new Error("U56-PIN HALT: stack drift");
  const G = await globalThis.IntrinsicInit(fs);
  const drvSrc = await fs.readTextFile("src/evidence/decomp/newai-selfu56-driver.js");
  const drvHash = await u32Sha256Hex(drvSrc);
  for (const ckpt of [0, 1, 2]) {
    for (let s = 0; s < U56_FITS; s++) {
      const path = u56FitPath(ckpt, s);
      try { const prev = JSON.parse(await fs.readTextFile(path)); if (prev && prev.verdict === "COMPLETE") { log(path + " exists, skip"); continue; } } catch (e) {}
      const rng = G.makeRng(71800 + ckpt * 100 + s);
      const w = [0, 0]; const curve = [];
      for (let st = 0; st < U56_STEPS; st++) {
        let g0 = 0, g1 = 0, lsum = 0;
        for (let b = 0; b < 16; b++) {
          const ctx = rng.int(2), nu = u56Sig(w[ctx]);
          lsum += -(ctx * Math.log(nu + 1e-12) + (1 - ctx) * Math.log(1 - nu + 1e-12));
          const g = (nu - ctx) / 16; if (ctx === 0) g0 += g; else g1 += g;
        }
        w[0] -= U56_LR * g0; w[1] -= U56_LR * g1;
        if (st % 200 === 0 || st === U56_STEPS - 1) curve.push({ step: st, loss: +(lsum / 16).toFixed(6), wA: +w[0].toFixed(4), wB: +w[1].toFixed(4) });
      }
      await fs.writeTextFile(path, JSON.stringify({ spec: "self-u56-ext1b-prereg", track: "U56-EXT1b", ckpt, stream: s, verdict: "COMPLETE", stackHash: h.hex, u56DriverHash: drvHash, steps: U56_STEPS, lr: U56_LR, diet: "balanced 50/50 BCE(nu,ctx), trunk uninvolved", curve, W: w }));
      if (s === 0) log("u56-fit c" + ckpt + " s0 w=" + w.map((v) => v.toFixed(3)).join("/") + " lossN=" + curve[curve.length - 1].loss);
    }
    log("u56-fits c" + ckpt + " COMPLETE (20 fits)");
  }
  return "ALL-FITS-COMPLETE";
};
globalThis.runU56Evals = async function (fs, log) {
  const G = await globalThis.IntrinsicInit(fs);
  const cur = await globalThis.u33StackHash(fs);
  for (const ckpt of [0, 1, 2]) {
    const p1 = JSON.parse(await fs.readTextFile(u56P1Path(ckpt, "noveto")));
    if (p1.stackHash !== cur.hex) throw new Error("U56-PIN HALT: stack drift since Phase-1");
    const M = inSeqMakeModel(G.makeRng(1));
    const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
    load(M.E, p1.P.E); load(M.W1, p1.P.W1); load(M.b1, p1.P.b1);
    load(M.Wf, p1.P.Wf); load(M.bf, p1.P.bf); load(M.Wc, p1.P.Wc); load(M.bc, p1.P.bc);
    for (let k = 0; k < 5; k++) { load(M.Wh[k], p1.P.Wh[k]); load(M.bh[k], p1.P.bh[k]); }
    load(M.Hv, p1.P.Hv); load(M.bv, p1.P.bv);
    const fr = G.makeRng(91000 + ckpt); const evalMasks = [];
    for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr.int(10) < 5 ? 2 : 0; evalMasks.push(m); }
    const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
    const probe = (streamId, ctx, w, labelOf) => {
      const rng = G.makeRng(streamId + ckpt); let hit = 0, nuSum = 0;
      for (let i = 0; i < 200; i++) {
        const e = inSeqGenShift(rng, null);
        const fw1 = inSeqForward(M, e.x, new Float64Array(8), evalMasks);
        const vhat = argmax4(fw1.hvLog);
        const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
        const mean2 = inMeanLogits({ logitsK: inSeqForward(M, x2m, fw1.cNew, evalMasks).logitsK });
        const nu = u56Sig(w[ctx]); nuSum += nu;
        const eff = [0, 1, 2, 3].map((o) => (1 - nu) * mean2[o] + nu * (o === 0 ? U56_K : 0));
        if (argmax4(eff) === labelOf(e)) hit++;
      }
      return { acc: hit / 200, nuMean: nuSum / 200 };
    };
    for (let s = 0; s < U56_FITS; s++) {
      const epath = u56EvalPath(ckpt, s);
      try { const prev = JSON.parse(await fs.readTextFile(epath)); if (prev && prev.verdict === "COMPLETE") { log(epath + " exists, skip"); continue; } } catch (e) {}
      const fit = JSON.parse(await fs.readTextFile(u56FitPath(ckpt, s)));
      if (fit.verdict !== "COMPLETE") throw new Error("fit missing " + u56FitPath(ckpt, s));
      const w = fit.W;
      const ctxA = probe(53400, 0, w, (e) => e.y), ctxB = probe(53500, 1, w, () => 0), retA = probe(53100, 0, w, (e) => e.y);
      await fs.writeTextFile(epath, JSON.stringify({ spec: "self-u56-ext1b-prereg", track: "U56-EXT1b", ckpt, stream: s, verdict: "COMPLETE", n: 200, stackHash: cur.hex, accCtxA: +ctxA.acc.toFixed(4), accCtxB: +ctxB.acc.toFixed(4), accRetA: +retA.acc.toFixed(4), vetoA: +retA.nuMean.toFixed(4), vetoB: +ctxB.nuMean.toFixed(4), checkpointAcc: p1.checkpoint.acc }));
    }
    log("u56-evals c" + ckpt + " COMPLETE (20 evals)");
  }
  return "ALL-EVALS-COMPLETE";
};
globalThis.runU56Verdict = async function (fs, log) {
  const perCkpt = [];
  for (const ckpt of [0, 1, 2]) {
    const E = [];
    for (let s = 0; s < U56_FITS; s++) E.push(JSON.parse(await fs.readTextFile(u56EvalPath(ckpt, s))));
    const p1 = JSON.parse(await fs.readTextFile(u56P1Path(ckpt, "noveto")));
    const ck = p1.checkpoint.acc;
    const m = (f) => E.reduce((a, e) => a + f(e), 0) / E.length;
    const mA = m((e) => e.accCtxA), mB = m((e) => e.accCtxB), mR = m((e) => e.accRetA), mVA = m((e) => e.vetoA), mVB = m((e) => e.vetoB);
    const pin = E.every((e) => e.stackHash === U56_EXPECT_STACK);
    const clean = Math.abs(mR - ck) <= 0.02 && mVA <= 0.05;
    const ctx = mA >= ck - 0.03 && mB >= 0.95;
    const floor = mA >= 0.45;
    const misfire = mVA > 0.05;
    perCkpt.push({ ckpt, ckptAcc: ck, pin, pass: pin, means: { ctxA: +mA.toFixed(4), ctxB: +mB.toFixed(4), ret: +mR.toFixed(4), vetoA: +mVA.toFixed(4), vetoB: +mVB.toFixed(4) }, clean, ctx, floor, misfire });
    log("u56-verdict c" + ckpt + " veto=" + mA.toFixed(3) + "/" + mB.toFixed(3) + " ret=" + mR.toFixed(3) + "(ckpt " + ck + ") vetoAB=" + mVA.toFixed(4) + "/" + mVB.toFixed(4));
  }
  const q = (f) => perCkpt.filter(f).length;
  const pinN = q((s) => s.pass), cleanN = q((s) => s.clean), ctxN = q((s) => s.ctx), floorN = q((s) => s.floor), misN = q((s) => s.misfire);
  let verdict, cause;
  if (pinN < 3) { verdict = "PIN-FAIL"; cause = "pin"; }
  else if (floorN < 2) { verdict = "FLOOR-FAIL"; cause = "floor (veto ctxA<0.45 at quorum)"; }
  else if (misN >= 2) { verdict = "LEAK-PERSISTS"; cause = "vetoA breach at quorum despite decoupled+balanced (P5 stays closed; E-EXT2 not licensed)"; }
  else if (cleanN < 2) { verdict = "LEAK-PERSISTS"; cause = "retention breach with clean vetoA (association not preservable)"; }
  else if (ctxN < 2) { verdict = "LEAK-PERSISTS"; cause = "ctx-joint fail (cannot implement policy even decoupled)"; }
  else { verdict = "LEAK-FIXED"; cause = "gate pass: E-EXT2 LICENSED (P5 REMAINS CLOSED until E-EXT2 ADVANCEs under B-heavy)"; }
  const body = { spec: "self-u56-ext1b-prereg", track: "U56-EXT1b", verdict, cause, bars: { "LEAK-PIN": pinN + "/3 (+trunk-grad-0 assert by construction)", "LEAK-CLEAN": cleanN + "/3", "LEAK-CTX": ctxN + "/3", "LEAK-FLOOR": floorN + "/3 (veto-only)", "MISFIRE-COUNT": misN + "/3" }, perCkpt };
  await fs.writeTextFile(U56_VERDICT_PATH, JSON.stringify(body));
  log("u56-verdict " + verdict + " cause=" + cause);
  return body;
};
