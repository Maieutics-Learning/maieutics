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

// v4.3 combined + full-retrain nulls (COUNTERSIGNED 2026-11-19). Reuses filed v4.2 bundles; no tutor compute.
globalThis.runCurrV43 = async function (fs, log, onlyPair) {
  const C = await globalThis.CurrV42Init(fs);
  const E = await C.loadD1a();
  const N = C.makeNThermo();
  const G = C.G;
  function sft(lg) {
    let m = -1e30; for (let i = 0; i < lg.length; i++) if (lg[i] > m) m = lg[i];
    let s = 0; const o = new Array(lg.length);
    for (let i = 0; i < lg.length; i++) { o[i] = Math.exp(lg[i] - m); s += o[i]; }
    for (let i = 0; i < o.length; i++) o[i] /= s;
    return o;
  }
  function earVsFiledK(sEar, bundle) {
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
    return { obs: +(a / n).toFixed(4), k: a, n };
  }
  async function trainReplay43(mouth, ear, b1, b2, steps, seed, alpha) {
    alpha = (alpha == null ? 0.5 : alpha);
    const lamEar = 0.2;
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
          const psm = sft(Array.from(fwM.cache.posOut[t].logits));
          const pt = sft(tLog[t]);
          for (let i = 0; i < dt.length; i++) dt[i] = ((1 - alpha) * dt[i] + alpha * (psm[i] - pt[i])) / (B * (L - 1));
          auxList[t] = dt;
        }
        mouth.backward(Z19, fwM, auxList, null, null);
        const fwE = ear.forward(x, 1);
        const auxE = new Array(L);
        for (let t = 0; t < L; t++) {
          if (t >= L - 1) { auxE[t] = null; continue; }
          const ps4 = sft(Array.from(fwE.cache.posOut[t].logits));
          const pt4 = sft(tEar[t]);
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
  async function trainMouthOnly(mouth, lines, steps, seed) {
    const rng = G.makeRng(seed);
    const opt = new G.Adam(5e-3);
    const B = 8;
    for (let step = 1; step <= steps; step++) {
      mouth.zeroGrad();
      for (let b = 0; b < B; b++) {
        const x = lines[rng.int(lines.length)], L = x.length;
        const fw = mouth.forward(x, 1);
        const auxList = new Array(L);
        for (let t = 0; t < L; t++) {
          if (t >= L - 1) { auxList[t] = null; continue; }
          const ce = G.softmaxCE(fw.cache.posOut[t].logits, x[t + 1]);
          const dt = ce.dlogits;
          for (let i = 0; i < dt.length; i++) dt[i] /= (B * (L - 1));
          auxList[t] = dt;
        }
        mouth.backward(new Float64Array(19), fw, auxList, null, null);
      }
      opt.step(mouth.params());
      if (step % 50 === 0 || step === steps) await new Promise((r) => setTimeout(r, 0));
    }
    return { stepsDone: steps };
  }
  function shuffledBundle(bun, seed) {
    // Within-line position shuffle of ear targets (lengths intact: tEar[li] keeps
    // lines[li].length - 1 entries). Destroys position-aligned signal, keeps marginals.
    const rng = G.makeRng(seed);
    const tEar = bun.tEar.map((arr) => {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) { const j = rng.int(i + 1); const t = a[i]; a[i] = a[j]; a[j] = t; }
      return a;
    });
    return { lines: bun.lines, tLogits: bun.tLogits, tEar, tEnt: bun.tEnt };
  }
  function noiseLines(lens, seed) {
    const rng = G.makeRng(seed);
    return lens.map((L) => { const x = new Array(L); for (let i = 0; i < L; i++) x[i] = rng.int(19); return x; });
  }
  function dialect(tutorLines, studLines, blindLines) {
    const tN = C.gradeWithPile(N, tutorLines).pred, sN = C.gradeWithPile(N, studLines).pred, bN = C.gradeWithPile(N, blindLines).pred;
    const tE = C.gradeWithPile(E, tutorLines).pred, sE = C.gradeWithPile(E, studLines).pred, bE = C.gradeWithPile(E, blindLines).pred;
    const tsN = C.pairStats(tN, sN).obs, tbN = C.pairStats(tN, bN).obs;
    const tsE = C.pairStats(tE, sE).obs, tbE = C.pairStats(tE, bE).obs;
    return {
      dN: { agreeTS: tsN, agreeTB: tbN, gap: +(tsN - tbN).toFixed(2) },
      dE: { agreeTS: tsE, agreeTB: tbE, gap: +(tsE - tbE).toFixed(2) }
    };
  }
  const pairs = (onlyPair == null ? [0, 1, 2] : [onlyPair]);
  const out = {};
  for (const pair of pairs) {
    const ledgerPath = "src/evidence/p3/p3-curr-v43-p" + pair + ".json";
    try {
      const prev = JSON.parse(await fs.readTextFile(ledgerPath));
      if (prev && prev.verdict === "COMPLETE") { log("v43 pair " + pair + " exists, skip"); out[pair] = prev; continue; }
    } catch (e) {}
    log("v43 pair " + pair + " start");
    const easy = C.structuredPool(9770, 600), easyTest = easy.slice(500);
    const hard = C.hardLag2Pool(9810, 600), hardTest = hard.slice(500);
    const b1 = JSON.parse(await fs.readTextFile("src/evidence/p3/p3-curr-v42-bundle-" + pair + "-c1.json"));
    const b2 = JSON.parse(await fs.readTextFile("src/evidence/p3/p3-curr-v42-bundle-" + pair + "-c2.json"));
    const blindRef = C.makeMouth(9860 + pair);
    const blindLines = C.genLines(blindRef, 9889 + pair, 100);
    // COMBINED: S1 200 on c1, S2 replay-200 mix
    const student = C.makeMouth(9850 + pair);
    const sEar = C.makeEarOnTrunk(student, 9950 + pair);
    const S0e = C.mouthLoss(student, easyTest);
    await C.trainStudentOnBundle(student, sEar, b1, 200, 9903 + pair, 0.5);
    const S1e = C.mouthLoss(student, easyTest), S1h = C.mouthLoss(student, hardTest);
    const S1lines = C.genLines(student, 9881 + pair, 100);
    const e1 = earVsFiledK(sEar, b1);
    await trainReplay43(student, sEar, b1, b2, 200, 9914 + pair, 0.5);
    const S2e = C.mouthLoss(student, easyTest), S2h = C.mouthLoss(student, hardTest);
    const S2lines = C.genLines(student, 9882 + pair, 100);
    const e2 = earVsFiledK(sEar, b2), e2c1 = earVsFiledK(sEar, b1);
    const claim1 = (S1e < 2.944 && S1e <= S0e - 0.20) ? "PASS" : "FAIL";
    const claim2 = (S2h < 2.944 && S2h <= S1h - 0.20) ? "PASS" : "FAIL";
    const d = dialect(b1.lines, S1lines, blindLines), d2 = dialect(b2.lines, S2lines, blindLines);
    // NULL (a) shuffled-ear: same recipe, permuted ear targets
    const sh1 = shuffledBundle(b1, 9921 + pair), sh2 = shuffledBundle(b2, 9922 + pair);
    const stA = C.makeMouth(9850 + pair);
    const seA = C.makeEarOnTrunk(stA, 9950 + pair);
    await C.trainStudentOnBundle(stA, seA, sh1, 200, 9903 + pair, 0.5);
    const A1e = C.mouthLoss(stA, easyTest);
    await trainReplay43(stA, seA, sh1, sh2, 200, 9914 + pair, 0.5);
    const A2h = C.mouthLoss(stA, hardTest);
    const earAreal = earVsFiledK(seA, b1);
    const earAshuf = earVsFiledK(seA, sh1);
    // NULL (b) blind-tutor: blind generates its own bundle; student trains on blind only
    const blindM = C.makeMouth(9860 + pair);
    const blindE = C.makeEarOnTrunk(blindM, 9960 + pair);
    const bb1 = C.genBundle(blindM, blindE, 9891 + pair, 100);
    const bb2 = C.genBundle(blindM, blindE, 9892 + pair, 100);
    const uB1 = C.uniqCount(bb1.lines), uB2 = C.uniqCount(bb2.lines);
    let blindRes = null;
    if (uB1 === 100 && uB2 === 100) {
      const stB = C.makeMouth(9850 + pair);
      const seB = C.makeEarOnTrunk(stB, 9950 + pair);
      const S0Be = C.mouthLoss(stB, easyTest);
      await C.trainStudentOnBundle(stB, seB, { lines: bb1.lines, tLogits: bb1.tLogits, tEar: bb1.tEar, tEnt: bb1.tEnt }, 200, 9903 + pair, 0.5);
      const B1e = C.mouthLoss(stB, easyTest), B1h = C.mouthLoss(stB, hardTest);
      await trainReplay43(stB, seB, { lines: bb1.lines, tLogits: bb1.tLogits, tEar: bb1.tEar, tEnt: bb1.tEnt }, { lines: bb2.lines, tLogits: bb2.tLogits, tEar: bb2.tEar, tEnt: bb2.tEnt }, 200, 9914 + pair, 0.5);
      const B2h = C.mouthLoss(stB, hardTest);
      blindRes = { uniq: [uB1, uB2], S0e: S0Be, S1e: B1e, S1h: B1h, S2h: B2h,
        claim1: (B1e < 2.944 && B1e <= S0Be - 0.20) ? "PASS" : "FAIL",
        claim2: (B2h < 2.944 && B2h <= B1h - 0.20) ? "PASS" : "FAIL" };
    } else blindRes = { uniq: [uB1, uB2], verdict: "ABORT" };
    // NULL (c) synthetic recipe-null: noise lines, mouth hard-CE only, ear untrained
    const syn1 = noiseLines(b1.lines.map((l) => l.length), 9895 + pair);
    const stC = C.makeMouth(9850 + pair);
    const seC = C.makeEarOnTrunk(stC, 9950 + pair);
    const S0Ce = C.mouthLoss(stC, easyTest);
    await trainMouthOnly(stC, syn1, 200, 9906 + pair);
    const C1e = C.mouthLoss(stC, easyTest);
    const earC = earVsFiledK(seC, b1);
    const ledger = {
      pair, spec: "v4.3", verdict: "COMPLETE",
      S0e, combined: {
        S1: { easy: S1e, hard: S1h, claim1, ear: e1.obs, wilson: C.wilsonCI(e1.k, e1.n) },
        S2: { easy: S2e, hard: S2h, claim2, retention: +((S2e - S1e).toFixed(4)), ear: e2.obs, earC1: e2c1.obs, wilson: C.wilsonCI(e2.k, e2.n) },
        dialect1: d, dialect2: d2
      },
      nulls: {
        shuffled: { S1e: A1e, S2h: A2h, earReal: earAreal.obs, earShuf: earAshuf.obs, teeth: (earAreal.obs < 0.80 && (e1.obs - earAreal.obs) >= 0.10) ? "HELD" : "BROKEN" },
        blind: blindRes,
        synthetic: { S0e: S0Ce, S1e: C1e, ear: earC.obs, vacuous: (C1e < 2.944 && C1e <= S0Ce - 0.20) ? "VACUOUS" : "CLEAN" }
      }
    };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ledger));
    log("v43 pair " + pair + " done C-S1=" + S1e + " C-S2=" + S2h);
    out[pair] = ledger;
  }
  return out;
};
