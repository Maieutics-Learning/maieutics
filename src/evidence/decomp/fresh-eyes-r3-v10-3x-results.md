# Fresh-eyes r3-v10 battery (3 sealed, pre-compute) + adjudication

Replies verbatim; adjudication after.

## R1 (rival) — VERDICT: CONDITIONAL — verbatim

(a) **K3R:** The label distribution $y = (v+3)\%4$ is a cyclic permutation of a uniform distribution; thus, $y$ remains uniform. However, the input distribution is skewed: the token $k=3$ now appears with $\approx 62.5\%$ frequency (half the lines are forced $k=3$, the other half are random $k \in \{0..3\}$) compared to the baseline $25\%$. Any observed lift could be attributed to **token-frequency familiarity** (the model seeing "3" more often) rather than an actual repair of the "k3-skill." There is no control group (e.g., forcing $k=2$ with a corresponding label shift) to decouple frequency from specific value-repair.

(b) **ENS:** The "rescue" relies on $a4$ being independent of $cb$. Since $a4$ is trained on the same data/seeds family, it is highly likely that $a4$ and $cb$ share **correlated errors**. If they fail on the same hard cases, the rescue rate will be $\approx 0$ regardless of $a4$'s quality. The bar tests the *marginal* gain of a second opinion, but the lack of architectural or data diversity makes the "rescue" statistically fragile.

(c) **DLR:** The 8-vs-7 split uses a fixed dataset ($DL$) that was trained on a 50/50 distribution. The reported $|gap| \le 0.10$ is a measure of performance variance across delimiters. Without a **paired design** (e.g., testing the same semantic content across both delimiters), the gap is indistinguishable from sampling noise inherent in how lines were assigned to delimiters. A gap of $0.10$ on a sample of 200 is not statistically significant enough to prove "asymmetry" versus random variance.

VERDICT: CONDITIONAL

## R2 (enforceability) — VERDICT: CONDITIONAL — verbatim

**1. K3R Line Override**
*   **Gap:** The spec states "first 75 of 150 shift lines force k=3," but does not specify if this is per-batch, per-epoch, or a static subset of the dataset. If the DRNG order matters (which it does for stochasticity), the lack of a defined "shuffle point" relative to the override creates non-deterministic training.
*   **Requirement:** Define if the 75-line override is applied *before* or *after* the `sh` shuffle.
*   **Status:** MUST-FIX.

**2. x' Construction**
*   Gap/Requirement: exact array-index mapping for `x'` vs original `x` in `composeGenShiftScr`.
*   **Status:** TOLERABLE (can be inferred by implementer, but risky).

**3. K3R Per-k Oracle Readout**
*   Gap/Requirement: oracle input tensor shape + sample size n per k.
*   **Status:** MUST-FIX.

**4. ENS Fallback Input**
*   Gap/Requirement: single-sample vhat_b projection vs multi-sample context.
*   **Status:** TOLERABLE.

**5. DLR Split Builds**
*   Gap/Requirement: post-generation replacement vs modified rng stream; contiguous vs sampled.
*   **Status:** MUST-FIX.

VERDICT: CONDITIONAL

## R3 (falsifiability) — VERDICT: ENFORCEABLE — verbatim

**1. K3R-REPAIR**
*   **Rule:** (K3R $k_3$-oracle $-$ T2 $k_3$-oracle) $\ge 0.05$ for $\ge 2/3$ seeds.
*   **Ambiguous Outcome:** $0.01 \le \text{lift} < 0.05$ ("near-miss").
*   **Prediction:** $+0.07$ lift. (Mechanism: gradient frequency 25%→~62% reduces systematic off-by-one in weak bin.)

**2. ENS-FALLBACK**
*   **Rule:** (ENS.composed $-$ T6.composed) $\ge 0.02$ for $\ge 2/3$ seeds.
*   **Ambiguous Outcome:** Result $\le 0$ (a4 fallback worse than cb on disagreement lines).
*   **Prediction:** $+0.03$ lift. (Mechanism: a4 tie-breaks cb failures.)

**3. DLR-SYMMETRY**
*   **Rule:** $|acc8 - acc7| \le 0.10$ for $\ge 2/3$ seeds $\to$ SYMMETRIC; else ASYMMETRIC.
*   **Ambiguous Outcome:** Gap exactly $0.10$ / fluctuates.
*   **Prediction:** Gap $\approx 0.15$ (ASYMMETRIC). (Mechanism: 7-collision noise.)

VERDICT: ENFORCEABLE

## Adjudication (pre-compute)

- R1a (frequency vs repair): FAIR, no spare budget for k2-control → ADOPTED read lens (no new trains): repair = k3-lift MINUS mean(k1,k2-lift). General-dose lifts all bins; true repair concentrates on k3.
- R1b (correlated errors): NOTED openly; bar is small (+0.02) and rescue-rate reported raw — correlation pushes toward 0, which is itself the answer (second opinions don't help). No change.
- R1c (unpaired DLR): ADOPTED — DLR goes PAIRED: same 200 shift lines, delim forced all-8 vs all-7 (post-generation mapping). Same semantic content both ways.
- R2 MUST-FIXes → v10.1 pins: override = static dataset subset (first 75 shift draws forced k=3, BEFORE concat+shuffle); x' = composeGenShiftScr layout with k→3 and y recomputed (slot/marker untouched); per-k oracle = K3P construction (n=200 total, true-v flat+[qk,k,v,8], srng 52500+seed); ENS disagree = single line with vhat_b only (vhat_a discarded); DLR = paired post-generation mapping on same 200 lines.
- R3: rules stand; recorded predictions (K3R +0.07; ENS +0.03; DLR gap ~0.15 ASYMMETRIC).

## Amendment v10.1 (read-lens + pins; zero design changes otherwise)
K3R repair-vs-frequency lens; ENS correlation noted; DLR paired; build pins as above.
