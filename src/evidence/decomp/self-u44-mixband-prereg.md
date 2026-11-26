# U44-MIXBAND prereg v1.0 — mixed-proportion LP-bandit (M1 confound resolution)

Q (from M1 INCONCLUSIVE, Turn-184): L's collapse (two 0.305/0.355/0.4, oracle collapsing
WITH two 0.29/0.46/0.45) admits two readings: (a) B8's inverted direction is wrong —
low-disagree rows are genuinely low-value; (b) pure low-disagree diets damage the circuit
(single-sided diet pathology) while the direction is real. M1 cannot separate them.
U44 separates them with MIXTURES (never pure arms except the U control).

## Design
- Diet: U36-D1 candidates (u43DietSingle: per-c roll base/OOD/uniform, C=6 singles per
  slot, disagreements forwarded with current M) — identical to M1, all arms.
- Arms (9T+9E, H48, 800st, B16, lr5e-3, K5, C6, auxW0.5, lam2.0, pinned stack
  258d2f06, twin-matched seed-only streams):
  - LOW-MIX: pick-min disagree w.p. 0.75, else uniform among the C=6.
  - HIGH-MIX: pick-max disagree w.p. 0.75, else uniform among the C=6.
  - U: uniform control (M1-U verbatim recipe).
- Alignment pin (construction, no bar change): per slot draw r=dataRng.int(4) ALWAYS
  (all arms, consumed identically); r<3 → directed pick (min for LOW-MIX, max for
  HIGH-MIX), r==3 → uniform index dataRng.int(C) (drawn always too, used only when
  needed... note: uniform index drawn always for alignment, selection uses it only on
  r==3 or U arm). Losses = u43StaticSlot verbatim (no oracle aux, static scorer).
- Evals: u34 paired-eval body verbatim (N=200 shift scr/two/orc + 200 base-k0 fwd,
  corrected orc line). Floor guard (E5-style): max arm two < 0.45 on ≥2 seeds →
  INCONCLUSIVE (instrument cannot discriminate), never ADVANCE-off-floor. PIN fail → HALT.

## Bars (quorum 2/3, R=3)
- U44-DIRECTION: LOW-MIX ≥ U + 0.03 at quorum → ADVANCE (direction real; M1's collapse
  was pure-diet damage; licenses the LP program on mixtures — next step tests dose).
- U44-INVERTED: HIGH-MIX ≥ LOW-MIX at quorum AND NOT direction-win → DEAD-INVERTED
  (high-disagree genuinely better; B8 direction wrong; file INVERTED-INVERTED).
- U44-FAMILY: all three arms within 0.03 pairwise at quorum → DEAD (bandit family dead
  at any mixture; stop spending on LP selection).
- Mixed outcomes (e.g. LOW-MIX ≥ U on 1/3) → DEAD (no quorum = no license).

## Verdicts
d-newai-self-u44-verdict.json = ADVANCE / DEAD (with INVERTED-vs-FAMILY reading filed)
/ INCONCLUSIVE / PIN-FAIL, with exact gate numbers cited.
