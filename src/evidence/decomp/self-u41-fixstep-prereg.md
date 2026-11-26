# U41-FIXSTEP prereg v1.1 — corrected u38 step (single /B) + gate retrains
Battery: 3x IMPLEMENTABLE → pin P1a applied (displacement ≥ 1.2× filed; R3-P1b
rejected — mismatch logging would break eval-instrument verbatim comparability).
Full battery in src/evidence/decomp/fresh-eyes-self-u41-fixstep-3x-results.md.

Cause: U40 localized INTEGRATION-BUG — filed u38 step divides round-2 carry +
gate grads by B twice (dMean2 already /B, then dcC/dcTot/gate lines /B again;
u32/u34/u36 pass dc undivided). Gate + round-2 supervision ~13x underweight in
ALL u38 trains (c0 + c1). Fix: divide once. NO other recipe change (C6/auxW0.5/
800st/lam2.0/B16/lr5e-3/K5/H48/diverse-diet+12.5% mismatch/Adam/gate init zeros).
Stack pin 258d2f06. CPU/in-worker. NO PUSH.

## Wave-0 — corrected-step verification (no trains)
New ledger d-newai-self-u41-wave0.json:
- Twin determinism: fresh stack s0 + 1-step dry-run ×2, exact 0.0 (same-stream rule).
- Batch analytic-vs-FD on gate.b (U40-U2 instrument, corrected code): ratio R0.
  Bar: 0.5 < R0 < 2.0 all 3 seeds (closes U40's 10.6–15.3 wobble: exact factor filed).
- Single-row FD exactness spot-check (2 rows): ratio 1.000 ± 0.01.
HALT if any bar misses (do not train on an unverified step).

## Wave-1 — 6 retrains, corrected step (the ONLY trains)
Paths d-newai-self-u41-{c0,c1}-s{seed}-800st.json. Fresh stacks, same seeds/
streams as u38 (twin-matched comparability). Gate init zeros (D-e carried).
FROZEN nothing (full trunk + gate train, like u38). Bars: COMPLETE 6/6.

## Wave-2 — 6 paired evals (u38 eval instrument verbatim: scr/two/twoOpen/
oracle/fwd/low + gate stats)
Paths d-newai-self-u41-eval-{c0,c1}-s{seed}-800st.json. Bars: COMPLETE 6/6.

## Verdict d-newai-self-u41-verdict.json
- FIX-CONFIRMED if Wave-0 R0 in 0.5–2.0 (3/3) AND gate displacement ≥ 1.2× filed
  u38 displacement (P1a — with 16× grads this stays a sanity check, but no
  longer a pure auto-pass: a fix that moves the gate LESS than the buggy run
  is no fix).
- Comparison table (report-only, NO tuning): scr/two/oracle/low + gate
  (gClean/gSwap/shut-rate) corrected vs SUSPECT u38, per seed.
- License: shut-rate > 0.2 on swapped (quorum) → D5 UN-HALTED under existing U39
  prereg (needs fresh countersign); else gate story continues input-side (B1 +
  U3 direction: redesign gate input, new-input prereg).
- Deviations from u38 recipe: exactly one — single /B on carry + gate paths.
  Everything else byte-identical logic (driver diff filed in ledger).

## Bars recap: W0 twin exact 0.0 · R0 0.5–2.0 (3/3) · single-row ±0.01 ·
W1/W2 COMPLETE 6/6 · displacement ≥ filed · D5-unhalt shut>0.2 quorum.
