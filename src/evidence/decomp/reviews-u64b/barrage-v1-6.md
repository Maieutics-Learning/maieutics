# U64b barrage v1.0 scout 6

## Angle
ANGLE firewall: verdict reads ONLY {accRec,accTra,stackHash}+filed adaptEarly. Is every exploratory quantity either gated or declared verdict-time-only? Is any logged-but-unconsulted metric actually load-bearing in disguise? Any missing gate input (e.g. examHash mismatch handling — assert else HALT: is HALT a verdict? it isn't listed)?

## Reply (verbatim)
VERDICT: NEEDS-PATCH

1. Firewall leak: `examHash` is logged but not in verdict set, yet required for integrity; missing `HALT` state for hash mismatch creates an undefined exit. 
2. Ambiguity: `novelHot` and `rule` are logged but their influence on `accTra` is not gated, risking post-hoc data mining.
3. Floor logic: `max-arm accRec < 0.40` is a weak bound given previous 0.45 failure; high risk of `INCONCLUSIVE` loop.
4. Independence: W0 is a "thin gate," but lacks a hard-stop for non-deterministic twins before W1.

HARDEST-TEST: `examHash` mismatch on 1/20 seeds to verify if system triggers an unlisted `HALT` or incorrectly proceeds to `PIN-FAIL`.
