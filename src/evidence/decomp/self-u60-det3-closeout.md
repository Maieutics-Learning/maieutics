# U60-DET3 closeout — MANIP-FAIL (filed 2026-11-26)

**Verdict:** `d-newai-self-u60-verdict.json` = MANIP-FAIL (correct per filed guard-first gating;
30 reviewers unanimous: 10 Wave-0, 10 Wave-1, 10 Wave-2 R1 + 30 discussion confirms).
This doc is interpretation — no bar moved, no ledger rewritten.

**What happened:** regime pressure (quarter-rotating-hot diet, train-test matched 0.7/0.3)
elevates carry quarter-variance on average (regime mean ~0.00333 vs canon max 0.003314)
but only on half the trunks (10/20 above strict max). Quorum 15/20 not met. Per prereg,
DET3 bars are NOT interpreted — the guard fired before the detector question is reached.

**Reading (not a retune):** the substrate hears the regime diet weakly and unreliably.
Half the trunks mark quarter structure in carry; half sit inside the canon null band.
That is a substrate property, not a sample-size problem (U58 v1.5 already closed that door:
gap_ROT 0/3 → 14/20 at 4x N, residue localized to substrate/mapping). Options from here need
their own preregs: (i) stronger/longer regime pressure (dose or steps — new prereg, no tuning
of U60); (ii) different marking channel (not carry); (iii) close the detector line as
substrate-dead and keep the veto line's acting arm gated by task context instead of carry.

**Licensed next (choose one, each needs its own prereg + battery + countersign):**
- U60b: stronger regime dose (e.g. 1.0/0.0 hot match, or 1600 steps) with the SAME guard.
- U60c: new marking channel (e.g. per-head vote entropy by quarter) with a new guard.
- Close detector line (substrate-dead on carry) — E-NE1 consumers then need a non-carry gate.
- The veto re-scope (U62, user said yes) is unaffected — it gates on task context, not carry.

**Files:** driver newai-selfu60-driver.js (D1/D2/D3 pins at build); wave0 ledger (canon band
mean 0.002272 max 0.003314); 20 regime ledgers; 80 probe ledgers (note: `-cclean-*`
infix matches filed v1.5 naming, reads/writes consistent); verdict; 3 wave review docs.
NO PUSH without order.
