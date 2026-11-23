# Scratchpad v10 — write it down before adding (FROZEN for review battery)

Agent approval: this file. User countersign: 2026-11-23 "go ahead and add those in" (bench scale, in-worker/CPU only; R=3 quorum 2/3; NO GPU; NO PUSH without explicit order).

## Why
Five escalations (labels, variety, steps, ratio, width) all fail quorum on shift; best single 0.585 (X2); joint-holds, lure-avoided, length-flat everywhere. Diagnosis: a single-label head with nowhere to write the retrieved value down before adding. This track gives it a place: a scratch slot in the input whose per-position readout is supervised to name v, with the final head answering (v+k)%4. No tinynn changes (existing prefixLabels + forward cache), just format + two-pass harness eval.

## Design (attn from scratch, probe recipe: 150 fwd 1..3 + 150 shift-scratch, 800 steps, batch 16, lr 5e-3, attnAux true, auxW 1.0)
- Format: shift-scratch line x' = flat(3 distinct pairs) + [qk, k, scr, 8], len 10. Train scr = dummy 0 always (never teacher-forced: the model must produce v, not read it). Tokens all < 9 (scr domain 0..3 reuses key tokens; position disambiguates). Forward lines unchanged (len 4/6/8).
- Arm T SCRATCH: prefixLabels = filed A.bindLabels on forward lines; on scratch lines bindLabels on the flat value positions + v at idx 8 (the scr slot), found by key lookup in flat. Dual supervision, one pass.
- Arm U SLOT-ONLY (rival control): S1-identical supervision on identical nested data (same rngs 52200/52300/52600+seed; len-10 lines get bindLabels on flat only, scr slot null). Slot present, scratch unsupervised — isolates supervision-vs-slot.
- Evals (frozen, seed-matched; shift tests nested-identical to S1's via same 52500+seed draws + scr insert; fwd 52400+seed):
  - scratch-acc: argmax posOut[8] == v (pass 1, dummy scr).
  - one-pass final: argmax final logits on x' (internal carry only).
  - two-pass final: v̂ from pass 1 → x2 = flat+[qk,k,v̂,8] → argmax final.
  - oracle final: x2 with true v (isolates the add-step).
  - fwd standard. Len battery carried (2p/4p scratch lines, rngs 52800/52900) for two-pass only (cheapest informative slice).

## Bars (quorum 2/3; verdict d-scratch-verdict.json)
- SCRATCH-READS: T scratch-acc >= 0.80 (retrieve-into-scratch works; forward precedent ~0.85).
- ONE-PASS: T one-pass final >= 0.60 (beats best single 0.585 — internal carry suffices).
- TWO-PASS: T two-pass final >= 0.60 (explicit scratch enables compose).
- SLOT-CONTROL: T two-pass - U two-pass >= +0.05 (supervision, not slot).
- FWD-HOLDS: T fwd >= 0.75 AND U fwd >= 0.75.

## Expectation (filed open)
SCRATCH HIT (~0.85); ONE-PASS MISS-or-near (~0.55 — internal carry weak, the predicted bottleneck); TWO-PASS HIT (~0.7+ — explicit conditioning carries); SLOT-CONTROL HIT (U ~ S1 ~0.5). Net: learned retrieve + harness compose, internal carry named as the next wall (recurrent-carry precedent assocC).

## Nearest-failure
- X1 process (retrieve labels, no slot: 1/3, best +0.065; differs: scratch makes the retrieved value addressable at eval, not just train-time shaping).
- X2 variety (best mean 0.547; differs: mechanism over dose).
- verS AUX8-inert (aux dose nothing; differs: aux here creates an eval-readable scratch, not a duplicate loss — E1/Lane1 lesson).
- assocC carry (notebook discipline "don't drop the note"; differs: query-conditioned value scratch vs latest-key carry).

## Cost
6 trains (~2-2.5 min each) + 12 evals (standard+len, 4 metrics from 3 forwards/line), COMPLETE-gated. Driver: runScratchTrain (T/U) + runScratchEval (+Len). New track, new budget (≤5 extras post-verdict). NO PUSH.
