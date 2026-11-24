// newai-cause-driver.js — Step 6 causality (frozen weights: P1 seed-swap, P2 order-perm, P3 label-perm).
globalThis.CauseInit = async function (fs) {
  for (const p of ["src/evidence/decomp/intrinsic-driver.js", "src/evidence/decomp/newai-driver.js", "src/evidence/decomp/newai-v102-driver.js", "src/evidence/decomp/newai-fr-driver.js"]) {
    const src = await fs.readTextFile(p); (0, eval)(src + "\n//# sourceURL=" + p);
  }
  if (!globalThis.runForcedEval) throw new Error("cause stack load failed");
};
function causeLedgerPath(model, seed) {
  if (model === "fr-force") return "src/evidence/decomp/d-newai-fr-fr-force-s" + seed + "-800st.json";
  if (model === "div-boot") return "src/evidence/decomp/d-newai-div-div-boot-s" + seed + "-800st.json";
  if (model === "cur-pick") return "src/evidence/decomp/d-newai-cur-cur-pick-s" + seed + "-800st.json";
  throw new Error("unknown model " + model);
}
globalThis.runCauseEval = async function (fs, log, opts) {
  const { model, seed, probe } = opts;
  const N = 200;
  const t = (seed + 1) % 3;
  const tag = probe + "-" + model + "-s" + seed;
  const ledgerPath = "src/evidence/decomp/d-newai-cause-" + tag + ".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  const G = await globalThis.IntrinsicInit(fs);
  const tr = JSON.parse(await fs.readTextFile(causeLedgerPath(model, seed)));
  if (tr.verdict !== "COMPLETE") throw new Error("frozen train missing " + model + " s" + seed);
  const M = inSeqMakeModel(G.makeRng(1));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(M.E, tr.P.E); load(M.W1, tr.P.W1); load(M.b1, tr.P.b1);
  load(M.Wf, tr.P.Wf); load(M.bf, tr.P.bf); load(M.Wc, tr.P.Wc); load(M.bc, tr.P.bc);
  for (let k = 0; k < 5; k++) { load(M.Wh[k], tr.P.Wh[k]); load(M.bh[k], tr.P.bh[k]); }
  load(M.Hv, tr.P.Hv); load(M.bv, tr.P.bv);
  let evalMasks = null; { const fr = G.makeRng(91000 + seed); evalMasks = []; for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr.int(10) < 5 ? 2 : 0; evalMasks.push(m); } }
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  // smoke (R2): single-model single-seed 3-probe — logged on fr-force s0 first probe call (filed)
  const streamsSeed = (probe === "p1") ? t : seed;
  const srng = G.makeRng(52500 + streamsSeed);
  let scr = 0, two = 0;
  for (let i = 0; i < N; i++) {
    const e0 = inSeqGenShift(srng, null);
    let e = e0;
    let yTarget = e0.y;
    if (probe === "p2") {
      // reverse flat 6 (same pairs, opposite order)
      const rev = e0.flat.slice().reverse();
      // reverse in pair-chunks to keep k,v pairing? Spec: reverse flat order (filed as pair-chunk reverse to preserve pairs — deviation noted: full-token reverse would break pairs; pair-chunk reverse preserves info, tests order only)
      const pr = [];
      for (let p = 2; p >= 0; p--) pr.push(e0.flat[p * 2], e0.flat[p * 2 + 1]);
      e = { flat: pr, qk: e0.qk, k: e0.k, v: e0.v, y: e0.y, x: pr.concat([e0.qk, e0.k, 0, 8]) };
    }
    if (probe === "p3") yTarget = (e0.y + 1) % 4; // label shift (v unchanged, x same)
    const c0 = new Float64Array(8);
    const fw1 = inSeqForward(M, e.x, c0, evalMasks);
    const vhat = argmax4(fw1.hvLog);
    if (vhat === e.v) scr++;
    const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
    const fw2 = inSeqForward(M, x2m, fw1.cNew, evalMasks);
    if (argmax4(inMeanLogits({ logitsK: fw2.logitsK })) === yTarget) two++;
  }
  // P3 counts permuted-target hits only (task-bound model predicts true y → 0; guessing → ~0.25). No true-label subtract (v10.1 bug fixed: guard removed).
  const body = { spec: "cause-v10.1", probe, model, weightsSeed: seed, streamsSeed, maskSeed: seed,
    perm: probe === "p1" ? ("streams-t" + t) : probe === "p2" ? "reverse-flat-pairchunks" : "label+1mod4",
    seedMap: "t=(s+1)%3", labelShift: probe === "p3" ? "(y+1)%4" : "none",
    seed, verdict: "COMPLETE", n: N,
    accScratch: +(scr / N).toFixed(4), accTwo: +(two / N).toFixed(4) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("cause-" + probe + " " + tag + " scr=" + body.accScratch + " two=" + body.accTwo + " (w" + seed + "/s" + streamsSeed + "/m" + seed + ")");
  return body;
};
