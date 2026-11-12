# Wave 304 (execution; backlog-W258 D6-degen predictability, sandbox-zero-new-sims) 2026-11-12
STOP RULE: stopped after validated-rule analysis on w190 grid (20 r≠0 cells x D{0,1,3,6,12,25}).
1 direct + 1 tangential below. Spend: 0 + 0. Scripts: scratch/track-c/w258b-degen.js
(w258-degen.js superseded — first rule missed W283's counts; owned below); grid w258-grid.json.

## Direct: near-bar falls, whole cells dim, holes wander

- RULE VALIDATED: barL=.02 (ident iff max-acc−.5>.02) + barH=.03 (hebb iff Hmax−Lmax>.03)
  reproduces W283 EXACTLY — identN {19,15,18,15}, tr3>6 {14 level>level, 5 toDegen, 0 exits},
  tr6>12 degen>level = 4/5 re-entry. Owned scope: zero hebb cells under this rule
  (max H−Lmax = .028 at D3 0.35/0, just under the bar) — W283's 2v1 hebb moves are
  irreproducible margin-wise (likely model-based classes); every degen/ident dynamic W258
  needs matches to the cell.
- (a) NEAR-BAR FALLS, rankAUC .887: fallen-5 D3 margins {.012,.02,.046,.076,.094} vs survivors
  {.018...400}. Strong ranking, not deterministic — criss-cross both ways (margin-.018
  0.35/0.2 degen-at-D3 RE-ENTERS at D6; margin-.094 0.2/0 falls). Margin is the fall's address,
  not its cause.
- (b) WHICH STAR DIES: ALL OF THEM. Lost-star counts l0.1:3, l0.2–l1: 2–3 each, l0:1 — no λ
  spared; keptStarsInFallen = {} EMPTY. Fallen cells dim as a UNIT (no λ survives inside);
  l0 loses least only because it starred least. The fall is cell-level, not λ-level.
- (c) DIP TWICE? NO: D6-degen {0.2/0, 0.2/0.2, 0.35/0, 0.35/0.05, 0.35/0.35} vs D25-degen
  {0.1/0.05, 0.1/0.35, 0.2/0, 0.2/0.1, 0.35/0.2} — overlap 1/5 (0.2/0 only). Different cells
  dip at different delays: degen-churn across cells AND time, no persistent weak set.
- Verdict: USED-strong (w304-degen-note.md is this file). Spawned W275 (churn census).
- First-build debt owned: w258-degen.js (bar .1/.05/.15, level-only max) missed W283's counts
  (ident {11,6,3,0}); grid-searching (barL,barH) to W283's exact numbers found (.02,.03) with
  tot=0. Rule: fit the classifier to the published counts before trusting its answers — a rule
  that can't reproduce the known table is a different question wearing the same words.

Verdict: USED-strong. No precursor, no conflict.

## Tangential: churn has no address (0-spend, reasoning)

1/5 dip-twice means the hole is not a PLACE (no weak cells) but an EVENT (cells passing through
near-chance as delay lengthens, at different times for different cells). A hole census that lists
cells is stale by the next delay; the stable object is the RATE (5/20 dip per step-ish) and the
MARGIN-RANKING (.887) that predicts the next dippers. Rule: for transient phenomena, ship the
rate and the ranking, not the roster — rosters of churn are outdated on arrival. W274's
detection-shape inherits the format (ship curves + ranks, not winner-names).
