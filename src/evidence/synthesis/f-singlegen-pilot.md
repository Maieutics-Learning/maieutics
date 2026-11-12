# F-singlegen PILOT — sniff verdict (spec: f-singlegen-spec.md)

Status: PILOT DONE 2026-11-12 (3 seeds × 3 arms × 2 gens × 600 steps).
NOT a verdict on O1/O2 (underpowered by design: 600 vs 3000 steps,
2 vs 5 gens). Answers: mechanics ✓, determinism ✓, effect direction
sniff ~, infra lessons ✓.

## Results (killA/killHd, * = ignites)
- s201: G 1.00/0.84* → 1.00/0.98* | S 1.00/0.84* → 1.00/0.82* |
  SOPT == S both gens.
- s202: G 1.00/0.74* → 1.00/1.00* (perfect) | S 1.00/0.74* → 1.00/0.74* |
  SOPT missing (2× infra timeout, see below).
- s203: all three arms 0.34/0.63 gen-1 → rot, stop rule fires correctly.
- Determinism anchor HOLDS ×3: gen-1 bit-identical across G/S/SOPT
  within every seed (same init + same tutor + same stages ⇒ same
  trajectory — the runner is sound).

## Sniff readings (not conclusions)
- G ≥ S on Hd at gen 2 in both igniting seeds (+0.16 s201, +0.26 s202).
  Direction consistent with O1 (freshness helps) but n=2, weak regime —
  recorded, not claimed.
- SOPT == S everywhere both ran → optimizer-state already looks
  irrelevant (O3 leans weight-persistence). One less variable for Phase 3;
  consider dropping SOPT to fund more seeds.
- s203 rots identically in all arms → seed dominates regime, arms don't
  rescue a bad seed at 600 steps. Phase 3 needs the seeds that ignite
  (201/202-like) to test the actual question.

## Infra lessons (priced)
- Page slows over long sessions (2.1 → 6+ min/chain): refresh between
  chains in Phase 3 orchestration (kv persists across refresh ✓).
- Transient src fetch failure ("No src manifest") mid-session: retry
  with backoff; verify t0 fetch before each chain.
- s202/SOPT missing: rerun in Phase 3 batch (with refresh-first rule).
- Raw: scratch/f-singlegen-pilot.json + scratch/f-singlegen-pilot2.json.

## Phase 3 (full power) — queued, multi-session
8 seeds × {G, S} × 5 gens × 3000 steps (~11 h in-page; SOPT dropped
unless O3 reopens). Chunk per (seed, arm-chain) ≤ 8 min/eval,
refresh-first, kv tutor lock, results appended to
scratch/f-singlegen-results.json. Pre-registered O1/O2/O3 stand.
