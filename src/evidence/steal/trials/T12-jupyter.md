## Jupyter readiness (no notebooks in repo)
Checklist applied to train.js workflow: top-to-bottom rerun analogue = quickSelfTest/quickAttnTest guards (PASS, deterministic); one-step-per-cell analogue = wave scripts per experiment (src/evidence/gseries-v2/, h2/ — PASS, small focused files); temp/output conventions = scratch/ + src/ split (PASS by construction).
Gap: no shareable bench notebook for others to re-run. Recommendation: a future bench notebook = thin wrapper calling the same guard entry points. Trial verdict: conventions already match; notebook itself DEFERRED (no gap yet).
