// newai-selftools-driver.js — Track F internal fresh-eyes (critic + confidence-blend verify).
// Minimal delta on W6/winner recipe: + critic head (H->1, 49 params, bias init 0 per v1.1) +
// Hv re-read on verify pass (shared weights, zero new readout params) + blend. Compose path
// identical to winner (mean2 x1.0 on vhat1-conditioned pass); retrieve readout ensV replaces hv1.
// F-ctl: critic BCE-trained identically, blend fixed beta=0.5 (capacity-matched, isolates USE).
// Deviation filed: critic->trunk grad propagated by a helper replicating inSeqBackward's
// h->inp->E block exactly (inSeqBackward takes no external dh); grad-checked below.
globalThis.SelfInit = async function (fs) {
  for (const p of ["src/evidence/decomp/intrinsic-driver.js", "src/evidence/decomp/newai-driver.js", "src/evidence/decomp/newai-v102-driver.js", "src/evidence/decomp/newai-fr-driver.js", "src/evidence/decomp/newai-div-driver.js", "src/evidence/decomp/newai-cur-driver.js", "src/evidence/decomp/newai-winner-driver.js"]) {
    const src = await fs.readTextFile(p); (0, eval)(src + "\n//# sourceURL=" + p);
  }
  if (!globalThis.runWinnerTrain) throw new Error("self stack load failed");
};
function selfArmCode(arm) {
  if (arm === "f-critic") return 91; if (arm === "f-ctl") return 92; if (arm === "f-critic2") return 93; return 91;
}
function selfUseBlend(arm) { return arm !== "f-ctl"; }
function selfFlip(arm) { return arm === "f-critic2"; } // F2: corrected blend (trust hv1 when likely-correct)
// replicate inSeqBackward h->inp->E block for external dh (same math, filed deviation)
function propDhToTrunk(M, fw, dh) {
  const { H, LEN } = { H: M.H, LEN: M.LEN };
  for (let o = 0; o < H; o++) {
    const sig = 1 / (1 + Math.exp(-fw.hPre[o]));
    const d = dh[o] * (fw.h[o] + sig * (1 - fw.h[o]));
    M.b1.g[o] += d;
    const off = o * (LEN * M.D + M.CD);
    for (let i = 0; i < LEN * M.D + M.CD; i++) { M.W1.g[off + i] += d * fw.inp[i]; }
    for (let t = 0; t < LEN; t++) {
      const id = fw.x[t] >= 0 && fw.x[t] < 10 ? fw.x[t] : 9;
      const eoff = id * M.D;
      for (let dd = 0; dd < M.D; dd++) {
        let s = 0;
        // dinp via W1 column: recompute d*W1 path per t (matches inSeqBackward dinp accumulation)
        s = d * M.W1.v[off + t * M.D + dd];
        M.E.g[eoff + dd] += s;
      }
    }
  }
}
globalThis.selfGradCheck = async function (fs, log, flip) {
  // flip=true verifies the F2 (corrected) graph; false verifies F. Both must pass.
  // Verifies every grad path this driver IMPLEMENTS, exactly (central diffs).
  // Scope note (filed upstream limitation, intrinsic-driver.js NOTE on inBackward): the shared
  // inSeqBackward drops dh-from-carry (carry trains its own Wf/Wc + cOld only). With coupled carry
  // (training config) exact numeric match is therefore impossible BY DESIGN — not a bug here.
  // This check uses DECOUPLED carry (both passes from zeros, dc discarded) so every remaining path
  // (critic, blend, hv2 read, Hv, bootstraps-equivalent, trunk) must match exactly. The limitation
  // applies identically to F-critic and F-ctl, so the paired delta stays a clean comparison, and
  // all prior programs trained under the same approximation (comparability kept).
  const G = await globalThis.IntrinsicInit(fs);
  const rng = G.makeRng(4242);
  const M = inSeqMakeModel(rng);
  const Wc = inParam(G.makeRng(4243), M.H, M.H); const bc = inParam(G.makeRng(4244), 1, 1); bc.v[0] = 0;
  const grng = G.makeRng(4245);
  const e = inSeqGenShift(grng, null);
  const masks = null, c0 = new Float64Array(8);
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  const lossFn = () => {
    const f1 = inSeqForward(M, e.x, new Float64Array(8), masks); // decoupled: pass1 from zeros
    let z = bc.v[0]; for (let i = 0; i < M.H; i++) z += Wc.v[i] * f1.h[i];
    const beta = 1 / (1 + Math.exp(-z));
    const vhat1 = argmax4(f1.hvLog);
    const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat1, 8];
    const f2 = inSeqForward(M, x2m, new Float64Array(8), masks); // decoupled: verify from zeros
    const h2 = new Float64Array(4);
    for (let o = 0; o < 4; o++) { let s = M.bv.v[o]; for (let i = 0; i < M.H; i++) s += M.Hv.v[o * M.H + i] * f2.h[i]; h2[o] = s; }
    const w1l = flip ? 1 - beta : beta, w2l = flip ? beta : 1 - beta;
    const ensV = new Float64Array(4);
    for (let o = 0; o < 4; o++) ensV[o] = w1l * f1.hvLog[o] + w2l * h2[o];
    const wrong1 = vhat1 === e.v ? 0 : 1;
    // exact training-loss structure: auxW scales CE (B=1 here), bceW scales BCE
    const L = 0.5 * inCELossGrad(ensV, e.v).loss + 0.5 * (-(wrong1 * Math.log(beta + 1e-12) + (1 - wrong1) * Math.log(1 - beta + 1e-12)));
    return { L, v1: vhat1 };
  };
  const baseV1 = lossFn().v1;
  // analytic single-example backward (B=1 scale)
  for (const p of inSeqParams(M)) p.g.fill(0);
  Wc.g.fill(0); bc.g.fill(0);
  const fw1 = inSeqForward(M, e.x, new Float64Array(8), masks);
  let z = bc.v[0]; for (let i = 0; i < M.H; i++) z += Wc.v[i] * fw1.h[i];
  const beta = 1 / (1 + Math.exp(-z));
  const vhat1 = argmax4(fw1.hvLog);
  const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat1, 8];
  const fw2 = inSeqForward(M, x2m, new Float64Array(8), masks); // decoupled (see scope note)
  const hv2 = new Float64Array(4);
  for (let o = 0; o < 4; o++) { let s = M.bv.v[o]; for (let i = 0; i < M.H; i++) s += M.Hv.v[o * M.H + i] * fw2.h[i]; hv2[o] = s; }
  const ensV = new Float64Array(4);
  const w1a = flip ? 1 - beta : beta, w2a = flip ? beta : 1 - beta;
  for (let o = 0; o < 4; o++) ensV[o] = w1a * fw1.hvLog[o] + w2a * hv2[o];
  const ceV = inCELossGrad(ensV, e.v);
  const wrong1 = vhat1 === e.v ? 0 : 1;
  const dEns = new Float64Array(4); for (let o = 0; o < 4; o++) dEns[o] = ceV.d[o] * 0.5; // auxW 0.5, B=1
  const dHv1 = new Float64Array(4), dHv2 = new Float64Array(4);
  for (let o = 0; o < 4; o++) { dHv1[o] = w1a * dEns[o]; dHv2[o] = w2a * dEns[o]; }
  let dBeta = 0; for (let o = 0; o < 4; o++) dBeta += (flip ? -1 : 1) * (fw1.hvLog[o] - hv2[o]) * dEns[o];
  // fused sigmoid+BCE: d(bceW*BCE)/dz = bceW*(beta-w) DIRECTLY (dividing by beta*(1-beta) first
  // would double-apply the sigmoid derivative — caught by grad check at exact 4x = 1/(beta*(1-beta)))
  const dz = dBeta * beta * (1 - beta) + 0.5 * (beta - wrong1);
  bc.g[0] += dz;
  const dhCrit = new Float64Array(M.H);
  for (let i = 0; i < M.H; i++) { Wc.g[i] += dz * fw1.h[i]; dhCrit[i] += dz * Wc.v[i]; }
  const dc2 = inSeqBackward(M, fw2, null, null, dHv2, null, masks);
  void dc2; // decoupled check: dc discarded (see scope note); training passes dc2 (exact for Wf/Wc/cOld)
  inSeqBackward(M, fw1, null, null, dHv1, null, masks);
  propDhToTrunk(M, fw1, dhCrit);
  // numeric (central)
  const eps = 1e-6;
  let worst = 0, worstWhere = "", skips = 0;
  const checkParam = (P, name, idxs) => {
    const ii = idxs || P.v.map((_, i) => i).filter((i) => i < 20);
    for (const i of ii) {
      P.v[i] += eps; const r1 = lossFn();
      P.v[i] -= 2 * eps; const r0 = lossFn();
      P.v[i] += eps;
      if (r1.v1 !== baseV1 || r0.v1 !== baseV1) { skips++; continue; } // vhat1 flipped: x2m token changed, numeric meaningless (airtight discrete check)
      const a1 = r1.L, a0 = r0.L;
      if (Math.abs(a1 - a0) > 1e-4) { skips++; continue; } // residual jump guard
      const num = (a1 - a0) / (2 * eps), an = P.g[i];
      const absd = Math.abs(num - an);
      const rel = absd / Math.max(1e-12, Math.abs(num) + Math.abs(an));
      if (rel > worst && absd > 1e-9) { worst = rel; worstWhere = name + "[" + i + "] num=" + num + " an=" + an; }
    }
  };
  checkParam(Wc, "Wc"); checkParam(bc, "bc"); checkParam(M.Hv, "Hv"); checkParam(M.bv, "bv");
  checkParam(M.W1, "W1", [0, 1, 2, 100, 101, 500]);
  { // E rows used by this line, live-array central diffs
    const ids = [...new Set(e.x.filter((x) => x >= 0 && x < 10))].slice(0, 4);
    const idxs = [];
    for (const id of ids) for (let d = 0; d < 3; d++) idxs.push(id * 12 + d);
    checkParam(M.E, "Erows", idxs);
  }
  log("self-gradcheck flip=" + !!flip + " worstRel=" + worst.toExponential(2) + " at " + worstWhere + " skips=" + skips + " (vhat1 flips)");
  if (skips > 20) throw new Error("self grad check too discontinuous: skips=" + skips);
  if (!(worst < 1e-6)) throw new Error("self grad check FAILED worst=" + worst);
  return worst;
};
globalThis.runSelfTrain = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const useBlend = selfUseBlend(arm);
  const flip = selfFlip(arm);
  const C = 6, auxW = 0.5, steps = 800, lam = 2.0, bceW = 0.5;
  const B = 16, lr = 5e-3, K = 5, H = 48;
  const tag = arm + "-s" + seed + "-" + steps + "st";
  const ledgerPath = "src/evidence/decomp/d-newai-self-" + tag + ".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  const G = await globalThis.IntrinsicInit(fs);
  const rng = G.makeRng(76000 + seed * 7919 + selfArmCode(arm) * 131);
  const M = inSeqMakeModel(rng);
  const Wc = inParam(G.makeRng(77000 + seed * 104729 + selfArmCode(arm) * 17), H, H);
  const bc = inParam(G.makeRng(78000 + seed * 31337), 1, 1); bc.v[0] = 0; // v1.1 pin: bias 0
  const params = inSeqParams(M).concat([Wc, bc]);
  const opt = new G.Adam(lr);
  const dataRng = G.makeRng(42000 + seed * 104729 + 55);
  let fixedMasks = null; { const fr = G.makeRng(91000 + seed); fixedMasks = []; for (let k = 0; k < K; k++) { const m = new Float64Array(H); for (let i = 0; i < H; i++) m[i] = fr.int(10) < 5 ? 2 : 0; fixedMasks.push(m); } }
  const t0 = Date.now(), curve = [];
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  const sig = (z) => 1 / (1 + Math.exp(-z));
  for (let step = 0; step < steps; step++) {
    for (const p of params) p.g.fill(0);
    let lsum = 0;
    for (let b = 0; b < B; b++) {
      const cands = [];
      for (let c = 0; c < C; c++) { const ub = dataRng.int(2) === 0; cands.push(ub ? inSeqGenShift(dataRng, 0) : inSeqGenShift(dataRng, null)); }
      let pk = 0, best = -1;
      for (let c = 0; c < C; c++) {
        const fw = inSeqForward(M, cands[c].x, new Float64Array(8), fixedMasks);
        const d = curVoteDisagree(fw.logitsK);
        if (d > best) { best = d; pk = c; }
      }
      const e = cands[pk];
      const c0 = new Float64Array(8);
      const fw1 = inSeqForward(M, e.x, c0, fixedMasks);
      const vhat1 = argmax4(fw1.hvLog);
      let z = bc.v[0]; for (let i = 0; i < H; i++) z += Wc.v[i] * fw1.h[i];
      const betaRaw = sig(z), beta = useBlend ? betaRaw : 0.5;
      const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat1, 8];
      const fw2 = inSeqForward(M, x2m, fw1.cNew, fixedMasks);
      const hv2 = new Float64Array(4);
      for (let o = 0; o < 4; o++) { let s = M.bv.v[o]; for (let i = 0; i < H; i++) s += M.Hv.v[o * H + i] * fw2.h[i]; hv2[o] = s; }
      const ensV = new Float64Array(4);
      const w1 = flip ? 1 - beta : beta, w2 = flip ? beta : 1 - beta;
      for (let o = 0; o < 4; o++) ensV[o] = w1 * fw1.hvLog[o] + w2 * hv2[o];
      const ceV = inCELossGrad(ensV, e.v);
      const wrong1 = vhat1 === e.v ? 0 : 1;
      const dEns = new Float64Array(4); for (let o = 0; o < 4; o++) dEns[o] = ceV.d[o] * auxW / B;
      const dHv1 = new Float64Array(4), dHv2 = new Float64Array(4);
      for (let o = 0; o < 4; o++) { dHv1[o] = w1 * dEns[o]; dHv2[o] = w2 * dEns[o]; }
      let dBeta = 0;
      // d(ensV)/dBeta = (hv1-hv2) unflipped, (hv2-hv1) flipped
      if (useBlend) for (let o = 0; o < 4; o++) dBeta += (flip ? -1 : 1) * (fw1.hvLog[o] - hv2[o]) * dEns[o];
      // fused sigmoid+BCE: BCE term is dL/dz directly (see grad-check note — no /(beta*(1-beta)) round-trip)
      const dz = dBeta * betaRaw * (1 - betaRaw) + bceW * (betaRaw - wrong1) / B;
      bc.g[0] += dz;
      const dhCrit = new Float64Array(H);
      for (let i = 0; i < H; i++) { Wc.g[i] += dz * fw1.h[i]; dhCrit[i] += dz * Wc.v[i]; }
      const perHead1 = fw1.logitsK.map((lg, k) => {
        if ((b % K) !== k) return new Float64Array(4);
        const ce = inCELossGrad(lg, e.y); const d = new Float64Array(4);
        for (let o = 0; o < 4; o++) d[o] = ce.d[o] * 0.1 * K / B;
        return d;
      });
      const perHead2 = fw2.logitsK.map((lg, k) => {
        if ((b % K) !== k) return new Float64Array(4);
        const ce = inCELossGrad(lg, e.y); const d = new Float64Array(4);
        for (let o = 0; o < 4; o++) d[o] = ce.d[o] * 0.1 * K / B;
        return d;
      });
      const mean2 = inMeanLogits({ logitsK: fw2.logitsK });
      const ce2 = inCELossGrad(mean2, e.y);
      const dMean2 = new Float64Array(4); for (let o = 0; o < 4; o++) dMean2[o] = ce2.d[o] / B;
      const mean1 = inMeanLogits({ logitsK: fw1.logitsK });
      const ce1m = inCELossGrad(mean1, e.y);
      const dMean1 = new Float64Array(4); for (let o = 0; o < 4; o++) dMean1[o] = ce1m.d[o] * 0.3 / B;
      lsum += ce2.loss + auxW * ceV.loss;
      const dc2 = inSeqBackward(M, fw2, dMean2, perHead2, dHv2, null, fixedMasks);
      inSeqBackward(M, fw1, dMean1, perHead1, dHv1, dc2, fixedMasks);
      propDhToTrunk(M, fw1, dhCrit);
      const meanW = new Float64Array(M.Wh[0].v.length);
      for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) meanW[i] += M.Wh[k].v[i] / K;
      for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) M.Wh[k].g[i] += lam * (M.Wh[k].v[i] - meanW[i]) / (B * M.H);
    }
    let s = 0; for (const p of params) for (let i = 0; i < p.g.length; i++) s += p.g[i] * p.g[i];
    const n = Math.sqrt(s); if (n > 1.0) { const sc = 1.0 / n; for (const q of params) for (let i = 0; i < q.g.length; i++) q.g[i] *= sc; }
    opt.step(params);
    if (step % 100 === 0 || step === steps - 1) curve.push({ step, loss: +(lsum / B).toFixed(6) });
  }
  const save = (o) => Array.from(o.v);
  const body = { spec: "self-tools-prereg", track: "SELF-F", arm, seed, steps, B, lr, K, H, C, auxW, lam, bceW, useBlend, verdict: "COMPLETE", wallMs: Date.now() - t0,
    frozen: true, curve, divCos: +inMeanCos(M).toFixed(4),
    P: { E: save(M.E), W1: save(M.W1), b1: save(M.b1), Wf: save(M.Wf), bf: save(M.bf), Wc: save(M.Wc), bc: save(M.bc),
      Wh: M.Wh.map(save), bh: M.bh.map(save), Hv: save(M.Hv), bv: save(M.bv),
      critic: { Wc: save(Wc), bc: save(bc) } } };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("self-train " + tag + " blend=" + useBlend + " loss0=" + curve[0].loss + " lossN=" + curve[curve.length - 1].loss);
  return body;
};
globalThis.runSelfEval = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const useBlend = selfUseBlend(arm);
  const flip = selfFlip(arm);
  const steps = 800, N = 200;
  const tag = arm + "-s" + seed + "-" + steps + "st";
  const ledgerPath = "src/evidence/decomp/d-newai-self-eval-" + tag + ".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  const G = await globalThis.IntrinsicInit(fs);
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-" + tag + ".json"));
  if (tr.verdict !== "COMPLETE") throw new Error("self train missing " + tag);
  const M = inSeqMakeModel(G.makeRng(1));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(M.E, tr.P.E); load(M.W1, tr.P.W1); load(M.b1, tr.P.b1);
  load(M.Wf, tr.P.Wf); load(M.bf, tr.P.bf); load(M.Wc, tr.P.Wc); load(M.bc, tr.P.bc);
  for (let k = 0; k < 5; k++) { load(M.Wh[k], tr.P.Wh[k]); load(M.bh[k], tr.P.bh[k]); }
  load(M.Hv, tr.P.Hv); load(M.bv, tr.P.bv);
  const Wc = inParam(G.makeRng(1), 48, 48), bc = inParam(G.makeRng(1), 1, 1);
  load(Wc, tr.P.critic.Wc); load(bc, tr.P.critic.bc);
  let evalMasks = null; { const fr = G.makeRng(91000 + seed); evalMasks = []; for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr.int(10) < 5 ? 2 : 0; evalMasks.push(m); } }
  const srng = G.makeRng(52500 + seed), frng = G.makeRng(52400 + seed);
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  const sig = (z) => 1 / (1 + Math.exp(-z));
  let scr = 0, scr1 = 0, scr2 = 0, one = 0, two = 0, orc = 0, betaSum = 0, vital = 0;
  const items = [];
  for (let i = 0; i < N; i++) {
    const e = inSeqGenShift(srng, null);
    const c0 = new Float64Array(8);
    const fw1 = inSeqForward(M, e.x, c0, evalMasks);
    const vhat1 = argmax4(fw1.hvLog);
    if (vhat1 === e.v) scr1++;
    let z = bc.v[0]; for (let hh = 0; hh < 48; hh++) z += Wc.v[hh] * fw1.h[hh];
    const betaRaw = sig(z), beta = useBlend ? betaRaw : 0.5;
    betaSum += betaRaw; if (betaRaw > 0.2 && betaRaw < 0.8) vital++;
    const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat1, 8];
    const fw2 = inSeqForward(M, x2m, fw1.cNew, evalMasks);
    const hv2 = new Float64Array(4);
    for (let o = 0; o < 4; o++) { let s = M.bv.v[o]; for (let hh = 0; hh < 48; hh++) s += M.Hv.v[o * 48 + hh] * fw2.h[hh]; hv2[o] = s; }
    let vhatF = 0, bs = -1e9;
    const w1 = flip ? 1 - beta : beta, w2 = flip ? beta : 1 - beta;
    for (let o = 0; o < 4; o++) { const s = w1 * fw1.hvLog[o] + w2 * hv2[o]; if (s > bs) { bs = s; vhatF = o; } }
    const ok = vhatF === e.v ? 1 : 0;
    if (ok) scr++;
    if (argmax4(hv2) === e.v) scr2++;
    items.push({ beta: +betaRaw.toFixed(4), ok });
    if (argmax4(inMeanLogits({ logitsK: fw1.logitsK })) === e.y) one++;
    if (argmax4(inMeanLogits({ logitsK: fw2.logitsK })) === e.y) two++;
    const xo = [9, 9, 9, 9, 9, 9, e.qk, e.k, e.v, 8];
    const fwo = inSeqForward(M, xo, fw1.cNew, evalMasks);
    if (argmax4(inMeanLogits({ logitsK: fwo.logitsK })) === e.y) orc++;
  }
  let fF = 0;
  for (let i = 0; i < N; i++) {
    const e = inSeqGenShift(frng, 0);
    const fw = inSeqForward(M, e.x, new Float64Array(8), evalMasks);
    if (argmax4(inMeanLogits({ logitsK: fw.logitsK })) === e.y) fF++;
  }
  const order = items.map((_, i) => i).sort((a, b) => items[a].beta - items[b].beta);
  const q = Math.floor(N / 4);
  const acc = (idx) => idx.reduce((s, i) => s + items[i].ok, 0) / idx.length;
  const aBot = acc(order.slice(0, q)), aTop = acc(order.slice(N - q));
  const body = { spec: "self-tools-prereg", track: "SELF-F", arm, seed, steps, verdict: "COMPLETE", n: N, frozenTest: true,
    accScratch: +(scr / N).toFixed(4), accVhat1: +(scr1 / N).toFixed(4), accVhat2: +(scr2 / N).toFixed(4), accOne: +(one / N).toFixed(4),
    accTwo: +(two / N).toFixed(4), accOracle: +(orc / N).toFixed(4), accFwd: +(fF / N).toFixed(4),
    calBotQ: +aBot.toFixed(4), calTopQ: +aTop.toFixed(4), calGap: +(aTop - aBot).toFixed(4),
    meanBeta: +(betaSum / N).toFixed(4), vitalFrac: +(vital / N).toFixed(4) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("self-eval " + tag + " scr=" + body.accScratch + " (vhat1 " + body.accVhat1 + ") two=" + body.accTwo + " calGap=" + body.calGap + " vital=" + body.vitalFrac);
  return body;
};

globalThis.runSelfProbeVhat2 = async function (fs, log, opts) {
  // eval-only probe: is the verify-pass readout (hv2) alone better than pass1 (hv1)?
  // Frozen weights, new ledger names (never rewrites COMPLETE evals).
  const { arm, seed } = opts;
  const steps = 800, N = 200;
  const tag = arm + "-s" + seed;
  const ledgerPath = "src/evidence/decomp/d-newai-self-probe-vhat2-" + tag + ".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  const G = await globalThis.IntrinsicInit(fs);
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-" + tag + "-" + steps + "st.json"));
  if (tr.verdict !== "COMPLETE") throw new Error("self train missing " + tag);
  const M = inSeqMakeModel(G.makeRng(1));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(M.E, tr.P.E); load(M.W1, tr.P.W1); load(M.b1, tr.P.b1);
  load(M.Wf, tr.P.Wf); load(M.bf, tr.P.bf); load(M.Wc, tr.P.Wc); load(M.bc, tr.P.bc);
  for (let k = 0; k < 5; k++) { load(M.Wh[k], tr.P.Wh[k]); load(M.bh[k], tr.P.bh[k]); }
  load(M.Hv, tr.P.Hv); load(M.bv, tr.P.bv);
  const Wc = inParam(G.makeRng(1), 48, 48), bc = inParam(G.makeRng(1), 1, 1);
  load(Wc, tr.P.critic.Wc); load(bc, tr.P.critic.bc);
  let evalMasks = null; { const fr = G.makeRng(91000 + seed); evalMasks = []; for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr.int(10) < 5 ? 2 : 0; evalMasks.push(m); } }
  const srng = G.makeRng(52500 + seed);
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  const sig = (z) => 1 / (1 + Math.exp(-z));
  let a1 = 0, a2 = 0, bSum = 0;
  for (let i = 0; i < N; i++) {
    const e = inSeqGenShift(srng, null);
    const fw1 = inSeqForward(M, e.x, new Float64Array(8), evalMasks);
    if (argmax4(fw1.hvLog) === e.v) a1++;
    let z = bc.v[0]; for (let hh = 0; hh < 48; hh++) z += Wc.v[hh] * fw1.h[hh];
    bSum += sig(z);
    const vhat1 = argmax4(fw1.hvLog);
    const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat1, 8];
    const fw2 = inSeqForward(M, x2m, fw1.cNew, evalMasks);
    const hv2 = new Float64Array(4);
    for (let o = 0; o < 4; o++) { let s = M.bv.v[o]; for (let hh = 0; hh < 48; hh++) s += M.Hv.v[o * 48 + hh] * fw2.h[hh]; hv2[o] = s; }
    if (argmax4(hv2) === e.v) a2++;
  }
  const body = { spec: "self-tools-prereg", probe: "vhat2-readout", arm, seed, steps, verdict: "COMPLETE", n: N,
    accVhat1: +(a1 / N).toFixed(4), accVhat2: +(a2 / N).toFixed(4), meanBeta: +(bSum / N).toFixed(4) };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("self-probe-vhat2 " + tag + " vhat1=" + body.accVhat1 + " vhat2=" + body.accVhat2);
  return body;
};
