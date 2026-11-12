# Wave 226 note — backlog-W193 cut-later + longer + rescue (bench, executed)

STOP RULE: stopped after 24-run grid (cut80/100 x6 →1200 + cut50 x6 →2000 + rescue@400 x6 →1200, 8/10-pt trajs). 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (w176 rig + cut/restore params; live-page TinyNN). Clock: R35 1/5.

## Direct: recovery holds, 1200 was enough, rescue works on everyone — debt is a flow

- cut80 →1200: .807/.843/.88/.967/.657/.943 (ignite 3–4/6). cut100 →1200: .833/.97/.907/.89/.853/.993 (ignite 5/6). Post-onset recovery HOLDS to 1200 ✓ — erosion continues but takes only the sub-marginal (s7 .93→.833, s11 .963→.853). Later cut → more ignition (50: 8/12, 80: ~4/6, 100: 5/6); s10 (cut50-flat-loser) ignites under cut80 (.967) — setup-slow seeds need the longer window (W214 unifier: setup-by-70... or 80).
- cut50 →2000: s7 .75→.74 flat, s10 .64→.65 flat, s11 .837→.703 erode, s16 .99→.927 holds, s17 .937→.703 un-ignites, s18 .41→.38 dead. ZERO late ignition ✓ — 1200 was enough (3x rule self-application passes); erosion is slow, margin-dependent, and never reverses sign into ignition.
- rescue@400 (cut50/restore400): s7 .747→.963, s10 .637→.97, s11 →1.0, s16 →1.0, s17 →.973, s18 .413→1.0 — ALL SIX re-ignite by step 600, including dead s18 (flat .41→1.0). Rank-prediction (eroders > flats > dead) REJECTED. NO critical period by 400 — aux-presence, not timing (W214's 150–250 window extends past 400). Mechanism decider: W205's "permanent losers" = permanent aux-ABSENCE effect, fully reversible — debt is a FLOW (350 aux-free steps leave no damage: s18 returns to 1.000), not a stock.

Verdict: USED with teeth (reversibility + no-critical-period + self-passing 3x rule). No precursor, no conflict.

## Tangential: flows reverse, stocks don't — test which before pricing the debt (0-spend, reasoning only)

Had rescue failed on s18, debt would be a stock (damage accumulates; price = compensation for time-lost). It succeeded fully, so debt is a flow (price = current aux-absence only; no history penalty). The flow/stock cut decides whether interventions must be early (stocks: critical periods, deadlines) or merely present (flows: restore anytime). Every "permanent X" verdict now owes a restore-probe before the permanence claim ships — W205's permanence was aux-conditional, and the condition wasn't tested until this wave. Cheap rule, applied forward.

## Spend / queue

- Spend: 0 + 0 + 1 grid (24 runs; floor). Consumed backlog-W193 removed; spawned W210 to BACK. Backlog 17. Synthesis R35 clock: 1/5.
- W210 (A, bench): rescue-window + re-cut stickiness — restore@{600,800,1000} on s18-class dead (is there ANY critical period); restore-then-re-cut (does re-ignition survive a second cut — stickiness of rescued state); minimal rescue duration.
