# U70-CTX task generative specification (frozen 2026-11-27)

Working label U70 (directive's "U60" is TAKEN by the dead substrate-detector
family — collision filed in CHATLOG 2026-11-27). Deliverable-phase artifact:
spec + oracle + identifiability report. NO bars, NO verdict — numbers inform
the future prereg's gate-setting; gates are set there, not here.

## Task (small POMDP; 2 latent contexts; independently manipulated factors)
- Trials t = 1..T, T = 300, seeds s = 0..19.
- Latent context c_t ∈ {A, B}. Switches: per-trial flip w.p. p_sw = 0.02,
  min dwell 25 (switch times violating the dwell are resampled — recorded).
- Contingency: under A arm L pays w.p. 0.8 (R 0.2); under B flipped.
- Cue: each trial shows recommendation k_t ∈ {L, R} pointing at the
  currently-good arm w.p. rho_t, else at the bad arm. Reliability rho_t ∈
  {0.55, 0.75, 0.95} (discrete levels — exact filter). rho resamples w.p.
  p_rho = 0.03/trial to uniform over the other two levels (independent of
  context switches by construction).
- Observation noise (independent factor): w.p. eps = 0.10 the cue is masked
  (x_t = ∅, uninformative). Masking is independent of (c, rho).
- Behavior policy (fixed, known to oracle): follow cue if present, else coin
  flip. Rewards are Bernoulli under the contingency. Under masked trials the
  random action makes the reward informative — the ambiguity condition.
- Combos that defeat single shortcuts: low-rho stretches (cue near-chance),
  masked stretches (no cue), misleading trials (cue points wrong — frequent
  when rho = 0.55), context switches under high rho (cue lags one trial).

## Streams (mulberry32, filed)
- pathRng(70000+s): context path + reliability path (pre-generated).
- obsRng(72000+s): cue/mask/action/reward draws during the run.

## Oracle (exact — `u70-oracle.js`)
Joint HMM forward filter over 6 states (2 contexts × 3 rho levels), uniform
prior, known transitions (p_sw, p_rho), known likelihoods (cue|mask/rho,
reward|action/context). No learning, no approximation — the identifiability
ceiling.

## Metrics (per seed + pooled; descriptive, no bars)
ctxAcc (argmax vs true), ECE (10 bins on max posterior), detDelay (trials
switch → P(true)≥0.75 first hit; censored at dwell, count censors), FA/100
(P(wrong)≥0.75 outside 10-trial post-switch grace), rhoAcc + rhoMAE (posterior
mean vs true), maskedAcc, misleadAcc (cue-wrong trials), oracle-action vs
cue-following accuracy (functional-use demo), low-info accuracy (rho=0.55).
Ablations (recurrent/latent/rho-head) belong to the NEURAL phase, not the
oracle — stated here so no red need flag it.
