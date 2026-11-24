// src/evidence/decomp/teach-driver.js — teach-v10 (distill cb retriever into fresh student; chain; extras).
// Stack identical to lane/novel drivers (src/tinynn/*). CPU/in-worker only.
globalThis.TeachInit = async function (fs) {
  globalThis.window = globalThis;
  const ORDER = ["src/tinynn/nn.js", "src/tinynn/seeded.js", "src/tinynn/tasks.js", "src/tinynn/train.js"];
  for (const p of ORDER) { const src = await fs.readTextFile(p); (0, eval)(src + "\n//# sourceURL=" + p); }
  const G = globalThis.__tinyNN, T = globalThis.TinyNN;
  if (!G || !T || !T.trainModel) throw new Error("teach stack load failed");
  return { G, T, TASKS: T.TASKS };
};
function teachRestore(T, G, tut, archOverride) {
  const arch = archOverride || tut.arch || { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 };
  const rng = G.makeRng(tut.trainSeed);
  const model = T.makeModel(rng, arch);
  const ps = model.params();
  for (let i = 0; i < ps.length; i++) {
    const dst = ps[i].v !== undefined ? ps[i].v : ps[i];
    const src = tut.params[i];
    for (let j = 0; j < dst.length; j++) dst[j] = src[j];
  }
  return model;
}
function teachShuffle(rng, arr) {
  for (let i = arr.length - 1; i > 0; i--) { const j = rng.int(i + 1), t = arr[i]; arr[i] = arr[j]; arr[j] = t; }
  return arr;
}
function teachGenShiftScr(rng, nP) {
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
  return { flat, qk, k, v: vi, y: (vi + k) % 4, echo: vi, x: flat.concat([qk, k, 0, 8]), xLen: 2 * n + 4 };
}
function teachScratchLabelsT(A, x) {
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
function teachSoft(logits) {
  let m = -Infinity;
  for (const v of logits) if (v > m) m = v;
  const e = logits.map((v) => Math.exp(v - m));
  let s = 0; for (const v of e) s += v;
  return e.map((v) => v / s);
}
function teachDSoftmax(p, g) {
  let dot = 0; for (let i = 0; i < p.length; i++) dot += g[i] * p[i];
  return p.map((pi, i) => pi * (g[i] - dot));
}
function teachAuxFor(model, A, B, x, fwd, labFn) {
  if (!fwd.cache || !fwd.cache.posOut) return null;
  const labs = labFn(A, x);
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
const TEACH_CFG = {
  t1: { teacher: "cb", auxW: 1.0, klW: 4, studentArch: "attn", supervised: false },
  t2: { teacher: "cb", auxW: 8.0, klW: 4, studentArch: "attn", supervised: false },
  t3: { teacher: "t1", auxW: 1.0, klW: 4, studentArch: "attn", supervised: false },
  e1: { teacher: "cb", auxW: 1.0, klW: 4, studentArch: "attn", supervised: false, pi: [2, 0, 3, 1] },
  e2: { teacher: null, auxW: 1.0, klW: 0, studentArch: "attn", supervised: true },
  e3: { teacher: "cb", auxW: 1.0, klW: 4, studentArch: "seq", supervised: false },
  e4: { teacher: "k3aux", auxW: 1.0, klW: 4, studentArch: "attn", supervised: false },
  e5: { teacher: "cb", auxW: 0, klW: 4, studentArch: "attn", supervised: false },
  e10: { teacher: null, auxW: 1.0, klW: 0, studentArch: "attn", supervised: false, retainFrom: "t1", extraSteps: 300 },
};
function teachDiet(G, TASKS, seed) {
  const A = TASKS.assocR;
  const drng = G.makeRng(56100 + seed), frng = G.makeRng(56100 + seed + 500), sh = G.makeRng(56300 + seed);
  const a = [], b = [];
  for (let i = 0; i < 150; i++) { const e = teachGenShiftScr(drng); a.push({ x: e.x, y: e.y }); }
  for (let i = 0; i < 150; i++) b.push(A.gen(frng, 1 + frng.int(3)));
  const all = teachShuffle(sh, a.concat(b));
  return { all, A };
}
globalThis.runTeachTrain = async function (fs, log, arm, seed) {
  const cfg = TEACH_CFG[arm];
  if (!cfg) throw new Error("unknown teach arm: " + arm);
  const ledgerPath = "src/evidence/decomp/d-teach-" + arm + "-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.TeachInit(fs);
  const trainSeed = 56000 + seed * 13;
  const arch = cfg.studentArch === "seq"
    ? { arch: "seq", vocab: 9, h: 48, m: 96, classes: 4 }
    : { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 };
  // E2/E10 supervised path via T.trainModel on fixed diet
  if (cfg.supervised && arm === "e2") {
    const { all, A } = teachDiet(G, TASKS, seed);
    const t0 = Date.now();
    const out = await T.trainModel({ seed: trainSeed, arch: cfg.studentArch, vocab: 9, h: 48, m: 96, d: 16, classes: 4,
      train: all, steps: 800, batch: 16, lr: 5e-3, attnAux: true, attnAuxW: 1.0,
      prefixLabels: (x) => teachScratchLabelsT(A, x), auxW: cfg.auxW });
    const params = out.model.params().map((pl) => Array.from(pl.v !== undefined ? pl.v : pl));
    const body = { spec: "teach-v10.1", arm, verdict: "COMPLETE", seed, trainSeed, arch, nTrain: all.length,
      steps: 800, batch: 16, lr: 5e-3, auxW: cfg.auxW, klW: 0, wallMs: Date.now() - t0,
      firstLoss: +out.firstLoss.toFixed(4), lastLoss: +out.lastLoss.toFixed(4), params };
    await fs.writeTextFile(ledgerPath, JSON.stringify(body));
    log("teach-" + arm + " s=" + seed + " sup loss=" + body.firstLoss + "->" + body.lastLoss);
    return body;
  }
  // E10 retain: load t1 student, +300 supervised steps on fresh diet draws
  if (arm === "e10") {
    const base = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-teach-t1-s" + seed + ".json"));
    if (base.verdict !== "COMPLETE") {
      const ab = { spec: "teach-v10.1", arm, verdict: "ABORT", reason: "t1 gated" };
      await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab;
    }
    const model = teachRestore(T, G, base, arch);
    model.__G = G;
    const { all, A } = teachDiet(G, TASKS, seed + 100);
    const t0 = Date.now();
    // fine-tune via trainModel warm-start is not exposed; do manual CE loop on diet samples
    const opt = new G.Adam(5e-3);
    const brng = G.makeRng(56400 + seed);
    let lastLoss = 0;
    for (let step = 0; step < 300; step++) {
      model.zeroGrad();
      let lsum = 0;
      for (let b = 0; b < 16; b++) {
        const ex = all[brng.int(all.length)];
        const fw = model.forward(ex.x, 1);
        const ce = G.softmaxCE(Array.from(fw.logits), ex.y);
        lsum += ce.loss;
        const dz = ce.dlogits.map((v) => v / 16);
        const aux = cfg.auxW > 0 ? teachAuxFor(model, A, 16, ex.x, fw, teachScratchLabelsT) : null;
        if (aux && cfg.auxW !== 1) for (let t = 0; t < aux.length; t++) { if (!aux[t]) continue; for (let i = 0; i < aux[t].length; i++) aux[t][i] *= cfg.auxW; }
        model.backward(dz, fw, aux, null, null);
      }
      lastLoss = lsum / 16;
      opt.step(model.params());
    }
    const params = model.params().map((pl) => Array.from(pl.v !== undefined ? pl.v : pl));
    const body = { spec: "teach-v10.1", arm, verdict: "COMPLETE", seed, trainSeed, arch, extraSteps: 300,
      wallMs: Date.now() - t0, lastLoss: +lastLoss.toFixed(4), params };
    await fs.writeTextFile(ledgerPath, JSON.stringify(body));
    log("teach-e10 s=" + seed + " retain loss=" + body.lastLoss);
    return body;
  }
  // Distillation path (t1/t2/t3/e1/e3/e4/e5)
  let teacherLedger = null;
  if (cfg.teacher === "cb") teacherLedger = "src/evidence/decomp/d-batch2-cb-s" + seed + ".json";
  else if (cfg.teacher === "k3aux") teacherLedger = "src/evidence/decomp/d-r5-k3aux-s" + seed + ".json";
  else if (cfg.teacher === "t1") teacherLedger = "src/evidence/decomp/d-teach-t1-s" + seed + ".json";
  else throw new Error("bad teacher " + cfg.teacher);
  const tut = JSON.parse(await fs.readTextFile(teacherLedger));
  if (tut.verdict !== "COMPLETE") {
    const ab = { spec: "teach-v10.1", arm, verdict: "ABORT", reason: "teacher gated" };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab;
  }
  const teacherArch = tut.arch || { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 };
  const teacher = teachRestore(T, G, { trainSeed: tut.trainSeed, params: tut.params, arch: teacherArch }, teacherArch);
  const model = T.makeModel(G.makeRng(trainSeed), arch);
  model.__G = G;
  const { all, A } = teachDiet(G, TASKS, seed);
  const opt = new G.Adam(5e-3);
  const brng = G.makeRng(56200 + seed);
  const t0 = Date.now();
  let lastKL = 0;
  for (let step = 0; step < 800; step++) {
    model.zeroGrad();
    let lsum = 0;
    for (let b = 0; b < 16; b++) {
      const ex = all[brng.int(all.length)];
      const fs = model.forward(ex.x, 1);
      const ft = teacher.forward(ex.x, 1);
      const ps = teachSoft(Array.from(fs.logits));
      let pt = teachSoft(Array.from(ft.logits));
      if (cfg.pi) pt = cfg.pi.map((i) => pt[i]);
      let L = 0;
      for (let i = 0; i < 4; i++) L += pt[i] * Math.log(pt[i] / (ps[i] + 1e-12) + 1e-12);
      lsum += L;
      const g = ps.map((s, i) => -pt[i] / (s + 1e-12));
      const dz = teachDSoftmax(ps, g);
      for (let i = 0; i < dz.length; i++) dz[i] *= cfg.klW / 16;
      let auxList = null;
      if (cfg.auxW > 0) {
        auxList = teachAuxFor(model, A, 16, ex.x, fs, teachScratchLabelsT);
        if (auxList && cfg.auxW !== 1) for (let t = 0; t < auxList.length; t++) { if (!auxList[t]) continue; for (let i = 0; i < auxList[t].length; i++) auxList[t][i] *= cfg.auxW; }
      }
      model.backward(dz, fs, auxList, null, null);
    }
    lastKL = lsum / 16;
    opt.step(model.params());
  }
  const params = model.params().map((pl) => Array.from(pl.v !== undefined ? pl.v : pl));
  const body = { spec: "teach-v10.1", arm, verdict: "COMPLETE", seed, trainSeed, arch, teacher: cfg.teacher,
    steps: 800, batch: 16, lr: 5e-3, auxW: cfg.auxW, klW: cfg.klW, pi: cfg.pi || null,
    wallMs: Date.now() - t0, lastKL: +lastKL.toFixed(4), params };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("teach-" + arm + " s=" + seed + " kl=" + body.lastKL);
  return body;
};
function teachArgmax(logits) { let b = 0; for (let i = 1; i < logits.length; i++) if (logits[i] > logits[b]) b = i; return b; }
globalThis.runTeachEval = async function (fs, log, arm, seed) {
  const ledgerPath = "src/evidence/decomp/d-teach-eval-" + arm + "-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.TeachInit(fs);
  const A = TASKS.assocR;
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-teach-" + arm + "-s" + seed + ".json"));
  if (tr.verdict !== "COMPLETE") throw new Error("teach train missing " + arm + " s" + seed);
  const model = teachRestore(T, G, tr, tr.arch);
  const ad = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-r2-add4-s" + seed + ".json"));
  if (ad.verdict !== "COMPLETE") throw new Error("add4 missing s" + seed);
  const m2 = teachRestore(T, G, { trainSeed: ad.trainSeed, params: ad.params, arch: { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 } }, { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 });
  const a2 = (x) => teachArgmax(Array.from(m2.forward(x, 1).logits));
  const frng = G.makeRng(52400 + seed), srng = G.makeRng(52500 + seed);
  const fwdT = []; for (let i = 0; i < 200; i++) fwdT.push(A.gen(frng, 1 + frng.int(3)));
  const shT = []; for (let i = 0; i < 200; i++) shT.push(teachGenShiftScr(srng));
  const fwF = (x) => Array.from(model.forward(x, 1).logits);
  let fF = 0;
  for (const e of fwdT) if (teachArgmax(fwF(e.x)) === e.y) fF++;
  let scr = 0, one = 0, two = 0, orc = 0;
  const byK = { k1: [0, 0], k2: [0, 0], k3: [0, 0] };
  for (const e of shT) {
    const fw1 = model.forward(e.x, 1);
    const vhat = teachArgmax(Array.from(fw1.cache.posOut[8].logits));
    if (vhat === e.v) scr++;
    if (teachArgmax(Array.from(fw1.logits)) === e.y) one++;
    const x2 = e.flat.concat([e.qk, e.k, vhat, 8]);
    if (teachArgmax(fwF(x2)) === e.y) two++;
    const xo = e.flat.concat([e.qk, e.k, e.v, 8]);
    if (teachArgmax(fwF(xo)) === e.y) orc++;
    byK["k" + e.k][1]++;
    if (teachArgmax(fwF(x2)) === e.y) byK["k" + e.k][0]++;
  }
  // T7-style harness with taught retriever + filed ADD4
  let vhits = 0, hits = 0, orcH = 0;
  const hByK = { k1: [0, 0], k2: [0, 0], k3: [0, 0] };
  for (const e of shT) {
    const fw1 = model.forward(e.x, 1);
    const vhat = teachArgmax(Array.from(fw1.cache.posOut[8].logits));
    if (vhat === e.v) vhits++;
    if (a2(e.flat.concat([e.qk, e.k, vhat, 8])) === e.y) { hits++; hByK["k" + e.k][0]++; }
    hByK["k" + e.k][1]++;
    if (a2(e.flat.concat([e.qk, e.k, e.v, 8])) === e.y) orcH++;
  }
  const byKacc = {};
  for (let k = 1; k <= 3; k++) byKacc["k" + k] = +(byK["k" + k][0] / byK["k" + k][1]).toFixed(4);
  const hByKacc = {};
  for (let k = 1; k <= 3; k++) hByKacc["k" + k] = +(hByK["k" + k][0] / hByK["k" + k][1]).toFixed(4);
  const body = { spec: "teach-v10.1", arm, verdict: "COMPLETE", seed, n: 200,
    accFwd: +(fF / fwdT.length).toFixed(4), accScratch: +(scr / shT.length).toFixed(4),
    accOne: +(one / shT.length).toFixed(4), accTwo: +(two / shT.length).toFixed(4),
    accOracle: +(orc / shT.length).toFixed(4), byK: byKacc,
    harness: { accRetrieve: +(vhits / shT.length).toFixed(4), accComposed: +(hits / shT.length).toFixed(4),
      accOracle: +(orcH / shT.length).toFixed(4), product: +((vhits / shT.length) * (orcH / shT.length)).toFixed(4), byK: hByKacc } };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("teach-eval " + arm + " s=" + seed + " scr=" + body.accScratch + " comp=" + body.harness.accComposed);
  return body;
};
globalThis.runTeachProbe = async function (fs, log, kind, seed) {
  const ledgerPath = "src/evidence/decomp/d-teach-" + kind + "-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.TeachInit(fs);
  const A = TASKS.assocR;
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-teach-t1-s" + seed + ".json"));
  if (tr.verdict !== "COMPLETE") throw new Error("t1 missing s" + seed);
  const model = teachRestore(T, G, tr, tr.arch);
  const fwF = (x) => Array.from(model.forward(x, 1).logits);
  let body = null;
  if (kind === "e6len") {
    const srng = G.makeRng(52500 + seed);
    const mk = (nP) => { const a = []; for (let i = 0; i < 200; i++) a.push(teachGenShiftScr(srng, nP)); return a; };
    const twoPass = (e) => {
      const fw1 = model.forward(e.x, 1);
      const idx = e.x.length - 2;
      const vhat = teachArgmax(Array.from(fw1.cache.posOut[idx].logits));
      const x2 = e.x.slice(); x2[x2.length - 2] = vhat;
      return teachArgmax(fwF(x2)) === e.y;
    };
    const t2 = mk(2), t4 = mk(4);
    body = { spec: "teach-v10.1", arm: kind, verdict: "COMPLETE", seed, n: 200,
      accTwo2: +(t2.filter(twoPass).length / t2.length).toFixed(4),
      accTwo4: +(t4.filter(twoPass).length / t4.length).toFixed(4) };
  } else if (kind === "e7dl") {
    const srng = G.makeRng(52500 + seed), erng = G.makeRng(53600 + seed);
    const M = (line) => line.map((t) => (t === 8 ? (erng.int(2) === 0 ? 8 : 7) : t));
    let hits = 0;
    for (let i = 0; i < 200; i++) {
      const e = teachGenShiftScr(srng);
      const fw1 = model.forward(M(e.x), 1);
      if (teachArgmax(Array.from(fw1.cache.posOut[8].logits)) === e.v) hits++;
    }
    body = { spec: "teach-v10.1", arm: kind, verdict: "COMPLETE", seed, n: 200, accScratchDL: +(hits / 200).toFixed(4) };
  } else if (kind === "e8fq") {
    const srng = G.makeRng(52500 + seed);
    let hits = 0;
    for (let i = 0; i < 200; i++) {
      const e = teachGenShiftScr(srng);
      if (teachArgmax(fwF(e.flat.concat([e.qk, 8]))) === e.v) hits++;
    }
    body = { spec: "teach-v10.1", arm: kind, verdict: "COMPLETE", seed, n: 200, accFQ: +(hits / 200).toFixed(4) };
  } else if (kind === "e9echo") {
    const srng = G.makeRng(52500 + seed);
    let lure = 0, n = 0;
    for (let i = 0; i < 200; i++) {
      const e = teachGenShiftScr(srng);
      const fw1 = model.forward(e.x, 1);
      const vhat = teachArgmax(Array.from(fw1.cache.posOut[8].logits));
      if (vhat !== e.v) { lure++; }
      n++;
      void e;
    }
    body = { spec: "teach-v10.1", arm: kind, verdict: "COMPLETE", seed, n, echoLureRate: +(lure / n).toFixed(4) };
  } else throw new Error("unknown probe " + kind);
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("teach-probe " + kind + " s=" + seed + " " + JSON.stringify(body));
  return body;
};

// ---- teach-v11: vhat-distillation (distill retrieval head, not answer head). ----
const VHAT_CFG = {
  v1: { vhat: "hard", auxW: 1.0, klW: 4, answer: "soft" },
  v4: { vhat: "hard", auxW: 8.0, klW: 4, answer: "soft" },
  v2: { vhat: "soft", auxW: 1.0, klW: 4, answer: "soft" },
  v3: { vhat: "hard", auxW: 1.0, klW: 0, answer: "hard" },
  s1: { vhat: "hard", auxW: 1.0, klW: 4, answer: "soft", pi: [2, 0, 3, 1] },
};
function vhatDiet(G, TASKS, seed, pure) {
  const A = TASKS.assocR;
  const drng = G.makeRng(57100 + seed), frng = G.makeRng(57100 + seed + 500), sh = G.makeRng(57300 + seed);
  const a = [], b = [];
  for (let i = 0; i < 150; i++) {
    const e = teachGenShiftScr(drng);
    if (pure) a.push({ x: e.x });
    else a.push({ x: e.x, y: e.y });
  }
  for (let i = 0; i < 150; i++) {
    const f = A.gen(frng, 1 + frng.int(3));
    if (pure) b.push({ x: f.x });
    else b.push({ x: f.x, y: f.y });
  }
  return { all: teachShuffle(sh, a.concat(b)), A };
}
globalThis.runVhatTrain = async function (fs, log, arm, seed) {
  const cfg = VHAT_CFG[arm];
  if (!cfg) throw new Error("unknown vhat arm: " + arm);
  const ledgerPath = "src/evidence/decomp/d-teachv11-" + arm + "-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.TeachInit(fs);
  const pure = arm !== "v3";
  const trainSeed = 57000 + seed * 13;
  const arch = { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 };
  const tut = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-batch2-cb-s" + seed + ".json"));
  if (tut.verdict !== "COMPLETE") {
    const ab = { spec: "teach-v11.1", arm, verdict: "ABORT", reason: "teacher gated" };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab;
  }
  const teacherArch = { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 };
  const teacher = teachRestore(T, G, { trainSeed: tut.trainSeed, params: tut.params, arch: teacherArch }, teacherArch);
  const model = T.makeModel(G.makeRng(trainSeed), arch);
  model.__G = G;
  const { all, A } = vhatDiet(G, TASKS, seed, pure);
  const opt = new G.Adam(5e-3);
  const brng = G.makeRng(57200 + seed);
  const t0 = Date.now();
  let lastLoss = 0;
  for (let step = 0; step < 800; step++) {
    model.zeroGrad();
    let lsum = 0;
    for (let b = 0; b < 16; b++) {
      const ex = all[brng.int(all.length)];
      const fs = model.forward(ex.x, 1);
      const ft = teacher.forward(ex.x, 1);
      const isDummy = ex.x.length === 10 && ex.x[ex.x.length - 1] === 8;
      // answer loss: teacher y-soft KL (pure) or hard-y CE (v3 hybrid)
      let dz;
      if (cfg.answer === "soft") {
        const ps = teachSoft(Array.from(fs.logits));
        let pt = teachSoft(Array.from(ft.logits));
        let L = 0;
        for (let i = 0; i < 4; i++) L += pt[i] * Math.log(pt[i] / (ps[i] + 1e-12) + 1e-12);
        lsum += L;
        const g = ps.map((s, i) => -pt[i] / (s + 1e-12));
        dz = teachDSoftmax(ps, g);
        for (let i = 0; i < dz.length; i++) dz[i] *= cfg.klW / 16;
      } else {
        const ce = G.softmaxCE(Array.from(fs.logits), ex.y);
        lsum += ce.loss;
        dz = ce.dlogits.map((v) => v / 16);
      }
      // aux: fwd lines input-derived bindLabels (same as T1); dummy prefix input-derived copy (same as T1); dummy pos-8 = teacher vhat
      let auxList = null;
      if (fs.cache && fs.cache.posOut) {
        auxList = new Array(ex.x.length);
        for (let t = 0; t < auxList.length; t++) auxList[t] = null;
        if (!isDummy) {
          const labs = A.bindLabels(ex.x);
          for (let t = 0; t < ex.x.length; t++) {
            if (labs[t] == null) continue;
            const ceT = model.__G.softmaxCE(fs.cache.posOut[t].logits, labs[t]);
            const dt = ceT.dlogits;
            for (let i = 0; i < dt.length; i++) dt[i] /= (16 * ex.x.length);
            auxList[t] = dt;
          }
        } else {
          for (let t = 1; t <= 5; t += 2) {
            if (ex.x[t] >= 4 && ex.x[t] < 8 && ex.x[t - 1] >= 0 && ex.x[t - 1] < 4) {
              const ceT = model.__G.softmaxCE(fs.cache.posOut[t].logits, ex.x[t - 1]);
              const dt = ceT.dlogits;
              for (let i = 0; i < dt.length; i++) dt[i] /= (16 * ex.x.length);
              auxList[t] = dt;
            }
          }
          const tpos = 8;
          const tLogits = Array.from(ft.cache.posOut[tpos].logits);
          if (cfg.vhat === "hard") {
            let tv = 0;
            for (let j = 1; j < 4; j++) if (tLogits[j] > tLogits[tv]) tv = j;
            if (cfg.pi) tv = cfg.pi[tv];
            const ceT = model.__G.softmaxCE(fs.cache.posOut[tpos].logits, tv);
            const dt = ceT.dlogits;
            for (let i = 0; i < dt.length; i++) dt[i] /= (16 * ex.x.length);
            auxList[tpos] = dt;
          } else {
            const ps8 = teachSoft(Array.from(fs.cache.posOut[tpos].logits));
            const pt8 = teachSoft(tLogits);
            const g8 = ps8.map((s, i) => -pt8[i] / (s + 1e-12));
            const dz8 = teachDSoftmax(ps8, g8);
            for (let i = 0; i < dz8.length; i++) dz8[i] /= (16 * ex.x.length);
            auxList[tpos] = dz8;
          }
        }
        if (cfg.auxW !== 1) for (let t = 0; t < auxList.length; t++) { if (!auxList[t]) continue; for (let i = 0; i < auxList[t].length; i++) auxList[t][i] *= cfg.auxW; }
      }
      model.backward(dz, fs, auxList, null, null);
    }
    lastLoss = lsum / 16;
    opt.step(model.params());
  }
  const params = model.params().map((pl) => Array.from(pl.v !== undefined ? pl.v : pl));
  const body = { spec: "teach-v11.1", arm, verdict: "COMPLETE", seed, trainSeed, arch, pure,
    steps: 800, batch: 16, lr: 5e-3, auxW: cfg.auxW, klW: cfg.klW, vhat: cfg.vhat, answer: cfg.answer, pi: cfg.pi || null,
    wallMs: Date.now() - t0, lastLoss: +lastLoss.toFixed(4), params };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("vhat-" + arm + " s=" + seed + " loss=" + body.lastLoss);
  return body;
};
globalThis.runVhatEval = async function (fs, log, arm, seed) {
  const ledgerPath = "src/evidence/decomp/d-teachv11-eval-" + arm + "-s" + seed + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.TeachInit(fs);
  const A = TASKS.assocR;
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-teachv11-" + arm + "-s" + seed + ".json"));
  if (tr.verdict !== "COMPLETE") throw new Error("vhat train missing " + arm + " s" + seed);
  const model = teachRestore(T, G, tr, tr.arch);
  const ad = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-r2-add4-s" + seed + ".json"));
  if (ad.verdict !== "COMPLETE") throw new Error("add4 missing s" + seed);
  const m2 = teachRestore(T, G, { trainSeed: ad.trainSeed, params: ad.params, arch: { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 } }, { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 });
  const a2 = (x) => teachArgmax(Array.from(m2.forward(x, 1).logits));
  const frng = G.makeRng(52400 + seed), srng = G.makeRng(52500 + seed);
  const fwdT = []; for (let i = 0; i < 200; i++) fwdT.push(A.gen(frng, 1 + frng.int(3)));
  const shT = []; for (let i = 0; i < 200; i++) shT.push(teachGenShiftScr(srng));
  const fwF = (x) => Array.from(model.forward(x, 1).logits);
  let fF = 0;
  for (const e of fwdT) if (teachArgmax(fwF(e.x)) === e.y) fF++;
  let scr = 0;
  for (const e of shT) {
    const fw1 = model.forward(e.x, 1);
    if (teachArgmax(Array.from(fw1.cache.posOut[8].logits)) === e.v) scr++;
  }
  let vhits = 0, hits = 0, orcH = 0;
  for (const e of shT) {
    const fw1 = model.forward(e.x, 1);
    const vhat = teachArgmax(Array.from(fw1.cache.posOut[8].logits));
    if (vhat === e.v) vhits++;
    if (a2(e.flat.concat([e.qk, e.k, vhat, 8])) === e.y) hits++;
    if (a2(e.flat.concat([e.qk, e.k, e.v, 8])) === e.y) orcH++;
  }
  const body = { spec: "teach-v11.1", arm, verdict: "COMPLETE", seed, n: 200,
    accFwd: +(fF / fwdT.length).toFixed(4), accScratch: +(scr / shT.length).toFixed(4),
    harness: { accRetrieve: +(vhits / shT.length).toFixed(4), accComposed: +(hits / shT.length).toFixed(4),
      accOracle: +(orcH / shT.length).toFixed(4) } };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("vhat-eval " + arm + " s=" + seed + " scr=" + body.accScratch + " comp=" + body.harness.accComposed);
  return body;
};
