# W29 — inference-time stretching: LayerSkip + early-exit speculative decoding (GROUP B)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

Direct: how inference buys speed with less compute — the runtime mirror of our training-time fade.
Spend: 1 scout + 2 primaries + 1 varied retry (v2 URL 404'd → v1 200).
(LayerSkip README 11KB read whole; 2406.03853 EESD html 502KB mined for zones.)

## What the sources give

LayerSkip (2404.16710, ACL'24): train with early-exit loss + layer dropout so EVERY prefix is a
usable model; inference = self-speculative decoding (draft at `--exit_layer`, verify full pass,
`--num_speculations` drafts). Sweep BOTH knobs per (model, dataset, sampling): exit smaller =
faster/weaker drafts; speculations larger = better amortization but lower acceptance. Correctness
guaranteed only unsampled; speedups only on generation tasks (gsm8k/cnn/human_eval), never on
classification (piqa/boolq — nothing to amortize). Adopted into HF transformers + torchtune + trl;
7 checkpoints (llama2/3/3.2, codellama). gpt-fast port compounds with compile/quant/TP.

EESD (2406.03853): early-exit after first-N layers as draft generator + SELF-DISTILLATION to raise
draft quality (cheap teaching inside inference) + THOMPSON SAMPLING (Beta) controller that sets
the draft count per round adaptively + single-forward verification (lossless, distribution-consistent
with vanilla AR). Ablations ask exactly our questions: optimal drafting steps, effect of first-N,
is one layer best for exit, training efficiency, tree attention, compute breakdown.

## Mapping (inference stretching ↔ fade design)

Draft-verify = hint-solve with the verifier as gate (our metric gate, W8). Exit_layer sweep =
hint-depth sweep (same optimization shape: cheap-weak vs dear-strong). Thompson controller =
per-item adaptive hint depth — the executable form of the W6 difficulty-gated fade idea, now with
a named algorithm (Beta-bandit over draft counts). Self-distillation-for-drafts = teaching the
cheap path with the dear path — the inference-time twin of our generational teaching.
Classification-tasks-don't-speed-up = boundary condition: stretching needs generatable slack;
maps to our probe design (lookup must have headroom for fade to matter).

## Sandbox check (rule 2, toy): HONEST ARTIFACT

Toy sweep (acceptance=1−e^{−exit/6}, cost=draft×spec+(1−accept^spec)×verify) puts the optimum at
the shallowest exit — a boundary answer driven by my chosen curve, not evidence. Recorded as
artifact, not result: the tradeoff SHAPE ports (U-curve logic), the optimum LOCATION needs measured
acceptance. This is the same lesson as W24's load test: toy functional forms can't place optima.
Spec consequence: F-shortcut/margin work must measure acceptance-per-exit on the probe; no toy
optima enter the design.

## Verdict: USED (source-level, Group B)

Runtime mirror + Thompson controller + self-distillation twin + boundary condition. No precursor
(inference serving, not teaching), no conflict. Improvement target per rule 4.

## Spawned (appended to BACK)

- W43 (B): Thompson-sampling per-item adaptive controller — Beta-bandit over hint depth/fade
  stage per item (difficulty-gated fade, executable) → continuous-fade design + F-shortcut.
Standing tangential slot stays open. Synthesis R3 clock: 2/5 new verdicts.
