// v4.6-T3 calibration: WITH student retrained (S1+S2 WITH, 400 steps), eval-only.
// Per position on shared-200+easyTest+hardTest: mouth correct? vs student ear low/high (median cut).
globalThis.runCurrV46T3 = async function (fs, log, onlyPair) {
  const C = await globalThis.CurrV42Init(fs);
  const G = C.G;
  function sft(lg) {
    let m = -1e30; for (let i = 0; i < lg.length; i++) if (lg[i] > m) m = lg[i];
    let s = 0; const o = new Array(lg.length);
    for (let i = 0; i < lg.length; i++) { o[i] = Math.exp(lg[i] - m); s += o[i]; }
    for (let i = 0; i < o.length; i++) o[i] /= s;
    return o;
  }
  const pairs = (onlyPair == null ? [0, 1, 2] : [onlyPair]);
  const out = {};
  for (const pair of pairs) {
    const ledgerPath = "src/evidence/p3/p3-curr-v46-t3-p" + pair + ".json";
    try {
      const prev = JSON.parse(await fs.readTextFile(ledgerPath));
      if (prev && prev.verdict === "COMPLETE") { log("v46t3 pair " + pair + " exists, skip"); out[pair] = prev; continue; }
    } catch (e) {}
    log("v46t3 pair " + pair + " start");
    const easy = C.structuredPool(9770, 600), easyTest = easy.slice(500);
    const hard = C.hardLag2Pool(9810, 600), hardTest = hard.slice(500);
    const shared200 = C.structuredPool(9771, 200).map((o) => o.x);
    const nb1 = JSON.parse(await fs.readTextFile("src/evidence/p3/p3-curr-v44-bundle-" + pair + "-c1.json"));
    const nb2 = JSON.parse(await fs.readTextFile("src/evidence/p3/p3-curr-v44-bundle-" + pair + "-c2.json"));
    const v44 = JSON.parse(await fs.readTextFile("src/evidence/p3/p3-curr-v44-p" + pair + ".json"));
    const cuts = (v44.buckets && v44.buckets.cuts) ? v44.buckets.cuts : JSON.parse(await fs.readTextFile("src/evidence/p3/p3-curr-v45-p" + pair + ".json")).buckets.cuts;
    const q50 = cuts[1];
    const student = C.makeMouth(9850 + pair);
    const sEar = C.makeEarOnTrunk(student, 9950 + pair);
    await C.trainStudentOnBundle(student, sEar, nb1, 200, 9903 + pair, 0.5);
    // replay WITH (inline, same as T1)
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
    function evalCal(lines) {
      let loC = 0, loN = 0, hiC = 0, hiN = 0;
      const band = [0, 0, 0, 0], bandC = [0, 0, 0, 0];
      for (const x of lines) {
        const L = x.length;
        const fwM = student.forward(x, 1), fwE = sEar.forward(x, 1);
        for (let t = 0; t < L - 1; t++) {
          const lgM = Array.from(fwM.cache.posOut[t].logits);
          let pm = 0; for (let i = 1; i < lgM.length; i++) if (lgM[i] > lgM[pm]) pm = i;
          const ok = (pm === x[t + 1]) ? 1 : 0;
          const lgE = Array.from(fwE.cache.posOut[t].logits);
          let be = 0; for (let i = 1; i < 4; i++) if (lgE[i] > lgE[be]) be = i;
          band[be]++; bandC[be] += ok;
          if (be <= 1) { loC += ok; loN++; } else { hiC += ok; hiN++; }
        }
      }
      const accLo = loN ? loC / loN : NaN, accHi = hiN ? hiC / hiN : NaN;
      return {
        accLo: +accLo.toFixed(4), accHi: +accHi.toFixed(4), gap: +((accLo - accHi).toFixed(4)),
        nLo: loN, nHi: hiN,
        bandAcc: band.map((n, i) => n ? +(bandC[i] / n).toFixed(4) : null)
      };
    }
    const testLines = shared200.concat(easyTest.map((o) => o.x), hardTest.map((o) => o.x));
    const cal = evalCal(testLines);
    const bar = (cal.gap >= 0.15) ? "PASS" : "FAIL";
    const ledger = { pair, spec: "v4.6-T3", verdict: "COMPLETE", q50, cal, bar };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ledger));
    log("v46t3 pair " + pair + " done accLo=" + cal.accLo + " accHi=" + cal.accHi + " gap=" + cal.gap + " " + bar);
    out[pair] = ledger;
  }
  return out;
};
