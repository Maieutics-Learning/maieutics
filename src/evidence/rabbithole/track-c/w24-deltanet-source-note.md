# W24 — DeltaNet + GatedDeltaNet source: the delta-rule mechanism (GROUP A)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

Direct: fla-org/flash-linear-attention layer sources behind the W11 read-thread close.
Spend: 1 scout (repo + delta_net.py/gated_deltanet.py + NVlabs official + explainer located
first-try) + 2 primaries (`fla/layers/delta_net.py` 11.7KB + `gated_deltanet.py` 15.9KB, both read
whole). At cap.

## DeltaNet layer (2406.06484; lineage note: originally 2102.11174 fast-weight programmers)

q/k/v proj → ShortConvolution k=4/silu (explicit warning: "crucial, do not turn off") →
activation silu|relu|elu_p1|identity + norm l2|sum → learned per-head beta via sigmoid
(`b_proj`; ×2 when `allow_neg_eigval`, ref 2411.12537 state-tracking) → delta kernel
(`chunk` train, `fused_recurrent` inference when q_len≤64) → RMSNorm or fused gated norm → o_proj.
Masks: padding-only 2D, no arbitrary 3D attention masks — the memory is strictly recurrent.

## GatedDeltaNet (2412.06464, "improving Mamba2 with delta rule")

Mamba2-shaped: ~6h² params/layer, `a_proj` gate fed INTO the kernel (`use_gate_in_kernel`),
A_log/dt_bias discretization (Mamba init: uniform(0,16), dt∈[1e-3,1e-1]), GVA value-head grouping,
output gate swish|silu|sigmoid + FusedRMSNormGated, fused qkv-conv fast path. Training asserts
chunk-mode only. So the SOTA form is delta-recall + Mamba-gating + discretization, not delta alone.

## Mapping to F-deltanet (now concrete)

Experiment arms: (a) attention-supervised tinynn (status quo), (b) delta-rule memory module
(erase-then-write via beta), (c) hybrid. Paper+code predict (c): the codebase's own trajectory is
delta→gated-delta→hybrid-with-attention, matching W11's "hybrids beat transformers." Craft to port:
short-conv preprocessing, l2 qk-norm, LEARNED beta (not β=1), neg-eigval for state tracking.
Crucially the load-test nuance below explains WHY those craft pieces exist.

## Sandbox check (rule 2): true delta rule vs Hebbian, worker-scale

Associative recall with overwrite (A→x, then A→¬x): delta recalls new at 1.000 and erases old
(−0.228); Hebbian recalls new at 0.663 but retains old at 0.452 — interference confirmed,
delta's erase-then-write confirmed. Load test (10 pairs, d=16): Hebbian 1.00 vs delta 0.90 —
HONEST ARTIFACT: with overlapping keys, hard erase (β=1) clobbers neighbors; that is exactly why
the implementation uses learned β<1, l2-normalized keys, and short-conv preprocessing. The code's
craft is the load-test lesson. F-deltanet spec upgraded: β must be learned, keys normalized,
conv preprocessing included — else the experiment re-discovers the artifact, not the mechanism.

## Verdict: USED (source-level, Group A)

Mechanism + craft + lineage (2102.11174→2406.06484→2412.06464) + honest load nuance. No precursor
(recall module, not teaching), no conflict. Improvement target per rule 4.

## Spawned (appended to BACK)

- W37 (A): NVlabs/GatedDeltaNet official impl — training recipe + evals the FLA port doesn't carry.
- W38 (A/B): neg-eigval state-tracking (2411.12537) — when erase-then-write needs sign flips;
  conservation angle: expressive power per parameter.
Standing tangential slot stays open. Synthesis R2 clock: 3/5 new verdicts.
