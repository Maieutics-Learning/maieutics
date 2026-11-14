// Memory log subprocess — STATELESS. (entry, filesystem) -> bytes written.
// Appends to the correct layer; the caller never formats or places anything.
// Run via execute_js bootstrap:
//   const src = await fs.readTextFile("src/tools/memory/log.js");
//   const run = new (Object.getPrototypeOf(async function(){}).constructor)("fs","tools","args", src);
//   return await run(fs, tools, {layer:"record", text:"..."});
// args: {layer: "record"|"chatlog", text, title?, file?, stamp?}
//   record  -> appends timestamped line to src/CURRENT_TASK.md (default;
//              override with file for U2 two-record tasks); stamp "YYYY-MM-DD
//              HH:MM" backfills event time (validated, else now).
//   chatlog -> appends bullets to today's ## section in src/CHATLOG.md
//             (new section if none today, or if title differs from today's
//             open section — one dated entry per session). Format matches
//             file convention: "## YYYY-MM-DD — title" + "- bullet" lines.
// v2 (P2-6 2026-11-12): record default SYNTHESIS->CURRENT_TASK + file/stamp
// overrides; chatlog missing-file fallback; title-aware sections.
// Single-writer contract: read-modify-write is not atomic — never run
// concurrent appends to the same file (review 2026-11-13).
return await (async () => {
  const layer = (args && args.layer) || "record";
  const text = String((args && args.text) || "").trim();
  if (!text) return { ok: false, reason: "empty-text" };
  const fileArg = String((args && args.file) || "");
  if (fileArg && (/(\.\.|^\/|^[A-Za-z]:)/.test(fileArg))) return { ok: false, reason: "bad-path" };
  const stampIn = String((args && args.stamp) || "");
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const nowDay = d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  const nowStamp = nowDay + " " + pad(d.getHours()) + ":" + pad(d.getMinutes());
  const m = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/.exec(stampIn);
  let stamp = nowStamp;
  if (m) {
    const dd = new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]);
    if (dd.getFullYear() === +m[1] && dd.getMonth() === +m[2] - 1 && dd.getDate() === +m[3] && dd.getHours() === +m[4] && dd.getMinutes() === +m[5]) stamp = stampIn;
  }
  const day = stamp.slice(0, 10);
  if (layer === "record") {
    const p = String((args && args.file) || "src/CURRENT_TASK.md");
    let cur = "";
    try { cur = await fs.readTextFile(p); } catch (e) { cur = "# " + p.split("/").pop() + "\n"; }
    if (!cur.endsWith("\n")) cur += "\n";
    cur += "- " + stamp + ": " + text + "\n";
    await fs.writeTextFile(p, cur);
    return { ok: true, file: p, bytes: new TextEncoder().encode(cur).length };
  }
  if (layer === "chatlog") {
    const p = String((args && args.file) || "src/CHATLOG.md");
    let cur = "";
    try { cur = await fs.readTextFile(p); } catch (e) { cur = ""; }
    if (cur && !cur.endsWith("\n")) cur += "\n";
    const title = String((args && args.title) || "session note").slice(0, 120);
    const lines = text.split("\n").map(s => s.trim()).filter(Boolean);
    const bullets = lines.map(s => (s.startsWith("- ") ? s : "- " + s)).join("\n") + "\n";
    let hIdx = -1;
    if (cur.startsWith("## ")) hIdx = 0;
    else { const k = cur.lastIndexOf("\n## "); if (k >= 0) hIdx = k + 1; }
    let append = false;
    if (hIdx >= 0) {
      const head = cur.slice(hIdx).split("\n")[0];
      const m = head.match(/^## (\d{4}-\d{2}-\d{2}) — (.*)$/);
      if (m && m[1] === day && (!(args && args.title) || m[2] === title)) append = true;
    }
    if (append) cur += "\n" + bullets;
    else cur += (cur ? "\n" : "") + "## " + day + " — " + title + "\n" + bullets;
    await fs.writeTextFile(p, cur);
    return { ok: true, file: p, bytes: new TextEncoder().encode(cur).length, newSection: !append };
  }
  return { ok: false, reason: "unknown-layer: " + layer };
})();
