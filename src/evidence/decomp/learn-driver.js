// src/evidence/decomp/learn-driver.js — rung-2 adapt + E1-E5 (learn-to-learn set).
// Reuses filed recipes; resume-safe COMPLETE-gated ledgers.
globalThis.LearnInit = async function (fs) {
  globalThis.window = globalThis;
  const ORDER = ["src/tinynn/nn.js", "src/tinynn/seeded.js", "src/tinynn/tasks.js", "src/tinynn/train.js"];
  for (const p of ORDER) { const src = await fs.readTextFile(p); (0, eval)(src + "\n//# sourceURL=" + p); }
  // bottleneck helpers (MiniMLP channel) — load source and eval to get fns
  const bnSrc = await fs.readTextFile("src/evidence/decomp/bottleneck-driver.js");
  (0, eval)(bnSrc + "\n//# sourceURL=bottleneck-driver");
  const G = globalThis.__tinyNN, T = globalThis.TinyNN;
  if (!G || !T || !T.trainModel) throw new Error("learn stack load failed");
  return { G, T, TASKS: T.TASKS };
};
function lnShuffle(rng, arr) {
  for (let i = arr.length - 1; i > 0; i--) { const j = rng.int(i + 1); const t = arr[i]; arr[i] = arr[j]; arr[j] = t; }
  return arr;
}
// with-replacement reverse (noveltype baseline, ambiguous)
function lnGenReverseAmbig(rng, nPairs) {
  const keys = lnShuffle(rng, [0, 1, 2, 3]).slice(0, nPairs);
  const pairs = keys.map((k) => [k, 4 + rng.int(4)]);
  const j = rng.int(nPairs);
  const flat = [];
  for (const [k, v] of lnShuffle(rng, pairs.slice())) flat.push(k, v);
  return { flat, y: pairs[j][0], echo: pairs[j][1] - 4, x: flat.concat([pairs[j][1], 8]) };
}
// distinct-values reverse (bottleneck determinism fix)
function lnGenReverseDistinct(rng, nPairs) {
  const keys = lnShuffle(rng, [0, 1, 2, 3]).slice(0, nPairs);
  const vals = lnShuffle(rng, [0, 1, 2, 3]).slice(0, nPairs);
  const pairs = keys.map((k, i) => [k, 4 + vals[i]]);
  const j = rng.int(nPairs);
  const flat = [];
  for (const [k, v] of lnShuffle(rng, pairs.slice())) flat.push(k, v);
  return { flat, y: pairs[j][0], echo: pairs[j][1] - 4, x: flat.concat([pairs[j][1], 8]) };
}
function lnGenFlip(rng, A, nPairs) {
  const ex = A.gen(rng, nPairs);
  return { flat: ex.x.slice(0, ex.x.length - 2), y: ex.y, x: [ex.x[ex.x.length - 2], 8].concat(ex.x.slice(0, ex.x.length - 2)) };
}
function lnRestore(T, G, tut) {
  const rng = G.makeRng(tut.trainSeed);
  const model = T.makeModel(rng, tut.arch);
  const ps = model.params();
  for (let i = 0; i < ps.length; i++) {
    const dst = ps[i].v !== undefined ? ps[i].v : ps[i];
    const src = tut.params[i];
    for (let j = 0; j < dst.length; j++) dst[j] = src[j];
  }
  return model;
}
function lnFinetune(T, G, A, model, data, seed, steps) {
  const rng = G.makeRng(seed);
  const opt = new G.Adam(5e-3);
  const B = 8;
  for (let step = 0; step < steps; step++) {
    model.zeroGrad();
    for (let b = 0; b < B; b++) {
      const ex = data[rng.int(data.length)];
      const fwd = model.forward(ex.x, 1);
      const ce = G.softmaxCE(fwd.logits, ex.y);
      const d = ce.dlogits;
      for (let i = 0; i < d.length; i++) d[i] /= B;
      let auxList = null;
      if (fwd.cache.posOut) {
        const labs = A.bindLabels(ex.x);
        auxList = new Array(ex.x.length);
        for (let t = 0; t < ex.x.length; t++) {
          if (labs[t] == null) { auxList[t] = null; continue; }
          const ceT = G.softmaxCE(fwd.cache.posOut[t].logits, labs[t]);
          const dt = ceT.dlogits;
          for (let i = 0; i < dt.length; i++) dt[i] /= (B * ex.x.length);
          auxList[t] = dt;
        }
      }
      model.backward(d, fwd, auxList, null, null);
    }
    opt.step(model.params());
  }
  return model;
}
// ---- rung-2 adapt base (mixed forward+flip) ----
globalThis.runAdaptBase = async function (fs, log, s) {
  const ledgerPath = "src/evidence/decomp/d-adapt-base-s" + s + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.LearnInit(fs);
  const A = TASKS.assocR;
  const rng = G.makeRng(15400 + s);
  const train = [];
  for (let i = 0; i < 500; i++) train.push(A.gen(rng, 1 + rng.int(3)));
  for (let i = 0; i < 500; i++) train.push(lnGenFlip(rng, A, 1 + rng.int(3)));
  const t0 = Date.now();
  const out = await T.trainModel({ seed: 15500 + s, arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4,
    train, steps: 1200, batch: 16, lr: 5e-3, attnAux: true, attnAuxW: 1.0,
    prefixLabels: (x) => A.bindLabels(x), auxW: 1.0 });
  const wallMs = Date.now() - t0;
  const trng = G.makeRng(15600 + s);
  const test = [];
  for (let i = 0; i < 100; i++) test.push(A.gen(trng, 1 + trng.int(3)));
  for (let i = 0; i < 100; i++) test.push(lnGenFlip(trng, A, 1 + trng.int(3)));
  const acc = T.evaluate(out.model, test, 1).acc;
  const params = out.model.params().map((p) => Array.from(p.v !== undefined ? p.v : p));
  const ledger = { spec: "adapt-v10", seed: s, verdict: acc >= 0.60 ? "COMPLETE" : "ABORT",
    gate: acc >= 0.60 ? "PASS" : "FAIL", testAcc: +acc.toFixed(4), wallMs,
    arch: { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 }, trainSeed: 15500 + s, params };
  await fs.writeTextFile(ledgerPath, JSON.stringify(ledger));
  log("adapt-base s=" + s + " acc=" + ledger.testAcc + " " + ledger.gate);
  return ledger;
};
globalThis.runAdaptFew = async function (fs, log, s, K, arm) {
  const ledgerPath = "src/evidence/decomp/d-adapt-few-K" + K + "-s" + s + "-" + arm + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.LearnInit(fs);
  const A = TASKS.assocR;
  const rng = G.makeRng(14400 + s * 10 + 2);
  const worked = [];
  for (let i = 0; i < K; i++) worked.push(lnGenReverseAmbig(rng, 1 + rng.int(3)));
  let model;
  if (arm === "tutor") {
    const base = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-adapt-base-s" + s + ".json"));
    model = lnRestore(T, G, base);
  } else {
    model = T.makeModel(G.makeRng(14500 + s * 10 + K), { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 });
  }
  // checkpoint evals: same rng prefix => steps-prefix identical
  const ckpts = [25, 50, 100, 200];
  const test = [];
  for (let i = 0; i < 200; i++) test.push(lnGenReverseAmbig(rng, 1 + rng.int(3)));
  const curve = [];
  for (const c of ckpts) {
    // fresh restore then finetune c steps (prefix-identical)
    let m2;
    if (arm === "tutor") {
      const base = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-adapt-base-s" + s + ".json"));
      m2 = lnRestore(T, G, base);
    } else {
      m2 = T.makeModel(G.makeRng(14500 + s * 10 + K), { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 });
    }
    lnFinetune(T, G, A, m2, worked, 14600 + s * 100 + K, c);
    const acc = T.evaluate(m2, test, 1).acc;
    curve.push({ steps: c, acc: +acc.toFixed(4) });
    if (c === 200) model = m2;
  }
  const ledger = { spec: "adapt-v10", seed: s, K, arm, verdict: "COMPLETE", acc: curve[curve.length - 1].acc, curve };
  await fs.writeTextFile(ledgerPath, JSON.stringify(ledger));
  log("adapt-few K=" + K + " s=" + s + " " + arm + " acc=" + ledger.acc + " curve=" + JSON.stringify(curve));
  return ledger;
};
// ---- bottleneck variant (multitutor / kcliff / hygiene-train) with suffix to avoid collisions ----
globalThis.runBnVariant = async function (fs, log, opts) {
  // opts: {K, sigma, seed, tutorSeed, steps, B, lr, suffix, genMode}
  const tag = "K" + opts.K + "-sig" + String(opts.sigma).replace(".", "p") + "-s" + opts.seed + "-" + opts.steps + "st-lr" + String(opts.lr).replace(".", "p") + (opts.suffix || "");
  const ledgerPath = "src/evidence/decomp/d-bottleneck-train-" + tag + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  await globalThis.BottleneckInit(fs);
  // call runBottleneckTrain logic but with suffix path: reimplement thin wrapper using globals
  // We replicate train here to control ledger path + genMode + tutorSeed.
  const { G, T } = await globalThis.BottleneckInit(fs);
  const tut = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-novel-tutor-s" + opts.tutorSeed + ".json"));
  const rng0 = G.makeRng(tut.trainSeed);
  const teacher = T.makeModel(rng0, tut.arch);
  { const ps = teacher.params();
    for (let i = 0; i < ps.length; i++) {
      const dst = ps[i].v !== undefined ? ps[i].v : ps[i];
      const src = tut.params[i];
      for (let j = 0; j < dst.length; j++) dst[j] = src[j];
    } }
  // local bn helpers (copied names from bottleneck-driver scope are not visible; re-define minimal)
  function sh(rng, arr) { for (let i = arr.length - 1; i > 0; i--) { const j = rng.int(i + 1); const t = arr[i]; arr[i] = arr[j]; arr[j] = t; } return arr; }
  function genD(rng, nP) {
    const keys = sh(rng, [0, 1, 2, 3]).slice(0, nP);
    const vals = sh(rng, [0, 1, 2, 3]).slice(0, nP);
    const pairs = keys.map((k, i) => [k, 4 + vals[i]]);
    const j = rng.int(nP);
    const flat = [];
    for (const [k, v] of sh(rng, pairs.slice())) flat.push(k, v);
    return { flat, y: pairs[j][0], x: flat.concat([pairs[j][1], 8]) };
  }
  function genA(rng, nP) {
    const keys = sh(rng, [0, 1, 2, 3]).slice(0, nP);
    const pairs = keys.map((k) => [k, 4 + rng.int(4)]);
    const j = rng.int(nP);
    const flat = [];
    for (const [k, v] of sh(rng, pairs.slice())) flat.push(k, v);
    return { flat, y: pairs[j][0], x: flat.concat([pairs[j][1], 8]) };
  }
  const genFn = opts.genMode === "ambig" ? genA : genD;
  function bp(rng, n, inF) { const a = Math.sqrt(2 / inF); const v = new Float64Array(n); for (let i = 0; i < n; i++) v[i] = rng.uniform(-a, a); return { v, g: new Float64Array(n) }; }
  const K = opts.K, sigma = opts.sigma;
  const initRng = G.makeRng(22000 + opts.seed * 7919 + K * 131 + Math.round(sigma * 10) * 17 + opts.tutorSeed + (opts.suffix ? opts.suffix.length * 977 : 0));
  const P = { W: bp(initRng, K * 48, 48), b: bp(initRng, K, 48) };
  const S = { W1: bp(initRng, (K + 9) * 96, K + 9), b1: bp(initRng, 96, K + 9), W2: bp(initRng, 96 * 4, 96), b2: bp(initRng, 4, 96) };
  const params = [P.W, P.b, S.W1, S.b1, S.W2, S.b2];
  const opt = new G.Adam(opts.lr || 5e-3);
  const dataRng = G.makeRng(21000 + opts.seed * 104729 + K * 1013 + Math.round(sigma * 10) * 101 + opts.tutorSeed * 7);
  const noiseRng = G.makeRng(23000 + opts.seed * 99991 + K * 101 + Math.round(sigma * 10));
  function silu(x) { return x / (1 + Math.exp(-x)); }
  const t0 = Date.now();
  const curve = [];
  for (let step = 0; step < opts.steps; step++) {
    for (const p of params) p.g.fill(0);
    let lsum = 0;
    for (let b = 0; b < opts.B; b++) {
      const L = genFn(dataRng, 1 + dataRng.int(3));
      const fw = teacher.forward(L.x, 1);
      const state = Array.from(fw.cache.rC.y);
      const m = new Float64Array(K);
      for (let k = 0; k < K; k++) { let s = P.b.v[k]; const off = k * 48; for (let j = 0; j < 48; j++) s += P.W.v[off + j] * state[j]; if (noiseRng) s += sigma * noiseRng.normal(1); m[k] = s; }
      const inDim = K + 9;
      const inp = new Float64Array(inDim);
      inp.set(m, 0); inp[K + L.x[L.x.length - 2]] = 1;
      const hPre = new Float64Array(96);
      for (let o = 0; o < 96; o++) { let s = S.b1.v[o]; const off = o * inDim; for (let i = 0; i < inDim; i++) s += S.W1.v[off + i] * inp[i]; hPre[o] = s; }
      const h = new Float64Array(96);
      for (let o = 0; o < 96; o++) h[o] = silu(hPre[o]);
      const logits = new Float64Array(4);
      for (let o = 0; o < 4; o++) { let s = S.b2.v[o]; const off = o * 96; for (let i = 0; i < 96; i++) s += S.W2.v[off + i] * h[i]; logits[o] = s; }
      let mx = -1e300;
      for (let i = 0; i < 4; i++) if (logits[i] > mx) mx = logits[i];
      const pr = new Float64Array(4);
      let sm = 0;
      for (let i = 0; i < 4; i++) { pr[i] = Math.exp(logits[i] - mx); sm += pr[i]; }
      for (let i = 0; i < 4; i++) pr[i] /= sm;
      lsum += -Math.log(pr[L.y] + 1e-12);
      const dz = new Float64Array(4);
      for (let i = 0; i < 4; i++) dz[i] = (pr[i] - (i === L.y ? 1 : 0)) / opts.B;
      // backward
      const dh = new Float64Array(96);
      for (let o = 0; o < 4; o++) { const d = dz[o]; S.b2.g[o] += d; const off = o * 96; for (let i = 0; i < 96; i++) { S.W2.g[off + i] += d * h[i]; dh[i] += d * S.W2.v[off + i]; } }
      const dinp = new Float64Array(inDim);
      for (let o = 0; o < 96; o++) {
        const sig = 1 / (1 + Math.exp(-hPre[o]));
        const d = dh[o] * (h[o] + sig * (1 - h[o]));
        S.b1.g[o] += d;
        const off = o * inDim;
        for (let i = 0; i < inDim; i++) { S.W1.g[off + i] += d * inp[i]; dinp[i] += d * S.W1.v[off + i]; }
      }
      for (let k = 0; k < K; k++) { P.b.g[k] += dinp[k]; const off = k * 48; for (let j = 0; j < 48; j++) P.W.g[off + j] += dinp[k] * state[j]; }
    }
    opt.step(params);
    if (step % 25 === 0 || step === opts.steps - 1) curve.push({ step, loss: +(lsum / opts.B).toFixed(6) });
  }
  const saveP = (o) => Array.from(o.v);
  const body = { spec: "bottleneck-variant", arm: "T-frozen", verdict: "COMPLETE", K, sigma, seed: opts.seed, tutorSeed: opts.tutorSeed, steps: opts.steps, B: opts.B, lr: opts.lr || 5e-3, suffix: opts.suffix || "", genMode: opts.genMode || "distinct", wallMs: Date.now() - t0, curve, P: { W: saveP(P.W), b: saveP(P.b) }, St: { W1: saveP(S.W1), b1: saveP(S.b1), W2: saveP(S.W2), b2: saveP(S.b2) } };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("bn-variant " + tag + " lossN=" + curve[curve.length - 1].loss);
  return body;
};
globalThis.runBnVariantEval = async function (fs, log, opts) {
  const tag = "K" + opts.K + "-sig" + String(opts.sigma).replace(".", "p") + "-s" + opts.seed + "-" + opts.steps + "st-lr" + String(opts.lr).replace(".", "p") + (opts.suffix || "");
  const trainPath = "src/evidence/decomp/d-bottleneck-train-" + tag + ".json";
  const evalPath = "src/evidence/decomp/d-bottleneck-eval-" + tag + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(evalPath));
    if (prev && prev.verdict === "COMPLETE") { log(evalPath + " exists, skip"); return prev; }
  } catch (e) {}
  const tr = JSON.parse(await fs.readTextFile(trainPath));
  if (tr.verdict !== "COMPLETE") throw new Error("train missing " + tag);
  const { G, T } = await globalThis.BottleneckInit(fs);
  const tut = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-novel-tutor-s" + opts.tutorSeed + ".json"));
  const teacher = T.makeModel(G.makeRng(tut.trainSeed), tut.arch);
  { const ps = teacher.params(); for (let i = 0; i < ps.length; i++) { const dst = ps[i].v !== undefined ? ps[i].v : ps[i]; const src = tut.params[i]; for (let j = 0; j < dst.length; j++) dst[j] = src[j]; } }
  const P = { W: { v: Float64Array.from(tr.P.W) }, b: { v: Float64Array.from(tr.P.b) } };
  const S = { W1: { v: Float64Array.from(tr.St.W1) }, b1: { v: Float64Array.from(tr.St.b1) }, W2: { v: Float64Array.from(tr.St.W2) }, b2: { v: Float64Array.from(tr.St.b2) } };
  const K = opts.K, sigma = opts.sigma;
  function sh2(rng, arr) { for (let i = arr.length - 1; i > 0; i--) { const j = rng.int(i + 1); const t = arr[i]; arr[i] = arr[j]; arr[j] = t; } return arr; }
  function silu(x) { return x / (1 + Math.exp(-x)); }
  const testRng = G.makeRng(24000 + opts.seed * 13 + opts.tutorSeed + (opts.suffix ? opts.suffix.length * 31 : 0));
  const noiseRng = G.makeRng(26000 + opts.seed * 17 + K + Math.round(sigma * 10));
  const N = 200;
  const items = [];
  for (let i = 0; i < N; i++) {
    const keys = sh2(testRng, [0, 1, 2, 3]).slice(0, 1 + testRng.int(3));
    const nP = keys.length;
    const vals = sh2(testRng, [0, 1, 2, 3]).slice(0, nP);
    const pairs = keys.map((k, ii) => [k, 4 + vals[ii]]);
    const j = testRng.int(nP);
    const flat = [];
    for (const [k, v] of sh2(testRng, pairs.slice())) flat.push(k, v);
    const Lx = flat.concat([pairs[j][1], 8]);
    const y = pairs[j][0];
    const fw = teacher.forward(Lx, 1);
    const state = Array.from(fw.cache.rC.y);
    const msg = new Float64Array(K);
    for (let k = 0; k < K; k++) { let s = P.b.v[k]; const off = k * 48; for (let jj = 0; jj < 48; jj++) s += P.W.v[off + jj] * state[jj]; s += sigma * noiseRng.normal(1); msg[k] = s; }
    items.push({ y, q: Lx[Lx.length - 2], msg });
  }
  function accOf(arr) {
    let r = 0;
    for (const it of arr) {
      const inDim = K + 9;
      const inp = new Float64Array(inDim);
      inp.set(it.msg, 0); inp[K + it.q] = 1;
      const hPre = new Float64Array(96);
      for (let o = 0; o < 96; o++) { let s = S.b1.v[o]; const off = o * inDim; for (let ii = 0; ii < inDim; ii++) s += S.W1.v[off + ii] * inp[ii]; hPre[o] = s; }
      // silu
      const h = new Float64Array(96);
      for (let o = 0; o < 96; o++) h[o] = hPre[o] / (1 + Math.exp(-hPre[o]));
      let b = 0, bv = -1e300;
      for (let o = 0; o < 4; o++) { let s = S.b2.v[o]; const off = o * 96; for (let ii = 0; ii < 96; ii++) s += S.W2.v[off + ii] * h[ii]; if (s > bv) { bv = s; b = o; } }
      if (b === it.y) r++;
    }
    return r / arr.length;
  }
  const aIntact = accOf(items);
  const scr = items.map((it) => it.msg);
  sh2(G.makeRng(25000 + opts.seed), scr);
  const aScr = accOf(items.map((it, i) => ({ y: it.y, q: it.q, msg: scr[i] })));
  const body = { spec: "bottleneck-variant", arm: "T-frozen", verdict: "COMPLETE", K, sigma, seed: opts.seed, tutorSeed: opts.tutorSeed, steps: opts.steps, lr: opts.lr, suffix: opts.suffix || "", n: N, accIntact: +aIntact.toFixed(4), accScrambled: +aScr.toFixed(4), chance: 0.25 };
  await fs.writeTextFile(evalPath, JSON.stringify(body));
  log("bn-variant-eval " + tag + " intact=" + body.accIntact + " scr=" + body.accScrambled);
  return body;
};
// ---- E3 lesion + E5 hygiene evals (reuse filed K4 models) ----
globalThis.runMsgLesion = async function (fs, log, seed) {
  const ledgerPath = "src/evidence/decomp/d-msglesion-K4-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T } = await globalThis.BottleneckInit(fs);
  const tut = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-novel-tutor-s0.json"));
  const teacher = T.makeModel(G.makeRng(tut.trainSeed), tut.arch);
  { const ps = teacher.params(); for (let i = 0; i < ps.length; i++) { const dst = ps[i].v !== undefined ? ps[i].v : ps[i]; const src = tut.params[i]; for (let j = 0; j < dst.length; j++) dst[j] = src[j]; } }
  const tag = "K4-sig0p5-s" + seed + "-8000st-lr0p001";
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-bottleneck-train-" + tag + ".json"));
  const P = { W: Float64Array.from(tr.P.W), b: Float64Array.from(tr.P.b) };
  // (S unused directly; filed arrays tr.St.* used in accMask below)
  const K = 4, sigma = 0.5;
  function sh(rng, arr) { for (let i = arr.length - 1; i > 0; i--) { const j = rng.int(i + 1); const t = arr[i]; arr[i] = arr[j]; arr[j] = t; } return arr; }
  const testRng = G.makeRng(24000 + seed * 13);
  const noiseRng = G.makeRng(26000 + seed * 17 + K + 5);
  const W = Float64Array.from(tr.P.W);
  const items = [];
  for (let i = 0; i < 200; i++) {
    const keys = sh(testRng, [0, 1, 2, 3]).slice(0, 1 + testRng.int(3));
    const nP = keys.length;
    const vals = sh(testRng, [0, 1, 2, 3]).slice(0, nP);
    const pairs = keys.map((k, ii) => [k, 4 + vals[ii]]);
    const j = testRng.int(nP);
    const flat = [];
    for (const [k, v] of sh(testRng, pairs.slice())) flat.push(k, v);
    const Lx = flat.concat([pairs[j][1], 8]);
    const fw = teacher.forward(Lx, 1);
    const state = Array.from(fw.cache.rC.y);
    const msg = new Float64Array(K);
    for (let k = 0; k < K; k++) { let s = tr.P.b[k]; const off = k * 48; for (let jj = 0; jj < 48; jj++) s += W[off + jj] * state[jj]; s += sigma * noiseRng.normal(1); msg[k] = s; }
    items.push({ y: pairs[j][0], q: Lx[Lx.length - 2], msg });
  }
  function accMask(mask) {
    let r = 0;
    for (const it of items) {
      const m = Float64Array.from(it.msg);
      for (let k = 0; k < K; k++) if (mask[k] === 0) m[k] = 0;
      const inDim = K + 9;
      const inp = new Float64Array(inDim);
      inp.set(m, 0); inp[K + it.q] = 1;
      const hPre = new Float64Array(96);
      for (let o = 0; o < 96; o++) { let s = tr.St.b1[o]; const off = o * inDim; for (let ii = 0; ii < inDim; ii++) s += tr.St.W1[off + ii] * inp[ii]; hPre[o] = s; }
      const h = new Float64Array(96);
      for (let o = 0; o < 96; o++) h[o] = hPre[o] / (1 + Math.exp(-hPre[o]));
      let b = 0, bv = -1e300;
      for (let o = 0; o < 4; o++) { let s = tr.St.b2[o]; const off = o * 96; for (let ii = 0; ii < 96; ii++) s += tr.St.W2[off + ii] * h[ii]; if (s > bv) { bv = s; b = o; } }
      if (b === it.y) r++;
    }
    return r / items.length;
  }
  const intact = accMask([1, 1, 1, 1]);
  const drops = [];
  for (let k = 0; k < K; k++) { const m = [1, 1, 1, 1]; m[k] = 0; drops.push(+accMask(m).toFixed(4)); }
  const body = { spec: "msglesion-v10", seed, verdict: "COMPLETE", intact: +intact.toFixed(4), lesionAcc: drops, drops: drops.map((d) => +(intact - d).toFixed(4)) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("msglesion s=" + seed + " intact=" + body.intact + " lesions=" + JSON.stringify(drops));
  return body;
};
globalThis.runHygieneAmbigeval = async function (fs, log, seed) {
  const ledgerPath = "src/evidence/decomp/d-hygiene-ambigeval-K4-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T } = await globalThis.BottleneckInit(fs);
  const tut = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-novel-tutor-s0.json"));
  const teacher = T.makeModel(G.makeRng(tut.trainSeed), tut.arch);
  { const ps = teacher.params(); for (let i = 0; i < ps.length; i++) { const dst = ps[i].v !== undefined ? ps[i].v : ps[i]; const src = tut.params[i]; for (let j = 0; j < dst.length; j++) dst[j] = src[j]; } }
  const tag = "K4-sig0p5-s" + seed + "-8000st-lr0p001";
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-bottleneck-train-" + tag + ".json"));
  const filedEval = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-bottleneck-eval-" + tag + ".json"));
  const K = 4, sigma = 0.5;
  function sh(rng, arr) { for (let i = arr.length - 1; i > 0; i--) { const j = rng.int(i + 1); const t = arr[i]; arr[i] = arr[j]; arr[j] = t; } return arr; }
  const testRng = G.makeRng(37000 + seed);
  const noiseRng = G.makeRng(38000 + seed);
  let hit = 0;
  const N = 200;
  for (let i = 0; i < N; i++) {
    const L = lnGenReverseAmbig(testRng, 1 + testRng.int(3));
    const fw = teacher.forward(L.x, 1);
    const state = Array.from(fw.cache.rC.y);
    const msg = new Float64Array(K);
    const W = Float64Array.from(tr.P.W);
    for (let k = 0; k < K; k++) { let s = tr.P.b[k]; const off = k * 48; for (let jj = 0; jj < 48; jj++) s += W[off + jj] * state[jj]; s += sigma * noiseRng.normal(1); msg[k] = s; }
    const inDim = K + 9;
    const inp = new Float64Array(inDim);
    inp.set(msg, 0); inp[K + L.x[L.x.length - 2]] = 1;
    const hPre = new Float64Array(96);
    for (let o = 0; o < 96; o++) { let s = tr.St.b1[o]; const off = o * inDim; for (let ii = 0; ii < inDim; ii++) s += tr.St.W1[off + ii] * inp[ii]; hPre[o] = s; }
    const h = new Float64Array(96);
    for (let o = 0; o < 96; o++) h[o] = hPre[o] / (1 + Math.exp(-hPre[o]));
    let b = 0, bv = -1e300;
    for (let o = 0; o < 4; o++) { let s = tr.St.b2[o]; const off = o * 96; for (let ii = 0; ii < 96; ii++) s += tr.St.W2[off + ii] * h[ii]; if (s > bv) { bv = s; b = o; } }
    if (b === L.y) hit++;
  }
  const body = { spec: "hygiene-v10", seed, verdict: "COMPLETE", distinctAcc: filedEval.accIntact, ambigAcc: +(hit / N).toFixed(4), tax: +(filedEval.accIntact - hit / N).toFixed(4) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("hygiene s=" + seed + " distinct=" + body.distinctAcc + " ambig=" + body.ambigAcc);
  return body;
};
// ---- E4 self-directed ----
globalThis.runSelfDir = async function (fs, log, seed, arm) {
  const ledgerPath = "src/evidence/decomp/d-selfdir-" + arm + "-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.LearnInit(fs);
  const A = TASKS.assocR;
  const model = T.makeModel(G.makeRng(16500 + seed * 100 + (arm === "self" ? 1 : 0)), { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 });
  const opt = new G.Adam(5e-3);
  const dataRng = G.makeRng(16600 + seed);
  const B = 16, STEPS = 1200;
  const t0 = Date.now();
  for (let step = 0; step < STEPS; step++) {
    let batch;
    if (arm === "random") {
      batch = [];
      for (let b = 0; b < B; b++) batch.push(A.gen(dataRng, 1 + dataRng.int(3)));
    } else {
      const cands = [];
      for (let b = 0; b < 16; b++) cands.push(A.gen(dataRng, 1 + dataRng.int(3)));
      // score by current CE
      const scored = cands.map((ex) => {
        const fw = model.forward(ex.x, 1);
        const ce = G.softmaxCE(fw.logits, ex.y);
        return { ex, loss: ce.loss };
      });
      scored.sort((a, b2) => b2.loss - a.loss);
      batch = scored.slice(0, 8).map((s) => s.ex);
      for (let b = 0; b < 8; b++) batch.push(A.gen(dataRng, 1 + dataRng.int(3)));
      // interleave deterministically via dataRng
      for (let i = batch.length - 1; i > 0; i--) { const j = dataRng.int(i + 1); const t = batch[i]; batch[i] = batch[j]; batch[j] = t; }
    }
    model.zeroGrad();
    for (let b = 0; b < B; b++) {
      const ex = batch[b];
      const fw = model.forward(ex.x, 1);
      const ce = G.softmaxCE(fw.logits, ex.y);
      const d = ce.dlogits;
      for (let i = 0; i < d.length; i++) d[i] /= B;
      let attnX = null;
      const sup = T.attnSupervision ? T.attnSupervision(ex, fw) : null;
      if (sup) {
        const dw = sup.dw;
        for (let j = 0; j < dw.length; j++) dw[j] /= B;
        attnX = { dw };
      }
      let auxList = null;
      if (fw.cache.posOut) {
        const labs = A.bindLabels(ex.x);
        auxList = new Array(ex.x.length);
        for (let t = 0; t < ex.x.length; t++) {
          if (labs[t] == null) { auxList[t] = null; continue; }
          const ceT = G.softmaxCE(fw.cache.posOut[t].logits, labs[t]);
          const dt = ceT.dlogits;
          for (let i = 0; i < dt.length; i++) dt[i] /= (B * ex.x.length);
          auxList[t] = dt;
        }
      }
      model.backward(d, fw, auxList, attnX, null);
    }
    opt.step(model.params());
  }
  const wallMs = Date.now() - t0;
  const trng = G.makeRng(16700 + seed);
  const inD = [];
  for (let i = 0; i < 200; i++) inD.push(A.gen(trng, 1 + trng.int(3)));
  const long = [];
  for (let i = 0; i < 200; i++) long.push(A.gen(trng, 5));
  const aIn = T.evaluate(model, inD, 1).acc;
  const aLong = T.evaluate(model, long, 1).acc;
  const body = { spec: "selfdir-v10", seed, arm, verdict: "COMPLETE", wallMs, accIn: +aIn.toFixed(4), accLong: +aLong.toFixed(4) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("selfdir " + arm + " s=" + seed + " in=" + body.accIn + " long=" + body.accLong);
  return body;
};
