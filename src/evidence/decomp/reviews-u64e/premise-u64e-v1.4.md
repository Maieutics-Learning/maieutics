# Premise artifact U64e v1.4 (frozen 2026-11-27; countersign reads THIS)

v1.3 premise + focused re-close rulings (6 fresh scouts → 3 STANDS / 3 NEEDS-PATCH,
1 adopted as gloss; details in
`reviews-u64e/fresh-eyes-self-u64e-v4-reclose-results.md`; micro-confirm 3/3
STANDS in `reviews-u64e/barrage-v1.4-microconfirm-M1-M3.md`).

v1.4 change (D6, gloss only, NO behavior change): halt-levels one-liner — three
distinct stops at different levels: HALT = run abort (examHash mismatch / W0 gate
failure: pre-verdict, driver aborts the run); LINE-HALT = line-terminal verdict
(the shape line stops; revival needs owner order + fresh battery);
countersign-decline = program halt between generations (NO compute without
countersign IS the program halt — mechanical). Countersign-decline is the
program-level halt; HALT/LINE-HALT are run/line-level stops. Rejections: total-cap
race (no race — next-gen W0 asserts before compute, sequential); firewall-vs-D2
(stale — firewall governs the bars, diagnostics select the F-shape under NEITHER,
both stated); F-tree mapping (filed — bars, floor, then NEITHER invokes the tree).

v1.4 design (unchanged from v1.3 except D6 gloss): 4 arms (orReset 107; surBlind
108 min-condition trigger, passive monitoring, cap 6, refractory 20; orBlind 109
logged diagnostic; randBlind 110 stratified per-window, demotion-only) × 20 = 80
reads-only re-evals; E1-only (fresh disjoint streams, base 53500; E2 skipped —
ceiling, filed); bars +0.03 @quorum 15/20, joint bound ≤0.041 (credited-win ⊆
surBlind-clears); floor 0.40 + sensitivity + vestigial note; firewall verdict reads
ONLY {accRec, stackHash} + filed dice, diagnostics at verdict time only; verdicts
CLOSED-LOOP-WORKS / ORACLE-ONLY / TRIGGER-INSENSITIVE / NEITHER-WITH-DIAGNOSIS /
INCONCLUSIVE / PIN-FAIL / HALT / LINE-HALT; F-tree strict F3>F1>F2>F4>F5 + TOTAL
cap 6 (W0-asserted, driver-enforced); per-window margin pattern + hit-rate-gap
diagnostics; ledger verdict field machine-readable; termination per D5+D6.

Battery record: v1.0 barrage (10/10 NEEDS-PATCH, 6 adopted) → v1.1 → round-2
(10 fresh + 3 audit, 13/13 NEEDS-PATCH, 9 adopted) → v1.2 → red round (10 kills,
5 adopted) → v1.3 → focused re-close (3/3 STANDS-equivalent + 1 gloss) → v1.4 →
micro-confirm 3/3 STANDS → battery CLOSED. Compute UNLICENSED throughout.
Countersign requested on THIS version (v1.4) for Wave 0 → Wave 1 (80 reads-only
re-evals). NO PUSH.
