// scratch/f-singlegen.js — F-singlegen runner v2 (kv-persisted tutor lock)
// Spec: src/evidence/synthesis/f-singlegen-spec.md
// window.FSS = {mode:"G"|"S"|"SOPT", seed, gens, stageSteps, t0url, poolSeed, examBase, kvns}
// G: classic chain (fresh student+Adam/gen, tutor=prev winner); saves tutor blobs to kv[ns].
// S: ONE student, carried weights+Adam, tutors loaded from kv (lock to paired G chain).
// SOPT: carried weights, fresh Adam/gen, same locked tutors.
// Returns compact JSON per (arm, gen): {ev, ignites, lastLoss, secs}.
return await (async () => {
  const T = window.TinyNN, G = T.gseries;
  const cfg = window.FSS;
  const RNG = window.__tinyNN.makeRng;
  const t0blob = await fetch(cfg.t0url).then(r => r.json());
  const OPTS = t0blob.opts;
  const train = G.buildPool(cfg.poolSeed);
  const exams = G.buildExams(cfg.examBase);
  const kv = window.root ? window.root.kv[cfg.kvns] : null;
  if (!kv) throw new Error("kv folder missing: root.kv." + cfg.kvns);
  const mkStages = (S) => [
    { steps: S, attnKeep: 1.0, softW: 1.0, hardW: 0 },
    { steps: S, attnKeep: 0.5, softW: 1.0, hardW: 0 },
    { steps: S, attnKeep: 0.0, softW: 1.0, hardW: 0 }
  ];
  const mkModel = (seed) => T.makeModel(RNG(seed), OPTS);
  const K = (i) => "seed" + cfg.seed + "-tutor" + i;
  const out = [];
  if (cfg.mode === "G") {
    let tutor = G.loadModel(t0blob);
    await kv.set(K(0), G.saveModel(tutor, OPTS));
    for (let gen = 1; gen <= cfg.gens; gen++) {
      const tCache = await G.cacheTutor(tutor, train);
      const model = mkModel(cfg.seed * 1000 + gen);
      const t0 = Date.now();
      const res = await G.trainFaded({ model, tutor, train, stages: mkStages(cfg.stageSteps), tutorCache: tCache, seed: cfg.seed * 100 + gen });
      const secs = +((Date.now() - t0) / 1000).toFixed(1);
      const ev = G.evalSuite(res.model, exams);
      const ig = G.ignites(ev);
      out.push({ arm: "G", gen, ev, ignites: ig, lastLoss: +res.lastLoss.toFixed(4), secs });
      if (!ig) break;
      tutor = res.model;
      await kv.set(K(gen), G.saveModel(tutor, OPTS));
    }
  } else {
    const carryAdam = (cfg.mode === "S");
    let smodel = mkModel(cfg.seed * 1000 + 1); // same init as G gen-1
    let adam = null, rng = null;
    for (let gen = 1; gen <= cfg.gens; gen++) {
      const blob = await kv.get(K(gen - 1));
      if (!blob) { out.push({ arm: cfg.mode, gen, error: "no-tutor" }); break; }
      const stutor = G.loadModel(blob);
      const tCache = await G.cacheTutor(stutor, train);
      const call = { model: smodel, tutor: stutor, train, stages: mkStages(cfg.stageSteps), tutorCache: tCache, seed: cfg.seed * 100 + gen };
      if (carryAdam && adam) { call.adam = adam; call.rng = rng; }
      const t0 = Date.now();
      const res = await G.trainFaded(call);
      const secs = +((Date.now() - t0) / 1000).toFixed(1);
      if (carryAdam) { adam = res.adam; rng = res.rng; }
      smodel = res.model;
      const ev = G.evalSuite(smodel, exams);
      const ig = G.ignites(ev);
      out.push({ arm: cfg.mode, gen, ev, ignites: ig, lastLoss: +res.lastLoss.toFixed(4), secs });
      if (!ig) break;
    }
  }
  return { cfg: { mode: cfg.mode, seed: cfg.seed, gens: cfg.gens, stageSteps: cfg.stageSteps }, chains: out };
})();
