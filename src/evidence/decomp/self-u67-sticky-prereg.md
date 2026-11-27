# U67-STICKY (E-STC1) prereg v1.0 — provisional writing, permanent only on importance

**Track:** U67 (success-recipe step 4; gated on U64 PROCEED — independent track per U52, runs alongside
U65/U66, needs no detector).
**Cover:** user 2026-11-26 pre-countersign = this prereg + 10x battery now; driver + Waves covered ONLY
once U64 PROCEED is filed (checked at build; else HALT). NO PUSH without order.
**Lesson encoded:** Adam commits every step; U60b's auxiliary price is anti-tagging (forces commit every
row instead of provisional-then-capture). Brief-19: weak tetanus sets a short TAG (<30 min in vivo);
strong events synthesize PRPs; tagged synapses capture → late LTP. Our timescale: tag horizon TENS of
steps (brief-11 mapping) — U60's 100-row quarters would outlive any tag, so BLOCKS ARE SHORT HERE by
design (weak+strong within ~30 steps), never assumed to persist 100 rows.

## Design (E-STC1 as filed in brief-19 + U52 v1.1 pins)
- Weak task: assoc slice with few reps that is VERIFIED forgotten alone (WEAK-ALONE control must show
  retention ≈ chance on weak evals — else the "weak" task isn't weak, HALT-FIX the rep count).
- Strong event: salient novel block (separate diet block, high-novelty rows) paired with the weak trace
  INSIDE the window (±15 steps, BEFORE/AFTER arms — window-dependence needs both sides) vs OUTSIDE
  (lag 200 steps) vs STRONG-ALONE (strong block alone, no weak trace).
- Tag mechanism (minimal, no architecture): rows with weak-but-nonzero error set tag=1 (decays linearly
  to 0 over H=30 steps filed); rows co-active with tag>0.5 AND strong-signal (d > μ+2σ trailing) trigger
  CONSOLIDATION: +R=5 replay updates on a buffer of tagged rows (filed). Yoked control (P1a/falsifier):
  identical consolidation budget on RANDOM rows instead of tagged rows.
- Bar (quorum 15/20): paired-inside retention ≥ STRONG-ALONE levels on weak evals AND paired-outside ≈
  WEAK-ALONE (window-dependence is the signature — "more training helps" is not enough) AND yoked ≈
  outside (proves the NOTES, not the extra writing, do the work). Blocks short by construction (weak
  block + strong block within one 400-row episode, inside-pairing gap ≤15 steps).
**Waves:** 0 (WEAK-ALONE forgetting verification + tag-decay determinism + budget-equality audit
(consolidation updates matched yoked) + twin determinism, COMPLETE-gated); 1 (6 arms×20 = 120 short
trains (400st, filed — short blocks are the treatment) + evals); 2 (retention curves per arm, not just
endpoints — filed — + verdict).
**Verdicts:** TAGS-WORK (window-dependence + yoked≈outside at quorum → provisional plasticity proven;
licenses composition with U66 modes) / NO-CAPTURE (inside≈outside → no capture-like effect; weak trace
is learned-or-not, two-factor persistence buys nothing) / WEAK-NOT-WEAK (WEAK-ALONE retains → rep
count wrong, HALT-FIX, one amendment) / PIN-FAIL. Filed expectation: window-dependence visible (tag
H=30 fits inside-pairing by construction; outside-pairing exceeds it). Falsifiers: H/R/window changes
post-Wave-0 need a new version.
