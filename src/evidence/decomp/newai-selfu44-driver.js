// newai-selfu44-driver.js — U44 mixed-proportion LP-bandit (M1 confound resolution).
//
// Countersign: Turn-186 user "go ahead and run those" = full-pipeline cover
// (prereg + battery + compute) for owed items U44/U45/dust. CPU/in-worker. NO PUSH.
// Prereg self-u44-mixband-prereg.md v1.1 (pins P1a-P1c, no bar changes).
// Battery fresh-eyes-self-u44-3x-results.md (R1/R3 IMPLEMENTABLE + R2 NEEDS-PATCH).
//
// Stack: pinned U33 (stackHash 258d2f06…), H48, 800st, B16/lr5e-3/K5/C6/auxW0.5/lam2.0.
// Diet: U36-D1 candidates (u43DietSingle, C=6/slot, forwarded disagreements).
// Arms: lowmix (pick-min w.p. 0.75 else uniform), highmix (pick-max w.p. 0.75 else
// uniform), u (uniform). Alignment (P1c): per SLOT draw r=dataRng.int(4) ALWAYS;
// r<3 -> directed (min lowmix / max highmix), r==3 -> uniform (index dataRng.int(C),
// always drawn). Losses = u43StaticSlot verbatim. Evals = u34 paired body verbatim.
// Floor: max-arm two < 0.45 on >=2 seeds -> INCONCLUSIVE. PIN fail -> HALT.
//
// RUN (execute_js, fs in scope):
//   const src = await fs.readTextFile("src/evidence/decomp/newai-selfu44-driver.js");
//   (0, eval)(src + "\n//# sourceURL=newai-selfu44-driver.js");
//   await globalThis.SelfU44Init(fs);
//   const log = (m) => console.log(m);
//   await globalThis.runU44Wave0(fs, log);
//   await globalThis.runU44Train(fs, log, {seed:0, arm:"lowmix"});
//   await globalThis.runU44Eval(fs, log, {seed:0, arm:"lowmix"});
//   await globalThis.runU44Verdict(fs, log);
globalThis.SelfU44Init = async function (fs) {
  const src = await fs.readTextFile("src/evidence/decomp/newai-selfu43-driver.js");
  (0, eval)(src + "\n//# sourceURL=newai-selfu43-driver.js");
  await globalThis.SelfU43Init(fs);
  if (typeof globalThis.u43StaticSlot !== "function") throw new Error("u44 stack load failed");
};
const U44_EXPECT_STACK = "258d2f060684ce382778e203959ab791abb5df79af174deef19ff568886d4d6e";
const U44_ARMS = { lowmix: 41, highmix: 42, u: 43 };
function u44TrainPath(seed, arm) { return "src/evidence/decomp/d-newai-self-u44-" + arm + "-s" + seed + "-800st.json"; }
function u44EvalPath(seed, arm) { return "src/evidence/decomp/d-newai-self-u44-eval-" + arm + "-s" + seed + "-800st.json"; }
const U44_VERDICT_PATH = "src/evidence/decomp/d-newai-self-u44-verdict.json";
const U44_WAVE0_PATH = "src/evidence/decomp/d-newai-self-u44-wave0.json";
// One mixture train step (shared by wave0 twins + production).
function u44TrainOneStep(M, params, opt, dataRng, fixedMasks, arm) {
  const B = 16, C = 6;
  let lsum = 0;
  for (let b = 0; b < B; b++) {
    const cands = [];
    for (let c = 0; c < C; c++) cands.push(u43DietSingle(dataRng));
    const ds = cands.map((e) => curVoteDisagree(inSeqForward(M, e.x, new Float64Array(8), fixedMasks).logitsK));
    const u = dataRng.int(C); // always drawn (P1c alignment)
    const r = dataRng.int(4); // always drawn (P1c alignment)
    let pi = u;
    if (arm !== "u" && r < 3) {
      pi = 0;
      for (let c = 1; c < C; c++) {
        if (arm === "lowmix" ? ds[c] < ds[pi] : ds[c] > ds[pi]) pi = c;
      }
    }
    lsum += u43StaticSlot(M, cands[pi], b, B, fixedMasks);
  }
  return { loss: lsum / B };
}
globalThis.runU44Wave0 = async function (fs, log) {
  try { const prev = JSON.parse(await fs.readTextFile(U44_WAVE0_PATH)); if (prev && prev.verdict === "COMPLETE") { log(U44_WAVE0_PATH + " exists, skip"); return prev; } } catch (e) {}
  const twins = [];
  for (const arm of ["lowmix", "highmix", "u"]) {
    for (const s of [0, 1, 2]) {
      const X = await globalThis.u32FreshStack(fs, s);
      const Y = await globalThis.u32FreshStack(fs, s);
      const p0 = globalThis.u32MaxAbsDiff(globalThis.u32SnapshotParams(X.M), globalThis.u32SnapshotParams(Y.M));
      for (const p of X.params) p.g.fill(0);
      for (const p of Y.params) p.g.fill(0);
      u44TrainOneStep(X.M, X.params, X.opt, X.dataRng, X.fixedMasks, arm);
      u44TrainOneStep(Y.M, Y.params, Y.opt, Y.dataRng, Y.fixedMasks, arm);
      const st = globalThis.u32MaxAbsDiff(globalThis.u32SnapshotParams(X.M), globalThis.u32SnapshotParams(Y.M));
      twins.push({ arm, seed: s, p0diff: p0.max, step1diff: st.max, pass: p0.max === 0 && st.max === 0 });
      log("u44-wave0 twin " + arm + " s" + s + " p0=" + p0.max + " step1=" + st.max);
      if (p0.max !== 0 || st.max !== 0) throw new Error("U44 Wave-0 HALT: twin nondeterminism " + arm + " s" + s);
    }
  }
  const body = { spec: "self-u44-mixband-prereg", wave: 0, verdict: "COMPLETE", twins, deviations: [] };
  await fs.writeTextFile(U44_WAVE0_PATH, JSON.stringify(body));
  log("u44-wave0 twins PASS (3 arms x 3 seeds)");
  return body;
};
globalThis.runU44Train = async function (fs, log, opts) {
  const { seed, arm } = opts;
  if (!(arm in U44_ARMS)) throw new Error("arm must be lowmix|highmix|u");
  const ledgerPath = u44TrainPath(seed, arm);
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  const h = await globalThis.u33StackHash(fs);
  if (h.hex !== U44_EXPECT_STACK) throw new Error("U44-PIN HALT: stack drift " + h.hex.slice(0, 16));
  const drvSrc = await fs.readTextFile("src/evidence/decomp/newai-selfu44-driver.js");
  const drvHash = await u32Sha256Hex(drvSrc);
  const t = await globalThis.u32FreshStack(fs, seed);
  const P0 = globalThis.u32SnapshotParams(t.M);
  const steps = 800, t0 = Date.now(), curve = [];
  const K = 5, lam = 2.0;
  for (let step = 0; step < steps; step++) {
    for (const p of t.params) p.g.fill(0);
    const r = u44TrainOneStep(t.M, t.params, t.opt, t.dataRng, t.fixedMasks, arm);
    const meanW = new Float64Array(t.M.Wh[0].v.length);
    for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) meanW[i] += t.M.Wh[k].v[i] / K;
    for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) t.M.Wh[k].g[i] += lam * (t.M.Wh[k].v[i] - meanW[i]) / (16 * t.M.H);
    let s = 0; for (const p of t.params) for (let i = 0; i < p.g.length; i++) s += p.g[i] * p.g[i];
    const n = Math.sqrt(s);
    if (n > 1.0) { const sc = 1.0 / n; for (const p of t.params) for (let i = 0; i < p.g.length; i++) p.g[i] *= sc; }
    t.opt.step(t.params);
    if (step % 100 === 0 || step === steps - 1) curve.push({ step, loss: +r.loss.toFixed(6) });
    if (step % 200 === 0) log("u44-train " + arm + " s" + seed + " step " + step + "/800 loss=" + r.loss.toFixed(4));
  }
  const P = globalThis.u32SnapshotParams(t.M);
  const body = {
    spec: "self-u44-mixband-prereg", track: "U44-MIXBAND", arm, seed, steps,
    B: 16, lr: 5e-3, K: 5, H: 48, C: 6, auxW: 0.5, lam: 2.0,
    diet: "U36-D1 candidates (aligned draws; P1c)",
    select: arm === "lowmix" ? "pick-min w.p. 0.75 else uniform" : arm === "highmix" ? "pick-max w.p. 0.75 else uniform" : "uniform",
    verdict: "COMPLETE", stackHash: h.hex, stackFiles: h.perFile.map((f) => f.path), u44DriverHash: drvHash,
    wallMs: Date.now() - t0, curve, divCos: +inMeanCos(t.M).toFixed(4), P0, P,
  };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("u44-train " + arm + " s" + seed + " COMPLETE loss0=" + curve[0].loss + " lossN=" + curve[curve.length - 1].loss);
  return body;
};
globalThis.runU44Eval = async function (fs, log, opts) {
  const { seed, arm } = opts;
  const trainPath = u44TrainPath(seed, arm), evalPath = u44EvalPath(seed, arm);
  if (!opts.force) { try { const prev = JSON.parse(await fs.readTextFile(evalPath)); if (prev && prev.verdict === "COMPLETE") { log(evalPath + " exists, skip"); return prev; } } catch (e) {} }
  const G = await globalThis.IntrinsicInit(fs);
  const tr = JSON.parse(await fs.readTextFile(trainPath));
  if (tr.verdict !== "COMPLETE") throw new Error("train ledger missing " + trainPath);
  const cur = await globalThis.u33StackHash(fs);
  if (cur.hex !== tr.stackHash) throw new Error("U44-PIN HALT: stack drift since train " + trainPath);
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
    spec: "self-u44-mixband-prereg", track: "U44-MIXBAND", arm, seed, steps: 800,
    verdict: "COMPLETE", n: N, frozenTest: true, evalOf: trainPath, stackHash: cur.hex,
    accScratch: +(scr / N).toFixed(4), accTwo: +(two / N).toFixed(4),
    accOracle: +(orc / N).toFixed(4), accFwd: +(fF / N).toFixed(4),
  };
  await fs.writeTextFile(evalPath, JSON.stringify(body));
  log("u44-eval " + arm + " s" + seed + " scr=" + body.accScratch + " two=" + body.accTwo + " orc=" + body.accOracle);
  return body;
};
globalThis.runU44Verdict = async function (fs, log) {
  const arms = ["lowmix", "highmix", "u"];
  const T = {}, E = {};
  for (const seed of [0, 1, 2]) for (const arm of arms) {
    T[seed + arm] = JSON.parse(await fs.readTextFile(u44TrainPath(seed, arm)));
    E[seed + arm] = JSON.parse(await fs.readTextFile(u44EvalPath(seed, arm)));
  }
  const pin = [0, 1, 2].every((s) => arms.every((a) => T[s + a].stackHash === U44_EXPECT_STACK && E[s + a].stackHash === U44_EXPECT_STACK));
  const rows = [0, 1, 2].map((s) => {
    const r = { seed: s };
    for (const a of arms) r[a] = { scr: E[s + a].accScratch, two: E[s + a].accTwo, orc: E[s + a].accOracle };
    return r;
  });
  let verdict = "", detail = "";
  const winMax = rows.map((r) => Math.max(r.lowmix.two, r.highmix.two, r.u.two));
  const floorBad = winMax.filter((v) => v < 0.45).length;
  const dLU = rows.map((r) => +(r.lowmix.two - r.u.two).toFixed(4));
  const nLU = dLU.filter((d) => d >= 0.03).length;
  const nHL = rows.filter((r) => r.highmix.two >= r.lowmix.two).length;
  const spread = rows.map((r) => Math.max(r.lowmix.two, r.highmix.two, r.u.two) - Math.min(r.lowmix.two, r.highmix.two, r.u.two));
  const nClose = spread.filter((v) => v <= 0.03).length;
  for (const r of rows) log("u44 s" + r.seed + " lowmix=" + r.lowmix.two + " highmix=" + r.highmix.two + " u=" + r.u.two + " dLU=" + (r.lowmix.two - r.u.two).toFixed(4));
  if (!pin) { verdict = "PIN-FAIL"; detail = "stack drift"; }
  else if (floorBad >= 2) { verdict = "INCONCLUSIVE"; detail = "max arm below floor on " + floorBad + "/3"; }
  else if (nLU >= 2) { verdict = "ADVANCE"; detail = "LOW-MIX>=U+0.03 on " + nLU + "/3 — direction real, M1 collapse was pure-diet damage"; }
  else if (nHL >= 2) { verdict = "DEAD"; detail = "HIGH-MIX>=LOW-MIX on " + nHL + "/3 — INVERTED-INVERTED (B8 direction wrong)"; }
  else { verdict = "DEAD"; detail = "all within 0.03 (close " + nClose + "/3) — bandit family dead at any mixture"; }
  const body = { spec: "self-u44-mixband-prereg", track: "U44-MIXBAND", verdict, detail, pin, rows };
  await fs.writeTextFile(U44_VERDICT_PATH, JSON.stringify(body));
  log("u44-verdict " + verdict + " (" + detail + ")");
  return body;
};
