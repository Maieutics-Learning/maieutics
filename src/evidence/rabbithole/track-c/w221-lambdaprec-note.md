# Wave 221 note — backlog-W189 lambda-star precision + triple-point mapping (sandbox, executed)

STOP RULE: stopped after 21-cell CRN rerun (3 regimes x 7 policies x 2000 trials, common uniform tapes) + paired λ* table (pre-reg scorecard closed below). 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (vendored w172 rig reworked to tape indexing). Clock: R34 2/5.

## Direct: CRN firms the map, dissolves the triple point, kills the narrow-K25 tie

Method: one tape per trial (driftAt + 200 uniforms), shared across ALL policies and regimes (reward = u[t] < q_current — exact CRN by inversion; blind periods skip tape[t] by index, preserving semantics). Receipt: pre-drift behavior bit-identical across regimes per policy (abl fix0405 .597, K2 1.238, K15 2.580, K25 .569, K3 .212 — same digits all three regimes). Paired mean-diff se .0005–.0010 vs unpaired .0011–.0014 on the same n=2000 (~2x shrinkage from CRN alone, on top of √4 from n).

λ* = (mean_f − mean_a)/(Lbar_f − Lbar_a), fixed = fix0405 (wide .7545/4.76, mid .7480/13.96, narrow .7442/25.48), delta-method se on paired diffs:
- narrow: K25: dM −.0011±.0006, dL −3.83±.61 → λ*≈−.0003 (never for λ≥0; lag leg 6σ, mean leg 1.8σ — TIE REJECTED). K2: −.0054/6.07 → .0009±.0002. K15: −.0237/13.41 → .0018±.0001. K3: never (miss .173, dominated both legs).
- mid: K25 NEVER (dM −.0019±.0006 AND dL −2.72±.41 — fixed dominates outright, both legs significant). K2: −.0072/3.4→2.1 → .0034±.0007 (ONLY K2 clears in mid). K3: never (miss .041). K15: −.0274/4.95 → .0055±.0005.
- wide: K25: dM +.0001±.0006, dL −.98±.29 → λ*≈+.0001 (upper bound ≈ 0 — never for any positive λ; was .007 on a noise denominator). K2: never (abl 1.24; λ* −.017 denominator ~noise). K3: dM +.0033±.0005 (6σ!), dL −1.81±.28 → clears iff λ < .0018±.0004 (UPPER bound stands, decimal shrinks from .0055). K15: never (dominated: −.0336/−1.16).
- Triple point DISSOLVED → single kink: λ<.0018 → K3, else fixed. The (.0055,.007) gap belonged to noise denominators. K25 never clears in ANY regime (mid dominated, wide/narrow upper bounds ≤ ~0) — the minimax-k is dead everywhere, stronger than W200's "mid-inferior".

Pre-reg scorecard: (a) se→~.0005 ✓ (receipt above); (b) mid-K2 clears / mid-K25 never ✓✓; (c) triple point mapped precisely — REFINED against-interest (kink, not triple); (d) narrow-K25 tie — REJECTED (never, legs 6σ/1.8σ).

Verdict: USED with teeth (map firmed + two against-interest refinements + K25-never-everywhere). No precursor, no conflict.

## Tangential: publish the never-graph, not just the decimals (0-spend, reasoning only)

Dominance (never-cells) needs no standard errors — it survives whatever the next precision wave does to the decimals, as this wave just demonstrated twice (triple→kink, tie→never). Every λ*/price map should therefore ship two products: the decimal table (perishable, CRN-firmed) and the never-graph (who-dominates-whom, se-free). Readers making build decisions want the graph; readers making budget decisions want the table. W206 draws the full graph.

## Spend / queue

- Spend: 0 + 0 + 1 CRN grid (21 cells x 2000 trials + paired λ* table; floor). Consumed backlog-W189 removed; spawned W206 to BACK. Backlog 17. Synthesis R34 clock: 2/5.
- W206 (C, sandbox): k-ladder completion + never-graph — reuse W189 CRN tape design; full pairwise λ*/never map incl K15 all-regimes + fixed-vs-fixed legs (fix0410's wide mean lead .7551 vs .7545 at worse Lbar); publish the never-graph as the se-free product.
