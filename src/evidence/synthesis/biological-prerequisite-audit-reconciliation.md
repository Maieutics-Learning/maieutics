# Reconciliation: external Biological Prerequisite Audit vs primary ledgers (2026-11-27)

Source: `src/evidence/synthesis/biological-prerequisite-audit.docx` (41,585 B, 18 zip
entries, 61 paragraphs; text extracted 2026-11-27 via hand-rolled central-directory
reader + DecompressionStream after esm.sh import failed — no dependency, method filed).
Memo scope: U55–U59 (uncertainty/veto generation). It is an instruction memo, not a
claim of reproduction — and it explicitly demands reconciliation before use as a
definitive audit. This file is that reconciliation.

## ID / status / seed-count check (all against primary ledgers)
- U55 UNCERTAINTY: EXECUTED, verdict DET-COLLAPSED (cause: nondegeneracy;
  NONDEGEN/DISSOCIATE/INDEPEND 0/3, POWER 3/3), 3 trunks (DET-PIN 3/3), 240 probes
  (3x4x20, N=400 rows). Drivers confirm the memo's mechanism description: D-cue =
  per-slot EMA error gap (dcue 2-vs-2), D-switch = trailing-50-minus-200 spikes at
  jittered quarter boundaries. Memo's "error statistics + quarter-boundary" gloss: ACCURATE.
- U58 CONTEXT-DETECT: EXECUTED, verdict UNDERPOWERED (v1.2 cause: precision, POWER
  0/3 on 3 trunks; v1.5 20 trunks x 80 streams incl. 17 new canon: gap_ROT 14/20 but
  cross 2/20, spike_ROT 0/20 — still UNDERPOWERED). Trunks = frozen U33 canon
  byte-exact (PIN 258d2f06). Memo's "static pick-max task" shorthand: FAIR.
- U57 VETO: EXECUTED, verdict FLOOR-FAIL (cause: floor; EXT-CTX 8/20, NOERASE 0/20,
  FLOOR 0/20, MISFIRE 20/20), 20 seeds. Driver: split-bias VETO3 under B-heavy
  Phase-2, task-tied veto objective (sigmoid-residual checkpoint path). Memo's
  "task-residual-driven" gloss: FAIR.
- U59 SUPERVISED VETO: EXECUTED, verdict FLOOR-FAIL (cause: floor; SUP-CTX 15/20
  relative, NOERASE 20/20, FLOOR 0/20 absolute, MISFIRE 0/20, LOWCOMP-FLAG 0/20 =
  all ckpt >= 0.28), 20 seeds, replication vetoA 0.0589 vs U57 0.059 (match).
  Driver: vetoSUP joint objective (task + LAM_SUP*BCE, LAM_SUP=1.0). Wall numbers:
  U57 vetoA 0.051–0.068 vs U59 0.0059–0.0064 — order-of-magnitude control gain.
  Memo's "independent supervisory objective improves control; B-heavy leaves
  A-competence inadequate": ACCURATE (relative 15/20 vs absolute 0/20 IS the
  dissociation it claims).
- Memo cites almost no exact numbers; every checkable number it implies is
  consistent with RESULTS_INDEX rows 97–101 + verdict bars. No ID errors, no
  phantom experiments, no status errors.

## Two corrections to the memo
1. Caveat (B) on U58 is already closed — in favor of (A). Memo §2 leaves open that
   trunk count may explain the null. Our v1.5 (20 trunks x 80 streams, 6400 probes)
   still fails: the memo's own decision rule then says architectural omission.
   Adopt the memo, upgrade its conclusion: context representation is missing, not
   merely under-resolved.
2. "Vanishing learning signal" (U57) is inference, not measurement. Compatible with
   FLOOR-FAIL + MISFIRE 20/20, but no ledger isolates a diminishing gradient. Keep
   as hypothesis (it is testable: log veto-gradient norms vs residual over Phase-2).

## Gaps in OUR practice the memo correctly names (adopt for U64h/U65+)
- Three-tier claim labels (computational demonstration / mechanistic analogy /
  biological evidence). Our CONFIRMED means the first; we never claim the third,
  but we don't tag consistently. Adopt the tags.
- Predefined minimum competence thresholds that GATE interpretation. We have
  LOWCOMP-FLAG (0.28, diagnostic-only) + absolute floor bars (which do gate).
  Adopt: competence gate explicit in every future prereg's firewall section.
- The rest of §7 we already do (operational definitions in drivers, prereg +
  battery + countersign, quorum bars, raw numbers, seeds as units, negatives in
  the index — including this file).

## Note on our later results (postdates the memo's evidence base)
U60–U64e already embody most of §6 (no-gate baselines throughout: dice/det arms;
dissociation designs; quorum competence floors; F-tree failure diagnosis). Most
pointedly, U64e-F4 (RESET +0.092 16/20 with a monitor that fired 0 times in 3000
slots) is a live demonstration of the memo's central thesis: a working mechanism
with no valid sensor. U64h (monitor redesign) is the memo's step 3, already queued
as the F4 follow-up — UNLICENSED, needs its own prereg + battery + countersign.
