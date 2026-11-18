// scratch/p3-twins-stageB.js — Stage B student run (v0.5, countersigned) on REBUILT cycle-3 exams.
// Fixes filed openly:
//   FIX-1 (NaN bug): tutorCache built as whole 4-logit row arrays per (example, r),
//     exactly like cacheTutor (gseries.js lines 125-137): cache[i*4+(r-1)] = Array.from(...).
//     The poisoned B run built flat scalars, yielding zeros/NaN and null losses.
//   FIX-2 (integrity): exams loaded from persisted line files (scratch/p3-twins-A2r-lines-c3-*.json)
//     with gate: nUniq==100, counts match scratch/p3-twins-A2r-c3.json, else ABORT (no silent pass).
//   FIX-3 (mapping): one student per writer: 9601u->9790, 9602u->9791, 9603u->9792;
//     blinds 9601u->9610, 9602u->9611, 9603u->9612. (v0.5 listed seed sets; mapping filed here.)
// Method per writer: fresh 4-way attn student (init seed S), distill N-9601 soft targets
//   on the writer's 100 cycle-3 lines, stages [{steps:1500, attnKeep:0, softW:1, hardW:0}],
//   batch 8, lr 5e-3, rMode 1. Blind: fresh 4-way (init seed B), untaught.
// Bar per writer (v0.5): delta=obs-perm >= 0.20 AND blind within 0.25+-0.10 else VOID.
// Claim: >=2/3 pass.
// USAGE: const B = await TwinsStageBInit(fs); await B.runWriter("9601u", 9790, 9610); ...
globalThis.TwinsStageBInit = async function (fs) {
  globalThis.window = globalThis;
  const ORDER = ["src/tinynn/nn.js", "src/tinynn/seeded.js", "src/tinynn/tasks.js", "src/tinynn/train.js", "src/tinynn/gseries.js"];
  for (const p of ORDER) { const src = await fs.readTextFile(p); (0, eval)(src + "\n//# sourceURL=" + p); }
  const G = globalThis.__tinyNN, T = globalThis.TinyNN;
  if (!G || !T || !T.gseries) throw new Error("stack load failed");
  const OPTS4 = { vocab: 19, classes: 4, h: 48, m: 96, d: 16, arch: "attn" };
  function argmax(a) { let b = 0; for (let i = 1; i < a.length; i++) if (a[i] > a[b]) b = i; return b; }
  // FIX-1: row-array cache, exactly like cacheTutor
  async function cacheTutorRows(tutor, train) {
    const cache = new Array(train.length * 4);
    for (let i = 0; i < train.length; i++) {
      for (let r = 1; r <= 4; r++) cache[i * 4 + (r - 1)] = Array.from(tutor.forward(train[i].x, r).logits);
      if (i % 25 === 24) await new Promise((res) => setTimeout(res, 0));
    }
    return cache;
  }
  function pairStats(tPred, sPred) {
    const n = tPred.length; let a = 0;
    const ps = [0, 0, 0, 0], pt = [0, 0, 0, 0];
    for (let i = 0; i < n; i++) { if (tPred[i] === sPred[i]) a++; ps[sPred[i]]++; pt[tPred[i]]++; }
    const obs = a / n; let perm = 0;
    for (let c = 0; c < 4; c++) perm += (ps[c] / n) * (pt[c] / n);
    return { obs: +obs.toFixed(4), perm: +perm.toFixed(4), delta: +(obs - perm).toFixed(4) };
  }
  async function runWriter(nm, studentSeed, blindSeed) {
    // load exam lines (persisted rebuild)
    const ef = JSON.parse(await fs.readTextFile(`scratch/p3-twins-A2r-lines-c3-${nm}.json`));
    const ledger = JSON.parse(await fs.readTextFile("scratch/p3-twins-A2r-c3.json"));
    // FIX-2: integrity gate
    const uniq = new Set(ef.lines.map(x => x.join(","))).size;
    if (uniq !== 100) return { nm, abort: true, reason: "integrity: nUniq=" + uniq };
    if (ef.lines.length !== 100) return { nm, abort: true, reason: "integrity: nexam=" + ef.lines.length };
    const grader = T.makeModel(G.makeRng(9601), OPTS4);
    const exam = ef.lines.map(x => ({ x }));
    const glabels = exam.map(e => argmax(Array.from(grader.forward(e.x, 1).logits)));
    const filedCounts = ledger.perInst[nm].counts;
    const myCounts = [0, 0, 0, 0];
    for (const l of glabels) myCounts[l]++;
    if (JSON.stringify(myCounts) !== JSON.stringify(filedCounts))
      return { nm, abort: true, reason: "integrity: recount " + myCounts + " vs ledger " + filedCounts };
    const train = exam.map((e, i) => ({ x: e.x, y: glabels[i] }));
    // student
    const student = T.makeModel(G.makeRng(studentSeed), OPTS4);
    const cache = await cacheTutorRows(grader, train);
    // sanity: cache entries must be 4-logit arrays, finite
    for (let i = 0; i < cache.length; i += 4) {
      const row = cache[i];
      if (!Array.isArray(row) || row.length !== 4 || !row.every(Number.isFinite))
        return { nm, abort: true, reason: "integrity: bad cache row " + i };
    }
    const res = await T.gseries.trainFaded({
      model: student, tutor: grader, tutorCache: cache, train,
      stages: [{ steps: 1500, attnKeep: 0, softW: 1, hardW: 0 }],
      rMode: 1, batch: 8, lr: 5e-3, seed: studentSeed
    });
    if (!Number.isFinite(res.lastLoss)) return { nm, abort: true, reason: "non-finite student loss" };
    const spred = train.map(e => argmax(Array.from(student.forward(e.x, 1).logits)));
    const st = pairStats(glabels, spred);
    // blind
    const blind = T.makeModel(G.makeRng(blindSeed), OPTS4);
    const bpred = train.map(e => argmax(Array.from(blind.forward(e.x, 1).logits)));
    const bt = pairStats(glabels, bpred);
    const blindOk = bt.obs >= 0.15 && bt.obs <= 0.35;
    const pass = blindOk && st.delta >= 0.20;
    return {
      nm, exam: 100, firstLoss: +res.firstLoss.toFixed(4), lastLoss: +res.lastLoss.toFixed(4),
      teachObs: st.obs, teachPerm: st.perm, delta: st.delta,
      blindObs: bt.obs, blindPerm: bt.perm, blindOk, voided: !blindOk, pass
    };
  }
  return { runWriter };
};
globalThis.TwinsStageBReady = true;
