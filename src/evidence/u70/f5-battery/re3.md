# F5 re-close re3 (verbatim)

NEEDS-PATCH

1. The "Pooled probe/gap over 40" is a mean-of-runs calculation. By requiring `pooled-40 probe ≥0.70`, the verdict is determined by the average performance across runs rather than a "single-run meaning." This smuggles the mean-vs-single category error back in: a few lucky high-performing seeds (lottery) can pull a failing distribution above the 0.70 threshold, masking the failure of the majority of runs to hit the bar.
