// Phase 1.a wave-1 driver (FROZEN prereg v1.0: src/evidence/synthesis/phase-1a-prereg.md).
// Per seed (311-318): T0 tutor (HINTED 1200, wave2a recipe) + 4 students x 3k steps:
// staged (reference) / attn-only (softW 0) / constant-combined / instant-drop.
// Pool/exams fixed so cross-arm tutoring is valid. Resume-safe via scratch partial.
// Ledger -> src/evidence/synthesis/phase-1a/phase-1a-results.json (adjudication reads the prereg, not this file).
globalThis.window = globalThis;
const ORDER = ["src/tinynn/nn.js","src/tinynn/seeded.js","src/tinynn/tasks.js","src/tinynn/train.js","src/tinynn/pcgrad.js","src/tinynn/evo.js","src/tinynn/gseries.js"];
for (const f of ORDER) { const src = await fs.readTextFile(f); (0, eval)(src + "\n//# sourceURL=" + f); }
const T = window.TinyNN, G = window.TinyNN.gseries, RNG = window.__tinyNN.makeRng;
const AG = T.TASKS.assocG;
const OPTS = {vocab:9, classes:4, h:48, m:96, d:16, arch:"attn"};
const HINTED = [{steps:1200, attnKeep:1.0, softW:0, hardW:1.0}];
const ARMS = {
  staged: [{steps:1000, attnKeep:1.0, softW:1.0, hardW:0},{steps:1000, attnKeep:0.5, softW:1.0, hardW:0},{steps:1000, attnKeep:0.0, softW:1.0, hardW:0}],
  attnonly: [{steps:1000, attnKeep:1.0, softW:0, hardW:0},{steps:1000, attnKeep:0.5, softW:0, hardW:0},{steps:1000, attnKeep:0.0, softW:0, hardW:0}],
  constant: [{steps:3000, attnKeep:1.0, softW:1.0, hardW:0}],
  instdrop: [{steps:1500, attnKeep:1.0, softW:1.0, hardW:0},{steps:1500, attnKeep:0.0, softW:0, hardW:0}],
};
const SEEDS = [311,312,313,314,315,316,317,318];
const ARM_IDS = Object.keys(ARMS);
let partial = {t0:{}, arms:{staged:{}, attnonly:{}, constant:{}, instdrop:{}}};
try { partial = JSON.parse(await fs.readTextFile("scratch/p1a-partial.json")); } catch(e) {}
const train = G.buildPool(7), exams = G.buildExams(7008);
for (const seed of SEEDS) {
  if (!partial.t0[seed]) {
    const model = T.makeModel(RNG(seed), OPTS);
    const t0 = Date.now();
    const res = await G.trainFaded({model, tutor:null, train, stages:HINTED, auxFn:AG.prefixLabels, auxW:1.0, attnAuxW:1.0, seed:seed*100+1});
    const ev = G.evalSuite(res.model, exams);
    await fs.writeTextFile("scratch/p1a-t0-"+seed+".json", JSON.stringify(G.saveModel(res.model, OPTS)));
    partial.t0[seed] = {ev, ig:G.ignites(ev), secs:+((Date.now()-t0)/1000).toFixed(1)};
    await fs.writeTextFile("scratch/p1a-partial.json", JSON.stringify(partial));
  }
  const tutor = G.loadModel(JSON.parse(await fs.readTextFile("scratch/p1a-t0-"+seed+".json")));
  const tCache = await G.cacheTutor(tutor, train);
  for (let a = 0; a < ARM_IDS.length; a++) {
    const arm = ARM_IDS[a];
    if (!partial.arms[arm][seed]) {
      const model = T.makeModel(RNG(seed*1000+21+a), OPTS);
      const t0 = Date.now();
      const res = await G.trainFaded({model, tutor, train, stages:ARMS[arm], tutorCache:tCache, seed:seed*100+30+a});
      const ev = G.evalSuite(res.model, exams);
      partial.arms[arm][seed] = {ev, ig:G.ignites(ev), secs:+((Date.now()-t0)/1000).toFixed(1)};
      await fs.writeTextFile("scratch/p1a-partial.json", JSON.stringify(partial));
    }
  }
}
const counts = {};
for (const arm of ARM_IDS) counts[arm] = SEEDS.filter(s=>partial.arms[arm][s].ig).length;
const out = {prereg:"src/evidence/synthesis/phase-1a-prereg.md v1.0 FROZEN", test:"1a-four-way", seeds:SEEDS,
  arms:{staged:"attnKeep 1.0/0.5/0.0 x1000, softW 1.0", attnonly:"softW 0, attnKeep staged", constant:"attnKeep 1.0 all 3k, softW 1.0", instdrop:"full hints 0-1500, zero after"},
  n:8, igniteCounts:counts, t0:partial.t0, armsDetail:partial.arms};
await fs.writeTextFile("src/evidence/synthesis/phase-1a/phase-1a-results.json", JSON.stringify(out,null,1));
return {ok:true, counts};
