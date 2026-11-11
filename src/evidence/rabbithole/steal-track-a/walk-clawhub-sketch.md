# ClawHub cursor-walk (gap-gated, NOT run)
// p1: GET /api/v1/skills?limit=100 -> items + nextCursor
// loop: GET ...?limit=100&cursor=<encodeURIComponent(JSON.stringify(nextCursor))>
// stop: no nextCursor. Dedupe by slug (zw008 flood).
// detail: GET /api/v1/skills/<slug> -> full SKILL.md in .skill.description.
// NOTE: run only after gaps confirm (A3 order). Routes proven waves 109-118.
