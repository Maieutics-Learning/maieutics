# Self U1 REBUILD — exact rerun recipe for a contextless model (patches doc-audit R2)

Goal: rerun U1 (checkpoints-not-freezers) from repo files alone. No external weights, no cluster, no hidden state.

## 1. Checkpoints are in-repo ledgers (not binaries)
- Trunk init W6-s{seed}: `src/evidence/decomp/d-newai-w-w6-s{seed}.json` (fallback `d-newai-w-w6-s{seed}-800st.json`), field `.P` = {E,W1,b1,Wf,bf,Wc,bc,Wh[5],bh[5],Hv,bv}.
- Notebook init M2-nb-s{seed}: `src/evidence/decomp/d-newai-self-m2-nb-s{seed}-800st.json`, field `.P` = {Wq,Watt,batt}.
- Loader functions in driver: `loadU1W6` + `loadU1M2nb` (in `src/evidence/decomp/newai-selfu1-driver.js`). Copy exact mapping; do not reinit randomly.
- New params (critic+gate ~53): `u1MakeParams(G.makeRng(75000 + seed*7919 + armCode*131))`, armCode 108 (gate) / 109 (flat). Same scheme as R3.

## 2. Stack + RNG (seed-only streams, no external generator)
- TinyNN: `src/tinynn/nn.js` + `src/tinynn/seeded.js` via `IntrinsicInit` (provides `G.makeRng`, `G.Adam`, `inParam`).
- Driver load order (see `SelfU1Init`): intrinsic → newai → v102 → fr → div → cur → winner → selfmr → selfm2r2 → selfm3r3 → selfu1. Each via workspace `fs.readTextFile` + indirect eval (worker `execute_js` has `fs`; page `fetch` also works for reads).
- Streams per seed (all `G.makeRng`, twin-matched): init above; data `42000 + seed*104729 + 55`; masks `91000 + seed` (5×H48 halves via `fr.int(10)<5?2:0`); standard eval `52500 + seed` (+`52501`/`42001` for gate-mean); adapt eval `61000 + seed`; supports `42000 + seed*104729 + 999`. Mixed diet coin = `dataRng.int(2)` inside the batch loop (paired across arms by construction — same stream order, same C=6 pick logic as R3).
- `genAdaptEpisode` comes from `newai-selfmr-driver.js` (2 in-episode novels, 4 supports, 1 missing-answer query). Episode object: `{query: e, sup: [{qk,v}]}`.

## 3. Model + step (unfrozen full-graph)
- Forward: `inSeqForward` (v102, LEN=10, D=12, CD=8, H=48, C=4, K=5). Pass1 `e.x` with `c0=zeros(8)`; retrieve `m2ReadForward`; gate `g=σ(we*H/log4 + wb*beta + wd*dis + b)` (flat forces 0); `ensV = hv1 + g*read`; `vhat=argmax`; pass2 `x2m=[9×6,qk,k,vhat,8]` with `cOld=fw1.cNew`.
- Loss per sample: `CE(mean2,y) + 0.5*CE(ensV,v) + 0.5*BCE(beta,wrong1)` (wrong1 uses current vhat as fixed label — vhat-stability scope).
- Backward (unfrozen): `u1SeqBackwardFull` for both passes (includes carry→h feedback that v102/intrinsic omit by design — filed), `u1ReadBackward` for notebook WITH E grads (m2r2 version discards E by design; U1 adds E for keys/vals/query via stashed `fr.qkId`), `u1CriticHBackward` for beta→h path. Gate-input grads via H/dis detached (filed scope). Grad-clip global 1.0, Adam lr 5e-3 single (known limitation — U2 proposes split lrs).
- `u1GradCheck` validates this scope: base-forward fixes H0/dis0/vhat0/wrong10, numeric vs analytic on W1/E/Hv/Wq/Watt/we/wb/wd/b/Wc; PASS threshold abs-guarded, filed worstRel 2.94e-5.

## 4. Run order + ledger names (COMPLETE-gated resume-safe)
```
runU1Train {arm: u1-unf-gate|u1-unf-flat, seed: 0,1,2}  # 800st/B16 → d-newai-self-{arm}-s{seed}-800st.json
runU1Eval  {arm, seed}                                 # N=200+200 → d-newai-self-eval-{arm}-s{seed}-800st.json
```
- 6T+6E total. Each train ledger `.P` saves FULL unfrozen weights (M + MP + RP) so evals reload exact state (see `runU1Eval` loader).
- Verdict: compare `d-newai-self-eval-u1-unf-gate-s*.json` vs `-flat-` (SEL), vs filed frozen `d-newai-self-m3r3-verdict.json` r3-gate/r3-flat + W6 two (FIX/STD), gates wrong/right (VITAL), adaptY/adaptV ratio (GAP). Filed verdict `d-newai-self-u1-verdict.json` = UNFREEZE-HURTS (compose-fixed-at-cost).

## 5. R2 gaps closed explicitly
- Weights: in-repo JSON ledgers above, not external `.bin`/`.pt`. Mapping in `loadU1W6`/`loadU1M2nb` + eval reloader.
- Generator: `G.makeRng` from `src/tinynn/seeded.js` (seed-only streams listed in §2); no custom stream-buffer.
- Carry math: `cNew = f*cOld + (1-f)*cand`, `f=σ(Wf h+bf)`, `cand=tanh(Wc h+bc)`; full BPTT in `u1SeqBackwardFull` (dhCarry term); poison = fw1.cNew from missing-answer pass1.
- Arm codes 108/109 are just new-param init salts (`u1ArmCode`), not hardware/cluster config. CPU/in-worker only, NO GPU.
