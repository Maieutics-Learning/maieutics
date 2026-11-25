// newai-selfu22a-driver.js — U22a scope-parity wide fold head (surgery on U18/U21).
// Frozen: W6 trunk + M2-nb + U17-gated linker L* (teacher) + U5-old head piece.
// Trainable: fresh WIDE head HFW (68->24 silu ->4, ~1.8k). Input order: [h48|read4|hv4|headOld4|carry8].
// Single change vs U21: head scope HF(h) -> HFW(all 5). Same loss weights, steps, diet, hard gate.
globalThis.SelfU22aInit = async function (fs) {
  for (const p of ["src/evidence/decomp/newai-selfu18-driver.js"]) {
    const src = await fs.readTextFile(p); (0, eval)(src + "\n//# sourceURL=" + p);
  }
  await globalThis.SelfU18Init(fs);
  if (!globalThis.runU18Train) throw new Error("u22a stack load failed");
};
function u22aArmCode(arm) { if (arm === "u22a-widefold") return 153; if (arm === "u22a-shuf") return 154; return 153; }
function u22aMakeHead(rng) {
  return { W1: inParam(rng, 24*68, 68), b1: inParam(rng, 24, 24), W2: inParam(rng, 4*24, 24), b2: inParam(rng, 4, 4) };
}
function u22aHeadParams(HF) { return [HF.W1, HF.b1, HF.W2, HF.b2]; }
function u22aHeadForward(HF, x) {
  const pre = new Float64Array(24);
  for (let j=0;j<24;j++){let s=HF.b1.v[j]; for(let i=0;i<68;i++) s+=HF.W1.v[j*68+i]*x[i]; pre[j]=s;}
  const ha = new Float64Array(24);
  for (let j=0;j<24;j++){const sig=1/(1+Math.exp(-pre[j])); ha[j]=pre[j]*sig;}
  const out = new Float64Array(4);
  for (let o=0;o<4;o++){let s=HF.b2.v[o]; for(let j=0;j<24;j++) s+=HF.W2.v[o*24+j]*ha[j]; out[o]=s;}
  return {out, cache:{pre, ha}};
}
function u22aHeadBackward(HF, x, cache, dOut) {
  const {pre, ha} = cache;
  for (let o=0;o<4;o++){
    HF.b2.g[o]+=dOut[o];
    for(let j=0;j<24;j++) HF.W2.g[o*24+j]+=dOut[o]*ha[j];
  }
  const dha = new Float64Array(24);
  for(let j=0;j<24;j++){let s=0; for(let o=0;o<4;o++) s+=HF.W2.v[o*24+j]*dOut[o]; dha[j]=s;}
  for(let j=0;j<24;j++){
    const sig=1/(1+Math.exp(-pre[j]));
    const dpre=dha[j]*(sig+pre[j]*sig*(1-sig));
    HF.b1.g[j]+=dpre;
    for(let i=0;i<68;i++) HF.W1.g[j*68+i]+=dpre*x[i];
  }
}
function u22aWideInput(h, read, hv, headOld, carry) {
  const x = new Float64Array(68);
  x.set(h, 0); x.set(read, 48); x.set(hv, 52); x.set(headOld, 56); x.set(carry, 60);
  return x;
}
globalThis.u22aGradCheck = async function (fs, log) {
  await globalThis.SelfU22aInit(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const HF = u22aMakeHead(G.makeRng(4343));
  const hrng = G.makeRng(7);
  const x = new Float64Array(68); for(let i=0;i<68;i++) x[i]=hrng.uniform(-0.5,0.5);
  const hv=new Float64Array([0.1,-0.2,0.05,0.0]), read=new Float64Array([0.0,0.1,-0.1,0.05]);
  const target=new Float64Array([0.2,-0.1,0.0,0.1]); const v=1; const wStd=1.0;
  const lossFn=()=>{
    const f=u22aHeadForward(HF,x);
    const ens=new Float64Array(4); for(let o=0;o<4;o++) ens[o]=hv[o]+read[o]+f.out[o];
    const ce=inCELossGrad(ens,v);
    let mse=0; for(let o=0;o<4;o++) mse+=wStd*(f.out[o]-target[o])*(f.out[o]-target[o])/4;
    return ce.loss+mse;
  };
  for(const p of u22aHeadParams(HF)) p.g.fill(0);
  const f=u22aHeadForward(HF,x);
  const ens=new Float64Array(4); for(let o=0;o<4;o++) ens[o]=hv[o]+read[o]+f.out[o];
  const ce=inCELossGrad(ens,v);
  const d=new Float64Array(4);
  for(let o=0;o<4;o++) d[o]=ce.d[o]+wStd*(f.out[o]-target[o])/2;
  u22aHeadBackward(HF,x,f.cache,d);
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
  check(HF.W2,"W2");check(HF.b2,"b2");check(HF.W1,"W1");check(HF.b1,"b1");
  log("u22a-gradcheck worstRel="+worst.toExponential(2)+" at "+worstWhere);
  return {worstRel:worst, worstWhere};
};
globalThis.runU22aTrain = async function (fs, log, opts) {
  const {arm, seed}=opts;
  const force=opts&&opts.force;
  const steps=800, B=16, lr=5e-3, K=5, H=48, C=6, wAdapt=0.5, wStd=1.0;
  const tag=arm+"-s"+seed+"-"+steps+"st";
  const ledgerPath="src/evidence/decomp/d-newai-self-"+tag+".json";
  try{const prev=JSON.parse(await fs.readTextFile(ledgerPath)); if(prev&&prev.verdict==="COMPLETE"&&!force){log(ledgerPath+" exists, skip");return prev;}}catch(e){}
  await globalThis.SelfU22aInit(fs);
  const G=await globalThis.IntrinsicInit(fs);
  const M=await loadU1W6(fs,G,seed);
  const MP=await loadU1M2nb(fs,G,seed);
  const HDold=await loadU16U5head(fs,G,seed);
  const LT=await loadU17Teacher(fs,G,seed);
  const HF=u22aMakeHead(G.makeRng(78000+seed*7919+u22aArmCode(arm)*131));
  const hParams=u22aHeadParams(HF);
  const opt=new G.Adam(lr);
  const dataRng=G.makeRng(42200+seed*104729+77);
  let fixedMasks=null;{const fr=G.makeRng(91000+seed);fixedMasks=[];for(let k=0;k<K;k++){const m=new Float64Array(H);for(let i=0;i<H;i++)m[i]=fr.int(10)<5?2:0;fixedMasks.push(m);}}
  const M0snap=inSeqParams(M).map(p=>Float64Array.from(p.v));
  const isShuf=(arm==="u22a-shuf");
  const t0=Date.now(), curve=[];
  for(let step=0;step<steps;step++){
    for(const p of hParams) p.g.fill(0);
    const batch=[];
    for(let b=0;b<B;b++){
      const isAdapt=dataRng.int(2)===1;
      let e, sup;
      if(!isAdapt){
        const cands=[];
        for(let c=0;c<C;c++){const ub=dataRng.int(2)===0; cands.push(ub?inSeqGenShift(dataRng,0):inSeqGenShift(dataRng,null));}
        let pk=0,best=-1;
        for(let c=0;c<C;c++){const fw=inSeqForward(M,cands[c].x,new Float64Array(8),fixedMasks); const d=curVoteDisagree(fw.logitsK); if(d>best){best=d;pk=c;}}
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
      batch.push({e,isAdapt,h,read,hv,headOld,carry,x:u22aWideInput(h,read,hv,headOld,carry)});
    }
    let lsum=0;
    for(let b=0;b<B;b++){
      const row=batch[b];
      const tSrc=isShuf?batch[(b+1)%B]:row;
      const tf=u16LinkerForward(LT,tSrc.h,tSrc.read,tSrc.hv,tSrc.headOld,tSrc.carry);
      const w=row.isAdapt?wAdapt:wStd;
      const target=row.isAdapt?tf.out:new Float64Array(4);
      const tx=isShuf?u22aWideInput(tSrc.h,tSrc.read,tSrc.hv,tSrc.headOld,tSrc.carry):row.x;
      const sf=u22aHeadForward(HF,tx);
      const ens=new Float64Array(4); for(let o=0;o<4;o++) ens[o]=row.hv[o]+row.read[o]+sf.out[o];
      const ce=inCELossGrad(ens,row.e.v); lsum+=ce.loss;
      let mse=0; for(let o=0;o<4;o++){const d=sf.out[o]-target[o]; mse+=w*d*d/4;}
      lsum+=mse;
      const d=new Float64Array(4);
      for(let o=0;o<4;o++) d[o]=ce.d[o]/B+w*(sf.out[o]-target[o])/2/B;
      u22aHeadBackward(HF,tx,sf.cache,d);
    }
    let s=0; for(const p of hParams) for(let i=0;i<p.g.length;i++) s+=p.g[i]*p.g[i];
    const n=Math.sqrt(s); if(n>1.0){const sc=1.0/n; for(const p of hParams) for(let i=0;i<p.g.length;i++) p.g[i]*=sc;}
    opt.step(hParams);
    if(step%100===0||step===steps-1) curve.push({step,loss:+(lsum/B).toFixed(6)});
  }
  const M1p=inSeqParams(M); let maxDrift=0;
  for(let pi=0;pi<M1p.length;pi++) for(let i=0;i<M1p[pi].v.length;i++){const d=Math.abs(M1p[pi].v[i]-M0snap[pi][i]); if(d>maxDrift)maxDrift=d;}
  const save=o=>Array.from(o.v);
  const body={spec:"self-u22a-scopeparity-prereg",track:"U22a",arm,seed,steps,B,lr,wAdapt,wStd,gatedEval:true,teacher:"u17-gated-s"+seed,frozenAll:true,maxFrozenDrift:maxDrift,verdict:"COMPLETE",wallMs:Date.now()-t0,curve,
    P:{W1:save(HF.W1),b1:save(HF.b1),W2:save(HF.W2),b2:save(HF.b2)},
    paramCounts:{HF:(24*68+24+4*24+4), U21HF:(24*48+24+4*24+4)}};
  await fs.writeTextFile(ledgerPath,JSON.stringify(body));
  log("u22a-train "+tag+" loss0="+curve[0].loss+" lossN="+curve[curve.length-1].loss+" frozenDrift="+maxDrift);
  return body;
};
globalThis.runU22aEval = async function (fs, log, opts) {
  const {arm, seed}=opts;
  const steps=800, N=200;
  const tag=arm+"-s"+seed+"-"+steps+"st";
  const ledgerPath="src/evidence/decomp/d-newai-self-eval-"+tag+".json";
  const force=opts&&opts.force;
  try{const prev=JSON.parse(await fs.readTextFile(ledgerPath)); if(prev&&prev.verdict==="COMPLETE"&&!force){log(ledgerPath+" exists, skip");return prev;}}catch(e){}
  await globalThis.SelfU22aInit(fs);
  const G=await globalThis.IntrinsicInit(fs);
  const M=await loadU1W6(fs,G,seed);
  const MP=await loadU1M2nb(fs,G,seed);
  const tr=JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-"+tag+".json"));
  const HF=u22aMakeHead(G.makeRng(1));
  const load=(dst,src)=>{for(let i=0;i<dst.v.length;i++)dst.v[i]=src[i];};
  load(HF.W1,tr.P.W1);load(HF.b1,tr.P.b1);load(HF.W2,tr.P.W2);load(HF.b2,tr.P.b2);
  let evalMasks=null;{const fr2=G.makeRng(91000+seed);evalMasks=[];for(let kk=0;kk<5;kk++){const m=new Float64Array(48);for(let i=0;i<48;i++)m[i]=fr2.int(10)<5?2:0;evalMasks.push(m);}}
  const argmax4=a=>{let b=0;for(let i=1;i<4;i++)if(a[i]>a[b])b=i;return b;};
  const srng=G.makeRng(52500+seed), supRng=G.makeRng(42000+seed*104729+999);
  let scr=0,two=0, hfStdAbs=0;
  for(let i=0;i<N;i++){
    const e=inSeqGenShift(srng,null);
    const supE=[inSeqGenShift(supRng,null),inSeqGenShift(supRng,null),inSeqGenShift(supRng,null),inSeqGenShift(supRng,null)];
    const sup=supE.map(se=>({qkId:se.qk,vId:4+se.v,forceZero:false}));
    const fw1=inSeqForward(M,e.x,new Float64Array(8),evalMasks);
    const Eqk=new Float64Array(12);for(let d=0;d<12;d++)Eqk[d]=M.E.v[e.qk*12+d];
    const fr=m2ReadForward(M,MP,Eqk,sup);
    const HDold=await loadU16U5head(fs,G,seed);
    const headOld=u16U5HeadOut(HDold,fw1.h);
    const x=u22aWideInput(Float64Array.from(fw1.h),Float64Array.from(fr.readLogits),Float64Array.from(fw1.hvLog),headOld,Float64Array.from(fw1.cNew));
    const hfRep=u22aHeadForward(HF,x).out;
    for(let o=0;o<4;o++) hfStdAbs+=Math.abs(hfRep[o]);
    const ens=new Float64Array(4);for(let o=0;o<4;o++)ens[o]=fw1.hvLog[o]+fr.readLogits[o];
    if(argmax4(ens)===e.v)scr++;
    const vhat=argmax4(ens);
    const x2m=[9,9,9,9,9,9,e.qk,e.k,vhat,8];
    const fw2=inSeqForward(M,x2m,fw1.cNew,evalMasks);
    if(argmax4(inMeanLogits({logitsK:fw2.logitsK}))===e.y)two++;
  }
  const arng=G.makeRng(61000+seed);
  let adaptY=0,adaptV=0,adaptYabl=0,hfAdaptAbs=0;
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
    const hf=u22aHeadForward(HF,u22aWideInput(h,read,hv,headOld,carry)).out;
    for(let o=0;o<4;o++) hfAdaptAbs+=Math.abs(hf[o]);
    const ens=new Float64Array(4);for(let o=0;o<4;o++)ens[o]=hv[o]+read[o]+hf[o];
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
  const body={spec:"self-u22a-scopeparity-prereg",track:"U22a",arm,seed,steps,verdict:"COMPLETE",n:N,gatedEval:true,
    accScratch:+(scr/N).toFixed(4),accTwo:+(two/N).toFixed(4),adaptY:+(adaptY/N).toFixed(4),adaptV:+(adaptV/N).toFixed(4),
    adaptYablated:+(adaptYabl/N).toFixed(4),ablateDrop:+((adaptY-adaptYabl)/N).toFixed(4),
    meanHfAbsStd:+(hfStdAbs/(N*4)).toFixed(4),meanHfAbsAdapt:+(hfAdaptAbs/(N*4)).toFixed(4),frozenDriftTrain:tr.maxFrozenDrift};
  await fs.writeTextFile(ledgerPath,JSON.stringify(body));
  log("u22a-eval "+tag+" adaptY="+body.adaptY+" adaptV="+body.adaptV+" two="+body.accTwo+" ablDrop="+body.ablateDrop+" hfS="+body.meanHfAbsStd);
  return body;
};
