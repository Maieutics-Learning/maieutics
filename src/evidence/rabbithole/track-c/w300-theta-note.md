# Wave 300 (execution; backlog-W255 blind-point vs theta, sandbox) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).

- DIRECT: 30-cell grid (theta{.3,.5,.7} x t0{1..8,12,16} at pit.2/D2, base W221, 2000 trials;
  w221-fq.js verbatim + fixed-t0 branch; script scratch/track-c/w255-theta.js, grid w255-grid.json).
- RECEIPTS: theta.5 column replicates W280 pit.2/D2 EXACTLY (all 10 fq, delay 2.75, esc .0897);
  delay/esc bit-identical across t0 WITHIN each theta (3.14/.1264; 2.75/.0897; 2.43/.0759) —
  theta moves pers firing (stricter → later delay, more escapes), t0 does not. Both as pre-regged.
- (a) HOLDS-strongly: blind-point (first fq<.30) moves 1 / 3 / 8 for theta .3/.5/.7 — monotone,
  rule strictness sets the address. (b) HOLDS, both halves at once: stricter theta STEEPENS the
  grade (max adjacent drop .0787 > .0664 > .0496) AND shortens the visible range — strictness
  compresses visibility into early onsets and steepens the fall. E-close does NOT survive
  theta.3 (t0=1 reads .2991, below the [.37,.43] bar at the first step); at lax theta.7 t0=1
  reads .4991 (survives upward trivially — laxer fires more). The E-close is a theta.5 address,
  not a world address.
- Verdict: USED-strong (w300-theta-note.md is this file). Spawned W272 (theta-D interaction).
- TANGENTIAL (reasoning, 0 spend): a threshold parameter that moves the blind-point 1->8 is not
  a nuisance knob, it is the OTHER axis of the phenomenon — onset-response curves at one theta
  are slices, and W280's "onset-1 is special" is theta.5-local (at theta.3 nothing is visible
  anywhere; at theta.7 onset-1 is merely the top of a long grade). Rule: any curve drawn under
  a fixed detection threshold must be re-drawn under at least three before its singularities
  are named — the address of "special" belongs to (threshold x onset) jointly. W254's gate
  inherits the warning (its .916 was read at one operating point).
- Spend: 0 + 0. Clock: R47 4/5.
