// src/tools/ix-signflip.js — few-shot sign calibration for the frozen ix probe.
// QUARANTINED DIAGNOSTIC (user-authorized 2026-11-16). Zero kill power over the
// frozen ix PILOT-FAIL verdict. Eval-only: NO retraining, NO weight updates.
//
// ARTIFACT MAP (for future tests — everything below is filed, bit-pinned):
// - Probe nets (5, frozen): scratch/ix-probe-P1..P5.json — {pseed, epochsDone:30,
//   loss, net:{W1,b1,W2p,b2p,W2l,b2l}}. MLP 1x64 ReLU, heads P(correct)+loudness.
// - Probe input layout (driver: scratch/ix-pilot.js buildMatrix/probeFwd, prereg
//   v1.5): row = [raw final brain weights (D floats, blob.params order) |
//   line/8 (L floats)], DIN = D+L. D/L read from scratch/ix-partial.json step0.
// - Brains: scratch/ix-final-<seed>.json (G.saveModel blobs, OPTS vocab9/classes4/
//   h48/m96/d16/attn). Train 5002–5016 (5001 dropped); test 5017–5024.
// - Lines: G.buildExams(7008).killHd (200 lines; held-out set = test brains'
//   killHd). Correctness via model.forward(ex.x, G.EVAL_R) + argmax vs ex.y.
// - Filed reference numbers: pooled held-out probe AUC 0.4936, suspicion 0.8598,
//   train 0.809, shuffled-weights null 0.4493 (phase-1dix-verdicts.md).
// - Probe forward (exact copy of ix-pilot.js probeFwd): h=ReLU(b1+W1.x),
//   p=sigmoid(b2p+W2p.h); doubt=1-p; median p over 5 seeds.
//
// TEST: per test brain, split 200 lines into k REF + (200-k) EVAL (seeded
// permutation, REF_SEED). sign = +1 if ref doubt-AUC >= 0.5 else -1. Eval
// scores flipped iff sign<0. Report pooled eval AUC + per-brain table.
// k = 20 primary; 10/40 sensitivity; oracle (sign from all 200) = ceiling.
// VALIDATION GATE: unflipped pooled recompute must equal filed 0.4936 to 4dp,
// else HALT with {halt:true} (method bug, not a result).
async function main() {
globalThis.window = globalThis;
const ORDER = ["src/tinynn/nn.js","src/tinynn/seeded.js","src/tinynn/tasks.js","src/tinynn/train.js","src/tinynn/pcgrad.js","src/tinynn/evo.js","src/tinynn/gseries.js"];
for (const f of ORDER) { const src = await fs.readTextFile(f); (0, eval)(src + "\n//# sourceURL=" + f); }
const G = window.TinyNN.gseries, RNG = window.__tinyNN.makeRng;
const R = G.EVAL_R;
const TEST = []; for (let s = 5017; s <= 5024; s++) TEST.push(s);
const PSEEDS = [1, 2, 3, 4, 5];
const KS = [10, 20, 40], PRIMARY_K = 20, REF_SEED = 9001;
function auc(scores, labels) {
  const idx = scores.map((_, i) => i).sort((a, b) => scores[a] - scores[b]);
  let n1 = 0; for (const l of labels) if (l === 1) n1++;
  const n0 = labels.length - n1;
  if (!n0 || !n1) return null;
  let rs = 0, i = 0;
  while (i < idx.length) {
    let j = i;
    while (j + 1 < idx.length && scores[idx[j+1]] === scores[idx[i]]) j++;
    const avg = (i + 1 + j + 1) / 2;
    for (let k = i; k <= j; k++) if (labels[idx[k]] === 1) rs += avg;
    i = j + 1;
  }
  return (rs - n1 * (n1 + 1) / 2) / (n0 * n1);
}
const partial = JSON.parse(await fs.readTextFile("scratch/ix-partial.json"));
const D = partial.step0.D, L = partial.step0.L, DIN = D + L;
const exams = G.buildExams(7008);
const nPer = exams.killHd.length;
// brain weights (flat, blob.params order) + killHd correctness rows
function softmax(v) {
  const m = Math.max(...v);
  const p = v.map(x => Math.exp(x - m)), s = p.reduce((a, x) => a + x, 0);
  return p.map(x => x / s);
}
function argmax(a) { let b = 0; for (let i = 1; i < a.length; i++) if (a[i] > a[b]) b = i; return b; }
const W = {}, ROWS = {};
for (const seed of TEST) {
  const blob = JSON.parse(await fs.readTextFile("scratch/ix-final-" + seed + ".json"));
  const w = [];
  for (const p of blob.params) for (const v of p.v) w.push(v);
  W[seed] = Float64Array.from(w);
  const model = G.loadModel(blob);
  ROWS[seed] = exams.killHd.map(ex => {
    const fw = model.forward(ex.x, R);
    const lg = Array.from(fw.logits), p = softmax(lg), top = argmax(p);
    return { correct: top === ex.y ? 1 : 0, loud: 1 - p[top], x: Array.from(ex.x) };
  });
}
// probe nets + median P(correct) per (brain,line)
const nets = [];
for (const pseed of PSEEDS) {
  const s = JSON.parse(await fs.readTextFile("scratch/ix-probe-P" + pseed + ".json"));
  nets.push({ W1: Float64Array.from(s.net.W1), b1: Float64Array.from(s.net.b1),
    W2p: Float64Array.from(s.net.W2p), b2p: Float64Array.from(s.net.b2p) });
}
function probeP(net, w, x) {
  const h = new Float64Array(64);
  for (let j = 0; j < 64; j++) {
    let a = net.b1[j];
    for (let i = 0; i < D; i++) a += w[i] * net.W1[i * 64 + j];
    for (let k = 0; k < L; k++) a += (x[k] / 8) * net.W1[(D + k) * 64 + j];
    h[j] = a > 0 ? a : 0;
  }
  let zp = net.b2p[0];
  for (let j = 0; j < 64; j++) zp += h[j] * net.W2p[j];
  return 1 / (1 + Math.exp(-zp));
}
const medP = {}, errLab = {}, susp = {};
for (const seed of TEST) {
  medP[seed] = ROWS[seed].map(row => {
    const v = nets.map(nt => probeP(nt, W[seed], row.x)).sort((a, b) => a - b);
    return v[2];
  });
  errLab[seed] = ROWS[seed].map(r => r.correct === 0 ? 1 : 0);
  susp[seed] = ROWS[seed].map(r => r.loud);
}
// validation gate: unflipped pooled recompute vs filed 0.4936
const allDoubt = [], allLab = [], allSusp = [];
for (const seed of TEST) for (let i = 0; i < nPer; i++) {
  allDoubt.push(1 - medP[seed][i]); allLab.push(errLab[seed][i]); allSusp.push(susp[seed][i]);
}
const recompute = auc(allDoubt, allLab);
const suspFull = auc(allSusp, allLab);
if (recompute === null || Math.abs(recompute - 0.4936) > 0.00005) {
  const out = { diagnostic: "ix sign-flip (quarantined)", halt: true,
    reason: "validation gate: unflipped recompute " + recompute + " != filed 0.4936" };
  await fs.writeFile("src/evidence/synthesis/ix-signflip.json", new TextEncoder().encode(JSON.stringify(out)));
  return out;
}
// ref/eval split (same seeded permutation for all brains; same exam set)
const rng0 = RNG(REF_SEED);
const perm = [...Array(nPer).keys()];
for (let i = perm.length - 1; i > 0; i--) {
  const j = Math.floor(rng0.uniform(0, 1) * (i + 1));
  const t = perm[i]; perm[i] = perm[j]; perm[j] = t;
}
function runK(k) {
  const refIdx = perm.slice(0, k), evalIdx = perm.slice(k);
  const perBrain = [];
  const poolSc = [], poolLb = [], poolSusp = [];
  for (const seed of TEST) {
    const refSc = refIdx.map(i => 1 - medP[seed][i]), refLb = refIdx.map(i => errLab[seed][i]);
    const refAUC = auc(refSc, refLb);
    const sign = (refAUC !== null && refAUC < 0.5) ? -1 : 1;
    const evSc = evalIdx.map(i => { const d = 1 - medP[seed][i]; return sign < 0 ? 1 - d : d; });
    const evLb = evalIdx.map(i => errLab[seed][i]);
    const evAUC = auc(evSc, evLb);
    const evSusp = auc(evalIdx.map(i => susp[seed][i]), evLb);
    perBrain.push({ seed, refAUC: refAUC === null ? null : +refAUC.toFixed(4), sign,
      evalAUC: evAUC === null ? null : +evAUC.toFixed(4), evalSusp: evSusp === null ? null : +evSusp.toFixed(4) });
    for (let q = 0; q < evalIdx.length; q++) {
      poolSc.push(evSc[q]); poolLb.push(evLb[q]); poolSusp.push(susp[seed][evalIdx[q]]);
    }
  }
  return { k, pooledFlipped: +auc(poolSc, poolLb).toFixed(4),
    pooledSuspSameLines: +auc(poolSusp, poolLb).toFixed(4), perBrain };
}
const results = KS.map(runK);
// oracle: sign from ALL 200 lines
{
  const poolSc = [], poolLb = [];
  const perBrain = [];
  for (const seed of TEST) {
    const sc = medP[seed].map(p => 1 - p);
    const full = auc(sc, errLab[seed]);
    const sign = (full !== null && full < 0.5) ? -1 : 1;
    const ev = sc.map(d => sign < 0 ? 1 - d : d);
    const fAUC = auc(ev, errLab[seed]);
    perBrain.push({ seed, fullAUC: full === null ? null : +full.toFixed(4), sign,
      flippedAUC: fAUC === null ? null : +fAUC.toFixed(4) });
    for (let i = 0; i < nPer; i++) { poolSc.push(ev[i]); poolLb.push(errLab[seed][i]); }
  }
  results.push({ k: "oracle", pooledFlipped: +auc(poolSc, poolLb).toFixed(4),
    pooledSuspSameLines: +suspFull.toFixed(4), perBrain });
}
const out = {
  diagnostic: "ix sign-flip: few-shot sign calibration of the frozen probe (quarantined; user-authorized 2026-11-16)",
  config: { testSeeds: TEST, linesPerBrain: nPer, refSeed: REF_SEED, ks: KS, primaryK: PRIMARY_K,
    signRule: "ref doubt-AUC < 0.5 -> flip", recipe: "src/tools/ix-signflip.js (header carries full artifact map)" },
  validation: { recomputedUnflippedPooled: +recompute.toFixed(4), filed: 0.4936, match: true,
    recomputedSuspicionFull: +suspFull.toFixed(4), filedSuspicion: 0.8598 },
  results,
  futureTests: ["sign from WEIGHTS alone (unsupervised mirror detection — the hard path)",
    "challenger probe P(correct|weights,line,suspicion) graded on calibration gain",
    "per-brain offset/slope fit on ref lines instead of binary flip",
    "alignment-then-probe (Re-Basin style) vs sign-flip cost comparison"]
};
await fs.writeFile("src/evidence/synthesis/ix-signflip.json", new TextEncoder().encode(JSON.stringify(out)));
return { recompute: +recompute.toFixed(4), suspFull: +suspFull.toFixed(4),
  k20: results.find(r => r.k === 20).pooledFlipped,
  oracle: results.find(r => r.k === "oracle").pooledFlipped,
  perBrain20: results.find(r => r.k === 20).perBrain };
}
