<!-- ORIGIN: built in-repo (U16 linkage lesson, 2026-11-25). License: repo-internal. -->
<!-- What the subgraph-linker experiments teach this memory system itself. -->

# Memory as linkage (U16 lesson)

U16 proved composition without wound: frozen pieces (W6 trunk, M2 notebook,
U5 head — drift 0.0) + trainable sparse relay linker (~1.7k params) →
adaptY 0.785/0.635/0.69 with ablation drops 0.135/0.145/0.11 (3/3).
Relays came out DISTRIBUTED (entropy ~2.76 ≈ max), not sparse.

## Mapping onto these layers

- Pieces = the durable layers, kept frozen: ledgers, verdicts, batteries,
  verbatim transcripts (REFERENCE-rules: append-only, strike-through never
  silent-edit). Their value is precision (Bartol 4.7 bits, Samavat SISC):
  small exact records carry a lot — protect them like base-critical weights.
- Linker = the working record + CHATLOG entries: they never re-measure,
  they compose existing pieces into decisions (what to run next, what closed).
  Growth of this system = new links (entries), never rewrites of old layers.
- Consolidation = own-phase fold-back only: a new REFERENCE file (like this
  one) may distill a stable linked pattern, in its own write, never mixed
  with serving reads. Trigger: pattern stable across turns + persistently
  demanded + old layers intact — never a single message.
- Ablation test for any future memory change: remove the new link layer —
  old pieces must still retrace the result (U16 zero-relay rule). If they
  can't, the change overwrote instead of linked: revert.

## Standing consequences (already in force, now grounded)

1. Frozen integrity is checkable: U16 reports maxFrozenDrift 0.0. Treat any
   non-append-only edit to a durable layer as drift > 0 — forbidden.
2. Uniform relay use is normal: expect linkage to be distributed across
   entries (no single entry carries the decision). Sparsity is not required;
   ablation-sensitivity is.
3. STD-cost analogue: a linker that shifts base behavior pays down elsewhere
   (U16 STD 1/3). Prefer gated application: link on the new task, serve the
   old task from base alone.
