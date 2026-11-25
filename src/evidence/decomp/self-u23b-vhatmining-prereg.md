# Self U23b delta-prereg: vhat-mining, oracle-gated (PROPOSED; NO COMPUTE until battery)

Agent approval: this file. CPU/in-worker only. NO GPU. Pool = sealed reviewer labor only. R=3, quorum 2/3, COMPLETE-gated, twin-matched seed-only streams, paired evals. Corrections append-only. Push after verdict per standing order.

## Record-search (already-run / nearest prior / what differs)
- U22c 1000-stress (soft pool, codes 157/158): SCALE-PARITY exact 3/3, ABLATE 3/3, SELECT 0/3 ~chance, SEL 1/3. Scaling free; selection never emerged.
- U23 hard-task mining (codes 159/160): PRESSURE-FAIL. minerY-wrong mined trunk-bound hop-2 failures — minerV 0.915/0.915/0.98 (miner retrieval RIGHT) but oracleY with perfect vhat 0.06/0.06/0.015 = trained = OOD. No head can fix these: head affects vhat only. R2 noise-rival won. Standard stream held (STD/ABLATE 3/3). Three self-caught bugs repaired and disclosed (NaN-loss transcription, twin-match violation in standard stream, minerOK mislabel).
- THREE-CONDITIONS synthesis + E5/T2: pressure installs use; wiring alone never has (U18→U22c).
- User corrections in force: don't degrade h (Turn 107 — no zeroing/lying, h intact full weight); change the questions via h-failure mining (Turn 107–108).
- What differs vs U23: IDENTICAL wiring (250 slots, shared S 4→8, scorer, soft pool tau 1.0, combiner 56→24→4, pattern codes 159/160 → new codes 161/162), DIFFERENT mining criterion. U23 kept episodes where frozen U21-lowfold miner's final answer Y was wrong. U23b keeps episodes where miner's VHAT is wrong AND oracle-with-perfect-vhat is RIGHT (hop-1, head-fixable by construction). Oracle-viability gate is measured BEFORE trains on the vhat-mined held-out set: high oracleY = viable diet, floor oracleY = abandon mining (VOID, change task).

## Design
- Frozen: W6-s / M2-nb-s; frozen U17 L* teacher (true-20 linkOut*); frozen U5-old head; frozen U21-lowfold miner head per seed (d-newai-self-u21-lowfold-s{seed}-800st.json); frozen U22c-scale head per seed (OOD control).
- Trainable: S + scorer + HF = U22c wiring exactly (same inits, same code path, codes 161/162).
- Vhat-mining (per row, seed-only RNG, deterministic):
  - Draw candidate adapt episode (U22c recipe: true slots at [7,41,129,166,203], 245 matched-noise distractors re-seeded).
  - Score with frozen miner: minerHF = minerHead(h); vhatErr = mse(minerHF, linkOut*); minerVhatWrong = argmax(minerHF) != argmax(linkOut*) OR vhatErr > per-seed median (report which rule fires; argmax primary).
  - Oracle probe: oracleY = trunk two-step ens with linkOut* substituted for HF (perfect vhat), scored correct/incorrect.
  - Keep candidate iff minerVhatWrong AND oracleY correct. Cap 20 tries/row, fallback keep last draw (count fallbacks; flag rate >0.25 as mining-strain).
  - 50/50 diet per batch B=16: 8 standard rows (U22c recipe) + 8 vhat-hard rows. 800st/lr5e-3/clip 1.0, same losses (adapt 0.5*mse to linkOut*, standard 1.0*mse to 0), hard gate, twin-matched (both arms same rows).
- Arms: u23b-hard (true L*) vs u23b-shuf (shift-by-1). 6T.
- Streams (seed-only, disjoint offsets): train stream (offset 61300+seed for adapt draws, standard recipe as U22c); held-out vhat-mined stream N=200 (offset 62300+seed, mined with same frozen miner, never trained on); standard eval N=200 (twin-matched).
- Evals (paired, N=200): standard (two + adaptY + ablation + SELECT + NOMEM as U22c) + vhat-hard-heldout (adaptY-hard, SELECT-hard top-2 hit, summary-drop-hard, miner-floor sanity, minerV probe, oracleY probe) + OOD control (frozen U22c-scale scored on same vhat-hard-heldout).
- Pre-train gate (no trains if tripped): report oracleY on vhat-hard-heldout + minerV + miner adaptY BEFORE any train. Viable iff oracleY ≥0.70 2/3 (trunk can solve these given correct vhat). If oracleY ≤0.20 2/3 → VOID-abandon (same trunk-bound wall as U23, different address — do not train).

## Bars (quorum 2/3 unless noted)
- U23b-ORACLE-GATE: oracleY on vhat-hard-heldout ≥0.70 2/3 (viability; measured pre-train).
- U23b-MINER-VHAT-FLOOR: miner adaptY on vhat-hard-heldout ≤0.60 2/3 AND miner vhatErr > standard-stream vhatErr 3/3 (miner actually fails the head part, not the trunk part).
- U23b-HARD: u23b-hard adaptY-hard-heldout ≥0.60 2/3.
- U23b-GAP: u23b-hard minus frozen-U22c-scale on same vhat-hard-heldout ≥0.15 2/3.
- U23b-SELECT-HARD: top-2 hit-rate on vhat-hard-heldout ≥0.80 2/3.
- U23b-SUMMARY-HARD: zero-summary drop on vhat-hard-heldout ≥0.05 2/3.
- U23b-STD: two (standard stream) within ±0.05 of W6 two 2/3.
- U23b-ABLATE: zero-head drop ≥0.10 3/3 overall.
- U23b-SEL: hard minus shuf on vhat-hard-heldout ≥+0.05 2/3.
- U23b-FRESH: battery health 4/4.
- Verdicts: USES-MEMORY (ORACLE-GATE + HARD + GAP + SELECT-HARD + SUMMARY-HARD hold) / USES-PARTIAL / PRESSURE-FAIL / VOID (oracle gate tripped — mining abandoned).

## Staging + budgets
- Battery on THIS file first (3x sealed, health checks) → v1.1 pins-only.
- Then oracle-gate probe (miner loads, vhat-hard-rate, oracleY/minerV/minerY on held-out, determinism exact on re-run) + grad-check (U22c graph unchanged — re-run to confirm) + 6T + evals (6 standard + 6 vhat-hard-heldout + 6 OOD-scoring of frozen U22c) + verdict d-newai-self-u23b-verdict.json. Transcript + CHATLOG + CURRENT_TASK. PUSH after verdict.
