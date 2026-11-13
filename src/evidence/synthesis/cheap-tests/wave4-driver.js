// Wave 4 driver: test (f) PBT-lite. Pop 4, 2 rounds x 600-step legs.
// Exploit: bottom-2 copy weights+midKeep of top-2. Explore: one copy midKeep
// ±0.25 (schedule arm), other copy weight noise sigma 0.005 (weight arm).
// Seeds 305 (T0 exists) + 306 (train T0 + fixed mid=0.5 control). Resume-safe.
globalThis.window = globalThis;
const ORDER = ["src/tinynn/nn.js","src/tinynn/seeded.js","src/tinynn/tasks.js","src/tinynn/train.js","src/tinynn/pcgrad.js","src/tinynn/evo.js","src/tinynn/gseries.js"];
for (const f of ORDER) { const src = await fs.readTextFile(f); (0, eval)(src + "\n//# sourceURL=" + f); }
const T = window.TinyNN, G = window.TinyNN.gseries, RNG = window.__tinyNN.makeRng;
const OPTS = {vocab:9, classes:4, h:48, m:96, d:16, arch:"attn"};
const AG = T.TASKS.assocG;
const SEEDS = [305, 306];
const MIDS0 = [0.25, 0.5, 0.75, 1.0];
let partial = {t0:{}, fixed:{}, pbt:{}};
try { partial = JSON.parse(await fs.readTextFile("scratch/cheap-4-partial.json")); } catch(e) {}
const train = G.buildPool(7), exams = G.buildExams(7008);
const acc2 = (m,s)=>+T.evaluate(m,s,4).acc.toFixed(4);
async function legs(model, tutor, mid, seedTag, steps) {
  const h = Math.floor(steps/3);
  const stages = [{steps:h, attnKeep:1.0, softW:1.0, hardW:0},{steps:h, attnKeep:mid, softW:1.0, hardW:0},{steps:steps-2*h, attnKeep:0.0, softW:1.0, hardW:0}];
  const tCache = await G.cacheTutor(tutor, train);
  const res = await G.trainFaded({model, tutor, train, stages, tutorCache:tCache, seed:seedTag});
  return res.model;
}
function fit(model) {
  const a = acc2(model, exams.killA), h = acc2(model, exams.killHd);
  return {killA:a, killHd:h, fit:+(a+h).toFixed(4), ig:G.ignites({killA:a, killHd:h})};
}
for (const seed of SEEDS) {
  if (!partial.t0[seed]) {
    const m0 = T.makeModel(RNG(seed), OPTS);
    const r = await G.trainFaded({model:m0, tutor:null, train, stages:[{steps:1200, attnKeep:1.0, softW:0, hardW:1.0}], auxFn:AG.prefixLabels, auxW:1.0, attnAuxW:1.0, seed:seed*100+1});
    await fs.writeTextFile("scratch/cheap-t0-"+seed+".json", JSON.stringify(G.saveModel(r.model, OPTS)));
    partial.t0[seed] = G.evalSuite(r.model, exams);
    await fs.writeTextFile("scratch/cheap-4-partial.json", JSON.stringify(partial));
  }
  const tutor = G.loadModel(JSON.parse(await fs.readTextFile("scratch/cheap-t0-"+seed+".json")));
  if (!partial.fixed[seed]) {
    const m = T.makeModel(RNG(seed*1000+50), OPTS);
    const m2 = await legs(m, tutor, 0.5, seed*100+7, 1200);
    partial.fixed[seed] = fit(m2);
    await fs.writeTextFile("scratch/cheap-4-partial.json", JSON.stringify(partial));
  }
  if (!partial.pbt[seed]) {
    const rng = RNG(seed*1000+77);
    let pop = MIDS0.map((mid,i)=>({model:T.makeModel(RNG(seed*1000+100+i), OPTS), mid, hist:[]}));
    for (let round = 1; round <= 2; round++) {
      for (const ind of pop) ind.model = await legs(ind.model, tutor, ind.mid, seed*1000+round*10+Math.round(ind.mid*100), 600);
      const scored = pop.map(ind=>({ind, ...fit(ind.model)})).sort((a,b)=>b.fit-a.fit);
      for (const s of scored) s.ind.hist.push({round, mid:s.ind.mid, fit:s.fit, ig:s.ig});
      if (round < 2) {
        const winners = [scored[0].ind, scored[1].ind];
        const mkCopy = (w, mode) => {
          const m = w.model.clone();
          let mid = w.mid;
          if (mode === "sched") mid = Math.min(1, Math.max(0, +(mid + (rng.uniform(0,1)<0.5?-0.25:0.25)).toFixed(2)));
          if (mode === "weight") for (const p of m.params()) for (let i=0;i<p.v.length;i++) p.v[i] += rng.normal(0.005);
          return {model:m, mid, hist:w.hist.slice()};
        };
        pop = [winners[0], winners[1], mkCopy(winners[1], "sched"), mkCopy(winners[0], "weight")];
      } else {
        partial.pbt[seed] = scored.map(s=>({mid:s.ind.mid, fit:s.fit, ig:s.ig, killA:s.killA, killHd:s.killHd}));
      }
    }
    await fs.writeTextFile("scratch/cheap-4-partial.json", JSON.stringify(partial));
  }
}
const cmp = {};
for (const seed of SEEDS) {
  const best = partial.pbt[seed].slice().sort((a,b)=>b.fit-a.fit)[0];
  const fx = partial.fixed[seed];
  cmp[seed] = {pbtBest:best, fixed:fx,
    verdict: (best.ig && !fx.ig) ? "PBT wins (+1 ignition)" : (best.fit > fx.fit+0.1 ? "PBT wins on fitness" : "no PBT advantage")};
}
const out = {test:"f-pbt-lite", preReg:"beats best fixed SHORT_FADE on same seeds by >=1 ignition, else not worth complexity",
  n:"2 seeds x pop4 x 2 rounds x 600-step legs", fixed:partial.fixed, pbt:partial.pbt, cmp};
await fs.writeTextFile("src/evidence/synthesis/cheap-tests/f-results.json", JSON.stringify(out,null,1));
return {ok:true, cmp};
