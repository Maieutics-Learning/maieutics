// scratch/p3-twins-joint.js — joint trunk+mouth+ear trainer for v0.7.
// One shared trunk (same param OBJECTS by reference), two heads. Update per
// step: mouth backward + ear backward accumulate into shared trunk grads,
// trunk grad x0.5 (average), ONE Adam step over trunk + both heads.
// v0.6 harness untouched; this file is new.
globalThis.TwinsJointInit = async function (fs) {
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
  // Share by reference: dst trunk entries BECOME src's objects.
  function shareTrunk(dst, src) {
    for (const k of TRUNK_KEYS) dst[k] = src[k];
  }
  function trunkParams(m) { return m.params().slice(0, 15); } // E + 7 linears x2
  function softmaxArr(a) {
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
  async function loadWriterBlob(path) {
    const j = JSON.parse(await fs.readTextFile(path));
    const model = T.makeModel(G.makeRng(1), OPTS19);
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
  function checksumE(model) {
    // audit checksum (not the filed SHA): first 8 E values rounded.
    const v = model.E.v, o = [];
    for (let i = 0; i < 8; i++) o.push(+v[i].toFixed(6));
    return o;
  }
  async function loadD1a() {
    const j = JSON.parse(await fs.readTextFile("src/evidence/d1a/tutor.json"));
    if (!j.opts || j.opts.vocab !== 19 || j.opts.h !== 48) throw new Error("d1a opts mismatch: " + JSON.stringify(j.opts));
    const m = T.gseries.loadModel(j);
    if (m.params().length !== 17) throw new Error("d1a param count " + m.params().length);
    return { model: m, checksum: checksumE(m) };
  }
  // N-arm pair: mouth = writer blob; pile = fresh head sharing mouth's trunk.
  async function makeNPair(writerPath, pileHeadSeed) {
    const mouth = await loadWriterBlob(writerPath);
    const pile = T.makeModel(G.makeRng(pileHeadSeed), OPTS4);
    shareTrunk(pile, mouth);
    return { mouth, pile };
  }
  // E-arm pair: trunk values from d1a; fresh mouth head + fresh pile head.
  async function makeEPair(d1aModel, mouthHeadSeed, pileHeadSeed) {
    const mouth = T.makeModel(G.makeRng(mouthHeadSeed), OPTS19);
    copyTrunk(d1aModel, mouth); // trunk from d1a, head stays fresh-random
    const pile = T.makeModel(G.makeRng(pileHeadSeed), OPTS4);
    shareTrunk(pile, mouth);
    return { mouth, pile };
  }
  // Joint training. Returns ledger-ish {firstMouth,lastMouth,firstEar,lastEar,
  // stepsDone,halted,anchorTrail}. HALT conditions per spec: anchor>max, NaN.
  async function trainJoint(mouth, pile, tutor, train, o) {
    const steps = o.steps, seed = o.seed, lambda = (o.lambda == null ? 1.0 : o.lambda);
    const B = o.batch || 8, lr = o.lr || 5e-3;
    const anchorPool = o.anchorPool, anchorEvery = o.anchorEvery || 200, anchorMax = o.anchorMax || 2.6;
    const rng = G.makeRng(seed);
    const opt = new G.Adam(lr);
    const trunk = trunkParams(mouth);
    const allParams = trunk.concat([mouth.Lout.W, mouth.Lout.b, pile.Lout.W, pile.Lout.b]);
    // Tutor T1 cache (r=1 only).
    const cache = new Array(train.length);
    for (let i = 0; i < train.length; i++) {
      cache[i] = Array.from(tutor.forward(train[i].x, 1).logits);
      if (!cache[i].every(Number.isFinite)) return { halted: "ABORT: tutor cache non-finite at " + i, stepsDone: 0 };
      if (i % 200 === 199) await new Promise((r) => setTimeout(r, 0));
    }
    const Z19 = new Float64Array(19);
    const ps4 = new Float64Array(4), pt4 = new Float64Array(4);
    function softInto(out, logits) {
      let mm = -1e30; for (let i = 0; i < logits.length; i++) if (logits[i] > mm) mm = logits[i];
      let s = 0; for (let i = 0; i < logits.length; i++) { out[i] = Math.exp(logits[i] - mm); s += out[i]; }
      for (let i = 0; i < out.length; i++) out[i] /= s;
    }
    let firstMouth = 0, firstEar = 0, lastEarStep = 0;
    const anchorTrail = [];
    for (let step = 1; step <= steps; step++) {
      mouth.zeroGrad(); // zeroes shared trunk + mouth head
      pile.Lout.W.g.fill(0); pile.Lout.b.g.fill(0);
      let lm = 0, le = 0;
      for (let b = 0; b < B; b++) {
        const idx = rng.int(train.length);
        const ex = train[idx], x = ex.x, L = x.length;
        // (1) mouth: next-token aux
        const fwM = mouth.forward(x, 1);
        const auxList = new Array(L);
        for (let t = 0; t < L; t++) {
          if (t >= L - 1) { auxList[t] = null; continue; }
          const ce = G.softmaxCE(fwM.cache.posOut[t].logits, x[t + 1]);
          lm += ce.loss / (L - 1);
          const dt = ce.dlogits;
          for (let i = 0; i < dt.length; i++) dt[i] /= (B * (L - 1));
          auxList[t] = dt;
        }
        mouth.backward(Z19, fwM, auxList, null);
        // (2) ear: soft CE vs tutor
        const fwP = pile.forward(x, 1);
        softInto(pt4, cache[idx]);
        softInto(ps4, Array.from(fwP.logits));
        const d = new Float64Array(4);
        for (let i = 0; i < 4; i++) {
          le += (-pt4[i] * Math.log(ps4[i] + 1e-12));
          d[i] = lambda * (ps4[i] - pt4[i]) / B;
        }
        pile.backward(d, fwP, null, null);
      }
      // (3) average trunk grads (two accumulations -> /2); heads keep full.
      for (const p of trunk) { const g = p.g; for (let i = 0; i < g.length; i++) g[i] *= 0.5; }
      // (4) one Adam step
      opt.step(allParams);
      lm /= B; le /= B;
      if (step === 1) { firstMouth = lm; firstEar = le; }
      lastEarStep = le;
      if (!Number.isFinite(lm) || !Number.isFinite(le))
        return { firstMouth: +firstMouth.toFixed(4), firstEar: +firstEar.toFixed(4), halted: "ABORT: non-finite loss at step " + step, stepsDone: step, anchorTrail };
      if (step % anchorEvery === 0 || step === steps) {
        const a = mouthLoss(mouth, anchorPool, anchorPool.length);
        anchorTrail.push({ step, mouthLoss: a });
        if (!Number.isFinite(a)) return { firstMouth: +firstMouth.toFixed(4), firstEar: +firstEar.toFixed(4), halted: "ABORT: anchor non-finite at step " + step, stepsDone: step, anchorTrail };
        if (a > anchorMax) return { firstMouth: +firstMouth.toFixed(4), firstEar: +firstEar.toFixed(4), lastMouth: a, lastEar: +le.toFixed(4), halted: "HALT: mouth anchor " + a + " > " + anchorMax + " at step " + step, stepsDone: step, anchorTrail };
        await new Promise((r) => setTimeout(r, 0));
      }
      if (step % 50 === 0) await new Promise((r) => setTimeout(r, 0));
    }
    const lastM = mouthLoss(mouth, anchorPool, anchorPool.length);
    return { firstMouth: +firstMouth.toFixed(4), lastMouth: lastM, firstEar: +firstEar.toFixed(4), lastEar: +lastEarStep.toFixed(4), stepsDone: steps, halted: null, anchorTrail };
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
  // U1: per-position next-token argmax agreement between two mouths.
  function perPosAgreement(mA, mB, lines) {
    let a = 0, n = 0;
    for (const x of lines) {
      const L = x.length;
      const fA = mA.forward(x, 1), fB = mB.forward(x, 1);
      for (let t = 0; t < L - 1; t++) {
        const la = Array.from(fA.cache.posOut[t].logits);
        const lb = Array.from(fB.cache.posOut[t].logits);
        let ba = 0, bb = 0;
        for (let i = 1; i < la.length; i++) { if (la[i] > la[ba]) ba = i; if (lb[i] > lb[bb]) bb = i; }
        if (ba === bb) a++;
        n++;
      }
    }
    return n ? +(a / n).toFixed(4) : 0;
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
        lines.push(null); // placeholder guard (removed below)
        lines.pop();
        const logits = Array.from(pos[pos.length - 1].logits);
        x.push(sampleCat(rng, softmaxArr(logits)));
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
  function saveBlob(model, opts) { return T.gseries.saveModel(model, opts); }
  return {
    G, T, OPTS19, OPTS4, TRUNK_KEYS, copyTrunk, shareTrunk, trunkParams,
    structuredPool, noisePool, loadWriterBlob, loadD1a, checksumE,
    makeNPair, makeEPair, trainJoint, mouthLoss, perPosAgreement,
    genExamWithMouth, gradeWithPile, pairStats, saveBlob
  };
};
globalThis.TwinsJointReady = true;
