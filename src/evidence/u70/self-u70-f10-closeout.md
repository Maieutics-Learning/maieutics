# U70-F10 closeout (EXECUTED 2026-11-27, owner countersign "Ok lets go" on exact v1.1)

## Design executed
3 independent F4-exact members per stream-seed (initBases 90000/94000/98000 = filed F5 births), majority ctx/action vote, vote-gap with locked 73000+seed+m shuffle offsets. 80 rows (60 member + 20 vote), 0 invalid. Smoke s0 clean, filed, no tweaks.

## Replication gate: PASS
All 60 member rows match filed F5 k-ledgers exactly (maxDiff 0.0000, 0 mismatches / 1080 key comparisons). Determinism holds; the vote is interpretable.

## Verdict: FIXED
- Vote probe pooled **0.8832** (20/20 pass, median 0.89, SD 0.04 — tightest distribution of the program).
- Vote gap pooled **0.1395** (20/20 pass).
- Paired vote−F4: dProbe **+0.164** CI [+0.073,+0.255] (significant); dGap/dCtx ~0.
- Both locked bars met on the vote → FIXED. Member pool for reference: probe mean 0.5854 (the lottery, as filed).

## Rescue shape (descriptive, no verdict weight per no-upgrade clause)
- Grave list (locked: 2,6,7,8,12,13,14,16): vote-probe mean **0.8725**, ALL 8 ≥0.70 → un-graved. Healthy vote-mean 0.8903 ≥ member-mean → no robbing.
- Shape reads **decorrelated rescue** (grave-specific un-graving, not uniform lift): errors move with the dice, majority vote eats them. Seeds 8 (members 0.137/0.123/0.653 → vote 0.8633) and 19 (0.93/0.403/0.073 → vote 0.9367) are the cleanest exhibits.
- Uniform-lift alternative rejected on the filed shape.

## Disagreement check (descriptive — reads NEGATIVE, filed honestly)
- Split-rate overall 0.1133; grave seeds **0.0687** vs healthy **0.1431** — INVERTED vs the novelty-signal hope. Splits do NOT mark the bad seeds (catastrophe births agree with each other more than healthy births do).
- Consequence: voting fixes formation via error decorrelation, but split-rate is NOT the refusal sensor. The novelty channel still needs its own sensor (trace-logging study, queued). Disagreement-as-detected-novelty is rejected on this evidence.

## Follow-ups (diagnose-and-improve; each needs own prereg + battery + countersign)
- Phase-2 novelty transfer: formation is now reliable (20/20 vote) — the sequencing lock can be revisited in a gated proposal. NOT run here.
- Trace-logging signal study (per-trial KL/entropy/V4-gap as refusal sensor) — still the missing half.
- GRU-128 capacity ruling-out — still queued.
- No Phase-2 in this wave. NO PUSH without order.
