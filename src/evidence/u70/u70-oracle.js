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
const U70_PSW = 0.02, U70_DWELL = 25, U70_PRHO = 0.03, U70_EPS = 0.10;
const U70_RHO = [0.55, 0.75, 0.95];
const U70_PATH_BASE = 70000, U70_OBS_BASE = 72000;
function u70GenPath(seed) {
  const rng = u70Mulberry32(U70_PATH_BASE + seed);
  const ctx = new Array(U70_T), rho = new Array(U70_T), switches = [];
  let c = rng() < 0.5 ? 0 : 1, r = Math.floor(rng() * 3), lastSw = -100;
  for (let t = 0; t < U70_T; t++) {
    if (t > 0 && rng() < U70_PSW && t - lastSw >= U70_DWELL) { c = 1 - c; lastSw = t; switches.push(t); }
    else if (t > 0 && rng() < U70_PSW) { /* dwell-blocked: stays */ }
    if (t > 0 && rng() < U70_PRHO) { let n = Math.floor(rng() * 2); r = (r + 1 + n) % 3; }
    ctx[t] = c; rho[t] = r;
  }
  return { ctx, rho, switches };
}
function u70RunSeed(seed) {
  const path = u70GenPath(seed);
  const rng = u70Mulberry32(U70_OBS_BASE + seed);
  // posterior over 6 states [c*3+r]; uniform prior
  let post = [1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6];
  const goodArm = (c) => (c === 0 ? 0 : 1); // 0=L,1=R
  let correct = 0, calBins = Array.from({ length: 10 }, () => [0, 0]);
  let fa = 0, rhoHit = 0, rhoAbs = 0, rhoMeanAbs = 0;
  let maskedN = 0, maskedC = 0, misN = 0, misC = 0, lowN = 0, lowC = 0;
  let oracleActC = 0, cueActC = 0;
  const grace = new Set();
  for (const s of path.switches) for (let t = s; t < Math.min(U70_T, s + 10); t++) grace.add(t);
  const delays = [];
  for (const s of path.switches) {
    let d = null;
    for (let t = s; t < Math.min(U70_T, s + U70_DWELL); t++) { /* filled below via posteriors */ }
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
        const pc = nc === cc ? 1 - U70_PSW : U70_PSW;
        for (let nr = 0; nr < 3; nr++) {
          const pr = nr === rr ? 1 - U70_PRHO : U70_PRHO / 2;
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
    calBins[b][0]++; if (guess === c) calBins[b][1]++;
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
    for (let t = d.switch; t < Math.min(U70_T, d.switch + U70_DWELL); t++) {
      if (pTrueTrace[t] >= 0.75) { d.delay = t - d.switch; break; }
    }
    if (d.delay === null) d.censored = true;
  }
  let eceN = 0, ece = 0;
  for (const [n, k] of calBins) if (n > 0) { ece += n * Math.abs(k / n - 1 + 0.05); eceN += n; }
  return {
    seed, ctxAcc: +(correct / U70_T).toFixed(4),
    ece: eceN ? +(ece / eceN).toFixed(4) : null,
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
globalThis.runU70Oracle = async function (fs, log) {
  const perSeed = U70_SEEDS.map((s) => {
    const r = u70RunSeed(s);
    log("u70 s" + s + " ctxAcc=" + r.ctxAcc + " ece=" + r.ece + " delays=[" + r.detDelays + "] fa/100=" + r.faPer100 + " rhoAcc=" + r.rhoAcc + " mask=" + r.maskedAcc + " mis=" + r.misleadAcc + " oAct=" + r.oracleActAcc + "/cAct=" + r.cueActAcc);
    return r;
  });
  const M = (f) => +(perSeed.reduce((x, r) => x + f(r), 0) / perSeed.length).toFixed(4);
  const allDelays = perSeed.flatMap((r) => r.detDelays.filter((d) => d !== null)).sort((a, b) => a - b);
  const med = allDelays.length ? allDelays[Math.floor(allDelays.length / 2)] : null;
  const pooled = {
    ctxAcc: M((r) => r.ctxAcc), ece: M((r) => r.ece), detDelayMedian: med,
    detDelayMean: allDelays.length ? +(allDelays.reduce((a, b) => a + b, 0) / allDelays.length).toFixed(2) : null,
    censored: perSeed.reduce((x, r) => x + r.censored, 0),
    faPer100: M((r) => r.faPer100), rhoAcc: M((r) => r.rhoAcc), rhoMAE: M((r) => r.rhoMAE),
    maskedAcc: M((r) => r.maskedAcc), misleadAcc: M((r) => r.misleadAcc), lowRhoAcc: M((r) => r.lowRhoAcc),
    oracleActAcc: M((r) => r.oracleActAcc), cueActAcc: M((r) => r.cueActAcc),
    nSwitchesTotal: perSeed.reduce((x, r) => x + r.nSwitches, 0),
  };
  let driverHash = "n/a";
  try { driverHash = await (0, eval)("u32Sha256Hex")(await fs.readTextFile("src/evidence/u70/u70-oracle.js")); } catch (e) {}
  const body = { spec: "u70-task-spec", version: "v1.0", track: "U70-CTX", kind: "identifiability-report (descriptive, no bars, no verdict)", driverHash, pooled, perSeed };
  await fs.writeTextFile("src/evidence/u70/d-u70-oracle-identifiability.json", JSON.stringify(body));
  log("u70-oracle COMPLETE ctxAcc=" + pooled.ctxAcc + " delayMed=" + pooled.detDelayMedian + " fa/100=" + pooled.faPer100);
  return body;
};
