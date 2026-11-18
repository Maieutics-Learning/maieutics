# Fresh-eyes v4 round-1 (2026-11-18) — 3x barrage, UNCOUNTERSIGNED draft

Premise frozen: src/evidence/p3/specs/p3-twins-v08-curriculum-v4-draft.md (48 lines) + v3-consolidated verdict (TH 2.72-2.77 PASS, CLAIM1 2/3, CLAIM2 3/3, dialect 0/12).

## Raw replies (verbatim, truncated 2000ch each in tool result)
R1 MECHANISM: PROVISIONAL PASS. Flaw: representational collapse (shared trunk mouth+ear interference, entropy gradient washes 19-way). Falsifier: dialect gap (v3 0/12, shared trunk can't separate dialect variance from high-entropy noise).
R2 MEASUREMENT: VACUOUS. TH<2.944 is failure-to-reject-null, dialect 0/12 proves blindness. Falsifier: calibration gap — swap ear targets with random shuffle same distribution; if student still converges, signal = drift. No calibrated ear bar.
R3 PROVENANCE: PROVISIONAL PASS pending countersign. Provenance clean (raw-only + separate trunks). Flaw: ear high-bandwidth covert channel. Falsifier: blind-tutor (random mouth) + real ear-distill; if student ear still converges, smuggling/shortcut.

## Adjudication (owner rules)
- R1 collapse risk: ACCEPT. v4 leaves mouth/ear loss weighting + trunk grad rule unspecified. Patch: explicit weighting + forgetting probe.
- R1 dialect falsifier: ACCEPT as descriptive. v3 dialect 0/12 filed; v4 needs ear-specific bar, not dialect-only.
- R2 VACUOUS verdict: PARTIAL. TH<chance + CLAIM deltas (S1 2.94-2.99 vs v2 3.97-4.48, deltas 0.58) are real vs noise, but ear has no calibrated bar — agreed gap.
- R2 shuffle-ear control: ACCEPT. Add as null control with demotion rule.
- R3 provenance PASS: ACCEPT. Blind-tutor ear control: ACCEPT with demotion rule (null-wins => PASS demotes to scoped).
- Seed overlap / joint-trunk regression: ACCEPT to gate (ear rng seeds disjoint, bundle-only imports, nUniq==100, finite checks).

## Patch list → v4.1
1. Entropy buckets: fixed thresholds in nats filed (e.g. quartiles of init entropy) per-pos, computed from tutor's own forwards only.
2. Trunk rule: mouth loss + lambda*ear loss, lambda filed (start 0.3), separate Adam states OR grad-scale x0.5 + tutor stability probe (own pattern re-measured post-ear, degradation>margin=HALT).
3. Ear bar: U2-style modal agreement tutor-ear vs student-ear on shared pool >=0.80 + loss delta, alongside mouth CLAIMs.
4. Nulls with teeth: (a) shuffled-ear, (b) blind-tutor ear; either at/above bar => claim demotes to scoped/bias, not pass.
5. Provenance gate: student loads bundle-only, pool/thermometer never imported, seeds disjoint, integrity gate (nUniq==100, recount, finite).
