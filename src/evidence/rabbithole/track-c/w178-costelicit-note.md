# W178exec — quarantine-vs-escape cost elicitation (C; backlog-W153)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + 2 builds: generative toy SCRAPPED, anchor calculator ADOPTED)
- Killed branch (recorded): generative detection toy (normal shift-in-mean, running-mean rule) contradicted the anchors it was meant to reproduce — falseQ floor .33 vs measured .03/.115 on easy/med, and θ.55 verification failed (.331 vs .70, wrong sensitivity). Microstructure guessed wrong → scrapped, not patched. Prices need the frontier shape (already measured), not a re-simulation.
- Anchor calculator (exact, from W157 measured cells): switch ratios r* = Δescape/ΔfalseQ where the argmin changes. Hard: fixed(.282,.064) → θ.5(.09,.40) at r*=.571 → θ.55(.03,.70) at r*=.20. So the adopted θ=0.5 is cost-optimal iff .20 < r < .571; θ.55 iff r < .20; FIXED wins iff r > .571. Med: fixed(.115,.009) → θ.5(.04,.115) at r*=.708. Easy: fixed(?,.0) vs θ.5(.002,.03) — sequential NEVER wins on errors (same escape, +falseQ); its easy-case rests entirely on delay (2.3 vs 8).
- Elicitation protocol (the deliverable): ask K = "false alarms tolerated per avoided escape" → r = 1/K → read θ*(r) off the table. Hard-θ.5 needs K > 1.75; hard-θ.55 needs K > 5; med-θ.5 needs K > 1.41. W157's conditional adoption now has its conditions: bounds, not vibes.
- Open (priced): easy conditional needs the missing fixed-easy-escape cell E (justify iff E − .002 > r×.03) + a delay price. Easy-fixed-escape cell + delay-price elicitation spawned W170.
- Verdict USED (exact break-evens + adoption bounds + K-protocol). No precursor, no conflict.

## Tangential (reasoning, 0 spend)
- The frontier is physics, the operating point is economics — and economics without a price is just taste. Every "adopted with default θ" on this trail now owes a K. Defaults are debts; elicitation is repayment.

## Spend / queue
- Spend: 0 + 0 + 2 builds (1 scrapped). Consumed backlog-W153 removed; spawned W170 to BACK. Backlog 17. Synthesis R27 clock: 1/5.
