# Wave 292 note (execution; backlog-W248 return-blindness autopsy, sandbox)

STOP RULE: stopped after 18-arm reproduction WITH per-audit bill/band trails
(bit-identical to w231) + drop-vs-band ratios + 9-candidate threshold sweep on
saved y-series. No new conditions. 1 direct + 1 tangential below. Spend: 0
search, 0 fetch. Clock: R46 2/5. Pre-reg scored: (a) CONFIRMED-stronger
(b) REJECTED (c) REJECTED (d) CONFIRMED.

## Direct: the blindness is 10–20x structural; the signal isn't there

Receipts (d): alarms + phase bills bit-identical (maxDiff 0); trails saved to
w248-trails.json (18 runs × 20 audits).

Drop-vs-band (a): |drop|/band-width ≤ .13 everywhere measurable (hybrid
.09/.09/.05/.05/.11, range .05/.13/.10/.08/.12) — the B→A bill-drop (~2–4)
hides an ORDER OF MAGNITUDE inside post-relearning bands (30–60), far past
the <1 bar. Two nulls owned (hybrid-s22, range-s55: their own resets cleared
the trailing history, so no band existed at 1400 — resets eat the very
memory the gate needs).

Sweep kills the detector-fix (b)(c): narrower bands (0.25×/0.1×) detect
0/12 returns — tightening changes nothing, because the gap isn't marginal.
CUSUM gets delay-0 on 3/12 (s44-hybrid, s33/s44-range) always with FAs;
level-triggers get delay-0 on 4/12 (s44 both, s11/s33-hybrid-p25, s55-range)
with 2–5 FAs each. Nothing is clean anywhere. Worst: seed 66 — NO candidate
fires on either arm (all null, zero FAs): s66's return leaves no bill
signature at all. The miss ledger: blindness is total on 1/6 seeds, FA-
priced on 4/12 runs, clean on 0/12.

Conclusion: bill-based return detection is hopeless — not under-tuned.
The bills don't carry the return on most seeds, so no threshold, however
swept, can find it there. The fix must leave the bill series: dead-man
re-estimation (reset every K audits regardless of signal) fires everywhere
by construction. W265 tests K.

Verdict: USED-strong (10–20× structural ratio + detector-fix killed with
sweep + per-seed miss ledger + prevention direction). No precursor, no
conflict.

## Tangential: a sweep that finds nothing found the boundary (0-spend)

Nine candidates, twelve runs, zero clean detections — a failed sweep is
usually filed as inconclusive. It isn't: the sweep COVERED the reasonable
space (bands, levels, CUSUMs) and every cell is either blind or FA-priced,
so the boundary is drawn — bill-series return detection is impossible HERE,
and the impossibility is the product. Rule: a sweep with full miss ledger
is a closure (don't tune thresholds on bills again); a sweep reported as
"inconclusive" is an invitation to waste the next wave re-tuning. W265
builds the dead-man switch instead.
