# Wave 200 note — backlog-W172 lag-price elicitation (sandbox, executed)

STOP RULE: stopped after 21-cell rerun (3 regimes x 7 policies x 500 trials) + lambda* table (no powered/CRN runs — numerators at noise level, spawned as W189). 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (vendored w155 rig + Lbar; W180's cells re-measured, consistent: narrow K2 lag 18/miss .022, K25 lag 22.5/mean .7445). Clock: R30 5/5 FULL.

## Direct: lambda* is regime x k specific; mid-K25 never clears; wide has a triple point

Model: total(λ) = mean − λ*Lbar, Lbar = E[lag|detected]*(1−miss) + 100*miss (miss billed at horizon residual E[T−driftAt]~100; mean already contains miss/ablation/lag PHYSICS — λ is impatience-only, no double count; miss price μ derivable as forgone reward wide .30/mid .15/narrow .10, kept out of λ*). Adaptive(k) clears fixed-minimax(0.4,5) iff λ > λ* = (mean_f − mean_a)/(Lbar_f − Lbar_a). Pre-registered: (a) narrow small-positive λ* ✓-stronger (~0); (b) wide large-or-negative — REFINED (split by k); (c) stricter-k → higher λ* — REJECTED as stated (k-choice flips by regime, not monotone).

λ* table (λ in mean-reward units per lag-pull; mean ~.75):
- narrow: K25: mean +.0017 (noise ±.0015!), Lbar −1.2 → λ* ≈ −.001 (clears at any λ ≥ ~.001, possibly 0 — essentially TIED, adaptive gets the nod on lag). K2: .0029/8.1 → λ*=.0004. K15: .0224/16.2 → .0014 (big lag buy, big mean price). K3: never (collapses: miss .156).
- mid: K25 NEVER (worse mean +.002 AND worse Lbar −1.7 — fixed dominates outright; the minimax-k is mid-inferior). K2: .0075/3.4 → λ*=.0022 (ONLY K2 clears in mid). K3: never.
- wide: K25: .002/.3 → λ*≈.007 (Lbar nearly tied 6.1 vs 5.8 — denominator ~noise, band wide; treat as tie favoring fixed). K2: never (trigger-happy: abl 1.27). K3: mean −.0033 (BETTER), Lbar +.6 (worse) → clears iff λ < .0055 (UPPER bound — the mean-play with a lag budget). Triple point ~.006: cheap-lag → K3, pricey-lag → K25, gap (.0055,.007) → fixed wins it.
- Honesty band: mean-diff se ~.0015 makes λ* numerators noise-level (narrow K25 ±, wide K25 ±); denominators (Lbar diffs) solid except wide-K25 (~.3). Directions solid (signs of both diffs), decimals provisional — W189 (CRN + n=2000) firms them.

Verdict: USED (λ* map + never-cells + triple point + noise bands). No precursor, no conflict.

## Tangential: price impatience separately from physics (0-spend, reasoning only)

Mean already bills everything physical (missed pulls, blind pulls, late pulls) — yet adaptive still needs λ to win, because its advantage (speed) is partly a preference, not just pulls. The general split: every policy comparison = physics ledger (in the simulator's own currency: pulls, serves, bills) + impatience ledger (λ × waits, d × delay). W198's (r,d) map did the same split (errors vs delay). Waves that report only one ledger force the reader to smuggle the other — W180's "adopted iff lag is priced" was the physics ledger asking for its impatience twin; this wave delivers it. Template: total = measured-mean − λ×measured-waits, then elicit λ*, never assume it.

## Spend / queue

- Spend: 0 + 0 + 1 grid (21 cells x 500 trials + λ* table; floor). Consumed backlog-W172 removed; spawned W189 to BACK. Backlog 17. Synthesis R30 clock: 5/5 FULL.
- W189 (C, sandbox): λ* precision + triple-point mapping — CRN across policies + n=2000 (mean-diff se .0015→~.0005); map wide triple point; confirm mid-K2/mid-K25-never; same rig, same cells.
