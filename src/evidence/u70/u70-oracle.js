// u70-oracle.js — U70-CTX exact Bayesian oracle + identifiability run.
//
// Spec: src/evidence/u70/u70-task-spec.md (frozen 2026-11-27). Deliverable-phase:
// NO bars, NO verdict — descriptive numbers for future gate-setting.
// Deterministic: mulberry32 streams per spec; driver frozen after first run
// (sha recorded in report).
//
// RUN (execute_js, fs in scope):
//   const src = await fs.readTextFile("src/evidence/u70/u70-oracle.js");
//   (0, eval)(src + "\n//# sourceURL=u70-oracle.js");
//   const rep = await globalThis.runU70Oracle(fs, (m) => console.log(m));
//   return { pooled: rep.pooled };
function u70Mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const U70_T = 300, U70_SEEDS = [...Array(20).keys()];
let U70_PSW = 0.02, U70_DWELL = 25, U70_PRHO = 0.03; const U70_EPS = 0.10;
let U70_UNFAM = null; // F16: unfamiliar params {dwell,psw,prho} when set (oracle knows the true dynamics)
const U70_RHO = [0.55, 0.75, 0.95];
const U70_PATH_BASE = 70000, U70_OBS_BASE = 72000;
function u70GenPath(seed, P) {
  P = P || {};
  const psw = P.psw === undefined ? U70_PSW : P.psw;
  const dwell = P.dwell === undefined ? U70_DWELL : P.dwell;
  const prho = P.prho === undefined ? U70_PRHO : P.prho;
  const rng = u70Mulberry32(U70_PATH_BASE + seed);
  const ctx = new Array(U70_T), rho = new Array(U70_T), switches = [];
  let c = rng() < 0.5 ? 0 : 1, r = Math.floor(rng() * 3), lastSw = -100;
  for (let t = 0; t < U70_T; t++) {
    if (t > 0 && rng() < psw && t - lastSw >= dwell) { c = 1 - c; lastSw = t; switches.push(t); }
    else if (t > 0 && rng() < psw) { /* dwell-blocked: stays */ }
    if (t > 0 && rng() < prho) { let n = Math.floor(rng() * 2); r = (r + 1 + n) % 3; }
    ctx[t] = c; rho[t] = r;
  }
  return { ctx, rho, switches };
}
function u70RunSeed(seed, P) {
  P = P || {};
  const psw = P.psw === undefined ? U70_PSW : P.psw;
  const dwell = P.dwell === undefined ? U70_DWELL : P.dwell;
  const prho = P.prho === undefined ? U70_PRHO : P.prho;
  const path = u70GenPath(seed, P);
  const rng = u70Mulberry32(U70_OBS_BASE + seed);
  // posterior over 6 states [c*3+r]; uniform prior
  let post = [1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6];
  const goodArm = (c) => (c === 0 ? 0 : 1); // 0=L,1=R
  let correct = 0, calBins = Array.from({ length: 10 }, () => [0, 0, 0]); // F12: [n, correct, confSum] (valid ECE; was [n, correct] vs fixed 0.95)
  let fa = 0, rhoHit = 0, rhoAbs = 0, rhoMeanAbs = 0, confSumAll = 0;
  let maskedN = 0, maskedC = 0, misN = 0, misC = 0, lowN = 0, lowC = 0;
  let oracleActC = 0, cueActC = 0;
  const calTrace = []; // F12: per-trial [conf4dp, hit] (re-binning future-proof)
  const grace = new Set();
  for (const s of path.switches) for (let t = s; t < Math.min(U70_T, s + 10); t++) grace.add(t);
  const delays = [];
  for (const s of path.switches) {
    let d = null;
    for (let t = s; t < Math.min(U70_T, s + dwell); t++) { /* filled below via posteriors */ }
    delays.push({ switch: s, delay: null }); // placeholder, filled in main loop
  }
  const pTrueTrace = [];
  for (let t = 0; t < U70_T; t++) {
    const c = path.ctx[t], ri = path.rho[t], rho = U70_RHO[ri];
    const good = goodArm(c);
    const masked = rng() < U70_EPS;
    const cue = masked ? -1 : (rng() < rho ? good : 1 - good);
    const act = cue >= 0 ? cue : (rng() < 0.5 ? 0 : 1);
    const rew = rng() < (act === good ? 0.8 : 0.2) ? 1 : 0;
    // exact update: transition then likelihood
    const pred = [0, 0, 0, 0, 0, 0];
    for (let cc = 0; cc < 2; cc++) for (let rr = 0; rr < 3; rr++) {
      // from (cc,rr): context flips w.p. PSW, rho resamples w.p. PRHO
      for (let nc = 0; nc < 2; nc++) {
        const pc = nc === cc ? 1 - psw : psw;
        for (let nr = 0; nr < 3; nr++) {
          const pr = nr === rr ? 1 - prho : prho / 2;
          pred[nc * 3 + nr] += post[cc * 3 + rr] * pc * pr;
        }
      }
    }
    let norm = 0;
    const lik = [];
    for (let nc = 0; nc < 2; nc++) for (let nr = 0; nr < 3; nr++) {
      const g = goodArm(nc), r2 = U70_RHO[nr];
      const pk = masked ? 1 : (cue === g ? r2 : 1 - r2);
      const pr2 = rew === 1 ? (act === g ? 0.8 : 0.2) : (act === g ? 0.2 : 0.8);
      const L = pk * pr2;
      lik.push(L); norm += pred[nc * 3 + nr] * L;
    }
    post = lik.map((L, i) => (pred[i] * L) / norm);
    const pC = [post[0] + post[1] + post[2], post[3] + post[4] + post[5]];
    const pTrue = pC[c];
    pTrueTrace.push(pTrue);
    const guess = pC[1] > pC[0] ? 1 : 0;
    if (guess === c) correct++;
    const conf = Math.max(pC[0], pC[1]);
    const b = Math.min(9, Math.floor(conf * 10));
    calBins[b][0]++; if (guess === c) calBins[b][1]++; calBins[b][2] += conf; confSumAll += conf;
    calTrace.push([+conf.toFixed(4), guess === c ? 1 : 0]);
    if (!grace.has(t) && (1 - pTrue) >= 0.75) fa++;
    const rhoGuess = [post[0] + post[3], post[1] + post[4], post[2] + post[5]];
    let rg = 0; for (let i = 1; i < 3; i++) if (rhoGuess[i] > rhoGuess[rg]) rg = i;
    if (rg === ri) rhoHit++;
    const rhoMean = rhoGuess[0] * U70_RHO[0] + rhoGuess[1] * U70_RHO[1] + rhoGuess[2] * U70_RHO[2];
    rhoMeanAbs += Math.abs(rhoMean - rho);
    if (masked) { maskedN++; if (guess === c) maskedC++; }
    if (!masked && cue !== good) { misN++; if (guess === c) misC++; }
    if (ri === 0) { lowN++; if (guess === c) lowC++; }
    // functional-use demo: posterior-guided action vs cue-following
    const expL = pC[0] * 0.8 + pC[1] * 0.2, expR = pC[0] * 0.2 + pC[1] * 0.8;
    const oAct = expR > expL ? 1 : 0;
    if (oAct === good) oracleActC++;
    if (act === good) cueActC++;
  }
  for (const d of delays) {
    for (let t = d.switch; t < Math.min(U70_T, d.switch + dwell); t++) {
      if (pTrueTrace[t] >= 0.75) { d.delay = t - d.switch; break; }
    }
    if (d.delay === null) d.censored = true;
  }
  // F12: valid ECE = sum_b (n_b/N)|acc_b - conf_b| (empty bins contribute 0). Filed fixed-0.95
  // field removed (same name, different meaning is how the next audit fails); filed ledgers keep
  // their values as measured-as-run with the fixed-reference gloss.
  let eceN = 0, ece = 0, mce = 0;
  const calBinsOut = calBins.map(([n, k, cs]) => {
    if (!n) return [0, 0, 0];
    const acc = k / n, mc = cs / n, d = Math.abs(acc - mc);
    ece += n * d; if (d > mce) mce = d; eceN += n;
    return [n, +acc.toFixed(4), +mc.toFixed(4)];
  });
  return {
    seed, ctxAcc: +(correct / U70_T).toFixed(4),
    ece: eceN ? +(ece / eceN).toFixed(6) : null,
    mce: eceN ? +mce.toFixed(6) : null,
    meanConf: eceN ? +(confSumAll / eceN).toFixed(4) : null,
    calBins: calBinsOut, calTrace,
    detDelays: delays.map((d) => d.delay), censored: delays.filter((d) => d.censored).length,
    faPer100: +((fa / U70_T) * 100).toFixed(3),
    rhoAcc: +(rhoHit / U70_T).toFixed(4), rhoMAE: +(rhoMeanAbs / U70_T).toFixed(4),
    maskedAcc: maskedN ? +(maskedC / maskedN).toFixed(4) : null, maskedN,
    misleadAcc: misN ? +(misC / misN).toFixed(4) : null, misleadN: misN,
    lowRhoAcc: lowN ? +(lowC / lowN).toFixed(4) : null, lowRhoN: lowN,
    oracleActAcc: +(oracleActC / U70_T).toFixed(4), cueActAcc: +(cueActC / U70_T).toFixed(4),
    nSwitches: path.switches.length,
  };
}
// F12 executable tests E1-E3 (oracle side; E4 is neural retention). Pre-recompute HALT gate.
function u70F12OracleTests() {
  const lines = [];
  const validECE = (bins) => { // bins: 10x[n, acc, meanConf]; empty bins contribute 0
    let N = 0, e = 0, m = 0;
    for (const [n, a, c] of bins) { if (!n) continue; const d = Math.abs(a - c); e += n * d; if (d > m) m = d; N += n; }
    return { ece: N ? e / N : null, mce: N ? m : null, N };
  };
  // E1: zero on perfect calibration
  {
    const bins = Array.from({ length: 10 }, (_, i) => (i % 3 === 0 ? [50, 0.75, 0.75] : [0, 0, 0]));
    const { ece, mce } = validECE(bins);
    if (ece !== 0 || mce !== 0) throw new Error("E1 FAIL: perfect calibration must give ECE==0, MCE==0");
    lines.push("E1 zero-on-perfect PASS");
  }
  // E2: fixed-reference detector — all-correct-at-conf-0.6: valid 0.4, OLD formula 0.05
  {
    const bins = Array.from({ length: 10 }, (_, i) => (i === 6 ? [100, 1, 0.6] : [0, 0, 0]));
    const { ece } = validECE(bins);
    if (Math.abs(ece - 0.4) > 1e-12) throw new Error("E2 FAIL: valid ECE should be 0.4");
    const old = Math.abs(1 - 0.95);
    if (Math.abs(old - 0.05) > 1e-12) throw new Error("E2 FAIL: old-formula sanity");
    if (Math.abs(ece - old) < 1e-6) throw new Error("E2 FAIL: new code indistinguishable from old metric");
    lines.push("E2 fixed-reference-detector PASS (valid 0.4 vs old 0.05 — change confirmed)");
  }
  // E3: oracle determinism — two direct runs identical to 4 decimals
  {
    const a = u70RunSeed(3), b = u70RunSeed(3);
    for (const k of ["ctxAcc", "ece", "mce", "meanConf"]) {
      if (a[k] !== b[k]) throw new Error("E3 FAIL: nondeterministic " + k);
    }
    lines.push("E3 oracle-determinism PASS (seed 3 identical)");
  }
  return lines;
}
globalThis.runU70Oracle = async function (fs, log, opts) {
  opts = opts || {};
  if (opts.f12 || opts.f13) { // F12/F13 gate: E1-E3 must pass before any recompute
    let tl;
    try { tl = u70F12OracleTests(); } catch (e) { throw new Error("F12 HALT: " + String((e && e.message) || e)); }
    for (const m of tl) log("[F12-TEST] " + m);
  }
  const unfamP = opts.unfamP || null; // F16: unfamiliar oracle params (same generator params as neural unfamiliar)
  const perSeed = (opts.seeds || U70_SEEDS).map((s) => {
    const r = u70RunSeed(s, unfamP);
    log("u70 s" + s + " ctxAcc=" + r.ctxAcc + " ece=" + r.ece + " mce=" + r.mce + " delays=[" + r.detDelays + "] fa/100=" + r.faPer100 + " rhoAcc=" + r.rhoAcc + " mask=" + r.maskedAcc + " mis=" + r.misleadAcc + " oAct=" + r.oracleActAcc + "/cAct=" + r.cueActAcc);
    return r;
  });
  const M = (f) => +(perSeed.reduce((x, r) => x + f(r), 0) / perSeed.length).toFixed(4);
  const allDelays = perSeed.flatMap((r) => r.detDelays.filter((d) => d !== null)).sort((a, b) => a - b);
  const med = allDelays.length ? allDelays[Math.floor(allDelays.length / 2)] : null;
  const pooled = {
    ctxAcc: M((r) => r.ctxAcc), ece: M((r) => r.ece), mce: M((r) => r.mce), meanConf: M((r) => r.meanConf), detDelayMedian: med,
    detDelayMean: allDelays.length ? +(allDelays.reduce((a, b) => a + b, 0) / allDelays.length).toFixed(2) : null,
    censored: perSeed.reduce((x, r) => x + r.censored, 0),
    faPer100: M((r) => r.faPer100), rhoAcc: M((r) => r.rhoAcc), rhoMAE: M((r) => r.rhoMAE),
    maskedAcc: M((r) => r.maskedAcc), misleadAcc: M((r) => r.misleadAcc), lowRhoAcc: M((r) => r.lowRhoAcc),
    oracleActAcc: M((r) => r.oracleActAcc), cueActAcc: M((r) => r.cueActAcc),
    nSwitchesTotal: perSeed.reduce((x, r) => x + r.nSwitches, 0),
  };
  let driverHash = "n/a";
  try { driverHash = await (0, eval)("u32Sha256Hex")(await fs.readTextFile("src/evidence/u70/u70-oracle.js")); } catch (e) {}
  const body = { spec: (opts.f13 ? "u70-f13-prereg-proposal" : "u70-f12-prereg-proposal"), version: "v1.1", track: "U70-CTX", kind: (opts.f13 ? "f13-heldout-oracle-recompute (valid ECE; seeds 20..39; filed seeds-0..19 values stand as measured-as-run)" : (opts.f12 ? "f12-valid-ece-recompute (valid ECE; filed fixed-0.95 values stand as measured-as-run)" : "identifiability-report (descriptive, no bars, no verdict)")), driverHash, pooled, perSeed };
  await fs.writeTextFile("src/evidence/u70/" + (opts.out || (opts.f13 ? "d-u70-oracle-f13.json" : (opts.f12 ? "d-u70-oracle-f12.json" : "d-u70-oracle-identifiability.json"))), JSON.stringify(body));
  log("u70-oracle COMPLETE ctxAcc=" + pooled.ctxAcc + " ece=" + pooled.ece + " mce=" + pooled.mce + " delayMed=" + pooled.detDelayMedian + " fa/100=" + pooled.faPer100);
  return body;
};
