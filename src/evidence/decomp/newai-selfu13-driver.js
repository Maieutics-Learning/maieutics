// newai-selfu10-driver.js — U13 hard-routing + critic repair on split graph: stage-1 critic-only warmup (gates frozen), stage-2 STE hard pick (forward discrete, backward sigmoid-path) vs soft-ctrl (same repair, soft blend).
globalThis.SelfU13Init = async function (fs) {
  for (const p of ["src/tinynn/nn.js", "src/tinynn/seeded.js", "src/evidence/decomp/intrinsic-driver.js", "src/evidence/decomp/newai-driver.js", "src/evidence/decomp/newai-v102-driver.js", "src/evidence/decomp/newai-fr-driver.js", "src/evidence/decomp/newai-div-driver.js", "src/evidence/decomp/newai-cur-driver.js", "src/evidence/decomp/newai-winner-driver.js", "src/evidence/decomp/newai-selfmr-driver.js", "src/evidence/decomp/newai-selfm2r2-driver.js", "src/evidence/decomp/newai-selfm3r3-driver.js", "src/evidence/decomp/newai-selfu1-driver.js", "src/evidence/decomp/newai-selfu2-driver.js", "src/evidence/decomp/newai-selfu4-driver.js", "src/evidence/decomp/newai-selfu5-driver.js", "src/evidence/decomp/newai-selfu7-driver.js", "src/evidence/decomp/newai-selfu8-driver.js", "src/evidence/decomp/newai-selfu9-driver.js", "src/evidence/decomp/newai-selfu10-driver.js", "src/evidence/decomp/newai-selfu11-driver.js"]) {
    const src = await fs.readTextFile(p); (0, eval)(src + "\n//# sourceURL=" + p);
  }
  if (!globalThis.genAdaptEpisode) throw new Error("u13 stack load failed");
};
function u13ArmCode(arm) { if (arm === "u13-p2learn") return 131; if (arm === "u13-mrule") return 132; return 131; }
// U13 helpers: scale-free pass-2 confidence features (shared by train/eval/gradcheck).
function u13MakeParams(rng) {
  const mk = () => { const p = inParam(rng, 1, 1); p.v[0] = 0; return p; };
  return { wMa: mk(), wMb: mk(), wDm: mk(), wa: mk(), wHa: mk(), wHb: mk(), wb: mk(), wd: mk(), b: mk() };
}
function u13Top2gap(a) {
  let t1 = -1e300, t2 = -1e300, mx = -1e300, mn = 1e300;
  for (let o = 0; o < 4; o++) { const x = a[o]; if (x > mx) mx = x; if (x < mn) mn = x; if (x > t1) { t2 = t1; t1 = x; } else if (x > t2) { t2 = x; } }
  return { gap: t1 - t2, range: mx - mn };
}
function u13NormMargin(a) { const g = u13Top2gap(a); return g.gap / (g.range + 1e-9); }
function u13Softmax(a) {
  let m = -1e300; for (let o = 0; o < 4; o++) if (a[o] > m) m = a[o];
  let s = 0; const p = new Float64Array(4);
  for (let o = 0; o < 4; o++) { p[o] = Math.exp(a[o] - m); s += p[o]; }
  for (let o = 0; o < 4; o++) p[o] /= s;
  return p;
}
function u13Ent(a) { const p = u13Softmax(a); let H = 0; for (let o = 0; o < 4; o++) H -= p[o] * Math.log(p[o] + 1e-12); return H / Math.log(4); }
function u13KL(p, q) { let k = 0; for (let o = 0; o < 4; o++) k += p[o] * Math.log((p[o] + 1e-12) / (q[o] + 1e-12)); return k; }
function u13Feat(RP, mAdN, mBaseN, dmN, a, hAd, hBase, beta, dis) {
  return RP.wMa.v[0] * mAdN + RP.wMb.v[0] * mBaseN + RP.wDm.v[0] * dmN + RP.wa.v[0] * a + RP.wHa.v[0] * hAd + RP.wHb.v[0] * hBase + RP.wb.v[0] * beta + RP.wd.v[0] * dis + RP.b.v[0];
}

globalThis.u13GradCheck = async function (fs, log) {
  await globalThis.SelfU13Init(fs);
  const G = await globalThis.IntrinsicInit(fs);
  globalThis.window = globalThis;
  const { M, MP, HD } = await loadU8Frozen(fs, G, 0).catch(() => ({ M: inSeqMakeModel(G.makeRng(4342)), MP: m2MakeParams(G.makeRng(4344)), HD: u5MakeHead(G.makeRng(4345)) }));
  const RPr = u1MakeParams(G.makeRng(4343));
  const RP = u13MakeParams(G.makeRng(4348));
  const grng = G.makeRng(4346);
  const ep = genAdaptEpisode(grng);
  const e = ep.query, supE = ep.sup;
  const masks = null;
  const sup = supE.map(se => ({ qkId: se.qk, vId: 4 + se.v, forceZero: false }));
  const entropyOf = (hv) => { const p = u2Softmax(hv); let H = 0; for (let o = 0; o < 4; o++) H -= p[o] * Math.log(p[o] + 1e-12); return H / Math.log(4); };
  const argmax4 = (a) => { let b = 0; for (let i = 0; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  const lossFn = () => {
    const f1 = inSeqForward(M, e.x, new Float64Array(8), masks);
    const Eq = new Float64Array(12); for (let d = 0; d < 12; d++) Eq[d] = M.E.v[e.qk * 12 + d];
    const fr = m2ReadForward(M, MP, Eq, sup);
    let zr = RPr.bc.v[0]; for (let i = 0; i < 48; i++) zr += RPr.Wc.v[i] * f1.h[i];
    const betar = 1 / (1 + Math.exp(-zr));
    const gr = 1 / (1 + Math.exp(-(RPr.we.v[0] * entropyOf(f1.hvLog) + RPr.wb.v[0] * betar + RPr.wd.v[0] * curVoteDisagree(f1.logitsK) + RPr.b.v[0])));
    const ens = new Float64Array(4); for (let o = 0; o < 4; o++) ens[o] = f1.hvLog[o] + gr * fr.readLogits[o];
    const vhat = argmax4(ens);
    lossFn.lastVhat = vhat;
    const wrong1 = vhat === e.v ? 0 : 1;
    const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
    const f2 = inSeqForward(M, x2m, f1.cNew, masks);
    const baseMean = inMeanLogits({ logitsK: f2.logitsK });
    const ad = u5HeadForward(HD, f2.h).out;
    let ht = 0, bt = 0; for (let o = 1; o < 4; o++) { if (ad[o] > ad[ht]) ht = o; if (baseMean[o] > baseMean[bt]) bt = o; }
    const mAdN = u13NormMargin(ad), mBaseN = u13NormMargin(baseMean);
    const gc = 1 / (1 + Math.exp(-u13Feat(RP, mAdN, mBaseN, mAdN - mBaseN, ht === bt ? 1 : 0, u13Ent(ad), u13Ent(baseMean), betar, curVoteDisagree(f1.logitsK))));
    const blend = new Float64Array(4); for (let o = 0; o < 4; o++) blend[o] = (1 - gc) * baseMean[o] + gc * ad[o];
    const ce2 = inCELossGrad(blend, e.y);
    const ceH = inCELossGrad(ens, e.v);
    return ce2.loss + 0.5 * ceH.loss + 0.5 * (-(wrong1 * Math.log(betar + 1e-12) + (1 - wrong1) * Math.log(1 - betar + 1e-12)));
  };
  const rpList = [RPr.Wc, RPr.bc, RPr.we, RPr.wb, RPr.wd, RPr.b, RP.wMa, RP.wMb, RP.wDm, RP.wa, RP.wHa, RP.wHb, RP.wb, RP.wd, RP.b];
  for (const p of rpList) p.g.fill(0);
  const f1 = inSeqForward(M, e.x, new Float64Array(8), masks);
  const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = M.E.v[e.qk * 12 + d];
  const fr = m2ReadForward(M, MP, Eqk, sup); fr.qkId = e.qk;
  let zr = RPr.bc.v[0]; for (let i = 0; i < 48; i++) zr += RPr.Wc.v[i] * f1.h[i];
  const betar = 1 / (1 + Math.exp(-zr));
  const Hh = entropyOf(f1.hvLog);
  const dis = curVoteDisagree(f1.logitsK);
  const gr = 1 / (1 + Math.exp(-(RPr.we.v[0] * Hh + RPr.wb.v[0] * betar + RPr.wd.v[0] * dis + RPr.b.v[0])));
  const ensV = new Float64Array(4); for (let o = 0; o < 4; o++) ensV[o] = f1.hvLog[o] + gr * fr.readLogits[o];
  const ceHv = inCELossGrad(ensV, e.v);
  const vhat = argmax4(ensV);
  const wrong1 = vhat === e.v ? 0 : 1;
  const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
  const f2 = inSeqForward(M, x2m, f1.cNew, masks);
  const baseMean = inMeanLogits({ logitsK: f2.logitsK });
  const ad = u5HeadForward(HD, f2.h).out;
  let ht = 0, bt = 0; for (let o = 1; o < 4; o++) { if (ad[o] > ad[ht]) ht = o; if (baseMean[o] > baseMean[bt]) bt = o; }
  const a = ht === bt ? 1 : 0;
  const mAdN = u13NormMargin(ad), mBaseN = u13NormMargin(baseMean), dmN = mAdN - mBaseN;
  const hAd = u13Ent(ad), hBase = u13Ent(baseMean);
  const logitc = u13Feat(RP, mAdN, mBaseN, dmN, a, hAd, hBase, betar, dis);
  const gc = 1 / (1 + Math.exp(-logitc));
  const blendArr = new Float64Array(4); for (let o = 0; o < 4; o++) blendArr[o] = (1 - gc) * baseMean[o] + gc * ad[o];
  const dBlend = inCELossGrad(blendArr, e.y).d;
  const dEns = new Float64Array(4); for (let o = 0; o < 4; o++) dEns[o] = ceHv.d[o] * 0.5;
  const dRead = new Float64Array(4); for (let o = 0; o < 4; o++) dRead[o] = dEns[o] * gr;
  let dgr = 0; for (let o = 0; o < 4; o++) dgr += dEns[o] * fr.readLogits[o];
  const dsigr = dgr * gr * (1 - gr);
  RPr.we.g[0] += dsigr * Hh; RPr.wb.g[0] += dsigr * betar; RPr.wd.g[0] += dsigr * dis; RPr.b.g[0] += dsigr;
  const dzr = (dsigr * RPr.wb.v[0]) * betar * (1 - betar) + 0.5 * (betar - wrong1);
  RPr.bc.g[0] += dzr;
  for (let i = 0; i < 48; i++) RPr.Wc.g[i] += dzr * f1.h[i];
  u1ReadBackward(M, MP, fr, dRead);
  let dgc = 0; for (let o = 0; o < 4; o++) dgc += dBlend[o] * (ad[o] - baseMean[o]);
  const dsigc = dgc * gc * (1 - gc);
  RP.wMa.g[0] += dsigc * mAdN; RP.wMb.g[0] += dsigc * mBaseN; RP.wDm.g[0] += dsigc * dmN;
  RP.wa.g[0] += dsigc * a; RP.wHa.g[0] += dsigc * hAd; RP.wHb.g[0] += dsigc * hBase;
  RP.wb.g[0] += dsigc * betar; RP.wd.g[0] += dsigc * dis; RP.b.g[0] += dsigc;
  lossFn(); const refVhat = lossFn.lastVhat;
  const eps = 1e-6;
  let worst = 0, worstWhere = "", flips = 0;
  const checkParam = (P, name) => {
    for (let i = 0; i < Math.min(P.v.length, 8); i++) {
      P.v[i] += eps; const a1 = lossFn(); const v1 = lossFn.lastVhat;
      P.v[i] -= 2 * eps; const a0 = lossFn(); const v0 = lossFn.lastVhat;
      P.v[i] += eps;
      if (v1 !== refVhat || v0 !== refVhat) { flips++; continue; }
      const num = (a1 - a0) / (2 * eps), an = P.g[i];
      const rel = Math.abs(num - an) / Math.max(1e-12, Math.abs(num) + Math.abs(an));
      if (Math.abs(num) < 1e-9 && Math.abs(an) < 1e-9) continue;
      if (rel > worst) { worst = rel; worstWhere = name + "[" + i + "] num=" + num + " an=" + an; }
    }
  };
  checkParam(RP.wMa, "wMa"); checkParam(RP.wMb, "wMb"); checkParam(RP.wDm, "wDm"); checkParam(RP.wa, "wa");
  checkParam(RP.wHa, "wHa"); checkParam(RP.wHb, "wHb"); checkParam(RP.wb, "u-wb"); checkParam(RP.wd, "u-wd");
  checkParam(RP.b, "u-b"); checkParam(RPr.we, "r-we"); checkParam(RPr.wd, "r-wd"); checkParam(RPr.Wc, "r-Wc"); checkParam(RPr.bc, "r-bc");
  log("u13-gradcheck worstRel=" + worst.toExponential(2) + " at " + worstWhere + " flips=" + flips + " (vhat-flip-guarded; smooth pass-2 graph)");
  return { worstRel: worst, worstWhere, flips };
};
globalThis.runU13Train = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const isRule = (arm === "u13-mrule");
  const steps = 800, B = 16, rpLr = 1e-3, K = 5, H = 48, C = 6, auxW = 0.5, stage1 = 200;
  const tag = arm + "-s" + seed + "-" + steps + "st";
  const ledgerPath = "src/evidence/decomp/d-newai-self-" + tag + ".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  await globalThis.SelfU13Init(fs);
  const G = await globalThis.IntrinsicInit(fs);
  globalThis.window = globalThis;
  const { M, MP, HD } = await loadU8Frozen(fs, G, seed);
  if (isRule) { const body0 = { spec: "self-u13-p2conf-prereg", track: "U13", arm, seed, steps: 800, stage1: 200, params: "none-fixed-rule", rule: "pick argmax mN(ad,baseMean); retrieval borrows p2learn RPr at eval (same seed)", verdict: "COMPLETE", wallMs: 0, curve: [], curve1: [] }; await fs.writeTextFile(ledgerPath, JSON.stringify(body0)); log("u13-train " + tag + " fixed-rule, no params"); return body0; }
  const RPr = u1MakeParams(G.makeRng(75000 + seed * 7919 + u13ArmCode(arm) * 131 + 1));
  const RPc = u13MakeParams(G.makeRng(75000 + seed * 7919 + u13ArmCode(arm) * 131 + 2));
  const rpList = [RPr.Wc, RPr.bc, RPr.we, RPr.wb, RPr.wd, RPr.b, RPc.wMa, RPc.wMb, RPc.wDm, RPc.wa, RPc.wHa, RPc.wHb, RPc.wb, RPc.wd, RPc.b];
  const optRP = new G.Adam(rpLr);
  const dataRng = G.makeRng(42000 + seed * 104729 + 55);
  let fixedMasks = null; { const fr = G.makeRng(91000 + seed); fixedMasks = []; for (let k = 0; k < K; k++) { const m = new Float64Array(H); for (let i = 0; i < H; i++) m[i] = fr.int(10) < 5 ? 2 : 0; fixedMasks.push(m); } }
  const entropyOf = (hv) => { const p = u2Softmax(hv); let Hh = 0; for (let o = 0; o < 4; o++) Hh -= p[o] * Math.log(p[o] + 1e-12); return Hh / Math.log(4); };
  const t0 = Date.now(), curve = [], curve1 = [];
  const argmax4 = (a) => { let b = 0; for (let i = 0; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  // STAGE 1 (both arms identical): critic-only warmup, gates frozen at init
  { const optC = new G.Adam(1e-3);
    const cParams = [RPr.Wc, RPr.bc];
    for (let step = 0; step < stage1; step++) {
      for (const p of cParams) p.g.fill(0);
      let l1 = 0;
      for (let b = 0; b < B; b++) {
        const isAdapt = dataRng.int(2) === 1;
        let e, sup;
        if (!isAdapt) {
          e = inSeqGenShift(dataRng, null);
          const supE = [inSeqGenShift(dataRng, null), inSeqGenShift(dataRng, null), inSeqGenShift(dataRng, null), inSeqGenShift(dataRng, null)];
          sup = supE.map(se => ({ qkId: se.qk, vId: 4 + se.v, forceZero: false }));
        } else {
          const ep = genAdaptEpisode(dataRng);
          e = ep.query;
          sup = ep.sup.map(se => ({ qkId: se.qk, vId: 4 + se.v, forceZero: false }));
        }
        const fw1 = inSeqForward(M, e.x, new Float64Array(8), fixedMasks);
        const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = M.E.v[e.qk * 12 + d];
        const fr = m2ReadForward(M, MP, Eqk, sup); fr.qkId = e.qk;
        let zr = RPr.bc.v[0]; for (let i = 0; i < H; i++) zr += RPr.Wc.v[i] * fw1.h[i];
        const betar = 1 / (1 + Math.exp(-zr));
        const dis = curVoteDisagree(fw1.logitsK);
        const Hh = entropyOf(fw1.hvLog);
        const gr = 1 / (1 + Math.exp(-(RPr.we.v[0] * Hh + RPr.wb.v[0] * betar + RPr.wd.v[0] * dis + RPr.b.v[0])));
        const ens = new Float64Array(4); for (let o = 0; o < 4; o++) ens[o] = fw1.hvLog[o] + gr * fr.readLogits[o];
        const vhat = argmax4(ens);
        const wrong1 = vhat === e.v ? 0 : 1;
        l1 += -(wrong1 * Math.log(betar + 1e-12) + (1 - wrong1) * Math.log(1 - betar + 1e-12));
        const dzr = (betar - wrong1) / B;
        RPr.bc.g[0] += dzr;
        for (let i = 0; i < H; i++) RPr.Wc.g[i] += dzr * fw1.h[i];
      }
      let s2 = 0; for (const p of cParams) for (let i = 0; i < p.g.length; i++) s2 += p.g[i] * p.g[i];
      const n2 = Math.sqrt(s2); if (n2 > 1.0) { const sc = 1.0 / n2; for (const p of cParams) for (let i = 0; i < p.g.length; i++) p.g[i] *= sc; }
      optC.step(cParams);
      if (step % 100 === 0 || step === stage1 - 1) curve1.push({ step, loss: +(l1 / B).toFixed(6) });
    }
    log("u13-stage1 " + tag + " loss0=" + curve1[0].loss + " lossN=" + curve1[curve1.length-1].loss);
  }
  for (let step = 0; step < steps; step++) {
    for (const p of rpList) p.g.fill(0);
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
      const fr = m2ReadForward(M, MP, Eqk, sup); fr.qkId = e.qk;
      let zr = RPr.bc.v[0]; for (let i = 0; i < H; i++) zr += RPr.Wc.v[i] * fw1.h[i];
      const betar = 1 / (1 + Math.exp(-zr));
      const dis = curVoteDisagree(fw1.logitsK);
      const Hh = entropyOf(fw1.hvLog);
      const gr = 1 / (1 + Math.exp(-(RPr.we.v[0] * Hh + RPr.wb.v[0] * betar + RPr.wd.v[0] * dis + RPr.b.v[0])));
      const ens = new Float64Array(4); for (let o = 0; o < 4; o++) ens[o] = fw1.hvLog[o] + gr * fr.readLogits[o];
      const ceHv = inCELossGrad(ens, e.v);
      const vhat = argmax4(ens);
      const wrong1 = vhat === e.v ? 0 : 1;
      const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
      const fw2 = inSeqForward(M, x2m, fw1.cNew, fixedMasks);
      const baseMean = inMeanLogits({ logitsK: fw2.logitsK });
      const ad = u5HeadForward(HD, fw2.h).out;
      let ht = 0, bt = 0; for (let o = 1; o < 4; o++) { if (ad[o] > ad[ht]) ht = o; if (baseMean[o] > baseMean[bt]) bt = o; }
      const m = ad[ht] - baseMean[bt];
      const a = ht === bt ? 1 : 0;
      const mAdN = u13NormMargin(ad), mBaseN = u13NormMargin(baseMean);
      const dmN = mAdN - mBaseN, hAd = u13Ent(ad), hBase = u13Ent(baseMean);
      const logitc = u13Feat(RPc, mAdN, mBaseN, dmN, a, hAd, hBase, betar, dis);
      const gc = 1 / (1 + Math.exp(-logitc));
      const blend = new Float64Array(4); for (let o = 0; o < 4; o++) blend[o] = (1 - gc) * baseMean[o] + gc * ad[o];
      const ce2 = inCELossGrad(blend, e.y);
      lsum += ce2.loss + auxW * ceHv.loss + 0.5 * (-(wrong1 * Math.log(betar + 1e-12) + (1 - wrong1) * Math.log(1 - betar + 1e-12)));
      // ret grads (retrieval losses only)
      const dEns = new Float64Array(4); for (let o = 0; o < 4; o++) dEns[o] = ceHv.d[o] * auxW / B;
      const dRead = new Float64Array(4); for (let o = 0; o < 4; o++) dRead[o] = dEns[o] * gr;
      let dgr = 0; for (let o = 0; o < 4; o++) dgr += dEns[o] * fr.readLogits[o];
      const dsigr = dgr * gr * (1 - gr);
      RPr.we.g[0] += dsigr * Hh; RPr.wb.g[0] += dsigr * betar; RPr.wd.g[0] += dsigr * dis; RPr.b.g[0] += dsigr;
      const dzr = (dsigr * RPr.wb.v[0]) * betar * (1 - betar) + 0.5 * (betar - wrong1) / B;
      RPr.bc.g[0] += dzr;
      for (let i = 0; i < H; i++) RPr.Wc.g[i] += dzr * fw1.h[i];
      u1ReadBackward(M, MP, fr, dRead);
      // cmp grads (blend loss only, beta detached)
      let dgc = 0; for (let o = 0; o < 4; o++) dgc += ce2.d[o] * (ad[o] - baseMean[o]) / B;
      const dsigc = dgc * gc * (1 - gc);
      RPc.wMa.g[0] += dsigc * mAdN; RPc.wMb.g[0] += dsigc * mBaseN; RPc.wDm.g[0] += dsigc * dmN;
      RPc.wa.g[0] += dsigc * a; RPc.wHa.g[0] += dsigc * hAd; RPc.wHb.g[0] += dsigc * hBase;
      RPc.wb.g[0] += dsigc * betar; RPc.wd.g[0] += dsigc * dis; RPc.b.g[0] += dsigc;
    }
    let s = 0; for (const p of rpList) for (let i = 0; i < p.g.length; i++) s += p.g[i] * p.g[i];
    const n = Math.sqrt(s); if (n > 1.0) { const sc = 1.0 / n; for (const p of rpList) for (let i = 0; i < p.g.length; i++) p.g[i] *= sc; }
    optRP.step(rpList);
    if (step % 100 === 0 || step === steps - 1) curve.push({ step, loss: +(lsum / B).toFixed(6) });
  }
  const save = (o) => Array.from(o.v);
  const P = { rWc: save(RPr.Wc), rbc: save(RPr.bc), rwe: save(RPr.we), rwb: save(RPr.wb), rwd: save(RPr.wd), rb: save(RPr.b),
    uMa: save(RPc.wMa), uMb: save(RPc.wMb), uDm: save(RPc.wDm), uA: save(RPc.wa), uHa: save(RPc.wHa), uHb: save(RPc.wHb), uwb: save(RPc.wb), uwd: save(RPc.wd), ub: save(RPc.b) };
  
  const body = { spec: "self-u13-p2conf-prereg", track: "U13", arm, seed, steps, stage1, B, rpLr, frozen: "W6+M2+U5head-s" + seed, verdict: "COMPLETE", wallMs: Date.now() - t0, curve, curve1, P };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("u13-train " + tag + " loss0=" + curve[0].loss + " lossN=" + curve[curve.length - 1].loss);
  return body;
};
globalThis.runU13Eval = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const isRule = (arm === "u13-mrule");
  const steps = 800, N = 200;
  const tag = arm + "-s" + seed + "-" + steps + "st";
  const ledgerPath = "src/evidence/decomp/d-newai-self-eval-" + tag + ".json";
  const force = opts && opts.force;
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE" && !force) { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  await globalThis.SelfU13Init(fs);
  const G = await globalThis.IntrinsicInit(fs);
  globalThis.window = globalThis;
  const { M, MP, HD } = await loadU8Frozen(fs, G, seed);
  const srcTag = "u13-p2learn-s" + seed + "-" + steps + "st";
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-" + srcTag + ".json"));
  const RPr = u1MakeParams(G.makeRng(2));
  const RP = u13MakeParams(G.makeRng(3));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(RPr.Wc, tr.P.rWc); load(RPr.bc, tr.P.rbc); load(RPr.we, tr.P.rwe); load(RPr.wb, tr.P.rwb); load(RPr.wd, tr.P.rwd); load(RPr.b, tr.P.rb);
  if (!isRule) { load(RP.wMa, tr.P.uMa); load(RP.wMb, tr.P.uMb); load(RP.wDm, tr.P.uDm); load(RP.wa, tr.P.uA); load(RP.wHa, tr.P.uHa); load(RP.wHb, tr.P.uHb); load(RP.wb, tr.P.uwb); load(RP.wd, tr.P.uwd); load(RP.b, tr.P.ub); }
  let evalMasks = null; { const fr2 = G.makeRng(91000 + seed); evalMasks = []; for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr2.int(10) < 5 ? 2 : 0; evalMasks.push(m); } }
  const entropyOf = (hv) => { const p = u2Softmax(hv); let Hh = 0; for (let o = 0; o < 4; o++) Hh -= p[o] * Math.log(p[o] + 1e-12); return Hh / Math.log(4); };
  const argmax4 = (a) => { let b = 0; for (let i = 0; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  // Shared per-episode pipeline. mrule borrows p2learn RPr (same seed) so both arms share the identical pipeline:
  // the ONLY difference is blend (fixed margin rule vs learned gate). Cross-check: rule stats must match across arms.
  const runEp = (e, sup) => {
    const fw1 = inSeqForward(M, e.x, new Float64Array(8), evalMasks);
    const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = M.E.v[e.qk * 12 + d];
    const fr = m2ReadForward(M, MP, Eqk, sup);
    let zr = RPr.bc.v[0]; for (let j = 0; j < 48; j++) zr += RPr.Wc.v[j] * fw1.h[j];
    const betar = 1 / (1 + Math.exp(-zr));
    const Hh = entropyOf(fw1.hvLog), dis = curVoteDisagree(fw1.logitsK);
    const gr = 1 / (1 + Math.exp(-(RPr.we.v[0] * Hh + RPr.wb.v[0] * betar + RPr.wd.v[0] * dis + RPr.b.v[0])));
    const ensV = new Float64Array(4); for (let o = 0; o < 4; o++) ensV[o] = fw1.hvLog[o] + gr * fr.readLogits[o];
    if (argmax4(ensV) === e.v) { /* v-correct */ }
    const vhat = argmax4(ensV);
    const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
    const fw2 = inSeqForward(M, x2m, fw1.cNew, evalMasks);
    const baseMean = inMeanLogits({ logitsK: fw2.logitsK });
    const ad = u5HeadForward(HD, fw2.h).out;
    const mAdN = u13NormMargin(ad), mBaseN = u13NormMargin(baseMean);
    const ruleHead = mAdN >= mBaseN ? 1 : 0;
    const pad = u13Softmax(ad), pbm = u13Softmax(baseMean);
    const kl = u13KL(pad, pbm);
    let scAd = 0, scBm = 0; for (let o = 0; o < 4; o++) { scAd += Math.abs(ad[o]); scBm += Math.abs(baseMean[o]); }
    let ht = 0, bt = 0; for (let o = 1; o < 4; o++) { if (ad[o] > ad[ht]) ht = o; if (baseMean[o] > baseMean[bt]) bt = o; }
    const a = ht === bt ? 1 : 0;
    let gc = 0.5, blend = null;
    if (!isRule) {
      gc = 1 / (1 + Math.exp(-u13Feat(RP, mAdN, mBaseN, mAdN - mBaseN, a, u13Ent(ad), u13Ent(baseMean), betar, dis)));
      blend = new Float64Array(4); for (let o = 0; o < 4; o++) blend[o] = (1 - gc) * baseMean[o] + gc * ad[o];
    }
    return { vhat, vcorr: vhat === e.v ? 1 : 0, wrong1: vhat === e.v ? 0 : 1, betar, baseMean, ad, mAdN, mBaseN, ruleHead, kl, scAd, scBm, a, gc, blend };
  };
  let betaSum = 0, betaN = 0;
  const srng = G.makeRng(52500 + seed);
  let ruleAccS = 0, headAccS = 0, baseAccS = 0, pickHeadS = 0, klS = 0, scAdS = 0, scBmS = 0, blendAccS = 0, gcSumS = 0;
  const supRng = G.makeRng(42000 + seed * 104729 + 999);
  for (let i = 0; i < N; i++) {
    const e = inSeqGenShift(srng, null);
    const supE = [inSeqGenShift(supRng, null), inSeqGenShift(supRng, null), inSeqGenShift(supRng, null), inSeqGenShift(supRng, null)];
    const r = runEp(e, supE.map(se => ({ qkId: se.qk, vId: 4 + se.v, forceZero: false })));
    betaSum += r.betar; betaN++;
    const headY = argmax4(r.ad) === e.y ? 1 : 0, baseY = argmax4(r.baseMean) === e.y ? 1 : 0;
    const ruleY = (r.ruleHead ? headY : baseY);
    ruleAccS += ruleY; headAccS += headY; baseAccS += baseY; pickHeadS += r.ruleHead;
    klS += r.kl; scAdS += r.scAd; scBmS += r.scBm;
    if (!isRule) { if (argmax4(r.blend) === e.y) blendAccS++; gcSumS += r.gc; }
  }
  const arng = G.makeRng(61000 + seed);
  let ruleAccA = 0, headAccA = 0, baseAccA = 0, pickHeadA = 0, klA = 0, scAdA = 0, scBmA = 0, blendAccA = 0;
  let gAdapt = 0, gWrong = 0, gRight = 0, nW = 0, nR = 0, betaWrong = 0, betaRight = 0;
  let corrM = 0, corrG = 0, corrMG = 0, corrN = 0, corrMM = 0, corrGG = 0, logitMax = 0, salSum = 0, agreeN = 0, ruleAgree = 0;
  for (let i = 0; i < N; i++) {
    const ep = genAdaptEpisode(arng);
    const r = runEp(ep.query, ep.sup.map(se => ({ qkId: se.qk, vId: 4 + se.v, forceZero: false })));
    const headY = argmax4(r.ad) === ep.query.y ? 1 : 0, baseY = argmax4(r.baseMean) === ep.query.y ? 1 : 0;
    ruleAccA += (r.ruleHead ? headY : baseY); headAccA += headY; baseAccA += baseY; pickHeadA += r.ruleHead;
    klA += r.kl; scAdA += r.scAd; scBmA += r.scBm;
    if (!isRule) {
      if (argmax4(r.blend) === ep.query.y) blendAccA++;
      if (r.a === 1) agreeN++;
      if ((r.gc >= 0.5 ? 1 : 0) === r.ruleHead) ruleAgree++;
      if (i < 50) gAdapt += r.gc;
      let lb = 0, ll = 0; for (let o = 0; o < 4; o++) { lb += r.baseMean[o] * (o === ep.query.y ? 1 : 0); ll += r.blend[o] * (o === ep.query.y ? 1 : 0); }
      salSum += lb - ll;
      const dmN = r.mAdN - r.mBaseN;
      if (r.a === 0) { corrN++; corrM += dmN; corrG += r.gc; corrMG += dmN * r.gc; corrMM += dmN * dmN; corrGG += r.gc * r.gc; }
      if (r.wrong1 === 1) { gWrong += r.gc; nW++; betaWrong += r.betar; } else { gRight += r.gc; nR++; betaRight += r.betar; }
    } else {
      if (r.wrong1 === 1) { nW++; betaWrong += r.betar; } else { nR++; betaRight += r.betar; }
    }
  }
  const srng2 = G.makeRng(52500 + seed);
  const supRng2 = G.makeRng(42000 + seed * 104729 + 999);
  let gs = 0, pickHeadS50 = 0;
  for (let i = 0; i < 50; i++) {
    const e = inSeqGenShift(srng2, null);
    const supE = [inSeqGenShift(supRng2, null), inSeqGenShift(supRng2, null), inSeqGenShift(supRng2, null), inSeqGenShift(supRng2, null)];
    const r = runEp(e, supE.map(se => ({ qkId: se.qk, vId: 4 + se.v, forceZero: false })));
    pickHeadS50 += r.ruleHead;
    if (!isRule) gs += r.gc;
  }
  const denom = Math.sqrt(Math.max(1e-12, (corrN * corrMM - corrM * corrM) * (corrN * corrGG - corrG * corrG)));
  const corr = denom > 0 ? (corrN * corrMG - corrM * corrG) / denom : 0;
  const body = { spec: "self-u13-p2conf-prereg", track: "U13-eval", arm, seed, steps, N, verdict: "COMPLETE", rule: isRule,
    ruleAccStd: ruleAccS / N, headAccStd: headAccS / N, baseAccStd: baseAccS / N, pickHeadStd: pickHeadS / N, pickHeadStd50: pickHeadS50 / 50,
    ruleAccAdapt: ruleAccA / N, headAccAdapt: headAccA / N, baseAccAdapt: baseAccA / N, pickHeadAdapt: pickHeadA / N,
    meanKLstd: klS / N, meanKLadapt: klA / N, scaleAd: scAdA / N, scaleBase: scBmA / N, scaleAdStd: scAdS / N, scaleBaseStd: scBmS / N,
    betaMean: betaSum / betaN, betaWrong: nW ? betaWrong / nW : 0, betaRight: nR ? betaRight / nR : 0,
    betaGap: (nW ? betaWrong / nW : 0) - (nR ? betaRight / nR : 0) };
  if (!isRule) {
    body.two = blendAccS / N; body.adaptY = blendAccA / N;
    body.gAdapt = gAdapt / 50; body.gStd = gs / 50;
    body.gWrong = nW ? gWrong / nW : 0; body.gRight = nR ? gRight / nR : 0;
    body.agreeRate = agreeN / N; body.ruleAgree = ruleAgree / N; body.corrDmN = corr;
    body.saliencyDelta = salSum / N;
    body.wMa = RP.wMa.v[0]; body.wMb = RP.wMb.v[0]; body.wDm = RP.wDm.v[0]; body.wa = RP.wa.v[0];
    body.wHa = RP.wHa.v[0]; body.wHb = RP.wHb.v[0]; body.wb = RP.wb.v[0]; body.wd = RP.wd.v[0]; body.cb = RP.b.v[0];
  }
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("u13-eval " + tag + " ruleA=" + body.ruleAccAdapt.toFixed(3) + " pickHA=" + body.pickHeadAdapt.toFixed(3) + " pickHS=" + body.pickHeadStd.toFixed(3) + (isRule ? "" : " blendA=" + body.adaptY.toFixed(3)));
  return body;
};
