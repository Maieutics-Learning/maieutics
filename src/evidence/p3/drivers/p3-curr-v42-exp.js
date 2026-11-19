// v4.2 agent experiments (approved 2026-11-19 under user pre-countersign).
// ExpA: student steps 800->200, same filed bundles + inits.
// ExpB: S1 frozen-style 800, S2 on 50/50 replay mix (c1+c2 lines, softs travel with lines).
globalThis.runCurrV42Exp = async function (fs, log, which) {
  const C = await globalThis.CurrV42Init(fs);
  const E = await C.loadD1a();
  const N = C.makeNThermo();
  // Ear vs FILED tutor marks (bundle-only): student ear argmax vs filed tutor-ear logits argmax,
  // per position over bundle lines. No tutor models needed; same 0-1 scale as frozen shared200 obs
  // (different line set — noted openly, trends read within-experiment).
  function earVsFiled(sEar, bundle) {
    let a = 0, n = 0;
    for (let li = 0; li < bundle.lines.length; li++) {
      const x = bundle.lines[li], L = x.length;
      const fwE = sEar.forward(x, 1);
      for (let t = 0; t < L - 1; t++) {
        const lg = Array.from(fwE.cache.posOut[t].logits);
        let bi = 0; for (let i = 1; i < 4; i++) if (lg[i] > lg[bi]) bi = i;
        const tl = bundle.tEar[li][t];
        let ti = 0; for (let i = 1; i < 4; i++) if (tl[i] > tl[ti]) ti = i;
        if (bi === ti) a++; n++;
      }
    }
    return +(a / n).toFixed(4);
  }
  async function trainReplay(mouth, ear, b1, b2, steps, seed, alpha) {
    alpha = (alpha == null ? 0.5 : alpha);
    const lamEar = 0.2;
    const G = C.G;
    const rng = G.makeRng(seed);
    const opt = new G.Adam(5e-3);
    const trunk = C.trunkParams(mouth);
    const allParams = trunk.concat([mouth.Lout.W, mouth.Lout.b, ear.Lout.W, ear.Lout.b]);
    const B = 8, Z19 = new Float64Array(19);
    for (let step = 1; step <= steps; step++) {
      mouth.zeroGrad();
      ear.Lout.W.g.fill(0); ear.Lout.b.g.fill(0);
      for (let b = 0; b < B; b++) {
        const use1 = rng.uniform(0, 1) < 0.5;
        const bun = use1 ? b1 : b2;
        const idx = rng.int(bun.lines.length);
        const x = bun.lines[idx], L = x.length;
        const tLog = bun.tLogits[idx], tEar = bun.tEar[idx];
        const fwM = mouth.forward(x, 1);
        const auxList = new Array(L);
        for (let t = 0; t < L; t++) {
          if (t >= L - 1) { auxList[t] = null; continue; }
          const ce = G.softmaxCE(fwM.cache.posOut[t].logits, x[t + 1]);
          const dt = ce.dlogits;
          const psm = (function (lg) {
            let m = -1e30; for (let i = 0; i < lg.length; i++) if (lg[i] > m) m = lg[i];
            let s = 0; const o = new Array(lg.length);
            for (let i = 0; i < lg.length; i++) { o[i] = Math.exp(lg[i] - m); s += o[i]; }
            for (let i = 0; i < o.length; i++) o[i] /= s;
            return o;
          })(Array.from(fwM.cache.posOut[t].logits));
          const pt = (function (lg) {
            let m = -1e30; for (let i = 0; i < lg.length; i++) if (lg[i] > m) m = lg[i];
            let s = 0; const o = new Array(lg.length);
            for (let i = 0; i < lg.length; i++) { o[i] = Math.exp(lg[i] - m); s += o[i]; }
            for (let i = 0; i < o.length; i++) o[i] /= s;
            return o;
          })(tLog[t]);
          for (let i = 0; i < dt.length; i++) dt[i] = ((1 - alpha) * dt[i] + alpha * (psm[i] - pt[i])) / (B * (L - 1));
          auxList[t] = dt;
        }
        mouth.backward(Z19, fwM, auxList, null, null);
        const fwE = ear.forward(x, 1);
        const auxE = new Array(L);
        for (let t = 0; t < L; t++) {
          if (t >= L - 1) { auxE[t] = null; continue; }
          const ps4 = (function (lg) {
            let m = -1e30; for (let i = 0; i < lg.length; i++) if (lg[i] > m) m = lg[i];
            let s = 0; const o = new Array(4);
            for (let i = 0; i < 4; i++) { o[i] = Math.exp(lg[i] - m); s += o[i]; }
            for (let i = 0; i < 4; i++) o[i] /= s;
            return o;
          })(Array.from(fwE.cache.posOut[t].logits));
          const pt4 = (function (lg) {
            let m = -1e30; for (let i = 0; i < lg.length; i++) if (lg[i] > m) m = lg[i];
            let s = 0; const o = new Array(4);
            for (let i = 0; i < 4; i++) { o[i] = Math.exp(lg[i] - m); s += o[i]; }
            for (let i = 0; i < 4; i++) o[i] /= s;
            return o;
          })(tEar[t]);
          const dd = new Float64Array(4);
          for (let i = 0; i < 4; i++) dd[i] = lamEar * (ps4[i] - pt4[i]) / (B * (L - 1));
          auxE[t] = dd;
        }
        ear.backward(new Float64Array(4), fwE, auxE, null, null);
      }
      for (const p of trunk) { const g = p.g; for (let i = 0; i < g.length; i++) g[i] *= 0.5; }
      opt.step(allParams);
      if (step % 50 === 0 || step === steps) await new Promise((r) => setTimeout(r, 0));
    }
    return { stepsDone: steps };
  }
  const out = {};
  for (let pair = 0; pair < 3; pair++) {
    const ledgerPath = which === "A"
      ? "src/evidence/p3/p3-curr-v42-expA-p" + pair + ".json"
      : "src/evidence/p3/p3-curr-v42-expB-p" + pair + ".json";
    try {
      const prev = JSON.parse(await fs.readTextFile(ledgerPath));
      if (prev && prev.verdict === "COMPLETE") { log(which + " pair " + pair + " exists, skip"); out[pair] = prev; continue; }
    } catch (e) {}
    log(which + " pair " + pair + " start");
    const easy = C.structuredPool(9770, 600), easyTrain = easy.slice(0, 500), easyTest = easy.slice(500);
    const hard = C.hardLag2Pool(9810, 600), hardTrain = hard.slice(0, 500), hardTest = hard.slice(500);
    void easyTrain; void hardTrain;
    const shared200 = C.structuredPool(9771, 200).map((o) => o.x);
    const frozen = JSON.parse(await fs.readTextFile("src/evidence/p3/p3-curr-v42-p" + pair + ".json"));
    const b1 = JSON.parse(await fs.readTextFile("src/evidence/p3/p3-curr-v42-bundle-" + pair + "-c1.json"));
    const b2 = JSON.parse(await fs.readTextFile("src/evidence/p3/p3-curr-v42-bundle-" + pair + "-c2.json"));
    // tutor ear reference for agreement: rebuild tutor mouth+ear? Chevron: use filed tutor behavior via
    // re-instantiated tutor trained identically is too costly; instead measure student ear vs ITSELF across
    // phases + report frozen tutor-ear obs from frozen ledger for comparison. Filed openly as approximation.
    const student = C.makeMouth(9850 + pair);
    const sEar = C.makeEarOnTrunk(student, 9950 + pair);
    const S0e = C.mouthLoss(student, easyTest);
    let S1e, S1h, S2e, S2h, e1c1, e2c2, e2c1;
    if (which === "A") {
      await C.trainStudentOnBundle(student, sEar, b1, 200, 9903 + pair, 0.5);
      S1e = C.mouthLoss(student, easyTest); S1h = C.mouthLoss(student, hardTest);
      e1c1 = earVsFiled(sEar, b1);
      await C.trainStudentOnBundle(student, sEar, b2, 200, 9904 + pair, 0.5);
      S2e = C.mouthLoss(student, easyTest); S2h = C.mouthLoss(student, hardTest);
      e2c2 = earVsFiled(sEar, b2); e2c1 = earVsFiled(sEar, b1);
    } else {
      await C.trainStudentOnBundle(student, sEar, b1, 800, 9903 + pair, 0.5);
      S1e = C.mouthLoss(student, easyTest); S1h = C.mouthLoss(student, hardTest);
      e1c1 = earVsFiled(sEar, b1);
      await trainReplay(student, sEar, b1, b2, 800, 9914 + pair, 0.5);
      S2e = C.mouthLoss(student, easyTest); S2h = C.mouthLoss(student, hardTest);
      e2c2 = earVsFiled(sEar, b2); e2c1 = earVsFiled(sEar, b1);
    }
    const ledger = {
      pair, exp: which, verdict: "COMPLETE",
      frozen: { S1easy: frozen.S1.easy, S1hard: frozen.S1.hard, S2easy: frozen.S2.easy, S2hard: frozen.S2.hard, earS1: frozen.S1.earObs, earS2: frozen.S2.earObs },
      S0e, S1: { easy: S1e, hard: S1h }, S2: { easy: S2e, hard: S2h, retention: +((S2e - S1e).toFixed(4)) },
      earFiled: { s1_vs_c1: e1c1, s2_vs_c2: e2c2, s2_vs_c1: e2c1 },
      earNote: "agreement with FILED tutor-ear logits on bundle lines (bundle-only, no tutor models); frozen obs used live tutor on shared200 — same scale, different set, trends within-experiment"
    };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ledger));
    log(which + " pair " + pair + " done S1=" + S1e + " S2=" + S2h);
    out[pair] = ledger;
  }
  return out;
};
