// newai-selfu31f-driver.js — U31f STAGE-A substrate screen (rand-only).
// Frozen: U28 S/C/INH/HF + trunk Mf (W6) + U31b R2MON gate (selection reporting only in Stage A).
// Trainable: trunk COPY Mc per (regime, seed), init bit-exact from W6. Task: regime-variant round-2 CE.
// Regimes: r1 lesioned-value (2nd-best vhat_f) / r2 interference-heavy (margin<0.5 filter) /
//           r3 ood-bindings (allowed-train, diag-eval) / r4 two-hop (y2=(y+vhat_true)%4).
// RNG TABLE (filed; Stage-B sel/neg/shuf bases 93400/93600/94700/95700 kept clear):
//   fixedMasks/evalMasks 91000+seed (shared harness constant) | dataRng 42200+seed*104729+77+regIdx*100003
//   mineRng 93500+seed+regIdx*1000 | slotRng 94500+seed+regIdx*1000 | arngH 66300+seed+regIdx*1000
//   evalSlots 72000+seed*1000+ri | srng 52500+seed+regIdx*1000 | supRng 42000+seed*104729+999+regIdx*100003
//   calibRng 96800+seed*100+regIdx*13 | calibSlots 97800+seed*100+regIdx*17
// D-CLARIFICATIONS vs v1.0 prereg (no bar change; filed for verdict):
//   D1 std rows: R1/R4 recipes apply to std rows too (R1 2nd-best vhat, R4 y2 relabel); R2/R3 std unchanged
//      (std = stability anchor; hard = regime under test; RET stays regime-consistent).
//   D2 counts: 12T + 24E (12 rand + 12 none-evals; "12E" in prereg was an arithmetic slip — frozen refs
//      need regime-consistent evals; none-evals are cheap frozen forwards, no training).
//   D3 caps: train-hard mining cap 40 (was 20), eval-row mining cap 60 (was 20), uniform all regimes;
//      fallback counted everywhere (dilution reported, never hidden).
//   D4 rng offsets per regime (table above): prevents cross-regime duplicate pools; within-(regime,seed)
//      pairing preserved for Stage B (deterministic bases -> identical row sets across future arms).
//   D5 R2 train filter is margin-only (threshold 4.0, D7). The prereg's ">=2 support pairs share query
//      key" clause is VACUOUS (episode structure guarantees exactly 2: 2x ka + 2x kb, query asks one).
//      Margin<4.0 carries the filter; support-count clause dropped, margin clause unchanged.
//   D7 R2 threshold scale correction (pre-train, no outcome touched): 0.5 was miscalibrated ~8x —
//      measured readLogits top-2 margins run 1.7-5.2, median ~3.6-3.9 on all seeds (s0 min 2.34,
//      medians 3.60/3.90/3.94). Fixed uniform threshold 4.0 (pass ~53-63% all seeds; uniform rule,
//      no per-seed tuning). Concept (crowded = low-confidence neighbourhood) unchanged from battery.
//   D6 R3 eval: primary diag-target N=1000 (SCREEN) + allowed-target N=200 context loop (load-bearing half of
//      the "context" promise; killDa-style diag-distractor control out of scope for Stage A).
globalThis.SelfU31fInit = async function (fs) {
  for (const p of ["src/evidence/decomp/newai-selfu31e-driver.js"]) {
    const src = await fs.readTextFile(p); (0, eval)(src + "\n//# sourceURL=" + p);
  }
  await globalThis.SelfU31eInit(fs);
  if (!globalThis.runU31eTrain) throw new Error("u31f stack load failed");
};
function u31fRegimeIdx(regime) { return regime === "r1" ? 0 : regime === "r2" ? 1 : regime === "r3" ? 2 : 3; }
function u31fSecondBest(a) {
  let b1 = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b1]) b1 = i;
  let b2 = b1 === 0 ? 1 : 0; for (let i = 0; i < 4; i++) { if (i === b1) continue; if (a[i] > a[b2]) b2 = i; }
  return b2;
}
function u31fTop2Margin(a) {
  let b1 = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b1]) b1 = i;
  let b2 = b1 === 0 ? 1 : 0; for (let i = 0; i < 4; i++) { if (i === b1) continue; if (a[i] > a[b2]) b2 = i; }
  return a[b1] - a[b2];
}
//Frozen round-1 context for one adapt episode (U31e buildHard-identical, regime applied by caller).
function u31fRowCtx(Mf, MP, HDold, S, SC, HF, INH, slotRng, ep, fixedMasks) {
  const argmax4 = a => { let b = 0; for (let i = 0; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  const sup = ep.sup.map(se => ({ qkId: se.qk, vId: 4 + se.v, forceZero: false }));
  const e = ep.query;
  const fw1 = inSeqForward(Mf, e.x, new Float64Array(8), fixedMasks);
  const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = Mf.E.v[e.qk * 12 + d];
  const fr = m2ReadForward(Mf, MP, Eqk, sup);
  const headOld = u16U5HeadOut(HDold, fw1.h);
  const h = Float64Array.from(fw1.h), read = Float64Array.from(fr.readLogits), hv = Float64Array.from(fw1.hvLog);
  const tail = u22cTailStub(S, SC, HF, INH, slotRng, h, read, hv, headOld, new Float64Array(8), Eqk);
  const ensBase = tail.ensBase;
  const vhatTrue = argmax4(ensBase);
  return { e, sup, Eqk, h, read, hv, ensBase, pfSummary: Float64Array.from(tail.pf.summary), vhatTrue, margin: u31fTop2Margin(Array.from(fr.readLogits)) };
}
function u31fRegimeRow(regime, ctx) {
  const e = ctx.e;
  if (regime === "r1") return { vhatF: u31fSecondBest(Array.from(ctx.ensBase)), label: e.y };
  if (regime === "r4") return { vhatF: ctx.vhatTrue, label: (e.y + ctx.vhatTrue) % 4 };
  return { vhatF: ctx.vhatTrue, label: e.y };
}
function u31fTrainFilter(regime, ep, ctx) {
  if (regime === "r2") return ctx.margin < 4.0;
  if (regime === "r3") return ep.query.qk !== ep.query.v;
  return true;
}
function u31fEvalFilter(regime, ep, keep, ctx) {
  if (!keep) return false;
  if (regime === "r2") return ctx.margin < 4.0;
  if (regime === "r3") return ep.query.qk === ep.query.v;
  return true;
}
globalThis.u31fGradCheck = async function (fs, log, opts) {
  await globalThis.SelfU31fInit(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const seed = (opts && opts.seed) || 0;
  const Mf = await loadU1W6(fs, G, seed);
  const Mc = await loadU1W6(fs, G, seed);
  const pf = inSeqParams(Mf), pc = inSeqParams(Mc);
  let maxDiff = 0;
  for (let k = 0; k < pf.length; k++) for (let i = 0; i < pf[k].v.length; i++) { const dd = Math.abs(pf[k].v[i] - pc[k][i]); if (dd > maxDiff) maxDiff = dd; }
  const hr = G.makeRng(24);
  const x = []; for (let t = 0; t < 10; t++) x.push(hr.int(10));
  const masks = []; for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = hr.int(10) < 5 ? 2 : 0; masks.push(m); }
  const paths = [
    { name: "base", x2m: [9, 9, 9, 9, 9, 9, 1, 2, 3, 8], y: 1 },
    { name: "r1-lesion", x2m: [9, 9, 9, 9, 9, 9, 1, 2, 0, 8], y: 1 },
    { name: "r4-relabel", x2m: [9, 9, 9, 9, 9, 9, 1, 2, 3, 8], y: (1 + 3) % 4 },
  ];
  let worst = 0, where = "";
  for (const path of paths) {
    const lossFn = () => { const fw = inSeqForward(Mc, path.x2m, new Float64Array(8), masks); return inCELossGrad(inMeanLogits({ logitsK: fw.logitsK }), path.y).loss; };
    for (const p of inSeqParams(Mc)) p.g.fill(0);
    const fw0 = inSeqForward(Mc, path.x2m, new Float64Array(8), masks);
    const ce0 = inCELossGrad(inMeanLogits({ logitsK: fw0.logitsK }), path.y);
    const dMean = new Float64Array(4); for (let o = 0; o < 4; o++) dMean[o] = ce0.d[o];
    inBackward(Mc, fw0, dMean, null, null, masks, false, null);
    const eps = 1e-5;
    const spots = [Mc.Wh[0], Mc.bh[0], Mc.W1, Mc.Hv];
    for (const P of spots) {
      for (let i = 0; i < Math.min(P.v.length, 8); i++) {
        P.v[i] += eps; const a1 = lossFn(); P.v[i] -= 2 * eps; const a0 = lossFn(); P.v[i] += eps;
        const num = (a1 - a0) / (2 * eps), an = P.g[i];
        const mag = Math.abs(num) + Math.abs(an);
        if (mag < 1e-6) continue;
        const rel = Math.abs(num - an) / Math.max(1e-12, mag);
        if (rel > worst) { worst = rel; where = path.name + " mag=" + mag.toExponential(2); }
      }
    }
  }
  const pass = worst <= 1e-4 && maxDiff === 0;
  const body = { spec: "self-u31f-substrate-hunt-prereg", test: "u31f-gradcheck", seed, worst, where, maxCopyDiff: maxDiff, pass, verdict: pass ? "PASS" : "FAIL" };
  await fs.writeTextFile("src/evidence/decomp/d-newai-self-u31f-gradcheck.json", JSON.stringify(body));
  log("u31f-gradcheck worstCE=" + worst.toExponential(2) + " at " + where + " copyFidelity=" + maxDiff + " PASS=" + pass);
  return body;
};
globalThis.u31fCalib = async function (fs, log, opts) {
  const regime = opts.regime, seed = opts.seed;
  const force = opts && opts.force;
  const ledgerPath = "src/evidence/decomp/d-newai-self-u31f-calib-" + regime + "-s" + seed + ".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE" && !force) { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  await globalThis.SelfU31fInit(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const ri = u31fRegimeIdx(regime);
  const Mf = await loadU1W6(fs, G, seed);
  const MP = await loadU1M2nb(fs, G, seed);
  const HDold = await loadU16U5head(fs, G, seed);
  const tr28 = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-u28-comp-s" + seed + "-800st.json"));
  const trb = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-u31b-r2mon-s" + seed + "-800st.json"));
  const S = u22cMakeS(G.makeRng(1)), SC = u22cMakeScorer(G.makeRng(1)), HF = u22bMakeHF(G.makeRng(1)), INH = u26MakeINH(G.makeRng(1));
  const Mo = r2bMakeMon(G.makeRng(1));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(S.W, tr28.P.SW); load(S.b, tr28.P.Sb); load(SC.w, tr28.P.CW); load(SC.b, tr28.P.Cb);
  load(HF.W1, tr28.P.HW1); load(HF.b1, tr28.P.Hb1); load(HF.W2, tr28.P.HW2); load(HF.b2, tr28.P.Hb2);
  load(INH.W1, tr28.P.IW1); load(INH.b1, tr28.P.Ib1); load(INH.W2, tr28.P.IW2); load(INH.b2, tr28.P.Ib2);
  load(Mo.W1, trb.P.MW1); load(Mo.b1, trb.P.Mb1); load(Mo.W2, trb.P.MW2); load(Mo.b2, trb.P.Mb2);
  let fixedMasks = null; { const fr = G.makeRng(91000 + seed); fixedMasks = []; for (let k = 0; k < 5; k++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr.int(10) < 5 ? 2 : 0; fixedMasks.push(m); } }
  const argmax4 = a => { let b = 0; for (let i = 0; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  const epRng = G.makeRng(96800 + seed * 100 + ri * 13), slotRng = G.makeRng(97800 + seed * 100 + ri * 17);
  const TRIES = 1000;
  let filterPass = 0, sel = 0, selOracle = 0, oracleHit = 0;
  const ps = [], pSel = [], pNon = [];
  for (let t = 0; t < TRIES; t++) {
    const ep = genAdaptEpisode(epRng);
    const ctx = u31fRowCtx(Mf, MP, HDold, S, SC, HF, INH, slotRng, ep, fixedMasks);
    if (!u31fTrainFilter(regime, ep, ctx)) continue;
    filterPass++;
    const row = u31fRegimeRow(regime, ctx);
    const voh = new Float64Array(4); voh[row.vhatF] = 1;
    const x2 = new Float64Array(32);
    // Gate input = U31b/U31e-identical recipe: pf.summary (NOT ensBase — shape-correct 8-dim slot
    // summary the gate was trained on; caught in self-review before any compute).
    x2.set(ctx.pfSummary, 0); x2.set(ctx.hv, 8); x2.set(ctx.read, 12); x2.set(voh, 16); x2.set(ctx.Eqk, 20);
    const p = r2bMonForward(Mo, x2).p;
    ps.push(p);
    const x2o = [9, 9, 9, 9, 9, 9, ctx.e.qk, ctx.e.k, ctx.e.v, 8];
    const oracle = argmax4(inMeanLogits({ logitsK: inSeqForward(Mf, x2o, new Float64Array(8), fixedMasks).logitsK })) === row.label;
    if (oracle) oracleHit++;
    if (p < 0.5) { sel++; if (oracle) selOracle++; pSel.push(p); } else pNon.push(p);
  }
  ps.sort((a, b) => a - b);
  const dec = ps.length ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => +ps[Math.min(ps.length - 1, Math.floor(ps.length * i / 10))].toFixed(4)) : [];
  const mean = a => a.length ? a.reduce((s, v) => s + v, 0) / a.length : 0;
  const body = {
    spec: "self-u31f-substrate-hunt-prereg", test: "u31f-calib", track: "U31f", regime, seed, tries: TRIES,
    filterPass, filterRate: +(filterPass / TRIES).toFixed(4),
    sel, selRate: filterPass ? +(sel / filterPass).toFixed(4) : 0,
    oracleAmongPass: filterPass ? +(oracleHit / filterPass).toFixed(4) : 0,
    oracleAmongSel: sel ? +(selOracle / sel).toFixed(4) : 0,
    pDeciles: dec, meanP_sel: +mean(pSel).toFixed(4), meanP_nonsel: +mean(pNon).toFixed(4),
    tripwire: 0.10, verdict: "COMPLETE"
  };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("u31f-calib " + regime + "-s" + seed + " filter=" + body.filterRate + " selRate=" + body.selRate + " oraclePass=" + body.oracleAmongPass + " oracleSel=" + body.oracleAmongSel);
  return body;
};
globalThis.runU31fTrain = async function (fs, log, opts) {
  const regime = opts.regime, seed = opts.seed;
  const force = opts && opts.force;
  const steps = 400, B = 16, lr = 5e-3, K = 5, H = 48, Cc = 6, NHARD = 8, TRYCAP = 40;
  const ri = u31fRegimeIdx(regime);
  const tag = regime + "-rand-s" + seed + "-" + steps + "st";
  const ledgerPath = "src/evidence/decomp/d-newai-self-u31f-" + tag + ".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE" && !force) { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  await globalThis.SelfU31fInit(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const Mf = await loadU1W6(fs, G, seed);
  const Mc = await loadU1W6(fs, G, seed);
  const MP = await loadU1M2nb(fs, G, seed);
  const HDold = await loadU16U5head(fs, G, seed);
  const tr28 = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-u28-comp-s" + seed + "-800st.json"));
  const trb = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-u31b-r2mon-s" + seed + "-800st.json"));
  const S = u22cMakeS(G.makeRng(1)), SC = u22cMakeScorer(G.makeRng(1)), HF = u22bMakeHF(G.makeRng(1)), INH = u26MakeINH(G.makeRng(1));
  const Mo = r2bMakeMon(G.makeRng(1));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(S.W, tr28.P.SW); load(S.b, tr28.P.Sb); load(SC.w, tr28.P.CW); load(SC.b, tr28.P.Cb);
  load(HF.W1, tr28.P.HW1); load(HF.b1, tr28.P.Hb1); load(HF.W2, tr28.P.HW2); load(HF.b2, tr28.P.Hb2);
  load(INH.W1, tr28.P.IW1); load(INH.b1, tr28.P.Ib1); load(INH.W2, tr28.P.IW2); load(INH.b2, tr28.P.Ib2);
  load(Mo.W1, trb.P.MW1); load(Mo.b1, trb.P.Mb1); load(Mo.W2, trb.P.MW2); load(Mo.b2, trb.P.Mb2);
  const snapF = [Mf.E, Mf.W1, Mf.b1, Mf.Wf, Mf.bf, Mf.Wc, Mf.bc, Mf.Hv, Mf.bv, S.W, S.b, SC.w, SC.b, HF.W1, HF.b1, HF.W2, HF.b2, INH.W1, INH.b1, INH.W2, INH.b2].map(p => Float64Array.from(p.v));
  const snapC0 = inSeqParams(Mc).map(p => Float64Array.from(p.v));
  const pf0 = inSeqParams(Mf);
  let maxCopyDiff = 0;
  for (let k = 0; k < pf0.length; k++) for (let i = 0; i < pf0[k].v.length; i++) { const dd = Math.abs(pf0[k].v[i] - snapC0[k][i]); if (dd > maxCopyDiff) maxCopyDiff = dd; }
  const argmax4 = a => { let b = 0; for (let i = 0; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  const hParams = [...inSeqParams(Mc)];
  const opt = new G.Adam(lr);
  const dataRng = G.makeRng(42200 + seed * 104729 + 77 + ri * 100003);
  const mineRng = G.makeRng(93500 + seed + ri * 1000);
  const slotRng = G.makeRng(94500 + seed + ri * 1000);
  let fixedMasks = null; { const fr = G.makeRng(91000 + seed); fixedMasks = []; for (let k = 0; k < K; k++) { const m = new Float64Array(H); for (let i = 0; i < H; i++) m[i] = fr.int(10) < 5 ? 2 : 0; fixedMasks.push(m); } }
  const buildStdRow = () => {
    const isAdapt = dataRng.int(2) === 1;
    let e, supList, ensStd;
    if (!isAdapt) {
      const cands = [];
      for (let c = 0; c < Cc; c++) { const ub = dataRng.int(2) === 0; cands.push(ub ? inSeqGenShift(dataRng, 0) : inSeqGenShift(dataRng, null)); }
      let pk = 0, best = -1;
      for (let c = 0; c < Cc; c++) { const fw = inSeqForward(Mf, cands[c].x, new Float64Array(8), fixedMasks); const d = curVoteDisagree(fw.logitsK); if (d > best) { best = d; pk = c; } }
      e = cands[pk];
      const supE = [inSeqGenShift(dataRng, null), inSeqGenShift(dataRng, null), inSeqGenShift(dataRng, null), inSeqGenShift(dataRng, null)];
      supList = supE.map(se => ({ qkId: se.qk, vId: 4 + se.v, forceZero: false }));
    } else {
      const ep = genAdaptEpisode(dataRng); e = ep.query;
      supList = ep.sup.map(se => ({ qkId: se.qk, vId: 4 + se.v, forceZero: false }));
    }
    const fw1 = inSeqForward(Mf, e.x, new Float64Array(8), fixedMasks);
    const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = Mf.E.v[e.qk * 12 + d];
    const fr = m2ReadForward(Mf, MP, Eqk, supList);
    ensStd = new Float64Array(4); for (let o = 0; o < 4; o++) ensStd[o] = fw1.hvLog[o] + fr.readLogits[o];
    let vhat = argmax4(ensStd), label = e.y;
    if (regime === "r1") vhat = u31fSecondBest(Array.from(ensStd));
    if (regime === "r4") label = (e.y + argmax4(ensStd)) % 4;
    return { e, vhat, label, hard: false };
  };
  const t0 = Date.now(), curve = [];
  let mineTries = 0, mineFallback = 0, hardKept = 0, filterMiss = 0;
  for (let step = 0; step < steps; step++) {
    for (const p of hParams) p.g.fill(0);
    const batch = [];
    for (let b = 0; b < B - NHARD; b++) batch.push(buildStdRow());
    for (let b = 0; b < NHARD; b++) {
      let kept = null;
      for (let t = 0; t < TRYCAP; t++) {
        mineTries++;
        const ep = genAdaptEpisode(mineRng);
        const ctx = u31fRowCtx(Mf, MP, HDold, S, SC, HF, INH, slotRng, ep, fixedMasks);
        if (!u31fTrainFilter(regime, ep, ctx)) { filterMiss++; if (t === TRYCAP - 1) { const row = u31fRegimeRow(regime, ctx); kept = { e: ctx.e, vhat: row.vhatF, label: row.label, hard: true }; mineFallback++; } continue; }
        const row = u31fRegimeRow(regime, ctx);
        kept = { e: ctx.e, vhat: row.vhatF, label: row.label, hard: true }; hardKept++; break;
      }
      batch.push(kept);
    }
    let lsum = 0, lsumH = 0, lsumS = 0;
    for (let b = 0; b < B; b++) {
      const row = batch[b];
      const x2m = [9, 9, 9, 9, 9, 9, row.e.qk, row.e.k, row.vhat, 8];
      const fw2 = inSeqForward(Mc, x2m, new Float64Array(8), fixedMasks);
      const ce = inCELossGrad(inMeanLogits({ logitsK: fw2.logitsK }), row.label);
      lsum += ce.loss;
      if (row.hard) lsumH += ce.loss; else lsumS += ce.loss;
      const dMean = new Float64Array(4);
      for (let o = 0; o < 4; o++) dMean[o] = ce.d[o] / B;
      inBackward(Mc, fw2, dMean, null, null, fixedMasks, false, null);
    }
    let s = 0; for (const p of hParams) for (let i = 0; i < p.g.length; i++) s += p.g[i] * p.g[i];
    const n = Math.sqrt(s); if (n > 1.0) { const sc = 1.0 / n; for (const p of hParams) for (let i = 0; i < p.g.length; i++) p.g[i] *= sc; }
    opt.step(hParams);
    if (step % 100 === 0 || step === steps - 1) curve.push({ step, loss: +(lsum / B).toFixed(6), hardLoss: +((lsumH / NHARD) || 0).toFixed(6), stdLoss: +((lsumS / (B - NHARD)) || 0).toFixed(6) });
  }
  const frozen = [Mf.E, Mf.W1, Mf.b1, Mf.Wf, Mf.bf, Mf.Wc, Mf.bc, Mf.Hv, Mf.bv, S.W, S.b, SC.w, SC.b, HF.W1, HF.b1, HF.W2, HF.b2, INH.W1, INH.b1, INH.W2, INH.b2];
  let maxDrift = 0;
  for (let pi = 0; pi < frozen.length; pi++) for (let i = 0; i < frozen[pi].v.length; i++) { const dd = Math.abs(frozen[pi].v[i] - snapF[pi][i]); if (dd > maxDrift) maxDrift = dd; }
  const save = o => Array.from(o.v);
  const body = {
    spec: "self-u31f-substrate-hunt-prereg", track: "U31f", regime, arm: "rand", seed, steps, B, lr, diet: "rand",
    routing: "Mc (trunk copy) only; Mf+retriever+gate frozen (never stepped, no grads)",
    frozenFrom: "d-newai-w-w6-s" + seed + ".json", tryCap: TRYCAP,
    maxFrozenDrift: maxDrift, maxCopyDiff, verdict: "COMPLETE", wallMs: Date.now() - t0, curve,
    mining: { tries: mineTries, kept: hardKept, fallback: mineFallback, filterMiss, hardRate: +(hardKept / Math.max(1, mineTries)).toFixed(4), meanTriesPerKeep: +(mineTries / Math.max(1, hardKept + mineFallback)).toFixed(2) },
    P: { E: save(Mc.E), W1: save(Mc.W1), b1: save(Mc.b1), Wf: save(Mc.Wf), bf: save(Mc.bf), Wc: save(Mc.Wc), bc: save(Mc.bc), Wh: Mc.Wh.map(save), bh: Mc.bh.map(save), Hv: save(Mc.Hv), bv: save(Mc.bv) }
  };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("u31f-train " + tag + " loss0=" + curve[0].loss + " lossN=" + curve[curve.length - 1].loss + " hardRate=" + body.mining.hardRate + " fallback=" + mineFallback + " drift=" + maxDrift);
  return body;
};
globalThis.runU31fNone = async function (fs, log, opts) {
  const regime = opts.regime, seed = opts.seed;
  const force = opts && opts.force;
  const tag = regime + "-none-s" + seed + "-0st";
  const ledgerPath = "src/evidence/decomp/d-newai-self-u31f-" + tag + ".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE" && !force) { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  await globalThis.SelfU31fInit(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const Mf = await loadU1W6(fs, G, seed);
  const Mc = await loadU1W6(fs, G, seed);
  const pf0 = inSeqParams(Mf), pc0 = inSeqParams(Mc);
  let maxCopyDiff = 0;
  for (let k = 0; k < pf0.length; k++) for (let i = 0; i < pf0[k].v.length; i++) { const dd = Math.abs(pf0[k].v[i] - pc0[k][i]); if (dd > maxCopyDiff) maxCopyDiff = dd; }
  const save = o => Array.from(o.v);
  const body = {
    spec: "self-u31f-substrate-hunt-prereg", track: "U31f", regime, arm: "none", seed, steps: 0, B: 16, lr: 5e-3, diet: "none",
    routing: "zero-step copy; Mc never stepped", frozenFrom: "d-newai-w-w6-s" + seed + ".json",
    maxFrozenDrift: 0, maxCopyDiff, verdict: "COMPLETE", wallMs: 0, curve: [],
    mining: { tries: 0, kept: 0, fallback: 0, hardRate: 0 },
    P: { E: save(Mc.E), W1: save(Mc.W1), b1: save(Mc.b1), Wf: save(Mc.Wf), bf: save(Mc.bf), Wc: save(Mc.Wc), bc: save(Mc.bc), Wh: Mc.Wh.map(save), bh: Mc.bh.map(save), Hv: save(Mc.Hv), bv: save(Mc.bv) }
  };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("u31f-none " + tag + " copyFidelity=" + maxCopyDiff);
  return body;
};
globalThis.runU31fEval = async function (fs, log, opts) {
  const regime = opts.regime, arm = opts.arm, seed = opts.seed;
  const force = opts && opts.force;
  const N = 1000, EVALCAP = 60;
  const ri = u31fRegimeIdx(regime);
  const trTag = regime + "-" + arm + "-s" + seed + "-" + (arm === "none" ? "0" : "400") + "st";
  const ledgerPath = "src/evidence/decomp/d-newai-self-eval-u31f-" + trTag + ".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE" && !force) { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  await globalThis.SelfU31fInit(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const Mf = await loadU1W6(fs, G, seed);
  const Mc = await loadU1W6(fs, G, seed);
  const MP = await loadU1M2nb(fs, G, seed);
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-u31f-" + trTag + ".json"));
  if (!tr || tr.verdict !== "COMPLETE") throw new Error("u31f train ledger missing for " + trTag);
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  const P = tr.P;
  load(Mc.E, P.E); load(Mc.W1, P.W1); load(Mc.b1, P.b1);
  load(Mc.Wf, P.Wf); load(Mc.bf, P.bf); load(Mc.Wc, P.Wc); load(Mc.bc, P.bc);
  for (let k = 0; k < 5; k++) { load(Mc.Wh[k], P.Wh[k]); load(Mc.bh[k], P.bh[k]); }
  load(Mc.Hv, P.Hv); load(Mc.bv, P.bv);
  const tr28 = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-u28-comp-s" + seed + "-800st.json"));
  const S = u22cMakeS(G.makeRng(1)), SC = u22cMakeScorer(G.makeRng(1)), HF = u22bMakeHF(G.makeRng(1)), INH = u26MakeINH(G.makeRng(1));
  load(S.W, tr28.P.SW); load(S.b, tr28.P.Sb); load(SC.w, tr28.P.CW); load(SC.b, tr28.P.Cb);
  load(HF.W1, tr28.P.HW1); load(HF.b1, tr28.P.Hb1); load(HF.W2, tr28.P.HW2); load(HF.b2, tr28.P.Hb2);
  load(INH.W1, tr28.P.IW1); load(INH.b1, tr28.P.Ib1); load(INH.W2, tr28.P.IW2); load(INH.b2, tr28.P.Ib2);
  const minerHF = await loadU21Miner(fs, G, seed);
  let evalMasks = null; { const fr2 = G.makeRng(91000 + seed); evalMasks = []; for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr2.int(10) < 5 ? 2 : 0; evalMasks.push(m); } }
  const argmax4 = a => { let b = 0; for (let i = 0; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  const HDold = await loadU16U5head(fs, G, seed);
  const r2 = (M, e, vhat) => {
    const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
    return argmax4(inMeanLogits({ logitsK: inSeqForward(M, x2m, new Float64Array(8), evalMasks).logitsK }));
  };
  const arngH = G.makeRng(66300 + seed + ri * 1000);
  let hardN = 0, hardFallback = 0, filterMiss = 0, yMc = 0, yMf = 0, ri9 = 0;
  let majCount = [0, 0, 0, 0];
  while (hardN < N) {
    let kept = null, keptCtx = null;
    for (let t = 0; t < EVALCAP; t++) {
      const ep = genAdaptEpisode(arngH);
      const keepInfo = u23bVhatKeep(Mf, MP, minerHF, evalMasks, ep);
      const srg = G.makeRng(72000 + seed * 1000 + ri9 + t);
      const ctx = u31fRowCtx(Mf, MP, HDold, S, SC, HF, INH, srg, ep, evalMasks);
      if (!u31fEvalFilter(regime, ep, keepInfo.keep, ctx)) { filterMiss++; if (t === EVALCAP - 1) { kept = ep; keptCtx = ctx; hardFallback++; } continue; }
      kept = ep; keptCtx = ctx; break;
    }
    hardN++;
    const row = u31fRegimeRow(regime, keptCtx);
    majCount[row.label]++;
    if (r2(Mc, keptCtx.e, row.vhatF) === row.label) yMc++;
    if (r2(Mf, keptCtx.e, row.vhatF) === row.label) yMf++;
    ri9++;
  }
  const majBase = Math.max(...majCount) / N;
  const srng = G.makeRng(52500 + seed + ri * 1000), supRng = G.makeRng(42000 + seed * 104729 + 999 + ri * 100003);
  let scrMc = 0, scrMf = 0, twoMc = 0, twoMf = 0;
  for (let i = 0; i < 200; i++) {
    const e = inSeqGenShift(srng, null);
    const supE = [inSeqGenShift(supRng, null), inSeqGenShift(supRng, null), inSeqGenShift(supRng, null), inSeqGenShift(supRng, null)];
    const sup = supE.map(se => ({ qkId: se.qk, vId: 4 + se.v, forceZero: false }));
    const fw1 = inSeqForward(Mf, e.x, new Float64Array(8), evalMasks);
    const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = Mf.E.v[e.qk * 12 + d];
    const fr = m2ReadForward(Mf, MP, Eqk, sup);
    const ens = new Float64Array(4); for (let o = 0; o < 4; o++) ens[o] = fw1.hvLog[o] + fr.readLogits[o];
    if (argmax4(ens) === e.v) { scrMf++; scrMc++; }
    let vhat = argmax4(ens), label = e.y;
    if (regime === "r1") vhat = u31fSecondBest(Array.from(ens));
    if (regime === "r4") label = (e.y + argmax4(ens)) % 4;
    if (r2(Mc, e, vhat) === label) twoMc++;
    if (r2(Mf, e, vhat) === label) twoMf++;
  }
  let allowedMc = null, allowedMf = null;
  if (regime === "r3") {
    const arng2 = G.makeRng(66400 + seed);
    let an = 0, aMc = 0, aMf = 0, aFb = 0, aj = 0;
    while (an < 200) {
      let kept2 = null, ctx2 = null;
      for (let t = 0; t < EVALCAP; t++) {
        const ep = genAdaptEpisode(arng2);
        const keepInfo = u23bVhatKeep(Mf, MP, minerHF, evalMasks, ep);
        if (!keepInfo.keep || ep.query.qk === ep.query.v) { if (t === EVALCAP - 1) { kept2 = ep; aFb++; } continue; }
        const srg = G.makeRng(73000 + seed * 1000 + aj + t);
        kept2 = ep; ctx2 = u31fRowCtx(Mf, MP, HDold, S, SC, HF, INH, srg, ep, evalMasks); break;
      }
      if (!ctx2) { const ep = kept2; const srg = G.makeRng(73000 + seed * 1000 + aj); ctx2 = u31fRowCtx(Mf, MP, HDold, S, SC, HF, INH, srg, ep, evalMasks); }
      an++;
      const row = u31fRegimeRow(regime, ctx2);
      if (r2(Mc, ctx2.e, row.vhatF) === row.label) aMc++;
      if (r2(Mf, ctx2.e, row.vhatF) === row.label) aMf++;
      aj++;
    }
    allowedMc = +(aMc / 200).toFixed(4); allowedMf = +(aMf / 200).toFixed(4);
  }
  const body = {
    spec: "self-u31f-substrate-hunt-prereg", track: "U31f", regime, arm, seed, steps: arm === "none" ? 0 : 400, verdict: "COMPLETE", n: N,
    miningRule: "miner-keep AND regime-eval-filter; deterministic base 66300+seed+regIdx*1000 -> identical row sets across future arms (paired); cap " + EVALCAP,
    evalCap: EVALCAP,
    hardAdaptY: +(yMc / N).toFixed(4), hardAdaptY_frozen: +(yMf / N).toFixed(4), liftVsFrozen: +((yMc - yMf) / N).toFixed(4),
    majorityBaseline: +majBase.toFixed(4),
    allowedCtxMc: allowedMc, allowedCtxFrozen: allowedMf,
    stdScr: +(scrMc / 200).toFixed(4), stdTwo: +(twoMc / 200).toFixed(4), stdTwo_frozen: +(twoMf / 200).toFixed(4),
    hardFallback, filterMiss, frozenDriftTrain: tr.maxFrozenDrift, mining: tr.mining
  };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("u31f-eval " + trTag + " hardY=" + body.hardAdaptY + " frozen=" + body.hardAdaptY_frozen + " lift=" + body.liftVsFrozen + " maj=" + body.majorityBaseline + " fb=" + hardFallback + " stdTwo=" + body.stdTwo + " fstdTwo=" + body.stdTwo_frozen);
  return body;
};
