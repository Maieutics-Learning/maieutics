# U64e round-2 reply r2-B7 (verbatim, 2026-11-27)

1. **Verdict: NEEDS-PATCH.**
2. **Analysis:** The b0 > 50 guard is dead code. Filed boundaries are 200 +- 40; the lower bound (160) is > 3x the guard threshold. No standard seed-generation variance in a frozen-weight, reads-only eval (U64b-E1) shifts the burn-in mean by 110 units unless the stream is corrupted, which is a system failure, not a premise trigger.
3. **Hardest Falsifier:** The "joint bound 0.041" for TRIGGER-INSENSITIVE. If randBlind and surBlind both clear, the demotion is mandatory. Test this by forcing a high-variance seed stream that trips the b0 guard (if possible) while maintaining accRec stability; if the joint bound collapses under b0 volatility, the logic is non-robust.
4. **Stale Complaint:** The b0 guard was added to address burn-in, but v1.1 fails to define the actual trigger mechanism for b0 relative to the 200 +- 40 boundaries.
