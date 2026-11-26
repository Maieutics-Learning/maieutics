// newai-selfu58-driver.js — U58-DET2 detector measurement (frozen U33 canon, read-only).
//
// NOTHING TRAINS. Trunk = U33 canon s0-2 byte-exact (PIN 258d2f06…). 2x2 diet
// cells (CLEAN/NOISY x STAT/ROT), 20 probe streams per cell per trunk
// (3x4x20 = 240 probes, N=400 rows each). Detectors A'' (precision-weighted slot validity:
// v = (mean noisy - mean clean)/SD over visited slots {0..3}, filed v1.1 P1) + B'' (carry break:
// ||c[b+10]-c[b-10]|| minus matched in-quarter baseline; response = mean over 3 boundaries).
// v1.4 diet (HALT fix) inherited. v1.1 P1 precision-weighting + v1.2 P3 fixed-tolerance POWER.
// Driver-spec D-pins (filed pre-compute, within prereg tolerance, zero data): (i) B'' response = mean of
// 3 boundary breaks; STAT matched positions reuse the trunk's ROT boundary schedule; (ii) OLS second net
// per N1-verbatim; gating order per N4-verbatim; (iii) NOSREAD O3-analogue: on singular design matrix use
// RAW margins with doubled strictness (gap-4SE>0 / spike-4SE>0), ratio subs unchanged; (iv) (d)-POWER leniency
// judgment filed: 0.25 fixed tolerance may rarely fire for carry-scale (d) — errs toward measurable, accepted.
//
// RUN (execute_js, fs in scope; ONLY under fresh countersign — probes are compute):
//   const src = await fs.readTextFile("src/evidence/decomp/newai-selfu58-driver.js");
//   (0, eval)(src + "\n//# sourceURL=newai-selfu58-driver.js");
//   await globalThis.SelfU58Init(fs);
//   await globalThis.runU58Wave0(fs, log);      // load-check + twins + dry-run 12 probes
//   await globalThis.runU58Probes(fs, log);     // 12 ledgers (20 streams each)
//   await globalThis.runU58Verdict(fs, log);    // bars + verdict
globalThis.SelfU58Init = async function (fs) {
  const src = await fs.readTextFile("src/evidence/decomp/newai-selfu53-driver.js");
  (0, eval)(src + "\n//# sourceURL=newai-selfu53-driver.js");
  await globalThis.SelfU53Init(fs);
  for (const f of ["u32FreshStack", "u32SnapshotParams", "u32MaxAbsDiff", "u33StackHash",
    "u32Sha256Hex", "IntrinsicInit", "inSeqMakeModel", "inSeqForward", "inMeanLogits",
    "inSeqGenShift", "u38TrainOneStep"]) {
    if (typeof globalThis[f] !== "function" && typeof globalThis[f] !== "object")
      throw new Error("U58 stack load failed: missing " + f);
  }
};
const U58_EXPECT_STACK = "258d2f060684ce382778e203959ab791abb5df79af174deef19ff568886d4d6e";
const U58_N = 400, U58_BURN = 50, U58_STREAMS = 20;
const U58_CELLS = ["clean-stat", "noisy-stat", "clean-rot", "noisy-rot"];
const U58_HOT = [[0, 1], [2, 3], [0, 1], [2, 3]]; // v1.4: in-substrate alternation (qk domain {0,1,2,3} only)
function u58ProbePath(trunk, cell) { return "src/evidence/decomp/d-newai-self-u58-probes-t" + trunk + "-c" + cell + ".json"; }
const U58_VERDICT_PATH = "src/evidence/decomp/d-newai-self-u58-verdict.json";
const U58_WAVE0_PATH = "src/evidence/decomp/d-newai-self-u58-wave0.json";
function u58CanonPath(seed) { return "src/evidence/decomp/d-newai-self-u33-canon-s" + seed + "-800st.json"; }
function u58Argmax4(a) { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; }
// Boundaries (N2): 100+-U{0..20} via filed stream; shared across cells of a trunk.
function u58Boundaries(G, trunk) {
  const brng = G.makeRng(61000 + trunk);
  const j = () => brng.int(41) - 20;
  return [100 + j(), 200 + j(), 300 + j()];
}
function u58Quarter(b, r) { return r > b[2] ? 3 : r > b[1] ? 2 : r > b[0] ? 1 : 0; }
// One probe row for (cell, quarter): hot-set mixture (M5) + NOISY relabel (M4).
function u58Row(rng, noisy, hotPair) {
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
function u58RunStream(M, evalMasks, rng, cell) {
  const noisy = cell.indexOf("noisy") === 0, rot = cell.indexOf("rot") > 0;
  const G = { makeRng: null };
  const b = u58RunStream._b;
  const errs = new Array(U58_N), e = new Array(8).fill(0), car = []; // car: per-row carry (B'' state)
  for (let r = 0; r < U58_N; r++) {
    const q = rot ? u58Quarter(b, r) : 0;
    const row = u58Row(rng, noisy, rot ? U58_HOT[q] : U58_HOT[0]);
    const fw1 = inSeqForward(M, row.x, new Float64Array(8), evalMasks);
    const vhat = u58Argmax4(fw1.hvLog);
    const x2m = [9, 9, 9, 9, 9, 9, row.qk, row.k, vhat, 8];
    const fw2 = inSeqForward(M, x2m, fw1.cNew, evalMasks);
    const err = u58Argmax4(inMeanLogits({ logitsK: fw2.logitsK })) !== row.y ? 1 : 0;
    errs[r] = err;
    car.push(Array.from(fw2.cNew));
    if (r >= U58_BURN) e[row.qk] = 0.9 * e[row.qk] + 0.1 * err;
  }
  let s = 0; for (let r = U58_BURN; r < U58_N; r++) s += errs[r];
  const meanErr = s / (U58_N - U58_BURN);
  const m4 = (e[0] + e[1] + e[2] + e[3]) / 4; // v1.1 P1: precision-weighting (down-weights high-spread streams)
  const sd4 = Math.sqrt(((e[0] - m4) * (e[0] - m4) + (e[1] - m4) * (e[1] - m4) + (e[2] - m4) * (e[2] - m4) + (e[3] - m4) * (e[3] - m4)) / 4);
  const aval = sd4 === 0 ? 0 : (((e[2] + e[3]) / 2 - (e[0] + e[1]) / 2) / sd4); // zero-spread streams: no information
  // B'' carry break (E-UNC2): the carry is the only cross-row state (closest thing to a context model).
  const dist8 = (a, c) => { let s = 0; for (let dd = 0; dd < 8; dd++) s += (a[dd] - c[dd]) * (a[dd] - c[dd]); return Math.sqrt(s); };
  const qs = [[0, b[0]], [b[0] + 1, b[1]], [b[1] + 1, b[2]], [b[2] + 1, U58_N - 1]];
  const bl = qs.map(([lo, hi]) => { const m = Math.floor((lo + hi) / 2); const a = Math.max(lo, m - 10), c = Math.min(hi, m + 10); return dist8(car[a], car[c]); });
  const base = (bl[0] + bl[1] + bl[2] + bl[3]) / 4;
  const bspikes = b.map((bb) => dist8(car[bb + 10], car[bb - 10]) - base);
  const bresp = (bspikes[0] + bspikes[1] + bspikes[2]) / 3;
  return { meanErr, aval, bspikes, bresp };
}
globalThis.runU58Wave0 = async function (fs, log) {
  try { const prev = JSON.parse(await fs.readTextFile(U58_WAVE0_PATH)); if (prev && prev.verdict === "COMPLETE") { log(U58_WAVE0_PATH + " exists, skip"); return prev; } } catch (e) {}
  const h = await globalThis.u33StackHash(fs);
  if (h.hex !== U58_EXPECT_STACK) throw new Error("U58-PIN HALT: stack drift " + h.hex.slice(0, 16));
  const G = await globalThis.IntrinsicInit(fs);
  log("u58-wave0 stack PIN ok");
  // stream reproducibility: same stream twice -> identical rows
  for (const seed of [0, 1]) {
    const r1 = G.makeRng(62000 + seed), r2 = G.makeRng(62000 + seed);
    const a = inSeqGenShift(r1, null), c = inSeqGenShift(r2, null);
    if (JSON.stringify(a) !== JSON.stringify(c)) throw new Error("U58 Wave-0 HALT: probe stream not reproducible");
  }
  log("u58-wave0 probe-stream reproducible");
  // v1.4 Guard': reachability assert + hot-fraction expect 0.85 (0.7*1.0+0.3*0.5 in-domain).
  for (const hp of U58_HOT) for (const qq of hp) if (qq < 0 || qq > 3) throw new Error("U58 Wave-0 HALT: hot pair outside qk domain " + JSON.stringify(hp));
  {
    const rng = G.makeRng(777001); let n = 0;
    for (let i = 0; i < 2000; i++) { const e = u58Row(rng, false, [0, 1]); if (e.qk === 0 || e.qk === 1) n++; }
    const f = n / 2000; log("u58-wave0 hot-fraction=" + f.toFixed(3) + " (v1.4 expect ~0.85)");
    if (Math.abs(f - 0.85) > 0.05) throw new Error("U58 Wave-0 HALT: hot mixture off (v1.4 expect 0.85)");
  }
  // canon params parse + dry-run: 1 stream per cell per trunk (crash-test only;
  // values filed, thresholds NOT retuned).
  const dry = [];
  for (const trunk of [0, 1, 2]) {
    const canon = JSON.parse(await fs.readTextFile(u58CanonPath(trunk)));
    const M = inSeqMakeModel(G.makeRng(1));
    const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
    load(M.E, canon.P.E); load(M.W1, canon.P.W1); load(M.b1, canon.P.b1);
    load(M.Wf, canon.P.Wf); load(M.bf, canon.P.bf); load(M.Wc, canon.P.Wc); load(M.bc, canon.P.bc);
    for (let k = 0; k < 5; k++) { load(M.Wh[k], canon.P.Wh[k]); load(M.bh[k], canon.P.bh[k]); }
    load(M.Hv, canon.P.Hv); load(M.bv, canon.P.bv);
    const fr = G.makeRng(91000 + trunk); const evalMasks = [];
    for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr.int(10) < 5 ? 2 : 0; evalMasks.push(m); }
    const b = u58Boundaries(G, trunk);
    for (const cell of U58_CELLS) {
      const rng = G.makeRng(62000 + trunk * 1000 + U58_CELLS.indexOf(cell) * 100);
      u58RunStream._b = b;
      const r = u58RunStream(M, evalMasks, rng, cell);
      dry.push({ trunk, cell, meanErr: +r.meanErr.toFixed(4), aval: +r.aval.toFixed(4), bspikes: r.bspikes.map((v) => +v.toFixed(4)), bresp: +r.bresp.toFixed(4) });
    }
  }
  log("u58-wave0 dry-run 12 streams ok (values filed, thresholds untouched)");
  const body = { spec: "self-u58-det2-prereg", track: "U58-DET2", wave: 0, verdict: "COMPLETE", stackHash: h.hex, dryRun: dry };
  await fs.writeTextFile(U58_WAVE0_PATH, JSON.stringify(body));
  return body;
};
globalThis.runU58Probes = async function (fs, log) {
  const h = await globalThis.u33StackHash(fs);
  if (h.hex !== U58_EXPECT_STACK) throw new Error("U58-PIN HALT: stack drift");
  const G = await globalThis.IntrinsicInit(fs);
  for (const trunk of [0, 1, 2]) {
    const canon = JSON.parse(await fs.readTextFile(u58CanonPath(trunk)));
    const M = inSeqMakeModel(G.makeRng(1));
    const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
    load(M.E, canon.P.E); load(M.W1, canon.P.W1); load(M.b1, canon.P.b1);
    load(M.Wf, canon.P.Wf); load(M.bf, canon.P.bf); load(M.Wc, canon.P.Wc); load(M.bc, canon.P.bc);
    for (let k = 0; k < 5; k++) { load(M.Wh[k], canon.P.Wh[k]); load(M.bh[k], canon.P.bh[k]); }
    load(M.Hv, canon.P.Hv); load(M.bv, canon.P.bv);
    const fr = G.makeRng(91000 + trunk); const evalMasks = [];
    for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr.int(10) < 5 ? 2 : 0; evalMasks.push(m); }
    const b = u58Boundaries(G, trunk);
    for (const cell of U58_CELLS) {
      const path = u58ProbePath(trunk, cell);
      try { const prev = JSON.parse(await fs.readTextFile(path)); if (prev && prev.verdict === "COMPLETE") { log(path + " exists, skip"); continue; } } catch (e) {}
      const streams = [];
      for (let s = 0; s < U58_STREAMS; s++) {
        const rng = G.makeRng(62000 + trunk * 1000 + U58_CELLS.indexOf(cell) * 100 + s);
        u58RunStream._b = b;
        const r = u58RunStream(M, evalMasks, rng, cell);
        streams.push({ s, meanErr: +r.meanErr.toFixed(5), aval: +r.aval.toFixed(5), bspikes: r.bspikes.map((v) => +v.toFixed(5)), bresp: +r.bresp.toFixed(5) });
      }
      await fs.writeTextFile(path, JSON.stringify({ spec: "self-u58-det2-prereg", track: "U58-DET2", trunk, cell, verdict: "COMPLETE", stackHash: h.hex, boundaries: b, n: U58_N, streams }));
      log("u58-probes t" + trunk + " " + cell + " COMPLETE (20 streams)");
    }
  }
  return "ALL-PROBES-COMPLETE";
};
// OLS (N1): single covariate, per trunk. Returns {slope, itc, resid[], singular}.
function u58OLS(x, y) {
  const n = x.length; let mx = 0, my = 0;
  for (let i = 0; i < n; i++) { mx += x[i]; my += y[i]; } mx /= n; my /= n;
  let sxx = 0, sxy = 0;
  for (let i = 0; i < n; i++) { sxx += (x[i] - mx) * (x[i] - mx); sxy += (x[i] - mx) * (y[i] - my); }
  if (sxx === 0) return { singular: true, resid: y.slice() };
  const slope = sxy / sxx, itc = my - slope * mx;
  return { singular: false, slope, itc, resid: y.map((v, i) => v - (slope * x[i] + itc)) };
}
function u58Mean(a) { let s = 0; for (const v of a) s += v; return s / a.length; }
function u58SD(a) { const m = u58Mean(a); let s = 0; for (const v of a) s += (v - m) * (v - m); return Math.sqrt(s / (a.length - 1)); }
function u58Corr(a, b) {
  const n = a.length, ma = u58Mean(a), mb = u58Mean(b);
  let sxy = 0, sxx = 0, syy = 0;
  for (let i = 0; i < n; i++) { sxy += (a[i] - ma) * (b[i] - mb); sxx += (a[i] - ma) * (a[i] - ma); syy += (b[i] - mb) * (b[i] - mb); }
  return sxx === 0 || syy === 0 ? 0 : sxy / Math.sqrt(sxx * syy);
}
globalThis.runU58Verdict = async function (fs, log) {
  const perTrunk = [];
  for (const trunk of [0, 1, 2]) {
    const L = {};
    for (const cell of U58_CELLS) L[cell] = JSON.parse(await fs.readTextFile(u58ProbePath(trunk, cell)));
    const pin = U58_CELLS.every((c) => L[c].stackHash === U58_EXPECT_STACK);
    const vec = { aval: [], bsw: [], merr: [], cellOf: [] };
    for (const cell of U58_CELLS) for (const st of L[cell].streams) {
      vec.aval.push(st.aval); vec.bsw.push(st.bresp); vec.merr.push(st.meanErr); vec.cellOf.push(cell);
    }
    const idx = (pred) => vec.cellOf.map((c, i) => (pred(c) ? i : -1)).filter((i) => i >= 0);
    const at = (arr, ii) => ii.map((i) => arr[i]);
    const cs = (arr, cell) => { const a = at(arr, idx((c) => c === cell)); return { m: u58Mean(a), se: u58SD(a) / Math.sqrt(a.length) }; };
    const rA = u58OLS(vec.merr, vec.aval), rB = u58OLS(vec.merr, vec.bsw);
    const nosread = rA.singular || rB.singular;
    const A = nosread ? vec.aval : rA.resid, B = nosread ? vec.bsw : rB.resid;
    const K2 = nosread ? 2 : 1;
    const gSn = cs(A, 'noisy-stat'), gSc = cs(A, 'clean-stat');
    const gRn = cs(A, 'noisy-rot'), gRc = cs(A, 'clean-rot');
    const gS = gSn.m - gSc.m, seS = Math.sqrt(gSn.se * gSn.se + gSc.se * gSc.se);
    const gR = gRn.m - gRc.m, seR = Math.sqrt(gRn.se * gRn.se + gRc.se * gRc.se);
    const cross = Math.abs(gR - gS), seC = Math.sqrt(seS * seS + seR * seR);
    const bR = at(B, idx((c) => c.indexOf('rot') >= 0));
    const sR = u58Mean(bR), seSR = u58SD(bR) / Math.sqrt(bR.length);
    const bS = at(B, idx((c) => c.indexOf('stat') >= 0));
    const sS = u58Mean(bS), seSS = u58SD(bS) / Math.sqrt(bS.length);
    const r = u58Corr(vec.aval, vec.bsw);
    const nondegen = (gS - 2 * K2 * seS > 0) && (gR - 2 * K2 * seR > 0) && (sR - 2 * K2 * seSR > 0);
    const subs = [
      { name: 'gap_STAT', pass: gS - 2 * K2 * seS > 0, uw: 2 * seS > 0.25 },
      { name: 'gap_ROT', pass: gR - 2 * K2 * seR > 0, uw: 2 * seR > 0.25 },
      { name: 'cross', pass: gS > 0 && gR > 0 && cross <= 0.5 * Math.min(gS, gR), uw: 2 * seC > 0.25 },
      { name: 'spike_ROT', pass: sR - 2 * K2 * seSR > 0, uw: 2 * seSR > 0.25 },
      { name: 'spike_STAT', pass: (Math.abs(sS) <= 2 * seSS) && (sR > 0 && sS <= sR / 2), uw: (sR > 0) && (2 * seSS > Math.abs(sR) / 2) },
    ];
    const disN = subs.filter((s) => s.pass).length;
    const dissociate = nondegen && disN >= 4;
    const independ = dissociate && Math.abs(r) < 0.7;
    const uwN = subs.filter((s) => s.uw).length;
    perTrunk.push({ trunk, pin, nosread, gaps: { gS: +gS.toFixed(4), gR: +gR.toFixed(4), cross: +cross.toFixed(4) }, spikes: { rot: +sR.toFixed(4), stat: +sS.toFixed(4) }, r: +r.toFixed(4), nondegen, subs: subs.map((s) => s.name + '=' + (s.pass ? '1' : '0')), disN, dissociate, independ, uwN });
    log('u58-verdict t' + trunk + ' PIN=' + (pin ? 'ok' : 'FAIL') + ' gaps=' + gS.toFixed(3) + '/' + gR.toFixed(3) + ' cross=' + cross.toFixed(3) + ' spikes=' + sR.toFixed(3) + '/' + sS.toFixed(3) + ' r=' + r.toFixed(3) + (nosread ? ' NOSREAD(x2)' : '') + ' uw=' + uwN + '/5');
  }
  const q = (f) => perTrunk.filter((s) => f(s)).length;
  const pinN = q((s) => s.pin), ndN = q((s) => s.nondegen), disN = q((s) => s.dissociate), indN = q((s) => s.independ), uwT = q((s) => s.uwN > 0);
  let verdict, cause;
  if (pinN < 3) { verdict = 'PIN-FAIL'; cause = 'pin'; }
  else if (uwT >= 2) { verdict = 'UNDERPOWERED'; cause = 'precision (fixed-tolerance POWER trip on 2+ trunks, v1.2)'; }
  else if (ndN < 2) { verdict = 'DET2-COLLAPSED'; cause = 'nondegeneracy'; }
  else if (disN < 2) { verdict = 'DET2-ENTANGLED'; cause = 'dissociation (need 4/5 at quorum)'; }
  else if (indN < 2) { verdict = 'DET2-ENTANGLED'; cause = 'independence (|r|>=0.7)'; }
  else { verdict = 'DET2-HEALTHY'; cause = 'clean (H-language: licenses E-NE1 consumers, proves no biology)'; }
  const body = { spec: 'self-u58-det2-prereg', track: 'U58-DET2', verdict, cause, bars: { 'DET2-PIN': pinN + '/3', 'DET2-NONDEGEN': ndN + '/3', 'DET2-DISSOCIATE': disN + '/3', 'DET2-INDEPEND': indN + '/3', 'DET2-POWER': (3 - uwT) + '/3 (non-underpowered)' }, perTrunk };
  await fs.writeTextFile(U58_VERDICT_PATH, JSON.stringify(body));
  log('u58-verdict ' + verdict + ' cause=' + cause);
  return body;
};
