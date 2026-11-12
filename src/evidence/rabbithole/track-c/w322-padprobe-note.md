# Wave 322 note (execution; backlog-W273 pad-forward origin decomposition, bench)

STOP RULE: stopped after fresh-model probes (3 seeds x 4 examples, 6 arms)
+ 3-arm fix trains (s7, PADN=1, 150 steps). 1 direct + 1 tangential below.
Spend: 0 search, 0 fetch (bench, vendored w256 core). Clock: R51 2/5.
Pre-reg scored: (a) CONFIRMED (b) CONFIRMED (c) CONFIRMED (d) SPLIT
(C finite CONFIRMED, D NaN REJECTED-informatively) (e) CONFIRMED.

## Direct: the origin is OOV indexing; the cheapest fix is one line

Probes (identical all 3 seeds): A unpadded 0/4 NaN vs +1pad 4/4 (W301
receipt, triple-replicated). B1 (pad->0) and B2 (pad->dup-last) both 0/4 —
pads-as-valid-ids forward cleanly, so attention-over-pads is NEVER
implicated; the killer is the lookup, not the mixing. E nails it: E.v
length 144 = 9x16 (no row 9 exists), E.v[9h] undefined — id 9 indexes out
of bounds and undefined poisons arithmetic on contact. C (custom
mask-aware) 0/4 finite — an independent finite forward exists. D
(custom UNMASKED, padId=-1) 4/4 NaN — predicted finite, rejected: even
the custom forward NaNs unmasked, via the eb-mean path (empty OOB slice
indexes undefined in the mean-embedding accumulation). So "masked works,
unmasked breaks" holds in BOTH forwards; the decomposition is complete:
every NaN path starts at the missing row 9, no path starts at attention.
Fix trains: control NaN from step 1 (3772 weights, accU .264 flat —
W256 in miniature); clamp (pad->0, one data line) accU .741 finite;
truncate accU .745 finite. Both hold .7+; clamp is cheapest (no length
handling, identical outcome within noise: .741 vs .745).

Verdict: USED-strong (triple-replicated receipt + lookup-vs-mixing
separation + geometry receipt + 2 working fixes + control + informative
D). No precursor, no conflict.

## Tangential: prove the negative (0-spend)

The wave's strongest result is a zero: B1/B2 0/4 across 12 fresh
forwards — attention over pad positions NEVER breaks when the ids are
valid. Most ablations prove their positive (clamp fixes it); this one
also proved its negative (mixing is innocent). Rule: when two suspects
share a crime scene, exonerate in public, not just convict — "not
attention" is load-bearing for every future attn-arch change (a deeper
stack inherits the exoneration; a convicted attention would have
condemned it). W290 tests fix generality (clamp/truncate x seeds 11/13:
does the one-liner hold off seed 7; trunc-vs-clamp parity; control onset
per seed). Spawned W290 (fix-generality bench).
