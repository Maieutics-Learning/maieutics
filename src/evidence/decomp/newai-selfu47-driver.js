// newai-selfu47-driver.js — U47 stacked noise (DET vs STOCH vs BOTH).
//
// Countersign: Turn-189 "go for it" = full Waves 0-2 cover with FRESH reviewers
// per wave (independent -> discussion -> owner arbitration, owner final).
// CPU/in-worker. NO PUSH.
// Prereg self-u47-combo-prereg.md v1.0 (STANDS, 3x IMPLEMENTABLE unanimous).
// Battery fresh-eyes-self-u47-3x-results.md (R1/R2/R3 IMPLEMENTABLE, no patches).
//
// Stack: pinned U33 (stackHash 258d2f06…), H48, 800st, B16/lr5e-3/K5/C6/auxW0.5/lam2.0.
// Diet: U46 VERBATIM (u43DietSingle C=6/slot, GainxNeed s*n via u43ScoreRow with
// picked-history qkCount, u43StaticSlot verbatim).
// Arms: det (pick-max s*n), stoch (softmax T=0.5 sampling, U46-STOCH verbatim),
// both (score'=s*n+Gaussian(0,0.3) then softmax T=0.5 sampling, total std ~0.71).
// Alignment: per SLOT draw C candidates + 12 uniforms (Gaussian block) + 1 uniform
// (sampling) ALWAYS in all arms. Losses = u43StaticSlot verbatim.
// Evals = u34 paired body verbatim. Floor: max-arm two < 0.45 on >=2 seeds ->
// INCONCLUSIVE. PIN fail -> HALT.
//
// RUN (execute_js, fs in scope):
//   const src = await fs.readTextFile("src/evidence/decomp/newai-selfu47-driver.js");
//   (0, eval)(src + "\n//# sourceURL=newai-selfu47-driver.js");
//   await globalThis.SelfU47Init(fs);
//   const log = (m) => console.log(m);
//   await globalThis.runU47Wave0(fs, log);
//   await globalThis.runU47Train(fs, log, {seed:0, arm:"det"});
//   await globalThis.runU47Eval(fs, log, {seed:0, arm:"det"});
//   await globalThis.runU47Verdict(fs, log);
globalThis.SelfU47Init = async function (fs) {
  const src = await fs.readTextFile("src/evidence/decomp/newai-selfu46-driver.js");
  (0, eval)(src + "\n//# sourceURL=newai-selfu46-driver.js");
  await globalThis.SelfU46Init(fs);
  if (typeof u46AlignedDraws !== "function") throw new Error("u47 stack load failed: u46AlignedDraws missing");
  if (typeof u43ScoreRow !== "function") throw new Error("u47 stack load failed: u43ScoreRow missing");
};
const U47_EXPECT_STACK = "258d2f060684ce382778e203959ab791abb5df79af174deef19ff568886d4d6e";
const U47_ARMS = { det: 71, stoch: 72, both: 73 };
const U47_SIGMA = 0.3, U47_TEMP = 0.5;
function u47TrainPath(seed, arm) { return "src/evidence/decomp/d-newai-self-u47-" + arm + "-s" + seed + "-800st.json"; }
function u47EvalPath(seed, arm) { return "src/evidence/decomp/d-newai-self-u47-eval-" + arm + "-s" + seed + "-800st.json"; }
const U47_VERDICT_PATH = "src/evidence/decomp/d-newai-self-u47-verdict.json";
const U47_WAVE0_PATH = "src/evidence/decomp/d-newai-self-u47-wave0.json";
// BOTH pick: smudge then softmax-sample.
function u47BothPick(sn, gauss, uSamp) {
  const sp = sn.map((v, i) => v + gauss[i] * U47_SIGMA);
  let mx = sp[0]; for (let c = 1; c < sp.length; c++) if (sp[c] > mx) mx = sp[c];
  const e = sp.map((v) => Math.exp((v - mx) / U47_TEMP));
  let s = 0; for (const v of e) s += v;
  let acc = 0;
  for (let c = 0; c < e.length; c++) { acc += e[c] / s; if (uSamp < acc || c === e.length - 1) return c; }
  return e.length - 1;
}
function u47Pick(sn, gauss, uSamp, arm) {
  if (arm === "both") return u47BothPick(sn, gauss, uSamp);
  return u46Pick(sn, gauss, uSamp, arm === "stoch" ? "stoch" : "det");
}
function u47TrainOneStep(M, params, opt, dataRng, fixedMasks, arm, qkCount) {
  const B = 16, C = 6;
  let lsum = 0;
  for (let b = 0; b < B; b++) {
    const cands = [];
    for (let c = 0; c < C; c++) cands.push(u43DietSingle(dataRng));
    const sn = cands.map((e) => { const r = u43ScoreRow(M, e, qkCount, fixedMasks); return r.s * r.n; });
    const { gauss, uSamp } = u46AlignedDraws(dataRng);
    const pi = u47Pick(sn, gauss, uSamp, arm);
    const pick = cands[pi];
    qkCount.set(pick.qk, (qkCount.get(pick.qk) || 0) + 1);
    lsum += u43StaticSlot(M, pick, b, B, fixedMasks);
  }
  return { loss: lsum / B };
}
globalThis.runU47Wave0 = async function (fs, log) {
  try { const prev = JSON.parse(await fs.readTextFile(U47_WAVE0_PATH)); if (prev && prev.verdict === "COMPLETE") { log(U47_WAVE0_PATH + " exists, skip"); return prev; } } catch (e) {}
  const twins = [];
  for (const arm of ["det", "stoch", "both"]) {
    for (const s of [0, 1, 2]) {
      const X = await globalThis.u32FreshStack(fs, s);
      const Y = await globalThis.u32FreshStack(fs, s);
      const p0 = globalThis.u32MaxAbsDiff(globalThis.u32SnapshotParams(X.M), globalThis.u32SnapshotParams(Y.M));
      for (const p of X.params) p.g.fill(0);
      for (const p of Y.params) p.g.fill(0);
      const qx = new Map(), qy = new Map();
      u47TrainOneStep(X.M, X.params, X.opt, X.dataRng, X.fixedMasks, arm, qx);
      u47TrainOneStep(Y.M, Y.params, Y.opt, Y.dataRng, Y.fixedMasks, arm, qy);
      const st = globalThis.u32MaxAbsDiff(globalThis.u32SnapshotParams(X.M), globalThis.u32SnapshotParams(Y.M));
      twins.push({ arm, seed: s, p0diff: p0.max, step1diff: st.max, pass: p0.max === 0 && st.max === 0 });
      log("u47-wave0 twin " + arm + " s" + s + " p0=" + p0.max + " step1=" + st.max);
      if (p0.max !== 0 || st.max !== 0) throw new Error("U47 Wave-0 HALT: twin nondeterminism " + arm + " s" + s);
    }
  }
  const body = { spec: "self-u47-combo-prereg", wave: 0, verdict: "COMPLETE", twins, sigma: U47_SIGMA, temp: U47_TEMP, deviations: [] };
  await fs.writeTextFile(U47_WAVE0_PATH, JSON.stringify(body));
  log("u47-wave0 twins PASS (3 arms x 3 seeds)");
  return body;
};
globalThis.runU47Train = async function (fs, log, opts) {
  const { seed, arm } = opts;
  if (!(arm in U47_ARMS)) throw new Error("arm must be det|stoch|both");
  const ledgerPath = u47TrainPath(seed, arm);
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  const h = await globalThis.u33StackHash(fs);
  if (h.hex !== U47_EXPECT_STACK) throw new Error("U47-PIN HALT: stack drift " + h.hex.slice(0, 16));
  const drvSrc = await fs.readTextFile("src/evidence/decomp/newai-selfu47-driver.js");
  const drvHash = await u32Sha256Hex(drvSrc);
  const t = await globalThis.u32FreshStack(fs, seed);
  const P0 = globalThis.u32SnapshotParams(t.M);
  const qkCount = new Map();
  const steps = 800, t0 = Date.now(), curve = [];
  const K = 5, lam = 2.0;
  for (let step = 0; step < steps; step++) {
    for (const p of t.params) p.g.fill(0);
    const r = u47TrainOneStep(t.M, t.params, t.opt, t.dataRng, t.fixedMasks, arm, qkCount);
    const meanW = new Float64Array(t.M.Wh[0].v.length);
    for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) meanW[i] += t.M.Wh[k].v[i] / K;
    for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) t.M.Wh[k].g[i] += lam * (t.M.Wh[k].v[i] - meanW[i]) / (16 * t.M.H);
    let s = 0; for (const p of t.params) for (let i = 0; i < p.g.length; i++) s += p.g[i] * p.g[i];
    const n = Math.sqrt(s);
    if (n > 1.0) { const sc = 1.0 / n; for (const p of t.params) for (let i = 0; i < p.g.length; i++) p.g[i] *= sc; }
    t.opt.step(t.params);
    if (step % 100 === 0 || step === steps - 1) curve.push({ step, loss: +r.loss.toFixed(6) });
    if (step % 200 === 0) log("u47-train " + arm + " s" + seed + " step " + step + "/800 loss=" + r.loss.toFixed(4));
  }
  const P = globalThis.u32SnapshotParams(t.M);
  const body = {
    spec: "self-u47-combo-prereg", track: "U47-COMBO", arm, seed, steps,
    B: 16, lr: 5e-3, K: 5, H: 48, C: 6, auxW: 0.5, lam: 2.0, sigma: U47_SIGMA, temp: U47_TEMP,
    diet: "U46 candidates + GainxNeed selection with aligned noise block (12+1 draws)",
    select: arm === "det" ? "pick-max s*n" : arm === "stoch" ? "softmax T=0.5 sampling" : "Gaussian(0,0.3) then softmax T=0.5",
    verdict: "COMPLETE", stackHash: h.hex, stackFiles: h.perFile.map((f) => f.path), u47DriverHash: drvHash,
    wallMs: Date.now() - t0, curve, divCos: +inMeanCos(t.M).toFixed(4), P0, P,
  };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("u47-train " + arm + " s" + seed + " COMPLETE loss0=" + curve[0].loss + " lossN=" + curve[curve.length - 1].loss);
  return body;
};
globalThis.runU47Eval = async function (fs, log, opts) {
  const { seed, arm } = opts;
  const trainPath = u47TrainPath(seed, arm), evalPath = u47EvalPath(seed, arm);
  if (!opts.force) { try { const prev = JSON.parse(await fs.readTextFile(evalPath)); if (prev && prev.verdict === "COMPLETE") { log(evalPath + " exists, skip"); return prev; } } catch (e) {} }
  const G = await globalThis.IntrinsicInit(fs);
  const tr = JSON.parse(await fs.readTextFile(trainPath));
  if (tr.verdict !== "COMPLETE") throw new Error("train ledger missing " + trainPath);
  const cur = await globalThis.u33StackHash(fs);
  if (cur.hex !== tr.stackHash) throw new Error("U47-PIN HALT: stack drift since train " + trainPath);
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
    spec: "self-u47-combo-prereg", track: "U47-COMBO", arm, seed, steps: 800,
    verdict: "COMPLETE", n: N, frozenTest: true, evalOf: trainPath, stackHash: cur.hex,
    accScratch: +(scr / N).toFixed(4), accTwo: +(two / N).toFixed(4),
    accOracle: +(orc / N).toFixed(4), accFwd: +(fF / N).toFixed(4),
  };
  await fs.writeTextFile(evalPath, JSON.stringify(body));
  log("u47-eval " + arm + " s" + seed + " scr=" + body.accScratch + " two=" + body.accTwo + " orc=" + body.accOracle);
  return body;
};
globalThis.runU47Verdict = async function (fs, log) {
  const arms = ["det", "stoch", "both"];
  const T = {}, E = {};
  for (const seed of [0, 1, 2]) for (const arm of arms) {
    T[seed + arm] = JSON.parse(await fs.readTextFile(u47TrainPath(seed, arm)));
    E[seed + arm] = JSON.parse(await fs.readTextFile(u47EvalPath(seed, arm)));
  }
  const pin = [0, 1, 2].every((s) => arms.every((a) => T[s + a].stackHash === U47_EXPECT_STACK && E[s + a].stackHash === U47_EXPECT_STACK));
  const rows = [0, 1, 2].map((s) => {
    const r = { seed: s };
    for (const a of arms) r[a] = { scr: E[s + a].accScratch, two: E[s + a].accTwo, orc: E[s + a].accOracle };
    return r;
  });
  let verdict = "", detail = "";
  const winMax = rows.map((r) => Math.max(r.det.two, r.stoch.two, r.both.two));
  const floorBad = winMax.filter((v) => v < 0.45).length;
  const dBS = rows.map((r) => +(r.both.two - r.stoch.two).toFixed(4));
  const nBS = dBS.filter((d) => d >= 0.03).length;
  const dSB = rows.map((r) => +(r.stoch.two - r.both.two).toFixed(4));
  const nSB = dSB.filter((d) => d >= 0.03).length;
  const spread = rows.map((r) => Math.max(r.det.two, r.stoch.two, r.both.two) - Math.min(r.det.two, r.stoch.two, r.both.two));
  const nClose = spread.filter((v) => v <= 0.03).length;
  for (const r of rows) log("u47 s" + r.seed + " det=" + r.det.two + " stoch=" + r.stoch.two + " both=" + r.both.two + " dBS=" + (r.both.two - r.stoch.two).toFixed(4));
  if (!pin) { verdict = "PIN-FAIL"; detail = "stack drift"; }
  else if (floorBad >= 2) { verdict = "INCONCLUSIVE"; detail = "max arm below floor on " + floorBad + "/3"; }
  else if (nBS >= 2) { verdict = "ADVANCE-COMBO"; detail = "BOTH>=STOCH+0.03 on " + nBS + "/3 — stacking wins"; }
  else if (nSB >= 2) { verdict = "DEAD-COMBO"; detail = "STOCH>=BOTH+0.03 on " + nSB + "/3 — dice alone best, smudge hurts"; }
  else { verdict = "DEAD"; detail = nClose >= 2 ? "all within 0.03 (close " + nClose + "/3) — no stacking benefit" : "no quorum (dBS " + dBS.join("/") + ") — no stacking benefit"; }
  const body = { spec: "self-u47-combo-prereg", track: "U47-COMBO", verdict, detail, pin, rows, sigma: U47_SIGMA, temp: U47_TEMP };
  await fs.writeTextFile(U47_VERDICT_PATH, JSON.stringify(body));
  log("u47-verdict " + verdict + " (" + detail + ")");
  return body;
};
