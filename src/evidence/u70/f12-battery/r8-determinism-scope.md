# U70-F12 battery verbatim r8-determinism-scope.md (2026-11-27, sealed)

Angle: determinism-scope
Verdict: NEEDS-PATCH
Finding: floating-point identity unsafe; cuDNN nondeterminism / memory alignment could break expect-~0 paired deltas.
Falsifier: non-zero F12-F11 paired delta despite identical seeds/paths.
