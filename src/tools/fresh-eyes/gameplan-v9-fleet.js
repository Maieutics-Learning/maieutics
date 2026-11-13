// Fleet driver — gameplan v7 round 1. Runs in execute_js (has fs + tools).
// For each of 10 sealed reviewers: 2 DDG searches + 1 primary read, then one
// page_eval generateText verdict (<=150 words, fixed shape). Raw -> scratch file.
const PLAN = await fs.readTextFile("src/GAMEPLAN.md");
const CONTEXT = [
"Program: Teaching Small Models to Learn. Paper draft (index.html): small recurrent nets taught addressable lookup via staged hint fading.",
"Measured: hinted regime (M4 1.00, attn ~0.80); wall 0/32 answer-only; transmission 6/10 fast fade; chaining 35/40 G1-G5; F-singlegen O2 (schedule, not generations).",
"Threshold Eq.3 (killA>=0.60 & Hd>=0.55) robust: 35/40 -> 34 @+0.05 -> 32 @+0.10 -> 36 @-0.10; failures catastrophic (Hd<=0.48); bimodal.",
"Known gaps: soft targets constant (only hints fade); kill exams target-first; single teacher-selected chain; within-family transfer only; no one-command rerun; backprop unaudited off-harness.",
"Reviews: #1 (methods: bars, controls, transfer, rerun, license/index done); #2 (7 questions + scorecard 3.7/5 + engineering split/tests/headless/allowlist)."
].join("\n");

const REVIEWERS = [
 {id:"S1", stance:"STEELMAN: defend that Phase 1.a (four-way table + numeric kill thresholds + step-fade arm) DECIDES the fading-causality question either way. Name the priced residual.", q:["knowledge distillation ablation validation methodology", "causal attribution deep learning training components"]},
 {id:"S2", stance:"STEELMAN: defend that Phase 1.b (slot-swept eval + 0.95-correlation rule) settles the position question either way. Name the priced residual.", q:["positional generalization evaluation neural networks", "evaluation shortcut detection machine learning"]},
 {id:"S3", stance:"STEELMAN: defend that parity + assoc-recall as the two-task battery suffices for a first generality verdict (schedule-level). Name the priced residual.", q:["cross-task evaluation suites small models IL SVRC", "task selection bias generalization benchmarks"]},
 {id:"S4", stance:"STEELMAN: defend the 2.b.0 → 2.b gate logic (mandatory blocking, tutor-swap, survival metric, gap analysis) as sufficient to separate compounding from luck. Name the priced residual.", q:["replication logic confirmatory experiments gating", "teacher student lineage dependence controls"]},
 {id:"S5", stance:"STEELMAN: defend that the rerun harness + CI ownership design (byte-compare, fail-closed, logged overrides) makes the repo stranger-reproducible. Name the priced residual.", q:["continuous integration scientific reproducibility pipelines", "research code regression testing best practices"]},
 {id:"S6", stance:"STEELMAN: defend the v0.15 → venue path as credible (numeric verdicts, threshold paragraph, scope sentences). Name the priced residual.", q:["empirical paper acceptance criteria ML venues", "negative results publishing machine learning venues"]},
];

const strip = (s) => String(s||"").replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
async function ddg(query) {
  const p = "scratch/fleet-ddg.html";
  const f = await tools.fetch_url({url: "https://html.duckduckgo.com/html/?q=" + encodeURIComponent(query), path: p});
  const ok = f && (f.ok !== false);
  let html = "";
  try { html = await fs.readTextFile(p); } catch(e){ return {query, error: "unreadable"}; }
  const res = [];
  const re = /class="result__a"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
  let m;
  while ((m = re.exec(html)) !== null && res.length < 6) {
    let url = m[1];
    const u = m[1].match(/[?&]uddg=([^&]+)/);
    try { if (u) url = decodeURIComponent(u[1]); } catch(e){}
    res.push({title: strip(m[2]).slice(0,120), url});
  }
  const reSn = /class="result__snippet"[^>]*>([\s\S]*?)<\/a>/g;
  const sn = [];
  while ((m = reSn.exec(html)) !== null) sn.push(strip(m[1]).slice(0,300));
  for (let i = 0; i < res.length && i < sn.length; i++) res[i].snippet = sn[i];
  return {query, results: res};
}
async function primary(url, tag) {
  try {
    const f = await tools.fetch_url({url, path: "scratch/fleet-prim.html"});
    if (!f || f.ok === false) return {url, error: "fetch-failed"};
    const html = await fs.readTextFile("scratch/fleet-prim.html");
    const txt = strip(html).replace(/\s+/g, " ").slice(0, 2500);
    return {url, excerpt: txt};
  } catch(e){ return {url, error: String(e).slice(0,100)}; }
}

const out = [];
for (const R of REVIEWERS) {
  const s1 = await ddg(R.q[0]);
  const s2 = await ddg(R.q[1]);
  const prims = [...(s1.results||[]), ...(s2.results||[])].filter(r => /arxiv\.org|github\.com|docs\.|proceedings\.|openreview|jmlr|mitpress|nature\.com/i.test(r.url));
  const pr = prims.length ? await primary(prims[0].url, R.id) : {url: null, error: "no-primary"};
  const brief = "You are a stateless expert reviewer. No prior conversation exists. Be blunt, terse, technical. No ELI5, no padding.\n\nASSIGNMENT (" + R.id + "): " + R.stance + "\n\nGAMEPLAN UNDER REVIEW (v7, frozen):\n" + PLAN + "\n\nSHARED CONTEXT (verified numbers/claims):\n" + CONTEXT + "\n\nOWN SEARCH 1 (" + s1.query + "):\n" + JSON.stringify((s1.results||[]).slice(0,5)) + "\nOWN SEARCH 2 (" + s2.query + "):\n" + JSON.stringify((s2.results||[]).slice(0,5)) + "\nPRIMARY READ (" + (pr.url||"none") + "):\n" + (pr.excerpt || pr.error || "none") + "\n\nReturn EXACTLY this shape, <=150 words total:\n1. VERDICT: HOLD | BREAK | PARTIAL (on v7 as stated, for your assignment only)\n2. TOP RISK: one sentence.\n3. CHANGE: one KEEP, CUT, or ADD directive.\n4. HARDEST TEST: the single experiment/check that would falsify or confirm your point.";
  let verdict = null;
  try {
    const r = await tools.page_eval({js: "const b = " + JSON.stringify(brief) + ";\nconst g = await root.generateText(b);\nconst s = (typeof g === 'string') ? g : (g && (g.text || g.outputs) ? String(g.text || g.outputs) : JSON.stringify(g));\nreturn s.slice(0, 2500);", timeoutMs: 180000});
    verdict = (r && r.result !== undefined) ? r.result : r;
    if (verdict && typeof verdict === "object") verdict = JSON.stringify(verdict).slice(0, 2500);
  } catch(e){ verdict = "CALL-FAILED: " + String(e && e.error || e).slice(0,200); }
  out.push({id: R.id, stance: R.stance, searches: [s1.query, s2.query], primary: pr.url || pr.error, verdict: String(verdict||"").slice(0,2500)});
  await fs.writeTextFile("scratch/gameplan-v9-r3-raw.json", JSON.stringify({at: new Date().toISOString(), done: out.length + "/10", reviews: out}, null, 1));
}
return {done: out.length, verdicts: out.map(o => ({id: o.id, head: String(o.verdict).slice(0,160)}))};
