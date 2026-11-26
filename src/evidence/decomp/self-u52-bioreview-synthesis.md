# U52-BIOREVIEW synthesis: five biological programs triaged against the ledger record

**Status: review CLOSED (docs only); NO training compute; NO pool spend; NO PUSH. AWAITING fresh-eyes battery + countersign before any experiment.**
Incoming material: `papers/incoming-outside-perspective-2026-11-26.md` (user-supplied transcript, copied verbatim to durable store 2026-11-26; platform citation refs in it do not resolve outside the original chat and were **not** relied on).
Intake slot: U51 remains reserved for the owed split/resting program; this review is U52 to avoid collision.

## Pre-step research check (standing rule, recorded)

Q: which cited mechanisms can be verified against primary sources without burning compute? A: PubMed E-utilities (esearch/esummary/efetch, no key, low rate). Fetched 2026-11-26 into `scratch/papers-bio/`: 7/7 target records verified (PMID/journal/volume/pages/DOI), 7/7 abstracts extracted (`abstracts-clean.txt`), 1/7 full texts read (Anderson & Floresco 2022, PMCID PMC8616908, CC-BY). Paywalled full texts were **not** used beyond abstracts — every brief marks its grounding level. Nothing in the synthesis below depends on an unverified source.

## Source table (verified 2026-11-26)

| # | Paper | PMID / DOI | Grounding | Transcript row |
|---|-------|-----------|-----------|----------------|
| 14 | Aston-Jones & Cohen 2005, Annu Rev Neurosci 28:403–450 | 16022602 / 10.1146/annurev.neuro.28.061604.135709 | abstract | adaptive gain — MATCHES |
| 15 | Yu & Dayan 2005, Neuron 46(4):681–692 | 15944135 | abstract | expected/unexpected uncertainty — MATCHES (transcript's §5 taxonomy is faithful to this paper) |
| 16 | Hasselmo 2006, Curr Opin Neurobiol 16(6):710–715 | 17011181 / PMC2659740 | abstract | ACh/memory — MATCHES |
| 17 | McClelland, McNaughton & O'Reilly 1995, Psychol Rev 102(3):419–457 | 7624455 | abstract | CLS — MATCHES |
| 18a | Diekelmann & Born 2010, Nat Rev Neurosci 11(2):114–126 | 20046194 | abstract | sleep/memory predecessor — ADDED (needed for 2023 delta) |
| 18b | Brodt, Inostroza, Niethard & Born 2023, Neuron 111(7):1050–1075 | 37023710 | abstract | "Born (2023)" — RESOLVED to this paper |
| 19 | Redondo & Morris 2011, Nat Rev Neurosci 12(1):17–30 | 21170072 | abstract | STC — PARTIAL: transcript said "(2020)"; no 2020 review verified; grounded in canonical 2011 revision instead |
| 20 | Anderson & Floresco 2022, Neuropsychopharm 47(1):180–195 | 34446831 / PMC8616908 | **full text** | PFC-hippocampal extinction — MATCHES |

**Not verified / excluded from ground truth:** any 2025 locus-coeruleus–hippocampus prediction-error review (no PMID established); any 2020 STC update; the transcript's reading-link URLs (unresolved); the "nursery concept" as a repo artifact (referenced by transcript, not confirmed in this review — flagged, not used).

## Ledger re-analysis: U46/U50 (repo evidence, from filed verdict JSONs — not from the transcript's table)

U46 (`d-newai-self-u46-verdict.json`, stationary familiar-hot diet, DET vs STOCH T=0.5 vs RES σ=0.3):
s0 two 0.525/0.475/0.47 · s1 0.515/0.550/0.530 · s2 0.355/0.450/0.415 → STOCH≥DET+0.03 on 2/3, RES 1/3. ADVANCE-PROT.

U50 (`d-newai-self-u50-verdict.json`, rotating quarters, same trio):
two — DET 0.450/0.425/0.430 · STOCH 0.540/0.490/0.455 · RES 0.590/0.505/0.430.
Margins — dRD (RES−DET): +0.14/+0.08/+0.00 · dSD (STOCH−DET): +0.09/+0.065/+0.025.
Qualifying (≥+0.03): RES {s0,s1} **sum 0.22**; STOCH {s0,s1} **sum 0.155** — sums, not means (learnings §12a wording fix preserved).
Adapt (per-quarter live rates) — s0 RES [0.9997,0.6438,0.8566,0.7147] vs STOCH [1,0.6591,0.9006,0.7544] vs DET [0.9984,0.6553,0.8519,0.685]; same pattern s1/s2 (all arms track quarters, live 0.6–1.0, shocks at 200/400/600). **No arm adapts visibly faster.** The transcript's §10 claim is CONFIRMED against ledgers: outcome benefit without adapt-speed separation. Transcript's numeric table matches the verdict JSONs exactly (two columns, all 9 cells).

**Consequence (repo evidence, owner arithmetic):** U50 shows perturbation helps *outcomes* under drift, but the ledger contains **no evidence it helps *because* the system detected change and adapted faster** — constant-diversity and adaptive-regulation accounts are both still alive. Every P1 experiment below must therefore measure outcome **and** adapt-speed, with entropy budgets matched, or it cannot separate the two accounts. This is the single most important constraint in the program.

## Triage: which programs address what (owner arbitration; battery may overturn)

- **P1 neuromodulatory control → demonstrated gap + untested capability. HIGHEST priority.** Demonstrated: U50 outcome-without-adaptation gap; U38 gate never shuts (no change-detection signal exists in the stack); E2c degenerate detector (single scalar ~zero). Untested: any state-dependent gain/plasticity. Briefs 14/15/16 → experiments E-NE1 (triggered gain), E-UNC1 (split detectors), E-ACh1 (mode scheduling). Blocker shared by all three: a non-degenerate surprise/change detector — detector work comes first, oracle-switch allowed as control arm only.
- **P5 context-sensitive control → demonstrated failures adjacent. HIGH priority, runs parallel.** Demonstrated: U38 saturation-open, U45 pressure-side death, U49 margate dead (gating changes nothing at quorum). The Anderson & Floresco distinction (brief-20) reframes all three: the gate was asked to *be* the learning; as a veto over intact associations the saturation pressure disappears. E-EXT1 (context-gated veto + no-erasure bar) is the concrete next step and reuses U38 machinery. No detector blocker — runable now.
- **P2 consolidation + replay → untested capability. MEDIUM-HIGH, sequenced after P1 detector.** Nothing in U1–U50 implements an episodic store, offline transfer, or interleaved replay; the queued "STOCH-replay" item is rehearsal, not consolidation (brief-17 correction — that queued item is REPLACED by E-CLS1, not run as filed). E-CLS1 (buffer + interleaved replay + retention bar) then E-SLEEP1 (replay-gating efficiency). Depends on E-UNC1's novelty score for the gating arm.
- **P3 reconsolidation + metaplasticity → partially tested; SPLIT.** Metaplasticity partially tested (fixed λ=2.0 suspect per Turn-180 leftovers; Abraham–Frey brief exists) — a BCM-sliding-threshold arm is owed but small. Reconsolidation proper (destabilize → update → restabilize with prediction-error gating) untested: E-STC1 (weak+strong window-dependence) is the clean entry, no architecture change. MEDIUM priority.
- **P4 multiple learning systems → untested, largest scope. LOWEST priority, do not start.** Policy-learning (which research action to take) has no substrate in the current stack (no action space, no reward beyond evals); building it now would be architecture-first, violating the minimal-experiment discipline. Parked until P1/P5 produce a regulation signal that a policy could consume.

## Separation statement (standing)

- **Biological evidence:** §§ "established" in briefs 14–20 (abstract- or full-text-verified; paywalled specifics excluded).
- **Computational analogy:** §§ "computational principle" (owner mapping; each flagged as hypothesis, with the biological limits noted).
- **Repository evidence:** U46/U50 numbers above (verdict JSONs); U38/U45/U49/E2c failure summaries (filed verdicts, not re-argued here).
- **New hypotheses:** E-NE1/E-UNC1/E-ACh1/E-CLS1/E-SLEEP1/E-STC1/E-EXT1 (each with preregistered bar + falsifier in its brief).
- **Implementation decisions:** none taken (no code, no compute, no tuning in this turn).

## Order of battle (proposed; needs battery + countersign per wave)

1. E-EXT1 (P5 — no blocker, reuses U38 driver; answers three dead verdicts at once).
2. Detector repair (E2c follow-up + E-UNC1 split — unlocks P1).
3. E-NE1 → E-ACh1 (singles, entropy-matched) → 2×2 interaction only if a single wins.
4. E-STC1 (P3 entry, independent track, runable alongside 1–3).
5. E-CLS1 → E-SLEEP1 (P2 chain).
6. P4 parked; queued U47b RAND-DET / U51 split-rest / trajectory+replay / loud-mismatch diet stay queued (E-UNC1's cue-noise arm absorbs the loud-mismatch idea — note the merge); sigma%-grid stays moot; dust stays blocked.

## Awaiting

Fresh-eyes battery on {briefs 14–20 + this synthesis} (strict 4-line format per Turn-193 lesson), then per-experiment prereg + battery + fresh countersign before any compute. NO PUSH without explicit order (this turn's docs ride the next push on order).

## v1.1 pins (battery 2026-11-26: R1 3x NEEDS-PATCH → discussion 3x CONFIRM-STANDS; doc-only, no bar changes)

- P1a (noise-regularization rival, R2-hardest): STOCH-constant arms in E-NE1/E-ACh1 ARE the matched-entropy null — if TRIGGERED/MODED ≈ STOCH-constant on both metrics, the verdict is "pure diversity," stated in the falsifiers. No new control needed; cross-referenced here so the battery's rival has teeth by construction.
- P1b (proposal-labeling, R1/R3 point 3): "extinction recruits retrieval stopping" is the Anderson & Floresco authors' thesis, marked as such in brief-20 ("Central thesis (authors' proposal)") and excluded from biological-evidence status in the separation statement. No text change needed beyond this pointer.
- P1c (veto triviality, R3-hardest): E-EXT1 no-erasure bar is now quantitative — R1 retention-in-A after B-phase must be within ±0.02 of the frozen pretrained checkpoint; GLOBAL cannot pass the context bars by construction (no context input: it must apply one suppression level in both A and B, so joint ≥0.95/≥0.95 is unreachable). Added here, brief-20 updated.
- P1d (sequencing, R2): E-CLS1 (unsupervised buffer + scheduled replay) runs WITHOUT the novelty score; only E-SLEEP1's gated arm waits on E-UNC1. Order of battle unchanged, dependency stated exactly to prevent misreading.
- REJECTED with reason: unpark P4 now (no action substrate exists; unpark trigger already filed); "U38 machinery reuse" as an objection (the context input IS the mechanism change being tested, with GLOBAL as its control).

## v1.2 pins (10x repass 2026-11-26: R1 1x IMPLEMENTABLE + 9x NEEDS-PATCH, zero analogy-as-evidence flags → discussion 10x CONFIRM v1.2; doc-only, no bar changes)
- P2a (E-NE1 timing): add SHUFFLED-TIMING arm (same total entropy, random placement). TRIGGERED must beat BOTH STOCH-const and shuffled to claim timing; beating only const = amount effect.
- P2b (detector independence): the switch detector may not be a monotone transform of the train loss/error signal (else double dissociation is loss-artifact). Prereg must formalize the metric (e.g. detector-a moves on noise-only shifts while detector-b stays within filed tolerance and vice versa, exact thresholds at prereg).
- P2c (E-ACh1 confound): quantify fresh-weight xG as effective update magnitude per arm; add G=1 ablation (scheduling without fresh-weighting) to separate the spatial-sparsity prior from the scheduling claim.
- P2d (E-CLS1 vacuous-pass guard): interference calibration first — the blocked baseline must show backward-transfer <= -0.05 (the bar must be capable of failing); if not, lengthen the diet before running.
- P2e (E-SLEEP1 tautology guard): report correlation of the novelty score with |grad|. If |r|>0.7 the score IS gradient-prioritization and the gating claim fails by construction; re-design the score.
- P2f (E-EXT1 control): add UNFROZEN arm (context gate + plastic R1 association). Predicted: behavior-pass + retention-fail — isolates the veto's value to retention, answers the strawman charge.
- P2g (P4 trigger): unpark metric quantified in the unparking prereg (e.g. a regulation signal with filed precision/recall on switch detection, or a retention-held veto) — not specified further in advance.
- P2h (seed fragility): s2 contributes 0 to both U50 sums; the finding rides on s0/s1 at n=3 (thin-seed caveat stands, restated). Next-wave diets should add seeds or a second rotation phase rather than re-running identical s0-s2.
