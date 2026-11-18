// scratch/p3-twins-dual.js — dual-head (mouth+ear, one trunk) helpers for v0.6.
// Trunk = E,Wq,Wk,Wv,Wa,Lz,L1,L2. Heads: LoutMouth (h->19), LoutPile (h->4).
// Strategy (countersigned v0.6): freeze what's good, train only what's missing.
// N-arm reuses filed writer blobs (no mouth retrain). E-arm trains mouth
// unfrozen then distills ear. F-arm is random-init control (0 tutor steps).
globalThis.TwinsDualInit = async function (fs) {
  globalThis.window = globalThis;
  const ORDER = ["src/tinynn/nn.js", "src/tinynn/seeded.js", "src/tinynn/tasks.js", "src/tinynn/train.js", "src/tinynn/gseries.js"];
  for (const p of ORDER) { const src = await fs.readTextFile(p); (0, eval)(src + "\n//# sourceURL=" + p); }
  const G = globalThis.__tinyNN, T = globalThis.TinyNN;
  if (!G || !T) throw new Error("stack load failed");
  const H = 48, M = 96, D = 16, VOC = 19;
  const OPTS19 = { vocab: VOC, classes: 19, h: H, m: M, d: D, arch: "attn" };
  const OPTS4 = { vocab: VOC, classes: 4, h: H, m: M, d: D, arch: "attn" };
  const TRUNK_KEYS = ["E", "Wq", "Wk", "Wv", "Wa", "Lz", "L1", "L2"];
  function copyTrunk(src, dst) {
    for (const k of TRUNK_KEYS) {
      const s = src[k], d = dst[k];
      if (k === "E") { d.v.set(s.v); d.g.fill(0); continue; }
      d.W.v.set(s.W.v); d.W.g.fill(0);
      d.b.v.set(s.b.v); d.b.g.fill(0);
    }
  }
  function zeroGrad(m) { for (const p of m.params()) p.g.fill(0); }
  function argmax(a) { let b = 0; for (let i = 1; i < a.length; i++) if (a[i] > a[b]) b = i; return b; }
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
  // Reconstructed structured pool (filed openly as reconstruction): Markov-repeat RHO=0.35.
  function structuredPool(seed, n) {
    const rng = G.makeRng(seed), out = [];
    for (let i = 0; i < n; i++) {
      const len = i < n / 2 ? [10, 15, 20][rng.int(3)] : 50;
      const x = new Array(len);
      x[0] = rng.int(VOC);
      for (let t = 1; t < len; t++) {
        if (rng.uniform(0, 1) < 0.35) x[t] = x[t - 1];
        else x[t] = rng.int(VOC);
      }
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
  async function loadWriterBlob(path) {
    const s = await fs.readTextFile(path);
    const j = JSON.parse(s);
    const model = T.makeModel(G.makeRng(1), { vocab: VOC, classes: 19, h: H, m: M, d: D, arch: "attn" });
    const params = model.params();
    if (params.length !== j.vars.length) throw new Error("param count " + params.length + " vs " + j.vars.length + " in " + path);
    for (let i = 0; i < params.length; i++) {
      if (params[i].v.length !== j.vars[i].length) throw new Error("len mismatch param " + i + " in " + path);
      params[i].v.set(j.vars[i]); params[i].g.fill(0);
      if (params[i].m) params[i].m.fill(0);
      if (params[i].vv) params[i].vv.fill(0);
    }
    return model;
  }
  async function loadE() {
    const s = await fs.readTextFile("src/evidence/d1a/tutor.json");
    const j = JSON.parse(s);
    return T.gseries.loadModel(j);
  }
  function makePileOnTrunk(trunkSrc, headSeed) {
    const pile = T.makeModel(G.makeRng(headSeed), OPTS4);
    copyTrunk(trunkSrc, pile);
    // re-randomize pile Lout from headSeed (makeModel already did with headSeed rng
    // EXCEPT trunk copy overwrote trunk only — Lout stays as drawn from headSeed). Good.
    return pile;
  }
  // Train ONLY pile Lout (trunk frozen) to distill tutor softs (T1 rows cache style).
  async function trainPileHeadOnly(pile, tutor, train, steps, seed) {
    const rng = G.makeRng(seed);
    const opt = new G.Adam(5e-3);
    const B = 8;
    const headParams = [pile.Lout.W, pile.Lout.b];
    // cache tutor rows at r=1 only (T1); train loop uses r=1 fixed per v0.6
    const cache = new Array(train.length);
    for (let i = 0; i < train.length; i++) {
      cache[i] = Array.from(tutor.forward(train[i].x, 1).logits);
      if (i % 100 === 99) await new Promise((r) => setTimeout(r, 0));
    }
    let firstLoss = 0;
    const ps = new Float64Array(4), pt = new Float64Array(4);
    function softmaxInto(out, logits) {
      let mm = -1e30; for (let i = 0; i < logits.length; i++) if (logits[i] > mm) mm = logits[i];
      let s = 0; for (let i = 0; i < logits.length; i++) { out[i] = Math.exp(logits[i] - mm); s += out[i]; }
      for (let i = 0; i < out.length; i++) out[i] /= s;
    }
    for (let step = 1; step <= steps; step++) {
      pile.zeroGrad();
      let loss = 0;
      for (let b = 0; b < B; b++) {
        const idx = rng.int(train.length);
        const ex = train[idx];
        const fw = pile.forward(ex.x, 1);
        softmaxInto(pt, cache[idx]);
        softmaxInto(ps, Array.from(fw.logits));
        // soft CE grad
        const d = new Float64Array(4);
        for (let i = 0; i < 4; i++) {
          loss += (-pt[i] * Math.log(ps[i] + 1e-12));
          d[i] = (ps[i] - pt[i]) / B;
        }
        pile.backward(d, fw, null, null, null);
      }
      // freeze trunk: wipe trunk grads before step (head-only)
      for (const k of TRUNK_KEYS) {
        const p = pile[k];
        if (k === "E") p.g.fill(0);
        else { p.W.g.fill(0); p.b.g.fill(0); }
      }
      opt.step(headParams);
      loss /= B;
      if (step === 1) firstLoss = loss;
      if (step % 100 === 0 || step === steps) await new Promise((r) => setTimeout(r, 0));
      if (!Number.isFinite(loss)) return { firstLoss, lastLoss: NaN, stepsDone: step };
    }
    // final loss quick eval
    pile.zeroGrad();
    let el = 0;
    for (let i = 0; i < Math.min(100, train.length); i++) {
      const fw = pile.forward(train[i].x, 1);
      softmaxInto(pt, cache[i]); softmaxInto(ps, Array.from(fw.logits));
      for (let c = 0; c < 4; c++) el += (-pt[c] * Math.log(ps[c] + 1e-12));
    }
    el /= Math.min(100, train.length);
    return { firstLoss: +firstLoss.toFixed(4), lastLoss: +el.toFixed(4), stepsDone: steps };
  }
  // Mouth training (unfrozen full): next-token CE via per-position aux, head+trunk.
  // labs[t] = x[t+1] for t<L-1, last null. Main grad zeroed (19-way final unused).
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
        let nlab = 0;
        for (let t = 0; t < L; t++) {
          if (t >= L - 1) { auxList[t] = null; continue; }
          const ce = G.softmaxCE(fw.cache.posOut[t].logits, x[t + 1]);
          loss += ce.loss / (L - 1);
          const dt = ce.dlogits;
          for (let i = 0; i < dt.length; i++) dt[i] /= (B * (L - 1));
          auxList[t] = dt; nlab++;
        }
        mouth.backward(new Float64Array(19), fw, auxList, null, null);
      }
      opt.step(mouth.params());
      loss /= B;
      if (step === 1) firstLoss = loss;
      if (step % 50 === 0 || step === steps) await new Promise((r) => setTimeout(r, 0));
      if (!Number.isFinite(loss)) return { firstLoss, lastLoss: NaN, stepsDone: step };
    }
    return { firstLoss: +firstLoss.toFixed(4), lastLoss: NaN /*filled by caller eval*/, stepsDone: steps };
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
  function genExamWithMouth(mouth, seed, n) {
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
    G, T, OPTS19, OPTS4, copyTrunk, argmax,
    structuredPool, noisePool, loadWriterBlob, loadE, makePileOnTrunk,
    trainPileHeadOnly, trainMouth, mouthLoss, genExamWithMouth, gradeWithPile, pairStats
  };
};
globalThis.TwinsDualReady = true;
