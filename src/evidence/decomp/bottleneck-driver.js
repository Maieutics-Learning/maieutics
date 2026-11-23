// src/evidence/decomp/bottleneck-driver.js — bottleneck game (bottleneck-v10-prereg).
// Teacher (filed tutor, FROZEN) -> K-dim noisy message -> fresh MiniMLP student.
// Student sees ONLY message + query token; pairs never shown. Manual backward,
// G.Adam(5e-3), Float64Array throughout. T-joint arm NOT implemented (see verdict;
// teacher-side injection backward is not supported by nn.js backward).
globalThis.BottleneckInit = async function (fs) {
  globalThis.window = globalThis;
  const ORDER = ["src/tinynn/nn.js", "src/tinynn/seeded.js", "src/tinynn/tasks.js", "src/tinynn/train.js"];
  for (const p of ORDER) { const src = await fs.readTextFile(p); (0, eval)(src + "\n//# sourceURL=" + p); }
  const G = globalThis.__tinyNN, T = globalThis.TinyNN;
  if (!G || !T || !T.trainModel || !G.Adam || !G.makeRng) throw new Error("bottleneck stack load failed");
  return { G, T, TASKS: T.TASKS };
};

function bnShuffleIn(rng, arr) {
  for (let i = arr.length - 1; i > 0; i--) { const j = rng.int(i + 1); const t = arr[i]; arr[i] = arr[j]; arr[j] = t; }
  return arr;
}
// Reverse-question line with DISTINCT values per line (determinism fix).
// genReverse draws values with replacement: with 3 pairs x 4 values, ~62% of
// lines repeat a value, making the reverse query ambiguous (two keys bound to
// the queried value; y is only one of them). Filed as duplicate-key ambiguity
// in probe11. A stochastic target would cap every bottleneck cell for the
// wrong reason, so values are sampled without replacement. Keys (distinct by
// construction) and query format are unchanged.
function bnGenReverse(rng, nPairs) {
  const keys = bnShuffleIn(rng, [0, 1, 2, 3]).slice(0, nPairs);
  const vals = bnShuffleIn(rng, [0, 1, 2, 3]).slice(0, nPairs);
  const pairs = keys.map((k, i) => [k, 4 + vals[i]]);
  const j = rng.int(nPairs);
  const flat = [];
  for (const [k, v] of bnShuffleIn(rng, pairs.slice())) flat.push(k, v);
  return { flat, y: pairs[j][0], echo: pairs[j][1] - 4, x: flat.concat([pairs[j][1], 8]) };
}

function bnParam(rng, n, inF) {
  const a = Math.sqrt(2 / inF);
  const v = new Float64Array(n);
  for (let i = 0; i < n; i++) v[i] = rng.uniform(-a, a);
  return { v, g: new Float64Array(n) };
}
function bnSilu(x) { return x / (1 + Math.exp(-x)); }

function bnChannelFwd(P, K, state, noiseRng, sigma) {
  const m = new Float64Array(K);
  for (let k = 0; k < K; k++) {
    let s = P.b.v[k];
    const off = k * 48;
    for (let j = 0; j < 48; j++) s += P.W.v[off + j] * state[j];
    if (noiseRng) s += sigma * noiseRng.normal(1);
    m[k] = s;
  }
  return m;
}
function bnStudentFwd(S, K, msg, queryTok) {
  const inDim = K + 9;
  const inp = new Float64Array(inDim);
  inp.set(msg, 0);
  inp[K + queryTok] = 1;
  const hPre = new Float64Array(96);
  for (let o = 0; o < 96; o++) {
    let s = S.b1.v[o];
    const off = o * inDim;
    for (let i = 0; i < inDim; i++) s += S.W1.v[off + i] * inp[i];
    hPre[o] = s;
  }
  const h = new Float64Array(96);
  for (let o = 0; o < 96; o++) h[o] = bnSilu(hPre[o]);
  const logits = new Float64Array(4);
  for (let o = 0; o < 4; o++) {
    let s = S.b2.v[o];
    const off = o * 96;
    for (let i = 0; i < 96; i++) s += S.W2.v[off + i] * h[i];
    logits[o] = s;
  }
  return { inp, hPre, h, logits };
}
// Full backward from answer-CE dlogits (already batch-scaled by caller). Accumulates into S + P grads.
function bnBackward(S, P, K, fwd, msg, state, dlogits) {
  const inDim = K + 9;
  const dh = new Float64Array(96);
  for (let o = 0; o < 4; o++) {
    const d = dlogits[o];
    S.b2.g[o] += d;
    const off = o * 96;
    for (let i = 0; i < 96; i++) { S.W2.g[off + i] += d * fwd.h[i]; dh[i] += d * S.W2.v[off + i]; }
  }
  const dinp = new Float64Array(inDim);
  for (let o = 0; o < 96; o++) {
    const sig = 1 / (1 + Math.exp(-fwd.hPre[o]));
    const d = dh[o] * (fwd.h[o] + sig * (1 - fwd.h[o])); // d silu(x)/dx = silu + sig(1-silu)
    S.b1.g[o] += d;
    const off = o * inDim;
    for (let i = 0; i < inDim; i++) { S.W1.g[off + i] += d * fwd.inp[i]; dinp[i] += d * S.W1.v[off + i]; }
  }
  const dm = dinp.subarray(0, K);
  for (let k = 0; k < K; k++) {
    P.b.g[k] += dm[k];
    const off = k * 48;
    for (let j = 0; j < 48; j++) P.W.g[off + j] += dm[k] * state[j];
  }
}
// Train one cell. opts: {K, sigma, seed(s), tutorSeed, steps, B, lr}.
globalThis.runBottleneckTrain = async function (fs, log, opts) {
  const { K, sigma, seed, tutorSeed, steps, B } = opts;
  const lr = opts.lr || 5e-3;
  const tag = "K" + K + "-sig" + String(sigma).replace(".", "p") + "-s" + seed + "-" + (opts.steps || 0) + "st-lr" + String(opts.lr || 0).replace(".", "p");
  const ledgerPath = "src/evidence/decomp/d-bottleneck-train-" + tag + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.BottleneckInit(fs);
  const tut = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-novel-tutor-s" + tutorSeed + ".json"));
  const rng0 = G.makeRng(tut.trainSeed);
  const teacher = T.makeModel(rng0, tut.arch);
  { const ps = teacher.params();
    for (let i = 0; i < ps.length; i++) {
      const dst = ps[i].v !== undefined ? ps[i].v : ps[i];
      const src = tut.params[i];
      for (let j = 0; j < dst.length; j++) dst[j] = src[j];
    } }
  const initRng = G.makeRng(22000 + seed * 7919 + K * 131 + Math.round(sigma * 10) * 17 + tutorSeed);
  const P = { W: bnParam(initRng, K * 48, 48), b: bnParam(initRng, K, 48) };
  const S = { W1: bnParam(initRng, (K + 9) * 96, K + 9), b1: bnParam(initRng, 96, K + 9),
              W2: bnParam(initRng, 96 * 4, 96), b2: bnParam(initRng, 4, 96) };
  const params = [P.W, P.b, S.W1, S.b1, S.W2, S.b2];
  const opt = new G.Adam(lr);
  const dataRng = G.makeRng(21000 + seed * 104729 + K * 1013 + Math.round(sigma * 10) * 101 + tutorSeed * 7);
  const noiseRng = G.makeRng(23000 + seed * 99991 + K * 101 + Math.round(sigma * 10));
  const t0 = Date.now();
  const curve = [];
  for (let step = 0; step < steps; step++) {
    for (const p of params) p.g.fill(0);
    let lsum = 0;
    for (let b = 0; b < B; b++) {
      const L = bnGenReverse(dataRng, 1 + dataRng.int(3));
      const fw = teacher.forward(L.x, 1);
      const state = Array.from(fw.cache.rC.y);
      const msg = bnChannelFwd(P, K, state, noiseRng, sigma);
      const sf = bnStudentFwd(S, K, msg, L.x[L.x.length - 2]);
      // softmax-CE grads w.r.t. student logits
      let mx = -1e300;
      for (let i = 0; i < 4; i++) if (sf.logits[i] > mx) mx = sf.logits[i];
      const pr = new Float64Array(4);
      let s = 0;
      for (let i = 0; i < 4; i++) { pr[i] = Math.exp(sf.logits[i] - mx); s += pr[i]; }
      for (let i = 0; i < 4; i++) pr[i] /= s;
      lsum += -Math.log(pr[L.y] + 1e-12);
      const dz = new Float64Array(4);
      for (let i = 0; i < 4; i++) dz[i] = (pr[i] - (i === L.y ? 1 : 0)) / B;
      bnBackward(S, P, K, sf, msg, state, dz);
    }
    opt.step(params);
    if (step % 25 === 0 || step === steps - 1) curve.push({ step, loss: +(lsum / B).toFixed(6) });
  }
  const saveP = (o) => Array.from(o.v);
  const body = { spec: "bottleneck-v10", arm: "T-frozen", verdict: "COMPLETE",
    K, sigma, seed, tutorSeed, steps, B, lr, wallMs: Date.now() - t0, curve,
    P: { W: saveP(P.W), b: saveP(P.b) },
    St: { W1: saveP(S.W1), b1: saveP(S.b1), W2: saveP(S.W2), b2: saveP(S.b2) } };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("bottleneck-train " + tag + " done loss0=" + curve[0].loss + " lossN=" + curve[curve.length - 1].loss);
  return body;
};

// Eval one trained cell on held-out lines: intact + message-scrambled accuracy.
globalThis.runBottleneckEval = async function (fs, log, opts) {
  const { K, sigma, seed, tutorSeed } = opts;
  if (!opts.steps || !opts.lr) throw new Error("eval needs steps+lr for ledger tag");
  const tag = "K" + K + "-sig" + String(sigma).replace(".", "p") + "-s" + seed + "-" + (opts.steps || 0) + "st-lr" + String(opts.lr || 0).replace(".", "p");
  const ledgerPath = "src/evidence/decomp/d-bottleneck-eval-" + tag + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-bottleneck-train-" + tag + ".json"));
  if (tr.verdict !== "COMPLETE") throw new Error("train ledger missing for " + tag);
  const { G, T } = await globalThis.BottleneckInit(fs);
  const tut = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-novel-tutor-s" + tutorSeed + ".json"));
  const teacher = T.makeModel(G.makeRng(tut.trainSeed), tut.arch);
  { const ps = teacher.params();
    for (let i = 0; i < ps.length; i++) {
      const dst = ps[i].v !== undefined ? ps[i].v : ps[i];
      const src = tut.params[i];
      for (let j = 0; j < dst.length; j++) dst[j] = src[j];
    } }
  const P = { W: { v: Float64Array.from(tr.P.W) }, b: { v: Float64Array.from(tr.P.b) } };
  const S = { W1: { v: Float64Array.from(tr.St.W1) }, b1: { v: Float64Array.from(tr.St.b1) },
              W2: { v: Float64Array.from(tr.St.W2) }, b2: { v: Float64Array.from(tr.St.b2) } };
  const testRng = G.makeRng(24000 + seed * 13 + tutorSeed);
  const N = 200;
  const items = [];
  const noiseRng = G.makeRng(26000 + seed * 17 + K + Math.round(sigma * 10));
  for (let i = 0; i < N; i++) {
    const L = bnGenReverse(testRng, 1 + testRng.int(3));
    const fw = teacher.forward(L.x, 1);
    const msg = bnChannelFwd(P, K, Array.from(fw.cache.rC.y), noiseRng, sigma);
    items.push({ y: L.y, q: L.x[L.x.length - 2], msg });
  }
  const acc = (arr) => arr.filter((it) => {
    const sf = bnStudentFwd(S, K, it.msg, it.q);
    let b = 0;
    for (let i = 1; i < 4; i++) if (sf.logits[i] > sf.logits[b]) b = i;
    return b === it.y;
  }).length / arr.length;
  const aIntact = acc(items);
  const scr = items.map((it) => it.msg);
  bnShuffleIn(G.makeRng(25000 + seed), scr);
  const aScr = acc(items.map((it, i) => ({ y: it.y, q: it.q, msg: scr[i] })));
  const body = { spec: "bottleneck-v10", arm: "T-frozen", verdict: "COMPLETE",
    K, sigma, seed, tutorSeed, steps: opts.steps, lr: opts.lr, n: N, accIntact: +aIntact.toFixed(4), accScrambled: +aScr.toFixed(4), chance: 0.25 };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("bottleneck-eval " + tag + " intact=" + body.accIntact + " scr=" + body.accScrambled);
  return body;
};
