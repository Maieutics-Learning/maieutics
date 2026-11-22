// src/evidence/decomp/decomp-driver.js — decomposition + re-decomposition (spec decomp-v10).
// Stack-load pattern from p4-toy.js. Train attn tutor on 1-hop assocR, then run
// DIRECT / DECOMP-1 / STAY / SWITCH / FORCE arms on 2-hop 2-chain lines.
// Filed choices: readout round r=1 (evo.js precedent); margin on raw logits.
globalThis.DecompInit = async function (fs) {
  globalThis.window = globalThis;
  const ORDER = ["src/tinynn/nn.js", "src/tinynn/seeded.js", "src/tinynn/tasks.js", "src/tinynn/train.js"];
  for (const p of ORDER) { const src = await fs.readTextFile(p); (0, eval)(src + "\n//# sourceURL=" + p); }
  const G = globalThis.__tinyNN, T = globalThis.TinyNN;
  if (!G || !T || !T.trainModel) throw new Error("decomp stack load failed");
  return { G, T, TASKS: T.TASKS };
};

function argmax2(logits) {
  let b0 = 0, b1 = 1;
  if (logits[1] > logits[0]) { b0 = 1; b1 = 0; }
  for (let i = 2; i < logits.length; i++) {
    if (logits[i] > logits[b0]) { b1 = b0; b0 = i; }
    else if (logits[i] > logits[b1]) b1 = i;
  }
  return { top: b0, second: b1, margin: logits[b0] - logits[b1] };
}

// Line: chains (a->m, m->e) + (c->d, d->f) [+ (g,h)], shuffled pairs, query a.
function genLine(rng) {
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
  return { flat, query: a, mid: m, y: e, chainC: c, x: flat.concat([a, 8]) };
}

globalThis.runDecompTutor = async function (fs, log, s) {
  const ledgerPath = "src/evidence/decomp/d-tutor-s" + s + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log("d-tutor-s" + s + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.DecompInit(fs);
  const A = TASKS.assocR;
  const rng = G.makeRng(13000 + s);
  const train = [];
  for (let i = 0; i < 500; i++) train.push(A.gen(rng, 1 + rng.int(3)));
  const t0 = Date.now();
  const out = await T.trainModel({ seed: 13100 + s, arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4,
    train, steps: 1200, batch: 16, lr: 5e-3, attnAux: true, attnAuxW: 1.0,
    prefixLabels: (x) => A.bindLabels(x), auxW: 1.0 });
  const wallMs = Date.now() - t0;
  const model = out.model;
  const test = [];
  const trng = G.makeRng(13200 + s);
  for (let i = 0; i < 200; i++) test.push(A.gen(trng, 1 + trng.int(3)));
  const ev = T.evaluate(model, test, 1);
  // serialize attn model params for reuse (weights as plain arrays)
  const params = model.params().map((p) => Array.from(p.v !== undefined ? p.v : p));
  const ledger = { spec: "decomp-v10", seed: s, verdict: ev.acc >= 0.60 ? "COMPLETE" : "ABORT",
    gate: ev.acc >= 0.60 ? "PASS" : "FAIL", testAcc: +ev.acc.toFixed(4),
    train: { firstLoss: +out.firstLoss.toFixed(4), lastLoss: +out.lastLoss.toFixed(4) }, wallMs,
    arch: { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 }, trainSeed: 13100 + s, params };
  await fs.writeTextFile(ledgerPath, JSON.stringify(ledger));
  log("d-tutor-s" + s + " acc=" + ledger.testAcc + " " + ledger.gate);
  return ledger;
};

function restoreTutor(T, G, tut) {
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

globalThis.runDecompEval = async function (fs, log, s) {  const ledgerPath = "src/evidence/decomp/d-eval-s" + s + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log("d-eval-s" + s + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T } = await globalThis.DecompInit(fs);
  const tut = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-tutor-s" + s + ".json"));
  if (tut.verdict !== "COMPLETE") {
    const ab = { spec: "decomp-v10", seed: s, verdict: "ABORT", reason: "tutor gated" };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab;
  }
  const model = restoreTutor(T, G, tut);
  const Q = 8;
  const sq = (flat, k) => {
    const fw = model.forward(flat.concat([k, Q]), 1);
    const a = argmax2(Array.from(fw.logits));
    return a;
  };
  const rng = G.makeRng(13300 + s);
  // calibration split: tau = 33rd pct of sub1 margins
  const cal = [];
  for (let i = 0; i < 120; i++) cal.push(genLine(rng));
  const calMargins = cal.map((L) => sq(L.flat, L.query).margin).sort((a, b) => a - b);
  const tau = calMargins[Math.floor(0.33 * calMargins.length)];
  // test split
  const lines = [];
  for (let i = 0; i < 240; i++) lines.push(genLine(rng));
  let sub1hit = 0, directHit = 0, d1Hit = 0, stayHit = 0, switchHit = 0, forceHit = 0;
  let fired = 0, firedWrong = 0, firedFixed = 0, switchStayDiffSum = 0;
  for (const L of lines) {
    const d = sq(L.flat, L.query);
    const directOk = d.top === L.y ? 1 : 0; directHit += directOk;
    const s1 = sq(L.flat, L.query);
    if (s1.top === L.mid) sub1hit++;
    const s2 = sq(L.flat, s1.top);
    const d1Ok = s2.top === L.y ? 1 : 0; d1Hit += d1Ok;
    const critic = s1.margin < tau;
    // fallback list
    const fb = [];
    const r1 = sq(L.flat, s1.second); fb.push(r1.top === L.y ? 1 : 0);
    fb.push(directOk);
    const oc1 = sq(L.flat, L.chainC);
    const oc2 = sq(L.flat, oc1.top); fb.push(oc2.top === L.y ? 1 : 0);
    // SWITCH: first fallback whose OWN final margin clears tau, else stay
    let switchOk = d1Ok, usedFb = -1;
    if (critic) {
      fired++;
      if (!d1Ok) firedWrong++;
      const cands = [
        { ok: fb[0], m: sq(L.flat, s1.second).margin },
        { ok: fb[1], m: d.margin },
        { ok: fb[2], m: oc2.margin },
      ];
      for (let i = 0; i < 3; i++) if (cands[i].m >= tau) { switchOk = cands[i].ok; usedFb = i; break; }
      if (usedFb < 0) switchOk = d1Ok;
      if (switchOk && !d1Ok) firedFixed++;
      switchStayDiffSum += switchOk - d1Ok;
    }
    stayHit += d1Ok;
    switchHit += switchOk;
    // FORCE: fallback result always (same rule, critic ignored)
    const candsF = [
      { ok: fb[0], m: sq(L.flat, s1.second).margin },
      { ok: fb[1], m: d.margin },
      { ok: fb[2], m: oc2.margin },
    ];
    let forceOk = d1Ok;
    for (let i = 0; i < 3; i++) if (candsF[i].m >= tau) { forceOk = candsF[i].ok; break; }
    forceHit += forceOk;
  }
  const n = lines.length;
  const ledger = { spec: "decomp-v10", seed: s, verdict: "COMPLETE", tau: +tau.toFixed(4),
    n, acc: { direct: +(directHit / n).toFixed(4), decomp1: +(d1Hit / n).toFixed(4),
      stay: +(stayHit / n).toFixed(4), switch: +(switchHit / n).toFixed(4), force: +(forceHit / n).toFixed(4) },
    b1: { sub1midRate: +(sub1hit / n).toFixed(4), chance: 0.25 },
    b2: { fired, switchMinusStay: fired ? +(switchStayDiffSum / fired).toFixed(4) : null,
      firedWrongRate: fired ? +(firedWrong / fired).toFixed(4) : null,
      firedFixedRate: fired ? +(firedFixed / fired).toFixed(4) : null },
    q1: { decomp1MinusDirect: +((d1Hit - directHit) / n).toFixed(4) } };
  await fs.writeTextFile(ledgerPath, JSON.stringify(ledger));
  log("d-eval-s" + s + " " + JSON.stringify(ledger.acc) + " b1=" + ledger.b1.sub1midRate + " b2=" + ledger.b2.switchMinusStay + " fired=" + fired);
  return ledger;
};

// ---- scale ladder (spec decomp-scale-v10): single-chain lines, h-param tutors,
// shared eval/diag cores. Filed v10 functions above are untouched. ----
function genLineMode(rng, mode) {
  if (!mode || mode === "dual") { const L = genLine(rng); L.alt = L.chainC; return L; }
  const keys = [0, 1, 2, 3];
  for (let i = keys.length - 1; i > 0; i--) { const j = rng.int(i + 1); const t = keys[i]; keys[i] = keys[j]; keys[j] = t; }
  const a = keys[0], g = keys[1], iv = keys[2];
  const m = rng.int(4), e = rng.int(4), h1 = rng.int(4), h2 = rng.int(4);
  const pairs = [[a, m], [m, 4 + e], [g, 4 + h1], [iv, 4 + h2]];
  for (let i = pairs.length - 1; i > 0; i--) { const j = rng.int(i + 1); const t = pairs[i]; pairs[i] = pairs[j]; pairs[j] = t; }
  const flat = [];
  for (const [k, v] of pairs) flat.push(k, v);
  return { flat, query: a, mid: m, y: e, chainC: null, alt: g, x: flat.concat([a, 8]) };
}

function evalArmsWith(model, calLines, testLines, spec, seed) {
  const Q = 8;
  const sq = (flat, k) => {
    const fw = model.forward(flat.concat([k, Q]), 1);
    return argmax2(Array.from(fw.logits));
  };
  const calMargins = calLines.map((L) => sq(L.flat, L.query).margin).sort((a, b) => a - b);
  const tau = calMargins[Math.floor(0.33 * calMargins.length)];
  let sub1hit = 0, directHit = 0, d1Hit = 0, switchHit = 0, forceHit = 0;
  let fired = 0, firedWrong = 0, firedFixed = 0, switchStayDiffSum = 0;
  for (const L of testLines) {
    const d = sq(L.flat, L.query);
    const directOk = d.top === L.y ? 1 : 0; directHit += directOk;
    const s1 = sq(L.flat, L.query);
    if (s1.top === L.mid) sub1hit++;
    const s2 = sq(L.flat, s1.top);
    const d1Ok = s2.top === L.y ? 1 : 0; d1Hit += d1Ok;
    const critic = s1.margin < tau;
    const fb = [{ ok: sq(L.flat, s1.second).top === L.y, m: sq(L.flat, s1.second).margin }, { ok: directOk, m: d.margin }];
    if (L.chainC != null) {
      const oc1 = sq(L.flat, L.chainC);
      fb.push({ ok: sq(L.flat, oc1.top).top === L.y, m: sq(L.flat, oc1.top).margin });
    }
    const pickFirst = (cands) => { for (let i = 0; i < cands.length; i++) if (cands[i].m >= tau) return cands[i].ok; return d1Ok; };
    let switchOk = d1Ok;
    if (critic) {
      fired++;
      if (!d1Ok) firedWrong++;
      switchOk = pickFirst(fb);
      if (switchOk && !d1Ok) firedFixed++;
      switchStayDiffSum += switchOk - d1Ok;
    }
    switchHit += switchOk;
    forceHit += pickFirst(fb);
  }
  const n = testLines.length;
  return { spec, seed, verdict: "COMPLETE", tau: +tau.toFixed(4), n,
    acc: { direct: +(directHit / n).toFixed(4), decomp1: +(d1Hit / n).toFixed(4), switch: +(switchHit / n).toFixed(4), force: +(forceHit / n).toFixed(4) },
    b1: { sub1midRate: +(sub1hit / n).toFixed(4), chance: 0.25 },
    b2: { fired, switchMinusStay: fired ? +((switchStayDiffSum) / fired).toFixed(4) : null,
      firedWrongRate: fired ? +(firedWrong / fired).toFixed(4) : null,
      firedFixedRate: fired ? +(firedFixed / fired).toFixed(4) : null },
    q1: { decomp1MinusDirect: +((d1Hit - directHit) / n).toFixed(4) } };
}

function diagWith(model, testLines, spec, seed) {
  const Q = 8;
  const sq = (flat, k) => {
    const fw = model.forward(flat.concat([k, Q]), 1);
    return argmax2(Array.from(fw.logits));
  };
  const n = testLines.length;
  let agree = 0, sens = 0, sub1ok = 0, okGivenOk = 0, okGivenBad = 0, nBad = 0, directOkN = 0;
  for (const L of testLines) {
    const d = sq(L.flat, L.query);
    const s1 = sq(L.flat, L.query);
    const s2 = sq(L.flat, s1.top);
    if (d.top === s2.top) agree++;
    if (s1.top !== sq(L.flat, L.alt).top) sens++;
    if (s1.top === L.mid) { sub1ok++; if (s2.top === L.y) okGivenOk++; }
    else { nBad++; if (s2.top === L.y) okGivenBad++; }
    if (d.top === L.y) directOkN++;
  }
  return { spec, seed, n, querySensitivity: +(sens / n).toFixed(4), agreeDirectDecomp1: +(agree / n).toFixed(4),
    directAcc: +(directOkN / n).toFixed(4), sub1okRate: +(sub1ok / n).toFixed(4),
    decomp1okGivenSub1ok: sub1ok ? +(okGivenOk / sub1ok).toFixed(4) : null,
    decomp1okGivenSub1bad: nBad ? +(okGivenBad / nBad).toFixed(4) : null };
}

globalThis.runDecompTutorH = async function (fs, log, s, h) {
  const ledgerPath = "src/evidence/decomp/d-tutor-h" + h + "-s" + s + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log("d-tutor-h" + h + "-s" + s + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.DecompInit(fs);
  const A = TASKS.assocR;
  const rng = G.makeRng(13000 + s);
  const train = [];
  for (let i = 0; i < 500; i++) train.push(A.gen(rng, 1 + rng.int(3)));
  const t0 = Date.now();
  const out = await T.trainModel({ seed: 13100 + s, arch: "attn", vocab: 9, h, m: 2 * h, d: 16, classes: 4,
    train, steps: 1200, batch: 16, lr: 5e-3, attnAux: true, attnAuxW: 1.0,
    prefixLabels: (x) => A.bindLabels(x), auxW: 1.0 });
  const wallMs = Date.now() - t0;
  if (wallMs > 2400000) {
    const ab = { spec: "decomp-scale-v10", seed: s, h, verdict: "ABORT", reason: "budget wall " + wallMs };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab;
  }
  const test = [];
  const trng = G.makeRng(13200 + s);
  for (let i = 0; i < 200; i++) test.push(A.gen(trng, 1 + trng.int(3)));
  const ev = T.evaluate(out.model, test, 1);
  const params = out.model.params().map((p) => Array.from(p.v !== undefined ? p.v : p));
  const ledger = { spec: "decomp-scale-v10", seed: s, h, verdict: ev.acc >= 0.60 ? "COMPLETE" : "ABORT",
    gate: ev.acc >= 0.60 ? "PASS" : "FAIL", testAcc: +ev.acc.toFixed(4),
    train: { firstLoss: +out.firstLoss.toFixed(4), lastLoss: +out.lastLoss.toFixed(4) }, wallMs,
    arch: { arch: "attn", vocab: 9, h, m: 2 * h, d: 16, classes: 4 }, trainSeed: 13100 + s, params };
  await fs.writeTextFile(ledgerPath, JSON.stringify(ledger));
  log("d-tutor-h" + h + "-s" + s + " acc=" + ledger.testAcc + " " + ledger.gate + " wall=" + wallMs);
  return ledger;
};

const SCALE_BASE = { "single-h48": 13400, "dual-h96": 13500, "dual-h192": 13600 };

globalThis.runDecompScaleEval = async function (fs, log, s, h, mode) {
  const slug = mode + "-h" + h;
  const ledgerPath = "src/evidence/decomp/d-scale-" + slug + "-s" + s + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log("d-scale-" + slug + "-s" + s + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T } = await globalThis.DecompInit(fs);
  let tut;
  if (mode === "single" && h === 48) {
    tut = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-tutor-s" + s + ".json"));
  } else {
    tut = await globalThis.runDecompTutorH(fs, log, s, h);
  }
  if (tut.verdict !== "COMPLETE") {
    const ab = { spec: "decomp-scale-v10", seed: s, h, mode, verdict: "ABORT", reason: "tutor gated" };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab;
  }
  const model = restoreTutor(T, G, tut);
  const rng = G.makeRng(SCALE_BASE[slug] + s);
  const cal = [], test = [];
  for (let i = 0; i < 120; i++) cal.push(genLineMode(rng, mode));
  for (let i = 0; i < 240; i++) test.push(genLineMode(rng, mode));
  const body = evalArmsWith(model, cal, test, "decomp-scale-v10", s);
  body.h = h; body.mode = mode; body.slug = slug;
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("d-scale-" + slug + "-s" + s + " " + JSON.stringify(body.acc) + " sens=? run-diag");
  return body;
};

globalThis.runDecompScaleDiag = async function (fs, log, s, h, mode) {
  const slug = mode + "-h" + h;
  const ledgerPath = "src/evidence/decomp/d-sdiag-" + slug + "-s" + s + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.spec) { log("d-sdiag-" + slug + "-s" + s + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T } = await globalThis.DecompInit(fs);
  let tut;
  if (mode === "single" && h === 48) {
    tut = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-tutor-s" + s + ".json"));
  } else {
    tut = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-tutor-h" + h + "-s" + s + ".json"));
  }
  const model = restoreTutor(T, G, tut);
  const rng = G.makeRng(SCALE_BASE[slug] + s);
  for (let i = 0; i < 120; i++) genLineMode(rng, mode);
  const test = [];
  for (let i = 0; i < 240; i++) test.push(genLineMode(rng, mode));
  const body = diagWith(model, test, "decomp-scale-v10-diag", s);
  body.h = h; body.mode = mode; body.slug = slug;
  body.rungPass = body.querySensitivity > 0.50 && body.sub1okRate > 0.40;
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("d-sdiag-" + slug + "-s" + s + " sens=" + body.querySensitivity + " sub1=" + body.sub1okRate + " pass=" + body.rungPass);
  return body;
};
globalThis.runDecompDiag = async function (fs, log, s) {
  const ledgerPath = "src/evidence/decomp/d-diag-s" + s + ".json";
  const { G, T } = await globalThis.DecompInit(fs);
  const tut = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-tutor-s" + s + ".json"));
  const model = restoreTutor(T, G, tut);
  const Q = 8;
  const sq = (flat, k) => {
    const fw = model.forward(flat.concat([k, Q]), 1);
    return argmax2(Array.from(fw.logits));
  };
  const rng = G.makeRng(13300 + s);
  for (let i = 0; i < 120; i++) genLine(rng);
  const n = 240;
  let agreeD1 = 0, agreeD2 = 0, sens = 0, sub1ok = 0;
  let d1okGivenSub1ok = 0, d1okGivenSub1bad = 0, nBad = 0;
  let directOkN = 0, s2okGivenSub1ok = 0;
  for (let i = 0; i < n; i++) {
    const L = genLine(rng);
    const d = sq(L.flat, L.query);
    const s1 = sq(L.flat, L.query);
    const s2 = sq(L.flat, s1.top);
    const qc = sq(L.flat, L.chainC);
    if (d.top === s2.top) agreeD1++;
    if (d.top === s2.top && s2.top === L.y) agreeD2++;
    if (s1.top !== qc.top) sens++;
    if (s1.top === L.mid) { sub1ok++; if (s2.top === L.y) d1okGivenSub1ok++; }
    else { nBad++; if (s2.top === L.y) d1okGivenSub1bad++; }
    if (d.top === L.y) directOkN++;
  }
  const ledger = { spec: "decomp-v10-diag", seed: s, n,
    querySensitivity: +(sens / n).toFixed(4),
    agreeDirectDecomp1: +(agreeD1 / n).toFixed(4),
    agreeDirectDecomp1AndRight: +(agreeD2 / n).toFixed(4),
    directAcc: +(directOkN / n).toFixed(4),
    sub1okRate: +(sub1ok / n).toFixed(4),
    decomp1okGivenSub1ok: sub1ok ? +(d1okGivenSub1ok / sub1ok).toFixed(4) : null,
    decomp1okGivenSub1bad: nBad ? +(d1okGivenSub1bad / nBad).toFixed(4) : null };
  await fs.writeTextFile(ledgerPath, JSON.stringify(ledger));
  log("d-diag-s" + s + " " + JSON.stringify(ledger));
  return ledger;
};
