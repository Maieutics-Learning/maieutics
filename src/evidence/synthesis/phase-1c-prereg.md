# Phase 1.c cross-family probe prereg — v1.0 DRAFT (pending user countersign to freeze)

Status: DRAFT. No runs authorized. Pilot (n=4) is exploratory; full (n=8)
runs only after countersign + pilot feasibility showing transmission is
measurable (not necessarily passing — measurable).
Parents: 2b parity regime (gated + per-step running-parity labels → 100%
len-10, 100% len-20); 1.a/1.b prereg discipline (fresh seeds, frozen
protocol, measured nulls, difference language where contrasts are drawn).
Same engine only (tinynn in-worker; cross-engine verdict-stable only).

## Why (the gap this fills)

Q5: is fading transmission lookup-local or does it carry across families?
Assoc says soft targets carry transmission (1.a). Parity is the in-house
contrast: procedural (recurrence computes a function of the past) where
2b already shows structure-matched generalization without lookup. If fade
transmits here too, the mechanism is not an addressing quirk. If it fails
here while passing on assoc, the scope boundary is informative — not a
failure of the program.

## Targets (frozen on countersign)

- Task: `TASKS.parityR` (running-state parity; train len 3–6, test len 10
  + len 20). No new task design — refused as sprawl (Conventions:
  new dial beats best fiddle or it doesn't ship).
- Hinted regime (tutor + staged student, mirrors 2b): gated cell +
  per-step running-parity supervision as the hint channel (auxW staged
  1.0×1000 / 0.5×1000 / 0.0×1000, hardW=0 throughout — same fade shape as
  1.a staged, transplanted onto the parity hint channel).
- Wall (hint-free control): same model, auxW=0 all 3k steps. Expected 0/4
  pilot (2b: outcome-only supervision memorizes, chance OOD) — measured,
  not assumed.
- Transmission (faded student): same staged fade as hinted, fresh init,
  distilled from the hinted tutor (soft targets where the architecture
  emits them; exact distillation target locked from the pilot — pilot may
  surface that parity needs a different target than assoc soft-CE; if so,
  the prereg is amended to v1.1 BEFORE the full, never after).

## Exams + conjunctive bar (task-native, frozen)

- Long-length accuracy: len-10 (in-family long) + len-20 (3× train max).
- Flip-one-bit consistency: flip one input bit of a len-10 string, label
  MUST flip (rule test; memorized tables fail at chance 0.5).
- Ignition (per student, conjunctive): long-acc ≥ 0.80 AND flip-consistency
  ≥ 0.80. Both must hold — mirrors killA && Hd (accuracy + rule-use).
- Seeds: pilot 901–904 (n=4); full 911–918 (n=8, FRESH, disjoint from pilot
  and from all prior: G-series 201–608, H, 1.a 311–318). Pilot seeds never
  enter confirmatory counts.

## Decision rules (frozen)

- Pilot: feasibility only. Reports hinted rate / wall rate / faded rate
  descriptively. Proceed to full iff hinted ignites (≥3/4) AND wall holds
  (≤1/4) — i.e. transmission is measurable. Faded pilot rate does NOT gate
  (exploratory).
- Full bar: ≥5/8 igniting excludes null ignition rates ≤0.25 (exact
  binomial p≈0.027; hint-free null measured in pilot + 2b wall). Screening
  bar against measured nulls, never a coin test (r5). 4/8 or below =
  lookup-local (or parity-fade mismatch — distinguished by the hinted
  control: hinted failing means tutor problem, not transmission finding).
- No mid-rate hair-splitting: 5/8 is the line, CIs reported, Fisher exact
  where contrasts are drawn (δ from 1.f).

## Doubt instruments (standing, Conventions)

- Expectation (numeric, scored at verdict): hinted 4/4 pilot, wall 0/4
  pilot; full hinted 8/8, wall ≤1/8, faded 5–6/8 (procedural carries more
  easily than lookup — weaker teacher-dependence than assoc's 6/10).
  Author track record: 1.a staged 76/80, 1.d pointer 1600/1600 — calibration
  historically tight, overconfidence disclosed not hidden.
- Pre-mortem (strongest objection): parity needs no teacher (2b outcome:
  direct per-step supervision already gives 100% len-20) — fading may be
  redundant here, and a null transmission result would be a ceiling effect
  (everything ignites, including wall) rather than a scope boundary. Killed
  by: the wall control (auxW=0 must hold ≤1/8) + flip-consistency (direct
  supervision can memorize long strings without the rule; the conjunctive
  bar requires the rule).
- Nearest-failure: 1.a δ bug (unachievable margin at n=8) + 1.b ρ-at-ceiling
  (rank-correlation vacuous on flat grids). This prereg avoids both: no
  correlation condition, margins from 1.f, bars against measured nulls only.
  If long-acc sits at ceiling for all arms, the verdict says so and leans
  on flip-consistency — the informative channel — rather than grading noise.
- W (what would prove this wrong, pre-hoc, scored): full faded ≥5/8 AND
  wall ≥5/8 (no wall — everything learns without hints, transmission
  vacuous); or hinted ≤3/8 (tutor broken, no verdict on transmission).

## Failure / stop rules

Wall ignites (≥2/4 pilot) → halt, diagnose tutor (no transmission question
exists without a wall). Hinted fails (≤2/4 pilot) → halt, fix hinted
regime (same). Pilot faded 0/4 with hinted 4/4 + wall 0/4 → proceed to
full anyway (pilot faded rate is exploratory, not a gate — the full is the
test). Any seed reuse across pilot/full voids the full.

## Budget + outputs

Pilot: 4 tutors + 4 walls + 4 faded ≈ 12 × 3k-step parity runs (parity
steps are cheaper than assoc r=4 — minutes in-worker). Full: 8 × 3
(21 runs) on countersign. Ledger → `phase-1c-results.json` (per-subject
long-acc + flip-consistency + ignition); verdict folds into 1.e + 3.a gate.
Pool spend: 0 (all CPU bench).

## Non-claims

No claim that parity-fade equals assoc-fade mechanistically (different hint
channels, different circuits). Ignition here does not retire any assoc
verdict; failure here does not impugn assoc transmission — it bounds it.
