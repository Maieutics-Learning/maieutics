// newai-selfu25-driver.js — U25 assembly-competition scorer (surgery on U23b).
// SAME forward + SAME vhat-mining diet as U23b (250 slots, shared S 4->8, scorer, soft pool tau=1.0,
// combiner 56->24->4, 8 standard + 8 vhat-hard rows, cap 20, B16/800st/lr5e-3, codes 165/166).
// ONE new thing: contrastive scorer loss on ADAPT rows: Lcomp = max(0, 1 - (mean(true scores) -
// mean(top-8 distractor scores))), weight 1.0. Gate DROPPED (U24 GATE-FAIL: converged ~0.75 constant).
// DEVIATIONS/PINS (filed): D1 train-mining uses DEDICATED G.makeRng(65300+seed) (spec-faithful;
// U23b incidentally shared dataRng — see Turn-116 bridge). Forward graph identical to U23b.
globalThis.SelfU25Init = async function (fs) {
  for (const p of ["src/evidence/decomp/newai-selfu23b-driver.js"]) {
    const src = await fs.readTextFile(p); (0, eval)(src + "\n//# sourceURL=" + p);
  }
  await globalThis.SelfU23bInit(fs);
  if (!globalThis.runU23bTrain) throw new Error("u25 stack load failed");
};
function u25ArmCode(arm) { if (arm === "u25-comp") return 165; if (arm === "u25-shuf") return 166; return 165; }
const U25_TRUE = [7,41,129,166,203];
const U25_MARGIN = 1.0, U25_LAMC = 1.0;
// Contrastive hinge on scorer scores. Returns {loss, dLds} with dLds a 250-vector.
function u25Contrastive(scores) {
  let meanT = 0; for (const i of U25_TRUE) meanT += scores[i]; meanT /= U25_TRUE.length;
  const rest = [];
  for (let i = 0; i < 250; i++) { if (!U25_TRUE.includes(i)) rest.push([scores[i], i]); }
  rest.sort((a, b) => b[0]-a[0]);
  const top8 = rest.slice(0, 8);
  let meanD = 0; for (const [s] of top8) meanD += s; meanD /= 8;
  const viol = U25_MARGIN-(meanT-meanD);
  const dLds = new Float64Array(250);
  if (viol > 0) {
    for (const i of U25_TRUE) dLds[i] = -U25_LAMC/U25_TRUE.length;
    for (const [, i] of top8) dLds[i] = U25_LAMC/8;
  }
  return { loss: Math.max(0, viol), dLds, meanT, meanD };
}
// Backprop dLds (dL/dscores) through scorer + encoder into C/S .g.
function u25ContrastiveBackward(S, C, pf, dLds) {
  const N = 250;
  const dEnc = new Float64Array(N*8);
  for (let s = 0; s < N; s++) {
    if (dLds[s] === 0) continue;
    C.b.g[0] += dLds[s];
    for (let k = 0; k < 8; k++) { C.w.g[k] += dLds[s]*pf.enc[s*8+k]; dEnc[s*8+k] += dLds[s]*C.w.v[k]; }
  }
  const slots = pf.cache.slots;
  for (let i = 0; i < N; i++) {
    for (let k = 0; k < 8; k++) {
      if (dEnc[i*8+k] === 0) continue;
      let s = S.b.v[k];
      for (let d = 0; d < 4; d++) s += S.W.v[k*4+d]*slots[i*4+d];
      const sig = 1/(1+Math.exp(-s));
      const dpre = dEnc[i*8+k]*(sig+s*sig*(1-sig));
      S.b.g[k] += dpre;
      for (let d = 0; d < 4; d++) S.W.g[k*4+d] += dpre*slots[i*4+d];
    }
  }
}
globalThis.u25GradCheck = async function (fs, log) {
  await globalThis.SelfU25Init(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const S = u22cMakeS(G.makeRng(4343)), C = u22cMakeScorer(G.makeRng(4344)), HF = u22bMakeHF(G.makeRng(4345));
  const hrng = G.makeRng(21);
  const h = new Float64Array(48); for (let i = 0; i < 48; i++) h[i] = hrng.uniform(-0.5, 0.5);
  const slots = new Float64Array(250*4); for (let i = 0; i < slots.length; i++) slots[i] = hrng.uniform(-0.5, 0.5);
  const hv = new Float64Array([0.1,-0.2,0.05,0.0]), read = new Float64Array([0.0,0.1,-0.1,0.05]);
  const target = new Float64Array([0.2,-0.1,0.0,0.1]); const v = 1; const wStd = 1.0;
  const lossFn = () => {
    const pf = u22cPoolForward(S, C, slots);
    const x = new Float64Array(56); x.set(h, 0); x.set(pf.summary, 48);
    const f = siluFwd(HF.W1, HF.b1, HF.W2, HF.b2, x, 56, 24, 4);
    const ens = new Float64Array(4); for (let o = 0; o < 4; o++) ens[o] = hv[o]+read[o]+f.out[o];
    const ce = inCELossGrad(ens, v);
    let mse = 0; for (let o = 0; o < 4; o++) mse += wStd*(f.out[o]-target[o])*(f.out[o]-target[o])/4;
    return ce.loss+mse+U25_LAMC*u25Contrastive(pf.scores).loss;
  };
  for (const p of [...u22cSParams(S), ...u22cScorerParams(C), ...u22bHFParams(HF)]) p.g.fill(0);
  const pf = u22cPoolForward(S, C, slots);
  const x = new Float64Array(56); x.set(h, 0); x.set(pf.summary, 48);
  const f = siluFwd(HF.W1, HF.b1, HF.W2, HF.b2, x, 56, 24, 4);
  const ens = new Float64Array(4); for (let o = 0; o < 4; o++) ens[o] = hv[o]+read[o]+f.out[o];
  const ce = inCELossGrad(ens, v);
  const d = new Float64Array(4);
  for (let o = 0; o < 4; o++) d[o] = ce.d[o]+wStd*(f.out[o]-target[o])/2;
  siluBwd(HF.W1, HF.b1, HF.W2, HF.b2, x, 56, 24, 4, f.cache, d);
  const dhaHF = new Float64Array(24);
  for (let j = 0; j < 24; j++) { let s = 0; for (let o = 0; o < 4; o++) s += HF.W2.v[o*24+j]*d[o]; const sig = 1/(1+Math.exp(-f.cache.pre[j])); dhaHF[j] = s*(sig+f.cache.pre[j]*sig*(1-sig)); }
  const dsum = new Float64Array(8);
  for (let k = 0; k < 8; k++) { let s = 0; for (let j = 0; j < 24; j++) s += HF.W1.v[j*56+48+k]*dhaHF[j]; dsum[k] = s; }
  u22cPoolBackward(S, C, pf, dsum);
  const cmp = u25Contrastive(pf.scores);
  u25ContrastiveBackward(S, C, pf, cmp.dLds);
  const eps = 1e-6; let worst = 0, worstWhere = "";
  const check = (P, name) => {
    for (let i = 0; i < Math.min(P.v.length, 6); i++) {
      P.v[i] += eps; const a1 = lossFn(); P.v[i] -= 2*eps; const a0 = lossFn(); P.v[i] += eps;
      const num = (a1-a0)/(2*eps), an = P.g[i];
      const denom = Math.max(1e-12, Math.abs(num)+Math.abs(an));
      const rel = Math.abs(num-an)/denom;
      if (Math.abs(num) < 1e-9 && Math.abs(an) < 1e-9) continue;
      if (rel > worst) { worst = rel; worstWhere = name+"["+i+"] num="+num+" an="+an; }
    }
  };
  check(HF.W2, "HF.W2"); check(S.W, "S.W"); check(C.w, "C.w"); check(HF.W1, "HF.W1"); check(S.b, "S.b"); check(C.b, "C.b");
  const pass = worst <= 1e-4;
  log("u25-gradcheck worstRel="+worst.toExponential(2)+" at "+worstWhere+" PASS="+pass);
  return { worstRel: worst, worstWhere, pass };
};
globalThis.u25Stage1 = async function (fs, log, opts) {
  const seed = (opts && opts.seed) || 0;
  await globalThis.SelfU25Init(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const M = await loadU1W6(fs, G, seed);
  const MP = await loadU1M2nb(fs, G, seed);
  const minerHF = await loadU21Miner(fs, G, seed);
  let fixedMasks = null; { const fr = G.makeRng(91000+seed); fixedMasks = []; for (let k = 0; k < 5; k++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr.int(10) < 5 ? 2 : 0; fixedMasks.push(m); } }
  const rng = G.makeRng(45477+seed);
  let fails = 0, tries = 0; const N = 200;
  for (let i = 0; i < N; i++) {
    for (let t = 0; t < 20; t++) {
      tries++;
      const ep = genAdaptEpisode(rng);
      if (u23bVhatKeep(M, MP, minerHF, fixedMasks, ep).keep) { fails++; break; }
    }
  }
  const rng2 = G.makeRng(45477+seed);
  let fails2 = 0;
  for (let i = 0; i < N; i++) {
    for (let t = 0; t < 20; t++) {
      const ep = genAdaptEpisode(rng2);
      if (u23bVhatKeep(M, MP, minerHF, fixedMasks, ep).keep) { fails2++; break; }
    }
  }
  const argmax4 = a => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  const arngH = G.makeRng(66300+seed);
  let minerOK = 0, minerVok = 0, oracleY = 0, hardFallback = 0, hardN = 0;
  while (hardN < N) {
    let kept = null;
    for (let t = 0; t < 20; t++) {
      const ep = genAdaptEpisode(arngH);
      if (u23bVhatKeep(M, MP, minerHF, fixedMasks, ep).keep) { kept = ep; break; }
      if (t === 19) { kept = ep; hardFallback++; }
    }
    hardN++;
    const sup = kept.sup.map(se => ({ qkId: se.qk, vId: 4+se.v, forceZero: false }));
    const e = kept.query;
    const fw1 = inSeqForward(M, e.x, new Float64Array(8), fixedMasks);
    const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = M.E.v[e.qk*12+d];
    const fr = m2ReadForward(M, MP, Eqk, sup);
    const mo = u18HeadForward(minerHF, Float64Array.from(fw1.h)).out;
    const ensM = new Float64Array(4); for (let o = 0; o < 4; o++) ensM[o] = fw1.hvLog[o]+fr.readLogits[o]+mo[o];
    if (argmax4(ensM) === e.v) minerVok++;
    const x2o = [9,9,9,9,9,9,e.qk,e.k,e.v,8];
    if (argmax4(inMeanLogits({ logitsK: inSeqForward(M, x2o, new Float64Array(8), fixedMasks).logitsK })) === e.y) oracleY++;
    if (minerAdaptCorrect(M, MP, minerHF, fixedMasks, kept)) minerOK++;
  }
  const body = { spec: "self-u25-competition-prereg", test: "u25-stage1", seed, N,
    harness: { vhatHardRate: +(N/tries).toFixed(4), tries, deterministic: (fails === fails2) },
    floor: { minerV: +(minerVok/N).toFixed(4), minerY: +(minerOK/N).toFixed(4), oracleY: +(oracleY/N).toFixed(4), fallback: hardFallback } };
  log("u25-stage1 seed="+seed+" hardRate="+body.harness.vhatHardRate+" det="+body.harness.deterministic+
    " minerV="+body.floor.minerV+" minerY="+body.floor.minerY+" oracle="+body.floor.oracleY+" fb="+hardFallback);
  return body;
};
globalThis.runU25Train = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const force = opts && opts.force;
  const steps = 800, B = 16, lr = 5e-3, K = 5, H = 48, Cc = 6, wAdapt = 0.5, wStd = 1.0, NHARD = 8;
  const tag = arm+"-s"+seed+"-"+steps+"st";
  const ledgerPath = "src/evidence/decomp/d-newai-self-"+tag+".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE" && !force) { log(ledgerPath+" exists, skip"); return prev; } } catch (e) {}
  await globalThis.SelfU25Init(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const M = await loadU1W6(fs, G, seed);
  const MP = await loadU1M2nb(fs, G, seed);
  const HDold = await loadU16U5head(fs, G, seed);
  const LT = await loadU17Teacher(fs, G, seed);
  const minerHF = await loadU21Miner(fs, G, seed);
  const S = u22cMakeS(G.makeRng(78000+seed*7919+u25ArmCode(arm)*131));
  const SC = u22cMakeScorer(G.makeRng(78100+seed*7919+u25ArmCode(arm)*131));
  const HF = u22bMakeHF(G.makeRng(79000+seed*7919+u25ArmCode(arm)*131));
  const hParams = [...u22cSParams(S), ...u22cScorerParams(SC), ...u22bHFParams(HF)];
  const opt = new G.Adam(lr);
  const dataRng = G.makeRng(42200+seed*104729+77);
  const mineRng = G.makeRng(65300+seed); // D1: dedicated mining stream (spec-faithful)
  let fixedMasks = null; { const fr = G.makeRng(91000+seed); fixedMasks = []; for (let k = 0; k < K; k++) { const m = new Float64Array(H); for (let i = 0; i < H; i++) m[i] = fr.int(10) < 5 ? 2 : 0; fixedMasks.push(m); } }
  const M0snap = inSeqParams(M).map(p => Float64Array.from(p.v));
  const isShuf = (arm === "u25-shuf");
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
      let kept = null, keptSup = null;
      for (let t = 0; t < 20; t++) {
        mineTries++;
        const ep = genAdaptEpisode(mineRng);
        if (u23bVhatKeep(M, MP, minerHF, fixedMasks, ep).keep) { kept = ep; hardKept++; break; }
        if (t === 19) { kept = ep; mineFallback++; }
      }
      keptSup = { list: kept.sup.map(se => ({ qkId: se.qk, vId: 4+se.v, forceZero: false })), isAdapt: true };
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
      const pf = u22cPoolForward(S, SC, zslots);
      const x = new Float64Array(56); x.set(row.h, 0); x.set(pf.summary, 48);
      const f = siluFwd(HF.W1, HF.b1, HF.W2, HF.b2, x, 56, 24, 4);
      const ens = new Float64Array(4); for (let o = 0; o < 4; o++) ens[o] = row.hv[o]+row.read[o]+f.out[o];
      const ce = inCELossGrad(ens, row.e.v);
      let rowLoss = ce.loss;
      let mse = 0; for (let o = 0; o < 4; o++) { const dd = f.out[o]-target[o]; mse += w*dd*dd/4; }
      rowLoss += mse;
      if (row.isAdapt) {
        const cmp = u25Contrastive(pf.scores);
        rowLoss += U25_LAMC*cmp.loss;
        compSum += cmp.loss; compN++;
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
      u22cPoolBackward(S, SC, pf, dsum);
      if (row.isAdapt) {
        const cmp = u25Contrastive(pf.scores);
        u25ContrastiveBackward(S, SC, pf, cmp.dLds.map(v => v/B));
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
  const body = { spec: "self-u25-competition-prereg", track: "U25", arm, seed, steps, B, lr, wAdapt, wStd, lamC: U25_LAMC, margin: U25_MARGIN, gatedEval: true,
    teacher: "u17-gated-s"+seed+" (true-20 only)", miner: "u21-lowfold-s"+seed,
    miningRule: "vhatM!=e.v AND oracleY correct (argmax-only, U23b D1); DEDICATED mineRng 65300+seed (D1)",
    frozenAll: true, maxFrozenDrift: maxDrift, verdict: "COMPLETE", wallMs: Date.now()-t0, curve,
    mining: { tries: mineTries, hardKept, fallback: mineFallback, hardRate: +(hardKept/Math.max(1, mineTries)).toFixed(4) },
    compLossMean: +(compSum/Math.max(1, compN)).toFixed(4),
    P: { SW: save(S.W), Sb: save(S.b), CW: save(SC.w), Cb: save(SC.b), HW1: save(HF.W1), Hb1: save(HF.b1), HW2: save(HF.W2), Hb2: save(HF.b2) } };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("u25-train "+tag+" loss0="+curve[0].loss+" lossN="+curve[curve.length-1].loss+" hardRate="+body.mining.hardRate+" compMean="+body.compLossMean+" frozenDrift="+maxDrift);
  return body;
};
globalThis.runU25Eval = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const force = opts && opts.force;
  const steps = 800, N = 200;
  const tag = arm+"-s"+seed+"-"+steps+"st";
  const ledgerPath = "src/evidence/decomp/d-newai-self-eval-"+tag+".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE" && !force) { log(ledgerPath+" exists, skip"); return prev; } } catch (e) {}
  await globalThis.SelfU25Init(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const M = await loadU1W6(fs, G, seed);
  const MP = await loadU1M2nb(fs, G, seed);
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-"+tag+".json"));
  const S = u22cMakeS(G.makeRng(1)), SC = u22cMakeScorer(G.makeRng(1)), HF = u22bMakeHF(G.makeRng(1));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(S.W, tr.P.SW); load(S.b, tr.P.Sb); load(SC.w, tr.P.CW); load(SC.b, tr.P.Cb);
  load(HF.W1, tr.P.HW1); load(HF.b1, tr.P.Hb1); load(HF.W2, tr.P.HW2); load(HF.b2, tr.P.Hb2);
  const minerHF = await loadU21Miner(fs, G, seed);
  let evalMasks = null; { const fr2 = G.makeRng(91000+seed); evalMasks = []; for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr2.int(10) < 5 ? 2 : 0; evalMasks.push(m); } }
  const argmax4 = a => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  const fwd = (h, slots) => {
    const pf = u22cPoolForward(S, SC, slots);
    const x = new Float64Array(56); x.set(h, 0); x.set(pf.summary, 48);
    const f = siluFwd(HF.W1, HF.b1, HF.W2, HF.b2, x, 56, 24, 4);
    return { out: f.out, pf };
  };
  const isTrueSlot = idx => U25_TRUE.includes(idx);
  const compRow = pf => {
    let minT = 1e300; for (const i of U25_TRUE) minT = Math.min(minT, pf.scores[i]);
    let maxD = -1e300; for (let i = 0; i < 250; i++) { if (!U25_TRUE.includes(i)) maxD = Math.max(maxD, pf.scores[i]); }
    let meanT = 0; for (const i of U25_TRUE) meanT += pf.scores[i]; meanT /= 5;
    return { strict: maxD < minT, margin: meanT-maxD };
  };
  const srng = G.makeRng(52500+seed), supRng = G.makeRng(42000+seed*104729+999);
  let scr = 0, two = 0;
  const HDold0 = await loadU16U5head(fs, G, seed);
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
  const arngH = G.makeRng(66300+seed);
  let hardY = 0, hardV = 0, hardYabl = 0, hardYsumAbl = 0, hardHit = 0, hardN = 0,
      minerOK = 0, minerVok = 0, oracleY = 0, hardFallback = 0, compStrict = 0, compMarginSum = 0, ri = 0;
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
    if (isTrueSlot(r.pf.top2[0]) || isTrueSlot(r.pf.top2[1])) hardHit++;
    const ens = new Float64Array(4); for (let o = 0; o < 4; o++) ens[o] = hv[o]+read[o]+r.out[o];
    const vhat = argmax4(ens);
    if (vhat === e.v) hardV++;
    const x2m = [9,9,9,9,9,9,e.qk,e.k,vhat,8];
    const fw2 = inSeqForward(M, x2m, new Float64Array(8), evalMasks);
    if (argmax4(inMeanLogits({ logitsK: fw2.logitsK })) === e.y) hardY++;
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
  const body = { spec: "self-u25-competition-prereg", track: "U25", arm, seed, steps, verdict: "COMPLETE", n: N, gatedEval: true,
    miningRule: "vhatM!=e.v AND oracleY correct (argmax-only, U23b D1)",
    accScratch: +(scr/N).toFixed(4), accTwo: +(two/N).toFixed(4), adaptY: +(adaptY/N).toFixed(4), adaptV: +(adaptV/N).toFixed(4),
    adaptYablated: +(adaptYabl/N).toFixed(4), ablateDrop: +((adaptY-adaptYabl)/N).toFixed(4),
    selectHit: +(hitTop2/N).toFixed(4),
    hardAdaptY: +(hardY/N).toFixed(4), hardAdaptV: +(hardV/N).toFixed(4), hardAblated: +(hardYabl/N).toFixed(4),
    hardAblateDrop: +((hardY-hardYabl)/N).toFixed(4), hardSummaryAblated: +(hardYsumAbl/N).toFixed(4),
    hardSummaryDrop: +((hardY-hardYsumAbl)/N).toFixed(4), hardSelectHit: +(hardHit/N).toFixed(4),
    compStrictFrac: +(compStrict/N).toFixed(4), compMarginMean: +(compMarginSum/N).toFixed(4),
    minerFloor: +(minerOK/N).toFixed(4), minerV: +(minerVok/N).toFixed(4), oracleY: +(oracleY/N).toFixed(4), hardFallback,
    oodAdaptY: +(oodY/N).toFixed(4),
    frozenDriftTrain: tr.maxFrozenDrift, mining: tr.mining };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("u25-eval "+tag+" two="+body.accTwo+" adaptY="+body.adaptY+" hardY="+body.hardAdaptY+" sel="+body.hardSelectHit+" comp="+body.compStrictFrac+" margin="+body.compMarginMean+" minerFloor="+body.minerFloor+" ood="+body.oodAdaptY);
  return body;
};
