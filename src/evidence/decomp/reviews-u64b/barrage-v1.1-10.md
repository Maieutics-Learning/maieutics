# U64b barrage v1.1 scout 10

## Brief
ANGLE anti-tuning: grade the sensitivity diagnostic as tuning defense. Does pre-committed tabulation under 0.35/0.40/0.45 actually constrain the authors, or can the AMBIGUOUS-FLOOR note be abused to re-vote? Exact abuse scenario or stand down.

## Reply (verbatim)
VERDICT: IMPLEMENTABLE

1. **E1/E2 Logic**: Deterministic RNG seeds and verbatim replay prevent data leakage. P-value bound (0.041) is conservative for 15/20 quorum.
2. **Floor Guard**: Sensitivity diagnostic (0.35/0.40/0.45) prevents p-hacking via threshold shifting. The "AMBIGUOUS-FLOOR" note is a descriptive flag, not a decision override; the verdict remains frozen at 0.40.
3. **Firewall**: Verdicts depend only on frozen hashes and final aggregates, preventing mid-run adaptation.
4. **Anti-Tuning**: Pre-committed tabulation constrains authors. Abuse scenario: authors could argue for 0.35 if 0.40 fails, but the "frozen" clause prohibits this.

HARDEST-TEST: Verify `examHash` match across all 100 trunks before E1 recovery; any single-bit discrepancy in the frozen ledger must trigger HALT.
