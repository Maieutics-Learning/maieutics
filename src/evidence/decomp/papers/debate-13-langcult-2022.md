# Debate 13-langcult-2022 (Format 13; 2 rounds)

## THESIS
Sealed R1 below; rebuttals R2; adjudication by owner filed.

## CONTEXT
BENCH (ours): H48 MLP trunk, K=5 heads, 8-dim carry, 800-step runs, R=3 seeds, quorum 2/3. 50+ verdicts, stable wall = USE-WITHOUT-EXCLUSION: pressure installs USE (retrieval works: scr~0.6) but never SELECTION/exclusion/binding (compose/hop queries fail). Closest: U34 pricing compose directly during trunk training (COMPOSE 1/3, all deltas positive but under bar). Failures: U35 capacity H96 (structural wall, price dead weight), U36 diverse diet (diet shuffles, no move), U37 learned inhibition (weights train then hollow: ablation changes nothing), U38 state gate (never shuts, saturates open). E2c: surprise-gate degenerated (miner==trunk, surprise always ~0). U31f: random diet alone can learn the hole (substrate screen). Rules: frozen-trunk/random controls mandatory; no tuning to reviewers.

## SEALED POSITIONS (R1, parallel, no peeking)

### R1-Proponent
1) **MECHANISM**: Vygotskian "Productive" Internalization via Combinatorial Goal Space. Agents must generate their own discrete goal descriptors (inner speech) to project complex queries into solvable pattern-matching spaces.

2) **BENCH TEST**: 
- **Arms**: (A) Baseline; (B) Extractive-only (Goal tokens provided at train/eval); (C) Productive (Trunk must emit goal token *before* acting). 
- **Metric**: COMPOSE/RET success rate. 
- **Bar**: Arm C > Arm B > Arm A by quorum 2/3. 
- **Falsifier**: If Arm B $\approx$ Arm C, self-generation is decorative. If Arm B $\approx$ Arm A, the discrete goal space is not the leverage point.

3) **WHY IT BEATS U34-U38**: It replaces "dead weight" pricing (U34) and saturation (U38) with a discrete symbolic switch. Unlike the "hollow" weights of U37, productive generation forces a functional dependency between the goal token and the output, turning a structural wall into a routing problem.

### R1-Skeptic
1) **KILLER OBJECTION**: The paper assumes a discrete, symbolic goal space where "combinatorial recombination" drives novelty. Our bench is entirely vector-based (miner rows are continuous embeddings). There is no "symbolic goal inventory" to recombine; any attempt to map discrete templates onto our vector space is an external projection, not an internal mechanism. The Vygotskian "inner speech" is a ghost in the machine here.

2) **KILLER TEST**: **Extractive-only vs. Productive baseline.** Provide the goal tokens (bind/retrieve) during training and evaluation (extractive). Compare this to a run where the model must self-generate the token before acting (productive). If the "productive" gain is $\le$ the "extractive" gain, the internal linguistic loop is non-existent, and the model is simply conditioning on a provided label.

3) **VERDICT IT REPEATS**: **U37 (Learned Inhibition)**. U37 showed that weights can train then "hollow" out, where ablation changes nothing. This foreshadows that any "internalized language" is likely a superficial bypass or regularization noise rather than a functional, load-bearing representational shift. The "productive" generation will be a dead-weight signal that doesn't actually drive the trunk's policy.

### R1-Synthesizer
1) **CLAIM**: IF template-goal tokens are prepended during training (extractive) and the trunk must generate the token before acting at eval (productive), THEN COMPOSE/RET gains will exceed the extractive-only baseline BECAUSE the agent has internalized a symbolic goal-space (Clark/Vygotsky) rather than just reacting to input noise.

2) **SETTLER**: A comparison between the "productive" condition (self-generated tokens) and an "extractive-only" control (tokens provided at train, but omitted at eval). If the productive condition outperforms the extractive-only control at quorum, the self-generation step is load-bearing.

3) **CHEAPEST-FIRST**: Measure the entropy of the trunk's first-token emission in the current frozen-trunk baseline (U32) to determine if it currently possesses any bias toward the proposed goal-token vocabulary.

## REBUTTALS (R2, full-doc read)

### R2-Proponent-rebuttal
The Skeptic confuses *implementation* (vectors) with *function* (discrete symbols). Even in a vector space, a "symbol" is simply a stable, separable cluster. If the trunk must emit a specific token to trigger a routing path, that token acts as a discrete switch, regardless of the underlying float precision.

**Concession**: I concede that "inner speech" is a metaphor here; it is actually **discrete latent routing**.

**The Kill**: The Skeptic’s reliance on U37 (hollowing) is a red herring. U37 failed because the signal was passive. Productive generation creates a *functional dependency*: if the token is wrong, the action fails. This prevents hollowing.

**Settling Evidence**: The **Productive vs. Extractive** test. If Arm C (self-generation) > Arm B (provided tokens), the "ghost" is actually the driver. If B $\approx$ C, the mechanism is decorative. Period.

### R2-Skeptic-rebuttal
The "productive" gain is a mirage. Even if Arm C outperforms Arm B, it doesn't prove a "symbolic goal-space"; it merely proves the model can learn a trigger-response loop. 

The Synthesizer’s settler fails because it ignores the "hollow" weight phenomenon of U37. If the trunk simply emits a token as a ritualized precursor to action—without that token actually constraining the policy—the "productive" gain is just a superficial regularization effect, not a functional representational shift.

The cheapest killer is the Synthesizer's own entropy check: if the current frozen trunk (U32) shows zero bias toward the goal vocabulary, the "internalized language" isn't a latent property being unlocked; it's a new, likely decorative, layer. If the signal is dead-weight, the "productive" generation is just noise that the trunk has learned to ignore while performing the actual task.

### R2-Synthesizer-adjudication-draft
**Adjudication**

The Proponent’s mechanism (Vygotskian internalization) survives as the theoretical driver, but the Skeptic’s warning on "dead-weight" signals (U37) survives as the primary risk. The clash centers on whether the goal-token is a functional switch or a superficial label.

**Falsifiable Claim**: If a model is trained with extractive goal-tokens but required to self-generate them at evaluation (Productive), and this Productive condition outperforms the Extractive-only control (where tokens are provided at train but omitted at eval), then the internal symbolic goal-space is load-bearing and not merely a regularization byproduct.

**Cheapest Deciding Measurement**: First-token entropy analysis of the frozen U32 trunk. If the trunk shows zero bias toward the goal-vocabulary, the "productive" gain is proven to be a learned behavior of the training process, not an inherent property of the base architecture.

## ADJUDICATION (owner, Turn-174)
ACCEPT: first-token entropy check on the frozen U32 trunk vs goal-token vocabulary. Zero training; run now. If zero bias, the "internalized language" is not latent — it would have to be installed, which concedes the skeptic's decorative-layer risk up front.
REJECT: productive-generation arm UNLESS entropy shows headroom. Skeptic's U37-hollowing objection stands: a ritual precursor token the trunk ignores is dead weight with extra steps.
SETTLER (if licensed): productive (self-generate then act) vs extractive-only, with the functional-dependency requirement — a wrong token MUST break the action, else the token is not a switch and the thesis is dead regardless of score deltas. Score gain without dependency = regularization mirage.
Next: entropy check. No new compute ordered here.
