# Fresh-eyes battery: self U2 anchored-unfreeze (3x sealed, parallel via root.generateText)

Goal line carried in every prompt.

## R1 — NEEDS-PATCH (verbatim, truncated to 1800 chars in scratch raw)
1. KL-anchor weighting: λ=1.0 aggressive vs slow trunk 5e-4 — risks overpowering, converging to teacher, ANCHORED-BUT-BLIND. 2. Gradient path leakage: live_hv pre-gate anchor + detached H/dis gate grads = disjoint surface; anchor pulls trunk while task grads severed at gate. 3. Counterpart mismatch: anchor on raw trunk lets gate zero out anchor influence without preserving representation; should anchor gated output. 4. Baseline insufficiency: SEL +0.10 within noise for 800st/B16; need scaled bar or decaying λ.

## R2 — NEEDS-PATCH (verbatim, truncated to 1800 chars in scratch raw)
1. Gradient leakage/coupling: KL pulls trunk; fast gate may mimic teacher rather than learn (masks unfreeze failure). 2. BPTT/clip instability: full h-BPTT + E grads with global clip 1.0 too aggressive for two-speed; fast opt hits ceiling, notebook stutters, contaminates VITAL. 3. Anchor contamination: vhatT vs live vhat unspecified — if live vhat used for both, anchor is moving target, violates fixed scope. 4. GAP vague: no quantitative delta, PROTECTED-HOLDS subjective across seeds.

## R3 — NEEDS-PATCH (verbatim, truncated to 1800 chars in scratch raw)
1. Falsifiability gap: FIX bar +0.10 vs expectation +0.3 under-powered; +0.15 passes bar but fails hypothesis — expectation must be hard floor or FAIL. 2. Detached-gate collapse risk: λ=1.0 aggressive vs slow trunk, no mechanism against latent collapse to delta. 3. Verdict ambiguity: ANCHORED-BUT-BLIND listed but bars→verdicts mapping not a hard logic gate. 4. Capacity mismatch: fully unfrozen fast notebook diverges from frozen teacher; missing Collapse bar (anchor prevents ever beating flat).

## Adjudication: 3 NEEDS-PATCH → v1.1 PINS-ONLY (no train/eval changes; analysis + fixed-label + mapping clarifications)
- ADOPT (pin): teacher vhatT fixed from teacher forward; live vhat fixed from live forward. KL = KL(live_hv||teacher_hv) + KL(live_mean(live-vhat)||teacher_mean(teacher-vhatT)). Both labels fixed per sample. Anchor is static reference (closes R2.3 leak). Filed in driver as `vhatT0`/`vhat0` constants.
- ADOPT (pin): live counterpart IS pre-gate trunk readout `fw1.hvLog` (not blend) by design — anchor leashes the trunk where forgetting lives; gate cannot zero it out because gate acts downstream on `ensV`. Blend-output anchoring rejected (would punish legitimate outside-use). Closes R1.2/R1.3.
- ADOPT (pin): λ=1.0 STANDS as filed (comparability + PROTECTION-KILLS-GAIN already covers over-anchor as its own verdict). λ-decay parked as U3 follow-up, not v1.1. Expectation +0.3 stays a prediction; bar FIX +0.10 STANDS (same big bar as M2/R3/U1 — comparability beats re-scaling; R1.4/R3.1 rejected as bar change).
- ADOPT (pin): global clip 1.0 STANDS (U1 comparability); per-module stutter is a watch item logged via loss curves + gate variance, not a spec change (R2.2 rejected as change).
- ADOPT (pin): bars→verdicts hard mapping (closes R3.3): PROTECTED-HOLDS = SEL∧FIX∧STD∧VITAL(2/3+ on each framing... defined as adapt>std 3/3 AND wrong>right 3/3; quorum overall 2/3 per bar); ANCHORED-BUT-BLIND = SEL∧STD∧¬VITAL; ANCHOR-FAILED = ¬STD; PROTECTION-KILLS-GAIN = STD∧¬(SEL∨FIX). GAP reference points filed: U1 1.0, M3-zero 0.63-0.80, frozen 0.35-0.52; protection should keep ≥0.8 (descriptive, closes R2.4).
- REJECT as change: collapse bar (covered by PROTECTION-KILLS-GAIN), output-blend anchor, λ-decay, bar re-scaling — parked as U3 follow-ups.
- Raw truncated replies in scratch/fresh-eyes-self-u2-3x.json (1800-char slices; filed honestly as truncated).
