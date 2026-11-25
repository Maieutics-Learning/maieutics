// newai-selfu31-driver.js — U31 post-retrieval monitor with veto+fallback (surgery on U28).
// Frozen: U28 comp-arm S+C+INH+HF per seed (retriever untouched, no grads ever).
// Trainable: MONITOR head M only (20->8 silu ->1 sigmoid on [winnerEnc(8), Eqk(12)]), BCE vs 1[w1 in TRUE].
// Eval modes per row: forced (U28 verbatim) / monitor (veto iff p<0.5 -> fallback re-read excl. w1) / always-veto.
globalThis.SelfU31Init = async function (fs) {
  for (const p of ["src/evidence/decomp/newai-selfu28-driver.js"]) {
    const src = await fs.readTextFile(p); (0, eval)(src + "\n//# sourceURL=" + p);
  }
  await globalThis.SelfU28Init(fs);
  if (!globalThis.runU28Train) throw new Error("u31 stack load failed");
};
function u31ArmCode(arm) { return 191; }
const U31_TRUE = [7, 41, 129, 166, 203];
function u31MakeMon(rng) {
  const mk = (n, s) => { const v = new Float64Array(n); for (let i = 0; i < n; i++) v[i] = rng.uniform(-s, s); return { v, g: new Float64Array(n) }; };
  return { W1: mk(8*20, 0.1), b1: mk(8, 0.1), W2: mk(8, 0.1), b2: mk(1, 0.1) };
}
function u31MonParams(Mo) { return [Mo.W1, Mo.b1, Mo.W2, Mo.b2]; }
function u31MonForward(Mo, encW, Eqk) {
  const x = new Float64Array(20); x.set(encW, 0); x.set(Eqk, 8);
  const pre1 = new Float64Array(8);
  for (let j = 0; j < 8; j++) { let s = Mo.b1.v[j]; for (let i = 0; i < 20; i++) s += Mo.W1.v[j*20+i]*x[i]; pre1[j] = s; }
  const a1 = new Float64Array(8);
  for (let j = 0; j < 8; j++) { const sg = 1/(1+Math.exp(-pre1[j])); a1[j] = pre1[j]*sg; }
  let pre2 = Mo.b2.v[0];
  for (let j = 0; j < 8; j++) pre2 += Mo.W2.v[j]*a1[j];
  const p = 1/(1+Math.exp(-pre2));
  return { p, x, pre1, a1, pre2 };
}
function u31MonBackward(Mo, fw, encW, Eqk, y) {
  const eps = 1e-12;
  const p = Math.min(1-eps, Math.max(eps, fw.p));
  const dp = (p-y);
  const dpre2 = dp; // dL/dpre2 for BCE+sigmoid
  for (let j = 0; j < 8; j++) { Mo.W2.g[j] += dpre2*fw.a1[j]; }
  Mo.b2.g[0] += dpre2;
  for (let j = 0; j < 8; j++) {
    let s = Mo.W2.v[j]*dpre2;
    const sg = 1/(1+Math.exp(-fw.pre1[j]));
    const dpre1 = s*(sg+fw.pre1[j]*sg*(1-sg));
    Mo.b1.g[j] += dpre1;
    for (let i = 0; i < 20; i++) Mo.W1.g[j*20+i] += dpre1*fw.x[i];
  }
  const va = (p-y)*(p-y);
  return { loss: -(y*Math.log(p)+(1-y)*Math.log(1-p)), dp2: va };
}
function u31Winner(pf) { let b = 0; for (let i = 1; i < 250; i++) if (pf.scores[i] > pf.scores[b]) b = i; return b; }
function u31IsTrue(idx) { return U31_TRUE.includes(idx); }
globalThis.u31GradCheck = async function (fs, log) {
  await globalThis.SelfU31Init(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const S = u22cMakeS(G.makeRng(4343)), C = u22cMakeScorer(G.makeRng(4344)), HF = u22bMakeHF(G.makeRng(4345)), INH = u26MakeINH(G.makeRng(4346));
  const Mo = u31MakeMon(G.makeRng(4347));
  const slots = new Float64Array(250*4); const hr = G.makeRng(21);
  for (let i = 0; i < slots.length; i++) slots[i] = hr.uniform(-0.5, 0.5);
  const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = hr.uniform(-0.5, 0.5);
  const pf = u26PoolForward(S, C, INH, slots);
  const w1 = u31Winner(pf);
  const encW = new Float64Array(8); for (let k = 0; k < 8; k++) encW[k] = pf.enc[w1*8+k];
  const y = u31IsTrue(w1) ? 1 : 0;
  const lossFn = () => { const f = u31MonForward(Mo, encW, Eqk); const eps = 1e-12; const p = Math.min(1-eps, Math.max(eps, f.p)); return -(y*Math.log(p)+(1-y)*Math.log(1-p)); };
  for (const p of u31MonParams(Mo)) p.g.fill(0);
  const fw = u31MonForward(Mo, encW, Eqk);
  u31MonBackward(Mo, fw, encW, Eqk, y);
  const eps = 1e-6; let worst = 0, where = "";
  const ps = u31MonParams(Mo);
  for (const P of ps) {
    for (let i = 0; i < Math.min(P.v.length, 8); i++) {
      P.v[i] += eps; const a1 = lossFn(); P.v[i] -= 2*eps; const a0 = lossFn(); P.v[i] += eps;
      const num = (a1-a0)/(2*eps), an = P.g[i];
      const denom = Math.max(1e-12, Math.abs(num)+Math.abs(an));
      const rel = Math.abs(num-an)/denom;
      if (Math.abs(num) < 1e-9 && Math.abs(an) < 1e-9) continue;
      if (rel > worst) { worst = rel; where = "Mo["+i+"] num="+num+" an="+an; }
    }
  }
  // no-touch: retriever grads must be absent/zero (we never call their backward)
  let touch = 0;
  for (const P of [...u22cSParams(S), ...u22cScorerParams(C), ...u22bHFParams(HF), ...u26INHParams(INH)])
    for (let i = 0; i < P.g.length; i++) touch += Math.abs(P.g[i]);
  const pass = worst <= 1e-4 && touch === 0;
  log("u31-gradcheck worstBCE="+worst.toExponential(2)+" at "+where+" retrieverTouch="+touch+" PASS="+pass);
  return { worst, where, touch, pass };
};
globalThis.u31Stage1 = async function (fs, log, opts) {
  const seed = (opts && opts.seed) || 0;
  const body = await globalThis.u26Stage1(fs, log, { seed });
  body.spec = "self-u31-monitor-prereg";
  body.test = "u31-stage1";
  log("u31-stage1 (via u26 harness, mining identical) seed="+seed+" oracle="+body.floor.oracleY+" minerY="+body.floor.minerY);
  return body;
};
globalThis.runU31Train = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const force = opts && opts.force;
  const steps = 800, B = 16, lr = 5e-3, K = 5, H = 48, Cc = 6, NHARD = 8;
  const tag = arm+"-s"+seed+"-"+steps+"st";
  const ledgerPath = "src/evidence/decomp/d-newai-self-"+tag+".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE" && !force) { log(ledgerPath+" exists, skip"); return prev; } } catch (e) {}
  await globalThis.SelfU31Init(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const M = await loadU1W6(fs, G, seed);
  const MP = await loadU1M2nb(fs, G, seed);
  const HDold = await loadU16U5head(fs, G, seed);
  const minerHF = await loadU21Miner(fs, G, seed);
  // frozen retriever from U28 comp same seed
  const tr28 = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-u28-comp-s"+seed+"-800st.json"));
  if (!tr28 || tr28.verdict !== "COMPLETE") throw new Error("u28 comp train missing for seed "+seed);
  const S = u22cMakeS(G.makeRng(1)), SC = u22cMakeScorer(G.makeRng(1)), HF = u22bMakeHF(G.makeRng(1)), INH = u26MakeINH(G.makeRng(1));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(S.W, tr28.P.SW); load(S.b, tr28.P.Sb); load(SC.w, tr28.P.CW); load(SC.b, tr28.P.Cb);
  load(HF.W1, tr28.P.HW1); load(HF.b1, tr28.P.Hb1); load(HF.W2, tr28.P.HW2); load(HF.b2, tr28.P.Hb2);
  load(INH.W1, tr28.P.IW1); load(INH.b1, tr28.P.Ib1); load(INH.W2, tr28.P.IW2); load(INH.b2, tr28.P.Ib2);
  const snap = [S.W, S.b, SC.w, SC.b, HF.W1, HF.b1, HF.W2, HF.b2, INH.W1, INH.b1, INH.W2, INH.b2].map(p => Float64Array.from(p.v));
  const Mo = u31MakeMon(G.makeRng(79500+seed*7919+u31ArmCode(arm)*131));
  const hParams = [...u31MonParams(Mo)];
  const opt = new G.Adam(lr);
  const dataRng = G.makeRng(42200+seed*104729+77);
  const mineRng = G.makeRng(65300+seed);
  let fixedMasks = null; { const fr = G.makeRng(91000+seed); fixedMasks = []; for (let k = 0; k < K; k++) { const m = new Float64Array(H); for (let i = 0; i < H; i++) m[i] = fr.int(10) < 5 ? 2 : 0; fixedMasks.push(m); } }
  const t0 = Date.now(), curve = [];
  let mineTries = 0, mineFallback = 0, hardKept = 0, vetoSum = 0, vetoN = 0;
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
      const w1 = u31Winner(pf);
      const encW = new Float64Array(8); for (let k = 0; k < 8; k++) encW[k] = pf.enc[w1*8+k];
      const y = u31IsTrue(w1) ? 1 : 0;
      const fw = u31MonForward(Mo, encW, row.Eqk);
      const bw = u31MonBackward(Mo, fw, encW, row.Eqk, y);
      lsum += bw.loss;
      if (fw.p < 0.5) vetoSum++;
      vetoN++;
    }
    for (const p of hParams) for (let i = 0; i < p.g.length; i++) p.g[i] /= B;
    let s = 0; for (const p of hParams) for (let i = 0; i < p.g.length; i++) s += p.g[i]*p.g[i];
    const n = Math.sqrt(s); if (n > 1.0) { const sc = 1.0/n; for (const p of hParams) for (let i = 0; i < p.g.length; i++) p.g[i] *= sc; }
    opt.step(hParams);
    if (step % 100 === 0 || step === steps-1) curve.push({ step, loss: +(lsum/B).toFixed(6) });
  }
  const all = [S.W, S.b, SC.w, SC.b, HF.W1, HF.b1, HF.W2, HF.b2, INH.W1, INH.b1, INH.W2, INH.b2];
  let maxDrift = 0;
  for (let pi = 0; pi < all.length; pi++) for (let i = 0; i < all[pi].v.length; i++) { const dd = Math.abs(all[pi].v[i]-snap[pi][i]); if (dd > maxDrift) maxDrift = dd; }
  const save = o => Array.from(o.v);
  const body = { spec: "self-u31-monitor-prereg", track: "U31", arm, seed, steps, B, lr, gatedEval: true,
    routing: "no-touch: retriever S/C/INH/HF frozen from u28-comp-s"+seed+" (never stepped, no grads)",
    frozenFrom: "d-newai-self-u28-comp-s"+seed+"-800st.json",
    maxFrozenDrift: maxDrift, verdict: "COMPLETE", wallMs: Date.now()-t0, curve,
    mining: { tries: mineTries, hardKept, fallback: mineFallback, hardRate: +(hardKept/Math.max(1, mineTries)).toFixed(4) },
    vetoRateTrain: +(vetoSum/Math.max(1, vetoN)).toFixed(4),
    P: { MW1: save(Mo.W1), Mb1: save(Mo.b1), MW2: save(Mo.W2), Mb2: save(Mo.b2) } };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("u31-train "+tag+" loss0="+curve[0].loss+" lossN="+curve[curve.length-1].loss+" vetoRate="+body.vetoRateTrain+" frozenDrift="+maxDrift);
  return body;
};
globalThis.runU31Eval = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const force = opts && opts.force;
  const steps = 800, N = 200;
  const tag = arm+"-s"+seed+"-"+steps+"st";
  const ledgerPath = "src/evidence/decomp/d-newai-self-eval-"+tag+".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE" && !force) { log(ledgerPath+" exists, skip"); return prev; } } catch (e) {}
  await globalThis.SelfU31Init(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const M = await loadU1W6(fs, G, seed);
  const MP = await loadU1M2nb(fs, G, seed);
  const tr28 = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-u28-comp-s"+seed+"-800st.json"));
  const tr31 = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-"+tag+".json"));
  const ev28 = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-eval-u28-comp-s"+seed+"-800st.json"));
  const S = u22cMakeS(G.makeRng(1)), SC = u22cMakeScorer(G.makeRng(1)), HF = u22bMakeHF(G.makeRng(1)), INH = u26MakeINH(G.makeRng(1));
  const Mo = u31MakeMon(G.makeRng(1));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(S.W, tr28.P.SW); load(S.b, tr28.P.Sb); load(SC.w, tr28.P.CW); load(SC.b, tr28.P.Cb);
  load(HF.W1, tr28.P.HW1); load(HF.b1, tr28.P.Hb1); load(HF.W2, tr28.P.HW2); load(HF.b2, tr28.P.Hb2);
  load(INH.W1, tr28.P.IW1); load(INH.b1, tr28.P.Ib1); load(INH.W2, tr28.P.IW2); load(INH.b2, tr28.P.Ib2);
  load(Mo.W1, tr31.P.MW1); load(Mo.b1, tr31.P.Mb1); load(Mo.W2, tr31.P.MW2); load(Mo.b2, tr31.P.Mb2);
  const minerHF = await loadU21Miner(fs, G, seed);
  let evalMasks = null; { const fr2 = G.makeRng(91000+seed); evalMasks = []; for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr2.int(10) < 5 ? 2 : 0; evalMasks.push(m); } }
  const argmax4 = a => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  const HDold = await loadU16U5head(fs, G, seed);
  // full-pool forward (forced) and fallback forward (exclude w1)
  const fwdFull = (h, slots) => {
    const pf = u26PoolForward(S, SC, INH, slots);
    const x = new Float64Array(56); x.set(h, 0); x.set(pf.summary, 48);
    const f = siluFwd(HF.W1, HF.b1, HF.W2, HF.b2, x, 56, 24, 4);
    return { out: f.out, pf };
  };
  const fwdFallback = (h, slots, pf, w1) => {
    const N2 = 250;
    let mx = -1e300;
    for (let i = 0; i < N2; i++) { if (i === w1) continue; if (pf.scores[i] > mx) mx = pf.scores[i]; }
    const w = new Float64Array(N2); let z = 0;
    for (let i = 0; i < N2; i++) { if (i === w1) { w[i] = 0; continue; } w[i] = Math.exp(pf.scores[i]-mx); z += w[i]; }
    for (let i = 0; i < N2; i++) w[i] /= z;
    const summary = new Float64Array(8);
    for (let i = 0; i < N2; i++) for (let k = 0; k < 8; k++) summary[k] += w[i]*pf.enc[i*8+k];
    const x = new Float64Array(56); x.set(h, 0); x.set(summary, 48);
    const f = siluFwd(HF.W1, HF.b1, HF.W2, HF.b2, x, 56, 24, 4);
    return { out: f.out };
  };
  const monP = (pf, Eqk) => {
    const w1 = u31Winner(pf);
    const encW = new Float64Array(8); for (let k = 0; k < 8; k++) encW[k] = pf.enc[w1*8+k];
    return { p: u31MonForward(Mo, encW, Eqk).p, w1 };
  };
  // standard rows (scr/two, U28-identical)
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
  // adapt rows (top2 select, U28-identical)
  const arng = G.makeRng(61000+seed);
  let adaptY = 0, adaptV = 0, hitTop2 = 0;
  for (let i = 0; i < N; i++) {
    const ep = genAdaptEpisode(arng);
    const sup = ep.sup.map(se => ({ qkId: se.qk, vId: 4+se.v, forceZero: false }));
    const e = ep.query;
    const fw1 = inSeqForward(M, e.x, new Float64Array(8), evalMasks);
    const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = M.E.v[e.qk*12+d];
    const fr = m2ReadForward(M, MP, Eqk, sup);
    const headOld = u16U5HeadOut(HDold, fw1.h);
    const h = Float64Array.from(fw1.h), read = Float64Array.from(fr.readLogits), hv = Float64Array.from(fw1.hvLog);
    const carry = new Float64Array(8);
    const trueVecs = u22cTrueSlots(read, hv, headOld, carry);
    const slots = u22cBuildSlots(G.makeRng(71000+seed*1000+i), trueVecs);
    const r = fwdFull(h, slots);
    if (u31IsTrue(r.pf.top2[0]) || u31IsTrue(r.pf.top2[1])) hitTop2++;
    const ens = new Float64Array(4); for (let o = 0; o < 4; o++) ens[o] = hv[o]+read[o]+r.out[o];
    const vhat = argmax4(ens);
    if (vhat === e.v) adaptV++;
    const x2m = [9,9,9,9,9,9,e.qk,e.k,vhat,8];
    const fw2 = inSeqForward(M, x2m, new Float64Array(8), evalMasks);
    if (argmax4(inMeanLogits({ logitsK: fw2.logitsK })) === e.y) adaptY++;
  }
  // hard rows x3 modes
  const arngH = G.makeRng(66300+seed);
  let hardN = 0, hardFallback = 0, ri = 0;
  let vetoLure = 0, lureN = 0, vetoHit = 0, hitN = 0;
  let mV = 0, fV = 0, aV = 0, mY = 0, fY = 0, hardHit = 0, hardNoInhY = 0, minerOK = 0, minerVok = 0, oracleY = 0, hardYsumAbl = 0;
  let inhTrueSum = 0, inhDistSum = 0, inhTrueN = 0, inhDistN = 0;
  const modeVhat = (mode, h, slots, pf, hv, read, Eqk) => {
    const w1 = u31Winner(pf);
    let useFb = (mode === 2);
    if (mode === 1) {
      const encW = new Float64Array(8); for (let k = 0; k < 8; k++) encW[k] = pf.enc[w1*8+k];
      useFb = (u31MonForward(Mo, encW, Eqk).p < 0.5);
    }
    const out = useFb ? fwdFallback(h, slots, pf, w1).out : fwdFull(h, slots).out;
    const ens = new Float64Array(4); for (let o = 0; o < 4; o++) ens[o] = hv[o]+read[o]+out[o];
    return { vhat: argmax4(ens), vetoed: useFb };
  };
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
    const r = fwdFull(h, slots);
    const w1 = u31Winner(r.pf);
    const y1 = u31IsTrue(w1);
    const mp = monP(r.pf, Eqk);
    const vetoed = mp.p < 0.5;
    if (y1) { hitN++; if (vetoed) vetoHit++; } else { lureN++; if (vetoed) vetoLure++; }
    if (u31IsTrue(r.pf.top2[0]) || u31IsTrue(r.pf.top2[1])) hardHit++;
    for (const ti of U31_TRUE) { inhTrueSum += r.pf.inh[ti]; inhTrueN++; }
    for (let si = 0; si < 250; si++) { if (!U31_TRUE.includes(si)) { inhDistSum += r.pf.inh[si]; inhDistN++; } }
    const outs = [0, 1, 2].map(md => modeVhat(md, h, slots, r.pf, hv, read, Eqk));
    const ys = outs.map(o => {
      const x2m = [9,9,9,9,9,9,e.qk,e.k,o.vhat,8];
      const fw2 = inSeqForward(M, x2m, new Float64Array(8), evalMasks);
      return argmax4(inMeanLogits({ logitsK: fw2.logitsK })) === e.y ? 1 : 0;
    });
    const vs = outs.map(o => o.vhat === e.v ? 1 : 0);
    fV += vs[0]; mV += vs[1]; aV += vs[2];
    fY += ys[0]; mY += ys[1];
    // U28-identical auxiliaries (forced path): no-inh, ablated, summary-ablated, miner, oracle
    const lin = r.pf.scores;
    const N2 = 250;
    const linFull = new Float64Array(N2);
    for (let i = 0; i < N2; i++) linFull[i] = lin[i]+r.pf.inh[i];
    let mx = -1e300; for (let i = 0; i < N2; i++) if (linFull[i] > mx) mx = linFull[i];
    const w = new Float64Array(N2); let z = 0;
    for (let i = 0; i < N2; i++) { w[i] = Math.exp(linFull[i]-mx); z += w[i]; }
    for (let i = 0; i < N2; i++) w[i] /= z;
    const summary = new Float64Array(8);
    for (let i = 0; i < N2; i++) for (let k = 0; k < 8; k++) summary[k] += w[i]*r.pf.enc[i*8+k];
    const xx = new Float64Array(56); xx.set(h, 0); xx.set(summary, 48);
    const ff = siluFwd(HF.W1, HF.b1, HF.W2, HF.b2, xx, 56, 24, 4);
    const ensN = new Float64Array(4); for (let o = 0; o < 4; o++) ensN[o] = hv[o]+read[o]+ff.out[o];
    const x2n = [9,9,9,9,9,9,e.qk,e.k,argmax4(ensN),8];
    if (argmax4(inMeanLogits({ logitsK: inSeqForward(M, x2n, new Float64Array(8), evalMasks).logitsK })) === e.y) hardNoInhY++;
    const ensA = new Float64Array(4); for (let o = 0; o < 4; o++) ensA[o] = hv[o]+read[o];
    const x2a = [9,9,9,9,9,9,e.qk,e.k,argmax4(ensA),8];
    const fw2a = inSeqForward(M, x2a, new Float64Array(8), evalMasks);
    const mo = u18HeadForward(minerHF, h).out;
    const ensM = new Float64Array(4); for (let o = 0; o < 4; o++) ensM[o] = hv[o]+read[o]+mo[o];
    const vhatM = argmax4(ensM);
    if (vhatM === e.v) minerVok++;
    const x2mM = [9,9,9,9,9,9,e.qk,e.k,vhatM,8];
    if (argmax4(inMeanLogits({ logitsK: inSeqForward(M, x2mM, new Float64Array(8), evalMasks).logitsK })) === e.y) minerOK++;
    const x2o = [9,9,9,9,9,9,e.qk,e.k,e.v,8];
    if (argmax4(inMeanLogits({ logitsK: inSeqForward(M, x2o, new Float64Array(8), evalMasks).logitsK })) === e.y) oracleY++;
    const xz = new Float64Array(56); xz.set(h, 0);
    const fz = siluFwd(HF.W1, HF.b1, HF.W2, HF.b2, xz, 56, 24, 4);
    const ensS = new Float64Array(4); for (let o = 0; o < 4; o++) ensS[o] = hv[o]+read[o]+fz.out[o];
    const x2s = [9,9,9,9,9,9,e.qk,e.k,argmax4(ensS),8];
    if (argmax4(inMeanLogits({ logitsK: inSeqForward(M, x2s, new Float64Array(8), evalMasks).logitsK })) === e.y) hardYsumAbl++;
    ri++;
  }
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
  const catchD = (vetoLure/Math.max(1, lureN))-(vetoHit/Math.max(1, hitN));
  const body = { spec: "self-u31-monitor-prereg", track: "U31", arm, seed, steps, verdict: "COMPLETE", n: N, gatedEval: true,
    miningRule: "vhatM!=e.v AND oracleY correct (argmax-only, U23b D1)",
    accScratch: +(scr/N).toFixed(4), accTwo: +(two/N).toFixed(4), adaptY: +(adaptY/N).toFixed(4), adaptV: +(adaptV/N).toFixed(4),
    selectHit: +(hitTop2/N).toFixed(4),
    hardSelectHit: +(hardHit/N).toFixed(4), wallRefU28: ev28.hardSelectHit, wallExact: +(hardHit/N).toFixed(4) === ev28.hardSelectHit,
    vetoRateLure: +(vetoLure/Math.max(1, lureN)).toFixed(4), vetoRateHit: +(vetoHit/Math.max(1, hitN)).toFixed(4),
    catchD: +catchD.toFixed(4), lureN, hitN,
    hardAdaptV_forced: +(fV/N).toFixed(4), hardAdaptV_mon: +(mV/N).toFixed(4), hardAdaptV_alwaysVeto: +(aV/N).toFixed(4),
    lift: +((mV-fV)/N).toFixed(4), selmon: +((mV-aV)/N).toFixed(4),
    hardAdaptY_forced: +(fY/N).toFixed(4), hardAdaptY_mon: +(mY/N).toFixed(4),
    hardNoInhY: +(hardNoInhY/N).toFixed(4),
    hardSummaryAblated: +(hardYsumAbl/N).toFixed(4), hardSummaryDrop: +((mY-hardYsumAbl)/N).toFixed(4),
    inhTrueMean: +(inhTrueSum/Math.max(1, inhTrueN)).toFixed(4), inhDistMean: +(inhDistSum/Math.max(1, inhDistN)).toFixed(4),
    inhibSeparates: +((inhDistSum/Math.max(1, inhDistN))-(inhTrueSum/Math.max(1, inhTrueN))).toFixed(4),
    minerFloor: +(minerOK/N).toFixed(4), minerV: +(minerVok/N).toFixed(4), oracleY: +(oracleY/N).toFixed(4), hardFallback,
    oodAdaptY: +(oodY/N).toFixed(4),
    frozenDriftTrain: tr31.maxFrozenDrift, mining: tr31.mining };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("u31-eval "+tag+" sel="+body.hardSelectHit+" wallExact="+body.wallExact+" catchD="+body.catchD+" lift="+body.lift+" selmon="+body.selmon+" fV="+body.hardAdaptV_forced+" mV="+body.hardAdaptV_mon+" aV="+body.hardAdaptV_alwaysVeto+" fY="+body.hardAdaptY_forced+" mY="+body.hardAdaptY_mon);
  return body;
};
