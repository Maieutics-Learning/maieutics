# Brief-19 — Redondo & Morris (2011): synaptic tagging and capture

**Verified citation.** Redondo RL, Morris RGM. "Making memories last: the synaptic tagging and capture hypothesis." *Nature Reviews Neuroscience* 2011; 12(1):17–30. PMID 21170072. DOI 10.1038/nrn2963. Verified via PubMed E-utilities 2026-11-26. Type: review (revising the original Frey & Morris 1997 hypothesis). Grounded in the **abstract** (full text paywalled). Note: the transcript's "synaptic tagging and capture review (2020)" row does **not** resolve to this paper; no 2020 review was independently verified — the hypothesis is grounded here in its canonical 2011 revision.

## What the review actually establishes (abstract-verified)

1. Core hypothesis: induction of synaptic potentiation creates only the **potential** (a local, synapse-specific **tagged** state), **not the commitment**, for lasting change.
2. **Other neural activity, before or after induction**, determines whether persistent change occurs (plasticity-related products captured by tagged synapses).
3. Revision over the original: **tag induction and LTP expression are dissociable**; **functional and structural plasticity differ** mechanistically — the revised theory must incorporate specific molecular/structural processes.
4. **Behavioral translation**: new behavioral studies had (as of 2011) experimentally translated the hypothesis to learning and consolidation of newly formed memories (the "behavioral tagging" line).

## Established vs debated

- **Established (in vitro):** tag/capture in hippocampal slices (weak-tetanus + strong-tetanus pairing within a time window; protein-synthesis dependence) — replicated across labs pre-2011.
- **Translated but thinner (behavioral tagging):** weak memory + novel/strong event → long-term memory; real effect, smaller literature, boundary conditions debated (timing windows, novelty type, replication robustness).
- **Debated:** exact tag molecules and timescales; how far slice mechanisms explain behavior; structural-plasticity branch. The abstract itself flags the needed revision, which is honesty, not weakness.
- **Not verified:** any specific 2020 update; treat transcript's 2020 row as ungrounded until a PMID is attached.

## Computational principle for Maieutics

**Two-factor persistence**: (i) a local, cheap, activity-set **tag** marking *which* experience/trace is eligible, and (ii) a global, expensive **consolidation resource** (strong/novel event) that is *captured* only by tagged traces within a time window. This is transcript Priority 3's "selective stabilization" — and it is structurally different from everything in the U-series: current ledgers treat every train step's plasticity as equal and permanent. STC says: make most plasticity *provisional*, commit only tagged traces when a separate significance signal arrives.

## Minimal experiment (current stack, small)

**E-STC1 (weak + strong pairing).** Diets: weak task (few reps, normally forgotten — verify forgetting in a WEAK-ALONE control) paired with a strong/novel event (separate salient diet block) inside vs outside the window (BEFORE/AFTER ±lag arms) vs STRONG-ALONE. Bar: paired-inside-window retention ≥ strong-task levels on the weak evals while paired-outside-window ≈ WEAK-ALONE (window-dependence is the signature, not just "more training helps"). Falsifier: no window-dependence (inside ≈ outside) → no capture-like effect in this substrate; the weak trace is either learned or not, and two-factor persistence buys nothing. File per-arm retention curves, not just endpoints.

## Dependencies

A demonstrably-forgettable weak diet (calibration step, small); no architecture change (tag = per-trace eligibility scalar; resource = post-strong-event consolidation gate). Combines with E-CLS1 later (tags *select* what replay transfers — E-SLEEP1's gating score could *be* the tag), but run alone first.
