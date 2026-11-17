// Self-check runner (P1 tests lane). Browser-runnable: loads src/tinynn/nn.js (IIFE-wrapped,
// exports window.__tinyNN) and runs its built-in numeric gradient guards.
// Run: page_eval({path:"src/tools/self-check.js"}).
// PASS bar: every worst-diff < 1e-5 (float64 central differences, eps 1e-6 — healthy is ~1e-9..1e-7).
const src = await fetch("src/tinynn/nn.js").then(r => r.text());
(0, eval)(src + "\n//# sourceURL=nn.js");
const nn = window.__tinyNN;
if (!nn) return {pass: false, error: "nn.js did not export window.__tinyNN"};
const results = [];
for (const name of ["checkAttnGrad", "checkGeoGrad", "checkDepthGrad", "checkQueryGrad"]) {
  let worst = null, error = null;
  try { worst = nn[name](); } catch (e) { error = String((e && e.message) || e).slice(0, 160); }
  results.push({check: name, worst, pass: error === null && typeof worst === "number" && worst < 1e-5, error});
}
const fails = results.filter(r => !r.pass);
return {pass: fails.length === 0, results};
