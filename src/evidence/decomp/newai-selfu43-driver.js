// newai-selfu43-driver.js — U43 ADVANCED program, modules M2 + M1 (Turn-184 CLOSED) + M5/M3/M4/M6 (this extension).
//
// Countersign: Turn-182 covered M2 then M1 IN FILED ORDER; Turn-185 user "countersigned"
// covers the next modules IN FILED ORDER: M5 -> M3 -> M4 -> M6 (prereg v1.1 execution
// sequence M2->M1->M5->M3->M4->M6). M1-first amendment was NOT preregged — filed order governs.
// CPU/in-worker only. NO PUSH.
//
// Stack: pinned U33 stack (stackHash 258d2f06…), H48, 800st, B16/lr5e-3/K5, C=6,
// auxW0.5, lam2.0, boot, W6 streams via u32FreshStack(seed) — twin-matched.
// Diet for BOTH modules = U36-D1 (driver D1 recipe, both arms shared there):
//   roll 0-1 (50%): W6 base rows; roll 2 (25%): OOD-bind qk!=v (rejection ≤10);
//   roll 3 (25%): uniform single (easy+hard mix). Scorer STATIC (alpha=0) everywhere
//   in U43-M2/M1 (dynamic scorer was a U36-c1 instrument, not part of the D1 diet).
//
// EXPLICATIONS (pinned where prereg v1.1 is schematic; construction, not deviations):
//   E1 M2 replay schedule: steps with step%10===9 (80/800 = 10%). If store<16 rows,
//     diet step instead (store builds). Same schedule all 3 arms -> dataRng stays aligned.
//   E2 M2 store: every diet-step row pushed (cap 4000, drop oldest, qk counts maintained).
//     "filed-so-far" = this run's own rows only. Selection per slot: sample C=6 store rows
//     via replayRng (G.makeRng(92000+seed*7919+armCode*131), arm NOT in dataRng so diet
//     stream stays canonical-aligned), score FRESH with current M, pick-best:
//       surprise s = (1-p_v) + (1-p_y) with p_v=softmax(hvLog)[v] (fresh zero-carry fw1),
//         p_y=softmax(mean2)[y] from x2m-with-vhat fw2 (same code path as train slot).
//       need n = 1+ln(1+count_qk) (count in store).
//       G: score=s*n (Gain×Need). S: score=s (|PE| surprise). R: uniform (no score).
//     So G vs S isolates the recurrence multiplier — exactly the prereg bar's question.
//   E3 M1 candidates per slot: C=6 singles drawn with the u36 per-c roll logic
//     (roll=dataRng.int(4); roll2 OOD-reject ≤10; roll3 plain single), forwarded with
//     current M for d=curVoteDisagree; one extra dataRng.int(6) ALWAYS consumed (used only
//     by U) so dataRng stays aligned across arms. L=argmin d, H=argmax d, U=uniform idx.
//   E4 Shared losses = u36 static-slot body verbatim (auxW hv, perHead b%K 0.1*K/B on y,
//     mean2 CE/B, mean1 0.3/B on y, lam mean-pull, global clip 1.0, opt.step). No oracle
//     aux (U34 instrument, not U43), no dynamic scorer. Selection is stop-gradient sampling.
//   E6 M5 RAMP weight (trajectory price, Andrychowicz w_t gem): w(step)=0.2+1.6*step/799
//     (mean 1.0 over 800 steps; late-step CE >> early-step). Applied to every slot
//     gradient scale + slot loss; lam mean-pull brake stays UNWEIGHTED (structural, not
//     trajectory). FLAT w=1. Diet A train = U36-D1 pick-max (u36PickEpisode, shared).
//   E7 M5 diet B (disjoint mapping family, transfer, no retraining): same generator rows,
//     labels remapped yB=(y+2)%4 (maximally disjoint shift; inputs x/qk/k/v identical).
//     Transfer stream G.makeRng(53500+seed), N=200, paired across arms (same rows per
//     seed); same eval masks as standard (91000+seed) for comparability.
//   E8 M3 heterogeneous diet 90/5/5 (contrast): int20 0-17 familiar base single, 18 OOD
//     qk!=v (reject<=10), 19 uniform single — drawn WITHOUT pick-max to preserve the
//     contrast (SFMA needs heterogeneous strengths; U31f taught homogeneous diets dilute).
//     Replay schedule step%10==9 + store>=16 (E1-style). On replay steps SFMA/RI train
//     replay AND draw+push 16 diet context rows (forward-only, no grad) so dataRng/store
//     stay aligned with NR (which trains diet on those steps). Store cap 4000, drop oldest.
//     SFMA rating (local stats only, hypothetical-free per Diekmann): strength n=(1+ln(1+count))
//     ×(1+err) [err=1 if fresh fw wrong else 0] × similarity (1.0 cand.qk==ctx.qk else 0.3,
//     DR-analogue: same-query region) × IoR (0 if row picked within last 50 steps else 1).
//     Dynamic mode switch on trailing diet-loss avg (last 20 steps): >1.8 REVERSE
//     (rating=(0.3+s)*n*IoR, surprise-led, sim ignored) else DEFAULT (rating=n*sim*IoR,
//     familiarity-led). Mode counts logged (informational; single switched formula, no bar
//     change). RI = uniform among non-tabu rows (IoR-only control; fallback uniform).
//     NR = diet only. Selection per slot: sample C=6 store rows via replayRng (arm NOT in
//     dataRng so diet stream stays canonical-aligned), pick-best (SFMA) / uniform (RI).
//   E9 M4 trunk/scorer split (Sydnor cascade analogue): trunk=[E,W1,b1,Wf,bf,Wc,bc]
//     (representation+carry), scorer=[Wh0-4,bh0-4,Hv,bv] (heads+value). STAGED phase A
//     (step<400): all grads ×1 except scorer ×0.1; phase B (400-799): trunk grads ZEROED
//     (PNN-analogue hard brake, incl. lam pull) scorer ×1. JOINT all ×1 (U34-style).
//     LINDEC all ×(1-step/800). Adam-invariance caveat FILED (U41 D-g): grad-scale is weak
//     under Adam+clip; the load-bearing contrast is the phase-B hard freeze vs JOINT.
//   E10 M6 goal token (LangCult extractive/productive split, stack-preserving): repurpose
//     round-2 input slot x2m[0] (was 9-pad): g=4 bind if e.k==0 else g=5 retrieve.
//     P: train input correct g + goal probe (Gw H×2 + gb 2, CE 0.5/B, stop-gradient at probe
//     — NO trunk backprop, no stack surgery; trunk learns from goal-CONDITIONED inputs,
//     exactly the Dennett/Clark fork) ; eval EMITS ĝ=argmax probe then acts with ĝ
//     (productive self-prompting). E: train correct g, no probe; eval 9 (omitted —
//     extractive-only control). B: 9 always (baseline). Break test (P): per-row act with
//     ĝ vs flipped token; breakRate=frac changed; bar ≥0.80 quorum 2/3 or decorative DEAD.
//   E11 Evals: standard = u34 paired-eval body verbatim (N=200 shift scr/two/orc + 200
//     base-k0 fwd, corrected orc line, floor guard scr≥0.50/two≥0.45 on winner).
//     M5 adds transfer eval (E7). M6 P emits (E10) + breakRate; E/B fixed tokens.
//     Verdict deltas: M5 A-win RAMP≥FLAT+0.03 quorum + transfer RAMP-B≥FLAT-B (direction,
//     no margin) quorum → ADVANCE. M3 substrate-first: |SFMA−NR|≤0.03 quorum → DEAD;
//     else SFMA≥RI+0.03 quorum → ADVANCE else DEAD. M4 both links +0.03 quorum → ADVANCE;
//     LINDEC≥STAGED quorum → DEAD (critical-period rejected); JOINT≥STAGED quorum → DEAD.
//     M6 P≥E+0.03 and E≥B+0.03 quorums + break quorum → ADVANCE; |P−E|≤0.03 quorum →
//     DEAD decorative; |E−B|≤0.03 quorum → DEAD.
//
// RUN (execute_js, fs in scope):
//   const src = await fs.readTextFile("src/evidence/decomp/newai-selfu43-driver.js");
//   (0, eval)(src + "\n//# sourceURL=newai-selfu43-driver.js");
//   await globalThis.SelfU43Init(fs);
//   const log = (m) => console.log(m);
//   await globalThis.runU43Train(fs, log, {module:"m2", seed:0, arm:"g"});
//   await globalThis.runU43Eval(fs, log, {module:"m2", seed:0, arm:"g"});
//   await globalThis.runU43Verdict(fs, log, {module:"m2"});
globalThis.SelfU43Init = async function (fs) {
  const src = await fs.readTextFile("src/evidence/decomp/newai-selfu36-driver.js");
  (0, eval)(src + "\n//# sourceURL=newai-selfu36-driver.js");
  await globalThis.SelfU36Init(fs);
  if (typeof globalThis.u36PickEpisode !== "function") throw new Error("u43 stack load failed");
};
const U43_EXPECT_STACK = "258d2f060684ce382778e203959ab791abb5df79af174deef19ff568886d4d6e";
const U43_M2_ARMS = { g: 21, s: 22, r: 23 };
const U43_M1_ARMS = { l: 31, h: 32, u: 33 };
const U43_M5_ARMS = { ramp: 51, flat: 52 };
const U43_M3_ARMS = { sfma: 61, ri: 62, nr: 63 };
const U43_M4_ARMS = { staged: 71, joint: 72, lindec: 73 };
const U43_M6_ARMS = { p: 81, e: 82, b: 83 };
function u43TransferPath(seed, arm) { return "src/evidence/decomp/d-newai-self-u43-eval-m5-" + arm + "-s" + seed + "-800st-transfer.json"; }
function u43TrainPath(mod, seed, arm) { return "src/evidence/decomp/d-newai-self-u43-" + mod + "-" + arm + "-s" + seed + "-800st.json"; }
function u43EvalPath(mod, seed, arm) { return "src/evidence/decomp/d-newai-self-u43-eval-" + mod + "-" + arm + "-s" + seed + "-800st.json"; }
function u43VerdictPath(mod) { return "src/evidence/decomp/d-newai-self-u43-" + mod + "-verdict.json"; }
// Static per-slot forward/loss/backward (u36 static body for one picked episode e).
function u43StaticSlot(M, e, b, B, fixedMasks) {
  const K = 5, auxW = 0.5;
  const argmax4 = (a) => { let x = 0; for (let i = 1; i < 4; i++) if (a[i] > a[x]) x = i; return x; };
  const c0 = new Float64Array(8);
  const fw1 = inSeqForward(M, e.x, c0, fixedMasks);
  const ceHv = inCELossGrad(fw1.hvLog, e.v);
  const dHv = new Float64Array(4); for (let o = 0; o < 4; o++) dHv[o] = ceHv.d[o] * auxW / B;
  const vhat = argmax4(fw1.hvLog);
  const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
  const fw2 = inSeqForward(M, x2m, fw1.cNew, fixedMasks);
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
  const dc = inSeqBackward(M, fw2, dMean2, perHead2, null, null, fixedMasks);
  inSeqBackward(M, fw1, dMean1, perHead1, dHv, dc, fixedMasks);
  return ce2.loss + auxW * ceHv.loss;
}
function u43Softmax4(lg) {
  let mx = lg[0]; for (let o = 1; o < 4; o++) if (lg[o] > mx) mx = lg[o];
  let s = 0; const p = [0, 0, 0, 0];
  for (let o = 0; o < 4; o++) { p[o] = Math.exp(lg[o] - mx); s += p[o]; }
  for (let o = 0; o < 4; o++) p[o] /= s;
  return p;
}
// Fresh surprise/need score of a stored row under current M (E2).
function u43ScoreRow(M, se, qkCount, fixedMasks) {
  const fw1 = inSeqForward(M, se.x, new Float64Array(8), fixedMasks);
  const pv = u43Softmax4(Array.from(fw1.hvLog))[se.v];
  let bx = 0; for (let o = 1; o < 4; o++) if (fw1.hvLog[o] > fw1.hvLog[bx]) bx = o;
  const x2m = [9, 9, 9, 9, 9, 9, se.qk, se.k, bx, 8];
  const fw2 = inSeqForward(M, x2m, fw1.cNew, fixedMasks);
  const py = u43Softmax4(Array.from(inMeanLogits({ logitsK: fw2.logitsK })))[se.y];
  const s = (1 - pv) + (1 - py);
  const n = 1 + Math.log(1 + (qkCount.get(se.qk) || 0));
  return { s, n };
}
// One diet single draw with u36 per-c roll logic (E3), consuming dataRng identically.
function u43DietSingle(dataRng) {
  const roll = dataRng.int(4);
  if (roll === 2) {
    let e = null;
    for (let t = 0; t < 10; t++) {
      const ub = dataRng.int(2) === 0;
      const cand = ub ? inSeqGenShift(dataRng, 0) : inSeqGenShift(dataRng, null);
      e = cand;
      if (cand.qk !== cand.v) break;
    }
    return e;
  }
  const ub = dataRng.int(2) === 0;
  return ub ? inSeqGenShift(dataRng, 0) : inSeqGenShift(dataRng, null);
}
// M2 train: U36-D1 diet + 10% replay (E1/E2). arm g|s|r.
async function u43TrainM2(fs, log, seed, arm, t, P0, drvHash, h) {
  const B = 16, lam = 2.0, K = 5;
  const G0 = await globalThis.IntrinsicInit(fs);
  const replayRng = G0.makeRng(92000 + seed * 7919 + U43_M2_ARMS[arm] * 131);
  const store = []; const qkCount = new Map();
  const pushRow = (e) => {
    store.push(e); qkCount.set(e.qk, (qkCount.get(e.qk) || 0) + 1);
    if (store.length > 4000) { const old = store.shift(); const c = qkCount.get(old.qk) - 1; if (c <= 0) qkCount.delete(old.qk); else qkCount.set(old.qk, c); }
  };
  const steps = 800, t0 = Date.now(), curve = [];
  let replaySteps = 0, pickSurpSum = 0, pickSurpN = 0;
  for (let step = 0; step < steps; step++) {
    for (const p of t.params) p.g.fill(0);
    let lsum = 0;
    if (step % 10 === 9 && store.length >= 16) {
      replaySteps++;
      for (let b = 0; b < B; b++) {
        let pick = null, pickS = 0;
        if (arm === "r") {
          pick = store[replayRng.int(store.length)];
          pickS = 0;
        } else {
          let best = -1;
          for (let c = 0; c < 6; c++) {
            const cand = store[replayRng.int(store.length)];
            const { s, n } = u43ScoreRow(t.M, cand, qkCount, t.fixedMasks);
            const score = arm === "g" ? s * n : s;
            if (score > best) { best = score; pick = cand; pickS = s; }
          }
        }
        pickSurpSum += pickS; pickSurpN++;
        lsum += u43StaticSlot(t.M, pick, b, B, t.fixedMasks);
      }
    } else {
      for (let b = 0; b < B; b++) {
        const { e } = u36PickEpisode(t.M, t.dataRng, t.fixedMasks);
        pushRow(e);
        lsum += u43StaticSlot(t.M, e, b, B, t.fixedMasks);
      }
    }
    const meanW = new Float64Array(t.M.Wh[0].v.length);
    for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) meanW[i] += t.M.Wh[k].v[i] / K;
    for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) t.M.Wh[k].g[i] += lam * (t.M.Wh[k].v[i] - meanW[i]) / (B * t.M.H);
    let s = 0; for (const p of t.params) for (let i = 0; i < p.g.length; i++) s += p.g[i] * p.g[i];
    const n = Math.sqrt(s);
    if (n > 1.0) { const sc = 1.0 / n; for (const p of t.params) for (let i = 0; i < p.g.length; i++) p.g[i] *= sc; }
    t.opt.step(t.params);
    if (step % 100 === 0 || step === steps - 1) curve.push({ step, loss: +(lsum / B).toFixed(6) });
    if (step % 200 === 0) log("u43-m2-train " + arm + " s" + seed + " step " + step + "/800 loss=" + (lsum / B).toFixed(4) + " store=" + store.length);
  }
  const P = globalThis.u32SnapshotParams(t.M);
  return {
    spec: "self-u43-advanced-prereg", track: "U43-M2", module: "m2", arm, seed, steps,
    B: 16, lr: 5e-3, K: 5, H: 48, C: 6, auxW: 0.5, lam: 2.0,
    diet: "U36-D1 + 10% replay (steps %10==9, C=6 store-sample pick-best; E1/E2)",
    select: arm === "g" ? "top Gain×Need s*n" : arm === "s" ? "top |PE| s" : "random",
    verdict: "COMPLETE", stackHash: h.hex, stackFiles: h.perFile.map((f) => f.path), u43DriverHash: drvHash,
    wallMs: Date.now() - t0, curve, divCos: +inMeanCos(t.M).toFixed(4),
    replaySteps, storeFinal: store.length, meanPickSurp: pickSurpN ? +(pickSurpSum / pickSurpN).toFixed(4) : 0,
    P0, P,
  };
}
// M1 train: U36-D1 candidates + disagree selection (E3). arm l|h|u.
async function u43TrainM1(fs, log, seed, arm, t, P0, drvHash, h) {
  const B = 16, lam = 2.0, K = 5, C = 6;
  const steps = 800, t0 = Date.now(), curve = [];
  let disSum = 0, disN = 0;
  for (let step = 0; step < steps; step++) {
    for (const p of t.params) p.g.fill(0);
    let lsum = 0;
    for (let b = 0; b < B; b++) {
      const cands = [];
      for (let c = 0; c < C; c++) cands.push(u43DietSingle(t.dataRng));
      const ds = cands.map((e) => curVoteDisagree(inSeqForward(t.M, e.x, new Float64Array(8), t.fixedMasks).logitsK));
      const u = t.dataRng.int(C);
      let pi = u;
      if (arm === "l") { pi = 0; for (let c = 1; c < C; c++) if (ds[c] < ds[pi]) pi = c; }
      else if (arm === "h") { pi = 0; for (let c = 1; c < C; c++) if (ds[c] > ds[pi]) pi = c; }
      disSum += ds[pi]; disN++;
      lsum += u43StaticSlot(t.M, cands[pi], b, B, t.fixedMasks);
    }
    const meanW = new Float64Array(t.M.Wh[0].v.length);
    for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) meanW[i] += t.M.Wh[k].v[i] / K;
    for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) t.M.Wh[k].g[i] += lam * (t.M.Wh[k].v[i] - meanW[i]) / (B * t.M.H);
    let s = 0; for (const p of t.params) for (let i = 0; i < p.g.length; i++) s += p.g[i] * p.g[i];
    const n = Math.sqrt(s);
    if (n > 1.0) { const sc = 1.0 / n; for (const p of t.params) for (let i = 0; i < p.g.length; i++) p.g[i] *= sc; }
    t.opt.step(t.params);
    if (step % 100 === 0 || step === steps - 1) curve.push({ step, loss: +(lsum / B).toFixed(6) });
    if (step % 200 === 0) log("u43-m1-train " + arm + " s" + seed + " step " + step + "/800 loss=" + (lsum / B).toFixed(4));
  }
  const P = globalThis.u32SnapshotParams(t.M);
  return {
    spec: "self-u43-advanced-prereg", track: "U43-M1", module: "m1", arm, seed, steps,
    B: 16, lr: 5e-3, K: 5, H: 48, C: 6, auxW: 0.5, lam: 2.0,
    diet: "U36-D1 candidates + disagree selection (aligned draws; E3)",
    select: arm === "l" ? "pick-min disagree" : arm === "h" ? "pick-max disagree" : "uniform",
    verdict: "COMPLETE", stackHash: h.hex, stackFiles: h.perFile.map((f) => f.path), u43DriverHash: drvHash,
    wallMs: Date.now() - t0, curve, divCos: +inMeanCos(t.M).toFixed(4),
    meanDisagreePicked: +(disSum / disN).toFixed(4), P0, P,
  };
}
// ---------- M5/M3/M4/M6 trains (Turn-185 extension; E6-E10) ----------
function u43RampW(step) { return 0.2 + 1.6 * step / 799; }
// Weighted static slot (M5): every gradient scale + loss × w (E6).
function u43StaticSlotW(M, e, b, B, fixedMasks, w) {
  const K = 5, auxW = 0.5;
  const argmax4 = (a) => { let x = 0; for (let i = 1; i < 4; i++) if (a[i] > a[x]) x = i; return x; };
  const c0 = new Float64Array(8);
  const fw1 = inSeqForward(M, e.x, c0, fixedMasks);
  const ceHv = inCELossGrad(fw1.hvLog, e.v);
  const dHv = new Float64Array(4); for (let o = 0; o < 4; o++) dHv[o] = ceHv.d[o] * auxW * w / B;
  const vhat = argmax4(fw1.hvLog);
  const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
  const fw2 = inSeqForward(M, x2m, fw1.cNew, fixedMasks);
  const perHead1 = fw1.logitsK.map((lg, k) => {
    if ((b % K) !== k) return new Float64Array(4);
    const ce = inCELossGrad(lg, e.y); const d = new Float64Array(4);
    for (let o = 0; o < 4; o++) d[o] = ce.d[o] * 0.1 * K * w / B;
    return d;
  });
  const perHead2 = fw2.logitsK.map((lg, k) => {
    if ((b % K) !== k) return new Float64Array(4);
    const ce = inCELossGrad(lg, e.y); const d = new Float64Array(4);
    for (let o = 0; o < 4; o++) d[o] = ce.d[o] * 0.1 * K * w / B;
    return d;
  });
  const mean2 = inMeanLogits({ logitsK: fw2.logitsK });
  const ce2 = inCELossGrad(mean2, e.y);
  const dMean2 = new Float64Array(4); for (let o = 0; o < 4; o++) dMean2[o] = ce2.d[o] * w / B;
  const mean1 = inMeanLogits({ logitsK: fw1.logitsK });
  const ce1m = inCELossGrad(mean1, e.y);
  const dMean1 = new Float64Array(4); for (let o = 0; o < 4; o++) dMean1[o] = ce1m.d[o] * 0.3 * w / B;
  const dc = inSeqBackward(M, fw2, dMean2, perHead2, null, null, fixedMasks);
  inSeqBackward(M, fw1, dMean1, perHead1, dHv, dc, fixedMasks);
  return w * ce2.loss + auxW * w * ceHv.loss;
}
// M5 train: U36-D1 diet A + trajectory weight (E6). arm ramp|flat.
async function u43TrainM5(fs, log, seed, arm, t, P0, drvHash, h) {
  const B = 16, lam = 2.0, K = 5;
  const steps = 800, t0 = Date.now(), curve = [];
  for (let step = 0; step < steps; step++) {
    const w = arm === "ramp" ? u43RampW(step) : 1.0;
    for (const p of t.params) p.g.fill(0);
    let lsum = 0;
    for (let b = 0; b < B; b++) {
      const { e } = u36PickEpisode(t.M, t.dataRng, t.fixedMasks);
      lsum += u43StaticSlotW(t.M, e, b, B, t.fixedMasks, w);
    }
    const meanW = new Float64Array(t.M.Wh[0].v.length);
    for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) meanW[i] += t.M.Wh[k].v[i] / K;
    for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) t.M.Wh[k].g[i] += lam * (t.M.Wh[k].v[i] - meanW[i]) / (B * t.M.H);
    let s = 0; for (const p of t.params) for (let i = 0; i < p.g.length; i++) s += p.g[i] * p.g[i];
    const n = Math.sqrt(s);
    if (n > 1.0) { const sc = 1.0 / n; for (const p of t.params) for (let i = 0; i < p.g.length; i++) p.g[i] *= sc; }
    t.opt.step(t.params);
    if (step % 100 === 0 || step === steps - 1) curve.push({ step, loss: +(lsum / B).toFixed(6) });
    if (step % 200 === 0) log("u43-m5-train " + arm + " s" + seed + " step " + step + "/800 loss=" + (lsum / B).toFixed(4) + " w=" + w.toFixed(3));
  }
  const P = globalThis.u32SnapshotParams(t.M);
  return {
    spec: "self-u43-advanced-prereg", track: "U43-M5", module: "m5", arm, seed, steps,
    B: 16, lr: 5e-3, K: 5, H: 48, C: 6, auxW: 0.5, lam: 2.0,
    diet: "diet A = U36-D1 pick-max (shared)",
    weight: arm === "ramp" ? "RAMP w=0.2+1.6*step/799 (E6)" : "FLAT w=1.0",
    verdict: "COMPLETE", stackHash: h.hex, stackFiles: h.perFile.map((f) => f.path), u43DriverHash: drvHash,
    wallMs: Date.now() - t0, curve, divCos: +inMeanCos(t.M).toFixed(4), P0, P,
  };
}
// Heterogeneous 90/5/5 diet single (E8, amended E8a): singles only, no pick-max.
// E8a CONSTRUCTIVE PREFERENCE (filed, no bar change): base singles are ~75% qk!=v by
// chance, so a plain 90/5/5 split would be vacuous (branches identically distributed).
// Familiar branch (90%) therefore rejection-samples qk∈{0,1} (≤10 tries, fallback last)
// so familiar queries recur ~9:1 (genuine heterogeneous strengths for SFMA); OOD (5%)
// enforces qk!=v; uniform (5%) is a plain single. Shared by all arms (aligned draws).
function u43HetDietSingle(dataRng) {
  const r = dataRng.int(20);
  if (r === 18) {
    let e = null;
    for (let tt = 0; tt < 10; tt++) {
      const ub = dataRng.int(2) === 0;
      const cand = ub ? inSeqGenShift(dataRng, 0) : inSeqGenShift(dataRng, null);
      e = cand;
      if (cand.qk !== cand.v) break;
    }
    return e;
  }
  if (r < 18) {
    let e = null;
    for (let tt = 0; tt < 10; tt++) {
      const ub = dataRng.int(2) === 0;
      const cand = ub ? inSeqGenShift(dataRng, 0) : inSeqGenShift(dataRng, null);
      e = cand;
      if (cand.qk === 0 || cand.qk === 1) break;
    }
    return e;
  }
  const ub = dataRng.int(2) === 0;
  return ub ? inSeqGenShift(dataRng, 0) : inSeqGenShift(dataRng, null);
}
// Fresh surprise/need/error stats of a stored row under current M (E8).
function u43RowStats(M, se, qkCount, fixedMasks) {
  const fw1 = inSeqForward(M, se.x, new Float64Array(8), fixedMasks);
  const pv = u43Softmax4(Array.from(fw1.hvLog))[se.v];
  let bx = 0; for (let o = 1; o < 4; o++) if (fw1.hvLog[o] > fw1.hvLog[bx]) bx = o;
  const x2m = [9, 9, 9, 9, 9, 9, se.qk, se.k, bx, 8];
  const fw2 = inSeqForward(M, x2m, fw1.cNew, fixedMasks);
  const m2 = Array.from(inMeanLogits({ logitsK: fw2.logitsK }));
  const py = u43Softmax4(m2)[se.y];
  let ba = 0; for (let o = 1; o < 4; o++) if (m2[o] > m2[ba]) ba = o;
  return { s: (1 - pv) + (1 - py), n: 1 + Math.log(1 + (qkCount.get(se.qk) || 0)), err: ba === se.y ? 0 : 1 };
}
// M3 train: hetero diet + SFMA/RI replay vs NR (E8). arm sfma|ri|nr.
async function u43TrainM3(fs, log, seed, arm, t, P0, drvHash, h) {
  const B = 16, lam = 2.0, K = 5;
  const G0 = await globalThis.IntrinsicInit(fs);
  const replayRng = G0.makeRng(92000 + seed * 7919 + U43_M3_ARMS[arm] * 131);
  const store = []; const qkCount = new Map(); const lastPick = new Map();
  const pushRow = (e) => {
    store.push(e); qkCount.set(e.qk, (qkCount.get(e.qk) || 0) + 1);
    if (store.length > 4000) { const old = store.shift(); const c = qkCount.get(old.qk) - 1; if (c <= 0) qkCount.delete(old.qk); else qkCount.set(old.qk, c); }
  };
  const steps = 800, t0 = Date.now(), curve = [];
  const dietWin = []; let replaySteps = 0, modeRev = 0, modeDef = 0, pickS = 0, pickN = 0;
  for (let step = 0; step < steps; step++) {
    for (const p of t.params) p.g.fill(0);
    let lsum = 0;
    const isReplay = step % 10 === 9 && store.length >= 16 && arm !== "nr";
    if (isReplay) {
      replaySteps++;
      const avg = dietWin.length ? dietWin.reduce((a, b) => a + b, 0) / dietWin.length : 2.0;
      const reverse = avg > 1.8;
      if (reverse) modeRev++; else modeDef++;
      for (let b = 0; b < B; b++) {
        const ctx = u43HetDietSingle(t.dataRng); pushRow(ctx);
        let pick = null;
        if (arm === "ri") {
          for (let tr = 0; tr < 10; tr++) {
            const cand = store[replayRng.int(store.length)];
            const lp = lastPick.get(cand);
            if (lp === undefined || step - lp > 50) { pick = cand; break; }
          }
          if (!pick) pick = store[replayRng.int(store.length)];
        } else {
          let best = -1;
          for (let c = 0; c < 6; c++) {
            const cand = store[replayRng.int(store.length)];
            const lp = lastPick.get(cand);
            if (lp !== undefined && step - lp <= 50) continue;
            const st = u43RowStats(t.M, cand, qkCount, t.fixedMasks);
            const sim = cand.qk === ctx.qk ? 1.0 : 0.3;
            const rating = reverse ? (0.3 + st.s) * st.n : st.n * sim;
            if (rating > best) { best = rating; pick = cand; pickS += st.s; pickN++; }
          }
          if (!pick) pick = store[replayRng.int(store.length)];
        }
        lastPick.set(pick, step);
        lsum += u43StaticSlot(t.M, pick, b, B, t.fixedMasks);
      }
    } else {
      for (let b = 0; b < B; b++) {
        const e = u43HetDietSingle(t.dataRng);
        pushRow(e);
        lsum += u43StaticSlot(t.M, e, b, B, t.fixedMasks);
      }
      dietWin.push(lsum / B); if (dietWin.length > 20) dietWin.shift();
    }
    const meanW = new Float64Array(t.M.Wh[0].v.length);
    for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) meanW[i] += t.M.Wh[k].v[i] / K;
    for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) t.M.Wh[k].g[i] += lam * (t.M.Wh[k].v[i] - meanW[i]) / (B * t.M.H);
    let s = 0; for (const p of t.params) for (let i = 0; i < p.g.length; i++) s += p.g[i] * p.g[i];
    const n = Math.sqrt(s);
    if (n > 1.0) { const sc = 1.0 / n; for (const p of t.params) for (let i = 0; i < p.g.length; i++) p.g[i] *= sc; }
    t.opt.step(t.params);
    if (step % 100 === 0 || step === steps - 1) curve.push({ step, loss: +(lsum / B).toFixed(6) });
    if (step % 200 === 0) log("u43-m3-train " + arm + " s" + seed + " step " + step + "/800 loss=" + (lsum / B).toFixed(4) + " store=" + store.length);
  }
  const P = globalThis.u32SnapshotParams(t.M);
  return {
    spec: "self-u43-advanced-prereg", track: "U43-M3", module: "m3", arm, seed, steps,
    B: 16, lr: 5e-3, K: 5, H: 48, C: 6, auxW: 0.5, lam: 2.0,
    diet: "hetero 90/5/5 singles, no pick-max (E8)",
    select: arm === "sfma" ? "SFMA strength×sim×IoR + TD-mode switch" : arm === "ri" ? "random + IoR-only" : "no replay",
    verdict: "COMPLETE", stackHash: h.hex, stackFiles: h.perFile.map((f) => f.path), u43DriverHash: drvHash,
    wallMs: Date.now() - t0, curve, divCos: +inMeanCos(t.M).toFixed(4),
    replaySteps, storeFinal: store.length, modeReverse: modeRev, modeDefault: modeDef,
    meanPickSurp: pickN ? +(pickS / pickN).toFixed(4) : 0, P0, P,
  };
}
// M4 train: staged plasticity on U36-D1 (E9). arm staged|joint|lindec.
async function u43TrainM4(fs, log, seed, arm, t, P0, drvHash, h) {
  const B = 16, lam = 2.0, K = 5;
  const trunkOf = (M) => [M.E, M.W1, M.b1, M.Wf, M.bf, M.Wc, M.bc];
  const scorerOf = (M) => [M.Hv, M.bv].concat(M.Wh, M.bh);
  const steps = 800, t0 = Date.now(), curve = [];
  for (let step = 0; step < steps; step++) {
    for (const p of t.params) p.g.fill(0);
    let lsum = 0;
    for (let b = 0; b < B; b++) {
      const { e } = u36PickEpisode(t.M, t.dataRng, t.fixedMasks);
      lsum += u43StaticSlot(t.M, e, b, B, t.fixedMasks);
    }
    const meanW = new Float64Array(t.M.Wh[0].v.length);
    for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) meanW[i] += t.M.Wh[k].v[i] / K;
    for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) t.M.Wh[k].g[i] += lam * (t.M.Wh[k].v[i] - meanW[i]) / (B * t.M.H);
    if (arm === "staged") {
      if (step < 400) { for (const p of scorerOf(t.M)) for (let i = 0; i < p.g.length; i++) p.g[i] *= 0.1; }
      else { for (const p of trunkOf(t.M)) p.g.fill(0); }
    } else if (arm === "lindec") {
      const w = 1 - step / 800;
      for (const p of t.params) for (let i = 0; i < p.g.length; i++) p.g[i] *= w;
    }
    let s = 0; for (const p of t.params) for (let i = 0; i < p.g.length; i++) s += p.g[i] * p.g[i];
    const n = Math.sqrt(s);
    if (n > 1.0) { const sc = 1.0 / n; for (const p of t.params) for (let i = 0; i < p.g.length; i++) p.g[i] *= sc; }
    t.opt.step(t.params);
    if (step % 100 === 0 || step === steps - 1) curve.push({ step, loss: +(lsum / B).toFixed(6) });
    if (step % 200 === 0) log("u43-m4-train " + arm + " s" + seed + " step " + step + "/800 loss=" + (lsum / B).toFixed(4));
  }
  const P = globalThis.u32SnapshotParams(t.M);
  return {
    spec: "self-u43-advanced-prereg", track: "U43-M4", module: "m4", arm, seed, steps,
    B: 16, lr: 5e-3, K: 5, H: 48, C: 6, auxW: 0.5, lam: 2.0,
    diet: "U36-D1 pick-max (shared)",
    schedule: arm === "staged" ? "A trunk1.0/scorer0.1 -> B trunk0/scorer1.0 (E9)" : arm === "joint" ? "all 1.0 (U34-style)" : "linear decay all (E9)",
    verdict: "COMPLETE", stackHash: h.hex, stackFiles: h.perFile.map((f) => f.path), u43DriverHash: drvHash,
    wallMs: Date.now() - t0, curve, divCos: +inMeanCos(t.M).toFixed(4), P0, P,
  };
}
// M6 goal helpers (E10): token slot x2m[0]; bind k==0 -> tok 4/idx 0, else 5/1.
function u43GoalOf(e) { return e.k === 0 ? { tok: 4, idx: 0 } : { tok: 5, idx: 1 }; }
function u43GoalFlip(tok) { return tok === 4 ? 5 : 4; }
// M6 slot: static body with goal-token input + optional probe train (stop-gradient at probe).
function u43M6Slot(M, e, b, B, fixedMasks, tok, goal, gIdx) {
  const K = 5, auxW = 0.5;
  const argmax4 = (a) => { let x = 0; for (let i = 1; i < 4; i++) if (a[i] > a[x]) x = i; return x; };
  const c0 = new Float64Array(8);
  const fw1 = inSeqForward(M, e.x, c0, fixedMasks);
  const ceHv = inCELossGrad(fw1.hvLog, e.v);
  const dHv = new Float64Array(4); for (let o = 0; o < 4; o++) dHv[o] = ceHv.d[o] * auxW / B;
  const vhat = argmax4(fw1.hvLog);
  const x2m = [tok, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
  const fw2 = inSeqForward(M, x2m, fw1.cNew, fixedMasks);
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
  let loss = ce2.loss + auxW * ceHv.loss;
  if (goal) {
    const H = M.H;
    const gl = new Float64Array(2);
    for (let o = 0; o < 2; o++) { let s = goal.gb.v[o]; for (let i = 0; i < H; i++) s += goal.Gw.v[o * H + i] * fw1.h[i]; gl[o] = s; }
    const ceG = inCELossGrad(gl, gIdx);
    for (let o = 0; o < 2; o++) {
      const d = ceG.d[o] * 0.5 / B;
      goal.gb.g[o] += d;
      for (let i = 0; i < H; i++) goal.Gw.g[o * H + i] += d * fw1.h[i];
    }
    loss += 0.5 * ceG.loss;
  }
  const dc = inSeqBackward(M, fw2, dMean2, perHead2, null, null, fixedMasks);
  inSeqBackward(M, fw1, dMean1, perHead1, dHv, dc, fixedMasks);
  return loss;
}
// M6 train: goal-token conditioning + P probe (E10). arm p|e|b.
async function u43TrainM6(fs, log, seed, arm, t, P0, drvHash, h) {
  const B = 16, lam = 2.0, K = 5;
  let Gw = null, gb = null, params = t.params, Gp0 = null;
  if (arm === "p") {
    const grng = t.G.makeRng(96000 + seed * 7919 + U43_M6_ARMS.p * 131);
    Gw = inParam(grng, t.M.H * 2, t.M.H); gb = inParam(grng, 2, t.M.H);
    params = t.params.concat([Gw, gb]);
    Gp0 = { Gw: Array.from(Gw.v), gb: Array.from(gb.v) };
  }
  const steps = 800, t0 = Date.now(), curve = [];
  let goalAcc = 0, goalN = 0;
  for (let step = 0; step < steps; step++) {
    for (const p of params) p.g.fill(0);
    let lsum = 0;
    for (let b = 0; b < B; b++) {
      const { e } = u36PickEpisode(t.M, t.dataRng, t.fixedMasks);
      const g = u43GoalOf(e);
      const tok = arm === "b" ? 9 : g.tok;
      lsum += u43M6Slot(t.M, e, b, B, t.fixedMasks, tok, arm === "p" ? { Gw, gb } : null, g.idx);
    }
    const meanW = new Float64Array(t.M.Wh[0].v.length);
    for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) meanW[i] += t.M.Wh[k].v[i] / K;
    for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) t.M.Wh[k].g[i] += lam * (t.M.Wh[k].v[i] - meanW[i]) / (B * t.M.H);
    let s = 0; for (const p of params) for (let i = 0; i < p.g.length; i++) s += p.g[i] * p.g[i];
    const n = Math.sqrt(s);
    if (n > 1.0) { const sc = 1.0 / n; for (const p of params) for (let i = 0; i < p.g.length; i++) p.g[i] *= sc; }
    t.opt.step(params);
    if (step % 100 === 0 || step === steps - 1) curve.push({ step, loss: +(lsum / B).toFixed(6) });
    if (step % 200 === 0) log("u43-m6-train " + arm + " s" + seed + " step " + step + "/800 loss=" + (lsum / B).toFixed(4));
  }
  const P = globalThis.u32SnapshotParams(t.M);
  const Gp = Gw ? { Gw: Array.from(Gw.v), gb: Array.from(gb.v) } : null;
  return {
    spec: "self-u43-advanced-prereg", track: "U43-M6", module: "m6", arm, seed, steps,
    B: 16, lr: 5e-3, K: 5, H: 48, C: 6, auxW: 0.5, lam: 2.0,
    diet: "U36-D1 pick-max (shared)",
    goals: arm === "p" ? "correct token in + probe trained (stop-grad, E10)" : arm === "e" ? "correct token in, no probe" : "no tokens",
    verdict: "COMPLETE", stackHash: h.hex, stackFiles: h.perFile.map((f) => f.path), u43DriverHash: drvHash,
    wallMs: Date.now() - t0, curve, divCos: +inMeanCos(t.M).toFixed(4), goalAcc: null, P0, P, Gp0, Gp,
  };
}
globalThis.runU43Train = async function (fs, log, opts) {
  const { module, seed, arm } = opts;
  const U43_ARMS = { m2: U43_M2_ARMS, m1: U43_M1_ARMS, m5: U43_M5_ARMS, m3: U43_M3_ARMS, m4: U43_M4_ARMS, m6: U43_M6_ARMS };
  if (!(module in U43_ARMS)) throw new Error("module must be m2|m1|m5|m3|m4|m6");
  if (!(arm in U43_ARMS[module])) throw new Error(module + " arm invalid: " + arm);
  const ledgerPath = u43TrainPath(module, seed, arm);
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  const h = await globalThis.u33StackHash(fs);
  if (h.hex !== U43_EXPECT_STACK) throw new Error("U43-PIN HALT: stack drift " + h.hex.slice(0, 16));
  const drvSrc = await fs.readTextFile("src/evidence/decomp/newai-selfu43-driver.js");
  const drvHash = await u32Sha256Hex(drvSrc);
  const t = await globalThis.u32FreshStack(fs, seed);
  const P0 = globalThis.u32SnapshotParams(t.M);
  const body = module === "m2"
    ? await u43TrainM2(fs, log, seed, arm, t, P0, drvHash, h)
    : module === "m1"
      ? await u43TrainM1(fs, log, seed, arm, t, P0, drvHash, h)
      : module === "m5"
        ? await u43TrainM5(fs, log, seed, arm, t, P0, drvHash, h)
        : module === "m3"
          ? await u43TrainM3(fs, log, seed, arm, t, P0, drvHash, h)
          : module === "m4"
            ? await u43TrainM4(fs, log, seed, arm, t, P0, drvHash, h)
            : await u43TrainM6(fs, log, seed, arm, t, P0, drvHash, h);
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("u43-train " + module + " " + arm + " s" + seed + " COMPLETE loss0=" + body.curve[0].loss + " lossN=" + body.curve[body.curve.length - 1].loss);
  return body;
};
// Shared paired eval (u34 body verbatim, u43 paths).
globalThis.runU43Eval = async function (fs, log, opts) {
  const { module, seed, arm } = opts;
  const trainPath = u43TrainPath(module, seed, arm), evalPath = u43EvalPath(module, seed, arm);
  if (!opts.force) { try { const prev = JSON.parse(await fs.readTextFile(evalPath)); if (prev && prev.verdict === "COMPLETE") { log(evalPath + " exists, skip"); return prev; } } catch (e) {} }
  const G = await globalThis.IntrinsicInit(fs);
  const tr = JSON.parse(await fs.readTextFile(trainPath));
  if (tr.verdict !== "COMPLETE") throw new Error("train ledger missing " + trainPath);
  const cur = await globalThis.u33StackHash(fs);
  if (cur.hex !== tr.stackHash) throw new Error("U43-PIN HALT: stack drift since train " + trainPath);
  const M = inSeqMakeModel(G.makeRng(1));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(M.E, tr.P.E); load(M.W1, tr.P.W1); load(M.b1, tr.P.b1);
  load(M.Wf, tr.P.Wf); load(M.bf, tr.P.bf); load(M.Wc, tr.P.Wc); load(M.bc, tr.P.bc);
  for (let k = 0; k < 5; k++) { load(M.Wh[k], tr.P.Wh[k]); load(M.bh[k], tr.P.bh[k]); }
  load(M.Hv, tr.P.Hv); load(M.bv, tr.P.bv);
  let goalHead = null;
  if (module === "m6" && arm === "p") {
    if (!tr.Gp) throw new Error("m6-p train ledger missing Gp " + trainPath);
    goalHead = { Gw: Float64Array.from(tr.Gp.Gw), gb: Float64Array.from(tr.Gp.gb) };
  }
  const emitGoal = (fw1) => {
    let s0 = goalHead.gb[0], s1 = goalHead.gb[1];
    for (let i = 0; i < M.H; i++) { s0 += goalHead.Gw[i] * fw1.h[i]; s1 += goalHead.Gw[M.H + i] * fw1.h[i]; }
    return s1 > s0 ? { tok: 5, idx: 1 } : { tok: 4, idx: 0 };
  };
  let evalMasks = null; { const fr = G.makeRng(91000 + seed); evalMasks = []; for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr.int(10) < 5 ? 2 : 0; evalMasks.push(m); } }
  const srng = G.makeRng(52500 + seed), frng = G.makeRng(52400 + seed);
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  const N = 200;
  let scr = 0, two = 0, orc = 0, brk = 0, brkN = 0;
  for (let i = 0; i < N; i++) {
    const e = inSeqGenShift(srng, null);
    const fw1 = inSeqForward(M, e.x, new Float64Array(8), evalMasks);
    const vhat = argmax4(fw1.hvLog);
    if (vhat === e.v) scr++;
    const emit = (module === "m6" && arm === "p") ? emitGoal(fw1) : null;
    const tok = emit ? emit.tok : 9;
    const x2m = [tok, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
    const fw2 = inSeqForward(M, x2m, fw1.cNew, evalMasks);
    const act = argmax4(inMeanLogits({ logitsK: fw2.logitsK }));
    if (act === e.y) two++;
    if (emit) {
      const xf = [u43GoalFlip(tok), 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
      const actF = argmax4(inMeanLogits({ logitsK: inSeqForward(M, xf, fw1.cNew, evalMasks).logitsK }));
      if (actF !== act) brk++;
      brkN++;
    }
    const xo = [tok, 9, 9, 9, 9, 9, e.qk, e.k, e.v, 8];
    // REPAIR Turn-184: u34 line-173 typo inherited here (missing .logitsK passed the fw
    // OBJECT into inMeanLogits, which then read .length=undefined and returned zeros, so
    // orc always predicted class 0 = y==0 rate per seed). Fixed to .logitsK (as in u41:302
    // and u34:178-fwd). two/scr/fwd lines were always correct. Filed, not silent.
    if (argmax4(inMeanLogits({ logitsK: inSeqForward(M, xo, fw1.cNew, evalMasks).logitsK })) === e.y) orc++;
  }
  let fF = 0;
  for (let i = 0; i < N; i++) {
    const e = inSeqGenShift(frng, 0);
    if (argmax4(inMeanLogits({ logitsK: inSeqForward(M, e.x, new Float64Array(8), evalMasks).logitsK })) === e.y) fF++;
  }
  const U43_TRACK = { m2: "U43-M2", m1: "U43-M1", m5: "U43-M5", m3: "U43-M3", m4: "U43-M4", m6: "U43-M6" };
  const body = {
    spec: "self-u43-advanced-prereg", track: U43_TRACK[module] || module,
    module, arm, seed, steps: 800, verdict: "COMPLETE", n: N, frozenTest: true,
    evalOf: trainPath, stackHash: cur.hex,
    tokenMode: module === "m6" ? (arm === "p" ? "emit" : arm === "e" ? "omitted" : "none") : "n/a",
    breakRate: brkN ? +(brk / brkN).toFixed(4) : null,
    accScratch: +(scr / N).toFixed(4), accTwo: +(two / N).toFixed(4),
    accOracle: +(orc / N).toFixed(4), accFwd: +(fF / N).toFixed(4),
  };
  await fs.writeTextFile(evalPath, JSON.stringify(body));
  log("u43-eval " + module + " " + arm + " s" + seed + " scr=" + body.accScratch + " two=" + body.accTwo + " orc=" + body.accOracle);
  return body;
};
// M5 transfer eval (E7/E11): diet B yB=(y+2)%4, no retraining, paired across arms.
globalThis.runU43TransferEval = async function (fs, log, opts) {
  const { seed, arm } = opts;
  if (!(arm in U43_M5_ARMS)) throw new Error("transfer arm must be ramp|flat");
  const trainPath = u43TrainPath("m5", seed, arm), evalPath = u43TransferPath(seed, arm);
  if (!opts.force) { try { const prev = JSON.parse(await fs.readTextFile(evalPath)); if (prev && prev.verdict === "COMPLETE") { log(evalPath + " exists, skip"); return prev; } } catch (e) {} }
  const G = await globalThis.IntrinsicInit(fs);
  const tr = JSON.parse(await fs.readTextFile(trainPath));
  if (tr.verdict !== "COMPLETE") throw new Error("train ledger missing " + trainPath);
  const cur = await globalThis.u33StackHash(fs);
  if (cur.hex !== tr.stackHash) throw new Error("U43-PIN HALT: stack drift since train " + trainPath);
  const M = inSeqMakeModel(G.makeRng(1));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(M.E, tr.P.E); load(M.W1, tr.P.W1); load(M.b1, tr.P.b1);
  load(M.Wf, tr.P.Wf); load(M.bf, tr.P.bf); load(M.Wc, tr.P.Wc); load(M.bc, tr.P.bc);
  for (let k = 0; k < 5; k++) { load(M.Wh[k], tr.P.Wh[k]); load(M.bh[k], tr.P.bh[k]); }
  load(M.Hv, tr.P.Hv); load(M.bv, tr.P.bv);
  let evalMasks = null; { const fr = G.makeRng(91000 + seed); evalMasks = []; for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr.int(10) < 5 ? 2 : 0; evalMasks.push(m); } }
  const brng = G.makeRng(53500 + seed);
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  const N = 200;
  let scr = 0, two = 0, orc = 0;
  for (let i = 0; i < N; i++) {
    const e = inSeqGenShift(brng, null);
    const yB = (e.y + 2) % 4;
    const fw1 = inSeqForward(M, e.x, new Float64Array(8), evalMasks);
    const vhat = argmax4(fw1.hvLog);
    if (vhat === e.v) scr++;
    const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
    if (argmax4(inMeanLogits({ logitsK: inSeqForward(M, x2m, fw1.cNew, evalMasks).logitsK })) === yB) two++;
    const xo = [9, 9, 9, 9, 9, 9, e.qk, e.k, e.v, 8];
    if (argmax4(inMeanLogits({ logitsK: inSeqForward(M, xo, fw1.cNew, evalMasks).logitsK })) === yB) orc++;
  }
  const body = {
    spec: "self-u43-advanced-prereg", track: "U43-M5-transfer", module: "m5", arm, seed,
    steps: 800, verdict: "COMPLETE", n: N, frozenTest: true, dietB: "yB=(y+2)%4, no retraining (E7)",
    evalOf: trainPath, stackHash: cur.hex,
    accScratchB: +(scr / N).toFixed(4), accTwoB: +(two / N).toFixed(4), accOracleB: +(orc / N).toFixed(4),
  };
  await fs.writeTextFile(evalPath, JSON.stringify(body));
  log("u43-transfer m5 " + arm + " s" + seed + " twoB=" + body.accTwoB + " orcB=" + body.accOracleB);
  return body;
};
// Module verdicts (bars per prereg v1.1 + E5 floor guard + E11 deltas).
globalThis.runU43Verdict = async function (fs, log, opts) {
  const { module } = opts;
  const U43_VARMS = { m2: ["g", "s", "r"], m1: ["l", "h", "u"], m5: ["ramp", "flat"], m3: ["sfma", "ri", "nr"], m4: ["staged", "joint", "lindec"], m6: ["p", "e", "b"] };
  const U43_VTRACK = { m2: "U43-M2", m1: "U43-M1", m5: "U43-M5", m3: "U43-M3", m4: "U43-M4", m6: "U43-M6" };
  const arms = U43_VARMS[module];
  if (!arms) throw new Error("module must be m2|m1|m5|m3|m4|m6");
  const T = {}, E = {}, X = {};
  for (const seed of [0, 1, 2]) for (const arm of arms) {
    T[seed + arm] = JSON.parse(await fs.readTextFile(u43TrainPath(module, seed, arm)));
    E[seed + arm] = JSON.parse(await fs.readTextFile(u43EvalPath(module, seed, arm)));
    if (module === "m5") X[seed + arm] = JSON.parse(await fs.readTextFile(u43TransferPath(seed, arm)));
  }
  const pin = [0, 1, 2].every((s) => arms.every((a) => T[s + a].stackHash === U43_EXPECT_STACK && E[s + a].stackHash === U43_EXPECT_STACK));
  const pinX = module === "m5" ? [0, 1, 2].every((s) => arms.every((a) => X[s + a].stackHash === U43_EXPECT_STACK)) : true;
  const pinAll = pin && pinX;
  const rows = [0, 1, 2].map((s) => {
    const r = { seed: s };
    for (const a of arms) {
      r[a] = { scr: E[s + a].accScratch, two: E[s + a].accTwo, orc: E[s + a].accOracle };
      if (module === "m5") r[a].twoB = X[s + a].accTwoB;
      if (module === "m6") r[a].brk = E[s + a].breakRate;
    }
    return r;
  });
  let verdict = "", detail = "";
  if (!pinAll) { verdict = "PIN-FAIL"; detail = "stack drift"; }
  else if (module === "m2") {
    const win = rows.map((r) => r.g.two);
    const floorBad = win.filter((v) => v < 0.45).length;
    const dGS = rows.map((r) => +(r.g.two - r.s.two).toFixed(4));
    const n = dGS.filter((d) => d >= 0.03).length;
    for (const r of rows) log("u43-m2 s" + r.seed + " g=" + r.g.two + " s=" + r.s.two + " r=" + r.r.two + " dGS=" + (r.g.two - r.s.two).toFixed(4));
    if (floorBad >= 2) { verdict = "INCONCLUSIVE"; detail = "winner below floor on " + floorBad + "/3"; }
    else if (n >= 2) { verdict = "ADVANCE"; detail = "G≥S+0.03 on " + n + "/3 — ADVANCE replay program"; }
    else { verdict = "DEAD"; detail = "G≥S+0.03 on " + n + "/3 — GAIN==SURPRISE confirmed"; }
  } else if (module === "m1") {
    const win = rows.map((r) => r.l.two);
    const floorBad = win.filter((v) => v < 0.45).length;
    const dLU = rows.map((r) => +(r.l.two - r.u.two).toFixed(4));
    const nLU = dLU.filter((d) => d >= 0.03).length;
    const nHL = rows.filter((r) => r.h.two >= r.l.two).length;
    const spread = rows.map((r) => Math.max(r.l.two, r.h.two, r.u.two) - Math.min(r.l.two, r.h.two, r.u.two));
    const nClose = spread.filter((v) => v <= 0.03).length;
    for (const r of rows) log("u43-m1 s" + r.seed + " l=" + r.l.two + " h=" + r.h.two + " u=" + r.u.two + " dLU=" + (r.l.two - r.u.two).toFixed(4));
    if (floorBad >= 2) { verdict = "INCONCLUSIVE"; detail = "winner below floor on " + floorBad + "/3"; }
    else if (nLU >= 2) { verdict = "ADVANCE"; detail = "L≥U+0.03 on " + nLU + "/3 — direction CONFIRMED"; }
    else if (nHL >= 2) { verdict = "DEAD"; detail = "H≥L on " + nHL + "/3 — INVERTED-INVERTED"; }
    else { verdict = "DEAD"; detail = "L≈U≈H (close " + nClose + "/3) — bandit family DEAD"; }
  } else if (module === "m5") {
    const win = rows.map((r) => r.ramp.two);
    const floorBad = win.filter((v) => v < 0.45).length;
    const dA = rows.map((r) => +(r.ramp.two - r.flat.two).toFixed(4));
    const nA = dA.filter((d) => d >= 0.03).length;
    const dB = rows.map((r) => +(r.ramp.twoB - r.flat.twoB).toFixed(4));
    const nB = dB.filter((d) => d >= 0).length;
    for (const r of rows) log("u43-m5 s" + r.seed + " ramp=" + r.ramp.two + " flat=" + r.flat.two + " dA=" + (r.ramp.two - r.flat.two).toFixed(4) + " rampB=" + r.ramp.twoB + " flatB=" + r.flat.twoB + " dB=" + (r.ramp.twoB - r.flat.twoB).toFixed(4));
    if (floorBad >= 2) { verdict = "INCONCLUSIVE"; detail = "winner below floor on " + floorBad + "/3"; }
    else if (nA >= 2 && nB >= 2) { verdict = "ADVANCE"; detail = "RAMP≥FLAT+0.03 A on " + nA + "/3 AND transfer holds " + nB + "/3 — ADVANCE trajectory program"; }
    else if (nA >= 2) { verdict = "DEAD"; detail = "RAMP wins A (" + nA + "/3) but fails B (" + nB + "/3) — family-specific heuristic"; }
    else { verdict = "DEAD"; detail = "no A win (" + nA + "/3)"; }
  } else if (module === "m3") {
    const win = rows.map((r) => r.sfma.two);
    const floorBad = win.filter((v) => v < 0.45).length;
    const dSR = rows.map((r) => +(r.sfma.two - r.ri.two).toFixed(4));
    const nSR = dSR.filter((d) => d >= 0.03).length;
    const gapSN = rows.map((r) => Math.abs(r.sfma.two - r.nr.two));
    const nClose = gapSN.filter((v) => v <= 0.03).length;
    for (const r of rows) log("u43-m3 s" + r.seed + " sfma=" + r.sfma.two + " ri=" + r.ri.two + " nr=" + r.nr.two + " dSR=" + (r.sfma.two - r.ri.two).toFixed(4));
    if (floorBad >= 2) { verdict = "INCONCLUSIVE"; detail = "winner below floor on " + floorBad + "/3"; }
    else if (nClose >= 2) { verdict = "DEAD"; detail = "SFMA≈NR (close " + nClose + "/3) — substrate cannot use replay"; }
    else if (nSR >= 2) { verdict = "ADVANCE"; detail = "SFMA≥RI+0.03 on " + nSR + "/3 — ADVANCE replay program"; }
    else { verdict = "DEAD"; detail = "SFMA≥RI+0.03 on " + nSR + "/3 — selection vars dead weight"; }
  } else if (module === "m4") {
    const win = rows.map((r) => r.staged.two);
    const floorBad = win.filter((v) => v < 0.45).length;
    const dSJ = rows.map((r) => +(r.staged.two - r.joint.two).toFixed(4));
    const dSL = rows.map((r) => +(r.staged.two - r.lindec.two).toFixed(4));
    const nSJ = dSJ.filter((d) => d >= 0.03).length;
    const nSL = dSL.filter((d) => d >= 0.03).length;
    const nLJ = rows.filter((r) => r.lindec.two >= r.staged.two).length;
    const nJJ = rows.filter((r) => r.joint.two >= r.staged.two).length;
    for (const r of rows) log("u43-m4 s" + r.seed + " staged=" + r.staged.two + " joint=" + r.joint.two + " lindec=" + r.lindec.two);
    if (floorBad >= 2) { verdict = "INCONCLUSIVE"; detail = "winner below floor on " + floorBad + "/3"; }
    else if (nSJ >= 2 && nSL >= 2) { verdict = "ADVANCE"; detail = "STAGED>JOINT " + nSJ + "/3 AND >LINDEC " + nSL + "/3 — ADVANCE staged program"; }
    else if (nLJ >= 2) { verdict = "DEAD"; detail = "LINDEC≥STAGED on " + nLJ + "/3 — critical-period narrative REJECTED"; }
    else if (nJJ >= 2) { verdict = "DEAD"; detail = "JOINT≥STAGED on " + nJJ + "/3 — staging useless"; }
    else { verdict = "DEAD"; detail = "split (SJ " + nSJ + "/3, SL " + nSL + "/3) — no quorum"; }
  } else if (module === "m6") {
    const win = rows.map((r) => r.p.two);
    const floorBad = win.filter((v) => v < 0.45).length;
    const dPE = rows.map((r) => +(r.p.two - r.e.two).toFixed(4));
    const dEB = rows.map((r) => +(r.e.two - r.b.two).toFixed(4));
    const nPE = dPE.filter((d) => d >= 0.03).length;
    const nEB = dEB.filter((d) => d >= 0.03).length;
    const nPEclose = rows.filter((r) => Math.abs(r.p.two - r.e.two) <= 0.03).length;
    const nEBclose = rows.filter((r) => Math.abs(r.e.two - r.b.two) <= 0.03).length;
    const nBrk = rows.filter((r) => r.p.brk !== null && r.p.brk >= 0.80).length;
    for (const r of rows) log("u43-m6 s" + r.seed + " p=" + r.p.two + " e=" + r.e.two + " b=" + r.b.two + " brk=" + r.p.brk);
    if (floorBad >= 2) { verdict = "INCONCLUSIVE"; detail = "winner below floor on " + floorBad + "/3"; }
    else if (nPE >= 2 && nEB >= 2 && nBrk >= 2) { verdict = "ADVANCE"; detail = "P>E " + nPE + "/3 AND E>B " + nEB + "/3 AND break " + nBrk + "/3 — ADVANCE productive program"; }
    else if (nPEclose >= 2) { verdict = "DEAD"; detail = "P≈E (close " + nPEclose + "/3, break " + nBrk + "/3) — token decorative"; }
    else if (nEBclose >= 2) { verdict = "DEAD"; detail = "E≈B (close " + nEBclose + "/3) — discrete space not the lever"; }
    else { verdict = "DEAD"; detail = "mixed (PE " + nPE + "/3, EB " + nEB + "/3, break " + nBrk + "/3) — no quorum"; }
  }
  const body = { spec: "self-u43-advanced-prereg", track: U43_VTRACK[module], module, verdict, detail, pin: pinAll, rows };
  await fs.writeTextFile(u43VerdictPath(module), JSON.stringify(body));
  log("u43-verdict " + module + " " + verdict + " (" + detail + ")");
  return body;
};
