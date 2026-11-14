// Memory search subprocess — STATELESS. (query, filesystem) -> pointers.
// Fetches nothing into the caller: scans the workspace inside the worker,
// returns top file hits with line snippets. No state of its own.
// Run via execute_js bootstrap:
//   const src = await fs.readTextFile("src/tools/memory/search.js");
//   const run = new (Object.getPrototypeOf(async function(){}).constructor)("fs","tools","args", src);
//   return await run(fs, tools, {query: "pool nursery kaggle"});
// args: {query, limit?, snippetsPerFile?, allowPaths?[] (extra roots)}
// Retrieval limits (review 2026-11-13): lexical baseline only — substring
// hits can mislead, path-only matches may not answer, and recency/status
// are NOT ranked. Snippets are pointers: verify against the source artifact
// and check its timestamp (STALE vs live) before building on a hit.
const STOP = new Set(("the,a,an,and,or,of,to,in,on,for,with,what,why,how,does,did,was,were,is,are,that,this,these,those,it,its,from,where,which,who,when,can,could,should,would,there,their,then,than,not,but,you,your,we,our,they,all,any,has,have,had,been,will,just,about,into,over,after,before,our").split(","));
return await (async () => {
  const q = String((args && args.query) || "");
  const limit = (args && args.limit) || 8;
  const snipN = (args && args.snippetsPerFile) || 3;
  const terms = q.toLowerCase().split(/[^a-z0-9]+/).filter(t => t.length > 2 && !STOP.has(t));
  if (!terms.length) return { ok: false, reason: "no-search-terms", query: q };
  const all = await fs.listFiles();
  const files = all.filter(f =>
    /\.(md|js|json|txt)$/i.test(f.path) &&
    (f.bytes || 0) < 200000 &&
    !f.path.startsWith("scratch/message-attachments/") &&
    !/^(imports|node_modules)\//.test(f.path)
  ).map(f => f.path);
// __RANK_START__
// Pure ranking core (no fs): terms = lowercase query terms, docs = [{path, text}].
// v3 (P2-5 2026-11-12): harmonic occurrence decay with per-term cap 2.0.
// Guarantee: any file matching >=2 distinct terms content-wise outranks any
// single-term file (path bonus is a deliberate override, unchanged).
// Gold cases: U6 in SKILL.md. Snippets = first snipN matching lines (pointers).
function rankTerms(terms, docs, limit, snipN) {
  const harmonic = (n) => { let s = 0; for (let k = 1; k <= n; k++) s += 1 / k; return Math.min(s, 2); };
  const countOcc = (low, t) => { let n = 0, i = -1; for (;;) { i = low.indexOf(t, i + 1); if (i < 0) break; n++; } return n; };
  const hits = [];
  for (const d of docs) {
    const low = d.text.toLowerCase();
    const lowPath = d.path.toLowerCase();
    const kb = Math.max(1, d.text.length / 1024);
    let content = 0;
    const covered = new Set();
    for (const t of terms) {
      const n = countOcc(low, t);
      if (n > 0) { content += harmonic(n); covered.add(t); }
      else if (lowPath.indexOf(t) >= 0) covered.add(t);
    }
    let score = content;
    for (const t of terms) if (lowPath.indexOf(t) >= 0) score += 3;
    const lines = d.text.split("\n");
    const seen = [];
    for (let i = 0; i < lines.length && seen.length < snipN; i++) {
      const ll = lines[i].toLowerCase();
      for (const t of terms) if (ll.indexOf(t) >= 0) { seen.push({ n: i + 1, t: lines[i].trim().slice(0, 160) }); break; }
    }
    if (score > 0) score = (score / Math.sqrt(kb)) * (1 + covered.size);
    if (score > 0) hits.push({ path: d.path, score: +score.toFixed(2), snippets: seen });
  }
  hits.sort((a, b) => b.score - a.score);
  return hits.slice(0, limit);
}
// __RANK_END__
  const docs = [];
  for (const p of files) {
    try { docs.push({ path: p, text: await fs.readTextFile(p) }); } catch (e) { continue; }
  }
  const ranked = rankTerms(terms, docs, limit, snipN);
  return { ok: true, query: q, terms, scanned: files.length, hits: ranked };
})();
