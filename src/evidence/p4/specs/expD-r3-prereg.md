# Exp-D prereg: round-3 compounding (PRE-COUNTERSIGNED 2026-11-19 — runs after toy verdict)

Agent experiment under the user's 2026-11-19 pre-countersign (one experiment of my
choice after the toy loop). Runs ONLY if the toy loop passes both checks (else the
line is dead and there is nothing to compound).

## Question
Does score-driven selection compound over rounds, or does it saturate after one
reweighting? (Run-3's lesson was single-shot saturation; P5 needs compounding.)

## Design (single variable vs toy: ONE more round)
Same passing arm (E-system, same pools A/B/C, same 3 seeds). Feed round-2
true-arm scores back through the SAME transform (same TARGET/FLOOR, no tuning):
round-3 trains 500 fresh students on weighted-500 drawn from the pool-A remainder
after rounds 1–2 (ledger-verified disjointness; if remainder < 500 in any cell,
top up from round-1 lines EXCLUDING round-1/2 train lines, logged — weights, not
lines, are the treatment). WITHHELD round-3 (uniform-500 from the same remainder)
rides along as the null. No SHUFFLED arm (operator already priced in toy).

## Bars (descriptive + one gate, per seed then 3/3 quorum)
- Gain: gainR3 = agree(S3,E) − agree(S2,E) on held-out Pool B. compounding =
  gainR3 ≥ +0.03; saturation = |gainR3| ≤ 0.03; collapse = gainR3 < −0.03.
- Direction re-check at δ=0.10 on Pool B (margin agree(S3,E) − agree(S3,S1));
  CAVE still fails the line even with compounding (theatre check).
- WITHHELD round-3 must stay flat (|gain| ≤ 0.05) or the round-1/2 gains are
  re-train luck, not selection.
- Claim: compounding on ≥2/3 seeds with direction held 3/3 → P5 may plan
  multi-round measurement. Else saturate/collapse → file the ceiling, P5
  measures single-shot system effects only.

## Expectation
Saturation (|gainR3| ≤ 0.03, 2–3/3 seeds): run-3 saturated fresh-uniform gains
regardless of train fit, and round-2 already harvested the selection effect.
Direction holds (frozen tutor, same E). WITHHELD flat.

## Pre-mortem
Strongest objection: round-3 trains on a twice-depleted remainder, so any gain
change is pool-depletion, not compounding — answered by the remainder-top-up rule
+ WITHHELD drawn from the SAME remainder (depletion is symmetric; the contrast
is selection). Most likely failure: remainder too thin in failed cells (the
transform concentrates where lines are fewest) — guarded by top-up logging; if
>30% of any round-3 train is top-up, file THIN and downgrade the claim.

## Ledger
`src/evidence/p4/expD-r3.json` (per-seed gains, margins, remainder counts).
Cost: 6 trains (3 true + 3 withheld) + evals.
