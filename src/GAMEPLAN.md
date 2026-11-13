# Gameplan v11 (2026-11-13) — phased, paper-first (r1: 8; r2: 9; r3 steelman 6/6; r4 debate 2 ACCEPTs)

Replaces v6's horizon sketch with numbered phases. Standing context (unchanged): transmission
+ chaining measured but mechanism, independence, and generality open; two reviews agree —
no scale-up until compact mechanism studies land; nursery parked behind a re-entry bar.
Notation: Phase → lettered steps → roman sub-steps (e.g. Phase 2.c.ii). Far-future items
may be TBD — that is intentional.

## What stands (not re-litigated without new data)

Transmission 6/10 (D-rate), chaining 35/40 G1→G5, F-singlegen O2 (schedule, not generations),
fair-slot + S-lesion + null-global controls, failure signatures, ignition-tracking transfer
battery. Threshold bar robust (±0.10 → 35→32/36; bimodal ledger distribution).

## Conventions
- Statistics: 95% Wilson intervals everywhere; thresholds are preregistered, not tuned.
- Budgets: Phase 1 <2 h wall, 2.b.0 <1 h wall (round-2 caps against bloat).

## Phase 1 — Mechanism settlement (cheap; ≈35 s per 3k-step seed, full Phase 1 under an hour)

- **1.a Fading causality** (review #2 Q1: soft targets run constant, only hints fade)
  - i. Attn-hint-only student arm (softW=0), 8 seeds, same tutor/pool.
  - ii. Constant-combined arm (attnKeep=1.0 all 3k steps), 8 seeds.
    Five-way table (review #2 Q1 + rounds 1, 4): soft-only = D1 cold (0/9 ✗, done) / hard-only = H-wall (0/32 ✗, done) / attn-only (i) NEW / constant-combined (ii) NEW / staged ✓ (reference) / instant-drop (iv) NEW (r4).
  - iii. Verdict (numeric): attn-only ≥4/8 igniting rewrites fading as non-essential; attn-only *failing* reads as "hints insufficient alone," not "fading essential"; constant-combined within Wilson CI of staged means the schedule isn't doing work.
  - iv. Delayed-onset instant-drop arm (NEW r4): full hints steps 0–1500, zero after; 8 seeds, same tutor/pool (≈5 min). Verdict (numeric): staged within Wilson CI of instant-drop → graduality inert, the final hint-free state does the work; staged above CI → the gradual process itself is causal.
- **1.b Position arbitrariness** (Q2: killAExam + killMatrix both target-first)
  - i. Slot-swept kill eval, eval-only on saved G-winners (~free).
  - ii. Fresh-seed confirmation, only if i shows sensitivity.
  - iii. Verdict (numeric): slot-swept/original kill correlation ≥0.95 → position-independent, kills stand; below → replace with position-swept variant.
- **1.c Cross-family probe** (Q5; parity in-house, preregistered)
  - i. Parity exam suite + task-native conjunctive bar (long-length acc + flip-one-bit
    consistency), prereg spec.
  - ii. Pilot n=4 (hinted regime → wall → transmission).
  - iii. Full n=8 + verdict, only where the pilot shows signal.
- **1.d Implementation trust** (Q7)
  - i. PyTorch re-run of one igniter trajectory.
  - ii. Same for one memorize-lean trajectory.
  - iii. Verdict: cross-check passes, or a backprop audit opens.
- **1.f Power analysis** (NEW r3): detectable effect sizes for every numeric threshold at n=8, 95% Wilson; ships with v0.15.
- **1.e Paper inputs**
  - i. Threshold-sensitivity paragraph (numbers ready).
  - ii. Fold 1.a–1.d verdicts as they land.
- Exit: Q1/Q2/Q4 answered in text, Q5 has its first datum. Kill rules: hints-alone
  igniting rewrites (not defends) the fading claim; slot-sensitivity replaces the kills.

## Phase 2 — Confirmation + hardening (weeks; the expensive item lives here)

- **2.a One-command rerun** (both reviews; doubles as re-ledger vehicle)
  - i. Config format (`experiments/configs/*.json`: task, seeds, schedule, exams).
  - ii. Headless runner (`node`, imports tinynn directly, machine-readable JSON, no clicks).
  - iii. Ledger byte-compare with PASS/FAIL per claim (exact on same engine; documented tolerance fallback for cross-engine ulp drift so CI cannot deadlock), owned by CI (GitHub Actions runs it; local pre-commit hook mirrors it). Overrides only via a logged ledger-or-cut verdict — the gate fails closed, the override is a verdict, not a bypass.
  - iv. Re-ledger-or-cut: old-arch claims without ledgers rerun through it or leave
    the paper (review #2's rule).
- **2.b.0 Shuffle-seed pre-gate** (cheap; MANDATORY BLOCKING — zero Phase-2 spend until it passes):
  - cross-lineage G2 (different-seed G1 winner as tutor) + G1→G2 rate over N=10 seeds;
  - tutor-swap control (NEW round 2): low- vs high-performing G1 winners as tutors — tests teacher-variance prospectively.
- **2.b Second independent chain** (Q3; gated on Phase 1 AND 2.b.0 — no payment if the mechanism
  dies cheaply)
  - i. Distinct T0 (different seed/lineage), same protocol, full G1→G5.
  - ii. Chain-survival + tutor-quality analysis.
  - iii. Verdict on dependence (numeric, 95%): G1→G5 survival rate (gens ignited / 5) reported per chain; second chain within Wilson CI of first = compounding; collapse = single-chain luck. Gap analysis (NEW round 2): G2-transmission vs G5-survival compared explicitly — high G2 + rotted G5 = late-chain decay, distinct from transmission failure.
- **2.c Wider cross-family battery** (review #2's list)
  - i. Sorting + finite-state-transition tasks through the same suite.
  - ii. Side-by-side comparison table, matched compute, identical ledger format.
  - iii. Verdict (numeric): ≥5/8 = generalizes; ≤2/8 = lookup-local; in between = mixed. Failure frame (NEW round 2): B-fails/A-replicates = task-specific; both fail = mechanism collapse.
- **2.d Engineering track** (§7, parallelizable with 2.a–2.c; Perchance constrains the
  artifact, never the source — tinynn is zero-dep, no DOM, already Node-portable)
  - i. Source split: `paper/manuscript.md` (+ refs/figures) and `lab/` sources; build step
    inlines them into the shipped index.html. Paper independently maintainable.
  - ii. `tests/` under `node --test` (gradients, seeds, serialization, losses, eval-set
    integrity, init, hint withdrawal, stability, shortcut regressions) + CI on GitHub.
    In-page self-tests stay as smoke; Node is the gate.
  - iii. Headless runner as the scientific path (merged with 2.a.ii); keyed pool arms stay
    browser-side where the vault lives.
  - iv. Dockerfile allowlist (runtime subset only; evidence/logs/notes stay out of the image).
- **2.e Paper v0.15 → venue**
  - i. Fold Phase 1 + Phase 2 verdicts.
  - ii. Venue decision (TMLR / ICLR / NeurIPS shortlist per review #2).
  - iii. Submit.
  - iv. Submit gate (NEW r4): no submission with the 1.d cross-check open or any ledger under unlogged override — v0.15's reproducibility is a gated outcome verified by CI, not a date.
- Exit: generality decided by data; a stranger reproduces every headline without a browser;
  paper submitted.

## Phase 3 — The fork (late; details TBD by design)

- **3.a Decision gate**
  - i. Check the re-entry bar (numeric): Q1/Q2 answered in text AND ≥5/8 ignitions on one cross-family task with the same schedule.
  - ii. Bar met → 3.b. Bar not met → the gate emits new TBDs, which feed back into
    Phase-1/2-style batteries. There is always a next experiment while TBDs remain.
- **3.b Nursery re-entry** (only if the bar is met; design TBD pending Phase 1–2 findings)
  - i. TBD: smallest nursery pilot — one topic, fixed published bars.
  - ii. TBD: further phases drafted only after i reports.
- Standing rule: closure is not a phase and never scheduled. It arrives only when no TBDs
  remain — until then, an unmet bar produces the next battery, not an ending.

## Scoreboard

v7 done = Phase 1 verdicts in text + Phase 2 stranger-reproducible + v0.15 submitted, with
3.a decided on data. Every phase exit is a written verdict, never momentum.
