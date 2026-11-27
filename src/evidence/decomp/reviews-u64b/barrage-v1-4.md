# U64b barrage v1.0 scout 4

## Angle
ANGLE E1-construction: 50-slot diet-mix windows. Does accRec measure recovery speed, or is it confounded with the familiar fraction (75% familiar draws hand everyone fast recovery)? Give the cheapest killer test that separates the two, and say whether the design contains it.

## Reply (verbatim)
VERDICT: NEEDS-PATCH

1. accRec is confounded. 75% familiar draws guarantee high accuracy regardless of recovery speed; the "recovery" is merely the 25% noise. Design lacks a control for familiar-fraction bias.

HARDEST-TEST: Zero-familiar recovery. Set diet-mix to 0% familiar draws across all 50 slots; if accRec stays >dice, recovery is real. Design does not contain this.
