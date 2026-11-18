# Fresh-eyes v4 readability r2 (2026-11-18) — on v4.2
R2-1: 5/6 FIXED (seeds, nUniq, thermometer, bars, W). STILL CONFUSING: synthetic length-matched (nulls vs synthetic). Rewrite: Nulls: (a) shuffled-ear, (b) blind-tutor+real-ear, (c) synthetic equal-length buckets. Any meets bar => demote.
R2-2: BLOCKED on dense provenance sentence. Replacement offered (operational steps).
Adjudication: ACCEPT both (wording only, no substance change).
Patch → v4.3 wording: null (c) = synthetic equal-length buckets (same lengths/bands, random content); provenance as 4-step list (1 load bundle only 2 RNG disjoint list 3 nUniq recount 4 finite else ABORT).
