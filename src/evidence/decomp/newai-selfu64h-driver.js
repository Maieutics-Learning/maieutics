// newai-selfu64h-driver.js — U64h SENSOR (H-SEN1): can the brain notice?
//
// Prereg: src/evidence/decomp/self-u64h-sensor-prereg.md v1.3 STANDS (battery CLOSED
// 2026-11-27: v1.0 barrage 3 adopted + round-2 4 adopted + red 2 adopted + re-close
// 0 adopted/rejected-with-derivations; 9 adoptions; premises v1.0-v1.3).
// Cover: owner 2026-11-27 "countersigned" = COMPUTE LICENSED for U64h v1.3 EXACT
// (Wave 0 -> Wave 1, 80 reads-only re-evals on filed det trunks). NO PUSH.
// Log everything.
//
// Stack: U64b driver eval'd below (u64DietSingle/u43ScoreRow/u46AlignedDraws/
// u64bLoadModel/u64bReplayRule/u64bBuildMasks + full U64->U32 chain). Exam is
// READS-ONLY: no training, no gradients, frozen filed det weights; the ONLY thing
// that moves live is qkCount hygiene (resets) + blind pick windows.
//
// Implementation choices filed here (E1..E7; verdict firewall: Gate 2 reads ONLY
// {accRec, stackHash} + filed {dice.accRec, dice.rec1..3}; Gate 1 reads trigger
// logs + filed rules):
//  E1 Exam: U64b E1 verbatim (diet-mix verbatim, correctness = picked qk in current
//     true hot hotSeq[w+1], fresh qkCount per pass, frozen weights) with ONE change:
//     fresh disjoint e1Rng G.makeRng(53700+seed*104729+55+armCode) per (arm,seed)
//     (new base — no overlap with U64e 53500, U64b 53100, training 42000). E2
//     SKIPPED (ceiling, filed in U64b/U64d). Masks u64bBuildMasks(G,91000,seed)
//     verbatim. Candidates via u64DietSingle(dataRng, rule, step) + u46AlignedDraws
//     block ALWAYS (D4 verbatim; aligned draws unused by non-dice policies but
//     consumed to keep the filed op sequence). No heads (not in U64h ledger).
//     ALL 4 arms run the SAME filed det trunk per seed (weights identical).
//  E2 Signals + policies (frozen M; exploit = pick-max s*n; blind = cands[
//     blindRng.int(6)], weight-blind by construction, fallback NEVER — always 0):
//     senMax (121, BURST-ELEVATION): slot signal = MAX over 6 cands of r.s.
//       Fire iff trailing-4 mean > 2*B0 AND trailing-4 MIN > B0.
//     senPick (122, CHOICE-SURPRISE): slot signal = r.s of the EXPLOIT pick
//       (argmax s*n), computed PRE-PICK. The actual blind pick (when firing) does
//       NOT enter monitor history: the monitor watches choice-quality under the
//       current policy, not blind draws. This keeps fire evaluation uniformly
//       PRE-PICK with trailing-4 including the current slot, symmetric with the
//       other arms (rejected alternative: post-pick actual signal with a 1-slot
//       delayed window — asymmetric, entangles blind draws into the monitor).
//       Same doubling rule on its own burn-in.
//     senMargin (123, MARGIN-COLLAPSE): slot signal = top1-top2 gap of s*n.
//       Fire iff trailing-4 mean < 0.5*B0 AND trailing-4 MAX < B0 (mirror rule).
//     orTrig (124, oracle POSITIVE CONTROL): triggers at pass slots {0,50,100} +
//       same K=10 blind (blindRng same construction). No signal function, B0 null,
//       signalMeans null — positional by construction; twin + crash cover it.
//     dice: FILED U64b W1 dice ledgers, same seeds (never recomputed; rec1-3 for D-rec1).
//     Common: burn-in B0 = mean signal over pass slots 0..7 (burn-in picks are
//       exploit — no fire possible before t=8, blindLeft=0); checks t>=8;
//       refractory >=20; cap <=6/pass; fire evaluated PRE-PICK -> clear qkCount +
//       blind K=10 (fire slot + next 9), then pick. No randTiming arm (U64e RAND
//       11/20 already bounds timing-insensitivity; filed).
//  E3 Ledger per (arm,seed): {arm, seed, accRec, rec1, rec2, rec3, triggers (pass
//     slots), nTriggers, hits (trigger steps in [b,b+20], same window as U64e),
//     falseAlarms (=n-hits), detectRate (windows with >=1 hit / 3), B0 (sensors),
//     signalMeans [w1,w2,w3] (sensors; diagnostic), blindHit, blindFamiliar,
//     blindPicks, rule, stackHash, examHash, driverHash, wallMs, spec, version,
//     verdict COMPLETE}. orTrig: B0/signalMeans null. dice accRec/rec1-3: FILED
//     U64b W1 dice ledgers (path without -800st suffix), same seeds.
//  E4 Trigger unit checks (static, pre-run, on CANNED CONSTANT INPUTS — never exam
//     data; run-time burn-in/doubling runs on live exam slots in a separate phase
//     and cannot interact with W0 vectors):
//     elevVec (senMax/senPick rule): 0.5x8 (B0=0.5), 1.2x8, 0.1x10, 1.5x10, 0.1x4
//       (40 slots). Expected [11,31]: t=10 trailing has min 0.5 (strict > fails);
//       t=11 first all-1.2 trailing (mean 1.2>1.0, min ok) FIRES; t=29/30 blocked
//       by refractory (18/19 <20); t=31 (20>=20, all-1.5) FIRES; rest blocked or
//       min-fail. Trailing-4 (not 8): burst scale per prereg.
//     collapseVec (senMargin rule): 1.0x8 (B0=1.0), 0.1x8, 2.0x6, 0.05x10, 2.0x8
//       (40). Expected [11,31] by mirror symmetry (t=8..10 max==1.0 strict < fails;
//       t=11 first all-0.1 FIRES; t=25 blocked 14<20; t=31 FIRES; 2.0 regions
//       max-fail). Driver asserts exact [11,31] for all three sensor fns, else HALT.
//     flatVec: constant 0.7x40, B0=0.7 -> zero fires for BOTH rules (elev mean
//       0.7>1.4 false; collapse mean 0.7<0.35 false), else HALT.
//     orTrig has no signal fn (positional t in {0,50,100} by construction — twin +
//     crash-test cover it).
//  E5 Verdict (firewall as above): PIN (80/80 literal stackHash + rule identity
//     across arms per seed, replay-exact inside exam) -> HALT (examHash mismatch;
//     run abort, pre-verdict, never a verdict) -> INCONCLUSIVE floor (max-arm
//     accRec<0.40 on >=6/20; sens 0.35/0.45, disagreement -> AMBIGUOUS-FLOOR note,
//     verdict frozen at 0.40). Else TWO-GATE: Gate 1 SENSOR-VALID(X) =
//     #{detectRate>=2/3}>=15/20 AND mean falseAlarms<=3 (trigger logs + filed
//     rules ONLY). Gate 2 LOOP-S(X) = #{X.accRec>=dice+0.03}>=15/20; LOOP-O same
//     for orTrig. Adjudication: CLOSED-LOOP-WORKS iff some valid X loops (valid +
//     looping sensors named); else SENSOR-ONLY iff a valid X exists AND LOOP-O
//     (valid non-looping sensor named; an invalid arm looping is uninterpretable —
//     logged, never promotes); else ORACLE-ONLY iff !VALID(any) && LOOP-O (same
//     label as U64e; downstream success NEVER passes this without a valid sensor —
//     enforcement: the verdict field); else SENSOR-DEAD + shape over SENSOR-POOLED
//     means (60 sensor ledgers; family diagnosis, per-arm means logged):
//     H1 threshold-misfire (meanTrig>=3 AND meanHits<1) > H2 signal-absent
//     (meanTrig<1) > H3 calibration-gap (else). First match fires.
//     Generation g=2 (cites U64e F4; U64e was g=1); W0 asserts 2<=6 else HALT.
//     LINE-HALT impossible on gen 2 (H-history empty — filed).
//     D-graded (diagnostic, never a bar): windows w=1,2 ONLY (40 switches; window-0
//       latency confounded by burn-in slots 0..7 — filed 7 full / 33 partial;
//       actual class counts logged, descriptive): per-switch latency (first trigger
//       step - b[w]) + per-sensor precision by overlap class + full scatter.
//     D-K6 (diagnostic): per-sensor precision (hits/nTriggers) vs 0.42 chance
//       baseline (63/150 hit-window coverage) + boundary concentration (fraction of
//       triggers inside hit-window tt<=19). D-rec1 (diagnostic): per-arm mean
//       rec1/rec2/rec3 margins vs dice (live arms rec1~=dice predicted).
//  E6 PIN note: PINs all 80 ledgers (every ledger carries the literal).
//  E7 Driver file MUST NOT be edited between W0 and W1 (examHash covers bytes).
//
// RUN (execute_js, fs in scope; ONLY under owner countersign above):
//   const src = await fs.readTextFile("src/evidence/decomp/newai-selfu64h-driver.js");
//   (0, eval)(src + "\n//# sourceURL=newai-selfu64h-driver.js");
//   await globalThis.SelfU64hInit(fs);
//   const log = (m) => console.log(m);
//   await globalThis.runU64hWave0(fs, log);
//   await globalThis.runU64hWave1(fs, log);
globalThis.SelfU64hInit = async function (fs) {
  const src = await fs.readTextFile("src/evidence/decomp/newai-selfu64b-driver.js");
  (0, eval)(src + "\n//# sourceURL=newai-selfu64b-driver.js");
  await globalThis.SelfU64bInit(fs);
  for (const f of ["u64DietSingle", "u43ScoreRow", "u46AlignedDraws",
    "u64bLoadModel", "u64bReplayRule", "u64bBuildMasks", "u33StackHash",
    "inSeqMakeModel", "inSeqForward", "inMeanLogits"]) {
    let present = typeof globalThis[f] !== "undefined";
    if (!present) { try { present = (0, eval)("typeof " + f) !== "undefined"; } catch (e) { present = false; } }
    if (!present) throw new Error("U64h stack load failed: " + f);
  }
};
const U64H_STACK_LOCAL = "258d2f060684ce382778e203959ab791abb5df79af174deef19ff568886d4d6e";
const U64H_ARMS = { senMax: 121, senPick: 122, senMargin: 123, orTrig: 124 };
const U64H_ARM_LIST = ["senMax", "senPick", "senMargin", "orTrig"];
const U64H_SENSORS = ["senMax", "senPick", "senMargin"];
const U64H_SEEDS = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19];
const U64H_E1_BASE = 53700, U64H_BLIND_BASE = 53900, U64H_EVAL_MASK = 91000;
const U64H_K = 10, U64H_BURN = 8, U64H_REFR = 20, U64H_CAP = 6;
const U64H_GEN = 2, U64H_GEN_CAP = 6;
const U64H_WAVE0_PATH = "src/evidence/decomp/d-newai-self-u64h-wave0.json";
const U64H_VERDICT_PATH = "src/evidence/decomp/d-newai-self-u64h-verdict.json";
function u64hLedgerPath(arm, seed) { return "src/evidence/decomp/d-newai-self-u64h-" + arm + "-s" + seed + ".json"; }
function u64hDetTrunkPath(seed) { return "src/evidence/decomp/d-newai-self-u64-" + "det-s" + seed + "-800st.json"; }
function u64hDiceLedgerPath(seed) { return "src/evidence/decomp/d-newai-self-u64b-dice-s" + seed + ".json"; }
function u64hStreamConsts() {
  return "E1_BASE=" + U64H_E1_BASE + "|BLIND_BASE=" + U64H_BLIND_BASE +
    "|EVAL_MASK=" + U64H_EVAL_MASK + "|C=6|E1W=50|K=10|BURN=8|REFR=20|CAP=6";
}
// Pure trigger decisions (E2). hist: signal array indexed by pass slot; t: current slot.
function u64hShouldFireElev(hist, t, B0, lastFire, nFire) {
  if (t < U64H_BURN) return false;
  if (nFire >= U64H_CAP) return false;
  if (lastFire >= 0 && t - lastFire < U64H_REFR) return false;
  let mn = Infinity, sum = 0;
  for (let k = t - 3; k <= t; k++) { const v = hist[k]; sum += v; if (v < mn) mn = v; }
  return (sum / 4 > 2 * B0) && (mn > B0);
}
function u64hShouldFireCollapse(hist, t, B0, lastFire, nFire) {
  if (t < U64H_BURN) return false;
  if (nFire >= U64H_CAP) return false;
  if (lastFire >= 0 && t - lastFire < U64H_REFR) return false;
  let mx = -Infinity, sum = 0;
  for (let k = t - 3; k <= t; k++) { const v = hist[k]; sum += v; if (v > mx) mx = v; }
  return (sum / 4 < 0.5 * B0) && (mx < B0);
}
function u64hFireCanned(vec, B0, fn) {
  const fires = [];
  let last = -1;
  for (let t = 8; t < vec.length; t++) {
    if (fn(vec, t, B0, last, fires.length)) { fires.push(t); last = t; }
  }
  return fires;
}
function u64hUnitChecks() {
  const elev = [];
  for (let i = 0; i < 8; i++) elev.push(0.5);
  for (let i = 0; i < 8; i++) elev.push(1.2);
  for (let i = 0; i < 10; i++) elev.push(0.1);
  for (let i = 0; i < 10; i++) elev.push(1.5);
  for (let i = 0; i < 4; i++) elev.push(0.1);
  const collapse = [];
  for (let i = 0; i < 8; i++) collapse.push(1.0);
  for (let i = 0; i < 8; i++) collapse.push(0.1);
  for (let i = 0; i < 6; i++) collapse.push(2.0);
  for (let i = 0; i < 10; i++) collapse.push(0.05);
  for (let i = 0; i < 8; i++) collapse.push(2.0);
  const flat = [];
  for (let i = 0; i < 40; i++) flat.push(0.7);
  const e1 = u64hFireCanned(elev, 0.5, u64hShouldFireElev);
  const e2 = u64hFireCanned(elev, 0.5, u64hShouldFireElev);
  const c1 = u64hFireCanned(collapse, 1.0, u64hShouldFireCollapse);
  const fE = u64hFireCanned(flat, 0.7, u64hShouldFireElev);
  const fC = u64hFireCanned(flat, 0.7, u64hShouldFireCollapse);
  if (JSON.stringify(e1) !== "[11,31]") throw new Error("U64h Wave-0 HALT: elev unit fires=" + JSON.stringify(e1) + " expected [11,31]");
  if (JSON.stringify(e2) !== "[11,31]") throw new Error("U64h Wave-0 HALT: elev re-check fires=" + JSON.stringify(e2));
  if (JSON.stringify(c1) !== "[11,31]") throw new Error("U64h Wave-0 HALT: collapse unit fires=" + JSON.stringify(c1) + " expected [11,31]");
  if (fE.length !== 0) throw new Error("U64h Wave-0 HALT: flat-line elev fired " + JSON.stringify(fE));
  if (fC.length !== 0) throw new Error("U64h Wave-0 HALT: flat-line collapse fired " + JSON.stringify(fC));
  return { elev: e1, collapse: c1 };
}
// Full E1 exam on one filed det trunk under one arm policy. Returns ledger body.
function u64hExam(G, trunk, arm) {
  const seed = trunk.seed;
  const armCode = U64H_ARMS[arm];
  u64bReplayRule(G, seed, trunk.rule);
  const M = u64bLoadModel(G, trunk);
  const masks = u64bBuildMasks(G, U64H_EVAL_MASK, seed);
  const dataRng = G.makeRng(U64H_E1_BASE + seed * 104729 + 55 + armCode);
  const blindRng = G.makeRng(U64H_BLIND_BASE + seed * 104729 + 55 + armCode);
  const qk = new Map();
  const rec = [0, 0, 0];
  const sigWin = [[], [], []];
  const triggers = [];
  let lastFire = -1, blindLeft = 0, blindPicks = 0, blindCorrect = 0, blindFam = 0;
  const sigHist = [];
  let B0sum = 0;
  const isSensor = arm === "senMax" || arm === "senPick" || arm === "senMargin";
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
      let sig = null;
      if (arm === "senMax") { let m = -Infinity; for (let c = 0; c < 6; c++) if (rs[c].s > m) m = rs[c].s; sig = m; }
      else if (arm === "senPick") { let pi = 0; for (let c = 1; c < 6; c++) if (sn[c] > sn[pi]) pi = c; sig = rs[pi].s; }
      else if (arm === "senMargin") {
        let t1 = -Infinity, t2 = -Infinity;
        for (let c = 0; c < 6; c++) { const v = sn[c]; if (v > t1) { t2 = t1; t1 = v; } else if (v > t2) t2 = v; }
        sig = t1 - t2;
      }
      if (isSensor) { sigHist.push(sig); sigWin[w].push(sig); if (pt < U64H_BURN) B0sum += sig; }
      // trigger decision PRE-PICK
      let fire = false;
      if (isSensor) {
        if (pt >= U64H_BURN) {
          const B0 = B0sum / U64H_BURN;
          if (arm === "senMargin") fire = u64hShouldFireCollapse(sigHist, pt, B0, lastFire, triggers.length);
          else fire = u64hShouldFireElev(sigHist, pt, B0, lastFire, triggers.length);
        }
      } else if (arm === "orTrig") {
        if (pt === 0 || pt === 50 || pt === 100) fire = true;
      }
      if (fire) { triggers.push(pt); lastFire = pt; qk.clear(); blindLeft = U64H_K; }
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
    B0: isSensor ? +(B0sum / U64H_BURN).toFixed(4) : null,
    signalMeans: isSensor ? [+mean(sigWin[0]).toFixed(4), +mean(sigWin[1]).toFixed(4), +mean(sigWin[2]).toFixed(4)].map(Number) : null,
    blindHit: blindPicks > 0 ? +(blindCorrect / blindPicks).toFixed(4) : null,
    blindFamiliar: blindPicks > 0 ? +(blindFam / blindPicks).toFixed(4) : null,
    blindPicks, orFallbackE1: 0,
    rule: trunk.rule,
  };
}
async function u64hExamHash(fs, G) {
  const sha = (0, eval)("u32Sha256Hex");
  const esrc = await fs.readTextFile("src/evidence/decomp/newai-selfu64h-driver.js");
  const bsrc = await fs.readTextFile("src/evidence/decomp/newai-selfu64b-driver.js");
  const usrc = await fs.readTextFile("src/evidence/decomp/newai-selfu64-driver.js");
  const table = [];
  for (const seed of U64H_SEEDS) {
    const trunk = JSON.parse(await fs.readTextFile(u64hDetTrunkPath(seed)));
    table.push({ seed, b: trunk.rule.b, hotSeq: trunk.rule.hotSeq });
  }
  return { hash: await sha(esrc + "\n" + bsrc + "\n" + usrc + "\n" + u64hStreamConsts() + "\n" + JSON.stringify(table)), table };
}
globalThis.runU64hWave0 = async function (fs, log, opts) {
  if (!(opts && opts.force)) { try { const prev = JSON.parse(await fs.readTextFile(U64H_WAVE0_PATH)); if (prev && prev.verdict === "COMPLETE") { log(U64H_WAVE0_PATH + " exists, skip"); return prev; } } catch (e) {} }
  if (U64H_GEN !== 2) throw new Error("U64h Wave-0 HALT: generation skew (filed g=2)");
  if (!(U64H_GEN <= U64H_GEN_CAP)) throw new Error("U64h Wave-0 HALT: generation cap tripped");
  log("u64h-wave0 LINE-HALT impossible on gen 2 (H-history empty — filed)");
  const G = await globalThis.IntrinsicInit(fs);
  const h = await globalThis.u33StackHash(fs);
  if (h.hex !== U64H_STACK_LOCAL) throw new Error("U64h-PIN HALT: stack drift " + h.hex.slice(0, 16));
  for (const seed of [0, 1, 2]) {
    const tr = JSON.parse(await fs.readTextFile(u64hDetTrunkPath(seed)));
    if (tr.stackHash !== U64H_STACK_LOCAL) throw new Error("U64h-PIN HALT: trunk drift s" + seed);
    if (tr.verdict !== "COMPLETE") throw new Error("U64h HALT: trunk incomplete s" + seed);
    u64bReplayRule(G, seed, tr.rule);
  }
  log("u64h-wave0 PIN 3/3 det trunks literal-match + replay exact");
  const unit = u64hUnitChecks();
  log("u64h-wave0 trigger unit elev fires=[" + unit.elev + "] collapse fires=[" + unit.collapse + "] flat-line zero (filed [11,31]/[11,31]/zero)");
  for (const arm of U64H_ARM_LIST) {
    const tr0 = JSON.parse(await fs.readTextFile(u64hDetTrunkPath(0)));
    const a = u64hExam(G, tr0, arm), b = u64hExam(G, tr0, arm);
    if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error("U64h Wave-0 HALT: exam nondeterminism " + arm + " (monitor state?)");
  }
  log("u64h-wave0 determinism twins exact (4 arms s0 incl monitor state)");
  for (const arm of U64H_ARM_LIST) {
    const tr1 = JSON.parse(await fs.readTextFile(u64hDetTrunkPath(1)));
    const c = u64hExam(G, tr1, arm);
    for (const k of ["accRec", "rec1", "rec2", "rec3", "detectRate"]) {
      if (!(c[k] >= 0 && c[k] <= 1 && isFinite(c[k]))) throw new Error("U64h Wave-0 HALT: crash-test metric " + arm + " " + k + "=" + c[k]);
    }
    if (c.blindHit !== null && !(c.blindHit >= 0 && c.blindHit <= 1)) throw new Error("U64h Wave-0 HALT: crash-test blindHit " + arm);
    log("u64h-wave0 crash-test " + arm + " s1 accRec=" + c.accRec + " nTrig=" + c.nTriggers + " det=" + c.detectRate + " B0=" + c.B0);
  }
  let b0margin = Infinity;
  for (const seed of U64H_SEEDS) {
    const tr = JSON.parse(await fs.readTextFile(u64hDetTrunkPath(seed)));
    const mg = tr.rule.b[0] - 8;
    if (mg < b0margin) b0margin = mg;
  }
  log("u64h-wave0 burn-in margin min(b0-8)=" + b0margin + " over 20 seeds (LOGGED check only)");
  const eh = await u64hExamHash(fs, G);
  log("u64h-wave0 examHash=" + eh.hash.slice(0, 16) + "...");
  const t0 = Date.now();
  u64hExam(G, JSON.parse(await fs.readTextFile(u64hDetTrunkPath(0))), "senMax");
  const msPer = Date.now() - t0;
  log("u64h-wave0 dry-run 1 exam ~" + msPer + "ms; project W1 ~" + Math.round((msPer * 80) / 1000) + "s");
  const body = { spec: "self-u64h-sensor-prereg", version: "v1.3", generation: 2, wave: 0, verdict: "COMPLETE", stackHash: h.hex, examHash: eh.hash, msPerExam: msPer, burnInMargin: b0margin, unitFires: unit, implNotes: ["E1 E1-only, shared det trunk, per-arm 53700 streams, masks 91000", "E2 pre-pick fire, blind=K incl fire slot, weight-blind no-fallback; senPick signal = exploit r.s pre-pick", "E3 dice filed-reuse rec1-3 for D-rec1", "E4 units [11,31]/[11,31]/flat-zero; orTrig positional, twin+crash cover", "E5 TWO-GATE + H1/H2/H3 pooled + D-graded/D-K6/D-rec1 + gen 2", "E6 PIN all 80", "E7 frozen driver"] };
  await fs.writeTextFile(U64H_WAVE0_PATH, JSON.stringify(body));
  log("u64h-wave0 COMPLETE");
  return body;
};
globalThis.runU64hWave1 = async function (fs, log, opts) {
  const G = await globalThis.IntrinsicInit(fs);
  const w0 = JSON.parse(await fs.readTextFile(U64H_WAVE0_PATH));
  if (w0.verdict !== "COMPLETE") throw new Error("U64h HALT: W0 not COMPLETE");
  if (w0.generation !== 2) throw new Error("U64h HALT: generation skew");
  if (!(w0.generation <= 6)) throw new Error("U64h HALT: generation cap tripped");
  const h = await globalThis.u33StackHash(fs);
  if (h.hex !== U64H_STACK_LOCAL) throw new Error("U64h-PIN HALT: stack drift");
  const eh = await u64hExamHash(fs, G);
  if (eh.hash !== w0.examHash) throw new Error("U64h HALT: examHash drift pre-W1");
  let driverHash = "n/a";
  try { driverHash = await (0, eval)("u32Sha256Hex")(await fs.readTextFile("src/evidence/decomp/newai-selfu64h-driver.js")); } catch (e) {}
  const ledgers = {};
  for (const arm of U64H_ARM_LIST) {
    for (const seed of U64H_SEEDS) {
      const lp = u64hLedgerPath(arm, seed);
      if (!(opts && opts.force)) { try { const prev = JSON.parse(await fs.readTextFile(lp)); if (prev && prev.verdict === "COMPLETE") { log(lp + " exists, skip"); ledgers[arm + seed] = prev; continue; } } catch (e) {} }
      const trunk = JSON.parse(await fs.readTextFile(u64hDetTrunkPath(seed)));
      if (trunk.stackHash !== U64H_STACK_LOCAL) { log("U64h PIN-FAIL " + arm + " s" + seed); throw new Error("U64h-PIN HALT"); }
      const t0 = Date.now();
      const body = u64hExam(G, trunk, arm);
      body.stackHash = h.hex;
      body.examHash = eh.hash;
      body.driverHash = driverHash;
      body.wallMs = Date.now() - t0;
      body.spec = "self-u64h-sensor-prereg"; body.version = "v1.3"; body.verdict = "COMPLETE";
      body.scoring = "correct-hot-pick fraction (E1/I2); firewall: Gate2 reads accRec+stackHash+filed dice only";
      await fs.writeTextFile(lp, JSON.stringify(body));
      ledgers[arm + seed] = body;
      log("u64h-w1 " + arm + " s" + seed + " accRec=" + body.accRec + " rec=" + body.rec1 + "/" + body.rec2 + "/" + body.rec3 + " nT=" + body.nTriggers + " det=" + body.detectRate + " (" + body.wallMs + "ms)");
    }
  }
  // Filed dice (reads-only reuse, never recomputed).
  const dice = {};
  for (const seed of U64H_SEEDS) {
    const d = JSON.parse(await fs.readTextFile(u64hDiceLedgerPath(seed)));
    if (!(d.accRec >= 0 && d.accRec <= 1)) throw new Error("U64h HALT: dice ledger bad s" + seed);
    dice[seed] = d;
  }
  const pin = U64H_ARM_LIST.every((a) => U64H_SEEDS.every((s) => ledgers[a + s].stackHash === U64H_STACK_LOCAL));
  const xh = U64H_ARM_LIST.every((a) => U64H_SEEDS.every((s) => ledgers[a + s].examHash === w0.examHash));
  let ruleOk = true;
  for (const s of U64H_SEEDS) {
    const base = JSON.stringify(ledgers["senMax" + s].rule);
    for (const a of U64H_ARM_LIST) if (JSON.stringify(ledgers[a + s].rule) !== base) ruleOk = false;
  }
  const M = (f) => +(U64H_SEEDS.reduce((x, s) => x + f(s), 0) / 20).toFixed(4);
  // Gate 1 per sensor.
  const gate1 = {};
  for (const a of U64H_SENSORS) {
    const nDet = U64H_SEEDS.filter((s) => ledgers[a + s].detectRate >= 2 / 3).length;
    const meanFA = M((s) => ledgers[a + s].falseAlarms);
    gate1[a] = { nDet, meanFA: +meanFA, valid: nDet >= 15 && meanFA <= 3 };
  }
  const anyValid = U64H_SENSORS.some((a) => gate1[a].valid);
  // Gate 2 per arm.
  const gate2 = {};
  for (const a of U64H_ARM_LIST) {
    gate2[a] = U64H_SEEDS.filter((s) => ledgers[a + s].accRec >= dice[s].accRec + 0.03).length;
  }
  const winMax = U64H_SEEDS.map((s) => Math.max(...U64H_ARM_LIST.map((a) => ledgers[a + s].accRec)));
  const floorBad = winMax.filter((v) => v < 0.40).length;
  const sens = {};
  for (const f of [0.35, 0.40, 0.45]) sens[f] = U64H_SEEDS.filter((s) => Math.max(...U64H_ARM_LIST.map((a) => ledgers[a + s].accRec)) < f).length;
  const sensNote = (sens[0.35] >= 6 || sens[0.45] >= 6) !== (floorBad >= 6) ? "AMBIGUOUS-FLOOR (table disagrees with filed 0.40; verdict stands frozen)" : "floor table agrees with filed 0.40";
  // H-shapes: sensor-pooled means (60 ledgers).
  const poolN = [], poolH = [];
  for (const a of U64H_SENSORS) for (const s of U64H_SEEDS) { poolN.push(ledgers[a + s].nTriggers); poolH.push(ledgers[a + s].hits); }
  const meanTrigPool = +(poolN.reduce((x, y) => x + y, 0) / poolN.length).toFixed(4);
  const meanHitsPool = +(poolH.reduce((x, y) => x + y, 0) / poolH.length).toFixed(4);
  const perArmMeans = {};
  for (const a of U64H_SENSORS) perArmMeans[a] = { meanTrig: M((s) => ledgers[a + s].nTriggers), meanHits: M((s) => ledgers[a + s].hits) };
  // D-graded: windows w=1,2 only (40 switches; window-0 confounded by burn-in).
  const graded = [];
  for (const a of U64H_SENSORS) {
    for (const s of U64H_SEEDS) {
      for (const w of [1, 2]) {
        const hh = ledgers[a + s].rule.hotSeq;
        const A = hh[w], B = hh[w + 1];
        const shared = (A[0] === B[0] || A[0] === B[1] ? 1 : 0) + (A[1] === B[0] || A[1] === B[1] ? 1 : 0);
        const wt = ledgers[a + s].triggers.filter((pt) => Math.floor(pt / 50) === w).map((pt) => pt - w * 50);
        const first = wt.length ? wt[0] : null;
        const hit = wt.some((tt) => 1 + tt >= 0 && 1 + tt <= 20);
        graded.push({ arm: a, seed: s, w, cls: shared === 0 ? "full" : "partial", latency: first === null ? null : 1 + first, nTrig: wt.length, hit });
      }
    }
  }
  const fullN = graded.filter((r) => r.cls === "full").length, partN = graded.filter((r) => r.cls === "partial").length;
  const clsStats = {};
  for (const c of ["full", "partial"]) {
    const rs = graded.filter((r) => r.cls === c);
    const lat = rs.filter((r) => r.latency !== null).map((r) => r.latency);
    clsStats[c] = {
      n: rs.length,
      hitRate: +(rs.filter((r) => r.hit).length / rs.length).toFixed(4),
      meanLatency: lat.length ? +(lat.reduce((x, y) => x + y, 0) / lat.length).toFixed(4) : null,
    };
  }
  const armCls = {};
  for (const a of U64H_SENSORS) {
    armCls[a] = {};
    for (const c of ["full", "partial"]) {
      const rs = graded.filter((r) => r.arm === a && r.cls === c);
      const tot = rs.reduce((x, r) => x + r.nTrig, 0);
      const hitWins = rs.filter((r) => r.hit).length;
      const lat = rs.filter((r) => r.latency !== null).map((r) => r.latency);
      armCls[a][c] = { n: rs.length, winHitRate: +(hitWins / rs.length).toFixed(4), meanLatency: lat.length ? +(lat.reduce((x, y) => x + y, 0) / lat.length).toFixed(4) : null, nTrig: tot };
    }
  }
  // D-K6: per-sensor precision vs 0.42 + boundary concentration.
  const k6 = {};
  for (const a of U64H_SENSORS) {
    let T = 0, H = 0, inWin = 0;
    for (const s of U64H_SEEDS) {
      const L = ledgers[a + s];
      T += L.nTriggers; H += L.hits;
      for (const pt of L.triggers) { const tt = pt % 50; if (1 + tt <= 20) inWin++; }
    }
    k6[a] = { precision: T ? +(H / T).toFixed(4) : null, nTrig: T, hits: H, boundaryFrac: T ? +(inWin / T).toFixed(4) : null };
  }
  // D-rec1: per-arm rec margins vs dice.
  const rec1 = {};
  for (const a of U64H_ARM_LIST) {
    rec1[a] = {
      rec1: M((s) => ledgers[a + s].rec1 - dice[s].rec1),
      rec2: M((s) => ledgers[a + s].rec2 - dice[s].rec2),
      rec3: M((s) => ledgers[a + s].rec3 - dice[s].rec3),
    };
  }
  const validNames = U64H_SENSORS.filter((a) => gate1[a].valid);
  const loopingValid = validNames.filter((a) => gate2[a] >= 15);
  let verdict = "", detail = "", shape = "N/A";
  if (!pin) { verdict = "PIN-FAIL"; detail = "stack drift"; }
  else if (!xh) { verdict = "HALT"; detail = "examHash mismatch"; }
  else if (!ruleOk) { verdict = "PIN-FAIL"; detail = "rule mismatch across arms"; }
  else if (floorBad >= 6) { verdict = "INCONCLUSIVE"; detail = "max-arm accRec<0.40 on " + floorBad + "/20 — exam too hard even live"; }
  else if (loopingValid.length > 0) {
    verdict = "CLOSED-LOOP-WORKS";
    detail = "SENSOR-VALID+LOOP-S(" + loopingValid.join(",") + ") — valid sensor buys accuracy (Gate2 " + loopingValid.map((a) => a + "=" + gate2[a] + "/20").join(" ") + ")";
  }
  else if (anyValid && gate2["orTrig"] >= 15) {
    verdict = "SENSOR-ONLY";
    detail = "SENSOR-VALID(" + validNames.join(",") + ") but no valid-sensor LOOP-S (" + validNames.map((a) => gate2[a] + "/20").join(",") + "); LOOP-O " + gate2["orTrig"] + "/20 — valid sensor, working response, no gain when sensor-triggered";
  }
  else if (!anyValid && gate2["orTrig"] >= 15) {
    verdict = "ORACLE-ONLY"; shape = "F4-see-closeout";
    detail = "no valid sensor; LOOP-O " + gate2["orTrig"] + "/20 — mechanism works when told (same label as U64e)";
  }
  else if (!anyValid && gate2["orTrig"] < 15) {
    verdict = "SENSOR-DEAD";
    if (meanTrigPool >= 3 && meanHitsPool < 1) { shape = "H1"; detail = "threshold-misfire: pooled meanTrig=" + meanTrigPool + ">=3 with meanHits=" + meanHitsPool + "<1 — fires are noise"; }
    else if (meanTrigPool < 1) { shape = "H2"; detail = "signal-absent: pooled meanTrig=" + meanTrigPool + "<1 — nothing to threshold; new signal family needed"; }
    else { shape = "H3"; detail = "calibration-gap: pooled meanTrig=" + meanTrigPool + " meanHits=" + meanHitsPool + " — fires with some hits, quorum missed"; }
  }
  for (const a of U64H_SENSORS) log("u64h gate1 " + a + " det=" + gate1[a].nDet + "/20 FA=" + gate1[a].meanFA + " valid=" + gate1[a].valid + " loop=" + gate2[a] + "/20");
  log("u64h gate2 orTrig LOOP-O " + gate2["orTrig"] + "/20");
  const perSeed = U64H_SEEDS.map((s) => {
    const r = { seed: s, winMax: winMax[s], dice: dice[s].accRec };
    for (const a of U64H_ARM_LIST) r[a] = { rec: ledgers[a + s].accRec, nT: ledgers[a + s].nTriggers, det: ledgers[a + s].detectRate, bh: ledgers[a + s].blindHit };
    return r;
  });
  for (const r of perSeed) log("u64h s" + r.seed + " rec max/pick/marg/orT/dice=" + U64H_ARM_LIST.map((a) => ledgers[a + r.seed].accRec).join("/") + "/" + r.dice);
  const body = {
    spec: "self-u64h-sensor-prereg", version: "v1.3", generation: 2, track: "U64h-SENSOR", verdict, detail, shape,
    bars: {
      "GATE1": Object.fromEntries(U64H_SENSORS.map((a) => [a, gate1[a].nDet + "/20 det>=2/3, meanFA=" + gate1[a].meanFA + " valid=" + gate1[a].valid])),
      "GATE2-LOOP-S": Object.fromEntries(U64H_SENSORS.map((a) => [a, gate2[a] + "/20 (quorum 15/20; accRec>=dice+0.03)"])),
      "GATE2-LOOP-O": gate2["orTrig"] + "/20 (quorum 15/20)",
      "FLOOR": (20 - floorBad) + "/20 max-arm>=0.40 (INCONCLUSIVE if <15/20)",
      "FLOOR-SENSITIVITY": sens, "FLOOR-NOTE": sensNote,
      "PIN": pin ? "80/80" : "FAIL", "EXAMHASH": xh ? "80/80 match" : "HALT", "RULE-IDENTITY": ruleOk ? "20/20" : "FAIL",
      "H-POOL": { meanTrigPool, meanHitsPool, perArmMeans },
      "D-GRADED": { note: "diagnostic only; windows w=1,2 (40 switches; w0 confounded by burn-in)", filedSplit: "7 full / 33 partial", actualSplit: fullN + " full / " + partN + " partial", byClass: clsStats, byArmClass: armCls },
      "D-K6": { note: "diagnostic only: per-sensor precision vs 0.42 chance (63/150 hit-window coverage)", perSensor: k6 },
      "D-REC1": { note: "diagnostic only: rec1~=dice predicted for live arms", perArm: rec1 },
    },
    gradedScatter: graded,
    perSeed, deviations: ["E1..E7 as filed in driver header"],
  };
  await fs.writeTextFile(U64H_VERDICT_PATH, JSON.stringify(body));
  log("u64h-verdict " + verdict + " :: " + detail);
  return body;
};
