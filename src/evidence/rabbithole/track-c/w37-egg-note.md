# W37exec — EGG language_analysis module (Group A; backlog-W36)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 1 primary, under budget)
- Fetched `facebookresearch/EGG` `egg/core/language_analysis.py` raw (200, 11.8KB, MIT, read whole 352 lines). Dump in `scratch/track-c/w37-language-analysis.py`. URL is the durable ref.
- Contents: `gap_mi_first_second` (top-2 MI gap / entropy — posdis/bosdis core) + `entropy_dict`/`calc_entropy`/`mutual_info` + `MessageEntropy` callback + `TopographicSimilarity` callback (distance dict edit/cosine/hamming/jaccard/euclidean, `pdist` + `spearmanr(...).correlation`, gumbel argmax, train/test flags, JSONL prints) + `Disent` (posdis/bosdis, doctests: miniature bosdis 1.0, posdis 0.978656) + `PrintValidationEvents` (dumps sender_input/labels/message/receiver_output from `Interaction` at final epoch).
- Verdict USED source-level: upstream of emlangkit confirmed (EGG returns `.correlation`; emlangkit W35 adds `pvalue`). Executable training-loop instrumentation, not post-hoc only. Message-effect/causal-influence still absent — confirms W23 honest negative; stays own-design (backlog-W37 already queued, no duplicate).
- Sandbox honesty: torch-dependent callbacks + doctests recorded as executable spec, not run in worker (no torch here); numbers pinned by doctests. No toy this wave.

## Tangential (reasoning, 0 spend)
- Defaults match emlangkit (hamming meanings / edit messages) — same recipe, two provenances. F-new rule: log effect size (EGG correlation) + significance (emlangkit pvalue), per W31 discipline. Spawned W52 (interaction.py + game logging: the `Interaction` hook for a message-effect probe).

## Spend / queue
- Spend: 0 + 1 (under budget). Consumed backlog-W36 removed; spawned W52 to BACK. Backlog 16. Synthesis R3 clock: 4/5.
