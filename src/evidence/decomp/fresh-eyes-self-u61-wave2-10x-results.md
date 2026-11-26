# Fresh-eyes U61-EXT4 Wave-2 10x battery (verdict at 50/50)

**Artifact:** `d-newai-self-u61-verdict.json` = FLOOR-FAIL (filed floor-first gating).
Numbers: PIN 20/20, CTX 16/20, NOERASE 20/20, ISOLATE 11/20, FLOOR 0/20, MISFIRE 0/20.
Per-arm >=0.45: noveto 5/20, global 0/20 (by construction), vetoSUP/vetoTASK/unfrozen 20/20.
vetoSUP vetoA 0.0024–0.0025; replication 0.0373 vs 0.059 (diff 0.0217, marginally outside
filed 0.02 — reported, ungated: floor fired first per filed order).

## R1 — 10x NEW contextless independent
- R1–R10: CONFIRM-FLOOR-FAIL (10/10). Raws: scratch/u61w2-r1.json.

## Discussion — 10x strict short
- D1–D10: CONFIRM (10/10). Raws: scratch/u61w2-d.json.

**Arbitration (owner final):** Verdict CORRECT per filed gating (floor 0/20 < 15 fires
before all else). See closeout `self-u61-closeout.md` for the anatomy: candidate mechanism
holds at quorum (CTX 16/20 + cleanest vetoA yet); the floor is killed by a by-construction
failure (global) plus a still-eroding baseline (noveto 5/20) — D3 scope flaw now binding.
