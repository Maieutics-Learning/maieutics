# W186exec — mask-tax mechanism (A; backlog-W160)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + 4 bench builds, floor)
- No tax on assoc (6+6 runs @1000 steps, h16 vs h24): masked accU h16 .718/.750 vs h24 .713/.755 (means .734/.734 — identical); skip-B identity holds at h24 (bit-exact to control both seeds); control flat too. The h24+mask degradation does NOT reproduce here — it is parity/task-specific, not a general mask×scale interaction. Both named hypotheses (pad-path capacity, attention dilution) presupposed generality; assoc bounds them out.
- eb-scale ablation killed (masked attention + native-diluted eb, h24): .727/.750 vs masked .713/.755 — diluting eb to native levels changes NOTHING. eb-scale dead as a mechanism class (forward-scale path; backward E-grad detail documented as second-order).
- Sharpening contradicted: masked attention entropy h24 .787/.780 vs h16 .639/.675 — HIGHER (more diffuse) at width, opposite the dilution-sharpens story. Whatever hurts masked-h24 on parity, it is not sharper attention.
- Mechanism note (NaN, not chance): native-on-padded-assoc DIVERGES (probe signature nEnt=0 + padMass=null-via-NaN on both widths/seeds) — W138's .264 is argmax-over-NaN landing on the class prior. Padded-native training doesn't learn badly; it dies. Filed: divergence, not degradation.
- Tax-stability challenge (cross-wave table): W145's tax cells were n=2 (masked .969→.781 h16→h24) while W166 shows masked-h24 DOES ignite (500–700, ragged) and native-h24 does NOT (1000-censored) — at h24 masked beats native on ignition. The "tax" may be small-n lottery across waves as much as mechanism. Powered parity replication (masked h16 vs h24, n≥6) spawned as W177 — the tax must first prove it exists before we explain it.

## Tangential (reasoning, 0 spend)
- A mechanism hunt for a possibly-lottery phenomenon is how you get three waves of explanations for noise. The ordering matters: replicate the TAX with powered n first (W177), explain it second. W160's contribution is clearing the underbrush — assoc says no, eb says no, sharpening says the opposite — so the parity replication starts with a clean field and a short suspect list (sink-removal).

## Spend / queue
- Spend: 0 + 0 + 4 builds (2 tax grids + eb ablation + entropy probe; 1 freeze from parallel evals — heavy page_evals run SOLO; missing yield in a fresh loop tripped the watchdog, fixed). Consumed backlog-W160 removed; spawned W177 to BACK. Backlog 17. Synthesis R28 clock: 3/5.
