# Fresh-eyes premise v1 — marketplace wishlist second check (2026-11-10)

Project: Teaching Small Models to Learn — browser lab + paper (visitors run everything in a normal browser, CPU-only, no key, no server). Agent side: isolated worker with fs + esm.sh + page tools (can run Python? No — worker is JS-only; Python skills need porting, not direct use).

Gaps the wishlist must serve: G1 persistence (SOLVED remember), G2 paper authoring (SOLVED markdown+literal), G3 export (SOLVED download), G4 bench repro/share (seeder/url-params/copy-text/sampling/lockables — imported, integration spec'd), G5 paper polish/demo (grammar/print/fullscreen — landed). Open: bench-integration wiring, paper TBDs.

Fit rules (A3b): Logic = runs in Workshop 1 (stranger's laptop browser, no key/server) or Workshop 2 (JS worker, fs+tools+esm.sh); ≤100KB shipped unless Utility-named; vendored lines count; runtime fetch = API-class (needs coin/B3); W3-only (Python/GPU/cluster/servers) = SKIP for Track A. Every STOLEN needs revert + guard run.

Wishlist v1 (17 Tier-1, src/evidence/steal/mkt-wishlist.json): (1) keyargo/web-search DuckDuckGo zero-key; (2) pdf family; (3) paper family academic-paper/paper-write/paper-compile/latex-scaffold/latex-workflow/pandoc-markdown/paper-tex; (4) eval family eval-harness x2/eval/self-eval/project-evals/vitest-evals/evals; (5) benchmark x2; (6) playwright family webapp-testing/generate-test/playwright-pro/e2e-testing/expert/openai-playwright/develop-web-game; (7) xlsx; (8) HF datasets/viewer/hf-cli/transformers.js; (9) dataset gen/docs; (10) pytorch recipes + SAE + pyvene + nemo-rl; (11) memory architectures; (12) tutor-skills/beautiful_prose/creative-director; (13) static-analysis/qa/coderabbit; (14) research procedures; (15) frontend-design/taste; (16) jupyter-notebook; (17) tc-tracker.

Suspected biases (self-flagged): shopping-spree breadth (17 wants, most unwired); Python-skills-in-JS-project mismatch; keyed-API optimism; duplicates (3 paper-writers, 3 eval-harnesses, 3 pdf tools); Workshop-1 vs Workshop-2 confusion; glue-cost undercount.

ASK: Hammer this wishlist. Verdict + single hardest cut/falsifier. <=150 words, numbered. Be blunt: which 1/3 would you CUT first and why (name names)?
