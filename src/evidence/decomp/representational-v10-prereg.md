# Representational-v10 — substrate, specificity, and the missing baselines (agent approval: this file; user countersign owed before compute)

## What do I want to find out
The verifier program's three open wounds, in one battery: (1) SPECIFICITY — is the stacked reverse tied to one particular teacher's idiosyncrasies (cross-teacher replication) or does it survive garbage targets (shuffled-teacher null with teeth)? (2) NECESSITY-FROM-START — R-c showed distill-only round 3 bleeds, but do cycles matter from round 1 (distill-only rounds 1–2)? (3) SUBSTRATE — can the verifier install anything into bottlenecked recurrence with no attention (SeqModel student from scratch), and does pricing intermediates (bindLabels aux on distill lines, filed as absent) move B3?

## Research check
In-repo only (assoc stack, verifier GH machinery, SeqModel in nn.js — gated-recurrent, no attention, interface-compatible: forward(x,r)/params/zeroGrad/backward/posOut). Proceeding.

## Design
Shared skeleton = V1 distill4x2 replication (600 steps, re-anchor at 300 with fresh Adam + reseed 16000+s/16100+s, rng 15000+s/drng 15100+s, B=8, Adam 5e-3, evals via runCycleEval+modelOpt). Five arms (seeds 0,1,2):
- S-XTEACH (specificity): identical to V1 but teacher = freshly trained independent tutors (trainSeed 15100+s, data 15000+s, test 15200+s, same gate 0.60; new ledgers d-xteach-tutor-s{s}.json). Bars: R2 B0 ≥ 0.90 3/3 AND R2B3 ≥ R1B3 quorum 2/3 (replicates → skill is directional, not teacher-idiosyncratic).
- S-SHUF (null with teeth): V1-identical except teacher probs permuted by fixed π=[2,0,3,1] per line before KL. Bars: none to pass — TEETH: if R2B3 ≥ R1B3 quorum 2/3 (stacks on garbage) → verdict DEMOTE (filed STACKS demotes to distillation artifact program-wide). B0 recorded (garbage may corrupt forward — expected, not a bar).
- S-DONLY (necessity from start): halves with cycles:false, W:4, re-anchored. Descriptive + comparison: does B3 climb with no cycles from step 0? (R-c answered round 3 only.)
- S-REC (substrate): SeqModel student from scratch (T.makeModel, arch seq h48/m96, seed-matched), teacher = standard attn tutor, full cycles+W4. Descriptive first contact: does B0 pin? does B3 move?
- S-AUX8 (priced intermediates): V1-identical + bindLabels aux on distill lines at 8× (filed: no aux on distill lines; auxFor exists, scaled ×8). Bars: R2B3 ≥ R1B3 quorum 2/3 (replicates) + descriptive delta vs filed V1 mean climb (+0.102).
- S-AUX1 (dose control — adopted from fresh-eyes): identical but aux at 1×. Separates presence (AUX1 vs filed-OFF) from dose (AUX8 vs AUX1).
- S-CTL (concurrent replication — adopted from fresh-eyes): pure V1 replication run alongside the battery. P1-style gate (R1 B0 ≥ 0.90 AND |R1B3 − filed V1-R1B3| ≤ 0.10, 3/3); guards harness drift so arm deltas read against a concurrent baseline, not only filed values.
VERDICTS per arm: REPLICATES / NULL / BOUND (descriptive) / DEMOTE (teeth tripped, program-wide).
REJECTED (logged, not adopted): non-anchored control — re-anchor is the filed round semantics shared by V1/H/R (Exp-E generation semantics; verifier-v10 residual owns the more-steps-vs-round-effect ambiguity). All arms share it, so comparisons are clean; absolute attribution to "restart luck" was never the claim.

## Expectation (scored at verdict)
XTEACH replicates (directional); SHUF null (B3 ~chance, B0 slips); DONLY holds B0, B3 flat-or-bleed; REC: B0 holds, B3 flat (substrate receives forward, not reverse); AUX8 meets-or-beats V1 climb (honest 50%).

## Pre-mortem
Strongest objection: SHUF stacking anyway (→ DEMOTE fires: the honest kill the battery was built to catch). Most likely failure: REC B0 never pins (recurrence can't even receive forward by distillation — still a bound, still publishable: substrate-gated receipt).

## Nearest-failure
verifier-v10 (differs: standard substrate/teacher/cycles; here one variable swapped per arm).

## Cost
7 arms × 3 seeds × 600 steps + 3 xteach tutor trains ≈ 3–4 hrs total, one seed-run per execute_js call (~5–15 min each), resume-safe via COMPLETE-gated ledgers.

## Ledgers
src/evidence/decomp/d-verS-{xteach,shuf,donly,rec,aux8,aux1,ctl}-s{s}.json (+ d-xteach-tutor-s{s}.json), d-verS-verdict.json. Driver: novel-driver.js += runXTeachTutor + runVerifierS (teacherFrom/shufflePi/cycles/W/studentArch/distillAuxW cfg).
