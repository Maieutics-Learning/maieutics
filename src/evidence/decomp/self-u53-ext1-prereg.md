# U53-EXT1 prereg v1.0 — context-gated veto vs global suppression (Anderson & Floresco 2022, brief-20)

**Track:** U53-EXT1 (experiment E-EXT1 from U52 synthesis). **Pre-countersigned full pipeline** (user 2026-11-26: "draft, use fresh eyes, I'll pre-countersign") — covers prereg + 10x battery + driver + Waves 0–2 with 10x fresh review per wave. NO PUSH without separate explicit order.
**Question:** does the inhibition-vs-extinction distinction cash out in this substrate — i.e. does a context-gated veto over an intact association beat global suppression, with the association verifiably unerased?
**Base machinery:** U38 stategate driver (gate + per-head machinery), U36-D1 diet/recipe lineage, U41 step discipline (corrected double-/B). No stack surgery — stack hash must remain 258d2f06.

## Design

**Diet (new, small):** two-rule two-context diet. Rule R1 (fixed mapping, same slot structure as u34/u36 evals) is VALID in context A, INVALID in context B. Context = one observable cue slot appended to inputs (values {A,B}, balanced 50/50 within every block so context is never a base-rate cue). Phase 1 (association): R1-in-A only, all arms identical, trained to criterion (train acc >= 0.98 on R1-A probe or 400 steps max, filed). Checkpoint: full snapshot frozen (weights hash filed = R1-CHECKPOINT). Phase 2 (suppression, B-heavy 80/20 B/A mix, 400 steps): arms diverge (below). Phase 3 (tests, frozen): CTX-A probe (R1 in A), CTX-B probe (R1 in B), RET-A probe (full R1-A eval set vs checkpoint outputs).

**Arms (4, aligned RNG):**
- NO-VETO (anchor): Phase-2 = continue Phase-1 recipe (always apply R1). Predicts CTX-A pass, CTX-B fail. Measures what "no control" costs.
- GLOBAL (U38 design verbatim): single learned suppression scalar, NO context input (one gate value for both contexts). Predicts partial B suppression at the cost of A.
- VETO (challenger): suppression computed FROM the context cue slot; R1 association weights FROZEN at R1-CHECKPOINT (byte-identical reload, hash verified); ONLY the veto mapping is plastic in Phase 2. Predicts CTX-A pass + CTX-B pass + retention held.
- UNFROZEN (teeth control, P2f pin): identical context-gate input, but R1 association stays PLASTIC in Phase 2. Predicted: behavior-pass + retention-FAIL — isolates the veto's value to retention (answers the strawman-GLOBAL charge: the comparison that matters is VETO vs UNFROZEN, not VETO vs GLOBAL).

**Attribution decomposition (v2-killer guard):** retention breach is decomposed via filed veto(A) value: if veto(A) > 0.05 at test, the breach is veto-misfire (control error), not erasure; only veto(A) <= 0.05 AND retention breach counts as erasure. Both numbers filed per seed.

## Bars (all quorum 2/3 unless noted)

- EXT-CTX (challenger bar): VETO reaches CTX-A >= 0.95 AND CTX-B >= 0.95 (joint; GLOBAL cannot pass by construction — single suppression level cannot be simultaneously <=0.05 in A and >=0.95 in B; filed as construction proof, not a result).
- EXT-NOERASE (P1c pin, quantitative): |VETO RET-A − CHECKPOINT RET-A| <= 0.02, with veto(A) <= 0.05 (else misfire, not erasure — counted as bar FAIL but labeled correctly).
- EXT-ISOLATE: UNFROZEN passes CTX joint bars (proves context input suffices for behavior) AND fails NOERASE (proves freezing is what preserves the association). If UNFROZEN holds retention, the veto adds nothing over ordinary context-gating.
- EXT-FLOOR: all arms' CTX-A (NO-VETO) / applicable evals >= 0.45 floor (guards degenerate collapse).
- EXT-PIN: stack hash 258d2f06 in every ledger; R1-CHECKPOINT hash identical across arms 3/3; HALT on mismatch.

## Waves

- Wave 0: driver load-check + twins (all arms Phase-1-identical trajectory match 3/3 to step 1 + veto determinism: same context → same veto value 9/9 incl. A/B).
- Wave 1: Phase-1 trains (4 arms × 3 seeds = 12T to criterion) + checkpoint + Phase-2 trains (12T). COMPLETE-gated.
- Wave 2: Phase-3 evals (12E: CTX-A + CTX-B + RET-A per train) + verdict.

## Verdicts

- VETO-ADVANCE: EXT-CTX 3/3... (quorum 2/3) + NOERASE holds + ISOLATE holds (UNFROZEN fails retention). Licenses: context-sensitive control line reopens (E-ACh1 mode scheduling under drift; veto-gated replay selection for E-SLEEP1); P5 unblocked.
- VETO-DEAD: VETO fails CTX joint on quorum, or NOERASE breached with veto(A) <= 0.05 (true erasure despite freezing — veto insufficient), or VETO ~= GLOBAL (context input adds nothing). P5 line stays closed; fall back to detector track only.
- VETO-MISFIRE (diagnostic verdict, not advance): retention breach WITH veto(A) > 0.05 — veto misfires in A; mechanism unproven, veto mapping needs redesign (re-prereg, no tune).
- UNFROZEN-HOLDS (diagnostic): UNFROZEN keeps retention — freezing unnecessary; ordinary context-gating suffices; VETO's frozen machinery is redundant complexity (cut it).

## Falsifiers (decisive by construction)

P5's core claim dies if: (a) VETO passes behavior but breaches NOERASE with clean veto(A) (associations can't be preserved under suppression pressure here); or (b) UNFROZEN holds retention (freezing buys nothing); or (c) GLOBAL passes joint bars (construction proof wrong — halt and audit the diet balance).

## v1.1 pins (battery 10x: 7 IMPLEMENTABLE + 3 NEEDS-PATCH → discussion 10x CONFIRM; doc-only, no bar changes)
- M1 measurement specs: veto(A) = mean veto-gate activation over RET-A probe inputs; cut 0.05 = half the 0.10 minimum behavior gap (CTX bars at 0.95 ⇒ max legitimate veto(A) with full marks is 0.05; sensitivity: cuts 0.03/0.10 reported alongside, verdict uses 0.05).
- M2 eval metrology: items-per-probe N filed per probe in Wave 0 (target N>=200 sampled items per probe per seed); epsilon in EXT-NOERASE is ABSOLUTE on rate (<=0.02 rate points); chance-rate math per probe filed in Wave 0 (computed from eval construction: k-alternative forced choice ⇒ chance = 1/k, stated per probe).
- M3 identity: SHA-1 git-blob convention for stack hash + R1-CHECKPOINT hashes (same as all U-ledgers); checkpoint verified byte-identical across arms before Phase 2 (HALT on mismatch).
- M4 probe integrity: RET-A/CTX-A/CTX-B probe inputs drawn from the SAME block generator as training inputs (same code path, different RNG stream); no probe flag exists anywhere in the substrate — probe-leak is structurally impossible, stated not assumed.
- M5 verdict cause field: verdict JSON carries cause ∈ {clean, veto-misfire, architecture-separability (context cue not linearly separable by veto layer — u10), erasure-pressure-null (UNFROZEN holds retention — table verdict UNFROZEN-HOLDS)}.
- Semantics (u8 partial): EXT-NOERASE with frozen weights tests veto-accuracy + checkpoint-stability; that conjunction IS the preservation claim — bar kept, description corrected here.
- Misfire metering (u7/u9 partial): VETO-MISFIRE forces veto-mapping redesign + re-prereg; a SECOND misfire on any redesign closes the P5 line (no third attempt).

## v1.2 amendment A1 (filed 2026-11-26, BEFORE any Phase-2 compute; requires battery + countersign)
- D1 (criterion): R1-A probe >=0.98 never bound on any seed (criterionAt=-1 all 12 Phase-1 ledgers); 400-step cap operative everywhere. Phase-1 association installed identically across arms (ckpts identical per seed) — design intent preserved, criterion aspirational.
- D2 (competence): checkpoint RET-A accuracy s0 0.275 / s1 0.340 / s2 0.305 — the 400-step Phase-1 installs a WEAK association (~0.3, near chance 0.25), far below the v1.0/v1.1 absolute CTX-A bar of >=0.95 (substrate round-2 ceiling ~0.55-0.6 even at 800 steps; 0.95 was miscalibrated to the wrong task scale). Running Phase-2 under absolute bars would force a misleading VETO-DEAD (mechanism could succeed while bars fail).
- A1 (bars, relative-to-checkpoint; construction proof and NOERASE untouched):
  * EXT-CTX becomes: VETO CTX-A >= ckpt-0.03 AND CTX-B >= 0.95 (joint). Rationale: the claim is preserve-and-suppress, not absolute competence; CTX-B stays absolute (veto forces class 0 regardless of trunk level).
  * EXT-ISOLATE behavior-pass becomes: UNFROZEN CTX-A >= its-ckpt-0.03 AND CTX-B >= 0.95; retention-fail clause unchanged. UNFROZEN-HOLDS classification updated identically.
  * GLOBAL proof unchanged (single scalar still cannot do A-normal + B-zero at ANY competence level); NO-VETO expectations unchanged; NOERASE already relative.
- Falsifiers sharpened (not weakened): VETO-DEAD now fires only on genuine mechanism failure (cannot suppress in B, or retention breach with clean vetoA); a functional veto at low competence reads VETO-ADVANCE with the competence level filed alongside.

## v1.2 ratification (battery 10/10 ACCEPT-AMENDMENT + discussion 10/10 CONFIRM; doc + verdict-code only, no new bars)
- Delta-0.03 DERIVED (answers 6-reviewer arbitrariness chorus): N=200 probe, p~0.3, binomial SE = sqrt(0.3*0.7/200) ~= 0.032. Bar = "no statistically distinguishable degradation at probe resolution" — a measurement property, not a chosen constant.
- LOW-COMPETENCE-SEED diagnostic flag: seed with ckpt<0.28 (chance 0.25 + ~1 SE) is flagged LOWCOMP in verdict (filed, no quorum change; s0 0.275 will flag — stated in advance, not hidden). Guards the A2/A9 degenerate-checkpoint worry without post-hoc exclusion.
- A5 masking answered (same-seed pre/post comparison IS degradation measurement; nothing to mask behind).
- Verdict code updated to A1-relative bars + LOWCOMP-FLAG line + cause field (M5). No Phase-2 ledgers exist; Wave-0 + Phase-1 ledgers untouched by verdict-code change.
- STATUS: HALTED before Phase-2. Pre-countersign covered the v1.0/v1.1 design; bars changed under A1 → FRESH COUNTERSIGN REQUIRED for amended Phase-2 + evals + verdict.
