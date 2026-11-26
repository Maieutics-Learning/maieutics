// newai-selfu55-driver.js — U55-DET1 detector measurement (frozen U33 canon, read-only).
//
// NOTHING TRAINS. Trunk = U33 canon s0-2 byte-exact (PIN 258d2f06…). 2x2 diet
// cells (CLEAN/NOISY x STAT/ROT), 20 probe streams per cell per trunk
// (3x4x20 = 240 probes, N=400 rows each). Detectors D-cue (per-slot EMA gap)
// + D-switch (trailing-50-minus-200 spikes at jittered quarter boundaries).
// v1.4 diet remap (Wave-0 HALT fix): hot pairs in {0..3}, noisy slots {2,3}, dcue 2-vs-2, Guard' 0.85.
// Driver-spec pins (filed pre-compute, within prereg tolerance): D-switch
// response = mean of the 3 boundary spikes; STAT matched positions reuse the
// trunk's ROT boundary schedule; OLS residuals per N1; gating order per N4.
//
// RUN (execute_js, fs in scope; ONLY under fresh countersign — probes are compute):
//   const src = await fs.readTextFile("src/evidence/decomp/newai-selfu55-driver.js");
//   (0, eval)(src + "\n//# sourceURL=newai-selfu55-driver.js");
//   await globalThis.SelfU55Init(fs);
//   await globalThis.runU55Wave0(fs, log);      // load-check + twins + dry-run 12 probes
//   await globalThis.runU55Probes(fs, log);     // 12 ledgers (20 streams each)
//   await globalThis.runU55Verdict(fs, log);    // bars + verdict
globalThis.SelfU55Init = async function (fs) {
  const src = await fs.readTextFile("src/evidence/decomp/newai-selfu53-driver.js");
  (0, eval)(src + "\n//# sourceURL=newai-selfu53-driver.js");
  await globalThis.SelfU53Init(fs);
  for (const f of ["u32FreshStack", "u32SnapshotParams", "u32MaxAbsDiff", "u33StackHash",
    "u32Sha256Hex", "IntrinsicInit", "inSeqMakeModel", "inSeqForward", "inMeanLogits",
    "inSeqGenShift", "u38TrainOneStep"]) {
    if (typeof globalThis[f] !== "function" && typeof globalThis[f] !== "object")
      throw new Error("U55 stack load failed: missing " + f);
  }
};
const U55_EXPECT_STACK = "258d2f060684ce382778e203959ab791abb5df79af174deef19ff568886d4d6e";
const U55_N = 400, U55_BURN = 50, U55_STREAMS = 20;
const U55_CELLS = ["clean-stat", "noisy-stat", "clean-rot", "noisy-rot"];
const U55_HOT = [[0, 1], [2, 3], [0, 1], [2, 3]]; // v1.4: in-substrate alternation (qk domain {0,1,2,3} only)
function u55ProbePath(trunk, cell) { return "src/evidence/decomp/d-newai-self-u55-probes-t" + trunk + "-c" + cell + ".json"; }
const U55_VERDICT_PATH = "src/evidence/decomp/d-newai-self-u55-verdict.json";
const U55_WAVE0_PATH = "src/evidence/decomp/d-newai-self-u55-wave0.json";
function u55CanonPath(seed) { return "src/evidence/decomp/d-newai-self-u33-canon-s" + seed + "-800st.json"; }
function u55Argmax4(a) { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; }
// Boundaries (N2): 100+-U{0..20} via filed stream; shared across cells of a trunk.
function u55Boundaries(G, trunk) {
  const brng = G.makeRng(61000 + trunk);
  const j = () => brng.int(41) - 20;
  return [100 + j(), 200 + j(), 300 + j()];
}
function u55Quarter(b, r) { return r > b[2] ? 3 : r > b[1] ? 2 : r > b[0] ? 1 : 0; }
// One probe row for (cell, quarter): hot-set mixture (M5) + NOISY relabel (M4).
function u55Row(rng, noisy, hotPair) {
  let e;
  if (rng.int(10) < 7) { // 0.7 mass on hot pair: rejection-sample qk
    let tries = 0;
    do { e = inSeqGenShift(rng, null); tries++; } while (e.qk !== hotPair[0] && e.qk !== hotPair[1] && tries < 50);
  } else {
    e = inSeqGenShift(rng, null);
  }
  if (noisy && (e.qk === 2 || e.qk === 3) && rng.int(2) === 0) e.y = rng.int(4); // v1.4 M4': noisy slots {2,3}
  return e;
}
// Full probe stream -> {meanErr, dcue, spikes[3], perBoundary detail}.
function u55RunStream(M, evalMasks, rng, cell) {
  const noisy = cell.indexOf("noisy") === 0, rot = cell.indexOf("rot") > 0;
  const G = { makeRng: null };
  const b = u55RunStream._b;
  const errs = new Array(U55_N), e = new Array(8).fill(0);
  for (let r = 0; r < U55_N; r++) {
    const q = rot ? u55Quarter(b, r) : 0;
    const row = u55Row(rng, noisy, rot ? U55_HOT[q] : U55_HOT[0]);
    const fw1 = inSeqForward(M, row.x, new Float64Array(8), evalMasks);
    const vhat = u55Argmax4(fw1.hvLog);
    const x2m = [9, 9, 9, 9, 9, 9, row.qk, row.k, vhat, 8];
    const fw2 = inSeqForward(M, x2m, fw1.cNew, evalMasks);
    const err = u55Argmax4(inMeanLogits({ logitsK: fw2.logitsK })) !== row.y ? 1 : 0;
    errs[r] = err;
    if (r >= U55_BURN) e[row.qk] = 0.9 * e[row.qk] + 0.1 * err;
  }
  let s = 0; for (let r = U55_BURN; r < U55_N; r++) s += errs[r];
  const meanErr = s / (U55_N - U55_BURN);
  const dcue = (e[2] + e[3]) / 2 - (e[0] + e[1]) / 2; // v1.4 O2': 2-vs-2, slots 4-7 excluded (never visited)
  // D-switch (N2+N3): sliding trail means reset at filed boundaries; baseline
  // = pre-boundary 25 rows; evaluation rows b+51..b+75 (first valid 25-window).
  const qstart = (r) => { let s0 = 0; for (const bb of b) if (r > bb) s0 = bb + 1; return s0; };
  const tmean = (r, W) => {
    const s0 = qstart(r); const a = Math.max(s0, r - W + 1); let t = 0;
    for (let i = a; i <= r; i++) t += errs[i]; return t / (r - a + 1);
  };
  const sval = (r) => tmean(r, 50) - tmean(r, 200);
  const spikes = b.map((bb) => {
    let mx = -Infinity;
    for (let r = bb + 51; r <= bb + 75 && r < U55_N; r++) { const v = sval(r); if (v > mx) mx = v; }
    let bl = 0; for (let r = bb - 25; r <= bb - 1; r++) bl += sval(r); bl /= 25;
    return mx - bl;
  });
  return { meanErr, dcue, spikes };
}
globalThis.runU55Wave0 = async function (fs, log) {
  try { const prev = JSON.parse(await fs.readTextFile(U55_WAVE0_PATH)); if (prev && prev.verdict === "COMPLETE") { log(U55_WAVE0_PATH + " exists, skip"); return prev; } } catch (e) {}
  const h = await globalThis.u33StackHash(fs);
  if (h.hex !== U55_EXPECT_STACK) throw new Error("U55-PIN HALT: stack drift " + h.hex.slice(0, 16));
  const G = await globalThis.IntrinsicInit(fs);
  log("u55-wave0 stack PIN ok");
  // stream reproducibility: same stream twice -> identical rows
  for (const seed of [0, 1]) {
    const r1 = G.makeRng(62000 + seed), r2 = G.makeRng(62000 + seed);
    const a = inSeqGenShift(r1, null), c = inSeqGenShift(r2, null);
    if (JSON.stringify(a) !== JSON.stringify(c)) throw new Error("U55 Wave-0 HALT: probe stream not reproducible");
  }
  log("u55-wave0 probe-stream reproducible");
  // v1.4 Guard': reachability assert + hot-fraction expect 0.85 (0.7*1.0+0.3*0.5 in-domain).
  for (const hp of U55_HOT) for (const qq of hp) if (qq < 0 || qq > 3) throw new Error("U55 Wave-0 HALT: hot pair outside qk domain " + JSON.stringify(hp));
  {
    const rng = G.makeRng(777001); let n = 0;
    for (let i = 0; i < 2000; i++) { const e = u55Row(rng, false, [0, 1]); if (e.qk === 0 || e.qk === 1) n++; }
    const f = n / 2000; log("u55-wave0 hot-fraction=" + f.toFixed(3) + " (v1.4 expect ~0.85)");
    if (Math.abs(f - 0.85) > 0.05) throw new Error("U55 Wave-0 HALT: hot mixture off (v1.4 expect 0.85)");
  }
  // canon params parse + dry-run: 1 stream per cell per trunk (crash-test only;
  // values filed, thresholds NOT retuned).
  const dry = [];
  for (const trunk of [0, 1, 2]) {
    const canon = JSON.parse(await fs.readTextFile(u55CanonPath(trunk)));
    const M = inSeqMakeModel(G.makeRng(1));
    const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
    load(M.E, canon.P.E); load(M.W1, canon.P.W1); load(M.b1, canon.P.b1);
    load(M.Wf, canon.P.Wf); load(M.bf, canon.P.bf); load(M.Wc, canon.P.Wc); load(M.bc, canon.P.bc);
    for (let k = 0; k < 5; k++) { load(M.Wh[k], canon.P.Wh[k]); load(M.bh[k], canon.P.bh[k]); }
    load(M.Hv, canon.P.Hv); load(M.bv, canon.P.bv);
    const fr = G.makeRng(91000 + trunk); const evalMasks = [];
    for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr.int(10) < 5 ? 2 : 0; evalMasks.push(m); }
    const b = u55Boundaries(G, trunk);
    for (const cell of U55_CELLS) {
      const rng = G.makeRng(62000 + trunk * 1000 + U55_CELLS.indexOf(cell) * 100);
      u55RunStream._b = b;
      const r = u55RunStream(M, evalMasks, rng, cell);
      dry.push({ trunk, cell, meanErr: +r.meanErr.toFixed(4), dcue: +r.dcue.toFixed(4), spikes: r.spikes.map((v) => +v.toFixed(4)) });
    }
  }
  log("u55-wave0 dry-run 12 streams ok (values filed, thresholds untouched)");
  const body = { spec: "self-u55-det1-prereg", track: "U55-DET1", wave: 0, verdict: "COMPLETE", stackHash: h.hex, dryRun: dry };
  await fs.writeTextFile(U55_WAVE0_PATH, JSON.stringify(body));
  return body;
};
globalThis.runU55Probes = async function (fs, log) {
  const h = await globalThis.u33StackHash(fs);
  if (h.hex !== U55_EXPECT_STACK) throw new Error("U55-PIN HALT: stack drift");
  const G = await globalThis.IntrinsicInit(fs);
  for (const trunk of [0, 1, 2]) {
    const canon = JSON.parse(await fs.readTextFile(u55CanonPath(trunk)));
    const M = inSeqMakeModel(G.makeRng(1));
    const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
    load(M.E, canon.P.E); load(M.W1, canon.P.W1); load(M.b1, canon.P.b1);
    load(M.Wf, canon.P.Wf); load(M.bf, canon.P.bf); load(M.Wc, canon.P.Wc); load(M.bc, canon.P.bc);
    for (let k = 0; k < 5; k++) { load(M.Wh[k], canon.P.Wh[k]); load(M.bh[k], canon.P.bh[k]); }
    load(M.Hv, canon.P.Hv); load(M.bv, canon.P.bv);
    const fr = G.makeRng(91000 + trunk); const evalMasks = [];
    for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr.int(10) < 5 ? 2 : 0; evalMasks.push(m); }
    const b = u55Boundaries(G, trunk);
    for (const cell of U55_CELLS) {
      const path = u55ProbePath(trunk, cell);
      try { const prev = JSON.parse(await fs.readTextFile(path)); if (prev && prev.verdict === "COMPLETE") { log(path + " exists, skip"); continue; } } catch (e) {}
      const streams = [];
      for (let s = 0; s < U55_STREAMS; s++) {
        const rng = G.makeRng(62000 + trunk * 1000 + U55_CELLS.indexOf(cell) * 100 + s);
        u55RunStream._b = b;
        const r = u55RunStream(M, evalMasks, rng, cell);
        streams.push({ s, meanErr: +r.meanErr.toFixed(5), dcue: +r.dcue.toFixed(5), spikes: r.spikes.map((v) => +v.toFixed(5)) });
      }
      await fs.writeTextFile(path, JSON.stringify({ spec: "self-u55-det1-prereg", track: "U55-DET1", trunk, cell, verdict: "COMPLETE", stackHash: h.hex, boundaries: b, n: U55_N, streams }));
      log("u55-probes t" + trunk + " " + cell + " COMPLETE (20 streams)");
    }
  }
  return "ALL-PROBES-COMPLETE";
};
// OLS (N1): single covariate, per trunk. Returns {slope, itc, resid[], singular}.
function u55OLS(x, y) {
  const n = x.length; let mx = 0, my = 0;
  for (let i = 0; i < n; i++) { mx += x[i]; my += y[i]; } mx /= n; my /= n;
  let sxx = 0, sxy = 0;
  for (let i = 0; i < n; i++) { sxx += (x[i] - mx) * (x[i] - mx); sxy += (x[i] - mx) * (y[i] - my); }
  if (sxx === 0) return { singular: true, resid: y.slice() };
  const slope = sxy / sxx, itc = my - slope * mx;
  return { singular: false, slope, itc, resid: y.map((v, i) => v - (slope * x[i] + itc)) };
}
function u55Mean(a) { let s = 0; for (const v of a) s += v; return s / a.length; }
function u55SD(a) { const m = u55Mean(a); let s = 0; for (const v of a) s += (v - m) * (v - m); return Math.sqrt(s / (a.length - 1)); }
function u55Corr(a, b) {
  const n = a.length, ma = u55Mean(a), mb = u55Mean(b);
  let sxy = 0, sxx = 0, syy = 0;
  for (let i = 0; i < n; i++) { sxy += (a[i] - ma) * (b[i] - mb); sxx += (a[i] - ma) * (a[i] - ma); syy += (b[i] - mb) * (b[i] - mb); }
  return sxx === 0 || syy === 0 ? 0 : sxy / Math.sqrt(sxx * syy);
}
globalThis.runU55Verdict = async function (fs, log) {
  const perTrunk = [];
  for (const trunk of [0, 1, 2]) {
    const L = {};
    for (const cell of U55_CELLS) L[cell] = JSON.parse(await fs.readTextFile(u55ProbePath(trunk, cell)));
    const pin = U55_CELLS.every((c) => L[c].stackHash === U55_EXPECT_STACK);
    // per-stream vectors (80): dcue values, switch values (mean of 3 spikes), meanErr
    const vec = { dcue: [], dsw: [], merr: [], cellOf: [] };
    for (const cell of U55_CELLS) for (const st of L[cell].streams) {
      vec.dcue.push(st.dcue); vec.dsw.push(u55Mean(st.spikes)); vec.merr.push(st.meanErr); vec.cellOf.push(cell);
    }
    const idx = (pred) => vec.cellOf.map((c, i) => (pred(c) ? i : -1)).filter((i) => i >= 0);
    const at = (arr, ii) => ii.map((i) => arr[i]);
    const gap = (arr, regime) => u55Mean(at(arr, idx((c) => c === "noisy-" + regime))) - u55Mean(at(arr, idx((c) => c === "clean-" + regime)));
    const spike = (arr, regime) => u55Mean(at(arr, idx((c) => c.indexOf(regime) >= 0)));
    // raw margins
    const gS = gap(vec.dcue, "stat"), gR = gap(vec.dcue, "rot");
    const cross = Math.abs(gR - gS);
    const sR = spike(vec.dsw, "rot"), sS = spike(vec.dsw, "stat");
    // N1 residuals
    const rC = u55OLS(vec.merr, vec.dcue), rS = u55OLS(vec.merr, vec.dsw);
    const nosread = rC.singular || rS.singular;
    const dc = nosread ? vec.dcue : rC.resid, ds = nosread ? vec.dsw : rS.resid;
    const F = nosread ? 2 : 1; // NOSREAD doubles thresholds (O3), cross unchanged
    const gS2 = gap(dc, "stat"), gR2 = gap(dc, "rot"), cross2 = Math.abs(gR2 - gS2);
    const sR2 = spike(ds, "rot"), sS2 = spike(ds, "stat");
    const r = u55Corr(vec.dcue, vec.dsw);
    // N4 gating: NONDEGEN -> DISSOCIATE (O1: 5 subs, need 4/5) -> INDEPEND
    const se = (arr, regime, cell) => u55SD(at(arr, idx((c) => c === cell + "-" + regime))) / Math.sqrt(U55_STREAMS);
    const nondegen = gR2 > 0.05 * F && gS2 > 0.05 * F && sR2 > 0.05 * F;
    const subs = [
      { name: "gap_STAT", pass: gS2 >= 0.15 * F, se: 2 * se(dc, "stat", "noisy") + 2 * se(dc, "stat", "clean"), margin: 0.15 * F },
      { name: "gap_ROT", pass: gR2 >= 0.15 * F, se: 2 * se(dc, "rot", "noisy") + 2 * se(dc, "rot", "clean"), margin: 0.15 * F },
      { name: "cross", pass: cross2 <= 0.05, se: 0, margin: 0.05 },
      { name: "spike_ROT", pass: sR2 >= 0.10 * F, se: 0, margin: 0.10 * F },
      { name: "spike_STAT", pass: sS2 <= 0.05, se: 0, margin: 0.05 },
    ];
    const disN = subs.filter((s) => s.pass).length;
    const dissociate = nondegen && disN >= 4;
    const independ = dissociate && Math.abs(r) < 0.7;
    // N5: UNDERPOWERED — 2SE of any deciding statistic exceeds its margin
    const uw = subs.filter((s) => s.se > s.margin).length;
    const underpowered = uw > 0;
    perTrunk.push({ trunk, pin, nosread, gaps: { gS: +gS2.toFixed(4), gR: +gR2.toFixed(4), cross: +cross2.toFixed(4) }, spikes: { rot: +sR2.toFixed(4), stat: +sS2.toFixed(4) }, r: +r.toFixed(4), nondegen, subs: subs.map((s) => s.name + "=" + (s.pass ? "1" : "0")), disN, dissociate, independ, underpowered });
    log("u55-verdict t" + trunk + " PIN=" + (pin ? "ok" : "FAIL") + " gaps=" + gS2.toFixed(3) + "/" + gR2.toFixed(3) + " cross=" + cross2.toFixed(3) + " spikes=" + sR2.toFixed(3) + "/" + sS2.toFixed(3) + " r=" + r.toFixed(3) + (nosread ? " NOSREAD" : "") + (underpowered ? " UNDERPOWERED" : ""));
  }
  const q = (f) => perTrunk.filter(f).length;
  const pinN = q((s) => s.pin), ndN = q((s) => s.nondegen);
  const disN = q((s) => s.dissociate), indN = q((s) => s.independ), uwN = q((s) => s.underpowered);
  let verdict, cause;
  if (pinN < 3) { verdict = "PIN-FAIL"; cause = "pin"; }
  else if (uwN >= 2) { verdict = "UNDERPOWERED"; cause = "precision (2SE>margin on 2+ trunks)"; }
  else if (ndN < 2) { verdict = "DET-COLLAPSED"; cause = "nondegeneracy"; }
  else if (disN < 2) { verdict = "DET-ENTANGLED"; cause = "dissociation (need 4/5 at quorum)"; }
  else if (indN < 2) { verdict = "DET-ENTANGLED"; cause = "independence (|r|>=0.7)"; }
  else { verdict = "DET-HEALTHY"; cause = "clean"; }
  const body = { spec: "self-u55-det1-prereg", track: "U55-DET1", verdict, cause, bars: { "DET-PIN": pinN + "/3", "DET-NONDEGEN": ndN + "/3", "DET-DISSOCIATE": disN + "/3", "DET-INDEPEND": indN + "/3", "DET-POWER": (3 - uwN) + "/3 (non-underpowered)" }, perTrunk };
  await fs.writeTextFile(U55_VERDICT_PATH, JSON.stringify(body));
  log("u55-verdict " + verdict + " cause=" + cause);
  return body;
};
