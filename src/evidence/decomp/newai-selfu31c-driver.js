// newai-selfu31c-driver.js — U31c substitution-bias head on self-mined diet (surgery on U28/U31b stack).
// Frozen: U28 comp-arm S/C/INH/HF per seed + U28-identical teacher targets. Trainable: SUB head only
// (WS 28->8 silu, WO 8->4 linear on xs=[Eqk(12), summary(8), hv(4), read(4)]); ens2 = hv+read+HFout+sub).
// Diet: 8 std (U28-identical dataRng/cands/sup scheme) + 8 SELF-MINED hard per batch, 800st.
// Self-mine rule (pre-registered delta): keep iff OUR forced vhat != e.v AND oracleY correct.
// Eval modes: forced (SUB zeroed = U28 verbatim) / biased (SUB on). P1: miner-mined FIX/LIFT report.
globalThis.SelfU31cInit = async function (fs) {
  for (const p of ["src/evidence/decomp/newai-selfu31b-driver.js"]) {
    const src = await fs.readTextFile(p); (0, eval)(src + "\n//# sourceURL=" + p);
  }
  await globalThis.SelfU31bInit(fs);
  if (!globalThis.runU31bTrain) throw new Error("u31c stack load failed");
};
function u31cArmCode(arm) { return 193; }
function u31cMakeSUB(rng) {
  const mk = (n, s) => { const v = new Float64Array(n); for (let i = 0; i < n; i++) v[i] = rng.uniform(-s, s); return { v, g: new Float64Array(n) }; };
  return { WS: mk(8*28, 0.1), bs: mk(8, 0.1), WO: mk(4*8, 0.1), bo: mk(4, 0.1) };
}
function u31cSUBParams(Su) { return [Su.WS, Su.bs, Su.WO, Su.bo]; }
function u31cSUBForward(Su, xs) {
  const pre = new Float64Array(8);
  for (let j = 0; j < 8; j++) { let s = Su.bs.v[j]; for (let i = 0; i < 28; i++) s += Su.WS.v[j*28+i]*xs[i]; pre[j] = s; }
  const a = new Float64Array(8);
  for (let j = 0; j < 8; j++) { const sg = 1/(1+Math.exp(-pre[j])); a[j] = pre[j]*sg; }
  const sub = new Float64Array(4);
  for (let o = 0; o < 4; o++) { let s = Su.bo.v[o]; for (let j = 0; j < 8; j++) s += Su.WO.v[o*8+j]*a[j]; sub[o] = s; }
  return { sub, xs, pre, a };
}
function u31cSUBBackward(Su, fw, dens) {
  for (let o = 0; o < 4; o++) { Su.bo.g[o] += dens[o]; for (let j = 0; j < 8; j++) Su.WO.g[o*8+j] += dens[o]*fw.a[j]; }
  for (let j = 0; j < 8; j++) {
    let s = 0; for (let o = 0; o < 4; o++) s += Su.WO.v[o*8+j]*dens[o];
    const sg = 1/(1+Math.exp(-fw.pre[j]));
    const dpre = s*(sg+fw.pre[j]*sg*(1-sg));
    Su.bs.g[j] += dpre;
    for (let i = 0; i < 28; i++) Su.WS.g[j*28+i] += dpre*fw.xs[i];
  }
}
// Frozen tail: slots -> pool -> HF -> ensBase + xs. slotRng supplied by caller (stream discipline per site).
function u31cTail(S, SC, HF, INH, slotRng, h, read, hv, headOld, carry, Eqk) {
  const trueVecs = u22cTrueSlots(read, hv, headOld, carry);
  const slots = u22cBuildSlots(slotRng, trueVecs);
  const pf = u26PoolForward(S, SC, INH, slots);
  const x = new Float64Array(56); x.set(h, 0); x.set(pf.summary, 48);
  const f = siluFwd(HF.W1, HF.b1, HF.W2, HF.b2, x, 56, 24, 4);
  const ensBase = new Float64Array(4); for (let o = 0; o < 4; o++) ensBase[o] = hv[o]+read[o]+f.out[o];
  const xs = new Float64Array(28);
  xs.set(Eqk, 0); xs.set(pf.summary, 12); xs.set(hv, 20); xs.set(read, 24);
  return { pf, f, ensBase, xs };
}
globalThis.u31cGradCheck = async function (fs, log) {
  await globalThis.SelfU31cInit(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const Su = u31cMakeSUB(G.makeRng(4349));
  const hr = G.makeRng(23);
  const hv = new Float64Array(4), read = new Float64Array(4), fout = new Float64Array(4);
  for (let o = 0; o < 4; o++) { hv[o] = hr.uniform(-0.5, 0.5); read[o] = hr.uniform(-0.5, 0.5); fout[o] = hr.uniform(-0.5, 0.5); }
  const xs = new Float64Array(28); for (let i = 0; i < 28; i++) xs[i] = hr.uniform(-0.5, 0.5);
  const y = hr.int(4);
  const lossFn = () => {
    const fw = u31cSUBForward(Su, xs);
    const ens = new Float64Array(4); for (let o = 0; o < 4; o++) ens[o] = hv[o]+read[o]+fout[o]+fw.sub[o];
    return inCELossGrad(ens, y).loss;
  };
  for (const p of u31cSUBParams(Su)) p.g.fill(0);
  const fw0 = u31cSUBForward(Su, xs);
  const ens0 = new Float64Array(4); for (let o = 0; o < 4; o++) ens0[o] = hv[o]+read[o]+fout[o]+fw0.sub[o];
  const ce0 = inCELossGrad(ens0, y);
  u31cSUBBackward(Su, fw0, ce0.d);
  const eps = 1e-5; let worst = 0, where = "";
  for (const P of u31cSUBParams(Su)) {
    for (let i = 0; i < Math.min(P.v.length, 8); i++) {
      P.v[i] += eps; const a1 = lossFn(); P.v[i] -= 2*eps; const a0 = lossFn(); P.v[i] += eps;
      const num = (a1-a0)/(2*eps), an = P.g[i];
      const mag = Math.abs(num)+Math.abs(an);
      if (mag < 1e-6) continue;
      const rel = Math.abs(num-an)/Math.max(1e-12, mag);
      if (rel > worst) { worst = rel; where = "mag="+mag.toExponential(2); }
    }
  }
  // forced==U28-verbatim structural check: SUB zeroed -> ens2 == ensBase bit-exactly
  const Su0 = u31cMakeSUB(G.makeRng(999)); for (const p of u31cSUBParams(Su0)) p.v.fill(0);
  const fz = u31cSUBForward(Su0, xs);
  let maxAbsSub = 0; for (let o = 0; o < 4; o++) maxAbsSub = Math.max(maxAbsSub, Math.abs(fz.sub[o]));
  // no-touch structural check: only SUB params are ever stepped (assert hParams identity at call sites by construction)
  const pass = worst <= 1e-4 && maxAbsSub === 0;
  log("u31c-gradcheck worstCE="+worst.toExponential(2)+" at "+where+" zeroSUBmaxAbs="+maxAbsSub+" PASS="+pass);
  return { worst, where, maxAbsSub, pass };
};
// Stage-1 SUBSTRATE probe: 500 self-mine tries per seed with train-identical recipe (separate rng instances).
// keep iff OUR forced vhat != e.v AND oracle-with-e.v round-2 correct. Tripwire: keep-rate < 0.10 -> VOID seed arm.
globalThis.u31cStage1 = async function (fs, log, opts) {
  const seed = (opts && opts.seed) || 0;
  const floor = await globalThis.u26Stage1(fs, log, { seed });
  await globalThis.SelfU31cInit(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const M = await loadU1W6(fs, G, seed);
  const MP = await loadU1M2nb(fs, G, seed);
  const HDold = await loadU16U5head(fs, G, seed);
  const tr28 = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-u28-comp-s"+seed+"-800st.json"));
  const S = u22cMakeS(G.makeRng(1)), SC = u22cMakeScorer(G.makeRng(1)), HF = u22bMakeHF(G.makeRng(1)), INH = u26MakeINH(G.makeRng(1));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(S.W, tr28.P.SW); load(S.b, tr28.P.Sb); load(SC.w, tr28.P.CW); load(SC.b, tr28.P.Cb);
  load(HF.W1, tr28.P.HW1); load(HF.b1, tr28.P.Hb1); load(HF.W2, tr28.P.HW2); load(HF.b2, tr28.P.Hb2);
  load(INH.W1, tr28.P.IW1); load(INH.b1, tr28.P.Ib1); load(INH.W2, tr28.P.IW2); load(INH.b2, tr28.P.Ib2);
  let fixedMasks = null; { const fr = G.makeRng(91000+seed); fixedMasks = []; for (let k = 0; k < 5; k++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr.int(10) < 5 ? 2 : 0; fixedMasks.push(m); } }
  const argmax4 = a => { let b = 0; for (let i = 0; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  const epRng = G.makeRng(65400+seed), slotRng = G.makeRng(75400+seed);
  let keep = 0, wrong = 0; const TRIES = 500;
  for (let t = 0; t < TRIES; t++) {
    const ep = genAdaptEpisode(epRng);
    const sup = ep.sup.map(se => ({ qkId: se.qk, vId: 4+se.v, forceZero: false }));
    const e = ep.query;
    const fw1 = inSeqForward(M, e.x, new Float64Array(8), fixedMasks);
    const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = M.E.v[e.qk*12+d];
    const fr = m2ReadForward(M, MP, Eqk, sup);
    const headOld = u16U5HeadOut(HDold, fw1.h);
    const tail = u31cTail(S, SC, HF, INH, slotRng, Float64Array.from(fw1.h), Float64Array.from(fr.readLogits), Float64Array.from(fw1.hvLog), headOld, new Float64Array(8), Eqk);
    const vhat = argmax4(tail.ensBase);
    if (vhat === e.v) continue;
    wrong++;
    const x2o = [9,9,9,9,9,9,e.qk,e.k,e.v,8];
    const fw2o = inSeqForward(M, x2o, new Float64Array(8), fixedMasks);
    if (argmax4(inMeanLogits({ logitsK: fw2o.logitsK })) === e.y) keep++;
  }
  const rate = keep/TRIES;
  const body = { spec: "self-u31c-subst-prereg", test: "u31c-stage1-substrate", seed, tries: TRIES, wrong, keep, keepRate: +rate.toFixed(4), tripwire: 0.10, pass: rate >= 0.10, floor: { oracleY: floor.floor.oracleY, minerY: floor.floor.minerY } };
  log("u31c-stage1 seed="+seed+" wrong="+wrong+"/"+TRIES+" keep="+keep+" rate="+rate.toFixed(4)+" PASS="+body.pass);
  return body;
};
globalThis.runU31cTrain = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const force = opts && opts.force;
  const steps = 800, B = 16, lr = 5e-3, K = 5, H = 48, Cc = 6, NHARD = 8;
  const wAdapt = 0.5, wStd = 1.0;
  const tag = arm+"-s"+seed+"-"+steps+"st";
  const ledgerPath = "src/evidence/decomp/d-newai-self-"+tag+".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE" && !force) { log(ledgerPath+" exists, skip"); return prev; } } catch (e) {}
  await globalThis.SelfU31cInit(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const M = await loadU1W6(fs, G, seed);
  const MP = await loadU1M2nb(fs, G, seed);
  const HDold = await loadU16U5head(fs, G, seed);
  const LT = await loadU17Teacher(fs, G, seed);
  const tr28 = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-u28-comp-s"+seed+"-800st.json"));
  if (!tr28 || tr28.verdict !== "COMPLETE") throw new Error("u28 comp train missing for seed "+seed);
  const S = u22cMakeS(G.makeRng(1)), SC = u22cMakeScorer(G.makeRng(1)), HF = u22bMakeHF(G.makeRng(1)), INH = u26MakeINH(G.makeRng(1));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(S.W, tr28.P.SW); load(S.b, tr28.P.Sb); load(SC.w, tr28.P.CW); load(SC.b, tr28.P.Cb);
  load(HF.W1, tr28.P.HW1); load(HF.b1, tr28.P.Hb1); load(HF.W2, tr28.P.HW2); load(HF.b2, tr28.P.Hb2);
  load(INH.W1, tr28.P.IW1); load(INH.b1, tr28.P.Ib1); load(INH.W2, tr28.P.IW2); load(INH.b2, tr28.P.Ib2);
  const snap = [S.W, S.b, SC.w, SC.b, HF.W1, HF.b1, HF.W2, HF.b2, INH.W1, INH.b1, INH.W2, INH.b2, M.E].map(p => Float64Array.from(p.v));
  const Su = u31cMakeSUB(G.makeRng(79700+seed*7919+u31cArmCode(arm)*131));
  const hParams = [...u31cSUBParams(Su)];
  const opt = new G.Adam(lr);
  const dataRng = G.makeRng(42200+seed*104729+77);
  const mineRng = G.makeRng(65400+seed);
  const slotMineRng = G.makeRng(75400+seed);
  let fixedMasks = null; { const fr = G.makeRng(91000+seed); fixedMasks = []; for (let k = 0; k < K; k++) { const m = new Float64Array(H); for (let i = 0; i < H; i++) m[i] = fr.int(10) < 5 ? 2 : 0; fixedMasks.push(m); } }
  const argmax4 = a => { let b = 0; for (let i = 0; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  const buildMiningRow = (ep) => {
    const sup = ep.sup.map(se => ({ qkId: se.qk, vId: 4+se.v, forceZero: false }));
    const e = ep.query;
    const fw1 = inSeqForward(M, e.x, new Float64Array(8), fixedMasks);
    const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = M.E.v[e.qk*12+d];
    const fr = m2ReadForward(M, MP, Eqk, sup);
    const headOld = u16U5HeadOut(HDold, fw1.h);
    const h = Float64Array.from(fw1.h), read = Float64Array.from(fr.readLogits), hv = Float64Array.from(fw1.hvLog);
    const tail = u31cTail(S, SC, HF, INH, slotMineRng, h, read, hv, headOld, new Float64Array(8), Eqk);
    return { e, isAdapt: true, h, read, hv, headOld, carry: new Float64Array(8), pf: tail.pf, f: tail.f, ensBase: tail.ensBase, xs: tail.xs, hard: true };
  };
  const t0 = Date.now(), curve = [];
  let mineTries = 0, mineFallback = 0, hardKept = 0, fixHardSum = 0, fixHardN = 0;
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
      const fw1 = inSeqForward(M, e.x, new Float64Array(8), fixedMasks);
      const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = M.E.v[e.qk*12+d];
      const fr = m2ReadForward(M, MP, Eqk, sup.list);
      const headOld = u16U5HeadOut(HDold, fw1.h);
      const carry = sup.isAdapt ? new Float64Array(8) : Float64Array.from(fw1.cNew);
      const h = Float64Array.from(fw1.h), read = Float64Array.from(fr.readLogits), hv = Float64Array.from(fw1.hvLog);
      const tail = u31cTail(S, SC, HF, INH, dataRng, h, read, hv, headOld, carry, Eqk);
      batch.push({ e, isAdapt: sup.isAdapt, h, read, hv, headOld, carry, pf: tail.pf, f: tail.f, ensBase: tail.ensBase, xs: tail.xs, hard: false });
    }
    for (let b = 0; b < NHARD; b++) {
      let kept = null;
      for (let t = 0; t < 20; t++) {
        mineTries++;
        const ep = genAdaptEpisode(mineRng);
        const row = buildMiningRow(ep);
        const vhat = argmax4(row.ensBase);
        if (vhat === ep.query.v) { if (t === 19) { kept = row; mineFallback++; } continue; }
        const x2o = [9,9,9,9,9,9,ep.query.qk,ep.query.k,ep.query.v,8];
        const fw2o = inSeqForward(M, x2o, new Float64Array(8), fixedMasks);
        if (argmax4(inMeanLogits({ logitsK: fw2o.logitsK })) === ep.query.y) { kept = row; hardKept++; break; }
        if (t === 19) { kept = row; mineFallback++; }
      }
      batch.push(kept);
    }
    let lsum = 0, lsumH = 0, lsumS = 0;
    for (let b = 0; b < B; b++) {
      const row = batch[b];
      const tf = u16LinkerForward(LT, row.h, row.read, row.hv, row.headOld, row.carry);
      const w = row.isAdapt ? wAdapt : wStd;
      const target = row.isAdapt ? tf.out : new Float64Array(4);
      const fw = u31cSUBForward(Su, row.xs);
      const ens2 = new Float64Array(4); for (let o = 0; o < 4; o++) ens2[o] = row.ensBase[o]+fw.sub[o];
      const ce = inCELossGrad(ens2, row.e.v);
      let rowLoss = ce.loss;
      let mse = 0; for (let o = 0; o < 4; o++) { const dd = row.f.out[o]-target[o]; mse += w*dd*dd/4; }
      rowLoss += mse;
      lsum += rowLoss;
      if (row.hard) {
        lsumH += rowLoss;
        if (argmax4(ens2) === row.e.v) fixHardSum++;
        fixHardN++;
      } else lsumS += rowLoss;
      const dens = new Float64Array(4);
      for (let o = 0; o < 4; o++) dens[o] = ce.d[o]/B;
      u31cSUBBackward(Su, fw, dens);
    }
    let s = 0; for (const p of hParams) for (let i = 0; i < p.g.length; i++) s += p.g[i]*p.g[i];
    const n = Math.sqrt(s); if (n > 1.0) { const sc = 1.0/n; for (const p of hParams) for (let i = 0; i < p.g.length; i++) p.g[i] *= sc; }
    opt.step(hParams);
    if (step % 100 === 0 || step === steps-1) curve.push({ step, loss: +(lsum/B).toFixed(6), hardLoss: +((lsumH/NHARD) || 0).toFixed(6), stdLoss: +((lsumS/(B-NHARD)) || 0).toFixed(6) });
  }
  const all = [S.W, S.b, SC.w, SC.b, HF.W1, HF.b1, HF.W2, HF.b2, INH.W1, INH.b1, INH.W2, INH.b2, M.E];
  let maxDrift = 0;
  for (let pi = 0; pi < all.length; pi++) for (let i = 0; i < all[pi].v.length; i++) { const dd = Math.abs(all[pi].v[i]-snap[pi][i]); if (dd > maxDrift) maxDrift = dd; }
  const save = o => Array.from(o.v);
  const body = { spec: "self-u31c-subst-prereg", track: "U31c", arm, seed, steps, B, lr, gatedEval: true,
    routing: "no-touch: retriever+trunk frozen (never stepped, no grads); SUB only",
    frozenFrom: "d-newai-self-u28-comp-s"+seed+"-800st.json",
    maxFrozenDrift: maxDrift, verdict: "COMPLETE", wallMs: Date.now()-t0, curve,
    mining: { tries: mineTries, hardKept, fallback: mineFallback, hardRate: +(hardKept/Math.max(1, mineTries)).toFixed(4) },
    trainFixHard: +(fixHardSum/Math.max(1, fixHardN)).toFixed(4),
    P: { SWS: save(Su.WS), SBs: save(Su.bs), WOS: save(Su.WO), BOs: save(Su.bo) } };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("u31c-train "+tag+" loss0="+curve[0].loss+" lossN="+curve[curve.length-1].loss+" hardRate="+body.mining.hardRate+" fixHard="+body.trainFixHard+" frozenDrift="+maxDrift);
  return body;
};
globalThis.runU31cEval = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const force = opts && opts.force;
  const steps = 800, N = 200;
  const tag = arm+"-s"+seed+"-"+steps+"st";
  const ledgerPath = "src/evidence/decomp/d-newai-self-eval-"+tag+".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE" && !force) { log(ledgerPath+" exists, skip"); return prev; } } catch (e) {}
  await globalThis.SelfU31cInit(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const M = await loadU1W6(fs, G, seed);
  const MP = await loadU1M2nb(fs, G, seed);
  const tr28 = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-u28-comp-s"+seed+"-800st.json"));
  const trc = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-"+tag+".json"));
  const ev28 = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-eval-u28-comp-s"+seed+"-800st.json"));
  const S = u22cMakeS(G.makeRng(1)), SC = u22cMakeScorer(G.makeRng(1)), HF = u22bMakeHF(G.makeRng(1)), INH = u26MakeINH(G.makeRng(1));
  const Su = u31cMakeSUB(G.makeRng(1));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(S.W, tr28.P.SW); load(S.b, tr28.P.Sb); load(SC.w, tr28.P.CW); load(SC.b, tr28.P.Cb);
  load(HF.W1, tr28.P.HW1); load(HF.b1, tr28.P.Hb1); load(HF.W2, tr28.P.HW2); load(HF.b2, tr28.P.Hb2);
  load(INH.W1, tr28.P.IW1); load(INH.b1, tr28.P.Ib1); load(INH.W2, tr28.P.IW2); load(INH.b2, tr28.P.Ib2);
  load(Su.WS, trc.P.SWS); load(Su.bs, trc.P.SBs); load(Su.WO, trc.P.WOS); load(Su.bo, trc.P.BOs);
  const minerHF = await loadU21Miner(fs, G, seed);
  let evalMasks = null; { const fr2 = G.makeRng(91000+seed); evalMasks = []; for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr2.int(10) < 5 ? 2 : 0; evalMasks.push(m); } }
  const argmax4 = a => { let b = 0; for (let i = 0; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  const HDold = await loadU16U5head(fs, G, seed);
  const r2ok = (e, vhat) => {
    const x2m = [9,9,9,9,9,9,e.qk,e.k,vhat,8];
    const fw2 = inSeqForward(M, x2m, new Float64Array(8), evalMasks);
    return argmax4(inMeanLogits({ logitsK: fw2.logitsK })) === e.y ? 1 : 0;
  };
  // standard rows: forced (U28 verbatim hv+read) vs biased (SUB on, slots via 74000-family)
  const srng = G.makeRng(52500+seed), supRng = G.makeRng(42000+seed*104729+999);
  let scrF = 0, scrB = 0, twoF = 0, twoB = 0;
  for (let i = 0; i < N; i++) {
    const e = inSeqGenShift(srng, null);
    const supE = [inSeqGenShift(supRng, null), inSeqGenShift(supRng, null), inSeqGenShift(supRng, null), inSeqGenShift(supRng, null)];
    const sup = supE.map(se => ({ qkId: se.qk, vId: 4+se.v, forceZero: false }));
    const fw1 = inSeqForward(M, e.x, new Float64Array(8), evalMasks);
    const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = M.E.v[e.qk*12+d];
    const fr = m2ReadForward(M, MP, Eqk, sup);
    const ensF = new Float64Array(4); for (let o = 0; o < 4; o++) ensF[o] = fw1.hvLog[o]+fr.readLogits[o];
    if (argmax4(ensF) === e.v) scrF++;
    const headOld = u16U5HeadOut(HDold, fw1.h);
    const tail = u31cTail(S, SC, HF, INH, G.makeRng(74000+seed*1000+i), Float64Array.from(fw1.h), Float64Array.from(fr.readLogits), Float64Array.from(fw1.hvLog), headOld, Float64Array.from(fw1.cNew), Eqk);
    const sub = u31cSUBForward(Su, tail.xs).sub;
    const ensB = new Float64Array(4); for (let o = 0; o < 4; o++) ensB[o] = fw1.hvLog[o]+fr.readLogits[o]+sub[o];
    if (argmax4(ensB) === e.v) scrB++;
    twoF += r2ok(e, argmax4(ensF));
    twoB += r2ok(e, argmax4(ensB));
  }
  // self-mined held-out rows (mine 66400+seed, slots 76400+seed): forced vs biased
  const hRng = G.makeRng(66400+seed), hSlotRng = G.makeRng(76400+seed);
  let hN = 0, hFallback = 0, hKept = 0;
  let vF = 0, vB = 0, yF = 0, yB = 0, fixNum = 0, fixDen = 0;
  while (hN < N) {
    let row = null;
    for (let t = 0; t < 20; t++) {
      const ep = genAdaptEpisode(hRng);
      const sup = ep.sup.map(se => ({ qkId: se.qk, vId: 4+se.v, forceZero: false }));
      const e = ep.query;
      const fw1 = inSeqForward(M, e.x, new Float64Array(8), evalMasks);
      const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = M.E.v[e.qk*12+d];
      const fr = m2ReadForward(M, MP, Eqk, sup);
      const headOld = u16U5HeadOut(HDold, fw1.h);
      const tail = u31cTail(S, SC, HF, INH, hSlotRng, Float64Array.from(fw1.h), Float64Array.from(fr.readLogits), Float64Array.from(fw1.hvLog), headOld, new Float64Array(8), Eqk);
      const vhatF = argmax4(tail.ensBase);
      let keep = false;
      if (vhatF !== e.v) {
        const x2o = [9,9,9,9,9,9,e.qk,e.k,e.v,8];
        if (argmax4(inMeanLogits({ logitsK: inSeqForward(M, x2o, new Float64Array(8), evalMasks).logitsK })) === e.y) keep = true;
      }
      if (keep || t === 19) {
        if (keep) hKept++; else hFallback++;
        row = { e, ensBase: tail.ensBase, xs: tail.xs, vhatF };
        break;
      }
    }
    hN++;
    const sub = u31cSUBForward(Su, row.xs).sub;
    const ensB = new Float64Array(4); for (let o = 0; o < 4; o++) ensB[o] = row.ensBase[o]+sub[o];
    const vhatB = argmax4(ensB);
    if (row.vhatF === row.e.v) vF++;
    if (vhatB === row.e.v) vB++;
    yF += r2ok(row.e, row.vhatF);
    yB += r2ok(row.e, vhatB);
    if (row.vhatF !== row.e.v) { fixDen++; if (vhatB === row.e.v) fixNum++; }
  }
  // miner-mined rows (U31b-identical: 66300 episodes, 72000-family slots): forced vs biased + P1 FIX/LIFT
  const mRng = G.makeRng(66300+seed);
  let mVF = 0, mVB = 0, mYF = 0, mYB = 0, mSelHitF = 0, mFixNum = 0, mFixDen = 0, mN = 0, mFallback = 0, ri = 0;
  while (mN < N) {
    let kept = null;
    for (let t = 0; t < 20; t++) {
      const ep = genAdaptEpisode(mRng);
      if (u23bVhatKeep(M, MP, minerHF, evalMasks, ep).keep) { kept = ep; break; }
      if (t === 19) { kept = ep; mFallback++; }
    }
    mN++;
    const sup = kept.sup.map(se => ({ qkId: se.qk, vId: 4+se.v, forceZero: false }));
    const e = kept.query;
    const fw1 = inSeqForward(M, e.x, new Float64Array(8), evalMasks);
    const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = M.E.v[e.qk*12+d];
    const fr = m2ReadForward(M, MP, Eqk, sup);
    const headOld = u16U5HeadOut(HDold, fw1.h);
    const tail = u31cTail(S, SC, HF, INH, G.makeRng(72000+seed*1000+ri), Float64Array.from(fw1.h), Float64Array.from(fr.readLogits), Float64Array.from(fw1.hvLog), headOld, new Float64Array(8), Eqk);
    const vhatF = argmax4(tail.ensBase);
    const sub = u31cSUBForward(Su, tail.xs).sub;
    const ensB = new Float64Array(4); for (let o = 0; o < 4; o++) ensB[o] = tail.ensBase[o]+sub[o];
    const vhatB = argmax4(ensB);
    if (vhatF === e.v) mVF++;
    if (vhatB === e.v) mVB++;
    mYF += r2ok(e, vhatF);
    mYB += r2ok(e, vhatB);
    if (tail.pf.top2[0] === 7 || tail.pf.top2[0] === 41 || tail.pf.top2[0] === 129 || tail.pf.top2[0] === 166 || tail.pf.top2[0] === 203 || tail.pf.top2[1] === 7 || tail.pf.top2[1] === 41 || tail.pf.top2[1] === 129 || tail.pf.top2[1] === 166 || tail.pf.top2[1] === 203) mSelHitF++;
    if (vhatF !== e.v) { mFixDen++; if (vhatB === e.v) mFixNum++; }
    ri++;
  }
  const fix = fixNum/Math.max(1, fixDen), lift = (vB-vF)/N;
  const body = { spec: "self-u31c-subst-prereg", track: "U31c", arm, seed, steps, verdict: "COMPLETE", n: N,
    miningRule: "SELF-MINED: our forced vhat != e.v AND oracleY correct; DEDICATED mineRng 65400+seed (train) / 66400+seed (held-out)",
    accScratch_forced: +(scrF/N).toFixed(4), accScratch_biased: +(scrB/N).toFixed(4), noharmGap: +((scrB-scrF)/N).toFixed(4),
    accTwo_forced: +(twoF/N).toFixed(4), accTwo_biased: +(twoB/N).toFixed(4),
    selfMine: { heldOut: N, kept: hKept, fallback: hFallback, fixDen, fixNum, fix: +fix.toFixed(4),
      hardAdaptV_forced: +(vF/N).toFixed(4), hardAdaptV_biased: +(vB/N).toFixed(4), lift: +lift.toFixed(4),
      hardAdaptY_forced: +(yF/N).toFixed(4), hardAdaptY_biased: +(yB/N).toFixed(4) },
    minerMine: { hardAdaptV_forced: +(mVF/N).toFixed(4), hardAdaptV_biased: +(mVB/N).toFixed(4),
      hardAdaptY_forced: +(mYF/N).toFixed(4), hardAdaptY_biased: +(mYB/N).toFixed(4),
      hardYgap: +((mYB-mYF)/N).toFixed(4), hardSelectHit: +(mSelHitF/N).toFixed(4), wallRefU28: ev28.hardSelectHit,
      wallExact: +((mSelHitF/N).toFixed(4)) === ev28.hardSelectHit,
      p1Fix: +(mFixNum/Math.max(1, mFixDen)).toFixed(4), p1FixDen: mFixDen, p1FixNum: mFixNum,
      p1Lift: +(((mVB-mVF)/N)).toFixed(4), fallback: mFallback },
    oodNote: "forced-only; retrieval untouched",
    frozenDriftTrain: trc.maxFrozenDrift, mining: trc.mining };
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
  log("u31c-eval "+tag+" fix="+body.selfMine.fix+" lift="+body.selfMine.lift+" noharm="+body.noharmGap+" mYgap="+body.minerMine.hardYgap+" wallExact="+body.minerMine.wallExact);
  return body;
};
