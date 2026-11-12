# C6a (2/4) — LIMA (2305.11206, Zhou et al., Meta 2023)

## What it is
65B LLaMA fine-tuned on 1,000 curated demos (750 community Q-A + 250 hand-written, optimized for task diversity
+ uniform assistant style). Beats RLHF DaVinci003 and 52k-example Alpaca-65B in human preference (43/46/58%
vs GPT-4/Claude/Bard); 88% meet requirements, 50% excellent. Ablations: quantity without diversity → steeply
diminishing returns; quality/diversity → major gains. Superficial Alignment Hypothesis: alignment teaches
style/format atop pretrained knowledge.

## C6a verdict: USED
- Less-is-more + diversity-over-quantity justifies our tiny-curriculum methodology: nursery rows are few and
  hand-designed; LIMA says that's the right shape (curate + diversify, don't scale rows blindly). Our
  failure-repertoire diversity (killA-collapse / memorize-lean / stall / severance-collapse) IS the diversity axis.
- Contrast sharpens the claim: Superficial Alignment says fine-tuning teaches FORMAT; our loop teaches a
  CAPABILITY (lookup ignition from zero) — different explanandum, stronger claim. State the difference explicitly
  so no reviewer files us under "just style-tuning."
- No precursor (alignment SFT, no teaching/fading/generations). No conflict.

## W18 tangential: C6a prioritization (reasoning scout)
- Dataset distillation (10k→100 synthetic via trajectory matching): DIVERGES from our constraints — needs full
  training trajectories, compute-heavy, opposite of cheap. Deprioritize (SKIP-candidate: no-fit for our budget).
- Pruning/coresets (EL2N, forgetting scores — train the hardest subset): CONVERGES with F-skillbank
  (mistake-profile selection) and our failure-repertoire thinking. Prioritize as W19 direct.
- C6a remaining: pruning (W19 direct); dataset-distillation (verdict by method-knowledge, scout-level, in W19 note).

## C6a remaining (1 wave)
Pruning/coresets direct read; distillation verdict at scout level (cost-mismatch SKIP with teeth).
