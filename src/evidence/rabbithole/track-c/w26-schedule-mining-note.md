# W26 — schedule/recipe numbers mined from existing dumps (GROUP A, 0-fetch)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

Direct: extract exact schedule/recipe numbers for the continuous-fade design from the four dumps
already on disk (w15-cgar, w12-coconut, w17-tiny, w18-lima). Spend: 0 scouts + 0 fetches (mine
only). At floor, not cap.

## Numbers recovered

CGAR (PDC+HSW): depth stages (2,1)→(4,2)→(6,3) keyed to NORMALIZED training progress (not wall
epochs) — 41.4% FLOPs cut, no early overfit. HSW: w_t = λ^{t-1}/Z_λ (exponential, aligned to
observed gradient-magnitude decay) — 40% gradient-variance cut. Sudoku-Extreme 423,168 puzzles:
1.71× speedup (10.93→6.38h, −42% cost, −0.63pp acc); PDC alone 2.26× at 85.47% (ablation:
depth-curriculum carries more than weighting).

Coconut: +3 continuous thoughts at once, esp. final transition → loss spike/instability. Prescribed
fix (their future work, our design input): add ONE thought at a time while removing FEWER language
tokens; token-by-token removal + pause tokens ease training. GSM8k Llama: Stage 0 = 3 epochs, +1
epoch/stage. Long-tail sets: 6 epochs initial + 3/stage, 5 epochs/stage elsewhere, STAY in final
stage to 50 epochs, best-val checkpoint, inference thoughts = final-stage count. Optimizer state
RESET on stage switch (their trick, our analog: re-anchor the student optimizer at each fade step).

TinyStories: 3–4yo vocab constraint, GPT-3.5/4-generated, <10M params incl. single-block;
GPT-4-as-teacher multidimensional grading (grammar/creativity/instruction-following) — the
cheap-regime precedent + metric-gate contrast already verdict'd, now with recipe exactness.

LIMA: 65B + 1,000 (750 StackExchange/wikiHow sampled for quality+DIVERSITY + 250 manual for task
diversity + uniform style); Superficial Alignment Hypothesis (format-vs-capability) — the
diversity>quantity rule for our tiny-curriculum composition.

## Mapping to continuous-fade design (parameters, finally)

Exponential HSW shape (w_t=λ^{t-1}) replaces staged [100,75,50,25,0] as default; Coconut says
make granularity FINE (one-hint-at-a-time removal, not 25pp cliffs); CGAR says key transitions to
normalized progress; Coconut says reset optimizer state at switches + anchor final-stage count at
inference (= severance-anchored eval); PDC ablation says depth-curriculum > weighting (for us:
stage NUMBER of hints matters more than hint STRENGTH — supports hint-count fading over
hint-strength fading). LIMA says compose stages for diversity, not volume.

## Sandbox check (rule 2, toy bake-off)

Internalization-per-hint-cost: exponential 0.271 > staged 0.256 > linear 0.235 > finer-6 0.219;
finer-6 best final gap (0.235) at highest cost (3.5). Toy parameters arbitrary — qualitative lesson
only, and it matches both sources: exponential is cheapest per unit, fine-grained is safest but
dearest. Design consequence: DEFAULT exponential + fine granularity, with hint-budget accounting
(cost column in the fade ledger). Spec'd into continuous-fade-design.

## Verdict: USED (detail-mining, Group A)

No new paper, but first exact parameters for the fade design. No precursor, no conflict.
R2 CLOCK FULL (5/5): W22 SGSD-source, W23 emlangkit, W24 DeltaNet-source, W25 LoopThink-audit,
W26 schedules. Synthesis R2 fires next per rule 5 (queue jump, logged).
