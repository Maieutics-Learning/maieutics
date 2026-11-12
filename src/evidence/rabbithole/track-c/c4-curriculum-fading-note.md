# C4 item 5 + novelty-gate investigation — Curriculum Extraction (2503.17494) + faded worked examples (Renkl & Atkinson)

## "Efficient Knowledge Distillation via Curriculum Extraction" (Gupta & Karmalkar, 2503.17494, ICLR 2025)
- Progressive distillation normally needs teacher CHECKPOINTS as implicit curriculum (costly to store/select).
  Their scheme extracts the curriculum from the fully-trained teacher alone: random projections of teacher hidden
  reps progressively train the student, then full-output training. Beats one-shot distillation (sparse-parity
  theory in 2-layer nets; also transformer sparse-parity + LM tasks).
- C4 verdict: USED (corroboration). Their "progressive supervision from teacher internals" converges with our
  attnAuxW auxiliary-attention supervision faded over stages — same family (internal-signal curricula), different
  realization (random projections of a frozen teacher vs decaying supervision weight from a live tutor).
  No precursor (efficiency distillation, no generational loop, no fading schedule). No conflict.

## Faded worked examples — Renkl & Atkinson (novelty-gate investigation; PRIMARY SOURCES WALLED: RG 403, APA login — characterization at scout level, flagged)
- What the literature establishes (textbook-standard, scout-level): backward fading (worked example → completion
  problems with LAST steps blanked first → independent solving) per Renkl & Atkinson 2004 "How Fading Worked
  Solution Steps Works — A Cognitive Load Perspective" (building on Atkinson, Derry, Renkl & Wortham 2000);
  mechanism = cognitive-load management (offload intrinsic load early, free germane load for schema construction).
- Novelty analysis (C5 bar, honest): faded worked examples ARE a precursor on the FADING IDEA (guidance
  withdrawal is old: 2000–2004 ed-psych). Invention→implementation downgrade risk is REAL for "fading" per se.
- Surviving novelty (scoped, defensible): (i) the LEARNER is gradient-trained, not human; (ii) GENERATIONAL —
  distinct student models with tutor selection (cultural transmission; closer to iterated learning than classroom
  fading); (iii) ignition-from-zero of an impossible-at-start capability, not test-score gains on solvable material;
  (iv) behavioral gate + promotion machinery; (v) cheap/in-browser.
- Consequence: Related Work MUST cite faded worked examples as the intellectual ancestor (RW-fading, queued in
  the paper-patch batch); the paper's novelty claim scopes to GENERATIONAL MACHINE TEACHING, not fading itself.
  Verdict on the fading thread: USED-CONFLICT (conflict = precursor on fading-idea; resolution = scoped novelty).
- C5 experimental follow-up (required for CONFLICT): F-singlegen — same fade schedule, ONE continued student vs
  fresh student per generation. Tests whether GENERATIONS (not fading alone) drive ignition. If single-student
  self-fading also ignites, the generational claim weakens and the paper re-scopes to fading-schedule design.

## C4 shelf remaining (5 items)
SDFT; SGSD + skill/mistake banks; emergent communication + reviews; cultural-evolution degeneration warnings;
AlphaZero/MuZero self-play; OPD.
