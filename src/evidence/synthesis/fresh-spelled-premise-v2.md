# Fresh-eyes premise v2 — Detour D1 spelled-keys v1.1 (2026-11-17)

Project: Teaching Small Models to Learn — bench associative recall (h48 tinynn, CPU). Detour D1 v1.1 DRAFT (R1 6x adjudicated: 8 accepts, systematic D1/run02 conflation logged as reviewer error; v22 frozen untouched). ZERO brains run under D1 — run-02 numbers (rho 0.5275, medComp 0.8875, pooled 0.8217, 5101-5114) are atomic-context only.

What changed v1.0 → v1.1 (R1 patch list, verify each is fixed):
1. Zero-runs banner (no D1 results exist; bars unfired).
2. D1a byte layout frozen: alphabet ids 10-17 (a-h), values 4-7, SEP=18, ?=8, no TERM in D1a; worked example filed; deviation = new fingerprint + HALT.
3. D1a reports short-vs-long split (length-confound visible pre-D1b).
4. Frozen eval-only controls on same pilot brains (no new training): random-key + position-shuffle + permuted-key + omit-q; fail = template-match.
5. 12-letter zero-shot named cheapest follow-up.
6. Tutor spelled-killA gate = feasibility start-gate, not generality proof.
7. Scale rule: no n=50/100 until 8-12 fill bar passes.

Still true: fixed-3 pilot local first (2-brain smoke then 8-12); max-8+TERM gated on D1a survival; fill bar ≥3 acc≥0.6 AND ≥3 acc<0.5 + 200/200 loader + lineHash else HALT; suspicion re-test only if fill passes (rho≥0.6 + medians, per-brain, pooled record-only); all-floor → ABANDON/shorten; paper block until v23 countersign; Actions scale only, Node 22 pinned, explicit confirm; Kaggle out.

ASK: Re-review PATCHED D1 v1.1. For each v1.0 complaint above: fixed / partially / still-open (one line each, numbered). Then verdict + single hardest remaining test/falsifier. <=200 words total, numbered. Blunt, terse, technical. No ELI5.
Caveat: reviewers share one model family as author — checklist, NOT independent confirmation.
