# U64c barrage v1.1 scout 1

## Brief
ANGLE K-grade: is the coupon-collector derivation (4*H4~=8.33 -> K=10) SOUND for this diet (75% familiar / 12.5% OOD / 12.5% uniform draws — NOT uniform qk draws)? Under diet-mix, E[slots to observe all 4 qk] differs from 8.33. Recompute under the filed diet or show the deviation is conservative (K=10 still covers). Numbers or stand down.

## Reply (verbatim)
VERDICT: NEEDS-PATCH

1. Coupon-collector $E[X] = \sum (1/p_i)$ assumes uniform probability. Under filed diet (75% familiar, 12.5% OOD, 12.5% uniform), the probability of drawing the rarest $qk$ is $\le 0.125$. $E[X] \ge 1/0.125 = 8$. Summing all four: $1/0.75 + 1/0.125 \dots$ is not 8.33. If the 4 $qk$ are distributed across these buckets, $K=10$ is likely insufficient to guarantee a full observation sweep, making the "margin" negligible or negative. Derivation is unsound for non-uniform draws.

HARDEST-TEST: RESP-ADAPT (detT.adapt $\ge$ dice.adapt + 0.10)
