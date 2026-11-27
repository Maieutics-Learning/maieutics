# Premise artifact U64e v1.3 (frozen 2026-11-27; re-close scouts read THIS)

v1.2 premise + red-team rulings (10 claimed kills → 5 adopted, rest rejected with
derivations; details in
`reviews-u64e/fresh-eyes-self-u64e-v3-red-results.md`).

v1.3 changes: (D1) per-window margin pattern filed as diagnostic-only prediction
(rec1≈dice — nothing stale in window 1 yet — gains in rec2/3; verdict-time pattern
check, never a gate). (D2) hit-rate-gap diagnostic: surBlind-vs-randBlind blindHit
gap reported at verdict time as one F2 input (among margins, never the arbiter).
(D3) floor-vestigial one-liner (trip unlikely by construction — resets raise, U64b
held 20/20; floor kept for same-exam continuity; NEITHER-WITH-DIAGNOSIS is the real
safety valve; INCONCLUSIVE reachable via dice collapse). (D4) TOTAL generation cap:
max 6 follow-up generations citing U64e shapes, each verdict carries g+1, its W0
asserts g+1 ≤ 6 else HALT (driver-enforced, rotation-proof). (D5)
termination-lives-in-countersign: no automatic negative verdict by owner order
2026-11-27 (diagnose-and-improve); the program halts iff the owner declines a
follow-up countersign (NO compute without countersign IS the halt); LINE-HALT stops
shapes, the countersign gate stops the program; owner may order KILL-LINE close at
any time (stated, never pre-authorized). Rejections: flat-surprise-as-kill (is F4,
filed); stratified-control tautology (demotion compares outcomes); stream-swap
(post-data re-draw, forbidden); floor-removal (answered by D3); variance/tie
(quorum + priority order); rigged-either-way (demotion = information);
decoupling-as-kill (mechanical coupling stands; D1 keeps the nuance);
program-infinity (answered by D4 total cap + D5).

v1.3 design: 4 arms (orReset 107; surBlind 108 min-condition trigger, passive
monitoring, cap 6, refractory 20; orBlind 109 logged diagnostic; randBlind 110
stratified per-window, demotion-only) × 20 = 80 reads-only re-evals; E1-only
(fresh disjoint streams, base 53500; E2 skipped — ceiling, filed); bars +0.03
@quorum 15/20, joint bound ≤0.041 (credited-win ⊆ surBlind-clears); floor 0.40 +
sensitivity; firewall verdict reads ONLY {accRec, stackHash} + filed dice;
verdicts CLOSED-LOOP-WORKS / ORACLE-ONLY / TRIGGER-INSENSITIVE /
NEITHER-WITH-DIAGNOSIS / INCONCLUSIVE / PIN-FAIL / HALT / LINE-HALT; F-tree strict
F3>F1>F2>F4>F5 + TOTAL cap; ledger verdict field machine-readable.

The ask (focused re-close): Is there anything in v1.3 that makes the experiment
unrunnable, mislabeled, or self-contradictory as FILED? Reply STANDS or NEEDS-PATCH
with at most two concrete findings. <=150 words, numbered. No ELI5. A repeat of a
round-1/round-2/red complaint already answered must say what v1.3 missed, or it is
stale.
