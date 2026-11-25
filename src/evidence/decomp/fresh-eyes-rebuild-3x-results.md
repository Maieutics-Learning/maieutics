# Fresh-eyes battery: src/REBUILD_FROM_SCRATCH.md v1.0 (3x sealed, parallel)

Method: manual text read from workspace + 3 parallel reviewer calls (pool labor only; never training signal). Each reviewer saw ONLY the manual + <=200-word return shape (VERDICT / patches / HEALTH / cheapest test).

## Verbatim

R1: NEEDS-PATCH ("what/where" without "how"). (1) Missing driver entry-point: no CLI signature/env to trigger waves/seeds. (2) Implicit dependency: is `newai-winner-driver.js` in-repo or generated? (3) "Countersign" undefined (file? commit? signed JSON?). (4) Stage-4 verification vague. HEALTH: executability FAIL, numbers PASS, controls FAIL (COMPLETE-gated undefined), plausibility PASS. Cheapest: run `src/tools/rebuild.js` via `execute_js` — if it fails, prerequisites invalid.

R2: NEEDS-PATCH (assumes `src/` logic; contradicts "from scratch"). (1) Provide `T.trainModel`/`G.Adam` implementation. (2) Parameterize `C=6 pick-max`/`auxW0.5` technically. (3) `G.makeRng` implementation missing. (4) `REPRODUCIBILITY.md`/`novel-driver.js` not listed as stranger inputs. HEALTH: executability FAIL, numbers PASS, controls PASS, plausibility PASS. Cheapest: run `src/tools/rebuild.js` — missing `src/` files = non-functional.

R3: NEEDS-PATCH. (1) Provide `src/tools/rebuild.js` source. (2) List canonical set (names + checksums). (3) Define quorum-2/3 divergence handling. (4) Exact `d-newai-self-<wave>-verdict.json` schema. HEALTH: executability FAIL, numbers PASS, controls PASS, plausibility PASS. Cheapest: run `src/tools/rebuild.js` against `src/evidence/decomp/` and compare to frozen ledger.

## Adjudication (3x NEEDS-PATCH -> v1.1 pins-only, no design change)

- ACCEPT P1a (R1-2/R2-premise/R3-1 converging — top risk is premise ambiguity): state UP FRONT the stranger HAS the repo (`src/` ships; "from scratch" = from cold logs, not without source). Drivers ship in `src/evidence/decomp/` — nothing is generated. One premise box in §1.
- ACCEPT P1b (R1-1): driver run recipe — exact entry pattern (drivers expose `globalThis.<runFn>(fs, log, opts)`; e.g. `runWinnerTrain(fs, log, {arm:"w6", seed})`; COMPLETE-gated skip on `verdict:COMPLETE` ledger read; per-driver opts in its header; worked example = winner-driver header + U32 prereg). Pin in §5.
- ACCEPT P1c (R1-3 + R1-controls): definitions — countersign = the human operator's explicit go-ahead, recorded in transcript + working record (here: the user's "countersigned" reply); COMPLETE-gated = ledger carries `verdict:"COMPLETE"` and re-runs skip it (scripts filter `done`). Glossary lines in §5/§11.
- ACCEPT P1d (R3-2): canonical freeze set listed EXPLICITLY in §4 (exact W6 trunk/eval/verdict paths + expected numbers + SHA-256 ledger pattern).
- ACCEPT P1e (R2-2): one-line technical definitions — C = candidate draws per batch step, pick-max = train the max vote-disagree candidate (ties → lowest index); auxW = auxiliary-loss weight; pointers to wCfg/driver lines + `train.js`. Pin in §7.
- ACCEPT P1f (R3-3/R3-4): quorum-divergence rule (2/3 hold = PASS, 1/3 = FAIL; near-miss files distance-to-gate, no bar moves) + verdict required-keys line (`bars/deviations/mechanism/quorum` + per-arm arrays). Pin in §8/§11.
- ACCEPT-as-DONE (R1/R2/R3 cheapest, converging): `src/tools/rebuild.js` EXISTS and RAN this session — REBUILD-READY, 30/30 gates pass, 4405 src files, 2397 ledgers (Observed, this session). Fix §10 run recipe to the TESTED pattern and file the result.
- REJECT with reason (R2-1/R2-3/R2-4): "provide trainModel/Adam/makeRng source" misreads the premise (P1a) — all ship in `src/tinynn/` (load order §6); the manual's job is the map, not a code dump. Added pointers instead of code.
- Round score: 7 pins (6 doc + 1 done) + 1 rejection-with-reason. HEALTH after pins: executability gap closed by P1a/P1b/P1d/tested-recipe, numbers stood, controls closed by P1c/P1f.

Proceed to v1.1 (pins below in manual). NO COMPUTE beyond the audit (which ran); rebuild Waves still need per-wave countersigns.
