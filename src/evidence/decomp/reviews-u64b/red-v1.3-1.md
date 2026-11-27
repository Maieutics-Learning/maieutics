# U64b focused re-close red v1.3 scout 1

## Brief
KILL-SHOT A: the ruleDrawCount range assert is unenforceable, miscalibrated (wrong bounds), or masks a real failure mode. Prove it with the filed draw recipe (verbatim Wave-0 replay + <=20 redraws, 2 always-valid sets).

## Reply (verbatim)
KILL: (a) ruleDrawCount range assert | BAREN

1. The range `Wave-0 draws < count <= Wave-0 draws+20` is fundamentally miscalibrated against the filed draw recipe. Because the recipe permits `verbatim Wave-0 replay + <=20 redraws`, a legitimate sequence of exactly `Wave-0 draws` (a pure replay) fails the strict `>` lower bound, triggering a false-positive kill on valid seeds.

HARDEST-TEST: Run a pure Wave-0 replay without redraws.

KILL-SHOT A: The assert `Wave-0 draws < count` rejects the base case of the draw recipe (verbatim replay), rendering the hardening counter-productive by masking valid 0-redraw state transitions.
