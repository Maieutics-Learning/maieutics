# Layer 5 — verbatim conversation transcripts

Each file: one session's user↔assistant conversation, verbatim (copy, never
paraphrase), in chronological order. Speaker labels `user:` / `assistant:`.
Tool calls inside an assistant turn are noted in brackets on their own line,
e.g. `[tool: read src/tools/memory/SKILL.md]` — the call's full output is
NOT embedded (outputs live in the files they read/wrote; cite paths).

Optional `thinking:` blocks hold reasoning the assistant explicitly chose to
record. Private reasoning that was never written out is lost — this directory
makes no claim to completeness beyond what is on the page.

Rules: append-only (fix errors with a dated correction note, never rewrite);
secrets redacted on filing as `[REDACTED: secret-pattern]`; attachments
referenced by path, never embedded; history before 2026-11-16 is
reconstructed from layers 1–4 and marked as such. No size discipline per
user decision 2026-11-16 (part-files only at the platform's 100MB/file
ceiling). File name: `<YYYY-MM-DD>-<label>.md`.
