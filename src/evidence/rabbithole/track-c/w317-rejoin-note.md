# Wave 317 note (execution; backlog-W269 cap-above-m rejoin, sandbox)

STOP RULE: stopped after 144-world grid (cap{.9,.95,1.0} x pT{.7,.8} x
t{.65,.5,.35,.2} x seeds 7-12 x MS+{.95}; cap.9 receipt EXACT vs w252 incl
kstar/nulls). 1 direct + 1 tangential below. Spend: 0 search, 0 fetch.
Clock: R50 3/5. Pre-reg scored: (a) CONFIRMED (b) REJECTED-as-stated,
REFINED (c) REJECTED-informatively (d) REJECTED (e) REJECTED-clearly.

## Direct: the blindness moves up one rung; rejoin costs ~.02

Rejoin is real (a): diff(m.9) +.0029/+.006 at cap.9 -> -.0237/-.0206 at
cap.95 (moves .027, 5x the bar) — but the sign is the story: retrieving
the rejoin slice s in [.9,cap) LOSES ~.02 (non-harmed v=1 -1s outweigh
harmed pT gains). The rejoined arm does not retake the ridge (c rejected):
m.85/m.9 win 0/24 everywhere new, diffs -.02 to -.08. Instead the winner
is the NEW blind: m.95 at cap.95 (diff +.0004/+.0015, wins 8/24 + 12/24 —
thin but genuine, same structural seat m.9 held at cap.9: blind on
non-harmed, retrieving only harmed s>=.95). Identity (b): m*==cap SURVIVES
at cap.95 (.95/.95 — letter again) and stalls at 1.0 (ridge .95/.95, 2/4
not 3/4): the ceiling-blindness returns exactly one rung up. At cap 1.0
the ridge is least-loss, not winning — NO arm beats abs0 in any of 48
worlds (all wins 0/24); m.95 is merely the least-negative. Thin-slice tie
(d) never comes: |diff(m.9)-diff(m.95)| = .022-.024 at BOTH caps — the
slice is decisively negative, not neutral; the split stays split, no
tie-split return. k* (e): ridge kMed +.42/+.43 (cap.95) and +.55/+.52
(cap1.0) — the new ridge is PRICED, steeply (cf W297's +.04 pT.7 relic).

Verdict: USED with teeth (4 rejections, all upgrading: blindness-ladder,
costly rejoin, least-loss ridge, priced k* + exact receipt). No precursor,
no conflict.

## Tangential: watch the seat, not the sitter (0-spend)

Three caps, three blind winners (.85-lived/.9-blind/.95-blind; now .95
blind/1.0 least-loss): the argmax identity m*==cap survives two rungs by
changing WHO sits in it (live -> blind -> blinder). A persistent identity
with rotating mechanisms is the phase-change-in-continuity-costume from
W297's tangential, now with three sightings. Rule: when an identity
survives a boundary that should kill it, enumerate the seats (structural
positions), not the sitters (arm labels) — the ladder moves, the arms
don't. The k* pricing (+.04 -> +.43 -> +.55) is the seat-meter: each rung
up costs more abstention-insurance. W286 continues the ladder (MS+{1.0} at
cap1.0: does m1.0 blind-win, ridgeM=1.0; k*-vs-cap pricing monotonic?).
Spawned W286 (blind-ladder continuation + k* pricing curve).
