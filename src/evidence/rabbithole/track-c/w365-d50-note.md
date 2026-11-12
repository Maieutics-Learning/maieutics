# Wave 365 (execution; backlog-W309 absorber-D50 probe, sandbox) 2026-11-12
STOP RULE: stopped after D50 world extension (DS2=[25,50] same build, 500
trials; D25 bit-identical receipt; D50 new; cls port pinned). 1 direct + 1
tangential below. Spend: 0 + 0 + run. Script scratch/track-c/w309-d50.js
(rig 37/37 line-verified from w190-shrink.js; driver mine, arbitrated by
receipts); grid scratch/track-c/w309-grid.json.

## Direct: the floor persists and the degen set doubles — clean sweep with censoring resolved

- RECEIPTS (double): D25 table (25 rows x 24 cols) + stars bit-identical vs
  w190-grid (maxDiff 0); cls-port pin 0.2/0 @D25 == "25:degen(m-0.006)" exactly
  (w292 value — the barL/barH/margin port is the validated port).
- Pre-reg 3/3: (a) PASS — 0.2/0 degen at D50 (m−0.008); (b) PASS — no lift
  (m−0.008 within [−.02,+.01]); (c) PASS — flat (Δ.002 from m−0.006).
  Degen-forever graduates from lean to finding: damage completes by D6,
  sits flat through D25, sits flat through D50 (44 delays, three readings,
  max |Δ| .008).
- Censoring cashed (the four D25-terminal dips resolve): 0.2/0.1 RETURNS
  (level m0.066 — ex-terminal readmit, extends the 100% ex-absorber readmit
  pattern to terminals); 0.1/0.05 + 0.1/0.35 PERSIST (degen m0.008/m−0.008);
  0.35/0.2 dips a THIRD time (D3+D25+D50, degen m0.014 — the dip-twice cell
  is a periodic dipper, not a slow absorber). 1 return + 2 persists + 1
  third-dip: every censored label converted, none hedged.
- Context: degen set 5→11 D25→D50 (newly: 0.05/0.1, 0.1/0, 0.1/0.1,
  0.2/0.35, 0.35/0, 0.35/0.05, 0.35/0.35 — the high-r/high-q edge keeps
  falling with delay; churn geography extends). hebbFrac .429; tie theorem
  maxTie=0 holds at D50 (gamma-variants still tie base exactly).
- Verdict: USED-strong (w365-d50-note.md is this file). 3/3 pre-reg + double
  receipt + four censored terminals resolved + floor flat across 44 delays.
  Spawned W326 (dip-thrice autopsy, zero new sims: 0.35/0.2 margins D0..D50
  — periodic dipper or slow absorber; dip interval; 0.2/0.1 return path).

## Tangential: censored labels are predictions with addresses — schedule their resolution (0-spend)

W324 flagged four terminals "censored" and W309 was spawned FOR them; the
flag carried its own resolution date (D50) and D50 paid it (1/2/1 split —
not the uniform outcome either direction would have predicted). Rule: a
censoring discipline that doesn't schedule its own resolution is hedging
with extra steps — every "censored" label ships with the measurement that
uncensors it (which delay, which cell, what both outcomes would mean).
W326 inherits the habit: the 0.35/0.2 third-dip label says what D75/D100
would confirm or kill.
