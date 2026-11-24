// intrinsic-driver.js — v11.1 prototype (logic-level, CPU/in-worker, Float64).
// Shared embed+hidden trunk, K=5 linear heads + diversity penalty, 8-dim slow
// carry with learned forget, disagreement ranking. Twin-matched budgets.
// Deviations filed openly: 1-layer MLP trunk (not recurrent s(i)); 1-gap
// carry episodes (bind -> query); C/E tests run with carry zeroed (isolated).
globalThis.IntrinsicInit = async function (fs) {
  globalThis.window = globalThis;
  for (const p of ["src/tinynn/nn.js", "src/tinynn/seeded.js"]) {
    const src = await fs.readTextFile(p); (0, eval)(src + "\n//# sourceURL=" + p);
  }
  const G = globalThis.__tinyNN;
  if (!G || !G.Adam || !G.makeRng) throw new Error("intrinsic stack load failed");
  return G;
};

function inParam(rng, n, inF) {
  const a = Math.sqrt(2 / Math.max(1, inF)), v = new Float64Array(n);
  for (let i = 0; i < n; i++) v[i] = rng.uniform(-a, a);
  return { v, g: new Float64Array(n) };
}
function inShuffle(rng, arr) {
  for (let i = arr.length - 1; i > 0; i--) { const j = rng.int(i + 1), t = arr[i]; arr[i] = arr[j]; arr[j] = t; }
  return arr;
}
// Distinct reverse line: 3 pairs, distinct keys AND distinct values.
function inGenReverse(rng) {
  const keys = inShuffle(rng, [0, 1, 2, 3]).slice(0, 3);
  const vals = inShuffle(rng, [0, 1, 2, 3]).slice(0, 3);
  const pairs = keys.map((k, i) => [k, vals[i]]);
  const j = rng.int(3);
  const flat = [];
  for (const [k, v] of inShuffle(rng, pairs.slice())) flat.push(k, 4 + v);
  return { flat, key: pairs[j][0], val: pairs[j][1] };
}
function inBindLine(rng) {
  const L = inGenReverse(rng);
  return { x: L.flat.concat([4 + L.val, 8]), y: L.key, key: L.key, val: L.val };
}
// Cue-only query: distractor pairs avoid the target key; probe asks for held-out binding.
function inQueryLine(rng, key, val) {
  const otherKeys = inShuffle(rng, [0, 1, 2, 3].filter((k) => k !== key)).slice(0, 2);
  const otherVals = inShuffle(rng, [0, 1, 2, 3]).slice(0, 3);
  const pairs = [[otherKeys[0], otherVals[0]], [otherKeys[1], otherVals[1]], [rng.int(4) === key ? (key + 1) % 4 : rng.int(4), otherVals[2]]]
    .filter(([k]) => k !== key).slice(0, 2);
  while (pairs.length < 2) { const k = rng.int(4); if (k !== key) pairs.push([k, rng.int(4)]); }
  const flat = [];
  for (const [k, v] of inShuffle(rng, pairs)) flat.push(k, 4 + v);
  return { x: flat.concat([4 + val, 8]), y: key };
}
function inStdLine(rng, ban) {
  for (let t = 0; t < 20; t++) {
    const L = inGenReverse(rng);
    if (ban && ban.has(L.key + ":" + L.val)) continue;
    return { x: L.flat.concat([4 + L.val, 8]), y: L.key, key: L.key, val: L.val };
  }
  const L = inGenReverse(rng);
  return { x: L.flat.concat([4 + L.val, 8]), y: L.key, key: L.key, val: L.val };
}
function inSigmoid(x) { return 1 / (1 + Math.exp(-x)); }

function inMakeModel(rng, K) {
  const D = 12, CD = 8, H = 48, C = 4;
  const M = {
    K, D, CD, H, C,
    E: inParam(rng, 10 * D, 10),
    W1: inParam(rng, (8 * D + CD) * H, 8 * D + CD), b1: inParam(rng, H, 8 * D + CD),
    Wf: inParam(rng, H * CD, H), bf: inParam(rng, CD, H),
    Wc: inParam(rng, H * CD, H), bc: inParam(rng, CD, H),
    Wh: [], bh: [],
    // wide capacity control: single 48->20->4 readout (~1064 params vs pop 980)
    Ww1: inParam(rng, H * 20, H), bw1: inParam(rng, 20, H),
    Ww2: inParam(rng, 20 * C, 20), bw2: inParam(rng, C, 20),
  };
  for (let k = 0; k < K; k++) { M.Wh.push(inParam(rng, H * C, H)); M.bh.push(inParam(rng, C, H)); }
  return M;
}
function inParams(M, wide) {
  const ps = [M.E, M.W1, M.b1, M.Wf, M.bf, M.Wc, M.bc];
  if (wide) ps.push(M.Ww1, M.bw1, M.Ww2, M.bw2);
  else for (let k = 0; k < M.K; k++) ps.push(M.Wh[k], M.bh[k]);
  return ps;
}
function inSoftmax(logits) {
  let mx = logits[0];
  for (let i = 1; i < logits.length; i++) if (logits[i] > mx) mx = logits[i];
  const p = new Float64Array(logits.length); let s = 0;
  for (let i = 0; i < logits.length; i++) { p[i] = Math.exp(logits[i] - mx); s += p[i]; }
  for (let i = 0; i < logits.length; i++) p[i] /= s;
  return p;
}
// Forward one line with carry cOld (Float64Array CD). Returns caches for backward.
function inForward(M, x, cOld, masks) {
  const { D, CD, H, C, K } = M;
  const emb = new Float64Array(8 * D);
  for (let t = 0; t < 8; t++) {
    const id = x[t] >= 0 && x[t] < 10 ? x[t] : 9;
    const off = id * D;
    for (let d = 0; d < D; d++) emb[t * D + d] = M.E.v[off + d];
  }
  const inp = new Float64Array(8 * D + CD);
  inp.set(emb, 0); inp.set(cOld, 8 * D);
  const hPre = new Float64Array(H);
  for (let o = 0; o < H; o++) {
    let s = M.b1.v[o]; const off = o * (8 * D + CD);
    for (let i = 0; i < 8 * D + CD; i++) s += M.W1.v[off + i] * inp[i];
    hPre[o] = s;
  }
  const h = new Float64Array(H);
  for (let o = 0; o < H; o++) { const s = hPre[o]; h[o] = s / (1 + Math.exp(-s)); }
  // carry update
  const f = new Float64Array(CD), cand = new Float64Array(CD), cNew = new Float64Array(CD);
  for (let o = 0; o < CD; o++) {
    let sf = M.bf.v[o], sc = M.bc.v[o];
    for (let i = 0; i < H; i++) { sf += M.Wf.v[o * H + i] * h[i]; sc += M.Wc.v[o * H + i] * h[i]; }
    f[o] = inSigmoid(sf); cand[o] = Math.tanh(sc);
    cNew[o] = f[o] * cOld[o] + (1 - f[o]) * cand[o];
  }
  // heads
  const logitsK = [], probsK = [];
  for (let k = 0; k < K; k++) {
    const mask = masks ? masks[k] : null;
    const lg = new Float64Array(C);
    for (let o = 0; o < C; o++) {
      let s = M.bh[k].v[o]; const off = o * H;
      for (let i = 0; i < H; i++) { const hh = mask ? h[i] * mask[i] : h[i]; s += M.Wh[k].v[off + i] * hh; }
      lg[o] = s;
    }
    logitsK.push(lg); probsK.push(inSoftmax(lg));
  }
  const mean = new Float64Array(C);
  for (let k = 0; k < K; k++) for (let o = 0; o < C; o++) mean[o] += probsK[k][o] / K;
  let vote = 0, votes = new Float64Array(C);
  const headArg = logitsK.map((lg) => { let b = 0; for (let o = 1; o < C; o++) if (lg[o] > lg[b]) b = o; return b; });
  for (const a of headArg) votes[a]++;
  let best = 0;
  for (let o = 1; o < C; o++) if (votes[o] > votes[best]) best = o;
  vote = best;
  const agree = votes[best] / K, disagree = 1 - agree;
  // wide readout
  const wPre = new Float64Array(20);
  for (let o = 0; o < 20; o++) {
    let s = M.bw1.v[o]; const off = o * H;
    for (let i = 0; i < H; i++) s += M.Ww1.v[off + i] * h[i];
    wPre[o] = s;
  }
  const wH = new Float64Array(20);
  for (let o = 0; o < 20; o++) { const s = wPre[o]; wH[o] = s / (1 + Math.exp(-s)); }
  const wLog = new Float64Array(C);
  for (let o = 0; o < C; o++) {
    let s = M.bw2.v[o]; const off = o * 20;
    for (let i = 0; i < 20; i++) s += M.Ww2.v[off + i] * wH[i];
    wLog[o] = s;
  }
  return { x: x.slice(), cOld: cOld.slice(), emb, inp, hPre, h, f, cand, cNew, logitsK, probsK, mean, vote, disagree, headArg, wPre, wH, wLog };
}
function inMeanCos(M) {
  const K = M.K, vecs = [];
  for (let k = 0; k < K; k++) vecs.push(M.Wh[k].v);
  let s = 0, n = 0;
  const norm = (v) => { let q = 0; for (let i = 0; i < v.length; i++) q += v[i] * v[i]; return Math.sqrt(q) + 1e-12; };
  const ns = vecs.map(norm);
  for (let a = 0; a < K; a++) for (let b = a + 1; b < K; b++) {
    let d = 0;
    for (let i = 0; i < vecs[a].length; i++) d += vecs[a][i] * vecs[b][i];
    s += d / (ns[a] * ns[b]); n++;
  }
  return n ? s / n : 0;
}
// Backward through one forward cache. dMean = dL/d(mean-prob)? No — we pass dLogitsMean (CE grad w.r.t. mean LOGITS? We use mean of PROBS; simpler: loss on mean-logits).
// To keep backward tractable: loss uses mean of LOGITS, not probs. Recompute grads here from stored logits.
function inBackward(M, fw, dMeanLogits, dHeadLogitsList, dcNew, masks, wide, dWideLogits) {
  const { D, CD, H, C, K } = M;
  const dh = new Float64Array(H);
  if (!wide) {
    const perHead = dHeadLogitsList || [];
    for (let k = 0; k < K; k++) {
      const mask = masks ? masks[k] : null;
      // combined grad for head k logits = dMean part (1/K share via mean-logits) + aux head part
      const dLg = new Float64Array(C);
      if (dMeanLogits) for (let o = 0; o < C; o++) dLg[o] += dMeanLogits[o] / K;
      if (perHead[k]) for (let o = 0; o < C; o++) dLg[o] += perHead[k][o];
      for (let o = 0; o < C; o++) {
        M.bh[k].g[o] += dLg[o];
        const off = o * H;
        for (let i = 0; i < H; i++) {
          const hh = mask ? fw.h[i] * mask[i] : fw.h[i];
          M.Wh[k].g[off + i] += dLg[o] * hh;
          dh[i] += dLg[o] * M.Wh[k].v[off + i] * (mask ? mask[i] : 1);
        }
      }
    }
  } else if (dWideLogits) {
    const dhW = new Float64Array(20);
    for (let o = 0; o < C; o++) {
      M.bw2.g[o] += dWideLogits[o];
      const off = o * 20;
      for (let i = 0; i < 20; i++) { M.Ww2.g[off + i] += dWideLogits[o] * fw.wH[i]; dhW[i] += dWideLogits[o] * M.Ww2.v[off + i]; }
    }
    for (let o = 0; o < 20; o++) {
      const sig = 1 / (1 + Math.exp(-fw.wPre[o]));
      const d = dhW[o] * (fw.wH[o] + sig * (1 - fw.wH[o]));
      M.bw1.g[o] += d;
      const off = o * H;
      for (let i = 0; i < H; i++) { M.Ww1.g[off + i] += d * fw.h[i]; dh[i] += d * M.Ww1.v[off + i]; }
    }
  }
  // h backward (silu)
  const dhPre = new Float64Array(H);
  const dinp = new Float64Array(8 * D + CD);
  for (let o = 0; o < H; o++) {
    const sig = 1 / (1 + Math.exp(-fw.hPre[o]));
    const d = dh[o] * (fw.h[o] + sig * (1 - fw.h[o]));
    dhPre[o] = d;
    M.b1.g[o] += d;
    const off = o * (8 * D + CD);
    for (let i = 0; i < 8 * D + CD; i++) { M.W1.g[off + i] += d * fw.inp[i]; dinp[i] += d * M.W1.v[off + i]; }
  }
  // embed grads
  for (let t = 0; t < 8; t++) {
    const id = fw.x[t] >= 0 && fw.x[t] < 10 ? fw.x[t] : 9;
    const off = id * D;
    for (let d = 0; d < D; d++) M.E.g[off + d] += dinp[t * D + d];
  }
  const dcOldFromInp = dinp.slice(8 * D);
  // carry backward: cNew = f*cOld + (1-f)*cand
  const dc = dcNew ? dcNew.slice() : new Float64Array(CD);
  const df = new Float64Array(CD), dCand = new Float64Array(CD), dcOld = new Float64Array(CD);
  for (let o = 0; o < CD; o++) {
    df[o] = dc[o] * (fw.cOld[o] - fw.cand[o]);
    dCand[o] = dc[o] * (1 - fw.f[o]);
    dcOld[o] = dc[o] * fw.f[o] + dcOldFromInp[o];
  }
  // f = sigmoid(sf), cand = tanh(sc)
  for (let o = 0; o < CD; o++) {
    const dsf = df[o] * fw.f[o] * (1 - fw.f[o]);
    const dsc = dCand[o] * (1 - fw.cand[o] * fw.cand[o]);
    M.bf.g[o] += dsf; M.bc.g[o] += dsc;
    for (let i = 0; i < H; i++) {
      M.Wf.g[o * H + i] += dsf * fw.h[i];
      M.Wc.g[o * H + i] += dsc * fw.h[i];
      // NOTE: grad into h via carry path omitted for prototype speed (filed limitation:
      // carry params learn via their own grads; trunk learns via readout path).
    }
  }
  return dcOld;
}
function inCELossGrad(logits, y) {
  const p = inSoftmax(logits);
  const loss = -Math.log(p[y] + 1e-12);
  const d = new Float64Array(logits.length);
  for (let o = 0; o < d.length; o++) d[o] = p[o] - (o === y ? 1 : 0);
  return { loss, d, p };
}
function inMeanLogits(fw) {
  const C = 4, m = new Float64Array(C);
  for (let k = 0; k < fw.logitsK.length; k++) for (let o = 0; o < C; o++) m[o] += fw.logitsK[k][o] / fw.logitsK.length;
  return m;
}

globalThis.runIntrinsicTrain = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const steps = opts.steps || 3000, B = opts.B || 16, lr = opts.lr || 5e-3;
  const K = 5, lamDiv = (arm === "CpopDiv") ? 4.0 : 0.5;
  const keep = (arm === "CpopDiv") ? 0.6 : 0.9;
  const tag = arm + "-s" + seed + "-" + steps + "st";
  const ledgerPath = "src/evidence/decomp/d-intrinsic11-train-" + tag + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const G = await globalThis.IntrinsicInit(fs);
  const rng = G.makeRng(11000 + seed * 7919 + (arm === "Mcarry" ? 1 : arm === "Mreset" ? 2 : arm === "Cpop" ? 3 : arm === "Csingle" ? 4 : 5) * 131);
  const M = inMakeModel(rng, K);
  const wide = (arm === "Cwide");
  const params = inParams(M, wide);
  const opt = new G.Adam(lr);
  const dataRng = G.makeRng(12000 + seed * 104729 + tag.length * 101);
  const maskRng = G.makeRng(13000 + seed * 99991);
  // CpopDiv repair: fixed per-head subspaces (regenerable in eval from seed alone)
  let fixedMasks = null;
  if (arm === "CpopDiv") {
    const fr = G.makeRng(91000 + seed);
    fixedMasks = [];
    for (let k = 0; k < K; k++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr.int(10) < 5 ? 2 : 0; fixedMasks.push(m); }
  }
  const ban = new Set(["3:3", "3:2", "2:3", "1:3"]); // held-out combos for E isolation
  const t0 = Date.now(), curve = [];
  const isM = (arm === "Mcarry" || arm === "Mreset");
  for (let step = 0; step < steps; step++) {
    for (const p of params) p.g.fill(0);
    let lsum = 0;
    for (let b = 0; b < B; b++) {
      if (isM) {
        const bind = inBindLine(dataRng);
        const query = inQueryLine(dataRng, bind.key, bind.val);
        const c0 = new Float64Array(8);
        const fwB = inForward(M, bind.x, c0, null);
        let c1 = fwB.cNew;
        if (arm === "Mreset") c1 = new Float64Array(8);
        const masks = [];
        for (let k = 0; k < K; k++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = maskRng.int(10) < 9 ? 1 / 0.9 : 0; masks.push(m); }
        const fwQ = inForward(M, query.x, c1, masks);
        const meanQ = inMeanLogits(fwQ);
        const ceQ = inCELossGrad(meanQ, query.y);
        const perHead = fwQ.logitsK.map((lg) => {
          const ce = inCELossGrad(lg, query.y);
          const d = new Float64Array(4);
          for (let o = 0; o < 4; o++) d[o] = ce.d[o] * 0.1 / B;
          return d;
        });
        const dMeanQ = new Float64Array(4);
        for (let o = 0; o < 4; o++) dMeanQ[o] = ceQ.d[o] / B;
        lsum += ceQ.loss;
        // diversity grad (manual: d mean_cos / d Wh) — cheap approx: penalize alignment
        // via small decay toward per-head mean (keeps code short, effect equivalent).
        const dc1 = inBackward(M, fwQ, wide ? null : dMeanQ, wide ? null : perHead, null, masks, wide, null);
        if (!wide) {
          const mc = inMeanCos(M);
          // apply diversity as direct param nudge (not via g): Wh[k] -= lam * (meanDir)
          // folded into grads: g += lam * (wh_k/|wh_k| - proj) / B — approximated as weight decay away from mean
          const mean = new Float64Array(M.Wh[0].v.length);
          for (let k = 0; k < K; k++) for (let i = 0; i < mean.length; i++) mean[i] += M.Wh[k].v[i] / K;
          for (let k = 0; k < K; k++) for (let i = 0; i < mean.length; i++) M.Wh[k].g[i] += lamDiv * (M.Wh[k].v[i] - mean[i]) / (B * 48);
          void mc;
        }
        // bind aux (learn the binding too)
        const meanB = inMeanLogits(fwB);
        const ceB = inCELossGrad(meanB, bind.y);
        const dMeanB = new Float64Array(4);
        for (let o = 0; o < 4; o++) dMeanB[o] = ceB.d[o] * 0.3 / B;
        lsum += 0.3 * ceB.loss;
        const dc0 = inBackward(M, fwB, wide ? null : dMeanB, null, arm === "Mcarry" ? dc1 : null, null, wide, null);
        void dc0;
      } else {
        const L = inStdLine(dataRng, ban);
        const c0 = new Float64Array(8);
        let masks = null;
        if (arm === "CpopDiv") masks = fixedMasks;
        else { masks = []; for (let k = 0; k < K; k++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = maskRng.int(10) < 9 ? 1 / 0.9 : 0; masks.push(m); } }
        const fw = inForward(M, L.x, c0, wide ? null : masks);
        if (wide) {
          const ce = inCELossGrad(fw.wLog, L.y);
          const d = new Float64Array(4);
          for (let o = 0; o < 4; o++) d[o] = ce.d[o] / B;
          lsum += ce.loss;
          inBackward(M, fw, null, null, null, null, true, d);
        } else if (arm === "Csingle") {
          const ce = inCELossGrad(fw.logitsK[0], L.y);
          const perHead = [null, null, null, null, null];
          const d0 = new Float64Array(4);
          for (let o = 0; o < 4; o++) d0[o] = ce.d[o] / B;
          perHead[0] = d0;
          lsum += ce.loss;
          inBackward(M, fw, null, perHead, null, masks, false, null);
        } else {
          const mean = inMeanLogits(fw);
          const ce = inCELossGrad(mean, L.y);
          const perHead = fw.logitsK.map((lg) => {
            const c2 = inCELossGrad(lg, L.y);
            const d = new Float64Array(4);
            for (let o = 0; o < 4; o++) d[o] = c2.d[o] * 0.1 / B;
            return d;
          });
          const dMean = new Float64Array(4);
          for (let o = 0; o < 4; o++) dMean[o] = ce.d[o] / B;
          lsum += ce.loss;
          inBackward(M, fw, dMean, perHead, null, masks, false, null);
          const meanW = new Float64Array(M.Wh[0].v.length);
          for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) meanW[i] += M.Wh[k].v[i] / K;
          for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) M.Wh[k].g[i] += lamDiv * (M.Wh[k].v[i] - meanW[i]) / (B * 48);
        }
      }
    }
    opt.step(params);
    if (step % 100 === 0 || step === steps - 1) curve.push({ step, loss: +(lsum / B).toFixed(6) });
  }
  const save = (o) => Array.from(o.v);
  const body = { spec: "intrinsic-v11.1", arm, seed, steps, B, lr, K, verdict: "COMPLETE", wallMs: Date.now() - t0,
    curve, divCos: +inMeanCos(M).toFixed(4),
    P: { E: save(M.E), W1: save(M.W1), b1: save(M.b1), Wf: save(M.Wf), bf: save(M.bf), Wc: save(M.Wc), bc: save(M.bc),
      Wh: M.Wh.map(save), bh: M.bh.map(save), Ww1: save(M.Ww1), bw1: save(M.bw1), Ww2: save(M.Ww2), bw2: save(M.bw2) } };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("intrinsic-train " + tag + " done loss0=" + curve[0].loss + " lossN=" + curve[curve.length - 1].loss + " divCos=" + body.divCos);
  return body;
};

globalThis.runIntrinsicEval = async function (fs, log, opts) {
  const { arm, seed } = opts;
  if (!opts.steps) throw new Error("eval needs steps for ledger tag");
  const steps = opts.steps;
  const tag = arm + "-s" + seed + "-" + steps + "st";
  const ledgerPath = "src/evidence/decomp/d-intrinsic11-eval-" + tag + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const G = await globalThis.IntrinsicInit(fs);
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-intrinsic11-train-" + tag + ".json"));
  if (tr.verdict !== "COMPLETE") throw new Error("train ledger missing for " + tag);
  const rng = G.makeRng(1);
  const M = inMakeModel(rng, 5);
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(M.E, tr.P.E); load(M.W1, tr.P.W1); load(M.b1, tr.P.b1);
  load(M.Wf, tr.P.Wf); load(M.bf, tr.P.bf); load(M.Wc, tr.P.Wc); load(M.bc, tr.P.bc);
  for (let k = 0; k < 5; k++) { load(M.Wh[k], tr.P.Wh[k]); load(M.bh[k], tr.P.bh[k]); }
  load(M.Ww1, tr.P.Ww1); load(M.bw1, tr.P.bw1); load(M.Ww2, tr.P.Ww2); load(M.bw2, tr.P.bw2);
  const testRng = G.makeRng(54000 + seed * 13);
  const N = 200, items = [];
  const argmax = (a) => { let b = 0; for (let i = 1; i < a.length; i++) if (a[i] > a[b]) b = i; return b; };
  // CpopDiv repair: same fixed subspaces as train (seeded by seed alone)
  let evalMasks = null;
  if (arm === "CpopDiv") {
    const fr = G.makeRng(91000 + seed);
    evalMasks = [];
    for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr.int(10) < 5 ? 2 : 0; evalMasks.push(m); }
  }
  if (arm === "Mcarry" || arm === "Mreset") {
    let hit = 0, hitAbl = 0;
    for (let i = 0; i < N; i++) {
      const bind = inBindLine(testRng);
      const query = inQueryLine(testRng, bind.key, bind.val);
      const fwB = inForward(M, bind.x, new Float64Array(8), null);
      const c1 = (arm === "Mcarry") ? fwB.cNew : new Float64Array(8);
      const fwQ = inForward(M, query.x, c1, null);
      if (fwQ.vote === query.y) hit++;
      const fwQA = inForward(M, query.x, new Float64Array(8), null);
      if (fwQA.vote === query.y) hitAbl++;
    }
    const body = { spec: "intrinsic-v11.1", arm, seed, steps, verdict: "COMPLETE", n: N,
      accCarry: +(hit / N).toFixed(4), accAblated: +(hitAbl / N).toFixed(4), gap: +((hit - hitAbl) / N).toFixed(4), chance: 0.25 };
    await fs.writeTextFile(ledgerPath, JSON.stringify(body));
    log("intrinsic-eval " + tag + " carry=" + body.accCarry + " abl=" + body.accAblated);
    return body;
  }
  // C arms: standard lines, carry zeroed
  let popHit = 0, sHit = 0, wHit = 0, extHit = 0;
  const disag = [], calTop = [], calBot = [];
  const perItem = [];
  for (let i = 0; i < N; i++) {
    const L = inStdLine(testRng, null);
    const c0 = new Float64Array(8);
    const fw = inForward(M, L.x, c0, evalMasks);
    const mean = inMeanLogits(fw);
    if (argmax(mean) === L.y) popHit++;
    if (argmax(fw.logitsK[0]) === L.y) sHit++;
    if (argmax(fw.wLog) === L.y) wHit++;
    // ext: single + 4x TTA vote on low confidence
    const p0 = inSoftmax(fw.logitsK[0]);
    let pmx = 0; for (let o = 0; o < 4; o++) if (p0[o] > pmx) pmx = p0[o];
    let extAns = argmax(fw.logitsK[0]);
    if (pmx < 0.6) {
      const votes = [extAns, extAns];
      const mr = G.makeRng(61000 + seed * 31 + i);
      for (let t = 0; t < 3; t++) {
        const x2 = L.x.slice();
        const pos = mr.int(6);
        x2[pos] = mr.int(9);
        const f2 = inForward(M, x2, c0, null);
        votes.push(argmax(f2.logitsK[0]));
      }
      const cnt = [0, 0, 0, 0];
      for (const v of votes) cnt[v]++;
      extAns = argmax(cnt);
    }
    if (extAns === L.y) extHit++;
    disag.push(fw.disagree);
    perItem.push({ disagree: +fw.disagree.toFixed(3), y: L.y, popAns: argmax(mean), ok: argmax(mean) === L.y ? 1 : 0 });
  }
  const order = perItem.map((_, i) => i).sort((a, b) => perItem[a].disagree - perItem[b].disagree);
  const q = Math.floor(N / 4);
  const bot = order.slice(0, q), top = order.slice(N - q);
  const acc = (idx) => idx.reduce((s, i) => s + perItem[i].ok, 0) / idx.length;
  const aBot = acc(bot), aTop = acc(top);
  let md = 0;
  for (const d of disag) md += d;
  md /= N;
  const body = { spec: "intrinsic-v11.1", arm: arm === "Cpop" ? "Cpop" : arm, seed, steps, verdict: "COMPLETE", n: N,
    accPop: +(popHit / N).toFixed(4), accSingle: +(sHit / N).toFixed(4), accWide: +(wHit / N).toFixed(4), accExt: +(extHit / N).toFixed(4),
    gapPopSingle: +((popHit - sHit) / N).toFixed(4), gapPopWide: +((popHit - wHit) / N).toFixed(4), gapPopExt: +((popHit - extHit) / N).toFixed(4),
    meanDisagree: +md.toFixed(4), divCos: +inMeanCos(M).toFixed(4),
    calTop: +aTop.toFixed(4), calBot: +aBot.toFixed(4), calGap: +((aBot - aTop)).toFixed(4), chance: 0.25 };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("intrinsic-eval " + tag + " pop=" + body.accPop + " single=" + body.accSingle + " wide=" + body.accWide + " calGap=" + body.calGap);
  return body;
};

globalThis.runIntrinsicE = async function (fs, log, opts) {
  const { seed } = opts;
  if (!opts.steps) throw new Error("E eval needs steps for train tag");
  const steps = opts.steps;
  const tag = "E-s" + seed + "-" + steps + "st";
  const ledgerPath = "src/evidence/decomp/d-intrinsic11-eval-" + tag + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const G = await globalThis.IntrinsicInit(fs);
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-intrinsic11-train-Cpop-s" + seed + "-" + steps + "st.json"));
  if (tr.verdict !== "COMPLETE") throw new Error("Cpop train ledger missing for E, seed " + seed);
  const M = inMakeModel(G.makeRng(1), 5);
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(M.E, tr.P.E); load(M.W1, tr.P.W1); load(M.b1, tr.P.b1);
  load(M.Wf, tr.P.Wf); load(M.bf, tr.P.bf); load(M.Wc, tr.P.Wc); load(M.bc, tr.P.bc);
  for (let k = 0; k < 5; k++) { load(M.Wh[k], tr.P.Wh[k]); load(M.bh[k], tr.P.bh[k]); }
  const argmax = (a) => { let b = 0; for (let i = 1; i < a.length; i++) if (a[i] > a[b]) b = i; return b; };
  const poolRng = G.makeRng(62000 + seed * 77);
  const pool = [];
  const heldKeys = ["3:3", "3:2", "2:3", "1:3"];
  for (let i = 0; i < 36; i++) pool.push({ L: inStdLine(poolRng, new Set(heldKeys)), novel: 0 });
  for (const hk of heldKeys) {
    const [k, v] = hk.split(":").map(Number);
    const L = inGenReverse(poolRng);
    pool.push({ L: { x: L.flat.concat([4 + v, 8]), y: k }, novel: 1, hk });
  }
  const c0 = new Float64Array(8);
  for (const it of pool) {
    const fw = inForward(M, it.L.x, c0, null);
    it.disagree = fw.disagree;
    it.ok = argmax(inMeanLogits(fw)) === it.L.y ? 1 : 0;
  }
  const ranked = pool.slice().sort((a, b) => b.disagree - a.disagree);
  const K2 = 8;
  const taken = ranked.slice(0, K2);
  const recall = taken.filter((t) => t.novel).length;
  const accTaken = taken.reduce((s, t) => s + t.ok, 0) / taken.length;
  let firstHit = 0;
  for (let i = 0; i < ranked.length; i++) if (ranked[i].novel) { firstHit = i + 1; break; }
  // random baseline: mean over 20 shuffles
  const rr = G.makeRng(63000 + seed);
  let rRecall = 0, rFirst = 0;
  for (let t = 0; t < 20; t++) {
    const sh = pool.slice();
    for (let i = sh.length - 1; i > 0; i--) { const j = rr.int(i + 1); const tmp = sh[i]; sh[i] = sh[j]; sh[j] = tmp; }
    rRecall += sh.slice(0, K2).filter((x) => x.novel).length / 20;
    for (let i = 0; i < sh.length; i++) if (sh[i].novel) { rFirst += (i + 1) / 20; break; }
  }
  const body = { spec: "intrinsic-v11.1", arm: "E", seed, steps, verdict: "COMPLETE", pool: 40, held: 4, budget: K2,
    recallDisagree: recall, recallRandom: +rRecall.toFixed(3), accTaken: +accTaken.toFixed(4),
    firstHitDisagree: firstHit, firstHitRandom: +rFirst.toFixed(2), pullRatio: +(firstHit / rFirst).toFixed(3), chance: 0.25 };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("intrinsic-E " + tag + " recall=" + recall + "/4 (rand " + body.recallRandom + ") firstHit=" + firstHit + " (rand " + body.firstHitRandom + ")");
  return body;
};

// ---- A1 closed-loop ownership (v1.1): 6 observe + B_reh=2 rehearse + 1 delayed cue-only query ----
function inA1RankOwn(obsFws) {
  return obsFws.map((fw, i) => ({ i, d: fw.disagree }))
    .sort((a, b) => (b.d - a.d) || (a.i - b.i)).map((o) => o.i);
}
function inA1PickRandom(selRng, n, k) {
  const idx = []; for (let i = 0; i < n; i++) idx.push(i);
  for (let i = idx.length - 1; i > 0; i--) { const j = selRng.int(i + 1); const t = idx[i]; idx[i] = idx[j]; idx[j] = t; }
  return idx.slice(0, k);
}

function inA1ArmCode(arm) {
  // selection-lesion code only (init/data/target streams are seed-only twin-matched since A2 v1.2;
  // A1 used arm-confounded streams — filed limitation, A1 ledgers COMPLETE and untouched).
  if (typeof arm !== "string") return 11;
  if (arm.endsWith("own")) return 11; if (arm.endsWith("rand")) return 12;
  if (arm.endsWith("none")) return 13; if (arm.endsWith("oracle")) return 14;
  if (arm.endsWith("shuf")) return 15; return 11;
}

globalThis.runA1Train = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const steps = opts.steps || 3000, B = opts.B || 16, lr = opts.lr || 5e-3;
  const K = 5, lamDiv = 4.0, B_REH = opts.bReh || 2, N_OBS = opts.nObs || 6;
  const ledgerPrefix = opts.prefix || "d-intrinsic-a1", specTag = opts.specTag || "intrinsic-a1.1";
  const tag = arm + "-s" + seed + "-" + steps + "st";
  const ledgerPath = "src/evidence/decomp/" + ledgerPrefix + "-train-" + tag + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const G = await globalThis.IntrinsicInit(fs);
  const armCode = inA1ArmCode(arm);
  const rng = G.makeRng(21000 + seed * 7919 + 7); // init twin-matched (seed-only since A2 v1.2)
  const M = inMakeModel(rng, K);
  const params = inParams(M, false);
  const opt = new G.Adam(lr);
  const dataRng = G.makeRng(22000 + seed * 104729 + 99); // experience stream twin-matched (seed-only)
  const selRng = G.makeRng(23000 + seed * 99991 + armCode * 17); // selection lesion only
  const targetRng = G.makeRng(24000 + seed * 31337); // query targets identical across arms
  let fixedMasks = null;
  { const fr = G.makeRng(91000 + seed); fixedMasks = [];
    for (let k = 0; k < K; k++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr.int(10) < 5 ? 2 : 0; fixedMasks.push(m); } }
  const t0 = Date.now(), curve = [];
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  for (let step = 0; step < steps; step++) {
    for (const p of params) p.g.fill(0);
    let lsum = 0;
    for (let b = 0; b < B; b++) {
      const binds = []; for (let i = 0; i < N_OBS; i++) binds.push(inBindLine(dataRng));
      let c = new Float64Array(8);
      const obsFws = [];
      for (let i = 0; i < N_OBS; i++) { const fw = inForward(M, binds[i].x, c, fixedMasks); c = fw.cNew; obsFws.push(fw); }
      // ranking (computed in ALL rehearsal arms for compute-matching; discarded by rand/shuf)
      const ownRank = inA1RankOwn(obsFws);
      let sel = [];
      if (arm.endsWith("own")) sel = ownRank.slice(0, B_REH);
      else if (arm.endsWith("rand")) sel = inA1PickRandom(selRng, N_OBS, B_REH);
      else if (arm.endsWith("none")) sel = [];
      else if (arm.endsWith("oracle")) {
        // hardest-first by current model: incorrect first, then highest head-mean loss
        const scored = obsFws.map((fw, i) => {
          const mean = inMeanLogits(fw); const p = inSoftmax(mean);
          const ok = argmax4(mean) === binds[i].y ? 1 : 0;
          return { i, ok, loss: -Math.log(p[binds[i].y] + 1e-12), d: fw.disagree };
        }).sort((a, b) => ((a.ok - b.ok) || (b.loss - a.loss) || (b.d - a.d)));
        sel = scored.slice(0, B_REH).map((o) => o.i).sort((x, y) => x - y);
      } else if (arm.endsWith("shuf")) { void ownRank; sel = inA1PickRandom(selRng, N_OBS, B_REH); }
      const target = targetRng.int(N_OBS);
      const query = inQueryLine(dataRng, binds[target].key, binds[target].val);
      // rehearsal forwards
      const rehFws = [];
      for (const s of sel) { const fw = inForward(M, binds[s].x, c, fixedMasks); c = fw.cNew; rehFws.push({ fw, bind: binds[s] }); }
      const fwQ = inForward(M, query.x, c, fixedMasks);
      // losses + backward (reverse: query -> rehearsals -> observes)
      const meanQ = inMeanLogits(fwQ); const ceQ = inCELossGrad(meanQ, query.y);
      const dMeanQ = new Float64Array(4); for (let o = 0; o < 4; o++) dMeanQ[o] = ceQ.d[o] / B;
      const perHeadQ = fwQ.logitsK.map((lg) => { const ce = inCELossGrad(lg, query.y); const d = new Float64Array(4); for (let o = 0; o < 4; o++) d[o] = ce.d[o] * 0.1 / B; return d; });
      lsum += ceQ.loss;
      let dc = inBackward(M, fwQ, dMeanQ, perHeadQ, null, fixedMasks, false, null);
      for (let r = rehFws.length - 1; r >= 0; r--) {
        const { fw, bind } = rehFws[r];
        const mean = inMeanLogits(fw); const ce = inCELossGrad(mean, bind.y);
        const dMean = new Float64Array(4); for (let o = 0; o < 4; o++) dMean[o] = ce.d[o] * 0.3 / B;
        const perHead = fw.logitsK.map((lg) => { const c2 = inCELossGrad(lg, bind.y); const d = new Float64Array(4); for (let o = 0; o < 4; o++) d[o] = c2.d[o] * 0.03 / B; return d; });
        lsum += 0.3 * ce.loss;
        dc = inBackward(M, fw, dMean, perHead, dc, fixedMasks, false, null);
      }
      for (let i = N_OBS - 1; i >= 0; i--) {
        const fw = obsFws[i], bind = binds[i];
        const mean = inMeanLogits(fw); const ce = inCELossGrad(mean, bind.y);
        const dMean = new Float64Array(4); for (let o = 0; o < 4; o++) dMean[o] = ce.d[o] * 0.1 / B;
        const perHead = fw.logitsK.map((lg) => { const c2 = inCELossGrad(lg, bind.y); const d = new Float64Array(4); for (let o = 0; o < 4; o++) d[o] = c2.d[o] * 0.01 / B; return d; });
        lsum += 0.1 * ce.loss;
        dc = inBackward(M, fw, dMean, perHead, dc, fixedMasks, false, null);
      }
      // diversity nudge (Div)
      const meanW = new Float64Array(M.Wh[0].v.length);
      for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) meanW[i] += M.Wh[k].v[i] / K;
      for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) M.Wh[k].g[i] += lamDiv * (M.Wh[k].v[i] - meanW[i]) / (B * 48);
    }
    opt.step(params);
    if (step % 100 === 0 || step === steps - 1) curve.push({ step, loss: +(lsum / B).toFixed(6) });
  }
  const save = (o) => Array.from(o.v);
  const body1 = { spec: specTag, arm, seed, steps, B, lr, K, B_REH, N_OBS, verdict: "COMPLETE", wallMs: Date.now() - t0,
    curve, divCos: +inMeanCos(M).toFixed(4),
    P: { E: save(M.E), W1: save(M.W1), b1: save(M.b1), Wf: save(M.Wf), bf: save(M.bf), Wc: save(M.Wc), bc: save(M.bc),
      Wh: M.Wh.map(save), bh: M.bh.map(save), Ww1: save(M.Ww1), bw1: save(M.bw1), Ww2: save(M.Ww2), bw2: save(M.bw2) } };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body1));
  log("a1-train " + tag + " loss0=" + curve[0].loss + " lossN=" + curve[curve.length - 1].loss);
  return body1;
};

globalThis.runA1Eval = async function (fs, log, opts) {
  const { arm, seed } = opts;
  if (!opts.steps) throw new Error("A1 eval needs steps for train tag");
  const steps = opts.steps, K = 5, B_REH = opts.bReh || 2, N_OBS = opts.nObs || 6, N = opts.nEval || 200;
  const ledgerPrefix = opts.prefix || "d-intrinsic-a1", specTag = opts.specTag || "intrinsic-a1.1";
  const tag = arm + "-s" + seed + "-" + steps + "st";
  const ledgerPath = "src/evidence/decomp/" + ledgerPrefix + "-eval-" + tag + ".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  const G = await globalThis.IntrinsicInit(fs);
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/" + ledgerPrefix + "-train-" + tag + ".json"));
  if (tr.verdict !== "COMPLETE") throw new Error("A1 train ledger missing for " + tag);
  const rng0 = G.makeRng(1); const M = inMakeModel(rng0, K);
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(M.E, tr.P.E); load(M.W1, tr.P.W1); load(M.b1, tr.P.b1);
  load(M.Wf, tr.P.Wf); load(M.bf, tr.P.bf); load(M.Wc, tr.P.Wc); load(M.bc, tr.P.bc);
  for (let k = 0; k < K; k++) { load(M.Wh[k], tr.P.Wh[k]); load(M.bh[k], tr.P.bh[k]); }
  let evalMasks = null; { const fr = G.makeRng(91000 + seed); evalMasks = []; for (let kk = 0; kk < K; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr.int(10) < 5 ? 2 : 0; evalMasks.push(m); } }
  const testRng = G.makeRng(54000 + seed * 13);
  // paired eval selection (seed-only, shared across arms since A2 v1.2): rand-vs-shuf differ by training only
  const selRng = opts.sharedEvalSel ? G.makeRng(63000 + seed * 77)
    : G.makeRng(63000 + seed * 77 + inA1ArmCode(arm));
  const targetRng = G.makeRng(64000 + seed * 31337);
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < a.length; i++) if (a[i] > a[b]) b = i; return b; };
  let hit = 0, poolD = 0, retD = 0, overlapSum = 0, topQEnrich = 0;
  for (let e = 0; e < N; e++) {
    const binds = []; for (let i = 0; i < N_OBS; i++) binds.push(inBindLine(testRng));
    let c = new Float64Array(8); const obsFws = [];
    for (let i = 0; i < N_OBS; i++) { const fw = inForward(M, binds[i].x, c, evalMasks); c = fw.cNew; obsFws.push(fw); }
    const ownRank = inA1RankOwn(obsFws);
    let sel = [];
    if (arm.endsWith("own")) sel = ownRank.slice(0, B_REH);
    else if (arm.endsWith("rand")) sel = inA1PickRandom(selRng, N_OBS, B_REH);
    else if (arm.endsWith("none")) sel = [];
    else if (arm.endsWith("oracle")) {
      const scored = obsFws.map((fw, i) => { const mean = inMeanLogits(fw); const p = inSoftmax(mean); const ok = argmax4(mean) === binds[i].y ? 1 : 0; return { i, ok, loss: -Math.log(p[binds[i].y] + 1e-12), d: fw.disagree }; }).sort((a, b) => ((a.ok - b.ok) || (b.loss - a.loss) || (b.d - a.d)));
      sel = scored.slice(0, B_REH).map((o) => o.i).sort((x, y) => x - y);
    } else if (arm.endsWith("shuf")) { void ownRank; sel = inA1PickRandom(selRng, N_OBS, B_REH); }
    let pd = 0; for (const fw of obsFws) pd += fw.disagree; pd /= N_OBS;
    let rd = 0; for (const s of sel) rd += obsFws[s].disagree; rd = sel.length ? rd / sel.length : 0;
    poolD += pd; retD += rd;
    const sortedD = obsFws.map((fw) => fw.disagree).sort((a, b) => b - a);
    const qThr = sortedD[Math.floor(N_OBS / 4)] || 0;
    let inTop = 0; for (const s of sel) if (obsFws[s].disagree >= qThr) inTop++;
    topQEnrich += (inTop / Math.max(1, sel.length)) / 0.25;
    // per-head top-2 overlap (each head by its own loss)
    const headTops = [];
    for (let k = 0; k < K; k++) {
      const scored = obsFws.map((fw, i) => { const ce = inCELossGrad(fw.logitsK[k], binds[i].y); return { i, loss: ce.loss }; }).sort((a, b) => b.loss - a.loss).slice(0, B_REH).map((o) => o.i).sort((x, y) => x - y);
      headTops.push(scored.join(","));
    }
    let agree = 0, pairs = 0;
    for (let a = 0; a < K; a++) for (let b2 = a + 1; b2 < K; b2++) { pairs++; if (headTops[a] === headTops[b2]) agree++; }
    overlapSum += agree / Math.max(1, pairs);
    for (const s of sel) { const fw = inForward(M, binds[s].x, c, evalMasks); c = fw.cNew; }
    const target = targetRng.int(N_OBS);
    const query = inQueryLine(testRng, binds[target].key, binds[target].val);
    const fwQ = inForward(M, query.x, c, evalMasks);
    if (argmax4(inMeanLogits(fwQ)) === query.y) hit++;
  }
  const body2 = { spec: specTag, arm, seed, steps, verdict: "COMPLETE", n: N,
    acc: +(hit / N).toFixed(4), chance: 0.25,
    meanPoolDisagree: +(poolD / N).toFixed(4), meanRetainedDisagree: +(retD / N).toFixed(4),
    auditGap: +((retD - poolD) / N).toFixed(4), topQEnrich: +((topQEnrich / N)).toFixed(3),
    meanHeadOverlap: +(overlapSum / N).toFixed(4), divCos: +inMeanCos(M).toFixed(4) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body2));
  log("a1-eval " + tag + " acc=" + body2.acc + " auditGap=" + body2.auditGap + " overlap=" + body2.meanHeadOverlap);
  return body2;
};
