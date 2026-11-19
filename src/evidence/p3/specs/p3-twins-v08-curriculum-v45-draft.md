# Twins v0.8 CURRICULUM v4.5.1 (2026-11-19) — COUNTERSIGNED ("fix and signed!"), run authorized

Inherits v4.4 (single trunk/brain, adaptive quartile buckets, 200-step student + replay, bundle-only, IF/THEN bars, W).
ONE change: tutor ear trains JOINTLY (trunk + ear head) with a mouth anchor, not head-only.
(Spec change = new version.)

## Problem (Observed, v4.4 verdict 3/3)
Quartile ruler works (marginal 0.25, bands balanced, determinism 3/3 match).
Mouth: CLAIM1 3/3 (2.626–2.709), CLAIM2 3/3 (2.820–2.842 <2.944 + delta), retention +0.08–0.12.
Ear: real 0.441–0.544 (+0.19–0.29 over marginal); shuffled 0.329–0.395; gap HELD 2/3 (p0 0.095 BROKEN by 0.005).
Absolute 0.80 unreachable for a linear head on a frozen trunk (deg 0.0000 all pairs — trunk never moved).
Question: does the channel need trunk plasticity?

## Change: joint trunk+ear tutor training (mouth-anchored)
- Init: same mouth as v4.4 (seeds RNG 9840–42; easy pool 9770 500 train / hard pool 9810 500 train; TE/TH retrain determinism check vs filed v4.2 TE 2.6287 / TH 2.7579 — ABORT pair on mismatch, same as v4.4).
- Quartile cuts: same procedure as v4.4 — run pre-ear mouth over its own 200 ear-train lines (gen seed 9870+pair), collect per-position entropies, take q25/q50/q75 as `bucketCuts` (filed). Bands frozen before joint training. Ruler identical to v4.4.
- Joint training (replaces head-only `trainTutorEar`): trunk (E,Wq,Wk,Wv,Wa,Lz,L1,L2) + ear Lout train 800 steps, lr 5e-3, batch 8, seed 9905+pair (same seed as v4.4 ear for comparability).
  Loss per position: earCE(bucket) + 0.5*mouthCE(next-token ground truth). Mouth Lout head FROZEN (no update); trunk grad scale x0.5 (same as student trunk rule). One Adam over trunk+ear-head.
  Rationale: trunk may reshape to represent uncertainty; mouth anchor + frozen head + x0.5 bound drift. No pool/thermometer labels (targets = tutor's own buckets + ground-truth next tokens on tutor-written lines only).
- Stability gate v4.5.1 (countersigned fix 2026-11-19; v4.5 absolute gate was impossible — pre-ear hard 2.7579 already HALT, same as v42-p0/v44-p0 precedent which filed HALT yet continued): relative only. IF degradation >0.30 vs pre-ear on either THEN HALT (joint ate mouth). Absolute TE/TH filed diagnostically, never halts. Continue to bundles/student/nulls regardless — CLAIM bars + W adjudicate mouth damage.
- Bundles: NEW v45-bundle files (same lines as v4.4 — reuse v4.2 lines seeds 9871/9872+pair, nUniq==100 recount — recompute BOTH tLogits (trunk moved) and tEar with joint tutor; filed as CHOICE for comparability).
- Student: unchanged combined recipe (S1 200 steps seed 9903+pair alpha 0.5; S2 replay 200 steps seed 9914+pair 50/50 c1/c2; same inits 9850+pair; lambdaEar 0.2, trunk x0.5). Mouth untouched procedurally.
- Nulls rerun at v4.5 (same form as v4.3/v4.4, 200-step): (a) shuffled-ear (expect mouth PASS + ear FAIL; demote IF ear>=0.80 OR gap<0.10 → EAR-BAR void); (b) blind-tutor (expect all FAIL; demote IF blind meets any CLAIM → claim void); (c) synthetic (expect mouth ~S0 FAIL + ear ~0.25; demote IF synthetic meets CLAIM → bar vacuous).

## Bars (unchanged + one comparative)
- TE <2.744 PASS else HALT; TH <2.744 PASS else HALT. CLAIM1: S1-easy <2.944 AND <=S0-easy-0.20. CLAIM2: S2-hard <2.944 AND <=S1-hard-0.20. EAR-BAR: shared-200 pool (seed 9771) tutor-ear vs student-ear modal agreement >=0.80 (95% Wilson per-pair) AND delta>=0.20 AND gap (real-shuffled) >=0.10. Dialect descriptive (gap>=0.15). Quorum >=2/3 pairs per claim. W: gates PASS + both claims FAIL on >=2 pairs → close mouth line.
- COMPARATIVE (pre-registered, decides PARTIAL): joint helps IF pair-matched real-ear minus v4.4 real-ear >=0.15 on >=2/3 pairs with gap HELD. Absolute 0.80 still required for full PASS. Outcome table: PASS (≥0.80, gap held) = channel needs trunk; PARTIAL (comparative met, absolute missed) = weak-not-zero confirmed stronger, ear stays auxiliary; FAIL (neither) = joint adds nothing, ear project closes.

## What do I want to find out
Does trunk plasticity unlock the ear channel? PASS/PARTIAL/FAIL per above. Mouth gates + claims + nulls must hold for any ear verdict to stand.

## Agent expectation (numeric, scored in verdict)
Mouth gates 3/3 PASS; CLAIM1 3/3, CLAIM2 3/3 (mouth softs shift but anchor holds). Ear real 0.60±0.10 (up from 0.44–0.54), 0/3 reach 0.80, gap HELD 3/3, comparative +0.15 met 2/3 → PARTIAL. Pre-ear/post-ear mouth drift <0.15 (anchor holds, HALT unused).

## Pre-mortem (strongest objection + most likely failure, scored post-hoc)
Objection: joint trunk lets the tutor smuggle position IDs into ear agreement (tutor and student share arch, not weights — but trunk plasticity could sharpen trivial position-entropy correlation that shuffled-ear fails to kill because shuffle preserves lengths). Killer: shuffled-ear FIRES (gap<0.10) while real rises — then the gain is positional, not uncertainty, and the verdict is FAIL even if real hits 0.65.
Most likely failure: mouth anchor too strong (0.5 + x0.5) → trunk effectively frozen → real ≈ v4.4 (±0.05), comparative missed, 800 steps wasted to prove head-only was already the ceiling.

## Nearest-failure citation
v4.3 fixed-bucket degeneracy (ruler vacuous, marginal 0.79): not repeated — quartile cuts + filed marginal 0.25 + gap rule discriminate by construction. v4.4 p0 near-miss (gap 0.095 BROKEN by 0.005): not repeated as a verdict — quorum 2/3 + Wilson per-pair, no single-pair claim. x-ablation single-draw null trip (false-trip 0.67): not repeated — shuffled/blind/synthetic all rerun per-pair at v4.5, no line-level bootstrap.

## Provenance / seeds (unchanged)
Bundle-only: student loader imports ONLY v45-bundle files. Pools (9770/9771/9810) + thermometers (N-9101, d1a) never imported in student training. RNG ranges: tutor 9840–42, student 9850–52, blind 9860–62, ear-head 9940+pair / student-ear 9950+pair, bundles 9871/9872+pair, ear-train lines 9870+pair, mouth-train 9901/9902, ear-train 9905, student 9903/9914, blind-gen 9889+pair, stages 9881/9882+pair. nUniq==100 else ABORT. All losses finite else ABORT.

## Approval
COUNTERSIGNED v4.5.1 2026-11-19 (user "fix and signed!").
