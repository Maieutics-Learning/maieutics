# U64e round-2 reply r2-B9 (verbatim, 2026-11-27)

1. **NEEDS-PATCH**.
2. **Falsifier**: The "TEETH" demotion rule creates a leakage path between randBlind and surBlind that invalidates the 0.041 joint bound. Since randBlind uses a seed-offset stream (53800 + seed) but the trigger condition relies on a trailing-8 mean, any temporal correlation in the stream's PRNG output will trigger a false-positive demotion to TRIGGER-INSENSITIVE, masking genuine closed-loop failures.
3. **Technical Gap**: v1.1 fails to define the sampling frequency of the "trailing-8" window relative to the randBlind step size. Without a specified sampling interval, the "burn-in mean" is spatially unstable, making the trigger condition stochastically noisy. The recursion cap on the F-tree is a band-aid; if F3 (floor) is hit, the 0.40 floor is likely a systemic bias, not a shape-specific failure.
