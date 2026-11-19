// src/evidence/p3/drivers/p3-curr-v42.js — v4.2 single-brain dual-head (UNCOUNTERSIGNED->COUNTERSIGNED 2026-11-19).
// One trunk per brain (mouth 19-way + ear 4-way share trunk by reference within agent; trunks separate across agents).
// Tutor: mouth trains raw-only (easy 800 + hard 800, same as v3); ear trains head-only on tutor's own entropy buckets (fixed thresholds <1.5/<2.2/<2.7/else); trunk frozen during ear; stability probe pre/post.
// Student: fresh trunk, bundle-only; mouth = hard CE + 0.5*KL(tutor logits); ear = KL(tutor ear softs); trunk grad = mouthCE + 0.2*earCE, x0.5, one Adam; 800 steps/class; S2 = S1 continued.
// Pools: easy lag-1 p=0.35 seed 9770; hard lag-2 p=0.35 seed 9810; 600 lines each (500 train/100 test). Blind fresh init, never trains.
// Provenance: student loader imports ONLY bundle files. Pools/thermometers never imported in student training.
globalThis.CurrV42Init = async function (fs) {
  globalThis.window = globalThis;
  const ORDER = ["src/tinynn/nn.js", "src/tinynn/seeded.js", "src/tinynn/tasks.js", "src/tinynn/train.js", "src/tinynn/gseries.js"];
  for (const p of ORDER) { const src = await fs.readTextFile(p); (0, eval)(src + "\n//# sourceURL=" + p); }
  const G = globalThis.__tinyNN, T = globalThis.TinyNN;
  if (!G || !T) throw new Error("stack load failed");
  const H = 48, M = 96, D = 16, VOC = 19;
  const OPTS19 = { vocab: VOC, classes: 19, h: H, m: M, d: D, arch: "attn" };
  const OPTS4 = { vocab: VOC, classes: 4, h: H, m: M, d: D, arch: "attn" };
  const TRUNK_KEYS = ["E", "Wq", "Wk", "Wv", "Wa", "Lz", "L1", "L2"];
  function shareTrunk(dst, src) { for (const k of TRUNK_KEYS) dst[k] = src[k]; }
  function trunkParams(m) { return m.params().slice(0, 15); }
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
  function entropy(probs) { let e = 0; for (let i = 0; i < probs.length; i++) if (probs[i] > 0) e -= probs[i] * Math.log(probs[i]); return e; }
  function bucket(e) { if (e < 1.5) return 0; if (e < 2.2) return 1; if (e < 2.7) return 2; return 3; }
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
  function makeEarOnTrunk(mouth, headSeed) {
    const ear = T.makeModel(G.makeRng(headSeed), OPTS4);
    shareTrunk(ear, mouth);
    return ear;
  }
  function makeNThermo() { return T.makeModel(G.makeRng(9101), OPTS4); }
  async function loadD1a() {
    const s = await fs.readTextFile("src/evidence/d1a/tutor.json");
    return T.gseries.loadModel(JSON.parse(s));
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
  // Tutor ear head-only: targets = tutor's own mouth entropy bucket per position (tutor-originated, no pool labels).
  // Trunk frozen: only ear Lout updates.
  async function trainTutorEar(ear, mouth, lines, steps, seed) {
    const rng = G.makeRng(seed);
    const opt = new G.Adam(5e-3);
    const headParams = [ear.Lout.W, ear.Lout.b];
    const B = 8;
    let firstLoss = 0;
    for (let step = 1; step <= steps; step++) {
      for (const p of headParams) p.g.fill(0);
      let loss = 0;
      for (let b = 0; b < B; b++) {
        const x = lines[rng.int(lines.length)];
        const L = x.length;
        const fwM = mouth.forward(x, 1);
        const fwE = ear.forward(x, 1);
        const auxList = new Array(L);
        for (let t = 0; t < L; t++) {
          if (t >= L - 1) { auxList[t] = null; continue; }
          const probs = softmax(Array.from(fwM.cache.posOut[t].logits));
          const bkt = bucket(entropy(probs));
          const ce = G.softmaxCE(fwE.cache.posOut[t].logits, bkt);
          loss += ce.loss / (L - 1);
          const dt = ce.dlogits;
          for (let i = 0; i < dt.length; i++) dt[i] /= (B * (L - 1));
          auxList[t] = dt;
        }
        ear.backward(new Float64Array(4), fwE, auxList, null, null);
        // freeze trunk: zero shared trunk grads (they are mouth's objects by reference)
        for (const p of trunkParams(mouth)) p.g.fill(0);
      }
      opt.step(headParams);
      loss /= B;
      if (step === 1) firstLoss = loss;
      if (step % 50 === 0 || step === steps) await new Promise((r) => setTimeout(r, 0));
      if (!Number.isFinite(loss)) return { firstLoss: +(+firstLoss).toFixed(4), stepsDone: step, halted: "ABORT ear non-finite" };
    }
    return { firstLoss: +(+firstLoss).toFixed(4), stepsDone: steps, halted: null };
  }
  function earLoss(ear, mouth, lines, n) {
    n = n || 100;
    let s = 0, a = 0;
    for (let i = 0; i < n; i++) {
      const x = lines[i % lines.length];
      const L = x.length;
      const fwM = mouth.forward(x, 1), fwE = ear.forward(x, 1);
      for (let t = 0; t < L - 1; t++) {
        const probs = softmax(Array.from(fwM.cache.posOut[t].logits));
        const bkt = bucket(entropy(probs));
        const ce = G.softmaxCE(fwE.cache.posOut[t].logits, bkt);
        s += ce.loss / (L - 1);
        const lg = Array.from(fwE.cache.posOut[t].logits);
        let bi = 0; for (let k = 1; k < lg.length; k++) if (lg[k] > lg[bi]) bi = k;
        if (bi === bkt) a++;
      }
    }
    return { loss: +(s / n).toFixed(4), acc: +(a / (n * 30)).toFixed(4) };
  }
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
  // Bundle: lines + tutor mouth logits + tutor ear softs + entropy/confidence (all tutor-originated).
  function genBundle(mouth, ear, seed, n) {
    n = n || 100;
    const lines = genLines(mouth, seed, n);
    const tLogits = [], tEar = [], tEnt = [];
    for (const x of lines) {
      const fwM = mouth.forward(x, 1), fwE = ear.forward(x, 1);
      const L = x.length, lm = [], le = [], en = [];
      for (let t = 0; t < L - 1; t++) {
        const lg = Array.from(fwM.cache.posOut[t].logits);
        lm.push(lg);
        const probs = softmax(lg);
        en.push(+entropy(probs).toFixed(4));
        le.push(Array.from(fwE.cache.posOut[t].logits));
      }
      tLogits.push(lm); tEar.push(le); tEnt.push(en);
    }
    return { lines, tLogits, tEar, tEnt };
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
  // Wilson 95% CI for binomial agreement (per-pair EAR-BAR).
  function wilsonCI(k, n) {
    const z = 1.96, p = k / n;
    const d = 1 + z * z / n;
    const c = p + z * z / (2 * n);
    const m = z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n));
    return { lo: +((c - m) / d).toFixed(4), hi: +((c + m) / d).toFixed(4) };
  }
  // Student joint training on bundle: mouth hard CE + 0.5 KL(tutor) ; ear KL(tutor ear); trunk = mouthCE + 0.2 earCE, x0.5, one Adam.
  async function trainStudentOnBundle(mouth, ear, bundle, steps, seed, alpha) {
    alpha = (alpha == null ? 0.5 : alpha);
    const lamEar = 0.2;
    const rng = G.makeRng(seed);
    const opt = new G.Adam(5e-3);
    const trunk = trunkParams(mouth);
    const allParams = trunk.concat([mouth.Lout.W, mouth.Lout.b, ear.Lout.W, ear.Lout.b]);
    const B = 8;
    const Z19 = new Float64Array(19);
    let firstM = 0, firstE = 0;
    for (let step = 1; step <= steps; step++) {
      mouth.zeroGrad();
      ear.Lout.W.g.fill(0); ear.Lout.b.g.fill(0);
      let lm = 0, le = 0;
      for (let b = 0; b < B; b++) {
        const idx = rng.int(bundle.lines.length);
        const x = bundle.lines[idx], L = x.length;
        const tLog = bundle.tLogits[idx], tEar = bundle.tEar[idx];
        // mouth forward + hard CE aux + KL mix
        const fwM = mouth.forward(x, 1);
        const auxList = new Array(L);
        for (let t = 0; t < L; t++) {
          if (t >= L - 1) { auxList[t] = null; continue; }
          const ce = G.softmaxCE(fwM.cache.posOut[t].logits, x[t + 1]);
          lm += ce.loss / (L - 1);
          const dt = ce.dlogits;
          // KL to tutor: (p_s - p_t) * alpha blended with hard grad (1-alpha hard + alpha soft)
          const ps = softmax(Array.from(fwM.cache.posOut[t].logits));
          const pt = softmax(tLog[t]);
          for (let i = 0; i < dt.length; i++) dt[i] = ((1 - alpha) * dt[i] + alpha * (ps[i] - pt[i])) / (B * (L - 1));
          auxList[t] = dt;
        }
        mouth.backward(Z19, fwM, auxList, null, null);
        // ear forward + KL to tutor ear softs
        const fwE = ear.forward(x, 1);
        const d = new Float64Array(4);
        // accumulate ear grads manually via soft CE per position using auxList pattern
        const auxE = new Array(L);
        for (let t = 0; t < L; t++) {
          if (t >= L - 1) { auxE[t] = null; continue; }
          const ps4 = softmax(Array.from(fwE.cache.posOut[t].logits));
          const pt4 = softmax(tEar[t]);
          for (let i = 0; i < 4; i++) le += (-pt4[i] * Math.log(ps4[i] + 1e-12)) / (L - 1);
          const dd = new Float64Array(4);
          for (let i = 0; i < 4; i++) dd[i] = lamEar * (ps4[i] - pt4[i]) / (B * (L - 1));
          // scale into dlogits form
          const tmp = new Float64Array(dd);
          auxE[t] = tmp;
        }
        ear.backward(new Float64Array(4), fwE, auxE, null, null);
        void d;
      }
      for (const p of trunk) { const g = p.g; for (let i = 0; i < g.length; i++) g[i] *= 0.5; }
      opt.step(allParams);
      lm /= B; le /= B;
      if (step === 1) { firstM = lm; firstE = le; }
      if (!Number.isFinite(lm) || !Number.isFinite(le)) return { halted: "ABORT student non-finite step " + step, stepsDone: step };
      if (step % 50 === 0 || step === steps) await new Promise((r) => setTimeout(r, 0));
    }
    return { firstM: +firstM.toFixed(4), firstE: +firstE.toFixed(4), stepsDone: steps, halted: null };
  }
  return {
    G, T, OPTS19, OPTS4, TRUNK_KEYS, shareTrunk, trunkParams,
    structuredPool, hardLag2Pool, makeMouth, makeEarOnTrunk, makeNThermo, loadD1a,
    trainMouth, mouthLoss, trainTutorEar, earLoss, genLines, uniqCount, genBundle,
    gradeWithPile, pairStats, wilsonCI, trainStudentOnBundle, bucket
  };
};
globalThis.CurrV42Ready = true;
