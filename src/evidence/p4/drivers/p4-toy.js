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

// ---- Path 1 (S-P4): structured-pool calibration (spec p4-structured-v10) ----
globalThis.runP4StructCal = async function (fs, log, steps) {
  const ledgerPath = "src/evidence/p4/s-cal-" + steps + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log("s-cal-" + steps + " exists, skip"); return prev; }
  } catch (e) {}
  const C = await globalThis.P4ExpEInit(fs);
  const poolA = C.structPool(12000, 1000);
  const poolB = C.structPool(12060, 400);
  const shortsA = poolA.filter((l) => l.x.length <= 20).length;
  if (shortsA !== 500 || poolA.length !== 1000 || poolB.length !== 400) {
    const ab = { steps, verdict: "ABORT", reason: "pool guard", shortsA };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab;
  }
  const E = await C.loadE();
  const eA = C.readLabels(E, poolA), eB = C.readLabels(E, poolB);
  const counts = [0, 0, 0, 0];
  for (const l of eA) counts[l]++;
  const ent = C.pileEnt(counts);
  if (!(counts.every((c) => c >= 50) && ent >= 1.0)) {
    const ab = { steps, spec: "p4-structured-v10", verdict: "COMPLETE", eSpread: { counts, ent }, gate: "E-REGIME-VOID",
      finding: "E labels collapse on structured lines; S-P4a loop does not run." };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ab));
    log("s-cal-" + steps + " E-REGIME-VOID counts=" + counts + " ent=" + ent); return ab;
  }
  const r1rng = C.G.makeRng(12040);
  const idxAll = poolA.map((_, i) => i);
  for (let i = idxAll.length - 1; i > 0; i--) { const j = r1rng.int(i + 1); const t = idxAll[i]; idxAll[i] = idxAll[j]; idxAll[j] = t; }
  const r1Idx = idxAll.slice(0, 500);
  const r1Lines = r1Idx.map((i) => poolA[i]);
  const t0 = Date.now();
  const model = C.T.makeModel(C.G.makeRng(12001), C.OPTS4);
  const cache = await C.GS.cacheTutor(E, r1Lines);
  const res = await C.GS.trainFaded({ model, tutor: E, train: r1Lines, tutorCache: cache, stages: [{ steps, attnKeep: 0, softW: 1.0, hardW: 0 }], seed: 12001 + 7000 });
  const wallMs = Date.now() - t0;
  const s1A = C.readLabels(model, r1Lines);
  const eR1 = r1Idx.map((i) => eA[i]);
  const trainObs = C.agree(eR1, s1A), trainPerm = C.permMean(eR1, s1A, C.G.makeRng(12050), 20);
  const s1B = C.readLabels(model, poolB);
  const freshObs = C.agree(eB, s1B), freshPerm = C.permMean(eB, s1B, C.G.makeRng(12070), 20);
  const gT = +((trainObs - trainPerm).toFixed(4)) >= 0.50 ? "PASS" : "FAIL";
  const gF = +((freshObs - freshPerm).toFixed(4)) >= 0.15 ? "PASS" : "FAIL";
  const ledger = { steps, spec: "p4-structured-v10", verdict: "COMPLETE", wallMs,
    eSpread: { counts, ent },
    train: { obs: +trainObs.toFixed(4), perm: +trainPerm.toFixed(4), agree: +(trainObs - trainPerm).toFixed(4) },
    freshB: { obs: +freshObs.toFixed(4), perm: +freshPerm.toFixed(4), delta: +(freshObs - freshPerm).toFixed(4) },
    firstLoss: +res.firstLoss.toFixed(4), lastLoss: +res.lastLoss.toFixed(4),
    gate: { trainAgree: gT, freshDelta: gF } };
  await fs.writeTextFile(ledgerPath, JSON.stringify(ledger));
  log("s-cal-" + steps + " done train=" + ledger.train.agree + " fresh=" + ledger.freshB.delta + " wall=" + Math.round(wallMs / 60000) + "min");
  return ledger;
};

// ---- Path 2 (D-P4): dialect-substrate curriculum (spec p4-dialect-v10) ----
// Seed map (12xxx block; disjoint from Exp-E 10300-11409, v1.0 102xx, S-P4 120xx):
// pools 12100/12110/12120, r1 students 12101+s, r1 mix rng 12105+s, held-out 12160,
// r2 fresh gen 12330+s / 12340+s / 12350+s, r2 draw rng 12361+s*10+arm,
// r2 students 12351+s*10+arm, S-gen 12391+s*30+arm*2+k, pile inits 12381+...,
// N2 tutor 12450 / pool 12455 / r1 12451 / r2true 12452 (+10 offsets for gen).
globalThis.runP4DialectPools = async function (fs, log) {
  const ledgerPath = "src/evidence/p4/d-pools.json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log("d-pools exists, skip"); return prev; }
  } catch (e) {}
  const C = await globalThis.P4ExpEInit(fs);
  const mL2 = C.GS.loadModel(JSON.parse(await fs.readTextFile("src/evidence/p4/expE-mouth-L2g9.json")));
  const mL5 = C.GS.loadModel(JSON.parse(await fs.readTextFile("src/evidence/p4/expE-mouth-L5g9.json")));
  const strong = C.genLines(mL2, 12100, 300);
  const detached = C.genLines(mL5, 12110, 300);
  const base = C.structPool(12120, 300).map((l) => l.x);
  function lag1(lines) {
    let same = 0, n = 0;
    for (const x of lines) for (let t = 1; t < x.length; t++) { n++; if (x[t] === x[t - 1]) same++; }
    return +(same / n).toFixed(4);
  }
  const stats = {
    strong: { uni: C.unigramEnt(strong), lag1: lag1(strong), uniq: C.uniqCount(strong) },
    detached: { uni: C.unigramEnt(detached), lag1: lag1(detached), uniq: C.uniqCount(detached) },
    base: { uni: C.unigramEnt(base), lag1: lag1(base), uniq: C.uniqCount(base) }
  };
  const sigOK = stats.strong.uni >= 2.5 && stats.strong.uni <= 2.75 && stats.strong.lag1 >= 0.40 && stats.detached.lag1 <= 0.20;
  await fs.writeTextFile("src/evidence/p4/d-pool-strong.json", JSON.stringify(strong));
  await fs.writeTextFile("src/evidence/p4/d-pool-detached.json", JSON.stringify(detached));
  await fs.writeTextFile("src/evidence/p4/d-pool-base.json", JSON.stringify(base));
  const ledger = { spec: "p4-dialect-v10", verdict: "COMPLETE", stats, sig: sigOK ? "PASS" : "FAIL" };
  await fs.writeTextFile(ledgerPath, JSON.stringify(ledger));
  log("d-pools done " + JSON.stringify(stats));
  return ledger;
};

globalThis.runP4DialectR1 = async function (fs, log, s) {
  const ledgerPath = "src/evidence/p4/d-r1-s" + s + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log("d-r1-s" + s + " exists, skip"); return prev; }
  } catch (e) {}
  const C = await globalThis.P4ExpEInit(fs);
  const strong = JSON.parse(await fs.readTextFile("src/evidence/p4/d-pool-strong.json"));
  const detached = JSON.parse(await fs.readTextFile("src/evidence/p4/d-pool-detached.json"));
  const base = JSON.parse(await fs.readTextFile("src/evidence/p4/d-pool-base.json"));
  const tutor = C.GS.loadModel(JSON.parse(await fs.readTextFile("src/evidence/p4/expE-mouth-L2g9.json")));
  const rng = C.G.makeRng(12105 + s);
  function pick100(pool, p) {
    const idx = pool.map((_, i) => i);
    for (let i = idx.length - 1; i > 0; i--) { const j = rng.int(i + 1); const t = idx[i]; idx[i] = idx[j]; idx[j] = t; }
    return idx.slice(0, 100).map((i) => ({ x: pool[i], p }));
  }
  const mix = [].concat(pick100(strong, 0), pick100(detached, 1), pick100(base, 2));
  const studentSeed = 12101 + s;
  const S1 = C.makeMouth(studentSeed);
  const t0 = Date.now();
  const mtr = await C.trainMouth(S1, mix.map((l) => ({ x: l.x })), 800, studentSeed + 5000);
  const wallMs = Date.now() - t0;
  if (mtr.halted) {
    const ab = { spec: "p4-dialect-v10", seed: s, verdict: "ABORT", reason: mtr.halted };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab;
  }
  const cells = [];
  for (let p = 0; p < 3; p++) for (let b = 0; b < 2; b++) {
    const ls = mix.filter((l) => l.p === p && (l.x.length <= 20 ? 0 : 1) === b).map((l) => l.x);
    const sl = C.mouthLoss(S1, ls), tl = C.mouthLoss(tutor, ls);
    cells.push({ p, b, n: ls.length, stud: sl, tut: tl, gap: +(sl - tl).toFixed(4) });
  }
  const gaps = cells.map((c) => c.gap);
  const gate = (Math.max.apply(null, gaps) - Math.min.apply(null, gaps)) >= 0.20 ? "PASS" : "UNINFORMATIVE";
  await fs.writeTextFile("src/evidence/p4/d-s1mouth-s" + s + ".json", JSON.stringify(C.GS.saveModel(S1, C.OPTS19)));
  const ledger = { spec: "p4-dialect-v10", seed: s, studentSeed, mixRng: 12105 + s, verdict: "COMPLETE",
    mtr: { firstLoss: mtr.firstLoss, lastLoss: mtr.lastLoss }, wallMs, cells, gate };
  await fs.writeTextFile(ledgerPath, JSON.stringify(ledger));
  log("d-r1-s" + s + " done gaps=" + gaps.join(",") + " gate=" + gate + " wall=" + Math.round(wallMs / 60000) + "min");
  return ledger;
};

globalThis.runP4DialectR2 = async function (fs, log, s, arm) {
  const names = ["true", "unif", "shuf"];
  const ledgerPath = "src/evidence/p4/d-r2-" + names[arm] + "-s" + s + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log("d-r2-" + names[arm] + "-s" + s + " exists, skip"); return prev; }
  } catch (e) {}
  const C = await globalThis.P4ExpEInit(fs);
  const r1 = JSON.parse(await fs.readTextFile("src/evidence/p4/d-r1-s" + s + ".json"));
  if (r1.verdict !== "COMPLETE" || r1.gate !== "PASS") {
    const ab = { spec: "p4-dialect-v10", seed: s, arm: names[arm], verdict: "ABORT", reason: "r1 gate " + r1.gate };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab;
  }
  const gaps = r1.cells.map((c) => c.gap);
  function transform(g) {
    const raw = g.map((x) => Math.max(0, x - 0.30) + 0.05);
    const sm = raw.reduce((a, b) => a + b, 0);
    return raw.map((x) => x / sm);
  }
  let w;
  if (arm === 1) w = [1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6];
  else {
    const g = gaps.slice();
    if (arm === 2) {
      const srng = C.G.makeRng(12401 + s);
      for (let i = g.length - 1; i > 0; i--) { const j = srng.int(i + 1); const t = g[i]; g[i] = g[j]; g[j] = t; }
    }
    w = transform(g);
  }
  // Fresh lines: same fresh pool per s across arms (arms differ only in w + draw rng).
  // NOTE seed remap vs spec (12130/40/50 -> 12330/40/50 +s): avoids N2/C0 collision; disjointness preserved.
  const mL2 = C.GS.loadModel(JSON.parse(await fs.readTextFile("src/evidence/p4/expE-mouth-L2g9.json")));
  const mL5 = C.GS.loadModel(JSON.parse(await fs.readTextFile("src/evidence/p4/expE-mouth-L5g9.json")));
  const fresh = [C.genLines(mL2, 12330 + s, 300), C.genLines(mL5, 12340 + s, 300),
    C.structPool(12350 + s, 300).map((l) => l.x)];
  const byCell = [];
  for (let p = 0; p < 3; p++) for (let b = 0; b < 2; b++)
    byCell.push(fresh[p].filter((x) => (x.length <= 20 ? 0 : 1) === b));
  const drng = C.G.makeRng(12361 + s * 10 + arm);
  const cum = []; let acc = 0;
  for (const x of w) { acc += x; cum.push(acc); }
  const lines = [];
  for (let k = 0; k < 300; k++) {
    const u = drng.uniform(0, 1);
    let c = 0; while (c < 5 && u > cum[c]) c++;
    const cell = byCell[c];
    lines.push({ x: cell[drng.int(cell.length)], p: Math.floor(c / 2) });
  }
  const cc = [0, 0, 0, 0, 0, 0];
  for (const l of lines) cc[l.p * 2 + (l.x.length <= 20 ? 0 : 1)]++;
  const stSeed = 12351 + s * 10 + arm;
  const S2 = C.makeMouth(stSeed);
  const t0 = Date.now();
  const mtr = await C.trainMouth(S2, lines.map((l) => ({ x: l.x })), 800, stSeed + 5000);
  const wallMs = Date.now() - t0;
  if (mtr.halted) {
    const ab = { spec: "p4-dialect-v10", seed: s, arm: names[arm], verdict: "ABORT", reason: mtr.halted };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab;
  }
  // Held-out: fresh D-strong (never trained on), same all arms/seeds
  const held = C.genLines(mL2, 12160, 200);
  const S1 = C.GS.loadModel(JSON.parse(await fs.readTextFile("src/evidence/p4/d-s1mouth-s" + s + ".json")));
  const lS2 = C.mouthLoss(S2, held), lS1 = C.mouthLoss(S1, held);
  // Pile margin: distill Tpile on S2-gen + S1-gen lines (Exp-E fidelity/origin semantics)
  const Tpile = C.GS.loadModel(JSON.parse(await fs.readTextFile("src/evidence/p4/expE-pile-L2g9.json")));
  const g2 = C.genLines(S2, 12391 + s * 30 + arm * 2 + 0, 200);
  const g1 = C.genLines(S1, 12391 + s * 30 + arm * 2 + 1, 200);
  const P2 = C.T.makeModel(C.G.makeRng(12381 + s * 30 + arm * 2 + 0), C.OPTS4);
  const P1 = C.T.makeModel(C.G.makeRng(12381 + s * 30 + arm * 2 + 1), C.OPTS4);
  const p2r = await C.trainPile(P2, Tpile, g2, 800, 12411 + s * 30 + arm * 2 + 0);
  const p1r = await C.trainPile(P1, Tpile, g1, 800, 12411 + s * 30 + arm * 2 + 1);
  if (!Number.isFinite(p2r.lastLoss) || !Number.isFinite(p1r.lastLoss)) {
    const ab = { spec: "p4-dialect-v10", seed: s, arm: names[arm], verdict: "ABORT", reason: "pile non-finite" };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab;
  }
  const tG = C.gradePile(Tpile, held);
  const a2T = C.pairStats(tG.pred, C.gradePile(P2, held).pred).obs;
  const a21 = C.pairStats(C.gradePile(P1, held).pred, C.gradePile(P2, held).pred).obs;
  const margin = +(a2T - a21).toFixed(4);
  // Operator (loss world: mass on above-median-gap cells)
  const sorted = gaps.slice().sort((a, b) => a - b), med = sorted[3];
  const above = gaps.map((g, i) => (g >= med ? i : -1)).filter((i) => i >= 0);
  function massOn(ww, cells) { let sm = 0; for (const c of cells) sm += ww[c]; return sm; }
  const mT = massOn(w, above.length ? above : [0]);
  const wShufArm = transform(gaps.slice().reverse());
  let ge = 0;
  for (let p = 0; p < 20; p++) {
    const prng = C.G.makeRng(12421 + s * 20 + p);
    const pd = gaps.slice();
    for (let i = pd.length - 1; i > 0; i--) { const j = prng.int(i + 1); const t = pd[i]; pd[i] = pd[j]; pd[j] = t; }
    if (massOn(transform(pd), above.length ? above : [0]) >= mT) ge++;
  }
  const pOp = ge / 20;
  const ledger = { spec: "p4-dialect-v10", seed: s, arm: names[arm], verdict: "COMPLETE",
    w: w.map((x) => +x.toFixed(4)), cellCounts: cc,
    mtr: { firstLoss: mtr.firstLoss, lastLoss: mtr.lastLoss }, wallMs,
    held: { s2loss: lS2, s1loss: lS1, lossGain: +(lS1 - lS2).toFixed(4) },
    pile: { a2T: +a2T.toFixed(4), a21: +a21.toFixed(4), margin,
      verdict: margin >= 0.10 ? "PASS" : (margin <= -0.10 ? "CAVE" : "INCONCLUSIVE") },
    operator: { massTrue: +mT.toFixed(4), p: +pOp.toFixed(3), pass: pOp < 0.05 ? "PASS" : "FAIL" } };
  await fs.writeTextFile(ledgerPath, JSON.stringify(ledger));
  log("d-r2-" + names[arm] + "-s" + s + " done gain=" + ledger.held.lossGain + " margin=" + margin + " op=" + ledger.operator.pass);
  return ledger;
};

// N2-system: same harness x different tutor (fresh structured-trained mouth).
// Attribution on the common metric (held-out D-strong mouth-loss gain) — N2 has
// no pile, so no pile margin here; filed openly.
globalThis.runP4DialectN2 = async function (fs, log) {
  const ledgerPath = "src/evidence/p4/d-n2.json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log("d-n2 exists, skip"); return prev; }
  } catch (e) {}
  const C = await globalThis.P4ExpEInit(fs);
  const strong = JSON.parse(await fs.readTextFile("src/evidence/p4/d-pool-strong.json"));
  const detached = JSON.parse(await fs.readTextFile("src/evidence/p4/d-pool-detached.json"));
  const base = JSON.parse(await fs.readTextFile("src/evidence/p4/d-pool-base.json"));
  // N2 tutor: fresh mouth, structured pool only (never sees dialects)
  const n2pool = C.structPool(12455, 300).map((l) => l.x);
  const N2 = C.makeMouth(12450);
  const t0 = Date.now();
  const n2tr = await C.trainMouth(N2, n2pool.map((x) => ({ x })), 800, 17450);
  if (n2tr.halted) {
    const ab = { spec: "p4-dialect-v10", arm: "n2", verdict: "ABORT", reason: n2tr.halted };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab;
  }
  await fs.writeTextFile("src/evidence/p4/d-n2mouth.json", JSON.stringify(C.GS.saveModel(N2, C.OPTS19)));
  const rng = C.G.makeRng(12405);
  function pick100(pool, p) {
    const idx = pool.map((_, i) => i);
    for (let i = idx.length - 1; i > 0; i--) { const j = rng.int(i + 1); const t = idx[i]; idx[i] = idx[j]; idx[j] = t; }
    return idx.slice(0, 100).map((i) => ({ x: pool[i], p }));
  }
  const mix = [].concat(pick100(strong, 0), pick100(detached, 1), pick100(base, 2));
  const S1 = C.makeMouth(12451);
  const r1tr = await C.trainMouth(S1, mix.map((l) => ({ x: l.x })), 800, 17451);
  if (r1tr.halted) {
    const ab = { spec: "p4-dialect-v10", arm: "n2", verdict: "ABORT", reason: r1tr.halted };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab;
  }
  const cells = [];
  for (let p = 0; p < 3; p++) for (let b = 0; b < 2; b++) {
    const ls = mix.filter((l) => l.p === p && (l.x.length <= 20 ? 0 : 1) === b).map((l) => l.x);
    const sl = C.mouthLoss(S1, ls), tl = C.mouthLoss(N2, ls);
    cells.push({ p, b, n: ls.length, stud: sl, tut: tl, gap: +(sl - tl).toFixed(4) });
  }
  const gaps = cells.map((c) => c.gap);
  function transform(g) {
    const raw = g.map((x) => Math.max(0, x - 0.30) + 0.05);
    const sm = raw.reduce((a, b) => a + b, 0);
    return raw.map((x) => x / sm);
  }
  const w = transform(gaps);
  const mL2 = C.GS.loadModel(JSON.parse(await fs.readTextFile("src/evidence/p4/expE-mouth-L2g9.json")));
  const mL5 = C.GS.loadModel(JSON.parse(await fs.readTextFile("src/evidence/p4/expE-mouth-L5g9.json")));
  const fresh = [C.genLines(mL2, 12432, 300), C.genLines(mL5, 12442, 300),
    C.structPool(12452, 300).map((l) => l.x)];
  const byCell = [];
  for (let p = 0; p < 3; p++) for (let b = 0; b < 2; b++)
    byCell.push(fresh[p].filter((x) => (x.length <= 20 ? 0 : 1) === b));
  const drng = C.G.makeRng(12462);
  const cum = []; let acc = 0;
  for (const x of w) { acc += x; cum.push(acc); }
  const lines = [];
  for (let k = 0; k < 300; k++) {
    const u = drng.uniform(0, 1);
    let c = 0; while (c < 5 && u > cum[c]) c++;
    const cell = byCell[c];
    lines.push({ x: cell[drng.int(cell.length)] });
  }
  const S2 = C.makeMouth(12453);
  const r2tr = await C.trainMouth(S2, lines.map((l) => ({ x: l.x })), 800, 17453);
  if (r2tr.halted) {
    const ab = { spec: "p4-dialect-v10", arm: "n2", verdict: "ABORT", reason: r2tr.halted };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab;
  }
  const held = C.genLines(mL2, 12160, 200);
  const lS2 = C.mouthLoss(S2, held), lS1 = C.mouthLoss(S1, held);
  const wallMs = Date.now() - t0;
  const ledger = { spec: "p4-dialect-v10", arm: "n2-true-only", verdict: "COMPLETE", wallMs,
    n2tutor: { firstLoss: n2tr.firstLoss, lastLoss: n2tr.lastLoss },
    r1: { firstLoss: r1tr.firstLoss, lastLoss: r1tr.lastLoss, cells, gaps },
    r2: { firstLoss: r2tr.firstLoss, lastLoss: r2tr.lastLoss },
    held: { s2loss: lS2, s1loss: lS1, lossGain: +(lS1 - lS2).toFixed(4) } };
  await fs.writeTextFile(ledgerPath, JSON.stringify(ledger));
  log("d-n2 done gain=" + ledger.held.lossGain + " gaps=" + gaps.join(","));
  return ledger;
};

// ---- Path 3 (C0-hetero): competent-tutor upper bound (spec p4-c0hetero-v10) ----
// Seed map: pools 12200 (r1) / 12210+s (r2 fresh, same per s across arms) /
// 12220 (held-out, common) / 12229 (weak r2 fresh); students 12201+s (r1),
// 12251+s*10+arm (r2); weak students 12401/12402. Oracle = closed-form truth.
globalThis.P4HeteroHelpers = async function (fs) {
  const C = await globalThis.P4ExpEInit(fs);
  const VOC = 19, LN19 = Math.log(19);
  function heteroPool(seed, n) {
    const rng = C.G.makeRng(seed), tiers = [0.1, 0.35, 0.7], out = [];
    for (let i = 0; i < n; i++) {
      const len = i < n / 2 ? [10, 15, 20][rng.int(3)] : 50;
      const p = tiers[i % 3];
      const x = new Array(len);
      x[0] = rng.int(VOC);
      for (let t = 1; t < len; t++) x[t] = rng.uniform(0, 1) < p ? x[t - 1] : rng.int(VOC);
      out.push({ x, tier: i % 3, p });
    }
    // shuffle order (tier counts preserved 100/100/100 at n=300)
    for (let i = out.length - 1; i > 0; i--) { const j = rng.int(i + 1); const t = out[i]; out[i] = out[j]; out[j] = t; }
    return out;
  }
  function oracleFloor(line, p) {
    const x = line.x !== undefined ? line.x : line;
    let s = LN19; // position 0: uniform prefix, NLL = ln 19
    for (let t = 1; t < x.length; t++) {
      const q = (x[t] === x[t - 1]) ? p + (1 - p) / VOC : (1 - p) / VOC;
      s += -Math.log(q);
    }
    return s / x.length;
  }
  function cellsOf(lines, lossFn) {
    // lines: [{x, tier}]; lossFn(x) -> loss; returns 6 cells tier x band
    const cells = [];
    for (let tr = 0; tr < 3; tr++) for (let b = 0; b < 2; b++) {
      const ls = lines.filter((l) => l.tier === tr && (l.x.length <= 20 ? 0 : 1) === b);
      let sl = 0, ol = 0;
      for (const l of ls) { sl += lossFn(l.x); ol += oracleFloor(l.x, l.p); }
      sl /= ls.length; ol /= ls.length;
      cells.push({ tier: tr, p: [0.1, 0.35, 0.7][tr], b, n: ls.length,
        stud: +sl.toFixed(4), floor: +ol.toFixed(4), gap: +((sl - ol).toFixed(4)) });
    }
    return cells;
  }
  function transform(g) {
    const raw = g.map((x) => Math.max(0, x - 0.20) + 0.05);
    const sm = raw.reduce((a, b) => a + b, 0);
    return raw.map((x) => x / sm);
  }
  return Object.assign({}, C, { heteroPool, oracleFloor, cellsOf, transform });
};

globalThis.runP4HeteroR1 = async function (fs, log, s) {
  const ledgerPath = "src/evidence/p4/c-r1-s" + s + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log("c-r1-s" + s + " exists, skip"); return prev; }
  } catch (e) {}
  const C = await globalThis.P4HeteroHelpers(fs);
  const pool = C.heteroPool(12200, 300);
  const held = C.heteroPool(12220, 200);
  const studentSeed = 12201 + s;
  const S1 = C.makeMouth(studentSeed);
  const t0 = Date.now();
  const mtr = await C.trainMouth(S1, pool.map((l) => ({ x: l.x })), 800, studentSeed + 5000);
  const wallMs = Date.now() - t0;
  if (mtr.halted) {
    const ab = { spec: "p4-c0hetero-v10", seed: s, verdict: "ABORT", reason: mtr.halted };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab;
  }
  const cells = C.cellsOf(pool, (x) => C.mouthLoss(S1, [x]));
  const easy = cells.filter((c) => c.tier === 2).map((c) => c.stud);
  const easyMax = Math.max.apply(null, easy);
  const s1held = C.mouthLoss(S1, held.map((l) => l.x));
  const ledger = { spec: "p4-c0hetero-v10", seed: s, studentSeed, poolSeed: 12200, heldSeed: 12220,
    verdict: "COMPLETE", mtr: { firstLoss: mtr.firstLoss, lastLoss: mtr.lastLoss }, wallMs,
    cells, easyTierMax: easyMax, learnGuard: easyMax <= 2.0 ? "PASS" : "RECIPE-WEAK", s1held };
  await fs.writeTextFile(ledgerPath, JSON.stringify(ledger));
  const gaps = cells.map((c) => c.gap);
  log("c-r1-s" + s + " done gaps=" + gaps.join(",") + " guard=" + ledger.learnGuard + " s1held=" + s1held);
  return ledger;
};

globalThis.runP4HeteroR2 = async function (fs, log, s, arm) {
  const names = ["true", "unif", "shuf"];
  const ledgerPath = "src/evidence/p4/c-r2-" + names[arm] + "-s" + s + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log("c-r2-" + names[arm] + "-s" + s + " exists, skip"); return prev; }
  } catch (e) {}
  const C = await globalThis.P4HeteroHelpers(fs);
  const r1 = JSON.parse(await fs.readTextFile("src/evidence/p4/c-r1b-s" + s + ".json"));
  if (r1.verdict !== "COMPLETE" || r1.learnGuard !== "PASS") {
    const ab = { spec: "p4-c0hetero-v10", seed: s, arm: names[arm], verdict: "ABORT", reason: "r1 guard " + r1.learnGuard };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab;
  }
  const gaps = r1.cells.map((c) => c.gap);
  let w;
  if (arm === 1) w = [1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6];
  else {
    const g = gaps.slice();
    if (arm === 2) {
      const srng = C.G.makeRng(12231 + s);
      for (let i = g.length - 1; i > 0; i--) { const j = srng.int(i + 1); const t = g[i]; g[i] = g[j]; g[j] = t; }
    }
    w = C.transform(g);
  }
  // Same fresh pool per s across arms (arms differ only in w + draw rng)
  const pool = C.heteroPool(12210 + s, 300);
  const byCell = [];
  for (let tr = 0; tr < 3; tr++) for (let b = 0; b < 2; b++)
    byCell.push(pool.filter((l) => l.tier === tr && (l.x.length <= 20 ? 0 : 1) === b));
  const drng = C.G.makeRng(12241 + s * 10 + arm);
  const cum = []; let acc = 0;
  for (const x of w) { acc += x; cum.push(acc); }
  const lines = [];
  for (let k = 0; k < 300; k++) {
    const u = drng.uniform(0, 1);
    let c = 0; while (c < 5 && u > cum[c]) c++;
    const cell = byCell[c];
    lines.push(cell[drng.int(cell.length)]);
  }
  const stSeed = 12251 + s * 10 + arm;
  const S2 = C.makeMouth(stSeed);
  const t0 = Date.now();
  const mtr = await C.trainMouth(S2, lines.map((l) => ({ x: l.x })), 800, stSeed + 5000);
  const wallMs = Date.now() - t0;
  if (mtr.halted) {
    const ab = { spec: "p4-c0hetero-v10", seed: s, arm: names[arm], verdict: "ABORT", reason: mtr.halted };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab;
  }
  const held = C.heteroPool(12220, 200);
  const s2held = C.mouthLoss(S2, held.map((l) => l.x));
  const gain = +(r1.s1held - s2held).toFixed(4);
  const sorted = gaps.slice().sort((a, b) => a - b), med = sorted[3];
  const above = gaps.map((g, i) => (g >= med ? i : -1)).filter((i) => i >= 0);
  function massOn(ww, cells) { let sm = 0; for (const c of cells) sm += ww[c]; return sm; }
  const mT = massOn(w, above.length ? above : [0]);
  let ge = 0;
  for (let p = 0; p < 20; p++) {
    const prng = C.G.makeRng(12261 + s * 20 + p);
    const pd = gaps.slice();
    for (let i = pd.length - 1; i > 0; i--) { const j = prng.int(i + 1); const t = pd[i]; pd[i] = pd[j]; pd[j] = t; }
    if (massOn(C.transform(pd), above.length ? above : [0]) >= mT) ge++;
  }
  const pOp = ge / 20;
  const ledger = { spec: "p4-c0hetero-v10", seed: s, arm: names[arm], verdict: "COMPLETE",
    w: w.map((x) => +x.toFixed(4)), mtr: { firstLoss: mtr.firstLoss, lastLoss: mtr.lastLoss }, wallMs,
    held: { s2held, s1held: r1.s1held, gain,
      verdict: gain >= 0.15 ? "PASS" : (gain >= 0.075 ? "MARGINAL" : "FAIL") } ,
    operator: { massTrue: +mT.toFixed(4), p: +pOp.toFixed(3), pass: pOp < 0.05 ? "PASS" : "FAIL" } };
  await fs.writeTextFile(ledgerPath, JSON.stringify(ledger));
  log("c-r2-" + names[arm] + "-s" + s + " done gain=" + gain + " op=" + ledger.operator.pass);
  return ledger;
};

// Weak-tutor system: same harness x L5g9 detached mouth as reference (carrier-competence contrast).
globalThis.runP4HeteroWeak = async function (fs, log) {
  const ledgerPath = "src/evidence/p4/c-weak.json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log("c-weak exists, skip"); return prev; }
  } catch (e) {}
  const C = await globalThis.P4HeteroHelpers(fs);
  const pool = C.heteroPool(12200, 300);
  const held = C.heteroPool(12220, 200);
  const L5 = C.GS.loadModel(JSON.parse(await fs.readTextFile("src/evidence/p4/expE-mouth-L5g9.json")));
  const S1 = C.makeMouth(12401);
  const t0 = Date.now();
  const r1tr = await C.trainMouth(S1, pool.map((l) => ({ x: l.x })), 800, 17401);
  if (r1tr.halted) {
    const ab = { spec: "p4-c0hetero-v10", arm: "weak", verdict: "ABORT", reason: r1tr.halted };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab;
  }
  const cells = [];
  for (let tr = 0; tr < 3; tr++) for (let b = 0; b < 2; b++) {
    const ls = pool.filter((l) => l.tier === tr && (l.x.length <= 20 ? 0 : 1) === b).map((l) => l.x);
    const sl = C.mouthLoss(S1, ls), tl = C.mouthLoss(L5, ls);
    cells.push({ tier: tr, b, n: ls.length, stud: sl, tut: tl, gap: +(sl - tl).toFixed(4) });
  }
  const gaps = cells.map((c) => c.gap);
  const w = C.transform(gaps);
  const pool2 = C.heteroPool(12229, 300);
  const byCell = [];
  for (let tr = 0; tr < 3; tr++) for (let b = 0; b < 2; b++)
    byCell.push(pool2.filter((l) => l.tier === tr && (l.x.length <= 20 ? 0 : 1) === b));
  const drng = C.G.makeRng(12239);
  const cum = []; let acc = 0;
  for (const x of w) { acc += x; cum.push(acc); }
  const lines = [];
  for (let k = 0; k < 300; k++) {
    const u = drng.uniform(0, 1);
    let c = 0; while (c < 5 && u > cum[c]) c++;
    const cell = byCell[c];
    lines.push(cell[drng.int(cell.length)]);
  }
  const S2 = C.makeMouth(12402);
  const r2tr = await C.trainMouth(S2, lines.map((l) => ({ x: l.x })), 800, 17402);
  if (r2tr.halted) {
    const ab = { spec: "p4-c0hetero-v10", arm: "weak", verdict: "ABORT", reason: r2tr.halted };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab;
  }
  const s1held = C.mouthLoss(S1, held.map((l) => l.x));
  const s2held = C.mouthLoss(S2, held.map((l) => l.x));
  const wallMs = Date.now() - t0;
  const ledger = { spec: "p4-c0hetero-v10", arm: "weak-L5-true-only", verdict: "COMPLETE", wallMs,
    r1: { firstLoss: r1tr.firstLoss, lastLoss: r1tr.lastLoss, gaps },
    r2: { firstLoss: r2tr.firstLoss, lastLoss: r2tr.lastLoss },
    held: { s2held, s1held, gain: +(s1held - s2held).toFixed(4) } };
  await fs.writeTextFile(ledgerPath, JSON.stringify(ledger));
  log("c-weak done gain=" + ledger.held.gain + " gaps=" + gaps.join(","));
  return ledger;
};

// Diagnostic: is the C0 round-2 drop a pool-difficulty effect or a draw-duplication
// effect? (1) S1-fixed-model loss across pools (equal => pools equal difficulty);
// (2) recompute r2 draw uniqueness for s0 arms (analytic E[unique] ~= 190/300).
globalThis.runP4HeteroDiag = async function (fs, log) {
  const ledgerPath = "src/evidence/p4/c-diag.json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log("c-diag exists, skip"); return prev; }
  } catch (e) {}
  const C = await globalThis.P4HeteroHelpers(fs);
  const S1 = C.GS.loadModel(JSON.parse(await fs.readTextFile("src/evidence/p4/c-s1mouth-s0.json")));
  const poolLoss = {};
  for (const ps of [12200, 12210, 12211, 12212, 12229, 12220]) {
    const p = C.heteroPool(ps, 300);
    poolLoss[ps] = C.mouthLoss(S1, p.map((l) => l.x));
  }
  const r1b = JSON.parse(await fs.readTextFile("src/evidence/p4/c-r1b-s0.json"));
  const gaps = r1b.cells.map((c) => c.gap);
  const pool = C.heteroPool(12210, 300);
  const byCell = [];
  for (let tr = 0; tr < 3; tr++) for (let b = 0; b < 2; b++)
    byCell.push(pool.filter((l) => l.tier === tr && (l.x.length <= 20 ? 0 : 1) === b).map((l) => l.x.join(",")));
  const uniq = {};
  const ws = { 0: C.transform(gaps), 1: [1/6,1/6,1/6,1/6,1/6,1/6,1/6,1/6].slice(0, 6),
    2: C.transform(gaps.slice().reverse()) };
  // note: arm2 uses shuffled gaps; recompute exactly as runP4HeteroR2 with srng 12231
  const g2 = gaps.slice(), srng = C.G.makeRng(12231);
  for (let i = g2.length - 1; i > 0; i--) { const j = srng.int(i + 1); const t = g2[i]; g2[i] = g2[j]; g2[j] = t; }
  ws[2] = C.transform(g2);
  for (const arm of [0, 1, 2]) {
    const w = ws[arm], drng = C.G.makeRng(12241 + 0 * 10 + arm);
    const cum = []; let acc = 0;
    for (const x of w) { acc += x; cum.push(acc); }
    const seen = new Set();
    for (let k = 0; k < 300; k++) {
      const u = drng.uniform(0, 1);
      let c = 0; while (c < 5 && u > cum[c]) c++;
      const cell = byCell[c];
      seen.add(c + ":" + cell[drng.int(cell.length)]);
    }
    uniq["arm" + arm] = seen.size;
  }
  const ledger = { spec: "p4-c0hetero-v11-diag", verdict: "COMPLETE", poolLoss, drawUnique300: uniq };
  await fs.writeTextFile(ledgerPath, JSON.stringify(ledger));
  log("c-diag done pools=" + JSON.stringify(poolLoss) + " uniq=" + JSON.stringify(uniq));
  return ledger;
};

// v1.2 implementation fix (spec v1.1 unchanged): r2 pools n=600 (100/cell) +
// weighted draw WITHOUT replacement (sequential renormalize over non-empty cells).
// New ledgers c2-*; r1b scores/weights stand.
globalThis.runP4HeteroR2b = async function (fs, log, s, arm) {
  const names = ["true", "unif", "shuf"];
  const ledgerPath = "src/evidence/p4/c2-r2-" + names[arm] + "-s" + s + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log("c2-r2-" + names[arm] + "-s" + s + " exists, skip"); return prev; }
  } catch (e) {}
  const C = await globalThis.P4HeteroHelpers(fs);
  const r1 = JSON.parse(await fs.readTextFile("src/evidence/p4/c-r1b-s" + s + ".json"));
  if (r1.verdict !== "COMPLETE" || r1.learnGuard !== "PASS") {
    const ab = { spec: "p4-c0hetero-v11", seed: s, arm: names[arm], verdict: "ABORT", reason: "r1b guard " + r1.learnGuard };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab;
  }
  const gaps = r1.cells.map((c) => c.gap);
  let w;
  if (arm === 1) w = [1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6];
  else {
    const g = gaps.slice();
    if (arm === 2) {
      const srng = C.G.makeRng(12231 + s);
      for (let i = g.length - 1; i > 0; i--) { const j = srng.int(i + 1); const t = g[i]; g[i] = g[j]; g[j] = t; }
    }
    w = C.transform(g);
  }
  const pool = C.heteroPool(12210 + s, 600);
  const byCell = [];
  for (let tr = 0; tr < 3; tr++) for (let b = 0; b < 2; b++)
    byCell.push(pool.filter((l) => l.tier === tr && (l.x.length <= 20 ? 0 : 1) === b));
  const rrng = C.G.makeRng(12241 + s * 10 + arm);
  const lines = [], cc = [0, 0, 0, 0, 0, 0];
  for (let k = 0; k < 300; k++) {
    const rw = w.map((x, c) => (byCell[c].length ? x : 0));
    let sm = 0; for (const x of rw) sm += x;
    const u = rrng.uniform(0, 1) * sm;
    let c = 0, a2 = 0;
    while (c < 5 && a2 + rw[c] < u) { a2 += rw[c]; c++; }
    while (!byCell[c].length) c = (c + 1) % 6;
    const cell = byCell[c];
    lines.push(cell.splice(rrng.int(cell.length), 1)[0]);
    cc[c]++;
  }
  const stSeed = 12271 + s * 10 + arm;
  const S2 = C.makeMouth(stSeed);
  const t0 = Date.now();
  const mtr = await C.trainMouth(S2, lines.map((l) => ({ x: l.x })), 800, stSeed + 5000);
  const wallMs = Date.now() - t0;
  if (mtr.halted) {
    const ab = { spec: "p4-c0hetero-v11", seed: s, arm: names[arm], verdict: "ABORT", reason: mtr.halted };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab;
  }
  const held = C.heteroPool(12220, 200);
  const s2held = C.mouthLoss(S2, held.map((l) => l.x));
  const gain = +(r1.s1held - s2held).toFixed(4);
  const sorted = gaps.slice().sort((a, b) => a - b), med = sorted[3];
  const above = gaps.map((g, i) => (g >= med ? i : -1)).filter((i) => i >= 0);
  function massOn(ww, cells) { let sm = 0; for (const c of cells) sm += ww[c]; return sm; }
  const mT = massOn(w, above.length ? above : [0]);
  let ge = 0;
  for (let p = 0; p < 20; p++) {
    const prng = C.G.makeRng(12261 + s * 20 + p);
    const pd = gaps.slice();
    for (let i = pd.length - 1; i > 0; i--) { const j = prng.int(i + 1); const t = pd[i]; pd[i] = pd[j]; pd[j] = t; }
    if (massOn(C.transform(pd), above.length ? above : [0]) >= mT) ge++;
  }
  const pOp = ge / 20;
  const ledger = { spec: "p4-c0hetero-v11", impl: "v1.2 no-replacement draw, pool n=600", seed: s, arm: names[arm],
    verdict: "COMPLETE", w: w.map((x) => +x.toFixed(4)), cellCounts: cc,
    mtr: { firstLoss: mtr.firstLoss, lastLoss: mtr.lastLoss }, wallMs,
    held: { s2held, s1held: r1.s1held, gain,
      verdict: gain >= 0.15 ? "PASS" : (gain >= 0.075 ? "MARGINAL" : "FAIL") },
    operator: { massTrue: +mT.toFixed(4), p: +pOp.toFixed(3), pass: pOp < 0.05 ? "PASS" : "FAIL" } };
  await fs.writeTextFile(ledgerPath, JSON.stringify(ledger));
  log("c2-r2-" + names[arm] + "-s" + s + " done gain=" + gain + " op=" + ledger.operator.pass);
  return ledger;
};

globalThis.runP4HeteroWeakB = async function (fs, log) {
  const ledgerPath = "src/evidence/p4/c2-weak.json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log("c2-weak exists, skip"); return prev; }
  } catch (e) {}
  const C = await globalThis.P4HeteroHelpers(fs);
  const weak1 = JSON.parse(await fs.readTextFile("src/evidence/p4/c-weak.json"));
  const gaps = weak1.r1.gaps, s1held = weak1.held.s1held;
  const w = C.transform(gaps);
  const pool2 = C.heteroPool(12229, 600);
  const byCell = [];
  for (let tr = 0; tr < 3; tr++) for (let b = 0; b < 2; b++)
    byCell.push(pool2.filter((l) => l.tier === tr && (l.x.length <= 20 ? 0 : 1) === b));
  const rrng = C.G.makeRng(12239);
  const lines = [];
  for (let k = 0; k < 300; k++) {
    const rw = w.map((x, c) => (byCell[c].length ? x : 0));
    let sm = 0; for (const x of rw) sm += x;
    const u = rrng.uniform(0, 1) * sm;
    let c = 0, a2 = 0;
    while (c < 5 && a2 + rw[c] < u) { a2 += rw[c]; c++; }
    while (!byCell[c].length) c = (c + 1) % 6;
    const cell = byCell[c];
    lines.push(cell.splice(rrng.int(cell.length), 1)[0]);
  }
  const S2 = C.makeMouth(12412);
  const t0 = Date.now();
  const r2tr = await C.trainMouth(S2, lines.map((l) => ({ x: l.x })), 800, 17412);
  if (r2tr.halted) {
    const ab = { spec: "p4-c0hetero-v11", arm: "weakB", verdict: "ABORT", reason: r2tr.halted };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab;
  }
  const held = C.heteroPool(12220, 200);
  const s2held = C.mouthLoss(S2, held.map((l) => l.x));
  const wallMs = Date.now() - t0;
  const ledger = { spec: "p4-c0hetero-v11", impl: "v1.2 no-replacement draw, pool n=600",
    arm: "weak-L5-true-only", verdict: "COMPLETE", wallMs, gaps, s1heldFrom: "c-weak.json",
    held: { s2held, s1held, gain: +(s1held - s2held).toFixed(4) } };
  await fs.writeTextFile(ledgerPath, JSON.stringify(ledger));
  log("c2-weak done gain=" + ledger.held.gain);
  return ledger;
};

// ---- F1 (D-P4r): dialect repair, loss-native bars, fresh seeds (spec p4-dialect-r-v10) ----
// Fresh: r1 students 12501+t, mix rng 12505+t; r2 gen 12530/12540/12550+t,
// draw rng 12561+t*10+arm, r2 students 12571+t*10+arm, S-gen 12591+t*30+arm*2+k.
// Common held-out D-strong 12160. NO pile distill (loss-native + bigram descriptive).
globalThis.runP4DialectF1R1 = async function (fs, log, t) {
  const ledgerPath = "src/evidence/p4/e-r1-t" + t + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log("e-r1-t" + t + " exists, skip"); return prev; }
  } catch (e) {}
  const C = await globalThis.P4ExpEInit(fs);
  const strong = JSON.parse(await fs.readTextFile("src/evidence/p4/d-pool-strong.json"));
  const detached = JSON.parse(await fs.readTextFile("src/evidence/p4/d-pool-detached.json"));
  const base = JSON.parse(await fs.readTextFile("src/evidence/p4/d-pool-base.json"));
  const tutor = C.GS.loadModel(JSON.parse(await fs.readTextFile("src/evidence/p4/expE-mouth-L2g9.json")));
  const rng = C.G.makeRng(12505 + t);
  function pick100(pool, p) {
    const idx = pool.map((_, i) => i);
    for (let i = idx.length - 1; i > 0; i--) { const j = rng.int(i + 1); const t2 = idx[i]; idx[i] = idx[j]; idx[j] = t2; }
    return idx.slice(0, 100).map((i) => ({ x: pool[i], p }));
  }
  const mix = [].concat(pick100(strong, 0), pick100(detached, 1), pick100(base, 2));
  const studentSeed = 12501 + t;
  const S1 = C.makeMouth(studentSeed);
  const t0 = Date.now();
  const mtr = await C.trainMouth(S1, mix.map((l) => ({ x: l.x })), 800, studentSeed + 5000);
  const wallMs = Date.now() - t0;
  if (mtr.halted) {
    const ab = { spec: "p4-dialect-r-v10", seed: t, verdict: "ABORT", reason: mtr.halted };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab;
  }
  const cells = [];
  for (let p = 0; p < 3; p++) for (let b = 0; b < 2; b++) {
    const ls = mix.filter((l) => l.p === p && (l.x.length <= 20 ? 0 : 1) === b).map((l) => l.x);
    const sl = C.mouthLoss(S1, ls), tl = C.mouthLoss(tutor, ls);
    cells.push({ p, b, n: ls.length, stud: sl, tut: tl, gap: +(sl - tl).toFixed(4) });
  }
  const gaps = cells.map((c) => c.gap);
  const gate = (Math.max.apply(null, gaps) - Math.min.apply(null, gaps)) >= 0.20 ? "PASS" : "UNINFORMATIVE";
  await fs.writeTextFile("src/evidence/p4/e-s1mouth-t" + t + ".json", JSON.stringify(C.GS.saveModel(S1, C.OPTS19)));
  const ledger = { spec: "p4-dialect-r-v10", seed: t, studentSeed, mixRng: 12505 + t, verdict: "COMPLETE",
    mtr: { firstLoss: mtr.firstLoss, lastLoss: mtr.lastLoss }, wallMs, cells, gate };
  await fs.writeTextFile(ledgerPath, JSON.stringify(ledger));
  log("e-r1-t" + t + " done gaps=" + gaps.join(",") + " gate=" + gate);
  return ledger;
};

globalThis.runP4DialectF1R2 = async function (fs, log, t, arm) {
  const names = ["true", "unif", "shuf"];
  const ledgerPath = "src/evidence/p4/e-r2-" + names[arm] + "-t" + t + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log("e-r2-" + names[arm] + "-t" + t + " exists, skip"); return prev; }
  } catch (e) {}
  const C = await globalThis.P4ExpEInit(fs);
  const r1 = JSON.parse(await fs.readTextFile("src/evidence/p4/e-r1-t" + t + ".json"));
  if (r1.verdict !== "COMPLETE" || r1.gate !== "PASS") {
    const ab = { spec: "p4-dialect-r-v10", seed: t, arm: names[arm], verdict: "ABORT", reason: "r1 gate " + r1.gate };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab;
  }
  const gaps = r1.cells.map((c) => c.gap);
  function transform(g) {
    const raw = g.map((x) => Math.max(0, x - 0.30) + 0.05);
    const sm = raw.reduce((a, b) => a + b, 0);
    return raw.map((x) => x / sm);
  }
  let w;
  if (arm === 1) w = [1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6];
  else {
    const g = gaps.slice();
    if (arm === 2) {
      const srng = C.G.makeRng(12566 + t);
      for (let i = g.length - 1; i > 0; i--) { const j = srng.int(i + 1); const tmp = g[i]; g[i] = g[j]; g[j] = tmp; }
    }
    w = transform(g);
  }
  const mL2 = C.GS.loadModel(JSON.parse(await fs.readTextFile("src/evidence/p4/expE-mouth-L2g9.json")));
  const mL5 = C.GS.loadModel(JSON.parse(await fs.readTextFile("src/evidence/p4/expE-mouth-L5g9.json")));
  const fresh = [C.genLines(mL2, 12530 + t, 300), C.genLines(mL5, 12540 + t, 300),
    C.structPool(12550 + t, 300).map((l) => l.x)];
  const byCell = [];
  for (let p = 0; p < 3; p++) for (let b = 0; b < 2; b++)
    byCell.push(fresh[p].filter((x) => (x.length <= 20 ? 0 : 1) === b));
  const drng = C.G.makeRng(12561 + t * 10 + arm);
  const cum = []; let acc = 0;
  for (const x of w) { acc += x; cum.push(acc); }
  const lines = [];
  for (let k = 0; k < 300; k++) {
    const u = drng.uniform(0, 1);
    let c = 0; while (c < 5 && u > cum[c]) c++;
    const cell = byCell[c];
    lines.push({ x: cell[drng.int(cell.length)], p: Math.floor(c / 2) });
  }
  const stSeed = 12571 + t * 10 + arm;
  const S2 = C.makeMouth(stSeed);
  const t0 = Date.now();
  const mtr = await C.trainMouth(S2, lines.map((l) => ({ x: l.x })), 800, stSeed + 5000);
  const wallMs = Date.now() - t0;
  if (mtr.halted) {
    const ab = { spec: "p4-dialect-r-v10", seed: t, arm: names[arm], verdict: "ABORT", reason: mtr.halted };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab;
  }
  const held = C.genLines(mL2, 12160, 200);
  const S1 = C.GS.loadModel(JSON.parse(await fs.readTextFile("src/evidence/p4/e-s1mouth-t" + t + ".json")));
  const lS2 = C.mouthLoss(S2, held), lS1 = C.mouthLoss(S1, held);
  function bigram(lines) {
    const v = new Float64Array(361); let n = 0;
    for (const x0 of lines) {
      const x = x0.x !== undefined ? x0.x : x0;
      for (let i = 1; i < x.length; i++) { v[x[i - 1] * 19 + x[i]]++; n++; }
    }
    for (let i = 0; i < 361; i++) v[i] /= n;
    return v;
  }
  function l1(a, b) { let s = 0; for (let i = 0; i < 361; i++) s += Math.abs(a[i] - b[i]); return +s.toFixed(4); }
  const bH = bigram(held);
  const gS2 = C.genLines(S2, 12591 + t * 30 + arm * 2 + 0, 200);
  const gS1 = C.genLines(S1, 12591 + t * 30 + arm * 2 + 1, 200);
  const ledger = { spec: "p4-dialect-r-v10", seed: t, arm: names[arm], verdict: "COMPLETE",
    w: w.map((x) => +x.toFixed(4)),
    mtr: { firstLoss: mtr.firstLoss, lastLoss: mtr.lastLoss }, wallMs,
    held: { s2loss: lS2, s1loss: lS1, lossGain: +(lS1 - lS2).toFixed(4) },
    bigr: { dTutorS2: l1(bH, bigram(gS2)), dTutorS1: l1(bH, bigram(gS1)) } };
  await fs.writeTextFile(ledgerPath, JSON.stringify(ledger));
  log("e-r2-" + names[arm] + "-t" + t + " done gain=" + ledger.held.lossGain);
  return ledger;
};

// ---- F2 (C0-flip): teach the learnable (spec p4-c0flip-v10) ----
// Reuses filed c-r1b gaps. Fresh pools 12280+s (n=600) + fresh students per arm.
// Inverted transform: need = max(0, 0.60 - gap). Same held-out 12220.
globalThis.runP4HeteroFlip = async function (fs, log, s, arm) {
  const names = ["easy", "unif"];
  const ledgerPath = "src/evidence/p4/f-r2-" + names[arm] + "-s" + s + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log("f-r2-" + names[arm] + "-s" + s + " exists, skip"); return prev; }
  } catch (e) {}
  const C = await globalThis.P4HeteroHelpers(fs);
  const r1 = JSON.parse(await fs.readTextFile("src/evidence/p4/c-r1b-s" + s + ".json"));
  if (r1.verdict !== "COMPLETE" || r1.learnGuard !== "PASS") {
    const ab = { spec: "p4-c0flip-v10", seed: s, arm: names[arm], verdict: "ABORT", reason: "r1b guard" };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab;
  }
  const gaps = r1.cells.map((c) => c.gap);
  let w;
  if (arm === 1) w = [1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6];
  else {
    const raw = gaps.map((x) => Math.max(0, 0.60 - x) + 0.05);
    const sm = raw.reduce((a, b) => a + b, 0);
    w = raw.map((x) => x / sm);
  }
  const pool = C.heteroPool(12280 + s, 600);
  const byCell = [];
  for (let tr = 0; tr < 3; tr++) for (let b = 0; b < 2; b++)
    byCell.push(pool.filter((l) => l.tier === tr && (l.x.length <= 20 ? 0 : 1) === b));
  const rrng = C.G.makeRng(12286 + s * 10 + arm);
  const lines = [], cc = [0, 0, 0, 0, 0, 0];
  for (let k = 0; k < 300; k++) {
    const rw = w.map((x, c) => (byCell[c].length ? x : 0));
    let sm = 0; for (const x of rw) sm += x;
    const u = rrng.uniform(0, 1) * sm;
    let c = 0, a2 = 0;
    while (c < 5 && a2 + rw[c] < u) { a2 += rw[c]; c++; }
    while (!byCell[c].length) c = (c + 1) % 6;
    const cell = byCell[c];
    lines.push(cell.splice(rrng.int(cell.length), 1)[0]);
    cc[c]++;
  }
  const stSeed = 12291 + s * 10 + arm;
  const S2 = C.makeMouth(stSeed);
  const t0 = Date.now();
  const mtr = await C.trainMouth(S2, lines.map((l) => ({ x: l.x })), 800, stSeed + 5000);
  const wallMs = Date.now() - t0;
  if (mtr.halted) {
    const ab = { spec: "p4-c0flip-v10", seed: s, arm: names[arm], verdict: "ABORT", reason: mtr.halted };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab;
  }
  const held = C.heteroPool(12220, 200);
  const s2held = C.mouthLoss(S2, held.map((l) => l.x));
  const gain = +(r1.s1held - s2held).toFixed(4);
  const ledger = { spec: "p4-c0flip-v10", seed: s, arm: names[arm], verdict: "COMPLETE",
    w: w.map((x) => +x.toFixed(4)), cellCounts: cc,
    mtr: { firstLoss: mtr.firstLoss, lastLoss: mtr.lastLoss }, wallMs,
    held: { s2held, s1held: r1.s1held, gain } };
  await fs.writeTextFile(ledgerPath, JSON.stringify(ledger));
  log("f-r2-" + names[arm] + "-s" + s + " done gain=" + gain);
  return ledger;
};

// ---- F3 (S-P4b): mouth-loss port on neutral structured pools (spec p4-structuredmouth-v10) ----
// Tutor 12601 on structPool(12600,600); guard pool 12602. R1 students 12611+t on
// tutor-gen 12610 (n=300); cells = band x tutor-loss tercile. R2 gen 12620+t,
// draw rng 12622+t*10+arm, students 12631+t*10+arm. Held-out 12640 (n=200).
globalThis.runP4StructMouthTutor = async function (fs, log) {
  const ledgerPath = "src/evidence/p4/m-tutor.json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log("m-tutor exists, skip"); return prev; }
  } catch (e) {}
  const C = await globalThis.P4ExpEInit(fs);
  const pool = C.structPool(12600, 600).map((l) => l.x);
  const T = C.makeMouth(12601);
  const t0 = Date.now();
  const tr = await C.trainMouth(T, pool.map((x) => ({ x })), 800, 17601);
  const wallMs = Date.now() - t0;
  if (tr.halted) {
    const ab = { spec: "p4-structuredmouth-v10", verdict: "ABORT", reason: tr.halted };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab;
  }
  const guard = C.structPool(12602, 200).map((l) => l.x);
  const guardLoss = C.mouthLoss(T, guard);
  await fs.writeTextFile("src/evidence/p4/m-tutor.json.blob", JSON.stringify(C.GS.saveModel(T, C.OPTS19)));
  const ledger = { spec: "p4-structuredmouth-v10", verdict: guardLoss <= 2.7 ? "COMPLETE" : "TUTOR-STILLBORN",
    train: { firstLoss: tr.firstLoss, lastLoss: tr.lastLoss }, wallMs, guardLoss };
  await fs.writeTextFile(ledgerPath, JSON.stringify(ledger));
  log("m-tutor done guard=" + guardLoss + " " + ledger.verdict);
  return ledger;
};

globalThis.runP4StructMouthR1 = async function (fs, log, t) {
  const ledgerPath = "src/evidence/p4/m-r1-t" + t + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log("m-r1-t" + t + " exists, skip"); return prev; }
  } catch (e) {}
  const C = await globalThis.P4ExpEInit(fs);
  const tut = JSON.parse(await fs.readTextFile("src/evidence/p4/m-tutor.json"));
  if (tut.verdict !== "COMPLETE") {
    const ab = { spec: "p4-structuredmouth-v10", seed: t, verdict: "ABORT", reason: "tutor " + tut.verdict };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab;
  }
  const T = C.GS.loadModel(JSON.parse(await fs.readTextFile("src/evidence/p4/m-tutor.json.blob")));
  const rng = C.G.makeRng(12615 + t);
  const pool = [];
  for (let li = 0; li < 300; li++) {
    const L = li < 150 ? [10, 15, 20][rng.int(3)] : 50;
    pool.push(L);
  }
  // generate 300 tutor lines (genLines shape: 150 short + 150 long via its own rng; use gen seed then band by length)
  const lines = C.genLines(T, 12610 + t, 300);
  // terciles by tutor per-line loss
  const scored = lines.map((x) => ({ x, tl: C.mouthLoss(T, [x]) }));
  scored.sort((a, b) => a.tl - b.tl);
  const c1 = scored[100].tl, c2 = scored[200].tl;
  const S1 = C.makeMouth(12611 + t);
  const t0 = Date.now();
  const mtr = await C.trainMouth(S1, lines.map((x) => ({ x })), 800, 17611 + t);
  const wallMs = Date.now() - t0;
  if (mtr.halted) {
    const ab = { spec: "p4-structuredmouth-v10", seed: t, verdict: "ABORT", reason: mtr.halted };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab;
  }
  const cells = [];
  for (let b = 0; b < 2; b++) for (let q = 0; q < 3; q++) {
    const ls = scored.filter((l) => (l.x.length <= 20 ? 0 : 1) === b &&
      (q === 0 ? l.tl <= c1 : q === 1 ? (l.tl > c1 && l.tl <= c2) : l.tl > c2));
    const sl = C.mouthLoss(S1, ls.map((l) => l.x));
    const tl = ls.reduce((s, l) => s + l.tl, 0) / ls.length;
    cells.push({ b, terc: q, n: ls.length, stud: +sl.toFixed(4), tut: +tl.toFixed(4), gap: +((sl - tl).toFixed(4)) });
  }
  const gaps = cells.map((c) => c.gap);
  const gate = (Math.max.apply(null, gaps) - Math.min.apply(null, gaps)) >= 0.20 ? "PASS" : "UNINFORMATIVE";
  await fs.writeTextFile("src/evidence/p4/m-s1mouth-t" + t + ".json", JSON.stringify(C.GS.saveModel(S1, C.OPTS19)));
  const ledger = { spec: "p4-structuredmouth-v10", seed: t, verdict: "COMPLETE",
    tercCuts: [c1, c2], mtr: { firstLoss: mtr.firstLoss, lastLoss: mtr.lastLoss }, wallMs, cells, gate };
  await fs.writeTextFile(ledgerPath, JSON.stringify(ledger));
  log("m-r1-t" + t + " done gaps=" + gaps.join(",") + " gate=" + gate);
  return ledger;
};

globalThis.runP4StructMouthR2 = async function (fs, log, t, arm) {
  const names = ["true", "unif", "shuf"];
  const ledgerPath = "src/evidence/p4/m2-r2-" + names[arm] + "-t" + t + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log("m-r2-" + names[arm] + "-t" + t + " exists, skip"); return prev; }
  } catch (e) {}
  const C = await globalThis.P4ExpEInit(fs);
  const r1 = JSON.parse(await fs.readTextFile("src/evidence/p4/m-r1b-t" + t + ".json"));
  if (r1.verdict !== "COMPLETE" || r1.gate !== "PASS") {
    const ab = { spec: "p4-structuredmouth-v10", seed: t, arm: names[arm], verdict: "ABORT", reason: "r1 gate " + r1.gate };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab;
  }
  const gaps = r1.cells.map((c) => c.gap), cuts = r1.tercCuts;
  function transform(g) {
    const raw = g.map((x) => Math.max(0, x - 0.30) + 0.05);
    const sm = raw.reduce((a, b) => a + b, 0);
    return raw.map((x) => x / sm);
  }
  let w;
  if (arm === 1) w = [1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6];
  else {
    const g = gaps.slice();
    if (arm === 2) {
      const srng = C.G.makeRng(12626 + t);
      for (let i = g.length - 1; i > 0; i--) { const j = srng.int(i + 1); const tmp = g[i]; g[i] = g[j]; g[j] = tmp; }
    }
    w = transform(g);
  }
  const T = C.GS.loadModel(JSON.parse(await fs.readTextFile("src/evidence/p4/m-tutor.json.blob")));
  const fresh = C.genLines(T, 12620 + t, 600);
  const fscored = fresh.map((x) => ({ x, tl: C.mouthLoss(T, [x]) }));
  const byCell = [];
  for (let b = 0; b < 2; b++) for (let q = 0; q < 3; q++)
    byCell.push(fscored.filter((l) => (l.x.length <= 20 ? 0 : 1) === b &&
      (q === 0 ? l.tl <= cuts[0] : q === 1 ? (l.tl > cuts[0] && l.tl <= cuts[1]) : l.tl > cuts[1])));
  // v1.2: weighted draw WITHOUT replacement (sequential renormalize over non-empty cells)
  const drng = C.G.makeRng(12622 + t * 10 + arm);
  const lines = [], cc = [0, 0, 0, 0, 0, 0];
  for (let k = 0; k < 300; k++) {
    const rw = w.map((x, c) => (byCell[c].length ? x : 0));
    let sm = 0; for (const x of rw) sm += x;
    const u = drng.uniform(0, 1) * sm;
    let c = 0, a2 = 0;
    while (c < 5 && a2 + rw[c] < u) { a2 += rw[c]; c++; }
    while (!byCell[c].length) c = (c + 1) % 6;
    const cell = byCell[c];
    const li = drng.int(cell.length);
    const drawn = cell.splice(li, 1)[0];
    lines.push(drawn.x !== undefined ? drawn.x : drawn);
    cc[c]++;
  }
  const S2 = C.makeMouth(12631 + t * 10 + arm);
  const t0 = Date.now();
  const mtr = await C.trainMouth(S2, lines.map((x) => ({ x: x.x !== undefined ? x.x : x })), 800, 17631 + t * 10 + arm);
  const wallMs = Date.now() - t0;
  if (mtr.halted) {
    const ab = { spec: "p4-structuredmouth-v10", seed: t, arm: names[arm], verdict: "ABORT", reason: mtr.halted };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab;
  }
  const held = C.genLines(T, 12640, 200);
  const S1 = C.GS.loadModel(JSON.parse(await fs.readTextFile("src/evidence/p4/m-s1mouth-t" + t + ".json")));
  const lS2 = C.mouthLoss(S2, held), lS1 = C.mouthLoss(S1, held);
  const ledger = { spec: "p4-structuredmouth-v11", impl: "v1.2 no-replacement draw, pool n=600",
    seed: t, arm: names[arm], verdict: "COMPLETE",
    w: w.map((x) => +x.toFixed(4)), cellCounts: cc,
    mtr: { firstLoss: mtr.firstLoss, lastLoss: mtr.lastLoss }, wallMs,
    held: { s2loss: lS2, s1loss: lS1, lossGain: +(lS1 - lS2).toFixed(4) } };
  await fs.writeTextFile(ledgerPath, JSON.stringify(ledger));
  log("m-r2-" + names[arm] + "-t" + t + " done gain=" + ledger.held.lossGain);
  return ledger;
};

// v1.1: score gaps on fresh tutor-gen score pool (12645, common ruler) with filed
// r1 tercile cuts. Blobs already saved — forward passes only, no retraining.
globalThis.runP4StructMouthR1b = async function (fs, log, t) {
  const ledgerPath = "src/evidence/p4/m-r1b-t" + t + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log("m-r1b-t" + t + " exists, skip"); return prev; }
  } catch (e) {}
  const C = await globalThis.P4ExpEInit(fs);
  const r1 = JSON.parse(await fs.readTextFile("src/evidence/p4/m-r1-t" + t + ".json"));
  const T = C.GS.loadModel(JSON.parse(await fs.readTextFile("src/evidence/p4/m-tutor.json.blob")));
  const S1 = C.GS.loadModel(JSON.parse(await fs.readTextFile("src/evidence/p4/m-s1mouth-t" + t + ".json")));
  const cuts = r1.tercCuts;
  const score = C.genLines(T, 12645, 300);
  const cells = [];
  for (let b = 0; b < 2; b++) for (let q = 0; q < 3; q++) {
    const ls = score.filter((x) => (x.length <= 20 ? 0 : 1) === b &&
      ((C.mouthLoss(T, [x]) <= cuts[0] ? 0 : C.mouthLoss(T, [x]) <= cuts[1] ? 1 : 2) === q));
    const sl = C.mouthLoss(S1, ls), tl = C.mouthLoss(T, ls);
    cells.push({ b, terc: q, n: ls.length, stud: +sl.toFixed(4), tut: +tl.toFixed(4), gap: +((sl - tl).toFixed(4)) });
  }
  const gaps = cells.map((c) => c.gap);
  const gate = (Math.max.apply(null, gaps) - Math.min.apply(null, gaps)) >= 0.20 ? "PASS" : "UNINFORMATIVE";
  const held = C.genLines(T, 12640, 200);
  const s1held = C.mouthLoss(S1, held);
  const ledger = { spec: "p4-structuredmouth-v11", seed: t, tercCuts: cuts,
    supersedes: "m-r1-t" + t + ".json (train-scored gaps voided by v1.1 amendment)",
    verdict: "COMPLETE", cells, gate, s1held };
  await fs.writeTextFile(ledgerPath, JSON.stringify(ledger));
  log("m-r1b-t" + t + " done gaps=" + gaps.join(",") + " gate=" + gate);
  return ledger;
};

// ---- F4: floor/sharpness sweep (spec p4-floorsweep-v10) ----
// Reuses FILED D r1 gaps (d-r1-s{0,1,2}); floors {0.05, 0.15, 0.30}.
// Fresh: gen 12930/12940/12950+s, draw rng 12961+s*10+fidx, students 12971+s*10+fidx.
globalThis.runP4FloorSweep = async function (fs, log, s, fidx) {
  const floors = [0.05, 0.15, 0.30];
  const ledgerPath = "src/evidence/p4/f4-f" + fidx + "-s" + s + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log("f4-f" + fidx + "-s" + s + " exists, skip"); return prev; }
  } catch (e) {}
  const C = await globalThis.P4ExpEInit(fs);
  const r1 = JSON.parse(await fs.readTextFile("src/evidence/p4/d-r1-s" + s + ".json"));
  const gaps = r1.cells.map((c) => c.gap);
  const F = floors[fidx];
  const raw = gaps.map((x) => Math.max(0, x - 0.30) + F);
  const sm = raw.reduce((a, b) => a + b, 0);
  const w = raw.map((x) => x / sm);
  const mL2 = C.GS.loadModel(JSON.parse(await fs.readTextFile("src/evidence/p4/expE-mouth-L2g9.json")));
  const mL5 = C.GS.loadModel(JSON.parse(await fs.readTextFile("src/evidence/p4/expE-mouth-L5g9.json")));
  const fresh = [C.genLines(mL2, 12930 + s, 300), C.genLines(mL5, 12940 + s, 300),
    C.structPool(12950 + s, 300).map((l) => l.x)];
  const byCell = [];
  for (let p = 0; p < 3; p++) for (let b = 0; b < 2; b++)
    byCell.push(fresh[p].filter((x) => (x.length <= 20 ? 0 : 1) === b));
  const drng = C.G.makeRng(12961 + s * 10 + fidx);
  const cum = []; let acc = 0;
  for (const x of w) { acc += x; cum.push(acc); }
  const lines = [];
  for (let k = 0; k < 300; k++) {
    const u = drng.uniform(0, 1);
    let c = 0; while (c < 5 && u > cum[c]) c++;
    const cell = byCell[c];
    lines.push(cell[drng.int(cell.length)]);
  }
  const stSeed = 12971 + s * 10 + fidx;
  const S2 = C.makeMouth(stSeed);
  const t0 = Date.now();
  const mtr = await C.trainMouth(S2, lines.map((x) => ({ x })), 800, stSeed + 5000);
  const wallMs = Date.now() - t0;
  if (mtr.halted) {
    const ab = { spec: "p4-floorsweep-v10", seed: s, fidx, verdict: "ABORT", reason: mtr.halted };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab;
  }
  const held = C.genLines(mL2, 12160, 200);
  const S1 = C.GS.loadModel(JSON.parse(await fs.readTextFile("src/evidence/p4/d-s1mouth-s" + s + ".json")));
  const lS2 = C.mouthLoss(S2, held), lS1 = C.mouthLoss(S1, held);
  const ledger = { spec: "p4-floorsweep-v10", seed: s, floor: F, verdict: "COMPLETE",
    w: w.map((x) => +x.toFixed(4)), concentration: +Math.max.apply(null, w).toFixed(4),
    mtr: { firstLoss: mtr.firstLoss, lastLoss: mtr.lastLoss }, wallMs,
    held: { s2loss: lS2, s1loss: lS1, lossGain: +(lS1 - lS2).toFixed(4) } };
  await fs.writeTextFile(ledgerPath, JSON.stringify(ledger));
  log("f4-f" + fidx + "-s" + s + " done gain=" + ledger.held.lossGain);
  return ledger;
};

// ---- F5: round-3 extension (spec p4-round3-v10) ----
// Rebuilds F1-R2-true S2 deterministically (+check), scores it, runs round 3.
globalThis.runP4Round3 = async function (fs, log, t) {
  const ledgerPath = "src/evidence/p4/g-r3-t" + t + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log("g-r3-t" + t + " exists, skip"); return prev; }
  } catch (e) {}
  const C = await globalThis.P4ExpEInit(fs);
  const r1 = JSON.parse(await fs.readTextFile("src/evidence/p4/e-r1-t" + t + ".json"));
  const r2filed = JSON.parse(await fs.readTextFile("src/evidence/p4/e-r2-true-t" + t + ".json"));
  const gaps = r1.cells.map((c) => c.gap);
  function transform(g) {
    const raw = g.map((x) => Math.max(0, x - 0.30) + 0.05);
    const sm = raw.reduce((a, b) => a + b, 0);
    return raw.map((x) => x / sm);
  }
  const w = transform(gaps);
  const mL2 = C.GS.loadModel(JSON.parse(await fs.readTextFile("src/evidence/p4/expE-mouth-L2g9.json")));
  const mL5 = C.GS.loadModel(JSON.parse(await fs.readTextFile("src/evidence/p4/expE-mouth-L5g9.json")));
  const tutor = C.GS.loadModel(JSON.parse(await fs.readTextFile("src/evidence/p4/expE-mouth-L2g9.json")));
  const strong = JSON.parse(await fs.readTextFile("src/evidence/p4/d-pool-strong.json"));
  const detached = JSON.parse(await fs.readTextFile("src/evidence/p4/d-pool-detached.json"));
  const base = JSON.parse(await fs.readTextFile("src/evidence/p4/d-pool-base.json"));
  const fresh = [C.genLines(mL2, 12530 + t, 300), C.genLines(mL5, 12540 + t, 300),
    C.structPool(12550 + t, 300).map((l) => l.x)];
  const byCell = [];
  for (let p = 0; p < 3; p++) for (let b = 0; b < 2; b++)
    byCell.push(fresh[p].filter((x) => (x.length <= 20 ? 0 : 1) === b));
  const drng = C.G.makeRng(12561 + t * 10 + 0);
  const cum = []; let acc = 0;
  for (const x of w) { acc += x; cum.push(acc); }
  const lines = [];
  for (let k = 0; k < 300; k++) {
    const u = drng.uniform(0, 1);
    let c = 0; while (c < 5 && u > cum[c]) c++;
    const cell = byCell[c];
    lines.push({ x: cell[drng.int(cell.length)], p: Math.floor(c / 2) });
  }
  const stSeed = 12571 + t * 10 + 0;
  const S2 = C.makeMouth(stSeed);
  const r2tr = await C.trainMouth(S2, lines.map((l) => ({ x: l.x })), 800, stSeed + 5000);
  if (r2tr.lastLoss !== r2filed.mtr.lastLoss) {
    const ab = { spec: "p4-round3-v10", seed: t, verdict: "ABORT", reason: "rebuild drift",
      rebuilt: r2tr.lastLoss, filed: r2filed.mtr.lastLoss };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab;
  }
  // score rebuilt S2 per-cell on its own train lines
  const cells = [];
  for (let p = 0; p < 3; p++) for (let b = 0; b < 2; b++) {
    const ls = lines.filter((l) => l.p === p && (l.x.length <= 20 ? 0 : 1) === b).map((l) => l.x);
    const sl = C.mouthLoss(S2, ls), tl = C.mouthLoss(tutor, ls);
    cells.push({ p, b, n: ls.length, stud: sl, tut: tl, gap: +(sl - tl).toFixed(4) });
  }
  const gaps3 = cells.map((c) => c.gap);
  const w3 = transform(gaps3);
  const fresh3 = [C.genLines(mL2, 12830 + t, 300), C.genLines(mL5, 12840 + t, 300),
    C.structPool(12850 + t, 300).map((l) => l.x)];
  const byCell3 = [];
  for (let p = 0; p < 3; p++) for (let b = 0; b < 2; b++)
    byCell3.push(fresh3[p].filter((x) => (x.length <= 20 ? 0 : 1) === b));
  const drng3 = C.G.makeRng(12861 + t);
  const cum3 = []; let acc3 = 0;
  for (const x of w3) { acc3 += x; cum3.push(acc3); }
  const lines3 = [];
  for (let k = 0; k < 300; k++) {
    const u = drng3.uniform(0, 1);
    let c = 0; while (c < 5 && u > cum3[c]) c++;
    const cell = byCell3[c];
    lines3.push(cell[drng3.int(cell.length)]);
  }
  const S3 = C.makeMouth(12871 + t);
  const t0 = Date.now();
  const mtr3 = await C.trainMouth(S3, lines3.map((x) => ({ x })), 800, 17871 + t);
  const wallMs = Date.now() - t0;
  if (mtr3.halted) {
    const ab = { spec: "p4-round3-v10", seed: t, verdict: "ABORT", reason: mtr3.halted };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab;
  }
  const held = C.genLines(mL2, 12160, 200);
  const S1 = C.GS.loadModel(JSON.parse(await fs.readTextFile("src/evidence/p4/e-s1mouth-t" + t + ".json")));
  const lS3 = C.mouthLoss(S3, held), lS1 = C.mouthLoss(S1, held);
  const r3gain = +(lS1 - lS3).toFixed(4), r2gain = r2filed.held.lossGain;
  const d = +(r3gain - r2gain).toFixed(4);
  const cat = d >= 0.10 ? "COMPOUND" : (d <= -0.10 ? "COLLAPSE" : "SATURATE");
  const ledger = { spec: "p4-round3-v10", seed: t, verdict: "COMPLETE", wallMs,
    rebuild: "S2 lastLoss == filed " + r2filed.mtr.lastLoss,
    r2: { gaps, w: w.map((x) => +x.toFixed(4)), gain: r2gain },
    r3: { gaps: gaps3, w: w3.map((x) => +x.toFixed(4)), gain: r3gain },
    delta: d, category: cat };
  await fs.writeTextFile(ledgerPath, JSON.stringify(ledger));
  log("g-r3-t" + t + " done r2gain=" + r2gain + " r3gain=" + r3gain + " " + cat);
  return ledger;
};

// v1.1: S1 rebuild (deterministic) + score-pool gaps. Supersedes c-r1 train gaps.
globalThis.runP4HeteroR1b = async function (fs, log, s) {
  const ledgerPath = "src/evidence/p4/c-r1b-s" + s + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log("c-r1b-s" + s + " exists, skip"); return prev; }
  } catch (e) {}
  const C = await globalThis.P4HeteroHelpers(fs);
  const r1 = JSON.parse(await fs.readTextFile("src/evidence/p4/c-r1-s" + s + ".json"));
  const studentSeed = 12201 + s;
  const S1 = C.makeMouth(studentSeed);
  const pool = C.heteroPool(12200, 300);
  const mtr = await C.trainMouth(S1, pool.map((l) => ({ x: l.x })), 800, studentSeed + 5000);
  if (mtr.lastLoss !== r1.mtr.lastLoss) {
    const ab = { spec: "p4-c0hetero-v11", seed: s, verdict: "ABORT", reason: "determinism drift",
      rebuilt: mtr.lastLoss, filed: r1.mtr.lastLoss };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab;
  }
  await fs.writeTextFile("src/evidence/p4/c-s1mouth-s" + s + ".json", JSON.stringify(C.GS.saveModel(S1, C.OPTS19)));
  const score = C.heteroPool(12205, 300);
  const cells = C.cellsOf(score, (x) => C.mouthLoss(S1, [x]));
  const gaps = cells.map((c) => c.gap);
  const held = C.heteroPool(12220, 200);
  const s1held = C.mouthLoss(S1, held.map((l) => l.x));
  const ledger = { spec: "p4-c0hetero-v11", seed: s, studentSeed, scoreSeed: 12205,
    supersedes: "c-r1-s" + s + ".json (train-scored gaps voided by v1.1 amendment)",
    verdict: "COMPLETE", determinism: "rebuilt lastLoss == filed " + r1.mtr.lastLoss,
    learnGuard: r1.learnGuard, wallMs: r1.wallMs, cells, s1held };
  await fs.writeTextFile(ledgerPath, JSON.stringify(ledger));
  log("c-r1b-s" + s + " done gaps=" + gaps.join(",") + " s1held=" + s1held);
  return ledger;
};
