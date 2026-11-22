# Decomposition + re-decomposition v1.0 (user-ordered 2026-11-22; agent approval: this file)

## What do I want to find out
(1) Does a 1-hop-trained tutor ATTEMPT a genuine 2-step breakdown of a harder
2-hop puzzle (resolve-then-follow through its own weights), and does trying
beat the flat reflex? (2) When its own critic says step 1 "doesn't look
right", does RE-BREAKING (ordered fallback list) beat staying with the bad
breakdown? Solving is NOT required: the measures are attempt structure and
re-attempt value, with final accuracy as scoreboard.

## Research check
In-repo only: tinynn attn stack (trainModel/AttnModel), assocR format
(keys 0..3, values 4..7, Q=8). Proceeding.

## Design
LINES (vocab 9, same tokens as assocR): two chains + optional extra distractor
pair, shuffled: (a,m) (m,4+e) (c,d) (d,4+f) [+ (g,4+h)], then [a,Q].
Answer e. Mid tokens m,d are keys (0..3) in value position: OOD vs 1-hop
training — that IS the "harder". True mid of query chain = m.
TUTOR (per seed s in {0,1,2}): AttnModel h48/m96/d16, trained on 1-hop
assocR 1..3 pairs (500 ex, steps=1200, batch 16, attnAux on). GATE: fresh
1-hop test acc >= 0.60 (200 lines) else ABORT that seed (can't resolve step 1
of anything; finding, not failure).
SUB-STEP EXECUTION (all through tutor weights): subquery(k) = forward
[pairs..., k, Q] -> top-1 class + margin (logit top1-top2).
ARMS (per test line, 240 fresh lines/seed; cal 120 separate lines/seed):
- DIRECT: forward [pairs..., a, Q] -> answer. The flat reflex.
- DECOMP-1: sub1 = subquery(a) -> m1; sub2 = subquery(m1) -> answer.
- STAY: DECOMP-1's answer always (even when critic fires).
- SWITCH: if critic FIRES on sub1, re-break via fallback list, else STAY.
  Fallbacks (fixed order, first with final-margin >= tau wins, else STAY):
  F1 follow runner-up: subquery(m1') where m1' = sub1 runner-up class;
  F2 DIRECT answer; F3 other chain: subquery(c) -> d1, subquery(d1).
  If none clears tau, keep DECOMP-1 (honest stay).
- FORCE: fallback-list result ALWAYS (critic ignored). Tests critic value.
CRITIC: fires iff sub1 margin < tau; tau = 33rd percentile of sub1 margins
on that tutor's cal split (preregistered rule, unsupervised: no labels).
BARS (preregistered):
- B1 (tries): sub1 top-1 == m rate > 0.25 (chance 1/4), 3/3 tutors.
- B2 (re-break helps): SWITCH-STAY final-acc > 0 on critic-fired subset,
  paired by line, 3/3.
Descriptive: DIRECT vs DECOMP-1 (Q1 second half); critic precision (fired &
actually wrong / fired); FORCE vs SWITCH (critic value); sub2 accuracy given
correct sub1 (follow-through).

## Expectation (scored at verdict)
B1 PASS 3/3 (1-hop skill transfers to resolving a); B2 PASS 3/3 (fallbacks
recover genuine misroutes; F1 catches near-miss mids).

## Pre-mortem
Strongest objection: sub1 may sit at chance (key-valued pairs too OOD) ->
critic fires always -> SWITCH ~= random second try. Answered: priced as the
informative null ("can't decompose what it can't resolve"); B1 is the tripwire.
Most likely failure: tutor 1-hop gate trips (training too short) -> lengthen,
filed openly, no silent retune (single pre-registered retry at steps=2400).

## Nearest-failure
F5 round-3 (differs: there the loop re-ran selection with no residual signal
and reverted; here the loop re-ROUTES the attempt structure on a per-line
critic, which is the accumulation F5 lacked).

## Cost
3 tutors x (1200-step train + 360-line evals) ~ 30-45 min, resume-safe
(tutor ledger, then eval ledger per seed).

## Ledgers
src/evidence/decomp/d-tutor-s{s}.json, d-eval-s{s}.json, d-verdict.json.
Driver: src/evidence/decomp/decomp-driver.js (own file; stack-load pattern
from p4-toy.js; trainModel in-worker).
