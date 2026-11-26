# U58 + U59 failure analysis — what failed and why (filed 2026-11-26)

**Scope:** U58-DET2 v1.3 CLOSED UNDERPOWERED (3/3 trunks) + U59-EXT3 v1.1 CLOSED FLOOR-FAIL (20 seeds, 15/20 quorum).
Verdicts frozen: `d-newai-self-u58-verdict.json`, `d-newai-self-u59-verdict.json`. This doc adds the causal
reading the verdicts alone don't give. No bar moved. No ledger rewritten.

Controls both passed (pipeline is sound — failures are in the world, not the wiring):
- U58 W0-RAND scrambled-target gaps/spikes ~= 0 (PASS: -0.224/-0.160, no HEALTHY on noise).
  W0-TRIV planted +1.0 gap / +5.0 break both detected (would-be HEALTHY). Pre-compute repair D4
  (relabel-OFF true null) caught a bad null before any data — the gate correctly HALTed the bad
  null first, then passed the fixed one.
- U59 W0-RAND vetoSUP-only pilot sep 0.0181 (chance, PASS), W0-TRIV sep 0.879 (PASS),
  gradcheck 1.21e-9, 15/15 twins, replication vetoTASK mean 0.0589 vs U57 0.059 (U57 stands).

---

## U58-DET2: UNDERPOWERED — the ruler is shorter than the thing

**What failed (numbers):** PIN 3/3. NONDEGEN 0/3, DISSOCIATE 0/3, INDEPEND 0/3, POWER 0/3
(non-underpowered). Per trunk: gap_STAT 0.97 / 0.73 / 1.15 (sub passes 3/3), gap_ROT 0.25 / 0.10 /
0.24 (fails 3/3), cross |gR-gS| 0.72 / 0.64 / 0.90 (fails ratio 3/3), carry ROT spike 0.05 / -0.12 /
-0.00 (fails 3/3), STAT-silence passes 1/3. uw (UNMEASURABLE, 2SE > 0.25 fixed tolerance): 4, 3, 3
subs per trunk. Verdict rule fires UNDERPOWERED before any HEALTHY/ENTANGLED/COLLAPSED reading.

**Why — three layers, all have to be named (any one alone misleads):**

1. **Precision (the filed cause).** The ROT validity signal lives at 0.10–0.25 standardized units;
   the filed fixed tolerance is 0.25 (v1.2 P3, U55-N5 verbatim). With 20 streams/cell (40 per gap),
   2SE sits above 0.25 on most deciding subs. ~4x streams resolves it. This is measurement, not a
   result — no license either way. v1.4 (20 trunks, 15/20 quorum, same 0.25) is the owed retry,
   not a reinterpretation.

2. **Substrate has no violated expectation to carry.** B'' asks the trunk carry `c` to jump at
   hot-switch boundaries. It doesn't: ROT spikes ~0.00 on all 3 trunks (t0 +0.05, t1 -0.12,
   t2 -0.00), same null U55 saw (spikes 0.00). The canon trunk was trained on static pick-max;
   nothing in its objective ever required it to mark regime switches, and the carry — the only
   cross-row state — carries no quarter context. A''/B'' independence (`|r| < 0.7` passes
   numerically: -0.14 / +0.08 / -0.09) is vacuous when B'' is null: two readouts can't dissociate
   when one channel is silent. Even with infinite N, B'' has nothing to amplify without a
   context-marking substrate first (state-gate U38 saturated open ~0.75; gate line closed).

3. **Rotation attenuates the validity signal itself (design finding, survives N).** STAT holds the
   hot pair fixed at [0,1] all 400 rows, so noisy-vs-clean is a pure relabel contrast on minority
   rows → gap 0.73–1.15. ROT rotates the hot pair per quarter ([0,1],[2,3],[0,1],[2,3]), which
   (a) adds rotation-cost to *both* clean and noisy arms and (b) spreads per-slot errors, inflating
   the precision-weighting denominator (per-stream SD). Net: the noisy-clean contrast shrinks to
   0.10–0.25 and cross = |gR-gS| lands 0.64–0.90, failing the <= 0.5*min ratio 3/3. So even the
   well-powered STAT channel predicts ROT will sit well below STAT — N fixes the SE, not the
   attenuation. If v1.4 powers through and finds gap_ROT significant-but-small with a still-failing
   cross, that is ENTANGLED (single-scalar), not HEALTHY — the mapping hypothesis, not the ruler,
   is then at fault.

**What would change the reading:** v1.4 at 20 trunks finding gap_ROT significant-positive AND
cross <= 0.5*min AND ROT-spike significant-positive with STAT silent (HEALTHY) — or precise nulls
on all ROT subs with tight SE (COLLAPSED). Anything else is still ruler-talk.

## U59-EXT3: FLOOR-FAIL — the switch was fixed, the floor it stands on isn't there

**What failed (numbers):** PIN 20/20. CTX 15/20 (exactly quorum), NOERASE 20/20, ISOLATE 11/20,
FLOOR 0/20, MISFIRE 0/20. Replication holds: vetoTASK mean vetoA 0.0589 vs U57 0.059 (tolerance
0.02). Per seed, every seed: noveto CTX-A 0.21–0.34 (chance ~= 0.25), global 0.20–0.31; vetoSUP
CTX-A 0.455–0.605 (ckpt 0.485–0.605, passes 15/20 relative), vetoA 0.0059–0.0064 (20/20, no
misfire); vetoTASK vetoA 0.051–0.068 (leak replicates 20/20). Floor needs CTX-A >= 0.45 on ALL 5
arms per seed — noveto/global kill it 20/20.

**Why — the leak-fix worked, and that is why the floor verdict is structural, not noise:**

1. **The supervised objective vindicated its mechanism.** U57's leak (vetoA ~0.06 frozen: task-blend
   residual vanishes when trunk + half-veto get "good enough" → updates stall). Giving the veto its
   own non-vanishing BCE-on-ctx objective (LAM_SUP=1.0, present on every row) drops vetoA to ~0.006
   on all 20 seeds, MISFIRE 0/20, CTX exactly at quorum 15/20. The A&F separation (control signal
   vs weight-change) honored in *training*, not just architecture, is the difference between 0.059
   and 0.006. That part is a win and replicates.

2. **A gate preserves; it doesn't teach.** B-heavy 80/20 diet (80% B rows) erases the A mapping at
   the baseline: noveto — no veto at all, pure trunk — sits at chance (0.21–0.34) on every one of
   20 seeds. Global (same diet, no veto) matches. Even unfrozen (full fine-tune) only reaches
   0.475–0.585. The vetoSUP arm holds 0.455–0.605 *relative to its own checkpoint* because the gate
   shields what Phase-1 put there — but it cannot restore a mapping the diet never lets the trunk
   learn. NOERASE 20/20 (|ret-ckpt| <= 0.02) confirms: nothing is erased *from checkpoint*; there was
   just never enough A in the B-heavy stream to clear an absolute 0.45 floor without the veto's shield.

3. **Floor-before-misfire gating scopes to all arms by design (U54-D3 flaw owned).** The floor asks
   "is the task solvable here at all" before crediting the switch — and answers no, 0/20, because
   two of the five arms are unshielded baselines under a diet that erases them. Same structural floor
   as U53/U54/U57 (all FLOOR-FAIL on B-heavy). Changing the floor to veto-only would be tuning to
   the result; the honest reading is the line is dead *on this diet*: the switch works, the diet it
   was asked to survive doesn't support the comparison the floor demands.

**What would change the reading:** a diet where noveto clears 0.45 (balanced or A-anchored) with
vetoSUP still at ~0.006 misfire and CTX at quorum — then SUP-FIXED licenses the scheduling/replay
program. Under B-heavy 80/20, no veto variant passes floor without moving the floor, and moving the
floor needs its own prereg (not an amendment).

## Cross-pattern (both healthy = file-against)

U58's controls (RAND null, TRIV fire) + U59's replication (0.0589 vs 0.059) + OLS-independent
readouts (|r| < 0.7 both tracks) + U59's 0.006-vs-0.059 supervised contrast mean both failures are
*informative* nulls from a validated pipeline, not wiring bugs. Both lines as filed are dead:
U58 needs the v1.4 ruler (20 trunks) before any theory claim; U59 needs a new diet (new prereg),
not a new veto. The shared lesson with U55: batteries are necessary-not-sufficient — U58-D4
(null) and U59-D1/D2/D5/D6 (stray line, frozen predicate, /3 denominators, batch-noise gates) were
all caught by owner re-derivation pre-compute, zero data wasted.
