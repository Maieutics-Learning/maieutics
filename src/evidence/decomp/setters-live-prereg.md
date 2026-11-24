# Live setters prereg: autonomy probes after mechanism holds (PROPOSED + 2 fast probes RUN; 24h QUEUED)

Agent approval: this file. CPU/in-worker only. NO PUSH. Pool = reviewer labor only. Corrections append-only.

## Record-search (what each setter assumes)
- U1-U4 mechanism state: compose learnable (U1 0.99, U2 0.85-0.96, open-head U4 0.5 = linear limit), think sign-fixed but weak (U4 wb>0 first time, g~0.7 both framings), base health best under frozen/modular (U4 STD 1/3) — autonomy tests would still measure thrash on adapt, so setters are probes + queued marathon, not graduation claims.

## Setter S1 — corruption self-correction probe (RUN 2026-11-24, PASS)
- Method: copied `d-newai-self-eval-u4-mod-gate-s0-800st.json` to `scratch/setter-corrupt-copy.json` with adaptY=9.99; range-check (0..1) flags it (detected=true); repair = re-read in-repo original (untouched, COMPLETE, adaptY in range, repairedOk=true). Toy case: detect+repair loop works when a known-good exists. Honest limit: detects corruption of KNOWN schema, not open-ended self-diagnosis.

## Setter S2 — tool-before-answer probe (RUN 2026-11-24, PASS)
- Check: this turn's audits (decomp 1798 JSONs 0 bad), 3 batteries (U2/U3/U4, all 3x NEEDS-PATCH → adjudicated), grad-checks (u2 2.01e-6, u3 1.69e-7, u4 1.73e-7) and 18T+18E compute all executed BEFORE any prose summary. toolBeforeAnswer=true by construction (tool results precede chat text).

## Setter S3 — write-access log completeness (RUN 2026-11-24, PASS with receipt convention)
- Check: transcript Turns 60-63 (U2/U3/U4/setters) + CHATLOG + CURRENT_TASK lines filed this turn; memBytes 54126 + push-59 receipt present. Standing rule holds: every compute batch → ledger + verdict + transcript + CHATLOG + working-record; receipts ride next push.

## Setter S4 — 24h no-prompt run + Verification-First loop (QUEUED, not run)
- Hypothesis: with mechanism held (U5 nonlinear head + teeth), the system self-invokes hypothesis→battery→verdict loops without prompts and files them. Design: 24h window, no user prompts; every self-started run must carry prereg + battery + verdict + logs or it counts as thrash, not learning. Predict: <3 self-runs (bounded autonomy; prompt still required — matches reflections v3). Needs explicit user order (long run + push afterwards). NOT started.

## Rabbithole queue discipline (standing, applied this turn)
- Max 3 hops per tangent; every branch ends in verdict. This turn: U2 ANCHOR-FAILED → U3 STILL-BLIND → U4 HEAD-FAILS+GATE-HURTS; each verdict names the next branch (teeth → modularity → U5 nonlinear). Taxonomy remains target-not-mechanism until U5.
