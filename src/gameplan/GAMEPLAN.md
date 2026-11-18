# Gameplan v23 (2026-11-17, COUNTERSIGNED FROZEN) — the standing plan
<!-- provenance (2026-11-18 reorganization, user-ordered): Conventions + Version-v23 section through Scoreboard extracted byte-verbatim from src/GAMEPLAN.md (pre-move snapshot src/gameplan-snapshots/2026-11-18-pre-gameplan-folder.md). Nothing reworded; only this header added. Superseded texts (v22, D1/D2 detours, v04, scratch drafts) live in archive/. Session history in src/CHATLOG.md.
HOW TO FOLLOW: read top to bottom; Conventions bind every run; P1→P6 in order (P3 is where live compute happens; v0.8 twins spec needs a countersign before compute). No compute on uncountersigned text (version-bound approval). Snapshot before any rewrite. -->
## Conventions
- Statistics: 95% Wilson intervals everywhere; thresholds are preregistered, not tuned.
- Statistics (r5 — equivalence, not overlap): no "X within CI of Y" eyeballing. Arm contrasts use Fisher exact (difference) + 95% Wilson CI for the DIFFERENCE in rates with preregistered margin δ (default δ=0.25 absolute; tightened in the prereg where the null is near-deterministic). Zones: EQUIVALENT if the difference-CI lies inside [-δ,δ]; SUPERIOR if it excludes 0 in the predicted direction; else INCONCLUSIVE (never "no effect"). Thresholds (≥4/8, 5/8) test against MEASURED nulls by exact binomial, not a 0.5 coin: 4/8 excludes null rates ≤0.10 (p≈0.005; hint-free wall is 0/32); 5/8 excludes null rates ≤0.25 (p≈0.027). At n=8 only 8/8 could exclude 0.5, so rate-vs-coin is the wrong test — the design contrasts extremes (ignition vs wall), where 8/8 vs ≤4/8 differs at p<0.05 Fisher exact. Pilots never count: confirmation = fresh seeds + frozen protocol.
- Budgets: Phase 1 <2 h wall, 2.b.0 <1 h wall (round-2 caps against bloat).
- Doubt instruments (standing, all phases — metacognition that lives in process, not heads): every prereg carries three required sections — agent expectation (numeric, filed pre-run, scored in the verdict: the author's track record), pre-mortem (strongest objection + most likely failure reason, scored post-hoc), nearest-failure citation (which past mistake this design could repeat and why it doesn't). Architecture/process changes (new heads, losses, channels, gates, template changes) allowed only as mini-preregs with comparative bars against the best dial-fiddle (new dial beats best fiddle by preregistered margin or it's sprawl — refused); sunset review at each phase exit (gates/checks firing clean 3× running get downgraded/retired; ABANDONED verdicts for methods, same as TBDs). Declarations (gap spec + nursery-bound) carry "what would prove this wrong" (one line, pre-hoc, scored at verification).
- Selection pressure (standing, replaces drive — learned 2026-11-14 from geometry/Track C): scarcity + selector with teeth, not hunger. Fixed wave-budget per round (allocate, don't spawn unbounded — bids required); branch bids carry falsifiable promise + kill condition; teeth-streak escalator (N straight teeth rounds auto-forces a sunset proposal — proposing a whole kill is licensed science here, never disobedience); world selector (fitness = novel-family transfer on rival-generated tasks, never own exams); breed the allocator (score branch-value predictors on calibration, not waves).
- Version-bound approval (borrow 2026-11-16, countersigned): an approval (countersign, gate pass, design freeze) binds to the exact evidence/plan version reviewed (version tag + date; fingerprint where cheap). A new version re-opens approval — no inherited approvals, no grandfathering. A decision record carries `{version, fingerprint, decision}`; applying a vX approval to vY without a re-verify flag is a process violation, caught at filing time.
- Parallel arms (user-ordered 2026-11-17, v23 amendment (b) replacing frozen-first): every learning run files frozen AND unfrozen arms IN PARALLEL — no sequencing dependency in either direction. Convention: report the frozen arm first. Unfrozen continues the same brains (same seeds/weights/history — continuation, not repetition); deltas named per axis (F-weights / F-tutor / F-data / F-eval; unfreeze one axis at a time where affordable). Measurement-only runs (evals, probes, agreement checks — no learning) exempt by default; any other skip needs a filed one-liner. Rationale: frozen establishes the floor (what transmits/learns with no interaction); the frozen→unfrozen difference attributes the dynamics. Backward-compatible: all runs to date count as frozen phases. Cost noted: ~2x learning compute; exemption clause bounds it.

## Version v23 (COUNTERSIGNED FROZEN 2026-11-17 — the standing plan.
  Review text = v7 (restructure + R9–R28 re-verify: 20 rounds, 60 reviewers, closed barren R28). Pre-edit
  snapshot: src/gameplan-snapshots/2026-11-17-pre-v23.md. On countersign this section
  becomes the standing plan; the amendments below execute: (a) D2 draft section marked
  SUPERSEDED (kept as reference); (b) frozen-first Convention replaced by parallel-arms
  rule (report frozen first, no sequencing dependency); (c) paper-track Phases 1–3 PARKED
  (v22 frozen stays the record, zero new spend); (d) phase restructure 2026-11-17 — P3 scoped
  to a single round, NEW P4 = teach-the-tutor-to-respond (interface spec + score-conditioned
  policy + direction check), NEW P5 = multi-round adaptive loop, old P4 → P6 hard-label
  curriculum. Scratch draft (tmp) retired on push.)

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
4. **Nursery comms constraints (3.b.0)** → govern P6 tutor-generated curriculum: tutor→student
   channel is native signals only, no English interlingua, translation-price reported, ratchet.

## SCRAP / PARK / DEMOTE

- **Old Phases 1–3 (paper track): PARKED.** v22 frozen stays the record. Zero new spend.
- **D1 as detour: SUBSUMED.** Product (spelled tutor blob) is P2's educated tutor; open question
  (competent regime) folds into P6.
- **D2 draft as written: SUPERSEDED** by P2/P3 (kept as reference). E-vs-N survives as a P2 arm.
  No-right/wrong survives in P2/P3; lifted in P6 by definition.
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
   through tutor, entropy ≥1.0. 8. Tutor blob integrity vs filed checksum: blob =
   src/evidence/d1a/tutor.json (promoted 2026-11-17 from scratch/d1a-tutor.json for
   durability; 620692B; curriculum tutor, killA-spelled 0.965 PASS); SHA-256 =
   ce8b97cfd9507428b0d11a7bd0643507e4896ecd4b19edaf84a9e5c2619ad1b3 (filed 2026-11-17;
   verify = recompute on load, mismatch = HALT, no fallback blob). Exit = all 8 green.

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
   agreement (observed − permuted) ≥0.20. The 0.20 is a STIPULATED screening constant
   (adopted R12 — screening bars are stipulated, not derived): report pass/fail at
   0.10 / 0.20 / 0.30 regardless, so a claim surviving at exactly one threshold reads as
   tuning artifact. Control #5 (adopted from ALT): frequency-matched
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
- Tutor-sharpening (glasses, NOT hearing — refiled here 2026-11-17): masked-value
  self-supervised pretraining on noise is an allowed P2/P3 tutor UPGRADE, not a P4
  mechanism. It sharpens pattern vision; it never touches a student score, so it needs
  no P4 interface and teaches the tutor nothing about students. Run sharpened vs
  unsharpened tutor as an arm, never as a silent default.
- Test-administration harness (ADOPTED from builder H): form generator in/out = JSON rows
  [item_id, input, pseudo_class, form_type ∈ {fresh, recombined, control}]; run record =
  [run_id, timestamp, form_id, subject, input_id, prediction, top1, margin, entropy, energy,
  cited_slot]; scoring in a separate process that cannot touch weights (the no-feedback
  enforcement); ledger row = [timestamp, run_id, subject, item_id, label, pred,
  agreement_delta, SHA-256(run_id+item_id+pred+timestamp)]. Reused P2–P6.

## P3 — Teacher-generated tests, SINGLE ROUND (tutor generates → teaches once → final)

P3 is one round only: no cross-round adaptation lives here (that is P5, built in P4). Tutor finds pattern
in noise (same gate as P2).
1. Tutor generates NEW pattern-bearing noise. SEED POOL (adopted R23 — generation needs somewhere to start from): all generation searches/mutates from P2-spec fresh noise (vocab19, matched length bands, fresh seeds, ledger-listed); (a) mutates pool lines by Gibbs/activation-max, (b) conditions on pool lines. No ex-nihilo generation, no unlisted seeds. Candidates (v2 — C1/C2/C3 hole closed to a choice):
   (a) frozen tutor-as-scorer input search (activation-max / Gibbs token mutations, zero new
   weights); (b) taught conditional head (same brain + next-token head, imitation-only objective).
   ORDER (adopted R12 — ambiguous no more): (a) FIRST; (b) only if (a) build-fails on all
   four pseudo-classes. No parallel hedging: one candidate owns the round, the ledger names it. QUORUM (adopted R21 — 3-failed + 1-pass limps forever under all-four-fail): (a) owns the round iff ≥3 of 4 classes pass after retries; 2-or-fewer green hands the round to (b). A one-class (a) cannot run P3 and is not kept alive. NARROW GENERATION (adopted R27 — a stable 1–2-class (a) is narrow, not dead): classes stable across BOTH attempts are ledgered as a narrow-transmission claim scoped to that subset (pattern partition restricted, filed as NARROW per the R21 verdict); the round still goes to (b) for the full pattern, but the narrow result stands beside it, never erased by (b)'s outcome.
   BUILD-FAIL DEFINED (adopted R14 — no silent hangs): (a) fails a pseudo-class = 5 dead
   seeds on that class (new seeds, same tutor); fails the round = all four classes failed,
   each logged with its 5 dead seeds. A switch to (b) without 20 logged dead seeds is a
   process violation. NULL-AND-GARBAGE (adopted R16 — non-null garbage never trips a
   dead-seed counter): each class ALSO carries the 500-iter attempt cap (no ≥0.90 candidate
   inside 500 iters = fail on that class, logged with its iter count). SLOW-CLIMBER RULE (adopted R25 — the cap must not confuse slowness with incapacity): on 500-iter exhaustion, check the best-softmax trajectory — still RISING at cap = grant ONE doubled-budget extension, logged as SLOW (capacity, not failure); FLAT at cap = fail (stuck, not slow). Speed selects for trivial patterns; the extension protects capable-but-slow tutors. Either counter trips
   the class; the class needs one trip, the round needs all four. RETRY RULE (adopted R19 — one stochastic outlier must not kill a 99% build): each class gets ONE retry with fresh seeds (5 new dead-seed attempts or 500 fresh iters); the round fails only if a class fails BOTH attempts. (b)-PILOT (adopted R19 — (a)-first must not bury (b) untested): even if (a) succeeds, (b) gets a BOUNDED pilot on one pseudo-class (capped compute, preregistered); full (b) builds iff (a) fails the round OR the pilot shows headroom ≥ preregistered margin. A limping (a) never silently vetoes (b).
   Build-success criterion: generated lines pass round-trip (blind re-label recovers intended
   pseudo-class ≥0.50 vs 0.25 chance) + novelty filter + entropy gate, else the build fails.
   NON-TRIVIALITY GATE (adopted R11): untaught never-educated-solver agreement on the
   generated lines must sit at chance — if a naive solver already reads them, the pattern
   is trivially imitable and the round proves nothing. Easy patterns that pass round-trip
   fail here. DIVERSITY FLOOR (adopted R26 — mode collapse games every gate at once): generated lines must clear pairwise dissimilarity (mean token-distance above floor, preregistered) AND pseudo-class balance (no class below half its expected share); collapse to one optimal pattern = build fail, however high the round-trip. BALANCE RULE (adopted R12 — distribution cueing): E-lines and N-lines are
   matched on length bands + seeds, solver assignment shuffled, and a distribution check
   (chi-squared on length-band × class histograms, α = 0.05 preregistered) is filed per round; p < 0.05 = systematic gap = VOID (adopted R27 — "systematic" needs a test, not operator discretion); any systematic E/N distributional gap
   voids the round — solvers must cue on pattern, never on which pile a line came from.
2. Tutor teaches once (single-round distillation, P2 machinery), then the EXPERIMENTER gives the
   final exam (binding, experimenter-scored — the one-round version of the formative/summative
   discipline: tutor owns the round, the board owns the verdict). CIRCULARITY RULE (adopted
   R9 2026-11-17 — 3/3 reds flagged acknowledged-but-unmitigated circularity): absolute
   tutor–student agreement on tutor-generated lines is a READ-ONLY diagnostic, never a bar —
   the tutor defines the pattern and the test, so raw agreement is tautological. THE BAR
   is the CROSSED contrast (E-lines×E/N-solvers vs N-lines×E/N-solvers): transmission is
   claimed only if the educated-tutor lines lift solvers above the never-educated
   baseline BY THE SAME 0.20 INPUT-DRIVEN MARGIN as P2 (adopted R11 — lift over a floor
   baseline alone is cheap; the margin is the claim). AGGREGATION (adopted R14 — uniform
   per-solver lift is statistically incoherent): per-solver lift computed individually;
   claim = MEAN lift across solvers ≥0.20 AND MINIMUM lift ≥0 (no solver harmed). A mean
   carried by one solver while another drops = INCONCLUSIVE, never a pass. TEST (adopted R20 — 0.20 is not a naked point-estimate): the mean-lift claim requires the 95% Wilson CI lower bound on the mean lift ≥ 0.20 (Conventions statistics extended to the crossed lift); report point + CI + n, always. HIT FLOOR (adopted R23 — lift over near-zero baselines is noise): each arm needs ≥20 positive hits (preregistered) for its lift estimate to count; below floor = INSUFFICIENT DATA (collect more lines), never a pass, never a fail. Absolute agreement without the
   crossed lift = bias, filed as VOID-adjacent. N-LINES DEFINED (adopted R22 — the baseline generation was unspecified): N-lines = the never-educated tutor run through the SAME generation procedure and the SAME build gate (round-trip + non-triviality + entropy + balance); an N-tutor that cannot pass the gate is not a baseline but an absence → contrast VOID, N-procedure redesigned, no claim.
- P3 exit criterion (PARKED generality probe, not a bar — demoted R10, 6/6 reviewers across
  two rounds flagged it): graduating the carrier (template-document generator re-running
  P3 on documents) stays a proposal because the noise→documents distribution bridge is
  owed and unwritten — no mapping exists for how a noise pattern translates to a document
  pattern. It becomes a bar only with that bridge filed; until then it constrains nothing.

## P4 — Teach the tutor to respond to student scores (NEW — the interface is the phase)

P3's tutor is score-blind: it emits once and never adjusts. P4's main thrust is building
the missing body parts — the INTERFACE between student scores and tutor behavior: where
scores go IN (score vector + five readouts, appended as a side input — specified, not
slogan), and what knobs come OUT (which items get re-ordered / re-selected / re-signaled
/ re-paced next round, and who moves them — tutor or harness). Scores are agreement, not
correctness: the no-correctness rule carries over from P2/P3; hard labels wait for P6.
P4 ends when the tutor has working ears, validated (the two exit-bar checks below are the
definition of "working" — the metaphor claims nothing beyond them). P5 begins when we spend real rounds
measuring what those ears achieve. That interface-built-and-proven line is the P4/P5
boundary.

- ENTRY GATE (owed-spec, blocks P4 compute): the adaptation-mechanism mini-prereg declares
  (i) the interface spec as an explicit MAPPING TABLE (adopted R9 — "score vector +
  readouts" alone is a placeholder): every row names a score/readout field, the teaching
  knob it drives, and who moves the item (tutor or harness); a knob with no driver and a
  driver with no knob both fail the gate; PLUS THE TRANSFORM (adopted R11 — a table of
  what-maps-to-what is still a placeholder for the function): the named computation that
  turns a score vector into a policy change (lookup rule / formula / optimizer — written
  down, not "policy adapts"); AND (ii) which
  level the tutor adapts at. (a) INFERENCE-TIME ONLY — weights frozen, adaptation is
  emission policy between rounds; no new loss, no new machinery. (b) WEIGHT-LEVEL — tutor
  weights update on student outcomes; the mini-prereg then ALSO specifies the objective
  and the guardrails, because a score-driven tutor update is exactly the channel the
  P2/P3 rules were built to keep out — lifting it here needs explicit re-regulation, not
  drift. Under (b) there is NO ready-made candidate: masked-value self-supervised
  training is glasses, not a hearing aid (sharpens pattern vision, never touches a
  student score — refiled below as a P2/P3 tutor upgrade). The (b) mechanism is an outer
  loop, design owed in the mini-prereg.
- Build (the phase's compute): implement the declared interface; under (a), wire
  score-conditioned policy through it, validated against TWO controls (adopted R12 —
  absence-of-scores doesn't prove values-matter): (i) score-WITHHELD (same tutor run,
  scores masked: the CONTROL's policy must show no directed change); (ii) score-SHUFFLED
  (same format, values permuted across items: policy must NOT track the shuffled values —
  kills the "reacts to any input" confound; responsiveness = tracks true values only). OPERATOR (adopted R22 — "driven by" needs math): responsiveness = a preregistered test that policy-change magnitude is predicted by the score vector above the shuffled-score baseline (α = 0.05, effect size reported); the WITHHELD and SHUFFLED arms supply the nulls. No operator, no "driven by" claim.
  (a)-DEFAULT MECHANISM (adopted R17 — V-R3 is right, "policy" was abstract): under frozen
  weights the tutor cannot rewire itself, so the (a) policy is HARNESS-EXECUTED and
  tutor-informed — the harness owns a score→selection function (default: re-weight next-round
  item sampling toward failed pseudo-classes and failed length bands, weights from the
  round's confusion slices); the tutor's contribution is readouts + labels, the harness's
  is the re-ordering. "Tutor policy" under (a) means this harness function keyed on tutor
  outputs — specified, runnable, ledger-visible. Custom transforms allowed but must beat
  this default by a preregistered margin or the default stands (no sprawl).
   ATTRIBUTION DISCIPLINE (adopted R18 — V-R2 is right: under (a) the harness does the adapting,
   so "tutor responsiveness" misattributes): under (a), all P4/P5 teaching claims attribute to
   the TUTOR-HARNESS SYSTEM, never the tutor alone. The contrast isolating the tutor's
   contribution is same-harness × different-tutors (fix the harness function, swap the tutor:
   do outcomes differ? If yes, tutor readouts carry teaching variance; if no, the harness does
   all the work and the tutor is interchangeable). An (a)-line passes only with BOTH the system
   effect AND nonzero tutor-attributable variance. (b)-ATTRIBUTION (adopted R22 — updates move knowledge AND policy together): under (b), the pre/post knowledge probe gates the attribution — knowledge delta ≈ 0 (within margin) → policy attribution stands; knowledge moved → attribute to the SYSTEM and file the policy/knowledge decomposition as OPEN (a confessed confound, not a smuggled claim).
  Under (b), implement
  the declared objective + guardrails in code (guardrails enforced structurally, same
  standard as the P2 scoring separation), then the same score-blind validation.
- Exit bar (two checks, both required): (1) RESPONSIVENESS — the tutor's between-round
  change is driven by the scores on a toy loop of K≥3 SEEDS (adopted R12 — n=2 rounds is
  one anecdote: direction check per seed, 3/3 required; similarity computed over hundreds
  of lines per round, never over 2 points), and the score-blind control shows no directed change. (2) DIRECTION — the loop's final shared
  pattern is compared against the tutor's ORIGINAL pre-loop pattern AND the student's
  early outputs: resembles the original → teaching happened (content flowed tutor→student).
  Resembles the student's early outputs → the tutor caved (content flowed backwards,
  agreement is theatre) → FAIL even if agreement rose. "Resembles" is QUANTIFIED
  (adopted R9): the mini-prereg names the similarity measure over output distributions
  and a margin δ; teaching = closer to the tutor original than to student early-outputs
  by ≥δ, else INCONCLUSIVE (never upgraded to a pass). HELD-OUT DIRECTION (adopted R13 —
  measuring direction on adaptation lines lets weight-level updates overfit the check):
  under (b), the direction comparison runs on HELD-OUT lines/seeds disjoint from every
  line the toy loop adapted on (ledger-verified); under (a) the same discipline applies
  by default. δ DISCIPLINE (adopted R12):
  δ and the similarity measure are preregistered BEFORE the loop runs; post-hoc tuning
  to force a pass is a process violation, logged as breach. Sensitivity reported regardless:
  pass/fail at δ/2, δ, 2δ — a claim that holds at exactly one δ is a tuning artifact, not
  a finding. ANCHOR STABILITY (adopted R20 — no arbitration against a moving anchor): the tutor's pre-loop pattern must be self-consistent across the K toy seeds (pairwise similarity ≥ preregistered floor, measured on HELD-OUT anchor seeds disjoint from every toy-loop seed (adopted R21 — an anchor graded on test seeds is not independent; ledger-verified disjointness) BEFORE the direction check runs; unstable original = nothing stably held = DEGENERATE verdict, direction check VOID (not failed — void, the anchor doesn't exist). CONJUNCTION RULE (adopted R10):
  responsiveness without direction is reflavoring (scores drive change, content random);
  direction without responsiveness is coincidence (pattern preserved, scores did nothing).
  Each check alone is gameable; both are required because each covers the other's hole.
  Pass both → P5 opens. Fail either
  → drop a level or retire the adaptive line with the number. No P5 spend until both pass.
- BOUNDARY DEFENSE (adopted R9 — 2/3 reds read the toy loop as P5 work): the toy 2-round
  loop is VALIDATION, not measurement — n=2, no gain bars, no crossed contrast. It upgrades
  to P5 measurement only with preregistered gain bars + the crossed contrast + a binding
  final. Running rounds without those three is P4 validation regardless of round count.
  NO-BLEED RULE (adopted R13): P5 runs on fresh seeds, fresh lines, and brains disjoint
  from P4's toy loop (ledger-verified) — validation exposure must not contaminate the
  measurement baseline; any reused brain/line voids the P5 round. WEIGHTS ARE THE DELIBERATE
  EXCEPTION (adopted R16 — V-R3's contradiction is real and resolved here): under option (b),
  the TUTOR carries its P4-adapted weights into P5 — that carryforward is the thing being
  measured (continuation, not contamination). Disjointness binds lines, seeds, and STUDENT
  brains; the tutor's adapted weights cross the boundary by design, and the no-bleed ledger
  check verifies everything EXCEPT them. UPDATE CAPS (adopted R20 — unbounded toy-loop updates forget before P5 begins): under (b), per-round update norm AND total toy-loop update norm are both capped preregister-wide; breach = halt. TUTOR STABILITY PROBE: the tutor's own pre-loop pattern is re-measured after toy adaptation — degradation beyond margin = FORGETTING verdict, halt before P5 (a tutor that erased its own pattern has nothing to teach).

## P5 — Multi-round adaptive teaching (was the first half of new-P4, split out 2026-11-17)

P4 built the responsive tutor (interface validated, direction checked); P5 RUNS the loop
across rounds: teach → test → diagnose → adapt policy → teach again, on the P2 harness
(reused).

- Round structure: each round = teach from current policy → tutor-authored round test →
  score + diagnose (P2 diagnosis tree) → adapt policy per the P4-validated mechanism →
  next round. FRESH-PROBE ARM (adopted R21 — continuing students confound accumulation with drift): every round ALSO distills a fresh student on the current policy (single-shot, no loop participation); continuing-minus-fresh margin growing across rounds = cumulative teaching, flat = each round merely re-teaches. CROSS-TUTOR PROBE (adopted R27 — agreement with one tutor may be signal-tracking, not pattern-learning): every round ALSO tests the continuing student on same-family lines from a DIFFERENT tutor (same partition family, foreign emission quirks); collapse on foreign lines = tracking this tutor's signals, not learning the pattern — claim capped at tutor-bound. SELECTION CONTROL (adopted R21 — adaptive selection leaks beliefs through the selection itself: the student can cue on WHICH items were chosen): selected items are interleaved with base-rate items at a fixed preregistered ratio, unpredictably; AND a random-selection control arm (matched item count, random choice) runs every round — adaptive must beat random-selection by a preregistered margin ON A HELD-OUT BINDING PROBE (adopted R24 — V-R3 is right: measured on formative agreement, cherry-picking easy items wins; experimenter-held items, never formative scores), else the "adaptation" is selection theater. Round tests are tutor-internal and NON-BINDING; the EXPERIMENTER authors
  only the final exam (binding) — the formative/summative discipline, minus hard labels. DETECTION-OVER-PREVENTION (adopted R24 — the program's standing economy, now explicit): the plan corrects by verdict and attribution, never by constraining the tutor's strategy space up front — prevention would pre-select the teaching styles under study. Sabotage, gaming, and theatre are all legal moves; they are all also measured, attributed, and failed in the open.
- Bars: adaptation demonstrated = student agreement rises across rounds AND the rise
  attributes to policy changes (same-tutor-knowledge × different emission policies →
  different student outcomes = teaching style, empirically — the contrast P6 will reuse
  with hard labels; scoped R9: the same-knowledge contrast is valid ONLY with weights
  frozen — under option (b) weight updates change knowledge too, so (b) replaces it with
  a pre/post knowledge probe on held-out tutor lines). ANTI-THEATRE GUARD (adopted R9 —
  agreement can rise by simplification/caving): round-over-round, CAVE = the CONJUNCTION
  of (pattern drifted toward student early-outputs beyond margin) AND (agreement rose) —
  conjunction adopted R10, because drift alone also covers HONEST CORRECTION (tutor fixing
  its own misread toward a cleaner pattern neither party held): correction-with-disclosure
  is allowed and ledgered, caving is not. DISCLOSURE (adopted R13 — the tutor cannot
  self-certify honesty): drift disclosures are filed by the EXPERIMENTER (pattern moved,
  direction, agreement trajectory), never tutor-claimed; undisclosed drift is caving by
  default. Drift without rising agreement = correction
  candidate, adjudicated on the final; drift WITH rising agreement TOWARD THE STUDENT'S
  EARLY-OUTPUT partition = theatre, FAIL (adopted R13 — convergence on a THIRD partition
  neither party held at entry is NOT auto-fail: it goes to direction-check arbitration as
  INCONCLUSIVE, since no-correctness admits no "actual target" to appeal to).
  INCONCLUSIVE DISPOSITION (adopted R18 — ambiguity needs an exit, not a shrug): collusive-convergence
  INCONCLUSIVE triggers exactly ONE repeat on fresh seeds; a second consecutive INCONCLUSIVE
  retires the adaptive line with the number (persistent ambiguity IS the finding: the mechanism
  cannot discriminate teaching from collusion, and that inability is filed, not re-rolled).
  CUMULATIVE LEASH (adopted R15, corrected R19 — V-R1/V-R2 are right: summed steps punish oscillation (false alarm) and mismeasure drift): the leash is NET displacement from the P5-entry pattern in the preregistered similarity metric (1 − similarity(current, entry)) PLUS a per-round STEP CAP (no single round jumps more than the single-round cave margin). Net displacement catches caving (where you end up); the step cap catches jumps (how fast you got there); oscillation inside bounds is allowed (harmless wandering, not flight). Breach of either halts the loop for adjudication. Slow caving is still caving, and now so is sudden flight. COMPLEXITY FLOOR (adopted R18 — distance caps don't bound
  simplification: a pattern can stay within δ while collapsing to trivia): the final shared
  pattern must preserve the entry pattern's effective complexity — output-distribution entropy
  (and pseudo-class balance) within a preregistered band of the P5-entry values. Entropy
  collapse with rising agreement = SIMPLIFICATION verdict, fail even inside the leash.
  Teaching preserves the thing taught; reduction is not transmission.
  Flat across
  rounds + DEGENERATE diagnosis = tutor has nothing to say;
  flat + CAPACITY = wall is in the student. Either verdict retires P5 with the number.
- No new machinery in P5: any weight-level build was declared and built in P4. P5 spends
  only on rounds. STUDENT FRESHNESS (adopted R20 — no silent carryover): P5 students are
  FRESH brains (P3 taught its own students to completion; same tutor knowledge crosses
  phases, students never do); WITHIN the P5 loop the SAME students continue round to round
  (that continuity is the measurement); ledger tracks brain lineage per round, and any
  unlogged brain voids the round.

## P6 — Hard-label curriculum (right/wrong allowed by definition; was P4, moved down twice 2026-11-17)

1. Tutor gets hard labels + the specified pattern. MECHANISM CARRYFORWARD (adopted R26 — P6 must not re-litigate HOW the tutor adapts): P6's curriculum engine IS the P4-validated mechanism (harness-executed selection under (a), adapted tutor weights under (b)); hard labels change WHAT is taught (experimenter-specified right answers), never HOW adaptation works. A P6 that re-invents the adaptation loop voids its own lineage — cite the P4 validation, run the P6 curriculum. LABEL ORIGIN (adopted R9 — the tutor
   must never define right): the pattern AND the labels are specified by the EXPERIMENTER —
   the first experimenter content injection in the program (P2–P5 the tutor's own argmax
   was the pseudo-class precisely so no one smuggles in right answers). Calibration step:
   the P6 prereg files the mapping from the specified pattern to the P5 tutor-found
   patterns (same family / extension / unrelated — stated, not assumed), so P6 claims
   stay comparable to the P2–P5 line. MAPPING VALIDATION (adopted R17 — a map the brain
   never agreed to measures the mapmaker): BEFORE P6, the mapping must survive its own test —
   the tutor's P5-entry partition applied to mapped P6 items must predict above the MAJORITY-class baseline (adopted R27 — raw "chance" with unbalanced classes lets a biased map pass; preregistered baseline from the mapped item distribution); if the
   mapping doesn't hold pre-P6, the MAP is wrong, not the brain, and continuity verdicts wait
   for a corrected map. Never adjudicate the brain on an unvalidated map. FROZEN MAP (adopted R19 — a map refit on the probe is circular): the mapping is frozen BEFORE any P6 probe runs, no refit; and it must beat a NEAR-MISS control (adopted R22 — random shuffles of a complex map are trivially beaten): the same mapping with two sibling pseudo-classes swapped must FAIL while the true map passes. A map that can't beat its own near-miss is decoration. CONTINUITY PROBE (adopted R12 — labels must not
   silently replace transmission): a P5-form agreement battery runs pre- AND post-P6; if
   P6 scores high while P5-probes collapse, the curriculum taught fresh labels instead of
   building on transmitted pattern — claim scoped to "labels work," transmission unproven.
   MASKED-VS-SUPERSEDED (adopted R14 — the probe must arbitrate, not just flag): on collapse,
   re-run the P5-form probes with labels REMOVED (pure agreement mode) post-P6. Recovery =
   MASKED (representations intact, readout shifted by labels — transmission survives, claim
   stands with the mask noted). Persistent collapse = SUPERSEDED (labels overwrote the
   transmitted pattern — P6 taught fresh, P2–P5 line retires with the number). GREY RECOVERY
   (adopted R17 — no binary): partial recovery (between 50% and 90% of pre-P6 probe score,
   preregistered band) = FRAGILE verdict — representations degraded but present; the teaching
   claim downgrades to "fragile" and requires a P6-repeat or pattern re-grounding before any
   strong claim. Recovery is a spectrum; the verdict reads the dial.
   2. Tutor generates curriculum AND test
   (ordering/selection/signal/pacing become tutor policy). 3. Repeat P2 with tutor-specified
   right/wrong steering teaching: same-tutor-knowledge × different emission policies →
   different student outcomes = teaching style, empirically. OUTCOME PINNING (adopted R25 — formative agreement cannot evidence style, the tutor authors it): style outcomes are measured on BINDING exams only (finals, held-out probes); formative trajectories are process data (they show what happened, never whether teaching worked). 4. THE FORMATIVE/SUMMATIVE SPLIT
   (user-ordered v6 — REPLACES the v5 hash-commit separation rule: no commit machinery, tutor
   owns MORE of the loop, measurement is cleaner). The tutor SOLELY generates every test inside
   the loop: test → teach → test → teach, all formative tests tutor-authored, tutor-scored,
   tutor-diagnosed. The EXPERIMENTER authors ONLY the final exam — summative, binding,
   experimenter-scored. SAMPLING BLINDNESS (adopted R22 — the bias surface is item choice, not scoring, which is mechanical against the key): final items are drawn by a PREREGISTERED sampling procedure (seeded RNG over the blueprint, ledger-verified draw), never hand-picked; the experimenter cannot steer the draw. Guardrails (format, never content): (a) PUBLIC BLUEPRINT — the tutor
   knows the exam spec (noise family, recombination recipe, length bands, bars, gates) but never
   the items; the final is drawn from the same blueprint the tutor was asked to teach, so failure
   reads as teaching failure, not distribution shift. (b) Formative forms must satisfy structural
   constraints (length bands, novelty-vs-seen filter, entropy gate) — format, never content
   selection. (c) Formative scores are tutor-internal and NON-BINDING (ledgered as
   tutor-reported); binding claims come from the final exam only. Self-policing: sycophantic
   formative tests (tutor flattering its own teaching) surface as final-exam failure attributed
   to the tutor — as examiner AND teacher. (Attribution note, adopted R16: the tripwire
   fires on the formative–final GAP; the gap verdict is "formative loop miscalibrated,"
   with sycophancy vs honest-easiness adjudicated from the ledger — the fail stands either
   way, the motive doesn't have to be presumed to fail it.) DIAGNOSTIC SPLIT (adopted R20 — "tutor failed" must say which job failed): on tripwire fire, file item-level formative analysis — student genuinely solved discriminating formatives but failed final = poor TEACHING (didn't transfer); formatives at ceiling with no discrimination = poor EXAMINING (lied about progress). Different failures, different follow-ups. The fox may run the quizzes; the board runs the final.
   Delta tripwire (adopted from R8 W1/W2/W3 — all three independently proposed the same check):
   if formative agreement ≫ final-exam agreement (final at/below permuted + margin while
   formatives read high), the verdict is sycophantic examining, attributed to the tutor, and the
   teaching claim fails with it. Report the delta, not just the two numbers.
   Off-blueprint transfer arm (adopted R10 — 3/3 reds: knowing the recombination recipe lets
   the tutor drill recipe structure instead of transmitting pattern): the binding final has
   TWO arms — blueprint items (same recipe the tutor taught to) AND transfer items (same
   pattern family, a NOVEL recombination recipe outside the blueprint, experimenter-held).
   Recipe-drilling passes the first arm and fails the second; the teaching claim requires
   both. The tutor is told transfer items exist (no ambush) but never the recipe.
   GREY TABLE (adopted R13 — no hard dichotomy): per-arm bars preregistered (same
   0.20-margin logic per arm, EACH ARM AGAINST ITS OWN RECIPE-MATCHED PERMUTED BASELINE —
   adopted R14, a novel recipe resets the noise floor so P2's absolute number does not
   travel; report raw and baseline-adjusted both); BASELINE-COMPARABILITY GATE (adopted R15, corrected R16 — multiplicative factors on
   probabilities are incoherent: 0.25 vs 0.50 is "2×" and massive, 0.01 vs 0.02 is "2×" and
   noise): the two arms' permuted baselines must sit within a preregistered ABSOLUTE
   difference (default |base1 − base2| ≤ 0.10) — wider gap = arms not comparable →
   INCONCLUSIVE, redesign the transfer recipe, no verdict. LIFT ADJUSTMENT (adopted R17 —
   an easier transfer floor flatters the transfer lift): the transfer-arm lift must clear
   margin + the baseline gap (lift_transfer ≥ 0.20 + |base_transfer − base_blueprint|);
   report raw lift, gap, and adjusted clearance all three, never the pass alone. SPLIT-VERDICT RULE (adopted R22): adjusted-margin pass + unadjusted-margin fail = MARGINAL (difficulty artifact suspected, claim capped at blueprint-bound); both fail = fail; both pass = pass. No single-number verdicts on the transfer arm.
   DUAL GATE (adopted R17 — absolute alone fails at low floors: 0.05 vs 0.15 passes 0.10
   and triples the floor): comparability requires BOTH |base1 − base2| ≤ 0.10 AND ratio ≤ 2×.
   Absolute guards high floors, ratio guards low ones; either fails → INCONCLUSIVE. Report
   the 2×2 — pass/pass = transmission, pass/fail =
   recipe-bound (teaching that doesn't travel), fail/pass = suspect leakage (LEAKAGE AUDIT, adopted R21 — "suspect" needs a procedure, not a shrug: recipe-cue probe, i.e. student tested on recipe-shaped noise WITHOUT the pattern, above-chance = partition cues leak through the recipe, leakage confirmed; plus item-overlap forensics from the ledger; audit unresolved = claim capped at blueprint-bound, never upgraded on optimism; audit the
   transfer recipe for partition cues), fail/fail = nothing transmitted. Partial credit
   is the table, not an argument. NARROW VERDICT (adopted R21 — a tutor that genuinely transmits within one op class is narrow, not failed): blueprint pass with margin across K seeds + transfer fail + stable within-class demonstration = NARROW (transmission real, generality unproven). Generality re-opens with richer teaching, never with retries of the same transfer arm.
   Definitions (adopted R11 — recipe vs pattern is NOT new jargon): recipe = the P2
   recombination ops (HALF-/THIRD-SPLICE, TOKEN-SHUFFLE, length bands), pattern family =
   the P5-entry tutor pseudo-class partition. Same partition under a new recipe = transfer;
   new partition = a different claim. NOVELTY (adopted R12): novel = an op-combination
   absent from every taught and tested form in the ledger (ledger-verified via the
   novelty filter extended to recipe-combos, not just items); breadth disputes are settled
   by the filter output, not by argument. FUNCTIONAL NOVELTY (adopted R17 — combinatorial
   novelty is superficial: new splice points are still splicing): the transfer recipe must
   differ in OPERATION CLASS from every taught form (e.g., taught on splices → tested on
   shuffle-built or length-shifted forms), ledger-verified at class level, not combo level.
   Same-class novel combos are reported as WEAK transfer only — recombination-awareness,
   not pattern transmission, and they cannot satisfy the arm alone.

## Versioning

Countersigned 2026-11-17 by user order (countersign → push → P1 exit → P2 compute). D2 superseded, frozen-first replaced by parallel arms, paper track parked, P3–P6 restructured per (a)–(d).
- LOOP CLOSED 2026-11-17 BY RED-TEAM (user order — steelman never closes; R5 3/3 HOLD kept
  as advisory data only). 6 rounds, 20 reviewers, 20/20 returned: R1 comprehension 3/3
  accurate + 3 reds adjudicated; R2 flesh-out H/G/D/P adopted; R3 audit → v4; R4 verify 3/3
  FIXED; R5 steelman 3/3 HOLD (advisory); R6 red-team closer 2×BREAK-class findings adopted
  (terminology retirement + P4 separation [examiner hole; hard-label phase, now P6 after the 2026-11-17 renumbers] + distillation control + round-trip tripwire),
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
- v7 (user-ordered restructure, post-closure): P3 scoped to a single round; NEW P4 = teach-the-tutor-to-respond (interface spec + score-conditioned policy + direction check); NEW P5 = multi-round adaptive loop; old P4 → P6 hard-label curriculum (with formative/summative split + delta tripwire + off-blueprint transfer arm). R9–R28 re-verify battery on the restructured phases: 20 rounds, 60 reviewers, 60/60 returned — R9 3×BREAK-class opens (circularity unmitigated, placeholder interface, unquantified direction, unbounded drift, recipe leak, label origin); R10–R27 all PARTIAL with adopted patches (crossed bar + margin/aggregation/CI, mapping-table + transform + (a)-default + attribution discipline, two controls + operator, quantified direction + conjunction + held-out + δ-discipline + K-seeds + anchor stability, cave-conjunction + disclosure + third-partition + inconclusive-disposition + net-leash + step-cap + complexity floor, no-bleed + weights-exception + update caps + stability probe + student freshness + fresh-probe + cross-tutor probe + selection control on held-out outcome, transfer arm + functional novelty + grey-table + own baselines + comparability + lift adjustment + dual gate + split verdicts + leakage audit + narrow verdict, label origin + frozen near-miss map + majority baseline, continuity probe + masked-vs-superseded + grey recovery, stipulated 0.20 + sensitivity, tripwire attribution + diagnostic split, sampling blindness, detection-over-prevention, outcome pinning, P4→P6 mechanism carryforward, diversity floor, N-lines + seed pool, balance test, hit floor, aggregation + test, build-fail + retry + slow-climber + quorum + narrow generation + (b)-pilot); R28 3/3 HOLD, no kills → LOOP RE-CLOSED BY BARREN RED (first barren round post-R9 findings; the closer rule is "barren red," met). v7 is signable. Standing record: reviewer misses logged per round (re-reports of answered design, misreads that still earn rewordings, duplicates counted and dismissed with reason — unanimity never proof).
- CONVENTION (user-ordered 2026-11-17, SKILL.md amendment owed post-push): RED-TEAM CLOSES
  LOOPS — a loop ends on an unopposed red round that yields no adoptable finding (barren red),
  never on steelman. STEELMAN IS RESERVED FOR PLANNED CUTS: when a verdict says CUT/ABANDON X,
  steelman X first — its HOLD prices what the cut destroys; its BREAK clears the cut. Steelman
  as satisfaction-ritual is retired (a defender cannot find what attackers missed — R6 proved it:
  16 reviewers incl. 3/3 HOLD, then 4 unopposed reds found the terminology wound + the examiner hole [in P4 then, P6 after the renumbers]).
- PRICED RESIDUALS (run-owed, not doc patches): (1) VOID-gate sensitivity — first P2 run must
  report gate sensitivity/specificity on degenerate controls (dead-tutor vs learning-student
  separation); (2) falsifier power analysis — minimum detectable effect for the two-sample
  recombined-vs-fresh test, filed in the run prereg; (3) P3 diversity audit — full-distribution
  entropy on generated lines (anti-collapse into high-probability tokens).
END OF v23 TEXT (COUNTERSIGNED FROZEN 2026-11-17; amendments (a)–(d) executed).
## Scoreboard

v7 done = Phase 1 verdicts in text + Phase 2 stranger-reproducible + v0.15 submitted, with
3.a decided on data. Every phase exit is a written verdict, never momentum.

<!-- admin pointer (user-ordered 2026-11-18, not a plan change): Always read agents-augment.md first, every session. -->
