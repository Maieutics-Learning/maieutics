# W138exec — pad-mask on assoc (A; backlog-W120)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + 1 live-page bench grid)
- Grid: assocR right-padded len-4→len-10 (60% pads, pad id 9) × {control unpadded, native-pad, mask-pad (E-row zeroing)} × seeds 7–9 × 300 steps; eval unpadded + padded testIn.
- Instrument finding first: AttnModel E has 9 rows (ids 0–8) — pad id 9 reads out-of-bounds (empty slice → zero embedding, OOB grad writes silently dropped). Native pads are ALREADY content-blocked by accident; mask-pad ≡ native-pad bitwise all 6 cells (built-in meter check passes — the no-op theory confirmed).
- The remaining pad channels (attention slots over pad states + eb average dilution over 10 positions) are FATAL: padded-trained models score 0.264 = chance on BOTH evals, all seeds — the skill never ignites. Control: .722/.769/.792 unpadded, chance on padded (test-time pad fragility too).
- Framing: the measured control-vs-padded gap (0.76 → 0.26) prices TRUE masking's headroom — content is already blocked, so attention-exclusion + eb-exclusion is worth up to +0.50. Masking matters more on assoc than parity (W125 native still learned 0.594). Untested boundary: recovery at 1000+ steps.
- Verdict USED strong (fatal-padding measurement + headroom pricing + instrument discovery). No precursor, no conflict. Vendored masked AttnModel (exclude pads from attention + eb; grad check; re-run + long-recovery arm) spawned W137.

## Tangential (reasoning, 0 spend)
- The accident is a method with an expiry date: out-of-bounds-as-mask works today and silently breaks the day E gains a 10th row. Accidental instruments get replaced by explicit ones (W137) before they become load-bearing — the trail found this one in time.

## Spend / queue
- Spend: 0 + 0 + 1 bench grid (~2 min). Consumed backlog-W120 removed; spawned W137 to BACK. Backlog 17. Synthesis R20 clock: 3/5.
