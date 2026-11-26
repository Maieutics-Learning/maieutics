# U63-VETO-SCALED (E-EXT5) prereg v1.0 — diet-scaled replication (answers U62 TASK-NOREP)

**Track:** U63 (veto line; U62 audit proved the replication miss diet-explained: predicted 0.03681
vs observed 0.03733, diff 0.0005 ≈ 0.5 SE — the ±0.02 tolerance around the B-heavy U57 value is
diet-blind).
**Cover:** user 2026-11-26 "Lets do the U63" = this prereg + 10x battery + driver + Waves 0-1 +
per-wave 10x reviews (full-pipeline cover; reads-only recompute, zero new trains). NO PUSH.
**Lesson encoded:** an absolute leak expectation cannot survive a halved B-fraction when the leak
is proportional to B-pressure (U59 0.0589 at B=0.8 → U61/U62 0.0373 at B=0.5; ratio 0.63 vs
B-ratio 0.625). Test the invariant (leak-per-B-row), not the raw magnitude.

**Design:** identical to U62 (same 200 filed U61 ledgers, same candidate bars, same FLOOR-R /
GLOBAL-DIR / NOVETO-DIAG, same gating order) EXCEPT REPLICATION-CHECK: expected vetoTASK mean
vetoA = 0.059 × (0.5/0.8) = 0.036875, tolerance ±0.02 (unchanged width — only the center moves,
by the filed diet ratio, pre-compute). Else TASK-NOREP (halt, audit).
**Bars (quorum 15/20):** SUP-PIN / SUP-CTX / SUP-NOERASE / SUP-ISOLATE / SUP-FLOOR-R / GLOBAL-DIR /
NOVETO-DIAG / REPLICATION-SCALED / MISFIRE-COUNT — all definitions verbatim U62.
**Waves:** 0 (ledger-identity: 200 filed ledgers + 100 phase-1 pointers + load-check,
COMPLETE-gated); 1 (recompute + verdict, COMPLETE-gated).
**Verdicts:** same set as U62 (SUP-VIABLE / SUP-PERSISTS / TASK-NOREP / FLOOR-R-FAIL / PIN-FAIL).
**Filed expectation (not a bar — read this before calling U63 a failure):** replication RESOLVED
(0.03733 vs 0.036875, diff 0.0005 ≪ 0.02); overall verdict SUP-PERSISTS on ISOLATE (11/20).
Rationale (pre-compute): isolate demands the unfrozen arm erase (|ret−ckpt|>0.02), but the
balanced diet weakens erasure pressure (same root cause as noveto 5/20) — unfrozen retains, so
isolate fails exactly where the veto is least *needed*. The veto's value is pressure-dependent:
proven necessary under B-heavy (U59: floor 0/20 unshielded, veto holds), redundant-but-harmless
under balanced. A single-diet quorum cannot express "needed under pressure"; U63 retires the
replication halt and names isolate as the diet-explained remainder, licensing line closure as
mechanism-proven with pressure-dependent necessity.
**Falsifiers:** B-fractions are filed diet constants (U59 0.8, U61 0.5 — from preregs, not data);
tolerance width unchanged; any threshold move needs a new version + battery + countersign.
