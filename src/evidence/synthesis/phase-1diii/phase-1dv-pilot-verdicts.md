# Phase 1.d.v energy-score pilot — s313 (RUN 2026-11-14, 1 retrain)

Rationale (selection-pressure: cheap pilot before expensive): v asks whether
energy (−logsumexp, same logits read as total activation) separates
killHd-errors from correct better than top-1. Full v needs 8 retrains +
logit dumps (~40 min); pilot on s313 first — most errors (60/200), highest
error-conf (0.84), the case where top-1 is weakest. If energy loses here,
CUT without the full spend.

Method: retrained s313 instdrop via the exact 1.b recipe (T0 blob
scratch/p1a-t0-313.json intact, seed 31333, same engine), dumped filed
killHd (7008, 200 lines) with full logits. Replication of the pilot model
not gated (pilot only); accuracy reproduced the filed signature
(0.70 killHd, 60 errors — matches iii ledger).

## Result: energy WINS on the hardest case — full v WARRANTED

- Loudness (1 − top1): Δ = 0.0612, AUC = 0.737.
- Energy: mean −5.6597 correct vs −3.3645 err (Δ = 2.2952), AUC = 0.8306.
- n = 200, nErr = 60.

Top-1 nearly collapses on s313 (errors at 0.84 confidence); energy still
separates (AUC 0.83 vs 0.74). The free weirdness-meter is not free noise —
at least where loudness fails, total activation carries signal. Pilot bar
met: run the full 8-subject energy re-dump, then compare pooled AUCs
(energy vs loudness) before buying any expensive meter.

Cost: 1 retrain + 200 dumps in-worker. Pool spend: 0.
Next: full v (8 subjects, same recipe, logits filed).
