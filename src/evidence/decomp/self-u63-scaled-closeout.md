# U63-SCALED closeout — SUP-PERSISTS (isolate), replication retired (filed 2026-11-26)

**Verdict:** `d-newai-self-u63-verdict.json` = SUP-PERSISTS, cause isolate fail at quorum
(unfrHolds 0/20). Correct per filed gating; 20 R1 + 20 discussion unanimous. No bar moved.

**What changed vs U62:** exactly one number's interpretation — REPLICATION 0.0373 vs diet-scaled
0.036875, diff 0.0005, RESOLVED (was the 0.0017-over trip that halted U62). Every other bar
identical (PIN 20/20, FLOOR-R 20/20, GDIR 20/20, CTX 16/20, NOERASE 20/20, ISOLATE 11/20,
MISFIRE 0/20). The halt is retired; the remainder is isolate.

**Why isolate fails is the same story as noveto, mirrored:** isolate demands the unfrozen arm
erase (|ret−ckpt|>0.02), but the balanced diet weakens erasure pressure, so unfrozen retains
everywhere (unfrHolds 0/20 — it never erases on any seed). U59's B-heavy diet erased baselines
(floor 0/20); U61's balanced diet preserves them (floor-R 20/20, isolate 11/20). One mechanism:
B-pressure sets erasure. The veto is proven necessary where pressure erases and harmless where
it doesn't — pressure-dependent necessity, which no single-diet quorum can express.

**Line status:** the veto mechanism is proven (three diets: supervision fixes the leak wherever
learnable; unsupervised leak scales linearly with B-pressure; shielded floor holds 20/20 under a
fair scope). What remains is system-integration behavior (when is the veto *needed*), which is an
architecture/diet question beyond the veto objective. Licensed: close the veto line as
mechanism-proven (file, don't tune). No further veto prereg licensed.
NO PUSH without order.
