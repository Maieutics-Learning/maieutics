// Wave 2a driver: per-seed T0 (HINTED 1200, attn+bind supervision, no tutor) +
// test (a) zero-hint baseline (supervised hard-labels only, 1200 steps).
// Seeds 301-304. Checkpoints to scratch/cheap-2a-partial.json (resume-safe).
globalThis.window = globalThis;
const ORDER = ["src/tinynn/nn.js","src/tinynn/seeded.js","src/tinynn/tasks.js","src/tinynn/train.js","src/tinynn/pcgrad.js","src/tinynn/evo.js","src/tinynn/gseries.js"];
for (const f of ORDER) { const src = await fs.readTextFile(f); (0, eval)(src + "\n//# sourceURL=" + f); }
const T = window.TinyNN, G = window.TinyNN.gseries, RNG = window.__tinyNN.makeRng;
const OPTS = {vocab:9, classes:4, h:48, m:96, d:16, arch:"attn"};
const AG = T.TASKS.assocG;
const HINTED = [{steps:1200, attnKeep:1.0, softW:0, hardW:1.0}];
const SUPERVISED = [{steps:1200, attnKeep:0, softW:0, hardW:1.0}]; // no tutor, no aux, no attn
const SEEDS = [301,302,303,304];
let partial = {t0:{}, sup:{}};
try { partial = JSON.parse(await fs.readTextFile("scratch/cheap-2a-partial.json")); } catch(e) {}
const train = G.buildPool(7), exams = G.buildExams(7008);
for (const seed of SEEDS) {
  if (!partial.t0[seed]) {
    const model = T.makeModel(RNG(seed), OPTS);
    const t0 = Date.now();
    const res = await G.trainFaded({model, tutor:null, train, stages:HINTED, auxFn:AG.prefixLabels, auxW:1.0, attnAuxW:1.0, seed:seed*100+1});
    const ev = G.evalSuite(res.model, exams);
    await fs.writeTextFile("scratch/cheap-t0-"+seed+".json", JSON.stringify(G.saveModel(res.model, OPTS)));
    partial.t0[seed] = {ev, ig:G.ignites(ev), secs:+((Date.now()-t0)/1000).toFixed(1)};
    await fs.writeTextFile("scratch/cheap-2a-partial.json", JSON.stringify(partial));
  }
  if (!partial.sup[seed]) {
    const model = T.makeModel(RNG(seed+999), OPTS);
    const t0 = Date.now();
    const res = await G.trainFaded({model, tutor:null, train, stages:SUPERVISED, seed:seed*100+2});
    const ev = G.evalSuite(res.model, exams);
    partial.sup[seed] = {ev, ig:G.ignites(ev), secs:+((Date.now()-t0)/1000).toFixed(1)};
    await fs.writeTextFile("scratch/cheap-2a-partial.json", JSON.stringify(partial));
  }
}
const supIg = SEEDS.filter(s=>partial.sup[s].ig).length;
const out = {test:"a-zero-hint", preReg:">=2/4 ignite => schedule claim WEAKENS; 0/4 => HOLDS", n:4, supIgnite:supIg, t0:partial.t0, sup:partial.sup};
await fs.writeTextFile("src/evidence/synthesis/cheap-tests/a-results.json", JSON.stringify(out,null,1));
return {ok:true, supIgnite:supIg, t0ig:SEEDS.filter(s=>partial.t0[s].ig).length};
