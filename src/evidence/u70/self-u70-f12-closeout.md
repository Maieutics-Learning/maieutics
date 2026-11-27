# U70-F12 closeout — verdict F12-VERIFIED (calibration now measurable, 2026-11-27)

Execution: owner "countersigned" = execution on exact F12 v1.1 (ECE swap + `calBins`/
`calTrace`/`mce`/`meanConf` retention + E1–E4 gate; all else F11-exact: forcing Wc<-z-onehot
train+eval, ctxw 3.0, floor 0.05, repw 0.1, GRU64/Cat4-ST, BPTT-50, clip 1.0, 1 restart
init 90000+s, 200 epochs, Adam FLAT 3e-4, argmax eval). Drivers `u70-neural.js` + `u70-oracle.js`
+ F12 edits (formula swap in both evals, retention fields, E1–E4/E1–E3 blocks, f12 ledger tags,
F11 fields kept). E1–E4 logged PASS pre-smoke (oracle E1 zero, E2 valid-0.4-vs-old-0.05,
E3 determinism; neural E1–E4 incl. bin-sum/trace/recompute-1e-4). Smoke s0 clean
(loss 4.60->3.27 finite, probe 0.91, valid ECE 0.1996, bins sum 300, traces 300/300,
recompute drift 5.6e-5). Phase A oracle recompute 20/20 reads-only. Wave 20/20 rows,
0 invalid. Ledgers: `d-u70-oracle-f12.json`, `d-u70-neural-f12-smoke.json` (+pTrueTrace),
`d-u70-neural-f12-wave1.json`, gates `d-u70-f12-gates.json`, analysis `f12-analysis.json`.

## Numbers (valid ECE, n=20)

- Oracle recomputed: ctxAcc **0.9498** (unchanged — decisions untouched) / valid ECE **0.0208**
  (filed fixed-reference 0.0614 stands as measured-as-run) / MCE 0.2527 / meanConf 0.9498.
  The oracle is well calibrated on average with a worst bin gap of 0.25.
- Neural pooled: valid ECE **0.245974** / MCE 0.286015 / probe 0.7183 (12/20) / gap 0.1360
  (20/20) / ctx 0.8783 (16/20). The model is systematically UNDERconfident
  (meanConf ~0.69 vs acc ~0.88): accuracy without calibration.
- Paired F12-vs-F11 same-seed: dProbe **0**, dGap **0**, dCtx **0** (CIs [0,0] — bit-identical
  training; logging-only change behaves exactly as designed).
- Retention: 20/20 bins sum to T exactly, 20/20 traces length T, max recompute drift 7.2e-5
  (< 1e-4 tolerance).

## Verdict: F12-VERIFIED (primary met, per locked firewall)

Calibration is now MEASURABLE (valid ECE + MCE + bins + traces on both oracle and neural,
recomputable from ledgers). No claim about being calibrated is made — the neural wave is
substantially miscalibrated (0.246), and no bar was set in this wave by design. The G1
`ECE<=0.12` gate stays uninterpretable for all filed waves; filed `ece` values keep their
fixed-reference gloss. A future wave may propose a calibration bar FROM the recomputed oracle
valid ECE 0.0208 — that bar is not set here.

## Corrections logged (append-only)

- None to the prereg during execution. The v1.1 micro-patch (tolerance 1e-3→1e-4, hit_t
  definition, 4dp caveat) was battery-driven pre-countersign with 2/2 confirm; execution ran
  the patched exact version.
- Step-0 miss (agents-augment): this session's first calls read agents-augment per owner order
  before listing src/tools; Step 0 done late (tools listed + README read earlier this run;
  skills: eval-harness + memory; PRE-STEP check: nothing external). Logged same session.

## Follow-ups (each needs own prereg + battery + countersign)

- Calibration-bar proposal FROM oracle valid 0.0208 (gated; needs its own prereg — F12 sets
  no bar). Held-out split, z-recurrence wiring, unfamiliar-context probe, causal ablations,
  sharpened F3 (all unchanged). No Phase-2 in this wave. NO PUSH without order.
