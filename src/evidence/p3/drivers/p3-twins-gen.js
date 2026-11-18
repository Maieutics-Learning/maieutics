// scratch/p3-twins-gen.js — clean writer-exam generation + grading for twins Stage A/B rebuild.
// FULLY SPECIFIED (supersedes the underspecified v0.4 line "prefix-3 + ancestral T=1.0").
// Filed openly: where v0.4 was ambiguous, choices below are documented with [CHOICE] tags.
// All choices are class-agnostic (no pile conditioning anywhere).
//
// PROCEDURE genExam(writerModel, seed, n=100):
//   rng = makeRng(seed) — ONE rng per exam, OUTSIDE the line loop. [CHOICE: the Y-bug
//     was reseeding inside the loop (fresh makeRng(seed) per line), which yields 2 unique
//     lines and profile [0,100,0,0] on 9601u/cycle-3. This module never reseeds in-loop.]
//   for li in 0..n-1:
//     L = [10,15,20][rng.int(3)] if li < n/2 else 50. [CHOICE: first half short (one of
//       10/15/20 drawn from the exam rng), second half len-50. Matches p2-lib "mixed"
//       pool convention. The v0.4 spec said "matched length" without order; this matches
//       the pool builder and is filed here.]
//     prefix = 3 x rng.int(19). [CHOICE: uniform prefix from exam rng.]
//     while x.length < L: fw = model.forward(x, 1); p = softmax(posOut[last].logits);
//       x.push(categorical(rng, p)).  (T=1.0 ancestral, r=1 position pass.)
// GRADE(g, lines, r=1): argmax(forward(x, r).logits). [CHOICE: r=1, matching p2-lib
//   readModel and all P2/N surprisal reads. r=4 noted as sensitivity only.]
//
// USAGE (from an async execute_js body):
//   const TG = await TwinsGenInit(fs);  // loads stack, returns helpers
globalThis.TwinsGenInit = async function (fs) {
  globalThis.window = globalThis;
  const ORDER = ["src/tinynn/nn.js", "src/tinynn/seeded.js", "src/tinynn/tasks.js", "src/tinynn/train.js", "src/tinynn/gseries.js"];
  for (const p of ORDER) { const src = await fs.readTextFile(p); (0, eval)(src + "\n//# sourceURL=" + p); }
  const G = globalThis.__tinyNN, T = globalThis.TinyNN;
  if (!G || !T) throw new Error("stack load failed");
  function softmax(a) {
    let m = -1e30; for (let i = 0; i < a.length; i++) if (a[i] > m) m = a[i];
    let s = 0; const o = new Array(a.length);
    for (let i = 0; i < a.length; i++) { o[i] = Math.exp(a[i] - m); s += o[i]; }
    for (let i = 0; i < o.length; i++) o[i] /= s;
    return o;
  }
  function sampleCat(rng, probs) {
    const u = rng.uniform(0, 1); let c = 0;
    for (let i = 0; i < probs.length; i++) { c += probs[i]; if (u < c) return i; }
    return probs.length - 1;
  }
  async function loadWriterCustom(path) {
    const s = await fs.readTextFile(path);
    const j = JSON.parse(s);
    const model = T.makeModel(G.makeRng(1), { arch: "attn", vocab: 19, h: 48, m: 96, classes: 19, d: 16 });
    const params = model.params();
    if (params.length !== j.vars.length) throw new Error("param count " + params.length + " vs " + j.vars.length + " in " + path);
    for (let i = 0; i < params.length; i++) {
      if (params[i].v.length !== j.vars[i].length) throw new Error("len mismatch param " + i + " in " + path);
      params[i].v.set(j.vars[i]); params[i].g.fill(0);
    }
    return model;
  }
  function loadGrader(seed) {
    return T.makeModel(G.makeRng(seed), { vocab: 19, classes: 4, h: 48, m: 96, d: 16, arch: "attn" });
  }
  function genExam(model, seed, n) {
    n = n || 100;
    const rng = G.makeRng(seed);
    const lines = [];
    for (let li = 0; li < n; li++) {
      const L = li < n / 2 ? [10, 15, 20][rng.int(3)] : 50;
      const x = [];
      for (let k = 0; k < 3; k++) x.push(rng.int(19));
      while (x.length < L) {
        const fw = model.forward(x, 1);
        const pos = fw.cache.posOut;
        const logits = Array.from(pos[pos.length - 1].logits);
        x.push(sampleCat(rng, softmax(logits)));
      }
      lines.push(x);
    }
    return lines;
  }
  function gradeLines(grader, lines, r) {
    r = r || 1;
    const counts = [0, 0, 0, 0], pred = [];
    for (const x of lines) {
      const lg = Array.from(grader.forward(x, r).logits);
      let bi = 0; for (let i = 1; i < lg.length; i++) if (lg[i] > lg[bi]) bi = i;
      counts[bi]++; pred.push(bi);
    }
    return { counts, pred };
  }
  function profile(counts) { const n = counts.reduce((a, b) => a + b, 0); return counts.map(c => +(c / n).toFixed(4)); }
  function l1(a, b) { let s = 0; for (let i = 0; i < a.length; i++) s += Math.abs(a[i] - b[i]); return +s.toFixed(4); }
  return { G, T, softmax, sampleCat, loadWriterCustom, loadGrader, genExam, gradeLines, profile, l1 };
};
globalThis.TwinsGenReady = true;
