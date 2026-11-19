// v4.6 (COUNTERSIGNED 2026-11-19): ear as instrument. T1 ablation / T2 steering / T3 calibration.
// Base: filed v44 quartile bundles. No new tutor training except T2 (retrain for ranking).
globalThis.runCurrV46T1 = async function (fs, log, onlyPair) {
  const C = await globalThis.CurrV42Init(fs);
  const G = C.G;
  function sft(lg) {
    let m = -1e30; for (let i = 0; i < lg.length; i++) if (lg[i] > m) m = lg[i];
    let s = 0; const o = new Array(lg.length);
    for (let i = 0; i < lg.length; i++) { o[i] = Math.exp(lg[i] - m); s += o[i]; }
    for (let i = 0; i < o.length; i++) o[i] /= s;
    return o;
  }
  async function trainMouthOnlyOnBundle(mouth, bundle, steps, seed, alpha) {
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
  async function trainReplayMouthOnly(mouth, b1, b2, steps, seed, alpha) {
    alpha = (alpha == null ? 0.5 : alpha);
    const rng = G.makeRng(seed);
    const opt = new G.Adam(5e-3);
    const trunk = C.trunkParams(mouth);
    const params = trunk.concat([mouth.Lout.W, mouth.Lout.b]);
    const B = 8, Z19 = new Float64Array(19);
    for (let step = 1; step <= steps; step++) {
      mouth.zeroGrad();
      for (let b = 0; b < B; b++) {
        const use1 = rng.uniform(0, 1) < 0.5;
        const bun = use1 ? b1 : b2;
        const idx = rng.int(bun.lines.length);
        const x = bun.lines[idx], L = x.length;
        const tLog = bun.tLogits[idx];
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
  function shuffledBun(bun, seed) {
    const rng = G.makeRng(seed);
    const tEar = bun.tEar.map((arr) => {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) { const j = rng.int(i + 1); const t = a[i]; a[i] = a[j]; a[j] = t; }
      return a;
    });
    return { lines: bun.lines, tLogits: bun.tLogits, tEar, tEnt: bun.tEnt };
  }
  const pairs = (onlyPair == null ? [0, 1, 2] : [onlyPair]);
  const out = {};
  for (const pair of pairs) {
    const ledgerPath = "src/evidence/p3/p3-curr-v46-t1-p" + pair + ".json";
    try {
      const prev = JSON.parse(await fs.readTextFile(ledgerPath));
      if (prev && prev.verdict === "COMPLETE") { log("v46t1 pair " + pair + " exists, skip"); out[pair] = prev; continue; }
    } catch (e) {}
    log("v46t1 pair " + pair + " start");
    const easy = C.structuredPool(9770, 600), easyTest = easy.slice(500);
    const hard = C.hardLag2Pool(9810, 600), hardTest = hard.slice(500);
    const nb1 = JSON.parse(await fs.readTextFile("src/evidence/p3/p3-curr-v44-bundle-" + pair + "-c1.json"));
    const nb2 = JSON.parse(await fs.readTextFile("src/evidence/p3/p3-curr-v44-bundle-" + pair + "-c2.json"));
    // WITH (rerun for clean code-version comparability)
    const wM = C.makeMouth(9850 + pair), wE = C.makeEarOnTrunk(wM, 9950 + pair);
    const S0w = C.mouthLoss(wM, easyTest);
    await C.trainStudentOnBundle(wM, wE, nb1, 200, 9903 + pair, 0.5);
    const S1w = C.mouthLoss(wM, easyTest);
    // replay WITH (shared helper inlined via trainStudentOnBundle pattern: use v44 replay)
    const rngR = G.makeRng(9914 + pair);
    const optR = new G.Adam(5e-3);
    const trunkW = C.trunkParams(wM);
    const allW = trunkW.concat([wM.Lout.W, wM.Lout.b, wE.Lout.W, wE.Lout.b]);
    const B = 8, Z19 = new Float64Array(19);
    for (let step = 1; step <= 200; step++) {
      wM.zeroGrad(); wE.Lout.W.g.fill(0); wE.Lout.b.g.fill(0);
      for (let b = 0; b < B; b++) {
        const use1 = rngR.uniform(0, 1) < 0.5;
        const bun = use1 ? nb1 : nb2;
        const idx = rngR.int(bun.lines.length);
        const x = bun.lines[idx], L = x.length;
        const tLog = bun.tLogits[idx], tEar = bun.tEar[idx];
        const fwM = wM.forward(x, 1);
        const auxList = new Array(L);
        for (let t = 0; t < L; t++) {
          if (t >= L - 1) { auxList[t] = null; continue; }
          const ce = G.softmaxCE(fwM.cache.posOut[t].logits, x[t + 1]);
          const dt = ce.dlogits;
          const psm = sft(Array.from(fwM.cache.posOut[t].logits));
          const pt = sft(tLog[t]);
          for (let i = 0; i < dt.length; i++) dt[i] = ((1 - 0.5) * dt[i] + 0.5 * (psm[i] - pt[i])) / (B * (L - 1));
          auxList[t] = dt;
        }
        wM.backward(Z19, fwM, auxList, null, null);
        const fwE = wE.forward(x, 1);
        const auxE = new Array(L);
        for (let t = 0; t < L; t++) {
          if (t >= L - 1) { auxE[t] = null; continue; }
          const ps4 = sft(Array.from(fwE.cache.posOut[t].logits));
          const pt4 = sft(tEar[t]);
          const dd = new Float64Array(4);
          for (let i = 0; i < 4; i++) dd[i] = 0.2 * (ps4[i] - pt4[i]) / (B * (L - 1));
          auxE[t] = dd;
        }
        wE.backward(new Float64Array(4), fwE, auxE, null, null);
      }
      for (const p of trunkW) { const g = p.g; for (let i = 0; i < g.length; i++) g[i] *= 0.5; }
      optR.step(allW);
      if (step % 50 === 0 || step === 200) await new Promise((r) => setTimeout(r, 0));
    }
    const S2w = C.mouthLoss(wM, hardTest);
    // WITHOUT (mouth only)
    const oM = C.makeMouth(9850 + pair);
    const S0o = C.mouthLoss(oM, easyTest);
    await trainMouthOnlyOnBundle(oM, nb1, 200, 9903 + pair, 0.5);
    const S1o = C.mouthLoss(oM, easyTest);
    await trainReplayMouthOnly(oM, nb1, nb2, 200, 9914 + pair, 0.5);
    const S2o = C.mouthLoss(oM, hardTest);
    // shuffled-WITH (mouth measured)
    const sh1 = shuffledBun(nb1, 9921 + pair), sh2 = shuffledBun(nb2, 9922 + pair);
    const sM = C.makeMouth(9850 + pair), sE = C.makeEarOnTrunk(sM, 9950 + pair);
    await C.trainStudentOnBundle(sM, sE, sh1, 200, 9903 + pair, 0.5);
    const rngS = G.makeRng(9914 + pair);
    const optS = new G.Adam(5e-3);
    const trunkS = C.trunkParams(sM);
    const allS = trunkS.concat([sM.Lout.W, sM.Lout.b, sE.Lout.W, sE.Lout.b]);
    for (let step = 1; step <= 200; step++) {
      sM.zeroGrad(); sE.Lout.W.g.fill(0); sE.Lout.b.g.fill(0);
      for (let b = 0; b < B; b++) {
        const use1 = rngS.uniform(0, 1) < 0.5;
        const bun = use1 ? sh1 : sh2;
        const idx = rngS.int(bun.lines.length);
        const x = bun.lines[idx], L = x.length;
        const tLog = bun.tLogits[idx], tEar = bun.tEar[idx];
        const fwM = sM.forward(x, 1);
        const auxList = new Array(L);
        for (let t = 0; t < L; t++) {
          if (t >= L - 1) { auxList[t] = null; continue; }
          const ce = G.softmaxCE(fwM.cache.posOut[t].logits, x[t + 1]);
          const dt = ce.dlogits;
          const psm = sft(Array.from(fwM.cache.posOut[t].logits));
          const pt = sft(tLog[t]);
          for (let i = 0; i < dt.length; i++) dt[i] = (0.5 * dt[i] + 0.5 * (psm[i] - pt[i])) / (B * (L - 1));
          auxList[t] = dt;
        }
        sM.backward(Z19, fwM, auxList, null, null);
        const fwE = sE.forward(x, 1);
        const auxE = new Array(L);
        for (let t = 0; t < L; t++) {
          if (t >= L - 1) { auxE[t] = null; continue; }
          const ps4 = sft(Array.from(fwE.cache.posOut[t].logits));
          const pt4 = sft(tEar[t]);
          const dd = new Float64Array(4);
          for (let i = 0; i < 4; i++) dd[i] = 0.2 * (ps4[i] - pt4[i]) / (B * (L - 1));
          auxE[t] = dd;
        }
        sE.backward(new Float64Array(4), fwE, auxE, null, null);
      }
      for (const p of trunkS) { const g = p.g; for (let i = 0; i < g.length; i++) g[i] *= 0.5; }
      optS.step(allS);
      if (step % 50 === 0 || step === 200) await new Promise((r) => setTimeout(r, 0));
    }
    const S2s = C.mouthLoss(sM, hardTest);
    const gain = +(S2o - S2w).toFixed(4);
    const confound = +Math.abs(S2s - S2o).toFixed(4);
    const bar = (gain >= 0.10 && confound <= 0.05) ? "PASS" : "FAIL";
    const ledger = {
      pair, spec: "v4.6-T1", verdict: "COMPLETE",
      with: { S0: S0w, S1e: S1w, S2h: S2w },
      without: { S0: S0o, S1e: S1o, S2h: S2o },
      shuffledWith: { S2h: S2s },
      gain, confound, bar,
      note: "WITH rerun (not filed-v44 reuse) for code-version comparability; WITHOUT trunk scale 1.0 mouth-only (CHOICE filed here)"
    };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ledger));
    log("v46t1 pair " + pair + " done WITH=" + S2w + " WITHOUT=" + S2o + " SHUF=" + S2s + " gain=" + gain + " " + bar);
    out[pair] = ledger;
  }
  return out;
};
