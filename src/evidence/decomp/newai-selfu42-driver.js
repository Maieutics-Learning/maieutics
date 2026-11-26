// newai-selfu42-driver.js — U42 Arm-B neutralize-collapse probe + verdict.
// Countersigned program Turn-179 (prereg v1.1 + battery). Measurement only:
// frozen u34 trunks, forward reads, no training. Stack pin 258d2f06.
// COMPLETE-gated. NO PUSH.
//
// RUN (execute_js, fs in scope):
//   const src = await fs.readTextFile("src/evidence/decomp/newai-selfu42-driver.js");
//   (0, eval)(src + "\n//# sourceURL=newai-selfu42-driver.js");
//   await globalThis.SelfU42Init(fs);
//   const log = (m) => console.log(m);
//   await globalThis.runU42Probes(fs, log);
//   await globalThis.runU42Verdict(fs, log);
globalThis.SelfU42Init = async function (fs) {
  const src = await fs.readTextFile("src/evidence/decomp/newai-selfu39-driver.js");
  (0, eval)(src + "\n//# sourceURL=newai-selfu39-driver.js");
  await globalThis.SelfU39Init(fs);
};
const U42_EXPECT_STACK = "258d2f060684ce382778e203959ab791abb5df79af174deef19ff568886d4d6e";
const u42Path = (t, seed) => "src/evidence/decomp/d-newai-self-u42-armb-" + t + "-s" + seed + ".json";
const U42_VERDICT_PATH = "src/evidence/decomp/d-newai-self-u42-verdict.json";
const u42Argmax4 = (a) => { let b = 0; for (let i = 0; i < 4; i++) if (a[i] > a[b]) b = i; return b; };

globalThis.runU42Probes = async function (fs, log) {
  const h = await globalThis.u33StackHash(fs);
  if (h.hex !== U42_EXPECT_STACK) throw new Error("U42-PIN HALT: stack drift " + h.hex.slice(0, 16));
  const G = await globalThis.IntrinsicInit(fs);
  // trunks: T1 = u34-c2-s0 (B4 pick); T2 = best-accTwo u34-c1 seed; C0 = u34-c0-s0.
  let best = { acc: -1, s: 0 };
  for (const s of [0, 1, 2]) {
    const ev = JSON.parse(await fs.readTextFile("src/evidence/decomp/d-newai-self-u34-eval-c1-s" + s + "-800st.json"));
    if (ev.accTwo > best.acc) best = { acc: ev.accTwo, s };
  }
  const trunks = {
    t1: "src/evidence/decomp/d-newai-self-u34-c2-s0-800st.json",
    t2: "src/evidence/decomp/d-newai-self-u34-c1-s" + best.s + "-800st.json",
    c0: "src/evidence/decomp/d-newai-self-u34-c0-s0-800st.json",
  };
  for (const seed of [0, 1, 2]) {
    const masks = u39EvalMasks(G, seed);
    for (const t of ["t1", "t2", "c0"]) {
      const p = u42Path(t, seed);
      try { const prev = JSON.parse(await fs.readTextFile(p)); if (prev && prev.verdict === "COMPLETE") { log(p + " exists, skip"); continue; } } catch (e) {}
      const tr = JSON.parse(await fs.readTextFile(trunks[t]));
      const M = u39LoadModel(G, tr.P);
      const rng = G.makeRng(54500 + seed);
      const byY = {};
      while (Object.keys(byY).length < 4 || Math.min(...Object.values(byY).map((g) => Math.min(g.O.length, g.N.length))) < 250) {
        const ub = rng.int(2) === 0;
        const e = ub ? inSeqGenShift(rng, 0) : inSeqGenShift(rng, null);
        const g = byY[e.y] || (byY[e.y] = { O: [], N: [] });
        (e.qk === e.k ? g.O : g.N).push(e);
        for (const k of Object.keys(byY)) {
          if (byY[k].O.length > 400) byY[k].O = byY[k].O.slice(0, 400);
          if (byY[k].N.length > 400) byY[k].N = byY[k].N.slice(0, 400);
        }
      }
      const O = [], N = [];
      for (const y of [0, 1, 2, 3]) { O.push(...byY[y].O.slice(0, 250)); N.push(...byY[y].N.slice(0, 250)); }
      const acc2 = (rows) => {
        let hit = 0;
        for (const e of rows) {
          const fw1 = inSeqForward(M, e.x, new Float64Array(8), masks);
          const vhat = u42Argmax4(fw1.hvLog);
          const x2m = [9, 9, 9, 9, 9, 9, e.qk, e.k, vhat, 8];
          if (u42Argmax4(inMeanLogits({ logitsK: inSeqForward(M, x2m, fw1.cNew, masks).logitsK })) === e.y) hit++;
        }
        return hit / rows.length;
      };
      const scr = (rows) => {
        let hit = 0;
        for (const e of rows) {
          const fw1 = inSeqForward(M, e.x, new Float64Array(8), masks);
          if (u42Argmax4(fw1.hvLog) === e.v) hit++;
        }
        return hit / rows.length;
      };
      const accO = acc2(O), accN = acc2(N), scrO = scr(O), scrN = scr(N);
      const D = accO - accN;
      const conf = Math.abs(scrO - scrN) > 0.05;
      const out = {
        spec: "self-u42-armb-prereg", track: "U42-ARMB", trunk: trunks[t], cond: t, seed,
        verdict: "COMPLETE", stackHash: h.hex, n: 1000,
        accO: +accO.toFixed(4), accN: +accN.toFixed(4), D: +D.toFixed(4),
        scrO: +scrO.toFixed(4), scrN: +scrN.toFixed(4),
        outcome: conf ? "DIFFICULTY-CONFOUNDED" : D > 0.10 ? "LOAD-BEARING" : Math.abs(D) <= 0.03 ? "IRRELEVANT" : "GRAY",
      };
      await fs.writeTextFile(p, JSON.stringify(out));
      log("u42-" + t + " s" + seed + " O=" + accO.toFixed(3) + " N=" + accN.toFixed(3) + " D=" + D.toFixed(3) + " scrD=" + Math.abs(scrO - scrN).toFixed(3) + " " + out.outcome);
    }
  }
};

globalThis.runU42Verdict = async function (fs, log) {
  const J = async (p) => JSON.parse(await fs.readTextFile(p));
  const q = (arr, f) => arr.filter((s) => f(s)).length;
  const res = {};
  for (const t of ["t1", "t2", "c0"]) {
    res[t] = [];
    for (const seed of [0, 1, 2]) res[t].push(await J(u42Path(t, seed)));
  }
  const cls = (arr) => {
    const ok = arr.filter((s) => s.outcome !== "DIFFICULTY-CONFOUNDED");
    if (q(arr, (s) => s.outcome === "DIFFICULTY-CONFOUNDED") >= 2) return "EXCLUDED";
    if (q(ok, (s) => s.outcome === "LOAD-BEARING") >= 2) return "LOAD-BEARING";
    if (q(ok, (s) => s.outcome === "IRRELEVANT") >= 2) return "IRRELEVANT";
    return "GRAY";
  };
  const c = { t1: cls(res.t1), t2: cls(res.t2), c0: cls(res.c0) };
  let verdict, license09;
  if (c.t1 === "EXCLUDED" || c.t1 === "GRAY") { verdict = "FINAL-INCONCLUSIVE"; license09 = "MIXED stands (Arm-B inconclusive, no re-sample; different instrument owed)"; }
  else if (c.t1 === "LOAD-BEARING") {
    if (c.t2 === "LOAD-BEARING") { verdict = "FORCED"; license09 = "ARCHITECTURE TRACK FORCED (compression + collapse on 2 trunks; incentive family 01-08/10-11/13 dead; stop pricing, build pointer-like machinery)"; }
    else { verdict = "PROVISIONAL-FORCED"; license09 = "family gated-shut (T1 collapses, T2 does not confirm; new instrument owed before any kill)"; }
  } else if (c.t1 === "IRRELEVANT") {
    if (c.c0 === "IRRELEVANT") {
      if (c.t2 === "LOAD-BEARING") { verdict = "DIVERGENT-INCONCLUSIVE"; license09 = "MIXED stands (trunks disagree; cannot generalize; new instrument owed)"; }
      else { verdict = "FALSIFIED"; license09 = "kernel/shortcut theory FALSIFIED for bench (with A7 CLEAN + B6 compression: failure is binding-dynamics U37-style; incentive track proceeds through open gates 03/04, 05, 06, 07, 10, 13)"; }
    } else { verdict = "CONTROL-DIVERGENT-INCONCLUSIVE"; license09 = "MIXED stands (C0 contradicts T1; no update)"; }
  }
  const body = {
    spec: "self-u42-armb-prereg", track: "U42-ARMB", verdict,
    perTrunk: c,
    perSeed: res,
    license09,
    deviations: [],
  };
  await fs.writeTextFile(U42_VERDICT_PATH, JSON.stringify(body, null, 1));
  log("u42-verdict " + verdict + " " + JSON.stringify(c));
  return body;
};
