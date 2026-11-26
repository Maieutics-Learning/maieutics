# U60c-TRACE (E-NE2c) prereg v1.0 — slow surprise-trace whiteboard (answers U60b)

**Track:** U60c (detector line; U60b proved the fast carry won't hold quarter info even priced:
elevation without encoding, 0.313 vs 0.25 chance. The channel, not the price, is the problem).
**Cover:** user 2026-11-26 "write up then compute U60b, then U60c" (full-pipeline cover for U60c:
this prereg + 10x battery + driver + Waves 0-1 + per-wave 10x reviews). NO PUSH without order.
**Lesson encoded:** stop asking the fast whiteboard (8-dim carry, wiped every row, shared with the
task) to remember the week. Keep a SLOW whiteboard instead: a running average of surprise over
~50 rows. Regime switches change the hot set → transient difficulty spikes → the slow trace jumps
at boundaries architecturally, with zero learning required. This tests whether the information is
available to a patient reader even though the fast channel won't keep it.

**Design (reads-only, ZERO new trains):**
- Reuse frozen trunks verbatim: 20 filed U60 regime trunks + 20 filed canon trunks (reads-only;
  battery ratifies reuse — else halt).
- Operator (new, filed here): per-row surprise d = curVoteDisagree(fw2.logitsK) (round-2,
  context-informed uncertainty) on probe streams; slow trace z ← (1-α)z + α·d with α = 0.02
  filed (horizon ~50 rows; single value, no sweep). Metrics mirror B'' structure: (a) QV-Z =
  quarter-variance of quarter-mean z on clean-rot streams (same quarters/boundaries as MANIP);
  (b) ZB-resp = boundary-break response = mean over 3 boundaries of (z[bb+10] − z[bb−10]) minus
  matched in-quarter baseline (same construction as B''). STAT control: clean-stat ZB-resp
  reported (expect ~0 — no quarters, no switches; diagnostic, no quorum).
- No new weights, no stack change (trace is driver bookkeeping over frozen forward passes).
**Bars (quorum 15/20; significance is 2SE-only — NO fixed-tolerance trip on this track):**
- Z-GUARD: regime QV-Z > canon QV-Z band max (canon band computed same operator on filed canon
  trunks in Wave-0), 15/20; else Z-ABSENT, do NOT interpret spike.
- Z-SPIKE: regime ZB-resp ROT positive at 2SE, 15/20.
- Z-POWER diagnostic (report only, NO trip): fraction of trunks with ZB-resp 2SE > 0.25.
  Justification (battery must ratify): new channel, unknown scale — a 0.25 trip would be tuning.
  The U58/U60 discipline (fixed tolerance) is why those lines read UNDERPOWERED; importing it
  here would prejudge an untested scale.
- Z-PIN: stack + ledger identity on every read.
**Waves:** 0 (load-check + twin determinism of trace + operator crash-test on canon t0 +
canon-band computation + dry-run + timing, COMPLETE-gated); 1 (trace probes on 40 frozen trunks
+ verdict, COMPLETE-gated).
**Verdicts:** Z-MARKS (guard + spike at quorum => slow channel marks regime; licenses trace-gated
consumer design); Z-PARTIAL (guard only => difficulty differs by quarter but no switch snap);
Z-ABSENT (guard fails => not even a patient reader finds it — detector line dead on this diet);
PIN-FAIL guard.
**Filed expectation (not a bar):** guard passes (difficulty differs by quarter); spike uncertain
(switches are predictable rotation — surprise may or may not jump). Report either way.
**Falsifiers:** α single filed value; d = round-2 disagreement only (round-1 variant needs its own
prereg); threshold changes after Wave 0 need a new version + battery + countersign.
