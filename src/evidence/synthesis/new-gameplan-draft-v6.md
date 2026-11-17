# New gameplan — tutor/student transmission track (DRAFT v6 2026-11-17, UNCOUNTERSIGNED, binds nothing)

v1 → v2 patch batch (Round-1 adjudication, 3 comprehension + 3 red, 6/6 returned):
- ADOPTED: "no feedback" disambiguation (R1–R3 all misread it as "no learning"); recombination
  recipe; readouts definition; diagnosis thresholds; P3 generation = specified choice of two
  candidate builds; frozen sentence reworded (unanimous misread-risk, 3/3 flagged same sentence).
- ADOPTED as explicit check: R2 falsifier (student-on-recombined indistinguishable from
  student-on-noise ⇒ transmission dead).
- REJECTED as duplicates: R1/R3 hardest tests (random-init-twins baseline already in design —
  reviewer error, logged: reviewers can't run code / don't retain controls; controls list must be
  explicit in every premise).
- v2 → v3 patch batch (Round-2 adjudication, 4 flesh-out builders H/G/D/P, 4/4 returned):
  ADOPTED H harness shape (form JSON + run record + separate-process scoring enforcement: the
  scoring API cannot touch weights — this is the no-feedback enforcement mechanism; ledger row
  with SHA-256); ADOPTED G choice (a) frozen tutor-as-scorer input search as ordered first
  attempt, with answers (target = uniform over tutor-USED pseudo-classes, dead classes excluded;
  max 500 iters/line then build-fail on that class; blind = SAME weights, hidden-target
  procedure — a twin would test something else); ADOPTED D decision tree + worked example
  (reviewer arithmetic checked: 10 + 5 + 15 = 30 ✓; VOID-first ordering enforced); ADOPTED P
  checklist with corrections ("live arm" → unfrozen arm; blob filename TBD — file before P1 exit;
  rerun = script on existing env, no Docker in this stack). OPEN answers filed: permuted control
  = re-pair inputs to other lines' labels (breaks the content link); classes = 4 (D-Q3 was in-plan
  — logged miss); shorts/longs = D1a bands (1–3 pairs / 9-slot), vocab19 noise uses the same
  matched bands frozen in the run spec.
- v3 → v4 patch batch (Round-3 staff audit MATH/IMPL/ALT, 3/3 returned — not barren):
  MATH FAIL on round-trip 0.50 → PARTIAL (bar held; answered with a two-half gate: raw ≥0.50
  AND round-trip-above-permuted ≥0.20 — bias alone can't pass the second half; rest of MATH's
  numbers verified sound). IMPL: scoring enforcement = code-level (scorer gets labels/readouts
  only, never model refs; forensics asserts separation — no IPC in this stack); TOKEN-SHUFFLE
  same-band pools only; "clustering qualitative" REJECTED as stale (2× trigger already in v3 —
  reviewer missed the patch); generation budget + programmatic falsifier ADOPTED. ALT rival
  (marginal-frequency overfit) → PARTIAL: adopted as P2 control #5 (frequency-matched fresh
  lines must sit at permuted level).

## KEEP — carries over unchanged

1. **Process instruments (doubt-as-process, not doubt-in-heads).** Agent expectation + pre-mortem +
   nearest-failure per prereg, sunset reviews, version-bound approval, fresh-eyes batteries,
   forensics kernel + ledger + fingerprint. They govern the new track for free.
2. **Settled data (not re-litigated).** D1a sweep: 11 lost / 1 mid / 0 competent, FILL-FAIL;
   shorts transmit / longs wall; curriculum prescription (shorts-first). Run-02 atomic numbers.
   Meta-probe PILOT-FAIL: weights-as-data 0.4936, loudness-on-lines 0.8598. Spelled tutor blob
   (killA 0.96 / held 0.96) becomes P2's educated tutor.
3. **Built machinery (reuse, don't rebuild).**
   - Per-line dumps + confidence/entropy/energy readouts (1.d.iii/v) → ARE the tutor-degenerate
     check and the student-diagnosis slices.
   - Forensics + ledger + fingerprint + loader-agreement recipe → test-administration harness base.
   - Spelled-keys encoding (byte layout frozen, SEP=18) → P2 test-form construction recipe.
4. **Nursery comms constraints (3.b.0)** → govern P4 tutor-generated curriculum: tutor→student
   channel is native signals only, no English interlingua, translation-price reported, ratchet.

## SCRAP / PARK / DEMOTE

- **Old Phases 1–3 (paper track): PARKED.** v22 frozen stays the record. Zero new spend.
- **D1 as detour: SUBSUMED.** Product (spelled tutor blob) is P2's educated tutor; open question
  (competent regime) folds into P4.
- **D2 draft as written: SUPERSEDED** by P2/P3 (kept as reference). E-vs-N survives as a P2 arm.
  No-right/wrong survives in P2/P3; lifted in P4 by definition.
- **FROZEN/UNFROZEN (user order): both arms run IN PARALLEL. Convention: report the frozen arm
  first. No sequencing dependency exists in either direction. The old frozen-first gate is dead,
  not dormant.** (Reworded v2: the v1 "reporting order" sentence misled 3/3 reviewers into
  reading a dependency.)
- **Weights-exposed examination: DEMOTED BY EVIDENCE.** Meta-probe ix 0.4936 vs 0.8598. Tutor
  examines student outputs + readouts, never weights. Revisit only via slice-probe xi / basin-xii.

## LEARNING MECHANISM (filed v2 to kill the R1–R3 misread — all three reds claimed "no learning")

Distillation — imitation loss on tutor outputs — IS the student's learning mechanism and is
always allowed (weights update from mimicry). FORBIDDEN is any update or selection driven by
agreement scores or correctness. "No feedback" = no score-driven updates, never "no learning."
"Agreement" is a thermometer (read, ledgered), never a thermostat (nothing conditions on it).

## DOUBT / WEIGHTS (standing)

- Doubt CARRIES as process (expectation/pre-mortem/nearest-failure every prereg) and as
  instruments (suspicion/loudness/energy = the diagnostic layer). No new doubt heads until
  transmission works.
- Examination targets, in order: (1) student labels, (2) student confidence/entropy on failures,
  (3) cited-slot attention pointers. Never weights.

## READOUTS (defined v2 — C3 could not implement from "readouts")

Per line, tutor AND student file: top-1 confidence, margin (top1−top2), entropy, energy
(−logsumexp of logits), cited-slot pointer (argmax final-depth attention). "Examination" =
compare these five fields item-by-item; no weights, no feedback.

## P1 — Hardening + skills (holdover; acceptance checklist ADOPTED from builder P, corrected)

1. Cold-context load: named SKILL.md files load with 0 errors. 2. One-command rerun green on the
   existing env (page_refresh + eval harness; no Docker in this stack). 3. Push backlog landed
   (~20 src files over 2 sessions — the gate for all src writes). 4. Battery loop runnable
   end-to-end (fleet pattern in fresh-eyes SKILL.md). 5. Readouts verify on 100 sample lines
   (all 5 fields populated, no nulls). 6. Parallel arms check: frozen + unfrozen run side by
   side, identical report format, frozen reported first. 7. Noise gate: 1000 vocab19 lines
   through tutor, entropy ≥1.0. 8. Tutor blob integrity vs filed checksum (blob filename TBD —
   file before P1 exit). Exit = all 8 green.

## P2 — Experimenter-built tests (scores recorded, never fed back)

TERMINOLOGY (filed v5 — R6 red-team closer: 2/4 tripped on the word "feedback," so the word is
retired): the student learns by DEMONSTRATION ONLY (distillation on tutor outputs — gradients
from mimicry allowed). What never exists anywhere in P2/P3 is a CORRECTNESS signal: no labels,
no reward, no agreement-conditioned updates, no selection. "No feedback" was the slogan;
"no correctness-driven updates" is the rule. Tutor outputs are curriculum, not feedback about
the student — feedback would require observing whether the student is right, which is
impossible when nothing is right.

One-line law (user-ordered 2026-11-17): for the first steps there is no right answer — the only
question is whether pattern recognition passes from tutor to student. A student can only fail
to learn what the teacher demonstrably knew (high-confidence, high-entropy tutor labels);
everything else is VOID, never failure.

1. Tutor gets noise only (1000 lines, vocab19, matched lengths, frozen seeds); outputs = pattern.
   Gate: label entropy ≥1.0 bit else VOID. Arms: educated (spelled blob) vs never-educated
   random-init (architectural-prior floor). Controls (explicit — reviewers missed them in v1):
   chance 0.25, random-init twins, different-noise student, permuted-pairing = inputs re-paired
   to other lines' labels (breaks the content link; must sit at marginals-chance or agreement
   is bias).
2. Fresh student distills tutor outputs (imitation loss — allowed; see terminology above).
   Distillation control (adopted from T2): one extra student arm distills SHUFFLED tutor labels
   (permuted before training); it must sit at chance — if it still clears the bar, agreement is
   architectural bias, not learned content.
3. Live solves: tutor forward(x,4) over hundreds of lines, logged with all five readouts.
   (Latent depth intact — tokens changed encoding only; verified in code.)
4. Experimenter constructs novel lines by recombination (input-only, no training). Recipe (v2):
   pseudo-class = the tutor's OWN argmax label (never ground truth — none exists); ops:
   HALF-SPLICE (first half tokens from A + second half from B), THIRD-SPLICE (A/B/C thirds),
   TOKEN-SHUFFLE (position i drawn from a random same-LENGTH-BAND exemplar's position i —
   donor pools never cross length bands; a position with an empty pool is left unfilled and the
   child is discarded — preserves
   positional marginals); length-matched only (recombine within length band); discard any child
   identical to a seen line (novelty filter).
5. Tutor + students solve separately (fresh + recombined + control forms). Bar: input-driven
   agreement (observed − permuted) ≥0.20. Control #5 (adopted from ALT): frequency-matched
   fresh lines (same unigram frequencies as tutor noise, structure randomized) — agreement
   there must sit at permuted level, else the claim is marginal-overfit, not transmission.
   Falsifier (adopted from R2, made programmatic per IMPL): preregistered two-sample test of
   the student's output distribution on recombined lines vs on fresh noise, α=0.05;
   indistinguishable = transmission dead regardless of agreement numbers.
   On miss → diagnose by number: DEGENERATE = tutor top-1 <0.50 on the failed item, or run
   entropy <1.0 (VOID, not failure) → TRANSMISSION-LOSS = tutor top-1 ≥0.70 + student disagrees
   + errors cluster (one of the 4 pseudo-classes ≥2× its share, or longs miss while shorts
   hit — shorts = 1–3 pairs, longs = 9-slot form per D1a bands; vocab19 noise lines use the same
   matched length bands, frozen in the run spec) → re-teach
   via style knobs (order / selection / signal / pacing) → CAPACITY = still misses high-confidence
   shorts after targeted re-teach (wall is in the student).
- P3 generation budget (adopted from IMPL): accept the first candidate with target-class
  softmax ≥0.90 inside 500 iters; a pseudo-class build-fails after 5 dead seeds (new seeds,
  same tutor). Round-trip gate is two-half (adopted from MATH): raw blind re-label ≥0.50 AND
  round-trip-above-permuted ≥0.20 — tutor bias alone cannot pass the second half. Tripwire
  (adopted from T3): shuffle labels BEFORE a repeat blind re-label; if the tutor still scores
  ≥0.50 on shuffled labels, the round-trip was structural artifact and the build fails.
  (T3's "separate instance" demand REJECTED with reason: same weights + hidden-target procedure
  is the correct blinding — a different instance would test a different question.)
- Test-administration harness (ADOPTED from builder H): form generator in/out = JSON rows
  [item_id, input, pseudo_class, form_type ∈ {fresh, recombined, control}]; run record =
  [run_id, timestamp, form_id, subject, input_id, prediction, top1, margin, entropy, energy,
  cited_slot]; scoring in a separate process that cannot touch weights (the no-feedback
  enforcement); ledger row = [timestamp, run_id, subject, item_id, label, pred,
  agreement_delta, SHA-256(run_id+item_id+pred+timestamp)]. Reused P2–P4.

## P3 — Teacher-generated tests (generation = specified choice, build unordered until P2 greens)

1. Tutor finds pattern in noise (same gate as P2).
2. Tutor generates NEW pattern-bearing noise. Candidates (v2 — C1/C2/C3 hole closed to a choice):
   (a) frozen tutor-as-scorer input search (activation-max / Gibbs token mutations, zero new
   weights); (b) taught conditional head (same brain + next-token head, imitation-only objective).
   Build-success criterion: generated lines pass round-trip (blind re-label recovers intended
   pseudo-class ≥0.50 vs 0.25 chance) + novelty filter + entropy gate, else the build fails.
3. Repeat P2 with teacher-generated classes AND tests. Read the CROSSED contrast
   (E-lines×E/N-solvers vs N-lines×E/N-solvers); absolute agreement is partly circular.
- P3 exit criterion (proposed): graduate the carrier — template-document generator (txt/html/pdf)
  re-runs P3 on documents.

## P4 — Hard-label curriculum (right/wrong allowed by definition)

1. Tutor gets hard labels + the specified pattern. 2. Tutor generates curriculum AND test
   (ordering/selection/signal/pacing become tutor policy). 3. Repeat P2 with tutor-specified
   right/wrong steering teaching: same-tutor-knowledge × different emission policies →
   different student outcomes = teaching style, empirically. 4. THE FORMATIVE/SUMMATIVE SPLIT
   (user-ordered v6 — REPLACES the v5 hash-commit separation rule: no commit machinery, tutor
   owns MORE of the loop, measurement is cleaner). The tutor SOLELY generates every test inside
   the loop: test → teach → test → teach, all formative tests tutor-authored, tutor-scored,
   tutor-diagnosed. The EXPERIMENTER authors ONLY the final exam — summative, binding,
   experimenter-scored. Guardrails (format, never content): (a) PUBLIC BLUEPRINT — the tutor
   knows the exam spec (noise family, recombination recipe, length bands, bars, gates) but never
   the items; the final is drawn from the same blueprint the tutor was asked to teach, so failure
   reads as teaching failure, not distribution shift. (b) Formative forms must satisfy structural
   constraints (length bands, novelty-vs-seen filter, entropy gate) — format, never content
   selection. (c) Formative scores are tutor-internal and NON-BINDING (ledgered as
   tutor-reported); binding claims come from the final exam only. Self-policing: sycophantic
   formative tests (tutor flattering its own teaching) surface as final-exam failure attributed
   to the tutor — as examiner AND teacher. The fox may run the quizzes; the board runs the final.
   Delta tripwire (adopted from R8 W1/W2/W3 — all three independently proposed the same check):
   if formative agreement ≫ final-exam agreement (final at/below permuted + margin while
   formatives read high), the verdict is sycophantic examining, attributed to the tutor, and the
   teaching claim fails with it. Report the delta, not just the two numbers.

## Versioning

Binds nothing. Countersign as v23 (supersedes D2, amends frozen rule, parks paper track) only
after: push lands, P1 bar met, fresh-eyes loop hits stop rule (two barren rounds / steelman).
- LOOP CLOSED 2026-11-17 BY RED-TEAM (user order — steelman never closes; R5 3/3 HOLD kept
  as advisory data only). 6 rounds, 20 reviewers, 20/20 returned: R1 comprehension 3/3
  accurate + 3 reds adjudicated; R2 flesh-out H/G/D/P adopted; R3 audit → v4; R4 verify 3/3
  FIXED; R5 steelman 3/3 HOLD (advisory); R6 red-team closer 2×BREAK-class findings adopted
  (terminology retirement + P4 separation + distillation control + round-trip tripwire),
  duplicates logged (T2 blind-tutor = twins arm; T4 zero-overlap/frozen-student = already true;
  T1 leakage-probe as specified = muddled, commit-fix adopted instead). R7 barren-check on v5:
  3/3 HOLD, no kills, KEEP directives only → LOOP CLOSED BY BARREN RED (first barren round
  post-R6 findings; R6 was productive so no double-barren needed — the closer rule is "barren
  red," met).
- v6 (user-ordered, post-closure): formative/summative split REPLACES the v5 hash-commit rule
  (tutor solely authors the in-loop tests; experimenter authors only the binding final exam;
  public blueprint + format guardrails + non-binding formative scores; self-policing).
  R8 re-verify on v6: 3/3 HOLD + delta tripwire adopted (formative≫final ⇒ sycophantic examining,
  attributed to tutor) → LOOP RE-CLOSED BY BARREN RED. v6 is signable.
- CONVENTION (user-ordered 2026-11-17, SKILL.md amendment owed post-push): RED-TEAM CLOSES
  LOOPS — a loop ends on an unopposed red round that yields no adoptable finding (barren red),
  never on steelman. STEELMAN IS RESERVED FOR PLANNED CUTS: when a verdict says CUT/ABANDON X,
  steelman X first — its HOLD prices what the cut destroys; its BREAK clears the cut. Steelman
  as satisfaction-ritual is retired (a defender cannot find what attackers missed — R6 proved it:
  16 reviewers incl. 3/3 HOLD, then 4 unopposed reds found the terminology wound + P4 hole).
- PRICED RESIDUALS (run-owed, not doc patches): (1) VOID-gate sensitivity — first P2 run must
  report gate sensitivity/specificity on degenerate controls (dead-tutor vs learning-student
  separation); (2) falsifier power analysis — minimum detectable effect for the two-sample
  recombined-vs-fresh test, filed in the run prereg; (3) P3 diversity audit — full-distribution
  entropy on generated lines (anti-collapse into high-probability tokens).
END OF DRAFT v4
