# Premise artifact U64b v1.1 (frozen 2026-11-27; round-2 reviewers read THIS, not v1.0)

v1.0 premise (`premise-u64b-v1.0.md`) + round-1 rulings (6 findings → 6 adoptions;
rejections: dice-relative floor, chance-logic inversion, familiar-confound direction,
shuffled-slot test, mining-risk, W0-stop — reasons in
`reviews-u64b/fresh-eyes-self-u64b-v1-barrage-results.md`).

v1.1 changes: (1) E2 draws continue a SINGLE ruleRng(64000+seed) after verbatim Wave-0
replay (logged ruleDrawCount; W0 twin enforces); first-remaining = lowest pair-index.
(2) HALT verdict listed (examHash mismatch / twin mismatch; distinct from PIN-FAIL);
examHash in firewall asserts. (3) Floor 0.40 kept as labeled Hypothesis + pre-committed
sensitivity diagnostic (verdict tabulated under 0.35/0.40/0.45; verdict follows 0.40;
disagreement → AMBIGUOUS-FLOOR note, verdict frozen). (4) Joint chance bound filed:
P(≥1 of two ~0.021 bars fires by chance) ≤ 0.041 conservative. (5) Ledger completed:
driverHash, scr/orc heads both exams, novelCandidates + ruleDrawCount. (6) E1
clarification filed: 75%-familiar AMPLIFIES the accuracy gap (stuck arms miss familiar
draws); 0%-familiar probe rejected by design (measures OOD robustness, not recovery).

The ask (unchanged): Hammer this premise. IMPLEMENTABLE | NEEDS-PATCH + single hardest
test/falsifier. <=150 words, numbered. No ELI5. New-version rule: a complaint that
round-1 already answered must say what the v1.1 patch missed, or it is stale (premise
hygiene U7) — repeat complaints without new substance are rejected as findings about
nothing.
