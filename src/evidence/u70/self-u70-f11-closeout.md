# U70-F11 closeout — verdict REPAIRED (corrected code meets both bars, 2026-11-27)

Execution: owner "countersigned" = execution on exact F11 v1.1 (forward-exact one-hot + pure-shuffle
read + factored jacobian + T1-T4 gate + epoch-loss logging; all else F4-exact: ctxw 3.0, floor 0.05,
repw 0.1, Adam 3e-4 + clip 1.0, 200 epochs, 1 restart). Driver `u70-neural.js` + F11 edits.
T1-T4 logged PASS pre-smoke (T1 200 draws strict; T2a jacobian properties + T2b 284/284 encoder
weights moved; T3 binarity+mapping; T4 determinism). Smoke s0 clean (loss 4.60->3.27 finite, probe
0.91, corrected gap 0.17). Wave 20/20 rows, 0 invalid. Ledgers: `d-u70-neural-f11-wave1.json`
(+ `*-smoke.json`), gates `d-u70-f11-gates.json`, analysis `f11-analysis.json`.

## Numbers (corrected code, n=20)

- probe pooled **0.7183** (12/20 >= 0.70 — pass) / gap **0.1360** (20/20 — pass) / ctx **0.8783**
  (16/20) / usage 0.5-1.0 / KL raw ~0.03 (unchanged regime).
- Paired corrected-vs-filed-F4 same-seed: dProbe **-0.0008** CI [-0.0057,+0.004], dGap **-0.0002**
  CI [-0.0044,+0.0041], dCtx **-0.0012** CI [-0.006,+0.0036]. All three CIs centered on zero.
- Catastrophes: same 4 seeds (2,6,7,8). The graves are correction-proof.

## Verdict: REPAIRED (both absolute corrected bars met, per locked firewall)

The filed F4 FIXED survives correction essentially intact: probe 0.7192->0.7183, gap 0.1362->0.1360.
The leak-size read is ~zero at pooled AND per-seed level — the filed gap was hard-category use all
along, not posterior leak-through. The audit's blocking worry is answered the good way: the wins
were real, the impurity was cosmetic.

## Caveat (descriptive, headlined — does not move the verdict per firewall, but sharpens F3)

Detection got slower AND rarer: detected switches 13/20 -> 2/20 (delay-med 10 -> 9.5 on the two
that still detect). The graded carrier was load-bearing for detection SPEED though not for
accuracy/gap. The discrete dial is accurate-but-slow to flip. This was already the queued F3
territory (detection-speed diagnosis); F11 sharpens it: speed lives in the graded path the repair
removed. F3's auxiliary-switch-loss idea now has a before/after pair to train against.

## Corrections logged (append-only)

- T2 finite-difference form VOIDED (mathematically inapplicable to ST — true forward grad is 0 a.e.
  by design; a literal T2 would HALT every run, including correct ones). Gate role preserved by
  T2a (exact-function property tests) + T2b (signal vitality: 284/284 encoder weights moved).
  Prereg v1.1's locked elements (2-line fix, bars, verdicts, firewall) untouched; the corrected test
  is stricter in effect (actually runs vs spuriously halting). Battery's demand (prove the surrogate
  survived) is met, its proposed form was not.
- Filed F4/F10 numbers stand as measured-as-run; their "discrete-latent" gloss is now re-labeled
  "graded-carrier" for the filed waves, "discrete" only from F11 on.

## Follow-ups (each needs own prereg + battery + countersign)

- F3 detection-speed, sharpened (graded-path auxiliary loss; before/after pair now exists).
- ECE reimplementation, held-out split, z-recurrence wiring, unfamiliar-context probe (unchanged).
- F10 re-vote under corrected code is NOT run (would be a new wave; vote logic unchanged by F11,
  but member weights would differ — needs its own prereg if wanted).
- No Phase-2 in this wave. NO PUSH without order.
