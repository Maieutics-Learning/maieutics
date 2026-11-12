# Emergent language survey (Peters et al., 2409.02645) + Kirby degeneration — verdict: USED / COVERED

AI-facing context: two items filed together because the survey is the
actionable one and Kirby is the closed one. Emergent-language (el)
research studies how agents invent communication protocols in referential
games; its metrics catalog is directly reusable because OUR lookup probe
has ground-truth semantics (key→value mapping), which is exactly what
metrics like topsim need. Kirby/Griffiths-Kalish iterated-learning work
says repeated cultural transmission converges to the prior and degenerates
without expressivity pressure — already covered three times over in our
trail, so no new read. Prior notes:
src/evidence/rabbithole/track-c/c4-emcomm-note.md (verdict, paraphrase
level) + src/evidence/rabbithole/track-c/w23-emcomm-metrics-note.md
(executable topsim via emlangkit, toy result). This note adds verbatim
survey quotes. Sources: scratch/track-c/w13-emlang.txt (312KB) +
scratch/track-c/w16-kirby.pdf (format-walled: scanned, 0 text blocks).

## What it is
PRISMA systematic survey: Kirby 2002 → MARL upsurge 2016–18
(Foerster/Lazaridou/Havrylov) → full taxonomy
(setting/game/environment/language-design/metrics) + standardized
notation + metrics catalog (topsim, posdis/bosdis, recon error, message
effect, causal influence, speaker consistency, inter-agent divergence,
ease-and-transfer, grounding/RSA, ...).

## Load-bearing quotes (from scratch/track-c/w13-emlang.txt)
- Necessity: "agents should learn communication by necessity or benefits
  (Luna et al., 2020) and they need a setting that rewards or encourages
  communication, e.g., an at least partially cooperative setting."
- Language as means: agents must learn "communication ... not as the
  sole objective but as a means to achieve something with meaning
  (Brandizzi et al., 2021). Accordingly, agents have to learn their own
  el to enable functionality beyond simple statistical reproduction."
- Gibberish warning: "Encouraging communication alone can lead to simple
  gibberish that helps with task completion but does not represent the
  intended natural language characteristics (Mu and Goodman, 2021).
  Providing the right incentives for language development is therefore
  crucial."
- Anti-imitation stance: el is "the methodological attempt to enable
  agents to not only statistically understand and use [language], like
  NLP models that learn on text alone."
- Grounding/RSA method: "By calculating pairwise cosine similarities
  within these spaces and then computing the Spearman correlation between
  the resulting similarity vectors, we can calculate an RSA score that
  measures the global agreement between these spaces."
- Catalog breadth (pragmatics branch): "Positive Signaling, Speaker
  Consistency, Positive Listening, Instantaneous Coordination, Message
  Effect, Causal Influence of Communication."

## Novelty delta (C5 form)
They [taxonomize emergent protocol metrics between agents] under
[referential games, MARL literature]; we [measure ignition of a fixed
lookup capability across generations] under [tiny lookup curriculum];
claim [staged fading ignites reasoning] holds — different object (their
protocols emerge between peers; our capability is taught down
generations). No precursor, no conflict. So-what: (1) metrics import for
F-new (topsim applies directly — ground-truth semantics; message-effect
needs our own operationalization per the W23 honest-negative toy);
(2) gibberish-without-incentives is second-literature justification for
F-shortcut (task success alone proves nothing, in em-comm AND our loop);
(3) necessity framing for the severance gate (§8: ignition counts only
unaided).

## Stacks
- WITH F-new/F-shortcut: the catalog splits our metrics program in two —
  topsim/RSA/posdis importable off the shelf (emlangkit executable per
  W23: topsim compositional 0.329 vs holistic −0.119, right direction);
  message-effect/causal-influence must be custom-built (W23 toy
  mis-specified → spawned W36). Stack as import-vs-invent.
- WITH severance gate: "communication by necessity" ↔ ignition proven
  only unaided. Same necessity logic; cite together in §8.
- WITH TOR: TOR steers mem/gen at inference; em-comm shows task success
  without the right incentives is gibberish. Both warn: behavioral
  readouts need incentive audits — converges on F-shortcut's rationale
  from a third direction (TOR + STOP + em-comm = triple justification).
- WITH Ren interaction phase: Ren's expressivity pressure (interaction
  prevents collapse to prior) is the positive twin of Kirby's warning
  (no pressure → degeneracy). Stack in the RSI-survey cell.

## Placement (both — metrics program + one closed item)
- NURSERY: F-new metrics upgrade — adopt topsim-style meaning–form
  mapping (directly applicable), message-effect operationalization (W36,
  custom), inter-agent divergence across seeds/generations. Executable
  path exists (emlangkit, no reimplementation). F-shortcut keeps its
  triple justification (TOR + STOP + gibberish). Round-2 input (R2):
  entropy/TTR tracking must run gated-vs-ungated (P4-style) so the
  metric distinguishes entropy-prevention from output-filtering.
- PAPER: necessity framing for §8 (severance gate); gibberish line as
  F-shortcut motivation in methods. RW-EMCOMM small cell.
- Kirby degeneration: COVERED, no new read — lives in our trail three
  times over (W3 collapse full read + conflict table; W8 RSI survey;
  W13 em-comm gibberish). Format-walled source (scanned PDF, 0 text)
  independently blocks quoting. Fourth citation adds nothing;
  redundant-coverage tag. CLOSED by reference.
- WORKSPACE: neither.

## Follow-ups
- Spawned waves W34 (emlangkit topsim.py exact choices) + W35 (EGG
  language_analysis.py) + W36 (message-effect operationalization) stand;
  owned by F-new, not by synthesis.
- No further fetches: survey fully on disk; Kirby deliberately unread
  (format-walled + redundant).
