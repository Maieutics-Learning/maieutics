# C4 item 7 + tangential — SDFT (2402.13669) + Coconut/CoCT (2412.06769)

## SDFT: "Self-Distillation Bridges Distribution Gap in Language Model Fine-Tuning" (Yang et al., ACL 2024)
- Thesis: the distribution gap between task datasets and the LLM's own distribution is the primary cause of
  forgetting/misalignment in fine-tuning. Fix: guide fine-tuning with a self-distilled dataset matching the
  model's original distribution. Llama-2-chat: mitigates catastrophic forgetting, keeps helpfulness/safety,
  matches/beats vanilla fine-tuning downstream. Code: sail-sg/sdft.
- C4 verdict: USED (corroboration + vocabulary). Distribution-gap language names WHY ungated chains collapse
  (C3) and why ours doesn't: winner-promotion + ignition gate keep each generation near the tutor distribution —
  our loop is a distribution-gap-managed loop. Third facet of one principle alongside quality-filtering (W3) and
  grounded rewards (W7). No precursor (alignment fine-tuning, no teaching/fading/generations). No conflict.

## Coconut / Chain of Continuous Thought (Hao et al., Meta FAIR, Dec 2024)
- Feed the last hidden state DIRECTLY as the next input embedding (skip LM-head/embedding bottleneck); fully
  differentiable, end-to-end. Continuous thoughts encode multiple candidate next steps simultaneously
  (breadth-first-search-like reasoning). Beats no-CoT on GSM8k/ProntoQA/ProsQA (GPT-2; Llama 3.2-3B/8B gains smaller).
- KEY: multi-stage training — start from full language CoT, progressively REPLACE language thoughts with
  continuous thoughts. Coarse transitions (3 at once at the final stage) spike loss and destabilize; authors call
  for finer-grained schedules (one at a time, fewer language tokens removed) and language-skeleton hybrids.
- Tangential verdict: USED (strong) — independent discovery of STAGED FADING over reasoning representations,
  with the same granularity lesson our fade schedule embodies (many small stages, not few big jumps).
  Closest METHOD analog to fading yet. Still not a precursor: single-model latent training, no teaching across
  models, no generations, no ignition-from-zero. Resolution: cite as convergent method; their instability-at-coarse-
  transition finding justifies our fine-grained stage design. Feeds the continuous-fade branch (their hybrid
  proposal = language skeleton + latent completion ≈ discrete hints + continuous supervision).

## C4 shelf remaining (3 items)
Emergent communication + reviews; cultural-evolution degeneration warnings; AlphaZero/MuZero self-play; OPD.
