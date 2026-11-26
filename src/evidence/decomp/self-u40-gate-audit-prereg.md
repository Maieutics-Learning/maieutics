# U40-GATE-AUDIT prereg v1.1 — full-step gate integration audit (measurement only)
Battery: 3x sealed (R1/R3 IMPLEMENTABLE, R2 NEEDS-PATCH) → pins P1a–P1c applied
this version. Full battery in src/evidence/decomp/fresh-eyes-self-u40-gate-audit-3x-results.md.
Pin resolutions: R1-P1a (rename connected-but-constant to WIRING-FAILURE)
REJECTED as mislabeled — the verdict tree already separates U1 (connected?) from
U3 (varies?); connected-but-constant is INPUT-STARVED by definition, correctly
handled. R1-P1b ACCEPTED (P1a). R2-P1a PARTIAL — no grad-variance baseline
exists so arbitrary 1e-8/1e2 gates rejected; substance kept as displacement
cross-check (P1b). R2-P1b MODIFIED — 0.01–1.1x is batch-noise-fragile at B=16;
window set 0.25–4x (P1c). R3-P1a REJECTED — INPUT-STARVED must NOT mark history
suspect (no bug found); SUSPECT-STEP fires on INTEGRATION-BUG only.

Cause: U39 B3 BLIND-EVEN-ON-ZEROS 3/3 (gate ~0.75 open on zeros, swapped, and
clean alike) halted Wave-C. U38 Wave-0 isolated gate gradcheck passed, but that
check is vacuous for this step lineage (U35 D1: full-step finite-diff vacuous;
isolated-term gradcheck cannot catch wiring/plumbing bugs). B1 NO-SIGNAL
suggests an input-side explanation, but a dead integration must be ruled out
first — if the step never actually moves the gate, every gate verdict to date
(U38 GATE-DEAD included) is void and must be re-run under a corrected step.

Filed inputs (read-only): d-newai-self-u38-c1-s{0,1,2}-800st.json (Gate0/Gate/
gateCurve/P), stack pin 258d2f06. CPU/in-worker. NO training of any kind
(no opt.step anywhere; forward + analytic backward reads only). NO PUSH.

## U4 — ledger forensics (pure JSON, runs first)
For s in 0,1,2: max|Gate − Gate0| and gateCurve b/wMean trajectory.
MOVED if max|diff| > 1e-3 on ≥2/3 seeds; else FROZEN-AT-INIT → INTEGRATION-BUG
(opt.plist never contained gate, or grads zeroed before step — file cause,
halt U1–U3, verdict INTEGRATION-BUG, no further compute).
New ledger: d-newai-self-u40-audit-u4.json.

## U1 — wiring (frozen u38-c1 P + filed Gate, N=500 rows, R=3)
Per row: fw2 logits with filed-g cGated vs with g≡1. Influence =
mean|Δlogits| over rows.
CONNECTED if influence > 1e-6 on ≥2/3 seeds; else DISCONNECTED (gate output
does not reach fw2 — wiring bug, verdict INTEGRATION-BUG).
Ledger: d-newai-self-u40-audit-u1-s{seed}.json.

## U2 — grad-flow (same weights, small batch B=16 from train stream, R=3)
Analytic gate grad norm via one u38TrainOneStep-equivalent backward with
params=[] (no step — reads only; trunk .g fills but is discarded, weights
untouched; assert FROZEN-EXACT 0.0). Finite-difference: perturb gate.b by
±1e-4, batch loss slope, then RESTORE gate.b bitwise and assert equality before
any further probe (P1a — in-memory M is reused across probes in-process).
AGREE if 0.25 < analytic/FD < 4 on ≥2/3 seeds (P1c — B=16 batch noise floor;
0.01–1.1x would false-BUG); else GRAD-DEAD (gate path gradient does not flow
— verdict INTEGRATION-BUG). Additionally file the analytic gate-grad norm and
cross-check against filed displacement: if grads are healthy-size
(norm ≥ 1e-4) yet max|Gate−Gate0| < 1e-3 over 800 filed steps, mark
OPT-NOT-DELIVERING (opt-side delivery failure — verdict INTEGRATION-BUG even
though U4's move-bar passed) (P1b).
Ledger: d-newai-self-u40-audit-u2-s{seed}.json (includes frozenExact).

## U3 — bias-dominance (same weights, N=1000 matched/swapped/zeros, R=3)
Decompose s = b + w·inp per condition: report b, mean/std of w·inp, and range
of s across conditions.
INPUT-STARVED if range(s) < 1.0 logit on ≥2/3 seeds (sigmoid cannot move —
gate is a constant; explains BLIND + B1 without any bug).
LIVE-INPUT otherwise (gate *could* move — failure is pressure-side).
Ledger: d-newai-self-u40-audit-u3-s{seed}.json.

## Verdict
d-newai-self-u40-verdict.json: per-probe outcomes + one of
INTEGRATION-OK (U4 MOVED + U1 CONNECTED + U2 AGREE; then U3 decides next step:
  INPUT-STARVED → redesign gate input, D5 dead, B1 confirmed;
  LIVE-INPUT → pressure-side failure stands, un-halt Wave-C D5 under existing prereg)
INTEGRATION-BUG (any of U4 FROZEN-AT-INIT / U1 DISCONNECTED / U2 GRAD-DEAD /
  U2 OPT-NOT-DELIVERING;
  cause filed; all gate verdicts U38/U39-B2/B3 marked SUSPECT-STEP; fix requires
  a new step prereg, never a silent patch).
Quorum 2/3. No tuning: gray/edge values file as filed with exact numbers.

## Bars recap (all pre-filed)
U4 max|Gate−Gate0|>1e-3 · U1 influence>1e-6 · U2 0.25<analytic/FD<4 + restore-assert
  + grad-norm vs displacement cross-check · U3 range(s)≥1.0 logit. FROZEN-EXACT 0.0 asserted wherever backward runs.
