/* ==========================================================================
   So-key Ai — screens: skills, plugins, tools, terminal, files, git,
   automation, usage, reports, mcp, browser, help, search
   ========================================================================== */
(function () {
  "use strict";
  const I = () => window.UI.icon;
  const esc = (s) => window.UI.esc(s);
  const nfmt = (n) => window.UI.nfmt(n);
  const ar = () => window.Store.state.settings.lang === "ar";

  /* ============================================================= skills */
  function skills() {
    const s = window.Store.state;
    const tab = window.App.router.params.tab || "installed";
    const q = (window.App.router.params.q || "").toLowerCase();
    const match = (x) => !q || (x.name + x.nameAr).toLowerCase().includes(q);
    const pinned = s.skills.filter((k) => (k.default || k.installed) && match(k));
    const recommended = s.skills.filter((k) => !k.installed && !k.default && match(k));
    const all = s.skills.filter(match);

    const rows = (items, withToggle) => items.map((k) => `
      <div class="list-item">
        <span class="li-ico" style="font-size:17px">${esc(k.glyph)}</span>
        <div class="grow">
          <div class="li-ttl">${esc(ar() ? k.nameAr : k.name)}</div>
          <div class="li-sub nowrap">${esc(k.id)}</div>
        </div>
        <div class="li-end">
          ${withToggle
            ? `<button class="switch ${k.installed ? "on" : ""}" data-act="toggle-skill" data-id="${k.id}"></button>`
            : `<button class="btn sm primary" data-act="install-skill" data-id="${k.id}">${esc(t("install"))}</button>`}
        </div>
      </div>`).join("");

    return `
    <div class="fade-in">
      <div class="row-between">
        <div><div class="bold" style="font-size:var(--fs-lg)">${esc(t("skills"))}</div>
          <div class="xsmall muted">${esc(t("add_skill"))}</div></div>
        <button class="icon-btn accent" data-act="add-skill">${I()("plus")}</button>
      </div>
      <div class="seg mt" id="skills-tabs">
        <button class="${tab === "all" ? "active" : ""}" data-act="skills-tab" data-tab="all">${esc(t("skills_all"))}</button>
        <button class="${tab === "pinned" ? "active" : ""}" data-act="skills-tab" data-tab="pinned">${esc(t("skills_pinned"))}</button>
        <button class="${tab === "recommended" ? "active" : ""}" data-act="skills-tab" data-tab="recommended">${esc(t("skills_recommended"))}</button>
      </div>
      <div class="search mt"><span>${I()("search")}</span>
        <input id="skill-search" placeholder="${esc(t("search_skills"))}" data-act="skill-filter" value="${esc(window.App.router.params.q || "")}"></div>

      ${tab === "all" ? `<div class="section-title"><span>${esc(t("skills_all"))} (${all.length})</span></div>
        <div class="list">${rows(all, true) || emptyRow()}</div>` : ""}

      ${tab === "pinned" || tab === "installed" ? `
        <div class="section-title"><span>${esc(t("skills_pinned"))} (${pinned.length})</span>
          <span class="hint" data-act="skills-tab" data-tab="all">${esc(t("skills_all"))}</span></div>
        <div class="list">${rows(pinned, true) || emptyRow()}</div>` : ""}

      ${tab === "recommended" ? `
        <div class="section-title"><span>${esc(t("skills_recommended"))} (${recommended.length})</span></div>
        <div class="list">${rows(recommended, false) || emptyRow()}</div>` : ""}
    </div>`;
  }

  function emptyRow() {
    return `<div class="empty small">${esc(t("nothing_here"))}</div>`;
  }

  /* ============================================================ plugins */
  function plugins() {
    const s = window.Store.state;
    return `
    <div class="fade-in">
      <div class="bold" style="font-size:var(--fs-lg)">${esc(t("plugins"))}</div>
      <div class="xsmall muted">${esc(t("deps_note"))}</div>
      <div class="list mt">
        ${s.plugins.map((p) => `
          <div class="list-item">
            <span class="li-ico" style="color:var(--cyan)">${I()("plug")}</span>
            <div class="grow"><div class="li-ttl">${esc(p.name)}</div>
              <div class="li-sub">${esc(p.sub)}</div></div>
            <button class="switch ${p.enabled ? "on" : ""}" data-act="toggle-plugin" data-id="${p.id}"></button>
          </div>`).join("")}
      </div>
      <div class="card mt">
        <div class="card-title">${esc(t("mcp"))}</div>
        <div class="small muted mt-s">${esc(t("mcp_hint"))}</div>
        <button class="btn block mt" data-act="nav" data-nav="mcp">${I()("server")} ${esc(t("mcp"))}</button>
      </div>
    </div>`;
  }

  /* ============================================================== tools */
  function tools() {
    const list = [
      { nav: "terminal", icon: "terminal", title: t("terminal"), sub: t("terminal_hint"), color: "#22c55e" },
      { nav: "files", icon: "files", title: t("files"), sub: t("files_hint"), color: "#3b82f6" },
      { nav: "browser", icon: "globe", title: t("browser"), sub: t("browser_ph"), color: "#a855f7" },
      { nav: "git", icon: "git", title: t("git"), sub: t("git_hint"), color: "#f97316" },
      { nav: "automation", icon: "clock", title: t("automation"), sub: t("automation_hint"), color: "#f59e0b" },
      { nav: "mcp", icon: "server", title: t("mcp"), sub: t("mcp_hint"), color: "#22d3ee" },
      { nav: "reports", icon: "report", title: t("reports"), sub: t("reports_hint"), color: "#ec4899" },
      { nav: "tools", icon: "alert", title: t("apk_install"), sub: t("apk_hint"), color: "#ef4444", act: "pick-apk" },
    ];
    return `
    <div class="fade-in">
      <div class="bold" style="font-size:var(--fs-lg)">${esc(t("tools"))}</div>
      <div class="xsmall muted">${esc(t("tools_hint"))}</div>
      <div class="grid grid-2 mt" style="gap:10px">
        ${list.map((tl) => `
          <button class="card tight" style="text-align:start" data-act="${tl.act || "nav"}" ${tl.act ? "" : `data-nav="${tl.nav}"`}>
            <div class="row">
              <span class="li-ico" style="background:${tl.color}22;border-color:${tl.color}44;color:${tl.color}">${I()(tl.icon)}</span>
              <div class="grow"><div class="bold small">${esc(tl.title)}</div>
                <div class="xsmall muted nowrap">${esc(tl.sub)}</div></div>
            </div>
          </button>`).join("")}
      </div>
      <div class="section-title"><span>${esc(t("plugins_label"))}</span>
        <span class="hint" data-act="nav" data-nav="plugins">${esc(t("view_all"))}</span></div>
      <div class="list">
        ${window.Store.state.plugins.map((p) => `
          <div class="list-item"><span class="li-ico">${I()("plug")}</span>
            <div class="grow"><div class="li-ttl small">${esc(p.name)}</div>
              <div class="li-sub">${esc(p.enabled ? t("active") : t("inactive"))}</div></div>
            <span class="dot ${p.enabled ? "" : "off"}"></span></div>`).join("")}
      </div>
    </div>`;
  }

  /* =========================================================== terminal */
  function terminal() {
    const log = window.App.term.log || [];
    return `
    <div class="fade-in">
      <div class="row-between">
        <div><div class="bold" style="font-size:var(--fs-lg)">${esc(t("terminal"))}</div>
          <div class="xsmall muted">${esc(t("terminal_hint"))}</div></div>
        <button class="icon-btn" data-act="term-clear">${I()("trash")}</button>
      </div>
      <div class="term mt" id="term-log">${log.length ? log.map(termLine).join("") :
        `<div class="t-dim">So-key Ai terminal — ${esc(t("terminal_hint"))}</div><div class="t-dim">$ help</div>`}</div>
      <div class="term-input">
        <span class="prompt">$</span>
        <input id="term-input" dir="ltr" placeholder="${esc(t("terminal_ph"))}" autocomplete="off" spellcheck="false">
        <button class="icon-btn accent" data-act="term-run">${I()("play")}</button>
      </div>
      <div class="chips mt">
        ${["help", "ls", "pwd", "date", "env", "clear"].map((c) => `<button class="chip" data-act="term-insert" data-cmd="${c}">${c}</button>`).join("")}
      </div>
    </div>`;
  }

  function termLine(l) {
    const cls = l.kind === "in" ? "t-in" : l.kind === "err" ? "t-err" : l.kind === "dim" ? "t-dim" : "t-out";
    const prefix = l.kind === "in" ? "$ " : "";
    return `<div class="${cls}">${esc(prefix + l.text)}</div>`;
  }

  /* ============================================================== files */
  function files() {
    const path = window.App.files.path || "";
    const entries = window.App.files.entries || [];
    const parts = path ? path.split("/").filter(Boolean) : [];
    return `
    <div class="fade-in">
      <div class="row-between">
        <div><div class="bold" style="font-size:var(--fs-lg)">${esc(t("files"))}</div>
          <div class="xsmall muted nowrap">${esc(window.Api.Native.workspaceDir() || t("files_hint"))}</div></div>
        <button class="icon-btn" data-act="files-refresh">${I()("refresh")}</button>
      </div>
      <div class="row mt-s" style="gap:6px;flex-wrap:wrap">
        <button class="chip" data-act="files-cd" data-path="">${I()("home")} root</button>
        ${parts.map((p, i) => `<button class="chip" data-act="files-cd" data-path="${esc(parts.slice(0, i + 1).join("/"))}">${esc(p)}</button>`).join("")}
      </div>
      <div class="btn-row mt">
        <button class="btn sm grow" data-act="files-mkdir">${I()("folder")} ${esc(t("new_folder"))}</button>
        <button class="btn sm grow" data-act="files-import">${I()("upload")} ${esc(t("import_file"))}</button>
      </div>
      <div class="list mt">
        ${path ? `<div class="list-item" data-act="files-cd" data-path="${esc(parts.slice(0, -1).join("/"))}">
          <span class="li-ico">${I()("back")}</span><div class="grow"><div class="li-ttl">${esc(t("parent"))}</div></div></div>` : ""}
        ${entries.length ? entries.map((e) => `
          <div class="list-item">
            <span class="li-ico" style="color:${e.dir ? "var(--amber)" : "var(--cyan)"}">${I()(e.dir ? "folder" : "file")}</span>
            <div class="grow" ${e.dir ? `data-act="files-cd" data-path="${esc((path ? path + "/" : "") + e.name)}"` : `data-act="file-open" data-path="${esc((path ? path + "/" : "") + e.name)}"`}>
              <div class="li-ttl nowrap">${esc(e.name)}</div>
              <div class="li-sub">${e.dir ? "" : nfmt(e.size || 0) + " B · " + esc(window.UI.timeAgo(e.ts))}</div>
            </div>
            <div class="li-end">
              ${e.dir ? "" : `<button class="icon-btn ghost" data-act="file-share" data-path="${esc((path ? path + "/" : "") + e.name)}">${I()("share")}</button>`}
              <button class="icon-btn ghost" data-act="file-delete" data-path="${esc((path ? path + "/" : "") + e.name)}">${I()("trash")}</button>
            </div>
          </div>`).join("") : emptyRow()}
      </div>
    </div>`;
  }

  /* ================================================================ git */
  function git() {
    const st = window.Store.state.settings;
    const repos = window.App.git.repos || [];
    const err = window.App.git.error;
    return `
    <div class="fade-in">
      <div class="bold" style="font-size:var(--fs-lg)">${esc(t("git"))}</div>
      <div class="xsmall muted">${esc(t("git_hint"))}</div>

      <div class="card mt">
        <div class="field"><label>${esc(t("github_user"))}</label>
          <input class="input" id="gh-user" value="${esc(st.githubUser || "")}" placeholder="ahmedsykoo"></div>
        <div class="field mt-s"><label>${esc(t("github_token"))}</label>
          <input class="input" id="gh-token" type="password" value="${esc(st.githubToken || "")}" placeholder="ghp_…"></div>
        <div class="btn-row mt">
          <button class="btn primary grow" data-act="gh-save">${I()("check")} ${esc(t("save"))}</button>
          <button class="btn grow" data-act="gh-repos">${I()("refresh")} ${esc(t("load_repos"))}</button>
        </div>
        ${err ? `<div class="small" style="color:var(--red);margin-top:8px">${esc(err)}</div>` : ""}
      </div>

      <div class="section-title"><span>${esc(t("repos"))} (${repos.length})</span></div>
      <div class="list">
        ${repos.length ? repos.map((r) => `
          <div class="list-item">
            <span class="li-ico" style="color:var(--accent-2)">${I()("git")}</span>
            <div class="grow"><div class="li-ttl nowrap">${esc(r.full_name || r.name)}</div>
              <div class="li-sub nowrap">${esc(r.description || "")} · ${r.private ? "private" : "public"}</div></div>
            <div class="li-end"><span class="badge">${nfmt(r.stargazers_count || 0)} ★</span>
              <button class="icon-btn ghost" data-act="open-link" data-url="${esc(r.html_url)}">${I()("external")}</button></div>
          </div>`).join("") : emptyRow()}
      </div>

      <div class="card mt">
        <div class="card-title">${esc(t("terminal"))}</div>
        <div class="small muted mt-s">${esc(ar() ? "مهام Git المحلية داخل مساحة العمل:" : "Local Git tasks inside the workspace:")}</div>
        <div class="chips mt">
          ${["git init", "git status", "git log --oneline -5", "git add -A"].map((c) =>
            `<button class="chip" data-act="git-cmd" data-cmd="${esc(c)}">${esc(c)}</button>`).join("")}
        </div>
        <pre class="term mt-s" id="git-out" style="min-height:80px;max-height:220px">${esc(window.App.git.out || "")}</pre>
      </div>
    </div>`;
  }

  /* ========================================================= automation */
  function automation() {
    const s = window.Store.state;
    const running = window.App.auto.running;
    return `
    <div class="fade-in">
      <div class="row-between">
        <div><div class="bold" style="font-size:var(--fs-lg)">${esc(t("automation"))}</div>
          <div class="xsmall muted">${esc(t("automation_hint"))}</div></div>
        <button class="icon-btn accent" data-act="wf-new">${I()("plus")}</button>
      </div>
      <div class="list mt">
        ${s.workflows.map((w) => `
          <div class="card">
            <div class="row-between">
              <div class="row"><span class="li-ico" style="color:var(--amber)">${I()("bolt")}</span>
                <div><div class="bold small">${esc(w.name)}</div>
                  <div class="xsmall muted">${w.steps} ${esc(t("steps"))} · ${esc(t("last_run"))}: ${esc(w.lastRun ? window.UI.timeAgo(w.lastRun) : "—")}</div></div>
              </div>
              <button class="switch ${w.enabled ? "on" : ""}" data-act="wf-toggle" data-id="${w.id}"></button>
            </div>
            <div class="col mt-s" style="gap:6px">
              ${(w.script || []).map((st, i) => `<div class="row small" style="gap:8px">
                <span class="badge">${i + 1}</span>
                <span class="muted nowrap">${esc(st.label || st.text || st.path || st.url || st.type)}</span>
                <span class="grow"></span>
                <span class="dot ${window.App.auto.done[w.id] && window.App.auto.done[w.id] > i ? "" : "off"}"></span></div>`).join("")}
            </div>
            <button class="btn sm block mt-s" data-act="wf-run" data-id="${w.id}" ${running ? "disabled" : ""}>
              ${running ? `<span class="spinner"></span>` : I()("play")} ${esc(t("run_workflow"))}</button>
          </div>`).join("")}
      </div>
      <div class="card mt"><div class="small muted">${esc(t("simulate_note"))}</div></div>
    </div>`;
  }

  /* ============================================================== usage */
  function usage() {
    const range = window.App.usage.range || "week";
    const s = window.Store.state;
    const used = window.Api.Native.usageToday();
    const limit = window.Api.Native.tokenLimit();
    const series = window.Store.weekSeries();
    const maxTok = Math.max(1, ...series.map((d) => d.tokens));
    const agentsTotal = s.agents.reduce((n, a) => n + a.tokens, 0) || 1;
    return `
    <div class="fade-in">
      <div class="row-between">
        <div class="bold" style="font-size:var(--fs-lg)">${esc(t("usage"))}</div>
        <div class="seg">
          ${[["day", t("day")], ["week", t("week")], ["month", t("month")]].map(([id, label]) =>
            `<button class="${range === id ? "active" : ""}" data-act="usage-range" data-range="${id}">${esc(label)}</button>`).join("")}
        </div>
      </div>

      <div class="card mt row" style="gap:14px">
        ${window.UI.ring(Math.min(100, (used / Math.max(1, limit)) * 100), t("day"), null, 100)}
        <div class="grow">
          <div class="bold" style="font-size:var(--fs-xl)">${nfmt(used)}</div>
          <div class="small muted">${esc(t("used_today"))}</div>
          <div class="divider"></div>
          <div class="row-between small"><span class="muted">${esc(t("avg_daily"))}</span>
            <span class="bold">${nfmt(series.reduce((n, d) => n + d.tokens, 0) / 7)}</span></div>
        </div>
      </div>

      <div class="grid grid-2 mt" style="gap:10px">
        <div class="card stat-card"><span class="v">${s.chats.length}</span><span class="k">${esc(t("chats_label"))}</span></div>
        <div class="card stat-card"><span class="v">${nfmt(agentsTotal)}</span><span class="k">tokens</span></div>
      </div>

      <div class="card mt" style="padding:12px 10px 6px">
        <div class="small muted" style="padding:0 6px 6px">${esc(t("usage_chart"))}</div>
        <svg class="chart" viewBox="0 0 300 110" preserveAspectRatio="none">
          ${series.map((d, i) => {
            const h = Math.round((d.tokens / maxTok) * 74) + 4;
            return `<rect x="${8 + i * 41}" y="${96 - h}" width="22" height="${h}" rx="6" fill="${i === 6 ? "#f97316" : "#2a2a38"}"/>`;
          }).join("")}
        </svg>
      </div>

      <div class="section-title"><span>${esc(t("my_agents"))}</span></div>
      <div class="card">
        ${s.agents.map((a) => `<div class="usage-row">
          <span class="u-name">${esc(a.name)}</span>
          <div class="bar grow"><i style="width:${Math.round((a.tokens / agentsTotal) * 100)}%;background:${a.color}"></i></div>
          <span class="u-val">${nfmt(a.tokens)}</span></div>`).join("")}
      </div>

      <div class="section-title"><span>${esc(t("providers"))}</span>
        <span class="hint" data-act="nav" data-nav="providers">${esc(t("settings"))}</span></div>
      <div class="card">
        ${s.settings.providers.filter((p) => p.enabled).map((p) => `<div class="kv">
          <span class="k">${esc(p.name)}</span>
          <span class="v">${esc(p.model || "—")} <span class="dot ${p.status === "ok" ? "" : "off"}" style="display:inline-block"></span></span>
        </div>`).join("") || `<div class="small muted">${esc(t("provider_missing"))}</div>`}
      </div>
    </div>`;
  }

  /* ============================================================ reports */
  function reports() {
    const s = window.Store.state;
    return `
    <div class="fade-in">
      <div class="bold" style="font-size:var(--fs-lg)">${esc(t("reports"))}</div>
      <div class="xsmall muted">${esc(t("reports_hint"))}</div>
      <div class="grid grid-2 mt" style="gap:10px">
        <button class="card tight" style="text-align:start" data-act="report-usage">
          <div class="row"><span class="li-ico" style="color:var(--accent-2)">${I()("chart")}</span>
            <div><div class="bold small">${esc(t("report_usage"))}</div>
              <div class="xsmall muted">7d</div></div></div></button>
        <button class="card tight" style="text-align:start" data-act="report-chats">
          <div class="row"><span class="li-ico" style="color:var(--violet)">${I()("chat")}</span>
            <div><div class="bold small">${esc(t("report_from_chat"))}</div>
              <div class="xsmall muted">${s.chats.length} ${esc(t("chats_label"))}</div></div></div></button>
      </div>
      <div class="card mt"><div class="small muted">${esc(t("report_saved"))}: <span class="mono">exports/</span></div></div>
      <div class="section-title"><span>${esc(t("recent_activity"))}</span></div>
      <div class="list">
        ${(s.activity.length ? s.activity : []).map((a) => `<div class="list-item">
          <span class="li-ico" style="color:${a.color}">${esc(a.glyph)}</span>
          <div class="grow"><div class="li-ttl small">${esc(a.text)}</div>
            <div class="li-sub">${esc(window.UI.timeAgo(a.ts))}</div></div></div>`).join("") || emptyRow()}
      </div>
    </div>`;
  }

  /* ================================================================ mcp */
  function mcp() {
    const s = window.Store.state;
    return `
    <div class="fade-in">
      <div class="row-between">
        <div><div class="bold" style="font-size:var(--fs-lg)">${esc(t("mcp"))}</div>
          <div class="xsmall muted">${esc(t("mcp_hint"))}</div></div>
        <button class="icon-btn accent" data-act="mcp-add">${I()("plus")}</button>
      </div>
      <div class="list mt">
        ${s.mcp.map((m) => `
          <div class="list-item">
            <span class="li-ico" style="color:var(--cyan)">${I()("server")}</span>
            <div class="grow"><div class="li-ttl">${esc(m.name)}</div>
              <div class="li-sub mono" style="direction:ltr;text-align:left">${esc(m.transport)} · ${esc(m.endpoint)}</div></div>
            <button class="switch ${m.enabled ? "on" : ""}" data-act="toggle-mcp" data-id="${m.id}"></button>
          </div>`).join("")}
      </div>
      <div class="card mt"><div class="small muted">${esc(t("deps_note"))}</div></div>
    </div>`;
  }

  /* ============================================================ browser */
  function browser() {
    const last = window.App.browser.last || "https://github.com/ahmedsykoo/So-key-ai";
    return `
    <div class="fade-in">
      <div class="bold" style="font-size:var(--fs-lg)">${esc(t("browser"))}</div>
      <div class="xsmall muted">${esc(t("omniroute_hint"))}</div>
      <div class="search mt">${I()("globe")}
        <input id="browser-url" dir="ltr" value="${esc(last)}" placeholder="${esc(t("browser_ph"))}"></div>
      <div class="btn-row mt">
        <button class="btn primary grow" data-act="browser-open">${I()("external")} ${esc(t("open"))}</button>
        <button class="btn grow" data-act="browser-frame">${I()("globe")} ${esc(ar() ? "داخل التطبيق" : "In-app")}</button>
      </div>
      <div class="card mt">
        <div class="card-title">${esc(t("quick_actions"))}</div>
        <div class="col mt-s" style="gap:8px">
          ${[["OmniRoute", "http://127.0.0.1:20128"], ["GitHub", "https://github.com/ahmedsykoo/So-key-ai"],
             ["OpenAI docs", "https://platform.openai.com/docs"]].map(([label, url]) =>
            `<button class="btn ghost-lg block" data-act="browser-open" data-url="${esc(url)}">${esc(label)} <span class="mono xsmall muted">${esc(url)}</span></button>`).join("")}
        </div>
      </div>
    </div>`;
  }

  /* =============================================================== help */
  function help() {
    const faq = ar() ? [
      ["كيف أربط OmniRoute؟", "الإعدادات ← مزوّدو الذكاء الاصطناعي ← OmniRoute، عدّل العنوان إلى http://127.0.0.1:20128 عند تشغيل OmniRoute على نفس الجهاز، أو إلى IP الجهاز في الشبكة."],
      ["كيف أضيف خطًا عربيًا؟", "المظهر ← الخطوط ← استيراد خط، واختر ملف .ttf أو .otf. يُنسخ الخط داخل مساحة التطبيق ويُطبّق فورًا."],
      ["هل تعمل الأوامر على النظام؟", "لا. المحطة الطرفية مقيّدة بمساحة عمل التطبيق ولا تنفّذ أوامر نظام حقيقية."],
      ["أين تُحفظ الملفات؟", "داخل مجلد التطبيق الخاص (workspace). يمكنك مشاركتها عبر زر المشاركة."],
    ] : [
      ["How do I connect OmniRoute?", "Settings → AI providers → OmniRoute, set the URL to http://127.0.0.1:20128 when OmniRoute runs on this device, or to your LAN IP."],
      ["How do I add an Arabic font?", "Appearance → Fonts → Import font — pick a .ttf or .otf. It is copied into the app sandbox and applied instantly."],
      ["Does the terminal run system commands?", "No. It is restricted to the app workspace and never touches the system shell."],
      ["Where are my files stored?", "Inside the app's private workspace folder; share them with the share action."],
    ];
    return `
    <div class="fade-in">
      <div class="bold" style="font-size:var(--fs-lg)">${esc(t("help"))}</div>
      <div class="xsmall muted">${esc(t("help_hint"))}</div>
      <div class="col mt" style="gap:10px">
        ${faq.map(([q, a]) => `<details class="card">
          <summary class="bold small" style="cursor:pointer">${esc(q)}</summary>
          <div class="small muted mt-s">${esc(a)}</div></details>`).join("")}
      </div>
      <div class="card mt">
        <div class="card-title">${esc(t("shortcuts"))}</div>
        <div class="kv"><span class="k">Ctrl/⌘ + K</span><span class="v">${esc(t("search_all"))}</span></div>
        <div class="kv"><span class="k">Esc</span><span class="v">${esc(t("close"))}</span></div>
        <div class="kv"><span class="k">Enter</span><span class="v">${esc(t("send"))}</span></div>
      </div>
      <div class="btn-row mt">
        <button class="btn grow" data-act="open-link" data-url="https://github.com/ahmedsykoo/So-key-ai">${I()("git")} GitHub</button>
        <button class="btn grow" data-act="nav" data-nav="about">${I()("info")} ${esc(t("about"))}</button>
      </div>
    </div>`;
  }

  /* ============================================================= search */
  function search() {
    const q = (window.App.router.params.q || "").toLowerCase();
    const s = window.Store.state;
    const results = [];
    if (q) {
      s.chats.forEach((c) => {
        if ((c.title + c.messages.map((m) => m.content).join(" ")).toLowerCase().includes(q))
          results.push({ icon: "chat", title: c.title, sub: t("chats"), act: "open-chat", id: c.id });
      });
      s.projects.forEach((p) => {
        if ((p.name + p.sub).toLowerCase().includes(q))
          results.push({ icon: "folder", title: p.name, sub: t("projects"), act: "project-open", id: p.id });
      });
      s.skills.forEach((k) => {
        if ((k.name + k.nameAr).toLowerCase().includes(q))
          results.push({ icon: "sparkles", title: ar() ? k.nameAr : k.name, sub: t("skills"), act: "nav", nav: "skills" });
      });
      s.agents.forEach((a) => {
        if (a.name.toLowerCase().includes(q))
          results.push({ icon: "users", title: a.name, sub: t("agents"), act: "nav", nav: "agents" });
      });
      s.settings.providers.forEach((p) => {
        if ((p.name + p.baseUrl).toLowerCase().includes(q))
          results.push({ icon: "key", title: p.name, sub: t("providers"), act: "nav", nav: "providers" });
      });
    }
    const navTargets = [
      ["home", "home"], ["chats", "chat"], ["projects", "folder"], ["agents", "users"],
      ["skills", "sparkles"], ["tools", "wrench"], ["terminal", "terminal"], ["files", "files"],
      ["usage", "chart"], ["settings", "settings"], ["themes", "palette"], ["providers", "key"],
    ];
    return `
    <div class="fade-in">
      <div class="search">${I()("search")}
        <input id="global-search" placeholder="${esc(t("search_all"))}" value="${esc(window.App.router.params.q || "")}" autofocus></div>
      ${!q ? `<div class="section-title"><span>${esc(t("quick_actions"))}</span></div>
        <div class="grid grid-2" style="gap:10px">
          ${navTargets.map(([navKey, icon]) => `<button class="card tight row" style="text-align:start" data-act="nav" data-nav="${navKey}">
            <span class="li-ico">${I()(icon)}</span><span class="small bold">${esc(t(navKey === "home" ? "home" : navKey))}</span></button>`).join("")}
        </div>` : ""}
      <div class="list mt">
        ${q ? (results.length ? results.map((r) => `
          <div class="list-item" data-act="${r.act}" ${r.id ? `data-id="${r.id}"` : ""} ${r.nav ? `data-nav="${r.nav}"` : ""}>
            <span class="li-ico">${I()(r.icon)}</span>
            <div class="grow"><div class="li-ttl nowrap">${esc(r.title)}</div>
              <div class="li-sub">${esc(r.sub)}</div></div>
            <span class="li-end faint">${I()("chevron")}</span>
          </div>`).join("") : emptyRow()) : ""}
      </div>
    </div>`;
  }

  window.Screens2 = { skills, plugins, tools, terminal, files, git, automation, usage, reports, mcp, browser, help, search, termLine };
  Object.assign(window.Screens, window.Screens2);
})();
