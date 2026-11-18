// scratch/p3-e-autopsy-topup.js — E-line autopsy + novelty-clean top-up rebuild.
// Concat after scratch/p2-lib.js. Writes scratch/p3-e-autopsy.json + scratch/p3-a-elines-v2.json.
const P = globalThis.P2;
const blob = JSON.parse(await fs.readTextFile("src/evidence/d1a/tutor.json"));
const E = await P.loadE(blob);
const pool = P.noisePool(9810, 400, "mixed");
const poolKeys = new Set(pool.map(l=>l.x.join(",")));
const EL = JSON.parse(await fs.readTextFile("scratch/p3-a-elines.json"));
// ---- AUTOPSY on v1 E-lines ----
function sscore(M, x, c){ const l = Array.from(M.forward(x,1).logits); return P.softmax(l)[c]; }
const aut = {};
for (const c of ["0","1","2","3"]){
  const lines = EL.classes[c];
  const freq = new Map(); let tot=0;
  for (const x of lines) for (const t of x){ freq.set(t,(freq.get(t)||0)+1); tot++; }
  let ent=0; for (const [,f] of freq){ const p=f/tot; ent-=p*Math.log2(p); }
  const conf = lines.map(x=>sscore(E,x,+c));
  const margins = lines.map(x=>{ const s=P.softmax(Array.from(E.forward(x,1).logits)).slice().sort((a,b)=>b-a); return s[0]-s[1]; });
  const firstTok = lines.map(x=>x[0]), lastTok = lines.map(x=>x[x.length-1]);
  const fF=new Map(), fL=new Map();
  for (const t of firstTok) fF.set(t,(fF.get(t)||0)+1);
  for (const t of lastTok) fL.set(t,(fL.get(t)||0)+1);
  const top = (m)=>[...m.entries()].sort((a,b)=>b[1]-a[1]).slice(0,3).map(([t,f])=>[t,+(f/lines.length).toFixed(3)]);
  // min-Hamming to pool
  let mh=0; for (const x of lines){ let best=1e9; for (const p of pool){ if(p.x.length!==x.length) continue; let d=0; for(let k=0;k<x.length;k++) if(x[k]!==p.x[k])d++; if(d<best)best=d; } mh+=best; }
  const bands={10:0,15:0,20:0,50:0};
  for (const x of lines){ const b = x.length<=12?10:x.length<=17?15:x.length<=35?20:50; bands[b]++; }
  aut[c] = {n: lines.length, ent:+ent.toFixed(3),
    confMean:+(conf.reduce((a,b)=>a+b,0)/conf.length).toFixed(4), confMin:+Math.min(...conf).toFixed(4),
    marginMean:+(margins.reduce((a,b)=>a+b,0)/margins.length).toFixed(4),
    firstTop: top(fF), lastTop: top(fL), meanMinHamPool:+(mh/lines.length).toFixed(1), bands,
    poolExact: lines.filter(x=>poolKeys.has(x.join(","))).length};
}
await fs.writeTextFile("scratch/p3-e-autopsy.json", JSON.stringify(aut));
// ---- TOP-UP: fresh rebuild, pool-exact banking rejected ----
async function searchNovel(M, c, seedBase){
  const bank = [], bankSet = new Set();
  let evals=0, dead=0;
  for (let attempt=0; attempt<2 && bank.length<100; attempt++){
    for (let k=0;k<5 && bank.length<100;k++){
      const rng = P.G.makeRng(seedBase + attempt*100 + k);
      let cur = pool[rng.int(pool.length)].x.slice();
      let cs = sscore(M,cur,c); evals++;
      const key0=cur.join(",");
      if (cs>=0.90 && !poolKeys.has(key0) && !bankSet.has(key0)){bank.push(cur.slice());bankSet.add(key0);}
      const before=bank.length; let used=1;
      while (used<500 && bank.length<100){
        const pos=rng.int(cur.length), nt=rng.int(19);
        if (nt===cur[pos]) continue;
        const prop=cur.slice(); prop[pos]=nt;
        const s=sscore(M,prop,c); evals++; used++;
        if (s>cs){cur=prop;cs=s;}
        const key=cur.join(",");
        if (cs>=0.90 && !poolKeys.has(key) && !bankSet.has(key)){bank.push(cur.slice());bankSet.add(key); if(bank.length>=100)break; cur=pool[rng.int(pool.length)].x.slice(); cs=sscore(M,cur,c); evals++; used++;}
      }
      if (bank.length===before) dead++;
    }
  }
  return {bank: bank.slice(0,100), dead, evals};
}
const Ebank2 = {}, meta={};
for (const c of [0,1,2,3]){ const r = await searchNovel(E, c, 98600 + c*10); Ebank2[c]=r.bank; meta[c]={banked:r.bank.length, dead:r.dead, evals:r.evals}; }
// re-gate with lib gates logic (inline copy, NAIVE fresh 9501)
const NAIVE = P.T.makeModel(P.G.makeRng(9501), P.OPTS);
function bandOf(len){ return len<=12?10:len<=17?15:len<=35?20:50; }
function gates(M, banks, naive){
  const classes=[0,1,2,3], allX=[], intended=[];
  for (const c of classes) for (const x of banks[c]){allX.push(x);intended.push(c);}
  const rec=P.readModel(M, allX.map(x=>({x}))).pred, n=rec.length;
  let a=0; const ps=[0,0,0,0], pt=[0,0,0,0];
  for(let i=0;i<n;i++){if(rec[i]===intended[i])a++;ps[rec[i]]++;pt[intended[i]]++;}
  const obs=n?a/n:0; let perm=0; for(let c=0;c<4;c++)perm+=(n?ps[c]/n:0)*(n?pt[c]/n:0);
  const np=P.readModel(naive, allX.map(x=>({x}))).pred;
  let na=0; for(let i=0;i<n;i++) if(np[i]===intended[i])na++;
  const freq=new Map(); let tot=0;
  for(const x of allX) for(const t of x){freq.set(t,(freq.get(t)||0)+1);tot++;}
  let ent=0; for(const [,f] of freq){const p=f/tot;ent-=p*Math.log2(p);}
  let ham=0,pairs=0;
  for(let i=0;i<allX.length;i++)for(let j=i+1;j<allX.length;j++){const A=allX[i],B=allX[j];if(A.length!==B.length)continue;let d=0;for(let k=0;k<A.length;k++)if(A[k]!==B[k])d++;ham+=d;pairs++;}
  const meanLen=allX.length?allX.reduce((s,x)=>s+x.length,0)/allX.length:0;
  let poolHit=0; for(const x of allX) if(poolKeys.has(x.join(",")))poolHit++;
  return {n, rtRaw:+obs.toFixed(4), rtDelta:+(obs-perm).toFixed(4), naiveObs:+(n?na/n:0).toFixed(4),
    poolHit, ent:+ent.toFixed(3), meanHam:+(pairs?ham/pairs:0).toFixed(2), meanLen:+meanLen.toFixed(1),
    perClass: classes.map(c=>banks[c].length)};
}
const g2 = gates(E, Ebank2, NAIVE);
await fs.writeTextFile("scratch/p3-a-elines-v2.json", JSON.stringify({classes:Ebank2, gates:g2}));
return {ok:true, autopsy: aut, topup: {meta, gates: g2}};
