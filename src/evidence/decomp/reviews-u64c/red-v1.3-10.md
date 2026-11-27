# U64c red-team v1.3 scout 10

## Brief
KILL-SHOT J: prove RESP-EDGE-ONLY is reachable by noise-chasing (EDGE dead-band +0.03 with per-seed SE~0.035 at N=200) while ADAPT stays dead — i.e. the new label legitimizes a noise verdict. Numbers or BAREN.

## Reply (verbatim)
KILL: v1.3 legitimizes noise-chasing by introducing RESP-EDGE-ONLY as a valid exit state for variance-driven outliers.

1. The "verdict-name split" allows an EDGE-ONLY label to bypass the ADAPT primary rationale when FP-drift (+0.03) is eclipsed by per-seed SE (~0.035), effectively masking a DEAD result as an EDGE case.

HARDEST-TEST: Run N=200 per seed across s0/s2/s9/s12/s18; if variance triggers EDGE-ONLY while ADAPT remains dead, the label is a noise-sink.

KILL-SHOT J: $\text{SE} \approx 0.035$ vs $\text{drift} = +0.03$ means $P(\text{Noise} > \text{Drift}) > 0.5$; RESP-EDGE-ONLY converts stochastic failure into a categorized "edge" result.
