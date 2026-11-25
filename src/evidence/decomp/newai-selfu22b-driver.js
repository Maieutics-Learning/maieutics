// newai-selfu22b-driver.js — U22b bottleneck-funnel parity (surgery on U22a/U18).
// Frozen: W6 trunk + M2-nb + U17-gated linker L* (teacher) + U5-old head piece.
// Trainable: bottleneck E (20->16 silu ->8) + combiner HF (56->24 silu ->4), ~2k.
// Non-h order: [read4|hv4|headOld4|carry8] = 20 -> E -> summary8; combiner [h48|summary8].
globalThis.SelfU22bInit = async function (fs) {
  for (const p of ["src/evidence/decomp/newai-selfu22a-driver.js"]) {
    const src = await fs.readTextFile(p); (0, eval)(src + "\n//# sourceURL=" + p);
  }
  await globalThis.SelfU22aInit(fs);
  if (!globalThis.runU22aTrain) throw new Error("u22b stack load failed");
};
function u22bArmCode(arm) { if (arm === "u22b-funnel") return 155; if (arm === "u22b-shuf") return 156; return 155; }
function u22bMakeE(rng) {
  return { W1: inParam(rng, 16*20, 20), b1: inParam(rng, 16, 16), W2: inParam(rng, 8*16, 16), b2: inParam(rng, 8, 8) };
}
function u22bMakeHF(rng) {
  return { W1: inParam(rng, 24*56, 56), b1: inParam(rng, 24, 24), W2: inParam(rng, 4*24, 24), b2: inParam(rng, 4, 4) };
}
function u22bEParams(E) { return [E.W1, E.b1, E.W2, E.b2]; }
function u22bHFParams(HF) { return [HF.W1, HF.b1, HF.W2, HF.b2]; }
function siluFwd(W1,b1,W2,b2,x,D,H,O) {
  const pre = new Float64Array(H);
  for (let j=0;j<H;j++){let s=b1.v[j]; for(let i=0;i<D;i++) s+=W1.v[j*D+i]*x[i]; pre[j]=s;}
  const ha = new Float64Array(H);
  for (let j=0;j<H;j++){const sig=1/(1+Math.exp(-pre[j])); ha[j]=pre[j]*sig;}
  const out = new Float64Array(O);
  for (let o=0;o<O;o++){let s=b2.v[o]; for(let j=0;j<H;j++) s+=W2.v[o*H+j]*ha[j]; out[o]=s;}
  return {out, cache:{pre, ha}};
}
function siluBwd(W1,b1,W2,b2,x,D,H,O,cache,dOut) {
  const {pre, ha} = cache;
  for (let o=0;o<O;o++){
    b2.g[o]+=dOut[o];
    for(let j=0;j<H;j++) W2.g[o*H+j]+=dOut[o]*ha[j];
  }
  for(let j=0;j<H;j++){
    let s=0; for(let o=0;o<O;o++) s+=W2.v[o*H+j]*dOut[o];
    const sig=1/(1+Math.exp(-pre[j]));
    const dpre=s*(sig+pre[j]*sig*(1-sig));
    b1.g[j]+=dpre;
    for(let i=0;i<D;i++) W1.g[j*D+i]+=dpre*x[i];
  }
}
function u22bNonH(read, hv, headOld, carry) {
  const z = new Float64Array(20);
  z.set(read, 0); z.set(hv, 4); z.set(headOld, 8); z.set(carry, 12);
  return z;
}
globalThis.u22bGradCheck = async function (fs, log) {
  await globalThis.SelfU22bInit(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const E = u22bMakeE(G.makeRng(4343)), HF = u22bMakeHF(G.makeRng(4344));
  const hrng = G.makeRng(7);
  const h = new Float64Array(48); for(let i=0;i<48;i++) h[i]=hrng.uniform(-0.5,0.5);
  const z = new Float64Array(20); for(let i=0;i<20;i++) z[i]=hrng.uniform(-0.5,0.5);
  const hv=new Float64Array([0.1,-0.2,0.05,0.0]), read=new Float64Array([0.0,0.1,-0.1,0.05]);
  const target=new Float64Array([0.2,-0.1,0.0,0.1]); const v=1; const wStd=1.0;
  const lossFn=()=>{
    const se=siluFwd(E.W1,E.b1,E.W2,E.b2,z,20,16,8);
    const x=new Float64Array(56); x.set(h,0); x.set(se.out,48);
    const f=siluFwd(HF.W1,HF.b1,HF.W2,HF.b2,x,56,24,4);
    const ens=new Float64Array(4); for(let o=0;o<4;o++) ens[o]=hv[o]+read[o]+f.out[o];
    const ce=inCELossGrad(ens,v);
    let mse=0; for(let o=0;o<4;o++) mse+=wStd*(f.out[o]-target[o])*(f.out[o]-target[o])/4;
    return ce.loss+mse;
  };
  for(const p of [...u22bEParams(E),...u22bHFParams(HF)]) p.g.fill(0);
  const se=siluFwd(E.W1,E.b1,E.W2,E.b2,z,20,16,8);
  const x=new Float64Array(56); x.set(h,0); x.set(se.out,48);
  const f=siluFwd(HF.W1,HF.b1,HF.W2,HF.b2,x,56,24,4);
  const ens=new Float64Array(4); for(let o=0;o<4;o++) ens[o]=hv[o]+read[o]+f.out[o];
  const ce=inCELossGrad(ens,v);
  const d=new Float64Array(4);
  for(let o=0;o<4;o++) d[o]=ce.d[o]+wStd*(f.out[o]-target[o])/2;
  // backprop through HF then E (manual chain for dx wrt summary)
  siluBwd(HF.W1,HF.b1,HF.W2,HF.b2,x,56,24,4,f.cache,d);
  const dsum=new Float64Array(8);
  for(let k=0;k<8;k++){let s=0; for(let j=0;j<24;j++) s+=HF.W1.v[j*56+48+k]*((()=>{const sig=1/(1+Math.exp(-f.cache.pre[j])); return d.reduce((a,dd,o)=>a+HF.W2.v[o*24+j]*dd,0)*(sig+f.cache.pre[j]*sig*(1-sig));})()); dsum[k]=s;}
  const dhaHF=new Float64Array(24);
  for(let j=0;j<24;j++){let s=0; for(let o=0;o<4;o++) s+=HF.W2.v[o*24+j]*d[o]; const sig=1/(1+Math.exp(-f.cache.pre[j])); dhaHF[j]=s*(sig+f.cache.pre[j]*sig*(1-sig));}
  const dxSum=new Float64Array(8);
  for(let k=0;k<8;k++){let s=0; for(let j=0;j<24;j++) s+=HF.W1.v[j*56+48+k]*dhaHF[j]; dxSum[k]=s;}
  siluBwd(E.W1,E.b1,E.W2,E.b2,z,20,16,8,se.cache,dxSum);
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
  check(HF.W2,"HF.W2");check(HF.b2,"HF.b2");check(HF.W1,"HF.W1");check(E.W2,"E.W2");check(E.W1,"E.W1");
  log("u22b-gradcheck worstRel="+worst.toExponential(2)+" at "+worstWhere);
  return {worstRel:worst, worstWhere};
};
globalThis.runU22bTrain = async function (fs, log, opts) {
  const {arm, seed}=opts;
  const force=opts&&opts.force;
  const steps=800, B=16, lr=5e-3, K=5, H=48, C=6, wAdapt=0.5, wStd=1.0;
  const tag=arm+"-s"+seed+"-"+steps+"st";
  const ledgerPath="src/evidence/decomp/d-newai-self-"+tag+".json";
  try{const prev=JSON.parse(await fs.readTextFile(ledgerPath)); if(prev&&prev.verdict==="COMPLETE"&&!force){log(ledgerPath+" exists, skip");return prev;}}catch(e){}
  await globalThis.SelfU22bInit(fs);
  const G=await globalThis.IntrinsicInit(fs);
  const M=await loadU1W6(fs,G,seed);
  const MP=await loadU1M2nb(fs,G,seed);
  const HDold=await loadU16U5head(fs,G,seed);
  const LT=await loadU17Teacher(fs,G,seed);
  const E=u22bMakeE(G.makeRng(78000+seed*7919+u22bArmCode(arm)*131));
  const HF=u22bMakeHF(G.makeRng(79000+seed*7919+u22bArmCode(arm)*131));
  const hParams=[...u22bEParams(E),...u22bHFParams(HF)];
  const opt=new G.Adam(lr);
  const dataRng=G.makeRng(42200+seed*104729+77);
  let fixedMasks=null;{const fr=G.makeRng(91000+seed);fixedMasks=[];for(let k=0;k<K;k++){const m=new Float64Array(H);for(let i=0;i<H;i++)m[i]=fr.int(10)<5?2:0;fixedMasks.push(m);}}
  const M0snap=inSeqParams(M).map(p=>Float64Array.from(p.v));
  const isShuf=(arm==="u22b-shuf");
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
      batch.push({e,isAdapt,h:Float64Array.from(fw1.h),read:Float64Array.from(fr.readLogits),hv:Float64Array.from(fw1.hvLog),headOld,carry});
    }
    let lsum=0;
    for(let b=0;b<B;b++){
      const row=batch[b];
      const tSrc=isShuf?batch[(b+1)%B]:row;
      const tf=u16LinkerForward(LT,tSrc.h,tSrc.read,tSrc.hv,tSrc.headOld,tSrc.carry);
      const w=row.isAdapt?wAdapt:wStd;
      const target=row.isAdapt?tf.out:new Float64Array(4);
      const zsrc=isShuf?u22bNonH(tSrc.read,tSrc.hv,tSrc.headOld,tSrc.carry):u22bNonH(row.read,row.hv,row.headOld,row.carry);
      const se=siluFwd(E.W1,E.b1,E.W2,E.b2,zsrc,20,16,8);
      const x=new Float64Array(56); x.set(row.h,0); x.set(se.out,48);
      const sf=siluFwd(HF.W1,HF.b1,HF.W2,HF.b2,x,56,24,4);
      const ens=new Float64Array(4); for(let o=0;o<4;o++) ens[o]=row.hv[o]+row.read[o]+sf.out[o];
      const ce=inCELossGrad(ens,row.e.v); lsum+=ce.loss;
      let mse=0; for(let o=0;o<4;o++){const d=sf.out[o]-target[o]; mse+=w*d*d/4;}
      lsum+=mse;
      const d=new Float64Array(4);
      for(let o=0;o<4;o++) d[o]=ce.d[o]/B+w*(sf.out[o]-target[o])/2/B;
      // backward: HF first, then chain into E
      siluBwd(HF.W1,HF.b1,HF.W2,HF.b2,x,56,24,4,sf.cache,d);
      const dhaHF=new Float64Array(24);
      {const tmpD=new Float64Array(4); for(let o=0;o<4;o++) tmpD[o]=d[o];
       for(let j=0;j<24;j++){let s=0; for(let o=0;o<4;o++) s+=HF.W2.v[o*24+j]*tmpD[o]; const sig=1/(1+Math.exp(-sf.cache.pre[j])); dhaHF[j]=s*(sig+sf.cache.pre[j]*sig*(1-sig));}}
      const dxSum=new Float64Array(8);
      for(let k=0;k<8;k++){let s=0; for(let j=0;j<24;j++) s+=HF.W1.v[j*56+48+k]*dhaHF[j]; dxSum[k]=s;}
      siluBwd(E.W1,E.b1,E.W2,E.b2,zsrc,20,16,8,se.cache,dxSum);
    }
    let s=0; for(const p of hParams) for(let i=0;i<p.g.length;i++) s+=p.g[i]*p.g[i];
    const n=Math.sqrt(s); if(n>1.0){const sc=1.0/n; for(const p of hParams) for(let i=0;i<p.g.length;i++) p.g[i]*=sc;}
    opt.step(hParams);
    if(step%100===0||step===steps-1) curve.push({step,loss:+(lsum/B).toFixed(6)});
  }
  const M1p=inSeqParams(M); let maxDrift=0;
  for(let pi=0;pi<M1p.length;pi++) for(let i=0;i<M1p[pi].v.length;i++){const d=Math.abs(M1p[pi].v[i]-M0snap[pi][i]); if(d>maxDrift)maxDrift=d;}
  const save=o=>Array.from(o.v);
  const body={spec:"self-u22b-funnel-prereg",track:"U22b",arm,seed,steps,B,lr,wAdapt,wStd,gatedEval:true,teacher:"u17-gated-s"+seed,frozenAll:true,maxFrozenDrift:maxDrift,verdict:"COMPLETE",wallMs:Date.now()-t0,curve,
    P:{EW1:save(E.W1),Eb1:save(E.b1),EW2:save(E.W2),Eb2:save(E.b2),HW1:save(HF.W1),Hb1:save(HF.b1),HW2:save(HF.W2),Hb2:save(HF.b2)}};
  await fs.writeTextFile(ledgerPath,JSON.stringify(body));
  log("u22b-train "+tag+" loss0="+curve[0].loss+" lossN="+curve[curve.length-1].loss+" frozenDrift="+maxDrift);
  return body;
};
globalThis.runU22bEval = async function (fs, log, opts) {
  const {arm, seed}=opts;
  const steps=800, N=200;
  const tag=arm+"-s"+seed+"-"+steps+"st";
  const ledgerPath="src/evidence/decomp/d-newai-self-eval-"+tag+".json";
  const force=opts&&opts.force;
  try{const prev=JSON.parse(await fs.readTextFile(ledgerPath)); if(prev&&prev.verdict==="COMPLETE"&&!force){log(ledgerPath+" exists, skip");return prev;}}catch(e){}
  await globalThis.SelfU22bInit(fs);
  const G=await globalThis.IntrinsicInit(fs);
  const M=await loadU1W6(fs,G,seed);
  const MP=await loadU1M2nb(fs,G,seed);
  const tr=JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-"+tag+".json"));
  const E=u22bMakeE(G.makeRng(1)), HF=u22bMakeHF(G.makeRng(1));
  const load=(dst,src)=>{for(let i=0;i<dst.v.length;i++)dst.v[i]=src[i];};
  load(E.W1,tr.P.EW1);load(E.b1,tr.P.Eb1);load(E.W2,tr.P.EW2);load(E.b2,tr.P.Eb2);
  load(HF.W1,tr.P.HW1);load(HF.b1,tr.P.Hb1);load(HF.W2,tr.P.HW2);load(HF.b2,tr.P.Hb2);
  let evalMasks=null;{const fr2=G.makeRng(91000+seed);evalMasks=[];for(let kk=0;kk<5;kk++){const m=new Float64Array(48);for(let i=0;i<48;i++)m[i]=fr2.int(10)<5?2:0;evalMasks.push(m);}}
  const argmax4=a=>{let b=0;for(let i=1;i<4;i++)if(a[i]>a[b])b=i;return b;};
  const fwd=(h,z)=>{
    const se=siluFwd(E.W1,E.b1,E.W2,E.b2,z,20,16,8);
    const x=new Float64Array(56); x.set(h,0); x.set(se.out,48);
    const f=siluFwd(HF.W1,HF.b1,HF.W2,HF.b2,x,56,24,4);
    return {out:f.out, sum:se.out};
  };
  const srng=G.makeRng(52500+seed), supRng=G.makeRng(42000+seed*104729+999);
  let scr=0,two=0, hfStdAbs=0, sumStdAbs=0;
  const HDold0=await loadU16U5head(fs,G,seed);
  for(let i=0;i<N;i++){
    const e=inSeqGenShift(srng,null);
    const supE=[inSeqGenShift(supRng,null),inSeqGenShift(supRng,null),inSeqGenShift(supRng,null),inSeqGenShift(supRng,null)];
    const sup=supE.map(se=>({qkId:se.qk,vId:4+se.v,forceZero:false}));
    const fw1=inSeqForward(M,e.x,new Float64Array(8),evalMasks);
    const Eqk=new Float64Array(12);for(let d=0;d<12;d++)Eqk[d]=M.E.v[e.qk*12+d];
    const fr=m2ReadForward(M,MP,Eqk,sup);
    const headOld=u16U5HeadOut(HDold0,fw1.h);
    const z=u22bNonH(Float64Array.from(fr.readLogits),Float64Array.from(fw1.hvLog),headOld,Float64Array.from(fw1.cNew));
    const r=fwd(Float64Array.from(fw1.h),z);
    for(let o=0;o<4;o++) hfStdAbs+=Math.abs(r.out[o]);
    for(let k=0;k<8;k++) sumStdAbs+=Math.abs(r.sum[k]);
    const ens=new Float64Array(4);for(let o=0;o<4;o++)ens[o]=fw1.hvLog[o]+fr.readLogits[o];
    if(argmax4(ens)===e.v)scr++;
    const vhat=argmax4(ens);
    const x2m=[9,9,9,9,9,9,e.qk,e.k,vhat,8];
    const fw2=inSeqForward(M,x2m,fw1.cNew,evalMasks);
    if(argmax4(inMeanLogits({logitsK:fw2.logitsK}))===e.y)two++;
  }
  const arng=G.makeRng(61000+seed);
  let adaptY=0,adaptV=0,adaptYabl=0,adaptYsumAbl=0,hfAdaptAbs=0,sumAdaptAbs=0;
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
    const z=u22bNonH(read,hv,headOld,carry);
    const r=fwd(h,z);
    for(let o=0;o<4;o++) hfAdaptAbs+=Math.abs(r.out[o]);
    for(let k=0;k<8;k++) sumAdaptAbs+=Math.abs(r.sum[k]);
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
    // summary ablation: combiner with zeroed summary
    const xz=new Float64Array(56); xz.set(h,0);
    const fz=siluFwd(HF.W1,HF.b1,HF.W2,HF.b2,xz,56,24,4);
    const ensS=new Float64Array(4);for(let o=0;o<4;o++)ensS[o]=hv[o]+read[o]+fz.out[o];
    const vhatS=argmax4(ensS);
    const x2s=[9,9,9,9,9,9,e.qk,e.k,vhatS,8];
    const fw2s=inSeqForward(M,x2s,new Float64Array(8),evalMasks);
    if(argmax4(inMeanLogits({logitsK:fw2s.logitsK}))===e.y)adaptYsumAbl++;
  }
  const body={spec:"self-u22b-funnel-prereg",track:"U22b",arm,seed,steps,verdict:"COMPLETE",n:N,gatedEval:true,
    accScratch:+(scr/N).toFixed(4),accTwo:+(two/N).toFixed(4),adaptY:+(adaptY/N).toFixed(4),adaptV:+(adaptV/N).toFixed(4),
    adaptYablated:+(adaptYabl/N).toFixed(4),ablateDrop:+((adaptY-adaptYabl)/N).toFixed(4),
    adaptYsummaryAblated:+(adaptYsumAbl/N).toFixed(4),summaryDrop:+((adaptY-adaptYsumAbl)/N).toFixed(4),
    meanHfAbsStd:+(hfStdAbs/(N*4)).toFixed(4),meanHfAbsAdapt:+(hfAdaptAbs/(N*4)).toFixed(4),
    meanSumAbsStd:+(sumStdAbs/(N*8)).toFixed(4),meanSumAbsAdapt:+(sumAdaptAbs/(N*8)).toFixed(4),frozenDriftTrain:tr.maxFrozenDrift};
  await fs.writeTextFile(ledgerPath,JSON.stringify(body));
  log("u22b-eval "+tag+" adaptY="+body.adaptY+" adaptV="+body.adaptV+" two="+body.accTwo+" ablDrop="+body.ablateDrop+" sumDrop="+body.summaryDrop);
  return body;
};
