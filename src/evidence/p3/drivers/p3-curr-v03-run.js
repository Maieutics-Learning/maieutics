// v3 consolidated run: v2 base + lag-2 hard + tutor bundle (alpha=0.5 mix).
// Resume-safe: skips pairs with COMPLETE ledger on disk.
globalThis.runCurrV3 = async function (fs, log) {
  const C = await globalThis.CurrV3Init(fs);
  const E = await C.loadD1a();
  const N = C.makeNThermo();
  const QUESTION = "Given a prefix, what comes next? Write lines and marks that teach it.";
  const out = {};
  for (let pair = 0; pair < 3; pair++) {
    const ledgerPath = "src/evidence/p3/p3-curr-v3-p" + pair + ".json";
    try {
      const prev = await fs.readTextFile(ledgerPath);
      const pj = JSON.parse(prev);
      if (pj && pj.verdict === "COMPLETE") { log("pair " + pair + " exists, skip"); out[pair] = pj; continue; }
    } catch (e) { /* not run yet */ }
    log("pair " + pair + " start");
    const easy = C.structuredPool(9770, 600), easyTrain = easy.slice(0, 500), easyTest = easy.slice(500);
    const hard = C.hardLag2Pool(9810, 600), hardTrain = hard.slice(0, 500), hardTest = hard.slice(500);
    const tutor = C.makeMouth(9840 + pair), student = C.makeMouth(9850 + pair), blind = C.makeMouth(9860 + pair);
    const S0 = {
      tutorEasy: C.mouthLoss(tutor, easyTest), tutorHard: C.mouthLoss(tutor, hardTest),
      studEasy: C.mouthLoss(student, easyTest), studHard: C.mouthLoss(student, hardTest),
      blindEasy: C.mouthLoss(blind, easyTest), blindHard: C.mouthLoss(blind, hardTest)
    };
    const blindLines = C.genLines(blind, 9889 + pair, 100);
    const blindUniq = C.uniqCount(blindLines);
    // TE
    await C.trainMouth(tutor, easyTrain, 800, 9901 + pair);
    const TEeasy = C.mouthLoss(tutor, easyTest), TEhard = C.mouthLoss(tutor, hardTest);
    const TEgate = (TEeasy <= S0.tutorEasy - 0.20) ? "PASS" : "FAIL";
    // class1 bundle (tutor-originated sidecar)
    const b1 = C.genBundle(tutor, 9871 + pair, 100);
    await fs.writeTextFile("src/evidence/p3/p3-curr-v3-bundle-" + pair + "-c1.json",
      JSON.stringify({ pair, cls: 1, seed: 9871 + pair, question: QUESTION, lines: b1.lines, tLogits: b1.tLogits, tEnt: b1.tEnt, attnPeak: b1.attnPeak, attnEnt: b1.attnEnt }));
    // S1: student consumes bundle (alpha=0.5)
    await C.trainStudentOnBundle(student, b1, 800, 9903 + pair, 0.5);
    const S1easy = C.mouthLoss(student, easyTest), S1hard = C.mouthLoss(student, hardTest);
    const S1lines = C.genLines(student, 9881 + pair, 100);
    const claim1 = (S1easy <= S0.studEasy - 0.20) ? "PASS" : "FAIL";
    // dialect S1: thermometers grade writer lines (index-aligned)
    function dialect(tutorLines, studLines) {
      const tN = C.gradeWithPile(N, tutorLines).pred, sN = C.gradeWithPile(N, studLines).pred, bN = C.gradeWithPile(N, blindLines).pred;
      const tE = C.gradeWithPile(E, tutorLines).pred, sE = C.gradeWithPile(E, studLines).pred, bE = C.gradeWithPile(E, blindLines).pred;
      const tsN = C.pairStats(tN, sN).obs, tbN = C.pairStats(tN, bN).obs;
      const tsE = C.pairStats(tE, sE).obs, tbE = C.pairStats(tE, bE).obs;
      return {
        dN: { agreeTS: tsN, agreeTB: tbN, gap: +(tsN - tbN).toFixed(2), pass: ((tsN - tbN) >= 0.15) ? "PASS" : "FAIL" },
        dE: { agreeTS: tsE, agreeTB: tbE, gap: +(tsE - tbE).toFixed(2), pass: ((tsE - tbE) >= 0.15) ? "PASS" : "FAIL" }
      };
    }
    const d1 = dialect(b1.lines, S1lines);
    // TH
    await C.trainMouth(tutor, hardTrain, 800, 9902 + pair);
    const THeasy = C.mouthLoss(tutor, easyTest), THhard = C.mouthLoss(tutor, hardTest);
    const THgate = (THhard <= S0.tutorHard - 0.20) ? "PASS" : "FAIL";
    // class2 bundle
    const b2 = C.genBundle(tutor, 9872 + pair, 100);
    await fs.writeTextFile("src/evidence/p3/p3-curr-v3-bundle-" + pair + "-c2.json",
      JSON.stringify({ pair, cls: 2, seed: 9872 + pair, question: QUESTION, lines: b2.lines, tLogits: b2.tLogits, tEnt: b2.tEnt, attnPeak: b2.attnPeak, attnEnt: b2.attnEnt }));
    // S2: same student continued on class2 bundle
    await C.trainStudentOnBundle(student, b2, 800, 9904 + pair, 0.5);
    const S2easy = C.mouthLoss(student, easyTest), S2hard = C.mouthLoss(student, hardTest);
    const S2lines = C.genLines(student, 9882 + pair, 100);
    const claim2 = (S2hard <= S1hard - 0.20) ? "PASS" : "FAIL";
    const d2 = dialect(b2.lines, S2lines);
    const ledger = {
      pair, spec: "v3-consolidated", prereg: "CHATLOG 2026-11-18 V3 CONSOLIDATED PREREG",
      question: QUESTION, hard: "lag2-p0.35-seed9810", alpha: 0.5,
      pools: { easy: 600, hard: 600 }, S0,
      blindGen: { seed: 9889 + pair, uniq: blindUniq },
      TE: { easy: TEeasy, hard: TEhard, gate: TEgate },
      class1: { seed: 9871 + pair, uniq: C.uniqCount(b1.lines) },
      S1: { easy: S1easy, hard: S1hard, claim1, tutorGenUniq: C.uniqCount(b1.lines), studGenUniq: C.uniqCount(S1lines), dialectN: d1.dN, dialectE: d1.dE },
      TH: { easy: THeasy, hard: THhard, gate: THgate },
      class2: { seed: 9872 + pair, uniq: C.uniqCount(b2.lines) },
      S2: { easy: S2easy, hard: S2hard, claim2, retention: +((S2easy - S1easy).toFixed(4)), dialectN: d2.dN, dialectE: d2.dE },
      verdict: "COMPLETE"
    };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ledger));
    log("pair " + pair + " done TE=" + TEeasy + "/" + TEgate + " S1=" + S1easy + "/" + claim1 + " TH=" + THhard + "/" + THgate + " S2=" + S2hard + "/" + claim2);
    out[pair] = ledger;
  }
  return out;
};
