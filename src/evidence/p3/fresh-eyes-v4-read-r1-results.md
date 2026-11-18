# Fresh-eyes v4 readability r1 (2026-11-18) — 3x clarity barrage

## Raw
READ1 FAIL: mouth/ear/tutor/bundle/thermometers undefined; seeds 9840-42 unclear (RNG vs dataset vs checkpoint); bars logic AND/OR unclear, W undefined, EAR-BAR Wilson ambiguous. Fixes: define arch upfront, descriptive seed labels, IF/THEN table.
READ2 term fixes: bundle-only/provenance, nUniq unique samples, disjoint=non-overlapping, thermometer≠temperature, nulls with teeth→baseline (loses teeth), demote→reclassify (loses meaning), Wilson binomial, quorum→66% (loses stats).
READ3 rewrites: null requirement real>synthetic >=0.10 else demote; provenance partitioned nUniq=100, seeds disjoint by list.

## Adjudication
ACCEPT: arch glossary upfront (mouth=19-way next-token head, ear=4-way entropy-bucket head, trunk=shared h48, bundle=tutor-output file student loads, thermometer=frozen grader model never trains); seeds = deterministic RNG draws (keep numbers + add tag RNG); bars as IF/THEN table; nUniq = 100 unique lines per 100-line bundle; disjoint = non-overlapping RNG ranges; Wilson = binomial 95% CI.
REJECT: renaming seeds to labels only (numbers are reproducibility); thermometer→temperature labels (wrong); nulls→baseline without demotion rule (teeth stays); demote→local-subset (scoped finding stays); quorum→consensus (quorum + Wilson stays).
PATCH → v4.2 readability draft: glossary + RNG tags + IF/THEN bars + null wordings from R3 tightened.
