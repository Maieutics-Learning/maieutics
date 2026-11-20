// src/evidence/p4/drivers/p4-toy.js — P4 toy-loop driver (COUNTERSIGNED prereg v1.0).
// Level (a): frozen tutors (E d1a blob / N2 rebuilt 9102), fresh students, P2 recipe
// (soft-only on tutor cache, 3000 steps, batch 16, attnKeep 0). Fresh pools:
// A adapt 10200 (1000), B held-out direction 10260 (400), C anchor 10270 (400).
// Round 1: uniform-500 (rng-drawn) -> scores -> transform -> round 2 weighted-500
// (true / uniform-WITHHELD / permuted-SHUFFLED for E; true only for N2).
// Resume-safe per (tutor, seed) ledgers. Run via execute_js:
//   await fs.readTextFile... eval ORDER via P4ToyInit(fs), then runP4Toy(fs, log, "E-s0").
globalThis.P4ToyInit = async function (fs) {
  globalThis.window = globalThis;
  const ORDER = ["src/tinynn/nn.js", "src/tinynn/seeded.js", "src/tinynn/tasks.js", "src/tinynn/train.js", "src/tinynn/gseries.js"];
  for (const p of ORDER) { const src = await fs.readTextFile(p); (0, eval)(src + "\n//# sourceURL=" + p); }
  const G = globalThis.__tinyNN, T = globalThis.TinyNN;
  if (!G || !T || !T.gseries) throw new Error("p4 stack load failed");
  const GS = T.gseries;
  const OPTS4 = { vocab: 19, classes: 4, h: 48, m: 96, d: 16, arch: "attn" };
  const READ_R = 4; // lab convention; filed implementation choice
  const STAGES = [{ steps: 3000, attnKeep: 0, softW: 1.0, hardW: 0 }];

  function noisePool(seed, nShort, nLong) {
    const rng = G.makeRng(seed), lines = [];
    for (let i = 0; i < nShort; i++) {
      const len = [10, 15, 20][rng.int(3)], x = new Array(len);
      for (let t = 0; t < len; t++) x[t] = rng.int(19);
      lines.push({ x });
    }
    for (let i = 0; i < nLong; i++) {
      const x = new Array(50);
      for (let t = 0; t < 50; t++) x[t] = rng.int(19);
      lines.push({ x });
    }
    return lines;
  }
  function poolGuards(lines, nShort, nLong) {
    let shorts = 0, longs = 0, sep = 0, tok = 0;
    for (const l of lines) {
      if (l.x.length <= 20) shorts++; else longs++;
      for (const t of l.x) { tok++; if (t === 18) sep++; }
    }
    return { shorts, longs, sepRate: +(sep / tok).toFixed(4),
      histOK: shorts === nShort && longs === nLong, sepOK: Math.abs(sep / tok - 1 / 19) < 0.01 };
  }
  function readLabels(model, lines) {
    const out = new Array(lines.length);
    for (let i = 0; i < lines.length; i++) {
      const lg = model.forward(lines[i].x, READ_R).logits;
      let b = 0;
      for (let k = 1; k < lg.length; k++) if (lg[k] > lg[b]) b = k;
      out[i] = b;
    }
    return out;
  }
  function agree(a, b) { let n = 0; for (let i = 0; i < a.length; i++) if (a[i] === b[i]) n++; return n / a.length; }
  function permMean(a, b, rng, n) {
    n = n || 20;
    const idx = b.slice();
    let s = 0;
    for (let p = 0; p < n; p++) {
      for (let i = idx.length - 1; i > 0; i--) { const j = rng.int(i + 1); const t = idx[i]; idx[i] = idx[j]; idx[j] = t; }
      s += agree(a, idx);
    }
    return s / n;
  }
  // cells: 4 pseudo-classes x 2 bands (0 short<=20, 1 long)
  function sliceStats(eLabs, sLabs, lines, rng) {
    const cells = [];
    for (let c = 0; c < 4; c++) for (let b = 0; b < 2; b++) cells.push({ c, b, n: 0, obs: 0 });
    for (let i = 0; i < lines.length; i++) {
      const cell = cells[eLabs[i] * 2 + (lines[i].x.length <= 20 ? 0 : 1)];
      cell.n++; if (sLabs[i] === eLabs[i]) cell.obs++;
    }
    for (const cell of cells) {
      cell.obs = cell.n ? cell.obs / cell.n : 0;
      const am = [], bm = [];
      for (let i = 0; i < lines.length; i++) {
        if (eLabs[i] === cell.c && (lines[i].x.length <= 20 ? 0 : 1) === cell.b) { am.push(eLabs[i]); bm.push(sLabs[i]); }
      }
      cell.perm = am.length ? permMean(am, bm, rng, 20) : 0.25;
      cell.delta = +(cell.obs - cell.perm).toFixed(4);
      cell.obs = +cell.obs.toFixed(4);
      cell.perm = +cell.perm.toFixed(4);
    }
    const o = agree(eLabs, sLabs), p = permMean(eLabs, sLabs, rng, 20);
    return { cells, overall: { obs: +o.toFixed(4), perm: +p.toFixed(4), delta: +(o - p).toFixed(4) } };
  }
  function transform(deltas) {
    const TARGET = 0.30, FLOOR = 0.05;
    const raw = deltas.map((d) => Math.max(0, TARGET - d) + FLOOR);
    const s = raw.reduce((a, b) => a + b, 0);
    return raw.map((r) => r / s);
  }
  async function trainStudent(seed, tutor, trainLines) {
    const model = T.makeModel(G.makeRng(seed), OPTS4);
    const cache = await GS.cacheTutor(tutor, trainLines);
    const res = await GS.trainFaded({ model, tutor, train: trainLines, tutorCache: cache, stages: STAGES, seed: seed + 7000 });
    return { model, firstLoss: +res.firstLoss.toFixed(4), lastLoss: +res.lastLoss.toFixed(4) };
  }
  async function loadE() { return GS.loadModel(JSON.parse(await fs.readTextFile("src/evidence/d1a/tutor.json"))); }
  function makeN2() { return T.makeModel(G.makeRng(9102), OPTS4); }

  return { G, T, GS, OPTS4, READ_R, STAGES, noisePool, poolGuards, readLabels, agree, permMean, sliceStats, transform, trainStudent, loadE, makeN2 };
};

globalThis.runP4Cal = async function (fs, log, steps) {
  // v1.1 calibration: E round-1 only (seed-0 lines), custom step count.
  // Ledger: src/evidence/p4/cal-{steps}.json. Resume-safe.
  const ledgerPath = "src/evidence/p4/cal-" + steps + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log("cal-" + steps + " exists, skip"); return prev; }
  } catch (e) {}
  const C = await globalThis.P4ToyInit(fs);
  const poolA = C.noisePool(10200, 500, 500);
  const poolB = C.noisePool(10260, 200, 200);
  const gA = C.poolGuards(poolA, 500, 500);
  if (!gA.histOK || !gA.sepOK) {
    const ab = { steps, verdict: "ABORT", reason: "pool guard", gA };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab;
  }
  const tutor = await C.loadE();
  const eA = C.readLabels(tutor, poolA), eB = C.readLabels(tutor, poolB);
  const r1rng = C.G.makeRng(10240);
  const idxAll = poolA.map((_, i) => i);
  for (let i = idxAll.length - 1; i > 0; i--) { const j = r1rng.int(i + 1); const t = idxAll[i]; idxAll[i] = idxAll[j]; idxAll[j] = t; }
  const r1Idx = idxAll.slice(0, 500);
  const r1Lines = r1Idx.map((i) => poolA[i]);
  // custom-step train (P2 recipe otherwise: soft-only, attnKeep 0, batch 16)
  const t0 = Date.now();
  const model = C.T.makeModel(C.G.makeRng(10201), C.OPTS4);
  const cache = await C.GS.cacheTutor(tutor, r1Lines);
  const res = await C.GS.trainFaded({ model, tutor, train: r1Lines, tutorCache: cache, stages: [{ steps, attnKeep: 0, softW: 1.0, hardW: 0 }], seed: 10201 + 7000 });
  const wallMs = Date.now() - t0;
  const s1A = C.readLabels(model, r1Lines);
  const eR1 = r1Idx.map((i) => eA[i]);
  const trainObs = C.agree(eR1, s1A), trainPerm = C.permMean(eR1, s1A, C.G.makeRng(10250), 20);
  const s1B = C.readLabels(model, poolB);
  const freshObs = C.agree(eB, s1B), freshPerm = C.permMean(eB, s1B, C.G.makeRng(10270), 20);
  const ledger = {
    steps, spec: "p4-v1.1-cal", verdict: "COMPLETE", wallMs,
    train: { obs: +trainObs.toFixed(4), perm: +trainPerm.toFixed(4), agree: +(trainObs - trainPerm).toFixed(4) },
    freshB: { obs: +freshObs.toFixed(4), perm: +freshPerm.toFixed(4), delta: +(freshObs - freshPerm).toFixed(4) },
    firstLoss: +res.firstLoss.toFixed(4), lastLoss: +res.lastLoss.toFixed(4),
    gate: { trainAgree: +((trainObs - trainPerm).toFixed(4)) >= 0.50 ? "PASS" : "FAIL", freshDelta: +((freshObs - freshPerm).toFixed(4)) >= 0.15 ? "PASS" : "FAIL" }
  };
  await fs.writeTextFile(ledgerPath, JSON.stringify(ledger));
  log("cal-" + steps + " done train=" + ledger.train.agree + " fresh=" + ledger.freshB.delta + " wall=" + Math.round(wallMs / 60000) + "min");
  return ledger;
};

globalThis.runP4Toy = async function (fs, log, which) {
  // which: "E-s0".."E-s2", "N2-s0".."N2-s2"
  const m = /^([A-Z0-9]+)-s([0-2])$/.exec(which);
  if (!m) throw new Error("bad which " + which);
  const tutorName = m[1], seedIdx = +m[2];
  const ledgerPath = "src/evidence/p4/p4-toy-" + tutorName + "-s" + seedIdx + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(which + " exists, skip"); return prev; }
  } catch (e) {}
  const C = await globalThis.P4ToyInit(fs);
  const SEED = { E: [10201, 10202, 10203], N2: [10211, 10212, 10213] }[tutorName];
  if (!SEED) throw new Error("bad tutor " + tutorName);
  const sSeed = SEED[seedIdx];

  // Pools (fresh, disjoint from P2/P3 by construction)
  const poolA = C.noisePool(10200, 500, 500);
  const poolB = C.noisePool(10260, 200, 200);
  const gA = C.poolGuards(poolA, 500, 500), gB = C.poolGuards(poolB, 200, 200);
  if (!gA.histOK || !gA.sepOK || !gB.histOK || !gB.sepOK) {
    const ab = { which, verdict: "ABORT", reason: "pool guard", gA, gB };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab;
  }
  const tutor = tutorName === "E" ? await C.loadE() : C.makeN2();
  const eA = C.readLabels(tutor, poolA), eB = C.readLabels(tutor, poolB);

  // Round 1: rng-drawn uniform-500 from A (same indices all tutors: same harness)
  const r1rng = C.G.makeRng(10240 + seedIdx);
  const idxAll = poolA.map((_, i) => i);
  for (let i = idxAll.length - 1; i > 0; i--) { const j = r1rng.int(i + 1); const t = idxAll[i]; idxAll[i] = idxAll[j]; idxAll[j] = t; }
  const r1Idx = idxAll.slice(0, 500);
  const r1Lines = r1Idx.map((i) => poolA[i]);
  const used = new Set(r1Idx);
  const restIdx = idxAll.slice(500);
  const restByCell = [[], [], [], [], [], [], [], []];
  for (const i of restIdx) restByCell[eA[i] * 2 + (poolA[i].x.length <= 20 ? 0 : 1)].push(i);

  const S1 = await C.trainStudent(sSeed, tutor, r1Lines);
  const s1A = C.readLabels(S1.model, r1Lines);
  const eR1 = r1Idx.map((i) => eA[i]);
  const stats1 = C.sliceStats(eR1, s1A, r1Lines, C.G.makeRng(10250 + seedIdx));
  if (stats1.overall.delta >= 0.40) {
    const ab = { which, verdict: "ABORT", reason: "round-1 overall >= 0.40 stop rule", stats1: stats1.overall };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab;
  }
  const deltas = stats1.cells.map((c) => c.delta);
  const wTrue = C.transform(deltas);
  const wUnif = [1 / 8, 1 / 8, 1 / 8, 1 / 8, 1 / 8, 1 / 8, 1 / 8, 1 / 8];
  // SHUFFLED arm: permute the 8 deltas, same function
  const shuf = deltas.slice(), srng = C.G.makeRng(10255 + seedIdx);
  for (let i = shuf.length - 1; i > 0; i--) { const j = srng.int(i + 1); const t = shuf[i]; shuf[i] = shuf[j]; shuf[j] = t; }
  const wShuf = C.transform(shuf);

  function draw500(w, seed) {
    const rng = C.G.makeRng(seed), out = [];
    const cum = []; let s = 0;
    for (const x of w) { s += x; cum.push(s); }
    for (let k = 0; k < 500; k++) {
      const u = rng.uniform(0, 1);
      let c = 0; while (c < 7 && u > cum[c]) c++;
      const cell = restByCell[c];
      out.push(poolA[cell[rng.int(cell.length)]]);
    }
    return out;
  }
  const arms = tutorName === "E"
    ? [{ name: "true", w: wTrue, seed: sSeed + 100 }, { name: "withheld", w: wUnif, seed: sSeed + 200 }, { name: "shuffled", w: wShuf, seed: sSeed + 300 }]
    : [{ name: "true", w: wTrue, seed: sSeed + 100 }];
  const r2 = {};
  for (const a of arms) {
    const lines = draw500(a.w, a.seed);
    const st = await C.trainStudent(a.seed, tutor, lines);
    r2[a.name] = { firstLoss: st.firstLoss, lastLoss: st.lastLoss, model: st.model, cellCounts: null };
    // cell counts of the draw (recompute from labels)
    const cc = [0, 0, 0, 0, 0, 0, 0, 0];
    for (const l of lines) cc[C.readLabels(tutor, [l])[0] * 2 + (l.x.length <= 20 ? 0 : 1)]++;
    r2[a.name].cellCounts = cc;
    if (!Number.isFinite(st.lastLoss)) {
      const ab = { which, verdict: "ABORT", reason: "non-finite loss " + a.name };
      await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab;
    }
  }

  // Evals on held-out Pool B
  const s1B = C.readLabels(S1.model, poolB);
  const ev = {};
  for (const a of arms) {
    const s2B = C.readLabels(r2[a.name].model, poolB);
    const oE = C.agree(eB, s2B), pE = C.permMean(eB, s2B, C.G.makeRng(10260 + seedIdx * 10 + arms.indexOf(a)), 20);
    const oS = C.agree(s1B, s2B);
    ev[a.name] = { agreeE: +oE.toFixed(4), permE: +pE.toFixed(4), deltaE: +(oE - pE).toFixed(4), agreeS1: +oS.toFixed(4) };
  }
  const s1EvO = C.agree(eB, s1B), s1EvP = C.permMean(eB, s1B, C.G.makeRng(10270 + seedIdx), 20);
  const s1Delta = +(s1EvO - s1EvP).toFixed(4);

  // Operator: mass on below-median-delta cells, true vs 20 permuted-delta draws
  const med = deltas.slice().sort((a, b) => a - b)[4];
  const below = deltas.map((d, i) => (d < med ? i : -1)).filter((i) => i >= 0);
  function massOn(w, cells) { let s = 0; for (const c of cells) s += w[c]; return s; }
  const mTrue = massOn(wTrue, below.length ? below : [0]);
  const mShufArm = massOn(wShuf, below.length ? below : [0]);
  let ge = 0;
  for (let p = 0; p < 20; p++) {
    const prng = C.G.makeRng(10280 + seedIdx * 20 + p);
    const pd = deltas.slice();
    for (let i = pd.length - 1; i > 0; i--) { const j = prng.int(i + 1); const t = pd[i]; pd[i] = pd[j]; pd[j] = t; }
    if (massOn(C.transform(pd), below.length ? below : [0]) >= mTrue) ge++;
  }
  const pOp = ge / 20;
  const mWith = massOn(wUnif, below.length ? below : [0]);
  const operator = { massTrue: +mTrue.toFixed(4), massShuffledArm: +mShufArm.toFixed(4), massUniform: +mWith.toFixed(4), p: +pOp.toFixed(3), pass: pOp < 0.05 ? "PASS" : "FAIL" };
  const withheldClean = Math.abs(mWith - 1 * (below.length ? below.length / 8 : 1)) <= 0.05 ? "CLEAN" : "DIRTY";

  // Direction (true arm only): margin = agree(S2,E) - agree(S2,S1) on B
  const t = ev.true;
  const margin = +(t.agreeE - t.agreeS1).toFixed(4);
  const direction = { margin, delta: 0.10, verdict: margin >= 0.10 ? "PASS" : (margin <= -0.10 ? "CAVE" : "INCONCLUSIVE") };

  const ledger = {
    which, spec: "p4-v1.0", tutor: tutorName, seedIdx,
    pools: { A: 10200, B: 10260, C: "10270(deferred to verdict assembly)" },
    guards: { gA, gB },
    round1: { n: 500, idxSeed: 10240 + seedIdx, firstLoss: S1.firstLoss, lastLoss: S1.lastLoss,
      cellDeltas: deltas, overall: stats1.overall, s1HeldDelta: s1Delta },
    weights: { true: wTrue.map((x) => +x.toFixed(4)), shuffled: wShuf.map((x) => +x.toFixed(4)) },
    round2: Object.fromEntries(arms.map((a) => [a.name, { firstLoss: r2[a.name].firstLoss, lastLoss: r2[a.name].lastLoss, cellCounts: r2[a.name].cellCounts }])),
    evalB: ev,
    operator, withheld: withheldClean, direction,
    verdict: "COMPLETE"
  };
  await fs.writeTextFile(ledgerPath, JSON.stringify(ledger));
  log(which + " done op=" + operator.pass + "(p=" + operator.p + ") dir=" + direction.verdict + "(" + margin + ") s1d=" + s1Delta + " s2d=" + t.deltaE);
  return ledger;
};

// ---- Exp-E v2: teacher-generated-lines chain (ported mouth machinery from
// p3-curr-v42.js CurrV42Init: same semantics; lastLoss fix noted — v42 returns
// NaN lastLoss on success, here the real final loss is recorded) ----
globalThis.P4ExpEInit = async function (fs) {
  const C = await globalThis.P4ToyInit(fs);
  const G = C.G, T = C.T, GS = C.GS, VOC = 19;
  const OPTS19 = { vocab: 19, classes: 19, h: 48, m: 96, d: 16, arch: "attn" };
  function softmax(a) {
    let m = -1e30; for (let i = 0; i < a.length; i++) if (a[i] > m) m = a[i];
    let s = 0; const o = new Array(a.length);
    for (let i = 0; i < a.length; i++) { o[i] = Math.exp(a[i] - m); s += o[i]; }
    for (let i = 0; i < o.length; i++) o[i] /= s;
    return o;
  }
  function sampleCat(rng, probs) {
    const u = rng.uniform(0, 1); let c = 0;
    for (let i = 0; i < probs.length; i++) { c += probs[i]; if (u < c) return i; }
    return probs.length - 1;
  }
  function structPool(seed, n) {
    const rng = G.makeRng(seed), out = [];
    for (let i = 0; i < n; i++) {
      const len = i < n / 2 ? [10, 15, 20][rng.int(3)] : 50;
      const x = new Array(len);
      x[0] = rng.int(VOC);
      for (let t = 1; t < len; t++) x[t] = rng.uniform(0, 1) < 0.35 ? x[t - 1] : rng.int(VOC);
      out.push({ x });
    }
    return out;
  }
  function makeMouth(seed) { return T.makeModel(G.makeRng(seed), OPTS19); }
  async function trainMouth(mouth, pool, steps, seed) {
    const rng = G.makeRng(seed);
    const opt = new G.Adam(5e-3);
    const B = 8;
    let firstLoss = 0, loss = 0;
    for (let step = 1; step <= steps; step++) {
      mouth.zeroGrad();
      loss = 0;
      for (let b = 0; b < B; b++) {
        const ex = pool[rng.int(pool.length)];
        const x = ex.x, L = x.length;
        const fw = mouth.forward(x, 1);
        const auxList = new Array(L);
        for (let t = 0; t < L; t++) {
          if (t >= L - 1) { auxList[t] = null; continue; }
          const ce = G.softmaxCE(fw.cache.posOut[t].logits, x[t + 1]);
          loss += ce.loss / (L - 1);
          const dt = ce.dlogits;
          for (let i = 0; i < dt.length; i++) dt[i] /= (B * (L - 1));
          auxList[t] = dt;
        }
        mouth.backward(new Float64Array(19), fw, auxList, null, null);
      }
      opt.step(mouth.params());
      loss /= B;
      if (step === 1) firstLoss = loss;
      if (step % 50 === 0 || step === steps) await new Promise((r) => setTimeout(r, 0));
      if (!Number.isFinite(loss)) return { firstLoss: +firstLoss.toFixed(4), lastLoss: NaN, stepsDone: step, halted: "mouth non-finite" };
    }
    return { firstLoss: +firstLoss.toFixed(4), lastLoss: +loss.toFixed(4), stepsDone: steps, halted: null };
  }
  function mouthLoss(mouth, lines, n) {
    n = n || lines.length;
    let s = 0;
    for (let i = 0; i < n; i++) {
      const x = lines[i].x !== undefined ? lines[i].x : lines[i], L = x.length;
      const fw = mouth.forward(x, 1);
      for (let t = 0; t < L - 1; t++) s += G.softmaxCE(fw.cache.posOut[t].logits, x[t + 1]).loss / (L - 1);
    }
    return +(s / n).toFixed(4);
  }
  function genLines(mouth, seed, n) {
    n = n || 200;
    const rng = G.makeRng(seed);
    const lines = [];
    for (let li = 0; li < n; li++) {
      const L = li < n / 2 ? [10, 15, 20][rng.int(3)] : 50;
      const x = [];
      for (let k = 0; k < 3; k++) x.push(rng.int(VOC));
      while (x.length < L) {
        const fw = mouth.forward(x, 1);
        const pos = fw.cache.posOut;
        const logits = Array.from(pos[pos.length - 1].logits);
        x.push(sampleCat(rng, softmax(logits)));
      }
      lines.push(x);
    }
    return lines;
  }
  function uniqCount(lines) { return new Set(lines.map((l) => l.join(","))).size; }
  function gradePile(pile, lines) {
    const counts = [0, 0, 0, 0], pred = [];
    for (const x of lines) {
      const xx = x.x !== undefined ? x.x : x;
      const lg = Array.from(pile.forward(xx, 1).logits);
      let bi = 0; for (let i = 1; i < lg.length; i++) if (lg[i] > lg[bi]) bi = i;
      counts[bi]++; pred.push(bi);
    }
    return { counts, pred };
  }
  function pairStats(tPred, sPred) {
    const n = tPred.length; let a = 0;
    const ps = [0, 0, 0, 0], pt = [0, 0, 0, 0];
    for (let i = 0; i < n; i++) { if (tPred[i] === sPred[i]) a++; ps[sPred[i]]++; pt[tPred[i]]++; }
    const obs = a / n; let perm = 0;
    for (let c = 0; c < 4; c++) perm += (ps[c] / n) * (pt[c] / n);
    return { obs: +obs.toFixed(4), perm: +perm.toFixed(4), delta: +(obs - perm).toFixed(4) };
  }
  function unigramEnt(lines) {
    const c = new Array(19).fill(0); let n = 0;
    for (const x0 of lines) { const x = x0.x !== undefined ? x0.x : x0; for (const t of x) { c[t]++; n++; } }
    let e = 0;
    for (let i = 0; i < 19; i++) if (c[i]) e -= (c[i] / n) * Math.log(c[i] / n);
    return +e.toFixed(4);
  }
  function pileEnt(counts) {
    const n = counts.reduce((a, b) => a + b, 0); let e = 0;
    for (const c of counts) if (c) e -= (c / n) * Math.log(c / n);
    return +e.toFixed(4);
  }
  async function trainPile(studentPile, pileTeacher, trainXs, steps, seed) {
    const cache = await GS.cacheTutor(pileTeacher, trainXs.map((x) => ({ x })));
    return GS.trainFaded({ model: studentPile, tutor: pileTeacher, train: trainXs.map((x) => ({ x })), tutorCache: cache, stages: [{ steps, attnKeep: 0, softW: 1.0, hardW: 0 }], seed });
  }
  return Object.assign({}, C, { OPTS19, structPool, makeMouth, trainMouth, mouthLoss, genLines, uniqCount, gradePile, pairStats, unigramEnt, pileEnt, trainPile });
};

globalThis.runP4ExpE = async function (fs, log, which) {
  // which: "L{lin}g{g}", lin 0-9, g 0-9 (v2.2 lineages, no cross-talk). Resume-safe.
  const mm = /^L([0-9])g([0-9])$/.exec(which);
  if (!mm) throw new Error("bad which " + which);
  const lin = +mm[1], g = +mm[2];
  const ledgerPath = "src/evidence/p4/expE-L" + lin + "g" + g + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(which + " exists, skip"); return prev; }
  } catch (e) {}
  const C = await globalThis.P4ExpEInit(fs);
  const E = await C.loadE();
  if (g === 0) {
    if (lin === 0) { // adopted as filed (expE-g0.json + expE-mouth-g0.json); copy + return
      const prev0 = JSON.parse(await fs.readTextFile("src/evidence/p4/expE-g0.json"));
      await fs.writeTextFile(ledgerPath, JSON.stringify(Object.assign({}, prev0, { which, lineage: 0, adopted: "expE-g0.json" })));
      log("L0g0 adopted from expE-g0.json"); return prev0;
    }
    const pool = C.structPool(9770, 600);
    const M0 = C.makeMouth(10300 + lin);
    const tr = await C.trainMouth(M0, pool, 800, 10301 + lin);
    if (tr.halted) { const ab = { which, verdict: "ABORT", reason: tr.halted }; await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab; }
    const held = C.structPool(9771, 200);
    const heldLoss = C.mouthLoss(M0, held);
    const L0 = C.genLines(M0, 10310 + lin * 100, 200);
    const uniq = C.uniqCount(L0);
    const eG = C.gradePile(E, L0);
    await fs.writeTextFile("src/evidence/p4/expE-mouth-L" + lin + "g0.json", JSON.stringify(C.GS.saveModel(M0, C.OPTS19)));
    const ledger = { which, spec: "expE-v2.2", lineage: lin, verdict: "COMPLETE",
      mouth: { train: tr, heldStructuredLoss: heldLoss, stillborn: heldLoss >= 2.7 ? "STILLBORN" : "VIABLE" },
      gen: { n: 200, uniq, unigramEnt: C.unigramEnt(L0), eCounts: eG.counts, eEnt: C.pileEnt(eG.counts) },
      lines: L0 };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ledger));
    log("g0 done mouth=" + tr.firstLoss + "->" + tr.lastLoss + " held=" + heldLoss + " uniq=" + uniq + " uni=" + ledger.gen.unigramEnt);
    return ledger;
  }
  // g>=1: load lineage teacher (g1: M0 blob + E; else stored S blobs), generate, label, train student, eval
  const prev = JSON.parse(await fs.readTextFile("src/evidence/p4/expE-L" + lin + "g" + (g - 1) + ".json"));
  if (prev.verdict !== "COMPLETE" || prev.lineage !== lin) throw new Error("prev not usable");
  const blobM = (l, gg) => "src/evidence/p4/expE-mouth-" + (l === 0 && gg === 0 ? "g0" : "L" + l + "g" + gg) + ".json";
  const blobP = (l, gg) => "src/evidence/p4/expE-pile-L" + l + "g" + gg + ".json";
  let mouthT, pileT;
  if (g === 1) {
    mouthT = C.GS.loadModel(JSON.parse(await fs.readTextFile(blobM(lin, 0))));
    pileT = E;
  } else {
    mouthT = C.GS.loadModel(JSON.parse(await fs.readTextFile(blobM(lin, g - 1))));
    pileT = C.GS.loadModel(JSON.parse(await fs.readTextFile(blobP(lin, g - 1))));
  }
  const L = C.genLines(mouthT, 10310 + lin * 100 + g * 10, 200);
  const uniq = C.uniqCount(L);
  if (uniq < 190) {
    const ab = { which, verdict: "ABORT", reason: "degenerate generator", uniq };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab;
  }
  const trainX = L.slice(0, 150), testX = L.slice(150);
  const tG = C.gradePile(pileT, L);
  if (tG.counts.some((c) => c === 200)) {
    const ab = { which, verdict: "ABORT", reason: "constant teacher pile", counts: tG.counts };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab;
  }
  const Smouth = C.makeMouth(10500 + lin * 100 + g);
  const mtr = await C.trainMouth(Smouth, trainX.map((x) => ({ x })), 800, 10600 + lin * 100 + g);
  if (mtr.halted) { const ab = { which, verdict: "ABORT", reason: mtr.halted }; await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab; }
  const Spile = C.T.makeModel(C.G.makeRng(10700 + lin * 100 + g), C.OPTS4);
  const t0 = Date.now();
  const ptr = await C.trainPile(Spile, pileT, trainX, 800, 10700 + lin * 100 + g + 5000);
  const pileWallMs = Date.now() - t0;
  if (!Number.isFinite(ptr.lastLoss)) { const ab = { which, verdict: "ABORT", reason: "pile non-finite" }; await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab; }
  const sG = C.gradePile(Spile, L);
  const fid = C.pairStats(tG.pred, sG.pred);
  const eG = C.gradePile(E, L);
  const eAgree = C.pairStats(eG.pred, tG.pred);
  await fs.writeTextFile("src/evidence/p4/expE-mouth-L" + lin + "g" + g + ".json", JSON.stringify(C.GS.saveModel(Smouth, C.OPTS19)));
  await fs.writeTextFile("src/evidence/p4/expE-pile-L" + lin + "g" + g + ".json", JSON.stringify(C.GS.saveModel(Spile, C.OPTS4)));
  const ledger = { which, spec: "expE-v2.2", lineage: lin, verdict: "COMPLETE",
    gen: { n: 200, uniq, unigramEnt: C.unigramEnt(L) },
    teacher: { pileCounts: tG.counts, pileEnt: C.pileEnt(tG.counts) },
    student: { mouthTrain: mtr, mouthTestLoss: C.mouthLoss(Smouth, testX),
      mouthTeacherTestLoss: C.mouthLoss(mouthT, testX),
      pileFirst: +ptr.firstLoss.toFixed(4), pileLast: +ptr.lastLoss.toFixed(4), pileWallMs,
      pileCounts: sG.counts, fidelity: fid },
    origin: { agreeVsE: C.pairStats(eG.pred, sG.pred), teacherVsE: eAgree,
      eCounts: eG.counts, eEnt: C.pileEnt(eG.counts) } };
  await fs.writeTextFile(ledgerPath, JSON.stringify(ledger));
  log(which + " done uniq=" + uniq + " uni=" + ledger.gen.unigramEnt + " fid=" + fid.delta + " origin=" + ledger.origin.agreeVsE.delta + " eEnt=" + ledger.origin.eEnt);
  return ledger;
};
