# Focus-step v1.0: read the attention, not the output (user-countersigned 2026-11-22; agent approval: this file)

## What do I want to find out
Trace verdict: hop-1 (query-pass focus on the naming pair, ~45%) is invisible to
DECOMP-1, which grades hop-1 by its OUTPUT (at chance) — the protocol asks the
wrong port. Does a stepped protocol that reads hop-1 FOCUS (argmax query-pass
attention at the query position → that pair's key → subquery it) beat
output-based DECOMP-1 on the SAME weights? This flips the decomposition
program's headline without retraining anything.

## Research check
In-repo only (filed B tutors; R=3 rolls baked in; N=300/roll). Proceeding.

## Design
LINES: hard lines (genProbeLine structure; pairs known). ARMS: filed B tutors
(b x s0-2; primary) + AB tutors (descriptive short-circuit cross-check; A-arm
out of scope — all-chance, filed reason). R=3 rolls (streams 17300+s+r*500).
PER LINE (4 forwards, caches reused):
- DIRECT: fwd(flat,a)->e? (forward F_a gives output + query-pass att).
- DECOMP-1: m1 = argmax-out(F_a); o2 = fwd(flat,m1)->e?
- FOCUS-1: pF = argmax query-pass att at query position (steps[qp], qp=flat
  length; att over flat positions 0..qp-1); kF = pair-key of pF
  (pair idx floor(pF/2) into the KNOWN pairs array — filed mapping); oF =
  fwd(flat,kF)->e? If kF==a the step is a no-op re-query (honest, counted).
BARS (B-arm, roll-means, preregistered):
- F1 (focus beats output): mean(FOCUS-1 − DECOMP-1) > +0.05, paired per line,
  quorum 2/3 seeds. (N=300/roll x3: SE of paired diff ~= 0.02; +0.05 is real.)
- F2 (focus is faithful): mean P(kF in {a,m}) >= 0.55, quorum 2/3.
  (Focus must land in the true chain more often than not; trace qTrue 0.61-0.64.)
Descriptive: dissociation P(kF != m1); FOCUS-1 vs DECOMP-1 | dissociation;
AB FOCUS-1 (predicts smaller/no lift — AB's failure is output short-circuit,
and its focus is muddled 0.39-0.52); kF==a no-op rate.
VERDICT: FOCUS-WINS (F1+F2) / FOCUS-FAITHFUL-BUT-USELESS (F2 pass, F1 fail —
sees the chain, can't use it) / FOCUS-BROKEN (F2 fail — trace qTrue didn't
survive the pair-key mapping).

## Expectation (scored at verdict)
F1 PASS (~+0.08: focus carries hop-1 info the output drops; lift concentrates
on dissociation lines). F2 PASS (~0.60). → FOCUS-WINS, 65%.

## Pre-mortem
Strongest objection: kF==a no-op rate is high (focus lands on (a,m) tokens ->
key a -> re-query = DIRECT; FOCUS-1 ~= DIRECT by construction, lift over
DECOMP-1 is just DIRECT-vs-DECOMP-1, not focus magic) — answered: report the
no-op rate and FOCUS-1|kF==m (genuine step) separately; if lift comes only
from no-ops, file FOCUS-FAITHFUL-BUT-USELESS with the decomposition done.
Most likely failure: FOCUS-1 ~= DECOMP-1 (focus selects the pair but subquery
of its key adds nothing over output-mid subquery — the pipeline is
output-bound after all; filed).

## Nearest-failure
assembly-v11 DECOMP-1 (differs: mid = argmax OUTPUT; here mid = argmax FOCUS
key — same weights, different port).

## Cost
6 x 3 rolls x 300 lines x 4 forwards (h48) ~ 22k forwards ~ 10 min, resume-safe.

## Ledgers
src/evidence/decomp/d-focus-{b,ab}-s{s}.json (reps + means + paired diffs),
d-focus-verdict.json. Driver: assembly-driver.js (runFocusEval).
