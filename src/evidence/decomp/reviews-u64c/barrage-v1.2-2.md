# U64c barrage v1.2 scout 2

## Brief
ANGLE endpoint-final: grade ENDPOINT-RATIONALE (ADAPT primary, one-legged WORKS labeled). Does a RESPONSE-DEAD-on-EDGE + WORKS-on-ADAPT verdict risk being read as a full win downstream (U64d/U65 licensing)? Is the label strong enough, or must one-legged WORKS carry a different verdict NAME (e.g. RESPONSE-PARTIAL)? Exact fix or stand down.

## Reply (verbatim)
VERDICT: NEEDS-PATCH

1. Labeling a "one-legged WORKS" (ADAPT primary, EDGE fail) as RESPONSE-WORKS creates a semantic collision. In U64d/U65 licensing, a binary WORKS verdict typically implies full-spectrum stability. Since EDGE is confirmatory but the failure is absolute (DEAD), "RESPONSE-WORKS" is a false positive for system-wide robustness. This risks downstream propagation of an unstable seed-set or a fragile adaptation ceiling. You must differentiate the verdict name to prevent the licensing layer from treating a partial success as a total win. Use RESPONSE-PARTIAL or RESPONSE-ADAPT-ONLY.

HARDEST-TEST: Check s18 (dice 0.9267) against the 15/20 quorum. If the "one-legged" win occurs here, the 0.0267 delta from 1.0 proves the failure is an inherent floor, not a fluke.
