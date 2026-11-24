// newai-v102-driver.js — v10.2 Track A (CAL repair eval-only) + Track B (SEQ sequence-output trains).
// CPU/in-worker, Float64. Reuses intrinsic-driver globals (inMakeModel/inForward/inMeanLogits/inSoftmax/inBackward/inCELossGrad/inMeanCos via global scope).
globalThis.NewAI102Init = async function (fs) {
  for (const p of ["src/evidence/decomp/intrinsic-driver.js", "src/evidence/decomp/newai-driver.js"]) {
    const src = await fs.readTextFile(p); (0, eval)(src + "\n//# sourceURL=" + p);
  }
  if (!globalThis.runA1Train || !globalThis.inForward) throw new Error("v102 stack load failed");
};

// ---- Track A: CAL repair (frozen v10.1 weights, per-item quartile) ----
globalThis.runNewAICAL = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const steps = 3000, N = 400;
  const tag = arm + "-s" + seed + "-" + steps + "st";
  const ledgerPath = "src/evidence/decomp/d-newai-cal-" + tag + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const G = await globalThis.IntrinsicInit(fs);
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-train-" + tag + ".json"));
  if (tr.verdict !== "COMPLETE") throw new Error("newai train missing for CAL " + tag);
  const rng0 = G.makeRng(1);
  const M = inMakeModel(rng0, 5);
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(M.E, tr.P.E); load(M.W1, tr.P.W1); load(M.b1, tr.P.b1);
  load(M.Wf, tr.P.Wf); load(M.bf, tr.P.bf); load(M.Wc, tr.P.Wc); load(M.bc, tr.P.bc);
  for (let k = 0; k < 5; k++) { load(M.Wh[k], tr.P.Wh[k]); load(M.bh[k], tr.P.bh[k]); }
  let evalMasks = null; { const fr = G.makeRng(91000 + seed); evalMasks = []; for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr.int(10) < 5 ? 2 : 0; evalMasks.push(m); } }
  const testRng = G.makeRng(54000 + seed * 13);
  const selRng = G.makeRng(63000 + seed * 77);
  const targetRng = G.makeRng(64000 + seed * 31337);
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  const B_REH = 2, N_OBS = 6;
  const items = [];
  const inA1Pick = (r, n, k) => { const idx = []; for (let i = 0; i < n; i++) idx.push(i); for (let i = idx.length - 1; i > 0; i--) { const j = r.int(i + 1); const t = idx[i]; idx[i] = idx[j]; idx[j] = t; } return idx.slice(0, k); };
  for (let e = 0; e < N; e++) {
    const binds = []; for (let i = 0; i < N_OBS; i++) binds.push(inBindLine(testRng));
    let c = new Float64Array(8); const obsFws = [];
    for (let i = 0; i < N_OBS; i++) { const fw = inForward(M, binds[i].x, c, evalMasks); c = fw.cNew; obsFws.push(fw); }
    const ownRank = obsFws.map((fw, i) => ({ i, d: fw.disagree })).sort((a, b) => (b.d - a.d) || (a.i - b.i)).map((o) => o.i);
    let sel = [];
    if (arm.endsWith("own")) sel = ownRank.slice(0, B_REH);
    else if (arm.endsWith("rand")) sel = inA1Pick(selRng, N_OBS, B_REH);
    else if (arm.endsWith("none")) sel = [];
    else if (arm.endsWith("oracle")) {
      const scored = obsFws.map((fw, i) => { const mean = inMeanLogits(fw); const p = inSoftmax(mean); const ok = argmax4(mean) === binds[i].y ? 1 : 0; return { i, ok, loss: -Math.log(p[binds[i].y] + 1e-12), d: fw.disagree }; }).sort((a, b) => ((a.ok - b.ok) || (b.loss - a.loss) || (b.d - a.d)));
      sel = scored.slice(0, B_REH).map((o) => o.i).sort((x, y) => x - y);
    } else if (arm.endsWith("shuf")) { void ownRank; sel = inA1Pick(selRng, N_OBS, B_REH); }
    for (const s of sel) { const fw = inForward(M, binds[s].x, c, evalMasks); c = fw.cNew; }
    const target = targetRng.int(N_OBS);
    const query = inQueryLine(testRng, binds[target].key, binds[target].val);
    const fwQ = inForward(M, query.x, c, evalMasks);
    const ok = argmax4(inMeanLogits(fwQ)) === query.y ? 1 : 0;
    items.push({ disagree: +fwQ.disagree.toFixed(4), ok });
  }
  const order = items.map((_, i) => i).sort((a, b) => items[a].disagree - items[b].disagree);
  const q = Math.floor(N / 4);
  const bot = order.slice(0, q), top = order.slice(N - q);
  const acc = (idx) => idx.reduce((s, i) => s + items[i].ok, 0) / idx.length;
  const aBot = acc(bot), aTop = acc(top);
  const body = { spec: "newai-v10.2", track: "CAL-repair", arm, seed, steps, verdict: "COMPLETE", n: N,
    accBotQ: +aBot.toFixed(4), accTopQ: +aTop.toFixed(4), calQuartGap: +((aBot - aTop)).toFixed(4),
    bar: "bot-top >= 0.10", hold: ((aBot - aTop) >= 0.10) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("newai-cal " + tag + " bot=" + body.accBotQ + " top=" + body.accTopQ + " gap=" + body.calQuartGap);
  return body;
};

// ---- Track B: SEQ sequence-output (len-10 shift-add, Hv intermediate, own-vhat) ----
function inSeqGenShift(rng, kFix) {
  const keys = [0, 1, 2, 3];
  for (let i = keys.length - 1; i > 0; i--) { const j = rng.int(i + 1), t = keys[i]; keys[i] = keys[j]; keys[j] = t; }
  const ks = keys.slice(0, 3);
  const pairs = ks.map((k) => [k, 4 + rng.int(4)]);
  const flat = [];
  const cp = pairs.slice();
  for (let i = cp.length - 1; i > 0; i--) { const j = rng.int(i + 1), t = cp[i]; cp[i] = cp[j]; cp[j] = t; }
  for (const [k, v] of cp) flat.push(k, v);
  const qi = rng.int(3), qk = pairs[qi][0], vi = pairs[qi][1] - 4;
  const k = (kFix !== undefined && kFix !== null) ? kFix : 1 + rng.int(3);
  return { flat, qk, k, v: vi, y: (vi + k) % 4, x: flat.concat([qk, k, 0, 8]) };
}
function inSeqMakeModel(rng) {
  const D = 12, CD = 8, H = 48, C = 4, K = 5, LEN = 10;
  const M = { D, CD, H, C, K, LEN,
    E: inParam(rng, 10 * D, 10),
    W1: inParam(rng, (LEN * D + CD) * H, LEN * D + CD), b1: inParam(rng, H, LEN * D + CD),
    Wf: inParam(rng, H * CD, H), bf: inParam(rng, CD, H),
    Wc: inParam(rng, H * CD, H), bc: inParam(rng, CD, H),
    Wh: [], bh: [],
    Hv: inParam(rng, H * C, H), bv: inParam(rng, C, H) };
  for (let k = 0; k < K; k++) { M.Wh.push(inParam(rng, H * C, H)); M.bh.push(inParam(rng, C, H)); }
  return M;
}
function inSeqParams(M) {
  const ps = [M.E, M.W1, M.b1, M.Wf, M.bf, M.Wc, M.bc, M.Hv, M.bv];
  for (let k = 0; k < M.K; k++) ps.push(M.Wh[k], M.bh[k]);
  return ps;
}
function inSeqForward(M, x, cOld, masks) {
  const { D, CD, H, C, K, LEN } = M;
  const emb = new Float64Array(LEN * D);
  for (let t = 0; t < LEN; t++) {
    const id = x[t] >= 0 && x[t] < 10 ? x[t] : 9;
    const off = id * D;
    for (let d = 0; d < D; d++) emb[t * D + d] = M.E.v[off + d];
  }
  const inp = new Float64Array(LEN * D + CD);
  inp.set(emb, 0); inp.set(cOld, LEN * D);
  const hPre = new Float64Array(H);
  for (let o = 0; o < H; o++) {
    let s = M.b1.v[o]; const off = o * (LEN * D + CD);
    for (let i = 0; i < LEN * D + CD; i++) s += M.W1.v[off + i] * inp[i];
    hPre[o] = s;
  }
  const h = new Float64Array(H);
  for (let o = 0; o < H; o++) { const s = hPre[o]; h[o] = s / (1 + Math.exp(-s)); }
  const f = new Float64Array(CD), cand = new Float64Array(CD), cNew = new Float64Array(CD);
  for (let o = 0; o < CD; o++) {
    let sf = M.bf.v[o], sc = M.bc.v[o];
    for (let i = 0; i < H; i++) { sf += M.Wf.v[o * H + i] * h[i]; sc += M.Wc.v[o * H + i] * h[i]; }
    f[o] = 1 / (1 + Math.exp(-sf)); cand[o] = Math.tanh(sc);
    cNew[o] = f[o] * cOld[o] + (1 - f[o]) * cand[o];
  }
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
  const hvLog = new Float64Array(C);
  for (let o = 0; o < C; o++) {
    let s = M.bv.v[o]; const off = o * H;
    for (let i = 0; i < H; i++) s += M.Hv.v[off + i] * h[i];
    hvLog[o] = s;
  }
  const mean = new Float64Array(C);
  for (let k = 0; k < K; k++) for (let o = 0; o < C; o++) mean[o] += probsK[k][o] / K;
  let vote = 0; const votes = new Float64Array(C);
  const headArg = logitsK.map((lg) => { let b = 0; for (let o = 1; o < C; o++) if (lg[o] > lg[b]) b = o; return b; });
  for (const a of headArg) votes[a]++;
  let best = 0; for (let o = 1; o < C; o++) if (votes[o] > votes[best]) best = o;
  vote = best;
  return { x: x.slice(), cOld: cOld.slice(), emb, inp, hPre, h, f, cand, cNew, logitsK, probsK, hvLog, hvProb: inSoftmax(hvLog), mean, vote };
}
function inSeqBackward(M, fw, dMeanLogits, dHeadList, dHvLogits, dcNew, masks) {
  const { D, CD, H, C, K, LEN } = M;
  const dh = new Float64Array(H);
  // Hv path
  if (dHvLogits) {
    for (let o = 0; o < C; o++) {
      M.bv.g[o] += dHvLogits[o];
      const off = o * H;
      for (let i = 0; i < H; i++) { M.Hv.g[off + i] += dHvLogits[o] * fw.h[i]; dh[i] += dHvLogits[o] * M.Hv.v[off + i]; }
    }
  }
  const perHead = dHeadList || [];
  for (let k = 0; k < K; k++) {
    const mask = masks ? masks[k] : null;
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
  const dhPre = new Float64Array(H);
  const dinp = new Float64Array(LEN * D + CD);
  for (let o = 0; o < H; o++) {
    const sig = 1 / (1 + Math.exp(-fw.hPre[o]));
    const d = dh[o] * (fw.h[o] + sig * (1 - fw.h[o]));
    dhPre[o] = d; M.b1.g[o] += d;
    const off = o * (LEN * D + CD);
    for (let i = 0; i < LEN * D + CD; i++) { M.W1.g[off + i] += d * fw.inp[i]; dinp[i] += d * M.W1.v[off + i]; }
  }
  for (let t = 0; t < LEN; t++) {
    const id = fw.x[t] >= 0 && fw.x[t] < 10 ? fw.x[t] : 9;
    const off = id * D;
    for (let d = 0; d < D; d++) M.E.g[off + d] += dinp[t * D + d];
  }
  const dcOldFromInp = dinp.slice(LEN * D);
  const dc = dcNew ? dcNew.slice() : new Float64Array(CD);
  const dcOld = new Float64Array(CD);
  for (let o = 0; o < CD; o++) {
    const df = dc[o] * (fw.cOld[o] - fw.cand[o]);
    const dCand = dc[o] * (1 - fw.f[o]);
    dcOld[o] = dc[o] * fw.f[o] + dcOldFromInp[o];
    const dsf = df * fw.f[o] * (1 - fw.f[o]);
    const dsc = dCand * (1 - fw.cand[o] * fw.cand[o]);
    M.bf.g[o] += dsf; M.bc.g[o] += dsc;
    for (let i = 0; i < H; i++) { M.Wf.g[o * H + i] += dsf * fw.h[i]; M.Wc.g[o * H + i] += dsc * fw.h[i]; }
  }
  return dcOld;
}
function inSeqArmCode(arm) {
  if (arm === "seq-own") return 21; if (arm === "seq-dummy") return 22; if (arm === "seq-teacher") return 23; return 21;
}
globalThis.runSeqTrain = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const steps = 800, B = 16, lr = 5e-3, K = 5;
  const tag = arm + "-s" + seed + "-" + steps + "st";
  const ledgerPath = "src/evidence/decomp/d-newai-seq-" + tag + ".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  const G = await globalThis.IntrinsicInit(fs);
  const rng = G.makeRng(31000 + seed * 7919 + inSeqArmCode(arm) * 131);
  const M = inSeqMakeModel(rng);
  const params = inSeqParams(M);
  const opt = new G.Adam(lr);
  const dataRng = G.makeRng(32000 + seed * 104729 + 77);
  let fixedMasks = null; { const fr = G.makeRng(91000 + seed); fixedMasks = []; for (let k = 0; k < K; k++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr.int(10) < 5 ? 2 : 0; fixedMasks.push(m); } }
  const auxW = (arm === "seq-dummy") ? 0 : 1.0;
  const t0 = Date.now(), curve = [];
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  for (let step = 0; step < steps; step++) {
    for (const p of params) p.g.fill(0);
    let lsum = 0;
    for (let b = 0; b < B; b++) {
      const useBase = dataRng.int(2) === 0;
      const e = useBase ? inSeqGenShift(dataRng, 0) : inSeqGenShift(dataRng, null);
      const c0 = new Float64Array(8);
      const fw1 = inSeqForward(M, e.x, c0, fixedMasks);
      const ceHv = inCELossGrad(fw1.hvLog, e.v);
      const dHv = new Float64Array(4); for (let o = 0; o < 4; o++) dHv[o] = ceHv.d[o] * auxW / B;
      let vhat = argmax4(fw1.hvLog);
      let x2v = vhat;
      if (arm === "seq-teacher") x2v = e.v;
      const x2 = e.flat.concat([e.qk, e.k, x2v, 8]);
      const fw2 = inSeqForward(M, x2, fw1.cNew, fixedMasks);
      const mean2 = inMeanLogits({ logitsK: fw2.logitsK });
      // inMeanLogits expects fw with logitsK; reuse: mean of logits
      const ce2 = inCELossGrad(mean2, e.y);
      const dMean2 = new Float64Array(4); for (let o = 0; o < 4; o++) dMean2[o] = ce2.d[o] / B;
      const perHead2 = fw2.logitsK.map((lg) => { const ce = inCELossGrad(lg, e.y); const d = new Float64Array(4); for (let o = 0; o < 4; o++) d[o] = ce.d[o] * 0.1 / B; return d; });
      lsum += ce2.loss + auxW * ceHv.loss;
      let dc = inSeqBackward(M, fw2, dMean2, perHead2, null, null, fixedMasks);
      const dc0 = inSeqBackward(M, fw1, null, null, (arm === "seq-dummy") ? null : dHv, dc, fixedMasks);
      void dc0;
      const meanW = new Float64Array(M.Wh[0].v.length);
      for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) meanW[i] += M.Wh[k].v[i] / K;
      for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) M.Wh[k].g[i] += 4.0 * (M.Wh[k].v[i] - meanW[i]) / (B * 48);
    }
    opt.step(params);
    if (step % 100 === 0 || step === steps - 1) curve.push({ step, loss: +(lsum / B).toFixed(6) });
  }
  const save = (o) => Array.from(o.v);
  const body = { spec: "newai-v10.2", track: "SEQ", arm, seed, steps, B, lr, K, auxW, verdict: "COMPLETE", wallMs: Date.now() - t0,
    curve, divCos: +inMeanCos(M).toFixed(4),
    P: { E: save(M.E), W1: save(M.W1), b1: save(M.b1), Wf: save(M.Wf), bf: save(M.bf), Wc: save(M.Wc), bc: save(M.bc),
      Wh: M.Wh.map(save), bh: M.bh.map(save), Hv: save(M.Hv), bv: save(M.bv) } };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("seq-train " + tag + " loss0=" + curve[0].loss + " lossN=" + curve[curve.length - 1].loss);
  return body;
};
globalThis.runSeqEval = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const steps = 800, N = 200;
  const tag = arm + "-s" + seed + "-" + steps + "st";
  const ledgerPath = "src/evidence/decomp/d-newai-seq-eval-" + tag + ".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  const G = await globalThis.IntrinsicInit(fs);
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-seq-" + tag + ".json"));
  if (tr.verdict !== "COMPLETE") throw new Error("seq train missing " + tag);
  const M = inSeqMakeModel(G.makeRng(1));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(M.E, tr.P.E); load(M.W1, tr.P.W1); load(M.b1, tr.P.b1);
  load(M.Wf, tr.P.Wf); load(M.bf, tr.P.bf); load(M.Wc, tr.P.Wc); load(M.bc, tr.P.bc);
  for (let k = 0; k < 5; k++) { load(M.Wh[k], tr.P.Wh[k]); load(M.bh[k], tr.P.bh[k]); }
  load(M.Hv, tr.P.Hv); load(M.bv, tr.P.bv);
  let evalMasks = null; { const fr = G.makeRng(91000 + seed); evalMasks = []; for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr.int(10) < 5 ? 2 : 0; evalMasks.push(m); } }
  const srng = G.makeRng(52500 + seed), frng = G.makeRng(52400 + seed);
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  let scr = 0, one = 0, two = 0, orc = 0;
  for (let i = 0; i < N; i++) {
    const e = inSeqGenShift(srng, null);
    const c0 = new Float64Array(8);
    const fw1 = inSeqForward(M, e.x, c0, evalMasks);
    const vhat = argmax4(fw1.hvLog);
    if (vhat === e.v) scr++;
    if (argmax4(inMeanLogits({ logitsK: fw1.logitsK })) === e.y) one++;
    const x2 = e.flat.concat([e.qk, e.k, vhat, 8]);
    const fw2 = inSeqForward(M, x2, fw1.cNew, evalMasks);
    if (argmax4(inMeanLogits({ logitsK: fw2.logitsK })) === e.y) two++;
    const xo = e.flat.concat([e.qk, e.k, e.v, 8]);
    const fwo = inSeqForward(M, xo, fw1.cNew, evalMasks);
    if (argmax4(inMeanLogits({ logitsK: fwo.logitsK })) === e.y) orc++;
  }
  let fF = 0;
  for (let i = 0; i < N; i++) {
    const e = inSeqGenShift(frng, 0);
    const fw = inSeqForward(M, e.x, new Float64Array(8), evalMasks);
    if (argmax4(inMeanLogits({ logitsK: fw.logitsK })) === e.y) fF++;
  }
  const body = { spec: "newai-v10.2", track: "SEQ", arm, seed, steps, verdict: "COMPLETE", n: N,
    accScratch: +(scr / N).toFixed(4), accOne: +(one / N).toFixed(4), accTwo: +(two / N).toFixed(4),
    accOracle: +(orc / N).toFixed(4), accFwd: +(fF / N).toFixed(4) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("seq-eval " + tag + " scr=" + body.accScratch + " one=" + body.accOne + " two=" + body.accTwo + " orc=" + body.accOracle + " fwd=" + body.accFwd);
  return body;
};
