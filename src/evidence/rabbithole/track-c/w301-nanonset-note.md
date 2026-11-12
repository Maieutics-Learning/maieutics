# Wave 301 (execution; backlog-W256 NaN-onset + grad-clip rescue, bench) 2026-11-12
STOP RULE: stopped after 7-arm clip/reinit grid (s7 nativepad PADN=1, 300 steps, checkpoints
every 25) + step-1-resolution onset hunt (10 steps, forward/grad/weight NaN per step) + fresh-model
pad probe. 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (vendored w222 core).
Clock: R47 5/5 (FULL — synthesis R48 next).

## Direct: death is instantaneous, forward, and unclippable

- Onset = STEP 1: first padded forward yields NaN logits on 8/8 examples BEFORE any backward pass;
  grads 3772/3772 NaN; one Adam step NaNs all 17 tensors simultaneously (144/144 ... 4/4 — every
  tensor 100%, steps 1..10 identical, and 25..300 identical). No creep exists — there is no earlier
  state. "Which tensor first" is moot: a single all-NaN Adam step writes NaN everywhere at once.
- Forward origin, closed: fresh model at init — unpadded forward 0/4 NaN (all finite), SAME example
  + 1 pad token 4/4 NaN. Pad handling in native forward (OOV id 9) kills the pass on contact.
- Grad-clip DEAD at all 5 thresholds (.25/.5/1/2/5, active from step 1): final .264, full NaN,
  preClipNorm=NaN at every checkpoint. Clipping bounds finite grads; forward-NaN makes grads NaN
  before clipping matters (NaN*factor=NaN). Prevention must be FORWARD (mask/OOV fix), never backward.
- Reinit DEAD: rebuilt-fresh at step 25 re-diverges by step 50 (fully NaN, .264) — divergence is
  environmental (pads), not init luck. Cure is impossible fast; the W222 18/18 flat is now triply
  explained. Clip-vs-reinit cost: both cost everything (0% rescue); prevention (skipb/truemask
  masking) is the only door — W281's rule closes with mechanism.
- Scripts: scratch/track-c/w256-nanonset.js (7 arms), w256-onset.js (step hunt). Grids inline
  (trajectories in page_eval receipts; onset rows step1-10 all-identical quoted above).

Verdict: USED-strong (step-1 onset with forward/grad/weight separation + 5-threshold clip kill +
reinit kill + fresh-model OOV probe). No precursor, no conflict. Spawned W273 (pad-forward
origin decomposition: embedding vs attention; minimal forward fix).

## Tangential: the resolution ladder ends at the first event (0-spend, reasoning)

25-step checkpoints showed total death and looked like "sudden everywhere"; step-1 resolution showed
the death was already over before the first checkpoint. Coarse resolution doesn't just blur timing —
it manufactures mysteries ("which tensor first?") that finer resolution dissolves (all-at-once by
construction). Rule: when every channel reads max at the first checkpoint, the onset is BEFORE the
grid, not at it — halve the resolution until a zero appears (here: step 0 clean, step 1 total).
W273 inherits the address (within-forward: embedding row vs attention over pads).
