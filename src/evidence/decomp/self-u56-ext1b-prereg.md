# U56-EXT1b prereg v1.0 — veto-leak sidecar (split-bias + balanced switch-only calibration)

**Track:** U56-EXT1b (veto-mapping redesign #2; answers U54 D3 + the A-leakage question). **Cover:** user 2026-11-26 "go ahead and lets do one and 2" = prereg + 10x battery + driver. NO veto-fit compute until fresh countersign. NO PUSH without separate explicit order. Runs in the gaps of the detector track; touches no detector files.
**Question:** was the U53/U54 A-leak (vetoA 0.050–0.063 from shared-bias + B-heavy starvation) an artifact of the veto's training setup — i.e. does a decoupled veto learn AND HOLD nuA≤0.05/nuB≥0.9 under balanced supervision?

## Design (frozen everything except 2 veto weights)
- **Frozen:** U54 Phase-1 checkpoints (ckpts 0.585/0.555/0.555, byte-exact reload, PIN 258d2f06, HALT on mismatch). Trunk never trains.
- **VETO3 (the fix):** nu = sig(w[ctx]) — TWO params (wA, wB), NO shared bias (the shared spring is cut: B-rows cannot drag A up, by construction, not by hope). Init wA=wB=0 (nu=0.5 — must learn, nothing gifted). lr=1.0, 800 steps, loss = BCE(nu, ctx) on a BALANCED 50/50 A/B row stream (A rows need no trunk forward at all — pure 2-param logistic fit; trunk enters only at eval). This isolates the leak question to the mapping + supervision, with B-heavy starvation removed.
- **Streams (N=20 rule):** 20 veto-training streams per checkpoint (3 checkpoints × 20 = 60 fits, seconds each). Per-checkpoint verdict from the 20-fit mean. Quorum 2/3 checkpoints.
- **Eval (frozen, U54 Phase-3 probes verbatim):** same streams 53400/53500/53100+seed, N=200: CTX-A (label y), CTX-B (label 0 via blend K=10, same output-blend), RET-A. vetoA = mean nu over RET-A inputs.

## Bars (U54 A1-relative, floor scoped per D3 — veto arm only, no noveto/global drag exists here)
- LEAK-CLEAN: vetoA ≤ 0.05 AND |RET-A − ckpt| ≤ 0.02 at quorum (2/3 checkpoint means).
- LEAK-CTX: CTX-A ≥ ckpt−0.03 AND CTX-B ≥ 0.95 at quorum.
- LEAK-FLOOR (D3-scoped): veto CTX-A ≥ 0.45 per checkpoint (guard against degenerate collapse; no other arms exist to drag it).
- LEAK-PIN: stack 258d2f06 + checkpoint byte-identity + trunk-frozen assert (grad check: trunk grads exactly 0 — veto-only by construction).

## Waves
- Wave 0: driver load-check + veto BCE gradcheck (numeric vs analytic) + twins (12/12 incl. determinism) + probe-stream identity vs U54 (same RET-A inputs hash).
- Wave 1: 60 veto fits COMPLETE-gated.
- Wave 2: 60 evals (3 probes × 20 fits… per checkpoint: eval each of the 20 fitted vetoes, mean) + verdict.

## Verdicts
- LEAK-FIXED: CLEAN + CTX at quorum (+ FLOOR holds) → E-EXT2 LICENSED (split-bias veto inside full Phase-2 B-heavy training). P5 REMAINS CLOSED until E-EXT2 itself ADVANCEs at quorum under B-heavy — FIXED here is a gate pass on balanced supervision, never a reopen (R1 10x OVERCLAIM accepted; the old "P5 REOPENS" wording is retracted as an overclaim).
- LEAK-PERSISTS: vetoA breach at quorum DESPITE decoupled + balanced → the leak is deeper than setup (mapping or blend pathology); P5 stays closed, E-EXT2 not licensed.
- FLOOR-FAIL / PIN-FAIL guards as filed.
- NOTE (honesty): balanced supervision is EASIER than B-heavy — FIXED here is necessary but not sufficient for P5 (hence E-EXT2, not direct reopen). PERSISTS here is sufficient to keep P5 closed.

## Falsifiers
- If decoupled+balanced still leaks at quorum, no veto-parameterization of this blend family is licensed without a new mechanism (steep sigmoid, hard gate, or architectural change — each needs its own prereg).
- Threshold changes after Wave 0 need a new version + battery + countersign.
