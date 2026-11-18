// scratch/p3-n-survey.js — N landscape survey: naive sharpness across seeds/sizes + climbability.
// Concat after scratch/p2-lib.js. Writes scratch/p3-n-survey.json. Returns summary.
const P = globalThis.P2;
const pool = P.noisePool(9810, 400, "mixed");
const probe = P.noisePool(9860, 200, "mixed");
function sscore(M, x, c){ const l = Array.from(M.forward(x,1).logits); return P.softmax(l)[c]; }
function top1(M, x){ const l = Array.from(M.forward(x,1).logits); const s = P.softmax(l); let m=0; for(const v of s) if(v>m) m=v; return m; }
const out = {seeds:{}, sizes:{}};
// 8 fresh h48 seeds: top-1 distribution on probe
for (const s of [9601,9602,9603,9604,9605,9606,9607,9608]){
  const M = P.T.makeModel(P.G.makeRng(s), P.OPTS);
  const t = probe.map(l=>top1(M, l.x));
  const mean = t.reduce((a,b)=>a+b,0)/t.length, mx = Math.max(...t);
  out.seeds[s] = {mean:+mean.toFixed(3), max:+mx.toFixed(3),
    f70:+(t.filter(v=>v>=0.70).length/t.length).toFixed(3),
    f80:+(t.filter(v=>v>=0.80).length/t.length).toFixed(3),
    f90:+(t.filter(v=>v>=0.90).length/t.length).toFixed(4)};
}
// climbability: 5 starts x 100 evals toward best class, per seed (first 4 seeds)
out.climb = {};
for (const s of [9601,9602,9603,9604]){
  const M = P.T.makeModel(P.G.makeRng(s), P.OPTS);
  const rng = P.G.makeRng(7000+s);
  let best = 0;
  for (let st=0; st<5; st++){
    let cur = pool[rng.int(pool.length)].x.slice();
    let cs = Math.max(...[0,1,2,3].map(c=>sscore(M,cur,c)));
    for (let e=0; e<100; e++){
      const pos=rng.int(cur.length), nt=rng.int(19);
      if (nt===cur[pos]) continue;
      const prop=cur.slice(); prop[pos]=nt;
      const q=Math.max(...[0,1,2,3].map(c=>sscore(M,prop,c)));
      if (q>cs){cur=prop;cs=q;}
    }
    if (cs>best) best=cs;
  }
  out.climb[s] = +best.toFixed(3);
}
// capacity: h24/h96 naive sharpness (2 seeds each)
for (const [nm, O] of [["h24",P.O24],["h96",P.O96]]){
  out.sizes[nm] = {};
  for (const s of [9601,9602]){
    const M = P.T.makeModel(P.G.makeRng(s), O);
    const t = probe.map(l=>top1(M, l.x));
    out.sizes[nm][s] = {mean:+(t.reduce((a,b)=>a+b,0)/t.length).toFixed(3), max:+Math.max(...t).toFixed(3)};
  }
}
await fs.writeTextFile("scratch/p3-n-survey.json", JSON.stringify(out));
return {ok:true, seedMeans: Object.fromEntries(Object.entries(out.seeds).map(([k,v])=>[k,v.mean])),
  seedMax: Object.fromEntries(Object.entries(out.seeds).map(([k,v])=>[k,v.max])),
  f80: Object.fromEntries(Object.entries(out.seeds).map(([k,v])=>[k,v.f80])),
  climb: out.climb, sizes: out.sizes};
