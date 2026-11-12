# W16 — OPD (acronym resolved) + degeneration warnings

## OPD = On-Policy Distillation ("A Survey of OPD for LLMs", 2604.00626; 171KB text, abstract + zones read)
- Dominant paradigm is OFF-policy: students train on static teacher data, never meet their own errors →
  exposure bias (d_D(s) ≠ d_π(s)) → compounding autoregressive errors. OPD: student generates own trajectories,
  teacher gives feedback on them (interactive imitation learning: DAgger/Ross).
- Unified f-divergence framework over on-policy samples; 3 dims: feedback (logit/outcome/self-play) × teacher
  access (white/black/teacher-free) × granularity (token/sequence/hybrid). Open problems incl. distillation
  scaling laws.
- Verdict: USED (strong framing). Our loop classified: students train on tutor-structured hinted data = OFF-policy
  early, shifting ON-policy as hints fade → the fade schedule IS off→on-policy annealing (DAgger-style, with the
  tutor as the expert). Exposure-bias lens PREDICTS our severance collapse (s608: never saw unaided states →
  errors compound) — and predicts F-singlegen's outcome. Second derivation of the same prediction = strong.
- Mechanism-precursor honesty (scout-level background, flagged): scheduled sampling (Bengio 2015, decay gold-token
  probability) is the same fading mechanism inside single-model training. Status = same as faded worked examples:
  idea old, our object (generational teaching + ignition) new. No full precursor. No conflict.

## Degeneration warnings (cultural-evolution)
- Kirby/Griffiths-Kalish primary (Princeton PDF) format-walled (scanned, 0 text blocks) — scout-level only:
  iterated Bayesian learning converges to the prior; bottleneck + expressivity pressure → compositionality;
  without pressure → degenerate/holistic systems.
- Verdict: COVERED, no new read needed. The warnings live in our trail three times over: W3 collapse paper
  (full read + conflict table), W8 RSI survey (collapse dynamics as failure mode), W13 em-comm (gibberish
  without incentives). Fourth citation adds nothing. C4 item closed by reference. Tag: redundant-coverage.

## C4 shelf: CLOSED (all items verdict'd)
SOAR / STOP+RSI / TOR+TBT / curriculum-extraction+fading / SGSD / SDFT / em-comm / CGAR+AZ / OPD+degen-warnings.
Remaining Track-C shelf: C6a lit (untouched) + paper-patch batch (F2/F3/RW-C3/RW-fading/F-grounded) + experiments
(F-shortcut/F-mech/F-singlegen/F-skillbank/F-deltanet/F-new) + continuous-fade branch + standing slot.
