# Ten-experiments v10 — user-countersigned program (agent approval: this file; user countersign: 2026-11-22 "I will countersign 10 experiments that you wish to run")

## Standing
Knobs-v10 (E1–E5) already specced + 3 blind reviews adopted; this file specs E6–E10 and binds all ten into one authorized program. Each experiment gets ledger + verdict + transcript turns + CHATLOG lines. Resume-safe COMPLETE-gated ledgers. Laptop-scale bench (h48, minutes per block in-worker); pools used where they help: blind reviews via pool LLMs (groq/gemini/openrouter), open generation via gemini. No Kaggle-GPU port (would invalidate every filed ledger — new stack = new program).

## E1–E5 = knobs-v10 by reference (spec src/evidence/decomp/knobs-v10-prereg.md)
- E1 K1 attention readout (descriptive): depth-query attention mass on true-binding value position vs query/recency, split correct-vs-echo, 200 reverse lines, 4 filed states (tutor / V1-R2 / R-a-R3 / cycle-collapsed).
- E2 K2 vectors: reverse-direction + echo-direction from rC means on 3 filed states (stacked V1-R2, skill-less DONLY-R2, collapsed cycle-tutor); cosine-across-seeds + Lout-projection + AUC on held-out lines; specificity bar (high AUC on stacked AND ~chance/absent on DONLY/collapsed).
- GATE: K3/K4 run only if K2 validates (cosine-stable + AUC + specificity); else verdict OPAQUE, no steering/ablation.
- E3 K3 steering ladder on V1-R1 (α ∈ {0, ±0.5, ±1, ±2} × state norm): bar B3 climbs +α quorum 2/3, echo falls.
- E4 K4 echo-ablation (orthogonalize echo direction out of E, Wa, L2, Lout of collapsed state): bar echo drops ≥0.20 without further B0 destruction.
- E5 K5 tracking: reverse-direction projection gap across R-a R1/R2/R3 + DONLY-R2 + SHUF-R2 (is stacking == direction growth; do nulls lack it).
- Verdicts READABLE / PATTERN-ONLY / OPAQUE. Cost: eval-only minutes per block.

## E6 round-4 half-life (R-d)
Restore filed R-a R3 params per seed (d-verR-a cks[2]), fresh Adam, 300 steps distill4 (streams rng 18000+s / drng 18100+s, W4 + cycles, same as R-a halves). Eval R4 via runCycleEval. Bars: B3 HOLDS-or-GROWS (R4 ≥ R3 − 0.03 quorum 2/3 → no half-life thru 1200 steps) vs DECAYS (else; report slope R1→R4). Expectation: HOLDS (R-a showed no decay thru 900).

## E7 constraint-dose (W8 single round)
From tutor per seed, one 300-step round with W=8 (streams 15000s/15100s, cycles on) — same cost as V1-R1 but double constraint. Compare B3 vs filed V1-R1 (W4). Bar: B3 W8 > W4 quorum 2/3 (dose helps) vs SATURATES (else). Expectation: SATURATES (AUX8 inert precedent — more weight ≠ more skill).

## E8 multi-seed SNR (seeds 3,4,5)
Full V1 recipe (tutors via runNovelTutor s=3,4,5 + runVerifierV1) on fresh seeds. Tests seed-generality of STACKS beyond the filed 0,1,2 quorum. Bar: B3 R2 > R1 quorum 2/3 AND mean lift within 2 SE of filed (+0.10). Expectation: STACKS (harness has zero drift; CTL replicated bit-identically).

## E9 B1-safe re-eval on filed states
Eval-only: restore filed V1-R2 + R-a-R3 params per seed (0,1,2), score B0/B3 plus B1-buggy (A.gen 5) vs B1-safe (genSafe5) on the SAME stream (14900+s). Closes the contamination question on the load-bearing states. Bar: aligned B0/B3 across streams (sanity) + safe−buggy ≈ +0.20 (repair calibrated). Expectation: REPAIRED (matches b1repair calib).

## E10 shift/parity probes (supervised learnability gate for any future new-ops curriculum)
runGenProbe shift + parity (150 train / 200 test, 800 steps, from scratch). Gate PASS ≥0.50. Filed H1 baseline suggests shift ~systematic-zero / parity ~chance; probes decide whether a curriculum is even worth speccing. Expectation: both FAIL (X BOUNDED stands; no curriculum owed).

## Pre-mortem
Strongest objection: ten parallel threads diffuse the program (breadth over depth). Tripwire: any experiment whose first seed contradicts its expectation by >3 SE pauses the remaining seeds for re-check, not blind quorum-fill. Most likely failure: E7 saturates + E10 fails (both confine rather than extend — still durable bounds).

## Nearest-failure
verS-v10 (differs: cross-teacher/round-structure; here: white-box readout + round-4 + dose + seeds + hygiene + gates).

## Cost
E1–E5 + E9 + E10 eval-only/light trains (minutes each, one worker call per block). E6 one 300-step train ×3 seeds. E7 one 300-step train ×3. E8 three tutors (1200 steps) + three V1 (600 steps) — the only heavy block (~1–2 h total, chunked per seed). All resume-safe.

## Ledgers
src/evidence/decomp/d-knobs-k{1..5}-s{s}.json, d-ten-{rd,w8,snr,b1safe,probe}-*.json, d-knobs-verdict.json, d-ten-verdict.json. Driver: novel-driver.js += readout helpers (K1/K2/K5) + steering/ablation (K3/K4, in-memory weight copies, filed params untouched) + runRound4 + runWDose (one-block generic).
