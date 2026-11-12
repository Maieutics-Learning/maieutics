# Wave 239 note — backlog-W204 hard-escape residual + t55 anomaly (sandbox, executed)

STOP RULE: stopped after dud sweep (9 worlds x 6 dud configs, expanding t5) + t55 rule adjudication (9 worlds x expand-theta-sweep + trail4) + range-alt scoring. 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (w187d rig + dud persistents). Clock: R37 2/5.

## Direct: 9% duds close esc exactly; trail4 stands under either delay reading

- (a) Dud sweep: best mu1.3/d1.3/pd.09/deltaDud0 → t5 (2.75/.0897/.2319) vs (2.7/.09/.40): delay ✓, esc EXACT (.0897 vs .09 — the named residual CLOSED), fq .23 vs .40 (gap .17 persists). pd curve monotone through target (.0529/.0897/.1184 at pd .05/.09/.15 — the exact hit is interpolation, see tangential). deltaDud=.3 worse (.0724); pd=.15 overshoots. The "9% weak persistents" hypothesis was quantitatively right about the fraction AND the kind (zero-shift). fq residual: reduced-not-closed, bounded (needs pit/D/onset work — W221 owns it, not this wave).
- (b) t55 adjudication: expanding theta-sweep maxes delay 2.68 and FALLS with theta (selection effect — only fast trials fire) — 4.0 unreachable under expanding, period. trail4: delays 4.3–4.55, best (4.32/.0402/.7484) s=1.05 vs expanding's 4.44–5.94. Mixed rules (expand t5, trail4 t55) CONFIRMED — the .55 arm differed structurally, not just theta. "Just theta" rejected with the asymptote, not the fit.
- (c) Range-alt: expanding vs (2.7/.03/.70) scores 1.84–3.34 (better than vs 4.0, still loses to trail4's 1.05–2.42 at every world). The rule conclusion is robust to the range-reading — trail4 stands whether "4.0" is exact or misassigned. Both readings recorded, neither load-bearing.
- Ledger: hard-t5 esc CLOSED, hard-t5 fq OPEN (.23 vs .40), hard-t55 adjudicated. Hard cells half on ledger — honestly, not hopefully.

Verdict: USED with teeth (exact esc close + structural adjudication + reading-robustness). No precursor, no conflict.

## Tangential: exact hits ship with their dose curve (0-spend, reasoning only)

.0897-vs-.09 looks miraculous until the pd curve (.0529→.0897→.1184) shows it as monotone interpolation through the target — any pd∈[.07,.12] would "hit." Exactness without the bracketing curve is luck cosplaying as precision; with it, it's calibration. Rule: every exact-number hit prints the dose curve that brackets it (same discipline as confidence intervals, cheaper than bootstraps).

## Spend / queue

- Spend: 0 + 0 + 1 grid (54 dud configs + 45 rule cells; floor). Consumed backlog-W204 removed; spawned W221 to BACK. Backlog 17. Synthesis R37 clock: 2/5.
- W221 (C, sandbox): hard-fq residual — pit/D/onset sweep on the dud-extended hard world (mu1.3/d1.3/pd.09): does fq .23→.40 close with more/later transients; late-onset t0 sweep; close or bound the last hard residual.
