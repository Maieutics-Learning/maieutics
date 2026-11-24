# Fresh-eyes cause-v10 battery (3 sealed, 2026-11-24)

Raw: `scratch/fresh-eyes-cause-v10-3x.txt`. Spec: `src/evidence/decomp/cause-v10-prereg.md`.

## Raw R1 (math) — PASS
Hardest hole subspace-vs-stream ambiguity (mask-s vs stream-t; E1 mask-swap mitigates). Fix: log t=(s+1)%3 + (y+1)%4 in metadata (prevents silent mapping errors).

## Raw R2 (implementation) — IMPLEMENTABLE
Gaps: streams-vs-masks ambiguity (E1 reserved). Test: single-model single-seed 3-probe smoke (P1/P2/P3, 3 forwards; P3 should collapse ~0.25 if task-bound).

## Raw R3 (rival) — UNVERIFIED
Rival CSI/seed-leakage. Killer P1. Contains seed-vs-general + positional-vs-addressable + task-bound. E1/E2/E3 isolate mask vs stream. Verdict pending 27-eval battery.

## Adjudication (agent owns verdict, 2026-11-24)

- R1 PASS, fix ADOPTED: every cause ledger logs {weightsSeed s, streamsSeed t, maskSeed s, perm: none/reverse-flat/label+1} (no silent mapping).
- R2 IMPLEMENTABLE, smoke ADOPTED: single-model (fr-force s0) 3-probe smoke in driver log before full 27.
- R3 UNVERIFIED-pending: run the battery (that's the verification).

Amendment v10.1: metadata + smoke pinned. Zero trains. Score: 1 PASS + 1 IMPLEMENTABLE + 1 UNVERIFIED-pending.
