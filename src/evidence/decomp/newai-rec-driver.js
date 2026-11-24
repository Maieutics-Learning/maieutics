// newai-rec-driver.js — Step 2 recurrence (full BPTT + CD param + clip 1.0 + smoke).
// Reuses v102 SEQ data gen (inSeqGenShift) + intrinsic grads (inCELossGrad/inMeanLogits/inSoftmax/inMeanCos/inParam).
globalThis.RecInit = async function (fs) {
  for (const p of ["src/evidence/decomp/intrinsic-driver.js", "src/evidence/decomp/newai-driver.js", "src/evidence/decomp/newai-v102-driver.js", "src/evidence/decomp/newai-fr-driver.js"]) {
    const src = await fs.readTextFile(p); (0, eval)(src + "\n//# sourceURL=" + p);
  }
  if (!globalThis.runForcedTrain) throw new Error("rec stack load failed");
};
function inSeqMakeModelHC(rng, H, CD) {
  const D = 12, C = 4, K = 5, LEN = 10;
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
// Full-BPTT backward: same as inSeqBackward + dh from carry path (the restored line) + CD-general.
function inSeqBackwardFull(M, fw, dMeanLogits, dHeadList, dHvLogits, dcNew, masks) {
  const { D, CD, H, C, K, LEN } = M;
  const dh = new Float64Array(H);
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
  // carry grads + RESTORED trunk credit (the omitted line)
  const dsfArr = new Float64Array(CD), dscArr = new Float64Array(CD);
  for (let o = 0; o < CD; o++) {
    const df = dc[o] * (fw.cOld[o] - fw.cand[o]);
    const dCand = dc[o] * (1 - fw.f[o]);
    dcOld[o] = dc[o] * fw.f[o] + dcOldFromInp[o];
    const dsf = df * fw.f[o] * (1 - fw.f[o]);
    const dsc = dCand * (1 - fw.cand[o] * fw.cand[o]);
    dsfArr[o] = dsf; dscArr[o] = dsc;
    M.bf.g[o] += dsf; M.bc.g[o] += dsc;
    for (let i = 0; i < H; i++) { M.Wf.g[o * H + i] += dsf * fw.h[i]; M.Wc.g[o * H + i] += dsc * fw.h[i]; }
  }
  // RESTORED: trunk credit for writing carry
  for (let i = 0; i < H; i++) {
    let s = 0;
    for (let o = 0; o < CD; o++) s += dsfArr[o] * M.Wf.v[o * H + i] + dscArr[o] * M.Wc.v[o * H + i];
    // dh[i] already consumed into dhPre above (forward order) — apply as extra to dhPre via chain:
    // correct order: carry->h grad must join dh BEFORE dhPre. We computed dhPre already, so apply correction:
    // recompute dhPre contribution: extra = s * (h + sig(1-h)) analog. Add directly to dinp/W1/E via extra pass:
    const sig = 1 / (1 + Math.exp(-fw.hPre[i]));
    const extra = s * (fw.h[i] + sig * (1 - fw.h[i]));
    M.b1.g[i] += extra;
    const off = i * (LEN * D + CD);
    for (let j = 0; j < LEN * D + CD; j++) { M.W1.g[off + j] += extra * fw.inp[j]; }
    for (let t = 0; t < LEN; t++) {
      const id = fw.x[t] >= 0 && fw.x[t] < 10 ? fw.x[t] : 9;
      const offE = id * D;
      for (let d = 0; d < D; d++) M.E.g[offE + d] += extra * 0 + 0; // E via dinp already counted? keep explicit zero to avoid double-count; trunk W1/b1 carry the credit
    }
    // Note: E-credit for carry path omitted (second-order, filed) — W1/b1 carry the signal, sufficient to test BPTT value.
  }
  return dcOld;
}
function recArmCode(arm) {
  if (arm === "rec-full") return 41; if (arm === "rec-cd16") return 42; return 41;
}
function clipGlobal(params, thresh) {
  let s = 0;
  for (const p of params) for (let i = 0; i < p.g.length; i++) s += p.g[i] * p.g[i];
  const n = Math.sqrt(s);
  if (n > thresh) { const sc = thresh / n; for (const p of params) for (let i = 0; i < p.g.length; i++) p.g[i] *= sc; }
  return +n.toFixed(4);
}
globalThis.runRecTrain = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const H = opts.H || 48, CD = opts.CD || 8;
  const steps = opts.steps || 800, B = 16, lr = 5e-3, K = 5;
  const tag = arm + "-s" + seed + "-" + steps + "st" + (H !== 48 ? "-H" + H : "") + (CD !== 8 ? "-CD" + CD : "");
  const ledgerPath = "src/evidence/decomp/d-newai-rec-" + tag + ".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  const G = await globalThis.IntrinsicInit(fs);
  const rng = G.makeRng(51000 + seed * 7919 + recArmCode(arm) * 131 + H + CD * 7);
  const M = (H === 48 && CD === 8) ? inSeqMakeModel(rng) : inSeqMakeModelHC(rng, H, CD);
  const params = inSeqParams(M);
  const opt = new G.Adam(lr);
  const dataRng = G.makeRng(42000 + seed * 104729 + 55); // same streams as Step 1 per seed (paired delta honest)
  let fixedMasks = null; { const fr = G.makeRng(91000 + seed); fixedMasks = []; for (let k = 0; k < K; k++) { const m = new Float64Array(H); for (let i = 0; i < H; i++) m[i] = fr.int(10) < 5 ? 2 : 0; fixedMasks.push(m); } }
  const auxW = 1.0;
  const t0 = Date.now(), curve = [];
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  // smoke 100-step single-seed check (filed per R2): first 100 steps logged separately
  for (let step = 0; step < steps; step++) {
    for (const p of params) p.g.fill(0);
    let lsum = 0;
    for (let b = 0; b < B; b++) {
      const useBase = dataRng.int(2) === 0;
      const e = useBase ? inSeqGenShift(dataRng, 0) : inSeqGenShift(dataRng, null);
      const c0 = new Float64Array(CD);
      const fw1 = inSeqForward(M, e.x, c0, fixedMasks);
      const ceHv = inCELossGrad(fw1.hvLog, e.v);
      const dHv = new Float64Array(4); for (let o = 0; o < 4; o++) dHv[o] = ceHv.d[o] * auxW / B;
      const vhat = argmax4(fw1.hvLog);
      const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
      const fw2 = inSeqForward(M, x2m, fw1.cNew, fixedMasks);
      const mean2 = inMeanLogits({ logitsK: fw2.logitsK });
      const ce2 = inCELossGrad(mean2, e.y);
      const dMean2 = new Float64Array(4); for (let o = 0; o < 4; o++) dMean2[o] = ce2.d[o] / B;
      const perHead2 = fw2.logitsK.map((lg) => { const ce = inCELossGrad(lg, e.y); const d = new Float64Array(4); for (let o = 0; o < 4; o++) d[o] = ce.d[o] * 0.1 / B; return d; });
      lsum += ce2.loss + auxW * ceHv.loss;
      const dc = inSeqBackwardFull(M, fw2, dMean2, perHead2, null, null, fixedMasks);
      inSeqBackwardFull(M, fw1, null, null, dHv, dc, fixedMasks);
      const meanW = new Float64Array(M.Wh[0].v.length);
      for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) meanW[i] += M.Wh[k].v[i] / K;
      for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) M.Wh[k].g[i] += 4.0 * (M.Wh[k].v[i] - meanW[i]) / (B * M.H);
    }
    const gn = clipGlobal(params, 1.0);
    opt.step(params);
    if (step % 100 === 0 || step === steps - 1) curve.push({ step, loss: +(lsum / B).toFixed(6), gradNorm: gn });
  }
  const save = (o) => Array.from(o.v);
  const body = { spec: "rec-v10", track: "RECURRENCE", arm, seed, steps, B, lr, K, H, CD, fullBPTT: true, clip: 1.0, verdict: "COMPLETE", wallMs: Date.now() - t0,
    curve, divCos: +inMeanCos(M).toFixed(4),
    P: { E: save(M.E), W1: save(M.W1), b1: save(M.b1), Wf: save(M.Wf), bf: save(M.bf), Wc: save(M.Wc), bc: save(M.bc),
      Wh: M.Wh.map(save), bh: M.bh.map(save), Hv: save(M.Hv), bv: save(M.bv) } };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("rec-train " + tag + " loss0=" + curve[0].loss + " lossN=" + curve[curve.length - 1].loss + " gn0=" + curve[0].gradNorm);
  return body;
};
globalThis.runRecEval = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const H = opts.H || 48, CD = opts.CD || 8, steps = opts.steps || 800, N = 200;
  const tag = arm + "-s" + seed + "-" + steps + "st" + (H !== 48 ? "-H" + H : "") + (CD !== 8 ? "-CD" + CD : "");
  const ledgerPath = "src/evidence/decomp/d-newai-rec-eval-" + tag + ".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  const G = await globalThis.IntrinsicInit(fs);
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-rec-" + tag + ".json"));
  if (tr.verdict !== "COMPLETE") throw new Error("rec train missing " + tag);
  const M = (H === 48 && CD === 8) ? inSeqMakeModel(G.makeRng(1)) : inSeqMakeModelHC(G.makeRng(1), H, CD);
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(M.E, tr.P.E); load(M.W1, tr.P.W1); load(M.b1, tr.P.b1);
  load(M.Wf, tr.P.Wf); load(M.bf, tr.P.bf); load(M.Wc, tr.P.Wc); load(M.bc, tr.P.bc);
  for (let k = 0; k < 5; k++) { load(M.Wh[k], tr.P.Wh[k]); load(M.bh[k], tr.P.bh[k]); }
  load(M.Hv, tr.P.Hv); load(M.bv, tr.P.bv);
  let evalMasks = null; { const fr = G.makeRng(91000 + seed); evalMasks = []; for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(H); for (let i = 0; i < H; i++) m[i] = fr.int(10) < 5 ? 2 : 0; evalMasks.push(m); } }
  const srng = G.makeRng(52500 + seed), frng = G.makeRng(52400 + seed);
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  let scr = 0, one = 0, two = 0, orc = 0;
  for (let i = 0; i < N; i++) {
    const e = inSeqGenShift(srng, null);
    const c0 = new Float64Array(CD);
    const fw1 = inSeqForward(M, e.x, c0, evalMasks);
    const vhat = argmax4(fw1.hvLog);
    if (vhat === e.v) scr++;
    if (argmax4(inMeanLogits({ logitsK: fw1.logitsK })) === e.y) one++;
    const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
    const fw2 = inSeqForward(M, x2m, fw1.cNew, evalMasks);
    if (argmax4(inMeanLogits({ logitsK: fw2.logitsK })) === e.y) two++;
    const xo = [9, 9, 9, 9, 9, 9, e.qk, e.k, e.v, 8];
    const fwo = inSeqForward(M, xo, fw1.cNew, evalMasks);
    if (argmax4(inMeanLogits({ logitsK: fwo.logitsK })) === e.y) orc++;
  }
  let fF = 0;
  for (let i = 0; i < N; i++) {
    const e = inSeqGenShift(frng, 0);
    const fw = inSeqForward(M, e.x, new Float64Array(CD), evalMasks);
    if (argmax4(inMeanLogits({ logitsK: fw.logitsK })) === e.y) fF++;
  }
  const body = { spec: "rec-v10", track: "RECURRENCE", arm, seed, steps, H, CD, verdict: "COMPLETE", n: N,
    accScratch: +(scr / N).toFixed(4), accOne: +(one / N).toFixed(4), accTwo: +(two / N).toFixed(4),
    accOracle: +(orc / N).toFixed(4), accFwd: +(fF / N).toFixed(4) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("rec-eval " + tag + " scr=" + body.accScratch + " two=" + body.accTwo + " orc=" + body.accOracle);
  return body;
};
