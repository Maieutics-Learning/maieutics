# U64c barrage v1.1 scout 4

## Brief
ANGLE det-control: filed det is pick-max NO-reset — but is it the right reset-disabled control for detT? detT's post-trigger explore changes its LATER trajectory; det never explores. detT~=det could mean (a) reset inert, or (b) reset helps but explore hurts equally. The diagnostic cannot separate (a)/(b). File the missing third comparison or prove (b) impossible.

## Reply (verbatim)
VERDICT: NEEDS-PATCH

1. DIAG-EXPLORE is insufficient. Comparing `detT` (reset+explore) against `det` (no-reset, no-explore) conflates two variables. If `detT` $\approx$ `det`, you cannot distinguish between "reset is inert" and "reset is beneficial but negated by the $K=10$ exploration penalty." To isolate the reset mechanism, you need a `det-reset` arm (reset without explore). Without this, the $\sim 1\text{e-}7$ drift check only proves stability, not the efficacy of the trigger.

HARDEST-TEST: `det-reset` vs `det` (no-explore baseline) to isolate reset-trigger gain.
