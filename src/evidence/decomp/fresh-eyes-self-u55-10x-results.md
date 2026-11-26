# Fresh-eyes battery: U55-DET1 prereg — 4 rounds, 40 reviewers — v1.3 STANDS

**Artifact:** `self-u55-det1-prereg.md` v1.0 → v1.1 (M1–M8) → v1.2 (N1–N8) → v1.3 (O1–O8). Frozen U33 trunk, read-only, 2×2 diet, 20 streams/cell/trunk (240 probes), N=400 rows. **Reviewers:** 10 NEW sealed contextless per round (disjoint angles), ≤200w, plus R4 one-line verification round. **Tools:** page_eval Promise.all root.generateText. NO compute exists at any round (all pins doc-only). Cover: user "go ahead and lets do one and 2" (+ heavy multi-round batteries for the detector track).

## R1 (v1.0): 10x NEEDS-PATCH unanimous
U1: NEEDS-PATCH — P1 per-slot EMA precision; P2 quarter-boundary index + "within 25 rows" vague; P3 formalize "loss-derivative void". Hardest: 2/3 trunk quorum underpowered at N=200/20 streams. DESIGN-FLAW: EMA vs trailing-window inconsistent temporal filters.
U2: NEEDS-PATCH — P1 cross-check metric ambiguous; P2 loss-derivative void implementation; P3 quantify nondegenerate. Hardest: D-switch ≥+0.10 arbitrary-tight, type-II risk. DESIGN-FLAW: quorum on 20-stream mean±SE statistically incoherent (SE is population estimate, not per-trunk boundary).
U3: NEEDS-PATCH — P1 cross-check; P2 loss-derivative void for frozen trunks; P3 non-degenerate thresholds. Hardest: 20-stream mean±SE can't separate noise floor if σ high. DESIGN-FLAW: frozen trunk ⇒ derivative void is a definitional dodge.
U4: NEEDS-PATCH — P1 quantify "big"; P2 quorum tie-break; P3 define "neither ~0". Hardest: +0.10 arbitrary, no trailing-50 baseline. DESIGN-FLAW: frozen trunk prevents adaptation to stream variance → systematic COLLAPSED.
U5: NEEDS-PATCH — P1 "relabeled" mechanism (swap vs noise?); P2 quorum logic (mean across all 3 or passing 2?); P3 loss-derivative void is tautology. Hardest: P2b unfalsifiable on frozen trunk (gradient zeroed by design). DESIGN-FLAW: circular logic trap.
U6: NEEDS-PATCH — P1 trailing-50-vs-200 slide vs block; P2 cross-check metric; P3 void-vs-INDEPENDENT (frozen stops gradients but not latent dependence). Hardest: +0.10 false-positives in STAT via EMA variance. DESIGN-FLAW: 2/3 quorum risks masking systemic single-trunk failure.
U7: NEEDS-PATCH — P1 "hot set" definition; P2 loss-derivative void (zero grad ⇒ |r|<0.7 trivial baseline); P3 PIN criteria. Hardest: N=200 insufficient for trailing-200 baseline (noise-dominated ≥+0.10). DESIGN-FLAW: 2/3 on 20-stream means underpowered vs tiny-ML noise floors.
U8: NEEDS-PATCH — P1 EMA gap raw vs normalized; P2 cross-check baseline; P3 2/3 quorum failed-trunk handling. Hardest: +0.10 has no scale/normalization. DESIGN-FLAW: 2/3 on 20-stream mean precarious, one trunk flips the cell.
U9: NEEDS-PATCH — P1 "relabeled" ground-truth-shift vs label-noise; P2 cross-check floating value; P3 spike vs baseline variance. Hardest: 2/3 underpowered for crash-test dry-run, type-II on D-switch. DESIGN-FLAW: 50-vs-200 too slow for 200-row window, misses spikes before next boundary.
U10: NEEDS-PATCH — P1 SE estimator (SE vs SD); P2 cross-check source; P3 quantify "big". Hardest: 2/3 prone to type-I errors from EMA-gap stochasticity. DESIGN-FLAW: hypersensitive 50-vs-200 + arbitrary +0.10.
(R1 lesson: 7x cross-check undefined; 6x void-tautology; 5x quorum-statistics; N=200 too short for trailing-200.)

## v1.1 pins (M1–M8, doc-only)
M1 cross-check operator gap_R + cross formula; M2 NONDEGEN epsilon +0.05, ~0≡[−0.05,+0.05]; M3 N=400 rows, quarters/100, 3 boundaries, sliding per-row windows, thresholds kept; M4 relabel p=0.5 uniform; M5 hot sets (0.7 mass; ROT rotates; {4,5}-overlap subtracted within-regime); M6 P2b replacement (OLS residuals + |r|<0.7, void-phrasing retracted); M7 per-trunk means, SE diagnostic, no pooling, 2/3 decisive, UNDERPOWERED flag; M8 filters by design (EMA α=0.9 ~10-row vs 50-vs-200 ~150-row).

## R2 (v1.1): 10x NEEDS-PATCH unanimous
V1: Q1 hard-cut boundary artifacts contaminate sliding D-switch; Q2 noise-subtraction method ambiguous (local-mean vs high-pass). Hardest: ROT false-positive spikes mask true transitions. YES v1.1 answered R1.
V2: Q1 rotating index modulo-vs-hardcode; Q2 EMA cold-start transient, window misfires at boundary 0; Q3 t-stat/p-value for "margins survive". Hardest: 0.05 cross-gap too tight for p=0.5 noise → false COLLAPSED. YES.
V3: Q1 window 200 spans 2 boundaries, blurs transitions; Q2 epsilon 0.05 too wide vs cross 0.05; Q3 SE weak, 2/3 arbitrary, false HEALTHY on underpowered. Hardest: 200-window neutralizes 50-row spike. NO (windowing overlap remains).
V4: Q1 0.3 residue non-uniformity breaks cross-regime comparison; Q2 p=0.5 noise false-positive spikes in STAT. Hardest: symmetry drift. NO (M6 "survive" undefined — no mathematical basis).
V5: Q1 subtracted-within-regime ambiguous (baseline shift vs point-by-point); Q2 window alignment leading vs trailing. Hardest: overlap subtraction may erase the spike. NO (trigger point undefined).
V6: Q1 regressing-out void (OLS vs mean-subtraction?); Q2 2/3 decisiveness (13–14 streams, 2SE overlap likely → chronic UNDERPOWERED). Hardest: M6 conceptually unstable. NO (placeholder operation).
V7: Q1 no power analysis/α-level (type-II on HEALTHY); Q2 hard-coded spike fails if SNR < epsilon. Hardest: UNDERPOWERED flag triggers too late (qualitative, not a gate). NO.
V8: Q1 spike basis (local mean? global max?); Q2 2/3 heuristic + failure modes; Q3 cross 0.05 unjustified. Hardest: thresholds are arbitrary constants. YES (structurally sound, numerically suspect).
V9: Q1 50-vs-200 too wide, noise-bleed; Q2 no STAT−ROT symmetry check (absolute difference only → degenerate-both-pass); Q3 2/3 heuristic, no p-value/CI. Hardest: n=20 too small to separate epsilon from 0.10 spike at p=0.5 floor. YES.
V10: Q1 ROT phase-lock (period-100 deterministic aliasing, probe≡state mod 100); Q2 25-row window + phase-shift bias, high-freq bleed; Q3 [−0.05,+0.05] too broad, zero-crossings non-degenerate. Hardest: systemic aliasing. NO (phase-lock ignored).

## v1.2 pins (N1–N8, doc-only)
N1 OLS operator (single covariate = per-stream mean error; residuals; identical thresholds; singular→NOSREAD with 2× raw thresholds); N2 jittered boundaries 100±U{0..20} (filed stream 61000+t, 3/stream) + trailing windows + 50-row burn-in + spike=max(b+1..b+25)−mean(b−25..b−1); N3 windows reset at filed boundaries, ≥50 in-quarter rows required (latency ≤75 rows tested); N4 strict gating (NONDEGEN→DISSOCIATE 4/5→INDEPEND); N5 UNDERPOWERED is a verdict (2SE>margin on ≥2 trunks); N6 half-minimum-effect convention (vetoA reference kept at this version); N7 0.3 residual uniform + within-regime subtraction; N8 STAT guard stands, V4Q2 tightening rejected (tuning-to-nothing).

## R3 (v1.2): 2x IMPLEMENTABLE (W1, W9) + 8x NEEDS-PATCH
W1: IMPLEMENTABLE. Hardest: half-gap convention ambiguous without gap baseline. ROUNDS-ENOUGH YES (chain closed, singular handled).
W2: NEEDS-PATCH — P1 half-gap math (gap/2 vs constant?); P2 singular (rank-deficient XtX vs det<ε?); P3 which margin for 2SE>margin. ROUNDS-ENOUGH NO (need v1.3 reconciliation).
W3: NEEDS-PATCH — P1 error-rate points (count vs continuous delta); P2 D-cue gap polarity/unit; P3 singular (rank vs zero-variance). Hardest: gap floats in a strict chain, untestable. NO.
W4: NEEDS-PATCH — P1 singular (rank vs zero-variance); P2 NOSREAD behavior (PIN-FAIL vs bypass?); P3 2SE margin reference. Hardest: singular-handling↔UNDERPOWERED circularity. NO.
W5: NEEDS-PATCH — P1 2SE per-trunk vs per-probe; P2 half-gap value vs tolerance; P3 identify the covariate. Hardest: covariate unknown → INDEPEND untestable. YES (logic fully mapped; further rounds pedantry).
W6: NEEDS-PATCH — P1 covariate identity; P2 2× thresholds scope (which margins). Hardest: same. NO (one reconciliation needed).
W7: NEEDS-PATCH — P1 half-gap references missing vetoA (not in spec); P2 gap subtraction vs ratio. Hardest: dangling reference makes test uncomputable. NO (lock gap arithmetic).
W8: NEEDS-PATCH — P1 singular trigger threshold; P2 2SE = SE-of-mean vs SEE. ROUNDS-ENOUGH YES (logic frozen; only boolean triggers left).
W9: IMPLEMENTABLE. Hardest: half-gap convention across noise floors may false-positive PIN-FAIL. YES (computationally closed).
W10: NEEDS-PATCH — P1 D-cue gap Δmean vs ratio; P2 DISSOCIATE 3/4 sub-conditions unlisted (black box); P3 singular trigger. Hardest: gating untestable. NO (lock DISSOCIATE + gap).
(R3 3x YES / 7x NO; NOs demand exactly the definitions O1–O8 supply. Genuine catch: "3/4 sub-conditions" miscounts five — W10P2.)

## v1.3 pins (O1–O8, doc-only)
O1 FIVE sub-conditions need 4/5: (a) gap_STAT≥+0.15 (b) gap_ROT≥+0.15 (c) cross≤+0.05 (d) ROT spike≥+0.10 (e) STAT spike≤+0.05 (same allow-one-miss spirit; denominator fixed). O2 gap arithmetic: per-stream v=(mean e {4,5})−(mean e other 6), continuous error-rate deltas; {4,5} matched control in CLEAN; gap_R=mean(v_NOISY,R)−mean(v_CLEAN,R) signed; cross=|gap_ROT−gap_STAT|. O3 singular=zero-variance covariate first, else failed OLS solve; NOSREAD=2× RAW thresholds, never PIN-FAIL/UNDERPOWERED (no circularity). O4 UNDERPOWERED per-trunk SE-of-mean, per-sub-condition 2SE>own-margin→UNMEASURABLE, ≥2 trunks→track UNDERPOWERED. O5 convention self-contained (vetoA reference retracted). O6–O8 restated (covariate = per-stream mean 0/1 error; 2SE = 2×SE-of-mean; guard-tightening rejected again).

## R4 verification (v1.3): 10x CONFIRM-V1.3 unanimous
R1–R10: all CONFIRM-V1.3.

## Adjudication (owner, final)
v1.3 STANDS (40 reviewers: 10+10+10+10; genuine counting bug fixed at O1; N1–N8/O2–O8 are definitions the design always implied, now pinned — no threshold moved except the miscount correction, which preserves allow-one-miss; no data exists anywhere, so nothing is tuning). U55 driver built (`newai-selfu55-driver.js`, 4/4 fns load-checked, zero probe compute). AWAITING fresh countersign for Waves 0–2 (Wave-0 load-check + 12 dry-run probes; Wave-1 240 probes in 12 ledgers; Wave-2 verdict). NO COMPUTE until then.
