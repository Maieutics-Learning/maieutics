// src/tools/susp-hu-confirm.js — confirmatory run for prereg v1.2 COUNTERSIGNED.
// Confirms/kills the suspicion-killHu boundary on FRESH brains (train-until-filled).
// ARTIFACT MAP:
//   prereg ....: src/evidence/synthesis/phase-1dsusp-hu-prereg.md v1.2 COUNTERSIGNED
//   recipe ....: src/tools/ix-susp-hu.js (read-only; eval identical + means/entropy added)
//   training ..: ix-pilot.js trainBrain replica (OPTS/STAGES/seed formulas/tutor/pool identical)
//   blobs .....: scratch/susp-hu-brain-<seed>.json (regenerable via recipe + seeds; disposable)
//   ledger ....: src/evidence/synthesis/susp-hu-confirm.json (incremental, resume-safe)
//   signoff ...: src/evidence/synthesis/forensics-run-2026-11-16-02.json (2.a.v gate)
//   exams .....: G.buildExams(7008).killHu (200/brain); EVAL_R = G.EVAL_R
// Run: execute_js with globalThis.SUSP_ONLY (seed subset) and SUSP_BUDGET_MS; rerun
// resumes via ledger (done seeds skipped). No Math.random anywhere (seeded RNG only).
async function __susp_confirm_main() {
globalThis.window = globalThis;
const ORDER = ["src/tinynn/nn.js","src/tinynn/seeded.js","src/tinynn/tasks.js","src/tinynn/train.js","src/tinynn/pcgrad.js","src/tinynn/evo.js","src/tinynn/gseries.js","src/tools/forensics.js"];
for (const f of ORDER) { const src = await fs.readTextFile(f); (0, eval)(src + "\n//# sourceURL=" + f); }
const T = window.TinyNN, G = window.TinyNN.gseries, RNG = window.__tinyNN.makeRng, F = globalThis.Forensics;
const RUN_ID = "2026-11-16-02";
const VERSION = "4d5e31a+unpushed(prereg-v1.2,premises-v1v2,R1-R3)";
const BUDGET_MS = (globalThis.SUSP_BUDGET_MS != null) ? globalThis.SUSP_BUDGET_MS : 25*60*1000;
const T0wall = Date.now();
const timeLeft = () => (Date.now() - T0wall) < BUDGET_MS;
// ---- frozen training recipe (ix-pilot.js replica) ----
const OPTS = {vocab:9, classes:4, h:48, m:96, d:16, arch:"attn"};
const AIDX = 3;
const STAGES = [{steps:1500, attnKeep:1.0, softW:1.0, hardW:0},{steps:1500, attnKeep:0.0, softW:0.0, hardW:0}];
const TUTOR_PATH = "scratch/p1a-t0-316.json";
const R = G.EVAL_R;
const FRESH_ALL = []; for (let s = 5101; s <= 5114; s++) FRESH_ALL.push(s);
const ONLY = globalThis.SUSP_ONLY || null;
const LEDGER_PATH = "src/evidence/synthesis/susp-hu-confirm.json";
// ---- helpers ----
async function sha12(str) {
  const data = new TextEncoder().encode(str);
  const dig = await crypto.subtle.digest("SHA-256", data);
  const hx = Array.from(new Uint8Array(dig)).map(b=>b.toString(16).padStart(2,"0")).join("");
  return hx.slice(0,12);
}
function softmax(v) {
  let m = -1e300; for (let i=0;i<v.length;i++) if (v[i]>m) m=v[i];
  const p = new Array(v.length); let s=0;
  for (let i=0;i<v.length;i++){ p[i]=Math.exp(v[i]-m); s+=p[i]; }
  for (let i=0;i<v.length;i++) p[i]/=s;
  return p;
}
function argmax(a){ let bi=0; for(let i=1;i<a.length;i++) if(a[i]>a[bi]) bi=i; return bi; }
function auc(scores, labels) {
  const n = scores.length, idx = new Array(n);
  for (let i=0;i<n;i++) idx[i]=i;
  idx.sort((a,b)=>scores[a]-scores[b]);
  let n1=0; for(let i=0;i<n;i++) if(labels[i]===1) n1++;
  const n0=n-n1; if(!n0||!n1) return null;
  let rs=0,i=0;
  while(i<n){ let j=i; while(j+1<n&&scores[idx[j+1]]===scores[idx[i]]) j++;
    const avg=(i+1+j+1)/2;
    for(let k=i;k<=j;k++) if(labels[idx[k]]===1) rs+=avg;
    i=j+1; }
  return (rs-n1*(n1+1)/2)/(n0*n1);
}
function spearman(a,b){
  const n=a.length;
  const rank=(v)=>{ const ix=v.map((x,i)=>i).sort((p,q)=>v[p]-v[q]); const r=new Array(n);
    let k=0; while(k<n){ let j=k; while(j+1<n&&v[ix[j+1]]===v[ix[k]]) j++;
      const avg=(k+1+j+1)/2-1; for(let t=k;t<=j;t++) r[ix[t]]=avg; k=j+1; } return r; };
  const ra=rank(a),rb=rank(b);
  const ma=ra.reduce((x,y)=>x+y,0)/n, mb=rb.reduce((x,y)=>x+y,0)/n;
  let num=0,da=0,db=0;
  for(let i=0;i<n;i++){ num+=(ra[i]-ma)*(rb[i]-mb); da+=(ra[i]-ma)**2; db+=(rb[i]-mb)**2; }
  if(da===0||db===0) return null;
  return num/Math.sqrt(da*db);
}
function spearmanP(rho,n,acc,aucVals){
  // Permutation two-tailed p (deterministic LCG; disclosure only, bar uses rho).
  // Replaces a buggy closed-form betai (filed wrong p=0.0029 for rho=0.5275/n=13;
  // correct ~0.069; errata in ledger; gate unaffected).
  if(rho===null||n<4||!acc||!aucVals) return null;
  let seed=90210;
  const rnd=()=>{ seed=(seed*1103515245+12345)&0x7fffffff; return seed/0x7fffffff; };
  let ge=0; const REPS=20000;
  for(let k=0;k<REPS;k++){
    const p=aucVals.slice();
    for(let i=p.length-1;i>0;i--){ const j=Math.floor(rnd()*(i+1)); const t=p[i];p[i]=p[j];p[j]=t; }
    const r=spearman(acc,p);
    if(r!==null&&Math.abs(r)>=Math.abs(rho)) ge++;
  }
  return +(ge/REPS).toFixed(4);
}
function rhoCI(rho,n){
  if(rho===null||n<4) return null;
  if(Math.abs(rho)>=0.9999) return [rho,rho];
  const z=Math.atanh(Math.max(-0.9999,Math.min(0.9999,rho))), se=1/Math.sqrt(n-3);
  return [+(Math.tanh(z-1.96*se)).toFixed(4), +(Math.tanh(z+1.96*se)).toFixed(4)];
}
function median(v){ if(!v.length) return null; const s=v.slice().sort((a,b)=>a-b); const m=s.length>>1; return s.length%2? s[m] : (s[m-1]+s[m])/2; }
// ---- load ledger (resume) ----
let ledger=null;
try { ledger=JSON.parse(await fs.readTextFile(LEDGER_PATH)); }
catch(e){ ledger=null; }
const exams = G.buildExams(7008);
if(!exams.killHu || exams.killHu.length!==200) throw new Error("EXAM IDENTITY FAIL: killHu length "+(exams.killHu&&exams.killHu.length));
const lineHash = await sha12(JSON.stringify(exams.killHu.map(e=>e.x)));
const recipeSrc = await fs.readTextFile("src/tools/ix-susp-hu.js");
const selfSrc = await fs.readTextFile("src/tools/susp-hu-confirm.js");
const inFp = lineHash;
const codeFp = await sha12(selfSrc+recipeSrc+JSON.stringify({OPTS,STAGES,AIDX}));
const fingerprint = "in:"+inFp+"+code:"+codeFp;
if(!ledger){
  ledger={runId:RUN_ID, fingerprint, version:VERSION, prereg:"phase-1dsusp-hu-prereg.md v1.2 COUNTERSIGNED",
    design:{seeds:"5101-5114 train-until-filled (max 14)", regimes:"lost acc<0.5, competent acc>=0.6, mid 0.5-0.6 in-rho/out-medians",
      training:"ix-pilot trainBrain replica (OPTS h48/m96/d16 attn, STAGES 1500+1500, tutor p1a-t0-316, pool buildPool(7))",
      readout:"ix-susp-hu replica (G.loadModel + EVAL_R argmax, suspicion=1-top1)",
      bars:"rho>=0.6 (report p+CI) + competent-median>0.6 AND lost-median<0.5, >=3/regime; pooled no bar; downgrade median-lost-Delta<=0.02"},
    examIdentity:{constructor:"G.buildExams(7008).killHu", n:200, lineHash:inFp},
    perBrain:[], pooled:null, stats:null, diagnostic:null, verdict:null, gates:null, signoff:null};
}
if(ledger.runId!==RUN_ID) throw new Error("ledger runId mismatch");
if(ledger.fingerprint!==fingerprint){
  // fingerprint covers exams+code; unpushed edits change codeFp -> stale ledger from older driver
  throw new Error("fingerprint mismatch: ledger "+ledger.fingerprint+" vs current "+fingerprint+" (driver changed — do not merge across versions)");
}
const done=new Set(ledger.perBrain.map(r=>r.seed));
// ---- tutor + pool (once) ----
const train=G.buildPool(7);
const tutor=G.loadModel(JSON.parse(await fs.readTextFile(TUTOR_PATH)));
const tCache=await G.cacheTutor(tutor, train);
async function trainBrain(seed){
  const model=T.makeModel(RNG(seed*1000+21+AIDX), OPTS);
  const res=await G.trainFaded({model, tutor, train, stages:STAGES, tutorCache:tCache, seed:seed*100+30+AIDX});
  return {model, lastLoss:+res.lastLoss.toFixed(4)};
}
function evalBrain(model){
  const sc=[],lb=[],msC=[],msI=[],ents=[];
  let acc=0;
  for(const ex of exams.killHu){
    const fw=model.forward(ex.x, R);
    const lg=Array.from(fw.logits);
    let m=-1e300; for(const v of lg) if(v>m) m=v;
    const p=lg.map(v=>Math.exp(v-m)); const s=p.reduce((a,x)=>a+x,0);
    for(let k=0;k<p.length;k++) p[k]/=s;
    let top=0; for(let k=1;k<p.length;k++) if(p[k]>p[top]) top=k;
    const c=top===ex.y?1:0; acc+=c;
    const susp=1-p[top];
    sc.push(susp); lb.push(c===0?1:0);
    (c?msC:msI).push(susp);
    let e=0; for(const q of p) e-=q*Math.log(q+1e-300);
    ents.push(e);
  }
  const mean=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:null;
  return {acc:+(acc/sc.length).toFixed(4), nErr:sc.length-acc,
    suspAUC:(()=>{const v=auc(sc,lb);return v===null?null:+v.toFixed(4);})(),
    meanSuspCorrect:mean(msC)===null?null:+mean(msC).toFixed(4),
    meanSuspIncorrect:mean(msI)===null?null:+mean(msI).toFixed(4),
    meanEntropy:+mean(ents).toFixed(4), _sc:sc, _lb:lb};
}
// ---- validation self-check on first new brain (loader-agreement, NOT accuracy) ----
async function loaderAgreement(seed){
  const blob=JSON.parse(await fs.readTextFile("scratch/susp-hu-brain-"+seed+".json"));
  const m1=G.loadModel(blob), m2=G.loadModel(JSON.parse(JSON.stringify(blob)));
  for(let i=0;i<exams.killHu.length;i++){
    const a1=argmax(Array.from(m1.forward(exams.killHu[i].x,R).logits));
    const a2=argmax(Array.from(m2.forward(exams.killHu[i].x,R).logits));
    if(a1!==a2) return {pass:false, detail:"mismatch at line "+i};
  }
  return {pass:true, detail:"200/200 argmax agreement"};
}
// ---- train-until-filled loop ----
const targets=ONLY||FRESH_ALL;
let worked=0;
for(const seed of targets){
  if(!timeLeft()) break;
  if(seed<5101||seed>5114) throw new Error("seed out of fresh range: "+seed);
  if(seed>=5001&&seed<=5024) throw new Error("seed exclusion violated: "+seed);
  if(done.has(seed)) continue;
  if(ledger.perBrain.length>=14) break;
  const {model,lastLoss}=await trainBrain(seed);
  await fs.writeFile("scratch/susp-hu-brain-"+seed+".json", new TextEncoder().encode(JSON.stringify(G.saveModel(model,OPTS))));
  const ev=evalBrain(model);
  ledger.perBrain.push({seed, acc:ev.acc, nErr:ev.nErr, suspAUC:ev.suspAUC,
    meanSuspCorrect:ev.meanSuspCorrect, meanSuspIncorrect:ev.meanSuspIncorrect,
    delta:(ev.meanSuspCorrect===null||ev.meanSuspIncorrect===null)?null:+(ev.meanSuspIncorrect-ev.meanSuspCorrect).toFixed(4),
    meanEntropy:ev.meanEntropy, lastLoss});
  done.add(seed); worked++;
  await fs.writeTextFile(LEDGER_PATH, JSON.stringify(ledger));
}
// ---- verdict computation (from per-brain numbers only) ----
function computeVerdict(pb){
  const rows=pb.filter(r=>r.suspAUC!==null);
  const lost=pb.filter(r=>r.acc<0.5), comp=pb.filter(r=>r.acc>=0.6);
  const lostAUC=lost.map(r=>r.suspAUC).filter(v=>v!==null);
  const compAUC=comp.map(r=>r.suspAUC).filter(v=>v!==null);
  const rho=spearman(pb.filter(r=>r.suspAUC!==null).map(r=>r.acc), rows.map(r=>r.suspAUC));
  const n=rows.length;
  const poolRows=pb; // pooled recomputed by caller if needed
  const accNN=pb.filter(r=>r.suspAUC!==null).map(r=>r.acc), aucNN=rows.map(r=>r.suspAUC);
  const stats={n, nLost:lost.length, nComp:comp.length,
    rho:rho===null?null:+rho.toFixed(4), p:spearmanP(rho,n,accNN,aucNN), ci:rhoCI(rho,n),
    medLost:median(lostAUC)===null?null:+median(lostAUC).toFixed(4),
    medComp:median(compAUC)===null?null:+median(compAUC).toFixed(4)};
  const lostDeltas=lost.map(r=>r.delta).filter(v=>v!==null);
  const medDelta=median(lostDeltas)===null?null:+median(lostDeltas).toFixed(4);
  // pooled AUC for record only
  let poolSc=[],poolLb=[];
  // (recomputed outside; placeholder)
  let primary=(stats.rho!==null&&stats.rho>=0.6&&lost.length>=3&&comp.length>=3);
  let secondary=(stats.medComp!==null&&stats.medLost!==null&&stats.medComp>0.6&&stats.medLost<0.5);
  let verdict=(!primary||!secondary)?"FAIL":"PASS";
  let downgrade=null;
  if(medDelta!==null&&medDelta<=0.02){ downgrade="DOWNGRADE-to-brain-bias"; verdict="DOWNGRADE"; }
  return {stats, medDelta, primary, secondary, verdict, downgrade};
}
async function finishIfReady(){
  // ready when >=10 brains AND (regimes filled OR 14 reached)
  const lostN=ledger.perBrain.filter(r=>r.acc<0.5).length;
  const compN=ledger.perBrain.filter(r=>r.acc>=0.6).length;
  const ready=(ledger.perBrain.length>=10&&( (lostN>=3&&compN>=3) || ledger.perBrain.length>=14));
  const exhausted=(ledger.perBrain.length>=14);
  if(!ready) return {ready:false, lostN, compN};
  // pooled AUC
  let poolSc=[],poolLb=[];
  for(const r of ledger.perBrain){
    const blob=JSON.parse(await fs.readTextFile("scratch/susp-hu-brain-"+r.seed+".json"));
    const model=G.loadModel(blob);
    for(const ex of exams.killHu){
      const fw=model.forward(ex.x,R); const lg=Array.from(fw.logits);
      let m=-1e300; for(const v of lg) if(v>m)m=v;
      const p=lg.map(v=>Math.exp(v-m)); const s=p.reduce((a,x)=>a+x,0);
      let top=0; for(let k=1;k<p.length;k++) if(p[k]/s>p[top]/s) top=k;
      const pt=p[top]/s;
      poolSc.push(1-pt); poolLb.push(top===ex.y?0:1);
    }
  }
  const pooled=auc(poolSc,poolLb);
  const cv=computeVerdict(ledger.perBrain);
  ledger.pooled=pooled===null?null:+pooled.toFixed(4);
  ledger.stats=cv.stats;
  // diagnostic per regime
  const reg=which=>ledger.perBrain.filter(which);
  const mean=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:null;
  ledger.diagnostic={
    lost:{n:reg(r=>r.acc<0.5).length,
      meanSuspCorrect:mean(reg(r=>r.acc<0.5).map(r=>r.meanSuspCorrect).filter(v=>v!==null)),
      meanSuspIncorrect:mean(reg(r=>r.acc<0.5).map(r=>r.meanSuspIncorrect).filter(v=>v!==null)),
      meanEntropy:mean(reg(r=>r.acc<0.5).map(r=>r.meanEntropy))},
    competent:{n:reg(r=>r.acc>=0.6).length,
      meanSuspCorrect:mean(reg(r=>r.acc>=0.6).map(r=>r.meanSuspCorrect).filter(v=>v!==null)),
      meanSuspIncorrect:mean(reg(r=>r.acc>=0.6).map(r=>r.meanSuspIncorrect).filter(v=>v!==null)),
      meanEntropy:mean(reg(r=>r.acc>=0.6).map(r=>r.meanEntropy))},
    medLostDelta:cv.medDelta, downgrade:cv.downgrade};
  ledger.verdict={primary:cv.primary, secondary:cv.secondary,
    verdict:exhausted&&!(cv.stats.nLost>=3&&cv.stats.nComp>=3)?"FAIL-regimes-unfilled":cv.verdict,
    note:cv.downgrade||(cv.verdict==="PASS"?"boundary holds (screening-level)":"boundary fails")};
  // ---- 2.a.v forensics gate ----
  F.clearChecks();
  F.registerCheck("ledger-present-parse", ()=>{ 
    const ok=ledger.perBrain.length>=10; return {pass:ok, detail:"rows="+ledger.perBrain.length}; },{kill:true});
  F.registerCheck("validation-gate-holds", ()=>{
    const exOk=exams.killHu.length===200;
    const excl=ledger.perBrain.every(r=>!(r.seed>=5001&&r.seed<=5024));
    return {pass:exOk&&excl, detail:"exam=200:" +exOk+" exclusion:"+excl+" lineHash:"+inFp}; },{kill:true});
  F.registerCheck("loader-agreement", ()=>({pass:ledger.gates&&ledger.gates.loaderAgreement===true, detail:"200/200 argmax (not accuracy)"}),{kill:true});
  F.registerCheck("per-brain-grained", ()=>{
    const ok=ledger.perBrain.length>=10&&cv.stats.nLost>=3&&cv.stats.nComp>=3;
    return {pass:ok, detail:"n="+ledger.perBrain.length+" lost="+cv.stats.nLost+" comp="+cv.stats.nComp+" (pooled never alone)"}; },{kill:true});
  F.registerCheck("verdict-matches-rule", ()=>{
    const v=ledger.verdict.verdict;
    const rule=(cv.primary&&cv.secondary)?(cv.downgrade?"DOWNGRADE":"PASS"):(exhausted&&!(cv.stats.nLost>=3&&cv.stats.nComp>=3)?"FAIL-regimes-unfilled":"FAIL");
    return {pass:v===rule, detail:"filed="+v+" rule="+rule+" rho="+cv.stats.rho+" medC="+cv.stats.medComp+" medL="+cv.stats.medLost+" dMed="+cv.medDelta}; },{kill:true});
  // loader agreement evaluated once (first brain) before gates run
  const firstSeed=ledger.perBrain[0].seed;
  const la=await loaderAgreement(firstSeed);
  ledger.gates={loaderAgreement:la.pass, loaderDetail:la.detail};
  await fs.writeTextFile(LEDGER_PATH, JSON.stringify(ledger));
  const results=F.runChecks({fingerprint, perBrain:ledger.perBrain.length});
  const evaluation=F.evaluateGates(results);
  const decision=evaluation.verdict==="PASS"?"PASS":"KILL";
  const signoff=F.recordSignoff({ctxFingerprint:fingerprint, version:VERSION,
    results, evaluation, decision, note:"confirmatory run "+RUN_ID+" ("+ledger.verdict.verdict+")"});
  ledger.signoff=signoff;
  await fs.writeTextFile(LEDGER_PATH, JSON.stringify(ledger));
  await fs.writeFile("src/evidence/synthesis/forensics-run-2026-11-16-02.json",
    new TextEncoder().encode(JSON.stringify({runId:RUN_ID, fingerprint, version:VERSION,
      subject:"susp-hu confirmatory ("+ledger.verdict.verdict+")", gateResults:results, evaluation, signoff}, null, 1)));
  return {ready:true, lostN, compN, verdict:ledger.verdict.verdict};
}
const st=await finishIfReady().catch(e=>({ready:false, gateError:String(e&&e.message||e)}));
return {runId:RUN_ID, fingerprint, worked, n:ledger.perBrain.length,
  perBrain:ledger.perBrain.map(r=>({seed:r.seed, acc:r.acc, suspAUC:r.suspAUC})),
  status:st};
}
