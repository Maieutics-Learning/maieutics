# U70-prereg re-close 4 (metrology-FTD)

1. STANDS.
2. v1.1 correctly replaces "censored" with "FTD (failure to detect)" and explicitly mandates that these are recorded rather than silently omitted. This resolves the barrage finding regarding biased delay distributions.
3. The update to G1 (FTD $\le$ 10%) now aligns with the recording mandate, ensuring a hard failure threshold rather than a soft censoring window.
4. No new flaws introduced; the shift from "censored" to "FTD" maintains logical consistency with the U64e conventions while tightening the metrology for Phase E gating.