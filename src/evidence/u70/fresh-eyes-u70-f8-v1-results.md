# U70-F8 battery barrage results (10/10 NEEDS-PATCH, 2026-11-27)

Premise: `premise-u70-f8-v1.0.md`. Verbatims: `f8-battery/r1..r10`.

## Convergent charges
1. **Prior-leak (all 10, satisfiable core):** fixed `[0.5,0,0,0]` can't distinguish "breaking symmetry" from "this scalar is a good prior." Legitimate demands: counter-tilt `[0,0,0,0.5]` (r1), different-bias null (r6), random-bias control (r10). Without it, a fix reads as priming, not symmetry-breaking.
2. **Comparability-purity (all 10, unsatisfiable):** any init shift = different basin = invalid paired comparison. Same demand as F7's battery (any path change = incomparable). Rejected with the same derivation: paired same-draws design isolates the tilt as the ONLY difference; basin shift is the effect under test, not a confound. Accepting this demand ends all experimentation (F1/F2/F4/F7 all "incomparable" by it).
3. **Pseudo-success (r5/r7/r8/r9):** bias-help without full usage-collapse. Covered: usage histogram filed; probe-locked rule fails bias-collapse as PERSISTS. Tilt-direction-vs-outcome table added (below) as extra tripwire.

## Adjudication (for owner arbitration → v1.1)
- ADOPT the disambiguator, single-arm form: tilt DIRECTION randomized per seed (pre-registered RNG 76000+s mod 4; magnitude fixed 0.5; be.w[d]=0.5, rest 0). Same base draws/streams otherwise. Under the symmetry hypothesis ANY per-birth asymmetry works (direction-independent un-flips); under the prior-leak hypothesis only the canonical direction would work. The battery's control demand is met INSIDE one arm, N=20, no doubling. Direction-vs-outcome filed descriptively.
- REJECT comparability-purity (derivation above — identical to F7's standing rejection).
- v1.1 = v1.0 + random-direction + direction/outcome table. Re-close needed, then countersign, then execute.
