# P4 adaptation-mechanism mini-prereg v1.0 (COUNTERSIGNED 2026-11-19 — binds this run)

Filed pre-compute. This is the P4 ENTRY GATE artifact (GAMEPLAN.md §P4): the mapping
table + the transform + the level choice. Compute runs on this version only.

## Level choice: (a) INFERENCE-TIME ONLY (recommended, adopted)

Weights frozen everywhere (tutor and students train per-round under the frozen P2
recipe; no score-driven weight update exists in this design). Adaptation is emission
policy between rounds, and under frozen weights the policy is HARNESS-EXECUTED and
tutor-informed (R17 default): the harness owns the score→selection function, the
tutor's contribution is readouts + labels. All P4/P5 teaching claims attribute to
the TUTOR-HARNESS SYSTEM, never the tutor alone (R18); the same-harness ×
different-tutors contrast (below) isolates the tutor's contribution. Option (b) is
NOT proposed: no weight-level candidate exists (masked-value is glasses, refiled
P2/P3), and this prereg designs no outer loop.

## The score vector (closed — these fields and no others)

Computed per round from student-vs-tutor agreement (agreement, never correctness —
no-correctness rule carries over; hard labels wait for P6). Slice grid: 4 tutor
pseudo-classes × 2 length bands (short ≤20 / long 50) = 8 cells. Fields:

1. `delta[c,b]` — input-driven agreement, obs minus 20-perm baseline, per cell (8 numbers).
2. `n[c,b]` — train-line count per cell (8 numbers; coverage guard input).
3. `overall` — pooled input-driven delta (stop-rule input).

## Mapping table (every row: field → knob → who moves)

| # | Score/readout field | Teaching knob it drives | Who moves it |
|---|---|---|---|
| 1 | `delta[c,b]` per cell | Next-round sampling weights over cells (re-weight toward failed cells) | Harness (score→selection function §Transform) |
| 2 | `n[c,b]` per cell | Sampling floor: every cell keeps ≥5% of round-2 train lines regardless of failure (coverage guard; a cell trained to zero is an unmeasured cell, not a fixed cell) | Harness (floor inside the transform) |
| 3 | `overall` | Round budget stop: `overall` ≥ 0.40 after any round → HALT (nothing left to fix; ceiling call, not a pass) | Harness (stop rule) |
| 4 | Tutor labels + 5 readouts per line | Cache contents (soft targets) student distills | Tutor (frozen; emits, never adapts) |

Gate check: no knob without a driver (all three harness knobs trace to fields 1–3),
no driver without a knob (all three fields consumed by the transform/stop rule).
The tutor moves nothing between rounds — filed openly, that is what (a) means.

## Transform (the named computation, R11 — written down, not "policy adapts")

Default harness function (custom transforms must beat it by a preregistered margin;
none proposed). Inputs: the 8 `delta[c,b]`, 8 `n[c,b]`, uniform baseline weights
u = 1/8. Per cell:

```
need[c,b] = max(0, TARGET - delta[c,b]), TARGET = 0.30
raw[c,b]  = need[c,b] + FLOOR, FLOOR = 0.05
w[c,b]    = raw[c,b] / Σ raw   (round-2 sampling distribution over cells)
```

Round-2 train lines (500) are drawn from the adaptation pool remainder by `w`
(seeds filed below). WITHHELD arm: `w = u` (scores masked; must show no directed
change). SHUFFLED arm: same function fed the permuted score vector (values
permuted across the 8 cells; must NOT track shuffled values — kills "reacts to any
input"). TARGET 0.30 = the run-3 shorts bar (the strongest honest bar in the
program); FLOOR 0.05 = coverage guard. No other parameters; no hand-tuning per
seed (same constants all K seeds, ledger-verified).

## Toy loop (validation, NOT measurement — n=2 rounds, no gain bars, no crossed contrast)

- Tutors (frozen): E = d1a spelled blob (SHA ce8b97cf…ad1b3, killA 0.965; determinism
  checksum: recompute filed TE/TH anchors, ABORT on drift); N2 = rebuilt random init
  9102 (checksum [442,252,148,158] exact, else HALT). E-system = claim arm; N2-system
  = attribution contrast (same harness, swapped tutor).
- Students: fresh AttnModel inits, P2 combined recipe (soft-only on tutor cache,
  3000 stages {3000, attnKeep 0, softW 1, hardW 0}, batch 16). Seeds E-arm
  10201/2/3, N2-arm 10211/2/3 (K=3 each). No seed shopping (worst seed reported,
  never replaced).
- Lines (all fresh, disjoint from every P2/P3 seed by construction; ledger lists
  every seed for the P5 no-bleed check): Pool A adaptation (seed 10200, 1000 lines
  P2-spec vocab19 bands) — round 1 trains uniform-500, round 2 trains weighted-500
  from the remainder; Pool B held-out direction (seed 10260, 400 lines, never
  adapted on); Pool C anchor (seed 10270, 400 lines, E-labeled once, never adapted on).
- Round 1: students train uniform, score vector computed on train lines.
  Round 2: transform → weighted-500 (true / uniform / shuffled per arm), retrain
  FRESH students (no continuation — round-2 students are new inits, so round-2
  agreement is selection effect, not accumulation; filed choice, matches (a)
  semantics: the policy changed what got taught, not who learned it).

## Checks (exit bar = responsiveness AND direction, both required; R10 conjunction)

1. RESPONSIVENESS (per seed, 3/3 required): OPERATOR (R22) — permutation test
   (α=0.05) that round-2 sampling-mass shift from uniform is predicted by the TRUE
   score vector above the SHUFFLED-arm baseline; effect size = mass placed on
   below-median-delta cells (true minus shuffled). WITHHELD arm must show no
   directed change (|mass shift| ≤ 0.05). W TRIPWIRE: operator fails 2+/3 seeds →
   interface dead, redesign (not a fail-to-hide; the instrument is void).
2. DIRECTION (per seed, 3/3 required at δ): on Pool B held-out lines —
   `margin = agree(S2,E) − agree(S2,S1)`; teaching = margin ≥ δ = 0.10 (closer to
   tutor original than to student early-outputs); margin ≤ −0.10 = CAVE → FAIL even
   if agreement rose; inside (−0.10, 0.10) = INCONCLUSIVE (never upgraded to pass).
   Sensitivity reported regardless at δ/2, δ, 2δ; holds-at-exactly-one-δ = tuning
   artifact, not a finding. Under (a) weights never move so held-out discipline is
   satisfied by construction; Pool B disjointness ledger-verified anyway.
3. ANCHOR STABILITY (gate before direction): E pattern on Pool C self-consistent —
   E deterministic, pairwise similarity across the K seed-views ≥ 0.95 floor else
   DEGENERATE verdict, direction VOID (not failed). Expected trivially satisfied;
   filed because R20 allows no exceptions.
4. ATTRIBUTION (R18, part of the pass): system effect (E-system round-2 held-out
   agreement gain over WITHHELD ≥ +0.05, descriptive, not a bar) AND nonzero
   tutor-attributable variance: |gain_E − gain_N2| ≥ 0.05. Both or the line passes
   as harness-only (filed as such, tutor interchangeable).

## Expectation (numeric, scored at verdict)

Responsiveness operator 3/3 (the transform is a deterministic function of its
input — this check calibrates the operator, not a finding; a fail here means the
code is broken, and the W fires). WITHHELD null clean 3/3. System effect E:
round-2 held-out gain over round-1 ≈ +0.03–0.08 (reweighting toward failed cells
fights the run-3 lesson: failed cells are disproportionately the unlearnable
ones — proximity-bound transmission says the gain concentrates train-proximal,
and Pool B is all fresh). Direction: 2/3 seeds pass at δ=0.10 (thin-margin risk
owned: both S1 and S2 are E-cache students, so agree(S2,S1) starts high and the
margin must clear it). Attribution: HOLDS (E vs N2 mappings differ; direction of
the gap unknown, magnitude expected ≥0.05 — run-6 says N2-system gains can exceed
E's, which would still satisfy the variance clause while complicating the story;
filed openly).

## Pre-mortem

Strongest objection: the harness does all the adapting, so "responsive tutor" is
a category error even with the system-attribution discipline — answered by design
(the claim is filed as system-level from the first line; the tutor-swap contrast
prices exactly how much the tutor matters). Most likely failure: reweighting
toward failed cells teaches noise — failed cells under a weak tutor are
 disproportionately unlearnable (run-3 saturation + v4.5 positional lesson), so
the transform concentrates spend where the ceiling is lowest; guarded by the
FLOOR (coverage never collapses) and priced by the descriptive system-effect
readout (a zero gain with a passing operator is the honest "steers but doesn't
lift" outcome, not a failed run).

## Nearest-failure

P2-run-3 (reweighting intuition already tested and bounded): fresh-uniform gain
saturated ~0.25 regardless of train fit while recomb tracked proximity. This toy
loop differs in exactly one priced way: selection happens BETWEEN rounds on
scores (not fixed up front), so a pass here means score-driven selection beats
uniform where fixed overweighting saturated — the Pool B held-out leg is what
makes that claim instead of wishful thinking.

## Ledger + forward

Ledger: `src/evidence/p4/toy-loop.json` (seeds, pools, score vectors, weights,
agreements, margins, sensitivity triple; P5 no-bleed list: all seeds/lines/brains
above). Pass both checks → P5 opens on FRESH seeds/lines/brains (no-bleed;
under (a) no weights cross by design). Fail either → drop a level or retire the
adaptive line with the number. No P5 spend until both pass.
