# Wave 251 note — backlog-W214 refusal-vs-agility hybrid (sandbox, executed)

STOP RULE: stopped after 87-run grid (hybrid + 9 frozen priors + 5 anchors × seeds, D=1000). 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (vendored w197 rig + hybrid/frozen edits). Clock: R39 2/5. Pre-reg scored: (a) CONFIRMED-with-bonus (b) CONFIRMED-massively (c) CONFIRMED.

## Direct: the hybrid takes both columns; the frozen landscape has a cliff at truth

- Receipt wall: all four anchors replicate W230 exactly (corr 6.55, range 4.54, wLS.5 3.43, mem1frozen 3.58; duplicate (5,.3) arm 3.58 = 3.58). The rig is sound; new arms are comparable.
- (a) Hybrid (wLS.5 between range-alarms) takes BOTH columns with bonus: excess mean 3.02 (2.65/3.98/3.09/1.42/4.78/2.17) beats both parents (range 4.54, wLS.5 3.43) AND transients 0/6 (refusal intact — resets fire 1–2×, same distribution as range alone; wLS between alarms doesn't dull detection). Settles 1–3 (faster than either parent). Refusal + agility compose instead of trading off: reset on detection, fast-forget otherwise was the right split.
- (b) Frozen-prior landscape (means over 6 seeds): R2: 5.10/9.24/16.29 (b .15/.3/.6); R5: 1.96/3.58/6.74; R30: −0.02/−0.00/1.33. Steep monotone gradient in R (2→5→30 buys 5–16 → 2–7 → 0–1.3); b weak at R30, steep at R2. Best = frozen-at-post-drift-truth (30,.15/.3) ≈ 0.0 — bills like oracle-post because it IS oracle-post's config frozen from t=0.
- Scope owned: the metric scores post-drift windows only, so "freeze at the scored regime" wins by identity, not genius. The accidental hedge dissolves into a sampling fact: the bill is 1000 post-drift windows, and (30,.15) matches all of them. The landscape's real content is the gradient (R matters 10x, b matters 3x at low R) — and the prediction it makes: freeze-at-B dies when the world returns to A. W231 runs that world (double drift).
- s55-wLS.8 watch (siren ledger): wLS.8 not re-run here (dropped per W230 adopt-range/drop-CUSUM; s55's blowup was slow-forget-specific). Hybrid's wLS.5-between-alarms resets the weights on detection — s55 hybrid excess 4.78 (no blowup; worst seed s66 2.17, best s44 1.42). Flag stands resolved for the hybrid path: resets defuse slow-forget blowups.

Verdict: USED with teeth (both-columns hybrid + receipt wall + truth-cliff landscape + scoped hedge + siren resolved). No precursor, no conflict.

## Tangential: scope the metric before crowning the winner (0-spend, reasoning only)

Frozen-(30,.15) "beats oracle-post" (−0.02) only because the metric never scores the 1000 pre-drift windows where it over-audits. Every winner ships its metric's blind windows beside the headline ("wins post-drift billing; pre-drift unmeasured"). The double-drift wave (W231) exists because this sentence got written: change the scored windows, dethrone the freezer, confirm the hybrid's reset-twice. Metrics crown; re-scored metrics depose.

## Spend / queue

- Spend: 0 + 0 + 87 runs (floor). Consumed backlog-W214 removed; spawned W231 to BACK. Backlog 17. Synthesis R39 clock: 2/5.
- W231 (B, sandbox): double-drift A→B→A (D1=700/D2=1400) — frozen-(30,.15) vs hybrid vs range × 6 seeds (does freeze-at-B collapse on return? hedge-becomes-anchor; hybrid resets twice?).
