# W30 — memory vs retrieval: RAG + Parametric RAG (GROUP B)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

Direct: must the student internalize lookup, or retrieve it? Both ends from source.
Spend: 1 scout + 2 primaries (2005.11401 RAG 220KB + 2501.15915 Parametric RAG 288KB, mined).
At cap.

## RAG original (2005.11401): the non-parametric end

Parametric memory (seq2seq BART) + non-parametric memory (Wikipedia dense index, DPR retriever),
jointly fine-tuned. Two marginalizations: RAG-Sequence (one doc per answer) vs RAG-Token
(per-token, different docs per token). SOTA on NQ/WebQ/CuratedTrec; unconstrained generation beats
extractive priors on extractive tasks. Killer properties: hot-swappable indices (update knowledge
without retraining) + provenance (decisions cite documents). DPR retriever pre-trained on
TriviaQA/NQ answer-bearing passages.

## Parametric RAG (2501.15915): the internalized end — and our question, published

Documents encoded into LoRA weights OFFLINE (augment ~3|d| + encode ~9|d| ≈ 12|d| decode-cost per
doc), online = retrieve → update → generate with the ORIGINAL prompt. Beats in-context RAG on
complex-reasoning benchmarks. Two load-bearing findings: (1) long in-context knowledge hurts
reasoning (Liu/Levy 2024 — context length is not free even when it fits); (2) BM25 ≥ dense
retrievers in some settings (adopted BM25 + Elasticsearch — simplicity wins). Cost split explicit:
offline preprocessing (affordable, one-time) vs online inference (clean, no context bloat).

## Mapping: fade IS RAG-to-parametric annealing

Early fade stages (hints in context) = in-context RAG; late stages = parametric retrieval;
severance = pure parametric test. Parametric RAG's complex-reasoning win predicts our core bet:
lookup must be internalized, not carried in context — hints that stay in-context forever cap
reasoning (finding 1). LoRA-as-parameterization converges with the W17/W28 adapter line (third
vote: adapters as the knowledge vehicle). Hot-swappable indices → hint-set swapping without
retraining (spawned). BM25-beats-dense → our retrieval baselines should start simple.

## Sandbox check (rule 2, toy breakeven)

In-context (quadratic context + reasoning penalty) vs parametric (12|d| offline + clean queries):
breakeven at ~1 query for 10–40 stable docs — direction: internalize EARLY for small stable key
sets; magnitudes toy. Qualitative match with the paper (internalize wins on reasoning). Our 40-pair
probe sits in the internalize-early regime → fade schedule justified as cost-optimal annealing,
not just pedagogy.

## Verdict: USED (source-level, Group B)

Both ends of the axis + the annealing reframe + cost split. No precursor (QA systems, not
teaching), no conflict. Improvement target per rule 4.

## Spawned (appended to BACK)

- W44 (B): hot-swappable hint indices — swap hint sets without retraining (RAG property ported
  to curriculum design; multi-topic hint libraries).
Standing tangential slot stays open. Synthesis R3 clock: 3/5 new verdicts.
