# Brief 02 — Lake & Baroni (2023), "Human-like systematic generalization through a meta-learning neural network"

Source: `scratch/papers/lake-baroni-2023-pmc.xml` (PMC10620072 full text, Nature 2023). Primary research: human behavioral experiments + MLC optimization + ML benchmarks.

## Method (MLC — meta-learning for compositionality)

- Standard transformer (encoder: study pairs + query concatenated; decoder: output), NO symbolic machinery, no hand-designed representations.
- Meta-training: 100,000 episodes + 200 validation, each episode a DIFFERENT seq2seq task defined by a RANDOMLY GENERATED interpretation grammar (rewrite rules for primitives sampled by random pairing; function rules sampled for arity/position/arguments). Grammar never observed; must be inferred implicitly per episode. Test-time weights FROZEN — all adaptation is in-context/memory-based.
- Human comparison: n=25 few-shot instruction task (14 study pairs, 10 queries, pseudolanguage→colored circles; words/colors randomized per participant); n=29 open-ended task (7 unknown instructions, no examples — pure prior probe).
- 7 models compared: baseline, symbolic oracle, symbolic oracle+biases, basic seq2seq, MLC copy-only, MLC algebraic-only, MLC joint, full MLC.

## Results (numbers)

- Humans: 80.7% exact algebraic match; also systematic biases: one-to-one (62.1%), iconic concatenation (79.3%), mutual exclusivity (~all).
- Best MLC run: 100% exact match (greedy decode) on the human task; sampling average 82.4% systematic (vs human 80.7%); longer sequences 77.8% (vs 72.5%); error pattern human-like (one-to-one 56.3% of errors; iconic concatenation 13.8%); item difficulty correlation r=0.788, p=0.031.
- Log-likelihood of ALL human responses: MLC joint −349.2 / MLC −358.1 vs symbolic oracle+biases −357.2 vs basic seq2seq −1264.7 (few-shot); open-ended: MLC joint −635.7 vs symbolic+biases −1008.5. So MLC ≈ best symbolic on few-shot, strictly best on open-ended.
- ML benchmarks: <1% error on SCAN ("add jump") and COGS systematic lexical splits, via surface word-type permutations (minimal structural knowledge — remap word meanings without expanding vocabulary).
- Bonus: best run inferred NOVEL rules that never participated in meta-training (grammar-level generalization beyond the episode distribution).

## Author-stated limits

- Models ADULT skills, NOT how adults acquire them (developmental process explicitly out of scope).
- GPT-4 still challenged (Supp. Info 3) — systematicity open even at scale.
- People are not purely algebraic: biases sometimes help, sometimes hurt; the win is systematicity AND flexibility together (rigid symbolic vs flexible-but-unsystematic nets both fail one side).

## Bench mapping (our wall)

- STRONGEST EXISTENCE PROOF for our exact gap: a standard sequence net, optimized for compositional skill over randomized episodes, gets selection-like behavior (right rule for the query, composed from studied parts) with frozen weights. Our trunk never had this incentive: our diets randomize ROWS but never randomize the MAPPING (the miner's rule is fixed per stream family). Memorizing input-output patterns in weights is always available to our trunk — exactly what MLC's per-episode randomization forbids.
- Grammar-level randomization >> our diet diversity: U36 varied row MIX (50/25/25) but the underlying rule stayed constant. MLC varies the RULE ITSELF per episode. Prediction: our U36 DIET-ONLY result (diet shuffles, no quorum move) is expected under MLC theory — we varied the wrong thing.
- Human bias trio (one-to-one 62%, iconic concatenation 79%, mutual exclusivity ~100%) is a ready-made PRIOR for a selection mechanism: prefer unique meanings per cue (mutual exclusivity ≈ our missing exclusion!). A scorer/inhibition term shaped like mutual exclusivity (penalize assigning the same output to two different queries) is directly implementable in our 4-class head-vote setting.
- Caveat: 100K episodes vs our 800 steps; transformer vs our H48 MLP; frozen-weight in-context adaptation vs our weight-learning trunk. The transferable claim is the INCENTIVE STRUCTURE, not the scale.

## Concrete test + falsifier

- Test: per-episode cue→target REMAP diet (each 800-step replica draws a fresh random mapping; query = novel composition; price query-after-demo). Bar COMPOSE ≥ +0.05 quorum on held-out mappings. This is the experiment Irie §3.3 describes and we have never run (our mappings are stream-fixed).
- Falsifier: fixed-mapping control — if it matches, mechanism = memorization (file as scoped, not learning-to-learn). Also bias-ablation: mutual-exclusivity-shaped scorer vs flat — if flat matches, the prior adds nothing.
- Predicts failure mode: per Limitation-2 of Brief 01, expect the skill to hold only within the remap family (no transfer to hop-shape) — pre-register the held-out family as measurement, not bar.
