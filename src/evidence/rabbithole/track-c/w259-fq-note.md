# Wave 259 note (execution; backlog-W221 hard-fq residual, sandbox)

STOP RULE: stopped after 48-cell grid (pit{.2,.3,.4,.5} x D{2,3,4,6} x t0{U,E,L},
dud-extended hard world mu1.3/d1.3/pd.09, expanding theta.5, 2000 trials) with fq
decomposition. 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (vendored
w204 verbatim + decomposition counters). Clock: R40 4/5. Pre-reg scored: (a)
CONFIRMED-exact (b) CONFIRMED (c) CONFIRMED-bit-exact.

## Direct: onset alone closes the last hard residual; the expanding rule is an early-transient detector

Receipts: base cell (pit.2/D2/U) bit-replicates W239 (2.75/.0897/.2319); delay =
2.75 AND esc = .0897 BIT-IDENTICAL across all 48 cells (pers set fixed by pip —
trans-only knobs cannot move them by construction, verified exactly, not
approximately). The sweep machinery is sound; fq moves alone.

Closer (a): pit.2/D2/**E** reads fq = **.4009** vs target .40 — onset alone
(U→E, zero other changes) closes the residual EXACTLY. W239's gap was the
uniform-onset assumption, not the transient budget. Second closer: pit.5/D6/U =
.4071 (extreme-budget uniform route — same target, honest alternative, prefer
the minimal). Dose curves bracket both (W239's rule): E-column fq across pit =
.40/.52/.63/.74; U-column = .23/.25/.27/.28→.41 at the extreme.

Temporal asymmetry (b): ALL late-onset cells fq ∈ [.18,.21] — late transients
fire at ~clean background (fqT ≈ fqC ≈ .19), INVISIBLE to the expanding rule.
Early: fqT .77–.94 (dip dominates the cumulative mean). Uniform: fqT .29–.45.
The expanding cumulative mean dilutes late dips over 9+ samples and never trips —
onset response is a CLIFF between early and late, with uniform in the middle.
fqC noise floor ≈ .18–.19 throughout (own drift .1778→.1928 as the clean subset
shrinks with pit).

Mechanism: the expanding rule's memory is its onset filter — cumulative averaging
weights early evidence maximally, so "more transients" only closes fq if they
arrive early. Budget (pit/D) scales the close; onset decides whether budget CAN
close. W221's ledger entry: hard-t5 fq CLOSED (onset-specified), hard ledger now
fully closed on t5 (esc W239 + fq here).

Verdict: USED-strong (residual closed exactly + bit-exact invariance + cliff
mechanism + two closers with dose curves). No precursor, no conflict.

## Tangential: the residual was a missing subscript (0-spend, reasoning only)

"fq .23 vs .40" read as a budget gap (needs MORE transients) for a full round;
it was an onset gap (needs EARLIER transients) — same numbers, different
subscript, 10x cheaper close. Whenever a residual persists under budget sweeps,
check whether the swept axis is even the one the rule reads: the expanding rule
doesn't count transients, it weighs early evidence. Residuals name their missing
subscript when the sweep varies the rule-blind axis. Spawned W238 accordingly
(fixed-onset response curve: cliff location, graded-or-step, D-shift).

## Spend / queue

- Spend: 0 + 0 + 48 cells x 2000 trials (floor). Consumed backlog-W221 removed;
  spawned W238 to BACK. Backlog 17. Synthesis R40 clock: 4/5.
- W238 (C, sandbox): onset-response curve — fixed t0 {1..8,12,16} x D{2,4} x
  pit{.2,.4} on the dud hard world (fq vs onset step: cliff location, graded or
  step, D-shift of the blind point; does the E-close survive t0=2,3?).
