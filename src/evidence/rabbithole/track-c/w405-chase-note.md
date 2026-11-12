# Wave 405 (execution; backlog-W342 s2-mid pursuit, sandbox) 2026-11-12
STOP RULE: stopped after s2-to-64000 extension + per-kink 64k ladders +
[16000,64000] bisection (receipts clean). 1 direct + 1 tangential below.
Spend: 0 + 0 + run. Script scratch/track-c/w342-chase.js (rig 102/102
line-verified from w325-tape.js); grid scratch/track-c/w342-grid.json.
WIND-DOWN: no spawn (backlog drains 9->8).

## Direct: the escapee is caught at 29594 — Bp-side, unanimous at 64k

- RECEIPT: s1/s2 ext replay exact (8/8 atKink+zone vs w325-grid, same
  brng 930002 order) + stream-prefix integrity (first 16000 of the 64000
  tapes bit-identical to the fresh 16k rebuild, driftAt + all 200 uniforms
  — the extension lengthens the stream, never rewrites it).
- (a) PASS: s2-mid.0071 N* = 29594 — caught inside (16000,64000], barely
  past halfway. The ">16000" pointer resolves to a number; the budget
  re-pins at 29594 (with s3's 15516 and s1's 10583 beneath it).
- (b) PASS: the other three s2 kinks read atKink = 1.0 at 64k — unanimous,
  no wobble. Exactly one escapee per stream, again (s1's four were 0–.048
  dead at 16k; s2's three non-mid are 1.0 decided at 64k).
- (d) PASS: N* resolves Bp-side — the 16k lean (1−.238 = .762) consolidates
  to certainty (64k pA = [1,1,1,1,1,0,0,0,0,0,0], cross −2.184, a step at
  the kink). adaptK15 owns the mid-regime at depth; the contest was a
  sample-size question, not a direction question.
- Verdict: USED with teeth. Caught escapee (29594) + unanimous others +
  Bp consolidation + double receipt. NO SPAWN (wind-down).

## Tangential: extensions end with a number or a pointer, never a shrug (0-spend)

The wave was chartered as "does it die ≤64000" — it dies at 29594, and the
three bystanders read 1.0, so there is no residual ">64000" anywhere in
s2. Rule: an extension wave closes its own charter in the verdict (pinned
N* + decided bystanders = closed; any ">window" remainder = the next
wave's address, named explicitly). No open pointers left in s2.
