// Wave 3 driver: test (e) midKeep sweep + test (b) confirm (computed, no new ES).
// (e): seed 305, T0 HINTED 1200, then 5 SHORT_FADE students with mid attnKeep in
// {0, 0.25, 0.5, 0.75, 1.0}. (b): compare (d) fromT0 SHORT_FADE Hd mean vs §8.4
// breed champ Hd 0.515 (paper index.html §8.4, breed-results.json).
globalThis.window = globalThis;
const ORDER = ["src/tinynn/nn.js","src/tinynn/seeded.js","src/tinynn/tasks.js","src/tinynn/train.js","src/tinynn/pcgrad.js","src/tinynn/evo.js","src/tinynn/gseries.js"];
for (const f of ORDER) { const src = await fs.readTextFile(f); (0, eval)(src + "\n//# sourceURL=" + f); }
const T = window.TinyNN, G = window.TinyNN.gseries, RNG = window.__tinyNN.makeRng;
const OPTS = {vocab:9, classes:4, h:48, m:96, d:16, arch:"attn"};
const AG = T.TASKS.assocG;
const SEED = 305;
let partial = {t0:null, sweep:{}};
try { partial = JSON.parse(await fs.readTextFile("scratch/cheap-3-partial.json")); } catch(e) {}
const train = G.buildPool(7), exams = G.buildExams(7008);
if (!partial.t0) {
  const model = T.makeModel(RNG(SEED), OPTS);
  const res = await G.trainFaded({model, tutor:null, train, stages:[{steps:1200, attnKeep:1.0, softW:0, hardW:1.0}], auxFn:AG.prefixLabels, auxW:1.0, attnAuxW:1.0, seed:SEED*100+1});
  const ev = G.evalSuite(res.model, exams);
  await fs.writeTextFile("scratch/cheap-t0-"+SEED+".json", JSON.stringify(G.saveModel(res.model, OPTS)));
  partial.t0 = {ev, ig:G.ignites(ev)};
  await fs.writeTextFile("scratch/cheap-3-partial.json", JSON.stringify(partial));
}
const tutor = G.loadModel(JSON.parse(await fs.readTextFile("scratch/cheap-t0-"+SEED+".json")));
for (const mid of [0, 0.25, 0.5, 0.75, 1.0]) {
  const k = String(mid);
  if (!partial.sweep[k]) {
    const stages = [{steps:400, attnKeep:1.0, softW:1.0, hardW:0},{steps:400, attnKeep:mid, softW:1.0, hardW:0},{steps:400, attnKeep:0.0, softW:1.0, hardW:0}];
    const tCache = await G.cacheTutor(tutor, train);
    const model = T.makeModel(RNG(SEED*1000+40+Math.round(mid*100)), OPTS);
    const res = await G.trainFaded({model, tutor, train, stages, tutorCache:tCache, seed:SEED*100+3});
    const ev = G.evalSuite(res.model, exams);
    partial.sweep[k] = {ev, ig:G.ignites(ev)};
    await fs.writeTextFile("scratch/cheap-3-partial.json", JSON.stringify(partial));
  }
}
const d = JSON.parse(await fs.readTextFile("src/evidence/synthesis/cheap-tests/d-results.json"));
const hdT = [301,302,303,304].map(s=>d.fromT0[String(s)].ev.killHd);
const meanT = hdT.reduce((a,b)=>a+b,0)/hdT.length;
const bConfirm = {taughtHdMean:+meanT.toFixed(3), breedChampHd:0.515, verdict: meanT > 0.515+2*0.04 ? "taught BEATS breed champ by >2SE — duel conclusive, no new ES needed" : "inconclusive"};
const sweepIg = Object.values(partial.sweep).filter(v=>v.ig).length;
const out = {test:"e-midkeep-sweep", preReg:"flat (all ignite or all rot) => 0.5 arbitrary, needs outer-loop search; peaked at 0.5 => hand schedule KEEPS",
  seed:SEED, t0:partial.t0, sweep:partial.sweep, sweepIgnite:sweepIg+"/5",
  bConfirm};
await fs.writeTextFile("src/evidence/synthesis/cheap-tests/e-results.json", JSON.stringify(out,null,1));
await fs.writeTextFile("src/evidence/synthesis/cheap-tests/b-confirm.json", JSON.stringify({test:"b-mutation-duel-confirm", method:"(d) fromT0 SHORT_FADE students vs paper §8.4 breed champ (pop16x6gens, Hd 0.515 vs base 0.455, below +2SE)", ...bConfirm, taughtHd:hdT},null,1));
return {ok:true, sweepIgnite:sweepIg, bConfirm:bConfirm.verdict};
