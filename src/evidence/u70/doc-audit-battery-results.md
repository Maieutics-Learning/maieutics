# Fresh-eyes U70 doc-audit battery — orientation check (2026-11-27, 4 scouts)

Target: src/evidence/u70/README.md (start-here map for a contextless agent). Ask: verdict + single hardest orientation failure + cheapest fix, <=150 words.

## Adjudication (owner of verdict: agent, append-only)
- R1 (missing-file hunt): NEEDS-PATCH, ACCEPTED — battery file-naming pattern was missing. Patched: naming patterns added to conventions section.
- R2 (verdict-chain clarity): NEEDS-PATCH, ACCEPTED — chain vs table conflict + no current-state pointer. Patched: CURRENT STATE header added (Step 18/18, F10 v1.1 active arch, FIXED-scoping sentence).
- R3 (battery/ledger conventions): NEEDS-PATCH, ACCEPTED (convergent with R2 on FIXED-scoping) — FIXED misread as global. Patched: same CURRENT STATE scoping ("that wave's locked pooled bars met, never global").
- R4 (push/countersign discipline): NEEDS-PATCH, ACCEPTED (convergent) — chain covers neural subset only, skips Steps 0-7 + bio. Patched: CURRENT STATE header marks Step 18 + active step; table remains the full sequence.
- Score: 4/4 NEEDS-PATCH, 4 adopted (1 unique gloss + 1 scoping sentence + 1 naming block, all in one pass). No re-close run (doc patch is mechanical, verified by re-read).
