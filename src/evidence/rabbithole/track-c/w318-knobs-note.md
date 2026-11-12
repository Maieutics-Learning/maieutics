# Wave 318 note (execution; backlog-W270 minimal-knob set, sandbox)

STOP RULE: stopped after deterministic refits on regenerated w253 trials
(receipt deep-equal vs w253-grid.json; 8000 trials, same seeds). 1 direct
+ 1 tangential below. Spend: 0 search, 0 fetch. Clock: R50 4/5. Pre-reg
scored: (a) CONFIRMED-exactly (b) REJECTED, REFINED (c) REFINED (d)
REJECTED-informatively.

## Direct: 3 knobs suffice, the third one is free either way, one joint costs .35

(a): 3-bin {cap.6}/{cap.65}/{rest} fits {1,.04,0}, loss .0032, capture
1.001 — IDENTICAL to quintile and per-dep. 5->3 is FREE; the world's/N joints
are three, not five (.7/.75/.8 are all GO — one bin). (b): the .04 is NOT
distinct from noise by any honest bar: loss gap 6.25e-5 (one trial in
16000, 8x below the .0005 bar), split-half flips (odd .04 / even 0), dense
argmin a flat-bottomed interval [.04,.058]. Refined: .04 is the interval's
left edge, not a discovered constant — forcing 0 costs 6e-5 (nothing), so
the third knob is free to keep AND free to drop. (c) refined: argmin
[.04,.058] contains .04, excludes 0 and .03, extends past .05 — the
boundary is a plateau, not a point. (d): halves-by-cap {lo .2, hi 0}
capture .652 — beats index-halves .556 by only .096, nowhere near .9.
The lo bin re-contracts the SAME disease (mixing SKIP-optimal .6 with
.04-optimal .65 forces the .2 compromise again). Quantified joint price:
crossing even ONE joint (.6|.65) costs .349 capture (1.001->.652).
Updated coarseness price table: 40->5 FREE, 5->3 FREE, 3->2nat -.0035,
2nat->2idx -.001, 2idx->1pooled -.0017, tau->const -.0038.

Verdict: USED with teeth (sufficiency sharpened 5->3 + .04 demoted to
interval-edge + joint price quantified + receipt; two pre-regs corrected).
No precursor, no conflict.

## Tangential: count the joints, then prove each knob (0-spend)

The ladder now reads 40=5=3>2nat>2idx>1pooled>const — sufficiency stops at
three, and the third knob's value (6e-5) is two orders below the second
knob's (.0035). Rule: after counting joints (sufficiency), price each knob
(necessity) — a sufficient set is not a necessary set, and the cheapest
knob may be a rounding error wearing a tau. W287 runs the necessity audit
(leave-one-knob-out on the 3-bin set). Spawned W287 (knob-necessity: clamp
each bin to its next-best tau in turn — b6 1->0, b65 .04->0, rest 0->.04;
price per knob; retire-or-keep per knob; does the .65 knob survive 6e-5).
