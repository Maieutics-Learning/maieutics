# Wave 323 note (execution; backlog-W274 detection-shape robustness, sandbox)

STOP RULE: stopped after 4-tape-seed P(argmax) grids (6 kink cells x 8000
trials x 4 streams) + crossing + N*-bisection on seed0. Double receipt
EXACT (trial means 0 vs w206; full bootstrap 0 vs w240 — bit-identical
replication). 1 direct + 1 tangential below. Spend: 0 search, 0 fetch.
Clock: R51 3/5. Pre-reg scored: (a) CONFIRMED-narrowly (b) CONFIRMED
(c) CONFIRMED (d) CONFIRMED-with-wobbles.

## Direct: the shape is real; 8000 overshoots by 30-58%; one stream dissents

(a) Above-winner resolution replicates: atKink(N8000)<.5 in 15/16
(seed,kink) cells; per-seed all-4 holds on s0/s1/s2, fails only s3-
narrow.0009 (.582 — one stream in four keeps the kink a flip at N8000).
The W282 headline is stream-robust, with exactly one owned dissenter.
(b) Crossing drifts down-lambda with N on seed0 at 4/4 kinks (net
-.04/-.14/-.09/-.03 log10; mid.0034 non-monotone: up then down — the
path wobbles, the destination doesn't). (c) N* = 5570/6155/6008/5071 —
2000<N*≤8000 all four: N8000 resolves everything but overshoots 30-58%;
running max-N* = 6155 saves 23% over 8000. 8000 is sufficient, never
minimal. (d) Halving law on all 4 seeds (r1 all in [.38,.67]; r2 in
[.45,.74] or annihilation — two instructive wobbles: s2-mid.0034 r2=.74
a hair above .7; s1-narrow.0025 r2=.96 stalls while its kink point fully
resolves (atKink 0) — resolution ≠ zone annihilation: the point can
settle while an off-kink toss-up band persists).

Verdict: USED-strong (double-exact receipt + 4/4 pre-regs + N* priced +
dissenter + point-vs-zone nuance). No precursor, no conflict.

## Tangential: price the sufficiency, keep the dissenter (0-spend)

Two products: N*=6155 replaces 8000 as the four-kink resolving budget
(23% cheaper, same verdicts), and s3-narrow.0009 (.582) stays on the
books as the stream that disagrees — a robustness claim with its
exception named is worth more than a unanimous one (the next wave knows
exactly where to look). Rule: when N seeds agree and one dissents, the
dissent is the next experiment, not a footnote — unanimity unexamined is
how CRN luck becomes law. W291 autopsies the dissenter (full ladder on
s3 at N8000; crossing s3 vs seed0; N* on s3 via extension to 16000: dies
or persists). Spawned W291 (s3-dissenter autopsy + N16000 extension).
