# Toolset review adjudication — results (2026-11-13)

Source: `scratch/message-attachments/Rabbithole_Fresh_Eyes_Memory_Review_Transcript.md`
(ratings: Rabbithole 4.2/5, Fresh Eyes 4.6/5, Memory 4.5/5, system 4.4/5).
Method: every recommendation checked against the skill files + helper code,
same as review #2. Staleness note: the reviewer worked from a repo ZIP, and
several "missing" items are present with 2026-11-12 battery dates — those
are marked PRESENT, not adopted. 10 small adoptions folded; no rearchitecture.

## Rabbithole

- R1 value-based continuation / stopping (BREAK-ish) → PARTIAL → REJECT core,
  ACCEPT one line. Proven-dry (all-four checks), caps-as-pause, genuine-block,
  bridge-or-verdict (U4), and step-8 interim reports already exist; the
  aggressive queue MUST + marathon rule are explicit user-set policy
  (2026-11-10/11) I will not silently rewrite — changing it needs a user
  override (flagged below). Adopted: tangential spawns must state their
  plausible root-connection in one clause, else backlog (agenda item 6).
- R2 consequential-action split → REJECT as PRESENT (Interruptions escalate
  irreversible/external actions; Scope ownership: pushes/shipped-code need
  explicit instruction — `src/tools/rabbithole/SKILL.md` lines 336-351).
- Complexity corroborates known U1 → recorded as U1 corroboration line
  (amend, per section convention).

## Fresh Eyes

- F1 correlated errors / unanimity → ACCEPT (2 lines). Added: single-provider
  limitation bullet (Honest limitations) + unanimity-ends-document-round
  line (Stop rule; r3 "only runnable evidence retires residuals" now in-skill).
- F2 audit roles → ACCEPT-lite. Armed rounds now staff math/stat,
  implementation/repro, and alternative-explanation roles.
- F3 anti-bias packet + raw-vs-summary → ACCEPT. Premise-artifact item 6.
- F4 code-execution caveat → REJECT as PRESENT (Honest limitations).

## Memory

- M1 3-layer split → REJECT/defer, recorded as new U8 (deferral to the
  post-Phase-2 physical-split vehicle with rabbithole U1; meanwhile no new
  mandatory procedure without retiring one).
- M2 retrieval dimensions → ACCEPT-lite. `search.js` header now states the
  lexical limits + verify-against-source rule (semantic ranking unavailable
  in-worker; epistemic-status marking comes via M3 labels).
- M3 epistemic labels → ACCEPT. Observed/Verified/Inferred/Hypothesis/
  Retracted vocabulary + travel-with-claims rule (genuine gap).
- M4a byte count → CONFIRMED, FIXED (`log.js`: `cur.length` → UTF-8 bytes;
  verified: "héllo 🌍" line reports 45, true UTF-8).
- M4b date validation → CONFIRMED, FIXED (component-checked real dates;
  verified: "2026-13-99 99:99" falls back to now).
- M4c concurrent writes → PARTIAL, header single-writer contract (workloads
  here are sequential; no lock machinery earned).
- M4d path guard → PARTIAL, FIXED (reject `..`, leading `/`, drive-letter;
  verified: `../evil.md` + `/abs.md` → bad-path, legit `scratch/` override
  still works). Test receipts: `scratch/logtest.md`, `scratch/logtest2.md`.
- M4e write/commit/push distinction → REJECT as PRESENT (Durability order +
  Reconcile Step 4 push check).
- M4f snapshot hashes → PARTIAL: snapshot rule now logs byte count
  (checkable today); hashes deferred until a drift incident earns them.
- M5 secrets → CONFIRM principle (skill already stronger than asked: never
  store/echo, rotate if pasted). ACTION FOR USER below.
- M6 shared record format → ACCEPT-lite: shared verdict-record fields
  documented in fresh-eyes Logging (claim/status/evidence/challenge/ruling/
  settler/next); r4 results already conform. No new machinery.
- M7 planted-error testing → CONFIRMED as already-practiced here (search v3
  6-case gold harness, logger 5-case E2E, P2 batteries). No patch.

## Needs the user (not patched unilaterally)

1. PAT ROTATION. Two tokens have been pasted into chat (this session + the
   push session). The memory skill already says: pasted → push, then rotate.
   Revoke both in GitHub Settings → Developer settings → Personal access
   tokens, and prefer short-lived fine-grained tokens next time.
2. CONTINUATION POLICY. Value-based stopping contradicts your standing
   marathon/queue orders. Keep current policy (my default) or say the word
   and I will convert the queue MUST to an EV-gated check.
3. MEMORY SPLIT. 3-layer refactor deferred (U8); bunched with the U1
   physical split post-Phase-2 unless you want it sooner.

## Totals

10 adoptions (4 code/comment, 6 text), 5 present-already, 3 deferred/user-gated.
Ratings accepted as fair modulo ZIP staleness; the review's highest value
was corroborating known U1/U4/U5 and catching the `log.js` byte/date bugs.
Patches: `src/tools/memory/log.js`, `src/tools/memory/search.js`,
`src/tools/memory/SKILL.md`, `src/tools/fresh-eyes/SKILL.md`,
`src/tools/rabbithole/SKILL.md`. Unpushed pile grows — no PAT on hand.
