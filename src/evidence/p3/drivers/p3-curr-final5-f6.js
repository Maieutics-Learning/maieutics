// F6 rerank pilot (info-only, pair-0, small-n). Mouth proposes top-X, doubt ranks.
// V1 self-lookahead: for each student top-X candidate, pick min next-step student entropy.
// V2 tutor-rerank: pick candidate with max tutor logit (tutor's least-doubt candidate).
// Baseline: student greedy argmax. Tutor greedy reported as reference.
// Setup mirrors WHY: retrained tutor (easy800+hard800), student 200 steps on v44 bundles.
globalThis.runFinal5F6 = async function (fs, log, opts) {
  opts = opts || {};
  const X = opts.X || 4;
  const nLines = opts.nLines || 50;
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
  function topX(logits, x) {
    const idx = logits.map((v, i) => i).sort((a, b) => logits[b] - logits[a]).slice(0, x);
    return idx;
  }
  const pair = 0;
  log("F6 start X=" + X + " nLines=" + nLines);
  const easy = C.structuredPool(9770, 600), easyTrain = easy.slice(0, 500);
  const hard = C.hardLag2Pool(9810, 600), hardTrain = hard.slice(0, 500);
  const shared200 = C.structuredPool(9771, 200).map((o) => o.x);
  const lines = shared200.slice(0, nLines);
  const nb1 = JSON.parse(await fs.readTextFile("src/evidence/p3/p3-curr-v44-bundle-" + pair + "-c1.json"));
  const nb2 = JSON.parse(await fs.readTextFile("src/evidence/p3/p3-curr-v44-bundle-" + pair + "-c2.json"));
  // Tutor retrain (same recipe as WHY)
  const tutor = C.makeMouth(9840 + pair);
  await C.trainMouth(tutor, easyTrain, 800, 9901 + pair);
  await C.trainMouth(tutor, hardTrain, 800, 9902 + pair);
  // Student retrain (WHY recipe: 200 steps on v44 bundles)
  const student = C.makeMouth(9850 + pair);
  const sEar = C.makeEarOnTrunk(student, 9950 + pair);
  await C.trainStudentOnBundle(student, sEar, nb1, 200, 9903 + pair, 0.5);
  // Eval
  let baseA = 0, baseN = 0, v1A = 0, v2A = 0, tutA = 0;
  let v1pick = 0, v2diff = 0, candHit = 0; // diagnostics: how often best in topX, picks differ
  for (let li = 0; li < lines.length; li++) {
    const x = lines[li], L = x.length;
    for (let t = 0; t < L - 1; t++) {
      const prefix = x.slice(0, t + 1);
      const trueY = x[t + 1];
      const fwS = student.forward(prefix, 1);
      const sLogits = Array.from(fwS.cache.posOut[t].logits);
      const fwT = tutor.forward(prefix, 1);
      const tLogits = Array.from(fwT.cache.posOut[t].logits);
      let sBest = 0; for (let i = 1; i < 19; i++) if (sLogits[i] > sLogits[sBest]) sBest = i;
      let tBest = 0; for (let i = 1; i < 19; i++) if (tLogits[i] > tLogits[tBest]) tBest = i;
      if (sBest === trueY) baseA++;
      if (tBest === trueY) tutA++;
      baseN++;
      const cands = topX(sLogits, X);
      if (cands.indexOf(trueY) >= 0) candHit++;
      // V2: tutor rerank among student top-X
      let v2 = cands[0], v2s = -1e30;
      for (const c of cands) { if (tLogits[c] > v2s) { v2s = tLogits[c]; v2 = c; } }
      if (v2 === trueY) v2A++;
      if (v2 !== sBest) v2diff++;
      // V1: self-lookahead min next-step entropy (1-step lookahead; at last position fall back to current entropy)
      let v1 = cands[0], v1e = Infinity;
      for (const c of cands) {
        let e;
        if (t + 1 < L - 1) {
          const px2 = prefix.concat([c]);
          const fw2 = student.forward(px2, 1);
          const lg2 = Array.from(fw2.cache.posOut[t + 1].logits);
          e = entOf(sft(lg2));
        } else {
          e = entOf(sft(sLogits));
          // tie-break by rank (keep order) — entropy identical for all c here
          e += cands.indexOf(c) * 1e-9;
        }
        if (e < v1e) { v1e = e; v1 = c; }
      }
      if (v1 === trueY) v1A++;
      if (v1 !== sBest) v1pick++;
    }
    if ((li + 1) % 10 === 0) { log("F6 eval " + (li + 1) + "/" + lines.length); await new Promise((r) => setTimeout(r, 0)); }
  }
  const res = {
    pair, spec: "final5-F6-rerank", verdict: "COMPLETE", X, nLines,
    nPos: baseN,
    base: +(baseA / baseN).toFixed(4),
    tutorGreedy: +(tutA / baseN).toFixed(4),
    v1SelfLookahead: +(v1A / baseN).toFixed(4),
    v2TutorRerank: +(v2A / baseN).toFixed(4),
    dV1: +((v1A - baseA) / baseN).toFixed(4),
    dV2: +((v2A - baseA) / baseN).toFixed(4),
    candRecall: +(candHit / baseN).toFixed(4),
    v1pickRate: +(v1pick / baseN).toFixed(4),
    v2diffRate: +(v2diff / baseN).toFixed(4)
  };
  await fs.writeTextFile("src/evidence/p3/p3-curr-final5-F6-p0.json", JSON.stringify(res));
  log("F6 done base=" + res.base + " tut=" + res.tutorGreedy + " v1=" + res.v1SelfLookahead + " v2=" + res.v2TutorRerank);
  return res;
};
