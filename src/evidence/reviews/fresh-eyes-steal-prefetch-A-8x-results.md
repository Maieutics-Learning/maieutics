# Pre-fetch battery — Track A shortlist (8x, 2026-11-10)

Premise frozen: registry shortlist (remember, download-button, markdown, docs, google-sheets API, literal) + Logic<=100KB + W1/W2 fit + moves-number-or-named-feature.

## Raw replies (verbatim, trimmed)
### A1
1. remember PASS (race localStorage vs init). 2. download FAIL trivial. 3. markdown PASS (ReDoS nested lists). 4. docs FAIL Framework-creep redundant. 5. sheets BLOCKED API. 6. literal PASS (escape vs tokenization). Kill-switch: cross-plugin dep bloat.
### A2
remember PASS (quota headless), download PASS trivial (blob-URL sandbox), markdown PASS (main-thread block), docs FAIL (highlight.js bloat kills <=100KB), sheets BLOCK (CORS/auth), literal PASS (regex perf). Kill-switch: main-thread latency during inference.
### A3
remember PASS (multi-instance collision), download PASS (save-as block), markdown PASS (frame-drop), docs FAIL heavy/CDN, sheets BLOCKED fetch-rule, literal PASS (non-English edge). Kill-switch: marked CPU spike = Logic lie.
### A4
remember PASS (cold-boot race), download PASS (CORS), markdown PASS (stutter), docs FAIL, sheets FAIL API, literal PASS. Verdict port 1,2,3,6 kill 4,5 ~50KB fits W1.
### A5
remember PASS (schema conflict?), download PASS (popup breaks loop?), markdown PASS (37KB pushes bundle over?), docs FAIL redundant/CDN blocks, sheets BLOCKED any fetch kills it, literal PASS (Perchance globals missing?). Falsifiers as tests.
### A6
remember PASS (namespace/quota), download PASS (cookie/auth?), markdown PASS (marked 0.5.0 lag >10KB), docs FAIL (>100KB ESM chain), sheets REJECTED (no-fetch fails), literal PASS (nested brackets). Kill-switch: combined bundle + polyfill breach.
### A7
remember PASS (JSON.parse untrusted?), download SKIP zero-impact, markdown PASS (>16ms stutter?), docs SKIP heavy, sheets FAIL blocked, literal PASS (UTF-8 regex?). Kill-switch: hidden window-API version dependency.
### A8
remember PASS (key collision), download PASS (blob non-HTTPS), markdown PASS (large-doc block), docs FAIL (CDN violates light), sheets FAIL (no-key), literal PASS. Killer check: ANY async network init = Track B not A.

## Adjudication (mine, not reviewers)
- ACCEPT (unanimous 8/8): DROP docs-plugin — redundant with markdown, overweight (>100KB with highlight.js + CDN), violates dependency-light. Port markdown alone for paper docs.
- ACCEPT (unanimous 8/8): sheets stays API-class BLOCKED on B3 gate + coin check. No pre-fetch port.
- ACCEPT (7/8, 1 skip-trivial): KEEP remember + markdown + literal; download-button as trivial/optional (near-zero cost, Utility only). Majority rules; skip-vote noted but cost is 3 lines.
- ACCEPT kill-switches as pre-fetch checks (all cheap, run BEFORE A4 port):
  1. Hidden-API audit: grep fetch/XHR/WebSocket + dynamic import in init path — any hit = Track B, not A.
  2. Main-thread cost: parse 10KB doc on CPU, fail if >16ms stutter or bench dip.
  3. Bundle cap: remember+markdown+literal combined <=100KB shipped (vendored lines count).
- REJECT: "download FAIL, zero impact" as kill — accepted as Utility-class (bar allows named-feature ports), not Performance. Stays bottom of queue.
- Log reviewer errors: A5 schema-conflict + A6 cookie/auth + A7 JSON.parse-security are speculative (no code evidence) — kept as checklist items, not verdicts.

Score: 3 accepts (drop docs / block sheets / keep 3+1 with checks), 0 open. Patch: registry A4 pilot runs checks 1-3 first; docs line -> SKIPPED-redundant.
