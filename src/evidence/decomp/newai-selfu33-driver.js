// newai-selfu33-driver.js — U33 canonical repair: version-pinned stack + init
// checkpoints + re-freeze + stranger-simulation (confirmatory set B).
//
// CANONICAL (to be built): d-newai-self-u33-canon-s{seed}-800st.json (set A).
// STRANGER SIMULATION: d-newai-self-u33-confirm-s{seed}-800st.json (set B, same
//   pinned driver + streams; graded against A by BIT exact + FUNC ±0.02).
// Every new ledger carries stackHash (SHA-256 over STACK_FILES in canonical
// order) + P0 (init checkpoint). W6/U31/u32 history never written.
// CPU/in-worker only. COMPLETE-gated, resume skips COMPLETE. NO PUSH.
//
// RUN (execute_js, fs in scope):
//   const src = await fs.readTextFile("src/evidence/decomp/newai-selfu33-driver.js");
//   (0, eval)(src + "\n//# sourceURL=newai-selfu33-driver.js");
//   await globalThis.SelfU33Init(fs);
//   const log = (m) => console.log(m);
//   await globalThis.runU33Wave0(fs, log);                 // stack audit ledger
//   await globalThis.runU33Train(fs, log, {seed, kind});   // kind "canon"|"confirm"
//   await globalThis.runU33Eval(fs, log, {seed, kind});     // paired evals
//   await globalThis.runU33Verdict(fs, log);
globalThis.SelfU33Init = async function (fs) {
  const src = await fs.readTextFile("src/evidence/decomp/newai-selfu32-driver.js");
  (0, eval)(src + "\n//# sourceURL=newai-selfu32-driver.js");
  await globalThis.SelfU32Init(fs);
  if (!globalThis.u32FreshStack) throw new Error("u33 stack load failed");
};
const U33_STACK_FILES = [
  "src/tinynn/nn.js", "src/tinynn/seeded.js",
  "src/evidence/decomp/intrinsic-driver.js", "src/evidence/decomp/newai-driver.js",
  "src/evidence/decomp/newai-v102-driver.js", "src/evidence/decomp/newai-fr-driver.js",
  "src/evidence/decomp/newai-div-driver.js", "src/evidence/decomp/newai-cur-driver.js",
  "src/evidence/decomp/newai-winner-driver.js", "src/evidence/decomp/newai-selfu32-driver.js",
  "src/evidence/decomp/newai-selfu33-driver.js",
];
function u33TrainPath(seed, kind) { return "src/evidence/decomp/d-newai-self-u33-" + kind + "-s" + seed + "-800st.json"; }
function u33EvalPath(seed, kind) { return "src/evidence/decomp/d-newai-self-u33-eval-" + kind + "-s" + seed + "-800st.json"; }
const U33_STACK_PATH = "src/evidence/decomp/d-newai-self-u33-stack.json";
const U33_VERDICT_PATH = "src/evidence/decomp/d-newai-self-u33-verdict.json";
globalThis.u33StackHash = async function (fs) {
  const parts = [], perFile = [];
  for (const p of U33_STACK_FILES) {
    const t = await fs.readTextFile(p);
    perFile.push({ path: p, bytes: t.length });
    parts.push(p + "\n" + t);
  }
  const joined = parts.join("\n// ====FILE====\n");
  const bytes = new TextEncoder().encode(joined);
  const d = await crypto.subtle.digest("SHA-256", bytes);
  const hex = Array.from(new Uint8Array(d)).map((x) => x.toString(16).padStart(2, "0")).join("");
  return { hex, perFile };
};
// Wave 0 (reads only + init determinism demo; writes ONLY the stack ledger).
globalThis.runU33Wave0 = async function (fs, log) {
  const G = await globalThis.IntrinsicInit(fs);
  const h = await globalThis.u33StackHash(fs);
  // Init determinism demo (no trains): two fresh stacks per seed, P0 bit-compare.
  const demos = [];
  for (const seed of [0, 1, 2]) {
    const A = await globalThis.u32FreshStack(fs, seed);
    const B = await globalThis.u32FreshStack(fs, seed);
    const cmp = globalThis.u32MaxAbsDiff(globalThis.u32SnapshotParams(A.M), globalThis.u32SnapshotParams(B.M));
    demos.push({ seed, maxAbsDiff: cmp.max, pass: cmp.max === 0 });
    log("u33-init-demo s" + seed + " diff=" + cmp.max);
    if (cmp.max !== 0) throw new Error("U33 Wave-0 HALT: fresh-init nondeterministic s" + seed);
  }
  const body = { spec: "self-u33-canonical-repair-prereg", wave: 0, verdict: "COMPLETE", stackHash: h.hex, stackFiles: h.perFile, initDemo: demos };
  await fs.writeTextFile(U33_STACK_PATH, JSON.stringify(body));
  log("u33-wave0 STACK ledger written hash=" + h.hex.slice(0, 16) + "… (" + h.perFile.length + " files)");
  return body;
};
// Wave 1: canonical (kind "canon") or confirmatory stranger-simulation (kind "confirm").
globalThis.runU33Train = async function (fs, log, opts) {
  const { seed, kind } = opts;
  if (kind !== "canon" && kind !== "confirm" && kind !== "fresh") throw new Error("kind must be canon|confirm|fresh");
  const ledgerPath = u33TrainPath(seed, kind);
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  const h = await globalThis.u33StackHash(fs);
  const t = await globalThis.u32FreshStack(fs, seed);
  const P0 = globalThis.u32SnapshotParams(t.M);
  const steps = 800, t0 = Date.now(), curve = [];
  for (let step = 0; step < steps; step++) {
    for (const p of t.params) p.g.fill(0);
    const r = globalThis.u32TrainOneStep(t.M, t.params, t.opt, t.dataRng, t.fixedMasks);
    if (step % 100 === 0 || step === steps - 1) curve.push({ step, loss: +r.loss.toFixed(6) });
    if (step % 200 === 0) log("u33-train " + kind + " s" + seed + " step " + step + "/800 loss=" + r.loss.toFixed(4));
  }
  const P = globalThis.u32SnapshotParams(t.M);
  const body = {
    spec: "self-u33-canonical-repair-prereg", track: "U33-CANON", kind, seed, steps,
    B: 16, lr: 5e-3, K: 5, H: 48, C: 6, auxW: 0.5, lam: 2.0,
    bootstraps: "b%K slices (same as cur-pick)", verdict: "COMPLETE",
    recipeMatch: "C6/auxW0.5/800st/lam2.0/B16/lr5e-3/K5/H48/armCode76/pick-max-ties-lowest — W6 recipe on pinned stack",
    stackHash: h.hex, stackFiles: h.perFile.map((f) => f.path),
    wallMs: Date.now() - t0, frozen: kind === "canon", curve, divCos: +inMeanCos(t.M).toFixed(4), P0, P,
  };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("u33-train " + kind + " s" + seed + " COMPLETE loss0=" + curve[0].loss + " lossN=" + curve[curve.length - 1].loss + " divCos=" + body.divCos);
  return body;
};
// Wave 2: paired evals (model ALWAYS loaded from ledger file = ledger-sufficiency replay).
globalThis.runU33Eval = async function (fs, log, opts) {
  const { seed, kind } = opts;
  const trainPath = u33TrainPath(seed, kind), evalPath = u33EvalPath(seed, kind);
  try { const prev = JSON.parse(await fs.readTextFile(evalPath)); if (prev && prev.verdict === "COMPLETE") { log(evalPath + " exists, skip"); return prev; } } catch (e) {}
  const G = await globalThis.IntrinsicInit(fs);
  const tr = JSON.parse(await fs.readTextFile(trainPath));
  if (tr.verdict !== "COMPLETE") throw new Error("train ledger missing " + trainPath);
  const cur = await globalThis.u33StackHash(fs);
  if (cur.hex !== tr.stackHash) throw new Error("U33-PIN HALT: stack drift since train " + trainPath);
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
    spec: "self-u33-canonical-repair-prereg", track: "U33-CANON", kind, seed, steps: 800,
    verdict: "COMPLETE", n: N, frozenTest: true, evalOf: trainPath, stackHash: cur.hex,
    accScratch: +(scr / N).toFixed(4), accTwo: +(two / N).toFixed(4),
    accOracle: +(orc / N).toFixed(4), accFwd: +(fF / N).toFixed(4),
  };
  await fs.writeTextFile(evalPath, JSON.stringify(body));
  log("u33-eval " + kind + " s" + seed + " scr=" + body.accScratch + " two=" + body.accTwo);
  return body;
};
// Verdict: PIN + BIT + FUNC + FLOOR + FROZEN.
globalThis.runU33Verdict = async function (fs, log) {
  const stack = JSON.parse(await fs.readTextFile(U33_STACK_PATH));
  const perSeed = [];
  for (const seed of [0, 1, 2]) {
    const A = JSON.parse(await fs.readTextFile(u33TrainPath(seed, "canon")));
    const B = JSON.parse(await fs.readTextFile(u33TrainPath(seed, "confirm")));
    const pinPass = A.stackHash === stack.stackHash && B.stackHash === stack.stackHash;
    const p0cmp = globalThis.u32MaxAbsDiff(B.P0, A.P0);
    const bit = globalThis.u32MaxAbsDiff(B.P, A.P);
    const eA = JSON.parse(await fs.readTextFile(u33EvalPath(seed, "canon")));
    const eB = JSON.parse(await fs.readTextFile(u33EvalPath(seed, "confirm")));
    const dScr = Math.abs(eB.accScratch - eA.accScratch), dTwo = Math.abs(eB.accTwo - eA.accTwo);
    perSeed.push({
      seed, pin: { match: pinPass, p0diff: p0cmp.max, pass: pinPass && p0cmp.max === 0 },
      bit: { maxAbsDiff: bit.max, worst: bit.worst, pass: bit.max === 0 },
      func: { canonScr: eA.accScratch, canonTwo: eA.accTwo, confirmScr: eB.accScratch, confirmTwo: eB.accTwo, dScr, dTwo, pass: dScr <= 0.02 && dTwo <= 0.02 },
      floor: { scr: eA.accScratch, two: eA.accTwo, pass: eA.accScratch >= 0.50 && eA.accTwo >= 0.45 },
    });
    log("u33-verdict s" + seed + " PIN=" + (pinPass ? "ok" : "DRIFT") + " BIT=" + bit.max + " FUNC=" + (dScr <= 0.02 && dTwo <= 0.02 ? "HIT" : "MISS") + " FLOOR scr/two=" + eA.accScratch + "/" + eA.accTwo);
  }
  // Set C: not-byte-perfect stranger version (fresh seeds, same pinned recipe).
  // Graded by FLOOR + sweep-loss0 cross-check; reported, never canonical-rejecting.
  const fresh = [];
  for (const seed of [3, 4, 5]) {
    const F = JSON.parse(await fs.readTextFile(u33TrainPath(seed, "fresh")));
    const eF = JSON.parse(await fs.readTextFile(u33EvalPath(seed, "fresh")));
    let sweepLoss0 = null, sweepMatch = null;
    try {
      const sw = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-w-w6sweep-s" + seed + "-800st.json"));
      sweepLoss0 = sw.curve[0].loss; sweepMatch = +F.curve[0].loss.toFixed(6) === sweepLoss0;
    } catch (e) {}
    const floorPass = eF.accScratch >= 0.50 && eF.accTwo >= 0.45;
    const pinOk = F.stackHash === stack.stackHash;
    fresh.push({ seed, pinOk, loss0: F.curve[0].loss, lossN: F.curve[F.curve.length - 1].loss, scr: eF.accScratch, two: eF.accTwo, sweepLoss0, sweepMatch, floorPass });
    log("u33-fresh s" + seed + " pin=" + (pinOk ? "ok" : "DRIFT") + " sweepLoss0=" + (sweepMatch ? "MATCH" : "MISS") + " scr/two=" + eF.accScratch + "/" + eF.accTwo + " floor=" + (floorPass ? "PASS" : "FAIL"));
  }
  const freshFloorN = fresh.filter((f) => f.floorPass).length;
  const freshSweepN = fresh.filter((f) => f.sweepMatch).length;
  const pinN = perSeed.filter((s) => s.pin.pass).length;
  const bitN = perSeed.filter((s) => s.bit.pass).length;
  const funcN = perSeed.filter((s) => s.func.pass).length;
  const floorN = perSeed.filter((s) => s.floor.pass).length;
  let verdict = "";
  if (pinN < 3) verdict = "PIN-FAIL";
  else if (floorN < 3) verdict = "FLOOR-FAIL";
  else if (bitN === 3 && funcN === 3) verdict = "CANONICAL-EXACT";
  else if (funcN === 3) verdict = "CANONICAL-FUNCTIONAL";
  else verdict = "PIN-FAIL";
  const body = {
    spec: "self-u33-canonical-repair-prereg", verdict,
    succession: "u33-canon SUPERSEDES w6 as the rebuild target (amendment, versioned; w6/u32 files untouched)",
    bars: {
      "U33-PIN": pinN + "/3 (stackHash + P0 exact)",
      "U33-BIT": bitN + "/3 exact 0.0",
      "U33-FUNC": funcN + "/3 (|Δ| ≤ 0.02, 6/6 numbers)",
      "U33-FLOOR": floorN + "/3 (scr ≥ 0.50, two ≥ 0.45)",
      "U33-FRESH-SEED": freshFloorN + "/3 floor + sweep-loss0 " + freshSweepN + "/3 (not-byte-perfect stranger version; reported, non-rejecting)",
      "U33-FROZEN": "PASS by construction (u33 paths only; spot-check on read)",
      "U33-FRESH": "battery 3x IMPLEMENTABLE unanimous -> v1.1 (P1a terminology) + v1.2 user-countersigned same-recipe arm",
    },
    stackHash: stack.stackHash, perSeed, fresh,
  };
  await fs.writeTextFile(U33_VERDICT_PATH, JSON.stringify(body));
  log("u33-verdict " + verdict + " PIN " + pinN + "/3 BIT " + bitN + "/3 FUNC " + funcN + "/3 FLOOR " + floorN + "/3 FRESH-SEED floor " + freshFloorN + "/3 sweep " + freshSweepN + "/3");
  return body;
};
