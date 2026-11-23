# Composite program — countersigned 2026-11-23 + spec + review + runs

User (2026-11-23): "Alright, go ahead, take your time with this, log everything (remember your skills), and go ahead and design and test some experiments"

Interpretation logged BEFORE any compute:
- Scope: composite regime (bottleneck channel + always-mixed replay + load-bearing full-map price + verifier-gated hard rungs with CE-select) at bench scale, in-worker/CPU only. Versioned prereg (composite-v10) filed pre-compute, agent approval per file. R=3 seeds, quorum 2/3, ledger + verdict + transcript + CHATLOG per batch. Blind review battery on the spec pre-compute (fresh-eyes precedent). Follow-ups ≤5, specced post-verdict. NO GPU. NO PUSH without explicit order.
- Skills: memory (ledgers/verdicts/CHATLOG/transcript discipline); fresh-eyes (spec battery); eval-harness (bars/quorum). No websearch/pool (no external facts; pool health 4/5 carried, untouched).
- Step 0 carried from this session (src/tools listing + README read 2026-11-23; late-miss already filed).

## Turn — spec filed, review battery next (no compute)
- Filed src/evidence/decomp/composite-v10-prereg.md. Review battery results + adjudication below when done.

## Turn — suggestion context + review battery DONE (pre-compute)
- Prior turn (filed in CHATLOG/CURRENT_TASK 2026-11-23): recommended composite over isolation + paper core + deferred GPU; user countersigned via "go ahead... design and test".
- Battery: 3 sealed reviewers on frozen v10. R1 math REJECT-underpowered → REJECTED with filed math (R=3/quorum fits Δ~0.5+; RETAIN conservative by design). R2 implementation IMPLEMENTABLE → no patch. R3 rival (CE-select leak, replay+select conflated) → ADOPTED: arm C REPLAY-ONLY + SELECT-ADDS bar. Raw + adjudication: fresh-eyes-composite-v10-3x-results.md.
- Amendment v10.1 filed (additive: arm C, SELECT-ADDS). 9 trains (a/b/c × s0-2) instead of 6.

## Turn — composite v10.1 DONE (RETAINS-BUT-CAPPED) + extras specced
- 9 trains + 18 evals: A fwd 0.975/0.92/0.98, A rev 0.77/0.735/0.77; B fwd ~0.3 (erased), B rev 0.715-0.79; C fwd 0.935-0.97, C rev 0.75-0.775. RETAIN 3/3 (+0.66..+0.70), NOTAX 3/3, CHANNEL 3/3; BOTH-HELD 0/3 (rev <0.80 by 0.03-0.065, all arms = channel ceiling); SELECT-ADDS 0/3 (A−C +0.02/-0.04/+0.005 — select washed out at 7900 steps; L3-X3 effect was acceleration, not ceiling). Verdict d-composite-verdict.json.
- Filed compositex-v10 (E1 price-off arm d / E2 capacity K8 / E3 fade-loaded arm e / E4 select-short 800). Driver extended (arms d/e + Kin + R2cap; K4 streams bit-identical). Runs next (E1 now).

## Turn — composite extras DONE (E1/E2/E3/E4) + PROGRAM CLOSED
- E1 PRICE-OFF: D fwd best all seeds (1.0/0.995/0.98), D rev 0.8/0.73/0.725 ≈ A → PRICE-DECORATIVE 3/3 (bar 0/3). Fourth inert-price sighting.
- E2 CAPACITY: K8 rev 0.835/0.81/0.815 (deltas +0.065/+0.075/+0.045; CAP-LIFTS 2/3, s2 misses by 0.005) + K8 BOTH-HELD 3/3 → HIT. First regime holding everything.
- E3 FADE-LOADED: E rev within -0.01..+0.03 of A → 3/3 HIT (fading unused price = nothing).
- E4 SELECT-SHORT: uniform beats CE 3/3 (-0.08..-0.095) → MISS-INVERTED; L3-X3 win was substrate-specific (verH-style mild poisoning on channel).
- Verdict d-compositex-verdict.json: 2/4 bars + 2 informative misses. Distilled: RETENTION=REPLAY, CAPACITY=WIDTH, SELECTION substrate-sign, PRICE decorative when duplicating main loss. Remaining walls: reverse-long transfer + composition ops. Extras 4/5 spent. NO PUSH without order.
