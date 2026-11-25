# Self U29c delta-prereg: low-cue-only diet on query-conditioned INH (PROPOSED; pre-countersigned, battery next)

Agent approval: this file. Pre-countersignature (user 2026-11-25): this spec + battery (3x sealed) + driver ext + stage-1 + 6T+6E + verdict under same bars/discipline. CPU/in-worker only. NO GPU. NO PUSH without explicit order. Pool = sealed reviewer labor only. R=3 seeds 0,1,2, quorum 2/3, COMPLETE-gated, twin-matched seed-only streams, paired evals. Corrections append-only.

## Record-search
- U29 Q-FAIL + U29b Q-TOPK-FAIL (both Q-USE 0/3 exactly): raw Eqk unaligned; top-k does not reveal query.
- Liu #11 boundary: cued rows may mask gain that appears only when support is impoverished (low-cue). U24 low-cue 1/3 hint (LOWCUE bar) carried as interpretation, not result.
- What differs vs U29: IDENTICAL INH-Q (20-dim) + 2-slot max-hinge + routing (detached CE), codes 187/188 fresh, mine 72300+seed held-out 73300+seed N=200, ONE diet delta: ALL adapt rows (train hard + eval hard) use support truncated to first 2 entries (low-cue). Standard 8 rows unchanged (full 4-entry support not applicable — standard has no support). Tests SUBSTRATE (does query matter when cue is poor?).

## Bars (same as U29 + LOWCUE)
- U29c-SELECT-HARD >=0.80 2/3. COMPETE >=0.50 2/3. Q-USE >=0.05 2/3. USE >=0.05. SEPARATES >=+0.10. SEL >=+0.05 (lowcue-hard vs shuf-lowcue). HARD-lowcue >=0.60 2/3 (absolute will be lower — bar unchanged for comparability, expect FAIL absolute but look at Q-USE/COMPETE deltas). GAP >=0.15. SUMMARY >=0.05. STD +-0.05. FRESH 4/4.
- Verdicts: LOWCUE-COMPETES / LOWCUE-PARTIAL (Q-USE holds) / LOWCUE-FAIL (WHY owed) / VOID.
