# U70-F1 re-close 4 (no-smuggling)

1. **STANDS**. 
2. The "disguised sweep" (anneal schedule) is deleted; `U70N_REPW` is now a static constant (0.1).
3. The transition to a lower floor (`U70N_FREEBITS`: 0.05) correctly prevents gradient collapse while remaining a fixed parameter, ensuring the only variable shifting between paired runs is the floor constant itself.
4. No new variables or hidden schedules were introduced in the patch. Smuggling is mitigated.