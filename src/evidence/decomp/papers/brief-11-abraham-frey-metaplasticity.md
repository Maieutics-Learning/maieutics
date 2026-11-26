# Brief 11 — Abraham (2008), "Metaplasticity: tuning synapses and networks for plasticity" (+ Frey & Morris 1997)

Sources: `scratch/papers/abraham-2008.txt` (Nat Rev Neurosci 9:387 — NOTE: the outside opinion cited doi 10.1038/nn.1243, which is WRONG (that resolves to an unrelated nicotine paper); correct DOI is 10.1038/nrn2356); `scratch/papers/frey-1997-abstract.txt` (Frey & Morris, Nature 385:533-6, PMID 9020359 — full short-paper abstract on file).

## Mechanism (metaplasticity = plasticity OF plasticity)

- Definition: a PRIMING bout changes the state of neurons/synapses so a LATER bout induces LTP/LTD differently; the change OUTLASTS the priming (distinguishes it from overlapping modulation). Induces no overt strength change itself (cleanest cases).
- Forms: (a) NMDAR priming RAISES the LTP threshold (60–90 min decay; recoverable by stronger tetanus — threshold shift, not blockade) and can block persistence even when LTP is induced; (b) BCM SLIDING THRESHOLD θM tracks time-averaged postsynaptic firing (high activity → LTP harder, LTD easier) — homeostasis against runaway potentiation; Ca2+-based variants same idea; (c) HETEROSYNAPTIC: BLA stimulation ≤15 min before/after perforant-path HFS facilitates LTP persistence (protein-synthesis-dependent, cholinergic + β-adrenergic); (d) INTRINSIC plasticity (AHP suppression/amplification, I_h) regulates induction thresholds cell-wide.
- SYNAPTIC TAGGING & CAPTURE (Frey & Morris 1997; Abraham §§): weak tetanus sets a short-lived protein-synthesis-INDEPENDENT TAG (<3h; in vivo <30 min); strong stimulation elsewhere synthesizes PRPs (e.g. PKMζ); tagged synapses CAPTURE PRPs → late LTP. Works LTD too; tag deletable by LFS; compartment-localized (basal≠apical dendrites — a computational feature); somatic proteins protect cell-wide.
- Design difficulty (stated): plasticity and metaplasticity co-induce; overlapping mechanisms; hard to isolate experimentally.

## Bench mapping (our wall)

- This is the missing TIMESCALE in our bench: our plasticity (Adam steps) has NO metaplasticity — every step faces the same thresholds. BCM says thresholds should slide with recent activity; tagging says weak events should leave tags that later strong events consolidate.
- Directly implementable WITHOUT architecture change:
  (a) BCM-SLIDING AUX WEIGHTS: scale auxW/lam by trailing activity (e.g. if recent loss-drop is high, RAISE the bar for further change — prevents U34-style over-chasing; if flat, LOWER thresholds to admit LTD-like unlearning). This is a principled alternative to our fixed lam=2.0.
  (b) TAGGING protocol: rows with weak-but-nonzero signal set a tag (decays over N steps); a later strong-signal row on a related query triggers CONSOLIDATION (extra replay/weight on tagged rows). Our streams are i.i.d. — tags would implement cross-step credit assignment we currently lack. The <30min in-vivo tag life maps to a short tag horizon (tens of steps).
  (c) HETEROSYNAPTIC analogue: a strong event in stream family A lowers induction thresholds in family B for a window (cf. Brief 07 staging; cf. U1–U6 interference — metaplasticity says interference is REGULATED, not merely suffered).
- E2c autopsy via tagging: E2c's surprise-gate failed because nothing was ever "tagged" (miner==trunk, no differential) AND no "PRP event" ever occurred (no strong surprise) — tagging theory predicts EXACTLY this null: tags without proteins decay; proteins without tags diffuse. A tagging design must create BOTH.
- U31f dilution via BCM: uniform random diets produce uniform time-averaged activity → θM slides to make everything equally (un)learnable — predicts flat lifts on homogeneous diets. Heterogeneous diets keep local thresholds differentiated.

## Concrete test + falsifier

- Test: BCM-scheduled aux (auxW scaled by trailing loss-drop: high-drop → lower auxW; flat → higher auxW) + tag-and-capture replay (weak rows tagged, consolidated on later strong related rows, 30-step horizon) vs fixed-aux + uniform replay. Bar: RET/COMPOSE gain at quorum.
- Falsifier: yoked-tag control (same consolidation budget on RANDOM rows instead of tagged rows). If yoked matches, tags carry no information; file scoped. Also threshold-direction check: if INVERTED scheduling (high-drop → higher auxW) matches, the BCM analogy is backwards for our substrate.
- Predicts: metaplasticity helps only when priming and test events are TEMPORALLY SEPARATED but related — our paired round-1/round-2 structure is already this shape; the mechanism belongs BETWEEN the rounds (on the carry), not inside either.
