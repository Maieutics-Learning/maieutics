# Wave 190 note — backlog-W163 config-space coverage (sandbox, executed)

STOP RULE: stopped after oracle c-sweep + 3-seed online comparison (no extra arms run). 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (in-page sandbox; W169's script is gone so its v2 world was rebuilt from w169-note spec: partial shifts, price drift R 2->30). Clock: R29 1/5.

## Direct: does the adaptive follow a moving argmin in config?

World (rebuilt): 12 families/window, 3 shifted; shifted record disagrees w.p. S=.25, noise flips any vote w.p. ETA=.08; detector config (N records, tau) fires iff family disagreement fraction > tau; bill/window = misses*R + FAs*b + 12*N*c. Drift at t=1000 is PURE price drift (R 2->30, b .6->.15; physics q/S/ETA constant) to isolate price-tracking -> config response. Fixed = oracle pre-drift argmin forever ("tuned once"). Adaptive = audit every 100 windows (labels revealed, audit cost 2.0 priced) -> fit vote-level (q,s,e) cumulatively + LS prices (R,b) on last 4 audits -> argmin of W188-analytic predicted cost. Oracle-post = best of both regimes as benchmark.

Calibration (c-sweep, 600 windows/cell, CRN-paired across cells):
- c=.005: A=(16,.16) 2.383, B=(16,.02) 2.151. c=.01: A=(16,.16) 3.343, B=(16,.02) 3.111. c=.02: A=(4,.02) corner, B=(16,.02) — sampling too dear, space collapses. Chose c=.01.
- Precondition MET with nuance: argmin moves (tau .16 -> .02, decisive: B runner-up (12,.02)=3.939 far behind); N=16 in both (sampling price sets N, price drift moves TAU — axes factorize). B's tau sits at the grid floor (.02): genuine traversal, not a corner stay, but the space wants extending below .02 (noted, not run). Pre-drift top is FLAT (A: (16,.16)=3.343 vs (12,.12)=3.381, (8,.16)=3.378 — within 1%).
- "Continuous-k" limitation (honest): N grid is 9 discrete values x 7 tau; movement shown on grid, true continuous-k not implemented. Tau line-search deferred to W180.

Online (2000 windows, drift t=1000, 3 seeds):
- Drift-response VERIFIED on all seeds: every seed leaves its pre-drift config after drift and settles a post-drift config; lag 200-400 windows (= last-4 audit memory flushing pre-drift audits); R^ tracks 2->30, b^ .6->.15 (seed 11 textbook: 29.29/0.387 at t=1200, exact 30/.15 from t=1400).
- Bills: fixed mean 15723 (14946/16084/16139); adaptive mean 10678 (8654/9475/13905) — 1.47x cheaper on MEAN; oracle-post ~6550. Adaptive excess over oracle-post ≈ +2100/+2850/+7300 (incl. 40 audit fees). Report the RANGE, not the best seed: estimation risk dominates.
- Seed-33 transient (against interest, kept): at t=1300 LS on mixed audits solved b^=2.895 (FA price 19x over) -> config (24,.22) mid-drift, during R=30 regime -> miss carnage; recovered by t=1400. One ill-conditioned 4-audit solve cost ~4400. nLS 10-14/20 (singular skips when (m,f) repeat — the estimator silently idles, which is itself a behavior).
- MODEL MIS-SPEC found (the wave's gem): agent's s^ is measured on VOTES (= already-noisy .29) then XOR'd with e^ AGAIN in predCost (pS = s^(1-e^)+(1-s^)e^ = .33 vs true .29) — double-counted noise. Consequence: post-drift settles (12,.02) vs oracle (16,.02), ~0.8/window left on the table (miss prob (1-p)^N is exquisitely p-sensitive at tau=.02). W188's analytic is right math on a mis-identified parameter. Pre-drift the same bias is FREE (flat top absorbs it) — identification error costs exactly where the landscape is sharp. Where-the-error-matters, again (cf. W185's debt address).
- Seed-22 detail: pre-drift wanders (6,.02)->(12,.22)->(8,.16) on 1-3 audits (s^ .389->.306, noisy) then locks; post-drift t=1100 lucky instant lock (R^=30,b^=0 on one post audit) then 300-window wobble (16->12->12->16) on mixed memory, then locks (12,.02) by the bias.

Verdict: USED (interior moving argmin constructed + drift-response in config verified + two priced defects: noise double-count bias, LS transient fragility).

## Tangential: the forgetting rate IS the drift-response knob (0-spend, reasoning only)

Last-4 audits x 100-window cadence = 400-window memory. Longer memory = LS stability (no seed-33 transients) but slower drift response (lag); shorter = fast but fragile. The seed-33 transient and the 200-400 window lag are the SAME parameter seen from opposite ends — there is no "correct" memory, only a stability-agility frontier priced in miss-bills. This generalizes W155's confirm-2 (audit cadence) and W187's look-costs (estimation has a price): every adaptive carries a forgetting-rate, usually untuned and unpriced. The meter for it: post-drift excess bill vs oracle-post as a function of memory length — a one-parameter curve W180 can draw for free in this same world.

## Spend / queue

- Spend: 0 + 0 + 1 c-sweep (3x63x2x600 windows) + 3 online runs (floor). Consumed backlog-W163 removed; spawned W180 to BACK. Backlog 17. Synthesis R29 clock: 1/5.
- W180 (B, sandbox): corrected observation model (vote-level s,e used DIRECTLY as vote probs, no re-XOR; verify adaptive reaches oracle-post (16,.02) and ~0.8/window gap closes) + LS regularization arm (ridge / min-distinctness gate / longer memory; kill seed-33-type transients; draw the memory-length price curve from the tangential). Same world, same 3 seeds + 3 fresh.
