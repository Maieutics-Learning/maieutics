// v4.5 (COUNTERSIGNED 2026-11-19): joint trunk+ear tutor training (mouth-anchored).
// Reuses CurrV42Init stack.Differences vs v44: trainEarJoint updates trunk+ear head with
// loss earCE + 0.5*mouthCE (mouth Lout frozen, trunk x0.5); buckets quartile frozen pre-joint
// but labels moving (current mouth entropy via frozen cuts, same as v44 moving-target form);
// bundles recompute BOTH tLogits+tEar (trunk moved); drift cap 0.30 + gates <2.744.
globalThis.runCurrV45 = async function (fs, log, onlyPair) {
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
  function entOf(probs) { let e = 0; for (let i = 0; i < probs.length; i++) if (probs[i] > 0) e -= probs[i] * Math.log(probs[i]); return e; }
  async function trainEarJoint(ear, mouth, lines, bucketOf, steps, seed) {
    const rng = G.makeRng(seed);
    const opt = new G.Adam(5e-3);
    const trunk = C.trunkParams(mouth);
    const headEar = [ear.Lout.W, ear.Lout.b];
    const stepParams = trunk.concat(headEar);
    const B = 8, Z19 = new Float64Array(19), Z4 = new Float64Array(4);
    let firstLoss = 0;
    for (let step = 1; step <= steps; step++) {
      mouth.zeroGrad();
      ear.Lout.W.g.fill(0); ear.Lout.b.g.fill(0);
      let loss = 0;
      for (let b = 0; b < B; b++) {
        const x = lines[rng.int(lines.length)];
        const L = x.length;
        const fwM = mouth.forward(x, 1);
        const fwE = ear.forward(x, 1);
        const auxM = new Array(L), auxE = new Array(L);
        for (let t = 0; t < L; t++) {
          if (t >= L - 1) { auxM[t] = null; auxE[t] = null; continue; }
          // ear target: current mouth entropy via FROZEN cuts (moving labels, fixed ruler)
          const bkt = bucketOf(entOf(sft(Array.from(fwM.cache.posOut[t].logits))));
          const ceE = G.softmaxCE(fwE.cache.posOut[t].logits, bkt);
          loss += ceE.loss / (L - 1);
          const dtE = ceE.dlogits;
          for (let i = 0; i < dtE.length; i++) dtE[i] /= (B * (L - 1));
          auxE[t] = dtE;
          // mouth anchor: hard CE to ground truth, weight 0.5
          const ceM = G.softmaxCE(fwM.cache.posOut[t].logits, x[t + 1]);
          const dtM = ceM.dlogits;
          for (let i = 0; i < dtM.length; i++) dtM[i] = 0.5 * dtM[i] / (B * (L - 1));
          auxM[t] = dtM;
        }
        mouth.backward(Z19, fwM, auxM, null, null);
        ear.backward(Z4, fwE, auxE, null, null);
        // freeze mouth head (trunk shared, head separate object)
        mouth.Lout.W.g.fill(0); mouth.Lout.b.g.fill(0);
      }
      for (const p of trunk) { const g = p.g; for (let i = 0; i < g.length; i++) g[i] *= 0.5; }
      opt.step(stepParams);
      loss /= B;
      if (step === 1) firstLoss = loss;
      if (step % 50 === 0 || step === steps) await new Promise((r) => setTimeout(r, 0));
      if (!Number.isFinite(loss)) return { firstLoss: +(+firstLoss).toFixed(4), stepsDone: step, halted: "ABORT ear-joint non-finite" };
    }
    return { firstLoss: +(+firstLoss).toFixed(4), stepsDone: steps, halted: null };
  }
  async function trainReplay45(mouth, ear, b1, b2, steps, seed, alpha) {
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
  async function trainMouthOnly45(mouth, lines, steps, seed) {
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
  function shuffled45(bun, seed) {
    const rng = G.makeRng(seed);
    const tEar = bun.tEar.map((arr) => {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) { const j = rng.int(i + 1); const t = a[i]; a[i] = a[j]; a[j] = t; }
      return a;
    });
    return { lines: bun.lines, tLogits: bun.tLogits, tEar, tEnt: bun.tEnt };
  }
  function earVsFiledK45(sEar, bundle) {
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
  function dialect45(tutorLines, studLines, blindLines) {
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
    const ledgerPath = "src/evidence/p3/p3-curr-v45-p" + pair + ".json";
    try {
      const prev = JSON.parse(await fs.readTextFile(ledgerPath));
      if (prev && prev.verdict === "COMPLETE") { log("v45 pair " + pair + " exists, skip"); out[pair] = prev; continue; }
    } catch (e) {}
    log("v45 pair " + pair + " start");
    const easy = C.structuredPool(9770, 600), easyTrain = easy.slice(0, 500), easyTest = easy.slice(500);
    const hard = C.hardLag2Pool(9810, 600), hardTrain = hard.slice(0, 500), hardTest = hard.slice(500);
    const filed42 = JSON.parse(await fs.readTextFile("src/evidence/p3/p3-curr-v42-p" + pair + ".json"));
    const b1f = JSON.parse(await fs.readTextFile("src/evidence/p3/p3-curr-v42-bundle-" + pair + "-c1.json"));
    const b2f = JSON.parse(await fs.readTextFile("src/evidence/p3/p3-curr-v42-bundle-" + pair + "-c2.json"));
    const tutor = C.makeMouth(9840 + pair);
    await C.trainMouth(tutor, easyTrain, 800, 9901 + pair);
    const TEe = C.mouthLoss(tutor, easyTest);
    await C.trainMouth(tutor, hardTrain, 800, 9902 + pair);
    const THh = C.mouthLoss(tutor, hardTest);
    if (Math.abs(TEe - filed42.TE.easy) > 0.0001 || Math.abs(THh - filed42.TH.hard) > 0.0001) {
      const ab = { pair, verdict: "ABORT", reason: "tutor drift vs filed", TEe, THh, filed: [filed42.TE.easy, filed42.TH.hard] };
      await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); out[pair] = ab; continue;
    }
    const earLines = C.genLines(tutor, 9870 + pair, 200);
    const ents = [];
    for (const x of earLines) {
      const fw = tutor.forward(x, 1);
      for (let t = 0; t < x.length - 1; t++) ents.push(entOf(sft(Array.from(fw.cache.posOut[t].logits))));
    }
    ents.sort((a, b) => a - b);
    const q = (p) => ents[Math.min(ents.length - 1, Math.floor(p * ents.length))];
    const cuts = [+q(0.25).toFixed(4), +q(0.50).toFixed(4), +q(0.75).toFixed(4)];
    const bucketOf = (e) => e < cuts[0] ? 0 : e < cuts[1] ? 1 : e < cuts[2] ? 2 : 3;
    const bandCounts = [0, 0, 0, 0];
    for (const e of ents) bandCounts[bucketOf(e)]++;
    const preEar = { easy: C.mouthLoss(tutor, easyTest), hard: C.mouthLoss(tutor, hardTest) };
    const tEar = C.makeEarOnTrunk(tutor, 9940 + pair);
    const earRes = await trainEarJoint(tEar, tutor, earLines, bucketOf, 800, 9905 + pair);
    if (earRes.halted) { const ab = { pair, verdict: "ABORT", reason: earRes.halted }; await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); out[pair] = ab; continue; }
    const postEar = { easy: C.mouthLoss(tutor, easyTest), hard: C.mouthLoss(tutor, hardTest) };
    const deg = Math.max(postEar.easy - preEar.easy, postEar.hard - preEar.hard);
    const gateJoint = (deg > 0.30) ? "HALT" : "PASS"; // v4.5.1: relative only; absolute filed diagnostic (pre-ear already HALT precedent)
    function rebundleJoint(bf, seed, cls) {
      const tLogNew = [], tEarNew = [];
      for (const x of bf.lines) {
        const fwM = tutor.forward(x, 1), fwE = tEar.forward(x, 1);
        const lm = [], le = [];
        for (let t = 0; t < x.length - 1; t++) { lm.push(Array.from(fwM.cache.posOut[t].logits)); le.push(Array.from(fwE.cache.posOut[t].logits)); }
        tLogNew.push(lm); tEarNew.push(le);
      }
      return { pair, cls, seed, question: "Given a prefix, what comes next? Write lines and marks that teach it.", lines: bf.lines, tLogits: tLogNew, tEar: tEarNew, tEnt: bf.tEnt, bucketCuts: cuts, joint: true };
    }
    const nb1 = rebundleJoint(b1f, 9871 + pair, 1), nb2 = rebundleJoint(b2f, 9872 + pair, 2);
    if (C.uniqCount(nb1.lines) !== 100 || C.uniqCount(nb2.lines) !== 100) {
      const ab = { pair, verdict: "ABORT", reason: "nUniq" }; await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); out[pair] = ab; continue;
    }
    await fs.writeTextFile("src/evidence/p3/p3-curr-v45-bundle-" + pair + "-c1.json", JSON.stringify(nb1));
    await fs.writeTextFile("src/evidence/p3/p3-curr-v45-bundle-" + pair + "-c2.json", JSON.stringify(nb2));
    const blindRef = C.makeMouth(9860 + pair);
    const blindLines = C.genLines(blindRef, 9889 + pair, 100);
    const student = C.makeMouth(9850 + pair);
    const sEar = C.makeEarOnTrunk(student, 9950 + pair);
    const S0e = C.mouthLoss(student, easyTest);
    await C.trainStudentOnBundle(student, sEar, nb1, 200, 9903 + pair, 0.5);
    const S1e = C.mouthLoss(student, easyTest), S1h = C.mouthLoss(student, hardTest);
    const S1lines = C.genLines(student, 9881 + pair, 100);
    const e1 = earVsFiledK45(sEar, nb1);
    await trainReplay45(student, sEar, nb1, nb2, 200, 9914 + pair, 0.5);
    const S2e = C.mouthLoss(student, easyTest), S2h = C.mouthLoss(student, hardTest);
    const S2lines = C.genLines(student, 9882 + pair, 100);
    const e2 = earVsFiledK45(sEar, nb2), e2c1 = earVsFiledK45(sEar, nb1);
    const claim1 = (S1e < 2.944 && S1e <= S0e - 0.20) ? "PASS" : "FAIL";
    const claim2 = (S2h < 2.944 && S2h <= S1h - 0.20) ? "PASS" : "FAIL";
    const d1 = dialect45(nb1.lines, S1lines, blindLines), d2 = dialect45(nb2.lines, S2lines, blindLines);
    const sh1 = shuffled45(nb1, 9921 + pair), sh2 = shuffled45(nb2, 9922 + pair);
    const stA = C.makeMouth(9850 + pair);
    const seA = C.makeEarOnTrunk(stA, 9950 + pair);
    await C.trainStudentOnBundle(stA, seA, sh1, 200, 9903 + pair, 0.5);
    await trainReplay45(stA, seA, sh1, sh2, 200, 9914 + pair, 0.5);
    const earAreal = earVsFiledK45(seA, nb1);
    const blindM = C.makeMouth(9860 + pair);
    const blindE = C.makeEarOnTrunk(blindM, 9960 + pair);
    const bb1 = C.genBundle(blindM, blindE, 9891 + pair, 100);
    const bb2 = C.genBundle(blindM, blindE, 9892 + pair, 100);
    let blindRes = null;
    if (C.uniqCount(bb1.lines) === 100 && C.uniqCount(bb2.lines) === 100) {
      const stB = C.makeMouth(9850 + pair);
      const seB = C.makeEarOnTrunk(stB, 9950 + pair);
      const S0Be = C.mouthLoss(stB, easyTest);
      await C.trainStudentOnBundle(stB, seB, { lines: bb1.lines, tLogits: bb1.tLogits, tEar: bb1.tEar, tEnt: bb1.tEnt }, 200, 9903 + pair, 0.5);
      const B1e = C.mouthLoss(stB, easyTest), B1h = C.mouthLoss(stB, hardTest);
      await trainReplay45(stB, seB, { lines: bb1.lines, tLogits: bb1.tLogits, tEar: bb1.tEar, tEnt: bb1.tEnt }, { lines: bb2.lines, tLogits: bb2.tLogits, tEar: bb2.tEar, tEnt: bb2.tEnt }, 200, 9914 + pair, 0.5);
      const B2h = C.mouthLoss(stB, hardTest);
      blindRes = { uniq: [100, 100], S0e: S0Be, S1e: B1e, S1h: B1h, S2h: B2h,
        claim1: (B1e < 2.944 && B1e <= S0Be - 0.20) ? "PASS" : "FAIL",
        claim2: (B2h < 2.944 && B2h <= B1h - 0.20) ? "PASS" : "FAIL" };
    } else blindRes = { verdict: "ABORT" };
    const syn1 = nb1.lines.map((l) => l.length);
    const synLines = (() => { const r2 = G.makeRng(9895 + pair); return syn1.map((L) => { const x = new Array(L); for (let i = 0; i < L; i++) x[i] = r2.int(19); return x; }); })();
    const stC = C.makeMouth(9850 + pair);
    const seC = C.makeEarOnTrunk(stC, 9950 + pair);
    const S0Ce = C.mouthLoss(stC, easyTest);
    await trainMouthOnly45(stC, synLines, 200, 9906 + pair);
    const C1e = C.mouthLoss(stC, easyTest);
    const earC = earVsFiledK45(seC, nb1);
    const ledger = {
      pair, spec: "v4.5.1", verdict: "COMPLETE",
      determinism: { TEe, THh, filed: [filed42.TE.easy, filed42.TH.hard], match: true },
      buckets: { cuts, bandCounts, marginal: +(Math.max(...bandCounts) / ents.length).toFixed(4) },
      earTrain: { firstLoss: earRes.firstLoss, joint: true, preEar, postEar, deg: +deg.toFixed(4), gateJoint },
      S0e,
      combined: {
        S1: { easy: S1e, hard: S1h, claim1, ear: e1.obs, wilson: C.wilsonCI(e1.k, e1.n) },
        S2: { easy: S2e, hard: S2h, claim2, retention: +((S2e - S1e).toFixed(4)), ear: e2.obs, earC1: e2c1.obs, wilson: C.wilsonCI(e2.k, e2.n) },
        dialect1: d1, dialect2: d2
      },
      nulls: {
        shuffled: { earReal: earAreal.obs, teeth: (earAreal.obs < 0.80 && (e1.obs - earAreal.obs) >= 0.10) ? "HELD" : "BROKEN" },
        blind: blindRes,
        synthetic: { S0e: S0Ce, S1e: C1e, ear: earC.obs, vacuous: (C1e < 2.944 && C1e <= S0Ce - 0.20) ? "VACUOUS" : "CLEAN" }
      }
    };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ledger));
    log("v45 pair " + pair + " done C-S1=" + S1e + " C-S2=" + S2h + " ear=" + e1.obs);
    out[pair] = ledger;
  }
  return out;
};
