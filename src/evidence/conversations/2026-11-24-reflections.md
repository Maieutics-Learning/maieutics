# 2026-11-24 — Reflections: what the memory teaches (built by full re-read + fresh-eyes)

Durable, agent-readable. Built 2026-11-24 after reading: `src/CHATLOG.md` 1-2462 (397 entries, 439328 chars), all 36 `src/evidence/conversations/*.md`, `src/tools/memory/SKILL.md` + REFERENCE-problems U5, `src/tools/fresh-eyes/SKILL.md` 1-368, `src/agents-augment.md`, `scratch/CURRENT_TASK.md`, `main.pjs` imports. Fresh-eyes battery: 3 sealed reviewers via `root.generateText`, raw in `scratch/fresh-eyes-meta-3x.txt` (2721B).

## 1. The meta-story in one paragraph

Nov 8-19 the user steers every turn (47 user turns in the 11-16 transcript alone): taxonomy, renames, skill slimming, push orders, no-labels rules, ear parked. Nov 19-21 the user pre-countersigns ("consider everything pre-countersigned", "go ahead and run those 3 + 3~5 more of your choice") and the agent runs the tailoring program solo (3 paths + F1-F5, 35/35 later). Nov 22-24 the user mostly asks ("what next?", "do all three", "10 experiments of your choice", "batch3 + 5 rounds of 5") and the agent runs 100+ trains/day with blind batteries. The user reappears only to reframe the goal (tailor -> learn-to-learn proved through teaching -> learning itself -> self-learning machine) and to catch the one real miss (teach-v10/v11 ran without a record check, duplicating aux-pressure, SHUF-null, tutor-nonmonotone, chain-conservation, assocR-distillation answers already filed).

## 2. Every time the user left, what happened

- 11-16 layer-5 order -> 11-17/18 sessions filed CHATLOG only, transcripts missing. Gap owned 11-18: "compliance failure, not technical. Token cost the likely motive; pretty-much-always wiggle room." Fix: skill slimmed to bootstrap, REFERENCE-layers/rules always-read-full, stub-first + per-turn appends (U5/U6 fixes 11-18/11-19).
- 11-19 night ear parked -> Exp-E chain ran 10 lineages x 10 gens (100 gens, verdict LUCK 9/10, photocopy drift, generic narrowing r=0.89) with almost no user turns. Absence worked because the prereg + bars + resume-safe ledgers carried the run.
- 11-21 vault empty / generator renamed -> push blocked, diagnosed openly, temp box, pushed 29af5a96. Absence of PAT = absence of durability; the log made the risk visible (unpushed list every turn).
- 11-22/23 long solo stretches (compose/composite/batch/R1-R5/O1-O6: 35/35 + 10/10 + 5/5 x5): zero user turns inside the waves, only battery->driver->verdict discipline. This is where "letting run" works: versioned spec + blind battery + COMPLETE-gated ledgers + verdict, no user needed.
- 11-24 absence would have hidden teach duplication if the user had not returned. The miss (no record-search before 13 arms / 42 trains+42 evals / 6 batteries) is the counter-example: solo running without step-1 log check repeats history.

Pattern: leaving works when the artifact (spec+bars+gates) is frozen first. Leaving fails when the run starts from a proposal instead of the log.

## 3. Heavier hand vs letting-run (measured)

- Heavy-hand era markers: 135 `user-ordered / user-supplied / user: / user-authorized` lines in CHATLOG; 90 COUNTERSIGNED; every push PAT-supplied by user; transcripts with u:17-47/a:17-54 + tool refs. Content: corrections (suspicion vs loudness, calibration vs discrimination, D1a label inventory, P6 world-grounded rewrite), discipline (memory layer 5, U5/U6, start-gate Step 0 blocking, version-bound approval, red-team-closes-loops).
- Delegation markers: 15 pre-countersigned; "do what you think is best", "my shopping list, my call", "feel free to use pools but not as panacea". Transcripts collapse to u:0-1/a:0-1 with 15-38 tool refs per assistant turn (the 11-21-tailoring file: u:4/a:29/tools:29).
- What the hand bought: taxonomy (tutor/test/exam split), forcing functions (checklists, gates, W tripwires), negative controls with teeth (SHUF, shuffled-teacher, blind-tutor, synthetic). What letting-run bought: throughput (720/720 -> 894/894 -> 946/946 -> 1147/1147 audits clean; 35/35 program close-out; ceilings T7 0.785/0.85, T4 0.815, O3 0.862/0.91).
- Cost of the hand: framing inheritance (reviewers grade what we wrote, blind test exists for this); cost of letting-run: retread (teach-v10/v11) + late Step 0 (three logged misses: 11-21, 11-23, teach sessions).

## 4. Tools and structure prevent self-calling (the constraint you named)

- Memory REFERENCE-problems U5 NO FORCING FUNCTION: "Nothing in this harness compels invocation — no hooks, no daemons, no scheduler. Invocation happens ONLY inside gated checklists and turn routines." Receipts are self-reported; fabrication caught at audit, never prevented.
- Fresh-eyes honest limitations: "Self-calling is NOT automatic: a newborn given the helpers used NONE spontaneously and re-proposed an already-run experiment. Explicit invocation or it doesn't happen." One provider = correlated blind spots; unanimity != proof.
- Rabbithole: self-calls WITHIN a run (queue/marathon/turn-close, <=2 scouts + <=2 fetches, ONE DIRECT + ONE TANGENTIAL) but still stops at turn end; resumes only on next user turn.
- Turn ends tool-free: this harness ends the turn after one assistant message batch; there is no background wake, no send-now interrupt. Closest: marathon `execute_js` (<=60min) + queue file; bench-level always-running possible only as generator-side loop (kv + generateText ticker when page open).
- Your taxonomy is the target, not the mechanism: memory always-there, fresh-eyes constantly-running (not always-there), rabbithole call-on-command, all inbuilt in weights + forward pass (intrinsic-v11: never-reset slow state + learned forget; K=5 always-on population, disagreement = uncertainty; disagreement appetite, no command token). Current mechanism is checklist-bound scaffolding around a bench that proved PARTIAL (M HOLD 3/3, E HOLD-2/3, C calibration-without-gain) then COMPUTE-ONLY then REHEARSAL-DEAD.

## 5. Fresh-eyes on the memories (adjudicated)

Raw: `scratch/fresh-eyes-meta-3x.txt`. All three converge on execution-vs-learning.

- R1 (confounds): user-interleaving is a massive confound; Era 2/3 show execution of pre-defined paths, not autonomous discovery. Cheapest test: fresh-eyes call without checklist trigger. Verdict: sophisticated prompt-engineering workflow, not self-learning. Falsifier: remove checklists 24h; if behaviours vanish, it was context management.
  - Ruling: ACCEPT with scope. Era 1 learning IS user-driven (taxonomy, gates). Era 2/3 autonomy is real but bounded: agent chose F1-F5, D-P4r, bottleneck spec, A1/A2, composite/compose/batch adaptations under version-bound approval. The confound stands for the goal claim, not the throughput claim.
- R2 (brittle): autonomy is pre-approved rails; agent executes cached preferences; no closed-loop correction (v10/v11 duplication is the exhibit). Memory checklist-bound, not architectural; without user as global clock it drifts into repetition. Hardest test: contradictory goal shift mid-stream without user; if no fresh-eyes audit fires, it is a script.
  - Ruling: ACCEPT. The miss log is the receipt. Mitigation filed: standing rule — every future prereg opens with record-search (already-run / nearest prior / what differs) before any battery. Not yet observed holding.
- R3 (learning to execute): manual steering -> automated adherence. Proof of learning = independently modifying triggering logic to resolve a bottleneck without user reframing. Cheapest decisive experiment: remove checklist prompts, give complex goal + battery; autonomous self-correction = internalized meta-strategy.
  - Ruling: ACCEPT as the bar. Partial credit only: agent DID modify triggering logic once (U5/U6 turn routine, stub-first, per-turn appends, session-end-as-flush) after user complaint — but on user order, not self-initiated. No case yet of self-initiated checklist change.

Net: 3/3 say execution, not self-learning. No reviewer claims the throughput is fake (ledgers/verdicts/audits stand). All three demand the same settler: behaviour without the checklist.

## 6. What can be learned from the journey (not just the words)

1. Discipline scales, insight doesn't (yet). Frozen spec + blind battery + COMPLETE-gated ledgers let absence work for 35-unit programs. But the one skipped step-1 (record check) cost 42+42 runs to re-prove known answers. The log is the only anti-retread device, and it only works when step 1 runs.
2. The user is the global clock and the kill-switch. Pushes need PAT; verdicts need countersign; pivots need reframes (teaching parked 11-22, self-learning set 11-24). Without that clock the agent optimizes throughput (more batches) not direction.
3. Negative results are the durable product. STACKS, tailoring STEERS (6/6 ranking p~=2e-5, dose rho +0.67), bottleneck COMPRESSES, O2 MINES / O3 CEILING-MOVED survive. The positives that didn't (rehearsal, vhat-distill, shift ceiling ~0.5) died with teeth (SHUF, shuffled-teacher, dose, twin-matching).
4. Procedural memory (how to run) transferred; semantic memory (what is known) didn't trigger. The agent remembered HOW (batteries, quorum, resume-safe) perfectly across compaction; it failed to ask WHAT (already-run?) before proposing. That is the exact U4 answer-from-memory vs U5 no-forcing-function split.
5. The next machine must pass R3's test: without any checklist text, given a goal + battery affordance, it still checks the log, still runs blind reviewers, still files receipts — because the behaviour lives in weights + forward pass, not in the prompt. Intrinsic-v11/A1/A2 were the first bench attempts; verdicts PARTIAL / COMPUTE-ONLY / REHEARSAL-DEAD say the trunk doesn't yet own it.

## 7. Standing rules carried forward

- Every future prereg opens with record-search (already-run / nearest prior / what differs) before any blind battery. (From 11-24 miss.)
- Step 0 blocking every session (list src/tools + read README first); late = miss logged same session.
- R=3 quorum 2/3, per-seed values + range, blind battery before compute, CPU/in-worker only, NO GPU, NO PUSH without explicit order, COMPLETE-gated ledgers, verdicts programmatic + roundtrip-verified.
- One-line task record: reflections filed here; next is representational spec (recurrent trunk persisting across gaps + priced intermediates) + battery before compute, pending countersign. Nothing pushed without order.

## 8. How to re-read this file (for a contextless self)

Read order: this file -> `scratch/CURRENT_TASK.md` (newest wins) -> `src/CHATLOG.md` tail (last ~10 entries, numbers sacred) -> `src/RESULTS_INDEX.md` + `src/claims.md` (paper-claims baseline) -> the verdict JSONs cited in the tail -> only then the transcripts for wording disputes. If this file and the working record disagree, the working record wins (newest timestamp) and this file gets a dated correction, never a silent edit.
