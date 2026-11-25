# Self U26 delta-prereg: per-content assembly inhibition (PROPOSED; NO COMPUTE until battery)

Agent approval: this file. CPU/in-worker only. NO GPU. Pool = sealed reviewer labor only (3x generateText implementability reviews, never training signal). R=3, quorum 2/3, COMPLETE-gated, twin-matched seed-only streams, paired evals. Corrections append-only. Push after verdict per standing order.
User standing orders in force: (a) push after each model; (b) whenever results differ from papers read, file WHY; (c) log everything so a contextless self can replay without guessing.

## Record-search (already-run / nearest prior / what differs)
- SELECT wall, all attempts: U22a wide 0/3, U22b funnel 0/3, U22c scales 0/3, U23 0/3, U23b SELECT-HARD 0/3 (kept-only split 0-0.03 Turn-118: wall is NOT dilution), U24 SELECT 0/3 (gate decorative ~0.75 constant), U25 SELECT-HARD 0.025/0.115/0.065 + COMPETE strict 0.0 all arms/seeds with margins negative (-0.026 to -0.056). Single-knob global scorer never selects under any diet, gate, scale, or loss.
- Nearest prior U25 (assembly-competition scorer): IDENTICAL wiring to U23b + contrastive hinge mean(true)-mean(top8), margin/weight 1.0. Hinge stayed active (compLossMean ~1.03-1.08) but gap never opened. Mechanism filed: shared linear scorer C affects all 250 slots through the SAME weights — pushing true up pushes similar distractors up identically. No per-assembly degree of freedom.
- Retrieval bed: #5 Kim & Kim 2025 — assembly-specific E-to-I inhibition beats GLOBAL inhibition on overlapping engrams (heterosynaptic E-to-I plasticity, feature-selective inhibitory neurons). #8 To (anterior=separation, posterior=completion) + #9 Cohen (separation/completion unrelated trajectories) — separation and completion are SEPARABLE jobs on separate substrates; our single scorer does both with one knob (keep SELECT vs SUMMARY barred apart).
- U24 GATE-FAIL: scalar state-gate dropped (proven ~zero), not carried.
- What differs vs U25: IDENTICAL diet/streams/losses/codes-family, IDENTICAL hinge (margin 1.0, weight 1.0, adapt rows only), ONE architectural delta: per-content inhibitory net INH subtracted from scores. No index input (content-only — cannot memorize positions; SEL shuf-arm catches index cheating). Forward change is minimal and grad-checkable. This isolates ARCHITECTURE (shared-linear vs per-content inhibition) with pressure held constant.

## Design
- Frozen: W6-s / M2-nb-s; frozen U17 L* teacher; frozen U5-old head; frozen U21-lowfold miner per seed; frozen U22c-scale OOD control. Same loads as U23b/U25.
- Trainable: S (shared 4->8 encoder) + C (linear scorer w8+b) + INH (inhibitory MLP 8->4 silu ->1, softplus output >=0, ~41 params, init uniform ±0.1, zero-mean) + HF (combiner 56->24->4). Same inits/code path as U23b for S/C/HF; INH fresh per arm/seed (rng 78500+seed*7919+armCode*131).
- Forward (per row; codes 167 comp / 168 shuf):
  - slots: 250x4 (true indices [7,41,129,166,203], 245 matched-noise distractors re-seeded — U22c recipe verbatim).
  - enc_i = silu(S.W slots_i + S.b) (8-dim).
  - inh_i = softplus(INH.W2 silu(INH.W1 enc_i + INH.b1) + INH.b2) >= 0. CONTENT-ONLY: inputs are enc_i only, never slot index. Index-memorization is structurally impossible; shuf-arm SEL is the tripwire.
  - scores_i = dot(C.w, enc_i) + C.b - inh_i.
  - pool = soft tau 1.0 over scores -> summary 8-dim (weighted sum of enc). Combiner: x=[h48|summary8] -> HF -> f.out 4 (vhat). Ensemble + losses identical to U25.
- Contrastive term (adapt rows only, identical to U25): Lcomp = max(0, 1.0 - (mean(true scores) - mean(top-8 distractor scores))), weight 1.0. Gradients flow into S + C + INH (new path) — this is the point: hinge finally has a per-content knob.
- Diet/streams/evals: IDENTICAL to U25 (hence to U23b): 8 standard + 8 vhat-hard rows per batch B=16, 800st/lr5e-3/clip1.0, codes 167/168; train mine stream 65300+seed (dedicated per U25 D1); held-out vhat-mined N=200 at 66300+seed; standard N=200 twin-matched; OOD frozen scale on same held-out. Miner/oracle probes + oracle-floor tripwire (VOID iff oracleY <= 0.20 2/3 — same as U25).
- Arms: u26-comp (true L*) vs u26-shuf (shift-by-1). 6T + 6E + 6 OOD-scorings + probes.
- Controls/ablations (eval-only, no extra trains): zero-inh ablation (set inh_i=0, rescore) for INHIB-USE; frozen-scale OOD for GAP; miner/oracle probes for floor/strain.

## Paper predictions vs bench predictions (divergence-WHY owed)
- Kim #5 predicts: assembly-specific inhibition > global inhibition on overlapping engrams. Bench prediction: U26 SELECT-HARD/COMPETE should EXCEED U25 (strict>0, margins positive) because INH gives per-content suppression the shared scorer lacks. IF U26 still fails (SELECT~0, COMPETE 0, margins negative): file WHY — candidate reasons pre-registered: (i) shared-MLP inhibition is still global (same weights all slots; true per-assembly needs separate E-to-I per assembly, not one shared MLP); (ii) hinge on means under-constrains max (distractor-max < true-min needs max-based pressure); (iii) CE gradient washes hinge direction (completion vs separation interference — To/Cohen separable-substrate point); (iv) diet overlap (true encodings linearly inseparable from matched noise at 8-dim). Verdict must pick among these with numbers (margins, inh variance true-vs-dist, zero-inh drop, CE-vs-hinge grad cosine if cheap).
- To #8 / Cohen #9 predict separable substrates. Bench prediction: SELECT and SUMMARY should dissociate across arms/seeds (one can hold while other fails — already seen U25 s0: summary drop 0.32 with sel 0.025). IF they move together in U26 (both hold/fail 3/3): file WHY (shared-pool bottleneck couples them; pool tau 1.0 forces completion through selection).
- Liu #11 boundary predicts: heavily-cued task shrinks state effects (already used for U24 LOWCUE). Not re-tested here; carried as interpretation only.

## Bars (quorum 2/3 unless noted)
- U26-SELECT-HARD: top-2 hit-rate on vhat-hard-heldout >= 0.80 2/3 (THE wall bar).
- U26-COMPETE: per-row strict separation (distractor-max < true-min) row fraction >= 0.50 2/3 (Kim operationalized).
- U26-SEL: hard minus shuf on vhat-hard-heldout >= +0.05 2/3 (index-cheat tripwire: position-memorizer scores ~0 here).
- U26-HARD: adaptY-hard-heldout >= 0.60 2/3.
- U26-GAP: u26-comp minus frozen-U22c-scale on same held-out >= 0.15 2/3.
- U26-SUMMARY-HARD: zero-summary drop on held-out >= 0.05 2/3.
- U26-STD: two (standard stream) within +-0.05 of W6 two 2/3.
- U26-INHIB-USE: zero-inh ablation drop on HARD >= 0.05 2/3 (inhibition is load-bearing, not decorative — U24-gate lesson).
- U26-FRESH: battery health 4/4 (goalInAll, nonEmpty, hasVerdict, distinct).
- Verdicts: ASSEMBLY-COMPETES (SELECT-HARD + COMPETE hold) / ASSEMBLY-PARTIAL (HARD/SEL/INHIB-USE hold without SELECT-HARD) / COMPETITION-FAIL (SELECT-HARD + COMPETE fail — wall stands, WHY owed) / VOID (oracle floor tripped).

## Staging + budgets
- Battery on THIS file first (3x sealed, health checks) -> v1.1 pins-only (no train/eval changes without new battery).
- Then stage-1 (harness det + oracle floor + grad-check incl. INH path and contrastive term) + 6T + 6E + verdict d-newai-self-u26-verdict.json. Transcript Turn-121 + CHATLOG + CURRENT_TASK. PUSH after verdict per standing order.
- Compute: CPU/in-worker only, ~6x800st trains + evals, resume-safe COMPLETE-gated ledgers.
