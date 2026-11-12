# W91exec — ponder-price calibration (A/B; backlog-W81, bench: src/tinynn)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + bench measurement, gated-unblocked)
- Measured (assocR, attn h16/m32/d8, 80 steps, batch 8, seed 7): L0 plain 1.56ms/step (loss 1.493→1.114, acc 0.778); L1 +attnAux 1.55ms/step (3.285→1.404, acc 0.764); L2 +prefix 1.55ms/step (3.761→1.950, acc 0.745); L3 attnAuxW4 1.63ms/step (9.138→3.090, acc 0.528).
- Finding: hint levels cost ~NOTHING in wall time (aux losses are cheap next to the core; 1.55→1.63). W71's levelCost [0,1,2,4] as COMPUTE is wrong — real compute price ≈ flat [1,1,1,1]. The true price is DISTORTION: auxW 4.0 derails the objective (acc 0.528 at 80 steps). Reprice hint levels in distortion-risk, not milliseconds; the fade schedule already anneals exactly the right thing (supervision weight, not compute).
- Verdict USED (bench repricing). Distortion-aware aux-weight schedule spawned W98. No precursor, no conflict.

## Tangential (reasoning, 0 spend)
- The budget accountant (W71) was pricing the wrong currency: it taxed compute while the real spend was gradient-signal. Meters again (6th instance): price what derails, not what ticks.

## Spend / queue
- Spend: 0 + 0 + bench (~30s). Consumed backlog-W81 removed; spawned W98 to BACK. Backlog 17. Synthesis R12 clock: 4/5.
