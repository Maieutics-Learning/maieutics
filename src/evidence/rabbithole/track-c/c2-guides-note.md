# C2 guides read — yjkim-stat (Huginn review) + Locsic (looped-transformer industry guide)

## yjkim-stat: "Huginn — Scaling Test-Time Compute via Recurrent Depth in Latent Space" (review of Geiping et al. 2502.05171)
- Architecture: prelude (~2 blocks) → recurrent core (~4 shared blocks, looped R times, random latent init) → coda (~2 blocks + unembed). R test-time knob (16–128); KV-cache sharing + speculative decoding compatible.
- Training: R sampled per step from Poisson-log-normal (mean 32), truncated BPTT through last 8 passes; 3.5B params / 800B tokens on Frontier (21 segments × 4096 MI250X) — systems effort noted as reflecting recurrent training difficulty.
- Results: gains scale with R up to ~50B-param compute-equivalent, plateau/mild decline at R≈128–256; beats Pythia-6.9B/12B on ARC/GSM8K; flatter on MMLU/HellaSwag; still trails top explicit-CoT on GSM8K.
- Emergent behavior: orbits / sliders / fixed-point convergence in latent trajectories; genuine latent self-correction (revises wrong intermediate value mid-recurrence, never surfacing as tokens).
- Related on same site (next tangential candidates): LoopFormer (elastic budget-conditioned depth), Think-at-Hard (per-token selective iteration).

## Locsic: "Looped Transformers: Recurrent Depth, Huginn and Nanbeige" (industry-facing guide)
- Thesis: recurrent depth = second axis for test-time compute (depth decoupled from output length); as parameter-efficiency ready for production, as CoT replacement still unproven.
- Industry state: Astra (OpenAI flagship, recurrent depth, Critical cyber threshold); Zhipu roadmap (loops for inference depth); Nanbeige 4.2-3B (from scratch, 28T tokens, fixed 2 loops — first production open recurrent); Ouro (1.4B dense → 2.6B recurrent retrofit, GSM8K 78.92%, beats 4B Qwen3); Loopie (20B-A2B MoE).
- Theory: Yang et al. single-layer looped-L simulates L-layer (cost: width); log-accuracy vs effective depth; r loops ≈ r steps silent latent thought; Giannou iterative programs; Yang "learning algorithms" sample efficiency; Coconut (2412.06769, continuous thought by feeding hidden state back).
- Training craft (steal-grade): Fu 2026 — naive 318M degrades at 3–6 loops, collapses at 9; residual-scaling study (2606.18524) — sharing pushes residual-norm growth Θ(√N)→Θ(N), scaling must go 1/√N→1/N, LR depends on distinct layers not loop count; recipe = truncated long-range gradients + ramp loop count over training; Huginn's two open failures (token-dim hidden collapse; model learns to ignore injected input) rescued by craft, not architecture.
- Inference economics: 2 loops ≈ 75% token efficiency (Nanbeige), more loops ≈ 0 return + steep cost; halting camps (fixed / routed MoR / adaptive ACT — least reliable); loop counts fall as scale rises; latency linear in loops (serial dependency); Raschka tempering (matched-compute comparisons; stacking params buys part of the effect).

## Verdict: USED (both guides)
- yjkim: training-recipe numbers (Poisson-lognormal-32, trunc-8) + plateau-at-128 corroborate latent-overthinking from W4; emergent self-correction anecdote supports "latent refinement is real but insufficient" framing. No precursor (review of primary we already used via W4 papers).
- Locsic: industry state for Related Work (production looped models exist — Nanbeige/Ouro/Astra); training-craft recipe as independent corroboration of our seed/init sensitivity (different failure, same lesson: craft dominates); observability tempering supports our behavioral-probes-over-lens position (W4 row 2). No precursor (guides, not methods).
- C5 novelty-delta form: "They [scale loops / review looped systems] under [frontier pretraining / industry survey]; we [fade hints across generations] under [tiny lookup curriculum]; claim [staged fading ignites lookup] holds/falls: unaffected; goal impact: none; so-what: craft-corroboration cited, one audit (F-shortcut) already queued."
- Remaining C2 shelf: aiwiki + Aha-Looped-Transformer pages (Aha Huginn URL known: interactive-active-ai.github.io/Aha-Looped-Transformer/papers/huginn/) — next wave.

## Aha + aiwiki resolution (W6)
- Aha Huginn page: fetched (10KB, JS-rendered atlas — extracted text only 1.6KB: nav + paper abstract + paper/code/weights links). Verdict: SKIMMED (tag: no-fit — interactive atlas; substantive content = the Geiping paper already covered via primaries + yjkim review). Links confirm paper/code/weights canonical locations, nothing new.
- aiwiki: two varied searches (broad guide query → 10 looped-transformer results, no aiwiki; quoted "aiwiki" → zero results). No such indexed guide resolvable. Verdict: UNRESOLVED (tag: can't-locate) — if the shelf author (user) has the URL, one fetch closes it; not worth further scouts.
- C2 shelf now: primaries USED x2, guides USED x2 / SKIMMED x1 / UNRESOLVED x1. C2 effectively closed pending a user-supplied aiwiki URL.
