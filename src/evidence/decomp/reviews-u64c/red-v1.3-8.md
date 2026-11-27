# U64c red-team v1.3 scout 8

## Brief
KILL-SHOT H: prove W0 cannot gate what v1.3 added (name-split needs no gate; revealed-effect needs W1 data; drag needs W1 data) — i.e. v1.3's additions are all UNGATED by construction, making them unenforceable decoration. Name which addition lacks a W0 check.

## Reply (verbatim)
KILL: v1.3's verdict-name split is unenforceable as a decorative metadata change lacking a W0 gate.

1. verdict-name split is a structural change to the output string, not a functional gate; K-sufficiency-by-revealed-effect and explore-drag require W1 data for validation, meaning no v1.3 addition is gated by W0.

HARDEST-TEST: Trigger a verdict-name split on a W0-only trace; verify the split occurs without W1-dependent logic.

KILL-SHOT H: verdict-name split.
