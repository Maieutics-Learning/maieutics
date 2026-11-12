# Wave 275 note (execution; backlog-W234 early-aux-toxin mapping, bench)

STOP RULE: stopped after 10 bench cells (9 w234-A + 1 decisive true-cure
w234-B; s10/s7/s11, TinyNN parity6 h16, 400 steps, 7-pt trajs). 1 direct + 1
tangential below. Spend: 0 search, 0 fetch (vendored w217 rig generalized to
cut/restore windows). Clock: R43 2/5. Pre-reg scored: (a) CONFIRMED (b)
REJECTED-as->=.95, PARTIAL rescue (c) CONFIRMED x2 (d) CONFIRMED with owned
whiff.

## Direct: 25 steps poison; absence-duration is the dose

Cells (s10 @auxW1, hard400; awAt = ON except in cut..restore windows):
- ON 1-25 then OFF forever (early-only): .8367 (traj
  .5067/.4933/.4467/.4133/.49/.83/.8367).
- H25+gap as-run {recut:25,cut:50,restore:100}: .8367 BIT-IDENTICAL — cell bug
  owned (see below): recut:25 kills the 100+ return, so this cell never tested
  any return at all.
- H50+gap {cut:50,restore:100} (ON 1-50, OFF 51-100, ON 101+): .8333,
  trajectory bit-identical to W217-C H100+gap — degeneracy receipt (c1) ✓.
- const (continuous aux): .9833 (>=.95 ✓). H0+gap {start:100,cut:50,
  restore:100} (= OFF-window inside OFF): .9933, bit-identical to W217 100+@1
  — degeneracy receipt (c2) ✓: a gap inside OFF is nothing.
- TRUE cure {cut:25,restore:50} (ON 1-25, OFF 26-50, ON 51+): .9167 (traj
  .5067/.5233/.9533/.9267/.96/.95/.9167). The 51+ return rescues +.08 of the
  -.15 deficit but leaves a scar (below .95, far below const .9833).
- Lottery generality (toxic corner Hx+gap): s7/s11 @1 .9967/.9967 (>=.95 ✓);
  @2: s7 .9267 (mild dose dip, owned), s11 .9833 (>=.9 ✓ as predicted).
- in400: s10 toxic cells .9219-1.0 (length-specific damage, base intact);
  const/other-seeds 1.0.

(a) CONFIRMED: 25 steps of aux poison s10 to .8367, within .004 of H100+gap
.8333 — 25 steps are enough. (b) REJECTED-as-stated (true cure .9167 < .95)
but PARTIAL: the return recovers more than half the deficit. (d) CONFIRMED
with whiff: lottery holds at @1 unanimously, s7@2 dips to .9267.

Mechanism REFINED (W254): the toxin is not early-aux + gap + return — the
return after LONG absence is irrelevant (bit-identical .8367 with and without
it). It is early-aux + sustained ABSENCE: 25-step absence → mostly rescued
(.9167); 50-step/permanent absence → not (.8333/.8367). Poison scales with
absence duration, not with early dose (H50 ≡ H100 says early dose is
forgotten). W251 measures the curve.

Cell-bug owned: the as-run (b) cell tested early-only, not the cure — an
empty cut/restore window behind a recut. A misbuilt cell that replicates
exactly is still a finding (the 100+ return is irrelevant after long
absence), but it never substitutes for the designed A/B: ran both, labeled
which is which, scored the designed one.

Verdict: USED-strong (25-step poisoning + absence-dose ordering + 2
bit-equal degeneracy receipts + lottery generality + owned bug). No
precursor, no conflict.

## Tangential: three equalities sign the mechanism (0-spend, reasoning)

H50+gap ≡ H100+gap (early dose forgotten). H0+gap ≡ full-ON (absence inside
OFF is nothing). Early-only ≡ early+gap+return (return after long absence is
nothing). Three independent bit-identical equalities, one signature: only
the last ~50 steps of aux-status shape the outcome; everything older is
forgotten, everything later is too late. When equalities repeat, stop
treating them as controls and start treating them as the result — the
follow-up (W251) measures exactly the forgetting window they point at. Rule:
a control that replicates exactly three times is not a control anymore, it
is the mechanism signing its name.
