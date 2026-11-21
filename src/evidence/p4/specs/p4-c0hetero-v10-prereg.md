# Path 3 (C0-hetero): competent-tutor upper bound v1.0 (PRE-COUNTERSIGNED 2026-11-21 — user: "consider everything pre-countersigned"; agent approval: this file)

## What do I want to find out
The v4.6 WHY verdict left one clause open: "'should help' holds for competent
tutors (1.d regime); bench tutor is not one." This path tests the UPPER BOUND:
with a competent + calibrated tutor, does score-driven tailoring WORK? Pass =
bench tutor was the bottleneck (ladder C1/C2/C3 downward is justified).
Fail 3/3 with an oracle tutor = tailoring is dead at bench scale (most
informative possible negative — retires the line with the number).

## Research check (standing rule)
Nothing external: hetero design from 2026-11-19-final5 transcript (varying-p per
line 0.1/0.35/0.7, gap ~0.3-0.5), oracle = no training. No searches. Proceeding.

## Design (level (a): oracle tutor static, harness selects)
ORACLE TUTOR (no training, competent + calibrated BY CONSTRUCTION): hetero pools
— per line, persistence p in {0.1, 0.35, 0.7} (thirds, per-line p filed).
Oracle confidence per line = TRUE mean predictive entropy (closed form for lag-1
Markov: P(next=x_{t-1}) = p+(1-p)/19 else (1-p)/19; mean NLL under truth).
Oracle floor per cell = same quantity (gap = REDUCIBLE loss — selection targets
exactly what can be learned).
ROUND 1: fresh mouth students (Exp-E 800-step recipe) train uniform-300 on hetero
pool(12200), K=3 seeds (12201/2/3). Score vector: 6 cells (3 p-tiers x 2 bands) —
gap[c,b] = studentTestLoss - oracleFloor (reducible shortfall per cell).
Learnability guard: round-1 student loss on the easy tier (p=0.7) <= 2.0 else
ABORT as RECIPE-WEAK (800 steps can't exploit even oracle lines — re-spec, not a finding).
ROUND 2: transform need = max(0, gap - 0.20), raw = need + FLOOR 0.05, w = raw/sum
(same "toward failed cells" direction as v1.0). Fresh oracle lines (pool seed
12210) in proportions w (300). Arms: true / uniform-WITHHELD / shuffled-SHUFFLED.
Round-2 students FRESH. Descriptive secondary: loss split by p-tercile (H-clean
rival: upweight-confident-lines — reported, not barred).

## Attribution contrast (the bottleneck question)
Weak-tutor system: same harness x L5g9 detached mouth (proven weak: students learn
~nothing, origin-decoupled) as tutor in place of oracle. Bar: |gain_oracle -
gain_L5| >= 0.10 nats on held-out oracle lines. HOLDS = tutor competence was the
bottleneck. (L5 blob exists; zero training cost.)

## Bars
1. RESPONSIVENESS 3/3 (operator shape as D-P4; WITHHELD |shift| <= 0.05).
2. GAIN 3/3 at delta = 0.15 nats: held-out fresh oracle lines (pool seed 12220) —
   S2true loss beats S2uniform by >= 0.15. Sensitivity at 0.075 / 0.30.
   (Strict 3/3: this is the UPPER BOUND — an oracle that can't clear 3/3 sets the bound at zero.)
3. ATTRIBUTION: |gain_oracle - gain_L5| >= 0.10. Both or harness-only (filed as such).

## Expectation (scored at verdict)
PASS 3/3 (oracle + calibrated confidence + reducible-loss targeting SHOULD work —
owned as the favored outcome, which is why a fail would be decisive rather than
ambiguous). Attribution HOLDS, direction oracle >> L5. The exciting failure mode
(informative!): gain clears but attribution FAILS (harness-only — selection helps
regardless of tutor, tutor interchangeable).

## Pre-mortem
Strongest objection: oracle success proves nothing about LEARNED tutors (upper
bounds bound, they don't transfer) — answered: that's what a bound is FOR; the
downward ladder (C1 replay ~0.30, C2 scale, C3 simplify-then-scale) is the
follow-up, explicitly NOT this file. Most likely failure: recipe too weak even
for oracle lines (guarded by the easy-tier learnability check).

## Nearest-failure
v4.6 T1 ablation (differs in the priced way: T1 asked whether ear-readouts help a
WEAK tutor carry(Q) — 0/3 decorative. C0 asks whether the same KIND of readout
helps when the tutor is COMPETENT — the filed open clause).

## Cost
Oracle pools free (synthetic). 3 arms x 3 seeds = 9 trains + weak contrast 3
(r1 + r2 true/uniform) = 12 mouth trains x ~15 min ~3h across resume-safe calls.

## Ledgers
src/evidence/p4/c-r1-s{0,1,2}.json, c-r2-{true,unif,shuf}-s{0,1,2}.json,
c-weak-r{1,2}.json, c0-verdict.json. Driver: extend p4-toy.js (runP4Hetero) —
heteroPool + oracleFloor functions new (~30 lines), rest reused.
