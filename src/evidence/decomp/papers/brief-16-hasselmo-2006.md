# Brief-16 — Hasselmo (2006): acetylcholine and the encoding-vs-retrieval switch

**Verified citation.** Hasselmo ME. "The role of acetylcholine in learning and memory." *Current Opinion in Neurobiology* 2006; 16(6):710–715. PMID 17011181. PMCID PMC2659740. DOI 10.1016/j.conb.2006.09.002. Verified via PubMed E-utilities 2026-11-26. Type: review. Grounded in the **abstract** (full text open at PMCID above but read via abstract here; mechanism details below are abstract-verified; any use beyond the abstract must re-read the full text first).

## What the paper actually establishes (abstract-verified)

1. Pharmacology: **both muscarinic and nicotinic** ACh receptors contribute to encoding new memories.
2. Anatomy: localized lesions and antagonist infusions pin down **where** (locus of cholinergic effects).
3. Cellular/computational effects of ACh: **increases strength of afferent input relative to feedback**, contributes to **theta rhythm**, activates **persistent-spiking** intrinsic mechanisms, and **increases synaptic modification**.
4. Regional note: effects in **entorhinal/perirhinal cortex and hippocampus** matter for **encoding new episodic memories**.

## Established vs debated

- **Established:** receptor pharmacology of encoding; anatomical loci; the afferent-vs-feedback shift and theta/persistent-spiking effects (each replicated pre-2006 experimental lines the review summarizes).
- **Model-level (proposal):** the computational link from those cellular effects to memory function is explicitly "computational modeling links…" — a principled mapping, not a direct measurement.
- **The encoding-vs-retrieval switch** (high ACh = encode/afferent-dominated; low ACh, e.g. SWS = retrieve-consolidate/feedback-dominated): well-supported as a framework, and it dovetails with Diekelmann & Born 2010 (brief-18: minimal cholinergic activity during SWS coordinates redistribution). Region- and task-dependence (transcript §8's caveat) is real and shared by the source.
- **Not verified here:** any quantitative parameter, any claim from the transcript's reading links beyond this paper. The transcript's "Hasselmo — ACh and Memory" row resolves to this paper.

## Computational principle for Maieutics

An **encoding/retrieval operating mode**: in ENCODE mode (high-ACh analogue) the system up-weights fresh input, permits synaptic change, and suppresses feedback/recurrence; in RETRIEVE/CONSOLIDATE mode (low-ACh analogue) it up-weights existing structure and permits replay-driven redistribution. This is the concrete mechanism behind transcript Priority 1's "separate encoding/retrieval control" — and it is testable without any new network: a scheduled mode variable multiplying (afferent gain, plasticity gate, feedback gain).

## Minimal experiment (selection-only, current stack)

**E-ACh1 (mode scheduling under drift).** On the U50 rotating diet: (a) DET anchor; (b) constant-plasticity control; (c) MODED: post-switch ENCODE window (K steps: fresh-slot weight ×G, plasticity on, feedback weight ×g<1) then RETRIEVE mode (inverse) — with **total plasticity budget matched** to (b) (lr × steps equalized) so the test isolates *scheduling*, not *amount*, of plasticity. Bar: same U50 outcome + adapt-speed double metric as E-NE1. Falsifier: MODED ≈ matched-budget constant control on both metrics → scheduling adds nothing; the U50 benefit is pure diversity, not regulation. Detector dependency identical to E-NE1 (switch must be detected, not oracled — oracle-switch allowed as a control arm only).

## Dependencies

U50 driver; switch detector (same blocker as E-NE1); no architecture change. Pairs naturally with E-NE1 as a 2×2 (gain-timing × plasticity-scheduling) only *after* each is tested alone — do not run the interaction first (attribution discipline per transcript §9).
