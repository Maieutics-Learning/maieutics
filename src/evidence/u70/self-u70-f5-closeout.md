# U70-F5 Wave 1 closeout — verdict F5-PERSISTS (init lottery dominates, 2026-11-27)

Execution: owner "Go for it" = execution on exact F5 v1.2 (F4-exact base + 3 pre-registered inits; k=0 replication-only, primary 40 new-init runs). Driver `u70-neural.js` (initBase 90000/94000/98000, sampling fixed). 60/60 rows, 0 invalid. Ledgers: `d-u70-neural-f5-k0/k1/k2.json`, gates `d-u70-f5-gates.json`.

## Replication (pre-registered sanity)
k=0 vs filed F4 same-seed: max abs diff **0.0000** across probe/ctx/gap. Driver deterministic; replication exact. Proceed.

## Numbers (primary = 40 new-init runs)
- probe pooled MEAN **0.5185** (fail) / MEDIAN **0.5783** (fail) / 16/40 runs pass
- gap pooled MEAN **0.1246** (pass) / MEDIAN **0.14** (pass) / 38/40 pass — hands still obey whatever dial forms, even in collapsed runs
- ctx mean 0.8618
- Consistency per seed (k1,k2): **3 both-pass / 10 split / 7 none-pass**. Only 3/20 seeds robust to rebirth; 7/20 fail on both new inits.

## Verdict: F5-PERSISTS (probe pair fail under v1.2 locked boundaries)
No bar moved. The v1.2 median companion changes nothing here — both fail together.

## Reading (the point of #2, answered cleanly)
F4's FIXED is init-fragile. Same streams, same teacher, only the birth RNG changes — and the dial goes from 0.72 pooled to 0.52 pooled, with 7 seeds dead on both rebirths and 10 coin-flips. The sharpening is real *when it forms* (gap holds everywhere; 3 seeds pass twice), but formation is a lottery, not a discipline outcome. This is not overtraining (same 200 epochs) and not cherry-picking (no picking occurred — the mean over all 40 is the verdict).
Next: de-lotterize (init-robustness / symmetry-breaking / ensemble) before any Phase-2 spend. F4 FIXED stands as filed for what it was (existence + load-bearing use); F5 qualifies it (not robust). NO PUSH without order.
