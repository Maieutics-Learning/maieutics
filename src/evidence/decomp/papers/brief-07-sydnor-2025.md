# Brief 07 — Sydnor et al. (2025/26), "Investigating hierarchical critical periods in human neurodevelopment"

Source: `scratch/papers/sydnor.txt` (NPP review, full text). Review/synthesis: animal mechanisms + human neuroimaging + environmental sensitivity.

## Mechanism (the conserved cascade)

- Critical periods are PRIMED → OPENED → CLOSED by a stereotyped cascade: (prime) excitatory over-proliferation + thalamic drive dysregulate E/I toward excitation → (open) PV-interneuron maturation, perisomatic inhibition, GABA_A strengthening → (close) molecular BRAKES: perineuronal nets, myelin (+Nogo/MAG/OMgp), SynCAM1, Lynx1. E/I ratio falls throughout; activity desynchronizes/sparsifies; evoked-to-intrinsic SNR rises.
- All regulators act through the E/I ratio and PV cells. Enhancing PV/GABA opens plasticity early; silencing PV/GABA reopens it in adulthood. Timing is ENVIRONMENT-MODIFIABLE (dark rearing delays, enrichment extends, adult manipulations reactivate).
- HIERARCHY: same cascade runs LATER along the sensorimotor→association axis. Murine mPFC shows the full cascade in ADOLESCENCE (P16–P60): arborization/spines → PV density/intensity/firing → pruning → PNNs/Lynx1/myelin; chemogenetic PV inhibition P14–P50 (not adult) permanently impairs inhibitory drive.
- Functional signatures of an open period: falling E/I, synchrony-then-desync, rising evoked/intrinsic SNR.

## Human evidence (reviewed)

- In vivo correlates (neuroimaging of PNN/myelin/E-I proxies) + differential environmental sensitivity: lower-order regions sensitive early, higher-order (cognitive/socioemotional) in childhood/adolescence. Authors' conclusion: "compelling evidence" for hierarchical unfolding, but presence/timing/consequences in association cortex still unelucidated — a research program, not a closed case.

## Bench mapping (our wall)

- This is the BIOLOGICAL LICENSE for developmental schedules — the thing our bench has never tried. Every wave trains all parameters with one lr for 800 steps (monolithic plasticity). The cascade says: different circuit parts should be plastic at DIFFERENT times, with brakes that close windows.
- Concrete translations (no new architecture):
  (a) STAGED UNFREEZING: representation layers plastic early then frozen (PNN-analogue: zero their lr after step N); selection/scorer parts plastic LATE (association-cortex analogue). Our U34 priced compose during trunk training (everything plastic at once) — the cascade predicts interference; stage it instead: trunk first (frozen), composition/selection second.
  (b) E/I-analogue: our lam=2.0 mean-pull is a permanent brake; a SCHEDULED brake (weak early → strong late, per-head) mimics PV maturation. U35 tested capacity, never scheduled plasticity.
  (c) Reopening: adult plasticity reinstatement (silence PV → reopen) maps to brief re-warming of frozen parts when a new diet arrives — our frozen-trunk discipline (U32) never re-warms; a principled "critical period" protocol would specify WHEN re-warming is licensed.
- Functional signatures as DIAGNOSTICS: track E/I-analogue (head disagreement? mean-pull residual?) and evoked/intrinsic SNR over training; a healthy critical period should show high-then-falling plasticity metrics. Our ledgers log only loss curves — we'd need to log plasticity metrics per part over time.
- Caveat: review, human evidence incomplete; animal-to-bench mapping is analogy, must be priced as its own experiment, not assumed. Also cf. U1–U6: unfreezing shared trunk damaged prior behavior — consistent with "reopening without regulation causes damage," which is exactly what brakes are for.

## Concrete test + falsifier

- Test: two-phase schedule — phase A (steps 0–400): trunk + aux plastic, scorer/head-pull weak; phase B (400–800): trunk lr→0 (brake), scorer/selection parts plastic with full pressure. Vs single-phase joint (U34-style) same budget. Bar: COMPOSE/RET gain at quorum.
- Falsifier: reversed schedule (selection first, trunk second). If reversed matches, order is irrelevant and the cascade analogy is decoration; file scoped. If single-phase matches, staging adds nothing.
- Predicts: interference pattern — joint training should show trunk-metric regression when selection pressure turns on (measure per-part metrics across the switch; U34 never logged part-wise trajectories).
