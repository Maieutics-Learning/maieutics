# Literature checks — representation review citations (2026-11-27)

Method: OpenAlex `works?search=` per title+authors (top-5, full records saved
`scratch/lit-checks-openalex.json`); LangGraph via upstream README
(`scratch/langgraph-readme.md`). Verdicts below. Raw JSON is the record.

## Biological — all CONFIRMED exact

1. **Heald, Wolpert & Lengyel (2023), "The Computational and Neural Bases of
   Context-Dependent Learning" — CONFIRMED.** Annual Review of Neuroscience,
   doi:10.1146/annurev-neuro-092322-100402, review, 101 cites. Abstract matches
   the cited claim: context typically uncertain under naturalistic conditions,
   necessitating contextual inference; hippocampal/prefrontal linkage. Highest-
   priority status endorsed.
2. **Sanders, Wilson & Gershman (2020), "Hippocampal remapping as hidden state
   inference" — CONFIRMED.** eLife, doi:10.7554/elife.51140, 172 cites. Abstract
   matches (remapping formalized as hidden-state inference; what counts as a
   context change). Bonus finds for the synthesis: Duvelle et al. 2023 eLife
   review (splitter signal / latent-state inference); **Mishchanchuk et al. 2024
   Science (doi:10.1126/science.adq5874): ventral hippocampus REQUIRED for
   hidden-state inference in mice** — causal evidence strengthening this line.
3. **Yu & Dayan (2005), "Uncertainty, Neuromodulation, and Attention" —
   CONFIRMED.** Neuron, doi:10.1016/j.neuron.2005.04.026, 2007 cites. (OpenAlex
   carries no abstract; the paper is the canonical expected/unexpected-
   uncertainty → ACh/NE mapping.) The transcript's caution ("theoretical basis,
   not a ready-made detector") is correct and should be retained — this paper
   does not license thresholds.

## AI/systems — all real, three citation-precision corrections

4. **DreamerV3 — CONFIRMED with CORRECTION.** The work is real but the citation
   conflates two versions: canonical preprint "Mastering Diverse Domains through
   World Models" (arXiv:2301.04104, **2023**) vs peer-reviewed "Mastering diverse
   control tasks through world models" (Nature 2025, doi:10.1038/s41586-025-
   08744-2, 2650 cites). Cite with version + arXiv ID. The RSSM characterization
   (deterministic recurrent + stochastic latent state) is accurate — closest
   precedent status endorsed, with the caveat that DreamerV3 demonstrates
   world-model control, NOT the U60 gates (no context-posterior-vs-oracle,
   no cue-reliability separation, no causal-use test).
5. **Memora (2026) — CONFIRMED.** ICML 2026, arXiv:2602.03315 (Xia et al.),
   22 cites. Abstract matches (abstractions indexing concrete values, cue
   anchors). Caveat: very recent (Feb 2026 preprint), thin citations — treat as
   early, not established infrastructure.
6. **Hindsight (2026) — CONFIRMED.** ACL 2026 demo track
   (doi:10.18653/v1/2026.acl-demo.27, 16 cites); preprint Dec 2025 under the
   slightly different title "Hindsight is 20/20" (arXiv:2512.12818, 75 cites).
   Four-network separation (world/experience/observation/opinion) + retain/
   recall/reflect confirmed from abstract. Caveat: **demo track**, not a full
   paper — weight accordingly.
7. **MemOS (2025) — CONFIRMED with DISAMBIGUATION WARNING.** Exact title match:
   arXiv:2507.03724 (Li et al., 265 cites). Same-year name collision:
   "Memory OS of AI Agent" / MemoryOS (Kang et al., EMNLP 2025, 406 cites) is a
   DIFFERENT team/paper, plus a same-group follow-up "MemOS ... for Memory-
   Augmented Generation" (arXiv:2505.22101). Always cite with arXiv ID.
8. **LangGraph — CONFIRMED.** langchain-ai/langgraph, MIT-licensed, self-
   described "low-level orchestration framework for building stateful agents"
   (Klarna/Replit/Elastic users; py + JS). The transcript's characterization
   (stateful workflow orchestration; does not itself learn a latent
   representation) is accurate.

## Relevance assessment (for the gated lit synthesis)

No hallucinated references: 8/8 real, characterizations directionally accurate.
But none of the AI systems is a plug-in solution to U60 — all are LLM-agent
or RL-at-scale systems; none demonstrates context-posterior-vs-oracle,
cue-reliability separation, or causal-use gates. The transcript already carries
this caution ("closest precedent", "no biological reproduction"); retain it and
add per-item caveats above. Additional directly-relevant read for the synthesis:
**Zheng et al. 2024 Nat Commun (doi:10.1038/s41467-024-52289-3): PFC-MD circuit
model for rapid ONLINE context inference via Hebbian plasticity** — closest
biological-side analog to the F1 fast-statistic direction.
