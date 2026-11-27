# U64h-SENSOR closeout (2026-11-27) — verdict ORACLE-ONLY, line continues

Track: U64h (F4 follow-up, reviewer step 3 + standing sensor-validity rule).
Prereg: `self-u64h-sensor-prereg.md` v1.3 STANDS (battery CLOSED 2026-11-27,
9 adoptions). Cover: owner "countersigned" = COMPUTE LICENSED for v1.3 EXACT
(Wave 0 → Wave 1, 80 reads-only re-evals on filed det trunks). NO PUSH.

## Run record
- Driver: `newai-selfu64h-driver.js` (E1..E7 as filed in header; senPick signal =
  exploit r.s pre-pick; D-graded windows w=1,2; H-shapes sensor-pooled; gen 2).
- W0 COMPLETE: generation assert 2 ≤ 6; LINE-HALT impossible on gen 2 (filed);
  PIN 3/3 det trunks literal-match + replay exact; trigger units elev [11,31] /
  collapse [11,31] / flat-line zero all three (filed); determinism twins exact
  (4 arms s0 incl monitor state); crash-tests in range (senMax s1 0.88 nT=0,
  senPick s1 0.88 nT=0, senMargin s1 0.9467 nT=3, orTrig s1 0.98 nT=3);
  burn-in margin min(b0−8)=154 (logged); examHash `49ec85cd50e06d7b…`
  (COMPUTE-then-FILE); dry-run ~101ms/exam. W0 file
  `d-newai-self-u64h-wave0.json`.
- W1 COMPLETE 80/80: PIN 80/80 literal; EXAMHASH 80/80 match (driver frozen
  between W0 and W1 — zero edits); RULE-IDENTITY 20/20 (replay-exact +
  cross-arm). Floor 20/20 (sensitivity 0.35/0.40/0.45 all 0 — unanimous).
- Verdict file `d-newai-self-u64h-verdict.json`, `verdict` field reads
  **ORACLE-ONLY** (machine-readable enforcement, filed).

## Bars (quorum 15/20; TWO-GATE order PIN → HALT → floor → Gate 1 → Gate 2)
- Gate 1 SENSOR-VALID: senMax 0/20 (meanFA 0), senPick 0/20 (meanFA 0),
  senMargin 8/20 (meanFA 0.65). None valid — Gate 2 sensor loop uninterpretable.
- Gate 2 LOOP-S: senMax 1/20, senPick 4/20, senMargin 10/20 (all DEAD).
  LOOP-O (orTrig): **17/20 MET** — response works when told.
- H-pool (60 sensor ledgers): meanTrig 0.45, meanHits 0.23 (per-arm: max 0/0,
  pick 0/0, margin 1.35/0.70). Shapes not reached (LOOP-O met → ORACLE-ONLY,
  not SENSOR-DEAD, per filed ordering).
- Deviation (recorded, verdict unaffected): the verdict file's `shape` field
  reads "F4-see-closeout" — driver shorthand, NOT prereg vocabulary (v1.3
  defines no shape suffix for ORACLE-ONLY). It maps to the U64e-F4 meaning
  (monitor-blind: pooled detectRate ≤ 1/3 < 0.5 by construction — two arms at
  exactly 0). The filed machine-readable outcome is the `verdict` label.

## Diagnostics (never bars)
- D-graded (w=1,2 only, 40 switches/arm): filed 7/33 split CONFIRMED per arm
  (pooled 21/99 = 3× filed). senMargin only: full winHitRate 0.43, latency 12;
  partial 0.27, latency 19.2 — direction as filed (full earlier/more), thin
  (3 + 17 triggers). Elevation arms: zero triggers in either class.
- D-K6 (rival: margin rule inverted): NOT vindicated. senMargin precision
  14/27 = 0.52 vs 0.42 chance, boundaryFrac 0.52 (mild boundary concentration,
  same direction as a working sensor — not boundary-avoidance); elevation
  sensors silent (0 triggers in 3000 slots each — absent signal, not inverted
  signal). Failure is threshold-scale/signal-absent, not inversion.
- D-rec1: rec1 ≈ dice for all arms (nothing stale in window 1, as predicted).
  orTrig rec2/rec3 margins +0.163/+0.175 (live resets buy late-window accuracy,
  as U64e); senMargin +0.078/+0.039 weak late gain; elevation arms ~0/negative.

## Reading
Three fixed burst sensors, one verdict: the mechanism works when told (LOOP-O
17/20, third independent replication of the U64e response continuity), and no
candidate sensor is valid. Elevation-of-max and choice-surprise never fire once
(0/3000 slots each — the doubling rule with min-guard on trailing-4 is too
strict for the actual post-switch evidence, or the evidence isn't in r.s);
margin-collapse fires 27× at near-chance precision and buys accuracy on only
half the seeds (10/20 loop). Upstream of the mechanism is still dark.

## Follow-ups named (diagnose-and-improve; each needs own prereg + battery + countersign)
- F1 (H2 direction): new signal family for elevation — max/pick r.s carry no
  detectable post-switch burst at any doubling threshold; look where the 1–2
  slot evidence actually lives (not another threshold on the same flat signals).
- F2 (H3-adjacent): revised PRINCIPLED margin constant (post-data sweeps
  forbidden — the constant must be derived, not fit, in a new prereg).
- F3: placement variant ONLY if a future sensor validates (SENSOR-ONLY path —
  not reached; filed but unlicensed).
- Unchanged backlog: U65–U69 UNLICENSED (U65-gate question still owner-decides);
  emergence-doc battery still owed; veto gradient cosine-sim logging queued.
