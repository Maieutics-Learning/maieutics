# U64b barrage v1.1 scout 4

## Brief
ANGLE E1-construction: grade the filed familiar-amplifies clarification. Is the accuracy-gap logic (stuck arms miss familiar draws) airtight, or does a fast-but-imperfect adapter create a ceiling that compresses orF-dice margins below +0.03? Numbers or stand down.

## Reply (verbatim)
VERDICT: NEEDS-PATCH

1. E1 logic flawed. "Familiar-amplifies" assumes binary state (stuck vs. active). If a fast-but-imperfect adapter exists, it captures familiar draws with low precision, creating a performance ceiling. This compresses the margin between `dice.accRec` and `orF.accRec`, potentially masking true recovery gains and pushing the gap below +0.03 despite successful recovery. The logic ignores the noise floor of imperfect adaptation.
2. E2 `lowest-pair-index` fallback is a vulnerability; it creates a predictable bias if the `ruleRng` fails to find a valid set within 20 draws, potentially leaking seed-state info or creating non-uniform set selection.

HARDEST-TEST: Run 20 seeds with a "fast-leak" adapter (high-speed, low-precision) to see if the +0.03 margin collapses despite valid E1 recovery.
