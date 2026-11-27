# U64b red-team v1.2 scout 8

## Brief
KILL-SHOT 8: find one LOAD-BEARING quantity that is logged but invisible to every gate AND to every diagnostic (a number that could flip the scientific reading while all verdicts stay green). Name it.

## Reply (verbatim)
KILL: ruleDrawCount is a load-bearing quantity logged in E2 but invisible to all verdicts, diagnostics, and the firewall.

1. E2 logs `ruleDrawCount` after `ruleRng` draws; however, the firewall reads only `{accRec,accTra,stackHash,examHash}`, and the FLOOR/EDGE bars depend solely on accuracy and dice. A massive `ruleDrawCount` (indicating excessive redrawing to find a valid novel set) would signal a failure in the "adjacent-differ" constraint's practical feasibility, yet the system would still report PROCEED.

HARDEST-TEST: Run the E2 novel set generator with a restricted `redraw` limit of 1; if `ruleDrawCount` exceeds 1, the trial must HALT.
