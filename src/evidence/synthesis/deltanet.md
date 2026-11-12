# DeltaNet + GatedDeltaNet (Yang et al. 2406.06484; Yang et al. 2412.06464) — verdict: USED

AI-facing context: memory-module candidate for tinynn students. ALREADY
deep-read at source level (W24: FLA delta_net.py 11.7KB + gated_deltanet.py
15.9KB read whole + worker-scale sandbox: delta recalls new at 1.000/erases
old −0.228 vs Hebbian 0.663/0.452; load-test honest artifact → learned β<1,
l2 keys, short-conv). This note adds paper quotes + stacks + placement.
Source: scratch/track-c/deltanet.txt (25pp extraction of 2406.06484).

## What it is
Linear transformer with delta-rule fast-weight update (erase-then-write via
learned β) instead of additive Hebbian update; chunkwise Householder-parallel
training scales it to 1.3B/100B tokens, beating Mamba/GLA; hybrids with
sliding-window or global attention beat strong transformers. Lineage:
fast-weight programmers (Schlag 2021) → DeltaNet → GatedDeltaNet (Mamba2
gating + discretization + delta recall).

## Load-bearing quotes (from scratch/track-c/deltanet.txt)
- Mechanism: "Schlag et al. propose DeltaNet, a variant of a linear
  transformer which uses a delta rule-like update to retrieve and update a
  value vector that is associated with the current key."
- Scale result: "We train a 1.3B model for 100B tokens and find that it
  outperforms recent linear-time baselines such as Mamba and GLA in terms
  of perplexity and zero-shot performance."
- Hybrids win: "We also experiment with two hybrid models which combine
  DeltaNet layers with (1) sliding-window attention layers every other layer
  or (2) two global attention layers, and find that these hybrids outperform
  strong transformer baselines."
- Parallel core: "a memory-efficient representation for computing products of
  Householder matrices... makes it possible to straightforwardly extend the
  chunkwise parallel strategy... to the DeltaNet case."
- Retrieval validation: "For in-context retrieval and learning evaluation...
  it is again found to perform well against linear recurrent baselines."

## Novelty delta (C5 form)
They [erase-then-write fast weights] under [LM to 1.3B/100B + retrieval
benchmarks]; we [fade hints across generations] under [tiny lookup]; claim
[delta memory improves recall without hurting LM] holds — no precursor
(recall module, not teaching), no conflict. Improvement target, not rival.

## Stacks
- WITH Mamba: same lineage pressure (fixed-state compression); DeltaNet
  answers with erase-then-write, Mamba with data-dependent Δ. W24 sandbox
  priced the difference at worker scale (delta erases, Hebbian lingers).
  GatedDeltaNet already merges them (delta recall + Mamba gating) — the
  field converged on hybrid; our student memory should too (arm (c)).
- WITH induction-head probe (F-induction): DeltaNet's retrieval benchmarks
  are the same validation norm — delta memory should be TESTED by the
  induction probe, closing the loop between candidate and meter.
- WITH SDFT distribution-gap: erase-then-write keeps memory near the current
  distribution (old associations erased, not lingering) — same principle as
  gap-managed loops, at the weight level rather than the data level.

## Placement: WORKSPACE (primarily)
- Workspace: F-deltanet arms (a) attention-supervised baseline, (b) delta
  memory (learned β, l2 keys, short-conv — the W24 craft list is the spec),
  (c) hybrid. Validated by W24 sandbox; paper quotes justify the choice in
  harness docs.
- Nursery: only via results (if delta-memory students learn differently,
  the nursery inherits it) — no direct placement.
- Neither: 1.3B scale claims, DNA/audio, chunkwise kernel engineering.

## Follow-ups
- F-deltanet: build arms (a/b/c) in tinynn harness per W24 spec.
- F-induction-on-delta: run the induction probe against delta-memory
  students (candidate meets meter).
- RW-DeltaNet: §7 retrieval-module citation (erase-then-write + hybrid norm).
