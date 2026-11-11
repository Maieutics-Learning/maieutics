## Research sweep retry: random-tutor control prior art (egress recovered 2026-11-11)
Channel: academic + repo (DDG html worked: 36KB, 10 hits; arXiv abs + raw README fetched).
Q: does staged hint fading (hint-privileged teacher → hint-free student, graduated
severance) exist as prior art, and does anything contradict transmission-fragility?

1. DreamingGoose (arXiv:2609.34253) — "Staged Distillation from Autoregressive
   Transformers to Bidirectional Recurrent Diffusion Language Models". Staged
   supervision transfer across architectures. NEAREST to our "staged" idea at the
   lineage level; differs: cross-arch + diffusion LMs, not same-arch hint fading
   on lookup, no severance/fragility analysis. USEFUL as citation, not a replicate.
2. hint-distill (Joeclinton1/hint-distill, README via raw, 1178B) — self-supervised
   hint distillation for code gen: Qwen3-4B generates a hint from the solution,
   then KL-distillation with hint-access model as teacher for itself. CLOSEST
   method analogue (hint-privilege teaching pattern); differs: single-model
   self-distillation, code domain, no fading schedule, no failure taxonomy.
   Supports the pattern; does not anticipate our result.
3. HINT-SD / Distilling Step-by-Step (Hsieh et al. 2023) — hindsight self-distill
   for agents; rationale-distillation classic. Same family, different mechanism.
4. ResearchGate: "A Controller-Based LLM Scaffolding Tutor with Configurable Hint
   Fading" — GATED (no access). Title alone suggests ITS literature already has
   "hint fading" terminology. FOLLOW-UP, not evidence.

Frontier verdict: NO EXACT PRIOR (same-arch staged fading for lookup with
severance-fragility + failure signatures). Two partials strengthen framing;
nothing contradicts. Reported per exit criteria; no empty report.
