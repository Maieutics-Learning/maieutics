# Wave 238 note — backlog-W203 length-matched lottery probes (bench, executed)

STOP RULE: stopped after 48-run grid (attn h16 auxW{.5,1,2,3} x seeds 7-18; l80 traj {100,200,400} + endpoints). 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (w186 rig + length traj; live-page TinyNN). Clock: R37 1/5.

## Direct: jackpot shows by 400, not 200; the rate curve is lottery noise

Bit-replication first: auxW1/2 endpoints match W217 seed-for-seed (same five auxW2 jackpots .985/.995/.76/1/.88; auxW1's lone 1.0) — rig sound, everything else is signal.
- Jackpot-rate curve (l80≥.75): .5→4/12, 1→1/12, 2→5/12, 3→2/12. NOT monotone (pre-reg (b) REJECTED) — and it kills W217's bonus claim with its own data: 1/12-vs-5/12 at n=12 is p≈.07 lottery noise, and the fresh arms (.5: 4/12 beating 1: 1/12) prove the ordering is seed-luck. Jackpot rate is lottery-dominated at n=12 (se≈13pp); rate claims need lottery-sized n.
- Early-at-length, both-audits gate (ratio ≥2): l80@200≥.8 → P(feat|J) .583 vs P(feat|F) .306, ratio 1.91 — FAILS by a hair (5/12 jackpots arrive late: .51–.68 at 200 → .97–1.0 at 600). l80@400≥.8 → 1.0 vs .083, ratio 12 ✓ PASSES. The length grok window is 200–400 (later than ignition's 150–300) — length-matched features exist, just one window later. W198's predictor feed: use l80@400, not @200. Pre-reg (a) mistimed, not wrong.
- l10 blindness replicates (meanJ .999 vs meanF .987) — third sighting, still blind by construction.

Verdict: USED with teeth (exact replication + rate-kill + timing refinement + blind-3x). No precursor, no conflict.

## Tangential: rate claims need lottery-sized n (0-spend, reasoning only)

Counts over lottery outcomes (1/12 vs 5/12) read as effects but test as noise — Fisher p≈.07 wouldn't ship as a finding anywhere else on this trail, yet "aux promotes jackpot rate" shipped as a bonus line. Rule: any claim whose numerator is a lottery count ships with n≥32 or pooled-seed CIs, or ships as a flag (W232's format). Jackpot-rate questions are lottery questions; bench them at lottery scale or don't ask.

## Spend / queue

- Spend: 0 + 0 + 1 grid (48 runs; floor). Consumed backlog-W203 removed; spawned W220 to BACK. Backlog 17. Synthesis R37 clock: 1/5.
- W220 (A, bench): jackpot-timing + rate-power — l80@{300,400,500} trajs to pin the length grok window; jackpot-rate at n=32 for auxW{.5,2} (is 1-vs-5 real?); l80@400-feature predictor feed for W198's pipeline.
