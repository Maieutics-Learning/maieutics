# U64c barrage v1.0 scout 6

## Angle
ANGLE firewall: verdict reads {two, adapt, stackHash} with dice halves filed. Is reusing filed dice numbers as LIVE gate inputs sound (they were verdict inputs in U64's verdict too — double-use across verdicts)? Any gate input that should be recomputed fresh (dice re-eval under W2 driver)? File the exact patch or say SOUND with one-line why.

## Reply (verbatim)
VERDICT: SOUND

1. Reusing filed dice ledgers is valid because the exam is verbatim (stationary N=200) and the dataset/seeds are identical. No state transition occurs between U64 and U64c-RESPONSE that would invalidate the previous outputs; the new arm `detT` is compared against a fixed, immutable baseline. Re-evaluating the control group would be redundant compute.

HARDEST-TEST: `RESP-EDGE` pass @15/20 (Old exam washing-out effect makes edge gains difficult to recover).
