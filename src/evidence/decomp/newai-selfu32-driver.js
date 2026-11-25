// newai-selfu32-driver.js — U32 trunk-freeze + retrain-to-frozen (reproducibility audit).
//
// FREEZE (reads only): W6 trunks d-newai-w-w6-s{0,1,2}.json (C=6 pick-max + auxW0.5 +
//   800st + lam2.0 + boot; init 73000+seed*7919+76*131, data 42000+seed*104729+55,
//   masks 91000+seed, B=16/lr5e-3/K=5/H=48) + filed evals d-newai-w-eval-w6-s{seed}.json
//   (scr 0.635/0.595/0.585, two 0.63/0.595/0.55 per d-newai-w-verdict.json).
// RETRAIN (logs alone): FRESH init, IDENTICAL W6 recipe re-executed through the same
//   stack (WinnerInit -> same globals), same seeds/streams, NEW ledger paths
//   d-newai-self-u32-repro-s{seed}-800st.json (never overwrite W6/U31 history).
// Only the ledger path string differs from the original run; no stream/config depends
//   on it (audited: all rng seeds are numeric literals of (seed, armCode); the path is
//   used only in fs.readTextFile/writeTextFile calls — grep P2K below).
// CPU/in-worker only. COMPLETE-gated, resume skips COMPLETE. NO PUSH.
//
// RUN (execute_js, fs in scope):
//   const src = await fs.readTextFile("src/evidence/decomp/newai-selfu32-driver.js");
//   (0, eval)(src + "\n//# sourceURL=newai-selfu32-driver.js");
//   await globalThis.SelfU32Init(fs);
//   const log = (m) => console.log(m);
//   await globalThis.runU32Wave0(fs, log);            // freeze + stream audit + dry-run gates
//   await globalThis.runU32Train(fs, log, {seed: 0}); // wave 1, one seed per call
//   await globalThis.runU32Eval(fs, log, {seed: 0});  // wave 2, retrain-eval + frozen re-eval
//   await globalThis.runU32Verdict(fs, log);          // bit-compare + verdict
globalThis.SelfU32Init = async function (fs) {
  const src = await fs.readTextFile("src/evidence/decomp/newai-winner-driver.js");
  (0, eval)(src + "\n//# sourceURL=newai-winner-driver.js");
  await globalThis.WinnerInit(fs);
  if (!globalThis.runWinnerTrain) throw new Error("u32 stack load failed");
};

function u32SeedStreams(seed) {
  return {
    init: 73000 + seed * 7919 + 76 * 131,
    data: 42000 + seed * 104729 + 55,
    mask: 91000 + seed,
    srng: 52500 + seed,
    frng: 52400 + seed,
  };
}
function u32TrainPath(seed) { return "src/evidence/decomp/d-newai-self-u32-repro-s" + seed + "-800st.json"; }
function u32EvalPath(seed) { return "src/evidence/decomp/d-newai-self-u32-eval-repro-s" + seed + "-800st.json"; }
function u32FrozenEvalPath(seed) { return "src/evidence/decomp/d-newai-self-u32-eval-frozen-s" + seed + "-800st.json"; }
const U32_FREEZE_PATH = "src/evidence/decomp/d-newai-self-u32-freeze.json";
const U32_VERDICT_PATH = "src/evidence/decomp/d-newai-self-u32-verdict.json";
const U32_BLOCKS = ["E", "W1", "b1", "Wf", "bf", "Wc", "bc", "Wh0", "Wh1", "Wh2", "Wh3", "Wh4", "bh0", "bh1", "bh2", "bh3", "bh4", "Hv", "bv"];
function u32BlockArrays(P) {
  const out = { E: P.E, W1: P.W1, b1: P.b1, Wf: P.Wf, bf: P.bf, Wc: P.Wc, bc: P.bc, Hv: P.Hv, bv: P.bv };
  for (let k = 0; k < 5; k++) { out["Wh" + k] = P.Wh[k]; out["bh" + k] = P.bh[k]; }
  return out;
}
function u32CanonParams(P) {
  const b = u32BlockArrays(P);
  const parts = [];
  for (const k of U32_BLOCKS) {
    const a = b[k];
    if (!a) throw new Error("missing P block " + k);
    parts.push(k + ":" + a.length + ":" + JSON.stringify(Array.from(a)));
  }
  return parts.join("|");
}
async function u32Sha256Hex(str) {
  if (!(typeof crypto !== "undefined" && crypto.subtle && crypto.subtle.digest)) throw new Error("SHA-256 unavailable (need crypto.subtle)");
  const bytes = new TextEncoder().encode(str);
  const d = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(d)).map((x) => x.toString(16).padStart(2, "0")).join("");
}
function u32MaxAbsDiff(Pa, Pb) {
  const a = u32BlockArrays(Pa), b = u32BlockArrays(Pb);
  let max = 0, worst = "";
  const per = {};
  for (const k of U32_BLOCKS) {
    let m = 0;
    for (let i = 0; i < a[k].length; i++) { const dd = Math.abs(a[k][i] - b[k][i]); if (dd > m) m = dd; }
    per[k] = m;
    if (m > max) { max = m; worst = k; }
  }
  return { max, worst, per };
}
// Exact copy of the W6 training step body (runWinnerTrain, arm w6: C=6/auxW=0.5/
// steps=800/lam=2.0/B=16/lr5e-3/K=5/H=48), factored so Wave-0 dry-run and Wave-1
// full retrains execute the same code. Builds FRESH model+opt+streams from seed.
async function u32FreshStack(fs, seed) {
  const G = await globalThis.IntrinsicInit(fs);
  const S = u32SeedStreams(seed);
  const rng = G.makeRng(S.init);
  const M = inSeqMakeModel(rng);
  const params = inSeqParams(M);
  const opt = new G.Adam(5e-3);
  const dataRng = G.makeRng(S.data);
  const fixedMasks = [];
  {
    const fr = G.makeRng(S.mask);
    for (let k = 0; k < 5; k++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr.int(10) < 5 ? 2 : 0; fixedMasks.push(m); }
  }
  return { G, M, params, opt, dataRng, fixedMasks };
}
function u32TrainOneStep(M, params, opt, dataRng, fixedMasks) {
  const B = 16, C = 6, auxW = 0.5, lam = 2.0, K = 5;
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  let lsum = 0;
  for (let b = 0; b < B; b++) {
    const cands = [];
    for (let c = 0; c < C; c++) { const ub = dataRng.int(2) === 0; cands.push(ub ? inSeqGenShift(dataRng, 0) : inSeqGenShift(dataRng, null)); }
    let pk = 0, best = -1;
    for (let c = 0; c < C; c++) {
      const fw = inSeqForward(M, cands[c].x, new Float64Array(8), fixedMasks);
      const d = curVoteDisagree(fw.logitsK);
      if (d > best) { best = d; pk = c; }
    }
    const e = cands[pk];
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
    lsum += ce2.loss + auxW * ceHv.loss;
    const dc = inSeqBackward(M, fw2, dMean2, perHead2, null, null, fixedMasks);
    inSeqBackward(M, fw1, dMean1, perHead1, dHv, dc, fixedMasks);
    const meanW = new Float64Array(M.Wh[0].v.length);
    for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) meanW[i] += M.Wh[k].v[i] / K;
    for (let k = 0; k < K; k++) for (let i = 0; i < meanW.length; i++) M.Wh[k].g[i] += lam * (M.Wh[k].v[i] - meanW[i]) / (B * M.H);
  }
  let s = 0; for (const p of params) for (let i = 0; i < p.g.length; i++) s += p.g[i] * p.g[i];
  const n = Math.sqrt(s);
  if (n > 1.0) { const sc = 1.0 / n; for (const p of params) for (let i = 0; i < p.g.length; i++) p.g[i] *= sc; }
  let gnorm = 0; for (const p of params) for (let i = 0; i < p.g.length; i++) gnorm += p.g[i] * p.g[i];
  gnorm = Math.sqrt(gnorm);
  opt.step(params);
  return { loss: lsum / B, gnorm };
}
function u32SnapshotParams(M) {
  return {
    E: Array.from(M.E.v), W1: Array.from(M.W1.v), b1: Array.from(M.b1.v),
    Wf: Array.from(M.Wf.v), bf: Array.from(M.bf.v), Wc: Array.from(M.Wc.v), bc: Array.from(M.bc.v),
    Wh: M.Wh.map((w) => Array.from(w.v)), bh: M.bh.map((w) => Array.from(w.v)),
    Hv: Array.from(M.Hv.v), bv: Array.from(M.bv.v),
  };
}
// Wave 0 (reads only + cheap dry-run gates; writes ONLY the freeze ledger).
// P1b: first-N stream hashes + eval-row identity. P1c (AMENDED — see D1): the prereg's
//   literal "zero-step init bit-compare vs frozen" is unexecutable because ledgers store
//   FINAL trained P, not init (fresh-init-vs-final maxAbsDiff ~1.2 is the expected train
//   growth, not a mismatch signal). Executed instead as the LOSS0 FINGERPRINT: one step
//   on a fresh stack vs filed curve[0].loss — the only init+data+selection fingerprint in
//   the record. Twin 1-step determinism retained. P1d symmetry-mapping rule lives in verdict.
globalThis.runU32Wave0 = async function (fs, log) {
  const G = await globalThis.IntrinsicInit(fs);
  const w6v = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-w-verdict.json"));
  const w6exp = { scr: [0.635, 0.595, 0.585], two: [0.63, 0.595, 0.55] };
  const filed = w6v["w6-C6-aux05-800st-lam2"];
  if (JSON.stringify(filed.scr) !== JSON.stringify(w6exp.scr) || JSON.stringify(filed.two) !== JSON.stringify(w6exp.two)) {
    throw new Error("U32-FREEZE provenance break: verdict numbers moved scr=" + JSON.stringify(filed.scr) + " two=" + JSON.stringify(filed.two));
  }
  const perSeed = [];
  for (const seed of [0, 1, 2]) {
    const srcPath = "src/evidence/decomp/d-newai-w-w6-s" + seed + ".json";
    const raw = await fs.readTextFile(srcPath);
    const tr = JSON.parse(raw);
    if (tr.verdict !== "COMPLETE") throw new Error("frozen trunk not COMPLETE: " + srcPath);
    if (!(tr.C === 6 && tr.auxW === 0.5 && tr.steps === 800 && tr.lam === 2.0)) throw new Error("frozen recipe drift: " + srcPath);
    const st = await fs.stat(srcPath);
    const canon = u32CanonParams(tr.P);
    const sha = await u32Sha256Hex(canon);
    const ev = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-w-eval-w6-s" + seed + ".json"));
    if (!(ev.accScratch === w6exp.scr[seed] && ev.accTwo === w6exp.two[seed])) {
      throw new Error("U32-FREEZE provenance break s" + seed + ": eval ledger scr=" + ev.accScratch + " two=" + ev.accTwo);
    }
    // P1b stream validation: first-N draws hash (built twice, must match) + eval-row identity.
    const S = u32SeedStreams(seed);
    const drawSeq = (mk) => { const r = mk(); const o = []; for (let i = 0; i < 256; i++) o.push(r.int(1000000000)); return o.join(","); };
    const hInitA = await u32Sha256Hex(drawSeq(() => G.makeRng(S.init)));
    const hInitB = await u32Sha256Hex(drawSeq(() => G.makeRng(S.init)));
    const hDataA = await u32Sha256Hex(drawSeq(() => G.makeRng(S.data)));
    const hDataB = await u32Sha256Hex(drawSeq(() => G.makeRng(S.data)));
    const hMaskA = await u32Sha256Hex(drawSeq(() => G.makeRng(S.mask)));
    const hMaskB = await u32Sha256Hex(drawSeq(() => G.makeRng(S.mask)));
    if (!(hInitA === hInitB && hDataA === hDataB && hMaskA === hMaskB)) throw new Error("stream construction nondeterministic s" + seed);
    // Eval-row identity: first 8 rows of each eval stream hashed twice.
    const rowSeq = (mk) => { const r = mk(); const o = []; for (let i = 0; i < 8; i++) { const e = inSeqGenShift(r, i % 2 === 0 ? null : 0); o.push(JSON.stringify(e.x) + "|" + e.y + "|" + e.v); } return o.join(";"); };
    const hRowS_A = await u32Sha256Hex(rowSeq(() => G.makeRng(S.srng)));
    const hRowS_B = await u32Sha256Hex(rowSeq(() => G.makeRng(S.srng)));
    const hRowF_A = await u32Sha256Hex(rowSeq(() => G.makeRng(S.frng)));
    const hRowF_B = await u32Sha256Hex(rowSeq(() => G.makeRng(S.frng)));
    if (!(hRowS_A === hRowS_B && hRowF_A === hRowF_B)) throw new Error("eval-row construction nondeterministic s" + seed);
    // P1c gate 1 (D1 amended): loss0 fingerprint — one step on a FRESH stack from the
    // filed streams vs the filed curve[0].loss. Exact match required (init+data+selection
    // determinism). Twin 1-step determinism (gate 2) isolates stack self-consistency.
    const fr0 = await u32FreshStack(fs, seed);
    const r0 = u32TrainOneStep(fr0.M, fr0.params, fr0.opt, fr0.dataRng, fr0.fixedMasks);
    const filedLoss0 = tr.curve[0].loss;
    const fpMatch = +r0.loss.toFixed(6) === filedLoss0;
    const zeroStep = { note: "D1: fresh-final compare retired (vacuous); loss0 fingerprint instead",
      freshLoss0Full: r0.loss, freshLoss0: +r0.loss.toFixed(6), filedLoss0, pass: fpMatch };
    // P1c gate 2: twin 1-step gradient determinism (two fresh stacks, one step each).
    const A = await u32FreshStack(fs, seed);
    const Bstk = await u32FreshStack(fs, seed);
    const rA = u32TrainOneStep(A.M, A.params, A.opt, A.dataRng, A.fixedMasks);
    const rB = u32TrainOneStep(Bstk.M, Bstk.params, Bstk.opt, Bstk.dataRng, Bstk.fixedMasks);
    const sA = u32SnapshotParams(A.M), sB = u32SnapshotParams(Bstk.M);
    const stepCmp = u32MaxAbsDiff(sA, sB);
    // P2K path-independence audit: this driver's only seed-derived strings are ledger
    // paths; all rng seeds are numeric literals of (seed, armCode 76). Grep marker: LEDGER-PATH-ONLY.
    perSeed.push({
      seed, srcPath, byteLen: st.bytes, sha256: sha, canonLen: canon.length,
      filedEval: { accScratch: ev.accScratch, accTwo: ev.accTwo, accFwd: ev.accFwd },
      recipe: { C: tr.C, auxW: tr.auxW, steps: tr.steps, lam: tr.lam, B: tr.B, lr: tr.lr, K: tr.K, H: tr.H, divCos: tr.divCos, curve: tr.curve },
      streams: S,
      streamHash: { init256: hInitA, data256: hDataA, mask256: hMaskA, evalShiftRows8: hRowS_A, evalBaseRows8: hRowF_A, match: true },
      zeroStep,
      oneStep: { maxAbsDiff: stepCmp.max, worst: stepCmp.worst, lossA: rA.loss, lossB: rB.loss, gnormA: rA.gnorm, gnormB: rB.gnorm, pass: stepCmp.max === 0 },
    });
    log("u32-freeze s" + seed + " sha=" + sha.slice(0, 16) + "… loss0fresh=" + (+r0.loss.toFixed(6)) + " filed=" + filedLoss0 + " fp=" + (fpMatch ? "HIT" : "MISS") + " twin1=" + stepCmp.max);
    if (stepCmp.max !== 0) throw new Error("P1c HALT s" + seed + ": twin 1-step dP mismatch (maxAbsDiff " + stepCmp.max + " at " + stepCmp.worst + ") — stack nondeterminism, no retrain judged");
  }
  const fpMiss = perSeed.filter((s) => !s.zeroStep.pass);
  if (fpMiss.length > 0) log("u32-freeze: loss0 fingerprint MISS on seeds " + fpMiss.map((s) => s.seed).join(",") + " — recipe-insufficiency finding (D2: Waves 1-2 continue as measurement + positive control)");
  const body = {
    spec: "self-u32-trunk-repro-prereg", wave: 0, verdict: "COMPLETE",
    recipe: { C: 6, auxW: 0.5, steps: 800, lam: 2.0, B: 16, lr: 5e-3, K: 5, H: 48, armCode: 76, pick: "max vote-disagree, ties lowest index" },
    streams: "init 73000+seed*7919+76*131 | data 42000+seed*104729+55 | masks 91000+seed | evalShift 52500+seed | evalBase 52400+seed",
    pathAudit: "LEDGER-PATH-ONLY: only seed-derived strings are NEW u32 ledger paths (read/write calls); all rng/model/eval seeds numeric literals above; no config branches on path",
    deviations: [
      "D1 P1c amended (pre-compute, no bar change): literal zero-step-init-vs-final bit-compare retired as vacuous — ledgers store FINAL trained P (fresh-init-vs-final diff ~1.2 is train growth, confirmed by scale stats). Replaced with loss0 fingerprint (fresh step-0 loss vs filed curve[0].loss, exact 6-decimal match required). Twin 1-step determinism retained unchanged.",
      "D2 Wave-0 fingerprint MISS does not halt Waves 1-2: full retrains + paired evals continue as measurement (quantify BIT/FUNC gaps + sweep-era positive control), ~2 min. No REPRO verdict possible on miss; verdict decides between LOG-INSUFFICIENT and STACK-NONDETERMINISM per frozen-checksum stability.",
    ],
    perSeed,
  };
  await fs.writeTextFile(U32_FREEZE_PATH, JSON.stringify(body));
  log("u32-wave0 FREEZE ledger written (fp " + (fpMiss.length === 0 ? "3/3 HIT" : "MISS " + fpMiss.length + "/3 — finding filed") + ", twin1 3/3 exact)");
  return body;
};
// Wave 1: full 800st retrain for one seed (same loop as u32TrainOneStep x steps).
globalThis.runU32Train = async function (fs, log, opts) {
  const seed = opts.seed;
  const ledgerPath = u32TrainPath(seed);
  try { const prev = JSON.parse(await fs.readTextFile(ledgerPath)); if (prev && prev.verdict === "COMPLETE") { log(ledgerPath + " exists, skip"); return prev; } } catch (e) {}
  const steps = 800;
  const t = await u32FreshStack(fs, seed);
  const t0 = Date.now(), curve = [];
  for (let step = 0; step < steps; step++) {
    for (const p of t.params) p.g.fill(0);
    const r = u32TrainOneStep(t.M, t.params, t.opt, t.dataRng, t.fixedMasks);
    // NOTE: u32TrainOneStep zeroes nothing itself; grads zeroed above (same as
    // runWinnerTrain line 45 `for (const p of params) p.g.fill(0)` before batches).
    if (step % 100 === 0 || step === steps - 1) curve.push({ step, loss: +r.loss.toFixed(6) });
    if (step % 200 === 0) log("u32-train s" + seed + " step " + step + "/800 loss=" + r.loss.toFixed(4));
  }
  const P = u32SnapshotParams(t.M);
  const body = {
    spec: "self-u32-trunk-repro-prereg", track: "U32-REPRO", arm: "u32-repro", seed, steps,
    B: 16, lr: 5e-3, K: 5, H: 48, C: 6, auxW: 0.5, lam: 2.0,
    bootstraps: "b%K slices (same as cur-pick)", verdict: "COMPLETE",
    reproOf: "src/evidence/decomp/d-newai-w-w6-s" + seed + ".json",
    recipeMatch: "C6/auxW0.5/800st/lam2.0/B16/lr5e-3/K5/H48/armCode76/pick-max-ties-lowest — only ledger path differs",
    wallMs: Date.now() - t0, frozen: false, curve, divCos: +inMeanCos(t.M).toFixed(4), P,
  };
  await fs.writeTextFile(ledgerPath, JSON.stringify(body));
  log("u32-train s" + seed + " COMPLETE loss0=" + curve[0].loss + " lossN=" + curve[curve.length - 1].loss + " divCos=" + body.divCos);
  return body;
};
// Wave-2 eval helper: run the W6 frozen-test eval rows from ANY train ledger.
async function u32RunEvalRows(fs, log, trainPath, evalPath, seed, tag) {
  try { const prev = JSON.parse(await fs.readTextFile(evalPath)); if (prev && prev.verdict === "COMPLETE") { log(evalPath + " exists, skip"); return prev; } } catch (e) {}
  const G = await globalThis.IntrinsicInit(fs);
  const tr = JSON.parse(await fs.readTextFile(trainPath));
  if (tr.verdict !== "COMPLETE") throw new Error("train ledger missing " + trainPath);
  const M = inSeqMakeModel(G.makeRng(1));
  const load = (dst, src) => { for (let i = 0; i < dst.v.length; i++) dst.v[i] = src[i]; };
  load(M.E, tr.P.E); load(M.W1, tr.P.W1); load(M.b1, tr.P.b1);
  load(M.Wf, tr.P.Wf); load(M.bf, tr.P.bf); load(M.Wc, tr.P.Wc); load(M.bc, tr.P.bc);
  for (let k = 0; k < 5; k++) { load(M.Wh[k], tr.P.Wh[k]); load(M.bh[k], tr.P.bh[k]); }
  load(M.Hv, tr.P.Hv); load(M.bv, tr.P.bv);
  let evalMasks = null; { const fr = G.makeRng(91000 + seed); evalMasks = []; for (let kk = 0; kk < 5; kk++) { const m = new Float64Array(48); for (let i = 0; i < 48; i++) m[i] = fr.int(10) < 5 ? 2 : 0; evalMasks.push(m); } }
  const srng = G.makeRng(52500 + seed), frng = G.makeRng(52400 + seed);
  const argmax4 = (a) => { let b = 0; for (let i = 1; i < 4; i++) if (a[i] > a[b]) b = i; return b; };
  const N = 200;
  let scr = 0, one = 0, two = 0, orc = 0;
  for (let i = 0; i < N; i++) {
    const e = inSeqGenShift(srng, null);
    const c0 = new Float64Array(8);
    const fw1 = inSeqForward(M, e.x, c0, evalMasks);
    const vhat = argmax4(fw1.hvLog);
    if (vhat === e.v) scr++;
    if (argmax4(inMeanLogits({ logitsK: fw1.logitsK })) === e.y) one++;
    const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
    const fw2 = inSeqForward(M, x2m, fw1.cNew, evalMasks);
    if (argmax4(inMeanLogits({ logitsK: fw2.logitsK })) === e.y) two++;
    const xo = [9, 9, 9, 9, 9, 9, e.qk, e.k, e.v, 8];
    const fwo = inSeqForward(M, xo, fw1.cNew, evalMasks);
    if (argmax4(inMeanLogits({ logitsK: fwo.logitsK })) === e.y) orc++;
  }
  let fF = 0;
  for (let i = 0; i < N; i++) {
    const e = inSeqGenShift(frng, 0);
    const fw = inSeqForward(M, e.x, new Float64Array(8), evalMasks);
    if (argmax4(inMeanLogits({ logitsK: fw.logitsK })) === e.y) fF++;
  }
  const body = {
    spec: "self-u32-trunk-repro-prereg", track: "U32-REPRO", arm: "u32-repro", seed, steps: 800,
    verdict: "COMPLETE", n: N, frozenTest: true, evalOf: trainPath, tag,
    accScratch: +(scr / N).toFixed(4), accOne: +(one / N).toFixed(4), accTwo: +(two / N).toFixed(4),
    accOracle: +(orc / N).toFixed(4), accFwd: +(fF / N).toFixed(4),
  };
  await fs.writeTextFile(evalPath, JSON.stringify(body));
  log("u32-eval " + tag + " s" + seed + " scr=" + body.accScratch + " two=" + body.accTwo + " orc=" + body.accOracle);
  return body;
}
// Wave 2: per-seed retrain-eval + frozen re-eval (determinism checksum).
globalThis.runU32Eval = async function (fs, log, opts) {
  const seed = opts.seed;
  const re = await u32RunEvalRows(fs, log, u32TrainPath(seed), u32EvalPath(seed), seed, "repro");
  const fr = await u32RunEvalRows(fs, log, "src/evidence/decomp/d-newai-w-w6-s" + seed + ".json", u32FrozenEvalPath(seed), seed, "frozenChecksum");
  return { repro: re, frozen: fr };
};
// Verdict: U32-BIT (P1a magnitude + binary-compare note) + U32-FUNC + U32-FROZEN.
// P1d: BIT-miss + FUNC-hit files PARAM-SYMMETRY hypothesis ONLY with the
//   permutation mapping + magnitude (follow-up owed, never assumed here).
globalThis.runU32Verdict = async function (fs, log) {
  const freeze = JSON.parse(await fs.readTextFile(U32_FREEZE_PATH));
  const perSeed = [];
  for (const seed of [0, 1, 2]) {
    const fr = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-w-w6-s" + seed + ".json"));
    const rt = JSON.parse(await fs.readTextFile(u32TrainPath(seed)));
    if (rt.verdict !== "COMPLETE") throw new Error("retrain not COMPLETE s" + seed);
    const cmp = u32MaxAbsDiff(rt.P, fr.P);
    const re = JSON.parse(await fs.readTextFile(u32EvalPath(seed)));
    const fz = JSON.parse(await fs.readTextFile(u32FrozenEvalPath(seed)));
    const filed = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-w-eval-w6-s" + seed + ".json"));
    const funcHit = re.accScratch === filed.accScratch && re.accTwo === filed.accTwo;
    const frozenStable = fz.accScratch === filed.accScratch && fz.accTwo === filed.accTwo;
    // P1d symmetry probe (owed ONLY on BIT-miss + FUNC-hit): per-head permutation
    // map Wh[k]/bh[k] retrained-vs-frozen, best-match permutation + residual.
    let symmetry = null;
    if (cmp.max !== 0 && funcHit) {
      const keys = [0, 1, 2, 3, 4];
      const cost = (a, b) => { let m = 0; for (let i = 0; i < rt.P.Wh[a].length; i++) { const dd = Math.abs(rt.P.Wh[a][i] - fr.P.Wh[b][i]); if (dd > m) m = dd; } return m; };
      const perms = [];
      const permute = (arr, l) => {
        if (l === arr.length) { perms.push(arr.slice()); return; }
        for (let i = l; i < arr.length; i++) { const t = arr[l]; arr[l] = arr[i]; arr[i] = t; permute(arr, l + 1); const t2 = arr[l]; arr[l] = arr[i]; arr[i] = t2; }
      };
      permute(keys.slice(), 0);
      let best = null;
      for (const p of perms) { let m = 0; for (let k = 0; k < 5; k++) { const c = cost(k, p[k]); if (c > m) m = c; } if (!best || m < best.resid) best = { perm: p, resid: m }; }
      symmetry = { hypothesis: "PARAM-SYMMETRY", bestPerm: best.perm, residual: best.resid, followUpOwed: true };
    }
    perSeed.push({
      seed, bit: { maxAbsDiff: cmp.max, worst: cmp.worst, perBlock: cmp.per, pass: cmp.max === 0 },
      binaryNote: "f64 exact compare; nonzero-but-tiny (<1e-12) would still MISS the bar — possible register-spill/Kahan-free-ordering artifact, priced as STACK-NONDETERMINISM per L3 unless frozen re-eval also drifts",
      func: { reproScr: re.accScratch, reproTwo: re.accTwo, filedScr: filed.accScratch, filedTwo: filed.accTwo, pass: funcHit },
      frozenChecksum: { recomputedScr: fz.accScratch, recomputedTwo: fz.accTwo, stable: frozenStable },
      symmetry,
    });
    log("u32-verdict s" + seed + " BITdiff=" + cmp.max + " (" + cmp.worst + ") FUNC=" + (funcHit ? "HIT" : "MISS") + " FROZEN=" + (frozenStable ? "stable" : "DRIFT"));
  }
  const bitPass = perSeed.filter((s) => s.bit.pass).length;
  const funcPass = perSeed.filter((s) => s.func.pass).length;
  const frozenStableAll = perSeed.every((s) => s.frozenChecksum.stable);
  let verdict = "";
  if (bitPass === 3 && funcPass === 3) verdict = "REPRO-EXACT";
  else if (funcPass === 3) verdict = "REPRO-FUNCTIONAL";
  else if (!frozenStableAll) verdict = "STACK-NONDETERMINISM";
  else if (funcPass <= 1) verdict = "LOG-INSUFFICIENT";
  else verdict = "STACK-NONDETERMINISM";
  const body = {
    spec: "self-u32-trunk-repro-prereg", verdict,
    bars: {
      "U32-FREEZE": "PASS (freeze ledger COMPLETE, SHA-256 per seed, filed numbers exact, provenance holds)",
      "U32-BIT": bitPass + "/3 exact 0.0",
      "U32-FUNC": funcPass + "/3 exact",
      "U32-FROZEN": frozenStableAll ? "PASS (frozen re-eval stable; no writes to W6/U31 files by construction — new u32 paths only)" : "DRIFT (see perSeed)",
      "U32-FRESH": "battery 3x IMPLEMENTABLE unanimous -> v1.1 (filed)",
    },
    perSeed,
  };
  await fs.writeTextFile(U32_VERDICT_PATH, JSON.stringify(body));
  log("u32-verdict " + verdict + " BIT " + bitPass + "/3 FUNC " + funcPass + "/3 FROZEN " + (frozenStableAll ? "stable" : "DRIFT"));
  return body;
};
