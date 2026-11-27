// newai-selfu64b-driver.js — U64b EXAM (E-NE0c): punishing exam, same arms, reads-only.
//
// Prereg: src/evidence/decomp/self-u64b-exam-prereg.md v1.3 STANDS (battery CLOSED:
// barrage v1.0 6 adopted + barrage v1.1 + audit (FLOOR-ANCHOR adopted) + red v1.2
// (R8/R9 one-liner adoptions) + barren re-close v1.3; 39 reviewers, 9 adoptions).
// Cover: owner 2026-11-27 "all 3 (for posterities sake)" = COMPUTE LICENSED for
// U64b v1.3 (Wave 0 -> Wave 1, reads-only re-eval of 100 filed U64 trunks).
// NO PUSH. Log everything.
//
// Stack: U64 driver eval'd below (u64Rule/u64DietSingle/u43ScoreRow/u46*/PIN literal).
// Exam is READS-ONLY: no training, no gradient, frozen filed params.
//
// Implementation choices filed here (I1..I9; logged-only mechanics — verdict firewall
// reads ONLY {accRec, accTra, stackHash} + filed {adaptEarly}):
//  I1 qkCount: fresh Map at each pass start (E1, E2), accumulates within pass, no
//     mid-pass resets. Filed trunks store no qkCount; frozen weights are the stale map.
//  I2 E1 slots: steps rule.b[w]+1 .. rule.b[w]+50, quarter w+1, correctness vs filed
//     hotSeq[w+1]. Candidates via u64DietSingle VERBATIM on per-arm
//     e1Rng G.makeRng(53100+seed*104729+55+armCode) (U64 D1 arm-offset recipe).
//     Per slot: C=6 candidates + u46AlignedDraws block ALWAYS (D4), then arm policy.
//  I3 policies (frozen M): det/orT/shT/detT pick-max s*n; dice u46Pick "stoch";
//     orF hot-restricted pick-max vs TRUE current hot (exam knows the rule; orF-is-oracle
//     filed), fallback pick-max if no candidate in hot (fallbacks logged).
//  I4 E2 TRANSFER: novel hot nh (filed derivation); pseudo-rule hotSeq=[nh x4] so every
//     slot is novel-hot; 200 slots on SHARED e2Data G.makeRng(53300+seed) (same exam all
//     arms); correctness vs nh.
//  I5 masks: E1 scoring+heads use evalMasks built 91000+seed (U64-eval construction
//     verbatim: 5x48, int(10)<5 ? 2 : 0); E2 same construction from e2Masks 91400+seed.
//     No new streams beyond filed ones.
//  I6 heads (logged ONLY, zero extra draws): per picked element e — Scr = own-vhat
//     two-step prediction == e.y (deployed pipeline); Orc = oracle-v-fed two-step == e.y
//     (U64-eval head semantics). Averaged over pass.
//  I7 novel set: remaining = pair-indices (0..5 over U64_PAIRS) unused in filed hotSeq
//     (typically 2); tries rr.int(6), accept first unused, <=20 tries, else lowest unused
//     index (adj-differ vs hotSeq[3] is automatic given exclusion — filed here explicitly).
//     novelCandidates = unused indices in pair-index order. ruleDrawCount = Wave-0 replay
//     draws + novel tries. Replay MUST deep-equal filed rule else HALT.
//  I8 examHash = u32Sha256Hex(u64bDriverBytes + u64DriverBytes + streamConsts +
//     windowTable20). W0 COMPUTES then FILES; W1 recomputes and ASSERTS (HALT on drift).
//     Driver file MUST NOT be edited between W0 and W1.
//  I9 twin compare excludes wallMs (timing only).
//
// RUN (execute_js, fs in scope; ONLY under owner countersign above):
//   const src = await fs.readTextFile("src/evidence/decomp/newai-selfu64b-driver.js");
//   (0, eval)(src + "\n//# sourceURL=newai-selfu64b-driver.js");
//   await globalThis.SelfU64bInit(fs);
//   const log = (m) => console.log(m);
//   await globalThis.runU64bWave0(fs, log);
//   await globalThis.runU64bWave1(fs, log);
globalThis.SelfU64bInit = async function (fs) {
  const src = await fs.readTextFile("src/evidence/decomp/newai-selfu64-driver.js");
  (0, eval)(src + "\n//# sourceURL=newai-selfu64-driver.js");
  await globalThis.SelfU64Init(fs);
  for (const f of ["u64Rule", "u64DietSingle", "u64SeedStreams", "u43ScoreRow",
    "u46AlignedDraws", "u46Pick", "u33StackHash", "u32SnapshotParams",
    "inSeqMakeModel", "inSeqForward", "inMeanLogits"]) {
    let present = typeof globalThis[f] !== "undefined";
    if (!present) { try { present = (0, eval)("typeof " + f) !== "undefined"; } catch (e) { present = false; } }
    if (!present) throw new Error("U64b stack load failed: " + f);
  }
  // NOTE: U64 driver's `const` bindings (U64_ARMS/U64_SEEDS/U64_PAIRS/U64_EXPECT_STACK)
  // do NOT leak out of indirect eval (lexical scoping); functions do. Values needed here
  // are re-declared locally (U64B_*); hash literal pinned below. No drift: U64 driver
  // source is hashed into examHash (I8), and PIN checks the literal stack hash.
};
const U64_EXPECT_STACK_LOCAL = "258d2f060684ce382778e203959ab791abb5df79af174deef19ff568886d4d6e";
const U64B_ARMS = { det: 101, dice: 102, orT: 103, orF: 104, shT: 105 };
const U64B_PAIRS = [[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]]; // values verbatim vs U64 driver (replay-vs-filed check enforces)
const U64B_ARM_LIST = ["det", "dice", "orT", "orF", "shT"];
const U64B_SEEDS = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19];
const U64B_E1_BASE = 53100, U64B_E2_DATA = 53300, U64B_E2_MASK = 91400, U64B_EVAL_MASK = 91000;
const U64B_WAVE0_PATH = "src/evidence/decomp/d-newai-self-u64b-wave0.json";
const U64B_VERDICT_PATH = "src/evidence/decomp/d-newai-self-u64b-verdict.json";
function u64bLedgerPath(arm, seed) { return "src/evidence/decomp/d-newai-self-u64b-" + arm + "-s" + seed + ".json"; }
function u64bTrunkPath(arm, seed) { return "src/evidence/decomp/d-newai-self-u64-" + arm + "-s" + seed + "-800st.json"; }
function u64bStreamConsts() {
  return "E1_BASE=" + U64B_E1_BASE + "|E2_DATA=" + U64B_E2_DATA + "|E2_MASK=" + U64B_E2_MASK +
    "|EVAL_MASK=" + U64B_EVAL_MASK + "|C=6|E1W=50|E2N=200|K5/H48/B16";
}
// Counting replay of u64Rule draw sequence (call order VERBATIM vs U64 driver) +
// novel-set derivation. Returns {rule, wave0draws, novelHot, novelCandidates, ruleDrawCount}.
function u64bReplayRule(G, seed, filedRule) {
  const rr = G.makeRng(64000 + seed);
  let draws = 0;
  const int = (n) => { draws++; return rr.int(n); };
  const hotSeq = [];
  for (let q = 0; q < 4; q++) {
    let pick = U64B_PAIRS[int(6)];
    for (let t = 0; t < 20; t++) {
      const cand = U64B_PAIRS[int(6)];
      if (q === 0 || cand[0] !== hotSeq[q-1][0] || cand[1] !== hotSeq[q-1][1]) { pick = cand; break; }
      pick = cand;
    }
    hotSeq.push(pick);
  }
  const b = [200 + (int(81) - 40), 400 + (int(81) - 40), 600 + (int(81) - 40)];
  const wave0draws = draws;
  const used = new Set(hotSeq.map((h) => U64B_PAIRS.findIndex((p) => p[0] === h[0] && p[1] === h[1])));
  const remaining = [0,1,2,3,4,5].filter((i) => !used.has(i));
  let novel = -1;
  for (let t = 0; t < 20; t++) {
    const cand = int(6);
    if (!used.has(cand)) { novel = cand; break; }
  }
  if (novel < 0) novel = remaining.slice().sort((a, c) => a - c)[0];
  const ruleDrawCount = draws;
  const rule = { hotSeq, b };
  if (JSON.stringify({ hotSeq: filedRule.hotSeq, b: filedRule.b }) !== JSON.stringify(rule))
    throw new Error("U64b HALT: replay rule mismatch s" + seed);
  return { rule, wave0draws, novelHot: U64B_PAIRS[novel], novelCandidates: remaining.slice().sort((a, c) => a - c), ruleDrawCount };
}
function u64bBuildMasks(G, base, seed) {
  const fr = G.makeRng(base + seed), masks = [];
  for (let kk = 0; kk < 5; kk++) {
    const m = new Float64Array(48);
    for (let i = 0; i < 48; i++) m[i] = fr.int(10) < 5 ? 2 : 0;
    masks.push(m);
  }
  return masks;
}
function u64bLoadModel(G, trunk) {
  const M = inSeqMakeModel(G.makeRng(1));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(M.E, trunk.P.E); load(M.W1, trunk.P.W1); load(M.b1, trunk.P.b1);
  load(M.Wf, trunk.P.Wf); load(M.bf, trunk.P.bf); load(M.Wc, trunk.P.Wc); load(M.bc, trunk.P.bc);
  for (let k = 0; k < 5; k++) { load(M.Wh[k], trunk.P.Wh[k]); load(M.bh[k], trunk.P.bh[k]); }
  load(M.Hv, trunk.P.Hv); load(M.bv, trunk.P.bv);
  return M;
}
function u64bArgmax4(a) { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; }
// One exam slot: candidates + aligned block + policy pick. Returns {pick, fallback}.
function u64bSlot(M, dataRng, qkCount, masks, arm, hot) {
  const C = 6;
  const cands = [];
  for (let c = 0; c < C; c++) cands.push(u64DietSingle(dataRng, { hotSeq: [hot, hot, hot, hot], b: [1e9, 1e9, 1e9] }, 0));
  const sn = cands.map((e) => { const r = u43ScoreRow(M, e, qkCount, masks); return r.s * r.n; });
  const dr = u46AlignedDraws(dataRng);
  let pi = 0, fallback = 0;
  if (arm === "dice") {
    pi = u46Pick(sn, dr.gauss, dr.uSamp, "stoch");
  } else if (arm === "orF") {
    let best = -Infinity, found = false;
    for (let c = 0; c < C; c++) {
      const e = cands[c];
      if (e.qk === hot[0] || e.qk === hot[1]) { if (sn[c] > best) { best = sn[c]; pi = c; found = true; } }
    }
    if (!found) { for (let c = 1; c < C; c++) if (sn[c] > sn[pi]) pi = c; fallback = 1; }
  } else {
    for (let c = 1; c < C; c++) if (sn[c] > sn[pi]) pi = c;
  }
  return { pick: cands[pi], fallback };
}
// E1 with explicit step/rule (recovery windows need true quarter steps, not pseudo-rule).
function u64bSlotE1(M, dataRng, qkCount, masks, arm, hot, rule, step) {
  const C = 6;
  const cands = [];
  for (let c = 0; c < C; c++) cands.push(u64DietSingle(dataRng, rule, step));
  const sn = cands.map((e) => { const r = u43ScoreRow(M, e, qkCount, masks); return r.s * r.n; });
  const dr = u46AlignedDraws(dataRng);
  let pi = 0, fallback = 0;
  if (arm === "dice") {
    pi = u46Pick(sn, dr.gauss, dr.uSamp, "stoch");
  } else if (arm === "orF") {
    let best = -Infinity, found = false;
    for (let c = 0; c < C; c++) {
      const e = cands[c];
      if (e.qk === hot[0] || e.qk === hot[1]) { if (sn[c] > best) { best = sn[c]; pi = c; found = true; } }
    }
    if (!found) { for (let c = 1; c < C; c++) if (sn[c] > sn[pi]) pi = c; fallback = 1; }
  } else {
    for (let c = 1; c < C; c++) if (sn[c] > sn[pi]) pi = c;
  }
  return { pick: cands[pi], fallback };
}
function u64bHeads(M, e, masks) {
  const c0 = new Float64Array(8);
  const fw1 = inSeqForward(M, e.x, c0, masks);
  const vhat = u64bArgmax4(fw1.hvLog);
  const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
  const scr = u64bArgmax4(inMeanLogits({ logitsK: inSeqForward(M, x2m, fw1.cNew, masks).logitsK })) === e.y ? 1 : 0;
  const xo = [9, 9, 9, 9, 9, 9, e.qk, e.k, e.v, 8];
  const orc = u64bArgmax4(inMeanLogits({ logitsK: inSeqForward(M, xo, fw1.cNew, masks).logitsK })) === e.y ? 1 : 0;
  return { scr, orc };
}
// Full exam on one filed trunk. Returns ledger body (no wallMs/examHash — caller adds).
function u64bExam(G, trunk, arm) {
  const seed = trunk.seed;
  const rep = u64bReplayRule(G, seed, trunk.rule);
  const M = u64bLoadModel(G, trunk);
  const e1Masks = u64bBuildMasks(G, U64B_EVAL_MASK, seed);
  const e2Masks = u64bBuildMasks(G, U64B_E2_MASK, seed);
  const dataRng = G.makeRng(U64B_E1_BASE + seed * 104729 + 55 + U64B_ARMS[arm]);
  const rec = [0, 0, 0]; let recN = 0, scrN = 0, orcN = 0, fb1 = 0;
  const qk1 = new Map();
  for (let w = 0; w < 3; w++) {
    const hot = trunk.rule.hotSeq[w + 1];
    for (let t = 0; t < 50; t++) {
      const step = trunk.rule.b[w] + 1 + t;
      const s = u64bSlotE1(M, dataRng, qk1, e1Masks, arm, hot, trunk.rule, step);
      qk1.set(s.pick.qk, (qk1.get(s.pick.qk) || 0) + 1);
      if (s.pick.qk === hot[0] || s.pick.qk === hot[1]) rec[w]++;
      recN++;
      const h = u64bHeads(M, s.pick, e1Masks);
      scrN += h.scr; orcN += h.orc; fb1 += s.fallback;
    }
  }
  const e2Rng = G.makeRng(U64B_E2_DATA + seed);
  const nh = rep.novelHot;
  let tra = 0, tScr = 0, tOrc = 0, fb2 = 0;
  const qk2 = new Map();
  for (let i = 0; i < 200; i++) {
    const s = u64bSlot(M, e2Rng, qk2, e2Masks, arm, nh);
    qk2.set(s.pick.qk, (qk2.get(s.pick.qk) || 0) + 1);
    if (s.pick.qk === nh[0] || s.pick.qk === nh[1]) tra++;
    const h = u64bHeads(M, s.pick, e2Masks);
    tScr += h.scr; tOrc += h.orc; fb2 += s.fallback;
  }
  return {
    arm, seed,
    accRec: +((rec[0] + rec[1] + rec[2]) / recN).toFixed(4),
    rec1: +(rec[0] / 50).toFixed(4), rec2: +(rec[1] / 50).toFixed(4), rec3: +(rec[2] / 50).toFixed(4),
    accTra: +(tra / 200).toFixed(4),
    accRecScr: +(scrN / recN).toFixed(4), accRecOrc: +(orcN / recN).toFixed(4),
    accTraScr: +(tScr / 200).toFixed(4), accTraOrc: +(tOrc / 200).toFixed(4),
    novelHot: nh, novelCandidates: rep.novelCandidates, ruleDrawCount: rep.ruleDrawCount,
    rule: trunk.rule, orFallbackE1: fb1, orFallbackE2: fb2,
  };
}
async function u64bExamHash(fs, G) {
  const sha = (0, eval)("u32Sha256Hex");
  const bsrc = await fs.readTextFile("src/evidence/decomp/newai-selfu64b-driver.js");
  const usrc = await fs.readTextFile("src/evidence/decomp/newai-selfu64-driver.js");
  const table = [];
  for (const seed of U64B_SEEDS) {
    const trunk = JSON.parse(await fs.readTextFile(u64bTrunkPath("det", seed)));
    const rep = u64bReplayRule(G, seed, trunk.rule);
    table.push({ seed, b: trunk.rule.b, hotSeq: trunk.rule.hotSeq, novelHot: rep.novelHot, novelCandidates: rep.novelCandidates, ruleDrawCount: rep.ruleDrawCount, wave0draws: rep.wave0draws });
  }
  return await sha(bsrc + "\n" + usrc + "\n" + u64bStreamConsts() + "\n" + JSON.stringify(table));
}
globalThis.runU64bWave0 = async function (fs, log, opts) {
  if (!(opts && opts.force)) { try { const prev = JSON.parse(await fs.readTextFile(U64B_WAVE0_PATH)); if (prev && prev.verdict === "COMPLETE") { log(U64B_WAVE0_PATH + " exists, skip"); return prev; } } catch (e) {} }
  const G = await globalThis.IntrinsicInit(fs);
  const h = await globalThis.u33StackHash(fs);
  if (h.hex !== U64_EXPECT_STACK_LOCAL) throw new Error("U64b-PIN HALT: stack drift " + h.hex.slice(0, 16));
  // PIN on 3 filed trunks (same seed, policy breadth: det/dice/orF).
  for (const [arm, seed] of [["det", 0], ["dice", 0], ["orF", 0]]) {
    const tr = JSON.parse(await fs.readTextFile(u64bTrunkPath(arm, seed)));
    if (tr.stackHash !== U64_EXPECT_STACK_LOCAL) throw new Error("U64b-PIN HALT: trunk drift " + arm + " s" + seed);
    if (tr.verdict !== "COMPLETE") throw new Error("U64b HALT: trunk incomplete " + arm + " s" + seed);
  }
  log("u64b-wave0 PIN 3/3 trunks literal-match");
  // Rule replay exactness + ruleDrawCount range assert on seeds 0..2.
  for (const s of [0, 1, 2]) {
    const tr = JSON.parse(await fs.readTextFile(u64bTrunkPath("det", s)));
    const rep = u64bReplayRule(G, s, tr.rule);
    if (!(rep.wave0draws < rep.ruleDrawCount && rep.ruleDrawCount <= rep.wave0draws + 20))
      throw new Error("U64b Wave-0 HALT: ruleDrawCount range s" + s + " w0=" + rep.wave0draws + " n=" + rep.ruleDrawCount);
    log("u64b-wave0 replay s" + s + " w0draws=" + rep.wave0draws + " count=" + rep.ruleDrawCount + " novel=" + JSON.stringify(rep.novelHot));
  }
  // Determinism twin: same trunk twice, exact match modulo wallMs.
  const tr0 = JSON.parse(await fs.readTextFile(u64bTrunkPath("det", 0)));
  const a = u64bExam(G, tr0, "det"), b = u64bExam(G, tr0, "det");
  const sa = JSON.stringify(a), sb = JSON.stringify(b);
  if (sa !== sb) throw new Error("U64b Wave-0 HALT: exam nondeterminism");
  log("u64b-wave0 determinism twin exact (det s0, " + sa.length + "B)");
  // Crash-test: full exam on (dice,s1) completes with finite metrics in [0,1].
  const tr1 = JSON.parse(await fs.readTextFile(u64bTrunkPath("dice", 1)));
  const c = u64bExam(G, tr1, "dice");
  for (const k of ["accRec", "rec1", "rec2", "rec3", "accTra", "accRecScr", "accRecOrc", "accTraScr", "accTraOrc"]) {
    if (!(c[k] >= 0 && c[k] <= 1 && isFinite(c[k]))) throw new Error("U64b Wave-0 HALT: crash-test metric " + k + "=" + c[k]);
  }
  log("u64b-wave0 crash-test dice s1 accRec=" + c.accRec + " accTra=" + c.accTra);
  // examHash COMPUTE-then-FILE.
  const examHash = await u64bExamHash(fs, G);
  log("u64b-wave0 examHash=" + examHash.slice(0, 16) + "...");
  // Dry-run timing (one full exam).
  const t0 = Date.now();
  u64bExam(G, tr0, "det");
  const msPer = Date.now() - t0;
  log("u64b-wave0 dry-run 1 exam ~" + msPer + "ms; project W1 ~" + Math.round((msPer * 100) / 1000) + "s");
  const body = { spec: "self-u64b-exam-prereg", version: "v1.3", wave: 0, verdict: "COMPLETE", stackHash: h.hex, examHash, msPerExam: msPer, implNotes: ["I1 fresh qkCount per pass", "I2 E1 per-arm e1Rng", "I3 orF hot-restricted+fallback", "I4 E2 shared e2Data", "I5 evalMasks 91000/e2Masks 91400", "I6 scr=own-vhat two-step/orc=oracle-fed", "I7 novel lowest-unused fallback", "I8 examHash compute-then-file", "I9 twin excludes wallMs"] };
  await fs.writeTextFile(U64B_WAVE0_PATH, JSON.stringify(body));
  log("u64b-wave0 COMPLETE");
  return body;
};
globalThis.runU64bWave1 = async function (fs, log, opts) {
  const G = await globalThis.IntrinsicInit(fs);
  const w0 = JSON.parse(await fs.readTextFile(U64B_WAVE0_PATH));
  if (w0.verdict !== "COMPLETE") throw new Error("U64b HALT: W0 not COMPLETE");
  const h = await globalThis.u33StackHash(fs);
  if (h.hex !== U64_EXPECT_STACK_LOCAL) throw new Error("U64b-PIN HALT: stack drift");
  const examHash = await u64bExamHash(fs, G);
  if (examHash !== w0.examHash) throw new Error("U64b HALT: examHash drift pre-W1");
  let driverHash = "n/a";
  try { driverHash = await (0, eval)("u32Sha256Hex")(await fs.readTextFile("src/evidence/decomp/newai-selfu64b-driver.js")); } catch (e) {}
  const ledgers = {};
  for (const arm of U64B_ARM_LIST) {
    for (const seed of U64B_SEEDS) {
      const lp = u64bLedgerPath(arm, seed);
      if (!(opts && opts.force)) { try { const prev = JSON.parse(await fs.readTextFile(lp)); if (prev && prev.verdict === "COMPLETE") { log(lp + " exists, skip"); ledgers[arm + seed] = prev; continue; } } catch (e) {} }
      const trunk = JSON.parse(await fs.readTextFile(u64bTrunkPath(arm, seed)));
      if (trunk.stackHash !== U64_EXPECT_STACK_LOCAL) { log("U64b PIN-FAIL " + arm + " s" + seed); throw new Error("U64b-PIN HALT"); }
      const t0 = Date.now();
      const body = u64bExam(G, trunk, arm);
      body.stackHash = h.hex;
      body.examHash = examHash;
      body.driverHash = driverHash;
      body.wallMs = Date.now() - t0;
      body.spec = "self-u64b-exam-prereg"; body.version = "v1.3"; body.verdict = "COMPLETE";
      body.scoring = "correct-hot-pick fraction (I2/I3/I4)";
      await fs.writeTextFile(lp, JSON.stringify(body));
      ledgers[arm + seed] = body;
      log("u64b-w1 " + arm + " s" + seed + " accRec=" + body.accRec + " accTra=" + body.accTra + " (" + body.wallMs + "ms)");
    }
  }
  // Verdict (firewall: accRec/accTra/stackHash + filed adaptEarly).
  const adapt = {};
  for (const arm of U64B_ARM_LIST) for (const seed of U64B_SEEDS) {
    adapt[arm + seed] = JSON.parse(await fs.readTextFile(u64bTrunkPath(arm, seed))).adaptEarly;
  }
  const pin = U64B_ARM_LIST.every((a) => U64B_SEEDS.every((s) => ledgers[a + s].stackHash === U64_EXPECT_STACK_LOCAL));
  const xh = U64B_ARM_LIST.every((a) => U64B_SEEDS.every((s) => ledgers[a + s].examHash === w0.examHash));
  let ruleOk = true;
  for (const s of U64B_SEEDS) {
    const base = JSON.stringify(ledgers["det" + s].rule);
    for (const a of U64B_ARM_LIST) if (JSON.stringify(ledgers[a + s].rule) !== base) ruleOk = false;
  }
  const e1 = U64B_SEEDS.map((s) => +(ledgers["orF" + s].accRec - ledgers["dice" + s].accRec).toFixed(4));
  const e2 = U64B_SEEDS.map((s) => +(ledgers["orF" + s].accTra - ledgers["dice" + s].accTra).toFixed(4));
  const nE1 = e1.filter((d) => d >= 0.03).length, nE2 = e2.filter((d) => d >= 0.03).length;
  const winMax = U64B_SEEDS.map((s) => Math.max(...U64B_ARM_LIST.map((a) => ledgers[a + s].accRec)));
  const floorBad = winMax.filter((v) => v < 0.40).length;
  const sens = {};
  for (const f of [0.35, 0.40, 0.45]) sens[f] = U64B_SEEDS.filter((s) => Math.max(...U64B_ARM_LIST.map((a) => ledgers[a + s].accRec)) < f).length;
  const sensNote = (sens[0.35] >= 6 || sens[0.45] >= 6) !== (floorBad >= 6) ? "AMBIGUOUS-FLOOR (table disagrees with filed 0.40; verdict stands frozen)" : "floor table agrees with filed 0.40";
  const diceMean = +(U64B_SEEDS.reduce((x, s) => x + ledgers["dice" + s].accRec, 0) / 20).toFixed(4);
  let verdict = "", detail = "";
  if (!pin) { verdict = "PIN-FAIL"; detail = "stack drift"; }
  else if (!xh) { verdict = "HALT"; detail = "examHash mismatch"; }
  else if (!ruleOk) { verdict = "PIN-FAIL"; detail = "rule mismatch across arms"; }
  else if (floorBad >= 6) { verdict = "INCONCLUSIVE"; detail = "max-arm accRec<0.40 on " + floorBad + "/20 — exam too hard or diet too forgiving"; }
  else if (nE1 >= 15 || nE2 >= 15) { verdict = "PROCEED"; detail = "EDGE-E1 " + nE1 + "/20, EDGE-E2 " + nE2 + "/20 — punishing exam detects; U65 still needs own countersign"; }
  else { verdict = "KILL-LINE"; detail = "neither edge @quorum (E1 " + nE1 + "/20, E2 " + nE2 + "/20), floor holds — even punishing exam shows nothing; U65-U69 CANCELLED, close honestly"; }
  const perSeed = U64B_SEEDS.map((s) => {
    const r = { seed: s, e1margin: e1[s], e2margin: e2[s], winMax: winMax[s] };
    for (const a of U64B_ARM_LIST) r[a] = { rec: ledgers[a + s].accRec, tra: ledgers[a + s].accTra, adapt: adapt[a + s] };
    return r;
  });
  for (const r of perSeed) log("u64b s" + r.seed + " rec det/dice/orT/orF/shT=" + U64B_ARM_LIST.map((a) => r[a].rec).join("/") + " e1m=" + r.e1margin + " e2m=" + r.e2margin);
  const body = {
    spec: "self-u64b-exam-prereg", version: "v1.3", track: "U64b-EXAM", verdict, detail,
    bars: {
      "EDGE-E1": nE1 + "/20 (quorum 15/20; orF.accRec>=dice.accRec+0.03)",
      "EDGE-E2": nE2 + "/20 (quorum 15/20; orF.accTra>=dice.accTra+0.03)",
      "FLOOR": (20 - floorBad) + "/20 max-arm>=0.40 (INCONCLUSIVE if <15/20)",
      "FLOOR-SENSITIVITY": sens, "FLOOR-NOTE": sensNote,
      "DICE-ANCHOR": "dice.accRec mean " + diceMean + " (null empirical anchor; verdict follows filed 0.40)",
      "JOINT-CHANCE": "P(>=1 of two ~0.021 bars fires by chance) <= 0.041 conservative (filed)",
      "PIN": pin ? "100/100" : "FAIL", "EXAMHASH": xh ? "100/100 match" : "HALT", "RULE-IDENTITY": ruleOk ? "20/20" : "FAIL",
    },
    perSeed, deviations: ["I1..I9 as filed in driver header"],
  };
  await fs.writeTextFile(U64B_VERDICT_PATH, JSON.stringify(body));
  log("u64b-verdict " + verdict + " :: " + detail);
  return body;
};
