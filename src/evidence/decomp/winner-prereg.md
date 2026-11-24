# Winner-combine + more brains (PROPOSED, pre-countersigned, user order 2026-11-24 do-both)

Agent approval: this file. CPU/in-worker only. NO GPU. NO PUSH. R=3, quorum 2/3, COMPLETE-gated, twin-matched seed-only streams, paired evals.

## Record-search
- C7 pick auxW0.5 800st C=4: two 0.61/0.565/0.605 FIRST 2/3 HOLD on 0.60. C1 C=6 pick 800st: two 0.63/0.575/0.55 mean 0.585 best dose. A2/A4 longer 1400/2000st: two 0.555-0.625 solid, saturating. c10 noboot holds (bootstraps optional for pick). lr2.5e-3 collapses. scr 0.70 stands (best 0.67 cur-rand/b2/b7).
- What differs: stack the three winners in one trunk (C=6 + auxW0.5 + 1400st pick) + 4 more brains varying one axis each (different ways of training, frozen for testing).

## Design (base = masked own-vhat truncated, B16/lr5e-3, Div lam4.0, boot on unless noted, streams 42000/91000+seed)
- W1 winner-combine: C=6 pick-max, auxW0.5, 1400st, lam4.0, boot on.
- W2 aux-ablate: C=6 pick, auxW1.0, 1400st (tests whether low-aux is the active ingredient).
- W3 dose-ablate: C=4 pick, auxW0.5, 1400st (tests whether C=6 is active).
- W4 recipe-ablate: C=6 pick, auxW0.5, 800st (tests whether longer is active).
- W5 lam-ablate: C=6 pick, auxW0.5, 1400st, lam2.0 (tests Div pressure interaction).
- Each = 3 trains + 3 evals (N=200 shift + 200 base-k0). Frozen after train (weights locked, evals read-only — freeze for testing).

## Bars
- W-COMPOSE: two >= 0.60 quorum 2/3 per arm; W-RETRIEVE scr >= 0.70; W-CONTROL two - dummy >= +0.15; W-BEST: beats c7 (2/3) and c1-mean (0.585).
- Verdicts: WINNER-HOLDS / PARTIAL / DEAD (combine hurts — documents interaction).
- Ledgers `d-newai-w-{w1..w5}-s{seed}.json` + evals + verdict `d-newai-w-verdict.json`. Transcript + CHATLOG + CURRENT_TASK. NO PUSH.
