# Self E2 delta-prereg: success-gated rehearsal, query-time (PROPOSED; pre-countersigned, battery next)

Agent approval: this file. Pre-countersignature (user 2026-11-25): this spec + battery (3x sealed) + driver ext + stage-1 + 6T+6E + verdict + up to 2 gap-closing extras under same discipline. CPU/in-worker only. NO GPU. NO PUSH without explicit order. Pool = sealed reviewer labor only. R=3 seeds 0,1,2, quorum 2/3, COMPLETE-gated, twin-matched seed-only streams, paired evals. Corrections append-only.
Standing orders: push only on order; paper-divergence WHY; log everything for contextless replay.

## Record-search (already-run / nearest prior / what differs)
- Rehearsal arc: E-on-Div recall 2/2/0 (ratios 0.137/0.238/4.205 HOLD 2/3, taken-acc 0.75/0.75/1.0); A1 COMPUTE-ONLY (own>rand, shuf fails, none-parity — rehearsal is harm selection mitigates, not help it creates); A2 REHEARSAL-DEAD (0/3 gains, post-hoc replay dead). Lesson: post-hoc diet replay is not appetite.
- Retrieval bed: Patil/Dougherty #6 retrieval-begets-retrieval via dopamine (recent success primes subsequent retrieval; dPFC predicts accuracy not reinstatement); Halpern #7 gap reactivation during encoding (not post-hoc); Zhang #3 latency/sharpening with practice (we bar accuracy-only). E2 is the query-time inbuilt version: correct retrieval boosts a momentum state that raises next-trial propensity — no teacher, no reward, no external re-query.
- User corrections: self-learning machine, M/C/E in weights + forward pass, tools as controls only. E2 momentum lives in forward pass, gated by own success — no commands, no English, no second head as tool.
- What differs vs A1/A2: NO post-hoc diet, NO extra heads as tools. SAME U22c-scale trunk family (S-wide-8 content codes 177/178, train mine 69300+seed held-out 70300+seed where applicable), PLUS one scalar momentum m (per-episode, forward-only): m_{t+1} = clip(m_t + eta*(correct_t - baseline), 0, 1), correct_t = (adaptY_t == oracleY_t) computed FORWARD-ONLY from frozen miner/oracle probes (no gradient through correctness — momentum is a STATE, not a loss). Retrieval propensity = base pool temp tau(m) = 1.0 - 0.5*m (sharper when winning) + rehearsal bias b(m) = m * rehearsalVec (running summary of taken slots). RehearsalVec = EMA of taken-slot encodings, decay 0.9, updated forward-only. NOTHING conditions on labels for gradients — CE/hinge losses unchanged (U28 max-hinge family); momentum only shapes the forward pool. Shuf arm gets identical mechanics (momentum from its own shuf-correctness — must NOT track).

## Design
- Frozen: W6-s / M2-nb-s; frozen U17 L* teacher; frozen U5-old head; frozen U21-lowfold miner; frozen U22c-scale OOD.
- Trainable: S + C + INH (U28 content-only detached family, same inits code family 177/178) + HF. Momentum params: eta (1 scalar, init 0.5, learned via CE/hinge only through its forward effect — no direct correctness gradient) + rehearsalVec EMA (forward-only buffer, not a param).
- Forward per trial t (codes 177 comp / 178 shuf): compute scores/inh as U28; pool with tau(m_t); summary biased by b(m_t); combiner -> adaptY_t. Update m_{t+1}, rehearsalVec forward-only. First trial m_0 = 0.5 (neutral).
- Diet/streams: SAME 8+8 mining diet (so trunk comparable), BUT eval adds SEQUENTIAL structure: held-out episodes run in FIXED order per seed (not reshuffled) so momentum has something to integrate; standard N=200 sequential + shuffled-order control (same rows, permuted order — momentum must NOT help when order destroyed).
- Arms: e2-comp (true L*) vs e2-shuf. 6T + 6E + order-controls.
- Controls: shuffled-order (same rows permuted — E-RECALL must vanish); frozen-m (m pinned 0.5 — base trunk); zero-rehearsal (b=0 — temp-only); miner/oracle probes.

## Paper predictions vs bench predictions (divergence-WHY owed)
- Patil #6 + Halpern #7 predict: E-recall (later-trial accuracy above early-trial) + taken-acc lift where A1/A2 post-hoc failed, because momentum is query-time not diet. Bench prediction: E2 E-RECALL 2/3 + TAKEN-ACC lift + NO-HARM-ON-FAILURE (failures do not depress below frozen-m). IF E-RECALL holds but TAKEN-ACC flat: file WHY (priming without selectivity — needs assembly gating U29/U30). IF both flat: file WHY (momentum unusable on this substrate — carry already saturates, or 800st too short for EMA; E2b during-encoding variant next).
- Zhang #3: measure latency/sharpening too (pool entropy drop with practice) — report only, not a bar (bars stay accuracy-only per standing discipline; SPEED family is measure-only until filed).
- Correctness-firewall: momentum update uses correctness FORWARD-ONLY; no gradient through correct_t; losses never see labels beyond U28 CE/hinge. Firewall violation (gradient through correctness) = HALT, file breach.

## Bars (quorum 2/3 unless noted)
- E2-E-RECALL: late-third minus early-third on sequential held-out >= +0.08 2/3.
- E2-TAKEN-ACC: accuracy on taken (m>0.6) rows minus base >= +0.05 2/3.
- E2-NO-HARM: accuracy on post-failure rows >= frozen-m rows - 0.03 2/3 (failures do not poison).
- E2-ORDER: sequential minus shuffled-order >= +0.05 2/3 (effect is order-driven, not diet).
- E2-SEL >= +0.05, E2-HARD >= 0.60, E2-STD within +-0.05 W6, E2-FRESH 4/4.
- Verdicts: APPETITE-WORKS / APPETITE-PARTIAL / APPETITE-FAIL (WHY owed) / VOID (oracle floor) / BREACH (firewall violated).

## Staging + budgets
- Battery on THIS file first (3x sealed) -> v1.1 pins-only.
- Then grad-check (momentum forward-only: numeric through m must be ZERO by construction; CE/hinge grads exact) + stage-1 + 6T + 6E + verdict d-newai-self-e2-verdict.json. Transcript + CHATLOG + CURRENT_TASK. PUSH only on order.
- Compute: CPU/in-worker only, COMPLETE-gated.
- Extras pre-countersigned (max 2, same discipline): E2b during-encoding reactivation (if query-time helps but weakly — reactivate DURING support, not post-trial); E2c latency/sharpening bars (if accuracy moves — promote Zhang SPEED to bar).
