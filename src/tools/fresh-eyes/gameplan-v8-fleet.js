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
 {id:"R2-A1", stance:"Audit v8 gate sequencing: does 2.b.0 truly precede any 2.b spend, and is there any other hidden ordering bug (an item runnable before its gate, a verdict needed before its evidence exists)?", q:["phased research program gating dependencies milestone sequencing", "preregistration sequential analysis gating"]},
 {id:"R2-A2", stance:"Audit the new numeric exits (>=5/8 generalize, <=2/8 lookup-local, >=4/8 rewrite, Wilson-CI overlap): are they operationally checkable from ledger JSONs, or do any need a definition v8 does not give?", q:["Wilson score interval small samples interpretation overlap", "pre-specified success thresholds confirmatory experiments"]},
 {id:"R2-A3", stance:"Hunt remaining qualitative triggers in v8: any verdict/exit/kill still decided by vibes (words like appropriate, sufficient, demonstrated without numbers)? Quote the worst.", q:["operationalization constructs empirical research vague criteria", "falsifiability qualitative thresholds philosophy of science"]},
 {id:"R2-B1", stance:"Verify placement: does the schedule-vs-weights generality sentence now live where the generality claim is made (1.c verdict, paper), or is it buried? Would a skimmer still misread v8 as claiming weight transfer?", q:["cross-task transfer versus weight transfer meta-learning distinction", "curriculum schedule generalization across tasks"]},
 {id:"R2-B2", stance:"Attack four-way-table completeness: is there a 6th cell (e.g. tutor-quality confound — s202-tutored vs s308-tutored students differ)? Name the cheapest missing control.", q:["teacher quality knowledge distillation student outcomes variance", "tutor selection bias teacher student training"]},
 {id:"R2-B3", stance:"Probe 2.b.0 decisiveness limits: if shuffle-seed G2 transmits but a full chain still rots at G4, what does v8 conclude? Is there a gap between the pre-gate and the verdict it gates?", q:["single step versus full chain generalization iterated learning", "teacher student chain degradation seed dependence"]},
 {id:"R2-C1", stance:"Audit build-gate ownership: who runs the byte-compare (human or CI), what exactly fails closed, and what happens on a mismatch mid-paper-edit? Find the concrеtе hole.", q:["build verification gates reproducible research pipelines fail-closed", "source artifact divergence generated code checksums"]},
 {id:"R2-C2", stance:"Re-audit v8 costs with the corrected rate (10.8ms/step, ~35s per 3k-step seed): total Phase 1 + 2.b.0 wall-clock from ledger rates, and flag any remaining label that misleads.", q:["academic compute budgeting wall clock estimates small models", "CPU benchmarking javascript numerical workloads"]},
 {id:"R2-D1", stance:"Re-scout dropped demands: re-read both reviews' lists against v8 and name anything still missing, softened, or silently shelved.", q:["machine learning reviewer checklists empirical rigor 2024", "reproducibility standards ML conferences checklists"]},
 {id:"R2-D2", stance:"Re-scout venue readiness: does v8's paper path (v0.15 contents + numeric verdicts) close a TMLR/ICLR reviewer's likely objections? Name the one that survives.", q:["TMLR decision criteria significance empirical machine learning", "ICLR reviewer common reasons rejection empirical papers"]},
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
  await fs.writeTextFile("scratch/gameplan-v8-r2-raw.json", JSON.stringify({at: new Date().toISOString(), done: out.length + "/10", reviews: out}, null, 1));
}
return {done: out.length, verdicts: out.map(o => ({id: o.id, head: String(o.verdict).slice(0,160)}))};
