// newai-selfu6-driver.js — U6 wound-repair: wounded U1-unf-gate init, standard-only + tell-it-wrong.
// v1.1 PINS: fresh Adam, twin-match (adapt sampled zero-grad), critic warmup 50st, live dual-LR trunk 5e-3 / RP 1e-3.
globalThis.SelfU6Init = async function (fs) {
  for (const p of ["src/tinynn/nn.js", "src/tinynn/seeded.js", "src/evidence/decomp/intrinsic-driver.js", "src/evidence/decomp/newai-driver.js", "src/evidence/decomp/newai-v102-driver.js", "src/evidence/decomp/newai-fr-driver.js", "src/evidence/decomp/newai-div-driver.js", "src/evidence/decomp/newai-cur-driver.js", "src/evidence/decomp/newai-winner-driver.js", "src/evidence/decomp/newai-selfmr-driver.js", "src/evidence/decomp/newai-selfm2r2-driver.js", "src/evidence/decomp/newai-selfm3r3-driver.js", "src/evidence/decomp/newai-selfu1-driver.js", "src/evidence/decomp/newai-selfu2-driver.js"]) {
    const src = await fs.readTextFile(p); (0, eval)(src + "\n//# sourceURL=" + p);
  }
  if (!globalThis.genAdaptEpisode) throw new Error("u6 stack load failed");
};
function u6ArmCode(arm) { if (arm === "u6-rep-frozen") return 116; if (arm === "u6-rep-live") return 117; return 116; }
async function loadU6Wounded(fs, G, seed) {
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-u1-unf-gate-s" + seed + "-800st.json"));
  const M = inSeqMakeModel(G.makeRng(1));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(M.E, tr.P.E); load(M.W1, tr.P.W1); load(M.b1, tr.P.b1);
  load(M.Wf, tr.P.Wf); load(M.bf, tr.P.bf); load(M.Wc, tr.P.Wc); load(M.bc, tr.P.bc);
  for (let k = 0; k < 5; k++) { load(M.Wh[k], tr.P.Wh[k]); load(M.bh[k], tr.P.bh[k]); }
  load(M.Hv, tr.P.Hv); load(M.bv, tr.P.bv);
  const MP = m2MakeParams(G.makeRng(2));
  load(MP.Wq, tr.P.Wq); load(MP.Watt, tr.P.Watt); load(MP.batt, tr.P.batt);
  const RP = u1MakeParams(G.makeRng(3));
  load(RP.Wc, tr.P.cWc); load(RP.bc, tr.P.cbc); load(RP.we, tr.P.we); load(RP.wb, tr.P.wb); load(RP.wd, tr.P.wd); load(RP.b, tr.P.b);
  return { M, MP, RP };
}
globalThis.u6GradCheck = async function (fs, log) {
  await globalThis.SelfU6Init(fs);
  const G = await globalThis.IntrinsicInit(fs);
  globalThis.window = globalThis;
  const M = inSeqMakeModel(G.makeRng(4342));
  const MP = m2MakeParams(G.makeRng(4344));
  const RP = u1MakeParams(G.makeRng(4343));
  const grng = G.makeRng(4347);
  const e = inSeqGenShift(grng, null);
  const supE = [inSeqGenShift(grng, null), inSeqGenShift(grng, null), inSeqGenShift(grng, null), inSeqGenShift(grng, null)];
  const masks = null;
  const sup = supE.map(se => ({ qkId: se.qk, vId: 4 + se.v, forceZero: false }));
  const entropyOf = (hv) => {
    const p = u2Softmax(hv);
    let H = 0; for (let o = 0; o < 4; o++) H -= p[o] * Math.log(p[o] + 1e-12);
    return H / Math.log(4);
  };
  const f1b = inSeqForward(M, e.x, new Float64Array(8), masks);
  const Eqb = new Float64Array(12); for (let d = 0; d < 12; d++) Eqb[d] = M.E.v[e.qk * 12 + d];
  const frb = m2ReadForward(M, MP, Eqb, sup);
  let zb = RP.bc.v[0]; for (let i = 0; i < 48; i++) zb += RP.Wc.v[i] * f1b.h[i];
  const betab = 1 / (1 + Math.exp(-zb));
  const dis0 = curVoteDisagree(f1b.logitsK);
  const H0 = entropyOf(f1b.hvLog);
  const gb = 1 / (1 + Math.exp(-(RP.we.v[0] * H0 + RP.wb.v[0] * betab + RP.wd.v[0] * dis0 + RP.b.v[0])));
  const ensb = new Float64Array(4); for (let o = 0; o < 4; o++) ensb[o] = f1b.hvLog[o] + gb * frb.readLogits[o];
  let vhat0 = 0; for (let o = 1; o < 4; o++) if (ensb[o] > ensb[vhat0]) vhat0 = o;
  const wrong10 = vhat0 === e.v ? 0 : 1;
  const lossFn = () => {
    const f1 = inSeqForward(M, e.x, new Float64Array(8), masks);
    const Eq = new Float64Array(12); for (let d = 0; d < 12; d++) Eq[d] = M.E.v[e.qk * 12 + d];
    const fr = m2ReadForward(M, MP, Eq, sup);
    let z = RP.bc.v[0]; for (let i = 0; i < 48; i++) z += RP.Wc.v[i] * f1.h[i];
    const beta = 1 / (1 + Math.exp(-z));
    const g = 1 / (1 + Math.exp(-(RP.we.v[0] * H0 + RP.wb.v[0] * beta + RP.wd.v[0] * dis0 + RP.b.v[0])));
    const ens = new Float64Array(4); for (let o = 0; o < 4; o++) ens[o] = f1.hvLog[o] + g * fr.readLogits[o];
    const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat0, 8];
    const f2 = inSeqForward(M, x2m, f1.cNew, masks);
    const ce2 = inCELossGrad(inMeanLogits({ logitsK: f2.logitsK }), e.y);
    const ceH = inCELossGrad(ens, e.v);
    return ce2.loss + 0.5 * ceH.loss + 0.5 * (-(wrong10 * Math.log(beta + 1e-12) + (1 - wrong10) * Math.log(1 - beta + 1e-12)));
  };
  const trunkList = inSeqParams(M).concat([MP.Wq, MP.Watt, MP.batt]);
  const rpList = [RP.Wc, RP.bc, RP.we, RP.wb, RP.wd, RP.b];
  for (const p of [...trunkList, ...rpList]) p.g.fill(0);
  const f1 = inSeqForward(M, e.x, new Float64Array(8), masks);
  const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = M.E.v[e.qk * 12 + d];
  const fr = m2ReadForward(M, MP, Eqk, sup); fr.qkId = e.qk;
  let z = RP.bc.v[0]; for (let i = 0; i < 48; i++) z += RP.Wc.v[i] * f1.h[i];
  const beta = 1 / (1 + Math.exp(-z));
  const g = 1 / (1 + Math.exp(-(RP.we.v[0] * H0 + RP.wb.v[0] * beta + RP.wd.v[0] * dis0 + RP.b.v[0])));
  const ensV = new Float64Array(4); for (let o = 0; o < 4; o++) ensV[o] = f1.hvLog[o] + g * fr.readLogits[o];
  const ceHv = inCELossGrad(ensV, e.v);
  const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat0, 8];
  const f2 = inSeqForward(M, x2m, f1.cNew, masks);
  const ce2 = inCELossGrad(inMeanLogits({ logitsK: f2.logitsK }), e.y);
  const dMean2 = new Float64Array(4); for (let o = 0; o < 4; o++) dMean2[o] = ce2.d[o];
  const dc2 = u1SeqBackwardFull(M, f2, dMean2, null, null, null, masks);
  const dEns = new Float64Array(4); for (let o = 0; o < 4; o++) dEns[o] = ceHv.d[o] * 0.5;
  const dRead = new Float64Array(4); for (let o = 0; o < 4; o++) dRead[o] = dEns[o] * g;
  let dg = 0; for (let o = 0; o < 4; o++) dg += dEns[o] * fr.readLogits[o];
  const dsig = dg * g * (1 - g);
  const dBetaGate = dsig * RP.wb.v[0];
  RP.we.g[0] += dsig * H0; RP.wb.g[0] += dsig * beta; RP.wd.g[0] += dsig * dis0; RP.b.g[0] += dsig;
  const dz = dBetaGate * beta * (1 - beta) + 0.5 * (beta - wrong10);
  RP.bc.g[0] += dz;
  for (let i = 0; i < 48; i++) RP.Wc.g[i] += dz * f1.h[i];
  u1ReadBackward(M, MP, fr, dRead);
  const dhC = new Float64Array(48); for (let i = 0; i < 48; i++) dhC[i] = dz * RP.Wc.v[i];
  u1SeqBackwardFull(M, f1, null, null, dEns, dc2, masks);
  u1CriticHBackward(M, f1, dhC);
  const eps = 1e-6;
  let worst = 0, worstWhere = "";
  const checkParam = (P, name) => {
    for (let i = 0; i < Math.min(P.v.length, 8); i++) {
      P.v[i] += eps; const a1 = lossFn();
      P.v[i] -= 2 * eps; const a0 = lossFn();
      P.v[i] += eps;
      const num = (a1 - a0) / (2 * eps), an = P.g[i];
      const denom = Math.max(1e-12, Math.abs(num) + Math.abs(an));
      if (Math.abs(num) < 1e-9 && Math.abs(an) < 1e-9) continue;
      const rel = Math.abs(num - an) / denom;
      if (rel > worst) { worst = rel; worstWhere = name + "[" + i + "] num=" + num + " an=" + an; }
    }
  };
  checkParam(RP.we, "we"); checkParam(RP.wb, "wb"); checkParam(RP.b, "b");
  checkParam(RP.Wc, "Wc"); checkParam(MP.Wq, "Wq"); checkParam(M.W1, "W1");
  log("u6-gradcheck worstRel=" + worst.toExponential(2) + " at " + worstWhere);
  return { worstRel: worst, worstWhere };
};
globalThis.runU6Train = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const steps = 800, B = 16, trunkLr = 5e-3, rpLr = 1e-3, K = 5, H = 48, C = 6, auxW = 0.5;
  const tag = arm + "-s" + seed + "-" + steps + "st";
  const ledgerPath = "src/evidence/decomp/d-newai-self-" + tag + ".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  await globalThis.SelfU6Init(fs);
  const G = await globalThis.IntrinsicInit(fs);
  globalThis.window = globalThis;
  const { M, MP, RP } = await loadU6Wounded(fs, G, seed);
  const trunkList = inSeqParams(M).concat([MP.Wq, MP.Watt, MP.batt]);
  const criticList = [RP.Wc, RP.bc];
  const gateList = [RP.we, RP.wb, RP.wd, RP.b];
  const optTrunk = new G.Adam(trunkLr);
  const optRP = new G.Adam(rpLr);
  const dataRng = G.makeRng(42000 + seed * 104729 + 55);
  let fixedMasks = null; { const fr = G.makeRng(91000 + seed); fixedMasks = []; for (let k = 0; k < K; k++) { const m = new Float64Array(H); for (let i = 0; i < H; i++) m[i] = fr.int(10) < 5 ? 2 : 0; fixedMasks.push(m); } }
  const entropyOf = (hv) => {
    const p = u2Softmax(hv);
    let Hh = 0; for (let o = 0; o < 4; o++) Hh -= p[o] * Math.log(p[o] + 1e-12);
    return Hh / Math.log(4);
  };
  const argmax4 = (a) => { let b = 0; for (let i = 0; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  const isFrozen = (arm === "u6-rep-frozen");
  const t0 = Date.now(), curve = [];
  const hashLog = [];
  for (let hi = 0; hi < 100; hi++) { const ee = inSeqGenShift(dataRng, null); hashLog.push(ee.x[0] + "." + ee.qk); }
  // NOTE: hashLog consumed 100 standard draws ahead of U1-U4 stream position. To keep twin-match,
  // re-seed dataRng identically to U1-U4 start AFTER hashing (hash is verification-only, not training).
  const dataRng2 = G.makeRng(42000 + seed * 104729 + 55);
  const drng = dataRng2;
  // Phase W: 50st critic-only warmup (BCE 1.0, trunk frozen)
  for (let step = 0; step < 50; step++) {
    for (const p of [...criticList]) p.g.fill(0);
    for (let b = 0; b < B; b++) {
      const isAdapt = drng.int(2) === 1;
      let e, sup;
      if (!isAdapt) {
        const cands = [];
        for (let c = 0; c < C; c++) { const ub = drng.int(2) === 0; cands.push(ub ? inSeqGenShift(drng, 0) : inSeqGenShift(drng, null)); }
        let pk = 0, best = -1;
        for (let c = 0; c < C; c++) {
          const fw = inSeqForward(M, cands[c].x, new Float64Array(8), fixedMasks);
          const d = curVoteDisagree(fw.logitsK);
          if (d > best) { best = d; pk = c; }
        }
        e = cands[pk];
        const supE = [inSeqGenShift(drng, null), inSeqGenShift(drng, null), inSeqGenShift(drng, null), inSeqGenShift(drng, null)];
        sup = supE.map(se => ({ qkId: se.qk, vId: 4 + se.v, forceZero: false }));
      } else {
        const ep = genAdaptEpisode(drng);
        e = ep.query; sup = ep.sup.map(se => ({ qkId: se.qk, vId: 4 + se.v, forceZero: false }));
        continue; // adapt sampled, RNG advanced, zero grads (twin-match preserved)
      }
      const fw1 = inSeqForward(M, e.x, new Float64Array(8), fixedMasks);
      const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = M.E.v[e.qk * 12 + d];
      const fr = m2ReadForward(M, MP, Eqk, sup);
      let z = RP.bc.v[0]; for (let i = 0; i < H; i++) z += RP.Wc.v[i] * fw1.h[i];
      const beta = 1 / (1 + Math.exp(-z));
      const g = isFrozen ? 0 : 1 / (1 + Math.exp(-(RP.we.v[0] * 0.5 + RP.wb.v[0] * beta + RP.wd.v[0] * 0.5 + RP.b.v[0])));
      const ensV = new Float64Array(4); for (let o = 0; o < 4; o++) ensV[o] = fw1.hvLog[o] + g * fr.readLogits[o];
      const vhat = argmax4(ensV);
      const wrong1 = vhat === e.v ? 0 : 1;
      const dz = (beta - wrong1) / B;
      RP.bc.g[0] += dz;
      for (let i = 0; i < H; i++) RP.Wc.g[i] += dz * fw1.h[i];
      const dhC = new Float64Array(H); for (let i = 0; i < H; i++) dhC[i] = dz * RP.Wc.v[i];
      u1CriticHBackward(M, fw1, dhC);
      // trunk grads from dhC discarded: freeze trunk during warmup
      for (const p of trunkList) p.g.fill(0);
    }
    let s = 0; for (const p of [...criticList]) for (let i = 0; i < p.g.length; i++) s += p.g[i] * p.g[i];
    const n = Math.sqrt(s); if (n > 1.0) { const sc = 1.0 / n; for (const p of [...criticList]) for (let i = 0; i < p.g.length; i++) p.g[i] *= sc; }
    optRP.step(criticList);
    for (const p of trunkList) p.g.fill(0);
  }
  for (let step = 0; step < steps; step++) {
    for (const p of [...trunkList, ...criticList, ...gateList]) p.g.fill(0);
    let lsum = 0;
    for (let b = 0; b < B; b++) {
      const isAdapt = drng.int(2) === 1;
      let e, sup;
      if (!isAdapt) {
        const cands = [];
        for (let c = 0; c < C; c++) { const ub = drng.int(2) === 0; cands.push(ub ? inSeqGenShift(drng, 0) : inSeqGenShift(drng, null)); }
        let pk = 0, best = -1;
        for (let c = 0; c < C; c++) {
          const fw = inSeqForward(M, cands[c].x, new Float64Array(8), fixedMasks);
          const d = curVoteDisagree(fw.logitsK);
          if (d > best) { best = d; pk = c; }
        }
        e = cands[pk];
        const supE = [inSeqGenShift(drng, null), inSeqGenShift(drng, null), inSeqGenShift(drng, null), inSeqGenShift(drng, null)];
        sup = supE.map(se => ({ qkId: se.qk, vId: 4 + se.v, forceZero: false }));
      } else {
        const ep = genAdaptEpisode(drng);
        e = ep.query; sup = ep.sup.map(se => ({ qkId: se.qk, vId: 4 + se.v, forceZero: false }));
        continue; // twin-match: RNG advanced, zero grads
      }
      const fw1 = inSeqForward(M, e.x, new Float64Array(8), fixedMasks);
      const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = M.E.v[e.qk * 12 + d];
      const fr = m2ReadForward(M, MP, Eqk, sup); fr.qkId = e.qk;
      let z = RP.bc.v[0]; for (let i = 0; i < H; i++) z += RP.Wc.v[i] * fw1.h[i];
      const beta = 1 / (1 + Math.exp(-z));
      const dis = curVoteDisagree(fw1.logitsK);
      const Hh = entropyOf(fw1.hvLog);
      const g = isFrozen ? 0 : 1 / (1 + Math.exp(-(RP.we.v[0] * Hh + RP.wb.v[0] * beta + RP.wd.v[0] * dis + RP.b.v[0])));
      const ensV = new Float64Array(4); for (let o = 0; o < 4; o++) ensV[o] = fw1.hvLog[o] + g * fr.readLogits[o];
      const ceHv = inCELossGrad(ensV, e.v);
      const vhat = argmax4(ensV);
      const wrong1 = vhat === e.v ? 0 : 1;
      const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
      const fw2 = inSeqForward(M, x2m, fw1.cNew, fixedMasks);
      const liveMean = inMeanLogits({ logitsK: fw2.logitsK });
      const ce2 = inCELossGrad(liveMean, e.y);
      lsum += ce2.loss + auxW * ceHv.loss + 0.5 * (-(wrong1 * Math.log(beta + 1e-12) + (1 - wrong1) * Math.log(1 - beta + 1e-12)));
      const dMean2 = new Float64Array(4);
      for (let o = 0; o < 4; o++) dMean2[o] = ce2.d[o] / B;
      const dc2 = u1SeqBackwardFull(M, fw2, dMean2, null, null, null, fixedMasks);
      const dEns = new Float64Array(4); for (let o = 0; o < 4; o++) dEns[o] = ceHv.d[o] * auxW / B;
      const dRead = new Float64Array(4); for (let o = 0; o < 4; o++) dRead[o] = dEns[o] * g;
      if (!isFrozen) {
        let dg = 0; for (let o = 0; o < 4; o++) dg += dEns[o] * fr.readLogits[o];
        const dsig = dg * g * (1 - g);
        const dBetaGate = dsig * RP.wb.v[0];
        RP.we.g[0] += dsig * Hh; RP.wb.g[0] += dsig * beta; RP.wd.g[0] += dsig * dis; RP.b.g[0] += dsig;
        const dz = dBetaGate * beta * (1 - beta) + 0.5 * (beta - wrong1) / B;
        RP.bc.g[0] += dz;
        for (let i = 0; i < H; i++) RP.Wc.g[i] += dz * fw1.h[i];
        u1ReadBackward(M, MP, fr, dRead);
        const dhC = new Float64Array(H); for (let i = 0; i < H; i++) dhC[i] = dz * RP.Wc.v[i];
        const dHvTotal = new Float64Array(4); for (let o = 0; o < 4; o++) dHvTotal[o] = dEns[o];
        u1SeqBackwardFull(M, fw1, null, null, dHvTotal, dc2, fixedMasks);
        u1CriticHBackward(M, fw1, dhC);
      } else {
        const dz = 0.5 * (beta - wrong1) / B;
        RP.bc.g[0] += dz;
        for (let i = 0; i < H; i++) RP.Wc.g[i] += dz * fw1.h[i];
        const dHvTotal = new Float64Array(4); for (let o = 0; o < 4; o++) dHvTotal[o] = dEns[o];
        u1SeqBackwardFull(M, fw1, null, null, dHvTotal, dc2, fixedMasks);
        const dhC = new Float64Array(H); for (let i = 0; i < H; i++) dhC[i] = dz * RP.Wc.v[i];
        u1CriticHBackward(M, fw1, dhC);
      }
    }
    let s = 0; for (const p of [...trunkList, ...criticList, ...gateList]) for (let i = 0; i < p.g.length; i++) s += p.g[i] * p.g[i];
    const n = Math.sqrt(s); if (n > 1.0) { const sc = 1.0 / n; for (const p of [...trunkList, ...criticList, ...gateList]) for (let i = 0; i < p.g.length; i++) p.g[i] *= sc; }
    optTrunk.step(trunkList);
    if (isFrozen) optRP.step(criticList); else optRP.step([...criticList, ...gateList]);
    if (step % 100 === 0 || step === steps - 1) curve.push({ step, loss: +(lsum / B).toFixed(6) });
  }
  const save = (o) => Array.from(o.v);
  const body = { spec: "self-u6-repair-prereg", track: "U6", arm, seed, steps, B, trunkLr, rpLr, initTrunk: "U1-unf-gate-s" + seed + "-wounded", unfrozen: true, repair: true, warmup50: true, verdict: "COMPLETE", wallMs: Date.now() - t0, curve, streamHash0: hashLog.slice(0, 5),
    P: { E: save(M.E), W1: save(M.W1), b1: save(M.b1), Wf: save(M.Wf), bf: save(M.bf), Wc: save(M.Wc), bc: save(M.bc), Wh: M.Wh.map(save), bh: M.bh.map(save), Hv: save(M.Hv), bv: save(M.bv),
      Wq: save(MP.Wq), Watt: save(MP.Watt), batt: save(MP.batt),
      cWc: save(RP.Wc), cbc: save(RP.bc), we: save(RP.we), wb: save(RP.wb), wd: save(RP.wd), b: save(RP.b) } };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("u6-train " + tag + " loss0=" + curve[0].loss + " lossN=" + curve[curve.length - 1].loss);
  return body;
};
globalThis.runU6Eval = async function (fs, log, opts) {
  const { arm, seed, forceG } = opts;
  const steps = 800, N = 200;
  const tag = arm + "-s" + seed + "-" + steps + "st";
  const suffix = (forceG === 0) ? "-g0" : "";
  const ledgerPath = "src/evidence/decomp/d-newai-self-eval-" + tag + suffix + ".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  await globalThis.SelfU6Init(fs);
  const G = await globalThis.IntrinsicInit(fs);
  globalThis.window = globalThis;
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-" + tag + ".json"));
  const M = inSeqMakeModel(G.makeRng(2));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(M.E, tr.P.E); load(M.W1, tr.P.W1); load(M.b1, tr.P.b1);
  load(M.Wf, tr.P.Wf); load(M.bf, tr.P.bf); load(M.Wc, tr.P.Wc); load(M.bc, tr.P.bc);
  for (let k = 0; k < 5; k++) { load(M.Wh[k], tr.P.Wh[k]); load(M.bh[k], tr.P.bh[k]); }
  load(M.Hv, tr.P.Hv); load(M.bv, tr.P.bv);
  const MP = m2MakeParams(G.makeRng(3));
  load(MP.Wq, tr.P.Wq); load(MP.Watt, tr.P.Watt); load(MP.batt, tr.P.batt);
  const RP = u1MakeParams(G.makeRng(4));
  load(RP.Wc, tr.P.cWc); load(RP.bc, tr.P.cbc); load(RP.we, tr.P.we); load(RP.wb, tr.P.wb); load(RP.wd, tr.P.wd); load(RP.b, tr.P.b);
  let evalMasks = null; { const fr2 = G.makeRng(91000 + seed); evalMasks = []; for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr2.int(10) < 5 ? 2 : 0; evalMasks.push(m); } }
  const entropyOf = (hv) => {
    const p = u2Softmax(hv);
    let Hh = 0; for (let o = 0; o < 4; o++) Hh -= p[o] * Math.log(p[o] + 1e-12);
    return Hh / Math.log(4);
  };
  const argmax4 = (a) => { let b = 0; for (let i = 0; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  const wasFrozen = (arm === "u6-rep-frozen");
  const srng = G.makeRng(52500 + seed);
  let scr = 0, two = 0, critHit = 0;
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
    let g = (wasFrozen || forceG === 0) ? 0 : 1 / (1 + Math.exp(-(RP.we.v[0] * Hh + RP.wb.v[0] * beta + RP.wd.v[0] * dis + RP.b.v[0])));
    if (forceG === 0) g = 0;
    const ensV = new Float64Array(4); for (let o = 0; o < 4; o++) ensV[o] = fw1.hvLog[o] + g * fr.readLogits[o];
    if (argmax4(ensV) === e.v) scr++;
    const vhat = argmax4(ensV);
    const wrong1 = vhat === e.v ? 0 : 1;
    if ((beta >= 0.5 ? 1 : 0) === wrong1) critHit++;
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
    let g = (wasFrozen || forceG === 0) ? 0 : 1 / (1 + Math.exp(-(RP.we.v[0] * Hh + RP.wb.v[0] * beta + RP.wd.v[0] * dis + RP.b.v[0])));
    if (forceG === 0) g = 0;
    const ensV = new Float64Array(4); for (let o = 0; o < 4; o++) ensV[o] = fw1.hvLog[o] + g * fr.readLogits[o];
    if (argmax4(ensV) === e.v) adaptV++;
    const vhat = argmax4(ensV);
    if (vhat === e.y) adaptY++;
    if (i < 50) { gAdapt += g; }
    if (vhat === e.v) { gRight += g; nR++; } else { gWrong += g; nW++; }
  }
  // standard gate mean: reuse last-loop approximation via fresh short loop
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
    let g = (wasFrozen || forceG === 0) ? 0 : 1 / (1 + Math.exp(-(RP.we.v[0] * Hh + RP.wb.v[0] * beta + RP.wd.v[0] * dis + RP.b.v[0])));
    if (forceG === 0) g = 0;
    gs += g;
  }
  const body = { spec: "self-u6-repair-prereg", track: "U6-eval", arm, seed, steps, N, forceG: (forceG === 0 ? 0 : null), verdict: "COMPLETE",
    scr: scr / N, two: two / N, adaptY: adaptY / N, adaptV: adaptV / N,
    gAdapt: gAdapt / 50, gStd: gs / 50, gWrong: nW ? gWrong / nW : 0, gRight: nR ? gRight / nR : 0,
    we: RP.we.v[0], wb: RP.wb.v[0], wd: RP.wd.v[0], b: RP.b.v[0], critAcc: critHit / N };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("u6-eval " + tag + suffix + " two=" + body.two.toFixed(3) + " adaptY=" + body.adaptY.toFixed(3) + " crit=" + body.critAcc.toFixed(3));
  return body;
};
