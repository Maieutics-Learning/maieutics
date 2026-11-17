# Round 3 raw — staff audit on v3 (MATH/IMPL/ALT)

## MATH

1. VERDICT: FAIL

2. WORST BAR: Round-trip success $\ge 0.50$ (vs $0.25$ chance) is too low for a 4-class system; a $0.50$ threshold is barely above noise for binary, but for 4 classes, a $0.75$ threshold is required to ensure the "blind re-label" isn't just reflecting the tutor's own bias/frequency.

3. CHECKED: 
- Entropy gate $1.0$ (Sound: prevents degenerate constants).
- Agreement bar $0.20$ (Sound: marginal over permuted controls).
- $500$-iter cap (Sound: prevents infinite search).
- Top-1 $0.50/0.70$ cutoffs (Sound: standard confidence/transmission gap).
- $2\text{x-share}$ clustering (Sound: detects skewed distribution).

---

## IMPL

1. VERDICT: GAPS
- **Harness Spec:** "Separate-process scoring enforcement" lacks a defined communication protocol (IPC/REST/RPC) to ensure the scorer cannot access weight memory.
- **Recombination Recipe:** "TOKEN-SHUFFLE" is under-specified; "random same-class exemplar's position i" fails if exemplars have varying lengths or different token-to-position mappings.
- **Diagnosis Tree:** "Errors cluster" is a qualitative observation, not a quantitative trigger.
- **Generation Build (a):** "Activation-max / Gibbs token mutations" lacks a convergence criterion or budget per candidate.

2. BIGGEST GAP: The "Falsifier" logic is an observation, not a constraint. Fix: Define a statistical significance test (e.g., KL-divergence threshold) to programmatically trigger "Transmission Dead" status.

3. ENFORCEABLE:
- SHA-256 ledgering.
- Readout field definitions (top-1, margin, entropy, energy, cited-slot).
- P1 Acceptance Checklist (Boolean gates).
- P2 Control set (Permuted-pairing, random-init twins).
- No-feedback (Weights $\neq$ Score).

---

## ALT

1. RIVAL: The student is not learning a pattern, but is simply overfitting to the specific noise distribution (marginal token frequencies) of the tutor's training set.
2. KILLER TEST: Evaluate agreement on a "distribution-matched" control set where token frequencies are identical to the tutor's noise, but the specific structural patterns are randomized.
3. IN-DESIGN?: NO (add to P2.1 Controls).

---

