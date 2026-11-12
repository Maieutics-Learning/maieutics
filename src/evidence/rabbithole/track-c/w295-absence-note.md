# Wave 295 (execution; backlog-W251 absence-duration mapping, bench) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).

- DIRECT: 7 bench cells (TinyNN parity6 h16, 400 steps, 7-pt trajs, s10 @auxW1;
  script scratch/track-c/w251-absence.js vendored w217-tox.js; grid w251-grid.json).
  Absence-duration (ON 1-25, OFF 26..R, ON R+1..): R=50 -> .9167 (replicates W275 bit-exact,
  traj .5067/.5233/.9533/.9267/.96/.95/.9167); R=75 -> .9667; R=100 -> 1.000;
  never -> .8367 (replicates W275 bit-exact). Onset sweep (early-only ON 1..W):
  W=10 -> .9633; W=25 -> .8367 (BIT-IDENTICAL to cut25/never, traj-for-traj —
  degeneracy receipt: recut:25 and cut:25+never are the same schedule);
  W=50 -> .6367 (worst cell on the board).
- PRE-REG ("short-absence rescue, long-absence scar") INVERTED: longer absence rescues BETTER
  (.9167/.9667/1.000 for R=50/75/100). Absence is PROTECTIVE when it covers the setup window.
- MECHANISM (two poison loci, confound killed): (i) early-ON dose, monotone (.9633/.8367/.6367 for
  W=10/25/50 — threshold between 10-25 steps holds); (ii) ON-during-setup-window (~26-100)
  interference. R=100 has minimal (i) and zero (ii) -> 1.0 with ignition right after return
  (traj .49@100 -> 1.0@200); R=50 has minimal (i) but full (ii) -> .9167; W275's H50+gap (.8333)
  had maximal (i) with no (ii) — early dose dominates. W275's "absence-duration is the dose" was
  confounded (its long-absence cells also had double the early dose); holding early dose fixed,
  absence-duration is a PROTECTION gradient, not a poison gradient. Cross-check: H50+gap .8333 vs
  early-only 1-50 .6367 — the 101+ return rescues +.20 after a 50-dose, while after a 25-dose the
  same return rescues nothing (.8367 = .8367): the return's value scales with the dose it follows.
- Verdict: USED-strong (3 bit-exact anchor replications + predicted degeneracy receipt +
  prediction inverted with mechanism + confound killed). Spawned W268 (setup-window interference:
  ON-window placement sweep {26-50, 51-75, 76-100} at fixed dose; does interference localize;
  R=100 x early-dose {10,50} (loci additivity)).
- TANGENTIAL (reasoning, 0 spend): protection-gradients hide inside dose-gradients whenever the
  protocol varies two loci at once — W275 varied early-dose and absence together and read the sum
  as one dose. General rule earned: any "more X = worse" curve where X bundles exposure-timing
  with exposure-amount is suspect until one locus is clamped; here clamping early dose flipped the
  sign of the whole curve. Re-audit candidate: every prior wave that read a monotone curve off a
  two-locus protocol (W233's pf x PL grid varies phantom-rate AND phantom-length simultaneously —
  same bundle shape).
- Spend: 0 + 0. Clock: R46 5/5 (FULL — synthesis R47 next, queue-jump).
