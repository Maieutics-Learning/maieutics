# Practice program v10 — PROPOSED (no countersign, no compute)

Purpose: turn "a brain that learns" into daily practice — full learning + memory — and port the agent skills (rabbithole / fresh-eyes / memory) into things the bench brain itself can run. This file is a proposal. Nothing here runs until countersigned.

## Where we stand (2026-11-23)

Receive-side: bottleneck COMPRESSES (K=4/sig0.5 ≥0.60 3/3; generalizes across tutors s0/s1/s2; distributed code; gradual K-dose). Transfer: mixed-base → held-out reverse NO-ADVANTAGE (replicates barB). Self-direction pilot: NO-DIFFERENCE (naive hard-mining == random). Hygiene: old B3 discount overcautious. Teaching-proof parked (F5 reversion stands as the give-side FAIL).

## The three practices

1. **Learning practice (representational).** The missing piece from AUX-vs-bottleneck: intermediates that are priced AND load-bearing AND survive fading. Protocol: bottleneck student + auxiliary readout on the message (predict pair-set properties), then fade the aux weight 1.0→0 across training (like D-fade). Bar: faded reader ≥ unfaded at equal steps AND lesion-distributed (no single-dim master). ABORT if aux collapses to decoration (round-drop ≤0.03, cf. depth C).
2. **Memory practice (ledger-augmented).** Give the learner a durable store it can actually read: append-only ledger of its own past lines + outcomes + teacher feedback, exposed as retrieved exemplars alongside the query (k-NN over frozen states first, eval-only; then train the reader). Bar: ledger-augmented ≥ no-ledger by +0.05 on long-horizon adaptation at equal grad steps, 2/3 seeds. ABORT if retrieval == random-exemplar (null control).
3. **Self-direction practice (auto-curriculum done right).** Our pilot failed because selection was raw CE without a verifier. Fix: competence-gated rungs (R1 1-pair → R2 mixed → R3 long) + bridge-or-verdict rule (each rung emits verdict or spawns follow-up within 2 waves, else dry). Bar: gated ≥ fixed curriculum on held-out transfer at ≤ steps. ABORT if gates advance on memorization (probe saturates in 1 block — the staircase failure).

Order: memory-ledger first (cheapest; eval-only start), then verifier-gated curriculum, then representational fade. Each lane carries its own ABORT so failures kill fast.

## Porting the agent skills to the bench brain

The skills work for me as harness + audit. For the model they must become executable functions with bars:

- **memory → ModelLedger.** What I do (append numbers + pointers + verdicts, newest-wins, promote-or-recipe) becomes: per-learner store + retrieval features + same-budget ledger-vs-no-ledger bar above. Start frozen-reader (no weight change), then train the reader. This is Lane 2.
- **fresh-eyes → SecondHead.** What reviewers do for me (blunt stateless read, hardest-test demand, adjudication) becomes: a frozen verifier head trained on the model's own errors that scores candidate next lines; selection by verifier-vs-random at equal budget. My selfdir used CE-only and tied; the verifier is the missing piece. Bar as in Lane 3's selection step.
- **rabbithole → AutoCurriculum.** What waves do (ONE direct + ONE tangential per wave, verdict-or-bridge, queue never empties except at run end) becomes: the rung generator + spawn rule in Lane 3. The skill's anti-wind-down machinery (queue rule, marathon rule, pre-send gate) is exactly what a naive curriculum lacks — port the rules, not the prose.

Each port starts as harness around frozen weights (like P4-mini), then fades into weight learning (like D-fade). If the harness version shows nothing, the weight version does not run — same gate discipline as ExpD.

## Honest assessment of the skills (push-back included)

You asked whether they work and whether you still have to prompt me. Both true. From my own record:

- **memory: YES, with receipts, but no forcing function.** Compaction survival (this session ran off handoff + record), interruption resume (4/8 → 8/8 from file), retread prevention (log answered in seconds), retraction chain (global-noise → NULL with killing numbers), and it caught its own gap (reconstruction drift → snapshot rule). Costs: logs grow, PAT bottleneck for durability, and U5 is still open — nothing compels invocation except checklists, and checklists bind only a reader who reaches them. Your prompts ARE the forcing function the skill lacks. That is the documented gap, not a surprise. Push-back: do not expect autonomy from this skill; expect auditability. It makes my work checkable so you can steer — that is the actual win.
- **fresh-eyes: questions well, explores shallowly.** Real catches: stale premises (twice), stat overreach, impossible suggestions that exposed wrong mental models, the overwrite blind spot. Limits (filed): cannot run code (every implementation claim needs a code check), one-provider correlated blind spots (never treat agreement as proof), inherits my framing (blind tests exist for this reason), and self-calling is NOT automatic (newborn handed helpers used none and re-proposed a run). Your prompting is the correct use pattern. Push-back: more reviewers will not fix thin seeds or framing — only runs and blind tests do. Keep it as interrogator, never as verifier.
- **rabbithole: breadth engine with a weight problem.** It produced the PCGrad lead, the data-mismatch reframe (the wall was train/test mismatch, not capability), and the fair-slot repair — genuine exploration wins. But it is ~500 lines with open U1 (naive-reader burden) and U4 (breadth paradox); without the queue/marathon/pre-send machinery it winds down early (S2, W31). Your "don't be afraid" + standing resume-YES is the load-bearing patch. Push-back: do not turn every question into a rabbithole. It is the wrong tool for load-bearing verdicts (use fresh-eyes + a run) and for anything needing code execution (it only scouts/fetches). Use it to find the hill, not to climb it.

Net: the skills made me checkable and broad, not autonomous. The progress you see is real (fewer retreads, killed mechanisms with numbers, blind-spot catches), and the remaining prompting is structural (U5), not a motivation gap. The practice program above is how that assessment turns into model-executable work: same three shapes, but as functions the brain runs with bars, not prose I read.

## Ask

Countersign Lane 2 (ledger-augmented) as the next build (spec + bars + ABORT), or redirect order. No compute on this file until signed.
