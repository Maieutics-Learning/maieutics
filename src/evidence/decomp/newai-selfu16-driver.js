// newai-selfu16-driver.js — U16 sparse relay linker over frozen pieces.
// Frozen: W6 trunk + M2-nb notebook + U5-open nonlinear head. Trainable: linker only (~1.7k).
// Surgery notes: reuses U14 stack (loads, episode diets, eval streams). No trunk/MP/head backward
// anywhere in this file (frozen by construction — drift report asserts bit-identity).
// vhat discrete (argmax) — no grad through vhat (stability skip, U1/U14-filed). Linker trains on
// ce(ens,e.v) where ens = hv + read + linkOut (fixed 1.0, no learned blend — U10/U11 lesson).
// Zero-carry on adapt half (M3 fix) applied BEFORE linker projection (R1 note). Soft top-2 only
// (no hard STE — U12 lesson); entropy + top2mass reported (R2 pin).
globalThis.SelfU16Init = async function (fs) {
  for (const p of ["src/evidence/decomp/intrinsic-driver.js", "src/evidence/decomp/newai-driver.js", "src/evidence/decomp/newai-v102-driver.js", "src/evidence/decomp/newai-fr-driver.js", "src/evidence/decomp/newai-div-driver.js", "src/evidence/decomp/newai-cur-driver.js", "src/evidence/decomp/newai-winner-driver.js", "src/evidence/decomp/newai-selfmr-driver.js", "src/evidence/decomp/newai-selfm2r2-driver.js", "src/evidence/decomp/newai-selfm3r3-driver.js", "src/evidence/decomp/newai-selfu14-driver.js"]) {
    const src = await fs.readTextFile(p); (0, eval)(src + "\n//# sourceURL=" + p);
  }
  if (!globalThis.genAdaptEpisode) throw new Error("u16 stack load failed");
};
function u16ArmCode(arm) { if (arm === "u16-link") return 141; if (arm === "u16-shuf") return 142; return 141; }
// ---- linker params ----
function u16MakeLinker(rng) {
  const Ah = inParam(rng, 16 * 48, 48), bh = inParam(rng, 16, 16);
  const Ar = inParam(rng, 16 * 4, 4), br = inParam(rng, 16, 16);
  const Av = inParam(rng, 16 * 4, 4), bv = inParam(rng, 16, 16);
  const Ad = inParam(rng, 16 * 4, 4), bd = inParam(rng, 16, 16);
  const Ac = inParam(rng, 16 * 8, 8), bc = inParam(rng, 16, 16);
  const U = inParam(rng, 16 * 16, 16);
  const W2 = inParam(rng, 16 * 16, 16), b2 = inParam(rng, 16, 16);
  const v = inParam(rng, 16, 16);
  const Wo = inParam(rng, 4 * 16, 16), bo = inParam(rng, 4, 4);
  return { Ah, bh, Ar, br, Av, bv, Ad, bd, Ac, bc, U, W2, b2, v, Wo, bo };
}
function u16LinkerParams(L) { return [L.Ah, L.bh, L.Ar, L.br, L.Av, L.bv, L.Ad, L.bd, L.Ac, L.bc, L.U, L.W2, L.b2, L.v, L.Wo, L.bo]; }
// U5 frozen head forward (silu 48->24->4), no grads
function u16U5HeadOut(HD, h) {
  const pre = new Float64Array(24);
  for (let j = 0; j < 24; j++) { let s = HD.b1.v[j]; for (let i = 0; i < 48; i++) s += HD.W1.v[j * 48 + i] * h[i]; pre[j] = s; }
  const ha = new Float64Array(24);
  for (let j = 0; j < 24; j++) { const sig = 1 / (1 + Math.exp(-pre[j])); ha[j] = pre[j] * sig; }
  const out = new Float64Array(4);
  for (let o = 0; o < 4; o++) { let s = HD.b2.v[o]; for (let j = 0; j < 24; j++) s += HD.W2.v[o * 24 + j] * ha[j]; out[o] = s; }
  return out;
}
// Linker forward. pieces: h(48) read(4) hv(4) head(4) carry(8). Returns {out(4), cache}.
function u16LinkerForward(L, h, read, hv, head, carry) {
  const D = 16, NP = 5;
  const P = [];
  const projs = [[L.Ah, L.bh, h, 48], [L.Ar, L.br, read, 4], [L.Av, L.bv, hv, 4], [L.Ad, L.bd, head, 4], [L.Ac, L.bc, carry, 8]];
  for (let p = 0; p < NP; p++) {
    const [A, b, x, dim] = projs[p];
    const q = new Float64Array(D);
    for (let o = 0; o < D; o++) { let s = b.v[o]; for (let i = 0; i < dim; i++) s += A.v[o * dim + i] * x[i]; q[o] = s; }
    P.push(q);
  }
  // relay attention over 5 pieces
  const R = 16;
  const S = [], A = [];
  for (let r = 0; r < R; r++) {
    const s = new Float64Array(NP);
    for (let j = 0; j < NP; j++) { let d = 0; for (let d_ = 0; d_ < D; d_++) d += L.U.v[r * D + d_] * P[j][d_]; s[j] = d / 4; }
    let mx = s[0]; for (let j = 1; j < NP; j++) if (s[j] > mx) mx = s[j];
    let z = 0; const a = new Float64Array(NP);
    for (let j = 0; j < NP; j++) { a[j] = Math.exp(s[j] - mx); z += a[j]; }
    for (let j = 0; j < NP; j++) a[j] /= z;
    S.push(s); A.push(a);
  }
  const M1 = [];
  for (let r = 0; r < R; r++) {
    const m = new Float64Array(D);
    for (let j = 0; j < NP; j++) for (let d = 0; d < D; d++) m[d] += A[r][j] * P[j][d];
    M1.push(m);
  }
  const M2 = [], pre2 = [];
  for (let r = 0; r < R; r++) {
    const pre = new Float64Array(D);
    for (let o = 0; o < D; o++) { let s = L.b2.v[o]; for (let d = 0; d < D; d++) s += L.W2.v[o * D + d] * M1[r][d]; pre[o] = s; }
    const m = new Float64Array(D);
    for (let d = 0; d < D; d++) m[d] = Math.tanh(pre[d]);
    pre2.push(pre); M2.push(m);
  }
  const e = new Float64Array(R);
  for (let r = 0; r < R; r++) { let d = 0; for (let i = 0; i < D; i++) d += L.v.v[i] * M2[r][i]; e[r] = d / 4; }
  let mx = e[0]; for (let r = 1; r < R; r++) if (e[r] > mx) mx = e[r];
  let z = 0; const w = new Float64Array(R);
  for (let r = 0; r < R; r++) { w[r] = Math.exp(e[r] - mx); z += w[r]; }
  for (let r = 0; r < R; r++) w[r] /= z;
  const ctx = new Float64Array(D);
  for (let r = 0; r < R; r++) for (let d = 0; d < D; d++) ctx[d] += w[r] * M2[r][d];
  const out = new Float64Array(4);
  for (let o = 0; o < 4; o++) { let s = L.bo.v[o]; for (let d = 0; d < D; d++) s += L.Wo.v[o * D + d] * ctx[d]; out[o] = s; }
  let ent = 0, top1 = 0, top2 = 0;
  for (let r = 0; r < R; r++) { ent -= w[r] * Math.log(w[r] + 1e-12); if (w[r] > top1) { top2 = top1; top1 = w[r]; } else if (w[r] > top2) { top2 = w[r]; } }
  return { out, cache: { P, S, A, M1, M2, pre2, e, w, ctx, ent, top2mass: top1 + top2 } };
}
// Linker backward: dOut (4) -> grads into L only. cache from forward.
function u16LinkerBackward(L, h, read, hv, head, carry, cache, dOut) {
  const D = 16, NP = 5, R = 16;
  const { P, A, M1, M2, pre2, e, w, ctx } = cache;
  for (let o = 0; o < 4; o++) {
    L.bo.g[o] += dOut[o];
    for (let d = 0; d < D; d++) L.Wo.g[o * D + d] += dOut[o] * ctx[d];
  }
  const dctx = new Float64Array(D);
  for (let d = 0; d < D; d++) { let s = 0; for (let o = 0; o < 4; o++) s += L.Wo.v[o * D + d] * dOut[o]; dctx[d] = s; }
  const dw = new Float64Array(R);
  for (let r = 0; r < R; r++) { let s = 0; for (let d = 0; d < D; d++) s += dctx[d] * M2[r][d]; dw[r] = s; }
  const dM2 = [];
  for (let r = 0; r < R; r++) { const m = new Float64Array(D); for (let d = 0; d < D; d++) m[d] = dctx[d] * w[r]; dM2.push(m); }
  // softmax over relays: de = w*(dw - <dw>_w)
  let avg = 0; for (let r = 0; r < R; r++) avg += w[r] * dw[r];
  const de = new Float64Array(R);
  for (let r = 0; r < R; r++) de[r] = w[r] * (dw[r] - avg);
  for (let i = 0; i < D; i++) { let s = 0; for (let r = 0; r < R; r++) s += de[r] * M2[r][i] / 4; L.v.g[i] += s; }
  for (let r = 0; r < R; r++) for (let d = 0; d < D; d++) dM2[r][d] += de[r] * L.v.v[d] / 4;
  // hop2 tanh + W2
  const dM1 = [];
  for (let r = 0; r < R; r++) {
    const dm = new Float64Array(D);
    for (let d = 0; d < D; d++) dm[d] = dM2[r][d] * (1 - M2[r][d] * M2[r][d]);
    for (let o = 0; o < D; o++) {
      L.b2.g[o] += dm[o];
      for (let d = 0; d < D; d++) L.W2.g[o * D + d] += dm[o] * M1[r][d];
    }
    const m = new Float64Array(D);
    for (let d = 0; d < D; d++) { let s = 0; for (let o = 0; o < D; o++) s += L.W2.v[o * D + d] * dm[o]; m[d] = s; }
    dM1.push(m);
  }
  // relay attention softmax over 5 pieces
  const dP = [];
  for (let j = 0; j < NP; j++) dP.push(new Float64Array(D));
  const dU = new Float64Array(R * D);
  for (let r = 0; r < R; r++) {
    // dM1[r] -> da via M1 = A*P
    const da = new Float64Array(NP);
    for (let j = 0; j < NP; j++) { let s = 0; for (let d = 0; d < D; d++) s += dM1[r][d] * P[j][d]; da[j] = s; for (let d = 0; d < D; d++) dP[j][d] += dM1[r][d] * A[r][j]; }
    let avgA = 0; for (let j = 0; j < NP; j++) avgA += A[r][j] * da[j];
    for (let j = 0; j < NP; j++) {
      const ds = A[r][j] * (da[j] - avgA);
      for (let d = 0; d < D; d++) { dU[r * D + d] += ds * P[j][d] / 4; dP[j][d] += ds * L.U.v[r * D + d] / 4; }
    }
  }
  for (let i = 0; i < dU.length; i++) L.U.g[i] += dU[i];
  const xs = [h, read, hv, head, carry], dims = [48, 4, 4, 4, 8], As = [L.Ah, L.Ar, L.Av, L.Ad, L.Ac], bs = [L.bh, L.br, L.bv, L.bd, L.bc];
  for (let p = 0; p < NP; p++) {
    for (let o = 0; o < D; o++) {
      bs[p].g[o] += dP[p][o];
      for (let i = 0; i < dims[p]; i++) As[p].g[o * dims[p] + i] += dP[p][o] * xs[p][i];
    }
  }
}
async function loadU16U5head(fs, G, seed) {
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-u5-nl-open-s" + seed + "-800st.json"));
  const HD = { W1: inParam(G.makeRng(900 + seed), 24 * 48, 48), b1: inParam(G.makeRng(901 + seed), 24, 24), W2: inParam(G.makeRng(902 + seed), 4 * 24, 24), b2: inParam(G.makeRng(903 + seed), 4, 4) };
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(HD.W1, tr.P.W1); load(HD.b1, tr.P.b1); load(HD.W2, tr.P.W2); load(HD.b2, tr.P.b2);
  return HD;
}
globalThis.u16GradCheck = async function (fs, log) {
  await globalThis.SelfU16Init(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const M = inSeqMakeModel(G.makeRng(4342));
  const MP = m2MakeParams(G.makeRng(4344));
  const HD = { W1: inParam(G.makeRng(940), 24 * 48, 48), b1: inParam(G.makeRng(941), 24, 24), W2: inParam(G.makeRng(942), 4 * 24, 24), b2: inParam(G.makeRng(943), 4, 4) };
  const L = u16MakeLinker(G.makeRng(4343));
  const rng = G.makeRng(4345);
  const ep = genAdaptEpisode(rng);
  const e = ep.query, sup = ep.sup.map(se => ({ qkId: se.qk, vId: 4 + se.v, forceZero: false }));
  const h = new Float64Array(48); for (let i = 0; i < 48; i++) h[i] = rng.normal ? rng.normal() : (rng() - 0.5);
  const fw1 = inSeqForward(M, e.x, new Float64Array(8), null);
  const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = M.E.v[e.qk * 12 + d];
  const fr = m2ReadForward(M, MP, Eqk, sup);
  const head = u16U5HeadOut(HD, fw1.h);
  const carry = new Float64Array(8); // adapt half -> zeros (M3)
  const lossFn = () => {
    const f = u16LinkerForward(L, fw1.h, fr.readLogits, fw1.hvLog, head, carry);
    const ens = new Float64Array(4);
    for (let o = 0; o < 4; o++) ens[o] = fw1.hvLog[o] + fr.readLogits[o] + f.out[o];
    return inCELossGrad(ens, e.v).loss;
  };
  for (const p of u16LinkerParams(L)) p.g.fill(0);
  const f = u16LinkerForward(L, fw1.h, fr.readLogits, fw1.hvLog, head, carry);
  const ens = new Float64Array(4);
  for (let o = 0; o < 4; o++) ens[o] = fw1.hvLog[o] + fr.readLogits[o] + f.out[o];
  const ce = inCELossGrad(ens, e.v);
  u16LinkerBackward(L, fw1.h, fr.readLogits, fw1.hvLog, head, carry, f.cache, ce.d);
  const eps = 1e-6;
  let worst = 0, worstWhere = "";
  const checkParam = (P, name) => {
    for (let i = 0; i < Math.min(P.v.length, 6); i++) {
      P.v[i] += eps; const a1 = lossFn();
      P.v[i] -= 2 * eps; const a0 = lossFn();
      P.v[i] += eps;
      const num = (a1 - a0) / (2 * eps), an = P.g[i];
      const denom = Math.max(1e-12, Math.abs(num) + Math.abs(an));
      const rel = Math.abs(num - an) / denom;
      if (Math.abs(num) < 1e-9 && Math.abs(an) < 1e-9) continue;
      if (rel > worst) { worst = rel; worstWhere = name + "[" + i + "] num=" + num + " an=" + an; }
    }
  };
  checkParam(L.Wo, "Wo"); checkParam(L.v, "v"); checkParam(L.W2, "W2"); checkParam(L.U, "U");
  checkParam(L.Ah, "Ah"); checkParam(L.Ar, "Ar"); checkParam(L.Ac, "Ac"); checkParam(L.Ad, "Ad"); checkParam(L.Av, "Av");
  log("u16-gradcheck worstRel=" + worst.toExponential(2) + " at " + worstWhere);
  return { worstRel: worst, worstWhere };
};
globalThis.runU16Train = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const steps = 800, B = 16, lr = 5e-3, K = 5, H = 48, C = 6;
  const tag = arm + "-s" + seed + "-" + steps + "st";
  const ledgerPath = "src/evidence/decomp/d-newai-self-" + tag + ".json";
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  await globalThis.SelfU16Init(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const M = await loadU1W6(fs, G, seed);
  const MP = await loadU1M2nb(fs, G, seed);
  const HD = await loadU16U5head(fs, G, seed);
  const L = u16MakeLinker(G.makeRng(76000 + seed * 7919 + u16ArmCode(arm) * 131));
  const lParams = u16LinkerParams(L);
  const opt = new G.Adam(lr);
  const dataRng = G.makeRng(42000 + seed * 104729 + 77);
  let fixedMasks = null; { const fr = G.makeRng(91000 + seed); fixedMasks = []; for (let k = 0; k < K; k++) { const m = new Float64Array(H); for (let i = 0; i < H; i++) m[i] = fr.int(10) < 5 ? 2 : 0; fixedMasks.push(m); } }
  const M0snap = inSeqParams(M).map(p => Float64Array.from(p.v));
  const isShuf = (arm === "u16-shuf");
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  void argmax4;
  const t0 = Date.now(), curve = [];
  for (let step = 0; step < steps; step++) {
    for (const p of lParams) p.g.fill(0);
    // collect batch frozen pieces first (twin-matched diets), then linker (permuted iff shuf)
    const batch = [];
    for (let b = 0; b < B; b++) {
      const isAdapt = dataRng.int(2) === 1;
      let e, sup;
      if (!isAdapt) {
        const cands = [];
        for (let c = 0; c < C; c++) { const ub = dataRng.int(2) === 0; cands.push(ub ? inSeqGenShift(dataRng, 0) : inSeqGenShift(dataRng, null)); }
        let pk = 0, best = -1;
        for (let c = 0; c < C; c++) { const fw = inSeqForward(M, cands[c].x, new Float64Array(8), fixedMasks); const d = curVoteDisagree(fw.logitsK); if (d > best) { best = d; pk = c; } }
        e = cands[pk];
        const supE = [inSeqGenShift(dataRng, null), inSeqGenShift(dataRng, null), inSeqGenShift(dataRng, null), inSeqGenShift(dataRng, null)];
        sup = supE.map(se => ({ qkId: se.qk, vId: 4 + se.v, forceZero: false }));
      } else {
        const ep = genAdaptEpisode(dataRng);
        e = ep.query;
        sup = ep.sup.map(se => ({ qkId: se.qk, vId: 4 + se.v, forceZero: false }));
      }
      const fw1 = inSeqForward(M, e.x, new Float64Array(8), fixedMasks);
      const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = M.E.v[e.qk * 12 + d];
      const fr = m2ReadForward(M, MP, Eqk, sup);
      const head = u16U5HeadOut(HD, fw1.h);
      const carry = isAdapt ? new Float64Array(8) : Float64Array.from(fw1.cNew);
      batch.push({ e, h: Float64Array.from(fw1.h), read: Float64Array.from(fr.readLogits), hv: Float64Array.from(fw1.hvLog), head, carry });
    }
    let lsum = 0;
    for (let b = 0; b < B; b++) {
      const src = isShuf ? batch[(b + 1) % B] : batch[b];
      const e = batch[b].e;
      const f = u16LinkerForward(L, src.h, src.read, src.hv, src.head, src.carry);
      const ens = new Float64Array(4);
      for (let o = 0; o < 4; o++) ens[o] = batch[b].hv[o] + batch[b].read[o] + f.out[o];
      const ce = inCELossGrad(ens, e.v);
      lsum += ce.loss;
      const d = new Float64Array(4); for (let o = 0; o < 4; o++) d[o] = ce.d[o] / B;
      u16LinkerBackward(L, src.h, src.read, src.hv, src.head, src.carry, f.cache, d);
    }
    let s = 0; for (const p of lParams) for (let i = 0; i < p.g.length; i++) s += p.g[i] * p.g[i];
    const n = Math.sqrt(s); if (n > 1.0) { const sc = 1.0 / n; for (const p of lParams) for (let i = 0; i < p.g.length; i++) p.g[i] *= sc; }
    opt.step(lParams);
    if (step % 100 === 0 || step === steps - 1) curve.push({ step, loss: +(lsum / B).toFixed(6) });
  }
  // frozen-integrity: max abs drift of trunk/notebook/head vs init (must be 0)
  const M1p = inSeqParams(M);
  let maxDrift = 0;
  for (let pi = 0; pi < M1p.length; pi++) for (let i = 0; i < M1p[pi].v.length; i++) { const d = Math.abs(M1p[pi].v[i] - M0snap[pi][i]); if (d > maxDrift) maxDrift = d; }
  const save = (o) => Array.from(o.v);
  const body = { spec: "self-u16-linker-prereg", track: "U16", arm, seed, steps, B, lr, initTrunk: "W6-s" + seed, initNotebook: "M2-nb-s" + seed, initHead: "U5-nl-open-s" + seed, frozenAll: true, maxFrozenDrift: maxDrift, verdict: "COMPLETE", wallMs: Date.now() - t0, curve,
    P: { Ah: save(L.Ah), bh: save(L.bh), Ar: save(L.Ar), br: save(L.br), Av: save(L.Av), bv: save(L.bv), Ad: save(L.Ad), bd: save(L.bd), Ac: save(L.Ac), bc: save(L.bc), U: save(L.U), W2: save(L.W2), b2: save(L.b2), v: save(L.v), Wo: save(L.Wo), bo: save(L.bo) } };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("u16-train " + tag + " loss0=" + curve[0].loss + " lossN=" + curve[curve.length - 1].loss + " frozenDrift=" + maxDrift);
  return body;
};
globalThis.runU16Eval = async function (fs, log, opts) {
  const { arm, seed } = opts;
  const steps = 800, N = 200;
  const tag = arm + "-s" + seed + "-" + steps + "st";
  const ledgerPath = "src/evidence/decomp/d-newai-self-eval-" + tag + ".json";
  const force = opts && opts.force;
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE" && !force) { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  await globalThis.SelfU16Init(fs);
  const G = await globalThis.IntrinsicInit(fs);
  const M = await loadU1W6(fs, G, seed);
  const MP = await loadU1M2nb(fs, G, seed);
  const HD = await loadU16U5head(fs, G, seed);
  const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-" + tag + ".json"));
  const L = u16MakeLinker(G.makeRng(1));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(L.Ah, tr.P.Ah); load(L.bh, tr.P.bh); load(L.Ar, tr.P.Ar); load(L.br, tr.P.br); load(L.Av, tr.P.Av); load(L.bv, tr.P.bv); load(L.Ad, tr.P.Ad); load(L.bd, tr.P.bd); load(L.Ac, tr.P.Ac); load(L.bc, tr.P.bc); load(L.U, tr.P.U); load(L.W2, tr.P.W2); load(L.b2, tr.P.b2); load(L.v, tr.P.v); load(L.Wo, tr.P.Wo); load(L.bo, tr.P.bo);
  let evalMasks = null; { const fr2 = G.makeRng(91000 + seed); evalMasks = []; for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr2.int(10) < 5 ? 2 : 0; evalMasks.push(m); } }
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  const linkOutOf = (h, read, hv, head, carry) => u16LinkerForward(L, h, read, hv, head, carry).out;
  // standard two
  const srng = G.makeRng(52500 + seed), supRng = G.makeRng(42000 + seed * 104729 + 999);
  let scr = 0, two = 0;
  for (let i = 0; i < N; i++) {
    const e = inSeqGenShift(srng, null);
    const supE = [inSeqGenShift(supRng, null), inSeqGenShift(supRng, null), inSeqGenShift(supRng, null), inSeqGenShift(supRng, null)];
    const sup = supE.map(se => ({ qkId: se.qk, vId: 4 + se.v, forceZero: false }));
    const fw1 = inSeqForward(M, e.x, new Float64Array(8), evalMasks);
    const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = M.E.v[e.qk * 12 + d];
    const fr = m2ReadForward(M, MP, Eqk, sup);
    const head = u16U5HeadOut(HD, fw1.h);
    const out = linkOutOf(fw1.h, fr.readLogits, fw1.hvLog, head, Float64Array.from(fw1.cNew));
    const ens = new Float64Array(4); for (let o = 0; o < 4; o++) ens[o] = fw1.hvLog[o] + fr.readLogits[o] + out[o];
    if (argmax4(ens) === e.v) scr++;
    const vhat = argmax4(ens);
    const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
    const fw2 = inSeqForward(M, x2m, fw1.cNew, evalMasks);
    if (argmax4(inMeanLogits({ logitsK: fw2.logitsK })) === e.y) two++;
  }
  // adapt: link vs ablated (out=0)
  const arng = G.makeRng(61000 + seed);
  let adaptY = 0, adaptV = 0, adaptYabl = 0, entSum = 0, top2sum = 0;
  for (let i = 0; i < N; i++) {
    const ep = genAdaptEpisode(arng);
    const sup = ep.sup.map(se => ({ qkId: se.qk, vId: 4 + se.v, forceZero: false }));
    const e = ep.query;
    const fw1 = inSeqForward(M, e.x, new Float64Array(8), evalMasks);
    const Eqk = new Float64Array(12); for (let d = 0; d < 12; d++) Eqk[d] = M.E.v[e.qk * 12 + d];
    const fr = m2ReadForward(M, MP, Eqk, sup);
    const head = u16U5HeadOut(HD, fw1.h);
    const zero = new Float64Array(8);
    const f = u16LinkerForward(L, fw1.h, fr.readLogits, fw1.hvLog, head, zero);
    entSum += f.cache.ent; top2sum += f.cache.top2mass;
    const ens = new Float64Array(4); for (let o = 0; o < 4; o++) ens[o] = fw1.hvLog[o] + fr.readLogits[o] + f.out[o];
    const vhat = argmax4(ens);
    if (vhat === e.v) adaptV++;
    const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
    const fw2 = inSeqForward(M, x2m, zero, evalMasks);
    if (argmax4(inMeanLogits({ logitsK: fw2.logitsK })) === e.y) adaptY++;
    const ensA = new Float64Array(4); for (let o = 0; o < 4; o++) ensA[o] = fw1.hvLog[o] + fr.readLogits[o];
    const vhatA = argmax4(ensA);
    const x2a = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhatA, 8];
    const fw2a = inSeqForward(M, x2a, zero, evalMasks);
    if (argmax4(inMeanLogits({ logitsK: fw2a.logitsK })) === e.y) adaptYabl++;
  }
  const body = { spec: "self-u16-linker-prereg", track: "U16", arm, seed, steps, verdict: "COMPLETE", n: N,
    accScratch: +(scr / N).toFixed(4), accTwo: +(two / N).toFixed(4), adaptY: +(adaptY / N).toFixed(4), adaptV: +(adaptV / N).toFixed(4),
    adaptYablated: +(adaptYabl / N).toFixed(4), ablateDrop: +((adaptY - adaptYabl) / N).toFixed(4),
    meanRelayEntropy: +(entSum / N).toFixed(4), meanTop2mass: +(top2sum / N).toFixed(4), frozenDriftTrain: tr.maxFrozenDrift };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("u16-eval " + tag + " adaptY=" + body.adaptY + " shuf? adaptV=" + body.adaptV + " two=" + body.accTwo + " ablDrop=" + body.ablateDrop);
  return body;
};
