# Continuous-fade branch — consolidated design (W20 tangential; design-stage, no runs)

## Problem with staged fade [100,75,50,25,0]
Coarse transitions (Coconut W12: 3-at-once transitions spike loss; finer schedules called for). Linear-ish
stages are a guess; tutor-rule + gate are doing unmeasured work.

## Ingredients (all sourced in-trail)
1. Exponential supervision decay (CGAR HSW, W15): w_t = λ^{t-1}/Z, matched to gradient-magnitude decay.
   Hypothesis: decay the AUXILIARY supervision weight exponentially rather than stepping hints linearly.
2. Off→on-policy annealing (OPD/DAgger framing, W16): early = tutor-driven (off-policy), late = student-driven
   (on-policy). Fade parameter = the DAgger β. Predicts severance collapse when annealing is too fast (s608).
3. Language-skeleton + latent completion (Coconut hybrid proposal, W12): discrete hints for structure + continuous
   supervision for execution. Our attnAuxW IS the continuous channel already — the hybrid is: fade discrete hints
   fast, decay continuous supervision slow (two timescales).
4. Difficulty-gated fade (Think-at-Hard analog, W6): hard items keep hints longer. Per-item hint levels driven by
   mistake profile (F-skillbank feeds this).
5. TTT-analog (W8): fade stages as inner-loop steps with decaying supervision — the loop already implements this;
   make it explicit (log per-stage student-driven-ness).

## Proposed design (for bench, not this wave)
- Two-timescale fade: discrete hint level H(s) stepped down on ignition-gate mastery (not fixed schedule —
  mastery-gated like LoopThink's 95% curriculum, W4); continuous aux weight w(t) = λ^t exponential (CGAR shape).
- Per-item modulation: items in the current mistake bank keep H one level higher (difficulty gating).
- Annealing readout: report per-stage off/on-policy fraction (student-driven-ness) alongside Hd — makes the
  DAgger analogy measurable (F-new metric candidate).
- Experiments that decide: F-singlegen (generations vs fading) FIRST — if generations don't matter, the whole
  branch simplifies to single-student annealing. Then F-deltanet (supervisor architecture) and F-skillbank
  (selection signal) plug into the winning structure.

## Status
Design complete on paper. Blocked on bench time (F-singlegen). No code, no runs this wave.
