// scratch/p3-a-build.js — candidate-(a) build: Gibbs/mutate-and-test search + build gates, E and N.
// Concat after scratch/p2-lib.js. Writes scratch/p3-a-elines.json + scratch/p3-a-nlines.json. Returns summary.
const P = globalThis.P2;
const blob = JSON.parse(await fs.readTextFile("src/evidence/d1a/tutor.json"));
const E = await P.loadE(blob);
const N = P.T.makeModel(P.G.makeRng(9601), P.OPTS);
const NAIVE = P.T.makeModel(P.G.makeRng(9501), P.OPTS);
const pool = P.noisePool(9810, 400, "mixed");
const poolKeys = new Set(pool.map(l=>l.x.join(",")));
function sscore(M, x, c){ const l = Array.from(M.forward(x,1).logits); return P.softmax(l)[c]; }
async function searchClass(M, c, seedBase){
  const bank = [], bankSet = new Set(), runs = [];
  let evals = 0, dead = 0, slowExt = 0, bestLine = null, bestScore = -1;
  for (let attempt = 0; attempt < 2 && bank.length < 100; attempt++){
    for (let k = 0; k < 5 && bank.length < 100; k++){
      const rng = P.G.makeRng(seedBase + attempt*100 + k);
      let cur = pool[rng.int(pool.length)].x.slice();
      let cs = sscore(M, cur, c); evals++;
      const traj = [cs]; let used = 1;
      if (cs > bestScore){ bestScore = cs; bestLine = cur.slice(); }
      if (cs >= 0.90 && !bankSet.has(cur.join(","))){ bank.push(cur.slice()); bankSet.add(cur.join(",")); cur = pool[rng.int(pool.length)].x.slice(); cs = sscore(M, cur, c); evals++; used++; }
      const before = bank.length;
      while (used < 500 && bank.length < 100){
        const pos = rng.int(cur.length); const nt = rng.int(19);
        if (nt === cur[pos]) continue;
        const prop = cur.slice(); prop[pos] = nt;
        const s = sscore(M, prop, c); evals++; used++;
        if (s > cs){ cur = prop; cs = s; if (cs > bestScore){ bestScore = cs; bestLine = cur.slice(); } }
        if (cs >= 0.90 && !bankSet.has(cur.join(","))){ bank.push(cur.slice()); bankSet.add(cur.join(",")); if (bank.length >= 100) break; cur = pool[rng.int(pool.length)].x.slice(); cs = sscore(M, cur, c); evals++; used++; }
        if (used % 50 === 0) traj.push(+bestScore.toFixed(4));
      }
      if (bank.length === before) dead++;
      runs.push({k, attempt, bankedTotal: bank.length, evalsUsed: used, traj});
    }
    if (attempt === 0 && bank.length > 0 && bank.length < 100 && slowExt === 0){
      const last = runs[runs.length-1].traj, rising = last.length > 1 && last[last.length-1] > last[0];
      if (rising){
        slowExt = 1;
        const rng = P.G.makeRng(seedBase + 777);
        let cur = bestLine.slice(), cs = sscore(M, cur, c); evals++;
        let used = 1;
        while (used < 1000 && bank.length < 100){
          const pos = rng.int(cur.length); const nt = rng.int(19);
          if (nt === cur[pos]) continue;
          const prop = cur.slice(); prop[pos] = nt;
          const s = sscore(M, prop, c); evals++; used++;
          if (s > cs){ cur = prop; cs = s; }
          if (cs >= 0.90 && !bankSet.has(cur.join(","))){ bank.push(cur.slice()); bankSet.add(cur.join(",")); if (bank.length >= 100) break; cur = pool[rng.int(pool.length)].x.slice(); cs = sscore(M, cur, c); evals++; used++; }
        }
        runs.push({k: "SLOW", attempt, bankedTotal: bank.length, evalsUsed: used});
      }
    }
  }
  return {bank, dead, slowExt, runs, evals};
}
function bandOf(len){ return len <= 12 ? 10 : len <= 17 ? 15 : len <= 35 ? 20 : 50; }
function gates(M, banks, naivePred){
  const classes = [0,1,2,3];
  const allX = [], intended = [];
  for (const c of classes) for (const x of banks[c]){ allX.push(x); intended.push(c); }
  const rec = P.readModel(M, allX.map(x=>({x}))).pred;
  const n = rec.length;
  let obs = 0; const ps=[0,0,0,0], pt=[0,0,0,0];
  for (let i=0;i<n;i++){ if (rec[i]===intended[i]) obs++; ps[rec[i]]++; pt[intended[i]]++; }
  obs = n ? obs/n : 0; let perm = 0; for (let c=0;c<4;c++) perm += (n?(ps[c]/n):0)*(n?(pt[c]/n):0);
  const np = P.readModel(naivePred, allX.map(x=>({x}))).pred;
  let na = 0; for (let i=0;i<n;i++) if (np[i]===intended[i]) na++;
  const nov = Math.max(0, n - new Set(allX.map(x=>x.join(","))).size);
  let poolHit = 0; for (const x of allX) if (poolKeys.has(x.join(","))) poolHit++;
  const freq = new Map(); let tot = 0;
  for (const x of allX) for (const t of x){ freq.set(t,(freq.get(t)||0)+1); tot++; }
  let ent = 0; for (const [,f] of freq){ const p=f/tot; ent -= p*Math.log2(p); }
  let ham = 0, pairs = 0;
  for (let i=0;i<allX.length;i++) for (let j=i+1;j<allX.length;j++){
    const a=allX[i], b=allX[j]; if (a.length!==b.length) continue;
    let d=0; for (let k=0;k<a.length;k++) if (a[k]!==b[k]) d++;
    ham += d; pairs++;
  }
  const meanLen = allX.length ? allX.reduce((s,x)=>s+x.length,0)/allX.length : 0;
  return {n, rtRaw:+(obs.toFixed(4)), rtDelta:+((obs-perm).toFixed(4)), naiveObs:+(n?(na/n):0).toFixed(4),
    novDup: nov, poolHit, ent:+ent.toFixed(3), meanHam:+(pairs?(ham/pairs):0).toFixed(2), meanLen:+meanLen.toFixed(1),
    perClass: classes.map(c=>banks[c].length), bands: allX.map(x=>bandOf(x.length)),
    intendedBands: intended.map((_,i)=>bandOf(allX[i].length))};
}
const Ebank = {}, Nbank = {};
const Eres = {};
for (const c of [0,1,2,3]){ const r = await searchClass(E, c, 98200 + c*10); Eres[c] = r; Ebank[c] = r.bank.slice(0,100); }
const Nres = {};
for (const c of [0,1,2,3]){ const r = await searchClass(N, c, 98400 + c*10); Nres[c] = r; Nbank[c] = r.bank.slice(0,100); }
const Eg = gates(E, Ebank, NAIVE), Ng = gates(N, Nbank, NAIVE);
// chi2 homogeneity E vs N on band x class (2x16, df15, crit 24.996)
function chi2(){
  const bands=[10,15,20,50], cls=[0,1,2,3];
  // build tables: rows pile(E,N) x cols (band,class)
  const cols=[];
  for (const b of bands) for (const c of cls) cols.push([b,c]);
  const eRow = cols.map(([b,c])=>Ebank[c].filter(x=>bandOf(x.length)===b).length);
  const nRow = cols.map(([b,c])=>Nbank[c].filter(x=>bandOf(x.length)===b).length);
  const eT=eRow.reduce((s,v)=>s+v,0), nT=nRow.reduce((s,v)=>s+v,0), T=eT+nT;
  let s=0;
  for (let j=0;j<cols.length;j++){
    const colT=eRow[j]+nRow[j]; if(!colT) continue;
    const eE=eT*colT/T, nE=nT*colT/T;
    if(eE>0) s+=(eRow[j]-eE)*(eRow[j]-eE)/eE;
    if(nE>0) s+=(nRow[j]-nE)*(nRow[j]-nE)/nE;
  }
  return +s.toFixed(3);
}
const chi = chi2();
function verdict(g, res){
  const per = [0,1,2,3].map(c=>{
    const got = g.perClass[c];
    return {class:c, banked: got, pass: got>=100};
  });
  return per;
}
const out = {meta:{pool:9810, target:100, cap:500, runs:5, Nseed:9601, naive:9501, chiCrit:24.996},
  E:{res: Object.fromEntries([0,1,2,3].map(c=>[c,{banked:Eres[c].bank.length, dead:Eres[c].dead, slowExt:Eres[c].slowExt, evals:Eres[c].evals}])), gates:Eg, verdict: verdict(Eg)},
  N:{res: Object.fromEntries([0,1,2,3].map(c=>[c,{banked:Nres[c].bank.length, dead:Nres[c].dead, slowExt:Nres[c].slowExt, evals:Nres[c].evals}])), gates:Ng, verdict: verdict(Ng)},
  chi2: chi};
await fs.writeTextFile("scratch/p3-a-elines.json", JSON.stringify({classes:Ebank, gates:Eg}));
await fs.writeTextFile("scratch/p3-a-nlines.json", JSON.stringify({classes:Nbank, gates:Ng}));
await fs.writeTextFile("scratch/p3-a-build.json", JSON.stringify(out));
const Epass = out.E.verdict.filter(v=>v.pass).length, Npass = out.N.verdict.filter(v=>v.pass).length;
return {ok:true, Epass, Npass, Ebanked: out.E.verdict.map(v=>v.banked), Nbanked: out.N.verdict.map(v=>v.banked),
  Ert:[Eg.rtRaw, Eg.rtDelta], Nrt:[Ng.rtRaw, Ng.rtDelta], Enaive: Eg.naiveObs, Nnaive: Ng.naiveObs,
  Eent: Eg.ent, Nent: Ng.ent, Eham: Eg.meanHam, Nham: Ng.meanHam, Epools: Eg.poolHit, Npools: Ng.poolHit, chi2: chi};
