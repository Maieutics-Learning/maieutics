// src/tools/rebuild.js — REBUILD-READY audit (no training, no pool, seconds).
//
// RUN: paste this file's contents as the `js` of execute_js (it runs with `fs`
// in scope, the live workspace filesystem), or:
//   const body = await fs.readTextFile("src/tools/rebuild.js");
//   await (0, eval)(`(async (fs) => { ${body} })(fs)`)  -- simpler: execute_js({js: body})
// EXIT: returns {summary, gates, missing, counts}. 0 missing = REBUILD-READY.
// A shrinking ledger count vs the §4 baseline is data loss until proven otherwise.
//
// Living tool (bug fixes allowed; gate changes logged in working record).

const missing = [];
const gates = [];
const gate = (name, pass, detail) => gates.push({ name, pass: !!pass, detail: String(detail) });

const exists = async (p) => { try { await fs.stat(p); return true; } catch (e) { return false; } };
const readJ = async (p) => JSON.parse(await fs.readTextFile(p));

// 1. Generator shell
for (const p of ["main.pjs", "index.html", "src/inference.js", "src/offline-solver.js"]) {
  if (!(await exists(p))) missing.push({ path: p, stage: "shell", regenerable: false });
}
gate("shell", !missing.some(m => m.stage === "shell"), "main.pjs + index.html + src/*.js");

// 2. Bench core (presence + load-order symbols)
const coreSyms = [
  ["src/tinynn/nn.js", ["AttnModel"]],
  ["src/tinynn/seeded.js", ["makeRng"]],
  ["src/tinynn/tasks.js", ["gen"]],
  ["src/tinynn/train.js", ["trainModel"]],
];
for (const [p, syms] of coreSyms) {
  const ok = await exists(p);
  if (!ok) { missing.push({ path: p, stage: "core", regenerable: false }); continue; }
  const t = await fs.readTextFile(p);
  const bad = syms.filter(s => !t.includes(s));
  gate("core:" + p.split("/").pop(), bad.length === 0, bad.length ? "MISSING symbols " + bad.join(",") : t.length + "B, symbols ok");
  if (bad.length) missing.push({ path: p, stage: "core-symbols:" + bad.join(","), regenerable: false });
}

// 3. W6 canonical trunk + evals + verdict numbers
const w6exp = { scr: [0.635, 0.595, 0.585], two: [0.63, 0.595, 0.55] };
let w6ok = true;
for (const s of [0, 1, 2]) {
  const p = `src/evidence/decomp/d-newai-w-w6-s${s}.json`;
  if (!(await exists(p))) { missing.push({ path: p, stage: "w6", regenerable: "retrain-800st" }); w6ok = false; continue; }
  try {
    const j = await readJ(p);
    const hasP = j.P && Object.keys(j.P).length > 0;
    gate(`w6-s${s}`, j.verdict === "COMPLETE" && hasP, `verdict=${j.verdict} steps=${j.steps} C=${j.C} auxW=${j.auxW} lam=${j.lam} params=${hasP ? Object.keys(j.P).length + " blocks" : "MISSING"}`);
    if (!(j.verdict === "COMPLETE" && hasP)) { w6ok = false; missing.push({ path: p, stage: "w6-incomplete", regenerable: "retrain-800st" }); }
  } catch (e) { w6ok = false; missing.push({ path: p, stage: "w6-unparseable:" + String(e).slice(0, 80), regenerable: "retrain-800st" }); }
}
let w6v = null;
try {
  w6v = await readJ("src/evidence/decomp/d-newai-w-verdict.json");
  const scr = w6v["w6-C6-aux05-800st-lam2"] && w6v["w6-C6-aux05-800st-lam2"].scr;
  const two = w6v["w6-C6-aux05-800st-lam2"] && w6v["w6-C6-aux05-800st-lam2"].two;
  const match = JSON.stringify(scr) === JSON.stringify(w6exp.scr) && JSON.stringify(two) === JSON.stringify(w6exp.two);
  gate("w6-verdict-numbers", match, `scr=${JSON.stringify(scr)} two=${JSON.stringify(two)}`);
  if (!match) missing.push({ path: "src/evidence/decomp/d-newai-w-verdict.json", stage: "w6-numbers-drift", regenerable: false });
} catch (e) { gate("w6-verdict-numbers", false, "verdict unreadable: " + String(e).slice(0, 120)); missing.push({ path: "src/evidence/decomp/d-newai-w-verdict.json", stage: "w6-verdict-missing", regenerable: false }); }

// 4. Wave chains (driver + prereg + verdict per wave; ledgers counted in §5)
const waves = [
  ["u28", "newai-selfu28-driver.js", "self-u28-maxhinge-prereg.md", null],
  ["u31", "newai-selfu31-driver.js", "self-u31-monitor-prereg.md", "d-newai-self-u31-verdict.json"],
  ["u31b", "newai-selfu31b-driver.js", "self-u31b-r2mon-prereg.md", "d-newai-self-u31b-verdict.json"],
  ["u31c", "newai-selfu31c-driver.js", "self-u31c-subst-prereg.md", "d-newai-self-u31c-verdict.json"],
  ["u31d", "newai-selfu31d-driver.js", "self-u31d-resample-prereg.md", "d-newai-self-u31d-verdict.json"],
  ["u31e", "newai-selfu31e-driver.js", "self-u31e-selfdir-prereg.md", "d-newai-self-u31e-verdict.json"],
  ["u31f", "newai-selfu31f-driver.js", "self-u31f-substrate-hunt-prereg.md", "d-newai-self-u31f-verdict.json"],
  ["u32", null, "self-u32-trunk-repro-prereg.md", null],
];
for (const [w, drv, pre, ver] of waves) {
  const parts = [];
  if (drv) { const ok = await exists("src/evidence/decomp/" + drv); parts.push("driver:" + (ok ? "ok" : "MISSING")); if (!ok) missing.push({ path: "src/evidence/decomp/" + drv, stage: w, regenerable: "rewrite-from-prereg" }); }
  if (pre) { const ok = await exists("src/evidence/decomp/" + pre); parts.push("prereg:" + (ok ? "ok" : "MISSING")); if (!ok) missing.push({ path: "src/evidence/decomp/" + pre, stage: w, regenerable: false }); }
  if (ver) { const ok = await exists("src/evidence/decomp/" + ver); parts.push("verdict:" + (ok ? "ok" : "MISSING")); if (!ok) missing.push({ path: "src/evidence/decomp/" + ver, stage: w, regenerable: "rerun-wave" }); }
  gate("chain:" + w, !parts.some(x => x.includes("MISSING")), parts.join(" "));
}
// U32 battery file
{
  const ok = await exists("src/evidence/decomp/fresh-eyes-self-u32-3x-results.md");
  gate("chain:u32-battery", ok, ok ? "3x IMPLEMENTABLE unanimous, v1.1 pins" : "MISSING");
  if (!ok) missing.push({ path: "src/evidence/decomp/fresh-eyes-self-u32-3x-results.md", stage: "u32", regenerable: "rerun-battery" });
}

// 5. Family counts (monotonic vs §4 baseline: 70 drivers / 132 preregs / 129 verdicts / 2397 ledgers / 2707 decomp files)
const all = await fs.listFiles();
const dec = all.filter(f => f.path.startsWith("src/evidence/decomp/"));
const cnt = {
  decompFiles: dec.length,
  drivers: dec.filter(f => /driver\.js$/.test(f.path)).length,
  preregs: dec.filter(f => /prereg.*\.md$/.test(f.path)).length,
  verdicts: dec.filter(f => /verdict.*\.json$/.test(f.path)).length,
  ledgers: dec.filter(f => /\/d-.*\.json$/.test(f.path)).length,
  srcFiles: all.filter(f => f.path.startsWith("src/")).length,
};
gate("counts-drivers", cnt.drivers >= 70, cnt.drivers + " (baseline 70)");
gate("counts-preregs", cnt.preregs >= 132, cnt.preregs + " (baseline 132)");
gate("counts-verdicts", cnt.verdicts >= 129, cnt.verdicts + " (baseline 129)");
gate("counts-ledgers", cnt.ledgers >= 2397, cnt.ledgers + " (baseline 2397)");
if (cnt.drivers < 70 || cnt.preregs < 132 || cnt.verdicts < 129 || cnt.ledgers < 2397)
  missing.push({ path: "src/evidence/decomp/", stage: "counts-below-baseline", regenerable: "investigate-before-continuing" });

// 6. Docs & log layers
for (const p of ["src/evidence/decomp/REPRODUCIBILITY.md", "src/RESULTS_INDEX.md", "src/gameplan/GAMEPLAN.md", "src/CHATLOG.md", "src/agents-augment.md", "src/README.md", "src/REBUILD_FROM_SCRATCH.md", "src/evidence/conversations/README.md"]) {
  const ok = await exists(p);
  gate("doc:" + p.split("/").pop(), ok, ok ? "present" : "MISSING");
  if (!ok) missing.push({ path: p, stage: "docs", regenerable: false });
}

const failed = gates.filter(g => !g.pass);
const summary = failed.length === 0
  ? `REBUILD-READY: ${cnt.srcFiles} src files, ${cnt.ledgers} ledgers, all ${gates.length} gates pass.`
  : `NOT-READY: ${failed.length}/${gates.length} gates fail; ${missing.length} missing items listed.`;
return { summary, gates, missing, counts: cnt };
