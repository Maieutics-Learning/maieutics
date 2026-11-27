# Premise artifact U64e v1.1 (frozen 2026-11-27; round-2 reviewers read THIS, not v1.0)

v1.0 premise (`premise-u64e-v1.0.md`) + round-1 rulings (10/10 NEEDS-PATCH → 6 adopted,
4 rejected with reasons; details in
`reviews-u64e/fresh-eyes-self-u64e-v1-barrage-results.md`).

v1.1 changes: (1) trigger min-condition (trailing-8 ALL elevated above burn-in mean —
answers single-spike-false-alarm without variance normalization). (2) Firewall reads
accRec+stackHash only (triggers demoted to verdict-time diagnostics). (3) F-tree
strict priority F3>F1>F2>F4>F5 + recursion cap (2 consecutive same-shape max, third
→ mandatory steelman of the shape). (4) randBlind control arm 110 (3 random steps
10+r.int(131) from stream 53800+seed + K=10 blind) with TEETH demotion rule
(randBlind+surBlind both clear → CLOSED-LOOP-WORKS demotes to TRIGGER-INSENSITIVE;
win-paths stay two → 0.041 joint bound stands). (5) ORACLE-ONLY non-win one-liner.
(6) W0 burn-in guard (b0>50 all seeds). Rejections: beat-oracle demand (bar is vs
dice); stream-sharing confusion (separate streams, no shared state); E2-skip (twice-
measured ceiling); 100-seed/jitter demands (scope n=20, ±40 filed); K-mining (K=10
derivation filed, U64g owns the sweep, post-data moves forbidden); win-smuggling
(labels non-wins by construction); vacuous-floor (U64b anchor precedent); unfalsifiable
F-shapes (each has measured rule + named follow-up; A3 caps recursion).

v1.1 design: 4 arms (orReset 107 reset-only diagnostic bar; surBlind 108 closed-loop
primary bar; orBlind 109 logged no-bar; randBlind 110 demotion-only control) × 20
seeds = 80 reads-only re-evals under U64b-E1 with disjoint streams (53500/53600/
53800); E2 skipped (ceiling); bars surBlind-vs-dice +0.03 and orReset-vs-dice +0.03
@quorum 15/20; floor 0.40 + sensitivity; verdicts CLOSED-LOOP-WORKS / ORACLE-ONLY /
TRIGGER-INSENSITIVE / NEITHER-WITH-DIAGNOSIS(F1–F5 strict tree) / INCONCLUSIVE /
PIN-FAIL / HALT; oracle-fails → diagnose-and-improve per F-shapes, NEVER dead.

The ask (unchanged): Hammer this premise. State IMPLEMENTABLE | NEEDS-PATCH + single
hardest test/falsifier. <=150 words, numbered. No ELI5. A complaint round-1 already
answered must say what the v1.1 patch missed, or it is stale (premise hygiene) —
repeat complaints without new substance are rejected as findings about nothing.
