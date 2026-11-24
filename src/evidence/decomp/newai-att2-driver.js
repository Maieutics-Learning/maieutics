// newai-att2-driver.js — Attention multi-head follow-up (att-mh 5 heads + att-mh-ctl single head).
// CPU/in-worker, Float64. Trunk = W6 recipe (C=6 pick auxW0.5 800st masked truncated lam2 boot).
// Attention over the 6 flat slots; query from concat(E[qk],E[k]); keys/values from E[flat[i]].
// Retrieve readout ensV = Hv + mean_h(attLogits_h); compose via trunk pass2 (unchanged).
// Deviation filed openly: attention backward written fresh for this file (grad-checked below);
// trunk paths reuse inSeqForward/inSeqBackward exactly.
globalThis.Att2Init = async function (fs) {
  for (const p of ["src/evidence/decomp/intrinsic-driver.js", "src/evidence/decomp/newai-driver.js", "src/evidence/decomp/newai-v102-driver.js", "src/evidence/decomp/newai-fr-driver.js", "src/evidence/decomp/newai-div-driver.js", "src/evidence/decomp/newai-cur-driver.js", "src/evidence/decomp/newai-winner-driver.js"]) {
    const src = await fs.readTextFile(p); (0, eval)(src + "\n//# sourceURL=" + p);
  }
  if (!globalThis.runWinnerTrain) throw new Error("att2 stack load failed");
};
function att2ArmCode(arm) {
  if (arm === "att-mh") return 84; if (arm === "att-mh-ctl") return 85; return 84;
}
function att2Heads(arm) { return arm === "att-mh-ctl" ? 1 : 5; }
const ATT2_D = 12, ATT2_SQ = 3.4641016151377544; // sqrt(12)
function att2MakeParams(rng, nH) {
  const heads = [];
  for (let h = 0; h < nH; h++) {
    heads.push({
      Wq: inParam(rng, 24 * ATT2_D, 24), Wk: inParam(rng, ATT2_D * ATT2_D, ATT2_D),
      Wv: inParam(rng, ATT2_D * ATT2_D, ATT2_D), Watt: inParam(rng, ATT2_D * 4, ATT2_D),
      batt: inParam(rng, 4, ATT2_D),
    });
  }
  return { nH, heads };
}
function att2Params(A) {
  const ps = [];
  for (const h of A.heads) ps.push(h.Wq, h.Wk, h.Wv, h.Watt, h.batt);
  return ps;
}
// Forward attention on pass-1 line x (LEN=10: flat[0..5], qk, k, ...). Returns logits per head + mean + caches.
function att2Forward(M, A, x) {
  const D = ATT2_D, nH = A.nH;
  const qkId = x[6] >= 0 && x[6] < 10 ? x[6] : 9, kId = x[7] >= 0 && x[7] < 10 ? x[7] : 9;
  const qinp = new Float64Array(2 * D);
  for (let d = 0; d < D; d++) { qinp[d] = M.E.v[qkId * D + d]; qinp[D + d] = M.E.v[kId * D + d]; }
  const slotEmb = [];
  for (let i = 0; i < 6; i++) {
    const id = x[i] >= 0 && x[i] < 10 ? x[i] : 9;
    const e = new Float64Array(D);
    for (let d = 0; d < D; d++) e[d] = M.E.v[id * D + d];
    slotEmb.push({ id, e });
  }
  const logitsH = [], caches = [];
  for (let h = 0; h < nH; h++) {
    const H = A.heads[h];
    const q = new Float64Array(D);
    for (let o = 0; o < D; o++) { let s = 0; for (let j = 0; j < 2 * D; j++) s += H.Wq.v[o * 2 * D + j] * qinp[j]; q[o] = s; }
    const kk = [], vv = [];
    for (let i = 0; i < 6; i++) {
      const ki = new Float64Array(D), vi = new Float64Array(D);
      for (let o = 0; o < D; o++) { let sk = 0, sv = 0; for (let d = 0; d < D; d++) { sk += H.Wk.v[o * D + d] * slotEmb[i].e[d]; sv += H.Wv.v[o * D + d] * slotEmb[i].e[d]; } ki[o] = sk; vi[o] = sv; }
      kk.push(ki); vv.push(vi);
    }
    const s = new Float64Array(6);
    for (let i = 0; i < 6; i++) { let dot = 0; for (let d = 0; d < D; d++) dot += q[d] * kk[i][d]; s[i] = dot / ATT2_SQ; }
    let mx = s[0]; for (let i = 1; i < 6; i++) if (s[i] > mx) mx = s[i];
    const a = new Float64Array(6); let sm = 0;
    for (let i = 0; i < 6; i++) { a[i] = Math.exp(s[i] - mx); sm += a[i]; }
    for (let i = 0; i < 6; i++) a[i] /= sm;
    const ctx = new Float64Array(D);
    for (let i = 0; i < 6; i++) for (let d = 0; d < D; d++) ctx[d] += a[i] * vv[i][d];
    const logits = new Float64Array(4);
    for (let o = 0; o < 4; o++) { let t = H.batt.v[o]; for (let d = 0; d < D; d++) t += H.Watt.v[o * D + d] * ctx[d]; logits[o] = t; }
    logitsH.push(logits); caches.push({ q, kk, vv, s, a, ctx });
  }
  const mean = new Float64Array(4);
  for (let h = 0; h < nH; h++) for (let o = 0; o < 4; o++) mean[o] += logitsH[h][o] / nH;
  return { qinp, qkId, kId, slotEmb, logitsH, mean, caches };
}
// Backward: dMean (4, already scaled) = dL/dMean; dHeads[h] (4 or null, already scaled) extra per-head grad.
// Accumulates into A.*.g and M.E.g. No scaling inside.
function att2Backward(M, A, fw, dMean, dHeads) {
  const D = ATT2_D, nH = A.nH;
  const dQinp = new Float64Array(2 * D);
  const dSlot = []; for (let i = 0; i < 6; i++) dSlot.push(new Float64Array(D));
  for (let h = 0; h < nH; h++) {
    const H = A.heads[h], C = fw.caches[h];
    const dLh = new Float64Array(4);
    if (dMean) for (let o = 0; o < 4; o++) dLh[o] += dMean[o] / nH;
    if (dHeads && dHeads[h]) for (let o = 0; o < 4; o++) dLh[o] += dHeads[h][o];
    // readout
    const dctx = new Float64Array(D);
    for (let o = 0; o < 4; o++) {
      H.batt.g[o] += dLh[o];
      for (let d = 0; d < D; d++) { H.Watt.g[o * D + d] += dLh[o] * C.ctx[d]; dctx[d] += dLh[o] * H.Watt.v[o * D + d]; }
    }
    // attention weights
    const da = new Float64Array(6);
    const dvv = [];
    for (let i = 0; i < 6; i++) {
      let dot = 0; for (let d = 0; d < D; d++) dot += dctx[d] * C.vv[i][d];
      da[i] = dot;
      const dvi = new Float64Array(D);
      for (let d = 0; d < D; d++) dvi[d] = C.a[i] * dctx[d];
      dvv.push(dvi);
      for (let o = 0; o < D; o++) for (let d = 0; d < D; d++) H.Wv.g[o * D + d] += dvi[o] * fw.slotEmb[i].e[d];
      for (let d = 0; d < D; d++) { let s = 0; for (let o = 0; o < D; o++) s += H.Wv.v[o * D + d] * dvi[o]; dSlot[i][d] += s; }
    }
    let ada = 0; for (let i = 0; i < 6; i++) ada += da[i] * C.a[i];
    const ds = new Float64Array(6);
    for (let i = 0; i < 6; i++) ds[i] = C.a[i] * (da[i] - ada);
    const dq = new Float64Array(D);
    for (let i = 0; i < 6; i++) {
      const dk = new Float64Array(D);
      for (let d = 0; d < D; d++) { dq[d] += ds[i] * C.kk[i][d] / ATT2_SQ; dk[d] = ds[i] * C.q[d] / ATT2_SQ; }
      for (let o = 0; o < D; o++) for (let d = 0; d < D; d++) H.Wk.g[o * D + d] += dk[o] * fw.slotEmb[i].e[d];
      for (let d = 0; d < D; d++) { let s = 0; for (let o = 0; o < D; o++) s += H.Wk.v[o * D + d] * dk[o]; dSlot[i][d] += s; }
    }
    for (let o = 0; o < D; o++) for (let j = 0; j < 2 * D; j++) H.Wq.g[o * 2 * D + j] += dq[o] * fw.qinp[j];
    for (let j = 0; j < 2 * D; j++) { let s = 0; for (let o = 0; o < D; o++) s += H.Wq.v[o * 2 * D + j] * dq[o]; dQinp[j] += s; }
  }
  for (let d = 0; d < D; d++) { M.E.g[fw.qkId * D + d] += dQinp[d]; M.E.g[fw.kId * D + d] += dQinp[D + d]; }
  for (let i = 0; i < 6; i++) for (let d = 0; d < D; d++) M.E.g[fw.slotEmb[i].id * D + d] += dSlot[i][d];
}
// Finite-difference grad check (must pass before any train). Returns max rel err.
globalThis.att2GradCheck = async function (fs, log) {
  const G = await globalThis.IntrinsicInit(fs);
  const rng = G.makeRng(999);
  const M = inSeqMakeModel(rng);
  const A = att2MakeParams(G.makeRng(1000), 5);
  const grng = G.makeRng(2000);
  const e = inSeqGenShift(grng, null);
  const masks = null;
  const c0 = new Float64Array(8);
  const fw1 = inSeqForward(M, e.x, c0, masks);
  const fa = att2Forward(M, A, e.x);
  const ensV = new Float64Array(4);
  for (let o = 0; o < 4; o++) ensV[o] = fw1.hvLog[o] + fa.mean[o];
  const ceV = inCELossGrad(ensV, e.v);
  const ceH = fa.logitsH.map((lg) => inCELossGrad(lg, e.v));
  // analytic: FULL single-example backward (trunk + attention), because loss flows
  // through shared E on both paths — checking attention alone would mismatch numeric.
  for (const p of att2Params(A)) p.g.fill(0);
  for (const p of inSeqParams(M)) p.g.fill(0);
  const dMean = new Float64Array(4); for (let o = 0; o < 4; o++) dMean[o] = ceV.d[o];
  const dHeads = ceH.map((ce) => { const d = new Float64Array(4); for (let o = 0; o < 4; o++) d[o] = ce.d[o] * 0.1 * 5; return d; });
  const dHv = new Float64Array(4); for (let o = 0; o < 4; o++) dHv[o] = ceV.d[o];
  inSeqBackward(M, fw1, null, null, dHv, null, masks);
  att2Backward(M, A, fa, dMean, dHeads);
  const lossFn = () => {
    const f1 = inSeqForward(M, e.x, new Float64Array(8), masks);
    const f2 = att2Forward(M, A, e.x);
    const en = new Float64Array(4);
    for (let o = 0; o < 4; o++) en[o] = f1.hvLog[o] + f2.mean[o];
    let L = inCELossGrad(en, e.v).loss;
    for (const lg of f2.logitsH) L += inCELossGrad(lg, e.v).loss * 0.1 * 5;
    return L;
  };
  const eps = 1e-6;
  let worst = 0, worstWhere = "";
  const checkParam = (P, name) => {
    for (let i = 0; i < Math.min(P.v.length, 40); i++) {
      P.v[i] += eps; const a1 = lossFn();
      P.v[i] -= 2 * eps; const a0 = lossFn();
      P.v[i] += eps;
      const num = (a1 - a0) / (2 * eps), an = P.g[i];
      const absd = Math.abs(num - an);
      const rel = absd / Math.max(1e-12, Math.abs(num) + Math.abs(an));
      if (rel > worst && absd > 1e-9) { worst = rel; worstWhere = name + "[" + i + "] num=" + num + " an=" + an; }
    }
  };
  A.heads.forEach((H, h) => {
    checkParam(H.Wq, "Wq" + h); checkParam(H.Wk, "Wk" + h); checkParam(H.Wv, "Wv" + h);
    checkParam(H.Watt, "Watt" + h); checkParam(H.batt, "batt" + h);
  });
  // E rows used (central differences: forward-diff truncation O(eps) dominates on
  // high-curvature embedding paths; central is O(eps^2))
  const ids = new Set([fa.qkId, fa.kId].concat(fa.slotEmb.map((s) => s.id)));
  for (const id of ids) {
    for (let d = 0; d < 3; d++) {
      M.E.v[id * 12 + d] += eps; const a1 = lossFn();
      M.E.v[id * 12 + d] -= 2 * eps; const a0 = lossFn();
      M.E.v[id * 12 + d] += eps;
      const num = (a1 - a0) / (2 * eps), an = M.E.g[id * 12 + d];
      const absd = Math.abs(num - an);
      const rel = absd / Math.max(1e-12, Math.abs(num) + Math.abs(an));
      if (rel > worst && absd > 1e-9) { worst = rel; worstWhere = "E[" + id + "," + d + "] num=" + num + " an=" + an; }
    }
  }
  log("att2-gradcheck worstRel=" + worst.toExponential(2) + " at " + worstWhere);
  if (!(worst < 1e-6)) throw new Error("att2 grad check FAILED worst=" + worst);
  return worst;
};
globalThis.runAtt2Train = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const nH = att2Heads(arm);
  const C = 6, auxW = 0.5, lam = 2.0;
  const steps = opts.steps || 800;
  const B = 16, lr = 5e-3, K = 5, H = 48;
  const tag = arm + "-s" + seed + "-" + steps + "st";
  const ledgerPath = "src/evidence/decomp/d-newai-att2-" + tag + ".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  const G = await globalThis.IntrinsicInit(fs);
  const rng = G.makeRng(74000 + seed * 7919 + att2ArmCode(arm) * 131);
  const M = inSeqMakeModel(rng);
  const A = att2MakeParams(G.makeRng(75000 + seed * 104729 + att2ArmCode(arm) * 17), nH);
  const params = inSeqParams(M).concat(att2Params(A));
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
      const fa = att2Forward(M, A, e.x);
      const ensV = new Float64Array(4);
      for (let o = 0; o < 4; o++) ensV[o] = fw1.hvLog[o] + fa.mean[o];
      const ceV = inCELossGrad(ensV, e.v);
      const dEns = new Float64Array(4); for (let o = 0; o < 4; o++) dEns[o] = ceV.d[o] * auxW / B;
      const dHv = new Float64Array(4); for (let o = 0; o < 4; o++) dHv[o] = dEns[o];
      const dHeads = fa.logitsH.map((lg, h) => {
        const d = new Float64Array(4);
        if ((b % K) === (h % K)) {
          const ce = inCELossGrad(lg, e.v);
          for (let o = 0; o < 4; o++) d[o] = ce.d[o] * 0.1 * K / B;
        }
        return d;
      });
      att2Backward(M, A, fa, dEns, dHeads);
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
      lsum += ce2.loss + auxW * ceV.loss;
      const dc = inSeqBackward(M, fw2, dMean2, perHead2, null, null, fixedMasks);
      inSeqBackward(M, fw1, dMean1, perHead1, dHv, dc, fixedMasks);
      const meanW = new Float64Array(M.Wh[0].v.length);
      for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) meanW[i] += M.Wh[k].v[i] / K;
      for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) M.Wh[k].g[i] += lam * (M.Wh[k].v[i] - meanW[i]) / (B * M.H);
    }
    let s = 0; for (const p of params) for (let i = 0; i < p.g.length; i++) s += p.g[i] * p.g[i];
    const n = Math.sqrt(s); if (n > 1.0) { const sc = 1.0 / n; for (const q of params) for (let i = 0; i < q.g.length; i++) q.g[i] *= sc; }
    opt.step(params);
    if (step % 100 === 0 || step === steps - 1) curve.push({ step, loss: +(lsum / B).toFixed(6) });
  }
  const save = (o) => Array.from(o.v);
  const saveHead = (Hd) => ({ Wq: save(Hd.Wq), Wk: save(Hd.Wk), Wv: save(Hd.Wv), Watt: save(Hd.Watt), batt: save(Hd.batt) });
  const body = { spec: "attention-mh-prereg", track: "ATT2", arm, seed, steps, B, lr, K, H, C, auxW, lam, nHeads: nH, verdict: "COMPLETE", wallMs: Date.now() - t0,
    frozen: true, curve, divCos: +inMeanCos(M).toFixed(4),
    P: { E: save(M.E), W1: save(M.W1), b1: save(M.b1), Wf: save(M.Wf), bf: save(M.bf), Wc: save(M.Wc), bc: save(M.bc),
      Wh: M.Wh.map(save), bh: M.bh.map(save), Hv: save(M.Hv), bv: save(M.bv),
      attHeads: A.heads.map(saveHead) } };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("att2-train " + tag + " nH=" + nH + " loss0=" + curve[0].loss + " lossN=" + curve[curve.length - 1].loss);
  return body;
};
globalThis.runAtt2HardEval = async function (fs, log, opts) {
  // robustness probes (eval-only, frozen): noisy = one flat slot corrupted; double = q2 after q1 with carry pinned.
  const { arm, seed, steps, hard } = opts;
  const nH = att2Heads(arm);
  const N = 200;
  const tag = hard + "-" + arm + "-s" + seed + "-" + steps + "st";
  const ledgerPath = "src/evidence/decomp/d-newai-att2-hard-" + tag + ".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  const G = await globalThis.IntrinsicInit(fs);
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-att2-" + arm + "-s" + seed + "-" + steps + "st.json"));
  if (tr.verdict !== "COMPLETE") throw new Error("att2 train missing " + tag);
  const M = inSeqMakeModel(G.makeRng(1));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(M.E, tr.P.E); load(M.W1, tr.P.W1); load(M.b1, tr.P.b1);
  load(M.Wf, tr.P.Wf); load(M.bf, tr.P.bf); load(M.Wc, tr.P.Wc); load(M.bc, tr.P.bc);
  for (let k = 0; k < 5; k++) { load(M.Wh[k], tr.P.Wh[k]); load(M.bh[k], tr.P.bh[k]); }
  load(M.Hv, tr.P.Hv); load(M.bv, tr.P.bv);
  const A = att2MakeParams(G.makeRng(1), nH);
  tr.P.attHeads.forEach((Hs, h) => { load(A.heads[h].Wq, Hs.Wq); load(A.heads[h].Wk, Hs.Wk); load(A.heads[h].Wv, Hs.Wv); load(A.heads[h].Watt, Hs.Watt); load(A.heads[h].batt, Hs.batt); });
  let evalMasks = null; { const fr = G.makeRng(91000 + seed); evalMasks = []; for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr.int(10) < 5 ? 2 : 0; evalMasks.push(m); } }
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  const ensVhat = (x, c) => {
    const fw1 = inSeqForward(M, x, c, evalMasks);
    const fa = att2Forward(M, A, x);
    const ensV = new Float64Array(4);
    for (let o = 0; o < 4; o++) ensV[o] = fw1.hvLog[o] + fa.mean[o];
    return { fw1, vhat: argmax4(ensV) };
  };
  if (hard === "noisy") {
    const srng = G.makeRng(52500 + seed), nrng = G.makeRng(53100 + seed), prng = G.makeRng(53200 + seed);
    let scr = 0, two = 0;
    for (let i = 0; i < N; i++) {
      const e = inSeqGenShift(srng, null);
      const xn = e.x.slice();
      xn[prng.int(6)] = nrng.int(9);
      const { fw1, vhat } = ensVhat(xn, new Float64Array(8));
      if (vhat === e.v) scr++;
      const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
      const fw2 = inSeqForward(M, x2m, fw1.cNew, evalMasks);
      if (argmax4(inMeanLogits({ logitsK: fw2.logitsK })) === e.y) two++;
    }
    const body = { spec: "attention-mh-prereg", hard, arm, seed, steps, verdict: "COMPLETE", n: N, accScratch: +(scr / N).toFixed(4), accTwo: +(two / N).toFixed(4) };
    await fs.writeTextFile(ledgerPath, JSON.stringify(body));
    log("att2-hard-noisy " + tag + " scr=" + body.accScratch + " two=" + body.accTwo);
    return body;
  }
  if (hard === "double") {
    const srng = G.makeRng(52500 + seed);
    let scr2 = 0, two2 = 0;
    for (let i = 0; i < N; i++) {
      const ea = inSeqGenShift(srng, null), eb = inSeqGenShift(srng, null);
      const ra = ensVhat(ea.x, new Float64Array(8));
      const x2a = [9, 9, 9, 9, 9, 9, ea.qk, ea.k, ra.vhat, 8];
      const fw2a = inSeqForward(M, x2a, ra.fw1.cNew, evalMasks);
      const rb = ensVhat(eb.x, fw2a.cNew);
      if (rb.vhat === eb.v) scr2++;
      const x2b = [9, 9, 9, 9, 9, 9, eb.qk, eb.k, rb.vhat, 8];
      const fw2b = inSeqForward(M, x2b, rb.fw1.cNew, evalMasks);
      if (argmax4(inMeanLogits({ logitsK: fw2b.logitsK })) === eb.y) two2++;
    }
    const body = { spec: "attention-mh-prereg", hard, arm, seed, steps, verdict: "COMPLETE", n: N, accScratch2: +(scr2 / N).toFixed(4), accTwo2: +(two2 / N).toFixed(4) };
    await fs.writeTextFile(ledgerPath, JSON.stringify(body));
    log("att2-hard-double " + tag + " scr2=" + body.accScratch2 + " two2=" + body.accTwo2);
    return body;
  }
  throw new Error("unknown hard " + hard);
};
globalThis.runAtt2Eval = async function (fs, log, opts) {
  const { arm, seed, only } = opts; // only=true → attention-alone readout (eval-only, ensemble-trained)
  const nH = att2Heads(arm);
  const steps = opts.steps || 800, N = 200;
  const tag = arm + "-s" + seed + "-" + steps + "st" + (only ? "-only" : "");
  const ledgerPath = "src/evidence/decomp/d-newai-att2-eval-" + tag + ".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  const G = await globalThis.IntrinsicInit(fs);
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-att2-" + arm + "-s" + seed + "-" + steps + "st.json"));
  if (tr.verdict !== "COMPLETE") throw new Error("att2 train missing " + tag);
  const M = inSeqMakeModel(G.makeRng(1));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(M.E, tr.P.E); load(M.W1, tr.P.W1); load(M.b1, tr.P.b1);
  load(M.Wf, tr.P.Wf); load(M.bf, tr.P.bf); load(M.Wc, tr.P.Wc); load(M.bc, tr.P.bc);
  for (let k = 0; k < 5; k++) { load(M.Wh[k], tr.P.Wh[k]); load(M.bh[k], tr.P.bh[k]); }
  load(M.Hv, tr.P.Hv); load(M.bv, tr.P.bv);
  const A = att2MakeParams(G.makeRng(1), nH);
  tr.P.attHeads.forEach((Hs, h) => { load(A.heads[h].Wq, Hs.Wq); load(A.heads[h].Wk, Hs.Wk); load(A.heads[h].Wv, Hs.Wv); load(A.heads[h].Watt, Hs.Watt); load(A.heads[h].batt, Hs.batt); });
  let evalMasks = null; { const fr = G.makeRng(91000 + seed); evalMasks = []; for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr.int(10) < 5 ? 2 : 0; evalMasks.push(m); } }
  const srng = G.makeRng(52500 + seed), frng = G.makeRng(52400 + seed);
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  let scr = 0, one = 0, two = 0, orc = 0, disSum = 0, cloneCnt = 0;
  for (let i = 0; i < N; i++) {
    const e = inSeqGenShift(srng, null);
    const c0 = new Float64Array(8);
    const fw1 = inSeqForward(M, e.x, c0, evalMasks);
    const fa = att2Forward(M, A, e.x);
    const ensV = new Float64Array(4);
    for (let o = 0; o < 4; o++) ensV[o] = only ? fa.mean[o] : fw1.hvLog[o] + fa.mean[o];
    const vhat = argmax4(ensV);
    if (vhat === e.v) scr++;
    // head diversity readouts (battery-accepted reporting, no new loss)
    const ha = fa.logitsH.map((lg) => argmax4(lg));
    const cnt = [0, 0, 0, 0]; for (const a of ha) cnt[a]++;
    let mx = 0; for (let o = 0; o < 4; o++) if (cnt[o] > mx) mx = cnt[o];
    disSum += 1 - mx / fa.logitsH.length;
    if (mx === fa.logitsH.length) cloneCnt++;
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
  const body = { spec: "attention-mh-prereg", track: "ATT2", arm, seed, steps, readout: only ? "att-alone" : "ensemble", verdict: "COMPLETE", n: N, frozenTest: true,
    accScratch: +(scr / N).toFixed(4), accOne: +(one / N).toFixed(4), accTwo: +(two / N).toFixed(4),
    accOracle: +(orc / N).toFixed(4), accFwd: +(fF / N).toFixed(4),
    headDisagree: +(disSum / N).toFixed(4), headCloneFrac: +(cloneCnt / N).toFixed(4) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("att2-eval " + tag + " scr=" + body.accScratch + " two=" + body.accTwo + " hDis=" + body.headDisagree + " clone=" + body.headCloneFrac);
  return body;
};
