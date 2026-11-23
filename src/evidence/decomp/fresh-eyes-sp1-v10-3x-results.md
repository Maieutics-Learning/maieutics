# Fresh-eyes battery — SP1 v10 spec (3 sealed reviewers, verbatim)

## C1 (copy-only baseline)
VERDICT: CONDITIONAL. Fix: Provide a baseline "copy-only" task (no addition) to isolate the cost of the +4 token expansion.
(a) Soundness: Questionable; if the model simply appends tokens without state-tracking, the "bar" measures sequence length, not cognitive scratchpad utility.
(b) Rival: The "KV-cache expansion" effect—the model may be leveraging increased attention span/positional slots rather than emergent computation.

## C2 (distributed encoding — ADOPTED as lens)
VERDICT: CONDITIONAL. Fix: Replace argmax-decode with a confidence-thresholded softmax or entropy-based filter to distinguish "distributed encoding" from "empty slot."
(a) Bar Soundness: Weak; assumes a 1:1 mapping between a single token's argmax and a semantic slot, ignoring distributed representations.
(b) Confound: The probe may be detecting high-entropy noise (uninitialized weights) rather than a legitimate distributed semantic encoding.

## C3 (third outcome — ADOPTED)
VERDICT: CONDITIONAL (Fix: introduce "DECODER-FAIL" status).
(a) Soundness: Flawed; "NO-SLOT" implies a success in composition but a failure in retrieval, which is not a binary "No."
(b) Confound: The "compositional" hit may be a statistical artifact of the prompt's structure rather than actual cognitive processing.

## Adjudication (agent, filed as v10.1)
- REJECT with precedent (C1): copy-only IS baselined — harness pass-1 retrieve (0.775–0.935) is the copy task; the conjunction isolates the addition cost by construction.
- ADOPT as lens (C2): bar stays argmax-decode (the claim is a readable slot), but ledger adds best-pos mean entropy: low-entropy + low-decode = distributed-or-empty (stated limit, not a detection); high-entropy = noise. Doesn't move the bar, sharpens the reading.
- ADOPT (C3): verdict levels EMERGENT (both bars) / COMPOSED-WITHOUT-SLOT (composed≥0.60, decode<0.70 — solves differently, genuinely interesting) / NO-SLOT (else).
