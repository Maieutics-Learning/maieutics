# Fresh-eyes battery: doc-audit Turns 52-58 + U1 rebuildability (3x sealed, parallel via root.generateText)

Goal line carried in every prompt.

## R1 — COMPLETE (verbatim, truncated to 1800 chars in scratch raw)
**AUDIT LOG: Turn-52 through 58** / **STATUS: Sealed Review / Fresh-Eyes**. Chain of custody M3/R3 → U1 cross-referenced. M3/R3 ledgers + carry-poison mechanism present. U1 stack verified (carry→h BPTT, grad-check 2.94e-5). adaptY 0.99/0.975/0.99 vs flat 0.205/0.185/0.225 recorded; UNFREEZE-HURTS verdict closes the spike. Artifacts PRESENT: prereg, battery (truncated raws in scratch, honestly filed), verdict, CHATLOG + CURRENT_TASK. Detached scope (H/dis, vhat) explicitly noted, no ghosting. VERDICT: COMPLETE.

## R2 — NEEDS-PATCH (verbatim, truncated to 1800 chars in scratch raw; misreads repo conventions, but points at a real recipe gap)
Maps chain against rebuild-from-driver+prereg. Claims broken bridge: init weights source, generator identity, carry math as result-not-spec, arm codes as hardware map. Assessment: R2 misreads in-repo conventions (checkpoints ARE in-repo JSON ledgers via loadU1W6/loadU1M2nb; generator IS G.makeRng from src/tinynn/seeded.js; carry math IS cNew=f*cOld+(1-f)*cand with dhCarry in u1SeqBackwardFull; arm codes 108/109 ARE init salts, not hardware). BUT the underlying ask is valid: no single REBUILD recipe file existed. Patch: created `src/evidence/decomp/self-u1-REBUILD.md` (§1 checkpoints+loaders, §2 streams+RNG+load order, §3 forward/loss/backward incl. filed scopes, §4 run order + ledger names, §5 explicit R2 closures). v1.0 STANDS + REBUILD added (no rerun needed).

## R3 — (verbatim truncated in scratch raw; numbers-vs-prose + NO PUSH check)
Gate adaptY delta ~0.78 supports compose-fixed-at-cost; 0.365/0.405/0.39 vs W6 0.63/0.595/0.55 is the STD break (not an outperformance — auditor wording corrected here); gates mid-0.5 wb/wd negative = inverted think, consistent with VITAL 0/3. No prose overclaim vs verdict. NO PUSH confirmed: u1 driver + 6T + 6E + verdict + battery + logs unpushed, list explicit.

## Adjudication: 1 COMPLETE + 1 NEEDS-PATCH (adopted as doc patch only) + 1 COMPLETE-with-correction → v1.0 STANDS + REBUILD
- No spec/train/eval changes; no rerun. Raw truncated replies in scratch/fresh-eyes-doc-audit-3x.json (1800-char slices; filed honestly as truncated).
