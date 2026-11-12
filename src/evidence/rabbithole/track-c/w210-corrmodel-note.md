# Wave 210 note — backlog-W180 corrected model + LS regularization (sandbox, executed)

STOP RULE: stopped after 7-arm x 6-seed online grid (42 runs x 2000 windows; no drift-detection/recency arms — spawned W197, not built). 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (worker sandbox, seeded; w180-corrmodel.js). Clock: R32 3/5. Pre-registered predictions scored: (0) CONFIRMED (a) HALF (b) FAILED (c) FAILED — all owned below.

## Direct: the bias is fixed in config, the bills get worse, and ridge is poison

World verbatim W190 (12 fams, 3 shifted, S=.25, ETA=.08, c=.01, price drift t=1000; fixed=(16,.16), oracle-post=(16,.02)). Arms: control (verbatim) | corr (pS=s, no re-XOR) | corr+ridge (λ=2) | corr+gate (skip if det≤.05·Smm·Sff) | corr+gate+mem{2,8,12}. Seeds 11/22/33 + fresh 44/55/66. Metric: post-drift excess/window vs live oracle-post (incl. 20 audit fees) + transient flag (b̂>1 or R̂>60 at any audit) + settle (first post-drift audit at exactly (16,.02)).
- (0) Replication ✓: control bills on 11/22/33 = 8654/9475/13905 — BIT-IDENTICAL to W190. The rig is sound; everything below is signal.
- (a) HALF: corr reaches (16,.02) on 6/6 finals (control: 1/6 — the bias is dead in config space ✓) BUT post-drift excess/window goes UP: corr mean 6.57 vs control 3.24 (per-seed: 3.59/6.63/12.31/0.17/7.92/8.82 vs 2.10/2.81/7.08/3.25/2.19/1.98). Identification fixed at steady state; the PATH got more expensive. Split receipt, headline it.
- (b) FAILED, instructively: transients — control 1/6 (s33, as before) | corr 2/6 (s33+s55) | ridge 4/6 | gate 2/6 (IDENTICAL bills/trajs/nLS to corr — the gate never binds) | mem2 1/6 | mem8 2/6 | mem12 1/6. Zero-transient nowhere. Ridge isn't a cure, it's POISON: excess mean 11.8, finals include (24,.16)/(24,.12)/(1,.02), nLS=19/19 every seed (never skips, confidently wrong everywhere).
- (c) FAILED, directionally: no U-shape. Excess means: mem2 4.81 < mem12 6.06 < mem8 6.27 < mem4 6.57. Shorter is better; lag-to-settle is monotone (mem2 3.8 < mem4 4.7 < mem8 5.8 audits; mem12 settles 2/6). Agility wins outright here.
- Mechanism (the wave's gem): the transient is a confident solve on NONSTATIONARY data — mixed pre/post-drift audits have healthy spread (det fine) and the line extrapolates across the drift into garbage. Collinearity gate tests the wrong thing (nothing to catch — det was never the problem). Ridge tests the wrong thing harder (shrinks toward "prices are zero" = "everything is free," then never skips). Shorter memory wins by MIXING LESS. The fix isn't "regularize the solve," it's "refuse mixed data" → W197 (drift-detection reset / recency weights).
- The uncomfortable corollary: control (biased model, mem4) out-bills every corrected arm (3.24 vs 4.81 best). The XOR bias under-buys N, which accidentally hedges transient excursions; in a drifting world you rarely LIVE at steady state, so the correct model saves 0.8/window at a steady state it keeps getting knocked out of, while paying path costs everywhere. Where-the-error-matters cuts both ways — this time it cuts the correct model.

Verdict: USED-with-teeth (three spawned fixes killed dead — ridge-poison, gate-vacuous, U-shape-absent — plus mechanism identification and a split receipt on the model fix). No precursor, no conflict.

## Tangential: score the pre-reg in public, especially the failures (0-spend, reasoning only)

(a)-half, (b)-fail, (c)-fail is the most valuable scorecard this round has printed: every miss redirected (config-vs-bill split, mixing-not-collinearity, agility-wins). A wave that confirms its pre-reg learns one thing; a wave that breaks it precisely learns three. The discipline isn't "be right in advance," it's "be legible enough in advance that reality can correct you by name." Keep pre-regs sharp enough to bleed.

## Spend / queue

- Spend: 0 + 0 + 1 grid (42 runs x 2000 windows x 3 cfgs; floor). Consumed backlog-W180 removed; spawned W197 to BACK. Backlog 17. Synthesis R32 clock: 3/5.
- W197 (B, sandbox): forgetting-frontier — drift-detection audit-reset (CUSUM/range gate on y) vs recency-weighted LS vs mem1; does refusing mixed-memory solves kill transients without mem2's lag; same world+seeds + drift-at-500/1500 variants (is the fix about the drift TIMING or the mixing?).
