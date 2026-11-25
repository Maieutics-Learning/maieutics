# Self U33 prereg: canonical repair — version-pinned stack + init checkpoints + re-freeze (PROPOSED; NO COMPUTE until battery + countersign)

Agent approval: this file. CPU/in-worker only. NO GPU. Pool = sealed reviewer labor only (3x generateText implementability reviews, never training signal). R=3 seeds 0/1/2, quorum noted per bar, COMPLETE-gated, twin-matched seed-only streams, paired evals. Corrections append-only. NO PUSH without explicit order.

## User request (verbatim, binding)

"Closing that needs a version-pinned stack plus init checkpoints, or re-freezing a current-code trunk as the new canonical. Explain how this helps a stranger with only your notes and memories build a brain from scratch?" + "Lets create that, but also make sure that they can train a version (not byte perfect) of it themselves that can still pass everything that our current brain can pass."

Reading (this prereg's scope): (1) PIN the stack (hash exact code revision into every new ledger); (2) SAVE init checkpoints (step-0 params, the missing starting gate); (3) RE-FREEZE a current-code trunk as the new canonical (reachable target — U32 proved W6 is an orphan of a pre-rewrite driver); (4) prove a stranger retrain that is NOT byte-perfect still passes the same capability bars (FUNC tolerance for cross-engine float dust). Overrides nothing: W6 stays frozen as history; u32-repro stays as the U32 measurement. The new canonical SUPERSEDES W6 as the rebuild target (filed as succession, not overwrite).

## Record-search (nearest prior / what differs)

- U32 (LOG-INSUFFICIENT): current stack reproduces sweep s3-5 loss0 exactly 3/3 but misses all W1-W6; ledger-path pattern breaks at the sweep (pre-rewrite winner driver unfiled). Missing: stack revision pin + init checkpoint. This wave adds both, then re-freezes.
- u32-repro s0-2 (Turn-147): current-code 800st W6-recipe trunks already exist (lossN 1.574/1.504/1.628; scr 0.585/0.58/0.6; two 0.57/0.56/0.49) but lack stackHash + P0. They are MEASUREMENT, not canonical — the canonical set is retrained fresh by the instrumented driver so stackHash is recorded at train time (clean provenance, no backfill).
- Sweep fragility (SWEEP-FAILS 1/6): fresh-seed robustness is OUT of scope here (already measured). All claims are same-seed, same-stream.

## Design

Stack pin (recorded at train time, verified at every read):
- STACK_FILES (canonical order = WinnerInit load order + self): `src/tinynn/nn.js`, `src/tinynn/seeded.js`, `src/evidence/decomp/intrinsic-driver.js`, `newai-driver.js`, `newai-v102-driver.js`, `newai-fr-driver.js`, `newai-div-driver.js`, `newai-cur-driver.js`, `newai-winner-driver.js`, `newai-selfu33-driver.js`.
- stackHash = SHA-256 over `path + "\n" + bytes` per file, joined. Stored in every new ledger (`stackHash`, `stackFiles`). Any read path recomputes and compares; mismatch = HALT (wrong code revision, not a retrain).

Trainable (from scratch, pinned stack, same W6 recipe/streams as U32):
- Canonical set A: FRESH init, identical W6 recipe (C=6/auxW0.5/800st/lam2.0/B16/lr5e-3/K5/H48, armCode 76 streams), new paths `src/evidence/decomp/d-newai-self-u33-canon-s{seed}-800st.json`. Ledger adds `P0` (init checkpoint, full arrays), `loss0Fingerprint` (fresh step-0 loss + filed comparison at write time), `stackHash`.
- Confirmatory set B (the stranger simulation): SECOND full retrain per seed to `d-newai-self-u33-confirm-s{seed}-800st.json` (same pinned driver, same streams). A stranger with only the notes runs set B; this wave runs it for them and grades it.
- Evals: paired frozen-test evals (same N=200 shift + 200 base-k0 rows/streams as W6 evals) for A (`d-newai-self-u33-eval-canon-s{seed}-800st.json`) and B (`-eval-confirm-`), plus ledger-replay evals (model loaded from ledger P, rows regenerated) proving ledger-sufficiency for eval.

Stage order (all COMPLETE-gated; resume skips COMPLETE):
- Wave 0: instrumented driver + stack audit (hash the 10 files into `d-newai-self-u33-stack.json`; assert WinnerInit load order matches STACK_FILES) + init-gate demo (fresh-init vs P0-shape check, no trains).
- Wave 1: 3 canonical trains (set A).
- Wave 2: 6 evals (A + B-trains first: 3 confirmatory trains, then 6 evals) + bit-compare A vs B + verdict. No Stage B. No fresh seeds.

## Limitations (pre-registered)

- L1 same-seed only: proves PINNED-STACK sufficiency, not robustness (sweep stands).
- L2 cross-machine dust untested here (single engine): Math.exp/tanh last-bit variance across JS engines could break BIT for a real stranger; FUNC tolerance (±0.02) is PRICED for it but validated only same-machine (expect exact). Cross-engine validation is owed follow-up, never assumed.
- L3 ledger size doubles (P0 + P in one file, ~1MB total — under limits; canonical set is 3 files, not the full family).
- L4 succession, not overwrite: W6/u32 files untouched; the manual's canonical pointer moves to u33 (amendment row, versioned).

## Paper predictions vs bench predictions

- Pinned-stack re-execution (imported determinism expectation): same code + same streams -> bit-identical (sweep-era evidence: loss0 exact 3/3). WHY owed if: A vs B BIT holds (pin works, canonical adopted) / BIT fails but FUNC holds (cross-run nondeterminism inside one engine — stack bug, high value) / both fail (recipe still underdetermined — pin insufficient, deeper drift).
- Capability floor (own): current-code recipe band from u32-repro + sweep 6-seed (two 0.49-0.63). WHY owed if canonical falls below floor (recipe degraded under pin — file, don't tune).

## Bars

- U33-PIN: stackHash in all 6 train ledgers + recompute match 3/3; P0 present + fresh-init == P0 exact 3/3.
- U33-BIT (reproducibility): maxAbsDiff(confirm-B, canon-A) == 0.0, 3/3, exact.
- U33-FUNC (the user's "not byte perfect but passes everything"): confirm evals vs canonical evals |Δscr| ≤ 0.02 AND |Δtwo| ≤ 0.02, 6/6 numbers (bit-exact expected same-machine; tolerance prices cross-engine dust for the stranger).
- U33-FLOOR (capability the current brain passes): canonical scr ≥ 0.50 AND two ≥ 0.45, 3/3 (recipe's honest band; W6's luckier 0.63/0.55-0.63 cited, not required).
- U33-FROZEN: zero writes outside u33 paths (W6/U31/u32 drift 0; frozen SHA spot-check).
- U33-FRESH: battery 3x IMPLEMENTABLE or adjudicated v1.1.
- Verdicts: CANONICAL-EXACT (all bars) / CANONICAL-FUNCTIONAL (BIT miss + FUNC hit — cross-run class, follow-up owed) / PIN-FAIL / FLOOR-FAIL (canonical rejected, no succession).

## v1.1 pins (battery 3x IMPLEMENTABLE unanimous -> adjudicated same session; NO COMPUTE until countersigned)

- P1a (terminology, non-binding): `two` = accTwo = round-2 compose accuracy on the N=200 shift eval rows (x2m with vhat), exactly as filed in W6 eval ledgers; `scr` = accScratch (hv round). No bar, threshold, or row-set change.

## v1.2 amendment (user-countersigned "everything"; same-recipe arm, no new battery)

User order: deliver BOTH a bit-exact version (follow exactly) and a not-byte-perfect version. Mapping: set B (same seeds/streams) IS the bit-exact version; new set C (fresh seeds 3,4,5, same pinned recipe/stack) IS the not-byte-perfect version — a stranger training their own brain from the same notes, different lottery.

- Set C: fresh trains `d-newai-self-u33-fresh-s{3,4,5}-800st.json` + paired evals (`-eval-fresh-`), same pinned driver/streams formula. Bonus cross-check: set C loss0 must reproduce the filed sweep loss0 exactly (second positive control — same code, same seeds as the sweep).
- U33-FRESH-SEED bar: canonical FLOOR applied to set C (scr ≥ 0.50 AND two ≥ 0.45 per seed, reported x/3) + sweep-loss0 match x/3 + full numbers filed vs canonical for the record. A floor miss is filed as a recipe-band finding (expected direction per SWEEP-FAILS), not a canonical rejection — the verdict stays driven by A/B.
- No new battery: fresh seeds under an identical pinned recipe are not a new mechanism (Turn-36 sweep precedent: same-recipe fresh-seed arm ran battery-free). v1.1 battery stands; this amendment is user-countersigned.
- Staging update: Wave 1 = 3 canon + 3 confirm + 3 fresh trains (~2 min); Wave 2 = 9 evals + verdict.

## Staging + budgets

- Battery on THIS file first (3x sealed) -> v1.1 pins-only. Then driver (stack hash + P0 + loss0 gate + confirm loop) + Wave 0 stack ledger + Wave 1 3T + Wave 2 3T-confirm + 6E + verdict + manual canonical-pointer amendment + transcript + CHATLOG + CURRENT_TASK. NO PUSH without explicit order.
- Compute: CPU/in-worker only. 6x800st small-MLP trains + 6 evals (~2 min, U32-measured ~9s/train). NO COMPUTE until battery adjudicated + fresh countersign for Waves 0-2 (this request covers prereg + battery + driver build only).
