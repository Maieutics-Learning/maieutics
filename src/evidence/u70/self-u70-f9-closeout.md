# U70-F9 closeout (EXECUTED 2026-11-27, owner countersign on exact v1.2)

## Design executed
F4-exact base, ONE global scalar `U70N_INITSCALE`, two arms × 20 seeds (same seeds/draws/streams, paired vs filed F4): F9a ×0.5, F9b ×2.0. 40/40 rows, 0 invalid. Smoke s0 both arms clean (gaps 0.15/0.19), filed, no tweaks.

## Per-arm results
- **F9a quieter:** probe pooled **0.7005** (12/20, median 0.74) — bar met **by 0.0005**; gap 0.108 (19/20); ctx 0.8473 (10/20). Ignition VALID. Catastrophes **2/20** (seeds 6: 0.4567, 8: 0.15). Usage 0.70, KL 0.0377, delay-med 10. **Verdict: FIXED** (locked bars met; thinnest possible margin, stated openly).
- **F9b louder:** probe pooled **0.6358** (9/20, median 0.66); gap 0.1367 (18/20); ctx 0.8868 (18/20). Ignition VALID. Catastrophes **8/20** — all 4 F4 graves kept (2: 0.1567, 6: 0.4533, 7: 0.43, 8: 0.09) PLUS 4 new (12,13,14,16); seeds 2,7 gaps NEGATIVE (−0.23,−0.16: dial anti-informative). Usage 0.61, KL 0.0413, delay-med 6. **Verdict: PERSISTS** (probe-fail rule, F2 precedent), with louder-destruction mechanism.

## Flip table (F4 graves)
| seed | F4 | F9a ×0.5 | F9b ×2.0 | read |
|---|---|---|---|---|
| 2 | 0.49 | **0.84 un-flip** | 0.1567 (worse, gap −0.23) | volume |
| 6 | 0.4567 | 0.4567 (kept) | 0.4533 (kept) | scale-proof |
| 7 | 0.4333 | **0.74 un-flip** | 0.43 (kept, gap −0.16) | volume |
| 8 | 0.1367 | 0.15 (kept) | 0.09 (kept) | scale-proof |

## Matrix read (locked v1.2)
Quieter un-flips 2/4; louder keeps 4/4, worsens 2's dial past zero, and births 4 new graves → **volume-with-direction (quieter)**. Partial: 2/4 moved. Seeds 6,8 persist across ±scale range → pattern persists across range → **ensemble (F10) indicated for 6,8**. Paired F9a−F4: dProbe −0.019 (CI incl. 0), dGap −0.028, dCtx −0.032. Paired F9b−F4: dProbe −0.083 (CI incl. 0), dGap/dCtx ~0.

## Overall: PARTIAL
Volume confirmed as a mover with direction (quieter births un-flip half the graves; louder births lock harder and create new ones), but the lottery is narrowed, not ended: two graves are scale-proof. No bars moved (F9a's 0.0005 margin filed as margin, not comfort).

## Follow-ups (owner order: dial work continues)
- F10 ensemble (seeds 6,8 pattern-persistent — different draws, not different volumes).
- GRU-128 capacity ruling-out (still queued).
- No Phase-2 in this wave. NO PUSH without order.
