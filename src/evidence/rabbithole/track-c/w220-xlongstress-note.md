# Wave 220 note — backlog-W188 xlong+h24 carry-stress (bench, executed)

STOP RULE: stopped after 32-run grid (4 modes x h{16,24} x seeds 7-10, 300 steps; testIn + 4-pair hard + 6-pair xlong; no pad-count ladder — spawned W205, not built). 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (page bench; w188-xlong.js vendored from w171). Clock: R34 1/5. Pre-registered predictions scored: (a) CONFIRMED (b) CONFIRMED (c) CONFIRMED.

## Direct: the null holds at 2x-max and 2x-width

Grid: assocR attn, modes {control, nativepad, truemask(skipB=false design-a), skipb(design-b)} x h{16,24} x seeds 7-10; evals testIn + hard-4pair + xlong-6pair (200 ex, len 16 = 2x train max 8, never-seen pairs).
- (a) truemask-A holds ✓: truemask−control xlong gap −.001 (h16) / −.010 (h24). No edge either way at 2x-max — the null from W199 survives doubled length and 1.5x width. Design-a is a choice, not an edge.
- skipb == control BIT-IDENTICAL on xlong AND hard-4pair, at BOTH widths (per-seed exact: .31/.35/.31/.315 both modes both widths... h24 .325/.35/.3/.32). Carry is inert under 2x load — bit-exactness now spans evals (in/hard/xlong) × widths. Fourth exactness sighting; the mechanism (state-frozen skips) is load-invariant.
- (b) No design×width interaction ✓: h24−h16 control xlong = +.003 (all boats flat); nativepad h16 vs h24 BIT-IDENTICAL per seed (.195/.13/.15/.155 both). Width rescues nothing (nativepad) and breaks nothing (rest). Pad handling is width-invariant, full stop.
- (c) Nativepad divergence, 4th sighting, powered ✓: control−nativepad xlong = .164 (h16) / .166 (h24) — clears the ≥.15 bar at n=4 both widths. Nativepad xlong .158 (vs control .321), hard .241 (vs .525/.517), testIn .264 = chance. Pads halve the stressed score and destroy the easy ones; width can't rescue pad corruption (identical across widths).
- Stress calibration: 6-pair xlong drops control .525→.321 (4-pair→6-pair at 2x length) — the stress bit (harder pairs + unseen length composes to ~chance+0.07). Nativepad .241→.158. Floor effects owned: at .32, gaps compress (ceiling/floor discipline from W206 — the unsaturated backup here is the 4-pair gap, which agrees in sign and size).

Verdict: USED (stress null holds three ways: bit-exact carry, edgeless truemask, powered nativepad divergence; width-invariance added). No precursor, no conflict.

## Tangential: stress the null, not the effect (0-spend, reasoning only)

This wave spent 32 runs trying to BREAK three nulls (carry-inert, truemask-no-edge, width-invariance) and broke none — and that is the product. A stress wave that finds an effect reports it; a stress wave that doesn't still ships: the survival certificate with the stress level stamped on it (2x length, 1.5x width, n=4, bit-exact). Nulls without stamped certificates expire quietly when conditions change; this is the stamping run. File the pattern: every adopted null gets a scheduled re-stress at 2x the conditions that certified it (nativepad's 4 sightings are the model — same seeds, harder eval, wider net).

## Spend / queue

- Spend: 0 + 0 + 1 grid (32 runs x 300 steps + long evals; floor). Consumed backlog-W188 removed; spawned W205 to BACK. Backlog 17. Synthesis R34 clock: 1/5.
- W205 (A, bench): pad-load ladder — PADN {0,3,6,12,24} x modes x 4 seeds h16 (design gaps vs pad load; nativepad dose-response; does truemask/skipb hold when pads dominate the sequence; same evals + xlong).
