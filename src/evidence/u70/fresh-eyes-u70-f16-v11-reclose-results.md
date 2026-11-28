# Fresh-eyes U70-F16 v1.1 re-close results (4: 2 STANDS / 2 NEEDS-PATCH)

## Score

STANDS: re1 ordering, re3 firewall. NEEDS-PATCH: re2 symext, re4 implementability.

## Adjudication

- re1/re3: STANDS noted. No patch (G1 ordering + firewall + T10 exhaustiveness confirmed).
- re2 symmetric extension (zero-pad H64→H128): REJECT with derivation. Zero-padding is itself a strong init bias (dead subspace, asymmetric dynamics) and a second variable; it replaces disclosed variance with hidden bias. Filed procedure-identity (same bases 90000+s, same sqrt(1/fan) formula, fresh draws, NOT bit-identical disclosed) is the standard capacity control. Repeat of v1.0 r7/r9 already ruled. No patch.
- re4.1 procedure-identity enforceability: PARTIAL — valid hardening, no design change. v1.2 micro-gloss G4: wave log carries per-matrix RNG draw-index + fan + scale + first-draw; checkable assertions are (a) fields present per arm/seed, (b) A2/B weight hashes MUST differ from A0 (equality = bug), (c) code grep shows single RNG-stream construction. Bit-identity stays waived by design.
- re4.2 unfamiliar oracle verification: ACCEPT as explicitness gloss (no new compute): unfamiliar oracle uses the SAME oracle script with unfamiliar P params (T=300, dwell 12, psw 0.05, prho 0.06, pay 0.8), filed as `d-u70-oracle-f16-unfam.json` with identical report fields to the held oracle; verification = same T5-disjointness + retention checks on unfamiliar seeds.
- re4.3 ablation proof gap: ACCEPT as T10e hardening (no design change): T10e = (i) weight-hash identical pre/post extras AND (ii) code grep proves ablation branches contain no optimizer step and no M.params write (runtime masks only) AND (iii) hidden state resets to zeros at each eval start with no carry across evals.

## Patch list (v1.2 micro-patch, glosses + checkable assertions only)

G4 procedure-identity logging + hash-inequality expectation; unfamiliar-oracle explicitness; T10e two-half proof (hash + grep + hidden-reset). No arms/bars/steps/compute change. Proceed to confirm 2/2 on v1.2.
