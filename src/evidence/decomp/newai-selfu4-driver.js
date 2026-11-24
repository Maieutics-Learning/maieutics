// newai-selfu4-driver.js — U4 modular split: frozen W6+M2-nb, learnable adapt head + gate routes.
// v1.1: head lr 5e-3 / RP lr 1e-3; quorum unit = seeds; HEAD triggers quantitative.
globalThis.SelfU4Init = async function (fs) {
  for (const p of ["src/tinynn/nn.js", "src/tinynn/seeded.js", "src/evidence/decomp/intrinsic-driver.js", "src/evidence/decomp/newai-driver.js", "src/evidence/decomp/newai-v102-driver.js", "src/evidence/decomp/newai-fr-driver.js", "src/evidence/decomp/newai-div-driver.js", "src/evidence/decomp/newai-cur-driver.js", "src/evidence/decomp/newai-winner-driver.js", "src/evidence/decomp/newai-selfmr-driver.js", "src/evidence/decomp/newai-selfm2r2-driver.js", "src/evidence/decomp/newai-selfm3r3-driver.js", "src/evidence/decomp/newai-selfu1-driver.js", "src/evidence/decomp/newai-selfu2-driver.js", "src/evidence/decomp/newai-selfu3-driver.js"]) {
    const src = await fs.readTextFile(p); (0, eval)(src + "\n//# sourceURL=" + p);
  }
  if (!globalThis.genAdaptEpisode) throw new Error("u4 stack load failed");
};
function u4ArmCode(arm) { if (arm === "u4-mod-gate") return 114; if (arm === "u4-mod-open") return 115; return 114; }
async function loadU4Base(fs, G, seed) {
  let tr = null;
  try { tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-w-w6-s" + seed + ".json")); }
  catch (e) { tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-w-w6-s" + seed + "-800st.json")); }
  const M = inSeqMakeModel(G.makeRng(1));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(M.E, tr.P.E); load(M.W1, tr.P.W1); load(M.b1, tr.P.b1);
  load(M.Wf, tr.P.Wf); load(M.bf, tr.P.bf); load(M.Wc, tr.P.Wc); load(M.bc, tr.P.bc);
  for (let k = 0; k < 5; k++) { load(M.Wh[k], tr.P.Wh[k]); load(M.bh[k], tr.P.bh[k]); }
  load(M.Hv, tr.P.Hv); load(M.bv, tr.P.bv);
  const tr2 = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-m2-nb-s" + seed + "-800st.json"));
  const MP = m2MakeParams(G.makeRng(2));
  load(MP.Wq, tr2.P.Wq); load(MP.Watt, tr2.P.Watt); load(MP.batt, tr2.P.batt);
  return { M, MP };
}
function u4MakeHead(rng) {
  const WA = inParam(rng, 4 * 48, 48);
  const ba = inParam(rng, 4, 48);
  return { WA, ba };
}
function u4MakeRP(rng) { return u1MakeParams(rng); }
globalThis.u4GradCheck = async function (fs, log) {
  await globalThis.SelfU4Init(fs);
  const G = await globalThis.IntrinsicInit(fs);
  globalThis.window = globalThis;
  const rng = G.makeRng(4342);
  const { M, MP } = await loadU4Base({ readTextFile: async (p) => { throw new Error("use live M/MP"); } }, G, 0).catch(() => ({ M: inSeqMakeModel(rng), MP: m2MakeParams(G.makeRng(4344)) }));
  const HD = u4MakeHead(G.makeRng(4345));
  const RP = u4MakeRP(G.makeRng(4343));
  const grng = G.makeRng(4346);
  const ep = genAdaptEpisode(grng);
  const e = ep.query, supE = ep.sup;
  const masks = null;
  const sup = supE.map(se => ({ qkId: se.qk, vId: 4 + se.v, forceZero: false }));
  const entropyOf = (hv) => {
    const p = u2Softmax(hv);
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
    const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
    const f2 = inSeqForward(M, x2m, f1.cNew, masks);
    const baseMean = inMeanLogits({ logitsK: f2.logitsK });
    const adaptLog = new Float64Array(4);
    for (let o = 0; o < 4; o++) { let s = HD.ba.v[o]; for (let i = 0; i < 48; i++) s += HD.WA.v[o * 48 + i] * f2.h[i]; adaptLog[o] = s; }
    const blend = new Float64Array(4); for (let o = 0; o < 4; o++) blend[o] = (1 - g) * baseMean[o] + g * adaptLog[o];
    const ce2 = inCELossGrad(blend, e.y);
    const ceH = inCELossGrad(ens, e.v);
    return ce2.loss + 0.5 * ceH.loss + 0.5 * (-(wrong1 * Math.log(beta + 1e-12) + (1 - wrong1) * Math.log(1 - beta + 1e-12)));
  };
  for (const p of [HD.WA, HD.ba, RP.Wc, RP.bc, RP.we, RP.wb, RP.wd, RP.b]) p.g.fill(0);
  const f1 = inSeqForward(M, e.x, new Float64Array(8), masks);
  const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = M.E.v[e.qk * 12 + d];
  const fr = m2ReadForward(M, MP, Eqk, sup);
  let z = RP.bc.v[0]; for (let i = 0; i < 48; i++) z += RP.Wc.v[i] * f1.h[i];
  const beta = 1 / (1 + Math.exp(-z));
  const dis = curVoteDisagree(f1.logitsK);
  const H = entropyOf(f1.hvLog);
  const g = 1 / (1 + Math.exp(-(RP.we.v[0] * H + RP.wb.v[0] * beta + RP.wd.v[0] * dis + RP.b.v[0])));
  const ensV = new Float64Array(4); for (let o = 0; o < 4; o++) ensV[o] = f1.hvLog[o] + g * fr.readLogits[o];
  const ceHv = inCELossGrad(ensV, e.v);
  let vhat = 0; for (let o = 1; o < 4; o++) if (ensV[o] > ensV[vhat]) vhat = o;
  const wrong1 = vhat === e.v ? 0 : 1;
  const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
  const f2 = inSeqForward(M, x2m, f1.cNew, masks);
  const baseMean = inMeanLogits({ logitsK: f2.logitsK });
  const adaptLog = new Float64Array(4);
  for (let o = 0; o < 4; o++) { let s = HD.ba.v[o]; for (let i = 0; i < 48; i++) s += HD.WA.v[o * 48 + i] * f2.h[i]; adaptLog[o] = s; }
  const blendArr = new Float64Array(4);
  for (let o = 0; o < 4; o++) blendArr[o] = (1 - g) * baseMean[o] + g * adaptLog[o];
  const dBlend = inCELossGrad(blendArr, e.y).d;
  const dAdapt = new Float64Array(4); for (let o = 0; o < 4; o++) dAdapt[o] = dBlend[o] * g;
  for (let o = 0; o < 4; o++) {
    HD.ba.g[o] += dAdapt[o];
    for (let i = 0; i < 48; i++) HD.WA.g[o * 48 + i] += dAdapt[o] * f2.h[i];
  }
  const dEns = new Float64Array(4); for (let o = 0; o < 4; o++) dEns[o] = ceHv.d[o] * 0.5;
  const dRead = new Float64Array(4); for (let o = 0; o < 4; o++) dRead[o] = dEns[o] * g;
  let dg = 0;
  for (let o = 0; o < 4; o++) dg += dBlend[o] * (adaptLog[o] - baseMean[o]) + dEns[o] * fr.readLogits[o];
  const dsig = dg * g * (1 - g);
  const dBetaGate = dsig * RP.wb.v[0];
  RP.we.g[0] += dsig * H; RP.wb.g[0] += dsig * beta; RP.wd.g[0] += dsig * dis; RP.b.g[0] += dsig;
  const dz = dBetaGate * beta * (1 - beta) + 0.5 * (beta - wrong1);
  RP.bc.g[0] += dz;
  for (let i = 0; i < 48; i++) RP.Wc.g[i] += dz * f1.h[i];
  void dRead;
  const eps = 1e-6;
  let worst = 0, worstWhere = "";
  const checkParam = (P, name) => {
    for (let i = 0; i < Math.min(P.v.length, 12); i++) {
      P.v[i] += eps; const a1 = lossFn();
      P.v[i] -= 2 * eps; const a0 = lossFn();
      P.v[i] += eps;
      const num = (a1 - a0) / (2 * eps), an = P.g[i];
      const rel = Math.abs(num - an) / Math.max(1e-12, Math.abs(num) + Math.abs(an));
      if (Math.abs(num) < 1e-9 && Math.abs(an) < 1e-9) continue;
      if (rel > worst) { worst = rel; worstWhere = name + "[" + i + "] num=" + num + " an=" + an; }
    }
  };
  checkParam(HD.WA, "WA"); checkParam(HD.ba, "ba");
  checkParam(RP.we, "we"); checkParam(RP.wb, "wb"); checkParam(RP.wd, "wd"); checkParam(RP.b, "b");
  checkParam(RP.Wc, "Wc");
  log("u4-gradcheck worstRel=" + worst.toExponential(2) + " at " + worstWhere);
  return { worstRel: worst, worstWhere };
};
globalThis.runU4Train = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const steps = 800, B = 16, headLr = 5e-3, gateLr = 1e-3, K = 5, H = 48, C = 6, auxW = 0.5;
  const tag = arm + "-s" + seed + "-" + steps + "st";
  const ledgerPath = "src/evidence/decomp/d-newai-self-" + tag + ".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  await globalThis.SelfU4Init(fs);
  const G = await globalThis.IntrinsicInit(fs);
  globalThis.window = globalThis;
  const { M, MP } = await loadU4Base(fs, G, seed);
  const HD = u4MakeHead(G.makeRng(75000 + seed * 7919 + u4ArmCode(arm) * 131 + 7));
  const RP = u4MakeRP(G.makeRng(75000 + seed * 7919 + u4ArmCode(arm) * 131));
  const headList = [HD.WA, HD.ba];
  const gateList = [RP.Wc, RP.bc, RP.we, RP.wb, RP.wd, RP.b];
  const optHead = new G.Adam(headLr);
  const optGate = new G.Adam(gateLr);
  const dataRng = G.makeRng(42000 + seed * 104729 + 55);
  let fixedMasks = null; { const fr = G.makeRng(91000 + seed); fixedMasks = []; for (let k = 0; k < K; k++) { const m = new Float64Array(H); for (let i = 0; i < H; i++) m[i] = fr.int(10) < 5 ? 2 : 0; fixedMasks.push(m); } }
  const entropyOf = (hv) => {
    const p = u2Softmax(hv);
    let Hh = 0; for (let o = 0; o < 4; o++) Hh -= p[o] * Math.log(p[o] + 1e-12);
    return Hh / Math.log(4);
  };
  const t0 = Date.now(), curve = [];
  const argmax4 = (a) => { let b = 0; for (let i = 0; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  const isOpen = (arm === "u4-mod-open");
  for (let step = 0; step < steps; step++) {
    for (const p of [...headList, ...gateList]) p.g.fill(0);
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
      const g = isOpen ? 1 : 1 / (1 + Math.exp(-(RP.we.v[0] * Hh + RP.wb.v[0] * beta + RP.wd.v[0] * dis + RP.b.v[0])));
      const ensV = new Float64Array(4); for (let o = 0; o < 4; o++) ensV[o] = fw1.hvLog[o] + g * fr.readLogits[o];
      const ceHv = inCELossGrad(ensV, e.v);
      const vhat = argmax4(ensV);
      const wrong1 = vhat === e.v ? 0 : 1;
      const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
      const fw2 = inSeqForward(M, x2m, fw1.cNew, fixedMasks);
      const baseMean = inMeanLogits({ logitsK: fw2.logitsK });
      const adaptLog = new Float64Array(4);
      for (let o = 0; o < 4; o++) { let s = HD.ba.v[o]; for (let i = 0; i < 48; i++) s += HD.WA.v[o * 48 + i] * fw2.h[i]; adaptLog[o] = s; }
      const blend = new Float64Array(4); for (let o = 0; o < 4; o++) blend[o] = (1 - g) * baseMean[o] + g * adaptLog[o];
      const ce2 = inCELossGrad(blend, e.y);
      lsum += ce2.loss + auxW * ceHv.loss + 0.5 * (-(wrong1 * Math.log(beta + 1e-12) + (1 - wrong1) * Math.log(1 - beta + 1e-12)));
      const dAdapt = new Float64Array(4); for (let o = 0; o < 4; o++) dAdapt[o] = ce2.d[o] * g / B;
      for (let o = 0; o < 4; o++) {
        HD.ba.g[o] += dAdapt[o];
        for (let i = 0; i < 48; i++) HD.WA.g[o * 48 + i] += dAdapt[o] * fw2.h[i];
      }
      const dEns = new Float64Array(4); for (let o = 0; o < 4; o++) dEns[o] = ceHv.d[o] * auxW / B;
      if (!isOpen) {
        let dg = 0; for (let o = 0; o < 4; o++) dg += ce2.d[o] * (adaptLog[o] - baseMean[o]) / B + dEns[o] * fr.readLogits[o];
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
    let s = 0; for (const p of [...headList, ...gateList]) for (let i = 0; i < p.g.length; i++) s += p.g[i] * p.g[i];
    const n = Math.sqrt(s); if (n > 1.0) { const sc = 1.0 / n; for (const p of [...headList, ...gateList]) for (let i = 0; i < p.g.length; i++) p.g[i] *= sc; }
    optHead.step(headList); optGate.step(gateList);
    if (step % 100 === 0 || step === steps - 1) curve.push({ step, loss: +(lsum / B).toFixed(6) });
  }
  const save = (o) => Array.from(o.v);
  const body = { spec: "self-u4-modular-prereg", track: "U4", arm, seed, steps, B, headLr, gateLr, frozenBase: "W6-s" + seed + "+M2-nb-s" + seed, verdict: "COMPLETE", wallMs: Date.now() - t0, curve,
    P: { WA: save(HD.WA), ba: save(HD.ba), Wc: save(RP.Wc), bc: save(RP.bc), we: save(RP.we), wb: save(RP.wb), wd: save(RP.wd), b: save(RP.b) } };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("u4-train " + tag + " loss0=" + curve[0].loss + " lossN=" + curve[curve.length - 1].loss);
  return body;
};
globalThis.runU4Eval = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const steps = 800, N = 200;
  const tag = arm + "-s" + seed + "-" + steps + "st";
  const ledgerPath = "src/evidence/decomp/d-newai-self-eval-" + tag + ".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  await globalThis.SelfU4Init(fs);
  const G = await globalThis.IntrinsicInit(fs);
  globalThis.window = globalThis;
  const { M, MP } = await loadU4Base(fs, G, seed);
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-" + tag + ".json"));
  const HD = u4MakeHead(G.makeRng(2));
  const RP = u4MakeRP(G.makeRng(3));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(HD.WA, tr.P.WA); load(HD.ba, tr.P.ba);
  load(RP.Wc, tr.P.Wc); load(RP.bc, tr.P.bc); load(RP.we, tr.P.we); load(RP.wb, tr.P.wb); load(RP.wd, tr.P.wd); load(RP.b, tr.P.b);
  let evalMasks = null; { const fr2 = G.makeRng(91000 + seed); evalMasks = []; for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr2.int(10) < 5 ? 2 : 0; evalMasks.push(m); } }
  const entropyOf = (hv) => {
    const p = u2Softmax(hv);
    let Hh = 0; for (let o = 0; o < 4; o++) Hh -= p[o] * Math.log(p[o] + 1e-12);
    return Hh / Math.log(4);
  };
  const argmax4 = (a) => { let b = 0; for (let i = 0; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  const isOpen = (arm === "u4-mod-open");
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
    const g = isOpen ? 1 : 1 / (1 + Math.exp(-(RP.we.v[0] * Hh + RP.wb.v[0] * beta + RP.wd.v[0] * dis + RP.b.v[0])));
    const ensV = new Float64Array(4); for (let o = 0; o < 4; o++) ensV[o] = fw1.hvLog[o] + g * fr.readLogits[o];
    if (argmax4(ensV) === e.v) scr++;
    const vhat = argmax4(ensV);
    const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
    const fw2 = inSeqForward(M, x2m, fw1.cNew, evalMasks);
    const baseMean = inMeanLogits({ logitsK: fw2.logitsK });
    const adaptLog = new Float64Array(4);
    for (let o = 0; o < 4; o++) { let s = HD.ba.v[o]; for (let ii = 0; ii < 48; ii++) s += HD.WA.v[o * 48 + ii] * fw2.h[ii]; adaptLog[o] = s; }
    const blend = new Float64Array(4); for (let o = 0; o < 4; o++) blend[o] = (1 - g) * baseMean[o] + g * adaptLog[o];
    if (argmax4(blend) === e.y) two++;
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
    const g = isOpen ? 1 : 1 / (1 + Math.exp(-(RP.we.v[0] * Hh + RP.wb.v[0] * beta + RP.wd.v[0] * dis + RP.b.v[0])));
    gAdapt += g;
    const ensV = new Float64Array(4); for (let o = 0; o < 4; o++) ensV[o] = fw1.hvLog[o] + g * fr.readLogits[o];
    const vhat = argmax4(ensV);
    if (vhat === e.v) adaptV++;
    if (vhat === e.v) { gRight += g; nR++; } else { gWrong += g; nW++; }
    const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
    const fw2 = inSeqForward(M, x2m, fw1.cNew, evalMasks);
    const baseMean = inMeanLogits({ logitsK: fw2.logitsK });
    const adaptLog = new Float64Array(4);
    for (let o = 0; o < 4; o++) { let s = HD.ba.v[o]; for (let ii = 0; ii < 48; ii++) s += HD.WA.v[o * 48 + ii] * fw2.h[ii]; adaptLog[o] = s; }
    const blend = new Float64Array(4); for (let o = 0; o < 4; o++) blend[o] = (1 - g) * baseMean[o] + g * adaptLog[o];
    if (argmax4(blend) === e.y) adaptY++;
  }
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
    const g = isOpen ? 1 : 1 / (1 + Math.exp(-(RP.we.v[0] * Hh + RP.wb.v[0] * beta + RP.wd.v[0] * dis + RP.b.v[0])));
    gStd += g;
  }
  const body = { spec: "self-u4-modular-prereg", track: "U4", arm, seed, steps, verdict: "COMPLETE", n: N, frozenBase: "W6-s" + seed + "+M2-nb-s" + seed,
    accScratch: +(scr / N).toFixed(4), accTwo: +(two / N).toFixed(4), adaptY: +(adaptY / N).toFixed(4), adaptV: +(adaptV / N).toFixed(4),
    meanGateAdapt: +(gAdapt / N).toFixed(4), meanGateStd: +(gStd / N).toFixed(4),
    meanGateWrong1: +(nW ? gWrong / nW : 0).toFixed(4), meanGateRight1: +(nR ? gRight / nR : 0).toFixed(4),
    gateWeights: { we: +RP.we.v[0].toFixed(4), wb: +RP.wb.v[0].toFixed(4), wd: +RP.wd.v[0].toFixed(4), b: +RP.b.v[0].toFixed(4) } };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("u4-eval " + tag + " adaptY=" + body.adaptY + " adaptV=" + body.adaptV + " two=" + body.accTwo + " gAdapt=" + body.meanGateAdapt + " gStd=" + body.meanGateStd);
  return body;
};
