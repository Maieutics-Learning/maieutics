# Fresh-eyes on ORIGINAL papers (durable twin, promoted 2026-11-26 from scratch/fresh-eyes-original-papers.md — byte-identical at promotion; old scratch pointer in learnings doc §§6/9 now resolves here too)


## MD-GAIN-NEED
- **Verification:** SLOPED. The brief describes a low-level neural architecture (MLP/carry/composition) while the paper is a high-level normative theory of memory utility (Gain vs. Need).

- **Leftover Idea:** M2 GainxNeed.
    - **Test:** Simulate agent navigation where "Need" (proximity to goal) and "Gain" (recent reward discovery) are decoupled via a shifted reward landscape.
    - **Falsifier:** If memory retrieval patterns correlate purely with distance-to-goal regardless of recent reward-gradient changes, the Gain term is redundant/non-contributory.


## SFMA
- **WRONG**: The brief discusses technical MLP benchmarks, gradients, and "overlap-shortcuts," whereas the paper is about a biological/computational model of hippocampal replay (SFMA) using experience strength, similarity, and inhibition.

- **Leftover Idea: M3 SFMA (Priority-based Replay)**
    - **Test**: Compare a RL agent using "Prioritized Replay" (Strength $\times$ Similarity $\div$ Inhibition) against a "Random Replay" baseline in a grid-world with dynamic barriers.
    - **Falsifier**: Agent performance (convergence speed/reward) is statistically equivalent to random replay despite the use of the prioritized mechanism.


## TAG-BCM
- WRONG: The brief discusses MLP architectures, carry-dimensions, and gradient/shortcut falsification; the paper is a neuroscience review on metaplasticity, NMDARs, and synaptic efficacy. No overlap in technical content.
- M5 trajectory-ramp: Test if a gradual increase in input pressure (mimicking the "tetanus stimulus intensity" mentioned in the text) restores retrieval in the H48 MLP. Falsifier: No change in retrieval success regardless of ramp slope.


## MLC-REMAP
- SLOPED: Brief claims "compose never installs," but text states MLC must "become adept at composition" to answer queries; the brief describes a failure of a specific *implementation* (U42/Wall) not the *theoretical* goal of the paper.

- **M2 GainxNeed**: Test if the model prioritizes study examples that resolve the highest current uncertainty regarding a query's mapping (Information Gain).
    - **Falsifier**: Model performance remains flat or decreases when presented with "high-gain" study examples versus "redundant" examples.


## PROD-GOAL
*   **Verification:** WRONG. The brief describes a hardware/tensor-level debugging session (MLP, 8-dim carry, grads, shortcuts), whereas the original excerpts are a high-level theoretical framework on Vygotskian agents and linguistic internalization in RL.

*   **Leftover Idea:** M6 Productive-Goals.
    *   **Test:** Deploy an agent in a novel environment where no external linguistic goals are provided; measure the delta in discovery rate between a baseline RL agent and one generating internal "synthetic" linguistic goals to guide exploration.
    *   **Falsifier:** If the agent's discovery rate is $\le$ the baseline, or if the internal goals show zero mutual information with the actual state-transitions of the environment.


## INCENTIVE
- **Verification:** WRONG. The brief describes a technical neural architecture (H48 MLP, 8-dim carry, etc.), but the provided paper is a high-level literature review on metalearning and cognitive challenges.

- **Leftover Idea:** M6 Productive-goals.
    - **Test:** Train agent on a sequence of sub-goals where the "reward" is the ability to solve a final, complex task (incentive) vs. reward for sub-goals (standard).
    - **Falsifier:** If the "productive-goal" agent fails to generalize to a novel task using the same sub-goals as the baseline, the hypothesis is falsified.
