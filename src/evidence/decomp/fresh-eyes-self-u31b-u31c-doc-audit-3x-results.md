# Doc-audit battery: U31b + U31c trail reproducibility (3x sealed, parallel; user-ordered pre-U31d check)

Method: ONE page_eval, Promise.all of 3 root.generateText calls. Each reviewer saw ONLY the trail-inventory artifact + the claim "a contextless agent can reproduce U31b/U31c from the filed docs alone" + ≤150-word return shape (VERDICT / numbered GAPS / single most load-bearing missing piece). No reviewer saw any other artifact.

## Verbatim
R1: VERDICT: GAPS-FOUND / 1. newai-selfu31b-driver.js: exact line-diff for the INH weight-load bug fix (no comments, logic implicit). 2. d-newai-self-u31b-verdict.json: missing grad-check value (lives only in transcript Turn-137). 3. All: missing the 30 unpushed backlog files. MOST LOAD-BEARING: the specific code change for the U31b INH bug.
R2: VERDICT: GAPS-FOUND / 1. d-newai-self-u31b-verdict.json: missing gradcheck field (4.2e-8 only in narrative). 2. CODE: drivers lack markers for the INH fix; line changes unguessable. 3. RUNS: U31c lacks train/eval ledgers; verdict embeds diagnostics (non-standard flow). MOST LOAD-BEARING: the specific code delta for the INH bug.
R3: VERDICT: GAPS-FOUND / 1. newai-selfu31b-driver.js: fix lines unidentifiable without comments/diffs. 2. d-newai-self-u31b-verdict.json: missing gradcheck field, breaks data-chain. 3. U31c stage-1 probe ledgers missing; numbers in verdict only. MOST LOAD-BEARING: mapping of the INH fix to source.

## Adjudication (3/3 GAPS-FOUND, converging on 3 points)
1. ACCEPT (3/3): driver carried no fix markers. Repaired comment-only (no behavior change): D1 comments added at both INH load sites in newai-selfu31b-driver.js (train line ~95, eval line ~210) pointing at d-newai-self-u31b-verdict.json D1. Ledgers/gradients unaffected (comments only; re-verified by clean page_refresh).
2. ACCEPT (3/3): U31b verdict has no gradcheck field. Verdicts are closed records (not edited post-hoc). Repaired by first-hand measurement instead: re-ran u31bGradCheck -> d-newai-self-u31b-gradcheck.json (worst 4.2159490252258546e-8, PASS=true), matching the transcript-cited 4.2e-8. Hearsay converted to artifact.
3. PARTIAL (R2-gap-3, R3-gap-3): U31c stage-1 had no ledger. Repaired by first-hand measurement: re-ran u31cStage1 x3 -> d-newai-self-u31c-stage1-s{0,1,2}.json (keep-rate 0.0000 3/3, tripwire fails confirmed). VOID reading now rests on ledgers, not verdict-embedded numbers.
4. REJECT (R1-gap-3): "30 unpushed backlog files missing" is a reviewer error — unpushed (not yet git-pushed) is not missing; all files exist in workspace src/ and are inventoried (25 U31-family files verified present + sized this session). Corrected in log; reviewer confused push state with existence.
Round score: 3 accepts (2 full + 1 partial), 1 reject-as-error. Trail now reproduces: spec -> battery -> driver (with fix markers) -> gradcheck ledger -> stage-1 ledgers -> trains/evals (U31b) or VOID (U31c) -> verdict. Pre-U31d doc gate: PASS.
