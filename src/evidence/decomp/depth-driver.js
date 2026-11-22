// src/evidence/decomp/depth-driver.js — depth v1.0 (spec depth-v10-prereg.md).
// LOAD AFTER assembly-driver.js (reuses genAsmLine/genProbeLine/genHardLine,
// flatWithout/flatRoles/argmaxA/asmRestore). New: fixed-r train loop
// (mirrors trainModel, verified pattern), attnSup local copy, top-2, traces.
function attnSupLocal(ex, fw) {
  const steps = fw.cache.steps;
  if (!steps) return null;
  const last = steps[steps.length - 1];
  if (!last || !last.att) return null;
  const n = last.att.n;
  const qk = ex.x[ex.x.length - 2];
  let idx = -1;
  for (let t = 0; t < ex.x.length - 2; t += 2) {
    if (ex.x[t] === qk) { idx = t + 1; break; }
  }
  if (idx < 0 || idx >= n) return null;
  const w = last.att.w[idx];
  const dw = new Float64Array(n);
  dw[idx] = -1 / (w + 1e-9);
  return { loss: -Math.log(w + 1e-9), dw };
}
function top2Of(arr) {
  let b0 = 0, b1 = 1;
  if (arr[1] > arr[0]) { b0 = 1; b1 = 0; }
  for (let i = 2; i < arr.length; i++) {
    if (arr[i] > arr[b0]) { b1 = b0; b0 = i; }
    else if (arr[i] > arr[b1]) b1 = i;
  }
  return { top: b0, second: b1, mTop: arr[b0] - arr[b1] };
}
globalThis.trainDepthR = async function (fs, log, s, r) {
  const ledgerPath = "src/evidence/decomp/d-depth-b-train-r" + r + "-s" + s + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.AssemblyInit(fs);
  const A = TASKS.assocR;
  const rng = G.makeRng(18200 + s);
  const train = [];
  for (let i = 0; i < 500; i++) {
    const keys = [0, 1, 2, 3];
    for (let k = keys.length - 1; k > 0; k--) { const j = rng.int(k + 1); const t = keys[k]; keys[k] = keys[j]; keys[j] = t; }
    const [a, c, g] = [keys[0], keys[1], keys[2]];
    const m = rng.int(4), d = rng.int(4), e = rng.int(4), f = rng.int(4), h = rng.int(4);
    const prs = [[a, m], [m, 4 + e], [c, d], [d, 4 + f]];
    if (rng.uniform(0, 1) < 0.5) prs.push([g, 4 + h]);
    for (let k = prs.length - 1; k > 0; k--) { const j = rng.int(k + 1); const t = prs[k]; prs[k] = prs[j]; prs[j] = t; }
    const flat = [];
    for (const [kk, vv] of prs) flat.push(kk, vv);
    train.push({ x: flat.concat([a, 8]), y: e });
  }
  const seed = (r === 3 ? 18400 : 18300) + s;
  const mrng = G.makeRng(seed);
  const model = T.makeModel(mrng, { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 });
  const opt = new G.Adam(5e-3);
  const B = 16, STEPS = 1200;
  const t0 = Date.now();
  let firstLoss = 0, lastLoss = 0;
  const grng = G.makeRng(seed + 7);
  for (let step = 1; step <= STEPS; step++) {
    model.zeroGrad();
    let loss = 0;
    for (let b = 0; b < B; b++) {
      const ex = train[grng.int(train.length)];
      const fwd = model.forward(ex.x, r);
      const ce = G.softmaxCE(fwd.logits, ex.y);
      loss += ce.loss;
      const d = ce.dlogits;
      for (let i = 0; i < d.length; i++) d[i] /= B;
      let auxList = null;
      if (fwd.cache.posOut) {
        const labs = A.bindLabels(ex.x);
        auxList = new Array(ex.x.length);
        for (let t = 0; t < ex.x.length; t++) {
          if (labs[t] == null) { auxList[t] = null; continue; }
          const ceT = G.softmaxCE(fwd.cache.posOut[t].logits, labs[t]);
          loss += ceT.loss / ex.x.length;
          const dt = ceT.dlogits;
          for (let i = 0; i < dt.length; i++) dt[i] /= (B * ex.x.length);
          auxList[t] = dt;
        }
      }
      let attnX = null;
      const sup = attnSupLocal(ex, fwd);
      if (sup) {
        loss += sup.loss;
        const dw = sup.dw;
        for (let j = 0; j < dw.length; j++) dw[j] /= B;
        attnX = { dw };
      }
      model.backward(d, fwd, auxList, attnX);
    }
    opt.step(model.params());
    loss /= B;
    if (step === 1) firstLoss = loss;
    if (step % 200 === 0 || step === STEPS) { lastLoss = loss; await new Promise((res) => setTimeout(res, 0)); }
  }
  const wallMs = Date.now() - t0;
  const erng = G.makeRng(18250 + s);
  const own = [];
  for (let i = 0; i < 200; i++) own.push(train[erng.int(train.length)]);
  const acc = T.evaluate(model, own, r).acc;
  const params = model.params().map((p) => Array.from(p.v !== undefined ? p.v : p));
  const ledger = { spec: "depth-v10", seed: s, r, trainSeed: seed,
    verdict: acc >= 0.50 ? "COMPLETE" : "ABORT", gate: acc >= 0.50 ? "PASS" : "FAIL",
    ownAcc: +acc.toFixed(4), wallMs,
    train: { firstLoss: +firstLoss.toFixed(4), lastLoss: +lastLoss.toFixed(4) },
    arch: { arch: "attn", vocab: 9, h: 48, m: 96, d: 16, classes: 4 }, params };
  await fs.writeTextFile(ledgerPath, JSON.stringify(ledger));
  log("depth-b-train r=" + r + " s=" + s + " own=" + ledger.ownAcc + " " + ledger.gate);
  return ledger;
};
function depthRestore(T, G, tut) {
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
// D-A: filed tutors (arm b = asm-train-b, arm tutor = v10 d-tutor) at r in {1,2,3,4,6}.
globalThis.runDepthA = async function (fs, log, s, arm) {
  const ledgerPath = "src/evidence/decomp/d-depth-a-" + arm + "-s" + s + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.AssemblyInit(fs);
  const A = TASKS.assocR;
  const src = arm === "b" ? "d-asm-train-b-s" + s + ".json" : "d-tutor-s" + s + ".json";
  const tut = JSON.parse(await fs.readTextFile("src/evidence/decomp/" + src));
  const model = depthRestore(T, G, tut);
  const fw = (x, r) => argmaxA(Array.from(model.forward(x, r).logits));
  const out = { spec: "depth-v10", seed: s, arm, verdict: "COMPLETE", rSweep: {} };
  for (const r of [1, 2, 3, 4, 6]) {
    const reps = [];
    for (let rep = 0; rep < 3; rep++) {
      const rng = G.makeRng(17400 + s * 10 + rep * 500 + r);
      const ctl = [];
      for (let i = 0; i < 200; i++) ctl.push(A.gen(rng, 1 + rng.int(3)));
      let ok = 0;
      for (const ex of ctl) if (fw(ex.x, r) === ex.y) ok++;
      let direct = 0, d1 = 0, sub1 = 0;
      const N = 300;
      for (let i = 0; i < N; i++) {
        const L = genProbeLine(rng);
        const flat = flatWithout(L.pairs, []);
        if (fw(flat.concat([L.query, 8]), r) === L.y) direct++;
        const m1 = fw(flat.concat([L.query, 8]), r);
        if (m1 === L.mid) sub1++;
        if (fw(flat.concat([m1, 8]), r) === L.y) d1++;
      }
      reps.push({ ctl: +(ok / 200).toFixed(4), direct: +(direct / N).toFixed(4),
        decomp1: +(d1 / N).toFixed(4), sub1mid: +(sub1 / N).toFixed(4) });
    }
    const m = (k) => +((reps[0][k] + reps[1][k] + reps[2][k]) / 3).toFixed(4);
    out.rSweep["r" + r] = { reps, mean: { ctl: m("ctl"), direct: m("direct"), decomp1: m("decomp1"), sub1mid: m("sub1mid") } };
  }
  await fs.writeTextFile(ledgerPath, JSON.stringify(out));
  log("depth-a-" + arm + "-s" + s + " " + [1, 2, 3, 4, 6].map((r) => "r" + r + "=" + out.rSweep["r" + r].mean.direct).join(" "));
  return out;
};
// D-B eval: easy + hard + retention on r-fixed trained tutors.
globalThis.runDepthBEval = async function (fs, log, s, r) {
  const ledgerPath = "src/evidence/decomp/d-depth-b-eval-r" + r + "-s" + s + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T, TASKS } = await globalThis.AssemblyInit(fs);
  const A = TASKS.assocR;
  const tut = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-depth-b-train-r" + r + "-s" + s + ".json"));
  if (tut.verdict !== "COMPLETE") {
    const ab = { spec: "depth-v10", seed: s, r, verdict: "ABORT", reason: "train gated" };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab;
  }
  const model = depthRestore(T, G, tut);
  const fw = (x, rr) => argmaxA(Array.from(model.forward(x, rr).logits));
  const out = { spec: "depth-v10", seed: s, r, verdict: "COMPLETE", reps: [] };
  for (let rep = 0; rep < 3; rep++) {
    const rng = G.makeRng(17500 + s * 10 + rep * 500);
    let eD = 0, eD1 = 0;
    const Ne = 200;
    for (let i = 0; i < Ne; i++) {
      const L = genAsmLine(rng);
      if (fw(L.flat.concat([L.query, 8]), r) === L.y) eD++;
      const m1 = fw(L.flat.concat([L.query, 8]), r);
      if (fw(L.flat.concat([m1, 8]), r) === L.y) eD1++;
    }
    let hD = 0, hD1 = 0, hS = 0, hO = 0;
    const Nh = 300;
    for (let i = 0; i < Nh; i++) {
      const L = genProbeLine(rng);
      const flat = flatWithout(L.pairs, []);
      if (fw(flat.concat([L.query, 8]), r) === L.y) hD++;
      const m1 = fw(flat.concat([L.query, 8]), r);
      if (m1 === L.mid) hS++;
      if (fw(flat.concat([m1, 8]), r) === L.y) hD1++;
      if (fw(flat.concat([L.mid, 8]), r) === L.y) hO++;
    }
    const ctl = [];
    for (let i = 0; i < 200; i++) ctl.push(A.gen(rng, 1 + rng.int(3)));
    let ok = 0;
    for (const ex of ctl) if (fw(ex.x, r) === ex.y) ok++;
    out.reps.push({ easyDirect: +(eD / Ne).toFixed(4), easyD1: +(eD1 / Ne).toFixed(4),
      hardDirect: +(hD / Nh).toFixed(4), hardD1: +(hD1 / Nh).toFixed(4),
      hardSub1: +(hS / Nh).toFixed(4), hardOracle: +(hO / Nh).toFixed(4),
      retention: +(ok / 200).toFixed(4) });
  }
  const m = (k) => +((out.reps[0][k] + out.reps[1][k] + out.reps[2][k]) / 3).toFixed(4);
  out.mean = { easyDirect: m("easyDirect"), easyD1: m("easyD1"), hardDirect: m("hardDirect"),
    hardD1: m("hardD1"), hardSub1: m("hardSub1"), hardOracle: m("hardOracle"), retention: m("retention") };
  await fs.writeTextFile(ledgerPath, JSON.stringify(out));
  log("depth-b-eval r=" + r + " s=" + s + " " + JSON.stringify(out.mean));
  return out;
};
// D-C: round specialization + round-drop on r=3 B-models.
globalThis.runDepthC = async function (fs, log, s) {
  const ledgerPath = "src/evidence/decomp/d-depth-c-s" + s + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T } = await globalThis.AssemblyInit(fs);
  const tut = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-depth-b-train-r3-s" + s + ".json"));
  if (tut.verdict !== "COMPLETE") {
    const ab = { spec: "depth-v10", seed: s, verdict: "ABORT", reason: "train gated" };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab;
  }
  const model = depthRestore(T, G, tut);
  const reps = [];
  for (let rep = 0; rep < 3; rep++) {
    const rng = G.makeRng(17600 + s * 10 + rep * 500);
    const N = 200;
    let sep = 0, ok = 0, d3 = 0, d1 = 0;
    for (let i = 0; i < N; i++) {
      const L = genProbeLine(rng);
      const flat = flatWithout(L.pairs, []);
      const roles = [];
      for (const [k, v] of L.pairs) {
        if (k === L.query && v === L.mid) roles.push("trueOther", "trueOther");
        else if (k === L.mid && v === 4 + L.y) roles.push("srcKey", "srcVal");
        else roles.push("other", "other");
      }
      const x = flat.concat([L.query, 8]);
      const f3 = model.forward(x, 3);
      const out3 = argmaxA(Array.from(f3.logits));
      const f1 = model.forward(x, 1);
      const out1 = argmaxA(Array.from(f1.logits));
      if (out3 === L.y) d3++;
      if (out1 === L.y) d1++;
      if (out3 !== L.y) continue;
      ok++;
      const st = f3.cache.steps, Lt = x.length;
      const foc = [0, 1, 2].map((k) => {
        const w = Array.from(st[Lt + k].att.w);
        let p = 0;
        for (let j = 1; j < w.length; j++) if (w[j] > w[p]) p = j;
        return roles[p];
      });
      const r1true = foc[0] === "trueOther";
      const r2src = foc[1] === "srcKey" || foc[1] === "srcVal";
      if (r1true && r2src) sep++;
    }
    reps.push({ directR3: +(d3 / N).toFixed(4), directR1: +(d1 / N).toFixed(4),
      sep: ok ? +(sep / ok).toFixed(4) : null, nOk: ok });
  }
  const nums = reps.map((x) => ({ directR3: x.directR3, directR1: x.directR1, sep: x.sep === null ? 0 : x.sep }));
  const m = (arr) => +((arr[0] + arr[1] + arr[2]) / 3).toFixed(4);
  const body = { spec: "depth-v10", seed: s, verdict: "COMPLETE", R: 3, N: 200, reps,
    mean: { directR3: m(nums.map((x) => x.directR3)), directR1: m(nums.map((x) => x.directR1)),
      sep: m(nums.map((x) => x.sep)), clampDrop: +(((nums[0].directR3 + nums[1].directR3 + nums[2].directR3) - (nums[0].directR1 + nums[1].directR1 + nums[2].directR1)) / 3).toFixed(4) } };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("depth-c-s" + s + " sep=" + body.mean.sep + " drop=" + body.mean.clampDrop);
  return body;
};
// D-D: path search (top-2 m1 x top-2 follow, margin sum) vs DECOMP-1.
globalThis.runDepthD = async function (fs, log, s, arm) {
  const ledgerPath = "src/evidence/decomp/d-depth-d-" + arm + "-s" + s + ".json";
  try {
    const prev = JSON.parse(await fs.readTextFile(ledgerPath));
    if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; }
  } catch (e) {}
  const { G, T } = await globalThis.AssemblyInit(fs);
  const src = arm === "b" ? "d-asm-train-b-s" + s + ".json" : "d-depth-b-train-r" + arm.slice(1) + "-s" + s + ".json";
  let tut;
  try { tut = JSON.parse(await fs.readTextFile("src/evidence/decomp/" + src)); }
  catch (e) {
    const ab = { spec: "depth-v10", seed: s, arm, verdict: "ABORT", reason: "no model " + src };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab;
  }
  if (tut.verdict !== "COMPLETE") {
    const ab = { spec: "depth-v10", seed: s, arm, verdict: "ABORT", reason: "train gated" };
    await fs.writeTextFile(ledgerPath, JSON.stringify(ab)); return ab;
  }
  const model = depthRestore(T, G, tut);
  const rr = arm === "r3" ? 3 : 1;
  const reps = [];
  for (let rep = 0; rep < 3; rep++) {
    const rng = G.makeRng(17700 + s * 10 + rep * 500);
    const N = 300;
    let d1 = 0, p1 = 0;
    for (let i = 0; i < N; i++) {
      const L = genProbeLine(rng);
      const flat = flatWithout(L.pairs, []);
      const Fa = model.forward(flat.concat([L.query, 8]), rr);
      const la = Array.from(Fa.logits);
      const t1 = top2Of(la);
      const m1 = t1.top;
      const Fb = model.forward(flat.concat([m1, 8]), rr);
      if (argmaxA(Array.from(Fb.logits)) === L.y) d1++;
      let bestOk = 0, bestScore = -1e300;
      for (const mm of [t1.top, t1.second]) {
        const Fm = model.forward(flat.concat([mm, 8]), rr);
        const lm = Array.from(Fm.logits);
        const t2 = top2Of(lm);
        for (const oo of [t2.top, t2.second]) {
          const sMargin = (mm === t1.top ? t1.mTop : -t1.mTop) + (oo === t2.top ? t2.mTop : -t2.mTop);
          if (sMargin > bestScore) { bestScore = sMargin; bestOk = oo === L.y ? 1 : 0; }
        }
      }
      if (bestOk) p1++;
    }
    reps.push({ decomp1: +(d1 / N).toFixed(4), path1: +(p1 / N).toFixed(4), lift: +((p1 - d1) / N).toFixed(4) });
  }
  const m = (k) => +((reps[0][k] + reps[1][k] + reps[2][k]) / 3).toFixed(4);
  const body = { spec: "depth-v10", seed: s, arm, verdict: "COMPLETE", R: 3, N: 300, reps,
    mean: { decomp1: m("decomp1"), path1: m("path1"), lift: m("lift") } };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("depth-d-" + arm + "-s" + s + " lift=" + body.mean.lift);
  return body;
};
