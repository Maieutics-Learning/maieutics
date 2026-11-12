# Wave 194 note — backlog-W167 loose-gate treatment test (sandbox, executed)

STOP RULE: stopped after 4-gate x 5-arm x 6-seed grid with per-arm decomposition (no hybrid arm — spawned, not built). 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (in-page sandbox; W151 mechanics reused verbatim + t=0.2 arm added). Clock: R29 5/5 FULL.

## Direct: the gate sets the stakes budget; false-costs dominate it

Grid: gates t {0.65 selective, 0.5 mid, 0.35 greedy, 0.2 very-greedy} x arms {retrieval, cf.55, abstain k={0,.2}, routed} x seeds 7-12, 400 cases. Per-arm decomposition: net = tru (harmed+ungated) + fal (gated non-harmed) + kp. Predictions (pre-registered): stakes grow as gate loosens; false-part explains >=80% of greedy stakes; k* shifts up vs W174's .2; routed ~= retrieval at greedy. ALL FOUR CONFIRMED.

1. STAKES SCALE WITH fp: per-seed max-min net (k=0 arms): selective ±.005 (replicates W174's tie; fp=0) -> mid ~.09-.11 (fp 50-69) -> greedy ~.22-.28 (fp 141-154) -> very-greedy ~.34-.42 (fp 230-255; retrieval/cf nets go NEGATIVE, abs0 stays +.2).
2. FALSE-COST DOMINANCE QUANTIFIED: truePart spread across arms ~.008 (±.015 noise) at EVERY gate; false column explains >=95% of stakes at t<=.5 (e.g. seed7 mid: tru spread .0075 vs stakes .096; greedy: .0075 vs .221). Per-false overwrite cost measured: -.57 to -.68 (== v=1 rate .62 x -1, as the arithmetic demands).
3. MATCHING BOUNDARY HOLDS ACROSS GATES: routed ~= retrieval at every gate (seed7 greedy .101 vs .096; very-greedy -.184 vs -.189); best-uniform (abs0) dominates routed everywhere. Routing cannot dodge gate-decided false-costs — the gate moves first, treatment second.
4. BREAK-EVEN MAP EXTENDED (new): k* rises with looseness — selective ~.2 (W174) -> mid ~.44 -> greedy ~.52 -> very-greedy ~.56, matching k* = overwrite-rate x fp/(fp+tp) (abs2 k=.2 still beats retrieval by ~.13-.19 at greedy). Abstain's value IS fp-dodging; price it per gated case.
5. LEVEL vs STAKES SEPARATION: loose gates destroy ABSOLUTE value for all arms (abs0 .52 -> .44 -> .34 -> .21) via opportunity drag (good cases gated into 0s: -.62 x 255/400 ~= -.40, vs +16.5/400 from rescued harmed). Treatments differ ONLY in false-handling. W174's tangential confirmed quantitatively: threshold moves cost .18+ while selective-gate treatment switches gain <=.02 — argue thresholds first (ordering, not magnitude: the gate sets the budget treatments compete within).

Verdict: USED (stakes-budget + dominance % + per-false price + k* formula + level/stakes split). No precursor, no conflict.

## Tangential: the gate is upstream of the treatment in every design (0-spend, reasoning only)

Selective gate destroys treatment stakes; greedy gate creates them; no treatment choice conditions the gate. This is a general design-ordering claim: wherever a filter precedes an action (gate->treatment, meter->intervention, triage->therapy), the filter's threshold owns the stakes budget and the action choice is a within-budget optimization. Debugging a "treatment doesn't matter" result should start at the filter (is it too selective to leave stakes?), and a "treatment matters enormously" result should be checked for filter-looseness (are we comparing false-handling, not efficacy?). W174's tie and this wave's spread are the SAME phenomenon viewed from opposite gate settings.

## Spend / queue

- Spend: 0 + 0 + 1 grid (4x5x6, floor). Consumed backlog-W167 removed; spawned W184 to BACK. Backlog 17. Synthesis R29 clock: 5/5 FULL.
- W184 (C/A, sandbox): selective-abstain hybrid — treat gated-harmed + abstain gated-fp using suspicion score as fp-meter; price meter error with W168's ROC; does hybrid beat abs0; re-derive k* with meter imperfection; gates x kappa grid.
