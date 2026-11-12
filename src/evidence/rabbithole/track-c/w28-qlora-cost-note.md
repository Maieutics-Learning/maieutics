# W28 — QLoRA source + teaching-cost breakeven (GROUP B opens)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

Direct: quantization as the first conservation lever + what it costs vs distillation.
Spend: 1 scout + 2 primaries (arXiv-html 2305.14314 307KB mined for numbers + repo README
11KB). At cap.

## QLoRA exacts (paper + repo)

Frozen 4-bit base + gradient-through-quantization into LoRA adapters. 65B: >780GB → <48GB
single GPU, full 16-bit parity. Three innovations: NF4 (info-theoretic optimal for
normal-distributed weights; beats FP4/Int4), double quantization (quantize the constants;
~0.37 bits/param ≈ 3GB on 65B), paged optimizers (unified memory absorbs checkpointing spikes
on long sequences). Scale proof: 1,000+ models, 8 instruction sets, LLaMA+T5. Guanaco: 99.3%
of ChatGPT (Vicuna) in 24h single professional GPU; 7B 97.8% in <12h consumer GPU at ~6GB.
Dataset-suitability > dataset-size (app. B.4 — converges with LIMA diversity).

## Mapping to our conservation question

Two distinct "cheap teaching" lines, now priced apart: (1) QLoRA-style — freeze the brain,
train the adapter (validates the W17 LoRA-as-generations variant with production numbers;
adapter-generations inherit 16-bit parity + consumer-GPU feasibility); (2) distillation —
SPLIT: trajectory-matching (W19 SKIP, compute-heavy, stands) vs black-box API (teacher tokens
at $/1k, no gradients). The W19 verdict covered only the first; the second needs its own entry.

## Sandbox check (rule 2): breakeven toy

Paper scale (1000 demos × 500 tokens @ $0.002/1k): API-distillation ≈ $1.00 vs QLoRA finetune
≈ $48 (24h × $2). OUR probe scale (40 demos × 60 tokens): ≈ $0.005 — cents. So at bench scale
the ranking flips: API-distillation is the cheapest line on the menu, QLoRA-style second,
trajectory-matching last. Honest bounds: toy prices, ignores teacher rate limits + our
50-calls/day cap (the binding constraint per papers.md C6) — API $ is not the budget that
binds us; CALLS are. Spec consequence: black-box API-distillation must be call-budgeted, not
dollar-budgeted → spawned as its own micro-wave.

## Verdict: USED (source-level, Group B)

Production numbers for adapter-teaching + the dollar-vs-calls split that reframes W19.
No precursor, no conflict. Improvement target per rule 4.

## Spawned (appended to BACK)

- W42 (B): black-box API-distillation micro-line — call-budgeted recipe (demos × tokens ×
  50/day cap), teacher-prompt design, parity check vs QLoRA-adapter line.
Standing tangential slot stays open. Synthesis R3 clock: 1/5 new verdicts.
