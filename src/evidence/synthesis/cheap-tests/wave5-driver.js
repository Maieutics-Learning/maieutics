// Wave 5 driver: test (g) asymmetric/symmetry-breaking transfer probe (EVAL-ONLY).
// 12 Phase-3 final winners (highest w-blob per arm/seed 203-208).
// Arms: cyclic-shift (permutation control, expect ~= perm results) and
// many-to-one non-invertible key map (exploratory: graceful vs total collapse).
// Pre-reg: cyclic holds >=9/12 => symmetry-invariance receipt; many-to-one
// reported exploratory (ambiguity is task-real, no hard bar).
globalThis.window = globalThis;
const ORDER = ["src/tinynn/nn.js","src/tinynn/seeded.js","src/tinynn/tasks.js","src/tinynn/train.js","src/tinynn/pcgrad.js","src/tinynn/evo.js","src/tinynn/gseries.js"];
for (const f of ORDER) { const src = await fs.readTextFile(f); (0, eval)(src + "\n//# sourceURL=" + f); }
const T = window.TinyNN, G = window.TinyNN.gseries;
const files = (await fs.listFiles()).map(f=>f.path).filter(p=>/^scratch\/fs-blob-[gs]\d+w\d+\.json$/.test(p));
const finals = {};
for (const p of files) {
  const m = p.match(/fs-blob-([gs])(\d+)w(\d+)\.json$/);
  const k = m[1]+m[2], w = +m[3];
  if (!finals[k] || w > finals[k].w) finals[k] = {path:p, w};
}
const KC = [1,2,3,0];   // cyclic shift (permutation control)
const KM = [0,0,2,3];   // many-to-one keys 0,1 -> 0
function remapSet(set, km, vm, ym) {
  return set.map(ex=>({x: ex.x.map(t => t===8?8 : t<4?km[t] : 4+vm[t-4]), y: ym[ex.y]}));
}
const examsStd = G.buildExams(7008);
const examsCyc = {}, examsM21 = {};
for (const k of Object.keys(examsStd)) {
  examsCyc[k] = remapSet(examsStd[k], KC, KC, KC);
  examsM21[k] = remapSet(examsStd[k], KM, KM, KM);
}
function acc2(model, set){ return +T.evaluate(model, set, 4).acc.toFixed(4); }
const rows = [];
for (const k of Object.keys(finals).sort()) {
  const model = G.loadModel(JSON.parse(await fs.readTextFile(finals[k].path)));
  rows.push({model:k,
    std:{killA:acc2(model, examsStd.killA), killHd:acc2(model, examsStd.killHd)},
    cyc:{killA:acc2(model, examsCyc.killA), killHd:acc2(model, examsCyc.killHd)},
    m21:{killA:acc2(model, examsM21.killA), killHd:acc2(model, examsM21.killHd)}});
}
const cycHold = rows.filter(r=>r.cyc.killA>=0.6).length;
const out = {test:"g-asymmetric-probe", preReg:"cyclic holds >=9/12 => symmetry-invariance receipt; many-to-one exploratory",
  n:rows.length, cycHold, rows};
await fs.writeTextFile("src/evidence/synthesis/cheap-tests/g-results.json", JSON.stringify(out,null,1));
return {ok:true, n:rows.length, cycHold, m21mean:+(rows.reduce((a,r)=>a+r.m21.killA,0)/rows.length).toFixed(3)};
