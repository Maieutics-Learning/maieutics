# Phase 1.d.vii FULL-8 verdict (RUN 2026-11-14 on frozen vii v1.0, ledger `scratch/vii-full.json`)

## Gate
- Replication: 8/8 BIT-EXACT (third full replication of the recipe across iii/full).
- s313 cross-check: full recompute lapAUC 0.891618 == pilot 0.891618 (match: true) —
  pipeline deterministic end to end.
- Pooled loudness recompute 0.929287 reproduces filed 0.9293 — pipeline validated.
- MC fallback: used NOWHERE (0/3200 lines). All predictives = linearized probit.

## Numbers
- Pooled (3200 lines, 146 err): Laplace-AUC 0.928524 vs loudness 0.929287
  (Δ = −0.0008). Entropy-AUC 0.918297 (third place, as usual).
- λ selection: 100 on ALL 8 subjects (unanimous grid edge; every valNLL strictly
  decreasing across the grid — the selector wants the posterior even tighter).
- Per subject: Laplace ≤ loudness everywhere (311 tie 0.997494; 317 tie 0.965242;
  314 −0.0023; 315 −0.0029; 312 −0.0005; 318 −0.0013 (0.980548 vs 0.981824); 313 +0.0001).
  316 killHd 200/200 (zero errors → AUC null, correctly uncomputed).
- Guardrails: every killA 200/200 ✓; every killHd EXACTLY frozen ✓
  (199/173/174/200/184/192/140/192 — all 8 within 0 lines).
- Bars: AUC (need ≥0.9393) ✗; killA ✓; killHd ✓ → ALL FALSE → FULL-FAIL.

## Post-mortem (OWED by gameplan vii clause — suspects scored against numbers)
- (a) Gaussian re-describes a bad peak: SUPPORTED. λ pinned at max on 8/8 +
  Laplace≈loudness everywhere (two exact ties) = the posterior adds no shape the
  point estimate lacks. Strongest single story.
- (b) Uncertainty lives upstream (attention/keys): CONSISTENT, UNTESTED. Head-only
  is blind there by construction; viii swap probe is the designed test. Neither
  confirmed nor ruled out — viii decides.
- (c) Tiny head + 146 errors + ceiling: SUPPORTED as amplifier. Pooled loudness
  0.929 is already near ceiling; a 196-param head cannot carve separation that
  isn't there; the papers' regime (big heads, ECE/NLL) differs. Overlaps (a).
- (d) Cold posterior / unjustified tempering: NOT IMPLICATED. No tempering was
  used and the selector chose maximum precision unprompted.
- (e, author's likelihood mismatch — soft-tutor MAP vs hard-NLL GGN): OPEN.
  Cannot be separated from (a) on these numbers; strictly-decreasing valNLL says
  even hard-NLL curvature prefers MAP, which cuts both ways. Owned as unresolved.

## Ruling: FULL-FAIL — loudness travels; Laplace parked as scoped negative
- No replacement, no override, no re-grid (edge-hunting λ>100 would be
  post-hoc; the bar failed on the frozen grid).
- Feeds: 1.e.iii Laplace line = fail (pooled −0.0008, λ-edge 8/8, Laplace ≤
  loudness every subject) + F-new. vii CLOSED.
- U-arm finding travels separately as quarantined diagnostic (10 unfrozen steps:
  killA 1.00→0.41): correction destroys the brain — cite in 1.e methods as a
  bound on "just fine-tune the errors" fixes.
