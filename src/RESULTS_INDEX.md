# RESULTS_INDEX — every paper claim → its artifact (2026-11-13; §4.4 added 2026-11-16; F-singlegen promoted+indexed 2026-11-16; U60–U64 indexed 2026-11-26)

How to read: each row is one MEASURED claim in `index.html` §§1–8. **Status** grades:
- **CONFIRMED** — run ledger exists under `src/evidence/`, path verified 2026-11-13, numbers byte-checked against the paper at write time.
- **THIN** — ledger exists but the claim outruns it (n=1, single seed, owned caveat). The caveat is part of the claim.
- **PROSE-ONLY** — no surviving ledger; numbers live only in `src/CHATLOG.md` prose (pre-evacuation scratch wipes). Method is tracked (`src/tinynn/`), so these are re-runnable, not hearsay-grade method — but re-run before quoting as confirmed.
- **SUPERSEDED** — the paper itself retires the claim (shortcut found, v2 rebuild wins). Kept so nobody resurrects it.
- **LITERATURE** — other people's papers; artifact is the arXiv link, not our ledger.

## Claim levels — functional / integrated / interpretation-supported (adopted 2026-11-27, reviewer reply)
Complements the three-tier demonstration/analogy/evidence tags. CONFIRMED keeps its
ledger meaning (measured as stated); the level says what KIND of claim it is:
- **Mechanism functional** — the component produces its intended computational effect.
- **Mechanism integrated** — the component receives valid inputs and operates in the complete system.
- **Biological interpretation supported** — the integrated behavior corresponds to the specific biological process claimed.
New rows carry a level; applied retroactively where the record already decides it
(U64e reset: functional + integrated under oracle input, sensor: neither;
biological NE interpretation: unsupported anywhere to date).

## Ledger-integrity audit (the finding this index exists to state)

The §8-era (G-series v2, hinges, cheap-tests, batteries) is fully ledgered: 137 gseries-v2 ledgers + 15 synthesis files, all verified present. The §4.1-era arch comparisons (F-series, hybrid M4, C-suite, K/K2, campfire, settle, PCGrad, E-series) lost their ledgers in pre-2026-11-11 scratch wipes — only CHATLOG prose + track-c w-notes survive. The D-wave/H2 originals are gone the same way (paper self-marks them "wiped; rebuilt as v2, no replication claimed"). Net: **the recipe settlement stands on ledgers; the foundation-era architecture ranking stands on prose.** Re-ledgering §4.1 from tracked code is the milestone-1 reproduction (one F2 + hybrid + K battery, fair slots, seeds 7–9).

## Abstract + regime claims

| Claim | Numbers | Artifacts | Code | Status |
|---|---|---|---|---|
| Fading transmits the rule (fragile) | 5/8 fast fade (CI 0.31–0.86); slow rescues 1/3 | D-series rows below (prose) + `src/evidence/gseries-v2/g1*.json` (successor) | `src/tinynn/gseries.js` | THIN→CONFIRMED (v2 chain confirms at 35/40) |
| Answer-only never ignites | 0/32, CI 0.00–0.11 | H2 prose (CHATLOG 2026-11-09); ledger wiped | `trainModel` answer-only | PROSE-ONLY (v1); v2-era control = §8.4 breed base Hd 0.455, ledgered |
| G-chain compounds | 8/8, 6/8, 7/8, 8/8, 6/8 (35/40, CI 0.74–0.95) | `src/evidence/gseries-v2/g{1..5}-s*.json` + `*-summary.json` + `g{1..5}a/b-results.json` | `src/tinynn/gseries.js` | CONFIRMED |
| Regime bounds | h48, one task family, n ≤ 8/condition | design (spec files) | — | LITERATURE-adjacent (scope, not result) |

## §4.1 hinted regime (Table 1)

| Claim | Numbers | Artifacts | Code | Status |
|---|---|---|---|---|
| Attention looks up, flat across slots | F2 pos0–8: 0.775–0.835, kill 0.80 | CHATLOG 2026-11-08 (F2) | `src/tinynn/nn.js` (attn), `tasks.js` assoc | PROSE-ONLY (f1+f2+f3.json lost pre-evacuation) |
| Wedge-keys + addressing read (M4) beats attention | M4 1.00 vs attn 0.80 @h48; final h64 1.00/1.00 | CHATLOG 2026-11-08 (s05 waveM) | `nn.js` wedge + query head | PROSE-ONLY |
| Running mean carries no signal | camp retest flat 0.365–0.455, kill 0.42 | CHATLOG 2026-11-08 | camp mode in `nn.js` | PROSE-ONLY |
| Ignition is bimodal; C-suite seed-means | M4 0.799, A1 0.766, A0 0.553; failures = high loss | CHATLOG 2026-11-08 (C1) | same harness | PROSE-ONLY |
| Novel targets hard, alien distractors harmless | K/K2 killHd 0.79–0.88, killDa ≈ 1.00 | CHATLOG 2026-11-08 (wave K) | allowed/diag pools | PROSE-ONLY |
| E1a/E2/E3 kill-1.00s | attn/geo 1.00 everywhere | CHATLOG 2026-11-08 (E series) | `makeTrain` short-slot | SUPERSEDED (pos0 shortcut; F-series retraction in-paper) |
| Geo/choosy/settle negatives | kill ~0.3–0.44, desert at K=100 | CHATLOG 2026-11-08 | `nn.js` geo/camp/choosy/settle | PROSE-ONLY (honest negatives; method tracked) |
| PCGrad helps thinly | +0.03–0.05 typical | CHATLOG 2026-11-08 | `src/tinynn/pcgrad.js` | PROSE-ONLY |

## §4.2 the wall (H2)

| Claim | Numbers | Artifacts | Code | Status |
|---|---|---|---|---|
| Answer-only ×3000, 0/32 ignite | seed-means killA 0.33–0.37, Hd 0.41–0.47 | CHATLOG 2026-11-09 (H2); `scratch/h2/` wiped | `trainModel` | PROSE-ONLY (paper table self-marks wiped) |
| Tier-2: memorize (A0) / heuristic-lock (M4) | A0 loss→0.000 killA 0.64 Hd 0.02; M4 Hd 0.21→0.565 | same | same | PROSE-ONLY |

## §4.3 transmission (D-series → G-series)

| Claim | Numbers | Artifacts | Code | Status |
|---|---|---|---|---|
| D1 cold copy transmits nothing | 0/9 fidelity | paper ClaimEvidence table (self-marked wiped) | `trainFaded` hardW=0 control | SUPERSEDED (v2: G-series is the durable successor) |
| D2 fast fade 1/2; D-rate 5/8 (6/10 combined); D-slow rescues 1/3 | s33 holds; s48 rescued | same table (self-marked wiped) | `trainFaded` staged fade | SUPERSEDED (same successor) |
| G1→G5 35/40 | per-gen lists in paper §8.1 | `src/evidence/gseries-v2/` (full) | `src/tinynn/gseries.js` | CONFIRMED |

## §7 hinges

| Claim | Numbers | Artifacts | Code | Status |
|---|---|---|---|---|
| n=8 seed discipline | 8 seeds/claim, Wilson CIs, seed 7 max | all v2 ledgers | — | CONFIRMED (convention, visible in records) |
| Transfer battery | 6 exams 0.97–1.00; memorize-lean fails exactly | `src/evidence/gseries-v2/xfer-results.json`, `xfer3-results.json` | eval-only on saved blobs | CONFIRMED |
| Width sweep | h24 8/8 (T0 Hd 0.205 fails); h96 5/8, T0 0.575 | `h24-results.json`, `h24-s*.json`, `h96-t0-summary.json`, `h96-s*.json` | proportional h/m/d | CONFIRMED |
| SNR mechanism | igniter settles; memorize-lean |A| 9×, |S|/|A|≈1.5; n=1/shape | `snr-results.json` | instrumented `trainFaded` | THIN (n=1 per shape; multi-seed queued) |
| Related-work pass + SSM bound | Mamba-config killA 0.465, Hd 0.00, transfer 0 | `ssm-baseline.json` | geo choosy + query head | CONFIRMED |
| Tutor analysis (free) | weakest tutor (0.60) → 8/8; perfects vary 6/8–8/8 | `tutor-descendant-analysis.md`, `tutor-rerun-s302.md` | ledger analysis | CONFIRMED |

## §8 stages

| Claim | Numbers | Artifacts | Code | Status |
|---|---|---|---|---|
| 8.1 G-chain (ran) | 35/40 + T0 limitation + s608 collapse | gseries-v2 (above) | `gseries.js` | CONFIRMED |
| 8.2 harvest: curriculum CUT | mixed 3/8 vs curr 4/8, CIs overlap | `harvest-mixed.json`, `harvest-curric-a/b.json` | harvest port | CONFIRMED |
| 8.3 staircase FAILS bar | gated 1/8 vs fixed 3/8; mastery-gaming diagnosis | `stair-a.json`, `stair-b.json` | proposer | CONFIRMED |
| 8.4 breeding DIES (twice) | fitness up, transfer down; v2 +0.06 < 2SE bar | `breed-results.json`, `breed-*-champ.json` | `src/tinynn/evo.js` (seed honored) | CONFIRMED |
| 8.5 nursery v0 partial | A 3/4 (+0.36 rival); B 1/2 cross-encoding | `nursery-A.json`, `nursery-B.json` | worker loop scripts | CONFIRMED (partial loop, stated) |
| 8.7 tutor fix queued → superseded | descendant term queued | — | — | SUPERSEDED by §8.8 test (d) |
| 8.8 (a) schedule HOLDS | supervised 0/4, chance 0.23–0.31 | `cheap-tests/a-results.json`, `wave1-driver.js` | SHORT_FADE 3×400 | CONFIRMED |
| 8.8 (b) taught beats bred | 0.888 vs 0.515 (>>2SE) | `b-confirm.json`, `wave2b-driver.js` | eval-only + §8.4 base | CONFIRMED |
| 8.8 (c) transfer REAL | 10/12 hold, 0 collapse (symmetry-easy caveat) | `c-results.json`, `wave1-driver.js` | eval-only on Phase-3 winners | CONFIRMED (caveat owned) |
| 8.8 (d) single tutor suffices | own-T0 4/4 (0.89) vs champ 4/4 (0.84); rotted T0s teach | `d-results.json`, `wave2a-driver.js` | T0-taught vs champ-taught | CONFIRMED |
| 8.8 (e) schedule not special | mid 0.5 rots one init (0.465), 1.0/0.995 another | `e-results.json`, `wave4-driver.js` | midKeep sweep | THIN (n=1; init-sensitivity is the finding) |
| 8.8 (f) PBT not worth it | best 1.845 vs 1.995; 2.0 vs 1.85 | `f-results.json`, `wave3-driver.js` | pop-4 × 2 rounds | CONFIRMED (at this scale, stated) |
| 8.8 (g) rule-ish binding | cyclic 10/12; many-to-one mean 0.736, none at chance | `g-results.json`, `wave5-driver.js` | eval-only symmetry probes | CONFIRMED |
| 8.8 batteries | v1 6/4 → v2 6/2/2 → v3 10/10 steelman | `evo-fade-premise-v{1..3}.md`, `fresh-eyes-evo-fade-v{1..3}-results.md`, `cheap-tests/spec.md` | drivers beside results | CONFIRMED |

## Post-paper program U39–U59 (durable ledgers; CHATLOG Turns 175–218+ + extras)

| Claim | Numbers | Artifacts | Code | Status |
|---|---|---|---|---|
| U39 diagnostics license the program | Wave-B 24 probes; B3 BLIND 3/3; ADVANCE 03/04 (bandit r=−0.819)/05/06/07/10/13, DEAD 01/08/11 | `d-newai-self-u39-*` + `d-newai-self-u39-verdict.json` (DIAG-COMPLETE) | `newai-selfu39-driver.js` | CONFIRMED |
| U40 integration bug localized | gate + r2-carry grads ~13x underweight (FD 1.0000 vs batch 0.065/0.094/0.071) | `d-newai-self-u40-*` + verdict (INTEGRATION-BUG) | `newai-selfu40-driver.js` | CONFIRMED |
| U41 fix verified, gate input-side + U42 falsified | double-/B R0=1.000; U42 shortcut 0/3 | verdicts FIX-VERIFIED / FALSIFIED | `newai-selfu41-driver.js`, `newai-selfu42-driver.js` | CONFIRMED |
| U43 program complete | M2 dGS −0.06/+0.04/+0.04; M1/M4 INCONCLUSIVE; M3/M6 DEAD; M5 ADVANCE | 6 module verdicts + rollup PROGRAM-COMPLETE | `newai-selfu43-driver.js` | CONFIRMED |
| U44 inverted + U45 dead + dust blocked | HIGH-MIX≥LOW-MIX 3/3; U45 never shuts 2/3 | verdicts DEAD-INVERTED / DEAD + dust recipe | `newai-selfu44/45-driver.js` | CONFIRMED |
| U46 dice helps combine (stationary) | STOCH≥DET+0.03 2/3 (s0 −0.05, s1 +0.035, s2 +0.095) | `d-newai-self-u46-*` + verdict ADVANCE-PROT | `newai-selfu46-driver.js` | CONFIRMED |
| U47 dice+smudge hurts | STOCH≥BOTH 2/3; s2 BOTH two 0.555 lone win | verdict DEAD-COMBO | `newai-selfu47-driver.js` | CONFIRMED |
| U49 smart gating changes nothing | dGS −0.02/−0.09/+0.05; s2 GATE 0.5 lone | verdict DEAD | `newai-selfu49-driver.js` | CONFIRMED |
| U50 blur wins under drift | nRD=2 nSD=2; RES mean 0.22 > STOCH 0.155 | verdict ADVANCE-DRIFT | `newai-selfu50-driver.js` | CONFIRMED |
| U52 bioreview triage | 7 briefs, 7/7 PMIDs, 1 full text; P5 runnable now | synthesis v1.2 + briefs 14–20 + incoming transcript | — (no compute) | CONFIRMED |
| U53 veto switch fails guards | ckpts 0.275/0.340/0.305; vetoA 0.0556/0.0635/0.0502 | 37 ledgers + verdict FLOOR-FAIL | `newai-selfu53-driver.js` | CONFIRMED |
| U54 stronger brain + closed switch still fails quorum, P5 closed | ckpts 0.585/0.555/0.555; s2 veto 0.605/1/0.56 vetoA 0.0464 clean 1/3; MISFIRE 2/3 | 38 ledgers + verdict FLOOR-FAIL | `newai-selfu54-driver.js` | CONFIRMED |
| U55 detector collapses (thin signal, precise null) | residual gaps +0.02..+0.14, spikes ~0; NONDEGEN 0/3 POWER 3/3 | wave0 + 240 probes + verdict DET-COLLAPSED | `newai-selfu55-driver.js` v1.4 | CONFIRMED |
| U56 balanced supervision fixes the leak | vetoA 0.0025 all arms; CTX 2/3 FLOOR 3/3 | wave0 + 60 fits + 60E + verdict LEAK-FIXED | `newai-selfu56-driver.js` | CONFIRMED |
| U57 20-seed veto retest fails floor | vetoA 0.051–0.068 20/20; CTX 8/20 FLOOR 0/20 MISFIRE 20/20 | 160T + 80E + verdict FLOOR-FAIL | `newai-selfu57-driver.js` | CONFIRMED |
| U58 rotation detector underpowered at 3 trunks, still underpowered at 20 trunks x 80 streams | v1.3: gap_STAT 3/3, gap_ROT 0/3, carry ~0; v1.5: gap_ROT 14/20 but cross 2/20, spike_ROT 0/20, uw all trunks | wave0/RAND/TRIV + 240 probes + verdict UNDERPOWERED, then 17 canon + 6400 probes + verdict UNDERPOWERED + 9 review docs | `newai-selfu58-driver.js` (+v15 ext) | CONFIRMED (ruler works; residue is substrate — no further N licensed) |
| U59 supervised veto fixes leak, floor fails (20 seeds) | vetoSUP vetoA 0.0059–0.0064 20/20 (vs U57 0.059); CTX 15/20 NOERASE 20/20; noveto 0.21–0.34 → FLOOR 0/20; replication 0.0589 | 100T + 100E + verdict FLOOR-FAIL + failure analysis (10x SOUND/CONFIRM) | `newai-selfu59-driver.js` | CONFIRMED |
| U60 regime substrate EXECUTED | MANIP-FAIL: PIN 20/20, MANIP 10/20 (canon max 0.003314; regime mean ~0.00333); NONDEGEN/DISSOCIATE/INDEPEND/POWER 0/20 — guard fires first, DET3 bars not interpreted | 20 regime trains + 80 probes + verdict + closeout `self-u60-det3-closeout.md` + 3 review docs (30 R1 + 30 D unanimous) | `newai-selfu60-driver.js` | CONFIRMED |
| U60b priced carry EXECUTED | UNDERPOWERED: MANIP 16/20 (qv 0.0016-0.0082, ~2x U60 max); quarter-readout 0.313 vs 0.25 (echo ceiling ~0.50; qloss 1.27-1.54 vs ln4 1.386 = excursion without encoding) | 80 probes + verdict + closeout `self-u60b-priced-closeout.md` + 4 review docs (30 R1 + 30 D) | `newai-selfu60b-driver.js` (D-pin: u32MaxAbsDiff-on-live-params crash fixed pre-compute) | CONFIRMED |
| U60c slow trace EXECUTED (reads-only) | Z-ABSENT: QV-Z 0.0003-0.0012 all inside canon band (0.00072/0.001385) → guard 0/20; ZB-resp ROT negative everywhere (dips not snaps); STAT +0.01 WITHOUT base correction (D5 confounded, disclosed non-deciding) | verdict + closeout `self-u60c-trace-closeout.md` + 3 review docs (30 R1 + 30 D) | `newai-selfu60c-driver.js` | CONFIRMED |
| U61 balanced veto fails floor, vindicates mechanism | CTX 16/20, vetoA 0.0024-0.0025, replication 0.0373; noveto 5/20, global 0/20 by-construction | 100T + 100E + verdict FLOOR-FAIL + closeout (D3 binding, leak-proportional-to-pressure) | `newai-selfu61-driver.js` | CONFIRMED |
| U62 rescoped re-gate EXECUTED (reads-only) | TASK-NOREP: PIN/CTX/NOERASE/FLOOR-R/GDIR as U61 (16/20, 20/20, 20/20, 20/20); ISOLATE 11/20; replication 0.0373 vs 0.059 trips by 0.0017 (const-visibility PIN-FAIL repaired pre-review to literals) | wave0 + verdict + 3 review docs (20 R1 + 20 D) | `newai-selfu62-driver.js` | CONFIRMED |
| U62 replication audit (doc-only) | DIET-EXPLAINED: pipeline intact (all other bars identical); 0.0589 x 0.5/0.8 = 0.03681 predicted vs 0.03733 observed (~0.5 SE); tolerance diet-blind | audit doc `self-u62-replication-audit.md` | — (no driver) | CONFIRMED |
| U63 diet-scaled recompute EXECUTED (reads-only) | SUP-PERSISTS: replication 0.0373 vs 0.036875 RESOLVED (diff 0.0005); isolate 11/20 (unfrHolds 0/20); CTX 16/20 NOERASE 20/20 FLOOR-R 20/20 GDIR 20/20 | wave0 + verdict + closeout `self-u63-scaled-closeout.md` + 2 review docs (20 R1 + 20 D) | `newai-selfu63-driver.js` | CONFIRMED |
| U60 paper-gap analysis (doc-only) | 7 gaps (half-a-variable w/o consumers; un-timed gain; no mode; all-commit + timescale outside window; fixed lam suspect; Lippl points at binding; fixed-schedule clock + no second store + dense interference) + 6-step success recipe (step 1 = rule-switch diet + oracle controls, NOT preregged) | `self-u60-paper-gap-analysis.md` | — (no compute) | CONFIRMED (as reviewed design; step 1 needs fresh prereg+battery+countersign) |
| U64 ruleswitch EXECUTED (100T + 100E) | INCONCLUSIVE: ORACLE-EDGE-outcome 4/20 FAIL / ORACLE-ADAPT 15/20 MET (correction-1, filed 0/20 irreproducible) / FLOOR trips 11/20 (all arms outcome 0.25–0.52) / TIMING-DIAG orT−shT −0.028 reversed / PIN 20+100 / RULE-ID 20/20. Reading: cheater buys adapt-speed thinly, not outcomes; floor 0.45 miscalibrated for rule-switch diet; stationary eval washes out training | wave0 (15/15 twins) + 100T + 100E + verdict `d-newai-self-u64-verdict.json` + correction-1 + closeout `self-u64-closeout.md` + 4 review docs (program battery + wave0/1/2; 40 R1 + 40 D, dissent rejected) | `newai-selfu64-driver.js` (D1–D4 + D5 diet-bound, zero data) | CONFIRMED (verdict + corrected adapt bar independently recomputed from filed ledgers) |
| U64b punishing-exam EXECUTED (100 reads-only re-evals) | PROCEED: EDGE-E1 20/20 (orF 1.0000 x20, margins +0.04..+0.31, dice mean 0.8537) / EDGE-E2 1/20 FAIL (ceiling ~1.0 all arms — E2 runs weight-transfer w/ fresh counts, uninformative) / FLOOR 20/20 (sens 0.35/0.40/0.45 agree) / PIN 100/100 / RULE-ID 20/20. Reading: recovery exam separates information from guessing; cheater correct by construction | 100 ledgers + verdict `d-newai-self-u64b-verdict.json` + closeout `self-u64b-closeout.md` + 4 review docs (barrage + round-2 + red + re-close; 39 reviewers, 9 adoptions) | `newai-selfu64b-driver.js` (I1..I9) | CONFIRMED |
| U64c wired-response EXECUTED (20 detT trains + 20 evals; owner override of pre-compute kill) | INCONCLUSIVE: FLOOR 15/20 (11/20 6-arm) / edges dead underneath (EDGE 4/20, ADAPT 1/20) / detT adapt 0.77–0.91, explore-hit ~84% (barely exploratory) / R9 mechanical -> (b) reset-helps-explore-hurts. Reading: training-time modulation doesn't survive freezing; old exam unaskable even for perfect info; explore-tax vs bar = dead by construction (kill STANDS on record; run for posterity) | 20 detT trunks + 20 evals + verdict `d-newai-self-u64c-verdict.json` + closeout `self-u64c-closeout.md` + 4 review docs | `newai-selfu64c-driver.js` (J1..J5) | CONFIRMED |
| U64d both-together EXECUTED (20 reads-only re-evals) | BOTH-DEAD: E1 10/20 (margins −0.17..+0.17 ~0-centered) / E2 1/20 ceiling / FLOOR holds / examHash_D == U64b examHash / fidelity 3/3. Reading: combination adds nothing frozen; emergence NULL (filed, battery owed) | 20 ledgers + verdict `d-newai-self-u64d-verdict.json` + closeout `self-u64d-closeout.md` + emergence `self-u64-emergence-analysis.md` | `newai-selfu64d-driver.js` (K1..K4, no exam copy) | CONFIRMED |
| U64e online-modulation EXECUTED (80 reads-only re-evals) | ORACLE-ONLY shape F4: LOOP-CLOSED 4/20 DEAD / RESET-VALUE 16/20 MET (mean +0.092) / RAND 11/20 (no demotion) / FLOOR 20/20. surBlind monitor NEVER fired (0 triggers in 3000 slots — frozen-weight surprise flat; red-1 predicted, measured 20/20) / blind-drag +0.0197 (F2 dead) / D1 CONFIRMED on oracle arms (rec1 ~= dice, gains rec2/3) / D2 DEGENERATE (gap from zero blind picks) / s9 counter-case (reset hurt). Reading: live reset works — first proof an online intervention moves the needle; live detection nonexistent. Next = sensor (U64h, UNLICENSED) | 80 ledgers + verdict `d-newai-self-u64e-verdict.json` + closeout `self-u64e-closeout.md` + prereg `self-u64e-online-prereg.md` v1.4 + 5 review docs + premises v1.0–v1.4 (21 adoptions) | `newai-selfu64e-driver.js` (E1..E7, gen 1) | CONFIRMED (reset: functional + integrated under oracle input; sensor: neither — 0/3000 activations; NE interpretation: unsupported) |
| U65–U69 program preregs (doc-only, battery-closed) | 5 preregs STANDS v1.0 (U64 10/10 + U65 9/10 + U66–U69 10/10 IMPLEMENTABLE; all D rounds vacuous, zero adoptions). Compute UNLICENSED: gated on U64-PROCEED (unmet); U66 doubly gated on U65-READY | `self-u65-detector-prereg.md`, `self-u66-consumers-prereg.md`, `self-u67-sticky-prereg.md`, `self-u68-thermostat-prereg.md`, `self-u69-store-prereg.md` + battery `fresh-eyes-self-u64-u69-10x-results.md` | — (no drivers, no compute) | CONFIRMED (as reviewed design) |
| U61 balanced veto fails floor, vindicates mechanism | CTX 16/20, vetoA 0.0024-0.0025, replication 0.0373; noveto 5/20, global 0/20 by-construction | 100T + 100E + verdict FLOOR-FAIL + closeout (D3 binding, leak-proportional-to-pressure) | `newai-selfu61-driver.js` | CONFIRMED |

## §2 lineage (LITERATURE — no our-ledger)

Huginn 2502.05171, Grassmann 2512.19428, Mamba 2312.00752, Coconut 2412.06769, Looped 2301.13196, CoT, s1, PonderNet, DEQ, DAgger, CGAR, Looped-LM survey, collapse-as-cultural-evolution, Ren 2004 fading, Gaier/Ha WANN, Salimans ES, Jaderberg PBT. Artifacts: arXiv links in paper References; Track-C notes in `src/evidence/rabbithole/track-c/` + `src/evidence/synthesis/`.

## Re-ledger queue (turns PROSE-ONLY into CONFIRMED)

1. F2 + M4 + K battery from tracked `src/tinynn/` (fair slots, seeds 7–9) → ledgers to `src/evidence/arch/` → flip §4.1 rows. This is the milestone-1 reproduction.
2. H2 answer-only spot check (1 arch × 4 seeds) → confirms the wall cheaply.
3. Multi-seed SNR (igniter vs memorize-lean × 3 seeds) → firms the mechanism row.

## §4.4 doubt arc (1.d — added 2026-11-16; ix inputs live in scratch/, see caveat)

| Claim | Numbers | Artifacts | Code | Status |
|---|---|---|---|---|
| Pointer admissible + overconfidence disclosed | ptrHit\|correct killA 1600/1600 = 1.000 (killHd 1454/1454); errors at 0.70 mean top-1 (n=146), 22.6% ≥ 0.9; s313 0.84, 31/60 ≥ 0.9 | `src/evidence/synthesis/phase-1diii/phase-1diii-verdicts.md` + `phase-1diii-results.json` | dump driver | CONFIRMED |
| wTarget dead as doubt | alone pooled 0.536; conjunction (top-1 ≥ 0.9 ∧ on-target) precision ~3% | same | same | CONFIRMED (negative) |
| Energy CUT (pilot-win, full-loss) | s313 0.8306 vs 0.737 → pooled 0.8938 vs 0.9293 | `phase-1dv-pilot-verdicts.md` + `phase-1dv-verdicts.md` (raw rows `scratch/p1dv-full.json`) | re-dump recipe | THIN (verdict durable, rows in scratch) |
| Committee CUT | split 0.6274 vs suspicion 0.8515 (1600 pairs, 146 err) | `phase-1dvi-verdicts.md` (recompute of iii ledger) | ledger recompute | CONFIRMED (negative) |
| Laplace FULL-FAIL + post-mortem a–e | s313 0.8916 (pass) → pooled 0.928524 vs 0.929287 (Δ −0.0008); λ=100 on 8/8 | `phase-1dvii-pilot-verdicts.md` + `phase-1dvii-verdicts.md` (rows in scratch/) | vii recipe | THIN (verdict durable, rows in scratch) |
| ix meta-probe PILOT-FAIL | pooled 0.4936 (bar 0.60), win-rate 0/8 (bar 5/8); suspicion 0.8598 same lines; train 0.809 | `phase-1dix-verdicts.md` (+ W1 0.763 / W3 0.4606 why-diagnostics) | ix-pilot v1.5 frozen | THIN (verdict durable, brains + rows in scratch) |
| x-ablation HALT → false-trip diagnosis | B-perm 0.6562 trips (99.7% CI excludes 0.5); 200 fresh draws mean 0.496, max 0.6532; old-switch false-trip 0.67; true-B 0.761 | `phase-1dx-verdicts.md` | ix-ablate + slice runner | THIN (verdict durable, seeds in scratch) |
| Run B: lines dead, strong form | A pooled 0.4851, cluster CI covers chance; Δ(A−A0) −0.060 strict | same doc (`src/evidence/synthesis/ix-runb.json`) | `src/tools/ix-runb.js` | CONFIRMED (results + recipe durable; inputs in scratch/, see headers) |
| Run C: latching DEMONSTRATED | zero-line 0.7585 ≈ W1 0.763; zero-B 0.5465 covers chance; gate 0.7633 == 0.763 | `src/evidence/synthesis/ix-latch.json` + `src/tools/ix-latch.js` | masked forwards | CONFIRMED (results + recipe durable; inputs in scratch/, see header) |
| Sign-flip: mirror axis, cheap path dead | oracle per-brain ~0.73 (0.13→0.87 etc.), pooled 0.4824; k=10/20/40 → 0.53/0.55/0.42 | `ix-signflip.json` + script | ref-sign flips | CONFIRMED (same input caveat) |
| Suspicion killHu boundary | pooled 0.5572 (seen, quarantined); confirmatory 2026-11-16-02: 14 fresh 5101–5114, 0 lost / 10 competent → FAIL-regimes-unfilled (rho 0.5275<0.6, p≈0.069, CI −0.03–0.84; competent median 0.8875; pooled 0.8217 record-only; gate KILL on per-brain-grained) | `ix-susp-hu.json` + `susp-hu-confirm.json` + `forensics-run-2026-11-16-02.json` (driver permutation-p fix; betai errata filed) | same lines as W1 | CONFIRMED as failed-to-test (boundary untested; fresh recipe yields no lost brains — recipe finding; paper block stays) |

Caveat (applies to every row above whose inputs are scratch-only): the durable record is the verdict/result JSON; re-running needs `scratch/ix-partial.json`, `ix-final-*`, `ix-probe-P*` — re-materialize via the frozen ix-pilot recipe if wiped (headers in `src/tools/ix-*.js` give the exact recipe).

## §8.6 F-singlegen O2 — schedule, not generations (added 2026-11-16)

| Claim | Numbers | Artifacts | Code | Status |
|---|---|---|---|---|
| O2: continued student ≈ fresh students | G 28/32 vs S 29/31 gens; max paired diff 1 gen; 3 inversion seeds (206/207/208) favor S; 204 mirrors, 205 rots both | spec v1.0 + pilot + 8 phase-3 seed files + runner + results (all durable; small files promoted 2026-11-16) | `src/evidence/synthesis/f-singlegen.js` (ran from scratch/) | CONFIRMED (full power 8xG/Sx5x3000) |
| O3 scope: S = weights-carried/fresh-Adam | pilot SOPT==S (s201 both gens, s203 identical rot; s202 SOPT missing infra); Phase 3 ran {G,S} per pilot scoping; true Adam-carry untested, tracked | pilot verdict + per-seed justification lines + paper §8.6 disclosure | same | CONFIRMED as scoped decision (NOT optimizer-irrelevance-in-general) |
