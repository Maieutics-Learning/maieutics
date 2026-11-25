// newai-selfu31b-driver.js — U31b round-2 monitor with gated responding (surgery on U28/U31 stack).
// Frozen: U28 comp-arm S/C/INH/HF per seed + frozen trunk. Trainable: R2MON head only
// (32->8 silu ->1 sigmoid on [summary(8), hv(4), read(4), vhatOH(4), Eqk(12)]), BCE vs round-2-correct.
// Eval modes: forced (answer all = U28 verbatim) / gated (answer iff p>=0.5) + P1 permutation probe.
globalThis.SelfU31bInit = async function (fs) {
  for (const p of ["src/evidence/decomp/newai-selfu31-driver.js"]) {
    const src = await fs.readTextFile(p); (0, eval)(src + "\n//# sourceURL=" + p);
  }
  await globalThis.SelfU31Init(fs);
  if (!globalThis.runU31Train) throw new Error("u31b stack load failed");
};
function u31bArmCode(arm) { return 192; }
function r2bMakeMon(rng) {
  const mk = (n, s) => { const v = new Float64Array(n); for (let i = 0; i < n; i++) v[i] = rng.uniform(-s, s); return { v, g: new Float64Array(n) }; };
  return { W1: mk(8*32, 0.1), b1: mk(8, 0.1), W2: mk(8, 0.1), b2: mk(1, 0.1) };
}
function r2bMonParams(Mo) { return [Mo.W1, Mo.b1, Mo.W2, Mo.b2]; }
function r2bMonForward(Mo, x2) {
  const pre1 = new Float64Array(8);
  for (let j = 0; j < 8; j++) { let s = Mo.b1.v[j]; for (let i = 0; i < 32; i++) s += Mo.W1.v[j*32+i]*x2[i]; pre1[j] = s; }
  const a1 = new Float64Array(8);
  for (let j = 0; j < 8; j++) { const sg = 1/(1+Math.exp(-pre1[j])); a1[j] = pre1[j]*sg; }
  let pre2 = Mo.b2.v[0];
  for (let j = 0; j < 8; j++) pre2 += Mo.W2.v[j]*a1[j];
  const p = 1/(1+Math.exp(-pre2));
  return { p, x2, pre1, a1, pre2 };
}
function r2bMonBackward(Mo, fw, y) {
  const eps = 1e-12;
  const p = Math.min(1-eps, Math.max(eps, fw.p));
  const dpre2 = (p-y);
  for (let j = 0; j < 8; j++) Mo.W2.g[j] += dpre2*fw.a1[j];
  Mo.b2.g[0] += dpre2;
  for (let j = 0; j < 8; j++) {
    const s = Mo.W2.v[j]*dpre2;
    const sg = 1/(1+Math.exp(-fw.pre1[j]));
    const dpre1 = s*(sg+fw.pre1[j]*sg*(1-sg));
    Mo.b1.g[j] += dpre1;
    for (let i = 0; i < 32; i++) Mo.W1.g[j*32+i] += dpre1*fw.x2[i];
  }
  return -(y*Math.log(p)+(1-y)*Math.log(1-p));
}
globalThis.u31bGradCheck = async function (fs, log) {
  await globalThis.SelfU31bInit(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const Mo = r2bMakeMon(G.makeRng(4348));
  const hr = G.makeRng(22);
  const x2 = new Float64Array(32); for (let i = 0; i < 32; i++) x2[i] = hr.uniform(-0.5, 0.5);
  const y = hr.int(2);
  const lossFn = () => { const f = r2bMonForward(Mo, x2); const eps = 1e-12; const p = Math.min(1-eps, Math.max(eps, f.p)); return -(y*Math.log(p)+(1-y)*Math.log(1-p)); };
  for (const p of r2bMonParams(Mo)) p.g.fill(0);
  r2bMonBackward(Mo, r2bMonForward(Mo, x2), y);
  const eps = 1e-5; let worst = 0, where = "";
  for (const P of r2bMonParams(Mo)) {
    for (let i = 0; i < Math.min(P.v.length, 8); i++) {
      P.v[i] += eps; const a1 = lossFn(); P.v[i] -= 2*eps; const a0 = lossFn(); P.v[i] += eps;
      const num = (a1-a0)/(2*eps), an = P.g[i];
      const mag = Math.abs(num)+Math.abs(an);
      if (mag < 1e-6) continue;
      const rel = Math.abs(num-an)/Math.max(1e-12, mag);
      if (rel > worst) { worst = rel; where = "mag="+mag.toExponential(2); }
    }
  }
  const pass = worst <= 1e-4;
  log("u31b-gradcheck worstBCE="+worst.toExponential(2)+" at "+where+" PASS="+pass);
  return { worst, where, pass };
};
globalThis.u31bStage1 = async function (fs, log, opts) {
  const seed = (opts && opts.seed) || 0;
  const body = await globalThis.u26Stage1(fs, log, { seed });
  body.spec = "self-u31b-r2mon-prereg";
  body.test = "u31b-stage1";
  log("u31b-stage1 (via u26 harness, mining identical) seed="+seed+" oracle="+body.floor.oracleY+" minerY="+body.floor.minerY);
  return body;
};
globalThis.runU31bTrain = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const force = opts && opts.force;
  const steps = 800, B = 16, lr = 5e-3, K = 5, H = 48, Cc = 6, NHARD = 8;
  const tag = arm+"-s"+seed+"-"+steps+"st";
  const ledgerPath = "src/evidence/decomp/d-newai-self-"+tag+".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE" && !force) { log(ledgerPath+" exists, skip"); return prev; } } catch (e) {}
  await globalThis.SelfU31bInit(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const M = await loadU1W6(fs, G, seed);
  const MP = await loadU1M2nb(fs, G, seed);
  const HDold = await loadU16U5head(fs, G, seed);
  const minerHF = await loadU21Miner(fs, G, seed);
  const tr28 = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-u28-comp-s"+seed+"-800st.json"));
  if (!tr28 || tr28.verdict !== "COMPLETE") throw new Error("u28 comp train missing for seed "+seed);
  const S = u22cMakeS(G.makeRng(1)), SC = u22cMakeScorer(G.makeRng(1)), HF = u22bMakeHF(G.makeRng(1)), INH = u26MakeINH(G.makeRng(1));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(S.W, tr28.P.SW); load(S.b, tr28.P.Sb); load(SC.w, tr28.P.CW); load(SC.b, tr28.P.Cb);
  load(HF.W1, tr28.P.HW1); load(HF.b1, tr28.P.Hb1); load(HF.W2, tr28.P.HW2); load(HF.b2, tr28.P.Hb2);
  // D1 (d-newai-self-u31b-verdict.json): INH.W2 MUST load from tr28.P.IW2 (len-4). Loading from Ib2 (len-1)
  // yields undefined for indices 1..3 -> NaN poisons INH forward -> NaN loss (found by NaN forensics, Turn-137).
  load(INH.W1, tr28.P.IW1); load(INH.b1, tr28.P.Ib1); load(INH.W2, tr28.P.IW2); load(INH.b2, tr28.P.Ib2);
  const snap = [S.W, S.b, SC.w, SC.b, HF.W1, HF.b1, HF.W2, HF.b2, INH.W1, INH.b1, INH.W2, INH.b2, M.E].map(p => Float64Array.from(p.v));
  const Mo = r2bMakeMon(G.makeRng(79600+seed*7919+u31bArmCode(arm)*131));
  const hParams = [...r2bMonParams(Mo)];
  const opt = new G.Adam(lr);
  const dataRng = G.makeRng(42200+seed*104729+77);
  const mineRng = G.makeRng(65300+seed);
  let fixedMasks = null; { const fr = G.makeRng(91000+seed); fixedMasks = []; for (let k = 0; k < K; k++) { const m = new Float64Array(H); for (let i = 0; i < H; i++) m[i] = fr.int(10) < 5 ? 2 : 0; fixedMasks.push(m); } }
  const argmax4 = a => { let b = 0; for (let i = 0; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  const t0 = Date.now(), curve = [];
  let mineTries = 0, mineFallback = 0, hardKept = 0, shutSum = 0, shutN = 0;
  const round2ok = (e, vhat) => {
    const x2m = [9,9,9,9,9,9,e.qk,e.k,vhat,8];
    const fw2 = inSeqForward(M, x2m, new Float64Array(8), fixedMasks);
    return argmax4(inMeanLogits({ logitsK: fw2.logitsK })) === e.y ? 1 : 0;
  };
  const buildRow = (e, sup) => {
    const fw1 = inSeqForward(M, e.x, new Float64Array(8), fixedMasks);
    const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = M.E.v[e.qk*12+d];
    const fr = m2ReadForward(M, MP, Eqk, sup.list);
    const headOld = u16U5HeadOut(HDold, fw1.h);
    const carry = (sup.isAdapt) ? new Float64Array(8) : Float64Array.from(fw1.cNew);
    const h = Float64Array.from(fw1.h), read = Float64Array.from(fr.readLogits), hv = Float64Array.from(fw1.hvLog);
    const trueVecs = u22cTrueSlots(read, hv, headOld, carry);
    const slots = u22cBuildSlots(dataRng, trueVecs);
    return { e, isAdapt: sup.isAdapt, h, read, hv, Eqk, slots };
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
    let lsum = 0;
    for (let b = 0; b < B; b++) {
      const row = batch[b];
      const pf = u26PoolForward(S, SC, INH, row.slots);
      const x = new Float64Array(56); x.set(row.h, 0); x.set(pf.summary, 48);
      const f = siluFwd(HF.W1, HF.b1, HF.W2, HF.b2, x, 56, 24, 4);
      const ens = new Float64Array(4); for (let o = 0; o < 4; o++) ens[o] = row.hv[o]+row.read[o]+f.out[o];
      const vhat = argmax4(ens);
      const voh = new Float64Array(4); voh[vhat] = 1;
      const x2 = new Float64Array(32);
      x2.set(pf.summary, 0); x2.set(row.hv, 8); x2.set(row.read, 12); x2.set(voh, 16); x2.set(row.Eqk, 20);
      const y2 = round2ok(row.e, vhat);
      const fw = r2bMonForward(Mo, x2);
      const rowLoss = r2bMonBackward(Mo, fw, y2);
      lsum += rowLoss;
      if (fw.p < 0.5) shutSum++;
      shutN++;
    }
    for (const p of hParams) for (let i = 0; i < p.g.length; i++) p.g[i] /= B;
    let s = 0; for (const p of hParams) for (let i = 0; i < p.g.length; i++) s += p.g[i]*p.g[i];
    const n = Math.sqrt(s); if (n > 1.0) { const sc = 1.0/n; for (const p of hParams) for (let i = 0; i < p.g.length; i++) p.g[i] *= sc; }
    opt.step(hParams);
    if (step % 100 === 0 || step === steps-1) curve.push({ step, loss: +(lsum/B).toFixed(6) });
  }
  const all = [S.W, S.b, SC.w, SC.b, HF.W1, HF.b1, HF.W2, HF.b2, INH.W1, INH.b1, INH.W2, INH.b2, M.E];
  let maxDrift = 0;
  for (let pi = 0; pi < all.length; pi++) for (let i = 0; i < all[pi].v.length; i++) { const dd = Math.abs(all[pi].v[i]-snap[pi][i]); if (dd > maxDrift) maxDrift = dd; }
  const save = o => Array.from(o.v);
  const body = { spec: "self-u31b-r2mon-prereg", track: "U31b", arm, seed, steps, B, lr, gatedEval: true,
    routing: "no-touch: retriever+trunk frozen (never stepped, no grads); R2MON only",
    frozenFrom: "d-newai-self-u28-comp-s"+seed+"-800st.json",
    maxFrozenDrift: maxDrift, verdict: "COMPLETE", wallMs: Date.now()-t0, curve,
    mining: { tries: mineTries, hardKept, fallback: mineFallback, hardRate: +(hardKept/Math.max(1, mineTries)).toFixed(4) },
    shutRateTrain: +(shutSum/Math.max(1, shutN)).toFixed(4),
    P: { MW1: save(Mo.W1), Mb1: save(Mo.b1), MW2: save(Mo.W2), Mb2: save(Mo.b2) } };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("u31b-train "+tag+" loss0="+curve[0].loss+" lossN="+curve[curve.length-1].loss+" shutRate="+body.shutRateTrain+" frozenDrift="+maxDrift);
  return body;
};
globalThis.runU31bEval = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const force = opts && opts.force;
  const steps = 800, N = 200;
  const tag = arm+"-s"+seed+"-"+steps+"st";
  const ledgerPath = "src/evidence/decomp/d-newai-self-eval-"+tag+".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE" && !force) { log(ledgerPath+" exists, skip"); return prev; } } catch (e) {}
  await globalThis.SelfU31bInit(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const M = await loadU1W6(fs, G, seed);
  const MP = await loadU1M2nb(fs, G, seed);
  const tr28 = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-u28-comp-s"+seed+"-800st.json"));
  const trb = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-"+tag+".json"));
  const ev28 = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-eval-u28-comp-s"+seed+"-800st.json"));
  const S = u22cMakeS(G.makeRng(1)), SC = u22cMakeScorer(G.makeRng(1)), HF = u22bMakeHF(G.makeRng(1)), INH = u26MakeINH(G.makeRng(1));
  const Mo = r2bMakeMon(G.makeRng(1));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(S.W, tr28.P.SW); load(S.b, tr28.P.Sb); load(SC.w, tr28.P.CW); load(SC.b, tr28.P.Cb);
  load(HF.W1, tr28.P.HW1); load(HF.b1, tr28.P.Hb1); load(HF.W2, tr28.P.HW2); load(HF.b2, tr28.P.Hb2);
  // D1, eval half: INH was never loaded here pre-fix (fresh random retriever); WALL would trip. Same IW2 rule.
  load(INH.W1, tr28.P.IW1); load(INH.b1, tr28.P.Ib1); load(INH.W2, tr28.P.IW2); load(INH.b2, tr28.P.Ib2);
  load(Mo.W1, trb.P.MW1); load(Mo.b1, trb.P.Mb1); load(Mo.W2, trb.P.MW2); load(Mo.b2, trb.P.Mb2);
  const minerHF = await loadU21Miner(fs, G, seed);
  let evalMasks = null; { const fr2 = G.makeRng(91000+seed); evalMasks = []; for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr2.int(10) < 5 ? 2 : 0; evalMasks.push(m); } }
  const argmax4 = a => { let b = 0; for (let i = 0; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  const HDold = await loadU16U5head(fs, G, seed);
  // standard rows
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
  // hard rows: single pass; P1 permutation probe runs as a separate replay loop below
  const hardPass = () => {
    const arngH = G.makeRng(66300+seed);
    const x2store = [];
    let hardN = 0, hardFallback = 0, ri = 0;
    let shutFail = 0, failN = 0, shutOk = 0, okN = 0, hardHit = 0;
    let ansCorrect = 0, ansN = 0, fCorrect = 0;
    let minerOK = 0, minerVok = 0, oracleY = 0, hardYsumAbl = 0;
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
      x2store.push(x2);
      const p = r2bMonForward(Mo, x2).p;
      const shut = p < 0.5;
      const x2m = [9,9,9,9,9,9,e.qk,e.k,vhat,8];
      const fw2 = inSeqForward(M, x2m, new Float64Array(8), evalMasks);
      const ok = argmax4(inMeanLogits({ logitsK: fw2.logitsK })) === e.y ? 1 : 0;
      fCorrect += ok;
      if (ok) { okN++; if (shut) shutOk++; } else { failN++; if (shut) shutFail++; }
      if (!shut) { ansN++; ansCorrect += ok; }
      if (pf.top2[0] === 7 || pf.top2[0] === 41 || pf.top2[0] === 129 || pf.top2[0] === 166 || pf.top2[0] === 203 || pf.top2[1] === 7 || pf.top2[1] === 41 || pf.top2[1] === 129 || pf.top2[1] === 166 || pf.top2[1] === 203) hardHit++;
      const ensA = new Float64Array(4); for (let o = 0; o < 4; o++) ensA[o] = hv[o]+read[o];
      const x2a = [9,9,9,9,9,9,e.qk,e.k,argmax4(ensA),8];
      if (argmax4(inMeanLogits({ logitsK: inSeqForward(M, x2a, new Float64Array(8), evalMasks).logitsK })) === e.y) hardYsumAbl++;
      const mo = u18HeadForward(minerHF, h).out;
      const ensM = new Float64Array(4); for (let o = 0; o < 4; o++) ensM[o] = hv[o]+read[o]+mo[o];
      const vhatM = argmax4(ensM);
      if (vhatM === e.v) minerVok++;
      const x2mM = [9,9,9,9,9,9,e.qk,e.k,vhatM,8];
      if (argmax4(inMeanLogits({ logitsK: inSeqForward(M, x2mM, new Float64Array(8), evalMasks).logitsK })) === e.y) minerOK++;
      const x2o = [9,9,9,9,9,9,e.qk,e.k,e.v,8];
      if (argmax4(inMeanLogits({ logitsK: inSeqForward(M, x2o, new Float64Array(8), evalMasks).logitsK })) === e.y) oracleY++;
      ri++;
    }
    return { hardN, hardFallback, shutFail, failN, shutOk, okN, hardHit, ansCorrect, ansN, fCorrect, minerOK, minerVok, oracleY, hardYsumAbl, x2store };
  };
  const pass0 = hardPass();
  // P1 probe: cyclic shift x2 by N/2 (uses pass-0 store; rows replayed identically)
  const SHIFT = Math.floor(N/2);
  const arngH = G.makeRng(66300+seed);
  let pShutFail = 0, pFailN = 0, pShutOk = 0, pOkN = 0, ri2 = 0, hardN2 = 0;
  while (hardN2 < N) {
    let kept = null;
    for (let t = 0; t < 20; t++) {
      const ep = genAdaptEpisode(arngH);
      if (u23bVhatKeep(M, MP, minerHF, evalMasks, ep).keep) { kept = ep; break; }
      if (t === 19) kept = ep;
    }
    hardN2++;
    const sup = kept.sup.map(se => ({ qkId: se.qk, vId: 4+se.v, forceZero: false }));
    const e = kept.query;
    const fw1 = inSeqForward(M, e.x, new Float64Array(8), evalMasks);
    const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = M.E.v[e.qk*12+d];
    const fr = m2ReadForward(M, MP, Eqk, sup);
    const headOld = u16U5HeadOut(HDold, fw1.h);
    const h = Float64Array.from(fw1.h), read = Float64Array.from(fr.readLogits), hv = Float64Array.from(fw1.hvLog);
    const carry = new Float64Array(8);
    const trueVecs = u22cTrueSlots(read, hv, headOld, carry);
    const slots = u22cBuildSlots(G.makeRng(72000+seed*1000+ri2), trueVecs);
    const pf = u26PoolForward(S, SC, INH, slots);
    const x = new Float64Array(56); x.set(h, 0); x.set(pf.summary, 48);
    const f = siluFwd(HF.W1, HF.b1, HF.W2, HF.b2, x, 56, 24, 4);
    const ens = new Float64Array(4); for (let o = 0; o < 4; o++) ens[o] = hv[o]+read[o]+f.out[o];
    const vhat = argmax4(ens);
    const shifted = pass0.x2store[(ri2+SHIFT)%N];
    const shut = r2bMonForward(Mo, shifted).p < 0.5;
    const x2m = [9,9,9,9,9,9,e.qk,e.k,vhat,8];
    const fw2 = inSeqForward(M, x2m, new Float64Array(8), evalMasks);
    const ok = argmax4(inMeanLogits({ logitsK: fw2.logitsK })) === e.y ? 1 : 0;
    if (ok) { pOkN++; if (shut) pShutOk++; } else { pFailN++; if (shut) pShutFail++; }
    ri2++;
  }
  const catch2 = (pass0.shutFail/Math.max(1, pass0.failN))-(pass0.shutOk/Math.max(1, pass0.okN));
  const permCatch = (pShutFail/Math.max(1, pFailN))-(pShutOk/Math.max(1, pOkN));
  const selAcc = pass0.ansCorrect/Math.max(1, pass0.ansN);
  const cov = pass0.ansN/Math.max(1, pass0.hardN);
  const body = { spec: "self-u31b-r2mon-prereg", track: "U31b", arm, seed, steps, verdict: "COMPLETE", n: N, gatedEval: true,
    miningRule: "vhatM!=e.v AND oracleY correct (argmax-only, U23b D1)",
    accScratch: +(scr/N).toFixed(4), accTwo: +(two/N).toFixed(4),
    hardSelectHit: +(pass0.hardHit/N).toFixed(4), wallRefU28: ev28.hardSelectHit, wallExact: +(pass0.hardHit/N).toFixed(4) === ev28.hardSelectHit,
    shutRateFail: +(pass0.shutFail/Math.max(1, pass0.failN)).toFixed(4), shutRateOk: +(pass0.shutOk/Math.max(1, pass0.okN)).toFixed(4),
    catch2: +catch2.toFixed(4), failN: pass0.failN, okN: pass0.okN,
    permCatch2: +permCatch.toFixed(4),
    hardAdaptY_forced: +(pass0.fCorrect/N).toFixed(4), selAccAnswered: +selAcc.toFixed(4), coverage: +cov.toFixed(4),
    selaccGain: +(selAcc-(pass0.fCorrect/N)).toFixed(4),
    hardSummaryAblated: +(pass0.hardYsumAbl/N).toFixed(4), hardSummaryDrop: +(((pass0.fCorrect-pass0.hardYsumAbl)/N)).toFixed(4),
    minerFloor: +(pass0.minerOK/N).toFixed(4), minerV: +(pass0.minerVok/N).toFixed(4), oracleY: +(pass0.oracleY/N).toFixed(4), hardFallback: pass0.hardFallback,
    oodNote: "forced-only; retrieval untouched",
    frozenDriftTrain: trb.maxFrozenDrift, mining: trb.mining };
  const ood = await loadU22cScale(fs, G, seed);
  let oodY = 0;
  const arngH2 = G.makeRng(66300+seed);
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
  body.oodAdaptY = +(oodY/N).toFixed(4);
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("u31b-eval "+tag+" sel="+body.hardSelectHit+" wallExact="+body.wallExact+" catch2="+body.catch2+" permCatch="+body.permCatch2+" selGain="+body.selaccGain+" cov="+body.coverage+" fY="+body.hardAdaptY_forced);
  return body;
};
