# Wave 288 note (execution; backlog-W245 hole-dynamics, sandbox)

STOP RULE: stopped after t-traj shape audit on all 5 deep-hole cells + 7
dose-neighbors (t300/t500/t700/t1000 from saved w228 grids) + bar-sensitivity
on both axes. Zero new sims. 1 direct + 1 tangential below. Spend: 0 search,
0 fetch. Clock: R45 3/5. Pre-reg scored: (a) REJECTED-decisively (0/5)
(b) REJECTED-as-framed (c) CONFIRMED.

## Direct: the holes live on the length axis, not the time axis

t300 of the 5 ledger holes: .983/.99/.983/1.0/.92 — (a) REJECTED 0/5: holes
are born HIGH, every one. Two dynamics, split 2/3. s10-h16 aw1/aw4 collapse
EARLY on train length (.983→.873→.827 flat; .99→.833→.863→.847 — the drop
completes by t500, then plateau) AND crater on the ladder (l16 .53/.61).
s10-h24-aw.5, s15-h16-aw4, s15-h24-aw1 are flat-PERFECT on the entire t-traj
(.967–1.0 throughout) — their holes exist ONLY at ladder length (l16
.73/.61/.59 vs t1000 .967/.993/.933). (b) REJECTED-as-framed: on the t-traj
3/5 holes are indistinguishable from passing neighbors (flat-high both) —
the neighbor contrast lives purely on the ladder. (c) CONFIRMED: zero late
falls (all t700→t1000 drops ≤ .02) — nothing that survives to t700 falls.

"Does the hole dose fail early or fall late?" — for 3/5 the question's axis
is wrong: it neither fails early nor falls late ON TRAIN LENGTH; it fails
on length-16. Length-generalization holes, not training holes. Owned
classifier miss: the audit script's "never-learn" fired on two slow-ignite
neighbors (t300 .51/.897 → t1000 1.0) — a fourth dynamic (late ignition)
the charter didn't list; classes renamed, counts kept.

Bar-sensitivity compliance (W268's rule, honored): t-axis bars miss 3/5
holes entirely (pass .95 on train length while l16 reads .53–.73) —
sensitivity computed on the wrong axis is decorative. Hole-bars must be
ladder-indexed (l-length × threshold), reported per cell in W262.

Verdict: USED-strong (axis relocation with exact series + 2+1 dynamics +
owned misclassification + bar-axis lesson). No precursor, no conflict.

## Tangential: audit the axis before the trajectory (0-spend, reasoning)

The charter asked WHEN on the time axis; the answer is WHERE on the length
axis. A trajectory audit on the wrong axis returns "flat-high, no finding"
for the majority of holes — the most dangerous audit result, because it's
true and irrelevant. Rule: before classifying trajectories, verify the
phenomenon EXISTS on the audited axis (t1000-hole? no — l16-hole). W262 maps
the axis it lives on (ladder-edge location per hole, sharp-or-grade).
