# W6 seed-sweep note (pre-countersigned winner scope, user order "do both" + "continue")

Agent approval: this file. CPU/in-worker only. NO GPU. NO PUSH. R=3 (seeds 3,4,5),
quorum 2/3, COMPLETE-gated, twin-matched seed-only streams, paired evals.

## Record-search
- W6 (C=6 pick-max + auxW0.5 + 800st + lam2.0 + boot on, frozen): scr 0.635/0.595/0.585,
  two 0.63/0.595/0.55 — best single-trunk mean 0.592; two 0.60 held 2/3 (s1 misses by 0.005).
- c7 (same recipe with lam4.0): two 0.61/0.565/0.605, also 2/3. W4 (lam4.0, 800st): two
  0.58/0.57/0.57. Longer (1400st) + stacking (W1) hurt the combine.
- What differs: NOTHING in mechanism — same W6 recipe on fresh seeds 3,4,5 (arm `w6sweep`,
  same C/auxW/steps/lam/boot, same stream structure via newai-winner-driver.js which
  generalizes runCurTrain exactly). Tests whether 2/3 → 3/3 across 6 seeds.
- No blind battery: no new mechanism (battery is for new mechanisms; 30x/B10/A10/C10
  variants ran under the same rule).

## Design
- 3 trains + 3 frozen evals (N=200 shift + 200 base-k0), seeds 3,4,5.
- Driver: newai-winner-driver.js (runWinnerTrain/runWinnerEval, arm `w6sweep` = W6 cfg).
- Init stream: base 73000 + seed*7919 + 76*131 (fresh arm stream, documented; per-seed
  train/eval twin-matching identical to cur/div drivers: data 42000+seed, masks 91000+seed,
  eval 52500/52400+seed).

## Bars
- W6S-COMPOSE: two >= 0.60 quorum 2/3 on seeds 3-5; combined 6-seed quorum reported.
- W6S-RETRIEVE: scr >= 0.70 (absolute stands; report only).
- W6S-CONTROL: two - dummy >= +0.15 (dummy 0.255-0.275).
- Verdicts: SWEEP-HOLDS (2/3+ on fresh seeds) / MIXED / SWEEP-FAILS.
- Ledgers `d-newai-w-w6sweep-s{3,4,5}-800st.json` + evals + verdict update in
  `d-newai-w-verdict.json`. Transcript + CHATLOG + CURRENT_TASK. NO PUSH.
