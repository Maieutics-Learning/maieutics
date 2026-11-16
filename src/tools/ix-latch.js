// src/tools/ix-latch.js — W1-channel ablation (run C, quarantined diagnostic).
// User-authorized 2026-11-16 ("close the chapter on ix"). Eval-only: NO retraining.
// ARTIFACT MAP: probe nets scratch/ix-probe-P1..P5.json (MLP-64, DIN=D+L input
// [raw final weights | line/8]; header recipe also in src/tools/ix-signflip.js).
// Brains scratch/ix-final-<seed>.json, seen set 5002–5016 (5001 dropped).
// Lines G.buildExams(7008).killHu (200, novel to the probe = W1 setting).
// Filed W1 = killHu pooled 0.763; killHd sanity 0.809 (phase-1dix-verdicts.md).
// TEST: (i) zero-line: input [w|0], per-brain-constant scores; (ii) zero-B:
// input [0|x/8], per-line-constant scores. Median over 5 seeds. Pooled AUC +
// per-brain tables + brain-cluster CIs + suspicion baseline, same lines.
// CLOSE RULE (filed in working record pre-run): latching DEMONSTRATED iff
// zero-line within ~0.05 of W1 AND zero-B covers 0.5 or <= floor noise.
// VALIDATION GATE: unmasked recompute must equal filed W1 0.763 to 3dp.
async function main() {
globalThis.window = globalThis;
const ORDER = ["src/tinynn/nn.js","src/tinynn/seeded.js","src/tinynn/tasks.js","src/tinynn/train.js","src/tinynn/pcgrad.js","src/tinynn/evo.js","src/tinynn/gseries.js"];
for (const f of ORDER) { const src = await fs.readTextFile(f); (0, eval)(src + "\n//# sourceURL=" + f); }
const G = window.TinyNN.gseries, RNG = window.__tinyNN.makeRng;
const R = G.EVAL_R;
const SEEN = []; for (let s = 5002; s <= 5016; s++) SEEN.push(s);
const PSEEDS = [1, 2, 3, 4, 5], NB = SEEN.length;
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
function quant(ds, q) { const s = ds.slice().sort((a, b) => a - b); return s[Math.min(s.length - 1, Math.floor(q * s.length))]; }
const partial = JSON.parse(await fs.readTextFile("scratch/ix-partial.json"));
const D = partial.step0.D, L = partial.step0.L, DIN = D + L;
const exams = G.buildExams(7008);
const nPer = exams.killHu.length;
// brain weights + killHu correctness + suspicion
const W = {}, ROWC = {}, SUSP = {};
for (const seed of SEEN) {
  const blob = JSON.parse(await fs.readTextFile("scratch/ix-final-" + seed + ".json"));
  const w = [];
  for (const p of blob.params) for (const v of p.v) w.push(v);
  W[seed] = Float64Array.from(w);
  const model = G.loadModel(blob);
  ROWC[seed] = []; SUSP[seed] = [];
  for (const ex of exams.killHu) {
    const fw = model.forward(ex.x, R);
    const lg = Array.from(fw.logits);
    let m = -1e300; for (const v of lg) if (v > m) m = v;
    const p = lg.map(v => Math.exp(v - m)); const s = p.reduce((a, x) => a + x, 0);
    let top = 0; for (let k = 1; k < 4; k++) if (p[k] > p[top]) top = k;
    ROWC[seed].push(top === ex.y ? 1 : 0);
    SUSP[seed].push(1 - p[top] / s);
  }
}
const yHu = []; for (const s of SEEN) for (let i = 0; i < nPer; i++) yHu.push(ROWC[s][i] === 0 ? 1 : 0);
// probe nets (full)
const nets = [];
for (const pseed of PSEEDS) {
  const s = JSON.parse(await fs.readTextFile("scratch/ix-probe-P" + pseed + ".json"));
  nets.push({ W1: Float64Array.from(s.net.W1), b1: Float64Array.from(s.net.b1),
    W2p: Float64Array.from(s.net.W2p), b2p: Float64Array.from(s.net.b2p) });
}
function fwd(net, getX) {
  // getX(i)->value for input dim i; split loops avoid materializing X
  const h = new Float64Array(64);
  for (let j = 0; j < 64; j++) {
    let a = net.b1[j];
    for (let i = 0; i < DIN; i++) { const x = getX(i); if (x !== 0) a += x * net.W1[i * 64 + j]; }
    h[j] = a > 0 ? a : 0;
  }
  let zp = net.b2p[0];
  for (let j = 0; j < 64; j++) zp += h[j] * net.W2p[j];
  return 1 / (1 + Math.exp(-zp));
}
const med = (v) => { const s = v.slice().sort((a, b) => a - b); return s[2]; };
// unmasked (validation) + zero-line (per brain) + zero-B (per line)
const pFull = {}, pZL = {}, pZB = {};
const HX = exams.killHu.map(e => Array.from(e.x));
for (const seed of SEEN) {
  const w = W[seed];
  pZL[seed] = med(nets.map(nt => fwd(nt, i => i < D ? w[i] : 0)));
  const rows = [];
  for (let li = 0; li < nPer; li++) {
    const x = HX[li];
    rows.push(med(nets.map(nt => fwd(nt, i => i < D ? w[i] : x[i - D] / 8))));
  }
  pFull[seed] = rows;
}
const lineMed = HX.map((x, li) => med(nets.map(nt => {
  let zp = nt.b2p[0];
  for (let j = 0; j < 64; j++) {
    let a = nt.b1[j];
    for (let k = 0; k < L; k++) a += (x[k] / 8) * nt.W1[(D + k) * 64 + j];
    if (a > 0) zp += a * nt.W2p[j];
  }
  return 1 / (1 + Math.exp(-zp));
})));
for (const seed of SEEN) pZB[seed] = lineMed.slice();
// expand to pooled
function expand(perBrain) { const sc = []; for (const s of SEEN) for (let i = 0; i < nPer; i++) sc.push(1 - perBrain[s][i]); return sc; }
function expandConst(perBrainMed) { const sc = []; for (const s of SEEN) for (let i = 0; i < nPer; i++) sc.push(1 - perBrainMed[s]); return sc; }
const dFull = expand(pFull), dZL = expandConst(pZL), dZB = expand(pZB);
const suspAll = []; for (const s of SEEN) for (let i = 0; i < nPer; i++) suspAll.push(SUSP[s][i]);
const aFull = auc(dFull, yHu);
if (aFull === null || Math.abs(aFull - 0.763) > 0.0005) {
  const out = { diagnostic: "ix run C (quarantined)", halt: true,
    reason: "validation gate: unmasked recompute " + aFull + " != filed W1 0.763" };
  await fs.writeFile("src/evidence/synthesis/ix-latch.json", new TextEncoder().encode(JSON.stringify(out)));
  return out;
}
function clusterCI(scores, labels, reps, seed) {
  const perB = [], perL = [];
  for (let b = 0; b < NB; b++) { perB.push(scores.slice(b * nPer, (b + 1) * nPer)); perL.push(labels.slice(b * nPer, (b + 1) * nPer)); }
  const rng = RNG(seed), ds = [];
  for (let k = 0; k < reps; k++) {
    const sc = [], lb = [];
    for (let i = 0; i < NB; i++) {
      const b = Math.floor(rng.uniform(0, 1) * NB);
      for (let li = 0; li < nPer; li++) { sc.push(perB[b][li]); lb.push(perL[b][li]); }
    }
    const v = auc(sc, lb); if (v !== null) ds.push(v);
  }
  ds.sort((a, b) => a - b);
  return { lo: +quant(ds, 0.025).toFixed(4), hi: +quant(ds, 0.975).toFixed(4) };
}
const aZL = auc(dZL, yHu), aZB = auc(dZB, yHu), aSusp = auc(suspAll, yHu);
const ciZL = clusterCI(dZL, yHu, 2000, 515151), ciZB = clusterCI(dZB, yHu, 2000, 525252);
const perBrain = SEEN.map((seed, b) => {
  const lb = yHu.slice(b * nPer, (b + 1) * nPer);
  const f = auc(dFull.slice(b * nPer, (b + 1) * nPer), lb);
  const z = auc(dZB.slice(b * nPer, (b + 1) * nPer), lb);
  return { seed, full: f === null ? null : +f.toFixed(4), zeroB: z === null ? null : +z.toFixed(4) };
});
const zlCovers = ciZL.lo <= 0.763 && ciZL.hi >= 0.763;
const zbCoversChance = ciZB.lo <= 0.5 && ciZB.hi >= 0.5;
const zbNearFloor = aZB !== null && aZB <= 0.60;
const demonstrated = Math.abs(aZL - 0.763) <= 0.05 && (zbCoversChance || zbNearFloor);
const out = {
  diagnostic: "ix run C: W1-channel ablation (quarantined; user-authorized 2026-11-16)",
  setting: "seen brains 5002-5016 x novel killHu 200 (W1 setting exactly)",
  validation: { recomputedUnmasked: +aFull.toFixed(4), filedW1: 0.763, match: true },
  zeroLine_weightsLive: { pooled: +aZL.toFixed(4), clusterCI95: [ciZL.lo, ciZL.hi], coversW1: zlCovers },
  zeroB_linesLive: { pooled: aZB === null ? null : +aZB.toFixed(4), clusterCI95: [ciZB.lo, ciZB.hi],
    coversChance: zbCoversChance, nearFloor: zbNearFloor },
  suspicionSameLines: +aSusp.toFixed(4),
  floorRef: { A0_foldAvg: 0.545, runB_A: 0.4851 },
  perBrain,
  closeRule: "latching DEMONSTRATED iff zero-line within ~0.05 of W1 AND zero-B covers 0.5 or <= floor noise",
  verdict: demonstrated ? "latching DEMONSTRATED (C4 closes)" : "latching NOT demonstrated (C4 stays partial)",
  recipe: "src/tools/ix-latch.js"
};
await fs.writeFile("src/evidence/synthesis/ix-latch.json", new TextEncoder().encode(JSON.stringify(out)));
return { aFull: +aFull.toFixed(4), aZL: +aZL.toFixed(4), ciZL: [ciZL.lo, ciZL.hi],
  aZB: aZB === null ? null : +aZB.toFixed(4), ciZB: [ciZB.lo, ciZB.hi],
  aSusp: +aSusp.toFixed(4), verdict: out.verdict };
}
