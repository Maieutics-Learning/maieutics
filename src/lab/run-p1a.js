// Phase 1.a Stage-2 headless runner (proposal, awaiting countersign — do not run yet).
// Zero-dep Node: loads src/tinynn directly, trains one T0 tutor (HINTED 1200)
// + one 3k-step student for the given (seed, arm), writes a ledger JSON.
// Deterministic: same seed+arm => same result on any engine (modulo float ulp;
// ledger byte-compare allows the documented tolerance fallback per gameplan).
// Usage: node src/lab/run-p1a.js --seed 321 --arm staged --out ledger-321-staged.json
"use strict";
const fs = require("fs");
const path = require("path");

function arg(name, def) {
  const i = process.argv.indexOf("--" + name);
  return i >= 0 && i + 1 < process.argv.length ? process.argv[i + 1] : def;
}

const seed = parseInt(arg("seed", "321"), 10);
const arm = arg("arm", "staged");
const out = arg("out", `ledger-${seed}-${arm}.json`);

const ORDER = ["src/tinynn/nn.js", "src/tinynn/seeded.js", "src/tinynn/tasks.js",
  "src/tinynn/train.js", "src/tinynn/pcgrad.js", "src/tinynn/evo.js", "src/tinynn/gseries.js"];
globalThis.window = globalThis;
for (const f of ORDER) {
  const src = fs.readFileSync(path.join(process.cwd(), f), "utf8");
  (0, eval)(src + "\n//# sourceURL=" + f);
}

const T = globalThis.window.TinyNN, G = globalThis.window.TinyNN.gseries;
const RNG = globalThis.window.__tinyNN.makeRng;
const AG = T.TASKS.assocG;
const OPTS = { vocab: 9, classes: 4, h: 48, m: 96, d: 16, arch: "attn" };
const HINTED = [{ steps: 1200, attnKeep: 1.0, softW: 0, hardW: 1.0 }];
const ARMS = {
  staged: [{ steps: 1000, attnKeep: 1.0, softW: 1.0, hardW: 0 }, { steps: 1000, attnKeep: 0.5, softW: 1.0, hardW: 0 }, { steps: 1000, attnKeep: 0.0, softW: 1.0, hardW: 0 }],
  constant: [{ steps: 3000, attnKeep: 1.0, softW: 1.0, hardW: 0 }],
  instdrop: [{ steps: 1500, attnKeep: 1.0, softW: 1.0, hardW: 0 }, { steps: 1500, attnKeep: 0.0, softW: 0.0, hardW: 0 }],
};
if (!ARMS[arm]) { console.error("bad arm (staged|constant|instdrop): " + arm); process.exit(2); }
const ARM_INDEX = { staged: 0, constant: 1, instdrop: 2 }[arm];

async function main() {
  const t0 = Date.now();
  const train = G.buildPool(7), exams = G.buildExams(7008);
  const tTutor0 = Date.now();
  const tutorModel = T.makeModel(RNG(seed), OPTS);
  const tRes = await G.trainFaded({ model: tutorModel, tutor: null, train,
    stages: HINTED, auxFn: AG.prefixLabels, auxW: 1.0, attnAuxW: 1.0, seed: seed * 100 + 1 });
  const tEv = G.evalSuite(tRes.model, exams);
  const tutorSecs = (Date.now() - tTutor0) / 1000;
  const tCache = await G.cacheTutor(tRes.model, train);
  const tStud0 = Date.now();
  const studentModel = T.makeModel(RNG(seed * 1000 + 21 + ARM_INDEX), OPTS);
  const sRes = await G.trainFaded({ model: studentModel, tutor: tRes.model, train,
    stages: ARMS[arm], tutorCache: tCache, seed: seed * 100 + 30 + ARM_INDEX });
  const sEv = G.evalSuite(sRes.model, exams);
  const studentSecs = (Date.now() - tStud0) / 1000;
  const ledger = { prereg: "phase-1a v1.0 + Stage-2 (b-i) PROPOSED — do not adjudicate until countersigned",
    test: "1a-stage2", seed, arm, tutor: { ev: tEv, ig: G.ignites(tEv), secs: +tutorSecs.toFixed(1) },
    student: { ev: sEv, ig: G.ignites(sEv), secs: +studentSecs.toFixed(1) },
    wallSecs: +(Date.now() - t0) / 1000 };
  fs.writeFileSync(out, JSON.stringify(ledger, null, 1));
  console.log(JSON.stringify({ ok: true, seed, arm, tutorIg: ledger.tutor.ig, studentIg: ledger.student.ig, out }));
}

main().catch((e) => { console.error("run failed: " + (e && e.stack || e)); process.exit(1); });
