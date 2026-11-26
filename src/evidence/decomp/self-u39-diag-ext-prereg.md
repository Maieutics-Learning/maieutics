# U39-DIAG-EXT prereg v1.1 — zero-training diagnostic batch + D5 gate-only trains
Battery: 3x sealed (R1/R2 NEEDS-PATCH, R3 IMPLEMENTABLE) → pins P1a–P1e applied
this version. Full battery in src/evidence/decomp/fresh-eyes-self-u39-diag-ext-3x-results.md.
Pin resolutions: R1-P1a (replace A7) REJECTED — diet regen from filed seed spec
is arithmetic, not unfiled data; A7 clarified instead. R1-P1b (new ledger field)
REJECTED same reason. R1-HEALTH#5 answered: A1→B8 is one-way gating, not
circularity (P1e). R2-P1a PARTIAL — B4 bars kept, INCONCLUSIVE consequence made
explicit (P1b). R2-P1b ACCEPTED (P1c). R2-P1c ACCEPTED (P1d). R3-P1a ACCEPTED
(folded into P1b). R3-P1b ACCEPTED (P1e).

Scope: decide, by measurement only (plus six small gate-only trains), which of the
12 Turn-174 debate training arms may ever advance to a prereg. Extends the
Turn-169 U39-DIAG plan (D1–D5, full text in
src/evidence/decomp/self-u35-u38-post-push-record.md §2); adds Wave-A (ledger
arithmetic) and Wave-B (frozen-weight probes) from
src/evidence/decomp/papers/synthesis-turn-174.md. CPU/in-worker JS only. NO PUSH.

## Filed inputs (read-only)
- Train ledgers: d-newai-self-u{34,36,37,38}-c{0,1(,2)}-s{0,1,2}-800st.json
  (curve = 9 pts {step,loss}; P0 + P full weights; dietTot[3]; divCos).
- Eval ledgers: d-newai-self-u{34,36,37,38}-eval-*.json (accScratch/accTwo/
  accOracle/accFwd; u38 adds accTwoOpen/accTwoLow/gate).
- Stack pin: stackHash 258d2f06 (11 files, per U33 ledger d-newai-self-u33-stack.json).
- Drivers (load-check before any probe): newai-selfu32-driver.js (frozen trunk
  baseline), newai-selfu36-driver.js (diet regen + K=5 vote machinery),
  newai-selfu38-driver.js (gate machinery + low-cue eval).

## DEVIATIONS from debate specs (filed before compute; battery to confirm)
- D-a (debate-04 per-region Delta-loss): ledgers carry only TOTAL loss (9 pts),
  no per-region curves. Wave-A uses total-loss slope as proxy; per-region version
  runs in Wave-B (B8 recomputes per-family loss from frozen weights) if proxy is LIVE.
- D-b (debate-09 slope): only 3 seeds exist — cross-seed regression is 3 points.
  Wave-B uses the row-level version instead (per-row correctness compose-arm vs
  baseline-arm, N=1000 rows, same seed): slope<1 = compression.
- D-c (debate-13 entropy): the trunk has NO token head (4-class vote head bv[4]
  only). B5 audits vote-head entropy as the honest substitute; a zero-bias result
  files the productive-goal arm INAPPLICABLE-as-instantiated (stronger than gated:
  the thesis cannot be built without new machinery), not merely gated.
- D-d (debate-05 gain): flip-potential operationalized as (1 − logit margin) on
  currently-wrong rows vs |PE|; rho computed row-level, N=1000. Method filed;
  battery judges whether this is a fair dissociation test.

## Wave-A — ledger arithmetic only (no forward passes; deterministic re-runnable)
New ledger: d-newai-self-u39-waveA.json. All bars single-shot, pre-filed:
- A1 flat-LP proxy: mean |slope| of total loss, steps 200→800, U36+U37 both arms ×
  3 seeds (12 curves). LIVE if ≥8/12 curves have |slope|>1e-4 per 100 steps;
  else FLAT (kills 03/04 bandits outright; B8 not run).
- A2 loss-slope headroom (10): same 12 curves, last-300-step slope.
  HEADROOM if mean slope >1e-4 per 100 steps; else SATURATED (ramp dead).
- A3 trunk-regression (07): ||P−P0||_F per block (E,W1,Wf,Wc,Wh) for U34
  c0/c1/c2 × 3 seeds (9 pts); Pearson r(drift, price-dose). TUGBOAT if |r|≥0.4
  (staged schedule stays gated-in); else NO-TUG (07 arm dead, linear-decay moot).
- A4 rank-cardinality (08): rank(diet input matrix)/vocab-size, diet regen from
  filed seeds (deterministic; arithmetic, no model). UNSPANNED if ratio <1
  (vocab arm stays gated-in); else SPANNED (08 arm dead).
- A5 over-chasing (11): loss-drop spikes (curve diffs, U34/U35) vs accTwo
  failure, arms×seeds (15 pts). SIGNATURE if |r|≥0.4 (STC stays gated-in);
  else NO-SIGNATURE (11 arm dead).
- A6 STRENGTH variance (06): CV of dietTot[3]×accScratch across families/seeds
  (U36). HEADROOM if CV>0.2 (SFMA stays gated-in); else FLAT (06 arm dead).
- A7 shortcut correlation pt.1 (09): label-predictability from diet metadata.
  Regen N=10000 rows via the driver diet fn with the filed diet spec + seed
  (pure arithmetic: features + labels, no model forward passes); max
  single-feature accuracy. LEAK if >60% (supports 09 proponent); else CLEAN.
  (Slope part is B6.) [P1a: R1's unfiled-data flag answered — no ledger field
  needed; regen path is the instrument.]

## Wave-B — frozen-weight probes (no training; N=1000 rows unless noted; R=3 seeds)
New ledgers: d-newai-self-u39-probe-{b1..b8}-s{seed}.json. Drivers load-checked;
twin-matched seed-only streams; every probe carries its neutralized control:
- B1 D1 signal: u38-c1 P, matched vs swapped gate input [E[qk]|cNew];
  separability = linear-probe accuracy. SIGNAL if ≥0.65 2/3 seeds; else NO-SIGNAL
  (fix = gate input, not pressure).
- B2 D2 pressure (= debate-01 gate): u38-c1 P, round-2 acc clean vs swapped vs
  zeroed + shut rate. PAYS-TO-SHUT if zeroed > swapped by ≥0.03 AND shut-rate
  >0.2 on swapped 2/3 seeds; if the condition is NOT met the meta-learning arm
  is marked DEAD (not merely gated). [P1d]
- B3 D4 positive control: zeros-context vs swapped-realistic. SEES-ZEROS if
  shuts on zeros (>0.5) but not swaps (integration OK, signal too subtle);
  BLIND-EVEN-ON-ZEROS → halt Wave-C, audit full-step integration first.
- B4 ME-collision (02): best filed trunk (u34-c1, s2: highest accTwo), Symmetric
  vs Colliding sets. PASS if Δ≤0.02; FAIL if Δ≥0.05; else FINAL-INCONCLUSIVE:
  arm stays gated-shut (no prereg drafted) but not DEAD; a future prereg may
  probe with a DIFFERENT instrument, never re-sample this probe (no re-runs,
  no tuning). PASS keeps remap diet gated-in; FAIL kills 02. [P1b]
- B5 bottleneck audit (13): frozen U33-canon P, vote-head entropy over N rows.
  BIASED if entropy < log(4)−0.3 (productive arm stays gated-in with new
  machinery noted); else UNBIASED → 13 arm INAPPLICABLE-as-instantiated.
- B6 shortcut slope (09): per-row correctness u34-c1 P vs u34-c0 P, regressed
  SEPARATELY per seed (R=3, N=1000 rows each); COMPRESSION if slope<1 with 95%
  CI excluding 1 on ≥2/3 seeds (quorum; single-seed outlier passes rejected).
  Architecture track forced on corroborating A7-LEAK; else LINEAR (09 kernel
  theory falsified). [P1c]
- B7 gain-surprise rho (05): row-level rho(|PE|, 1−margin) on frozen U36-c1 P.
  DISSOCIATED if rho<0.9 (replay arm stays gated-in); else COLLAPSED (05 dead).
- B8 disagree-LP (03, runs only if A1 LIVE): per-family gain
  (loss(P0)−loss(P) on family rows) vs vote-disagree rate, 3 fams × 3 seeds ×
  2 arms = 18 pts. SIGNAL if |r|≥0.4 (bandit stays gated-in); else NOISE.
  Gate is one-way: A1-FLAT skips B8; B8 never feeds back into A1. [P1e]

## Wave-C — D5 gate-only trains (the ONLY trains; trunk FROZEN from u38-c1 P)
New ledgers: d-newai-self-u39-d5-{a,b}-s{seed}.json (6 trains, no trunk backward
pass, ~1–2 min): (a) 12.5% mismatch, (b) 50% mismatch. Gate-only params from
filed P. Bars: (b)-shuts-(a)-doesn't → pressure-ratio cause → license
mismatch-curriculum prereg. Neither shuts → read B1/B2 for signal-vs-pressure.
(a)-shuts-frozen-but-joint-didn't → co-adaptation → license staged prereg.
B3 BLIND-EVEN-ON-ZEROS halts Wave-C before any train.

## Verdict + licensing
d-newai-self-u39-verdict.json: per-probe PASS/FAIL/INAPPLICABLE/INCONCLUSIVE +
license table mapping each of the 12 debate arms to ADVANCE (may draft prereg) /
DEAD / INAPPLICABLE, with the exact gate outcome cited. Quorum 2/3 wherever
seeds apply. No tuning to reviewer outputs at any point; gray zones file as
INCONCLUSIVE, never re-run.

## Bars recap (all pre-filed, numeric)
A1 8/12 curves |slope|>1e-4 · A2 mean slope>1e-4 · A3 |r|≥0.4 · A4 ratio<1 ·
A5 |r|≥0.4 · A6 CV>0.2 · A7 single-feature>60% · B1 ≥0.65 · B2 Δ≥0.03 + shut>0.2 ·
B3 shut>0.5 · B4 Δ≤0.02/≥0.05 · B5 ent<log4−0.3 · B6 slope CI excl 1 · B7 rho<0.9 ·
B8 |r|≥0.4. D5 per decision tree above.
