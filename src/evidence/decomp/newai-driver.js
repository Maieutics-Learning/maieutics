// newai-driver.js — v10.1 thin wrapper over intrinsic-driver (CPU/in-worker, Float64).
// Reuses runA1Train/runA1Eval (Div K=5 fixed subspaces, 8-dim carry + forget, twin-matched seed-only streams).
// NewAI differences (pins only): prefix d-newai, specTag newai-v10.1, N_OBS=6, B_REH=2, N=400 paired evals (sharedEvalSel),
// probe gate (code-enforced record-search + battery presence), functional metrics only.
globalThis.NewAIInit = async function (fs) {
  for (const p of ["src/evidence/decomp/intrinsic-driver.js"]) {
    const src = await fs.readTextFile(p); (0, eval)(src + "\n//# sourceURL=" + p);
  }
  if (!globalThis.runA1Train || !globalThis.runA1Eval) throw new Error("newai wrapper load failed");
};
globalThis.runNewAITrain = async function (fs, log, opts) {
  return globalThis.runA1Train(fs, log, { steps: 3000, B: 16, lr: 5e-3, bReh: 2, nObs: 6,
    prefix: "d-newai", specTag: "newai-v10.1", arm: opts.arm, seed: opts.seed });
};
globalThis.runNewAIEval = async function (fs, log, opts) {
  return globalThis.runA1Eval(fs, log, { steps: 3000, bReh: 2, nObs: 6, nEval: 400, sharedEvalSel: true,
    prefix: "d-newai", specTag: "newai-v10.1", arm: opts.arm, seed: opts.seed });
};
globalThis.runNewAIProbe = async function (fs, log) {
  // EXTERNAL-GATE (filed openly, not inbuilt): refuses to train if record-search/battery missing.
  // This is scaffolding toward self-invocation, not self-invocation itself.
  const checks = [];
  try { const spec = await fs.readTextFile("src/evidence/decomp/newai-v10-prereg.md");
    checks.push(["prereg-record-search", /Record-search/i.test(spec) && /already-run/i.test(spec)]); } catch (e) { checks.push(["prereg-record-search", false]); }
  try { const bat = await fs.readTextFile("src/evidence/decomp/fresh-eyes-newai-v10-3x-results.md");
    checks.push(["battery-present", bat.length > 500]); } catch (e) { checks.push(["battery-present", false]); }
  try { const raw = await fs.readTextFile("scratch/fresh-eyes-newai-v10-3x.txt");
    checks.push(["battery-raw", raw.length > 500]); } catch (e) { checks.push(["battery-raw", false]); }
  const pass = checks.every((c) => c[1]);
  const body = { spec: "newai-v10.1", verdict: pass ? "COMPLETE" : "BLOCKED", checks: checks.map((c) => ({ name: c[0], pass: !!c[1] })),
    note: "EXTERNAL-GATE: code-enforced record-search + battery presence. Procedural scaffolding, not inbuilt self-invocation." };
  await fs.writeTextFile("src/evidence/decomp/d-newai-probe.json", JSON.stringify(body));
  log("newai-probe " + body.verdict + " " + JSON.stringify(body.checks));
  return body;
};
