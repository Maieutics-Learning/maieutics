# Wave 254 note (execution; backlog-W217 s10-aux-toxicity adjudication, bench)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Charter
Adjudicate the W234 s10-toxicity flag (earlyRestore OFF 50-100 / ON 100+ @auxW1 → s10
hard400 .8333 with erosion; n=1 unclaimed) plus the W245 dose-toxicity context (const@2
s10 .737). Design: s10 x aux-duration {100-150, 100-200, 100+} x auxW {.5,1,2} (is
more-aux worse for the setup-slow seed?); generality across seeds {7,8,9,11,12}
(toxicity s10-only?); flag resolves to mechanism or lottery.

## Pre-regs (scored)
- (a) More-aux worse for s10 at fixed 100+: REJECTED. 100+ goes .92 / .9933 / 1.0
  across auxW .5/1/2 — more is better/flat, never worse.
- (b) Damage grows with duration at fixed dose: REJECTED. All 9 s10 cells >= .9067;
  worst cell is the SHORTEST gap-duration (100-150 @ .5 = .9067), no monotone damage.
- (c) Toxicity s10-only (others robust, s7 mild dip at hardest cell): CONFIRMED.
  Others .9533-1.0 across every duration/dose cell probed.
- (d) Gap-duration (100-150) safe at all doses for s10: CONFIRMED trivially
  (worst .9067, no collapse anywhere in the factorial).

## Rig
`scratch/track-c/w217-tox.js` (vendored w200-windows rig: SeqModel h16 parity6, 400
steps, 7-pt trajs; durations as ON-windows with OFF elsewhere; `awAt` already
supported cut/restore — batch unpacking generalized mid-wave from 4- to 6-element
cells `[start,recut,cut,restore,auxW,seed]` to express the causal A/B shape).
Batch A: 9 runs (s10 x 3 durations x 3 doses) → `w217-A.json`. Batch B: 12 runs
(seeds {7,8,9,11,12} x 100+ x {1,2} + {s7,s11} x 100-200 x {2}) → `w217-B.json`.
Analysis `w217-an.js` → `w217-an.txt`. Batch C: 1 causal A/B cell → `w217-C.json`.

## Results
A (s10 duration x dose, hard400): 100-150 @ {.5,1,2} = .9067/.9733/1.0; 100-200 =
.94/.9267/1.0; 100+ = .92/.9933/1.0. In-dist in400 = 1.0 (one .9844) everywhere.
B (others, 100+ and 100-200): s7 .9533/1.0, s8 1.0/1.0, s9 .9967/1.0, s11 .9667/1.0,
s12 1.0/.9833; 100-200@2 s7/s11 both 1.0. No toxicity anywhere outside s10's flag.
C (causal A/B, s10 {cut:50,restore:100}@auxW1 — W234-earlyRestore exact shape):
hard400 = **0.8333**, EXACTLY replicating W234's .8333 in the same rig, same seed,
same train streams, differing from W217's 100+ (.9933) ONLY on steps 1-50 aux
(ON vs OFF). Traj: 50:.51 / 100:.4767 / 150:.8633 / 200:.9767 / 250:.89 / 300:.8767 /
400:.8333 — late erosion with intact in-dist (in400 = 1.0).

## Mechanism (owned update)
The toxin is NOT dose x duration. It is **early-aux (steps 0-50) + interruption
(gap 50-100) + continuous return (100+)**: early scaffolding that gets cut and
restored poisons s10's hard generalization while leaving in-dist perfect; the same
late scaffolding WITHOUT the early history (OFF 0-100, ON 100+) is harmless-to-helpful
(.9933). Cross-wave comparison owned as the hypothesis source (W234 vs W217 differ
only on 0-50); same-rig exact replicate (.8333 == .8333) is the confirmation.
s10's sensitivity is a seed lottery (setup-slow seed + poisoned early history), not
general aux fragility — all other seeds are robust everywhere probed.

## Verdict
USED-strong. Killed the dose-toxicity story for s10 with a full factorial, then
promoted the residual single difference to a causal A/B that replicated exactly.
Spawned W234 (early-aux-toxin mapping: aux-history sweep x interruption on s10 +
{s7,s11} toxic-corner generality — is 25 steps enough to poison; does no-gap cure;
toxin dose-threshold or s10 lottery).

## Tangential (reasoning, 0 spend)
When the grid exonerates the suspect, the leftover single difference becomes the
suspect — one exact A/B (differing in precisely one factor) beats another grid.
