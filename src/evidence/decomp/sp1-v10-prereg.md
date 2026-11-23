# SP1 v10 — single-pass scratchpad probe (FROZEN for review battery)

Agent approval: this file. User countersign: 2026-11-23 pre-countersign ("you also wanted to do the scratch pad too" — confirmed: this is the architectural track). Scope: SP1 = 3 units (R=3 full trains, single-pass composed diet). Quorum 2/3; CPU-only; NO PUSH.

## Why (the wall behind every harness)
Every ceiling so far (T7 0.85, O3 0.91) is a TWO-pass harness: pass-1 writes vhat into the scratch slot, pass-2 reads it. Composer2 verdict: the wall is structural — "single-label readout (no place to write v down)". SP1 tests whether a single forward pass invents its own scratch slot: train one model that must retrieve AND add with no v anywhere in the input, then probe its intermediate positions for v-decodability.

## Design
- Diet (all 3 seeds): 150 e.x lines (dummy-format flat+[qk,k,0,8] — v NEVER shown as input; v lives only in flat as v+4 token next to qk) + 150 fwd (frng 52300+seed), T labels, auxW 4.0 (cb-matched so the only delta vs cb is the absence of true-v lines), 800 steps, trainSeed 55100+seed. Driver: runSP1Train (ledger d-sp1-s{seed}.json, params saved).
- Eval (runSP1Eval, ledger d-sp1-eval-s{seed}.json): (1) COMPOSED acc: single forward pass on 200 e.x test lines (srng 52500+seed — identical to harness lines); (2) SLOT-PROBE: for each cache position p in 0..9, vhat_p = scratchArgmax(posOut[p].logits), decode-acc vs true v; report best-pos acc + which position.
- Guard: probe positions capped 0..9; positions whose logits length < 4 skipped openly (decode undefined).

## Bars (quorum 2/3; verdict d-sp1-verdict.json)
- SP1-SLOT (primary, conjunctive): composed ≥ 0.60 AND best-pos v-decode ≥ 0.70 (both, 2/3) → EMERGENT-SCRATCH (the pass invented a slot) else NO-SLOT.
- Mechanism note (descriptive either way): which position decodes best (8 = harness slot reused? elsewhere = new slot? nowhere = no slot).

## Expectation (filed open)
NO-SLOT 3/3 (composed ~0.4–0.55 — the old retrieve-into-scratch band; decode ~chance everywhere). The structural wall confirmed with mechanism. An EMERGENT hit would be the biggest surprise of the program.

## Nearest-failure
- Composer2 WALL-BOUNDED (differs: escalations around a joint readout; SP1 removes the harness entirely — single pass, no vhat injection).
- S1 joint HOLDS (differs: joint training WITH both skills in input; SP1 withholds v — strictly harder, tests invention not mixing).
- T2 copying shortcut (differs: T2 saw true v; SP1 never does — the shortcut is unavailable by construction).

## Amendment v10.1 (pre-compute pins; blind battery 2026-11-23 — 3x CONDITIONAL)
- C1 rejected with precedent (pass-1 retrieve IS the copy baseline).
- C2 adopted as lens: ledger adds best-pos mean entropy; bar unchanged.
- C3 adopted: EMERGENT / COMPOSED-WITHOUT-SLOT / NO-SLOT.

## Cost
3 trains + 6 evals (composed+probe × 3), COMPLETE-gated. NO PUSH.
