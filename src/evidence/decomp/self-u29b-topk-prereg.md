# Self U29b delta-prereg: top-k hinge on query-conditioned INH (PROPOSED; pre-countersigned, battery next)

Agent approval: this file. Pre-countersignature (user 2026-11-25): this spec + battery (3x sealed) + driver ext + stage-1 + 6T+6E + verdict under same bars/discipline. CPU/in-worker only. NO GPU. NO PUSH without explicit order. Pool = sealed reviewer labor only. R=3 seeds 0,1,2, quorum 2/3, COMPLETE-gated, twin-matched seed-only streams, paired evals. Corrections append-only.

## Record-search
- U29 Q-FAIL (Q-USE 0/3 decorative, SELECT 0.15/0.28/0.245, COMPETE 0/3): raw Eqk unaligned, 2-slot hinge too sparse on 20-dim binding.
- U30c TOPK-FAIL (just closed: SELECT 0.19/0.205/0.065, COMPETE 0/3, margins still negative): top-k alone on content-only wide codes does not open exclusion.
- U29b isolates COMBINATION (conditioning × pressure-shape): same query-conditioned INH-Q (20-dim [enc8|Eqk12] ->8->1) as U29, but hinge = min_true vs mean_top3 (4-slot, margin 1.0). If single-mode chase was masking a weak query signal, top-k should reveal it (Q-USE >0).
- What differs vs U29: IDENTICAL INHQ/diet/routing/streams except codes 181/182 fresh, mine 71300+seed held-out 72300+seed N=200 (fresh vs U29 67300/68300 to avoid overlap), hinge 4-slot. CE stops at INH-Q, hinge to S+C+INHQ.

## Bars (quorum 2/3)
- U29b-SELECT-HARD >=0.80 2/3. U29b-COMPETE >=0.50 2/3. U29b-Q-USE >=0.05 2/3 (query load-bearing under top-k). U29b-INHIB-USE >=0.05 2/3. U29b-SEPARATES >=+0.10 2/3. U29b-SEL >=+0.05. U29b-HARD >=0.60. U29b-GAP >=0.15. U29b-SUMMARY >=0.05. U29b-STD +-0.05 W6. U29b-FRESH 4/4.
- Verdicts: Q-TOPK-COMPETES / Q-TOPK-PARTIAL (Q-USE holds without SELECT, or vice versa) / Q-TOPK-FAIL (WHY owed) / VOID.
