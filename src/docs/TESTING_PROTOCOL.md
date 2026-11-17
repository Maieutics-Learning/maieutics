# Testing Protocol index (P1; answers "how is anything in this repo tested/verified")

Single map over four mechanisms that reviewers kept confusing. Each does a different job:

1. **Statistics** — `src/GAMEPLAN.md` Conventions: 95% Wilson CIs everywhere; arm contrasts by
   Fisher exact + Wilson difference-CI with preregistered margin δ (default 0.25, tightened
   where the null is near-deterministic); thresholds tested against MEASURED nulls by exact
   binomial, never against a 0.5 coin; pilots never enter confirmatory counts (fresh seeds +
   frozen protocol). Applies to every claim with an n.
2. **Rerun + ledger + forensics** (the reproducibility chain) — Gameplan 2.a: one-command rerun
   (`src/lab/run-p1a.js`, headless, `node`, machine-readable JSON ledger); ledger byte-compare
   with PASS/FAIL per claim (exact on same engine, documented ulp tolerance cross-engine);
   forensics signoff gate (`src/tools/forensics.js` — kill-checks on fingerprint + rows, fails
   closed, OVERRIDE is a logged verdict never a bypass); re-ledger-or-cut (no ledger, no paper).
3. **Dump + verify** (implementation trust) — Gameplan 1.d: per-line instrumented dumps
   (logits→confidence/margin/entropy, cited-slot pointer, energy re-dump), pointer-validity kill
   rule (ptrHit|correct on killA ≥ 0.90 or the defense claim dies), mandatory overconfidence
   disclosure, backprop audit gated on the dump. Code must do what the plan says — the dump is
   where that's checked.
4. **Batteries** (judgment quality) — `src/tools/fresh-eyes/SKILL.md`: version+freeze the
   artifact, run sealed reviewers (barrage/red/steel/math/impl/alt), adjudicate every reply
   (ACCEPT/REJECT/PARTIAL + reason), patch once, re-run on the new version; stop on barren red
   (user-ordered 2026-11-17 — steelman never closes; steelman is reserved for planned cuts).
   Plus retrospective batteries (calibration of trust) and planted-error batteries (precision/
   recall of the loop itself — `src/evidence/synthesis/planted-error-r1-results.md`).
5. **Agent-task EDD** (`src/tools/eval-harness/SKILL.md`) — a DIFFERENT thing: verify-then-trust
   for agent coding tasks (cull/parallelize/optimize, fast integration tests). It is not the
   bench-stats protocol, not the battery loop, not reproducibility. Do not cite it for those.

Rule of thumb: numbers → (1); "can someone else reproduce it" → (2); "does the code do what
the text claims" → (3); "is the conclusion sound" → (4); "did the agent's edit work" → (5).
