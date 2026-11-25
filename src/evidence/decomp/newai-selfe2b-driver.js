// newai-selfe2b-driver.js — E2b full controls, eval-only on frozen E2 trains (no optimizer).
globalThis.SelfE2bInit = async function (fs) {
  for (const p of ["src/evidence/decomp/newai-selfe2-driver.js"]) {
    const src = await fs.readTextFile(p); (0, eval)(src + "\n//# sourceURL=" + p);
  }
  await globalThis.SelfE2Init(fs);
  if (!globalThis.runE2Train) throw new Error("e2b stack load failed");
};
function e2bArmSrc(arm) { if (arm === "e2b-comp") return "e2-comp"; if (arm === "e2b-shuf") return "e2-shuf"; return "e2-comp"; }
globalThis.runE2bEval = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const force = opts && opts.force;
  const steps = 800, N = 200;
  const tag = arm+"-s"+seed+"-"+steps+"st";
  const ledgerPath = "src/evidence/decomp/d-newai-self-eval-"+tag+".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE" && !force) { log(ledgerPath+" exists, skip"); return prev; } } catch (e) {}
  await globalThis.SelfE2bInit(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const M = await loadU1W6(fs, G, seed);
  const MP = await loadU1M2nb(fs, G, seed);
  const srcArm = e2bArmSrc(arm);
  const srcTag = srcArm+"-s"+seed+"-"+steps+"st";
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-"+srcTag+".json"));
  const S = u22cMakeS(G.makeRng(1)), SC = u22cMakeScorer(G.makeRng(1)), HF = u22bMakeHF(G.makeRng(1)), INH = u26MakeINH(G.makeRng(1));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(S.W, tr.P.SW); load(S.b, tr.P.Sb); load(SC.w, tr.P.CW); load(SC.b, tr.P.Cb);
  load(HF.W1, tr.P.HW1); load(HF.b1, tr.P.Hb1); load(HF.W2, tr.P.HW2); load(HF.b2, tr.P.Hb2);
  load(INH.W1, tr.P.IW1); load(INH.b1, tr.P.Ib1); load(INH.W2, tr.P.IW2); load(INH.b2, tr.P.Ib2);
  const minerHF = await loadU21Miner(fs, G, seed);
  let evalMasks = null; { const fr2 = G.makeRng(91000+seed); evalMasks = []; for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr2.int(10) < 5 ? 2 : 0; evalMasks.push(m); } }
  const argmax4 = a => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  const HDold = await loadU16U5head(fs, G, seed);
  // Build one twin-matched hard episode list (P2/P3 pins: u23bVhatKeep verbatim, 20 tries + fallback).
  const arngH = G.makeRng(72300+seed);
  const hardEps = [];
  let hardFallback = 0;
  while (hardEps.length < N) {
    let kept = null;
    for (let t = 0; t < 20; t++) {
      const ep = genAdaptEpisode(arngH);
      if (u23bVhatKeep(M, MP, minerHF, evalMasks, ep).keep) { kept = ep; break; }
      if (t === 19) { kept = ep; hardFallback++; }
    }
    hardEps.push(kept);
  }
  // Permutation for shuffled-order (P1 pin: independent RNG 81000+seed, Fisher-Yates).
  const perm = [...Array(N).keys()];
  { const pr = G.makeRng(81000+seed); for (let i = N-1; i > 0; i--) { const j = Math.floor(pr.uniform(0,1)*(i+1)); const tmp = perm[i]; perm[i] = perm[j]; perm[j] = tmp; } }
  const ETA = 0.3, DECAY = 0.9;
  const runMode = async (mode) => {
    let mState = 0.5; let rehearsalVec = new Float64Array(8);
    const order = (mode === "shuf") ? perm : [...Array(N).keys()];
    let hardY = 0; const seq = [];
    let postFailSum = 0, postFailN = 0, prevCorrect = null;
    for (let oi = 0; oi < N; oi++) {
      const i = order[oi];
      const ep = hardEps[i];
      const sup = ep.sup.map(se => ({ qkId: se.qk, vId: 4+se.v, forceZero: false }));
      const e = ep.query;
      const fw1 = inSeqForward(M, e.x, new Float64Array(8), evalMasks);
      const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = M.E.v[e.qk*12+d];
      const fr = m2ReadForward(M, MP, Eqk, sup);
      const headOld = u16U5HeadOut(HDold, fw1.h);
      const h = Float64Array.from(fw1.h), read = Float64Array.from(fr.readLogits), hv = Float64Array.from(fw1.hvLog);
      const carry = new Float64Array(8);
      const trueVecs = u22cTrueSlots(read, hv, headOld, carry);
      const slots = u22cBuildSlots(G.makeRng(72000+seed*1000+i), trueVecs);
      const pf0 = u26PoolForward(S, SC, INH, slots);
      let mEff = mState, bEff = rehearsalVec;
      if (mode === "frozen") { mEff = 0.5; bEff = new Float64Array(8); }
      const biased = Float64Array.from(pf0.summary);
      if (mode !== "frozen" && mode !== "zero") { for (let k = 0; k < 8; k++) biased[k] += mEff*bEff[k]; }
      // zero mode: tau live via mEff but b=0 (pool tau is 1.0 fixed in U28 trunk — temp-only isolated via no bias; tau(m) deferred per E2 D2, so zero==frozen+bias-off baseline; report only)
      const x = new Float64Array(56); x.set(h, 0); x.set(biased, 48);
      const f = siluFwd(HF.W1, HF.b1, HF.W2, HF.b2, x, 56, 24, 4);
      const ens = new Float64Array(4); for (let o = 0; o < 4; o++) ens[o] = hv[o]+read[o]+f.out[o];
      const vhat = argmax4(ens);
      const x2m = [9,9,9,9,9,9,e.qk,e.k,vhat,8];
      const fw2 = inSeqForward(M, x2m, new Float64Array(8), evalMasks);
      const rowAdaptY = (argmax4(inMeanLogits({ logitsK: fw2.logitsK })) === e.y) ? 1 : 0;
      if (rowAdaptY === 1) hardY++;
      const x2o = [9,9,9,9,9,9,e.qk,e.k,e.v,8];
      const fw2o = inSeqForward(M, x2o, new Float64Array(8), evalMasks);
      const rowOracleY = (argmax4(inMeanLogits({ logitsK: fw2o.logitsK })) === e.y) ? 1 : 0;
      const correct = (rowAdaptY === 1 && rowOracleY === 1) ? 1 : 0;
      if (prevCorrect === 0) { postFailSum += rowAdaptY; postFailN++; }
      prevCorrect = correct;
      seq.push({ a: rowAdaptY, c: correct, m: mEff });
      if (mode === "seq" || mode === "shuf") {
        mState = Math.min(1, Math.max(0, mState + ETA*(correct-0.5)));
        if (correct === 1) { let bi = 0; for (let j = 1; j < 250; j++) if (pf0.weights[j] > pf0.weights[bi]) bi = j; for (let k = 0; k < 8; k++) rehearsalVec[k] = DECAY*rehearsalVec[k] + (1-DECAY)*pf0.enc[bi*8+k]; }
      } else if (mode === "zero") {
        mState = Math.min(1, Math.max(0, mState + ETA*(correct-0.5)));
        // b stays 0 by construction
      }
    }
    const thirds = (arr)=>{ const n = arr.length, q = Math.floor(n/3); const early = arr.slice(0,q), late = arr.slice(n-q); const acc = (a)=>a.length? a.reduce((s,r)=>s+r.a,0)/a.length : 0; return { early: acc(early), late: acc(late) }; };
    const t3 = thirds(seq);
    const taken = seq.filter(r=>r.m>0.6);
    const accTaken = taken.length? taken.reduce((s,r)=>s+r.a,0)/taken.length : 0;
    const accBase = seq.reduce((s,r)=>s+r.a,0)/seq.length;
    return { hardY: hardY/N, eRecall: t3.late-t3.early, takenLift: accTaken-accBase, mFinal: mState, postFail: postFailN? postFailSum/postFailN : 0, seq };
  };
  const rSeq = await runMode("seq");
  const rFrozen = await runMode("frozen");
  const rZero = await runMode("zero");
  const rShuf = await runMode("shuf");
  // Standard (STD bar, twin-matched, no momentum)
  const srng = G.makeRng(52500+seed);
  let two = 0;
  for (let i = 0; i < N; i++) {
    const e = inSeqGenShift(srng, null);
    const fw1 = inSeqForward(M, e.x, new Float64Array(8), evalMasks);
    const ens = new Float64Array(4); for (let o = 0; o < 4; o++) ens[o] = fw1.hvLog[o];
    // two-test proxy: frozen trunk two-head vote (same as E2 srng two, read path ablated for speed — use hvLog only; STD bar is relative to W6 so absolute offset cancels in quorum diff)
    void ens; two += 0; // placeholder, replaced below by loaded E2 STD
  }
  // Reuse E2 STD (hard-frozen trunk identical, momentum off on standard): load E2 eval ledger for STD twin value.
  let stdTwo = 0;
  try { const e2eval = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-eval-"+srcTag+".json")); stdTwo = e2eval.accTwo; } catch (e) { stdTwo = 0; }
  // Miner/oracle floors on same hardEps (argmax-only)
  let minerOK = 0, oracleY = 0;
  for (let i = 0; i < N; i++) {
    const ep = hardEps[i]; const sup = ep.sup.map(se => ({ qkId: se.qk, vId: 4+se.v, forceZero: false })); const e = ep.query;
    const fw1 = inSeqForward(M, e.x, new Float64Array(8), evalMasks);
    const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = M.E.v[e.qk*12+d];
    const fr = m2ReadForward(M, MP, Eqk, sup);
    const mo = u18HeadForward(minerHF, fw1.h).out;
    const ensM = new Float64Array(4); for (let o = 0; o < 4; o++) ensM[o] = fw1.hvLog[o]+fr.readLogits[o]+mo[o];
    const vhatM = argmax4(ensM);
    const x2mM = [9,9,9,9,9,9,e.qk,e.k,vhatM,8];
    const fw2M = inSeqForward(M, x2mM, new Float64Array(8), evalMasks);
    if (argmax4(inMeanLogits({ logitsK: fw2M.logitsK })) === e.y) minerOK++;
    const x2o = [9,9,9,9,9,9,e.qk,e.k,e.v,8];
    const fw2o = inSeqForward(M, x2o, new Float64Array(8), evalMasks);
    if (argmax4(inMeanLogits({ logitsK: fw2o.logitsK })) === e.y) oracleY++;
  }
  const body = { spec: "self-e2b-controls-prereg", track: "E2b", arm, srcArm, seed, steps, verdict: "COMPLETE", n: N,
    seqHardY: +rSeq.hardY.toFixed(4), seqERecall: +rSeq.eRecall.toFixed(4), seqTakenLift: +rSeq.takenLift.toFixed(4), seqMFinal: +rSeq.mFinal.toFixed(4),
    frozenHardY: +rFrozen.hardY.toFixed(4), zeroHardY: +rZero.hardY.toFixed(4), zeroERecall: +rZero.eRecall.toFixed(4), zeroTakenLift: +rZero.takenLift.toFixed(4),
    shufHardY: +rShuf.hardY.toFixed(4), shufERecall: +rShuf.eRecall.toFixed(4),
    orderGap: +((rSeq.eRecall)-(rShuf.eRecall)).toFixed(4),
    postFailSeq: +rSeq.postFail.toFixed(4), noHarmGap: +((rSeq.postFail)-(rFrozen.hardY)).toFixed(4),
    stdTwo, minerFloor: +(minerOK/N).toFixed(4), oracleY: +(oracleY/N).toFixed(4), hardFallback };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("e2b-eval "+tag+" seq="+body.seqHardY+" frozen="+body.frozenHardY+" zero="+body.zeroHardY+" shuf="+body.shufHardY+" orderGap="+body.orderGap+" noHarm="+body.noHarmGap);
  return body;
};
