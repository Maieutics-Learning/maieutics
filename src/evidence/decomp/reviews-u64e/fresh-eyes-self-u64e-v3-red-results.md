# Fresh-eyes U64e v1.2 red-team results (10 sealed kill-shots, parallel)

**Premise:** `reviews-u64e/premise-u64e-v1.2.md` (frozen 2026-11-27). **Replies verbatim:**
`reviews-u64e/red-v1.2-1..10.md`. **Method:** format red-team; sealed, one Promise.all.

## Round-3 verdicts: 10 claimed kills → 5 adoptions (2 full + 3 partial), 5 rejected
- red-1 flat-surprise (trigger never fires on frozen weights).
- red-2 hit-rate comparison as F2 diagnostic.
- red-3 stratified control tautology.
- red-4 stream-swap fragility.
- red-5 floor unreachable (resets raise scores).
- red-6 demotion variance + three-way tie coin-flip.
- red-7 rotation evades consecutive-cap; demotion variance.
- red-8 rigged-either-way.
- red-9 frozen-weights decoupling; qkCount=0 at b1.
- red-10 never-dead = infinite spawn; LINE-HALT stops shape not program.

## Adjudication
**ADOPTED → v1.3 (5):**
- D1 per-window margin pattern (red-9 nuance): rec1 cannot benefit from resets
  (nothing stale in window 1 yet) → filed prediction rec1≈dice, gains in rec2/3;
  verdict-time pattern check, diagnostic only. (The "decoupling" charge itself is
  rejected: trigger→reset→different picks→different accRec is mechanical coupling.)
- D2 hit-rate-gap diagnostic (red-2): report surBlind-vs-randBlind blindHit gap at
  verdict time (F2 input). Partial: not "the" arbiter — one input among margins.
- D3 floor-vestigial one-liner (red-5 partial): floor-trip unlikely by construction
  (resets raise; U64b held 20/20) — floor kept for same-exam continuity AND the REAL
  safety valve is NEITHER-WITH-DIAGNOSIS, stated. INCONCLUSIVE stays reachable via
  dice collapse (not via live arms).
- D4 generation cap 6, W0-asserted (red-7 rotation REAL): consecutive-shape cap
  replaced by TOTAL cap — max 6 follow-up generations citing U64e shapes; each
  follow-up verdict carries generation g+1; its W0 asserts g+1 ≤ 6 else HALT
  (driver-enforced, cross-prereg). Rotation cannot evade a total.
- D5 termination-lives-in-countersign (red-10 partial): filed sentence — no automatic
  negative verdict exists BY OWNER ORDER 2026-11-27 (diagnose-and-improve); the
  program halts iff the owner declines a follow-up countersign (NO compute without
  countersign IS the halt — mechanical, not prose). LINE-HALT stops shapes; the
  countersign gate stops the program. Owner may also order a KILL-LINE close at any
  time (stated, never pre-authorized).
**REJECTED with reasons:**
- red-1 as kill (flat-surprise = F4 monitor-blind, FILED shape with detectRate
  diagnostic + U64h follow-up — the experiment is designed to measure exactly this;
  kill converts to a measured branch. Filed expectation already labels it Hypothesis).
- red-3 tautology (randBlind uses NO trigger — random steps by design; demotion
  compares OUTCOMES not trigger densities; "inability to hit the trigger" IS the
  control condition. Misreading of the demotion logic).
- red-4 stream-swap (quorum 15/20 + 0.0207 IS the stream-robustness instrument;
  swap = post-data re-draw = new version + battery + countersign per Falsifiers).
- red-5 main charge (answered by D3; floor kept w/ vestigial note, INCONCLUSIVE
  reachable via filed dice — same exam, same floor).
- red-6 variance (quorum guards; answered) + three-way tie (priority order IS the
  filed deterministic tiebreaker with rationale — deterministic ≠ arbitrary).
- red-7 demotion-variance restatement (C7 proof stands; variance is priced in quorum).
- red-8 rigged (restates red-3/red-6: demotion firing = information that timing
  doesn't matter, not rigging; control-blind case = no demotion, judged alone).
- red-9 decoupling (rejected above; D1 keeps the true nuance).
- red-10 program-infinity as kill (answered by D4 total cap + D5 countersign-halt;
  never-dead is an owner order, not a design flaw — the design bounds it).
**Score:** 5 findings → 5 adoptions (2 full: D4/D5; 3 partial: D1/D2/D3).

## Output
- v1.3 patch (below) → premise v1.3 → focused re-close (6 fresh scouts; barren closes
  per loop-closure) → STANDS → countersign. Compute UNLICENSED throughout.
