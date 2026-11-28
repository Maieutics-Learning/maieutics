// u70-neural.js — U70-CTX neural execution driver (F14 prereg v1.1 EXACT).
// F14 (countersigned v1.1 EXACT, 2026-11-27): TRUE full-latent intervention — the factored
// u70nApplyShuffle helper IS the u70nEval V4 metric path (deletes the C2-partial inline
// branch zdet+q); T7/T8/T8b metric-path gates + T5/T6/E4 retention + per-seed early-HALT
// replication vs filed F12. F11 base kept (forward-exact one-hot, T1-T4), F12 valid ECE
// (E1-E4), F13 held-out path + hashes (T5/T5a/T6/E4h). All else unchanged.
//
// Variants: V1 reactive floor (analytic, no training). V2 GRU no-z (trained).
// V3 full (GRU h + discrete z + rho-head + reconstruction, trained). V4 = frozen
// V3 weights + test-time z-shuffle at decision, forced-use (paired, same seeds).
// V5 V3 without rho-head (trained).
// Discipline (v1.1): truncated BPTT window 50 with state carry-over, grad-clip 1.0,
// ONE restart per seed-path (init RNG 90000+seed), NO selection. Adam lr 3e-4,
// 200 epochs/seed-path (arch proposal; compute budget filed here).
// Free bits floor 0.25 nats (single 4-way categorical scale-down of Dreamer
// mechanics; filed choice), 1% uniform mixture, rep weight 0.1.
// Eval uses argmax-q (deterministic MAP); V4 shuffles z idx across trials
// (eval RNG 73000+seed). Symlog N/A (categorical/binary targets; plain CE/BCE).
//
// RUN (execute_js, fs in scope):
//   const src = await fs.readTextFile("src/evidence/u70/u70-neural.js");
//   (0, eval)(src + "\n//# sourceURL=u70-neural.js");
//   const rep = await globalThis.runU70Neural(fs, (m) => console.log(m), {mode:"smoke"});
//   return { verdict: rep.verdict, pooled: rep.pooled };
function u70nMulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const U70N_T = 300, U70N_SEEDS = [...Array(20).keys()];
const U70N_PSW = 0.02, U70N_DWELL = 25, U70N_PRHO = 0.03, U70N_EPS = 0.10;
const U70N_RHO = [0.55, 0.75, 0.95];
let U70N_H = 64; const U70N_D = 7, U70N_Z = 4;
let U70N_ZREC = 0; // F16: z-recurrence wiring (A1/B = 1; else 0). GRU gates read [x+zPrev] when 1; forward-only (GRU input weights frozen filed precedent).
const U70N_UNFAM = { dwell: 12, psw: 0.05, prho: 0.06 }; // F16 G2: unfamiliar timing (seeds 2000+s; pay/rhoVals unchanged)
function u70nUnfamSeeds(s) { return 2000 + s; }
const U70N_LR = 3e-4, U70N_EPOCHS = 200, U70N_WIN = 50, U70N_CLIP = 1.0;
let U70N_FREEBITS = 0.25; const U70N_REPW_BASE = 0.1, U70N_UNIF = 0.01;
let U70N_CTXW = 1.0; // F4: context-loss weight (v1.1 = 3.0; else 1.0)
let U70N_WARMUP = 0; // F7: LR linear warmup epochs (v1.1 = 20; else 0 = flat)
let U70N_TILT = 0; // F8: encoder-bias tilt magnitude (v1.1 = 0.5; else 0 = none). Direction d(s) pre-registered per seed.
let U70N_INITSCALE = 1.0; // F9: global init-draw scale (F9a = 0.5; F9b = 2.0; else 1.0). Multiplies uniform draws only; biases stay zero.
function u70nGenPath(seed, P) {
  P = P || {};
  const psw = P.psw === undefined ? U70N_PSW : P.psw;
  const dwell = P.dwell === undefined ? U70N_DWELL : P.dwell;
  const prho = P.prho === undefined ? U70N_PRHO : P.prho;
  const rng = u70nMulberry32(70000 + seed);
  const ctx = new Array(U70N_T), rho = new Array(U70N_T), switches = [];
  let c = rng() < 0.5 ? 0 : 1, r = Math.floor(rng() * 3), lastSw = -100;
  for (let t = 0; t < U70N_T; t++) {
    if (t > 0 && rng() < psw && t - lastSw >= dwell) { c = 1 - c; lastSw = t; switches.push(t); }
    if (t > 0 && rng() < prho) { let n = Math.floor(rng() * 2); r = (r + 1 + n) % 3; }
    ctx[t] = c; rho[t] = r;
  }
  return { ctx, rho, switches };
}
function u70nGenObs(seed, path, pay, rhoVals, eps) {
  pay = pay === undefined ? 0.8 : pay; rhoVals = rhoVals || U70N_RHO; eps = eps === undefined ? U70N_EPS : eps;
  const rng = u70nMulberry32(72000 + seed); // identical call order to oracle
  const good = (c) => (c === 0 ? 0 : 1);
  const xs = [], as = [], rs = [];
  for (let t = 0; t < U70N_T; t++) {
    const c = path.ctx[t], rho = rhoVals[path.rho[t]], g = good(c);
    const masked = rng() < eps;
    const cue = masked ? -1 : (rng() < rho ? g : 1 - g);
    const act = cue >= 0 ? cue : (rng() < 0.5 ? 0 : 1);
    const rew = rng() < (act === g ? pay : 1 - pay) ? 1 : 0;
    xs.push(masked ? 2 : cue); as.push(act); rs.push(rew);
  }
  return { xs, as, rs };
}
function u70nInput(xs, as, rs, t) {
  const v = new Float64Array(U70N_D);
  v[xs[t]] = 1;
  if (t > 0) { v[3 + as[t - 1]] = 1; v[6 - 1] = rs[t - 1]; }
  else v[6] = 1;
  return v;
}
// ---- tiny param store + adam ----
function u70nParam(cols, rows, rng, scale) {
  const w = new Float64Array(cols * rows);
  for (let i = 0; i < w.length; i++) w[i] = (rng() * 2 - 1) * scale;
  return { w, cols, rows, m: new Float64Array(w.length), v: new Float64Array(w.length) };
}
function u70nBias(n) { return { w: new Float64Array(n), cols: 1, rows: n, m: new Float64Array(n), v: new Float64Array(n) }; }
function u70nInitModel(variant, seed, initBase) {
  const rng = u70nMulberry32((initBase === undefined ? 90000 : initBase) + seed); // F5: pre-registered init per restart (k=0: 90000, k=1: 94000, k=2: 98000)
  const s = (fan) => Math.sqrt(1 / fan) * U70N_INITSCALE; // F9: global scale multiplies draws only
  const M = { variant };
  const DIN = U70N_ZREC ? U70N_D + U70N_Z : U70N_D, sIn = s(DIN); // F16: ZREC widens gate inputs only (We stays [h,x] per prereg)
  M.Wz = u70nParam(DIN, U70N_H, rng, sIn); M.Uz = u70nParam(U70N_H, U70N_H, rng, s(U70N_H)); M.bz = u70nBias(U70N_H);
  M.Wr = u70nParam(DIN, U70N_H, rng, sIn); M.Ur = u70nParam(U70N_H, U70N_H, rng, s(U70N_H)); M.br = u70nBias(U70N_H);
  M.Wh = u70nParam(DIN, U70N_H, rng, sIn); M.Uh = u70nParam(U70N_H, U70N_H, rng, s(U70N_H)); M.bh = u70nBias(U70N_H);
  const hz = U70N_H + U70N_Z;
  if (variant !== "V2") {
    M.We = u70nParam(U70N_H + U70N_D, U70N_Z, rng, s(U70N_H)); M.be = u70nBias(U70N_Z);
    M.Wp = u70nParam(U70N_H, U70N_Z, rng, s(U70N_H)); M.bp = u70nBias(U70N_Z);
    if (U70N_TILT) { const dd = Math.floor(u70nMulberry32(76000 + seed)() * 4) % 4; M.be.w[dd] = U70N_TILT; M._tiltDir = dd; } // F8: pre-registered per-seed tilt direction
  }
  const hdin = variant === "V2" ? U70N_H : hz;
  const hdinC = (variant === "F2" || variant === "F4") ? U70N_Z : hdin; // F2/F4 forcing cut: ctx-head reads z-onehot ONLY
  M.Wc = u70nParam(hdinC, 2, rng, s(hdinC)); M.bc = u70nBias(2);
  if (variant !== "V5") { M.Wr2 = u70nParam(U70N_H, 3, rng, s(U70N_H)); M.br2 = u70nBias(3); }
  M.Wx = u70nParam(hdin, 3, rng, s(hdin)); M.bx = u70nBias(3);
  M.Ww = u70nParam(hdin, 1, rng, s(hdin)); M.bw = u70nBias(1);
  if (variant !== "V2") { M.Wq = u70nParam(U70N_Z, 2, rng, s(U70N_Z)); M.bq = u70nBias(2); }
  M._srng = u70nMulberry32(91000 + seed); // filed sampling RNG: training stochasticity is reproducible
  M._H = U70N_H; M._ZREC = U70N_ZREC; M._DIN = (M.variant === 'V2' ? U70N_H : (U70N_ZREC ? U70N_D + U70N_Z : U70N_D)); // F16: per-model geometry (H128/ZREC audit)
  M._initLog = []; // F16 G3/G4: procedure-identity (NOT bit-identity across H sizes, disclosed)
  { let di = 0; const lp = (nm, P, fan) => M._initLog.push({ name: nm, drawIndex: di++, fan, scale: +s(fan).toFixed(8), first: +P.w[0].toFixed(8) }); // F16 G4: draw-index logged
    lp('Wz', M.Wz, DIN); lp('Wr', M.Wr, DIN); lp('Wh', M.Wh, DIN);
    if (M.We) lp('We', M.We, U70N_H + U70N_D); if (M.Wp) lp('Wp', M.Wp, U70N_H); lp('Wc', M.Wc, M.Wc.cols); }
  M.params = Object.values(M).filter((p) => p && p.w);
  return M;
}
function u70nSoftmax(log, n) {
  let m = -1e30; for (let i = 0; i < n; i++) if (log[i] > m) m = log[i];
  const o = new Float64Array(n); let s = 0;
  for (let i = 0; i < n; i++) { o[i] = Math.exp(log[i] - m); s += o[i]; }
  for (let i = 0; i < n; i++) o[i] /= s;
  return o;
}
function u70nLinCache(x, P, b, n) {
  const o = new Float64Array(n);
  for (let j = 0; j < n; j++) { let v = b.w[j]; for (let i = 0; i < x.length; i++) v += x[i] * P.w[i * n + j]; o[j] = v; }
  return o;
}
// forward one step; returns cache (training) or light object (eval)
function u70nStep(M, x, h, train, zPrev) {
  const H = (M._H || U70N_H), Z = U70N_Z, ZR = (M._ZREC || 0);
  let xg = x; if (ZR) { xg = new Float64Array(U70N_D + Z); xg.set(x, 0); if (zPrev) xg.set(zPrev, U70N_D); } // F16: z-recurrence (t0 zero, sample-train/argmax-eval); We stays [h,x]
  const zl = new Float64Array(H), rl = new Float64Array(H), hl = new Float64Array(H);
  for (let j = 0; j < H; j++) {
    let a = M.bz.w[j], b = M.br.w[j], c = M.bh.w[j];
    for (let i = 0; i < xg.length; i++) { a += xg[i] * M.Wz.w[i * H + j]; b += xg[i] * M.Wr.w[i * H + j]; c += xg[i] * M.Wh.w[i * H + j]; }
    for (let i = 0; i < H; i++) { a += h[i] * M.Uz.w[i * H + j]; b += h[i] * M.Ur.w[i * H + j]; }
    zl[j] = a; rl[j] = b;
    void c;
  }
  const zg = new Float64Array(H), rg = new Float64Array(H);
  for (let j = 0; j < H; j++) { zg[j] = 1 / (1 + Math.exp(-zl[j])); rg[j] = 1 / (1 + Math.exp(-rl[j])); }
  const rh = new Float64Array(H);
  for (let j = 0; j < H; j++) rh[j] = rg[j] * h[j];
  const cl = new Float64Array(H);
  for (let j = 0; j < H; j++) {
    let v = M.bh.w[j];
    for (let i = 0; i < xg.length; i++) v += xg[i] * M.Wh.w[i * H + j];
    for (let i = 0; i < H; i++) v += rh[i] * M.Uh.w[i * H + j];
    cl[j] = v;
  }
  const ht = new Float64Array(H);
  for (let j = 0; j < H; j++) ht[j] = Math.tanh(cl[j]);
  const hn = new Float64Array(H);
  for (let j = 0; j < H; j++) hn[j] = (1 - zg[j]) * h[j] + zg[j] * ht[j];
  let q = null, p = null, zi = -1, zoh = null;
  if (M.variant !== "V2") {
    const ex = new Float64Array(H + U70N_D); ex.set(h, 0); ex.set(x, H);
    const elog = u70nLinCache(ex, M.We, M.be, Z);
    const plog = u70nLinCache(h, M.Wp, M.bp, Z);
    q = u70nSoftmax(elog, Z); p = u70nSoftmax(plog, Z);
    if (train) { zi = 0; const rr = M._srng(); let acc = 0; for (let k = 0; k < Z; k++) { acc += q[k]; if (rr < acc) { zi = k; break; } } }
    else { zi = 0; for (let k = 1; k < Z; k++) if (q[k] > q[zi]) zi = k; }
    zoh = new Float64Array(Z); zoh[zi] = 1; // F11: forward-exact one-hot (posterior-leak fix; was oh+q). ST gradient via analytic q-jacobian in backward, unchanged.
  }
  const hv = M.variant === "V2" ? h : null;
  let feat;
  if (M.variant === "V2") feat = hn;
  else { feat = new Float64Array(H + Z); feat.set(hn, 0); for (let k = 0; k < Z; k++) feat[H + k] = zoh[k]; }
  void hv;
  let cfeat = null; // F2/F4: context-head input (z-onehot only); else = feat
  const clog = u70nLinCache((cfeat = ((M.variant === "F2" || M.variant === "F4") ? (() => { const z = new Float64Array(Z); for (let k = 0; k < Z; k++) z[k] = zoh[k]; return z; })() : feat)), M.Wc, M.bc, 2);
  const pc = u70nSoftmax(clog, 2);
  let rlog = null, pr = null;
  if (M.variant !== "V5") { rlog = u70nLinCache(hn, M.Wr2, M.br2, 3); pr = u70nSoftmax(rlog, 3); }
  const xlog = u70nLinCache(feat, M.Wx, M.bx, 3);
  const px = u70nSoftmax(xlog, 3);
  let wlog = u70nLinCache(feat, M.Ww, M.bw, 1);
  const pw = 1 / (1 + Math.exp(-wlog[0]));
  let qlog = null, pq = null;
  if (M.variant !== "V2") { const zdet = new Float64Array(Z); zdet[zi] = 1; qlog = u70nLinCache(zdet, M.Wq, M.bq, 2); pq = u70nSoftmax(qlog, 2); }
  return { x, xg: (ZR ? xg.slice() : null), h, hn, zl, rl, cl, zg, rg, rh, ht, q, p, zi, zoh, feat, cfeat, clog, pc, rlog, pr, xlog, px, wlog, pw, qlog, pq };
}
function u70nMixQ(q) {
  const o = new Float64Array(q.length);
  for (let k = 0; k < q.length; k++) o[k] = (1 - U70N_UNIF) * q[k] + U70N_UNIF / q.length;
  return o;
}
function u70nKLfb(a, b) {
  let kl = 0;
  for (let k = 0; k < a.length; k++) kl += a[k] * Math.log(a[k] / b[k]);
  return Math.max(kl, U70N_FREEBITS);
}
// one training epoch over pre-generated stream; repw = rep weight this epoch (filed per-arm)
function u70nEpoch(M, path, obs, repw) {
  const H = (M._H || U70N_H), Z = U70N_Z, ZR = (M._ZREC || 0);
  const grads = new Map();
  const G = (P) => { let g = grads.get(P); if (!g) { g = new Float64Array(P.w.length); grads.set(P, g); } return g; };
  let h = new Float64Array(H), totLoss = 0, totProbe = 0;
  let zp = new Float64Array(Z); // F16: z-prev carry (zero at epoch start; sample-train)
  const chunks = U70N_T / U70N_WIN;
  for (let ch = 0; ch < chunks; ch++) {
    const t0 = ch * U70N_WIN;
    const caches = [];
    for (let t = t0; t < t0 + U70N_WIN; t++) {
      const x = u70nInput(obs.xs, obs.as, obs.rs, t);
      const c = u70nStep(M, x, h, true, ZR ? zp : null);
      caches.push(c); h = c.hn;
      if (ZR && M.variant !== 'V2') { const nz = new Float64Array(Z); nz[c.zi] = 1; zp = nz; } // sampled carry, call order unchanged
      const cTrue = path.ctx[t], rTrue = path.rho[t];
      let L = 0;
      c.dclog = [(c.pc[0] - (cTrue === 0 ? 1 : 0)) * U70N_CTXW, (c.pc[1] - (cTrue === 1 ? 1 : 0)) * U70N_CTXW];
      L += U70N_CTXW * -(cTrue === 0 ? Math.log(Math.max(c.pc[0], 1e-12)) : Math.log(Math.max(c.pc[1], 1e-12)));
      if (M.variant !== "V5") {
        c.drlog = [c.pr[0] - (rTrue === 0 ? 1 : 0), c.pr[1] - (rTrue === 1 ? 1 : 0), c.pr[2] - (rTrue === 2 ? 1 : 0)];
        L += -Math.log(Math.max(c.pr[rTrue], 1e-12));
      }
      c.dxlog = [c.px[0] - (obs.xs[t] === 0 ? 1 : 0), c.px[1] - (obs.xs[t] === 1 ? 1 : 0), c.px[2] - (obs.xs[t] === 2 ? 1 : 0)];
      L += -Math.log(Math.max(c.px[obs.xs[t]], 1e-12));
      const w = Math.max(Math.min(c.pw, 1 - 1e-9), 1e-9);
      c.dw = (w - obs.rs[t]) / 1; // dBCE/dlogit
      L += -(obs.rs[t] * Math.log(w) + (1 - obs.rs[t]) * Math.log(1 - w));
      if (M.variant !== "V2") {
        const qm = u70nMixQ(c.q), pm = u70nMixQ(c.p);
        const kDyn = u70nKLfb(qm.map((v, k) => v), pm); // sg(q): grad wrt p only
        void kDyn;
        // dynamics grad: d KL(sg(qm)||pm)/d pm via plog
        const kd = u70nKLraw(qm, pm);
        c.dplog = u70nKLdp(qm, pm, kd >= U70N_FREEBITS);
        const kr = u70nKLraw(qm, pm);
        c.dqrep = u70nKLdq(qm, pm, kr >= U70N_FREEBITS);
        L += kd + repw * kr;
        // z straight-through: dz/dq = 1
        c.dzoh = new Float64Array(Z); // filled after head grads
        // probe (detached): own loss, own optimizer
        c.dqlog = [c.pq[0] - (cTrue === 0 ? 1 : 0), c.pq[1] - (cTrue === 1 ? 1 : 0)];
        totProbe += -(cTrue === 0 ? Math.log(Math.max(c.pq[0], 1e-12)) : Math.log(Math.max(c.pq[1], 1e-12)));
      }
      c.L = L; totLoss += L;
    }
    // backward through chunk
    let dh = new Float64Array(H);
    for (let i = caches.length - 1; i >= 0; i--) {
      const c = caches[i];
      const HZ = c.feat.length;
      const dfeat = new Float64Array(HZ);
      const accLin = (W, b, dlog, xsrc) => {
        const gW = G(W), gb = G(b);
        for (let j = 0; j < dlog.length; j++) {
          gb[j] += dlog[j];
          for (let ii = 0; ii < xsrc.length; ii++) gW[ii * dlog.length + j] += dlog[j] * xsrc[ii];
        }
        const dx = new Float64Array(xsrc.length);
        for (let ii = 0; ii < xsrc.length; ii++) { let v = 0; for (let j = 0; j < dlog.length; j++) v += W.w[ii * dlog.length + j] * dlog[j]; dx[ii] = v; }
        return dx;
      };
      let dWcZ = null;
      if (M.variant === "F2" || M.variant === "F4") { dWcZ = accLin(M.Wc, M.bc, c.dclog, c.cfeat); }
      else { const d0 = accLin(M.Wc, M.bc, c.dclog, c.feat); for (let k = 0; k < HZ; k++) dfeat[k] += d0[k]; }
      let d;
      if (M.variant !== "V5") { d = accLin(M.Wr2, M.br2, c.drlog, c.hn); for (let k = 0; k < H; k++) dh[k] += d[k]; }
      d = accLin(M.Wx, M.bx, c.dxlog, c.feat);
      for (let k = 0; k < HZ; k++) dfeat[k] += d[k];
      d = accLin(M.Ww, M.bw, [c.dw], c.feat);
      for (let k = 0; k < HZ; k++) dfeat[k] += d[k];
      let dhn = new Float64Array(H);
      if (M.variant === "V2") { for (let k = 0; k < H; k++) dhn[k] = dfeat[k]; }
      else {
        for (let k = 0; k < H; k++) dhn[k] = dfeat[k];
        const dz = new Float64Array(Z);
        for (let k = 0; k < Z; k++) dz[k] = dfeat[H + k];
        if (dWcZ) for (let k = 0; k < Z; k++) dz[k] += dWcZ[k]; // F2/F4: ctx-head grad flows to z only
        // probe grad (own params only)
        const zdet = new Float64Array(Z); zdet[c.zi] = 1;
        accLin(M.Wq, M.bq, c.dqlog, zdet);
        // KL grads to logits
        const dplog = c.dplog, dqrep = c.dqrep;
        // d p-logits
        {
          const gW = G(M.Wp), gb = G(M.bp);
          for (let j = 0; j < Z; j++) { gb[j] += dplog[j]; for (let ii = 0; ii < H; ii++) gW[ii * Z + j] += dplog[j] * c.h[ii]; }
          for (let ii = 0; ii < H; ii++) { let v = 0; for (let j = 0; j < Z; j++) v += M.Wp.w[ii * Z + j] * dplog[j]; dhn[ii] += v; }
        }
        // d q-logits: rep-KL part + straight-through dz (manual ST: backward never
        // differentiates through the forward op — it routes head-grads through the analytic
        // softmax jacobian of q, which references c.q but never the forward zoh value)
        const dqlog = new Float64Array(Z);
        for (let k = 0; k < Z; k++) dqlog[k] = dqrep[k] * repw + dz[k] * (1 - U70N_UNIF);
        const dlog = u70nSoftmaxJacobianT(c.q, dqlog);
        {
          const ex = new Float64Array(H + U70N_D); ex.set(c.h, 0);
          for (let ii = 0; ii < U70N_D; ii++) ex[H + ii] = c.x[ii];
          const gW = G(M.We), gb = G(M.be);
          for (let j = 0; j < Z; j++) { gb[j] += dlog[j]; for (let ii = 0; ii < ex.length; ii++) gW[ii * Z + j] += dlog[j] * ex[ii]; }
          for (let ii = 0; ii < H; ii++) { let v = 0; for (let j = 0; j < Z; j++) v += M.We.w[ii * Z + j] * dlog[j]; dhn[ii] += v; }
        }
      }
      // GRU backward
      for (let k = 0; k < H; k++) dh[k] += dhn[k];
      // dh currently dL/dhn; split: hn = (1-zg)h + zg ht
      const dzg = new Float64Array(H), dht = new Float64Array(H);
      for (let k = 0; k < H; k++) { dzg[k] = dh[k] * (c.ht[k] - c.h[k]); dht[k] = dh[k] * c.zg[k]; }
      const dhPrev = new Float64Array(H);
      for (let k = 0; k < H; k++) dhPrev[k] = dh[k] * (1 - c.zg[k]);
      // ht = tanh(cl)
      const dcl = new Float64Array(H);
      for (let k = 0; k < H; k++) dcl[k] = dht[k] * (1 - c.ht[k] * c.ht[k]);
      {
        const gW = G(M.Wh), gb = G(M.bh);
        for (let j = 0; j < H; j++) { gb[j] += dcl[j]; }
        // x fixed: no grad needed except Uh path
        const gU = G(M.Uh);
        for (let j = 0; j < H; j++) for (let ii = 0; ii < H; ii++) gU[ii * H + j] += dcl[j] * c.rh[ii];
        // dh via Uh^T and rh
        const drh = new Float64Array(H);
        for (let ii = 0; ii < H; ii++) { let v = 0; for (let j = 0; j < H; j++) v += M.Uh.w[ii * H + j] * dcl[j]; drh[ii] = v; }
        // rh = rg*h
        const drg = new Float64Array(H);
        for (let k = 0; k < H; k++) { drg[k] = drh[k] * c.h[k]; dhPrev[k] += drh[k] * c.rg[k]; }
        // rg = sig(rl)
        const drl = new Float64Array(H);
        for (let k = 0; k < H; k++) drl[k] = drg[k] * c.rg[k] * (1 - c.rg[k]);
        const gWr = G(M.Wr), gUr = G(M.Ur), gbr = G(M.br);
        for (let j = 0; j < H; j++) { gbr[j] += drl[j]; for (let ii = 0; ii < H; ii++) gUr[ii * H + j] += drl[j] * c.h[ii]; }
        for (let ii = 0; ii < H; ii++) { let v = 0; for (let j = 0; j < H; j++) v += M.Ur.w[ii * H + j] * drl[j]; dhPrev[ii] += v; }
      }
      // zg = sig(zl)
      {
        const dzl = new Float64Array(H);
        for (let k = 0; k < H; k++) dzl[k] = dzg[k] * c.zg[k] * (1 - c.zg[k]);
        const gWz = G(M.Wz), gUz = G(M.Uz), gbz = G(M.bz);
        for (let j = 0; j < H; j++) { gbz[j] += dzl[j]; for (let ii = 0; ii < H; ii++) gUz[ii * H + j] += dzl[j] * c.h[ii]; }
        for (let ii = 0; ii < H; ii++) { let v = 0; for (let j = 0; j < H; j++) v += M.Uz.w[ii * H + j] * dzl[j]; dhPrev[ii] += v; }
      }
      dh = dhPrev;
    }
  }
  // clip + adam step (model params; probe params already in grads via accLin)
  let norm = 0;
  for (const [, g] of grads) for (let i = 0; i < g.length; i++) norm += g[i] * g[i];
  norm = Math.sqrt(norm);
  const sc = norm > U70N_CLIP ? U70N_CLIP / norm : 1;
  M._t = (M._t || 0) + 1;
  const b1 = 0.9, b2 = 0.999, ep = 1e-8;
  const lrEff = U70N_WARMUP ? U70N_LR * Math.min(1, M._t / U70N_WARMUP) : U70N_LR; // F7 warmup: epochs 1..W ramp, then flat
  for (const P of M.params) {
    const g = grads.get(P); if (!g) continue;
    for (let i = 0; i < P.w.length; i++) {
      const gi = g[i] * sc;
      P.m[i] = b1 * P.m[i] + (1 - b1) * gi;
      P.v[i] = b2 * P.v[i] + (1 - b2) * gi * gi;
      P.w[i] -= lrEff * (P.m[i] / (1 - Math.pow(b1, M._t))) / (Math.sqrt(P.v[i] / (1 - Math.pow(b2, M._t))) + ep);
    }
  }
  // (repw applied at loss sites below)
  return { loss: totLoss / U70N_T, probe: M.variant === "V2" ? null : totProbe / U70N_T };
}
function u70nKLraw(a, b) {
  let kl = 0;
  for (let k = 0; k < a.length; k++) kl += a[k] * Math.log(a[k] / b[k]);
  return kl;
}
function u70nKLdp(qm, pm, active) {
  // d KL(sg(qm)||pm)/d plogit via softmax jacobian; pm = softmax(plog)
  const Z = qm.length, d = new Float64Array(Z);
  if (!active) return d;
  // dL/dpm_j = -qm_j/pm_j; dlogit_i = sum_j dL/dpm_j * pm_j (delta_ji - pm_i)
  for (let i = 0; i < Z; i++) {
    let v = 0;
    for (let j = 0; j < Z; j++) v += (-qm[j] / pm[j]) * pm[j] * ((i === j ? 1 : 0) - pm[i]);
    d[i] = v;
  }
  return d;
}
function u70nKLdq(qm, pm, active) {  // d KL(qm||sg(pm))/d qlogit (qm = mix(q)); chain qm->q linear then softmax jacobian
  const Z = qm.length;
  const dq = new Float64Array(Z);
  if (!active) return dq;
  const dqm = new Float64Array(Z);
  for (let j = 0; j < Z; j++) dqm[j] = Math.log(qm[j] / pm[j]) + 1;
  for (let k = 0; k < Z; k++) dqm[k] *= (1 - U70N_UNIF);
  return dqm; // caller applies softmax jacobian wrt q logits
}
// softmax jacobian transpose: dlogit = q*(dq - dq.q). Factored (F11) so the T2 test
// exercises the exact function training uses.
function u70nSoftmaxJacobianT(q, dq) {
  const Z = q.length;
  let dot = 0; for (let k = 0; k < Z; k++) dot += dq[k] * q[k];
  const dlog = new Float64Array(Z);
  for (let k = 0; k < Z; k++) dlog[k] = q[k] * (dq[k] - dot);
  return dlog;
}
// F11: filed shuffle-RNG convention factored out (identical draws, 73000+seed+off).
function u70nShuffleOrder(seed, shufOff, T) {
  const order = [...Array(T).keys()];
  const rng = u70nMulberry32(73000 + seed + shufOff);
  for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); const tmp = order[i]; order[i] = order[j]; order[j] = tmp; }
  return order;
}
// F11: read-point latent intervention on the REAL eval path. Replaces the complete per-trial
// representation with the pure shuffled one-hot (original-trial q REMOVED; was zdet+q).
// Documented boundary: recurrence history stays clean-z (intervention at the read, not a rewrite).
function u70nApplyShuffle(M, trials, order) {
  const H = U70N_H, Z = U70N_Z;
  const zs = trials.map((c) => c.zi);
  const shuffled = order.map((i) => zs[i]);
  for (let t = 0; t < trials.length; t++) {
    const c = trials[t];
    const zdet = new Float64Array(Z); zdet[shuffled[t]] = 1;
    const zoh = new Float64Array(Z);
    for (let k = 0; k < Z; k++) zoh[k] = zdet[k];
    c.zohShuf = zoh;
    const sfeat = (M.variant === "F2" || M.variant === "F4") ? zoh : (() => { const f = new Float64Array(H + Z); f.set(c.hn, 0); f.set(zoh, H); return f; })();
    const clog = u70nLinCache(sfeat, M.Wc, M.bc, 2);
    c.pc = u70nSoftmax(clog, 2);
    c.ziShuf = shuffled[t];
  }
  return trials;
}
// F13: provenance hashing + held-out gates (pre-smoke HALT). 64-hex = 4x FNV-1a-64 lanes.
// Deterministic same-engine (floats via String(), ASCII-only); cross-engine bit-identity
// explicitly out of scope (prereg v1.1 determinism gloss).
function u70nHashLane(str, lane) {
  let h = [0xcbf29ce484222325n, 0x84222325cbf29ce4n, 0x9e3779b97f4a7c15n, 0xbf58476d1ce4e5b9n][lane & 3];
  const M = 0xffffffffffffffffn, P = 0x100000001b3n;
  for (let i = 0; i < str.length; i++) { h ^= BigInt(str.charCodeAt(i) & 255); h = (h * P) & M; }
  return h.toString(16).padStart(16, "0");
}
function u70nHash256(str) {
  return u70nHashLane(str, 0) + u70nHashLane(str, 1) + u70nHashLane(str, 2) + u70nHashLane(str, 3);
}
function u70nWeightHash(M) {
  const parts = [];
  for (const P of M.params) { const a = []; for (let i = 0; i < P.w.length; i++) a.push(String(P.w[i])); parts.push(a.join(",")); }
  return u70nHash256(parts.join(";"));
}
function u70nConfigHash(specStr) { return u70nHash256(specStr); }
function u70nF13ConfigSpec() {
  return ["F13", "F4-exact", "ep200", "lr3e-4", "clip1.0", "win50", "floor0.05", "ctxw3.0", "repw0.1", "GRU64/Cat4-ST", "init90000+s", "argmax", "train0-19", "eval20-39", "map s->s+20"].join("|");
}
// F13 executable tests T5/T5a-half/T6/E4h (pre-smoke HALT gate). T5a's LEDGER half runs in the
// wave script (max path-seed over filed ledgers); the CODE half (no 20..39 path call sites)
// is agent-verified by grep pre-smoke and logged. Returns log lines; throws on fail.
function u70nF13Tests() {
  const lines = [];
  // T5: mapping + disjointness + reference isolation on real gen calls
  {
    const train = [...Array(20).keys()], held = train.map((s) => s + 20);
    const overlap = train.filter((s) => held.indexOf(s) >= 0);
    if (overlap.length) throw new Error("T5 FAIL: seed overlap " + overlap);
    for (const s of [0, 5, 19]) {
      if (s + 20 < 20 || s + 20 > 39) throw new Error("T5 FAIL: mapping s=" + s);
      const pA = u70nGenPath(s), oA = u70nGenObs(s, pA);
      const pH = u70nGenPath(s + 20), oH = u70nGenObs(s + 20, pH);
      if (pA === pH || oA === oH) throw new Error("T5 FAIL: object reuse s=" + s);
      if (pA.ctx === pH.ctx || oA.xs === oH.xs) throw new Error("T5 FAIL: array reuse s=" + s);
    }
    lines.push("T5 disjointness+mapping+isolation PASS (0..19 x 20..39, reference-checked s=0,5,19)");
  }
  // T6a: hash format + init determinism (double-init identical)
  {
    const hex64 = /^[0-9a-f]{64}$/;
    const A = u70nInitModel("F4", 3, 90000), B = u70nInitModel("F4", 3, 90000);
    const ha = u70nWeightHash(A), hb = u70nWeightHash(B);
    if (!hex64.test(ha)) throw new Error("T6a FAIL: weightHash format");
    if (ha !== hb) throw new Error("T6a FAIL: init nondeterminism");
    const hc = u70nConfigHash(u70nF13ConfigSpec());
    if (!hex64.test(hc)) throw new Error("T6a FAIL: configHash format");
    if (hc !== u70nConfigHash(u70nF13ConfigSpec())) throw new Error("T6a FAIL: config nondeterminism");
    lines.push("T6a hash-format+init-determinism PASS");
  }
  // T6b: one-epoch-double determinism (same init, same stream -> identical hash after training step)
  {
    const A = u70nInitModel("F4", 11, 90000), B = u70nInitModel("F4", 11, 90000);
    const p = u70nGenPath(11), o = u70nGenObs(11, p);
    const ra = u70nEpoch(A, p, o, 0.1), rb = u70nEpoch(B, p, o, 0.1);
    if (!isFinite(ra.loss) || !isFinite(rb.loss)) throw new Error("T6b FAIL: non-finite loss");
    if (u70nWeightHash(A) !== u70nWeightHash(B)) throw new Error("T6b FAIL: train-step nondeterminism");
    lines.push("T6b train-step-determinism PASS (1-epoch double, identical hashes)");
  }
  // E4h: retention integrity on a FRESH held-out-style eval (seed 23, never a train seed)
  {
    const M = u70nInitModel("F4", 7, 90000); M._seed = 7;
    const p = u70nGenPath(23), o = u70nGenObs(23, p);
    const m = u70nEval(M, p, o, false);
    let n = 0; for (const [bn] of m.calBins) n += bn;
    if (n !== 300) throw new Error("E4h FAIL: bin n-sum " + n);
    if (!m.calTrace || m.calTrace.length !== 300) throw new Error("E4h FAIL: calTrace length");
    if (!(m.meanConf >= 0 && m.meanConf <= 1)) throw new Error("E4h FAIL: meanConf range");
    lines.push("E4h held-out-retention PASS (seed-23 eval: bins sum T, trace T)");
  }
  return lines;
}
// F11 executable tests T1-T4 (pre-smoke HALT gate). Returns log lines; throws on fail.
function u70nF11Tests() {
  const lines = [];
  const Z = U70N_Z, H = U70N_H, D = U70N_D;
  // T1: forward one-hotness on the REAL u70nStep path (strict equality, 200 draws)
  {
    const M = u70nInitModel("F4", 0, 90000); M._seed = 0;
    const rng = u70nMulberry32(12345);
    for (let i = 0; i < 200; i++) {
      const h = new Float64Array(H), x = new Float64Array(D);
      for (let j = 0; j < H; j++) h[j] = rng() * 2 - 1;
      for (let j = 0; j < D; j++) x[j] = rng() < 0.3 ? 1 : 0;
      const c = u70nStep(M, x, h, false);
      let ones = 0;
      for (let k = 0; k < Z; k++) {
        if (c.zoh[k] === 1) ones++;
        else if (c.zoh[k] !== 0) throw new Error("T1 FAIL: non-binary zoh[" + k + "]=" + c.zoh[k]);
      }
      if (ones !== 1) throw new Error("T1 FAIL: not one-hot");
      if (c.zoh[c.zi] !== 1) throw new Error("T1 FAIL: argmax mismatch");
    }
    lines.push("T1 forward-one-hotness PASS (200 draws, strict equality)");
  }
  // T2: ST-surrogate gate (HALT on fail). CORRECTION (filed same-session, prereg v1.1 stands):
  // a finite-difference "identity" of an ST surrogate against the true forward gradient is
  // mathematically void — the true forward map (argmax one-hot) has gradient 0 a.e. by design,
  // so numeric grad would be 0 while the surrogate is nonzero. That IS straight-through (biased
  // by construction). What is testable: (a) the helper training uses is a valid softmax jacobian
  // (row-sum zero, difference preservation, vs an independent re-derivation); (b) the signal path
  // is alive end-to-end (encoder weights move under training — zero grads would move nothing).
  {
    const rng = u70nMulberry32(999);
    for (let i = 0; i < 50; i++) {
      const q = new Float64Array(Z), dq = new Float64Array(Z);
      let s = 0;
      for (let k = 0; k < Z; k++) { q[k] = rng() + 0.05; s += q[k]; dq[k] = rng() * 2 - 1; }
      for (let k = 0; k < Z; k++) q[k] /= s;
      const dlog = u70nSoftmaxJacobianT(q, dq);
      let sum = 0; for (let k = 0; k < Z; k++) sum += dlog[k];
      if (Math.abs(sum) > 1e-12) throw new Error("T2a FAIL: row-sum " + sum);
      for (let k = 1; k < Z; k++) {
        const lhs = dlog[k] / q[k] - dlog[0] / q[0], rhs = dq[k] - dq[0];
        if (Math.abs(lhs - rhs) > 1e-9) throw new Error("T2a FAIL: diff-preservation");
      }
      // independent re-derivation (not calling the helper): J = diag(q) - q q^T, times dq
      for (let k = 0; k < Z; k++) {
        let v = q[k] * dq[k], sub = 0;
        for (let j = 0; j < Z; j++) sub += q[k] * q[j] * dq[j];
        if (Math.abs(dlog[k] - (v - sub)) > 1e-12) throw new Error("T2a FAIL: re-derivation mismatch");
      }
    }
    lines.push("T2a jacobian-validity PASS (50 random, row-sum 0 + diff-preservation + re-derivation)");
    // T2b vitality on the REAL training path: encoder weights must move in one epoch
    const M = u70nInitModel("F4", 5, 90000); M._seed = 5;
    const path = u70nGenPath(5), obs = u70nGenObs(5, path);
    const before = Float64Array.from(M.We.w);
    M._srng = u70nMulberry32(91000 + 5);
    const r = u70nEpoch(M, path, obs, 0.1);
    if (!isFinite(r.loss)) throw new Error("T2b FAIL: non-finite loss");
    let moved = 0;
    for (let i = 0; i < before.length; i++) if (M.We.w[i] !== before[i]) moved++;
    if (moved === 0) throw new Error("T2b FAIL: encoder frozen — ST signal dead");
    lines.push("T2b signal-vitality PASS (" + moved + "/" + before.length + " encoder weights moved, loss finite)");
  }
  // T3: intervention isolation on the REAL u70nApplyShuffle path (adversarial q)
  {
    const M = u70nInitModel("F4", 1, 90000); M._seed = 1;
    const mkQ = (a) => Float64Array.from(a);
    const trials = [
      { zi: 0, q: mkQ([0.999, 0.0004, 0.0003, 0.0003]), hn: new Float64Array(H) },
      { zi: 2, q: mkQ([0.25, 0.25, 0.25, 0.25]), hn: new Float64Array(H) },
      { zi: 1, q: mkQ([0.1, 0.7, 0.1, 0.1]), hn: new Float64Array(H) },
      { zi: 3, q: mkQ([0.02, 0.03, 0.9, 0.05]), hn: new Float64Array(H) },
    ];
    const order = [2, 0, 3, 1];
    u70nApplyShuffle(M, trials, order);
    const expectZi = [1, 0, 3, 2];
    for (let t = 0; t < trials.length; t++) {
      const c = trials[t];
      if (c.ziShuf !== expectZi[t]) throw new Error("T3 FAIL: mapping");
      for (let k = 0; k < Z; k++) {
        if (!(c.zohShuf[k] === 0 || c.zohShuf[k] === 1)) throw new Error("T3 FAIL: non-binary shuffled zoh");
      }
      let ones = 0; for (let k = 0; k < Z; k++) if (c.zohShuf[k] === 1) ones++;
      if (ones !== 1 || c.zohShuf[c.ziShuf] !== 1) throw new Error("T3 FAIL: not one-hot at shuffled idx");
      for (let k = 0; k < Z; k++) for (let j = 0; j < Z; j++) {
        if (c.zohShuf[k] !== 0 && c.zohShuf[k] !== 1) throw new Error("T3 FAIL: posterior float present");
        if (c.q[j] !== 0 && c.q[j] !== 1 && c.zohShuf[k] === c.q[j] && c.zohShuf[k] !== 0) throw new Error("T3 FAIL: q leak");
      }
    }
    lines.push("T3 intervention-isolation PASS (exact binarity + mapping, adversarial q)");
  }
  // T4: shuffle determinism (same seed+offset twice identical; permutation valid)
  {
    const a = u70nShuffleOrder(5, 0, 300), b = u70nShuffleOrder(5, 0, 300), c = u70nShuffleOrder(6, 0, 300);
    for (let t = 0; t < 300; t++) if (a[t] !== b[t]) throw new Error("T4 FAIL: nondeterministic");
    const s = new Set(a);
    if (s.size !== 300) throw new Error("T4 FAIL: not a permutation");
    let same = 0; for (let t = 0; t < 300; t++) if (a[t] === c[t]) same++;
    if (same === 300) throw new Error("T4 FAIL: seed-insensitive");
    lines.push("T4 shuffle-determinism PASS");
  }
  return lines;
}
// F14 config spec (provenance for TRUE-metric rows; training identical to F12/F13).
function u70nF14ConfigSpec() {
  return ["F14", "F12-exact", "ep200", "lr3e-4", "clip1.0", "win50", "floor0.05", "ctxw3.0", "repw0.1", "GRU64/Cat4-ST", "init90000+s", "argmax", "train0-19", "eval s clean+TRUE + s+20 clean+TRUE", "TRUE-pure-shuffle-metric"].join("|");
}
// F14 executable tests T7/T8/T8b (pre-smoke HALT gate). Proves the TRUE intervention
// landed ON THE METRIC PATH (r2 adoption): T7 reads metric-path head inputs via the
// captureShuf hook in u70nEval; T8 equates metric path to helper; T8b re-derives the
// shuffled read independently (no helper, no metric branch) and demands strict ===.
function u70nF14Tests() {
  const lines = [];
  const Z = U70N_Z, H = U70N_H, T = U70N_T;
  const M = u70nInitModel("F4", 3, 90000); M._seed = 3;
  const path = u70nGenPath(3), obs = u70nGenObs(3, path);
  const cap = [];
  u70nEval(M, path, obs, true, { captureShuf: cap });
  if (cap.length !== T) throw new Error("T7 FAIL: capture length " + cap.length);
  // independent clean-zi recompute (public step loop, no eval internals)
  let h = new Float64Array(H);
  const cleanZi = [];
  for (let t = 0; t < T; t++) { const c = u70nStep(M, u70nInput(obs.xs, obs.as, obs.rs, t), h, false); h = c.hn; cleanZi.push(c.zi); }
  // T7: metric-path isolation — z-part exact one-hot, no q float present, valid permutation
  {
    const a = cleanZi.slice().sort((x, y) => x - y), seen = [];
    for (const r of cap) {
      let ones = 0;
      for (let k = 0; k < Z; k++) {
        if (r.zoh[k] === 1) ones++;
        else if (r.zoh[k] !== 0) throw new Error("T7 FAIL: non-binary zoh " + r.zoh[k]);
        for (let j = 0; j < Z; j++) {
          if (r.q[j] !== 0 && r.q[j] !== 1 && r.zoh[k] === r.q[j] && r.zoh[k] !== 0) throw new Error("T7 FAIL: q leak");
        }
      }
      if (ones !== 1) throw new Error("T7 FAIL: not one-hot");
      seen.push(r.ziShuf);
    }
    seen.sort((x, y) => x - y);
    for (let t = 0; t < T; t++) if (a[t] !== seen[t]) throw new Error("T7 FAIL: not a permutation");
    lines.push("T7 metric-path-isolation PASS (" + T + " trials: exact one-hot, no q float, valid permutation)");
  }
  // T8: helper-metric equivalence — same order through the helper gives identical pc
  {
    const order = u70nShuffleOrder(M._seed || 0, M._shufOff || 0, T);
    let h2 = new Float64Array(H);
    const trials = [];
    for (let t = 0; t < T; t++) { const c = u70nStep(M, u70nInput(obs.xs, obs.as, obs.rs, t), h2, false); h2 = c.hn; trials.push({ zi: c.zi, q: c.q, hn: c.hn }); }
    u70nApplyShuffle(M, trials, order);
    for (let t = 0; t < T; t++) {
      const a = trials[t].pc, b = cap[t].pc;
      for (let k = 0; k < 2; k++) if (a[k] !== b[k]) throw new Error("T8 FAIL: pc mismatch t=" + t);
    }
    lines.push("T8 helper-metric-equivalence PASS (" + T + " trials strict ===)");
  }
  // T8b: independent recompute — ziShuf + frozen Wc/bc, no helper, no metric branch
  {
    for (let t = 0; t < T; t++) {
      const r = cap[t];
      const zdet = new Float64Array(Z); zdet[r.ziShuf] = 1;
      const clog = u70nLinCache(zdet, M.Wc, M.bc, 2); // F4 rule: ctx-head reads z-onehot ONLY
      const pc = u70nSoftmax(clog, 2);
      for (let k = 0; k < 2; k++) if (pc[k] !== r.pc[k]) throw new Error("T8b FAIL: recompute mismatch t=" + t);
    }
    lines.push("T8b independent-recompute PASS (" + T + " trials strict ===, q never referenced)");
  }
  return lines;
}
// F15 helpers + tests (countersigned v1.1 EXACT): multi-trajectory pool + schedule + step-count.
function u70nF15Pool(s) {
  const a = [];
  for (let k = 0; k < 8; k++) a.push(1000 + s * 8 + k);
  return a;
}
function u70nF15ConfigSpec() {
  return ["F15", "F14-exact-eval", "multi8-roundrobin", "ep200", "optSteps200", "chunk1200", "lr3e-4", "clip1.0", "win50", "floor0.05", "ctxw3.0", "repw0.1", "GRU64/Cat4-ST", "init90000+s", "argmax", "pool1000+s*8", "eval pool8 clean+TRUE + s+20 clean+TRUE", "TRUE-pure-shuffle-metric"].join("|");
}
function u70nF15Tests() {
  const lines = [];
  // T9a: pool disjointness (160 distinct, zero overlap 0..39)
  {
    const all = [];
    for (let s = 0; s < 20; s++) for (const p of u70nF15Pool(s)) all.push(p);
    if (new Set(all).size !== 160) throw new Error("T9a FAIL: pool not 160 distinct");
    for (const p of all) if (p >= 0 && p <= 39) throw new Error("T9a FAIL: pool overlaps 0..39: " + p);
    lines.push("T9a pool-disjointness PASS (160 distinct, zero overlap 0..39)");
  }
  // T5-new: pool disjoint from held-out s+20 + mapping + reference isolation
  {
    for (const s of [0, 5, 19]) {
      const pool = u70nF15Pool(s);
      if (pool.indexOf(s + 20) >= 0) throw new Error("T5 FAIL: pool hits held-out s=" + s);
      const pH = u70nGenPath(s + 20), oH = u70nGenObs(s + 20, pH);
      const p0 = u70nGenPath(pool[0]), o0 = u70nGenObs(pool[0], p0);
      if (p0 === pH || o0 === oH) throw new Error("T5 FAIL: object reuse s=" + s);
    }
    lines.push("T5 pool-heldout-disjointness+mapping PASS (P(s) x s+20, s=0,5,19)");
  }
  // T5a-new code half: canonical 0..19 never appear as F15 training pools
  {
    for (let s = 0; s < 20; s++) for (const p of u70nF15Pool(s)) {
      if (p >= 0 && p <= 19) throw new Error("T5a FAIL: canonical in pool");
      if (p >= 20 && p <= 39) throw new Error("T5a FAIL: held-out in pool");
    }
    lines.push("T5a freshness-code PASS (pools outside 0..39; canonical 0..19 never trained)");
  }
  // T9b: schedule e-mod-8 (epochs 0..15 -> 0..7,0..7)
  {
    for (const s of [0, 5, 19]) {
      const pool = u70nF15Pool(s);
      for (let e = 0; e < 16; e++) {
        const k = e % 8;
        if (pool[k] !== 1000 + s * 8 + k) throw new Error("T9b FAIL: schedule s=" + s + " e=" + e);
      }
    }
    lines.push("T9b schedule PASS (e-mod-8, 0..15 = 0..7,0..7)");
  }
  // T9c: determinism (same-order identical)
  {
    const A = u70nInitModel("F4", 3, 90000), B = u70nInitModel("F4", 3, 90000);
    const p = u70nGenPath(1000), o = u70nGenObs(1000, p);
    const ra = u70nEpoch(A, p, o, 0.1), rb = u70nEpoch(B, p, o, 0.1);
    if (!isFinite(ra.loss) || !isFinite(rb.loss)) throw new Error("T9c FAIL: non-finite");
    if (u70nWeightHash(A) !== u70nWeightHash(B)) throw new Error("T9c FAIL: nondeterminism");
    lines.push("T9c determinism PASS (pool-seed 1000 one-epoch double identical)");
  }
  // T9d: step-count (200 optimizer steps + 1200 chunk passes per seed — same as F14)
  {
    if (U70N_EPOCHS !== 200) throw new Error("T9d FAIL: epochs " + U70N_EPOCHS);
    if (U70N_T % U70N_WIN !== 0) throw new Error("T9d FAIL: T/WIN");
    const chunks = U70N_T / U70N_WIN;
    if (chunks !== 6) throw new Error("T9d FAIL: chunks " + chunks);
    if (200 * chunks !== 1200) throw new Error("T9d FAIL: arithmetic");
    lines.push("T9d step-count PASS (200 optimizer steps + 1200 chunk passes/seed, F14-identical)");
  }
  // T6-new: hash format (retained meaning on new reservation)
  {
    const hex64 = /^[0-9a-f]{64}$/;
    const hc = u70nConfigHash(u70nF15ConfigSpec());
    if (!hex64.test(hc)) throw new Error("T6 FAIL: configHash format");
    lines.push("T6 hash-format PASS (F15 spec 256-bit)");
  }
  // E4h-new: retention on pool-seed + held-out-seed evals
  {
    const M = u70nInitModel("F4", 7, 90000); M._seed = 7;
    for (const ps of [1000, 27]) {
      const p = u70nGenPath(ps), o = u70nGenObs(ps, p);
      const m = u70nEval(M, p, o, false);
      let n = 0; for (const [bn] of m.calBins) n += bn;
      if (n !== 300) throw new Error("E4h FAIL: bin sum " + ps);
      if (!m.calTrace || m.calTrace.length !== 300) throw new Error("E4h FAIL: trace " + ps);
    }
    lines.push("E4h retention PASS (pool-1000 + held-27 evals: bins sum T, trace T)");
  }
  return lines;
}
// F16 config specs (countersigned v1.2 EXACT): A0 == F14 verbatim (replication); A1/A2/B distinct.
function u70nF16ConfigSpec(arm) {
  if (arm === "A0") return u70nF14ConfigSpec();
  const base = ["F16-" + arm, "ep200", "lr3e-4", "clip1.0", "win50", "floor0.05", "ctxw3.0", "repw0.1"];
  if (arm === "A1") return base.concat(["GRU64-ZREC1/Cat4-ST", "DIN=D+Z", "t0zero", "sample-train/argmax-eval", "init90000+s", "argmax", "train0-19", "eval s clean+TRUE + s+20 clean+TRUE", "TRUE-pure-shuffle-metric"]).join("|");
  if (arm === "A2") return base.concat(["GRU128/Cat4-ST", "regrown-same-bases-NOT-same-births", "init90000+s", "argmax", "train0-19", "eval s clean+TRUE + s+20 clean+TRUE", "TRUE-pure-shuffle-metric"]).join("|");
  if (arm === "B") return base.concat(["GRU128-ZREC1/Cat4-ST", "DIN=D+Z", "regrown-same-bases-NOT-same-births", "init90000+s", "argmax", "train0-19", "eval s clean+TRUE + s+20 clean+TRUE + unfam2000+s clean+TRUE + zzero + hcut", "TRUE-pure-shuffle-metric"]).join("|");
  throw new Error("F16 HALT: unknown arm " + arm);
}
// F16 executable tests T10a-f (pre-smoke HALT gate). T10e grep half (no optimizer/M.params write in
// ablation branches) + T10a code-flag half are agent-verified by grep pre-smoke and logged;
// runtime halves below assert specs/hashes/steps/disjointness/read-only/retention. Fail = HALT.
function u70nF16Tests() {
  const lines = [];
  const H0 = U70N_H, Z0 = U70N_ZREC;
  try {
    // T10a: specs distinct (A0 == F14 verbatim) + geometry distinct
    {
      const a0 = u70nF16ConfigSpec("A0"), f14 = u70nF14ConfigSpec();
      if (a0 !== f14) throw new Error("T10a FAIL: A0 spec != F14 spec");
      const a1 = u70nF16ConfigSpec("A1"), a2 = u70nF16ConfigSpec("A2"), b = u70nF16ConfigSpec("B");
      if (new Set([a0, a1, a2, b]).size !== 4) throw new Error("T10a FAIL: specs not pairwise distinct");
      U70N_H = 64; U70N_ZREC = 0; const m0 = u70nInitModel("F4", 3, 90000);
      U70N_H = 64; U70N_ZREC = 1; const m1 = u70nInitModel("F4", 3, 90000);
      U70N_H = 128; U70N_ZREC = 0; const m2 = u70nInitModel("F4", 3, 90000);
      U70N_H = 128; U70N_ZREC = 1; const mb = u70nInitModel("F4", 3, 90000);
      if (!(m0._H === 64 && m0._ZREC === 0 && m0._DIN === 7)) throw new Error("T10a FAIL: A0 geometry");
      if (!(m1._H === 64 && m1._ZREC === 1 && m1._DIN === 11)) throw new Error("T10a FAIL: A1 geometry");
      if (!(m2._H === 128 && m2._ZREC === 0)) throw new Error("T10a FAIL: A2 geometry");
      if (!(mb._H === 128 && mb._ZREC === 1 && mb._DIN === 11)) throw new Error("T10a FAIL: B geometry");
      if (m0.Wz.w.length === m2.Wz.w.length) throw new Error("T10a FAIL: H128 weights not regrown");
      for (const m of [m0, m1, m2, mb]) {
        for (const e of m._initLog) if (!(e.drawIndex >= 0 && e.fan > 0 && isFinite(e.scale) && isFinite(e.first))) throw new Error("T10a FAIL: initLog fields");
      }
      const h0 = u70nWeightHash(m0), h2 = u70nWeightHash(m2);
      if (h0 === h2) throw new Error("T10a FAIL: H128 hash equals H64 (equality = bug per G4)");
      lines.push("T10a flag-isolation PASS (A0==F14, 4 specs distinct, geometries + G4 initLog + hash-inequality)");
    }
    // T10b: step-count constants (wave asserts per-seed 200/1200; here the constants)
    {
      if (U70N_EPOCHS !== 200) throw new Error("T10b FAIL: epochs " + U70N_EPOCHS);
      if (U70N_T % U70N_WIN !== 0) throw new Error("T10b FAIL: T/WIN");
      if (U70N_T / U70N_WIN !== 6) throw new Error("T10b FAIL: chunks");
      if (200 * 6 !== 1200) throw new Error("T10b FAIL: arithmetic");
      lines.push("T10b step-count PASS (200 optimizer + 1200 chunk passes/seed/arm, F14-identical)");
    }
    // T10c: per-arm 1-epoch double determinism (same-order identical; order invariance NOT required)
    {
      const cfgs = [["A0", 64, 0], ["A1", 64, 1], ["A2", 128, 0], ["B", 128, 1]];
      for (const [arm, H, ZR] of cfgs) {
        U70N_H = H; U70N_ZREC = ZR;
        const A = u70nInitModel("F4", 5, 90000), Bm = u70nInitModel("F4", 5, 90000);
        const pp = u70nGenPath(5), oo = u70nGenObs(5, pp);
        const ra = u70nEpoch(A, pp, oo, 0.1), rb = u70nEpoch(Bm, pp, oo, 0.1);
        if (!isFinite(ra.loss) || !isFinite(rb.loss)) throw new Error("T10c FAIL: non-finite " + arm);
        if (u70nWeightHash(A) !== u70nWeightHash(Bm)) throw new Error("T10c FAIL: nondeterminism " + arm);
      }
      lines.push("T10c determinism PASS (4 arms x 1-epoch double identical)");
    }
    // T10d: unfamiliar disjointness (U(s)=2000+s) + mapping + object isolation
    {
      const U = [];
      for (let s = 0; s < 20; s++) U.push(2000 + s);
      if (new Set(U).size !== 20) throw new Error("T10d FAIL: unfamiliar not 20 distinct");
      for (const u of U) {
        if (u >= 0 && u <= 39) throw new Error("T10d FAIL: unfamiliar hits 0..39");
        if (u >= 1000 && u <= 1159) throw new Error("T10d FAIL: unfamiliar hits F15 pool 1000..1159");
      }
      const pA = u70nGenPath(3, null), pU = u70nGenPath(2003, { dwell: U70N_UNFAM.dwell, psw: U70N_UNFAM.psw, prho: U70N_UNFAM.prho });
      if (pA === pU) throw new Error("T10d FAIL: object reuse");
      if (pA.ctx === pU.ctx) throw new Error("T10d FAIL: array reuse");
      lines.push("T10d unfamiliar-disjointness PASS (2000..2019 distinct, outside 0..39 + 1000..1159, isolated)");
    }
    // T10e: ablation read-only (hash equality pre/post extras on same model) + hidden-reset determinism
    {
      U70N_H = 64; U70N_ZREC = 0;
      const M = u70nInitModel("F4", 7, 90000); M._seed = 7;
      const pp = u70nGenPath(7), oo = u70nGenObs(7, pp);
      const h0 = u70nWeightHash(M);
      const m0 = u70nEval(M, pp, oo, false);
      const h1 = u70nWeightHash(M);
      const mz = u70nEval(M, pp, oo, false, { zeroZ: true });
      const h2 = u70nWeightHash(M);
      const mh = u70nEval(M, pp, oo, false, { hcut: true });
      const h3 = u70nWeightHash(M);
      if (!(h0 === h1 && h1 === h2 && h2 === h3)) throw new Error("T10e FAIL: weight hash moved under extras");
      const m0b = u70nEval(M, pp, oo, false);
      for (const k of ["ctxAcc", "ece", "actionAcc", "probeAcc"]) if (m0[k] !== m0b[k]) throw new Error("T10e FAIL: hidden carry " + k);
      void mz; void mh;
      lines.push("T10e read-only PASS (hash identical pre/post zeroZ+hcut; hidden-reset deterministic)");
    }
    // T10f: retention on clean + unfamiliar + ablation evals
    {
      U70N_H = 64; U70N_ZREC = 0;
      const M = u70nInitModel("F4", 7, 90000); M._seed = 7;
      const pp = u70nGenPath(7), oo = u70nGenObs(7, pp);
      const pu = u70nGenPath(2007, { dwell: U70N_UNFAM.dwell, psw: U70N_UNFAM.psw, prho: U70N_UNFAM.prho });
      const ou = u70nGenObs(2007, pu);
      for (const [tag, m] of [["clean", u70nEval(M, pp, oo, false)], ["unfam", u70nEval(M, pu, ou, false)], ["zeroZ", u70nEval(M, pp, oo, false, { zeroZ: true })], ["hcut", u70nEval(M, pp, oo, false, { hcut: true })]]) {
        let n = 0; for (const bn of m.calBins) n += bn[0];
        if (n !== 300) throw new Error("T10f FAIL: bin sum " + tag);
        if (!m.calTrace || m.calTrace.length !== 300) throw new Error("T10f FAIL: trace " + tag);
      }
      lines.push("T10f retention PASS (clean + unfamiliar + zeroZ + hcut: bins sum T, trace T)");
    }
  } finally { U70N_H = H0; U70N_ZREC = Z0; }
  return lines;
}
// ---- eval ----
function u70nEval(M, path, obs, zShuffle, RC) {
  RC = RC || {};
  const rhoVals = RC.rhoVals || U70N_RHO, pay = RC.pay === undefined ? 0.8 : RC.pay;
  const H = (M._H || U70N_H), Z = U70N_Z, ZR = (M._ZREC || 0);
  let h = new Float64Array(H);
  let zpE = new Float64Array(Z); // F16: eval z-prev carry (zero at start, argmax carry, frozen)
  const good = (c) => (c === 0 ? 0 : 1);
  const grace = new Set();
  for (const s of path.switches) for (let t = s; t < Math.min(U70N_T, s + 10); t++) grace.add(t);
  let order = null;
  if (zShuffle) {
    order = [...Array(U70N_T).keys()];
    const rng = u70nMulberry32(73000 + (M._seed || 0) + (M._shufOff || 0)); // F10: per-member shuffle offset (default 0 = filed behavior)
    for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); const tmp = order[i]; order[i] = order[j]; order[j] = tmp; }
  }
  // first pass: collect per-trial z + hiddens with clean z (F16: RC.hcut = feedforward-only, hidden reset each step; eval never optimizes — read-only)
  const trials = [];
  for (let t = 0; t < U70N_T; t++) {
    if (RC.hcut) h = new Float64Array(H); // F16 h-cut ablation: no carry (mask/override only, no weight write)
    const x = u70nInput(obs.xs, obs.as, obs.rs, t);
    const c = u70nStep(M, x, h, false, ZR ? zpE : null);
    h = c.hn;
    if (ZR && M.variant !== 'V2') { const nz = new Float64Array(Z); nz[c.zi] = 1; zpE = nz; }
    trials.push(c);
  }
  if (RC.zeroZ && M.variant !== 'V2') { const z0 = new Float64Array(Z); for (const c of trials) { const lg = u70nLinCache(z0, M.Wc, M.bc, 2); c.pc = u70nSoftmax(lg, 2); } } // F16 z-zero ablation: ctx-head z input zeroed (mask/override only, no weight write)
  if (zShuffle && M.variant !== "V2") {
    // F14 (countersigned v1.1 EXACT): TRUE full-latent intervention — the factored helper
    // IS the metric path (deletes the C2-partial inline branch zdet+q). Boundary unchanged
    // from F11: recurrence history stays clean-z (intervention at the read point).
    u70nApplyShuffle(M, trials, order);
    if (RC && RC.captureShuf) for (const c of trials) RC.captureShuf.push({ q: Array.from(c.q), zoh: Array.from(c.zohShuf), ziShuf: c.ziShuf, pc: Array.from(c.pc) });
  }
  let correct = 0; const calBins = Array.from({ length: 10 }, () => [0, 0, 0]); // F12: [n, correct, confSum] (valid ECE; was fixed-0.95)
  let fa = 0, rhoHit = 0, rhoAbs = 0, confSumAll = 0;
  let maskedN = 0, maskedC = 0, misN = 0, misC = 0, lowN = 0, lowC = 0;
  let oActC = 0, cueActC = 0;
  const pTrueTrace = [];
  const calTrace = []; // F12: per-trial [conf4dp, hit] (hit = ctx-guess correct, all trials incl. masked)
  const traceCtx = RC.trace ? [] : null, traceAct = RC.trace ? [] : null; // F10: per-trial vote logging
  const qMean = M.variant === "V2" ? null : new Float64Array(Z);
  let klSum = 0, probeHit = 0, entSum = 0; // F16: mean entropy reporting-only
  for (let t = 0; t < U70N_T; t++) {
    const c = trials[t], ct = path.ctx[t], ri = path.rho[t];
    const guess = c.pc[1] > c.pc[0] ? 1 : 0;
    if (guess === ct) correct++;
    const conf = Math.max(c.pc[0], c.pc[1]);
    const b = Math.min(9, Math.floor(conf * 10));
    calBins[b][0]++; if (guess === ct) calBins[b][1]++; calBins[b][2] += conf; confSumAll += conf;
    calTrace.push([+conf.toFixed(4), guess === ct ? 1 : 0]);
    const pTrue = ct === 0 ? c.pc[0] : c.pc[1];
    pTrueTrace.push(pTrue);
    entSum += -(c.pc[0] * Math.log(Math.max(c.pc[0], 1e-12)) + c.pc[1] * Math.log(Math.max(c.pc[1], 1e-12)));
    if (!grace.has(t) && (1 - pTrue) >= 0.75) fa++;
    if (M.variant !== "V5" && c.pr) {
      let rg = 0; for (let i = 1; i < 3; i++) if (c.pr[i] > c.pr[rg]) rg = i;
      if (rg === ri) rhoHit++;
      rhoAbs += Math.abs((c.pr[0] * rhoVals[0] + c.pr[1] * rhoVals[1] + c.pr[2] * rhoVals[2]) - rhoVals[ri]);
    }
    const masked = obs.xs[t] === 2;
    if (masked) { maskedN++; if (guess === ct) maskedC++; }
    const cueGood = !masked && obs.xs[t] === good(ct);
    if (!masked && !cueGood) { misN++; if (guess === ct) misC++; }
    if (ri === 0) { lowN++; if (guess === ct) lowC++; }
    const eL = c.pc[0] * pay + c.pc[1] * (1 - pay), eR = c.pc[0] * (1 - pay) + c.pc[1] * pay;
    if ((eR > eL ? 1 : 0) === good(ct)) oActC++;
    if (RC.trace) { traceCtx.push(guess); traceAct.push(eR > eL ? 1 : 0); }
    if (obs.as[t] === good(ct)) cueActC++;
    if (M.variant !== "V2") {
      for (let k = 0; k < Z; k++) qMean[k] += c.q[k] / U70N_T;
      klSum += u70nKLraw(u70nMixQ(c.q), u70nMixQ(c.p));
      let pg = 0; for (let k = 1; k < 2; k++) if (c.pq[k] > c.pq[pg]) pg = k;
      if (pg === ct) probeHit++;
    }
  }
  const delays = [];
  for (const s of path.switches) {
    let d = null;
    for (let t = s; t < Math.min(U70N_T, s + U70N_DWELL); t++) if (pTrueTrace[t] >= 0.75) { d = t - s; break; }
    delays.push(d);
  }
  const ftd = delays.filter((d) => d === null).length;
  const det = delays.filter((d) => d !== null).sort((a, b) => a - b);
  // F12: valid ECE = sum_b (n_b/N)|acc_b - conf_b| (empty bins contribute 0, no accuracy term).
  // Filed fixed-0.95 field removed (same name, different meaning fails the next audit); filed
  // ledgers keep their values as measured-as-run with the fixed-reference gloss.
  let eceN = 0, ece = 0, mce = 0;
  const calBinsOut = calBins.map(([n, k, cs]) => {
    if (!n) return [0, 0, 0];
    const acc = k / n, mc = cs / n, d = Math.abs(acc - mc);
    ece += n * d; if (d > mce) mce = d; eceN += n;
    return [n, +acc.toFixed(4), +mc.toFixed(4)];
  });
  void eceN;
  let usage = null, probeAcc = null, klMean = null, entMean = null;
  if (M.variant !== "V2") {
    let used = 0; for (let k = 0; k < Z; k++) if (qMean[k] > 0.10) used++;
    usage = used / Z; probeAcc = probeHit / U70N_T; klMean = klSum / U70N_T; entMean = entSum / U70N_T;
  }
  return {
    ctxAcc: +(correct / U70N_T).toFixed(4),
    ece: eceN ? +(ece / eceN).toFixed(6) : null,
    mce: eceN ? +mce.toFixed(6) : null,
    meanConf: eceN ? +(confSumAll / eceN).toFixed(4) : null,
    calBins: calBinsOut, calTrace,
    detDelayMedian: det.length ? det[Math.floor(det.length / 2)] : null,
    ftd, nSwitches: path.switches.length,
    faPer100: +((fa / U70N_T) * 100).toFixed(3),
    rhoAcc: M.variant === "V5" ? null : +(rhoHit / U70N_T).toFixed(4),
    rhoMAE: M.variant === "V5" ? null : +(rhoAbs / U70N_T).toFixed(4),
    maskedAcc: maskedN ? +(maskedC / maskedN).toFixed(4) : null,
    misleadAcc: misN ? +(misC / misN).toFixed(4) : null,
    lowRhoAcc: lowN ? +(lowC / lowN).toFixed(4) : null,
    actionAcc: +(oActC / U70N_T).toFixed(4),
    cueActAcc: +(cueActC / U70N_T).toFixed(4),
    usage: usage === null ? null : +usage.toFixed(3),
    probeAcc: probeAcc === null ? null : +probeAcc.toFixed(4),
    klMean: klMean === null ? null : +klMean.toFixed(4),
    meanEnt: entMean === null ? null : +entMean.toFixed(4), // F16: reporting-only
    trace: RC.trace ? { ctx: traceCtx, act: traceAct } : undefined,
    pTrueTrace: RC.tracePtrue ? pTrueTrace.map((v) => +v.toFixed(4)) : undefined,
  };
}
// F12 executable tests E1-E4 (pre-smoke HALT gate). Returns log lines; throws on fail.
function u70nF12Tests() {
  const lines = [];
  const validECE = (bins) => {
    let N = 0, e = 0, m = 0;
    for (const [n, a, c] of bins) { if (!n) continue; const d = Math.abs(a - c); e += n * d; if (d > m) m = d; N += n; }
    return { ece: N ? e / N : null, mce: N ? m : null, N };
  };
  // E1: zero on perfect calibration (empty bins contribute 0)
  {
    const bins = Array.from({ length: 10 }, (_, i) => (i % 3 === 0 ? [50, 0.75, 0.75] : [0, 0, 0]));
    const { ece, mce } = validECE(bins);
    if (ece !== 0 || mce !== 0) throw new Error("E1 FAIL: perfect calibration must give 0");
    lines.push("E1 zero-on-perfect PASS (empty bins contribute 0)");
  }
  // E2: change-detector (NOT a calibration validator): all-correct-at-0.6 -> valid 0.4 vs old 0.05
  {
    const bins = Array.from({ length: 10 }, (_, i) => (i === 6 ? [100, 1, 0.6] : [0, 0, 0]));
    const { ece } = validECE(bins);
    if (Math.abs(ece - 0.4) > 1e-12) throw new Error("E2 FAIL: valid ECE should be 0.4");
    if (Math.abs(Math.abs(1 - 0.95) - 0.05) > 1e-12) throw new Error("E2 FAIL: old-formula sanity");
    if (Math.abs(ece - 0.05) < 1e-6) throw new Error("E2 FAIL: indistinguishable from old metric");
    lines.push("E2 fixed-reference-detector PASS (valid 0.4 vs old 0.05)");
  }
  // E3: determinism is exercised on the neural path by the filed replication precedent
  // (F5-k0 maxDiff 0.0000, F10 0/1080); here: same-seed eval twice identical incl. valid ECE.
  {
    const M = u70nInitModel("F4", 4, 90000); M._seed = 4;
    const path = u70nGenPath(4), obs = u70nGenObs(4, path);
    const a = u70nEval(M, path, obs, false), b = u70nEval(M, path, obs, false);
    for (const k of ["ctxAcc", "ece", "mce", "meanConf"]) if (a[k] !== b[k]) throw new Error("E3 FAIL: " + k);
    lines.push("E3 eval-determinism PASS (same-seed identical incl. valid ECE)");
  }
  // E4: retention integrity on the REAL eval path — bins sum to T, trace length T, meanConf in range
  {
    const M = u70nInitModel("F4", 7, 90000); M._seed = 7;
    const path = u70nGenPath(7), obs = u70nGenObs(7, path);
    const m = u70nEval(M, path, obs, false);
    let n = 0; for (const [bn] of m.calBins) n += bn;
    if (n !== 300) throw new Error("E4 FAIL: bin n-sum " + n + " != T");
    if (!m.calTrace || m.calTrace.length !== 300) throw new Error("E4 FAIL: calTrace length");
    if (!(m.meanConf >= 0 && m.meanConf <= 1)) throw new Error("E4 FAIL: meanConf range");
    for (const [bn, ba, bc] of m.calBins) {
      if (!bn) continue;
      if (!(ba >= 0 && ba <= 1 && bc >= 0 && bc <= 1)) throw new Error("E4 FAIL: bin range");
    }
    // recompute-from-ledger within 1e-4 (6dp ECE vs 4dp bins)
    let e = 0, N = 0;
    for (const [bn, ba, bc] of m.calBins) { if (!bn) continue; e += bn * Math.abs(ba - bc); N += bn; }
    if (Math.abs(e / N - m.ece) > 1e-4) throw new Error("E4 FAIL: recompute drift " + Math.abs(e / N - m.ece));
    lines.push("E4 retention-integrity PASS (bins sum T, trace T, recompute within 1e-4)");
  }
  return lines;
}
globalThis.runU70Neural = async function (fs, log, opts) {
  opts = opts || {};
  const seeds = opts.mode === "smoke" ? [0] : U70N_SEEDS.slice();
  const epochs = opts.epochs || U70N_EPOCHS;
  const variants = opts.variants || ["V3", "V2", "V5"];
  // F1 arms (owner-ordered two-arm design): floor constant + rep-weight schedule.
  // F1a (STANDS v1.1): floor 0.05, repw fixed 0.1. F1b (exploratory): floor 0.05,
  // repw LINEAR anneal 0 -> 0.3 over epochs 1..100, hold 0.3 (locked interpolation).
  U70N_FREEBITS = (opts.floor === undefined) ? 0.25 : opts.floor;
  U70N_CTXW = (opts.ctxw === undefined) ? 1.0 : opts.ctxw;
  U70N_WARMUP = (opts.warmup === undefined) ? 0 : opts.warmup;
  U70N_TILT = (opts.tilt === undefined) ? 0 : opts.tilt;
  U70N_INITSCALE = (opts.initscale === undefined) ? 1.0 : opts.initscale;
  const anneal = !!opts.anneal;
  const repwAt = (e) => anneal ? 0.3 * Math.min(e + 1, 100) / 100 : U70N_REPW_BASE;
  const ledger = { spec: (opts.f16 ? "u70-f16-prereg-proposal" : (opts.f15 ? "u70-f15-prereg-proposal" : (opts.f14 ? "u70-f14-prereg-proposal" : (opts.f13 ? "u70-f13-prereg-proposal" : (opts.f12 ? "u70-f12-prereg-proposal" : "u70-f10-prereg-proposal"))))), version: "v1.2", track: "U70-CTX", kind: "neural-execution", epochs, floor: U70N_FREEBITS, ctxw: U70N_CTXW, warmup: U70N_WARMUP, tilt: U70N_TILT, initscale: U70N_INITSCALE, initBase: (opts.initBase === undefined ? 90000 : opts.initBase), members: opts.members || null, anneal, rows: [] };
  if (opts.f11) { // F11 (countersigned v1.1 EXACT): pre-smoke HALT gate — T1-T4 must pass before any train
    let tl;
    try { tl = u70nF11Tests(); } catch (e) { throw new Error("F11 HALT: " + String((e && e.message) || e)); }
    for (const m of tl) log("[F11-TEST] " + m);
  }
  if (opts.f13) { // F13 (countersigned v1.1 EXACT): F11 T1-T4 + F12 E1-E4 + F13 T5/T6/E4h must pass before any train
    for (const pair of [[u70nF11Tests, "F11-TEST"], [u70nF12Tests, "F12-TEST"], [u70nF13Tests, "F13-TEST"]]) {
      let tl2;
      try { tl2 = pair[0](); } catch (e) { throw new Error("F13 HALT: " + String((e && e.message) || e)); }
      for (const m of tl2) log("[" + pair[1] + "] " + m);
    }
  }
  if (opts.f14) { // F14 (countersigned v1.1 EXACT): F11 T1-T4 + F12 E1-E4 + F13 T5/T6/E4h + F14 T7/T8/T8b must pass before any train
    for (const pair of [[u70nF11Tests, "F11-TEST"], [u70nF12Tests, "F12-TEST"], [u70nF13Tests, "F13-TEST"], [u70nF14Tests, "F14-TEST"]]) {
      let tl2;
      try { tl2 = pair[0](); } catch (e) { throw new Error("F14 HALT: " + String((e && e.message) || e)); }
      for (const m of tl2) log("[" + pair[1] + "] " + m);
    }
  }
  if (opts.f15) { // F15 (countersigned v1.1 EXACT): F11 T1-T4 + F12 E1-E4 + F14 T7/T8/T8b + F15 T5-new/T5a-new/T9/T6-new/E4h-new must pass before any train
    for (const pair of [[u70nF11Tests, "F11-TEST"], [u70nF12Tests, "F12-TEST"], [u70nF14Tests, "F14-TEST"], [u70nF15Tests, "F15-TEST"]]) {
      let tl2;
      try { tl2 = pair[0](); } catch (e) { throw new Error("F15 HALT: " + String((e && e.message) || e)); }
      for (const m of tl2) log("[" + pair[1] + "] " + m);
    }
  }
  if (opts.f16) { // F16 (countersigned v1.2 EXACT): F11 T1-T4 + F12 E1-E4 + F13 T5/T5a/T6/E4h + F14 T7/T8/T8b + F16 T10a-f must pass before any train
    for (const pair of [[u70nF11Tests, "F11-TEST"], [u70nF12Tests, "F12-TEST"], [u70nF13Tests, "F13-TEST"], [u70nF14Tests, "F14-TEST"], [u70nF16Tests, "F16-TEST"]]) {
      let tl2;
      try { tl2 = pair[0](); } catch (e) { throw new Error("F16 HALT: " + String((e && e.message) || e)); }
      for (const m of tl2) log("[" + pair[1] + "] " + m);
    }
  }
  if (opts.f12) { // F12 (countersigned v1.1 EXACT): pre-smoke HALT gate — E1-E4 must pass before any train
    let tl;
    try { tl = u70nF12Tests(); } catch (e) { throw new Error("F12 HALT: " + String((e && e.message) || e)); }
    for (const m of tl) log("[F12-TEST] " + m);
  }
  if (opts.members) { // F10 ensemble vote mode: M members per seed, majority vote + disagreement
    const memb = opts.members, v = (opts.variants || ["F4"])[0];
    for (const s of seeds) {
      const path = u70nGenPath(s), obs = u70nGenObs(s, path);
      const mem = [];
      let bad = null;
      for (let mi = 0; mi < memb.length; mi++) {
        const M = u70nInitModel(v, s, memb[mi]); M._seed = s; M._shufOff = 0; M._memb = mi; // off 0 = filed convention for member evals; vote offset set later
        const t0 = Date.now();
        let mrow = null;
        for (let e = 0; e < epochs; e++) {
          const r = u70nEpoch(M, path, obs, repwAt(e));
          if ((e + 1) % 50 === 0) log(v + " m" + mi + " s" + s + " epoch " + (e + 1) + "/" + epochs + " loss=" + r.loss.toFixed(4));
          if (!isFinite(r.loss)) { mrow = { variant: v, seed: s, memb: mi, initBase: memb[mi], INVALID: true, reason: "non-finite loss" }; break; }
        }
        if (!mrow) {
          const m = u70nEval(M, path, obs, false, { trace: true });
          mrow = { variant: v, seed: s, memb: mi, initBase: memb[mi], ms: Date.now() - t0 };
          const { trace, ...rest } = m; mrow.trace = trace;
          Object.assign(mrow, rest);
          const m4 = u70nEval(M, path, obs, true, { trace: true }); // filed convention (off 0) → replication-safe gap
          mrow.v4actionAcc = m4.actionAcc;
          mrow.gap = +(mrow.actionAcc - Math.max(mrow.cueActAcc, m4.actionAcc)).toFixed(4);
          M._shufOff = mi; // vote-only shuffled eval with pre-registered per-member offset
          const m4v = u70nEval(M, path, obs, true, { trace: true });
          mrow.traceShuf = m4v.trace; M._shufOff = 0;
        } else bad = mrow;
        mem.push(mrow);
        const { trace, traceShuf, ...logged } = mrow;
        ledger.rows.push(logged);
        log("done " + v + " m" + mi + " s" + s + " " + JSON.stringify(logged));
        if (typeof globalThis.u70nYield === "function") await globalThis.u70nYield();
      }
      if (!bad) {
        const good = (c) => (c === 0 ? 0 : 1);
        let vCtx = 0, vAct = 0, vShuf = 0, cueC = 0, split = 0;
        for (let t = 0; t < U70N_T; t++) {
          const cv = mem.map((m) => m.trace.ctx[t]).sort();
          const av = mem.map((m) => m.trace.act[t]).sort();
          const sv = mem.map((m) => m.traceShuf.act[t]).sort();
          const maj = (a) => a[Math.floor(a.length / 2)];
          if (maj(cv) === path.ctx[t]) vCtx++;
          if (maj(av) === good(path.ctx[t])) vAct++;
          if (maj(sv) === good(path.ctx[t])) vShuf++;
          if (obs.as[t] === good(path.ctx[t])) cueC++;
          if (!(cv[0] === cv[cv.length - 1])) split++;
        }
        const T = U70N_T;
        const voteProbe = +(vCtx / T).toFixed(4), voteActionAcc = +(vAct / T).toFixed(4);
        const voteCueAcc = +(cueC / T).toFixed(4), voteShufAcc = +(vShuf / T).toFixed(4);
        ledger.rows.push({ variant: v + "-VOTE", seed: s, memb: memb.length, voteProbe, voteActionAcc, voteCueAcc, voteShufAcc, voteGap: +(voteActionAcc - Math.max(voteCueAcc, voteShufAcc)).toFixed(4), splitRate: +(split / T).toFixed(4) });
        log("done " + v + "-VOTE s" + s + " voteProbe=" + voteProbe);
      } else ledger.rows.push({ variant: v + "-VOTE", seed: s, INVALID: true, reason: "member INVALID" });
      if (typeof globalThis.u70nYield === "function") await globalThis.u70nYield();
    }
    await fs.writeTextFile("src/evidence/u70/d-u70-neural-" + (opts.tag || (opts.mode === "smoke" ? "smoke" : "wave1")) + ".json", JSON.stringify(ledger));
    return ledger;
  }
  if (opts.f15) { // F15 (countersigned v1.1 EXACT): multi-trajectory round-robin training, F14-exact eval
    const v = "F4";
    for (const s of seeds) {
      const pool = u70nF15Pool(s);
      const poolPaths = pool.map((ps) => u70nGenPath(ps));
      const poolObs = pool.map((ps, i) => u70nGenObs(ps, poolPaths[i]));
      const M = u70nInitModel(v, s, (opts.initBase === undefined ? 90000 : opts.initBase)); M._seed = s; M._shufOff = 0;
      const t0 = Date.now();
      const epLoss = [], poolLog = [];
      let badRow = null, optSteps = 0;
      for (let e = 0; e < epochs; e++) {
        const k = e % 8;
        poolLog.push(k);
        const r = u70nEpoch(M, poolPaths[k], poolObs[k], repwAt(e));
        optSteps++;
        if ((e + 1) % 50 === 0) { log(v + " s" + s + " epoch " + (e + 1) + "/" + epochs + " poolK=" + k + " loss=" + r.loss.toFixed(4)); epLoss.push(+r.loss.toFixed(4)); }
        if (!isFinite(r.loss)) { badRow = { variant: v, seed: s, INVALID: true, reason: "non-finite loss" }; break; }
        if (typeof globalThis.u70nYield === "function") await globalThis.u70nYield();
      }
      if (poolLog.length !== epochs) throw new Error("F15 HALT: poolLog length s=" + s);
      for (let e = 0; e < Math.min(16, poolLog.length); e++) if (poolLog[e] !== e % 8) throw new Error("F15 HALT: schedule s=" + s);
      const chunkPasses = epochs * (U70N_T / U70N_WIN);
      if (optSteps !== epochs || chunkPasses !== 1200) throw new Error("F15 HALT: step-count s=" + s + " opt=" + optSteps + " chunk=" + chunkPasses);
      if (badRow) { ledger.rows.push(badRow); log("done " + v + " s" + s + " INVALID"); continue; }
      const weightHash = u70nWeightHash(M), configHash = u70nConfigHash(u70nF15ConfigSpec());
      ledger.rows.push({ variant: v + "-TRAIN", seed: s, pool, poolLog, optSteps, chunkPasses, epLoss, weightHash, configHash, ms: Date.now() - t0 });
      log("[F15-TRAIN] s" + s + " optSteps=" + optSteps + " chunk=" + chunkPasses + " hash=" + weightHash.slice(0, 12));
      // 8 pool-clean + 8 pool-TRUE (M._seed=s filed convention for shuffle)
      const poolClean = [], poolTrue = [];
      for (let k = 0; k < 8; k++) {
        const ps = pool[k];
        const m = u70nEval(M, poolPaths[k], poolObs[k], false);
        const row = { variant: v, seed: s, evalKind: "pool-clean", poolK: k, evalSeed: ps, ms: 0, epLoss: epLoss.slice(), weightHash, configHash };
        Object.assign(row, m);
        poolClean.push(row); ledger.rows.push(row);
        const m4 = u70nEval(M, poolPaths[k], poolObs[k], true);
        const rowT = { variant: v, seed: s, evalKind: "pool-true", poolK: k, evalSeed: ps, ms: 0, epLoss: epLoss.slice(), weightHash, configHash };
        Object.assign(rowT, m);
        rowT.v4actionAcc = m4.actionAcc;
        rowT.gap = +(rowT.actionAcc - Math.max(rowT.cueActAcc, m4.actionAcc)).toFixed(4);
        poolTrue.push(rowT); ledger.rows.push(rowT);
        let nb = 0; for (const bn of m.calBins) nb += bn[0];
        if (nb !== U70N_T || !m.calTrace || m.calTrace.length !== U70N_T) throw new Error("F15 HALT: E4 retention s=" + s + " k=" + k);
        if (typeof globalThis.u70nYield === "function") await globalThis.u70nYield();
      }
      // held-out s+20 clean + TRUE (F13 mapping, T5 object-reuse guard)
      const hs = s + 20;
      const pathH = u70nGenPath(hs), obsH = u70nGenObs(hs, pathH);
      for (let k = 0; k < 8; k++) if (pathH === poolPaths[k] || obsH === poolObs[k]) throw new Error("F15 HALT: T5 object reuse s=" + s);
      if (hs !== s + 20) throw new Error("F15 HALT: T5 mapping s=" + s);
      const mH = u70nEval(M, pathH, obsH, false);
      const rowH = { variant: v, seed: s, evalKind: "heldout-clean", evalSeed: hs, ms: 0, epLoss: epLoss.slice(), weightHash, configHash };
      Object.assign(rowH, mH);
      const m4H = u70nEval(M, pathH, obsH, true);
      rowH.v4actionAcc = m4H.actionAcc;
      rowH.gap = +(rowH.actionAcc - Math.max(rowH.cueActAcc, m4H.actionAcc)).toFixed(4);
      let nbH = 0; for (const bn of rowH.calBins) nbH += bn[0];
      if (nbH !== U70N_T || !rowH.calTrace || rowH.calTrace.length !== U70N_T) throw new Error("F15 HALT: E4h retention s=" + s);
      ledger.rows.push(rowH);
      const rowHT = { variant: v, seed: s, evalKind: "heldout-true", evalSeed: hs, ms: 0, epLoss: epLoss.slice(), weightHash, configHash };
      Object.assign(rowHT, mH);
      rowHT.v4actionAcc = m4H.actionAcc;
      rowHT.gap = +(rowHT.actionAcc - Math.max(rowHT.cueActAcc, m4H.actionAcc)).toFixed(4);
      rowHT.weightHash = weightHash; rowHT.configHash = configHash;
      // note: rowHT reuses clean mH fields except gap vs TRUE (clean vs shuffled read on same weights)
      ledger.rows.push(rowHT);
      log("done " + v + " s" + s + " heldout s" + hs + " " + JSON.stringify({ ctxAcc: rowH.ctxAcc, probeAcc: rowH.probeAcc, gap: rowH.gap }));
      if (typeof globalThis.u70nYield === "function") await globalThis.u70nYield();
    }
    await fs.writeTextFile("src/evidence/u70/d-u70-neural-" + (opts.tag || (opts.mode === "smoke" ? "smoke" : "wave1")) + ".json", JSON.stringify(ledger));
    return ledger;
  }
  if (opts.f16) { // F16 (countersigned v1.2 EXACT): 4-arm composition, F14-exact core + bounded extras on A0+B
    const armsAll = [{ arm: "A0", H: 64, ZR: 0 }, { arm: "A1", H: 64, ZR: 1 }, { arm: "A2", H: 128, ZR: 0 }, { arm: "B", H: 128, ZR: 1 }];
    const arms = opts.arms ? armsAll.filter((a) => opts.arms.indexOf(a.arm) >= 0) : armsAll; // execution chunking only (science-identical: same order, same inits; T10c determinism)
    const seedList = opts.onlySeeds || seeds;
    const needExtra = (arm) => (arm === "A0" || arm === "B");
    for (const { arm, H, ZR } of arms) {
      U70N_H = H; U70N_ZREC = ZR; // per-arm geometry (single-threaded; restored at end)
      const configHash = u70nConfigHash(u70nF16ConfigSpec(arm));
      for (const s of seedList) {
        const path = u70nGenPath(s), obs = u70nGenObs(s, path);
        const M = u70nInitModel("F4", s, (opts.initBase === undefined ? 90000 : opts.initBase)); M._seed = s; M._shufOff = 0;
        const t0 = Date.now();
        const epLoss = []; let badRow = null, optSteps = 0;
        for (let e = 0; e < epochs; e++) {
          const r = u70nEpoch(M, path, obs, repwAt(e));
          optSteps++;
          if ((e + 1) % 50 === 0) { log("F16-" + arm + " s" + s + " epoch " + (e + 1) + "/" + epochs + " loss=" + r.loss.toFixed(4)); epLoss.push(+r.loss.toFixed(4)); }
          if (!isFinite(r.loss)) { badRow = { variant: "F16-" + arm, seed: s, INVALID: true, reason: "non-finite loss" }; break; }
          if (typeof globalThis.u70nYield === "function") await globalThis.u70nYield();
        }
        const chunkPasses = epochs * (U70N_T / U70N_WIN);
        if (optSteps !== epochs || chunkPasses !== 1200) throw new Error("F16 HALT: step-count arm=" + arm + " s=" + s + " opt=" + optSteps + " chunk=" + chunkPasses);
        if (badRow) { ledger.rows.push(badRow); log("done F16-" + arm + " s" + s + " INVALID"); continue; }
        const weightHash = u70nWeightHash(M);
        ledger.rows.push({ variant: "F16-" + arm + "-TRAIN", seed: s, arm, H, ZREC: ZR, optSteps, chunkPasses, epLoss, initLog: M._initLog, weightHash, configHash, ms: Date.now() - t0 });
        log("[F16-TRAIN] arm=" + arm + " s" + s + " opt=" + optSteps + " chunk=" + chunkPasses + " hash=" + weightHash.slice(0, 12));
        const coreEval = (p2, o2, kind, evSeed) => {
          const m = u70nEval(M, p2, o2, false);
          const row = { variant: "F16-" + arm, seed: s, arm, evalKind: kind, evalSeed: evSeed, ms: 0, epLoss: epLoss.slice(), weightHash, configHash };
          Object.assign(row, m);
          const m4 = u70nEval(M, p2, o2, true);
          row.v4actionAcc = m4.actionAcc;
          row.gap = +(row.actionAcc - Math.max(row.cueActAcc, m4.actionAcc)).toFixed(4);
          let nb = 0; for (const bn of row.calBins) nb += bn[0];
          if (nb !== U70N_T || !row.calTrace || row.calTrace.length !== U70N_T) throw new Error("F16 HALT: E4 retention arm=" + arm + " s=" + s + " " + kind);
          ledger.rows.push(row);
          return row;
        };
        coreEval(path, obs, "train-clean", s);
        coreEval(path, obs, "train-true", s);
        const hs = s + 20;
        const pathH = u70nGenPath(hs), obsH = u70nGenObs(hs, pathH);
        if (pathH === path || obsH === obs) throw new Error("F16 HALT: T5 object reuse arm=" + arm + " s=" + s);
        if (hs !== s + 20) throw new Error("F16 HALT: T5 mapping arm=" + arm + " s=" + s);
        coreEval(pathH, obsH, "held-clean", hs);
        coreEval(pathH, obsH, "held-true", hs);
        if (needExtra(arm)) {
          const hPre = u70nWeightHash(M);
          const us = 2000 + s;
          const pathU = u70nGenPath(us, { dwell: U70N_UNFAM.dwell, psw: U70N_UNFAM.psw, prho: U70N_UNFAM.prho });
          const obsU = u70nGenObs(us, pathU);
          coreEval(pathU, obsU, "unfam-clean", us);
          coreEval(pathU, obsU, "unfam-true", us);
          const mz = u70nEval(M, path, obs, false, { zeroZ: true });
          const rowZ = { variant: "F16-" + arm, seed: s, arm, evalKind: "zzero", evalSeed: s, ms: 0, weightHash, configHash };
          Object.assign(rowZ, mz); ledger.rows.push(rowZ);
          const mh = u70nEval(M, path, obs, false, { hcut: true });
          const rowH2 = { variant: "F16-" + arm, seed: s, arm, evalKind: "hcut", evalSeed: s, ms: 0, weightHash, configHash };
          Object.assign(rowH2, mh); ledger.rows.push(rowH2);
          const hPost = u70nWeightHash(M);
          if (hPre !== hPost || hPre !== weightHash) throw new Error("F16 HALT: T10e read-only violated arm=" + arm + " s=" + s);
          log("done F16-" + arm + " s" + s + " extras unfam+zzero+hcut hash-stable");
        }
        log("done F16-" + arm + " s" + s);
        if (typeof globalThis.u70nYield === "function") await globalThis.u70nYield();
      }
    }
    U70N_H = 64; U70N_ZREC = 0; // restore filed defaults
    // G1 ordering: per-arm verdicts from absolute bars BEFORE any interaction table (firewall)
    const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;
    const armVerdicts = {};
    for (const { arm } of arms) {
      const R = (k) => ledger.rows.filter((r) => r.arm === arm && r.evalKind === k && !r.INVALID);
      const tc = R("train-clean"), tt = R("train-true"), hc = R("held-clean"), ht = R("held-true");
      const trainProbe = mean(tc.map((r) => r.probeAcc)), trainGap = mean(tt.map((r) => r.gap)), trainCtx = mean(tc.map((r) => r.ctxAcc));
      const heldProbe = mean(hc.map((r) => r.probeAcc)), heldGap = mean(ht.map((r) => r.gap)), heldCtx = mean(hc.map((r) => r.ctxAcc));
      const trainV = (trainProbe >= 0.70 && trainGap >= 0.05) ? "TRAIN-REPAIRED" : ((trainProbe >= 0.70) ? "TRAIN-QUALIFIED" : "TRAIN-REGRESSED");
      const heldV = (heldProbe >= 0.70 && heldGap >= 0.05 && heldCtx >= 0.85) ? "HELDOUT-GENERALIZES" : "HELDOUT-DEGRADES";
      armVerdicts[arm] = { trainProbe: +trainProbe.toFixed(4), trainGap: +trainGap.toFixed(4), trainCtx: +trainCtx.toFixed(4), trainV, heldProbe: +heldProbe.toFixed(4), heldGap: +heldGap.toFixed(4), heldCtx: +heldCtx.toFixed(4), heldV };
      log("[F16-VERDICT] arm=" + arm + " " + trainV + " (probe " + trainProbe.toFixed(4) + " gap " + trainGap.toFixed(4) + " ctx " + trainCtx.toFixed(4) + ") + " + heldV + " (probe " + heldProbe.toFixed(4) + " gap " + heldGap.toFixed(4) + " ctx " + heldCtx.toFixed(4) + ")");
    }
    ledger.armVerdicts = armVerdicts; // assigned BEFORE interaction table per G1
    // Interaction readout (DESCRIPTIVE ONLY — never moves a separate verdict)
    const bySeed = {};
    for (const r of ledger.rows) {
      if (r.evalKind !== "train-clean" && r.evalKind !== "held-clean") continue;
      const k = r.arm + ":" + r.seed + ":" + r.evalKind;
      (bySeed[k] = bySeed[k] || {})[r.evalKind] = r;
    }
    const inter = [];
    for (const s of seedList) {
      for (const k of ["train-clean", "held-clean"]) {
        const a1 = bySeed["A1:" + s + ":" + k], a2 = bySeed["A2:" + s + ":" + k], b = bySeed["B:" + s + ":" + k];
        if (!a1 || !a2 || !b) continue;
        const d1 = +(b.probeAcc - a1.probeAcc).toFixed(4), d2 = +(b.probeAcc - a2.probeAcc).toFixed(4), dm = +(b.probeAcc - Math.max(a1.probeAcc, a2.probeAcc)).toFixed(4);
        inter.push({ seed: s, kind: k, bMinusA1: d1, bMinusA2: d2, bMinusMax: dm });
      }
    }
    ledger.interaction = inter;
    log("[F16-INTERACTION] rows=" + inter.length + " (descriptive; firewall holds)");
    await fs.writeTextFile("src/evidence/u70/d-u70-neural-" + (opts.tag || (opts.mode === "smoke" ? "smoke" : "wave1")) + ".json", JSON.stringify(ledger));
    return ledger;
  }
  for (const v of variants) {
    for (const s of seeds) {
      const path = u70nGenPath(s), obs = u70nGenObs(s, path);
      let row;
      if (v === "V1") {
        const good = (c) => (c === 0 ? 0 : 1);
        let hit = 0;
        for (let t = 0; t < U70N_T; t++) if (obs.as[t] === good(path.ctx[t])) hit++;
        row = { variant: v, seed: s, actionAcc: +(hit / U70N_T).toFixed(4), note: "reactive floor = cue-following" };
      } else {
        const M = u70nInitModel(v, s, (opts.initBase === undefined ? 90000 : opts.initBase)); M._seed = s;
        const t0 = Date.now();
        const epLoss = []; // F11 ledger field (within-wave sanity; filed waves lack it — no cross-wave claim)
        for (let e = 0; e < epochs; e++) {
          const r = u70nEpoch(M, path, obs, repwAt(e));
          if ((e + 1) % 50 === 0) { log(v + " s" + s + " epoch " + (e + 1) + "/" + epochs + " loss=" + r.loss.toFixed(4)); if (opts.f11 || opts.f12 || opts.f13 || opts.f14) epLoss.push(+r.loss.toFixed(4)); }
          if (!isFinite(r.loss)) { row = { variant: v, seed: s, INVALID: true, reason: "non-finite loss" }; break; }
        }
        if (!row) {
          const m = u70nEval(M, path, obs, false, (opts.f12 && opts.mode === "smoke") ? { tracePtrue: true } : undefined);
          row = { variant: v, seed: s, ms: Date.now() - t0 };
          if (opts.f11 || opts.f12 || opts.f13 || opts.f14) row.epLoss = epLoss;
          Object.assign(row, m);
          if (v === "V3" || v === "F2" || v === "F4") {
            const m4 = u70nEval(M, path, obs, true);
            row.v4actionAcc = m4.actionAcc;
            row.gap = +(row.actionAcc - Math.max(row.cueActAcc, m4.actionAcc)).toFixed(4);
          }
          if (opts.keepModels) { globalThis.u70nModels = globalThis.u70nModels || {}; globalThis.u70nModels[v + "-" + s] = M; }
          if (opts.heldout) { // F13: paired held-out eval on the SAME frozen weights (no training between)
            const hs = s + 20;
            const pathH = u70nGenPath(hs), obsH = u70nGenObs(hs, pathH);
            if (pathH === path || obsH === obs) throw new Error("F13 HALT: T5 object reuse s=" + s);
            if (hs !== s + 20) throw new Error("F13 HALT: T5 mapping s=" + s);
            row.evalSeed = s; row.evals = "train";
            row.weightHash = u70nWeightHash(M); row.configHash = u70nConfigHash((opts.f14 ? u70nF14ConfigSpec() : u70nF13ConfigSpec()));
            if (opts.repCheck) { // F14 per-seed early-HALT (r9): train-clean must match filed F12 before any shuffled/heldout eval
              const base = opts.repCheck[s];
              const cleanOf = (r) => { const o = {}; for (const k of ["variant", "seed", "ctxAcc", "ece", "mce", "meanConf", "calBins", "calTrace", "detDelayMedian", "ftd", "nSwitches", "faPer100", "rhoAcc", "rhoMAE", "maskedAcc", "misleadAcc", "lowRhoAcc", "actionAcc", "cueActAcc", "usage", "probeAcc", "klMean"]) o[k] = r[k]; return JSON.stringify(o); };
              if (!base) throw new Error("F14 HALT: no baseline for seed " + s);
              if (cleanOf(row) !== cleanOf(base)) throw new Error("F14 HALT: replication mismatch s=" + s + " (BROKEN — training did not land F12-exact)");
              log("[F14-REP] s" + s + " replication 0-mismatch PASS");
            }
            const mH = u70nEval(M, pathH, obsH, false);
            const rowH = { variant: v, seed: s, evalSeed: hs, evals: "heldout", ms: 0 };
            if (opts.f11 || opts.f12 || opts.f13 || opts.f14) rowH.epLoss = epLoss.slice();
            Object.assign(rowH, mH);
            if (v === "V3" || v === "F2" || v === "F4") {
              const m4H = u70nEval(M, pathH, obsH, true);
              rowH.v4actionAcc = m4H.actionAcc;
              rowH.gap = +(rowH.actionAcc - Math.max(rowH.cueActAcc, m4H.actionAcc)).toFixed(4);
            }
            rowH.weightHash = row.weightHash; rowH.configHash = row.configHash;
            let nbH = 0; for (const bn of rowH.calBins) nbH += bn[0];
            if (nbH !== U70N_T || !rowH.calTrace || rowH.calTrace.length !== U70N_T) throw new Error("F13 HALT: E4h retention s=" + s);
            ledger.rows.push(rowH);
            log("done " + v + " s" + s + " heldout s" + hs + " " + JSON.stringify({ ctxAcc: rowH.ctxAcc, probeAcc: rowH.probeAcc, gap: rowH.gap, ece: rowH.ece }));
          }
        }
      }
      ledger.rows.push(row);
      log("done " + v + " s" + s + " " + JSON.stringify(row));
      if (typeof globalThis.u70nYield === "function") await globalThis.u70nYield();
    }
  }
  await fs.writeTextFile("src/evidence/u70/d-u70-neural-" + (opts.tag || (opts.mode === "smoke" ? "smoke" : "wave1")) + ".json", JSON.stringify(ledger));
  return ledger;
};
