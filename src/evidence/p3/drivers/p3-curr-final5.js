// Final-5 pilots, pair-0. F1 competent-tutor (G-s502, cross-distribution filed openly);
// F2 tails-only masked ear; F3 doubt-order scheduler (mouth-only); F4 abstention (re-analysis,
// no training); F5 fluency-curation editor (mouth-only). Info-only, THIN by construction.
globalThis.runFinal5 = async function (fs, log, which) {
  const C = await globalThis.CurrV42Init(fs);
  const G = C.G;
  const pair = 0;
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
  async function trainEarHeadOnly(ear, mouth, lines, bucketOf, steps, seed, lr) {
    const rng = G.makeRng(seed);
    const opt = new G.Adam(lr == null ? 5e-3 : lr);
    const headParams = [ear.Lout.W, ear.Lout.b];
    const B = 8;
    let firstLoss = 0;
    for (let step = 1; step <= steps; step++) {
      for (const p of headParams) p.g.fill(0);
      let loss = 0;
      for (let b = 0; b < B; b++) {
        const x = lines[rng.int(lines.length)];
        const L = x.length;
        const fwM = mouth.forward(x, 1);
        const fwE = ear.forward(x, 1);
        const auxList = new Array(L);
        for (let t = 0; t < L; t++) {
          if (t >= L - 1) { auxList[t] = null; continue; }
          const bkt = bucketOf(entOf(sft(Array.from(fwM.cache.posOut[t].logits))));
          const ce = G.softmaxCE(fwE.cache.posOut[t].logits, bkt);
          loss += ce.loss / (L - 1);
          const dt = ce.dlogits;
          for (let i = 0; i < dt.length; i++) dt[i] /= (B * (L - 1));
          auxList[t] = dt;
        }
        ear.backward(new Float64Array(4), fwE, auxList, null, null);
        for (const p of C.trunkParams(mouth)) p.g.fill(0);
      }
      opt.step(headParams);
      loss /= B;
      if (step === 1) firstLoss = loss;
      if (step % 100 === 0 || step === steps) await new Promise((r) => setTimeout(r, 0));
      if (!Number.isFinite(loss)) return { halted: "ABORT ear non-finite" };
    }
    return { firstLoss: +(+firstLoss).toFixed(4) };
  }
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
      if (step % 100 === 0 || step === steps) await new Promise((r) => setTimeout(r, 0));
    }
    return { stepsDone: steps };
  }
  const easy = C.structuredPool(9770, 600), easyTest = easy.slice(500);
  const hard = C.hardLag2Pool(9810, 600), hardTest = hard.slice(500);
  const shared200 = C.structuredPool(9771, 200).map((o) => o.x);
  const nb1 = JSON.parse(await fs.readTextFile("src/evidence/p3/p3-curr-v44-bundle-0-c1.json"));
  const nb2 = JSON.parse(await fs.readTextFile("src/evidence/p3/p3-curr-v44-bundle-0-c2.json"));
  const out = {};
  // ---- F1: competent tutor = G-s502 (cross-distribution filed) ----
  if (which === "F1") {
    const p = "src/evidence/p3/p3-curr-final5-F1-p0.json";
    try { const prev = JSON.parse(await fs.readTextFile(p)); if (prev.verdict === "COMPLETE") { log("F1 exists, skip"); return { F1: prev }; } } catch (e) {}
    log("F1 start");
    const blob = JSON.parse(await fs.readTextFile("src/evidence/gseries-v2/g4-s502.json"));
    const gm = C.T.gseries.loadModel(blob);
    // tutor-written lines + quartile cuts from ITS entropy
    const earLines = C.genLines(gm, 9870, 200);
    const ents = [];
    for (const x of earLines) {
      const fw = gm.forward(x, 1);
      for (let t = 0; t < x.length - 1; t++) ents.push(entOf(sft(Array.from(fw.cache.posOut[t].logits))));
    }
    ents.sort((a, b) => a - b);
    const q = (f) => ents[Math.min(ents.length - 1, Math.floor(f * ents.length))];
    const cuts = [+q(0.25).toFixed(4), +q(0.50).toFixed(4), +q(0.75).toFixed(4)];
    const bucketOf = (e) => e < cuts[0] ? 0 : e < cuts[1] ? 1 : e < cuts[2] ? 2 : 3;
    // tutor calibration on curriculum test lines (source check in the competent regime)
    const testLines = shared200.concat(easyTest.map((o) => o.x), hardTest.map((o) => o.x));
    const tE = [], tO = [];
    for (const x of testLines) {
      const fw = gm.forward(x, 1);
      for (let t = 0; t < x.length - 1; t++) {
        const lg = Array.from(fw.cache.posOut[t].logits);
        const pr = sft(lg);
        let pm = 0; for (let i = 1; i < lg.length; i++) if (lg[i] > lg[pm]) pm = i;
        tE.push(entOf(pr)); tO.push(pm === x[t + 1] ? 1 : 0);
      }
    }
    const med = testLines.length ? srtMed(tE) : 0;
    function srtMed(v) { const a = v.slice().sort((x, y) => x - y); return a[Math.floor(a.length / 2)]; }
    let loC = 0, loN = 0, hiC = 0, hiN = 0;
    for (let i = 0; i < tE.length; i++) { if (tE[i] <= med) { loC += tO[i]; loN++; } else { hiC += tO[i]; hiN++; } }
    // ear head-only on gm + student combined on recomputed bundles (v44 lines reused)
    // F1c (filed, supersedes F1b graft): tutor ear-head graft is mechanically unstable
    // cross-distribution (NaN at 5e-3 AND 1e-3; fresh head + trained trunk scale mismatch).
    // Bypass: tEar = RULE one-hots from gm mouth entropy via filed cuts (no learned intermediary;
    // cleaner targets — should work BETTER if the signal exists). Student distills rule buckets.
    function ruleLogits(e) {
      const b = bucketOf(e);
      return [b === 0 ? 4 : -4, b === 1 ? 4 : -4, b === 2 ? 4 : -4, b === 3 ? 4 : -4];
    }
    const earRes = { firstLoss: null, ruleTargets: true };
    if (earRes.halted) { const ab = { spec: "final5-F1", verdict: "ABORT", reason: earRes.halted }; await fs.writeTextFile(p, JSON.stringify(ab)); return { F1: ab }; }
    function rebundle(bf, cls) {
      const tLog = [], tEar = [];
      for (const x of bf.lines) {
        const fwM = gm.forward(x, 1);
        const lm = [], le = [];
        for (let t = 0; t < x.length - 1; t++) {
          lm.push(Array.from(fwM.cache.posOut[t].logits));
          le.push(ruleLogits(entOf(sft(Array.from(fwM.cache.posOut[t].logits)))));
        }
        tLog.push(lm); tEar.push(le);
      }
      return { lines: bf.lines, tLogits: tLog, tEar };
    }
    const b1 = rebundle(nb1, 1), b2 = rebundle(nb2, 2);
    const st = C.makeMouth(9850), se = C.makeEarOnTrunk(st, 9950);
    await C.trainStudentOnBundle(st, se, b1, 200, 9903, 0.5);
    const S1e = C.mouthLoss(st, easyTest);
    // replay WITH inline (50/50)
    const rngR = G.makeRng(9914);
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
    // soft: tutor vs student entropy correlation on shared200
    const aE = [], bE = [];
    for (const x of shared200) {
      const fwT = gm.forward(x, 1), fwS = st.forward(x, 1);
      for (let t = 0; t < x.length - 1; t++) {
        aE.push(entOf(sft(Array.from(fwT.cache.posOut[t].logits))));
        bE.push(entOf(sft(Array.from(fwS.cache.posOut[t].logits))));
      }
    }
    const spear = pearson(ranks(aE), ranks(bE));
    // hard gap: student ear vs gm-ear on shared200 + shuffled
    function hardAgree(earM, refM, lines, perm) {
      let a = 0, n = 0;
      for (const x of lines) {
        const fwE = earM.forward(x, 1);
        for (let t = 0; t < x.length - 1; t++) {
          const lg = Array.from(fwE.cache.posOut[t].logits);
          let bi = 0; for (let i = 1; i < 4; i++) if (lg[i] > lg[bi]) bi = i;
          const fwR = refM.forward(x, 1);
          const pr = sft(Array.from(fwR.cache.posOut[t].logits));
          let ti = bucketOf(entOf(pr));
          if (perm) ti = (ti + 2) % 4;
          if (bi === ti) a++; n++;
        }
      }
      return a / n;
    }
    const real = hardAgree(se, gm, shared200, false);
    const shuf = hardAgree(se, gm, shared200, true);
    const led = {
      spec: "final5-F1", verdict: "COMPLETE", pair: 0,
      tutor: "g4-s502 (filed champion, cross-distribution: acc ~0.043 on curriculum easy, meanEnt ~0.51 — confident-wrong; competence does not transfer across pool families)",
      cuts, earFirstLoss: earRes.firstLoss,
      tutorCalib: { med: +med.toFixed(4), accLo: +(loC / loN).toFixed(4), accHi: +(hiC / hiN).toFixed(4), gap: +((loC / loN - hiC / hiN).toFixed(4)) },
      student: { S1e, S2h },
      softSpear: +spear.toFixed(4),
      hard: { real: +real.toFixed(4), shuf: +shuf.toFixed(4), gap: +((real - shuf).toFixed(4)) },
      promise: "tutor gap>=0.15 AND soft>=0.30 AND hard gap held — else concept dead even in good regime",
      met: false
    };
    led.met = (led.tutorCalib.gap >= 0.15 && spear >= 0.30 && (real - shuf) >= 0.10);
    await fs.writeTextFile(p, JSON.stringify(led));
    log("F1 done calibGap=" + led.tutorCalib.gap + " spear=" + led.softSpear + " hardGap=" + led.hard.gap + " met=" + led.met);
    out.F1 = led;
  }
  // ---- F2: tails-only masked ear ----
  if (which === "F2") {
    const p = "src/evidence/p3/p3-curr-final5-F2-p0.json";
    try { const prev = JSON.parse(await fs.readTextFile(p)); if (prev.verdict === "COMPLETE") { log("F2 exists, skip"); return { F2: prev }; } } catch (e) {}
    log("F2 start");
    const cuts = [2.0675, 2.356, 2.5368];
    function tailMask(ent) { const b = ent < cuts[0] ? 0 : ent < cuts[1] ? 1 : ent < cuts[2] ? 2 : 3; return (b === 0 || b === 3); }
    // student WITH but ear loss only on tail positions (tutor bucket via filed tEnt)
    const st = C.makeMouth(9850), se = C.makeEarOnTrunk(st, 9950);
    const rng = G.makeRng(9903);
    const opt = new G.Adam(5e-3);
    const trunk = C.trunkParams(st);
    const allP = trunk.concat([st.Lout.W, st.Lout.b, se.Lout.W, se.Lout.b]);
    const B = 8, Z19 = new Float64Array(19);
    for (let step = 1; step <= 200; step++) {
      st.zeroGrad(); se.Lout.W.g.fill(0); se.Lout.b.g.fill(0);
      for (let b = 0; b < B; b++) {
        const idx = rng.int(nb1.lines.length);
        const x = nb1.lines[idx], L = x.length;
        const tLog = nb1.tLogits[idx], tEar = nb1.tEar[idx], tEnt = nb1.tEnt[idx];
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
          if (t >= L - 1 || !tailMask(tEnt[t])) { auxE[t] = null; continue; }
          const ps4 = sft(Array.from(fwE.cache.posOut[t].logits));
          const pt4 = sft(tEar[t]);
          const dd = new Float64Array(4);
          for (let i = 0; i < 4; i++) dd[i] = 0.2 * (ps4[i] - pt4[i]) / (B * (L - 1));
          auxE[t] = dd;
        }
        se.backward(new Float64Array(4), fwE, auxE, null, null);
      }
      for (const prm of trunk) { const gg = prm.g; for (let i = 0; i < gg.length; i++) gg[i] *= 0.5; }
      opt.step(allP);
      if (step % 100 === 0 || step === 200) await new Promise((r) => setTimeout(r, 0));
    }
    // tail agreement on shared200 (tutor buckets via CURRENT mouth? use filed cuts + student-ear vs tutor-mouth rule)
    const tutor0 = C.makeMouth(9840);
    await C.trainMouth(tutor0, easy.slice(0, 500), 800, 9901);
    await C.trainMouth(tutor0, hard.slice(0, 500), 800, 9902);
    function tailAgree(perm) {
      let a = 0, n = 0;
      for (const x of shared200) {
        const fwT = tutor0.forward(x, 1), fwE = se.forward(x, 1);
        for (let t = 0; t < x.length - 1; t++) {
          const e = entOf(sft(Array.from(fwT.cache.posOut[t].logits)));
          const b = e < cuts[0] ? 0 : e < cuts[1] ? 1 : e < cuts[2] ? 2 : 3;
          if (!(b === 0 || b === 3)) continue;
          const lg = Array.from(fwE.cache.posOut[t].logits);
          let bi = 0; for (let i = 1; i < 4; i++) if (lg[i] > lg[bi]) bi = i;
          let ti = b;
          if (perm) ti = (ti + 2) % 4;
          if (bi === ti) a++; n++;
        }
      }
      return { obs: a / n, n };
    }
    const r = tailAgree(false), s = tailAgree(true);
    const led = {
      spec: "final5-F2", verdict: "COMPLETE", pair: 0,
      tail: { real: +r.obs.toFixed(4), n: r.n, shuf: +s.obs.toFixed(4), gap: +((r.obs - s.obs).toFixed(4)) },
      promise: "tail>=0.80 with gap>=0.10 while full-range ~0.45",
      met: (r.obs >= 0.80 && (r.obs - s.obs) >= 0.10)
    };
    await fs.writeTextFile(p, JSON.stringify(led));
    log("F2 done tail=" + led.tail.real + " gap=" + led.tail.gap + " met=" + led.met);
    out.F2 = led;
  }
  // ---- F3: doubt-order scheduler (mouth-only, filed tEnt ranking) ----
  if (which === "F3") {
    const p = "src/evidence/p3/p3-curr-final5-F3-p0.json";
    try { const prev = JSON.parse(await fs.readTextFile(p)); if (prev.verdict === "COMPLETE") { log("F3 exists, skip"); return { F3: prev }; } } catch (e) {}
    log("F3 start");
    const all = nb1.lines.map((x, i) => ({ x, t: nb1.tLogits[i], m: nb1.tEnt[i].reduce((a, b) => a + b, 0) / nb1.tEnt[i].length }))
      .concat(nb2.lines.map((x, i) => ({ x, t: nb2.tLogits[i], m: nb2.tEnt[i].reduce((a, b) => a + b, 0) / nb2.tEnt[i].length })));
    all.sort((a, b) => a.m - b.m);
    const lo = all.slice(0, 100), hi = all.slice(100);
    const bun = (arr) => ({ lines: arr.map((o) => o.x), tLogits: arr.map((o) => o.t) });
    const bEasy = bun(lo), bHard = bun(hi);
    const bMix = (() => { const a = all.slice(); const r = G.makeRng(9932); for (let i = a.length - 1; i > 0; i--) { const j = r.int(i + 1); const t = a[i]; a[i] = a[j]; a[j] = t; } return bun(a); })();
    async function runOrder(first, second) {
      const m = C.makeMouth(9850);
      await trainMouthOnly(m, first, 200, 9903, 0.5);
      await trainMouthOnly(m, second, 200, 9914, 0.5);
      return C.mouthLoss(m, hardTest);
    }
    const eFirst = await runOrder(bEasy, bHard);
    const hFirst = await runOrder(bHard, bEasy);
    const mixed = await runOrder(bMix, bMix);
    const led = {
      spec: "final5-F3", verdict: "COMPLETE", pair: 0,
      easyFirst: +eFirst.toFixed(4), hardFirst: +hFirst.toFixed(4), mixed: +mixed.toFixed(4),
      gain: +((mixed - eFirst).toFixed(4)),
      promise: "EASY-first beats MIXED by >=0.10",
      met: ((mixed - eFirst) >= 0.10)
    };
    await fs.writeTextFile(p, JSON.stringify(led));
    log("F3 done easyFirst=" + led.easyFirst + " mixed=" + led.mixed + " gain=" + led.gain + " met=" + led.met);
    out.F3 = led;
  }
  // ---- F4: abstention re-analysis (no training; from T3 ledgers) ----
  if (which === "F4") {
    const p = "src/evidence/p3/p3-curr-final5-F4.json";
    try { const prev = JSON.parse(await fs.readTextFile(p)); if (prev.verdict === "COMPLETE") { log("F4 exists, skip"); return { F4: prev }; } } catch (e) {}
    log("F4 start (re-analysis, no training)");
    const rows = [];
    for (const pair of [0, 1, 2]) {
      const t3 = JSON.parse(await fs.readTextFile("src/evidence/p3/p3-curr-v46-t3-p" + pair + ".json"));
      const raw = (t3.cal.accLo * t3.cal.nLo + t3.cal.accHi * t3.cal.nHi) / (t3.cal.nLo + t3.cal.nHi);
      const cov = t3.cal.nLo / (t3.cal.nLo + t3.cal.nHi);
      rows.push({ pair, selective: t3.cal.accLo, raw: +raw.toFixed(4), coverage: +cov.toFixed(4), lift: +((t3.cal.accLo - raw).toFixed(4)) });
    }
    const met = rows.filter((r) => r.lift >= 0.10 && r.coverage >= 0.50).length;
    const led = { spec: "final5-F4", verdict: "COMPLETE", rows, promise: "selective>>raw (>=+0.10) at >=50% coverage", pairsMet: met, met: met >= 2 };
    await fs.writeTextFile(p, JSON.stringify(led));
    log("F4 done lifts=" + rows.map((r) => r.lift).join("/") + " met=" + led.met);
    out.F4 = led;
  }
  // ---- F5: fluency-curation editor (mouth-only) ----
  if (which === "F5") {
    const p = "src/evidence/p3/p3-curr-final5-F5-p0.json";
    try { const prev = JSON.parse(await fs.readTextFile(p)); if (prev.verdict === "COMPLETE") { log("F5 exists, skip"); return { F5: prev }; } } catch (e) {}
    log("F5 start");
    const all = nb1.lines.map((x, i) => ({ x, t: nb1.tLogits[i], m: nb1.tEnt[i].reduce((a, b) => a + b, 0) / nb1.tEnt[i].length }))
      .concat(nb2.lines.map((x, i) => ({ x, t: nb2.tLogits[i], m: nb2.tEnt[i].reduce((a, b) => a + b, 0) / nb2.tEnt[i].length })));
    all.sort((a, b) => a.m - b.m);
    const cur = all.slice(0, 100);
    const r = G.makeRng(9932);
    const pool = all.slice(); const rnd = [];
    const used = new Set();
    while (rnd.length < 100) { const i = r.int(pool.length); if (!used.has(i)) { used.add(i); rnd.push(pool[i]); } }
    const bun = (arr) => ({ lines: arr.map((o) => o.x), tLogits: arr.map((o) => o.t) });
    const bCur = bun(cur), bRnd = bun(rnd);
    async function branch(second) {
      const m = C.makeMouth(9850);
      await trainMouthOnly(m, nb1, 200, 9903, 0.5);
      await trainMouthOnly(m, second, 200, 9914, 0.5);
      return C.mouthLoss(m, hardTest);
    }
    const cS2 = await branch(bCur), rS2 = await branch(bRnd);
    const led = {
      spec: "final5-F5", verdict: "COMPLETE", pair: 0,
      curated: +cS2.toFixed(4), random: +rS2.toFixed(4), lift: +((rS2 - cS2).toFixed(4)),
      promise: "curated beats random by >=0.10",
      met: ((rS2 - cS2) >= 0.10)
    };
    await fs.writeTextFile(p, JSON.stringify(led));
    log("F5 done curated=" + led.curated + " random=" + led.random + " lift=" + led.lift + " met=" + led.met);
    out.F5 = led;
  }
  return out;
};
