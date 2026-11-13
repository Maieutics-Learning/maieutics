// Fleet driver — gameplan v10 round 4 PAIRED DEBATE (format 10).
// Runs in execute_js (has fs + tools). 5 claims × (RED + STEELMAN sealed, armed)
// + 1 rebuttal each (unarmed, both openings quoted). Raw -> scratch file.
const PLAN = await fs.readTextFile("src/GAMEPLAN.md");
const CONTEXT = [
"Program: Teaching Small Models to Learn. Paper draft (index.html): small recurrent nets taught addressable lookup via staged hint fading.",
"Measured: hinted regime (M4 1.00, attn ~0.80); wall 0/32 answer-only; transmission 6/10 fast fade; chaining 35/40 G1-G5; F-singlegen O2 (schedule, not generations).",
"Threshold Eq.3 (killA>=0.60 & Hd>=0.55) robust: 35/40 -> 34 @+0.05 -> 32 @+0.10 -> 36 @-0.10; failures catastrophic (Hd<=0.48); bimodal.",
"v10 = v9 + S1 verdict-wording fix (attn-only failure = hints-insufficient-alone) + S5 tolerance-mode compare + S6 power analysis (1.f) + 95% Wilson plan-wide + time caps + tutor-swap + mandatory 2.b.0 blocking + gap analysis + CI ownership + failure frame.",
"Known residuals: soft targets constant (only hints fade); kill exams target-first; single teacher-selected chain; within-family transfer only; rerun harness unbuilt; backprop unaudited off-harness."
].join("\n");

const CLAIMS = [
 {id:"C1", claim:"Phase 1.a (four-way table + numeric kill thresholds + S1 wording) DECIDES the fading-causality question either way.", q:["knowledge distillation ablation causal attribution training components", "scaffolding fading curriculum learning necessity tests"]},
 {id:"C2", claim:"Phase 1.b (slot-swept kill eval + 0.95-correlation rule + replace-with-swept-variant) settles the position-arbitrariness question either way.", q:["positional generalization evaluation neural networks shortcuts", "evaluation shortcut detection machine learning controls"]},
 {id:"C3", claim:"Parity + assoc-recall as the two-task battery suffices for a FIRST generality verdict at schedule level (with the failure frame + gap-analysis tripwire).", q:["cross-task evaluation suites small models generalization", "task selection bias generalization benchmarks suites"]},
 {id:"C4", claim:"The 2.b.0 (cross-lineage G2 + tutor-swap + mandatory blocking) → 2.b (survival metric + gap analysis) gate logic separates compounding from single-chain luck.", q:["replication logic confirmatory experiments gating criteria", "teacher student lineage dependence controls generalization"]},
 {id:"C5", claim:"The 2.a rerun harness (byte-compare + tolerance fallback + CI ownership + fail-closed overrides + re-ledger-or-cut) + 1.f power analysis makes v0.15 stranger-reproducible and credible.", q:["continuous integration scientific reproducibility pipelines research", "statistical power analysis small samples Wilson interval thresholds"]},
];

const strip = (s) => String(s||"").replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
async function ddg(query) {
  const p = "scratch/fleet-ddg.html";
  const f = await tools.fetch_url({url: "https://html.duckduckgo.com/html/?q=" + encodeURIComponent(query), path: p});
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
async function primary(url) {
  try {
    const f = await tools.fetch_url({url, path: "scratch/fleet-prim.html"});
    if (!f || f.ok === false) return {url, error: "fetch-failed"};
    const html = await fs.readTextFile("scratch/fleet-prim.html");
    return {url, excerpt: strip(html).replace(/\s+/g, " ").slice(0, 2500)};
  } catch(e){ return {url, error: String(e).slice(0,100)}; }
}
async function ask(brief, cap) {
  try {
    const r = await tools.page_eval({js: "const b = " + JSON.stringify(brief) + ";\nconst g = await root.generateText(b);\nconst s = (typeof g === 'string') ? g : (g && (g.text || g.outputs) ? String(g.text || g.outputs) : JSON.stringify(g));\nreturn s.slice(0, 3000);", timeoutMs: 180000});
    let v = (r && r.result !== undefined) ? r.result : r;
    if (v && typeof v === "object") v = JSON.stringify(v).slice(0, 3000);
    return String(v || "").slice(0, 3000);
  } catch(e){ return "CALL-FAILED: " + String(e && e.error || e).slice(0,200); }
}
function save(obj) { return fs.writeTextFile("scratch/gameplan-v10-r4-raw.json", JSON.stringify(obj, null, 1)); }

const out = {at: new Date().toISOString(), premise: "GAMEPLAN.md v10", claims: []};
for (const C of CLAIMS) {
  const sides = {};
  for (const side of ["RED", "STEEL"]) {
    const s1 = await ddg(C.q[0]);
    const s2 = await ddg(C.q[1]);
    const prims = [...(s1.results||[]), ...(s2.results||[])].filter(r => /arxiv\.org|github\.com|docs\.|proceedings\.|openreview|jmlr|mitpress|nature\.com/i.test(r.url));
    const pr = prims.length ? await primary(prims[0].url) : {url: null, error: "no-primary"};
    const role = side === "RED"
      ? "You are a stateless RED-TEAM reviewer. No prior conversation exists. Be blunt, terse, technical. No ELI5, no padding. Your job: KILL the claim below as written. A HOLD verdict is allowed only if the claim is genuinely unkillable."
      : "You are a stateless STEELMAN reviewer. No prior conversation exists. Be blunt, terse, technical. No ELI5, no padding. Your job: DEFEND the claim below as written — strongest fair reading. Every verdict MUST name its priced residual (what stays uncertain + what it costs to retire).";
    const shape = side === "RED"
      ? "Return EXACTLY this shape, <=150 words total:\n1. VERDICT: BREAK | PARTIAL | HOLD (HOLD only if unkillable)\n2. KILL: the single sharpest objection, one sentence.\n3. CHANGE: one CUT, ADD, or KEEP directive.\n4. HARDEST TEST: the single experiment/check that would falsify your point or vindicate the claim."
      : "Return EXACTLY this shape, <=150 words total:\n1. VERDICT: HOLD | PARTIAL | BREAK\n2. STRONGEST POINT: one sentence for the claim.\n3. PRICED RESIDUAL: what stays uncertain + what it costs (one sentence).\n4. HARDEST TEST: the single experiment/check that would break the claim.";
    const brief = role + "\n\nCLAIM (" + C.id + "): " + C.claim + "\n\nGAMEPLAN UNDER REVIEW (v10, frozen):\n" + PLAN + "\n\nSHARED CONTEXT (verified numbers/claims):\n" + CONTEXT + "\n\nOWN SEARCH 1 (" + s1.query + "):\n" + JSON.stringify((s1.results||[]).slice(0,5)) + "\nOWN SEARCH 2 (" + s2.query + "):\n" + JSON.stringify((s2.results||[]).slice(0,5)) + "\nPRIMARY READ (" + (pr.url||"none") + "):\n" + (pr.excerpt || pr.error || "none") + "\n\n" + shape;
    const verdict = await ask(brief);
    sides[side] = {searches: [s1.query, s2.query], primary: pr.url || pr.error, sealed: verdict, rebuttal: null};
    await save({...out, claims: [...out.claims, {id: C.id, claim: C.claim, partial: sides}]});
  }
  for (const side of ["RED", "STEEL"]) {
    const other = side === "RED" ? "STEEL" : "RED";
    const brief = "You are the same " + side + " reviewer from the sealed round. No prior conversation exists except what is quoted below. Be blunt, terse, technical. No ELI5, no padding.\n\nCLAIM (" + C.id + "): " + C.claim + "\n\nGAMEPLAN (v10, frozen):\n" + PLAN + "\n\nYOUR SEALED OPENING:\n" + sides[side].sealed + "\n\nOPPONENT (" + other + ") SEALED OPENING ON THE SAME CLAIM:\n" + sides[other].sealed + "\n\nRebut in <=120 words, EXACTLY this shape:\n1. CONCEDE: what the other side gets right (one sentence, or 'nothing').\n2. REBUT: your sharpest reply (one sentence).\n3. SETTLER: the single piece of evidence that would settle this claim.\nNo new claims outside this claim.";
    sides[side].rebuttal = await ask(brief);
    await save({...out, claims: [...out.claims, {id: C.id, claim: C.claim, partial: sides}]});
  }
  out.claims.push({id: C.id, claim: C.claim, red: sides.RED, steel: sides.STEEL});
  await save(out);
}
return {done: out.claims.length + "/5 claims", heads: out.claims.map(c => ({id: c.id, red: String(c.red.sealed).slice(0,120), steel: String(c.steel.sealed).slice(0,120)}))};
