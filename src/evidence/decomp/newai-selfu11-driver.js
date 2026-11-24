// newai-selfu10-driver.js — U10 split-router: g_ret (RP/U7 feats) for retrieval, gated vhat, then g_cmp (RP8 comparative, beta detached) for blend.
globalThis.SelfU11Init = async function (fs) {
  for (const p of ["src/tinynn/nn.js", "src/tinynn/seeded.js", "src/evidence/decomp/intrinsic-driver.js", "src/evidence/decomp/newai-driver.js", "src/evidence/decomp/newai-v102-driver.js", "src/evidence/decomp/newai-fr-driver.js", "src/evidence/decomp/newai-div-driver.js", "src/evidence/decomp/newai-cur-driver.js", "src/evidence/decomp/newai-winner-driver.js", "src/evidence/decomp/newai-selfmr-driver.js", "src/evidence/decomp/newai-selfm2r2-driver.js", "src/evidence/decomp/newai-selfm3r3-driver.js", "src/evidence/decomp/newai-selfu1-driver.js", "src/evidence/decomp/newai-selfu2-driver.js", "src/evidence/decomp/newai-selfu4-driver.js", "src/evidence/decomp/newai-selfu5-driver.js", "src/evidence/decomp/newai-selfu7-driver.js", "src/evidence/decomp/newai-selfu8-driver.js", "src/evidence/decomp/newai-selfu9-driver.js", "src/evidence/decomp/newai-selfu10-driver.js"]) {
    const src = await fs.readTextFile(p); (0, eval)(src + "\n//# sourceURL=" + p);
  }
  if (!globalThis.genAdaptEpisode) throw new Error("u11 stack load failed");
};
function u11ArmCode(arm) { if (arm === "u11-cmp") return 127; if (arm === "u11-ablate") return 128; return 127; }
globalThis.u11GradCheck = async function (fs, log) {
  await globalThis.SelfU11Init(fs);
  const G = await globalThis.IntrinsicInit(fs);
  globalThis.window = globalThis;
  const { M, MP, HD } = await loadU8Frozen(fs, G, 0).catch(() => ({ M: inSeqMakeModel(G.makeRng(4342)), MP: m2MakeParams(G.makeRng(4344)), HD: u5MakeHead(G.makeRng(4345)) }));
  const RPr = u1MakeParams(G.makeRng(4343));
  const RPc = u8MakeRP8(G.makeRng(4348));
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
    const wrong1 = vhat === e.v ? 0 : 1;
    const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
    const f2 = inSeqForward(M, x2m, f1.cNew, masks);
    const baseMean = inMeanLogits({ logitsK: f2.logitsK });
    const ad = u5HeadForward(HD, f2.h).out;
    let ht = 0, bt = 0; for (let o = 1; o < 4; o++) { if (ad[o] > ad[ht]) ht = o; if (baseMean[o] > baseMean[bt]) bt = o; }
    const m = ad[ht] - baseMean[bt];
    const a = ht === bt ? 1 : 0;
    const gc = 1 / (1 + Math.exp(-u8Features(RPc, entropyOf(f1.hvLog), betar, curVoteDisagree(f1.logitsK), m, a, false)));
    const blend = new Float64Array(4); for (let o = 0; o < 4; o++) blend[o] = (1 - gc) * baseMean[o] + gc * ad[o];
    const ce2 = inCELossGrad(blend, e.y);
    const ceH = inCELossGrad(ens, e.v);
    return 2.0 * ce2.loss + 0.5 * ceH.loss + 0.5 * (-(wrong1 * Math.log(betar + 1e-12) + (1 - wrong1) * Math.log(1 - betar + 1e-12)));
  };
  const rpList = [RPr.Wc, RPr.bc, RPr.we, RPr.wb, RPr.wd, RPr.b, RPc.we, RPc.wb, RPc.wd, RPc.wm, RPc.wa, RPc.b, RPc.Wc, RPc.bc];
  for (const p of rpList) p.g.fill(0);
  // analytic (beta detached into cmp: dz paths separated)
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
  const m = ad[ht] - baseMean[bt];
  const a = ht === bt ? 1 : 0;
  const logitc = u8Features(RPc, Hh, betar, dis, m, a, false);
  const gc = 1 / (1 + Math.exp(-logitc));
  const blendArr = new Float64Array(4); for (let o = 0; o < 4; o++) blendArr[o] = (1 - gc) * baseMean[o] + gc * ad[o];
  const dBlend = inCELossGrad(blendArr, e.y).d;
  // ret path grads (retrieval losses only)
  const dEns = new Float64Array(4); for (let o = 0; o < 4; o++) dEns[o] = ceHv.d[o] * 0.5;
  const dRead = new Float64Array(4); for (let o = 0; o < 4; o++) dRead[o] = dEns[o] * gr;
  let dgr = 0; for (let o = 0; o < 4; o++) dgr += dEns[o] * fr.readLogits[o];
  const dsigr = dgr * gr * (1 - gr);
  const dBetaRet = dsigr * RPr.wb.v[0];
  RPr.we.g[0] += dsigr * Hh; RPr.wb.g[0] += dsigr * betar; RPr.wd.g[0] += dsigr * dis; RPr.b.g[0] += dsigr;
  const dzr = dBetaRet * betar * (1 - betar) + 0.5 * (betar - wrong1);
  RPr.bc.g[0] += dzr;
  for (let i = 0; i < 48; i++) RPr.Wc.g[i] += dzr * f1.h[i];
  u1ReadBackward(M, MP, fr, dRead);
  // cmp path grads (blend loss only; beta detached — NO dz into RPr from here)
  const wYg = 2.0;
  let dgc = 0; for (let o = 0; o < 4; o++) dgc += wYg * dBlend[o] * (ad[o] - baseMean[o]);
  const dsigc = dgc * gc * (1 - gc);
  RPc.we.g[0] += dsigc * Hh; RPc.wb.g[0] += dsigc * betar; RPc.wd.g[0] += dsigc * dis; RPc.wm.g[0] += dsigc * m; RPc.wa.g[0] += dsigc * a; RPc.b.g[0] += dsigc;
  const eps = 1e-6;
  let worst = 0, worstWhere = "";
  const checkParam = (P, name) => {
    for (let i = 0; i < Math.min(P.v.length, 8); i++) {
      P.v[i] += eps; const a1 = lossFn();
      // NOTE: numeric lossFn couples beta (no detach) — analytic detaches, so wb/Wc numeric-vs-analytic differ by design on the beta path.
      // Check only cmp-exclusive params + ret-exclusive params where paths agree.
      P.v[i] -= 2 * eps; const a0 = lossFn();
      P.v[i] += eps;
      const num = (a1 - a0) / (2 * eps), an = P.g[i];
      const rel = Math.abs(num - an) / Math.max(1e-12, Math.abs(num) + Math.abs(an));
      if (Math.abs(num) < 1e-9 && Math.abs(an) < 1e-9) continue;
      if (rel > worst) { worst = rel; worstWhere = name + "[" + i + "] num=" + num + " an=" + an; }
    }
  };
  checkParam(RPc.wm, "wm"); checkParam(RPc.wa, "wa"); checkParam(RPc.we, "c-we"); checkParam(RPr.we, "r-we"); checkParam(RPr.wd, "r-wd");
  log("u10-gradcheck worstRel=" + worst.toExponential(2) + " at " + worstWhere + " (beta-path params excluded: detach by design)");
  return { worstRel: worst, worstWhere };
};
globalThis.runU11Train = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const isAblate = (arm === "u11-ablate");
  const steps = 800, B = 16, rpLr = 1e-3, K = 5, H = 48, C = 6, auxW = 0.5;
  const tag = arm + "-s" + seed + "-" + steps + "st";
  const ledgerPath = "src/evidence/decomp/d-newai-self-" + tag + ".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  await globalThis.SelfU11Init(fs);
  const G = await globalThis.IntrinsicInit(fs);
  globalThis.window = globalThis;
  const { M, MP, HD } = await loadU8Frozen(fs, G, seed);
  const RPr = u1MakeParams(G.makeRng(75000 + seed * 7919 + u11ArmCode(arm) * 131 + 1));
  const RPc = isAblate ? u1MakeParams(G.makeRng(75000 + seed * 7919 + u11ArmCode(arm) * 131 + 2)) : u8MakeRP8(G.makeRng(75000 + seed * 7919 + u11ArmCode(arm) * 131 + 2));
  const rpList = isAblate ? [RPr.Wc, RPr.bc, RPr.we, RPr.wb, RPr.wd, RPr.b, RPc.Wc, RPc.bc, RPc.we, RPc.wb, RPc.wd, RPc.b] : [RPr.Wc, RPr.bc, RPr.we, RPr.wb, RPr.wd, RPr.b, RPc.we, RPc.wb, RPc.wd, RPc.wm, RPc.wa, RPc.b];
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
      const logitc = u8Features(RPc, Hh, betar, dis, m, a, isAblate);
      const gc = 1 / (1 + Math.exp(-logitc));
      const blend = new Float64Array(4); for (let o = 0; o < 4; o++) blend[o] = (1 - gc) * baseMean[o] + gc * ad[o];
      const ce2 = inCELossGrad(blend, e.y);
      lsum += wY * ce2.loss + auxW * ceHv.loss + 0.5 * (-(wrong1 * Math.log(betar + 1e-12) + (1 - wrong1) * Math.log(1 - betar + 1e-12)));
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
      let dgc = 0; for (let o = 0; o < 4; o++) dgc += wY * ce2.d[o] * (ad[o] - baseMean[o]) / B;
      const dsigc = dgc * gc * (1 - gc);
      RPc.we.g[0] += dsigc * Hh; RPc.wb.g[0] += dsigc * betar; RPc.wd.g[0] += dsigc * dis; RPc.b.g[0] += dsigc;
      if (!isAblate) { RPc.wm.g[0] += dsigc * m; RPc.wa.g[0] += dsigc * a; }
      else { const dzc = 0; void dzc; }
    }
    let s = 0; for (const p of rpList) for (let i = 0; i < p.g.length; i++) s += p.g[i] * p.g[i];
    const n = Math.sqrt(s); if (n > 1.0) { const sc = 1.0 / n; for (const p of rpList) for (let i = 0; i < p.g.length; i++) p.g[i] *= sc; }
    optRP.step(rpList);
    if (step % 100 === 0 || step === steps - 1) curve.push({ step, loss: +(lsum / B).toFixed(6) });
  }
  const save = (o) => Array.from(o.v);
  const P = { rWc: save(RPr.Wc), rbc: save(RPr.bc), rwe: save(RPr.we), rwb: save(RPr.wb), rwd: save(RPr.wd), rb: save(RPr.b),
    cWc: RPc.Wc ? save(RPc.Wc) : null, cbc: save(RPc.bc), cwe: save(RPc.we), cwb: save(RPc.wb), cwd: save(RPc.wd), cb: save(RPc.b) };
  if (!isAblate) { P.cwm = save(RPc.wm); P.cwa = save(RPc.wa); }
  const body = { spec: "self-u11-splitweighted-prereg", track: "U11", arm, seed, steps, B, rpLr, frozen: "W6+M2+U5head-s" + seed, verdict: "COMPLETE", wallMs: Date.now() - t0, curve, P };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("u11-train " + tag + " loss0=" + curve[0].loss + " lossN=" + curve[curve.length - 1].loss);
  return body;
};
globalThis.runU11Eval = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const isAblate = (arm === "u11-ablate");
  const steps = 800, N = 200;
  const tag = arm + "-s" + seed + "-" + steps + "st";
  const ledgerPath = "src/evidence/decomp/d-newai-self-eval-" + tag + ".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  await globalThis.SelfU11Init(fs);
  const G = await globalThis.IntrinsicInit(fs);
  globalThis.window = globalThis;
  const { M, MP, HD } = await loadU8Frozen(fs, G, seed);
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-" + tag + ".json"));
  const RPr = u1MakeParams(G.makeRng(2));
  const RPc = isAblate ? u1MakeParams(G.makeRng(3)) : u8MakeRP8(G.makeRng(3));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(RPr.Wc, tr.P.rWc); load(RPr.bc, tr.P.rbc); load(RPr.we, tr.P.rwe); load(RPr.wb, tr.P.rwb); load(RPr.wd, tr.P.rwd); load(RPr.b, tr.P.rb);
  if (isAblate) { load(RPc.Wc, tr.P.cWc); load(RPc.bc, tr.P.cbc); }
  load(RPc.we, tr.P.cwe); load(RPc.wb, tr.P.cwb); load(RPc.wd, tr.P.cwd); load(RPc.b, tr.P.cb);
  if (!isAblate) { load(RPc.wm, tr.P.cwm); load(RPc.wa, tr.P.cwa); }
  let evalMasks = null; { const fr2 = G.makeRng(91000 + seed); evalMasks = []; for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr2.int(10) < 5 ? 2 : 0; evalMasks.push(m); } }
  const entropyOf = (hv) => { const p = u2Softmax(hv); let Hh = 0; for (let o = 0; o < 4; o++) Hh -= p[o] * Math.log(p[o] + 1e-12); return Hh / Math.log(4); };
  const argmax4 = (a) => { let b = 0; for (let i = 0; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  let betaSum = 0, betaN = 0;
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
    let zr = RPr.bc.v[0]; for (let j = 0; j < 48; j++) zr += RPr.Wc.v[j] * fw1.h[j];
    const betar = 1 / (1 + Math.exp(-zr));
    betaSum += betar; betaN++;
    const gr = 1 / (1 + Math.exp(-(RPr.we.v[0] * entropyOf(fw1.hvLog) + RPr.wb.v[0] * betar + RPr.wd.v[0] * curVoteDisagree(fw1.logitsK) + RPr.b.v[0])));
    const ensV = new Float64Array(4); for (let o = 0; o < 4; o++) ensV[o] = fw1.hvLog[o] + gr * fr.readLogits[o];
    if (argmax4(ensV) === e.v) scr++;
    const vhat = argmax4(ensV);
    const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
    const fw2 = inSeqForward(M, x2m, fw1.cNew, evalMasks);
    const baseMean = inMeanLogits({ logitsK: fw2.logitsK });
    const ad = u5HeadForward(HD, fw2.h).out;
    let ht = 0, bt = 0; for (let o = 1; o < 4; o++) { if (ad[o] > ad[ht]) ht = o; if (baseMean[o] > baseMean[bt]) bt = o; }
    if (ht === bt) agreeN++;
    const gc = 1 / (1 + Math.exp(-u8Features(RPc, entropyOf(fw1.hvLog), betar, curVoteDisagree(fw1.logitsK), ad[ht] - baseMean[bt], ht === bt ? 1 : 0, isAblate)));
    const blend = new Float64Array(4); for (let o = 0; o < 4; o++) blend[o] = (1 - gc) * baseMean[o] + gc * ad[o];
    if (argmax4(blend) === e.y) two++;
  }
  const arng = G.makeRng(61000 + seed);
  let adaptY = 0, adaptV = 0, gAdapt = 0, gWrong = 0, gRight = 0, nW = 0, nR = 0, corrM = 0, corrG = 0, corrMG = 0, corrN = 0, corrMM = 0, corrGG = 0, logitMax = 0, salSum = 0, gRetA = 0;
  for (let i = 0; i < N; i++) {
    const ep = genAdaptEpisode(arng);
    const sup = ep.sup.map(se => ({ qkId: se.qk, vId: 4 + se.v, forceZero: false }));
    const e = ep.query;
    const fw1 = inSeqForward(M, e.x, new Float64Array(8), evalMasks);
    const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = M.E.v[e.qk * 12 + d];
    const fr = m2ReadForward(M, MP, Eqk, sup);
    let zr = RPr.bc.v[0]; for (let j = 0; j < 48; j++) zr += RPr.Wc.v[j] * fw1.h[j];
    const betar = 1 / (1 + Math.exp(-zr));
    const Hh = entropyOf(fw1.hvLog);
    const dis = curVoteDisagree(fw1.logitsK);
    const gr = 1 / (1 + Math.exp(-(RPr.we.v[0] * Hh + RPr.wb.v[0] * betar + RPr.wd.v[0] * dis + RPr.b.v[0])));
    const ensV = new Float64Array(4); for (let o = 0; o < 4; o++) ensV[o] = fw1.hvLog[o] + gr * fr.readLogits[o];
    if (argmax4(ensV) === e.v) adaptV++;
    const vhat = argmax4(ensV);
    const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
    const fw2 = inSeqForward(M, x2m, fw1.cNew, evalMasks);
    const baseMean = inMeanLogits({ logitsK: fw2.logitsK });
    const ad = u5HeadForward(HD, fw2.h).out;
    let ht = 0, bt = 0; for (let o = 1; o < 4; o++) { if (ad[o] > ad[ht]) ht = o; if (baseMean[o] > baseMean[bt]) bt = o; }
    const m = ad[ht] - baseMean[bt];
    const a = ht === bt ? 1 : 0;
    const logitc = u8Features(RPc, Hh, betar, dis, m, a, isAblate);
    if (Math.abs(logitc) > Math.abs(logitMax)) logitMax = logitc;
    const gc = 1 / (1 + Math.exp(-logitc));
    const blend = new Float64Array(4); for (let o = 0; o < 4; o++) blend[o] = (1 - gc) * baseMean[o] + gc * ad[o];
    if (argmax4(blend) === e.y) adaptY++;
    let lb = 0, ll = 0; for (let o = 0; o < 4; o++) { lb += baseMean[o] * (o === e.y ? 1 : 0); ll += blend[o] * (o === e.y ? 1 : 0); }
    salSum += lb - ll;
    if (i < 50) { gAdapt += gc; gRetA += gr; }
    if (vhat === e.v) { gRight += gc; nR++; } else { gWrong += gc; nW++; }
    if (a === 0) { corrN++; corrM += m; corrG += gc; corrMG += m * gc; corrMM += m * m; corrGG += gc * gc; }
  }
  const srng2 = G.makeRng(52500 + seed);
  const supRng2 = G.makeRng(42000 + seed * 104729 + 999);
  let gs = 0, gRetS = 0;
  for (let i = 0; i < 50; i++) {
    const e = inSeqGenShift(srng2, null);
    const supE = [inSeqGenShift(supRng2, null), inSeqGenShift(supRng2, null), inSeqGenShift(supRng2, null), inSeqGenShift(supRng2, null)];
    const sup = supE.map(se => ({ qkId: se.qk, vId: 4 + se.v, forceZero: false }));
    const fw1 = inSeqForward(M, e.x, new Float64Array(8), evalMasks);
    const vhatR = (() => {
      const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = M.E.v[e.qk * 12 + d];
      const fr = m2ReadForward(M, MP, Eqk, sup);
      let zr = RPr.bc.v[0]; for (let j = 0; j < 48; j++) zr += RPr.Wc.v[j] * fw1.h[j];
      const betar = 1 / (1 + Math.exp(-zr));
      const gr = 1 / (1 + Math.exp(-(RPr.we.v[0] * entropyOf(fw1.hvLog) + RPr.wb.v[0] * betar + RPr.wd.v[0] * curVoteDisagree(fw1.logitsK) + RPr.b.v[0])));
      return { gr, betar };
    })();
    gRetS += vhatR.gr;
    const fw20 = inSeqForward(M, [9, 9, 9, 9, 9, 9, e.qk, e.k, argmax4((() => { const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = M.E.v[e.qk * 12 + d]; const fr = m2ReadForward(M, MP, Eqk, sup); let zr = RPr.bc.v[0]; for (let j = 0; j < 48; j++) zr += RPr.Wc.v[j] * fw1.h[j]; const betar = 1 / (1 + Math.exp(-zr)); return fw1.hvLog.map((h, o) => h + (1 / (1 + Math.exp(-(RPr.we.v[0] * entropyOf(fw1.hvLog) + RPr.wb.v[0] * betar + RPr.wd.v[0] * curVoteDisagree(fw1.logitsK) + RPr.b.v[0])))) * fr.readLogits[o]); })()), 8], fw1.cNew, evalMasks);
    const baseMean0 = inMeanLogits({ logitsK: fw20.logitsK });
    const ad0 = u5HeadForward(HD, fw20.h).out;
    let ht0 = 0, bt0 = 0; for (let o = 1; o < 4; o++) { if (ad0[o] > ad0[ht0]) ht0 = o; if (baseMean0[o] > baseMean0[bt0]) bt0 = o; }
    gs += 1 / (1 + Math.exp(-u8Features(RPc, entropyOf(fw1.hvLog), vhatR.betar, curVoteDisagree(fw1.logitsK), ad0[ht0] - baseMean0[bt0], ht0 === bt0 ? 1 : 0, isAblate)));
  }
  const denom = Math.sqrt(Math.max(1e-12, (corrN * corrMM - corrM * corrM) * (corrN * corrGG - corrG * corrG)));
  const corr = denom > 0 ? (corrN * corrMG - corrM * corrG) / denom : 0;
  const P = { rwe: RPr.we.v[0], rwb: RPr.wb.v[0], rwd: RPr.wd.v[0], rb: RPr.b.v[0], cwe: RPc.we.v[0], cwb: RPc.wb.v[0], cwd: RPc.wd.v[0], cb: RPc.b.v[0] };
  if (!isAblate) { P.cwm = RPc.wm.v[0]; P.cwa = RPc.wa.v[0]; }
  const body = { spec: "self-u11-splitweighted-prereg", track: "U11-eval", arm, seed, steps, N, verdict: "COMPLETE",
    scr: scr / N, two: two / N, adaptY: adaptY / N, adaptV: adaptV / N,
    gAdapt: gAdapt / 50, gStd: gs / 50, gRetAdapt: gRetA / 50, gRetStd: gRetS / 50,
    gWrong: nW ? gWrong / nW : 0, gRight: nR ? gRight / nR : 0,
    agreeRate: agreeN / N, corrMGDisagree: corr, logitMax, saliencyDelta: salSum / N, betaMean: betaSum / betaN, ...P };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("u11-eval " + tag + " two=" + body.two.toFixed(3) + " adaptY=" + body.adaptY.toFixed(3) + " gA=" + body.gAdapt.toFixed(3) + " gS=" + body.gStd.toFixed(3));
  return body;
};
