// v4.6-WHY: source / ceiling / boundary / soft. Self-contained per pair.
globalThis.runCurrV46Why = async function (fs, log, onlyPair) {
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
  function pearson(a, b) {
    const n = a.length;
    const ma = a.reduce((x, y) => x + y, 0) / n, mb = b.reduce((x, y) => x + y, 0) / n;
    let s = 0, sa = 0, sb = 0;
    for (let i = 0; i < n; i++) { s += (a[i] - ma) * (b[i] - mb); sa += (a[i] - ma) * (a[i] - ma); sb += (b[i] - mb) * (b[i] - mb); }
    return (sa && sb) ? s / Math.sqrt(sa * sb) : NaN;
  }
  function ranks(v) {
    const idx = v.map((x, i) => i).sort((a, b) => v[a] - v[b]);
    const r = new Array(v.length);
    let i = 0;
    while (i < idx.length) {
      let j = i;
      while (j + 1 < idx.length && v[idx[j + 1]] === v[idx[i]]) j++;
      const m = (i + j) / 2 + 1;
      for (let k = i; k <= j; k++) r[idx[k]] = m;
      i = j + 1;
    }
    return r;
  }
  const pairs = (onlyPair == null ? [0] : [onlyPair]);
  const out = {};
  for (const pair of pairs) {
    const ledgerPath = "src/evidence/p3/p3-curr-v46-why-p" + pair + ".json";
    try {
      const prev = JSON.parse(await fs.readTextFile(ledgerPath));
      if (prev && prev.verdict === "COMPLETE") { log("why pair " + pair + " exists, skip"); out[pair] = prev; continue; }
    } catch (e) {}
    log("why pair " + pair + " start");
    const easy = C.structuredPool(9770, 600), easyTrain = easy.slice(0, 500), easyTest = easy.slice(500);
    const hard = C.hardLag2Pool(9810, 600), hardTrain = hard.slice(0, 500), hardTest = hard.slice(500);
    const shared200 = C.structuredPool(9771, 200).map((o) => o.x);
    const nb1 = JSON.parse(await fs.readTextFile("src/evidence/p3/p3-curr-v44-bundle-" + pair + "-c1.json"));
    const nb2 = JSON.parse(await fs.readTextFile("src/evidence/p3/p3-curr-v44-bundle-" + pair + "-c2.json"));
    const v44 = JSON.parse(await fs.readTextFile("src/evidence/p3/p3-curr-v44-p" + pair + ".json"));
    const cuts = (v44.buckets && v44.buckets.cuts) ? v44.buckets.cuts : [2.06, 2.35, 2.53];
    // Tutor retrain (mouth only — source test needs mouth entropy + correctness)
    const tutor = C.makeMouth(9840 + pair);
    await C.trainMouth(tutor, easyTrain, 800, 9901 + pair);
    await C.trainMouth(tutor, hardTrain, 800, 9902 + pair);
    const testLines = shared200.concat(easyTest.map((o) => o.x), hardTest.map((o) => o.x));
    // 1. SOURCE: tutor entropy vs tutor correctness
    const tEnts = [], tOk = [];
    for (const x of testLines) {
      const fw = tutor.forward(x, 1);
      for (let t = 0; t < x.length - 1; t++) {
        const lg = Array.from(fw.cache.posOut[t].logits);
        const p = sft(lg);
        let pm = 0; for (let i = 1; i < lg.length; i++) if (lg[i] > lg[pm]) pm = i;
        tEnts.push(entOf(p)); tOk.push(pm === x[t + 1] ? 1 : 0);
      }
    }
    const srt = tEnts.slice().sort((a, b) => a - b);
    const med = srt[Math.floor(srt.length / 2)];
    let loC = 0, loN = 0, hiC = 0, hiN = 0;
    for (let i = 0; i < tEnts.length; i++) {
      if (tEnts[i] <= med) { loC += tOk[i]; loN++; } else { hiC += tOk[i]; hiN++; }
    }
    const tAccLo = loC / loN, tAccHi = hiC / hiN;
    // Student WITH retrain
    const student = C.makeMouth(9850 + pair);
    const sEar = C.makeEarOnTrunk(student, 9950 + pair);
    await C.trainStudentOnBundle(student, sEar, nb1, 200, 9903 + pair, 0.5);
    const rngR = G.makeRng(9914 + pair);
    const optR = new G.Adam(5e-3);
    const trunkW = C.trunkParams(student);
    const allW = trunkW.concat([student.Lout.W, student.Lout.b, sEar.Lout.W, sEar.Lout.b]);
    const B = 8, Z19 = new Float64Array(19);
    for (let step = 1; step <= 200; step++) {
      student.zeroGrad(); sEar.Lout.W.g.fill(0); sEar.Lout.b.g.fill(0);
      for (let b = 0; b < B; b++) {
        const use1 = rngR.uniform(0, 1) < 0.5;
        const bun = use1 ? nb1 : nb2;
        const idx = rngR.int(bun.lines.length);
        const x = bun.lines[idx], L = x.length;
        const tLog = bun.tLogits[idx], tEar = bun.tEar[idx];
        const fwM = student.forward(x, 1);
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
        student.backward(Z19, fwM, auxList, null, null);
        const fwE = sEar.forward(x, 1);
        const auxE = new Array(L);
        for (let t = 0; t < L; t++) {
          if (t >= L - 1) { auxE[t] = null; continue; }
          const ps4 = sft(Array.from(fwE.cache.posOut[t].logits));
          const pt4 = sft(tEar[t]);
          const dd = new Float64Array(4);
          for (let i = 0; i < 4; i++) dd[i] = 0.2 * (ps4[i] - pt4[i]) / (B * (L - 1));
          auxE[t] = dd;
        }
        sEar.backward(new Float64Array(4), fwE, auxE, null, null);
      }
      for (const p of trunkW) { const g = p.g; for (let i = 0; i < g.length; i++) g[i] *= 0.5; }
      optR.step(allW);
      if (step % 50 === 0 || step === 200) await new Promise((r) => setTimeout(r, 0));
    }
    // 2. CEILING: hard agreement train vs transfer
    function hardAgree(lines, bundleOrNull) {
      let a = 0, n = 0;
      for (let li = 0; li < lines.length; li++) {
        const x = lines[li], L = x.length;
        const fwE = sEar.forward(x, 1);
        for (let t = 0; t < L - 1; t++) {
          const lg = Array.from(fwE.cache.posOut[t].logits);
          let bi = 0; for (let i = 1; i < 4; i++) if (lg[i] > lg[bi]) bi = i;
          let ti;
          if (bundleOrNull) {
            const tl = bundleOrNull.tEar[li][t];
            ti = 0; for (let i = 1; i < 4; i++) if (tl[i] > tl[ti]) ti = i;
          } else {
            const fwT = tutor.forward(x, 1);
            const p = sft(Array.from(fwT.cache.posOut[t].logits));
            const e = entOf(p);
            ti = e < cuts[0] ? 0 : e < cuts[1] ? 1 : e < cuts[2] ? 2 : 3;
          }
          if (bi === ti) a++; n++;
        }
      }
      return a / n;
    }
    const trainAgree = (hardAgree(nb1.lines, nb1) + hardAgree(nb2.lines, nb2)) / 2;
    const transferAgree = hardAgree(shared200, null);
    // 3. BOUNDARY mass on testLines (tutor entropy distance to cuts)
    let near = 0, tot = 0;
    for (const e of tEnts) {
      const d = Math.min(Math.abs(e - cuts[0]), Math.abs(e - cuts[1]), Math.abs(e - cuts[2]));
      if (d < 0.05) near++; tot++;
    }
    // 4. SOFT: tutor vs student entropy correlation on shared200
    const aE = [], bE = [];
    for (const x of shared200) {
      const fwT = tutor.forward(x, 1), fwS = student.forward(x, 1);
      for (let t = 0; t < x.length - 1; t++) {
        aE.push(entOf(sft(Array.from(fwT.cache.posOut[t].logits))));
        bE.push(entOf(sft(Array.from(fwS.cache.posOut[t].logits))));
      }
    }
    const pear = pearson(aE, bE);
    const spear = pearson(ranks(aE), ranks(bE));
    const ledger = {
      pair, spec: "v4.6-WHY", verdict: "COMPLETE",
      source: { med: +med.toFixed(4), accLo: +tAccLo.toFixed(4), accHi: +tAccHi.toFixed(4), gap: +((tAccLo - tAccHi).toFixed(4)), nLo: loN, nHi: hiN },
      ceiling: { train: +trainAgree.toFixed(4), transfer: +transferAgree.toFixed(4) },
      boundary: { near, tot, frac: +(near / tot).toFixed(4) },
      soft: { pearson: +pear.toFixed(4), spearman: +spear.toFixed(4), n: aE.length }
    };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ledger));
    log("why pair " + pair + " done srcGap=" + ledger.source.gap + " train=" + ledger.ceiling.train + " trans=" + ledger.ceiling.transfer + " bfrac=" + ledger.boundary.frac + " spear=" + ledger.soft.spearman);
    out[pair] = ledger;
  }
  return out;
};
