# Correction: F11 "pure-shuffle read" did not land on the V4 metric path (append-only, 2026-11-27)

Status: OBSERVED (in-tree) + VERIFIED (call graph). Filed numbers stand; one filed meaning is retracted and re-labeled. No driver changed by this memo.

## Finding

`u70nApplyShuffle` (u70-neural.js:392-408, pure one-hot `zoh[k] = zdet[k]`, original-trial q removed) is called ONLY by the T3 unit test (:484). The V4 gap metric path — `u70nEval(M, path, obs, true)` as called by `runU70Neural` for every trained variant (:799-803 standard loop; :738-743 ensemble loop) — runs its OWN inline shuffle branch (:536-549) which still builds `zoh[k] = zdet[k] + c.q[k]` (onehot-shuffled + posterior-original). That is exactly the C2 partial intervention the audit flagged and the F11 proposal claimed to replace ("in u70nEval with zShuffle, zoh[k] = zdet[k]", u70-f11-prereg-proposal-v1.1.md line on change (b)).

## What stands vs what is re-labeled

- STANDS (all measured-as-run, no recompute): every filed pooled/per-seed number F4–F12, including F11 corrected probe 0.7183 (12/20) and gap 0.1360 (20/20), and all paired deltas.
- STANDS: the forward fix IS live on every path (`u70nStep` :155, `zoh[zi] = 1` pure; T1 guards it). F11's probe half ("leak-size ~0", paired dProbe ~0) is a genuine corrected-code measurement.
- RETRACTED as written: F11 closeout's "pure-shuffle read" as a property of the measured gap. The gap in every filed wave F4–F12 is the PARTIAL-shuffle gap (hard-category permutation with posterior retained — the C2 meaning). "Paired gap delta ~0" is therefore expected-by-construction for the shuffle half (metric path unchanged between F4 and F11), NOT evidence about full-latent intervention.
- Consequence: F11 REPAIRED keeps its probe half; its gap half is re-labeled to the C2 meaning (bar met on the partial metric, same as F4). The owed full-latent-intervention test was never run — it moves to the queue as a TRUE pure-shuffle wave (wire `u70nApplyShuffle` into the `u70nEval` V4 path), needs own prereg + battery + countersign (F14 candidate).

## How it survived

T3 tested the factored helper, never the call site; document batteries (F11 9/10 NEEDS-PATCH) reviewed prose, never implementation semantics — a concrete instance of the audit's C8 process note, now with a second exhibit. Adopted rule (standing): load-bearing code claims need a code-semantics audit lane (executable test ON THE METRIC PATH, e.g. assert `u70nEval(...,true)` output equals `u70nApplyShuffle`-path output), not just helper tests.

## Effect on F13 (executing 2026-11-27, countersigned exact v1.1)

None mechanical: "F12-exact" means the filed code path, which F13 replicates bit-identically (replication sanity expect-0 gate covers it). F13's held-out gap is the SAME partial metric on fresh trajectories — the generalization comparison stays internally consistent. This memo rides with F13 (closeout carries the corrected gloss; verdict bars unchanged, they are absolute numbers on a fixed path).
