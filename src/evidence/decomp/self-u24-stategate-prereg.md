# Self U24 delta-prereg: goal/state-conditioned gate (PROPOSED; NO COMPUTE until battery)

Agent approval: this file. CPU/in-worker only. NO GPU. Pool = sealed reviewer labor only. R=3, quorum 2/3, COMPLETE-gated, twin-matched seed-only streams, paired evals. Corrections append-only. Push after verdict per standing order.

## Record-search (already-run / nearest prior / what differs)
- U4→U12 gate arc: GATED-gates read the HEAD output (vhat) and failed blind every time (U10 SPLIT comparison-decorative, U12 SEALED-SHUT, U13 rule<head). Conditioning on the thing being gated never worked.
- U23b vhat-mining (codes 161/162): USES-PARTIAL. Diet installs head-use (HARD 3/3, +0.245/+0.345/+0.105 over minerY; SEL 2/3; STD/ABLATE hold) but selection never emerges (SELECT-HARD 0/3) and no wiring margin over frozen scale on diluted held-out (GAP 0/3; 64-88% fallback-random). Oracle gate 2/3 proved the trunk CAN compose these episodes given correct vhat.
- Intrinsic M (M-carry): continuity of slow state helps; blind gates (vitality inverted) hurt. Lesson: state matters, gates reading outputs don't.
- Retrieval bed (#1 Zheng): PFC learns query-KEY representations for goal-relevant HPC retrieval + a learned BG-mimic scalar gate ON PFC STATE that suppresses retrieval on low query-key similarity. This is the conditioning we never tried: the gate reads the STATE, not the head output. (#2 Savarimuthu: retrieval selects/reactivates/stabilizes — a writer; situating frame.) (#11 Liu, user-supplied PDF, full text read): SDM boundary condition — heavy external cueing SHRINKS state effects; our adapt task is heavily cued (query carries qk/k), so state effects are EXPECTED small (explains modest M-carry, blind gates). Sharp amendment: test the gate under LOW-cue support too, where the prediction is the gated advantage GROWS.
- User corrections in force: h intact full weight (Turn 107); self-learning machine, M/C/E in weights + forward pass, tools as controls only.
- What differs vs U23b: IDENTICAL wiring + IDENTICAL vhat-mining diet (same frozen U21-lowfold miner, same keep rule vhatM!=e.v argmax-only AND oracleY correct, 8+8, cap 20, B=16/800st/lr5e-3) + ONE new thing: a scalar gate g = sigmoid(w_g.[Eqk(query 12) | carry(state 8)] + b_g), 21 params, multiplying the pooled summary before the combiner. New pattern codes 163/164, new disjoint stream offsets (train 63300+seed, held-out 64300+seed). Forced-open (g pinned 1) = U23b wiring exactly, scored on the SAME rows as an eval-only twin-matched ablation.

## Design
- Frozen: W6-s / M2-nb-s; frozen U17 L* teacher (true-20 linkOut*); frozen U5-old head; frozen U21-lowfold miner head per seed; frozen U22c-scale head per seed (OOD control). Same ledgers as U23b.
- Trainable: S + scorer + HF (U22c wiring, same inits) + gate (w_g 21-vector, b_g scalar; init w_g=0, b_g=0 → g=0.5 at start, no bias).
- Gate forward: Eqk = M.E.v[qk*12:(qk+1)*12] (12); carry = fw1.cNew if !isAdapt else zeros(8) — SAME carry convention as U23b buildRow. x-gate = [Eqk | carry] (20) + bias. g = sigmoid(x-gate.w_g + b_g). summary_gated = pf.summary * g. x = [h(48) | summary_gated(8)] → HF as before.
- Diet: 8 standard rows (U22c recipe) + 8 vhat-hard rows (U23b mining rule, train offset 63300+seed), cap 20, fallback counted, strain flag >0.25.
- Arms: u24-gated (true L*, gate active) vs u24-shuf (shift-by-1). 6T.
- Streams (seed-only, disjoint): train (63300+seed); held-out vhat-mined N=200 (64300+seed, same frozen miner, never trained on); standard eval N=200 (twin-matched U22c offsets); LOW-CUE held-out (same 64300 episodes, support list TRUNCATED to first 2 entries — fewer cues, same code path, deterministic).
- Evals (paired, N=200): standard + vhat-hard-heldout (HARD, SELECT-hard, SUMMARY-drop, miner-floor, minerV, oracleY) + forced-open ablation (SAME rows, g=1: HARD-open, SEL-open) + low-cue (HARD + HARD-open on truncated-support rows) + OOD frozen-U22c-scale on vhat-hard-heldout.
- Pre-train floor check (no trains if tripped): report oracleY on held-out. VOID-abandon iff oracleY ≤0.20 2/3 (viability already proven by U23b 2/3; this is a floor tripwire only). Mining-harness determinism exact on re-run. Grad-check is FULL NEW (graph changed — gate params; no delegation).

## Bars (quorum 2/3 unless noted)
- U24-GATE-USES: gated HARD minus forced-open HARD-open on vhat-hard-heldout ≥ +0.05 2/3 (the gate does work twin-matched).
- U24-GATE-SHUTS: mean g on shuf rows < mean g on hard-kept rows 2/3 (directional shut; report both means + g histograms).
- U24-STD: two (standard stream) within ±0.05 of W6 two 2/3 (gate must not break base).
- U24-HARD: gated adaptY-hard-heldout ≥0.60 2/3 (U23b comparability).
- U24-SEL: hard minus shuf ≥ +0.05 2/3.
- U24-GAP: gated minus frozen-U22c-scale on same held-out ≥0.15 2/3 (does state-gating buy wiring margin where diet alone bought none).
- U24-SELECT-HARD: top-2 hit-rate ≥0.80 2/3. U24-SUMMARY-HARD: zero-summary drop ≥0.05 2/3.
- U24-LOWCUE (Liu probe, quorum 2/3): (gated minus forced-open) on LOW-CUE rows ≥ (gated minus forced-open) on cued rows 2/3 — state matters more when cues are weak. Drives verdict OUTLOOK (licenses low-cue lane), not the verdict itself.
- U24-FRESH: battery health 4/4.
- Verdicts: GATE-WORKS (USES + SHUTS + STD + HARD hold) / GATE-PARTIAL / GATE-FAIL / VOID (oracle floor tripped).

## Staging + budgets
- Battery on THIS file first (3x sealed, health checks) → v1.1 pins-only.
- Then stage-1 (mining-harness determinism + oracle floor + FULL grad-check incl. gate params) + 6T + evals (6 standard + 6 heldout + 6 forced-open + 6 low-cue + 6 OOD-scoring) + verdict d-newai-self-u24-verdict.json. Transcript + CHATLOG + CURRENT_TASK. PUSH after verdict.
