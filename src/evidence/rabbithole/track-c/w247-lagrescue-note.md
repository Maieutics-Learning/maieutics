# Wave 247 note — backlog-W211 laggard-rescue audit (bench, executed)

STOP RULE: stopped after 21-run grid (widths {16,24,32} × seeds {7,10,15} × aux1 + laggards {10,15} × auxW {.5,2} × widths, 1000 steps, 5-rung ladder). 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (w194 rig + receipt-preserving auxW param; live-page TinyNN). Clock: R38 4/5. Pre-reg scored: (a) CONFIRMED (b) REJECTED-interaction (c) CONFIRMED-inverse (d) CONFIRMED-with-flip.

## Direct: laggards are (seed × width × dose) cells, not classes — and dose runs backwards

- Receipt: h16-aux1-s10 l10 .78 bit-matches W227 (AW===1 keeps the `/=` path). New cells are comparable.
- (a) s10 rescue monotone in width CONFIRMED (aux1 l10/l12/l14/l16: h16 .78/.60/.55/.53 → h24 .9967/.9833/.92/.877 → h32 .9967/.9867/.9667/.96; saturates h24→h32 at low rungs).
- (b) s15 "width-proof class" REJECTED — interaction: h16-aux1 s15 .97/.933/.917/.873 (NOT a laggard — passes everything), h24-aux1 .90/.757/.653/.587 (laggard), h32-aux1 1.0/.987/.967/.967 (rescued). Non-monotone in width (fine→fail→fine). There is no width-proof class; there is an h24×s15 cell. The class hypothesis dies, the cell map replaces it.
- (c) Dose rescues s15 where width fails — CONFIRMED, direction INVERSE: h24-s15 aux1 .90/.757/.653/.587 → aux0.5 1.0/1.0/1.0/1.0 (halving dose PERFECTLY rescues) → aux2 .983/.943 (partial). s15 at h24 is OVER-scaffolded, not under-. Opposite signs per seed: s10 wants MORE at h24 (aux2 → 1.0/1.0/1.0/.953); s10 at h16 wants LESS (aux0.5 → 1.0/1.0/1.0/.9967, full rescue of the h16-laggard by halving); h32-s10 inverted-U (aux1 best, aux2 collapses late rungs .823, aux0.5 .853). Dose windows, seed × width specific — W245's window theme, second bench, different rig.
- (d) Minimal separating rung CONFIRMED with a flip: at h24-aux1, l12 separates (s10 .9833 passes, s15 .7567 fails; l10 both ≥.90). At h16-aux1 the SAME rung separates REVERSED (s10 .60 fails, s15 .933 passes). l12 is the minimal class-separating rung; width sets the sign. Rung-flip, owned against the single-direction expectation.
- s7 anchor: passes everywhere (worst h16 l16 .887), confirming the ladder still discriminates (not a universal collapse at any cell).

Verdict: USED with teeth (receipt + monotone-s10 + class-kill + inverse-dose + rung-flip). No precursor, no conflict.

## Tangential: rescue direction is a parameter, not a virtue (0-spend, reasoning only)

"More scaffolding" is not rescue — it is a direction, and s15 proves the direction can point down (halving rescues fully; doubling stranding at h32 late rungs). Every rescue prescription ships its dose sign per (seed × substrate) cell: up for s10@h24, down for s15@h24 and s10@h16, ∩ for s10@h32. "Rescue" without a sign is a wish; the window map is the prescription. W228 draws the full windows.

## Spend / queue

- Spend: 0 + 0 + 21 runs (floor). Consumed backlog-W211 removed; spawned W228 to BACK. Backlog 17. Synthesis R38 clock: 4/5.
- W228 (A, bench): dose × width window map — auxW {.25,.5,1,2,4} × h {16,24,32} × {s10,s15} (30 runs): window edges per (seed,width); is h24-aux1 the over-scaffolding peak for s15; do windows shift monotonically with width.
