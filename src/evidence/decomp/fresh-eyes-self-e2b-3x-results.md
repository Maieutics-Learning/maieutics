# Fresh-eyes battery: self-e2b-controls-prereg (3x sealed; 1x IMPLEMENTABLE + 2x NEEDS-PATCH → v1.0 STANDS + pins)

Goal line carried in thinking + all 3 prompts: "The final goal is we are building a machine that learns by itself — continuity + selection + appetite living in weights + forward pass, tools as controls only."
Sealed via root.generateText Promise.all (3 parallel). Round-1 generic FAIL discarded as off-brief (graded program history, not E2b implementability; see adjudication). Round-2 on full spec below. Raw: scratch/e2b-battery-raw.json (verbatim below). Health: goalInAll true, nonEmpty 3/3, hasVerdict 3/3, distinct true.

## R1 — NEEDS-PATCH (verbatim)
(a) Implementability: High. The design relies on a forward-only state update ($m_{t+1}$) and a frozen backbone. Since momentum is treated as a state variable (non-differentiable relative to the oracle/correctness gate), it avoids the vanishing gradient problem and complexity of backproping through a discrete success trigger.
[Second-round R1 — full-spec review]
1. Implementability: YES. Frozen-load is read-only; JS in-worker handles 12×N=200 + seed-matched permutations.
2. Bar math: WEAK. N=200 insufficient for +0.05 (high variance). Quorum 2/3 on R=3 too tight. HARD>=0.60 reasonable.
3. Leakage: NO. No retrains, no optimizer; forward-only, fixed weights.
4. Confounds: priming (C3≈C4 = general priming not sequence-dependent). Cheapest killer: C1 vs C2; if Δ≈0 momentum dead.
Verdict: NEEDS-PATCH — N>=1000, R>=5 or relax quorum, define hard filter.

## R2 — NEEDS-PATCH (verbatim)
1. Implementability: Yes. Read-only buffers, 12-eval loops, seed-offset twin-matching trivial.
2. Bar math: Questionable. N=200 too small for 5% Δ at 2/3 quorum; noise floor exceeds signal. HARD>=0.60 harsh but clear.
3. Leakage: None. Frozen weights, no optimizer.
4. Confounds: shuffled order may induce caching/memory-alignment artifacts. Cheapest killer: C1 vs C2 first; if Δ≈0 abort.
Verdict: NEEDS-PATCH — N min 1000 or relax Δ, define twin-matched explicitly.

## R3 — IMPLEMENTABLE (verbatim)
1. Implementability: Yes. Static weights + 4 control flags; twin-matching N=200 trivial CPU.
2. Bar math: Sound. N=200 low but sufficient with seed-matching. Quorum 2/3 standard. HARD>=0.60 reasonable floor.
3. Leakage: Zero. No optimizer/gradient.
4. Confounds: seed-leak (permutation RNG independent), CPU float drift. Cheapest killer: single-stream frozen-m vs sequential; if Δ<0.01 abort rest.
Verdict: IMPLEMENTABLE

## Adjudication (agent): v1.0 STANDS + pins (no train/eval changes)
- N/R/quorum: REJECT as method (standing discipline N=200 paired + R=3 quorum 2/3 used U22→E2; comparability beats power; bars are heuristic gates, pre-graded as convenience; SE~0.035 noted in prior verdicts; pooled 6-seed synthesis at verdict time).
- ADOPT as pins: (P1) permutation RNG 81000+seed independent of mine/data RNGs (71300+seed, 61000+seed, 72300+seed); (P2) twin-matched = same 200 mined episodes, seq order fixed, shuf = Fisher-Yates perm of same indices; (P3) hard filter = u23bVhatKeep verbatim (vhatM!=e.v AND oracleY correct, argmax-only, 20 tries + fallback counted).
- Proceed to driver ext + control evals. Killer order adopted: run C1 vs C2 first in log, abort rest only if driver crashes (no early-stop on numbers — COMPLETE-gated).
