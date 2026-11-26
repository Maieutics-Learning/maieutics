# Brief-20 — Anderson & Floresco (2022): retrieval stopping and the extinction of emotional memories

**Verified citation.** Anderson MC, Floresco SB. "Prefrontal-hippocampal interactions supporting the extinction of emotional memories: the retrieval stopping model." *Neuropsychopharmacology* 2022; 47(1):180–195. PMID 34446831. PMCID PMC8616908 (CC-BY open access). DOI 10.1038/s41386-021-01131-1. Verified via PubMed E-utilities 2026-11-26. Type: **theory/synthesis review with novel hypotheses** (explicitly so). Grounded in the **full text** (BioC XML, read 2026-11-26) — the only brief in this set with full-text grounding.

## What the paper actually argues (full-text-verified)

1. **Retrieval stopping** (intentional termination of retrieval of an unwanted memory, think/no-think paradigm): right lateral PFC suppresses hippocampal (+ amygdala, + neocortical) activity via a **domain-general inhibitory control** mechanism shared with action stopping; repeated stopping reduces intrusions and affective tone.
2. **Extinction** (repeated unreinforced CS presentations reduce conditioned responding) is historically framed as associative learning, not cognitive control.
3. **Central thesis (authors' proposal):** extinction *recruits* prefrontally-mediated retrieval stopping; fear extinction spontaneously engages stopping across species; stopping recruits extinction circuitry. Presented as hypothesis + "novel hypotheses derived from this theoretical synthesis" — the paper's own framing.
4. Two differences dissolved as "more apparent than real": **intentionality** (real-world stopping has no overt cue either; gradual declines reflect growing certainty the response is unneeded) and **content** (conditioning elicits affect + memories + actions in parallel; control targets all three — a "memory adaptation problem").
5. Clinical hook: reconceptualizing extinction to integrate mnemonic inhibitory control improves its relevance to PTSD/intrusive thought (Ledoux & Pine two-system alignment).

## Established vs debated

- **Established:** PFC–hippocampus coupling during retrieval suppression (two decades, replicated); repeated suppression reduces later intrusions; extinction phenomenology itself.
- **Proposal (not proof):** the causal role of stopping *in* extinction. Full-text-verified as the authors' synthesis claim, supported by analogy + selected animal/human evidence, not by a decisive experiment. Treat as a design hypothesis with strong circumstantial backing.
- **Useful distinction the paper forces:** *stopping retrieval* (control signal, reversible, content- and context-specific) vs *unlearning the association* (weight change). Extinction-as-learning erases slowly and generalizes poorly (renewal/spontaneous recovery — cited in-text as the reason extinction is not erasure); stopping-as-control is immediate and deployable but must be re-applied.

## Computational principle for Maieutics

**Separate the stop signal from the weight change.** Current gate work (U38/U45/U49) conflates them: the gate *is* the learning. Anderson & Floresco say: keep the association intact and add a **context-gated retrieval veto** (works-under-A-not-B = retrieve R1 iff context=A, with R1's weights untouched), *plus* a slow associative update underneath. This directly answers transcript Priority 5 and the U45 post-mortem ("pressure-side death"): U38's gate saturated open because it was asked to *be* the learning; as a veto over intact associations, saturation pressure disappears.

## Minimal experiment (current stack, small)

**E-EXT1 (context-gated veto vs global suppression).** Two-rule diet: rule R1 valid in context A, invalid in context B (context = observable cue slot). Arms: (a) GLOBAL (single suppression weight, no context input — the U38 design); (b) VETO (suppression weight computed from context cue; R1 association weights frozen from a pretrained checkpoint, veto learned only); (c) NO-VETO control. Bars: context-appropriate behavior (apply R1 in A ≥ 0.95, suppress in B ≥ 0.95 — preregister thresholds) **and** R1 retention when re-tested in A after B-phase (no-erasure check: veto arm must not lose the association). Falsifier: VETO ≈ GLOBAL on both bars → context input adds nothing and the inhibition-vs-extinction distinction does not cash out in this substrate. File veto values per context (the audit trail U38 lacked: USES diagnostic with teeth).

## Dependencies

U38 driver (gate machinery reusable; diagnose-first: confirm saturation replicates); a two-context diet (new, small); frozen-association checkpointing (exists: U41-style step discipline). No architecture change.

## Battery note (2026-11-26, P1c)
No-erasure bar is quantitative: retention of R1 in context A after the B-phase must be within ±0.02 of the frozen pretrained checkpoint. GLOBAL (no context input) cannot pass the joint context bars by construction.
