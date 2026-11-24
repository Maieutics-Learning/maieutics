// newai-final-driver.js — Final 10 F1 explicit 2-head (Hv + tiny head on [hvLog, onehot(k)], no trunk final, end-to-end).
globalThis.FinalInit = async function (fs) {
  for (const p of ["src/evidence/decomp/intrinsic-driver.js", "src/evidence/decomp/newai-driver.js", "src/evidence/decomp/newai-v102-driver.js", "src/evidence/decomp/newai-fr-driver.js"]) {
    const src = await fs.readTextFile(p); (0, eval)(src + "\n//# sourceURL=" + p);
  }
  if (!globalThis.runForcedTrain) throw new Error("final stack load failed");
};
function finalArmCode(arm) {
  if (arm === "f1-explicit") return 71; return 71;
}
function tinyInit(rng) {
  // 8->8->4 (inp [hvLog4, onehotK4])
  const T = {
    W1: inParam(rng, 8 * 8, 8), b1: inParam(rng, 8, 8),
    W2: inParam(rng, 8 * 4, 8), b2: inParam(rng, 4, 8),
  };
  return T;
}
function tinyParams(T) { return [T.W1, T.b1, T.W2, T.b2]; }
function tinyForward(T, hvLog, k) {
  const inp = new Float64Array(8);
  for (let o = 0; o < 4; o++) inp[o] = hvLog[o];
  for (let o = 0; o < 4; o++) inp[4 + o] = (o === k) ? 1 : 0;
  const pre = new Float64Array(8);
  for (let o = 0; o < 8; o++) {
    let s = T.b1.v[o]; const off = o * 8;
    for (let i = 0; i < 8; i++) s += T.W1.v[off + i] * inp[i];
    pre[o] = s;
  }
  const h = new Float64Array(8);
  for (let o = 0; o < 8; o++) { const s = pre[o]; h[o] = s / (1 + Math.exp(-s)); }
  const logits = new Float64Array(4);
  for (let o = 0; o < 4; o++) {
    let s = T.b2.v[o]; const off = o * 8;
    for (let i = 0; i < 8; i++) s += T.W2.v[off + i] * h[i];
    logits[o] = s;
  }
  return { inp, pre, h, logits };
}
function tinyBackward(T, fw, dLogits, B) {
  // returns dHvLog (4) for chaining into Hv; onehot part ignored
  const dh2 = new Float64Array(8);
  for (let o = 0; o < 4; o++) {
    T.b2.g[o] += dLogits[o];
    const off = o * 8;
    for (let i = 0; i < 8; i++) { T.W2.g[off + i] += dLogits[o] * fw.h[i] / B * B; dh2[i] += dLogits[o] * T.W2.v[off + i]; }
  }
  // careful: dLogits already scaled by 1/B by caller; W grads use raw (caller scales), dh2 raw
  const dInp = new Float64Array(8);
  for (let o = 0; o < 8; o++) {
    const sig = 1 / (1 + Math.exp(-fw.pre[o]));
    const d = dh2[o] * (fw.h[o] + sig * (1 - fw.h[o]));
    T.b1.g[o] += d;
    const off = o * 8;
    for (let i = 0; i < 8; i++) { T.W1.g[off + i] += d * fw.inp[i]; dInp[i] += d * T.W1.v[off + i]; }
  }
  return dInp.slice(0, 4); // dHvLog
}
globalThis.runFinalF1Train = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const steps = 800, B = 16, lr = 5e-3, K = 5, H = 48;
  const tag = arm + "-s" + seed + "-" + steps + "st";
  const ledgerPath = "src/evidence/decomp/d-newai-final-" + tag + ".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  const G = await globalThis.IntrinsicInit(fs);
  const rng = G.makeRng(81000 + seed * 7919 + finalArmCode(arm) * 131);
  const M = inSeqMakeModel(rng);
  const T = tinyInit(G.makeRng(82000 + seed * 104729));
  const params = inSeqParams(M).concat(tinyParams(T));
  const opt = new G.Adam(lr);
  const dataRng = G.makeRng(42000 + seed * 104729 + 55); // locked streams (weight-locking = streams, filed)
  let fixedMasks = null; { const fr = G.makeRng(91000 + seed); fixedMasks = []; for (let k = 0; k < K; k++) { const m = new Float64Array(H); for (let i = 0; i < H; i++) m[i] = fr.int(10) < 5 ? 2 : 0; fixedMasks.push(m); } }
  const auxW = 1.0, t0 = Date.now(), curve = [];
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
      // tiny head on [hvLog, k]
      const ft = tinyForward(T, fw1.hvLog, e.k);
      const ceT = inCELossGrad(ft.logits, e.y);
      // grads (scaled 1/B)
      const dTiny = new Float64Array(4); for (let o = 0; o < 4; o++) dTiny[o] = ceT.d[o] / B;
      // tiny backward (W grads need /B scaling — tinyBackward uses raw dLogits for W grads? Fix: scale inside)
      // Recompute with correct scaling: do manual scaled version here (avoid double-scale bug):
      // Clear and redo tiny grads scaled:
      const dh2 = new Float64Array(8);
      for (let o = 0; o < 4; o++) {
        T.b2.g[o] += dTiny[o];
        const off = o * 8;
        for (let i = 0; i < 8; i++) { T.W2.g[off + i] += dTiny[o] * ft.h[i]; dh2[i] += dTiny[o] * T.W2.v[off + i]; }
      }
      const dHvTiny = new Float64Array(4);
      {
        const dInp = new Float64Array(8);
        for (let o = 0; o < 8; o++) {
          const sig = 1 / (1 + Math.exp(-ft.pre[o]));
          const d = dh2[o] * (ft.h[o] + sig * (1 - ft.h[o]));
          T.b1.g[o] += d;
          const off = o * 8;
          for (let i = 0; i < 8; i++) { T.W1.g[off + i] += d * ft.inp[i]; dInp[i] += d * T.W1.v[off + i]; }
        }
        for (let o = 0; o < 4; o++) dHvTiny[o] = dInp[o];
      }
      const dHv = new Float64Array(4); for (let o = 0; o < 4; o++) dHv[o] = ceHv.d[o] * auxW / B + dHvTiny[o];
      lsum += ceT.loss + auxW * ceHv.loss;
      // trunk backward via Hv only (no trunk final, no Div heads used — filed deviation; Div nudge skipped for F1)
      inSeqBackward(M, fw1, null, null, dHv, null, fixedMasks);
    }
    let s = 0; for (const p of params) for (let i = 0; i < p.g.length; i++) s += p.g[i] * p.g[i];
    const n = Math.sqrt(s); if (n > 1.0) { const sc = 1.0 / n; for (const p of params) for (let i = 0; i < p.g.length; i++) p.g[i] *= sc; }
    opt.step(params);
    if (step % 100 === 0 || step === steps - 1) curve.push({ step, loss: +(lsum / B).toFixed(6) });
  }
  const save = (o) => Array.from(o.v);
  const body = { spec: "final-v10.1", track: "FINAL-F1", arm, seed, steps, B, lr, K, H, explicit: "[hvLog,k]-only tiny 8-8-4, no trunk final, no carry, end-to-end", verdict: "COMPLETE", wallMs: Date.now() - t0,
    curve, divCos: +inMeanCos(M).toFixed(4),
    P: { E: save(M.E), W1: save(M.W1), b1: save(M.b1), Wf: save(M.Wf), bf: save(M.bf), Wc: save(M.Wc), bc: save(M.bc),
      Wh: M.Wh.map(save), bh: M.bh.map(save), Hv: save(M.Hv), bv: save(M.bv),
      T: { W1: save(T.W1), b1: save(T.b1), W2: save(T.W2), b2: save(T.b2) } } };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("final-f1-train " + tag + " loss0=" + curve[0].loss + " lossN=" + curve[curve.length - 1].loss);
  return body;
};
globalThis.runFinalF1Eval = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const steps = 800, N = 200;
  const tag = arm + "-s" + seed + "-" + steps + "st";
  const ledgerPath = "src/evidence/decomp/d-newai-final-eval-" + tag + ".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  const G = await globalThis.IntrinsicInit(fs);
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-final-" + tag + ".json"));
  if (tr.verdict !== "COMPLETE") throw new Error("final f1 train missing " + tag);
  const M = inSeqMakeModel(G.makeRng(1));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(M.E, tr.P.E); load(M.W1, tr.P.W1); load(M.b1, tr.P.b1);
  load(M.Wf, tr.P.Wf); load(M.bf, tr.P.bf); load(M.Wc, tr.P.Wc); load(M.bc, tr.P.bc);
  for (let k = 0; k < 5; k++) { load(M.Wh[k], tr.P.Wh[k]); load(M.bh[k], tr.P.bh[k]); }
  load(M.Hv, tr.P.Hv); load(M.bv, tr.P.bv);
  const T = tinyInit(G.makeRng(1));
  load(T.W1, tr.P.T.W1); load(T.b1, tr.P.T.b1); load(T.W2, tr.P.T.W2); load(T.b2, tr.P.T.b2);
  let evalMasks = null; { const fr = G.makeRng(91000 + seed); evalMasks = []; for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr.int(10) < 5 ? 2 : 0; evalMasks.push(m); } }
  const srng = G.makeRng(52500 + seed), frng = G.makeRng(52400 + seed);
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  let scr = 0, two = 0, orc = 0;
  for (let i = 0; i < N; i++) {
    const e = inSeqGenShift(srng, null);
    const fw1 = inSeqForward(M, e.x, new Float64Array(8), evalMasks);
    const vhat = argmax4(fw1.hvLog);
    if (vhat === e.v) scr++;
    const ft = tinyForward(T, fw1.hvLog, e.k);
    if (argmax4(ft.logits) === e.y) two++;
    // oracle: tiny head on TRUE v one-hot (as hvLog surrogate: one-hot scaled? Use onehot*2 to mimic logit scale — filed openly; tests tiny-head capacity given true v)
    const hvOne = new Float64Array([e.v === 0 ? 2 : -1, e.v === 1 ? 2 : -1, e.v === 2 ? 2 : -1, e.v === 3 ? 2 : -1]);
    const fto = tinyForward(T, hvOne, e.k);
    if (argmax4(fto.logits) === e.y) orc++;
  }
  let fF = 0;
  for (let i = 0; i < N; i++) {
    const e = inSeqGenShift(frng, 0);
    const fw = inSeqForward(M, e.x, new Float64Array(8), evalMasks);
    if (argmax4(fw.hvLog) === e.v) fF++; // fwd for F1 = retrieve on base-k0 (Hv), filed
  }
  const body = { spec: "final-v10.1", track: "FINAL-F1", arm, seed, steps, verdict: "COMPLETE", n: N,
    accScratch: +(scr / N).toFixed(4), accTwo: +(two / N).toFixed(4), accOracle: +(orc / N).toFixed(4), accFwd: +(fF / N).toFixed(4) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("final-f1-eval " + tag + " scr=" + body.accScratch + " two=" + body.accTwo + " orc=" + body.accOracle);
  return body;
};
