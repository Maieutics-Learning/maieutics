# Fresh-eyes hard-v10 battery (3 sealed, 2026-11-24)

Raw: `scratch/fresh-eyes-hard-v10-3x.txt`. Spec: `src/evidence/decomp/hard-v10-prereg.md`.

## Raw R1 (math) — PASS
Hardest hole double carry-over cascade (q1 fail → q2 fail, can't separate time vs first-step). Fix: warm-start control (force correct q1, test q2 — zero train cost).

## Raw R2 (implementation) — IMPLEMENTABLE
Gaps: carry definition (c persists, not cleared — pinned), baseline anchor (clean re-read pinned to filed ledger versions). Test: single-seed fr-force double smoke (<10s).

## Raw R3 (rival) — UNVERIFIED
Rival fr-force vs steps. Killer double-query chain. Contains noise-floor (div-func floor) + double-confound (independent flats) + honesty (div-func floor control).

## Adjudication (agent owns verdict, 2026-11-24)

- R1 PASS, fix ADOPTED as eval variant (warm-start double: q1 pass uses true v for x2 + correct carry? Actually force q1 correct by using oracle x2 for q1, carry from oracle pass into q2 pass1 — isolates q2 time given good q1; no trains). Runs as third hard (within 10).
- R2 IMPLEMENTABLE, pins ADOPTED: carry c chains q1→q2 unbroken (pass1a→pass2a→pass1b→pass2b, no zeroing except c0 at start); clean baselines = filed eval ledgers (fr-force d-newai-fr-eval-*, div-boot d-newai-div-eval-*, cur-pick/rand d-newai-cur-eval-*); smoke single-seed fr-force double runs in driver log.
- R3 UNVERIFIED-contained: div-func floor + independent flats already in spec.

Amendment v10.1: warm-start double added; carry + baselines pinned. Zero trains. Score: 1 PASS + 1 IMPLEMENTABLE + 1 UNVERIFIED-contained.
