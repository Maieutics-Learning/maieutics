// scratch/p3-n-recal.js — N rebuild at 0.80 (filed gap) + E-lens cross-reading.
// Concat after scratch/p2-lib.js. Writes scratch/p3-n-recal.json. Exploratory: gate change filed, nothing graduates.
const P = globalThis.P2;
const blob = JSON.parse(await fs.readTextFile("src/evidence/d1a/tutor.json"));
const E = await P.loadE(blob);
const N = P.T.makeModel(P.G.makeRng(9601), P.OPTS);
const NAIVE = P.T.makeModel(P.G.makeRng(9501), P.OPTS);
const pool = P.noisePool(9810, 400, "mixed");
const poolKeys = new Set(pool.map(l=>l.x.join(",")));
const EL2 = JSON.parse(await fs.readTextFile("scratch/p3-a-elines-v2.json"));
function sscore(M, x, c){ const l = Array.from(M.forward(x,1).logits); return P.softmax(l)[c]; }
async function searchN(M, c, seedBase, target){
  const bank = [], bankSet = new Set(), best = [];
  let evals=0, dead=0;
  const pushBest = (x, s)=>{ best.push({x:x.slice(), s:+s.toFixed(4)}); best.sort((a,b)=>b.s-a.s); if(best.length>20)best.length=20; };
  for (let attempt=0; attempt<2 && bank.length<100; attempt++){
    for (let k=0;k<5 && bank.length<100;k++){
      const rng = P.G.makeRng(seedBase + attempt*100 + k);
      let cur = pool[rng.int(pool.length)].x.slice();
      let cs = sscore(M,cur,c); evals++;
      pushBest(cur, cs);
      const key0=cur.join(",");
      if (cs>=target && !poolKeys.has(key0) && !bankSet.has(key0)){bank.push(cur.slice());bankSet.add(key0);}
      const before=bank.length; let used=1;
      while (used<500 && bank.length<100){
        const pos=rng.int(cur.length), nt=rng.int(19);
        if (nt===cur[pos]) continue;
        const prop=cur.slice(); prop[pos]=nt;
        const s=sscore(M,prop,c); evals++; used++;
        if (s>cs){cur=prop;cs=s;pushBest(cur,cs);}
        const key=cur.join(",");
        if (cs>=target && !poolKeys.has(key) && !bankSet.has(key)){bank.push(cur.slice());bankSet.add(key); if(bank.length>=100)break; cur=pool[rng.int(pool.length)].x.slice(); cs=sscore(M,cur,c); evals++; used++; pushBest(cur,cs);}
      }
      if (bank.length===before) dead++;
    }
  }
  return {bank: bank.slice(0,100), dead, evals, best};
}
const Nbank={}, Nmeta={}, Nbest={};
for (const c of [0,1,2,3]){ const r=await searchN(N,c,98800+c*10,0.80); Nbank[c]=r.bank; Nmeta[c]={banked:r.bank.length,dead:r.dead,evals:r.evals}; Nbest[c]=r.best.map(b=>({x:b.x,s:b.s})); }
// gates (same consistency gates; banking target 0.80 filed)
function bandOf(len){ return len<=12?10:len<=17?15:len<=35?20:50; }
function gates(M, banks, naive){
  const classes=[0,1,2,3], allX=[], intended=[];
  for (const c of classes) for (const x of banks[c]){allX.push(x);intended.push(c);}
  const n=allX.length;
  if(!n) return {n:0};
  const rec=P.readModel(M, allX.map(x=>({x}))).pred;
  let a=0; const ps=[0,0,0,0], pt=[0,0,0,0];
  for(let i=0;i<n;i++){if(rec[i]===intended[i])a++;ps[rec[i]]++;pt[intended[i]]++;}
  const obs=a/n; let perm=0; for(let c=0;c<4;c++)perm+=(ps[c]/n)*(pt[c]/n);
  const np=P.readModel(naive, allX.map(x=>({x}))).pred;
  let na=0; for(let i=0;i<n;i++) if(np[i]===intended[i])na++;
  const freq=new Map(); let tot=0;
  for(const x of allX) for(const t of x){freq.set(t,(freq.get(t)||0)+1);tot++;}
  let ent=0; for(const [,f] of freq){const p=f/tot;ent-=p*Math.log2(p);}
  let ham=0,pairs=0;
  for(let i=0;i<allX.length;i++)for(let j=i+1;j<allX.length;j++){const A=allX[i],B=allX[j];if(A.length!==B.length)continue;let d=0;for(let k=0;k<A.length;k++)if(A[k]!==B[k])d++;ham+=d;pairs++;}
  const meanLen=allX.reduce((s,x)=>s+x.length,0)/n;
  let poolHit=0; for(const x of allX) if(poolKeys.has(x.join(",")))poolHit++;
  return {n, rtRaw:+obs.toFixed(4), rtDelta:+(obs-perm).toFixed(4), naiveObs:+(na/n).toFixed(4),
    poolHit, ent:+ent.toFixed(3), meanHam:+(pairs?ham/pairs:0).toFixed(2), meanLen:+meanLen.toFixed(1),
    perClass: classes.map(c=>banks[c].length)};
}
const Ng = gates(N, Nbank, NAIVE);
// E-lens cross-reading
function profile(M, lines){
  const ss = lines.map(x=>P.softmax(Array.from(M.forward(x,1).logits)));
  const t1 = ss.map(s=>Math.max(...s));
  const mg = ss.map(s=>{const q=s.slice().sort((a,b)=>b-a);return q[0]-q[1];});
  return {top1Mean:+(t1.reduce((a,b)=>a+b,0)/t1.length).toFixed(4), marginMean:+(mg.reduce((a,b)=>a+b,0)/mg.length).toFixed(4)};
}
const flatN = [].concat(Nbank[0],Nbank[1],Nbank[2],Nbank[3]);
const flatE = [].concat(EL2.classes[0],EL2.classes[1],EL2.classes[2],EL2.classes[3]);
const intendedN = [].concat(...[0,1,2,3].map(c=>Nbank[c].map(()=>c)));
const intendedE = [].concat(...[0,1,2,3].map(c=>EL2.classes[c].map(()=>c)));
const eReadsN = P.readModel(E, flatN.map(x=>({x}))).pred;
const nReadsE = P.readModel(N, flatE.map(x=>({x}))).pred;
let aEN=0; for(let i=0;i<flatN.length;i++) if(eReadsN[i]===intendedN[i])aEN++;
let aNE=0; for(let i=0;i<flatE.length;i++) if(nReadsE[i]===intendedE[i])aNE++;
const lens = {
  EreadsNlines: flatN.length?+((aEN/Math.max(1,flatN.length)).toFixed(4)):0,
  NreadsElines: +((aNE/flatE.length).toFixed(4)),
  EprofileOnN: flatN.length?profile(E,flatN):null,
  NprofileOnE: profile(N,flatE),
  EprofileOnE: profile(E,flatE),
  NprofileOnN: flatN.length?profile(N,flatN):null};
const out = {meta:{target:0.80, gapFiled:"0.90->0.80 (N ceiling ~0.85 per survey)", pool:9810, Nseed:9601},
  Nmeta, gates:Ng, lens,
  best: Object.fromEntries([0,1,2,3].map(c=>[c,(Nbest[c]||[]).slice(0,5).map(b=>({s:b.s, len:b.x.length}))]))};
await fs.writeTextFile("scratch/p3-n-recal.json", JSON.stringify({Nbank, gates:Ng, lens, meta:out.meta}));
await fs.writeTextFile("scratch/p3-n-recal-summary.json", JSON.stringify(out));
return {ok:true, Nbanked:[0,1,2,3].map(c=>Nmeta[c].banked), Ndead:[0,1,2,3].map(c=>Nmeta[c].dead),
  Ngates: Ng.n?{rt:Ng.rtRaw, d:Ng.rtDelta, naive:Ng.naiveObs, ent:Ng.ent, ham:Ng.meanHam}:null, lens};
