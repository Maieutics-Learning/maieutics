# Wave 316 note (execution; backlog-W268 setup-window interference, bench)

STOP RULE: stopped after 8-cell ON-window placement grid (s10 @auxW1 seed
10; w251 rig vendored verbatim; 2/2 receipts bit-identical). 1 direct + 1
tangential below. Spend: 0 search, 0 fetch (bench, same seed as W251).
Clock: R50 2/5. Pre-reg scored: (a) REFINED (b) REJECTED-as-stated (c)
SPLIT (small-dose CONFIRMED, big-dose REJECTED-informatively) (d) CONFIRMED.

## Direct: the window narrows to 26-50, and late ON heals

Placement: ON1-25 .8367 (receipt) / ON26-50 .8933 / ON51-75 1.000 /
ON76-100 .9933. Interference does NOT span 26-100 — it is a 25-step
sensitive sub-window at 26-50; ON during 51+ is harmless (a refined:
order holds, scope shrinks — W295's "~26-100" was 4x too wide, smeared by
cells that always bundled 26-50 with later ON). Pure-window ON26-100 =
.9667, rejecting (b)'s <=.90 — and note the NON-MONOTONE surprise: adding
harmless ON51-100 to ON26-50 IMPROVES .8933 -> .9667. Late ON is not
neutral, it is mildly healing (or equivalently the OFF-edge at 50 costs
~.07 — W285 discriminates). Loci additivity (c): early10+R100 = 1.000
(confirmed >=.95 — small dose + absence is clean); early50+R100 = .8333,
rejecting <=.70 — the absence rescues +.1966 after dose-50 (.6367 ->
.8333), replicating W295's +.20 cross-check to the third decimal of
effect size. Two independent sightings of the same +.20 return-value:
the return's worth is dose-proportional and protocol-independent.
early50+R100 (.8333) ~= early25-alone (.8367): a 50-dose with absence
equals a 25-dose without — absence halves the effective dose.

Verdict: USED with teeth (window 4x-narrowed + healing surprise + +.20
replicated + 2 receipts; two pre-regs corrected by the data). No
precursor, no conflict.

## Tangential: bundle-splitting keeps paying (0-spend)

W295 split early-dose from absence-duration; this wave splits the window
itself into four quarters and finds three of them empty. Every bundled
protocol so far has hidden a narrower truth (W275's duration, W295's
window, now the window's own quarters). Rule: when a locus is confirmed,
quarter it — the sensitive part is usually a fraction of the confirmed
range, and the harmless remainder is where the next surprise (here:
healing) lives. W284's tail anatomy is the same move on the budget axis.
W285 (late-ON healing vs OFF-edge transient: ON26-75 healing replicate;
ON26-50+OFF-forever edge test; ON26-50+return101 gap variant).
Spawned W285 (A bench s10@auxW1 seed10; does extending ON past 50 heal;
is the damage in the ON or the OFF edge; return-101 after pure 26-50).
