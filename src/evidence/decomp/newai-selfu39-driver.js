// newai-selfu39-driver.js — U39-DIAG-EXT Waves A/B/C + verdict.
// Countersigned Turn-175. Wave-A: ledger arithmetic (+ deterministic diet regen,
// no model). Wave-B: frozen-weight probes (forward passes only, NO training).
// Wave-C: gate-only trains, trunk FROZEN bitwise (params=[] to opt; FROZEN-EXACT
// asserted). D-e: gate init ZEROS (clean pressure-ratio test; prereg ambiguous,
// verdict carries it). D-f: A2 uses signed slope (headroom = still descending).
// Stack pin 258d2f06. COMPLETE-gated, resume skips COMPLETE. NO PUSH.
//
// RUN (execute_js, fs in scope):
//   const src = await fs.readTextFile("src/evidence/decomp/newai-selfu39-driver.js");
//   (0, eval)(src + "\n//# sourceURL=newai-selfu39-driver.js");
//   await globalThis.SelfU39Init(fs);
//   const log = (m) => console.log(m);
//   await globalThis.runU39WaveA(fs, log);
//   await globalThis.runU39WaveB(fs, log);   // needs A1 outcome for B8 gating
//   await globalThis.runU39WaveC(fs, log);   // halts if B3 BLIND
//   await globalThis.runU39Verdict(fs, log);
globalThis.SelfU39Init = async function (fs) {
  const src = await fs.readTextFile("src/evidence/decomp/newai-selfu38-driver.js");
  (0, eval)(src + "\n//# sourceURL=newai-selfu38-driver.js");
  await globalThis.SelfU38Init(fs);
  for (const f of ["inSeqForward", "inSeqGenShift", "inMeanLogits", "curVoteDisagree", "inCELossGrad", "u38GateFwd", "u38MakeGate", "u38TrainOneStep", "u36PickEpisode", "u38PickDiet"]) {
    if (typeof globalThis[f] !== "function") throw new Error("u39 stack load failed: " + f);
  }
};
const U39_EXPECT_STACK = "258d2f060684ce382778e203959ab791abb5df79af174deef19ff568886d4d6e";
function u39APath() { return "src/evidence/decomp/d-newai-self-u39-waveA.json"; }
function u39BPath(pi, seed) { return "src/evidence/decomp/d-newai-self-u39-probe-b" + pi + "-s" + seed + ".json"; }
function u39CPath(kind, seed) { return "src/evidence/decomp/d-newai-self-u39-d5-" + kind + "-s" + seed + ".json"; }
const U39_VERDICT_PATH = "src/evidence/decomp/d-newai-self-u39-verdict.json";
function u39Pearson(xs, ys) {
  const n = xs.length; if (n !== ys.length || n < 3) return NaN;
  let mx = 0, my = 0; for (let i = 0; i < n; i++) { mx += xs[i]; my += ys[i]; } mx /= n; my /= n;
  let sxy = 0, sxx = 0, syy = 0;
  for (let i = 0; i < n; i++) { const dx = xs[i] - mx, dy = ys[i] - my; sxy += dx * dy; sxx += dx * dx; syy += dy * dy; }
  return (sxx <= 0 || syy <= 0) ? NaN : sxy / Math.sqrt(sxx * syy);
}
function u39SlopeCI(xs, ys) { // OLS slope + 95% CI half-width (normal approx)
  const n = xs.length; let mx = 0, my = 0;
  for (let i = 0; i < n; i++) { mx += xs[i]; my += ys[i]; } mx /= n; my /= n;
  let sxx = 0, sxy = 0;
  for (let i = 0; i < n; i++) { sxx += (xs[i] - mx) * (xs[i] - mx); sxy += (xs[i] - mx) * (ys[i] - my); }
  if (sxx <= 0) return { slope: NaN, lo: NaN, hi: NaN };
  const b = sxy / sxx; let sse = 0;
  for (let i = 0; i < n; i++) { const r = ys[i] - my - b * (xs[i] - mx); sse += r * r; }
  const se = Math.sqrt((sse / (n - 2)) / sxx);
  return { slope: b, lo: b - 1.96 * se, hi: b + 1.96 * se };
}
function u39LoadModel(G, Pobj) {
  const M = inSeqMakeModel(G.makeRng(1));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(M.E, Pobj.E); load(M.W1, Pobj.W1); load(M.b1, Pobj.b1);
  load(M.Wf, Pobj.Wf); load(M.bf, Pobj.bf); load(M.Wc, Pobj.Wc); load(M.bc, Pobj.bc);
  for (let k = 0; k < 5; k++) { load(M.Wh[k], Pobj.Wh[k]); load(M.bh[k], Pobj.bh[k]); }
  load(M.Hv, Pobj.Hv); load(M.bv, Pobj.bv);
  return M;
}
function u39EvalMasks(G, seed) {
  const fr = G.makeRng(91000 + seed), masks = [];
  for (let k = 0; k < 5; k++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr.int(10) < 5 ? 2 : 0; masks.push(m); }
  return masks;
}
const u39Argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
function u39Softmax(lg) { let m = -1e9; for (let i = 0; i < lg.length; i++) if (lg[i] > m) m = lg[i]; let s = 0; const o = new Array(lg.length); for (let i = 0; i < lg.length; i++) { o[i] = Math.exp(lg[i] - m); s += o[i]; } for (let i = 0; i < lg.length; i++) o[i] /= s; return o; }

globalThis.runU39WaveA = async function (fs, log) {
  try { const prev = JSON.parse(await fs.readTextFile(u39APath())); if (prev && prev.verdict === "COMPLETE") { log(u39APath() + " exists, skip"); return prev; } } catch (e) {}
  const h = await globalThis.u33StackHash(fs);
  if (h.hex !== U39_EXPECT_STACK) throw new Error("U39-PIN HALT: stack drift " + h.hex.slice(0, 16));
  const J = async (p) => JSON.parse(await fs.readTextFile(p));
  const T = (w, a, s) => "src/evidence/decomp/d-newai-self-" + w + "-" + a + "-s" + s + "-800st.json";
  const E = (w, a, s) => "src/evidence/decomp/d-newai-self-" + w + "-eval-" + a + "-s" + s + "-800st.json";
  const lossAt = (curve, step) => curve.find((c) => c.step === step).loss;
  // A1 + A2: 12 curves (u36/u37 × c0/c1 × s0-2).
  const curves = [];
  for (const w of ["u36", "u37"]) for (const a of ["c0", "c1"]) for (const s of [0, 1, 2]) curves.push({ w, a, s, c: (await J(T(w, a, s))).curve });
  const seg = (c, s0) => c.filter((p) => p.step >= s0);
  const slope = (c, s0, s1) => { const q = seg(c, s0).filter((p) => p.step <= s1); const a = q[0], b = q[q.length - 1]; return (b.loss - a.loss) / ((b.step - a.step) / 100); };
  const a1 = curves.map((c) => Math.abs(slope(c.c, 200, 800)) > 1e-4);
  const a1live = a1.filter(Boolean).length, A1 = a1live >= 8 ? "LIVE" : "FLAT";
  const a2m = curves.reduce((t, c) => t + slope(c.c, 500, 800), 0) / curves.length;
  const A2 = a2m < -1e-4 ? "HEADROOM" : "SATURATED"; // D-f: signed; headroom = still descending
  // A3: trunk drift vs dose (u34 c0=0/c1=1/c2=2 × s0-2).
  const frob = (A, B) => { let s = 0; for (let i = 0; i < A.length; i++) { const d = A[i] - B[i]; s += d * d; } return Math.sqrt(s); };
  const drifts = [], doses = [];
  for (const a of ["c0", "c1", "c2"]) for (const s of [0, 1, 2]) {
    const tr = await J(T("u34", a, s));
    let d2 = 0;
    for (const k of ["E", "W1", "Wf", "Wc"]) d2 += Math.pow(frob(tr.P[k], tr.P0[k]), 2);
    for (let k = 0; k < 5; k++) d2 += Math.pow(frob(tr.P.Wh[k], tr.P0.Wh[k]), 2);
    drifts.push(Math.sqrt(d2)); doses.push(a === "c0" ? 0 : a === "c1" ? 1 : 2);
  }
  const rA3 = u39Pearson(doses, drifts);
  const A3 = Math.abs(rA3) >= 0.4 ? "TUGBOAT" : "NO-TUG";
  // A5: over-chasing (u34 9 + u35 6 = 15 pts).
  const spikes = [], fails = [];
  for (const [w, arms] of [["u34", ["c0", "c1", "c2"]], ["u35-H48", null]]) {
    void w;
  }
  for (const a of ["c0", "c1", "c2"]) for (const s of [0, 1, 2]) {
    const tr = await J(T("u34", a, s)), ev = await J(E("u34", a, s));
    let mx = 0; for (let i = 1; i < tr.curve.length; i++) mx = Math.max(mx, Math.abs(tr.curve[i].loss - tr.curve[i - 1].loss));
    spikes.push(mx); fails.push(1 - ev.accTwo);
  }
  for (const a of ["c0", "c1"]) for (const s of [0, 1, 2]) {
    const tr = await J("src/evidence/decomp/d-newai-self-u35-" + a + "-s" + s + "-800st-H96.json");
    const ev = await J("src/evidence/decomp/d-newai-self-u35-eval-" + a + "-s" + s + "-800st-H96.json");
    let mx = 0; for (let i = 1; i < tr.curve.length; i++) mx = Math.max(mx, Math.abs(tr.curve[i].loss - tr.curve[i - 1].loss));
    spikes.push(mx); fails.push(1 - ev.accTwo);
  }
  const rA5 = u39Pearson(spikes, fails);
  const A5 = Math.abs(rA5) >= 0.4 ? "SIGNATURE" : "NO-SIGNATURE";
  // A6: STRENGTH CV (dietTot[3] × accScratch; 6 ledgers × 3 = 18 vals).
  const strengths = [];
  for (const w of ["u36"]) for (const a of ["c0", "c1"]) for (const s of [0, 1, 2]) {
    const tr = await J(T(w, a, s)), ev = await J(E(w, a, s));
    for (let f = 0; f < 3; f++) strengths.push(tr.dietTot[f] * ev.accScratch);
  }
  const mS = strengths.reduce((a, x) => a + x, 0) / strengths.length;
  const vS = strengths.reduce((a, x) => a + (x - mS) * (x - mS), 0) / strengths.length;
  const cvA6 = Math.sqrt(vS) / mS;
  const A6 = cvA6 > 0.2 ? "HEADROOM" : "FLAT";
  // A4 + A7 need deterministic diet regen (arithmetic, no model).
  const G = await globalThis.IntrinsicInit(fs);
  const drng = G.makeRng(42000 + 0 * 104729 + 55);
  const NREG = 2000, X = [];
  const rows7 = [];
  for (let i = 0; i < 10000; i++) {
    const ub = drng.int(2) === 0;
    const e = ub ? inSeqGenShift(drng, 0) : inSeqGenShift(drng, null);
    if (i < NREG) X.push(Array.from(e.x));
    rows7.push({ qk: e.qk, k: e.k, v: e.v, y: e.y, boot: ub ? 1 : 0, qkEqK: e.qk === e.k ? 1 : 0, qkEqV: e.qk === e.v ? 1 : 0 });
  }
  // rank of X (Gaussian elimination, tol 1e-8).
  const M_ = X.map((r) => r.slice()); let rank = 0;
  for (let c = 0; c < 10 && rank < M_.length; c++) {
    let piv = -1; for (let r = rank; r < M_.length; r++) if (Math.abs(M_[r][c]) > 1e-8) { piv = r; break; }
    if (piv < 0) continue;
    const tmp = M_[rank]; M_[rank] = M_[piv]; M_[piv] = tmp;
    for (let r = rank + 1; r < M_.length; r++) { const f = M_[r][c] / M_[rank][c]; for (let c2 = c; c2 < 10; c2++) M_[r][c2] -= f * M_[rank][c2]; }
    rank++;
  }
  const ratioA4 = rank / 4;
  const A4 = ratioA4 < 1 ? "UNSPANNED" : "SPANNED";
  // A7: max single-feature majority accuracy.
  const majAcc = (feat) => {
    const groups = {};
    for (const r of rows7) { const k = feat(r); (groups[k] = groups[k] || []).push(r.y); }
    let hit = 0;
    for (const k of Object.keys(groups)) {
      const g = groups[k], cnt = {};
      for (const y of g) cnt[y] = (cnt[y] || 0) + 1;
      hit += Math.max(...Object.values(cnt));
    }
    return hit / rows7.length;
  };
  const feats = { qk: (r) => r.qk, k: (r) => r.k, v: (r) => r.v, boot: (r) => r.boot, qkEqK: (r) => r.qkEqK, qkEqV: (r) => r.qkEqV };
  let bestF = "", bestA = 0;
  for (const f of Object.keys(feats)) { const a = majAcc(feats[f]); if (a > bestA) { bestA = a; bestF = f; } }
  const A7 = bestA > 0.60 ? "LEAK" : "CLEAN";
  const body = {
    spec: "self-u39-diag-ext-prereg", track: "U39-DIAG-EXT", wave: "A", verdict: "COMPLETE",
    stackHash: h.hex, nCurves: 12,
    A1: { liveCount: a1live, outcome: A1 }, A2: { meanSlopeLast300: +a2m.toFixed(6), outcome: A2 },
    A3: { r: +rA3.toFixed(4), outcome: A3 }, A4: { rank, ratio: +ratioA4.toFixed(4), outcome: A4 },
    A5: { r: +rA5.toFixed(4), n: 15, outcome: A5 }, A6: { cv: +cvA6.toFixed(4), outcome: A6 },
    A7: { bestFeature: bestF, bestAcc: +bestA.toFixed(4), outcome: A7 },
  };
  await fs.writeTextFile(u39APath(), JSON.stringify(body));
  log("u39-A COMPLETE " + ["A1=" + A1, "A2=" + A2, "A3=" + A3 + "(" + rA3.toFixed(3) + ")", "A4=" + A4 + "(" + ratioA4.toFixed(2) + ")", "A5=" + A5 + "(" + rA5.toFixed(3) + ")", "A6=" + A6 + "(" + cvA6.toFixed(3) + ")", "A7=" + A7 + "(" + bestF + "=" + bestA.toFixed(3) + ")"].join(" "));
  return body;
};

globalThis.runU39WaveB = async function (fs, log) {
  const h = await globalThis.u33StackHash(fs);
  if (h.hex !== U39_EXPECT_STACK) throw new Error("U39-PIN HALT: stack drift " + h.hex.slice(0, 16));
  const A = JSON.parse(await fs.readTextFile(u39APath()));
  if (A.verdict !== "COMPLETE") throw new Error("Wave-A missing");
  const G = await globalThis.IntrinsicInit(fs);
  const J = async (p) => JSON.parse(await fs.readTextFile(p));
  const T = (w, a, s) => "src/evidence/decomp/d-newai-self-" + w + "-" + a + "-s" + s + "-800st.json";
  const R = (G, pi, seed, n) => { const r = G.makeRng(53100 + pi * 100 + seed); const out = []; for (let i = 0; i < n; i++) { const ub = r.int(2) === 0; out.push(ub ? inSeqGenShift(r, 0) : inSeqGenShift(r, null)); } return out; };
  const dois = [];
  const gateOf = (tr) => ({ w: { v: Float64Array.from(tr.Gate.slice(0, 20)) }, b: { v: Float64Array.from(tr.Gate.slice(20, 21)) } });
  const gOf = (M, gate, qk, cNew) => {
    if (!gate) return 1;
    let s = gate.b.v[0];
    for (let d = 0; d < 12; d++) s += gate.w.v[d] * M.E.v[qk * 12 + d];
    for (let d = 0; d < 8; d++) s += gate.w.v[12 + d] * cNew[d];
    return 1 / (1 + Math.exp(-s));
  };
  const r2acc = (M, masks, rows, ctxFn) => {
    let hit = 0;
    for (const r of rows) {
      const fw1 = inSeqForward(M, r.x, new Float64Array(8), masks);
      const vhat = u39Argmax4(fw1.hvLog);
      const x2m = [9, 9, 9, 9, 9, 9, r.qk, r.k, vhat, 8];
      const cG = ctxFn(r, fw1, vhat);
      if (u39Argmax4(inMeanLogits({ logitsK: inSeqForward(M, x2m, cG, masks).logitsK })) === r.y) hit++;
    }
    return hit / rows.length;
  };
  for (const seed of [0, 1, 2]) {
    const masks = u39EvalMasks(G, seed);
    // Shared trunk: u38-c1 P + gate (B1/B2/B3).
    const tr38 = await J(T("u38", "c1", seed));
    const M38 = u39LoadModel(G, tr38.P), gate38 = gateOf(tr38);
    // B1: split-half centroid separability, matched vs swapped gate inputs.
    {
      const p = u39BPath(1, seed);
      try { const prev = await J(p); if (prev && prev.verdict === "COMPLETE") { log(p + " exists, skip"); dois.push(prev); continue; } } catch (e) {}
      const rows = R(G, 1, seed, 1000).map((e) => {
        const fw = inSeqForward(M38, e.x, new Float64Array(8), masks);
        return { qk: e.qk, cNew: Array.from(fw.cNew) };
      });
      const inp = (qk, c) => { const v = new Array(20); for (let d = 0; d < 12; d++) v[d] = M38.E.v[qk * 12 + d]; for (let d = 0; d < 8; d++) v[12 + d] = c[d]; return v; };
      const fit = [[new Array(20).fill(0), 0], [new Array(20).fill(0), 0]];
      for (let i = 0; i < 500; i++) {
        for (let cls = 0; cls < 2; cls++) {
          const v = cls === 0 ? inp(rows[i].qk, rows[i].cNew) : inp(rows[i].qk, rows[999 - i].cNew);
          for (let d = 0; d < 20; d++) fit[cls][0][d] += v[d]; fit[cls][1]++;
        }
      }
      for (let c = 0; c < 2; c++) for (let d = 0; d < 20; d++) fit[c][0][d] /= fit[c][1];
      let hit = 0, tot = 0;
      for (let i = 500; i < 1000; i++) {
        for (let cls = 0; cls < 2; cls++) {
          const v = cls === 0 ? inp(rows[i].qk, rows[i].cNew) : inp(rows[i].qk, rows[999 - i].cNew);
          let d0 = 0, d1 = 0;
          for (let d = 0; d < 20; d++) { d0 += (v[d] - fit[0][0][d]) ** 2; d1 += (v[d] - fit[1][0][d]) ** 2; }
          if ((d0 < d1 ? 0 : 1) === cls) hit++; tot++;
        }
      }
      const acc = hit / tot, out = { spec: "self-u39-diag-ext-prereg", track: "U39-DIAG-EXT", probe: "B1", seed, verdict: "COMPLETE", stackHash: h.hex, acc: +acc.toFixed(4), outcome: acc >= 0.65 ? "SIGNAL" : "NO-SIGNAL" };
      await fs.writeTextFile(p, JSON.stringify(out)); log("u39-B1 s" + seed + " acc=" + acc.toFixed(4) + " " + out.outcome); dois.push(out);
    }
    // B2: clean vs swapped vs zeroed round-2 + shut rate.
    {
      const p = u39BPath(2, seed);
      try { const prev = await J(p); if (prev && prev.verdict === "COMPLETE") { log(p + " exists, skip"); dois.push(prev); continue; } } catch (e) {}
      const rows = R(G, 2, seed, 1000);
      const accClean = r2acc(M38, masks, rows, (r, fw1) => { const c = new Float64Array(8); const g = gOf(M38, gate38, r.qk, fw1.cNew); for (let d = 0; d < 8; d++) c[d] = g * fw1.cNew[d]; return c; });
      // swapped + zeroed computed explicitly below (need cross-row contexts):
      const fws = rows.map((e) => inSeqForward(M38, e.x, new Float64Array(8), masks));
      let sHit = 0, zHit = 0, shut = 0;
      for (let i = 0; i < 1000; i++) {
        const e = rows[i], fw1 = fws[i], vhat = u39Argmax4(fw1.hvLog);
        const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
        const cS = fws[999 - i].cNew, g = gOf(M38, gate38, e.qk, cS);
        if (g < 0.5) shut++;
        const cG = new Float64Array(8); for (let d = 0; d < 8; d++) cG[d] = g * cS[d];
        if (u39Argmax4(inMeanLogits({ logitsK: inSeqForward(M38, x2m, cG, masks).logitsK })) === e.y) sHit++;
        if (u39Argmax4(inMeanLogits({ logitsK: inSeqForward(M38, x2m, new Float64Array(8), masks).logitsK })) === e.y) zHit++;
      }
      void 0;
      const aC = accClean, aS = sHit / 1000, aZ = zHit / 1000, shutR = shut / 1000;
      const pass = (aZ - aS >= 0.03 && shutR > 0.2);
      const out = { spec: "self-u39-diag-ext-prereg", track: "U39-DIAG-EXT", probe: "B2", seed, verdict: "COMPLETE", stackHash: h.hex, accClean: +aC.toFixed(4), accSwap: +aS.toFixed(4), accZero: +aZ.toFixed(4), shutRate: +shutR.toFixed(4), outcome: pass ? "PAYS-TO-SHUT" : "RATIONALLY-OPEN" };
      await fs.writeTextFile(p, JSON.stringify(out)); log("u39-B2 s" + seed + " clean=" + aC.toFixed(3) + " swap=" + aS.toFixed(3) + " zero=" + aZ.toFixed(3) + " shut=" + shutR.toFixed(3) + " " + out.outcome); dois.push(out);
    }
    // B3: zeros-context vs swapped-realistic gate response.
    {
      const p = u39BPath(3, seed);
      try { const prev = await J(p); if (prev && prev.verdict === "COMPLETE") { log(p + " exists, skip"); dois.push(prev); continue; } } catch (e) {}
      const rows = R(G, 3, seed, 500);
      let gZero = 0, gSwap = 0;
      const zero8 = new Float64Array(8);
      for (let i = 0; i < 500; i++) {
        const fw = inSeqForward(M38, rows[i].x, new Float64Array(8), masks);
        gZero += gOf(M38, gate38, rows[i].qk, zero8);
        gSwap += gOf(M38, gate38, rows[i].qk, inSeqForward(M38, rows[499 - i].x, new Float64Array(8), masks).cNew);
      }
      gZero /= 500; gSwap /= 500;
      const out = { spec: "self-u39-diag-ext-prereg", track: "U39-DIAG-EXT", probe: "B3", seed, verdict: "COMPLETE", stackHash: h.hex, gZeroMean: +gZero.toFixed(4), gSwapMean: +gSwap.toFixed(4), outcome: gZero < 0.5 && gSwap >= 0.5 ? "SEES-ZEROS" : gZero >= 0.5 ? "BLIND-EVEN-ON-ZEROS" : "SHUTS-ON-BOTH" };
      await fs.writeTextFile(p, JSON.stringify(out)); log("u39-B3 s" + seed + " gZero=" + gZero.toFixed(3) + " gSwap=" + gSwap.toFixed(3) + " " + out.outcome); dois.push(out);
    }
    // B4: ME-collision on best u34 trunk (computed, not assumed).
    {
      const p = u39BPath(4, seed);
      try { const prev = await J(p); if (prev && prev.verdict === "COMPLETE") { log(p + " exists, skip"); dois.push(prev); continue; } } catch (e) {}
      let best = null;
      for (const a of ["c0", "c1", "c2"]) for (const s of [0, 1, 2]) {
        const ev = await J("src/evidence/decomp/d-newai-self-u34-eval-" + a + "-s" + s + "-800st.json");
        if (!best || ev.accTwo > best.acc) best = { acc: ev.accTwo, a, s };
      }
      const trB = await J(T("u34", best.a, best.s));
      const MB = u39LoadModel(G, trB.P);
      const pool = R(G, 4, seed, 4000);
      // colliding: rows sharing the majority y; symmetric: balanced one-per-y.
      const byY = {};
      for (const e of pool) { (byY[e.y] = byY[e.y] || []).push(e); }
      const ys = Object.keys(byY).sort((a, b) => byY[b].length - byY[a].length);
      const colRows = byY[ys[0]].slice(0, 1000);
      const symRows = [];
      for (let i = 0; i < 1000; i++) symRows.push(byY[ys[i % ys.length]][(i / ys.length) | 0]);
      const accSym = r2acc(MB, masks, symRows, (r, fw1) => fw1.cNew.slice());
      const accCol = r2acc(MB, masks, colRows, (r, fw1) => fw1.cNew.slice());
      const d = accSym - accCol;
      const out = { spec: "self-u39-diag-ext-prereg", track: "U39-DIAG-EXT", probe: "B4", seed, verdict: "COMPLETE", stackHash: h.hex, trunk: "u34-" + best.a + "-s" + best.s, accSym: +accSym.toFixed(4), accCol: +accCol.toFixed(4), delta: +d.toFixed(4), outcome: d <= 0.02 ? "PASS" : d >= 0.05 ? "FAIL" : "FINAL-INCONCLUSIVE" };
      await fs.writeTextFile(p, JSON.stringify(out)); log("u39-B4 s" + seed + " trunk=" + out.trunk + " sym=" + accSym.toFixed(3) + " col=" + accCol.toFixed(3) + " d=" + d.toFixed(3) + " " + out.outcome); dois.push(out);
    }
    // B5: vote-head entropy on frozen U33-canon.
    {
      const p = u39BPath(5, seed);
      try { const prev = await J(p); if (prev && prev.verdict === "COMPLETE") { log(p + " exists, skip"); dois.push(prev); continue; } } catch (e) {}
      const trC = await J("src/evidence/decomp/d-newai-self-u33-canon-s" + seed + "-800st.json");
      const MC = u39LoadModel(G, trC.P);
      const rows = R(G, 5, seed, 1000);
      let ent = 0;
      for (const e of rows) {
        const fw = inSeqForward(MC, e.x, new Float64Array(8), masks);
        const pr = u39Softmax(Array.from(fw.hvLog));
        for (const q of pr) ent -= q * Math.log(q + 1e-12);
      }
      ent /= 1000;
      const out = { spec: "self-u39-diag-ext-prereg", track: "U39-DIAG-EXT", probe: "B5", seed, verdict: "COMPLETE", stackHash: h.hex, meanEntropy: +ent.toFixed(4), bar: +(Math.log(4) - 0.3).toFixed(4), outcome: ent < Math.log(4) - 0.3 ? "BIASED" : "UNBIASED" };
      await fs.writeTextFile(p, JSON.stringify(out)); log("u39-B5 s" + seed + " ent=" + ent.toFixed(3) + " " + out.outcome); dois.push(out);
    }
    // B6: row-level slope u34-c1 vs u34-c0 per seed (quorum in verdict).
    {
      const p = u39BPath(6, seed);
      try { const prev = await J(p); if (prev && prev.verdict === "COMPLETE") { log(p + " exists, skip"); dois.push(prev); continue; } } catch (e) {}
      const M0 = u39LoadModel(G, (await J(T("u34", "c0", seed))).P);
      const M1 = u39LoadModel(G, (await J(T("u34", "c1", seed))).P);
      const rows = R(G, 6, seed, 1000);
      const c0 = [], c1 = [];
      for (const e of rows) {
        for (const [M, arr] of [[M0, c0], [M1, c1]]) {
          const fw1 = inSeqForward(M, e.x, new Float64Array(8), masks);
          const vhat = u39Argmax4(fw1.hvLog);
          const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
          arr.push(u39Argmax4(inMeanLogits({ logitsK: inSeqForward(M, x2m, fw1.cNew, masks).logitsK })) === e.y ? 1 : 0);
        }
      }
      const { slope, lo, hi } = u39SlopeCI(c0, c1);
      const out = { spec: "self-u39-diag-ext-prereg", track: "U39-DIAG-EXT", probe: "B6", seed, verdict: "COMPLETE", stackHash: h.hex, slope: +slope.toFixed(4), ci95: [+lo.toFixed(4), +hi.toFixed(4)], compression: hi < 1 };
      await fs.writeTextFile(p, JSON.stringify(out)); log("u39-B6 s" + seed + " slope=" + slope.toFixed(3) + " [" + lo.toFixed(3) + "," + hi.toFixed(3) + "]"); dois.push(out);
    }
    // B7: gain-surprise rho on frozen u36-c1.
    {
      const p = u39BPath(7, seed);
      try { const prev = await J(p); if (prev && prev.verdict === "COMPLETE") { log(p + " exists, skip"); dois.push(prev); continue; } } catch (e) {}
      const M6 = u39LoadModel(G, (await J(T("u36", "c1", seed))).P);
      const rows = R(G, 7, seed, 1000);
      const pes = [], flips = [];
      for (const e of rows) {
        const fw1 = inSeqForward(M6, e.x, new Float64Array(8), masks);
        const vhat = u39Argmax4(fw1.hvLog);
        const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
        const lg = inMeanLogits({ logitsK: inSeqForward(M6, x2m, fw1.cNew, masks).logitsK });
        const pr = u39Softmax(Array.from(lg));
        const sorted = pr.slice().sort((a, b) => b - a);
        pes.push(-Math.log(pr[e.y] + 1e-12)); flips.push(1 - (sorted[0] - sorted[1]));
      }
      const rho = u39Pearson(pes, flips);
      const out = { spec: "self-u39-diag-ext-prereg", track: "U39-DIAG-EXT", probe: "B7", seed, verdict: "COMPLETE", stackHash: h.hex, rho: +rho.toFixed(4), outcome: rho < 0.9 ? "DISSOCIATED" : "COLLAPSED" };
      await fs.writeTextFile(p, JSON.stringify(out)); log("u39-B7 s" + seed + " rho=" + rho.toFixed(3) + " " + out.outcome); dois.push(out);
    }
    // B8: disagree-LP per family (runs only if A1 LIVE).
    {
      const p = u39BPath(8, seed);
      try { const prev = await J(p); if (prev && prev.verdict === "COMPLETE") { log(p + " exists, skip"); dois.push(prev); continue; } } catch (e) {}
      if (A.outcome !== undefined && A.A1.outcome !== "LIVE") {
        const out = { spec: "self-u39-diag-ext-prereg", track: "U39-DIAG-EXT", probe: "B8", seed, verdict: "COMPLETE", stackHash: h.hex, outcome: "SKIPPED-A1-FLAT" };
        await fs.writeTextFile(p, JSON.stringify(out)); dois.push(out); continue;
      }
      const gains = [], dis = [];
      for (const arm of ["c0", "c1"]) {
        const tr = await J(T("u36", arm, seed));
        const MP = u39LoadModel(G, tr.P), MP0 = u39LoadModel(G, tr.P0);
        const famRows = [[], [], []];
        const prng = G.makeRng(53200 + seed);
        while (famRows[0].length < 200 || famRows[1].length < 200 || famRows[2].length < 200) {
          const { e, roll } = u36PickEpisode(MP, prng, masks);
          const f = roll <= 1 ? 0 : roll === 2 ? 1 : 2;
          if (famRows[f].length < 200) famRows[f].push(e);
        }
        for (let f = 0; f < 3; f++) {
          let gP = 0, g0 = 0, dg = 0;
          for (const e of famRows[f]) {
            const fP = inSeqForward(MP, e.x, new Float64Array(8), masks);
            const f0 = inSeqForward(MP0, e.x, new Float64Array(8), masks);
            const vhat = u39Argmax4(fP.hvLog);
            const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
            gP += inCELossGrad(inMeanLogits({ logitsK: inSeqForward(MP, x2m, fP.cNew, masks).logitsK }), e.y).loss;
            g0 += inCELossGrad(inMeanLogits({ logitsK: inSeqForward(MP0, x2m, f0.cNew, masks).logitsK }), e.y).loss;
            dg += curVoteDisagree(fP.logitsK);
          }
          gains.push(g0 / 200 - gP / 200); dis.push(dg / 200);
        }
      }
      const out = { spec: "self-u39-diag-ext-prereg", track: "U39-DIAG-EXT", probe: "B8", seed, verdict: "COMPLETE", stackHash: h.hex, gains: gains.map((x) => +x.toFixed(4)), disagrees: dis.map((x) => +x.toFixed(4)) };
      await fs.writeTextFile(p, JSON.stringify(out)); log("u39-B8 s" + seed + " filed (6 pts)"); dois.push(out);
    }
  }
  return dois;
};

globalThis.runU39WaveC = async function (fs, log) {
  const h = await globalThis.u33StackHash(fs);
  if (h.hex !== U39_EXPECT_STACK) throw new Error("U39-PIN HALT: stack drift " + h.hex.slice(0, 16));
  // B3 BLIND halts Wave-C before any train.
  for (const seed of [0, 1, 2]) {
    const b3 = JSON.parse(await fs.readTextFile(u39BPath(3, seed)));
    if (b3.verdict !== "COMPLETE") throw new Error("B3 missing s" + seed);
    if (b3.outcome === "BLIND-EVEN-ON-ZEROS") throw new Error("U39-HALT: B3 BLIND s" + seed + " — audit full-step integration before Wave-C");
  }
  const G = await globalThis.IntrinsicInit(fs);
  const J = async (p) => JSON.parse(await fs.readTextFile(p));
  const drvSrc = await fs.readTextFile("src/evidence/decomp/newai-selfu39-driver.js");
  const drvHash = await u32Sha256Hex(drvSrc);
  const u39PickDiet = (M, dataRng, fixedMasks, pMis) => {
    if (dataRng.int(100) < pMis * 100) {
      const mk = () => { const ub = dataRng.int(2) === 0; return ub ? inSeqGenShift(dataRng, 0) : inSeqGenShift(dataRng, null); };
      return { eA: mk(), eB: mk(), mismatch: true };
    }
    const { e } = u36PickEpisode(M, dataRng, fixedMasks);
    return { eA: e, eB: null, mismatch: false };
  };
  for (const kind of ["a", "b"]) {
    const pMis = kind === "a" ? 0.125 : 0.5;
    for (const seed of [0, 1, 2]) {
      const ledgerPath = u39CPath(kind, seed);
      try { const prev = await J(ledgerPath); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); continue; } } catch (e) {}
      const tr38 = await J("src/evidence/decomp/d-newai-self-u38-c1-s" + seed + "-800st.json");
      const M = u39LoadModel(G, tr38.P);
      const Pinit = globalThis.u32SnapshotParams(M);
      const gate = u38MakeGate(); // D-e: zeros init (clean pressure-ratio test)
      const gateOpt = new G.Adam(5e-3);
      const S = u32SeedStreams(seed);
      const dataRng = G.makeRng(S.data);
      const fr = G.makeRng(S.mask), fixedMasks = [];
      for (let k = 0; k < 5; k++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr.int(10) < 5 ? 2 : 0; fixedMasks.push(m); }
      const steps = 800, t0 = Date.now(), curve = [], gateCurve = [];
      for (let step = 0; step < steps; step++) {
        for (const p of []) void p;
        // zero trunk grads by construction: pass params=[] so opt only sees gate.
        const keepParams = [];
        // replicate u38TrainOneStep with custom picker; trunk .g fills but never steps.
        const B = 16, auxW = 0.5, lam = 2.0, K = 5;
        const argmax4 = u39Argmax4;
        let lsum = 0;
        for (let b = 0; b < B; b++) {
          const { eA, eB, mismatch } = u39PickDiet(M, dataRng, fixedMasks, pMis);
          const e = eA;
          const fw1 = inSeqForward(M, e.x, new Float64Array(8), fixedMasks);
          const ceHv = inCELossGrad(fw1.hvLog, e.v);
          const dHv = new Float64Array(4); for (let o = 0; o < 4; o++) dHv[o] = ceHv.d[o] * auxW / B;
          const vhat = argmax4(fw1.hvLog);
          let cCtx, gInfo;
          if (mismatch) {
            const fwB = inSeqForward(M, eB.x, new Float64Array(8), fixedMasks);
            cCtx = fwB.cNew;
            gInfo = u38GateFwd(M, gate, e.qk, cCtx); gInfo.fwB = fwB; gInfo.donor = true;
          } else {
            cCtx = fw1.cNew;
            gInfo = u38GateFwd(M, gate, e.qk, cCtx);
          }
          const g = gInfo.g;
          const cGated = new Float64Array(8);
          for (let d = 0; d < 8; d++) cGated[d] = g * cCtx[d];
          const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
          const fw2 = inSeqForward(M, x2m, cGated, fixedMasks);
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
          lsum += ce2.loss + auxW * ceHv.loss;
          const dcGated = inSeqBackward(M, fw2, dMean2, perHead2, null, null, fixedMasks);
          let dot = 0;
          for (let d = 0; d < 8; d++) dot += dcGated[d] * cCtx[d];
          const dLds = dot * g * (1 - g);
          for (let i = 0; i < 20; i++) gate.w.g[i] += dLds * gInfo.inp[i] / B;
          gate.b.g[0] += dLds / B;
          for (let d = 0; d < 12; d++) M.E.g[e.qk * 12 + d] += dLds * gate.w.v[d] / B;
          const dcTot = new Float64Array(8);
          for (let d = 0; d < 8; d++) dcTot[d] = (g * dcGated[d] + dLds * gate.w.v[12 + d]) / B;
          if (mismatch) {
            inSeqBackward(M, gInfo.fwB, null, null, null, dcTot, fixedMasks);
            inSeqBackward(M, fw1, dMean1, perHead1, dHv, null, fixedMasks);
          } else {
            inSeqBackward(M, fw1, dMean1, perHead1, dHv, dcTot, fixedMasks);
          }
          const meanW = new Float64Array(M.Wh[0].v.length);
          for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) meanW[i] += M.Wh[k].v[i] / K;
          for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) M.Wh[k].g[i] += lam * (M.Wh[k].v[i] - meanW[i]) / (B * M.H);
        }
        // gate-only opt step (trunk params never stepped).
        {
          const plist = [gate.w, gate.b];
          let s = 0;
          for (const p of plist) for (let i = 0; i < p.g.length; i++) s += p.g[i] * p.g[i];
          const n = Math.sqrt(s);
          if (n > 1.0) { const sc = 1.0 / n; for (const p of plist) for (let i = 0; i < p.g.length; i++) p.g[i] *= sc; }
          gateOpt.step(plist);
          gate.w.g.fill(0); gate.b.g.fill(0);
        }
        void keepParams;
        if (step % 100 === 0 || step === steps - 1) {
          curve.push({ step, loss: +(lsum / B).toFixed(6) });
          gateCurve.push({ step, b: +gate.b.v[0].toFixed(4), wMean: +([...gate.w.v].reduce((a, x) => a + Math.abs(x), 0) / 20).toFixed(4) });
        }
        if (step % 200 === 0) log("u39-d5 " + kind + " s" + seed + " step " + step + "/800 loss=" + (lsum / B).toFixed(4));
      }
      // FROZEN-EXACT: trunk bitwise unchanged.
      const Pfin = globalThis.u32SnapshotParams(M);
      let fmax = 0;
      for (const k of Object.keys(Pinit)) {
        const A0 = Pinit[k], A1 = Pfin[k];
        const a0 = Array.isArray(A0) ? A0 : [A0], a1 = Array.isArray(A1) ? A1 : [A1];
        const flat = (v) => (Array.isArray(v) ? v.flat(Infinity) : [v]);
        const f0 = flat(a0), f1 = flat(a1);
        for (let i = 0; i < f0.length; i++) fmax = Math.max(fmax, Math.abs(f0[i] - f1[i]));
      }
      // shut test on swapped probe (B2-style, N=200).
      const masks = u39EvalMasks(G, seed);
      const prose = G.makeRng(53300 + seed);
      let shut = 0;
      const NN = 200, cws = [];
      for (let i = 0; i < NN; i++) { const ub = prose.int(2) === 0; cws.push(ub ? inSeqGenShift(prose, 0) : inSeqGenShift(prose, null)); }
      const fws = cws.map((e) => inSeqForward(M, e.x, new Float64Array(8), masks));
      for (let i = 0; i < NN; i++) {
        let s = gate.b.v[0];
        for (let d = 0; d < 12; d++) s += gate.w.v[d] * M.E.v[cws[i].qk * 12 + d];
        const cS = fws[NN - 1 - i].cNew;
        for (let d = 0; d < 8; d++) s += gate.w.v[12 + d] * cS[d];
        if (1 / (1 + Math.exp(-s)) < 0.5) shut++;
      }
      const body = {
        spec: "self-u39-diag-ext-prereg", track: "U39-DIAG-EXT", wave: "C", kind, mismatchRatio: pMis, seed, steps,
        verdict: "COMPLETE", gateInit: "zeros (D-e)", stackHash: h.hex, u39DriverHash: drvHash,
        wallMs: Date.now() - t0, curve, gateCurve, divCos: +inMeanCos(M).toFixed(4),
        frozenExact: fmax, shutRateSwapped: +(shut / NN).toFixed(4),
        shuts: shut / NN > 0.2,
        Gate0: new Array(21).fill(0), Gate: Array.from(gate.w.v).concat(Array.from(gate.b.v)),
      };
      if (!(fmax === 0)) throw new Error("U39-FROZEN VIOLATION d5-" + kind + " s" + seed + " drift=" + fmax);
      await fs.writeTextFile(ledgerPath, JSON.stringify(body));
      log("u39-d5 " + kind + " s" + seed + " COMPLETE lossN=" + curve[curve.length - 1].loss + " frozenExact=" + fmax + " shut=" + body.shutRateSwapped);
    }
  }
};

globalThis.runU39Verdict = async function (fs, log) {
  const J = async (p) => JSON.parse(await fs.readTextFile(p));
  const A = await J(u39APath());
  const probes = {};
  for (const pi of [1, 2, 3, 4, 5, 6, 7, 8]) {
    probes["B" + pi] = [];
    for (const seed of [0, 1, 2]) probes["B" + pi].push(await J(u39BPath(pi, seed)));
  }
  const d5 = {};
  for (const kind of ["a", "b"]) { d5[kind] = []; for (const seed of [0, 1, 2]) { try { d5[kind].push(await J(u39CPath(kind, seed))); } catch (e) { d5[kind].push({ outcome: "NOT-RUN", reason: "B3-BLIND halt" }); } } }
  const q = (arr, f) => arr.filter((s) => f(s)).length;
  const b6comp = q(probes.B6, (s) => s.compression);
  // B8 pooled rho across seeds (6 pts/seed → 18).
  let b8r = NaN, b8n = 0;
  {
    const gs = [], ds = [];
    for (const s of probes.B8) { if (s.gains) { for (let i = 0; i < s.gains.length; i++) { gs.push(s.gains[i]); ds.push(s.disagrees[i]); } } }
    b8n = gs.length; b8r = u39Pearson(gs, ds);
  }
  const bars = {
    A1: A.A1.outcome, A2: A.A2.outcome, A3: A.A3.outcome, A4: A.A4.outcome,
    A5: A.A5.outcome, A6: A.A6.outcome, A7: A.A7.outcome,
    B1: q(probes.B1, (s) => s.outcome === "SIGNAL") + "/3", B2: q(probes.B2, (s) => s.outcome === "PAYS-TO-SHUT") + "/3",
    B3: probes.B3.map((s) => s.outcome).join(","),
    B4: probes.B4.map((s) => s.outcome).join(","),
    B5: q(probes.B5, (s) => s.outcome === "BIASED") + "/3",
    B6compression: b6comp + "/3",
    B7: probes.B7.map((s) => s.outcome).join(","),
    B8: "r=" + (isFinite(b8r) ? b8r.toFixed(3) : "n/a") + " n=" + b8n,
    D5a: q(d5.a, (s) => s.shuts) + "/3" + (d5.a[0].outcome === "NOT-RUN" ? " NOT-RUN-B3-BLIND" : ""),
    D5b: q(d5.b, (s) => s.shuts) + "/3" + (d5.b[0].outcome === "NOT-RUN" ? " NOT-RUN-B3-BLIND" : ""),
  };
  const lic = {};
  lic["01-irie"] = bars.B2.startsWith("0/3") || bars.B2.startsWith("1/3") ? "DEAD (RATIONALLY-OPEN quorum)" : "ADVANCE (meta-episodes, held-out-CLASS control)";
  lic["02-lake-baroni"] = probes.B4.some((s) => s.outcome === "FAIL") ? "DEAD (lookup-table collision)" : probes.B4.every((s) => s.outcome === "PASS") ? "ADVANCE (remap diet)" : "GATED-SHUT (FINAL-INCONCLUSIVE)";
  lic["03-04-colas-oudeyer"] = (A.A1.outcome === "FLAT" || (isFinite(b8r) && Math.abs(b8r) < 0.4)) ? "DEAD (no LP signal)" : "ADVANCE (bandit vs uniform+yoked)";
  lic["05-mattar-daw"] = q(probes.B7, (s) => s.outcome === "DISSOCIATED") >= 2 ? "ADVANCE (3-way replay)" : "DEAD (gain==surprise)";
  lic["06-diekmann"] = A.A6.outcome === "FLAT" ? "DEAD (no STRENGTH headroom)" : "ADVANCE (SFMA vs random+IoR)";
  lic["07-sydnor"] = A.A3.outcome === "NO-TUG" ? "DEAD (no tug-of-war)" : "ADVANCE (staged vs joint + linear-decay)";
  lic["08-jarvis"] = A.A4.outcome === "SPANNED" ? "DEAD (subspace spanned at 4-class)" : "ADVANCE (vocab expansion, 20% bar + early-stop control)";
  lic["09-lippl"] = b6comp >= 2 && A.A7.outcome === "LEAK" ? "ARCHITECTURE TRACK FORCED (shortcut kernel regime)" : !probes.B6.some((s) => s.compression) && A.A7.outcome === "CLEAN" ? "KERNEL THEORY FALSIFIED (proceed through other gates)" : "MIXED (filed, no re-run)";
  lic["10-andrychowicz"] = A.A2.outcome === "SATURATED" ? "DEAD (trajectory solved)" : "ADVANCE (ramp + cross-diet transfer)";
  lic["11-stc"] = A.A5.outcome === "NO-SIGNATURE" ? "DEAD (no over-chasing)" : "ADVANCE (STC vs yoked-tag)";
  lic["13-langcult"] = q(probes.B5, (s) => s.outcome === "BIASED") >= 2 ? "ADVANCE (productive vs extractive, wrong-token-breaks-action)" : "INAPPLICABLE-as-instantiated (no discrete head)";
  const perSeed = { B1: probes.B1, B2: probes.B2, B3: probes.B3, B4: probes.B4, B5: probes.B5, B6: probes.B6, B7: probes.B7, D5a: d5.a, D5b: d5.b };
  const body = {
    spec: "self-u39-diag-ext-prereg", track: "U39-DIAG-EXT", verdict: "DIAG-COMPLETE",
    bars, perSeed,
    deviations: ["D-a total-loss proxy (+B8 per-family recompute)", "D-b row-level slope (per-seed quorum)", "D-c vote-entropy substitute", "D-d 1-margin gain", "D-e Wave-C gate zeros init", "D-f A2 signed slope (headroom = descending)"],
    license: lic,
  };
  await fs.writeTextFile(U39_VERDICT_PATH, JSON.stringify(body, null, 1));
  log("u39-verdict DIAG-COMPLETE " + JSON.stringify(bars));
  return body;
};
