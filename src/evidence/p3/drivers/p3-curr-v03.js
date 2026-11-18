// src/evidence/p3/drivers/p3-curr-v03.js — v3 consolidated helpers (v2 + 2 changes).
// Base ported unchanged from p3-curr-v08.js: structuredPool / trainMouth /
// mouthLoss / genLines / gradeWithPile / pairStats. Changes:
//  (1) hardLag2Pool: x[t]==x[t-2] p=0.35, else int(19). Same lens/vocab/seeds.
//  (2) tutor bundle: genBundle saves lines + tutor per-position logits/entropy/
//      attention-peak (all tutor-originated, no experimenter labels).
//      trainStudentOnBundle mixes hard CE + KL-to-tutor (alpha=0.5) where tutor
//      logits exist (t>=2, prefix-3). Attention/entropy saved descriptively,
//      NOT consumed in v3. Provenance: student path loads bundle only.
globalThis.CurrV3Init = async function (fs) {
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
  // CHANGE 1: lag-2 hides in noise. Unigrams/bigrams uniform, signal in trigrams.
  function hardLag2Pool(seed, n) {
    const rng = G.makeRng(seed), out = [];
    for (let i = 0; i < n; i++) {
      const len = i < n / 2 ? [10, 15, 20][rng.int(3)] : 50;
      const x = new Array(len);
      x[0] = rng.int(VOC);
      if (len > 1) x[1] = rng.int(VOC);
      for (let t = 2; t < len; t++) x[t] = rng.uniform(0, 1) < 0.35 ? x[t - 2] : rng.int(VOC);
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
  function entropy(probs) {
    let e = 0; for (let i = 0; i < probs.length; i++) if (probs[i] > 0) e -= probs[i] * Math.log(probs[i]);
    return e;
  }
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
  // CHANGE 2 plumbing: tutor bundle. All sidecar computed from tutor's own
  // forward passes only. No pool labels, no thermometer, no ground truth.
  function genBundle(mouth, seed, n) {
    n = n || 100;
    const rng = G.makeRng(seed);
    const lines = [], tLogits = [], tEnt = [], attnPeak = [], attnEnt = [];
    for (let li = 0; li < n; li++) {
      const L = li < n / 2 ? [10, 15, 20][rng.int(3)] : 50;
      const x = [];
      for (let k = 0; k < 3; k++) x.push(rng.int(VOC));
      const lg = [], en = [], pk = [], ae = [];
      // prefix positions have no tutor distribution (null)
      lg.push(null, null); en.push(null, null); pk.push(null, null); ae.push(null, null);
      while (x.length < L) {
        const fw = mouth.forward(x, 1);
        const steps = fw.cache.steps, L0 = x.length;
        const logits = Array.from(fw.cache.posOut[L0 - 1].logits);
        const probs = softmax(logits);
        lg.push(logits); en.push(+entropy(probs).toFixed(4));
        // attention of the predicting position step (position pass, isDepth false, posT == L0-1)
        let w = null;
        for (let k = steps.length - 1; k >= 0; k--) {
          const it = steps[k];
          if (!it.isDepth && it.posT === L0 - 1 && it.att && it.att.w) { w = Array.from(it.att.w); break; }
        }
        if (w) {
          let bi = 0; for (let j = 1; j < w.length; j++) if (w[j] > w[bi]) bi = j;
          pk.push(bi); ae.push(+entropy(w).toFixed(4));
        } else { pk.push(null); ae.push(null); }
        x.push(sampleCat(rng, probs));
      }
      // align: per-predicted-position arrays length L-1 (t predicts x[t+1]).
      // Our pushes: 2 nulls + one per generated token (L-3) = L-1 entries. Good.
      lines.push(x); tLogits.push(lg); tEnt.push(en); attnPeak.push(pk); attnEnt.push(ae);
    }
    return { lines, tLogits, tEnt, attnPeak, attnEnt };
  }
  function genLines(mouth, seed, n) {
    // plain lines (for student/blind stage-gen, no sidecar needed)
    const b = genBundle(mouth, seed, n);
    return b.lines;
  }
  function uniqCount(lines) { return new Set(lines.map((l) => l.join(","))).size; }
  // Student consumes tutor bundle: base hard CE + KL-to-tutor where available.
  // alpha=0.5 filed. Attention/entropy saved but NOT consumed in v3.
  async function trainStudentOnBundle(student, bundle, steps, seed, alpha) {
    alpha = (alpha === undefined) ? 0.5 : alpha;
    const rng = G.makeRng(seed);
    const opt = new G.Adam(5e-3);
    const B = 8;
    let firstLoss = 0;
    const lines = bundle.lines, tls = bundle.tLogits;
    for (let step = 1; step <= steps; step++) {
      student.zeroGrad();
      let loss = 0;
      for (let b = 0; b < B; b++) {
        const idx = rng.int(lines.length);
        const x = lines[idx], tl = tls[idx], L = x.length;
        const fw = student.forward(x, 1);
        const auxList = new Array(L);
        for (let t = 0; t < L; t++) {
          if (t >= L - 1) { auxList[t] = null; continue; }
          const slogits = Array.from(fw.cache.posOut[t].logits);
          const ps = softmax(slogits);
          const y = x[t + 1];
          // hard grad
          const gh = ps.slice(); gh[y] -= 1;
          let dt, l;
          const tutor = tl[t];
          if (tutor && alpha > 0) {
            const pt = softmax(tutor);
            let kl = 0; for (let i = 0; i < ps.length; i++) kl += pt[i] * Math.log((pt[i] + 1e-12) / (ps[i] + 1e-12));
            let ce = 0; ce = -Math.log(ps[y] + 1e-12);
            l = (1 - alpha) * ce + alpha * kl;
            dt = new Array(ps.length);
            for (let i = 0; i < ps.length; i++) {
              const hard = ps[i] - (i === y ? 1 : 0);
              const soft = ps[i] - pt[i];
              dt[i] = ((1 - alpha) * hard + alpha * soft) / (B * (L - 1));
            }
          } else {
            const ce = G.softmaxCE(fw.cache.posOut[t].logits, y);
            l = ce.loss;
            dt = ce.dlogits;
            for (let i = 0; i < dt.length; i++) dt[i] /= (B * (L - 1));
          }
          loss += l / (L - 1);
          auxList[t] = dt;
        }
        student.backward(new Float64Array(19), fw, auxList, null, null);
      }
      opt.step(student.params());
      loss /= B;
      if (step === 1) firstLoss = loss;
      if (step % 50 === 0 || step === steps) await new Promise((r) => setTimeout(r, 0));
      if (!Number.isFinite(loss)) return { firstLoss, lastLoss: NaN, stepsDone: step };
    }
    return { firstLoss: +firstLoss.toFixed(4), lastLoss: NaN, stepsDone: steps };
  }
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
    G, T, OPTS19, OPTS4, structuredPool, hardLag2Pool, makeMouth, makeNThermo, loadD1a,
    trainMouth, trainStudentOnBundle, mouthLoss, genBundle, genLines, uniqCount, gradeWithPile, pairStats
  };
};
globalThis.CurrV3Ready = true;
