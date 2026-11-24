// newai-selfm2r2-driver.js — M2 (write-all + mixed diet, frozen W6) + R2 (critic-gated complementary re-read, frozen W6).
// CPU/in-worker Float64. Frozen trunk per seed = W6 (d-newai-w-w6-s{seed}-800st.json).
// Twin-matched: init new params 75000+seed*7919+armCode*131; data 42000+seed*104729+55;
// masks 91000+seed; eval 52500/52400+seed; adapt 61000+seed; mixed coin in dataRng stream (paired).
// Deviations filed openly:
//  - Trunk (incl E) FROZEN: grads computed then discarded (opt steps new params only); this repairs
//    M1/R1 base-wounding (joint training hurt W6). E frozen → keys/values fixed, Wq learns matching.
//  - M2 write-ALL (no wg/bg); selectivity lives in read attention (mass vitality, not gate).
//    M2-ctl write-0 (ctx=0, readLogits=batt; Wq/Watt get ~0 grad, batt learns bias — isolates USE).
//  - M2 mixed diet 50/50 in one stream (coin via dataRng.int(2), paired across arms): standard half
//    (C=6 pick + 4 random supports, answer in-flat) + adapt half (true 4 + missing-answer query).
//  - R2 critic NEW (on pass2 h, predicts P(pass2 wrong), BCE×0.5, bias-0 init) — not F reuse (different
//    trunk init + different pass; filed). Gate g=σ(wd·dis2+wb·beta2+b), bias-0 init.
//  - R2 pass3 COMPLEMENTARY masks (2−fixedMasks, other half of h — new subspace, same distribution,
//    derived seed-only). Pass1/2 use fixedMasks (W6 recipe); pass3 uses compMasks. R2-ctl g=1.
//  - Adapt generator reused from selfmr (genAdaptEpisode: 2 in-episode novels, 4 supports, 1 missing query).
globalThis.SelfM2R2Init = async function (fs) {
  for (const p of ["src/evidence/decomp/intrinsic-driver.js", "src/evidence/decomp/newai-driver.js", "src/evidence/decomp/newai-v102-driver.js", "src/evidence/decomp/newai-fr-driver.js", "src/evidence/decomp/newai-div-driver.js", "src/evidence/decomp/newai-cur-driver.js", "src/evidence/decomp/newai-winner-driver.js", "src/evidence/decomp/newai-selfmr-driver.js"]) {
    const src = await fs.readTextFile(p); (0, eval)(src + "\n//# sourceURL=" + p);
  }
  if (!globalThis.genAdaptEpisode) throw new Error("m2r2 stack load failed");
};
function m2r2ArmCode(arm) {
  if (arm === "m2-nb") return 101; if (arm === "m2-ctl") return 102;
  if (arm === "r2-gate") return 103; if (arm === "r2-ctl") return 104; return 101;
}
function m2MakeParams(rng) {
  const Wq = inParam(rng, 144, 12);
  const Watt = inParam(rng, 48, 12);
  const batt = inParam(rng, 4, 12);
  return { Wq, Watt, batt };
}
const M2_SQRTD = 3.4641016151377544;
function m2ReadForward(M, MP, Eqk_q, sup) {
  // sup: [{qkId, vId}] write-all (ctl: forceZero → values zeroed by caller via flag)
  const D = 12;
  const q = new Float64Array(D);
  for (let o = 0; o < D; o++) { let s = 0; for (let j = 0; j < D; j++) s += MP.Wq.v[o * D + j] * Eqk_q[j]; q[o] = s; }
  const keys = [], vals = [];
  for (const s of sup) {
    const k = new Float64Array(D), vr = new Float64Array(D);
    for (let d = 0; d < D; d++) { k[d] = M.E.v[s.qkId * D + d]; vr[d] = M.E.v[s.vId * D + d]; }
    const v = new Float64Array(D);
    if (s.forceZero) { for (let d = 0; d < D; d++) v[d] = 0; }
    else { for (let d = 0; d < D; d++) v[d] = vr[d]; }
    keys.push(k); vals.push({ raw: vr, scaled: v });
  }
  const sc = new Float64Array(sup.length);
  for (let i = 0; i < sup.length; i++) { let dot = 0; for (let d = 0; d < D; d++) dot += q[d] * keys[i][d]; sc[i] = dot / M2_SQRTD; }
  let mx = sc[0]; for (let i = 1; i < sc.length; i++) if (sc[i] > mx) mx = sc[i];
  const a = new Float64Array(sup.length); let sm = 0;
  for (let i = 0; i < sup.length; i++) { a[i] = Math.exp(sc[i] - mx); sm += a[i]; }
  for (let i = 0; i < sup.length; i++) a[i] /= sm;
  const ctx = new Float64Array(D);
  for (let i = 0; i < sup.length; i++) for (let d = 0; d < D; d++) ctx[d] += a[i] * vals[i].scaled[d];
  const readLogits = new Float64Array(4);
  for (let o = 0; o < 4; o++) { let t = MP.batt.v[o]; for (let d = 0; d < D; d++) t += MP.Watt.v[o * D + d] * ctx[d]; readLogits[o] = t; }
  return { q, Eqk_q: Eqk_q.slice(), keys, vals, a, ctx, readLogits, supIds: sup.map(s => ({ qkId: s.qkId, vId: s.vId, forceZero: !!s.forceZero })) };
}
function m2ReadBackward(M, MP, fw, dRead) {
  const D = 12, n = fw.keys.length;
  const dctx = new Float64Array(D);
  for (let o = 0; o < 4; o++) {
    MP.batt.g[o] += dRead[o];
    for (let d = 0; d < D; d++) { MP.Watt.g[o * D + d] += dRead[o] * fw.ctx[d]; dctx[d] += dRead[o] * MP.Watt.v[o * D + d]; }
  }
  const da = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    if (fw.supIds[i].forceZero) { da[i] = 0; continue; }
    let dot = 0; for (let d = 0; d < D; d++) dot += dctx[d] * fw.vals[i].raw[d];
    da[i] = dot;
  }
  let ada = 0; for (let i = 0; i < n; i++) ada += da[i] * fw.a[i];
  const ds = new Float64Array(n);
  for (let i = 0; i < n; i++) ds[i] = fw.a[i] * (da[i] - ada);
  const dq = new Float64Array(D);
  for (let i = 0; i < n; i++) for (let d = 0; d < D; d++) dq[d] += ds[i] * fw.keys[i][d] / M2_SQRTD;
  for (let o = 0; o < D; o++) for (let j = 0; j < D; j++) MP.Wq.g[o * D + j] += dq[o] * fw.Eqk_q[j];
  // E frozen: no accumulation into M.E.g (discarded by design; filed)
}
globalThis.m2GradCheck = async function (fs, log) {
  await globalThis.SelfM2R2Init(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const rng = G.makeRng(4242);
  const M = inSeqMakeModel(rng);
  const MP = m2MakeParams(G.makeRng(4243));
  const grng = G.makeRng(4245);
  const ep = genAdaptEpisode(grng);
  const e_q = ep.query, supE = ep.sup;
  const masks = null;
  const sup = supE.map(e => ({ qkId: e.qk, vId: 4 + e.v }));
  const Eqk_q = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk_q[d] = M.E.v[e_q.qk * 12 + d];
  const lossFn = () => {
    const f1 = inSeqForward(M, e_q.x, new Float64Array(8), masks);
    const Eq = new Float64Array(12); for (let d = 0; d < 12; d++) Eq[d] = M.E.v[e_q.qk * 12 + d];
    const fr = m2ReadForward(M, MP, Eq, sup);
    const ens = new Float64Array(4); for (let o = 0; o < 4; o++) ens[o] = f1.hvLog[o] + fr.readLogits[o];
    return inCELossGrad(ens, e_q.v).loss * 0.5;
  };
  for (const p of [MP.Wq, MP.Watt, MP.batt]) p.g.fill(0);
  const fw1 = inSeqForward(M, e_q.x, new Float64Array(8), masks);
  const fr = m2ReadForward(M, MP, Eqk_q, sup);
  const ensV = new Float64Array(4); for (let o = 0; o < 4; o++) ensV[o] = fw1.hvLog[o] + fr.readLogits[o];
  const ce = inCELossGrad(ensV, e_q.v);
  const dRead = new Float64Array(4); for (let o = 0; o < 4; o++) dRead[o] = ce.d[o] * 0.5;
  m2ReadBackward(M, MP, fr, dRead);
  const eps = 1e-6;
  let worst = 0, worstWhere = "";
  const checkParam = (P, name) => {
    for (let i = 0; i < Math.min(P.v.length, 20); i++) {
      P.v[i] += eps; const a1 = lossFn();
      P.v[i] -= 2 * eps; const a0 = lossFn();
      P.v[i] += eps;
      const num = (a1 - a0) / (2 * eps), an = P.g[i];
      const absd = Math.abs(num - an);
      const rel = absd / Math.max(1e-12, Math.abs(num) + Math.abs(an));
      if (rel > worst) { worst = rel; worstWhere = name + "[" + i + "] num=" + num + " an=" + an; }
    }
  };
  checkParam(MP.Wq, "Wq"); checkParam(MP.Watt, "Watt"); checkParam(MP.batt, "batt");
  log("m2-gradcheck worstRel=" + worst.toExponential(2) + " at " + worstWhere);
  return { worstRel: worst, worstWhere };
};
// frozen W6 loader (per seed)
async function loadFrozenW6(fs, G, seed) {
  let tr = null;
  try { tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-w-w6-s" + seed + ".json")); }
  catch (e) { tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-w-w6-s" + seed + "-800st.json")); }
  if (tr.verdict !== "COMPLETE") throw new Error("W6 train missing s" + seed);
  const M = inSeqMakeModel(G.makeRng(1));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(M.E, tr.P.E); load(M.W1, tr.P.W1); load(M.b1, tr.P.b1);
  load(M.Wf, tr.P.Wf); load(M.bf, tr.P.bf); load(M.Wc, tr.P.Wc); load(M.bc, tr.P.bc);
  for (let k = 0; k < 5; k++) { load(M.Wh[k], tr.P.Wh[k]); load(M.bh[k], tr.P.bh[k]); }
  load(M.Hv, tr.P.Hv); load(M.bv, tr.P.bv);
  return M;
}
globalThis.runM2Train = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const steps = 800, B = 16, lr = 5e-3, K = 5, H = 48, C = 6, auxW = 0.5;
  const tag = arm + "-s" + seed + "-" + steps + "st";
  const ledgerPath = "src/evidence/decomp/d-newai-self-" + tag + ".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  await globalThis.SelfM2R2Init(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const M = await loadFrozenW6(fs, G, seed);
  const MP = m2MakeParams(G.makeRng(75000 + seed * 7919 + m2r2ArmCode(arm) * 131));
  const opt = new G.Adam(lr);
  const newParams = [MP.Wq, MP.Watt, MP.batt];
  const dataRng = G.makeRng(42000 + seed * 104729 + 55);
  let fixedMasks = null; { const fr = G.makeRng(91000 + seed); fixedMasks = []; for (let k = 0; k < K; k++) { const m = new Float64Array(H); for (let i = 0; i < H; i++) m[i] = fr.int(10) < 5 ? 2 : 0; fixedMasks.push(m); } }
  const t0 = Date.now(), curve = [];
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  const isCtl = (arm === "m2-ctl");
  for (let step = 0; step < steps; step++) {
    for (const p of newParams) p.g.fill(0);
    // trunk grads: compute into throwaway? inSeqBackward accumulates into M.*.g; zero them each batch and never step (frozen, filed)
    for (const p of inSeqParams(M)) p.g.fill(0);
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
        sup = supE.map(se => ({ qkId: se.qk, vId: 4 + se.v, forceZero: isCtl }));
      } else {
        const ep = genAdaptEpisode(dataRng);
        e = ep.query;
        sup = ep.sup.map(se => ({ qkId: se.qk, vId: 4 + se.v, forceZero: isCtl, matchQk: se.qk === e.qk }));
      }
      const c0 = new Float64Array(8);
      const fw1 = inSeqForward(M, e.x, c0, fixedMasks);
      const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = M.E.v[e.qk * 12 + d];
      const fr = m2ReadForward(M, MP, Eqk, sup);
      const ensV = new Float64Array(4); for (let o = 0; o < 4; o++) ensV[o] = fw1.hvLog[o] + fr.readLogits[o];
      const ceHv = inCELossGrad(ensV, e.v);
      const dEns = new Float64Array(4); for (let o = 0; o < 4; o++) dEns[o] = ceHv.d[o] * auxW / B;
      const vhat = argmax4(ensV);
      const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
      const fw2 = inSeqForward(M, x2m, fw1.cNew, fixedMasks);
      const mean2 = inMeanLogits({ logitsK: fw2.logitsK });
      const ce2 = inCELossGrad(mean2, e.y);
      const dMean2 = new Float64Array(4); for (let o = 0; o < 4; o++) dMean2[o] = ce2.d[o] / B;
      lsum += ce2.loss + auxW * ceHv.loss;
      // backward: trunk grads discarded (frozen); only m2ReadBackward matters for new params.
      // Still call trunk backwards to keep caches honest? No — trunk frozen, skip trunk backward entirely
      // (filed: no trunk grads, no dc chain needed since carry frozen too). Only read backward.
      m2ReadBackward(M, MP, fr, dEns);
      void fw1; void fw2; void dMean2;
    }
    let s = 0; for (const p of newParams) for (let i = 0; i < p.g.length; i++) s += p.g[i] * p.g[i];
    const n = Math.sqrt(s); if (n > 1.0) { const sc = 1.0 / n; for (const p of newParams) for (let i = 0; i < p.g.length; i++) p.g[i] *= sc; }
    opt.step(newParams);
    if (step % 100 === 0 || step === steps - 1) curve.push({ step, loss: +(lsum / B).toFixed(6) });
  }
  const save = (o) => Array.from(o.v);
  const body = { spec: "self-m2r2-prereg", track: "M2", arm, seed, steps, B, lr, frozenTrunk: "W6-s" + seed, verdict: "COMPLETE", wallMs: Date.now() - t0, curve,
    P: { Wq: save(MP.Wq), Watt: save(MP.Watt), batt: save(MP.batt) } };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("m2-train " + tag + " loss0=" + curve[0].loss + " lossN=" + curve[curve.length - 1].loss);
  return body;
};
globalThis.runM2Eval = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const steps = 800, N = 200;
  const tag = arm + "-s" + seed + "-" + steps + "st";
  const ledgerPath = "src/evidence/decomp/d-newai-self-eval-" + tag + ".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  await globalThis.SelfM2R2Init(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const M = await loadFrozenW6(fs, G, seed);
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-" + tag + ".json"));
  const MP = m2MakeParams(G.makeRng(2));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(MP.Wq, tr.P.Wq); load(MP.Watt, tr.P.Watt); load(MP.batt, tr.P.batt);
  let evalMasks = null; { const fr2 = G.makeRng(91000 + seed); evalMasks = []; for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr2.int(10) < 5 ? 2 : 0; evalMasks.push(m); } }
  const srng = G.makeRng(52500 + seed);
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  const isCtl = (arm === "m2-ctl");
  let scr = 0, two = 0;
  const supRng = G.makeRng(42000 + seed * 104729 + 999);
  for (let i = 0; i < N; i++) {
    const e = inSeqGenShift(srng, null);
    const supE = [inSeqGenShift(supRng, null), inSeqGenShift(supRng, null), inSeqGenShift(supRng, null), inSeqGenShift(supRng, null)];
    const sup = supE.map(se => ({ qkId: se.qk, vId: 4 + se.v, forceZero: isCtl }));
    const fw1 = inSeqForward(M, e.x, new Float64Array(8), evalMasks);
    const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = M.E.v[e.qk * 12 + d];
    const fr = m2ReadForward(M, MP, Eqk, sup);
    const ensV = new Float64Array(4); for (let o = 0; o < 4; o++) ensV[o] = fw1.hvLog[o] + fr.readLogits[o];
    if (argmax4(ensV) === e.v) scr++;
    const vhat = argmax4(ensV);
    const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
    const fw2 = inSeqForward(M, x2m, fw1.cNew, evalMasks);
    if (argmax4(inMeanLogits({ logitsK: fw2.logitsK })) === e.y) two++;
  }
  const arng = G.makeRng(61000 + seed);
  let adaptV = 0, adaptY = 0, massSum = 0;
  for (let i = 0; i < N; i++) {
    const ep = genAdaptEpisode(arng);
    const sup = ep.sup.map(se => ({ qkId: se.qk, vId: 4 + se.v, forceZero: isCtl }));
    const e = ep.query;
    const fw1 = inSeqForward(M, e.x, new Float64Array(8), evalMasks);
    const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = M.E.v[e.qk * 12 + d];
    const fr = m2ReadForward(M, MP, Eqk, sup);
    let mass = 0;
    for (let j = 0; j < 4; j++) if (ep.sup[j].qk === e.qk) mass += fr.a[j];
    massSum += mass;
    const ensV = new Float64Array(4); for (let o = 0; o < 4; o++) ensV[o] = fw1.hvLog[o] + fr.readLogits[o];
    if (argmax4(ensV) === e.v) adaptV++;
    const vhat = argmax4(ensV);
    const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
    const fw2 = inSeqForward(M, x2m, fw1.cNew, evalMasks);
    if (argmax4(inMeanLogits({ logitsK: fw2.logitsK })) === e.y) adaptY++;
  }
  const body = { spec: "self-m2r2-prereg", track: "M2", arm, seed, steps, verdict: "COMPLETE", n: N, frozenTest: true,
    accScratch: +(scr / N).toFixed(4), accTwo: +(two / N).toFixed(4),
    adaptV: +(adaptV / N).toFixed(4), adaptY: +(adaptY / N).toFixed(4),
    meanMatchMass: +(massSum / N).toFixed(4) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("m2-eval " + tag + " stdTwo=" + body.accTwo + " adaptY=" + body.adaptY + " mass=" + body.meanMatchMass);
  return body;
};
// ---- R2 ----
function r2MakeParams(rng) {
  const Wc = inParam(rng, 48, 48); const bc = inParam(rng, 1, 48);
  bc.v[0] = 0;
  const wd = inParam(rng, 1, 1); const wb = inParam(rng, 1, 1); const b = inParam(rng, 1, 1);
  wd.v[0] = 0; wb.v[0] = 0; b.v[0] = 0;
  return { Wc, bc, wd, wb, b };
}
globalThis.r2GradCheck = async function (fs, log) {
  await globalThis.SelfM2R2Init(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const rng = G.makeRng(4342);
  const M = inSeqMakeModel(rng);
  const RP = r2MakeParams(G.makeRng(4343));
  const grng = G.makeRng(4345);
  const e = inSeqGenShift(grng, null);
  const masks = null;
  const compMasks = null; // decoupled check uses null for both (mask math identical; filed)
  const lossFn = () => {
    const f1 = inSeqForward(M, e.x, new Float64Array(8), masks);
    let vhat = 0; for (let o = 1; o < 4; o++) if (f1.hvLog[o] > f1.hvLog[vhat]) vhat = o;
    const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
    const f2 = inSeqForward(M, x2m, f1.cNew, masks);
    let z = RP.bc.v[0]; for (let i = 0; i < 48; i++) z += RP.Wc.v[i] * f2.h[i];
    const beta = 1 / (1 + Math.exp(-z));
    const dis2 = curVoteDisagree(f2.logitsK);
    const g = 1 / (1 + Math.exp(-(RP.wd.v[0] * dis2 + RP.wb.v[0] * beta + RP.b.v[0])));
    const f3 = inSeqForward(M, x2m, f2.cNew, compMasks);
    const m2 = inMeanLogits({ logitsK: f2.logitsK }), m3 = inMeanLogits({ logitsK: f3.logitsK });
    const fin = new Float64Array(4); for (let o = 0; o < 4; o++) fin[o] = g * m3[o] + (1 - g) * m2[o];
    const wrong2 = (function () { let b2 = 0; for (let o = 1; o < 4; o++) if (m2[o] > m2[b2]) b2 = o; return b2 === e.y ? 0 : 1; })();
    return inCELossGrad(fin, e.y).loss + 0.5 * (-(wrong2 * Math.log(beta + 1e-12) + (1 - wrong2) * Math.log(1 - beta + 1e-12)));
  };
  for (const p of [RP.Wc, RP.bc, RP.wd, RP.wb, RP.b]) p.g.fill(0);
  const fw1 = inSeqForward(M, e.x, new Float64Array(8), masks);
  let vhat = 0; for (let o = 1; o < 4; o++) if (fw1.hvLog[o] > fw1.hvLog[vhat]) vhat = o;
  const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
  const fw2 = inSeqForward(M, x2m, fw1.cNew, masks);
  let z = RP.bc.v[0]; for (let i = 0; i < 48; i++) z += RP.Wc.v[i] * fw2.h[i];
  const beta = 1 / (1 + Math.exp(-z));
  const dis2 = curVoteDisagree(fw2.logitsK);
  const g = 1 / (1 + Math.exp(-(RP.wd.v[0] * dis2 + RP.wb.v[0] * beta + RP.b.v[0])));
  const fw3 = inSeqForward(M, x2m, fw2.cNew, compMasks);
  const m2 = inMeanLogits({ logitsK: fw2.logitsK }), m3 = inMeanLogits({ logitsK: fw3.logitsK });
  const fin = new Float64Array(4); for (let o = 0; o < 4; o++) fin[o] = g * m3[o] + (1 - g) * m2[o];
  const ceF = inCELossGrad(fin, e.y);
  let b2 = 0; for (let o = 1; o < 4; o++) if (m2[o] > m2[b2]) b2 = o;
  const wrong2 = b2 === e.y ? 0 : 1;
  const dFin = ceF.d.slice();
  const dM3 = new Float64Array(4), dM2 = new Float64Array(4);
  for (let o = 0; o < 4; o++) { dM3[o] = dFin[o] * g; dM2[o] = dFin[o] * (1 - g); }
  void dM2; void dM3;
  let dg = 0; for (let o = 0; o < 4; o++) dg += dFin[o] * (m3[o] - m2[o]);
  const dsig = dg * g * (1 - g);
  const dBetaGate = dsig * RP.wb.v[0];
  RP.wd.g[0] += dsig * dis2; RP.wb.g[0] += dsig * beta; RP.b.g[0] += dsig;
  const dz = dBetaGate * beta * (1 - beta) + 0.5 * (beta - wrong2);
  RP.bc.g[0] += dz;
  for (let i = 0; i < 48; i++) RP.Wc.g[i] += dz * fw2.h[i];
  const eps = 1e-6;
  let worst = 0, worstWhere = "";
  const checkParam = (P, name) => {
    for (let i = 0; i < Math.min(P.v.length, 20); i++) {
      P.v[i] += eps; const a1 = lossFn();
      P.v[i] -= 2 * eps; const a0 = lossFn();
      P.v[i] += eps;
      const f1a = inSeqForward(M, e.x, new Float64Array(8), masks);
      let va = 0; for (let o = 1; o < 4; o++) if (f1a.hvLog[o] > f1a.hvLog[va]) va = o;
      if (va !== vhat) continue;
      const num = (a1 - a0) / (2 * eps), an = P.g[i];
      const rel = Math.abs(num - an) / Math.max(1e-12, Math.abs(num) + Math.abs(an));
      if (rel > worst) { worst = rel; worstWhere = name + "[" + i + "] num=" + num + " an=" + an; }
    }
  };
  checkParam(RP.Wc, "Wc"); checkParam(RP.bc, "bc"); checkParam(RP.wd, "wd"); checkParam(RP.wb, "wb"); checkParam(RP.b, "b");
  log("r2-gradcheck worstRel=" + worst.toExponential(2) + " at " + worstWhere);
  return { worstRel: worst, worstWhere };
};
globalThis.runR2Train = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const steps = 800, B = 16, lr = 5e-3, K = 5, H = 48, C = 6, auxW = 0.5;
  const tag = arm + "-s" + seed + "-" + steps + "st";
  const ledgerPath = "src/evidence/decomp/d-newai-self-" + tag + ".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  await globalThis.SelfM2R2Init(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const M = await loadFrozenW6(fs, G, seed);
  const RP = r2MakeParams(G.makeRng(75000 + seed * 7919 + m2r2ArmCode(arm) * 131));
  const newParams = [RP.Wc, RP.bc, RP.wd, RP.wb, RP.b];
  const opt = new G.Adam(lr);
  const dataRng = G.makeRng(42000 + seed * 104729 + 55);
  let fixedMasks = null, compMasks = null;
  { const fr = G.makeRng(91000 + seed); fixedMasks = []; for (let k = 0; k < K; k++) { const m = new Float64Array(H); for (let i = 0; i < H; i++) m[i] = fr.int(10) < 5 ? 2 : 0; fixedMasks.push(m); }
    compMasks = fixedMasks.map(m => { const c = new Float64Array(H); for (let i = 0; i < H; i++) c[i] = 2 - m[i]; return c; }); }
  const t0 = Date.now(), curve = [];
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  const isCtl = (arm === "r2-ctl");
  for (let step = 0; step < steps; step++) {
    for (const p of newParams) p.g.fill(0);
    for (const p of inSeqParams(M)) p.g.fill(0);
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
      const c0 = new Float64Array(8);
      const fw1 = inSeqForward(M, e.x, c0, fixedMasks);
      const vhat = argmax4(fw1.hvLog);
      const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
      const fw2 = inSeqForward(M, x2m, fw1.cNew, fixedMasks);
      let z = RP.bc.v[0]; for (let i = 0; i < H; i++) z += RP.Wc.v[i] * fw2.h[i];
      const beta = 1 / (1 + Math.exp(-z));
      const dis2 = curVoteDisagree(fw2.logitsK);
      const g = isCtl ? 1 : 1 / (1 + Math.exp(-(RP.wd.v[0] * dis2 + RP.wb.v[0] * beta + RP.b.v[0])));
      const fw3 = inSeqForward(M, x2m, fw2.cNew, compMasks);
      const m2 = inMeanLogits({ logitsK: fw2.logitsK }), m3 = inMeanLogits({ logitsK: fw3.logitsK });
      const fin = new Float64Array(4); for (let o = 0; o < 4; o++) fin[o] = g * m3[o] + (1 - g) * m2[o];
      const ceF = inCELossGrad(fin, e.y);
      const ceHv = inCELossGrad(fw1.hvLog, e.v);
      let p2 = 0; for (let o = 1; o < 4; o++) if (m2[o] > m2[p2]) p2 = o;
      const wrong2 = p2 === e.y ? 0 : 1;
      lsum += ceF.loss + auxW * ceHv.loss + 0.5 * (-(wrong2 * Math.log(beta + 1e-12) + (1 - wrong2) * Math.log(1 - beta + 1e-12)));
      const dFin = new Float64Array(4); for (let o = 0; o < 4; o++) dFin[o] = ceF.d[o] / B;
      let dg = 0; for (let o = 0; o < 4; o++) dg += dFin[o] * (m3[o] - m2[o]);
      if (!isCtl) {
        const dsig = dg * g * (1 - g);
        const dBetaGate = dsig * RP.wb.v[0];
        RP.wd.g[0] += dsig * dis2; RP.wb.g[0] += dsig * beta; RP.b.g[0] += dsig;
        const dz = dBetaGate * beta * (1 - beta) + 0.5 * (beta - wrong2) / B;
        RP.bc.g[0] += dz;
        for (let i = 0; i < H; i++) RP.Wc.g[i] += dz * fw2.h[i];
      } else {
        const dz = 0.5 * (beta - wrong2) / B;
        RP.bc.g[0] += dz;
        for (let i = 0; i < H; i++) RP.Wc.g[i] += dz * fw2.h[i];
      }
      void fw1; void fw2; void fw3;
    }
    let s = 0; for (const p of newParams) for (let i = 0; i < p.g.length; i++) s += p.g[i] * p.g[i];
    const n = Math.sqrt(s); if (n > 1.0) { const sc = 1.0 / n; for (const p of newParams) for (let i = 0; i < p.g.length; i++) p.g[i] *= sc; }
    opt.step(newParams);
    if (step % 100 === 0 || step === steps - 1) curve.push({ step, loss: +(lsum / B).toFixed(6) });
  }
  const save = (o) => Array.from(o.v);
  const body = { spec: "self-m2r2-prereg", track: "R2", arm, seed, steps, B, lr, frozenTrunk: "W6-s" + seed, compMasks: "2-fixedMasks", verdict: "COMPLETE", wallMs: Date.now() - t0, curve,
    P: { Wc: save(RP.Wc), bc: save(RP.bc), wd: save(RP.wd), wb: save(RP.wb), b: save(RP.b) } };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("r2-train " + tag + " loss0=" + curve[0].loss + " lossN=" + curve[curve.length - 1].loss);
  return body;
};
globalThis.runR2Eval = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const steps = 800, N = 200;
  const tag = arm + "-s" + seed + "-" + steps + "st";
  const ledgerPath = "src/evidence/decomp/d-newai-self-eval-" + tag + ".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  await globalThis.SelfM2R2Init(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const M = await loadFrozenW6(fs, G, seed);
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-" + tag + ".json"));
  const RP = r2MakeParams(G.makeRng(2));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(RP.Wc, tr.P.Wc); load(RP.bc, tr.P.bc); load(RP.wd, tr.P.wd); load(RP.wb, tr.P.wb); load(RP.b, tr.P.b);
  let evalMasks = null, compMasks = null;
  { const fr2 = G.makeRng(91000 + seed); evalMasks = []; for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr2.int(10) < 5 ? 2 : 0; evalMasks.push(m); }
    compMasks = evalMasks.map(m => { const c = new Float64Array(48); for (let i = 0; i < 48; i++) c[i] = 2 - m[i]; return c; }); }
  const srng = G.makeRng(52500 + seed), frng = G.makeRng(52400 + seed);
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  const isCtl = (arm === "r2-ctl");
  let scr = 0, two = 0, orc = 0, gAll = 0, gW = 0, gR = 0, nW = 0, nR = 0, calHigh = 0, calHighN = 0, calLow = 0, calLowN = 0;
  for (let i = 0; i < N; i++) {
    const e = inSeqGenShift(srng, null);
    const fw1 = inSeqForward(M, e.x, new Float64Array(8), evalMasks);
    if (argmax4(fw1.hvLog) === e.v) scr++;
    const vhat = argmax4(fw1.hvLog);
    const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
    const fw2 = inSeqForward(M, x2m, fw1.cNew, evalMasks);
    const m2 = inMeanLogits({ logitsK: fw2.logitsK });
    let p2 = 0; for (let o = 1; o < 4; o++) if (m2[o] > m2[p2]) p2 = o;
    const two2 = p2 === e.y;
    let z = RP.bc.v[0]; for (let j = 0; j < 48; j++) z += RP.Wc.v[j] * fw2.h[j];
    const beta = 1 / (1 + Math.exp(-z));
    const dis2 = curVoteDisagree(fw2.logitsK);
    const g = isCtl ? 1 : 1 / (1 + Math.exp(-(RP.wd.v[0] * dis2 + RP.wb.v[0] * beta + RP.b.v[0])));
    gAll += g;
    if (two2) { gR += g; nR++; } else { gW += g; nW++; }
    if (beta > 0.5) { calHigh += wrong2val(p2, e.y); calHighN++; } else { calLow += wrong2val(p2, e.y); calLowN++; }
    const fw3 = inSeqForward(M, x2m, fw2.cNew, compMasks);
    const m3 = inMeanLogits({ logitsK: fw3.logitsK });
    const fin = new Float64Array(4); for (let o = 0; o < 4; o++) fin[o] = g * m3[o] + (1 - g) * m2[o];
    if (argmax4(fin) === e.y) two++;
    const xo = [9, 9, 9, 9, 9, 9, e.qk, e.k, e.v, 8];
    const fwo = inSeqForward(M, xo, fw1.cNew, evalMasks);
    if (argmax4(inMeanLogits({ logitsK: fwo.logitsK })) === e.y) orc++;
  }
  function wrong2val(p2, y) { return p2 === y ? 0 : 1; }
  let fF = 0;
  for (let i = 0; i < N; i++) {
    const e = inSeqGenShift(frng, 0);
    const fw = inSeqForward(M, e.x, new Float64Array(8), evalMasks);
    if (argmax4(inMeanLogits({ logitsK: fw.logitsK })) === e.y) fF++;
  }
  const body = { spec: "self-m2r2-prereg", track: "R2", arm, seed, steps, verdict: "COMPLETE", n: N, frozenTest: true,
    accScratch: +(scr / N).toFixed(4), accTwo: +(two / N).toFixed(4), accOracle: +(orc / N).toFixed(4), accFwd: +(fF / N).toFixed(4),
    meanGate: +(gAll / N).toFixed(4), meanGateWrong2: +(nW ? gW / nW : 0).toFixed(4), meanGateRight2: +(nR ? gR / nR : 0).toFixed(4),
    calGap: +(((calHighN ? calHigh / calHighN : 0) - (calLowN ? calLow / calLowN : 0))).toFixed(4) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("r2-eval " + tag + " two=" + body.accTwo + " g=" + body.meanGate + " gW=" + body.meanGateWrong2 + " gR=" + body.meanGateRight2 + " calGap=" + body.calGap);
  return body;
};
globalThis.runW6AdaptBaseline = async function (fs, log, opts) {
  const { seed } = opts;
  const tag = "w6adapt-s" + seed + "-800st";
  const ledgerPath = "src/evidence/decomp/d-newai-self-eval-" + tag + ".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  await globalThis.SelfM2R2Init(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const M = await loadFrozenW6(fs, G, seed);
  let evalMasks = null; { const fr2 = G.makeRng(91000 + seed); evalMasks = []; for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr2.int(10) < 5 ? 2 : 0; evalMasks.push(m); } }
  const arng = G.makeRng(61000 + seed);
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  const N = 200;
  let adaptV = 0, adaptY = 0;
  for (let i = 0; i < N; i++) {
    const ep = genAdaptEpisode(arng);
    const e = ep.query;
    const fw1 = inSeqForward(M, e.x, new Float64Array(8), evalMasks);
    if (argmax4(fw1.hvLog) === e.v) adaptV++;
    const vhat = argmax4(fw1.hvLog);
    const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
    const fw2 = inSeqForward(M, x2m, fw1.cNew, evalMasks);
    if (argmax4(inMeanLogits({ logitsK: fw2.logitsK })) === e.y) adaptY++;
  }
  const body = { spec: "self-m2r2-prereg", track: "W6-ADAPT-BASELINE", seed, verdict: "COMPLETE", n: N, adaptV: +(adaptV / N).toFixed(4), adaptY: +(adaptY / N).toFixed(4) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("w6-adapt s" + seed + " adaptY=" + body.adaptY + " adaptV=" + body.adaptV);
  return body;
};
