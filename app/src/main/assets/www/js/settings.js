/* ==========================================================================
   So-key Ai — settings screens: settings, themes/appearance, fonts,
   text size, language, providers, OmniRoute, storage, about
   ========================================================================== */
(function () {
  "use strict";
  const I = () => window.UI.icon;
  const esc = (s) => window.UI.esc(s);
  const ar = () => window.Store.state.settings.lang === "ar";
  const st = () => window.Store.state.settings;

  const THEMES = [
    { id: "default", ar: "الافتراضي", en: "Default", tags: ["dark"], dots: ["#f97316", "#15151f", "#8b5cf6"] },
    { id: "amoled", ar: "AMOLED", en: "AMOLED", tags: ["dark"], dots: ["#f97316", "#000000", "#fdba74"] },
    { id: "neon", ar: "Neon", en: "Neon", tags: ["dark", "focus"], dots: ["#a855f7", "#22d3ee", "#130a26"] },
    { id: "minimal", ar: "Minimal", en: "Minimal", tags: ["light"], dots: ["#111827", "#f7f7f9", "#6b7280"] },
    { id: "glass", ar: "Glass", en: "Glass", tags: ["dark", "focus"], dots: ["#38bdf8", "#818cf8", "#0a1a2c"] },
    { id: "terminal", ar: "Terminal", en: "Terminal", tags: ["dark", "heavy"], dots: ["#22c55e", "#040804", "#86efac"] },
    { id: "ocean", ar: "Ocean", en: "Ocean", tags: ["dark"], dots: ["#0ea5e9", "#22d3ee", "#04121b"] },
    { id: "sunset", ar: "Sunset", en: "Sunset", tags: ["dark"], dots: ["#fb7185", "#fbbf24", "#170a12"] },
    { id: "forest", ar: "Forest", en: "Forest", tags: ["dark"], dots: ["#34d399", "#a3e635", "#071310"] },
    { id: "cyber", ar: "Cyber", en: "Cyber", tags: ["dark"], dots: ["#ec4899", "#06b6d4", "#0b0616"] },
    { id: "dracula", ar: "Dracula", en: "Dracula", tags: ["dark"], dots: ["#bd93f9", "#ff79c6", "#1e1f29"] },
    { id: "light", ar: "Light", en: "Light", tags: ["light"], dots: ["#f97316", "#ffffff", "#64748b"] },
  ];
  const THEME_FILTERS = [
    { id: "all", ar: "الكل", en: "All" },
    { id: "dark", ar: "داكن", en: "Dark" },
    { id: "light", ar: "فاتح", en: "Light" },
    { id: "focus", ar: "تركيز", en: "Focus" },
    { id: "heavy", ar: "ثقيل", en: "Heavy" },
  ];
  const TEXT_SCALES = [
    { v: 0.85, label: "85%" }, { v: 1, label: "100%" }, { v: 1.15, label: "115%" }, { v: 1.3, label: "130%" },
  ];

  /* ========================================================== settings */
  function settings() {
    const s = st();
    const groups = [
      {
        title: t("nav_general"),
        items: [
          { nav: "appearance", icon: "palette", title: t("appearance"), sub: t("theme_hint") },
          { nav: "language", icon: "globe", title: t("language"), sub: s.lang === "ar" ? "العربية" : "English" },
          { nav: "providers", icon: "key", title: t("providers"), sub: `${s.providers.filter((p) => p.enabled).length} ${ar() ? "مفعّل" : "enabled"}` },
          { nav: "omniroute", icon: "server", title: t("omniroute"), sub: s.providers[0] ? s.providers[0].baseUrl : "" },
        ],
      },
      {
        title: t("nav_tools"),
        items: [
          { nav: "terminal", icon: "terminal", title: t("terminal"), sub: t("terminal_hint") },
          { nav: "files", icon: "files", title: t("files"), sub: t("files_hint") },
          { nav: "git", icon: "git", title: t("git"), sub: t("git_hint") },
          { nav: "automation", icon: "bolt", title: t("automation"), sub: t("automation_hint") },
          { nav: "mcp", icon: "server", title: t("mcp"), sub: t("mcp_hint") },
        ],
      },
      {
        title: t("nav_settings"),
        items: [
          { nav: "storage", icon: "database", title: t("storage"), sub: window.Api.Native.workspaceDir() || "workspace" },
          { nav: "about", icon: "info", title: t("about"), sub: `${t("version")} ${window.Api.Native.info().version || ""} · ai.sokey.workspace` },
          { nav: "help", icon: "help", title: t("help"), sub: t("help_hint") },
        ],
      },
    ];
    return `
    <div class="fade-in">
      ${groups.map((g) => `
        <div class="section-title"><span>${esc(g.title)}</span></div>
        <div class="list">
          ${g.items.map((it) => `
            <div class="list-item" data-act="nav" data-nav="${it.nav}">
              <span class="li-ico">${I()(it.icon)}</span>
              <div class="grow"><div class="li-ttl">${esc(it.title)}</div>
                <div class="li-sub nowrap">${esc(it.sub)}</div></div>
              <span class="li-end faint">${I()("chevron")}</span>
            </div>`).join("")}
        </div>`).join("")}
    </div>`;
  }

  /* ======================================================== appearance */
  function appearance() {
    const s = st();
    const filter = window.App.router.params.filter || "all";
    const themes = filter === "all" ? THEMES : THEMES.filter((x) => x.tags.includes(filter));
    return `
    <div class="fade-in">
      <div class="bold" style="font-size:var(--fs-lg)">${esc(t("themes"))}</div>
      <div class="xsmall muted">${esc(t("theme_hint"))}</div>
      <div class="chips mt">
        ${THEME_FILTERS.map((f) => `<button class="chip ${filter === f.id ? "active" : ""}" data-act="theme-filter" data-filter="${f.id}">${esc(ar() ? f.ar : f.en)}</button>`).join("")}
      </div>
      <div class="theme-grid mt">
        ${themes.map((th) => `
          <button class="theme-card ${s.theme === th.id ? "active" : ""}" data-act="theme-pick" data-theme="${th.id}">
            <div class="th-prev" style="background:${th.dots[1]}">
              <div class="th-line" style="width:52%;background:${th.dots[0]}"></div>
              <div class="th-line" style="width:76%;background:${th.dots[2]};opacity:.7"></div>
              <div class="th-line" style="width:38%;background:${th.dots[0]};opacity:.45"></div>
            </div>
            <div class="th-foot"><span>${esc(ar() ? th.ar : th.en)}</span>
              <span class="dot-row"><i style="background:${th.dots[0]}"></i><i style="background:${th.dots[1]}"></i><i style="background:${th.dots[2]}"></i></span>
            </div>
          </button>`).join("")}
      </div>

      <div class="section-title"><span>${esc(t("text_size"))}</span>
        <span class="hint">${Math.round(s.textScale * 100)}%</span></div>
      <div class="card">
        <div class="seg" style="width:100%;justify-content:space-between">
          ${TEXT_SCALES.map((ts) => `<button style="flex:1" class="${Math.abs(s.textScale - ts.v) < 0.01 ? "active" : ""}" data-act="text-scale" data-scale="${ts.v}">${ts.label}</button>`).join("")}
        </div>
        <div class="small muted mt-s">${esc(t("text_size_hint"))}</div>
        <div class="card flat mt-s"><div class="bold">${esc(ar() ? "نموذج للنص بالحجم المختار" : "Sample text at the selected size")}</div>
          <div class="small muted">So-key Ai — ${esc(t("app_tag"))}</div></div>
      </div>

      <div class="section-title"><span>${esc(t("font"))}</span></div>
      <div class="list">
        ${fontRow("system", t("font_default"), ar() ? "الخط العربي الافتراضي للنظام" : "Default system Arabic font")}
        ${fontRow("latin", t("font_latin"), "Inter / Latin stack")}
        ${(s.customFonts || []).map((f) => fontRow(f.file, f.name, (f.size / 1024).toFixed(0) + " KB")).join("")}
      </div>
      <div class="btn-row mt">
        <button class="btn grow" data-act="font-import">${I()("upload")} ${esc(t("import_font"))}</button>
      </div>
    </div>`;
  }

  function fontRow(id, name, sub) {
    const active = st().font === id;
    return `<div class="list-item" data-act="font-pick" data-font="${esc(id)}">
      <span class="li-ico" style="color:${active ? "var(--accent-2)" : "inherit"}">${I()("book")}</span>
      <div class="grow"><div class="li-ttl">${esc(name)}</div><div class="li-sub">${esc(sub)}</div></div>
      <span class="li-end">${active ? `<span style="color:var(--accent-2)">${I()("check")}</span>`
        : (id !== "system" && id !== "latin" ? `<button class="icon-btn ghost" data-act="font-delete" data-font="${esc(id)}">${I()("trash")}</button>` : "")}</span>
    </div>`;
  }

  /* =========================================================== language */
  function language() {
    const s = st();
    const rows = [["ar", "العربية", "RTL"], ["en", "English", "LTR"]];
    return `
    <div class="fade-in">
      <div class="bold" style="font-size:var(--fs-lg)">${esc(t("language"))}</div>
      <div class="xsmall muted">${esc(t("language_hint"))}</div>
      <div class="list mt">
        ${rows.map(([code, name, dir]) => `
          <div class="list-item" data-act="set-lang" data-lang="${code}">
            <span class="li-ico">${I()("globe")}</span>
            <div class="grow"><div class="li-ttl">${esc(name)}</div><div class="li-sub">${dir}</div></div>
            <span class="li-end">${s.lang === code ? `<span style="color:var(--accent-2)">${I()("check")}</span>` : ""}</span>
          </div>`).join("")}
      </div>
      <div class="card mt"><div class="small muted">${esc(ar()
        ? "يتم تبديل اتجاه الواجهة وكل النصوص فورًا، ويُخبر النظام بلغة التطبيق لدعم التطبيقات الأخرى."
        : "Direction and all strings switch instantly, and the system is told the app language.")}</div></div>
    </div>`;
  }

  /* ========================================================== providers */
  function providers() {
    const s = st();
    return `
    <div class="fade-in">
      <div class="row-between">
        <div><div class="bold" style="font-size:var(--fs-lg)">${esc(t("providers"))}</div>
          <div class="xsmall muted">${esc(t("omniroute_hint"))}</div></div>
        <button class="icon-btn accent" data-act="provider-add">${I()("plus")}</button>
      </div>
      <div class="list mt">
        ${s.providers.map((p) => `
          <div class="card">
            <div class="row-between">
              <div class="row grow" style="min-width:0">
                <span class="li-ico" style="color:${s.activeProviderId === p.id ? "var(--accent-2)" : "inherit"}">${I()("key")}</span>
                <div class="grow" style="min-width:0">
                  <div class="bold small nowrap">${esc(p.name)} ${s.activeProviderId === p.id ? `<span class="badge acc">${esc(ar() ? "النشط" : "active")}</span>` : ""}</div>
                  <div class="xsmall muted mono nowrap" style="direction:ltr;text-align:left">${esc(p.baseUrl || "—")} · ${esc(p.model || "—")}</div>
                </div>
              </div>
              <button class="switch ${p.enabled ? "on" : ""}" data-act="toggle-provider" data-id="${p.id}"></button>
            </div>
            <div class="row mt-s" style="gap:8px">
              <span class="badge ${p.status === "ok" ? "ok" : p.status === "err" ? "err" : ""}">${esc(p.status === "ok" ? t("connected") : p.status === "err" ? t("disconnected") : "—")}</span>
              ${p.latency ? `<span class="badge">${p.latency} ms</span>` : ""}
              ${p.models && p.models.length ? `<span class="badge">${p.models.length} ${esc(ar() ? "نموذج" : "models")}</span>` : ""}
            </div>
            <div class="btn-row mt-s">
              <button class="btn sm grow" data-act="provider-test" data-id="${p.id}">${I()("wifi")} ${esc(t("test_connection"))}</button>
              <button class="btn sm grow" data-act="provider-edit" data-id="${p.id}">${I()("edit")} ${esc(t("edit"))}</button>
              <button class="btn sm ${s.activeProviderId === p.id ? "" : "primary"}" data-act="provider-use" data-id="${p.id}" ${s.activeProviderId === p.id ? "disabled" : ""}>${I()("check")}</button>
            </div>
          </div>`).join("")}
      </div>
    </div>`;
  }

  /* ========================================================== omniroute */
  function omniroute() {
    const s = st();
    const p = s.providers.find((x) => x.id === "omniroute") || s.providers[0];
    const presets = ["http://127.0.0.1:20128", "http://localhost:20128", "http://iocaihost:20128", "http://192.168.1.100:20128"];
    return `
    <div class="fade-in">
      <div class="row-between">
        <div><div class="bold" style="font-size:var(--fs-lg)">OmniRoute</div>
          <div class="xsmall muted">${esc(t("omniroute_hint"))}</div></div>
        <span class="badge ${p.status === "ok" ? "ok" : p.status === "err" ? "err" : ""}">${esc(p.status === "ok" ? t("connected") : p.status === "err" ? t("disconnected") : "—")}</span>
      </div>

      <div class="card mt">
        <div class="field"><label>${esc(t("base_url"))}</label>
          <input class="input mono" dir="ltr" id="or-url" value="${esc(p.baseUrl)}" placeholder="http://127.0.0.1:20128"></div>
        <div class="chips mt-s">
          ${presets.map((u) => `<button class="chip" data-act="or-preset" data-url="${esc(u)}">${esc(u.replace("http://", ""))}</button>`).join("")}
        </div>
        <div class="field mt-s"><label>${esc(t("model"))}</label>
          <input class="input mono" dir="ltr" id="or-model" value="${esc(p.model || "auto")}" placeholder="auto"></div>
        <div class="field mt-s"><label>${esc(t("api_key"))}</label>
          <input class="input mono" dir="ltr" type="password" id="or-key" value="${esc(p.apiKey || "")}" placeholder="${esc(t("api_key_ph"))}"></div>
        <div class="btn-row mt">
          <button class="btn primary grow" data-act="or-save">${I()("check")} ${esc(t("save"))}</button>
          <button class="btn grow" data-act="or-test">${I()("wifi")} ${esc(t("test_omniroute"))}</button>
        </div>
        ${p.models && p.models.length ? `<div class="chips mt-s">${p.models.slice(0, 24).map((m) =>
          `<button class="chip ${p.model === m ? "active" : ""}" data-act="or-set-model" data-model="${esc(m)}">${esc(m)}</button>`).join("")}</div>` : ""}
      </div>

      <div class="card mt">
        <div class="card-title">${esc(t("omniroute_defaults"))}</div>
        <div class="small muted mt-s">${esc(ar()
          ? "شغّل OmniRoute على نفس الجهاز فاستخدم 127.0.0.1، أو على جهاز آخر فاستخدم عنوان الشبكة المحلية. يدعم التطبيق HTTP غير المشفّر للشبكة المحلية."
          : "Run OmniRoute on this device → 127.0.0.1; on another machine → its LAN address. Cleartext HTTP is allowed for LAN endpoints.")}</div>
        <button class="btn block mt-s" data-act="open-link" data-url="${esc(p.baseUrl)}">${I()("external")} ${esc(t("open"))}</button>
      </div>
    </div>`;
  }

  /* ============================================================ storage */
  function storage() {
    const s = window.Store.state;
    const bytes = new Blob([JSON.stringify(s)]).size;
    return `
    <div class="fade-in">
      <div class="bold" style="font-size:var(--fs-lg)">${esc(t("storage"))}</div>
      <div class="card mt">
        <div class="kv"><span class="k">${esc(t("workspace_path"))}</span><span class="v mono small" style="direction:ltr">${esc(window.Api.Native.workspaceDir() || "—")}</span></div>
        <div class="kv"><span class="k">${esc(ar() ? "حجم بيانات التطبيق" : "App state size")}</span><span class="v">${(bytes / 1024).toFixed(1)} KB</span></div>
        <div class="kv"><span class="k">${esc(t("chats"))}</span><span class="v">${s.chats.length}</span></div>
        <div class="kv"><span class="k">${esc(ar() ? "الخطوط المضافة" : "Custom fonts")}</span><span class="v">${(s.settings.customFonts || []).length}</span></div>
        <div class="kv"><span class="k">${esc(ar() ? "تشغيل الوكلاء بعد إعادة التشغيل" : "Resume agents after reboot")}</span>
          <button class="switch ${window.Api.Native.getBootResume() ? "on" : ""}" data-act="toggle-boot-resume"></button></div>
      </div>
      <div class="btn-row mt">
        <button class="btn grow" data-act="files-go">${I()("files")} ${esc(t("files"))}</button>
        <button class="btn danger grow" data-act="reset-app">${I()("trash")} ${esc(t("reset_app"))}</button>
      </div>
      <div class="card mt"><div class="small muted">${esc(t("reset_confirm"))}</div></div>
    </div>`;
  }

  /* ============================================================== about */
  function about() {
    const info = window.Api.Native.info();
    return `
    <div class="fade-in">
      <div class="card center" style="flex-direction:column;gap:10px;padding:22px">
        <img src="img/logo-192.png" alt="So-key Ai" style="width:86px;height:86px;border-radius:22px">
        <div class="bold" style="font-size:var(--fs-xl)">So-key Ai</div>
        <div class="small muted">${esc(t("app_tag"))}</div>
        <span class="badge acc">v${esc(info.version || "1.0.0")}</span>
      </div>
      <div class="card mt">
        <div class="kv"><span class="k">${esc(t("package"))}</span><span class="v mono">${esc(info.pkg || "ai.sokey.workspace")}</span></div>
        <div class="kv"><span class="k">${esc(t("platform"))}</span><span class="v">${esc(info.platform || "web")} · SDK ${esc(String(info.sdk || 0))}</span></div>
        <div class="kv"><span class="k">${esc(t("device"))}</span><span class="v">${esc(window.Api.Native.deviceName() || "—")}</span></div>
        <div class="kv"><span class="k">${esc(t("workspace_path"))}</span><span class="v mono small" style="direction:ltr">${esc(window.Api.Native.workspaceDir() || "—")}</span></div>
        <div class="kv"><span class="k">ABI</span><span class="v">${esc(info.abi || "arm64-v8a / universal")}</span></div>
        <div class="kv"><span class="k">License</span><span class="v">GPL-3.0-or-later</span></div>
      </div>
      <div class="card mt"><div class="small muted">${esc(t("about_text"))}</div></div>
      ${crashCard()}
      <div class="btn-row mt">
        <button class="btn grow" data-act="open-link" data-url="https://github.com/ahmedsykoo/So-key-ai">${I()("git")} GitHub</button>
        <button class="btn grow" data-act="nav" data-nav="help">${I()("help")} ${esc(t("help"))}</button>
      </div>
    </div>`;
  }

  /** Shows the last fatal error (if any) with copy / clear actions. */
  function crashCard() {
    const log = window.Api.Native.lastCrash();
    if (!log) {
      return `<div class="card mt"><div class="row-between">
        <span class="small muted">${esc(ar() ? "سجل الأخطاء: لا توجد أخطاء مسجّلة ✅" : "Error log: nothing recorded ✅")}</span>
      </div></div>`;
    }
    return `<div class="section-title"><span>${esc(ar() ? "سجل آخر خطأ" : "Last error log")}</span></div>
      <div class="card">
        <pre class="term" style="max-height:220px;font-size:11px">${esc(log.slice(0, 4000))}</pre>
        <div class="btn-row mt-s">
          <button class="btn sm grow" data-act="copy-crash">${I()("copy")} ${esc(t("copy"))}</button>
          <button class="btn sm danger grow" data-act="clear-crash">${I()("trash")} ${esc(t("delete"))}</button>
        </div>
      </div>`;
  }

  window.Screens3 = { settings, appearance, language, providers, omniroute, storage, about, crashCard, THEMES };
  Object.assign(window.Screens, window.Screens3);
})();
