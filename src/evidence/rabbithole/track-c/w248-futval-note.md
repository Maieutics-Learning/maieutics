# Wave 248 note — backlog-W212 bench-substrate futility validation (sandbox, executed)

STOP RULE: stopped after 64-cell bank-bootstrap grid (2 substrates × 2 timings × 4 shifts × 2 policies, N=20000) + pooled-shape control + clamp-artifact tiebreak. 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (banked w177 masked trajs + w194 ladder l12; zero new sims). Clock: R38 5/5 FULL → synthesis R39 jumps queue next per rule 5. Pre-reg scored: (a) REJECTED-asymmetric (b) CONFIRMED (c) CONFIRMED (d) reported.

## Direct: futility stands, directionally scoped — the lumps break the unclaimed side

- Grid (recentered exact null + δ∈{0,.5,1,2}σ shifts, OBF-2 bounds verbatim): null two-sided totals (claim+rev) — tax I6 obf2 .154 / fut .140; tax I12 .118/.105; ladder I6 .096/.087; ladder I12 .075/.067. All exceed nominal .05, ALL concentrated reverse (positive-side claim alone: .007–.028 everywhere — holds). Bigger N tames it (I12 < I6); lumpier substrate worse (tax > ladder).
- Cause PROVEN by control: pooled-bank bootstrap (same shape both arms) → total .0525 symmetric. Separate-shape → .151. The validity-breaker is arm-shape difference (h16 spread skew −1.94 vs h24 ceiling-pile −1.03), which W178's permutation null assumed away by construction (shuffling labels enforces exchangeability — the wrong null when future arms bring their own shapes). Permutation validity ≠ bootstrap validity; the trail's field test used the former, deployments live in the latter.
- Scope amendment (not a conflict): the trail only ever CLAIMS the positive direction, and the positive side holds everywhere (≤.028). Futility stops are symmetric but claim nothing. So: binding futility T=1.0 STANDS, efficacy claims are DIRECTIONAL by adoption (claim iff positive bound crossed; reverse excursions unclaimed by construction). W229 confirms the directional rule + prices its power.
- Savings + cost on substrate CONFIRM W228: E[n] −29/−32/−31/−32% (tax I6/I12, ladder I6/I12) vs W228's −34%; futility power cost −2pp at δ=.5σ, −4..−6pp at 1σ, ~0 at 2σ (futility never triggers: fut ≤.04); big effects stop at interim anyway (eff .80–.99 at 2σ both policies).
- Two self-caught artifacts (honest-ledger): (1) first run bootstrapped the bank's own gap (δ=0 carried the true +.3σ tax gap → "null" claims .06–.26) — mislabeled null, caught by inspection, recentered, old file kept as w212-grid-bankgap.json (de facto small-effect power reference); (2) clamp-to-[0,1] on recentered values compressed the ceiling pile asymmetrically (.107 vs .151 across identical seeds) — caught by 3-seed tiebreak, removed (exact mean-equality is load-bearing; boundary values are recentering artifacts, owned in code comment).

Verdict: USED with teeth (adoption stands scoped-directional + validity-breaker proven + two artifacts caught with receipts + savings confirmed on lumpy substrate). Scope-amends W228's "type-I holds" (holds directionally). No precursor, no open conflict.

## Tangential: test the null you'll actually deploy (0-spend, reasoning only)

W178's permutation null was exact and irrelevant: it tested "no arm difference including shape," but deployments always have shape differences (new widths, new doses, new seeds bring new margins). The decision-relevant null is "equal means, own shapes" — the bootstrap. Rule: every sequential-validity claim names its null's exchangeability assumption and re-tests under own-shape bootstrap before adoption; permutation is the receipt, bootstrap is the field. W229 applies the rule to the directional repair.

## Spend / queue

- Spend: 0 + 0 + 0 sims (64 bootstrap cells + controls; floor). Consumed backlog-W212 removed; spawned W229 to BACK. Backlog 17. Synthesis R38 clock: 5/5 FULL → synthesis R39 jumps queue next per rule 5.
- W229 (B, sandbox): directional-validity confirmation — claim-positive-only rule on the same banks (power + E[n] + futility interplay under directional claiming); symmetric futility stays (stops claim nothing); cheapest statement of the scoped adoption.
