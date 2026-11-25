# Self U31d delta-prereg: monitor-triggered resampling-retry (PROPOSED; NO COMPUTE until battery)

Agent approval: this file. CPU/in-worker only. NO GPU. Pool = sealed reviewer labor only (3x generateText implementability reviews, never training signal). R=3, quorum 2/3, COMPLETE-gated, twin-matched streams, paired evals. Corrections append-only. NO PUSH without explicit order.

## Record-search (already-run / nearest prior / what differs)
- U31b R2MON-VERIFIES (verdict d-newai-self-u31b-verdict.json): round-2 gate predicts failure (CATCH2 2/3) and abstention buys answered-accuracy (+0.08/+0.17, coverage intact). Abstention filters; it never corrects.
- U31c SUBSTRATE-VOID: no value failures exist to substitute toward. Correction cannot come from the value pathway.
- U24(i) fallback-without-selection: re-read excluding the winner did nothing (SELECT-HARD 0-0.03). U31d differs: no re-retrieval, no slot changes — retry is ROUND-2-ONLY with fresh stochasticity, and selection among attempts is label-free majority (self-consistency), not a learned head.
- What differs vs ALL prior waves: first correction-side policy (answer again, differently) rather than filtering (abstain) or exclusion (veto). Zero new trainable params: reuses filed U31b R2MON weights.

## Design
- Frozen: everything (U28 S/C/INH/HF per seed + trunk M/MP/HDold + minerHF + U31b R2MON weights from d-newai-self-u31b-r2mon-s{seed}-800st.json). NO trains (0T). Eval-only wave (3E).
- Forced attempt (per hard row, U31b-identical): standard evalMasks (91000+seed family), retrieval -> vhat_f, x2 -> p, round-2 -> ok_f. Must reproduce U31b forced numbers EXACTLY (DETERM bar).
- Selective-retry policy (label-free): if p >= 0.5 answer forced attempt. If p < 0.5: draw K=3 fresh round-2 mask-sets from retry rng (base 92000+seed, continuing; each = 5x Float64Array(48), same 2/0 scheme as evalMasks), run round-2 3x, answer majority vote (ties -> forced attempt's answer; tie rate reported).
- Modes per seed (same N=200 miner-mined 66300 rows, 72000-family slots — U31b-identical): forced / sel-retry / all-retry (majority on EVERY row, non-binding context: if sel == all, gate's value is cost only) / P1 (permuted-p selection, U31b SHIFT store replay, non-binding).
- 0T + 3E + probes (determinism, tie rate, cost) + verdict d-newai-self-u31d-verdict.json. Transcript extras Turn-140 + CHATLOG + CURRENT_TASK. NO PUSH without explicit order.
- Compute: CPU/in-worker only; eval-only trunk forwards (~4x round-2 on ~15-30% of rows + forced repro). COMPLETE-gated.

## Paper predictions vs bench predictions (divergence-WHY owed)
- Self-consistency (label-free majority) is the bench hypothesis, not a paper import: if round-2 errors are partly mask-stochastic, majority over fresh masks corrects some; if errors are systematic composition failures, retry changes nothing (RETRY-DEAD) and we have bounded error stochasticity — still a finding.
- Henson #8: gate selects WHO retries; correction happens downstream of verification. WHY owed if LIFT holds without gate-dependence (P1 catches this: shuffled selection matching real selection = gate adds nothing over retry-all).

## Bars (quorum 2/3 unless noted)
- U31d-DETERM: hardAdaptY_forced + hardSelectHit EXACTLY equal U31b/U28 same-seed values 3/3 (harness sanity; VOID on trip).
- U31d-LIFT: hardAdaptY_sel-retry minus hardAdaptY_forced >= +0.05 2/3 (N=200, SE~0.03; modest because only predicted-fail rows change).
- U31d-WALL: hardSelectHit EXACTLY equals U28 same-seed 3/3 (retrieval untouched; retry never touches slots or masks-91000 stream).
- U31d-COST (report + sanity): mean extra round-2 forwards per hard row <= 3.0 3/3 (by construction <= 3*shutRate <= 3; filed for honesty, not stringency).
- U31d-FRESH: battery health 4/4.
- P1 (non-binding, reported): lift with permuted-p selection; sel minus shuf reported. If shuf ~= sel, gate adds nothing over retry-all (file WHY; verdict can still be RETRY-WORKS via all-retry context).
- Verdicts: RETRY-WORKS (LIFT holds) / RETRY-DEAD (LIFT fails: errors deterministic at bench scale) / VOID (DETERM or WALL trip).

## Staging + budgets
- Battery on THIS file first (3x sealed) -> v1.1 pins-only. Then driver ext (runU31dEval, no new params so no grad-check; determinism repro is the check) + 3E + verdict. Transcript extras Turn-140 + CHATLOG + CURRENT_TASK. NO PUSH without explicit order.

## v1.1 pins (battery 3x: R1 NEEDS-PATCH + R2/R3 IMPLEMENTABLE; adjudicated same session)
- P1a GATEVAL bar (binding; answers R1+R3 gate-vs-retry confound): hardAdaptY_sel >= hardAdaptY_all minus 0.02, 2/3, with cost ratio reported (extra-forwards sel vs all). Verdicts split: RETRY-WORKS+GATE-VALUABLE (LIFT + GATEVAL hold) vs RETRY-WORKS+GATE-PLACEBO (LIFT holds but sel ~= all ~= shuf: gate is efficiency-only, retry still works).
- P1b tie reporting (partial adoption; policy unchanged): tie-rate is a primary reported metric; LIFT reported both with-policy (ties->forced, conservative by construction: can only underestimate lift) and tie-excluded (strict-majority attempts only). R1's subtract-demand is satisfied by the tie-excluded reporting, not a policy change.
- P1c DETERM clarification: compares rounded-to-4dp filed values (exact match of rounded values). Harness is deterministic (fixed rng bases), so bit-identity is expected; no epsilon needed at 4dp.
- P1d chance math (R2 threshold concern REJECTED as bar move; math filed instead): per-seed P(lift>=0.05 | null, SE~=0.035) ~= 0.077; quorum 2/3 -> joint ~= 0.017. Bar stands; verdict cites this math.
