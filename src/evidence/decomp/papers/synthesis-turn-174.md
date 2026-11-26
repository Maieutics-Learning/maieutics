# Turn-174 cross-paper synthesis (owner adjudication; sealed 3-way synthesis round)

## Inputs
12 deep briefs + 12 Format-13 debates (Tier-1 01-04 with R3; rest R1+R2), all in
src/evidence/decomp/papers/. Owner adjudication filed in each debate doc (Turn-174,
this session). Sealed synthesis: 3 parallel reviewers over wall + 12 verdicts.
Unanimous: Lippl shortcut audit (09) is the highest-stakes measurement. (Reviewer
framing corrected below: the kill-switch is slope<1 + neutralize-collapse, per the
debate-09 adjudication — one reviewer inverted the inequality and is overruled.)

## Verdict table (ACCEPT = run it; REJECT = blocked on gate; PARTIAL = conditional)
| # | Paper | Zero-training decider (ACCEPT) | Training arm (gated) | Standing objection |
|---|---|---|---|---|
| 01 | Irie meta-learning | D2 pressure probe (in U39-DIAG) | meta-episodes, held-out-CLASS control | distributional collapse |
| 02 | Lake-Baroni MLC | ME-collision diagnostic | remap diet ONLY if Delta<=0.02 | no transient workspace in static MLP — REJECT transfer |
| 03 | Colas LP-bandit | disagree x LP \|r\|>=0.4 | bandit vs uniform | dynamic-U36-shuffle; merged w/ 04 |
| 04 | Oudeyer LP | flat-LP (non-zero >=30% run) | bandit vs yoked | reverts to coin flip if flat; merged w/ 03 |
| 05 | Mattar-Daw | gain-surprise rho<0.9 | Gain-x-Need 3-way replay | likely dead (E2c degeneracy) |
| 06 | Diekmann SFMA | STRENGTH variance | SFMA vs random+IoR, contrast diet | U37 hollowing |
| 07 | Sydnor periods | U34 trunk-regression | staged schedule; linear-decay control | goalpost stabilization |
| 08 | Jarvis IL | rank-cardinality ratio | 16-class vocab + tutor chain; 20% bar | no mode-removal in shallow MLP |
| 09 | Lippl kernel | shortcut audit + slope | NONE (decides architecture track) | highest stakes of the twelve |
| 10 | Andrychowicz opt | loss-slope headroom | trajectory ramp; cross-diet transfer | likely dead (saturated slopes) |
| 11 | Abraham/Frey STC | over-chasing correlation | STC vs yoked-tag | U37 indifference |
| 13 | LangCult goals | frozen-U32 token entropy | productive vs extractive; wrong-token-breaks-action | decorative-label risk |

## Diagnostic batch (all zero-training; single execution order)
Wave A (parallel, pure ledger arithmetic): disagree-LP r (03), flat-LP curves (04),
gain-surprise rho (05), STRENGTH variance (06), trunk-regression (07),
rank-cardinality (08), shortcut correlation + slope (09), loss-slope headroom (10),
over-chasing correlation (11).
Wave B (parallel, frozen-weight eval probes, no training): D2 pressure probe (01),
ME-collision sets (02), first-token entropy on frozen U32 (13).
No dependencies between A and B; run together. Every training arm in the table
stays REJECTED until its named gate passes at quorum bars already filed.

## Kill-switch (adjudicated, overrules synthesis-reviewer-B wording)
- slope<1 (proportional compression) AND neutralize-collapse => model is a
  shortcut-leaking kernel regime => ARCHITECTURE TRACK FORCED; entire
  incentive/pressure family (01-08, 10-11, 13 arms) dead; stop pricing, build
  pointer-like / exclusion machinery.
- slope~=1 AND no shortcut predicts >60% of labels => kernel theory FALSIFIED
  for this bench (skeptic wins 09); failure is binding-dynamics (U37-style);
  proceed through the remaining gates.
- D2 FAIL (gate never shuts under pressure) => selection primitive structurally
  absent; meta-learning (01) dead regardless of 09 outcome.

## Final recommendation
1. License NOTHING that trains. All 12 debates converge on measure-before-training;
   honor that convergence.
2. Next order to request: prereg + battery for the Wave-A/Wave-B diagnostic batch
   (extends U39-DIAG; D2 already inside it). Ledger arithmetic needs no countersign
   debate, but file it under the same prereg discipline for the eval probes.
3. First training arm in line, conditional: whichever gate passes with the largest
   margin AND whose falsifier-controls are cheapest. 09 licenses no training arm
   (it decides the track); among incentive arms, the current favorite is the
   03/04 bandit pair
   (cheapest controls: uniform + yoked, same 800-step budget).
4. Explicitly NOT recommended: vocab expansion (08), trajectory ramp (10), STC
   replay (11), productive-goal training (13) — all four carry standing objections
   plus predicted-negative probes; revisit only if their gates pass.
