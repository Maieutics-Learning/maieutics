# U64c barrage v1.1 scout 10

## Brief
ANGLE implement-2: can a driver enforce 'uniform explore K=10 then exploit' with zero judgment (RNG for explore draws: which stream? explore draws consume dataRng — does that shift all subsequent draws vs det, breaking matched-trajectory comparisons)? Name the stream-accounting rule missing from v1.1 or confirm present.

## Reply (verbatim)
VERDICT: NEEDS-PATCH

1. Stream-accounting is absent. `detT` consumes `dataRng` for `K=10` exploration draws, shifting the RNG state relative to the `dice` control. Since trajectories are compared via matched seeds, this state-drift invalidates the "same-driver twins" assumption. The `dataRng` must be branched or buffered to ensure the exploit phase of `detT` aligns spatially with the `dice` trajectory.

HARDEST-TEST: FP-DRIFT cross-run check (verify $\Delta \text{RNG} = 0$ at exploit-onset).
