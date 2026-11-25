# Self U30 delta-prereg: wide-encoding separability (PROPOSED; pre-countersigned, battery next)

Agent approval: this file. Pre-countersignature (user 2026-11-25): this spec + battery (3x sealed) + driver ext + stage-1 + 6T+6E + verdict + up to 2 gap-closing extras under same bars/discipline. CPU/in-worker only. NO GPU. NO PUSH without explicit order. Pool = sealed reviewer labor only. R=3 seeds 0,1,2, quorum 2/3, COMPLETE-gated, twin-matched seed-only streams, paired evals. Corrections append-only.
Standing orders in force: (a) push only on order; (b) every paper-divergence gets a filed WHY; (c) log everything for contextless replay.

## Record-search (already-run / nearest prior / what differs)
- SELECT wall + U28 diagnosis: MAX-PARTIAL (SEPARATES 2/3, USE 2/3, SELECT-HARD 0/3 0.235/0.07/0.36, COMPETE 0/3 margins -0.022..-0.028). Filed next: query-conditioning (U29) OR wider encodings (THIS file).
- Width evidence: h96 students 5/8 vs h24/h48 8/8 (wider failure repertoire at top, CIs overlap — no scale collapse, scope-bound); C7 single-trunk auxW0.5 pick FIRST 2/3 hold on two 0.60; U22c scales-PARTIAL (ratio costs fwd, buys shift once; wall structural).
- Retrieval bed: Kim #5 assembly-specific competition needs separable assembly codes — 8-dim shared enc may lack headroom for 250 slots + 5 true; To #8 / Cohen #9 separable substrates kept. Salan #10 variation endorses broad diets (already in U23b mining).
- What differs vs U28: IDENTICAL routing/loss/diet/streams/evals (detached CE + max-hinge Lmax margin 1.0 adapt-only, codes 175/176 fresh, train mine 68300+seed, held-out 69300+seed N=200, std N=200 twin-matched, OOD frozen scale, VOID iff oracleY<=0.20 2/3), IDENTICAL content-only INH family, ONE capacity delta: S wide 4->12 (enc 12-dim), C 12-dim linear, INH MLP 12->6 silu ->1 softplus, HF input [h(48) | summary(12)] = 60 -> 24 -> 4. New arm-code rng offsets (78000/78100/79000/78520 + seed*7919 + armCode*131). No loss change, no conditioning change — isolates ENCODING-CAPACITY (8-dim vs 12-dim) with pressure + routing + diet held constant.

## Design
- Frozen: W6-s / M2-nb-s; frozen U17 L* teacher; frozen U5-old head; frozen U21-lowfold miner; frozen U22c-scale OOD. Same loads as U26/U27/U28.
- Trainable: S-wide (4->12 silu-gated same form, init same family wide) + C-wide (w12+b) + INH-wide (MLP 12->6->1 softplus) + HF-wide (60->24->4).
- Forward (codes 175 comp / 176 shuf): u26PoolForward verbatim with Ndim=12 (enc, scores = C-wide - inh, soft pool tau1.0, summary 12-dim, combiner 60-dim). Contrastive Lmax identical (min_true - max_dist, margin 1.0, two-slot, lowest-index tie-break).
- Backward routing: identical detached split (CE/MSE stops at INH; hinge to S+C+INH), shapes extended to 12-dim. Grad-check FULL NEW (all wide shapes numeric).
- Diet/streams/evals: IDENTICAL to U28 (8+8 B=16 800st/lr5e-3/clip1.0; mine 68300+seed; held-out 69300+seed N=200; std N=200; OOD; miner/oracle; shuf shift-by-1).
- Arms: u30-comp vs u30-shuf. 6T + 6E + OOD + probes.
- Controls: zero-inh ablation; frozen-scale OOD (GAP); narrow-vs-wide direct contrast (U28 comp rows re-scored under same held-out episodes where episode-compatible — report only, not a bar, streams differ so not twin-matched).

## Paper predictions vs bench predictions (divergence-WHY owed)
- Kim #5 predicts: wider separable codes should let max-driven suppression open strict rows where 8-dim could not. Bench prediction: U30 COMPETE + SELECT-HARD rise vs U28. IF SELECT rises but COMPETE stays 0: file WHY (ranking without exclusion — pool/combiner at fault). IF neither moves: file WHY (capacity not the wall — binding/conditioning is; U29 decides).
- Cost risk pre-registered: wider S/C/INH/HF = more params on same 800st budget; CE path unchanged so STD/HARD protected. IF HARD drops vs U28: file WHY (optimization tax vs gain trade; 1400st extension is U30b, not this file).
- SEL tripwire unchanged: content-only wide INH cannot index-memorize; hard-shuf gap catches cheating.

## Bars (quorum 2/3 unless noted)
- U30-SELECT-HARD >= 0.80 2/3 (THE wall bar).
- U30-COMPETE strict >= 0.50 2/3.
- U30-INHIB-USE >= 0.05 2/3. U30-INHIB-SEPARATES >= +0.10 2/3.
- U30-SEL >= +0.05 2/3. U30-HARD >= 0.60 2/3. U30-GAP >= 0.15 2/3.
- U30-SUMMARY-HARD >= 0.05 2/3. U30-STD within +-0.05 of W6 2/3.
- U30-FRESH battery 4/4.
- Verdicts: WIDE-COMPETES / WIDE-PARTIAL / WIDE-FAIL (WHY owed: conditioning or top-k next) / VOID.

## Staging + budgets
- Battery on THIS file first (3x sealed) -> v1.1 pins-only.
- Then grad-check + stage-1 + 6T + 6E + verdict d-newai-self-u30-verdict.json. Transcript + CHATLOG + CURRENT_TASK. PUSH only on order.
- Compute: CPU/in-worker only, ~6x800st + evals, COMPLETE-gated.
- Extras pre-countersigned (max 2, same discipline): U30b 1400st extension (if wider learns slower but gaps opening); U30c top-k-max hinge on wide codes (if max still chases one mode).
