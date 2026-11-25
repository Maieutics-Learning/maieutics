// newai-selfu31d-driver.js — U31d monitor-triggered resampling-retry (eval-only; surgery on U31b stack).
// Frozen: everything (U28 S/C/INH/HF + trunk + filed U31b R2MON weights). ZERO new params, ZERO trains.
// Policy (label-free): p>=0.5 answer forced; else 3 fresh round-2 mask-sets -> majority (ties->forced).
// Modes: forced (U31b verbatim) / sel-retry / all-retry (context) / P1 permuted-p selection (non-binding).
globalThis.SelfU31dInit = async function (fs) {
  for (const p of ["src/evidence/decomp/newai-selfu31b-driver.js"]) {
    const src = await fs.readTextFile(p); (0, eval)(src + "\n//# sourceURL=" + p);
  }
  await globalThis.SelfU31bInit(fs);
  if (!globalThis.runU31bEval) throw new Error("u31d stack load failed");
};
globalThis.runU31dEval = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const force = opts && opts.force;
  const steps = 800, N = 200;
  const tag = arm+"-s"+seed+"-"+steps+"st";
  const ledgerPath = "src/evidence/decomp/d-newai-self-eval-"+tag+".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE" && !force) { log(ledgerPath+" exists, skip"); return prev; } } catch (e) {}
  await globalThis.SelfU31dInit(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const M = await loadU1W6(fs, G, seed);
  const MP = await loadU1M2nb(fs, G, seed);
  const tr28 = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-u28-comp-s"+seed+"-800st.json"));
  const trb = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-u31b-r2mon-s"+seed+"-800st.json"));
  const ev28 = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-eval-u28-comp-s"+seed+"-800st.json"));
  const evb = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-eval-u31b-r2mon-s"+seed+"-800st.json"));
  const S = u22cMakeS(G.makeRng(1)), SC = u22cMakeScorer(G.makeRng(1)), HF = u22bMakeHF(G.makeRng(1)), INH = u26MakeINH(G.makeRng(1));
  const Mo = r2bMakeMon(G.makeRng(1));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  // D1 rule (see U31b verdict): IW2 from IW2, full INH loads in eval.
  load(S.W, tr28.P.SW); load(S.b, tr28.P.Sb); load(SC.w, tr28.P.CW); load(SC.b, tr28.P.Cb);
  load(HF.W1, tr28.P.HW1); load(HF.b1, tr28.P.Hb1); load(HF.W2, tr28.P.HW2); load(HF.b2, tr28.P.Hb2);
  load(INH.W1, tr28.P.IW1); load(INH.b1, tr28.P.Ib1); load(INH.W2, tr28.P.IW2); load(INH.b2, tr28.P.Ib2);
  load(Mo.W1, trb.P.MW1); load(Mo.b1, trb.P.Mb1); load(Mo.W2, trb.P.MW2); load(Mo.b2, trb.P.Mb2);
  const minerHF = await loadU21Miner(fs, G, seed);
  let evalMasks = null; { const fr2 = G.makeRng(91000+seed); evalMasks = []; for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr2.int(10) < 5 ? 2 : 0; evalMasks.push(m); } }
  const retryRng = G.makeRng(92000+seed);
  const freshMasks = () => { const ms = []; for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = retryRng.int(10) < 5 ? 2 : 0; ms.push(m); } return ms; };
  const argmax4 = a => { let b = 0; for (let i = 0; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  const HDold = await loadU16U5head(fs, G, seed);
  const r2ans = (e, vhat, masks) => {
    const x2m = [9,9,9,9,9,9,e.qk,e.k,vhat,8];
    const fw2 = inSeqForward(M, x2m, new Float64Array(8), masks);
    return argmax4(inMeanLogits({ logitsK: fw2.logitsK }));
  };
  const U31_TRUE = [7, 41, 129, 166, 203];
  const arngH = G.makeRng(66300+seed);
  const rows = [];
  let hardFallback = 0, ri = 0;
  while (rows.length < N) {
    let kept = null;
    for (let t = 0; t < 20; t++) {
      const ep = genAdaptEpisode(arngH);
      if (u23bVhatKeep(M, MP, minerHF, evalMasks, ep).keep) { kept = ep; break; }
      if (t === 19) { kept = ep; hardFallback++; }
    }
    const sup = kept.sup.map(se => ({ qkId: se.qk, vId: 4+se.v, forceZero: false }));
    const e = kept.query;
    const fw1 = inSeqForward(M, e.x, new Float64Array(8), evalMasks);
    const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = M.E.v[e.qk*12+d];
    const fr = m2ReadForward(M, MP, Eqk, sup);
    const headOld = u16U5HeadOut(HDold, fw1.h);
    const h = Float64Array.from(fw1.h), read = Float64Array.from(fr.readLogits), hv = Float64Array.from(fw1.hvLog);
    const carry = new Float64Array(8);
    const trueVecs = u22cTrueSlots(read, hv, headOld, carry);
    const slots = u22cBuildSlots(G.makeRng(72000+seed*1000+ri), trueVecs);
    const pf = u26PoolForward(S, SC, INH, slots);
    const x = new Float64Array(56); x.set(h, 0); x.set(pf.summary, 48);
    const f = siluFwd(HF.W1, HF.b1, HF.W2, HF.b2, x, 56, 24, 4);
    const ens = new Float64Array(4); for (let o = 0; o < 4; o++) ens[o] = hv[o]+read[o]+f.out[o];
    const vhat = argmax4(ens);
    const voh = new Float64Array(4); voh[vhat] = 1;
    const x2 = new Float64Array(32);
    x2.set(pf.summary, 0); x2.set(hv, 8); x2.set(read, 12); x2.set(voh, 16); x2.set(Eqk, 20);
    const p = r2bMonForward(Mo, x2).p;
    const ansF = r2ans(e, vhat, evalMasks);
    const okF = ansF === e.y ? 1 : 0;
    const att = [r2ans(e, vhat, freshMasks()), r2ans(e, vhat, freshMasks()), r2ans(e, vhat, freshMasks())];
    let selHit = true;
    for (const idx of U31_TRUE) if (pf.top2[0] === idx || pf.top2[1] === idx) selHit = false;
    rows.push({ e, vhat, p, ansF, okF, att, x2, selMiss: !selHit });
    ri++;
  }
  const maj = (att, fallback) => {
    const counts = [0,0,0,0]; for (const a of att) counts[a]++;
    let best = -1, bestC = -1, tied = false;
    for (let o = 0; o < 4; o++) { if (counts[o] > bestC) { bestC = counts[o]; best = o; tied = false; } else if (counts[o] === bestC) tied = true; }
    return { ans: tied ? fallback : best, tied };
  };
  let fCorrect = 0, selCorrect = 0, allCorrect = 0, selExtra = 0, ties = 0, retried = 0;
  let strictCorrect = 0, strictN = 0, forcedOnStrict = 0;
  let hardHit = 0;
  for (const r of rows) {
    fCorrect += r.okF;
    if (r.selMiss) hardHit++;
    const mAll = maj(r.att, r.ansF);
    allCorrect += (mAll.ans === r.e.y) ? 1 : 0;
    if (r.p < 0.5) {
      retried++;
      selExtra += 3;
      const m = maj(r.att, r.ansF);
      if (m.tied) ties++;
      else { strictN++; if (m.ans === r.e.y) strictCorrect++; forcedOnStrict += r.okF; }
      selCorrect += (m.ans === r.e.y) ? 1 : 0;
    } else selCorrect += r.okF;
  }
  // P1: permuted-p selection over stored rows (eval-only, non-binding)
  const SHIFT = Math.floor(N/2);
  let p1Correct = 0;
  for (let i = 0; i < N; i++) {
    const r = rows[i];
    const ps = r2bMonForward(Mo, rows[(i+SHIFT)%N].x2).p;
    if (ps < 0.5) { const m = maj(r.att, r.ansF); p1Correct += (m.ans === r.e.y) ? 1 : 0; }
    else p1Correct += r.okF;
  }
  const yF = fCorrect/N, ySel = selCorrect/N, yAll = allCorrect/N, yP1 = p1Correct/N;
  const body = { spec: "self-u31d-resample-prereg", track: "U31d", arm, seed, steps, verdict: "COMPLETE", n: N, gatedEval: true,
    miningRule: "vhatM!=e.v AND oracleY correct (argmax-only, U23b D1); U31b-identical 66300 streams",
    hardSelectHit: +(hardHit/N).toFixed(4), wallRefU28: ev28.hardSelectHit,
    wallExact: +((hardHit/N).toFixed(4)) === ev28.hardSelectHit,
    hardAdaptY_forced: +yF.toFixed(4), refU31bForced: evb.hardAdaptY_forced,
    determExact: +yF.toFixed(4) === evb.hardAdaptY_forced,
    hardAdaptY_sel: +ySel.toFixed(4), liftSel: +((ySel-yF)).toFixed(4),
    hardAdaptY_all: +yAll.toFixed(4), gatevalGap: +((ySel-yAll)).toFixed(4),
    hardAdaptY_p1: +yP1.toFixed(4), liftP1: +((yP1-yF)).toFixed(4),
    retried, tieRate: +(ties/Math.max(1, retried)).toFixed(4),
    strictAcc: +(strictCorrect/Math.max(1, strictN)).toFixed(4), strictN,
    forcedOnStrict: +(forcedOnStrict/Math.max(1, strictN)).toFixed(4),
    costSel: +(selExtra/N).toFixed(4), costAll: 3.0, hardFallback,
    oodNote: "hard-rows only; retrieval untouched",
    frozenDriftTrain: 0, mining: evb.mining };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("u31d-eval "+tag+" sel="+body.hardSelectHit+" determ="+body.determExact+" fY="+body.hardAdaptY_forced+" selY="+body.hardAdaptY_sel+" lift="+body.liftSel+" allY="+body.hardAdaptY_all+" p1="+body.hardAdaptY_p1);
  return body;
};
