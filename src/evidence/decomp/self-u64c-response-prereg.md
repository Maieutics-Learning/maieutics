# U64c-RESPONSE (E-NE0d) prereg v1.3 — wire an oracle trigger to a response, old exam
**Changelog v1.2→v1.3 (round-3: 4 NEEDS-PATCH + 0 audit PATCH / 6+1 clean; 3 filed additions;
math-auditor arithmetic corrected (0.78 exact, auditor's 0.93 used wrong signs); details in
`reviews-u64c/fresh-eyes-self-u64c-v3-results.md`):** verdict-name split (WORKS / ADAPT-ONLY /
EDGE-ONLY / DEAD — bars unchanged); K-sufficiency by revealed effect (diagnostic adjudicates,
pre-committed); explore-drag-on-adapt sentence (bar conservative for detT).
**Changelog v1.2 (round-2: 7 NEEDS-PATCH + 1 audit NEEDS-PATCH / 3+2 clean; 6 filed
additions + 2 principled rejections (det-reset≡orT exists; random-trigger arm out-of-scope
for U64c); details in `reviews-u64c/fresh-eyes-self-u64c-v2-plus-audit-results.md`):**
K-coverage corrected; ENDPOINT-RATIONALE; DIAG-EXPLORE v2; dead-seed pre-analysis;
exploreSlots; exploreRng; drag locus.
**Changelog v1.0→v1.1 (round-1: 2 PATCH + 1 SOUND / 7 clean; details in round-1 doc):**
K coupon-derivation (superseded by v1.2 K-coverage); DIAG-EXPLORE v1 (superseded by v2);
FP-drift sentence.

**Track:** U64c (user-ordered 2026-11-27: three independent tracks; this one changes ONLY the
response — one new oracle-triggered arm under the OLD U64 exam; no track gates on another's
verdict; 20 seeds; log everything).
**Cover:** drafted 2026-11-27 under that order; battery now (pool labor); COMPUTE (20 new
trains + 20 evals) UNLICENSED pending fresh countersign on this exact version. NO PUSH.
**Lesson encoded:** U60–U64 built alarms with no hands (Yu & Dayan gap-1: signal driving
nothing). This track wires the MINIMAL consumer — reset + explore on trigger — with a PERFECT
trigger, isolating the response question from the sensor question: if even a perfect alarm
wired to a response captures nothing under the old exam, the response half is dead regardless
of what any learned detector later says.

## Design (one new arm; everything else U64-verbatim)
- New arm detT (armCode 106): det policy (pick-max s*n, no reset) + at each of the 3 TRUE
  boundaries (filed per-seed rule, read never redrawn): reset qkCount + UNIFORM explore
  K=10 slots then exploit. K-COVERAGE (corrected v1.2 — draws observed ≠ picks made):
  explore PICKS uniform over 4 qk; P(all 4 picked ≥once in 10 picks) = 4!·S(10,4)/4^10 ≈ 0.78
  (diet-independent; diet-mix governs which pairs are SHOWN, not picked). Rationale is
  dilution-not-saturation: lock-in breaks via uniform-pick dilution of stale counts
  (2.5 picks/qk expected); full sweep sufficient but NOT necessary — K=10 kept with honest
  0.78 coverage (Hypothesis). Explore picks come from a DEDICATED stream exploreRng =
  `G.makeRng(53400+seed)` (diet sampling policy-independent; twin-deterministic).
  Oracle trigger = perfect alarm
  (upper bound on any learned trigger — Hypothesis: detT.adapt ≈ orT.adapt or better).
- Worlds identical: ruleRng `G.makeRng(64000+seed)` verbatim (same 20 rules); diet U64-verbatim
  with dataRng `G.makeRng(42000+seed*104729+55+106)`; config 800st H48/B16/lr5e-3/K5/C6/
  auxW0.5/lam2.0, u43 ops verbatim; 20 seeds s0..19.
- DIAG-EXPLORE v2 (diagnostic, no quorum, verdict-time only): orT−det margins (reset
  effect, filed−filed, no new compute — the reset-only baseline) + detT−orT margins
  (explore effect; OUTCOME only — orT.adapt saturates ≈1.0, ceiling noted, adapt margin
  uninformative here) + detT−det margins (joint; adapt-half informative — det not at
  ceiling). No new det-reset arm: det-reset ≡ orT (reset + immediate exploit — EXISTS,
  filed). Filed interpretation: positive detT−orT outcome = explore adds over reset; ~0 =
  reset does all the work (U66 constraint — response needs no explore phase); detT ≈ det =
  trigger+explore jointly void (a) or offsetting (b, reset-helps-explore-hurts — reported
  as AMBIGUOUS-MECH note, verdict stands). K-SUFFICIENCY BY REVEALED EFFECT (filed,
  pre-committed): the diagnostic adjudicates K — detT−orT outcome > 0 ⇒ explore contributed
  (coverage adequate whatever its value); detT−orT ≈ 0 with detT−det > 0 ⇒ reset sufficed
  and K's value is moot. Data judges K, not derivation.
- Exam OLD verbatim: U50 streams 52500/52400+seed, masks 91000+seed, N=200 stationary
  (same exam → same floor 0.45 → apples-to-apples vs U64 verdict).
- Ledger per seed: U64 train keys verbatim {arm:detT, seed, steps, B, lr, K, H, C, auxW, lam,
  diet, select, verdict, stackHash, u64DriverHash, wallMs, curve, divCos, adaptRate,
  adaptEarly, adaptEarlyN, rule, P0, P} + eval {two, scr, orc} + exploreSlots (3×10 slot
  lists, derived from filed rule+K). Full vector (log everything).
- PIN literal on all 40 ledgers; rule-ID vs filed U64 rules 20/20 (world-identical check).
- FP-DRIFT (filed): twins run same-driver (W0 gate); cross-run FP drift (~1e-7) is 5 orders
  below the +0.03 edge margin and 6 below the +0.10 adapt margin — cannot flip any bar.

## Bars (quorum 15/20; same shapes as U64 for direct comparison)
- RESP-EDGE: detT.two ≥ dice.two+0.03 @quorum (dice.two = FILED U64 eval ledgers, reads-only
  reuse — no recompute, no new dice trains).
- RESP-ADAPT: detT.adapt ≥ dice.adapt+0.10 @quorum (dice.adapt = filed U64 adaptEarly).
  DEAD-SEED PRE-ANALYSIS (filed, no bar change): s0/s2/s9/s12/s18 unpassable even at
  detT.adapt=1.0 (filed dice adaptEarly 0.9733/0.96/0.9533/0.9267/0.96); quorum needs 15/15
  of the rest — zero margin by construction. Shape inherited from U64 deliberately; a
  margin-count fail reads as designed-stringency, not surprise.
- ENDPOINT-RATIONALE (filed): ADAPT is the PRIMARY endpoint for a response claim (response
  acts in time; the old stationary exam measures final memory). EDGE secondary/
  confirmatory. RESPONSE-ADAPT-ONLY (ADAPT @ quorum, EDGE dead) = "response buys
  recovery speed, not final memory" — honestly labeled, not a full win (v1.3 name-split).
- Explore-drag locus (filed, corrected v1.3): explore cost is TRAINING-time (30 slots =
  3.75% of updates); two is frozen-eval — drag flows through final params only,
  second-order, bounded ≪ +0.03. ADAPT-window drag is FIRST-order and filed honestly:
  explore slots score ~0.5 in-window (uniform picks, 2-hot of 4) → ~0.08 adapt drag per
  50-slot window → the +0.10 bar is CONSERVATIVE for detT (must clear despite self-imposed
  cost); a pass is stronger evidence for the response.
- FLOOR: max(detT.two, filed others) two <0.45 on ≥6/20 → INCONCLUSIVE (same exam, same floor).
- Firewall: verdict reads ONLY {two (detT new + dice filed), adapt (detT new + dice filed),
  stackHash}; everything else logged, consulted at verdict time only.

## Waves (COMPLETE-gated)
- W0: PIN + 3-seed twin determinism (p0=0 step1=0, exact) + rule-ID vs filed (3/3) + dry-run
  timing. n=3 thin — gate only.
- W1: 20 detT trains (new). W2: 20 detT evals (old exam) + verdict
  `d-newai-self-u64c-verdict.json`.

## Verdicts (split v1.3 — bars unchanged, finer labels so partials never read as full wins)
- RESPONSE-WORKS (BOTH bars @quorum → response captures recovery speed AND outcome value;
  licenses nothing by itself) / RESPONSE-ADAPT-ONLY (ADAPT @quorum, EDGE dead → response
  buys recovery speed, not final memory) / RESPONSE-EDGE-ONLY (EDGE @quorum, ADAPT dead —
  unexpected shape; file MECHANISM-SURPRISE note) / RESPONSE-DEAD (neither, floor holds →
  wiring buys nothing here) / INCONCLUSIVE (floor trips) / PIN-FAIL.
## Filed expectations (Hypothesis, not bars)
- RESP-ADAPT passes at quorum (triggered reset + explore ≈ orT timing with exploration;
  orT adapt ran 0.94–1.0).
- RESP-EDGE uncertain: under the stationary final-memory exam the response's in-window gains
  may wash out exactly as orF's did. A pass here would be stronger evidence than U64's adapt
  pass; a fail localizes the problem to the exam (U64b's question), not the response.
## Falsifiers
- K≠10, explore-policy change, exam change, threshold moves post-data → new version + battery
  + countersign.
