# Wave 215 note — backlog-W184 selective-abstain hybrid (sandbox, executed)

STOP RULE: stopped after 12-world x 9-arm x 6-seed grid (no positive-EV treatment arms — spawned W201, not built). 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (worker sandbox; w184-hybrid.js). Clock: R33 2/5. Pre-registered predictions scored: (a) CONFIRMED (b) FAILED (c) CONFIRMED (d) FAILED.

## Direct: metering cannot rescue a negative-EV treatment

Grid: W167/W194 mechanics + W168 score overlap (harmed s~U(.3,1), non s~U(0,cap), cap {.6,.7,.8}) x gates {.65,.5,.35,.2} x arms {retrieval, abs0/2, hybrid(m∈{.3,.45,.6}) x κ∈{0,.2}} x seeds 7-12, 400 cases. Hybrid: gated+s≥m → retrieval-treat, gated+s<m → abstain.
- (a) Selective/cap.6 tie ✓: all arms .520-.521 (fp≈0 — gate owns stakes, again).
- (b) FAILED, decisively: hybrid NEVER beats abs0. Best case cap.6 (clean meter, m.6 FPR=0): greedy .322 vs .326 (−.004), very-greedy .205 vs .209, mid .447 vs .451 — always −.004 (treated-tp lottery noise). Under overlap it bleeds: cap.7 greedy −.085, cap.8 greedy −.140 (m.6 FPR .28/.43 — treated FPs).
- Mechanism (the kill): treating gated-harmed has EV .45×1−.55×1.5 = −.375 < 0 = abstention. Every tp the hybrid "rescues" from abstention destroys .375; its metered fp-dodges can't cover the loss. abs0 wins precisely by never treating anyone. The spawn premise (treat-harmed + dodge-fp wins) is arithmetically dead wherever treatment EV < 0 — metering moves you toward abs0 from below, never above it.
- (c) CONFIRMED, and it sharpens the kill: k*_hyb ≥ k*_abs at every gate where defined (mid .593 vs .475; greedy .600-.637 vs .547; very-greedy .589-.600 vs .554; cap.7/.8 same pattern). Hybrid's abstentions ARE higher-quality per-case (bigger κ-headroom) — while its TOTALS never beat abs0. Headroom vs levels: k* measures the abstention margin, totals include the treated-tp losses. Both true; report both.
- (d) FAILED: three-column audit — hybrid never beats BOTH constants (never beats abs0). Per W196's rule this bounds the question, not the answer: the profitable-metering question is worth asking only where treatment EV > 0 → W201.
- Meter-error pricing (in W168 units): clean cap.6 costs hybrid .004 (noise); moderate cap.7 costs .04-.09; heavy cap.8 costs .06-.14 (all vs abs0, κ=0, best-m). The price of overlap is now denominated — W168's overlap parameter doubles as the hybrid's bill.

Verdict: USED-with-teeth (premise killed under negative-EV treatment with mechanism; headroom-vs-levels split; meter-error priced in overlap units; idea bounded to positive-EV worlds). No precursor, no conflict.

## Tangential: losing arms price the winner (0-spend, reasoning only)

Hybrid's value here is entirely as abs0's sparring partner: it proved abs0's dominance is NOT about metering (even a perfect-FPR meter loses by .004) but about treatment EV. A losing arm that isolates WHY the winner wins is worth its grid. Design rule: when an arm loses everywhere, check whether it lost on every margin (dead idea) or won a margin while losing the total (live distinction) — hybrid won headroom, lost levels. Dead premise, live distinction.

## Spend / queue

- Spend: 0 + 0 + 1 grid (12 worlds x 9 arms x 6 seeds; floor). Consumed backlog-W184 removed; spawned W201 to BACK. Backlog 17. Synthesis R33 clock: 2/5.
- W201 (C/A, sandbox): positive-EV hybrid — treatment success retrieval .45→{.6,.7}, cf .55→{.7,.8} x meter caps {.6,.7,.8}; where does hybrid beat abs0 (crossing map); k* with treatment value in the numerator; same gates x kappa.
