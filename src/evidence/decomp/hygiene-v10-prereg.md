# B3 hygiene tax v10 (E5, countersigned, eval-only + 1 train pair)

Agent approval: this file. User countersign: 2026-11-23.

## Why
All B3 numbers are discounted: genReverse-with-replacement leaves ~62% of lines AMBIGUOUS (duplicate values; probe11). Bottleneck fixed it with distinct-values lines, but the TAX was never measured: how much did ambiguity cap the old numbers? Decides whether to re-ledger any B3 claim.

## Design
(a) Eval-only: take filed K4-sig0p5-s{0,1,2} bottleneck models (trained distinct) and eval on AMBIGUOUS batteries (genReverse with-replacement, same N=200, same testRng scheme offset 999). Drop = ambiguity tax on a competent reader.
(b) Train-pair (one seed, s0): train K4-sig0p5 on AMBIGUOUS lines (same recipe, dataRng identical except gen fn) vs filed distinct model; eval both on DISTINCT battery. If ambiguous-train << distinct-train, the cap binds training too.

## Bars
- TAXED: ambiguous-eval <= distinct-eval - 0.08 in 2/3 seeds (ambiguity materially caps).
- UNholen: |diff| <= 0.03 (discount was overcautious).
- Train part descriptive: report delta, no bar.

## Expectation
TAXED (~62% ambiguous lines, stochastic target => ceiling ~0.6-0.7 even for perfect reader; matches filed discount note).

## Cost
3 ambiguous evals (seconds) + 1 train (~2 min) + 1 eval.

## Ledgers
`d-hygiene-ambigeval-K4-s{seed}.json` (3), `d-hygiene-ambigtrain-s0.json` + eval, `d-hygiene-verdict.json`. Driver learn-driver.js. Transcript + CHATLOG. NO PUSH.
