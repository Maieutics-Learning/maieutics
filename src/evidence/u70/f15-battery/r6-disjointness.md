# F15 barrage r6 — disjointness (verbatim, 2026-11-28)

Angle: disjointness: does P(s) stay disjoint from held-out s+20 and across s, what leak survives T9

1. **Analysis**: Disjointness is mathematically guaranteed by the pool formula $P(s) = \{1000 + s \cdot 8 + k, k=0..7\}$. For any seed $s \in [0, 19]$, the maximum index is $1000 + 19 \cdot 8 + 7 = 1159$. The held-out set starts at $s+20$ (index $20$ for seed $0$, or generally indices $20..39$ in the original seed space). Since $1000 > 39$, there is zero index overlap between training pools and held-out sets. T9 (ledger grep) ensures no seed index is reused across $s$. No leak survives.

2. **Verdict**: STANDS.

3. **Hardest Falsifier**: A "Cross-Seed Correlation Attack." If the `u70nGenPath` or `u70nGenObs` functions utilize a global seed or shared state rather than strictly localizing to the provided $s$, the disjointness of indices is an illusion; the model would be leaking information via the generator's internal state. Verify that $\text{Gen}(s_i)$ and $\text{Gen}(s_j)$ are statistically independent for all $i \neq j$.
