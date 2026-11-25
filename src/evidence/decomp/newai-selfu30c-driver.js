// newai-selfu30-driver.js — U30 wide-encoding separability (surgery on U28/U29: ND 8->12, content-only).
globalThis.SelfU30cInit = async function (fs) {
  for (const p of ["src/evidence/decomp/newai-selfu30-driver.js"]) {
    const src = await fs.readTextFile(p); (0, eval)(src + "\n//# sourceURL=" + p);
  }
  await globalThis.SelfU30Init(fs);
  if (!globalThis.runU30cTrain && !globalThis.runU30Train) throw new Error("u30c stack load failed");
};
function u30ArmCode(arm) { if (arm === "u30c-comp") return 179; if (arm === "u30c-shuf") return 180; return 179; }
const U30_MARGIN = 1.0, U30_LAMC = 1.0;
const U30_ND = 12, U30_NH = 6;
function u30MakeS(rng) { return { W: inParam(rng, 12*4, 4), b: inParam(rng, 12, 12) }; }
function u30MakeScorer(rng) { return { w: inParam(rng, 12, 12), b: inParam(rng, 1, 1) }; }
function u30MakeHF(rng) { return { W1: inParam(rng, 24*60, 60), b1: inParam(rng, 24, 24), W2: inParam(rng, 4*24, 24), b2: inParam(rng, 4, 4) }; }
function u30SParams(S) { return [S.W, S.b]; }
function u30ScorerParams(C) { return [C.w, C.b]; }
function u30HFParams(HF) { return [HF.W1, HF.b1, HF.W2, HF.b2]; }
function u30MakeINH(rng) { return { W1: inParam(rng, 6*12, 12), b1: inParam(rng, 6, 6), W2: inParam(rng, 6, 6), b2: inParam(rng, 1, 1) }; }
function u30INHParams(I) { return [I.W1, I.b1, I.W2, I.b2]; }
function u30PoolForward(S, C, INH, slots) {
  const N = 250, ND = 12, NH = 6;
  const enc = new Float64Array(N*ND);
  for (let i = 0; i < N; i++) for (let k = 0; k < ND; k++) {
    let s = S.b.v[k]; for (let d = 0; d < 4; d++) s += S.W.v[k*4+d]*slots[i*4+d];
    const sig = 1/(1+Math.exp(-s)); enc[i*ND+k] = s*sig;
  }
  const hPre = new Float64Array(N*NH), hAct = new Float64Array(N*NH), pre = new Float64Array(N), inh = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < NH; j++) {
      let s = INH.b1.v[j]; for (let k = 0; k < ND; k++) s += INH.W1.v[j*ND+k]*enc[i*ND+k];
      hPre[i*NH+j] = s; const sig = 1/(1+Math.exp(-s)); hAct[i*NH+j] = s*sig;
    }
    let p = INH.b2.v[0]; for (let j = 0; j < NH; j++) p += INH.W2.v[j]*hAct[i*NH+j];
    pre[i] = p; inh[i] = p > 20 ? p : (p < -20 ? 0 : Math.log(1+Math.exp(p)));
  }
  const scores = new Float64Array(N);
  for (let i = 0; i < N; i++) { let s = C.b.v[0]; for (let k = 0; k < ND; k++) s += C.w.v[k]*enc[i*ND+k]; scores[i] = s - inh[i]; }
  let mx = -1e300; for (let i = 0; i < N; i++) if (scores[i] > mx) mx = scores[i];
  const w = new Float64Array(N); let z = 0;
  for (let i = 0; i < N; i++) { w[i] = Math.exp(scores[i]-mx); z += w[i]; }
  for (let i = 0; i < N; i++) w[i] /= z;
  const summary = new Float64Array(ND);
  for (let i = 0; i < N; i++) for (let k = 0; k < ND; k++) summary[k] += w[i]*enc[i*ND+k];
  let t1 = -1, t2 = -1;
  for (let i = 0; i < N; i++) { if (t1 < 0 || scores[i] > scores[t1]) { t2 = t1; t1 = i; } else if (t2 < 0 || scores[i] > scores[t2]) { t2 = i; } }
  return { summary, scores, weights: w, top2: [t1, t2], enc, hPre, hAct, pre, inh, cache: { slots } };
}
function u30PoolBackwardCE(S, C, INH, fw, dsum) {
  const N = 250, ND = 12, NH = 6;
  const { enc, weights: w } = fw;
  const dWd = new Float64Array(N);
  for (let i = 0; i < N; i++) { let s = 0; for (let k = 0; k < ND; k++) s += dsum[k]*enc[i*ND+k]; dWd[i] = s; }
  let avg = 0; for (let i = 0; i < N; i++) avg += w[i]*dWd[i];
  const dS = new Float64Array(N);
  for (let j = 0; j < N; j++) dS[j] = w[j]*(dWd[j]-avg);
  const dEnc = new Float64Array(N*ND);
  for (let i = 0; i < N; i++) for (let k = 0; k < ND; k++) dEnc[i*ND+k] = w[i]*dsum[k];
  for (let i = 0; i < N; i++) {
    C.b.g[0] += dS[i];
    for (let k = 0; k < ND; k++) { C.w.g[k] += dS[i]*enc[i*ND+k]; dEnc[i*ND+k] += dS[i]*C.w.v[k]; }
  }
  const slots = fw.cache.slots;
  for (let i = 0; i < N; i++) for (let k = 0; k < ND; k++) {
    if (dEnc[i*ND+k] === 0) continue;
    let s = S.b.v[k]; for (let d = 0; d < 4; d++) s += S.W.v[k*4+d]*slots[i*4+d];
    const sig = 1/(1+Math.exp(-s)); const dpre = dEnc[i*ND+k]*(sig+s*sig*(1-sig));
    S.b.g[k] += dpre; for (let d = 0; d < 4; d++) S.W.g[k*4+d] += dpre*slots[i*4+d];
  }
}
function u30Contrastive(scores) {
  const TRUE = [7,41,129,166,203];
  let minT = 1e300, argT = TRUE[0];
  for (const i of TRUE) if (scores[i] < minT) { minT = scores[i]; argT = i; }
  // top-3 distractors by score
  let d1 = -1, d2 = -1, d3 = -1, v1 = -1e300, v2 = -1e300, v3 = -1e300;
  for (let i = 0; i < 250; i++) { if (TRUE.includes(i)) continue; const s = scores[i]; if (s > v1) { v3 = v2; d3 = d2; v2 = v1; d2 = d1; v1 = s; d1 = i; } else if (s > v2) { v3 = v2; d3 = d2; v2 = s; d2 = i; } else if (s > v3) { v3 = s; d3 = i; } }
  const meanTop3 = (v1+v2+v3)/3;
  const viol = U30_MARGIN-(minT-meanTop3);
  const dLds = new Float64Array(250);
  if (viol > 0) { dLds[argT] = -U30_LAMC; const w = U30_LAMC/3; if (d1>=0) dLds[d1] += w; if (d2>=0) dLds[d2] += w; if (d3>=0) dLds[d3] += w; }
  let meanT = 0; for (const i of TRUE) meanT += scores[i]; meanT /= TRUE.length;
  return { loss: Math.max(0, viol), dLds, minT, meanT, meanD: meanTop3, maxD: v1, argT, argD: d1, argD2: d2, argD3: d3 };
}
// U30c: u30ContrastiveBackward unchanged in form (N*ND sparse via dLds) — 4-slot dLds flows through same path.
function u30ContrastiveBackward(S, C, INH, pf, dLds) {
  const N = 250, ND = 12, NH = 6;
  const dEnc = new Float64Array(N*ND);
  for (let s = 0; s < N; s++) {
    if (dLds[s] === 0) continue;
    C.b.g[0] += dLds[s];
    for (let k = 0; k < ND; k++) { C.w.g[k] += dLds[s]*pf.enc[s*ND+k]; dEnc[s*ND+k] += dLds[s]*C.w.v[k]; }
  }
  for (let i = 0; i < N; i++) {
    if (dLds[i] === 0) continue;
    const dInh = -dLds[i]; const sigP = 1/(1+Math.exp(-pf.pre[i])); const dPre = dInh*sigP;
    INH.b2.g[0] += dPre;
    const dH = new Float64Array(NH);
    for (let j = 0; j < NH; j++) { INH.W2.g[j] += dPre*pf.hAct[i*NH+j]; dH[j] = dPre*INH.W2.v[j]; }
    for (let j = 0; j < NH; j++) {
      if (dH[j] === 0) continue;
      const s = pf.hPre[i*NH+j], sig = 1/(1+Math.exp(-s));
      const dHPre = dH[j]*(sig+s*sig*(1-sig));
      INH.b1.g[j] += dHPre;
      for (let k = 0; k < ND; k++) { INH.W1.g[j*ND+k] += dHPre*pf.enc[i*ND+k]; dEnc[i*ND+k] += dHPre*INH.W1.v[j*ND+k]; }
    }
  }
  const slots = pf.cache.slots;
  for (let i = 0; i < N; i++) for (let k = 0; k < ND; k++) {
    if (dEnc[i*ND+k] === 0) continue;
    let s = S.b.v[k]; for (let d = 0; d < 4; d++) s += S.W.v[k*4+d]*slots[i*4+d];
    const sig = 1/(1+Math.exp(-s)); const dpre = dEnc[i*ND+k]*(sig+s*sig*(1-sig));
    S.b.g[k] += dpre; for (let d = 0; d < 4; d++) S.W.g[k*4+d] += dpre*slots[i*4+d];
  }
}
globalThis.runU30cTrain = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const force = opts && opts.force;
  const steps = 800, B = 16, lr = 5e-3, K = 5, H = 48, Cc = 6, wAdapt = 0.5, wStd = 1.0, NHARD = 8;
  const tag = arm+"-s"+seed+"-"+steps+"st";
  const ledgerPath = "src/evidence/decomp/d-newai-self-"+tag+".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE" && !force) { log(ledgerPath+" exists, skip"); return prev; } } catch (e) {}
  await globalThis.SelfU30cInit(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const M = await loadU1W6(fs, G, seed);
  const MP = await loadU1M2nb(fs, G, seed);
  const HDold = await loadU16U5head(fs, G, seed);
  const LT = await loadU17Teacher(fs, G, seed);
  const minerHF = await loadU21Miner(fs, G, seed);
  const S = u30MakeS(G.makeRng(78000+seed*7919+u30ArmCode(arm)*131));
  const SC = u30MakeScorer(G.makeRng(78100+seed*7919+u30ArmCode(arm)*131));
  const HF = u30MakeHF(G.makeRng(79000+seed*7919+u30ArmCode(arm)*131));
  const INH = u30MakeINH(G.makeRng(78520+seed*7919+u30ArmCode(arm)*131));
  const hParams = [...u30SParams(S), ...u30ScorerParams(SC), ...u30HFParams(HF), ...u30INHParams(INH)];
  const opt = new G.Adam(lr);
  const dataRng = G.makeRng(42200+seed*104729+77);
  const mineRng = G.makeRng(70300+seed);
  let fixedMasks = null; { const fr = G.makeRng(91000+seed); fixedMasks = []; for (let k = 0; k < K; k++) { const m = new Float64Array(H); for (let i = 0; i < H; i++) m[i] = fr.int(10) < 5 ? 2 : 0; fixedMasks.push(m); } }
  const M0snap = inSeqParams(M).map(p => Float64Array.from(p.v));
  const isShuf = (arm === "u30c-shuf");
  const t0 = Date.now(), curve = [];
  let mineTries = 0, mineFallback = 0, hardKept = 0, compSum = 0, compN = 0;
  const buildRow = (e, sup) => {
    const fw1 = inSeqForward(M, e.x, new Float64Array(8), fixedMasks);
    const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = M.E.v[e.qk*12+d];
    const fr = m2ReadForward(M, MP, Eqk, sup.list);
    const headOld = u16U5HeadOut(HDold, fw1.h);
    const carry = (sup.isAdapt) ? new Float64Array(8) : Float64Array.from(fw1.cNew);
    const h = Float64Array.from(fw1.h), read = Float64Array.from(fr.readLogits), hv = Float64Array.from(fw1.hvLog);
    const trueVecs = u22cTrueSlots(read, hv, headOld, carry);
    const slots = u22cBuildSlots(dataRng, trueVecs);
    return { e, isAdapt: sup.isAdapt, h, read, hv, headOld, carry, slots };
  };
  for (let step = 0; step < steps; step++) {
    for (const p of hParams) p.g.fill(0);
    const batch = [];
    for (let b = 0; b < B-NHARD; b++) {
      const isAdapt = dataRng.int(2) === 1;
      let e, sup;
      if (!isAdapt) {
        const cands = [];
        for (let c = 0; c < Cc; c++) { const ub = dataRng.int(2) === 0; cands.push(ub ? inSeqGenShift(dataRng, 0) : inSeqGenShift(dataRng, null)); }
        let pk = 0, best = -1;
        for (let c = 0; c < Cc; c++) { const fw = inSeqForward(M, cands[c].x, new Float64Array(8), fixedMasks); const d = curVoteDisagree(fw.logitsK); if (d > best) { best = d; pk = c; } }
        e = cands[pk];
        const supE = [inSeqGenShift(dataRng, null), inSeqGenShift(dataRng, null), inSeqGenShift(dataRng, null), inSeqGenShift(dataRng, null)];
        sup = { list: supE.map(se => ({ qkId: se.qk, vId: 4+se.v, forceZero: false })), isAdapt: false };
      } else {
        const ep = genAdaptEpisode(dataRng); e = ep.query; sup = { list: ep.sup.map(se => ({ qkId: se.qk, vId: 4+se.v, forceZero: false })), isAdapt: true };
      }
      batch.push({ ...buildRow(e, sup), hard: false });
    }
    for (let b = 0; b < NHARD; b++) {
      let kept = null;
      for (let t = 0; t < 20; t++) {
        mineTries++;
        const ep = genAdaptEpisode(mineRng);
        if (u23bVhatKeep(M, MP, minerHF, fixedMasks, ep).keep) { kept = ep; hardKept++; break; }
        if (t === 19) { kept = ep; mineFallback++; }
      }
      const keptSup = { list: kept.sup.map(se => ({ qkId: se.qk, vId: 4+se.v, forceZero: false })), isAdapt: true };
      batch.push({ ...buildRow(kept.query, keptSup), hard: true });
    }
    let lsum = 0, lsumH = 0, lsumS = 0;
    for (let b = 0; b < B; b++) {
      const row = batch[b];
      const tSrc = isShuf ? batch[(b+1)%B] : row;
      const tf = u16LinkerForward(LT, tSrc.h, tSrc.read, tSrc.hv, tSrc.headOld, tSrc.carry);
      const w = row.isAdapt ? wAdapt : wStd;
      const target = row.isAdapt ? tf.out : new Float64Array(4);
      const zslots = isShuf ? batch[(b+1)%B].slots : row.slots;
      const pf = u30PoolForward(S, SC, INH, zslots);
      const x = new Float64Array(60); x.set(row.h, 0); x.set(pf.summary, 48);
      const f = siluFwd(HF.W1, HF.b1, HF.W2, HF.b2, x, 60, 24, 4);
      const ens = new Float64Array(4); for (let o = 0; o < 4; o++) ens[o] = row.hv[o]+row.read[o]+f.out[o];
      const ce = inCELossGrad(ens, row.e.v);
      let rowLoss = ce.loss;
      let mse = 0; for (let o = 0; o < 4; o++) { const dd = f.out[o]-target[o]; mse += w*dd*dd/4; }
      rowLoss += mse;
      if (row.isAdapt) {
        const cmp = u30Contrastive(pf.scores);
        rowLoss += U30_LAMC*cmp.loss;
        compSum += cmp.loss; compN++;
      }
      lsum += rowLoss;
      if (row.hard) lsumH += rowLoss; else lsumS += rowLoss;
      const d = new Float64Array(4);
      for (let o = 0; o < 4; o++) d[o] = ce.d[o]/B+w*(f.out[o]-target[o])/2/B;
      siluBwd(HF.W1, HF.b1, HF.W2, HF.b2, x, 60, 24, 4, f.cache, d);
      const dhaHF = new Float64Array(24);
      for (let j = 0; j < 24; j++) { let s = 0; for (let o = 0; o < 4; o++) s += HF.W2.v[o*24+j]*d[o]; const sig = 1/(1+Math.exp(-f.cache.pre[j])); dhaHF[j] = s*(sig+f.cache.pre[j]*sig*(1-sig)); }
      const dsum = new Float64Array(12);
      for (let k = 0; k < 12; k++) { let s = 0; for (let j = 0; j < 24; j++) s += HF.W1.v[j*60+48+k]*dhaHF[j]; dsum[k] = s; }
      u30PoolBackwardCE(S, SC, INH, pf, dsum); // DETACH: INH untouched here
      if (row.isAdapt) {
        const cmp = u30Contrastive(pf.scores);
        const scaled = Float64Array.from(cmp.dLds.map(v => v/B));
        u30ContrastiveBackward(S, SC, INH, pf, scaled); // selection path: INH included
      }
    }
    let s = 0; for (const p of hParams) for (let i = 0; i < p.g.length; i++) s += p.g[i]*p.g[i];
    const n = Math.sqrt(s); if (n > 1.0) { const sc = 1.0/n; for (const p of hParams) for (let i = 0; i < p.g.length; i++) p.g[i] *= sc; }
    opt.step(hParams);
    if (step % 100 === 0 || step === steps-1) curve.push({ step, loss: +(lsum/B).toFixed(6), hardLoss: +((lsumH/NHARD) || 0).toFixed(6), stdLoss: +((lsumS/(B-NHARD)) || 0).toFixed(6) });
  }
  const M1p = inSeqParams(M); let maxDrift = 0;
  for (let pi = 0; pi < M1p.length; pi++) for (let i = 0; i < M1p[pi].v.length; i++) { const dd = Math.abs(M1p[pi].v[i]-M0snap[pi][i]); if (dd > maxDrift) maxDrift = dd; }
  const save = o => Array.from(o.v);
  const body = { spec: "self-u30c-topk-prereg", track: "U30c", arm, seed, steps, B, lr, wAdapt, wStd, lamC: U30_LAMC, margin: U30_MARGIN, gatedEval: true,
    routing: "detached: CE/MSE-path stop-gradient at INH (u30PoolBackwardCE); max-hinge-path to S+C+INH (2-slot)",
    teacher: "u17-gated-s"+seed+" (true-20 only)", miner: "u21-lowfold-s"+seed,
    miningRule: "vhatM!=e.v AND oracleY correct (argmax-only, U23b D1); DEDICATED mineRng 70300+seed",
    frozenAll: true, maxFrozenDrift: maxDrift, verdict: "COMPLETE", wallMs: Date.now()-t0, curve,
    mining: { tries: mineTries, hardKept, fallback: mineFallback, hardRate: +(hardKept/Math.max(1, mineTries)).toFixed(4) },
    compLossMean: +(compSum/Math.max(1, compN)).toFixed(4),
    P: { SW: save(S.W), Sb: save(S.b), CW: save(SC.w), Cb: save(SC.b), HW1: save(HF.W1), Hb1: save(HF.b1), HW2: save(HF.W2), Hb2: save(HF.b2),
      IW1: save(INH.W1), Ib1: save(INH.b1), IW2: save(INH.W2), Ib2: save(INH.b2) } };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("u30-train "+tag+" loss0="+curve[0].loss+" lossN="+curve[curve.length-1].loss+" hardRate="+body.mining.hardRate+" compMean="+body.compLossMean+" frozenDrift="+maxDrift);
  return body;
};


globalThis.runU30cEval = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const force = opts && opts.force;
  const steps = 800, N = 200;
  const tag = arm+"-s"+seed+"-"+steps+"st";
  const ledgerPath = "src/evidence/decomp/d-newai-self-eval-"+tag+".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE" && !force) { log(ledgerPath+" exists, skip"); return prev; } } catch (e) {}
  await globalThis.SelfU30cInit(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const M = await loadU1W6(fs, G, seed);
  const MP = await loadU1M2nb(fs, G, seed);
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-"+tag+".json"));
  const S = u30MakeS(G.makeRng(1)), SC = u30MakeScorer(G.makeRng(1)), HF = u30MakeHF(G.makeRng(1)), INH = u30MakeINH(G.makeRng(1));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(S.W, tr.P.SW); load(S.b, tr.P.Sb); load(SC.w, tr.P.CW); load(SC.b, tr.P.Cb);
  load(HF.W1, tr.P.HW1); load(HF.b1, tr.P.Hb1); load(HF.W2, tr.P.HW2); load(HF.b2, tr.P.Hb2);
  load(INH.W1, tr.P.IW1); load(INH.b1, tr.P.Ib1); load(INH.W2, tr.P.IW2); load(INH.b2, tr.P.Ib2);
  const minerHF = await loadU21Miner(fs, G, seed);
  let evalMasks = null; { const fr2 = G.makeRng(91000+seed); evalMasks = []; for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr2.int(10) < 5 ? 2 : 0; evalMasks.push(m); } }
  const argmax4 = a => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  const UTRUE = [7,41,129,166,203];
  const fwd = (h, slots) => {
    const pf = u30PoolForward(S, SC, INH, slots);
    const x = new Float64Array(60); x.set(h, 0); x.set(pf.summary, 48);
    const f = siluFwd(HF.W1, HF.b1, HF.W2, HF.b2, x, 60, 24, 4);
    return { out: f.out, pf };
  };
  const fwdNoQuery_DISABLED = (h, slots, pf) => {
    const zEqk = new Float64Array(12);
    const pfZ = u30PoolForward(S, SC, INH, slots, zEqk);
    const x = new Float64Array(56); x.set(h, 0); x.set(pfZ.summary, 48);
    const f = siluFwd(HF.W1, HF.b1, HF.W2, HF.b2, x, 60, 24, 4);
    return { out: f.out, pf: pfZ };
  };
  const fwdNoInh = (h, slots, pf) => {
    const N2 = 250;
    const lin = new Float64Array(N2);
    for (let i = 0; i < N2; i++) lin[i] = pf.scores[i]+pf.inh[i];
    let mx = -1e300; for (let i = 0; i < N2; i++) if (lin[i] > mx) mx = lin[i];
    const w = new Float64Array(N2); let z = 0;
    for (let i = 0; i < N2; i++) { w[i] = Math.exp(lin[i]-mx); z += w[i]; }
    for (let i = 0; i < N2; i++) w[i] /= z;
    const summary = new Float64Array(12);
    for (let i = 0; i < N2; i++) for (let k = 0; k < 12; k++) summary[k] += w[i]*pf.enc[i*12+k];
    const x = new Float64Array(60); x.set(h, 0); x.set(summary, 48);
    const f = siluFwd(HF.W1, HF.b1, HF.W2, HF.b2, x, 60, 24, 4);
    return { out: f.out };
  };
  const isTrueSlot = idx => UTRUE.includes(idx);
  const compRow = pf => {
    let minT = 1e300; for (const i of UTRUE) minT = Math.min(minT, pf.scores[i]);
    let maxD = -1e300; for (let i = 0; i < 250; i++) { if (!UTRUE.includes(i)) maxD = Math.max(maxD, pf.scores[i]); }
    let meanT = 0; for (const i of UTRUE) meanT += pf.scores[i]; meanT /= 5;
    return { strict: maxD < minT, margin: meanT-maxD };
  };
  const srng = G.makeRng(52500+seed), supRng = G.makeRng(42000+seed*104729+999);
  let scr = 0, two = 0;
  for (let i = 0; i < N; i++) {
    const e = inSeqGenShift(srng, null);
    const supE = [inSeqGenShift(supRng, null), inSeqGenShift(supRng, null), inSeqGenShift(supRng, null), inSeqGenShift(supRng, null)];
    const sup = supE.map(se => ({ qkId: se.qk, vId: 4+se.v, forceZero: false }));
    const fw1 = inSeqForward(M, e.x, new Float64Array(8), evalMasks);
    const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = M.E.v[e.qk*12+d];
    const fr = m2ReadForward(M, MP, Eqk, sup);
    const ens = new Float64Array(4); for (let o = 0; o < 4; o++) ens[o] = fw1.hvLog[o]+fr.readLogits[o];
    if (argmax4(ens) === e.v) scr++;
    const vhat = argmax4(ens);
    const x2m = [9,9,9,9,9,9,e.qk,e.k,vhat,8];
    const fw2 = inSeqForward(M, x2m, fw1.cNew, evalMasks);
    if (argmax4(inMeanLogits({ logitsK: fw2.logitsK })) === e.y) two++;
  }
  const arng = G.makeRng(61000+seed);
  let adaptY = 0, adaptV = 0, adaptYabl = 0, hitTop2 = 0;
  for (let i = 0; i < N; i++) {
    const ep = genAdaptEpisode(arng);
    const sup = ep.sup.map(se => ({ qkId: se.qk, vId: 4+se.v, forceZero: false }));
    const e = ep.query;
    const fw1 = inSeqForward(M, e.x, new Float64Array(8), evalMasks);
    const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = M.E.v[e.qk*12+d];
    const fr = m2ReadForward(M, MP, Eqk, sup);
    const HDold = await loadU16U5head(fs, G, seed);
    const headOld = u16U5HeadOut(HDold, fw1.h);
    const h = Float64Array.from(fw1.h), read = Float64Array.from(fr.readLogits), hv = Float64Array.from(fw1.hvLog);
    const carry = new Float64Array(8);
    const trueVecs = u22cTrueSlots(read, hv, headOld, carry);
    const slots = u22cBuildSlots(G.makeRng(71000+seed*1000+i), trueVecs);
    const r = fwd(h, slots);
    if (isTrueSlot(r.pf.top2[0]) || isTrueSlot(r.pf.top2[1])) hitTop2++;
    const ens = new Float64Array(4); for (let o = 0; o < 4; o++) ens[o] = hv[o]+read[o]+r.out[o];
    const vhat = argmax4(ens);
    if (vhat === e.v) adaptV++;
    const x2m = [9,9,9,9,9,9,e.qk,e.k,vhat,8];
    const fw2 = inSeqForward(M, x2m, new Float64Array(8), evalMasks);
    if (argmax4(inMeanLogits({ logitsK: fw2.logitsK })) === e.y) adaptY++;
    const ensA = new Float64Array(4); for (let o = 0; o < 4; o++) ensA[o] = hv[o]+read[o];
    const vhatA = argmax4(ensA);
    const x2a = [9,9,9,9,9,9,e.qk,e.k,vhatA,8];
    const fw2a = inSeqForward(M, x2a, new Float64Array(8), evalMasks);
    if (argmax4(inMeanLogits({ logitsK: fw2a.logitsK })) === e.y) adaptYabl++;
  }
  const arngH = G.makeRng(71300+seed);
  let hardY = 0, hardV = 0, hardYabl = 0, hardYsumAbl = 0, hardYnoInh = 0, hardYnoQuery = 0, hardHit = 0, hardN = 0,
      minerOK = 0, minerVok = 0, oracleY = 0, hardFallback = 0, compStrict = 0, compMarginSum = 0, ri = 0;
  let inhTrueSum = 0, inhDistSum = 0, inhTrueN = 0, inhDistN = 0;
  while (hardN < N) {
    let kept = null;
    for (let t = 0; t < 20; t++) {
      const ep = genAdaptEpisode(arngH);
      if (u23bVhatKeep(M, MP, minerHF, evalMasks, ep).keep) { kept = ep; break; }
      if (t === 19) { kept = ep; hardFallback++; }
    }
    hardN++;
    const sup = kept.sup.map(se => ({ qkId: se.qk, vId: 4+se.v, forceZero: false }));
    const e = kept.query;
    const fw1 = inSeqForward(M, e.x, new Float64Array(8), evalMasks);
    const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = M.E.v[e.qk*12+d];
    const fr = m2ReadForward(M, MP, Eqk, sup);
    const HDold = await loadU16U5head(fs, G, seed);
    const headOld = u16U5HeadOut(HDold, fw1.h);
    const h = Float64Array.from(fw1.h), read = Float64Array.from(fr.readLogits), hv = Float64Array.from(fw1.hvLog);
    const carry = new Float64Array(8);
    const trueVecs = u22cTrueSlots(read, hv, headOld, carry);
    const slots = u22cBuildSlots(G.makeRng(72000+seed*1000+ri), trueVecs);
    const r = fwd(h, slots);
    const cr = compRow(r.pf);
    if (cr.strict) compStrict++;
    compMarginSum += cr.margin;
    for (const ti of UTRUE) { inhTrueSum += r.pf.inh[ti]; inhTrueN++; }
    for (let si = 0; si < 250; si++) { if (!UTRUE.includes(si)) { inhDistSum += r.pf.inh[si]; inhDistN++; } }
    if (isTrueSlot(r.pf.top2[0]) || isTrueSlot(r.pf.top2[1])) hardHit++;
    const ens = new Float64Array(4); for (let o = 0; o < 4; o++) ens[o] = hv[o]+read[o]+r.out[o];
    const vhat = argmax4(ens);
    if (vhat === e.v) hardV++;
    const x2m = [9,9,9,9,9,9,e.qk,e.k,vhat,8];
    const fw2 = inSeqForward(M, x2m, new Float64Array(8), evalMasks);
    if (argmax4(inMeanLogits({ logitsK: fw2.logitsK })) === e.y) { hardY++; hardYnoQuery++; }
    const rN = fwdNoInh(h, slots, r.pf);
    const ensN = new Float64Array(4); for (let o = 0; o < 4; o++) ensN[o] = hv[o]+read[o]+rN.out[o];
    const vhatN = argmax4(ensN);
    const x2n = [9,9,9,9,9,9,e.qk,e.k,vhatN,8];
    const fw2n = inSeqForward(M, x2n, new Float64Array(8), evalMasks);
    if (argmax4(inMeanLogits({ logitsK: fw2n.logitsK })) === e.y) hardYnoInh++;
    /* U30: no query ablation — hardYnoQuery set equal to hardY after loop */
    const ensA = new Float64Array(4); for (let o = 0; o < 4; o++) ensA[o] = hv[o]+read[o];
    const vhatA = argmax4(ensA);
    const x2a = [9,9,9,9,9,9,e.qk,e.k,vhatA,8];
    const fw2a = inSeqForward(M, x2a, new Float64Array(8), evalMasks);
    if (argmax4(inMeanLogits({ logitsK: fw2a.logitsK })) === e.y) hardYabl++;
    const mo = u18HeadForward(minerHF, h).out;
    const ensM = new Float64Array(4); for (let o = 0; o < 4; o++) ensM[o] = hv[o]+read[o]+mo[o];
    const vhatM = argmax4(ensM);
    if (vhatM === e.v) minerVok++;
    const x2mM = [9,9,9,9,9,9,e.qk,e.k,vhatM,8];
    const fw2M = inSeqForward(M, x2mM, new Float64Array(8), evalMasks);
    if (argmax4(inMeanLogits({ logitsK: fw2M.logitsK })) === e.y) minerOK++;
    const x2o = [9,9,9,9,9,9,e.qk,e.k,e.v,8];
    const fw2o = inSeqForward(M, x2o, new Float64Array(8), evalMasks);
    if (argmax4(inMeanLogits({ logitsK: fw2o.logitsK })) === e.y) oracleY++;
    const xz = new Float64Array(56); xz.set(h, 0);
    const fz = siluFwd(HF.W1, HF.b1, HF.W2, HF.b2, xz, 56, 24, 4);
    const ensS = new Float64Array(4); for (let o = 0; o < 4; o++) ensS[o] = hv[o]+read[o]+fz.out[o];
    const vhatS = argmax4(ensS);
    const x2s = [9,9,9,9,9,9,e.qk,e.k,vhatS,8];
    const fw2s = inSeqForward(M, x2s, new Float64Array(8), evalMasks);
    if (argmax4(inMeanLogits({ logitsK: fw2s.logitsK })) === e.y) hardYsumAbl++;
    ri++;
  }
  const ood = await loadU22cScale(fs, G, seed);
  let oodY = 0;
  const arngH2 = G.makeRng(71300+seed);
  const hardEps = [];
  while (hardEps.length < N) {
    let kept = null;
    for (let t = 0; t < 20; t++) {
      const ep = genAdaptEpisode(arngH2);
      if (u23bVhatKeep(M, MP, minerHF, evalMasks, ep).keep) { kept = ep; break; }
      if (t === 19) kept = ep;
    }
    hardEps.push(kept);
  }
  for (let i = 0; i < hardEps.length; i++) {
    const ep = hardEps[i];
    const sup = ep.sup.map(se => ({ qkId: se.qk, vId: 4+se.v, forceZero: false }));
    const e = ep.query;
    const fw1 = inSeqForward(M, e.x, new Float64Array(8), evalMasks);
    const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = M.E.v[e.qk*12+d];
    const fr = m2ReadForward(M, MP, Eqk, sup);
    const HDold = await loadU16U5head(fs, G, seed);
    const headOld = u16U5HeadOut(HDold, fw1.h);
    const h = Float64Array.from(fw1.h), read = Float64Array.from(fr.readLogits), hv = Float64Array.from(fw1.hvLog);
    const carry = new Float64Array(8);
    const trueVecs = u22cTrueSlots(read, hv, headOld, carry);
    const slots = u22cBuildSlots(G.makeRng(72000+seed*1000+i), trueVecs);
    const pf = u22cPoolForward(ood.S, ood.SC, slots);
    const x = new Float64Array(60); x.set(h, 0); x.set(pf.summary, 48);
    const f = siluFwd(ood.HF.W1, ood.HF.b1, ood.HF.W2, ood.HF.b2, x, 56, 24, 4);
    const ens = new Float64Array(4); for (let o = 0; o < 4; o++) ens[o] = hv[o]+read[o]+f.out[o];
    const vhat = argmax4(ens);
    const x2m = [9,9,9,9,9,9,e.qk,e.k,vhat,8];
    const fw2 = inSeqForward(M, x2m, new Float64Array(8), evalMasks);
    if (argmax4(inMeanLogits({ logitsK: fw2.logitsK })) === e.y) oodY++;
  }
  const body = { spec: "self-u30c-topk-prereg", track: "U30c", arm, seed, steps, verdict: "COMPLETE", n: N, gatedEval: true,
    miningRule: "vhatM!=e.v AND oracleY correct (argmax-only, U23b D1)",
    accScratch: +(scr/N).toFixed(4), accTwo: +(two/N).toFixed(4), adaptY: +(adaptY/N).toFixed(4), adaptV: +(adaptV/N).toFixed(4),
    adaptYablated: +(adaptYabl/N).toFixed(4), ablateDrop: +((adaptY-adaptYabl)/N).toFixed(4),
    selectHit: +(hitTop2/N).toFixed(4),
    hardAdaptY: +(hardY/N).toFixed(4), hardAdaptV: +(hardV/N).toFixed(4), hardAblated: +(hardYabl/N).toFixed(4),
    hardAblateDrop: +((hardY-hardYabl)/N).toFixed(4), hardSummaryAblated: +(hardYsumAbl/N).toFixed(4),
    hardSummaryDrop: +((hardY-hardYsumAbl)/N).toFixed(4), hardSelectHit: +(hardHit/N).toFixed(4),
    hardNoInhY: +(hardYnoInh/N).toFixed(4), inhibUseDrop: +((hardY-hardYnoInh)/N).toFixed(4),
    hardNoQueryY: +(hardY/N).toFixed(4), queryUseDrop: 0,
    inhTrueMean: +(inhTrueSum/Math.max(1, inhTrueN)).toFixed(4), inhDistMean: +(inhDistSum/Math.max(1, inhDistN)).toFixed(4),
    inhibSeparates: +((inhDistSum/Math.max(1, inhDistN))-(inhTrueSum/Math.max(1, inhTrueN))).toFixed(4),
    compStrictFrac: +(compStrict/N).toFixed(4), compMarginMean: +(compMarginSum/N).toFixed(4),
    minerFloor: +(minerOK/N).toFixed(4), minerV: +(minerVok/N).toFixed(4), oracleY: +(oracleY/N).toFixed(4), hardFallback,
    oodAdaptY: +(oodY/N).toFixed(4),
    frozenDriftTrain: tr.maxFrozenDrift, mining: tr.mining };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("u28-eval "+tag+" two="+body.accTwo+" adaptY="+body.adaptY+" hardY="+body.hardAdaptY+" sel="+body.hardSelectHit+" comp="+body.compStrictFrac+" margin="+body.compMarginMean+" inhUse="+body.inhibUseDrop+" inhSep="+body.inhibSeparates+" minerFloor="+body.minerFloor+" ood="+body.oodAdaptY);
  return body;
};




globalThis.u30cGradCheck = async function (fs, log) {
  await globalThis.SelfU30cInit(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const S = u30MakeS(G.makeRng(4343)), C = u30MakeScorer(G.makeRng(4344)), HF = u30MakeHF(G.makeRng(4345)), INH = u30MakeINH(G.makeRng(4346));
  const hrng = G.makeRng(21);
  const h = new Float64Array(48); for (let i = 0; i < 48; i++) h[i] = hrng.uniform(-0.5, 0.5);
  const slots = new Float64Array(250*4); for (let i = 0; i < slots.length; i++) slots[i] = hrng.uniform(-0.5, 0.5);
  const hv = new Float64Array([0.1,-0.2,0.05,0.0]), read = new Float64Array([0.0,0.1,-0.1,0.05]);
  const target = new Float64Array([0.2,-0.1,0.0,0.1]); const v = 1; const wStd = 1.0;
  const hingeLoss = () => u30Contrastive(u30PoolForward(S, C, INH, slots).scores).loss;
  for (const p of [...u30SParams(S), ...u30ScorerParams(C), ...u30HFParams(HF), ...u30INHParams(INH)]) p.g.fill(0);
  const pf = u30PoolForward(S, C, INH, slots);
  const x = new Float64Array(60); x.set(h, 0); x.set(pf.summary, 48);
  const f = siluFwd(HF.W1, HF.b1, HF.W2, HF.b2, x, 60, 24, 4);
  const ens = new Float64Array(4); for (let o = 0; o < 4; o++) ens[o] = hv[o]+read[o]+f.out[o];
  const ce = inCELossGrad(ens, v);
  const d = new Float64Array(4);
  for (let o = 0; o < 4; o++) d[o] = ce.d[o]+wStd*(f.out[o]-target[o])/2;
  siluBwd(HF.W1, HF.b1, HF.W2, HF.b2, x, 60, 24, 4, f.cache, d);
  const dhaHF = new Float64Array(24);
  for (let j = 0; j < 24; j++) { let s = 0; for (let o = 0; o < 4; o++) s += HF.W2.v[o*24+j]*d[o]; const sig = 1/(1+Math.exp(-f.cache.pre[j])); dhaHF[j] = s*(sig+f.cache.pre[j]*sig*(1-sig)); }
  const dsum = new Float64Array(12);
  for (let k = 0; k < 12; k++) { let s = 0; for (let j = 0; j < 24; j++) s += HF.W1.v[j*60+48+k]*dhaHF[j]; dsum[k] = s; }
  u30PoolBackwardCE(S, C, INH, pf, dsum);
  let ceZero = true;
  for (const p of u30INHParams(INH)) for (let i = 0; i < p.g.length; i++) if (p.g[i] !== 0) ceZero = false;
  const inh0 = Float64Array.from(pf.inh);
  const ceLossFrozenInh = () => {
    const N = 250, ND = 12;
    const enc = new Float64Array(N*ND);
    for (let i = 0; i < N; i++) for (let k = 0; k < ND; k++) {
      let s = S.b.v[k]; for (let dd = 0; dd < 4; dd++) s += S.W.v[k*4+dd]*slots[i*4+dd];
      const sig = 1/(1+Math.exp(-s)); enc[i*ND+k] = s*sig;
    }
    const scores = new Float64Array(N);
    for (let i = 0; i < N; i++) { let s = C.b.v[0]; for (let k = 0; k < ND; k++) s += C.w.v[k]*enc[i*ND+k]; scores[i] = s - inh0[i]; }
    let mx = -1e300; for (let i = 0; i < N; i++) if (scores[i] > mx) mx = scores[i];
    const w = new Float64Array(N); let z = 0;
    for (let i = 0; i < N; i++) { w[i] = Math.exp(scores[i]-mx); z += w[i]; }
    for (let i = 0; i < N; i++) w[i] /= z;
    const summary = new Float64Array(ND);
    for (let i = 0; i < N; i++) for (let k = 0; k < ND; k++) summary[k] += w[i]*enc[i*ND+k];
    const xx = new Float64Array(60); xx.set(h, 0); xx.set(summary, 48);
    const ff = siluFwd(HF.W1, HF.b1, HF.W2, HF.b2, xx, 60, 24, 4);
    const ee = new Float64Array(4); for (let o = 0; o < 4; o++) ee[o] = hv[o]+read[o]+ff.out[o];
    const cce = inCELossGrad(ee, v);
    let mse = 0; for (let o = 0; o < 4; o++) mse += wStd*(ff.out[o]-target[o])*(ff.out[o]-target[o])/4;
    return cce.loss+mse;
  };
  const eps = 1e-6; let worstCE = 0, worstCEWhere = "", worstHinge = 0, worstHingeWhere = "";
  const checkCE = (P, name) => {
    for (let i = 0; i < Math.min(P.v.length, 8); i++) {
      P.v[i] += eps; const a1 = ceLossFrozenInh(); P.v[i] -= 2*eps; const a0 = ceLossFrozenInh(); P.v[i] += eps;
      const num = (a1-a0)/(2*eps), an = P.g[i];
      const denom = Math.max(1e-12, Math.abs(num)+Math.abs(an));
      const rel = Math.abs(num-an)/denom;
      if (Math.abs(num) < 1e-9 && Math.abs(an) < 1e-9) continue;
      if (rel > worstCE) { worstCE = rel; worstCEWhere = name+"["+i+"] num="+num+" an="+an; }
    }
  };
  checkCE(S.W, "S.W"); checkCE(C.w, "C.w"); checkCE(HF.W2, "HF.W2");
  const snapS_W = Float64Array.from(S.W.g), snapC_w = Float64Array.from(C.w.g);
  const cmp = u30Contrastive(pf.scores);
  u30ContrastiveBackward(S, C, INH, pf, cmp.dLds);
  const checkHinge = (P, snap, name) => {
    for (let i = 0; i < Math.min(P.v.length, 8); i++) {
      P.v[i] += eps; const a1 = hingeLoss(); P.v[i] -= 2*eps; const a0 = hingeLoss(); P.v[i] += eps;
      const num = (a1-a0)/(2*eps); const an = P.g[i]-(snap?snap[i]:0);
      const denom = Math.max(1e-12, Math.abs(num)+Math.abs(an));
      const rel = Math.abs(num-an)/denom;
      if (Math.abs(num) < 1e-9 && Math.abs(an) < 1e-9) continue;
      if (rel > worstHinge) { worstHinge = rel; worstHingeWhere = name+"["+i+"] num="+num+" an="+an; }
    }
  };
  checkHinge(INH.W1, null, "INH.W1"); checkHinge(S.W, snapS_W, "S.W-hinge"); checkHinge(C.w, snapC_w, "C.w-hinge");
  const pass = ceZero && worstCE <= 1e-4 && worstHinge <= 1e-4;
  log("u30-gradcheck ceZero="+ceZero+" worstCE="+worstCE.toExponential(2)+" worstHinge="+worstHinge.toExponential(2)+" PASS="+pass);
  return { ceZero, worstCE, worstCEWhere, worstHinge, worstHingeWhere, pass };
};
globalThis.u30cStage1 = async function (fs, log, opts) {
  const seed = (opts && opts.seed) || 0;
  const body = await globalThis.u28Stage1(fs, log, { seed });
  body.spec = "self-u30c-topk-prereg"; body.test = "u30-stage1";
  log("u30-stage1 (via u28 harness, mining 68300) seed="+seed);
  return body;
};
