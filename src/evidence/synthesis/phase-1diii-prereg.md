# Phase 1.d.iii dump-mode mini-prereg — v1.0 COUNTERSIGNED FROZEN (user countersign 2026-11-14)

Status: FROZEN on user countersign 2026-11-14. Runs authorized, recipe locked.
Parents: 1.b replication machinery (bit-exact retrain recipe + gate),
cross-engine note (same-engine bit-exact, cross-engine verdict-stable), W38
(per-position causality is follow-up, not here), gap spec L0/L1 (this is the
executable-now half).

## Why (the gap this fills)

`evalSuite` discards everything but argmax accuracy. But every run already
computes two things we never save: (a) confidence — the full 4-class logits
exist behind every argmax, so top-1/margin/entropy are latent in all filed
verdicts; (b) a cited slot — the final depth-step attention distribution
`att.w` has an argmax over positions, and `attnSupervision` defines the
ground-truth target index for every line. The pointer-defense claim
("argmax attention as cited slot") and the overconfidence question ("what
number do we print for confidence on errors?") are currently asserted, not
measured. This prereg measures them, with kill rules for the defense claim.

## Targets (retrain-then-dump, replication-gated)

Same 8 Stage-1 winners as 1.b (311/314/315/316 staged; 312/317 constant;
313/318 instdrop): load filed T0 tutor blob, retrain with the EXACT 1.b
recipe (ARM index staged:0, constant:2, instdrop:3; seed*100+30+a), gate on
filed `armsDetail` ev bit-exact. Gate fails → HALT, no dumps, report.
Rationale: forward is deterministic given weights, but weights were never
filed — the 1.b replication (8/8 bit-exact) is the proven path back to them.
Same engine only (cross-engine drifts scores; verdicts stand but dumps must
be bit-comparable).

## Dump exams

The exact verdict-carrying exams: filed `buildExams(7008)` killA + killHd
(target-first, fresh-seed lineage 7008 — the exams behind 1.a/1.b verdicts),
same `r = EVAL_R` as filed evals. No new exams, no new seeds: this step
re-reads decided evidence at higher resolution.

## Dump schema (per subject × exam × line, instrumented forward)

- `y`, `logits[4]` → `top1` (argmax class), `margin` (top1 − top2 prob),
  `entropy`, `correct`.
- `valuePos`: supervision-target index by `attnSupervision` logic
  (qk = x[len−2], first key match → token index +1).
- Final depth-step attention `att.w` (steps[len−1], isDepth) →
  `ptr` = argmax over positions, `ptrHit` = (ptr == valuePos),
  `wTarget` = w[valuePos], `attnEntropy`.
- Forward determinism self-check: dump twice, bit-compare; mismatch → HALT
  (would contradict the 1.b determinism finding — report as finding, not bug).

Driver: `phase-1diii-driver.js` (in-worker, resume-safe via
scratch/p1diii-partial.json, mirrors 1.b driver structure). Ledger →
`phase-1diii-results.json` (schema above + analyses below, no prose).

## Analyses + preregistered decision rules

A. Pointer validity (KILL RULE for the defense claim): `ptrHit | correct` on
   killA. ≥ 0.90 → pointer admissible as cited-slot defense in 1.e.
   0.70–0.90 → weak: usable only with per-line confidence intervals, flagged.
   < 0.70 → decorative: the defense claim is ABANDONED in 1.e (reported as
   dead, not softened). killHd reported alongside (expect lower; gap is data).
B. Calibration (ignition signature): Δ = mean(top1|correct) −
   mean(top1|incorrect), pooled killA+killHd. Δ ≥ 0.20 → separated (ignition
   has a confidence signature; feeds L0/L1 + gap-spec calibration muscle).
   Else unseparated (confidence is not the signature — say so). Igniters vs
   s313 reported descriptively only (n=1 fail — no gate off a single case).
C. Overconfidence disclosure (NO gate — mandatory reporting): mean top-1 on
   ERRORS per subject + pooled, killA and killHd separately, plus % of
   errors with top-1 ≥ 0.9. This is the honest number the paper prints;
   whatever it is, it travels (same asterisk discipline as 1.a/1.b).
D. Attn-on-target (descriptive): mean `wTarget` correct vs incorrect lines.
   Feeds F-new per-position causal follow-up (W38 operationalization owns any
   causal claim — nothing causal is claimed here).

## Failure / stop rules

Replication gate fails → halt + report (weights not recovered; dumps would
be off-ledger). Forward bit-compare fails → halt + report as finding.
Pointer rule fails → defense claim dead (verdict 1.d.iv records it; 1.e
omits the defense, keeps the disclosure). No mechanism verdict is drawn
here by design — dumps are readouts; lesions are F-new territory.

## Budget + outputs

Trivial: 8 subjects × 400 lines × h48 forward ≈ seconds–minutes in-worker.
Outputs: driver + results JSON + verdict folded into 1.d.iv + 1.e
overconfidence/pointer paragraphs. Nothing here spends review capital: it
re-reads evidence we already paid for.

## Non-claims

No causal claim (attention correlation ≠ mechanism). Pointer validity ≠
explanation (a faithful citation is not a reason). Calibration separation ≠
ignition proof (a signature, not a verdict). All three failure modes get
reported, not massaged — the asterisks travel.
