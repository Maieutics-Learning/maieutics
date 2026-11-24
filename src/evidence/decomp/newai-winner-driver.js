// newai-winner-driver.js — Winner-combine recipe + seed sweeps (parameterized generalization of
// runCurTrain/runCurEval in newai-cur-driver.js; identical forward/backward structure, only
// C / auxW / steps / lamDiv vary). Twin-matched per seed: init/data/mask/eval streams keyed by
// seed exactly as in cur/div drivers. CPU/in-worker only. NO PUSH.
globalThis.WinnerInit = async function (fs) {
  for (const p of ["src/evidence/decomp/intrinsic-driver.js", "src/evidence/decomp/newai-driver.js", "src/evidence/decomp/newai-v102-driver.js", "src/evidence/decomp/newai-fr-driver.js", "src/evidence/decomp/newai-div-driver.js", "src/evidence/decomp/newai-cur-driver.js"]) {
    const src = await fs.readTextFile(p); (0, eval)(src + "\n//# sourceURL=" + p);
  }
  if (!globalThis.runCurTrain) throw new Error("winner stack load failed");
};
function wArmCode(arm) {
  // distinct init streams per winner arm; sweep arms share the w6 recipe code with seed offset
  if (arm === "w1") return 71; if (arm === "w2") return 72; if (arm === "w3") return 73;
  if (arm === "w4") return 74; if (arm === "w5") return 75; if (arm === "w6") return 76;
  if (arm === "w6sweep") return 76; return 76;
}
function wCfg(arm) {
  // recipe table (from winner-prereg.md + filed W6 amendment: C6 + auxW0.5 + lam2.0)
  if (arm === "w1") return { C: 6, auxW: 0.5, steps: 1400, lam: 4.0 };
  if (arm === "w2") return { C: 6, auxW: 1.0, steps: 1400, lam: 4.0 };
  if (arm === "w3") return { C: 4, auxW: 0.5, steps: 1400, lam: 4.0 };
  if (arm === "w4") return { C: 6, auxW: 0.5, steps: 800, lam: 4.0 };
  if (arm === "w5") return { C: 6, auxW: 0.5, steps: 1400, lam: 2.0 };
  if (arm === "w6" || arm === "w6sweep") return { C: 6, auxW: 0.5, steps: 800, lam: 2.0 };
  throw new Error("unknown winner arm " + arm);
}
globalThis.runWinnerTrain = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const cfg = wCfg(arm);
  const { C, auxW, steps, lam } = cfg;
  const B = 16, lr = 5e-3, K = 5, H = 48;
  const tag = arm + "-s" + seed + "-" + steps + "st";
  const ledgerPath = "src/evidence/decomp/d-newai-w-" + tag + ".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  const G = await globalThis.IntrinsicInit(fs);
  const rng = G.makeRng(73000 + seed * 7919 + wArmCode(arm) * 131);
  const M = inSeqMakeModel(rng);
  const params = inSeqParams(M);
  const opt = new G.Adam(lr);
  const dataRng = G.makeRng(42000 + seed * 104729 + 55); // same per-seed stream as cur/div (paired)
  let fixedMasks = null; { const fr = G.makeRng(91000 + seed); fixedMasks = []; for (let k = 0; k < K; k++) { const m = new Float64Array(H); for (let i = 0; i < H; i++) m[i] = fr.int(10) < 5 ? 2 : 0; fixedMasks.push(m); } }
  const t0 = Date.now(), curve = [];
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  for (let step = 0; step < steps; step++) {
    for (const p of params) p.g.fill(0);
    let lsum = 0;
    for (let b = 0; b < B; b++) {
      // C draws, pick max vote-disagree (ties → lowest index, pinned — same as cur-pick)
      const cands = [];
      for (let c = 0; c < C; c++) { const ub = dataRng.int(2) === 0; cands.push(ub ? inSeqGenShift(dataRng, 0) : inSeqGenShift(dataRng, null)); }
      let pk = 0, best = -1;
      for (let c = 0; c < C; c++) {
        const fw = inSeqForward(M, cands[c].x, new Float64Array(8), fixedMasks);
        const d = curVoteDisagree(fw.logitsK);
        if (d > best) { best = d; pk = c; }
      }
      const e = cands[pk];
      const c0 = new Float64Array(8);
      const fw1 = inSeqForward(M, e.x, c0, fixedMasks);
      const ceHv = inCELossGrad(fw1.hvLog, e.v);
      const dHv = new Float64Array(4); for (let o = 0; o < 4; o++) dHv[o] = ceHv.d[o] * auxW / B;
      const vhat = argmax4(fw1.hvLog);
      const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
      const fw2 = inSeqForward(M, x2m, fw1.cNew, fixedMasks);
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
      const mean2 = inMeanLogits({ logitsK: fw2.logitsK });
      const ce2 = inCELossGrad(mean2, e.y);
      const dMean2 = new Float64Array(4); for (let o = 0; o < 4; o++) dMean2[o] = ce2.d[o] / B;
      const mean1 = inMeanLogits({ logitsK: fw1.logitsK });
      const ce1m = inCELossGrad(mean1, e.y);
      const dMean1 = new Float64Array(4); for (let o = 0; o < 4; o++) dMean1[o] = ce1m.d[o] * 0.3 / B;
      lsum += ce2.loss + auxW * ceHv.loss;
      const dc = inSeqBackward(M, fw2, dMean2, perHead2, null, null, fixedMasks);
      inSeqBackward(M, fw1, dMean1, perHead1, dHv, dc, fixedMasks);
      const meanW = new Float64Array(M.Wh[0].v.length);
      for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) meanW[i] += M.Wh[k].v[i] / K;
      for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) M.Wh[k].g[i] += lam * (M.Wh[k].v[i] - meanW[i]) / (B * M.H);
    }
    let s = 0; for (const p of params) for (let i = 0; i < p.g.length; i++) s += p.g[i] * p.g[i];
    const n = Math.sqrt(s); if (n > 1.0) { const sc = 1.0 / n; for (const p of params) for (let i = 0; i < p.g.length; i++) p.g[i] *= sc; }
    opt.step(params);
    if (step % 100 === 0 || step === steps - 1) curve.push({ step, loss: +(lsum / B).toFixed(6) });
  }
  const save = (o) => Array.from(o.v);
  const body = { spec: "winner-prereg", track: "WINNER", arm, seed, steps, B, lr, K, H, C, auxW, lam, bootstraps: "b%K slices (same as cur-pick)", verdict: "COMPLETE", wallMs: Date.now() - t0,
    frozen: true, curve, divCos: +inMeanCos(M).toFixed(4),
    P: { E: save(M.E), W1: save(M.W1), b1: save(M.b1), Wf: save(M.Wf), bf: save(M.bf), Wc: save(M.Wc), bc: save(M.bc),
      Wh: M.Wh.map(save), bh: M.bh.map(save), Hv: save(M.Hv), bv: save(M.bv) } };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("winner-train " + tag + " C=" + C + " auxW=" + auxW + " lam=" + lam + " loss0=" + curve[0].loss + " lossN=" + curve[curve.length - 1].loss);
  return body;
};
globalThis.runWinnerEval = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const cfg = wCfg(arm);
  const steps = cfg.steps, N = 200;
  const tag = arm + "-s" + seed + "-" + steps + "st";
  const ledgerPath = "src/evidence/decomp/d-newai-w-eval-" + tag + ".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  const G = await globalThis.IntrinsicInit(fs);
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-w-" + tag + ".json"));
  if (tr.verdict !== "COMPLETE") throw new Error("winner train missing " + tag);
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
  const body = { spec: "winner-prereg", track: "WINNER", arm, seed, steps, verdict: "COMPLETE", n: N, frozenTest: true,
    accScratch: +(scr / N).toFixed(4), accOne: +(one / N).toFixed(4), accTwo: +(two / N).toFixed(4),
    accOracle: +(orc / N).toFixed(4), accFwd: +(fF / N).toFixed(4) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("winner-eval " + tag + " scr=" + body.accScratch + " two=" + body.accTwo + " orc=" + body.accOracle);
  return body;
};
