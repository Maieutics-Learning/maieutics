# Fresh-eyes battery: self U6 wound-repair (3x sealed, parallel via root.generateText)

Goal line carried in every prompt.

## R1 — NEEDS-PATCH
1. Gate-live leakage ambiguity: live gate chases repairing trunk at same lr5e-3 → GATE-REWOUNDS foregone. Fix: dual-LR (trunk 5e-3, gate 5e-4 or frozen first 200st).
2. Critic TELL dilution: BCE*0.5 drowned by CE on wounded trunk. Fix: critic-first warmup 50 steps or dynamic lambda.
3. Twin-match desync: skipping adapt breaks experience count. Fix: sample adapt, zero grads, advance RNG.
4. Optimizer ghost: U1 Adam momenta vs fresh reset shock. Fix: full optimizer reset explicit.

## R2 — NEEDS-PATCH
1. Critic dilution (same as R1.2): 0.5 insufficient on wounded bias. Fix: warmup 0-100st critic-only at 1.0.
2. Standard-only leakage: adaptY logic must be force-zeroed in loop, else live-arm test invalid.
3. Optimizer reset (same as R1.4): discard momenta, load raw weights only.
4. Stream-hash verification: log first-100 hash to prove twin-match.

## R3 — NEEDS-PATCH
1. Critic-trunk co-dependency: simultaneous train = moving target. Fix: staggered critic-lead to ≥0.70 before trunk BCE backprop.
2. Gate hides wound: live gate may shut to lower BCE, masking trunk. Fix: gate-symmetry eval — eval live arm with g forced 0 post-hoc.
3. Negative-overfitting: standard-plus-explicit-negative ≠ standard-only. Fix: null-signal random-BCE control (NEW ARM — parked U7).
4. Weight-hash: require hash match vs U1-end-state (adopt as log, not abort).

## Adjudication: 3 NEEDS-PATCH → v1.1 PINS (no new arms)
- ADOPT: full optimizer reset — repair is fresh Adam from wounded weights, not continuation (R1.4/R2.3).
- ADOPT: twin-match preserved — sample adapt episodes every step, forward-only, zero grads, RNG advances; log first-100 sample hash (R1.3/R2.4).
- ADOPT: critic warmup 50st critic-only (BCE weight 1.0, trunk frozen), then joint 800st with BCE*0.5 (R1.2/R2.1/R3.1 lite — staggered-lead without ≥0.70 gate which would need extra eval loop).
- ADOPT: live-arm dual-LR — trunk/compose/notebook 5e-3, RP (gate+critic) 1e-3 after warmup (R1.1; same split as U4 v1.1; prevents gate whipping).
- ADOPT: gate-symmetry eval — eval rep-live arm twice (as-trained + g forced 0 post-hoc); gap = hide-vs-rewound (R3.2, eval-only).
- ADOPT: standard-only enforced — adapt mask force-zero in train loop; adapt appears eval-only (R2.2).
- REJECT (park U7): random-BCE null-signal control arm (R3.3 new arm); weight-hash abort threshold (log only); critic ≥0.70 gate before trunk updates (extra loop, overkill for Stage-1).
- Raw replies: this chat tool result (3 verbatim above; no scratch raw — page_eval returned inline).
