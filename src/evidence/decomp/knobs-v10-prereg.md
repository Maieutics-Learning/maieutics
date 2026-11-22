# Knobs-v10 — white-box readout of the student (Pain-axis toolkit, assoc substrate; agent approval: this file; user countersign owed before compute)

## What do I want to find out
Pain-axis reads LLM internals with four moves: difference-in-means vectors, unembedding projection + AUC validation, steering ladders, weight orthogonalization. Our AttnModel cache already exposes everything their pipeline needs: per-step attention (`steps[].att`), full state trajectory (`S`), post-depth states (`SD`), final readout state (`rC`), per-position logits (`posOut`), and the output matrix (`Lout` = our unembedding). Question: do these moves read anything real in our students — specifically the reverse skill, the echo attractor, and the stacking climb?

## Research check
In-repo (AttnModel cache fields verified in src/tinynn/nn.js; filed checkpoints: d-novel-tutor, d-cycle-tutor (echo-collapsed), verR-a R1/R2/R3, verS-donly/shuf). External: method shapes only (diff-in-means, steering ladder, Arditi-2024 orthogonalization) — no external claims imported. Proceeding.

## Design (all eval-only on filed params unless noted)
- K1 attention readout (descriptive): on 200 reverse lines, record the depth-query attention distribution for filed tutor / V1-R2 (=CTL-R2) / R-a-R3 / echo-collapsed cycle-tutor states. Readout: mass on true-binding value position vs query/recency positions, split by correct-vs-echo answers. ("What is it thinking" = which binding it retrieves.)
- K2 vectors: reverse-direction = mean(`rC`) reverse-lines − mean(`rC`) forward-lines; echo-direction = mean(`rC`) echo-answers − mean(`rC`) correct-answers (reverse lines). Run on THREE filed states: stacked (V1-R2), skill-less-but-cycled (DONLY-R2, B3 flat), echo-collapsed (cycle-tutor, B0 destroyed). Validation: cosine across seeds, `Lout`-projection (predicted class of each direction), AUC as a correct-vs-echo classifier on held-out lines. Specificity bar (adopted from fresh-eyes): reverse-direction AUC high on stacked AND ~chance (or direction absent/collinear) on DONLY/collapsed — else the direction is a training artifact, not the skill.
- GATE (adopted from fresh-eyes): K3/K4 run only if K2 validates (cosine-stable + AUC + specificity). Else verdict OPAQUE directly, no steering/ablation on a bogus vector.
- K3 steering ladder: on the V1-R1 state, add α·v_rev (α ∈ {0, ±0.5, ±1, ±2} × state norm) to the pre-head state; read B3 + echo on 200 reverse lines. Bar: B3 climbs with +α quorum 2/3 (causal), echo falls.
- K4 echo-ablation (Arditi-style): orthogonalize the echo direction out of residual-writing matrices (E, Wa, L2, Lout) of an echo-collapsed cycle-tutor state; read B0 + echo + B3. Bar: echo drops ≥ 0.20 without further B0 destruction (else BOUND).
- K5 direction tracking: reverse-direction magnitude (mean correct−echo projection gap) across R-a R1/R2/R3 + DONLY-R2 + SHUF-R2. Question: is stacking == direction growth; do the nulls lack it? (Mechanistic account of the +0.10 climb.)
VERDICTS: READABLE (K2 validates + K3 steers) / PATTERN-ONLY (attention reads, vectors don't steer) / OPAQUE (neither reads nor steers — filed "compiled" story stands, now white-box certified).

## Expectation (scored at verdict)
K1: attention lands on true binding when correct, on recency/query positions on echo. K2: directions exist, cosine-stable, point at answer/echo classes via Lout. K3: modest B3 climb with +α. K4: echo cut ≥0.2, B0 partial. K5: magnitude tracks B3 across rounds; nulls flat.

## Pre-mortem
Strongest objection: h48 states are too entangled for single directions (diff-in-means finds dataset artifacts, steering does nothing) → K2 AUC + K3 ladder are the tripwires; a miss here is the OPAQUE verdict, not a methods failure. Most likely failure: steering flat (direction correlational, not causal → PATTERN-ONLY).

## Nearest-failure
trace-v10 (differs: trace read BEHAVIOR over time; here the readout is GEOMETRIC — directions, projections, interventions on states/weights).

## Cost
Eval-only: ~6 states × (200–600 forwards × readouts) + ladders ≈ minutes per seed, one worker call per K-block, resume-safe via COMPLETE-gated ledgers.

## Ledgers
src/evidence/decomp/d-knobs-{k1,k2,k3,k4,k5}-s{s}.json, d-knobs-verdict.json. Driver: novel-driver.js += readout helpers (no training; ablate = weight copy in memory, filed params untouched).
