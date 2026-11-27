# U64b red-team v1.2 scout 10

## Brief
KILL-SHOT 10: prove this track's question is already answered by filed U64 artifacts (no new measurement possible). Cite the filed ledger fields that already contain E1/E2 answers. If they don't exist, go BAREN on this angle.

## Reply (verbatim)
KILL: BAREN

1. Filed U64 trunks are frozen, but the prereg specifies "novel 4th hot set" for E2 and "reads-only re-eval" for E1. The filed ledger contains the base vectors, but the specific exam-driven selection (seeds, ruleDrawCount, and the novelCandidates set) is generated dynamically via `G.makeRng` during execution, not pre-recorded.

HARDEST-TEST: Verify if `novelCandidates` can be derived deterministically from the frozen `driverHash` without running the `G.makeRng` logic.
