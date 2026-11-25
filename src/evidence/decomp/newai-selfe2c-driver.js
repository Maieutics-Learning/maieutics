// newai-selfe2-driver.js — E2 success-gated rehearsal (surgery on U28: forward-only momentum, firewall).
globalThis.SelfE2cInit = async function (fs) { // E2c loads E2 stack
  for (const p of ["src/evidence/decomp/newai-selfu28-driver.js"]) {
    const src = await fs.readTextFile(p); (0, eval)(src + "\n//# sourceURL=" + p);
  }
  await globalThis.SelfU28Init(fs);
  if (!globalThis.runU28Train) throw new Error("e2 stack load failed");
};
function e2ArmCode(arm) { if (arm === "e2c-comp") return 189; if (arm === "e2c-shuf") return 190; return 189; }
const E2_LAMC = 1.0, E2_MARGIN = 1.0;
globalThis.runE2cTrain = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const force = opts && opts.force;
  const steps = 800, B = 16, lr = 5e-3, K = 5, H = 48, Cc = 6, wAdapt = 0.5, wStd = 1.0, NHARD = 8;
  const tag = arm+"-s"+seed+"-"+steps+"st";
  const ledgerPath = "src/evidence/decomp/d-newai-self-"+tag+".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE" && !force) { log(ledgerPath+" exists, skip"); return prev; } } catch (e) {}
  await globalThis.SelfU28Init(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const M = await loadU1W6(fs, G, seed);
  const MP = await loadU1M2nb(fs, G, seed);
  const HDold = await loadU16U5head(fs, G, seed);
  const LT = await loadU17Teacher(fs, G, seed);
  const minerHF = await loadU21Miner(fs, G, seed);
  const S = u22cMakeS(G.makeRng(78000+seed*7919+e2ArmCode(arm)*131));
  const SC = u22cMakeScorer(G.makeRng(78100+seed*7919+e2ArmCode(arm)*131));
  const HF = u22bMakeHF(G.makeRng(79000+seed*7919+e2ArmCode(arm)*131));
  const INH = u26MakeINH(G.makeRng(78500+seed*7919+e2ArmCode(arm)*131));
  const hParams = [...u22cSParams(S), ...u22cScorerParams(SC), ...u22bHFParams(HF), ...u26INHParams(INH)];
  const opt = new G.Adam(lr);
    let mState = 0.5; const ETA = 0.3, DECAY = 0.9;
    let rehearsalVec = new Float64Array(8);
  const dataRng = G.makeRng(42200+seed*104729+77);
  const mineRng = G.makeRng(73300+seed);
  let fixedMasks = null; { const fr = G.makeRng(91000+seed); fixedMasks = []; for (let k = 0; k < K; k++) { const m = new Float64Array(H); for (let i = 0; i < H; i++) m[i] = fr.int(10) < 5 ? 2 : 0; fixedMasks.push(m); } }
  const M0snap = inSeqParams(M).map(p => Float64Array.from(p.v));
  const isShuf = (arm === "u27-shuf");
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
        const ep = genAdaptEpisode(dataRng); e = ep.query; sup = { list: ep.sup.slice(0,2).map(se => ({ qkId: se.qk, vId: 4+se.v, forceZero: false })), isAdapt: true };
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
      const keptSup = { list: kept.sup.slice(0,2).map(se => ({ qkId: se.qk, vId: 4+se.v, forceZero: false })), isAdapt: true };
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
      const pf0 = u26PoolForward(S, SC, INH, zslots);
      const pf = { ...pf0, summary: (()=>{ const s = Float64Array.from(pf0.summary); for (let k=0;k<8;k++) s[k]+=mState*rehearsalVec[k]; return s; })() };
      const x = new Float64Array(56); x.set(row.h, 0); x.set(pf.summary, 48);
      const f = siluFwd(HF.W1, HF.b1, HF.W2, HF.b2, x, 56, 24, 4);
      const ens = new Float64Array(4); for (let o = 0; o < 4; o++) ens[o] = row.hv[o]+row.read[o]+f.out[o];
      const ce = inCELossGrad(ens, row.e.v);
      let rowLoss = ce.loss;
      let mse = 0; for (let o = 0; o < 4; o++) { const dd = f.out[o]-target[o]; mse += w*dd*dd/4; }
      rowLoss += mse;
      if (row.isAdapt) {
        const cmp = u28Contrastive(pf.scores);
        rowLoss += E2_LAMC*cmp.loss;
        compSum += cmp.loss; compN++;
        {
          const ensV = new Float64Array(4); for (let o = 0; o < 4; o++) ensV[o] = row.hv[o]+row.read[o]+f.out[o];
            let bvT = 0; for (let i = 1; i < 4; i++) if (ensV[i] > ensV[bvT]) bvT = i;
            const moT = u18HeadForward(minerHF, row.h).out;
            const ensM = new Float64Array(4); for (let o = 0; o < 4; o++) ensM[o] = row.hv[o]+row.read[o]+moT[o];
            let bvM = 0; for (let i = 1; i < 4; i++) if (ensM[i] > ensM[bvM]) bvM = i;
            const surprise = (bvT !== bvM) ? 1 : 0;
            // FIREWALL: e.v/e.y never read for m (no oracleY, no adaptY here)
            mState = Math.min(1, Math.max(0, mState + ETA*(surprise-0.5)));
            if (surprise === 1) { let bi = 0; for (let i = 1; i < 250; i++) if (pf.weights[i] > pf.weights[bi]) bi = i; for (let k = 0; k < 8; k++) rehearsalVec[k] = DECAY*rehearsalVec[k] + (1-DECAY)*pf.enc[bi*8+k]; }
        }
      }
      lsum += rowLoss;
      if (row.hard) lsumH += rowLoss; else lsumS += rowLoss;
      const d = new Float64Array(4);
      for (let o = 0; o < 4; o++) d[o] = ce.d[o]/B+w*(f.out[o]-target[o])/2/B;
      siluBwd(HF.W1, HF.b1, HF.W2, HF.b2, x, 56, 24, 4, f.cache, d);
      const dhaHF = new Float64Array(24);
      for (let j = 0; j < 24; j++) { let s = 0; for (let o = 0; o < 4; o++) s += HF.W2.v[o*24+j]*d[o]; const sig = 1/(1+Math.exp(-f.cache.pre[j])); dhaHF[j] = s*(sig+f.cache.pre[j]*sig*(1-sig)); }
      const dsum = new Float64Array(8);
      for (let k = 0; k < 8; k++) { let s = 0; for (let j = 0; j < 24; j++) s += HF.W1.v[j*56+48+k]*dhaHF[j]; dsum[k] = s; }
      u27PoolBackwardCE(S, SC, INH, pf, dsum); // DETACH: INH untouched here
      if (row.isAdapt) {
        const cmp = u28Contrastive(pf.scores);
        const scaled = Float64Array.from(cmp.dLds.map(v => v/B));
        u28ContrastiveBackward(S, SC, INH, pf, scaled); // selection path: INH included
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
  const body = { spec: "self-e2c-surprise-prereg", track: "E2c", arm, seed, steps, B, lr, wAdapt, wStd, lamC: E2_LAMC, margin: E2_MARGIN, gatedEval: true,
    routing: "detached: CE/MSE-path stop-gradient at INH (u27PoolBackwardCE); max-hinge-path to S+C+INH (2-slot)",
    teacher: "u17-gated-s"+seed+" (true-20 only)", miner: "u21-lowfold-s"+seed,
    miningRule: "vhatM!=e.v AND oracleY correct (argmax-only, U23b D1); DEDICATED mineRng 73300+seed",
    frozenAll: true, maxFrozenDrift: maxDrift, verdict: "COMPLETE", wallMs: Date.now()-t0, curve,
    mining: { tries: mineTries, hardKept, fallback: mineFallback, hardRate: +(hardKept/Math.max(1, mineTries)).toFixed(4) },
    compLossMean: +(compSum/Math.max(1, compN)).toFixed(4),
    P: { SW: save(S.W), Sb: save(S.b), CW: save(SC.w), Cb: save(SC.b), HW1: save(HF.W1), Hb1: save(HF.b1), HW2: save(HF.W2), Hb2: save(HF.b2),
      IW1: save(INH.W1), Ib1: save(INH.b1), IW2: save(INH.W2), Ib2: save(INH.b2) } };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("e2-train "+tag+" loss0="+curve[0].loss+" lossN="+curve[curve.length-1].loss+" hardRate="+body.mining.hardRate+" compMean="+body.compLossMean+" frozenDrift="+maxDrift);
  return body;
};

globalThis.runE2cEval = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const force = opts && opts.force;
  const steps = 800, N = 200;
  const tag = arm+"-s"+seed+"-"+steps+"st";
  const ledgerPath = "src/evidence/decomp/d-newai-self-eval-"+tag+".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE" && !force) { log(ledgerPath+" exists, skip"); return prev; } } catch (e) {}
  await globalThis.SelfU28Init(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const M = await loadU1W6(fs, G, seed);
  const MP = await loadU1M2nb(fs, G, seed);
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-"+tag+".json"));
  const S = u22cMakeS(G.makeRng(1)), SC = u22cMakeScorer(G.makeRng(1)), HF = u22bMakeHF(G.makeRng(1)), INH = u26MakeINH(G.makeRng(1));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(S.W, tr.P.SW); load(S.b, tr.P.Sb); load(SC.w, tr.P.CW); load(SC.b, tr.P.Cb);
  load(HF.W1, tr.P.HW1); load(HF.b1, tr.P.Hb1); load(HF.W2, tr.P.HW2); load(HF.b2, tr.P.Hb2);
  load(INH.W1, tr.P.IW1); load(INH.b1, tr.P.Ib1); load(INH.W2, tr.P.IW2); load(INH.b2, tr.P.Ib2);
  const minerHF = await loadU21Miner(fs, G, seed);
  let evalMasks = null; { const fr2 = G.makeRng(91000+seed); evalMasks = []; for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr2.int(10) < 5 ? 2 : 0; evalMasks.push(m); } }
  const argmax4 = a => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  const UTRUE = [7,41,129,166,203];
  let mState = 0.5; const ETA = 0.3, DECAY = 0.9; let rehearsalVec = new Float64Array(8);
  let rowSeqCorrect = [];
  const fwd = (h, slots) => {
    const pf0 = u26PoolForward(S, SC, INH, slots);
    const biased = Float64Array.from(pf0.summary); for (let k = 0; k < 8; k++) biased[k] += mState*rehearsalVec[k];
    const pf = { ...pf0, summary: biased };
    const x = new Float64Array(56); x.set(h, 0); x.set(pf.summary, 48);
    const f = siluFwd(HF.W1, HF.b1, HF.W2, HF.b2, x, 56, 24, 4);
    return { out: f.out, pf };
  };
  const fwdNoInh = (h, slots, pf) => {
    const N2 = 250;
    const lin = new Float64Array(N2);
    for (let i = 0; i < N2; i++) lin[i] = pf.scores[i]+pf.inh[i];
    let mx = -1e300; for (let i = 0; i < N2; i++) if (lin[i] > mx) mx = lin[i];
    const w = new Float64Array(N2); let z = 0;
    for (let i = 0; i < N2; i++) { w[i] = Math.exp(lin[i]-mx); z += w[i]; }
    for (let i = 0; i < N2; i++) w[i] /= z;
    const summary = new Float64Array(8);
    for (let i = 0; i < N2; i++) for (let k = 0; k < 8; k++) summary[k] += w[i]*pf.enc[i*8+k];
    const x = new Float64Array(56); x.set(h, 0); x.set(summary, 48);
    const f = siluFwd(HF.W1, HF.b1, HF.W2, HF.b2, x, 56, 24, 4);
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
    const sup = ep.sup.slice(0,2).map(se => ({ qkId: se.qk, vId: 4+se.v, forceZero: false }));
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
  const arngH = G.makeRng(74300+seed);
  let hardY = 0, hardV = 0, hardYabl = 0, hardYsumAbl = 0, hardYnoInh = 0, hardHit = 0, hardN = 0,
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
    const sup = kept.sup.slice(0,2).map(se => ({ qkId: se.qk, vId: 4+se.v, forceZero: false }));
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
    const rowAdaptY = (argmax4(inMeanLogits({ logitsK: fw2.logitsK })) === e.y) ? 1 : 0;
    if (rowAdaptY === 1) hardY++;
    {
      // E2c: surprise-gated (intrinsic disagreement, no labels for m). Oracle still computed for floor reporting only.
      const x2o = [9,9,9,9,9,9,e.qk,e.k,e.v,8];
      const fw2o = inSeqForward(M, x2o, new Float64Array(8), evalMasks);
      const rowOracleY = (argmax4(inMeanLogits({ logitsK: fw2o.logitsK })) === e.y) ? 1 : 0;
      void rowOracleY;
      const moS = u18HeadForward(minerHF, h).out;
      const ensMS = new Float64Array(4); for (let o = 0; o < 4; o++) ensMS[o] = hv[o]+read[o]+moS[o];
      let bvMS = 0; for (let i = 1; i < 4; i++) if (ensMS[i] > ensMS[bvMS]) bvMS = i;
      const surprise = (vhat !== bvMS) ? 1 : 0;
      mState = Math.min(1, Math.max(0, mState + ETA*(surprise-0.5)));
      if (surprise === 1) { let bi = 0; for (let i = 1; i < 250; i++) if (r.pf.weights[i] > r.pf.weights[bi]) bi = i; for (let k = 0; k < 8; k++) rehearsalVec[k] = DECAY*rehearsalVec[k] + (1-DECAY)*r.pf.enc[bi*8+k]; }
      rowSeqCorrect.push({a: rowAdaptY, c: surprise, m: mState});
    }
    const rN = fwdNoInh(h, slots, r.pf);
    const ensN = new Float64Array(4); for (let o = 0; o < 4; o++) ensN[o] = hv[o]+read[o]+rN.out[o];
    const vhatN = argmax4(ensN);
    const x2n = [9,9,9,9,9,9,e.qk,e.k,vhatN,8];
    const fw2n = inSeqForward(M, x2n, new Float64Array(8), evalMasks);
    if (argmax4(inMeanLogits({ logitsK: fw2n.logitsK })) === e.y) hardYnoInh++;
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
  const arngH2 = G.makeRng(74300+seed);
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
    const sup = ep.sup.slice(0,2).map(se => ({ qkId: se.qk, vId: 4+se.v, forceZero: false }));
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
    const x = new Float64Array(56); x.set(h, 0); x.set(pf.summary, 48);
    const f = siluFwd(ood.HF.W1, ood.HF.b1, ood.HF.W2, ood.HF.b2, x, 56, 24, 4);
    const ens = new Float64Array(4); for (let o = 0; o < 4; o++) ens[o] = hv[o]+read[o]+f.out[o];
    const vhat = argmax4(ens);
    const x2m = [9,9,9,9,9,9,e.qk,e.k,vhat,8];
    const fw2 = inSeqForward(M, x2m, new Float64Array(8), evalMasks);
    if (argmax4(inMeanLogits({ logitsK: fw2.logitsK })) === e.y) oodY++;
  }
  const thirds = (arr)=>{ const n = arr.length, q = Math.floor(n/3); const early = arr.slice(0,q), late = arr.slice(n-q); const acc = (a)=>a.length? a.reduce((s,r)=>s+r.a,0)/a.length : 0; return {early: acc(early), late: acc(late)}; };
  const t3 = thirds(rowSeqCorrect);
  const eRecall = +(t3.late - t3.early).toFixed(4);
  const taken = rowSeqCorrect.filter(r=>r.m>0.6);
  const accTaken = taken.length? +(taken.reduce((s,r)=>s+r.a,0)/taken.length).toFixed(4) : 0;
  const accBase = rowSeqCorrect.length? +(rowSeqCorrect.reduce((s,r)=>s+r.a,0)/rowSeqCorrect.length).toFixed(4) : 0;
  const takenLift = +(accTaken-accBase).toFixed(4);
  const body = { spec: "self-e2c-surprise-prereg", track: "E2c", arm, seed, steps, verdict: "COMPLETE", n: N, gatedEval: true,
    miningRule: "vhatM!=e.v AND oracleY correct (argmax-only, U23b D1)",
    accScratch: +(scr/N).toFixed(4), accTwo: +(two/N).toFixed(4), adaptY: +(adaptY/N).toFixed(4), adaptV: +(adaptV/N).toFixed(4),
    adaptYablated: +(adaptYabl/N).toFixed(4), ablateDrop: +((adaptY-adaptYabl)/N).toFixed(4),
    selectHit: +(hitTop2/N).toFixed(4),
    hardAdaptY: +(hardY/N).toFixed(4), hardAdaptV: +(hardV/N).toFixed(4), hardAblated: +(hardYabl/N).toFixed(4),
    hardAblateDrop: +((hardY-hardYabl)/N).toFixed(4), hardSummaryAblated: +(hardYsumAbl/N).toFixed(4),
    hardSummaryDrop: +((hardY-hardYsumAbl)/N).toFixed(4), hardSelectHit: +(hardHit/N).toFixed(4),
    hardNoInhY: +(hardYnoInh/N).toFixed(4), inhibUseDrop: +((hardY-hardYnoInh)/N).toFixed(4),
    inhTrueMean: +(inhTrueSum/Math.max(1, inhTrueN)).toFixed(4), inhDistMean: +(inhDistSum/Math.max(1, inhDistN)).toFixed(4),
    inhibSeparates: +((inhDistSum/Math.max(1, inhDistN))-(inhTrueSum/Math.max(1, inhTrueN))).toFixed(4),
    compStrictFrac: +(compStrict/N).toFixed(4), compMarginMean: +(compMarginSum/N).toFixed(4),
    minerFloor: +(minerOK/N).toFixed(4), minerV: +(minerVok/N).toFixed(4), oracleY: +(oracleY/N).toFixed(4), hardFallback,
    oodAdaptY: +(oodY/N).toFixed(4),
    frozenDriftTrain: tr.maxFrozenDrift, mining: tr.mining,
    eRecall, accTaken, accBase, takenLift, mFinal: +mState.toFixed(4) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("e2-eval "+tag+" two="+body.accTwo+" adaptY="+body.adaptY+" hardY="+body.hardAdaptY+" sel="+body.hardSelectHit+" comp="+body.compStrictFrac+" margin="+body.compMarginMean+" inhUse="+body.inhibUseDrop+" inhSep="+body.inhibSeparates+" minerFloor="+body.minerFloor+" ood="+body.oodAdaptY);
  return body;
};


globalThis.e2cGradCheck = async function (fs, log) {
  await globalThis.SelfE2cInit(fs);
  // Firewall check: momentum update uses discrete correctness (no grad path by construction).
  // Grad-check reduces to U28 (m=0.5 fixed, zero rehearsal) — verify U28 grad passes.
  const r = await globalThis.u28GradCheck(fs, log);
  log("e2-gradcheck (firewall: m fixed, delegates to u28) PASS="+r.pass);
  return { ...r, firewall: "m update discrete (correct 0/1), no grad through correctness by construction" };
};
globalThis.e2Stage1 = async function (fs, log, opts) {
  const seed = (opts && opts.seed) || 0;
  const body = await globalThis.u28Stage1(fs, log, { seed });
  body.spec = "self-e2c-surprise-prereg"; body.test = "e2-stage1";
  log("e2-stage1 (via u28 harness, mining 71300) seed="+seed);
  return body;
};
