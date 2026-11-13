// Wave 1 driver: loader smoke + test (c) novel-rule transfer probe (EVAL-ONLY).
// Runs in execute_js (bare `fs` in scope). Durable recipe (promote-or-recipe).
// Method: indirect-eval of page scripts in index.html order; finals = highest
// w-blob per (arm,seed) in scratch/fs-blob-*; perm exams remap keys+values 0<->1.
globalThis.window = globalThis;
const ORDER = ["src/tinynn/nn.js","src/tinynn/seeded.js","src/tinynn/tasks.js","src/tinynn/train.js","src/tinynn/pcgrad.js","src/tinynn/evo.js","src/tinynn/gseries.js"];
for (const f of ORDER) {
  const src = await fs.readTextFile(f);
  (0, eval)(src + "\n//# sourceURL=" + f);
}
const T = window.TinyNN, G = window.TinyNN.gseries;
if (!T || !G || !G.loadModel) return {ok:false, stage:"loader"};
const task = T.TASKS.assocR;
const sm = await T.trainModel({vocab:9,classes:4,h:24,m:48,d:8,arch:"attn",train:task.makeTrain(7),steps:60,batch:16,lr:5e-3,rMode:"mix",seed:7,attnAux:true,attnAuxW:1.0}, null);
const smoke = {firstLoss:+sm.firstLoss.toFixed(4), lastLoss:+sm.lastLoss.toFixed(4), fell: sm.lastLoss < sm.firstLoss};
const files = (await fs.listFiles()).map(f=>f.path).filter(p=>/^scratch\/fs-blob-[gs]\d+w\d+\.json$/.test(p));
const finals = {};
for (const p of files) {
  const m = p.match(/fs-blob-([gs])(\d+)w(\d+)\.json$/);
  const k = m[1]+m[2], w = +m[3];
  if (!finals[k] || w > finals[k].w) finals[k] = {path:p, w};
}
const KM = [1,0,2,3];
function remapEx(ex){ const x = ex.x.map(t => t===8?8 : t<4?KM[t] : 4+KM[t-4]); return {x, y: KM[ex.y]}; }
const examsStd = G.buildExams(7008);
const examsPerm = {};
for (const k of Object.keys(examsStd)) examsPerm[k] = examsStd[k].map(remapEx);
function acc2(model, set){ return +T.evaluate(model, set, 4).acc.toFixed(4); }
const rows = [];
for (const k of Object.keys(finals).sort()) {
  const blob = JSON.parse(await fs.readTextFile(finals[k].path));
  const model = G.loadModel(blob);
  const r = {model:k, std:{killA:acc2(model, examsStd.killA), killHd:acc2(model, examsStd.killHd)},
             perm:{killA:acc2(model, examsPerm.killA), killHd:acc2(model, examsPerm.killHd)}};
  rows.push(r);
  await fs.writeTextFile("scratch/cheap-c-partial.json", JSON.stringify({done:rows.length, rows}));
}
const hold = rows.filter(r=>r.perm.killA>=0.6).length;
const collapse = rows.filter(r=>r.perm.killA<0.3).length;
const out = {test:"c-novel-rule-probe", preReg:"perm killA>=0.6 majority => transfer REAL; <0.3 majority => memorization", n:rows.length, permHold:hold, permCollapse:collapse, smoke, rows};
await fs.writeTextFile("src/evidence/synthesis/cheap-tests/c-results.json", JSON.stringify(out,null,1));
return {ok:true, smoke, n:rows.length, permHold:hold, permCollapse:collapse};
