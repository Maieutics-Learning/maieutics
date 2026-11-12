# C4 item 4 — THINK-OR-REMEMBER: TOR (2412.18497) + Too Big to Think (2506.09099)

## TOR: "Think or Remember? Detecting and Directing LLMs Towards Memorization or Generalization" (Fu et al., NTU/Google)
- Designed datasets elicit BOTH behaviors from the same model (in-context inference on GPT-2-medium; arithmetic addition on GPT-2).
- NMD (neuron-wise mean difference): mem/gen control neurons spatially differentiated, increasingly prominent in LATER layers; last-layer differentiation appears only when output format differs between behaviors.
- A binary classifier on hidden states predicts mem-vs-gen behavior; targeted inference-time neuron interventions STEER it.
- Conclusion: LLMs do not inherently balance memorization and generalization — they need targeted guidance.

## Too Big to Think: capacity/memorization/generalization survey slice (2506.09099)
- Tension documented both ways: SOTA fails simple generalization probes (Nezhurina) AND memorizes without overfitting (Tirumala).
- Distribution point: systematic generalization depends critically on training-distribution nature + task representation (Wang: intensive↔memorization vs reasoning↔generalization; nanoGPT arithmetic generalizes 7×mult).
- SFT can amplify memorization (Chu: verbatim replication).

## C4 verdict: USED x2 (mechanism-hinge fuel)
- Direct hit on our observed shapes: memorize-lean (G1 s206, G5 s603), memorize-lock (H2 A0), heuristic-lock — these ARE the mem side of TOR's split, now with an external name and a neuron-level location (later layers).
- TOR's conclusion ("need targeted guidance") = our fade schedule described from the other side: hints are the targeted guidance that keeps the student on the gen side. Cite.
- Too-Big's distribution point corroborates curriculum-first framing: the fade IS distribution design.
- Steal (experimental): F-mech — NMD-style mem/gen neuron analysis on OUR tiny models (memorize-lean vs ignited students; tinynn is small enough for full neuron-level diff). Mechanism-hinge grade: tests whether ignition = shift of control to later-layer gen neurons. Joins F-shortcut as the two mechanism experiments.
- Precursor check (C5): they detect/steer mem/gen in already-trained models; we TEACH lookup across generations via fading. No staged teaching anywhere. Novelty holds. Tag: different-level (mechanism vs pedagogy).
- No conflict: our shapes are consistent with their story (mem side exists, guidance moves the balance).
- C5 forms: TOR — "They [detect+steer mem/gen neurons] under [GPT-2 + designed dual-behavior datasets]; we [fade hints to ignite lookup] under [nursery curriculum]; claim unaffected; so-what: guidance-framing + F-mech experiment." Too-Big — "They [survey capacity trade-off] under [pretraining/SFT literature]; we [vary curriculum, not capacity] under [fixed tiny models]; claim unaffected; so-what: distribution-design corroboration."

## C4 shelf remaining (6 items)
SDFT; curriculum-extraction distillation; SGSD + skill/mistake banks; emergent communication + reviews;
cultural-evolution degeneration warnings; AlphaZero/MuZero self-play; OPD.
