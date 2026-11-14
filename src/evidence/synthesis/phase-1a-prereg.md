# Phase 1.a + 1.f prereg v1.0 (FROZEN — countersigned by user 2026-11-13, 3k-step version stands)

Gameplan: v13 (§1.a arms i/ii/iv + staged reference; §1.f statistical setup runs first).
Inherits regime from `src/evidence/synthesis/cheap-tests/spec.md` v1.0 unless stated here.
Status: FROZEN. Runs may proceed exactly as specified; any deviation voids the
verdicts and requires a v1.1 amendment before adjudication.

## 1.f statistical setup (frozen here, before arms)

- Ignition gate (per student): killA ≥ 0.60 && Hd ≥ 0.55 (spec v1.0).
- Arm contrasts: Fisher exact (difference) + 95% Wilson CI for the DIFFERENCE
  in ignition rates. Zones: EQUIVALENT if difference-CI inside ±δ; SUPERIOR
  if it excludes 0 in the predicted direction; else INCONCLUSIVE.
- Margins: δ = 0.25 default for all 1.a contrasts (staged-vs-constant,
  staged-vs-instant-drop). Rationale: at n=8/arm the difference-CI half-width
  is ~0.35–0.45 for mid rates, so δ=0.25 only resolves near-deterministic
  splits (8/8 vs ≤4/8: Fisher p<0.05) — which is exactly what the design
  contrasts (ignition vs wall). No mid-rate hair-splitting will be claimed.
- Thresholds vs measured nulls (exact binomial, not a 0.5 coin): attn-only
  ≥4/8 excludes null ignition rates ≤0.10 (p≈0.005; hint-free wall is 0/32).
  At n=8 only 8/8 could exclude 0.5 (5/8 → Wilson (0.31, 0.86)), so
  rate-vs-coin tests are banned from the verdicts.
- Fresh-seed rule (plan-wide): confirmation = fresh seeds + frozen protocol.
  1.a arms ARE the confirmation (no pilot precedes them); no seed in this
  prereg appears in any other confirmatory count.

## Arms (all hardW=0, matching the G-series student recipe)

Per seed: one T0 tutor (HINTED 1200 steps, tutor seed = student seed, recipe
per cheap-tests (d)), then one 3k-step student per arm (4 arms × 8 seeds =
32 students ≈ 19 min wall + tutors).

- Seeds: 311–318 (fresh; disjoint from 301–305, G-series, and nursery runs).
- Tutor/pool (all arms identical): attn h48/m96/d16, vocab 9, classes 4,
  pool buildPool(7, ALLOWED12), exams buildExams(7008) r=4.
- staged (reference, re-run on the SAME 8 seeds + tutors — G-series 6/10 is
  context only, never the verdict input): attnKeep 1.0×1000 / 0.5×1000 /
  0.0×1000, softW=1.0.
- i. attn-only: softW=0, attnKeep staged (1.0/0.5/0.0 over 3×1000).
- ii. constant-combined: attnKeep=1.0 all 3k steps, softW=1.0.
- iv. instant-drop (r4): full hints (attnKeep=1.0, softW=1.0) steps 0–1500,
  zero hints after (attnKeep=0, softW=0). Second half is signal-free coast by
  construction (hardW=0 throughout) — the eval measures what 1500 hinted
  steps + coast built.

## Verdicts (frozen; adjudicated after the runs, no moving the bars)

- attn-only ≥4/8 igniting → fading rewritten as non-essential (exact binomial
  vs wall-null). attn-only failing → "hints insufficient alone," NOT
  "fading essential."
- constant-combined EQUIVALENT to staged (±δ) → schedule does no work;
  SUPERIOR staged → schedule causal; else INCONCLUSIVE.
- staged EQUIVALENT to instant-drop (±δ) → graduality inert, final hint-free
  state does the work; staged SUPERIOR → gradual process itself causal;
  else INCONCLUSIVE.
- If staged reference itself fails to ignite (≤3/8 — tutor/pool problem, not
  a schedule finding): no verdict on any contrast; diagnose tutor first.

## Records

Driver + ledgers beside results per promote-or-recipe:
`src/evidence/synthesis/phase-1a/` (driver `wave1-driver.js`, ledger
`phase-1a-results.json`, raw blobs). Paper inputs (1.e) fold verdicts only.

## v1.1 amendment (COUNTERSIGNED 2026-11-13 by user — FROZEN)

Stage 2 resolver for the two INCONCLUSIVE schedule contrasts: n=80/arm on
FRESH seeds 321–400 (disjoint from 311–318 and all prior runs), same 3k-step
protocol + tutor/pool/exams as v1.0, δ=0.25, Fisher exact + Newcombe
difference-CI, same zones. Arms: staged reference (re-run on the same 80
seeds + tutors) + constant + instant-drop (attn-only stays decided, not
re-run). Compute: GitHub Actions matrix, runner `src/lab/run-p1a.js`, spec
`src/pool/workflows/p1a-matrix.yml`. Stage 1 (n=8) stands as filed; Stage 2
is a pre-registered extension, not a re-peek. Full terms in
`src/evidence/synthesis/phase-1a/phase-1a-verdicts.md` §v1.1 (b-i).
