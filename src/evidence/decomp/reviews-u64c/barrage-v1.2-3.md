# U64c barrage v1.2 scout 3

## Brief
ANGLE diag-final: grade DIAG-EXPLORE v2 (three comparisons, ceiling noted, AMBIGUOUS-MECH note). Can the (b) branch (reset-helps-explore-hurts offsetting) EVER be resolved without a new arm, or does the note just park an unresolvable ambiguity? If unresolvable, say whether that voids the diagnostic's purpose.

## Reply (verbatim)
VERDICT: IMPLEMENTABLE

1. The `AMBIGUOUS-MECH` note acknowledges a potential confound between reset-benefits and exploration-costs. Without a dedicated arm to isolate these, the ambiguity is mathematically unresolvable within this framework. However, this does not void the diagnostic purpose; the `orT adapt ceiling` and `detT-det joint` comparisons provide a boundary for the effect size. If the "hurt" of exploration is smaller than the "help" of the reset, the signal persists. The dead-seed pre-analysis (s0/s2/s9/s12/s18) correctly adjusts the quorum expectation to 15/15, maintaining statistical rigor despite the 20-seed sample.

HARDEST-TEST: Verify 15/15 pass rate on the 15 viable seeds; any single failure in the non-dead set triggers RESPONSE-DEAD.
