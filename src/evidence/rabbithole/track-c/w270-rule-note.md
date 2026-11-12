# Wave 270 note (execution; backlog-W230 adaptive-k(M) rule test, sandbox)

STOP RULE: stopped after 12-cell prospective rule grid (k(M)=4·sqrt(12N/M) frozen
from W250, off-grid M{180,360,720} x N{5,20} x match{.05,.15}, vs fixed k=2.5 same
M + oracle; FA at p=0, DET at p=.1). 1 direct + 1 tangential below. Spend: 0
search, 0 fetch. Clock: R42 3/5. Pre-reg scored: (a) SPLIT (N20 6/6, N5 1/6) (b)
REJECTED-steep (c) CONFIRMED-at-N20-INVERTED-at-N5.

## Direct: the rule works where it was fit (N=20) and breaks where it wasn't (N=5)

(a) N20: rule FA .027/.013/.05/.007/.007/.03 — holds ≤.05 in all 6 ✓ (M720
match.05 exactly .05, boundary touch). N5: .06/.097/.163/.027/.087/.13 — fails
5/6, only M180-match.15 passes. SPLIT: the rule is an N=20 rule wearing a general
formula; the sqrt(N) extrapolation was never fit and doesn't hold.

(b) Detection price at N20 is STEEP, not minimal: DET(rule) vs DET(fixk25):
match.05 −.15/−.014/0; match.15 −.55/−.15/−.03. Three cells miss the .05 bar by
10–50pp. REJECTED — but scored honestly against a cheating baseline: fixk25
FAILS validity in exactly the cells where it out-detects (FA .07/.073/.053),
so its det is bought with false alarms. Vs the valid oracle the rule's det
price is 0–.53 (match.15-M180: .177 vs .71 — safe but blunt). Validity holds;
sharpness doesn't come free.

(c) Fixed-2.5 fails FA in 3/12 (all N20-small-M: .07/.053/.073) ✓ — the reason
for a rule stands. But at N5 fixed-2.5 passes ALL 6 (≤.037) while the fitted
rule fails 5 — INVERSION: where noise is biggest, the dumber rule wins. Mechanism:
same-k-bigger-N-se → wider absolute margin (conservative for free); the rule's
k SHRINKS with N (1.15 at M720/N5) exactly when noise grows. The sqrt(N) in the
law points the wrong way — k should grow as N shrinks (deployment noise needs
covering), but the fitted form does the opposite. The N-scaling isn't just
uncalibrated, it's backwards.

Verdict: USED-strong (prospective kill-with-scope: holds-at-N20 + fails-at-N5 +
inversion + backwards-diagnosis). The rule graduates from "fitted" to "scoped":
valid at N=20 with priced det-cost; do not extrapolate in N. No precursor, no conflict.

## Tangential: fit-domain is the rule's jurisdiction (0-spend, reasoning only)

W250's law was fit at N=20; W230 applied it at N=5 without refit ("zero refit"
was the charter's pride — and its flaw). Zero-refit testing is correct for the
TEST; the failure is presenting a single-N fit as an (M,N) law. Rule: a fitted
rule's subscript list is its jurisdiction — k(M)|N=20 is not k(M,N), and the
untested subscript must be named in the rule's title, not discovered by its
failure. Spawned W247 accordingly (refit WITH N in the fit domain).

## Spend / queue

- Spend: 0 + 0 + 12 cells x 300 trials x 4 arms (floor). Consumed backlog-W230
  removed; spawned W247 to BACK. Backlog 17. Synthesis R42 clock: 3/5.
- W247 (C, sandbox): rule-repair — k*(M,N) grid at N{5,20} x M{180,360,720}
  (fit the constant per N: c(N)? + test margin-combination form covering
  burn-in AND deployment noise; fit domain = application domain this time).
