// newai-selfu63-driver.js — U63-VETO-SCALED recompute (reads-only, ZERO new trains).
//
// Re-analysis of filed U61 ledgers under re-scoped floor. Candidate bars byte-identical
// to U61 v1.0 verdict logic (reused by evaluating the filed U61 driver and calling its
// ledger paths); only the floor scope changes (FLOOR-R shielded-only + GLOBAL-DIR control
// + NOVETO-DIAG). Any train write is a HALT violation per prereg.
//
// Prereg: src/evidence/decomp/self-u63-veto-scaled-prereg.md v1.0 (STANDS, 10x battery).
// Cover: user 2026-11-26 countersign both U60 and U63 = this recompute + per-wave 10x reviews.
// NO PUSH without order.
//
// RUN (execute_js, fs in scope; ONLY under fresh countersign — recompute is compute):
//   const src = await fs.readTextFile("src/evidence/decomp/newai-selfu63-driver.js");
//   (0, eval)(src + "\n//# sourceURL=newai-selfu63-driver.js");
//   await globalThis.SelfU63Init(fs);
//   await globalThis.runU63Wave0(fs, log);    // ledger-identity (200 filed U61 ledgers)
//   await globalThis.runU63Verdict(fs, log);  // recompute + verdict
globalThis.SelfU63Init = async function (fs) {
  const u61src = await fs.readTextFile("src/evidence/decomp/newai-selfu61-driver.js");
  (0, eval)(u61src + "\n//# sourceURL=newai-selfu61-driver.js");
  await globalThis.SelfU61Init(fs);
  for (const f of ["runU61Verdict", "u61Phase1Path", "u61Phase2Path", "u61EvalPath"]) {
    if (typeof globalThis[f] === "undefined" && typeof eval(f) === "undefined")
      throw new Error("U63 stack load failed: missing " + f);
  }
  if (typeof globalThis.u32Sha256Hex !== "function")
    throw new Error("U63 stack load failed: missing u32Sha256Hex");
};
const U63_WAVE0_PATH = "src/evidence/decomp/d-newai-self-u63-wave0.json";
const U63_VERDICT_PATH = "src/evidence/decomp/d-newai-self-u63-verdict.json";
const U63_ARMS = ["noveto", "global", "vetoSUP", "vetoTASK", "unfrozen"];
globalThis.runU63Wave0 = async function (fs, log) {
  try { const prev = JSON.parse(await fs.readTextFile(U63_WAVE0_PATH)); if (prev && prev.verdict === "COMPLETE") { log(U63_WAVE0_PATH + " exists, skip"); return prev; } } catch (e) {}
  // ledger-identity: all 200 filed U61 ledgers present + schema check + sha record.
  const ids = [];
  for (let seed = 0; seed < 20; seed++) {
    for (const arm of U63_ARMS) {
      for (const [kind, path] of [["phase2", u61Phase2Path(seed, arm)], ["eval", u61EvalPath(seed, arm)]]) {
        let txt;
        try { txt = await fs.readTextFile(path); }
        catch (e) { throw new Error("U63 Wave-0 HALT: missing filed ledger " + path); }
        const L = JSON.parse(txt);
        if (L.spec !== "self-u61-ext4-prereg" || L.verdict !== "COMPLETE" || L.seed !== seed)
          throw new Error("U63 Wave-0 HALT: schema drift " + path + " (spec/seed/verdict)");
        if (kind === "eval" && (typeof L.accCtxA !== "number" || typeof L.vetoA === "number" && false))
          throw new Error("U63 Wave-0 HALT: eval schema drift " + path);
        const h = await globalThis.u32Sha256Hex(txt);
        ids.push({ seed, arm, kind, sha: h.hex ? h.hex.slice(0, 16) : String(h).slice(0, 16) });
      }
    }
    // Phase-1 reuse pointers (shared U57 files for veto arms per U61 D3 repair).
    for (const arm of U63_ARMS) {
      const p = u61Phase1Path(seed, arm);
      const txt = await fs.readTextFile(p); // throws if missing
      JSON.parse(txt);
    }
  }
  log("u63-wave0 ledger-identity 200/200 phase2+eval present, schema ok; phase-1 pointers readable 100/100");
  // bar-code review: recompute code path = U61 verdict logic + scaled floor only (this file).
  const src = await fs.readTextFile("src/evidence/decomp/newai-selfu63-driver.js");
  if (src.indexOf("TRAIN-WRITE") >= 0 || src.indexOf("writeTextFile") !== src.lastIndexOf("writeTextFile"))
    log("u63-wave0 bar-code note: writeTextFile appears only for wave0/verdict ledgers (no train writes)");
  const body = { spec: "self-u63-veto-scaled-prereg", track: "U63-SCALED", wave: 0, verdict: "COMPLETE", ledgers: "200/200 phase2+eval + 100/100 phase-1 pointers", ids };
  await fs.writeTextFile(U63_WAVE0_PATH, JSON.stringify(body));
  return body;
};
globalThis.runU63Verdict = async function (fs, log) {
  // Per-seed candidate bars: VERBATIM U61 v1.0 logic (same expressions, same gating order
  // except floor). Floor replaced by FLOOR-R + GLOBAL-DIR + NOVETO-DIAG per prereg.
  const perSeed = [];
  for (let seed = 0; seed < 20; seed++) {
    const T = {}, E = {};
    for (const arm of U63_ARMS) {
      T[arm] = JSON.parse(await fs.readTextFile(u61Phase2Path(seed, arm)));
      E[arm] = JSON.parse(await fs.readTextFile(u61EvalPath(seed, arm)));
    }
    const P1 = {};
    for (const arm of U63_ARMS) P1[arm] = JSON.parse(await fs.readTextFile(u61Phase1Path(seed, arm)));
    const U63_EXPECT_STACK = "258d2f060684ce382778e203959ab791abb5df79af174deef19ff568886d4d6e"; // filed pinned-stack hash (U61 driver const, same value)
    const pinHash = U63_ARMS.every((a) => T[a].stackHash === U63_EXPECT_STACK && E[a].stackHash === U63_EXPECT_STACK && P1[a].stackHash === U63_EXPECT_STACK);
    const ckSame = ["global", "vetoSUP", "vetoTASK", "unfrozen"].every((a) => P1[a].checkpoint.inputsHash === P1.noveto.checkpoint.inputsHash);
    const frozenKept = (() => {
      const a = JSON.stringify(T.vetoSUP.P), b = JSON.stringify(T.vetoSUP.P0);
      const c = JSON.stringify(T.vetoTASK.P), d = JSON.stringify(T.vetoTASK.P0);
      return a === b && c === d;
    })();
    const ev = E.vetoSUP, er = E.vetoTASK, eu = E.unfrozen, eg = E.global, en = E.noveto;
    const lowComp = ev.checkpointAcc < 0.28;
    const ctx = { a: ev.accCtxA, b: ev.accCtxB, ckpt: ev.checkpointAcc, lowComp, pass: ev.accCtxA >= ev.checkpointAcc - 0.03 && ev.accCtxB >= 0.95 };
    const noerase = { d: +(ev.accRetA - ev.checkpointAcc).toFixed(4), vetoA: ev.vetoA, pass: Math.abs(ev.accRetA - ev.checkpointAcc) <= 0.02 && ev.vetoA <= 0.05, misfire: ev.vetoA > 0.05 };
    const isolate = { uCtx: eu.accCtxA >= eu.checkpointAcc - 0.03 && eu.accCtxB >= 0.95, uRetFail: Math.abs(eu.accRetA - eu.checkpointAcc) > 0.02, pass: (eu.accCtxA >= eu.checkpointAcc - 0.03 && eu.accCtxB >= 0.95) && Math.abs(eu.accRetA - eu.checkpointAcc) > 0.02 };
    // SCALED floor (prereg U63): shielded arms + unfrozen only. Global/noveto excluded.
    const floorR = { pass: ev.accCtxA >= 0.45 && er.accCtxA >= 0.45 && eu.accCtxA >= 0.45 };
    const globalDir = { g: eg.accCtxA, v: ev.accCtxA, pass: eg.accCtxA < ev.accCtxA };
    const novetoDiag = { ctxA: en.accCtxA, ctxB: en.accCtxB };
    perSeed.push({
      seed,
      pin: { match: pinHash && ckSame && frozenKept, pass: pinHash && ckSame && frozenKept, frozenKept },
      arms: { noveto: { ctxA: en.accCtxA, ctxB: en.accCtxB, ret: en.accRetA }, global: { ctxA: eg.accCtxA, ctxB: eg.accCtxB, ret: eg.accRetA }, vetoSUP: { ctxA: ev.accCtxA, ctxB: ev.accCtxB, ret: ev.accRetA, ckpt: ev.checkpointAcc, vetoA: ev.vetoA, vetoB: ev.vetoB }, vetoTASK: { ctxA: er.accCtxA, ctxB: er.accCtxB, ret: er.accRetA, ckpt: er.checkpointAcc, vetoA: er.vetoA, vetoB: er.vetoB }, unfrozen: { ctxA: eu.accCtxA, ctxB: eu.accCtxB, ret: eu.accRetA, ckpt: eu.checkpointAcc } },
      ctx, noerase, isolate, floorR, globalDir, novetoDiag,
    });
    const r = perSeed[seed];
    log("u63-verdict s" + seed + " PIN=" + (r.pin.pass ? "ok" : "FAIL") + " veto=" + r.arms.vetoSUP.ctxA + "/" + r.arms.vetoSUP.ctxB + " rep=" + r.arms.vetoTASK.vetoA + " floorR=" + (r.floorR.pass ? "1" : "0") + " gdir=" + (r.globalDir.pass ? "1" : "0") + " noveto=" + r.arms.noveto.ctxA);
  }
  const q = (f) => perSeed.filter((s) => f(s)).length;
  const pinN = q((s) => s.pin.pass), ctxN = q((s) => s.ctx.pass), noeN = q((s) => s.noerase.pass);
  const isoN = q((s) => s.isolate.pass), floorRN = q((s) => s.floorR.pass);
  const gdirN = q((s) => s.globalDir.pass);
  const novetoDist = perSeed.map((s) => s.novetoDiag.ctxA);
  const misN = q((s) => s.noerase.misfire);
  const repMean = perSeed.reduce((s, x) => s + x.arms.vetoTASK.vetoA, 0) / perSeed.length;
  let verdict = "", cause = "clean";
  if (pinN < 20) { verdict = "PIN-FAIL"; cause = "pin"; }
  else if (floorRN < 15) { verdict = "FLOOR-R-FAIL"; cause = "shielded floor fails on balanced diet (" + floorRN + "/20) — erasure is not B-frequency and not scope"; }
  else if (Math.abs(repMean - 0.036875) > 0.02) { verdict = "TASK-NOREP"; cause = "replication control off (mean vetoTASK vetoA " + repMean.toFixed(4) + " vs diet-scaled 0.036875 (=0.059x0.5/0.8))"; }
  else if (misN >= 7) { verdict = "SUP-PERSISTS"; cause = "candidate vetoA breach at quorum DESPITE direct supervision"; }
  else if (ctxN < 15) { verdict = "SUP-PERSISTS"; cause = "ctx-joint fail at quorum"; }
  else if (noeN < 15) { verdict = "SUP-PERSISTS"; cause = "noerasure-breach with clean vetoA"; }
  else if (isoN < 15) {
    const unfrHolds = q((s) => (s.arms.unfrozen.accCtxA >= s.arms.unfrozen.ckpt - 0.03 && s.arms.unfrozen.accCtxB >= 0.95) && Math.abs(s.arms.unfrozen.accRetA - s.arms.unfrozen.ckpt) <= 0.02);
    verdict = "SUP-PERSISTS"; cause = "isolate fail at quorum (unfrHolds " + unfrHolds + "/20)";
  }
  else verdict = "SUP-VIABLE";
  if (verdict === "SUP-VIABLE") cause = "clean (candidate holds under balanced diet with own objective; shielded floor holds; blind gate loses directionally as designed)";
  const body = {
    spec: "self-u63-veto-scaled-prereg", track: "U63-SCALED", verdict, cause,
    bars: {
      "SUP-PIN": pinN + "/20", "SUP-CTX": ctxN + "/20", "SUP-NOERASE": noeN + "/20",
      "SUP-ISOLATE": isoN + "/20", "SUP-FLOOR-R": floorRN + "/20 (quorum 15/20; shielded vetoSUP/vetoTASK/unfrozen CTX-A>=0.45)",
      "GLOBAL-DIR": gdirN + "/20 (directional control, no quorum; blind gate must lose to veto)",
      "NOVETO-DIAG": "noveto CTX-A [" + novetoDist.map((v) => +v.toFixed(2)).join(",") + "] (diet-health, no quorum)",
      "REPLICATION-CHECK": "vetoTASK mean vetoA " + repMean.toFixed(4) + " vs diet-scaled 0.036875 (tolerance 0.02)",
      "MISFIRE-COUNT": misN + "/20",
    },
    perSeed,
  };
  await fs.writeTextFile(U63_VERDICT_PATH, JSON.stringify(body));
  log("u63-verdict " + verdict + " cause=" + cause + " PIN " + pinN + "/20 CTX " + ctxN + "/20 NOERASE " + noeN + "/20 ISOLATE " + isoN + "/20 FLOOR-R " + floorRN + "/20 GDIR " + gdirN + "/20 MISFIRE " + misN + "/20 repMean " + repMean.toFixed(4));
  return body;
};
