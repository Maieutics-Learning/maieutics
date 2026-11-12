# Wave 196 note — backlog-W168 gate-meter threshold calibration (sandbox, executed)

STOP RULE: stopped after 9-world x 200-trial grid with post-hoc tau sweep (no N-sizing runs — spawned, not built). 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (in-page sandbox; W151/W167 mechanics reused; overlap = non-harmed cap). Clock: R30 1/5.

## Direct: naive .05 survives everywhere except one world; the loss curve has no point

Grid: overlap cap {.6 none, .7 moderate, .8 heavy} x gate t {.65, .5, .35} x 200 trials. Per trial: oracle = true spread on 400 cases (4 arms) GO iff > C=.05 search cost; meter = fpRate_hat on 100 fresh cases, GO iff > tau (swept post-hoc {0,.02,.05,.08,.12,.2,1}). Loss(tau) = C*P(falseGO) + E[(spread-C)+ & falseSKIP].

1. NAIVE .05 OPTIMAL-OR-PERFECT IN 8/9 WORLDS: no-overlap all gates (loss 0 at tau=.05; selective oracleGO=.01 with 2/200 noise trials, meter moot); cap=.7 mid/greedy (oracleGO=1, meter always-GO correctly); cap=.8 all gates (oracleGO=1, tau<=.08 perfect). W175's threshold validated as default.
2. THE ONE WORLD THAT NEEDS CALIBRATION: cap=.7/t=.65 (moderate overlap, selective gate; oracleGO=.565): tau=.05 -> fgo .265 / fsk .165 / loss .016; tau=.08 -> .065/.42/.0099; tau=.12 -> 0/.55/.0093; tau=.2/never-GO -> .0095. Loss cut ~40% — but the bottom is FLAT (.08/.12/.2/never-GO all ~.009-.010, within noise of each other). Report a PLATEAU (.08+), not a point. The robust claim is directional (raise tau under overlap-selective to kill falseGOs), not numerical.
3. OVERLAP RECLASSIFIES GATES: selective@cap.8 has oracleGO=1.0 (fp ~26-30 always push spread > .05) — it IS a greedy gate wearing selective clothes. Gate labels don't transfer across score distributions; effective regime = f(overlap, t), and the meter reads the effective regime correctly (always GO, loss 0).
4. METER VALUE THINS (against interest): at cap=.7/t=.65 the oracle-GO trials are MARGINAL (mean missed margin .017 — spreads just over cost). Even tau-plateau loses .009/trial vs W175's clean 0.000. Under overlap the meter stays roughly correct but the game stops being worth playing: the search it gates is marginal. Never-search (.0095) nearly ties tau* (.0093) — the real competitors for any probe are the constants, and here they almost win.
5. Noise note (kept): 2/200 oracle-GO trials at cap=.6/t=.65 (fp=0 by construction; truePart spread can't reach .05) — unexplained at 1%, consistent with arm-luck on harmed-heavy draws; not chased.

Verdict: USED (scoped calibration: .05 default + plateau fix for one world + reclassification + value-thinning). No precursor, no conflict.

## Tangential: compete against the constants, not just the oracle (0-spend, reasoning only)

The meter literature (ours included) scores probes against the oracle (18/18! i.e. vs perfect information). But the probe's buyer chooses between probe / always-GO / always-SKIP — and here always-SKIP nearly ties the calibrated probe. Any probe wave should report all three columns (probe loss, always-GO loss, always-SKIP loss); a probe that beats the oracle-metric but ties always-SKIP is a correct answer to a worthless question. W175's 18/18 survives this audit (constants lose badly there: always-GO wastes .05 x many SKIPs... at selective-no-overlap always-SKIP loss = .0001 — TIES?! oracleGO=.01, missed margin tiny. Hmm — W175's selective 6/6 SKIP is also nearly-tied by always-SKIP. The meter's VALUE lived in mid/greedy (always-SKIP would bleed .065-.21). Fair restatement: the meter earns its keep where stakes are large; where stakes are marginal (selective, any overlap) the constants compete. W184's hybrid must pass the same audit.)

## Spend / queue

- Spend: 0 + 0 + 1 grid (9x200 trials + post-hoc sweep, floor). Consumed backlog-W168 removed; spawned W185 to BACK. Backlog 17. Synthesis R30 clock: 1/5.
- W185 (C/A, sandbox): meter-value + N-sizing — value-of-search map (probe vs always-GO vs always-SKIP loss across cap x t); calibration N {50,100,200,400} in cap=.7/t=.65 (does sharper fpHat rescue selective-overlap? value-of-information curve); tau* per N.
