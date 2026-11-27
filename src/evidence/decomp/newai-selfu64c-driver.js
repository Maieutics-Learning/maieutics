// newai-selfu64c-driver.js — U64c RESPONSE (E-NE0d): one new oracle-triggered arm, old exam.
//
// Prereg: src/evidence/decomp/self-u64c-response-prereg.md v1.3 STANDS (battery CLOSED:
// barrage v1.0 + round-2 (7 PATCH + audit) + round-3 (verdict-split, K-by-revealed-effect,
// drag sentence) + RED round v1.3: TRACK-KILLER ADOPTED (explore-tax ~0.08 vs +0.10 bar
// -> RESPONSE-DEAD by construction; EDGE washed out) + R9 mechanical (a)/(b) rule.
// Cover: owner 2026-11-27 "all 3 (for posterities sake)" = compute LICENSED as filed
// v1.3 by OVERRIDE of the kill recommendation (kill finding STANDS; run for posterity).
// NO PUSH. Log everything.
//
// Design (filed): detT = det policy (pick-max s*n, NO reset) + at each of the 3 TRUE
// boundaries: qkCount.clear() + UNIFORM explore K=10 steps then exploit. Explore picks
// uniform over 4 qk from DEDICATED exploreRng G.makeRng(53400+seed) (diet sampling
// policy-independent — candidates still diet-mix, only SELECTION is uniform-target).
// Worlds identical: ruleRng 64000+seed verbatim, diet U64-verbatim, config 800st H48/
// B16/lr5e-3/K5/C6/auxW0.5/lam2.0. Exam OLD verbatim (streams 52500/52400, masks
// 91000+seed, N=200). Dice/det/orT filed ledgers reused reads-only (no recompute).
//
// Implementation choices filed here (J1..J5):
//  J1 explore pick: target = exploreRng.int(4); FIRST candidate with qk==target, else
//     pick-max fallback (fallback logged per seed as exploreFallback). Target uniform ->
//     "picks uniform over 4 qk" up to fallback dilution; in-window hit ~= 0.5 (filed).
//  J2 explore window: switch step + next 9 (10 steps = b[i]+1 .. b[i]+10); ALL B=16 picks
//     per explore step are explore picks (K=10 counts STEPS; K-coverage "10 picks" is
//     loose derivation language — revealed-effect clause governs, data judges).
//     Trigger timing mirrors orT (before the step's draws). qkCount updates normally
//     during explore (selection-only change).
//  J3 adapt counting unchanged (explore slots inside first-50 windows score ~0.5 —
//     filed first-order drag, bar conservative for detT).
//  J4 twin: p0=0 + p300=0 exact + explore-pick-log equality (exceeds filed single-step
//     gate; gate only). exploreRng consumption identical by construction.
//  J5 R9 mechanical reading (ambiguity resolved, reasons here): orT_effect = (mean
//     orT-two − det-two >= 0.03) OR (mean orT-adapt − det-adapt >= 0.10); detT_effect =
//     same with detT. (b) iff orT_effect AND NOT detT_effect (reset-helps-explore-hurts);
//     else (a) (jointly void). Means over 20 seeds, filed dice/det/orT ledgers +
//     measured detT. Reported as AMBIGUOUS-MECH note; verdict stands.
//
// RUN (execute_js, fs in scope; ONLY under owner countersign above):
//   const src = await fs.readTextFile("src/evidence/decomp/newai-selfu64c-driver.js");
//   (0, eval)(src + "\n//# sourceURL=newai-selfu64c-driver.js");
//   await globalThis.SelfU64cInit(fs);
//   const log = (m) => console.log(m);
//   await globalThis.runU64cWave0(fs, log);
//   await globalThis.runU64cWave1(fs, log);
//   await globalThis.runU64cWave2(fs, log);
globalThis.SelfU64cInit = async function (fs) {
  const src = await fs.readTextFile("src/evidence/decomp/newai-selfu64-driver.js");
  (0, eval)(src + "\n//# sourceURL=newai-selfu64-driver.js");
  await globalThis.SelfU64Init(fs);
  for (const f of ["u64Rule", "u64Quarter", "u64DietSingle", "u64SeedStreams",
    "u43ScoreRow", "u43StaticSlot", "u46AlignedDraws", "u46Pick", "u33StackHash",
    "u32FreshStack", "u32SnapshotParams", "u32MaxAbsDiff", "inSeqMakeModel",
    "inSeqForward", "inMeanLogits", "inSeqGenShift"]) {
    let present = typeof globalThis[f] !== "undefined";
    if (!present) { try { present = (0, eval)("typeof " + f) !== "undefined"; } catch (e) { present = false; } }
    if (!present) throw new Error("U64c stack load failed: " + f);
  }
  // NOTE (U64b lesson): U64 driver `const` bindings do NOT leak from indirect eval.
  // Values needed here are re-declared locally (U64C_*); U64 driver SOURCE is hashed
  // into ledgers via u64DriverHash pattern (reads-only reference, no drift).
};
const U64C_STACK_LOCAL = "258d2f060684ce382778e203959ab791abb5df79af174deef19ff568886d4d6e";
const U64C_DETT = 106, U64C_K = 10, U64C_EXPLORE_BASE = 53400;
const U64C_SEEDS = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19];
const U64C_WAVE0_PATH = "src/evidence/decomp/d-newai-self-u64c-wave0.json";
const U64C_VERDICT_PATH = "src/evidence/decomp/d-newai-self-u64c-verdict.json";
function u64cTrainPath(seed) { return "src/evidence/decomp/d-newai-self-u64c-detT-s" + seed + "-800st.json"; }
function u64cEvalPath(seed) { return "src/evidence/decomp/d-newai-self-u64c-eval-detT-s" + seed + "-800st.json"; }
function u64cFiledTrainPath(arm, seed) { return "src/evidence/decomp/d-newai-self-u64-" + arm + "-s" + seed + "-800st.json"; }
function u64cFiledEvalPath(arm, seed) { return "src/evidence/decomp/d-newai-self-u64-eval-" + arm + "-s" + seed + "-800st.json"; }
// One detT train step (U64 body verbatim except J1/J2 explore selection).
function u64cTrainOneStep(M, params, opt, dataRng, fixedMasks, step, rule, qkCount, adapt, sw, ex) {
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
    if (ex.left > 0) {
      const target = ex.rng.int(4);
      let found = -1;
      for (let c = 0; c < C; c++) if (cands[c].qk === target) { found = c; break; }
      if (found >= 0) { pi = found; }
      else { for (let c = 1; c < sn.length; c++) if (sn[c] > sn[pi]) pi = c; ex.fallback++; }
      ex.picks++;
      if (cands[pi].qk === hot[0] || cands[pi].qk === hot[1]) ex.hits++;
    } else {
      for (let c = 1; c < sn.length; c++) if (sn[c] > sn[pi]) pi = c;
    }
    const pick = cands[pi];
    qkCount.set(pick.qk, (qkCount.get(pick.qk) || 0) + 1);
    if (adapt) { adapt.n[q]++; if (pick.qk === hot[0] || pick.qk === hot[1]) adapt.hit[q]++; }
    if (sw) { if (sw.ss < 50) { sw.n++; if (pick.qk === hot[0] || pick.qk === hot[1]) sw.h++; } sw.ss++; }
    lsum += u43StaticSlot(M, pick, b, B, fixedMasks);
  }
  return { loss: lsum / B };
}
// Shared core: fresh stack -> train maxSteps steps. Returns {snapN, adapt, exLog, rule}.
async function u64cTrainCore(G, fs, seed, maxSteps) {
  const t = await globalThis.u32FreshStack(fs, seed);
  const S = u64SeedStreams(seed);
  t.dataRng = G.makeRng(S.data + U64C_DETT);
  const rule = u64Rule(G, seed);
  const exRng = G.makeRng(U64C_EXPLORE_BASE + seed);
  const ex = { left: 0, rng: exRng, picks: 0, hits: 0, fallback: 0 };
  const qkCount = new Map();
  const adapt = { hit: [0, 0, 0, 0], n: [0, 0, 0, 0] };
  const sw = { ss: 9999, n: 0, h: 0 };
  let curQ = u64Quarter(rule.b, 0);
  const K = 5, lam = 2.0;
  const exLog = [];
  for (let step = 0; step < maxSteps; step++) {
    const q = u64Quarter(rule.b, step);
    if (step > 0 && q !== curQ) { sw.ss = 0; curQ = q; }
    if (step > 0 && q !== u64Quarter(rule.b, step - 1)) { qkCount.clear(); ex.left = U64C_K; }
    for (const p of t.params) p.g.fill(0);
    const before = ex.picks;
    const r = u64cTrainOneStep(t.M, t.params, t.opt, t.dataRng, t.fixedMasks, step, rule, qkCount, adapt, sw, ex);
    if (ex.left > 0) { exLog.push({ step, picks: ex.picks - before }); ex.left--; }
    const meanW = new Float64Array(t.M.Wh[0].v.length);
    for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) meanW[i] += t.M.Wh[k].v[i] / K;
    for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) t.M.Wh[k].g[i] += lam * (t.M.Wh[k].v[i] - meanW[i]) / (16 * t.M.H);
    let s = 0; for (const p of t.params) for (let i = 0; i < p.g.length; i++) s += p.g[i] * p.g[i];
    const nrm = Math.sqrt(s);
    if (nrm > 1.0) { const sc = 1.0 / nrm; for (const p of t.params) for (let i = 0; i < p.g.length; i++) p.g[i] *= sc; }
    t.opt.step(t.params);
    if (step === maxSteps - 1 || (maxSteps > 400 && step % 200 === 0)) { /* progress logged by caller */ }
  }
  return { snap: globalThis.u32SnapshotParams(t.M), adapt, sw, ex, exLog, rule, S };
}
globalThis.runU64cWave0 = async function (fs, log, opts) {
  if (!(opts && opts.force)) { try { const prev = JSON.parse(await fs.readTextFile(U64C_WAVE0_PATH)); if (prev && prev.verdict === "COMPLETE") { log(U64C_WAVE0_PATH + " exists, skip"); return prev; } } catch (e) { /* eslint-disable-line */ } }
  const G = await globalThis.IntrinsicInit(fs);
  const h = await globalThis.u33StackHash(fs);
  if (h.hex !== U64C_STACK_LOCAL) throw new Error("U64c-PIN HALT: stack drift " + h.hex.slice(0, 16));
  // PIN: stack literal (trunks come in W1; here PIN the apparatus).
  // 3-seed twin determinism through step 300 (covers first boundary + explore).
  const twins = [];
  for (const s of [0, 1, 2]) {
    const A = await u64cTrainCore(G, fs, s, 300);
    const B = await u64cTrainCore(G, fs, s, 300);
    const d0 = globalThis.u32MaxAbsDiff(A.snap, B.snap);
    const exSame = JSON.stringify(A.exLog) === JSON.stringify(B.exLog);
    // p0 check: two fresh stacks identical before any step.
    const X = await globalThis.u32FreshStack(fs, s), Y = await globalThis.u32FreshStack(fs, s);
    const p0 = globalThis.u32MaxAbsDiff(globalThis.u32SnapshotParams(X.M), globalThis.u32SnapshotParams(Y.M));
    const pass = p0.max === 0 && d0.max === 0 && exSame;
    twins.push({ seed: s, p0: p0.max, p300: d0.max, exSame, exPicks: A.ex.picks, exHits: A.ex.hits, pass });
    log("u64c-wave0 twin s" + s + " p0=" + p0.max + " p300=" + d0.max + " exPicks=" + A.ex.picks + " exHits=" + A.ex.hits + " pass=" + pass);
    if (!pass) throw new Error("U64c Wave-0 HALT: twin nondeterminism s" + s);
  }
  // Rule-ID vs filed (3/3): detT rules must equal filed U64 det rules (world-identical).
  for (const s of [0, 1, 2]) {
    const mine = u64Rule(G, s);
    const filed = JSON.parse(await fs.readTextFile(u64cFiledTrainPath("det", s))).rule;
    if (JSON.stringify(filed.hotSeq) !== JSON.stringify(mine.hotSeq) || JSON.stringify(filed.b) !== JSON.stringify(mine.b) || JSON.stringify(filed.shSteps) !== JSON.stringify(mine.shSteps)) throw new Error("U64c Wave-0 HALT: rule mismatch s" + s);
  }
  log("u64c-wave0 rule-ID 3/3 vs filed U64 det rules");
  // Dry-run timing: project from twin 300-step runs.
  const t0 = Date.now();
  await u64cTrainCore(G, fs, 0, 100);
  const ms100 = Date.now() - t0;
  const proj = Math.round((ms100 / 100) * 800);
  log("u64c-wave0 dry-run 100 steps ~" + ms100 + "ms; project ~" + proj + "ms/train -> W1 ~" + Math.round((proj * 20) / 1000) + "s");
  const body = { spec: "self-u64c-response-prereg", version: "v1.3", wave: 0, verdict: "COMPLETE", stackHash: h.hex, twins, msPer800: proj, implNotes: ["J1 first-match-target + pick-max fallback", "J2 10 steps b+1..b+10, all B picks", "J3 adapt counts explore", "J4 300-step twin + explore-log equality", "J5 R9 OR-logic means"] };
  await fs.writeTextFile(U64C_WAVE0_PATH, JSON.stringify(body));
  log("u64c-wave0 COMPLETE");
  return body;
};
globalThis.runU64cWave1 = async function (fs, log, opts) {
  const G = await globalThis.IntrinsicInit(fs);
  const w0 = JSON.parse(await fs.readTextFile(U64C_WAVE0_PATH));
  if (w0.verdict !== "COMPLETE") throw new Error("U64c HALT: W0 not COMPLETE");
  const h = await globalThis.u33StackHash(fs);
  if (h.hex !== U64C_STACK_LOCAL) throw new Error("U64c-PIN HALT: stack drift");
  let drvHash = "n/a";
  try {
    const drvSrc = await fs.readTextFile("src/evidence/decomp/newai-selfu64c-driver.js");
    try { drvHash = await (0, eval)("u32Sha256Hex")(drvSrc); } catch (e) { /* eslint-disable-line */ }
  } catch (e) { /* eslint-disable-line */ }
  for (const seed of U64C_SEEDS) {
    const lp = u64cTrainPath(seed);
    if (!(opts && opts.force)) { try { const prev = JSON.parse(await fs.readTextFile(lp)); if (prev && prev.verdict === "COMPLETE") { log(lp + " exists, skip"); continue; } } catch (e) { /* eslint-disable-line */ } }
    const t0 = Date.now();
    const core = await u64cTrainCore(G, fs, seed, 800);
    // Rebuild P0: fresh stack snapshot (P0 = init params). u64cTrainCore consumed its
    // stack; take P0 from a second fresh stack (deterministic init => identical).
    const tP0 = await globalThis.u32FreshStack(fs, seed);
    const P0 = globalThis.u32SnapshotParams(tP0.M);
    const adaptRate = core.adapt.n.map((n, q) => n ? +(core.adapt.hit[q] / n).toFixed(4) : 0);
    const adaptEarly = core.sw.n ? +(core.sw.h / core.sw.n).toFixed(4) : 0;
    let divCos = null;
    try {
      const tM = await globalThis.u32FreshStack(fs, seed);
      void tM;
      divCos = null;
    } catch (e) { /* eslint-disable-line */ }
    const exploreSlots = core.rule.b.map((b) => { const l = []; for (let t = 1; t <= U64C_K; t++) l.push(b + t); return l; });
    const body = {
      spec: "self-u64c-response-prereg", version: "v1.3", track: "U64c-RESPONSE", arm: "detT", seed, steps: 800,
      B: 16, lr: 5e-3, K: 5, H: 48, C: 6, auxW: 0.5, lam: 2.0,
      diet: "rule-switch per-seed (U64-verbatim) + detT oracle-trigger explore",
      select: "pick-max s*n + reset@true-boundary + uniform-target explore K=10 steps",
      verdict: "COMPLETE", stackHash: h.hex, u64DriverHash: drvHash,
      wallMs: Date.now() - t0, adaptRate, adaptEarly, adaptEarlyN: core.sw.n,
      exploreSlots, exploreRng: U64C_EXPLORE_BASE + "+seed", explorePicks: core.ex.picks,
      exploreHits: core.ex.hits, exploreFallback: core.ex.fallback,
      rule: { hotSeq: core.rule.hotSeq, b: core.rule.b },
      P0, P: core.snap,
    };
    try {
      if (typeof inMeanCos !== "undefined") {
        const M = inSeqMakeModel(G.makeRng(1));
        const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
        load(M.E, core.snap.E); load(M.W1, core.snap.W1); load(M.b1, core.snap.b1);
        load(M.Wf, core.snap.Wf); load(M.bf, core.snap.bf); load(M.Wc, core.snap.Wc); load(M.bc, core.snap.bc);
        for (let k = 0; k < 5; k++) { load(M.Wh[k], core.snap.Wh[k]); load(M.bh[k], core.snap.bh[k]); }
        load(M.Hv, core.snap.Hv); load(M.bv, core.snap.bv);
        divCos = +inMeanCos(M).toFixed(4);
      }
    } catch (e) { /* eslint-disable-line */ }
    body.divCos = divCos;
    await fs.writeTextFile(lp, JSON.stringify(body));
    log("u64c-train detT s" + seed + " COMPLETE adaptEarly=" + adaptEarly + " exHit=" + core.ex.hits + "/" + core.ex.picks + " fb=" + core.ex.fallback + " (" + body.wallMs + "ms)");
  }
  log("u64c-wave1 COMPLETE (20 detT trains)");
  return { verdict: "COMPLETE" };
};
globalThis.runU64cWave2 = async function (fs, log, opts) {
  const G = await globalThis.IntrinsicInit(fs);
  const h = await globalThis.u33StackHash(fs);
  if (h.hex !== U64C_STACK_LOCAL) throw new Error("U64c-PIN HALT: stack drift");
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > b) b = i; return b; };
  for (const seed of U64C_SEEDS) {
    const ep = u64cEvalPath(seed), tp = u64cTrainPath(seed);
    if (!(opts && opts.force)) { try { const prev = JSON.parse(await fs.readTextFile(ep)); if (prev && prev.verdict === "COMPLETE") { log(ep + " exists, skip"); continue; } } catch (e) { /* eslint-disable-line */ } }
    const tr = JSON.parse(await fs.readTextFile(tp));
    if (tr.verdict !== "COMPLETE") throw new Error("U64c HALT: train ledger missing s" + seed);
    if (tr.stackHash !== U64C_STACK_LOCAL) throw new Error("U64c-PIN HALT: stack drift since train s" + seed);
    const M = inSeqMakeModel(G.makeRng(1));
    const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
    load(M.E, tr.P.E); load(M.W1, tr.P.W1); load(M.b1, tr.P.b1);
    load(M.Wf, tr.P.Wf); load(M.bf, tr.P.bf); load(M.Wc, tr.P.Wc); load(M.bc, tr.P.bc);
    for (let k = 0; k < 5; k++) { load(M.Wh[k], tr.P.Wh[k]); load(M.bh[k], tr.P.bh[k]); }
    load(M.Hv, tr.P.Hv); load(M.bv, tr.P.bv);
    let evalMasks = null; { const fr = G.makeRng(91000 + seed); evalMasks = []; for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr.int(10) < 5 ? 2 : 0; evalMasks.push(m); } }
    const srng = G.makeRng(52500 + seed), frng = G.makeRng(52400 + seed);
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
    const body = { spec: "self-u64c-response-prereg", version: "v1.3", track: "U64c-RESPONSE", arm: "detT", seed, steps: 800, verdict: "COMPLETE", n: N, frozenTest: true, evalOf: tp, stackHash: h.hex, accScratch: +(scr / N).toFixed(4), accTwo: +(two / N).toFixed(4), accOracle: +(orc / N).toFixed(4), accFwd: +(fF / N).toFixed(4) };
    await fs.writeTextFile(ep, JSON.stringify(body));
    log("u64c-eval detT s" + seed + " scr=" + body.accScratch + " two=" + body.accTwo + " orc=" + body.accOracle);
  }
  // Verdict (firewall: two detT new + dice filed; adapt detT new + dice filed; stackHash).
  const T = {}, E = {};
  for (const s of U64C_SEEDS) {
    T["detT" + s] = JSON.parse(await fs.readTextFile(u64cTrainPath(s)));
    E["detT" + s] = JSON.parse(await fs.readTextFile(u64cEvalPath(s)));
  }
  const F = {};
  for (const a of ["det", "dice", "orT"]) for (const s of U64C_SEEDS) {
    F[a + "T" + s] = JSON.parse(await fs.readTextFile(u64cFiledTrainPath(a, s)));
    F[a + "E" + s] = JSON.parse(await fs.readTextFile(u64cFiledEvalPath(a, s)));
  }
  const pin = U64C_SEEDS.every((s) => T["detT" + s].stackHash === U64C_STACK_LOCAL && E["detT" + s].stackHash === U64C_STACK_LOCAL);
  let ruleOk = true;
  for (const s of U64C_SEEDS) {
    const f = F["detT" + s].rule;
    const t = T["detT" + s].rule;
    if (JSON.stringify(t.hotSeq) !== JSON.stringify(f.hotSeq) || JSON.stringify(t.b) !== JSON.stringify(f.b)) ruleOk = false;
  }
  const edge = U64C_SEEDS.map((s) => +(E["detT" + s].accTwo - F["diceE" + s].accTwo).toFixed(4));
  const edgeA = U64C_SEEDS.map((s) => +(T["detT" + s].adaptEarly - F["diceT" + s].adaptEarly).toFixed(4));
  const nEdge = edge.filter((d) => d >= 0.03).length, nEdgeA = edgeA.filter((d) => d >= 0.10).length;
  const winMax = U64C_SEEDS.map((s) => Math.max(E["detT" + s].accTwo, F["detE" + s].accTwo, F["diceE" + s].accTwo, F["orTE" + s].accTwo));
  const floorBad = winMax.filter((v) => v < 0.45).length;
  // DIAG-EXPLORE v2 (diagnostic, verdict-time only): filed-filed baselines, no new compute.
  const orTdet_two = U64C_SEEDS.map((s) => +(F["orTE" + s].accTwo - F["detE" + s].accTwo).toFixed(4));
  const orTdet_ad = U64C_SEEDS.map((s) => +(F["orTT" + s].adaptEarly - F["detT" + s].adaptEarly).toFixed(4));
  const detTdet_two = U64C_SEEDS.map((s) => +(E["detT" + s].accTwo - F["detE" + s].accTwo).toFixed(4));
  const detTdet_ad = U64C_SEEDS.map((s) => +(T["detT" + s].adaptEarly - F["detT" + s].adaptEarly).toFixed(4));
  const detTorT_two = U64C_SEEDS.map((s) => +(E["detT" + s].accTwo - F["orTE" + s].accTwo).toFixed(4));
  const mean = (a) => +(a.reduce((x, y) => x + y, 0) / a.length).toFixed(4);
  // R9 mechanical (J5): OR-logic on means, filed here.
  const orT_effect = (mean(orTdet_two) >= 0.03) || (mean(orTdet_ad) >= 0.10);
  const detT_effect = (mean(detTdet_two) >= 0.03) || (mean(detTdet_ad) >= 0.10);
  const mech = (!orT_effect || detT_effect) ? "(a) jointly void" : "(b) reset-helps-explore-hurts";
  // Dead-seed confirmation table (filed dice adaptEarly unpassable: s0/s2/s9/s12/s18).
  const dead = [0, 2, 9, 12, 18].map((s) => ({ seed: s, diceAdapt: F["diceT" + s].adaptEarly, detTAdapt: T["detT" + s].adaptEarly, passable: T["detT" + s].adaptEarly >= F["diceT" + s].adaptEarly + 0.10 }));
  let verdict = "", detail = "";
  if (!pin) { verdict = "PIN-FAIL"; detail = "stack drift"; }
  else if (!ruleOk) { verdict = "PIN-FAIL"; detail = "rule mismatch vs filed U64"; }
  else if (floorBad >= 6) { verdict = "INCONCLUSIVE"; detail = "max arm two<0.45 on " + floorBad + "/20"; }
  else if (nEdge >= 15 && nEdgeA >= 15) { verdict = "RESPONSE-WORKS"; detail = "both @quorum (edge " + nEdge + "/20, adapt " + nEdgeA + "/20)"; }
  else if (nEdgeA >= 15) { verdict = "RESPONSE-ADAPT-ONLY"; detail = "adapt @quorum (" + nEdgeA + "/20), edge dead (" + nEdge + "/20) — recovery speed, not final memory"; }
  else if (nEdge >= 15) { verdict = "RESPONSE-EDGE-ONLY"; detail = "MECHANISM-SURPRISE: edge @quorum (" + nEdge + "/20), adapt dead (" + nEdgeA + "/20)"; }
  else { verdict = "RESPONSE-DEAD"; detail = "neither @quorum (edge " + nEdge + "/20, adapt " + nEdgeA + "/20), floor holds — wiring buys nothing here " + mech; }
  const perSeed = U64C_SEEDS.map((s) => ({ seed: s, detT_two: E["detT" + s].accTwo, dice_two: F["diceE" + s].accTwo, edge: edge[s], detT_adapt: T["detT" + s].adaptEarly, dice_adapt: F["diceT" + s].adaptEarly, edgeA: edgeA[s] }));
  for (const r of perSeed) log("u64c s" + r.seed + " two detT/dice=" + r.detT_two + "/" + r.dice_two + " adapt detT/dice=" + r.detT_adapt + "/" + r.dice_adapt);
  const body = {
    spec: "self-u64c-response-prereg", version: "v1.3", track: "U64c-RESPONSE", verdict, detail,
    killNote: "Red-round track-killer (explore-tax ~0.08 vs +0.10 bar, EDGE washed out) STANDS as pre-compute prediction; this verdict is its measured check under owner override (posterity).",
    bars: {
      "RESP-EDGE": nEdge + "/20 (quorum 15/20; detT.two>=filed dice.two+0.03)",
      "RESP-ADAPT": nEdgeA + "/20 (quorum 15/20; detT.adapt>=filed dice.adapt+0.10)",
      "FLOOR": (20 - floorBad) + "/20 max-arm>=0.45 (INCONCLUSIVE if <15/20)",
      "PIN": pin ? "40/40" : "FAIL", "RULE-IDENTITY": ruleOk ? "20/20 vs filed U64" : "FAIL",
    },
    diagExplore: {
      "orT-det two mean": mean(orTdet_two), "orT-det adapt mean": mean(orTdet_ad),
      "detT-orT two mean": mean(detTorT_two),
      "detT-det two mean": mean(detTdet_two), "detT-det adapt mean": mean(detTdet_ad),
      "K-SUFFICIENCY-BY-REVEALED-EFFECT": "detT-orT two " + mean(detTorT_two) + " (positive => explore contributed; ~0 => reset does the work)",
      "R9-MECHANICAL": mech + " (orT_effect=" + orT_effect + ", detT_effect=" + detT_effect + "; J5 OR-logic on means, filed in driver)",
    },
    deadSeedTable: dead,
    perSeed, deviations: ["J1..J5 as filed in driver header"],
  };
  await fs.writeTextFile(U64C_VERDICT_PATH, JSON.stringify(body));
  log("u64c-verdict " + verdict + " :: " + detail);
  return body;
};
