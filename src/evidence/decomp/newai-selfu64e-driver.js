// newai-selfu64e-driver.js — U64e ONLINE (E-NE0f): modulation live, during behavior.
//
// Prereg: src/evidence/decomp/self-u64e-online-prereg.md v1.4 STANDS (battery CLOSED
// 2026-11-27: v1.0 barrage 6 adopted + round-2 9 adopted + red 5 adopted + re-close
// 1 gloss (D6) + micro-confirm 3/3 STANDS; 21 adoptions; premises v1.0-v1.4).
// Cover: owner 2026-11-27 "Lets go ahead and run U64e" = COMPUTE LICENSED for
// U64e v1.4 (Wave 0 -> Wave 1, 80 reads-only re-evals on filed det trunks).
// NO PUSH. Log everything.
//
// Stack: U64b driver eval'd below (u64DietSingle/u43ScoreRow/u46AlignedDraws/
// u64bLoadModel/u64bReplayRule/u64bBuildMasks + full U64->U32 chain). Exam is
// READS-ONLY: no training, no gradients, frozen filed det weights; the ONLY thing
// that moves live is qkCount hygiene (resets) + blind pick windows.
//
// Implementation choices filed here (E1..E7; verdict firewall reads ONLY
// {accRec, stackHash} + filed {dice.accRec, dice.rec1..3}):
//  E1 Exam: E1-ONLY (E2 skipped — ceiling, filed). 3 windows x 50 slots, global
//     step = rule.b[w]+1+t (t=0..49), correctness = picked qk in current true hot
//     hotSeq[w+1] (u64Quarter gives w+1 automatically on true steps). Fresh qkCount
//     Map at pass start. ALL 4 arms run the SAME filed det trunk per seed (exam-time
//     policy comparison — weights identical across arms by construction).
//     e1Rng per-arm G.makeRng(53500+seed*104729+55+armCode) (filed disjoint base).
//     Masks u64bBuildMasks(G,91000,seed) verbatim. Candidates via u64DietSingle
//     (dataRng, rule, step) + u46AlignedDraws block ALWAYS (D4 verbatim; aligned
//     draws unused by non-dice policies but consumed to keep the filed op sequence).
//     No heads (scr/orc not in U64e ledger — fewer draws, cleaner; filed here).
//  E2 Policies (frozen M; exploit = pick-max s*n; blind = cands[blindRng.int(6)],
//     weight-blind by construction, fallback NEVER — filed, always logged 0):
//     orReset (107): at window-start slots t in {0,50,100}: clear qkCount pre-pick,
//       exploit immediately. No monitor, no blind. B0 null.
//     surBlind (108): passive monitor every slot incl. blind slots: m = mean r.s
//       over 6 cands pre-pick. B0 = mean m over pass slots 0..7 (burn-in picks are
//       exploit). Checks run t>=8 (t=7 can never fire: trailing==burn-in). Fire iff
//       trailing-8 mean(m) > 2*B0 AND trailing-8 MIN(m) > B0 AND t-lastFire >= 20
//       AND nFire < 6. Fire evaluated PRE-PICK: record t, clear qkCount, blind=10
//       (fire slot + next 9), then pick. blindRng =
//       G.makeRng(53600+seed*104729+55+armCode) per (arm,seed), sequential.
//     orBlind (109): triggers at t in {0,50,100}: pre-pick clear + blind=10 (same
//       K, same blindRng construction). LOGGED diagnostic, no verdict role.
//     randBlind (110): offsets off[w] = randRng.int(50) drawn UPFRONT from
//       G.makeRng(53800+seed) (dedicated stream); triggers at t = w*50+off[w]:
//       same clear + blind=10. Re-fire inside an active blind window (possible only
//       here: off[w]=49 & off[w+1]=0): clear again + restart blind counter at 10.
//       (surBlind/orBlind windows can never overlap: refractory 20 > 10, oracle
//       triggers 50 apart.)
//  E3 Ledger per (arm,seed): {arm, seed, accRec, rec1, rec2, rec3, triggers (pass
//     slots), nTriggers, hits (trigger steps in [b,b+20]), falseAlarms (=n-hits),
//     detectRate (windows with >=1 hit / 3), meanSurprise [w1,w2,w3] (all arms,
//     passive), blindHit (blind-correct/blindPicks, null if 0), blindFamiliar
//     (blind picks with pre-pick count>0), blindPicks, B0 (surBlind only), rule,
//     stackHash, examHash, driverHash, wallMs, spec, version, verdict COMPLETE}.
//     dice.accRec/rec1-3: FILED U64b W1 dice ledgers, same seeds, never recomputed.
//  E4 Trigger unit check (static, pre-run): canned m[40] = 0.5 x8 (B0=0.5),
//     1.2 x8 (idx 8..15), 0.1 x10 (16..25), 1.5 x10 (26..35), 0.1 x4 (36..39).
//     Expected fires [15, 35]: t=15 trailing 8..15 all 1.2 (mean 1.2>1.0, min ok,
//     no prior); t=33 trailing all 1.5 but 33-15=18 <20 refractory BLOCKS; t=34
//     19 <20 BLOCKS; t=35 trailing 28..35 all 1.5, 35-15=20 >=20 FIRES; t>=36 min
//     fails. Driver asserts exact [15,35], else HALT.
//  E5 Verdict (firewall: accRec/stackHash + filed dice only): LOOP =
//     #{s: sur-dice >= 0.03} >= 15; RESET = #{s: orR-dice >= 0.03} >= 15;
//     RAND = #{s: rand-dice >= 0.03} >= 15. Floor: per-seed max over 4 arms < 0.40,
//     bad = #seeds; sens 0.35/0.45 (disagreement -> AMBIGUOUS-FLOOR note, verdict
//     frozen at 0.40). Order: PIN-FAIL -> HALT (examHash) -> INCONCLUSIVE (floor,
//     shape F3) -> CLOSED-LOOP-WORKS (LOOP && !RAND) -> TRIGGER-INSENSITIVE
//     (LOOP && RAND, demoted — timing doesn't matter; shape N/A) -> ORACLE-ONLY
//     (!LOOP && RESET; F4 vs F5 below) -> NEITHER-WITH-DIAGNOSIS (!LOOP && !RESET;
//     F1 vs F2 below). MECHANISM-SURPRISE note when RAND && !LOOP (verdict stands).
//     Shapes (filed partition — priority F3>F1>F2>F4>F5 holds without ties):
//     F1 (under NEITHER): !RESET && mean(orR-dice) < +0.015 -> counts-not-bottleneck
//       (U64f). F2 (under NEITHER, F1 missed): mean(orB-orR) <= -0.03 -> blind-drag
//       (U64g). Else UNCLASSIFIED with all numbers (owner decides; needs own
//       prereg+battery+countersign). F4 (under ORACLE-ONLY): mean surBlind
//       detectRate < 0.5 || mean FA > 3 -> monitor-blind (U64h). F5 (under
//       ORACLE-ONLY, F4 missed): detectRate >= 0.8 -> good-detection-no-gain (U64h
//       variant). Else F4/F5-BORDERLINE with numbers. Rationale for "oracle works"
//       as filed: under NEITHER quorum-RESET is dead BY CONSTRUCTION, so the only
//       consistent reading is contextual (F4/F5 adjudicate ORACLE-ONLY per prereg
//       "F4/F5 path"; F1/F2 adjudicate NEITHER per "monitor presupposes mechanism").
//     Generation g=1 (first generation citing U64e shapes); W0 asserts 1 <= 6.
//     LINE-HALT impossible on gen 1 (no line history — filed). The verdict FILE's
//     `verdict` field LITERALLY reads the label (C8 enforcement; ledgers are
//     written pre-verdict so they carry COMPLETE). D1 pattern (diagnostic): per-arm
//     mean rec1/rec2/rec3 margins vs dice (prediction: live arms rec1 ~= dice).
//     D2 (diagnostic): surBlind-vs-randBlind blindHit gap. Joint chance <= 0.041
//     conservative (U64b method; credited-win <= surBlind-clears).
//  E6 PIN note: prereg PIN line says "60 ledgers" (v1.0 3-arm carryover); driver
//     PINs all 80 (4x20) — filed intent (every ledger) dominates the stale count.
//  E7 Driver file MUST NOT be edited between W0 and W1 (examHash covers bytes).
//
// RUN (execute_js, fs in scope; ONLY under owner countersign above):
//   const src = await fs.readTextFile("src/evidence/decomp/newai-selfu64e-driver.js");
//   (0, eval)(src + "\n//# sourceURL=newai-selfu64e-driver.js");
//   await globalThis.SelfU64eInit(fs);
//   const log = (m) => console.log(m);
//   await globalThis.runU64eWave0(fs, log);
//   await globalThis.runU64eWave1(fs, log);
globalThis.SelfU64eInit = async function (fs) {
  const src = await fs.readTextFile("src/evidence/decomp/newai-selfu64b-driver.js");
  (0, eval)(src + "\n//# sourceURL=newai-selfu64b-driver.js");
  await globalThis.SelfU64bInit(fs);
  for (const f of ["u64DietSingle", "u43ScoreRow", "u46AlignedDraws", "u64bLoadModel",
    "u64bReplayRule", "u64bBuildMasks", "u33StackHash", "inSeqMakeModel",
    "inSeqForward", "inMeanLogits"]) {
    let present = typeof globalThis[f] !== "undefined";
    if (!present) { try { present = (0, eval)("typeof " + f) !== "undefined"; } catch (e) { present = false; } }
    if (!present) throw new Error("U64e stack load failed: " + f);
  }
};
const U64E_STACK_LOCAL = "258d2f060684ce382778e203959ab791abb5df79af174deef19ff568886d4d6e";
const U64E_ARMS = { orReset: 107, surBlind: 108, orBlind: 109, randBlind: 110 };
const U64E_ARM_LIST = ["orReset", "surBlind", "orBlind", "randBlind"];
const U64E_SEEDS = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19];
const U64E_E1_BASE = 53500, U64E_BLIND_BASE = 53600, U64E_RAND_BASE = 53800, U64E_EVAL_MASK = 91000;
const U64E_K = 10, U64E_BURN = 8, U64E_REFR = 20, U64E_CAP = 6;
const U64E_WAVE0_PATH = "src/evidence/decomp/d-newai-self-u64e-wave0.json";
const U64E_VERDICT_PATH = "src/evidence/decomp/d-newai-self-u64e-verdict.json";
function u64eLedgerPath(arm, seed) { return "src/evidence/decomp/d-newai-self-u64e-" + arm + "-s" + seed + ".json"; }
function u64eDetTrunkPath(seed) { return "src/evidence/decomp/d-newai-self-u64-" + "det-s" + seed + "-800st.json"; }
function u64eDiceLedgerPath(seed) { return "src/evidence/decomp/d-newai-self-u64b-dice-s" + seed + ".json"; }
function u64eStreamConsts() {
  return "E1_BASE=" + U64E_E1_BASE + "|BLIND_BASE=" + U64E_BLIND_BASE + "|RAND_BASE=" + U64E_RAND_BASE +
    "|EVAL_MASK=" + U64E_EVAL_MASK + "|C=6|E1W=50|K=10|BURN=8|REFR=20|CAP=6";
}
// Pure trigger decision (E2 surBlind). mHist: array of m; t: current slot; B0;
// lastFire (-1 none); nFire. Returns true iff fire.
function u64eShouldFire(mHist, t, B0, lastFire, nFire) {
  if (t < U64E_BURN) return false;
  if (nFire >= U64E_CAP) return false;
  if (lastFire >= 0 && t - lastFire < U64E_REFR) return false;
  let mn = Infinity, sum = 0;
  for (let k = t - 7; k <= t; k++) { const v = mHist[k]; sum += v; if (v < mn) mn = v; }
  return (sum / 8 > 2 * B0) && (mn > B0);
}
function u64eUnitCheck() {
  const m = [];
  for (let i = 0; i < 8; i++) m.push(0.5);
  for (let i = 0; i < 8; i++) m.push(1.2);
  for (let i = 0; i < 10; i++) m.push(0.1);
  for (let i = 0; i < 10; i++) m.push(1.5);
  for (let i = 0; i < 4; i++) m.push(0.1);
  const fires = [];
  let last = -1;
  for (let t = 8; t < m.length; t++) {
    if (u64eShouldFire(m, t, 0.5, last, fires.length)) { fires.push(t); last = t; }
  }
  if (JSON.stringify(fires) !== "[15,35]") throw new Error("U64e Wave-0 HALT: unit check fires=" + JSON.stringify(fires) + " expected [15,35]");
  return fires;
}
// Full E1 exam on one filed det trunk under one arm policy. Returns ledger body.
function u64eExam(G, trunk, arm) {
  const seed = trunk.seed;
  const armCode = U64E_ARMS[arm];
  u64bReplayRule(G, seed, trunk.rule);
  const M = u64bLoadModel(G, trunk);
  const masks = u64bBuildMasks(G, U64E_EVAL_MASK, seed);
  const dataRng = G.makeRng(U64E_E1_BASE + seed * 104729 + 55 + armCode);
  const blindRng = G.makeRng(U64E_BLIND_BASE + seed * 104729 + 55 + armCode);
  const randRng = G.makeRng(U64E_RAND_BASE + seed);
  const off = [randRng.int(50), randRng.int(50), randRng.int(50)];
  const randTrig = arm === "randBlind" ? [0 * 50 + off[0], 1 * 50 + off[1], 2 * 50 + off[2]] : [];
  const qk = new Map();
  const rec = [0, 0, 0];
  const mWin = [[], [], []];
  const triggers = [];
  let lastFire = -1, blindLeft = 0, blindPicks = 0, blindCorrect = 0, blindFam = 0;
  const mHist = [];
  let B0sum = 0;
  for (let w = 0; w < 3; w++) {
    const hot = trunk.rule.hotSeq[w + 1];
    for (let t = 0; t < 50; t++) {
      const pt = w * 50 + t; // pass slot 0..149
      const step = trunk.rule.b[w] + 1 + t;
      const cands = [];
      for (let c = 0; c < 6; c++) cands.push(u64DietSingle(dataRng, trunk.rule, step));
      const rs = cands.map((e) => u43ScoreRow(M, e, qk, masks));
      const sn = rs.map((r) => r.s * r.n);
      u46AlignedDraws(dataRng); // filed op sequence (D4 verbatim), unused by policy
      const m = (rs[0].s + rs[1].s + rs[2].s + rs[3].s + rs[4].s + rs[5].s) / 6;
      mHist.push(m);
      mWin[w].push(m);
      if (pt < U64E_BURN) B0sum += m;
      // trigger decision PRE-PICK
      let fire = false;
      if (arm === "surBlind") {
        if (pt >= U64E_BURN) {
          const B0 = B0sum / U64E_BURN;
          if (u64eShouldFire(mHist, pt, B0, lastFire, triggers.length)) fire = true;
        }
      } else if (arm === "orBlind") {
        if (pt === 0 || pt === 50 || pt === 100) fire = true;
      } else if (arm === "randBlind") {
        if (pt === randTrig[0] || pt === randTrig[1] || pt === randTrig[2]) fire = true;
      } else if (arm === "orReset") {
        if (pt === 0 || pt === 50 || pt === 100) { qk.clear(); }
      }
      if (fire) { triggers.push(pt); lastFire = pt; qk.clear(); blindLeft = U64E_K; }
      // pick
      let pi, blind = false;
      if (blindLeft > 0) { pi = blindRng.int(6); blind = true; blindLeft--; }
      else { pi = 0; for (let c = 1; c < 6; c++) if (sn[c] > sn[pi]) pi = c; }
      const pick = cands[pi];
      if (blind) {
        blindPicks++;
        if (pick.qk === hot[0] || pick.qk === hot[1]) blindCorrect++;
        if ((qk.get(pick.qk) || 0) > 0) blindFam++;
      }
      qk.set(pick.qk, (qk.get(pick.qk) || 0) + 1);
      if (pick.qk === hot[0] || pick.qk === hot[1]) rec[w]++;
    }
  }
  const hits = triggers.filter((pt) => {
    const w = Math.floor(pt / 50), tt = pt % 50;
    const step = trunk.rule.b[w] + 1 + tt;
    return step - trunk.rule.b[w] >= 0 && step - trunk.rule.b[w] <= 20;
  }).length;
  const wins = [false, false, false];
  for (const pt of triggers) wins[Math.floor(pt / 50)] = true;
  const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;
  return {
    arm, seed,
    accRec: +((rec[0] + rec[1] + rec[2]) / 150).toFixed(4),
    rec1: +(rec[0] / 50).toFixed(4), rec2: +(rec[1] / 50).toFixed(4), rec3: +(rec[2] / 50).toFixed(4),
    triggers, nTriggers: triggers.length, hits, falseAlarms: triggers.length - hits,
    detectRate: +((wins[0] + wins[1] + wins[2]) / 3).toFixed(4),
    meanSurprise: [+(mean(mWin[0])).toFixed(4), +(mean(mWin[1])).toFixed(4), +(mean(mWin[2])).toFixed(4)],
    blindHit: blindPicks > 0 ? +(blindCorrect / blindPicks).toFixed(4) : null,
    blindFamiliar: blindPicks > 0 ? +(blindFam / blindPicks).toFixed(4) : null,
    blindPicks, B0: arm === "surBlind" ? +(B0sum / U64E_BURN).toFixed(4) : null,
    randOffsets: arm === "randBlind" ? off : null,
    rule: trunk.rule, orFallbackE1: 0,
  };
}
async function u64eExamHash(fs, G) {
  const sha = (0, eval)("u32Sha256Hex");
  const esrc = await fs.readTextFile("src/evidence/decomp/newai-selfu64e-driver.js");
  const bsrc = await fs.readTextFile("src/evidence/decomp/newai-selfu64b-driver.js");
  const usrc = await fs.readTextFile("src/evidence/decomp/newai-selfu64-driver.js");
  const table = [];
  for (const seed of U64E_SEEDS) {
    const trunk = JSON.parse(await fs.readTextFile(u64eDetTrunkPath(seed)));
    table.push({ seed, b: trunk.rule.b, hotSeq: trunk.rule.hotSeq });
  }
  return { hash: await sha(esrc + "\n" + bsrc + "\n" + usrc + "\n" + u64eStreamConsts() + "\n" + JSON.stringify(table)), table };
}
globalThis.runU64eWave0 = async function (fs, log, opts) {
  if (!(opts && opts.force)) { try { const prev = JSON.parse(await fs.readTextFile(U64E_WAVE0_PATH)); if (prev && prev.verdict === "COMPLETE") { log(U64E_WAVE0_PATH + " exists, skip"); return prev; } } catch (e) {} }
  const G = await globalThis.IntrinsicInit(fs);
  const h = await globalThis.u33StackHash(fs);
  if (h.hex !== U64E_STACK_LOCAL) throw new Error("U64e-PIN HALT: stack drift " + h.hex.slice(0, 16));
  for (const seed of [0, 1, 2]) {
    const tr = JSON.parse(await fs.readTextFile(u64eDetTrunkPath(seed)));
    if (tr.stackHash !== U64E_STACK_LOCAL) throw new Error("U64e-PIN HALT: trunk drift s" + seed);
    if (tr.verdict !== "COMPLETE") throw new Error("U64e HALT: trunk incomplete s" + seed);
    u64bReplayRule(G, seed, tr.rule);
  }
  log("u64e-wave0 PIN 3/3 det trunks literal-match + replay exact");
  const unit = u64eUnitCheck();
  log("u64e-wave0 trigger unit check fires=[" + unit + "] (filed [15,35])");
  const tr0 = JSON.parse(await fs.readTextFile(u64eDetTrunkPath(0)));
  const a = u64eExam(G, tr0, "surBlind"), b = u64eExam(G, tr0, "surBlind");
  const sa = JSON.stringify(a), sb = JSON.stringify(b);
  if (sa !== sb) throw new Error("U64e Wave-0 HALT: exam nondeterminism (monitor state?)");
  log("u64e-wave0 determinism twin exact (surBlind s0 incl monitor, " + sa.length + "B)");
  const tr1 = JSON.parse(await fs.readTextFile(u64eDetTrunkPath(1)));
  const c = u64eExam(G, tr1, "surBlind");
  for (const k of ["accRec", "rec1", "rec2", "rec3", "detectRate", "blindHit"]) {
    if (c[k] !== null && !(c[k] >= 0 && c[k] <= 1 && isFinite(c[k]))) throw new Error("U64e Wave-0 HALT: crash-test metric " + k + "=" + c[k]);
  }
  log("u64e-wave0 crash-test surBlind s1 accRec=" + c.accRec + " nTrig=" + c.nTriggers + " B0=" + c.B0);
  let b0margin = Infinity;
  for (const seed of U64E_SEEDS) {
    const tr = JSON.parse(await fs.readTextFile(u64eDetTrunkPath(seed)));
    const mg = tr.rule.b[0] - 8;
    if (mg < b0margin) b0margin = mg;
  }
  log("u64e-wave0 burn-in margin min(b0-8)=" + b0margin + " over 20 seeds (filed expectation >=150; LOGGED check only)");
  const eh = await u64eExamHash(fs, G);
  log("u64e-wave0 examHash=" + eh.hash.slice(0, 16) + "...");
  const t0 = Date.now();
  u64eExam(G, tr0, "surBlind");
  const msPer = Date.now() - t0;
  log("u64e-wave0 dry-run 1 exam ~" + msPer + "ms; project W1 ~" + Math.round((msPer * 80) / 1000) + "s");
  const body = { spec: "self-u64e-online-prereg", version: "v1.4", generation: 1, wave: 0, verdict: "COMPLETE", stackHash: h.hex, examHash: eh.hash, msPerExam: msPer, burnInMargin: b0margin, unitFires: unit, implNotes: ["E1 E1-only, shared det trunk, per-arm 53500 streams, masks 91000", "E2 pre-pick fire, blind=K incl fire slot, weight-blind no-fallback", "E3 dice filed-reuse rec1-3 for D1", "E4 unit [15,35]", "E5 verdict partition + gen 1", "E6 PIN all 80", "E7 frozen driver"] };
  await fs.writeTextFile(U64E_WAVE0_PATH, JSON.stringify(body));
  log("u64e-wave0 COMPLETE");
  return body;
};
globalThis.runU64eWave1 = async function (fs, log, opts) {
  const G = await globalThis.IntrinsicInit(fs);
  const w0 = JSON.parse(await fs.readTextFile(U64E_WAVE0_PATH));
  if (w0.verdict !== "COMPLETE") throw new Error("U64e HALT: W0 not COMPLETE");
  if (w0.generation !== 1) throw new Error("U64e HALT: generation skew");
  if (!(w0.generation <= 6)) throw new Error("U64e HALT: generation cap tripped");
  const h = await globalThis.u33StackHash(fs);
  if (h.hex !== U64E_STACK_LOCAL) throw new Error("U64e-PIN HALT: stack drift");
  const eh = await u64eExamHash(fs, G);
  if (eh.hash !== w0.examHash) throw new Error("U64e HALT: examHash drift pre-W1");
  let driverHash = "n/a";
  try { driverHash = await (0, eval)("u32Sha256Hex")(await fs.readTextFile("src/evidence/decomp/newai-selfu64e-driver.js")); } catch (e) {}
  const ledgers = {};
  for (const arm of U64E_ARM_LIST) {
    for (const seed of U64E_SEEDS) {
      const lp = u64eLedgerPath(arm, seed);
      if (!(opts && opts.force)) { try { const prev = JSON.parse(await fs.readTextFile(lp)); if (prev && prev.verdict === "COMPLETE") { log(lp + " exists, skip"); ledgers[arm + seed] = prev; continue; } } catch (e) {} }
      const trunk = JSON.parse(await fs.readTextFile(u64eDetTrunkPath(seed)));
      if (trunk.stackHash !== U64E_STACK_LOCAL) { log("U64e PIN-FAIL " + arm + " s" + seed); throw new Error("U64e-PIN HALT"); }
      const t0 = Date.now();
      const body = u64eExam(G, trunk, arm);
      body.stackHash = h.hex;
      body.examHash = eh.hash;
      body.driverHash = driverHash;
      body.wallMs = Date.now() - t0;
      body.spec = "self-u64e-online-prereg"; body.version = "v1.4"; body.verdict = "COMPLETE";
      body.scoring = "correct-hot-pick fraction (E1/I2); firewall reads accRec+stackHash+filed dice";
      await fs.writeTextFile(lp, JSON.stringify(body));
      ledgers[arm + seed] = body;
      log("u64e-w1 " + arm + " s" + seed + " accRec=" + body.accRec + " rec=" + body.rec1 + "/" + body.rec2 + "/" + body.rec3 + " nT=" + body.nTriggers + " det=" + body.detectRate + " (" + body.wallMs + "ms)");
    }
  }
  // Filed dice (reads-only reuse, never recomputed).
  const dice = {};
  for (const seed of U64E_SEEDS) {
    const d = JSON.parse(await fs.readTextFile(u64eDiceLedgerPath(seed)));
    if (!(d.accRec >= 0 && d.accRec <= 1)) throw new Error("U64e HALT: dice ledger bad s" + seed);
    dice[seed] = d;
  }
  const pin = U64E_ARM_LIST.every((a) => U64E_SEEDS.every((s) => ledgers[a + s].stackHash === U64E_STACK_LOCAL));
  const xh = U64E_ARM_LIST.every((a) => U64E_SEEDS.every((s) => ledgers[a + s].examHash === w0.examHash));
  let ruleOk = true;
  for (const s of U64E_SEEDS) {
    const base = JSON.stringify(ledgers["orReset" + s].rule);
    for (const a of U64E_ARM_LIST) if (JSON.stringify(ledgers[a + s].rule) !== base) ruleOk = false;
  }
  const M = (f) => +(U64E_SEEDS.reduce((x, s) => x + f(s), 0) / 20).toFixed(4);
  const loopM = U64E_SEEDS.map((s) => +(ledgers["surBlind" + s].accRec - dice[s].accRec).toFixed(4));
  const resetM = U64E_SEEDS.map((s) => +(ledgers["orReset" + s].accRec - dice[s].accRec).toFixed(4));
  const randM = U64E_SEEDS.map((s) => +(ledgers["randBlind" + s].accRec - dice[s].accRec).toFixed(4));
  const nLoop = loopM.filter((d) => d >= 0.03).length, nReset = resetM.filter((d) => d >= 0.03).length, nRand = randM.filter((d) => d >= 0.03).length;
  const winMax = U64E_SEEDS.map((s) => Math.max(...U64E_ARM_LIST.map((a) => ledgers[a + s].accRec)));
  const floorBad = winMax.filter((v) => v < 0.40).length;
  const sens = {};
  for (const f of [0.35, 0.40, 0.45]) sens[f] = U64E_SEEDS.filter((s) => Math.max(...U64E_ARM_LIST.map((a) => ledgers[a + s].accRec)) < f).length;
  const sensNote = (sens[0.35] >= 6 || sens[0.45] >= 6) !== (floorBad >= 6) ? "AMBIGUOUS-FLOOR (table disagrees with filed 0.40; verdict stands frozen)" : "floor table agrees with filed 0.40";
  const meanReset = M((s) => ledgers["orReset" + s].accRec - dice[s].accRec);
  const meanBlindDrag = M((s) => ledgers["orBlind" + s].accRec - ledgers["orReset" + s].accRec);
  const meanDet = M((s) => ledgers["surBlind" + s].detectRate);
  const meanFA = M((s) => ledgers["surBlind" + s].falseAlarms);
  const bhS = ledgers, bhMean = (a) => M((s) => (bhS[a + s].blindHit === null ? 0 : bhS[a + s].blindHit));
  const bhGap = +(bhMean("surBlind") - bhMean("randBlind")).toFixed(4);
  const pat = {};
  for (const a of U64E_ARM_LIST) {
    pat[a] = {
      rec1: M((s) => ledgers[a + s].rec1 - dice[s].rec1),
      rec2: M((s) => ledgers[a + s].rec2 - dice[s].rec2),
      rec3: M((s) => ledgers[a + s].rec3 - dice[s].rec3),
    };
  }
  let verdict = "", detail = "", shape = "N/A";
  if (!pin) { verdict = "PIN-FAIL"; detail = "stack drift"; }
  else if (!xh) { verdict = "HALT"; detail = "examHash mismatch"; }
  else if (!ruleOk) { verdict = "PIN-FAIL"; detail = "rule mismatch across arms"; }
  else if (floorBad >= 6) { verdict = "INCONCLUSIVE"; shape = "F3"; detail = "max-arm accRec<0.40 on " + floorBad + "/20 — exam too hard even live (F3)"; }
  else if (nLoop >= 15 && nRand >= 15) { verdict = "TRIGGER-INSENSITIVE"; detail = "LOOP " + nLoop + "/20 but RAND also " + nRand + "/20 — timing doesn't matter, resets do (demoted, never a win)"; }
  else if (nLoop >= 15) { verdict = "CLOSED-LOOP-WORKS"; detail = "LOOP-CLOSED " + nLoop + "/20, floor holds — the brain's own surprise drives useful modulation"; }
  else if (nReset >= 15) {
    verdict = "ORACLE-ONLY"; shape = (meanDet < 0.5 || meanFA > 3) ? "F4" : (meanDet >= 0.8 ? "F5" : "F4/F5-BORDERLINE");
    detail = "LOOP dead " + nLoop + "/20, RESET-VALUE " + nReset + "/20 — mechanism proved live, monitor gap (" + shape + ", det=" + meanDet + " FA=" + meanFA + ")";
  } else {
    verdict = "NEITHER-WITH-DIAGNOSIS"; shape = (nReset < 15 && meanReset < 0.015) ? "F1" : (meanBlindDrag <= -0.03 ? "F2" : "UNCLASSIFIED");
    detail = "both dead (LOOP " + nLoop + "/20, RESET " + nReset + "/20), floor holds — shape " + shape + " (meanReset=" + meanReset + " drag=" + meanBlindDrag + ")";
  }
  if (nRand >= 15 && nLoop < 15 && (verdict === "NEITHER-WITH-DIAGNOSIS" || verdict === "ORACLE-ONLY")) detail += " + MECHANISM-SURPRISE note (randBlind clears, surBlind doesn't)";
  const perSeed = U64E_SEEDS.map((s) => {
    const r = { seed: s, loopM: loopM[s], resetM: resetM[s], randM: randM[s], winMax: winMax[s], dice: dice[s].accRec };
    for (const a of U64E_ARM_LIST) r[a] = { rec: ledgers[a + s].accRec, nT: ledgers[a + s].nTriggers, det: ledgers[a + s].detectRate, bh: ledgers[a + s].blindHit };
    return r;
  });
  for (const r of perSeed) log("u64e s" + r.seed + " rec oR/sB/oB/rB/dice=" + U64E_ARM_LIST.map((a) => ledgers[a + r.seed].accRec).join("/") + "/" + r.dice + " loopM=" + r.loopM);
  const body = {
    spec: "self-u64e-online-prereg", version: "v1.4", generation: 1, track: "U64e-ONLINE", verdict, detail, shape,
    bars: {
      "LOOP-CLOSED": nLoop + "/20 (quorum 15/20; surBlind.accRec>=dice.accRec+0.03)",
      "RESET-VALUE": nReset + "/20 (quorum 15/20; orReset.accRec>=dice.accRec+0.03)",
      "RAND-DEMOTION": nRand + "/20 (randBlind>=dice+0.03; demotes LOOP if both clear)",
      "FLOOR": (20 - floorBad) + "/20 max-arm>=0.40 (INCONCLUSIVE if <15/20)",
      "FLOOR-SENSITIVITY": sens, "FLOOR-NOTE": sensNote,
      "JOINT-CHANCE": "P(>=1 of two ~0.021 bars fires by chance) <= 0.041 conservative (filed; credited-win <= surBlind-clears)",
      "PIN": pin ? "80/80" : "FAIL", "EXAMHASH": xh ? "80/80 match" : "HALT", "RULE-IDENTITY": ruleOk ? "20/20" : "FAIL",
      "MEANS": { meanReset, meanBlindDrag, meanDetectRate: meanDet, meanFalseAlarms: meanFA, blindHitGap_SvR: bhGap },
      "D1-PATTERN": pat, "D1-NOTE": "diagnostic only: rec1~=dice predicted for live arms (nothing stale in window 1)",
      "D2-NOTE": "diagnostic only: surBlind-vs-randBlind blindHit gap = " + bhGap + " (one F2 input among margins)",
    },
    perSeed, deviations: ["E1..E7 as filed in driver header"],
  };
  await fs.writeTextFile(U64E_VERDICT_PATH, JSON.stringify(body));
  log("u64e-verdict " + verdict + " :: " + detail);
  return body;
};
