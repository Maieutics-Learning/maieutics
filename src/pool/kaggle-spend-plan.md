# Kaggle spend plan (verified 2026-11-13)

Facts (live API + docs attempt): GPU 49.039/108000s, TPU 0/72000s,
refresh 2026-11-14T00:00Z, weekly cadence (7-day steps), flat grant =
use-or-lose (no rollover). Docs page + Wayback are JS shells — policy text
not re-fetched; weekly use-or-lose is the long-standing documented behavior
and the safe assumption either way.

Budget, rest of November:
- Window 0 (now → Nov 14 00:00Z): ~30h GPU + ~20h TPU, ~0 used. Mostly
  expires unused — accepted (free). Spend ~0.1h: GPU lane smoke only.
- W1 Nov 14→21: 30h GPU + 20h TPU. Torch port dev (CPU, 0 GPU) + arch-hinge pilot (~2–5h GPU).
- W2 Nov 21→28: 30h + 20h. Full arch comparison + scale past h96 (~15–25h GPU).
- W3 Nov 28→Dec 5: 30h + 20h. Reserve for Phase-3 follow-ups.
- TPU: one XLA smoke; deprioritize on friction (lane already downgraded once).
Discipline: submit Sat–Mon, 5h buffer, never save across Saturday midnight.

Constraint: TinyNN harness is JS/browser — Kaggle Python kernels cannot run it
(no benefit porting mid-experiment; bit-identity would break). Phase 3 and
transfer stay LOCAL (0 pool). Kaggle funds only the torch-arch/scale hinges.
