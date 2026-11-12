# W43exec — adaptive inference + input-injection (Group A; backlog-W41)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 2 primaries, at cap)
- `inference_extrapolation_adaptive.py` (117 lines, whole): adaptive recurrence via `forward_adapative_ent` (max R16, cosine-similarity CLI description), checkpoint_epoch_5388 default, per-type accuracy + avg-iterations + iteration-stats → JSON (`accuracy_per_type`, `avg_iterations_per_type`, `iterations_stats_per_type`, config). `input_injection` flag = re-add input embeddings at each recurrence.
- `gpt_utils_extrapolation.py` zones (23KB): `evaluate_model_test_adaptive` (ent-halting) + `_adaptive_metrics` variant, `RecurrentGPT2Block.__init__(..., input_injection=False, c_scale=0.003)` — injection is a constructor flag on the recurrent block; exact halting threshold lives in the model forward (not fetched).
- Verdict USED: adaptive-metrics spec (per-type acc + iteration stats) + injection flag pin the design; the ablation (on/off comparison) is a run, not a read → spawned W58 (bench-gated). No precursor, no conflict.

## Tangential (reasoning, 0 spend)
- Input-injection flag IS our prelude re-injection (concat input each step) as a CLI toggle. Their open ablation = our answered architecture (we ship re-injection; they test it). Converges with W42 fixed-R recipe: train fixed, infer adaptive.

## Spend / queue
- Spend: 0 + 2 (at cap). Consumed backlog-W41 removed; spawned W58 to BACK. Backlog 17. Synthesis R4 clock: 4/5.
