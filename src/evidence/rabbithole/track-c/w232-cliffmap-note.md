# Wave 232 note — backlog-W198 cliff-map + predictor-power (bench, executed)

STOP RULE: stopped after 128-run cliff grid (.02/.035/.065/.08 x 32 seeds) + 32-run pipeline extension (share-.05 seeds 39-70) + n=64 LDA. 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (w181 rig + aux-share coin; live-page TinyNN + worker LDA). Clock: R36 1/5.

## Direct: the cliff is a ramp; the K50 predictor doesn't survive scale-up

Cliff (ignite/32): .02 → 13/32 (41%), .035 → 16/32 (50%), .065 → 23/32 (72%), .08 → 23/32 (72%). With W211: 0→19%, .02→41%, .035→50%, .05→66%, .065→72%, .08→72%, .1→81%, .25→100%. The "cliff" is a RAMP across 0–.1 (roughly linear +9pp per ~.015 share; .065/.08 plateau within n=32 noise). Steepest step is the first one (0→.02, +22pp) — any aux beats none by more than more beats some.
- Nested lottery: higher share ignites superset-ish seed sets (.065 contains all 16 of .035's igniters) with margin reshuffle (.08 misses 5 of .065's, adds 5 new — W204's re-dealt lottery again). Dose monotonicity is population-level; seeds reshuffle at the margin. Same data pattern, fourth sighting.
- Pipeline n=64 (old 21/32 + new 17/32 share-.05): K50 full-LDA AUC .654 → .528 (chance). The W211 signal was n=32 noise — its own flag ("n=32-noisy") adjudicated correctly. K100 .437 (anti), K200 .562. trainAcc gap stays negative (−.009) but tiny.
- What survives: prefix-only univariate AUC .597/.595/.657 (K50/100/200) BEATS full LDA (.528/.437/.562) at every K. Seven features + n=64 = overfit; the single prefix probe generalizes better. Routing on K50-LDA (W211's priced 45.8%-for-8) does NOT survive — kill-bottom-half keeps 23/38 vs random 19/38. Don't route.
- Pre-reg: (a) monotone ramp ✓ (plateau .065/.08 owned as noise); (b) AUC-rises + trainAcc-confirmed — REJECTED on AUC, direction-held on gap; (c) prefix≈full — UPGRADED: prefix strictly beats full.

Verdict: USED with teeth (failed replication done right + ramp + nested lottery + prefix-beats-full). No precursor, no conflict.

## Tangential: flag with the adjudication attached (0-spend, reasoning only)

W211's K50 result shipped as "flagged not trumpeted (n=32-noisy)" — and the flag is what made this wave automatic instead of embarrassing. Upgrade the practice: every noisy-flagged result names its ADJUDICATION (n, substrate, meter) in the same line — "K50 AUC .654, n=32-noisy, adjudicate at n=64" writes its own follow-up wave. Flags without adjudications rot into footnotes; with them, they're pre-registered replications. W215 gets the same treatment below.

## Spend / queue

- Spend: 0 + 0 + 10 bench batches (160 runs; floor — same W211 justification, identical streams). Consumed backlog-W198 removed; spawned W215 to BACK. Backlog 17. Synthesis R36 clock: 1/5.
- W215 (A, bench): prefix-signal characterization — what IS the prefix edge (aux-head start vs slope?); igniter vs non prefix-trajectory shape at K50 (level vs slope discriminator); minimal probe size (<50 examples?); adjudicate at n=96 (flag: prefix-AUC .6±.05, noisy until then).
