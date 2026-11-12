# Synthesis R51 (log Waves 315–319) — the teeth round: corrections that out-earn confirmations

STOP RULE: queue-jump per rule 5 — backlog unchanged, state untouched, 0-fetch. 5 verdicts (Waves 315–319: 4 USED with teeth W267/W268/W269/W270; 1 USED-strong W271), no conflicts/precursors/SKIPs.

## What the five waves said

- W267 (rescue price): wall240/wall120 1.00–1.18, consec premium +4–9.5% all groups; medians 106–128 (barely over) BUT frac>120 hits 12–65%, min-CAP(1.0) 143–198 vs .99 136–177 (last 1% costs +3–29); bisection==serves_needed 2700/2700.
- W268 (setup-window): ON placement .8367/.8933/1.000/.9933 — sensitive window narrows 26-100→26-50 (4x); ON26-100 .9667 BEATS ON26-50 (late ON heals or OFF-edge costs); +.1966 rescue replicates W295's +.20; receipts bit-identical.
- W269 (rejoin): diff(m.9) +.003→-.024 (rejoin costs ~.02, slice net-negative); new-blind m.95 wins cap.95 (8+12/24); m*==cap survives .95, stalls at 1.0 (2/4); cap1.0 ridge least-loss (0/24 wins everywhere); k* priced +.42–+.55; receipt exact.
- W270 (knobs): 3-bin {1,.04,0} capture 1.001 = quintile = per-dep (5→3 FREE); .04 gap 6.25e-5, split-half flips, argmin [.04,.058] (interval edge); halves-by-cap .652 (one joint crossing costs .349); receipt deep-equal.
- W271 (earliness): level .429/.812/.916/.999, 5/5 pre-regs; slopes never lead, combos +≤.005; LOO@100 .016 (pathology returns at n=64 — boundary is signal×n); W198: .8@200, .9@300.

## New convergences (4)

1. Medians lie, tails price (W267 median-barely-over vs 65% over-budget; W270 point-.04 vs interval [.04,.058]; W269 mean-ridge vs 0/24-wins least-loss): three waves where the headline number was true and the distribution behind it changed the decision. Report the quantile AND the price of the last percent, the argmin AND the flat bottom, the argmax AND the win count.
2. Quarter the locus (W268 window→quarters, three empty; W270 joints→knobs, third worth 6e-5; W269 seats→sitters, ladder moves): when a locus is confirmed, divide it — the sensitive part is a fraction of the confirmed range and the remainder holds the next surprise (healing late-ON, free third knob, least-loss ridge).
3. Borrowed structures keep paying (W268 +.20 third sighting; W269 three-rung seat rotation; W271 address-beats-feature): R50's license/confirmation and opposite-corner patterns recur without forcing — the run is converging, not repeating.
4. Teeth out-earn sweeps this round (4 of 5 verdicts correct the charter; all four corrections ship a number: +3–29 last-1%, 4x narrower window, -.02 slice, 6e-5 knob): a rejected pre-reg with a priced refinement beats a confirmed one — R51's product is almost entirely the difference between predicted and measured.

## Kill/scope additions (9)

median-only rescue budgeting (tail prices it), 26-100 window (26-50, 4x narrower), neutral-late-ON (mildly healing), effective-dose halves (absence halves it), live-retakes-ridge (blindness climbs instead), thin-slice tie (split stays split, .022+), top-ridge at k≤0 (priced +.4+), point-.04 (interval edge [.04,.058]), index-style halves anywhere (even one joint crossing costs .349). Siren ledger: no touches (truemask-help 14th round unclaimed — oldest resident).

## Pre-reg ledger

Running: 17-item backlog (W272–W288); oldest W272/W273. Rejections paid in public this round: frac<15%, min-CAP≤160, pure-window≤.90, big-dose≤.70, ridge-identity≥3/4, live-retake, thin-tie, ridge-k*≤0, point-.04, halves≥.9 — ten rejections, each with a priced refinement (the round's actual yield). Clean pre-reg sweep: W271 (5/5). Open collateral: highest-yield W272 (theta-D) and W282 (combo-guard); waves W273–W288 (fifteen open, five spawned this round: W284 tail-anatomy, W285 healing-vs-edge, W286 ladder-continuation, W287 necessity-audit, W288 tie-autopsy).

## Spend / clock

Spend: 0 search + 0 fetch + floors (deterministic recomputations, 144-world grid, 8-cell bench, refit ladders, earliness curve; two confounded checks owned and corrected en route: cross-arm receipt, pinned-IQR). Clock: R51 0/5 (RESET).
