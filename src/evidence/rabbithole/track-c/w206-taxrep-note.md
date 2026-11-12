# Wave 206 note — backlog-W177 tax-stability replication (bench, executed)

STOP RULE: stopped after 30-run grid (masked h16/h24 x12 seeds + native h16 x6, 1000 steps, 4-pt trajs in {300,500,700,1000}; batches anchor/B/C/D/E/F/G1/G2; 3x-horizon/longer arms — spawned W194, not built). 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (W145 rig + EVALS logging). Clock: R31 5/5 FULL. Pre-registered predictions scored: (a') CONFIRMED (b') REJECTED (c) CONFIRMED (d) REJECTED.

## Direct: the mask-tax does not exist — h24 beats h16 by .013

Grid: stock AttnModel {vocab:2, classes:2, h, m:32, d:8}, parity6 prefix-aux ("masked") vs end-only ("native"), B=16, 1000 steps; testIn + hard @ {300,500,700,1000}; seeds 7-18 masked (n=12/arm), 7-12 native (n=6).
- (a') Anchor reported with divergence owned ✓: testIn@300 = 1.0 in 11/12 masked-h16 (s11 .9844 → 1.0 by 500) — rig ignites FASTER than W145 (.969). The hypothesis was tested in a stronger substrate; the tax had every chance.
- (b') TAX CRITERION ✗ REJECTED: masked hard@1000 h16 .9722 vs h24 .9847 — gap −.0125 (criterion demanded h16−h24 ≥ +.05). Wrong sign AND an order of magnitude short. No ignition delay either: testIn@300 = 1.0 in 23/24 masked runs (stragglers s11-h16, s17-h24 at .9844, both 1.0 by 500); hard@300 already ≥.92 in 22/24. Nothing is slow at h24; h24 is, if anything, better.
- Per-seed audit (one laggard per arm, neither arm owns raggedness): h16 hard@1000 [.9733, 1, .9367, .8267, 1, 1, 1, 1, .9833, .9933, .9533, 1] (min s10; next-lowest .9367); h24 [1, 1, 1, 1, .9533, 1, .98, 1, .9333, 1, .9567, .9933] (min s15). 9/12 h16 ≥ .97 vs 9/12 h24 ≥ .98 — distributions overlap with h24 shifted UP. n=2 (W145) could draw either tail; the "tax" was a two-sample lottery ticket.
- (c) Native lottery spread ✓: native-h16 hard@1000 [.53, .6167, .6133, .5333, .78, .88], mean .6589; testIn@300 ragged .44–.73, all hard@300 at chance (~.45–.51). Same substrate minus aux: uniform ignition collapses into lottery. The aux compresses the lottery; width does not tax it. Masked-vs-native hard gap ≈ .31 — the tutor signal does nearly all the work.
- (d) h24 raggedness ✗ REJECTED: h24 is not more ragged (3/12 below .96 in both arms; h24 holds seven 1.0s vs h16's six).
- Kill-cell (pre-registered): gap ≥ .05 or ignition delay, else the tax dies. Tax died. W145's n=2 hint is killed AS LOTTERY — powered null (n=12/arm), USED-with-teeth.
- W178 premise flip (owned, no backlog edit): W178 says "run the W177 tax replication under OBF-2 interim looks." There is no tax to replicate — W178 now field-tests the NULL under interim looks (does early-stopping ever hallucinate a tax?). Still worth running; its description already covers it ("run the W177 tax replication" = replicate the finding, which is null).

Verdict: USED-with-teeth (powered null kills W145 hint; aux-compresses-lottery mechanism; ceiling/hard discipline). No precursor, no conflict.

## Tangential: pre-register the ceiling escape before running (0-spend, reasoning only)

testIn saturated at 1.0 in 23/24 masked runs by step 300 — the primary metric (W145's own) went blind immediately. The wave survived because (b') named the unsaturated backups (hard@1000 gap + ignition timing) in advance. Generalize: any wave whose primary metric CAN saturate must name its unsaturated backup metric in pre-reg, before the first run. Post-hoc backup metrics are free parameters wearing a lab coat; pre-registered ones are load-bearing. (W204/W205 were carried by hard too — from now on it's a rule, not luck.)

## Spend / queue

- Spend: 0 + 0 + 1 grid (30 runs x 1000 steps + 4-pt trajs; floor). Consumed backlog-W177 removed; spawned W194 to BACK. Backlog 17. Synthesis R31 clock: 5/5 FULL → next R32 synthesis (Wave 207, queue-jump).
- W194 (A, bench): hard-ladder + ceiling audit — masked parity6 h16/h24 vs harder OOD rungs (longer l10/l12, distribution shift); map where the .97 breaks; is h24's +.013 edge real or ceiling lottery; same seeds 7-18.
