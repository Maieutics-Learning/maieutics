# C4 item 8 — Emergent communication (survey 2409.02645) + F1 advance

## "Emergent Language: A Survey and Taxonomy" (Peters et al., Wuppertal/Drexel/USC, 2024; 2409.02645, 312KB text)
- PRISMA-based systematic survey: history (Kirby 2002 → MARL upsurge 2016–18 Foerster/Lazaridou/Havrylov) →
  full taxonomy (setting/game/environment/language-design/metrics) + standardized notation + metrics catalog:
  topsim, posdis/bosdis, recon error, message effect, causal influence of communication, speaker consistency,
  inter-agent divergence, ease-and-transfer, etc.
- Key lines for us: (1) "communication by necessity" (Luna) — agents need settings that reward communication;
  (2) gibberish-without-incentives (Mu & Goodman) — task completion alone breeds shallow codes; measurability of
  syntax/semantics/pragmatics (Chaabouni) is the hard part; (3) el uses language as MEANS, not objective —
  vs LLM statistical imitation (Mordatch/Browning critique).

## C4 verdict: USED
- Metrics catalog → F-new upgrade: beyond entropy/TTR, adopt topsim-style meaning–form mapping (our lookup HAS
  ground-truth semantics, so topsim is directly applicable), message-effect/causal-influence (does the student's
  retrieved value causally drive the answer?), inter-agent divergence across seeds/generations. F-new expanded.
- "Communication by necessity" ↔ severance gate: ignition is PROVEN only when the student must solve unaided —
  necessity framing for §8.
- Gibberish-without-incentives = second-literature justification for F-shortcut (W4): task success alone doesn't
  prove genuine lookup, in emergent-comm AND in our loop.
- Precursor check: they study emergence of protocols between agents; we teach a fixed capability across
  generations. Different object, no precursor. No conflict.

## F1 advance (tangential)
- Survey repo confirmed live: github.com/ArminAzizi98/looped-lm-survey with data/ docs/ scripts/ dirs.
- Next: fetch tree/main/data listing, then grep the ledger for transmission-family rows (teacher/student/
  curriculum/fade/distillation). Deferred to W14 (W13 fetch budget spent: emlang + repo page).
