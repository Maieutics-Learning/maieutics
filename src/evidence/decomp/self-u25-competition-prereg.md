# Self U25 delta-prereg: assembly-competition scorer (PROPOSED; NO COMPUTE until battery)

Agent approval: this file. CPU/in-worker only. NO GPU. Pool = sealed reviewer labor only. R=3, quorum 2/3, COMPLETE-gated, twin-matched seed-only streams, paired evals. Corrections append-only. Push after verdict per standing order.

## Record-search (already-run / nearest prior / what differs)
- SELECT wall, all attempts: U22a wide 0/3 (~chance 0-2.5%), U22b funnel 0/3, U22c scales 0/3, U23 0/3, U23b 0/3 (kept-only split 0-0.03 — Turn-118: wall is NOT dilution), U24 0/3 (gate decorative). Global softmax over 250 slots never selects under any diet, gate, or scale.
- Retrieval bed (#5 Kim): assembly-specific E-to-I inhibition beats GLOBAL inhibition on overlapping engrams. Our scorer is global softmax with no assembly-specific competition — the exact mechanism behind the wall. (#8 To / #9 Cohen: separation and completion are SEPARABLE jobs on separate substrates — our single scorer does both with one knob; keep baring SELECT vs SUMMARY apart.)
- U24 GATE-FAIL: scalar state-gate converged to ~0.75 constant, USES ~0. Drop the gate (proven ~zero) — U25 builds on U23b wiring, not U24.
- What differs vs U23b: IDENTICAL wiring (250 slots, shared S 4→8, scorer, soft pool tau 1.0, combiner, codes 165/166), IDENTICAL vhat-mining diet (same frozen U21 miner, same keep rule, 8+8, cap 20, B=16/800st/lr5e-3), PLUS one loss term: contrastive scorer loss. New disjoint stream offsets (train 65300+seed, held-out 66300+seed).

## Design
- Frozen: W6-s / M2-nb-s; frozen U17 L* teacher; frozen U5-old head; frozen U21-lowfold miner per seed; frozen U22c-scale OOD control.
- Trainable: S + scorer + HF, same inits/code path as U23b (codes 165/166).
- Forward: IDENTICAL to U23b (no graph change → grad-check re-runs U22c/U23b numeric check to confirm, plus new contrastive term checked).
- Contrastive term (per hard AND standard adapt row): scores = C over 250 slots; trueIdx = [7,41,129,166,203]; distractors = all other slots. Lcomp = max(0, margin - (mean(true scores) - mean(top-8 distractor scores))), margin=1.0, weight λc=1.0 added to row loss (adapt rows only; standard rows unchanged). Rationale: explicit assembly-vs-distractor competition pressure (Kim), while forward stays the comparable soft-pool member of the family.
- Diet/streams/evals: same three streams as U23b (standard N=200 twin-matched; vhat-mined held-out N=200 at 66300+seed; OOD frozen scale) + miner/oracle probes + oracle-floor tripwire (VOID iff oracleY ≤0.20 2/3).
- Bars (quorum 2/3): U25-SELECT-HARD (top-2 hit ≥0.80 — THE wall bar) / U25-SEL (hard-shuf ≥+0.05) / U25-HARD (≥0.60) / U25-GAP (≥0.15 vs frozen scale) / U25-SUMMARY-HARD (≥0.05) / U25-STD (±0.05 W6) / U25-COMPETE (per-row strict separation distractor-max < true-min, row fraction ≥0.50 — Kim operationalized) / U25-FRESH (battery 4/4).
- Verdicts: COMPETES (SELECT-HARD + COMPETE hold) / COMPETES-PARTIAL / COMPETITION-FAIL / VOID.

## Staging + budgets
- Battery on THIS file first (3x sealed, health checks) → v1.1 pins-only.
- Then stage-1 (harness + oracle floor + grad-check incl. contrastive term) + 6T + 6E + verdict d-newai-self-u25-verdict.json. Transcript + CHATLOG + CURRENT_TASK. PUSH after verdict.
