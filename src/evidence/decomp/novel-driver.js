// src/evidence/decomp/novel-driver.js — novel-type figuring-out (spec noveltype-v10).
// Own stack init. Finetune loop via G.Adam/G.softmaxCE (no attnAux: supervision
// assumes key-queries; filed choice). All forwards r=1 (evo.js precedent).
globalThis.NovelInit = async function (fs) {
  globalThis.window = globalThis;
  const ORDER = ["src/tinynn/nn.js", "src/tinynn/seeded.js", "src/tinynn/tasks.js", "src/tinynn/train.js"];
  for (const p of ORDER) { const src = await fs.readTextFile(p); (0, eval)(src + "\n//# sourceURL=" + p); }
  const G = globalThis.__tinyNN, T = globalThis.TinyNN;
  if (!G || !T || !T.trainModel || !G.Adam || !G.softmaxCE) throw new Error("novel stack load failed");
  return { G, T, TASKS: T.TASKS };
};

function argmaxOf(a) { let b = 0; for (let i = 1; i < a.length; i++) if (a[i] > a[b]) b = i; return b; }
function shuffleIn(rng, arr) {
  for (let i = arr.length - 1; i > 0; i--) { const j = rng.int(i + 1); const t = arr[i]; arr[i] = arr[j]; arr[j] = t; }
  return arr;
}
// B3: reverse lookup. pairs (k,v), query value 4+vj, answer kj.
function genReverse(rng, nPairs) {
  const keys = shuffleIn(rng, [0, 1, 2, 3]).slice(0, nPairs);
  const pairs = keys.map((k) => [k, 4 + rng.int(4)]);
  const j = rng.int(nPairs);
  const flat = [];
  for (const [k, v] of shuffleIn(rng, pairs.slice())) flat.push(k, v);
  return { flat, y: pairs[j][0], echo: pairs[j][1] - 4, x: flat.concat([pairs[j][1], 8]) };
}
// B2: query-first format. B1: long (5-pair, reuse task gen).
function genFlip(rng, A, nPairs) {
  const ex = A.gen(rng, nPairs);
  return { flat: ex.x.slice(0, ex.x.length - 2), y: ex.y, x: [ex.x[ex.x.length - 2], 8].concat(ex.x.slice(0, ex.x.length - 2)) };
}

globalThis.runNovelTutor = async function (fs, log, s) {
  const ledgerPath = "src/evidence/decomp/d-novel-tutor-s" + s + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log("d-novel-tutor-s" + s + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.NovelInit(fs);
  const A = TASKS.assocR;
  const rng = G.makeRng(14000 + s);
  const train = [];
  for (let i = 0; i < 500; i++) train.push(A.gen(rng, 1 + rng.int(3)));
  const t0 = Date.now();
  const out = await T.trainModel({ seed: 14100 + s, arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4,
    train, steps: 1200, batch: 16, lr: 5e-3, attnAux: true, attnAuxW: 1.0,
    prefixLabels: (x) => A.bindLabels(x), auxW: 1.0 });
  const wallMs = Date.now() - t0;
  const test = [];
  const trng = G.makeRng(14200 + s);
  for (let i = 0; i < 200; i++) test.push(A.gen(trng, 1 + trng.int(3)));
  const acc = T.evaluate(out.model, test, 1).acc;
  const params = out.model.params().map((p) => Array.from(p.v !== undefined ? p.v : p));
  const ledger = { spec: "noveltype-v10", seed: s, verdict: acc >= 0.60 ? "COMPLETE" : "ABORT",
    gate: acc >= 0.60 ? "PASS" : "FAIL", testAcc: +acc.toFixed(4), wallMs,
    arch: { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 }, trainSeed: 14100 + s, params };
  await fs.writeTextFile(ledgerPath, JSON.stringify(ledger));
  log("d-novel-tutor-s" + s + " acc=" + ledger.testAcc + " " + ledger.gate);
  return ledger;
};

function novelRestore(T, G, tut) {
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

globalThis.runNovelZero = async function (fs, log, s) {
  const ledgerPath = "src/evidence/decomp/d-novel-zero-s" + s + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log("d-novel-zero-s" + s + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.NovelInit(fs);
  const A = TASKS.assocR;
  const tut = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-novel-tutor-s" + s + ".json"));
  if (tut.verdict !== "COMPLETE") {
    const ab = { spec: "noveltype-v10", seed: s, verdict: "ABORT", reason: "tutor gated" };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab;
  }
  const model = novelRestore(T, G, tut);
  const fw = (x) => argmaxOf(Array.from(model.forward(x, 1).logits));
  const rng = G.makeRng(14300 + s);
  const batt = { b0: [], b1: [], b2: [], b3: [] };
  for (let i = 0; i < 200; i++) batt.b0.push(A.gen(rng, 1 + rng.int(3)));
  for (let i = 0; i < 200; i++) batt.b1.push(A.gen(rng, 5));
  for (let i = 0; i < 200; i++) batt.b2.push(genFlip(rng, A, 1 + rng.int(3)));
  for (let i = 0; i < 200; i++) batt.b3.push(genReverse(rng, 1 + rng.int(3)));
  const acc = (arr) => arr.filter((ex) => fw(ex.x) === ex.y).length / arr.length;
  const a0 = acc(batt.b0), a1 = acc(batt.b1), a2 = acc(batt.b2);
  let hit3 = 0, echo = 0;
  for (const L of batt.b3) {
    const o = fw(L.x);
    if (o === L.y) hit3++;
    if (o === L.echo) echo++;
  }
  const ledger = { spec: "noveltype-v10", seed: s, verdict: "COMPLETE", n: 200,
    acc: { b0: +a0.toFixed(4), b1: +a1.toFixed(4), b2: +a2.toFixed(4), b3: +(hit3 / 200).toFixed(4) },
    b3echoRate: +(echo / 200).toFixed(4), chance: 0.25 };
  await fs.writeTextFile(ledgerPath, JSON.stringify(ledger));
  log("d-novel-zero-s" + s + " " + JSON.stringify(ledger.acc) + " echo=" + ledger.b3echoRate);
  return ledger;
};

// Finetune from weights (tutor or scratch): 200 steps, batch 8, final + bindLabels aux.
function finetuneFrom(T, G, A, model, data, seed) {
  const rng = G.makeRng(seed);
  const opt = new G.Adam(5e-3);
  const B = 8;
  for (let step = 0; step < 200; step++) {
    model.zeroGrad();
    for (let b = 0; b < B; b++) {
      const ex = data[rng.int(data.length)];
      const fwd = model.forward(ex.x, 1);
      const ce = G.softmaxCE(fwd.logits, ex.y);
      const d = ce.dlogits;
      for (let i = 0; i < d.length; i++) d[i] /= B;
      let auxList = null;
      if (fwd.cache.posOut) {
        const labs = A.bindLabels(ex.x);
        auxList = new Array(ex.x.length);
        for (let t = 0; t < ex.x.length; t++) {
          if (labs[t] == null) { auxList[t] = null; continue; }
          const ceT = G.softmaxCE(fwd.cache.posOut[t].logits, labs[t]);
          const dt = ceT.dlogits;
          for (let i = 0; i < dt.length; i++) dt[i] /= (B * ex.x.length);
          auxList[t] = dt;
        }
      }
      model.backward(d, fwd, auxList, null, null);
    }
    opt.step(model.params());
  }
  return model;
}

globalThis.runNovelFew = async function (fs, log, s, K, arm) {
  const ledgerPath = "src/evidence/decomp/d-novel-few-K" + K + "-s" + s + "-" + arm + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.NovelInit(fs);
  const A = TASKS.assocR;
  const rng = G.makeRng(14400 + s * 10 + (K === 16 ? 0 : K === 64 ? 1 : 2));
  const worked = [];
  for (let i = 0; i < K; i++) worked.push(genReverse(rng, 1 + rng.int(3)));
  let model;
  if (arm === "tutor") {
    const tut = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-novel-tutor-s" + s + ".json"));
    model = novelRestore(T, G, tut);
  } else {
    model = T.makeModel(G.makeRng(14500 + s * 10 + K), { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 });
  }
  finetuneFrom(T, G, A, model, worked, 14600 + s * 100 + K);
  const test = [];
  for (let i = 0; i < 200; i++) test.push(genReverse(rng, 1 + rng.int(3)));
  const acc = T.evaluate(model, test, 1).acc;
  const ledger = { spec: "noveltype-v10", seed: s, K, arm, verdict: "COMPLETE", acc: +acc.toFixed(4) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(ledger));
  log("d-novel-few K=" + K + " s=" + s + " " + arm + " acc=" + ledger.acc);
  return ledger;
};

// ---- v1.1 cycle-consistency (answer-free). Soft chaining, fully differentiable.
// Per pairs-set: L_A = -log SUM_v pF(v)*pRv(kf); L_B = -log SUM_k pR(k)*pFk(vr).
function softOf(logits) {
  let m = -1e300;
  for (let i = 0; i < logits.length; i++) if (logits[i] > m) m = logits[i];
  const e = logits.map((z) => Math.exp(z - m));
  const s = e.reduce((a, b) => a + b, 0);
  return e.map((v) => v / s);
}
// dL/dlogits given dL/dp (p = soft(logits)): dz_i = p_i*(g_i - SUM_j g_j p_j)
function dSoftmax(p, g) {
  let dot = 0;
  for (let j = 0; j < p.length; j++) dot += g[j] * p[j];
  return p.map((pi, i) => pi * (g[i] - dot));
}
function fwdP(model, flat, k) {
  const f = model.forward(flat.concat([k, 8]), 1);
  const lg = Array.from(f.logits);
  return { fw: f, p: softOf(lg) };
}
function auxFor(model, A, B, x, fwd) {
  if (!fwd.cache.posOut) return null;
  const labs = A.bindLabels(x);
  const out = new Array(x.length);
  for (let t = 0; t < x.length; t++) {
    if (labs[t] == null) { out[t] = null; continue; }
    const ceT = model.__G.softmaxCE(fwd.cache.posOut[t].logits, labs[t]);
    const dt = ceT.dlogits;
    for (let i = 0; i < dt.length; i++) dt[i] /= (B * x.length);
    out[t] = dt;
  }
  return out;
}
function cycleStep(T, G, A, model, P, B) {
  const flat = P.flat, kf = P.kf, vr = P.vr, kr = P.kr, vf = P.vf;
  // forward query + all four reverse queries
  const F = fwdP(model, flat, kf);
  const RV = [0, 1, 2, 3].map((v) => fwdP(model, flat, 4 + v));
  // L_A = -log E, E = SUM_v pF(v)*pRv(kf)
  let E = 0;
  for (let v = 0; v < 4; v++) E += F.p[v] * RV[v].p[kf];
  // reverse query + all four forward queries
  const R = fwdP(model, flat, 4 + vr);
  const FK = [0, 1, 2, 3].map((k) => fwdP(model, flat, k));
  let E2 = 0;
  for (let k = 0; k < 4; k++) E2 += R.p[k] * FK[k].p[vr];
  const loss = -Math.log(E + 1e-12) - Math.log(E2 + 1e-12);
  // grads w.r.t. probabilities
  const gF = [0, 0, 0, 0], gR = [0, 0, 0, 0], gRV = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]], gFK = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
  for (let v = 0; v < 4; v++) {
    gF[v] = -(RV[v].p[kf] / (E + 1e-12));
    gRV[v][kf] = -(F.p[v] / (E + 1e-12));
  }
  for (let k = 0; k < 4; k++) {
    gR[k] = -(FK[k].p[vr] / (E2 + 1e-12));
    gFK[k][vr] = -(R.p[k] / (E2 + 1e-12));
  }
  const jobs = [
    { f: F, g: gF, x: flat.concat([kf, 8]) },
    { f: R, g: gR, x: flat.concat([4 + vr, 8]) },
  ];
  for (let v = 0; v < 4; v++) jobs.push({ f: RV[v], g: gRV[v], x: flat.concat([4 + v, 8]) });
  for (let k = 0; k < 4; k++) jobs.push({ f: FK[k], g: gFK[k], x: flat.concat([k, 8]) });
  for (const j of jobs) {
    const dz = dSoftmax(softOf(Array.from(j.f.fw.logits)), j.g);
    for (let i = 0; i < dz.length; i++) dz[i] /= B;
    model.backward(dz, j.f.fw, auxFor(model, A, B, j.x, j.f.fw), null, null);
  }
  return loss;
}
function genCycleSet(rng, A) {
  const keys = shuffleIn(rng, [0, 1, 2, 3]);
  const pairs = [[keys[0], 4 + rng.int(4)], [keys[1], 4 + rng.int(4)], [keys[2], 4 + rng.int(4)]];
  const flat = [];
  for (const [k, v] of shuffleIn(rng, pairs.slice())) flat.push(k, v);
  const fi = rng.int(3), ri = rng.int(3);
  return { flat, kf: pairs[fi][0], vf: pairs[fi][1] - 4, vr: pairs[ri][1] - 4, kr: pairs[ri][0] };
}
globalThis.runCycleTrain = async function (fs, log, s, arm) {
  const ledgerPath = "src/evidence/decomp/d-cycle-" + arm + "-s" + s + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.NovelInit(fs);
  const A = TASKS.assocR;
  let model;
  if (arm === "tutor") {
    const tut = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-novel-tutor-s" + s + ".json"));
    model = novelRestore(T, G, tut);
  } else if (arm === "scratch") {
    model = T.makeModel(G.makeRng(14700 + s), { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 });
  } else { // supmix: labels control, 256 mixed worked examples from tutor weights
    const tut = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-novel-tutor-s" + s + ".json"));
    model = novelRestore(T, G, tut);
    const rng0 = G.makeRng(14750 + s);
    const worked = [];
    for (let i = 0; i < 256; i++) {
      if (rng0.uniform(0, 1) < 0.5) worked.push(A.gen(rng0, 1 + rng0.int(3)));
      else worked.push(genReverse(rng0, 1 + rng0.int(3)));
    }
    finetuneFrom(T, G, A, model, worked, 14760 + s);
    const ev = await globalThis.runCycleEval(fs, log, s, arm, model);
    ev.train = { arm, steps: "supervised-mixed-256" };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ev));
    return ev;
  }
  model.__G = G;
  const opt = new G.Adam(5e-3);
  const rng = G.makeRng(14800 + s);
  const B = 8, STEPS = 300;
  const t0 = Date.now();
  let lastLoss = 0;
  for (let step = 0; step < STEPS; step++) {
    model.zeroGrad();
    let lsum = 0;
    for (let b = 0; b < B; b++) lsum += cycleStep(T, G, A, model, genCycleSet(rng, A), B);
    opt.step(model.params());
    lastLoss = lsum / B;
  }
  const wallMs = Date.now() - t0;
  const ev = await globalThis.runCycleEval(fs, log, s, arm, model);
  ev.train = { arm, steps: STEPS, lastLoss: +lastLoss.toFixed(4), wallMs };
  await fs.writeTextFile(ledgerPath, JSON.stringify(ev));
  return ev;
};
globalThis.runCycleEval = async function (fs, log, s, arm, modelOpt) {
  const { G, T, TASKS } = await globalThis.NovelInit(fs);
  const A = TASKS.assocR;
  let model = modelOpt;
  if (!model) {
    const tut = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-cycle-" + arm + "-s" + s + ".json"));
    if (!tut.arch) throw new Error("no model to eval");
    model = novelRestore(T, G, { trainSeed: 14100 + s, arch: tut.arch, params: tut.params });
  }
  const fw = (x) => argmaxOf(Array.from(model.forward(x, 1).logits));
  const rng = G.makeRng(14900 + s);
  const batt = { b0: [], b1: [], b2: [], b3: [], b4: [], b5: [] };
  for (let i = 0; i < 200; i++) batt.b0.push(A.gen(rng, 1 + rng.int(3)));
  for (let i = 0; i < 200; i++) batt.b1.push(A.gen(rng, 5));
  for (let i = 0; i < 200; i++) batt.b2.push(genFlip(rng, A, 1 + rng.int(3)));
  for (let i = 0; i < 200; i++) batt.b3.push(genReverse(rng, 1 + rng.int(3)));
  for (let i = 0; i < 200; i++) batt.b4.push(genReverse(rng, 4)); // 4 = max distinct keys; longer than trained 1..3
  for (let i = 0; i < 200; i++) {
    const L = genReverse(rng, 1 + rng.int(3));
    batt.b5.push({ flat: L.flat, y: L.y, echo: L.echo, x: [L.x[L.x.length - 2], 8].concat(L.x.slice(0, L.x.length - 2)) });
  }
  const acc = (arr) => arr.filter((ex) => fw(ex.x) === ex.y).length / arr.length;
  let hit3 = 0, echo = 0;
  for (const L of batt.b3) { const o = fw(L.x); if (o === L.y) hit3++; if (o === L.echo) echo++; }
  const body = { spec: "noveltype-v11", seed: s, arm, verdict: "COMPLETE", n: 200,
    acc: { b0: +acc(batt.b0).toFixed(4), b1: +acc(batt.b1).toFixed(4), b2: +acc(batt.b2).toFixed(4),
      b3: +(hit3 / 200).toFixed(4), b4: +acc(batt.b4).toFixed(4), b5: +acc(batt.b5).toFixed(4) },
    b3echoRate: +(echo / 200).toFixed(4), chance: 0.25 };
  log("cycle-eval s=" + s + " " + arm + " " + JSON.stringify(body.acc) + " echo=" + body.b3echoRate);
  return body;
};

// ---- pin-v10: semi-supervised pin (16 forward anchors + v11 cycles). ----
function genPinSet(rng, A) {
  const set = [];
  for (let i = 0; i < 16; i++) set.push(A.gen(rng, 1 + rng.int(3)));
  return set;
}
function supPinStep(T, G, A, model, pinSet) {
  // One mean-gradient pass over all 16 anchors (CE + bindLabels aux, /16).
  let lsum = 0;
  for (const ex of pinSet) {
    const fwd = model.forward(ex.x, 1);
    const ce = G.softmaxCE(fwd.logits, ex.y);
    lsum += ce.loss;
    const d = ce.dlogits;
    for (let i = 0; i < d.length; i++) d[i] /= pinSet.length;
    let auxList = null;
    if (fwd.cache.posOut) {
      const labs = A.bindLabels(ex.x);
      auxList = new Array(ex.x.length);
      for (let t = 0; t < ex.x.length; t++) {
        if (labs[t] == null) { auxList[t] = null; continue; }
        const ceT = G.softmaxCE(fwd.cache.posOut[t].logits, labs[t]);
        lsum += ceT.loss / ex.x.length;
        const dt = ceT.dlogits;
        for (let i = 0; i < dt.length; i++) dt[i] /= (pinSet.length * ex.x.length);
        auxList[t] = dt;
      }
    }
    model.backward(d, fwd, auxList, null, null);
  }
  return lsum / pinSet.length;
}
// ---- pin-v11: distribution-wide constraint (distillation) + weight sweep. ----
function supPinStepW(T, G, A, model, pinSet, W) {
  let lsum = 0;
  for (const ex of pinSet) {
    const fwd = model.forward(ex.x, 1);
    const ce = G.softmaxCE(fwd.logits, ex.y);
    lsum += ce.loss;
    const d = ce.dlogits;
    for (let i = 0; i < d.length; i++) d[i] *= W / pinSet.length;
    let auxList = null;
    if (fwd.cache.posOut) {
      const labs = A.bindLabels(ex.x);
      auxList = new Array(ex.x.length);
      for (let t = 0; t < ex.x.length; t++) {
        if (labs[t] == null) { auxList[t] = null; continue; }
        const ceT = G.softmaxCE(fwd.cache.posOut[t].logits, labs[t]);
        lsum += (W * ceT.loss) / ex.x.length;
        const dt = ceT.dlogits;
        for (let i = 0; i < dt.length; i++) dt[i] *= W / (pinSet.length * ex.x.length);
        auxList[t] = dt;
      }
    }
    model.backward(d, fwd, auxList, null, null);
  }
  return lsum / pinSet.length;
}
// KL(teacher||student) mean-gradient pass over B fresh forward lines.
// Teacher is frozen (forward only). Filed default: no aux on distill lines.
// opts (representational-v10): {pi (permute teacher probs), aux (bindLabels auxList or null), auxScale}.
function distillStep(T, G, A, student, teacher, rng, B, W, pairN, opts) {
  let lsum = 0;
  for (let b = 0; b < B; b++) {
    const ex = pairN ? A.gen(rng, pairN) : A.gen(rng, 1 + rng.int(3));
    const fs = student.forward(ex.x, 1);
    const ft = teacher.forward(ex.x, 1);
    const ps = softOf(Array.from(fs.logits));
    let pt = softOf(Array.from(ft.logits));
    if (opts && opts.pi) pt = opts.pi.map((i) => pt[i]);
    let L = 0;
    for (let i = 0; i < 4; i++) L += pt[i] * Math.log(pt[i] / (ps[i] + 1e-12) + 1e-12);
    lsum += L;
    const g = ps.map((s, i) => -pt[i] / (s + 1e-12));
    const dz = dSoftmax(ps, g);
    for (let i = 0; i < dz.length; i++) dz[i] *= W / B;
    let auxList = null;
    if (opts && opts.aux) {
      auxList = auxFor(student, A, B, ex.x, fs);
      if (auxList && opts.auxScale && opts.auxScale !== 1) {
        for (let t = 0; t < auxList.length; t++) {
          if (auxList[t] == null) continue;
          for (let i = 0; i < auxList[t].length; i++) auxList[t][i] *= opts.auxScale;
        }
      }
    }
    student.backward(dz, fs, auxList, null, null);
  }
  return lsum / B;
}
globalThis.runPin11Train = async function (fs, log, s, arm) {
  const ledgerPath = "src/evidence/decomp/d-pin11-" + arm + "-s" + s + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.NovelInit(fs);
  const A = TASKS.assocR;
  const tut = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-novel-tutor-s" + s + ".json"));
  if (tut.verdict !== "COMPLETE") {
    const ab = { spec: "pin-v11", seed: s, arm, verdict: "ABORT", reason: "tutor gated" };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab;
  }
  const model = novelRestore(T, G, tut);
  model.__G = G;
  const teacher = novelRestore(T, G, tut); // frozen: forward only, never stepped
  const rng = G.makeRng(15000 + s);
  const pinSet = genPinSet(rng, A);
  const drng = G.makeRng(15100 + s);
  const opt = new G.Adam(5e-3);
  const B = 8, STEPS = 300;
  const t0 = Date.now();
  let lastCyc = 0, lastCon = 0;
  for (let step = 0; step < STEPS; step++) {
    model.zeroGrad();
    let lsum = 0;
    for (let b = 0; b < B; b++) lsum += cycleStep(T, G, A, model, genCycleSet(rng, A), B);
    lastCyc = lsum / B;
    if (arm === "point16") lastCon = supPinStepW(T, G, A, model, pinSet, 16);
    else lastCon = distillStep(T, G, A, model, teacher, drng, B, arm === "distill4" ? 4 : 1);
    opt.step(model.params());
  }
  const wallMs = Date.now() - t0;
  const ev = await globalThis.runCycleEval(fs, log, s, "pin11-" + arm, model);
  ev.spec = "pin-v11";
  ev.train = { arm, steps: STEPS, lastCycleLoss: +lastCyc.toFixed(4), lastConLoss: +lastCon.toFixed(4), wallMs };
  await fs.writeTextFile(ledgerPath, JSON.stringify(ev));
  log("pin11-" + arm + "-s" + s + " cyc=" + ev.train.lastCycleLoss + " con=" + ev.train.lastConLoss);
  return ev;
};
globalThis.runPinTrain = async function (fs, log, s, arm) {
  const slug = arm === "tutor" ? "tutor" : "anchoronly";
  const ledgerPath = "src/evidence/decomp/d-pin-" + slug + "-s" + s + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.NovelInit(fs);
  const A = TASKS.assocR;
  const tut = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-novel-tutor-s" + s + ".json"));
  if (tut.verdict !== "COMPLETE") {
    const ab = { spec: "pin-v10", seed: s, arm: slug, verdict: "ABORT", reason: "tutor gated" };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab;
  }
  const model = novelRestore(T, G, tut);
  model.__G = G;
  const rng = G.makeRng(15000 + s);
  const pinSet = genPinSet(rng, A);
  const opt = new G.Adam(5e-3);
  const B = 8, STEPS = 300;
  const t0 = Date.now();
  let lastCyc = 0, lastSup = 0;
  for (let step = 0; step < STEPS; step++) {
    model.zeroGrad();
    if (slug === "tutor") {
      let lsum = 0;
      for (let b = 0; b < B; b++) lsum += cycleStep(T, G, A, model, genCycleSet(rng, A), B);
      lastCyc = lsum / B;
      lastSup = supPinStep(T, G, A, model, pinSet);
    } else {
      lastCyc = 0;
      lastSup = supPinStep(T, G, A, model, pinSet);
    }
    opt.step(model.params());
  }
  const wallMs = Date.now() - t0;
  const ev = await globalThis.runCycleEval(fs, log, s, "pin-" + slug, model);
  ev.spec = "pin-v10";
  ev.train = { arm: slug, steps: STEPS, lastCycleLoss: +lastCyc.toFixed(4), lastSupLoss: +lastSup.toFixed(4), wallMs, nPin: 16 };
  await fs.writeTextFile(ledgerPath, JSON.stringify(ev));
  log("pin-" + slug + "-s" + s + " cyc=" + ev.train.lastCycleLoss + " sup=" + ev.train.lastSupLoss);
  return ev;
};
// ---- verifier-v10: distill4x2 (600 steps, re-anchored round boundary). ----
globalThis.runVerifierV1 = async function (fs, log, s) {
  const ledgerPath = "src/evidence/decomp/d-ver1-distill4x2-s" + s + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.NovelInit(fs);
  const A = TASKS.assocR;
  const tut = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-novel-tutor-s" + s + ".json"));
  if (tut.verdict !== "COMPLETE") {
    const ab = { spec: "verifier-v10", seed: s, arm: "distill4x2", verdict: "ABORT", reason: "tutor gated" };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab;
  }
  const model = novelRestore(T, G, tut);
  model.__G = G;
  const teacher = novelRestore(T, G, tut); // frozen: forward only
  const B = 8, HALF = 300;
  const t0 = Date.now();
  async function half(rngSeed, drngSeed, tag) {
    const rng = G.makeRng(rngSeed + s);
    const drng = G.makeRng(drngSeed + s);
    const opt = new G.Adam(5e-3); // fresh per round = the round boundary
    let lastCyc = 0, lastCon = 0;
    for (let step = 0; step < HALF; step++) {
      model.zeroGrad();
      let lsum = 0;
      for (let b = 0; b < B; b++) lsum += cycleStep(T, G, A, model, genCycleSet(rng, A), B);
      lastCyc = lsum / B;
      lastCon = distillStep(T, G, A, model, teacher, drng, B, 4);
      opt.step(model.params());
    }
    const ev = await globalThis.runCycleEval(fs, log, s, "ver1-" + tag, model);
    ev.spec = "verifier-v10";
    ev.train = { arm: "distill4x2-" + tag, steps: HALF, lastCycleLoss: +lastCyc.toFixed(4), lastConLoss: +lastCon.toFixed(4) };
    return ev;
  }
  const r1 = await half(15000, 15100, "r1"); // v11-identical streams: replication
  const r2 = await half(16000, 16100, "r2"); // re-anchored: stacking test
  const body = { spec: "verifier-v10", seed: s, arm: "distill4x2", verdict: "COMPLETE",
    wallMs: Date.now() - t0, r1: { acc: r1.acc, b3echoRate: r1.b3echoRate, train: r1.train },
    r2: { acc: r2.acc, b3echoRate: r2.b3echoRate, train: r2.train } };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("ver1-distill4x2-s" + s + " r1b3=" + r1.acc.b3 + " r2b3=" + r2.acc.b3);
  return body;
};

// ---- verifier H/R/X shared extensions (specs verifier-h10/r10/x10). ----
function saveP(model) { return model.params().map((p) => Array.from(p.v !== undefined ? p.v : p)); }
function restoreP(T, G, tut, arrs) {
  const model = novelRestore(T, G, tut);
  const ps = model.params();
  for (let i = 0; i < ps.length; i++) {
    const dst = ps[i].v !== undefined ? ps[i].v : ps[i];
    const src = arrs[i];
    for (let j = 0; j < dst.length; j++) dst[j] = src[j];
  }
  model.__G = G;
  return model;
}
// unique-value query picker over pairs; -1 if none.
function pickUniqueIdx(rng, pairs) {
  const counts = {};
  for (const [k, v] of pairs) counts[v] = (counts[v] || 0) + 1;
  const cands = [];
  for (let i = 0; i < pairs.length; i++) if (counts[pairs[i][1]] === 1) cands.push(i);
  if (!cands.length) return -1;
  return cands[rng.int(cands.length)];
}
function finalizeUniqueLines(rng, pairs) {
  let j = pickUniqueIdx(rng, pairs), guard = 0;
  while (j < 0 && guard++ < 20) {
    const t = rng.int(pairs.length);
    const used = {};
    for (const [k, v] of pairs) used[v] = true;
    for (let v = 4; v < 8; v++) if (!used[v]) { pairs[t][1] = v; break; }
    j = pickUniqueIdx(rng, pairs);
  }
  if (j < 0) j = 0;
  const flat = [];
  for (const [k, v] of shuffleIn(rng, pairs.slice())) flat.push(k, v);
  return { flat, j };
}
// distractor reverse: nBase clean pairs + nDec reuse-key decoys, unique query.
function genDistractLines(rng, nBase, nDec) {
  const keys = shuffleIn(rng, [0, 1, 2, 3]).slice(0, nBase);
  const pairs = keys.map((k) => [k, 4 + rng.int(4)]);
  for (let i = 0; i < nDec; i++) pairs.push([rng.int(4), 4 + rng.int(4)]);
  const r = finalizeUniqueLines(rng, pairs);
  return { flat: r.flat, y: pairs[r.j][0], echo: pairs[r.j][1] - 4, x: r.flat.concat([pairs[r.j][1], 8]) };
}
// long reverse: n pairs, keys with replacement, unique query.
function genLongLines(rng, n) {
  const pairs = [];
  for (let i = 0; i < n; i++) pairs.push([rng.int(4), 4 + rng.int(4)]);
  const r = finalizeUniqueLines(rng, pairs);
  return { flat: r.flat, y: pairs[r.j][0], echo: pairs[r.j][1] - 4, x: r.flat.concat([pairs[r.j][1], 8]) };
}
// pool-invented (gemini 2026-11-22): retrieve key's value, shift +k mod 4.
function genShift(rng) {
  const keys = shuffleIn(rng, [0, 1, 2, 3]).slice(0, 3);
  const pairs = keys.map((k) => [k, 4 + rng.int(4)]);
  const flat = [];
  for (const [k, v] of shuffleIn(rng, pairs.slice())) flat.push(k, v);
  const qi = rng.int(3), qk = pairs[qi][0], vi = pairs[qi][1] - 4, k = 1 + rng.int(3);
  return { flat, x: flat.concat([qk, k, 8]), y: (vi + k) % 4, echo: vi };
}
// pool-invented (gemini 2026-11-22): sum a key's bound values mod 4.
function genParity(rng) {
  for (let attempt = 0; attempt < 30; attempt++) {
    const nP = 4 + rng.int(2);
    const pairs = [];
    for (let i = 0; i < nP; i++) pairs.push([rng.int(4), 4 + rng.int(4)]);
    const byKey = {};
    pairs.forEach(([k, v], i) => { (byKey[k] = byKey[k] || []).push(i); });
    const multi = Object.keys(byKey).filter((k) => byKey[k].length >= 2);
    if (!multi.length) continue;
    const qk = +multi[rng.int(multi.length)];
    const idxs = byKey[qk];
    let s = 0;
    for (const i of idxs) s += pairs[i][1] - 4;
    const flat = [];
    for (const [k, v] of shuffleIn(rng, pairs.slice())) flat.push(k, v);
    let last = pairs[idxs[0]][1] - 4;
    for (let t = 0; t < flat.length; t += 2) if (flat[t] === qk) last = flat[t + 1] - 4;
    return { flat, x: flat.concat([qk, 8]), y: s % 4, echo: last };
  }
  return { flat: [0, 4, 0, 5, 1, 6, 2, 7], x: [0, 4, 0, 5, 1, 6, 2, 7, 0, 8], y: 1, echo: 1 };
}
function genCycleSetDist(rng, A) {
  const P = genCycleSet(rng, A);
  const dec = [];
  for (let i = 0; i < 2; i++) dec.push(rng.int(4), 4 + rng.int(4));
  return { flat: P.flat.concat(dec), kf: P.kf, vf: P.vf, vr: P.vr, kr: P.kr };
}
function genCycleSetLong6(rng, A) {
  const pairs = [];
  for (let i = 0; i < 6; i++) pairs.push([rng.int(4), 4 + rng.int(4)]);
  const flat = [];
  for (const [k, v] of shuffleIn(rng, pairs.slice())) flat.push(k, v);
  const fi = rng.int(6);
  let ri = rng.int(6), guard = 0;
  while (guard++ < 10) {
    const counts = {};
    for (const [k, v] of pairs) counts[v] = (counts[v] || 0) + 1;
    if (counts[pairs[ri][1]] === 1) break;
    ri = rng.int(6);
  }
  return { flat, kf: pairs[fi][0], vf: pairs[fi][1] - 4, vr: pairs[ri][1] - 4, kr: pairs[ri][0] };
}
globalThis.runExtEval = async function (fs, log, s, tag, model) {
  const { G, T, TASKS } = await globalThis.NovelInit(fs);
  const A = TASKS.assocR;
  const fw = (x) => argmaxOf(Array.from(model.forward(x, 1).logits));
  const rng = G.makeRng(15200 + s);
  const mk = (n, fn) => { const a = []; for (let i = 0; i < n; i++) a.push(fn()); return a; };
  const batt = {
    b5: mk(200, () => { const L = genReverse(rng, 1 + rng.int(3));
      return { flat: L.flat, y: L.y, echo: L.echo,
        x: [L.x[L.x.length - 2], 8].concat(L.flat) }; }), // filed b5 shape (single query token fronted)
    b6: mk(200, () => genDistractLines(rng, 3, 2)),
    b6x: mk(200, () => genDistractLines(rng, 4, 2)),
    b7: mk(200, () => genLongLines(rng, 6)),
    b7x: mk(200, () => genLongLines(rng, 4)),
    b8: mk(200, () => genShift(rng)),
    b9: mk(200, () => genParity(rng)),
  };
  const acc = (arr) => arr.filter((ex) => fw(ex.x) === ex.y).length / arr.length;
  const out = {};
  for (const k of Object.keys(batt)) out[k] = +acc(batt[k]).toFixed(4);
  log("ext-eval s=" + s + " " + tag + " " + JSON.stringify(out));
  return { spec: "verifier-ext", seed: s, tag, n: 200, acc: out, chance: 0.25 };
};
// Generalized re-anchored multi-half runner. cfg: {ledger, spec, tag, ext,
// halves:[{rng,drng,W,cycles,cycleGen,distillN}]}. 300 steps per half.
globalThis.runVerifierGH = async function (fs, log, s, cfg) {
  const ledgerPath = "src/evidence/decomp/" + cfg.ledger;
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.NovelInit(fs);
  const A = TASKS.assocR;
  const tut = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-novel-tutor-s" + s + ".json"));
  if (tut.verdict !== "COMPLETE") {
    const ab = { spec: cfg.spec, seed: s, arm: cfg.tag, verdict: "ABORT", reason: "tutor gated" };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab;
  }
  const model = novelRestore(T, G, tut);
  model.__G = G;
  const teacher = novelRestore(T, G, tut);
  const t0 = Date.now();
  const cks = [];
  const cycGens = { std: genCycleSet, dist: genCycleSetDist, long6: genCycleSetLong6 };
  for (let h = 0; h < cfg.halves.length; h++) {
    const H = cfg.halves[h];
    const rng = G.makeRng(H.rng + s), drng = G.makeRng(H.drng + s);
    const opt = new G.Adam(5e-3);
    const B = 8;
    let lastCyc = 0, lastCon = 0;
    for (let step = 0; step < 300; step++) {
      model.zeroGrad();
      if (H.cycles !== false) {
        let lsum = 0;
        const cg = cycGens[H.cycleGen || "std"];
        for (let b = 0; b < B; b++) lsum += cycleStep(T, G, A, model, cg(rng, A), B);
        lastCyc = lsum / B;
      }
      if ((H.W || 0) > 0) lastCon = distillStep(T, G, A, model, teacher, drng, B, H.W, H.distillN || null);
      opt.step(model.params());
    }
    const ev = await globalThis.runCycleEval(fs, log, s, cfg.tag + "-r" + (h + 1), model);
    let ext = null;
    if (cfg.ext) ext = await globalThis.runExtEval(fs, log, s, cfg.tag + "-r" + (h + 1), model);
    cks.push({ acc: ev.acc, echo: ev.b3echoRate,
      ext: ext ? ext.acc : null,
      train: { lastCycleLoss: +lastCyc.toFixed(4), lastConLoss: +lastCon.toFixed(4) },
      params: saveP(model) });
  }
  const body = { spec: cfg.spec, seed: s, arm: cfg.tag, verdict: "COMPLETE",
    wallMs: Date.now() - t0, cks };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log(cfg.tag + "-s" + s + " done");
  return body;
};
globalThis.runVerifierH = async function (fs, log, s, arm) {
  const cg = arm === "h1" ? "std" : arm === "h2" ? "dist" : "long6";
  return globalThis.runVerifierGH(fs, log, s, { ledger: "d-verH-" + arm + "-s" + s + ".json",
    spec: "verifier-h10", tag: "verH-" + arm, ext: true,
    halves: [{ rng: 15000, drng: 15100, W: 4, cycles: true, cycleGen: cg },
             { rng: 16000, drng: 16100, W: 4, cycles: true, cycleGen: cg }] });
};
globalThis.runVerifierX = async function (fs, log, s, arm) {
  const distillN = arm === "x2" ? 5 : null;
  return globalThis.runVerifierGH(fs, log, s, { ledger: "d-verX-" + arm + "-s" + s + ".json",
    spec: "verifier-x10", tag: "verX-" + arm, ext: true,
    halves: [{ rng: 15000, drng: 15100, W: 4, cycles: true, cycleGen: "std", distillN },
             { rng: 16000, drng: 16100, W: 4, cycles: true, cycleGen: "std", distillN }] });
};
globalThis.runVerifierR = async function (fs, log, s, variant) {
  if (variant === "a") {
    return globalThis.runVerifierGH(fs, log, s, { ledger: "d-verR-a-s" + s + ".json",
      spec: "verifier-r10", tag: "verR-a", ext: false,
      halves: [{ rng: 15000, drng: 15100, W: 4, cycles: true },
               { rng: 16000, drng: 16100, W: 4, cycles: true },
               { rng: 17000, drng: 17100, W: 4, cycles: true }] });
  }
  const a = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-verR-a-s" + s + ".json"));
  if (!a || a.verdict !== "COMPLETE" || !a.cks || !a.cks[1] || !a.cks[1].params) {
    throw new Error("verR-a-s" + s + " R2 params missing; run R-a first");
  }
  const { G, T, TASKS } = await globalThis.NovelInit(fs);
  const A = TASKS.assocR;
  const tut = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-novel-tutor-s" + s + ".json"));
  const teacher = novelRestore(T, G, tut);
  const model = restoreP(T, G, tut, a.cks[1].params); // filed R2 state, same seed
  const H = variant === "b" ? { rng: 17000, drng: 17100, W: 0, cycles: true }
                            : { rng: 17000, drng: 17100, W: 4, cycles: false };
  const rng = G.makeRng(H.rng + s), drng = G.makeRng(H.drng + s);
  const opt = new G.Adam(5e-3);
  const B = 8;
  let lastCyc = 0, lastCon = 0;
  const t0 = Date.now();
  for (let step = 0; step < 300; step++) {
    model.zeroGrad();
    if (H.cycles) {
      let lsum = 0;
      for (let b = 0; b < B; b++) lsum += cycleStep(T, G, A, model, genCycleSet(rng, A), B);
      lastCyc = lsum / B;
    }
    if (H.W > 0) lastCon = distillStep(T, G, A, model, teacher, drng, B, H.W, null);
    opt.step(model.params());
  }
  const ev = await globalThis.runCycleEval(fs, log, s, "verR-" + variant + "-r3", model);
  const body = { spec: "verifier-r10", seed: s, arm: "verR-" + variant, verdict: "COMPLETE",
    wallMs: Date.now() - t0,
    r3: { acc: ev.acc, echo: ev.b3echoRate,
      train: { lastCycleLoss: +lastCyc.toFixed(4), lastConLoss: +lastCon.toFixed(4) },
      params: saveP(model) },
    from: { ledger: "d-verR-a-s" + s + ".json", r2acc: a.cks[1].acc } };
  const ledgerPath = "src/evidence/decomp/d-verR-" + variant + "-s" + s + ".json";
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("verR-" + variant + "-s" + s + " r3b3=" + ev.acc.b3);
  return body;
};
// Supervised learnability probe for new gens (X gate): from-scratch model,
// 150 labeled lines, no verifier involvement.
globalThis.runGenProbe = async function (fs, log, name) {
  const ledgerPath = "src/evidence/decomp/d-verX-probe-" + name + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.NovelInit(fs);
  const rng = G.makeRng(18000 + name.length * 131 + name.charCodeAt(0));
  const gens = {
    distract: () => genDistractLines(rng, 3, 2),
    distract42: () => genDistractLines(rng, 4, 2),
    long6: () => genLongLines(rng, 6),
    long4: () => genLongLines(rng, 4),
    shift: () => genShift(rng),
    parity: () => genParity(rng),
  };
  const train = [], test = [];
  for (let i = 0; i < 150; i++) { const ex = gens[name](); train.push({ x: ex.x, y: ex.y }); }
  for (let i = 0; i < 200; i++) { const ex = gens[name](); test.push({ x: ex.x, y: ex.y }); }
  const t0 = Date.now();
  const out = await T.trainModel({ seed: 18100 + name.length, arch: "attn", vocab: 9, h: 48, m: 96, d: 16,
    classes: 4, train, steps: 800, batch: 16, lr: 5e-3, attnAux: true, attnAuxW: 1.0 });
  const acc = T.evaluate(out.model, test, 1).acc;
  const body = { spec: "verifier-x10-probe", format: name, verdict: "COMPLETE",
    gate: acc >= 0.50 ? "PASS" : "FAIL", acc: +acc.toFixed(4), wallMs: Date.now() - t0, chance: 0.25 };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("probe-" + name + " acc=" + body.acc + " " + body.gate);
  return body;
};

// ---- b1repair-v10: safe wrapper + calibration (filed A.gen untouched). ----
function genSafe5(rng) {
  const keys = [0, 1, 2, 3];
  for (let i = keys.length - 1; i > 0; i--) { const j = rng.int(i + 1), t = keys[i]; keys[i] = keys[j]; keys[j] = t; }
  const ks = keys.slice(0, 5); // 4 keys, same as filed A.gen(rng,5)
  const x = [], vals = [];
  for (const k of ks) { const v = rng.int(4); vals.push(v); x.push(k, 4 + v); }
  const qi = rng.int(4); // CLAMPED (filed: rng.int(5), undefined at 4)
  x.push(ks[qi], 8);
  return { x, y: vals[qi] };
}
globalThis.runB1RepairCalib = async function (fs, log, s, which) {  const ledgerPath = "src/evidence/decomp/d-b1repair-calib-" + which + "-s" + s + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const src = which === "verR-a" ? "src/evidence/decomp/d-verR-a-s" + s + ".json"
                                 : "src/evidence/decomp/d-verH-h1-s" + s + ".json";
  const filed = JSON.parse(await fs.readTextFile(src));
  if (!filed || filed.verdict !== "COMPLETE" || !filed.cks || !filed.cks[1] || !filed.cks[1].params) {
    throw new Error(src + " R2 params missing");
  }
  const { G, T, TASKS } = await globalThis.NovelInit(fs);
  const A = TASKS.assocR;
  const tut = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-novel-tutor-s" + s + ".json"));
  const model = restoreP(T, G, tut, filed.cks[1].params);
  const fw = (x) => argmaxOf(Array.from(model.forward(x, 1).logits));
  const batt = (rng, b1gen) => {
    const b0 = [], b1 = [], b3 = [];
    for (let i = 0; i < 200; i++) b0.push(A.gen(rng, 1 + rng.int(3)));
    for (let i = 0; i < 200; i++) b1.push(b1gen(rng));
    for (let i = 0; i < 200; i++) b3.push(genReverse(rng, 1 + rng.int(3)));
    const acc = (arr) => arr.filter((ex) => fw(ex.x) === ex.y).length / arr.length;
    return { b0: +acc(b0).toFixed(4), b1: +acc(b1).toFixed(4), b3: +acc(b3).toFixed(4) };
  };
  const buggy = batt(G.makeRng(14900 + s), (rng) => A.gen(rng, 5));
  const safe = batt(G.makeRng(14900 + s), (rng) => genSafe5(rng));
  const aligned = buggy.b0 === safe.b0 && buggy.b3 === safe.b3;
  const body = { spec: "b1repair-v10", seed: s, which, verdict: "COMPLETE",
    aligned, buggy, safe, deltaB1: +(safe.b1 - buggy.b1).toFixed(4),
    filedB1: filed.cks[1].acc ? filed.cks[1].acc.b1 : null };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("b1repair-" + which + "-s" + s + " buggyB1=" + buggy.b1 + " safeB1=" + safe.b1 + " aligned=" + aligned);
  return body;
};

// ---- representational-v10: cross-teacher tutors + S-battery. ----
globalThis.runXTeachTutor = async function (fs, log, s) {
  const ledgerPath = "src/evidence/decomp/d-xteach-tutor-s" + s + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log("d-xteach-tutor-s" + s + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.NovelInit(fs);
  const A = TASKS.assocR;
  const rng = G.makeRng(15000 + s);
  const train = [];
  for (let i = 0; i < 500; i++) train.push(A.gen(rng, 1 + rng.int(3)));
  const t0 = Date.now();
  const out = await T.trainModel({ seed: 15100 + s, arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4,
    train, steps: 1200, batch: 16, lr: 5e-3, attnAux: true, attnAuxW: 1.0,
    prefixLabels: (x) => A.bindLabels(x), auxW: 1.0 });
  const wallMs = Date.now() - t0;
  const test = [];
  const trng = G.makeRng(15200 + s);
  for (let i = 0; i < 200; i++) test.push(A.gen(trng, 1 + trng.int(3)));
  const acc = T.evaluate(out.model, test, 1).acc;
  const params = out.model.params().map((p) => Array.from(p.v !== undefined ? p.v : p));
  const ledger = { spec: "representational-v10", seed: s, verdict: acc >= 0.60 ? "COMPLETE" : "ABORT",
    gate: acc >= 0.60 ? "PASS" : "FAIL", testAcc: +acc.toFixed(4), wallMs,
    arch: { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 }, trainSeed: 15100 + s, params };
  await fs.writeTextFile(ledgerPath, JSON.stringify(ledger));
  log("d-xteach-tutor-s" + s + " acc=" + ledger.testAcc + " " + ledger.gate);
  return ledger;
};
globalThis.runVerifierS = async function (fs, log, s, arm) {
  const ledgerPath = "src/evidence/decomp/d-verS-" + arm + "-s" + s + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const cfg = {
    xteach: { teacherFrom: "xteach" },
    shuf: { pi: [2, 0, 3, 1] },
    donly: { cycles: false, W: 4 },
    rec: { studentArch: "seq" },
    aux8: { aux: true, auxScale: 8 },
    aux1: { aux: true, auxScale: 1 },
    ctl: {},
  }[arm];
  if (!cfg) throw new Error("unknown S arm: " + arm);
  const { G, T, TASKS } = await globalThis.NovelInit(fs);
  const A = TASKS.assocR;
  const tutLedger = cfg.teacherFrom === "xteach" ? "d-xteach-tutor-s" + s + ".json" : "d-novel-tutor-s" + s + ".json";
  const tut = JSON.parse(await fs.readTextFile("src/evidence/decomp/" + tutLedger));
  if (tut.verdict !== "COMPLETE") {
    const ab = { spec: "representational-v10", seed: s, arm, verdict: "ABORT", reason: "tutor gated" };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab;
  }
  const teacher = novelRestore(T, G, tut);
  let model;
  if (cfg.studentArch === "seq") {
    model = T.makeModel(G.makeRng(14100 + s), { arch: "seq", vocab: 9, h: 48, m: 96, classes: 4 });
  } else {
    model = novelRestore(T, G, tut);
  }
  model.__G = G;
  const t0 = Date.now();
  const cks = [];
  const halves = [{ rng: 15000, drng: 15100 }, { rng: 16000, drng: 16100 }];
  for (let h = 0; h < halves.length; h++) {
    const H = halves[h];
    const rng = G.makeRng(H.rng + s), drng = G.makeRng(H.drng + s);
    const opt = new G.Adam(5e-3);
    const B = 8;
    let lastCyc = 0, lastCon = 0;
    for (let step = 0; step < 300; step++) {
      model.zeroGrad();
      if (cfg.cycles !== false) {
        let lsum = 0;
        for (let b = 0; b < B; b++) lsum += cycleStep(T, G, A, model, genCycleSet(rng, A), B);
        lastCyc = lsum / B;
      }
      if ((cfg.W === undefined ? 4 : cfg.W) > 0) {
        lastCon = distillStep(T, G, A, model, teacher, drng, B,
          cfg.W === undefined ? 4 : cfg.W, null,
          { pi: cfg.pi || null, aux: !!cfg.aux, auxScale: cfg.auxScale || 1 });
      }
      opt.step(model.params());
    }
    const ev = await globalThis.runCycleEval(fs, log, s, "verS-" + arm + "-r" + (h + 1), model);
    const ext = await globalThis.runExtEval(fs, log, s, "verS-" + arm + "-r" + (h + 1), model);
    cks.push({ acc: ev.acc, echo: ev.b3echoRate, ext: ext.acc,
      train: { lastCycleLoss: +lastCyc.toFixed(4), lastConLoss: +lastCon.toFixed(4) },
      params: saveP(model) });
  }
  const body = { spec: "representational-v10", seed: s, arm, verdict: "COMPLETE",
    wallMs: Date.now() - t0, cks };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("verS-" + arm + "-s" + s + " done");
  return body;
};
