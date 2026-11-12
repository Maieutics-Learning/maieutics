# Wave 223 note — backlog-W191 barrier-crossing dynamics (sandbox, executed)

STOP RULE: stopped after 260 trajectory runs (1500 steps, rec every 10) + 80-run matched-side addendum (3 inits). 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (vendored w174 rig + trajectory recording + signed-pow family). Clock: R34 4/5.

## Direct: saddles are crossable until noise wins; the kink taxes only the crossing side

(A) Sharpness, signed-pow family a=sign(p)|p|^k (crossable in principle — dynamics-only barrier, unlike W203's square a=p²≥0 which is uncrossable by construction; no contradiction): NEG flip-rate/medFlip — natural 1.0/20, tanh 1.0/20 (settle slower, 150 vs 50, compression), pow1.5 1.0/30, pow2 1.0/30, pow3 0.6/70 (meanFinal −0.555, bimodal: half cross, half dither at 0), abs 0.0/— (meanFinal 0.008, kink trap replicated). No monotone slowdown — flat 20→30 for k≤2, then a CLIFF at 3. Mechanism: Adam's normalization (step ≈ lr·m̂/√v̂) defeats vanishing gradients while the gradient sign is consistent; at k=3 the micro-gradient drowns in batch noise (sign flips → m̂ oscillates → dither). So barrier strength under Adam is binary (consistent-sign vs noise-dominated), not graded. W203's "capture into exactly-zero" for square stands but re-layered: representation (a≥0 can't express −1) + dynamics (p→0 exactly).

(B) Matched-side POS, natural vs abs at init {0.2, 0.9, 1.5}: IDENTICAL everywhere (settle 10–20, collide 0.0, fail 0.0, same error curves to 3 decimals). Pre-reg abs-slower REJECTED cleanly — Adam never overshoots into the kink from the matched side. Scoping: the kink taxes ONLY the crossing attempt; matched-side cost is zero at standard settings.

(C) Prod asymmetry, NEG p0=0.9 × q0 {0.9(sym),0.5,1.0,1.5,2.5}: sym stuck 0.0 (meanFinal exactly 0); EVERY asymmetry flips (1.0, medFlip 20–30, settle 40–80). Threshold confirmed SHARP (0 vs any), rate-monotone REJECTED/flat (q0=0.5 marginally fastest at 20/40 — noise-level, owned). Escape needs broken symmetry, not large symmetry-breaking.

Verdict: USED with teeth (saddle-cliff + optimizer mechanism + no-matched-cost scoping + sharp threshold). No precursor, no conflict.

## Tangential: separate the crossable from the uncrossable before timing the crossing (0-spend, reasoning only)

Half of W191's design nearly measured the wrong thing: timing "crossing" on barriers that forbid it by construction (a≥0 vs target −1) confounds representation with dynamics. The signed-pow family was the fix — same vanishing-gradient shape, crossable in principle — and it reversed the naive prediction (pow2 flips at 30, not never). Rule: for every barrier-timing claim, first exhibit a crossable variant with the same local geometry; if the variant flips fast, the barrier is representation, and the timing question dissolves.

## Spend / queue

- Spend: 0 + 0 + 1 grid (260 traj runs + 80 addendum; floor). Consumed backlog-W191 removed; spawned W208 to BACK. Backlog 17. Synthesis R34 clock: 4/5.
- W208 (A, sandbox): optimizer × barrier — SGD (no normalization) vs Adam vs sign-SGD on signed-pow k-family; predicts SGD restores k-monotone slowdown (raw vanishing gradient bites) and strands pow2, sign-SGD flips everything; maps which barrier results are optimizer artifacts.
