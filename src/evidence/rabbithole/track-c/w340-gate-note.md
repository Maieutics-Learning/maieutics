# Wave 340 (execution; backlog-W288 gate-tie autopsy, sandbox) 2026-11-12
STOP RULE: stopped after gate-tie autopsy (window ladder + per-jackpot
agreement + split-half; zero new sims on w220-feed; receipt exact).
1 direct + 1 tangential below. Spend: 0 + 0 + run. Script
scratch/track-c/w288-gate.js; grid scratch/track-c/w288-grid.json.

## Direct: complementary on three, ceiling at 400, slope dies post-crossing

- RECEIPT: rank .916/.907/.908 exact (the audit stands on the confirmed feed).
- (a) CONFIRMED: window ladder level .812/.916/.999 (@200/@300/@400);
  slope@100-200 .802 ≈ level −.010 (redundant again, earlier too); combo .817
  ≈ level. Trajectory adds nothing at any window — W299's verdict travels
  backward to @200 intact. New: slope@300-400 .539 — velocity has NO signal
  post-crossing (halves .491/.582 agree it's noise); slope is useful only
  pre/during the crossing, level everywhere. Velocity isn't a second feature,
  it's an early-only feature.
- (b) HALF-MISS: agreement 12/15 ✓ but nested ✗ NEITHER way — slope-only
  s26 vs level-only s24 + s36a2: COMPLEMENTARY ON THREE, symmetric swap, not
  containment. 7 both-catch, 5 both-miss, 3 split. The tie (.916 vs .907) was
  hiding a swap, not a subset: each feature catches runs the other misses.
  Deleting slope (W299's prescription) costs s26; deleting level costs two.
  Prescription refined: level first, slope as the +1 catch — the combo's .817
  ≈ level hides that the misses differ. Complementary redundancy, not pure.
- (c) HOLDS-ISH: @400 both halves 1.000 — CEILING, not overfit (.999 is
  saturation: every jackpot separable post-crossing in both halves).
  @200 halves .799/.823 (within .05 ✓); @300 .938/.885 (diff .053 — misses
  the bar by .003, owned; direction same, magnitude halves disagree).
- Verdict: USED with teeth (w340-gate-note.md is this file). W299 scoped
  (redundancy is complementary, prescription refined level-first+slope-+1)
  + window ladder + ceiling certified + slope-death timed. Spawned W305
  (dissenter autopsy: traj shapes of s24/s26/s36a2).

## Tangential: ties hide swaps — audit the misses, not the means (0-spend)

.916 vs .907 looked like "same thing twice" until the per-item table showed a
symmetric swap: equal means, different misses, neither nested. Any tie between
two predictors on the same items owes the contingency table, not the headline
AUCs — the table is where "redundant" vs "complementary" lives, and the
prescription flips on it (delete-B vs B-as-+1). Rule: break every feature tie
per-item before deleting the loser; the loser may own items the winner can't
see. W305 looks at the three owned items (do slope-only catches rise
late-fast, level-only plateau early — is the swap a timing signature).
