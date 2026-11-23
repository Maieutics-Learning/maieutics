# A1 seed map + logcheck repairs (2026-11-23; answers fresh-eyes logcheck battery)

Logcheck battery: scratch/a1-logcheck-battery.json (3 sealed parallel, filed disposable in scratch).
Adjudication: R1 PARTIAL (optimizer named here; hardware/OS/lockfile rejected — zero-dep hand-rolled Float64 in browser/worker, determinism from seeded rng, not iron; wallMs on trains, evals untimed-fast); R2 PARTIAL (this file is the seed→ledger→number map); R3 PARTIAL (resume order fixed below — tail is never authoritative alone).
Pool use for the logcheck: reviewer labor only (3 short calls), same boundary as A1.

## Resume order (authoritative first)
1. `d-intrinsic-a1-verdict.json` (joint bars + numbers). 2. `intrinsic-a1-prereg.md` v1.1 (design + bars). 3. `fresh-eyes-intrinsic-a1-3x-results.md` (battery + adjudication). 4. This seedmap (numbers → files). 5. `scratch/CURRENT_TASK.md` tail (working record, newest wins). 6. `src/CHATLOG.md` tail (decisions + MEASURED numbers). 7. Transcript tail `2026-11-23-skills.md` LAST (wording only, never measures).

## Method (exact)
- Optimizer: Adam (G.Adam, lr 5e-3), B=16, steps=3000, K=5, lamDiv=4.0, B_reh=2, N_obs=6, H=48, carry 8-dim Float64, fixed per-head subspaces from G.makeRng(91000+seed) (train and eval identical). Twin-matched: init/LR/steps/rng-offsets shared except the lesion; target sequence identical across arms (targetRng seed-only).
- Determinism: seeded rng throughout (no wall-clock, no hardware dependence). Trains carry wallMs below (perf only, ~9–14 s/cell in worker, not a claim).

## Seed → ledger → numbers (positional arrays in verdict are [s0, s1, s2] in this row order)
| arm | seed | train ledger | eval ledger | loss0 | lossN | wallMs | acc | poolD | retD | gap | enrich | overlap | divCos |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| A1own | 0 | d-intrinsic-a1-train-A1own-s0-3000st.json | d-intrinsic-a1-eval-A1own-s0-3000st.json | 3.043491 | 0.776031 | 10897 | 0.65 | 0.0963 | 0.225 | 0.1287 | 4 | 0.12 | 0.9998 |
| A1own | 1 | d-intrinsic-a1-train-A1own-s1-3000st.json | d-intrinsic-a1-eval-A1own-s1-3000st.json | 3.051067 | 0.865445 | 10932 | 0.66 | 0.0547 | 0.148 | 0.0933 | 4 | 0.097 | 0.9998 |
| A1own | 2 | d-intrinsic-a1-train-A1own-s2-3000st.json | d-intrinsic-a1-eval-A1own-s2-3000st.json | 3.060519 | 0.789404 | 11160 | 0.595 | 0.074 | 0.184 | 0.11 | 4 | 0.1035 | 0.9997 |
| A1rand | 0 | d-intrinsic-a1-train-A1rand-s0-3000st.json | d-intrinsic-a1-eval-A1rand-s0-3000st.json | 3.028705 | 0.966534 | 11189 | 0.5 | 0.1608 | 0.154 | -0.0068 | 1.95 | 0.111 | 0.9995 |
| A1rand | 1 | d-intrinsic-a1-train-A1rand-s1-3000st.json | d-intrinsic-a1-eval-A1rand-s1-3000st.json | 3.020551 | 0.641912 | 11292 | 0.555 | 0.068 | 0.071 | 0.003 | 2.79 | 0.141 | 0.9998 |
| A1rand | 2 | d-intrinsic-a1-train-A1rand-s2-3000st.json | d-intrinsic-a1-eval-A1rand-s2-3000st.json | 3.076137 | 0.810305 | 11344 | 0.58 | 0.1212 | 0.1265 | 0.0053 | 2.3 | 0.2 | 0.9997 |
| A1none | 0 | d-intrinsic-a1-train-A1none-s0-3000st.json | d-intrinsic-a1-eval-A1none-s0-3000st.json | 2.228026 | 0.871279 | 9071 | 0.65 | 0.1052 | 0 (N/A, sel empty) | -0.1052 (N/A) | 0 (N/A) | 0.129 | 1 |
| A1none | 1 | d-intrinsic-a1-train-A1none-s1-3000st.json | d-intrinsic-a1-eval-A1none-s1-3000st.json | 2.172263 | 0.732917 | 8959 | 0.625 | 0.113 | 0 (N/A) | -0.113 (N/A) | 0 (N/A) | 0.108 | 0.9998 |
| A1none | 2 | d-intrinsic-a1-train-A1none-s2-3000st.json | d-intrinsic-a1-eval-A1none-s2-3000st.json | 2.219002 | 0.708034 | 8860 | 0.665 | 0.0638 | 0 (N/A) | -0.0638 (N/A) | 0 (N/A) | 0.11 | 0.9999 |
| A1oracle | 0 | d-intrinsic-a1-train-A1oracle-s0-3000st.json | d-intrinsic-a1-eval-A1oracle-s0-3000st.json | 3.154337 | 1.992271 | 11623 | 0.6 | 0.3813 | 0.365 | -0.0163 | 2.39 | 0.097 | 0.9996 |
| A1oracle | 1 | d-intrinsic-a1-train-A1oracle-s1-3000st.json | d-intrinsic-a1-eval-A1oracle-s1-3000st.json | 3.123 | 1.97213 | 11415 | 0.535 | 0.3688 | 0.3515 | -0.0173 | 2.12 | 0.1465 | 0.9994 |
| A1oracle | 2 | d-intrinsic-a1-train-A1oracle-s2-3000st.json | d-intrinsic-a1-eval-A1oracle-s2-3000st.json | 3.086263 | 2.063708 | 11893 | 0.555 | 0.383 | 0.3715 | -0.0115 | 2.15 | 0.103 | 0.9998 |
| A1shuf | 0 | d-intrinsic-a1-train-A1shuf-s0-3000st.json | d-intrinsic-a1-eval-A1shuf-s0-3000st.json | 3.020074 | 0.783254 | 13857 | 0.545 | 0.0758 | 0.082 | 0.0062 | 2.74 | 0.1475 | 0.9999 |
| A1shuf | 1 | d-intrinsic-a1-train-A1shuf-s1-3000st.json | d-intrinsic-a1-eval-A1shuf-s1-3000st.json | 3.0738 | 0.754801 | 13962 | 0.52 | 0.1168 | 0.12 | 0.0032 | 2.3 | 0.0955 | 0.9993 |
| A1shuf | 2 | d-intrinsic-a1-train-A1shuf-s2-3000st.json | d-intrinsic-a1-eval-A1shuf-s2-3000st.json | 3.033047 | 0.742417 | 14034 | 0.575 | 0.0578 | 0.0545 | -0.0033 | 2.91 | 0.1075 | 0.9999 |

## Bar derivations (seed-mapped, no floating numbers)
- GAIN gaps own−rand: s0 0.65−0.5=0.15 ✓; s1 0.66−0.555=0.105 ✓; s2 0.595−0.58=0.015 ✗ → 2/3 HOLD.
- AUDIT gaps: s0 0.225−0.0963=0.1287 ✓; s1 0.148−0.0547=0.0933 ✗ (miss by 0.0067); s2 0.184−0.074=0.11 ✓ → 2/3 HOLD.
- SHUFFLE |shuf−rand|: s0 |0.545−0.5|=0.045 ✗; s1 |0.52−0.555|=0.035 ✗; s2 |0.575−0.58|=0.005 ✓ → 1/3 FAIL.
- FLOOR own≥0.35: 3/3 ✓. None gaps own−none: 0/+0.035/−0.07 (rehearsal adds nothing). Oracle<own 3/3 (hardest-first harms).
- Enrich tie-note: quartile threshold = sortedD[floor(6/4)] with ties (many disagree=0) inflates rand to ~2–2.8; own perfect 4.0 = top-2 always top-quartile.
