// newai-hard-driver.js — Step 5 harder gain (eval-only on frozen weights: noisy + double + warm-start double).
globalThis.HardInit = async function (fs) {
  for (const p of ["src/evidence/decomp/intrinsic-driver.js", "src/evidence/decomp/newai-driver.js", "src/evidence/decomp/newai-v102-driver.js", "src/evidence/decomp/newai-fr-driver.js"]) {
    const src = await fs.readTextFile(p); (0, eval)(src + "\n//# sourceURL=" + p);
  }
  if (!globalThis.runForcedEval) throw new Error("hard stack load failed");
};
function hardLedgerPath(model, seed) {
  if (model === "fr-force") return "src/evidence/decomp/d-newai-fr-fr-force-s" + seed + "-800st.json";
  if (model === "div-boot") return "src/evidence/decomp/d-newai-div-div-boot-s" + seed + "-800st.json";
  if (model === "cur-pick") return "src/evidence/decomp/d-newai-cur-cur-pick-s" + seed + "-800st.json";
  if (model === "cur-rand") return "src/evidence/decomp/d-newai-cur-cur-rand-s" + seed + "-800st.json";
  if (model === "div-func") return "src/evidence/decomp/d-newai-div-div-func-s" + seed + "-800st.json";
  throw new Error("unknown model " + model);
}
globalThis.runHardEval = async function (fs, log, opts) {
  const { model, seed, hard } = opts;
  const N = 200;
  const tag = hard + "-" + model + "-s" + seed;
  const ledgerPath = "src/evidence/decomp/d-newai-hard-" + tag + ".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  const G = await globalThis.IntrinsicInit(fs);
  const tr = JSON.parse(await fs.readTextFile(hardLedgerPath(model, seed)));
  if (tr.verdict !== "COMPLETE") throw new Error("frozen train missing " + model + " s" + seed);
  const M = inSeqMakeModel(G.makeRng(1));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(M.E, tr.P.E); load(M.W1, tr.P.W1); load(M.b1, tr.P.b1);
  load(M.Wf, tr.P.Wf); load(M.bf, tr.P.bf); load(M.Wc, tr.P.Wc); load(M.bc, tr.P.bc);
  for (let k = 0; k < 5; k++) { load(M.Wh[k], tr.P.Wh[k]); load(M.bh[k], tr.P.bh[k]); }
  load(M.Hv, tr.P.Hv); load(M.bv, tr.P.bv);
  let evalMasks = null; { const fr = G.makeRng(91000 + seed); evalMasks = []; for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr.int(10) < 5 ? 2 : 0; evalMasks.push(m); } }
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  if (hard === "noisy") {
    const srng = G.makeRng(52500 + seed), nrng = G.makeRng(53100 + seed), prng = G.makeRng(53200 + seed);
    let scr = 0, two = 0;
    for (let i = 0; i < N; i++) {
      const e = inSeqGenShift(srng, null);
      const xn = e.x.slice();
      const pos = prng.int(6); // flat only (0-5)
      xn[pos] = nrng.int(9);
      const fw1 = inSeqForward(M, xn, new Float64Array(8), evalMasks);
      const vhat = argmax4(fw1.hvLog);
      if (vhat === e.v) scr++;
      const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
      const fw2 = inSeqForward(M, x2m, fw1.cNew, evalMasks);
      if (argmax4(inMeanLogits({ logitsK: fw2.logitsK })) === e.y) two++;
    }
    const body = { spec: "hard-v10.1", hard, model, seed, verdict: "COMPLETE", n: N, accScratch: +(scr / N).toFixed(4), accTwo: +(two / N).toFixed(4) };
    await fs.writeTextFile(ledgerPath, JSON.stringify(body));
    log("hard-noisy " + tag + " scr=" + body.accScratch + " two=" + body.accTwo);
    return body;
  }
  if (hard === "double" || hard === "warm") {
    const srng = G.makeRng(52500 + seed);
    let scr2 = 0, two2 = 0;
    // smoke (R2): single-seed fr-force double plumbing (<10s) — logged on first call
    for (let i = 0; i < N; i++) {
      const ea = inSeqGenShift(srng, null), eb = inSeqGenShift(srng, null);
      let c = new Float64Array(8);
      // q1
      const fw1a = inSeqForward(M, ea.x, c, evalMasks);
      let cAfterQ1;
      if (hard === "warm") {
        const vha = argmax4(fw1a.hvLog); // scored but unused (warm forces oracle for q1)
        void vha;
        const xoa = [9, 9, 9, 9, 9, 9, ea.qk, ea.k, ea.v, 8];
        const fwoa = inSeqForward(M, xoa, fw1a.cNew, evalMasks);
        cAfterQ1 = fwoa.cNew; // correct-q1 state into q2 (warm-start control)
      } else {
        const vha = argmax4(fw1a.hvLog);
        const x2a = [9, 9, 9, 9, 9, 9, ea.qk, ea.k, vha, 8];
        const fw2a = inSeqForward(M, x2a, fw1a.cNew, evalMasks);
        cAfterQ1 = fw2a.cNew; // carry persists (pinned, not cleared)
      }
      // q2 (the measured one)
      const fw1b = inSeqForward(M, eb.x, cAfterQ1, evalMasks);
      const vhb = argmax4(fw1b.hvLog);
      if (vhb === eb.v) scr2++;
      const x2b = [9, 9, 9, 9, 9, 9, eb.qk, eb.k, vhb, 8];
      const fw2b = inSeqForward(M, x2b, fw1b.cNew, evalMasks);
      if (argmax4(inMeanLogits({ logitsK: fw2b.logitsK })) === eb.y) two2++;
    }
    const body = { spec: "hard-v10.1", hard, model, seed, verdict: "COMPLETE", n: N, accScratch2: +(scr2 / N).toFixed(4), accTwo2: +(two2 / N).toFixed(4) };
    await fs.writeTextFile(ledgerPath, JSON.stringify(body));
    log("hard-" + hard + " " + tag + " scr2=" + body.accScratch2 + " two2=" + body.accTwo2);
    return body;
  }
  throw new Error("unknown hard " + hard);
};
