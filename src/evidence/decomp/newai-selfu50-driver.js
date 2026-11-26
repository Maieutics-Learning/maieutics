// newai-selfu50-driver.js — U50 drift (DET vs STOCH vs RES on rotating diet).
//
// Countersign: Turn-192 pre-countersign + Turn-193 "try it" = full cover for
// battery + Waves 0-2 with FRESH reviewers per wave (independent -> SHORT
// discussion prompts [fiction-drift lesson] -> owner arbitration, owner final).
// CPU/in-worker. NO PUSH.
// Prereg self-u50-drift-prereg.md v1.0 (3x IMPLEMENTABLE unanimous, STANDS).
// Battery fresh-eyes-self-u50-3x-results.md (no patches).
//
// Stack: pinned U33 (stackHash 258d2f06…), H48, 800st, B16/lr5e-3/K5/C6/auxW0.5/lam2.0.
// Diet: u50DietSingle(dataRng, step): quarter=step//200, hot sets alternate
// {0,1}->{2,3}->{0,1}->{2,3} (qk domain is {0,1,2,3} only — verified by probe;
// D1 amendment Turn-193: first issue used {4,5}/{6,7} for q2/q3 which never
// occur; Wave1 reviewers ruled HALT-FIX 2-1, discussion unanimous HOLD-HALT;
// this fix restores 4 regimes / 3 real boundaries; 9T force-overwritten,
// filed, no bar changes). 75% familiar / 12.5% OOD / 12.5% uniform.
// Arms: det (pick-max s*n), stoch (softmax T=0.5), res (s*n+N(0,0.3) pick-max).
// Alignment: per SLOT C candidates + 12 uniforms + 1 sampling uniform ALWAYS.
// Evals = u34 paired body verbatim. Floor + PIN as prereg.
//
// RUN (execute_js, fs in scope):
//   const src = await fs.readTextFile("src/evidence/decomp/newai-selfu50-driver.js");
//   (0, eval)(src + "\n//# sourceURL=newai-selfu50-driver.js");
//   await globalThis.SelfU50Init(fs);
//   const log = (m) => console.log(m);
//   await globalThis.runU50Wave0(fs, log);
//   await globalThis.runU50Train(fs, log, {seed:0, arm:"det"});
//   await globalThis.runU50Eval(fs, log, {seed:0, arm:"det"});
//   await globalThis.runU50Verdict(fs, log);
globalThis.SelfU50Init = async function (fs) {
  const src = await fs.readTextFile("src/evidence/decomp/newai-selfu46-driver.js");
  (0, eval)(src + "\n//# sourceURL=newai-selfu46-driver.js");
  await globalThis.SelfU46Init(fs);
  if (typeof u46AlignedDraws !== "function") throw new Error("u50 stack load failed: u46AlignedDraws missing");
  if (typeof u43ScoreRow !== "function") throw new Error("u50 stack load failed: u43ScoreRow missing");
};
const U50_EXPECT_STACK = "258d2f060684ce382778e203959ab791abb5df79af174deef19ff568886d4d6e";
const U50_ARMS = { det: 91, stoch: 92, res: 93 };
const U50_SIGMA = 0.3, U50_TEMP = 0.5;
const U50_HOT = [[0, 1], [2, 3], [0, 1], [2, 3]];
function u50TrainPath(seed, arm) { return "src/evidence/decomp/d-newai-self-u50-" + arm + "-s" + seed + "-800st.json"; }
function u50EvalPath(seed, arm) { return "src/evidence/decomp/d-newai-self-u50-eval-" + arm + "-s" + seed + "-800st.json"; }
const U50_VERDICT_PATH = "src/evidence/decomp/d-newai-self-u50-verdict.json";
const U50_WAVE0_PATH = "src/evidence/decomp/d-newai-self-u50-wave0.json";
// Quarter-aware diet single: 75% hot-familiar / 12.5% OOD / 12.5% uniform.
function u50DietSingle(dataRng, step) {
  const hot = U50_HOT[Math.min(3, Math.floor(step / 200))];
  const r = dataRng.int(8);
  if (r < 6) {
    let e = null;
    for (let t = 0; t < 10; t++) {
      const ub = dataRng.int(2) === 0;
      const cand = ub ? inSeqGenShift(dataRng, 0) : inSeqGenShift(dataRng, null);
      e = cand;
      if (cand.qk === hot[0] || cand.qk === hot[1]) break;
    }
    return e;
  }
  if (r === 6) {
    let e = null;
    for (let t = 0; t < 10; t++) {
      const ub = dataRng.int(2) === 0;
      const cand = ub ? inSeqGenShift(dataRng, 0) : inSeqGenShift(dataRng, null);
      e = cand;
      if (cand.qk !== cand.v) break;
    }
    return e;
  }
  const ub = dataRng.int(2) === 0;
  return ub ? inSeqGenShift(dataRng, 0) : inSeqGenShift(dataRng, null);
}
function u50HotOf(step) { return U50_HOT[Math.min(3, Math.floor(step / 200))]; }
// One train step; step is needed for quarter + adapt-rate.
function u50TrainOneStep(M, params, opt, dataRng, fixedMasks, arm, step, qkCount, adapt) {
  const B = 16, C = 6;
  let lsum = 0;
  const hot = u50HotOf(step);
  const q = Math.min(3, Math.floor(step / 200));
  for (let b = 0; b < B; b++) {
    const cands = [];
    for (let c = 0; c < C; c++) cands.push(u50DietSingle(dataRng, step));
    const sn = cands.map((e) => { const r = u43ScoreRow(M, e, qkCount, fixedMasks); return r.s * r.n; });
    const { gauss, uSamp } = u46AlignedDraws(dataRng);
    let pi = 0;
    if (arm === "det") { for (let c = 1; c < sn.length; c++) if (sn[c] > sn[pi]) pi = c; }
    else if (arm === "stoch") { pi = u46Pick(sn, gauss, uSamp, "stoch"); }
    else {
      let best = sn[0] + gauss[0] * U50_SIGMA;
      for (let c = 1; c < sn.length; c++) { const v = sn[c] + gauss[c] * U50_SIGMA; if (v > best) { best = v; pi = c; } }
    }
    const pick = cands[pi];
    qkCount.set(pick.qk, (qkCount.get(pick.qk) || 0) + 1);
    if (adapt) { adapt.n[q]++; if (pick.qk === hot[0] || pick.qk === hot[1]) adapt.hit[q]++; }
    lsum += u43StaticSlot(M, pick, b, B, fixedMasks);
  }
  return { loss: lsum / B };
}
globalThis.runU50Wave0 = async function (fs, log, opts) {
  if (!(opts && opts.force)) { try { const prev = JSON.parse(await fs.readTextFile(U50_WAVE0_PATH)); if (prev && prev.verdict === "COMPLETE") { log(U50_WAVE0_PATH + " exists, skip"); return prev; } } catch (e) {} }
  const twins = [];
  for (const arm of ["det", "stoch", "res"]) {
    for (const s of [0, 1, 2]) {
      const X = await globalThis.u32FreshStack(fs, s);
      const Y = await globalThis.u32FreshStack(fs, s);
      const p0 = globalThis.u32MaxAbsDiff(globalThis.u32SnapshotParams(X.M), globalThis.u32SnapshotParams(Y.M));
      for (const p of X.params) p.g.fill(0);
      for (const p of Y.params) p.g.fill(0);
      const qx = new Map(), qy = new Map();
      u50TrainOneStep(X.M, X.params, X.opt, X.dataRng, X.fixedMasks, arm, 250, qx, null);
      u50TrainOneStep(Y.M, Y.params, Y.opt, Y.dataRng, Y.fixedMasks, arm, 250, qy, null);
      const st = globalThis.u32MaxAbsDiff(globalThis.u32SnapshotParams(X.M), globalThis.u32SnapshotParams(Y.M));
      twins.push({ arm, seed: s, p0diff: p0.max, step1diff: st.max, pass: p0.max === 0 && st.max === 0 });
      log("u50-wave0 twin " + arm + " s" + s + " p0=" + p0.max + " step1=" + st.max);
      if (p0.max !== 0 || st.max !== 0) throw new Error("U50 Wave-0 HALT: twin nondeterminism " + arm + " s" + s);
    }
  }
  const body = { spec: "self-u50-drift-prereg", wave: 0, verdict: "COMPLETE", twins, sigma: U50_SIGMA, temp: U50_TEMP, deviations: [] };
  await fs.writeTextFile(U50_WAVE0_PATH, JSON.stringify(body));
  log("u50-wave0 twins PASS (3 arms x 3 seeds)");
  return body;
};
globalThis.runU50Train = async function (fs, log, opts) {
  const { seed, arm } = opts;
  if (!(arm in U50_ARMS)) throw new Error("arm must be det|stoch|res");
  const ledgerPath = u50TrainPath(seed, arm);
  if (!(opts && opts.force)) { try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {} }
  const h = await globalThis.u33StackHash(fs);
  if (h.hex !== U50_EXPECT_STACK) throw new Error("U50-PIN HALT: stack drift " + h.hex.slice(0, 16));
  const drvSrc = await fs.readTextFile("src/evidence/decomp/newai-selfu50-driver.js");
  const drvHash = await u32Sha256Hex(drvSrc);
  const t = await globalThis.u32FreshStack(fs, seed);
  const P0 = globalThis.u32SnapshotParams(t.M);
  const qkCount = new Map();
  const adapt = { hit: [0, 0, 0, 0], n: [0, 0, 0, 0] };
  const steps = 800, t0 = Date.now(), curve = [];
  const K = 5, lam = 2.0;
  for (let step = 0; step < steps; step++) {
    for (const p of t.params) p.g.fill(0);
    const r = u50TrainOneStep(t.M, t.params, t.opt, t.dataRng, t.fixedMasks, arm, step, qkCount, adapt);
    const meanW = new Float64Array(t.M.Wh[0].v.length);
    for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) meanW[i] += t.M.Wh[k].v[i] / K;
    for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) t.M.Wh[k].g[i] += lam * (t.M.Wh[k].v[i] - meanW[i]) / (16 * t.M.H);
    let s = 0; for (const p of t.params) for (let i = 0; i < p.g.length; i++) s += p.g[i] * p.g[i];
    const n = Math.sqrt(s);
    if (n > 1.0) { const sc = 1.0 / n; for (const p of t.params) for (let i = 0; i < p.g.length; i++) p.g[i] *= sc; }
    t.opt.step(t.params);
    if (step % 100 === 0 || step === steps - 1) curve.push({ step, loss: +r.loss.toFixed(6) });
    if (step % 200 === 0) log("u50-train " + arm + " s" + seed + " step " + step + "/800 loss=" + r.loss.toFixed(4));
  }
  const P = globalThis.u32SnapshotParams(t.M);
  const adaptRate = adapt.n.map((n, q) => n ? +(adapt.hit[q] / n).toFixed(4) : 0);
  const body = {
    spec: "self-u50-drift-prereg", track: "U50-DRIFT", arm, seed, steps,
    B: 16, lr: 5e-3, K: 5, H: 48, C: 6, auxW: 0.5, lam: 2.0, sigma: U50_SIGMA, temp: U50_TEMP,
    diet: "quarter-rotated familiar-qk {0,1}->{2,3}->{4,5}->{6,7} (75/12.5/12.5)",
    select: arm === "det" ? "pick-max s*n" : arm === "stoch" ? "softmax T=0.5 sampling" : "pick-max s*n+N(0,0.3)",
    verdict: "COMPLETE", stackHash: h.hex, stackFiles: h.perFile.map((f) => f.path), u50DriverHash: drvHash,
    wallMs: Date.now() - t0, curve, divCos: +inMeanCos(t.M).toFixed(4), adaptRate, P0, P,
  };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("u50-train " + arm + " s" + seed + " COMPLETE loss0=" + curve[0].loss + " lossN=" + curve[curve.length - 1].loss + " adapt=" + adaptRate.join("/"));
  return body;
};
globalThis.runU50Eval = async function (fs, log, opts) {
  const { seed, arm } = opts;
  const trainPath = u50TrainPath(seed, arm), evalPath = u50EvalPath(seed, arm);
  if (!opts.force) { try { const prev = JSON.parse(await fs.readTextFile(evalPath)); if (prev && prev.verdict === "COMPLETE") { log(evalPath + " exists, skip"); return prev; } } catch (e) {} }
  const G = await globalThis.IntrinsicInit(fs);
  const tr = JSON.parse(await fs.readTextFile(trainPath));
  if (tr.verdict !== "COMPLETE") throw new Error("train ledger missing " + trainPath);
  const cur = await globalThis.u33StackHash(fs);
  if (cur.hex !== tr.stackHash) throw new Error("U50-PIN HALT: stack drift since train " + trainPath);
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
    spec: "self-u50-drift-prereg", track: "U50-DRIFT", arm, seed, steps: 800,
    verdict: "COMPLETE", n: N, frozenTest: true, evalOf: trainPath, stackHash: cur.hex,
    accScratch: +(scr / N).toFixed(4), accTwo: +(two / N).toFixed(4),
    accOracle: +(orc / N).toFixed(4), accFwd: +(fF / N).toFixed(4),
  };
  await fs.writeTextFile(evalPath, JSON.stringify(body));
  log("u50-eval " + arm + " s" + seed + " scr=" + body.accScratch + " two=" + body.accTwo + " orc=" + body.accOracle);
  return body;
};
globalThis.runU50Verdict = async function (fs, log) {
  const arms = ["det", "stoch", "res"];
  const T = {}, E = {};
  for (const seed of [0, 1, 2]) for (const arm of arms) {
    T[seed + arm] = JSON.parse(await fs.readTextFile(u50TrainPath(seed, arm)));
    E[seed + arm] = JSON.parse(await fs.readTextFile(u50EvalPath(seed, arm)));
  }
  const pin = [0, 1, 2].every((s) => arms.every((a) => T[s + a].stackHash === U50_EXPECT_STACK && E[s + a].stackHash === U50_EXPECT_STACK));
  const rows = [0, 1, 2].map((s) => {
    const r = { seed: s, adapt: {} };
    for (const a of arms) { r[a] = { scr: E[s + a].accScratch, two: E[s + a].accTwo, orc: E[s + a].accOracle }; r.adapt[a] = T[s + a].adaptRate; }
    return r;
  });
  let verdict = "", detail = "";
  const winMax = rows.map((r) => Math.max(r.det.two, r.stoch.two, r.res.two));
  const floorBad = winMax.filter((v) => v < 0.45).length;
  const dRD = rows.map((r) => +(r.res.two - r.det.two).toFixed(4));
  const nRD = dRD.filter((d) => d >= 0.03).length;
  const dSD = rows.map((r) => +(r.stoch.two - r.det.two).toFixed(4));
  const nSD = dSD.filter((d) => d >= 0.03).length;
  for (const r of rows) log("u50 s" + r.seed + " det=" + r.det.two + " stoch=" + r.stoch.two + " res=" + r.res.two + " dRD=" + (r.res.two - r.det.two).toFixed(4) + " dSD=" + (r.stoch.two - r.det.two).toFixed(4));
  if (!pin) { verdict = "PIN-FAIL"; detail = "stack drift"; }
  else if (floorBad >= 2) { verdict = "INCONCLUSIVE"; detail = "max arm below floor on " + floorBad + "/3"; }
  else if (nRD >= 2 && nSD >= 2) {
    const mRD = dRD.filter((d) => d >= 0.03).reduce((a, b) => a + b, 0);
    const mSD = dSD.filter((d) => d >= 0.03).reduce((a, b) => a + b, 0);
    if (mRD >= mSD) { verdict = "ADVANCE-DRIFT"; detail = "both beat DET, RES mean margin bigger — blur vindicated under drift"; }
    else { verdict = "ADVANCE-DICE"; detail = "both beat DET, STOCH mean margin bigger — dice rules even rotating"; }
  }
  else if (nRD >= 2) { verdict = "ADVANCE-DRIFT"; detail = "RES>=DET+0.03 on " + nRD + "/3 — blur vindicated under drift"; }
  else if (nSD >= 2) { verdict = "ADVANCE-DICE"; detail = "STOCH>=DET+0.03 on " + nSD + "/3 (blur fails) — dice rules even rotating"; }
  else { verdict = "DEAD"; detail = "no quorum (dRD " + dRD.join("/") + " dSD " + dSD.join("/") + ") — noise doesn't help even rotating"; }
  const body = { spec: "self-u50-drift-prereg", track: "U50-DRIFT", verdict, detail, pin, rows, sigma: U50_SIGMA, temp: U50_TEMP };
  await fs.writeTextFile(U50_VERDICT_PATH, JSON.stringify(body));
  log("u50-verdict " + verdict + " (" + detail + ")");
  return body;
};
