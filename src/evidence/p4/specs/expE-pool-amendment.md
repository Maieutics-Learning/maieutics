# Exp-E amendment v2.1: 10-mouth diagnostic pool (COUNTERSIGNED 2026-11-20 —
user-ordered "spread out on breadth ... pool of 10 per generation to see if it
is luck"; battery findings to be patched in before the pool runs)

## Motive
G0 stillborn on one seed (held 2.9389). Author reads luck; user orders breadth.
One reseed cannot separate luck from system; ten inits can.

## Design (diagnostic only — buys a verdict on luck-vs-systematic, not a chain)
- 10 fresh mouths (inits 10300–10309; 10300 = the stillborn draw, RE-RUN as
  filed (determinism check: must reproduce 2.9389 ± 0.02 or the stack has
  nondeterminism — HALT the pool on mismatch, file it).
- Same pool (structPool 9770/600), same recipe (trainMouth 800, batch 8,
  Adam 5e-3, seeds 10301–... per-mouth train seeds 10400+i). No other changes.
- Readout per mouth: train first/last + held-structured loss (9771/200).
- Verdict rule: ≥3/10 held < 2.7 → LUCK (init lottery; distribution filed, NO
  continuation under this amendment — user picks next step on the numbers);
  0/10 → SYSTEMATIC (recipe or pool; Exp-E seed assembly re-designed, new
  mini-prereg); 1–2/10 → GREY (filed as thin; user calls retry-depth vs kill).
- Ledger: expE-pool-m{i}.json × 10 + expE-pool-verdict.json. Resume-safe per
  mouth. Cost ≈ 10 × 13 min, batched 4/call.

## No-look-ahead (firewall)
The gate reads ONLY the 10 held losses. Train curves, generations, E-grades of
pool mouths are computed at verdict time for the record and never consulted
earlier. No mouth continues into any chain under this amendment — not even the
best (picking the winner here is seed shopping; continuation needs a new
countersign naming mouths + reason).

## Expectation
Luck: 3–5/10 learn (v42 TE + v0.6 mouths learned on nearby seeds; run-7 says
stalls hit a minority of inits). The stillborn re-run reproduces (determinism
held everywhere so far). Pre-mortem: strongest objection = 10 draws still
can't rule out pool-level pathology that bites most-but-not-all inits
(confounded luck/systematic middle) — answered by the GREY band + user call,
not by pretending n=10 resolves everything. Most likely failure: worker
timeout mid-batch (resume-safe ledgers; rerun missing mouths only).
