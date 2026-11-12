# Wave 209 note — backlog-W179 adaptive-tau guard (sandbox, executed)

STOP RULE: stopped after one 14-cell paired grid (N x eta x arms, 300 trials/cell; no estimated-eta/drift arms — spawned W196, not built). 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (worker sandbox, seeded, reproducible; w179-adaptau.js). Clock: R32 2/5. Pre-registered predictions scored: (a) CONFIRMED (b) CONFIRMED-shape (c) CONFIRMED.

## Direct: the 2.5se rule holds everywhere; fixed tau pays in FA, adaptive in detection

Grid: W162/W188 world verbatim (12 families x N records; shifted fraction p truly disagree; noise flips any vote w.p. eta; fire iff mean > tau). Arms same-seed paired per cell: adaptive tau(eta)=eta+2.5·se (se=√(eta(1−eta)/12N)), fixed .15 (primary, the W168 point), fixed .2. eta in {0,.05,.1,.15,.2,.25,.3} x N in {20,5} x p in {0,.1}; exact-binomial null-FA analytic (n=12N upper tail).
- (a) Guard receipt ✓: adaptive null-FA ≤ .05 at ALL 14 cells — N=20 max .017 (eta .1), N=5 max .037 (eta .1). Worst cell still clears the bar by .013. The rule transfers from rule-of-thumb to receipt.
- (b) Detection shape at p=.1 (adaptive − fixed.15 paired): N=20: eta 0: 1.0−0.0=**+1.0** (fixed is BLIND below threshold; adaptive tau=0 sees everything); .05: 1.0−.2=+.8; .1: .963−.93=+.033 (tie); .15: .703−1.0=−.3 BUT f15 FA=.49 (drowned — its "detection" is a siren); .2+: adaptive .427/.273/.103 vs f15 1.0 with FA .96–1.0 (pure alarm). N=5 same shape (eta 0 tie 1.0−1.0 via rounding artifact; .05: 1−.997; .15: .723−1.0 with f15 FA .41). The "price" framing FLIPS: fixed doesn't keep detection-for-free at high eta, it keeps firing-for-free. Adaptive's payment (lower detection) is honest blindness; fixed's payment (FA≈1) is a siren. Curve, not scalar — reported as such.
- (c) Exact analytic validated ✓: |analytic − empirical| ≤ .01 at N=20, ≤ .023 at N=5 (worst: eta .1, .0146 vs .037). W188's normal-approx shoulder errors (off by ~.1, wrong direction) are fixed by going exact — the honest-toy note in W188 is now a receipt.
- eta=0 corner owned: tau(0)=0 looks degenerate, behaves perfectly (FA 0, det 1.0 — with no noise any disagreement is real). No floor needed; the rule handles its own corner. (W128's 0.03 floor was for a different meter; untouched.)
- Resonance re-sighted: fixed .15 at N=20 goes 0.0 (eta 0, blind) → .93 (eta .1, sweet spot) → FA .49 (eta .15, drowned). Adaptive at the same cells: 1.0 → .963 → .703 with FA ≤ .017 throughout. W168's point was luck-of-eta; the rule reproduces its detection without the cliff.

Verdict: USED (guard holds with margin; price curve mapped; exact-analytic receipted). No precursor, no conflict.

## Tangential: report prices as curves with the competitor's bill attached (0-spend, reasoning only)

"Price detection loss vs fixed tau" (the spawn wording) nearly framed this wave as adaptive-apologetics: at eta .15 fixed "detects" 1.0 vs adaptive .703 — a loss, until you print fixed's FA (.49). Any price comparison that reports one arm's cost without the other's is a sales pitch. Rule: paired cells print BOTH arms' FA and detection, and drowned cells (FA>.5) forfeit their detection column — a siren's sensitivity is not a number. Applied here; audit forward.

## Spend / queue

- Spend: 0 + 0 + 1 grid (14 cells x 3 arms x 300 trials; floor). Consumed backlog-W179 removed; spawned W196 to BACK. Backlog 17. Synthesis R32 clock: 2/5.
- W196 (B, sandbox): estimated-eta adaptive tau — eta-hat from burn-in votes, tau(eta-hat); mis-estimation robustness + mid-run eta drift; does the guard hold when eta is learned not given; vs fixed .15 under drift (the field version of this wave — eta is never known).
