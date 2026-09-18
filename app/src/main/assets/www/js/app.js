/* ==========================================================================
   So-key Ai — app shell, router, actions, chat engine, boot
   ========================================================================== */
(function () {
  "use strict";
  const icon = (n) => window.UI.icon(n);
  const esc = (s) => window.UI.esc(s);
  const toast = (m, k) => window.UI.toast(m, k);
  const S = () => window.Store.state;

  /* --------------------------------------------------------------- shell */
  const NAV = [
    { group: "nav_general", items: [
      { id: "home", icon: "home", key: "home" },
      { id: "chats", icon: "chat", key: "chats" },
      { id: "projects", icon: "folder", key: "projects" },
      { id: "agents", icon: "users", key: "agents" },
    ] },
    { group: "nav_tools", items: [
      { id: "skills", icon: "sparkles", key: "skills" },
      { id: "plugins", icon: "plug", key: "plugins" },
      { id: "tools", icon: "wrench", key: "tools" },
      { id: "terminal", icon: "terminal", key: "terminal" },
      { id: "files", icon: "files", key: "files" },
      { id: "git", icon: "git", key: "git" },
      { id: "automation", icon: "bolt", key: "automation" },
    ] },
    { group: "nav_stats", items: [
      { id: "usage", icon: "chart", key: "usage" },
      { id: "reports", icon: "report", key: "reports" },
    ] },
    { group: "nav_settings", items: [
      { id: "settings", icon: "settings", key: "settings" },
      { id: "appearance", icon: "palette", key: "appearance" },
      { id: "language", icon: "globe", key: "language" },
      { id: "help", icon: "help", key: "help" },
    ] },
  ];

  const BOTTOM = [
    { id: "home", icon: "home", key: "home" },
    { id: "chats", icon: "chat", key: "chats" },
    { id: "projects", icon: "folder", key: "projects" },
    { id: "skills", icon: "sparkles", key: "skills" },
    { id: "settings", icon: "menu", key: "settings" },
  ];

  const TITLES = {
    home: () => ["So-key Ai", t("app_tag")],
    chats: () => [t("chats"), `${S().chats.length} ${t("chats_label")}`],
    chat: () => { const c = window.Store.chat(); return [c ? c.title : t("new_chat"), t("your_message_ph")]; },
    projects: () => [t("projects"), t("projects_hint")],
    agents: () => [t("agents"), t("all_agents")],
    skills: () => [t("skills"), t("skills_pinned")],
    plugins: () => [t("plugins"), t("deps_note")],
    tools: () => [t("tools"), t("tools_hint")],
    terminal: () => [t("terminal"), t("terminal_hint")],
    files: () => [t("files"), t("files_hint")],
    git: () => [t("git"), t("git_hint")],
    automation: () => [t("automation"), t("automation_hint")],
    usage: () => [t("usage"), t("usage_hint")],
    reports: () => [t("reports"), t("reports_hint")],
    settings: () => [t("settings"), t("nav_settings")],
    appearance: () => [t("appearance"), t("theme_hint")],
    language: () => [t("language"), t("language_hint")],
    providers: () => [t("providers"), t("omniroute_hint")],
    omniroute: () => ["OmniRoute", t("omniroute_hint")],
    mcp: () => [t("mcp"), t("mcp_hint")],
    browser: () => [t("browser"), t("browser_ph")],
    storage: () => [t("storage"), t("files_hint")],
    about: () => [t("about"), `v1.0.0 · ai.sokey.workspace`],
    help: () => [t("help"), t("help_hint")],
    search: () => [t("search_ph"), t("search_all")],
  };

  let streamCtl = null;

  const App = {
    router: {
      route: "home",
      params: {},
      helper: {
        isStreaming: (chatId) => !!(streamCtl && streamCtl.chatId === chatId),
        mode: (chatId) => (streamCtl && streamCtl.modes && streamCtl.modes[chatId]) || window.App.chatModes[chatId] || "chat",
      },
    },
    chatModes: {},
    term: { log: [] },
    files: { path: "", entries: [] },
    git: { repos: [], out: "" },
    auto: { running: false, done: {} },
    usage: { range: "week" },
    browser: { last: "https://github.com/ahmedsykoo/So-key-ai" },
    transport: "auto",
  };
  window.App = App;
  window.Store.chat = window.Store.chat.bind(window.Store);

  /* ------------------------------------------------------------ rendering */
  function shell() {
    const s = S();
    return `
    <aside id="sidebar">
      <div class="brand">
        <img src="img/logo-192.png" alt="So-key Ai">
        <div class="grow"><div class="b-name">So-key Ai</div><div class="b-sub">${esc(t("app_tag"))}</div></div>
      </div>
      <div class="search" style="margin:0 4px 8px">
        <span>${icon("search")}</span>
        <input id="side-search" placeholder="${esc(t("search_ph"))}" readonly data-act="nav" data-nav="search">
      </div>
      <div class="grow" style="overflow-y:auto;overflow-x:hidden;padding:0 2px">
        ${NAV.map((g) => `
          <div class="nav-group">
            <div class="nav-label">${esc(t(g.group))}</div>
            ${g.items.map((it) => `
              <button class="nav-item ${App.router.route === it.id ? "active" : ""}" data-act="nav" data-nav="${it.id}">
                ${icon(it.icon)}<span class="grow nowrap">${esc(t(it.key))}</span>
                ${it.id === "chats" && s.chats.length ? `<span class="n-badge">${s.chats.length}</span>` : ""}
              </button>`).join("")}
          </div>`).join("")}
      </div>
      <div class="card tight" style="margin:8px 4px 6px">
        <div class="row">
          ${window.UI.ring(Math.min(100, (App.native.usageToday() / Math.max(1, App.native.tokenLimit())) * 100), null, null, 56)}
          <div class="grow">
            <div class="small bold">${window.UI.nfmt(App.native.usageToday())} tok</div>
            <div class="xsmall muted">${esc(t("used_today"))}</div>
            <div class="xsmall faint">v1.0.0 · ai.sokey.workspace</div>
          </div>
        </div>
      </div>
      <button class="nav-item" data-act="toggle-drawer-close" style="margin:0 4px">
        <span class="avatar sm">A</span>
        <span class="grow nowrap">Ahmed Ramadan</span>
        ${icon("more")}
      </button>
    </aside>

    <div id="main">
      <header id="topbar">
        <button class="icon-btn" id="menu-btn" data-act="toggle-drawer">${icon("menu")}</button>
        <div class="grow" style="min-width:0">
          <div class="tb-title nowrap" id="tb-title"></div>
          <div class="tb-sub nowrap" id="tb-sub"></div>
        </div>
        <button class="icon-btn" data-act="nav" data-nav="search">${icon("search")}</button>
        <button class="icon-btn" data-act="notify-demo">${icon("bell")}</button>
        <div class="avatar sm" data-act="nav" data-nav="settings">A</div>
      </header>
      <main id="screen"></main>
      <nav id="bottomnav">
        ${BOTTOM.map((b) => `<button class="bn-item ${App.router.route === b.id ? "active" : ""}" data-act="nav" data-nav="${b.id}">
          ${icon(b.icon)}<span>${esc(t(b.key))}</span></button>`).join("")}
      </nav>
      <div id="scrim" data-act="toggle-drawer-close"></div>
    </div>
    <div id="modal-root"></div>
    <div id="toast-root"></div>`;
  }

  function go(route, params) {
    App.router.route = route;
    App.router.params = params || {};
    document.body.classList.remove("drawer");
    render();
    if (typeof App.router.params.focus === "string") {
      const el = document.getElementById(App.router.params.focus);
      if (el) el.focus();
    }
  }

  function render() {
    const route = App.router.route;
    const view = window.Screens[route] || window.Screens.home;
    const keepModal = document.getElementById("modal-root");
    const modalHtml = keepModal ? keepModal.innerHTML : "";
    const app = document.getElementById("app");
    if (!app) return;
    app.innerHTML = shell();
    const t1 = TITLES[route] ? TITLES[route]() : ["So-key Ai", ""];
    const titleEl = document.getElementById("tb-title");
    const subEl = document.getElementById("tb-sub");
    if (titleEl) titleEl.textContent = t1[0];
    if (subEl) subEl.textContent = t1[1];
    const screen = document.getElementById("screen");
    if (screen) screen.innerHTML = view();
    const modal = document.getElementById("modal-root");
    if (modal && modalHtml) { modal.innerHTML = modalHtml; modal.style.pointerEvents = "auto"; }
    afterRender();
  }

  function afterRender() {
    const route = App.router.route;
    const box = document.getElementById("messages");
    if (box) box.scrollTop = box.scrollHeight;
    if (route === "chat") {
      const box2 = document.getElementById("messages");
      if (box2) box2.scrollTop = box2.scrollHeight;
    }
    if (route === "files") refreshFiles(App.files.path);
    if (route === "terminal") {
      const log = document.getElementById("term-log");
      if (log) log.scrollTop = log.scrollHeight;
    }
  }

  /* ------------------------------------------------------------- actions */
  const Actions = {
    nav(el) { go(el.dataset.nav); window.Api.Native.haptic(); },
    "toggle-drawer"() { document.body.classList.add("drawer"); },
    "toggle-drawer-close"() { document.body.classList.remove("drawer"); },
    "modal-close"() { window.UI.closeModal(); },
    "modal-close-bg"(el, ev) { if (ev.target === el) window.UI.closeModal(); },
    "open-link"(el) { window.Api.Native.openUrl(el.dataset.url); },
    "toggle-theme-quick"() {
      const order = ["default", "amoled", "neon", "minimal", "light", "ocean", "sunset", "forest", "cyber", "dracula", "terminal", "glass"];
      const cur = S().settings.theme;
      const next = order[(order.indexOf(cur) + 1) % order.length];
      window.Store.set("settings.theme", next);
      applyTheme();
      toast(t("theme") + ": " + next);
    },
    "notify-demo"() {
      window.Api.Native.notify("So-key Ai", t("notif_demo") || (S().settings.lang === "ar" ? "كل شيء جاهز ✅" : "All set ✅"));
    },

    /* chats */
    "new-chat"() { window.Store.newChat(); go("chat"); },
    "open-chat"(el) { window.Store.state.activeChatId = el.dataset.id; go("chat"); },
    "chat-mode"(el) {
      const c = window.Store.chat();
      if (c) App.chatModes[c.id] = el.dataset.mode;
      render();
    },
    "chat-menu"() {
      const c = window.Store.chat();
      window.UI.modal(t("chats"), `
        <div class="col">
          <button class="list-item" data-act="chat-export"><span class="li-ico">${icon("upload")}</span><div class="grow"><div class="li-ttl">${esc(t("export_chat"))}</div></div></button>
          <button class="list-item" data-act="chat-rename"><span class="li-ico">${icon("edit")}</span><div class="grow"><div class="li-ttl">${esc(t("edit"))}</div></div></button>
          <button class="list-item" data-act="chat-clear"><span class="li-ico">${icon("trash")}</span><div class="grow"><div class="li-ttl">${esc(t("clear_chat"))}</div></div></button>
          <button class="list-item" data-act="chat-delete"><span class="li-ico" style="color:var(--red)">${icon("trash")}</span><div class="grow"><div class="li-ttl">${esc(t("delete"))}</div></div></button>
        </div>`, "", {});
      window.__chatMenuId = c ? c.id : null;
    },
    "chat-export"() {
      const c = window.Store.chat();
      if (!c) return;
      const md = "# " + c.title + "\n\n" + c.messages.map((m) => `**${m.role === "user" ? t("you") : t("ai")}** (${window.UI.clock(m.ts)})\n\n${m.content}`).join("\n\n---\n\n");
      const path = "exports/chat-" + c.id + ".md";
      window.Api.Native.writeFile(path, md) ? toast(t("report_saved"), "ok") : window.Api.Native.shareText(md);
      window.UI.closeModal();
      window.Store.logActivity(S().settings.lang === "ar" ? "تصدير محادثة" : "Exported a chat", "⇧", "#22c55e");
    },
    "chat-rename"() {
      const c = window.Store.chat();
      if (!c) return;
      window.UI.modal(t("edit"), `<div class="field"><label>${esc(t("file_name"))}</label>
        <input class="input" id="rn" value="${esc(c.title)}"></div>`, "", {
        onMount: (root) => {
          const inp = root.querySelector("#rn");
          inp.focus();
          inp.addEventListener("change", () => { c.title = inp.value.trim() || c.title; window.Store.persist(); window.UI.closeModal(); render(); });
        },
      });
    },
    "chat-clear"() {
      const c = window.Store.chat();
      if (!c) return;
      c.messages = [];
      window.Store.persist();
      window.UI.closeModal();
      render();
    },
    "chat-delete"() {
      const c = window.Store.chat();
      if (!c) return;
      window.UI.closeModal();
      window.UI.confirmDialog(t("confirm_delete"), () => {
        window.Store.deleteChat(c.id);
        toast(t("deleted"), "ok");
        go("chats");
      });
    },
    quick(el) {
      const ta = document.getElementById("composer");
      if (ta) { ta.value = el.dataset.text; autosize(ta); }
      send();
    },
    send() { send(); },
    "stop-stream"() { if (streamCtl && streamCtl.abort) streamCtl.abort(); },
    attach() {
      const picked = window.Api.Native.openFileDialog ? window.Api.Native.openFileDialog() : null;
      if (!picked) { toast(S().settings.lang === "ar" ? "الإرفاق يتطلب اختيار ملف من الجهاز" : "Attach needs a device file picker"); return; }
      const c = window.Store.chat();
      if (c) { const ta = document.getElementById("composer"); if (ta) ta.value = (ta.value ? ta.value + "\n" : "") + "[ملف] " + picked; }
    },
    "copy-msg"(el) {
      const c = window.Store.chat();
      const m = c && c.messages.find((x) => x.id === el.dataset.id);
      if (!m) return;
      window.Api.Native.clipboard(m.content);
      toast(t("copied"), "ok");
    },
    "regen-msg"(el) {
      const c = window.Store.chat();
      if (!c) return;
      const idx = c.messages.findIndex((x) => x.id === el.dataset.id);
      if (idx < 0) return;
      const prompt = [...c.messages].slice(0, idx).reverse().find((m) => m.role === "user");
      c.messages.splice(idx);
      window.Store.persist();
      render();
      if (prompt) send(prompt.content, true);
    },

    /* projects */
    "project-tab"(el) { window.App.router.params.tag = el.dataset.tag; render(); },
    "project-open"(el) {
      const p = S().projects.find((x) => x.id === el.dataset.id);
      if (!p) return;
      window.UI.modal(p.name, `
        <div class="card flat"><div class="small muted">${esc(p.sub)}</div>
          <div class="bar mt-s"><i style="width:${p.progress}%"></i></div>
          <div class="row-between small mt-s"><span class="muted">${p.files} ${esc(t("files_count"))}</span>
            <span class="muted">${p.done} ${esc(t("done_count"))}</span><span class="bold">${p.progress}%</span></div></div>
        <div class="btn-row mt">
          <button class="btn primary grow" data-act="project-chat" data-id="${p.id}">${icon("chat")} ${esc(t("chat_mode"))}</button>
          <button class="btn grow" data-act="project-files" data-id="${p.id}">${icon("files")} ${esc(t("files"))}</button>
        </div>`, "", {});
    },
    "project-chat"(el) {
      const p = S().projects.find((x) => x.id === el.dataset.id);
      window.UI.closeModal();
      window.Store.newChat(p.name);
      go("chat");
      setTimeout(() => {
        const ta = document.getElementById("composer");
        if (ta) { ta.value = S().settings.lang === "ar" ? `اعمل على مشروع ${p.name}: ${p.sub}` : `Work on ${p.name}: ${p.sub}`; autosize(ta); }
      }, 60);
    },
    "project-files"() { window.UI.closeModal(); go("files"); },
    "new-project"() {
      window.UI.modal(t("new_project"), `
        <div class="field"><label>${esc(t("file_name"))}</label><input class="input" id="np-name" placeholder="So-key App"></div>
        <div class="field mt-s"><label>${esc(t("chat_empty_hint"))}</label><input class="input" id="np-sub" placeholder="…"></div>`,
        `<button class="btn grow" data-act="modal-close">${esc(t("cancel"))}</button>
         <button class="btn primary grow" id="np-save">${esc(t("save"))}</button>`, {
        onMount: (root) => {
          root.querySelector("#np-save").addEventListener("click", () => {
            const name = root.querySelector("#np-name").value.trim() || "Project";
            const sub = root.querySelector("#np-sub").value.trim() || "—";
            S().projects.unshift({ id: window.Store.uid("p"), name, sub, files: 0, done: 0, progress: 0, color: "#f97316" });
            window.Store.persist();
            window.UI.closeModal();
            render();
            toast(t("created"), "ok");
          });
        },
      });
    },

    /* agents */
    "toggle-agent"(el) {
      const a = S().agents.find((x) => x.id === el.dataset.id);
      if (!a) return;
      a.enabled = !a.enabled;
      window.Store.persist();
      render();
    },
    "add-agent"() {
      window.UI.modal(t("add_agent"), `
        <div class="field"><label>${esc(t("my_agents"))}</label><input class="input" id="ag-name" placeholder="My Agent"></div>
        <div class="field mt-s"><label>${esc(t("chat_empty_hint"))}</label><input class="input" id="ag-sub" placeholder="…"></div>
        <div class="field mt-s"><label>${esc(t("model"))}</label><input class="input mono" id="ag-model" placeholder="auto"></div>`,
        `<button class="btn grow" data-act="modal-close">${esc(t("cancel"))}</button>
         <button class="btn primary grow" id="ag-save">${esc(t("add"))}</button>`, {
        onMount: (root) => {
          root.querySelector("#ag-save").addEventListener("click", () => {
            const name = root.querySelector("#ag-name").value.trim() || "Agent";
            const sub = root.querySelector("#ag-sub").value.trim() || "custom";
            S().agents.push({
              id: window.Store.uid("a"), name, sub, tokens: 0, limit: 200000, enabled: true,
              color: "#22d3ee", glyph: name.slice(0, 1).toUpperCase(),
            });
            window.Store.persist();
            window.UI.closeModal();
            render();
          });
        },
      });
    },
    async "agent-run"() {
      const task = (document.getElementById("agent-task") || {}).value;
      if (!task) return;
      window.Store.newChat(t(task ? task.slice(0, 32) : "agent"));
      go("chat");
      App.chatModes[window.Store.state.activeChatId] = "workflow";
      setTimeout(() => send(task, true), 120);
    },

    /* skills / plugins / mcp */
    "skills-tab"(el) { App.router.params.tab = el.dataset.tab; render(); },
    "toggle-skill"(el) {
      const k = S().skills.find((x) => x.id === el.dataset.id);
      if (!k) return;
      k.installed = !k.installed;
      window.Store.persist();
      render();
      toast(k.installed ? t("install_skill_ok") : t("uninstall_skill_ok"), "ok");
    },
    "install-skill"(el) {
      const k = S().skills.find((x) => x.id === el.dataset.id);
      if (!k) return;
      k.installed = true;
      window.Store.persist();
      render();
      toast(t("install_skill_ok"), "ok");
    },
    "add-skill"() {
      window.UI.modal(t("add_skill"), `
        <div class="field"><label>${esc(t("skills"))}</label><input class="input" id="sk-name" placeholder="My Skill"></div>
        <div class="field mt-s"><label>${esc(t("chat_empty_hint"))}</label><input class="input" id="sk-sub" placeholder="…"></div>`,
        `<button class="btn grow" data-act="modal-close">${esc(t("cancel"))}</button>
         <button class="btn primary grow" id="sk-save">${esc(t("add"))}</button>`, {
        onMount: (root) => {
          root.querySelector("#sk-save").addEventListener("click", () => {
            const name = root.querySelector("#sk-name").value.trim() || "Skill";
            S().skills.unshift({ id: window.Store.uid("s"), name, nameAr: name, glyph: "✦", installed: true });
            window.Store.persist();
            window.UI.closeModal();
            render();
          });
        },
      });
    },
    "toggle-plugin"(el) {
      const p = S().plugins.find((x) => x.id === el.dataset.id);
      if (!p) return;
      p.enabled = !p.enabled;
      window.Store.persist();
      render();
    },
    "toggle-mcp"(el) {
      const m = S().mcp.find((x) => x.id === el.dataset.id);
      if (!m) return;
      m.enabled = !m.enabled;
      window.Store.persist();
      render();
    },
    "mcp-add"() {
      window.UI.modal(t("add_server"), `
        <div class="field"><label>${esc(t("file_name"))}</label><input class="input" id="mc-name" placeholder="my-server"></div>
        <div class="field mt-s"><label>transport</label>
          <select class="input" id="mc-tr"><option value="stdio">stdio</option><option value="http">http</option></select></div>
        <div class="field mt-s"><label>endpoint</label><input class="input mono" dir="ltr" id="mc-ep" placeholder="http://127.0.0.1:20128/mcp"></div>`,
        `<button class="btn grow" data-act="modal-close">${esc(t("cancel"))}</button>
         <button class="btn primary grow" id="mc-save">${esc(t("add"))}</button>`, {
        onMount: (root) => {
          root.querySelector("#mc-save").addEventListener("click", () => {
            S().mcp.push({
              id: window.Store.uid("m"),
              name: root.querySelector("#mc-name").value.trim() || "server",
              transport: root.querySelector("#mc-tr").value,
              endpoint: root.querySelector("#mc-ep").value.trim(),
              enabled: true,
            });
            window.Store.persist();
            window.UI.closeModal();
            render();
          });
        },
      });
    },

    /* terminal */
    "term-run"() { runTerminal((document.getElementById("term-input") || {}).value); },
    "term-insert"(el) {
      const inp = document.getElementById("term-input");
      if (inp) { inp.value = el.dataset.cmd; inp.focus(); }
    },
    "term-clear"() { App.term.log = []; render(); },

    /* files */
    "files-refresh"() { refreshFiles(App.files.path); toast(t("saved"), "ok"); },
    "files-cd"(el) { refreshFiles(el.dataset.path || ""); },
    "files-mkdir"() {
      window.UI.modal(t("new_folder"), `<div class="field"><label>${esc(t("file_name"))}</label>
        <input class="input" id="md-name" placeholder="notes"></div>`, "", {
        onMount: (root) => {
          const i = root.querySelector("#md-name");
          i.focus();
          i.addEventListener("change", () => {
            const p = (App.files.path ? App.files.path + "/" : "") + i.value.trim();
            window.Api.Native.mkdir(p);
            window.UI.closeModal();
            refreshFiles(App.files.path);
          });
        },
      });
    },
    "files-import"() {
      const picked = window.Api.Native.openFileDialog ? window.Api.Native.openFileDialog() : null;
      if (picked) { toast(t("saved"), "ok"); refreshFiles(App.files.path); }
      else toast(S().settings.lang === "ar" ? "اختر ملفًا من الجهاز" : "Pick a device file");
    },
    "file-open"(el) {
      const path = el.dataset.path;
      const content = window.Api.Native.readFile(path);
      window.UI.modal(path.split("/").pop(), `<pre class="term" style="max-height:46vh">${esc(String(content == null ? "" : content).slice(0, 6000))}</pre>`,
        `<button class="btn grow" data-act="file-share" data-path="${esc(path)}">${icon("share")} ${esc(t("share"))}</button>
         <button class="btn grow" data-act="modal-close">${esc(t("close"))}</button>`, {});
    },
    "file-share"(el) { window.Api.Native.shareFile(el.dataset.path); window.UI.closeModal(); },
    "file-delete"(el) {
      const path = el.dataset.path;
      window.UI.confirmDialog(t("confirm_delete"), () => {
        window.Api.Native.deleteFile(path);
        refreshFiles(App.files.path);
        toast(t("deleted"), "ok");
      });
    },
    "files-go"() { go("files"); },
    "reset-app"() {
      window.UI.confirmDialog(t("reset_confirm"), () => {
        window.Store.reset();
        applyTheme();
        go("home");
        toast(t("deleted"), "ok");
      });
    },

    /* git */
    "gh-save"() {
      window.Store.set("settings.githubUser", (document.getElementById("gh-user") || {}).value || "");
      window.Store.set("settings.githubToken", (document.getElementById("gh-token") || {}).value || "");
      toast(t("saved"), "ok");
    },
    async "gh-repos"() {
      window.Store.set("settings.githubUser", (document.getElementById("gh-user") || {}).value || "");
      window.Store.set("settings.githubToken", (document.getElementById("gh-token") || {}).value || "");
      App.git.error = "";
      try {
        const user = S().settings.githubUser || "ahmedsykoo";
        const repos = await window.Api.github(`/users/${encodeURIComponent(user)}/repos?per_page=30&sort=updated`);
        App.git.repos = Array.isArray(repos) ? repos : [];
      } catch (e) {
        App.git.error = String(e.message || e);
      }
      render();
    },
    "git-cmd"(el) {
      const out = window.Api.Native.exec(el.dataset.cmd);
      App.git.out = (App.git.out ? App.git.out + "\n" : "") + "$ " + el.dataset.cmd + "\n" +
        (out == null ? (S().settings.lang === "ar" ? "غير مدعوم على هذا الجهاز" : "not supported on this device") : out);
      render();
    },

    /* automation */
    "wf-toggle"(el) {
      const w = S().workflows.find((x) => x.id === el.dataset.id);
      if (!w) return;
      w.enabled = !w.enabled;
      window.Store.persist();
      render();
    },
    "wf-new"() {
      window.UI.modal(t("new_workflow"), `
        <div class="field"><label>${esc(t("file_name"))}</label><input class="input" id="wf-name" placeholder="My workflow"></div>
        <div class="field mt-s"><label>${esc(t("steps"))} (${esc(t("http"))})</label>
          <input class="input mono" dir="ltr" id="wf-url" placeholder="https://api.github.com/repos/ahmedsykoo/So-key-ai"></div>`,
        `<button class="btn grow" data-act="modal-close">${esc(t("cancel"))}</button>
         <button class="btn primary grow" id="wf-save">${esc(t("save"))}</button>`, {
        onMount: (root) => {
          root.querySelector("#wf-save").addEventListener("click", () => {
            const url = root.querySelector("#wf-url").value.trim();
            S().workflows.push({
              id: window.Store.uid("w"),
              name: root.querySelector("#wf-name").value.trim() || "Workflow",
              steps: 2, lastRun: 0, enabled: true,
              script: [{ type: "http", url, label: t("test_connection") }, { type: "file", path: "reports/last-run.md", label: t("export_report") }],
            });
            window.Store.persist();
            window.UI.closeModal();
            render();
          });
        },
      });
    },
    async "wf-run"(el) {
      const w = S().workflows.find((x) => x.id === el.dataset.id);
      if (!w || App.auto.running) return;
      App.auto.running = true;
      App.auto.done[w.id] = 0;
      App.native.startAgents(S().settings.lang === "ar" ? "تشغيل سير العمل: " + w.name : "Running workflow: " + w.name);
      render();
      let log = "# " + w.name + "\n\n";
      try {
        for (let i = 0; i < (w.script || []).length; i++) {
          const step = w.script[i];
          let result = "";
          if (step.type === "http") {
            const url = step.url || (window.Api.provider() || {}).baseUrl;
            try {
              if (url) {
                const res = await fetch(url, { headers: { Accept: "application/json" } });
                result = "HTTP " + res.status + " — " + (await res.text()).slice(0, 400);
              } else result = "no url";
            } catch (e) { result = "error: " + e.message; }
          } else if (step.type === "file") {
            result = "written: " + step.path;
          } else {
            result = step.text || "ok";
          }
          log += `## ${i + 1}. ${step.label || step.type}\n\n${result}\n\n`;
          App.auto.done[w.id] = i + 1;
          render();
          await new Promise((r) => setTimeout(r, 260));
        }
        const path = "reports/" + w.id + "-" + Date.now() + ".md";
        window.Api.Native.writeFile(path, log);
        w.lastRun = Date.now();
        window.Store.persist();
        window.Store.logActivity((S().settings.lang === "ar" ? "تشغيل سير العمل: " : "Ran workflow: ") + w.name, "⚡", "#f59e0b");
        toast(t("report_saved"), "ok");
      } finally {
        App.auto.running = false;
        App.native.stopAgents();
        render();
      }
    },

    /* usage / reports */
    "toggle-boot-resume"(el) {
      const next = !window.Api.Native.getBootResume();
      window.Api.Native.setBootResume(next);
      el.classList.toggle("on", next);
      toast(next ? t("active") : t("inactive"), "ok");
    },
    "usage-range"(el) { App.usage.range = el.dataset.range; render(); },
    "report-usage"() {
      const series = window.Store.weekSeries();
      const s = S();
      let md = `# ${t("report_usage")} — So-key Ai\n\n`;
      md += `${t("used_today")}: ${App.native.usageToday()} / ${App.native.tokenLimit()}\n\n| ${t("day")} | tokens |\n|---|---|\n`;
      series.forEach((d) => { md += `| ${d.day} | ${d.tokens} |\n`; });
      md += `\n## ${t("my_agents")}\n\n`;
      s.agents.forEach((a) => { md += `- ${a.name}: ${a.tokens} / ${a.limit}\n`; });
      const path = "exports/usage-report-" + Date.now() + ".md";
      window.Api.Native.writeFile(path, md);
      window.Store.logActivity(t("report_usage"), "▤", "#f97316");
      toast(t("report_saved"), "ok");
      render();
    },
    "report-chats"() {
      const s = S();
      let md = `# So-key Ai — ${t("reports")}\n\n${s.chats.length} ${t("chats_label")}\n\n`;
      s.chats.slice(0, 20).forEach((c) => {
        md += `## ${c.title}\n\n`;
        c.messages.slice(-6).forEach((m) => { md += `**${m.role}:** ${m.content.slice(0, 400)}\n\n`; });
      });
      const path = "exports/chats-report-" + Date.now() + ".md";
      window.Api.Native.writeFile(path, md);
      window.Store.logActivity(t("report_from_chat"), "▤", "#a855f7");
      toast(t("report_saved"), "ok");
      render();
    },

    /* browser + apk */
    "browser-open"(el) {
      const url = el.dataset.url || (document.getElementById("browser-url") || {}).value || App.browser.last;
      App.browser.last = url;
      window.Api.Native.openBrowser(url);
      window.Store.logActivity(url, "🌐", "#22d3ee");
    },
    "browser-frame"(el) {
      const url = el.dataset.url || (document.getElementById("browser-url") || {}).value || App.browser.last;
      App.browser.last = url;
      window.Api.Native.openBrowser(url);
    },
    "open-browser-frame"(el) {
      window.Api.Native.openBrowser(el.dataset.url || "http://127.0.0.1:20128");
    },
    async "pick-apk"() {
      const can = window.Api.Native.canInstall();
      if (!can) { toast(t("install_blocked"), "err"); return; }
      const path = window.Api.Native.openFileDialog ? window.Api.Native.openFileDialog() : null;
      if (!path) return;
      const res = window.Api.Native.installApk(path);
      toast(res || t("install"), "ok");
    },

    /* appearance */
    "theme-pick"(el) {
      window.Store.set("settings.theme", el.dataset.theme);
      applyTheme();
      render();
      toast(t("saved"), "ok");
    },
    "theme-filter"(el) { App.router.params.filter = el.dataset.filter; render(); },
    "text-scale"(el) {
      window.Store.set("settings.textScale", Number(el.dataset.scale));
      applyTheme();
      render();
    },
    "font-pick"(el) {
      window.Store.set("settings.font", el.dataset.font);
      applyFont();
      render();
    },
    "font-import"() {
      const picked = window.Api.Native.pickFont ? window.Api.Native.pickFont() : null;
      if (!picked) { toast(S().settings.lang === "ar" ? "اختيار الخط يحتاج ملف .ttf/.otf من الجهاز" : "Font import needs a .ttf/.otf from the device"); return; }
      let meta;
      try { meta = JSON.parse(picked); } catch (e) { meta = null; }
      if (!meta || !meta.file) return;
      const list = S().settings.customFonts || [];
      list.push(meta);
      window.Store.set("settings.customFonts", list);
      window.Store.set("settings.font", meta.file);
      applyFont();
      render();
      toast(t("saved"), "ok");
    },
    "font-delete"(el) {
      const id = el.dataset.font;
      window.Api.Native.deleteFont(id);
      window.Store.set("settings.customFonts", (S().settings.customFonts || []).filter((f) => f.file !== id));
      if (S().settings.font === id) window.Store.set("settings.font", "system");
      applyFont();
      render();
    },

    /* language */
    "set-lang"(el) {
      window.Store.set("settings.lang", el.dataset.lang);
      applyTheme();
      render();
      toast(t("saved"), "ok");
    },

    /* providers */
    "toggle-provider"(el) {
      const p = S().settings.providers.find((x) => x.id === el.dataset.id);
      if (!p) return;
      p.enabled = !p.enabled;
      window.Store.persist();
      render();
    },
    "provider-use"(el) {
      window.Store.set("settings.activeProviderId", el.dataset.id);
      render();
      toast(t("saved"), "ok");
    },
    async "provider-test"(el) {
      const p = S().settings.providers.find((x) => x.id === el.dataset.id);
      if (!p) return;
      toast(t("testing"));
      const res = await window.Api.testConnection(p);
      p.status = res.ok ? "ok" : "err";
      p.latency = res.ms || 0;
      if (res.ok && res.models && res.models.length) p.models = res.models.slice(0, 60);
      window.Store.persist();
      render();
      toast(res.ok ? t("connection_ok") + (res.ms ? ` (${res.ms} ms)` : "") : t("connection_fail") + " — " + (res.error || ""), res.ok ? "ok" : "err");
    },
    "provider-edit"(el) {
      const p = S().settings.providers.find((x) => x.id === el.dataset.id);
      if (!p) return;
      window.UI.modal(t("edit_provider"), `
        <div class="field"><label>${esc(t("provider"))}</label><input class="input" id="pv-name" value="${esc(p.name)}"></div>
        <div class="field mt-s"><label>${esc(t("base_url"))}</label><input class="input mono" dir="ltr" id="pv-url" value="${esc(p.baseUrl)}"></div>
        <div class="field mt-s"><label>${esc(t("model"))}</label><input class="input mono" dir="ltr" id="pv-model" value="${esc(p.model || "")}" placeholder="auto"></div>
        <div class="field mt-s"><label>${esc(t("api_key"))}</label><input class="input mono" dir="ltr" type="password" id="pv-key" value="${esc(p.apiKey || "")}" placeholder="${esc(t("api_key_ph"))}"></div>`,
        `<button class="btn grow" data-act="modal-close">${esc(t("cancel"))}</button>
         <button class="btn primary grow" id="pv-save">${esc(t("save"))}</button>`, {
        onMount: (root) => {
          root.querySelector("#pv-save").addEventListener("click", () => {
            p.name = root.querySelector("#pv-name").value.trim() || p.name;
            p.baseUrl = window.Api.normalizeBase(root.querySelector("#pv-url").value);
            p.model = root.querySelector("#pv-model").value.trim();
            p.apiKey = root.querySelector("#pv-key").value;
            window.Store.persist();
            window.UI.closeModal();
            render();
            toast(t("saved"), "ok");
          });
        },
      });
    },
    "provider-add"() {
      const id = window.Store.uid("prov");
      S().settings.providers.push({ id, name: t("custom_provider"), baseUrl: "", apiKey: "", model: "", models: [], status: "unknown", enabled: true });
      window.Store.persist();
      render();
      Actions["provider-edit"]({ dataset: { id } });
    },
    "or-preset"(el) {
      const i = document.getElementById("or-url");
      if (i) i.value = el.dataset.url;
    },
    "or-save"() {
      const p = S().settings.providers.find((x) => x.id === "omniroute");
      p.baseUrl = window.Api.normalizeBase((document.getElementById("or-url") || {}).value);
      p.model = (document.getElementById("or-model") || {}).value.trim() || "auto";
      p.apiKey = (document.getElementById("or-key") || {}).value || "";
      p.enabled = true;
      window.Store.set("settings.activeProviderId", "omniroute");
      window.Store.persist();
      render();
      toast(t("saved"), "ok");
    },
    async "or-test"() {
      Actions["or-save"]();
      const p = S().settings.providers.find((x) => x.id === "omniroute");
      toast(t("testing"));
      const res = await window.Api.testConnection(p);
      p.status = res.ok ? "ok" : "err";
      p.latency = res.ms || 0;
      if (res.ok && res.models && res.models.length) p.models = res.models.slice(0, 60);
      window.Store.persist();
      render();
      toast(res.ok ? t("connection_ok") + " (" + res.ms + " ms)" : t("connection_fail") + " — " + (res.error || ""), res.ok ? "ok" : "err");
    },
    "or-set-model"(el) {
      const p = S().settings.providers.find((x) => x.id === "omniroute");
      p.model = el.dataset.model;
      window.Store.persist();
      render();
    },
  };

  /* -------------------------------------------------------------- helpers */
  function autosize(ta) {
    ta.style.height = "auto";
    ta.style.height = Math.min(128, ta.scrollHeight) + "px";
  }

  function applyTheme() {
    const s = S().settings;
    document.body.dataset.theme = s.theme;
    document.body.dir = s.lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = s.lang;
    document.documentElement.style.setProperty("--text-scale", String(s.textScale || 1));
    window.Api.Native.setTextScale(s.textScale || 1);
    window.Api.Native.setLocale(s.lang, s.lang === "ar");
    window.Api.Native.darkStatusBar(["minimal", "light"].indexOf(s.theme) === -1);
    document.body.classList.toggle("latin-font", s.font === "latin");
    applyFont();
  }

  function applyFont() {
    const s = S().settings;
    const styleId = "sokey-custom-font";
    let el = document.getElementById(styleId);
    if (!el) { el = document.createElement("style"); el.id = styleId; document.head.appendChild(el); }
    el.textContent = "";
    if (s.font === "latin") {
      document.documentElement.style.setProperty("--font", "var(--font-en)");
      return;
    }
    if (s.font !== "system") {
      const dir = window.Api.Native.fontDir ? window.Api.Native.fontDir() : "";
      const url = dir ? dir + "/" + s.font : s.font;
      el.textContent = `@font-face{font-family:"SoKeyCustom";src:url("${url}")}` +
        `:root{--font:"SoKeyCustom", var(--font-ar)}`;
    } else {
      document.documentElement.style.setProperty("--font", "var(--font-ar)");
    }
  }

  async function refreshFiles(path) {
    App.files.path = path || "";
    App.files.entries = window.Api.Native.listFiles(App.files.path) || [];
    if (App.router.route === "files") {
      const screen = document.getElementById("screen");
      if (screen) { screen.innerHTML = window.Screens.files(); }
    }
  }

  function runTerminal(cmd) {
    const c = String(cmd || "").trim();
    const inp = document.getElementById("term-input");
    if (inp) inp.value = "";
    if (!c) return;
    App.term.log.push({ kind: "in", text: c });
    if (c === "clear") { App.term.log = []; render(); return; }
    const out = window.Api.Native.exec(c);
    if (out == null) {
      App.term.log.push({ kind: "err", text: S().settings.lang === "ar"
        ? "المحطة الطرفية مقيّدة بمساحة العمل ولا تنفّذ أوامر نظام. اكتب help."
        : "The terminal is workspace-restricted and does not run system commands. Type help." });
    } else {
      String(out).split("\n").forEach((line) => App.term.log.push({ kind: "out", text: line }));
    }
    render();
  }

  /* ----------------------------------------------------------- chat engine */
  function buildSystemPrompt(chat, mode) {
    const s = S().settings;
    const ar = s.lang === "ar";
    const skills = s && S().skills ? S().skills.filter((k) => k.installed).map((k) => k.name).join(", ") : "";
    let p = ar
      ? "أنت So-key Ai، مساعد ومساحة عمل ذكية تعمل داخل تطبيق أندرويد. أجب بالعربية الفصحى المبسّطة وبإيجاز منظّم، واستخدم Markdown عند الحاجة."
      : "You are So-key Ai, an AI workspace assistant running inside an Android app. Answer concisely and use Markdown when helpful.";
    if (skills) p += ar ? `\nالمهارات المتاحة: ${skills}.` : `\nEnabled skills: ${skills}.`;
    if (mode === "workflow") {
      p += ar
        ? "\nأنت الآن في وضع سير العمل: قسّم المهمة إلى خطوات مرقّمة ونفّذ الخطوات المتاحة بالأدوات ثم ألخّص النتيجة."
        : "\nYou are in workflow mode: split the task into numbered steps, use tools where possible, then summarise.";
    }
    return p;
  }

  function apiMessages(chat, mode) {
    const msgs = [{ role: "system", content: buildSystemPrompt(chat, mode) }];
    chat.messages.slice(-24).forEach((m) => {
      if (m.role === "user" || m.role === "assistant") msgs.push({ role: m.role, content: m.content });
    });
    return msgs;
  }

  async function send(preset, silentReload) {
    const c = window.Store.chat();
    if (!c) return;
    if (streamCtl) { toast(t("stop") + "?"); return; }
    const ta = document.getElementById("composer");
    const text = (preset || (ta ? ta.value : "")).trim();
    if (!text) return;
    if (ta && !preset) { ta.value = ""; autosize(ta); }

    window.Store.addMessage(c.id, { role: "user", content: text });
    const mode = App.chatModes[c.id] || "chat";
    render();

    const prov = S().settings.providers.find((p) => p.id === c.providerId && p.enabled)
      || S().settings.providers.find((p) => p.enabled);
    const aiMsg = window.Store.addMessage(c.id, { role: "assistant", content: "", tokens: 0 });
    const holder = () => document.getElementById("b-" + aiMsg.id);

    if (!prov) {
      aiMsg.content = t("provider_missing");
      window.Store.persist();
      render();
      return;
    }
    if (!prov.baseUrl) {
      aiMsg.content = t("need_base_url");
      window.Store.persist();
      render();
      return;
    }

    const controller = new AbortController();
    streamCtl = { chatId: c.id, abort: () => controller.abort(), modes: App.chatModes };
    render();

    let streamed = "";
    let rendered = "";
    let raf = null;
    const flush = () => {
      raf = null;
      const el = holder();
      if (el) { el.innerHTML = window.UI.mdToHtml(streamed) + '<span class="typing"></span>'; el.classList.remove("typing"); const box = document.getElementById("messages"); if (box) box.scrollTop = box.scrollHeight; }
    };
    const onDelta = (d, full) => {
      streamed = full;
      if (!raf) raf = requestAnimationFrame(flush);
    };

    try {
      let round = 0;
      let messages = apiMessages(c, mode);
      const useTools = S().settings.toolsEnabled && mode === "workflow";

      while (round < 4) {
        round++;
        const res = await window.Api.chat({
          provider: prov,
          messages,
          stream: S().settings.streaming,
          tools: useTools ? window.Api.toolSpecs() : null,
          signal: controller.signal,
          onDelta: (d, full) => onDelta(d, full),
        });

        if (res && res.tool_calls && res.tool_calls.length) {
          messages.push({ role: "assistant", content: res.content || "", tool_calls: res.tool_calls });
          const plan = [];
          for (const tc of res.tool_calls) {
            const name = tc.function ? tc.function.name : "tool";
            const args = tc.function ? tc.function.arguments : "";
            const out = await window.Api.runTool(name, args);
            plan.push({ name, args, out: String(out).slice(0, 400) });
            messages.push({ role: "tool", tool_call_id: tc.id || name, content: String(out) });
          }
          streamed += renderPlan(plan);
          flush();
          continue;
        }

        if (!res || !res.content) {
          streamed = streamed || (S().settings.lang === "ar" ? "لم يُرجع المزوّد أي رد." : "The provider returned an empty reply.");
        }
        if (res && res.usage && res.usage.total_tokens) {
          aiMsg.tokens = res.usage.total_tokens;
        }
        break;
      }
      aiMsg.content = streamed;
      if (!aiMsg.tokens) aiMsg.tokens = window.Api.estimateTokens(aiMsg.content);
      window.Store.addUsage(aiMsg.tokens);
      App.native.addUsage(aiMsg.tokens);
      const agent = S().agents.find((a) => a.enabled);
      if (agent) agent.tokens += aiMsg.tokens;
      window.Store.logActivity((S().settings.lang === "ar" ? "محادثة: " : "Chat: ") + c.title, "✦", "#f97316");
      prov.status = "ok";
      window.Store.persist();
    } catch (e) {
      const aborted = e && (e.name === "AbortError" || controller.signal.aborted);
      if (aborted) {
        aiMsg.content = streamed + "\n\n_" + t("cancelled") + "_";
      } else {
        const msg = String((e && e.message) || e);
        const hint = S().settings.lang === "ar"
          ? `\n\n**تعذّر الوصول إلى المزوّد** (${esc(prov.name)}).\n\n- تحقّق من العنوان: \`${esc(prov.baseUrl)}\`\n- شغّل OmniRoute أو صحّح العنوان من الإعدادات.\n- تفاصيل: ${esc(msg.slice(0, 220))}`
          : `\n\n**Provider request failed** (${esc(prov.name)}).\n\n- Check the URL: \`${esc(prov.baseUrl)}\`\n- Start OmniRoute or fix the URL in settings.\n- Detail: ${esc(msg.slice(0, 220))}`;
        aiMsg.content = (streamed || "") + hint;
        prov.status = "err";
        window.Store.persist();
      }
    } finally {
      streamCtl = null;
      const el = holder();
      if (el) el.classList.remove("typing");
      render();
      if (!silentReload) { /* keep scroll */ }
    }
  }

  function renderPlan(steps) {
    const ar = S().settings.lang === "ar";
    let html = `\n\n<div class="plan"><div class="bold small" style="margin-bottom:6px">${ar ? "خطوات التنفيذ" : "Execution steps"}</div>`;
    steps.forEach((s, i) => {
      html += `<div class="p-step"><span>${i + 1}. ${esc(s.name)}</span><span class="st">✓</span></div>`;
      html += `<div class="xsmall faint mono" style="direction:ltr;text-align:left;overflow-wrap:anywhere">${esc(s.out.slice(0, 160))}</div>`;
    });
    html += "</div>\n\n";
    return html;
  }

  /* ------------------------------------------------------------ native API */
  App.native = window.Api.Native;

  /* -------------------------------------------------------------- listeners */
  document.addEventListener("click", (ev) => {
    const el = ev.target.closest("[data-act]");
    if (!el) return;
    const act = el.dataset.act;
    if (act === "modal-close-bg") { if (ev.target === el) window.UI.closeModal(); return; }
    const fn = Actions[act];
    if (fn) { ev.preventDefault(); fn(el, ev); }
  });

  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape") window.UI.closeModal();
    const isComposer = ev.target && ev.target.id === "composer";
    if (isComposer && ev.key === "Enter" && !ev.shiftKey) { ev.preventDefault(); send(); }
    if (ev.target && ev.target.id === "term-input" && ev.key === "Enter") { ev.preventDefault(); runTerminal(ev.target.value); }
    if (ev.target && ev.target.id === "global-search" && ev.key === "Enter") {
      App.router.params.q = ev.target.value; render();
    }
    if (ev.target && ev.target.id === "skill-search") {
      App.router.params.q = ev.target.value; render();
      const el = document.getElementById("skill-search");
      if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); }
    }
    if (ev.target && ev.target.id === "chat-filter") {
      const q = ev.target.value.toLowerCase();
      document.querySelectorAll("#chat-list .list-item").forEach((it) => {
        it.style.display = (it.textContent || "").toLowerCase().includes(q) ? "" : "none";
      });
    }
  });

  document.addEventListener("input", (ev) => {
    const el = ev.target;
    if (el.id === "composer") autosize(el);
    if (el.id === "global-search") {
      clearTimeout(App.searchTimer);
      App.searchTimer = setTimeout(() => { App.router.params.q = el.value; render(); const e2 = document.getElementById("global-search"); if (e2) { e2.focus(); e2.setSelectionRange(e2.value.length, e2.value.length); } }, 220);
    }
  });

  document.addEventListener("change", (ev) => {
    const el = ev.target;
    if (el.id === "or-url") Actions["or-save"]();
    if (el.id === "or-model") Actions["or-save"]();
    if (el.id === "or-key") Actions["or-save"]();
  });

  /* Android hardware back */
  window.__sokeyBack = function () {
    if (document.querySelector(".sheet-scrim")) { window.UI.closeModal(); return true; }
    if (document.body.classList.contains("drawer")) { document.body.classList.remove("drawer"); return true; }
    if (App.router.route !== "home") { go("home"); return true; }
    return false;
  };
  window.__sokeyInsets = function (top, bottom) {
    document.documentElement.style.setProperty("--inset-top", top + "px");
    document.documentElement.style.setProperty("--inset-bottom", bottom + "px");
  };
  window.__sokeyResume = function () { if (App.router.route !== "chat") render(); };

  /* ------------------------------------------------------------------- boot */
  function boot() {
    document.body.dir = S().settings.lang === "ar" ? "rtl" : "ltr";
    applyTheme();
    render();
    window.__sokeyInsets(App.native.info().insetTop || 0, App.native.info().insetBottom || 0);
    // hydrate custom fonts list from the native sandbox (survives reinstall of UI state)
    const nativeFonts = App.native.fontList ? App.native.fontList() : [];
    if (nativeFonts && nativeFonts.length) {
      const known = S().settings.customFonts || [];
      nativeFonts.forEach((f) => { if (!known.some((k) => k.file === f.file)) known.push(f); });
      window.Store.set("settings.customFonts", known);
    }
    setTimeout(() => {
      const p = S().settings.providers[0];
      if (p && p.baseUrl) window.Api.testConnection(p).then((res) => {
        p.status = res.ok ? "ok" : "err";
        p.latency = res.ms || 0;
        if (res.ok && res.models && res.models.length) p.models = res.models.slice(0, 60);
        window.Store.persist();
        if (App.router.route === "home" || App.router.route === "providers") render();
      }).catch(() => {});
    }, 900);
  }

  App.go = go;
  App.render = render;
  App.send = send;
  App.applyTheme = applyTheme;
  App.actions = Actions;
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
