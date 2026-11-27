# U70-F1 scout 4 (bar-integrity)

1. **Causal-Loop Contamination**: The proposal targets the "exact flaw" (KL < 0.25) by lowering the floor to 0.05, but maintains the v1.1 success bar for the gap (≥0.05). Because `U70N_REPW` is simultaneously increased from 0.1 to 0.3 (a 3x pressure hike), the experiment is a disguised sweep. Any observed gap increase cannot be isolated to the KL-floor adjustment; it is confounded by the increased representation weight.

2. **Metric Incoherence**: By measuring RAW KL against both floors, the "F1-FIXED" verdict becomes ambiguous. If raw KL is 0.10, it is "below" the 0.25 floor (Wave 1 failure) but "above" the 0.05 floor (F1 success). The proposal fails to define which floor governs the "representation restored" logic for the F1-PARTIAL vs F1-FIXED pivot.