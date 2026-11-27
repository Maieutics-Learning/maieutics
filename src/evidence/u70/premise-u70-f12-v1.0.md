# Premise U70-F12 v1.0 (pinned for battery, 2026-11-27)

Pinned: `src/evidence/u70/u70-f12-prereg-proposal.md` v1.0 (valid-ECE + retention, F11-exact
base, Phase A oracle recompute + neural 20-retrain, E1–E4 gates, descriptive-only verdicts
F12-VERIFIED/BROKEN, firewall against retroactive calibration claims).

Ground facts (verify against tree, do not take on faith):
- Neural ECE: `u70-neural.js:596-598` — `ece += n*|k/n − 0.95|`, `/U70N_T`. Fixed reference.
- Oracle ECE: `u70-oracle.js:114-115` — `|k/n − 1 + 0.05|` (same 0.95), `/eceN`. Fixed reference.
- Rows log only aggregate `ece`; `pTrueTrace` in-memory only (neural :553/564-565, oracle
  :87). Filed ledgers cannot recompute valid ECE. Neural weights are not saved (retrain owed
  for neural valid ECE; oracle exact filter recomputes reads-only).
- Filed values stand as measured-as-run: oracle pooled 0.0614; neural per-seed `ece` fields.
  Meanings re-labeled by F12 (fixed-reference deviation, never calibration).
- Standing rules: NO compute without fresh countersign on the exact version; battery reviews
  the DOCUMENT only; verdicts locked; firewall (no retroactive moves, no new bar in F12).

Battery question: does v1.0 correctly and completely specify the valid-ECE repair with no
second variables, no verdict smuggling, and executable gates? Return verdict + falsifier.
