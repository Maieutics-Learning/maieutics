// Phase 1.d.iii dump driver (FROZEN prereg v1.0: src/evidence/synthesis/phase-1diii-prereg.md).
// Retrain-then-dump, IN-BROWSER/WORKER ONLY (same engine as Stage 1/1.b — Node drifts).
// Per subject (seed, arm): load filed T0 tutor blob, retrain with the EXACT
// 1.b recipe (init index follows wave1 ARM order: staged:0, constant:2,
// instdrop:3), replication-gate on filed ev (bit-exact required), then
// instrumented forward dumps on filed killA + killHd (target-first).
// Resume-safe via scratch/p1diii-partial.json.
// Ledger -> src/evidence/synthesis/phase-1diii/phase-1diii-results.json
async function main() {
globalThis.window = globalThis;
const ORDER = ["src/tinynn/nn.js","src/tinynn/seeded.js","src/tinynn/tasks.js","src/tinynn/train.js","src/tinynn/pcgrad.js","src/tinynn/evo.js","src/tinynn/gseries.js"];
for (const f of ORDER) { const src = await fs.readTextFile(f); (0, eval)(src + "\n//# sourceURL=" + f); }
const T = window.TinyNN, G = window.TinyNN.gseries, RNG = window.__tinyNN.makeRng;
const OPTS = {vocab:9, classes:4, h:48, m:96, d:16, arch:"attn"};
const STAGES = {
  staged: [{steps:1000, attnKeep:1.0, softW:1.0, hardW:0},{steps:1000, attnKeep:0.5, softW:1.0, hardW:0},{steps:1000, attnKeep:0.0, softW:1.0, hardW:0}],
  constant: [{steps:3000, attnKeep:1.0, softW:1.0, hardW:0}],
  instdrop: [{steps:1500, attnKeep:1.0, softW:1.0, hardW:0},{steps:1500, attnKeep:0.0, softW:0.0, hardW:0}],
};
const AIDX = {staged:0, constant:2, instdrop:3}; // wave1-driver ARM order index
const SUBJECTS = [[311,"staged"],[314,"staged"],[315,"staged"],[316,"staged"],[312,"constant"],[317,"constant"],[313,"instdrop"],[318,"instdrop"]];
const R = G.EVAL_R;
const filed = JSON.parse(await fs.readTextFile("src/evidence/synthesis/phase-1a/phase-1a-results.json"));
let partial = {};
try { partial = JSON.parse(await fs.readTextFile("scratch/p1diii-partial.json")); } catch(e) {}
const train = G.buildPool(7), filedExams = G.buildExams(7008);
const DUMPS = {killA: filedExams.killA, killHd: filedExams.killHd};
function softmax(v) {
  let m = -1e300;
  for (let i = 0; i < v.length; i++) if (v[i] > m) m = v[i];
  const p = new Array(v.length); let s = 0;
  for (let i = 0; i < v.length; i++) { p[i] = Math.exp(v[i] - m); s += p[i]; }
  for (let i = 0; i < v.length; i++) p[i] /= s;
  return p;
}
function argmax(a) { let bi = 0; for (let i = 1; i < a.length; i++) if (a[i] > bi) bi = i; return bi; }
// supervision-target index (mirrors attnSupervision): value token of queried key
function valuePos(x, n) {
  const qk = x[x.length - 2];
  let idx = -1;
  for (let t = 0; t < x.length - 2; t += 2) { if (x[t] === qk) { idx = t + 1; break; } }
  if (idx < 0 || idx >= n) return -1;
  return idx;
}
function dumpExam(model, data) {
  const rows = [];
  for (let i = 0; i < data.length; i++) {
    const ex = data[i], fw = model.forward(ex.x, R);
    const p = softmax(Array.from(fw.logits));
    let top = 0;
    for (let c = 1; c < p.length; c++) if (p[c] > p[top]) top = c;
    const sorted = p.slice().sort((a, b) => b - a);
    const margin = sorted[0] - sorted[1];
    let ent = 0;
    for (let c = 0; c < p.length; c++) if (p[c] > 0) ent -= p[c] * Math.log(p[c]);
    const correct = top === ex.y ? 1 : 0;
    const steps = fw.cache.steps, last = steps[steps.length - 1];
    let ptr = -1, ptrHit = -1, wTarget = null, attnEnt = null;
    if (last && last.isDepth && last.att && last.att.w) {
      const w = Array.from(last.att.w), n = last.att.n;
      ptr = argmax(w);
      const vp = valuePos(ex.x, n);
      ptrHit = vp < 0 ? -1 : (ptr === vp ? 1 : 0);
      wTarget = vp < 0 ? null : w[vp];
      attnEnt = 0;
      for (let j = 0; j < w.length; j++) if (w[j] > 0) attnEnt -= w[j] * Math.log(w[j]);
    }
    rows.push([correct, +p[top].toFixed(6), +margin.toFixed(6), +ent.toFixed(6), ptrHit, wTarget === null ? null : +wTarget.toFixed(6), attnEnt === null ? null : +attnEnt.toFixed(6)]);
  }
  return rows;
}
function agg(rows) {
  const n = rows.length;
  let nC = 0, ptrHitC = 0, ptrHitN = 0, t1c = 0, t1e = 0, nE = 0, ge09 = 0, wC = 0, wCn = 0, wE = 0, wEn = 0, aE = 0;
  for (const r of rows) {
    const [correct, top1, , , ptrHit, wT] = [r[0], r[1], r[2], r[3], r[4], r[5]];
    if (correct) { nC++; t1c += top1; if (ptrHit >= 0) { ptrHitN++; if (ptrHit) ptrHitC++; } if (wT !== null) { wC += wT; wCn++; } }
    else { nE++; t1e += top1; if (top1 >= 0.9) ge09++; if (wT !== null) { wE += wT; wEn++; } }
    aE += r[6] === null ? 0 : r[6];
  }
  const div = (a, b) => b ? +(a / b).toFixed(4) : null;
  return { n, acc: div(nC, n),
    ptrHitRateGivenCorrect: div(ptrHitC, ptrHitN), ptrN: ptrHitN,
    meanTop1Correct: div(t1c, nC), meanTop1Incorrect: div(t1e, nE),
    calibDelta: (nC && nE) ? +((t1c / nC) - (t1e / nE)).toFixed(4) : null,
    meanTop1OnErrors: div(t1e, nE), nErrors: nE, pctErrorsGe09: div(ge09, nE),
    meanWTargetCorrect: div(wC, wCn), meanWTargetIncorrect: div(wE, wEn),
    meanAttnEntropy: div(aE, n) };
}
const out = {prereg:"phase-1diii v1.0 COUNTERSIGNED FROZEN", test:"1diii-dump", subjects:{}};
for (const [seed, arm] of SUBJECTS) {
  const key = seed+"-"+arm;
  if (!partial[key] || !partial[key].dumps) {
    const tutor = G.loadModel(JSON.parse(await fs.readTextFile("scratch/p1a-t0-"+seed+".json")));
    const tCache = await G.cacheTutor(tutor, train);
    const a = AIDX[arm];
    const model = T.makeModel(RNG(seed*1000+21+a), OPTS);
    const t0 = Date.now();
    const res = await G.trainFaded({model, tutor, train, stages:STAGES[arm], tutorCache:tCache, seed:seed*100+30+a});
    const ev0 = G.evalSuite(res.model, filedExams);
    const f = filed.armsDetail[arm][String(seed)].ev;
    const match = Object.keys(f).every(k => ev0[k] === f[k]);
    let dumps = null, forwardStable = null;
    if (match) {
      const d1 = {killA: dumpExam(res.model, DUMPS.killA), killHd: dumpExam(res.model, DUMPS.killHd)};
      const d2 = {killA: dumpExam(res.model, DUMPS.killA), killHd: dumpExam(res.model, DUMPS.killHd)};
      forwardStable = JSON.stringify(d1) === JSON.stringify(d2);
      dumps = forwardStable ? d1 : null;
    }
    partial[key] = {ev0, replicationMatch: match, forwardStable, dumps,
      secs:+((Date.now()-t0)/1000).toFixed(1)};
    await fs.writeTextFile("scratch/p1diii-partial.json", JSON.stringify(partial));
  }
  const S = partial[key];
  const aggs = S.dumps ? {killA: agg(S.dumps.killA), killHd: agg(S.dumps.killHd)} : null;
  out.subjects[key] = {replicationMatch: S.replicationMatch, forwardStable: S.forwardStable, secs: S.secs, aggs,
    rows: S.dumps}; // rows kept on-ledger: readouts are the evidence
}
// pooled mechanical rules (prereg A/B/C)
function poolMean(fn) {
  let s = 0, n = 0;
  for (const k of Object.keys(out.subjects)) {
    const a = out.subjects[k].aggs; if (!a) continue;
    for (const E of ["killA", "killHd"]) { const v = fn(a[E]); if (v !== null && v !== undefined) { s += v; n++; } }
  }
  return n ? +(s / n).toFixed(4) : null;
}
function poolRate(hitKey, nKey, exam) {
  let h = 0, n = 0;
  for (const k of Object.keys(out.subjects)) {
    const a = out.subjects[k].aggs; if (!a || !a[exam]) continue;
    // recompute from rows for exactness
    for (const r of out.subjects[k].rows[exam]) {
      if (r[0] === 1 && r[4] >= 0) { n++; if (r[4] === 1) h++; }
    }
  }
  return {rate: n ? +(h / n).toFixed(4) : null, h, n};
}
const ptrKillA = poolRate(null, null, "killA"), ptrKillHd = poolRate(null, null, "killHd");
const ruleA = ptrKillA.rate === null ? {outcome:"NO-DATA"} :
  ptrKillA.rate >= 0.90 ? {outcome:"ADMISSIBLE"} :
  ptrKillA.rate >= 0.70 ? {outcome:"WEAK"} : {outcome:"DECORATIVE-ABANDON"};
// calibration delta pooled over lines (exact, not mean-of-means)
let tc = 0, nc = 0, te = 0, ne = 0;
for (const k of Object.keys(out.subjects)) {
  const rows = out.subjects[k].rows; if (!rows) continue;
  for (const E of ["killA", "killHd"]) for (const r of rows[E]) {
    if (r[0] === 1) { tc += r[1]; nc++; } else { te += r[1]; ne++; }
  }
}
const calibDelta = (nc && ne) ? +((tc / nc) - (te / ne)).toFixed(4) : null;
const ruleB = calibDelta === null ? {outcome:"NO-DATA"} :
  calibDelta >= 0.20 ? {outcome:"SEPARATED"} : {outcome:"UNSEPARATED"};
// overconfidence disclosure (mandatory reporting, no gate)
let oe = 0, one = 0, ge = 0;
const perSubject = {};
for (const k of Object.keys(out.subjects)) {
  const rows = out.subjects[k].rows; if (!rows) continue;
  perSubject[k] = {};
  for (const E of ["killA", "killHd"]) {
    let s = 0, n = 0, g = 0;
    for (const r of rows[E]) if (r[0] === 0) { s += r[1]; n++; if (r[1] >= 0.9) g++; }
    perSubject[k][E] = {meanTop1OnErrors: n ? +(s / n).toFixed(4) : null, nErrors: n, pctGe09: n ? +(g / n).toFixed(4) : null};
    oe += s; one += n; ge += g;
  }
}
const ruleC = {meanTop1OnErrorsPooled: one ? +(oe / one).toFixed(4) : null,
  nErrorsPooled: one, pctErrorsGe09Pooled: one ? +(ge / one).toFixed(4) : null};
const replOk = Object.keys(out.subjects).every(k => out.subjects[k].replicationMatch);
const fwdOk = Object.keys(out.subjects).every(k => out.subjects[k].forwardStable);
out.rules = {replicationGate: replOk, forwardStable: fwdOk,
  ruleA: Object.assign({ptrHitGivenCorrectKillA: ptrKillA, ptrHitGivenCorrectKillHd: ptrKillHd}, ruleA),
  ruleB: Object.assign({calibDeltaPooled: calibDelta}, ruleB),
  ruleC};
out.verdict = (!replOk || !fwdOk) ? "HALT (replication or forward-stability failed — see prereg stop rules)"
  : ruleA.outcome === "DECORATIVE-ABANDON" ? "POINTER-DECORATIVE (defense abandoned in 1.e; disclosure stands)"
  : "DUMP-COMPLETE (pointer " + ruleA.outcome + ", calibration " + ruleB.outcome + "; disclosure filed)";
await fs.writeFile("src/evidence/synthesis/phase-1diii/phase-1diii-results.json", new TextEncoder().encode(JSON.stringify(out,null,1)));
return {replicationGate: replOk, forwardStable: fwdOk, ruleA: out.rules.ruleA.outcome, ruleB: out.rules.ruleB.outcome, ruleC, verdict: out.verdict};
}
return await main();
