// src/evidence/p3/drivers/p3-curr-v08.js — v0.8-v2 curriculum helpers (mouth tutor+student, raw lines only).
// Ports (unchanged logic) from p3-twins-dual.js: structuredPool / noisePool / trainMouth /
// mouthLoss / genLines (=genExamWithMouth) / gradeWithPile / pairStats. Stack identical.
// Thermometers: frozen random pile (init 9101) + d1a via T.gseries.loadModel.
// No soft targets, no distillation, no grader-steered selection anywhere in this file.
globalThis.CurrInit = async function (fs) {
  globalThis.window = globalThis;
  const ORDER = ["src/tinynn/nn.js", "src/tinynn/seeded.js", "src/tinynn/tasks.js", "src/tinynn/train.js", "src/tinynn/gseries.js"];
  for (const p of ORDER) { const src = await fs.readTextFile(p); (0, eval)(src + "\n//# sourceURL=" + p); }
  const G = globalThis.__tinyNN, T = globalThis.TinyNN;
  if (!G || !T) throw new Error("stack load failed");
  const H = 48, M = 96, D = 16, VOC = 19;
  const OPTS19 = { vocab: VOC, classes: 19, h: H, m: M, d: D, arch: "attn" };
  const OPTS4 = { vocab: VOC, classes: 4, h: H, m: M, d: D, arch: "attn" };
  function structuredPool(seed, n) {
    const rng = G.makeRng(seed), out = [];
    for (let i = 0; i < n; i++) {
      const len = i < n / 2 ? [10, 15, 20][rng.int(3)] : 50;
      const x = new Array(len);
      x[0] = rng.int(VOC);
      for (let t = 1; t < len; t++) x[t] = rng.uniform(0, 1) < 0.35 ? x[t - 1] : rng.int(VOC);
      out.push({ x, y: 0 });
    }
    return out;
  }
  function noisePool(seed, n) {
    const rng = G.makeRng(seed), out = [];
    for (let i = 0; i < n; i++) {
      const len = i < n / 2 ? [10, 15, 20][rng.int(3)] : 50;
      const x = new Array(len); for (let j = 0; j < len; j++) x[j] = rng.int(VOC);
      out.push({ x, y: 0 });
    }
    return out;
  }
  function makeMouth(seed) { return T.makeModel(G.makeRng(seed), OPTS19); }
  function makeNThermo() { return T.makeModel(G.makeRng(9101), OPTS4); }
  async function loadD1a() {
    const s = await fs.readTextFile("src/evidence/d1a/tutor.json");
    return T.gseries.loadModel(JSON.parse(s));
  }
  function softmax(a) {
    let m = -1e30; for (let i = 0; i < a.length; i++) if (a[i] > m) m = a[i];
    let s = 0; const o = new Array(a.length);
    for (let i = 0; i < a.length; i++) { o[i] = Math.exp(a[i] - m); s += o[i]; }
    for (let i = 0; i < o.length; i++) o[i] /= s;
    return o;
  }
  function sampleCat(rng, probs) {
    const u = rng.uniform(0, 1); let c = 0;
    for (let i = 0; i < probs.length; i++) { c += probs[i]; if (u < c) return i; }
    return probs.length - 1;
  }
  // Fixed-step next-token training. Budget is a schedule, never test-conditioned.
  async function trainMouth(mouth, pool, steps, seed) {
    const rng = G.makeRng(seed);
    const opt = new G.Adam(5e-3);
    const B = 8;
    let firstLoss = 0;
    for (let step = 1; step <= steps; step++) {
      mouth.zeroGrad();
      let loss = 0;
      for (let b = 0; b < B; b++) {
        const ex = pool[rng.int(pool.length)];
        const x = ex.x, L = x.length;
        const fw = mouth.forward(x, 1);
        const auxList = new Array(L);
        for (let t = 0; t < L; t++) {
          if (t >= L - 1) { auxList[t] = null; continue; }
          const ce = G.softmaxCE(fw.cache.posOut[t].logits, x[t + 1]);
          loss += ce.loss / (L - 1);
          const dt = ce.dlogits;
          for (let i = 0; i < dt.length; i++) dt[i] /= (B * (L - 1));
          auxList[t] = dt;
        }
        mouth.backward(new Float64Array(19), fw, auxList, null, null);
      }
      opt.step(mouth.params());
      loss /= B;
      if (step === 1) firstLoss = loss;
      if (step % 50 === 0 || step === steps) await new Promise((r) => setTimeout(r, 0));
      if (!Number.isFinite(loss)) return { firstLoss, lastLoss: NaN, stepsDone: step };
    }
    return { firstLoss: +firstLoss.toFixed(4), lastLoss: NaN, stepsDone: steps };
  }
  function mouthLoss(mouth, pool, n) {
    n = n || 100;
    let s = 0;
    for (let i = 0; i < n; i++) {
      const x = pool[i % pool.length].x, L = x.length;
      const fw = mouth.forward(x, 1);
      for (let t = 0; t < L - 1; t++) s += G.softmaxCE(fw.cache.posOut[t].logits, x[t + 1]).loss / (L - 1);
    }
    return +(s / n).toFixed(4);
  }
  // Tutor writes: ancestral T=1.0, uniform-3 prefix from exam rng, rng outside loop.
  function genLines(mouth, seed, n) {
    n = n || 100;
    const rng = G.makeRng(seed);
    const lines = [];
    for (let li = 0; li < n; li++) {
      const L = li < n / 2 ? [10, 15, 20][rng.int(3)] : 50;
      const x = [];
      for (let k = 0; k < 3; k++) x.push(rng.int(VOC));
      while (x.length < L) {
        const fw = mouth.forward(x, 1);
        const pos = fw.cache.posOut;
        const logits = Array.from(pos[pos.length - 1].logits);
        x.push(sampleCat(rng, softmax(logits)));
      }
      lines.push(x);
    }
    return lines;
  }
  function uniqCount(lines) { return new Set(lines.map((l) => l.join(","))).size; }
  function gradeWithPile(pile, lines) {
    const counts = [0, 0, 0, 0], pred = [];
    for (const x of lines) {
      const lg = Array.from(pile.forward(x, 1).logits);
      let bi = 0; for (let i = 1; i < lg.length; i++) if (lg[i] > lg[bi]) bi = i;
      counts[bi]++; pred.push(bi);
    }
    return { counts, pred };
  }
  function pairStats(tPred, sPred) {
    const n = tPred.length; let a = 0;
    const ps = [0, 0, 0, 0], pt = [0, 0, 0, 0];
    for (let i = 0; i < n; i++) { if (tPred[i] === sPred[i]) a++; ps[sPred[i]]++; pt[tPred[i]]++; }
    const obs = a / n; let perm = 0;
    for (let c = 0; c < 4; c++) perm += (ps[c] / n) * (pt[c] / n);
    return { obs: +obs.toFixed(4), perm: +perm.toFixed(4), delta: +(obs - perm).toFixed(4) };
  }
  return {
    G, T, OPTS19, OPTS4, structuredPool, noisePool, makeMouth, makeNThermo, loadD1a,
    trainMouth, mouthLoss, genLines, uniqCount, gradeWithPile, pairStats
  };
};
globalThis.CurrReady = true;
