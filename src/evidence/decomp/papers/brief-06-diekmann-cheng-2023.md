# Brief 06 — Diekmann & Cheng (2023), "A model of hippocampal replay driven by experience and environmental structure"

Source: `scratch/papers/diekmann-2023.txt` (bioRxiv 10.1101/2022.07.26.501588v2; eLife version exists). Computational model + grid-world RL simulations.

## Mechanism (SFMA: strength × similarity × inhibition-of-return)

- Priority rating R(e|e_t) from three variables: experience STRENGTH C(e) (frequency + reward modulation), SIMILARITY D(e|e_t) (spatial distance via DEFAULT REPRESENTATION — policy-independent discounted occupancy under random behavior; robust to barriers; efficiently updatable on environment change, unlike successor representation), INHIBITION-OF-RETURN I(e) (suppress just-reactivated, decay λ; forces sequence propagation).
- Next experience sampled stochastically via softmax over ratings; stop when all ratings < θ=1e-6. Two modes: DEFAULT (compare current-states → forward-ish sequences) and REVERSE (compare current-state to others' next-states → backward sequences). Awake replay init at current position; sleep init by strength.
- CENTRAL CLAIM vs Mattar-Daw: PMA requires computing HYPOTHETICAL updates per stored experience (biologically implausible — "synapses can't compute updates without altering the network"). SFMA approximates PMA's choices using only experience statistics + structure, no hypothetical updates. Reverse-mode sequences are "often the optimal ones according to Mattar and Daw."

## Results (numbers/patterns)

- Navigation (linear track, open field, maze): REVERSE mode >> no-replay and random-replay, CLOSE TO (slightly below) PMA. DEFAULT mode only slightly > random (looks bad) BUT matches familiar-environment recordings (forward-before-trial, reverse-after) and generates SHORTCUT replays (never-experienced paths, cf. Gupta 2010) which reverse mode cannot.
- Dynamic mode (switch reverse↔default on accumulated TD errors): performance ≈ reverse mode. Rule: novel/high-TD → reverse (acquire behavior fast; matches Foster-Wilson 2006, Ambrose 2016); familiar/low-TD → default (robustify; matches Diba-Buzsáki 2007; explains "pessimistic"/suboptimal human replay, Eldar 2020, as functional).
- Random-walk statistics reproduced: α ∈ [0.467,0.574] vs experimental [0.45,0.53] (Stella 2019); robust across DR discount + inhibition decay.
- Shortcut + remote + sleep biases all emerge from the same three variables + stochasticity.

## Author-stated limits

- Two further replay modes definable but not studied (choice explained in Discussion — scope).
- DR depends on default (random) policy; similarity metric choice matters; grid-world only.

## Bench mapping (our wall)

- The paper's CRITIQUE of PMA is our most important takeaway for the debate: even if gain×need is the right normative target (Brief 05), the MECHANISM must be computable from local statistics. For our bench this is good news — we CAN compute hypothetical updates cheaply (H48, frozen forwards), so the biological objection doesn't bind us; but for any claim about brain-likeness, SFMA-style local statistics are the honest mechanism.
- Directly implementable, fully local: STRENGTH = visit frequency × reward (miner-match?) per stream region; SIMILARITY = query-pattern distance (our DR analogue: co-occurrence under uniform sampling, policy-independent); INHIBITION-OF-RETURN = suppress just-trained-on rows (our training ALREADY lacks this — we sample i.i.d. per step, so immediate re-sampling is possible; an IoR tabu would be novel). REPLAY MODE SWITCH on TD-error mass: novel/shifted rows → reverse-style (correct-then-propagate); familiar → default (robustify).
- Pairs with Brief 05: PMA says WHAT to replay; SFMA says HOW with local stats. Our gain-probe (Brief 05) is the expensive normative version; SFMA variables are the cheap mechanistic approximation — run BOTH, expect SFMA ≈ gain-probe at fraction of cost. That comparison is itself a publishable-style result for the bench.
- Predicts our U31f dilution finding: with homogeneous exploration, replay statistics look random (Stella) — i.e., UNIFORM diets produce random-walk-equivalent replay = no selection. Selection requires HETEROGENEOUS strengths. Our fixed 50/25/25 mix may be too homogeneous to matter.

## Concrete test + falsifier

- Test: SFMA-replay — 10% replay budget; strength = region visit-count × miner-accuracy; similarity = query co-occurrence distance; IoR tabu = no row twice in 50 steps; dynamic mode switch on trailing TD-error mass. Bar: RET/COMPOSE gain at quorum vs no-replay, same budget.
- Falsifier: random-replay + IoR-only controls. If IoR alone matches full SFMA, the selection variables add nothing (file scoped). If random matches, replay dead on substrate (consistent with Brief 05 falsifier — converge, stop spending).
- Predicts: reverse-style (error-propagating) helps after diet shifts; default-style helps on familiar rows — split the bar by row novelty (pre-register the split).
