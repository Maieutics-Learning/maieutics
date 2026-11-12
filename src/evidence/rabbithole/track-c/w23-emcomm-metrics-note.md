# W23 — em-comm metrics code: emlangkit API + toy topsim (GROUP A)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

Direct: locate executable topsim/message-effect implementations behind the W13 metrics catalog.
Spend: 1 scout (DDG: EGG toolkit + emlangkit surfaced first-try) + 2 primaries (emlangkit root
tree via API + README 4.4KB raw). At cap.

## What the source gives (olipinski/emlangkit, PyPI, py3.9–3.12, tested)

Single entry point: `Language(messages, observations)` (two numpy arrays) with standardized inputs.
Available metrics + modules: entropy, mutual information, topsim (`metrics.topsim`),
posdis/bosdis (`metrics.posdis/bosdis`), M^n_previous (`metrics.mpn`), Harris articulation
(`metrics.has`), non-compositional NPMI (`metrics.nc_npmi`). Provenance: base metrics from EGG
(Kharitonov et al. EMNLP 2019) and Kucinski et al. NeurIPS 2021 code; posdis/bosdis from Chaabouni
et al. ACL 2020; topsim lineage Brighton & Kirby 2006. Related libs listed: EGG, HarrisSegmentation,
categorial-grammar-induction. This is the executable counterpart of the W13 catalog — F-new no
longer needs reimplementation, just adaptation.

## Mapping to F-new (now concrete)

Our lookup probe HAS ground-truth semantics (key→value mapping), so topsim applies directly:
meaning distances = key-semantic distances, message distances = student-output distances.
posdis/bosdis = disentanglement of hint components (which hint positions carry the lookup signal —
speaks to the attention-fires/lookup-stalls hinge). entropy/MI = the entropy/TTR side F-new already
planned. Message-effect/causal-influence (does the retrieved value causally drive the answer) is the
one metric WITHOUT an emlangkit module — needs our own operationalization (open, spawned).

## Sandbox check (rule 2, toy scale)

Worker toy: 8 keys with 2D ground-truth semantics; compositional student (symbol-per-coordinate)
vs holistic-memorized student (arbitrary codes). topsim(compositional)=0.329 vs
topsim(holistic)=-0.119 — separates in the right direction (small-n attenuates magnitude; real
probe needs 40+ items for stable Mantel estimates). Message-effect toy was MIS-specified
(compositional decoder ignored the intervention, holistic flagged everything) — honest negative:
causal-influence operationalization for the lookup probe remains open → spawned as its own wave.

## Verdict: USED (source-level, Group A)

Executable metric API + provenance chain (EGG → emlangkit → our probe). No precursor (analysis
toolkit, different object), no conflict. Stays improvement target per rule 4.

## Spawned (appended to BACK)

- W34 (A): emlangkit `metrics/topsim.py` source — exact distance/correlation choices (Spearman vs
  Pearson, Mantel permutations) → F-new spec numbers.
- W35 (A): EGG `egg/core/language_analysis.py` — message-effect-adjacent utilities + what EGG
  measures that emlangkit doesn't.
- W36 (A): message-effect/causal-influence operationalization for the lookup probe (own design,
  from the honest-negative above) → F-new + F-shortcut.
Standing tangential slot stays open. Synthesis R2 clock: 2/5 new verdicts.
