// Static CSS + class-name audit for the workspace UI.
import fs from "node:fs";
import path from "node:path";
import { JSDOM, VirtualConsole } from "jsdom";
const WWW = "/home/user/So-key-ai/app/src/main/assets/www";
const files = ["css/base.css", "css/components.css", "css/themes.css"];
let problems = 0;
for (const f of files) {
  const css = fs.readFileSync(path.join(WWW, f), "utf8");
  const vc = new VirtualConsole(); const errs = [];
  vc.on("jsdomError", e => errs.push(String(e.message)));
  const dom = new JSDOM(`<style>${css}</style>`, { virtualConsole: vc });
  const sheet = dom.window.document.styleSheets[0];
  const ok = errs.length === 0;
  if (!ok) problems++;
  console.log(`${ok ? "✓" : "✗"} ${f} — ${sheet.cssRules.length} rules${errs.length ? " — " + errs.join("; ") : ""}`);
}
// class usage audit
const css = files.map(f => fs.readFileSync(path.join(WWW, f), "utf8")).join("\n");
const js = fs.readdirSync(path.join(WWW, "js")).map(f => fs.readFileSync(path.join(WWW, "js", f), "utf8")).join("\n");
const defined = new Set([...css.matchAll(/\.([a-zA-Z][\w-]*)/g)].map(m => m[1]));
const used = new Set([...js.matchAll(/class="([^"$]*?)"/g)].flatMap(m => m[1].split(/\s+/)).filter(Boolean));
const missing = [...used].filter(c => !defined.has(c));
console.log(`classes used in JS: ${used.size}, defined in CSS: ${defined.size}`);
if (missing.length) { console.log("no CSS rule for:", missing.join(", ")); }
process.exit(problems ? 1 : 0);
