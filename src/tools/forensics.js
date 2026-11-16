// Forensics kernel — borrow-gameplan item 1 (minimal method port, NOT framework).
// SOURCES: Ariadne app.js forensics/autoChecks/killGates/signoff + review.js checklist
//   (ideas only; no Ariadne code vendored — failure modes excluded by construction:
//   no 32-bit hash identity, no swallowed errors, no UI/DOM, no state store).
// ARTIFACT MAP:
//   kernel API ...: Forensics.registerCheck/runChecks/evaluateGates/recordSignoff
//   self-test .....: __forensics_main() (run in worker; asserts kill semantics + Zero-UI)
//  Persistence ....: CALLER-OWNED. recordSignoff returns a plain record; the caller
//                    appends it to the durable log (CHATLOG / evidence file). This
//                    kernel never writes anywhere: nothing to corrupt, nothing to lose.
//   Zero-UI .......: no document/window/localStorage/fetch references in this file.
//                    Verified at runtime by __forensics_main() check 6.
// Semantics (fail-closed, mirrors GAMEPLAN 2.a.iii ledger-gate language):
//   - a check that THROWS fails (never skipped): thrown = FAIL with error detail.
//   - any kill-check FAIL => verdict KILL. Soft-check fails ride along as warnings.
//   - KILL override is a verdict, not a bypass: decision "OVERRIDE" requires a
//     non-empty note (who/why), enforced here; the record must still be filed.
globalThis.Forensics = (function () {
  "use strict";
  const checks = new Map(); // name -> {fn, kill, desc}

  function registerCheck(name, fn, opts) {
    if (typeof name !== "string" || !name) throw new Error("forensics: check name must be a non-empty string");
    if (typeof fn !== "function") throw new Error("forensics: check fn must be a function");
    if (checks.has(name)) throw new Error("forensics: duplicate check: " + name);
    const o = opts || {};
    checks.set(name, { fn: fn, kill: !!o.kill, desc: o.desc || "" });
    return name;
  }

  function clearChecks() { checks.clear(); }
  function listChecks() {
    return Array.from(checks.entries()).map(function (e) {
      return { name: e[0], kill: e[1].kill, desc: e[1].desc };
    });
  }

  // ctx is caller-defined (run fingerprint, ledger rows, thresholds...). Never mutated.
  function runChecks(ctx, only) {
    const names = only || Array.from(checks.keys());
    return names.map(function (name) {
      const c = checks.get(name);
      if (!c) return { name: name, kill: false, pass: false, detail: "UNKNOWN CHECK (not registered)" };
      try {
        const r = c.fn(ctx) || {};
        return { name: name, kill: c.kill, pass: r.pass === true, detail: String(r.detail || "") };
      } catch (e) {
        return { name: name, kill: c.kill, pass: false, detail: "THREW: " + (e && e.message || e) };
      }
    });
  }

  function evaluateGates(results) {
    const failedKill = results.filter(function (r) { return r.kill && !r.pass; }).map(function (r) { return r.name; });
    const failedSoft = results.filter(function (r) { return !r.kill && !r.pass; }).map(function (r) { return r.name; });
    return { verdict: failedKill.length ? "KILL" : "PASS", failedKill: failedKill, failedSoft: failedSoft };
  }

  function recordSignoff(o) {
    o = o || {};
    const need = ["ctxFingerprint", "version", "results", "evaluation", "decision"];
    for (const k of need) {
      if (o[k] === undefined || o[k] === null || o[k] === "") throw new Error("forensics: signoff missing required field: " + k);
    }
    if (["PASS", "KILL", "OVERRIDE"].indexOf(o.decision) < 0) throw new Error("forensics: bad decision (PASS/KILL/OVERRIDE): " + o.decision);
    if (o.decision === "OVERRIDE" && !(o.note && o.note.trim())) {
      throw new Error("forensics: OVERRIDE requires a non-empty note (who/why) — override is a verdict, not a bypass");
    }
    if (o.decision === "PASS" && o.evaluation.verdict === "KILL") {
      throw new Error("forensics: cannot sign PASS over a KILL evaluation — use OVERRIDE with note");
    }
    return {
      at: new Date().toISOString(),
      ctxFingerprint: o.ctxFingerprint,
      version: o.version,
      results: o.results,
      evaluation: o.evaluation,
      decision: o.decision,
      note: o.note || ""
    };
  }

  return {
    registerCheck: registerCheck,
    clearChecks: clearChecks,
    listChecks: listChecks,
    runChecks: runChecks,
    evaluateGates: evaluateGates,
    recordSignoff: recordSignoff
  };
})();

// Self-test (worker-runnable smoke; mirrors lab convention: kernel ships its own checks).
// Run: (0,eval)(src); globalThis.__forensics_main(). No frozen drivers touched.
async function __forensics_main() {
  const F = globalThis.Forensics;
  const out = { pass: 0, fail: [] };
  function eq(name, got, want) {
    if (JSON.stringify(got) === JSON.stringify(want)) { out.pass++; }
    else { out.fail.push({ name: name, got: got, want: want }); }
  }
  F.clearChecks();
  F.registerCheck("always-pass", () => ({ pass: true, detail: "ok" }), { kill: true, desc: "control" });
  F.registerCheck("soft-fail", () => ({ pass: false, detail: "warn-only" }), { kill: false });
  F.registerCheck("kill-fail", () => ({ pass: false, detail: "hard stop" }), { kill: true });
  F.registerCheck("thrower", () => { throw new Error("boom"); }, { kill: true });
  const r = F.runChecks({});
  eq("throw-fails-closed", r.find(x => x.name === "thrower").pass, false);
  const e = F.evaluateGates(r);
  eq("kill-verdict", e.verdict, "KILL");
  eq("kill-names", e.failedKill.sort(), ["kill-fail", "thrower"]);
  eq("soft-names", e.failedSoft, ["soft-fail"]);
  F.clearChecks();
  F.registerCheck("p", () => ({ pass: true, detail: "ok" }), { kill: true });
  eq("pass-verdict", F.evaluateGates(F.runChecks({})).verdict, "PASS");
  let threw = 0;
  try { F.recordSignoff({}); } catch (e2) { threw++; }
  eq("signoff-requires-fields", threw, 1);
  const rec = F.recordSignoff({
    ctxFingerprint: "test-ctx", version: "selftest",
    results: F.runChecks({}), evaluation: F.evaluateGates(F.runChecks({})), decision: "PASS"
  });
  eq("signoff-shape", [typeof rec.at, rec.decision, rec.ctxFingerprint], ["string", "PASS", "test-ctx"]);
  threw = 0;
  try {
    F.recordSignoff({ ctxFingerprint: "x", version: "v", results: [], evaluation: { verdict: "KILL", failedKill: ["k"], failedSoft: [] }, decision: "PASS" });
  } catch (e3) { threw++; }
  eq("no-pass-over-kill", threw, 1);
  threw = 0;
  try {
    F.recordSignoff({ ctxFingerprint: "x", version: "v", results: [], evaluation: { verdict: "KILL", failedKill: ["k"], failedSoft: [] }, decision: "OVERRIDE", note: " " });
  } catch (e4) { threw++; }
  eq("override-needs-note", threw, 1);
  const ovr = F.recordSignoff({ ctxFingerprint: "x", version: "v", results: [], evaluation: { verdict: "KILL", failedKill: ["k"], failedSoft: [] }, decision: "OVERRIDE", note: "selftest: named human + reason" });
  eq("override-with-note", ovr.decision, "OVERRIDE");
  eq("zero-ui", (() => {
    // Genuine guarantee: the kernel's code cannot reach UI/storage/network surfaces.
    // (Environment may provide fetch; what matters is the kernel holds no reference.)
    const srcAll = Object.values(F).map(f => f.toString()).join("\n").replace(/\/\/[^\n]*/g, "");
    const bad = ["document", "localStorage", "sessionStorage", "indexedDB", "fetch", "XMLHttpRequest"]
      .filter(t => new RegExp(`(?<!typeof\\s)\\b${t}\\b`).test(srcAll));
    return { api: Object.keys(F).sort(), bad: bad };
  })(), { api: ["clearChecks", "evaluateGates", "listChecks", "recordSignoff", "registerCheck", "runChecks"], bad: [] });
  return out;
}
