// src/tools/d1a-smoke.js — Detour D1a fixed-3 2-brain smoke (DRAFT, Detour D1 v1.1).
// Pipeline: spelled pool (train keys) -> hint tutor (hard+spelled-attn) -> gate killA-spelled>=0.95
// -> 2 fresh students (trainFaded replica via spelled tutor cache) -> killHu-spelled 200/brain
// + short/long split + eval-only controls + suspicion readout (1-top1, per-brain AUC).
// ARTIFACT MAP:
//   spec ....: src/gameplan/archive/v22-frozen-2026-11-15.md Detour D1 v1.1 DRAFT (UNCOUNTERSIGNED; frozen record)
//   builders : src/tinynn/spelled-keys.js (byte layout frozen: alpha 10-17, SEP 18, ?=8, vocab 19)
//   pool ....: PART_SEED 7000 (384 train / 128 held — 8^3=512, spec 64-combo text corrected, design unchanged)
//   ledger ..: src/evidence/synthesis/d1a-smoke.json (resume-safe; runId+fingerprint per 2.d.v)
//   blobs ...: scratch/d1a-tutor.json, scratch/d1a-brain-<seed>.json (disposable/regenerable)
//   exams ...: KA_SEED 7101 (killA-spelled, train keys, tutor gate), HUA_SEED 7100 (killHu-spelled, held keys)
// Run: execute_js with globalThis.D1A_BUDGET_MS; reruns resume via ledger/blobs. Seeded RNG only.
async function __d1a_smoke_main() {
globalThis.window = globalThis;
const ORDER = ["src/tinynn/nn.js","src/tinynn/seeded.js","src/tinynn/tasks.js","src/tinynn/train.js","src/tinynn/gseries.js","src/tinynn/spelled-keys.js","src/tools/forensics.js"];
for (const f of ORDER) { const src = await fs.readTextFile(f); (0, eval)(src + "\n//# sourceURL=" + f); }
const T = window.TinyNN, G = window.TinyNN.gseries, S = window.SpelledKeys;
const RNG = window.__tinyNN.makeRng, F = globalThis.Forensics;
const RUN_ID = "2026-11-17-D1a-smoke";
const VERSION = "d1a-smoke-v1";
const BUDGET_MS = (globalThis.D1A_BUDGET_MS != null) ? globalThis.D1A_BUDGET_MS : 25*60*1000;
const T0wall = Date.now();
const timeLeft = () => (Date.now() - T0wall) < BUDGET_MS;
// ---- frozen D1a constants ----
const PART_SEED = 7000, POOL_SEED = 7001, KA_SEED = 7101, HUA_SEED = 7100;
const OPTS = {vocab: 19, classes: 4, h: 48, m: 96, d: 16, arch: "attn"};
const STAGES = [{steps:1500, attnKeep:1.0, softW:1.0, hardW:0},{steps:1500, attnKeep:0.0, softW:0.0, hardW:0}];
const TUTOR_A_STAGES = [{steps:1500, attnKeep:1.0, softW:0, hardW:1.0}];
const TUTOR_B_STAGES = [{steps:3000, attnKeep:1.0, softW:0, hardW:1.0}];
const TUTOR_A_BLOB = "scratch/d1a-tutor-A.json";
const SEEDS = globalThis.D1A_SEEDS || [5201, 5202];
const LEDGER_PATH = "src/evidence/synthesis/d1a-smoke.json";
const TUTOR_BLOB = "scratch/d1a-tutor.json";
const brainBlob = (s) => "scratch/d1a-brain-" + s + ".json";
// ---- spelled attention supervision patch (trainFaded hardcodes atomic) ----
const origAttn = T.attnSupervision;
T.attnSupervision = (ex, fw) => S.attnSupervisionSpelled(ex, fw);
async function sha12(str) {
  const data = new TextEncoder().encode(str);
  const dig = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(dig)).map(b=>b.toString(16).padStart(2,"0")).join("").slice(0,12);
}
function argmax(a){ let bi=0; for(let i=1;i<a.length;i++) if(a[i]>a[bi]) bi=i; return bi; }
function softmax(p){ let m=-1e300; for(const v of p) if(v>m) m=v; const q=p.map(v=>Math.exp(v-m)); const s=q.reduce((a,x)=>a+x,0); return q.map(v=>v/s); }
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
// ---- partition + pool (deterministic) ----
const P = S.partition(PART_SEED);
const train = S.buildPool(POOL_SEED, P.train);
const killA = S.killASpelled(KA_SEED, P.train);
const killHu = S.killHuSpelled(HUA_SEED, P.held);
const lineHash = await sha12(JSON.stringify(killHu.map(e=>e.x)));
const poolHash = await sha12(JSON.stringify(train.map(e=>e.x)));
const selfSrc = await fs.readTextFile("src/tools/d1a-smoke.js");
const builderSrc = await fs.readTextFile("src/tinynn/spelled-keys.js");
const codeFp = await sha12(selfSrc + builderSrc + JSON.stringify({OPTS, STAGES, TUTOR_A_STAGES, TUTOR_B_STAGES, PART_SEED, POOL_SEED, KA_SEED, HUA_SEED}));
const fingerprint = "hu:" + lineHash + "+pool:" + poolHash + "+code:" + codeFp;
// ---- ledger (resume) ----
let ledger = null;
try { ledger = JSON.parse(await fs.readTextFile(LEDGER_PATH)); } catch(e){ ledger = null; }
if (!ledger) {
  ledger = {runId: RUN_ID, fingerprint, version: VERSION,
    design: "D1a fixed-3 2-brain smoke (curriculum hint tutor: short-only 1500 -> full-pool 3000, hard+spelled-attn; students trainFaded replica; seeds 5201-5202)",
    note512: "8^3=512 fixed-3 keys (spec 64-combo text corrected, design unchanged); partition 384 train / 128 held",
    examIdentity: {killHuSeed: HUA_SEED, killASeed: KA_SEED, n: 200, lineHash}, perBrain: [], controls: null, tutor: null, verdict: null};
} else {
  if (ledger.runId !== RUN_ID) throw new Error("ledger runId mismatch");
  if (ledger.fingerprint !== fingerprint) throw new Error("fingerprint mismatch (driver/builder changed — do not merge)");
}
// ---- tutor (resume via blob) ----
let tutor = null, tutorCache = null;
async function loadTutorBlob() {
  try { const b = JSON.parse(await fs.readTextFile(TUTOR_BLOB)); tutor = G.loadModel(b); return true; }
  catch(e){ return false; }
}
if (!ledger.tutor) {
  if (!await loadTutorBlob()) {
    const shortPool = train.filter(e=>e.form==="short");
    // Phase A: short-only from fresh init (resume via TUTOR_A_BLOB)
    let tutorA = null;
    try { tutorA = G.loadModel(JSON.parse(await fs.readTextFile(TUTOR_A_BLOB))); }
    catch(e) {
      if (!timeLeft()) return {status: "BUDGET-OUT", step: "tutor-A"};
      const tm = T.makeModel(RNG(7001*1000+21+3), OPTS);
      const resA = await G.trainFaded({model: tm, tutor: null, train: shortPool, stages: TUTOR_A_STAGES, seed: 7001*100+30+3});
      await fs.writeTextFile(TUTOR_A_BLOB, JSON.stringify(G.saveModel(resA.model, OPTS)));
      tutorA = resA.model;
    }
    // Phase B: full pool from A (fresh Adam per generation spec)
    if (!timeLeft()) return {status: "BUDGET-OUT", step: "tutor-B"};
    const resB = await G.trainFaded({model: tutorA, tutor: null, train, stages: TUTOR_B_STAGES, seed: 7001*100+31+3});
    await fs.writeTextFile(TUTOR_BLOB, JSON.stringify(G.saveModel(resB.model, OPTS)));
    tutor = resB.model;
  }
  // gate: killA-spelled >= 0.95
  let right = 0;
  for (const ex of killA) { const fw = tutor.forward(ex.x, 4); if (argmax(Array.from(fw.logits)) === ex.y) right++; }
  const acc = right / killA.length;
  ledger.tutor = {killAAcc: +acc.toFixed(4), gate: acc >= 0.95 ? "PASS" : "HALT"};
  await fs.writeTextFile(LEDGER_PATH, JSON.stringify(ledger));
  if (acc < 0.95) { T.attnSupervision = origAttn; return {status: "HALT", reason: "tutor-gate", killAAcc: acc}; }
} else {
  await loadTutorBlob();
  if (ledger.tutor.gate !== "PASS") { T.attnSupervision = origAttn; return {status: "HALT", reason: "tutor-gate-filed"}; }
}
tutorCache = await G.cacheTutor(tutor, train);
// ---- students ----
const done = new Set(ledger.perBrain.map(r=>r.seed));
for (const seed of SEEDS) {
  if (done.has(seed)) continue;
  if (!timeLeft()) { T.attnSupervision = origAttn; return {status: "BUDGET-OUT", step: "student-"+seed, done: ledger.perBrain.map(r=>r.seed)}; }
  const model = T.makeModel(RNG(seed*1000+21+3), OPTS);
  const res = await G.trainFaded({model, tutor, train, stages: STAGES, tutorCache, seed: seed*100+30+3});
  await fs.writeTextFile(brainBlob(seed), JSON.stringify(G.saveModel(res.model, OPTS)));
  // eval killHu + suspicion + short/long split
  const sc=[], lb=[], msC=[], msI=[], ents=[], shortSc=[], shortLb=[], longSc=[], longLb=[];
  let acc=0;
  for (const ex of killHu) {
    const fw = res.model.forward(ex.x, 4);
    const pr = softmax(Array.from(fw.logits));
    let top=0; for(let k=1;k<pr.length;k++) if(pr[k]>pr[top]) top=k;
    const c = top===ex.y?1:0; acc+=c;
    const susp = 1-pr[top];
    sc.push(susp); lb.push(c===0?1:0); (c?msC:msI).push(susp);
    let e=0; for(const q of pr) e-=q*Math.log(q+1e-300);
    ents.push(e);
    if (ex.form==="short") { shortSc.push(susp); shortLb.push(c===0?1:0); } else { longSc.push(susp); longLb.push(c===0?1:0); }
  }
  const mean=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:null;
  const f4=v=>v===null?null:+v.toFixed(4);
  // swap-values control (message-swap analog): swap values of first two pairs; y follows if queried pair swapped
  let swRight=0, swN=0;
  for (const ex of killHu) {
    const nP=(ex.x.length-5)/5; if(nP<2) continue;
    const x2=ex.x.slice(), q0=ex.x[ex.x.length-5], q1=ex.x[ex.x.length-4], q2=ex.x[ex.x.length-3];
    const t=x2[4]; x2[4]=x2[9]; x2[9]=t; // swap values pair0/pair1
    let y2=ex.y;
    const qIn0=(q0===ex.x[0]&&q1===ex.x[1]&&q2===ex.x[2]), qIn1=(q0===ex.x[5]&&q1===ex.x[6]&&q2===ex.x[7]);
    if(qIn0) y2=(x2[4]-4); else if(qIn1) y2=(x2[9]-4);
    const fw=res.model.forward(x2, 4);
    if(argmax(Array.from(fw.logits))===y2) swRight++;
    swN++;
  }
  // random-key control: query key absent from line -> report mean top1 (confidence, no acc)
  let rkTop=0; const rkN=50;
  for(let i=0;i<rkN;i++){
    const ex=killHu[i], present=new Set();
    const nP=(ex.x.length-5)/5;
    for(let p=0;p<nP;p++) present.add([ex.x[p*5],ex.x[p*5+1],ex.x[p*5+2]].join(","));
    let ak=P.held[(i*7)%P.held.length], guard=0;
    while(present.has(ak.join(","))&&guard++<200) ak=P.held[(i*7+guard)%P.held.length];
    const x2=ex.x.slice(); x2[x2.length-5]=ak[0]; x2[x2.length-4]=ak[1]; x2[x2.length-3]=ak[2];
    const fw=res.model.forward(x2, 4), pr=softmax(Array.from(fw.logits));
    rkTop+=Math.max.apply(null,pr);
  }
  const row={seed, acc:+(acc/killHu.length).toFixed(4), nErr:killHu.length-acc,
    suspAUC:(()=>{const v=auc(sc,lb);return v===null?null:+v.toFixed(4);})(),
    shortAcc:+((shortLb.length-shortLb.reduce((a,b)=>a+b,0))/shortLb.length).toFixed(4),
    longAcc:+((longLb.length-longLb.reduce((a,b)=>a+b,0))/longLb.length).toFixed(4),
    meanSuspCorrect:f4(mean(msC)), meanSuspIncorrect:f4(mean(msI)), meanEntropy:f4(mean(ents)),
    swapAcc:+(swRight/Math.max(1,swN)).toFixed(4), randomKeyMeanTop1:+(rkTop/rkN).toFixed(4)};
  ledger.perBrain.push(row);
  await fs.writeTextFile(LEDGER_PATH, JSON.stringify(ledger));
}
T.attnSupervision = origAttn;
return {status: "SMOKE-DONE", perBrain: ledger.perBrain.map(r=>({seed:r.seed, acc:r.acc, suspAUC:r.suspAUC, short:r.shortAcc, long:r.longAcc, swap:r.swapAcc, rkTop:r.randomKeyMeanTop1}))};
}
