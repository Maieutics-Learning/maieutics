// U23b after-series (i): kept-vs-fallback split on the vhat-hard held-out (analysis-only, no training).
// Replays the deterministic 62300+seed mining to recover the kept/fallback split, then scores each
// subset with the TRAINED u23b-hard head + frozen U22c-scale OOD + miner + oracle probes.
// Question: what is the pure vhat-hard effect size once 64-88% fallback dilution is removed?
const U23BSPLIT_TRUE_SLOTS = [7,41,129,166,203];
globalThis.runU23bSplit = async function (fs, log, opts) {
  const { seed } = opts;
  const force = opts && opts.force;
  const ledgerPath = "src/evidence/decomp/d-newai-self-u23b-split-s"+seed+".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE" && !force) { log(ledgerPath+" exists, skip"); return prev; } } catch (e) {}
  await globalThis.SelfU23bInit(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const M = await loadU1W6(fs, G, seed);
  const MP = await loadU1M2nb(fs, G, seed);
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-u23b-hard-s"+seed+"-800st.json"));
  const S = u22cMakeS(G.makeRng(1)), SC = u22cMakeScorer(G.makeRng(1)), HF = u22bMakeHF(G.makeRng(1));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(S.W, tr.P.SW); load(S.b, tr.P.Sb); load(SC.w, tr.P.CW); load(SC.b, tr.P.Cb);
  load(HF.W1, tr.P.HW1); load(HF.b1, tr.P.Hb1); load(HF.W2, tr.P.HW2); load(HF.b2, tr.P.Hb2);
  const minerHF = await loadU21Miner(fs, G, seed);
  const ood = await loadU22cScale(fs, G, seed);
  let evalMasks = null; { const fr2 = G.makeRng(91000+seed); evalMasks = []; for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr2.int(10) < 5 ? 2 : 0; evalMasks.push(m); } }
  const argmax4 = a => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  const HDold = await loadU16U5head(fs, G, seed);
  const scoreHead = (S_, SC_, HF_, h, slots) => {
    const pf = u22cPoolForward(S_, SC_, slots);
    const x = new Float64Array(56); x.set(h, 0); x.set(pf.summary, 48);
    return siluFwd(HF_.W1, HF_.b1, HF_.W2, HF_.b2, x, 56, 24, 4).out;
  };
  const arngH = G.makeRng(62300+seed);
  const N = 200;
  const kept = [], fb = [];
  while (kept.length + fb.length < N) {
    let ep = null, kf = false;
    for (let t = 0; t < 20; t++) {
      const c = genAdaptEpisode(arngH);
      if (u23bVhatKeep(M, MP, minerHF, evalMasks, c).keep) { ep = c; kf = true; break; }
      if (t === 19) ep = c;
    }
    (kf ? kept : fb).push(ep);
  }
  const scoreSubset = eps => {
    let hardY = 0, hardV = 0, minerOK = 0, minerVok = 0, oracleY = 0, oodY = 0, hardHit = 0;
    for (let i = 0; i < eps.length; i++) {
      const ep = eps[i];
      const sup = ep.sup.map(se => ({ qkId: se.qk, vId: 4+se.v, forceZero: false }));
      const e = ep.query;
      const fw1 = inSeqForward(M, e.x, new Float64Array(8), evalMasks);
      const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = M.E.v[e.qk*12+d];
      const fr = m2ReadForward(M, MP, Eqk, sup);
      const headOld = u16U5HeadOut(HDold, fw1.h);
      const h = Float64Array.from(fw1.h), read = Float64Array.from(fr.readLogits), hv = Float64Array.from(fw1.hvLog);
      const trueVecs = u22cTrueSlots(read, hv, headOld, new Float64Array(8));
      const slots = u22cBuildSlots(G.makeRng(72000+seed*1000+i), trueVecs);
      const pf = u22cPoolForward(S, SC, slots);
      if (U23BSPLIT_TRUE_SLOTS.includes(pf.top2[0]) || U23BSPLIT_TRUE_SLOTS.includes(pf.top2[1])) hardHit++;
      const out = scoreHead(S, SC, HF, h, slots);
      const ens = new Float64Array(4); for (let o = 0; o < 4; o++) ens[o] = hv[o]+read[o]+out[o];
      const vhat = argmax4(ens);
      if (vhat === e.v) hardV++;
      const x2m = [9,9,9,9,9,9,e.qk,e.k,vhat,8];
      if (argmax4(inMeanLogits({ logitsK: inSeqForward(M, x2m, new Float64Array(8), evalMasks).logitsK })) === e.y) hardY++;
      const mo = u18HeadForward(minerHF, h).out;
      const ensM = new Float64Array(4); for (let o = 0; o < 4; o++) ensM[o] = hv[o]+read[o]+mo[o];
      const vhatM = argmax4(ensM);
      if (vhatM === e.v) minerVok++;
      const x2mM = [9,9,9,9,9,9,e.qk,e.k,vhatM,8];
      if (argmax4(inMeanLogits({ logitsK: inSeqForward(M, x2mM, new Float64Array(8), evalMasks).logitsK })) === e.y) minerOK++;
      const x2o = [9,9,9,9,9,9,e.qk,e.k,e.v,8];
      if (argmax4(inMeanLogits({ logitsK: inSeqForward(M, x2o, new Float64Array(8), evalMasks).logitsK })) === e.y) oracleY++;
      const oodOut = scoreHead(ood.S, ood.SC, ood.HF, h, slots);
      const ensO = new Float64Array(4); for (let o = 0; o < 4; o++) ensO[o] = hv[o]+read[o]+oodOut[o];
      const x2oo = [9,9,9,9,9,9,e.qk,e.k,argmax4(ensO),8];
      if (argmax4(inMeanLogits({ logitsK: inSeqForward(M, x2oo, new Float64Array(8), evalMasks).logitsK })) === e.y) oodY++;
    }
    const n = eps.length;
    return { n, hardY: +(hardY/n).toFixed(4), hardV: +(hardV/n).toFixed(4), minerFloor: +(minerOK/n).toFixed(4), minerV: +(minerVok/n).toFixed(4), oracleY: +(oracleY/n).toFixed(4), oodY: +(oodY/n).toFixed(4), selHit: +(hardHit/n).toFixed(4) };
  };
  const body = { spec: "self-u23b-vhatmining-prereg (after-series i)", track: "U23b-split", seed, verdict: "COMPLETE", n: N,
    kept: scoreSubset(kept), fallback: scoreSubset(fb) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("u23b-split s"+seed+" kept n="+body.kept.n+" hardY="+body.kept.hardY+" ood="+body.kept.oodY+" | fb n="+body.fallback.n+" hardY="+body.fallback.hardY);
  return body;
};
