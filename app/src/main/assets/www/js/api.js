/* ==========================================================================
   So-key Ai — OpenAI-compatible client (OmniRoute first), tools + native bridge
   ========================================================================== */
(function () {
  "use strict";

  const NATIVE = window.AndroidNative || null;
  const has = (fn) => !!(NATIVE && typeof NATIVE[fn] === "function");

  /* --------------------------------------------------------- native bridge */
  const Native = {
    available: !!NATIVE,
    info() {
      if (!has("appInfo")) return { version: "1.0.0", pkg: "ai.sokey.workspace", platform: "web", sdk: 0 };
      try { return JSON.parse(NATIVE.appInfo()); } catch (e) { return {}; }
    },
    toast(msg) { if (has("toast")) NATIVE.toast(String(msg)); },
    haptic() { if (has("haptic")) NATIVE.haptic(); },
    clipboard(text) { if (has("copyToClipboard")) NATIVE.copyToClipboard(String(text)); },
    openUrl(url) { if (has("openUrl")) NATIVE.openUrl(String(url)); else window.open(url, "_blank"); },
    openBrowser(url) { if (has("openBrowser")) NATIVE.openBrowser(String(url)); else window.open(url, "_blank"); },
    setTextScale(v) { if (has("setTextScale")) NATIVE.setTextScale(Number(v)); },
    setLocale(code, rtl) { if (has("setLocale")) NATIVE.setLocale(String(code), !!rtl); },
    notify(title, body) { if (has("notify")) NATIVE.notify(String(title), String(body)); },
    shareText(text) { if (has("shareText")) NATIVE.shareText(String(text)); },
    shareFile(path) { if (has("shareFile")) NATIVE.shareFile(String(path)); },
    openFileDialog() { return has("pickFile") ? NATIVE.pickFile() : null; },
    installApk(path) { return has("installApk") ? NATIVE.installApk(String(path)) : "unavailable"; },
    canInstall() { return has("canInstallApk") ? NATIVE.canInstallApk() : false; },
    pickFont() { return has("pickFont") ? NATIVE.pickFont() : null; },
    deleteFont(file) { if (has("deleteFont")) NATIVE.deleteFont(String(file)); },
    fontList() { try { return has("fontList") ? JSON.parse(NATIVE.fontList()) : []; } catch (e) { return []; } },
    listFiles(path) { try { return has("listFiles") ? JSON.parse(NATIVE.listFiles(String(path || ""))) : []; } catch (e) { return []; } },
    readFile(path) { return has("readFile") ? NATIVE.readFile(String(path)) : null; },
    writeFile(path, content) { return has("writeFile") ? NATIVE.writeFile(String(path), String(content)) : false; },
    deleteFile(path) { return has("deleteFile") ? NATIVE.deleteFile(String(path)) : false; },
    mkdir(path) { return has("mkdir") ? NATIVE.mkdir(String(path)) : false; },
    workspaceDir() { return has("workspaceDir") ? NATIVE.workspaceDir() : ""; },
    tokenLimit() { return has("tokenLimit") ? Number(NATIVE.tokenLimit()) : 180000; },
    usageToday() { return has("usageToday") ? Number(NATIVE.usageToday()) : window.Store.todayTokens(); },
    deviceName() { return has("deviceName") ? NATIVE.deviceName() : "web"; },
    darkStatusBar(dark) { if (has("setStatusBar")) NATIVE.setStatusBar(!!dark); },
    exec(cmd) { return has("exec") ? NATIVE.exec(String(cmd)) : null; },
    addUsage(tokens) { if (has("addUsage")) NATIVE.addUsage(Number(tokens) || 0); },
    startAgents(label) { if (has("startAgentService")) NATIVE.startAgentService(String(label || "")); },
    stopAgents() { if (has("stopAgentService")) NATIVE.stopAgentService(); },
    setBootResume(on) { if (has("setBootResume")) NATIVE.setBootResume(!!on); },
    getBootResume() { return has("getBootResume") ? !!NATIVE.getBootResume() : false; },
    /* native (CORS-free) HTTP: used when the page cannot reach a local gateway */
    request(url, method, headers, body) {
      if (!has("httpRequest")) return null;
      try {
        const raw = NATIVE.httpRequest(String(url), String(method || "GET"),
          JSON.stringify(headers || {}), body == null ? "" : String(body));
        return JSON.parse(raw);
      } catch (e) { return { status: 0, error: String(e) }; }
    },
    stream(url, headers, body, id) {
      if (!has("httpStream")) return null;
      try { return JSON.parse(NATIVE.httpStream(String(url), JSON.stringify(headers || {}), String(body), String(id))); }
      catch (e) { return null; }
    },
    abortStream(id) { if (has("httpAbort")) NATIVE.httpAbort(String(id)); },
  };

  /* --------------------------------------------------------------- helpers */
  function normalizeBase(url) {
    let u = String(url || "").trim();
    if (!u) return "";
    if (!/^https?:\/\//i.test(u)) u = "http://" + u;
    return u.replace(/\/+$/, "");
  }

  function provider() {
    const s = window.Store.state.settings;
    return s.providers.find((p) => p.id === s.activeProviderId) || s.providers[0];
  }

  function headers(p) {
    const h = { "Content-Type": "application/json" };
    if (p && p.apiKey) h.Authorization = "Bearer " + p.apiKey;
    return h;
  }

  /* ------------------------------------------------------------ REST calls */
  async function testConnection(p) {
    const base = normalizeBase(p.baseUrl);
    if (!base) return { ok: false, error: t("need_base_url") };
    const started = Date.now();
    const collect = (raw) => {
      let data = {};
      try { data = JSON.parse(raw); } catch (e) { return null; }
      if (Array.isArray(data.data)) return data.data.map((m) => m.id || m.name).filter(Boolean);
      if (Array.isArray(data.models)) return data.models.map((m) => m.id || m.name).filter(Boolean);
      return [];
    };
    try {
      const res = await fetch(base + "/models", { headers: headers(p) });
      const ms = Date.now() - started;
      if (!res.ok) return { ok: false, error: "HTTP " + res.status, ms };
      const raw = await res.text();
      return { ok: true, ms, models: collect(raw) || [] };
    } catch (e) {
      // CORS / offline page: retry through the native transport before giving up
      const native = Native.request(base + "/models", "GET", headers(p), null);
      const ms = Date.now() - started;
      if (native && native.status >= 200 && native.status < 300) {
        return { ok: true, ms, models: collect(native.body || "") || [] };
      }
      if (native && native.error) return { ok: false, error: native.error, ms };
      return { ok: false, error: String(e && e.message ? e.message : e) };
    }
  }

  /**
   * Chat completion.
   *
   * Tries the page's own fetch() first (fast, and what a browser preview uses). When that
   * fails — typically a CORS rejection from a gateway on 127.0.0.1 — it transparently
   * falls back to the native HTTP bridge, which has no origin restrictions.
   */
  async function chat(opts) {
    try {
      return await chatFetch(opts);
    } catch (e) {
      const abortish = e && (e.name === "AbortError" || (e.message || "").indexOf("aborted") !== -1);
      if (abortish || !(Native.available && typeof NATIVE.httpStream === "function")) throw e;
      return await chatNative(opts);
    }
  }

  async function chatFetch(opts) {
    const p = opts.provider || provider();
    const base = normalizeBase(p.baseUrl);
    if (!base) throw new Error(t("need_base_url"));
    const model = opts.model || p.model || "auto";
    const body = {
      model,
      messages: opts.messages,
      stream: !!opts.stream,
      temperature: opts.temperature == null ? 0.7 : opts.temperature,
    };
    if (opts.tools && opts.tools.length) { body.tools = opts.tools; body.tool_choice = "auto"; }

    const controller = new AbortController();
    if (opts.signal) opts.signal.addEventListener("abort", () => controller.abort());

    const res = await fetch(base + "/chat/completions", {
      method: "POST",
      headers: headers(p),
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!res.ok) {
      let detail = "";
      try { detail = (await res.text()).slice(0, 400); } catch (e) {}
      throw new Error("HTTP " + res.status + (detail ? " — " + detail : ""));
    }

    // --- streaming path
    if (body.stream && res.body && typeof res.body.getReader === "function") {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let content = "";
      let toolCalls = [];
      let usage = null;
      const emit = (delta) => { content += delta; if (opts.onDelta) opts.onDelta(delta, content); };

      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop();
        for (const raw of lines) {
          const line = raw.trim();
          if (!line || line.startsWith(":")) continue;
          if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trim();
          if (payload === "[DONE]") continue;
          let json;
          try { json = JSON.parse(payload); } catch (e) { continue; }
          if (json.usage) usage = json.usage;
          const choice = json.choices && json.choices[0];
          if (!choice) continue;
          const delta = choice.delta || choice.message || {};
          if (delta.content) emit(delta.content);
          if (delta.tool_calls) {
            delta.tool_calls.forEach((tc) => {
              const idx = tc.index || 0;
              toolCalls[idx] = toolCalls[idx] || { id: tc.id, function: { name: "", arguments: "" } };
              if (tc.id) toolCalls[idx].id = tc.id;
              if (tc.function) {
                if (tc.function.name) toolCalls[idx].function.name += tc.function.name;
                if (tc.function.arguments) toolCalls[idx].function.arguments += tc.function.arguments;
              }
            });
          }
        }
      }
      return { content, tool_calls: toolCalls.filter(Boolean), usage };
    }

    // --- non-streaming path
    const json = await res.json();
    const choice = (json.choices && json.choices[0]) || {};
    const msg = choice.message || {};
    return { content: msg.content || "", tool_calls: msg.tool_calls || [], usage: json.usage || null };
  }

  /** Native-transport chat: no CORS, real SSE streaming pushed back from Java. */
  function chatNative(opts) {
    const p = opts.provider || provider();
    const base = normalizeBase(p.baseUrl);
    if (!base) return Promise.reject(new Error(t("need_base_url")));
    const body = {
      model: opts.model || p.model || "auto",
      messages: opts.messages,
      stream: true,
      temperature: opts.temperature == null ? 0.7 : opts.temperature,
    };
    if (opts.tools && opts.tools.length) { body.tools = opts.tools; body.tool_choice = "auto"; }

    return new Promise((resolve, reject) => {
      const id = "s" + Math.random().toString(36).slice(2, 10);
      const previous = window.__sokeyStreamEvent;
      let content = "";
      let usage = null;
      let settled = false;

      const cleanup = () => { window.__sokeyStreamEvent = previous; };
      const finish = (fn, arg) => { if (settled) return; settled = true; cleanup(); fn(arg); };

      window.__sokeyStreamEvent = function (ev) {
        if (!ev || ev.id !== id) { if (typeof previous === "function") previous(ev); return; }
        if (ev.type === "delta") {
          content += ev.text;
          if (opts.onDelta) opts.onDelta(ev.text, content);
        } else if (ev.type === "usage") {
          usage = { total_tokens: Number(ev.tokens) || 0 };
        } else if (ev.type === "done") {
          if (ev.text) content = ev.text;
          finish(resolve, { content, tool_calls: [], usage });
        } else if (ev.type === "error") {
          finish(reject, new Error(ev.text || "native stream failed"));
        }
      };

      if (opts.signal) {
        opts.signal.addEventListener("abort", () => {
          Native.abortStream(id);
          const err = new Error("aborted");
          err.name = "AbortError";
          finish(reject, err);
        });
      }

      const started = Native.stream(base + "/chat/completions", headers(p), JSON.stringify(body), id);
      if (!started) {
        const err = new Error("native transport unavailable");
        finish(reject, err);
      }
    });
  }

  /** Rough token estimate used when a provider reports no usage block. */
  function estimateTokens(text) {
    const s = String(text || "");
    const arabic = (s.match(/[\u0600-\u06FF]/g) || []).length;
    const rest = s.length - arabic;
    return Math.max(1, Math.round(arabic / 2.2 + rest / 4));
  }

  /* ----------------------------------------------------------------- tools */
  const TOOLS = [
    {
      name: "http_get",
      description: "Fetch a URL and return the response body (text, max 4000 chars).",
      parameters: { type: "object", properties: { url: { type: "string" } }, required: ["url"] },
      run: async (a) => {
        const r = await fetch(a.url, { headers: { Accept: "application/json, text/plain, */*" } });
        return (await r.text()).slice(0, 4000);
      },
    },
    {
      name: "workspace_write",
      description: "Write a text file inside the app workspace.",
      parameters: { type: "object", properties: { path: { type: "string" }, content: { type: "string" } }, required: ["path", "content"] },
      run: async (a) => (Native.writeFile(a.path, a.content) ? "written: " + a.path : "failed: no native bridge"),
    },
    {
      name: "workspace_read",
      description: "Read a text file from the app workspace.",
      parameters: { type: "object", properties: { path: { type: "string" } }, required: ["path"] },
      run: async (a) => {
        const c = Native.readFile(a.path);
        return c == null ? "not found: " + a.path : String(c).slice(0, 4000);
      },
    },
    {
      name: "workspace_list",
      description: "List files and folders in the app workspace.",
      parameters: { type: "object", properties: { path: { type: "string" } }, required: [] },
      run: async (a) => JSON.stringify(Native.listFiles(a.path || "").slice(0, 100)),
    },
    {
      name: "app_info",
      description: "Return app, device and workspace information.",
      parameters: { type: "object", properties: {}, required: [] },
      run: async () => JSON.stringify(Object.assign({}, Native.info(), { workspace: Native.workspaceDir() })),
    },
    {
      name: "notify",
      description: "Show a system notification.",
      parameters: { type: "object", properties: { title: { type: "string" }, body: { type: "string" } }, required: ["title", "body"] },
      run: async (a) => { Native.notify(a.title, a.body); return "notification shown"; },
    },
  ];

  function toolSpecs() {
    return TOOLS.map((tl) => ({
      type: "function",
      function: { name: tl.name, description: tl.description, parameters: tl.parameters },
    }));
  }

  async function runTool(name, argsJson) {
    const tool = TOOLS.find((tl) => tl.name === name);
    if (!tool) return "unknown tool: " + name;
    let args = {};
    try { args = typeof argsJson === "string" ? JSON.parse(argsJson || "{}") : (argsJson || {}); } catch (e) {}
    try {
      const out = await tool.run(args);
      return typeof out === "string" ? out : JSON.stringify(out);
    } catch (e) {
      return "tool error: " + (e && e.message ? e.message : e);
    }
  }

  /* --------------------------------------------------------------- GitHub */
  async function github(path) {
    const tok = window.Store.state.settings.githubToken;
    const res = await fetch("https://api.github.com" + path, {
      headers: tok ? { Authorization: "Bearer " + tok } : {},
    });
    if (!res.ok) throw new Error("GitHub HTTP " + res.status);
    return res.json();
  }

  window.Api = {
    Native, provider, normalizeBase, testConnection, chat, estimateTokens,
    toolSpecs, runTool, TOOLS, github, headers,
  };
})();
