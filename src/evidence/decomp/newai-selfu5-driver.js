// newai-selfu5-driver.js — U5 nonlinear/scrub head (48→24 silu →4) on frozen healthy base.
// v1.1: head warmup 100st (gate lr 0) then joint head 5e-3 / RP 1e-3; HEAD band + baseline-symmetry.
globalThis.SelfU5Init = async function (fs) {
  for (const p of ["src/tinynn/nn.js", "src/tinynn/seeded.js", "src/evidence/decomp/intrinsic-driver.js", "src/evidence/decomp/newai-driver.js", "src/evidence/decomp/newai-v102-driver.js", "src/evidence/decomp/newai-fr-driver.js", "src/evidence/decomp/newai-div-driver.js", "src/evidence/decomp/newai-cur-driver.js", "src/evidence/decomp/newai-winner-driver.js", "src/evidence/decomp/newai-selfmr-driver.js", "src/evidence/decomp/newai-selfm2r2-driver.js", "src/evidence/decomp/newai-selfm3r3-driver.js", "src/evidence/decomp/newai-selfu1-driver.js", "src/evidence/decomp/newai-selfu2-driver.js", "src/evidence/decomp/newai-selfu4-driver.js"]) {
    const src = await fs.readTextFile(p); (0, eval)(src + "\n//# sourceURL=" + p);
  }
  if (!globalThis.genAdaptEpisode) throw new Error("u5 stack load failed");
};
function u5ArmCode(arm) { if (arm === "u5-nl-gate") return 118; if (arm === "u5-nl-open") return 119; return 118; }
function u5MakeHead(rng) {
  const W1 = inParam(rng, 24 * 48, 48);
  const b1 = inParam(rng, 24, 48); b1.v.fill(0);
  const W2 = inParam(rng, 4 * 24, 24);
  const b2 = inParam(rng, 4, 24); b2.v.fill(0);
  return { W1, b1, W2, b2 };
}
function u5HeadForward(HD, h) {
  const pre = new Float64Array(24);
  for (let j = 0; j < 24; j++) { let s = HD.b1.v[j]; for (let i = 0; i < 48; i++) s += HD.W1.v[j * 48 + i] * h[i]; pre[j] = s; }
  const ha = new Float64Array(24);
  for (let j = 0; j < 24; j++) ha[j] = pre[j] / (1 + Math.exp(-pre[j])) + 0.5 * pre[j] / (1 + Math.exp(-pre[j])) * (1 - 1 / (1 + Math.exp(-pre[j])) * 0 + 1 - 1 / (1 + Math.exp(-pre[j])));
  // silu: x*sigmoid(x) — compute directly for clarity
  for (let j = 0; j < 24; j++) { const sig = 1 / (1 + Math.exp(-pre[j])); ha[j] = pre[j] * sig; }
  const out = new Float64Array(4);
  for (let o = 0; o < 4; o++) { let s = HD.b2.v[o]; for (let j = 0; j < 24; j++) s += HD.W2.v[o * 24 + j] * ha[j]; out[o] = s; }
  return { pre, ha, out };
}
function u5HeadBackward(HD, h, fw, dOut) {
  // dOut length 4; returns dh (48) for completeness (base frozen, discarded)
  const dha = new Float64Array(24);
  for (let j = 0; j < 24; j++) { let s = 0; for (let o = 0; o < 4; o++) s += HD.W2.v[o * 24 + j] * dOut[o]; dha[j] = s; }
  for (let o = 0; o < 4; o++) {
    HD.b2.g[o] += dOut[o];
    for (let j = 0; j < 24; j++) HD.W2.g[o * 24 + j] += dOut[o] * fw.ha[j];
  }
  const dpre = new Float64Array(24);
  for (let j = 0; j < 24; j++) {
    const sig = 1 / (1 + Math.exp(-fw.pre[j]));
    const dsilu = sig * (1 + fw.pre[j] * (1 - sig));
    dpre[j] = dha[j] * dsilu;
    HD.b1.g[j] += dpre[j];
    for (let i = 0; i < 48; i++) HD.W1.g[j * 48 + i] += dpre[j] * h[i];
  }
}
globalThis.u5GradCheck = async function (fs, log) {
  await globalThis.SelfU5Init(fs);
  const G = await globalThis.IntrinsicInit(fs);
  globalThis.window = globalThis;
  const { M, MP } = await loadU4Base({ readTextFile: async () => { throw new Error("use live"); } }, G, 0).catch(() => ({ M: inSeqMakeModel(G.makeRng(4342)), MP: m2MakeParams(G.makeRng(4344)) }));
  const HD = u5MakeHead(G.makeRng(4345));
  const RP = u4MakeRP(G.makeRng(4343));
  const grng = G.makeRng(4346);
  const ep = genAdaptEpisode(grng);
  const e = ep.query, supE = ep.sup;
  const masks = null;
  const sup = supE.map(se => ({ qkId: se.qk, vId: 4 + se.v, forceZero: false }));
  const entropyOf = (hv) => { const p = u2Softmax(hv); let H = 0; for (let o = 0; o < 4; o++) H -= p[o] * Math.log(p[o] + 1e-12); return H / Math.log(4); };
  const lossFn = () => {
    const f1 = inSeqForward(M, e.x, new Float64Array(8), masks);
    const Eq = new Float64Array(12); for (let d = 0; d < 12; d++) Eq[d] = M.E.v[e.qk * 12 + d];
    const fr = m2ReadForward(M, MP, Eq, sup);
    let z = RP.bc.v[0]; for (let i = 0; i < 48; i++) z += RP.Wc.v[i] * f1.h[i];
    const beta = 1 / (1 + Math.exp(-z));
    const g = 1 / (1 + Math.exp(-(RP.we.v[0] * entropyOf(f1.hvLog) + RP.wb.v[0] * beta + RP.wd.v[0] * curVoteDisagree(f1.logitsK) + RP.b.v[0])));
    const ens = new Float64Array(4); for (let o = 0; o < 4; o++) ens[o] = f1.hvLog[o] + g * fr.readLogits[o];
    let vhat = 0; for (let o = 1; o < 4; o++) if (ens[o] > ens[vhat]) vhat = o;
    const wrong1 = vhat === e.v ? 0 : 1;
    const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
    const f2 = inSeqForward(M, x2m, f1.cNew, masks);
    const baseMean = inMeanLogits({ logitsK: f2.logitsK });
    const ad = u5HeadForward(HD, f2.h).out;
    const blend = new Float64Array(4); for (let o = 0; o < 4; o++) blend[o] = (1 - g) * baseMean[o] + g * ad[o];
    const ce2 = inCELossGrad(blend, e.y);
    const ceH = inCELossGrad(ens, e.v);
    return ce2.loss + 0.5 * ceH.loss + 0.5 * (-(wrong1 * Math.log(beta + 1e-12) + (1 - wrong1) * Math.log(1 - beta + 1e-12)));
  };
  for (const p of [HD.W1, HD.b1, HD.W2, HD.b2, RP.Wc, RP.bc, RP.we, RP.wb, RP.wd, RP.b]) p.g.fill(0);
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
  const fh = u5HeadForward(HD, f2.h);
  const blendArr = new Float64Array(4); for (let o = 0; o < 4; o++) blendArr[o] = (1 - g) * baseMean[o] + g * fh.out[o];
  const dBlend = inCELossGrad(blendArr, e.y).d;
  const dAdapt = new Float64Array(4); for (let o = 0; o < 4; o++) dAdapt[o] = dBlend[o] * g;
  u5HeadBackward(HD, f2.h, fh, dAdapt);
  const dEns = new Float64Array(4); for (let o = 0; o < 4; o++) dEns[o] = ceHv.d[o] * 0.5;
  let dg = 0; for (let o = 0; o < 4; o++) dg += dBlend[o] * (fh.out[o] - baseMean[o]) + dEns[o] * fr.readLogits[o];
  const dsig = dg * g * (1 - g);
  const dBetaGate = dsig * RP.wb.v[0];
  RP.we.g[0] += dsig * H; RP.wb.g[0] += dsig * beta; RP.wd.g[0] += dsig * dis; RP.b.g[0] += dsig;
  const dz = dBetaGate * beta * (1 - beta) + 0.5 * (beta - wrong1);
  RP.bc.g[0] += dz;
  for (let i = 0; i < 48; i++) RP.Wc.g[i] += dz * f1.h[i];
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
  checkParam(HD.W2, "W2"); checkParam(HD.b2, "b2"); checkParam(HD.W1, "W1");
  checkParam(RP.we, "we"); checkParam(RP.wb, "wb"); checkParam(RP.Wc, "Wc");
  log("u5-gradcheck worstRel=" + worst.toExponential(2) + " at " + worstWhere);
  return { worstRel: worst, worstWhere };
};
globalThis.runU5Train = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const steps = 800, B = 16, headLr = 5e-3, gateLr = 1e-3, K = 5, H = 48, C = 6, auxW = 0.5;
  const tag = arm + "-s" + seed + "-" + steps + "st";
  const ledgerPath = "src/evidence/decomp/d-newai-self-" + tag + ".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  await globalThis.SelfU5Init(fs);
  const G = await globalThis.IntrinsicInit(fs);
  globalThis.window = globalThis;
  const { M, MP } = await loadU4Base(fs, G, seed);
  const HD = u5MakeHead(G.makeRng(75000 + seed * 7919 + u5ArmCode(arm) * 131 + 7));
  const RP = u4MakeRP(G.makeRng(75000 + seed * 7919 + u5ArmCode(arm) * 131));
  const headList = [HD.W1, HD.b1, HD.W2, HD.b2];
  const gateList = [RP.Wc, RP.bc, RP.we, RP.wb, RP.wd, RP.b];
  const optHead = new G.Adam(headLr);
  const optGate = new G.Adam(gateLr);
  const dataRng = G.makeRng(42000 + seed * 104729 + 55);
  let fixedMasks = null; { const fr = G.makeRng(91000 + seed); fixedMasks = []; for (let k = 0; k < K; k++) { const m = new Float64Array(H); for (let i = 0; i < H; i++) m[i] = fr.int(10) < 5 ? 2 : 0; fixedMasks.push(m); } }
  const entropyOf = (hv) => { const p = u2Softmax(hv); let Hh = 0; for (let o = 0; o < 4; o++) Hh -= p[o] * Math.log(p[o] + 1e-12); return Hh / Math.log(4); };
  const t0 = Date.now(), curve = [];
  const argmax4 = (a) => { let b = 0; for (let i = 0; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  const isOpen = (arm === "u5-nl-open");
  const runStep = (allowGate) => {
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
      const fh = u5HeadForward(HD, fw2.h);
      const blend = new Float64Array(4); for (let o = 0; o < 4; o++) blend[o] = (1 - g) * baseMean[o] + g * fh.out[o];
      const ce2 = inCELossGrad(blend, e.y);
      lsum += ce2.loss + auxW * ceHv.loss + 0.5 * (-(wrong1 * Math.log(beta + 1e-12) + (1 - wrong1) * Math.log(1 - beta + 1e-12)));
      const dAdapt = new Float64Array(4); for (let o = 0; o < 4; o++) dAdapt[o] = ce2.d[o] * g / B;
      // head grads always (even warmup)
      const dha = new Float64Array(24);
      for (let j = 0; j < 24; j++) { let s = 0; for (let o = 0; o < 4; o++) s += HD.W2.v[o * 24 + j] * dAdapt[o]; dha[j] = s; }
      for (let o = 0; o < 4; o++) { HD.b2.g[o] += dAdapt[o]; for (let j = 0; j < 24; j++) HD.W2.g[o * 24 + j] += dAdapt[o] * fh.ha[j]; }
      for (let j = 0; j < 24; j++) {
        const sig = 1 / (1 + Math.exp(-fh.pre[j]));
        const dpre = dha[j] * sig * (1 + fh.pre[j] * (1 - sig));
        HD.b1.g[j] += dpre;
        for (let i = 0; i < 48; i++) HD.W1.g[j * 48 + i] += dpre * fw2.h[i];
      }
      const dEns = new Float64Array(4); for (let o = 0; o < 4; o++) dEns[o] = ceHv.d[o] * auxW / B;
      if (!isOpen && allowGate) {
        let dg = 0; for (let o = 0; o < 4; o++) dg += ce2.d[o] * (fh.out[o] - baseMean[o]) / B + dEns[o] * fr.readLogits[o];
        const dsig = dg * g * (1 - g);
        const dBetaGate = dsig * RP.wb.v[0];
        RP.we.g[0] += dsig * Hh; RP.wb.g[0] += dsig * beta; RP.wd.g[0] += dsig * dis; RP.b.g[0] += dsig;
        const dz = dBetaGate * beta * (1 - beta) + 0.5 * (beta - wrong1) / B;
        RP.bc.g[0] += dz;
        for (let i = 0; i < H; i++) RP.Wc.g[i] += dz * fw1.h[i];
      } else if (allowGate) {
        const dz = 0.5 * (beta - wrong1) / B;
        RP.bc.g[0] += dz;
        for (let i = 0; i < H; i++) RP.Wc.g[i] += dz * fw1.h[i];
      } else {
        // warmup: critic grads still accrue but gate frozen — allow critic only
        const dz = 0.5 * (beta - wrong1) / B;
        RP.bc.g[0] += dz;
        for (let i = 0; i < H; i++) RP.Wc.g[i] += dz * fw1.h[i];
        for (const p of [RP.we, RP.wb, RP.wd, RP.b]) p.g.fill(0);
      }
    }
    let s = 0; for (const p of [...headList, ...gateList]) for (let i = 0; i < p.g.length; i++) s += p.g[i] * p.g[i];
    const n = Math.sqrt(s); if (n > 1.0) { const sc = 1.0 / n; for (const p of [...headList, ...gateList]) for (let i = 0; i < p.g.length; i++) p.g[i] *= sc; }
    return lsum;
  };
  // warmup 100st head-only (gate frozen)
  for (let step = 0; step < 100; step++) {
    const lsum = runStep(false);
    optHead.step(headList);
    // critic allowed during warmup via gate opt on Wc/bc only: mask gate weights
    const saveG = [RP.we.g[0], RP.wb.g[0], RP.wd.g[0], RP.b.g[0]];
    optGate.step([RP.Wc, RP.bc]);
    RP.we.g[0] = 0; RP.wb.g[0] = 0; RP.wd.g[0] = 0; RP.b.g[0] = 0;
    void saveG;
    if (step % 100 === 0) curve.push({ step: "w" + step, loss: +(lsum / B).toFixed(6) });
  }
  for (let step = 0; step < steps; step++) {
    const lsum = runStep(true);
    optHead.step(headList); optGate.step(gateList);
    if (step % 100 === 0 || step === steps - 1) curve.push({ step, loss: +(lsum / B).toFixed(6) });
  }
  const save = (o) => Array.from(o.v);
  const body = { spec: "self-u5-nonlinear-prereg", track: "U5", arm, seed, steps, B, headLr, gateLr, warmup100: true, frozenBase: "W6-s" + seed + "+M2-nb-s" + seed, verdict: "COMPLETE", wallMs: Date.now() - t0, curve,
    P: { W1: save(HD.W1), b1: save(HD.b1), W2: save(HD.W2), b2: save(HD.b2), Wc: save(RP.Wc), bc: save(RP.bc), we: save(RP.we), wb: save(RP.wb), wd: save(RP.wd), b: save(RP.b) } };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("u5-train " + tag + " loss0=" + curve[0].loss + " lossN=" + curve[curve.length - 1].loss);
  return body;
};
globalThis.runU5Eval = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const steps = 800, N = 200;
  const tag = arm + "-s" + seed + "-" + steps + "st";
  const ledgerPath = "src/evidence/decomp/d-newai-self-eval-" + tag + ".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  await globalThis.SelfU5Init(fs);
  const G = await globalThis.IntrinsicInit(fs);
  globalThis.window = globalThis;
  const { M, MP } = await loadU4Base(fs, G, seed);
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-" + tag + ".json"));
  const HD = u5MakeHead(G.makeRng(1));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(HD.W1, tr.P.W1); load(HD.b1, tr.P.b1); load(HD.W2, tr.P.W2); load(HD.b2, tr.P.b2);
  const RP = u1MakeParams(G.makeRng(2));
  load(RP.Wc, tr.P.Wc); load(RP.bc, tr.P.bc); load(RP.we, tr.P.we); load(RP.wb, tr.P.wb); load(RP.wd, tr.P.wd); load(RP.b, tr.P.b);
  let evalMasks = null; { const fr2 = G.makeRng(91000 + seed); evalMasks = []; for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr2.int(10) < 5 ? 2 : 0; evalMasks.push(m); } }
  const entropyOf = (hv) => { const p = u2Softmax(hv); let Hh = 0; for (let o = 0; o < 4; o++) Hh -= p[o] * Math.log(p[o] + 1e-12); return Hh / Math.log(4); };
  const argmax4 = (a) => { let b = 0; for (let i = 0; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  const isOpen = (arm === "u5-nl-open");
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
    const ad = u5HeadForward(HD, fw2.h).out;
    const blend = new Float64Array(4); for (let o = 0; o < 4; o++) blend[o] = (1 - g) * baseMean[o] + g * ad[o];
    if (argmax4(blend) === e.y) two++;
  }
  const arng = G.makeRng(61000 + seed);
  let adaptY = 0, adaptV = 0, gAdapt = 0, gWrong = 0, gRight = 0, nW = 0, nR = 0;
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
    const ensV = new Float64Array(4); for (let o = 0; o < 4; o++) ensV[o] = fw1.hvLog[o] + g * fr.readLogits[o];
    if (argmax4(ensV) === e.v) adaptV++;
    const vhat = argmax4(ensV);
    const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
    const fw2 = inSeqForward(M, x2m, fw1.cNew, evalMasks);
    const baseMean = inMeanLogits({ logitsK: fw2.logitsK });
    const ad = u5HeadForward(HD, fw2.h).out;
    const blend = new Float64Array(4); for (let o = 0; o < 4; o++) blend[o] = (1 - g) * baseMean[o] + g * ad[o];
    if (argmax4(blend) === e.y) adaptY++;
    if (i < 50) gAdapt += g;
    if (vhat === e.v) { gRight += g; nR++; } else { gWrong += g; nW++; }
  }
  const srng2 = G.makeRng(52500 + seed);
  const supRng2 = G.makeRng(42000 + seed * 104729 + 999);
  let gs = 0;
  for (let i = 0; i < 50; i++) {
    const e = inSeqGenShift(srng2, null);
    const supE = [inSeqGenShift(supRng2, null), inSeqGenShift(supRng2, null), inSeqGenShift(supRng2, null), inSeqGenShift(supRng2, null)];
    const sup = supE.map(se => ({ qkId: se.qk, vId: 4 + se.v, forceZero: false }));
    const fw1 = inSeqForward(M, e.x, new Float64Array(8), evalMasks);
    const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = M.E.v[e.qk * 12 + d];
    const fr = m2ReadForward(M, MP, Eqk, sup);
    let z = RP.bc.v[0]; for (let j = 0; j < 48; j++) z += RP.Wc.v[j] * fw1.h[j];
    const beta = 1 / (1 + Math.exp(-z));
    const dis = curVoteDisagree(fw1.logitsK);
    const Hh = entropyOf(fw1.hvLog);
    const g = isOpen ? 1 : 1 / (1 + Math.exp(-(RP.we.v[0] * Hh + RP.wb.v[0] * beta + RP.wd.v[0] * dis + RP.b.v[0])));
    gs += g;
  }
  const body = { spec: "self-u5-nonlinear-prereg", track: "U5-eval", arm, seed, steps, N, verdict: "COMPLETE",
    scr: scr / N, two: two / N, adaptY: adaptY / N, adaptV: adaptV / N,
    gAdapt: gAdapt / 50, gStd: gs / 50, gWrong: nW ? gWrong / nW : 0, gRight: nR ? gRight / nR : 0,
    we: RP.we.v[0], wb: RP.wb.v[0], wd: RP.wd.v[0], b: RP.b.v[0] };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("u5-eval " + tag + " two=" + body.two.toFixed(3) + " adaptY=" + body.adaptY.toFixed(3));
  return body;
};
