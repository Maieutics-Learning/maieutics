# Fresh-eyes battery: self-u31e-selfdir-prereg.md v1.0 (3x sealed, parallel)

Method: file text read from workspace + 3 parallel reviewer calls (reviewer labor only). Each reviewer saw ONLY the prereg + ≤150-word return shape (VERDICT / patches / HEALTH).

## Verbatim
U31e-R1: IMPLEMENTABLE. Confound: gate may select difficulty not learnability. Control: E-rand narrow; wants random-from-same-hard-pool baseline. Bars: SEL +0.03 thin if sigma high. Killer: stdTwo_rand vs stdTwo_sel (forgetting = overfitting). HEALTH 4x yes.
U31e-R2: IMPLEMENTABLE. LIFT proves trainability; SEL is the only self-direction metric. Confound: E-rand lifting demotes gate to luxury. Risk: 800st aggressive. Killer: E-none equality check. HEALTH 4x yes.
U31e-R3: NEEDS-PATCH. (1) SEL +0.03 is noise at N=200; want N>=1000 or +0.10. (2) Diet confound: 20-try cap lowers sel diversity vs rand. (3) Killer: E-neg (train on p>0.5); if neg lifts, gate is a random sampler. HEALTH 4x yes.

## Adjudication (2x IMPLEMENTABLE + 1x NEEDS-PATCH -> v1.1, no design change)
- ACCEPT (R3-1): held-out hard N=1000, mined once per seed (identical row sets, paired). Chance math at N=1000: LIFT FP~=0.01, SEL joint~=0.015. Bars stand.
- ACCEPT-reporting (R3-2): P1b diet-diversity/effort reporting in every ledger.
- ACCEPT (R3-3): P1c E-neg 4th arm (93600/94600 family) + demotion rule with teeth (sel-neg<0 2/3 caps verdict at TRAINS-BUT-BLIND). 12T+12E.
- ACCEPT-reporting (R1-killer): P1d stdTwo for all arms; overfitting reading rule.
- NOTED (R1-confound, R2-risk): P1e interpretation caveat, P1f curve watch. No patches.
- REJECTED-as-covered: R1 random-hard baseline = E-rand already (uniform adapt episodes); R2 E-none check = U31e-NONE bar already.
Round score: 2 accepts + 2 reporting-pins + 1 demotion rule, 2 noted, 2 rejected-as-covered. Proceed to driver + 12T + 12E.
