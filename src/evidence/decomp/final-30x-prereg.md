# 30x follow-ups (PROPOSED, pre-countersigned, evolving from F2/F3/F4 + hybrids + E1/E2/E3)

Agent approval: this file. User order 2026-11-24: run all remaining + 10 additional per test (30 total), don't stop. CPU/in-worker only. NO GPU. NO PUSH. R=3, quorum 2/3, COMPLETE-gated, twin-matched seed-only streams, paired evals.

## Record-search
- F2 C=8 FAIL (dose hurts, mean 0.498 vs 0.532). F3 1200st HELPS compose 3/3 (+0.125/+0.115/+0.02). F4 auxW2.0 FAIL. F6 mean 0.57 best yet; F7 new best single 0.63. E1 masks interchangeable; E2/E3 hold rank. Single-trunk absolute bars stand (scr 0.70, two 0.60 quorum).
- What differs: 30 evolvers grouped as 3x10 (A longer-recipe, B hybrids, C pick-variants). No new arch (attention filed separately, needs battery before compute — NOT in this 30).

## Design (base = masked own-vhat truncated, 800st/B16/lr5e-3 unless noted, streams 42000/91000+seed)
- A1-A10 longer-recipe (trains): A1 1000st boot, A2 1400st boot, A3 1600st boot, A4 2000st boot, A5 1200st auxW0.5, A6 1200st auxW1.5, A7 1200st Div-lam2.0, A8 1200st Div-lam8.0, A9 1200st lr2.5e-3, A10 1200st lr1e-2. Each = 3 trains + 3 evals.
- B1-B10 hybrids (eval-only, frozen): B1 ret div-boot + comp cur-pick; B2 ret cur-rand + comp cur-pick (F5 re-read); B3 ret div-boot + comp f3-boot; B4 ret f3-boot + comp div-boot; B5 ret cur-pick + comp f3-boot; B6 ret f3-boot + comp f3-boot (self); B7 ret cur-rand + comp div-boot; B8 ret div-boot + comp div-boot (self-check); B9 ret cur-pick + comp cur-pick (self-check); B10 ret cur-pick + comp div-boot. Each = 3 evals.
- C1-C10 pick-variants (trains): C1 C=6 pick, C2 C=12 pick, C3 C=8 pick + 1200st, C4 threshold-pick top-2-mean, C5 medium-pick (median disagree), C6 pick-easy + 1200st (rival), C7 pick + auxW0.5, C8 pick + auxW1.5, C9 pick lr2.5e-3, C10 pick + bootstraps-off (isolate). Each = 3 trains + 3 evals.

## Bars
- Same FINAL bars (scr 0.70 / two 0.60 / control +0.15 / disagree 0.20) + deltas vs parents (A vs div-boot-800, C vs cur-pick-C4, B vs F5/F6/F7). Verdicts: 30X-PARTIAL/HELPS/DEAD per group + updated bests. NO threshold moves.
- Ledgers `d-newai-30x-{a1..c10}-s{seed}-*.json` + evals + verdict `d-newai-30x-verdict.json`. Transcript + CHATLOG + CURRENT_TASK. NO PUSH.
