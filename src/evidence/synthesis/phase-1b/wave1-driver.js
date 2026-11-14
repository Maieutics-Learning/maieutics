// Phase 1.b wave-1 driver (FROZEN prereg v1.0: src/evidence/synthesis/phase-1b-prereg.md).
// Retrain-then-sweep, IN-BROWSER/WORKER ONLY (same engine as Stage 1 — Node drifts).
// Per subject (seed, arm): load filed T0 tutor blob, retrain student with the
// EXACT wave1-driver recipe (init index follows wave1 ARM order:
// staged:0, attnonly:1, constant:2, instdrop:3), replication-gate on filed
// slot-0 ev (bit-exact required), then eval killA_s + killHd_s for s in 0..8.
// Resume-safe via scratch/p1b-partial.json.
// Ledger -> src/evidence/synthesis/phase-1b/phase-1b-results.json
//   (measurements + the three frozen condition checks, mechanical).
async function main() {
globalThis.window = globalThis;
const ORDER = ["src/tinynn/nn.js","src/tinynn/seeded.js","src/tinynn/tasks.js","src/tinynn/train.js","src/tinynn/pcgrad.js","src/tinynn/evo.js","src/tinynn/gseries.js"];
for (const f of ORDER) { const src = await fs.readTextFile(f); (0, eval)(src + "\n//# sourceURL=" + f); }
const T = window.TinyNN, G = window.TinyNN.gseries, RNG = window.__tinyNN.makeRng;
const AG = T.TASKS.assocG;
const OPTS = {vocab:9, classes:4, h:48, m:96, d:16, arch:"attn"};
const HINTED = [{steps:1200, attnKeep:1.0, softW:0, hardW:1.0}];
const STAGES = {
  staged: [{steps:1000, attnKeep:1.0, softW:1.0, hardW:0},{steps:1000, attnKeep:0.5, softW:1.0, hardW:0},{steps:1000, attnKeep:0.0, softW:1.0, hardW:0}],
  constant: [{steps:3000, attnKeep:1.0, softW:1.0, hardW:0}],
  instdrop: [{steps:1500, attnKeep:1.0, softW:1.0, hardW:0},{steps:1500, attnKeep:0.0, softW:0.0, hardW:0}],
};
const AIDX = {staged:0, constant:2, instdrop:3}; // wave1-driver ARM order index
const SUBJECTS = [[311,"staged"],[314,"staged"],[315,"staged"],[316,"staged"],[312,"constant"],[317,"constant"],[313,"instdrop"],[318,"instdrop"]];

// swept exam: target pair at slot s (0..8), 8 fillers around it, query last.
// Mirrors killMatrix filler logic exactly (comboAllowed on distrSet).
function killSweep(seed, slot, targetSet, distrSet) {
  const rng = RNG(seed), data = [];
  for (let i = 0; i < 200; i++) {
    const pick = targetSet[rng.int(targetSet.length)];
    const tk = Math.floor(pick / 4), tv = pick % 4, x = [];
    for (let s = 0; s <= 8; s++) {
      if (s === slot) { x.push(tk, 4 + tv); continue; }
      let k = rng.int(4);
      while (k === tk) k = rng.int(4);
      const opts = [];
      for (let v = 0; v < 4; v++) if (AG.comboAllowed(k, v, distrSet)) opts.push(v);
      x.push(k, 4 + opts[rng.int(opts.length)]);
    }
    x.push(tk, 8);
    data.push({ x, y: tv });
  }
  return data;
}

const filed = JSON.parse(await fs.readTextFile("src/evidence/synthesis/phase-1a/phase-1a-results.json"));
let partial = {};
try { partial = JSON.parse(await fs.readTextFile("scratch/p1b-partial.json")); } catch(e) {}
const train = G.buildPool(7), filedExams = G.buildExams(7008);
const sweeps = {};
for (let s = 0; s <= 8; s++) {
  sweeps["killA_"+s] = killSweep(9100+s, s, G.ALLOWED12, G.ALLOWED12);
  sweeps["killHd_"+s] = killSweep(9200+s, s, G.DIAG, G.ALLOWED12);
}
const out = {prereg:"phase-1b v1.0 COUNTERSIGNED FROZEN", test:"1b-sweep", subjects:{}};
for (const [seed, arm] of SUBJECTS) {
  const key = seed+"-"+arm;
  if (!partial[key]) {
    const tutor = G.loadModel(JSON.parse(await fs.readTextFile("scratch/p1a-t0-"+seed+".json")));
    const tCache = await G.cacheTutor(tutor, train);
    const a = AIDX[arm];
    const model = T.makeModel(RNG(seed*1000+21+a), OPTS);
    const t0 = Date.now();
    const res = await G.trainFaded({model, tutor, train, stages:STAGES[arm], tutorCache:tCache, seed:seed*100+30+a});
    const ev0 = G.evalSuite(res.model, filedExams);
    // replication gate: full ev must equal filed armsDetail exactly
    const f = filed.armsDetail[arm][String(seed)].ev;
    const keys = Object.keys(f);
    const match = keys.every(k => ev0[k] === f[k]);
    const swept = G.evalSuite(res.model, sweeps);
    partial[key] = {ev0, filedEv: f, replicationMatch: match,
      killA: Array.from({length:9},(_,s)=>swept["killA_"+s]),
      killHd: Array.from({length:9},(_,s)=>swept["killHd_"+s]),
      secs:+((Date.now()-t0)/1000).toFixed(1)};
    await fs.writeTextFile("scratch/p1b-partial.json", JSON.stringify(partial));
  }
  out.subjects[key] = partial[key];
}
// frozen condition checks (mechanical)
function midranks(xs) {
  const idx = xs.map((v,i)=>[v,i]).sort((a,b)=>a[0]-b[0]);
  const r = new Array(xs.length); let i = 0;
  while (i < idx.length) { let j = i; while (j+1 < idx.length && idx[j+1][0] === idx[i][0]) j++;
    const m = (i+j)/2 + 1; for (let k = i; k <= j; k++) r[idx[k][1]] = m; i = j+1; }
  return r;
}
function spearman(xs, ys) {
  const rx = midranks(xs), ry = midranks(ys), n = xs.length;
  const mx = rx.reduce((a,b)=>a+b,0)/n, my = ry.reduce((a,b)=>a+b,0)/n;
  let cov = 0, vx = 0, vy = 0;
  for (let i = 0; i < n; i++) { cov += (rx[i]-mx)*(ry[i]-my); vx += (rx[i]-mx)**2; vy += (ry[i]-my)**2; }
  if (vx === 0 && vy === 0) return {rho: null, degenerate: true};
  if (vx === 0 || vy === 0) return {rho: 0, degenerate: false};
  return {rho: cov/Math.sqrt(vx*vy), degenerate: false};
}
const keys8 = Object.keys(out.subjects);
const poolA = [], poolH = [];
for (const k of keys8) for (let s = 0; s <= 8; s++) { poolA.push(out.subjects[k].killA[s]); poolH.push(out.subjects[k].killHd[s]); }
const sp = spearman(poolA, poolH);
const allPass = poolA.every(v => v === 1) && poolH.every(v => v === 1);
const cond1 = allPass ? {pass:true, note:"degenerate-all-pass (pre-registered rule)"} :
  {rho:+sp.rho.toFixed(4), pass: sp.rho >= 0.95};
let rangeSum = 0, n = 0, worst = null;
for (const k of keys8) for (const K of ["killA","killHd"]) {
  const v = out.subjects[k][K], r = Math.max(...v) - Math.min(...v);
  rangeSum += r; n++;
  v.forEach((acc,s) => { const gap = Math.max(...v) - acc;
    if (!worst || gap > worst.gap) worst = {subject:k, kill:K, slot:s, acc, gap:+gap.toFixed(4)}; });
}
const meanRange = rangeSum/n;
const gateFail = [];
for (const k of keys8) for (let s = 0; s <= 8; s++) {
  if (out.subjects[k].killA[s] < 0.60) gateFail.push({subject:k, kill:"killA", slot:s, acc:out.subjects[k].killA[s]});
  if (out.subjects[k].killHd[s] < 0.55) gateFail.push({subject:k, kill:"killHd", slot:s, acc:out.subjects[k].killHd[s]});
}
const cond2 = {meanRange:+meanRange.toFixed(4), pass: meanRange <= 0.25};
const cond3 = {worst, gateFails: gateFail, pass: worst.gap <= 0.25 && gateFail.length === 0};
const replOk = keys8.every(k => out.subjects[k].replicationMatch);
out.conditions = {replicationGate: replOk, cond1, cond2, cond3};
out.verdict = (replOk && cond1.pass && cond2.pass && cond3.pass)
  ? "POSITION-INDEPENDENT (kills stand, Q2 answered)"
  : "POSITION-SENSITIVE (replace kills with swept variant; Stage 1/2 provisional pending re-gate)";
await fs.writeFile("src/evidence/synthesis/phase-1b/phase-1b-results.json", new TextEncoder().encode(JSON.stringify(out,null,1)));
return {replicationGate: replOk, cond1, cond2, cond3: {worst: cond3.worst, fails: gateFail.length}, verdict: out.verdict};
}
return await main();
