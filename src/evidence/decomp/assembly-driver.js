// src/evidence/decomp/assembly-driver.js — two-fragment assembly (spec assembly-v10).
// Pools: A = key-valued 1-hop (k,m) m in 0..3; B = standard assocR 1-hop.
// Assembly test = decomp 2-hop 2-chain lines (genLine recipe, copied).
globalThis.AssemblyInit = async function (fs) {
  globalThis.window = globalThis;
  const ORDER = ["src/tinynn/nn.js", "src/tinynn/seeded.js", "src/tinynn/tasks.js", "src/tinynn/train.js"];
  for (const p of ORDER) { const src = await fs.readTextFile(p); (0, eval)(src + "\n//# sourceURL=" + p); }
  const G = globalThis.__tinyNN, T = globalThis.TinyNN;
  if (!G || !T || !T.trainModel) throw new Error("assembly stack load failed");
  return { G, T, TASKS: T.TASKS };
};

function argmaxA(a) { let b = 0; for (let i = 1; i < a.length; i++) if (a[i] > a[b]) b = i; return b; }

// Pool A line: 1..3 key-valued pairs, query one key, answer its m (0..3).
function genPoolA(rng) {
  const keys = [0, 1, 2, 3];
  for (let i = keys.length - 1; i > 0; i--) { const j = rng.int(i + 1); const t = keys[i]; keys[i] = keys[j]; keys[j] = t; }
  const n = 1 + rng.int(3);
  const ks = keys.slice(0, n);
  const ms = ks.map(() => rng.int(4));
  const flat = [];
  for (let i = 0; i < n; i++) flat.push(ks[i], ms[i]);
  const qi = rng.int(n);
  return { x: flat.concat([ks[qi], 8]), y: ms[qi] };
}

// Assembly line (decomp genLine recipe, verbatim).
function genAsmLine(rng) {
  const keys = [0, 1, 2, 3];
  for (let i = keys.length - 1; i > 0; i--) { const j = rng.int(i + 1); const t = keys[i]; keys[i] = keys[j]; keys[j] = t; }
  const [a, c, g] = [keys[0], keys[1], keys[2]];
  const m = rng.int(4), d = rng.int(4);
  const e = rng.int(4), f = rng.int(4), h = rng.int(4);
  const pairs = [[a, m], [m, 4 + e], [c, d], [d, 4 + f]];
  if (rng.uniform(0, 1) < 0.5) pairs.push([g, 4 + h]);
  for (let i = pairs.length - 1; i > 0; i--) { const j = rng.int(i + 1); const t = pairs[i]; pairs[i] = pairs[j]; pairs[j] = t; }
  const flat = [];
  for (const [k, v] of pairs) flat.push(k, v);
  return { flat, query: a, mid: m, y: e, x: flat.concat([a, 8]) };
}

const ASM_ARCH = { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 };
const ASM_SEED = { a: 16400, b: 16500, ab: 16600 };
const ASM_RNG = { a: 16000, b: 16100, ab: 16200 };

globalThis.runAsmTrain = async function (fs, log, s, arm) {
  const ledgerPath = "src/evidence/decomp/d-asm-train-" + arm + "-s" + s + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.AssemblyInit(fs);
  const A = TASKS.assocR;
  const rng = G.makeRng(ASM_RNG[arm] + s);
  const train = [];
  if (arm === "a") { for (let i = 0; i < 500; i++) train.push(genPoolA(rng)); }
  else if (arm === "b") { for (let i = 0; i < 500; i++) train.push(A.gen(rng, 1 + rng.int(3))); }
  else { for (let i = 0; i < 250; i++) train.push(genPoolA(rng)); for (let i = 0; i < 250; i++) train.push(A.gen(rng, 1 + rng.int(3))); }
  const t0 = Date.now();
  const out = await T.trainModel(Object.assign({ seed: ASM_SEED[arm] + s, train, steps: 1200,
    batch: 16, lr: 5e-3, attnAux: true, attnAuxW: 1.0,
    prefixLabels: (x) => A.bindLabels(x), auxW: 1.0 }, ASM_ARCH));
  const wallMs = Date.now() - t0;
  // own-fragment quick test (gate preview; formal gates in eval)
  const trng = G.makeRng(16700 + s);
  const own = [];
  if (arm === "a" || arm === "ab") for (let i = 0; i < 200; i++) own.push(genPoolA(trng));
  else for (let i = 0; i < 200; i++) own.push(A.gen(trng, 1 + trng.int(3)));
  const ev = T.evaluate(out.model, own, 1);
  const params = out.model.params().map((p) => Array.from(p.v !== undefined ? p.v : p));
  const ledger = { spec: "assembly-v10", seed: s, arm, verdict: "COMPLETE",
    ownTestAcc: +ev.acc.toFixed(4), wallMs,
    arch: ASM_ARCH, trainSeed: ASM_SEED[arm] + s, params };
  await fs.writeTextFile(ledgerPath, JSON.stringify(ledger));
  log("asm-train-" + arm + "-s" + s + " own=" + ledger.ownTestAcc);
  return ledger;
};

function asmRestore(T, G, tut) {
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

globalThis.runAsmEval = async function (fs, log, s, arm) {  const ledgerPath = "src/evidence/decomp/d-asm-eval-" + arm + "-s" + s + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.AssemblyInit(fs);
  const A = TASKS.assocR;
  const tut = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-asm-train-" + arm + "-s" + s + ".json"));
  const model = asmRestore(T, G, tut);
  const fw = (x) => argmaxA(Array.from(model.forward(x, 1).logits));
  // fragment gates (fresh)
  const grng = G.makeRng(16800 + s);
  const aTest = [], bTest = [];
  for (let i = 0; i < 200; i++) aTest.push(genPoolA(grng));
  for (let i = 0; i < 200; i++) bTest.push(A.gen(grng, 1 + grng.int(3)));
  const accA = aTest.filter((ex) => fw(ex.x) === ex.y).length / 200;
  const accB = bTest.filter((ex) => fw(ex.x) === ex.y).length / 200;
  let gate;
  if (arm === "a") gate = accA >= 0.60 ? "PASS" : "FAIL";
  else if (arm === "b") gate = accB >= 0.60 ? "PASS" : "FAIL";
  else gate = (accA >= 0.50 && accB >= 0.50) ? "PASS" : "FAIL";
  // assembly battery
  const rng = G.makeRng(16300 + s);
  const N = 240;
  let direct = 0, d1 = 0, sub1 = 0, oracle = 0, sub1okN = 0, d1givenOk = 0;
  for (let i = 0; i < N; i++) {
    const L = genAsmLine(rng);
    const oD = fw(L.flat.concat([L.query, 8]));
    if (oD === L.y) direct++;
    const m1 = fw(L.flat.concat([L.query, 8]));
    if (m1 === L.mid) { sub1++; sub1okN++; }
    const o2 = fw(L.flat.concat([m1, 8]));
    if (o2 === L.y) { d1++; if (m1 === L.mid) d1givenOk++; }
    if (fw(L.flat.concat([L.mid, 8])) === L.y) oracle++;
  }
  const body = { spec: "assembly-v10", seed: s, arm, verdict: "COMPLETE", n: N,
    gates: { aTest: +accA.toFixed(4), bTest: +accB.toFixed(4), gate },
    asm: { direct: +(direct / N).toFixed(4), decomp1: +(d1 / N).toFixed(4),
      sub1mid: +(sub1 / N).toFixed(4), oracleFollow: +(oracle / N).toFixed(4),
      decomp1givenSub1ok: sub1okN ? +(d1givenOk / sub1okN).toFixed(4) : null } };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("asm-eval-" + arm + "-s" + s + " gate=" + gate + " direct=" + body.asm.direct + " d1=" + body.asm.decomp1 + " sub1=" + body.asm.sub1mid + " orac=" + body.asm.oracleFollow);
  return body;
};

// ---- assembly-v11: hard lines with decoy doubled chains. ----
// True chain (a->m, m->4+e) + 2 decoy chains (ci->di, di->4+fi) [+ 50% plain].
// Query-key a appears as pair-key exactly once; mid m as pair-key exactly once.
function genHardLine(rng) {
  const keys = [0, 1, 2, 3];
  for (let i = keys.length - 1; i > 0; i--) { const j = rng.int(i + 1); const t = keys[i]; keys[i] = keys[j]; keys[j] = t; }
  const [a, c1, c2, g] = keys;
  const m = rng.int(4), d1 = rng.int(4), d2 = rng.int(4);
  const e = rng.int(4), f1 = rng.int(4), f2 = rng.int(4), h = rng.int(4);
  const pairs = [[a, m], [m, 4 + e], [c1, d1], [d1, 4 + f1], [c2, d2], [d2, 4 + f2]];
  if (rng.uniform(0, 1) < 0.5) pairs.push([g, 4 + h]);
  for (let i = pairs.length - 1; i > 0; i--) { const j = rng.int(i + 1); const t = pairs[i]; pairs[i] = pairs[j]; pairs[j] = t; }
  const flat = [];
  for (const [k, v] of pairs) flat.push(k, v);
  return { flat, query: a, mid: m, y: e, alt: c1, x: flat.concat([a, 8]) };
}

globalThis.runAsm11Eval = async function (fs, log, s, arm) {
  const ledgerPath = "src/evidence/decomp/d-asm11-eval-" + arm + "-s" + s + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.AssemblyInit(fs);
  const tut = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-asm-train-" + arm + "-s" + s + ".json"));
  if (tut.verdict !== "COMPLETE") {
    const ab = { spec: "assembly-v11", seed: s, arm, verdict: "ABORT", reason: "train gated" };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab;
  }
  const model = asmRestore(T, G, tut);
  const fw = (x) => argmaxA(Array.from(model.forward(x, 1).logits));
  const rng = G.makeRng(16900 + s);
  const N = 240;
  let direct = 0, d1 = 0, sub1 = 0, oracle = 0, sub1okN = 0, d1givenOk = 0, sens = 0;
  for (let i = 0; i < N; i++) {
    const L = genHardLine(rng);
    if (fw(L.flat.concat([L.query, 8])) === L.y) direct++;
    const m1 = fw(L.flat.concat([L.query, 8]));
    if (m1 === L.mid) { sub1++; sub1okN++; }
    const o2 = fw(L.flat.concat([m1, 8]));
    if (o2 === L.y) { d1++; if (m1 === L.mid) d1givenOk++; }
    if (fw(L.flat.concat([L.mid, 8])) === L.y) oracle++;
    if (m1 !== fw(L.flat.concat([L.alt, 8]))) sens++;
  }
  const body = { spec: "assembly-v11", seed: s, arm, verdict: "COMPLETE", n: N,
    asm: { direct: +(direct / N).toFixed(4), decomp1: +(d1 / N).toFixed(4),
      sub1mid: +(sub1 / N).toFixed(4), oracleFollow: +(oracle / N).toFixed(4),
      decomp1givenSub1ok: sub1okN ? +(d1givenOk / sub1okN).toFixed(4) : null,
      querySensitivity: +(sens / N).toFixed(4) } };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("asm11-" + arm + "-s" + s + " direct=" + body.asm.direct + " d1=" + body.asm.decomp1 + " sub1=" + body.asm.sub1mid + " orac=" + body.asm.oracleFollow + " sens=" + body.asm.querySensitivity);
  return body;
};

// ---- probe-v10: occlusion + counterfactuals on hard lines. ----
function genProbeLine(rng) {
  const keys = [0, 1, 2, 3];
  for (let i = keys.length - 1; i > 0; i--) { const j = rng.int(i + 1); const t = keys[i]; keys[i] = keys[j]; keys[j] = t; }
  const [a, c1, c2, g] = keys;
  const m = rng.int(4), d1 = rng.int(4), d2 = rng.int(4);
  const e = rng.int(4), f1 = rng.int(4), f2 = rng.int(4), h = rng.int(4);
  const pairs = [[a, m], [m, 4 + e], [c1, d1], [d1, 4 + f1], [c2, d2], [d2, 4 + f2]];
  if (rng.uniform(0, 1) < 0.5) pairs.push([g, 4 + h]);
  for (let i = pairs.length - 1; i > 0; i--) { const j = rng.int(i + 1); const t = pairs[i]; pairs[i] = pairs[j]; pairs[j] = t; }
  return { pairs, query: a, mid: m, y: e, c1, f1 };
}
function flatWithout(pairs, drop) {
  // drop: list of [k,v]; remove first matching occurrence of each
  const rest = pairs.slice();
  for (const d of drop) {
    const i = rest.findIndex((p) => p[0] === d[0] && p[1] === d[1]);
    if (i >= 0) rest.splice(i, 1);
  }
  const flat = [];
  for (const [k, v] of rest) flat.push(k, v);
  return flat;
}
globalThis.runProbeEval = async function (fs, log, s, arm) {  const ledgerPath = "src/evidence/decomp/d-probe-" + arm + "-s" + s + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T } = await globalThis.AssemblyInit(fs);
  const tut = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-asm-train-" + arm + "-s" + s + ".json"));
  if (tut.verdict !== "COMPLETE") {
    const ab = { spec: "probe-v10", seed: s, arm, verdict: "ABORT", reason: "train gated" };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab;
  }
  const model = asmRestore(T, G, tut);
  const fw = (x) => argmaxA(Array.from(model.forward(x, 1).logits));
  const rng = G.makeRng(17000 + s);
  const N = 240;
  let base = 0, occSrc = 0, occStep1 = 0, occDecoy = 0, swap = 0, decoyQ = 0;
  for (let i = 0; i < N; i++) {
    const L = genProbeLine(rng);
    const full = flatWithout(L.pairs, []);
    if (fw(full.concat([L.query, 8])) === L.y) base++;
    if (fw(flatWithout(L.pairs, [[L.mid, 4 + L.y]]).concat([L.query, 8])) === L.y) occSrc++;
    if (fw(flatWithout(L.pairs, [[L.query, L.mid]]).concat([L.query, 8])) === L.y) occStep1++;
    if (fw(flatWithout(L.pairs, [[L.c1, L.pairs.find((p) => p[0] === L.c1)[1]], [L.pairs.find((p) => p[0] === L.c1)[1], 4 + L.f1]]).concat([L.query, 8])) === L.y) occDecoy++;
    const mp = (L.mid + 2) % 4;
    const swapped = L.pairs.map((p) => {
      if (p[0] === L.query && p[1] === L.mid) return [L.query, mp];
      if (p[0] === L.mid && p[1] === 4 + L.y) return [mp, 4 + L.y];
      return p;
    });
    if (fw(flatWithout(swapped, []).concat([L.query, 8])) === L.y) swap++;
    if (fw(full.concat([L.c1, 8])) === L.f1) decoyQ++;
  }
  const body = { spec: "probe-v10", seed: s, arm, verdict: "COMPLETE", n: N,
    probe: { base: +(base / N).toFixed(4), occSrc: +(occSrc / N).toFixed(4),
      occStep1: +(occStep1 / N).toFixed(4), occDecoy: +(occDecoy / N).toFixed(4),
      swapChain: +(swap / N).toFixed(4), decoyQuery: +(decoyQ / N).toFixed(4) } };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("probe-" + arm + "-s" + s + " " + JSON.stringify(body.probe));
  return body;
};

// ---- probe-v11: degeneracy-conditional battery (N=400, fresh rng). ----
globalThis.runProbe11Eval = async function (fs, log, s, arm) {
  const ledgerPath = "src/evidence/decomp/d-probe11-" + arm + "-s" + s + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T } = await globalThis.AssemblyInit(fs);
  const tut = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-asm-train-" + arm + "-s" + s + ".json"));
  if (tut.verdict !== "COMPLETE") {
    const ab = { spec: "probe-v11", seed: s, arm, verdict: "ABORT", reason: "train gated" };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab;
  }
  const model = asmRestore(T, G, tut);
  const fw = (x) => argmaxA(Array.from(model.forward(x, 1).logits));
  const rng = G.makeRng(17100 + s);
  const N = 400;
  const R = { n: 0, nDegA: 0, nDegC: 0, baseA: 0, baseC: 0, occA: 0,
    baseAdeg: 0, baseAnon: 0, occAdeg: 0, occAnon: 0, baseCdeg: 0, baseCnon: 0 };
  for (let i = 0; i < N; i++) {
    const L = genProbeLine(rng);
    const full = flatWithout(L.pairs, []);
    const degA = L.query === L.mid, degC = L.c1 === L.pairs.find((p) => p[0] === L.c1)[1];
    const bA = fw(full.concat([L.query, 8])) === L.y ? 1 : 0;
    const bC = fw(full.concat([L.c1, 8])) === L.f1 ? 1 : 0;
    const oA = fw(flatWithout(L.pairs, [[L.query, L.mid]]).concat([L.query, 8])) === L.y ? 1 : 0;
    R.n++;
    if (degA) { R.nDegA++; R.baseAdeg += bA; R.occAdeg += oA; }
    else { R.baseAnon += bA; R.occAnon += oA; }
    if (degC) { R.nDegC++; R.baseCdeg += bC; } else { R.baseCnon += bC; }
    R.baseA += bA; R.baseC += bC; R.occA += oA;
  }
  const d = (x, n) => n ? +(x / n).toFixed(4) : null;
  const body = { spec: "probe-v11", seed: s, arm, verdict: "COMPLETE", n: R.n,
    degRateA: d(R.nDegA, R.n), degRateC: d(R.nDegC, R.n),
    overall: { baseA: d(R.baseA, R.n), baseC: d(R.baseC, R.n), occA: d(R.occA, R.n) },
    condA: { baseDeg: d(R.baseAdeg, R.nDegA), baseNon: d(R.baseAnon, R.n - R.nDegA),
      occDeg: d(R.occAdeg, R.nDegA), occNon: d(R.occAnon, R.n - R.nDegA) },
    condC: { baseDeg: d(R.baseCdeg, R.nDegC), baseNon: d(R.baseCnon, R.n - R.nDegC) } };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("probe11-" + arm + "-s" + s + " degA=" + body.degRateA + " base=" + body.overall.baseA + " baseNon=" + body.condA.baseNon + " occNon=" + body.condA.occNon + " occDeg=" + body.condA.occDeg);
  return body;
};

// ---- repeats-v10 (R=3 rollups) + trace-v10 (white-box) ----
function meanArr(a) { return a.reduce((x, y) => x + y, 0) / a.length; }
function rollupNums(reps) {
  const mean = {}, spread = {};
  for (const k of Object.keys(reps[0])) {
    const v = reps.map((r) => r[k]);
    if (typeof v[0] === "number") {
      mean[k] = +(v.reduce((x, y) => x + y, 0) / v.length).toFixed(4);
      spread[k] = +(Math.max(...v) - Math.min(...v)).toFixed(4);
    }
  }
  return { reps, mean, spread };
}
function probeRoll(fw, rng, N) {
  let base = 0, occSrc = 0, occStep1 = 0, occDecoy = 0, swap = 0, decoyQ = 0;
  for (let i = 0; i < N; i++) {
    const L = genProbeLine(rng);
    const full = flatWithout(L.pairs, []);
    if (fw(full.concat([L.query, 8])) === L.y) base++;
    if (fw(flatWithout(L.pairs, [[L.mid, 4 + L.y]]).concat([L.query, 8])) === L.y) occSrc++;
    if (fw(flatWithout(L.pairs, [[L.query, L.mid]]).concat([L.query, 8])) === L.y) occStep1++;
    const d1v = L.pairs.find((p) => p[0] === L.c1)[1];
    if (fw(flatWithout(L.pairs, [[L.c1, d1v], [d1v, 4 + L.f1]]).concat([L.query, 8])) === L.y) occDecoy++;
    const mp = (L.mid + 2) % 4;
    const sw = L.pairs.map((p) => {
      if (p[0] === L.query && p[1] === L.mid) return [L.query, mp];
      if (p[0] === L.mid && p[1] === 4 + L.y) return [mp, 4 + L.y];
      return p;
    });
    if (fw(flatWithout(sw, []).concat([L.query, 8])) === L.y) swap++;
    if (fw(full.concat([L.c1, 8])) === L.f1) decoyQ++;
  }
  const d = (x) => +(x / N).toFixed(4);
  return { base: d(base), occSrc: d(occSrc), occStep1: d(occStep1), occDecoy: d(occDecoy), swapChain: d(swap), decoyQuery: d(decoyQ) };
}
function probe11Roll(fw, rng, N) {
  let nDegA = 0, bAdeg = 0, bAnon = 0, oAdeg = 0, oAnon = 0;
  for (let i = 0; i < N; i++) {
    const L = genProbeLine(rng);
    const full = flatWithout(L.pairs, []);
    const degA = L.query === L.mid;
    const bA = fw(full.concat([L.query, 8])) === L.y ? 1 : 0;
    const oA = fw(flatWithout(L.pairs, [[L.query, L.mid]]).concat([L.query, 8])) === L.y ? 1 : 0;
    if (degA) { nDegA++; bAdeg += bA; oAdeg += oA; } else { bAnon += bA; oAnon += oA; }
  }
  const d = (x, n) => n ? +(x / n).toFixed(4) : null;
  return { degRateA: d(nDegA, N), baseNon: d(bAnon, N - nDegA), occNon: d(oAnon, N - nDegA),
    baseDeg: d(bAdeg, nDegA), occDeg: d(oAdeg, nDegA) };
}
function asm11Roll(fw, rng, N) {
  let direct = 0, d1 = 0, sub1 = 0, oracle = 0, sub1okN = 0, d1givenOk = 0, sens = 0;
  for (let i = 0; i < N; i++) {
    const L = genHardLine(rng);
    if (fw(L.flat.concat([L.query, 8])) === L.y) direct++;
    const m1 = fw(L.flat.concat([L.query, 8]));
    if (m1 === L.mid) { sub1++; sub1okN++; }
    const o2 = fw(L.flat.concat([m1, 8]));
    if (o2 === L.y) { d1++; if (m1 === L.mid) d1givenOk++; }
    if (fw(L.flat.concat([L.mid, 8])) === L.y) oracle++;
    if (m1 !== fw(L.flat.concat([L.alt, 8]))) sens++;
  }
  const d = (x) => +(x / N).toFixed(4);
  return { direct: d(direct), decomp1: d(d1), sub1mid: d(sub1), oracleFollow: d(oracle),
    sens: d(sens), d1givenOk: sub1okN ? d(d1givenOk * N / sub1okN) : null };
}
async function repRun(fs, log, kind, s, arm, N, base0, ledgerPrefix, spec) {
  const ledgerPath = "src/evidence/decomp/d-" + ledgerPrefix + "-R-" + arm + "-s" + s + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T } = await globalThis.AssemblyInit(fs);
  const tut = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-asm-train-" + arm + "-s" + s + ".json"));
  const model = asmRestore(T, G, tut);
  const fw = (x) => argmaxA(Array.from(model.forward(x, 1).logits));
  const reps = [];
  for (let r = 0; r < 3; r++) {
    const rng = G.makeRng(base0 + s + r * 500);
    reps.push(kind === "probe" ? probeRoll(fw, rng, N) : kind === "probe11" ? probe11Roll(fw, rng, N) : asm11Roll(fw, rng, N));
  }
  const body = Object.assign({ spec, seed: s, arm, verdict: "COMPLETE", R: 3, N }, rollupNums(reps.filter((x) => true).map((r) => { const o = {}; for (const k of Object.keys(r)) if (typeof r[k] === "number") o[k] = r[k]; return o; })));
  body.reps = reps;
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log(ledgerPrefix + "-R-" + arm + "-s" + s + " mean=" + JSON.stringify(body.mean));
  return body;
}
globalThis.runProbeEvalR = (fs, log, s, arm) => repRun(fs, log, "probe", s, arm, 240, 17000, "probe", "repeats-v10");
globalThis.runProbe11EvalR = (fs, log, s, arm) => repRun(fs, log, "probe11", s, arm, 400, 17100, "probe11", "repeats-v10");
globalThis.runAsm11EvalR = (fs, log, s, arm) => repRun(fs, log, "asm11", s, arm, 240, 16900, "asm11", "repeats-v10");
// ---- trace-v10 core ----
function flatRoles(pairs, q, m, y) {
  const flat = [], roles = [];
  for (const [k, v] of pairs) {
    flat.push(k, v);
    if (k === q && v === m) { roles.push("trueOther", "trueOther"); }
    else if (k === m && v === 4 + y) { roles.push("srcKey", "srcVal"); }
    else { roles.push("other", "other"); }
  }
  return { flat, roles };
}
function traceStats(fwCache, x, roles) {
  const steps = fwCache.cache.steps;
  const dep = steps.find((s) => s.isDepth);
  const w = Array.from(dep.att.w);
  let pStar = 0;
  for (let i = 1; i < w.length; i++) if (w[i] > w[pStar]) pStar = i;
  let ent = 0;
  for (let i = 0; i < w.length; i++) if (w[i] > 1e-12) ent -= w[i] * Math.log(w[i]);
  return { pStar, wStar: w[pStar], ent, role: roles[pStar] };
}
function traceRoll(model, rng, N) {
  const agg = { n: 0, ok: 0, srcOk: 0, srcValOk: 0, entOk: 0, entBad: 0, qTrue: 0, qSrcBase: 0, qMark: 0, dMark: 0, dQuery: 0, wStarSum: 0 };
  const aggOcc = { n: 0, ok: 0, srcOk: 0, entOk: 0, qMark: 0, qSrcOcc: 0 };
  for (let i = 0; i < N; i++) {
    const L = genProbeLine(rng);
    for (const cond of ["base", "occ"]) {
      const prs = cond === "base" ? L.pairs : L.pairs.filter((p) => !(p[0] === L.query && p[1] === L.mid));
      const fr = flatRoles(prs, L.query, L.mid, L.y);
      const x = fr.flat.concat([L.query, 8]);
      const rls = fr.roles.concat(["query", "Qmark"]);
      const fwd = model.forward(x, 1);
      const out = argmaxA(Array.from(fwd.logits));
      const good = out === L.y ? 1 : 0;
      const tr = traceStats(fwd, x, rls);
      const A = cond === "base" ? agg : aggOcc;
      A.n++; A.ok += good; A.wStarSum += tr.wStar;
      if (good) { A.entOk += tr.ent; if (tr.role === "srcKey" || tr.role === "srcVal") A.srcOk++; }
      else if (cond === "base") A.entBad += tr.ent;
      if (tr.role === "Qmark") A.qMark++;
      if (cond === "base" && tr.role === "query" && A.dQuery !== undefined) A.dQuery++;
      const qp = x.length - 2;
      const patt = fwd.cache.steps[qp].att;
      if (patt) {
        const pw = Array.from(patt.w);
        let pa = 0;
        for (let j = 1; j < pw.length; j++) if (pw[j] > pw[pa]) pa = j;
        const qr = rls[pa];
        if (cond === "base") {
          if (qr === "trueOther" || qr === "srcKey" || qr === "srcVal") A.qTrue++;
          if (qr === "srcKey" || qr === "srcVal") A.qSrcBase++;
        } else {
          if (qr === "srcKey" || qr === "srcVal") A.qSrcOcc++;
        }
      }
    }
  }
  const d = (x, n) => n ? +(x / n).toFixed(4) : null;
  return {
    baseAcc: d(agg.ok, agg.n), srcGivenOk: d(agg.srcOk, agg.ok),
    entOk: d(agg.entOk, agg.ok), entBad: d(agg.entBad, agg.n - agg.ok),
    qTrueRate: d(agg.qTrue, agg.n), qSrcBaseRate: d(agg.qSrcBase, agg.n), qMarkRate: d(agg.qMark, agg.n),
    dQueryRate: d(agg.dQuery, agg.n), wStar: d(agg.wStarSum, agg.n),
    occAcc: d(aggOcc.ok, aggOcc.n), occSrcGivenOk: d(aggOcc.srcOk, aggOcc.ok),
    occEntOk: d(aggOcc.entOk, aggOcc.ok), occQMark: d(aggOcc.qMark, aggOcc.n),
    occQSrcRate: d(aggOcc.qSrcOcc, aggOcc.n)
  };
}
globalThis.runTraceEval = async function (fs, log, s, arm) {
  const ledgerPath = "src/evidence/decomp/d-trace-" + arm + "-s" + s + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T } = await globalThis.AssemblyInit(fs);
  const tut = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-asm-train-" + arm + "-s" + s + ".json"));
  const model = asmRestore(T, G, tut);
  const reps = [];
  for (let r = 0; r < 3; r++) reps.push(traceRoll(model, G.makeRng(17200 + s + r * 500), 200));  const nums = reps.map((r) => { const o = {}; for (const k of Object.keys(r)) if (typeof r[k] === "number") o[k] = r[k]; return o; });
  const body = Object.assign({ spec: "trace-v10", seed: s, arm, verdict: "COMPLETE", R: 3, N: 200 }, rollupNums(nums));
  body.reps = reps;
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("trace-" + arm + "-s" + s + " mean=" + JSON.stringify(body.mean));
  return body;
};

globalThis.runFocusEval = async function (fs, log, s, arm) {
  const ledgerPath = "src/evidence/decomp/d-focus-" + arm + "-s" + s + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T } = await globalThis.AssemblyInit(fs);
  const tut = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-asm-train-" + arm + "-s" + s + ".json"));
  if (tut.verdict !== "COMPLETE") {
    const ab = { spec: "focus-v10", seed: s, arm, verdict: "ABORT", reason: "train gated" };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab;
  }
  const model = asmRestore(T, G, tut);
  const outOf = (f) => { const a = Array.from(f.logits); let b = 0; for (let i = 1; i < a.length; i++) if (a[i] > a[b]) b = i; return b; };
  function focusKey(fwd, flatLen, pairs) {
    const qp = flatLen;
    const st = fwd.cache.steps[qp];
    if (!st || !st.att) return null;
    const w = Array.from(st.att.w);
    let p = 0;
    for (let j = 1; j < w.length; j++) if (w[j] > w[p]) p = j;
    if (p >= flatLen) return null;
    const pairIdx = Math.floor(p / 2);
    if (pairIdx < 0 || pairIdx >= pairs.length) return null;
    return { kF: pairs[pairIdx][0], p };
  }
  const reps = [];
  for (let r = 0; r < 3; r++) {
    const rng = G.makeRng(17300 + s + r * 500);
    const N = 300;
    let direct = 0, d1 = 0, f1 = 0, kFaith = 0, noopN = 0, diss = 0, f1dis = 0, d1dis = 0, f1noop = 0, f1gen = 0, genN = 0;
    for (let i = 0; i < N; i++) {
      const L = genProbeLine(rng);
      const flat = flatWithout(L.pairs, []);
      const Fa = model.forward(flat.concat([L.query, 8]), 1);
      const oD = outOf(Fa);
      if (oD === L.y) direct++;
      const m1 = oD;
      const o2 = outOf(model.forward(flat.concat([m1, 8]), 1));
      if (o2 === L.y) d1++;
      const fk = focusKey(Fa, flat.length, L.pairs);
      if (fk === null) continue;
      if (fk.kF === L.query || fk.kF === L.mid) kFaith++;
      const oF = outOf(model.forward(flat.concat([fk.kF, 8]), 1));
      if (oF === L.y) f1++;
      if (fk.kF === L.query) { noopN++; if (oF === L.y) f1noop++; }
      else { genN++; if (oF === L.y) f1gen++; }
      if (fk.kF !== m1) { diss++; if (oF === L.y) f1dis++; if (o2 === L.y) d1dis++; }
    }
    const d = (x, n) => n ? +(x / n).toFixed(4) : null;
    reps.push({ direct: d(direct, N), decomp1: d(d1, N), focus1: d(f1, N),
      lift: +((f1 - d1) / N).toFixed(4), kFaith: d(kFaith, N), noopRate: d(noopN, N),
      focusGen: d(f1gen, genN), dissRate: d(diss, N),
      focusDis: d(f1dis, diss), decompDis: d(d1dis, diss) });
  }
  const nums = reps.map((x) => { const o = {}; for (const k of Object.keys(x)) if (typeof x[k] === "number") o[k] = x[k]; return o; });
  const body = Object.assign({ spec: "focus-v10", seed: s, arm, verdict: "COMPLETE", R: 3, N: 300 }, rollupNums(nums));
  body.reps = reps;
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("focus-" + arm + "-s" + s + " mean=" + JSON.stringify(body.mean));
  return body;
};
