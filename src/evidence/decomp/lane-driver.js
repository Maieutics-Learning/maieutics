// src/evidence/decomp/lane-driver.js — practice program lanes (2→3→1) + post-verdict extras.
// Lane 2: ledger-augmented frozen reader (compositional 4-pair around 1-pair ledger).
globalThis.LaneInit = async function (fs) {
  globalThis.window = globalThis;
  const ORDER = ["src/tinynn/nn.js", "src/tinynn/seeded.js", "src/tinynn/tasks.js", "src/tinynn/train.js"];
  for (const p of ORDER) { const src = await fs.readTextFile(p); (0, eval)(src + "\n//# sourceURL=" + p); }
  const G = globalThis.__tinyNN, T = globalThis.TinyNN;
  if (!G || !T || !T.trainModel) throw new Error("lane stack load failed");
  return { G, T, TASKS: T.TASKS };
};
function laneRestore(T, G, tut) {
  const rng = G.makeRng(tut.trainSeed);
  const model = T.makeModel(rng, tut.arch);
  const ps = model.params();
  for (let i = 0; i < ps.length; i++) {
    const dst = ps[i].v !== undefined ? ps[i].v : ps[i];
    const src = tut.params[i];
    for (let j = 0; j < dst.length; j++) dst[j] = src[j];
  }
  return model;
}
function laneShuffle(rng, arr) {
  for (let i = arr.length - 1; i > 0; i--) { const j = rng.int(i + 1); const t = arr[i]; arr[i] = arr[j]; arr[j] = t; }
  return arr;
}
globalThis.runLane2 = async function (fs, log, s) {  const ledgerPath = "src/evidence/decomp/d-lane2-s" + s + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T } = await globalThis.LaneInit(fs);
  const base = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-adapt-base-s" + s + ".json"));
  if (!base || !base.params) throw new Error("adapt-base s" + s + " missing");
  const model = laneRestore(T, G, base);
  // ledger: 200 1-pair lines
  const lrng = G.makeRng(16400 + s);
  const ledger = [];
  for (let i = 0; i < 200; i++) {
    const k = lrng.int(4), v = lrng.int(4);
    ledger.push({ k, v, y: v });
  }
  // test: 200 compositional 4-pair lines around ledger target
  const trng = G.makeRng(16500 + s);
  const test = [];
  for (let i = 0; i < 200; i++) {
    const t = ledger[i % 200];
    const k0 = t.k, v0 = t.v;
    const others = [0, 1, 2, 3].filter((k) => k !== k0);
    const pairs = [[k0, v0]];
    for (const k of others) pairs.push([k, trng.int(4)]);
    laneShuffle(trng, pairs);
    const flat = [];
    for (const [k, v] of pairs) flat.push(k, 4 + v);
    flat.push(k0, 8);
    test.push({ x: flat, y: v0, pairs, q: k0 });
  }
  const testEx = test.map((t) => ({ x: t.x, y: t.y }));
  const noledger = T.evaluate(model, testEx, 1).acc;
  // LEDGER-kNN: score = 2*(k==q) + pair-match
  let rightKNN = 0;
  for (const t of test) {
    const inSet = {};
    for (const [k, v] of t.pairs) inSet[k + ":" + v] = true;
    const scored = ledger.map((L, idx) => ({ idx, y: L.y,
      score: (L.k === t.q ? 2 : 0) + (inSet[L.k + ":" + L.v] ? 1 : 0) }));
    scored.sort((a, b) => (b.score - a.score) || (a.idx - b.idx));
    const top = scored.slice(0, 8);
    const votes = [0, 0, 0, 0];
    for (const c of top) votes[c.y]++;
    let best = 0;
    for (let c = 1; c < 4; c++) if (votes[c] > votes[best]) best = c;
    if (best === t.y) rightKNN++;
  }
  const ledgerKNN = rightKNN / test.length;
  // RANDEX null: 8 random ledger lines per query
  const rrng = G.makeRng(16600 + s);
  let rightR = 0;
  for (const t of test) {
    const votes = [0, 0, 0, 0];
    for (let j = 0; j < 8; j++) votes[ledger[rrng.int(200)].y]++;
    let best = 0;
    for (let c = 1; c < 4; c++) if (votes[c] > votes[best]) best = c;
    if (best === t.y) rightR++;
  }
  const randex = rightR / test.length;
  const body = { spec: "lane2-v10", seed: s, verdict: "COMPLETE",
    nLedger: 200, nTest: 200, k: 8, phase: 1,
    noledger: +noledger.toFixed(4), ledgerKNN: +ledgerKNN.toFixed(4), randex: +randex.toFixed(4),
    dLedgerNo: +(ledgerKNN - noledger).toFixed(4), dLedgerRand: +(ledgerKNN - randex).toFixed(4) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("lane2 s=" + s + " no=" + body.noledger + " knn=" + body.ledgerKNN + " rand=" + body.randex);
  return body;
};
// Phase 2 (gated on Phase-1 HELPS): train reader — finetune base 200 steps on
// ledger 1-pair content vs same-budget random 1..3-pair lines; same test.
globalThis.runLane2Phase2 = async function (fs, log, s) {
  const ledgerPath = "src/evidence/decomp/d-lane2p2-" + s + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.LaneInit(fs);
  const A = TASKS.assocR;
  const base = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-adapt-base-s" + s + ".json"));
  if (!base || !base.params) throw new Error("adapt-base s" + s + " missing");
  const lrng = G.makeRng(16400 + s);
  const ledgerData = [];
  for (let i = 0; i < 200; i++) {
    const k = lrng.int(4), v = lrng.int(4);
    ledgerData.push({ x: [k, 4 + v, k, 8], y: v });
  }
  const rrng2 = G.makeRng(16800 + s);
  const randomData = [];
  for (let i = 0; i < 200; i++) randomData.push(A.gen(rrng2, 1 + rrng2.int(3)));
  const trng = G.makeRng(16500 + s);
  const ledgerPairs = ledgerData.map((d) => ({ k: d.x[0], v: d.y }));
  const test = [];
  for (let i = 0; i < 200; i++) {
    const t = ledgerPairs[i % 200];
    const k0 = t.k, v0 = t.v;
    const others = [0, 1, 2, 3].filter((k) => k !== k0);
    const pairs = [[k0, v0]];
    for (const k of others) pairs.push([k, trng.int(4)]);
    laneShuffle(trng, pairs);
    const flat = [];
    for (const [k, v] of pairs) flat.push(k, 4 + v);
    flat.push(k0, 8);
    test.push({ x: flat, y: v0 });
  }
  function finetune(data, seed) {
    const m = laneRestore(T, G, base);
    const rng = G.makeRng(seed);
    const opt = new G.Adam(5e-3);
    const B = 8;
    for (let step = 0; step < 200; step++) {
      m.zeroGrad();
      for (let b = 0; b < B; b++) {
        const ex = data[rng.int(data.length)];
        const fw = m.forward(ex.x, 1);
        const ce = G.softmaxCE(fw.logits, ex.y);
        const d = ce.dlogits;
        for (let i = 0; i < d.length; i++) d[i] /= B;
        let auxList = null;
        if (fw.cache.posOut) {
          const labs = A.bindLabels(ex.x);
          auxList = new Array(ex.x.length);
          for (let t = 0; t < ex.x.length; t++) {
            if (labs[t] == null) { auxList[t] = null; continue; }
            const ceT = G.softmaxCE(fw.cache.posOut[t].logits, labs[t]);
            const dt = ceT.dlogits;
            for (let i = 0; i < dt.length; i++) dt[i] /= (B * ex.x.length);
            auxList[t] = dt;
          }
        }
        m.backward(d, fw, auxList, null, null);
      }
      opt.step(m.params());
    }
    return m;
  }
  const mLed = finetune(ledgerData, 16900 + s);
  const mRnd = finetune(randomData, 16950 + s);
  const aLed = T.evaluate(mLed, test, 1).acc;
  const aRnd = T.evaluate(mRnd, test, 1).acc;
  const body = { spec: "lane2-v10-phase2", seed: s, verdict: "COMPLETE",
    steps: 200, trainLedger: +aLed.toFixed(4), trainRandom: +aRnd.toFixed(4),
    dTrain: +(aLed - aRnd).toFixed(4) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("lane2p2 s=" + s + " led=" + body.trainLedger + " rnd=" + body.trainRandom);
  return body;
};
// ---- Lane 2 extras (lane2x-v10): X1 mixed-diet + X2-X5 frozen teeth/dose. ----
function lane2Rebuild(G, s) {
  const lrng = G.makeRng(16400 + s);
  const ledger = [];
  for (let i = 0; i < 200; i++) { const k = lrng.int(4), v = lrng.int(4); ledger.push({ k, v, y: v }); }
  const trng = G.makeRng(16500 + s);
  const test = [];
  for (let i = 0; i < 200; i++) {
    const t = ledger[i % 200];
    const k0 = t.k, v0 = t.v;
    const others = [0, 1, 2, 3].filter((k) => k !== k0);
    const pairs = [[k0, v0]];
    for (const k of others) pairs.push([k, trng.int(4)]);
    laneShuffle(trng, pairs);
    const flat = [];
    for (const [k, v] of pairs) flat.push(k, 4 + v);
    flat.push(k0, 8);
    test.push({ x: flat, y: v0, pairs, q: k0 });
  }
  return { ledger, test };
}
function lane2KnnAcc(ledger, test, k, scoreFn) {
  let right = 0;
  for (const t of test) {
    const scored = ledger.map((L, idx) => ({ idx, y: L.y, score: scoreFn(L, t) }));
    scored.sort((a, b) => (b.score - a.score) || (a.idx - b.idx));
    const votes = [0, 0, 0, 0];
    for (const c of scored.slice(0, k)) votes[c.y]++;
    let best = 0;
    for (let c = 1; c < 4; c++) if (votes[c] > votes[best]) best = c;
    if (best === t.y) right++;
  }
  return right / test.length;
}
globalThis.runLane2X1 = async function (fs, log, s) {
  const ledgerPath = "src/evidence/decomp/d-lane2x-x1-s" + s + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.LaneInit(fs);
  const A = TASKS.assocR;
  const base = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-adapt-base-s" + s + ".json"));
  const { ledger, test } = lane2Rebuild(G, s);
  const ledgerData = ledger.map((L) => ({ x: [L.k, 4 + L.v, L.k, 8], y: L.y }));
  const rrng = G.makeRng(16800 + s + 1000);
  const randomData = [];
  for (let i = 0; i < 100; i++) randomData.push(A.gen(rrng, 1 + rrng.int(3)));
  const mixed = ledgerData.slice(0, 100).concat(randomData);
  const m = laneRestore(T, G, base);
  const rng = G.makeRng(17100 + s);
  const opt = new G.Adam(5e-3);
  const B = 8;
  for (let step = 0; step < 200; step++) {
    m.zeroGrad();
    for (let b = 0; b < B; b++) {
      const ex = mixed[rng.int(mixed.length)];
      const fw = m.forward(ex.x, 1);
      const ce = G.softmaxCE(fw.logits, ex.y);
      const d = ce.dlogits;
      for (let i = 0; i < d.length; i++) d[i] /= B;
      let auxList = null;
      if (fw.cache.posOut) {
        const labs = A.bindLabels(ex.x);
        auxList = new Array(ex.x.length);
        for (let t = 0; t < ex.x.length; t++) {
          if (labs[t] == null) { auxList[t] = null; continue; }
          const ceT = G.softmaxCE(fw.cache.posOut[t].logits, labs[t]);
          const dt = ceT.dlogits;
          for (let i = 0; i < dt.length; i++) dt[i] /= (B * ex.x.length);
          auxList[t] = dt;
        }
      }
      m.backward(d, fw, auxList, null, null);
    }
    opt.step(m.params());
  }
  const testEx = test.map((t) => ({ x: t.x, y: t.y }));
  const aMixed = T.evaluate(m, testEx, 1).acc;
  const p2 = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-lane2p2-" + s + ".json"));
  const body = { spec: "lane2x-v10-x1", seed: s, verdict: "COMPLETE", steps: 200,
    mixed: +aMixed.toFixed(4), ledgerOnly: p2.trainLedger, randomOnly: p2.trainRandom,
    dMixedLedger: +(aMixed - p2.trainLedger).toFixed(4) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("lane2x-x1 s=" + s + " mixed=" + body.mixed);
  return body;
};
globalThis.runLane2Xfrozen = async function (fs, log, s) {
  const paths = [2, 3, 4, 5].map((x) => "src/evidence/decomp/d-lane2x-x" + x + "-s" + s + ".json");
  try {
    const prevs = [];
    for (const p of paths) prevs.push(JSON.parse(await fs.readTextFile(p)));
    if (prevs.every((p) => p && p.verdict === "COMPLETE")) { log("lane2x-x2345 s=" + s + " exist, skip"); return prevs; }
  } catch (e) {}
  const { G } = await globalThis.LaneInit(fs);
  const { ledger, test } = lane2Rebuild(G, s);
  const filed = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-lane2-s" + s + ".json"));
  const full = (L, t) => {
    let m = 0;
    for (const [k, v] of t.pairs) if (k === L.k && v === L.v) { m = 1; break; }
    return (L.k === t.q ? 2 : 0) + m;
  };
  const blind = (L, t) => {
    for (const [k, v] of t.pairs) if (k === L.k && v === L.v) return 1;
    return 0;
  };
  // X2 k-dose
  const ks = [1, 2, 4, 16];
  const kacc = {};
  for (const k of ks) kacc[k] = +lane2KnnAcc(ledger, test, k, full).toFixed(4);
  // X3 size-dose (first N)
  const Ns = [25, 50, 100, 200];
  const nacc = {};
  for (const N of Ns) nacc[N] = +lane2KnnAcc(ledger.slice(0, N), test, 8, full).toFixed(4);
  // X4 shuffled labels
  const prng = G.makeRng(17000 + s);
  const ys = ledger.map((L) => L.y);
  for (let i = ys.length - 1; i > 0; i--) { const j = prng.int(i + 1); const t = ys[i]; ys[i] = ys[j]; ys[j] = t; }
  const shufLedger = ledger.map((L, i) => ({ k: L.k, v: L.v, y: ys[i] }));
  const shuf = +lane2KnnAcc(shufLedger, test, 8, full).toFixed(4);
  // X5 query-blind
  const blindAcc = +lane2KnnAcc(ledger, test, 8, blind).toFixed(4);
  const b2 = { spec: "lane2x-v10-x2", seed: s, verdict: "COMPLETE", kacc, minK: Math.min(...ks.map((k) => kacc[k])), noledger: filed.noledger };
  const b3 = { spec: "lane2x-v10-x3", seed: s, verdict: "COMPLETE", nacc };
  const b4 = { spec: "lane2x-v10-x4", seed: s, verdict: "COMPLETE", shuffled: shuf, randex: filed.randex };
  const b5 = { spec: "lane2x-v10-x5", seed: s, verdict: "COMPLETE", blind: blindAcc, full: filed.ledgerKNN };
  await fs.writeTextFile(paths[0], JSON.stringify(b2));
  await fs.writeTextFile(paths[1], JSON.stringify(b3));
  await fs.writeTextFile(paths[2], JSON.stringify(b4));
  await fs.writeTextFile(paths[3], JSON.stringify(b5));
  log("lane2x-x2345 s=" + s + " k=" + JSON.stringify(kacc) + " n=" + JSON.stringify(nacc) + " sh=" + shuf + " bl=" + blindAcc);
  return [b2, b3, b4, b5];
};
// ---- Lane 3 (lane3-v10): gated rungs vs fixed, equal 1200 steps. ----
globalThis.runLane3 = async function (fs, log, seed, arm) {
  const ledgerPath = "src/evidence/decomp/d-lane3-" + arm + "-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.LaneInit(fs);
  const A = TASKS.assocR;
  const model = T.makeModel(G.makeRng(17500 + seed), { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 });
  const opt = new G.Adam(5e-3);
  const dataRng = G.makeRng(17600 + seed + (arm === "gated" ? 1000 : 0));
  const B = 16;
  const r1probe = [];
  { const r = G.makeRng(18000 + seed); for (let i = 0; i < 100; i++) r1probe.push(A.gen(r, 1)); }
  const r2probe = [];
  { const r = G.makeRng(18100 + seed); for (let i = 0; i < 200; i++) r2probe.push(A.gen(r, 1 + r.int(3))); }
  function trainBatch(batch) {
    model.zeroGrad();
    for (let b = 0; b < batch.length; b++) {
      const ex = batch[b];
      const fw = model.forward(ex.x, 1);
      const ce = G.softmaxCE(fw.logits, ex.y);
      const d = ce.dlogits;
      for (let i = 0; i < d.length; i++) d[i] /= batch.length;
      let attnX = null;
      const sup = T.attnSupervision ? T.attnSupervision(ex, fw) : null;
      if (sup) {
        const dw = sup.dw;
        for (let j = 0; j < dw.length; j++) dw[j] /= batch.length;
        attnX = { dw };
      }
      let auxList = null;
      if (fw.cache.posOut) {
        const labs = A.bindLabels(ex.x);
        auxList = new Array(ex.x.length);
        for (let t = 0; t < ex.x.length; t++) {
          if (labs[t] == null) { auxList[t] = null; continue; }
          const ceT = G.softmaxCE(fw.cache.posOut[t].logits, labs[t]);
          const dt = ceT.dlogits;
          for (let i = 0; i < dt.length; i++) dt[i] /= (batch.length * ex.x.length);
          auxList[t] = dt;
        }
      }
      model.backward(d, fw, auxList, attnX, null);
    }
    opt.step(model.params());
  }
  const acc = (data) => T.evaluate(model, data, 1).acc;
  let r1Steps = 0, r2Steps = 0, r3Steps = 0;
  const t0 = Date.now();
  if (arm === "fixed") {
    for (let step = 0; step < 1200; step++) {
      const batch = [];
      for (let b = 0; b < B; b++) batch.push(A.gen(dataRng, 1 + dataRng.int(3)));
      trainBatch(batch);
    }
    r2Steps = 1200;
  } else {
    // R1: 1-pair until probe >= 0.95 or 400 steps
    let gate1 = acc(r1probe);
    while (r1Steps < 400 && gate1 < 0.95) {
      for (let k = 0; k < 50 && r1Steps < 400; k++) {
        const batch = [];
        for (let b = 0; b < B; b++) batch.push(A.gen(dataRng, 1));
        trainBatch(batch);
        r1Steps++;
      }
      gate1 = acc(r1probe);
    }
    // R2: mixed until probe >= 0.90 or +400
    let gate2 = acc(r2probe);
    while (r2Steps < 400 && gate2 < 0.90) {
      for (let k = 0; k < 50 && r2Steps < 400; k++) {
        const batch = [];
        for (let b = 0; b < B; b++) batch.push(A.gen(dataRng, 1 + dataRng.int(3)));
        trainBatch(batch);
        r2Steps++;
      }
      gate2 = acc(r2probe);
    }
    // R3: remainder on 4-pair
    const rest = 1200 - r1Steps - r2Steps;
    for (let step = 0; step < rest; step++) {
      const batch = [];
      for (let b = 0; b < B; b++) batch.push(A.gen(dataRng, 4));
      trainBatch(batch);
      r3Steps++;
    }
  }
  const wallMs = Date.now() - t0;
  const erng = G.makeRng(18200 + seed);
  const inD = [];
  for (let i = 0; i < 200; i++) inD.push(A.gen(erng, 1 + erng.int(3)));
  const long = [];
  for (let i = 0; i < 200; i++) long.push(A.gen(erng, 4));
  const aIn = acc(inD), aLong = acc(long);
  const body = { spec: "lane3-v10", seed, arm, verdict: "COMPLETE", wallMs,
    steps: 1200, r1Steps, r2Steps, r3Steps,
    accIn: +aIn.toFixed(4), accLong: +aLong.toFixed(4) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("lane3 " + arm + " s=" + seed + " r1=" + r1Steps + " r2=" + r2Steps + " r3=" + r3Steps + " in=" + body.accIn + " long=" + body.accLong);
  return body;
};
// ---- Lane 3 v10.1: R3 = reverse-format (unseen), plus revLong transfer test. ----
function lane3RevDistinct(rng, nPairs) {
  const keys = laneShuffle(rng, [0, 1, 2, 3]).slice(0, nPairs);
  const vals = laneShuffle(rng, [0, 1, 2, 3]).slice(0, nPairs);
  const pairs = keys.map((k, i) => [k, vals[i]]);
  const j = rng.int(nPairs);
  const flat = [];
  for (const [k, v] of laneShuffle(rng, pairs.slice())) flat.push(k, 4 + v);
  return { flat, pairs, q: 4 + pairs[j][1], y: pairs[j][0] };
}
globalThis.runLane3b = async function (fs, log, seed, arm) {
  const ledgerPath = "src/evidence/decomp/d-lane3b-" + arm + "-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.LaneInit(fs);
  const A = TASKS.assocR;
  const model = T.makeModel(G.makeRng(17500 + seed), { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 });
  const opt = new G.Adam(5e-3);
  const dataRng = G.makeRng(17600 + seed + (arm === "gated" ? 1000 : 0));
  const B = 16;
  const r1probe = [];
  { const r = G.makeRng(18000 + seed); for (let i = 0; i < 100; i++) r1probe.push(A.gen(r, 1)); }
  const r2probe = [];
  { const r = G.makeRng(18100 + seed); for (let i = 0; i < 200; i++) r2probe.push(A.gen(r, 1 + r.int(3))); }
  function trainBatch(batch) {
    model.zeroGrad();
    for (let b = 0; b < batch.length; b++) {
      const ex = batch[b];
      const fw = model.forward(ex.x, 1);
      const ce = G.softmaxCE(fw.logits, ex.y);
      const d = ce.dlogits;
      for (let i = 0; i < d.length; i++) d[i] /= batch.length;
      let attnX = null;
      const sup = T.attnSupervision ? T.attnSupervision(ex, fw) : null;
      if (sup) {
        const dw = sup.dw;
        for (let j = 0; j < dw.length; j++) dw[j] /= batch.length;
        attnX = { dw };
      }
      let auxList = null;
      if (fw.cache.posOut) {
        const labs = A.bindLabels(ex.x);
        auxList = new Array(ex.x.length);
        for (let t = 0; t < ex.x.length; t++) {
          if (labs[t] == null) { auxList[t] = null; continue; }
          const ceT = G.softmaxCE(fw.cache.posOut[t].logits, labs[t]);
          const dt = ceT.dlogits;
          for (let i = 0; i < dt.length; i++) dt[i] /= (batch.length * ex.x.length);
          auxList[t] = dt;
        }
      }
      model.backward(d, fw, auxList, attnX, null);
    }
    opt.step(model.params());
  }
  const acc = (data) => T.evaluate(model, data, 1).acc;
  let r1Steps = 0, r2Steps = 0, r3Steps = 0;
  const t0 = Date.now();
  if (arm === "fixed") {
    for (let step = 0; step < 1200; step++) {
      const batch = [];
      for (let b = 0; b < B; b++) batch.push(A.gen(dataRng, 1 + dataRng.int(3)));
      trainBatch(batch);
    }
    r2Steps = 1200;
  } else {
    let gate1 = acc(r1probe);
    while (r1Steps < 400 && gate1 < 0.95) {
      for (let k = 0; k < 50 && r1Steps < 400; k++) {
        const batch = [];
        for (let b = 0; b < B; b++) batch.push(A.gen(dataRng, 1));
        trainBatch(batch);
        r1Steps++;
      }
      gate1 = acc(r1probe);
    }
    let gate2 = acc(r2probe);
    while (r2Steps < 400 && gate2 < 0.90) {
      for (let k = 0; k < 50 && r2Steps < 400; k++) {
        const batch = [];
        for (let b = 0; b < B; b++) batch.push(A.gen(dataRng, 1 + dataRng.int(3)));
        trainBatch(batch);
        r2Steps++;
      }
      gate2 = acc(r2probe);
    }
    const rest = 1200 - r1Steps - r2Steps;
    for (let step = 0; step < rest; step++) {
      const batch = [];
      for (let b = 0; b < B; b++) { const r = lane3RevDistinct(dataRng, 1 + dataRng.int(3)); batch.push({ x: r.flat.concat([r.q, 8]), y: r.y }); }
      trainBatch(batch);
      r3Steps++;
    }
  }
  const wallMs = Date.now() - t0;
  const erng = G.makeRng(18200 + seed);
  const inD = [];
  for (let i = 0; i < 200; i++) inD.push(A.gen(erng, 1 + erng.int(3)));
  const frng = G.makeRng(18300 + seed);
  const flong = [];
  for (let i = 0; i < 200; i++) flong.push(A.gen(frng, 4));
  const grng = G.makeRng(18400 + seed);
  const rev = [];
  for (let i = 0; i < 200; i++) { const r = lane3RevDistinct(grng, 1 + grng.int(3)); rev.push({ x: r.flat.concat([r.q, 8]), y: r.y }); }
  const hrng = G.makeRng(18500 + seed);
  const revLong = [];
  for (let i = 0; i < 200; i++) { const r = lane3RevDistinct(hrng, 4); revLong.push({ x: r.flat.concat([r.q, 8]), y: r.y }); }
  const aIn = acc(inD), aFl = acc(flong), aRev = acc(rev), aRL = acc(revLong);
  const body = { spec: "lane3-v10.1", seed, arm, verdict: "COMPLETE", wallMs,
    steps: 1200, r1Steps, r2Steps, r3Steps,
    accIn: +aIn.toFixed(4), accFlong: +aFl.toFixed(4), accRev: +aRev.toFixed(4), accRevLong: +aRL.toFixed(4) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("lane3b " + arm + " s=" + seed + " r1=" + r1Steps + " r2=" + r2Steps + " r3=" + r3Steps + " in=" + body.accIn + " fl=" + body.accFlong + " rev=" + body.accRev + " rl=" + body.accRevLong);
  return body;
};
// ---- Lane 3 extras (lane3x-v10): shared gated trainer. ----
function lane3BatchTrainer(G, T, A, model, opt, dataRng, mkBatch) {
  const B = 16;
  model.zeroGrad();
  const batch = mkBatch(B);
  for (let b = 0; b < batch.length; b++) {
    const ex = batch[b];
    const fw = model.forward(ex.x, 1);
    const ce = G.softmaxCE(fw.logits, ex.y);
    const d = ce.dlogits;
    for (let i = 0; i < d.length; i++) d[i] /= batch.length;
    let attnX = null;
    const sup = T.attnSupervision ? T.attnSupervision(ex, fw) : null;
    if (sup) {
      const dw = sup.dw;
      for (let j = 0; j < dw.length; j++) dw[j] /= batch.length;
      attnX = { dw };
    }
    let auxList = null;
    if (fw.cache.posOut) {
      const labs = A.bindLabels(ex.x);
      auxList = new Array(ex.x.length);
      for (let t = 0; t < ex.x.length; t++) {
        if (labs[t] == null) { auxList[t] = null; continue; }
        const ceT = G.softmaxCE(fw.cache.posOut[t].logits, labs[t]);
        const dt = ceT.dlogits;
        for (let i = 0; i < dt.length; i++) dt[i] /= (batch.length * ex.x.length);
        auxList[t] = dt;
      }
    }
    model.backward(d, fw, auxList, attnX, null);
  }
  opt.step(model.params());
}
function lane3RunGated(G, T, A, model, opt, dataRng, cfg) {
  // cfg: {gate1,r1cap,gate2,r2cap,r3mix,r3steps (null=remainder),r3select}
  const B = 16;
  const r1probe = [];
  { const r = G.makeRng(18000 + cfg.seed); for (let i = 0; i < 100; i++) r1probe.push(A.gen(r, 1)); }
  const r2probe = [];
  { const r = G.makeRng(18100 + cfg.seed); for (let i = 0; i < 200; i++) r2probe.push(A.gen(r, 1 + r.int(3))); }
  const acc = (data) => T.evaluate(model, data, 1).acc;
  const mkFwd = () => A.gen(dataRng, 1 + dataRng.int(3));
  const mkRev = () => { const r = lane3RevDistinct(dataRng, 1 + dataRng.int(3)); return { x: r.flat.concat([r.q, 8]), y: r.y }; };
  const mkR3 = () => {
    if (!cfg.r3select && !(cfg.r3mix > 0)) {
      const out = [];
      for (let b = 0; b < B; b++) out.push(mkRev());
      return out;
    }
    if (cfg.r3select === "ce") {
      const cands = [];
      for (let b = 0; b < 2 * B; b++) cands.push(mkRev());
      const scored = cands.map((ex) => ({ ex, loss: G.softmaxCE(model.forward(ex.x, 1).logits, ex.y).loss }));
      scored.sort((a, b2) => b2.loss - a.loss);
      return scored.slice(0, B).map((s) => s.ex);
    }
    const out = [];
    for (let b = 0; b < B; b++) out.push(dataRng.uniform(0, 1) < cfg.r3mix ? mkFwd() : mkRev());
    return out;
  };
  let r1Steps = 0, r2Steps = 0, r3Steps = 0;
  let gate1 = acc(r1probe);
  while (r1Steps < cfg.r1cap && gate1 < cfg.gate1) {
    for (let k = 0; k < 50 && r1Steps < cfg.r1cap; k++) {
      const batch = [];
      for (let b = 0; b < B; b++) batch.push(A.gen(dataRng, 1));
      lane3BatchTrainer(G, T, A, model, opt, dataRng, () => batch);
      r1Steps++;
    }
    gate1 = acc(r1probe);
  }
  let gate2 = acc(r2probe);
  while (r2Steps < cfg.r2cap && gate2 < cfg.gate2) {
    for (let k = 0; k < 50 && r2Steps < cfg.r2cap; k++) {
      const batch = [];
      for (let b = 0; b < B; b++) batch.push(A.gen(dataRng, 1 + dataRng.int(3)));
      lane3BatchTrainer(G, T, A, model, opt, dataRng, () => batch);
      r2Steps++;
    }
    gate2 = acc(r2probe);
  }
  const total = cfg.r3steps != null ? cfg.r3steps : (1200 - r1Steps - r2Steps);
  for (let step = 0; step < total; step++) {
    lane3BatchTrainer(G, T, A, model, opt, dataRng, mkR3);
    r3Steps++;
  }
  return { r1Steps, r2Steps, r3Steps };
}
function lane3Evals(G, T, A, model, seed) {
  const erng = G.makeRng(18200 + seed);
  const inD = [];
  for (let i = 0; i < 200; i++) inD.push(A.gen(erng, 1 + erng.int(3)));
  const frng = G.makeRng(18300 + seed);
  const flong = [];
  for (let i = 0; i < 200; i++) flong.push(A.gen(frng, 4));
  const grng = G.makeRng(18400 + seed);
  const rev = [];
  for (let i = 0; i < 200; i++) { const r = lane3RevDistinct(grng, 1 + grng.int(3)); rev.push({ x: r.flat.concat([r.q, 8]), y: r.y }); }
  const hrng = G.makeRng(18500 + seed);
  const revLong = [];
  for (let i = 0; i < 200; i++) { const r = lane3RevDistinct(hrng, 4); revLong.push({ x: r.flat.concat([r.q, 8]), y: r.y }); }
  const acc = (data) => T.evaluate(model, data, 1).acc;
  return { accIn: +acc(inD).toFixed(4), accFlong: +acc(flong).toFixed(4), accRev: +acc(rev).toFixed(4), accRevLong: +acc(revLong).toFixed(4) };
}
globalThis.runLane3X1 = async function (fs, log, seed) {
  const ledgerPath = "src/evidence/decomp/d-lane3x-x1-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.LaneInit(fs);
  const A = TASKS.assocR;
  const model = T.makeModel(G.makeRng(17500 + seed), { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 });
  const opt = new G.Adam(5e-3);
  const dataRng = G.makeRng(17600 + seed + 1000);
  const t0 = Date.now();
  const steps = lane3RunGated(G, T, A, model, opt, dataRng, { seed, gate1: 0.95, r1cap: 400, gate2: 0.90, r2cap: 400, r3mix: 0.25, r3steps: null, r3select: null });
  const e = lane3Evals(G, T, A, model, seed);
  const body = Object.assign({ spec: "lane3x-v10-x1", seed, verdict: "COMPLETE", wallMs: Date.now() - t0 }, steps, e);
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("lane3x-x1 s=" + seed + " " + JSON.stringify(e));
  return body;
};
globalThis.runLane3X2 = async function (fs, log, seed) {
  const ledgerPath = "src/evidence/decomp/d-lane3x-x2-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.LaneInit(fs);
  const A = TASKS.assocR;
  const model = T.makeModel(G.makeRng(17500 + seed), { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 });
  const opt = new G.Adam(5e-3);
  const dataRng = G.makeRng(17600 + seed + 1000);
  const t0 = Date.now();
  const steps = lane3RunGated(G, T, A, model, opt, dataRng, { seed, gate1: 0.95, r1cap: 400, gate2: 0.90, r2cap: 400, r3mix: 0, r3steps: 200, r3select: null });
  const e = lane3Evals(G, T, A, model, seed);
  const body = Object.assign({ spec: "lane3x-v10-x2", seed, verdict: "COMPLETE", wallMs: Date.now() - t0 }, steps, e);
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("lane3x-x2 s=" + seed + " " + JSON.stringify(e));
  return body;
};
globalThis.runLane3X3 = async function (fs, log, seed, arm) {
  const ledgerPath = "src/evidence/decomp/d-lane3x-x3" + arm + "-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.LaneInit(fs);
  const A = TASKS.assocR;
  const model = T.makeModel(G.makeRng(17500 + seed), { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 });
  const opt = new G.Adam(5e-3);
  const dataRng = G.makeRng(17600 + seed + (arm === "ce" ? 2000 : 0));
  const t0 = Date.now();
  const steps = lane3RunGated(G, T, A, model, opt, dataRng, { seed, gate1: 0.95, r1cap: 400, gate2: 0.90, r2cap: 400, r3mix: 0, r3steps: 800, r3select: arm === "ce" ? "ce" : null });
  const e = lane3Evals(G, T, A, model, seed);
  const body = Object.assign({ spec: "lane3x-v10-x3" + arm, seed, arm, verdict: "COMPLETE", wallMs: Date.now() - t0 }, steps, e);
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("lane3x-x3" + arm + " s=" + seed + " " + JSON.stringify(e));
  return body;
};
globalThis.runLane3X4 = async function (fs, log, seed) {
  const ledgerPath = "src/evidence/decomp/d-lane3x-x4-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.LaneInit(fs);
  const A = TASKS.assocR;
  const model = T.makeModel(G.makeRng(17500 + seed), { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 });
  const opt = new G.Adam(5e-3);
  const dataRng = G.makeRng(17600 + seed + 1000);
  const t0 = Date.now();
  const steps = lane3RunGated(G, T, A, model, opt, dataRng, { seed, gate1: 0.95, r1cap: 400, gate2: 0.90, r2cap: 400, r3mix: 0, r3steps: null, r3select: null });
  for (let step = 0; step < 100; step++) {
    lane3BatchTrainer(G, T, A, model, opt, dataRng, () => {
      const out = [];
      for (let b = 0; b < 16; b++) out.push(A.gen(dataRng, 1 + dataRng.int(3)));
      return out;
    });
  }
  const e = lane3Evals(G, T, A, model, seed);
  const body = Object.assign({ spec: "lane3x-v10-x4", seed, verdict: "COMPLETE", wallMs: Date.now() - t0, extraFwd: 100 }, steps, e);
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("lane3x-x4 s=" + seed + " " + JSON.stringify(e));
  return body;
};
globalThis.runLane3X5 = async function (fs, log, seed) {  const ledgerPath = "src/evidence/decomp/d-lane3x-x5-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.LaneInit(fs);
  const A = TASKS.assocR;
  const model = T.makeModel(G.makeRng(17500 + seed), { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 });
  const opt = new G.Adam(5e-3);
  const dataRng = G.makeRng(17600 + seed + 1000);
  const t0 = Date.now();
  const steps = lane3RunGated(G, T, A, model, opt, dataRng, { seed, gate1: 0.95, r1cap: 400, gate2: 0.99, r2cap: 400, r3mix: 0, r3steps: null, r3select: null });
  const e = lane3Evals(G, T, A, model, seed);
  const body = Object.assign({ spec: "lane3x-v10-x5", seed, verdict: "COMPLETE", wallMs: Date.now() - t0 }, steps, e);
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("lane3x-x5 s=" + seed + " " + JSON.stringify(steps) + " " + JSON.stringify(e));
  return body;
};
// ---- Lane 1 (lane1-v10): representational fade. Reuses bottleneck-driver fns. ----
globalThis.runLane1Train = async function (fs, log, arm, seed) {
  const ledgerPath = "src/evidence/decomp/d-lane1-train-" + arm + "-K4-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  globalThis.window = globalThis;
  const bnSrc = await fs.readTextFile("src/evidence/decomp/bottleneck-driver.js");
  (0, eval)(bnSrc + "\n//# sourceURL=bottleneck-driver");
  const { G, T } = await globalThis.BottleneckInit(fs);
  const K = 4, sigma = 0.5, steps = 8000, B = 8, lr = 1e-3, tutorSeed = seed;
  const tut = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-novel-tutor-s" + tutorSeed + ".json"));
  const teacher = T.makeModel(G.makeRng(tut.trainSeed), tut.arch);
  { const ps = teacher.params();
    for (let i = 0; i < ps.length; i++) {
      const dst = ps[i].v !== undefined ? ps[i].v : ps[i];
      const src = tut.params[i];
      for (let j = 0; j < dst.length; j++) dst[j] = src[j];
    } }
  const initRng = G.makeRng(32000 + seed * 7919 + (arm === "fade" ? 1 : arm === "const" ? 2 : 3));
  const P = { W: bnParam(initRng, K * 48, 48), b: bnParam(initRng, K, 48) };
  const S = { W1: bnParam(initRng, (K + 9) * 96, K + 9), b1: bnParam(initRng, 96, K + 9),
              W2: bnParam(initRng, 96 * 4, 96), b2: bnParam(initRng, 4, 96) };
  const AW = bnParam(initRng, K * 3, K), Ab = bnParam(initRng, 3, K);
  const params = [P.W, P.b, S.W1, S.b1, S.W2, S.b2, AW, Ab];
  const opt = new G.Adam(lr);
  const dataRng = G.makeRng(31000 + seed * 104729);
  const noiseRng = G.makeRng(33000 + seed * 99991);
  const t0 = Date.now();
  const curve = [];
  for (let step = 0; step < steps; step++) {
    const w = arm === "fade" ? 1 - step / steps : arm === "const" ? 1 : 0;
    for (const p of params) p.g.fill(0);
    let lsum = 0, asum = 0;
    for (let b = 0; b < B; b++) {
      const L = bnGenReverse(dataRng, 1 + dataRng.int(3));
      const npairs = (L.x.length - 2) / 2;
      const fw = teacher.forward(L.x, 1);
      const state = Array.from(fw.cache.rC.y);
      const msg = bnChannelFwd(P, K, state, noiseRng, sigma);
      const sf = bnStudentFwd(S, K, msg, L.x[L.x.length - 2]);
      let mx = -1e300;
      for (let i = 0; i < 4; i++) if (sf.logits[i] > mx) mx = sf.logits[i];
      const pr = new Float64Array(4);
      let s = 0;
      for (let i = 0; i < 4; i++) { pr[i] = Math.exp(sf.logits[i] - mx); s += pr[i]; }
      for (let i = 0; i < 4; i++) pr[i] /= s;
      lsum += -Math.log(pr[L.y] + 1e-12);
      const dz = new Float64Array(4);
      for (let i = 0; i < 4; i++) dz[i] = (pr[i] - (i === L.y ? 1 : 0)) / B;
      bnBackward(S, P, K, sf, msg, state, dz);
      if (w > 0) {
        const al = new Float64Array(3);
        for (let c = 0; c < 3; c++) {
          let v = Ab.v[c];
          for (let k = 0; k < K; k++) v += AW.v[c * K + k] * msg[k];
          al[c] = v;
        }
        let amx = al[0];
        for (let c = 1; c < 3; c++) if (al[c] > amx) amx = al[c];
        const ap = new Float64Array(3);
        let asum2 = 0;
        for (let c = 0; c < 3; c++) { ap[c] = Math.exp(al[c] - amx); asum2 += ap[c]; }
        for (let c = 0; c < 3; c++) ap[c] /= asum2;
        const lab = npairs - 1;
        asum += -Math.log(ap[lab] + 1e-12);
        const daz = new Float64Array(3);
        for (let c = 0; c < 3; c++) daz[c] = (w * (ap[c] - (c === lab ? 1 : 0))) / B;
        const dmAux = new Float64Array(K);
        for (let c = 0; c < 3; c++) {
          Ab.g[c] += daz[c];
          for (let k = 0; k < K; k++) { AW.g[c * K + k] += daz[c] * msg[k]; dmAux[k] += daz[c] * AW.v[c * K + k]; }
        }
        for (let k = 0; k < K; k++) {
          P.b.g[k] += dmAux[k];
          for (let j = 0; j < 48; j++) P.W.g[k * 48 + j] += dmAux[k] * state[j];
        }
      }
    }
    opt.step(params);
    if (step % 400 === 0 || step === steps - 1) curve.push({ step, loss: +(lsum / B).toFixed(6), auxLoss: +(asum / B).toFixed(6) });
  }
  const saveP = (o) => Array.from(o.v);
  const body = { spec: "lane1-v10", arm, verdict: "COMPLETE", K, sigma, seed, tutorSeed, steps, B, lr,
    wallMs: Date.now() - t0, curve,
    P: { W: saveP(P.W), b: saveP(P.b) },
    St: { W1: saveP(S.W1), b1: saveP(S.b1), W2: saveP(S.W2), b2: saveP(S.b2) },
    Aux: { W: saveP(AW), b: saveP(Ab) } };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("lane1-train " + arm + " s=" + seed + " done lossN=" + curve[curve.length - 1].loss);
  return body;
};
globalThis.runLane1Eval = async function (fs, log, arm, seed) {  const ledgerPath = "src/evidence/decomp/d-lane1-eval-" + arm + "-K4-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  globalThis.window = globalThis;
  const bnSrc = await fs.readTextFile("src/evidence/decomp/bottleneck-driver.js");
  (0, eval)(bnSrc + "\n//# sourceURL=bottleneck-driver");
  const { G, T } = await globalThis.BottleneckInit(fs);
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-lane1-train-" + arm + "-K4-s" + seed + ".json"));
  if (tr.verdict !== "COMPLETE") throw new Error("lane1 train missing " + arm + " s" + seed);
  const tut = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-novel-tutor-s" + tr.tutorSeed + ".json"));
  const teacher = T.makeModel(G.makeRng(tut.trainSeed), tut.arch);
  { const ps = teacher.params();
    for (let i = 0; i < ps.length; i++) {
      const dst = ps[i].v !== undefined ? ps[i].v : ps[i];
      const src = tut.params[i];
      for (let j = 0; j < dst.length; j++) dst[j] = src[j];
    } }
  const K = 4, sigma = 0.5;
  const P = { W: { v: Float64Array.from(tr.P.W) }, b: { v: Float64Array.from(tr.P.b) } };
  const S = { W1: { v: Float64Array.from(tr.St.W1) }, b1: { v: Float64Array.from(tr.St.b1) },
              W2: { v: Float64Array.from(tr.St.W2) }, b2: { v: Float64Array.from(tr.St.b2) } };
  const testRng = G.makeRng(34000 + seed * 13 + tr.tutorSeed);
  const noiseRng = G.makeRng(36000 + seed * 17);
  const N = 200;
  const items = [];
  for (let i = 0; i < N; i++) {
    const L = bnGenReverse(testRng, 1 + testRng.int(3));
    const fw = teacher.forward(L.x, 1);
    const msg = bnChannelFwd(P, K, Array.from(fw.cache.rC.y), noiseRng, sigma);
    items.push({ y: L.y, q: L.x[L.x.length - 2], msg });
  }
  const accUnder = (lesion) => items.filter((it) => {
    const m = Float64Array.from(it.msg);
    if (lesion != null) m[lesion] = 0;
    const sf = bnStudentFwd(S, K, m, it.q);
    let b = 0;
    for (let i = 1; i < 4; i++) if (sf.logits[i] > sf.logits[b]) b = i;
    return b === it.y;
  }).length / items.length;
  const aIntact = accUnder(null);
  const lesions = [0, 1, 2, 3].map((k) => +accUnder(k).toFixed(4));
  const scr = items.map((it) => it.msg);
  bnShuffleIn(G.makeRng(35000 + seed), scr);
  const aScr = items.map((it, i) => ({ y: it.y, q: it.q, msg: scr[i] })).filter((it) => {
    const sf = bnStudentFwd(S, K, it.msg, it.q);
    let b = 0;
    for (let i = 1; i < 4; i++) if (sf.logits[i] > sf.logits[b]) b = i;
    return b === it.y;
  }).length / items.length;
  const drops = lesions.map((a) => +(aIntact - a).toFixed(4));
  const body = { spec: "lane1-v10", arm, verdict: "COMPLETE", K, sigma, seed, n: N,
    accIntact: +aIntact.toFixed(4), accScrambled: +aScr.toFixed(4), lesions, maxDrop: Math.max.apply(null, drops) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("lane1-eval " + arm + " s=" + seed + " intact=" + body.accIntact + " scr=" + body.accScrambled + " maxDrop=" + body.maxDrop);
  return body;
};
// ---- COMPOSITE v10.1: channel + gated mixed curriculum + full-map price + CE-select. ----
globalThis.runCompositeTrain = async function (fs, log, arm, seed, Kin, R2cap) {
  const K = Kin || 4;
  const kTag = K === 4 ? 0 : K * 1000;
  const ledgerPath = K === 4
    ? "src/evidence/decomp/d-composite-" + arm + "-s" + seed + ".json"
    : "src/evidence/decomp/d-composite-" + arm + "-K" + K + "-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  globalThis.window = globalThis;
  const bnSrc = await fs.readTextFile("src/evidence/decomp/bottleneck-driver.js");
  (0, eval)(bnSrc + "\n//# sourceURL=bottleneck-driver");
  const { G, T, TASKS } = await globalThis.BottleneckInit(fs);
  const A = TASKS.assocR;
  const sigma = 0.5, steps = 8000, B = 8, lr = 1e-3;
  const tut = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-novel-tutor-s" + seed + ".json"));
  const teacher = T.makeModel(G.makeRng(tut.trainSeed), tut.arch);
  { const ps = teacher.params();
    for (let i = 0; i < ps.length; i++) {
      const dst = ps[i].v !== undefined ? ps[i].v : ps[i];
      const src = tut.params[i];
      for (let j = 0; j < dst.length; j++) dst[j] = src[j];
    } }
  const initRng = G.makeRng(42000 + kTag + seed * 7919 + (arm === "a" || arm === "ashort" ? 1 : arm === "c" || arm === "cshort" ? 2 : arm === "e" ? 5 : arm === "d" ? 4 : 3));
  const P = { W: bnParam(initRng, K * 48, 48), b: bnParam(initRng, K, 48) };
  const S = { W1: bnParam(initRng, (K + 9) * 96, K + 9), b1: bnParam(initRng, 96, K + 9),
              W2: bnParam(initRng, 96 * 4, 96), b2: bnParam(initRng, 4, 96) };
  const U = bnParam(initRng, 4 * 5 * K, K), Ub = bnParam(initRng, 4 * 5, K);
  const params = [P.W, P.b, S.W1, S.b1, S.W2, S.b2, U, Ub];
  const opt = new G.Adam(lr);
  const dataRng = G.makeRng(41000 + kTag + seed * 104729);
  const noiseRng = G.makeRng(43000 + kTag + seed * 99991);
  const priceOn = arm !== "b" && arm !== "d";
  const selectOn = arm === "a" || arm === "e" || arm === "d" || arm === "ashort";
  const replayOn = arm !== "b";
  const fadeOn = arm === "e";
  function towerOf(L) {
    const fw = teacher.forward(L.x, 1);
    const state = Array.from(fw.cache.rC.y);
    const msg = bnChannelFwd(P, K, state, noiseRng, sigma);
    const sf = bnStudentFwd(S, K, msg, L.x[L.x.length - 2]);
    return { state, msg, sf };
  }
  function answerGrads(L, tw, B) {
    let mx = -1e300;
    for (let i = 0; i < 4; i++) if (tw.sf.logits[i] > mx) mx = tw.sf.logits[i];
    const pr = new Float64Array(4);
    let s = 0;
    for (let i = 0; i < 4; i++) { pr[i] = Math.exp(tw.sf.logits[i] - mx); s += pr[i]; }
    for (let i = 0; i < 4; i++) pr[i] /= s;
    const dz = new Float64Array(4);
    for (let i = 0; i < 4; i++) dz[i] = (pr[i] - (i === L.y ? 1 : 0)) / B;
    bnBackward(S, P, K, tw.sf, tw.msg, tw.state, dz);
    return pr;
  }
  function fullMapOf(L) {
    // L may be forward (A.gen: keys distinct, query=key) or reverse (bnGenReverse).
    // Reconstruct pairs from flat: even/odd positions before last two tokens.
    const map = [4, 4, 4, 4];
    for (let t = 0; t < L.x.length - 2; t += 2) {
      const k = L.x[t], v = L.x[t + 1] - 4;
      if (k >= 0 && k < 4 && v >= 0 && v < 4) map[k] = v;
    }
    return map;
  }
  function priceGrads(L, tw, B, w) {
    const ww = w === undefined ? 1 : w;
    const map = fullMapOf(L);
    const dmAux = new Float64Array(K);
    for (let i = 0; i < 4; i++) {
      const al = new Float64Array(5);
      for (let c = 0; c < 5; c++) {
        let v = Ub.v[i * 5 + c];
        for (let k = 0; k < K; k++) v += U.v[(i * 5 + c) * K + k] * tw.msg[k];
        al[c] = v;
      }
      let amx = al[0];
      for (let c = 1; c < 5; c++) if (al[c] > amx) amx = al[c];
      const ap = new Float64Array(5);
      let s2 = 0;
      for (let c = 0; c < 5; c++) { ap[c] = Math.exp(al[c] - amx); s2 += ap[c]; }
      for (let c = 0; c < 5; c++) ap[c] /= s2;
      const daz = new Float64Array(5);
      for (let c = 0; c < 5; c++) daz[c] = (ww * (ap[c] - (c === map[i] ? 1 : 0))) / (B * 4);
      for (let c = 0; c < 5; c++) {
        Ub.g[i * 5 + c] += daz[c];
        for (let k = 0; k < K; k++) { U.g[(i * 5 + c) * K + k] += daz[c] * tw.msg[k]; dmAux[k] += daz[c] * U.v[(i * 5 + c) * K + k]; }
      }
    }
    for (let k = 0; k < K; k++) {
      P.b.g[k] += dmAux[k];
      for (let j = 0; j < 48; j++) P.W.g[k * 48 + j] += dmAux[k] * tw.state[j];
    }
  }
  const r1probe = [];
  { const r = G.makeRng(18000 + seed); for (let i = 0; i < 200; i++) r1probe.push(A.gen(r, 1 + r.int(3))); }
  const t0 = Date.now();
  let r1Steps = 0;
  const probeAcc = () => {
    let right = 0;
    for (const ex of r1probe) {
      const tw = towerOf(ex);
      let b = 0;
      for (let i = 1; i < 4; i++) if (tw.sf.logits[i] > tw.sf.logits[b]) b = i;
      if (b === ex.y) right++;
    }
    return right / r1probe.length;
  };
  let g = probeAcc();
  const curve = [];
  while (r1Steps < 2500 && g < 0.90) {
    for (let k = 0; k < 50 && r1Steps < 2500; k++) {
      for (const p of params) p.g.fill(0);
      for (let b = 0; b < B; b++) {
        const L = A.gen(dataRng, 1 + dataRng.int(3));
        const tw = towerOf(L);
        answerGrads(L, tw, B);
      }
      opt.step(params);
      r1Steps++;
    }
    g = probeAcc();
    curve.push({ step: r1Steps, gate: +g.toFixed(4) });
  }
  const r2Total = R2cap != null ? R2cap : steps - r1Steps;
  const mkRevLine = () => bnGenReverse(dataRng, 1 + dataRng.int(3));
  for (let step = 0; step < r2Total; step++) {
    for (const p of params) p.g.fill(0);
    let batch = [];
    if (selectOn) {
      const cands = [];
      for (let b = 0; b < 12; b++) cands.push(mkRevLine());
      const scored = cands.map((L) => {
        const tw = towerOf(L);
        let mx = -1e300;
        for (let i = 0; i < 4; i++) if (tw.sf.logits[i] > mx) mx = tw.sf.logits[i];
        let s = 0;
        for (let i = 0; i < 4; i++) s += Math.exp(tw.sf.logits[i] - mx);
        return { L, loss: -Math.log(Math.exp(tw.sf.logits[L.y] - mx) / s + 1e-12), tw };
      });
      scored.sort((x, y) => y.loss - x.loss);
      batch = scored.slice(0, 6).map((s2) => ({ L: s2.L, tw: s2.tw }));
      for (let b = 0; b < 2; b++) { const L = A.gen(dataRng, 1 + dataRng.int(3)); batch.push({ L, tw: towerOf(L) }); }
    } else if (replayOn) {
      for (let b = 0; b < 6; b++) { const L = mkRevLine(); batch.push({ L, tw: towerOf(L) }); }
      for (let b = 0; b < 2; b++) { const L = A.gen(dataRng, 1 + dataRng.int(3)); batch.push({ L, tw: towerOf(L) }); }
    } else {
      for (let b = 0; b < B; b++) { const L = mkRevLine(); batch.push({ L, tw: towerOf(L) }); }
    }
    for (const { L, tw } of batch) {
      answerGrads(L, tw, batch.length);
      if (priceOn) priceGrads(L, tw, batch.length, fadeOn ? 1 - step / r2Total : 1);
    }
    opt.step(params);
    if (step % 400 === 0) curve.push({ step: r1Steps + step });
  }
  const saveP = (o) => Array.from(o.v);
  const r2Steps = r2Total;
  const body = { spec: "composite-v10.1", arm, verdict: "COMPLETE", K, sigma, seed, steps: r1Steps + r2Total, B, lr,
    wallMs: Date.now() - t0, r1Steps, r2Steps, gate: +g.toFixed(4), curve,
    P: { W: saveP(P.W), b: saveP(P.b) },
    St: { W1: saveP(S.W1), b1: saveP(S.b1), W2: saveP(S.W2), b2: saveP(S.b2) },
    Head: { W: saveP(U), b: saveP(Ub) } };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("composite-train " + arm + " s=" + seed + " r1=" + r1Steps + " gate=" + body.gate);
  return body;
};
globalThis.runCompositeEval = async function (fs, log, arm, seed, Kin) {
  const Kq = Kin || 0;
  const ledgerPath = Kq
    ? "src/evidence/decomp/d-composite-eval-" + arm + "-K" + Kq + "-s" + seed + ".json"
    : "src/evidence/decomp/d-composite-eval-" + arm + "-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  globalThis.window = globalThis;
  const bnSrc = await fs.readTextFile("src/evidence/decomp/bottleneck-driver.js");
  (0, eval)(bnSrc + "\n//# sourceURL=bottleneck-driver");
  const { G, T, TASKS } = await globalThis.BottleneckInit(fs);
  const A = TASKS.assocR;
  const trPath = Kq
    ? "src/evidence/decomp/d-composite-" + arm + "-K" + Kq + "-s" + seed + ".json"
    : "src/evidence/decomp/d-composite-" + arm + "-s" + seed + ".json";
  const tr = JSON.parse(await fs.readTextFile(trPath));
  if (tr.verdict !== "COMPLETE") throw new Error("composite train missing " + arm + " s" + seed);
  const tut = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-novel-tutor-s" + seed + ".json"));
  const teacher = T.makeModel(G.makeRng(tut.trainSeed), tut.arch);
  { const ps = teacher.params();
    for (let i = 0; i < ps.length; i++) {
      const dst = ps[i].v !== undefined ? ps[i].v : ps[i];
      const src = tut.params[i];
      for (let j = 0; j < dst.length; j++) dst[j] = src[j];
    } }
  const K = tr.K || 4, sigma = 0.5;
  const armN = { a: 1, c: 2, b: 3, d: 4, e: 5, ashort: 6, cshort: 7 }[arm] || 9;
  const P = { W: { v: Float64Array.from(tr.P.W) }, b: { v: Float64Array.from(tr.P.b) } };
  const S = { W1: { v: Float64Array.from(tr.St.W1) }, b1: { v: Float64Array.from(tr.St.b1) },
              W2: { v: Float64Array.from(tr.St.W2) }, b2: { v: Float64Array.from(tr.St.b2) } };
  const noiseRng = G.makeRng(46000 + (tr.K === 4 || !tr.K ? 0 : tr.K * 1000) + seed * 17 + armN);
  function batt(gen, n, rng) {
    const items = [];
    for (let i = 0; i < n; i++) {
      const L = gen(rng);
      const fw = teacher.forward(L.x, 1);
      items.push({ y: L.y, q: L.x[L.x.length - 2], msg: bnChannelFwd(P, K, Array.from(fw.cache.rC.y), noiseRng, sigma) });
    }
    return items;
  }
  const frng = G.makeRng(44000 + seed);
  const fwd = batt((r) => A.gen(r, 1 + r.int(3)), 200, frng);
  const lrng = G.makeRng(44100 + seed);
  const flong = batt((r) => A.gen(r, 4), 200, lrng);
  const grng = G.makeRng(44200 + seed);
  const rev = batt((r) => bnGenReverse(r, 1 + r.int(3)), 200, grng);
  const hrng = G.makeRng(44300 + seed);
  const revlong = batt((r) => bnGenReverse(r, 4), 200, hrng);
  const acc = (arr) => arr.filter((it) => {
    const sf = bnStudentFwd(S, K, it.msg, it.q);
    let b = 0;
    for (let i = 1; i < 4; i++) if (sf.logits[i] > sf.logits[b]) b = i;
    return b === it.y;
  }).length / arr.length;
  const scr = fwd.map((it) => it.msg);
  bnShuffleIn(G.makeRng(45000 + seed), scr);
  const aScr = acc(fwd.map((it, i) => ({ y: it.y, q: it.q, msg: scr[i] })));
  const body = { spec: "composite-v10.1", arm, verdict: "COMPLETE", seed, n: 200,
    accFwd: +acc(fwd).toFixed(4), accFlong: +acc(flong).toFixed(4),
    accRev: +acc(rev).toFixed(4), accRevLong: +acc(revlong).toFixed(4), accScr: +aScr.toFixed(4) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("composite-eval " + arm + " s=" + seed + " " + JSON.stringify(body));
  return body;
};
// ---- Lane 1 extras (lane1x-v10): ABORT autopsy, frozen only. ----
globalThis.runLane1X = async function (fs, log, seed) {
  for (const p of ["src/evidence/decomp/d-lane1x-x1-s" + seed + ".json", "src/evidence/decomp/d-lane1x-x2-s" + seed + ".json"]) {
    try {
      const prev = JSON.parse(await fs.readTextFile(p));
      if (prev && prev.verdict === "COMPLETE") log(p + " exists");
    } catch (e) { /* run */ }
  }
  let done1 = false, done2 = false;
  try { done1 = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-lane1x-x1-s" + seed + ".json")).verdict === "COMPLETE"; } catch (e) {}
  try { done2 = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-lane1x-x2-s" + seed + ".json")).verdict === "COMPLETE"; } catch (e) {}
  if (done1 && done2) { log("lane1x s=" + seed + " exists, skip"); return { seed }; }
  globalThis.window = globalThis;
  const bnSrc = await fs.readTextFile("src/evidence/decomp/bottleneck-driver.js");
  (0, eval)(bnSrc + "\n//# sourceURL=bottleneck-driver");
  const { G, T } = await globalThis.BottleneckInit(fs);
  const K = 4, sigma = 0.5;
  const arms = {};
  for (const arm of ["fade", "const", "noaux"]) {
    const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-lane1-train-" + arm + "-K4-s" + seed + ".json"));
    const tut = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-novel-tutor-s" + tr.tutorSeed + ".json"));
    const teacher = T.makeModel(G.makeRng(tut.trainSeed), tut.arch);
    { const ps = teacher.params();
      for (let i = 0; i < ps.length; i++) {
        const dst = ps[i].v !== undefined ? ps[i].v : ps[i];
        const src = tut.params[i];
        for (let j = 0; j < dst.length; j++) dst[j] = src[j];
      } }
    arms[arm] = { P: { W: { v: Float64Array.from(tr.P.W) }, b: { v: Float64Array.from(tr.P.b) } },
      Aux: tr.Aux ? { W: Float64Array.from(tr.Aux.W), b: Float64Array.from(tr.Aux.b) } : null,
      teacher };
  }
  function genMsgs(P, teacher, rng, noiseRng, n) {
    const out = [];
    for (let i = 0; i < n; i++) {
      const L = bnGenReverse(rng, 1 + rng.int(3));
      const npairs = (L.x.length - 2) / 2;
      const fw = teacher.forward(L.x, 1);
      out.push({ msg: bnChannelFwd(P, K, Array.from(fw.cache.rC.y), noiseRng, sigma), npairs: npairs - 1 });
    }
    return out;
  }
  const headAcc = {};
  for (const arm of ["fade", "const"]) {
    const A0 = arms[arm];
    const test = genMsgs(A0.P, A0.teacher, G.makeRng(38000 + seed), G.makeRng(39000 + seed), 200);
    let right = 0;
    for (const t of test) {
      let best = 0, bv = -1e300;
      for (let c = 0; c < 3; c++) {
        let v = A0.Aux.b[c];
        for (let k = 0; k < K; k++) v += A0.Aux.W[c * K + k] * t.msg[k];
        if (v > bv) { bv = v; best = c; }
      }
      if (best === t.npairs) right++;
    }
    headAcc[arm] = +(right / test.length).toFixed(4);
  }
  const probeAcc = {};
  for (const arm of ["fade", "const", "noaux"]) {
    const A0 = arms[arm];
    const fit = genMsgs(A0.P, A0.teacher, G.makeRng(37000 + seed), G.makeRng(37500 + seed), 100);
    const test = genMsgs(A0.P, A0.teacher, G.makeRng(38000 + seed + 7), G.makeRng(39000 + seed + 7), 200);
    const means = [new Float64Array(K), new Float64Array(K), new Float64Array(K)];
    const counts = [0, 0, 0];
    for (const f of fit) { for (let k = 0; k < K; k++) means[f.npairs][k] += f.msg[k]; counts[f.npairs]++; }
    for (let c = 0; c < 3; c++) if (counts[c] > 0) for (let k = 0; k < K; k++) means[c][k] /= counts[c];
    let right = 0;
    for (const t of test) {
      let best = 0, bd = 1e300;
      for (let c = 0; c < 3; c++) {
        let d = 0;
        for (let k = 0; k < K; k++) { const diff = t.msg[k] - means[c][k]; d += diff * diff; }
        if (d < bd) { bd = d; best = c; }
      }
      if (best === t.npairs) right++;
    }
    probeAcc[arm] = +(right / test.length).toFixed(4);
  }
  const b1 = { spec: "lane1x-v10-x1", seed, verdict: "COMPLETE", headAcc };
  const b2 = { spec: "lane1x-v10-x2", seed, verdict: "COMPLETE", probeAcc };
  await fs.writeTextFile("src/evidence/decomp/d-lane1x-x1-s" + seed + ".json", JSON.stringify(b1));
  await fs.writeTextFile("src/evidence/decomp/d-lane1x-x2-s" + seed + ".json", JSON.stringify(b2));
  log("lane1x s=" + seed + " heads=" + JSON.stringify(headAcc) + " probes=" + JSON.stringify(probeAcc));
  return { seed, headAcc, probeAcc };
};

// ---- COMPOSE v10: long-mix channel (L) + shift ceiling/joint (S0/S1). ----
function composeGenShift(rng) {
  const keys = [0, 1, 2, 3];
  for (let i = keys.length - 1; i > 0; i--) { const j = rng.int(i + 1), t = keys[i]; keys[i] = keys[j]; keys[j] = t; }
  const ks = keys.slice(0, 3);
  const pairs = ks.map((k) => [k, 4 + rng.int(4)]);
  const flat = [];
  const cp = pairs.slice();
  for (let i = cp.length - 1; i > 0; i--) { const j = rng.int(i + 1), t = cp[i]; cp[i] = cp[j]; cp[j] = t; }
  for (const [k, v] of cp) flat.push(k, v);
  const qi = rng.int(3), qk = pairs[qi][0], vi = pairs[qi][1] - 4, k = 1 + rng.int(3);
  return { flat, x: flat.concat([qk, k, 8]), y: (vi + k) % 4, echo: vi, qk, k };
}
globalThis.runComposeLongTrain = async function (fs, log, seed) {
  const ledgerPath = "src/evidence/decomp/d-compose-l-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  globalThis.window = globalThis;
  const bnSrc = await fs.readTextFile("src/evidence/decomp/bottleneck-driver.js");
  (0, eval)(bnSrc + "\n//# sourceURL=bottleneck-driver");
  const { G, T, TASKS } = await globalThis.BottleneckInit(fs);
  const A = TASKS.assocR;
  const K = 8, sigma = 0.5, steps = 8000, B = 8, lr = 1e-3;
  const tut = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-novel-tutor-s" + seed + ".json"));
  const teacher = T.makeModel(G.makeRng(tut.trainSeed), tut.arch);
  { const ps = teacher.params();
    for (let i = 0; i < ps.length; i++) {
      const dst = ps[i].v !== undefined ? ps[i].v : ps[i];
      const src = tut.params[i];
      for (let j = 0; j < dst.length; j++) dst[j] = src[j];
    } }
  const initRng = G.makeRng(52000 + seed * 7919 + 11);
  const P = { W: bnParam(initRng, K * 48, 48), b: bnParam(initRng, K, 48) };
  const S = { W1: bnParam(initRng, (K + 9) * 96, K + 9), b1: bnParam(initRng, 96, K + 9),
              W2: bnParam(initRng, 96 * 4, 96), b2: bnParam(initRng, 4, 96) };
  const params = [P.W, P.b, S.W1, S.b1, S.W2, S.b2];
  const opt = new G.Adam(lr);
  const dataRng = G.makeRng(51000 + seed * 104729);
  const noiseRng = G.makeRng(53000 + seed * 99991);
  function towerOf(L) {
    const fw = teacher.forward(L.x, 1);
    const state = Array.from(fw.cache.rC.y);
    const msg = bnChannelFwd(P, K, state, noiseRng, sigma);
    const sf = bnStudentFwd(S, K, msg, L.x[L.x.length - 2]);
    return { state, msg, sf };
  }
  function answerGrads(L, tw, N) {
    let mx = -1e300;
    for (let i = 0; i < 4; i++) if (tw.sf.logits[i] > mx) mx = tw.sf.logits[i];
    const pr = new Float64Array(4);
    let s = 0;
    for (let i = 0; i < 4; i++) { pr[i] = Math.exp(tw.sf.logits[i] - mx); s += pr[i]; }
    for (let i = 0; i < 4; i++) pr[i] /= s;
    const dz = new Float64Array(4);
    for (let i = 0; i < 4; i++) dz[i] = (pr[i] - (i === L.y ? 1 : 0)) / N;
    bnBackward(S, P, K, tw.sf, tw.msg, tw.state, dz);
  }
  const r1probe = [];
  { const r = G.makeRng(18000 + seed); for (let i = 0; i < 200; i++) r1probe.push(A.gen(r, 1 + r.int(3))); }
  const t0 = Date.now();
  let r1Steps = 0, g = 0;
  const probeAcc = () => {
    let right = 0;
    for (const ex of r1probe) {
      const tw = towerOf(ex);
      let b = 0;
      for (let i = 1; i < 4; i++) if (tw.sf.logits[i] > tw.sf.logits[b]) b = i;
      if (b === ex.y) right++;
    }
    return right / r1probe.length;
  };
  g = probeAcc();
  while (r1Steps < 2500 && g < 0.90) {
    for (let k = 0; k < 50 && r1Steps < 2500; k++) {
      for (const prm of params) prm.g.fill(0);
      for (let b = 0; b < B; b++) { const L = A.gen(dataRng, 1 + dataRng.int(3)); answerGrads(L, towerOf(L), B); }
      opt.step(params);
      r1Steps++;
    }
    g = probeAcc();
  }
  const r2Total = steps - r1Steps;
  for (let step = 0; step < r2Total; step++) {
    for (const prm of params) prm.g.fill(0);
    const batch = [];
    for (let b = 0; b < 3; b++) { const L = bnGenReverse(dataRng, 1 + dataRng.int(3)); batch.push({ L, tw: towerOf(L) }); }
    for (let b = 0; b < 3; b++) { const L = bnGenReverse(dataRng, 4); batch.push({ L, tw: towerOf(L) }); }
    for (let b = 0; b < 2; b++) { const L = A.gen(dataRng, 1 + dataRng.int(3)); batch.push({ L, tw: towerOf(L) }); }
    for (const { L, tw } of batch) answerGrads(L, tw, batch.length);
    opt.step(params);
  }
  const saveP = (o) => Array.from(o.v);
  const body = { spec: "compose-v10", arm: "l", verdict: "COMPLETE", K, sigma, seed, steps: r1Steps + r2Total, B, lr,
    wallMs: Date.now() - t0, r1Steps, r2Steps: r2Total, gate: +g.toFixed(4),
    P: { W: saveP(P.W), b: saveP(P.b) }, St: { W1: saveP(S.W1), b1: saveP(S.b1), W2: saveP(S.W2), b2: saveP(S.b2) } };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("compose-long-train s=" + seed + " r1=" + r1Steps + " gate=" + body.gate);
  return body;
};
globalThis.runComposeLongEval = async function (fs, log, seed) {
  const ledgerPath = "src/evidence/decomp/d-compose-eval-l-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  globalThis.window = globalThis;
  const bnSrc = await fs.readTextFile("src/evidence/decomp/bottleneck-driver.js");
  (0, eval)(bnSrc + "\n//# sourceURL=bottleneck-driver");
  const { G, T, TASKS } = await globalThis.BottleneckInit(fs);
  const A = TASKS.assocR;
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-compose-l-s" + seed + ".json"));
  if (tr.verdict !== "COMPLETE") throw new Error("compose-long train missing s" + seed);
  const tut = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-novel-tutor-s" + seed + ".json"));
  const teacher = T.makeModel(G.makeRng(tut.trainSeed), tut.arch);
  { const ps = teacher.params();
    for (let i = 0; i < ps.length; i++) {
      const dst = ps[i].v !== undefined ? ps[i].v : ps[i];
      const src = tut.params[i];
      for (let j = 0; j < dst.length; j++) dst[j] = src[j];
    } }
  const K = 8, sigma = 0.5;
  const P = { W: { v: Float64Array.from(tr.P.W) }, b: { v: Float64Array.from(tr.P.b) } };
  const S = { W1: { v: Float64Array.from(tr.St.W1) }, b1: { v: Float64Array.from(tr.St.b1) },
              W2: { v: Float64Array.from(tr.St.W2) }, b2: { v: Float64Array.from(tr.St.b2) } };
  const noiseRng = G.makeRng(56000 + seed * 17 + 10);
  function batt(gen, n, rng) {
    const items = [];
    for (let i = 0; i < n; i++) {
      const L = gen(rng);
      const fw = teacher.forward(L.x, 1);
      items.push({ y: L.y, q: L.x[L.x.length - 2], msg: bnChannelFwd(P, K, Array.from(fw.cache.rC.y), noiseRng, sigma) });
    }
    return items;
  }
  const acc = (arr) => arr.filter((it) => {
    const sf = bnStudentFwd(S, K, it.msg, it.q);
    let b = 0;
    for (let i = 1; i < 4; i++) if (sf.logits[i] > sf.logits[b]) b = i;
    return b === it.y;
  }).length / arr.length;
  const fwd = batt((r) => A.gen(r, 1 + r.int(3)), 200, G.makeRng(54000 + seed));
  const flong = batt((r) => A.gen(r, 4), 200, G.makeRng(54100 + seed));
  const rev = batt((r) => bnGenReverse(r, 1 + r.int(3)), 200, G.makeRng(54200 + seed));
  const revlong = batt((r) => bnGenReverse(r, 4), 200, G.makeRng(54300 + seed));
  const scr = fwd.map((it) => it.msg);
  bnShuffleIn(G.makeRng(55000 + seed), scr);
  const aScr = acc(fwd.map((it, i) => ({ y: it.y, q: it.q, msg: scr[i] })));
  const body = { spec: "compose-v10", arm: "l", verdict: "COMPLETE", seed, n: 200,
    accFwd: +acc(fwd).toFixed(4), accFlong: +acc(flong).toFixed(4),
    accRev: +acc(rev).toFixed(4), accRevLong: +acc(revlong).toFixed(4), accScr: +aScr.toFixed(4) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("compose-long-eval s=" + seed + " " + JSON.stringify(body));
  return body;
};
globalThis.runShiftTrain = async function (fs, log, arm, seed) {
  const ledgerPath = "src/evidence/decomp/d-compose-" + arm + "-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.LaneInit(fs);
  const A = TASKS.assocR;
  const trainSeed = arm === "s0" ? 53100 + seed * 13 : 53200 + seed * 13;
  const drng = G.makeRng(arm === "s0" ? 52000 + seed : 52200 + seed);
  const frng = G.makeRng(52300 + seed);
  const train = [];
  if (arm === "s0") { for (let i = 0; i < 150; i++) { const e = composeGenShift(drng); train.push({ x: e.x, y: e.y }); } }
  else {
    const a = [], b = [];
    for (let i = 0; i < 150; i++) { const e = composeGenShift(drng); a.push({ x: e.x, y: e.y }); }
    for (let i = 0; i < 150; i++) b.push(A.gen(frng, 1 + frng.int(3)));
    const sh = G.makeRng(52600 + seed);
    const all = a.concat(b);
    for (let i = all.length - 1; i > 0; i--) { const j = sh.int(i + 1), t = all[i]; all[i] = all[j]; all[j] = t; }
    for (const e of all) train.push(e);
  }
  const t0 = Date.now();
  const out = await T.trainModel({ seed: trainSeed, arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4,
    train, steps: 800, batch: 16, lr: 5e-3, attnAux: true, attnAuxW: 1.0 });
  const params = out.model.params().map((pl) => Array.from(pl.v !== undefined ? pl.v : pl));
  const body = { spec: "compose-v10", arm, verdict: "COMPLETE", seed, trainSeed, nTrain: train.length,
    steps: 800, batch: 16, lr: 5e-3, wallMs: Date.now() - t0,
    firstLoss: +out.firstLoss.toFixed(4), lastLoss: +out.lastLoss.toFixed(4), params };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("shift-train " + arm + " s=" + seed + " loss=" + body.firstLoss + "->" + body.lastLoss);
  return body;
};
globalThis.runShiftEval = async function (fs, log, arm, seed) {
  const ledgerPath = "src/evidence/decomp/d-compose-eval-" + arm + "-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.LaneInit(fs);
  const A = TASKS.assocR;
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-compose-" + arm + "-s" + seed + ".json"));
  if (tr.verdict !== "COMPLETE") throw new Error("shift train missing " + arm + " s" + seed);
  const model = T.makeModel(G.makeRng(tr.trainSeed), { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 });
  { const ps = model.params();
    for (let i = 0; i < ps.length; i++) {
      const dst = ps[i].v !== undefined ? ps[i].v : ps[i];
      const src = tr.params[i];
      for (let j = 0; j < dst.length; j++) dst[j] = src[j];
    } }
  const fw = (x) => { const l = Array.from(model.forward(x, 1).logits); let b = 0; for (let i = 1; i < 4; i++) if (l[i] > l[b]) b = i; return b; };
  const frng = G.makeRng(52400 + seed);
  const srng = G.makeRng(52500 + seed);
  const fwdT = []; for (let i = 0; i < 200; i++) fwdT.push(A.gen(frng, 1 + frng.int(3)));
  const shT = []; for (let i = 0; i < 200; i++) shT.push(composeGenShift(srng));
  const accF = fwdT.filter((e) => fw(e.x) === e.y).length / fwdT.length;
  const preds = shT.map((e) => ({ y: e.y, k: e.k, echo: e.echo, p: fw(e.x) }));
  const accS = preds.filter((e) => e.p === e.y).length / preds.length;
  const byK = {};
  for (let k = 1; k <= 3; k++) { const s = preds.filter((e) => e.k === k); byK["k" + k] = +(s.filter((e) => e.p === e.y).length / s.length).toFixed(4); }
  const echoRate = +(preds.filter((e) => e.p === e.echo).length / preds.length).toFixed(4);
  const body = { spec: "compose-v10", arm, verdict: "COMPLETE", seed, n: 200,
    accFwd: +accF.toFixed(4), accShift: +accS.toFixed(4), byK, echoRate };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("shift-eval " + arm + " s=" + seed + " fwd=" + body.accFwd + " shift=" + body.accShift + " byK=" + JSON.stringify(byK) + " echo=" + echoRate);
  return body;
};

function composeGenShiftN(rng, nP) {
  const keys = [0, 1, 2, 3];
  for (let i = keys.length - 1; i > 0; i--) { const j = rng.int(i + 1), t = keys[i]; keys[i] = keys[j]; keys[j] = t; }
  const ks = keys.slice(0, nP);
  const pairs = ks.map((k) => [k, 4 + rng.int(4)]);
  const flat = [];
  const cp = pairs.slice();
  for (let i = cp.length - 1; i > 0; i--) { const j = rng.int(i + 1), t = cp[i]; cp[i] = cp[j]; cp[j] = t; }
  for (const [k, v] of cp) flat.push(k, v);
  const qi = rng.int(nP), qk = pairs[qi][0], vi = pairs[qi][1] - 4, k = 1 + rng.int(3);
  return { flat, x: flat.concat([qk, k, 8]), y: (vi + k) % 4, echo: vi, qk, k };
}
function composePrefixLabels(A, x) {
  if (x.length === 9 && x[x.length - 1] === 8) {
    const qk = x[x.length - 3];
    let v = null;
    for (let t = 0; t < 6; t += 2) if (x[t] === qk) v = x[t + 1] - 4;
    if (v !== null && v >= 0 && v < 4) {
      const out = new Array(x.length).fill(null);
      out[x.length - 3] = v;
      return out;
    }
    return new Array(x.length).fill(null);
  }
  return A.bindLabels(x);
}
globalThis.runProcessTrain = async function (fs, log, seed) {
  const arm = "x1";
  const ledgerPath = "src/evidence/decomp/d-compose-" + arm + "-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.LaneInit(fs);
  const A = TASKS.assocR;
  const trainSeed = 53200 + seed * 13;
  const drng = G.makeRng(52200 + seed), frng = G.makeRng(52300 + seed), sh = G.makeRng(52600 + seed);
  const a = [], b = [];
  for (let i = 0; i < 150; i++) { const e = composeGenShift(drng); a.push({ x: e.x, y: e.y }); }
  for (let i = 0; i < 150; i++) b.push(A.gen(frng, 1 + frng.int(3)));
  const all = a.concat(b);
  for (let i = all.length - 1; i > 0; i--) { const j = sh.int(i + 1), t = all[i]; all[i] = all[j]; all[j] = t; }
  const t0 = Date.now();
  const out = await T.trainModel({ seed: trainSeed, arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4,
    train: all, steps: 800, batch: 16, lr: 5e-3, attnAux: true, attnAuxW: 1.0,
    prefixLabels: (x) => composePrefixLabels(A, x), auxW: 1.0 });
  const params = out.model.params().map((pl) => Array.from(pl.v !== undefined ? pl.v : pl));
  const body = { spec: "composex-v10", arm, verdict: "COMPLETE", seed, trainSeed, nTrain: all.length,
    steps: 800, batch: 16, lr: 5e-3, auxW: 1.0, wallMs: Date.now() - t0,
    firstLoss: +out.firstLoss.toFixed(4), lastLoss: +out.lastLoss.toFixed(4), params };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("process-train s=" + seed + " loss=" + body.firstLoss + "->" + body.lastLoss);
  return body;
};
globalThis.runDataTrain = async function (fs, log, seed) {
  const arm = "x2";
  const ledgerPath = "src/evidence/decomp/d-compose-" + arm + "-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.LaneInit(fs);
  const A = TASKS.assocR;
  const trainSeed = 53200 + seed * 13;
  const drng = G.makeRng(52200 + seed), frng = G.makeRng(52300 + seed), sh = G.makeRng(52700 + seed);
  const a = [], b = [];
  for (let i = 0; i < 300; i++) { const e = composeGenShift(drng); a.push({ x: e.x, y: e.y }); }
  for (let i = 0; i < 150; i++) b.push(A.gen(frng, 1 + frng.int(3)));
  const all = a.concat(b);
  for (let i = all.length - 1; i > 0; i--) { const j = sh.int(i + 1), t = all[i]; all[i] = all[j]; all[j] = t; }
  const t0 = Date.now();
  const out = await T.trainModel({ seed: trainSeed, arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4,
    train: all, steps: 800, batch: 16, lr: 5e-3, attnAux: true, attnAuxW: 1.0 });
  const params = out.model.params().map((pl) => Array.from(pl.v !== undefined ? pl.v : pl));
  const body = { spec: "composex-v10", arm, verdict: "COMPLETE", seed, trainSeed, nTrain: all.length,
    steps: 800, batch: 16, lr: 5e-3, wallMs: Date.now() - t0,
    firstLoss: +out.firstLoss.toFixed(4), lastLoss: +out.lastLoss.toFixed(4), params };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("data-train s=" + seed + " loss=" + body.firstLoss + "->" + body.lastLoss);
  return body;
};
globalThis.runStepsTrain = async function (fs, log, seed) {
  const arm = "x3";
  const ledgerPath = "src/evidence/decomp/d-compose-" + arm + "-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.LaneInit(fs);
  const A = TASKS.assocR;
  const trainSeed = 53200 + seed * 13;
  const drng = G.makeRng(52200 + seed), frng = G.makeRng(52300 + seed), sh = G.makeRng(52600 + seed);
  const a = [], b = [];
  for (let i = 0; i < 150; i++) { const e = composeGenShift(drng); a.push({ x: e.x, y: e.y }); }
  for (let i = 0; i < 150; i++) b.push(A.gen(frng, 1 + frng.int(3)));
  const all = a.concat(b);
  for (let i = all.length - 1; i > 0; i--) { const j = sh.int(i + 1), t = all[i]; all[i] = all[j]; all[j] = t; }
  const t0 = Date.now();
  const out = await T.trainModel({ seed: trainSeed, arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4,
    train: all, steps: 1600, batch: 16, lr: 5e-3, attnAux: true, attnAuxW: 1.0 });
  const params = out.model.params().map((pl) => Array.from(pl.v !== undefined ? pl.v : pl));
  const body = { spec: "composex-v10", arm, verdict: "COMPLETE", seed, trainSeed, nTrain: all.length,
    steps: 1600, batch: 16, lr: 5e-3, wallMs: Date.now() - t0,
    firstLoss: +out.firstLoss.toFixed(4), lastLoss: +out.lastLoss.toFixed(4), params };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("steps-train s=" + seed + " loss=" + body.firstLoss + "->" + body.lastLoss);
  return body;
};
globalThis.runShiftEvalLen = async function (fs, log, arm, seed) {
  const ledgerPath = "src/evidence/decomp/d-compose-eval-" + arm + "len-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.LaneInit(fs);
  const A = TASKS.assocR;
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-compose-" + arm + "-s" + seed + ".json"));
  if (tr.verdict !== "COMPLETE") throw new Error("train missing " + arm + " s" + seed);
  const model = T.makeModel(G.makeRng(tr.trainSeed), { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 });
  { const ps = model.params();
    for (let i = 0; i < ps.length; i++) {
      const dst = ps[i].v !== undefined ? ps[i].v : ps[i];
      const src = tr.params[i];
      for (let j = 0; j < dst.length; j++) dst[j] = src[j];
    } }
  const fw = (x) => { const l = Array.from(model.forward(x, 1).logits); let b = 0; for (let i = 1; i < 4; i++) if (l[i] > l[b]) b = i; return b; };
  const r2 = G.makeRng(52800 + seed), r4 = G.makeRng(52900 + seed);
  const t2 = []; for (let i = 0; i < 200; i++) t2.push(composeGenShiftN(r2, 2));
  const t4 = []; for (let i = 0; i < 200; i++) t4.push(composeGenShiftN(r4, 4));
  const a2 = t2.filter((e) => fw(e.x) === e.y).length / t2.length;
  const a4 = t4.filter((e) => fw(e.x) === e.y).length / t4.length;
  const body = { spec: "composex-v10", arm, verdict: "COMPLETE", seed, n: 200,
    accShift2: +a2.toFixed(4), accShift4: +a4.toFixed(4) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("shift-len-eval " + arm + " s=" + seed + " 2pair=" + body.accShift2 + " 4pair=" + body.accShift4);
  return body;
};

globalThis.runRatioTrain = async function (fs, log, seed) {
  const arm = "x4";
  const ledgerPath = "src/evidence/decomp/d-compose-" + arm + "-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.LaneInit(fs);
  const A = TASKS.assocR;
  const trainSeed = 53200 + seed * 13;
  const drng = G.makeRng(52200 + seed), frng = G.makeRng(52300 + seed), sh = G.makeRng(52600 + seed);
  const a = [], b = [];
  for (let i = 0; i < 225; i++) { const e = composeGenShift(drng); a.push({ x: e.x, y: e.y }); }
  for (let i = 0; i < 75; i++) b.push(A.gen(frng, 1 + frng.int(3)));
  const all = a.concat(b);
  for (let i = all.length - 1; i > 0; i--) { const j = sh.int(i + 1), t = all[i]; all[i] = all[j]; all[j] = t; }
  const t0 = Date.now();
  const out = await T.trainModel({ seed: trainSeed, arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4,
    train: all, steps: 800, batch: 16, lr: 5e-3, attnAux: true, attnAuxW: 1.0 });
  const params = out.model.params().map((pl) => Array.from(pl.v !== undefined ? pl.v : pl));
  const body = { spec: "composer2-v10", arm, verdict: "COMPLETE", seed, trainSeed, nTrain: all.length, arch: { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 },
    steps: 800, batch: 16, lr: 5e-3, wallMs: Date.now() - t0,
    firstLoss: +out.firstLoss.toFixed(4), lastLoss: +out.lastLoss.toFixed(4), params };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("ratio-train s=" + seed + " loss=" + body.firstLoss + "->" + body.lastLoss);
  return body;
};
globalThis.runWideTrain = async function (fs, log, seed) {
  const arm = "x5";
  const ledgerPath = "src/evidence/decomp/d-compose-" + arm + "-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.LaneInit(fs);
  const A = TASKS.assocR;
  const trainSeed = 53200 + seed * 13;
  const drng = G.makeRng(52200 + seed), frng = G.makeRng(52300 + seed), sh = G.makeRng(52600 + seed);
  const a = [], b = [];
  for (let i = 0; i < 150; i++) { const e = composeGenShift(drng); a.push({ x: e.x, y: e.y }); }
  for (let i = 0; i < 150; i++) b.push(A.gen(frng, 1 + frng.int(3)));
  const all = a.concat(b);
  for (let i = all.length - 1; i > 0; i--) { const j = sh.int(i + 1), t = all[i]; all[i] = all[j]; all[j] = t; }
  const t0 = Date.now();
  const out = await T.trainModel({ seed: trainSeed, arch: "attn", vocab: 9, h: 64, m: 128, d: 16, classes: 4,
    train: all, steps: 800, batch: 16, lr: 5e-3, attnAux: true, attnAuxW: 1.0 });
  const params = out.model.params().map((pl) => Array.from(pl.v !== undefined ? pl.v : pl));
  const body = { spec: "composer2-v10", arm, verdict: "COMPLETE", seed, trainSeed, nTrain: all.length, arch: { arch: "attn", vocab: 9, h: 64, m: 128, d: 16, classes: 4 },
    steps: 800, batch: 16, lr: 5e-3, wallMs: Date.now() - t0,
    firstLoss: +out.firstLoss.toFixed(4), lastLoss: +out.lastLoss.toFixed(4), params };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("wide-train s=" + seed + " loss=" + body.firstLoss + "->" + body.lastLoss);
  return body;
};
globalThis.runArchEval = async function (fs, log, arm, seed) {
  const ledgerPath = "src/evidence/decomp/d-compose-eval-" + arm + "-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.LaneInit(fs);
  const A = TASKS.assocR;
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-compose-" + arm + "-s" + seed + ".json"));
  if (tr.verdict !== "COMPLETE") throw new Error("train missing " + arm + " s" + seed);
  const arch = tr.arch || { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 };
  const model = T.makeModel(G.makeRng(tr.trainSeed), arch);
  { const ps = model.params();
    for (let i = 0; i < ps.length; i++) {
      const dst = ps[i].v !== undefined ? ps[i].v : ps[i];
      const src = tr.params[i];
      for (let j = 0; j < dst.length; j++) dst[j] = src[j];
    } }
  const fw = (x) => { const l = Array.from(model.forward(x, 1).logits); let b = 0; for (let i = 1; i < 4; i++) if (l[i] > l[b]) b = i; return b; };
  const frng = G.makeRng(52400 + seed), srng = G.makeRng(52500 + seed);
  const fwdT = []; for (let i = 0; i < 200; i++) fwdT.push(A.gen(frng, 1 + frng.int(3)));
  const shT = []; for (let i = 0; i < 200; i++) shT.push(composeGenShift(srng));
  const accF = fwdT.filter((e) => fw(e.x) === e.y).length / fwdT.length;
  const preds = shT.map((e) => ({ y: e.y, k: e.k, echo: e.echo, p: fw(e.x) }));
  const accS = preds.filter((e) => e.p === e.y).length / preds.length;
  const byK = {};
  for (let k = 1; k <= 3; k++) { const s2 = preds.filter((e) => e.k === k); byK["k" + k] = +(s2.filter((e) => e.p === e.y).length / s2.length).toFixed(4); }
  const echoRate = +(preds.filter((e) => e.p === e.echo).length / preds.length).toFixed(4);
  const body = { spec: "composer2-v10", arm, verdict: "COMPLETE", seed, n: 200,
    accFwd: +accF.toFixed(4), accShift: +accS.toFixed(4), byK, echoRate };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("arch-eval " + arm + " s=" + seed + " fwd=" + body.accFwd + " shift=" + body.accShift);
  return body;
};
globalThis.runArchEvalLen = async function (fs, log, arm, seed) {
  const ledgerPath = "src/evidence/decomp/d-compose-eval-" + arm + "len-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T } = await globalThis.LaneInit(fs);
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-compose-" + arm + "-s" + seed + ".json"));
  if (tr.verdict !== "COMPLETE") throw new Error("train missing " + arm + " s" + seed);
  const arch = tr.arch || { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 };
  const model = T.makeModel(G.makeRng(tr.trainSeed), arch);
  { const ps = model.params();
    for (let i = 0; i < ps.length; i++) {
      const dst = ps[i].v !== undefined ? ps[i].v : ps[i];
      const src = tr.params[i];
      for (let j = 0; j < dst.length; j++) dst[j] = src[j];
    } }
  const fw = (x) => { const l = Array.from(model.forward(x, 1).logits); let b = 0; for (let i = 1; i < 4; i++) if (l[i] > l[b]) b = i; return b; };
  const r2 = G.makeRng(52800 + seed), r4 = G.makeRng(52900 + seed);
  const t2 = []; for (let i = 0; i < 200; i++) t2.push(composeGenShiftN(r2, 2));
  const t4 = []; for (let i = 0; i < 200; i++) t4.push(composeGenShiftN(r4, 4));
  const body = { spec: "composer2-v10", arm, verdict: "COMPLETE", seed, n: 200,
    accShift2: +(t2.filter((e) => fw(e.x) === e.y).length / t2.length).toFixed(4),
    accShift4: +(t4.filter((e) => fw(e.x) === e.y).length / t4.length).toFixed(4) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("arch-len-eval " + arm + " s=" + seed + " 2p=" + body.accShift2 + " 4p=" + body.accShift4);
  return body;
};

function composeGenShiftScr(rng, nP) {
  const n = nP || 3;
  const keys = [0, 1, 2, 3];
  for (let i = keys.length - 1; i > 0; i--) { const j = rng.int(i + 1), t = keys[i]; keys[i] = keys[j]; keys[j] = t; }
  const ks = keys.slice(0, n);
  const pairs = ks.map((k) => [k, 4 + rng.int(4)]);
  const flat = [];
  const cp = pairs.slice();
  for (let i = cp.length - 1; i > 0; i--) { const j = rng.int(i + 1), t = cp[i]; cp[i] = cp[j]; cp[j] = t; }
  for (const [k, v] of cp) flat.push(k, v);
  const qi = rng.int(n), qk = pairs[qi][0], vi = pairs[qi][1] - 4, k = 1 + rng.int(3);
  return { flat, qk, k, v: vi, y: (vi + k) % 4, echo: vi,
    x: flat.concat([qk, k, 0, 8]), xLen: 2 * n + 4 };
}
function scratchLabelsT(A, x) {
  if (x.length === 10 && x[x.length - 1] === 8) {
    const out = new Array(x.length).fill(null);
    for (let t = 1; t <= 5; t += 2) {
      if (x[t] >= 4 && x[t] < 8 && x[t - 1] >= 0 && x[t - 1] < 4) out[t] = x[t - 1];
    }
    const qk = x[6];
    let v = null;
    for (let t = 0; t < 6; t += 2) if (x[t] === qk) v = x[t + 1] - 4;
    if (v !== null && v >= 0 && v < 4) out[8] = v;
    return out;
  }
  return A.bindLabels(x);
}
function scratchLabelsU(A, x) {
  if (x.length === 10 && x[x.length - 1] === 8) {
    const out = new Array(x.length).fill(null);
    for (let t = 1; t <= 5; t += 2) {
      if (x[t] >= 4 && x[t] < 8 && x[t - 1] >= 0 && x[t - 1] < 4) out[t] = x[t - 1];
    }
    return out;
  }
  return A.bindLabels(x);
}
globalThis.runScratchTrain = async function (fs, log, arm, seed) {
  const ledgerPath = "src/evidence/decomp/d-scratch-" + arm + "-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.LaneInit(fs);
  const A = TASKS.assocR;
  const trainSeed = 53200 + seed * 13;
  const drng = G.makeRng(52200 + seed), frng = G.makeRng(52300 + seed), sh = G.makeRng(52600 + seed);
  const a = [], b = [];
  for (let i = 0; i < 150; i++) { const e = composeGenShiftScr(drng); a.push({ x: e.x, y: e.y }); }
  for (let i = 0; i < 150; i++) b.push(A.gen(frng, 1 + frng.int(3)));
  const all = a.concat(b);
  for (let i = all.length - 1; i > 0; i--) { const j = sh.int(i + 1), t = all[i]; all[i] = all[j]; all[j] = t; }
  const lab = arm === "t" ? scratchLabelsT : scratchLabelsU;
  const t0 = Date.now();
  const out = await T.trainModel({ seed: trainSeed, arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4,
    train: all, steps: 800, batch: 16, lr: 5e-3, attnAux: true, attnAuxW: 1.0,
    prefixLabels: (x) => lab(A, x), auxW: 1.0 });
  const params = out.model.params().map((pl) => Array.from(pl.v !== undefined ? pl.v : pl));
  const body = { spec: "scratch-v10", arm, verdict: "COMPLETE", seed, trainSeed, nTrain: all.length,
    steps: 800, batch: 16, lr: 5e-3, auxW: 1.0, wallMs: Date.now() - t0,
    firstLoss: +out.firstLoss.toFixed(4), lastLoss: +out.lastLoss.toFixed(4), params };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("scratch-train " + arm + " s=" + seed + " loss=" + body.firstLoss + "->" + body.lastLoss);
  return body;
};
function scratchArgmax(logits) {
  let b = 0;
  for (let i = 1; i < logits.length; i++) if (logits[i] > logits[b]) b = i;
  return b;
}
globalThis.runScratchEval = async function (fs, log, arm, seed) {
  const ledgerPath = "src/evidence/decomp/d-scratch-eval-" + arm + "-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.LaneInit(fs);
  const A = TASKS.assocR;
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-scratch-" + arm + "-s" + seed + ".json"));
  if (tr.verdict !== "COMPLETE") throw new Error("scratch train missing " + arm + " s" + seed);
  const model = T.makeModel(G.makeRng(tr.trainSeed), { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 });
  { const ps = model.params();
    for (let i = 0; i < ps.length; i++) {
      const dst = ps[i].v !== undefined ? ps[i].v : ps[i];
      const src = tr.params[i];
      for (let j = 0; j < dst.length; j++) dst[j] = src[j];
    } }
  const frng = G.makeRng(52400 + seed), srng = G.makeRng(52500 + seed);
  const fwdT = []; for (let i = 0; i < 200; i++) fwdT.push(A.gen(frng, 1 + frng.int(3)));
  const shT = []; for (let i = 0; i < 200; i++) shT.push(composeGenShiftScr(srng));
  const fwF = (x) => Array.from(model.forward(x, 1).logits);
  let fF = 0;
  for (const e of fwdT) if (scratchArgmax(fwF(e.x)) === e.y) fF++;
  let scr = 0, one = 0, two = 0, orc = 0;
  const byK = { k1: [0, 0], k2: [0, 0], k3: [0, 0] };
  for (const e of shT) {
    const fw1 = model.forward(e.x, 1);
    const vhat = scratchArgmax(Array.from(fw1.cache.posOut[8].logits));
    if (vhat === e.v) scr++;
    if (scratchArgmax(Array.from(fw1.logits)) === e.y) one++;
    const x2 = e.flat.concat([e.qk, e.k, vhat, 8]);
    if (scratchArgmax(fwF(x2)) === e.y) two++;
    const xo = e.flat.concat([e.qk, e.k, e.v, 8]);
    if (scratchArgmax(fwF(xo)) === e.y) orc++;
    byK["k" + e.k][1]++;
    if (scratchArgmax(fwF(x2)) === e.y) byK["k" + e.k][0]++;
  }
  const byKacc = {};
  for (let k = 1; k <= 3; k++) byKacc["k" + k] = +(byK["k" + k][0] / byK["k" + k][1]).toFixed(4);
  const body = { spec: "scratch-v10", arm, verdict: "COMPLETE", seed, n: 200,
    accFwd: +(fF / fwdT.length).toFixed(4), accScratch: +(scr / shT.length).toFixed(4),
    accOne: +(one / shT.length).toFixed(4), accTwo: +(two / shT.length).toFixed(4),
    accOracle: +(orc / shT.length).toFixed(4), byK: byKacc };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("scratch-eval " + arm + " s=" + seed + " " + JSON.stringify(body));
  return body;
};
globalThis.runScratchEvalLen = async function (fs, log, arm, seed) {
  const ledgerPath = "src/evidence/decomp/d-scratch-eval-" + arm + "len-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T } = await globalThis.LaneInit(fs);
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-scratch-" + arm + "-s" + seed + ".json"));
  if (tr.verdict !== "COMPLETE") throw new Error("scratch train missing " + arm + " s" + seed);
  const model = T.makeModel(G.makeRng(tr.trainSeed), { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 });
  { const ps = model.params();
    for (let i = 0; i < ps.length; i++) {
      const dst = ps[i].v !== undefined ? ps[i].v : ps[i];
      const src = tr.params[i];
      for (let j = 0; j < dst.length; j++) dst[j] = src[j];
    } }
  const fwF = (x) => Array.from(model.forward(x, 1).logits);
  function twoPass(e) {
    const scrIdx = e.x.length - 2;
    const fw1 = model.forward(e.x, 1);
    const vhat = scratchArgmax(Array.from(fw1.cache.posOut[scrIdx].logits));
    const x2 = e.x.slice();
    x2[scrIdx] = vhat;
    return scratchArgmax(fwF(x2)) === e.y;
  }
  const r2 = G.makeRng(52800 + seed), r4 = G.makeRng(52900 + seed);
  const t2 = []; for (let i = 0; i < 200; i++) t2.push(composeGenShiftScr(r2, 2));
  const t4 = []; for (let i = 0; i < 200; i++) t4.push(composeGenShiftScr(r4, 4));
  const body = { spec: "scratch-v10", arm, verdict: "COMPLETE", seed, n: 200,
    accTwo2: +(t2.filter(twoPass).length / t2.length).toFixed(4),
    accTwo4: +(t4.filter(twoPass).length / t4.length).toFixed(4) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("scratch-len-eval " + arm + " s=" + seed + " 2p=" + body.accTwo2 + " 4p=" + body.accTwo4);
  return body;
};

globalThis.runScratchTF = async function (fs, log, seed) {
  const arm = "t2";
  const ledgerPath = "src/evidence/decomp/d-scratch-" + arm + "-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.LaneInit(fs);
  const A = TASKS.assocR;
  const trainSeed = 53200 + seed * 13;
  const drng = G.makeRng(52200 + seed), frng = G.makeRng(52300 + seed), sh = G.makeRng(52600 + seed);
  const a = [], b = [];
  for (let i = 0; i < 150; i++) {
    const e = composeGenShiftScr(drng);
    const x = e.flat.concat([e.qk, e.k, e.v, 8]);
    a.push({ x, y: e.y });
  }
  for (let i = 0; i < 150; i++) b.push(A.gen(frng, 1 + frng.int(3)));
  const all = a.concat(b);
  for (let i = all.length - 1; i > 0; i--) { const j = sh.int(i + 1), t = all[i]; all[i] = all[j]; all[j] = t; }
  const t0 = Date.now();
  const out = await T.trainModel({ seed: trainSeed, arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4,
    train: all, steps: 800, batch: 16, lr: 5e-3, attnAux: true, attnAuxW: 1.0,
    prefixLabels: (x) => scratchLabelsT(A, x), auxW: 1.0 });
  const params = out.model.params().map((pl) => Array.from(pl.v !== undefined ? pl.v : pl));
  const body = { spec: "scratchx-v10", arm, verdict: "COMPLETE", seed, trainSeed, nTrain: all.length,
    steps: 800, batch: 16, lr: 5e-3, auxW: 1.0, wallMs: Date.now() - t0,
    firstLoss: +out.firstLoss.toFixed(4), lastLoss: +out.lastLoss.toFixed(4), params };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("scratchTF-train s=" + seed + " loss=" + body.firstLoss + "->" + body.lastLoss);
  return body;
};

globalThis.runHarnessCompose = async function (fs, log, seed) {
  const ledgerPath = "src/evidence/decomp/d-scratch-eval-t3-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.LaneInit(fs);
  const A = TASKS.assocR;
  const s1 = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-compose-s1-s" + seed + ".json"));
  const t2 = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-scratch-t2-s" + seed + ".json"));
  const m1 = T.makeModel(G.makeRng(s1.trainSeed), { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 });
  { const ps = m1.params();
    for (let i = 0; i < ps.length; i++) {
      const dst = ps[i].v !== undefined ? ps[i].v : ps[i];
      const src = s1.params[i];
      for (let j = 0; j < dst.length; j++) dst[j] = src[j];
    } }
  const m2 = T.makeModel(G.makeRng(t2.trainSeed), { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 });
  { const ps = m2.params();
    for (let i = 0; i < ps.length; i++) {
      const dst = ps[i].v !== undefined ? ps[i].v : ps[i];
      const src = t2.params[i];
      for (let j = 0; j < dst.length; j++) dst[j] = src[j];
    } }
  const a1 = (x) => { const l = Array.from(m1.forward(x, 1).logits); let b = 0; for (let i = 1; i < 4; i++) if (l[i] > l[b]) b = i; return b; };
  const a2 = (x) => { const l = Array.from(m2.forward(x, 1).logits); let b = 0; for (let i = 1; i < 4; i++) if (l[i] > l[b]) b = i; return b; };
  const srng = G.makeRng(52500 + seed);
  const shT = []; for (let i = 0; i < 200; i++) shT.push(composeGenShiftScr(srng));
  let vhits = 0, hits = 0;
  const byK = { k1: [0, 0], k2: [0, 0], k3: [0, 0] };
  for (const e of shT) {
    const vhat = a1(e.flat.concat([e.qk, 8]));
    if (vhat === e.v) vhits++;
    const p = a2(e.flat.concat([e.qk, e.k, vhat, 8]));
    if (p === e.y) { hits++; byK["k" + e.k][0]++; }
    byK["k" + e.k][1]++;
  }
  const byKacc = {};
  for (let k = 1; k <= 3; k++) byKacc["k" + k] = +(byK["k" + k][0] / byK["k" + k][1]).toFixed(4);
  const body = { spec: "scratchx-v10", arm: "t3", verdict: "COMPLETE", seed, n: 200,
    accRetrieve: +(vhits / shT.length).toFixed(4), accComposed: +(hits / shT.length).toFixed(4), byK: byKacc };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("harness-compose s=" + seed + " ret=" + body.accRetrieve + " comp=" + body.accComposed);
  return body;
};

globalThis.runAuxTrain = async function (fs, log, seed) {
  const arm = "a4";
  const ledgerPath = "src/evidence/decomp/d-batch1-" + arm + "-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.LaneInit(fs);
  const A = TASKS.assocR;
  const trainSeed = 53200 + seed * 13;
  const drng = G.makeRng(52200 + seed), frng = G.makeRng(52300 + seed), sh = G.makeRng(52600 + seed);
  const a = [], b = [];
  for (let i = 0; i < 150; i++) { const e = composeGenShiftScr(drng); a.push({ x: e.x, y: e.y }); }
  for (let i = 0; i < 150; i++) b.push(A.gen(frng, 1 + frng.int(3)));
  const all = a.concat(b);
  for (let i = all.length - 1; i > 0; i--) { const j = sh.int(i + 1), t = all[i]; all[i] = all[j]; all[j] = t; }
  const t0 = Date.now();
  const out = await T.trainModel({ seed: trainSeed, arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4,
    train: all, steps: 800, batch: 16, lr: 5e-3, attnAux: true, attnAuxW: 1.0,
    prefixLabels: (x) => scratchLabelsT(A, x), auxW: 4.0 });
  const params = out.model.params().map((pl) => Array.from(pl.v !== undefined ? pl.v : pl));
  const body = { spec: "batch1-v10.1", arm, verdict: "COMPLETE", seed, trainSeed, nTrain: all.length,
    steps: 800, batch: 16, lr: 5e-3, auxW: 4.0, wallMs: Date.now() - t0,
    firstLoss: +out.firstLoss.toFixed(4), lastLoss: +out.lastLoss.toFixed(4), params };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("aux-train s=" + seed + " loss=" + body.firstLoss + "->" + body.lastLoss);
  return body;
};
globalThis.runFwd3Train = async function (fs, log, seed) {
  const arm = "f3";
  const ledgerPath = "src/evidence/decomp/d-batch1-" + arm + "-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.LaneInit(fs);
  const A = TASKS.assocR;
  const trainSeed = 54000 + seed * 13;
  const drng = G.makeRng(53400 + seed);
  const train = [];
  for (let i = 0; i < 150; i++) train.push(A.gen(drng, 3));
  const t0 = Date.now();
  const out = await T.trainModel({ seed: trainSeed, arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4,
    train, steps: 800, batch: 16, lr: 5e-3, attnAux: true, attnAuxW: 1.0 });
  const params = out.model.params().map((pl) => Array.from(pl.v !== undefined ? pl.v : pl));
  const body = { spec: "batch1-v10.1", arm, verdict: "COMPLETE", seed, trainSeed, nTrain: train.length,
    steps: 800, wallMs: Date.now() - t0,
    firstLoss: +out.firstLoss.toFixed(4), lastLoss: +out.lastLoss.toFixed(4), params };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("fwd3-train s=" + seed + " loss=" + body.firstLoss + "->" + body.lastLoss);
  return body;
};
globalThis.runDropoutTrain = async function (fs, log, seed) {
  const arm = "dp";
  const ledgerPath = "src/evidence/decomp/d-batch1-" + arm + "-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.LaneInit(fs);
  const A = TASKS.assocR;
  const trainSeed = 53200 + seed * 13;
  const drng = G.makeRng(52200 + seed), frng = G.makeRng(52300 + seed), sh = G.makeRng(52600 + seed), crng = G.makeRng(53500 + seed);
  const a = [], b = [];
  for (let i = 0; i < 150; i++) {
    const e = composeGenShiftScr(drng);
    const useTrue = crng.int(2) === 0;
    a.push({ x: useTrue ? e.flat.concat([e.qk, e.k, e.v, 8]) : e.x, y: e.y });
  }
  for (let i = 0; i < 150; i++) b.push(A.gen(frng, 1 + frng.int(3)));
  const all = a.concat(b);
  for (let i = all.length - 1; i > 0; i--) { const j = sh.int(i + 1), t = all[i]; all[i] = all[j]; all[j] = t; }
  const t0 = Date.now();
  const out = await T.trainModel({ seed: trainSeed, arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4,
    train: all, steps: 800, batch: 16, lr: 5e-3, attnAux: true, attnAuxW: 1.0,
    prefixLabels: (x) => scratchLabelsT(A, x), auxW: 1.0 });
  const params = out.model.params().map((pl) => Array.from(pl.v !== undefined ? pl.v : pl));
  const body = { spec: "batch1-v10.1", arm, verdict: "COMPLETE", seed, trainSeed, nTrain: all.length,
    steps: 800, wallMs: Date.now() - t0,
    firstLoss: +out.firstLoss.toFixed(4), lastLoss: +out.lastLoss.toFixed(4), params };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("dropout-train s=" + seed + " loss=" + body.firstLoss + "->" + body.lastLoss);
  return body;
};
globalThis.runComboTrain = async function (fs, log, seed) {
  const arm = "cb";
  const ledgerPath = "src/evidence/decomp/d-batch2-" + arm + "-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.LaneInit(fs);
  const A = TASKS.assocR;
  const trainSeed = 53200 + seed * 13;
  const drng = G.makeRng(52200 + seed), frng = G.makeRng(52300 + seed), sh = G.makeRng(52600 + seed), crng = G.makeRng(53500 + seed);
  const a = [], b = [];
  for (let i = 0; i < 150; i++) {
    const e = composeGenShiftScr(drng);
    const useTrue = crng.int(2) === 0;
    a.push({ x: useTrue ? e.flat.concat([e.qk, e.k, e.v, 8]) : e.x, y: e.y });
  }
  for (let i = 0; i < 150; i++) b.push(A.gen(frng, 1 + frng.int(3)));
  const all = a.concat(b);
  for (let i = all.length - 1; i > 0; i--) { const j = sh.int(i + 1), t = all[i]; all[i] = all[j]; all[j] = t; }
  const t0 = Date.now();
  const out = await T.trainModel({ seed: trainSeed, arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4,
    train: all, steps: 800, batch: 16, lr: 5e-3, attnAux: true, attnAuxW: 1.0,
    prefixLabels: (x) => scratchLabelsT(A, x), auxW: 4.0 });
  const params = out.model.params().map((pl) => Array.from(pl.v !== undefined ? pl.v : pl));
  const body = { spec: "batch2-v10.1", arm, verdict: "COMPLETE", seed, trainSeed, nTrain: all.length,
    steps: 800, batch: 16, lr: 5e-3, auxW: 4.0, wallMs: Date.now() - t0,
    firstLoss: +out.firstLoss.toFixed(4), lastLoss: +out.lastLoss.toFixed(4), params };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("combo-train s=" + seed + " loss=" + body.firstLoss + "->" + body.lastLoss);
  return body;
};
globalThis.runAux8Train = async function (fs, log, seed) {
  const arm = "a8";
  const ledgerPath = "src/evidence/decomp/d-batch2-" + arm + "-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.LaneInit(fs);
  const A = TASKS.assocR;
  const trainSeed = 53200 + seed * 13;
  const drng = G.makeRng(52200 + seed), frng = G.makeRng(52300 + seed), sh = G.makeRng(52600 + seed);
  const a = [], b = [];
  for (let i = 0; i < 150; i++) { const e = composeGenShiftScr(drng); a.push({ x: e.x, y: e.y }); }
  for (let i = 0; i < 150; i++) b.push(A.gen(frng, 1 + frng.int(3)));
  const all = a.concat(b);
  for (let i = all.length - 1; i > 0; i--) { const j = sh.int(i + 1), t = all[i]; all[i] = all[j]; all[j] = t; }
  const t0 = Date.now();
  const out = await T.trainModel({ seed: trainSeed, arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4,
    train: all, steps: 800, batch: 16, lr: 5e-3, attnAux: true, attnAuxW: 1.0,
    prefixLabels: (x) => scratchLabelsT(A, x), auxW: 8.0 });
  const params = out.model.params().map((pl) => Array.from(pl.v !== undefined ? pl.v : pl));
  const body = { spec: "batch2-v10.1", arm, verdict: "COMPLETE", seed, trainSeed, nTrain: all.length,
    steps: 800, batch: 16, lr: 5e-3, auxW: 8.0, wallMs: Date.now() - t0,
    firstLoss: +out.firstLoss.toFixed(4), lastLoss: +out.lastLoss.toFixed(4), params };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("aux8-train s=" + seed + " loss=" + body.firstLoss + "->" + body.lastLoss);
  return body;
};
globalThis.runLenmixTrain = async function (fs, log, seed) {
  const arm = "lm";
  const ledgerPath = "src/evidence/decomp/d-batch2-" + arm + "-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.LaneInit(fs);
  const A = TASKS.assocR;
  const trainSeed = 53200 + seed * 13;
  const drng = G.makeRng(52200 + seed), frng = G.makeRng(52300 + seed), sh = G.makeRng(52600 + seed);
  const a = [], b = [];
  for (let i = 0; i < 50; i++) { const e = composeGenShiftScr(drng, 2); a.push({ x: e.x, y: e.y }); }
  for (let i = 0; i < 50; i++) { const e = composeGenShiftScr(drng, 3); a.push({ x: e.x, y: e.y }); }
  for (let i = 0; i < 50; i++) { const e = composeGenShiftScr(drng, 4); a.push({ x: e.x, y: e.y }); }
  for (let i = 0; i < 150; i++) b.push(A.gen(frng, 1 + frng.int(3)));
  const all = a.concat(b);
  for (let i = all.length - 1; i > 0; i--) { const j = sh.int(i + 1), t = all[i]; all[i] = all[j]; all[j] = t; }
  const t0 = Date.now();
  const out = await T.trainModel({ seed: trainSeed, arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4,
    train: all, steps: 800, batch: 16, lr: 5e-3, attnAux: true, attnAuxW: 1.0,
    prefixLabels: (x) => scratchLabelsT(A, x), auxW: 1.0 });
  const params = out.model.params().map((pl) => Array.from(pl.v !== undefined ? pl.v : pl));
  const body = { spec: "batch2-v10.1", arm, verdict: "COMPLETE", seed, trainSeed, nTrain: all.length,
    steps: 800, batch: 16, lr: 5e-3, auxW: 1.0, diet: "50x2p+50x3p+50x4p", wallMs: Date.now() - t0,
    firstLoss: +out.firstLoss.toFixed(4), lastLoss: +out.lastLoss.toFixed(4), params };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("lenmix-train s=" + seed + " loss=" + body.firstLoss + "->" + body.lastLoss);
  return body;
};
globalThis.runBatch2Eval = async function (fs, log, arm, seed) {
  const ledgerPath = "src/evidence/decomp/d-batch2-eval-" + arm + "-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.LaneInit(fs);
  const A = TASKS.assocR;
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-batch2-" + arm + "-s" + seed + ".json"));
  if (tr.verdict !== "COMPLETE") throw new Error("batch2 train missing " + arm + " s" + seed);
  const model = T.makeModel(G.makeRng(tr.trainSeed), { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 });
  { const ps = model.params();
    for (let i = 0; i < ps.length; i++) {
      const dst = ps[i].v !== undefined ? ps[i].v : ps[i];
      const src = tr.params[i];
      for (let j = 0; j < dst.length; j++) dst[j] = src[j];
    } }
  const fwF = (x) => Array.from(model.forward(x, 1).logits);
  const frng = G.makeRng(52400 + seed), srng = G.makeRng(52500 + seed);
  const fwdT = []; for (let i = 0; i < 200; i++) fwdT.push(A.gen(frng, 1 + frng.int(3)));
  const shT = []; for (let i = 0; i < 200; i++) shT.push(composeGenShiftScr(srng));
  let fF = 0;
  for (const e of fwdT) if (scratchArgmax(fwF(e.x)) === e.y) fF++;
  let scr = 0, one = 0, two = 0, orc = 0;
  for (const e of shT) {
    const fw1 = model.forward(e.x, 1);
    const vhat = scratchArgmax(Array.from(fw1.cache.posOut[8].logits));
    if (vhat === e.v) scr++;
    if (scratchArgmax(Array.from(fw1.logits)) === e.y) one++;
    const x2 = e.flat.concat([e.qk, e.k, vhat, 8]);
    if (scratchArgmax(fwF(x2)) === e.y) two++;
    const xo = e.flat.concat([e.qk, e.k, e.v, 8]);
    if (scratchArgmax(fwF(xo)) === e.y) orc++;
  }
  const body = { spec: "batch2-v10.1", arm, verdict: "COMPLETE", seed, n: 200,
    accFwd: +(fF / fwdT.length).toFixed(4), accScratch: +(scr / shT.length).toFixed(4),
    accOne: +(one / shT.length).toFixed(4), accTwo: +(two / shT.length).toFixed(4), accOracle: +(orc / shT.length).toFixed(4) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("batch2-eval " + arm + " s=" + seed + " " + JSON.stringify(body));
  return body;
};
globalThis.runFwd3Eval = async function (fs, log, seed) {
  const ledgerPath = "src/evidence/decomp/d-batch1-eval-f3x-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.LaneInit(fs);
  const A = TASKS.assocR;
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-batch1-f3-s" + seed + ".json"));
  if (tr.verdict !== "COMPLETE") throw new Error("f3 train missing s" + seed);
  const model = T.makeModel(G.makeRng(tr.trainSeed), { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 });
  { const ps = model.params();
    for (let i = 0; i < ps.length; i++) {
      const dst = ps[i].v !== undefined ? ps[i].v : ps[i];
      const src = tr.params[i];
      for (let j = 0; j < dst.length; j++) dst[j] = src[j];
    } }
  const fwF = (x) => Array.from(model.forward(x, 1).logits);
  const frng = G.makeRng(52400 + seed), srng = G.makeRng(52500 + seed);
  const std = []; for (let i = 0; i < 200; i++) std.push(A.gen(frng, 1 + frng.int(3)));
  const flT = []; for (let i = 0; i < 200; i++) { const e = composeGenShiftScr(srng); flT.push({ x: e.flat.concat([e.qk, 8]), y: e.v }); }
  const aStd = std.filter((e) => scratchArgmax(fwF(e.x)) === e.y).length / std.length;
  const aFl = flT.filter((e) => scratchArgmax(fwF(e.x)) === e.y).length / flT.length;
  const body = { spec: "batch1-v10.1", arm: "f3", verdict: "COMPLETE", seed, n: 200,
    accFwdStd: +aStd.toFixed(4), accFwdFlats: +aFl.toFixed(4) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("fwd3-eval s=" + seed + " std=" + body.accFwdStd + " flats=" + body.accFwdFlats);
  return body;
};
globalThis.runHarnessT4 = async function (fs, log, seed) {
  const ledgerPath = "src/evidence/decomp/d-batch1-eval-t4-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T } = await globalThis.LaneInit(fs);
  const f3 = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-batch1-f3-s" + seed + ".json"));
  const t2 = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-scratch-t2-s" + seed + ".json"));
  const m1 = T.makeModel(G.makeRng(f3.trainSeed), { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 });
  { const ps = m1.params();
    for (let i = 0; i < ps.length; i++) {
      const dst = ps[i].v !== undefined ? ps[i].v : ps[i];
      const src = f3.params[i];
      for (let j = 0; j < dst.length; j++) dst[j] = src[j];
    } }
  const m2 = T.makeModel(G.makeRng(t2.trainSeed), { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 });
  { const ps = m2.params();
    for (let i = 0; i < ps.length; i++) {
      const dst = ps[i].v !== undefined ? ps[i].v : ps[i];
      const src = t2.params[i];
      for (let j = 0; j < dst.length; j++) dst[j] = src[j];
    } }
  const a1 = (x) => { const l = Array.from(m1.forward(x, 1).logits); let b = 0; for (let i = 1; i < 4; i++) if (l[i] > l[b]) b = i; return b; };
  const a2 = (x) => { const l = Array.from(m2.forward(x, 1).logits); let b = 0; for (let i = 1; i < 4; i++) if (l[i] > l[b]) b = i; return b; };
  const srng = G.makeRng(52500 + seed);
  const shT = []; for (let i = 0; i < 200; i++) shT.push(composeGenShiftScr(srng));
  let vhits = 0, hits = 0;
  for (const e of shT) {
    const vhat = a1(e.flat.concat([e.qk, 8]));
    if (vhat === e.v) vhits++;
    if (a2(e.flat.concat([e.qk, e.k, vhat, 8])) === e.y) hits++;
  }
  const body = { spec: "batch1-v10.1", arm: "t4", verdict: "COMPLETE", seed, n: 200,
    accRetrieve: +(vhits / shT.length).toFixed(4), accComposed: +(hits / shT.length).toFixed(4) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("harness-t4 s=" + seed + " ret=" + body.accRetrieve + " comp=" + body.accComposed);
  return body;
};

globalThis.runBatch1Len = async function (fs, log, arm, seed) {
  const ledgerPath = "src/evidence/decomp/d-batch1-eval-" + arm + "len-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T } = await globalThis.LaneInit(fs);
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-batch1-" + arm + "-s" + seed + ".json"));
  if (tr.verdict !== "COMPLETE") throw new Error("batch1 train missing " + arm + " s" + seed);
  const model = T.makeModel(G.makeRng(tr.trainSeed), { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 });
  { const ps = model.params();
    for (let i = 0; i < ps.length; i++) {
      const dst = ps[i].v !== undefined ? ps[i].v : ps[i];
      const src = tr.params[i];
      for (let j = 0; j < dst.length; j++) dst[j] = src[j];
    } }
  const fwF = (x) => Array.from(model.forward(x, 1).logits);
  function twoPass(e) {
    const scrIdx = e.x.length - 2;
    const fw1 = model.forward(e.x, 1);
    const vhat = scratchArgmax(Array.from(fw1.cache.posOut[scrIdx].logits));
    const x2 = e.x.slice();
    x2[scrIdx] = vhat;
    return scratchArgmax(fwF(x2)) === e.y;
  }
  const r2 = G.makeRng(52800 + seed), r4 = G.makeRng(52900 + seed);
  const t2 = []; for (let i = 0; i < 200; i++) t2.push(composeGenShiftScr(r2, 2));
  const t4 = []; for (let i = 0; i < 200; i++) t4.push(composeGenShiftScr(r4, 4));
  const body = { spec: "batch1-v10.1", arm, verdict: "COMPLETE", seed, n: 200,
    accTwo2: +(t2.filter(twoPass).length / t2.length).toFixed(4),
    accTwo4: +(t4.filter(twoPass).length / t4.length).toFixed(4) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("batch1-len " + arm + " s=" + seed + " 2p=" + body.accTwo2 + " 4p=" + body.accTwo4);
  return body;
};
globalThis.runBatch2Len = async function (fs, log, arm, seed) {
  const ledgerPath = "src/evidence/decomp/d-batch2-eval-" + arm + "len-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T } = await globalThis.LaneInit(fs);
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-batch2-" + arm + "-s" + seed + ".json"));
  if (tr.verdict !== "COMPLETE") throw new Error("batch2 train missing " + arm + " s" + seed);
  const model = T.makeModel(G.makeRng(tr.trainSeed), { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 });
  { const ps = model.params();
    for (let i = 0; i < ps.length; i++) {
      const dst = ps[i].v !== undefined ? ps[i].v : ps[i];
      const src = tr.params[i];
      for (let j = 0; j < dst.length; j++) dst[j] = src[j];
    } }
  const fwF = (x) => Array.from(model.forward(x, 1).logits);
  function twoPass(e) {
    const scrIdx = e.x.length - 2;
    const fw1 = model.forward(e.x, 1);
    const vhat = scratchArgmax(Array.from(fw1.cache.posOut[scrIdx].logits));
    const x2 = e.x.slice();
    x2[scrIdx] = vhat;
    return scratchArgmax(fwF(x2)) === e.y;
  }
  const r2 = G.makeRng(52800 + seed), r4 = G.makeRng(52900 + seed);
  const t2 = []; for (let i = 0; i < 200; i++) t2.push(composeGenShiftScr(r2, 2));
  const t4 = []; for (let i = 0; i < 200; i++) t4.push(composeGenShiftScr(r4, 4));
  const body = { spec: "batch2-v10.1", arm, verdict: "COMPLETE", seed, n: 200,
    accTwo2: +(t2.filter(twoPass).length / t2.length).toFixed(4),
    accTwo4: +(t4.filter(twoPass).length / t4.length).toFixed(4) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("batch2-len " + arm + " s=" + seed + " 2p=" + body.accTwo2 + " 4p=" + body.accTwo4);
  return body;
};
globalThis.runHarnessT5 = async function (fs, log, seed) {
  const ledgerPath = "src/evidence/decomp/d-batch2-eval-t5-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T } = await globalThis.LaneInit(fs);
  const a4 = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-batch1-a4-s" + seed + ".json"));
  const t2 = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-scratch-t2-s" + seed + ".json"));
  if (a4.verdict !== "COMPLETE") throw new Error("a4 train missing s" + seed);
  if (t2.verdict !== "COMPLETE") throw new Error("t2 train missing s" + seed);
  const m1 = T.makeModel(G.makeRng(a4.trainSeed), { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 });
  { const ps = m1.params();
    for (let i = 0; i < ps.length; i++) {
      const dst = ps[i].v !== undefined ? ps[i].v : ps[i];
      const src = a4.params[i];
      for (let j = 0; j < dst.length; j++) dst[j] = src[j];
    } }
  const m2 = T.makeModel(G.makeRng(t2.trainSeed), { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 });
  { const ps = m2.params();
    for (let i = 0; i < ps.length; i++) {
      const dst = ps[i].v !== undefined ? ps[i].v : ps[i];
      const src = t2.params[i];
      for (let j = 0; j < dst.length; j++) dst[j] = src[j];
    } }
  const a2 = (x) => { const l = Array.from(m2.forward(x, 1).logits); let b = 0; for (let i = 1; i < 4; i++) if (l[i] > l[b]) b = i; return b; };
  const srng = G.makeRng(52500 + seed);
  const shT = []; for (let i = 0; i < 200; i++) shT.push(composeGenShiftScr(srng));
  let vhits = 0, hits = 0, orc = 0;
  const byK = { k1: [0, 0], k2: [0, 0], k3: [0, 0] };
  for (const e of shT) {
    const fw1 = m1.forward(e.x, 1);
    const vhat = scratchArgmax(Array.from(fw1.cache.posOut[8].logits));
    if (vhat === e.v) vhits++;
    if (a2(e.flat.concat([e.qk, e.k, vhat, 8])) === e.y) { hits++; byK["k" + e.k][0]++; }
    byK["k" + e.k][1]++;
    if (a2(e.flat.concat([e.qk, e.k, e.v, 8])) === e.y) orc++;
  }
  const byKacc = {};
  for (let k = 1; k <= 3; k++) byKacc["k" + k] = +(byK["k" + k][0] / byK["k" + k][1]).toFixed(4);
  const accRet = vhits / shT.length, accOrc = orc / shT.length;
  const body = { spec: "batch2-v10.1", arm: "t5", verdict: "COMPLETE", seed, n: 200,
    accRetrieve: +accRet.toFixed(4), accComposed: +(hits / shT.length).toFixed(4),
    accOracle: +accOrc.toFixed(4), product: +(accRet * accOrc).toFixed(4), byK: byKacc };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("harness-t5 s=" + seed + " ret=" + body.accRetrieve + " comp=" + body.accComposed + " orc=" + body.accOracle);
  return body;
};
function batch3DlMap(line, d) { return line.map((t) => (t === 8 ? d : t)); }
globalThis.runDLTrain = async function (fs, log, seed) {
  const arm = "dl";
  const ledgerPath = "src/evidence/decomp/d-batch3-" + arm + "-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.LaneInit(fs);
  const A = TASKS.assocR;
  const trainSeed = 53200 + seed * 13;
  const drng = G.makeRng(52200 + seed), frng = G.makeRng(52300 + seed), sh = G.makeRng(52600 + seed), erng = G.makeRng(53600 + seed);
  const a = [], b = [];
  for (let i = 0; i < 150; i++) { const e = composeGenShiftScr(drng); const d = erng.int(2) === 0 ? 8 : 7; a.push({ x: batch3DlMap(e.x, d), y: e.y }); }
  for (let i = 0; i < 150; i++) b.push(A.gen(frng, 1 + frng.int(3)));
  const all = a.concat(b);
  for (let i = all.length - 1; i > 0; i--) { const j = sh.int(i + 1), t = all[i]; all[i] = all[j]; all[j] = t; }
  const t0 = Date.now();
  const out = await T.trainModel({ seed: trainSeed, arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4,
    train: all, steps: 800, batch: 16, lr: 5e-3, attnAux: true, attnAuxW: 1.0,
    prefixLabels: (x) => scratchLabelsT(A, x), auxW: 4.0 });
  const params = out.model.params().map((pl) => Array.from(pl.v !== undefined ? pl.v : pl));
  const body = { spec: "batch3-v10.1", arm, verdict: "COMPLETE", seed, trainSeed, nTrain: all.length,
    steps: 800, batch: 16, lr: 5e-3, auxW: 4.0, delim: "per-line coin 8/7 shift-only", wallMs: Date.now() - t0,
    firstLoss: +out.firstLoss.toFixed(4), lastLoss: +out.lastLoss.toFixed(4), params };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("dl-train s=" + seed + " loss=" + body.firstLoss + "->" + body.lastLoss);
  return body;
};
globalThis.runD2Train = async function (fs, log, seed) {
  const arm = "d2";
  const ledgerPath = "src/evidence/decomp/d-batch3-" + arm + "-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.LaneInit(fs);
  const A = TASKS.assocR;
  const trainSeed = 53200 + seed * 13;
  const drng = G.makeRng(52200 + seed), frng = G.makeRng(52300 + seed), sh = G.makeRng(52600 + seed);
  const a = [], b = [];
  for (let i = 0; i < 150; i++) { const e = composeGenShiftScr(drng); a.push({ x: e.x, y: e.y }); }
  for (let i = 0; i < 150; i++) b.push(A.gen(frng, 1 + frng.int(3)));
  const all = a.concat(b);
  for (let i = all.length - 1; i > 0; i--) { const j = sh.int(i + 1), t = all[i]; all[i] = all[j]; all[j] = t; }
  const t0 = Date.now();
  const out = await T.trainModel({ seed: trainSeed, arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4,
    train: all, steps: 800, batch: 16, lr: 5e-3, attnAux: true, attnAuxW: 1.0,
    prefixLabels: (x) => scratchLabelsT(A, x), auxW: 2.0 });
  const params = out.model.params().map((pl) => Array.from(pl.v !== undefined ? pl.v : pl));
  const body = { spec: "batch3-v10.1", arm, verdict: "COMPLETE", seed, trainSeed, nTrain: all.length,
    steps: 800, batch: 16, lr: 5e-3, auxW: 2.0, wallMs: Date.now() - t0,
    firstLoss: +out.firstLoss.toFixed(4), lastLoss: +out.lastLoss.toFixed(4), params };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("d2-train s=" + seed + " loss=" + body.firstLoss + "->" + body.lastLoss);
  return body;
};
globalThis.runD12Train = async function (fs, log, seed) {
  const arm = "d12";
  const ledgerPath = "src/evidence/decomp/d-batch3-" + arm + "-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.LaneInit(fs);
  const A = TASKS.assocR;
  const trainSeed = 53200 + seed * 13;
  const drng = G.makeRng(52200 + seed), frng = G.makeRng(52300 + seed), sh = G.makeRng(52600 + seed);
  const a = [], b = [];
  for (let i = 0; i < 150; i++) { const e = composeGenShiftScr(drng); a.push({ x: e.x, y: e.y }); }
  for (let i = 0; i < 150; i++) b.push(A.gen(frng, 1 + frng.int(3)));
  const all = a.concat(b);
  for (let i = all.length - 1; i > 0; i--) { const j = sh.int(i + 1), t = all[i]; all[i] = all[j]; all[j] = t; }
  const t0 = Date.now();
  const out = await T.trainModel({ seed: trainSeed, arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4,
    train: all, steps: 800, batch: 16, lr: 5e-3, attnAux: true, attnAuxW: 1.0,
    prefixLabels: (x) => scratchLabelsT(A, x), auxW: 12.0 });
  const params = out.model.params().map((pl) => Array.from(pl.v !== undefined ? pl.v : pl));
  const body = { spec: "batch3-v10.1", arm, verdict: "COMPLETE", seed, trainSeed, nTrain: all.length,
    steps: 800, batch: 16, lr: 5e-3, auxW: 12.0, wallMs: Date.now() - t0,
    firstLoss: +out.firstLoss.toFixed(4), lastLoss: +out.lastLoss.toFixed(4), params };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("d12-train s=" + seed + " loss=" + body.firstLoss + "->" + body.lastLoss);
  return body;
};
globalThis.runBatch3Eval = async function (fs, log, arm, seed) {
  const ledgerPath = "src/evidence/decomp/d-batch3-eval-" + arm + "-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.LaneInit(fs);
  const A = TASKS.assocR;
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-batch3-" + arm + "-s" + seed + ".json"));
  if (tr.verdict !== "COMPLETE") throw new Error("batch3 train missing " + arm + " s" + seed);
  const model = T.makeModel(G.makeRng(tr.trainSeed), { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 });
  { const ps = model.params();
    for (let i = 0; i < ps.length; i++) {
      const dst = ps[i].v !== undefined ? ps[i].v : ps[i];
      const src = tr.params[i];
      for (let j = 0; j < dst.length; j++) dst[j] = src[j];
    } }
  const dl = arm === "dl";
  const erng = dl ? G.makeRng(53600 + seed) : null;
  const M = (line) => (dl ? batch3DlMap(line, erng.int(2) === 0 ? 8 : 7) : line);
  const fwF = (x) => Array.from(model.forward(M(x), 1).logits);
  const frng = G.makeRng(52400 + seed), srng = G.makeRng(52500 + seed);
  const fwdT = []; for (let i = 0; i < 200; i++) fwdT.push(A.gen(frng, 1 + frng.int(3)));
  const shT = []; for (let i = 0; i < 200; i++) shT.push(composeGenShiftScr(srng));
  let fF = 0;
  for (const e of fwdT) if (scratchArgmax(fwF(e.x)) === e.y) fF++;
  let scr = 0, one = 0, two = 0, orc = 0;
  for (const e of shT) {
    const d = dl ? (erng.int(2) === 0 ? 8 : 7) : 8;
    const xm = dl ? batch3DlMap(e.x, d) : e.x;
    const fw1 = model.forward(xm, 1);
    const vhat = scratchArgmax(Array.from(fw1.cache.posOut[8].logits));
    if (vhat === e.v) scr++;
    if (scratchArgmax(Array.from(fw1.logits)) === e.y) one++;
    const x2 = batch3DlMap(e.flat.concat([e.qk, e.k, vhat, 8]), d);
    if (scratchArgmax(fwF(x2)) === e.y) two++;
    const xo = batch3DlMap(e.flat.concat([e.qk, e.k, e.v, 8]), d);
    if (scratchArgmax(fwF(xo)) === e.y) orc++;
  }
  const body = { spec: "batch3-v10.1", arm, verdict: "COMPLETE", seed, n: 200,
    accFwd: +(fF / fwdT.length).toFixed(4), accScratch: +(scr / shT.length).toFixed(4),
    accOne: +(one / shT.length).toFixed(4), accTwo: +(two / shT.length).toFixed(4), accOracle: +(orc / shT.length).toFixed(4) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("batch3-eval " + arm + " s=" + seed + " " + JSON.stringify(body));
  return body;
};
globalThis.runBatch3Len = async function (fs, log, arm, seed) {
  const ledgerPath = "src/evidence/decomp/d-batch3-eval-" + arm + "len-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T } = await globalThis.LaneInit(fs);
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-batch3-" + arm + "-s" + seed + ".json"));
  if (tr.verdict !== "COMPLETE") throw new Error("batch3 train missing " + arm + " s" + seed);
  const model = T.makeModel(G.makeRng(tr.trainSeed), { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 });
  { const ps = model.params();
    for (let i = 0; i < ps.length; i++) {
      const dst = ps[i].v !== undefined ? ps[i].v : ps[i];
      const src = tr.params[i];
      for (let j = 0; j < dst.length; j++) dst[j] = src[j];
    } }
  const dl = arm === "dl";
  const erng = dl ? G.makeRng(53600 + seed) : null;
  const fwF = (x) => Array.from(model.forward(x, 1).logits);
  function twoPass(e) {
    const d = dl ? (erng.int(2) === 0 ? 8 : 7) : 8;
    const xm = dl ? batch3DlMap(e.x, d) : e.x;
    const scrIdx = xm.length - 2;
    const fw1 = model.forward(xm, 1);
    const vhat = scratchArgmax(Array.from(fw1.cache.posOut[scrIdx].logits));
    const x2 = xm.slice();
    x2[scrIdx] = vhat;
    return scratchArgmax(fwF(x2)) === e.y;
  }
  const r2 = G.makeRng(52800 + seed), r4 = G.makeRng(52900 + seed);
  const t2 = []; for (let i = 0; i < 200; i++) t2.push(composeGenShiftScr(r2, 2));
  const t4 = []; for (let i = 0; i < 200; i++) t4.push(composeGenShiftScr(r4, 4));
  const body = { spec: "batch3-v10.1", arm, verdict: "COMPLETE", seed, n: 200,
    accTwo2: +(t2.filter(twoPass).length / t2.length).toFixed(4),
    accTwo4: +(t4.filter(twoPass).length / t4.length).toFixed(4) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("batch3-len " + arm + " s=" + seed + " 2p=" + body.accTwo2 + " 4p=" + body.accTwo4);
  return body;
};
globalThis.runHarnessT6 = async function (fs, log, seed) {
  const ledgerPath = "src/evidence/decomp/d-batch3-eval-t6-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T } = await globalThis.LaneInit(fs);
  const cb = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-batch2-cb-s" + seed + ".json"));
  const t2 = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-scratch-t2-s" + seed + ".json"));
  if (cb.verdict !== "COMPLETE") throw new Error("cb train missing s" + seed);
  if (t2.verdict !== "COMPLETE") throw new Error("t2 train missing s" + seed);
  const m1 = T.makeModel(G.makeRng(cb.trainSeed), { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 });
  { const ps = m1.params();
    for (let i = 0; i < ps.length; i++) {
      const dst = ps[i].v !== undefined ? ps[i].v : ps[i];
      const src = cb.params[i];
      for (let j = 0; j < dst.length; j++) dst[j] = src[j];
    } }
  const m2 = T.makeModel(G.makeRng(t2.trainSeed), { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 });
  { const ps = m2.params();
    for (let i = 0; i < ps.length; i++) {
      const dst = ps[i].v !== undefined ? ps[i].v : ps[i];
      const src = t2.params[i];
      for (let j = 0; j < dst.length; j++) dst[j] = src[j];
    } }
  const a2 = (x) => { const l = Array.from(m2.forward(x, 1).logits); let b = 0; for (let i = 1; i < 4; i++) if (l[i] > l[b]) b = i; return b; };
  const srng = G.makeRng(52500 + seed);
  const shT = []; for (let i = 0; i < 200; i++) shT.push(composeGenShiftScr(srng));
  let vhits = 0, hits = 0, orc = 0;
  const byK = { k1: [0, 0], k2: [0, 0], k3: [0, 0] };
  for (const e of shT) {
    const fw1 = m1.forward(e.x, 1);
    const vhat = scratchArgmax(Array.from(fw1.cache.posOut[8].logits));
    if (vhat === e.v) vhits++;
    if (a2(e.flat.concat([e.qk, e.k, vhat, 8])) === e.y) { hits++; byK["k" + e.k][0]++; }
    byK["k" + e.k][1]++;
    if (a2(e.flat.concat([e.qk, e.k, e.v, 8])) === e.y) orc++;
  }
  const byKacc = {};
  for (let k = 1; k <= 3; k++) byKacc["k" + k] = +(byK["k" + k][0] / byK["k" + k][1]).toFixed(4);
  const accRet = vhits / shT.length, accOrc = orc / shT.length;
  const body = { spec: "batch3-v10.1", arm: "t6", verdict: "COMPLETE", seed, n: 200,
    accRetrieve: +accRet.toFixed(4), accComposed: +(hits / shT.length).toFixed(4),
    accOracle: +accOrc.toFixed(4), product: +(accRet * accOrc).toFixed(4), byK: byKacc };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("harness-t6 s=" + seed + " ret=" + body.accRetrieve + " comp=" + body.accComposed + " orc=" + body.accOracle);
  return body;
};
globalThis.runLM4Train = async function (fs, log, seed) {
  const arm = "lm4";
  const ledgerPath = "src/evidence/decomp/d-r1-" + arm + "-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.LaneInit(fs);
  const A = TASKS.assocR;
  const trainSeed = 53200 + seed * 13;
  const drng = G.makeRng(52200 + seed), frng = G.makeRng(52300 + seed), sh = G.makeRng(52600 + seed);
  const a = [], b = [];
  for (let i = 0; i < 50; i++) { const e = composeGenShiftScr(drng, 2); a.push({ x: e.x, y: e.y }); }
  for (let i = 0; i < 50; i++) { const e = composeGenShiftScr(drng, 3); a.push({ x: e.x, y: e.y }); }
  for (let i = 0; i < 50; i++) { const e = composeGenShiftScr(drng, 4); a.push({ x: e.x, y: e.y }); }
  for (let i = 0; i < 150; i++) b.push(A.gen(frng, 1 + frng.int(3)));
  const all = a.concat(b);
  for (let i = all.length - 1; i > 0; i--) { const j = sh.int(i + 1), t = all[i]; all[i] = all[j]; all[j] = t; }
  const t0 = Date.now();
  const out = await T.trainModel({ seed: trainSeed, arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4,
    train: all, steps: 800, batch: 16, lr: 5e-3, attnAux: true, attnAuxW: 1.0,
    prefixLabels: (x) => scratchLabelsT(A, x), auxW: 4.0 });
  const params = out.model.params().map((pl) => Array.from(pl.v !== undefined ? pl.v : pl));
  const body = { spec: "r1-v10", arm, verdict: "COMPLETE", seed, trainSeed, nTrain: all.length,
    steps: 800, batch: 16, lr: 5e-3, auxW: 4.0, diet: "50x2p+50x3p+50x4p", wallMs: Date.now() - t0,
    firstLoss: +out.firstLoss.toFixed(4), lastLoss: +out.lastLoss.toFixed(4), params };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("lm4-train s=" + seed + " loss=" + body.firstLoss + "->" + body.lastLoss);
  return body;
};
globalThis.runR1Eval = async function (fs, log, arm, seed) {
  const ledgerPath = "src/evidence/decomp/d-r1-eval-" + arm + "-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.LaneInit(fs);
  const A = TASKS.assocR;
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-r1-" + arm + "-s" + seed + ".json"));
  if (tr.verdict !== "COMPLETE") throw new Error("r1 train missing " + arm + " s" + seed);
  const model = T.makeModel(G.makeRng(tr.trainSeed), { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 });
  { const ps = model.params();
    for (let i = 0; i < ps.length; i++) {
      const dst = ps[i].v !== undefined ? ps[i].v : ps[i];
      const src = tr.params[i];
      for (let j = 0; j < dst.length; j++) dst[j] = src[j];
    } }
  const fwF = (x) => Array.from(model.forward(x, 1).logits);
  const frng = G.makeRng(52400 + seed), srng = G.makeRng(52500 + seed);
  const fwdT = []; for (let i = 0; i < 200; i++) fwdT.push(A.gen(frng, 1 + frng.int(3)));
  const shT = []; for (let i = 0; i < 200; i++) shT.push(composeGenShiftScr(srng));
  let fF = 0;
  for (const e of fwdT) if (scratchArgmax(fwF(e.x)) === e.y) fF++;
  let scr = 0, one = 0, two = 0, orc = 0;
  for (const e of shT) {
    const fw1 = model.forward(e.x, 1);
    const vhat = scratchArgmax(Array.from(fw1.cache.posOut[8].logits));
    if (vhat === e.v) scr++;
    if (scratchArgmax(Array.from(fw1.logits)) === e.y) one++;
    const x2 = e.flat.concat([e.qk, e.k, vhat, 8]);
    if (scratchArgmax(fwF(x2)) === e.y) two++;
    const xo = e.flat.concat([e.qk, e.k, e.v, 8]);
    if (scratchArgmax(fwF(xo)) === e.y) orc++;
  }
  const body = { spec: "r1-v10", arm, verdict: "COMPLETE", seed, n: 200,
    accFwd: +(fF / fwdT.length).toFixed(4), accScratch: +(scr / shT.length).toFixed(4),
    accOne: +(one / shT.length).toFixed(4), accTwo: +(two / shT.length).toFixed(4), accOracle: +(orc / shT.length).toFixed(4) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("r1-eval " + arm + " s=" + seed + " " + JSON.stringify(body));
  return body;
};
globalThis.runR1Len = async function (fs, log, arm, seed) {
  const ledgerPath = "src/evidence/decomp/d-r1-eval-" + arm + "len-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T } = await globalThis.LaneInit(fs);
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-r1-" + arm + "-s" + seed + ".json"));
  if (tr.verdict !== "COMPLETE") throw new Error("r1 train missing " + arm + " s" + seed);
  const model = T.makeModel(G.makeRng(tr.trainSeed), { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 });
  { const ps = model.params();
    for (let i = 0; i < ps.length; i++) {
      const dst = ps[i].v !== undefined ? ps[i].v : ps[i];
      const src = tr.params[i];
      for (let j = 0; j < dst.length; j++) dst[j] = src[j];
    } }
  const fwF = (x) => Array.from(model.forward(x, 1).logits);
  function twoPass(e) {
    const scrIdx = e.x.length - 2;
    const fw1 = model.forward(e.x, 1);
    const vhat = scratchArgmax(Array.from(fw1.cache.posOut[scrIdx].logits));
    const x2 = e.x.slice();
    x2[scrIdx] = vhat;
    return scratchArgmax(fwF(x2)) === e.y;
  }
  const r2 = G.makeRng(52800 + seed), r4 = G.makeRng(52900 + seed);
  const t2 = []; for (let i = 0; i < 200; i++) t2.push(composeGenShiftScr(r2, 2));
  const t4 = []; for (let i = 0; i < 200; i++) t4.push(composeGenShiftScr(r4, 4));
  const body = { spec: "r1-v10", arm, verdict: "COMPLETE", seed, n: 200,
    accTwo2: +(t2.filter(twoPass).length / t2.length).toFixed(4),
    accTwo4: +(t4.filter(twoPass).length / t4.length).toFixed(4) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("r1-len " + arm + " s=" + seed + " 2p=" + body.accTwo2 + " 4p=" + body.accTwo4);
  return body;
};
globalThis.runHarnessC6 = async function (fs, log, seed) {
  const ledgerPath = "src/evidence/decomp/d-r1-eval-c6-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T } = await globalThis.LaneInit(fs);
  const cb = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-batch2-cb-s" + seed + ".json"));
  if (cb.verdict !== "COMPLETE") throw new Error("cb train missing s" + seed);
  const m = T.makeModel(G.makeRng(cb.trainSeed), { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 });
  { const ps = m.params();
    for (let i = 0; i < ps.length; i++) {
      const dst = ps[i].v !== undefined ? ps[i].v : ps[i];
      const src = cb.params[i];
      for (let j = 0; j < dst.length; j++) dst[j] = src[j];
    } }
  const aF = (x) => { const l = Array.from(m.forward(x, 1).logits); let b = 0; for (let i = 1; i < 4; i++) if (l[i] > l[b]) b = i; return b; };
  const srng = G.makeRng(52500 + seed);
  const shT = []; for (let i = 0; i < 200; i++) shT.push(composeGenShiftScr(srng));
  let vhits = 0, hits = 0, orc = 0, cr_r = 0, n_r = 0, cr_w = 0, n_w = 0;
  const byK = { k1: [0, 0], k2: [0, 0], k3: [0, 0] };
  for (const e of shT) {
    const fw1 = m.forward(e.x, 1);
    const vhat = scratchArgmax(Array.from(fw1.cache.posOut[8].logits));
    const okV = vhat === e.v;
    if (okV) vhits++;
    const p = aF(e.flat.concat([e.qk, e.k, vhat, 8]));
    if (p === e.y) { hits++; byK["k" + e.k][0]++; if (okV) cr_r++; else cr_w++; }
    else if (okV) n_r++;
    else n_w++;
    byK["k" + e.k][1]++;
    if (aF(e.flat.concat([e.qk, e.k, e.v, 8])) === e.y) orc++;
  }
  const byKacc = {};
  for (let k = 1; k <= 3; k++) byKacc["k" + k] = +(byK["k" + k][0] / byK["k" + k][1]).toFixed(4);
  const accRet = vhits / shT.length, accOrc = orc / shT.length;
  const pCorrGivenVhat = n_r + cr_r > 0 ? +((cr_r) / (cr_r + n_r)).toFixed(4) : null;
  const pCorrGivenNoVhat = n_w + cr_w > 0 ? +((cr_w) / (cr_w + n_w)).toFixed(4) : null;
  const body = { spec: "r1-v10", arm: "c6", verdict: "COMPLETE", seed, n: 200,
    accRetrieve: +accRet.toFixed(4), accComposed: +(hits / shT.length).toFixed(4),
    accOracle: +accOrc.toFixed(4), product: +(accRet * accOrc).toFixed(4),
    pCorrGivenVhat, pCorrGivenNoVhat, byK: byKacc };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("harness-c6 s=" + seed + " comp=" + body.accComposed + " pC|v=" + pCorrGivenVhat + " pC|~v=" + pCorrGivenNoVhat);
  return body;
};
globalThis.runFQ = async function (fs, log, seed) {
  const ledgerPath = "src/evidence/decomp/d-r1-eval-fq-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T } = await globalThis.LaneInit(fs);
  const a4 = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-batch1-a4-s" + seed + ".json"));
  if (a4.verdict !== "COMPLETE") throw new Error("a4 train missing s" + seed);
  const m = T.makeModel(G.makeRng(a4.trainSeed), { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 });
  { const ps = m.params();
    for (let i = 0; i < ps.length; i++) {
      const dst = ps[i].v !== undefined ? ps[i].v : ps[i];
      const src = a4.params[i];
      for (let j = 0; j < dst.length; j++) dst[j] = src[j];
    } }
  const srng = G.makeRng(52500 + seed);
  const flT = []; for (let i = 0; i < 200; i++) { const e = composeGenShiftScr(srng); flT.push({ x: e.flat.concat([e.qk, 8]), y: e.v }); }
  let hits = 0;
  for (const e of flT) { const l = Array.from(m.forward(e.x, 1).logits); let b = 0; for (let i = 1; i < 4; i++) if (l[i] > l[b]) b = i; if (b === e.y) hits++; }
  const body = { spec: "r1-v10", arm: "fq", verdict: "COMPLETE", seed, n: 200, accFlats: +(hits / flT.length).toFixed(4) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("fq s=" + seed + " flats=" + body.accFlats);
  return body;
};
globalThis.runADD4Train = async function (fs, log, seed) {
  const arm = "add4";
  const ledgerPath = "src/evidence/decomp/d-r2-" + arm + "-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.LaneInit(fs);
  const A = TASKS.assocR;
  const trainSeed = 53200 + seed * 13;
  const drng = G.makeRng(52200 + seed), frng = G.makeRng(52300 + seed), sh = G.makeRng(52600 + seed);
  const a = [], b = [];
  for (let i = 0; i < 150; i++) {
    const e = composeGenShiftScr(drng);
    const x = e.flat.concat([e.qk, e.k, e.v, 8]);
    a.push({ x, y: e.y });
  }
  for (let i = 0; i < 150; i++) b.push(A.gen(frng, 1 + frng.int(3)));
  const all = a.concat(b);
  for (let i = all.length - 1; i > 0; i--) { const j = sh.int(i + 1), t = all[i]; all[i] = all[j]; all[j] = t; }
  const t0 = Date.now();
  const out = await T.trainModel({ seed: trainSeed, arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4,
    train: all, steps: 800, batch: 16, lr: 5e-3, attnAux: true, attnAuxW: 1.0,
    prefixLabels: (x) => scratchLabelsT(A, x), auxW: 4.0 });
  const params = out.model.params().map((pl) => Array.from(pl.v !== undefined ? pl.v : pl));
  const body = { spec: "r2-v10", arm, verdict: "COMPLETE", seed, trainSeed, nTrain: all.length,
    steps: 800, batch: 16, lr: 5e-3, auxW: 4.0, wallMs: Date.now() - t0,
    firstLoss: +out.firstLoss.toFixed(4), lastLoss: +out.lastLoss.toFixed(4), params };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("add4-train s=" + seed + " loss=" + body.firstLoss + "->" + body.lastLoss);
  return body;
};
globalThis.runR2Eval = async function (fs, log, arm, seed) {
  const ledgerPath = "src/evidence/decomp/d-r2-eval-" + arm + "-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.LaneInit(fs);
  const A = TASKS.assocR;
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-r2-" + arm + "-s" + seed + ".json"));
  if (tr.verdict !== "COMPLETE") throw new Error("r2 train missing " + arm + " s" + seed);
  const model = T.makeModel(G.makeRng(tr.trainSeed), { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 });
  { const ps = model.params();
    for (let i = 0; i < ps.length; i++) {
      const dst = ps[i].v !== undefined ? ps[i].v : ps[i];
      const src = tr.params[i];
      for (let j = 0; j < dst.length; j++) dst[j] = src[j];
    } }
  const aF = (x) => { const l = Array.from(model.forward(x, 1).logits); let b = 0; for (let i = 1; i < 4; i++) if (l[i] > l[b]) b = i; return b; };
  const frng = G.makeRng(52400 + seed), srng = G.makeRng(52500 + seed);
  const fwdT = []; for (let i = 0; i < 200; i++) fwdT.push(A.gen(frng, 1 + frng.int(3)));
  const orcT = []; for (let i = 0; i < 200; i++) { const e = composeGenShiftScr(srng); orcT.push({ x: e.flat.concat([e.qk, e.k, e.v, 8]), y: e.y }); }
  const accFwd = fwdT.filter((e) => aF(e.x) === e.y).length / fwdT.length;
  const accOracle = orcT.filter((e) => aF(e.x) === e.y).length / orcT.length;
  const body = { spec: "r2-v10", arm, verdict: "COMPLETE", seed, n: 200,
    accFwd: +accFwd.toFixed(4), accOracle: +accOracle.toFixed(4) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("r2-eval " + arm + " s=" + seed + " fwd=" + body.accFwd + " orc=" + body.accOracle);
  return body;
};
globalThis.runHarnessR2H = async function (fs, log, seed) {
  const ledgerPath = "src/evidence/decomp/d-r2-eval-r2h-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T } = await globalThis.LaneInit(fs);
  const cb = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-batch2-cb-s" + seed + ".json"));
  const a4 = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-batch1-a4-s" + seed + ".json"));
  const t2 = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-scratch-t2-s" + seed + ".json"));
  for (const [n, o] of [["cb", cb], ["a4", a4], ["t2", t2]]) if (o.verdict !== "COMPLETE") throw new Error(n + " missing s" + seed);
  function restore(o) {
    const m = T.makeModel(G.makeRng(o.trainSeed), { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 });
    const ps = m.params();
    for (let i = 0; i < ps.length; i++) {
      const dst = ps[i].v !== undefined ? ps[i].v : ps[i];
      const src = o.params[i];
      for (let j = 0; j < dst.length; j++) dst[j] = src[j];
    }
    return m;
  }
  const mA = restore(cb), mB = restore(a4), m2 = restore(t2);
  const a2 = (x) => { const l = Array.from(m2.forward(x, 1).logits); let b = 0; for (let i = 1; i < 4; i++) if (l[i] > l[b]) b = i; return b; };
  const srng = G.makeRng(52500 + seed);
  const shT = []; for (let i = 0; i < 200; i++) shT.push(composeGenShiftScr(srng));
  let nag = 0, cag = 0, ndis = 0, cdis = 0;
  for (const e of shT) {
    const va = scratchArgmax(Array.from(mA.forward(e.x, 1).cache.posOut[8].logits));
    const vb = scratchArgmax(Array.from(mB.forward(e.x, 1).cache.posOut[8].logits));
    const ok = a2(e.flat.concat([e.qk, e.k, va, 8])) === e.y;
    if (va === vb) { nag++; if (ok) cag++; } else { ndis++; if (ok) cdis++; }
  }
  const accAgree = nag > 0 ? cag / nag : null, accDis = ndis > 0 ? cdis / ndis : null;
  const body = { spec: "r2-v10", arm: "r2h", verdict: "COMPLETE", seed, n: 200,
    agreeRate: +(nag / shT.length).toFixed(4),
    accAgree: accAgree === null ? null : +accAgree.toFixed(4),
    accDisagree: accDis === null ? null : +accDis.toFixed(4),
    gap: (accAgree === null || accDis === null) ? null : +(accAgree - accDis).toFixed(4) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("r2h s=" + seed + " agree=" + body.agreeRate + " aA=" + body.accAgree + " aD=" + body.accDisagree + " gap=" + body.gap);
  return body;
};
globalThis.runK3P = async function (fs, log, seed) {
  const ledgerPath = "src/evidence/decomp/d-r2-eval-k3p-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T } = await globalThis.LaneInit(fs);
  const t2 = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-scratch-t2-s" + seed + ".json"));
  const cb = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-batch2-cb-s" + seed + ".json"));
  for (const [n, o] of [["t2", t2], ["cb", cb]]) if (o.verdict !== "COMPLETE") throw new Error(n + " missing s" + seed);
  function restore(o) {
    const m = T.makeModel(G.makeRng(o.trainSeed), { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 });
    const ps = m.params();
    for (let i = 0; i < ps.length; i++) {
      const dst = ps[i].v !== undefined ? ps[i].v : ps[i];
      const src = o.params[i];
      for (let j = 0; j < dst.length; j++) dst[j] = src[j];
    }
    return m;
  }
  const mT = restore(t2), mC = restore(cb);
  function prof(m) {
    const srng = G.makeRng(52500 + seed);
    const perK = { 1: [0, 0], 2: [0, 0], 3: [0, 0] };
    const conf = {};
    let offByOne = 0, wrong = 0;
    for (let i = 0; i < 200; i++) {
      const e = composeGenShiftScr(srng);
      const x = e.flat.concat([e.qk, e.k, e.v, 8]);
      const l = Array.from(m.forward(x, 1).logits);
      let b = 0; for (let j = 1; j < 4; j++) if (l[j] > l[b]) b = j;
      perK[e.k][1]++;
      if (b === e.y) perK[e.k][0]++;
      else {
        wrong++;
        const key = e.y + "->" + b;
        conf[key] = (conf[key] || 0) + 1;
        if (Math.abs(b - e.y) === 1) offByOne++;
      }
    }
    const acc = {};
    for (let k = 1; k <= 3; k++) acc["k" + k] = +(perK[k][0] / perK[k][1]).toFixed(4);
    return { perK: acc, offByOneShare: wrong > 0 ? +(offByOne / wrong).toFixed(4) : null, confusion: conf };
  }
  const body = { spec: "r2-v10", arm: "k3p", verdict: "COMPLETE", seed, n: 200, t2: prof(mT), cbOracle: prof(mC) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("k3p s=" + seed + " t2=" + JSON.stringify(body.t2.perK) + " obo=" + body.t2.offByOneShare + " cb=" + JSON.stringify(body.cbOracle.perK) + " obo=" + body.cbOracle.offByOneShare);
  return body;
};
globalThis.runK3RTrain = async function (fs, log, seed) {
  const arm = "k3r";
  const ledgerPath = "src/evidence/decomp/d-r3-" + arm + "-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.LaneInit(fs);
  const A = TASKS.assocR;
  const trainSeed = 53200 + seed * 13;
  const drng = G.makeRng(52200 + seed), frng = G.makeRng(52300 + seed), sh = G.makeRng(52600 + seed);
  const a = [], b = [];
  for (let i = 0; i < 150; i++) {
    const e = composeGenShiftScr(drng);
    if (i < 75) {
      const k2 = 3, y2 = (e.v + k2) % 4;
      a.push({ x: e.flat.concat([e.qk, k2, 0, 8]), y: y2 });
    } else a.push({ x: e.x, y: e.y });
  }
  for (let i = 0; i < 150; i++) b.push(A.gen(frng, 1 + frng.int(3)));
  const all = a.concat(b);
  for (let i = all.length - 1; i > 0; i--) { const j = sh.int(i + 1), t = all[i]; all[i] = all[j]; all[j] = t; }
  const t0 = Date.now();
  const out = await T.trainModel({ seed: trainSeed, arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4,
    train: all, steps: 800, batch: 16, lr: 5e-3, attnAux: true, attnAuxW: 1.0,
    prefixLabels: (x) => scratchLabelsT(A, x), auxW: 4.0 });
  const params = out.model.params().map((pl) => Array.from(pl.v !== undefined ? pl.v : pl));
  const body = { spec: "r3-v10", arm, verdict: "COMPLETE", seed, trainSeed, nTrain: all.length,
    steps: 800, batch: 16, lr: 5e-3, auxW: 4.0, diet: "k3-forced-75 + random-75", wallMs: Date.now() - t0,
    firstLoss: +out.firstLoss.toFixed(4), lastLoss: +out.lastLoss.toFixed(4), params };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("k3r-train s=" + seed + " loss=" + body.firstLoss + "->" + body.lastLoss);
  return body;
};
function r3Restore(T, G, o) {
  const m = T.makeModel(G.makeRng(o.trainSeed), { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 });
  const ps = m.params();
  for (let i = 0; i < ps.length; i++) {
    const dst = ps[i].v !== undefined ? ps[i].v : ps[i];
    const src = o.params[i];
    for (let j = 0; j < dst.length; j++) dst[j] = src[j];
  }
  return m;
}
globalThis.runR3Eval = async function (fs, log, arm, seed) {
  const ledgerPath = "src/evidence/decomp/d-r3-eval-" + arm + "-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.LaneInit(fs);
  const A = TASKS.assocR;
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-r3-" + arm + "-s" + seed + ".json"));
  if (tr.verdict !== "COMPLETE") throw new Error("r3 train missing " + arm + " s" + seed);
  const model = r3Restore(T, G, tr);
  const fwF = (x) => Array.from(model.forward(x, 1).logits);
  const frng = G.makeRng(52400 + seed), srng = G.makeRng(52500 + seed);
  const fwdT = []; for (let i = 0; i < 200; i++) fwdT.push(A.gen(frng, 1 + frng.int(3)));
  const shT = []; for (let i = 0; i < 200; i++) shT.push(composeGenShiftScr(srng));
  let fF = 0;
  for (const e of fwdT) if (scratchArgmax(fwF(e.x)) === e.y) fF++;
  let scr = 0, one = 0, two = 0, orc = 0;
  for (const e of shT) {
    const fw1 = model.forward(e.x, 1);
    const vhat = scratchArgmax(Array.from(fw1.cache.posOut[8].logits));
    if (vhat === e.v) scr++;
    if (scratchArgmax(Array.from(fw1.logits)) === e.y) one++;
    const x2 = e.flat.concat([e.qk, e.k, vhat, 8]);
    if (scratchArgmax(fwF(x2)) === e.y) two++;
    const xo = e.flat.concat([e.qk, e.k, e.v, 8]);
    if (scratchArgmax(fwF(xo)) === e.y) orc++;
  }
  const body = { spec: "r3-v10", arm, verdict: "COMPLETE", seed, n: 200,
    accFwd: +(fF / fwdT.length).toFixed(4), accScratch: +(scr / shT.length).toFixed(4),
    accOne: +(one / shT.length).toFixed(4), accTwo: +(two / shT.length).toFixed(4), accOracle: +(orc / shT.length).toFixed(4) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("r3-eval " + arm + " s=" + seed + " " + JSON.stringify(body));
  return body;
};
globalThis.runR3Len = async function (fs, log, arm, seed) {
  const ledgerPath = "src/evidence/decomp/d-r3-eval-" + arm + "len-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T } = await globalThis.LaneInit(fs);
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-r3-" + arm + "-s" + seed + ".json"));
  if (tr.verdict !== "COMPLETE") throw new Error("r3 train missing " + arm + " s" + seed);
  const model = r3Restore(T, G, tr);
  const fwF = (x) => Array.from(model.forward(x, 1).logits);
  function twoPass(e) {
    const scrIdx = e.x.length - 2;
    const fw1 = model.forward(e.x, 1);
    const vhat = scratchArgmax(Array.from(fw1.cache.posOut[scrIdx].logits));
    const x2 = e.x.slice();
    x2[scrIdx] = vhat;
    return scratchArgmax(fwF(x2)) === e.y;
  }
  const r2 = G.makeRng(52800 + seed), r4 = G.makeRng(52900 + seed);
  const t2 = []; for (let i = 0; i < 200; i++) t2.push(composeGenShiftScr(r2, 2));
  const t4 = []; for (let i = 0; i < 200; i++) t4.push(composeGenShiftScr(r4, 4));
  const body = { spec: "r3-v10", arm, verdict: "COMPLETE", seed, n: 200,
    accTwo2: +(t2.filter(twoPass).length / t2.length).toFixed(4),
    accTwo4: +(t4.filter(twoPass).length / t4.length).toFixed(4) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("r3-len " + arm + " s=" + seed + " 2p=" + body.accTwo2 + " 4p=" + body.accTwo4);
  return body;
};
globalThis.runR3Perk = async function (fs, log, arm, seed) {
  const ledgerPath = "src/evidence/decomp/d-r3-eval-" + arm + "perk-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T } = await globalThis.LaneInit(fs);
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-r3-" + arm + "-s" + seed + ".json"));
  if (tr.verdict !== "COMPLETE") throw new Error("r3 train missing " + arm + " s" + seed);
  const model = r3Restore(T, G, tr);
  const srng = G.makeRng(52500 + seed);
  const perK = { 1: [0, 0], 2: [0, 0], 3: [0, 0] };
  for (let i = 0; i < 200; i++) {
    const e = composeGenShiftScr(srng);
    const x = e.flat.concat([e.qk, e.k, e.v, 8]);
    const l = Array.from(model.forward(x, 1).logits);
    let b = 0; for (let j = 1; j < 4; j++) if (l[j] > l[b]) b = j;
    perK[e.k][1]++;
    if (b === e.y) perK[e.k][0]++;
  }
  const acc = {};
  for (let k = 1; k <= 3; k++) acc["k" + k] = +(perK[k][0] / perK[k][1]).toFixed(4);
  const body = { spec: "r3-v10", arm, verdict: "COMPLETE", seed, n: 200, perK: acc };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("r3-perk " + arm + " s=" + seed + " " + JSON.stringify(acc));
  return body;
};
globalThis.runHarnessENS = async function (fs, log, seed) {
  const ledgerPath = "src/evidence/decomp/d-r3-eval-ens-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T } = await globalThis.LaneInit(fs);
  const cb = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-batch2-cb-s" + seed + ".json"));
  const a4 = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-batch1-a4-s" + seed + ".json"));
  const t2 = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-scratch-t2-s" + seed + ".json"));
  for (const [n, o] of [["cb", cb], ["a4", a4], ["t2", t2]]) if (o.verdict !== "COMPLETE") throw new Error(n + " missing s" + seed);
  const mA = r3Restore(T, G, cb), mB = r3Restore(T, G, a4), m2 = r3Restore(T, G, t2);
  const a2 = (x) => { const l = Array.from(m2.forward(x, 1).logits); let b = 0; for (let i = 1; i < 4; i++) if (l[i] > l[b]) b = i; return b; };
  const srng = G.makeRng(52500 + seed);
  const shT = []; for (let i = 0; i < 200; i++) shT.push(composeGenShiftScr(srng));
  let hits = 0, ndis = 0, cdis = 0;
  for (const e of shT) {
    const va = scratchArgmax(Array.from(mA.forward(e.x, 1).cache.posOut[8].logits));
    const vb = scratchArgmax(Array.from(mB.forward(e.x, 1).cache.posOut[8].logits));
    const vuse = va === vb ? va : vb;
    if (a2(e.flat.concat([e.qk, e.k, vuse, 8])) === e.y) {
      hits++;
      if (va !== vb) cdis++;
    }
    if (va !== vb) ndis++;
  }
  const body = { spec: "r3-v10", arm: "ens", verdict: "COMPLETE", seed, n: 200,
    accComposed: +(hits / shT.length).toFixed(4),
    disagreeRate: +(ndis / shT.length).toFixed(4),
    rescueRate: ndis > 0 ? +(cdis / ndis).toFixed(4) : null };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("ens s=" + seed + " comp=" + body.accComposed + " dis=" + body.disagreeRate + " rescue=" + body.rescueRate);
  return body;
};
globalThis.runDLR = async function (fs, log, seed) {
  const ledgerPath = "src/evidence/decomp/d-r3-eval-dlr-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T } = await globalThis.LaneInit(fs);
  const dl = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-batch3-dl-s" + seed + ".json"));
  if (dl.verdict !== "COMPLETE") throw new Error("dl train missing s" + seed);
  const model = r3Restore(T, G, dl);
  const srng = G.makeRng(52500 + seed);
  const lines = []; for (let i = 0; i < 200; i++) lines.push(composeGenShiftScr(srng));
  function accWith(d) {
    let hits = 0;
    for (const e of lines) {
      const xm = e.x.map((t) => (t === 8 ? d : t));
      const fw1 = model.forward(xm, 1);
      if (scratchArgmax(Array.from(fw1.cache.posOut[8].logits)) === e.v) hits++;
    }
    return hits / lines.length;
  }
  const a8 = accWith(8), a7 = accWith(7);
  const body = { spec: "r3-v10", arm: "dlr", verdict: "COMPLETE", seed, n: 200,
    acc8: +a8.toFixed(4), acc7: +a7.toFixed(4), gap: +Math.abs(a8 - a7).toFixed(4) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("dlr s=" + seed + " acc8=" + body.acc8 + " acc7=" + body.acc7 + " gap=" + body.gap);
  return body;
};
globalThis.runAL8Train = async function (fs, log, seed) {
  const arm = "al8";
  const ledgerPath = "src/evidence/decomp/d-r4-" + arm + "-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.LaneInit(fs);
  const A = TASKS.assocR;
  const trainSeed = 53200 + seed * 13;
  const drng = G.makeRng(52200 + seed), frng = G.makeRng(52300 + seed), sh = G.makeRng(52600 + seed);
  const a = [], b = [];
  for (let i = 0; i < 50; i++) { const e = composeGenShiftScr(drng, 2); a.push({ x: e.x, y: e.y }); }
  for (let i = 0; i < 50; i++) { const e = composeGenShiftScr(drng, 3); a.push({ x: e.x, y: e.y }); }
  for (let i = 0; i < 50; i++) { const e = composeGenShiftScr(drng, 4); a.push({ x: e.x, y: e.y }); }
  for (let i = 0; i < 150; i++) b.push(A.gen(frng, 1 + frng.int(3)));
  const all = a.concat(b);
  for (let i = all.length - 1; i > 0; i--) { const j = sh.int(i + 1), t = all[i]; all[i] = all[j]; all[j] = t; }
  const t0 = Date.now();
  const out = await T.trainModel({ seed: trainSeed, arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4,
    train: all, steps: 800, batch: 16, lr: 5e-3, attnAux: true, attnAuxW: 1.0,
    prefixLabels: (x) => scratchLabelsT(A, x), auxW: 8.0 });
  const params = out.model.params().map((pl) => Array.from(pl.v !== undefined ? pl.v : pl));
  const body = { spec: "r4-v10", arm, verdict: "COMPLETE", seed, trainSeed, nTrain: all.length,
    steps: 800, batch: 16, lr: 5e-3, auxW: 8.0, diet: "50x2p+50x3p+50x4p", wallMs: Date.now() - t0,
    firstLoss: +out.firstLoss.toFixed(4), lastLoss: +out.lastLoss.toFixed(4), params };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("al8-train s=" + seed + " loss=" + body.firstLoss + "->" + body.lastLoss);
  return body;
};
globalThis.runR4Eval = async function (fs, log, arm, seed) {
  const ledgerPath = "src/evidence/decomp/d-r4-eval-" + arm + "-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.LaneInit(fs);
  const A = TASKS.assocR;
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-r4-" + arm + "-s" + seed + ".json"));
  if (tr.verdict !== "COMPLETE") throw new Error("r4 train missing " + arm + " s" + seed);
  const model = r3Restore(T, G, tr);
  const fwF = (x) => Array.from(model.forward(x, 1).logits);
  const frng = G.makeRng(52400 + seed), srng = G.makeRng(52500 + seed);
  const fwdT = []; for (let i = 0; i < 200; i++) fwdT.push(A.gen(frng, 1 + frng.int(3)));
  const shT = []; for (let i = 0; i < 200; i++) shT.push(composeGenShiftScr(srng));
  let fF = 0;
  for (const e of fwdT) if (scratchArgmax(fwF(e.x)) === e.y) fF++;
  let scr = 0, one = 0, two = 0, orc = 0;
  for (const e of shT) {
    const fw1 = model.forward(e.x, 1);
    const vhat = scratchArgmax(Array.from(fw1.cache.posOut[8].logits));
    if (vhat === e.v) scr++;
    if (scratchArgmax(Array.from(fw1.logits)) === e.y) one++;
    const x2 = e.flat.concat([e.qk, e.k, vhat, 8]);
    if (scratchArgmax(fwF(x2)) === e.y) two++;
    const xo = e.flat.concat([e.qk, e.k, e.v, 8]);
    if (scratchArgmax(fwF(xo)) === e.y) orc++;
  }
  const body = { spec: "r4-v10", arm, verdict: "COMPLETE", seed, n: 200,
    accFwd: +(fF / fwdT.length).toFixed(4), accScratch: +(scr / shT.length).toFixed(4),
    accOne: +(one / shT.length).toFixed(4), accTwo: +(two / shT.length).toFixed(4), accOracle: +(orc / shT.length).toFixed(4) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("r4-eval " + arm + " s=" + seed + " " + JSON.stringify(body));
  return body;
};
globalThis.runR4Len = async function (fs, log, arm, seed) {
  const ledgerPath = "src/evidence/decomp/d-r4-eval-" + arm + "len-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T } = await globalThis.LaneInit(fs);
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-r4-" + arm + "-s" + seed + ".json"));
  if (tr.verdict !== "COMPLETE") throw new Error("r4 train missing " + arm + " s" + seed);
  const model = r3Restore(T, G, tr);
  const fwF = (x) => Array.from(model.forward(x, 1).logits);
  function twoPass(e) {
    const scrIdx = e.x.length - 2;
    const fw1 = model.forward(e.x, 1);
    const vhat = scratchArgmax(Array.from(fw1.cache.posOut[scrIdx].logits));
    const x2 = e.x.slice();
    x2[scrIdx] = vhat;
    return scratchArgmax(fwF(x2)) === e.y;
  }
  const r2 = G.makeRng(52800 + seed), r4 = G.makeRng(52900 + seed);
  const t2 = []; for (let i = 0; i < 200; i++) t2.push(composeGenShiftScr(r2, 2));
  const t4 = []; for (let i = 0; i < 200; i++) t4.push(composeGenShiftScr(r4, 4));
  const body = { spec: "r4-v10", arm, verdict: "COMPLETE", seed, n: 200,
    accTwo2: +(t2.filter(twoPass).length / t2.length).toFixed(4),
    accTwo4: +(t4.filter(twoPass).length / t4.length).toFixed(4) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("r4-len " + arm + " s=" + seed + " 2p=" + body.accTwo2 + " 4p=" + body.accTwo4);
  return body;
};
globalThis.runHarnessT7 = async function (fs, log, seed) {
  const ledgerPath = "src/evidence/decomp/d-r4-eval-t7-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T } = await globalThis.LaneInit(fs);
  const cb = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-batch2-cb-s" + seed + ".json"));
  const ad = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-r2-add4-s" + seed + ".json"));
  if (cb.verdict !== "COMPLETE") throw new Error("cb train missing s" + seed);
  if (ad.verdict !== "COMPLETE") throw new Error("add4 train missing s" + seed);
  const m1 = r3Restore(T, G, cb), m2 = r3Restore(T, G, ad);
  const a2 = (x) => { const l = Array.from(m2.forward(x, 1).logits); let b = 0; for (let i = 1; i < 4; i++) if (l[i] > l[b]) b = i; return b; };
  const srng = G.makeRng(52500 + seed);
  const shT = []; for (let i = 0; i < 200; i++) shT.push(composeGenShiftScr(srng));
  let vhits = 0, hits = 0, orc = 0;
  const byK = { k1: [0, 0], k2: [0, 0], k3: [0, 0] };
  for (const e of shT) {
    const fw1 = m1.forward(e.x, 1);
    const vhat = scratchArgmax(Array.from(fw1.cache.posOut[8].logits));
    if (vhat === e.v) vhits++;
    if (a2(e.flat.concat([e.qk, e.k, vhat, 8])) === e.y) { hits++; byK["k" + e.k][0]++; }
    byK["k" + e.k][1]++;
    if (a2(e.flat.concat([e.qk, e.k, e.v, 8])) === e.y) orc++;
  }
  const byKacc = {};
  for (let k = 1; k <= 3; k++) byKacc["k" + k] = +(byK["k" + k][0] / byK["k" + k][1]).toFixed(4);
  const accRet = vhits / shT.length, accOrc = orc / shT.length;
  const body = { spec: "r4-v10", arm: "t7", verdict: "COMPLETE", seed, n: 200,
    accRetrieve: +accRet.toFixed(4), accComposed: +(hits / shT.length).toFixed(4),
    accOracle: +accOrc.toFixed(4), product: +(accRet * accOrc).toFixed(4), byK: byKacc };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("harness-t7 s=" + seed + " ret=" + body.accRetrieve + " comp=" + body.accComposed + " orc=" + body.accOracle);
  return body;
};
globalThis.runADD4P = async function (fs, log, seed) {
  const ledgerPath = "src/evidence/decomp/d-r4-eval-add4p-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T } = await globalThis.LaneInit(fs);
  const ad = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-r2-add4-s" + seed + ".json"));
  if (ad.verdict !== "COMPLETE") throw new Error("add4 train missing s" + seed);
  const m = r3Restore(T, G, ad);
  const srng = G.makeRng(52500 + seed);
  const perK = { 1: [0, 0], 2: [0, 0], 3: [0, 0] };
  const conf = {};
  let offByOne = 0, wrong = 0;
  for (let i = 0; i < 200; i++) {
    const e = composeGenShiftScr(srng);
    const x = e.flat.concat([e.qk, e.k, e.v, 8]);
    const l = Array.from(m.forward(x, 1).logits);
    let b = 0; for (let j = 1; j < 4; j++) if (l[j] > l[b]) b = j;
    perK[e.k][1]++;
    if (b === e.y) perK[e.k][0]++;
    else {
      wrong++;
      const key = e.y + "->" + b;
      conf[key] = (conf[key] || 0) + 1;
      if (Math.abs(b - e.y) === 1) offByOne++;
    }
  }
  const acc = {};
  for (let k = 1; k <= 3; k++) acc["k" + k] = +(perK[k][0] / perK[k][1]).toFixed(4);
  const body = { spec: "r4-v10", arm: "add4p", verdict: "COMPLETE", seed, n: 200,
    perK: acc, offByOneShare: wrong > 0 ? +(offByOne / wrong).toFixed(4) : null, confusion: conf };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("add4p s=" + seed + " " + JSON.stringify(acc) + " obo=" + body.offByOneShare);
  return body;
};
function r5SpotLabels(A, x) {
  if (x.length === 10 && x[9] === 8 && x[8] === 0) {
    if (x[7] === 3) return scratchLabelsT(A, x);
    return new Array(x.length).fill(null);
  }
  return A.bindLabels(x);
}
globalThis.runK3AUXTrain = async function (fs, log, seed) {
  const arm = "k3aux";
  const ledgerPath = "src/evidence/decomp/d-r5-" + arm + "-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.LaneInit(fs);
  const A = TASKS.assocR;
  const trainSeed = 53200 + seed * 13;
  const drng = G.makeRng(52200 + seed), frng = G.makeRng(52300 + seed), sh = G.makeRng(52600 + seed);
  const a = [], b = [];
  for (let i = 0; i < 150; i++) { const e = composeGenShiftScr(drng); a.push({ x: e.x, y: e.y }); }
  for (let i = 0; i < 150; i++) b.push(A.gen(frng, 1 + frng.int(3)));
  const all = a.concat(b);
  for (let i = all.length - 1; i > 0; i--) { const j = sh.int(i + 1), t = all[i]; all[i] = all[j]; all[j] = t; }
  const t0 = Date.now();
  const out = await T.trainModel({ seed: trainSeed, arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4,
    train: all, steps: 800, batch: 16, lr: 5e-3, attnAux: true, attnAuxW: 1.0,
    prefixLabels: (x) => r5SpotLabels(A, x), auxW: 4.0 });
  const params = out.model.params().map((pl) => Array.from(pl.v !== undefined ? pl.v : pl));
  const body = { spec: "r5-v10", arm, verdict: "COMPLETE", seed, trainSeed, nTrain: all.length,
    steps: 800, batch: 16, lr: 5e-3, auxW: 4.0, diet: "uniform-clean spot-aux-k3", wallMs: Date.now() - t0,
    firstLoss: +out.firstLoss.toFixed(4), lastLoss: +out.lastLoss.toFixed(4), params };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("k3aux-train s=" + seed + " loss=" + body.firstLoss + "->" + body.lastLoss);
  return body;
};
globalThis.runR5Eval = async function (fs, log, arm, seed) {
  const ledgerPath = "src/evidence/decomp/d-r5-eval-" + arm + "-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.LaneInit(fs);
  const A = TASKS.assocR;
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-r5-" + arm + "-s" + seed + ".json"));
  if (tr.verdict !== "COMPLETE") throw new Error("r5 train missing " + arm + " s" + seed);
  const model = r3Restore(T, G, tr);
  const fwF = (x) => Array.from(model.forward(x, 1).logits);
  const frng = G.makeRng(52400 + seed), srng = G.makeRng(52500 + seed);
  const fwdT = []; for (let i = 0; i < 200; i++) fwdT.push(A.gen(frng, 1 + frng.int(3)));
  const shT = []; for (let i = 0; i < 200; i++) shT.push(composeGenShiftScr(srng));
  let fF = 0;
  for (const e of fwdT) if (scratchArgmax(fwF(e.x)) === e.y) fF++;
  let scr = 0, one = 0, two = 0, orc = 0;
  for (const e of shT) {
    const fw1 = model.forward(e.x, 1);
    const vhat = scratchArgmax(Array.from(fw1.cache.posOut[8].logits));
    if (vhat === e.v) scr++;
    if (scratchArgmax(Array.from(fw1.logits)) === e.y) one++;
    const x2 = e.flat.concat([e.qk, e.k, vhat, 8]);
    if (scratchArgmax(fwF(x2)) === e.y) two++;
    const xo = e.flat.concat([e.qk, e.k, e.v, 8]);
    if (scratchArgmax(fwF(xo)) === e.y) orc++;
  }
  const body = { spec: "r5-v10", arm, verdict: "COMPLETE", seed, n: 200,
    accFwd: +(fF / fwdT.length).toFixed(4), accScratch: +(scr / shT.length).toFixed(4),
    accOne: +(one / shT.length).toFixed(4), accTwo: +(two / shT.length).toFixed(4), accOracle: +(orc / shT.length).toFixed(4) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("r5-eval " + arm + " s=" + seed + " " + JSON.stringify(body));
  return body;
};
globalThis.runR5Len = async function (fs, log, arm, seed) {
  const ledgerPath = "src/evidence/decomp/d-r5-eval-" + arm + "len-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T } = await globalThis.LaneInit(fs);
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-r5-" + arm + "-s" + seed + ".json"));
  if (tr.verdict !== "COMPLETE") throw new Error("r5 train missing " + arm + " s" + seed);
  const model = r3Restore(T, G, tr);
  const fwF = (x) => Array.from(model.forward(x, 1).logits);
  function twoPass(e) {
    const scrIdx = e.x.length - 2;
    const fw1 = model.forward(e.x, 1);
    const vhat = scratchArgmax(Array.from(fw1.cache.posOut[scrIdx].logits));
    const x2 = e.x.slice();
    x2[scrIdx] = vhat;
    return scratchArgmax(fwF(x2)) === e.y;
  }
  const r2 = G.makeRng(52800 + seed), r4 = G.makeRng(52900 + seed);
  const t2 = []; for (let i = 0; i < 200; i++) t2.push(composeGenShiftScr(r2, 2));
  const t4 = []; for (let i = 0; i < 200; i++) t4.push(composeGenShiftScr(r4, 4));
  const body = { spec: "r5-v10", arm, verdict: "COMPLETE", seed, n: 200,
    accTwo2: +(t2.filter(twoPass).length / t2.length).toFixed(4),
    accTwo4: +(t4.filter(twoPass).length / t4.length).toFixed(4) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("r5-len " + arm + " s=" + seed + " 2p=" + body.accTwo2 + " 4p=" + body.accTwo4);
  return body;
};
globalThis.runR5Perk = async function (fs, log, arm, seed) {
  const ledgerPath = "src/evidence/decomp/d-r5-eval-" + arm + "perk-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T } = await globalThis.LaneInit(fs);
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-r5-" + arm + "-s" + seed + ".json"));
  if (tr.verdict !== "COMPLETE") throw new Error("r5 train missing " + arm + " s" + seed);
  const model = r3Restore(T, G, tr);
  const srng = G.makeRng(52500 + seed);
  const perK = { 1: [0, 0], 2: [0, 0], 3: [0, 0] };
  for (let i = 0; i < 200; i++) {
    const e = composeGenShiftScr(srng);
    const x = e.flat.concat([e.qk, e.k, e.v, 8]);
    const l = Array.from(model.forward(x, 1).logits);
    let b = 0; for (let j = 1; j < 4; j++) if (l[j] > l[b]) b = j;
    perK[e.k][1]++;
    if (b === e.y) perK[e.k][0]++;
  }
  const acc = {};
  for (let k = 1; k <= 3; k++) acc["k" + k] = +(perK[k][0] / perK[k][1]).toFixed(4);
  const body = { spec: "r5-v10", arm, verdict: "COMPLETE", seed, n: 200, perK: acc };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("r5-perk " + arm + " s=" + seed + " " + JSON.stringify(acc));
  return body;
};
globalThis.runHarnessT8 = async function (fs, log, seed) {
  const ledgerPath = "src/evidence/decomp/d-r5-eval-t8-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T } = await globalThis.LaneInit(fs);
  const ka = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-r5-k3aux-s" + seed + ".json"));
  const ad = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-r2-add4-s" + seed + ".json"));
  if (ka.verdict !== "COMPLETE") throw new Error("k3aux train missing s" + seed);
  if (ad.verdict !== "COMPLETE") throw new Error("add4 train missing s" + seed);
  const m1 = r3Restore(T, G, ka), m2 = r3Restore(T, G, ad);
  const a2 = (x) => { const l = Array.from(m2.forward(x, 1).logits); let b = 0; for (let i = 1; i < 4; i++) if (l[i] > l[b]) b = i; return b; };
  const srng = G.makeRng(52500 + seed);
  const shT = []; for (let i = 0; i < 200; i++) shT.push(composeGenShiftScr(srng));
  let vhits = 0, hits = 0, orc = 0;
  const byK = { k1: [0, 0], k2: [0, 0], k3: [0, 0] };
  for (const e of shT) {
    const fw1 = m1.forward(e.x, 1);
    const vhat = scratchArgmax(Array.from(fw1.cache.posOut[8].logits));
    if (vhat === e.v) vhits++;
    if (a2(e.flat.concat([e.qk, e.k, vhat, 8])) === e.y) { hits++; byK["k" + e.k][0]++; }
    byK["k" + e.k][1]++;
    if (a2(e.flat.concat([e.qk, e.k, e.v, 8])) === e.y) orc++;
  }
  const byKacc = {};
  for (let k = 1; k <= 3; k++) byKacc["k" + k] = +(byK["k" + k][0] / byK["k" + k][1]).toFixed(4);
  const accRet = vhits / shT.length, accOrc = orc / shT.length;
  const body = { spec: "r5-v10", arm: "t8", verdict: "COMPLETE", seed, n: 200,
    accRetrieve: +accRet.toFixed(4), accComposed: +(hits / shT.length).toFixed(4),
    accOracle: +accOrc.toFixed(4), product: +(accRet * accOrc).toFixed(4), byK: byKacc };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("harness-t8 s=" + seed + " ret=" + body.accRetrieve + " comp=" + body.accComposed + " orc=" + body.accOracle);
  return body;
};
globalThis.runFQ2 = async function (fs, log, seed) {
  const ledgerPath = "src/evidence/decomp/d-r5-eval-fq2-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T } = await globalThis.LaneInit(fs);
  const ad = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-r2-add4-s" + seed + ".json"));
  if (ad.verdict !== "COMPLETE") throw new Error("add4 train missing s" + seed);
  const m = r3Restore(T, G, ad);
  const srng = G.makeRng(52500 + seed);
  const flT = []; for (let i = 0; i < 200; i++) { const e = composeGenShiftScr(srng); flT.push({ x: e.flat.concat([e.qk, 8]), y: e.v }); }
  let hits = 0;
  for (const e of flT) { const l = Array.from(m.forward(e.x, 1).logits); let b = 0; for (let i = 1; i < 4; i++) if (l[i] > l[b]) b = i; if (b === e.y) hits++; }
  const body = { spec: "r5-v10", arm: "fq2", verdict: "COMPLETE", seed, n: 200, accFlats: +(hits / flT.length).toFixed(4) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("fq2 s=" + seed + " flats=" + body.accFlats);
  return body;
};
globalThis.runOFF1Diag = async function (fs, log, seed) {
  const ledgerPath = "src/evidence/decomp/d-off1-diag-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T } = await globalThis.LaneInit(fs);
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-r2-add4-s" + seed + ".json"));
  if (tr.verdict !== "COMPLETE") throw new Error("add4 train missing s" + seed);
  const m = T.makeModel(G.makeRng(tr.trainSeed), { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 });
  { const ps = m.params();
    for (let i = 0; i < ps.length; i++) {
      const dst = ps[i].v !== undefined ? ps[i].v : ps[i];
      const src = tr.params[i];
      for (let j = 0; j < dst.length; j++) dst[j] = src[j];
    } }
  const srng = G.makeRng(52500 + seed);
  const hist = { "-2": 0, "-1": 0, "0": 0, "+1": 0, "+2": 0, other: 0 };
  const predMarg = [0, 0, 0, 0], trueMarg = [0, 0, 0, 0];
  const perK = { 1: [0, 0, 0], 2: [0, 0, 0], 3: [0, 0, 0] };
  let inWrong = 0, inOver = 0, edgeN = 0, edgeWrong = 0;
  const margOK = [], margOBO = [], margOther = [];
  for (let i = 0; i < 200; i++) {
    const e = composeGenShiftScr(srng);
    const l = Array.from(m.forward(e.flat.concat([e.qk, e.k, e.v, 8]), 1).logits);
    let b = 0, s2 = -1e30;
    for (let j = 0; j < 4; j++) { if (l[j] > l[b]) { s2 = l[b]; b = j; } else if (l[j] > s2) s2 = l[j]; }
    const margin = l[b] - s2, err = b - e.y;
    trueMarg[e.y]++; predMarg[b]++;
    if (perK[e.k]) { perK[e.k][2]++; if (b === e.y) perK[e.k][0]++; else if (Math.abs(err) === 1) perK[e.k][1]++; }
    const key = err === 0 ? "0" : (err === 1 ? "+1" : (err === -1 ? "-1" : (err === 2 ? "+2" : (err === -2 ? "-2" : "other"))));
    hist[key]++;
    if (err === 0) margOK.push(margin);
    else if (Math.abs(err) === 1) margOBO.push(margin);
    else margOther.push(margin);
    if (e.y === 1 || e.y === 2) { if (err !== 0) { inWrong++; if (err > 0) inOver++; } }
    else { edgeN++; if (err !== 0) edgeWrong++; }
  }
  const med = (a) => { if (!a.length) return null; const s = a.slice().sort((x, y) => x - y); return +s[Math.floor(s.length / 2)].toFixed(4); };
  const auc = (pos, neg) => {
    if (!pos.length || !neg.length) return null;
    let w = 0; for (const p of pos) for (const n of neg) { if (p > n) w++; else if (p === n) w += 0.5; }
    return +(w / (pos.length * neg.length)).toFixed(4);
  };
  const wrong = 200 - hist["0"], obo = hist["+1"] + hist["-1"];
  const medOK = med(margOK);
  const lowShare = margOBO.length && medOK !== null ? +(margOBO.filter((x) => x < medOK).length / margOBO.length).toFixed(4) : null;
  const body = { spec: "off1-v10.1", arm: "off1diag", verdict: "COMPLETE", seed, n: 200,
    errHist: hist, oboShare: wrong > 0 ? +(obo / wrong).toFixed(4) : null,
    interior: { nWrong: inWrong, overshoot: inOver, bias: inWrong > 0 ? +(inOver / inWrong).toFixed(4) : null },
    edge: { n: edgeN, wrong: edgeWrong, rate: edgeN > 0 ? +(edgeWrong / edgeN).toFixed(4) : null },
    interiorRate: (200 - edgeN) > 0 ? +((inWrong) / (200 - edgeN)).toFixed(4) : null,
    predMarginal: predMarg, trueMarginal: trueMarg,
    perK: { k1: perK[1][2] ? { acc: +(perK[1][0] / perK[1][2]).toFixed(4), obo: (perK[1][2] - perK[1][0]) ? +(perK[1][1] / (perK[1][2] - perK[1][0])).toFixed(4) : null } : null,
           k2: perK[2][2] ? { acc: +(perK[2][0] / perK[2][2]).toFixed(4), obo: (perK[2][2] - perK[2][0]) ? +(perK[2][1] / (perK[2][2] - perK[2][0])).toFixed(4) : null } : null,
           k3: perK[3][2] ? { acc: +(perK[3][0] / perK[3][2]).toFixed(4), obo: (perK[3][2] - perK[3][0]) ? +(perK[3][1] / (perK[3][2] - perK[3][0])).toFixed(4) : null } : null },
    margins: { medCorrect: medOK, medOBO: med(margOBO), medOther: med(margOther), lowMarginShare: lowShare },
    marginAUC: auc(margOK, margOBO) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("off1 s=" + seed + " oboShare=" + body.oboShare + " inBias=" + body.interior.bias + " auc=" + body.marginAUC);
  return body;
};
function o2FiledDiet(G, TASKS, seed) {
  const A = TASKS.assocR;
  const drng = G.makeRng(52200 + seed), frng = G.makeRng(52300 + seed), sh = G.makeRng(52600 + seed);
  const a = [], b = [];
  for (let i = 0; i < 150; i++) {
    const e = composeGenShiftScr(drng);
    if (((e.v + e.k) % 4 + 4) % 4 !== e.y) throw new Error("add semantics broken");
    a.push({ x: e.flat.concat([e.qk, e.k, e.v, 8]), y: e.y });
  }
  for (let i = 0; i < 150; i++) b.push(A.gen(frng, 1 + frng.int(3)));
  const all = a.concat(b);
  for (let i = all.length - 1; i > 0; i--) { const j = sh.int(i + 1), t = all[i]; all[i] = all[j]; all[j] = t; }
  return { A, all };
}
function o2Restore(T, G, o) {
  const m = T.makeModel(G.makeRng(o.trainSeed), { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 });
  const ps = m.params();
  for (let i = 0; i < ps.length; i++) {
    const dst = ps[i].v !== undefined ? ps[i].v : ps[i];
    const src = o.params[i];
    for (let j = 0; j < dst.length; j++) dst[j] = src[j];
  }
  return m;
}
function o2EvalBody(m, G, seed) {
  const srng = G.makeRng(52500 + seed), frng = G.makeRng(52400 + seed);
  const orc = []; for (let i = 0; i < 200; i++) { const e = composeGenShiftScr(srng); orc.push({ x: e.flat.concat([e.qk, e.k, e.v, 8]), y: e.y }); }
  const am = (x) => { const l = Array.from(m.forward(x, 1).logits); let b = 0; for (let j = 1; j < 4; j++) if (l[j] > l[b]) b = j; return b; };
  let hitsO = 0, obo = 0, wrong = 0; const preds = [];
  for (const e of orc) { const b = am(e.x); preds.push(b); if (b === e.y) hitsO++; else { wrong++; if (Math.abs(b - e.y) === 1) obo++; } }
  return { n: 200, accOracle: +(hitsO / 200).toFixed(4), oboShare: wrong > 0 ? +(obo / wrong).toFixed(4) : null, preds, am };
}
globalThis.runO2Mine = async function (fs, log, seed) {
  const ledgerPath = "src/evidence/decomp/d-o2a-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.LaneInit(fs);
  const stage1 = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-r2-add4-s" + seed + ".json"));
  if (stage1.verdict !== "COMPLETE") throw new Error("add4 missing s" + seed);
  const m1 = o2Restore(T, G, stage1);
  const hrng = G.makeRng(53700 + seed);
  const hard = [], pad = [];
  for (let i = 0; i < 300; i++) {
    const e = composeGenShiftScr(hrng);
    const x = e.flat.concat([e.qk, e.k, e.v, 8]);
    const l = Array.from(m1.forward(x, 1).logits);
    let b = 0; for (let j = 1; j < 4; j++) if (l[j] > l[b]) b = j;
    if (b !== e.y) { if (hard.length < 100) hard.push({ x, y: e.y }); }
    else pad.push({ x, y: e.y });
  }
  while (hard.length < 100) hard.push(pad.pop());
  const { A, all } = o2FiledDiet(G, TASKS, seed);
  const diet = all.slice();
  for (let i = 0; i < 100; i++) diet[i] = hard[i];
  const t0 = Date.now();
  const out = await T.trainModel({ seed: 54200 + seed, arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4,
    train: diet, steps: 800, batch: 16, lr: 5e-3, attnAux: true, attnAuxW: 1.0,
    prefixLabels: (x) => scratchLabelsT(A, x), auxW: 4.0 });
  const m2 = out.model;
  const ev = o2EvalBody(m2, G, seed);
  const fwdT = []; const frng = G.makeRng(52400 + seed);
  for (let i = 0; i < 200; i++) fwdT.push(A.gen(frng, 1 + frng.int(3)));
  let hF = 0; for (const e of fwdT) if (ev.am(e.x) === e.y) hF++;
  const params = out.model.params().map((pl) => Array.from(pl.v !== undefined ? pl.v : pl));
  const body = { spec: "o2-v10.1", arm: "errmine", verdict: "COMPLETE", seed, trainSeed: 54200 + seed,
    nHarvestWrong: hard.length, wallMs: Date.now() - t0,
    firstLoss: +out.firstLoss.toFixed(4), lastLoss: +out.lastLoss.toFixed(4),
    accOracle: ev.accOracle, oboShare: ev.oboShare, accFwd: +(hF / 200).toFixed(4), preds: ev.preds, params };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("o2a s=" + seed + " orc=" + body.accOracle + " obo=" + body.oboShare + " fwd=" + body.accFwd);
  return body;
};
globalThis.runO2Wrap = async function (fs, log, seed) {
  const ledgerPath = "src/evidence/decomp/d-o2b-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.LaneInit(fs);
  const A = TASKS.assocR;
  const frng = G.makeRng(52300 + seed), sh = G.makeRng(52600 + seed), wrng = G.makeRng(53800 + seed);
  const oracle = [];
  while (oracle.filter((e) => e.v + e.k >= 4).length < 113) {
    const e = composeGenShiftScr(wrng);
    if (((e.v + e.k) % 4 + 4) % 4 !== e.y) throw new Error("add semantics broken");
    if (e.v + e.k >= 4) oracle.push(e);
  }
  while (oracle.length < 150) {
    const e = composeGenShiftScr(wrng);
    oracle.push(e);
  }
  const wrapRate = oracle.filter((e) => e.v + e.k >= 4).length / 150;
  const fwd = []; for (let i = 0; i < 150; i++) fwd.push(A.gen(frng, 1 + frng.int(3)));
  const diet = oracle.map((e) => ({ x: e.flat.concat([e.qk, e.k, e.v, 8]), y: e.y })).concat(fwd);
  for (let i = diet.length - 1; i > 0; i--) { const j = sh.int(i + 1), t = diet[i]; diet[i] = diet[j]; diet[j] = t; }
  const t0 = Date.now();
  const out = await T.trainModel({ seed: 54300 + seed, arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4,
    train: diet, steps: 800, batch: 16, lr: 5e-3, attnAux: true, attnAuxW: 1.0,
    prefixLabels: (x) => scratchLabelsT(A, x), auxW: 4.0 });
  const ev = o2EvalBody(out.model, G, seed);
  const fwdT = []; const frng2 = G.makeRng(52400 + seed);
  for (let i = 0; i < 200; i++) fwdT.push(A.gen(frng2, 1 + frng2.int(3)));
  let hF = 0; for (const e of fwdT) if (ev.am(e.x) === e.y) hF++;
  const params = out.model.params().map((pl) => Array.from(pl.v !== undefined ? pl.v : pl));
  const body = { spec: "o2-v10.1", arm: "wrapdose", verdict: "COMPLETE", seed, trainSeed: 54300 + seed,
    wrapRate: +wrapRate.toFixed(4), wallMs: Date.now() - t0, firstLoss: +out.firstLoss.toFixed(4), lastLoss: +out.lastLoss.toFixed(4),
    accOracle: ev.accOracle, oboShare: ev.oboShare, accFwd: +(hF / 200).toFixed(4), preds: ev.preds, params };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("o2b s=" + seed + " orc=" + body.accOracle + " obo=" + body.oboShare + " fwd=" + body.accFwd);
  return body;
};
globalThis.runO2Base = async function (fs, log, seed) {
  const ledgerPath = "src/evidence/decomp/d-o2base-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T } = await globalThis.LaneInit(fs);
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-r2-add4-s" + seed + ".json"));
  const ev = o2EvalBody(o2Restore(T, G, tr), G, seed);
  const body = { spec: "o2-v10.1", arm: "add4base-preds", verdict: "COMPLETE", seed,
    accOracle: ev.accOracle, oboShare: ev.oboShare, preds: ev.preds };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("o2base s=" + seed + " orc=" + body.accOracle + " obo=" + body.oboShare);
  return body;
};
globalThis.runO3Harness = async function (fs, log, seed) {
  const ledgerPath = "src/evidence/decomp/d-o3-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T } = await globalThis.LaneInit(fs);
  const cb = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-batch2-cb-s" + seed + ".json"));
  const ad = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-o2a-s" + seed + ".json"));
  if (cb.verdict !== "COMPLETE") throw new Error("cb train missing s" + seed);
  if (ad.verdict !== "COMPLETE") throw new Error("o2a train missing s" + seed);
  const m1 = o2Restore(T, G, cb), m2 = o2Restore(T, G, ad);
  const a2 = (x) => { const l = Array.from(m2.forward(x, 1).logits); let b = 0; for (let i = 1; i < 4; i++) if (l[i] > l[b]) b = i; return b; };
  const srng = G.makeRng(52500 + seed);
  const shT = []; for (let i = 0; i < 200; i++) shT.push(composeGenShiftScr(srng));
  let vhits = 0, hits = 0, orc = 0;
  const byK = { k1: [0, 0], k2: [0, 0], k3: [0, 0] };
  for (const e of shT) {
    const fw1 = m1.forward(e.x, 1);
    const vhat = scratchArgmax(Array.from(fw1.cache.posOut[8].logits));
    if (vhat === e.v) vhits++;
    if (a2(e.flat.concat([e.qk, e.k, vhat, 8])) === e.y) { hits++; byK["k" + e.k][0]++; }
    byK["k" + e.k][1]++;
    if (a2(e.flat.concat([e.qk, e.k, e.v, 8])) === e.y) orc++;
  }
  const byKacc = {};
  for (let k = 1; k <= 3; k++) byKacc["k" + k] = +(byK["k" + k][0] / byK["k" + k][1]).toFixed(4);
  const accRet = vhits / shT.length, accOrc = orc / shT.length;
  const body = { spec: "o3-v10.1", arm: "o3", verdict: "COMPLETE", seed, n: 200,
    accRetrieve: +accRet.toFixed(4), accComposed: +(hits / shT.length).toFixed(4),
    accOracle: +accOrc.toFixed(4), product: +(accRet * accOrc).toFixed(4), byK: byKacc };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("o3 s=" + seed + " ret=" + body.accRetrieve + " comp=" + body.accComposed + " orc=" + body.accOracle);
  return body;
};
globalThis.runO5aMine = async function (fs, log, seed) {
  const ledgerPath = "src/evidence/decomp/d-o5a-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.LaneInit(fs);
  const A = TASKS.assocR;
  const cb = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-batch2-cb-s" + seed + ".json"));
  if (cb.verdict !== "COMPLETE") throw new Error("cb missing s" + seed);
  const m1 = o2Restore(T, G, cb);
  const hrng = G.makeRng(54400 + seed), trng = G.makeRng(55400 + seed);
  const hardD = [], padD = [], hardT = [], padT = [];
  for (let i = 0; i < 300; i++) {
    const e = composeGenShiftScr(hrng);
    if (o4Vhat(m1, e.x) !== e.v) { if (hardD.length < 60) hardD.push({ x: e.x, y: e.y }); }
    else padD.push({ x: e.x, y: e.y });
  }
  for (let i = 0; i < 300; i++) {
    const e = composeGenShiftScr(trng);
    const x = e.flat.concat([e.qk, e.k, e.v, 8]);
    if (o4Vhat(m1, x) !== e.v) { if (hardT.length < 40) hardT.push({ x: x, y: e.y }); }
    else padT.push({ x: x, y: e.y });
  }
  while (hardD.length < 60) hardD.push(padD.pop());
  while (hardT.length < 40) hardT.push(padT.pop());
  const drng = G.makeRng(52200 + seed), frng = G.makeRng(52300 + seed), sh = G.makeRng(52600 + seed), crng = G.makeRng(53500 + seed);
  const dum = [], tru = [], fwd = [];
  for (let i = 0; i < 150; i++) {
    const e = composeGenShiftScr(drng);
    if (crng.int(2) === 0) tru.push({ x: e.flat.concat([e.qk, e.k, e.v, 8]), y: e.y });
    else dum.push({ x: e.x, y: e.y });
  }
  for (let i = 0; i < 150; i++) fwd.push(A.gen(frng, 1 + frng.int(3)));
  for (let i = 0; i < 60 && i < dum.length; i++) dum[i] = hardD[i];
  for (let i = 0; i < 40 && i < tru.length; i++) tru[i] = hardT[i];
  const diet = dum.concat(tru).concat(fwd);
  for (let i = diet.length - 1; i > 0; i--) { const j = sh.int(i + 1), t = diet[i]; diet[i] = diet[j]; diet[j] = t; }
  const t0 = Date.now();
  const out = await T.trainModel({ seed: 55500 + seed, arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4,
    train: diet, steps: 800, batch: 16, lr: 5e-3, attnAux: true, attnAuxW: 1.0,
    prefixLabels: (x) => scratchLabelsT(A, x), auxW: 4.0 });
  const m2 = out.model;
  const ad = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-o2a-s" + seed + ".json"));
  const mA = o2Restore(T, G, ad);
  const a2 = (x) => { const l = Array.from(mA.forward(x, 1).logits); let b = 0; for (let i = 1; i < 4; i++) if (l[i] > l[b]) b = i; return b; };
  const srng = G.makeRng(52500 + seed);
  const shT = []; for (let i = 0; i < 200; i++) shT.push(composeGenShiftScr(srng));
  let vh = 0, hits = 0;
  for (const e of shT) {
    const vhat = o4Vhat(m2, e.x);
    if (vhat === e.v) vh++;
    if (a2(e.flat.concat([e.qk, e.k, vhat, 8])) === e.y) hits++;
  }
  const fr2 = G.makeRng(52400 + seed);
  const fwdT = []; for (let i = 0; i < 200; i++) fwdT.push(A.gen(fr2, 1 + fr2.int(3)));
  const amF = (x) => { const l = Array.from(m2.forward(x, 1).logits); let b = 0; for (let i = 1; i < 4; i++) if (l[i] > l[b]) b = i; return b; };
  let hF = 0; for (const e of fwdT) if (amF(e.x) === e.y) hF++;
  const params = out.model.params().map((pl) => Array.from(pl.v !== undefined ? pl.v : pl));
  const body = { spec: "o5a-v10.1", arm: "retmine-prop", verdict: "COMPLETE", seed, trainSeed: 55500 + seed,
    nHarvestD: hardD.length, nHarvestT: hardT.length,
    nDum: dum.length, nTru: tru.length, wallMs: Date.now() - t0,
    firstLoss: +out.firstLoss.toFixed(4), lastLoss: +out.lastLoss.toFixed(4),
    accRetrieve: +(vh / 200).toFixed(4), accComposed: +(hits / 200).toFixed(4), accFwd: +(hF / 200).toFixed(4), params };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("o5a s=" + seed + " ret=" + body.accRetrieve + " comp=" + body.accComposed + " fwd=" + body.accFwd + " hD/T=" + hardD.length + "/" + hardT.length);
  return body;
};
globalThis.runO5bTrain = async function (fs, log, seed) {
  const ledgerPath = "src/evidence/decomp/d-o5b-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.LaneInit(fs);
  const A = TASKS.assocR;
  const drng = G.makeRng(52200 + seed), frng = G.makeRng(52300 + seed), sh = G.makeRng(52600 + seed);
  const a = [];
  for (let i = 0; i < 100; i++) { const e = composeGenShiftScr(drng); a.push({ x: e.flat.concat([e.qk, e.k, e.v, 8]), y: e.y }); }
  for (let i = 0; i < 100; i++) { const e = composeGenShiftScr(drng); a.push({ x: [e.qk, e.k, e.v, 8].concat(e.flat), y: e.y }); }
  for (let i = 0; i < 100; i++) a.push(A.gen(frng, 1 + frng.int(3)));
  for (let i = a.length - 1; i > 0; i--) { const j = sh.int(i + 1), t = a[i]; a[i] = a[j]; a[j] = t; }
  const t0 = Date.now();
  const out = await T.trainModel({ seed: 55600 + seed, arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4,
    train: a, steps: 800, batch: 16, lr: 5e-3, attnAux: true, attnAuxW: 1.0,
    prefixLabels: (x) => scratchLabelsT(A, x), auxW: 4.0 });
  const params = out.model.params().map((pl) => Array.from(pl.v !== undefined ? pl.v : pl));
  const body = { spec: "o5b-v10.1", arm: "jit", verdict: "COMPLETE", seed, trainSeed: 55600 + seed,
    diet: "100 suffix + 100 prefix + 100 fwd", wallMs: Date.now() - t0,
    firstLoss: +out.firstLoss.toFixed(4), lastLoss: +out.lastLoss.toFixed(4), params };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("o5b-train s=" + seed + " loss=" + body.firstLoss + "->" + body.lastLoss);
  return body;
};
globalThis.runO5bEval = async function (fs, log, seed) {
  const ledgerPath = "src/evidence/decomp/d-o5b-eval-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T } = await globalThis.LaneInit(fs);
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-o5b-s" + seed + ".json"));
  if (tr.verdict !== "COMPLETE") throw new Error("o5b train missing s" + seed);
  const m = o2Restore(T, G, tr);
  const am = (x) => { const l = Array.from(m.forward(x, 1).logits); let b = 0; for (let i = 1; i < 4; i++) if (l[i] > l[b]) b = i; return b; };
  const srng = G.makeRng(52500 + seed), prng = G.makeRng(54700 + seed);
  let hS = 0, hP = 0;
  for (let i = 0; i < 200; i++) {
    const e = composeGenShiftScr(srng);
    if (am(e.flat.concat([e.qk, e.k, e.v, 8])) === e.y) hS++;
  }
  for (let i = 0; i < 200; i++) {
    const e = composeGenShiftScr(prng);
    if (am([e.qk, e.k, e.v, 8].concat(e.flat)) === e.y) hP++;
  }
  const body = { spec: "o5b-v10.1", arm: "jiteval", verdict: "COMPLETE", seed, n: 200,
    accSuffix: +(hS / 200).toFixed(4), accPrefix: +(hP / 200).toFixed(4) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("o5b-eval s=" + seed + " suf=" + body.accSuffix + " pre=" + body.accPrefix);
  return body;
};
globalThis.runO6Sweep = async function (fs, log, seed) {
  const ledgerPath = "src/evidence/decomp/d-o6-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T } = await globalThis.LaneInit(fs);
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-sp1-s" + seed + ".json"));
  if (tr.verdict !== "COMPLETE") throw new Error("sp1 train missing s" + seed);
  const m = o2Restore(T, G, tr);
  const srng = G.makeRng(52500 + seed);
  const shT = []; for (let i = 0; i < 200; i++) shT.push(composeGenShiftScr(srng));
  const perR = [];
  for (const r of [1, 2, 4, 8]) {
    let hits = 0;
    const dec = [];
    for (let p = 0; p <= 9; p++) dec.push([0, 0]);
    for (const e of shT) {
      const fw = m.forward(e.x, r);
      const l = Array.from(fw.logits);
      let b = 0; for (let j = 1; j < 4; j++) if (l[j] > l[b]) b = j;
      if (b === e.y) hits++;
      for (let p = 0; p <= 9; p++) {
        let pl = null;
        try { pl = fw.cache.posOut[p].logits; } catch (err) { pl = null; }
        if (!pl || pl.length < 4) continue;
        const a = Array.from(pl);
        let bb = 0; for (let j = 1; j < a.length; j++) if (a[j] > a[bb]) bb = j;
        dec[p][1]++;
        if (bb === e.v) dec[p][0]++;
      }
    }
    let best = 0, bestD = -1;
    for (let p = 0; p <= 9; p++) {
      if (dec[p][1] === 0) continue;
      const d = dec[p][0] / dec[p][1];
      if (d > bestD) { bestD = d; best = p; }
    }
    perR.push({ r: r, composed: +(hits / 200).toFixed(4), bestPos: best, bestDecode: +bestD.toFixed(4) });
  }
  const body = { spec: "o6-v10.1", verdict: "COMPLETE", seed, n: 200, perR: perR };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("o6 s=" + seed + " " + perR.map((o) => "r" + o.r + "=" + o.composed + "/d" + o.bestDecode).join(" "));
  return body;
};
function o4CbDiet(G, TASKS, seed) {
  const A = TASKS.assocR;
  const drng = G.makeRng(52200 + seed), frng = G.makeRng(52300 + seed), sh = G.makeRng(52600 + seed), crng = G.makeRng(53500 + seed);
  const a = [], b = [];
  for (let i = 0; i < 150; i++) {
    const e = composeGenShiftScr(drng);
    const useTrue = crng.int(2) === 0;
    a.push({ x: useTrue ? e.flat.concat([e.qk, e.k, e.v, 8]) : e.x, y: e.y });
  }
  for (let i = 0; i < 150; i++) b.push(A.gen(frng, 1 + frng.int(3)));
  const all = a.concat(b);
  for (let i = all.length - 1; i > 0; i--) { const j = sh.int(i + 1), t = all[i]; all[i] = all[j]; all[j] = t; }
  return { A, all };
}
function o4Vhat(m, x) {
  const fw = m.forward(x, 1);
  return scratchArgmax(Array.from(fw.cache.posOut[8].logits));
}
globalThis.runO4Perturb = async function (fs, log, seed) {
  const ledgerPath = "src/evidence/decomp/d-o4a-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T } = await globalThis.LaneInit(fs);
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-o2a-s" + seed + ".json"));
  if (tr.verdict !== "COMPLETE") throw new Error("o2a missing s" + seed);
  const m = o2Restore(T, G, tr);
  const am = (x) => { const l = Array.from(m.forward(x, 1).logits); let b = 0; for (let i = 1; i < 4; i++) if (l[i] > l[b]) b = i; return b; };
  const acc = (lines) => lines.filter((e) => am(e.x) === e.y).length / lines.length;
  const l2r = G.makeRng(54500 + seed), l4r = G.makeRng(54600 + seed);
  const len2 = [], len4 = [];
  for (let i = 0; i < 200; i++) { const e = composeGenShiftScr(l2r, 2); len2.push({ x: e.flat.concat([e.qk, e.k, e.v, 8]), y: e.y }); }
  for (let i = 0; i < 200; i++) { const e = composeGenShiftScr(l4r, 4); len4.push({ x: e.flat.concat([e.qk, e.k, e.v, 8]), y: e.y }); }
  const pqr = G.makeRng(54700 + seed);
  const preq = [];
  for (let i = 0; i < 200; i++) { const e = composeGenShiftScr(pqr); preq.push({ x: [e.qk, e.k, e.v, 8].concat(e.flat), y: e.y }); }
  const nrng = G.makeRng(54900 + seed);
  const noise = [];
  for (let i = 0; i < 200; i++) {
    const e = composeGenShiftScr(nrng);
    const others = [];
    for (let j = 0; j < 50 && others.length < e.flat.length / 2 - 1; j++) {
      const k = nrng.int(4), v = nrng.int(4);
      if (k !== e.qk) others.push([k, v + 4]);
    }
    const flat = [e.qk, e.v + 4].concat(others.slice(0, e.flat.length / 2 - 1).flat());
    noise.push({ x: flat.concat([e.qk, e.k, e.v, 8]), y: e.y });
  }
  const body = { spec: "o4a-v10.2", verdict: "COMPLETE", seed, n: 200,
    accLen2: +acc(len2).toFixed(4), accLen4: +acc(len4).toFixed(4),
    accPrefixQ: +acc(preq).toFixed(4), accNoise: +acc(noise).toFixed(4) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("o4a s=" + seed + " " + JSON.stringify(body));
  return body;
};
globalThis.runO4RetMine = async function (fs, log, seed) {
  const ledgerPath = "src/evidence/decomp/d-o4b-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.LaneInit(fs);
  const cb = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-batch2-cb-s" + seed + ".json"));
  if (cb.verdict !== "COMPLETE") throw new Error("cb missing s" + seed);
  const m1 = o2Restore(T, G, cb);
  const hrng = G.makeRng(54400 + seed);
  const hard = [], pad = [];
  for (let i = 0; i < 300; i++) {
    const e = composeGenShiftScr(hrng);
    if (o4Vhat(m1, e.x) !== e.v) { if (hard.length < 100) hard.push({ x: e.x, y: e.y }); }
    else pad.push({ x: e.x, y: e.y });
  }
  while (hard.length < 100) hard.push(pad.pop());
  const { A, all } = o4CbDiet(G, TASKS, seed);
  const diet = all.slice();
  for (let i = 0; i < 100; i++) diet[i] = hard[i];
  const t0 = Date.now();
  const out = await T.trainModel({ seed: 55000 + seed, arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4,
    train: diet, steps: 800, batch: 16, lr: 5e-3, attnAux: true, attnAuxW: 1.0,
    prefixLabels: (x) => scratchLabelsT(A, x), auxW: 4.0 });
  const m2 = out.model;
  const ad = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-o2a-s" + seed + ".json"));
  const mA = o2Restore(T, G, ad);
  const a2 = (x) => { const l = Array.from(mA.forward(x, 1).logits); let b = 0; for (let i = 1; i < 4; i++) if (l[i] > l[b]) b = i; return b; };
  const srng = G.makeRng(52500 + seed);
  const shT = []; for (let i = 0; i < 200; i++) shT.push(composeGenShiftScr(srng));
  let vh = 0, hits = 0, orc = 0;
  for (const e of shT) {
    const vhat = o4Vhat(m2, e.x);
    if (vhat === e.v) vh++;
    if (a2(e.flat.concat([e.qk, e.k, vhat, 8])) === e.y) hits++;
    if (a2(e.flat.concat([e.qk, e.k, e.v, 8])) === e.y) orc++;
  }
  const frng = G.makeRng(52400 + seed);
  const fwdT = []; for (let i = 0; i < 200; i++) fwdT.push(A.gen(frng, 1 + frng.int(3)));
  const amF = (x) => { const l = Array.from(m2.forward(x, 1).logits); let b = 0; for (let i = 1; i < 4; i++) if (l[i] > l[b]) b = i; return b; };
  let hF = 0; for (const e of fwdT) if (amF(e.x) === e.y) hF++;
  const params = out.model.params().map((pl) => Array.from(pl.v !== undefined ? pl.v : pl));
  const body = { spec: "o4b-v10.1", arm: "retmine", verdict: "COMPLETE", seed, trainSeed: 55000 + seed,
    nHarvest: hard.length, wallMs: Date.now() - t0,
    firstLoss: +out.firstLoss.toFixed(4), lastLoss: +out.lastLoss.toFixed(4),
    accRetrieve: +(vh / 200).toFixed(4), accComposed: +(hits / 200).toFixed(4),
    accAddOracle: +(orc / 200).toFixed(4), product: +((vh / 200) * (orc / 200)).toFixed(4),
    accFwd: +(hF / 200).toFixed(4), params };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("o4b s=" + seed + " ret=" + body.accRetrieve + " comp=" + body.accComposed + " fwd=" + body.accFwd + " nH=" + hard.length);
  return body;
};
globalThis.runO4Reseed = async function (fs, log) {
  const seed = 2;
  const ledgerPath = "src/evidence/decomp/d-o4b-reseed-s2.json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.LaneInit(fs);
  const { A, all } = o4CbDiet(G, TASKS, seed);
  const t0 = Date.now();
  const out = await T.trainModel({ seed: 55200, arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4,
    train: all, steps: 800, batch: 16, lr: 5e-3, attnAux: true, attnAuxW: 1.0,
    prefixLabels: (x) => scratchLabelsT(A, x), auxW: 4.0 });
  const m = out.model;
  const srng = G.makeRng(52500 + seed);
  let vh = 0;
  for (let i = 0; i < 200; i++) { const e = composeGenShiftScr(srng); if (o4Vhat(m, e.x) === e.v) vh++; }
  const params = out.model.params().map((pl) => Array.from(pl.v !== undefined ? pl.v : pl));
  const body = { spec: "o4b-v10.1", arm: "reseed-control", verdict: "COMPLETE", seed, trainSeed: 55200,
    wallMs: Date.now() - t0, accRetrieve: +(vh / 200).toFixed(4), params };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("o4b-reseed s2 ret=" + body.accRetrieve);
  return body;
};
globalThis.runSP1Train = async function (fs, log, seed) {
  const ledgerPath = "src/evidence/decomp/d-sp1-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.LaneInit(fs);
  const A = TASKS.assocR;
  const drng = G.makeRng(52200 + seed), frng = G.makeRng(52300 + seed), sh = G.makeRng(52600 + seed);
  const a = [], b = [];
  for (let i = 0; i < 150; i++) { const e = composeGenShiftScr(drng); a.push({ x: e.x, y: e.y }); }
  for (let i = 0; i < 150; i++) b.push(A.gen(frng, 1 + frng.int(3)));
  const all = a.concat(b);
  for (let i = all.length - 1; i > 0; i--) { const j = sh.int(i + 1), t = all[i]; all[i] = all[j]; all[j] = t; }
  const t0 = Date.now();
  const out = await T.trainModel({ seed: 55100 + seed, arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4,
    train: all, steps: 800, batch: 16, lr: 5e-3, attnAux: true, attnAuxW: 1.0,
    prefixLabels: (x) => scratchLabelsT(A, x), auxW: 4.0 });
  const params = out.model.params().map((pl) => Array.from(pl.v !== undefined ? pl.v : pl));
  const body = { spec: "sp1-v10.1", arm: "sp1", verdict: "COMPLETE", seed, trainSeed: 55100 + seed,
    diet: "dummy-only (no true-v lines)", wallMs: Date.now() - t0,
    firstLoss: +out.firstLoss.toFixed(4), lastLoss: +out.lastLoss.toFixed(4), params };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("sp1-train s=" + seed + " loss=" + body.firstLoss + "->" + body.lastLoss);
  return body;
};
globalThis.runSP1Eval = async function (fs, log, seed) {
  const ledgerPath = "src/evidence/decomp/d-sp1-eval-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T } = await globalThis.LaneInit(fs);
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-sp1-s" + seed + ".json"));
  if (tr.verdict !== "COMPLETE") throw new Error("sp1 train missing s" + seed);
  const m = o2Restore(T, G, tr);
  const srng = G.makeRng(52500 + seed);
  const shT = []; for (let i = 0; i < 200; i++) shT.push(composeGenShiftScr(srng));
  const am = (x) => { const l = Array.from(m.forward(x, 1).logits); let b = 0; for (let i = 1; i < 4; i++) if (l[i] > l[b]) b = i; return b; };
  let hits = 0;
  for (const e of shT) if (am(e.x) === e.y) hits++;
  const perPos = [];
  for (let p = 0; p <= 9; p++) {
    let ok = 0, tot = 0, ent = 0, nE = 0;
    for (const e of shT) {
      let l;
      try { l = Array.from(m.forward(e.x, 1).cache.posOut[p].logits); } catch (err) { continue; }
      if (l.length < 4) continue;
      tot++;
      let b = 0; for (let j = 1; j < l.length; j++) if (l[j] > l[b]) b = j;
      if (b === e.v) ok++;
      const mx = Math.max.apply(null, l);
      const ex = l.map((v) => Math.exp(v - mx));
      const s = ex.reduce((x, y) => x + y, 0);
      let h = 0; for (const v of ex) { const q = v / s; h -= q * Math.log(q + 1e-12); }
      ent += h; nE++;
    }
    perPos.push({ p: p, n: tot, decode: tot > 0 ? +(ok / tot).toFixed(4) : null, meanEntropy: nE > 0 ? +(ent / nE).toFixed(4) : null });
  }
  let best = perPos[0];
  for (const r of perPos) if (r.decode !== null && best.decode !== null && r.decode > best.decode) best = r;
  const body = { spec: "sp1-v10.1", arm: "sp1eval", verdict: "COMPLETE", seed, n: 200,
    accComposed: +(hits / 200).toFixed(4), perPos: perPos, bestPos: best.p, bestDecode: best.decode, bestEntropy: best.meanEntropy };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("sp1-eval s=" + seed + " comp=" + body.accComposed + " bestPos=" + best.p + " dec=" + best.decode + " ent=" + best.meanEntropy);
  return body;
};
