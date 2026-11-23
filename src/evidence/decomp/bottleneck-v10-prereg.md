# Bottleneck game v10 — teaching through a noisy narrow channel

Agent approval: this file. Pre-countersignature: 2026-11-22 STEP 2 (bench-scale
laptop prototype, in-worker JS compute only; no GPU).

## Why (which failure it answers)
Every setup so far lets the student win by single-pass pattern-matching, so
pattern-matching is all gradient ever builds (flat compilation, OPAQUE knobs,
W1 EXHAUST). This setup makes memorization LOSE in the loss itself: the teacher
must compress everything the student needs into a K-dimensional message with
noise on the line. Either the binding operation survives compression (rule
found) or it does not (skill was distributed all along) — both informative.

## Design (VIB-style; no new discrete machinery)
- Teacher: filed tutor (FROZEN, arm T-frozen) or jointly-trained copy (arm
  T-joint). Message = linear projection of teacher final state to K dims +
  Gaussian noise sigma (the bottleneck knob; gradient flows, no Gumbel needed).
- Student: fresh MiniMLP (new ~80-line in-driver model: [message(K) +
  onehot(query token,9)] -> 96-wide silu -> 4-class; manual backward reusing
  nn.js math shapes, Adam 5e-3). Sees ONLY message + query — never the pairs.
  Parroting is structurally impossible.
- Train: assocR pairs, reverse-question (same B3 skill as the main line).
  Teacher (joint arm) + projection + student end-to-end on answer CE.
- Test: NOVEL pairs (unseen bindings, same operation) + dose curve over
  (K in {1,2,4,8}) x (sigma in {0, 0.5, 1.0, 2.0}).

## Bars (ledger d-bottleneck-verdict.json; 200-line batteries, R=3)
- COMPRESSES: frozen-teacher arm, novel-pair B3 >= 0.60 quorum 2/3 at some
  (K<=4, sigma>=0.5) cell → the filed skill compresses to a noisy few dims;
  the rule survives the channel. Expectation: uncertain (filed as 40/60
  toward FAIL — continuous dims smuggle; noise is the teeth).
- Dose: accuracy monotone non-increasing in sigma per K (sanity; if violated
  the knob is not a bottleneck).
- Controls: K=48 sigma=0 (wide clean ≈ student-on-teacher-state, should be
  ~1.0 — proves the student CAN read); scrambled-message (chance — proves it
  reads the message, not the query).
- Verdicts: COMPRESSES / DISTRIBUTED (needs width: skill real but uncompressed)
  / FLAT-FAIL (even wide fails: student can't read teacher state at all).

## Nearest-failure
AUX priced-intermediates (differs: aux graded ignorable internal states;
here the message is the ONLY input — load-bearing by construction).
REC attention-free (differs: removed substrate; here substrate kept,
information restricted).

## Cost
Prototype in-driver (~150 lines: MiniMLP + projection + noise + battery);
trains are tiny-MLP cheap (minutes per cell, one worker call per cell-block,
resume-safe COMPLETE-gated ledgers).

## Ledgers
`d-bottleneck-*.json` + verdict, driver additions, this spec. Transcript +
CHATLOG + CURRENT_TASK as usual. NO PUSH without order.
