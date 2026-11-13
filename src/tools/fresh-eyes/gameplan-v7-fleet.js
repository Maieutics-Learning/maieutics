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
 {id:"A1", stance:"Verify internal consistency: does Phase 1 actually gate Phase 2 (any circular deps, any Phase-2 item runnable before its gate)?", q:["preregistered experiment gating criteria phased research", "machine learning ablation study design controls"]},
 {id:"A2", stance:"Verify exit criteria: is every phase exit a measurable written verdict, or are any exits vibes? Name the vaguest.", q:["SMART criteria research milestones measurable outcomes", "pre-registration exit criteria confirmatory experiments"]},
 {id:"A3", stance:"Verify kill rules: do the stated kill rules trigger real rewrites, or are they unfalsifiable? Steelman the weakest rule.", q:["falsification criteria machine learning experiments kill criteria", "stopping rules adaptive experimental design"]},
 {id:"B1", stance:"RED TEAM science: is parity different enough from assoc-recall to test generality, or a second home classroom? Kill-shot if so.", q:["cross-task generalization small neural networks compositional", "associative recall versus parity neural network mechanisms"]},
 {id:"B2", stance:"RED TEAM science: will the two missing ablation arms actually decide the fading-causality question, or are there deeper confounds (e.g. soft-target leakage)? Kill-shot if undecidable.", q:["knowledge distillation versus attention supervision ablation study", "hint fading curriculum learning deep networks"]},
 {id:"B3", stance:"RED TEAM science: is a full second G1-G5 chain worth its cost versus more seeds/analyses on chain 1? Argue the cheaper substitute.", q:["iterated learning teacher student chains cultural evolution collapse", "model collapse self-training recursive chains variance"]},
 {id:"C1", stance:"Verify engineering: source-split-then-inline build for a single-file Perchance artifact — where does drift creep in, and what check prevents silent divergence?", q:["reproducible research code packaging best practices single-file builds", "static site build drift generated artifacts verification"]},
 {id:"C2", stance:"Verify cost honesty: the plan labels steps CPU-minutes vs weeks. Sense-check wall-clocks (3k-step seed ~35s, 8-seed arms, chains) and flag any label that lies.", q:["tiny neural network CPU training wall clock benchmarks browser javascript", "small model training cost estimates academic budgets"]},
 {id:"D1", stance:"SCOUT: compare the plan against both reviews' demand lists. Name the single most important dropped or softened demand.", q:["TMLR reviewer guidelines empirical machine learning checklist", "NeurIPS reproducibility checklist machine learning"]},
 {id:"D2", stance:"SCOUT venue realism: is v0.15-then-venue credible for this evidence level? Name what a TMLR/ICLR reviewer still flags and the cheapest fix.", q:["tiny models mechanistic interpretability workshop ICLR scope", "Transactions on Machine Learning Research certification empirical scope"]},
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
  await fs.writeTextFile("scratch/gameplan-v7-r1-raw.json", JSON.stringify({at: new Date().toISOString(), done: out.length + "/10", reviews: out}, null, 1));
}
return {done: out.length, verdicts: out.map(o => ({id: o.id, head: String(o.verdict).slice(0,160)}))};
