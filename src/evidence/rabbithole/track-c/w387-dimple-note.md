# Wave 387 (execution; backlog-W327 batch-dimple replication, bench) 2026-11-12
STOP RULE: stopped after 6-cell x 40-seed grid (3 slices + receipt probe).
1 direct + 1 tangential below. Spend: 0 + 0 + 8 runs-worth (6x40 + 2x20
receipt). Script scratch/track-c/w327-dimple.js (rig 74/74 line-verified
from w293-curves.js); grid scratch/track-c/w327-grid.json.

## Direct: LR.15/B24 is a true V-dimple; LR.12/B32 is the top of a decline

- RECEIPT: 20-seed fate counts exact vs w293-grid (all 6 fields, both
  cells) — the 40-seed extension builds on the confirmed bench.
- (a) PASS (on the bar): LR.15/B24 settleFrac .60 at 40 seeds (24/40,
  se .077) — still dimpled, gaps +.178/+.175 to neighbors (≈2.4 se).
  The crater is real, not 20-seed noise (it FILLED from .45 to .60 but
  held the floor — filling toward the bar, not through it).
- (b) PASS: LR.12/B32 .385 at 40 seeds (15/39, se .078) — holds low,
  consistent with the .35 at 20 seeds.
- (c) SPLIT: LR.15 is a V (B20 .778 / B24 .600 / B28 .775 — symmetric,
  width ≤ ±4, both neighbors ≥ +.15); LR.12 is NOT a V — B24 .769 → B32
  .385 → B40 .300 keeps falling. B32 is the top of a decline, not a
  dimple; the floor is right of B40 (pending W344). Same "dimple" word,
  two different shapes — the audit split them.
- Arrival-speed: medFlip 10 in 5/6 cells (flips arrive fast everywhere);
  lone laggard LR.12/B24 (flip=1 @360). Speed doesn't explain the shapes
  (fast flips at every frac from .3 to .78).
- Side: NaN 4/40 at LR.15/B20 (T.0335), zero everywhere else (T ≤ .0306)
  — bar-top geography holds (NaN lives above T≈.032, clean below),
  consistent with W293's bar-hunt.
- Verdict: USED with teeth (w387-dimple-note.md is this file). Exact
  receipt + replicated V with measured width + decline reframed (not a
  dimple) + speed ruled out + NaN bar-top held. Spawned W344
  (decline-floor + dimple-width, bench: LR.12 x B{48,64} — does the
  B24→B40 decline floor or keep falling; LR.15 x B{22,26} — is the B24
  dimple one-B wide; receipt anchors vs w293+W327).

## Tangential: filling toward the bar is confirmation, not erosion

- B24 rose .45 → .60 with doubled seeds and stayed ≥.15 below both
  neighbors — a dimple that fills halfway to the bar but stops is MORE
  confirmed, not less (noise would have filled through). Rule: a retained
  gap after doubling n is the finding; the direction of the wobble is
  weather. Don't let "it moved up" read as "it's going away" while the
  gap stands.
