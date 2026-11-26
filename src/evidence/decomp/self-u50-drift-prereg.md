# U50-DRIFT prereg v1.0 — blur's home turf (non-stationary diet)

Q (from the exploration-vs-exploitation debate + U46/U47/U49): STOCH dice beats
DET 2/3 stationary (U46 ADVANCE-PROT); blur (fixed U47, smart-gated U49) never
reaches quorum but owns the two best single-seed scores (U47 s2 BOTH 0.555,
U49 s2 GATE 0.5 — both on the collapsed DET seed 0.355). Untested claim from
the debate: blur "keeps the door open when the numbers CHANGE over time."
Our diets so far are stationary — the best candy is always the best candy.
This wave rotates the menu and asks blur to prove it where it should win.

## Pushback (owner, filed before design)
- P1 Fair home game for blur: the U46 trio VERBATIM (DET pick-max / STOCH
  T=0.5 dice / RES sigma-0.3 smudge + pick-max) — the exact blur dose that
  lost stationary — on a rotating diet. If blur can't win HERE, its last
  refuge (non-stationarity) is closed at these doses; if it wins, it is
  conditionally vindicated and dice loses its universal crown.
- P2 Rotation design (no new machinery): quarters of 200 steps; hot familiar
  sets {0,1} -> {2,3} -> {4,5} -> {6,7} (assumes qk domain covers 0-7; filed).
  Per slot: 75% familiar (rejection-sample qk in current hot set, <=10 tries,
  fallback last), 12.5% OOD (qk!=v), 12.5% uniform — shared identically by
  all arms (generation draws aligned; only PICKS differ, as before).
  Familiarity (qkCount n) goes stale at every boundary by construction.
- P3 ADAPT-RATE diagnostic (reported, no bar): fraction of picks from the
  CURRENT hot set per quarter. Reads the mechanism: blur should keep
  adapt-rate high right after rotations (door open); dice/DET may lag.
  A blur win WITH high post-rotation adapt-rate = mechanism confirmed;
  a blur win without it = luck, filed as such.
- P4 Stationary evals kept (u34 paired body verbatim): we measure what the
  brain HAS at the end (memory combine), not how it felt mid-drift. Floor,
  PIN, quorum discipline unchanged.
- P5 Slot note: takes U50 (split/resting program moves to U51; U47b RAND-DET
  still owed; U48 shelved).

## Design
- Diet: u50DietSingle(dataRng, step) as above (C=6/slot drawn with it, all
  arms identical draws); scores GainxNeed s*n via u43ScoreRow with
  picked-history qkCount (note: qkCount is NEVER reset — staleness is the
  treatment); u43StaticSlot verbatim; H48/800st/B16/lr5e-3/K5/C6/auxW0.5/
  lam2.0; pinned stack 258d2f06; twin-matched seed-only streams.
- Arms (9T+9E):
  - DET: pick-max s*n (gets stuck on stale familiarity? — the test).
  - STOCH: softmax T=0.5 sampling via uSamp (U46 verbatim).
  - RES: s*n + Gaussian(0,0.3) pick-max via 12-uniform block (U46 verbatim
    dose — same blur that lost stationary, home game now).
- Alignment: per slot ALL arms draw C candidates (quarter-aware) + 12
  Gaussian uniforms + 1 sampling uniform ALWAYS. Twin determinism in Wave 0.
- Trains: per-slot selection; ledgers carry stackHash + P0 + u50DriverHash +
  adaptRate (4 quarter values, diagnostic).
- Evals: u34 paired-eval verbatim (stationary final memory). Floor guard:
  max arm two < 0.45 on >=2 seeds -> INCONCLUSIVE. PIN fail -> HALT.

## Bars (quorum 2/3, R=3)
- U50-BLUR: two_RES >= two_DET + 0.03 at quorum -> ADVANCE-DRIFT (blur
  vindicated under drift; dice's crown is conditional; licenses blur-dose
  grid under drift + re-test of GATE under drift).
- U50-DICE: two_STOCH >= two_DET + 0.03 at quorum (with BLUR failing) ->
  ADVANCE-DICE (dice rules even on rotating menus; blur's last refuge
  closed at these doses).
- Both hit quorum (both beat DET): whichever has the bigger mean margin
  takes the ADVANCE name (filed tiebreak, no extra bar).
- Neither hits quorum -> DEAD (noise of either form doesn't help even
  when the menu rotates; wall stands; s2 pockets filed as seed-luck).
- DET reported only. ADAPT-RATE reported per arm/quarter, no bar.

## Verdicts
d-newai-self-u50-verdict.json = ADVANCE-DRIFT / ADVANCE-DICE / DEAD /
INCONCLUSIVE / PIN-FAIL, exact numbers + adapt rates.

## D1 amendment (filed Turn-193, no bar changes)
- First-issue diet used hot sets {0,1}->{2,3}->{4,5}->{6,7}; probe proved qk
  domain is {0,1,2,3} only, so q2/q3 familiar branches always fell back
  (adapt 0/0 exactly). Treatment still present (q0->q1 real rotation, loss
  shocks), but Wave1 reviewers ruled HALT-FIX 2-1, discussion unanimous
  HOLD-HALT. Fix: hot sets alternate {0,1}->{2,3}->{0,1}->{2,3} (4 regimes,
  3 real boundaries). Driver force-flag added (opts.force); 9T + wave0
  force-overwritten under this amendment (precedent: U31b). No bar changes.

## Staging + budgets
- Battery on THIS file first (3x sealed) -> v1.1 pins-only. Then driver
  (newai-selfu50-driver.js: u50DietSingle quarter-aware + u43 fns + u46
  aligned block verbatim) + Wave 0 (twins 3x3) + Wave 1 (9T) + Wave 2
  (9E + verdict) with FRESH reviewers per wave (independent -> SHORT
  discussion prompts only [fiction-drift lesson] -> owner arbitration).
  Pre-countersigned (Turn-192 "everything", Turn-193 "try it"): battery +
  Waves 0-2 all covered. NO PUSH without separate explicit order.
- Compute: CPU/in-worker only. 9x800st + 9 evals (~3 min).
- Owed: blur-dose grid under drift (if ADVANCE-DRIFT), GATE-under-drift,
  U47b RAND-DET, U51 split/resting, STOCH-replay, loud-mismatch + STOCH,
  trajectory + replay, dust (blocked).
