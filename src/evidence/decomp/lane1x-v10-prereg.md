# Lane 1 extras v10 — why was the aux inert (ABORT autopsy, frozen only)

Agent approval: this file. User countersign: 2026-11-23 practice program (≤5 extras/lane post-verdict).

## Why
Lane 1 ABORTED 3/3: CONST == NOAUX (diffs -0.07/-0.07/-0.015), aux never priced anything. Two candidate mechanisms: (a) nPairs rides free in the message (price for free information — vacuous); (b) aux grads swamped/mis-scaled (price too weak to matter). Both testable frozen on filed params — no trains.

## Arms (frozen; reuse d-lane1-train ledgers + d-novel-tutor; R=3)
- X1 SAVED-HEAD-READOUT: saved CONST + FADE aux heads' nPairs acc on 200 fresh messages (same channel/test recipe as lane1 eval). Bar HEAD-READS: mean head acc >= 0.70 (message carries pair-count through the priced path).
- X2 CENTROID-PROBE (arm-agnostic, incl NOAUX): per-arm centroid classifier (mean message per nPairs on 100 fit lines, 200 fresh test). Bar FREE-RIDES: NOAUX probe >= 0.70 (pair-count decodable with no price ever paid).

## Expectation
Both high (message carries length regardless — the 8000-step state has room). Then ABORT mechanism = (a): price for free information. If X2 low but X1 high: price taught something task-irrelevant (b-variant). Filed openly.

## Cost
Frozen (message forwards only). Driver runLane1X. Ledgers `d-lane1x-x1-s{seed}.json` (heads) + `d-lane1x-x2-s{seed}.json` (probes) + verdict. NO PUSH.
