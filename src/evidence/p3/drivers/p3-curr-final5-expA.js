// Exp-A: within-distribution RULE-target ear x3 pairs. Same weak tutor (retrain determinism),
// v44 lines reused, tEar = rule one-hots via filed cuts. Student combined + shuffled-rule null.
globalThis.runExpA = async function (fs, log, onlyPair) {
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
  const pairs = (onlyPair == null ? [0, 1, 2] : [onlyPair]);
  const out = {};
  for (const pair of pairs) {
    const ledgerPath = "src/evidence/p3/p3-curr-final5-expA-p" + pair + ".json";
    try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev.verdict === "COMPLETE") { log("expA pair " + pair + " exists, skip"); out[pair] = prev; continue; } } catch (e) {}
    log("expA pair " + pair + " start");
    const easy = C.structuredPool(9770, 600), easyTrain = easy.slice(0, 500), easyTest = easy.slice(500);
    const hard = C.hardLag2Pool(9810, 600), hardTrain = hard.slice(0, 500), hardTest = hard.slice(500);
    const shared200 = C.structuredPool(9771, 200).map((o) => o.x);
    const filed42 = JSON.parse(await fs.readTextFile("src/evidence/p3/p3-curr-v42-p" + pair + ".json"));
    const v44 = JSON.parse(await fs.readTextFile("src/evidence/p3/p3-curr-v44-p" + pair + ".json"));
    const nb1f = JSON.parse(await fs.readTextFile("src/evidence/p3/p3-curr-v44-bundle-" + pair + "-c1.json"));
    const nb2f = JSON.parse(await fs.readTextFile("src/evidence/p3/p3-curr-v44-bundle-" + pair + "-c2.json"));
    const cuts = v44.buckets.cuts;
    const bucketOf = (e) => e < cuts[0] ? 0 : e < cuts[1] ? 1 : e < cuts[2] ? 2 : 3;
    const ruleLogits = (e) => { const b = bucketOf(e); return [b === 0 ? 4 : -4, b === 1 ? 4 : -4, b === 2 ? 4 : -4, b === 3 ? 4 : -4]; };
    const tutor = C.makeMouth(9840 + pair);
    await C.trainMouth(tutor, easyTrain, 800, 9901 + pair);
    const TEe = C.mouthLoss(tutor, easyTest);
    await C.trainMouth(tutor, hardTrain, 800, 9902 + pair);
    const THh = C.mouthLoss(tutor, hardTest);
    if (Math.abs(TEe - filed42.TE.easy) > 0.0001 || Math.abs(THh - filed42.TH.hard) > 0.0001) {
      const ab = { spec: "final5-ExpA", verdict: "ABORT", reason: "tutor drift", TEe, THh };
      await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); out[pair] = ab; continue;
    }
    function rebundle(bf) {
      const tLog = [], tEar = [];
      for (const x of bf.lines) {
        const fw = tutor.forward(x, 1);
        const lm = [], le = [];
        for (let t = 0; t < x.length - 1; t++) {
          const lg = Array.from(fw.cache.posOut[t].logits);
          lm.push(lg); le.push(ruleLogits(entOf(sft(lg))));
        }
        tLog.push(lm); tEar.push(le);
      }
      return { lines: bf.lines, tLogits: tLog, tEar };
    }
    const b1 = rebundle(nb1f), b2 = rebundle(nb2f);
    const st = C.makeMouth(9850 + pair), se = C.makeEarOnTrunk(st, 9950 + pair);
    const S0e = C.mouthLoss(st, easyTest);
    await C.trainStudentOnBundle(st, se, b1, 200, 9903 + pair, 0.5);
    const S1e = C.mouthLoss(st, easyTest), S1h = C.mouthLoss(st, hardTest);
    if (!Number.isFinite(S1e) || !Number.isFinite(S1h)) {
      const ab = { spec: "final5-ExpA", verdict: "ABORT", reason: "mouth non-finite (rule-sharp breaks mouth even in-distribution)", S1e, S1h };
      await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); out[pair] = ab; continue;
    }
    // replay WITH
    const rngR = G.makeRng(9914 + pair);
    const optR = new G.Adam(5e-3);
    const trunkW = C.trunkParams(st);
    const allW = trunkW.concat([st.Lout.W, st.Lout.b, se.Lout.W, se.Lout.b]);
    const B = 8, Z19 = new Float64Array(19);
    for (let step = 1; step <= 200; step++) {
      st.zeroGrad(); se.Lout.W.g.fill(0); se.Lout.b.g.fill(0);
      for (let b = 0; b < B; b++) {
        const bun = rngR.uniform(0, 1) < 0.5 ? b1 : b2;
        const idx = rngR.int(bun.lines.length);
        const x = bun.lines[idx], L = x.length;
        const tLog = bun.tLogits[idx], tEar = bun.tEar[idx];
        const fwM = st.forward(x, 1);
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
        st.backward(Z19, fwM, auxList, null, null);
        const fwE = se.forward(x, 1);
        const auxE = new Array(L);
        for (let t = 0; t < L; t++) {
          if (t >= L - 1) { auxE[t] = null; continue; }
          const ps4 = sft(Array.from(fwE.cache.posOut[t].logits));
          const pt4 = sft(tEar[t]);
          const dd = new Float64Array(4);
          for (let i = 0; i < 4; i++) dd[i] = 0.2 * (ps4[i] - pt4[i]) / (B * (L - 1));
          auxE[t] = dd;
        }
        se.backward(new Float64Array(4), fwE, auxE, null, null);
      }
      for (const prm of trunkW) { const gg = prm.g; for (let i = 0; i < gg.length; i++) gg[i] *= 0.5; }
      optR.step(allW);
      if (step % 100 === 0 || step === 200) await new Promise((r) => setTimeout(r, 0));
    }
    const S2h = C.mouthLoss(st, hardTest);
    // transfer vs rule buckets + shuffled-rule
    function hardAgree(perm) {
      let a = 0, n = 0;
      for (const x of shared200) {
        const fwE = se.forward(x, 1), fwT = tutor.forward(x, 1);
        for (let t = 0; t < x.length - 1; t++) {
          const lg = Array.from(fwE.cache.posOut[t].logits);
          let bi = 0; for (let i = 1; i < 4; i++) if (lg[i] > lg[bi]) bi = i;
          let ti = bucketOf(entOf(sft(Array.from(fwT.cache.posOut[t].logits))));
          if (perm) ti = (ti + 2) % 4;
          if (bi === ti) a++; n++;
        }
      }
      return a / n;
    }
    const real = hardAgree(false), shuf = hardAgree(true);
    const v44t = v44.combined.S1.ear;
    const led = {
      spec: "final5-ExpA", verdict: "COMPLETE", pair,
      determinism: { TEe, THh, match: true },
      mouth: { S0e, S1e, S2h },
      rule: { transfer: +real.toFixed(4), shuf: +shuf.toFixed(4), gap: +((real - shuf).toFixed(4)) },
      v44transfer: v44t, deltaVsV44: +((real - v44t).toFixed(4)),
      primary: ((real - v44t) >= 0.10 && (real - shuf) >= 0.10),
      interesting: (real >= 0.60), cleaner: ((real - shuf) >= 0.10),
      // confound rule (corrected operationalization 2026-11-19: prereg wording muddled gap/level;
      // intent: null must not itself learn. TRIP iff shuffled level >= 0.40, i.e. null reads).
      confoundRule: ((shuf >= 0.40) ? "TRIPPED (null learns)" : "held"),
      blind: "inherited FAIL (v44 base; same lines/distribution)"
    };
    await fs.writeTextFile(ledgerPath, JSON.stringify(led));
    log("expA pair " + pair + " done transfer=" + led.rule.transfer + " gap=" + led.rule.gap + " dV44=" + led.deltaVsV44);
    out[pair] = led;
  }
  return out;
};
