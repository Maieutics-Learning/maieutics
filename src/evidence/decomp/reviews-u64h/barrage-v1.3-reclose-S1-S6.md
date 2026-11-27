# Re-close verbatims U64h v1.3 (S1–S6, sealed)

--- S1 ---
STANDS

--- S2 ---
NEEDS-PATCH

1. Mathematical contradiction between K6 diagnostic and Gate 2: The K6 baseline is set at 0.42 (63/150), but the design specifies a "floor 0.40". If the floor is the operational limit for precision, the 0.42 baseline lacks sufficient headroom to distinguish a "hit-window" from the noise floor, rendering the K6 check statistically indistinguishable from the floor.
2. Quorum/Gate 2 inconsistency: Gate 2 requires +0.03@quorum, yet the design specifies a "refractory 20, cap 6, K=10 blind" setup. A quorum of 10 (K=10) against a cap of 6 creates a logical impossibility for hit-aggregation unless the quorum refers to the total read count (20), in which case the +0.03 precision gain is mathematically insignificant/unstable across the 80-read sample.

--- S3 ---
STANDS

--- S4 ---
STANDS

1. orTrig (124) is a valid positive control; the premise explicitly rejects the "guaranteed-control" kill by noting shared response across 16/20-classP, validating the control's role in the shared-weight architecture.
2. Shared weights with disjoint draws are sound; the "disjoint-ambiguity" is resolved by the four-verdict attribution table, ensuring the experimental arms are distinguishable despite the shared underlying data trunks.

--- S5 ---
NEEDS-PATCH

1. SENSOR-DEAD verdict is self-contradictory: H1 defines `meanTrig ≥ 3` and `meanHits < 1`, but H3 (the terminal branch of the H-tree) is left undefined/empty, rendering the terminal state for the "DEAD" path logically incomplete.
2. Gating is potentially non-deterministic: Gate 2 requires `+0.03@quorum accRec-only`, but no specific quorum threshold or baseline for `accRec` is defined in the filed design to calculate this delta, making the transition from Gate 1 to a final verdict unrunnable.

--- S6 ---
NEEDS-PATCH

1. Failure to satisfy 5-gate requirement: v1.3 implements a TWO-GATE system (detectRate/meanFA and quorum accRec), missing the required silence, graded, tracking, and sensor-triggered-only gates.
2. Sensor-validity violation: The design specifies "reads-only re-evals on shared filed det trunks," which contradicts the sensor-triggered-only rule by relying on pre-existing data trunks rather than active, sensor-driven triggers.

Adjudication: 3 STANDS / 3 NEEDS-PATCH, all three rejected with derivations —
S2.1 category error (0.42 precision-over-triggers vs 0.40 accuracy-over-slots:
different units, no headroom relation); S2.2 invented quantities (K=10 blind
slots ≠ quorum; quorum is 15/20 seeds throughout; +0.03 is per-seed @quorum with
filed chance math); S5.1 else-branch complete (H1: trig≥3&hits<1; H2: trig<1;
H3: otherwise — partition covers all; follow-up stated); S5.2 filed twice
(+0.03 vs filed dice.accRec @15/20, Gate-2 line and premise); S6.1 mapping
(silence = FA cap on stable stretches; graded/tracking = D-graded; sensor-
triggered-only = Gate-1-first ordering + verdict-field enforcement — requirements
implemented, not gate-proliferated); S6.2 category error (filed-vs-live applies
to artifacts; sensor triggers fire live in-exam). Barren re-close → battery CLOSED.
