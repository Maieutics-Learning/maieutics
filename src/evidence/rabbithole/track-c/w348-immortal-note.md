# Wave 348 (execution; backlog-W295 immortality boundary, bench) 2026-11-12
STOP RULE: stopped after 4-cell grid (1 receipt + 3 new, s18 cut50/restore800;
recut1400->2400 receipt + recut1000->{1800,1900,2000} duration ladder).
1 direct + 1 tangential below. Spend: 0 + 0 + bench. Script
scratch/track-c/w295-immortal.js; grid scratch/track-c/w295-grid.json.

## Direct: 1000 aux-free steps kill the immortal in both windows; W246's flat-800 doesn't replicate here

- RECEIPT: rec18 bit-exact vs w278 new18 (all 15 traj keys + in1/hard1) —
  the bench extends the validated rig, doesn't rebuild it. In-passing
  determinism: dur800/900/1000 trajs match bit-for-bit through 1800.
- New trajs (recut1000): 1000: 1.0 -> 1200: .947 -> 1400: .913 -> 1600: .903
  -> 1800: .88 -> 2000: .88. Last-3: dur800 .8987 / dur900 .8987 /
  dur1000 .8877.
- (a) HOLDS-weakly: graded 800=900>1000 — no deepening between 800 and 900
  (identical trajs), one step down at 1000, then a floor (.88 at 1800 AND
  2000 — erosion STOPS, drop-then-floor again).
- (b) HOLDS-coarsely: dur1000 last-3 .8877 within .05 of W328's late-window
  .9243 (|diff| .037) — 1000 aux-free steps kill immortality in the early
  window too. Duration owns the coarse verdict.
- But levels disagree at every matched duration (+200: .947 vs .993; +400:
  .913 vs .97; +600: .903 vs .957; +800: .88 vs .913): the early window
  erodes FASTER throughout. Duration owns dead-or-not; the protocol
  (consol x onset) owns the rate — W328's "levels are window addresses"
  extends to erosion rate.
- (c) REJECTED-clearly: no 800-hold here — erosion starts within 200 steps
  of recut (1.0 -> .947, the steepest drop of the traj). W246's "s18 holds
  1.0 through 800 aux-free" does not replicate from restore800-consol
  (there: restore400, consol 400 steps; here: restore800, consol 200
  steps). There is no universal 800–1000 boundary; erosion-onset rate is
  a consol-protocol address. Consol length orders it (200-fast here,
  400-hold W246, 600-slow W328) — confounded with onset, so W312 tests
  it cleanly (fixed erosion window, consol 600/400/200).
- Verdict: USED with teeth (w348-immortal-note.md is this file). Receipt +
  coarse duration-owned + rate-is-protocol + W246 scoped (flat-800 is a
  consol address, not a seed constant) + floor datum. Spawned W312
  (consol-length stickiness ladder).

## Tangential: a hold is a protocol address until re-shown (0-spend)

W246's flat-800 survived as "the immortal coasts 800 steps" for a round
and died as a universal here (eroding by step 200) — same seed, same
recut concept, different consol address, different physics. This is
W328's rule applied to W246: never quote a hold without its consol
(restore address + consol length + recut address). "s18 coasts 800" is
now "s18 coasts 800 after consol400@400–800; erodes from step 200 after
consol200@800–1000". W312 varies exactly one joint (consol length, fixed
erosion window) to price the stickiness.
