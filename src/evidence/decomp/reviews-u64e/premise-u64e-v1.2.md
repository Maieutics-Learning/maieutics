# Premise artifact U64e v1.2 (frozen 2026-11-27; red-team reads THIS)

v1.1 premise + round-2 rulings (10 fresh barrage + 3 staff audit → 9 adopted, rest
rejected with derivations; details in
`reviews-u64e/fresh-eyes-self-u64e-v2-plus-audit-results.md`).

v1.2 changes: (1) randBlind STRATIFIED per-window (b[w]+1+r.int(50), stream
53800+seed — old 10..140 withdrawn as near-vacuum). (2) Monitoring declared passive
(zero slot cost); per-trigger cost = K steps only; worst-case blind 60/150 at cap.
(3) Hit-window [b,b+20] (lead −5 removed as unjustified; lag side K+max-lag+settle).
(4) F3-first rationale filed (exam-validity precedes arm-diagnosis). (5) LINE-HALT
terminal replaces steelman (driver-enforced stop; revival = owner order + fresh
battery). (6) Burn-in guard dropped → logged W0 check. (7) Demotion-proof one-liner
(credited-win ⊆ surBlind-clears → 0.041 stands conservative). (8) Verdict-field
machine-readable non-wins. (9) blindHit role clarified (F2 adjudication via
orBlind-vs-randBlind gap). Rejections: timing side-channel (no reader exists);
cross-arm leakage (per-armCode streams); aliasing rival (no subsampled clock;
jitter = post-data exam change); F-reorder (rationale answers it); quorum coin-flip
(0.0207); detectRate-as-bar (category error); sampling-frequency (per-slot atomic);
saturation arithmetic (answered by passive-monitoring); lag kill-charge (cost not
death, F5 path); joint-robustness (invented scenario).

v1.2 design: 4 arms (orReset 107; surBlind 108 min-condition trigger; orBlind 109;
randBlind 110 stratified demotion-only) × 20 = 80 reads-only re-evals; E1-only;
bars +0.03 @quorum; floor 0.40; verdicts incl. TRIGGER-INSENSITIVE + LINE-HALT;
F-tree strict F3>F1>F2>F4>F5 + recursion cap; diagnose-never-dead per F-shapes.

The ask (red-team): Kill this premise. One kill-shot per scout: the single
load-bearing claim most likely to be false + the cheapest run/derivation that would
prove it. <=150 words, numbered. No ELI5. A repeat of a round-1/round-2 complaint
already answered must say what v1.2 missed, or it is stale.
