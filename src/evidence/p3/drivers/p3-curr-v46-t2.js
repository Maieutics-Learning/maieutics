// v4.6-T2 steering: GUIDED (top-100 high-entropy candidates) vs RANDOM, mouth-only S2 both
// branches (CHOICE filed: isolates selection from marks; marks tested in T1). Tutor mouth
// retrained per pair (1600 steps); S1 WITH on v44 nb1; S1 retrained deterministically for 2nd branch.
globalThis.runCurrV46T2 = async function (fs, log, onlyPair) {
  const C = await globalThis.CurrV42Init(fs);
  const G = C.G;
  function sft(lg) {
    let m = -1e30; for (let i = 0; i < lg.length; i++) if (lg[i] > m) m = lg[i];
    let s = 0; const o = new Array(lg.length);
    for (let i = 0; i < lg.length; i++) { o[i] = Math.exp(lg[i] - m); s += o[i]; }
    for (let i = 0; i < o.length; i++) o[i] /= s;
    return o;
  }
  function entOf(p) { let e = 0; for (let i = 0; i < p.length; i++) if (p[i] > 0) e -= p[i] * Math.log(p[i]); return e; }
  async function trainMouthOnly(mouth, bundle, steps, seed, alpha) {
    alpha = (alpha == null ? 0.5 : alpha);
    const rng = G.makeRng(seed);
    const opt = new G.Adam(5e-3);
    const trunk = C.trunkParams(mouth);
    const params = trunk.concat([mouth.Lout.W, mouth.Lout.b]);
    const B = 8, Z19 = new Float64Array(19);
    for (let step = 1; step <= steps; step++) {
      mouth.zeroGrad();
      for (let b = 0; b < B; b++) {
        const idx = rng.int(bundle.lines.length);
        const x = bundle.lines[idx], L = x.length;
        const tLog = bundle.tLogits[idx];
        const fwM = mouth.forward(x, 1);
        const auxList = new Array(L);
        for (let t = 0; t < L; t++) {
          if (t >= L - 1) { auxList[t] = null; continue; }
          const ce = G.softmaxCE(fwM.cache.posOut[t].logits, x[t + 1]);
          const dt = ce.dlogits;
          const psm = sft(Array.from(fwM.cache.posOut[t].logits));
          const pt = sft(tLog[t]);
          for (let i = 0; i < dt.length; i++) dt[i] = ((1 - alpha) * dt[i] + alpha * (psm[i] - pt[i])) / (B * (L - 1));
          auxList[t] = dt;
        }
        mouth.backward(Z19, fwM, auxList, null, null);
      }
      opt.step(params);
      if (step % 50 === 0 || step === steps) await new Promise((r) => setTimeout(r, 0));
    }
    return { stepsDone: steps };
  }
  const pairs = (onlyPair == null ? [0, 1, 2] : [onlyPair]);
  const out = {};
  for (const pair of pairs) {
    const ledgerPath = "src/evidence/p3/p3-curr-v46-t2-p" + pair + ".json";
    try {
      const prev = JSON.parse(await fs.readTextFile(ledgerPath));
      if (prev && prev.verdict === "COMPLETE") { log("v46t2 pair " + pair + " exists, skip"); out[pair] = prev; continue; }
    } catch (e) {}
    log("v46t2 pair " + pair + " start");
    const easy = C.structuredPool(9770, 600), easyTrain = easy.slice(0, 500), easyTest = easy.slice(500);
    const hard = C.hardLag2Pool(9810, 600), hardTrain = hard.slice(0, 500), hardTest = hard.slice(500);
    const nb1 = JSON.parse(await fs.readTextFile("src/evidence/p3/p3-curr-v44-bundle-" + pair + "-c1.json"));
    const tutor = C.makeMouth(9840 + pair);
    await C.trainMouth(tutor, easyTrain, 800, 9901 + pair);
    await C.trainMouth(tutor, hardTrain, 800, 9902 + pair);
    const TEe = C.mouthLoss(tutor, easyTest), THh = C.mouthLoss(tutor, hardTest);
    // S1 WITH on nb1 (standard, for baseline)
    const sBase = C.makeMouth(9850 + pair), sBaseE = C.makeEarOnTrunk(sBase, 9950 + pair);
    await C.trainStudentOnBundle(sBase, sBaseE, nb1, 200, 9903 + pair, 0.5);
    const S1e = C.mouthLoss(sBase, easyTest), S1h = C.mouthLoss(sBase, hardTest);
    // 200 candidates tutor-written
    const cands = C.genLines(tutor, 9931 + pair, 200);
    const scored = cands.map((x) => {
      const fw = tutor.forward(x, 1);
      let s = 0;
      for (let t = 0; t < x.length - 1; t++) s += entOf(sft(Array.from(fw.cache.posOut[t].logits))) / (x.length - 1);
      return { x, s };
    });
    scored.sort((a, b) => b.s - a.s);
    const gLines = scored.slice(0, 100).map((o) => o.x);
    const rngR = G.makeRng(9932 + pair);
    const rLines = [];
    const used = new Set();
    while (rLines.length < 100) { const i = rngR.int(cands.length); if (!used.has(i)) { used.add(i); rLines.push(cands[i]); } }
    function toBundle(lines) {
      const tLogits = [];
      for (const x of lines) {
        const fw = tutor.forward(x, 1);
        const lm = [];
        for (let t = 0; t < x.length - 1; t++) lm.push(Array.from(fw.cache.posOut[t].logits));
        tLogits.push(lm);
      }
      return { lines, tLogits };
    }
    const gBun = toBundle(gLines), rBun = toBundle(rLines);
    // Branch A: S1 retrain then GUIDED mouth-only S2
    const mA = C.makeMouth(9850 + pair);
    await trainMouthOnly(mA, nb1, 200, 9903 + pair, 0.5);
    await trainMouthOnly(mA, gBun, 200, 9914 + pair, 0.5);
    const S2g = C.mouthLoss(mA, hardTest);
    // Branch B: S1 retrain then RANDOM mouth-only S2
    const mB = C.makeMouth(9850 + pair);
    await trainMouthOnly(mB, nb1, 200, 9903 + pair, 0.5);
    await trainMouthOnly(mB, rBun, 200, 9914 + pair, 0.5);
    const S2r = C.mouthLoss(mB, hardTest);
    const lift = +(S2r - S2g).toFixed(4);
    const bar = (lift >= 0.10) ? "PASS" : "FAIL";
    const ledger = {
      pair, spec: "v4.6-T2", verdict: "COMPLETE",
      tutor: { TEe, THh },
      S1: { easy: S1e, hard: S1h },
      guided: { S2h: S2g, meanEnt: +scored.slice(0, 100).reduce((a, o) => a + o.s, 0).toFixed(4) / 100 },
      random: { S2h: S2r },
      lift, bar,
      note: "S2 mouth-only both branches (CHOICE: isolates selection from marks); S1 WITH baseline filed; S1 retrained deterministically per branch"
    };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ledger));
    log("v46t2 pair " + pair + " done GUIDED=" + S2g + " RANDOM=" + S2r + " lift=" + lift + " " + bar);
    out[pair] = ledger;
  }
  return out;
};
