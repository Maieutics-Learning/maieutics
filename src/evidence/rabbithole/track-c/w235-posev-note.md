# Wave 235 note — backlog-W201 positive-EV hybrid (sandbox, executed)

STOP RULE: stopped after 4-pT x 3-cap x 4-gate x 6-seed x 9-arm grid (288 worlds, 400 cases) + gate/m breakdowns. 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (w184 rig verbatim + pT param). Clock: R36 4/5.

## Direct: the crossing is a meter crossing; pT only scales the margin

Best-hybrid(k0,m.6) minus abs0 by (pT, cap): cap.6: +.0025(12/24)/+.0078(13/24)/+.0156(20/24)/+.0239(24/24); cap.7: −.067/−.062/−.054/−.046 (all 0/24); cap.8: −.126/−.121/−.113/−.105 (all 0/24). Retrieval beats abs0 only at cap.6 (3–6/24) and never beats hybrid.
- The gate is FPR=0, not EV>0: hybrid wins iff the meter lets through (almost) no fps (cap.6/m.6, FPR≈0) — at EVERY pT including .55 (EV −.125, where it merely ties +.0025). At cap.7/.8 (FPR .28/.43) hybrid loses at ALL pT including .8 (EV +.95) — per-tp gains can't cover fixed fp volume. Treatment EV buys the SLOPE (+.002→+.024 across pT), the meter buys the SIGN. W215's "worth asking only where EV>0" refined: worth asking only where EV>0 AND FPR≈0.
- Pre-reg: (a) pT=.55 ≤ abs0 — tie (+.0025, 12/24), CONFIRMED-soft; (b) pT=.6 clean win +.01–.03 — direction ✓ magnitude miss (+.0078, 13/24); cap.8 loses ✓; (c) pT=.7+ everywhere-but-heavy — REJECTED (0/24 at cap.7/.8); retrieval<hybrid ✓; (d) crossing .55–.6 — REFINED: ties .55, lean .6 (13/24), clear .7 (20/24), solid .8 (24/24).
- bestM = .6 in all 12 (pT,cap) cells (monotone — stricter always better); gate-t nearly irrelevant given m=.6 (t≤.5 identical by construction — treated set is s≥.6 regardless; internal-consistency receipt). Open corner (spawned, not built): m>.6 at cap.7/.8 — FPR→0 there should recover the crossing by the cap.6 logic; optimal-m ridge unmapped.
- Owned omission: k*-with-value not computed (needs kappa grid; totals decide the crossing without it — deferred, not dropped).

Verdict: USED with teeth (gate-vs-scale split + refined crossing + open corner named). No precursor, no conflict.

## Tangential: name the gating axis and the scaling axis (0-spend, reasoning only)

A 2D crossing map with symmetric axes invites "more of either helps" — wrong here: no amount of pT crosses a dirty meter, while any pT crosses a clean one (margin scales). Whenever a map has a gate (necessary condition) and a scale (margin modulator), the headline names the GATE ("hybrid wins iff FPR≈0, margin grows with pT") — headlining the scale ("higher EV favors hybrid") prescribes cranking an axis that can't cross. Audit forward: every crossing map labels gate vs scale.

## Spend / queue

- Spend: 0 + 0 + 1 grid (288 worlds x 9 arms; floor). Consumed backlog-W201 removed; spawned W218 to BACK. Backlog 17. Synthesis R36 clock: 4/5.
- W218 (C, sandbox): high-m corner — m {.7,.8,.9} x cap {.7,.8} x pT {.7,.8} (FPR→0 at high caps recovers crossing?); optimal-m ridge per (cap,pT); kappa-grid for k*-with-value.
