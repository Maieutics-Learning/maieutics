# Message lesion v10 (E3, countersigned, eval-only)

Agent approval: this file. User countersign: 2026-11-23.

## Why
COMPRESSES shows 4 noisy dims suffice but not HOW: one master dim + 3 decoration vs distributed code. Zero-one-dim-at-a-time on FROZEN K4/sigma0.5/s0 models answers without new trains.

## Design
For each of 3 filed K4-sig0p5-s{0,1,2} models: eval intact (already filed) + 4 single-dim-zeroed evals (msg[k]=0, no noise resample — reuse filed msgs with mask) on same 200-line battery (testRng 24000+seed). N=200, chance 0.25.

## Bars
- DISTRIBUTED: every single-dim lesion drops >= 0.05 below intact in 2/3 seeds (all dims load-bearing).
- MASTER-DIM: one dim drops >= 0.15 while others drop <= 0.03 (single channel carries it).
- REDUNDANT: no lesion drops >= 0.05 (code survives any one loss).
Quorum 2/3 seeds.

## Expectation
DISTRIBUTED (4-dim bottleneck with noise should spread; master-dim would have shown higher K1).

## Cost
Eval-only (12 lesion evals, seconds). No trains.

## Ledgers
`d-msglesion-K4-s{seed}-drop{k}.json` (12), `d-msglesion-verdict.json`. Driver learn-driver.js runMsgLesion. Transcript + CHATLOG. NO PUSH.
