// newai-fr-driver.js — Step 1 forced-read (masked pass2, own-vhat from step 0).
// Reuses v102 SEQ globals (inSeqMakeModel/inSeqForward/inSeqBackward/inSeqGenShift/inMeanLogits/inCELossGrad...).
globalThis.ForcedInit = async function (fs) {
  for (const p of ["src/evidence/decomp/intrinsic-driver.js", "src/evidence/decomp/newai-driver.js", "src/evidence/decomp/newai-v102-driver.js"]) {
    const src = await fs.readTextFile(p); (0, eval)(src + "\n//# sourceURL=" + p);
  }
  if (!globalThis.runSeqTrain) throw new Error("fr stack load failed");
};
function frArmCode(arm) {
  if (arm === "fr-force") return 31; if (arm === "fr-explicit") return 32; if (arm === "fr-dummy") return 33;
  if (arm.startsWith("fr-e")) { let h = 0; for (let i = 0; i < arm.length; i++) h = (h * 31 + arm.charCodeAt(i)) | 0; return 34 + (Math.abs(h) % 60); }
  return 31;
}
function inSeqMakeModelH(rng, H) {
  const D = 12, CD = 8, C = 4, K = 5, LEN = 10;
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
globalThis.runForcedTrain = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const H = opts.H || 48;
  const steps = opts.steps || 800, B = 16, lr = 5e-3, K = 5;
  const tag = arm + "-s" + seed + "-" + steps + "st" + (H !== 48 ? "-H" + H : "");
  const ledgerPath = "src/evidence/decomp/d-newai-fr-" + tag + ".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  const G = await globalThis.IntrinsicInit(fs);
  const rng = G.makeRng(41000 + seed * 7919 + frArmCode(arm) * 131 + (H !== 48 ? H : 0));
  const M = (H === 48) ? inSeqMakeModel(rng) : inSeqMakeModelH(rng, H);
  const params = inSeqParams(M);
  const opt = new G.Adam(lr);
  const dataRng = G.makeRng(42000 + seed * 104729 + 55);
  let fixedMasks = null; { const fr = G.makeRng(91000 + seed); fixedMasks = []; for (let k = 0; k < K; k++) { const m = new Float64Array(H); for (let i = 0; i < H; i++) m[i] = fr.int(10) < 5 ? 2 : 0; fixedMasks.push(m); } }
  const auxW = (arm === "fr-dummy") ? 0 : 1.0;
  const t0 = Date.now(), curve = [];
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  // smoke: mask OOB + dc chaining (filed per R2)
  {
    const e0 = inSeqGenShift(G.makeRng(999 + seed), null);
    const c0 = new Float64Array(8);
    const f1 = inSeqForward(M, e0.x, c0, fixedMasks);
    const vh = argmax4(f1.hvLog);
    const x2m = [9, 9, 9, 9, 9, 9, e0.qk, e0.k, vh, 8];
    const f2 = inSeqForward(M, x2m, f1.cNew, fixedMasks);
    log("fr-smoke s=" + seed + " " + arm + " vhat=" + vh + " two-logits=" + Array.from(inMeanLogits({ logitsK: f2.logitsK })).map((v) => +v.toFixed(3)).join(","));
  }
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
      if (arm === "fr-explicit") x2v = e.v;
      const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, x2v, 8];
      const fw2 = inSeqForward(M, x2m, fw1.cNew, fixedMasks);
      const mean2 = inMeanLogits({ logitsK: fw2.logitsK });
      const ce2 = inCELossGrad(mean2, e.y);
      const dMean2 = new Float64Array(4); for (let o = 0; o < 4; o++) dMean2[o] = ce2.d[o] / B;
      const perHead2 = fw2.logitsK.map((lg) => { const ce = inCELossGrad(lg, e.y); const d = new Float64Array(4); for (let o = 0; o < 4; o++) d[o] = ce.d[o] * 0.1 / B; return d; });
      lsum += ce2.loss + auxW * ceHv.loss;
      const dc = inSeqBackward(M, fw2, dMean2, perHead2, null, null, fixedMasks);
      const dc0 = inSeqBackward(M, fw1, null, null, (arm === "fr-dummy") ? null : dHv, dc, fixedMasks);
      void dc0;
      const meanW = new Float64Array(M.Wh[0].v.length);
      for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) meanW[i] += M.Wh[k].v[i] / K;
      for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) M.Wh[k].g[i] += 4.0 * (M.Wh[k].v[i] - meanW[i]) / (B * M.H);
    }
    opt.step(params);
    if (step % 100 === 0 || step === steps - 1) curve.push({ step, loss: +(lsum / B).toFixed(6) });
  }
  const save = (o) => Array.from(o.v);
  const body = { spec: "force-v10", track: "FORCED-READ", arm, seed, steps, B, lr, K, H, auxW, masked: "[9x6]+[qk,k,v,8] from step 0", verdict: "COMPLETE", wallMs: Date.now() - t0,
    curve, divCos: +inMeanCos(M).toFixed(4),
    P: { E: save(M.E), W1: save(M.W1), b1: save(M.b1), Wf: save(M.Wf), bf: save(M.bf), Wc: save(M.Wc), bc: save(M.bc),
      Wh: M.Wh.map(save), bh: M.bh.map(save), Hv: save(M.Hv), bv: save(M.bv) } };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("forced-train " + tag + " loss0=" + curve[0].loss + " lossN=" + curve[curve.length - 1].loss);
  return body;
};
globalThis.runForcedEval = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const H = opts.H || 48, steps = opts.steps || 800, N = 200;
  const carryZero = !!opts.carryZero;
  const tag = arm + "-s" + seed + "-" + steps + "st" + (H !== 48 ? "-H" + H : "") + (carryZero ? "-cz" : "");
  const ledgerPath = "src/evidence/decomp/d-newai-fr-eval-" + tag + ".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  const G = await globalThis.IntrinsicInit(fs);
  const trTag = arm + "-s" + seed + "-" + steps + "st" + (H !== 48 ? "-H" + H : "");
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-fr-" + trTag + ".json"));
  if (tr.verdict !== "COMPLETE") throw new Error("forced train missing " + trTag);
  const M = (H === 48) ? inSeqMakeModel(G.makeRng(1)) : inSeqMakeModelH(G.makeRng(1), H);
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
    const c0 = new Float64Array(8);
    const fw1 = inSeqForward(M, e.x, c0, evalMasks);
    const vhat = argmax4(fw1.hvLog);
    if (vhat === e.v) scr++;
    if (argmax4(inMeanLogits({ logitsK: fw1.logitsK })) === e.y) one++;
    const c1 = carryZero ? new Float64Array(8) : fw1.cNew;
    const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
    const fw2 = inSeqForward(M, x2m, c1, evalMasks);
    if (argmax4(inMeanLogits({ logitsK: fw2.logitsK })) === e.y) two++;
    const xo = [9, 9, 9, 9, 9, 9, e.qk, e.k, e.v, 8];
    const fwo = inSeqForward(M, xo, c1, evalMasks);
    if (argmax4(inMeanLogits({ logitsK: fwo.logitsK })) === e.y) orc++;
  }
  let fF = 0;
  for (let i = 0; i < N; i++) {
    const e = inSeqGenShift(frng, 0);
    const fw = inSeqForward(M, e.x, new Float64Array(8), evalMasks);
    if (argmax4(inMeanLogits({ logitsK: fw.logitsK })) === e.y) fF++;
  }
  const body = { spec: "force-v10", track: "FORCED-READ", arm, seed, steps, H, carryZero, verdict: "COMPLETE", n: N,
    accScratch: +(scr / N).toFixed(4), accOne: +(one / N).toFixed(4), accTwo: +(two / N).toFixed(4),
    accOracle: +(orc / N).toFixed(4), accFwd: +(fF / N).toFixed(4) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("forced-eval " + tag + " scr=" + body.accScratch + " one=" + body.accOne + " two=" + body.accTwo + " orc=" + body.accOracle + " fwd=" + body.accFwd);
  return body;
};
