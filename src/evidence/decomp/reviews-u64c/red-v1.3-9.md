# U64c red-team v1.3 scout 9

## Brief
KILL-SHOT I: the AMBIGUOUS-MECH note (detT~=det branch b) creates silent-judgment debt: who decides (a) vs (b), by what rule? Quote the decision rule or prove none exists.

## Reply (verbatim)
KILL: FP-drift thresholding (+0.03/+0.10) lacks a defined convergence trigger, allowing silent-judgment debt in the AMBIGUOUS-MECH branch.

1. v1.3 banks FP-drift (~1e-7 vs +0.03/+0.10) but fails to specify the decision rule for (a) vs (b) in the AMBIGUOUS-MECH note; no rule exists in the filed baseline for resolving detT~=det.

HARDEST-TEST: Run seed s15 through DIAG-EXPLORE v2 and check for non-deterministic endpoint-rationale shifts across the +0.03/+0.10 drift window.

KILL-SHOT I: The AMBIGUOUS-MECH note lacks a formal decision rule; the system cannot programmatically distinguish branch (a) from (b) without manual override, violating the "stateless" requirement for automated verdict-name splitting.
