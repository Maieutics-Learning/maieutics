// newai-selfmr-driver.js — Tracks M (notebook) + R (gated 3rd pass). CPU/in-worker Float64.
// Base recipe everywhere = W6 (C=6 pick auxW0.5 800st masked truncated lam2 boot).
// Twin-matched: init 74000+seed*7919+armCode*131; data 42000+seed*104729+55;
// masks 91000+seed; eval 52500/52400+seed. COMPLETE-gated. NO PUSH.
// Deviations filed openly:
//  - dis (vote-disagree) is a non-differentiable constant feature for gates
//    (same status as cur-pick selection); trunk gets no grad through dis.
//  - support trunk forwards contribute no grad (only dis); E key/value lookups do.
//  - inSeqBackward drops dh-from-carry (intrinsic-driver NOTE); checks use
//    DECOUPLED carry (all passes from zeros, dc discarded) so remaining paths exact.
//  - M read: q=Wq*E[qk_q], keys=E[qk_s] raw, values=g_s*E[4+v_s] raw,
//    ctx=softmax(q.k/sqrtD)*values, readLogits=Watt*ctx+batt,
//    ensV=hvLog+readLogits. Params: Wq 144 + Watt 48 + batt 4 + wg 1 + bg 1 = 198
//    (prereg ~160 was estimate; actual filed here).
//  - M-ctl: write forced 0 (g_s=0), same params (Watt gets ~0 grad, batt learns bias;
//    isolates USE, mirrors F-ctl/att-ctl logic).
//  - R: pass3 = trunk forward on x2m with carry=cNew2 (chained depth); final=g*mean3+(1-g)*mean2.
//    Params wg 1 + bg 1 = 2 (prereg ~4 was estimate). R-ctl g forced 1 (always-open, same FLOPs).
//  - Adapt episodes: 2 in-episode novel pairs (ka,va),(kb,vb) distinct; 4 support lines
//    (2 per pair, flat contains both novels + 1 distractor, queryable); 1 query whose flat
//    is 3 distractor pairs (answer missing) asking ka or kb. Trunk-alone must fail (no answer
//    in flat); notebook can succeed. "Novel" = novel-in-episode (filed; globally all 16 combos
//    occur in training distribution).
globalThis.SelfMRInit = async function (fs) {
  for (const p of ["src/evidence/decomp/intrinsic-driver.js", "src/evidence/decomp/newai-driver.js", "src/evidence/decomp/newai-v102-driver.js", "src/evidence/decomp/newai-fr-driver.js", "src/evidence/decomp/newai-div-driver.js", "src/evidence/decomp/newai-cur-driver.js", "src/evidence/decomp/newai-winner-driver.js"]) {
    const src = await fs.readTextFile(p); (0, eval)(src + "\n//# sourceURL=" + p);
  }
  if (!globalThis.runWinnerTrain) throw new Error("selfmr stack load failed");
};
function mrArmCode(arm) {
  if (arm === "m-nb") return 94; if (arm === "m-ctl") return 95;
  if (arm === "r-gate") return 96; if (arm === "r-ctl") return 97; return 94;
}
function mrIsMCtl(arm) { return arm === "m-ctl"; }
function mrIsRCtl(arm) { return arm === "r-ctl"; }
// ---- M params ----
function mMakeParams(rng) {
  const Wq = inParam(rng, 12 * 12, 12);
  const Watt = inParam(rng, 4 * 12, 12);
  const batt = inParam(rng, 4, 12);
  const wg = inParam(rng, 1, 1); const bg = inParam(rng, 1, 1);
  wg.v[0] = 0; bg.v[0] = 0; // v1.1 pins-only: max-gradient start (sigmoid 0.5)
  return { Wq, Watt, batt, wg, bg };
}
function mParams(MP) { return [MP.Wq, MP.Watt, MP.batt, MP.wg, MP.bg]; }
function mSigmoid(x) { return 1 / (1 + Math.exp(-x)); }
const M_SQRTD = 3.4641016151377544;
// support: array of {qkId, vId (4+v), dis}; query Eqk; returns read cache
function mReadForward(M, MP, Eqk_q, sup) {
  const D = 12;
  const q = new Float64Array(D);
  for (let o = 0; o < D; o++) { let s = 0; for (let j = 0; j < D; j++) s += MP.Wq.v[o * D + j] * Eqk_q[j]; q[o] = s; }
  const keys = [], vals = [], gates = [];
  for (const s of sup) {
    const k = new Float64Array(D), vr = new Float64Array(D);
    for (let d = 0; d < D; d++) { k[d] = M.E.v[s.qkId * D + d]; vr[d] = M.E.v[s.vId * D + d]; }
    const g = s.forceZero ? 0 : mSigmoid(MP.wg.v[0] * s.dis + MP.bg.v[0]);
    const v = new Float64Array(D); for (let d = 0; d < D; d++) v[d] = g * vr[d];
    keys.push(k); vals.push({ raw: vr, scaled: v, vId: s.vId }); gates.push(g);
  }
  const sc = new Float64Array(sup.length);
  for (let i = 0; i < sup.length; i++) { let dot = 0; for (let d = 0; d < D; d++) dot += q[d] * keys[i][d]; sc[i] = dot / M_SQRTD; }
  let mx = sc[0]; for (let i = 1; i < sc.length; i++) if (sc[i] > mx) mx = sc[i];
  const a = new Float64Array(sup.length); let sm = 0;
  for (let i = 0; i < sup.length; i++) { a[i] = Math.exp(sc[i] - mx); sm += a[i]; }
  for (let i = 0; i < sup.length; i++) a[i] /= sm;
  const ctx = new Float64Array(D);
  for (let i = 0; i < sup.length; i++) for (let d = 0; d < D; d++) ctx[d] += a[i] * vals[i].scaled[d];
  const readLogits = new Float64Array(4);
  for (let o = 0; o < 4; o++) { let t = MP.batt.v[o]; for (let d = 0; d < D; d++) t += MP.Watt.v[o * D + d] * ctx[d]; readLogits[o] = t; }
  return { q, Eqk_q: Eqk_q.slice(), keys, vals, gates, sc, a, ctx, readLogits, supIds: sup.map(s => ({ qkId: s.qkId, vId: s.vId, dis: s.dis, forceZero: !!s.forceZero })) };
}
function mReadBackward(M, MP, fw, dRead) {
  // dRead = dL/dreadLogits (4)
  const D = 12, n = fw.keys.length;
  const dctx = new Float64Array(D);
  for (let o = 0; o < 4; o++) {
    MP.batt.g[o] += dRead[o];
    for (let d = 0; d < D; d++) { MP.Watt.g[o * D + d] += dRead[o] * fw.ctx[d]; dctx[d] += dRead[o] * MP.Watt.v[o * D + d]; }
  }
  // ctx = sum a_i * g_i * raw_i
  const da = new Float64Array(n);
  const dg = new Float64Array(n);
  const draw = [];
  for (let i = 0; i < n; i++) {
    let dot = 0; for (let d = 0; d < D; d++) dot += dctx[d] * fw.vals[i].raw[d];
    // dL/da_i via ctx path: dot(dctx, g_i*raw_i)
    da[i] = dot * fw.gates[i];
    // dL/dg_i: a_i * dot(dctx, raw_i)
    dg[i] = fw.supIds[i].forceZero ? 0 : dot * fw.a[i];
    const dvi = new Float64Array(D);
    for (let d = 0; d < D; d++) dvi[d] = fw.a[i] * fw.gates[i] * dctx[d];
    draw.push(dvi);
    // E grad for value raw: dvi flows to E[vId] (scaled by gate already in dvi? dvi = a*g*dctx, correct)
    for (let d = 0; d < D; d++) M.E.g[fw.supIds[i].vId * D + d] += dvi[d];
    // gate param grads
    if (!fw.supIds[i].forceZero) {
      const g = fw.gates[i], dis = fw.supIds[i].dis;
      const dsig = dg[i] * g * (1 - g);
      MP.wg.g[0] += dsig * dis;
      MP.bg.g[0] += dsig;
    }
  }
  // softmax: ds = a*(da - ada)
  let ada = 0; for (let i = 0; i < n; i++) ada += da[i] * fw.a[i];
  const ds = new Float64Array(n);
  for (let i = 0; i < n; i++) ds[i] = fw.a[i] * (da[i] - ada);
  const dq = new Float64Array(D);
  const dkeys = [];
  for (let i = 0; i < n; i++) {
    const dk = new Float64Array(D);
    for (let d = 0; d < D; d++) { dq[d] += ds[i] * fw.keys[i][d] / M_SQRTD; dk[d] = ds[i] * fw.q[d] / M_SQRTD; }
    dkeys.push(dk);
    for (let d = 0; d < D; d++) M.E.g[fw.supIds[i].qkId * D + d] += dk[d];
  }
  // Wq grad + Eqk_q grad
  for (let o = 0; o < D; o++) for (let j = 0; j < D; j++) MP.Wq.g[o * D + j] += dq[o] * fw.Eqk_q[j];
  // NOTE: Eqk_q is E[qk_q]; its grad = Wq^T dq, accumulated by caller (needs qkId). Return it.
  const dEqk = new Float64Array(D);
  for (let j = 0; j < D; j++) { let s = 0; for (let o = 0; o < D; o++) s += MP.Wq.v[o * D + j] * dq[o]; dEqk[j] = s; }
  return { dEqk };
}
// adapt episode generator (seed-keyed via passed rng)
function genAdaptEpisode(rng) {
  // 2 novel-in-episode pairs distinct
  let ka = rng.int(4), kb = rng.int(4);
  while (kb === ka) kb = rng.int(4);
  const va = rng.int(4), vb = rng.int(4);
  // distractor pool: pairs not equal to novels
  const pool = [];
  for (let k = 0; k < 4; k++) for (let v = 0; v < 4; v++) {
    if ((k === ka && v === va) || (k === kb && v === vb)) continue;
    pool.push([k, v]);
  }
  // shuffle pool
  for (let i = pool.length - 1; i > 0; i--) { const j = rng.int(i + 1), t = pool[i]; pool[i] = pool[j]; pool[j] = t; }
  const mkLine = (qk, v, flatPairs) => {
    const cp = flatPairs.slice();
    for (let i = cp.length - 1; i > 0; i--) { const j = rng.int(i + 1), t = cp[i]; cp[i] = cp[j]; cp[j] = t; }
    const flat = []; for (const [k2, v2] of cp) flat.push(k2, 4 + v2);
    const k = 1 + rng.int(3);
    return { flat, qk, k, v, y: (v + k) % 4, x: flat.concat([qk, k, 0, 8]) };
  };
  // support: 2x ka + 2x kb, each flat contains both novels + 1 distractor
  const d0 = pool[0], d1 = pool[1], d2 = pool[2], d3 = pool[3];
  const sup = [
    mkLine(ka, va, [[ka, va], [kb, vb], d0]),
    mkLine(ka, va, [[ka, va], [kb, vb], d1]),
    mkLine(kb, vb, [[ka, va], [kb, vb], d2]),
    mkLine(kb, vb, [[ka, va], [kb, vb], d3]),
  ];
  // query: ask ka or kb, flat = 3 distractors (answer missing)
  const askA = rng.int(2) === 0;
  const qk = askA ? ka : kb, v = askA ? va : vb;
  const qflat = [pool[4], pool[5], pool[6]];
  const k = 1 + rng.int(3);
  const flat = []; { const cp = qflat.slice(); for (let i = cp.length - 1; i > 0; i--) { const j = rng.int(i + 1), t = cp[i]; cp[i] = cp[j]; cp[j] = t; } for (const [k2, v2] of cp) flat.push(k2, 4 + v2); }
  const query = { flat, qk, k, v, y: (v + k) % 4, x: flat.concat([qk, k, 0, 8]) };
  return { sup, query, ka, kb, va, vb };
}
globalThis.mGradCheck = async function (fs, log) {
  await globalThis.SelfMRInit(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const rng = G.makeRng(4242);
  const M = inSeqMakeModel(rng);
  const MP = mMakeParams(G.makeRng(4243));
  const grng = G.makeRng(4245);
  const e_q = inSeqGenShift(grng, null);
  const supE = [inSeqGenShift(grng, null), inSeqGenShift(grng, null), inSeqGenShift(grng, null), inSeqGenShift(grng, null)];
  const masks = null, c0 = new Float64Array(8);
  // support dis (constants)
  const sup = supE.map(e => {
    const fw = inSeqForward(M, e.x, new Float64Array(8), masks);
    return { qkId: e.qk, vId: 4 + e.v, dis: curVoteDisagree(fw.logitsK) };
  });
  const Eqk_q = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk_q[d] = M.E.v[e_q.qk * 12 + d];
  const lossFn = () => {
    const f1 = inSeqForward(M, e_q.x, new Float64Array(8), masks);
    const Eq = new Float64Array(12); for (let d = 0; d < 12; d++) Eq[d] = M.E.v[e_q.qk * 12 + d];
    const fr = mReadForward(M, MP, Eq, sup);
    const ens = new Float64Array(4); for (let o = 0; o < 4; o++) ens[o] = f1.hvLog[o] + fr.readLogits[o];
    return inCELossGrad(ens, e_q.v).loss * 0.5;
  };
  // analytic
  for (const p of inSeqParams(M)) p.g.fill(0);
  for (const p of mParams(MP)) p.g.fill(0);
  const fw1 = inSeqForward(M, e_q.x, new Float64Array(8), masks);
  const fr = mReadForward(M, MP, Eqk_q, sup);
  const ensV = new Float64Array(4); for (let o = 0; o < 4; o++) ensV[o] = fw1.hvLog[o] + fr.readLogits[o];
  const ce = inCELossGrad(ensV, e_q.v);
  const dEns = new Float64Array(4); for (let o = 0; o < 4; o++) dEns[o] = ce.d[o] * 0.5;
  const dHv = dEns.slice(), dRead = dEns.slice();
  const rb = mReadBackward(M, MP, fr, dRead);
  for (let d = 0; d < 12; d++) M.E.g[e_q.qk * 12 + d] += rb.dEqk[d];
  inSeqBackward(M, fw1, null, null, dHv, null, masks);
  const eps = 1e-6;
  let worst = 0, worstWhere = "", skips = 0;
  const checkParam = (P, name, idxs) => {
    const ii = idxs || P.v.map((_, i) => i).filter(i => i < 20);
    for (const i of ii) {
      P.v[i] += eps; const a1 = lossFn();
      P.v[i] -= 2 * eps; const a0 = lossFn();
      P.v[i] += eps;
      const num = (a1 - a0) / (2 * eps), an = P.g[i];
      const absd = Math.abs(num - an);
      const rel = absd / Math.max(1e-12, Math.abs(num) + Math.abs(an));
      if (rel > worst) { worst = rel; worstWhere = name + "[" + i + "] num=" + num + " an=" + an; }
    }
  };
  checkParam(MP.Wq, "Wq"); checkParam(MP.Watt, "Watt"); checkParam(MP.batt, "batt"); checkParam(MP.wg, "wg"); checkParam(MP.bg, "bg");
  checkParam(M.Hv, "Hv"); checkParam(M.bv, "bv");
  // E rows used
  const ids = new Set([e_q.qk].concat(sup.map(s => s.qkId)).concat(sup.map(s => s.vId)));
  for (const id of ids) for (let d = 0; d < 3; d++) {
    M.E.v[id * 12 + d] += eps; const a1 = lossFn();
    M.E.v[id * 12 + d] -= 2 * eps; const a0 = lossFn();
    M.E.v[id * 12 + d] += eps;
    const num = (a1 - a0) / (2 * eps), an = M.E.g[id * 12 + d];
    const absd = Math.abs(num - an);
    const rel = absd / Math.max(1e-12, Math.abs(num) + Math.abs(an));
    if (rel > worst && absd > 1e-9) { worst = rel; worstWhere = "E[" + id + "][" + d + "] num=" + num + " an=" + an; }
  }
  log("m-gradcheck worstRel=" + worst.toExponential(2) + " at " + worstWhere + " skips=" + skips);
  return { worstRel: worst, worstWhere };
};
// ---- M train/eval ----
globalThis.runMTrain = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const steps = 800, B = 16, lr = 5e-3, K = 5, H = 48, C = 6, auxW = 0.5, lam = 2.0;
  const tag = arm + "-s" + seed + "-" + steps + "st";
  const ledgerPath = "src/evidence/decomp/d-newai-self-" + tag + ".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  await globalThis.SelfMRInit(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const rng = G.makeRng(74000 + seed * 7919 + mrArmCode(arm) * 131);
  const M = inSeqMakeModel(rng);
  const MP = mMakeParams(G.makeRng(74001 + seed * 131 + mrArmCode(arm) * 17));
  const params = inSeqParams(M).concat(mParams(MP));
  const opt = new G.Adam(lr);
  const dataRng = G.makeRng(42000 + seed * 104729 + 55);
  let fixedMasks = null; { const fr = G.makeRng(91000 + seed); fixedMasks = []; for (let k = 0; k < K; k++) { const m = new Float64Array(H); for (let i = 0; i < H; i++) m[i] = fr.int(10) < 5 ? 2 : 0; fixedMasks.push(m); } }
  const t0 = Date.now(), curve = [];
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  let gSumSup = 0, gNSup = 0;
  for (let step = 0; step < steps; step++) {
    for (const p of params) p.g.fill(0);
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
      // 4 support lines (same stream, paired across arms)
      const supE = [inSeqGenShift(dataRng, null), inSeqGenShift(dataRng, null), inSeqGenShift(dataRng, null), inSeqGenShift(dataRng, null)];
      const sup = supE.map(se => {
        const fw = inSeqForward(M, se.x, new Float64Array(8), fixedMasks);
        return { qkId: se.qk, vId: 4 + se.v, dis: curVoteDisagree(fw.logitsK), forceZero: mrIsMCtl(arm) };
      });
      const c0 = new Float64Array(8);
      const fw1 = inSeqForward(M, e.x, c0, fixedMasks);
      const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = M.E.v[e.qk * 12 + d];
      const fr = mReadForward(M, MP, Eqk, sup);
      const ensV = new Float64Array(4); for (let o = 0; o < 4; o++) ensV[o] = fw1.hvLog[o] + fr.readLogits[o];
      const ceHv = inCELossGrad(ensV, e.v);
      const dEns = new Float64Array(4); for (let o = 0; o < 4; o++) dEns[o] = ceHv.d[o] * auxW / B;
      const vhat = argmax4(ensV);
      const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
      const fw2 = inSeqForward(M, x2m, fw1.cNew, fixedMasks);
      const perHead1 = fw1.logitsK.map((lg, k) => {
        if ((b % K) !== k) return new Float64Array(4);
        const ce = inCELossGrad(lg, e.y); const d = new Float64Array(4);
        for (let o = 0; o < 4; o++) d[o] = ce.d[o] * 0.1 * K / B;
        return d;
      });
      const perHead2 = fw2.logitsK.map((lg, k) => {
        if ((b % K) !== k) return new Float64Array(4);
        const ce = inCELossGrad(lg, e.y); const d = new Float64Array(4);
        for (let o = 0; o < 4; o++) d[o] = ce.d[o] * 0.1 * K / B;
        return d;
      });
      const mean2 = inMeanLogits({ logitsK: fw2.logitsK });
      const ce2 = inCELossGrad(mean2, e.y);
      const dMean2 = new Float64Array(4); for (let o = 0; o < 4; o++) dMean2[o] = ce2.d[o] / B;
      const mean1 = inMeanLogits({ logitsK: fw1.logitsK });
      const ce1m = inCELossGrad(mean1, e.y);
      const dMean1 = new Float64Array(4); for (let o = 0; o < 4; o++) dMean1[o] = ce1m.d[o] * 0.3 / B;
      lsum += ce2.loss + auxW * ceHv.loss;
      const dc = inSeqBackward(M, fw2, dMean2, perHead2, null, null, fixedMasks);
      // read backward BEFORE fw1 backward (both accumulate into E)
      const rb = mReadBackward(M, MP, fr, dEns);
      for (let d = 0; d < 12; d++) M.E.g[e.qk * 12 + d] += rb.dEqk[d];
      inSeqBackward(M, fw1, dMean1, perHead1, dEns.slice(), dc, fixedMasks);
      // lam to mirror W6
      const meanW = new Float64Array(M.Wh[0].v.length);
      for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) meanW[i] += M.Wh[k].v[i] / K;
      for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) M.Wh[k].g[i] += lam * (M.Wh[k].v[i] - meanW[i]) / (B * M.H);
      if (step % 200 === 0 && b === 0) { for (const s of sup) { gSumSup += s.forceZero ? 0 : mSigmoid(MP.wg.v[0] * s.dis + MP.bg.v[0]); gNSup++; } }
    }
    let s = 0; for (const p of params) for (let i = 0; i < p.g.length; i++) s += p.g[i] * p.g[i];
    const n = Math.sqrt(s); if (n > 1.0) { const sc = 1.0 / n; for (const p of params) for (let i = 0; i < p.g.length; i++) p.g[i] *= sc; }
    opt.step(params);
    if (step % 100 === 0 || step === steps - 1) curve.push({ step, loss: +(lsum / B).toFixed(6) });
  }
  const save = (o) => Array.from(o.v);
  const body = { spec: "self-tools-prereg", track: "M", arm, seed, steps, B, lr, K, H, C, auxW, lam, verdict: "COMPLETE", wallMs: Date.now() - t0, frozen: true, curve, divCos: +inMeanCos(M).toFixed(4), meanGateTrain: +(gNSup ? gSumSup / gNSup : 0).toFixed(4),
    P: { E: save(M.E), W1: save(M.W1), b1: save(M.b1), Wf: save(M.Wf), bf: save(M.bf), Wc: save(M.Wc), bc: save(M.bc), Wh: M.Wh.map(save), bh: M.bh.map(save), Hv: save(M.Hv), bv: save(M.bv),
      Wq: save(MP.Wq), Watt: save(MP.Watt), batt: save(MP.batt), wg: save(MP.wg), bg: save(MP.bg) } };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("m-train " + tag + " loss0=" + curve[0].loss + " lossN=" + curve[curve.length - 1].loss + " gate=" + body.meanGateTrain);
  return body;
};
globalThis.runMEval = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const steps = 800, N = 200;
  const tag = arm + "-s" + seed + "-" + steps + "st";
  const ledgerPath = "src/evidence/decomp/d-newai-self-eval-" + tag + ".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  await globalThis.SelfMRInit(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-" + tag + ".json"));
  if (tr.verdict !== "COMPLETE") throw new Error("m train missing " + tag);
  const M = inSeqMakeModel(G.makeRng(1));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(M.E, tr.P.E); load(M.W1, tr.P.W1); load(M.b1, tr.P.b1);
  load(M.Wf, tr.P.Wf); load(M.bf, tr.P.bf); load(M.Wc, tr.P.Wc); load(M.bc, tr.P.bc);
  for (let k = 0; k < 5; k++) { load(M.Wh[k], tr.P.Wh[k]); load(M.bh[k], tr.P.bh[k]); }
  load(M.Hv, tr.P.Hv); load(M.bv, tr.P.bv);
  const MP = mMakeParams(G.makeRng(2));
  load(MP.Wq, tr.P.Wq); load(MP.Watt, tr.P.Watt); load(MP.batt, tr.P.batt); load(MP.wg, tr.P.wg); load(MP.bg, tr.P.bg);
  let evalMasks = null; { const fr2 = G.makeRng(91000 + seed); evalMasks = []; for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr2.int(10) < 5 ? 2 : 0; evalMasks.push(m); } }
  const srng = G.makeRng(52500 + seed), frng = G.makeRng(52400 + seed);
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  let scr = 0, one = 0, two = 0, orc = 0;
  // standard eval WITH notebook from random support (same diet as train: 4 random supports)
  const supRng = G.makeRng(42000 + seed * 104729 + 999);
  for (let i = 0; i < N; i++) {
    const e = inSeqGenShift(srng, null);
    const supE = [inSeqGenShift(supRng, null), inSeqGenShift(supRng, null), inSeqGenShift(supRng, null), inSeqGenShift(supRng, null)];
    const sup = supE.map(se => {
      const fw = inSeqForward(M, se.x, new Float64Array(8), evalMasks);
      return { qkId: se.qk, vId: 4 + se.v, dis: curVoteDisagree(fw.logitsK), forceZero: mrIsMCtl(arm) };
    });
    const c0 = new Float64Array(8);
    const fw1 = inSeqForward(M, e.x, c0, evalMasks);
    const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = M.E.v[e.qk * 12 + d];
    const fr = mReadForward(M, MP, Eqk, sup);
    const ensV = new Float64Array(4); for (let o = 0; o < 4; o++) ensV[o] = fw1.hvLog[o] + fr.readLogits[o];
    const vhat = argmax4(ensV);
    if (vhat === e.v) scr++;
    if (argmax4(inMeanLogits({ logitsK: fw1.logitsK })) === e.y) one++;
    const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
    const fw2 = inSeqForward(M, x2m, fw1.cNew, evalMasks);
    if (argmax4(inMeanLogits({ logitsK: fw2.logitsK })) === e.y) two++;
    const xo = [9, 9, 9, 9, 9, 9, e.qk, e.k, e.v, 8];
    const fwo = inSeqForward(M, xo, fw1.cNew, evalMasks);
    if (argmax4(inMeanLogits({ logitsK: fwo.logitsK })) === e.y) orc++;
  }
  let fF = 0;
  for (let i = 0; i < N; i++) {
    const e = inSeqGenShift(frng, 0);
    const fw = inSeqForward(M, e.x, new Float64Array(8), evalMasks);
    if (argmax4(inMeanLogits({ logitsK: fw.logitsK })) === e.y) fF++;
  }
  // adapt eval: notebook from TRUE support vs ctl
  const arng = G.makeRng(61000 + seed);
  let adaptV = 0, adaptY = 0, gSupSum = 0, gSupN = 0, gRandSum = 0, gRandN = 0;
  for (let i = 0; i < N; i++) {
    const ep = genAdaptEpisode(arng);
    const sup = ep.sup.map(se => {
      const fw = inSeqForward(M, se.x, new Float64Array(8), evalMasks);
      const dis = curVoteDisagree(fw.logitsK);
      const g = mrIsMCtl(arm) ? 0 : mSigmoid(MP.wg.v[0] * dis + MP.bg.v[0]);
      gSupSum += g; gSupN++;
      return { qkId: se.qk, vId: 4 + se.v, dis, forceZero: mrIsMCtl(arm) };
    });
    // random baseline gates (same MP, random lines)
    for (let r = 0; r < 2; r++) {
      const re = inSeqGenShift(arng, null);
      const fw = inSeqForward(M, re.x, new Float64Array(8), evalMasks);
      const dis = curVoteDisagree(fw.logitsK);
      const g = mrIsMCtl(arm) ? 0 : mSigmoid(MP.wg.v[0] * dis + MP.bg.v[0]);
      gRandSum += g; gRandN++;
    }
    const e = ep.query;
    const fw1 = inSeqForward(M, e.x, new Float64Array(8), evalMasks);
    const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = M.E.v[e.qk * 12 + d];
    const fr = mReadForward(M, MP, Eqk, sup);
    const ensV = new Float64Array(4); for (let o = 0; o < 4; o++) ensV[o] = fw1.hvLog[o] + fr.readLogits[o];
    if (argmax4(ensV) === e.v) adaptV++;
    const vhat = argmax4(ensV);
    const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
    const fw2 = inSeqForward(M, x2m, fw1.cNew, evalMasks);
    if (argmax4(inMeanLogits({ logitsK: fw2.logitsK })) === e.y) adaptY++;
  }
  const body = { spec: "self-tools-prereg", track: "M", arm, seed, steps, verdict: "COMPLETE", n: N, frozenTest: true,
    accScratch: +(scr / N).toFixed(4), accOne: +(one / N).toFixed(4), accTwo: +(two / N).toFixed(4),
    accOracle: +(orc / N).toFixed(4), accFwd: +(fF / N).toFixed(4),
    adaptV: +(adaptV / N).toFixed(4), adaptY: +(adaptY / N).toFixed(4),
    meanGateSupport: +(gSupN ? gSupSum / gSupN : 0).toFixed(4), meanGateRandom: +(gRandN ? gRandSum / gRandN : 0).toFixed(4) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("m-eval " + tag + " scr=" + body.accScratch + " two=" + body.accTwo + " adaptY=" + body.adaptY + " gSup=" + body.meanGateSupport + " gRand=" + body.meanGateRandom);
  return body;
};
// ---- R params + gradcheck + train/eval ----
function rMakeParams(rng) {
  const wg = inParam(rng, 1, 1); const bg = inParam(rng, 1, 1);
  wg.v[0] = 0; bg.v[0] = 0;
  return { wg, bg };
}
function rParams(RP) { return [RP.wg, RP.bg]; }
globalThis.rGradCheck = async function (fs, log) {
  await globalThis.SelfMRInit(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const rng = G.makeRng(4342);
  const M = inSeqMakeModel(rng);
  const RP = rMakeParams(G.makeRng(4343));
  const grng = G.makeRng(4345);
  const e = inSeqGenShift(grng, null);
  const masks = null;
  const lossFn = () => {
    const f1 = inSeqForward(M, e.x, new Float64Array(8), masks);
    let vhat = 0; for (let o = 1; o < 4; o++) if (f1.hvLog[o] > f1.hvLog[vhat]) vhat = o;
    const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
    const f2 = inSeqForward(M, x2m, f1.cNew, masks);
    const dis2 = curVoteDisagree(f2.logitsK);
    const g = 1 / (1 + Math.exp(-(RP.wg.v[0] * dis2 + RP.bg.v[0])));
    const f3 = inSeqForward(M, x2m, f2.cNew, masks);
    const m2 = inMeanLogits({ logitsK: f2.logitsK }), m3 = inMeanLogits({ logitsK: f3.logitsK });
    const fin = new Float64Array(4); for (let o = 0; o < 4; o++) fin[o] = g * m3[o] + (1 - g) * m2[o];
    return inCELossGrad(fin, e.y).loss + 0.5 * inCELossGrad(f1.hvLog, e.v).loss;
  };
  for (const p of inSeqParams(M)) p.g.fill(0);
  for (const p of rParams(RP)) p.g.fill(0);
  const fw1 = inSeqForward(M, e.x, new Float64Array(8), masks);
  let vhat = 0; for (let o = 1; o < 4; o++) if (fw1.hvLog[o] > fw1.hvLog[vhat]) vhat = o;
  const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
  const fw2 = inSeqForward(M, x2m, fw1.cNew, masks);
  const dis2 = curVoteDisagree(fw2.logitsK);
  const g = mSigmoid(RP.wg.v[0] * dis2 + RP.bg.v[0]);
  const fw3 = inSeqForward(M, x2m, fw2.cNew, masks);
  const m2 = inMeanLogits({ logitsK: fw2.logitsK }), m3 = inMeanLogits({ logitsK: fw3.logitsK });
  const fin = new Float64Array(4); for (let o = 0; o < 4; o++) fin[o] = g * m3[o] + (1 - g) * m2[o];
  const ceF = inCELossGrad(fin, e.y);
  const ceH = inCELossGrad(fw1.hvLog, e.v);
  const dFin = ceF.d.slice();
  const dM3 = new Float64Array(4), dM2 = new Float64Array(4);
  for (let o = 0; o < 4; o++) { dM3[o] = dFin[o] * g; dM2[o] = dFin[o] * (1 - g); }
  let dg = 0; for (let o = 0; o < 4; o++) dg += dFin[o] * (m3[o] - m2[o]);
  const dsig = dg * g * (1 - g);
  RP.wg.g[0] += dsig * dis2; RP.bg.g[0] += dsig;
  const dHv = new Float64Array(4); for (let o = 0; o < 4; o++) dHv[o] = ceH.d[o] * 0.5;
  const dc3 = inSeqBackward(M, fw3, dM3, null, null, null, masks);
  void dc3;
  const dc2 = inSeqBackward(M, fw2, dM2, null, null, null, masks);
  inSeqBackward(M, fw1, null, null, dHv, dc2, masks);
  const eps = 1e-6;
  let worst = 0, worstWhere = "";
  const checkParam = (P, name) => {
    for (let i = 0; i < Math.min(P.v.length, 20); i++) {
      P.v[i] += eps; const a1 = lossFn();
      P.v[i] -= 2 * eps; const a0 = lossFn();
      P.v[i] += eps;
      // vhat flip guard (discrete, airtight): if pass1 vhat changed, numeric meaningless
      const f1a = inSeqForward(M, e.x, new Float64Array(8), masks);
      let va = 0; for (let o = 1; o < 4; o++) if (f1a.hvLog[o] > f1a.hvLog[va]) va = o;
      if (va !== vhat) { continue; }
      const num = (a1 - a0) / (2 * eps), an = P.g[i];
      const absd = Math.abs(num - an);
      const rel = absd / Math.max(1e-12, Math.abs(num) + Math.abs(an));
      if (rel > worst) { worst = rel; worstWhere = name + "[" + i + "] num=" + num + " an=" + an; }
    }
  };
  checkParam(RP.wg, "wg"); checkParam(RP.bg, "bg");
  checkParam(M.Hv, "Hv"); checkParam(M.Wh[0], "Wh0");
  log("r-gradcheck worstRel=" + worst.toExponential(2) + " at " + worstWhere);
  return { worstRel: worst, worstWhere };
};
globalThis.runRTrain = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const steps = 800, B = 16, lr = 5e-3, K = 5, H = 48, C = 6, auxW = 0.5, lam = 2.0;
  const tag = arm + "-s" + seed + "-" + steps + "st";
  const ledgerPath = "src/evidence/decomp/d-newai-self-" + tag + ".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  await globalThis.SelfMRInit(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const rng = G.makeRng(74000 + seed * 7919 + mrArmCode(arm) * 131);
  const M = inSeqMakeModel(rng);
  const RP = rMakeParams(G.makeRng(74002 + seed * 131 + mrArmCode(arm) * 17));
  const params = inSeqParams(M).concat(rParams(RP));
  const opt = new G.Adam(lr);
  const dataRng = G.makeRng(42000 + seed * 104729 + 55);
  let fixedMasks = null; { const fr = G.makeRng(91000 + seed); fixedMasks = []; for (let k = 0; k < K; k++) { const m = new Float64Array(H); for (let i = 0; i < H; i++) m[i] = fr.int(10) < 5 ? 2 : 0; fixedMasks.push(m); } }
  const t0 = Date.now(), curve = [];
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  for (let step = 0; step < steps; step++) {
    for (const p of params) p.g.fill(0);
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
      const ceHv = inCELossGrad(fw1.hvLog, e.v);
      const dHv = new Float64Array(4); for (let o = 0; o < 4; o++) dHv[o] = ceHv.d[o] * auxW / B;
      const vhat = argmax4(fw1.hvLog);
      const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
      const fw2 = inSeqForward(M, x2m, fw1.cNew, fixedMasks);
      const dis2 = curVoteDisagree(fw2.logitsK);
      const g = mrIsRCtl(arm) ? 1 : mSigmoid(RP.wg.v[0] * dis2 + RP.bg.v[0]);
      const fw3 = inSeqForward(M, x2m, fw2.cNew, fixedMasks);
      const m2 = inMeanLogits({ logitsK: fw2.logitsK }), m3 = inMeanLogits({ logitsK: fw3.logitsK });
      const fin = new Float64Array(4); for (let o = 0; o < 4; o++) fin[o] = g * m3[o] + (1 - g) * m2[o];
      const ceF = inCELossGrad(fin, e.y);
      const dFin = new Float64Array(4); for (let o = 0; o < 4; o++) dFin[o] = ceF.d[o] / B;
      const dM3 = new Float64Array(4), dM2 = new Float64Array(4);
      for (let o = 0; o < 4; o++) { dM3[o] = dFin[o] * g; dM2[o] = dFin[o] * (1 - g); }
      let dg = 0; for (let o = 0; o < 4; o++) dg += dFin[o] * (m3[o] - m2[o]);
      if (!mrIsRCtl(arm)) {
        const dsig = dg * g * (1 - g);
        RP.wg.g[0] += dsig * dis2; RP.bg.g[0] += dsig;
      }
      const perHead1 = fw1.logitsK.map((lg, k) => {
        if ((b % K) !== k) return new Float64Array(4);
        const ce = inCELossGrad(lg, e.y); const d = new Float64Array(4);
        for (let o = 0; o < 4; o++) d[o] = ce.d[o] * 0.1 * K / B;
        return d;
      });
      const perHead2 = fw2.logitsK.map((lg, k) => {
        if ((b % K) !== k) return new Float64Array(4);
        const ce = inCELossGrad(lg, e.y); const d = new Float64Array(4);
        for (let o = 0; o < 4; o++) d[o] = ce.d[o] * 0.1 * K / B;
        return d;
      });
      const perHead3 = fw3.logitsK.map((lg, k) => {
        if ((b % K) !== k) return new Float64Array(4);
        const ce = inCELossGrad(lg, e.y); const d = new Float64Array(4);
        for (let o = 0; o < 4; o++) d[o] = ce.d[o] * 0.1 * K / B;
        return d;
      });
      const mean1 = inMeanLogits({ logitsK: fw1.logitsK });
      const ce1m = inCELossGrad(mean1, e.y);
      const dMean1 = new Float64Array(4); for (let o = 0; o < 4; o++) dMean1[o] = ce1m.d[o] * 0.3 / B;
      lsum += ceF.loss + auxW * ceHv.loss;
      const dc3 = inSeqBackward(M, fw3, dM3, perHead3, null, null, fixedMasks);
      const dc2 = inSeqBackward(M, fw2, dM2, perHead2, null, dc3, fixedMasks);
      inSeqBackward(M, fw1, dMean1, perHead1, dHv, dc2, fixedMasks);
      const meanW = new Float64Array(M.Wh[0].v.length);
      for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) meanW[i] += M.Wh[k].v[i] / K;
      for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) M.Wh[k].g[i] += lam * (M.Wh[k].v[i] - meanW[i]) / (B * M.H);
    }
    let s = 0; for (const p of params) for (let i = 0; i < p.g.length; i++) s += p.g[i] * p.g[i];
    const n = Math.sqrt(s); if (n > 1.0) { const sc = 1.0 / n; for (const p of params) for (let i = 0; i < p.g.length; i++) p.g[i] *= sc; }
    opt.step(params);
    if (step % 100 === 0 || step === steps - 1) curve.push({ step, loss: +(lsum / B).toFixed(6) });
  }
  const save = (o) => Array.from(o.v);
  const body = { spec: "self-tools-prereg", track: "R", arm, seed, steps, B, lr, K, H, C, auxW, lam, verdict: "COMPLETE", wallMs: Date.now() - t0, frozen: true, curve, divCos: +inMeanCos(M).toFixed(4),
    P: { E: save(M.E), W1: save(M.W1), b1: save(M.b1), Wf: save(M.Wf), bf: save(M.bf), Wc: save(M.Wc), bc: save(M.bc), Wh: M.Wh.map(save), bh: M.bh.map(save), Hv: save(M.Hv), bv: save(M.bv), wg: save(RP.wg), bg: save(RP.bg) } };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("r-train " + tag + " loss0=" + curve[0].loss + " lossN=" + curve[curve.length - 1].loss);
  return body;
};
globalThis.runREval = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const steps = 800, N = 200;
  const tag = arm + "-s" + seed + "-" + steps + "st";
  const ledgerPath = "src/evidence/decomp/d-newai-self-eval-" + tag + ".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  await globalThis.SelfMRInit(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-" + tag + ".json"));
  if (tr.verdict !== "COMPLETE") throw new Error("r train missing " + tag);
  const M = inSeqMakeModel(G.makeRng(1));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(M.E, tr.P.E); load(M.W1, tr.P.W1); load(M.b1, tr.P.b1);
  load(M.Wf, tr.P.Wf); load(M.bf, tr.P.bf); load(M.Wc, tr.P.Wc); load(M.bc, tr.P.bc);
  for (let k = 0; k < 5; k++) { load(M.Wh[k], tr.P.Wh[k]); load(M.bh[k], tr.P.bh[k]); }
  load(M.Hv, tr.P.Hv); load(M.bv, tr.P.bv);
  const RP = rMakeParams(G.makeRng(2));
  load(RP.wg, tr.P.wg); load(RP.bg, tr.P.bg);
  let evalMasks = null; { const fr2 = G.makeRng(91000 + seed); evalMasks = []; for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr2.int(10) < 5 ? 2 : 0; evalMasks.push(m); } }
  const srng = G.makeRng(52500 + seed), frng = G.makeRng(52400 + seed);
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  let scr = 0, two = 0, orc = 0, gWrongSum = 0, gWrongN = 0, gRightSum = 0, gRightN = 0, gAllSum = 0, gAllN = 0;
  for (let i = 0; i < N; i++) {
    const e = inSeqGenShift(srng, null);
    const fw1 = inSeqForward(M, e.x, new Float64Array(8), evalMasks);
    if (argmax4(fw1.hvLog) === e.v) scr++;
    const vhat = argmax4(fw1.hvLog);
    const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
    const fw2 = inSeqForward(M, x2m, fw1.cNew, evalMasks);
    const two2 = argmax4(inMeanLogits({ logitsK: fw2.logitsK })) === e.y;
    const dis2 = curVoteDisagree(fw2.logitsK);
    const g = mrIsRCtl(arm) ? 1 : mSigmoid(RP.wg.v[0] * dis2 + RP.bg.v[0]);
    gAllSum += g; gAllN++;
    if (two2) { gRightSum += g; gRightN++; } else { gWrongSum += g; gWrongN++; }
    const fw3 = inSeqForward(M, x2m, fw2.cNew, evalMasks);
    const m2 = inMeanLogits({ logitsK: fw2.logitsK }), m3 = inMeanLogits({ logitsK: fw3.logitsK });
    const fin = new Float64Array(4); for (let o = 0; o < 4; o++) fin[o] = g * m3[o] + (1 - g) * m2[o];
    if (argmax4(fin) === e.y) two++;
    const xo = [9, 9, 9, 9, 9, 9, e.qk, e.k, e.v, 8];
    const fwo = inSeqForward(M, xo, fw1.cNew, evalMasks);
    if (argmax4(inMeanLogits({ logitsK: fwo.logitsK })) === e.y) orc++;
  }
  let fF = 0;
  for (let i = 0; i < N; i++) {
    const e = inSeqGenShift(frng, 0);
    const fw = inSeqForward(M, e.x, new Float64Array(8), evalMasks);
    if (argmax4(inMeanLogits({ logitsK: fw.logitsK })) === e.y) fF++;
  }
  const body = { spec: "self-tools-prereg", track: "R", arm, seed, steps, verdict: "COMPLETE", n: N, frozenTest: true,
    accScratch: +(scr / N).toFixed(4), accTwo: +(two / N).toFixed(4), accOracle: +(orc / N).toFixed(4), accFwd: +(fF / N).toFixed(4),
    meanGate: +(gAllN ? gAllSum / gAllN : 0).toFixed(4),
    meanGateWrong2: +(gWrongN ? gWrongSum / gWrongN : 0).toFixed(4), meanGateRight2: +(gRightN ? gRightSum / gRightN : 0).toFixed(4) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("r-eval " + tag + " scr=" + body.accScratch + " two=" + body.accTwo + " g=" + body.meanGate + " gW=" + body.meanGateWrong2 + " gR=" + body.meanGateRight2);
  return body;
};
