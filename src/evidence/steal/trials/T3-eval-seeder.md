## EVAL DEFINITION: seeder-integration
### Capability Evals
1. Seeded run reproduces identical assoc-recall loss curve (seed=7 twice, max-abs-diff 0)
2. Seed surfaces in URL (?seed=) and is recorded in run ledger
3. Unseeded path behaves exactly as today (no-seed = no change)
### Regression Evals (baseline: commit da7df8b guards)
1. quickSelfTest learned:true
2. quickAttnTest ok:true
3. URL-apply round-trip still wins over remember (?task=assocR&steps=600)
4. Bundle delta <= 5KB shipped
### Success Metrics
- pass@3 >= 0.90 capability; pass^3 = 1.00 regression (release-critical per eval-harness thresholds)
### Graders (code-based, per eval-harness best practice #4)
- curve-diff: node script comparing two run JSONs (deterministic, PASS/FAIL)
- guard-probe: page_eval quickSelfTest/quickAttnTest (deterministic)
- ledger-check: grep run ledger for seed field (deterministic)
