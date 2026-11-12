# C4 item 6 — SGSD: "Skill-Conditioned Gated Self-Distillation" (2605.28791, EMNLP 2026)

## What it is
Self-distillation for math reasoning with verifier feedback. Cold-start skill bank: successful traces →
candidate general skills, failed traces → candidate mistake patterns, merged compact. Skill–mistake pairs become
teacher-side privileged-info blocks; a pool of skill-conditioned teachers scores the SAME student rollout;
verifier outcome validates each teacher's polarity; gated distillation learns from informative
teacher–student disagreements. Skills are training-only hypotheses — never injected at eval.
Results: beats GRPO and naive skill-injection (+9.7%/+10% on AIME24/25 at step 100); competitive with
answer-conditioned OPSD under weaker privileged-info assumptions.

## C4 verdict: USED
- Steal (method): F-skillbank — structure OUR implicit mistake bank (killA-collapse s205/s206, memorize-lean
  s603, severance collapse s608 + success shapes) into skill/mistake records per generation; use for tutor
  selection (mistake-profile complementarity, not just Hd) and as gated-disagreement signal. Our ledgers already
  hold the raw material; SGSD gives the construction recipe (successful→skills, failed→mistake patterns, merge,
  pair, gate by outcome).
- Gated-disagreement idea ↔ our collapse-and-recover shapes (G2 s306): informative teacher–student gaps as
  signal, not noise. Cite.
- Precursor check: single-model RLVR self-distillation, no generations, no fading, math domain. No precursor.
- No conflict. C5 form: "They [distill from skill-conditioned multi-teacher pool] under [math RLVR + verifier];
  we [fade hints across generations] under [lookup curriculum]; claim unaffected; so-what: F-skillbank recipe."
- Repo: github.com/walawalagoose/SGSD (+ skill/ dir) — recorded, not fetched (budget).

## Tangential (fast-weights branch): DeltaNet (2406.06484, NeurIPS 2024)
- Linear transformers + SSMs underperform specifically on in-context retrieval; replacing additive Hebbian with
  the DELTA RULE restores associative recall; hardware-efficient parallel training (code: fla-org /
  flash-linear-attention); 1.3B beats linear-time baselines; hybrids (DeltaNet + sliding-window or 2 global
  attention layers) beat strong transformers.
- Branch verdict: USED as grounding. F-deltanet experiment now concrete: delta-rule memory vs
  attention-supervised tinynn on the same lookup probe; the hybrid finding (attention + delta > either alone)
  speaks directly to our hinge (attention fires, lookup stalls) — predicts a hybrid supervisor may ignite where
  pure attention stalls. Fast-weights lineage 1992 → DeltaNet closed as a read thread; open as F-deltanet
  experimental follow-up.

## C4 shelf remaining (4 items)
SDFT; emergent communication + reviews; cultural-evolution degeneration warnings; AlphaZero/MuZero self-play; OPD.
