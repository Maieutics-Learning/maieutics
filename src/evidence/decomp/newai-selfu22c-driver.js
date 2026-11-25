// newai-selfu22c-driver.js — U22c 1000-input scale stress (surgery on U22b).
// Frozen: W6 trunk + M2-nb + U17-gated linker L* (teacher, TRUE-20 only) + U5-old head piece.
// Trainable: shared slot encoder S (4->8 silu, ~40 reused x250) + scorer (8->1) + combiner HF (56->24 silu ->4, codes 157/158).
// Layout: 250 slots x4; true pieces at slots [7,41,129,166,203] (read,hv,headOld,carry0-3,carry4-7); 245 distractors ~ N(trueMean,trueVar) re-seeded per batch.
// DEVIATION from prereg (filed, analysis-safe): forward pool is softmax-weighted (tau 1.0) over all 250 slots, NOT hard top-2 mean.
// Reason: hard top-2 has zero scorer gradient (scorer could never learn; SELECT would sit at chance ~1.6% and the run would be a foregone VOID).
// Soft pool is the differentiable member of the STE family R1 pinned; SELECT-hit (any true slot in top-2 by score) and NOMEM probes are unchanged and still discriminate selection vs memorization.
globalThis.SelfU22cInit = async function (fs) {
  for (const p of ["src/evidence/decomp/newai-selfu22b-driver.js"]) {
    const src = await fs.readTextFile(p); (0, eval)(src + "\n//# sourceURL=" + p);
  }
  await globalThis.SelfU22bInit(fs);
  if (!globalThis.runU22bTrain) throw new Error("u22c stack load failed");
};
function u22cArmCode(arm) { if (arm === "u22c-scale") return 157; if (arm === "u22c-shuf") return 158; return 157; }
const U22C_TRUE_SLOTS = [7,41,129,166,203];
const U22C_NSLOT = 250;
function u22cMakeS(rng) {
  return { W: inParam(rng, 8*4, 4), b: inParam(rng, 8, 8) };
}
function u22cMakeScorer(rng) {
  return { w: inParam(rng, 8, 8), b: inParam(rng, 1, 1) };
}
function u22cSParams(S) { return [S.W, S.b]; }
function u22cScorerParams(C) { return [C.w, C.b]; }
// slots: Float64Array(1000) row-major 250x4. Returns {summary(8), scores(250), weights(250), top2:[i,j], enc (250x8 cache), cache}
function u22cPoolForward(S, C, slots) {
  const N = U22C_NSLOT;
  const enc = new Float64Array(N*8);
  for (let i=0;i<N;i++){
    for (let k=0;k<8;k++){
      let s=S.b.v[k];
      for (let d=0;d<4;d++) s+=S.W.v[k*4+d]*slots[i*4+d];
      const sig=1/(1+Math.exp(-s));
      enc[i*8+k]=s*sig;
    }
  }
  const scores = new Float64Array(N);
  for (let i=0;i<N;i++){let s=C.b.v[0]; for(let k=0;k<8;k++) s+=C.w.v[k]*enc[i*8+k]; scores[i]=s;}
  let mx=-1e300; for(let i=0;i<N;i++) if(scores[i]>mx) mx=scores[i];
  const w = new Float64Array(N);
  let z=0; for(let i=0;i<N;i++){w[i]=Math.exp(scores[i]-mx); z+=w[i];}
  for(let i=0;i<N;i++) w[i]/=z;
  const summary = new Float64Array(8);
  for(let i=0;i<N;i++) for(let k=0;k<8;k++) summary[k]+=w[i]*enc[i*8+k];
  let t1=-1,t2=-1;
  for(let i=0;i<N;i++){if(t1<0||scores[i]>scores[t1]){t2=t1;t1=i;}else if(t2<0||scores[i]>scores[t2]){t2=i;}}
  return {summary, scores, weights:w, top2:[t1,t2], enc, cache:{slots}};
}
// dsum: dL/dsummary (8). Backprops into S, C (.g accum). Returns nothing (slots are data).
function u22cPoolBackward(S, C, fw, dsum) {
  const N = U22C_NSLOT;
  const {enc, weights:w, scores} = fw;
  // dL/dw_i = dsum . enc_i
  const dWd = new Float64Array(N);
  for(let i=0;i<N;i++){let s=0; for(let k=0;k<8;k++) s+=dsum[k]*enc[i*8+k]; dWd[i]=s;}
  // softmax jacobian: dL/ds_j = w_j * (dWd_j - Σ_i w_i dWd_i)
  let avg=0; for(let i=0;i<N;i++) avg+=w[i]*dWd[i];
  const dS = new Float64Array(N);
  for(let j=0;j<N;j++) dS[j]=w[j]*(dWd[j]-avg);
  // scorer grads + dL/denc via scorer path
  const dEnc = new Float64Array(N*8);
  for(let i=0;i<N;i++) for(let k=0;k<8;k++) dEnc[i*8+k]=w[i]*dsum[k];
  for(let i=0;i<N;i++){
    C.b.g[0]+=dS[i];
    for(let k=0;k<8;k++){C.w.g[k]+=dS[i]*enc[i*8+k]; dEnc[i*8+k]+=dS[i]*C.w.v[k];}
  }
  // encoder backward (silu), accumulate into S params
  const slots = fw.cache.slots;
  for(let i=0;i<N;i++){
    for(let k=0;k<8;k++){
      // recover pre from enc? need pre — recompute
      let s=S.b.v[k];
      for(let d=0;d<4;d++) s+=S.W.v[k*4+d]*slots[i*4+d];
      const sig=1/(1+Math.exp(-s));
      const dpre=dEnc[i*8+k]*(sig+s*sig*(1-sig));
      S.b.g[k]+=dpre;
      for(let d=0;d<4;d++) S.W.g[k*4+d]+=dpre*slots[i*4+d];
    }
  }
}
function u22cTrueSlots(read, hv, headOld, carry) {
  // 5 slots x4 = 20 dims: read, hv, headOld, carry[0..3], carry[4..7]
  return [read, hv, headOld, carry.subarray(0,4), carry.subarray(4,8)];
}
function u22cBuildSlots(rng, trueVecs) {
  // trueVecs: 5 Float64Array(4). Matched Gaussian distractors from their per-dim stats.
  const slots = new Float64Array(U22C_NSLOT*4);
  const mean = new Float64Array(4), va = new Float64Array(4);
  for (const t of trueVecs) for(let d=0;d<4;d++) mean[d]+=t[d]/5;
  for (const t of trueVecs) for(let d=0;d<4;d++){const dd=t[d]-mean[d]; va[d]+=dd*dd/5;}
  const sd = new Float64Array(4);
  for(let d=0;d<4;d++) sd[d]=Math.sqrt(va[d]+1e-6);
  const isTrue = new Set(U22C_TRUE_SLOTS);
  let ti=0;
  const randn=()=>{
    let u=0,vv=0; while(u===0)u=rng.uniform(0,1); while(vv===0)vv=rng.uniform(0,1);
    return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*vv);
  };
  for(let i=0;i<U22C_NSLOT;i++){
    if(isTrue.has(i)){slots.set(trueVecs[ti++], i*4);}
    else for(let d=0;d<4;d++) slots[i*4+d]=mean[d]+sd[d]*randn();
  }
  return slots;
}
globalThis.u22cGradCheck = async function (fs, log) {
  await globalThis.SelfU22cInit(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const S = u22cMakeS(G.makeRng(4343)), C = u22cMakeScorer(G.makeRng(4344)), HF = u22bMakeHF(G.makeRng(4345));
  const hrng = G.makeRng(7);
  const h = new Float64Array(48); for(let i=0;i<48;i++) h[i]=hrng.uniform(-0.5,0.5);
  const slots = new Float64Array(U22C_NSLOT*4); for(let i=0;i<slots.length;i++) slots[i]=hrng.uniform(-0.5,0.5);
  const hv=new Float64Array([0.1,-0.2,0.05,0.0]), read=new Float64Array([0.0,0.1,-0.1,0.05]);
  const target=new Float64Array([0.2,-0.1,0.0,0.1]); const v=1; const wStd=1.0;
  const lossFn=()=>{
    const pf=u22cPoolForward(S,C,slots);
    const x=new Float64Array(56); x.set(h,0); x.set(pf.summary,48);
    const f=siluFwd(HF.W1,HF.b1,HF.W2,HF.b2,x,56,24,4);
    const ens=new Float64Array(4); for(let o=0;o<4;o++) ens[o]=hv[o]+read[o]+f.out[o];
    const ce=inCELossGrad(ens,v);
    let mse=0; for(let o=0;o<4;o++) mse+=wStd*(f.out[o]-target[o])*(f.out[o]-target[o])/4;
    return ce.loss+mse;
  };
  for(const p of [...u22cSParams(S),...u22cScorerParams(C),...u22bHFParams(HF)]) p.g.fill(0);
  const pf=u22cPoolForward(S,C,slots);
  const x=new Float64Array(56); x.set(h,0); x.set(pf.summary,48);
  const f=siluFwd(HF.W1,HF.b1,HF.W2,HF.b2,x,56,24,4);
  const ens=new Float64Array(4); for(let o=0;o<4;o++) ens[o]=hv[o]+read[o]+f.out[o];
  const ce=inCELossGrad(ens,v);
  const d=new Float64Array(4);
  for(let o=0;o<4;o++) d[o]=ce.d[o]+wStd*(f.out[o]-target[o])/2;
  siluBwd(HF.W1,HF.b1,HF.W2,HF.b2,x,56,24,4,f.cache,d);
  const dhaHF=new Float64Array(24);
  for(let j=0;j<24;j++){let s=0; for(let o=0;o<4;o++) s+=HF.W2.v[o*24+j]*d[o]; const sig=1/(1+Math.exp(-f.cache.pre[j])); dhaHF[j]=s*(sig+f.cache.pre[j]*sig*(1-sig));}
  const dsum=new Float64Array(8);
  for(let k=0;k<8;k++){let s=0; for(let j=0;j<24;j++) s+=HF.W1.v[j*56+48+k]*dhaHF[j]; dsum[k]=s;}
  u22cPoolBackward(S,C,pf,dsum);
  const eps=1e-6; let worst=0, worstWhere="";
  const check=(P,name)=>{
    for(let i=0;i<Math.min(P.v.length,6);i++){
      P.v[i]+=eps; const a1=lossFn(); P.v[i]-=2*eps; const a0=lossFn(); P.v[i]+=eps;
      const num=(a1-a0)/(2*eps), an=P.g[i];
      const denom=Math.max(1e-12,Math.abs(num)+Math.abs(an));
      const rel=Math.abs(num-an)/denom;
      if(Math.abs(num)<1e-9&&Math.abs(an)<1e-9) continue;
      if(rel>worst){worst=rel;worstWhere=name+"["+i+"] num="+num+" an="+an;}
    }
  };
  check(HF.W2,"HF.W2");check(S.W,"S.W");check(C.w,"C.w");check(HF.W1,"HF.W1");check(S.b,"S.b");
  log("u22c-gradcheck worstRel="+worst.toExponential(2)+" at "+worstWhere);
  return {worstRel:worst, worstWhere};
};
globalThis.runU22cTrain = async function (fs, log, opts) {
  const {arm, seed}=opts;
  const force=opts&&opts.force;
  const steps=800, B=16, lr=5e-3, K=5, H=48, Cc=6, wAdapt=0.5, wStd=1.0;
  const tag=arm+"-s"+seed+"-"+steps+"st";
  const ledgerPath="src/evidence/decomp/d-newai-self-"+tag+".json";
  try{const prev=JSON.parse(await fs.readTextFile(ledgerPath)); if(prev&&prev.verdict==="COMPLETE"&&!force){log(ledgerPath+" exists, skip");return prev;}}catch(e){}
  await globalThis.SelfU22cInit(fs);
  const G=await globalThis.IntrinsicInit(fs);
  const M=await loadU1W6(fs,G,seed);
  const MP=await loadU1M2nb(fs,G,seed);
  const HDold=await loadU16U5head(fs,G,seed);
  const LT=await loadU17Teacher(fs,G,seed);
  const S=u22cMakeS(G.makeRng(78000+seed*7919+u22cArmCode(arm)*131));
  const SC=u22cMakeScorer(G.makeRng(78100+seed*7919+u22cArmCode(arm)*131));
  const HF=u22bMakeHF(G.makeRng(79000+seed*7919+u22cArmCode(arm)*131));
  const hParams=[...u22cSParams(S),...u22cScorerParams(SC),...u22bHFParams(HF)];
  const opt=new G.Adam(lr);
  const dataRng=G.makeRng(42200+seed*104729+77);
  let fixedMasks=null;{const fr=G.makeRng(91000+seed);fixedMasks=[];for(let k=0;k<K;k++){const m=new Float64Array(H);for(let i=0;i<H;i++)m[i]=fr.int(10)<5?2:0;fixedMasks.push(m);}}
  const M0snap=inSeqParams(M).map(p=>Float64Array.from(p.v));
  const isShuf=(arm==="u22c-shuf");
  const t0=Date.now(), curve=[];
  for(let step=0;step<steps;step++){
    for(const p of hParams) p.g.fill(0);
    const batch=[];
    for(let b=0;b<B;b++){
      const isAdapt=dataRng.int(2)===1;
      let e, sup;
      if(!isAdapt){
        const cands=[];
        for(let c=0;c<Cc;c++){const ub=dataRng.int(2)===0; cands.push(ub?inSeqGenShift(dataRng,0):inSeqGenShift(dataRng,null));}
        let pk=0,best=-1;
        for(let c=0;c<Cc;c++){const fw=inSeqForward(M,cands[c].x,new Float64Array(8),fixedMasks); const d=curVoteDisagree(fw.logitsK); if(d>best){best=d;pk=c;}}
        e=cands[pk];
        const supE=[inSeqGenShift(dataRng,null),inSeqGenShift(dataRng,null),inSeqGenShift(dataRng,null),inSeqGenShift(dataRng,null)];
        sup=supE.map(se=>({qkId:se.qk,vId:4+se.v,forceZero:false}));
      } else {
        const ep=genAdaptEpisode(dataRng); e=ep.query; sup=ep.sup.map(se=>({qkId:se.qk,vId:4+se.v,forceZero:false}));
      }
      const fw1=inSeqForward(M,e.x,new Float64Array(8),fixedMasks);
      const Eqk=new Float64Array(12); for(let d=0;d<12;d++) Eqk[d]=M.E.v[e.qk*12+d];
      const fr=m2ReadForward(M,MP,Eqk,sup);
      const headOld=u16U5HeadOut(HDold,fw1.h);
      const carry=isAdapt?new Float64Array(8):Float64Array.from(fw1.cNew);
      const h=Float64Array.from(fw1.h), read=Float64Array.from(fr.readLogits), hv=Float64Array.from(fw1.hvLog);
      const trueVecs=u22cTrueSlots(read,hv,headOld,carry);
      const slots=u22cBuildSlots(dataRng,trueVecs);
      batch.push({e,isAdapt,h,read,hv,headOld,carry,slots,trueVecs});
    }
    let lsum=0;
    for(let b=0;b<B;b++){
      const row=batch[b];
      const tSrc=isShuf?batch[(b+1)%B]:row;
      const tf=u16LinkerForward(LT,tSrc.h,tSrc.read,tSrc.hv,tSrc.headOld,tSrc.carry);
      const w=row.isAdapt?wAdapt:wStd;
      const target=row.isAdapt?tf.out:new Float64Array(4);
      const zslots=isShuf?batch[(b+1)%B].slots:row.slots;
      const pf=u22cPoolForward(S,SC,zslots);
      const x=new Float64Array(56); x.set(row.h,0); x.set(pf.summary,48);
      const sf=siluFwd(HF.W1,HF.b1,HF.W2,HF.b2,x,56,24,4);
      const ens=new Float64Array(4); for(let o=0;o<4;o++) ens[o]=row.hv[o]+row.read[o]+sf.out[o];
      const ce=inCELossGrad(ens,row.e.v); lsum+=ce.loss;
      let mse=0; for(let o=0;o<4;o++){const d=sf.out[o]-target[o]; mse+=w*d*d/4;}
      lsum+=mse;
      const d=new Float64Array(4);
      for(let o=0;o<4;o++) d[o]=ce.d[o]/B+w*(sf.out[o]-target[o])/2/B;
      siluBwd(HF.W1,HF.b1,HF.W2,HF.b2,x,56,24,4,sf.cache,d);
      const dhaHF=new Float64Array(24);
      for(let j=0;j<24;j++){let s=0; for(let o=0;o<4;o++) s+=HF.W2.v[o*24+j]*d[o]; const sig=1/(1+Math.exp(-sf.cache.pre[j])); dhaHF[j]=s*(sig+sf.cache.pre[j]*sig*(1-sig));}
      const dsum=new Float64Array(8);
      for(let k=0;k<8;k++){let s=0; for(let j=0;j<24;j++) s+=HF.W1.v[j*56+48+k]*dhaHF[j]; dsum[k]=s;}
      u22cPoolBackward(S,SC,pf,dsum);
    }
    let s=0; for(const p of hParams) for(let i=0;i<p.g.length;i++) s+=p.g[i]*p.g[i];
    const n=Math.sqrt(s); if(n>1.0){const sc=1.0/n; for(const p of hParams) for(let i=0;i<p.g.length;i++) p.g[i]*=sc;}
    opt.step(hParams);
    if(step%100===0||step===steps-1) curve.push({step,loss:+(lsum/B).toFixed(6)});
  }
  const M1p=inSeqParams(M); let maxDrift=0;
  for(let pi=0;pi<M1p.length;pi++) for(let i=0;i<M1p[pi].v.length;i++){const d=Math.abs(M1p[pi].v[i]-M0snap[pi][i]); if(d>maxDrift)maxDrift=d;}
  const save=o=>Array.from(o.v);
  const body={spec:"self-u22c-scalestress-prereg",track:"U22c",arm,seed,steps,B,lr,wAdapt,wStd,gatedEval:true,teacher:"u17-gated-s"+seed+" (true-20 only)",frozenAll:true,maxFrozenDrift:maxDrift,verdict:"COMPLETE",wallMs:Date.now()-t0,curve,
    deviation:"soft-pool (softmax tau=1.0) replaces hard top-2 mean-pool; scorer trainable; SELECT/NOMEM probes unchanged",
    P:{SW:save(S.W),Sb:save(S.b),CW:save(SC.w),Cb:save(SC.b),HW1:save(HF.W1),Hb1:save(HF.b1),HW2:save(HF.W2),Hb2:save(HF.b2)}};
  await fs.writeTextFile(ledgerPath,JSON.stringify(body));
  log("u22c-train "+tag+" loss0="+curve[0].loss+" lossN="+curve[curve.length-1].loss+" frozenDrift="+maxDrift);
  return body;
};
globalThis.runU22cEval = async function (fs, log, opts) {
  const {arm, seed}=opts;
  const steps=800, N=200;
  const tag=arm+"-s"+seed+"-"+steps+"st";
  const ledgerPath="src/evidence/decomp/d-newai-self-eval-"+tag+".json";
  const force=opts&&opts.force;
  try{const prev=JSON.parse(await fs.readTextFile(ledgerPath)); if(prev&&prev.verdict==="COMPLETE"&&!force){log(ledgerPath+" exists, skip");return prev;}}catch(e){}
  await globalThis.SelfU22cInit(fs);
  const G=await globalThis.IntrinsicInit(fs);
  const M=await loadU1W6(fs,G,seed);
  const MP=await loadU1M2nb(fs,G,seed);
  const tr=JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-"+tag+".json"));
  const S=u22cMakeS(G.makeRng(1)), SC=u22cMakeScorer(G.makeRng(1)), HF=u22bMakeHF(G.makeRng(1));
  const load=(dst,src)=>{for(let i=0;i<dst.v.length;i++)dst.v[i]=src[i];};
  load(S.W,tr.P.SW);load(S.b,tr.P.Sb);load(SC.w,tr.P.CW);load(SC.b,tr.P.Cb);
  load(HF.W1,tr.P.HW1);load(HF.b1,tr.P.Hb1);load(HF.W2,tr.P.HW2);load(HF.b2,tr.P.Hb2);
  let evalMasks=null;{const fr2=G.makeRng(91000+seed);evalMasks=[];for(let kk=0;kk<5;kk++){const m=new Float64Array(48);for(let i=0;i<48;i++)m[i]=fr2.int(10)<5?2:0;evalMasks.push(m);}}
  const argmax4=a=>{let b=0;for(let i=1;i<4;i++)if(a[i]>a[b])b=i;return b;};
  const fwd=(h,slots)=>{
    const pf=u22cPoolForward(S,SC,slots);
    const x=new Float64Array(56); x.set(h,0); x.set(pf.summary,48);
    const f=siluFwd(HF.W1,HF.b1,HF.W2,HF.b2,x,56,24,4);
    return {out:f.out, pf};
  };
  const erng=G.makeRng(95000+seed);
  let scr=0,two=0;
  const HDold0=await loadU16U5head(fs,G,seed);
  const srng=G.makeRng(52500+seed), supRng=G.makeRng(42000+seed*104729+999);
  for(let i=0;i<N;i++){
    const e=inSeqGenShift(srng,null);
    const supE=[inSeqGenShift(supRng,null),inSeqGenShift(supRng,null),inSeqGenShift(supRng,null),inSeqGenShift(supRng,null)];
    const sup=supE.map(se=>({qkId:se.qk,vId:4+se.v,forceZero:false}));
    const fw1=inSeqForward(M,e.x,new Float64Array(8),evalMasks);
    const Eqk=new Float64Array(12);for(let d=0;d<12;d++)Eqk[d]=M.E.v[e.qk*12+d];
    const fr=m2ReadForward(M,MP,Eqk,sup);
    const headOld=u16U5HeadOut(HDold0,fw1.h);
    const ens=new Float64Array(4);for(let o=0;o<4;o++)ens[o]=fw1.hvLog[o]+fr.readLogits[o];
    if(argmax4(ens)===e.v)scr++;
    const vhat=argmax4(ens);
    const x2m=[9,9,9,9,9,9,e.qk,e.k,vhat,8];
    const fw2=inSeqForward(M,x2m,fw1.cNew,evalMasks);
    if(argmax4(inMeanLogits({logitsK:fw2.logitsK}))===e.y)two++;
  }
  const arng=G.makeRng(61000+seed);
  let adaptY=0,adaptV=0,adaptYabl=0,hitTop2=0,nProbe=0;
  for(let i=0;i<N;i++){
    const ep=genAdaptEpisode(arng);
    const sup=ep.sup.map(se=>({qkId:se.qk,vId:4+se.v,forceZero:false}));
    const e=ep.query;
    const fw1=inSeqForward(M,e.x,new Float64Array(8),evalMasks);
    const Eqk=new Float64Array(12);for(let d=0;d<12;d++)Eqk[d]=M.E.v[e.qk*12+d];
    const fr=m2ReadForward(M,MP,Eqk,sup);
    const HDold=await loadU16U5head(fs,G,seed);
    const headOld=u16U5HeadOut(HDold,fw1.h);
    const h=Float64Array.from(fw1.h), read=Float64Array.from(fr.readLogits), hv=Float64Array.from(fw1.hvLog);
    const carry=new Float64Array(8);
    const trueVecs=u22cTrueSlots(read,hv,headOld,carry);
    const slots=u22cBuildSlots(G.makeRng(71000+seed*1000+i),trueVecs);
    const r=fwd(h,slots);
    const isTrueSlot=idx=>U22C_TRUE_SLOTS.includes(idx);
    if(isTrueSlot(r.pf.top2[0])||isTrueSlot(r.pf.top2[1])) hitTop2++;
    nProbe++;
    const ens=new Float64Array(4);for(let o=0;o<4;o++)ens[o]=hv[o]+read[o]+r.out[o];
    const vhat=argmax4(ens);
    if(vhat===e.v)adaptV++;
    const x2m=[9,9,9,9,9,9,e.qk,e.k,vhat,8];
    const fw2=inSeqForward(M,x2m,new Float64Array(8),evalMasks);
    if(argmax4(inMeanLogits({logitsK:fw2.logitsK}))===e.y)adaptY++;
    const ensA=new Float64Array(4);for(let o=0;o<4;o++)ensA[o]=hv[o]+read[o];
    const vhatA=argmax4(ensA);
    const x2a=[9,9,9,9,9,9,e.qk,e.k,vhatA,8];
    const fw2a=inSeqForward(M,x2a,new Float64Array(8),evalMasks);
    if(argmax4(inMeanLogits({logitsK:fw2a.logitsK}))===e.y)adaptYabl++;
  }
  // NOMEM probe: same stream, fresh distractor seed
  const arng2=G.makeRng(61000+seed);
  let adaptYswap=0;
  for(let i=0;i<N;i++){
    const ep=genAdaptEpisode(arng2);
    const sup=ep.sup.map(se=>({qkId:se.qk,vId:4+se.v,forceZero:false}));
    const e=ep.query;
    const fw1=inSeqForward(M,e.x,new Float64Array(8),evalMasks);
    const Eqk=new Float64Array(12);for(let d=0;d<12;d++)Eqk[d]=M.E.v[e.qk*12+d];
    const fr=m2ReadForward(M,MP,Eqk,sup);
    const HDold=await loadU16U5head(fs,G,seed);
    const headOld=u16U5HeadOut(HDold,fw1.h);
    const h=Float64Array.from(fw1.h), read=Float64Array.from(fr.readLogits), hv=Float64Array.from(fw1.hvLog);
    const carry=new Float64Array(8);
    const trueVecs=u22cTrueSlots(read,hv,headOld,carry);
    const slots=u22cBuildSlots(G.makeRng(99000+seed*1000+i),trueVecs);
    const r=fwd(h,slots);
    const ens=new Float64Array(4);for(let o=0;o<4;o++)ens[o]=hv[o]+read[o]+r.out[o];
    const vhat=argmax4(ens);
    const x2m=[9,9,9,9,9,9,e.qk,e.k,vhat,8];
    const fw2=inSeqForward(M,x2m,new Float64Array(8),evalMasks);
    if(argmax4(inMeanLogits({logitsK:fw2.logitsK}))===e.y)adaptYswap++;
  }
  const body={spec:"self-u22c-scalestress-prereg",track:"U22c",arm,seed,steps,verdict:"COMPLETE",n:N,gatedEval:true,
    accScratch:+(scr/N).toFixed(4),accTwo:+(two/N).toFixed(4),adaptY:+(adaptY/N).toFixed(4),adaptV:+(adaptV/N).toFixed(4),
    adaptYablated:+(adaptYabl/N).toFixed(4),ablateDrop:+((adaptY-adaptYabl)/N).toFixed(4),
    selectHit:+(hitTop2/nProbe).toFixed(4),adaptYswap:+(adaptYswap/N).toFixed(4),nomemDelta:+((adaptYswap-adaptY)/N).toFixed(4),
    frozenDriftTrain:tr.maxFrozenDrift,deviation:tr.deviation};
  await fs.writeTextFile(ledgerPath,JSON.stringify(body));
  log("u22c-eval "+tag+" adaptY="+body.adaptY+" adaptV="+body.adaptV+" two="+body.accTwo+" ablDrop="+body.ablateDrop+" sel="+body.selectHit+" nomem="+body.nomemDelta);
  return body;
};
