# Brief 10 — Andrychowicz et al. (2016), "Learning to learn by gradient descent by gradient descent"

Source: `scratch/papers/andrychowicz-2016.txt` (NeurIPS 2016). Primary: learned coordinatewise LSTM optimizers.

## Mechanism

- Replace hand-designed update with a learned rule: 2-layer LSTM (20 units), COORDINATEWISE with shared weights but SEPARATE hidden states per optimizee parameter (invariance to parameter order; scales to tens of thousands of params). Recurrence = learned momentum-like history integration. Train by truncated BPTT on E_f[Σ w_t f(θ_t)] with w_t=1 (dense trajectory signal, not just final loss); DROP second derivatives (assume ∂∇_t/∂φ=0).
- Training protocol: early-stopped on validation, best optimizer reported on FRESHLY SAMPLED test problems; baselines (SGD/RMSprop/ADAM/NAG) learning-rate TUNED per problem.

## Results (numbers)

- 10-D quadratics: learned >> tuned baselines (100 steps, unrolled 20).
- MNIST MLP (1×20 sigmoid): LSTM beats ADAM/RMSprop/NAG; generalizes to 200 steps (trained 100), 40 units, 2 layers — but FAILS on sigmoid→ReLU switch (dynamics too different).
- CIFAR-10 conv (3 conv + FC, 2 LSTMs split by param type): much faster learning; transfers across label subsets (CIFAR-2/5), including disjoint-labels training.
- Neural Art: transfers across styles AND 2× resolution.

## Author-stated limits

- Generalization is WITHIN-family (similar dynamics); activation switch breaks it. Coordinatewise sharing assumes per-parameter independence (broke for conv vs FC — needed split LSTMs).

## Bench mapping (our wall)

- This is the "learn HOW to learn" half of the user's intertwined objectives — and its lesson is SOBERING for us: learned update rules transfer within a dynamics family and break across it. Our analogue: any learned selection/optimizer (inh, gate, scorer) is trained on ONE diet dynamics — expect ReLU-switch-style failure on new diets. Our U37 inh collapsed toward 0 (a degenerate learned rule); U38 gate saturated open (a degenerate learned policy).
- The w_t=1 choice is a methods gem: training signal on the WHOLE trajectory, not the endpoint. Our aux losses price endpoints (round-1/round-2 CE); nothing prices the TRAJECTORY (how loss falls across steps). A trajectory-shaped auxiliary (price monotonic improvement? price late-step accuracy over early?) is implementable without architecture change.
- Coordinatewise + separate-state is a design pattern for our per-head/per-region machinery: shared rule, separate memory per unit (cf. IAC's per-region experts, Brief 04 — same pattern, independently derived).
- The CIFAR label-subset transfer (train on held-out labels, test on disjoint) is the template for our remap-diet test (Briefs 01/02): train selection on mapping family A, test on disjoint family B.

## Concrete test + falsifier

- Test: trajectory-priced aux (weight late-step CE over early-step CE within the 800-step run, w_t ramp) vs flat aux, same budget. Bar: RET gain at quorum.
- Falsifier: family-transfer check — any learned rule (scorer/inh/gate) trained on diet X must be tested on diet Y with DIFFERENT dynamics; if it fails (ReLU-style), file the boundary (don't tune it away). This becomes a STANDING RULE for all future learned mechanisms: no learned rule ships without a cross-dynamics transfer test.
- Predicts: learned rules will look brilliant in-family and break cross-family — pre-register the transfer set BEFORE training the rule, or the "generalization" claim is void.
