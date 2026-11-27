# What the verified literature actually teaches U70 (draft v0.1, 2026-11-27 — for fresh-eyes battery)

Status: draft lessons from 8/8 verified sources. No thresholds are licensed from theory papers. AI systems contribute architectural patterns only; none demonstrates context-posterior-vs-oracle, cue-reliability separation, or causal-use gates.

## B1. Heald, Wolpert & Lengyel (2023), Ann Rev Neurosci — contextual inference is the problem, not a feature
- Verified: review, doi:10.1146/annurev-neuro-092322-100402, 101 cites. Abstract: under naturalistic conditions context is typically uncertain, necessitating contextual inference; hippocampal/prefrontal linkage.
- Lesson for U70: the task spec already encodes this (p_sw=0.02, dwell, independent rho resampling, masking). The oracle's 0.95 ctxAcc is the existence proof that inference is possible here. Highest-priority status stands.
- Non-lesson: no algorithm, no gates, no thresholds.

## B2. Sanders, Wilson & Gershman (2020), eLife — remapping as hidden-state inference
- Verified: doi:10.7554/elife.51140, 172 cites. Claim: hippocampal remapping formalized as hidden-state inference; "what counts as a context change" is an inference question.
- Lesson: U70's switch-detection metrics (delay median 2, FA 0.7/100, 10-trial grace) are the correct operationalization of "what counts as a change." Grace + FA separation is directly motivated.
- Causal upgrade: Mishchanchuk et al. 2024 Science (doi:10.1126/science.adq5874): ventral hippocampus REQUIRED for hidden-state inference in mice. Strengthens hidden-state framing from analogy to causal necessity (in mice, not in our net).
- Supporting: Duvelle et al. 2023 eLife review (splitter signal / latent-state inference).

## B3. Yu & Dayan (2005), Neuron — expected vs unexpected uncertainty (THEORY ONLY)
- Verified: doi:10.1016/j.neuron.2005.04.026, 2007 cites. Canonical ACh=expected / NE=unexpected mapping.
- Lesson: keep ONLY as vocabulary for Phase E (ACh-inspired reliability control vs NE-inspired change control), gated behind representation success. The transcript's caution stands: no thresholds, no detector, no bars may be set from this paper.

## B4. Zheng et al. 2024 Nat Commun — PFC-MD + Hebbian rapid ONLINE context inference
- Verified via OpenAlex: doi:10.1038/s41467-024-52289-3, 27 cites. Model: PFC-MD circuit with Hebbian plasticity for rapid online context inference.
- Lesson: closest biological analog to the F1 fast-statistic direction (candidate-vs-memory novelty → studentized shifts → CUSUM). If U70 needs a bio-plausible online statistic, this is the pointer — not Yu & Dayan.

## A1. DreamerV3 (arXiv:2301.04104, 2023; Nature 2025 version distinct) — RSSM pattern + robustness, NOT identifiability
- Verified with correction: cite with version + arXiv ID. Slices confirm: encoder → discrete stochastic z (softmax + straight-through); recurrent deterministic h predicts z sequence given actions; losses L_pred (symlog recon/reward + continue) + L_dyn (KL predictor vs posterior) + L_rep (KL posterior vs predictor, weight 0.1) with free bits, small rep weight, 1%-uniform mixture against collapse/KL spikes; symlog + return normalization for cross-domain scale; actor/critic train purely from imagined trajectories.
- Adopt for U70: (a) h/z split (history vs stochastic latent); (b) dynamics-vs-representation KL separation with free bits (predictability pressure without collapse); (c) discrete latent + straight-through; (d) imagination/rollout as functional-use analog; (e) scale-robust losses.
- Do NOT adopt: any claim that Dreamer validates context inference — it demonstrates world-model control, not posterior-vs-oracle, cue-reliability separation, or causal-use gates.

## A2. Memora (arXiv:2602.03315, ICML 2026, 22 cites — EARLY)
- Verified: primary abstractions index concrete values + consolidate updates; cue anchors = multiple contextualized access points, many-to-many connectivity; policy-guided retrieval (refine / expand / terminate), GRPO-optimizable; RAG and KG as special cases; SOTA LoCoMo/LongMemEval.
- Adopt as pattern: abstraction + specificity coexist structurally; multiple anchors per memory ≈ reliability-indexed access; retrieval-with-termination ≈ detection with FA control; consolidation ≈ dwell-aware updating.
- Do NOT treat as infrastructure: thin citations, LLM conversational benchmarks, no latent-state control evidence.

## A3. Hindsight (ACL 2026 demo; preprint arXiv:2512.12818 "Hindsight is 20/20" — DEMO WEIGHT)
- Verified: four networks (world / experience / observation / opinion-with-confidence) + retain/recall/reflect; TEMPR temporal entity graph + CARA reflect; 39→83.6 LongMemEval (20B), 91.4 scaled.
- Adopt as pattern: evidence-vs-inference separation maps to U70's c/r/u split (world+experience vs opinion); confidence-scored revisable beliefs ≈ calibrated posterior; temporal ranges ≈ persistence/dwell; traceability ≈ per-trial ledger discipline.
- Do NOT treat as validation: demo track, LLM memory benchmarks, not POMDP identifiability.

## A4. MemOS (arXiv:2507.03724; NOT Kang et al. MemoryOS — DISAMBIGUATE)
- Verified: MemCube = content + provenance/version metadata; unifies plaintext/activation/parameter memory; scheduling/migration/fusion; lifecycle control; stateless-RAG critique.
- Adopt as pattern: provenance/version metadata on beliefs and experiment artifacts; lifecycle thinking for memory entries; cost argument for an explicit memory layer.
- Do NOT treat as model: infrastructure OS, learns no representation.

## S1. LangGraph — orchestration only
- Verified: stateful agent workflow orchestration; learns no latent representation. Use for experiment plumbing if needed, never as the representation.

## Cross-cutting lessons (the "what did we learn")
1. Separation is the whole game: every useful source separates SOMETHING (context vs cue vs noise; dynamics vs representation; abstraction vs specificity; evidence vs inference; content vs metadata). U70's c/r/mask/u split is the POMDP analog — keep factors independently manipulated and separately scored.
2. Predictability pressure needs anti-collapse guards (free bits, small rep weight, uniform mixture). Any U70 neural loss needs the same.
3. Retrieval/belief access should be a terminating policy with FA accounting, not open-ended similarity.
4. Beliefs need confidence + provenance + temporal scope, or they are not usable downstream.
5. No source licenses neural gates: context-tight / rho-loose gate asymmetry comes ONLY from the U70 oracle numbers (ctx 0.95 / rho 0.66 / delay med 2 / FA 0.7/100 / masked 0.94 / misleading 0.90 / action gap +0.20), not from any paper.
