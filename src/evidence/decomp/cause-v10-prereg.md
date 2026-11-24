# Step 6 causality — seed-swap / order / label (PROPOSED, eval-only, no new trains until battery)

Agent approval: this file. User order 2026-11-24: 7 steps, ≤10/step evolving. CPU only. NO GPU. NO PUSH. R=3, quorum 2/3, COMPLETE-gated, paired.

## Record-search

- v10 battery parked rivals: CSI/cross-seed interference, zero-shot seed swap (spec relies on twin-matched streams — contained partially, never run explicitly). Run it here.
- Reflections v2 setter: permutation pivot F6-F10 (no new gate) — run as P3 here.
- Order-sensitivity never tested on masked track (flat order shuffled per line at train, but model may still be positional — SP1 slot-written-unread + S1 byK show k-dependence). P2 isolates content-addressable vs positional.
- All on FROZEN weights (fr-force, div-boot, cur-pick — the three that hold control; div-func floor + cur-rand/cur-easy descriptively if cheap). Zero trains.

## Design (frozen, N=200, seed-matched except swap)

- `P1 seed-swap`: weights seed s, test streams seed t=(s+1)%3 (testRng/selRng/targetRng from t; masks stay s — model subspaces). Compare swapped two/scr vs matched filed evals. Bar SWAP-GENERALIZES (swapped within 0.10 of matched — task learned, not stream-memorized).
- `P2 order-permutation`: flat 6 reversed (same pairs, opposite order; qk/k/scr positions fixed). Same weights/streams. Bar ORDER-DOCUMENTED (descriptive: drop = positional; hold = content-addressable — no pass/fail, filed mechanism either way).
- `P3 label-permutation`: y→(y+1)%4 at eval (v unchanged, x same). Model should systematically fail (acc ~0 if task-bound, ~0.25 if guessing). Bar LABEL-BOUND (acc <= 0.30 — documents task-specificity, not general reasoning; failsafe against overclaim).
- Counts as 3 experiments of 10. Evolvers (≤7): E1 mask-swap (masks from t — isolates subspaces vs streams), E2 double-swap (P1+P2), E3 warm-swap (P1+warm) — run if P1 surprises.

Twin: swap mapping t=(s+1)%3 fixed; permutation deterministic (reverse flat; +1 mod 4 labels).

## Bars

- SWAP-GENERALIZES: swapped two within 0.10 of matched (quorum 2/3, pooled over 3 models + per-model).
- ORDER-DOCUMENTED: descriptive (drop/hold filed, no gate — mechanism).
- LABEL-BOUND: permuted-label two <= 0.30 (quorum 2/3 — task-bound, not general).
- Verdicts: CAUSAL-CLEAN / PARTIAL / SEED-BOUND (swap collapses — leakage) / ORDER-BOUND / LABEL-GENERAL (permuted-labels holds — overclaim alarm).

## Cost / honesty

Zero trains. 3 models × R3 × 3 probes = 27 evals (forwards only). Risks: swap confounds masks vs streams (E1 reserved); order-perm breaks learned positional code (filed as mechanism either way); label-perm trivially fails (that's the point — documents bound). Blind battery before evals. NO PUSH.

## Ledgers

`d-newai-cause-{p1,p2,p3}-{model}-s{seed}.json` + verdict `d-newai-cause-verdict.json`, driver `newai-cause-driver.js`, spec + battery. Transcript + CHATLOG + CURRENT_TASK. NO PUSH without order.
