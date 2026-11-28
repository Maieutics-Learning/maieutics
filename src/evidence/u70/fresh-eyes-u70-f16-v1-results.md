# Fresh-eyes U70-F16 v1.0 results (barrage 10: 6 STANDS / 4 NEEDS-PATCH)

## Score

STANDS: r1 isolation, r2 interaction, r3 evalbound, r6 calibtrace, r8 bars, r10 ledger.
NEEDS-PATCH: r4 unfamiliar, r5 ablation, r7 steps, r9 confound.

## Adjudication (owner of verdict: me, all logged)

- r1 T10b step-count variance: REJECT as new (already T10b HALT: 200/1200 every seed/arm, BROKEN on mismatch). No patch.
- r2 blind audit before interaction table: ACCEPT as implementation gloss (wave script assigns per-arm verdicts from absolute bars BEFORE generating the combined-vs-separates table; order logged). v1.1 patch: ordering sentence. No bar/design change.
- r3 T10b rigidity: REJECT as new (already T10b). No patch.
- r4a unfamiliar math (seed-shift vs process-shift): PARTIAL — artifact already pre-registers generator params (T=300, dwell 12, psw 0.05, prho 0.06, pay 0.8, rhoVals unchanged; seeds 2000+s are disjointness only, not the unfamiliarity). ACCEPT as clarifying gloss in v1.1 (one paragraph). No design change.
- r4b oracle n=20 insignificant: REJECT with derivation (all waves n=20 by owner "keep it simple" precedent F5; unfamiliar ceiling is descriptive companion with its own oracle, never mixed with held). No patch.
- r4c missing 2x2 factorial: REJECT as reviewer error (A0 neither + A1 zrec + A2 H128 + B both IS the 2x2). No patch.
- r5a locus tau threshold: REJECT with derivation (ablations are descriptive by firewall design; a tau would be a new bar = tuning-to-reviewers per F14-r4). Locus stays qualitative/descriptive. No patch.
- r5b cross-arm leak (B vs A2 generalizes): REJECT as flaw (that comparison IS the filed interaction logic on separates, not a leak). No patch.
- r7a training-time ablation of interaction: REJECT with derivation (A1/A2 separates ARE the additive baseline; factorial needs no extra arm; extra arm = scope). No patch.
- r7b/r9 bit-identical A0-submatrix in H128: REJECT as unsatisfiable/confound (scale sqrt(1/fan) differs by construction; forcing bit-identity breaks scale and IS a second variable). PARTIAL: ACCEPT procedure-identity logging gloss (log fan/scale/first-draw per arm; explicitly NOT bit-identical, disclosed). v1.1 patch.
- r6/r8/r10 falsifiers (T10b/c drift, T10e read-only leak, compute overhead): REJECT as new (already T10b/c/e HALT). r10 UNFAM-label note already satisfied (UNFAM- prefix + separate ceiling). No patch.

## Patch list (v1.1, glosses only, no bar/design/compute change)

1. Verdict-before-interaction ordering (r2).
2. Unfamiliar-math gloss: seeds = disjointness; unfamiliarity = generator params (r4a).
3. Procedure-identity init logging: fan/scale/first-draw per arm, NOT bit-identical (r7b/r9).

Adoptions: 3 gloss groups from 10 reviewers. Rejections: 8 with derivation (3 already-enforced, 2 reviewer-error, 2 scope/tuning, 1 intended-logic).
