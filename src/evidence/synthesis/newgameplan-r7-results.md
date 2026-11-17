# Round 7 raw — red-team barren-check on v5 (U1-U3)

## U1

1. VERDICT: HOLD
2. KILL: none.
3. CHANGE: KEEP P4 examiner-separation (critical for preventing tutor-as-scorer leakage).
4. HARDEST TEST: P2 Control #5 (frequency-matched fresh lines) to isolate marginal-frequency overfit from actual transmission.

---

## U2

1. VERDICT: HOLD

2. KILL: none.

3. CHANGE: KEEP P4 examiner-separation; the hash-commit prevents tutor-leakage during scoring, closing the last remaining transmission-integrity loophole.

4. HARDEST TEST: The "shuffle-before-relabel" round-trip tripwire; it isolates structural artifacts from actual pattern recovery, ensuring the 0.50 threshold isn't a byproduct of frozen-weight bias.

---

## U3

1. VERDICT: HOLD
2. KILL: none.
3. CHANGE: KEEP "no correctness-driven updates" terminology to prevent recurrence of R1–R3 misreads.
4. HARDEST TEST: P2 Control #5 (frequency-matched fresh lines) to isolate marginal-frequency overfit from actual transmission.

---

