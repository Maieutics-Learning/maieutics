// newai-selfu49-driver.js — U49 margin-gated stacking (DET vs STOCH vs GATE).
//
// Countersign: Turn-192 pre-countersign ("pre-countersign everything you are
// drafting. Go for it!") = full cover for battery + Waves 0-2 with FRESH
// reviewers per wave (independent -> strict-4-line discussion -> owner
// arbitration, owner final; fiction rounds discarded as reviewer failure).
// CPU/in-worker. NO PUSH.
// Prereg self-u49-margate-prereg.md v1.0 (3x IMPLEMENTABLE unanimous, STANDS).
// Battery fresh-eyes-self-u49-3x-results.md (no patches).
//
// Stack: pinned U33 (stackHash 258d2f06…), H48, 800st, B16/lr5e-3/K5/C6/auxW0.5/lam2.0.
// Diet: U46/U47 VERBATIM (u43DietSingle C=6/slot, GainxNeed s*n via u43ScoreRow
// with picked-history qkCount, u43StaticSlot verbatim).
// Arms: det (pick-max s*n), stoch (softmax T=0.5), gate (margin<0.3 -> BOTH path
// sigma0.3+softmaxT0.5, else STOCH path). M0==sigma, zero new DoF.
// Alignment: per SLOT draw C candidates + 12 uniforms + 1 sampling uniform
// ALWAYS in all arms. Evals = u34 paired body verbatim. Floor + PIN as prereg.
//
// RUN (execute_js, fs in scope):
//   const src = await fs.readTextFile("src/evidence/decomp/newai-selfu49-driver.js");
//   (0, eval)(src + "\n//# sourceURL=newai-selfu49-driver.js");
//   await globalThis.SelfU49Init(fs);
//   const log = (m) => console.log(m);
//   await globalThis.runU49Wave0(fs, log);
//   await globalThis.runU49Train(fs, log, {seed:0, arm:"det"});
//   await globalThis.runU49Eval(fs, log, {seed:0, arm:"det"});
//   await globalThis.runU49Verdict(fs, log);
globalThis.SelfU49Init = async function (fs) {
  const src = await fs.readTextFile("src/evidence/decomp/newai-selfu47-driver.js");
  (0, eval)(src + "\n//# sourceURL=newai-selfu47-driver.js");
  await globalThis.SelfU47Init(fs);
  if (typeof u46AlignedDraws !== "function") throw new Error("u49 stack load failed: u46AlignedDraws missing");
  if (typeof u47BothPick !== "function") throw new Error("u49 stack load failed: u47BothPick missing");
};
const U49_EXPECT_STACK = "258d2f060684ce382778e203959ab791abb5df79af174deef19ff568886d4d6e";
const U49_ARMS = { det: 81, stoch: 82, gate: 83 };
const U49_SIGMA = 0.3, U49_TEMP = 0.5, U49_M0 = 0.3;
function u49TrainPath(seed, arm) { return "src/evidence/decomp/d-newai-self-u49-" + arm + "-s" + seed + "-800st.json"; }
function u49EvalPath(seed, arm) { return "src/evidence/decomp/d-newai-self-u49-eval-" + arm + "-s" + seed + "-800st.json"; }
const U49_VERDICT_PATH = "src/evidence/decomp/d-newai-self-u49-verdict.json";
const U49_WAVE0_PATH = "src/evidence/decomp/d-newai-self-u49-wave0.json";
// GATE pick: margin-gated BOTH/STOCH. Returns {pi, fired}.
function u49GatePick(sn, gauss, uSamp) {
  let top1 = -1e30, top2 = -1e30;
  for (let c = 0; c < sn.length; c++) { if (sn[c] > top1) { top2 = top1; top1 = sn[c]; } else if (sn[c] > top2) { top2 = sn[c]; } }
  const margin = top1 - top2;
  if (margin < U49_M0) return { pi: u47BothPick(sn, gauss, uSamp), fired: 1 };
  let mx = sn[0]; for (let c = 1; c < sn.length; c++) if (sn[c] > mx) mx = sn[c];
  const e = sn.map((v) => Math.exp((v - mx) / U49_TEMP));
  let s = 0; for (const v of e) s += v;
  let acc = 0;
  for (let c = 0; c < e.length; c++) { acc += e[c] / s; if (uSamp < acc || c === e.length - 1) return { pi: c, fired: 0 }; }
  return { pi: e.length - 1, fired: 0 };
}
function u49TrainOneStep(M, params, opt, dataRng, fixedMasks, arm, qkCount, gateStat) {
  const B = 16, C = 6;
  let lsum = 0;
  for (let b = 0; b < B; b++) {
    const cands = [];
    for (let c = 0; c < C; c++) cands.push(u43DietSingle(dataRng));
    const sn = cands.map((e) => { const r = u43ScoreRow(M, e, qkCount, fixedMasks); return r.s * r.n; });
    const { gauss, uSamp } = u46AlignedDraws(dataRng);
    let pi = 0;
    if (arm === "det") { for (let c = 1; c < sn.length; c++) if (sn[c] > sn[pi]) pi = c; }
    else if (arm === "stoch") { pi = u46Pick(sn, gauss, uSamp, "stoch"); }
    else { const g = u49GatePick(sn, gauss, uSamp); pi = g.pi; if (gateStat) { gateStat.fired += g.fired; gateStat.n++; } }
    const pick = cands[pi];
    qkCount.set(pick.qk, (qkCount.get(pick.qk) || 0) + 1);
    lsum += u43StaticSlot(M, pick, b, B, fixedMasks);
  }
  return { loss: lsum / B };
}
globalThis.runU49Wave0 = async function (fs, log) {
  try { const prev = JSON.parse(await fs.readTextFile(U49_WAVE0_PATH)); if (prev && prev.verdict === "COMPLETE") { log(U49_WAVE0_PATH + " exists, skip"); return prev; } } catch (e) {}
  const twins = [];
  for (const arm of ["det", "stoch", "gate"]) {
    for (const s of [0, 1, 2]) {
      const X = await globalThis.u32FreshStack(fs, s);
      const Y = await globalThis.u32FreshStack(fs, s);
      const p0 = globalThis.u32MaxAbsDiff(globalThis.u32SnapshotParams(X.M), globalThis.u32SnapshotParams(Y.M));
      for (const p of X.params) p.g.fill(0);
      for (const p of Y.params) p.g.fill(0);
      const qx = new Map(), qy = new Map();
      u49TrainOneStep(X.M, X.params, X.opt, X.dataRng, X.fixedMasks, arm, qx, null);
      u49TrainOneStep(Y.M, Y.params, Y.opt, Y.dataRng, Y.fixedMasks, arm, qy, null);
      const st = globalThis.u32MaxAbsDiff(globalThis.u32SnapshotParams(X.M), globalThis.u32SnapshotParams(Y.M));
      twins.push({ arm, seed: s, p0diff: p0.max, step1diff: st.max, pass: p0.max === 0 && st.max === 0 });
      log("u49-wave0 twin " + arm + " s" + s + " p0=" + p0.max + " step1=" + st.max);
      if (p0.max !== 0 || st.max !== 0) throw new Error("U49 Wave-0 HALT: twin nondeterminism " + arm + " s" + s);
    }
  }
  const body = { spec: "self-u49-margate-prereg", wave: 0, verdict: "COMPLETE", twins, sigma: U49_SIGMA, temp: U49_TEMP, m0: U49_M0, deviations: [] };
  await fs.writeTextFile(U49_WAVE0_PATH, JSON.stringify(body));
  log("u49-wave0 twins PASS (3 arms x 3 seeds)");
  return body;
};
globalThis.runU49Train = async function (fs, log, opts) {
  const { seed, arm } = opts;
  if (!(arm in U49_ARMS)) throw new Error("arm must be det|stoch|gate");
  const ledgerPath = u49TrainPath(seed, arm);
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  const h = await globalThis.u33StackHash(fs);
  if (h.hex !== U49_EXPECT_STACK) throw new Error("U49-PIN HALT: stack drift " + h.hex.slice(0, 16));
  const drvSrc = await fs.readTextFile("src/evidence/decomp/newai-selfu49-driver.js");
  const drvHash = await u32Sha256Hex(drvSrc);
  const t = await globalThis.u32FreshStack(fs, seed);
  const P0 = globalThis.u32SnapshotParams(t.M);
  const qkCount = new Map();
  const gateStat = { fired: 0, n: 0 };
  const steps = 800, t0 = Date.now(), curve = [];
  const K = 5, lam = 2.0;
  for (let step = 0; step < steps; step++) {
    for (const p of t.params) p.g.fill(0);
    const r = u49TrainOneStep(t.M, t.params, t.opt, t.dataRng, t.fixedMasks, arm, qkCount, gateStat);
    const meanW = new Float64Array(t.M.Wh[0].v.length);
    for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) meanW[i] += t.M.Wh[k].v[i] / K;
    for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) t.M.Wh[k].g[i] += lam * (t.M.Wh[k].v[i] - meanW[i]) / (16 * t.M.H);
    let s = 0; for (const p of t.params) for (let i = 0; i < p.g.length; i++) s += p.g[i] * p.g[i];
    const n = Math.sqrt(s);
    if (n > 1.0) { const sc = 1.0 / n; for (const p of t.params) for (let i = 0; i < p.g.length; i++) p.g[i] *= sc; }
    t.opt.step(t.params);
    if (step % 100 === 0 || step === steps - 1) curve.push({ step, loss: +r.loss.toFixed(6) });
    if (step % 200 === 0) log("u49-train " + arm + " s" + seed + " step " + step + "/800 loss=" + r.loss.toFixed(4));
  }
  const P = globalThis.u32SnapshotParams(t.M);
  const gateRate = gateStat.n ? +(gateStat.fired / gateStat.n).toFixed(4) : 0;
  const body = {
    spec: "self-u49-margate-prereg", track: "U49-MARGATE", arm, seed, steps,
    B: 16, lr: 5e-3, K: 5, H: 48, C: 6, auxW: 0.5, lam: 2.0, sigma: U49_SIGMA, temp: U49_TEMP, m0: U49_M0,
    diet: "U46/U47 candidates + GainxNeed selection with aligned noise block (12+1 draws)",
    select: arm === "det" ? "pick-max s*n" : arm === "stoch" ? "softmax T=0.5 sampling" : "margin<0.3 ? BOTH : STOCH",
    verdict: "COMPLETE", stackHash: h.hex, stackFiles: h.perFile.map((f) => f.path), u49DriverHash: drvHash,
    wallMs: Date.now() - t0, curve, divCos: +inMeanCos(t.M).toFixed(4), gateRate, P0, P,
  };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("u49-train " + arm + " s" + seed + " COMPLETE loss0=" + curve[0].loss + " lossN=" + curve[curve.length - 1].loss + " gateRate=" + gateRate);
  return body;
};
globalThis.runU49Eval = async function (fs, log, opts) {
  const { seed, arm } = opts;
  const trainPath = u49TrainPath(seed, arm), evalPath = u49EvalPath(seed, arm);
  if (!opts.force) { try { const prev = JSON.parse(await fs.readTextFile(evalPath)); if (prev && prev.verdict === "COMPLETE") { log(evalPath + " exists, skip"); return prev; } } catch (e) {} }
  const G = await globalThis.IntrinsicInit(fs);
  const tr = JSON.parse(await fs.readTextFile(trainPath));
  if (tr.verdict !== "COMPLETE") throw new Error("train ledger missing " + trainPath);
  const cur = await globalThis.u33StackHash(fs);
  if (cur.hex !== tr.stackHash) throw new Error("U49-PIN HALT: stack drift since train " + trainPath);
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
    spec: "self-u49-margate-prereg", track: "U49-MARGATE", arm, seed, steps: 800,
    verdict: "COMPLETE", n: N, frozenTest: true, evalOf: trainPath, stackHash: cur.hex,
    accScratch: +(scr / N).toFixed(4), accTwo: +(two / N).toFixed(4),
    accOracle: +(orc / N).toFixed(4), accFwd: +(fF / N).toFixed(4),
  };
  await fs.writeTextFile(evalPath, JSON.stringify(body));
  log("u49-eval " + arm + " s" + seed + " scr=" + body.accScratch + " two=" + body.accTwo + " orc=" + body.accOracle);
  return body;
};
globalThis.runU49Verdict = async function (fs, log) {
  const arms = ["det", "stoch", "gate"];
  const T = {}, E = {};
  for (const seed of [0, 1, 2]) for (const arm of arms) {
    T[seed + arm] = JSON.parse(await fs.readTextFile(u49TrainPath(seed, arm)));
    E[seed + arm] = JSON.parse(await fs.readTextFile(u49EvalPath(seed, arm)));
  }
  const pin = [0, 1, 2].every((s) => arms.every((a) => T[s + a].stackHash === U49_EXPECT_STACK && E[s + a].stackHash === U49_EXPECT_STACK));
  const rows = [0, 1, 2].map((s) => {
    const r = { seed: s, gateRate: T[s + "gate"].gateRate };
    for (const a of arms) r[a] = { scr: E[s + a].accScratch, two: E[s + a].accTwo, orc: E[s + a].accOracle };
    return r;
  });
  let verdict = "", detail = "";
  const winMax = rows.map((r) => Math.max(r.det.two, r.stoch.two, r.gate.two));
  const floorBad = winMax.filter((v) => v < 0.45).length;
  const dGS = rows.map((r) => +(r.gate.two - r.stoch.two).toFixed(4));
  const nGS = dGS.filter((d) => d >= 0.03).length;
  const dSG = rows.map((r) => +(r.stoch.two - r.gate.two).toFixed(4));
  const nSG = dSG.filter((d) => d >= 0.03).length;
  const spread = rows.map((r) => Math.max(r.det.two, r.stoch.two, r.gate.two) - Math.min(r.det.two, r.stoch.two, r.gate.two));
  const nClose = spread.filter((v) => v <= 0.03).length;
  for (const r of rows) log("u49 s" + r.seed + " det=" + r.det.two + " stoch=" + r.stoch.two + " gate=" + r.gate.two + " dGS=" + (r.gate.two - r.stoch.two).toFixed(4) + " gateRate=" + r.gateRate);
  if (!pin) { verdict = "PIN-FAIL"; detail = "stack drift"; }
  else if (floorBad >= 2) { verdict = "INCONCLUSIVE"; detail = "max arm below floor on " + floorBad + "/3"; }
  else if (nGS >= 2) { verdict = "ADVANCE-GATE"; detail = "GATE>=STOCH+0.03 on " + nGS + "/3 — smart stacking wins"; }
  else if (nSG >= 2) { verdict = "DEAD-GATE"; detail = "STOCH>=GATE+0.03 on " + nSG + "/3 — even gated stacking fails"; }
  else { verdict = "DEAD"; detail = nClose >= 2 ? "all within 0.03 (close " + nClose + "/3) — gating changes nothing" : "no quorum (dGS " + dGS.join("/") + ") — no license"; }
  const body = { spec: "self-u49-margate-prereg", track: "U49-MARGATE", verdict, detail, pin, rows, sigma: U49_SIGMA, temp: U49_TEMP, m0: U49_M0 };
  await fs.writeTextFile(U49_VERDICT_PATH, JSON.stringify(body));
  log("u49-verdict " + verdict + " (" + detail + ")");
  return body;
};
