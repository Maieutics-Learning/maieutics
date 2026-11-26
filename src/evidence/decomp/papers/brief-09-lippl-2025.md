# Brief 09 — Lippl & Stachenfeld (2025), "When does compositional structure yield compositional generalization? A kernel theory"

Source: `scratch/papers/lippl-2025.txt` (arXiv:2405.16391, ICLR 2025). Theory + deep-net validation (ConvNets/ResNets/ViTs, 20–40K samples).

## Mechanism (three claims)

1. Compositionally structured KERNEL models are restricted to CONJUNCTION-WISE ADDITIVITY: assign a value to each component-combination seen in training, then sum. Cannot learn (much less generalize) non-additive tasks: context-dependence and TRANSITIVE EQUIVALENCE are impossible in principle (A=B, B=C ⇏ A=C). Transitive ORDERING is solvable — superficially similar, formally different.
2. MEMORIZATION LEAK (even on learnable tasks): ℓ2-minimization spreads weight onto the full conjunction (f12≠0 whenever conjunctive salience S(2;2)>0), distorting test outputs by a PROPORTIONAL factor m = p·S(1;2)/(1+(p−2)S(1;2)). Exact: m<1 always; smaller salience + smaller training set p → worse. Interpolation vs extrapolation does NOT matter.
3. SHORTCUT BIAS: when a spurious feature predicts much of training (context predicts 2/3 in CD-3), models use context shortcut + full conjunction for the rest → 0% on CD-3 vs 100% on CD-1/2. Outcome is knife-edge sensitive to depth/nonlinearity (geometry sets salience) — explains the divided disentanglement literature.

## Deep-net validation (numbers)

- ConvNets (MNIST) / ResNets / ViTs (CIFAR-10), categories permuted ×10 runs: responses highly predicted by conjunction-wise-additive model; test predictions compressed proportionally (memorization leak in all three); slope ↑ with component distance (less conjunctive geometry) and ↑ with training-set size; interpolation≈extrapolation (one p=4 exception); context-dependence CD-1/2 above chance, CD-3 BELOW chance.

## Author-stated limits

- Kernel regime only; no quantitative bounds; sequences/other formats out of scope; other learning mechanisms could escape §§4–5 (Appendix F initial example).

## Bench mapping (our wall)

- This is the FORMAL VERSION of our wall. Our trunk is a statistical learner on entangled 8-dim encodings; our compose task (hop: qk→v binding) is arguably NON-ADDITIVE (it requires transitive use of the round-1 result — exactly the class kernel models cannot do). U34's price-on-compose getting 1/3 with all-positive deltas reads like a memorization-leak signature: partial proportional improvement, never the rule.
- Two concrete diagnostics for our ledgers (no new compute):
  (a) PROPORTIONALITY: plot two_c1 vs two_canon across seeds — leak predicts compressed slope m<1, not scatter. U34 deltas (+0.035/+0.045/+0.085 over canon ~0.5–0.57) are consistent with m≈1.06–1.15... actually ABOVE 1 — check direction carefully in debate; leak predicts UNDERshoot of the additive ideal, and our c1 BEATS canon on s2. The debate must resolve whether U34 looks like leak or like genuine (partial) rule-learning.
  (b) SHORTCUT AUDIT: is there a context feature predicting 2/3 of our training rows (CD-3 analogue)? Our miner stream identity / query-key overlap with support are candidates. If yes, our trunk may be shortcutting — test by ablating the suspected shortcut feature at eval (teeth: shortcut-removed rows should collapse a shortcut model, spare a rule model).
- Design consequence: if our compose task is formally non-additive for our architecture class, NO pressure within the class installs it (cf. U35 structural verdict) — the fix must change the COMPUTATION CLASS (Appendix F pointer: "other learning mechanisms could overcome"), e.g. explicit variable-binding machinery, not stronger incentives. This is the strongest form of the "stop scaling pressures" argument and must be debated against Briefs 01/02 (which say incentives suffice).
- Salience as a KNOB: component distance manipulates conjunctivity (Fig 5a). Bench analogue: separate vs overlap the query/key encodings (our E[qk] vs enc distance) — a manipulable geometric variable we have never swept.

## Concrete test + falsifier

- Test: shortcut audit (identify top spurious correlate of labels in our streams; eval with it removed/neutralized) + proportionality check (c1 vs canon slope across seeds/runs).
- Falsifier: if no spurious feature predicts >60% of training AND c1-vs-canon slope ≈1 with intercept shift (not proportional compression), the leak/shortcut account is wrong for our bench — file scoped, keep incentive framing.
- Predicts: end-to-end modular architectures WITHOUT explicit additivity constraints will NOT specialize (cited failures) — warns against "just add heads" proposals (our K=5 heads are unconstrained; consistent with INH-USE 0/3 hollowness).
