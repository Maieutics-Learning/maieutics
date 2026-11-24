# Fresh-eyes newai-v10 battery (3 sealed, 2026-11-24)

Raw: `scratch/fresh-eyes-newai-v10-3x.txt` (2565B). Spec: `src/evidence/decomp/newai-v10-prereg.md`.

## Raw (verbatim)

### R1
1. **Verdict:** PARTIAL. 2. **Hardest Quantitative Hole:** The $\text{enrich} \ge 3.5$ requirement is statistically unstable against $N=400$ paired evals when combined with a $\text{record-search}$ policy duplicate $\le 0.10$. Specifically, the "tie-inflated enrich" effect occurs because the $\text{B\_reh}=2$ disagree-selected rehearsal creates a low-entropy cue environment, making a $3.5$ enrichment gap statistically indistinguishable from noise (Standard Error too high for $N=400$ at the $\text{PROBE}$ bar). 3. **Fix:** Increase sample size to $N=1200$ or implement a Bayesian shrinkage estimator for $\text{enrich}$ to decouple it from the $\text{B\_reh}$ rehearsal bias; alternatively, lower the $\text{record-search}$ tolerance to $0.05$ to sharpen the $\text{auditGap}$ contrast.

### R2
1. **Verdict**: PARTIAL. The spec defines a high probe rate ($\ge0.66$) and "owning invocation," but the reliance on "delayed cue-only query" and "twin-matched seed-only streams" implies a multi-step feedback loop or seed-dependent retrieval. A single forward pass cannot resolve ownership if the "cue" is delayed. 2. **Build Gap**: The gap is between *invocation* (the intent to call a tool) and *execution* (the result). Without hidden tools at test, the model cannot "verify" in one pass; it can only *predict* a verification. The "delayed cue" suggests the ownership is validated asynchronously, not atomically. 3. **Cheapest Code Test**: A seed-matched twin-stream contrast: `diff(model(seed_A, prompt), model(seed_A_twin, prompt))` If $\Delta$ variance exceeds the `calGap` threshold while maintaining `enrich >= 3.5`, the "ownership" is a stochastic artifact, not a functional capability.

### R3
1. **Verdict:** PARTIAL. The spec captures functional metrics and a rigorous N=400 paired eval, but "owning invocation" is fragile without a formal causal loop. 2. **Rival Mechanism:** *Cross-Seed Interference (CSI)*. Instead of twin-matched streams, use a staggered-seed offset to detect if "ownership" is just a seed-leakage artifact rather than true self-learning. 3. **Cheapest Killer Test:** *The Zero-Shot Seed Swap*. Run the "OWN-GAIN" bar on a seed-pair where the "twin" is replaced by a random baseline. If the delta disappears, the "ownership" is merely a pattern-match of the seed, not a functional capability. 4. **Contains?** No. The spec relies on "twin-matched seed-only streams," which optimizes for consistency but fails to prove causality.

## Adjudication (agent owns verdict)

- R1 PARTIAL with reason, fix REJECTED as threshold move. N stays 400 paired (SE~0.022; bar 0.03 ≈ 1.4 SE — tight but quorum decides, A2 precedent). Enrich tie-inflation filed openly as limitation (threshold sortedD[floor(6/4)] hits tie mass at 0; rand/shuf enrich 3.4-4.0 descriptive-only; auditGap is the gated metric, enrich is corroboration with bar 3.5 kept, not moved). No N=1200 (cost), no Bayesian (new machinery), no 0.05 tightening (tuning to reviewer).
- R2 PARTIAL, clarification ADOPTED as pin (no code change): invocation vs execution split is correct — model predicts verification (difficulty/failure forecast + pre-flight), in-run mini-quorum executes it. Mini-quorum is in-run compute (same trunk, same budget), never an external tool call at test. Delayed cue-only query is the payoff phase (bind→rehearse→query), validated across phases, not atomically in one pass — filed explicitly in v10.1. Twin-stream contrast test parked as after-series (needs twice the trains; not the cheapest now).
- R3 PARTIAL, rival CONTAINED: CSI/seed-swap is a real rival (seed-leakage vs ownership). Design contains it partially via seed-only streams + arm-coded selRng only (A2 fix) + paired eval (shared selRng). Zero-shot seed-swap filed as graduation probe (after-series), not a gate — running it now doubles evals without deciding the first question (does own beat rand/none with teeth?).

Amendment v10.1 (pins only, zero train/eval changes): enrich tie-soft filed; mini-quorum = in-run compute; seed-swap parked; probe priced (each check costs budget, paranoia capped). Battery score: 3 PARTIAL, 0 real gaps, 0 threshold moves.
