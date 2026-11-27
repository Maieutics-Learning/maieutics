# Paper-rep battery 2 results (barrage 10/10 on v1.1, 2026-11-27)

Premise: `premise-paper-rep-v1.1.md`. Verbatims: `barrage-v2-1-5.md`, `barrage-v2-6-10.md`.
Round score: 10/10 NEEDS-PATCH (1 refined adoption; repeats sharpened, not stale).

## Adjudication

- **ACCEPT (1, refined): in-text transmission-vs-representation decoupling.**
  Battery-1's §8 sentence did not satisfy: reviewers (R4/R9, sharpened) demand
  the decoupling IN the paper text — §5 P1 must say transmission-only, §8 must
  mark the endpoint as a goal gated on an unmet prerequisite. Per the loop rule
  (a complaint surviving its patch is a finding about the patch), v1.1's patch
  was insufficient (premise-only + one §8 sentence). Fix filed: patch v1.2
  (P1 transmission scope clause in §5; endpoint goal-not-result clarification
  in §8).
- **PARTIAL (killer-test proposals): logged as U60 task-spec inputs, no paper
  change.** Zero-hint transfer, cross-substrate transfer, non-oracle U64h,
  hinted→unhinted zero-shot with margin bar — all propose COMPUTE, and the
  cross-substrate transfer test is genuinely good input for the oracle/task-spec
  phase (filed as candidate gate). No paper text changes (proposals, not prose
  defects).
- **REJECT (TBD-resolution demands R2/R5/R9): scope creep.** killHu and
  interpreter carry filed mini-prereg gates before any paper claim; demanding
  their resolution inside a paper battery bypasses the measurement queue. TBD
  tags already freeze them as unrun. No change.
- **REJECT (repeats): relabel-verdicts, delete-§8, "simulation of learning".**
  Frozen verdicts; roadmap section properly labeled as map; pejorative relabels
  are reviewer taste, not findings. No change.

## Patch v1.2 (one pass)
1. `index.html` §5 P1: transmission-only scope clause (names U58 exclusion).
2. `index.html` §8 endpoint: goal-not-result clarification.
3. Premise v1.2: v1.2 changes + red-team ask (kill-shots). Battery 3 = red-team
   close per loop-closure convention: barren red ends the loop.
