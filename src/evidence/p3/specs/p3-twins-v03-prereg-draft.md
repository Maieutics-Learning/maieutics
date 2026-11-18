# Twin-writers mini-prereg DRAFT v0.3 (UNCOUNTERSIGNED — binds nothing; no build until countersigned)

## What changes (v0.1 killed, v0.2 NO-HEADROOM with mouth validated, target absent)
Stop pushing lines at N-9601's missing 0.90 region. New question: do separately-trained
writers CONVERGE (same pattern vision?) and TRANSMIT (teachable?). Two experiments,
staged: B runs iff A converges.

## The one trap + repair (read first)
Writer mouths (19-way) have no piles, and separate pile heads would be incommensurable
("pile-zero" under different random readouts means different things — swapping scores
across them measures nothing). Repair: ONE shared pile grader for everything — N-9601
frozen, unchanged. Writers differ (separate histories); the grader is fixed. All pile
talk is this grader's argmax (pseudo-classes, read-only, never ground truth).

## Subjects (fixed pre-run, report all — no shopping)
K=3 writers: backbone seeds 9601/9602/9603, mouth training = v0.2 unfrozen build
(next-token CE via per-position aux through Lout19, structured pool 9770/400 Markov
0.35), <=800 steps, batch 8, lr 5e-3, rMode 1, head-init 9761+idx, train-sampling
9780/9781/9782. Blind mouth (random-init 19-way, seed 9699) as the floor for Exp A.

## Exp A — convergence (measurement-only, exempt from parallel-arms)
- A1 mouth-agreement (no piles at all): all 3 writers + blind predict next tokens on 200
  shared fresh structured lines (seed 9771). Pairwise argmax agreement. BAR: mean
  writer-writer agreement minus mean writer-blind agreement >= 0.15.
- A2 exam swap (shared grader): each writer generates 100 lines (prefix-3 + ancestral
  T=1.0, sampling 9762+idx, novelty poolHit 0 vs 9770). Common scorer pile-sorts all 300.
  Readouts: per-writer pile profile + modal pile; scorer's uniform-pool profile as the
  bias reference. BAR: same modal pile across all 3 writers' exams AND profiles distinct
  from the bias reference (else it is scorer bias, not convergence).
- Gate: B runs iff A1 AND A2 both pass (>=2/3 writers readable either way — report all).

## Exp B — transmission (learning run: parallel-arms, frozen first, F-weights axis)
Per writer W: exam = W's 100 lines; labels = common scorer's argmax (imitation target,
never correctness). Fresh student distills (T1 cache, <=1500 steps bounded pilot bound —
filed deviation from P2-3000; full round uses 3000 on go). Baseline: blind N (fresh
random-init 4-way, seeds 9610/9611/9612) solves the same exam untaught.
BAR per writer: student-teacher input-driven delta >= 0.20 AND blind baseline within
chance +- 0.10 (outside = trivial/degenerate exam, that writer voided not failed).
CLAIM: >=2/3 writers pass (quorum, not shopping).

## Controls / discipline
- No correctness-driven updates anywhere (students imitation-only; mouths copy inputs).
- Fixed seeds throughout (listed above); generation sampling fixed; students seeds filed
  at build (9790+idx, frozen-first pair shares history per parallel rule).
- Novelty: generated exams poolHit 0 vs 9770 or the exam is discarded.

## Doubt instruments
- Expectation: A1 passes narrowly (structure is learnable, +0.15-0.25 over blind); A2
  modal match 2/3 or 3/3 (writers emit the same food, scorer is fixed); B passes 2/3
  (run-7 fidelity says mappings transmit).
- Pre-mortem: strongest objection = shared scorer grades everything pile-0-ish regardless
  of input (v0.2: 45% pile-0) — A2 modal match would then be bias, which is why the bias
  reference is a BAR condition, not decoration. Most likely failure = writers diverge
  (different histories carve different visions) -> A1 fails, B gated off, cheaply.
- Nearest-failure: v0.2 dialect mismatch (structured lines scored MORE spread) — A2 may
  show three different modal piles; that is a result (divergence), filed as such.
- W: A1 <= blind+0.05 AND B students < 0.10 -> writers neither converge nor transmit;
  kill the writer line, fall back to E-lines + NARROW N claim.

## Cost
Stage A: 3 writer retrains (~4-5 min each, v0.2 build as-is) + forwards (seconds).
Stage B (gated): 3 students x <=1500 steps + baselines. B needs its own go after A.

## Status
DRAFT 2026-11-18. Needs user countersign (version-bound approval) before ANY compute.
Stage A and Stage B countersigned separately (B only after A passes).
## 2026-11-18 — twins v0.3 DRAFT filed (user's two experiments, repaired with shared grader)
- Direction: user "swap generated exams and see if they match" + "writers teach students vs blind Ns". Repair: writers lack piles + separate pile heads are incommensurable -> ONE shared grader (N-9601 frozen) for all pile judgments. K=3 writers (9601/9602/9603, v0.2 unfrozen build), blind mouth 9699, blind Ns 9610-12. Exp A convergence (A1 mouth-agreement >= blind+0.15; A2 same modal pile + off-bias-reference), Exp B transmission (student delta >=0.20, blind at chance, quorum 2/3). B gated on A. Binds nothing until countersigned.
