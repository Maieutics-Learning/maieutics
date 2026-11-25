# Self U30c delta-prereg: top-k-max hinge on wide codes (PROPOSED; pre-countersigned, battery next)

Agent approval: this file. Pre-countersignature (user 2026-11-25): this spec + battery (3x sealed) + driver ext + stage-1 + 6T+6E + verdict under same bars/discipline. CPU/in-worker only. NO GPU. NO PUSH without explicit order. Pool = sealed reviewer labor only. R=3 seeds 0,1,2, quorum 2/3, COMPLETE-gated, twin-matched seed-only streams, paired evals. Corrections append-only.
Standing orders: push only on order; every paper-divergence gets filed WHY; log everything.

## Record-search
- U30 WIDE-PARTIAL (SELECT 0.43/0.075/0.355, COMPETE 0/3 margins -0.041..-0.043 worse than U28, USE 3/3 SEPARATES 2/3): width scales distractor manifold; max chases one mode while another wins (verdict WHY Kim #5).
- U29 Q-FAIL (Q-USE 0/3 decorative): query concat unaligned; top-k orthogonal.
- U28 MAX-PARTIAL: 2-slot hinge sparse. U30c isolates PRESSURE-SHAPE (2-slot vs top-k) with capacity held at wide.
- What differs vs U30: IDENTICAL S-wide/C-wide/INH-wide/HF-wide/diet/routing/streams (detached CE + hinge adapt-only, 800st/B16/lr5e-3/clip1.0, mine 70300+seed held-out 71300+seed N=200, std N=200 twin, OOD frozen scale, codes 179/180 fresh, VOID iff oracleY<=0.20 2/3), ONE forward/loss delta: hinge-on-MEAN-TOP3 (min_true vs mean_top3_distractors, margin 1.0, weight 1.0, 4-slot: argmin-true -1.0, top3-dist each +1/3, lowest-index tie-break logged). Backward routing identical (CE stops at INH, hinge to S+C+INH wide shapes).

## Bars (quorum 2/3)
- U30c-SELECT-HARD >=0.80 2/3 (wall bar). U30c-COMPETE strict >=0.50 2/3.
- U30c-INHIB-USE >=0.05 2/3. U30c-SEPARATES >=+0.10 2/3. U30c-SEL >=+0.05 2/3. U30c-HARD >=0.60 2/3. U30c-GAP >=0.15 2/3 (vs frozen-U22c-scale). U30c-SUMMARY >=0.05 2/3. U30c-STD within +-0.05 W6 2/3. U30c-FRESH 4/4.
- Verdicts: TOPK-COMPETES / TOPK-PARTIAL / TOPK-FAIL (WHY owed: binding/alignment next) / VOID.

## Staging
- Battery on THIS file first (3x sealed) -> v1.0 STANDS or pins-only. Then grad-check (CE-zero + hinge-topk numeric) + stage-1 + 6T+6E + verdict d-newai-self-u30c-verdict.json.
