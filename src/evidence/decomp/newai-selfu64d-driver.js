// newai-selfu64d-driver.js — U64d BOTH (E-NE0e): punishing exam x wired response.
//
// Prereg: src/evidence/decomp/self-u64d-both-prereg.md v1.0 (filed in parallel; battery
// SKIPPED by owner override — "all 3 (for posterities sake)" = compute LICENSED as
// filed v1.0; battery-skipped-by-order recorded in CHATLOG 2026-11-27).
// Pin-version reconciliation (filed here, owner-override): v1.0 pins "U64b-exam v1.0
// values" with a version-up clause. U64b is now v1.3, but the v1.0->v1.3 changes were
// verdict/logic hardening (floor 0.40, HALT, sensitivity, joint bound, anchor, E2
// exactness wording) — the EXAM NUMBERS (streams 53100/53300/91400/91000, windows,
// bars +/-0.03, floor 0.40) are identical in substance. This driver runs v1.0's exam
// copy verbatim; examHash_D == filed U64b examHash is ASSERTED at W0 (definitional
// match over same file bytes + same consts + same window values), which enforces the
// no-dangling-ref requirement mechanically. NO PUSH. Log everything.
//
// Implementation (K1..K4):
//  K1 No exam copy: this driver evals the U64b driver and CALLS its exam functions
//     (u64bSlot/u64bSlotE1/u64bHeads/u64bReplayRule/u64bBuildMasks/u64bLoadModel —
//     function declarations leak across eval; U64B_* consts do not, re-declared here).
//     Only the outer loop is local (u64dExamOn), parameterized by armCode: 101 for the
//     fidelity cross-check, 106 (detT, filed) for production. Policy is pick-max either
//     way (detT = det policy; u64bSlot* map non-dice/non-orF to pick-max).
//  K2 examHash_D = u32Sha256Hex(u64bDriverBytes + u64DriverBytes + streamConsts +
//     windowTable20-from-detT-trunks). Asserted == filed U64b W0 examHash (tables are
//     value-identical: detT rules == U64 rules by U64c RULE-IDENTITY 20/20, re-asserted
//     here reads-only). W1 recomputes and re-asserts (drift check = hash's purpose).
//  K3 W0 fidelity cross-check (the loop-copy risk, closed): u64dExamOn(G, filedDetTrunk,
//     101) MUST equal the filed U64b det ledger modulo wallMs on seeds 0,1,2 — proves
//     the local loop sequences the shared functions identically. HALT otherwise.
//  K4 dice comparison ledgers: filed U64b W1 dice ledgers (same seeds, same exam —
//     reads-only reuse, never recomputed).
//
// RUN (execute_js, fs in scope; ONLY under owner countersign above):
//   const src = await fs.readTextFile("src/evidence/decomp/newai-selfu64d-driver.js");
//   (0, eval)(src + "\n//# sourceURL=newai-selfu64d-driver.js");
//   await globalThis.SelfU64dInit(fs);
//   const log = (m) => console.log(m);
//   await globalThis.runU64dWave0(fs, log);
//   await globalThis.runU64dWave1(fs, log);
globalThis.SelfU64dInit = async function (fs) {
  const src = await fs.readTextFile("src/evidence/decomp/newai-selfu64b-driver.js");
  (0, eval)(src + "\n//# sourceURL=newai-selfu64b-driver.js");
  await globalThis.SelfU64bInit(fs);
  for (const f of ["u64bExam", "u64bSlot", "u64bSlotE1", "u64bHeads", "u64bReplayRule",
    "u64bBuildMasks", "u64bLoadModel", "u64bArgmax4", "u64bStreamConsts",
    "u33StackHash", "inSeqMakeModel", "inSeqForward", "inMeanLogits"]) {
    let present = typeof globalThis[f] !== "undefined";
    if (!present) { try { present = (0, eval)("typeof " + f) !== "undefined"; } catch (e) { present = false; } }
    if (!present) throw new Error("U64d stack load failed: " + f);
  }
  // NOTE (U64b lesson): U64b driver's `const` bindings do NOT leak from indirect eval.
  // U64D_* re-declared locally (values verified identical; examHash_D enforces).
};
const U64D_STACK_LOCAL = "258d2f060684ce382778e203959ab791abb5df79af174deef19ff568886d4d6e";
const U64D_DETT = 106, U64D_DET = 101;
const U64D_SEEDS = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19];
const U64D_WAVE0_PATH = "src/evidence/decomp/d-newai-self-u64d-wave0.json";
const U64D_VERDICT_PATH = "src/evidence/decomp/d-newai-self-u64d-verdict.json";
function u64dLedgerPath(seed) { return "src/evidence/decomp/d-newai-self-u64d-detT-s" + seed + ".json"; }
function u64dDetTTrunkPath(seed) { return "src/evidence/decomp/d-newai-self-u64c-detT-s" + seed + "-800st.json"; }
function u64dU64bLedgerPath(arm, seed) { return "src/evidence/decomp/d-newai-self-u64b-" + arm + "-s" + seed + ".json"; }
// Local outer loop over SHARED U64b exam operators (K1). armCode selects the stream.
function u64dExamOn(G, trunk, armCode) {
  const seed = trunk.seed;
  const rep = u64bReplayRule(G, seed, trunk.rule);
  const M = u64bLoadModel(G, trunk);
  const e1Masks = u64bBuildMasks(G, 91000, seed);
  const e2Masks = u64bBuildMasks(G, 91400, seed);
  const dataRng = G.makeRng(53100 + seed * 104729 + 55 + armCode);
  const rec = [0, 0, 0]; let recN = 0, scrN = 0, orcN = 0, fb1 = 0;
  const qk1 = new Map();
  for (let w = 0; w < 3; w++) {
    const hot = trunk.rule.hotSeq[w + 1];
    for (let t = 0; t < 50; t++) {
      const step = trunk.rule.b[w] + 1 + t;
      const s = u64bSlotE1(M, dataRng, qk1, e1Masks, "det", hot, trunk.rule, step);
      qk1.set(s.pick.qk, (qk1.get(s.pick.qk) || 0) + 1);
      if (s.pick.qk === hot[0] || s.pick.qk === hot[1]) rec[w]++;
      recN++;
      const hh = u64bHeads(M, s.pick, e1Masks);
      scrN += hh.scr; orcN += hh.orc; fb1 += s.fallback;
    }
  }
  const e2Rng = G.makeRng(53300 + seed);
  const nh = rep.novelHot;
  let tra = 0, tScr = 0, tOrc = 0, fb2 = 0;
  const qk2 = new Map();
  for (let i = 0; i < 200; i++) {
    const s = u64bSlot(M, e2Rng, qk2, e2Masks, "det", nh);
    qk2.set(s.pick.qk, (qk2.get(s.pick.qk) || 0) + 1);
    if (s.pick.qk === nh[0] || s.pick.qk === nh[1]) tra++;
    const hh = u64bHeads(M, s.pick, e2Masks);
    tScr += hh.scr; tOrc += hh.orc; fb2 += s.fallback;
  }
  return {
    seed,
    accRec: +((rec[0] + rec[1] + rec[2]) / recN).toFixed(4),
    rec1: +(rec[0] / 50).toFixed(4), rec2: +(rec[1] / 50).toFixed(4), rec3: +(rec[2] / 50).toFixed(4),
    accTra: +(tra / 200).toFixed(4),
    accRecScr: +(scrN / recN).toFixed(4), accRecOrc: +(orcN / recN).toFixed(4),
    accTraScr: +(tScr / 200).toFixed(4), accTraOrc: +(tOrc / 200).toFixed(4),
    novelHot: nh, novelCandidates: rep.novelCandidates, ruleDrawCount: rep.ruleDrawCount,
    rule: trunk.rule, orFallbackE1: fb1, orFallbackE2: fb2,
  };
}
async function u64dExamHash(G) {
  const sha = (0, eval)("u32Sha256Hex");
  const bsrc = await fs.readTextFile("src/evidence/decomp/newai-selfu64b-driver.js");
  const usrc = await fs.readTextFile("src/evidence/decomp/newai-selfu64-driver.js");
  const table = [];
  for (const seed of U64D_SEEDS) {
    const trunk = JSON.parse(await fs.readTextFile(u64dDetTTrunkPath(seed)));
    const rep = u64bReplayRule(G, seed, trunk.rule);
    table.push({ seed, b: trunk.rule.b, hotSeq: trunk.rule.hotSeq, novelHot: rep.novelHot, novelCandidates: rep.novelCandidates, ruleDrawCount: rep.ruleDrawCount, wave0draws: rep.wave0draws });
  }
  return { hash: await sha(bsrc + "\n" + usrc + "\n" + u64bStreamConsts() + "\n" + JSON.stringify(table)), table };
}
globalThis.runU64dWave0 = async function (fs, log, opts) {
  if (!(opts && opts.force)) { try { const prev = JSON.parse(await fs.readTextFile(U64D_WAVE0_PATH)); if (prev && prev.verdict === "COMPLETE") { log(U64D_WAVE0_PATH + " exists, skip"); return prev; } } catch (e) { /* pass */ } }
  const G = await globalThis.IntrinsicInit(fs);
  const h = await globalThis.u33StackHash(fs);
  if (h.hex !== U64D_STACK_LOCAL) throw new Error("U64d-PIN HALT: stack drift");
  // Artifact presence: 20 detT trunks + PIN.
  for (const s of U64D_SEEDS) {
    const tr = JSON.parse(await fs.readTextFile(u64dDetTTrunkPath(s)));
    if (tr.stackHash !== U64D_STACK_LOCAL) throw new Error("U64d-PIN HALT: detT trunk drift s" + s);
    if (tr.verdict !== "COMPLETE") throw new Error("U64d HALT: detT trunk incomplete s" + s);
    // World-identical spot: detT rule == filed U64 det rule (full 20, reads-only).
    const f = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-u64-det-s" + s + "-800st.json")).rule;
    if (JSON.stringify(tr.rule.hotSeq) !== JSON.stringify(f.hotSeq) || JSON.stringify(tr.rule.b) !== JSON.stringify(f.b)) throw new Error("U64d HALT: detT rule vs filed U64 s" + s);
  }
  log("u64d-wave0 artifact presence 20/20 detT trunks PIN + world-identical vs filed U64");
  // U64b W1 verdict filed + COMPLETE.
  const u64bV = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-u64b-verdict.json"));
  if (u64bV.verdict !== "PROCEED" || u64bV.version !== "v1.3") throw new Error("U64d HALT: U64b W1 verdict not filed as expected");
  log("u64d-wave0 U64b W1 verdict filed (" + u64bV.verdict + " " + u64bV.version + ") — presence only, no gating");
  // examHash equality (K2): recomputed over detT windows == filed U64b examHash.
  const u64bW0 = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-u64b-wave0.json"));
  const { hash } = await u64dExamHash(G);
  if (hash !== u64bW0.examHash) throw new Error("U64d HALT: examHash mismatch vs U64b");
  log("u64d-wave0 examHash match " + hash.slice(0, 16) + "... (no dangling refs)");
  // Loop-fidelity cross-check (K3): det/101 reproduces filed U64b det ledgers s0..s2.
  for (const s of [0, 1, 2]) {
    const trunk = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-u64-det-s" + s + "-800st.json"));
    const mine = u64dExamOn(G, trunk, U64D_DET);
    const filed = JSON.parse(await fs.readTextFile(u64dU64bLedgerPath("det", s)));
    const strip = (o) => { const c = Object.assign({}, o); delete c.arm; delete c.wallMs; delete c.driverHash; delete c.spec; delete c.version; delete c.verdict; delete c.scoring; delete c.stackHash; delete c.examHash; return JSON.stringify(c); };
    if (strip(mine) !== strip(filed)) throw new Error("U64d Wave-0 HALT: fidelity cross-check s" + s);
  }
  log("u64d-wave0 fidelity 3/3 (det/101 reproduces filed U64b det ledgers exactly)");
  // Crash-test + determinism twin on detT.
  const t1 = JSON.parse(await fs.readTextFile(u64dDetTTrunkPath(1)));
  const c = u64dExamOn(G, t1, U64D_DETT);
  for (const k of ["accRec", "accTra"]) if (!(c[k] >= 0 && c[k] <= 1 && isFinite(c[k]))) throw new Error("U64d Wave-0 HALT: crash-test " + k);
  const t0 = JSON.parse(await fs.readTextFile(u64dDetTTrunkPath(0)));
  if (JSON.stringify(u64dExamOn(G, t0, U64D_DETT)) !== JSON.stringify(u64dExamOn(G, t0, U64D_DETT))) throw new Error("U64d Wave-0 HALT: nondeterminism");
  log("u64d-wave0 crash-test detT s1 accRec=" + c.accRec + " accTra=" + c.accTra + "; twin exact");
  const tStart = Date.now();
  u64dExamOn(G, t0, U64D_DETT);
  const msPer = Date.now() - tStart;
  const body = { spec: "self-u64d-both-prereg", version: "v1.0", wave: 0, verdict: "COMPLETE", stackHash: h.hex, examHash: hash, msPerExam: msPer, implNotes: ["K1 shared U64b operators, local loop, armCode param", "K2 examHash_D == U64b examHash asserted", "K3 fidelity 3/3 det/101", "K4 filed U64b dice ledgers reused"] };
  await fs.writeTextFile(U64D_WAVE0_PATH, JSON.stringify(body));
  log("u64d-wave0 COMPLETE");
  return body;
};
globalThis.runU64dWave1 = async function (fs, log, opts) {
  const G = await globalThis.IntrinsicInit(fs);
  const w0 = JSON.parse(await fs.readTextFile(U64D_WAVE0_PATH));
  if (w0.verdict !== "COMPLETE") throw new Error("U64d HALT: W0 not COMPLETE");
  const h = await globalThis.u33StackHash(fs);
  if (h.hex !== U64D_STACK_LOCAL) throw new Error("U64d-PIN HALT: stack drift");
  const { hash } = await u64dExamHash(G);
  if (hash !== w0.examHash) throw new Error("U64d HALT: examHash drift pre-W1");
  let driverHash = "n/a";
  try { driverHash = await (0, eval)("u32Sha256Hex")(await fs.readTextFile("src/evidence/decomp/newai-selfu64d-driver.js")); } catch (e) { /* pass */ }
  const ledgers = {};
  for (const seed of U64D_SEEDS) {
    const lp = u64dLedgerPath(seed);
    if (!(opts && opts.force)) { try { const prev = JSON.parse(await fs.readTextFile(lp)); if (prev && prev.verdict === "COMPLETE") { log(lp + " exists, skip"); ledgers[seed] = prev; continue; } } catch (e) { /* pass */ } }
    const trunk = JSON.parse(await fs.readTextFile(u64dDetTTrunkPath(seed)));
    if (trunk.stackHash !== U64D_STACK_LOCAL) throw new Error("U64d-PIN HALT: trunk drift s" + seed);
    const t0 = Date.now();
    const exam = u64dExamOn(G, trunk, U64D_DETT);
    exam.arm = "detT";
    exam.stackHash = h.hex;
    exam.examHash = hash;
    exam.driverHash = driverHash;
    exam.wallMs = Date.now() - t0;
    exam.spec = "self-u64d-both-prereg"; exam.version = "v1.0"; exam.verdict = "COMPLETE";
    await fs.writeTextFile(lp, JSON.stringify(exam));
    ledgers[seed] = exam;
    log("u64d-w1 detT s" + seed + " accRec=" + exam.accRec + " accTra=" + exam.accTra + " (" + exam.wallMs + "ms)");
  }
  // Verdict (firewall: accRec/accTra new+filed, stackHash, examHash).
  const dice = {};
  for (const s of U64D_SEEDS) dice[s] = JSON.parse(await fs.readTextFile(u64dU64bLedgerPath("dice", s)));
  const pin = U64D_SEEDS.every((s) => ledgers[s].stackHash === U64D_STACK_LOCAL && ledgers[s].examHash === w0.examHash);
  const e1 = U64D_SEEDS.map((s) => +(ledgers[s].accRec - dice[s].accRec).toFixed(4));
  const e2 = U64D_SEEDS.map((s) => +(ledgers[s].accTra - dice[s].accTra).toFixed(4));
  const nE1 = e1.filter((d) => d >= 0.03).length, nE2 = e2.filter((d) => d >= 0.03).length;
  const winMax = U64D_SEEDS.map((s) => Math.max(ledgers[s].accRec, dice[s].accRec));
  const floorBad = winMax.filter((v) => v < 0.40).length;
  let verdict = "", detail = "";
  if (!pin) { verdict = "PIN-FAIL"; detail = "stack/examHash drift"; }
  else if (floorBad >= 6) { verdict = "INCONCLUSIVE"; detail = "max(detT,filed dice) accRec<0.40 on " + floorBad + "/20"; }
  else if (nE1 >= 15 || nE2 >= 15) { verdict = "BOTH-WORKS"; detail = "BOTH-E1 " + nE1 + "/20, BOTH-E2 " + nE2 + "/20 — combined cell detects"; }
  else { verdict = "BOTH-DEAD"; detail = "neither @quorum (E1 " + nE1 + "/20, E2 " + nE2 + "/20), floor holds — interaction buys nothing"; }
  const perSeed = U64D_SEEDS.map((s) => ({ seed: s, detT_rec: ledgers[s].accRec, dice_rec: dice[s].accRec, e1m: e1[s], detT_tra: ledgers[s].accTra, dice_tra: dice[s].accTra, e2m: e2[s] }));
  for (const r of perSeed) log("u64d s" + r.seed + " rec detT/dice=" + r.detT_rec + "/" + r.dice_rec + " e1m=" + r.e1m + " tra detT/dice=" + r.detT_tra + "/" + r.dice_tra + " e2m=" + r.e2m);
  const body = {
    spec: "self-u64d-both-prereg", version: "v1.0", track: "U64d-BOTH", verdict, detail,
    bars: {
      "BOTH-E1": nE1 + "/20 (quorum 15/20; detT.accRec>=filed dice.accRec+0.03)",
      "BOTH-E2": nE2 + "/20 (quorum 15/20; detT.accTra>=filed dice.accTra+0.03)",
      "FLOOR": (20 - floorBad) + "/20 max(detT,dice)>=0.40 (INCONCLUSIVE if <15/20)",
      "PIN": pin ? "20/20" : "FAIL",
    },
    perSeed, deviations: ["K1..K4 as filed in driver header; pin-version reconciled by owner override"],
  };
  await fs.writeTextFile(U64D_VERDICT_PATH, JSON.stringify(body));
  log("u64d-verdict " + verdict + " :: " + detail);
  return body;
};
