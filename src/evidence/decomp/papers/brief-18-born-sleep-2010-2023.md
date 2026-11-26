# Brief-18 — Sleep and systems consolidation: Diekelmann & Born (2010), Brodt & Born (2023)

**Verified citations.**
- Diekelmann S, Born J. "The memory function of sleep." *Nature Reviews Neuroscience* 2010; 11(2):114–126. PMID 20046194. DOI 10.1038/nrn2762. Verified via PubMed E-utilities 2026-11-26.
- Brodt S, Inostroza M, Niethard N, Born J. "Sleep — A brain-state serving systems memory consolidation." *Neuron* 2023; 111(7):1050–1075. PMID 37023710. DOI 10.1016/j.neuron.2023.03.005. Verified via PubMed E-utilities 2026-11-26. **This resolves the transcript's "Born (2023)" row.**
- Type: both reviews. Grounded in the **abstracts** (both paywalled full text).

## What the reviews actually establish (abstract-verified)

2010 (Diekelmann & Born):
1. Sleep optimizes consolidation depending on learning conditions and sleep timing; consolidation in sleep produces **quantitative and qualitative** changes.
2. **SWS supports system consolidation** (slow oscillations + spindles + ripples, at **minimum cholinergic activity**) — coordinated re-activation and redistribution of hippocampus-dependent memories to neocortex.
3. **REM supports synaptic consolidation** (plasticity-related immediate-early genes, **high cholinergic + theta activity**) — subsequent synaptic consolidation in cortex.

2023 (Brodt & Born — update, same lead lab, 13 years on):
1. **Repeated replay of neuronal firing patterns is the basic mechanism triggering consolidation during sleep *and* wakefulness*.**
2. During sleep, replay occurs in SWS (hippocampal assemblies + ripples + spindles + slow oscillations **+ noradrenergic activity**) and favors transformation of hippocampus-dependent episodic memory into **schema-like neocortical memory**.
3. **REM after SWS may balance** local synaptic rescaling with global homeostatic renormalization.
4. Key comparative claim: beyond greater efficacy, sleep consolidation differs from wake consolidation mainly in that it is **supported, rather than impaired, by spontaneous hippocampal replay** — replay possibly *gating* memory formation in neocortex.

## Established vs debated

- **Established:** sleep benefits retention (behavioral, massive replication); replay exists in sleep and wake (rodent electrophysiology, replicated); SWS oscillations coordinate hippocampal–neocortical dialogue; low-ACh-during-SWS / high-ACh-during-REM neuromodulatory pattern.
- **Framework (not settled):** the clean SWS=system / REM=synaptic division (2010) is softened by 2023 itself (replay in both states; REM's role framed as "might balance"); the synaptic-homeostasis/global-renormalization account of REM is an active hypothesis, not a measurement.
- **Not verified:** the transcript's thalamic-spindle/slow-oscillation mechanistic sentences beyond what the two abstracts state; any 2025 LC–hippocampus review (not resolved to a PMID — excluded from ground truth).

## Computational principle for Maieutics

**Offline replay-gated transfer with state-dependent plasticity**: alternate ONLINE (encode experiences into the fast store, plasticity open, retrieval sharp) and OFFLINE (replay fast-store episodes interleaved to the slow store under low-"ACh" conditions, then a renormalization pass). The 2023 comparative claim gives the design its teeth: offline transfer should be *gated by replay content*, not a fixed schedule — replay selects what transfers.

## Minimal experiment (current stack, small)

**E-SLEEP1 (replay-gated vs scheduled transfer).** Build on E-CLS1's two stores: (a) ONLINE-ONLY control (no offline phase); (b) SCHEDULED offline (fixed interleaved replay, cf. E-CLS1); (c) GATED offline (replay probability per episode ∝ its prediction-error/novelty score from the online phase). Bar: retention (E-CLS1 backward-transfer bar) with *fewer* replay steps in (c) than (b) at equal retention — efficiency, not just efficacy. Falsifier: (c) ≈ (b) at matched replay budgets → gating adds nothing; fall back to scheduled replay. File replay selections per episode (auditability = the CLS "what transfers" question answered in ledger form).

## Dependencies

E-CLS1's episodic buffer first (no buffer, no replay); a per-episode novelty score (the same detector E-UNC1 builds — shared infrastructure, good). No architecture change.
