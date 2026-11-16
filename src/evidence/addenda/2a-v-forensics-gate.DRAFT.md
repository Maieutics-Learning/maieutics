# COUNTERSIGNED addendum (user countersign 2026-11-16 — applied to GAMEPLAN v22 as 2.a.v)

## Proposed: Phase 2.a.v — forensics signoff gate (borrow-gameplan item 1)

**Text to insert** (as new sub-step `2.a.v`, after `2.a.iv`):

> - **v. Forensics signoff gate.** Every ledger-producing run passes the forensics kernel (`src/tools/forensics.js`) before its verdict is filed: registered checks run on the run fingerprint + ledger rows; any kill-check failure => verdict KILL, gate fails closed. Overriding KILL is a logged verdict (decision `OVERRIDE` + who/why note in the filed signoff record), never a bypass; a `PASS` signoff over a `KILL` evaluation is refused by the kernel. Kernel is Zero-UI (pure logic, caller-owned persistence) and ships its own self-test.

**Motivating failure (raw log):** ix-signflip expectation error — a per-brain effect graded with a pooled metric (filed 2026-11-16); a registered "metric-matches-grain" check would have tripped before the verdict. Plus the B-switch honesty correction (filed) — thresholds that move need a signoff trail.

**Gates on this insertion:** Zero-UI check (no state-manager/UI dependency — holds: kernel has no DOM/storage/network references, asserted at runtime by `__forensics_main` check 6); raw-log failure citation (above).

**Status:** kernel implemented + self-test green; countersigned 2026-11-16; applied to GAMEPLAN v22 as 2.a.v. Frozen-driver wiring now authorized.
