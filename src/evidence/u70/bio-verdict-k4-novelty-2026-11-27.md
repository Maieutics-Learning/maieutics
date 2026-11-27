# Biological verdict: is a 4-way dial enough? (2026-11-27 memo)

Question: from a biological view, is a fixed 4-way context dial enough in a novelty-filled world?
Short answer: NO — not as the whole system. Biology never uses a fixed small slot inventory as its entire context machinery. K=4 is defensible as a *working register* only, surrounded by machinery we don't have.

## What the papers actually say (verified abstracts + full texts mined today)
- **Sanders et al. 2020** (abstract verified): remapping formalized as hidden-state inference; "what counts as a context change" is itself the inference problem. [Memory of full paper: the model's state space recruits new states as needed — it is not a fixed-K slot machine.]
- **Heald et al. 2023** (abstract verified): under naturalistic conditions context is typically uncertain, necessitating inference; the review's frame is creation/updating/expression of context-dependent memories — an open process, not slot-filling.
- **Yu & Dayan 2005** (verified, no abstract carried): expected vs unexpected uncertainty → ACh vs NE. [Memory: NE = the novelty/interrupt signal — network reset + learning-rate up when the current inventory fails.]
- **DreamerV3** (methods mined today: vector-of-softmax z + straight-through + 1% uniform anti-determinism): the stochastic code is a VECTOR of categoricals (32×32 in the published hyperparams [memory — supplement, not in our extraction]), i.e. combinatorial capacity, not one K-slot.
- **Memora 2026** (full text mined today): no open-ended/novelty machinery found — abstraction/specificity coexistence only. No license for novelty handling.
- **Mishchanchuk 2024 / Zheng 2024** (from lit-checks record): vHPC causally required for hidden-state inference; PFC-MD does rapid online inference over a SMALL live set via Hebbian plasticity.

## The biological package for novelty (memory — standard results)
1. **Open-ended inventory.** New environments get new hippocampal maps (global remapping); the count grows over a lifetime (cf. Alme 2014: many rooms, no interference). Computationally: latent-cause inference with a growing prior (Gershman CRP) — the number of causes is unbounded.
2. **A novelty detector that recruits.** Hippocampal comparator (prediction vs observation mismatch) → VTA dopamine → encode a new trace; unexpected uncertainty → NE → reset. The detector is not optional decoration; it is what prevents misfiling the 5th context into 4 slots.
3. **Graded-within + discrete-between.** Small change → rate remapping (same map, different rates); large change → global remapping (new map). Our F2 forcing cut (Wc reads z-onehot ONLY) amputated the graded channel: downstream cannot see "same context, different shading."
4. **Composition.** Grid/factorized codes recombine finite elements into unbounded contexts (Behrens 2018 motif). Finite parts, infinite contexts.
5. **Small live set, large library.** PFC-MD holds a FEW live hypotheses (Zheng) — our K=4 matches THIS motif — backed by the open hippocampal inventory plus a fetch mechanism.

## Verdict for U70
- For OUR world (2 contexts), K=4 is generous. Keep it.
- For a novelty-filled world, a bare fixed K-slot is exactly the wrong shape: with no refusal channel, the (K+1)th context must be misfiled — confidently, not blurrily. Note our catastrophe signature IS this: below-chance = locked-onto-wrong, the fixed-dial response to unexplained input.
- F10 ensemble reframe: an ensemble of dials is a crude open-ended inventory, and member DISAGREEMENT is a free novelty signal. File disagreement as detected-novelty, not just variance.
- Order of work: (1) novelty/refusal channel (surprise budget → veto the dial, don't misfile) BEFORE expanding K; (2) open-ended recruitment (CRP-style 5th slot) or ensemble-as-inventory; (3) restore a graded path to the decision (rate-remapping analog, ablation-testable per-path); (4) factorized dial (2×4) for compositionality. Never expand K alone — a bigger fixed slot inventory is still a closed world.

## Correction (owner question): the veto is NOT the refusal channel
- The U53–U63 veto line (closed "mechanism-proven": vetoA ~0.0025 silent in A, vetoB ~0.9975 firing in B) is an ACTION gate conditioned on KNOWN contexts. Its sensor answers "which known context am I in" — so a novel 5th context gets misfiled into A/B exactly the way our dial misfiles into 1-of-4.
- The refusal channel needs a NOVELTY sensor ("how unfamiliar is this input"), which is what the detector line tried and failed to be (U64h verdict ORACLE-ONLY: live detection 0 triggers in 3000 slots, substrate-dead).
- So the veto is the proven ACTUATOR half without the sensor half. Refusal = the missing sensor wired into that actuator (surprise → veto the action + recruit a slot). That wiring is precisely the queued veto-line reopen (task-vs-veto gradient cosine-sim logging).

## Retread check (2026-11-27, owner question — record-grounded)
- **Surprise-gating was tried twice and died twice from degenerate signals, NOT from the gating idea.** E2/E2b correctness-gating saturated (APPETITE-FAIL / CONTROLS-FLAT); E2c disagreement-gating collapsed to mFinal 0/0/0 ("trunk vote == miner vote → surprise 0 always"; filed lesson: the signal must actually VARY — entropy/uncertainty, not binary agreement). U64e/U64h window/candidate-mean surprise: flat, 0 triggers in 3000. A third attempt on the same signal families = retread.
- **What was never tried: the U70 dial's OWN continuous signals as the surprise source** (KL spike, ctx-head entropy, V4-gap drop). Every old failure lived on the retriever stack (votes/miner/r.s). U64h-F1 already names this move: look where the evidence actually lives, not another threshold on flat signals.
- **Ensemble caution filed (ENS FAIL 1/3):** "rescue real but rare; correlated errors cap the upside." Transfers directly: if catastrophe births all lock the same wrong way, member disagreement ≈ 0 exactly when needed. Must be checked, not assumed.
- **Response-gating itself is proven (U31b R2MON-VERIFIES):** gating the response works when the signal is valid. The sensor is the problem, never the gate.
- **Lit-battery constraint:** CUSUM-as-licensed is killed (R1). Any detector statistics must be framed as U70 conventions with oracle-derived thresholds (lit-lessons v1.1 discipline), never as literature derivations.
- **Non-retread next step (reads-only, zero new trains):** U55 discipline — prove the signal exists in FILED ledgers first (F4/F5-k1/k2/F9 per-seed births: do catastrophe births show elevated ctx-entropy/KL or V4-gap-drop vs healthy births? do different births of the same seed disagree?). Signal separates → license the gate build. Signal absent → kill it without spending trains.
