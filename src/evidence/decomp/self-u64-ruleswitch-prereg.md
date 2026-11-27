# U64-RULESWITCH (E-NE0) prereg v1.0 — rule-switch diet + oracle cheater vs dumb dice

**Track:** U64 (success-recipe step 1; answers gap-analysis §7c + U52 P1a: is there anything unexpected
to detect, and does detection buy anything at all).
**Cover:** user 2026-11-26 "Draft the prereg and I am pre-countersigning them" = this prereg + 10x battery
+ driver + Waves 0-2 + per-wave 10x reviews (full-pipeline cover). U65–U69 batteries run under the same
cover; their COMPUTE is additionally gated on the stage-gates below (U64 verdict for U65/U67/U68/U69;
U65 verdict for U66). NO PUSH without order.
**Lesson encoded:** U60's regime rotated on a FIXED schedule per trunk — a clock, not a surprise — and
U50's rotating quarters kept the SAME hot sets every run. Nothing was ever unexpected, so no detector
could matter. This wave randomizes the RULE per run (order + hot sets) and asks the strongest possible
cheater (perfect switch timing AND perfect new-hot-set knowledge) to beat dumb constant dice. If even
the cheater can't, the task doesn't need a detector — kill the line honestly instead of building one.

## Design (all filed, deterministic per seed)
- Rule per seed (world-identical across arms): ruleRng `G.makeRng(64000+seed)`: hotSeq[4] drawn from
  the 6 qk-pairs [{0,1},{0,2},{0,3},{1,2},{1,3},{2,3}] with adjacent-differ (redraw ≤20 tries, else
  accept); boundaries b=[200±40,400±40,600±40] via ruleRng.int(81)−40. Quarter of step s:
  s>b[2]?3:s>b[1]?2:s>b[0]?1:0. 3 true switches per run. qk domain is {0,1,2,3} (U50 D1 probe).
- Diet per slot (U50 fractions verbatim): r=dataRng.int(8): r<6 familiar (W6 two-branch base
  `ub?inSeqGenShift(dataRng,0):inSeqGenShift(dataRng,null)`, rejection-sample qk in hotSeq[q] ≤10
  tries); r==6 OOD (qk!=v); else uniform. Base draws EXACT W6 two-branch; labels never relabeled.
  Per (seed,arm) dataRng `G.makeRng(42000+seed*104729+55+armCode)`, armCodes {det:101,dice:102,
  orT:103,orF:104,shT:105} (U50 convention; rule identical across arms, draws differ by code).
- Arms (5×20=100 trains, 800st H48/B16/lr5e-3/K5/C6/auxW0.5/lam2.0, u43ScoreRow/u43StaticSlot verbatim):
  det (pick-max s*n, no reset); dice (softmax T=0.5 via u46Pick stoch, no reset — dumb dice);
  orT (pick-max, reset qkCount at the 3 TRUE boundaries — timing only); orF (reset at true boundaries
  + restrict picks to qk in TRUE hotSeq[q], fallback unrestricted pick-max if none — full cheater);
  shT (pick-max, reset at 3 SHUFFLED steps from shRng `G.makeRng(65000+seed)`, 3 distinct steps in
  [50,750] — same intervention count, random placement; P2a timing control).
- Metrics: outcome `two` (U50 eval verbatim: same streams 52500/52400+seed, masks 91000+seed, N=200
  stationary — numbers comparable across studies); adapt-speed = mean hot-pick rate over the 50 slots
  after each true switch (orF ≈1.0 by construction — verify, don't assume).
**Bars (quorum 15/20):**
- ORACLE-EDGE (kill-gate): orF.two ≥ dice.two+0.03 AND orF.adapt ≥ dice.adapt+0.10 at quorum → PROCEED.
- TIMING (diagnostic, no quorum): orT vs shT outcome direction (expect orT≥shT; if reversed, timing is
  not the active ingredient — file as constraint on U66, verdict unchanged).
- Floor: max arm two <0.45 on ≥6/20 seeds → INCONCLUSIVE. PIN (stack literal
  258d2f060684ce382778e203959ab791abb5df79af174deef19ff568886d4d6e on every ledger) fail → HALT.
**Waves:** 0 (PIN + 15 twins (5 arms×3 seeds) + rule-identity across arms + diet-fraction sanity +
  oracle/shuffled determinism + dry-run timing, COMPLETE-gated); 1 (100 trains COMPLETE-gated);
  2 (100 evals + verdict).
**Verdicts:** PROCEED (licenses U65 detector + U66 consumers + U67/U68/U69 tracks) / KILL-LINE (cheater
can't beat dice — task needs no detector; U65–U69 CANCELLED, close honestly) / INCONCLUSIVE /
PIN-FAIL. Filed expectation (not a bar): orF clears both bars (perfect information should win
somewhere); dice beats det (U50 shape); orT between dice and orF.
**Falsifiers:** hot-pair universe change needs a new prereg; ±40 jitter change after Wave 0 needs a
new version + battery + countersign; threshold moves post-data forbidden (anti-tuning rule).
