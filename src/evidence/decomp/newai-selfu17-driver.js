// newai-selfu17-driver.js — U17 adapt-gated relay linker (surgery on U16).
// Frozen: W6 trunk + M2-nb + U5-open head. Trainable: linker only (~1.7k).
// Gate: standard half ens = hv+read (linker NOT called, zero grad); adapt half ens = hv+read+linkOut.
// R1/R3 pins: hard bypass via conditional, not x0 mask. Loss isolation: standard items skip linker backward.
globalThis.SelfU17Init = async function (fs) {
  for (const p of ["src/evidence/decomp/newai-selfu16-driver.js"]) {
    const src = await fs.readTextFile(p); (0, eval)(src + "\n//# sourceURL=" + p);
  }
  await globalThis.SelfU16Init(fs);
  if (!globalThis.runU16Train) throw new Error("u17 stack load failed");
};
function u17ArmCode(arm) { if (arm === "u17-gated") return 143; if (arm === "u17-shuf") return 144; return 143; }
globalThis.u17GradCheck = async function (fs, log) {
  await globalThis.SelfU17Init(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const M = inSeqMakeModel(G.makeRng(4342));
  const MP = m2MakeParams(G.makeRng(4344));
  const HD = { W1: inParam(G.makeRng(940), 24*48, 48), b1: inParam(G.makeRng(941), 24, 24), W2: inParam(G.makeRng(942), 4*24, 24), b2: inParam(G.makeRng(943), 4, 4) };
  const L = u16MakeLinker(G.makeRng(4343));
  const rng = G.makeRng(4345);
  const ep = genAdaptEpisode(rng);
  const e = ep.query, sup = ep.sup.map(se => ({ qkId: se.qk, vId: 4+se.v, forceZero: false }));
  const fw1 = inSeqForward(M, e.x, new Float64Array(8), null);
  const Eqk = new Float64Array(12); for (let d=0; d<12; d++) Eqk[d] = M.E.v[e.qk*12+d];
  const fr = m2ReadForward(M, MP, Eqk, sup);
  const head = u16U5HeadOut(HD, fw1.h);
  const carry = new Float64Array(8);
  const lossFn = () => {
    const f = u16LinkerForward(L, fw1.h, fr.readLogits, fw1.hvLog, head, carry);
    const ens = new Float64Array(4);
    for (let o=0;o<4;o++) ens[o] = fw1.hvLog[o]+fr.readLogits[o]+f.out[o];
    return inCELossGrad(ens, e.v).loss;
  };
  for (const p of u16LinkerParams(L)) p.g.fill(0);
  const f = u16LinkerForward(L, fw1.h, fr.readLogits, fw1.hvLog, head, carry);
  const ens = new Float64Array(4);
  for (let o=0;o<4;o++) ens[o] = fw1.hvLog[o]+fr.readLogits[o]+f.out[o];
  const ce = inCELossGrad(ens, e.v);
  u16LinkerBackward(L, fw1.h, fr.readLogits, fw1.hvLog, head, carry, f.cache, ce.d);
  const eps = 1e-6;
  let worst = 0, worstWhere = "";
  const checkParam = (P, name) => {
    for (let i=0;i<Math.min(P.v.length,6);i++) {
      P.v[i]+=eps; const a1=lossFn(); P.v[i]-=2*eps; const a0=lossFn(); P.v[i]+=eps;
      const num=(a1-a0)/(2*eps), an=P.g[i];
      const denom=Math.max(1e-12,Math.abs(num)+Math.abs(an));
      const rel=Math.abs(num-an)/denom;
      if (Math.abs(num)<1e-9 && Math.abs(an)<1e-9) continue;
      if (rel>worst){worst=rel;worstWhere=name+"["+i+"] num="+num+" an="+an;}
    }
  };
  checkParam(L.Wo,"Wo"); checkParam(L.v,"v"); checkParam(L.W2,"W2"); checkParam(L.U,"U");
  checkParam(L.Ah,"Ah"); checkParam(L.Ar,"Ar"); checkParam(L.Ac,"Ac"); checkParam(L.Ad,"Ad"); checkParam(L.Av,"Av");
  log("u17-gradcheck worstRel="+worst.toExponential(2)+" at "+worstWhere);
  return { worstRel: worst, worstWhere };
};
globalThis.runU17Train = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const steps = 800, B = 16, lr = 5e-3, K = 5, H = 48, C = 6;
  const tag = arm+"-s"+seed+"-"+steps+"st";
  const ledgerPath = "src/evidence/decomp/d-newai-self-"+tag+".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict==="COMPLETE"){log(ledgerPath+" exists, skip");return prev;} } catch(e){}
  await globalThis.SelfU17Init(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const M = await loadU1W6(fs, G, seed);
  const MP = await loadU1M2nb(fs, G, seed);
  const HD = await loadU16U5head(fs, G, seed);
  const L = u16MakeLinker(G.makeRng(77000+seed*7919+u17ArmCode(arm)*131));
  const lParams = u16LinkerParams(L);
  const opt = new G.Adam(lr);
  const dataRng = G.makeRng(42100+seed*104729+77);
  let fixedMasks=null; { const fr=G.makeRng(91000+seed); fixedMasks=[]; for(let k=0;k<K;k++){const m=new Float64Array(H); for(let i=0;i<H;i++) m[i]=fr.int(10)<5?2:0; fixedMasks.push(m);} }
  const M0snap = inSeqParams(M).map(p=>Float64Array.from(p.v));
  const isShuf = (arm==="u17-shuf");
  const t0=Date.now(), curve=[];
  for (let step=0; step<steps; step++){
    for (const p of lParams) p.g.fill(0);
    const batch=[];
    for (let b=0;b<B;b++){
      const isAdapt = dataRng.int(2)===1;
      let e, sup;
      if (!isAdapt){
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
      const head=u16U5HeadOut(HD,fw1.h);
      const carry=isAdapt?new Float64Array(8):Float64Array.from(fw1.cNew);
      batch.push({e,isAdapt,h:Float64Array.from(fw1.h),read:Float64Array.from(fr.readLogits),hv:Float64Array.from(fw1.hvLog),head,carry});
    }
    let lsum=0, acnt=0;
    for (let b=0;b<B;b++){
      const row=batch[b];
      if (!row.isAdapt){
        const ens=row.hv.map((v,o)=>v+row.read[o]);
        const ce=inCELossGrad(ens,row.e.v); lsum+=ce.loss;
        continue;
      }
      acnt++;
      const src=isShuf?batch[(b+1)%B]:row;
      const sh=src.h, sr=src.read, shv=src.hv, shead=src.head, scarry=src.carry;
      const f=u16LinkerForward(L,sh,sr,shv,shead,scarry);
      const ens=new Float64Array(4); for(let o=0;o<4;o++) ens[o]=row.hv[o]+row.read[o]+f.out[o];
      const ce=inCELossGrad(ens,row.e.v); lsum+=ce.loss;
      const d=new Float64Array(4); for(let o=0;o<4;o++) d[o]=ce.d[o]/B;
      u16LinkerBackward(L,sh,sr,shv,shead,scarry,f.cache,d);
    }
    let s=0; for(const p of lParams) for(let i=0;i<p.g.length;i++) s+=p.g[i]*p.g[i];
    const n=Math.sqrt(s); if(n>1.0){const sc=1.0/n; for(const p of lParams) for(let i=0;i<p.g.length;i++) p.g[i]*=sc;}
    opt.step(lParams);
    if(step%100===0||step===steps-1) curve.push({step,loss:+(lsum/B).toFixed(6),adaptFrac:+(acnt/B).toFixed(3)});
  }
  const M1p=inSeqParams(M); let maxDrift=0;
  for(let pi=0;pi<M1p.length;pi++) for(let i=0;i<M1p[pi].v.length;i++){const d=Math.abs(M1p[pi].v[i]-M0snap[pi][i]); if(d>maxDrift)maxDrift=d;}
  const save=o=>Array.from(o.v);
  const body={spec:"self-u17-gated-linker-prereg",track:"U17",arm,seed,steps,B,lr,gated:true,initTrunk:"W6-s"+seed,initNotebook:"M2-nb-s"+seed,initHead:"U5-nl-open-s"+seed,frozenAll:true,maxFrozenDrift:maxDrift,verdict:"COMPLETE",wallMs:Date.now()-t0,curve,
    P:{Ah:save(L.Ah),bh:save(L.bh),Ar:save(L.Ar),br:save(L.br),Av:save(L.Av),bv:save(L.bv),Ad:save(L.Ad),bd:save(L.bd),Ac:save(L.Ac),bc:save(L.bc),U:save(L.U),W2:save(L.W2),b2:save(L.b2),v:save(L.v),Wo:save(L.Wo),bo:save(L.bo)}};
  await fs.writeTextFile(ledgerPath,JSON.stringify(body));
  log("u17-train "+tag+" loss0="+curve[0].loss+" lossN="+curve[curve.length-1].loss+" frozenDrift="+maxDrift);
  return body;
};
globalThis.runU17Eval = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const steps=800, N=200;
  const tag=arm+"-s"+seed+"-"+steps+"st";
  const ledgerPath="src/evidence/decomp/d-newai-self-eval-"+tag+".json";
  const force=opts&&opts.force;
  try{const prev=JSON.parse(await fs.readTextFile(ledgerPath)); if(prev&&prev.verdict==="COMPLETE"&&!force){log(ledgerPath+" exists, skip");return prev;}}catch(e){}
  await globalThis.SelfU17Init(fs);
  const G=await globalThis.IntrinsicInit(fs);
  const M=await loadU1W6(fs,G,seed);
  const MP=await loadU1M2nb(fs,G,seed);
  const HD=await loadU16U5head(fs,G,seed);
  const tr=JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-"+tag+".json"));
  const L=u16MakeLinker(G.makeRng(1));
  const load=(dst,src)=>{for(let i=0;i<dst.v.length;i++)dst.v[i]=src[i];};
  load(L.Ah,tr.P.Ah);load(L.bh,tr.P.bh);load(L.Ar,tr.P.Ar);load(L.br,tr.P.Br||tr.P.br);load(L.Av,tr.P.Av);load(L.bv,tr.P.bv);load(L.Ad,tr.P.Ad);load(L.bd,tr.P.bd);load(L.Ac,tr.P.Ac);load(L.bc,tr.P.bc);load(L.U,tr.P.U);load(L.W2,tr.P.W2);load(L.b2,tr.P.b2);load(L.v,tr.P.v);load(L.Wo,tr.P.Wo);load(L.bo,tr.P.bo);
  let evalMasks=null;{const fr2=G.makeRng(91000+seed);evalMasks=[];for(let kk=0;kk<5;kk++){const m=new Float64Array(48);for(let i=0;i<48;i++)m[i]=fr2.int(10)<5?2:0;evalMasks.push(m);}}
  const argmax4=a=>{let b=0;for(let i=1;i<4;i++)if(a[i]>a[b])b=i;return b;};
  const srng=G.makeRng(52500+seed), supRng=G.makeRng(42000+seed*104729+999);
  let scr=0,two=0;
  for(let i=0;i<N;i++){
    const e=inSeqGenShift(srng,null);
    const supE=[inSeqGenShift(supRng,null),inSeqGenShift(supRng,null),inSeqGenShift(supRng,null),inSeqGenShift(supRng,null)];
    const sup=supE.map(se=>({qkId:se.qk,vId:4+se.v,forceZero:false}));
    const fw1=inSeqForward(M,e.x,new Float64Array(8),evalMasks);
    const Eqk=new Float64Array(12);for(let d=0;d<12;d++)Eqk[d]=M.E.v[e.qk*12+d];
    const fr=m2ReadForward(M,MP,Eqk,sup);
    const ens=new Float64Array(4);for(let o=0;o<4;o++)ens[o]=fw1.hvLog[o]+fr.readLogits[o];
    if(argmax4(ens)===e.v)scr++;
    const vhat=argmax4(ens);
    const x2m=[9,9,9,9,9,9,e.qk,e.k,vhat,8];
    const fw2=inSeqForward(M,x2m,fw1.cNew,evalMasks);
    if(argmax4(inMeanLogits({logitsK:fw2.logitsK}))===e.y)two++;
  }
  const arng=G.makeRng(61000+seed);
  let adaptY=0,adaptV=0,adaptYabl=0,entSum=0,top2sum=0;
  for(let i=0;i<N;i++){
    const ep=genAdaptEpisode(arng);
    const sup=ep.sup.map(se=>({qkId:se.qk,vId:4+se.v,forceZero:false}));
    const e=ep.query;
    const fw1=inSeqForward(M,e.x,new Float64Array(8),evalMasks);
    const Eqk=new Float64Array(12);for(let d=0;d<12;d++)Eqk[d]=M.E.v[e.qk*12+d];
    const fr=m2ReadForward(M,MP,Eqk,sup);
    const head=u16U5HeadOut(HD,fw1.h);
    const zero=new Float64Array(8);
    const f=u16LinkerForward(L,fw1.h,fr.readLogits,fw1.hvLog,head,zero);
    entSum+=f.cache.ent;top2sum+=f.cache.top2mass;
    const ens=new Float64Array(4);for(let o=0;o<4;o++)ens[o]=fw1.hvLog[o]+fr.readLogits[o]+f.out[o];
    const vhat=argmax4(ens);
    if(vhat===e.v)adaptV++;
    const x2m=[9,9,9,9,9,9,e.qk,e.k,vhat,8];
    const fw2=inSeqForward(M,x2m,zero,evalMasks);
    if(argmax4(inMeanLogits({logitsK:fw2.logitsK}))===e.y)adaptY++;
    const ensA=new Float64Array(4);for(let o=0;o<4;o++)ensA[o]=fw1.hvLog[o]+fr.readLogits[o];
    const vhatA=argmax4(ensA);
    const x2a=[9,9,9,9,9,9,e.qk,e.k,vhatA,8];
    const fw2a=inSeqForward(M,x2a,zero,evalMasks);
    if(argmax4(inMeanLogits({logitsK:fw2a.logitsK}))===e.y)adaptYabl++;
  }
  const body={spec:"self-u17-gated-linker-prereg",track:"U17",arm,seed,steps,verdict:"COMPLETE",n:N,gated:true,
    accScratch:+(scr/N).toFixed(4),accTwo:+(two/N).toFixed(4),adaptY:+(adaptY/N).toFixed(4),adaptV:+(adaptV/N).toFixed(4),
    adaptYablated:+(adaptYabl/N).toFixed(4),ablateDrop:+((adaptY-adaptYabl)/N).toFixed(4),
    meanRelayEntropy:+(entSum/N).toFixed(4),meanTop2mass:+(top2sum/N).toFixed(4),frozenDriftTrain:tr.maxFrozenDrift};
  await fs.writeTextFile(ledgerPath,JSON.stringify(body));
  log("u17-eval "+tag+" adaptY="+body.adaptY+" adaptV="+body.adaptV+" two="+body.accTwo+" ablDrop="+body.ablateDrop);
  return body;
};
