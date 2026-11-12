# Wave 402 (execution; backlog-W340 D-right extension, sandbox) 2026-11-12
STOP RULE: stopped after D{5,6} x t0{7..10} extension + D{5,6} x t0{5,6}
receipt (4/4 exact). 1 direct + 1 tangential below. Spend: 0 + 0 + run.
Script scratch/track-c/w340-dext.js (rig 57/57 line-verified from
w323-dip.js); grid scratch/track-c/w340-grid.json. WIND-DOWN: no spawn
(backlog drains 11->10).

## Direct: un-censoring reveals a glide, not a second act — D6 flat, D5's cliff stands alone

- RECEIPT: 4/4 cells exact vs w323-grid (all fields + nT/nC). The extension
  extends the validated ladder, doesn't redo it.
- (a) PASS: D6 un-censors as flat-forever — max consecutive drop .0425 over
  t0 2..10 (still at t0=3), right side a smooth glide .285→.201 with steps
  .02-.03. No cliff past 6, no edge anywhere in 1..10 (max drop .0425 vs
  runner-up .0407 — tie-break noise). D6 has no address; the W323 cliff@3
  stays retired as noise.
- (b) REJECTED — and the rejection is a pre-reg misread, owned: I read the
  W323 drop-sizes (.0558/.0407/.0318) as fq levels and predicted a ≤.04
  floor. Actual fq runs .45→.19: D5's right side glides .261→.192 with no
  second edge, and the runner-up drop (.0407 at t0=3) exceeds half the cliff
  (.0558). D5@4 confirmed as the SOLE edge (largest drop, both sides
  measured 1..10), but the "floor" framing was wrong — it's a cliff with a
  long right glide, not a cliff onto a floor.
- (c) PASS: addresses hold under extension — cliffAt D5 = 4, D6 = 3
  (recomputed over the full 1..10 curves).
- Mechanism detail, free: fqC is exactly .1778 at every t0 for both D (clean
  false-alarm floor, t0-blind as constructed); the entire curve shape rides
  fqT gliding down as the dip slides right. The extension decomposes the
  curve without touching a knob.
- Verdict: USED with teeth. D6-flat confirmed to 10 + D5 sole-edge
  confirmation + owned pre-reg misread + fqC/fqT decomposition. NO SPAWN
  (wind-down).

## Tangential: misread units die in public (0-spend)

The (b) pre-reg compared drop-sizes to a level threshold — a units error,
not a theory error, and it failed loudly on its own terms. Rule: when a
pre-reg fails, first check the units before revising the theory — half of
all "data surprises" are comparison errors wearing finding clothes. (Artifact
hygiene family, W317's frozen-z discipline: validate the readout before
theorizing the data.)
