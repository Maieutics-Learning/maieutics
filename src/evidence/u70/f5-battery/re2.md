# F5 re-close re2 (verbatim)

NEEDS-PATCH

1. **Causal Smuggling**: By defining the "Primary Sample" as a pooled probe/gap over 40 runs (k=1,2 $\times$ 20 seeds) to determine the verdict, v1.1 implicitly adopts a "mean-of-runs" logic. This effectively treats the 40 runs as a single batch to calculate a global average, which is functionally identical to the "mean-vs-single" category error the barrage objection targeted. It replaces the "mean-of-means" (k-average then seed-average) with a "flat-mean," but still uses a pooled average to trigger a binary verdict, failing to isolate the "single-run" stability requirement.
