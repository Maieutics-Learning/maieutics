// newai-selfm3r3-driver.js — F-check (critic-alone frozen) + M3 zero-carry eval-only + R3 ignorance-gated notebook.
// Frozen bases: W6 trunk s{seed} + M2-nb notebook s{seed}. Twin-matched streams as in m2r2-prereg.
// Deviations filed: trunk+notebook (incl E) FROZEN (grads discarded, opt steps new only); M3 eval-only
// (no trains, same 61000+seed episode order as M2 evals → paired by seed); R3 gate blends hv+g*read;
// entropy H/log4 exact; wd kept for ablation (prereg predicts ~0).
globalThis.SelfM3R3Init = async function (fs) {
  for (const p of ["src/evidence/decomp/intrinsic-driver.js", "src/evidence/decomp/newai-driver.js", "src/evidence/decomp/newai-v102-driver.js", "src/evidence/decomp/newai-fr-driver.js", "src/evidence/decomp/newai-div-driver.js", "src/evidence/decomp/newai-cur-driver.js", "src/evidence/decomp/newai-winner-driver.js", "src/evidence/decomp/newai-selfmr-driver.js", "src/evidence/decomp/newai-selfm2r2-driver.js"]) {
    const src = await fs.readTextFile(p); (0, eval)(src + "\n//# sourceURL=" + p);
  }
  if (!globalThis.genAdaptEpisode) throw new Error("m3r3 stack load failed");
};
function m3r3ArmCode(arm) {
  if (arm === "f3-critic") return 105; if (arm === "r3-gate") return 106; if (arm === "r3-ctl-flat") return 107; return 105;
}
async function loadFrozenW6(fs, G, seed) {
  let tr = null;
  try { tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-w-w6-s" + seed + ".json")); }
  catch (e) { tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-w-w6-s" + seed + "-800st.json")); }
  const M = inSeqMakeModel(G.makeRng(1));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(M.E, tr.P.E); load(M.W1, tr.P.W1); load(M.b1, tr.P.b1);
  load(M.Wf, tr.P.Wf); load(M.bf, tr.P.bf); load(M.Wc, tr.P.Wc); load(M.bc, tr.P.bc);
  for (let k = 0; k < 5; k++) { load(M.Wh[k], tr.P.Wh[k]); load(M.bh[k], tr.P.bh[k]); }
  load(M.Hv, tr.P.Hv); load(M.bv, tr.P.bv);
  return M;
}
async function loadFrozenM2nb(fs, G, seed) {
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-m2-nb-s" + seed + "-800st.json"));
  const MP = m2MakeParams(G.makeRng(2));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(MP.Wq, tr.P.Wq); load(MP.Watt, tr.P.Watt); load(MP.batt, tr.P.batt);
  return MP;
}
function f3MakeParams(rng) {
  const Wc = inParam(rng, 48, 48); const bc = inParam(rng, 1, 48); bc.v[0] = 0;
  return { Wc, bc };
}
globalThis.f3GradCheck = async function (fs, log) {
  await globalThis.SelfM3R3Init(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const M = inSeqMakeModel(G.makeRng(4242));
  const FP = f3MakeParams(G.makeRng(4243));
  const e = inSeqGenShift(G.makeRng(4245), null);
  const masks = null;
  const lossFn = () => {
    const f1 = inSeqForward(M, e.x, new Float64Array(8), masks);
    let z = FP.bc.v[0]; for (let i = 0; i < 48; i++) z += FP.Wc.v[i] * f1.h[i];
    const beta = 1 / (1 + Math.exp(-z));
    let vhat = 0; for (let o = 1; o < 4; o++) if (f1.hvLog[o] > f1.hvLog[vhat]) vhat = o;
    const wrong1 = vhat === e.v ? 0 : 1;
    return 0.5 * (-(wrong1 * Math.log(beta + 1e-12) + (1 - wrong1) * Math.log(1 - beta + 1e-12)));
  };
  for (const p of [FP.Wc, FP.bc]) p.g.fill(0);
  const fw1 = inSeqForward(M, e.x, new Float64Array(8), masks);
  let vhat = 0; for (let o = 1; o < 4; o++) if (fw1.hvLog[o] > fw1.hvLog[vhat]) vhat = o;
  const wrong1 = vhat === e.v ? 0 : 1;
  let z = FP.bc.v[0]; for (let i = 0; i < 48; i++) z += FP.Wc.v[i] * fw1.h[i];
  const beta = 1 / (1 + Math.exp(-z));
  const dz = 0.5 * (beta - wrong1);
  FP.bc.g[0] += dz;
  for (let i = 0; i < 48; i++) FP.Wc.g[i] += dz * fw1.h[i];
  const eps = 1e-6;
  let worst = 0, worstWhere = "";
  for (const [P, name] of [[FP.Wc, "Wc"], [FP.bc, "bc"]]) {
    for (let i = 0; i < Math.min(P.v.length, 20); i++) {
      P.v[i] += eps; const a1 = lossFn();
      P.v[i] -= 2 * eps; const a0 = lossFn();
      P.v[i] += eps;
      const num = (a1 - a0) / (2 * eps), an = P.g[i];
      const rel = Math.abs(num - an) / Math.max(1e-12, Math.abs(num) + Math.abs(an));
      if (rel > worst) { worst = rel; worstWhere = name + "[" + i + "]"; }
    }
  }
  log("f3-gradcheck worstRel=" + worst.toExponential(2) + " at " + worstWhere);
  return { worstRel: worst, worstWhere };
};
globalThis.runF3Train = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const steps = 800, B = 16, lr = 5e-3, K = 5, H = 48, C = 6;
  const tag = arm + "-s" + seed + "-" + steps + "st";
  const ledgerPath = "src/evidence/decomp/d-newai-self-" + tag + ".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  await globalThis.SelfM3R3Init(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const M = await loadFrozenW6(fs, G, seed);
  const FP = f3MakeParams(G.makeRng(75000 + seed * 7919 + m3r3ArmCode(arm) * 131));
  const opt = new G.Adam(lr);
  const newParams = [FP.Wc, FP.bc];
  const dataRng = G.makeRng(42000 + seed * 104729 + 55);
  let fixedMasks = null; { const fr = G.makeRng(91000 + seed); fixedMasks = []; for (let k = 0; k < K; k++) { const m = new Float64Array(H); for (let i = 0; i < H; i++) m[i] = fr.int(10) < 5 ? 2 : 0; fixedMasks.push(m); } }
  const t0 = Date.now(), curve = [];
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  for (let step = 0; step < steps; step++) {
    for (const p of newParams) p.g.fill(0);
    let lsum = 0;
    for (let b = 0; b < B; b++) {
      const cands = [];
      for (let c = 0; c < C; c++) { const ub = dataRng.int(2) === 0; cands.push(ub ? inSeqGenShift(dataRng, 0) : inSeqGenShift(dataRng, null)); }
      let pk = 0, best = -1;
      for (let c = 0; c < C; c++) {
        const fw = inSeqForward(M, cands[c].x, new Float64Array(8), fixedMasks);
        const d = curVoteDisagree(fw.logitsK);
        if (d > best) { best = d; pk = c; }
      }
      const e = cands[pk];
      const fw1 = inSeqForward(M, e.x, new Float64Array(8), fixedMasks);
      let z = FP.bc.v[0]; for (let i = 0; i < H; i++) z += FP.Wc.v[i] * fw1.h[i];
      const beta = 1 / (1 + Math.exp(-z));
      const vhat = argmax4(fw1.hvLog);
      const wrong1 = vhat === e.v ? 0 : 1;
      lsum += 0.5 * (-(wrong1 * Math.log(beta + 1e-12) + (1 - wrong1) * Math.log(1 - beta + 1e-12)));
      const dz = 0.5 * (beta - wrong1) / B;
      FP.bc.g[0] += dz;
      for (let i = 0; i < H; i++) FP.Wc.g[i] += dz * fw1.h[i];
      void fw1;
    }
    let s = 0; for (const p of newParams) for (let i = 0; i < p.g.length; i++) s += p.g[i] * p.g[i];
    const n = Math.sqrt(s); if (n > 1.0) { const sc = 1.0 / n; for (const p of newParams) for (let i = 0; i < p.g.length; i++) p.g[i] *= sc; }
    opt.step(newParams);
    if (step % 100 === 0 || step === steps - 1) curve.push({ step, loss: +(lsum / B).toFixed(6) });
  }
  const save = (o) => Array.from(o.v);
  const body = { spec: "self-m3r3-prereg", track: "F3", arm, seed, steps, B, lr, frozenTrunk: "W6-s" + seed, verdict: "COMPLETE", wallMs: Date.now() - t0, curve, P: { Wc: save(FP.Wc), bc: save(FP.bc) } };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("f3-train " + tag + " loss0=" + curve[0].loss + " lossN=" + curve[curve.length - 1].loss);
  return body;
};
globalThis.runF3Eval = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const steps = 800, N = 200;
  const tag = arm + "-s" + seed + "-" + steps + "st";
  const ledgerPath = "src/evidence/decomp/d-newai-self-eval-" + tag + ".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  await globalThis.SelfM3R3Init(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const M = await loadFrozenW6(fs, G, seed);
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-" + tag + ".json"));
  const FP = f3MakeParams(G.makeRng(2));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(FP.Wc, tr.P.Wc); load(FP.bc, tr.P.bc);
  let evalMasks = null; { const fr2 = G.makeRng(91000 + seed); evalMasks = []; for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr2.int(10) < 5 ? 2 : 0; evalMasks.push(m); } }
  const srng = G.makeRng(52500 + seed);
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  const items = [];
  for (let i = 0; i < N; i++) {
    const e = inSeqGenShift(srng, null);
    const fw1 = inSeqForward(M, e.x, new Float64Array(8), evalMasks);
    let z = FP.bc.v[0]; for (let j = 0; j < 48; j++) z += FP.Wc.v[j] * fw1.h[j];
    const beta = 1 / (1 + Math.exp(-z));
    const vhat = argmax4(fw1.hvLog);
    items.push({ beta, correct: vhat === e.v ? 1 : 0, vhat, v: e.v });
  }
  items.sort((a, b2) => a.beta - b2.beta);
  const q = Math.floor(N / 4);
  const low = items.slice(0, q), high = items.slice(N - q);
  const accLow = low.reduce((s, x) => s + x.correct, 0) / low.length;
  const accHigh = high.reduce((s, x) => s + x.correct, 0) / high.length;
  const calGap = +((accLow - accHigh).toFixed(4));
  let scr = 0; for (const it of items) scr += it.correct;
  const body = { spec: "self-m3r3-prereg", track: "F3", arm, seed, steps, verdict: "COMPLETE", n: N, frozenTest: true, accScratch: +(scr / N).toFixed(4), calGap, accLowQ: +accLow.toFixed(4), accHighQ: +accHigh.toFixed(4) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("f3-eval " + tag + " scr=" + body.accScratch + " calGap=" + body.calGap);
  return body;
};
globalThis.runM3Eval = async function (fs, log, opts) {
  const { seed } = opts;
  const tag = "m2-nb-s" + seed + "-800st-zero";
  const ledgerPath = "src/evidence/decomp/d-newai-self-eval-" + tag + ".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  await globalThis.SelfM3R3Init(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const M = await loadFrozenW6(fs, G, seed);
  const MP = await loadFrozenM2nb(fs, G, seed);
  let evalMasks = null; { const fr2 = G.makeRng(91000 + seed); evalMasks = []; for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr2.int(10) < 5 ? 2 : 0; evalMasks.push(m); } }
  const arng = G.makeRng(61000 + seed);
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  const N = 200;
  let adaptV = 0, adaptY = 0;
  for (let i = 0; i < N; i++) {
    const ep = genAdaptEpisode(arng);
    const sup = ep.sup.map(se => ({ qkId: se.qk, vId: 4 + se.v, forceZero: false }));
    const e = ep.query;
    const fw1 = inSeqForward(M, e.x, new Float64Array(8), evalMasks);
    const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = M.E.v[e.qk * 12 + d];
    const fr = m2ReadForward(M, MP, Eqk, sup);
    const ensV = new Float64Array(4); for (let o = 0; o < 4; o++) ensV[o] = fw1.hvLog[o] + fr.readLogits[o];
    if (argmax4(ensV) === e.v) adaptV++;
    const vhat = argmax4(ensV);
    const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
    const fw2 = inSeqForward(M, x2m, new Float64Array(8), evalMasks);
    if (argmax4(inMeanLogits({ logitsK: fw2.logitsK })) === e.y) adaptY++;
  }
  const body = { spec: "self-m3r3-prereg", track: "M3", seed, verdict: "COMPLETE", n: N, zeroCarry: true, adaptV: +(adaptV / N).toFixed(4), adaptY: +(adaptY / N).toFixed(4) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("m3-eval zero s" + seed + " adaptY=" + body.adaptY + " adaptV=" + body.adaptV);
  return body;
};
function r3MakeParams(rng) {
  const Wc = inParam(rng, 48, 48); const bc = inParam(rng, 1, 48); bc.v[0] = 0;
  const we = inParam(rng, 1, 1); const wb = inParam(rng, 1, 1); const wd = inParam(rng, 1, 1); const b = inParam(rng, 1, 1);
  we.v[0] = 0; wb.v[0] = 0; wd.v[0] = 0; b.v[0] = 0;
  return { Wc, bc, we, wb, wd, b };
}
globalThis.r3GradCheck = async function (fs, log) {
  await globalThis.SelfM3R3Init(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const rng = G.makeRng(4342);
  const M = inSeqMakeModel(rng);
  const MP = m2MakeParams(G.makeRng(4344));
  const RP = r3MakeParams(G.makeRng(4343));
  const grng = G.makeRng(4345);
  const ep = genAdaptEpisode(grng);
  const e = ep.query, supE = ep.sup;
  const masks = null;
  const sup = supE.map(se => ({ qkId: se.qk, vId: 4 + se.v, forceZero: false }));
  const entropyOf = (hv) => {
    let mx = hv[0]; for (let o = 1; o < 4; o++) if (hv[o] > mx) mx = hv[o];
    let s = 0; const p = new Float64Array(4);
    for (let o = 0; o < 4; o++) { p[o] = Math.exp(hv[o] - mx); s += p[o]; }
    for (let o = 0; o < 4; o++) p[o] /= s;
    let H = 0; for (let o = 0; o < 4; o++) H -= p[o] * Math.log(p[o] + 1e-12);
    return H / Math.log(4);
  };
  const lossFn = () => {
    const f1 = inSeqForward(M, e.x, new Float64Array(8), masks);
    const Eq = new Float64Array(12); for (let d = 0; d < 12; d++) Eq[d] = M.E.v[e.qk * 12 + d];
    const fr = m2ReadForward(M, MP, Eq, sup);
    let z = RP.bc.v[0]; for (let i = 0; i < 48; i++) z += RP.Wc.v[i] * f1.h[i];
    const beta = 1 / (1 + Math.exp(-z));
    const dis = curVoteDisagree(f1.logitsK);
    const H = entropyOf(f1.hvLog);
    const g = 1 / (1 + Math.exp(-(RP.we.v[0] * H + RP.wb.v[0] * beta + RP.wd.v[0] * dis + RP.b.v[0])));
    const ens = new Float64Array(4); for (let o = 0; o < 4; o++) ens[o] = f1.hvLog[o] + g * fr.readLogits[o];
    let vhat = 0; for (let o = 1; o < 4; o++) if (ens[o] > ens[vhat]) vhat = o;
    const wrong1 = vhat === e.v ? 0 : 1;
    return inCELossGrad(ens, e.v).loss * 0.5 + 0.5 * (-(wrong1 * Math.log(beta + 1e-12) + (1 - wrong1) * Math.log(1 - beta + 1e-12)));
  };
  for (const p of [RP.Wc, RP.bc, RP.we, RP.wb, RP.wd, RP.b]) p.g.fill(0);
  const fw1 = inSeqForward(M, e.x, new Float64Array(8), masks);
  const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = M.E.v[e.qk * 12 + d];
  const fr = m2ReadForward(M, MP, Eqk, sup);
  let z = RP.bc.v[0]; for (let i = 0; i < 48; i++) z += RP.Wc.v[i] * fw1.h[i];
  const beta = 1 / (1 + Math.exp(-z));
  const dis = curVoteDisagree(fw1.logitsK);
  const H = entropyOf(fw1.hvLog);
  const g = 1 / (1 + Math.exp(-(RP.we.v[0] * H + RP.wb.v[0] * beta + RP.wd.v[0] * dis + RP.b.v[0])));
  const ensV = new Float64Array(4); for (let o = 0; o < 4; o++) ensV[o] = fw1.hvLog[o] + g * fr.readLogits[o];
  const ce = inCELossGrad(ensV, e.v);
  let vhat = 0; for (let o = 1; o < 4; o++) if (ensV[o] > ensV[vhat]) vhat = o;
  const wrong1 = vhat === e.v ? 0 : 1;
  const dEns = new Float64Array(4); for (let o = 0; o < 4; o++) dEns[o] = ce.d[o] * 0.5;
  const dReadScaled = new Float64Array(4); for (let o = 0; o < 4; o++) dReadScaled[o] = dEns[o] * g;
  let dg = 0; for (let o = 0; o < 4; o++) dg += dEns[o] * fr.readLogits[o];
  const dsig = dg * g * (1 - g);
  const dBetaGate = dsig * RP.wb.v[0];
  RP.we.g[0] += dsig * H; RP.wb.g[0] += dsig * beta; RP.wd.g[0] += dsig * dis; RP.b.g[0] += dsig;
  const dz = dBetaGate * beta * (1 - beta) + 0.5 * (beta - wrong1);
  RP.bc.g[0] += dz;
  for (let i = 0; i < 48; i++) RP.Wc.g[i] += dz * fw1.h[i];
  void dReadScaled;
  const eps = 1e-6;
  let worst = 0, worstWhere = "";
  const checkParam = (P, name) => {
    for (let i = 0; i < Math.min(P.v.length, 20); i++) {
      P.v[i] += eps; const a1 = lossFn();
      P.v[i] -= 2 * eps; const a0 = lossFn();
      P.v[i] += eps;
      const f1a = inSeqForward(M, e.x, new Float64Array(8), masks);
      const Eqa = new Float64Array(12); for (let d = 0; d < 12; d++) Eqa[d] = M.E.v[e.qk * 12 + d];
      const fra = m2ReadForward(M, MP, Eqa, sup);
      let za = RP.bc.v[0]; for (let j = 0; j < 48; j++) za += RP.Wc.v[j] * f1a.h[j];
      const ba = 1 / (1 + Math.exp(-za));
      const da = curVoteDisagree(f1a.logitsK);
      const Ha = entropyOf(f1a.hvLog);
      const ga = 1 / (1 + Math.exp(-(RP.we.v[0] * Ha + RP.wb.v[0] * ba + RP.wd.v[0] * da + RP.b.v[0])));
      const ea = new Float64Array(4); for (let o = 0; o < 4; o++) ea[o] = f1a.hvLog[o] + ga * fra.readLogits[o];
      let va = 0; for (let o = 1; o < 4; o++) if (ea[o] > ea[va]) va = o;
      if (va !== vhat) continue;
      const num = (a1 - a0) / (2 * eps), an = P.g[i];
      const rel = Math.abs(num - an) / Math.max(1e-12, Math.abs(num) + Math.abs(an));
      if (rel > worst) { worst = rel; worstWhere = name + "[" + i + "] num=" + num + " an=" + an; }
    }
  };
  checkParam(RP.Wc, "Wc"); checkParam(RP.bc, "bc"); checkParam(RP.we, "we"); checkParam(RP.wb, "wb"); checkParam(RP.wd, "wd"); checkParam(RP.b, "b");
  log("r3-gradcheck worstRel=" + worst.toExponential(2) + " at " + worstWhere);
  return { worstRel: worst, worstWhere };
};
globalThis.runR3Train = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const steps = 800, B = 16, lr = 5e-3, K = 5, H = 48, C = 6, auxW = 0.5;
  const tag = arm + "-s" + seed + "-" + steps + "st";
  const ledgerPath = "src/evidence/decomp/d-newai-self-" + tag + ".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  await globalThis.SelfM3R3Init(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const M = await loadFrozenW6(fs, G, seed);
  const MP = await loadFrozenM2nb(fs, G, seed);
  const RP = r3MakeParams(G.makeRng(75000 + seed * 7919 + m3r3ArmCode(arm) * 131));
  const newParams = [RP.Wc, RP.bc, RP.we, RP.wb, RP.wd, RP.b];
  const opt = new G.Adam(lr);
  const dataRng = G.makeRng(42000 + seed * 104729 + 55);
  let fixedMasks = null; { const fr = G.makeRng(91000 + seed); fixedMasks = []; for (let k = 0; k < K; k++) { const m = new Float64Array(H); for (let i = 0; i < H; i++) m[i] = fr.int(10) < 5 ? 2 : 0; fixedMasks.push(m); } }
  const entropyOf = (hv) => {
    let mx = hv[0]; for (let o = 1; o < 4; o++) if (hv[o] > mx) mx = hv[o];
    let s = 0; const p = new Float64Array(4);
    for (let o = 0; o < 4; o++) { p[o] = Math.exp(hv[o] - mx); s += p[o]; }
    for (let o = 0; o < 4; o++) p[o] /= s;
    let Hh = 0; for (let o = 0; o < 4; o++) Hh -= p[o] * Math.log(p[o] + 1e-12);
    return Hh / Math.log(4);
  };
  const t0 = Date.now(), curve = [];
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  const isCtlFlat = (arm === "r3-ctl-flat");
  for (let step = 0; step < steps; step++) {
    for (const p of newParams) p.g.fill(0);
    let lsum = 0;
    for (let b = 0; b < B; b++) {
      const isAdapt = dataRng.int(2) === 1;
      let e, sup;
      if (!isAdapt) {
        const cands = [];
        for (let c = 0; c < C; c++) { const ub = dataRng.int(2) === 0; cands.push(ub ? inSeqGenShift(dataRng, 0) : inSeqGenShift(dataRng, null)); }
        let pk = 0, best = -1;
        for (let c = 0; c < C; c++) {
          const fw = inSeqForward(M, cands[c].x, new Float64Array(8), fixedMasks);
          const d = curVoteDisagree(fw.logitsK);
          if (d > best) { best = d; pk = c; }
        }
        e = cands[pk];
        const supE = [inSeqGenShift(dataRng, null), inSeqGenShift(dataRng, null), inSeqGenShift(dataRng, null), inSeqGenShift(dataRng, null)];
        sup = supE.map(se => ({ qkId: se.qk, vId: 4 + se.v, forceZero: false }));
      } else {
        const ep = genAdaptEpisode(dataRng);
        e = ep.query;
        sup = ep.sup.map(se => ({ qkId: se.qk, vId: 4 + se.v, forceZero: false }));
      }
      const fw1 = inSeqForward(M, e.x, new Float64Array(8), fixedMasks);
      const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = M.E.v[e.qk * 12 + d];
      const fr = m2ReadForward(M, MP, Eqk, sup);
      let z = RP.bc.v[0]; for (let i = 0; i < H; i++) z += RP.Wc.v[i] * fw1.h[i];
      const beta = 1 / (1 + Math.exp(-z));
      const dis = curVoteDisagree(fw1.logitsK);
      const Hh = entropyOf(fw1.hvLog);
      const g = isCtlFlat ? 0 : 1 / (1 + Math.exp(-(RP.we.v[0] * Hh + RP.wb.v[0] * beta + RP.wd.v[0] * dis + RP.b.v[0])));
      const ensV = new Float64Array(4); for (let o = 0; o < 4; o++) ensV[o] = fw1.hvLog[o] + g * fr.readLogits[o];
      const ceHv = inCELossGrad(ensV, e.v);
      const vhat = argmax4(ensV);
      const wrong1 = vhat === e.v ? 0 : 1;
      const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
      const fw2 = inSeqForward(M, x2m, fw1.cNew, fixedMasks);
      const mean2 = inMeanLogits({ logitsK: fw2.logitsK });
      const ce2 = inCELossGrad(mean2, e.y);
      lsum += ce2.loss + auxW * ceHv.loss + 0.5 * (-(wrong1 * Math.log(beta + 1e-12) + (1 - wrong1) * Math.log(1 - beta + 1e-12)));
      const dEns = new Float64Array(4); for (let o = 0; o < 4; o++) dEns[o] = ceHv.d[o] * auxW / B;
      let dg = 0; for (let o = 0; o < 4; o++) dg += dEns[o] * fr.readLogits[o];
      if (!isCtlFlat) {
        const dsig = dg * g * (1 - g);
        const dBetaGate = dsig * RP.wb.v[0];
        RP.we.g[0] += dsig * Hh; RP.wb.g[0] += dsig * beta; RP.wd.g[0] += dsig * dis; RP.b.g[0] += dsig;
        const dz = dBetaGate * beta * (1 - beta) + 0.5 * (beta - wrong1) / B;
        RP.bc.g[0] += dz;
        for (let i = 0; i < H; i++) RP.Wc.g[i] += dz * fw1.h[i];
      } else {
        const dz = 0.5 * (beta - wrong1) / B;
        RP.bc.g[0] += dz;
        for (let i = 0; i < H; i++) RP.Wc.g[i] += dz * fw1.h[i];
      }
      void fw1; void fw2; void fr;
    }
    let s = 0; for (const p of newParams) for (let i = 0; i < p.g.length; i++) s += p.g[i] * p.g[i];
    const n = Math.sqrt(s); if (n > 1.0) { const sc = 1.0 / n; for (const p of newParams) for (let i = 0; i < p.g.length; i++) p.g[i] *= sc; }
    opt.step(newParams);
    if (step % 100 === 0 || step === steps - 1) curve.push({ step, loss: +(lsum / B).toFixed(6) });
  }
  const save = (o) => Array.from(o.v);
  const body = { spec: "self-m3r3-prereg", track: "R3", arm, seed, steps, B, lr, frozenTrunk: "W6-s" + seed, frozenNotebook: "M2-nb-s" + seed, verdict: "COMPLETE", wallMs: Date.now() - t0, curve,
    P: { Wc: save(RP.Wc), bc: save(RP.bc), we: save(RP.we), wb: save(RP.wb), wd: save(RP.wd), b: save(RP.b) } };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("r3-train " + tag + " loss0=" + curve[0].loss + " lossN=" + curve[curve.length - 1].loss);
  return body;
};
globalThis.runR3Eval = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const steps = 800, N = 200;
  const tag = arm + "-s" + seed + "-" + steps + "st";
  const ledgerPath = "src/evidence/decomp/d-newai-self-eval-" + tag + ".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  await globalThis.SelfM3R3Init(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const M = await loadFrozenW6(fs, G, seed);
  const MP = await loadFrozenM2nb(fs, G, seed);
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-" + tag + ".json"));
  const RP = r3MakeParams(G.makeRng(2));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(RP.Wc, tr.P.Wc); load(RP.bc, tr.P.bc); load(RP.we, tr.P.we); load(RP.wb, tr.P.wb); load(RP.wd, tr.P.wd); load(RP.b, tr.P.b);
  let evalMasks = null; { const fr2 = G.makeRng(91000 + seed); evalMasks = []; for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr2.int(10) < 5 ? 2 : 0; evalMasks.push(m); } }
  const entropyOf = (hv) => {
    let mx = hv[0]; for (let o = 1; o < 4; o++) if (hv[o] > mx) mx = hv[o];
    let s = 0; const p = new Float64Array(4);
    for (let o = 0; o < 4; o++) { p[o] = Math.exp(hv[o] - mx); s += p[o]; }
    for (let o = 0; o < 4; o++) p[o] /= s;
    let Hh = 0; for (let o = 0; o < 4; o++) Hh -= p[o] * Math.log(p[o] + 1e-12);
    return Hh / Math.log(4);
  };
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  const isCtlFlat = (arm === "r3-ctl-flat");
  const srng = G.makeRng(52500 + seed);
  let scr = 0, two = 0;
  const supRng = G.makeRng(42000 + seed * 104729 + 999);
  for (let i = 0; i < N; i++) {
    const e = inSeqGenShift(srng, null);
    const supE = [inSeqGenShift(supRng, null), inSeqGenShift(supRng, null), inSeqGenShift(supRng, null), inSeqGenShift(supRng, null)];
    const sup = supE.map(se => ({ qkId: se.qk, vId: 4 + se.v, forceZero: false }));
    const fw1 = inSeqForward(M, e.x, new Float64Array(8), evalMasks);
    const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = M.E.v[e.qk * 12 + d];
    const fr = m2ReadForward(M, MP, Eqk, sup);
    let z = RP.bc.v[0]; for (let j = 0; j < 48; j++) z += RP.Wc.v[j] * fw1.h[j];
    const beta = 1 / (1 + Math.exp(-z));
    const dis = curVoteDisagree(fw1.logitsK);
    const Hh = entropyOf(fw1.hvLog);
    const g = isCtlFlat ? 0 : 1 / (1 + Math.exp(-(RP.we.v[0] * Hh + RP.wb.v[0] * beta + RP.wd.v[0] * dis + RP.b.v[0])));
    const ensV = new Float64Array(4); for (let o = 0; o < 4; o++) ensV[o] = fw1.hvLog[o] + g * fr.readLogits[o];
    if (argmax4(ensV) === e.v) scr++;
    const vhat = argmax4(ensV);
    const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
    const fw2 = inSeqForward(M, x2m, fw1.cNew, evalMasks);
    if (argmax4(inMeanLogits({ logitsK: fw2.logitsK })) === e.y) two++;
  }
  const arng = G.makeRng(61000 + seed);
  let adaptY = 0, adaptV = 0, gAdapt = 0, gStd = 0, gWrong = 0, gRight = 0, nW = 0, nR = 0;
  for (let i = 0; i < N; i++) {
    const ep = genAdaptEpisode(arng);
    const sup = ep.sup.map(se => ({ qkId: se.qk, vId: 4 + se.v, forceZero: false }));
    const e = ep.query;
    const fw1 = inSeqForward(M, e.x, new Float64Array(8), evalMasks);
    const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = M.E.v[e.qk * 12 + d];
    const fr = m2ReadForward(M, MP, Eqk, sup);
    let z = RP.bc.v[0]; for (let j = 0; j < 48; j++) z += RP.Wc.v[j] * fw1.h[j];
    const beta = 1 / (1 + Math.exp(-z));
    const dis = curVoteDisagree(fw1.logitsK);
    const Hh = entropyOf(fw1.hvLog);
    const g = isCtlFlat ? 0 : 1 / (1 + Math.exp(-(RP.we.v[0] * Hh + RP.wb.v[0] * beta + RP.wd.v[0] * dis + RP.b.v[0])));
    gAdapt += g;
    const ensV = new Float64Array(4); for (let o = 0; o < 4; o++) ensV[o] = fw1.hvLog[o] + g * fr.readLogits[o];
    const vhat = argmax4(ensV);
    if (vhat === e.v) { adaptV++; }
    if (vhat === e.v) { gRight += g; nR++; } else { gWrong += g; nW++; }
    const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
    const fw2 = inSeqForward(M, x2m, fw1.cNew, evalMasks);
    if (argmax4(inMeanLogits({ logitsK: fw2.logitsK })) === e.y) adaptY++;
  }
  // standard gate mean: reuse last standard loop? recompute quickly from srng2
  const srng2 = G.makeRng(52501 + seed);
  const supRng2 = G.makeRng(42001 + seed * 104729 + 999);
  for (let i = 0; i < N; i++) {
    const e = inSeqGenShift(srng2, null);
    const supE = [inSeqGenShift(supRng2, null), inSeqGenShift(supRng2, null), inSeqGenShift(supRng2, null), inSeqGenShift(supRng2, null)];
    const sup = supE.map(se => ({ qkId: se.qk, vId: 4 + se.v, forceZero: false }));
    const fw1 = inSeqForward(M, e.x, new Float64Array(8), evalMasks);
    const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = M.E.v[e.qk * 12 + d];
    const fr = m2ReadForward(M, MP, Eqk, sup);
    void fr;
    let z = RP.bc.v[0]; for (let j = 0; j < 48; j++) z += RP.Wc.v[j] * fw1.h[j];
    const beta = 1 / (1 + Math.exp(-z));
    const dis = curVoteDisagree(fw1.logitsK);
    const Hh = entropyOf(fw1.hvLog);
    const g = isCtlFlat ? 0 : 1 / (1 + Math.exp(-(RP.we.v[0] * Hh + RP.wb.v[0] * beta + RP.wd.v[0] * dis + RP.b.v[0])));
    gStd += g;
  }
  const body = { spec: "self-m3r3-prereg", track: "R3", arm, seed, steps, verdict: "COMPLETE", n: N, frozenTest: true,
    accScratch: +(scr / N).toFixed(4), accTwo: +(two / N).toFixed(4), adaptY: +(adaptY / N).toFixed(4), adaptV: +(adaptV / N).toFixed(4),
    meanGateAdapt: +(gAdapt / N).toFixed(4), meanGateStd: +(gStd / N).toFixed(4),
    meanGateWrong1: +(nW ? gWrong / nW : 0).toFixed(4), meanGateRight1: +(nR ? gRight / nR : 0).toFixed(4),
    gateWeights: { we: +RP.we.v[0].toFixed(4), wb: +RP.wb.v[0].toFixed(4), wd: +RP.wd.v[0].toFixed(4), b: +RP.b.v[0].toFixed(4) } };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("r3-eval " + tag + " adaptY=" + body.adaptY + " gAdapt=" + body.meanGateAdapt + " gStd=" + body.meanGateStd + " gW=" + body.meanGateWrong1 + " gR=" + body.meanGateRight1 + " w=" + JSON.stringify(body.gateWeights));
  return body;
};
