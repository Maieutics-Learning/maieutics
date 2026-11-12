# F1 — ledger-grep precursor check (machine-readable): DONE, no precursor

## Method
claims_ledger.csv (1987 rows) from the survey repo (raw.githubusercontent, 953KB) grepped for
transmission-family patterns: teacher / student / transmission / curriculum / fad* / distill* /
generation / taught / pedagog* / scaffold* → 90 rows with ≥1 pattern.

## Result
- "transmission": exactly 1 row — Mem-DeepSC, data-transmission (semantic comms), irrelevant.
- "fad*": 0 rows. "scaffold*": 0. "pedagog*": 0. "taught": 0.
- "teacher/student": distillation-teachers (knowledge distillation), teacher-forcing, MeanFlow teacher,
  Ouro→LT2 conversion — no teaching-across-generations.
- "curriculum": Coconut multi-stage (already USED, W12), Yahoo multi-hop data requirement, Implicit-SSM
  fixed-point curriculum, CGAR (see lead).
- "generation": text generation / data generation — no generational teaching.

## Verdict
No precursor for staged hint fading in the survey's machine-readable corpus. Confirms the W2 hand-read
("compares architectures, not generational teaching") with independent evidence. F1 CLOSED.

## New lead (does not block F1 closure): CGAR (2511.08653)
"Curriculum Guided Adaptive Recursion" — depth curriculum + DECAYING SUPERVISION WEIGHTS speeds TRM
training 1.71x (−0.63 acc); depth-curriculum-alone best in ablation (2.26x); halts with 11% fewer steps.
Decaying supervision weights ≈ our attnAuxW fade — closest single-model analog yet. FETCH NEXT (W15 direct).
Tagged: same-family (decaying supervision), different goal (training speed, not teaching new capability).
