// u70-neural.js — U70-CTX neural execution driver (prereg v1.1 EXACT).
// F11 (countersigned v1.1 EXACT, 2026-11-27): forward-exact one-hot + pure-shuffle read +
// factored softmax-jacobian + T1-T4 HALT gate + epoch-loss ledger field. All else unchanged.
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
const U70N_H = 64, U70N_D = 7, U70N_Z = 4;
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
  M.Wz = u70nParam(U70N_D, U70N_H, rng, s(U70N_D)); M.Uz = u70nParam(U70N_H, U70N_H, rng, s(U70N_H)); M.bz = u70nBias(U70N_H);
  M.Wr = u70nParam(U70N_D, U70N_H, rng, s(U70N_D)); M.Ur = u70nParam(U70N_H, U70N_H, rng, s(U70N_H)); M.br = u70nBias(U70N_H);
  M.Wh = u70nParam(U70N_D, U70N_H, rng, s(U70N_D)); M.Uh = u70nParam(U70N_H, U70N_H, rng, s(U70N_H)); M.bh = u70nBias(U70N_H);
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
function u70nStep(M, x, h, train) {
  const H = U70N_H, Z = U70N_Z;
  const zl = new Float64Array(H), rl = new Float64Array(H), hl = new Float64Array(H);
  for (let j = 0; j < H; j++) {
    let a = M.bz.w[j], b = M.br.w[j], c = M.bh.w[j];
    for (let i = 0; i < U70N_D; i++) { a += x[i] * M.Wz.w[i * H + j]; b += x[i] * M.Wr.w[i * H + j]; c += x[i] * M.Wh.w[i * H + j]; }
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
    for (let i = 0; i < U70N_D; i++) v += x[i] * M.Wh.w[i * H + j];
    for (let i = 0; i < H; i++) v += rh[i] * M.Uh.w[i * H + j];
    cl[j] = v;
  }
  const ht = new Float64Array(H);
  for (let j = 0; j < H; j++) ht[j] = Math.tanh(cl[j]);
  const hn = new Float64Array(H);
  for (let j = 0; j < H; j++) hn[j] = (1 - zg[j]) * h[j] + zg[j] * ht[j];
  let q = null, p = null, zi = -1, zoh = null;
  if (M.variant !== "V2") {
    const ex = new Float64Array(U70N_H + U70N_D); ex.set(h, 0); ex.set(x, U70N_H);
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
  return { x, h, hn, zl, rl, cl, zg, rg, rh, ht, q, p, zi, zoh, feat, cfeat, clog, pc, rlog, pr, xlog, px, wlog, pw, qlog, pq };
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
  const H = U70N_H, Z = U70N_Z;
  const grads = new Map();
  const G = (P) => { let g = grads.get(P); if (!g) { g = new Float64Array(P.w.length); grads.set(P, g); } return g; };
  let h = new Float64Array(H), totLoss = 0, totProbe = 0;
  const chunks = U70N_T / U70N_WIN;
  for (let ch = 0; ch < chunks; ch++) {
    const t0 = ch * U70N_WIN;
    const caches = [];
    for (let t = t0; t < t0 + U70N_WIN; t++) {
      const x = u70nInput(obs.xs, obs.as, obs.rs, t);
      const c = u70nStep(M, x, h, true);
      caches.push(c); h = c.hn;
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
// ---- eval ----
function u70nEval(M, path, obs, zShuffle, RC) {
  RC = RC || {};
  const rhoVals = RC.rhoVals || U70N_RHO, pay = RC.pay === undefined ? 0.8 : RC.pay;
  const H = U70N_H, Z = U70N_Z;
  let h = new Float64Array(H);
  const good = (c) => (c === 0 ? 0 : 1);
  const grace = new Set();
  for (const s of path.switches) for (let t = s; t < Math.min(U70N_T, s + 10); t++) grace.add(t);
  let order = null;
  if (zShuffle) {
    order = [...Array(U70N_T).keys()];
    const rng = u70nMulberry32(73000 + (M._seed || 0) + (M._shufOff || 0)); // F10: per-member shuffle offset (default 0 = filed behavior)
    for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); const tmp = order[i]; order[i] = order[j]; order[j] = tmp; }
  }
  // first pass: collect per-trial z + hiddens with clean z
  const trials = [];
  for (let t = 0; t < U70N_T; t++) {
    const x = u70nInput(obs.xs, obs.as, obs.rs, t);
    const c = u70nStep(M, x, h, false);
    h = c.hn;
    trials.push(c);
  }
  if (zShuffle && M.variant !== "V2") {
    const zs = trials.map((c) => c.zi);
    const shuffled = order.map((i) => zs[i]);
    for (let t = 0; t < U70N_T; t++) {
      const c = trials[t];
      const zdet = new Float64Array(Z); zdet[shuffled[t]] = 1;
      const zoh = new Float64Array(Z);
      for (let k = 0; k < Z; k++) zoh[k] = zdet[k] + c.q[k];
      const sfeat = (M.variant === "F2" || M.variant === "F4") ? zoh : (() => { const f = new Float64Array(H + Z); f.set(c.hn, 0); f.set(zoh, H); return f; })();
      const clog = u70nLinCache(sfeat, M.Wc, M.bc, 2);
      c.pc = u70nSoftmax(clog, 2);
      c.ziShuf = shuffled[t];
    }
  }
  let correct = 0; const calBins = Array.from({ length: 10 }, () => [0, 0]);
  let fa = 0, rhoHit = 0, rhoAbs = 0;
  let maskedN = 0, maskedC = 0, misN = 0, misC = 0, lowN = 0, lowC = 0;
  let oActC = 0, cueActC = 0;
  const pTrueTrace = [];
  const traceCtx = RC.trace ? [] : null, traceAct = RC.trace ? [] : null; // F10: per-trial vote logging
  const qMean = M.variant === "V2" ? null : new Float64Array(Z);
  let klSum = 0, probeHit = 0;
  for (let t = 0; t < U70N_T; t++) {
    const c = trials[t], ct = path.ctx[t], ri = path.rho[t];
    const guess = c.pc[1] > c.pc[0] ? 1 : 0;
    if (guess === ct) correct++;
    const conf = Math.max(c.pc[0], c.pc[1]);
    const b = Math.min(9, Math.floor(conf * 10));
    calBins[b][0]++; if (guess === ct) calBins[b][1]++;
    const pTrue = ct === 0 ? c.pc[0] : c.pc[1];
    pTrueTrace.push(pTrue);
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
  let eceN = 0, ece = 0;
  for (const [n, k] of calBins) if (n > 0) { ece += n * Math.abs(k / n - 0.95); eceN += n; }
  void eceN;
  let usage = null, probeAcc = null, klMean = null;
  if (M.variant !== "V2") {
    let used = 0; for (let k = 0; k < Z; k++) if (qMean[k] > 0.10) used++;
    usage = used / Z; probeAcc = probeHit / U70N_T; klMean = klSum / U70N_T;
  }
  return {
    ctxAcc: +(correct / U70N_T).toFixed(4),
    ece: +(ece / U70N_T).toFixed(4),
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
    trace: RC.trace ? { ctx: traceCtx, act: traceAct } : undefined,
  };
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
  const ledger = { spec: "u70-f10-prereg-proposal", version: "v1.1", track: "U70-CTX", kind: "neural-execution", epochs, floor: U70N_FREEBITS, ctxw: U70N_CTXW, warmup: U70N_WARMUP, tilt: U70N_TILT, initscale: U70N_INITSCALE, initBase: (opts.initBase === undefined ? 90000 : opts.initBase), members: opts.members || null, anneal, rows: [] };
  if (opts.f11) { // F11 (countersigned v1.1 EXACT): pre-smoke HALT gate — T1-T4 must pass before any train
    let tl;
    try { tl = u70nF11Tests(); } catch (e) { throw new Error("F11 HALT: " + String((e && e.message) || e)); }
    for (const m of tl) log("[F11-TEST] " + m);
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
          if ((e + 1) % 50 === 0) { log(v + " s" + s + " epoch " + (e + 1) + "/" + epochs + " loss=" + r.loss.toFixed(4)); if (opts.f11) epLoss.push(+r.loss.toFixed(4)); }
          if (!isFinite(r.loss)) { row = { variant: v, seed: s, INVALID: true, reason: "non-finite loss" }; break; }
        }
        if (!row) {
          const m = u70nEval(M, path, obs, false);
          row = { variant: v, seed: s, ms: Date.now() - t0 };
          if (opts.f11) row.epLoss = epLoss;
          Object.assign(row, m);
          if (v === "V3" || v === "F2" || v === "F4") {
            const m4 = u70nEval(M, path, obs, true);
            row.v4actionAcc = m4.actionAcc;
            row.gap = +(row.actionAcc - Math.max(row.cueActAcc, m4.actionAcc)).toFixed(4);
          }
          if (opts.keepModels) { globalThis.u70nModels = globalThis.u70nModels || {}; globalThis.u70nModels[v + "-" + s] = M; }
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
