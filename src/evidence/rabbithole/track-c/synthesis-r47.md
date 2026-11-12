# Synthesis R47 (log Waves 291–295) — exactness as evidence, confounds die by clamping

STOP RULE: queue-jump per rule 5 — backlog unchanged, state untouched, 0-fetch. 5 verdicts (Waves 291–295: 4 USED-strong W247/W248/W250/W251; 1 USED with teeth W249), no conflicts/precursors/SKIPs.

## What the five waves said

- W247 (rule-repair): the k-constant was never the issue — combo-2.5 valid 12/12 (fit + held-out, max FA .033) vs old 7/12; flat-2.5 11/12 (hole located); DET honest: parity-or-better 5/7 valid cells, −.16/−.19 in 2 dirty cells (price of full validity).
- W248 (return-blindness): drop/band ≤ .13 everywhere (10–20× structural — the signal isn't there); narrower bands detect 0/12; CUSUM/level delay-0 only with FAs; s66 invisible to all 9 candidates. Bill-based return detection CLOSED; fix must leave bills (dead-man).
- W249 (ignition-predictor): LOO-logistic AUCs collapse to exact 0.000 under every penalty — diagnosed as intercept artifact (fold base-rate logit-shift .137 dwarfs slope tilt) + slope instability (lam-proof, NaN-free). Honest rank-AUCs: prefix@200 .571 (K200 NOT usable — (a) FAILS badly), @50 inverted .292, trainAcc max .600@10; (b) direction holds, (c) holds-ish, (d) holds (+.279). LOO+intercept disqualified on n~30.
- W250 (budget-vs-veto): CAP240 rescues ALL S8 failures including consec .353→1.000 — pure exhaustion, no veto at pf≤.03 ((b) fails collapsively: the distinction doesn't exist here); PL8: S4=1.000 fast where S8 dies (frontier extends); rescue costs +2–15% wall; budget moots patience (all 1.000, nUp=9).
- W251 (absence-duration): prediction INVERTED — absence is a PROTECTION gradient (R=50/75/100 → .9167/.9667/1.000, anchors bit-exact); two poison loci (early-dose monotone .9633/.8367/.6367, threshold 10–25 steps; ON-during-setup-window ~26–100 interference); W275's dose-reading was early-dose-confounded; return value scales with the dose it follows.

## New convergences (4)

1. Exactness is evidence (W248 bit-identical trails; W249 exact-0s as confessions of plumbing; W251 three bit-exact anchors + predicted degeneracy receipt; W250 CAP120 reproduces W233 exactly): the round kept producing equalities, and every one turned out to be load-bearing — controls signing as results (R43's W275 rule holds a second round), zeros indicting the harness, reproductions licensing paired comparisons.
2. Confounds die by clamping (W251 clamps early dose → sign flips; W249 clamps the estimator → artifact isolated; W250 clamps the budget → ordering dissolves; W248 sweeps the detector space → closure): four different clamps, four upgrades. The method is now procedural: when a curve bundles two loci, fix one and re-read.
3. Failures that upgrade (W247's constant exonerated; W250's veto-failure nonexistent; W251's scar-prediction inverted into protection; W249's K200-usability badly failed): every rejected pre-reg this round returned a stronger claim than the pre-reg. A miss with a mechanism beats a hit without one.
4. Knobs, not backdrops (CAP dissolves the W233 frontier; absence-duration flips from dose to protection; setup-window placement decides interference): three waves found their background condition was the main effect. Budget, timing, and placement are not controls to hold fixed — they are the experiment.

## Kill/scope additions (9)

k-constant-as-cause, bill-series return detection (closed — dead-man only), LOO+intercept on n~30 (disqualified — rank stats only), veto-failure at pf≤.03 (closed — exhaustion only), absence-dose reading (superseded by protection gradient), 'consec is worst' unconditioned (overfit to CAP=120), early-dose poison threshold 10–25 steps, setup window ~26–100, W233 frontier as budget artifact (scoped). Siren ledger: no touches (truemask-help 10th round unclaimed — oldest resident).

## Pre-reg ledger

Running: 17-item backlog (W252–W268); oldest W252/W253. Rejections paid in public this round: K200-usable, consec-unrestorable (collapsive), short-absence-rescue (inverted), true-cure-.95 (inherited from W275, inverted). Open collateral: highest-yield W252 (ridge-top stress) and W265 (dead-man switch); waves W253–W268 (fifteen open, five spawned this round: W264 combo-jurisdiction, W265 dead-man, W266 LOO autopsy, W267 rescue-price, W268 setup-window interference).

## Spend / clock

Spend: 0 search + 0 fetch (sandbox grids + bench cells + per-fold dumps; one vendored rig). Clock: R47 0/5 (RESET).
