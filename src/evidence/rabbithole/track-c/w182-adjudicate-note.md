# W182exec — sign-vs-lottery adjudication (A; backlog-W157)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + 1 powered sandbox replication, floor)
- Original-conditions rebuild (W101: scalar recurrence, train-a-only, init-skew ±{0.2,0.9,1.5}, 40 seeds/cell = 960 runs): stuckRate = 0/960. Every mismatched init flips freely — the natural scalar-RNN parametrization has NO zero-barrier, so capture is impossible in it by construction. IF W101's toy was this toy, its single-seed cells were lottery.
- Calibration warning (recorded, bounds MY replication, not W101): my POS task is exactly representable (a*=1 gives ZERO per-example residual → gradient noise self-quenches → all 480 pos runs snap to 1.000) while my NEG task is misspecified (a*=−1 leaves residual 4/example → perpetual jitter, spread [−1.27,−0.77]). Sign result unaffected (100% correct signs everywhere), but the two tasks were never comparable — "both tasks" framings must check representability per task.
- Mechanism audit (why the bench never saw it): capture REQUIRES a zero-barrier (fixed-sign parametrization, abs/mult-gates, saturation). W142's symmetry theorem already proves sign-unobservability for smooth models; W162's empty map confirms it. W101's note specifies no barrier mechanism → its capture, whatever produced it, does not transfer to smooth models.
- Hard probe (len-4): optimum shifts to magnitude compromise (neg −0.45) — at depth the question dissolves from sign into magnitude fitting. Sign matters least where the task is hardest.
- Verdict USED (powered-n null + learnability caveat + barrier audit + scope retraction). No precursor, no conflict. The W121 protocol is RETRACTED as a general default, SCOPED to zero-barrier parametrizations (specify the barrier or drop the protocol). Zero-barrier catalog (which shipped parametrizations CAN capture; bench) spawned W174.

## Tangential (reasoning, 0 spend)
- A protocol is a claim about a mechanism, and the mechanism here was never written down. W121 built a beautiful procedure on top of W101's missing equation — four waves of stratify-by-sign later, the ledger collects either a barrier or a retraction. This is the collection.

## Spend / queue
- Spend: 0 + 0 + 1 powered replication (floor). Consumed backlog-W157 removed; spawned W174 to BACK. Backlog 17. Synthesis R27 clock: 5/5 FULL — R28 synthesis next (queue-jump, state untouched).
