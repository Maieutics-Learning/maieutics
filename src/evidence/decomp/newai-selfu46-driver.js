// newai-selfu46-driver.js — U46 decision-noise curiosity (DET vs RES vs STOCH).
//
// Countersign: Turn-187 iterative battery+waves ("Go ahead and lets run an iterative
// battery cumulating in a discussion of fresh eyes... Then run the waves over and over
// again with new contextless reviewers") = cover for driver build + Waves 0-2 with
// FRESH reviewers per wave (independent -> discussion -> owner-arbitrated fixes).
// CPU/in-worker. NO PUSH.
// Prereg self-u46-noise-prereg.md v1.0 (STANDS, 3x IMPLEMENTABLE unanimous).
// Battery fresh-eyes-self-u46-3x-results.md (R1/R2/R3 IMPLEMENTABLE, no patches).
//
// Stack: pinned U33 (stackHash 258d2f06…), H48, 800st, B16/lr5e-3/K5/C6/auxW0.5/lam2.0.
// Diet: M1/U44 candidates VERBATIM (u43DietSingle, C=6/slot, GainxNeed via u43ScoreRow).
// Arms: det (pick-max s*n), res (s*n+Gaussian(0,0.3) pick-max, Box-Muller),
// stoch (softmax T=0.5 sampling). Alignment: per SLOT draw C candidates +
// 12 uniforms (RES noise block) + 1 uniform (STOCH sampling) ALWAYS in all arms.
// Losses = u43StaticSlot verbatim. Evals = u34 paired body verbatim.
// Floor: max-arm two < 0.45 on >=2 seeds -> INCONCLUSIVE. PIN fail -> HALT.
//
// RUN (execute_js, fs in scope):
//   const src = await fs.readTextFile("src/evidence/decomp/newai-selfu46-driver.js");
//   (0, eval)(src + "\n//# sourceURL=newai-selfu46-driver.js");
//   await globalThis.SelfU46Init(fs);
//   const log = (m) => console.log(m);
//   await globalThis.runU46Wave0(fs, log);
//   await globalThis.runU46Train(fs, log, {seed:0, arm:"det"});
//   await globalThis.runU46Eval(fs, log, {seed:0, arm:"det"});
//   await globalThis.runU46Verdict(fs, log);
globalThis.SelfU46Init = async function (fs) {
  const src = await fs.readTextFile("src/evidence/decomp/newai-selfu43-driver.js");
  (0, eval)(src + "\n//# sourceURL=newai-selfu43-driver.js");
  await globalThis.SelfU43Init(fs);
  if (typeof u43StaticSlot !== "function") throw new Error("u46 stack load failed: u43StaticSlot missing");
  if (typeof u43ScoreRow !== "function") throw new Error("u46 stack load failed: u43ScoreRow missing");
  if (typeof u43DietSingle !== "function") throw new Error("u46 stack load failed: u43DietSingle missing");
};
const U46_EXPECT_STACK = "258d2f060684ce382778e203959ab791abb5df79af174deef19ff568886d4d6e";
const U46_ARMS = { det: 61, res: 62, stoch: 63 };
const U46_SIGMA = 0.3, U46_TEMP = 0.5;
function u46TrainPath(seed, arm) { return "src/evidence/decomp/d-newai-self-u46-" + arm + "-s" + seed + "-800st.json"; }
function u46EvalPath(seed, arm) { return "src/evidence/decomp/d-newai-self-u46-eval-" + arm + "-s" + seed + "-800st.json"; }
const U46_VERDICT_PATH = "src/evidence/decomp/d-newai-self-u46-verdict.json";
const U46_WAVE0_PATH = "src/evidence/decomp/d-newai-self-u46-wave0.json";
// Aligned noise block: exactly 12 uniforms (6 Gaussians) + 1 sampling uniform, ALWAYS.
function u46AlignedDraws(dataRng) {
  const gauss = [];
  for (let i = 0; i < 6; i++) {
    let u1 = dataRng.uniform(0, 1); if (!(u1 > 0)) u1 = 1e-12;
    let u2 = dataRng.uniform(0, 1);
    gauss.push(Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2));
  }
  const uSamp = dataRng.uniform(0, 1);
  return { gauss, uSamp };
}
function u46Pick(sn, gauss, uSamp, arm) {
  if (arm === "res") {
    let pi = 0, best = sn[0] + gauss[0] * U46_SIGMA;
    for (let c = 1; c < sn.length; c++) { const v = sn[c] + gauss[c] * U46_SIGMA; if (v > best) { best = v; pi = c; } }
    return pi;
  }
  if (arm === "stoch") {
    let mx = sn[0]; for (let c = 1; c < sn.length; c++) if (sn[c] > mx) mx = sn[c];
    const e = sn.map((v) => Math.exp((v - mx) / U46_TEMP));
    let s = 0; for (const v of e) s += v;
    let acc = 0;
    for (let c = 0; c < e.length; c++) { acc += e[c] / s; if (uSamp < acc || c === e.length - 1) return c; }
    return e.length - 1;
  }
  let pi = 0; for (let c = 1; c < sn.length; c++) if (sn[c] > sn[pi]) pi = c;
  return pi;
}
// One train step shared by wave0 twins + production (qkCount = picked-history familiarity).
function u46TrainOneStep(M, params, opt, dataRng, fixedMasks, arm, qkCount) {
  const B = 16, C = 6;
  let lsum = 0;
  for (let b = 0; b < B; b++) {
    const cands = [];
    for (let c = 0; c < C; c++) cands.push(u43DietSingle(dataRng));
    const sn = cands.map((e) => { const r = u43ScoreRow(M, e, qkCount, fixedMasks); return r.s * r.n; });
    const { gauss, uSamp } = u46AlignedDraws(dataRng);
    const pi = u46Pick(sn, gauss, uSamp, arm);
    const pick = cands[pi];
    qkCount.set(pick.qk, (qkCount.get(pick.qk) || 0) + 1);
    lsum += u43StaticSlot(M, pick, b, B, fixedMasks);
  }
  return { loss: lsum / B };
}
globalThis.runU46Wave0 = async function (fs, log) {
  try { const prev = JSON.parse(await fs.readTextFile(U46_WAVE0_PATH)); if (prev && prev.verdict === "COMPLETE") { log(U46_WAVE0_PATH + " exists, skip"); return prev; } } catch (e) {}
  const twins = [];
  for (const arm of ["det", "res", "stoch"]) {
    for (const s of [0, 1, 2]) {
      const X = await globalThis.u32FreshStack(fs, s);
      const Y = await globalThis.u32FreshStack(fs, s);
      const p0 = globalThis.u32MaxAbsDiff(globalThis.u32SnapshotParams(X.M), globalThis.u32SnapshotParams(Y.M));
      for (const p of X.params) p.g.fill(0);
      for (const p of Y.params) p.g.fill(0);
      const qx = new Map(), qy = new Map();
      u46TrainOneStep(X.M, X.params, X.opt, X.dataRng, X.fixedMasks, arm, qx);
      u46TrainOneStep(Y.M, Y.params, Y.opt, Y.dataRng, Y.fixedMasks, arm, qy);
      const st = globalThis.u32MaxAbsDiff(globalThis.u32SnapshotParams(X.M), globalThis.u32SnapshotParams(Y.M));
      twins.push({ arm, seed: s, p0diff: p0.max, step1diff: st.max, pass: p0.max === 0 && st.max === 0 });
      log("u46-wave0 twin " + arm + " s" + s + " p0=" + p0.max + " step1=" + st.max);
      if (p0.max !== 0 || st.max !== 0) throw new Error("U46 Wave-0 HALT: twin nondeterminism " + arm + " s" + s);
    }
  }
  const body = { spec: "self-u46-noise-prereg", wave: 0, verdict: "COMPLETE", twins, sigma: U46_SIGMA, temp: U46_TEMP, deviations: [] };
  await fs.writeTextFile(U46_WAVE0_PATH, JSON.stringify(body));
  log("u46-wave0 twins PASS (3 arms x 3 seeds)");
  return body;
};
globalThis.runU46Train = async function (fs, log, opts) {
  const { seed, arm } = opts;
  if (!(arm in U46_ARMS)) throw new Error("arm must be det|res|stoch");
  const ledgerPath = u46TrainPath(seed, arm);
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  const h = await globalThis.u33StackHash(fs);
  if (h.hex !== U46_EXPECT_STACK) throw new Error("U46-PIN HALT: stack drift " + h.hex.slice(0, 16));
  const drvSrc = await fs.readTextFile("src/evidence/decomp/newai-selfu46-driver.js");
  const drvHash = await u32Sha256Hex(drvSrc);
  const t = await globalThis.u32FreshStack(fs, seed);
  const P0 = globalThis.u32SnapshotParams(t.M);
  const qkCount = new Map();
  const steps = 800, t0 = Date.now(), curve = [];
  const K = 5, lam = 2.0;
  for (let step = 0; step < steps; step++) {
    for (const p of t.params) p.g.fill(0);
    const r = u46TrainOneStep(t.M, t.params, t.opt, t.dataRng, t.fixedMasks, arm, qkCount);
    const meanW = new Float64Array(t.M.Wh[0].v.length);
    for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) meanW[i] += t.M.Wh[k].v[i] / K;
    for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) t.M.Wh[k].g[i] += lam * (t.M.Wh[k].v[i] - meanW[i]) / (16 * t.M.H);
    let s = 0; for (const p of t.params) for (let i = 0; i < p.g.length; i++) s += p.g[i] * p.g[i];
    const n = Math.sqrt(s);
    if (n > 1.0) { const sc = 1.0 / n; for (const p of t.params) for (let i = 0; i < p.g.length; i++) p.g[i] *= sc; }
    t.opt.step(t.params);
    if (step % 100 === 0 || step === steps - 1) curve.push({ step, loss: +r.loss.toFixed(6) });
    if (step % 200 === 0) log("u46-train " + arm + " s" + seed + " step " + step + "/800 loss=" + r.loss.toFixed(4));
  }
  const P = globalThis.u32SnapshotParams(t.M);
  const body = {
    spec: "self-u46-noise-prereg", track: "U46-NOISE", arm, seed, steps,
    B: 16, lr: 5e-3, K: 5, H: 48, C: 6, auxW: 0.5, lam: 2.0, sigma: U46_SIGMA, temp: U46_TEMP,
    diet: "M1/U44 candidates + GainxNeed selection with aligned noise block (12+1 draws)",
    select: arm === "det" ? "pick-max s*n" : arm === "res" ? "pick-max s*n+N(0,0.3)" : "softmax T=0.5 sampling",
    verdict: "COMPLETE", stackHash: h.hex, stackFiles: h.perFile.map((f) => f.path), u46DriverHash: drvHash,
    wallMs: Date.now() - t0, curve, divCos: +inMeanCos(t.M).toFixed(4), P0, P,
  };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("u46-train " + arm + " s" + seed + " COMPLETE loss0=" + curve[0].loss + " lossN=" + curve[curve.length - 1].loss);
  return body;
};
globalThis.runU46Eval = async function (fs, log, opts) {
  const { seed, arm } = opts;
  const trainPath = u46TrainPath(seed, arm), evalPath = u46EvalPath(seed, arm);
  if (!opts.force) { try { const prev = JSON.parse(await fs.readTextFile(evalPath)); if (prev && prev.verdict === "COMPLETE") { log(evalPath + " exists, skip"); return prev; } } catch (e) {} }
  const G = await globalThis.IntrinsicInit(fs);
  const tr = JSON.parse(await fs.readTextFile(trainPath));
  if (tr.verdict !== "COMPLETE") throw new Error("train ledger missing " + trainPath);
  const cur = await globalThis.u33StackHash(fs);
  if (cur.hex !== tr.stackHash) throw new Error("U46-PIN HALT: stack drift since train " + trainPath);
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
    if (argmax4(inMeanLogits({ logitsK: inSeqForward(M, xo, fw1.cNew, evalMasks).logitsK })) === e.y) orc++;
  }
  let fF = 0;
  for (let i = 0; i < N; i++) {
    const e = inSeqGenShift(frng, 0);
    if (argmax4(inMeanLogits({ logitsK: inSeqForward(M, e.x, new Float64Array(8), evalMasks).logitsK })) === e.y) fF++;
  }
  const body = {
    spec: "self-u46-noise-prereg", track: "U46-NOISE", arm, seed, steps: 800,
    verdict: "COMPLETE", n: N, frozenTest: true, evalOf: trainPath, stackHash: cur.hex,
    accScratch: +(scr / N).toFixed(4), accTwo: +(two / N).toFixed(4),
    accOracle: +(orc / N).toFixed(4), accFwd: +(fF / N).toFixed(4),
  };
  await fs.writeTextFile(evalPath, JSON.stringify(body));
  log("u46-eval " + arm + " s" + seed + " scr=" + body.accScratch + " two=" + body.accTwo + " orc=" + body.accOracle);
  return body;
};
globalThis.runU46Verdict = async function (fs, log) {
  const arms = ["det", "res", "stoch"];
  const T = {}, E = {};
  for (const seed of [0, 1, 2]) for (const arm of arms) {
    T[seed + arm] = JSON.parse(await fs.readTextFile(u46TrainPath(seed, arm)));
    E[seed + arm] = JSON.parse(await fs.readTextFile(u46EvalPath(seed, arm)));
  }
  const pin = [0, 1, 2].every((s) => arms.every((a) => T[s + a].stackHash === U46_EXPECT_STACK && E[s + a].stackHash === U46_EXPECT_STACK));
  const rows = [0, 1, 2].map((s) => {
    const r = { seed: s };
    for (const a of arms) r[a] = { scr: E[s + a].accScratch, two: E[s + a].accTwo, orc: E[s + a].accOracle };
    return r;
  });
  let verdict = "", detail = "";
  const winMax = rows.map((r) => Math.max(r.det.two, r.res.two, r.stoch.two));
  const floorBad = winMax.filter((v) => v < 0.45).length;
  const dRD = rows.map((r) => +(r.res.two - r.det.two).toFixed(4));
  const nRD = dRD.filter((d) => d >= 0.03).length;
  const dSD = rows.map((r) => +(r.stoch.two - r.det.two).toFixed(4));
  const nSD = dSD.filter((d) => d >= 0.03).length;
  const spread = rows.map((r) => Math.max(r.det.two, r.res.two, r.stoch.two) - Math.min(r.det.two, r.res.two, r.stoch.two));
  const nClose = spread.filter((v) => v <= 0.03).length;
  for (const r of rows) log("u46 s" + r.seed + " det=" + r.det.two + " res=" + r.res.two + " stoch=" + r.stoch.two + " dRD=" + (r.res.two - r.det.two).toFixed(4) + " dSD=" + (r.stoch.two - r.det.two).toFixed(4));
  if (!pin) { verdict = "PIN-FAIL"; detail = "stack drift"; }
  else if (floorBad >= 2) { verdict = "INCONCLUSIVE"; detail = "max arm below floor on " + floorBad + "/3"; }
  else if (nRD >= 2) { verdict = "ADVANCE"; detail = "RES>=DET+0.03 on " + nRD + "/3 — resonance installs curiosity benefit"; }
  else if (nSD >= 2) { verdict = "ADVANCE-PROT"; detail = "STOCH>=DET+0.03 on " + nSD + "/3 — probabilistic decision helps"; }
  else { verdict = "DEAD"; detail = nClose >= 2 ? "all within 0.03 (close " + nClose + "/3) — decision-noise dead" : "no quorum (dRD " + dRD.join("/") + " dSD " + dSD.join("/") + ") — no license"; }
  const body = { spec: "self-u46-noise-prereg", track: "U46-NOISE", verdict, detail, pin, rows, sigma: U46_SIGMA, temp: U46_TEMP };
  await fs.writeTextFile(U46_VERDICT_PATH, JSON.stringify(body));
  log("u46-verdict " + verdict + " (" + detail + ")");
  return body;
};
