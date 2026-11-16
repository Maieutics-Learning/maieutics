# 1.d.x lines-only ablation — VERDICT: HALT (integrity kill-switch) (2026-11-16)

Diagnostic of ix PILOT-FAIL. Frozen ix verdict untouched — PILOT-FAIL stands regardless of anything below.
Spec: `scratch/fresh-x-ablation-v0.10.md` (10 fresh-eyes batteries, COMFORTABLE, 2026-11-15).
Driver: `scratch/ix-ablate.js` (+ slice runner with identical math; per-seed outputs bit-deterministic by construction).

## What ran (Verified — artifacts read 2026-11-16)
- 15 kept brains (seeds 5002–5016; 5001 excluded per ix guardrail). Train: killHd (200 lines/brain). Eval: killHu (novel, 200/brain). killHu ∩ killHd = ∅ (0 overlap).
- Arms × 5 probe seeds × 30 epochs, frozen recipe (MLP-64, BCE+1.0MSE, wd 1e-4, full-batch Adam 1e-3): A lines-only (weight block literal 0.0), B raw-weights-only (line zeroed), Bc centered-weights-only, S line-shuffle retrain. 20/20 per-seed files @30 epochs (`scratch/ix-ablate-<TAG>-P<seed>.json`).
- A0 cross-fit: primary 0.5410 (K=25, seed 424242, n=75000); sensitivity 0.5443 (K=100, seed 777001, n=300000).
- Gate self-test (both-masked input → constant output): PASS (`partial.selfTest.constant=true`).
- VOID-gate (post-ReLU max==min on live channel): NOT tripped (eval proceeded past it into the kill-switch block).

## Kill-switch (Verified — this IS the verdict)
Pre-registered rule: any integrity null excluding 0.5 at 99.7% (line-bootstrap CI) → HALT + diagnose, no world reading.
- Shuffle-retrain S on killHu: AUC 0.4852, 99.7% CI [0.4501, 0.513] — collapses ✓ (A-arm machinery sane).
- B permuted-weights (trained-B nets fed wrong-brain weights, seed-555 permutation): AUC 0.6562, 99.7% CI [0.6271, 0.6924] — TRIPPED ✗.
- Bc permuted-weights (centered): AUC 0.5285, 99.7% CI [0.4975, 0.5609] — clean ✓.
- Verdict: HALT. No world-1–4 reading. Arm-AUCs, Δ(A−A0), per-brain, LOO, rank-corrs NOT computed (driver halts before readings by design).

## Diagnosis (Hypothesis — explicitly not verdict; venue = discussion)
- H1 (lead): the switch CI is miscalibrated for arm B. B scores are per-brain CONSTANTS (line input zeroed → all 200 lines of a brain share one score); the CI bootstraps 3000 LINES as if independent, but effective N ≈ 15 brains — the CI is ~√200× too tight. And a single fixed permutation is one draw, not a null distribution.
- H2 (compatible with H1): raw weights carry a near-constant global scalar — Bc-centered perm is clean (0.5285) while B-raw perm trips, so permutation may barely move B inputs (perm-AUC ≈ true-B-AUC, not a broken-mapping null).
- Both point the same way: re-calibrate with a multi-draw permutation distribution + cluster (brain-level) bootstrap before believing any trip.
- Proposed, needs user go (quarantined, no kill power over ix): (a) load saved nets, per-brain B scores + perm-AUC distribution over ≥200 draws; (b) conditional on (a): A-arm readings with B-caveat attached, or a re-specified switch.

## Cost (Observed)
- ~30 worker-waves across 2026-11-15/16 (4- and 2-parallel; 50/25/15-min budgets; 5 message-limit kills absorbed via 2-epoch checkpoints). Pool spend 0 (engine-identity requirement stands — see 2026-11-15 pool check).
