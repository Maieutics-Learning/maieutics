# Depth v1.0: test-time compute + trained depth + path search (user-countersigned 2026-11-22; agent approval: this file)

## What do I want to find out
Every run in this program used r=1 — one depth round — while the AttnModel
supports r depth rounds and filed tutors trained with random r in 1..4
(trainModel: rMode!==1 → 1+rng.int(4); our drivers never pass rMode).
Three depth questions, cheapest first: (A) does a 1-trained mind gain from
EXTRA ROUNDS at test time (the paper's live-depth claim: math/logic gains)?
(B) does TRAINING on composed lines at fixed r=3 (vs r=1) teach
decomposition that transfers to hard lines and retains 1-hop? (C) do hop-1
and hop-2 SEPARATE across depth rounds (trace, descriptive + one bar)?
(D) does SEARCH over mid-paths (top-2 m1 x top-2 follow = 4 paths, margin
sum) beat single-path DECOMP-1 — inference-time search with no labels?

## Research check
In-repo only (trainModel/evaluate r-param; custom fixed-r loop mirrors
trainModel with local attnSup copy — verified pattern, not re-derived).
Proceeding. Filed omission with reason: best-of-N over sampled answers is
vacuous with a 4-class head (samples repeat; majority ~= argmax) — search
here means search over REASONING PATHS (D), the level with diversity.

## Design
D-A ZERO-SHOT DEPTH (eval-only, filed tutors: asm-train-b + v10 d-tutor,
s0-2): r in {1,2,3,4,6} on 1-hop control (must hold ~= 1.0) + hard assembly
DIRECT/DECOMP-1/sub1 (R=3 rolls, N=300, streams 17400+s+r*500). NOTE (premise
hygiene for reviewers): filed tutors trained with RANDOM r in 1..4
(trainModel default when rMode is unset — our drivers never set it), so r>1
eval is in-regime, not extrapolation; r=6 alone extrapolates.
POWER (filed): N=300/roll, paired diffs: SE ~= sqrt(2*0.25/300) ~= 0.041 per
roll, ~= 0.024 on 3-roll means; bar +0.10 ~= 4 sigma. Quorum 2/3 over seeds
is a robustness convention (pattern must replicate), not a significance test;
means + spreads are filed for every bar.
- Bar A1: B DIRECT(r=4) − DIRECT(r=1) > +0.10, roll-means, quorum 2/3.
D-B TRAIN-ON-COMPOSED (fresh Tutors, s0-2): 500 easy-2-hop lines (v10
genLine recipe), 1200 steps, batch 16, Adam 5e-3, attnAux + bindLabels aux
(local copies), fixed r=1 vs r=3 (custom loop). GATE: easy-DIRECT >= 0.50
else ABORT (B-flat solved easy zero-shot at 0.53-0.61; training must clear it).
Eval (R=3): easy DIRECT/DECOMP-1, hard DIRECT/DECOMP-1 (transfer), 1-hop
assoc retention.
- Bar B1: r3 hard-DIRECT > r1 hard-DIRECT +0.10, quorum 2/3.
- Bar B2 (retention): 1-hop acc >= 0.80, 3/3 per arm (else 2-hop training
  destroys the base — interference again; filed as such either way).
D-C ROUND SEPARATION (trace, r=3 B-models only, R=3, N=200): round-k focus
role (steps[L+k-1].att argmax vs pair roles). SEP = P(r1 in (a,m)-pair AND
r2 in source pair | correct).
- Bar C1: SEP > 0.35, quorum 2/3 (rounds specialize).
- Bar C2 (causal companion, adopted from fresh-eyes single check): DROP later
  rounds at eval (readout at r=1 vs r=3 on the SAME r=3-trained weights),
  DIRECT(r=3) − DIRECT(r=1) > 0.05, quorum 2/3 (rounds causally used, not
  decorative — answers effective-vs-allocated). Filed substitution: uniform
  attention-clamp is unimplementable without stack surgery; round-drop is the
  cleaner causal test of the same estimand (do later rounds matter?).
D-D PATH SEARCH (filed B tutors + D-B r1/r3 tutors, R=3, N=300 hard lines):
m1cands = top-2 classes of fwd(flat,a) with margins; for each, top-2 of
fwd(flat,m1) with margins; 4 paths scored by margin sum; PATH-1 = best.
- Bar D1: PATH-1 − DECOMP-1 > +0.05 paired, quorum 2/3 (B-arm primary;
  D-B tutors descriptive).
VERDICTS per thread: A: DEPTH-HELPS / FLAT (no gain) — flat does NOT kill
the agenda (train-time depth is thread B) / DRIFT (r hurts: test-time compute
hurts without trained depth — bounds the paper's claim). B: COMPOSED-TRAINS (+retention
read) / NO-TRANSFER / BASE-EATEN. C: SEPARATES (C1+C2) / SMEARED (C1 fail) /
DECORATIVE (C1 pass + C2 fail — rounds differ but answers don't need them). D: SEARCH-WINS /
SEARCH-TIED.

## Expectation (scored at verdict)
A1 PASS (r4>r1 +0.10; 1..4 was train-time, so no mismatch; 65%). B1 PASS
(r3 composes where r1 compiles flatly; 55%). B2 PASS (retention holds;
distill-era says rehearsal-free mixed... no — D-B trains ONLY 2-hop lines,
no 1-hop rehearsal: predict borderline, honest 50%). C1 PASS (SEP ~0.45;
55%). D1 PASS (~+0.08; 55%).

## Pre-mortem
Strongest objection: D-A r>1 DRIFTS (extra rounds of a 1-evaled readout
wander; DIRECT falls with r) — answered: A1 is two-sided in spirit; a clean
fall with r is filed as DRIFT (test-time compute hurts — bounds the paper's
claim to trained-depth regimes), not a void.
Most likely failure: B-gate ABORTS (2-hop-easy unlearnable at fixed r?
unlikely given zero-shot 0.55 — but training dynamics != eval; filed openly)
or B2 fails (pure 2-hop training eats 1-hop: interference, seventh sighting,
informative).

## Nearest-failure
assembly-v11 (differs: tutors never saw composed lines; here thread B
trains on them. D-A/D-D reuse filed tutors with new inference only).

## Cost
D-A ~6x5x(300x3) evals (minutes). D-B 6 trains x1200 (~25 min) + evals.
D-C/D-D evals (minutes). Split runs, resume-safe.

## Ledgers
src/evidence/decomp/d-depth-{a-eval,b-train,b-eval,c-trace,d-search}-{...}.json,
d-depth-verdict.json. Driver: src/evidence/decomp/depth-driver.js (trainDepthR
fixed-r loop; evalR; roundTrace; pathSearch).
