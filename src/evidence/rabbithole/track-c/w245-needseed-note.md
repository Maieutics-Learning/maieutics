# Wave 245 note — backlog-W209 scaffolding-need seeds (bench, executed)

STOP RULE: stopped after saved-grid mining (66 rows, 2 grids) + 15 new runs (6 probe const@1 + 4 rescue + 5 toxicity-scope const@2). 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (saved grids + live-page TinyNN). Clock: R38 2/5. Pre-reg scored: (a) REJECTED (b) CONFIRMED-as-structural (c) demo-holds-but-moot (below).

## Direct: the probe is dead; the rescue is backwards — seed10 has a dose window, not a dose deficit

- Mining (sandbox, 0 new runs): fade-intolerance = seed10 alone (fadeGap −0.165, both doses −0.153/−0.177; all other seeds ≥ −0.007). Late-intolerance = seeds 9/11 at low dose only (−0.390/−0.446 @.25, gone @1 — dose-fixable, unlike seed10). Repeat losers identified: {10 fade, 9/11 late-low}.
- Probe REJECTED (against-interest): early-auxDep under const@1 ranks s11 .1875 > s12 .1851 > s8 .1711 > s7 .168 > s9 .1676 > s10 .1671 — seed10 is LOWEST, range ±6%, essentially flat. The grad-ratio instrument has no seed signal in the first window (later windows diverge .28–.51, but that's training dynamics, not a seed trait). First-50-step aux-dependence does not predict intolerance — on this instrument, in this window. Boundary owned: grad-ratio, steps 1–50, const@1.
- Structural need CONFIRMED: fade@2 does not rescue seed10 (hard4 .837 — same failure as @.25/.5/1: .63-class/.83/.8). Withdrawal-timing need, not amount. Seeds 9/11 pass fade@2 (.99/.867 — 11 marginal, note below).
- Dose toxicity DISCOVERED (the rescue-killer): const@2 seed10 collapses to .737 (in4 still 1.0 — length unlearned, base task intact; same signature as late@.25 collapses). Scope batch: const@2 → s7 .857 (down .09), s8 .98, s9 .993, s11 .98, s12 .97. Damage is seed-graded (s10 ≫ s7 > rest ≈ 0), converging with 6 s10 cells (.963/.983/.977/.737 const @.1/.5/1/2 + fade-failures everywhere). Seed10's window: const ≤1 AND no withdrawal — a dose window, not a deficit. The chartered "high-dose rescue" would have harmed the patient (n=1 per cell — W217-grade adjudication still owed for CIs, but the cross-dose convergence is 6+ cells deep).
- Targeted mix on saved cells (post-hoc DEMO, labeled): const@.5 for {9,10,11} + fade@.5 for {7,8,12} → 6/6 all ≥.95 vs blanket fade@.5 5/6. Schedule-by-seed works where blanket-withhold fails — but the ranking came from the same cells, so this is demonstration, not proof. The proof vehicle is the window mapping (W226), not this table.

Verdict: USED with teeth (probe killed against-interest + structural need + inverted rescue + graded toxicity scope). No precursor; s10-toxicity (W217) upgraded from flag to window.

## Tangential: test the cure's top dose on the neediest seed first (0-spend, reasoning only)

The charter prescribed high-dose rescue for the neediest seed without a toxicity cell — one const@2 run inverted the prescription. Rule: every rescue wave owes a cure-toxicity arm (max rescue dose × neediest seed × tolerant control) BEFORE the rescue grid, not after. Rescues are doses; doses have windows; the neediest seed has the narrowest window. W226 is this rule applied to itself (window edges before rescue claims).

## Spend / queue

- Spend: 0 + 0 + 15 runs (6 probe + 9 rescue/scope; floor). Consumed backlog-W209 removed; spawned W226 to BACK. Backlog 17. Synthesis R38 clock: 2/5.
- W226 (A, bench): s10 dose-window mapping — const@{.1,.25,.5,1,2,3,4} + fade@{.5,1,2} (replicate .867 for 11 too); s7 × const@{1,2,3} (is .857 a window edge?); dep50 dose-scaling check (instrument responds to dose .17→.43 — dependence, not independence); window edges per seed before any rescue claim.
