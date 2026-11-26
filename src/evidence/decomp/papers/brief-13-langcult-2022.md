# Brief 13 — Colas, Karch, Moulin-Frier & Oudeyer (2022), "Language and culture internalization for human-like autotelic AI"

Source: `scratch/papers/langcult-2022.txt` (arXiv:2206.01134; Nature MI version). Perspective; reframes RL+language works as Vygotskian internalization.

## Mechanism (three theses on language → thought)

- Dennett (software reprogramming): linguistic exposure reorganizes representations (serial virtual machine on parallel hardware). Evidence: instruction-conditioned policies internalize abstractions (e.g. "red" reshapes the policy's color attention); language exposure rewires RL agents.
- Carruthers (constitutive): inner speech as COMMON CURRENCY between modules (perception, motor, goals); top-down linguistic activation = thinking in language.
- Clark (supra-communicative): language RE-SHAPES computational spaces — projects hard problems into spaces pattern-matching brains can solve, without changing the machinery.
- Vygotsky (internalization): social speech → private speech → inner speech; caretaker scaffolding in the ZONE OF PROXIMAL DEVELOPMENT becomes self-generated guidance (internal models of social partners). Two requirements: (1) EXTRACTIVE — exploit linguistic structure/content (condition modules on feedback); (2) PRODUCTIVE — generate own linguistic inputs (inner speech) for autonomy.
- Four productive-model types: trajectory captioners (describe own behavior; auxiliary captioning improves generalization; hindsight relabeling), plan generators (linguistic subgoals à la HRL; abstraction aids systematic generalization), explanation generators (auxiliary explaining aids causal/relational learning), goal generators (IMAGINE: recombine descriptions of past goals → OUT-OF-DISTRIBUTION goals; solves in language space, projects back — Clark's view implemented).

## Results cited (their survey of evidence)

- IMAGINE: novel + appropriate goals (respect linguistic regularities), transmits cultural biases (object/attribute/interaction focus), yields structured exploration + better systematic generalization via widened goal set.
- Instruction conditioning reshapes policy representations; explanation-generation auxiliary improves odd-one-out relational learning; LLM zero-shot planning/goal-suggestion works but "scratches the surface."

## Challenges (#1–4)

- #1 Rich socio-cultural worlds (multimodal, interactive, teachable agents; cross-domain hindsight).
- #2 Systematic internalized language production for EVERY feedback type (embryo of "artificial mental life": inner loops simulating futures/memories).
- #3 Editable/shareable cultural models (LLMs as imperfect proxies; cultural bias useful AND dangerous — geocentric-model warning; agents must TEST cultural info empirically — embodiment as the corrective).
- #4 Long-term goals (beyond episode timescale; culture supplies shaping rewards: grades, money, recognition).

## Bench mapping (our wall)

- This paper answers the "how does selection get its OBJECTS" question that Brief 03 leaves open: out-of-distribution goals come from COMBINATORIAL recombination in a discrete (linguistic) space. Our bench has no discrete goal space — miner rows are vectors. The implementable kernel: a SYMBOLIC goal inventory (query-pattern templates: "bind qk→v under swap", "retrieve under noise") whose COMBINATIONS define training episodes. Novelty comes free from recombination (no learned generator needed — templates + compose).
- The extractive/productive split maps onto our training/eval split precisely: EXTRACTIVE = condition the trunk on goal descriptors during training (cheap: prepend a goal token to the input row); PRODUCTIVE = at eval, the trunk must GENERATE its own goal descriptor before acting (self-prompting). If productive conditioning helps and extractive-only doesn't, the self-generation step is load-bearing — a clean ablation the paper's framework predicts but never tests at our scale.
- Hindsight relabeling (captioners) is directly a REPLAY mechanism (pairs with Briefs 05/06): reinterpret a failed round-1 trajectory as success for the goal it DID achieve; train on the relabeled pair. Our round-2 failures are currently discarded signal; hindsight would bank them.
- "Cultural bias useful AND dangerous" + "agents must test cultural info empirically": our prereg+battery+verdict discipline IS the empirical corrective. Any template-goal inventory must be preregistered (else it's just engineer priors = the EMGEP trap the paper warns Vygotskian agents to escape via autonomy — productive, not extractive, is the goal).
- Dennett's reprogramming vs Clark's reshaping is a REAL fork for the debate: does conditioning on goal tokens need to CHANGE the trunk (fine-tune) or just reshape its input space (frozen trunk + tokens)? Our frozen-trunk discipline (U32) lets us test this cleanly: frozen trunk + goal tokens vs tuned trunk + goal tokens.

## Concrete test + falsifier

- Test: template-goal conditioning — prepend discrete goal tokens (bind/retrieve-under-noise/retrieve-under-swap templates) during training (extractive); at eval require the trunk to emit its goal token first (productive). Bar: COMPOSE/RET gain at quorum vs no-token baseline.
- Falsifier: extractive-only control (tokens at train, none required at eval) + random-token control. If random tokens match, the effect is regularization noise, not goal information; if extractive matches productive, self-generation adds nothing — file scoped. IMAGINE-prediction: recombined (novel) templates should help MORE than trained ones (widened goal set) — pre-register the split.
- Predicts: hindsight relabeling of failed round-1 trajectories banks currently-discarded signal — measure banked-row utility (Brief 05 gain probe on relabeled rows).
