# U64b barrage v1.0 scout 9

## Angle
ANGLE rival: state ONE rival mechanism under which EDGE-E1 passes that is NOT 'detection matters' (e.g. orF trunk's counts are last-quarter-fresh while det/dice carry stale counts across switches — a freshness artifact, not information value). Give the cheapest killer test and say whether the design contains it; if not, file the exact patch.

## Reply (verbatim)
VERDICT: NEEDS-PATCH

1. E1 may pass via "freshness artifact": orF trunks retain high-frequency updates from the final boundary, whereas dice arms average stale counts across the 50-slot recovery window. This rewards recency, not recovery.

HARDEST-TEST: Shuffled-Recovery-Order. Randomize the 50 slots per boundary instead of sequential reading. If orF.accRec drops to dice levels, the effect was temporal leakage, not memory. 

DESIGN STATUS: Missing. Patch: Modify E1 to draw slots via `G.makeRng` shuffle per trunk.
