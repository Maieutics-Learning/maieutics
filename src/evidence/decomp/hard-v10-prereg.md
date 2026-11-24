# Step 5 harder gain task — robustness + time (PROPOSED, eval-only, no new trains until battery)

Agent approval: this file. User order 2026-11-24: 7 steps, ≤10/step evolving. CPU only. NO GPU. NO PUSH. R=3, quorum 2/3, COMPLETE-gated, twin-matched, paired.

## Record-search

- Assoc gains live at ~0.05 (SE 0.022 — quorum on noise); shift-add retrieve 0.57-0.67 (headroom to 0.70+), compose 0.39-0.595 (headroom to 0.60+). Parked "harder task for gain" never ran — run it here as eval-only (zero new trains, isolates whether Steps 1-4 bought anything where headroom exists).
- Steps 1-4 best: div-boot scr 0.625 best-clean, cur-rand 0.67 best-single, cur-pick two 0.595 best-compose. All on clean shift (52500+seed) + base-k0 (52400+seed). Harder = NOISY-flat (1 token corrupted, same len10) + DOUBLE-query (two queries, carry persists) — both runnable on FROZEN weights (no retrain, same masks 91000+seed).
- Bottleneck dose / verS / compose ceilings: length/OOD flat everywhere; noise-robustness never tested for masked track. What differs: test robustness + time, not absolute.

## Design (frozen weights, N=200 each, seed-matched)

Models (frozen, no new trains): fr-force (Step 1), div-boot (Step 3 best-clean), cur-pick + cur-rand (Step 4), div-func (exploded control — expects collapse, documents floor).

- `hard-noisy`: shift lines (52500+seed) with 1 flat token randomized (rng 53100+seed, position rng 53200+seed, same across models per seed). Metrics: scr (Hv on noisy x'), two (vhat→masked x2m). Tests robustness bought by bootstraps/curriculum.
- `hard-double`: two shift queries back-to-back (q1 from 52500+seed stream, q2 next draw, shared flat? No — independent flats, carry persists q1→q2: pass1a→pass2a→pass1b→pass2b with c chained). Metrics: scr2 (second retrieve), two2 (second compose). Tests time capacity (CD8) where Step 2 CD16 was flat on clean.
- Controls: clean re-read from frozen evals (paired per seed, no recompute).

Twin: eval rngs identical across models per seed (53100/53200+seed); masks 91000+seed (same as trains).

## Bars

- HARD-ROBUST: best-step (min over div-boot/cur-pick/cur-rand per seed of noisy-drop = clean-two − noisy-two) < fr-force drop quorum 2/3 (steps bought robustness).
- HARD-TIME: double two2 >= single two − 0.10 (carry holds across queries; quorum 2/3, pooled over models descriptively + best-model check).
- HARD-FLOOR: noisy scr >= 0.40 (above chance 0.25; documents signal survives noise).
- Verdicts: HARD-WON (robust/time hold) / PARTIAL / STILL-WALLED (harder fails equally — wall is absolute, not headroom).

## Cost / honesty

Zero trains. 5 models × R3 × 2 hards = 30 evals (forwards only, seconds-minutes). Counts as 2 experiments (noisy + double) of 10. Risks: noise destroys all equally (floor check contains); double-query confounds flat-change with time (filed: independent flats, carry-only link). Blind battery before any eval. NO PUSH.

## Ledgers

`d-newai-hard-{noisy,double}-{model}-s{seed}.json` + verdict `d-newai-hard-verdict.json`, driver `newai-hard-driver.js`, spec + battery. Transcript + CHATLOG + CURRENT_TASK. NO PUSH without order.
