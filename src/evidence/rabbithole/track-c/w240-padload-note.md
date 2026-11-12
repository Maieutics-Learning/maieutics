# Wave 240 note — backlog-W205 pad-load ladder (bench, executed)

STOP RULE: stopped after 5 pad-load batches (PADN 0/3/6/12/24 x modes control/nativepad/truemask/skipb x seeds 7-10, 80 runs x 300 steps, h16) on the live-page TinyNN assocR rig. 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (vendored w188 rig). Clock: R37 3/5.

## Direct: cliff, not ramp; skipb training invariant; floor anchor + replication receipt

- (a) Floor anchor CONFIRMED: PADN=0, all four modes bit-equal per seed on all 5 metrics (accU .731/.750/.796/.769; accP=accU; HU/X equal). Zero pads = zero difference, as required. The ladder stands on a checked floor.
- (b) Nativepad is a CLIFF, not a dose-response — ramp pre-reg REJECTED, REFINED to threshold: PADN=3 already chance-flat (accU .264 all seeds; HU .223-.270; X .130-.195) and PADN 6/12/24 are identical to 3 decimals (means U .264 / HU .241 / X .158 at every load ≥3). PADN=0 trains fine (=control .762/.517/.324). Threshold sits at ≤3 pads with a flat floor after — no monotone slope to fit, so don't fit one.
- (c) Skipb training is pad-load INVARIANT — scoped CONFIRM: skipb accU/HU/X == control accU/HU/X exactly (3-dec) at every PADN every seed (means .762/.517/.324 constant across the whole ladder). The "bit-identical at ALL PADN" pre-reg holds for train-stream metrics but NOT for padded-eval metrics (skipb accP .762 vs control accP .264 at PADN≥3) — and that gap is eval-protocol, not training: skipb padded-evals use the skip-aware forward (evSkip) while control padded-evals use native forward (chance .264). Same weights class, different eval path. Owned ambiguity, recorded in the tangential.
- (d) Truemask ≈ control on xlong CONFIRMED with a boundary touch: per-seed |dX| ≤ .020 (max exactly .020 at PADN 6-s7 and 12-s7; means +.002/-.010/-.003/-.013). Bonus flag, no dismissal: truemask accU sits slightly ABOVE control at every load ≥3 (means .778/.767/.774/.774 vs .762 — +.005 to +.016, consistent sign). Masking pads during training mildly helps unpadded accuracy here; not claimed as precursor, flagged for W222-side follow-up if cheap. accHP gaps are protocol-scoped (mask-aware vs native eval), not training gaps.
- (e) Control replication receipt CONFIRMED: control accU per seed identical across all 5 PADN batches (s7 .731, s8 .750, s9 .796, s10 .769) and control accX identical too — batches are comparable, the train stream didn't drift between loads.
- Ledger (means per PADN x mode, U/P/HU/HP/X): P0 all-modes .762/.762/.517/.517/.324. P3: control .762/.264/.517/.241/.324, native .264/.264/.241/.241/.158, truemask .778/.777/.529/.532/.326, skipb .762/.762/.517/.517/.324. P6: control same as P3; native same; truemask .767/.771/.510/.513/.314; skipb same. P12: truemask .774/.772/.519/.517/.321, rest same. P24: truemask .774/.781/.512/.515/.311, rest same. Raw: scratch/track-c/w205-pad{0,3,6,12,24}.json.

Verdict: USED with teeth (cliff-kills-ramp + skipb invariance + floor/replication receipts; truemask xlong null holds at the boundary). No precursor, no conflict.

## Tangential: identity claims ship with their eval path (0-spend, reasoning only)

Skipb-vs-control nearly became a false "REJECTED": same trained behaviour, wildly different accP — because the two accPs are computed with different forwards. Any bit-identity claim is really "same weights + same eval path ⇒ same score," and printing only the score hides the second conjunct. Rule: every identity/divergence number prints the eval forward beside it (native / mask-aware / skip-aware), same discipline as printing the seed beside a mean. The W205 ledger above follows it; the W220 "skipb==control exact" bills now read as train-stream-scoped, which is what they were.

## Spend / queue

- Spend: 0 + 0 + 5 batch grids (80 runs x 300 steps; floor). Consumed backlog-W205 removed; spawned W222 to BACK. Backlog 17. Synthesis R37 clock: 3/5.
- W222 (A, bench): pad-cliff edge hunt — PADN {0,1,2,3} x modes {control,nativepad} (+truemask as yardstick) x 6 seeds (7-12), h16 300 steps; is 1 pad already fatal; attention-mass diagnostic on trained nativepad (fraction of attention to pad slots on an unpadded probe) to say whether the cliff is attention-theft or optimization collapse.
