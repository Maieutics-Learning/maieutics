# W184exec — hint-fade on len10 (A; backlog-W158)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + 1 bench grid: 6 schedules × 3 seeds, floor)
- Custom loop (trainModel has no schedules): per-step auxW from schedule fn, prefixLabels aux inlined (verified pattern ex W176), SeqModel parity6, 400 steps, r-mix.
- The cliff (const0, len10): .713/.547/.617 (mean .626) — no-hint models stall halfway up. Every hint schedule ignites it: const1 .974, linear .971, cosine .965, step .949, late .985 (means; all cells ≥.893). Hint-vs-no-hint ≈ +.35; fade-vs-constant ≈ tie (−.003 linear, −.009 cosine, −.025 step — all within seed spread).
- Late-start observation (UNCLAIMED, n=3): hint-only-second-half .985 tops the table (.973/.983/1.000). Gap to linear (+.014) is within seed noise — recorded as the W175 question (powered-n late-vs-full), not a finding.
- Verdict USED (thesis applied to the cliff: hint-fade ignites len10; fade shape second-order; removal doesn't collapse). No precursor, no conflict. Hint-dose response (auxW {.1,.25,.5,1} × fade/const; minimal sufficient hint) spawned W175.

## Tangential (reasoning, 0 spend)
- The cliff was never a wall but a toll road: no-hint pays full price (.626), any hint schedule pays ~nothing extra for the fade itself. Fading isn't a sacrifice of the ignited for the pure — it's keeping the receipt after the purchase. Schedules argue about pennies on a +0.35 gain.

## Spend / queue
- Spend: 0 + 0 + 1 bench grid (floor). Consumed backlog-W158 removed; spawned W175 to BACK. Backlog 17. Synthesis R28 clock: 1/5.
