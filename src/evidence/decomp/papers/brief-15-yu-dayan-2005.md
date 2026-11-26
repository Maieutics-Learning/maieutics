# Brief-15 — Yu & Dayan (2005): expected vs unexpected uncertainty, ACh vs NE

**Verified citation.** Yu AJ, Dayan P. "Uncertainty, neuromodulation, and attention." *Neuron* 2005; 46(4):681–692. PMID 15944135. Verified via PubMed E-utilities 2026-11-26. Type: **theory/model proposal** (Bayesian framework + proposed experiments, not an experimental report). Grounded in the **abstract** (full text paywalled).

## What the paper actually proposes (abstract-verified)

1. Optimal inference in changing environments requires representing and manipulating **different forms of uncertainty** in a Bayesian framework.
2. **Acetylcholine signals expected uncertainty**: known unreliability of predictive cues *within* a context.
3. **Norepinephrine signals unexpected uncertainty**: unsignaled context switches producing strongly unexpected observations.
4. The two signals **interact** (part-antagonistic, part-synergistic) to enable optimal inference and learning; the paper proposes a class of attentional cueing tasks involving both modulators.
5. Status claim (authors'): consistent with a wealth of physiological, pharmacological and behavioral data — i.e. a unifying proposal, explicitly framed as "we propose."

## Established vs debated

- **Established context:** that ACh and NE both modulate attention/learning is pharmacology textbook; the paper's contribution is the *computational assignment* of the two uncertainty types.
- **Proposal (not proof):** the ACh=expected / NE=unexpected mapping itself. It is a theoretical proposal in 2005; subsequent literature is mixed (e.g. ACh also implicated in novelty responses; NE effects task- and region-dependent). Treat as a **design hypothesis**, not a fact.
- **Direct relevance to the transcript:** this paper *is* the missing citation behind transcript §5's "expected vs unexpected uncertainty" rows — the transcript's taxonomy is faithful to Yu & Dayan. The LC/hippocampus 2025 review the transcript cites for prediction-error gating was **not** independently verified here (no PMID established) — do not treat it as ground truth.

## Computational principle for Maieutics

**Two separate uncertainty variables with different consumers**: (i) a within-context reliability estimate (ACh analogue) that down-weights known-noisy cues — a *caution* signal against overlearning; (ii) a context-change estimate (NE analogue) that up-regulates exploration and learning rate — a *revision* signal. They must not share one scalar: E2c's failure (degenerate single disagreement detector, always ~zero) is exactly what a collapsed uncertainty representation predicts.

## Minimal experiment (selection-only, current stack)

**E-UNC1 (split detectors).** On a diet with *both* manipulations crossed 2×2: cue-noise (expected uncertainty: some slots permanently noisy) × quarter-switches (unexpected uncertainty: hot set rotates). Measure two detectors: (a) cue-reliability tracker (running per-slot error rate), (b) switch detector (global prediction-error spike). Bar: double dissociation — (a) responds to noise level, not switches; (b) responds to switches, not noise level; each drives its own consumer ((a)→caution weight on noisy slots, (b)→triggered gain per E-NE1). Falsifier: if the two detectors cannot be dissociated (both fire on both manipulations), the split buys nothing in this substrate and the single-scalar design stands. Preregister detector definitions and thresholds; file both detectors' traces as diagnostics regardless of outcome.

## Dependencies

Requires the same non-degenerate surprise signal as E-NE1; cue-noise diet construction is new but small (slot-dependent label noise). No new architecture.
