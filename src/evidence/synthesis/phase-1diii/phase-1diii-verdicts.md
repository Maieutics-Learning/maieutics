# Phase 1.d.iv verdict (RUN 2026-11-14 on frozen iii ledger, no new training)

## Gate (prereg phase-1diii §§55–80)

- Replication gate: 8/8 BIT-EXACT (third replication of the recipe).
- Forward bit-compare: 8/8 STABLE.
- Pointer kill rule (§57A): ptrHit|correct on killA = 1600/1600 = 1.000 ≥ 0.90 → PASS.
- Calibration rule (§57B): pooled Δ = 0.255 ≥ 0.20 → SEPARATED.
- Overconfidence (§57C): mandatory disclosure, no gate — filed below.
- Non-claims (§90–95) respected: no causal or mechanistic claim here.

## Numbers (computed from `phase-1diii-results.json` rows, not aggs)

- Pointer: killA 1600/1600 (1.000), killHd 1454/1454 (1.000) given correct.
  killA accuracy 8/8 at 1.000; killHd accuracy 0.70–1.00 by winner.
- Calibration pooled killA+killHd: mean top1|correct 0.956177 (n=3054),
  mean top1|incorrect 0.701208 (n=146), Δ = 0.254969 → SEPARATED.
- Overconfidence (the honest number): pooled mean top-1 on errors 0.701208
  (n=146); 22.6% of errors ≥ 0.90. All 146 errors are killHd (killA 1600/1600
  correct). Driven by s313: killHd 0.70, error-conf 0.84, 51.7% errors ≥ 0.9
  (31/60); s313 pointer stays ON target on incorrect lines
  (wTarget 0.998 on incorrect — faithful citation + wrong answer).
- Attn-on-target: mean wTarget correct 0.993179 vs incorrect 0.981043.
  Pointer stays on target even when the answer is wrong — citation ≠ reason,
  exactly as the prereg warned.

## Ruling: DUMP-COMPLETE → CROSS-CHECK PASSES, no backprop audit opens

- Pointer defense is ADMISSIBLE at full strength as a cited-slot readout
  (perfect given correct, both exams). Bounds: admissibility is readout-only;
  the s313 case (on-target + wrong + confident) is the mandatory companion —
  pointer≠understanding, memorize-lean signature.
- Calibration signature holds (Δ=0.255). Ignition has a confidence signature;
  not claimed as ignition proof.
- Overconfidence travels: paper prints 0.701/22.6% + the s313 case.
- 1.d.i/ii (PyTorch re-runs) stay open as listed; nothing here preempts them.
  No ledger override, no tolerance invoked — same engine, bit-exact.

## Feeds

- 1.e.iii overconfidence paragraph ← disclosure lines above.
- 1.e.iv pointer-methods paragraph ← admissibility + bounds + s313 case.
- L0/L1 ← pointer + calibration; F-new ← wTarget-on-error + s313 signature.

## Cost

0 new training. Verdict computed from the frozen iii ledger in-worker.
Pool spend: 0.
