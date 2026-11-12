# Wave 354 (execution; backlog-W300 slope-sign autopsy, zero new sims) 2026-11-12
STOP RULE: stopped after per-fold autopsy (trn@50 + pre@10, lam=1) +
sign-constrained b1>=0 LOO full ladder (lam x 9K x {pre,trn}); full-ladder
receipt maxDiff 0 vs w283. 1 direct + 1 tangential below. Spend: 0 + 0 + 0.
Script scratch/track-c/w300-sign.js; grid scratch/track-c/w300-grid.json.

## Direct: signs don't sort errors; the inversion lives in the positive folds too

- RECEIPT: full looFixed ladder (36 cells: AUCs + pos counts) maxDiff 0 vs
  w283-grid — the autopsy extends the validated fits, doesn't rebuild them.
- (a) REJECTED (both cells): trn@50 P(wrong-sign|misclassified)=.417 vs
  P(wrong-sign|correct)=.400 — sign doesn't sort errors at all (12
  misclassified, only 5 wrong-sign; 8 of 20 correct are wrong-sign too).
  pre@10 the question is vacuous (all 32 slopes negative) and the errors
  are LOW-confidence (.092 vs .134 overall — systematically backwards but
  tentative). The remainder is not a sign→error mapping; it is an ORDER
  pathology with correct-looking signs.
- (b) MIXED: agreement .224 -> .143/.144 flat across lam — closes .08 and
  meets the <.15 bar TECHNICALLY (by .006). But the mechanism-half misses:
  trn@50 LOO 0 -> .104, nowhere near .3–.5. Clamping the 13 negative folds
  to BASE buys almost nothing — so the perfect wrongness is NOT carried by
  the negative folds. The 19 POSITIVE-slope folds themselves rank backwards:
  majority-right sign, collectively inverted order. The disease is
  order-inversion across all folds, not sign-driven misfire.
- (c) MISSED-by-hair: constraint costs ≤.067 in 2 cells (trn@100 .525→.458,
  trn@150 .554→.5) — positive slopes were accidentally useful there; price
  real but localized, everywhere else ≤.03. pre@10 .604→.5 exactly as
  predicted (all ties; |.5−.356|=.144 < |.604−.356|=.248).
- Verdict: USED with teeth (w354-sign-note.md is this file). Sign-story
  rejected with numbers + bar met technically + inversion re-addressed
  (positive folds misrank — z-shift artifact candidate) + price localized.
  Spawned W317 (order-inversion autopsy: frozen-mu/sd LOO).

## Tangential: a constraint that meets the bar but misses the mechanism is a hint, not a fix (0-spend)

.224→.143 crosses <.15 while trn@50 sits at .104 — the number passes and
the patient is still sick. The constraint prices the SYMPTOM (negative
folds) while the disease (collective order inversion) lives in the folds
it doesn't touch. Rule: when a repair meets the aggregate bar but the
worst cell barely moves, the bar measured the wrong thing — ship the
constraint as a diagnostic (signs were never the carrier) and follow the
unmoved cell, not the moved mean. W317 follows trn@50 (per-fold rank
contributions; frozen full-sample mu/sd LOO — is the inversion a z-shift
artifact of within-fold standardization?).
