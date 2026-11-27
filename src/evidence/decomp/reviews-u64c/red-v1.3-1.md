# U64c red-team v1.3 scout 1

## Brief
KILL-SHOT A: the verdict-name split (WORKS/ADAPT-ONLY/EDGE-ONLY/DEAD) creates a NEW undefined state or perverse incentive (e.g. EDGE-ONLY+MECHANISM-SURPRISE has no decision rule; or ADAPT-ONLY gets read as WORKS despite the rename). Name the exact broken state.

## Reply (verbatim)
KILL: The verdict-name split introduces an ambiguity where ADAPT-ONLY lacks a decision rule for K-sufficiency-by-revealed-effect, causing an undefined transition to WORKS.

1. "verdict-name split" + "K-sufficiency-by-revealed-effect" lacks a mapping for ADAPT-ONLY; if effect < K, the state is undefined vs DEAD.

HARDEST-TEST: Force ADAPT-ONLY with revealed-effect < 10.

KILL-SHOT A: ADAPT-ONLY + revealed-effect < 10 = Undefined State (no mapping to DEAD or WORKS).
