# Wave 385 (execution; backlog-W326 dip-thrice autopsy, zero new sims) 2026-11-12
STOP RULE: stopped after 5-cell D0..D50 series recomputation (receipt
deep-equal). 1 direct + 1 tangential below. Spend: 0 + 0 + run. Script
scratch/track-c/w326-dip3.js; grid scratch/track-c/w326-grid.json.

## Direct: periodic dipper with a system-wide accomplice at D25

- RECEIPT: pin25 + 5-cell atD50 + absorberHistory all deep-equal vs saved
  (w309-grid/w292-grid) — the autopsy re-reads the validated rows, doesn't
  rebuild them.
- (a) PASS: 0.35/0.2 dips at D3 (m.018) + D25 (m.002) + D50 (m.014) —
  interval 22 then 25, depth flat (.002–.018, no deepening trend). Periodic
  dipper, period ~22–25, constant amplitude.
- (b) PASS: NOT a slow absorber — D6 level (m.046) AND D12 level sit between
  the D3 and D25 dips (recovery, twice over). A slow absorber never comes
  up for air; this one surfaces twice per period.
- (c) REFINED (pre-reg said monotone-degen-then-return — wrong): 0.2/0.1
  holds LEVEL through D12 (.416/.236/.086/.022/.038), dips degen ONCE at
  D25 (m.01), returns at D50 (m.066 — above pre-dip level). The return path
  is a single-delay dip bracketed by levels, not a late climb out of a
  long degen.
- System event: FOUR of five watch cells read degen at D25 (0.1/0.05 m.018,
  0.1/0.35 m.01, 0.2/0.1 m.01, 0.35/0.2 m.002 — only the long-degen 0.2/0
  was already down). 0.35/0.2's three dips are own(D3) + shared(D25) +
  own(D50): the period reading survives (3→25 = 22 ≈ 25→50 = 25) with the
  middle dip over-determined — noted, not double-counted.
- Verdict: USED with teeth (w385-dipthrice-note.md is this file). Receipt
  deep-equal + confirmed third dip with flat depth + twice-over recovery +
  single-dip return path + D25 system event logged. Spawned W343
  (dip-confirmation extension, sandbox: D75+D100 builds DS2-style same
  streams for watch cells — does 0.35/0.2 dip a FOURTH time ~D72-75
  (period holds); does 0.2/0.1 hold level; D50 receipt vs w309-grid).

## Tangential: shared dips are confounds wearing periods

- The D25 coincidence (4/5 cells) means any single cell's "period"
  threading through D25 is half-borrowed: 3→25→50 reads periodic, but the
  middle point belongs to every cell. Rule: a period claim needs its dips
  to be the cell's OWN at least twice running — shared delays don't count
  toward the interval (they count toward the geography). D75 decides: a
  fourth dip at ~72–75 with no system event makes it the cell's own twice
  running (25→50 = 25 unshared at D50, 50→75 = 25 pending).
