// Wave 2b driver: test (d) frozen single-tutor ablation.
// Per seed 301-304: SHORT_FADE student from own T0 (scratch/cheap-t0-<seed>.json,
// trained in wave 2a) vs from CHAMP (Phase-3 s206w3, 1.0/1.0 inversion winner).
// Pool/exams fixed so cross-seed tutoring is valid. Resume-safe via partial.
globalThis.window = globalThis;
const ORDER = ["src/tinynn/nn.js","src/tinynn/seeded.js","src/tinynn/tasks.js","src/tinynn/train.js","src/tinynn/pcgrad.js","src/tinynn/evo.js","src/tinynn/gseries.js"];
for (const f of ORDER) { const src = await fs.readTextFile(f); (0, eval)(src + "\n//# sourceURL=" + f); }
const T = window.TinyNN, G = window.TinyNN.gseries, RNG = window.__tinyNN.makeRng;
const OPTS = {vocab:9, classes:4, h:48, m:96, d:16, arch:"attn"};
const SHORT_FADE = [{steps:400, attnKeep:1.0, softW:1.0, hardW:0},{steps:400, attnKeep:0.5, softW:1.0, hardW:0},{steps:400, attnKeep:0.0, softW:1.0, hardW:0}];
const SEEDS = [301,302,303,304];
let partial = {fromT0:{}, fromChamp:{}};
try { partial = JSON.parse(await fs.readTextFile("scratch/cheap-2b-partial.json")); } catch(e) {}
const train = G.buildPool(7), exams = G.buildExams(7008);
const champ = G.loadModel(JSON.parse(await fs.readTextFile("scratch/fs-blob-s206w3.json")));
for (const seed of SEEDS) {
  const tutors = {fromT0: G.loadModel(JSON.parse(await fs.readTextFile("scratch/cheap-t0-"+seed+".json"))), fromChamp: champ};
  for (const arm of ["fromT0","fromChamp"]) {
    if (!partial[arm][seed]) {
      const tutor = tutors[arm];
      const tCache = await G.cacheTutor(tutor, train);
      const model = T.makeModel(RNG(seed*1000+(arm==="fromT0"?11:12)), OPTS);
      const t0 = Date.now();
      const res = await G.trainFaded({model, tutor, train, stages:SHORT_FADE, tutorCache:tCache, seed:seed*100+3});
      const ev = G.evalSuite(res.model, exams);
      partial[arm][seed] = {ev, ig:G.ignites(ev), secs:+((Date.now()-t0)/1000).toFixed(1)};
      await fs.writeTextFile("scratch/cheap-2b-partial.json", JSON.stringify(partial));
    }
  }
}
const t0ig = SEEDS.filter(s=>partial.fromT0[s].ig).length, chIg = SEEDS.filter(s=>partial.fromChamp[s].ig).length;
const out = {test:"d-single-tutor", champ:"scratch/fs-blob-s206w3.json (S206 perfect 1.0/1.0)",
  preReg:"T0-taught ~= champ-taught (both ignite) => bench OVERHEAD; champ wins >=3/4 while T0 rots => bench NEEDED",
  n:4, fromT0ignite:t0ig, fromChampIgnite:chIg, fromT0:partial.fromT0, fromChamp:partial.fromChamp};
await fs.writeTextFile("src/evidence/synthesis/cheap-tests/d-results.json", JSON.stringify(out,null,1));
return {ok:true, fromT0ignite:t0ig, fromChampIgnite:chIg};
