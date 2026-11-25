# Self U23 delta-prereg: hard-task mining (PROPOSED; NO COMPUTE until battery)

Agent approval: this file. CPU/in-worker only. NO GPU. Pool = sealed reviewer labor only. R=3, quorum 2/3, COMPLETE-gated, twin-matched seed-only streams, paired evals. Corrections append-only. Push after verdict per standing order.

## Record-search (already-run / nearest prior / what differs)
- U21 h-only head (48-dim): adaptY 0.785/0.63/0.67, ABLATE 2/3 (s2 0.09). h suffices on standard diet except s2 margin.
- U22a scope-parity (68-dim flat): PARITY exact vs U17, ABLATE 3/3, SEL 0/3 — full scope makes residual CE-learnable; teacher marginal +0.005..0.025; capacity rival open (+480 params).
- U22b funnel: FUNNEL-PARITY exact 3/3, SUMMARY 0/3 decorative in true arm (0.005-0.03). Bottleneck carries nothing load-bearing.
- U22c 1000-stress (soft pool): SCALE-PARITY exact, ABLATE 3/3, SELECT 0/3 ~chance, SEL 1/3. Scaling free; selection never emerged; NOMEM vacuous.
- E5 aux-off → chance; T2 pressure +0.15; THREE-CONDITIONS synthesis (learnable-but-unlearned + non-memorizable). Pressure installs use; wiring alone never has (U18→U22c).
- User correction (Turn 107): don't degrade h (no zeroing/lying — no train/eval shift, no STD risk). Change the questions, not the inputs.
- What differs vs U22c: IDENTICAL wiring (250 slots, shared S 4→8, scorer, soft pool tau 1.0, combiner 56→24→4, codes 157/158 pattern → new codes 159/160), DIFFERENT diet. h fully present at full weight on every row. Hard rows = episodes the frozen U21-lowfold miner head gets WRONG (rejection-sampled online, miner = U21 lowfold s{seed} ledger, two-step adapt scoring). 50/50 hard/standard mix per batch. Held-out mined stream (offset RNG, never trained on) proves generalization. No new labels-as-signal, no distribution tricks beyond disclosed subset selection.

## Design
- Frozen: W6-s / M2-nb-s; frozen U17 L* teacher (true-20 linkOut*); frozen U5-old head; frozen U21-lowfold miner head (per seed, loaded from d-newai-self-u21-lowfold-s{seed}-800st.json).
- Trainable: S + scorer + HF = U22c wiring exactly (same inits, same code path).
- Batch (B=16): 8 standard rows (U22c recipe: true slots at [7,41,129,166,203], 245 matched-noise distractors re-seeded) + 8 hard rows (draw adapt episodes; score each candidate with frozen miner two-step adaptY; keep first miner-failures, cap 20 tries/row, fallback keep last draw; build slots identically). 800st/lr5e-3/clip 1.0, same losses (adapt 0.5*mse to linkOut*, standard 1.0*mse to 0), hard gate, twin-matched (both arms same rows; shuf arm shifts teacher targets by 1 as before).
- Arms: u23-hard (true L*) vs u23-shuf (shift-by-1). 6T.
- Eval: standard N=200 (twin-matched streams, two + adaptY + ablation + SELECT + NOMEM as U22c) + held-out hard N=200 (offset stream 61000+seed → 61300+seed for adapt draws, mined with same frozen miner, never trained on): adaptY-hard, SELECT-hard, summary-drop-hard, miner-floor sanity (miner adaptY on hard ≈ 0 by construction), plus OOD control: frozen U22c-scale head scored on the same hard held-out (expect ≈ miner level — proves hard set is hard for current wiring, U23 gain is the diet).

## Bars (quorum 2/3 unless noted)
- U23-MINER-FLOOR: frozen miner adaptY on hard-heldout ≤0.10 3/3 (construction sanity).
- U23-HARD: u23-hard adaptY-hard-heldout ≥0.60 2/3 (actually solves hard items).
- U23-GAP: u23-hard minus frozen-U22c-scale on same hard-heldout ≥0.15 2/3 (gain is the diet, not the wiring).
- U23-SELECT-HARD: top-2 hit-rate on hard-heldout ≥0.80 2/3 (selection emerged where needed).
- U23-SUMMARY-HARD: zero-summary drop on hard-heldout ≥0.05 2/3 (summary load-bearing).
- U23-STD: two (standard stream) within ±0.05 of W6 two 2/3 (50/50 mix holds the base).
- U23-ABLATE: zero-head drop ≥0.10 3/3 overall (keep what works).
- U23-SEL: hard minus shuf on hard-heldout ≥+0.05 2/3 (teacher-distinction where h can't shortcut).
- U23-FRESH: battery health 4/4.
- Verdicts: USES-MEMORY (HARD+GAP+SELECT+SUMMARY hold — use proven) / USES-PARTIAL / PRESSURE-FAIL / VOID.

## Staging + budgets
- Battery on THIS file first (3x sealed, health checks) → v1.1 pins-only.
- Then mining-harness test (miner loads, hard-rate ~25-40%, determinism exact on re-run) + grad-check (U22c graph unchanged — re-run to confirm) + 6T + evals (6 standard + 6 hard-heldout + 6 OOD-scoring of frozen U22c) + verdict d-newai-self-u23-verdict.json. Transcript + CHATLOG + CURRENT_TASK. PUSH after verdict.
