# Round 5 raw — steelman closer on v4 (S1/S2/S3)

## S1

1. VERDICT: HOLD

2. STRONGEST POINT: The architectural separation of the "agreement" metric as a read-only thermometer—enforced by a separate-process scoring harness that cannot access or modify weights—effectively neutralizes the "right/wrong answer" feedback loop during distillation.

3. PRICED RESIDUAL: Uncertainty remains regarding whether the "VOID-first" diagnosis can perfectly isolate student failure from tutor degeneracy; retiring this requires a formal proof that the entropy/confidence gates are sufficiently sensitive to distinguish a "dead" tutor from a "learning" student.

4. HARDEST TEST: The R2 falsifier: if a student trained on recombined patterns is statistically indistinguishable from a student trained on random noise (via a two-sample test on output distributions, $\alpha=0.05$), the claim of pattern transmission is dead.

---

## S2

1. VERDICT: HOLD

2. STRONGEST POINT: The v4 control set eliminates false positives by requiring the signal to survive three distinct filters: random-init twins (architectural bias), permuted-pairing (content-free agreement), and frequency-matched fresh lines (marginal-overfit), ensuring that any remaining agreement is strictly due to transmitted patterns.

3. PRICED RESIDUAL: Uncertainty remains regarding the "transmission dead" threshold of the R2 falsifier; retiring this requires a calibrated power analysis of the two-sample test to define the minimum detectable effect size.

4. HARDEST TEST: A "frequency-matched" control set (Control #5) yielding agreement $\ge 0.20$ above the permuted baseline, which would prove the student is responding to marginal token distributions rather than the tutor's specific pattern.

---

## S3

1. VERDICT: HOLD

2. STRONGEST POINT: The two-half round-trip gate prevents bias-driven success by requiring that agreement significantly exceeds the permuted baseline ($\ge 0.20$) while maintaining a raw accuracy threshold ($\ge 0.50$), effectively isolating generative signal from statistical noise.

3. PRICED RESIDUAL: Uncertainty remains regarding whether the "frozen" input search can avoid collapsing into a few high-probability tokens; retiring this requires a full-distribution entropy audit of generated samples.

4. HARDEST TEST: A "marginal-frequency overfit" check—comparing agreement on the generated set versus frequency-matched fresh lines—where failure to maintain the $\ge 0.20$ gap would falsify the claim of generative reality.

---

