# Wave 252 note — backlog-W215 prefix-signal characterization (bench, executed)

STOP RULE: stopped after 32 new runs (seeds 71–102, extended K10/25 logging + probe subsets) + n=96 adjudication analysis. 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (vendored w181 rig; live-page TinyNN). Clock: R39 3/5. Pre-reg scored: (a) REJECTED-below-band (b) REJECTED-both (c) REJECTED-no-signal-to-saturate.

## Direct: the K50 flag dissolves on schedule; the residue lives at K200

- (a) Adjudication (n=96: 64 banked + 32 new): K50 prefix-only AUC .529 — below the flagged .6±.05 band, completing the decay (.654 @n=32 → .597 @n=64 → .529 @n=96). The flag rule worked exactly as designed: noisy flag → named adjudication → dead on schedule, no embarrassment. K100 .523 (chance). K200 .636 (holds: .657 @n=64 → .636 @n=96 — the durable signal is LATE prefix, meanIgn .7305 vs .6675). fullLDA @K50 .446 (anti — multivariate still overfits).
- (b) Level-vs-slope (fresh n=32, exploratory-labeled): level AUC .392 (REVERSED — non-igniters HIGHER prefix@50: .5826 vs .5535), slope50−10 .558, hard@50 .408. Neither discriminates at K50; the shape is a CROSSOVER: non above ign at K10/25/50/100 (.549/.588/.583/.617 vs .502/.523/.554/.589), ign above only at K200 (.736 vs .686). The W211 slow-starter signature (trainAcc-negative) in prefix form: eventual igniters start LOWER and overtake late.
- (c) Probe size (fresh): AUC 10:.548 / 25:.540 / 50:.392 — no saturation because no signal (all ≈ chance; the 50-drop is first-k ordering noise, owned as exploratory). Probe size doesn't rescue a dead signal; adjudicated moot.
- Consequence (standing): no routing at any K (W232's kill extends to n=96); K200 prefix is confirmation, not prediction (saves 0% compute — too late to route). The signal's address is now a shape (crossover), not a number.

Verdict: USED with teeth (flag dead on schedule with decay curve + crossover shape + K200 residue + routing stays dead). No precursor, no conflict.

## Tangential: decay curves are verdicts about the flagging process (0-spend, reasoning only)

.654→.597→.529 across n=32/64/96 is a monotone march to chance — the decay curve ITSELF is the finding about W211's pipeline (n=32 + 7 features + LOO = noise with a good story). Every flagged predictor now owes its decay curve in advance: report the n=32 number WITH the n=64/n=96 adjudication numbers reserved beside it, so the follow-up only fills blanks. W215's flag line ("prefix-AUC .6±.05, adjudicate at n=96") did exactly this — the wave was automatic. Pre-register the decay, not just the point.

## Spend / queue

- Spend: 0 + 0 + 32 runs (floor). Consumed backlog-W215 removed; spawned W232 to BACK. Backlog 17. Synthesis R39 clock: 3/5.
- W232 (A, bench): crossover + aux-starvation mechanism — prefix at K{50,75,…,200} + realized aux-share per run (first-200-step aux-coin counts) on share-.05 n=32–64: pin the overtaking window; test whether early-prefix deficit tracks aux-coin luck (slow-starter = aux-starved early?).
