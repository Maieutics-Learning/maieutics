# U70-F9 prereg PROPOSAL v1.2 (NOT licensed — needs delta re-close + fresh countersign)

Track: U70-CTX de-lottery #4 (birth volume). Base: F4 EXACT (forcing Wc←z-onehot train+eval, ctxw 3.0, floor 0.05, repw 0.1, GRU64/Cat4-ST, BPTT-50 carry-over, clip 1.0, 200 epochs, Adam FLAT 3e-4 — no warmup, no tilt).

## Diagnosis
F5: same streams, different births → 10/20 split (birth, not path). F7: same births + calm road → same graves (not the road). F8: same births + shared orientation → zero un-flips (not orientation). Remaining birth property: VOLUME — uniform draws ±sqrt(1/fan) produce births where a few loud encoder voices may scream one category from trial one and lock flips before lessons arrive (below-chance = locked, not blurry).

## Change (ONE global scalar, TWO arms; everything else F4 EXACT)
- Init scale multiplies all `u70nParam` uniform draws; biases stay zero. Same seeds → same draws, rescaled magnitude only.
- **F9a quieter ×0.5** + **F9b louder ×2.0**. N=20 seeds each (same 20 seeds/draws/streams both arms; 40 rows total). Direction answered empirically, not assumed (F1 two-arm precedent, owner-arbitrated).
- v1.0's "informative either way" is WITHDRAWN for the quiet side: a pooled collapse at ×0.5 proves nothing about the curse (starvation confound, battery 10/10). Replaced by the narrowed ignition gate below.

## Ignition gate (per arm, NARROWED — gates un-flip claims only)
- The gate bars only claims that scale FIXES births: an un-flip reads only if pooled gap ≥0.05 holds in that arm (hands obey → net demonstrably learns).
- Voided arms still file FULL descriptives (catastrophe counts, gap continuum, usage/KL/grad-norms) — no binary information loss.
- A voided arm whose catastrophe births persist or worsen files **PERSISTS-with-mechanism (scale-hypersensitive)**, not silence: volume acting destructively IS evidence.
- Both arms void → **PERSISTS (scale-hypersensitive)** with mechanism, not NO-TEST (v1.1's NO-TEST withdrawn — total scale-sensitivity is a finding).

## Design
- Retrain on SAME 20 seeds both arms (same seed → same draws → same streams, LOCKED; scale multiplies draws only — paired vs filed F4; ONLY the scale differs per arm). Exclusions/stopping/firewall verbatim. No selection.
- Sharpest read (DESCRIPTIVE): F4's 4 catastrophe births (seeds 2,6,7,8) on identical draws — un-flip under either rescaling?
- Driver change (post-battery, pre-countersign): `U70N_INITSCALE` (default 1.0; F9a = 0.5, F9b = 2.0) multiplying init draws. Smoke 1 seed per arm (locked: filed, bugs-only, no tweaks).

## Outcomes (bars UNCHANGED, per arm)
- Primary per arm: detached probe ≥0.70 (pooled) AND gap ≥0.05. Paired arm−F4 dProbe/dGap/dCtx + CI.
- Verdicts per arm locked: FIXED / PARTIAL / PERSISTS. The gate bars only un-flip claims, never verdicts. Near-misses do not move bars. No Phase-2 in this wave.

## Reading matrix (locked, v1.2 — governs the final read)
- Both arms valid + same 4 graves → pattern persists across ±scale range; ensemble indicated (NOT proof of draw-pattern — persistence across a range only).
- Both arms valid + DIFFERENT graves → scale moves births but pattern not localized; ensemble indicated with mechanism note.
- Quieter un-flips / louder keeps → volume-with-direction (quieter). Louder un-flips / quieter keeps → volume-with-direction (louder).
- Collision: both arms un-flip the same seeds → volume-sensitive (magnitude irrelevant, scale moves it).
- Single void, other arm valid: live arm reads normally; dead arm files full descriptives + catastrophe count. Dead arm with catastrophes persisting/worsening → PERSISTS-with-mechanism (scale-hypersensitive) for that direction, not silence. Dead arm with FEWER catastrophes but no un-flips → that direction is off the table, no conclusion from it.
- Both void → PERSISTS (scale-hypersensitive) with mechanism. v1.1's NO-TEST is withdrawn — total scale-sensitivity is a finding.
- Dial work (ensemble F10 + GRU-128 ruling-out) continues behind this wave regardless — owner order.

## Reporting
Per-seed ledger per arm + paired diffs + CI + catastrophe/flip/usage tables, configs + hashes, per-arm verdicts + matrix read. Ensemble queued behind this (F10) if volume fails; GRU-128 capacity ruling-out queued with it.
