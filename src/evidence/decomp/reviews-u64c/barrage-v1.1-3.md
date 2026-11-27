# U64c barrage v1.1 scout 3

## Brief
ANGLE washout-revenge: RESP-EDGE under the old exam — v1.1 kept the bar while admitting the exam washed out orF (more info than detT). If detT.two cannot beat dice.two+0.03 because the STATIONARY exam compresses all arms to 0.25-0.52 (filed U64 band), RESP-EDGE is a dead bar and RESPONSE-WORKS rides on ADAPT alone. Is a one-legged PROCEED honest? Demand the bar's removal, defend it, or stand down.

## Reply (verbatim)
VERDICT: NEEDS-PATCH

1. K=10 is arbitrary; $4H_4 \approx 8.33$ is the expected value, not a bound. Probability of not seeing all 4 symbols in 10 slots is $\approx 14\%$. Resetting on TRUE boundaries with a $14\%$ failure rate introduces stochastic noise into the "deterministic" arm, potentially masking drift or inflating ADAPT via fluke exploration. 
2. RESP-EDGE is a ghost bar. If the U64 band compresses all arms to $0.25 \text{--} 0.52$, a $+0.03$ margin is noise, not signal. Relying solely on ADAPT $\ge +0.10$ for a "WORKS" verdict is a one-legged proceed. 

HARDEST-TEST: Run 20 seeds; if $\text{detT.two} < \text{dice.two} + 0.03$ in $>5$ runs, the bar is dead. Remove RESP-EDGE or tighten K-derivation to $K \ge 20$ to ensure symbol saturation.
