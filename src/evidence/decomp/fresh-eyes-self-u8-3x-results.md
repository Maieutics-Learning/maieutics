# Fresh-eyes battery: self U8 comparative gate (3x sealed)

Goal line carried in every prompt.

## R1 — IMPLEMENTABLE (2 notes)
1. Agree-binary trap: gate may over-rely on a. Adopt: normalize m to logit scale + report corr(m,g) when a=0. 2. Ablate ambiguity (H/beta/dis still active). Adopt R3 structural fix instead of second arm. 3. Margin ≥0.05: report wrong>right segmented by margin size.

## R2 — IMPLEMENTABLE (3 notes)
1. Cross-ablation (same as R1.2 → R3 structural). 2. Saturation: report raw gate logit, flag |logit|>5. 3. Twin-match same head both arms (already spec — pinned).

## R3 — NEEDS-PATCH (structural)
1. Ablate must be STRUCTURAL (RP6 U7-size: no wm/wa at all), not value-zeroed RP8. ADOPT. 2. U8-VITAL tied to cmp-vs-ablate delta. ADOPT as report (bars keep absolute ≥0.05 + delta logged). 3. Alignment check headTop==baseTop rate. ADOPT as descriptive.

## Adjudication: 2 IMPLEMENTABLE + 1 NEEDS-PATCH → v1.1 PINS
- ADOPT: u8-ablate = structural RP6 (U7 feature set H/beta/dis only, no wm/wa params) — any cmp gain is information, not capacity (R3.1; supersedes value-zeroing).
- ADOPT: report corr(m,g)|a=0 + margin-segmented wrong>right + raw logit saturation flag + head-base agreement rate (R1.1/R1.3/R2.2/R3.3, eval-only).
- REJECT (park U9): signal-only arm (m/a alone), extra steps/decay.
