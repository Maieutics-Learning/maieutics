// newai-selfu31e-driver.js — U31e gate-selected composition training (self-directed loop).
// Frozen: U28 S/C/INH/HF + trunk Mf (W6, never stepped) + U31b R2MON gate (selection only) + miner.
// Trainable: trunk COPY Mc per (arm, seed), init bit-exact from W6. Task: round-2 CE on x2m with FROZEN vhat_f.
// Arms: e-sel (gate p<0.5) / e-neg (p>=0.5, killer) / e-rand (uniform) / e-none (zero-step copy). 12T + 12E.
globalThis.SelfU31eInit = async function (fs) {
  for (const p of ["src/evidence/decomp/newai-selfu31b-driver.js"]) {
    const src = await fs.readTextFile(p); (0, eval)(src + "\n//# sourceURL=" + p);
  }
  await globalThis.SelfU31bInit(fs);
  if (!globalThis.runU31bTrain) throw new Error("u31e stack load failed");
};
function u31eArmCode(arm) { if (arm === "e-sel") return 194; if (arm === "e-neg") return 195; if (arm === "e-rand") return 196; return 197; }
function u31eDiet(arm) { if (arm === "e-sel") return "sel"; if (arm === "e-neg") return "neg"; if (arm === "e-rand") return "rand"; return "none"; }
globalThis.u31eGradCheck = async function (fs, log) {
  await globalThis.SelfU31eInit(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const Mf = await loadU1W6(fs, G, 0);
  const Mc = await loadU1W6(fs, G, 0);
  const pf = inSeqParams(Mf), pc = inSeqParams(Mc);
  let maxDiff = 0;
  for (let k = 0; k < pf.length; k++) for (let i = 0; i < pf[k].v.length; i++) { const dd = Math.abs(pf[k].v[i]-pc[k].v[i]); if (dd > maxDiff) maxDiff = dd; }
  const hr = G.makeRng(24);
  const x = []; for (let t = 0; t < 10; t++) x.push(hr.int(10));
  const y = hr.int(4);
  const c0 = new Float64Array(8);
  const masks = []; for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = hr.int(10) < 5 ? 2 : 0; masks.push(m); }
  const lossFn = () => { const fw = inSeqForward(Mc, x, c0, masks); return inCELossGrad(inMeanLogits({ logitsK: fw.logitsK }), y).loss; };
  for (const p of inSeqParams(Mc)) p.g.fill(0);
  const fw0 = inSeqForward(Mc, x, c0, masks);
  const ce0 = inCELossGrad(inMeanLogits({ logitsK: fw0.logitsK }), y);
  const dMean = new Float64Array(4); for (let o = 0; o < 4; o++) dMean[o] = ce0.d[o];
  inBackward(Mc, fw0, dMean, null, null, masks, false, null);
  const eps = 1e-5; let worst = 0, where = "";
  const spots = [Mc.Wh[0], Mc.bh[0], Mc.W1, Mc.Hv];
  for (const P of spots) {
    for (let i = 0; i < Math.min(P.v.length, 8); i++) {
      P.v[i] += eps; const a1 = lossFn(); P.v[i] -= 2*eps; const a0 = lossFn(); P.v[i] += eps;
      const num = (a1-a0)/(2*eps), an = P.g[i];
      const mag = Math.abs(num)+Math.abs(an);
      if (mag < 1e-6) continue;
      const rel = Math.abs(num-an)/Math.max(1e-12, mag);
      if (rel > worst) { worst = rel; where = "mag="+mag.toExponential(2); }
    }
  }
  const pass = worst <= 1e-4 && maxDiff === 0;
  log("u31e-gradcheck worstCE="+worst.toExponential(2)+" at "+where+" copyFidelity="+maxDiff+" PASS="+pass);
  return { worst, where, maxDiff, pass };
};
globalThis.u31eStage1 = async function (fs, log, opts) {
  const seed = (opts && opts.seed) || 0;
  await globalThis.SelfU31eInit(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const M = await loadU1W6(fs, G, seed);
  const MP = await loadU1M2nb(fs, G, seed);
  const HDold = await loadU16U5head(fs, G, seed);
  const tr28 = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-u28-comp-s"+seed+"-800st.json"));
  const trb = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-u31b-r2mon-s"+seed+"-800st.json"));
  const S = u22cMakeS(G.makeRng(1)), SC = u22cMakeScorer(G.makeRng(1)), HF = u22bMakeHF(G.makeRng(1)), INH = u26MakeINH(G.makeRng(1));
  const Mo = r2bMakeMon(G.makeRng(1));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(S.W, tr28.P.SW); load(S.b, tr28.P.Sb); load(SC.w, tr28.P.CW); load(SC.b, tr28.P.Cb);
  load(HF.W1, tr28.P.HW1); load(HF.b1, tr28.P.Hb1); load(HF.W2, tr28.P.HW2); load(HF.b2, tr28.P.Hb2);
  load(INH.W1, tr28.P.IW1); load(INH.b1, tr28.P.Ib1); load(INH.W2, tr28.P.IW2); load(INH.b2, tr28.P.Ib2);
  load(Mo.W1, trb.P.MW1); load(Mo.b1, trb.P.Mb1); load(Mo.W2, trb.P.MW2); load(Mo.b2, trb.P.Mb2);
  let fixedMasks = null; { const fr = G.makeRng(91000+seed); fixedMasks = []; for (let k = 0; k < 5; k++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr.int(10) < 5 ? 2 : 0; fixedMasks.push(m); } }
  const argmax4 = a => { let b = 0; for (let i = 0; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  const epRng = G.makeRng(93400+seed), slotRng = G.makeRng(94400+seed);
  let sel = 0, selOracle = 0; const TRIES = 1000;
  for (let t = 0; t < TRIES; t++) {
    const ep = genAdaptEpisode(epRng);
    const sup = ep.sup.map(se => ({ qkId: se.qk, vId: 4+se.v, forceZero: false }));
    const e = ep.query;
    const fw1 = inSeqForward(M, e.x, new Float64Array(8), fixedMasks);
    const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = M.E.v[e.qk*12+d];
    const fr = m2ReadForward(M, MP, Eqk, sup);
    const headOld = u16U5HeadOut(HDold, fw1.h);
    const h = Float64Array.from(fw1.h), read = Float64Array.from(fr.readLogits), hv = Float64Array.from(fw1.hvLog);
    const tail = u22cTailStub(S, SC, HF, INH, slotRng, h, read, hv, headOld, new Float64Array(8), Eqk);
    const vhat = argmax4(tail.ensBase);
    const voh = new Float64Array(4); voh[vhat] = 1;
    const x2 = new Float64Array(32);
    x2.set(tail.pf.summary, 0); x2.set(hv, 8); x2.set(read, 12); x2.set(voh, 16); x2.set(Eqk, 20);
    if (r2bMonForward(Mo, x2).p < 0.5) {
      sel++;
      const x2o = [9,9,9,9,9,9,e.qk,e.k,e.v,8];
      if (argmax4(inMeanLogits({ logitsK: inSeqForward(M, x2o, new Float64Array(8), fixedMasks).logitsK })) === e.y) selOracle++;
    }
  }
  const rate = sel/TRIES;
  const body = { spec: "self-u31e-selfdir-prereg", test: "u31e-stage1-selection", seed, tries: TRIES, sel, selRate: +rate.toFixed(4), selOracle, tripwire: 0.10, pass: rate >= 0.10 };
  log("u31e-stage1 seed="+seed+" sel="+sel+"/"+TRIES+" rate="+rate.toFixed(4)+" oracleAmongSel="+selOracle+" PASS="+body.pass);
  return body;
};
// shared frozen tail (slots->pool->HF->ensBase); slotRng caller-owned
function u22cTailStub(S, SC, HF, INH, slotRng, h, read, hv, headOld, carry, Eqk) {
  const trueVecs = u22cTrueSlots(read, hv, headOld, carry);
  const slots = u22cBuildSlots(slotRng, trueVecs);
  const pf = u26PoolForward(S, SC, INH, slots);
  const x = new Float64Array(56); x.set(h, 0); x.set(pf.summary, 48);
  const f = siluFwd(HF.W1, HF.b1, HF.W2, HF.b2, x, 56, 24, 4);
  const ensBase = new Float64Array(4); for (let o = 0; o < 4; o++) ensBase[o] = hv[o]+read[o]+f.out[o];
  return { pf, f, ensBase };
}
globalThis.runU31eTrain = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const force = opts && opts.force;
  const steps = 800, B = 16, lr = 5e-3, K = 5, H = 48, Cc = 6, NHARD = 8;
  const diet = u31eDiet(arm);
  const tag = arm+"-s"+seed+"-"+steps+"st";
  const ledgerPath = "src/evidence/decomp/d-newai-self-"+tag+".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE" && !force) { log(ledgerPath+" exists, skip"); return prev; } } catch (e) {}
  await globalThis.SelfU31eInit(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const Mf = await loadU1W6(fs, G, seed);
  const Mc = await loadU1W6(fs, G, seed);
  const MP = await loadU1M2nb(fs, G, seed);
  const HDold = await loadU16U5head(fs, G, seed);
  const tr28 = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-u28-comp-s"+seed+"-800st.json"));
  const trb = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-u31b-r2mon-s"+seed+"-800st.json"));
  const S = u22cMakeS(G.makeRng(1)), SC = u22cMakeScorer(G.makeRng(1)), HF = u22bMakeHF(G.makeRng(1)), INH = u26MakeINH(G.makeRng(1));
  const Mo = r2bMakeMon(G.makeRng(1));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(S.W, tr28.P.SW); load(S.b, tr28.P.Sb); load(SC.w, tr28.P.CW); load(SC.b, tr28.P.Cb);
  load(HF.W1, tr28.P.HW1); load(HF.b1, tr28.P.Hb1); load(HF.W2, tr28.P.HW2); load(HF.b2, tr28.P.Hb2);
  load(INH.W1, tr28.P.IW1); load(INH.b1, tr28.P.Ib1); load(INH.W2, tr28.P.IW2); load(INH.b2, tr28.P.Ib2);
  load(Mo.W1, trb.P.MW1); load(Mo.b1, trb.P.Mb1); load(Mo.W2, trb.P.MW2); load(Mo.b2, trb.P.Mb2);
  const snapF = [Mf.E, Mf.W1, Mf.b1, Mf.Wf, Mf.bf, Mf.Wc, Mf.bc, Mf.Hv, Mf.bv, S.W, S.b, SC.w, SC.b, HF.W1, HF.b1, HF.W2, HF.b2, INH.W1, INH.b1, INH.W2, INH.b2].map(p => Float64Array.from(p.v));
  const snapC0 = inSeqParams(Mc).map(p => Float64Array.from(p.v));
  let maxCopyDiff = 0;
  const pf0 = inSeqParams(Mf);
  for (let k = 0; k < pf0.length; k++) for (let i = 0; i < pf0[k].v.length; i++) { const dd = Math.abs(pf0[k].v[i]-snapC0[k][i]); if (dd > maxCopyDiff) maxCopyDiff = dd; }
  const argmax4 = a => { let b = 0; for (let i = 0; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  if (diet === "none") {
    const save = o => Array.from(o.v);
    const body = { spec: "self-u31e-selfdir-prereg", track: "U31e", arm, seed, steps: 0, B, lr, diet,
      routing: "zero-step copy; Mc never stepped", frozenFrom: "d-newai-w-w6-s"+seed+".json",
      maxFrozenDrift: 0, maxCopyDiff, verdict: "COMPLETE", wallMs: 0, curve: [],
      mining: { tries: 0, kept: 0, fallback: 0, hardRate: 0 },
      P: { E: save(Mc.E), W1: save(Mc.W1), b1: save(Mc.b1), Wf: save(Mc.Wf), bf: save(Mc.bf), Wc: save(Mc.Wc), bc: save(Mc.bc), Wh: Mc.Wh.map(save), bh: Mc.bh.map(save), Hv: save(Mc.Hv), bv: save(Mc.bv) } };
    await fs.writeTextFile(ledgerPath, JSON.stringify(body));
    log("u31e-train "+tag+" NONE copyFidelity="+maxCopyDiff);
    return body;
  }
  const hParams = [...inSeqParams(Mc)];
  const opt = new G.Adam(lr);
  const dataRng = G.makeRng(42200+seed*104729+77);
  const mineRng = G.makeRng(diet === "sel" ? 93400+seed : diet === "neg" ? 93600+seed : 93500+seed);
  const slotRng = G.makeRng(diet === "sel" ? 94400+seed : diet === "neg" ? 94600+seed : 94500+seed);
  let fixedMasks = null; { const fr = G.makeRng(91000+seed); fixedMasks = []; for (let k = 0; k < K; k++) { const m = new Float64Array(H); for (let i = 0; i < H; i++) m[i] = fr.int(10) < 5 ? 2 : 0; fixedMasks.push(m); } }
  const buildHard = (ep) => {
    const sup = ep.sup.map(se => ({ qkId: se.qk, vId: 4+se.v, forceZero: false }));
    const e = ep.query;
    const fw1 = inSeqForward(Mf, e.x, new Float64Array(8), fixedMasks);
    const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = Mf.E.v[e.qk*12+d];
    const fr = m2ReadForward(Mf, MP, Eqk, sup);
    const headOld = u16U5HeadOut(HDold, fw1.h);
    const h = Float64Array.from(fw1.h), read = Float64Array.from(fr.readLogits), hv = Float64Array.from(fw1.hvLog);
    const tail = u22cTailStub(S, SC, HF, INH, slotRng, h, read, hv, headOld, new Float64Array(8), Eqk);
    const vhat = argmax4(tail.ensBase);
    const voh = new Float64Array(4); voh[vhat] = 1;
    const x2 = new Float64Array(32);
    x2.set(tail.pf.summary, 0); x2.set(hv, 8); x2.set(read, 12); x2.set(voh, 16); x2.set(Eqk, 20);
    return { e, vhat, p: r2bMonForward(Mo, x2).p };
  };
  const t0 = Date.now(), curve = [];
  let mineTries = 0, mineFallback = 0, hardKept = 0;
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
        for (let c = 0; c < Cc; c++) { const fw = inSeqForward(Mf, cands[c].x, new Float64Array(8), fixedMasks); const d = curVoteDisagree(fw.logitsK); if (d > best) { best = d; pk = c; } }
        e = cands[pk];
        const supE = [inSeqGenShift(dataRng, null), inSeqGenShift(dataRng, null), inSeqGenShift(dataRng, null), inSeqGenShift(dataRng, null)];
        sup = { list: supE.map(se => ({ qkId: se.qk, vId: 4+se.v, forceZero: false })), isAdapt: false };
      } else {
        const ep = genAdaptEpisode(dataRng); e = ep.query; sup = { list: ep.sup.map(se => ({ qkId: se.qk, vId: 4+se.v, forceZero: false })), isAdapt: true };
      }
      const fw1 = inSeqForward(Mf, e.x, new Float64Array(8), fixedMasks);
      const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = Mf.E.v[e.qk*12+d];
      const fr = m2ReadForward(Mf, MP, Eqk, sup.list);
      const ensStd = new Float64Array(4); for (let o = 0; o < 4; o++) ensStd[o] = fw1.hvLog[o]+fr.readLogits[o];
      batch.push({ e, vhat: argmax4(ensStd), hard: false });
    }
    for (let b = 0; b < NHARD; b++) {
      let kept = null;
      for (let t = 0; t < 20; t++) {
        mineTries++;
        const ep = genAdaptEpisode(mineRng);
        if (diet === "rand") { kept = buildHard(ep); hardKept++; break; }
        const row = buildHard(ep);
        const want = diet === "sel" ? row.p < 0.5 : row.p >= 0.5;
        if (want) { kept = row; hardKept++; break; }
        if (t === 19) { kept = row; mineFallback++; }
      }
      batch.push({ ...kept, hard: true });
    }
    let lsum = 0, lsumH = 0, lsumS = 0;
    for (let b = 0; b < B; b++) {
      const row = batch[b];
      const x2m = [9,9,9,9,9,9,row.e.qk,row.e.k,row.vhat,8];
      const fw2 = inSeqForward(Mc, x2m, new Float64Array(8), fixedMasks);
      const ce = inCELossGrad(inMeanLogits({ logitsK: fw2.logitsK }), row.e.y);
      lsum += ce.loss;
      if (row.hard) lsumH += ce.loss; else lsumS += ce.loss;
      const dMean = new Float64Array(4);
      for (let o = 0; o < 4; o++) dMean[o] = ce.d[o]/B;
      inBackward(Mc, fw2, dMean, null, null, fixedMasks, false, null);
    }
    let s = 0; for (const p of hParams) for (let i = 0; i < p.g.length; i++) s += p.g[i]*p.g[i];
    const n = Math.sqrt(s); if (n > 1.0) { const sc = 1.0/n; for (const p of hParams) for (let i = 0; i < p.g.length; i++) p.g[i] *= sc; }
    opt.step(hParams);
    if (step % 100 === 0 || step === steps-1) curve.push({ step, loss: +(lsum/B).toFixed(6), hardLoss: +((lsumH/NHARD) || 0).toFixed(6), stdLoss: +((lsumS/(B-NHARD)) || 0).toFixed(6) });
  }
  const frozen = [Mf.E, Mf.W1, Mf.b1, Mf.Wf, Mf.bf, Mf.Wc, Mf.bc, Mf.Hv, Mf.bv, S.W, S.b, SC.w, SC.b, HF.W1, HF.b1, HF.W2, HF.b2, INH.W1, INH.b1, INH.W2, INH.b2];
  let maxDrift = 0;
  for (let pi = 0; pi < frozen.length; pi++) for (let i = 0; i < frozen[pi].v.length; i++) { const dd = Math.abs(frozen[pi].v[i]-snapF[pi][i]); if (dd > maxDrift) maxDrift = dd; }
  const save = o => Array.from(o.v);
  const body = { spec: "self-u31e-selfdir-prereg", track: "U31e", arm, seed, steps, B, lr, diet,
    routing: "Mc (trunk copy) only; Mf+retriever+gate frozen (never stepped, no grads)",
    frozenFrom: "d-newai-w-w6-s"+seed+".json",
    maxFrozenDrift: maxDrift, maxCopyDiff, verdict: "COMPLETE", wallMs: Date.now()-t0, curve,
    mining: { tries: mineTries, kept: hardKept, fallback: mineFallback, hardRate: +(hardKept/Math.max(1, mineTries)).toFixed(4), meanTriesPerKeep: +(mineTries/Math.max(1, hardKept+mineFallback)).toFixed(2) },
    P: { E: save(Mc.E), W1: save(Mc.W1), b1: save(Mc.b1), Wf: save(Mc.Wf), bf: save(Mc.bf), Wc: save(Mc.Wc), bc: save(Mc.bc), Wh: Mc.Wh.map(save), bh: Mc.bh.map(save), Hv: save(Mc.Hv), bv: save(Mc.bv) } };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("u31e-train "+tag+" loss0="+curve[0].loss+" lossN="+curve[curve.length-1].loss+" hardRate="+body.mining.hardRate+" drift="+maxDrift);
  return body;
};
globalThis.runU31eEval = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const force = opts && opts.force;
  const steps = 800, N = 1000;
  const tag = arm+"-s"+seed+"-"+steps+"st";
  const ledgerPath = "src/evidence/decomp/d-newai-self-eval-"+tag+".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE" && !force) { log(ledgerPath+" exists, skip"); return prev; } } catch (e) {}
  await globalThis.SelfU31eInit(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const Mf = await loadU1W6(fs, G, seed);
  const Mc = await loadU1W6(fs, G, seed);
  const MP = await loadU1M2nb(fs, G, seed);
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-"+tag+".json"));
  if (!tr || tr.verdict !== "COMPLETE") throw new Error("u31e train ledger missing for "+tag);
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  const P = tr.P;
  load(Mc.E, P.E); load(Mc.W1, P.W1); load(Mc.b1, P.b1);
  load(Mc.Wf, P.Wf); load(Mc.bf, P.bf); load(Mc.Wc, P.Wc); load(Mc.bc, P.bc);
  for (let k = 0; k < 5; k++) { load(Mc.Wh[k], P.Wh[k]); load(Mc.bh[k], P.bh[k]); }
  load(Mc.Hv, P.Hv); load(Mc.bv, P.bv);
  const tr28 = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-u28-comp-s"+seed+"-800st.json"));
  const S = u22cMakeS(G.makeRng(1)), SC = u22cMakeScorer(G.makeRng(1)), HF = u22bMakeHF(G.makeRng(1)), INH = u26MakeINH(G.makeRng(1));
  load(S.W, tr28.P.SW); load(S.b, tr28.P.Sb); load(SC.w, tr28.P.CW); load(SC.b, tr28.P.Cb);
  load(HF.W1, tr28.P.HW1); load(HF.b1, tr28.P.Hb1); load(HF.W2, tr28.P.HW2); load(HF.b2, tr28.P.Hb2);
  load(INH.W1, tr28.P.IW1); load(INH.b1, tr28.P.Ib1); load(INH.W2, tr28.P.IW2); load(INH.b2, tr28.P.Ib2);
  const minerHF = await loadU21Miner(fs, G, seed);
  let evalMasks = null; { const fr2 = G.makeRng(91000+seed); evalMasks = []; for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr2.int(10) < 5 ? 2 : 0; evalMasks.push(m); } }
  const argmax4 = a => { let b = 0; for (let i = 0; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  const HDold = await loadU16U5head(fs, G, seed);
  const r2 = (M, e, vhat) => {
    const x2m = [9,9,9,9,9,9,e.qk,e.k,vhat,8];
    return argmax4(inMeanLogits({ logitsK: inSeqForward(M, x2m, new Float64Array(8), evalMasks).logitsK }));
  };
  const arngH = G.makeRng(66300+seed);
  let hardN = 0, hardFallback = 0, yMc = 0, yMf = 0, ri = 0;
  while (hardN < N) {
    let kept = null;
    for (let t = 0; t < 20; t++) {
      const ep = genAdaptEpisode(arngH);
      if (u23bVhatKeep(Mf, MP, minerHF, evalMasks, ep).keep) { kept = ep; break; }
      if (t === 19) { kept = ep; hardFallback++; }
    }
    hardN++;
    const sup = kept.sup.map(se => ({ qkId: se.qk, vId: 4+se.v, forceZero: false }));
    const e = kept.query;
    const fw1 = inSeqForward(Mf, e.x, new Float64Array(8), evalMasks);
    const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = Mf.E.v[e.qk*12+d];
    const fr = m2ReadForward(Mf, MP, Eqk, sup);
    const headOld = u16U5HeadOut(HDold, fw1.h);
    const h = Float64Array.from(fw1.h), read = Float64Array.from(fr.readLogits), hv = Float64Array.from(fw1.hvLog);
    const trueVecs = u22cTrueSlots(read, hv, headOld, new Float64Array(8));
    const slots = u22cBuildSlots(G.makeRng(72000+seed*1000+ri), trueVecs);
    const pf = u26PoolForward(S, SC, INH, slots);
    const x = new Float64Array(56); x.set(h, 0); x.set(pf.summary, 48);
    const f = siluFwd(HF.W1, HF.b1, HF.W2, HF.b2, x, 56, 24, 4);
    const ens = new Float64Array(4); for (let o = 0; o < 4; o++) ens[o] = hv[o]+read[o]+f.out[o];
    const vhat = argmax4(ens);
    if (r2(Mc, e, vhat) === e.y) yMc++;
    if (r2(Mf, e, vhat) === e.y) yMf++;
    ri++;
  }
  const srng = G.makeRng(52500+seed), supRng = G.makeRng(42000+seed*104729+999);
  let scrMc = 0, scrMf = 0, twoMc = 0, twoMf = 0;
  for (let i = 0; i < 200; i++) {
    const e = inSeqGenShift(srng, null);
    const supE = [inSeqGenShift(supRng, null), inSeqGenShift(supRng, null), inSeqGenShift(supRng, null), inSeqGenShift(supRng, null)];
    const sup = supE.map(se => ({ qkId: se.qk, vId: 4+se.v, forceZero: false }));
    const fw1 = inSeqForward(Mf, e.x, new Float64Array(8), evalMasks);
    const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = Mf.E.v[e.qk*12+d];
    const fr = m2ReadForward(Mf, MP, Eqk, sup);
    const ens = new Float64Array(4); for (let o = 0; o < 4; o++) ens[o] = fw1.hvLog[o]+fr.readLogits[o];
    if (argmax4(ens) === e.v) { scrMf++; scrMc++; }
    const vhat = argmax4(ens);
    if (r2(Mc, e, vhat) === e.y) twoMc++;
    if (r2(Mf, e, vhat) === e.y) twoMf++;
  }
  const body = { spec: "self-u31e-selfdir-prereg", track: "U31e", arm, seed, steps, verdict: "COMPLETE", n: N,
    miningRule: "vhatM!=e.v AND oracleY correct; deterministic 66300 base -> identical row sets across arms (paired)",
    hardAdaptY: +(yMc/N).toFixed(4), hardAdaptY_frozen: +(yMf/N).toFixed(4), liftVsFrozen: +((yMc-yMf)/N).toFixed(4),
    stdScr: +(scrMc/200).toFixed(4), stdTwo: +(twoMc/200).toFixed(4), stdTwo_frozen: +(twoMf/200).toFixed(4),
    hardFallback, frozenDriftTrain: tr.maxFrozenDrift, mining: tr.mining };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("u31e-eval "+tag+" hardY="+body.hardAdaptY+" frozen="+body.hardAdaptY_frozen+" lift="+body.liftVsFrozen+" stdTwo="+body.stdTwo+" fstdTwo="+body.stdTwo_frozen);
  return body;
};
