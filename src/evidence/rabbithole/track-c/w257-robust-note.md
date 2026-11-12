# Wave 257 note (execution; backlog-W219 meter-robustness, sandbox)

STOP RULE: stopped after 2 grids (18-config hierarchy grid + 12-config boundary grid;
40 deployments x 200 trials each; w202 mechanics verbatim except chartered vProb/cap
manipulations). 1 direct + 1 tangential below. Spend: 0 search, 0 fetch. Clock: R40 2/5.
Pre-reg scored: (a) REJECTED-zero (b) CONFIRMED (c) price-CONFIRMED/capture-REJECTED
(d) CONFIRMED (e) CONFIRMED (f) CONFIRMED.

## Direct: adaptivity earns its keep only on axes the meter can see

Setup: 40 deployments per config; three knowledge levels on equal footing — ORACLE
(per-deployment best constant), POOLED (single constant minimizing mean loss —
knows the average world), METER (single tau fit pooled, adapts per trial).
Price of not knowing = pooled − oracle; VOI-adaptive = pooled − meter;
capture = VOI/price.

Blind-axis heterogeneity (richness vProb {.2,.4,.6,.8}, cap fixed — fpHat cannot
see richness by construction): the price EXISTS (C=.1/S=1: .0235; C=.15: .0242
mirror-image, pooled=SKIP bleeding on rich deployments; C=.2: .0029) and goes
FULLY unpaid — capture exactly 0.000 in all 4 C-cols, VOI 0.0000, W/L/T 1/1/38 at
best. The meter reproduces the pooled constant even where the pooled constant
bleeds on 10/40 deployments. (a) REJECTED (no +.005 anywhere — and the go-range
didn't even straddle at C=.05: .85–1.0, owned boundary-miss that motivated W219b);
(c) price-part CONFIRMED, capture-part REJECTED (0, not ≥.5); (d) CONFIRMED
(3 cols priced, all capture 0).

Visible-axis heterogeneity (dirt cap {.6–.8}, vProb fixed — fpHat tracks dirt):
at C=.1, VOI-adaptive +.0039, capture .386, W/L/T 8/26/6 — the meter beats the
pooled constant on 8 deployments where pooled-GO bleeds on dirty meters. (e)
CONFIRMED. Owned asymmetry: pooled still beats the meter on 26 deployments (the
pooled-fit tau over-GOs dirty deployments — threshold rigidity, owns W236).

Homo controls (b)(f) CONFIRMED: homo-lo, homo-hi, homo-mid all VOI exactly 0 —
W236 replicates in every homogeneous world including vProb=.5.

Mechanism: the meter is a constant-reproducer with a visibility window — it
tracks the best constant (W236) AND cashes heterogeneity (this wave) through the
SAME channel (fpHat keys on dirt). Movement on a meter-blind axis is unpriceable
by construction; the "robustness to not knowing the world" (W236) is scoped to
worlds whose variation the meter signal touches.

Verdict: USED-strong (chartered question adjudicated + visibility boundary +
priced zero twice and positive once + residual owned). No precursor, no conflict.

## Tangential: scope the robustness the way you scoped the winner (0-spend, reasoning)

W236 scoped the WINNER (tracks, doesn't lead); this wave scopes the ROBUSTNESS
(cashes heterogeneity it can see, reproduces pooled elsewhere). Every robustness
claim owes its blind axis beside its visible one — "robust to unknown worlds"
without the visibility qualifier is the same one-constant headline W216 ran.
Spawned W236 accordingly (per-deployment tau: is the 61% residual threshold
rigidity or meter noise?).

## Spend / queue

- Spend: 0 + 0 + 30 configs x 40 deployments x 200 trials (floor). Consumed
  backlog-W219 removed; spawned W236 to BACK. Backlog 17. Synthesis R40 clock: 2/5.
- W236 (C, sandbox): per-deployment tau — hetero-cap C=.1 (price .01, capture .386):
  per-deployment tau fit vs pooled tau (does local thresholding capture the rest?);
  decompose residual into threshold-rigidity vs meter-noise (per-deployment oracle
  tau as ceiling).
