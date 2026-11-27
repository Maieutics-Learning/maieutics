# U70-CTX causal diagram (2026-11-27; accompanies task spec v1.0 + oracle report)

Conventions: `→` causal edge (generative or computational); `do(·)` intervention the spec/prereg supports; `[dec]` design choice (U70 convention, grace=10); caps = measured oracle quantities. No paper licenses a threshold.

## Generative process (world)
- `c_t` (latent context ∈ {A,B}) → `goodArm_t` (contingency: A→L@0.8, B→R@0.8).
- `rho_t` (cue reliability ∈ {0.55,0.75,0.95}) → `k_t` (cue points at good arm w.p. rho).
- `m_t` (mask, Bern 0.10, independent) → `x_t` (observed cue: ∅ if masked else k_t).
- `c_t` → `switch events` (p_sw=0.02, dwell≥25, resampled) → future `c`, `k` (cue lags one trial after switch under high rho — the trap).
- Behavior policy (fixed, known): `a_t = x_t if present else coin` → `r_t ~ Bern(0.8 if a_t==good else 0.2)`. Under masking, random action makes REWARD informative (ambiguity condition, maskedAcc 0.94).

## Estimator (oracle — exact reference)
- History `(x,a,r)_≤t` → joint filter over 6 states (2 contexts × 3 rho) with KNOWN transitions/likelihoods → `p(c_t)`, `p(rho_t)`, `conf=max p(c)`.
- Derived: ctxAcc 0.95, ECE 0.06, delay med 2 (1 censored/85), FA 0.7/100 `[dec]` grace=10, rhoAcc 0.66, masked 0.94, misleading 0.90, low-rho 0.87, action gap +0.20 (posterior-action 0.95 vs cue-following 0.75).

## Estimator (neural — the claim under test)
- `(x,a,r)_≤t` → GRU `h_t` (history; must persist across masks/distractors) → discrete stochastic `z_t` (latent context variable) + `rho-head(h_t)` (reliability) → `p̂(c_t)`, `p̂(rho_t)` → action selector.
- Required generative grounding (battery R2/R9): `z_t,h_t` → reconstruction heads (`x̂`,`r̂`) so dynamics/representation KLs are well-defined; collapse monitors (KL, latent usage).
- Decodability ≠ causality: probe accuracy on `z/h` is INSUFFICIENT (U64 lesson). Causal edges tested by intervention (below).

## Interventions (`do`) and what they identify
1. `do(c switch)` @ recorded times → detection delay distribution + censoring; separates switch response from rho response (independent resampling by construction).
2. `do(rho level)` (low 0.55 stretches) → reliability tracking independent of context (rhoAcc/MAE vs ctxAcc dissociation).
3. `do(mask)` (masked stretches) → persistence: belief must survive cue absence (maskedAcc).
4. `do(mislead)` (cue-wrong trials) → recovery (misleadAcc).
5. `do(z:=shuffled/frozen)` at decision time → CAUSAL-USE test: posterior-guided action must drop toward cue-following (oracle gap +0.20 is the reference; prereg sets the neural bar). No drop = integration failure even with high probe accuracy.
6. `do(ablate rho-head / recurrence / z)` → component necessity (recurrent-no-latent and no-rho-head baselines).
7. `do(p_sw, dwell, grace)` sensitivity → FA/delay robustness (grace=10 locked; report 5/15).

## Failure taxonomy (maps to prereg verdicts)
- Representation failure: `p̂(c)` far below oracle (collapse / no persistence / miscalibration) — upstream of everything.
- Integration failure: `p̂(c)` good but `do(z-shuffle)` shows no action effect (U64e pattern: working downstream, dead upstream).
- Behavioral failure: belief good, causal effect present, but held-out/ambiguous action-acc below gate.
- Inconclusive: bars overlap, censoring heavy, or logging invalid (halt, re-run).
