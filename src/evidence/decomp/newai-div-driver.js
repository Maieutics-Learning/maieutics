// newai-div-driver.js — Step 3 functional diversity (soft gated logit-spread + bootstraps, truncated BPTT).
globalThis.DivInit = async function (fs) {
  for (const p of ["src/evidence/decomp/intrinsic-driver.js", "src/evidence/decomp/newai-driver.js", "src/evidence/decomp/newai-v102-driver.js", "src/evidence/decomp/newai-fr-driver.js"]) {
    const src = await fs.readTextFile(p); (0, eval)(src + "\n//# sourceURL=" + p);
  }
  if (!globalThis.runForcedTrain) throw new Error("div stack load failed");
};
function divArmCode(arm) {
  if (arm === "div-func") return 51; if (arm === "div-boot") return 52; return 51;
}
function divSpreadGrad(logitsK, beta, B, gated, popCorrect) {
  const K = logitsK.length, C = 4;
  if (!gated || !popCorrect) {
    if (gated) return null; // E4 gating: no bonus on wrong pop
  }
  if (!beta) return null;
  const mean = new Float64Array(C);
  for (let k = 0; k < K; k++) for (let o = 0; o < C; o++) mean[o] += logitsK[k][o] / K;
  // smoke: assert nonzero (filed per R2 dry-run)
  let nz = 0;
  const grads = logitsK.map((lg) => {
    const d = new Float64Array(C);
    for (let o = 0; o < C; o++) { d[o] = -beta * 2 * (lg[o] - mean[o]) / K / C / B; if (d[o] !== 0) nz++; }
    return d;
  });
  grads.__nz = nz;
  return grads;
}
globalThis.runDivTrain = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const beta = (arm === "div-func") ? 0.2 : 0;
  const steps = 800, B = 16, lr = 5e-3, K = 5, H = 48;
  const tag = arm + "-s" + seed + "-" + steps + "st";
  const ledgerPath = "src/evidence/decomp/d-newai-div-" + tag + ".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  const G = await globalThis.IntrinsicInit(fs);
  const rng = G.makeRng(61000 + seed * 7919 + divArmCode(arm) * 131);
  const M = inSeqMakeModel(rng);
  const params = inSeqParams(M);
  const opt = new G.Adam(lr);
  const dataRng = G.makeRng(42000 + seed * 104729 + 55);
  let fixedMasks = null; { const fr = G.makeRng(91000 + seed); fixedMasks = []; for (let k = 0; k < K; k++) { const m = new Float64Array(H); for (let i = 0; i < H; i++) m[i] = fr.int(10) < 5 ? 2 : 0; fixedMasks.push(m); } }
  const auxW = 1.0, t0 = Date.now(), curve = [];
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  // smoke (R2 dry-run): diversity grad nonzero on dummy logits
  {
    const lg = [new Float64Array([0.1, 0.2, 0.3, 0.4]), new Float64Array([0.4, 0.3, 0.2, 0.1]), new Float64Array([0, 0, 0, 0]), new Float64Array([0.2, 0.2, 0.2, 0.2]), new Float64Array([0.1, 0.1, 0.4, 0.4])];
    const g = divSpreadGrad(lg, 0.2, 16, true, true);
    log("div-smoke gradNz=" + (g ? g.__nz : 0) + " (must be >0)");
    if (!g || !g.__nz) throw new Error("diversity grad is zero — patch failed");
  }
  for (let step = 0; step < steps; step++) {
    for (const p of params) p.g.fill(0);
    let lsum = 0, dsum = 0;
    for (let b = 0; b < B; b++) {
      const useBase = dataRng.int(2) === 0;
      const e = useBase ? inSeqGenShift(dataRng, 0) : inSeqGenShift(dataRng, null);
      const c0 = new Float64Array(8);
      const fw1 = inSeqForward(M, e.x, c0, fixedMasks);
      const ceHv = inCELossGrad(fw1.hvLog, e.v);
      const dHv = new Float64Array(4); for (let o = 0; o < 4; o++) dHv[o] = ceHv.d[o] * auxW / B;
      const vhat = argmax4(fw1.hvLog);
      const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
      const fw2 = inSeqForward(M, x2m, fw1.cNew, fixedMasks);
      // bootstraps: head k aux only on b%K==k (×K scale kept)
      const perHead1 = fw1.logitsK.map((lg, k) => {
        if ((b % K) !== k) return new Float64Array(4);
        const ce = inCELossGrad(lg, e.y); const d = new Float64Array(4);
        for (let o = 0; o < 4; o++) d[o] = ce.d[o] * 0.1 * K / B;
        return d;
      });
      const perHead2 = fw2.logitsK.map((lg, k) => {
        if ((b % K) !== k) return new Float64Array(4);
        const ce = inCELossGrad(lg, e.y); const d = new Float64Array(4);
        for (let o = 0; o < 4; o++) d[o] = ce.d[o] * 0.1 * K / B;
        return d;
      });
      // gated soft diversity (E4 promoted to core): only when pop correct
      const mean1 = inMeanLogits({ logitsK: fw1.logitsK });
      const mean2 = inMeanLogits({ logitsK: fw2.logitsK });
      const ok1 = argmax4(mean1) === e.y, ok2 = argmax4(mean2) === e.y;
      const g1 = divSpreadGrad(fw1.logitsK, beta, B, true, ok1);
      const g2 = divSpreadGrad(fw2.logitsK, beta, B, true, ok2);
      if (g1) for (let k = 0; k < K; k++) for (let o = 0; o < 4; o++) perHead1[k][o] += g1[k][o];
      if (g2) for (let k = 0; k < K; k++) for (let o = 0; o < 4; o++) perHead2[k][o] += g2[k][o];
      const mean2b = inMeanLogits({ logitsK: fw2.logitsK });
      const ce2 = inCELossGrad(mean2b, e.y);
      const dMean2 = new Float64Array(4); for (let o = 0; o < 4; o++) dMean2[o] = ce2.d[o] / B;
      const mean1b = inMeanLogits({ logitsK: fw1.logitsK });
      const ce1m = inCELossGrad(mean1b, e.y);
      const dMean1 = new Float64Array(4); for (let o = 0; o < 4; o++) dMean1[o] = ce1m.d[o] * 0.3 / B;
      lsum += ce2.loss + auxW * ceHv.loss;
      dsum += fw2.disagree + fw1.disagree;
      const dc = inSeqBackward(M, fw2, dMean2, perHead2, null, null, fixedMasks);
      inSeqBackward(M, fw1, dMean1, perHead1, dHv, dc, fixedMasks);
      const meanW = new Float64Array(M.Wh[0].v.length);
      for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) meanW[i] += M.Wh[k].v[i] / K;
      for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) M.Wh[k].g[i] += 4.0 * (M.Wh[k].v[i] - meanW[i]) / (B * M.H);
    }
    // clip 1.0
    let s = 0; for (const p of params) for (let i = 0; i < p.g.length; i++) s += p.g[i] * p.g[i];
    const n = Math.sqrt(s); if (n > 1.0) { const sc = 1.0 / n; for (const p of params) for (let i = 0; i < p.g.length; i++) p.g[i] *= sc; }
    opt.step(params);
    if (step % 100 === 0 || step === steps - 1) curve.push({ step, loss: +(lsum / B).toFixed(6), disagree: +(dsum / B / 2).toFixed(4) });
  }
  const save = (o) => Array.from(o.v);
  const body = { spec: "div-v10.1", track: "DIVERSITY", arm, seed, steps, B, lr, K, H, beta, bootstraps: "b%K slices", gated: true, verdict: "COMPLETE", wallMs: Date.now() - t0,
    curve, divCos: +inMeanCos(M).toFixed(4),
    P: { E: save(M.E), W1: save(M.W1), b1: save(M.b1), Wf: save(M.Wf), bf: save(M.bf), Wc: save(M.Wc), bc: save(M.bc),
      Wh: M.Wh.map(save), bh: M.bh.map(save), Hv: save(M.Hv), bv: save(M.bv) } };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("div-train " + tag + " loss0=" + curve[0].loss + " lossN=" + curve[curve.length - 1].loss + " dis0=" + curve[0].disagree);
  return body;
};
globalThis.runDivEval = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const steps = 800, N = 200;
  const tag = arm + "-s" + seed + "-" + steps + "st";
  const ledgerPath = "src/evidence/decomp/d-newai-div-eval-" + tag + ".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  const G = await globalThis.IntrinsicInit(fs);
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-div-" + tag + ".json"));
  if (tr.verdict !== "COMPLETE") throw new Error("div train missing " + tag);
  const M = inSeqMakeModel(G.makeRng(1));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(M.E, tr.P.E); load(M.W1, tr.P.W1); load(M.b1, tr.P.b1);
  load(M.Wf, tr.P.Wf); load(M.bf, tr.P.bf); load(M.Wc, tr.P.Wc); load(M.bc, tr.P.bc);
  for (let k = 0; k < 5; k++) { load(M.Wh[k], tr.P.Wh[k]); load(M.bh[k], tr.P.bh[k]); }
  load(M.Hv, tr.P.Hv); load(M.bv, tr.P.bv);
  let evalMasks = null; { const fr = G.makeRng(91000 + seed); evalMasks = []; for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr.int(10) < 5 ? 2 : 0; evalMasks.push(m); } }
  const srng = G.makeRng(52500 + seed), frng = G.makeRng(52400 + seed);
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  let scr = 0, one = 0, two = 0, orc = 0, dsum = 0, spreadSum = 0;
  for (let i = 0; i < N; i++) {
    const e = inSeqGenShift(srng, null);
    const c0 = new Float64Array(8);
    const fw1 = inSeqForward(M, e.x, c0, evalMasks);
    const vhat = argmax4(fw1.hvLog);
    if (vhat === e.v) scr++;
    if (argmax4(inMeanLogits({ logitsK: fw1.logitsK })) === e.y) one++;
    dsum += fw1.disagree;
    { const K5 = 5; let sp = 0; const mean = [0, 0, 0, 0]; for (let k = 0; k < K5; k++) for (let o = 0; o < 4; o++) mean[o] += fw1.logitsK[k][o] / K5; for (let k = 0; k < K5; k++) for (let o = 0; o < 4; o++) sp += (fw1.logitsK[k][o] - mean[o]) * (fw1.logitsK[k][o] - mean[o]); spreadSum += sp / K5 / 4; }
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
    const fw = inSeqForward(M, e.x, new Float64Array(8), evalMasks);
    if (argmax4(inMeanLogits({ logitsK: fw.logitsK })) === e.y) fF++;
  }
  const body = { spec: "div-v10.1", track: "DIVERSITY", arm, seed, steps, verdict: "COMPLETE", n: N,
    accScratch: +(scr / N).toFixed(4), accOne: +(one / N).toFixed(4), accTwo: +(two / N).toFixed(4),
    accOracle: +(orc / N).toFixed(4), accFwd: +(fF / N).toFixed(4),
    meanDisagree: +(dsum / N).toFixed(4), meanSpread: +(spreadSum / N).toFixed(4) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("div-eval " + tag + " scr=" + body.accScratch + " two=" + body.accTwo + " dis=" + body.meanDisagree + " spread=" + body.meanSpread);
  return body;
};
