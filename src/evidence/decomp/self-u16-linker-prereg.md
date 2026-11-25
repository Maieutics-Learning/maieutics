# Self U16 delta-prereg: sparse relay linker over frozen pieces (PROPOSED; NO COMPUTE until battery)

Agent approval: this file. CPU/in-worker only. NO GPU. Pool = sealed reviewer labor only. R=3, quorum 2/3, COMPLETE-gated, twin-matched seed-only streams, paired evals. Corrections append-only. Push after verdict per user standing order (push after each model).

## Record-search (already-run / nearest prior / what differs)
- U1 UNFREEZE-HURTS: unfreeze-all → adaptY 0.99 FIX but STD 0.37-0.41 FAIL + VITAL inverted (shared trunk overwritten, conflicting grads alignCos negative).
- U14 S-TIGHT: EWC chains driftF 1e-7 vs 8e-3 (mechanism HOLDS, STD 2/3, GAP 3/3) yet adapt compose collapses 0.365/0.275/0.30 vs 0.99 while adaptV stays 0.8+ — compose needs the same base-critical weights. penRatio 0.02 parks λ-sweeps.
- U2 slow fails 0/3; U6 sequential repair trades 0.99→~0.25. Never change jointly while serving.
- U5 HEAD-WORKS-GATE-BLIND: frozen trunk + nonlinear open head = 0.715/0.73/0.595 HEAD 2/3, adaptV intact. Heads are the growth surface; trunk stays frozen.
- U7 THINK-WALL / U8 COMPARE-WRONG-SIGN / U10 COMPARISON-DECORATIVE / U11 STILL-SHUT / U12 STILL-SHUT (STE quantizes) / U13 SEALED-SHUT (head dominance, blend monotone in head weight): winner-pick routers route nothing; confidence/margins detect head-ness not correctness.
- M2 READS (mass 0.84, adaptV 0.8, ADAPT 2/3) but compose lags (Y 0.3 vs V 0.8); M3 CARRY-POISON: zero-carry pass2 unblocks Y 0.3→0.58 on the same frozen weights. Link the CLEANED pieces.
- Wei et al. 2024 (user storage list): memory = connected subgraph over scattered pieces; 2-hop closure cheap with enough relays (M>=20 analogue); capacity combinatorial in link patterns, not weights. Kozachkov 2025: second store (astrocyte Ca-flux) buys supralinear capacity without fighting over pairwise weights.
- What differs: NO trunk/head/notebook/critic training (all frozen). Train ONLY a small sparse relay linker (~1-2k params) that composes already-frozen pieces. New skill = new link pattern, old patterns untouched → no wound, no EWC needed. Router picks nothing; linker composes everything (avoids head-dominance trap). Zero-carry on adapt half (M3) built into the diet.

## Design
- Init: W6-s champion trunk + M2-nb-s notebook + U5-open-head weights (load from d-newai-w-w6, d-newai-self-m2-nb, d-newai-self-u5-nl-open ledgers), frozen. Fresh linker params only (codes 141/142).
- Pieces per episode (all frozen forwards): p_h = trunk h (48); p_read = M2 readLogits (4); p_hv = trunk hvLog (4); p_carry = pass1 cNew on standard half, ZEROS on adapt half (M3 fix).
- Linker (trainable, ~1.5k params): project pieces to D=16 (4 small matrices, linker-owned); R=16 relays; relay scores = softmax over 4 piece-compat per relay; messages = weighted sums; 2 hops relay→relay via 16×16 (trainable); top-2 relays soft-weighted (NO hard STE — U12 lesson; report sparsity, keep soft); output = 16→4 logits added to (hvLog + readLogits) ensemble with fixed 1.0 weight (no learned blend weight — U10-U11 beta lesson).
- Arms (2×3 = 6T+6E): u16-link (true pieces) vs u16-shuf (identical FLOPs/params, pieces permuted across batch positions — same capacity, destroyed linkage). Twin-matched streams, 800st/B16/lr5e-3 linker-only Adam, clip 1.0, 50/50 pick-best-of-C standard + adapt diet (U1 recipe).
- Evals: standard two + adaptY/adaptV + relay reports (active count, ablation: zero-relay forward on same episodes, old-subgraph intact = standard two held).

## Bars (quorum 2/3)
- U16-SEL: link adaptY − shuf adaptY ≥ +0.05 2/3 (links do work, not capacity).
- U16-STD: link two within ±0.05 of W6 2/3 (addition wounds nothing).
- U16-ABLATE: zero-relay adaptY drops ≥0.10 below link adaptY 3/3 (hops carry the gain — mechanism proof).
- U16-COMPOSE: link adaptY ≥ 0.50 2/3 (above floor; below U1 0.99 — honest, M3 ceiling ~0.58).
- Verdicts: LINK-WORKS (SEL+ABLATE hold, STD holds — growth by addition proven; graduate to spawn/prune + own-phase consolidation) / LINK-DECORATIVE (SEL fails, ablation flat — links add nothing; close linker lane) / LINK-WOUNDS (STD breaks — even additive links interfere; diagnose path) / VOID (shuf matches link — control invalid).

## Staging + budgets
- Battery on THIS file (3x sealed, goal line + self-learning framing in every prompt) → v1.1 pins-only.
- Then grad-check (linker-only graph: numeric vs analytic on projections + 16×16 + output; frozen pieces exact; vhat-stability skip filed) + 6T+6E. Ledgers d-newai-self-{u16-link,u16-shuf}-s{seed}-800st.json + evals d-newai-self-eval-{...}.json + verdict d-newai-self-u16-verdict.json. Transcript + CHATLOG + CURRENT_TASK. PUSH after verdict per user standing order.
- Memory-skill update (same wave, docs only): record what the linker teaches about memory-as-linkage in src/tools/memory/REFERENCE-linkage.md + 5-line SKILL pointer; no behavior change to the checklist.
