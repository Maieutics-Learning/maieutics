# F15 barrage r8 — scope (verbatim, 2026-11-28)

Angle: scope: any second variable (LR/epochs/steps changed in disguise)

1. **Verdict**: STANDS.
2. **Analysis**: The premise strictly isolates the training distribution. By fixing total gradient steps (200 epochs across 8 trajectories), the model cannot smuggle a win via increased exposure or modified learning rate. The round-robin schedule is a linear permutation of the F14 single-trajectory regime; it changes the *sequence* of samples, not the *volume* of updates. The use of a pre-registered disjoint pool $P(s)$ prevents leakage from the held-out set (seeds 20..39).
3. **Hardest Falsifier**: A "Step-Count Audit." Compare the exact number of optimizer `.step()` calls in the F15 round-robin loop against the F14 single-trajectory loop. If F15 executes $>200$ steps per seed, the "identical steps" claim is falsified, and the result is a confounding variable of increased training duration rather than distributional diversity.
