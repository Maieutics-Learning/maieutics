// newai-selfu40-driver.js — U40 gate integration audit probes + verdict.
// Countersigned Turn-177. Measurement only: NO opt.step anywhere. U2 runs the
// full backward with a no-op opt (params=[] equivalent) and restores gate.b
// bitwise after FD. Stack pin 258d2f06. COMPLETE-gated. NO PUSH.
//
// RUN (execute_js, fs in scope):
//   const src = await fs.readTextFile("src/evidence/decomp/newai-selfu40-driver.js");
//   (0, eval)(src + "\n//# sourceURL=newai-selfu40-driver.js");
//   await globalThis.SelfU40Init(fs);
//   const log = (m) => console.log(m);
//   await globalThis.runU40U4(fs, log);      // ledger forensics first (may HALT)
//   await globalThis.runU40Probes(fs, log);  // U1-U3, R=3
//   await globalThis.runU40Verdict(fs, log);
globalThis.SelfU40Init = async function (fs) {
  const src = await fs.readTextFile("src/evidence/decomp/newai-selfu39-driver.js");
  (0, eval)(src + "\n//# sourceURL=newai-selfu39-driver.js");
  await globalThis.SelfU39Init(fs);
  for (const f of ["u39LoadModel", "u39EvalMasks", "u39SlopeCI", "u39Pearson", "u38GateFwd", "u38MakeGate", "u38PickDiet", "u36PickEpisode"]) {
    if (typeof globalThis[f] !== "function") throw new Error("u40 stack load failed: " + f);
  }
};
const U40_EXPECT_STACK = "258d2f060684ce382778e203959ab791abb5df79af174deef19ff568886d4d6e";
const u40U4Path = () => "src/evidence/decomp/d-newai-self-u40-audit-u4.json";
const u40PPath = (pi, seed) => "src/evidence/decomp/d-newai-self-u40-audit-u" + pi + "-s" + seed + ".json";
const U40_VERDICT_PATH = "src/evidence/decomp/d-newai-self-u40-verdict.json";
const u40Argmax4 = (a) => { let b = 0; for (let i = 0; i < 4; i++) if (a[i] > a[b]) b = i; return b; };

globalThis.runU40U4 = async function (fs, log) {
  try { const prev = JSON.parse(await fs.readTextFile(u40U4Path())); if (prev && prev.verdict === "COMPLETE") { log(u40U4Path() + " exists, skip"); return prev; } } catch (e) {}
  const h = await globalThis.u33StackHash(fs);
  if (h.hex !== U40_EXPECT_STACK) throw new Error("U40-PIN HALT: stack drift " + h.hex.slice(0, 16));
  const perSeed = [];
  for (const seed of [0, 1, 2]) {
    const tr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-u38-c1-s" + seed + "-800st.json"));
    let mx = 0;
    for (let i = 0; i < 21; i++) mx = Math.max(mx, Math.abs(tr.Gate[i] - tr.Gate0[i]));
    perSeed.push({ seed, maxMove: mx, moved: mx > 1e-3 });
  }
  const nMoved = perSeed.filter((s) => s.moved).length;
  const out = {
    spec: "self-u40-gate-audit-prereg", track: "U40-GATE-AUDIT", probe: "U4",
    verdict: "COMPLETE", stackHash: h.hex, perSeed,
    outcome: nMoved >= 2 ? "MOVED" : "FROZEN-AT-INIT",
  };
  await fs.writeTextFile(u40U4Path(), JSON.stringify(out));
  log("u40-U4 " + out.outcome + " moves=" + perSeed.map((s) => s.maxMove.toExponential(1)).join(","));
  if (out.outcome === "FROZEN-AT-INIT") throw new Error("U40-HALT: U4 FROZEN-AT-INIT — opt never stepped gate; audit stops, verdict INTEGRATION-BUG");
  return out;
};

globalThis.runU40Probes = async function (fs, log) {
  const h = await globalThis.u33StackHash(fs);
  if (h.hex !== U40_EXPECT_STACK) throw new Error("U40-PIN HALT: stack drift " + h.hex.slice(0, 16));
  const G = await globalThis.IntrinsicInit(fs);
  const J = async (p) => JSON.parse(await fs.readTextFile(p));
  for (const seed of [0, 1, 2]) {
    const masks = u39EvalMasks(G, seed);
    const tr = await J("src/evidence/decomp/d-newai-self-u38-c1-s" + seed + "-800st.json");
    // ---- U1: wiring ----
    {
      const p = u40PPath(1, seed);
      let done = false;
      try { const prev = await J(p); if (prev && prev.verdict === "COMPLETE") { log(p + " exists, skip"); done = true; } } catch (e) {}
      if (!done) {
        const M = u39LoadModel(G, tr.P);
        const gate = { w: { v: Float64Array.from(tr.Gate.slice(0, 20)) }, b: { v: Float64Array.from(tr.Gate.slice(20, 21)) } };
        const rng = G.makeRng(54100 + seed);
        let tot = 0, n = 0;
        for (let i = 0; i < 500; i++) {
          const ub = rng.int(2) === 0;
          const e = ub ? inSeqGenShift(rng, 0) : inSeqGenShift(rng, null);
          const fw1 = inSeqForward(M, e.x, new Float64Array(8), masks);
          const vhat = u40Argmax4(fw1.hvLog);
          const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
          const g = u38GateFwd(M, gate, e.qk, fw1.cNew).g;
          const cA = new Float64Array(8), cB = new Float64Array(8);
          for (let d = 0; d < 8; d++) { cA[d] = g * fw1.cNew[d]; cB[d] = fw1.cNew[d]; }
          const lA = inMeanLogits({ logitsK: inSeqForward(M, x2m, cA, masks).logitsK });
          const lB = inMeanLogits({ logitsK: inSeqForward(M, x2m, cB, masks).logitsK });
          for (let o = 0; o < 4; o++) tot += Math.abs(lA[o] - lB[o]);
          n++;
        }
        const influence = tot / n;
        const out = { spec: "self-u40-gate-audit-prereg", track: "U40-GATE-AUDIT", probe: "U1", seed, verdict: "COMPLETE", stackHash: h.hex, influence, outcome: influence > 1e-6 ? "CONNECTED" : "DISCONNECTED" };
        await fs.writeTextFile(p, JSON.stringify(out)); log("u40-U1 s" + seed + " influence=" + influence.toExponential(2) + " " + out.outcome);
      }
    }
    // ---- U2: grad-flow ----
    {
      const p = u40PPath(2, seed);
      let done = false;
      try { const prev = await J(p); if (prev && prev.verdict === "COMPLETE") { log(p + " exists, skip"); done = true; } } catch (e) {}
      if (!done) {
        const M = u39LoadModel(G, tr.P);
        const P0snap = globalThis.u32SnapshotParams(M);
        const gate = u38MakeGate();
        gate.w.v.set(tr.Gate.slice(0, 20)); gate.b.v[0] = tr.Gate[20];
        const auxW = 0.5, lam = 2.0, K = 5, B = 16;
        const rng = G.makeRng(54200 + seed);
        const batch = [];
        for (let b = 0; b < B; b++) batch.push(u38PickDiet(M, rng, masks));
        const lossOf = () => {
          let lsum = 0;
          for (const { eA, eB, mismatch } of batch) {
            const e = eA;
            const fw1 = inSeqForward(M, e.x, new Float64Array(8), masks);
            const ceHv = inCELossGrad(fw1.hvLog, e.v);
            const vhat = u40Argmax4(fw1.hvLog);
            let cCtx;
            if (mismatch) { const fwB = inSeqForward(M, eB.x, new Float64Array(8), masks); cCtx = fwB.cNew; }
            else cCtx = fw1.cNew;
            const g = u38GateFwd(M, gate, e.qk, cCtx).g;
            const cGated = new Float64Array(8);
            for (let d = 0; d < 8; d++) cGated[d] = g * cCtx[d];
            const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
            const fw2 = inSeqForward(M, x2m, cGated, masks);
            lsum += inCELossGrad(inMeanLogits({ logitsK: fw2.logitsK }), e.y).loss + auxW * ceHv.loss;
          }
          return lsum / B;
        };
        // analytic: full backward, zeroed grads, no step.
        for (const q of [M.E, M.W1, M.b1, M.Wf, M.bf, M.Wc, M.bc, M.Hv, M.bv]) q.g.fill(0);
        for (let k = 0; k < 5; k++) { M.Wh[k].g.fill(0); M.bh[k].g.fill(0); }
        gate.w.g.fill(0); gate.b.g.fill(0);
        for (let b = 0; b < B; b++) {
          const { eA, eB, mismatch } = batch[b];
          const e = eA;
          const fw1 = inSeqForward(M, e.x, new Float64Array(8), masks);
          const ceHv = inCELossGrad(fw1.hvLog, e.v);
          const dHv = new Float64Array(4); for (let o = 0; o < 4; o++) dHv[o] = ceHv.d[o] * auxW / B;
          const vhat = u40Argmax4(fw1.hvLog);
          let cCtx, gInfo;
          if (mismatch) {
            const fwB = inSeqForward(M, eB.x, new Float64Array(8), masks);
            cCtx = fwB.cNew;
            gInfo = u38GateFwd(M, gate, e.qk, cCtx); gInfo.fwB = fwB; gInfo.donor = true;
          } else { cCtx = fw1.cNew; gInfo = u38GateFwd(M, gate, e.qk, cCtx); }
          const g = gInfo.g;
          const cGated = new Float64Array(8);
          for (let d = 0; d < 8; d++) cGated[d] = g * cCtx[d];
          const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
          const fw2 = inSeqForward(M, x2m, cGated, masks);
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
          const dcGated = inSeqBackward(M, fw2, dMean2, perHead2, null, null, masks);
          let dot = 0;
          for (let d = 0; d < 8; d++) dot += dcGated[d] * cCtx[d];
          const dLds = dot * g * (1 - g);
          for (let i = 0; i < 20; i++) gate.w.g[i] += dLds * gInfo.inp[i] / B;
          gate.b.g[0] += dLds / B;
          for (let d = 0; d < 12; d++) M.E.g[e.qk * 12 + d] += dLds * gate.w.v[d] / B;
          const dcTot = new Float64Array(8);
          for (let d = 0; d < 8; d++) dcTot[d] = (g * dcGated[d] + dLds * gate.w.v[12 + d]) / B;
          if (mismatch) {
            inSeqBackward(M, gInfo.fwB, null, null, null, dcTot, masks);
            inSeqBackward(M, fw1, dMean1, perHead1, dHv, null, masks);
          } else {
            inSeqBackward(M, fw1, dMean1, perHead1, dHv, dcTot, masks);
          }
          const meanW = new Float64Array(M.Wh[0].v.length);
          for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) meanW[i] += M.Wh[k].v[i] / K;
          for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) M.Wh[k].g[i] += lam * (M.Wh[k].v[i] - meanW[i]) / (B * M.H);
        }
        // NOTE: mean-pull + clip skipped (no step); analytic grads read directly.
        const analytic = gate.b.g[0];
        let gnorm = 0;
        for (let i = 0; i < 20; i++) gnorm += gate.w.g[i] * gate.w.g[i];
        gnorm += gate.b.g[0] * gate.b.g[0]; gnorm = Math.sqrt(gnorm);
        // FD with bitwise restore.
        const b0 = gate.b.v[0], eps = 1e-4;
        gate.b.v[0] = b0 + eps; const lp = lossOf();
        gate.b.v[0] = b0 - eps; const lm = lossOf();
        gate.b.v[0] = b0;
        if (gate.b.v[0] !== b0) throw new Error("U40-RESTORE VIOLATION s" + seed);
        const fd = (lp - lm) / (2 * eps);
        const ratio = analytic / fd;
        const P1snap = globalThis.u32SnapshotParams(M);
        let fmax = 0;
        for (const k of Object.keys(P0snap)) {
          const flat = (v) => (Array.isArray(v) ? v.flat(Infinity) : [v]);
          const f0 = flat(Array.isArray(P0snap[k]) ? P0snap[k] : [P0snap[k]]);
          const f1 = flat(Array.isArray(P1snap[k]) ? P1snap[k] : [P1snap[k]]);
          for (let i = 0; i < f0.length; i++) fmax = Math.max(fmax, Math.abs(f0[i] - f1[i]));
        }
        const out = {
          spec: "self-u40-gate-audit-prereg", track: "U40-GATE-AUDIT", probe: "U2", seed,
          verdict: "COMPLETE", stackHash: h.hex, analytic: +analytic.toFixed(6), fd: +fd.toFixed(6),
          ratio: isFinite(ratio) ? +ratio.toFixed(4) : "nonfinite", gradNorm: +gnorm.toExponential(2),
          frozenExact: fmax,
          optDeliver: null, // filled in verdict vs filed displacement
          outcome: fmax !== 0 ? "FROZEN-VIOLATION" : (isFinite(ratio) && ratio > 0.25 && ratio < 4 ? "AGREE" : "GRAD-DEAD"),
        };
        await fs.writeTextFile(p, JSON.stringify(out));
        log("u40-U2 s" + seed + " analytic=" + analytic.toExponential(2) + " fd=" + fd.toExponential(2) + " ratio=" + out.ratio + " frozen=" + fmax + " " + out.outcome);
      }
    }
    // ---- U3: bias-dominance ----
    {
      const p = u40PPath(3, seed);
      let done = false;
      try { const prev = await J(p); if (prev && prev.verdict === "COMPLETE") { log(p + " exists, skip"); done = true; } } catch (e) {}
      if (!done) {
        const M = u39LoadModel(G, tr.P);
        const w = Array.from(tr.Gate.slice(0, 20)), b = tr.Gate[20];
        const rng = G.makeRng(54300 + seed);
        const cond = { matched: [], swapped: [], zeros: [] };
        const cNewOf = [];
        for (let i = 0; i < 1000; i++) {
          const ub = rng.int(2) === 0;
          const e = ub ? inSeqGenShift(rng, 0) : inSeqGenShift(rng, null);
          cNewOf.push({ qk: e.qk, c: Array.from(inSeqForward(M, e.x, new Float64Array(8), masks).cNew) });
        }
        const sm = (qk, c) => { let s = b; for (let d = 0; d < 12; d++) s += w[d] * M.E.v[qk * 12 + d]; for (let d = 0; d < 8; d++) s += w[12 + d] * c[d]; return s; };
        for (let i = 0; i < 1000; i++) {
          cond.matched.push(sm(cNewOf[i].qk, cNewOf[i].c));
          cond.swapped.push(sm(cNewOf[i].qk, cNewOf[999 - i].c));
          cond.zeros.push(sm(cNewOf[i].qk, [0, 0, 0, 0, 0, 0, 0, 0]));
        }
        const stats = {};
        for (const k of Object.keys(cond)) {
          const v = cond[k], m = v.reduce((a, x) => a + x, 0) / v.length;
          const sd = Math.sqrt(v.reduce((a, x) => a + (x - m) * (x - m), 0) / v.length);
          stats[k] = { mean: +m.toFixed(4), sd: +sd.toFixed(4), min: +Math.min(...v).toFixed(4), max: +Math.max(...v).toFixed(4) };
        }
        const allMin = Math.min(stats.matched.min, stats.swapped.min, stats.zeros.min);
        const allMax = Math.max(stats.matched.max, stats.swapped.max, stats.zeros.max);
        const range = allMax - allMin;
        const out = {
          spec: "self-u40-gate-audit-prereg", track: "U40-GATE-AUDIT", probe: "U3", seed,
          verdict: "COMPLETE", stackHash: h.hex, bias: +b.toFixed(4), stats,
          sRange: +range.toFixed(4), outcome: range >= 1.0 ? "LIVE-INPUT" : "INPUT-STARVED",
        };
        await fs.writeTextFile(p, JSON.stringify(out));
        log("u40-U3 s" + seed + " b=" + b.toFixed(3) + " range=" + range.toFixed(3) + " " + out.outcome);
      }
    }
  }
};

globalThis.runU40Verdict = async function (fs, log) {
  const J = async (p) => JSON.parse(await fs.readTextFile(p));
  const u4 = await J(u40U4Path());
  const q = (arr, f) => arr.filter((s) => f(s)).length;
  const u1 = [], u2 = [], u3 = [];
  for (const seed of [0, 1, 2]) { u1.push(await J(u40PPath(1, seed))); u2.push(await J(u40PPath(2, seed))); u3.push(await J(u40PPath(3, seed))); }
  // P1b cross-check: healthy grads + frozen gate => OPT-NOT-DELIVERING.
  const tr0 = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-u38-c1-s0-800st.json"));
  let mxMove = 0;
  for (const seed of [0, 1, 2]) {
    const tr = seed === 0 ? tr0 : JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-u38-c1-s" + seed + "-800st.json"));
    for (let i = 0; i < 21; i++) mxMove = Math.max(mxMove, Math.abs(tr.Gate[i] - tr.Gate0[i]));
  }
  for (const s of u2) s.optDeliver = (s.gradNorm >= 1e-4 && mxMove < 1e-3) ? "OPT-NOT-DELIVERING" : "n/a";
  const bars = {
    U4: u4.outcome + " moves=" + u4.perSeed.map((s) => s.maxMove.toExponential(1)).join(","),
    U1: q(u1, (s) => s.outcome === "CONNECTED") + "/3",
    U2: u2.map((s) => s.outcome).join(","),
    U2deliver: u2.map((s) => s.optDeliver).join(","),
    U3: u3.map((s) => s.outcome).join(","),
  };
  const bug = u4.outcome === "FROZEN-AT-INIT" || u1.some((s) => s.outcome === "DISCONNECTED") ||
    u2.some((s) => s.outcome === "GRAD-DEAD" || s.outcome === "FROZEN-VIOLATION") ||
    u2.some((s) => s.optDeliver === "OPT-NOT-DELIVERING");
  let verdict, next;
  if (bug) {
    verdict = "INTEGRATION-BUG";
    next = "U38 GATE-DEAD + U39 B2/B3 marked SUSPECT-STEP. Fix requires a new step prereg + battery + countersign; never a silent patch. D5 stays halted.";
  } else if (u3.every((s) => s.outcome === "INPUT-STARVED")) {
    verdict = "INTEGRATION-OK/INPUT-STARVED";
    next = "Redesign gate input (B1 confirmed: E[qk]|cNew carries no mismatch signature). D5-dead under current input; Wave-C un-halt only under a new-input prereg.";
  } else {
    verdict = "INTEGRATION-OK/LIVE-INPUT";
    next = "Pressure-side failure stands; Wave-C D5 un-halted under existing U39 prereg — needs fresh countersign (halt was B3-driven, B3 mechanism now localized to pressure, not plumbing).";
  }
  const body = { spec: "self-u40-gate-audit-prereg", track: "U40-GATE-AUDIT", verdict, bars, perSeed: { U1: u1, U2: u2, U3: u3 }, next };
  await fs.writeTextFile(U40_VERDICT_PATH, JSON.stringify(body, null, 1));
  log("u40-verdict " + verdict + " " + JSON.stringify(bars));
  return body;
};
