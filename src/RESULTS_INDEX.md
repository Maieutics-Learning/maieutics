# RESULTS_INDEX — every paper claim → its artifact (2026-11-13)

How to read: each row is one MEASURED claim in `index.html` §§1–8. **Status** grades:
- **CONFIRMED** — run ledger exists under `src/evidence/`, path verified 2026-11-13, numbers byte-checked against the paper at write time.
- **THIN** — ledger exists but the claim outruns it (n=1, single seed, owned caveat). The caveat is part of the claim.
- **PROSE-ONLY** — no surviving ledger; numbers live only in `src/CHATLOG.md` prose (pre-evacuation scratch wipes). Method is tracked (`src/tinynn/`), so these are re-runnable, not hearsay-grade method — but re-run before quoting as confirmed.
- **SUPERSEDED** — the paper itself retires the claim (shortcut found, v2 rebuild wins). Kept so nobody resurrects it.
- **LITERATURE** — other people's papers; artifact is the arXiv link, not our ledger.

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

## §2 lineage (LITERATURE — no our-ledger)

Huginn 2502.05171, Grassmann 2512.19428, Mamba 2312.00752, Coconut 2412.06769, Looped 2301.13196, CoT, s1, PonderNet, DEQ, DAgger, CGAR, Looped-LM survey, collapse-as-cultural-evolution, Ren 2004 fading, Gaier/Ha WANN, Salimans ES, Jaderberg PBT. Artifacts: arXiv links in paper References; Track-C notes in `src/evidence/rabbithole/track-c/` + `src/evidence/synthesis/`.

## Re-ledger queue (turns PROSE-ONLY into CONFIRMED)

1. F2 + M4 + K battery from tracked `src/tinynn/` (fair slots, seeds 7–9) → ledgers to `src/evidence/arch/` → flip §4.1 rows. This is the milestone-1 reproduction.
2. H2 answer-only spot check (1 arch × 4 seeds) → confirms the wall cheaply.
3. Multi-seed SNR (igniter vs memorize-lean × 3 seeds) → firms the mechanism row.
