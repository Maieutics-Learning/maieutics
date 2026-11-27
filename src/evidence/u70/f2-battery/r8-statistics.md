# U70-F2 scout 8 (statistics)

1. **Transfer-Fairness Violation:** Phase 2 compares F2-V3 (z-only head) against V2 (h-only). Because V2 was retrained "fresh" on the same seeds but lacks the structural z-bottleneck, the comparison is an unfair architectural mismatch. Any advantage in F2 is confounded by the structural cut, not the learned representation, rendering the "transfer" metric a measure of architectural constraint rather than generalization.

2. **Verdict-Logic Flaw:** The "N2-TRANSFER" label requires $F2_{ctxAcc} \geq V2_{ctxAcc}$ in $\geq 3/4$ regimes. Since V2 is h-only (no z-probe), $V2_{ctxAcc}$ is undefined or zero by definition of the probe. This makes the bar a triviality (a "disguised sweep"), guaranteeing a pass regardless of actual transfer performance.

3. **Bar-Integrity:** The gap metric ($F2_{act} - \max(cueAct, F2-V4_{act})$) is unstable across the 20-seed average if the V4 shuffle is not strictly paired per-seed.