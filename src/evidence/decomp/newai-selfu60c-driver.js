// newai-selfu60c-driver.js — U60c-TRACE slow surprise-trace (different whiteboard, reads-only).
//
// Zero new trains. Frozen forward passes on 20 filed U60 regime trunks + 20 filed canon trunks.
// Wraps the filed U60 driver (sampler, boundaries, masks, loaders) verbatim.
//
// Prereg: src/evidence/decomp/self-u60c-trace-prereg.md v1.0 (STANDS, 10x battery).
// Cover: user 2026-11-26 full-pipeline "write up then compute U60c" + per-wave 10x reviews.
// NO PUSH without order.
//
// Driver-spec D-pins (filed at build, zero data):
//  D1 surprise: d = curVoteDisagree(fw2.logitsK) (round-2, context-informed), scalar >= 0.
//  D2 trace: z_0 = 0; z_r = (1-α)z_{r-1} + α d_r, α = 0.02 filed (horizon ~50 rows).
//  D3 QV-Z: variance across the 4 quarter-means of z on clean-rot streams (scalar variance).
//  D4 ZB-resp: mirror of B'': base = mean over 4 quarters of |z[mid+10]-z[mid-10]|;
//    bspikes = |z[bb+10]-z[bb-10]| - base per boundary; ZB-resp = mean of 3.
//  D5 STAT control: clean-stat streams (single hot pair, no quarters) get ZB-resp with the
//    trunk's ROT boundary schedule (same matched-position logic as B'' STAT); reported only.
//  D6 streams: 80 clean-rot + 80 clean-stat per trunk for BOTH regime and canon (symmetric;
//    canon band same operator, same N).
//
// RUN (execute_js, fs in scope; ONLY under fresh countersign):
//   const src = await fs.readTextFile("src/evidence/decomp/newai-selfu60c-driver.js");
//   (0, eval)(src + "\n//# sourceURL=newai-selfu60c-driver.js");
//   await globalThis.SelfU60cInit(fs);
//   await globalThis.runU60cWave0(fs, log);
//   await globalThis.runU60cTrace(fs, log);
globalThis.SelfU60cInit = async function (fs) {
  const u60src = await fs.readTextFile("src/evidence/decomp/newai-selfu60-driver.js");
  (0, eval)(u60src + "\n//# sourceURL=newai-selfu60-driver.js");
  await globalThis.SelfU60Init(fs);
  if (typeof curVoteDisagree !== "function") throw new Error("U60c stack load failed: missing curVoteDisagree");
};
const U60C_EXPECT_STACK = "258d2f060684ce382778e203959ab791abb5df79af174deef19ff568886d4d6e";
const U60C_ALPHA = 0.02;
const U60C_STREAMS = 80;
function u60cRegimePath(seed) { return "src/evidence/decomp/d-newai-self-u60-regime-s" + seed + "-800st.json"; }
function u60cCanonPath(seed) { return "src/evidence/decomp/d-newai-self-u33-canon-s" + seed + "-800st.json"; }
const U60C_WAVE0_PATH = "src/evidence/decomp/d-newai-self-u60c-wave0.json";
const U60C_VERDICT_PATH = "src/evidence/decomp/d-newai-self-u60c-verdict.json";
// One trace stream: returns {z[400], qvZ, zbResp} for clean-rot, or {zbResp} for clean-stat.
function u60cTraceStream(M, evalMasks, rng, b, cell) {
  const N = 400;
  const rot = cell === "clean-rot";
  const z = new Array(N);
  let run = 0;
  for (let r = 0; r < N; r++) {
    const q = rot ? u60Quarter(b, r) : 0;
    const row = u58Row(rng, false, [[0, 1], [2, 3], [0, 1], [2, 3]][q]);
    const fw1 = inSeqForward(M, row.x, new Float64Array(8), evalMasks);
    const vhat = u58Argmax4(fw1.hvLog);
    const x2m = [9, 9, 9, 9, 9, 9, row.qk, row.k, vhat, 8];
    const fw2 = inSeqForward(M, x2m, fw1.cNew, evalMasks);
    const d = curVoteDisagree(fw2.logitsK);
    run = (1 - U60C_ALPHA) * run + U60C_ALPHA * d;
    z[r] = run;
  }
  const az = (i) => Math.abs(z[Math.min(N - 1, Math.max(0, i))]);
  const qs = rot ? [[0, b[0]], [b[0] + 1, b[1]], [b[1] + 1, b[2]], [b[2] + 1, N - 1]]
    : [[0, N - 1], [0, N - 1], [0, N - 1], [0, N - 1]];
  const qm = qs.map(([lo, hi]) => { let s = 0; for (let r = lo; r <= hi; r++) s += z[r]; return s / (hi - lo + 1); });
  const qvZ = rot ? ((qm[0] + qm[1] + qm[2] + qm[3]) / 4, (() => { const m = (qm[0] + qm[1] + qm[2] + qm[3]) / 4; return ((qm[0] - m) ** 2 + (qm[1] - m) ** 2 + (qm[2] - m) ** 2 + (qm[3] - m) ** 2) / 4; })()) : 0;
  const mids = rot ? qs.map(([lo, hi]) => Math.floor((lo + hi) / 2)) : [100, 200, 300, 100];
  const base = rot ? (Math.abs(z[Math.min(N-11,mids[0]+10)] - z[Math.max(0,mids[0]-10)]) + Math.abs(z[Math.min(N-11,mids[1]+10)] - z[Math.max(0,mids[1]-10)]) + Math.abs(z[Math.min(N-11,mids[2]+10)] - z[Math.max(0,mids[2]-10)]) + Math.abs(z[Math.min(N-11,mids[3]+10)] - z[Math.max(0,mids[3]-10)])) / 4 : 0;
  const spikes = b.map((bb) => Math.abs(z[Math.min(N - 1, bb + 10)] - z[Math.max(0, bb - 10)]) - base);
  const zbResp = (spikes[0] + spikes[1] + spikes[2]) / 3;
  return { qvZ, zbResp, spikes };
}
globalThis.runU60cWave0 = async function (fs, log) {
  try { const prev = JSON.parse(await fs.readTextFile(U60C_WAVE0_PATH)); if (prev && prev.verdict === "COMPLETE") { log(U60C_WAVE0_PATH + " exists, skip"); return prev; } } catch (e) {}
  const h = await globalThis.u33StackHash(fs);
  if (h.hex !== U60C_EXPECT_STACK) throw new Error("U60c-PIN HALT: stack drift " + h.hex.slice(0, 16));
  const G = await globalThis.IntrinsicInit(fs);
  log("u60c-wave0 stack PIN ok");
  // twin determinism: same trace twice -> identical.
  {
    const canon = JSON.parse(await fs.readTextFile(u60cCanonPath(0)));
    const M = inSeqMakeModel(G.makeRng(1));
    u60LoadRegime(M, canon);
    const evalMasks = u60EvalMasks(G, 0);
    const b = u58Boundaries(G, 0);
    const r1 = G.makeRng(62000), r2 = G.makeRng(62000);
    const a = u60cTraceStream(M, evalMasks, r1, b, "clean-rot");
    const c = u60cTraceStream(M, evalMasks, r2, b, "clean-rot");
    if (JSON.stringify(a) !== JSON.stringify(c)) throw new Error("U60c Wave-0 HALT: trace not reproducible");
  }
  log("u60c-wave0 trace reproducible");
  // canon band: QV-Z per canon trunk (80 clean-rot streams, same operator).
  const canonQV = [];
  for (let trunk = 0; trunk < 20; trunk++) {
    const canon = JSON.parse(await fs.readTextFile(u60cCanonPath(trunk)));
    const M = inSeqMakeModel(G.makeRng(1));
    u60LoadRegime(M, canon);
    const evalMasks = u60EvalMasks(G, trunk);
    const b = u58Boundaries(G, trunk);
    let s = 0;
    for (let st = 0; st < U60C_STREAMS; st++) {
      const rng = G.makeRng(62000 + trunk * 1000 + 200 + st);
      s += u60cTraceStream(M, evalMasks, rng, b, "clean-rot").qvZ;
    }
    canonQV.push({ trunk, qvZ: +(s / U60C_STREAMS).toFixed(6) });
  }
  const vals = canonQV.map((x) => x.qvZ);
  const cmax = Math.max(...vals), cmean = vals.reduce((a, x) => a + x, 0) / vals.length;
  log("u60c-wave0 canon QV-Z band: mean=" + cmean.toFixed(6) + " max=" + cmax.toFixed(6));
  const body = { spec: "self-u60c-trace-prereg", track: "U60c-TRACE", wave: 0, verdict: "COMPLETE", stackHash: h.hex, alpha: U60C_ALPHA, canonQV, canonBand: { mean: +cmean.toFixed(6), max: +cmax.toFixed(6) } };
  await fs.writeTextFile(U60C_WAVE0_PATH, JSON.stringify(body));
  return body;
};
globalThis.runU60cTrace = async function (fs, log) {
  const w0 = JSON.parse(await fs.readTextFile(U60C_WAVE0_PATH));
  const cmax = w0.canonBand.max;
  const G = await globalThis.IntrinsicInit(fs);
  const perTrunk = [];
  for (let trunk = 0; trunk < 20; trunk++) {
    const led = JSON.parse(await fs.readTextFile(u60cRegimePath(trunk)));
    if (led.stackHash !== U60C_EXPECT_STACK) throw new Error("U60c PIN-FAIL: regime trunk " + trunk);
    const M = inSeqMakeModel(G.makeRng(1));
    u60LoadRegime(M, led);
    const evalMasks = u60EvalMasks(G, trunk);
    const b = u58Boundaries(G, trunk);
    let qvS = 0; const zbR = [], zbS = [];
    for (let st = 0; st < U60C_STREAMS; st++) {
      const rngR = G.makeRng(62000 + trunk * 1000 + 200 + st);
      const rr = u60cTraceStream(M, evalMasks, rngR, b, "clean-rot");
      qvS += rr.qvZ; zbR.push(rr.zbResp);
      const rngS = G.makeRng(62000 + trunk * 1000 + 0 + st);
      zbS.push(u60cTraceStream(M, evalMasks, rngS, b, "clean-stat").zbResp);
    }
    const qvZ = qvS / U60C_STREAMS;
    const mR = zbR.reduce((a, x) => a + x, 0) / zbR.length;
    const seR = Math.sqrt(zbR.map((x) => (x - mR) ** 2).reduce((a, x) => a + x, 0) / (zbR.length - 1)) / Math.sqrt(zbR.length);
    const mS = zbS.reduce((a, x) => a + x, 0) / zbS.length;
    perTrunk.push({ trunk, qvZ: +qvZ.toFixed(6), guardPass: qvZ > cmax, zbROT: +mR.toFixed(6), zbROTse: +seR.toFixed(6), zbSTAT: +mS.toFixed(6), spikePass: mR - 2 * seR > 0, powerFlag: 2 * seR > 0.25 });
    const p = perTrunk[trunk];
    log("u60c t" + trunk + " qvZ=" + p.qvZ.toFixed(6) + (p.guardPass ? " PASS" : " fail") + " zbROT=" + p.zbROT.toFixed(5) + "±" + (2 * seR).toFixed(5) + (p.spikePass ? " SPIKE" : "") + " zbSTAT=" + p.zbSTAT.toFixed(5));
  }
  const q = (f) => perTrunk.filter((s) => f(s)).length;
  const guardN = q((s) => s.guardPass), spikeN = q((s) => s.spikePass);
  const powN = q((s) => s.powerFlag);
  let verdict, cause;
  if (guardN < 15) { verdict = "Z-ABSENT"; cause = "slow trace finds nothing (" + guardN + "/20 above canon max)"; }
  else if (spikeN < 15) { verdict = "Z-PARTIAL"; cause = "difficulty differs by quarter but no switch snap (" + spikeN + "/20)"; }
  else { verdict = "Z-MARKS"; cause = "slow channel marks regime (guard + spike at quorum)"; }
  const body = { spec: "self-u60c-trace-prereg", track: "U60c-TRACE", verdict, cause, alpha: U60C_ALPHA, canonBand: w0.canonBand, bars: { "Z-PIN": "20/20", "Z-GUARD": guardN + "/20", "Z-SPIKE": spikeN + "/20", "Z-POWER-DIAG": powN + "/20 trunks 2SE>0.25 (report only, no trip)" }, perTrunk };
  await fs.writeTextFile(U60C_VERDICT_PATH, JSON.stringify(body));
  log("u60c-verdict " + verdict + " cause=" + cause);
  return body;
};
