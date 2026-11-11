// A2 triage sketch — port of sickn33 infer_category (waves 54/56)
// input: {id,name,description,body,frontmatterCategory,folderCategory}
// output: {category,confidence,reason}
const CATEGORY_KEYWORDS = {
  // full map ported from sickn33 generate_index.py (wave 57) — 13 categories
  "web-engineering": ["react", "vue", "angular", "svelte", "nextjs", "tailwind", "frontend", "html", "css", "browser", "web", "dom", "accessibility", "seo"],
  "backend": ["backend", "api", "server", "fastapi", "django", "flask", "express", "spring", "node", "golang", "rust", "php", "laravel"],
  "database": ["database", "sql", "postgres", "mysql", "mongodb", "redis", "dynamodb", "orm", "schema", "query"],
  "ai-ml": ["llm", "gpt", "machine learning", "deep learning", "pytorch", "tensorflow", "embedding", "rag", "transformer", "model", "genai", "diffusion"],
  "cloud-devops": ["docker", "kubernetes", "k8s", "ci/cd", "github actions", "terraform", "ansible", "aws", "azure", "gcp", "deployment", "devops", "serverless"],
  "security": ["security", "owasp", "audit", "vulnerability", "threat", "penetration", "authentication", "authorization", "jwt", "oauth", "compliance", "attack", "red-team", "red team", "pentest", "exploit", "malware", "hardening", "exfiltration", "injection", "offensive", "redteam"],
  "testing-qa": ["test", "testing", "pytest", "jest", "cypress", "playwright", "quality", "regression", "coverage", "e2e"],
  "mobile": ["android", "ios", "react native", "flutter", "swift", "kotlin", "mobile"],
  "data-engineering": ["etl", "pipeline", "airflow", "spark", "warehouse", "analytics", "data"],
  "research": ["research", "manuscript", "systematic review", "meta-analysis", "grade", "consort", "prisma", "study"],
  "bioinformatics": ["genomics", "proteomics", "rna", "sequencing", "variant", "phylogenetics", "biopython", "single-cell", "biomedical"],
  "geospatial": ["geospatial", "gis", "spatial", "remote sensing", "raster", "vector"],
  "finance": ["finance", "trading", "portfolio", "risk", "market", "economic", "treasury"]
};
function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function inferCategory(info, body) {
  body = body || '';
  const norm = function (s) { return (s || '').toLowerCase().trim(); };
  const explicit = norm(info.frontmatterCategory);
  if (explicit && explicit !== 'uncategorized') return { category: explicit, confidence: 1.0, reason: 'frontmatter:category' };
  const folder = norm(info.folderCategory);
  if (folder && folder !== 'uncategorized') return { category: folder, confidence: 0.95, reason: 'path:folder' };
  const text = [info.id, info.name, info.description, body].join(' ').toLowerCase();
  let best = null, score = 0, hits = [];
  for (const cat of Object.keys(CATEGORY_KEYWORDS)) {
    let s = 0; const h = [];
    for (const kw of CATEGORY_KEYWORDS[cat]) {
      if (new RegExp('\\b' + esc(kw) + '\\b').test(text)) { s += 3; h.push(kw); }
      else if (kw.length >= 5 && text.indexOf(kw) !== -1) { s += 1; h.push(kw); }
    }
    if (s > score) { score = s; best = cat; hits = h; }
  }
  if (best && score > 0) return { category: best, confidence: Math.min(0.92, 0.45 + 0.05 * score), reason: 'keyword-match:' + hits.slice(0, 3).join(',') };
  return { category: 'general', confidence: 0.20, reason: 'fallback:general' };
}
module.exports = { inferCategory };
