// src/tools/ix-susp-hu.js — suspicion baseline on killHu, seen brains (follow-up
// inside run C; quarantined observation, zero kill power over any frozen verdict).
// ARTIFACT MAP: brains scratch/ix-final-5002..5016.json; lines
// G.buildExams(7008).killHu (200); forward via G.loadModel + EVAL_R argmax;
// suspicion = 1 - top1 softmax. Deterministic, eval-only (~3000 tiny forwards).
// Found: pooled 0.5572; per-brain 0.32–0.81 with anti-prediction on
// systematically-wrong brains (5002/5005/5006/5014). All previously filed
// suspicion wins (0.86–0.93) were on killHd (/killA); killHu was never measured.
async function main() {
globalThis.window = globalThis;
const ORDER = ["src/tinynn/nn.js","src/tinynn/seeded.js","src/tinynn/tasks.js","src/tinynn/train.js","src/tinynn/pcgrad.js","src/tinynn/evo.js","src/tinynn/gseries.js"];
for (const f of ORDER) { const src = await fs.readTextFile(f); (0, eval)(src + "\n//# sourceURL=" + f); }
const G = window.TinyNN.gseries;
const R = G.EVAL_R;
const SEEN = []; for (let s = 5002; s <= 5016; s++) SEEN.push(s);
const exams = G.buildExams(7008);
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
const perBrain = [], poolSc = [], poolLb = [];
for (const seed of SEEN) {
  const blob = JSON.parse(await fs.readTextFile("scratch/ix-final-" + seed + ".json"));
  const model = G.loadModel(blob);
  const sc = [], lb = [];
  let acc = 0;
  for (const ex of exams.killHu) {
    const fw = model.forward(ex.x, R);
    const lg = Array.from(fw.logits);
    let m = -1e300; for (const v of lg) if (v > m) m = v;
    const p = lg.map(v => Math.exp(v - m)), s = p.reduce((a, x) => a + x, 0);
    let top = 0; for (let k = 1; k < 4; k++) if (p[k] > p[top]) top = k;
    const c = top === ex.y ? 1 : 0; acc += c;
    sc.push(1 - p[top] / s); lb.push(c === 0 ? 1 : 0);
  }
  for (let i = 0; i < sc.length; i++) { poolSc.push(sc[i]); poolLb.push(lb[i]); }
  const a = auc(sc, lb);
  perBrain.push({ seed, acc: +(acc / sc.length).toFixed(3), nErr: sc.length - acc, suspAUC: a === null ? null : +a.toFixed(4) });
}
const out = {
  diagnostic: "suspicion on killHu, seen brains (run-C follow-up; quarantined observation)",
  setting: "brains 5002-5016 x killHu 200 (W1 lines exactly)",
  pooledSuspicion: +auc(poolSc, poolLb).toFixed(4),
  perBrain,
  note: "all previously filed suspicion wins (0.86-0.93) were killHd/killA; killHu unmeasured until now",
  recipe: "src/tools/ix-susp-hu.js"
};
await fs.writeFile("src/evidence/synthesis/ix-susp-hu.json", new TextEncoder().encode(JSON.stringify(out)));
return { pooled: out.pooledSuspicion, perBrain };
}
