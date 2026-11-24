// newai-selfu9-driver.js — U9: read-restored comparative gate + adapt-weighted objective (wY 2/1 both arms).
// v1.1: equal-weighting isolates comparison; RP scalars only; saliency/saturation/corr eval-only.
globalThis.SelfU9Init = async function (fs) {
  for (const p of ["src/tinynn/nn.js", "src/tinynn/seeded.js", "src/evidence/decomp/intrinsic-driver.js", "src/evidence/decomp/newai-driver.js", "src/evidence/decomp/newai-v102-driver.js", "src/evidence/decomp/newai-fr-driver.js", "src/evidence/decomp/newai-div-driver.js", "src/evidence/decomp/newai-cur-driver.js", "src/evidence/decomp/newai-winner-driver.js", "src/evidence/decomp/newai-selfmr-driver.js", "src/evidence/decomp/newai-selfm2r2-driver.js", "src/evidence/decomp/newai-selfm3r3-driver.js", "src/evidence/decomp/newai-selfu1-driver.js", "src/evidence/decomp/newai-selfu2-driver.js", "src/evidence/decomp/newai-selfu4-driver.js", "src/evidence/decomp/newai-selfu5-driver.js", "src/evidence/decomp/newai-selfu7-driver.js", "src/evidence/decomp/newai-selfu8-driver.js"]) {
    const src = await fs.readTextFile(p); (0, eval)(src + "\n//# sourceURL=" + p);
  }
  if (!globalThis.genAdaptEpisode) throw new Error("u9 stack load failed");
};
function u9ArmCode(arm) { if (arm === "u9-cmp") return 123; if (arm === "u9-ablate") return 124; return 123; }
globalThis.u9GradCheck = async function (fs, log) {
  await globalThis.SelfU9Init(fs);
  const G = await globalThis.IntrinsicInit(fs);
  globalThis.window = globalThis;
  const { M, MP, HD } = await loadU8Frozen(fs, G, 0).catch(() => ({ M: inSeqMakeModel(G.makeRng(4342)), MP: m2MakeParams(G.makeRng(4344)), HD: u5MakeHead(G.makeRng(4345)) }));
  const RP = u8MakeRP8(G.makeRng(4343));
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
    let z = RP.bc.v[0]; for (let i = 0; i < 48; i++) z += RP.Wc.v[i] * f1.h[i];
    const beta = 1 / (1 + Math.exp(-z));
    const Hh = entropyOf(f1.hvLog);
    const dis = curVoteDisagree(f1.logitsK);
    const vhat0 = argmax4(f1.hvLog);
    const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat0, 8];
    const f2 = inSeqForward(M, x2m, f1.cNew, masks);
    const baseMean = inMeanLogits({ logitsK: f2.logitsK });
    const ad = u5HeadForward(HD, f2.h).out;
    let ht = 0, bt = 0; for (let o = 1; o < 4; o++) { if (ad[o] > ad[ht]) ht = o; if (baseMean[o] > baseMean[bt]) bt = o; }
    const m = ad[ht] - baseMean[bt];
    const a = ht === bt ? 1 : 0;
    const g = 1 / (1 + Math.exp(-u8Features(RP, Hh, beta, dis, m, a, false)));
    const ens = new Float64Array(4); for (let o = 0; o < 4; o++) ens[o] = f1.hvLog[o] + g * fr.readLogits[o];
    const vhat = argmax4(ens);
    const wrong1 = vhat === e.v ? 0 : 1;
    const blend = new Float64Array(4); for (let o = 0; o < 4; o++) blend[o] = (1 - g) * baseMean[o] + g * ad[o];
    const ce2 = inCELossGrad(blend, e.y);
    const ceH = inCELossGrad(ens, e.v);
    return 2.0 * ce2.loss + 0.5 * ceH.loss + 0.5 * (-(wrong1 * Math.log(beta + 1e-12) + (1 - wrong1) * Math.log(1 - beta + 1e-12)));
  };
  const rpList = [RP.Wc, RP.bc, RP.we, RP.wb, RP.wd, RP.wm, RP.wa, RP.b];
  for (const p of rpList) p.g.fill(0);
  const f1 = inSeqForward(M, e.x, new Float64Array(8), masks);
  const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = M.E.v[e.qk * 12 + d];
  const fr = m2ReadForward(M, MP, Eqk, sup); fr.qkId = e.qk;
  let z = RP.bc.v[0]; for (let i = 0; i < 48; i++) z += RP.Wc.v[i] * f1.h[i];
  const beta = 1 / (1 + Math.exp(-z));
  const Hh = entropyOf(f1.hvLog);
  const dis = curVoteDisagree(f1.logitsK);
  const vhat0 = argmax4(f1.hvLog);
  const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat0, 8];
  const f2 = inSeqForward(M, x2m, f1.cNew, masks);
  const baseMean = inMeanLogits({ logitsK: f2.logitsK });
  const ad = u5HeadForward(HD, f2.h).out;
  let ht = 0, bt = 0; for (let o = 1; o < 4; o++) { if (ad[o] > ad[ht]) ht = o; if (baseMean[o] > baseMean[bt]) bt = o; }
  const m = ad[ht] - baseMean[bt];
  const a = ht === bt ? 1 : 0;
  const logit = u8Features(RP, Hh, beta, dis, m, a, false);
  const g = 1 / (1 + Math.exp(-logit));
  const ensV = new Float64Array(4); for (let o = 0; o < 4; o++) ensV[o] = f1.hvLog[o] + g * fr.readLogits[o];
  const ceHv = inCELossGrad(ensV, e.v);
  const vhat = argmax4(ensV);
  const wrong1 = vhat === e.v ? 0 : 1;
  const blendArr = new Float64Array(4); for (let o = 0; o < 4; o++) blendArr[o] = (1 - g) * baseMean[o] + g * ad[o];
  const dBlend = inCELossGrad(blendArr, e.y).d;
  const wY = 2.0;
  const dEns = new Float64Array(4); for (let o = 0; o < 4; o++) dEns[o] = ceHv.d[o] * 0.5;
  const dRead = new Float64Array(4); for (let o = 0; o < 4; o++) dRead[o] = dEns[o] * g;
  let dg = 0;
  for (let o = 0; o < 4; o++) dg += wY * dBlend[o] * (ad[o] - baseMean[o]) + dEns[o] * fr.readLogits[o];
  const dsig = dg * g * (1 - g);
  RP.we.g[0] += dsig * Hh; RP.wb.g[0] += dsig * beta; RP.wd.g[0] += dsig * dis; RP.wm.g[0] += dsig * m; RP.wa.g[0] += dsig * a; RP.b.g[0] += dsig;
  const dBetaGate = dsig * RP.wb.v[0];
  const dz = dBetaGate * beta * (1 - beta) + 0.5 * (beta - wrong1);
  RP.bc.g[0] += dz;
  for (let i = 0; i < 48; i++) RP.Wc.g[i] += dz * f1.h[i];
  u1ReadBackward(M, MP, fr, dRead);
  const eps = 1e-6;
  let worst = 0, worstWhere = "";
  const checkParam = (P, name) => {
    for (let i = 0; i < Math.min(P.v.length, 8); i++) {
      P.v[i] += eps; const a1 = lossFn();
      P.v[i] -= 2 * eps; const a0 = lossFn();
      P.v[i] += eps;
      const num = (a1 - a0) / (2 * eps), an = P.g[i];
      const rel = Math.abs(num - an) / Math.max(1e-12, Math.abs(num) + Math.abs(an));
      if (Math.abs(num) < 1e-9 && Math.abs(an) < 1e-9) continue;
      if (rel > worst) { worst = rel; worstWhere = name + "[" + i + "] num=" + num + " an=" + an; }
    }
  };
  checkParam(RP.wm, "wm"); checkParam(RP.wa, "wa"); checkParam(RP.we, "we"); checkParam(RP.wb, "wb"); checkParam(RP.Wc, "Wc");
  log("u9-gradcheck worstRel=" + worst.toExponential(2) + " at " + worstWhere);
  return { worstRel: worst, worstWhere };
};
globalThis.runU9Train = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const isAblate = (arm === "u9-ablate");
  const steps = 800, B = 16, rpLr = 1e-3, K = 5, H = 48, C = 6, auxW = 0.5;
  const tag = arm + "-s" + seed + "-" + steps + "st";
  const ledgerPath = "src/evidence/decomp/d-newai-self-" + tag + ".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  await globalThis.SelfU9Init(fs);
  const G = await globalThis.IntrinsicInit(fs);
  globalThis.window = globalThis;
  const { M, MP, HD } = await loadU8Frozen(fs, G, seed);
  const RP = isAblate ? u1MakeParams(G.makeRng(75000 + seed * 7919 + u9ArmCode(arm) * 131)) : u8MakeRP8(G.makeRng(75000 + seed * 7919 + u9ArmCode(arm) * 131));
  const rpList = isAblate ? [RP.Wc, RP.bc, RP.we, RP.wb, RP.wd, RP.b] : [RP.Wc, RP.bc, RP.we, RP.wb, RP.wd, RP.wm, RP.wa, RP.b];
  const optRP = new G.Adam(rpLr);
  const dataRng = G.makeRng(42000 + seed * 104729 + 55);
  let fixedMasks = null; { const fr = G.makeRng(91000 + seed); fixedMasks = []; for (let k = 0; k < K; k++) { const m = new Float64Array(H); for (let i = 0; i < H; i++) m[i] = fr.int(10) < 5 ? 2 : 0; fixedMasks.push(m); } }
  const entropyOf = (hv) => { const p = u2Softmax(hv); let Hh = 0; for (let o = 0; o < 4; o++) Hh -= p[o] * Math.log(p[o] + 1e-12); return Hh / Math.log(4); };
  const t0 = Date.now(), curve = [];
  const argmax4 = (a) => { let b = 0; for (let i = 0; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
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
      const wY = isAdapt ? 2.0 : 1.0;
      const fw1 = inSeqForward(M, e.x, new Float64Array(8), fixedMasks);
      const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = M.E.v[e.qk * 12 + d];
      const fr = m2ReadForward(M, MP, Eqk, sup); fr.qkId = e.qk;
      let z = RP.bc.v[0]; for (let i = 0; i < H; i++) z += RP.Wc.v[i] * fw1.h[i];
      const beta = 1 / (1 + Math.exp(-z));
      const dis = curVoteDisagree(fw1.logitsK);
      const Hh = entropyOf(fw1.hvLog);
      const vhat0 = argmax4(fw1.hvLog);
      const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat0, 8];
      const fw2 = inSeqForward(M, x2m, fw1.cNew, fixedMasks);
      const baseMean = inMeanLogits({ logitsK: fw2.logitsK });
      const ad = u5HeadForward(HD, fw2.h).out;
      let ht = 0, bt = 0; for (let o = 1; o < 4; o++) { if (ad[o] > ad[ht]) ht = o; if (baseMean[o] > baseMean[bt]) bt = o; }
      const m = ad[ht] - baseMean[bt];
      const a = ht === bt ? 1 : 0;
      const logit = u8Features(RP, Hh, beta, dis, m, a, isAblate);
      const g = 1 / (1 + Math.exp(-logit));
      const ens = new Float64Array(4); for (let o = 0; o < 4; o++) ens[o] = fw1.hvLog[o] + g * fr.readLogits[o];
      const ceHv = inCELossGrad(ens, e.v);
      const vhat = argmax4(ens);
      const wrong1 = vhat === e.v ? 0 : 1;
      const blend = new Float64Array(4); for (let o = 0; o < 4; o++) blend[o] = (1 - g) * baseMean[o] + g * ad[o];
      const ce2 = inCELossGrad(blend, e.y);
      lsum += wY * ce2.loss + auxW * ceHv.loss + 0.5 * (-(wrong1 * Math.log(beta + 1e-12) + (1 - wrong1) * Math.log(1 - beta + 1e-12)));
      const dEns = new Float64Array(4); for (let o = 0; o < 4; o++) dEns[o] = ceHv.d[o] * auxW / B;
      const dRead = new Float64Array(4); for (let o = 0; o < 4; o++) dRead[o] = dEns[o] * g;
      let dg = 0;
      for (let o = 0; o < 4; o++) dg += wY * ce2.d[o] * (ad[o] - baseMean[o]) / B + dEns[o] * fr.readLogits[o];
      const dsig = dg * g * (1 - g);
      RP.we.g[0] += dsig * Hh; RP.wb.g[0] += dsig * beta; RP.wd.g[0] += dsig * dis; RP.b.g[0] += dsig;
      if (!isAblate) { RP.wm.g[0] += dsig * m; RP.wa.g[0] += dsig * a; }
      const dBetaGate = dsig * RP.wb.v[0];
      const dz = dBetaGate * beta * (1 - beta) + 0.5 * (beta - wrong1) / B;
      RP.bc.g[0] += dz;
      for (let i = 0; i < H; i++) RP.Wc.g[i] += dz * fw1.h[i];
      u1ReadBackward(M, MP, fr, dRead);
    }
    let s = 0; for (const p of rpList) for (let i = 0; i < p.g.length; i++) s += p.g[i] * p.g[i];
    const n = Math.sqrt(s); if (n > 1.0) { const sc = 1.0 / n; for (const p of rpList) for (let i = 0; i < p.g.length; i++) p.g[i] *= sc; }
    optRP.step(rpList);
    if (step % 100 === 0 || step === steps - 1) curve.push({ step, loss: +(lsum / B).toFixed(6) });
  }
  const save = (o) => Array.from(o.v);
  const P = { Wc: save(RP.Wc), bc: save(RP.bc), we: save(RP.we), wb: save(RP.wb), wd: save(RP.wd), b: save(RP.b) };
  if (!isAblate) { P.wm = save(RP.wm); P.wa = save(RP.wa); }
  const body = { spec: "self-u9-comparative2-prereg", track: "U9", arm, seed, steps, B, rpLr, wY: "adapt2.0/std1.0", vhatOrder: "vhat0=argmax(hvLog)", frozen: "W6+M2+U5head-s" + seed, verdict: "COMPLETE", wallMs: Date.now() - t0, curve, P };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("u9-train " + tag + " loss0=" + curve[0].loss + " lossN=" + curve[curve.length - 1].loss);
  return body;
};
globalThis.runU9Eval = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const isAblate = (arm === "u9-ablate");
  const steps = 800, N = 200;
  const tag = arm + "-s" + seed + "-" + steps + "st";
  const ledgerPath = "src/evidence/decomp/d-newai-self-eval-" + tag + ".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  await globalThis.SelfU9Init(fs);
  const G = await globalThis.IntrinsicInit(fs);
  globalThis.window = globalThis;
  const { M, MP, HD } = await loadU8Frozen(fs, G, seed);
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-" + tag + ".json"));
  const RP = isAblate ? u1MakeParams(G.makeRng(2)) : u8MakeRP8(G.makeRng(2));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(RP.Wc, tr.P.Wc); load(RP.bc, tr.P.bc); load(RP.we, tr.P.we); load(RP.wb, tr.P.wb); load(RP.wd, tr.P.wd); load(RP.b, tr.P.b);
  if (!isAblate) { load(RP.wm, tr.P.wm); load(RP.wa, tr.P.wa); }
  let evalMasks = null; { const fr2 = G.makeRng(91000 + seed); evalMasks = []; for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr2.int(10) < 5 ? 2 : 0; evalMasks.push(m); } }
  const entropyOf = (hv) => { const p = u2Softmax(hv); let Hh = 0; for (let o = 0; o < 4; o++) Hh -= p[o] * Math.log(p[o] + 1e-12); return Hh / Math.log(4); };
  const argmax4 = (a) => { let b = 0; for (let i = 0; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  const srng = G.makeRng(52500 + seed);
  let scr = 0, two = 0, agreeN = 0;
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
    const vhat0 = argmax4(fw1.hvLog);
    const x2m0 = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat0, 8];
    const fw20 = inSeqForward(M, x2m0, fw1.cNew, evalMasks);
    const baseMean0 = inMeanLogits({ logitsK: fw20.logitsK });
    const ad0 = u5HeadForward(HD, fw20.h).out;
    let ht0 = 0, bt0 = 0; for (let o = 1; o < 4; o++) { if (ad0[o] > ad0[ht0]) ht0 = o; if (baseMean0[o] > baseMean0[bt0]) bt0 = o; }
    if (ht0 === bt0) agreeN++;
    const m0 = ad0[ht0] - baseMean0[bt0];
    const a0 = ht0 === bt0 ? 1 : 0;
    const g = 1 / (1 + Math.exp(-u8Features(RP, Hh, beta, dis, m0, a0, isAblate)));
    const ensV = new Float64Array(4); for (let o = 0; o < 4; o++) ensV[o] = fw1.hvLog[o] + g * fr.readLogits[o];
    if (argmax4(ensV) === e.v) scr++;
    const vhat = argmax4(ensV);
    const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat0, 8];
    const fw2 = inSeqForward(M, x2m, fw1.cNew, evalMasks);
    const baseMean = inMeanLogits({ logitsK: fw2.logitsK });
    const ad = u5HeadForward(HD, fw2.h).out;
    const blend = new Float64Array(4); for (let o = 0; o < 4; o++) blend[o] = (1 - g) * baseMean[o] + g * ad[o];
    if (argmax4(blend) === e.y) two++;
  }
  const arng = G.makeRng(61000 + seed);
  let adaptY = 0, adaptV = 0, gAdapt = 0, gWrong = 0, gRight = 0, nW = 0, nR = 0, corrM = 0, corrG = 0, corrMG = 0, corrN = 0, corrMM = 0, corrGG = 0, logitMax = 0, salSum = 0;
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
    const vhat0 = argmax4(fw1.hvLog);
    const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat0, 8];
    const fw2 = inSeqForward(M, x2m, fw1.cNew, evalMasks);
    const baseMean = inMeanLogits({ logitsK: fw2.logitsK });
    const ad = u5HeadForward(HD, fw2.h).out;
    let ht = 0, bt = 0; for (let o = 1; o < 4; o++) { if (ad[o] > ad[ht]) ht = o; if (baseMean[o] > baseMean[bt]) bt = o; }
    const m = ad[ht] - baseMean[bt];
    const a = ht === bt ? 1 : 0;
    const logit = u8Features(RP, Hh, beta, dis, m, a, isAblate);
    if (Math.abs(logit) > Math.abs(logitMax)) logitMax = logit;
    const g = 1 / (1 + Math.exp(-logit));
    const ensV = new Float64Array(4); for (let o = 0; o < 4; o++) ensV[o] = fw1.hvLog[o] + g * fr.readLogits[o];
    if (argmax4(ensV) === e.v) adaptV++;
    const vhat = argmax4(ensV);
    const blend = new Float64Array(4); for (let o = 0; o < 4; o++) blend[o] = (1 - g) * baseMean[o] + g * ad[o];
    if (argmax4(blend) === e.y) adaptY++;
    let lb = 0, ll = 0; for (let o = 0; o < 4; o++) { lb += baseMean[o] * (o === e.y ? 1 : 0); ll += blend[o] * (o === e.y ? 1 : 0); }
    salSum += lb - ll;
    if (i < 50) gAdapt += g;
    if (vhat === e.v) { gRight += g; nR++; } else { gWrong += g; nW++; }
    if (a === 0) { corrN++; corrM += m; corrG += g; corrMG += m * g; corrMM += m * m; corrGG += g * g; }
  }
  const srng2 = G.makeRng(52500 + seed);
  const supRng2 = G.makeRng(42000 + seed * 104729 + 999);
  let gs = 0;
  for (let i = 0; i < 50; i++) {
    const e = inSeqGenShift(srng2, null);
    const supE = [inSeqGenShift(supRng2, null), inSeqGenShift(supRng2, null), inSeqGenShift(supRng2, null), inSeqGenShift(supRng2, null)];
    const sup = supE.map(se => ({ qkId: se.qk, vId: 4 + se.v, forceZero: false }));
    const fw1 = inSeqForward(M, e.x, new Float64Array(8), evalMasks);
    const fw20 = inSeqForward(M, [9, 9, 9, 9, 9, 9, e.qk, e.k, argmax4(fw1.hvLog), 8], fw1.cNew, evalMasks);
    const baseMean0 = inMeanLogits({ logitsK: fw20.logitsK });
    const ad0 = u5HeadForward(HD, fw20.h).out;
    let ht0 = 0, bt0 = 0; for (let o = 1; o < 4; o++) { if (ad0[o] > ad0[ht0]) ht0 = o; if (baseMean0[o] > baseMean0[bt0]) bt0 = o; }
    const m0 = ad0[ht0] - baseMean0[bt0];
    const a0 = ht0 === bt0 ? 1 : 0;
    let z = RP.bc.v[0]; for (let j = 0; j < 48; j++) z += RP.Wc.v[j] * fw1.h[j];
    const beta = 1 / (1 + Math.exp(-z));
    gs += 1 / (1 + Math.exp(-u8Features(RP, entropyOf(fw1.hvLog), beta, curVoteDisagree(fw1.logitsK), m0, a0, isAblate)));
  }
  const denom = Math.sqrt(Math.max(1e-12, (corrN * corrMM - corrM * corrM) * (corrN * corrGG - corrG * corrG)));
  const corr = denom > 0 ? (corrN * corrMG - corrM * corrG) / denom : 0;
  const P = { we: RP.we.v[0], wb: RP.wb.v[0], wd: RP.wd.v[0], b: RP.b.v[0] };
  if (!isAblate) { P.wm = RP.wm.v[0]; P.wa = RP.wa.v[0]; }
  const body = { spec: "self-u9-comparative2-prereg", track: "U9-eval", arm, seed, steps, N, verdict: "COMPLETE",
    scr: scr / N, two: two / N, adaptY: adaptY / N, adaptV: adaptV / N,
    gAdapt: gAdapt / 50, gStd: gs / 50, gWrong: nW ? gWrong / nW : 0, gRight: nR ? gRight / nR : 0,
    agreeRate: agreeN / N, corrMGDisagree: corr, logitMax, saliencyDelta: salSum / N, ...P };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("u9-eval " + tag + " two=" + body.two.toFixed(3) + " adaptY=" + body.adaptY.toFixed(3) + " gA=" + body.gAdapt.toFixed(3) + " gS=" + body.gStd.toFixed(3));
  return body;
};
