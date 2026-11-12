# Wave 277 note (execution; backlog-W236 per-deployment tau, sandbox)

STOP RULE: stopped after 2-config per-deployment grid (hetero-cap + homo-mid
control at C=.1; 40 deployments x 200 trials; w219b mechanics verbatim, same
seeds). 1 direct + 1 tangential below. Spend: 0 search, 0 fetch. Clock: R43
4/5. Pre-reg scored: (a) CONFIRMED-stronger-form (b) CONFIRMED (c)
REJECTED-zero (d) CONFIRMED.

## Direct: the residual was all rigidity; the meter is a level detector

hetero-cap C=.1 replicates W219b exactly (pooled .0132, meter-pooled .0094 @
tau .15, VOI .0039, capture .386) then localizes completely: per-deployment
best-tau mean loss .0032 == oracle .0032 — capture_perdep 1.001, FULL capture.
(a) CONFIRMED in stronger form (bar was .6). Decomposition of the .01 price:
pooled tau takes .0039 (38.6%), localization takes .0062 (rigidFrac .616 — (b)
CONFIRMED), meter noise takes -.0000 (c) REJECTED: there is NO noise floor;
the best local threshold reaches the oracle constant exactly. 38.6 + 61.6 +
0 = 100% accounted — the residual is fully explained, with nothing left for
meter noise.

Taus tell the mechanism: cap.6 deployments fit tau=1 (always SKIP — pooled-GO
bleeds there), all dirtier deployments fit tau~=0 (always GO, one d9 at .04).
Per-deployment "thresholding" IS per-deployment constant selection — and it
merely TIES the oracle constant within every deployment. Owned scoping: the
meter's entire value here is BETWEEN deployments (level-shift to local dirt),
zero WITHIN (trial-level timing adds nothing over the local constant). The
meter is a dirt-level detector, not a trial timer. homo-mid control (d)
CONFIRMED: price 0, per-dep VOI 0 — localization fits nothing where there is
nothing (40 fitted taus, zero gain, zero harm).

Verdict: USED-strong (full capture + complete 3-way accounting + level-vs-
timing scoping). No precursor, no conflict.

## Tangential: a ceiling reached is a question closed (0-spend, reasoning)

capture 1.001 ends the hetero-cap line — no residual means no next wave on
this config. Waves usually spawn refinements; a closed question should spawn
a PRICE instead: how coarse can the localization get before capture breaks —
40 taus are sufficient, are 5 (quintile) or 2 (halves)? W253 asks exactly
that. Rule: when a wave hits its ceiling, the child wave auctions the
knobs back (sufficiency → necessity: which coarseness keeps full capture?).
