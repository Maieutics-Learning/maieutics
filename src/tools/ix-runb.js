// Run B: re-specified switch (cluster bootstrap) + A-arm readings (quarantined).
// Loads saved A/S probe nets (line-rows only, no full parse) + brain blobs.
// NO retraining. Writes scratch/ix-runb.json.
async function __runb_main() {
globalThis.window = globalThis;
const ORDER = ["src/tinynn/nn.js","src/tinynn/seeded.js","src/tinynn/tasks.js","src/tinynn/train.js","src/tinynn/pcgrad.js","src/tinynn/evo.js","src/tinynn/gseries.js"];
for (const f of ORDER) { const src = await fs.readTextFile(f); (0, eval)(src + "\n//# sourceURL=" + f); }
const G = window.TinyNN.gseries, RNG = window.__tinyNN.makeRng;
const R = G.EVAL_R, D = 30100, L = 20;
const TRAIN = []; for (let s = 5002; s <= 5016; s++) TRAIN.push(s);
const PSEEDS = [1,2,3,4,5], N = TRAIN.length;

// ---- fast AUC (Mann-Whitney, tie-averaged) ----
function auc(scores, labels) {
  const n = scores.length;
  const idx = new Array(n);
  for (let i = 0; i < n; i++) idx[i] = i;
  idx.sort((a,b) => scores[a] - scores[b]);
  let n1 = 0; for (let i = 0; i < n; i++) if (labels[i] === 1) n1++;
  const n0 = n - n1;
  if (!n0 || !n1) return null;
  let rankSum = 0, i = 0;
  while (i < n) {
    let j = i;
    while (j + 1 < n && scores[idx[j+1]] === scores[idx[i]]) j++;
    const avgRank = (i + 1 + j + 1) / 2; // 1-based
    for (let k = i; k <= j; k++) if (labels[idx[k]] === 1) rankSum += avgRank;
    i = j + 1;
  }
  return (rankSum - n1*(n1+1)/2) / (n0*n1);
}
function quant(ds,q){ const s = ds.slice().sort((a,b)=>a-b); return s[Math.min(s.length-1, Math.floor(q*s.length))]; }

// ---- exams + brain correctness rows ----
const exams = G.buildExams(7008);
const HUx = exams.killHu.map(e => Array.from(e.x));
const HDx = exams.killHd.map(e => Array.from(e.x));
const nPer = HUx.length;
const ROWHu = {}, ROWHd = {};
for (const seed of TRAIN) {
  const blob = JSON.parse(await fs.readTextFile("scratch/ix-final-" + seed + ".json"));
  const model = G.loadModel(blob);
  const rh = [], rn = [];
  for (const ex of exams.killHd) {
    const fw = model.forward(ex.x, R); const lg = Array.from(fw.logits);
    let b = 0; for (let k = 1; k < lg.length; k++) if (lg[k] > lg[b]) b = k;
    rn.push(b === ex.y ? 1 : 0);
  }
  for (const ex of exams.killHu) {
    const fw = model.forward(ex.x, R); const lg = Array.from(fw.logits);
    let b = 0; for (let k = 1; k < lg.length; k++) if (lg[k] > lg[b]) b = k;
    rh.push(b === ex.y ? 1 : 0);
  }
  ROWHu[seed] = rh; ROWHd[seed] = rn;
}
const yHu = []; for (const s of TRAIN) for (let li = 0; li < nPer; li++) yHu.push(ROWHu[s][li] === 0 ? 1 : 0);
const yHd = []; for (const s of TRAIN) for (let li = 0; li < nPer; li++) yHd.push(ROWHd[s][li] === 0 ? 1 : 0);

// ---- load line-nets (tail-parse, no full JSON.parse) ----
async function loadLineNet(tag, pseed) {
  const txt = await fs.readTextFile("scratch/ix-ablate-" + tag + "-P" + pseed + ".json");
  const w1Key = '"W1":[', b1Key = '"b1":[';
  const w1Start = txt.indexOf(w1Key);
  const b1Pos = txt.indexOf(b1Key, w1Start);
  const w1End = txt.lastIndexOf(']', b1Pos);
  const tailStart = Math.max(w1Start + w1Key.length, w1End - 100000);
  let tail = txt.slice(tailStart, w1End);
  let toks = tail.split(',');
  if (tailStart > w1Start + w1Key.length) toks = toks.slice(1);
  const lineToks = toks.slice(-(L*64));
  if (lineToks.length !== L*64) throw new Error(tag+" P"+pseed+" W1 tail len "+lineToks.length);
  const lineW1 = Float64Array.from(lineToks.map(Number));
  const b1Start = b1Pos + b1Key.length, b1End = txt.indexOf(']', b1Start);
  const b1 = Float64Array.from(txt.slice(b1Start, b1End).split(',').map(Number));
  const w2pKey = '"W2p":[', w2pPos = txt.indexOf(w2pKey, b1End);
  const w2pStart = w2pPos + w2pKey.length, w2pEnd = txt.indexOf(']', w2pStart);
  const W2p = Float64Array.from(txt.slice(w2pStart, w2pEnd).split(',').map(Number));
  const b2pKey = '"b2p":[', b2pPos = txt.indexOf(b2pKey, w2pEnd);
  const b2pStart = b2pPos + b2pKey.length, b2pEnd = txt.indexOf(']', b2pStart);
  const b2p = Float64Array.from(txt.slice(b2pStart, b2pEnd).split(',').map(Number));
  let grad = null;
  const gm = txt.match(/"gradNorms":\{"w":([0-9.eE+-]+),"l":([0-9.eE+-]+),"b":([0-9.eE+-]+)\}/);
  if (gm) grad = {w:+gm[1], l:+gm[2], b:+gm[3]};
  return {lineW1, b1, W2p, b2p, grad};
}
function lineP(net, x) {
  let zp = net.b2p[0];
  for (let j = 0; j < 64; j++) {
    let a = net.b1[j];
    for (let k = 0; k < L; k++) a += (x[k]/8) * net.lineW1[k*64+j];
    if (a > 0) zp += a * net.W2p[j];
  }
  return 1/(1+Math.exp(-zp));
}
async function medLineScores(tag, lines) {
  const perNet = [];
  const grads = {};
  for (const p of PSEEDS) {
    const net = await loadLineNet(tag, p);
    grads["P"+p] = net.grad;
    perNet.push(lines.map(x => lineP(net, x)));
  }
  const med = lines.map((_, li) => {
    const v = perNet.map(r => r[li]).sort((a,b)=>a-b);
    return v[2];
  });
  return {med, grads};
}
const Ahu = await medLineScores("A", HUx);
const Ahd = await medLineScores("A", HDx);
const Shu = await medLineScores("S", HUx);

// expand per-line medians to pooled (brain,line) rows
function expand(med) { const sc = []; for (let b = 0; b < N; b++) for (let li = 0; li < nPer; li++) sc.push(1 - med[li]); return sc; }
const doubtA = expand(Ahu.med);
const doubtAtr = expand(Ahd.med);
const doubtS = expand(Shu.med);

// pooled AUCs
const pooledA = auc(doubtA, yHu);
const trainA = auc(doubtAtr, yHd);
const pooledS = auc(doubtS, yHu);

// ---- A0 per-point fold-averaged (driver-identical) ----
function a0perPoint(K, seed) {
  const rng = RNG(seed);
  const acc = {}, cnt = {};
  for (let k = 0; k < K; k++) {
    const perm = TRAIN.slice();
    for (let i = perm.length-1; i > 0; i--) { const j = Math.floor(rng.uniform(0,1)*(i+1)); const t = perm[i]; perm[i] = perm[j]; perm[j] = t; }
    const fA = perm.slice(0,8), fB = perm.slice(8);
    for (const [fit, score] of [[fA,fB],[fB,fA]]) {
      const means = new Array(nPer).fill(0);
      for (const s of fit) for (let li = 0; li < nPer; li++) means[li] += ROWHu[s][li];
      for (let li = 0; li < nPer; li++) means[li] /= fit.length;
      for (const s of score) for (let li = 0; li < nPer; li++) {
        const key = s+":"+li;
        acc[key] = (acc[key]||0) + (1-means[li]); cnt[key] = (cnt[key]||0)+1;
      }
    }
  }
  const scores = [], labels = [];
  for (const s of TRAIN) for (let li = 0; li < nPer; li++) { const k = s+":"+li; scores.push(acc[k]/cnt[k]); labels.push(ROWHu[s][li]===0?1:0); }
  return {scores, labels};
}
const A0 = a0perPoint(25, 424242);
const A0b = a0perPoint(100, 777001);
const pooledA0 = auc(A0.scores, A0.labels);
const pooledA0b = auc(A0b.scores, A0b.labels);

// ---- per-brain + LOO ----
const perBrain = [];
for (let b = 0; b < N; b++) {
  const sl = doubtA.slice(b*nPer,(b+1)*nPer), lb = yHu.slice(b*nPer,(b+1)*nPer);
  const s0 = A0.scores.slice(b*nPer,(b+1)*nPer);
  const aa = auc(sl,lb), a0 = auc(s0,lb);
  perBrain.push({seed:TRAIN[b], aucA:aa===null?null:+aa.toFixed(4), aucA0:a0===null?null:+a0.toFixed(4),
    delta:(aa===null||a0===null)?null:+(aa-a0).toFixed(4)});
}
function pooledDrop(drop){
  const sl=[],lb=[],s0=[];
  for (let b = 0; b < N; b++) { if (b===drop) continue;
    for (let i = 0; i < nPer; i++) { sl.push(doubtA[b*nPer+i]); lb.push(yHu[b*nPer+i]); s0.push(A0.scores[b*nPer+i]); } }
  const va=auc(sl,lb), vb=auc(s0,lb);
  return (va===null||vb===null)?null:+(va-vb).toFixed(4);
}
const loo = TRAIN.map((s,b)=>({dropped:s, delta:pooledDrop(b)}));

// ---- paired line-bootstrap delta (original, 500 reps) ----
function bootDeltaLine(reps, seed){
  const n = yHu.length, rng = RNG(seed), ds = [];
  const all = []; for (let i=0;i<n;i++) all.push(i);
  const dOf = (idx)=>{ const va=auc(idx.map(i=>doubtA[i]),idx.map(i=>yHu[i])); const vb=auc(idx.map(i=>A0.scores[i]),idx.map(i=>yHu[i])); return (va===null||vb===null)?null:va-vb; };
  const base = dOf(all);
  for (let k=0;k<reps;k++){ const idx=[]; for(let i=0;i<n;i++) idx.push(Math.floor(rng.uniform(0,1)*n)); const d=dOf(idx); if(d!==null) ds.push(d); }
  ds.sort((a,b)=>a-b);
  return {base:base===null?null:+base.toFixed(4), lo:+quant(ds,0.025).toFixed(4), hi:+quant(ds,0.975).toFixed(4)};
}
const dLine = bootDeltaLine(500, 31337);

// ---- cluster CIs (resample BRAINS, 2000 reps) ----
function clusterAUC(perBrainScores, perBrainLabels, reps, seed){
  const rng = RNG(seed), ds = [];
  for (let k=0;k<reps;k++){
    const pick=[]; for(let i=0;i<N;i++) pick.push(Math.floor(rng.uniform(0,1)*N));
    const sc=[],lb=[];
    for (const b of pick) for(let li=0;li<nPer;li++){ sc.push(perBrainScores[b][li]); lb.push(perBrainLabels[b][li]); }
    const v=auc(sc,lb); if(v!==null) ds.push(v);
  }
  ds.sort((a,b)=>a-b);
  return {lo:+quant(ds,0.025).toFixed(4), hi:+quant(ds,0.975).toFixed(4)};
}
function perBrainSplit(pooled){ const o=[]; for(let b=0;b<N;b++) o.push(pooled.slice(b*nPer,(b+1)*nPer)); return o; }
const labSplit = perBrainSplit(yHu);
const ciA = clusterAUC(perBrainSplit(doubtA), labSplit, 2000, 414141);
const ciS = clusterAUC(perBrainSplit(doubtS), labSplit, 2000, 424242);
// cluster delta A-A0
function clusterDelta(reps, seed){
  const rng=RNG(seed), ds=[];
  const sA=perBrainSplit(doubtA), s0=perBrainSplit(A0.scores);
  for(let k=0;k<reps;k++){
    const pick=[]; for(let i=0;i<N;i++) pick.push(Math.floor(rng.uniform(0,1)*N));
    const a=[],b=[],l=[];
    for(const x of pick) for(let li=0;li<nPer;li++){ a.push(sA[x][li]); b.push(s0[x][li]); l.push(labSplit[x][li]); }
    const va=auc(a,l), vb=auc(b,l);
    if(va!==null&&vb!==null) ds.push(va-vb);
  }
  ds.sort((x,y)=>x-y);
  return {lo:+quant(ds,0.025).toFixed(4), hi:+quant(ds,0.975).toFixed(4)};
}
const dCl = clusterDelta(2000, 434343);

// ---- activation log (A nets, Hu lines) ----
const actLog = [];
{
  const nets = [];
  for (const p of PSEEDS) nets.push(await loadLineNet("A", p));
  for (const net of nets) {
    let mn=Infinity, mx=-Infinity; const pres=[]; let dead=0, tot=0;
    for (const x of HUx) {
      for (let j=0;j<64;j++){
        let a=net.b1[j];
        for(let k=0;k<L;k++) a+=(x[k]/8)*net.lineW1[k*64+j];
        pres.push(a); tot++;
        const h=a>0?a:0;
        if(h<mn)mn=h; if(h>mx)mx=h;
        if(h===0)dead++;
      }
    }
    let m=0; for(const v of pres)m+=v; m/=pres.length;
    let va=0; for(const v of pres)va+=(v-m)*(v-m); va/=pres.length;
    actLog.push({postMin:mn, postMax:mx, preVar:+va.toFixed(6), deadFrac:+(dead/tot).toFixed(4)});
  }
}

// ---- B thermometer (cite recalibration, no recompute) ----
const rec = JSON.parse(await fs.readTextFile("scratch/ix-recalib.json"));

// ---- re-specified switch verdict ----
const sCovers = ciS.lo <= 0.5 && ciS.hi >= 0.5;
const bCovers = rec.seed555.BclusterCI95[0] <= 0.5 && rec.seed555.BclusterCI95[1] >= 0.5;

const out = {
  diagnostic: "run B: re-specified switch (cluster bootstrap) + A-arm readings (quarantined; user-authorized 2026-11-16)",
  arms: {
    A: {pooledNovel:+pooledA.toFixed(4), trainAUC:+trainA.toFixed(4), clusterCI95:[ciA.lo,ciA.hi]},
    A0: {primary:+pooledA0.toFixed(4), sensitivity:+pooledA0b.toFixed(4)},
    S_shuffleNull: {pooled:+pooledS.toFixed(4), clusterCI95:[ciS.lo,ciS.hi], oldLineCI997:[0.4501,0.513]}
  },
  delta: {base:dLine.base, lineCI95:[dLine.lo,dLine.hi], clusterCI95:[dCl.lo,dCl.hi]},
  perBrain, loo,
  gradNorms: {A: Ahu.grads, S: Shu.grads},
  actLog,
  respecifiedSwitch: {
    S_clusterCovers05: sCovers, Bperm_clusterCovers05: bCovers,
    verdict: (sCovers && bCovers) ? "CLEAR (would NOT halt; old halt was false trip)" : "TRIP (honest CI still excludes 0.5)"
  },
  thermometerCaveat: {trueB:rec.trueAUC.B, trueBclusterCI95:rec.trueAUC.BclusterCI95, spearmanB:rec.spearmanB},
  readings: null
};
const d = dCl, inNoise = d.lo <= 0 && d.hi >= 0;
const aCol = ciA.lo <= 0.5 && ciA.hi >= 0.5;
if (aCol) out.readings = "world-3 (both collapse)";
else if (inNoise) out.readings = "world-1 (shared difficulty explains W1; weights decorative)";
else out.readings = dCl.lo > 0 ? "world-2 (weights contributed)" : "world-2-negative (A underperforms shared difficulty)";
await fs.writeFile("scratch/ix-runb.json", new TextEncoder().encode(JSON.stringify(out)));
return {pooledA:+pooledA.toFixed(4), ciA:[ciA.lo,ciA.hi], pooledA0:+pooledA0.toFixed(4),
  deltaBase:dLine.base, deltaCluster:[dCl.lo,dCl.hi], pooledS:+pooledS.toFixed(4), ciS:[ciS.lo,ciS.hi],
  switchVerdict: out.respecifiedSwitch.verdict, readings: out.readings};
}
