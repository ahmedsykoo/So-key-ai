/**
 * So-key Ai — headless UI smoke test.
 *
 * Loads the real web workspace (app/src/main/assets/www) into jsdom with an inlined
 * bundle, injects a fake AndroidNative bridge + a fake OpenAI-compatible server, and
 * walks the app: navigation, RTL/LTR switch, themes, text scaling, chat streaming,
 * projects/skills/files/terminal actions.
 *
 *   cd tools/ui-smoke && npm install && npm test
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM, VirtualConsole } from "jsdom";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const WWW = path.resolve(HERE, "../../app/src/main/assets/www");

let passed = 0;
let failed = 0;
const failures = [];

function check(name, condition, extra) {
  if (condition) {
    passed++;
    console.log(`  \u001b[32m✓\u001b[0m ${name}`);
  } else {
    failed++;
    failures.push(name);
    console.log(`  \u001b[31m✗\u001b[0m ${name}${extra ? " — " + extra : ""}`);
  }
}

function buildHtml() {
  let html = fs.readFileSync(path.join(WWW, "index.html"), "utf8");
  // inline stylesheets
  html = html.replace(/<link rel="stylesheet" href="([^"]+)">/g, (m, href) => {
    const css = fs.readFileSync(path.join(WWW, href), "utf8");
    return `<style>\n${css}\n</style>`;
  });
  // inline scripts (jsdom cannot fetch file:// sub-resources reliably)
  html = html.replace(/<script src="([^"]+)"><\/script>/g, (m, src) => {
    const js = fs.readFileSync(path.join(WWW, src), "utf8");
    return `<script>\n${js}\n</script>`;
  });
  return html;
}

/* ------------------------------------------------- fake native bridge (Java) */
function makeNative(log) {
  const files = new Map();
  files.set("notes/todo.md", "# todo\n- ship So-key Ai\n");
  const fonts = [];
  return {
    appInfo: () => JSON.stringify({
      version: "1.0.0", pkg: "ai.sokey.workspace", platform: "Android 14", sdk: 34,
      model: "RMX3630", device: "realme RMX3630", abi: "arm64-v8a",
    }),
    deviceName: () => "realme RMX3630",
    workspaceDir: () => "file:///data/user/0/ai.sokey.workspace/files/workspace",
    fontDir: () => "file:///data/user/0/ai.sokey.workspace/files/fonts",
    toast: (m) => log.push(["toast", m]),
    haptic: () => log.push(["haptic", ""]),
    copyToClipboard: (t) => log.push(["clipboard", t.slice(0, 24)]),
    notify: (t, b) => log.push(["notify", t + "|" + b]),
    openUrl: (u) => log.push(["openUrl", u]),
    openBrowser: (u) => log.push(["openBrowser", u]),
    setTextScale: (v) => log.push(["textScale", String(v)]),
    setLocale: (c, rtl) => log.push(["locale", c + (rtl ? "/rtl" : "/ltr")]),
    setStatusBar: () => {},
    addUsage: (n) => log.push(["usage", String(n)]),
    startAgentService: (l) => log.push(["agents:start", l]),
    stopAgentService: () => log.push(["agents:stop", ""]),
    setBootResume: (v) => log.push(["bootResume", String(v)]),
    getBootResume: () => false,
    canInstallApk: () => true,
    installApk: () => "installer opened",
    pickFile: () => "imports/picked.txt",
    pickFont: () => JSON.stringify({ name: "Dubai.ttf", file: "Dubai.ttf", size: 102400 }),
    fontList: () => JSON.stringify(fonts),
    deleteFont: () => {},
    listFiles: (p) => {
      const prefix = (p || "").replace(/\/$/, "");
      const out = [];
      const seen = new Set();
      for (const key of files.keys()) {
        if (prefix && !key.startsWith(prefix + "/")) continue;
        const rest = prefix ? key.slice(prefix.length + 1) : key;
        const seg = rest.split("/");
        if (seg.length > 1) {
          if (!seen.has(seg[0])) { seen.add(seg[0]); out.push({ name: seg[0], dir: true, size: 0, ts: Date.now() }); }
        } else {
          out.push({ name: seg[0], dir: false, size: (files.get(key) || "").length, ts: Date.now() });
        }
      }
      return JSON.stringify(out);
    },
    readFile: (p) => (files.has(p) ? files.get(p) : null),
    writeFile: (p, c) => { files.set(p, c); return true; },
    deleteFile: (p) => files.delete(p),
    mkdir: () => true,
    exec: (cmd) => {
      if (cmd === "help") return "So-key Ai workspace shell\n  ls  pwd  cat  echo  mkdir  rm  http";
      if (cmd === "pwd") return "/workspace";
      if (cmd.startsWith("ls")) return "-     12  notes\n";
      if (cmd === "cat notes/todo.md") return files.get("notes/todo.md");
      if (cmd.startsWith("http ")) return '{"status":200,"body":"ok"}';
      return "unknown command: " + cmd.split(" ")[0] + " (type help)";
    },
    httpRequest: () => JSON.stringify({ status: 200, body: "{}" }),
    httpStream: () => JSON.stringify({ started: true, id: "x" }),
    httpAbort: () => {},
    tokenLimit: () => 180000,
    usageToday: () => 42560,
    hasPermission: () => true,
    __files: files,
  };
}

/* --------------------------------------------------------- fake model server */
function installFetch(window, log) {
  window.fetch = async (url, opts = {}) => {
    log.push(["fetch", url]);
    if (String(url).endsWith("/models")) {
      return {
        ok: true, status: 200,
        text: async () => JSON.stringify({ data: [{ id: "auto" }, { id: "gpt-4o-mini" }, { id: "llama3.1" }] }),
        json: async () => ({ data: [{ id: "auto" }, { id: "gpt-4o-mini" }, { id: "llama3.1" }] }),
      };
    }
    if (String(url).includes("/chat/completions")) {
      const chunks = ["مرحبًا! ", "هذه ", "استجابة ", "تجريبية ", "من ", "المزوّد."];
      const encoder = new TextEncoder();
      let i = 0;
      const body = new ReadableStream({
        pull(controller) {
          if (i < chunks.length) {
            const payload = `data: ${JSON.stringify({ choices: [{ delta: { content: chunks[i++] } }] })}\n\n`;
            controller.enqueue(encoder.encode(payload));
          } else {
            controller.enqueue(encoder.encode("data: " + JSON.stringify({ usage: { total_tokens: 42 } }) + "\n\n"));
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            controller.close();
          }
        },
      });
      return { ok: true, status: 200, body };
    }
    return { ok: false, status: 404, text: async () => "not found" };
  };
  window.ReadableStream = ReadableStream;
  window.TextDecoder = TextDecoder;
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  console.log("So-key Ai — UI smoke test\n");
  const virtualConsole = new VirtualConsole();
  const errors = [];
  virtualConsole.on("jsdomError", (e) => errors.push(String(e && e.message ? e.message : e)));
  virtualConsole.on("error", (...a) => errors.push(a.join(" ")));

  const log = [];
  const dom = new JSDOM(buildHtml(), {
    url: "http://localhost/",
    runScripts: "dangerously",
    pretendToBeVisual: true,
    virtualConsole,
    beforeParse(window) {
      window.AndroidNative = makeNative(log);
      window.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 8);
      installFetch(window, log);
    },
  });
  const { window } = dom;
  const doc = window.document;

  await wait(120);
  check("bootstrap rendered the shell", !!doc.querySelector("#app #sidebar"), "no sidebar");
  check("no script errors during boot", errors.length === 0, errors.slice(0, 2).join(" | "));
  check("home screen shows the workspace hero",
    /AI Workspace/.test(doc.querySelector("#screen")?.textContent || ""));
  check("bottom navigation has 5 items", doc.querySelectorAll("#bottomnav .bn-item").length === 5);
  check("sidebar exposes the 15 reference sections",
    doc.querySelectorAll("#sidebar .nav-item").length >= 15,
    String(doc.querySelectorAll("#sidebar .nav-item").length));

  /* ---------------------------------------------------------- navigation */
  const routes = ["chats", "projects", "agents", "skills", "plugins", "tools", "terminal",
    "files", "git", "automation", "usage", "reports", "settings", "appearance",
    "language", "providers", "omniroute", "mcp", "browser", "storage", "about", "help", "search"];
  let navOk = 0;
  for (const r of routes) {
    try {
      window.App.go(r);
      const txt = doc.querySelector("#screen").textContent || "";
      if (txt.trim().length > 8) navOk++;
      else failures.push("empty screen: " + r);
    } catch (e) {
      failures.push(`route ${r}: ${e.message}`);
      failed++;
    }
  }
  check(`all ${routes.length} routes render content`, navOk === routes.length, `${navOk}/${routes.length}`);

  /* ---------------------------------------------------------------- RTL */
  window.App.go("language");
  doc.querySelector('[data-act="set-lang"][data-lang="en"]').dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  await wait(60);
  check("switching to English flips the document to LTR", doc.body.dir === "ltr", doc.body.dir);
  window.App.go("home");
  await wait(40);
  check("English strings applied",
    /AI workspace/i.test(doc.querySelector("#screen").textContent || "")
    && /Projects/.test(doc.querySelector("#sidebar").textContent || ""),
    doc.querySelector("#sidebar").textContent.slice(0, 80));
  check("native bridge notified about the locale",
    log.some(([k, v]) => k === "locale" && v.startsWith("en")));
  window.App.go("language");
  doc.querySelector('[data-act="set-lang"][data-lang="ar"]').dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  await wait(60);
  check("switching back to Arabic restores RTL", doc.body.dir === "rtl", doc.body.dir);

  /* ------------------------------------------------------------- themes */
  window.App.go("appearance");
  const themeCards = doc.querySelectorAll('.theme-card').length;
  check("all 12 themes are listed", themeCards === 12, String(themeCards));
  doc.querySelector('[data-act="theme-pick"][data-theme="neon"]').dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  await wait(40);
  check("theme is applied to the document", doc.body.dataset.theme === "neon", doc.body.dataset.theme);

  doc.querySelector('[data-act="text-scale"][data-scale="1.3"]').dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  await wait(40);
  check("text scale 130% stored", String(window.Store.state.settings.textScale) === "1.3",
    String(window.Store.state.settings.textScale));
  check("text scale pushed to the native layer",
    log.some(([k, v]) => k === "textScale" && v === "1.3"));

  /* --------------------------------------------------------------- fonts */
  doc.querySelector('[data-act="font-import"]').dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  await wait(60);
  check("imported font registered (ttf/otf picker path)",
    (window.Store.state.settings.customFonts || []).some((f) => f.file === "Dubai.ttf"),
    JSON.stringify(window.Store.state.settings.customFonts));

  /* ---------------------------------------------------------- providers */
  window.App.go("omniroute");
  const urlInput = doc.querySelector("#or-url");
  check("OmniRoute base URL is editable on its own screen", !!urlInput);
  urlInput.value = "http://192.168.1.50:20128";
  urlInput.dispatchEvent(new window.Event("change", { bubbles: true }));
  await wait(40);
  const prov = window.Store.state.settings.providers.find((p) => p.id === "omniroute");
  check("custom OmniRoute URL is persisted", prov.baseUrl === "http://192.168.1.50:20128", prov.baseUrl);
  urlInput.value = "http://127.0.0.1:20128";
  urlInput.dispatchEvent(new window.Event("change", { bubbles: true }));

  /* --------------------------------------------------------------- chat */
  window.App.go("chats");
  window.App.actions["new-chat"]();
  await wait(60);
  check("new chat opens the conversation screen", window.App.router.route === "chat");
  window.App.send("مرحبًا، اكتب لي دالة قصيرة");
  await wait(400);
  const chat = window.Store.chat();
  const lastMsg = chat.messages[chat.messages.length - 1];
  check("assistant reply streamed into the transcript",
    lastMsg.role === "assistant" && lastMsg.content.includes("مرحبًا"), lastMsg.content.slice(0, 60));
  check("token usage recorded from the provider",
    lastMsg.tokens === 42, String(lastMsg.tokens));
  check("usage forwarded to the native layer", log.some(([k]) => k === "usage"));

  /* -------------------------------------------------------- tools screen */
  window.App.go("terminal");
  const termInput = doc.querySelector("#term-input");
  termInput.value = "help";
  window.App.actions["term-run"]();
  await wait(40);
  check("terminal executes a workspace command",
    (window.App.term.log || []).some((l) => l.text.includes("workspace shell")),
    JSON.stringify(window.App.term.log));
  doc.querySelector("#term-input").value = "cat notes/todo.md";
  window.App.actions["term-run"]();
  await wait(40);
  check("terminal can read workspace files",
    (window.App.term.log || []).some((l) => l.text.includes("ship So-key Ai")));

  window.App.go("files");
  await wait(60);
  check("file browser lists workspace entries",
    /notes/.test(doc.querySelector("#screen").textContent || ""));

  window.App.go("automation");
  await wait(40);
  const wfBtn = doc.querySelector('[data-act="wf-run"]');
  check("workflow card offers a run button", !!wfBtn);
  wfBtn.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  await wait(900);
  check("workflow started the foreground agent service", log.some(([k]) => k === "agents:start"));
  check("workflow stopped the agent service afterwards", log.some(([k]) => k === "agents:stop"));
  check("workflow wrote a report into the workspace",
    [...window.AndroidNative.__files.keys()].some((k) => k.startsWith("reports/")),
    JSON.stringify([...window.AndroidNative.__files.keys()]));

  /* ------------------------------------------------------------- search */
  window.App.go("search", { q: "" });
  const searchInput = doc.querySelector("#global-search");
  searchInput.value = "Super";
  searchInput.dispatchEvent(new window.Event("input", { bubbles: true }));
  await wait(400);
  check("global search finds a project", /Super Driver/.test(doc.querySelector("#screen").textContent || ""));

  /* --------------------------------------------------------------- report */
  window.App.go("reports");
  doc.querySelector('[data-act="report-usage"]').dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  await wait(80);
  check("usage report written to exports/",
    [...window.AndroidNative.__files.keys()].some((k) => k.startsWith("exports/usage-report")));

  /* ------------------------------------------------------------- back key */
  window.App.go("settings");
  const handled = window.__sokeyBack();
  check("Android back returns to home", handled === true && window.App.router.route === "home");

  check("no script errors during the whole run", errors.length === 0, errors.slice(0, 3).join(" | "));

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) {
    console.log("failures:\n - " + failures.join("\n - "));
    process.exit(1);
  }
}

main().catch((e) => {
  console.error("smoke test crashed:", e);
  process.exit(1);
});
