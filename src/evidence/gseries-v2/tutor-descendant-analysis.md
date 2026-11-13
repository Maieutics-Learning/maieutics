# Tutor-descendant analysis (free, zero new runs — 2026-11-12)

Question (handoff §5 tutor qualification): does a tutor's own score predict its students?
Data: src/evidence/gseries-v2 G1–G5 ledgers (individual -summary.json files are
authoritative; -results.json halves checked against them; G2 assembled from
g2-s301–s308 summaries because g2a/g2b splits are partial).

## Tutor → next-generation outcome

- T0 (killA 1.00, Hd 0.60 — weakest tutor) → G1 8/8, mean Hd 0.851
  (g1a 201–204: 0.815/1/0.62/0.645; g1b 205–208: 1/0.985/0.955/0.79).
- s202 (Hd 1.00, perfect lowest-seed) → G2 6/8, mean Hd 0.661
  (301 0.95 T, 302 0.70 T, 303 0.595 T, 304 0.115 F, 305 0.655 T, 306 0.48 F, 307 0.795 T, 308 1.00 T).
- s308 (Hd 1.00, sole perfect) → G3 7/8, mean Hd ~0.883.
- s405 (Hd ~1.00) → G4 8/8, mean Hd ~0.929 (best generation).
- s502 (Hd 1.00, sole perfect) → G5 6/8, mean Hd ~0.753.

## Reading

Own-score does not predict teacher-quality in this sample: the weakest tutor (T0,
Hd 0.60) produced a perfect 8/8 with a high mean, while perfect tutors produced
6/8 (s202, s502), 7/8 (s308), and 8/8 (s405). The promotion rule in §8.1
(highest-Hd → killA → lowest-seed) therefore picks a good student, not a proven
teacher. Perfect-tutor variance (6/8 vs 8/8 at Hd 1.00) is itself the finding:
teacher-quality varies independently of own-score at fixed arch/pool/schedule.

## Limits (owned)

- n=5 tutor points, one family, h48 only — a pattern, not an estimate. No CI claimed.
- Confound: tutor identity covaries with generation index (later gens may drift for
  other reasons); within-tutor replication (same tutor × fresh student sets) not run.
- G2 assembly mixes result-file halves with per-seed summaries; per-seed summaries win
  on conflict (they match the paper's 6/8).

## Implication (supports handoff §5, no new abstraction needed)

Tutor selection needs a descendant term: keep the Hd gate (no weak tutors) but break
ties / promote by descendant ignition rate once observed (runner-up reservoir,
F-diversity-reservoir spec), not by lowest-seed. Cheapest test with zero new runs:
re-simulate promotion — would picking G2's s302 (Hd 0.70, mid) over s308 have changed
G3? Answerable from saved blobs (runner-up lineage) without training anything new.
If descendant-quality beats own-score there too, adopt it as the promotion rule.
