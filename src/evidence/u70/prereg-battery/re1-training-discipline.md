# U70-prereg re-close 1 (training-discipline)

1. STANDS.
2. The 10/10 barrage identified a "best-by-train-loss" selection bias in v1.0. v1.1 explicitly bans this "mini-sweep" and mandates a single restart per seed-path tied to the initial RNG.
3. The addition of the truncated BPTT window (50) with state carry-over and a 1.0 grad-clip provides a concrete, reproducible training discipline that prevents the instability previously masking selection bias.
4. Prior reviews overlooked the "best-by" loophole; v1.1 closes this by enforcing a fixed-seed trajectory. No new flaws introduced.