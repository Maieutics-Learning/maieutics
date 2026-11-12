# Wave 311 note (execution; backlog-W264 combo-jurisdiction probe, sandbox)

STOP RULE: stopped after jurisdiction grid (combo-2.5 frozen + old rule +
flat-2.5 at N{10,40} x M{180,720} x match{.05,.15}; receipt maxDiff 0 vs
w247; 8 cells). 1 direct + 1 tangential below. Spend: 0 search, 0 fetch
(vendored w247 verbatim). Clock: R49 3/5. Pre-reg scored: (a) CONFIRMED
(b) CONFIRMED-exceeded (c) MOOT (d) CONFIRMED.

## Direct: single-k extrapolates both directions; jurisdiction is 8/8

Combo-2.5 holds FA<=.05 in 8/8 cells (max .033) — N=10 interpolation 4/4
(a), N=40 extrapolation 4/4 against a >=3/4 bar (b). The noisiest cell
(match.15-N40-M180) holds at .010, so (c)'s predicted break site does not
break — jurisdiction extends past N=40 on current evidence. Old rule holds
6/8 (both holes at N10-M720: .087/.1 — kOld=1.633 under-covers when M is
large relative to N); flat-2.5 holds 6/8 (both holes at N40-M180: .083/.087
— at large N the deployment term vanishes and burn-in noise rules, which
flat ignores). The two rivals fail in OPPOSITE corners: each covers one
noise term and is exposed by the other. Combo covers both, hence 8/8 —
jurisdiction ends exactly where a single-term margin meets the term it
omitted. DET (d): combo within -.05 of old on 6/6 valid-old cells, and in
fact combo >= old in ALL six (+0/+.144/+0/+.003/+.26/+.013) — validity
costs nothing here; the +0.26 (match.15-N40-M180) is reallocation again,
same signature as W291's +0.146.

Verdict: USED-strong (bidirectional extrapolation + rival-corner autopsy +
zero DET cost + receipt). No precursor, no conflict.

## Tangential: rivals failing in opposite corners is the form's certificate

When two single-term rules each fail exactly where the other's term
dominates, the two-term form is not overfitting — it is the minimal form
that has no exposed corner. Stop hunting for a third term until a cell
breaks combo; the next probe (W281) goes looking for that cell at N{2,80}.
Spawned W281 (extreme-N probe: N{2,80} x M{180,720} x match{.05,.15},
combo-2.5 frozen + old + flat; does FA break at N=2 (dep noise dominates)
or N=80 (BI noise dominates); which rival corner widens).
