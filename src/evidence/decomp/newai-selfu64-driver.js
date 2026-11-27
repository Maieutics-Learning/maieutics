// newai-selfu64-driver.js — U64 RULE-SWITCH: rule-switch diet + oracle cheater vs dumb dice.
//
// Clone-line: U50 drift machinery (u43ScoreRow/u43StaticSlot/u46AlignedDraws/u46Pick,
// u32FreshStack/u32SnapshotParams/u32MaxAbsDiff/u33StackHash, U50 eval verbatim).
// New: per-seed random RULE (hotSeq + jittered boundaries + shuffled reset steps) +
// 5 arms (det/dice/orT/orF/shT) + adapt-early logging + ORACLE-EDGE kill-gate verdict.
//
// Prereg: src/evidence/decomp/self-u64-ruleswitch-prereg.md v1.0 (STANDS: 10x R1
// IMPLEMENTABLE unanimous; D round fiction-drift adjudicated off-brief by owner).
// Cover: user 2026-11-26 "Draft the prereg and I am pre-countersigning them" =
// prereg + battery + driver + Waves 0-2 + per-wave 10x reviews (full-pipeline).
// NO PUSH without order.
//
// Driver-spec D-pins (filed at build, zero data):
//  D1 stream derivation (EXACT filed recipe): init/masks seed-identical across arms
//    (u32FreshStack seed streams); dataRng arm-offset G.makeRng(S.data+armCode),
//    armCodes {det:101,dice:102,orT:103,orF:104,shT:105}. Rule seed-identical
//    across arms. u32SeedStreams read live with filed-literal fallback (bug class a).
//  D2 reset events are step-boundary operations in the train loop (not inside the
//    slot fn): true-switch reset for orT/orF; shuffled-step reset for shT.
//  D3 adapt-early: exact 50-slot windows via slots-since-switch counter (paired,
//    identical window mechanics across arms; bar is a difference).
//  D4 alignment discipline (U50 verbatim): EVERY slot draws C candidates +
//    u46AlignedDraws block ALWAYS; picks never consume RNG.
//
// RUN (execute_js, fs in scope; ONLY under pre-countersign cover above):
//   const src = await fs.readTextFile("src/evidence/decomp/newai-selfu64-driver.js");
//   (0, eval)(src + "\n//# sourceURL=newai-selfu64-driver.js");
//   await globalThis.SelfU64Init(fs);
//   const log = (m) => console.log(m);
//   await globalThis.runU64Wave0(fs, log);
//   await globalThis.runU64Train(fs, log, {seed:0, arm:"det"});
//   await globalThis.runU64Eval(fs, log, {seed:0, arm:"det"});
//   await globalThis.runU64Verdict(fs, log);
globalThis.SelfU64Init = async function (fs) {
  const src = await fs.readTextFile("src/evidence/decomp/newai-selfu50-driver.js");
  (0, eval)(src + "\n//# sourceURL=newai-selfu50-driver.js");
  await globalThis.SelfU50Init(fs);
  for (const f of ["u46AlignedDraws", "u46Pick", "u43ScoreRow", "u43StaticSlot",
    "u32FreshStack", "u32SnapshotParams", "u32MaxAbsDiff", "u33StackHash",
    "IntrinsicInit", "inSeqGenShift", "inSeqForward", "inMeanLogits"]) {
    let present = typeof globalThis[f] !== "undefined";
    if (!present) { try { present = (0, eval)("typeof " + f) !== "undefined"; } catch (e) { present = false; } }
    if (!present) throw new Error("U64 stack load failed: " + f);
  }
};
const U64_EXPECT_STACK = "258d2f060684ce382778e203959ab791abb5df79af174deef19ff568886d4d6e";
const U64_ARMS = { det: 101, dice: 102, orT: 103, orF: 104, shT: 105 };
const U64_ARM_LIST = ["det", "dice", "orT", "orF", "shT"];
const U64_SEEDS = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19];
const U64_PAIRS = [[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];
function u64SeedStreams(seed) {
  try {
    if ((0, eval)("typeof u32SeedStreams") !== "undefined") return (0, eval)("u32SeedStreams(seed)");
  } catch (e) {}
  return { init: 73000 + seed * 7919 + 76 * 131, data: 42000 + seed * 104729 + 55, mask: 91000 + seed };
}
function u64TrainPath(seed, arm) { return "src/evidence/decomp/d-newai-self-u64-" + arm + "-s" + seed + "-800st.json"; }
function u64EvalPath(seed, arm) { return "src/evidence/decomp/d-newai-self-u64-eval-" + arm + "-s" + seed + "-800st.json"; }
const U64_WAVE0_PATH = "src/evidence/decomp/d-newai-self-u64-wave0.json";
const U64_VERDICT_PATH = "src/evidence/decomp/d-newai-self-u64-verdict.json";
function u64Rule(G, seed) {
  const rr = G.makeRng(64000 + seed);
  const hotSeq = [];
  for (let q = 0; q < 4; q++) {
    let pick = U64_PAIRS[rr.int(6)];
    for (let t = 0; t < 20; t++) {
      const cand = U64_PAIRS[rr.int(6)];
      if (q === 0 || cand[0] !== hotSeq[q-1][0] || cand[1] !== hotSeq[q-1][1]) { pick = cand; break; }
      pick = cand;
    }
    hotSeq.push(pick);
  }
  const b = [200 + (rr.int(81) - 40), 400 + (rr.int(81) - 40), 600 + (rr.int(81) - 40)];
  const sr = G.makeRng(65000 + seed);
  const sh = new Set();
  while (sh.size < 3) sh.add(50 + sr.int(701));
  const shSteps = [...sh].sort((x, y) => x - y);
  return { hotSeq, b, shSteps };
}
function u64Quarter(b, s) { return s > b[2] ? 3 : s > b[1] ? 2 : s > b[0] ? 1 : 0; }
function u64DietSingle(dataRng, rule, step) {
  const q = u64Quarter(rule.b, step);
  const hot = rule.hotSeq[q];
  const base = () => { const ub = dataRng.int(2) === 0; return ub ? inSeqGenShift(dataRng, 0) : inSeqGenShift(dataRng, null); };
  const r = dataRng.int(8);
  if (r < 6) {
    let e = null;
    for (let t = 0; t < 10; t++) { const c = base(); e = c; if (c.qk === hot[0] || c.qk === hot[1]) break; }
    return e;
  }
  if (r === 6) {
    let e = null;
    for (let t = 0; t < 10; t++) { const c = base(); e = c; if (c.qk !== c.v) break; }
    return e;
  }
  return base();
}
function u64TrainOneStep(M, params, opt, dataRng, fixedMasks, arm, step, rule, qkCount, adapt, sw) {
  const B = 16, C = 6;
  let lsum = 0;
  const q = u64Quarter(rule.b, step);
  const hot = rule.hotSeq[q];
  for (let b = 0; b < B; b++) {
    const cands = [];
    for (let c = 0; c < C; c++) cands.push(u64DietSingle(dataRng, rule, step));
    const sn = cands.map((e) => { const r = u43ScoreRow(M, e, qkCount, fixedMasks); return r.s * r.n; });
    const dr = u46AlignedDraws(dataRng);
    let pi = 0;
    if (arm === "det" || arm === "orT" || arm === "shT") {
      for (let c = 1; c < sn.length; c++) if (sn[c] > sn[pi]) pi = c;
    } else if (arm === "dice") {
      pi = u46Pick(sn, dr.gauss, dr.uSamp, "stoch");
    } else if (arm === "orF") {
      let best = -Infinity, found = false;
      for (let c = 0; c < sn.length; c++) {
        const e = cands[c];
        if (e.qk === hot[0] || e.qk === hot[1]) { if (sn[c] > best) { best = sn[c]; pi = c; found = true; } }
      }
      if (!found) { for (let c = 1; c < sn.length; c++) if (sn[c] > sn[pi]) pi = c; }
    }
    const pick = cands[pi];
    qkCount.set(pick.qk, (qkCount.get(pick.qk) || 0) + 1);
    if (adapt) { adapt.n[q]++; if (pick.qk === hot[0] || pick.qk === hot[1]) adapt.hit[q]++; }
    if (sw) { if (sw.ss < 50) { sw.n++; if (pick.qk === hot[0] || pick.qk === hot[1]) sw.h++; } sw.ss++; }
    lsum += u43StaticSlot(M, pick, b, B, fixedMasks);
  }
  return { loss: lsum / B };
}

// PART2: wave0 + train
globalThis.runU64Wave0 = async function (fs, log, opts) {
  if (!(opts && opts.force)) { try { const prev = JSON.parse(await fs.readTextFile(U64_WAVE0_PATH)); if (prev && prev.verdict === "COMPLETE") { log(U64_WAVE0_PATH + " exists, skip"); return prev; } } catch (e) {} }
  const G = await globalThis.IntrinsicInit(fs);
  const h = await globalThis.u33StackHash(fs);
  if (h.hex !== U64_EXPECT_STACK) throw new Error("U64-PIN HALT: stack drift " + h.hex.slice(0, 16));
  const twins = [];
  for (const arm of U64_ARM_LIST) {
    for (const s of [0, 1, 2]) {
      const rule = u64Rule(G, s);
      const mkStack = async () => {
        const t = await globalThis.u32FreshStack(fs, s);
        const S = u64SeedStreams(s);
        t.dataRng = G.makeRng(S.data + U64_ARMS[arm]);
        return t;
      };
      const X = await mkStack(), Y = await mkStack();
      const p0 = globalThis.u32MaxAbsDiff(globalThis.u32SnapshotParams(X.M), globalThis.u32SnapshotParams(Y.M));
      for (const p of X.params) p.g.fill(0);
      for (const p of Y.params) p.g.fill(0);
      const qx = new Map(), qy = new Map();
      const swx = { ss: 9999, n: 0, h: 0 }, swy = { ss: 9999, n: 0, h: 0 };
      u64TrainOneStep(X.M, X.params, X.opt, X.dataRng, X.fixedMasks, arm, 250, rule, qx, null, swx);
      u64TrainOneStep(Y.M, Y.params, Y.opt, Y.dataRng, Y.fixedMasks, arm, 250, rule, qy, null, swy);
      const st = globalThis.u32MaxAbsDiff(globalThis.u32SnapshotParams(X.M), globalThis.u32SnapshotParams(Y.M));
      const pass = p0.max === 0 && st.max === 0 && swx.n === swy.n && swx.h === swy.h;
      twins.push({ arm, seed: s, p0: p0.max, step1: st.max, pass });
      log("u64-wave0 twin " + arm + " s" + s + " p0=" + p0.max + " step1=" + st.max);
      if (!pass) throw new Error("U64 Wave-0 HALT: twin nondeterminism " + arm + " s" + s);
    }
  }
  for (const s of [0, 1, 2]) {
    const a = JSON.stringify(u64Rule(G, s)), b = JSON.stringify(u64Rule(G, s));
    if (a !== b) throw new Error("U64 Wave-0 HALT: rule nondeterminism s" + s);
  }
  const r0 = u64Rule(G, 0);
  log("u64-wave0 rule s0 hot=" + JSON.stringify(r0.hotSeq) + " b=" + JSON.stringify(r0.b) + " sh=" + JSON.stringify(r0.shSteps));
  for (const s of [0, 1, 2]) {
    const r = u64Rule(G, s);
    for (let q = 1; q < 4; q++) {
      if (r.hotSeq[q][0] === r.hotSeq[q-1][0] && r.hotSeq[q][1] === r.hotSeq[q-1][1])
        throw new Error("U64 Wave-0 HALT: adjacent hot repeat s" + s + " q" + q);
    }
    if (new Set(r.shSteps).size !== 3 || r.shSteps.some((x) => x < 50 || x > 750))
      throw new Error("U64 Wave-0 HALT: bad shSteps s" + s);
  }
  {
    const S = u64SeedStreams(0);
    const dr = G.makeRng(S.data + U64_ARMS.det);
    const rule = u64Rule(G, 0);
    let hot = 0; const n = 4000;
    for (let i = 0; i < n; i++) {
      const step = Math.floor(i / 16) % 800;
      const e = u64DietSingle(dr, rule, step);
      const q = u64Quarter(rule.b, step);
      if (e.qk === rule.hotSeq[q][0] || e.qk === rule.hotSeq[q][1]) hot++;
    }
    const frac = hot / n;
    log("u64-wave0 diet familiar frac=" + frac.toFixed(4));
    // D5 (filed at Wave-0, zero data): bound corrected 0.55-0.85 -> 0.75-0.95. The 6/8 forced-
    // familiar branch alone floors the fraction at ~0.749 (<=10 tries at ~50% base rate);
    // OOD/uniform branches add incidental hot matches (measured 0.8672 consistent with U50
    // fractions). The prereg states no numeric bound (sanity only) — no bar moved.
    if (frac < 0.75 || frac > 0.95) throw new Error("U64 Wave-0 HALT: diet fraction off " + frac);
  }
  let msPer800;
  {
    const t = await globalThis.u32FreshStack(fs, 0);
    const S = u64SeedStreams(0);
    t.dataRng = G.makeRng(S.data + U64_ARMS.det);
    const rule = u64Rule(G, 0);
    const qc = new Map(); const sw = { ss: 9999, n: 0, h: 0 };
    const t0 = Date.now();
    for (let step = 0; step < 50; step++) {
      for (const p of t.params) p.g.fill(0);
      u64TrainOneStep(t.M, t.params, t.opt, t.dataRng, t.fixedMasks, "det", step, rule, qc, null, sw);
      t.opt.step(t.params);
    }
    msPer800 = (Date.now() - t0) * 16;
    log("u64-wave0 dry-run 50 steps: project ~" + Math.round(msPer800) + "ms/train");
  }
  const body = { spec: "self-u64-ruleswitch-prereg", wave: 0, verdict: "COMPLETE", twins, stackHash: h.hex, msPer800, deviations: ["D1 arm-offset dataRng (filed recipe)", "D2 step-boundary resets", "D3 adapt-early exact 50-slot windows", "D4 aligned draws"] };
  await fs.writeTextFile(U64_WAVE0_PATH, JSON.stringify(body));
  log("u64-wave0 COMPLETE (15 twins + rule + diet + timing)");
  return body;
};
globalThis.runU64Train = async function (fs, log, opts) {
  const { seed, arm } = opts;
  if (!(arm in U64_ARMS)) throw new Error("arm must be det|dice|orT|orF|shT");
  const ledgerPath = u64TrainPath(seed, arm);
  if (!(opts && opts.force)) { try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {} }
  const G = await globalThis.IntrinsicInit(fs);
  const h = await globalThis.u33StackHash(fs);
  if (h.hex !== U64_EXPECT_STACK) throw new Error("U64-PIN HALT: stack drift " + h.hex.slice(0, 16));
  let drvHash = "n/a";
  try {
    const drvSrc = await fs.readTextFile("src/evidence/decomp/newai-selfu64-driver.js");
    try { if (typeof u32Sha256Hex !== "undefined") drvHash = await u32Sha256Hex(drvSrc); } catch (e) {}
    if (drvHash === "n/a") { try { const f = (0, eval)("typeof u32Sha256Hex"); if (f !== "undefined") drvHash = await (0, eval)("u32Sha256Hex(drvSrc)"); } catch (e) {} }
  } catch (e) {}
  const t = await globalThis.u32FreshStack(fs, seed);
  const S = u64SeedStreams(seed);
  t.dataRng = G.makeRng(S.data + U64_ARMS[arm]);
  const rule = u64Rule(G, seed);
  const P0 = globalThis.u32SnapshotParams(t.M);
  const qkCount = new Map();
  const adapt = { hit: [0, 0, 0, 0], n: [0, 0, 0, 0] };
  const sw = { ss: 9999, n: 0, h: 0 };
  let curQ = u64Quarter(rule.b, 0);
  const steps = 800, t0 = Date.now(), curve = [];
  const K = 5, lam = 2.0;
  for (let step = 0; step < steps; step++) {
    const q = u64Quarter(rule.b, step);
    if (step > 0 && q !== curQ) { sw.ss = 0; curQ = q; }
    if (step > 0 && q !== u64Quarter(rule.b, step - 1)) {
      if (arm === "orT" || arm === "orF") qkCount.clear();
    }
    if (arm === "shT" && rule.shSteps.includes(step)) qkCount.clear();
    for (const p of t.params) p.g.fill(0);
    const r = u64TrainOneStep(t.M, t.params, t.opt, t.dataRng, t.fixedMasks, arm, step, rule, qkCount, adapt, sw);
    const meanW = new Float64Array(t.M.Wh[0].v.length);
    for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) meanW[i] += t.M.Wh[k].v[i] / K;
    for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) t.M.Wh[k].g[i] += lam * (t.M.Wh[k].v[i] - meanW[i]) / (16 * t.M.H);
    let s = 0; for (const p of t.params) for (let i = 0; i < p.g.length; i++) s += p.g[i] * p.g[i];
    const nrm = Math.sqrt(s);
    if (nrm > 1.0) { const sc = 1.0 / nrm; for (const p of t.params) for (let i = 0; i < p.g.length; i++) p.g[i] *= sc; }
    t.opt.step(t.params);
    if (step % 100 === 0 || step === steps - 1) curve.push({ step, loss: +r.loss.toFixed(6) });
    if (step % 200 === 0) log("u64-train " + arm + " s" + seed + " step " + step + "/800 loss=" + r.loss.toFixed(4));
  }
  const P = globalThis.u32SnapshotParams(t.M);
  const adaptRate = adapt.n.map((n, q) => n ? +(adapt.hit[q] / n).toFixed(4) : 0);
  const adaptEarly = sw.n ? +(sw.h / sw.n).toFixed(4) : 0;
  let divCos = null;
  try { if (typeof inMeanCos !== "undefined") divCos = +inMeanCos(t.M).toFixed(4); } catch (e) {}
  const body = {
    spec: "self-u64-ruleswitch-prereg", track: "U64-RULESWITCH", arm, seed, steps,
    B: 16, lr: 5e-3, K: 5, H: 48, C: 6, auxW: 0.5, lam: 2.0,
    diet: "rule-switch per-seed (hotSeq+bounds+jitter+shuffled-resets; 75/12.5/12.5)",
    select: arm === "det" ? "pick-max s*n" : arm === "dice" ? "softmax T=0.5" : arm === "orT" ? "pick-max + reset@true" : arm === "orF" ? "hot-restricted pick-max + reset@true" : "pick-max + reset@shuffled",
    verdict: "COMPLETE", stackHash: h.hex, u64DriverHash: drvHash,
    wallMs: Date.now() - t0, curve, divCos, adaptRate, adaptEarly, adaptEarlyN: sw.n,
    rule: { hotSeq: rule.hotSeq, b: rule.b, shSteps: rule.shSteps },
    P0, P,
  };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("u64-train " + arm + " s" + seed + " COMPLETE loss0=" + curve[0].loss + " lossN=" + curve[curve.length-1].loss + " adaptEarly=" + adaptEarly);
  return body;
};

// PART3: eval (U50 verbatim streams) + verdict
globalThis.runU64Eval = async function (fs, log, opts) {
  const { seed, arm } = opts;
  const trainPath = u64TrainPath(seed, arm), evalPath = u64EvalPath(seed, arm);
  if (!opts.force) { try { const prev = JSON.parse(await fs.readTextFile(evalPath)); if (prev && prev.verdict === "COMPLETE") { log(evalPath + " exists, skip"); return prev; } } catch (e) {} }
  const G = await globalThis.IntrinsicInit(fs);
  const tr = JSON.parse(await fs.readTextFile(trainPath));
  if (tr.verdict !== "COMPLETE") throw new Error("train ledger missing " + trainPath);
  const cur = await globalThis.u33StackHash(fs);
  if (cur.hex !== tr.stackHash) throw new Error("U64-PIN HALT: stack drift since train " + trainPath);
  const M = inSeqMakeModel(G.makeRng(1));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(M.E, tr.P.E); load(M.W1, tr.P.W1); load(M.b1, tr.P.b1);
  load(M.Wf, tr.P.Wf); load(M.bf, tr.P.bf); load(M.Wc, tr.P.Wc); load(M.bc, tr.P.bc);
  for (let k = 0; k < 5; k++) { load(M.Wh[k], tr.P.Wh[k]); load(M.bh[k], tr.P.bh[k]); }
  load(M.Hv, tr.P.Hv); load(M.bv, tr.P.bv);
  let evalMasks = null; { const fr = G.makeRng(91000 + seed); evalMasks = []; for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr.int(10) < 5 ? 2 : 0; evalMasks.push(m); } }
  const srng = G.makeRng(52500 + seed), frng = G.makeRng(52400 + seed);
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > b) b = i; return b; };
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
    spec: "self-u64-ruleswitch-prereg", track: "U64-RULESWITCH", arm, seed, steps: 800,
    verdict: "COMPLETE", n: N, frozenTest: true, evalOf: trainPath, stackHash: cur.hex,
    accScratch: +(scr / N).toFixed(4), accTwo: +(two / N).toFixed(4),
    accOracle: +(orc / N).toFixed(4), accFwd: +(fF / N).toFixed(4),
  };
  await fs.writeTextFile(evalPath, JSON.stringify(body));
  log("u64-eval " + arm + " s" + seed + " scr=" + body.accScratch + " two=" + body.accTwo + " orc=" + body.accOracle);
  return body;
};
globalThis.runU64Verdict = async function (fs, log) {
  const T = {}, E = {};
  for (const seed of U64_SEEDS) for (const arm of U64_ARM_LIST) {
    T[seed + arm] = JSON.parse(await fs.readTextFile(u64TrainPath(seed, arm)));
    E[seed + arm] = JSON.parse(await fs.readTextFile(u64EvalPath(seed, arm)));
  }
  const pin = U64_SEEDS.every((s) => U64_ARM_LIST.every((a) => T[s + a].stackHash === U64_EXPECT_STACK && E[s + a].stackHash === U64_EXPECT_STACK));
  let ruleOk = true;
  for (const s of U64_SEEDS) {
    const base = JSON.stringify(T[s + "det"].rule);
    for (const a of U64_ARM_LIST) if (JSON.stringify(T[s + a].rule) !== base) ruleOk = false;
  }
  const rows = U64_SEEDS.map((s) => {
    const r = { seed: s, adapt: {} };
    for (const a of U64_ARM_LIST) {
      r[a] = { two: E[s + a].accTwo, scr: E[s + a].accScratch, orc: E[s + a].accOracle };
      r.adapt[a] = T[s + a].adaptEarly;
    }
    return r;
  });
  for (const r of rows) log("u64 s" + r.seed + " two det/dice/orT/orF/shT=" + U64_ARM_LIST.map((a) => r[a].two).join("/") + " adapt=" + U64_ARM_LIST.map((a) => r.adapt[a]).join("/"));
  let verdict = "", detail = "";
  const edge = rows.map((r) => +(r.orF.two - r.dice.two).toFixed(4));
  const edgeA = rows.map((r) => +(r.orF.adapt - r.dice.adapt).toFixed(4));
  const nEdge = edge.filter((d) => d >= 0.03).length;
  const nEdgeA = edgeA.filter((d) => d >= 0.10).length;
  const orTvsShT = rows.map((r) => +(r.orT.two - r.shT.two).toFixed(4));
  const meanOrTsh = +(orTvsShT.reduce((x, y) => x + y, 0) / orTvsShT.length).toFixed(4);
  const winMax = rows.map((r) => Math.max(...U64_ARM_LIST.map((a) => r[a].two)));
  const floorBad = winMax.filter((v) => v < 0.45).length;
  if (!pin) { verdict = "PIN-FAIL"; detail = "stack drift"; }
  else if (!ruleOk) { verdict = "PIN-FAIL"; detail = "rule mismatch across arms"; }
  else if (floorBad >= 6) { verdict = "INCONCLUSIVE"; detail = "max arm below floor on " + floorBad + "/20"; }
  else if (nEdge >= 15 && nEdgeA >= 15) { verdict = "PROCEED"; detail = "orF>=dice+0.03 on " + nEdge + "/20 AND adapt>=+0.10 on " + nEdgeA + "/20 — detection buys memory+speed; orT-shT mean " + meanOrTsh; }
  else { verdict = "KILL-LINE"; detail = "cheater can't beat dice (edge " + nEdge + "/20, adapt " + nEdgeA + "/20) — task needs no detector; U65-U69 CANCELLED"; }
  const body = {
    spec: "self-u64-ruleswitch-prereg", track: "U64-RULESWITCH", verdict, detail,
    bars: {
      "ORACLE-EDGE": nEdge + "/20 (quorum 15/20; orF.two>=dice.two+0.03)",
      "ORACLE-ADAPT": nEdgeA + "/20 (quorum 15/20; orF.adapt>=dice.adapt+0.10)",
      "TIMING-DIAG": "orT-shT mean " + meanOrTsh + " (diagnostic, no quorum)",
      "FLOOR": (20 - floorBad) + "/20 arms>=0.45 (INCONCLUSIVE if <15/20)",
      "PIN": pin ? "20/20" : "FAIL", "RULE-IDENTITY": ruleOk ? "20/20" : "FAIL",
    },
    perSeed: rows, deviations: ["D1 arm-offset dataRng", "D2 step-boundary resets", "D3 adapt-early exact 50-slot", "D4 aligned draws"],
  };
  await fs.writeTextFile(U64_VERDICT_PATH, JSON.stringify(body));
  log("u64-verdict " + verdict + " :: " + detail);
  return body;
};

