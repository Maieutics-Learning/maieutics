# Lane 2 v10 — ledger-augmented memory (ModelLedger harness first)

Agent approval: this file. User countersign: 2026-11-23 practice program (all lanes in order 2→3→1 + up to 5 extras per lane after each verdict).

## Why
Memory skill works for the agent as append-only log + retrieval, but nothing compels or scores it. Port that shape to the bench brain as an executable function: a durable store the learner can actually read at test time. Start frozen (no weight change) so a positive means the store holds signal; train the reader only if frozen shows something (same gate as ExpD).

## Design (harness-level, frozen first; assocR compositional long-horizon)
- Base: filed adapt-base tutor s0/1/2 (mixed forward+flip 1..3 pairs, attn h48). Zero-shot control = base on compositional 4-pair test (never trained on 4-pair; construction below).
- Ledger: 200 worked 1-pair lines with teacher labels (feedback), seed-matched per s (rng 16400+s): random k in 0..3, v in 0..3, x=[k,4+v,k,8], y=v. Append-only, per-learner.
- Test (compositional, 200 lines, fresh rng 16500+s): for each line pick target ledger entry t (cycled i%200), take its (k0,v0); generate 3 distractor pairs on the other 3 keys (random values); shuffle the 4 pairs; query k0 → answer v0. So the test line CONTAINS a ledger binding plus distractors — the store holds the core fact, the query adds length. Uses all 4 keys (assocR keyspace), no undefined tokens.
- Arms (all frozen, zero grad steps):
  - NOLEDGER: base zero-shot accuracy on test.
  - LEDGER-kNN (frozen reader): for each test query (pairs P, query key q), score each ledger line (k,v) as 2*(k==q) + (# of test pairs equal to (k,v)); take top k=8 (ties → lower ledger index), majority-vote their teacher labels (ties → smallest label).
  - RANDEX: same vote but 8 random ledger lines (null control; same budget, no signal).
- k-NN is the frozen reader. It tests: does query-aware retrieval over the store bridge length?

## Bars (R=3 seeds s=0,1,2; quorum 2/3; verdict d-lane2-verdict.json)
- HELPS: LEDGER-kNN >= NOLEDGER + 0.05.
- ABORT (retrieval == random): |LEDGER-kNN - RANDEX| <= 0.03 → store adds nothing beyond exemplar prior; do NOT train reader.
- PASS also needs LEDGER-kNN > RANDEX (strictly, else the vote is prior-matching).
- Expectation: HELPS or ABORT (filed openly; long-horizon 5-pair shares subskills with 1..3 but needs binding at length — retrieval may or may not bridge it).

## Phase 2 (gated — runs ONLY on HELPS)
- Train reader: finetune base 200 steps on worked ledger (same recipe as adapt-few, B8 lr5e-3) vs finetune on same-budget random lines; bar trained-ledger >= trained-random + 0.05. Specced now, executed only if Phase 1 HELPS (else filed as NOT-RUN with reason).

## Nearest-failure
- selfdir E4 (learner-chosen by CE == random; differs: here choice is retrieval at test, not training selection).
- adapt rung-2 (tutor-vs-scratch NO-ADVANTAGE; differs: here help comes from explicit store, not weight prior).
- verH diet (retrieval over poisoned store hurts; ledger here is clean teacher-labeled).

## Cost
- 3 seeds × (200 ledger + 200 test gens + 3 evals). Seconds in-worker. Driver: lane-driver.js runLane2 (new; reuses LearnInit + lnGenReverseDistinct; COMPLETE-gated).

## Ledgers
`d-lane2-s{seed}.json` (nolegger/ledger/randex accs + k + sizes + rngs) + `d-lane2-verdict.json`. Transcript 2026-11-23-practice.md + CHATLOG. NO PUSH.
