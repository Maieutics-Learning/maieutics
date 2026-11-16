# ix arc post-mortem (2026-11-16, user-ordered; closes the chapter)

Question that opened the arc: can a probe reading raw brain weights predict
per-line fate on fresh brains — doubt beyond suspicion (1−top1)?

## What we tried

1. **ix meta-probe, PILOT-FAIL** (prereg v1.5 frozen; 24 fresh brains,
   MLP-64, 5 seeds): held-out pooled 0.4936 (bar 0.60), win-rate 0/8 (bar 5/8).
   Suspicion on the same lines 0.8598. Train reached only 0.809 (underfit, never
   memorized). No full-96. Verdict frozen, untouched by everything below.
2. **W1/W3 why-diagnostics** (quarantined): frozen probe on SEEN brains' novel
   lines 0.763 → machinery adequate, wall is cross-init transfer. Final−init
   deltas 0.4606 → init noise ruled out as mask.
3. **x-ablation** (10 fresh-eyes batteries, COMFORTABLE v0.10): lines-only (A)
   vs weights-only (B/Bc) arms, 20/20 seeds @30 epochs. Eval HALTed on B-perm
   null 0.6562; re-calibration proved the switch miscalibrated (effective N≈15
   not 3000; false-trips on 67% of true nulls; trip = ordinary max-of-201).
   HALT stands as filed outcome; diagnosis = false trip.
4. **Red-team battery on the conclusions**: false-trip claim HOLDS; weights
   scalar HOLDS descriptively (0.761, rho 0.87); two-sources/latching PARTIAL;
   A-decides ACCEPTED as hypothesis → resolved by run B.
5. **Run B** (user-authorized): A pooled 0.4851, honest CI covers chance,
   underperforms shared-difficulty floor strictly (Δ −0.06) / ties it honestly.
   Lines dead, strong form. W1 (0.763) was quality-stamping all along.
6. **Sign-flip** (user-authorized): oracle per-brain flips confirm the mirror
   axis (0.13→0.87, 0.12→0.88, 0.15→0.85; mean ~0.73) — fingerprints are
   sign-ambiguous, not absent. Cheap path (k=10/20/40 ref lines) dead
   (0.527/0.549/0.424; ref sign estimates are noise). Oracle POOLED 0.4824:
   cross-brain score scales are incompatible, pooled metric blind to per-brain
   fixes — grade interpreter tests per-brain, never pooled.
7. **Run C** (user-authorized): validation 0.7633 == W1. No-lines 0.7585
   [0.652,0.831]; no-weights 0.5465 [0.470,0.623] covers chance. Latching
   DEMONSTRATED, C4 closes: the joint probe rode the weights margin.
8. **Suspicion boundary** (run-C follow-up, quarantined observation):
   suspicion on killHu seen-brains = 0.5572 pooled; anti-predicts where brains
   are systematically wrong (0.32–0.43 on 120–170 errors), works where
   competent (0.63–0.81). ALL previously filed wins (0.86–0.93) were
   killHd/killA — killHu never measured until now. Bit-identical reproduce
   from filed script. Needs mini-prereg before paper claims.

## What we learned

- The mapping dials→fate does not survive fresh starts (Observed). The failure
  is structured — mirror basins, sign-ambiguous axis — not noise (Verified
  per-brain, refuted pooled).
- Lines carry nothing beyond shared difficulty ~0.54 (Verified); the A-arm
  could not even reach the floor (Observed).
- Joint training latches onto one margin and stops (Demonstrated): W1 ≈ B,
  masking proves it. A joint number is not evidence of joint use.
- Suspicion ranks occasional errors, inverts under systematic error
  (Observed, quarantined): it is regime-bound, not universal. The
  confident-wrong student (s313) was the warning, killHu is the confirmation.
- Methods, paid for in full: single-draw nulls + line-level CIs miscalibrate
  (adopt cluster AND multi-draw); pooled AUCs hide per-brain structure
  (grade interpreter claims per-brain); validation gates (bit-exact recompute
  before belief) caught zero bugs but certified four pipelines.
- Nothing beats suspicion at ranking within its regime (Verified, 0.86–0.93
  across vii/v/ix). Every rival was graded as a replacement detector and died
  as one — including, in hindsight, tests that should have been graded as
  challengers or interpreters (Inferred; the arc's own conflation, owned).

## What it means for the future

- ix stays CLOSED (frozen PILOT-FAIL + why-diagnostics + latching; no revival
  without a new prereg version). The mechanistic story is complete.
- Detector track: suspicion stands champion in the competent regime; its newly
  found boundary (lost-regime inversion) needs a mini-prereg, then paper
  paragraphs (1.e).
- Challenger track (user's original intent, never run): side-net predicting
  P(correct | weights, line, suspicion), graded on calibration gain per brain
  on fresh brains — the "less sure when wrong" function. Needs mini-prereg.
- Interpreter track (user's original intent, partially evidenced): weights
  carry a real coarse signal (brain-quality thermometer 0.761, seen brains)
  plus a sign-ambiguous fine axis (~0.73 oracle per-brain). Disambiguation is
  the hard path (unsupervised mirror detection / basin alignment), graded
  per-brain. Needs design before compute.
- Standing rules into the next arc: no pooled grading of per-brain claims;
  cluster-plus-multidraw nulls; validation-gate recomputes; scripts in src/
  with artifact maps; layer-5 transcripts of the deciding discussions.
