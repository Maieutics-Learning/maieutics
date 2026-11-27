# U64b audit-math v1.1 scout 1

## Brief
ROLE MATH-AUDITOR: check every number at n=20/N=150-200. (a) Per-seed edge +0.03 vs per-seed SE (E1 N=150: SE~0.04; E2 N=200: SE~0.035): does quorum-counting over 20 noisy seeds aggregate soundly, or does per-seed noise dominate? Show the arithmetic. (b) Floor 0.40 vs never-adapt null: derive the stuck-arm expectation from the diet fractions and say whether 0.40 sits above it. (c) Which threshold misbehaves worst at these n's? Name it.

## Reply (verbatim)
VERDICT: NEEDS-PATCH

1. **Noise Dominance:** $\text{SE}_{E1} \approx 0.04$, $\text{SE}_{E2} \approx 0.035$. Edge $+0.03$ is $< 1\text{SE}$. Per-seed noise dominates; quorum 15/20 requires a massive effect size ($\sim 2\text{SE}$) to avoid stochastic noise triggering a false PROCEED. Arithmetic: $\text{Binom}(20, 0.5) \to$ high variance; $0.03$ is statistically invisible at $N=150$.
2. **Floor Validity:** Diet-mix expectation $\mathbb{E}[\text{accRec}]$ depends on filed fractions. If $\text{diet} < 0.40$, the floor is a trivial bound. If $\text{diet} > 0.40$, the floor is an impossible hurdle. 0.40 is arbitrary without the specific diet-mix constants.
3. **Worst Threshold:** E1 Edge ($+0.03$). Lowest $N$ (150) and lowest SNR make it the primary source of instability.

HARDEST-TEST: Run 20 seeds with null-hypothesis (random) data; if PROCEED rate $> 5\%$, the $+0.03$ edge is a ghost.
