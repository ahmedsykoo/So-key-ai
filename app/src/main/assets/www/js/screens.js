/* ==========================================================================
   So-key Ai — screens: home, chats, chat, projects, agents
   ========================================================================== */
(function () {
  "use strict";
  const I = () => window.UI.icon;
  const esc = (s) => window.UI.esc(s);
  const nfmt = (n) => window.UI.nfmt(n);

  const tiles = [
    { nav: "projects", icon: "folder", key: "projects", color: "#3b82f6", sub: "projects_hint" },
    { nav: "skills", icon: "sparkles", key: "skills", color: "#a855f7", sub: "skills_pinned" },
    { nav: "plugins", icon: "plug", key: "plugins", color: "#22d3ee", sub: "tools_hint" },
    { nav: "agents", icon: "users", key: "agents", color: "#f97316", sub: "all_agents" },
  ];

  /* =============================================================== home */
  function home() {
    const s = window.Store.state;
    const settings = s.settings;
    const used = window.Api.Native.usageToday();
    const limit = window.Api.Native.tokenLimit();
    const pct = limit ? Math.min(100, (used / limit) * 100) : 0;
    const hour = new Date().getHours();
    const agents = s.agents.slice(0, 6);
    const series = window.Store.weekSeries();
    const maxTok = Math.max(1, ...series.map((d) => d.tokens));

    return `
    <div class="fade-in">
      <div class="row" style="gap:12px">
        <div class="avatar lg" data-act="nav" data-nav="settings">${I()("users")}</div>
        <div class="grow">
          <div class="bold" style="font-size:var(--fs-md)">${esc(t("welcome"))} ${settings.lang === "ar" ? "أحمد" : "Ahmed"}</div>
          <div class="small muted">${esc(t(hour < 12 ? "greeting_morning" : "greeting_evening"))} · ${esc(t("ready_today"))}</div>
        </div>
        <button class="icon-btn" data-act="nav" data-nav="search">${I()("search")}</button>
        <button class="icon-btn" data-act="toggle-theme-quick">${I()(settings.theme === "light" || settings.theme === "minimal" ? "moon" : "sun")}</button>
      </div>

      <div class="row-between mt-l">
        <div>
          <div style="font-size:var(--fs-2xl);font-weight:800;letter-spacing:-.5px">AI Workspace</div>
          <div class="small muted">${esc(t("app_tag"))}</div>
        </div>
        <button class="btn primary" data-act="new-chat">${I()("plus")}<span>${esc(t("new_chat").replace("+ ", ""))}</span></button>
      </div>

      <div class="grid grid-2 mt" style="gap:10px">
        ${tiles.map((tl) => `
          <button class="card tight" style="text-align:start" data-act="nav" data-nav="${tl.nav}">
            <div class="row">
              <span class="li-ico" style="width:44px;height:44px;background:${tl.color}22;border-color:${tl.color}44">
                <span style="color:${tl.color}">${I()(tl.icon)}</span></span>
              <div class="grow">
                <div class="bold">${esc(t(tl.key))}</div>
                <div class="xsmall muted nowrap">${esc(t(tl.sub))}</div>
              </div>
            </div>
          </button>`).join("")}
      </div>

      <div class="section-title"><span>${esc(t("today_usage"))}</span>
        <span class="hint" data-act="nav" data-nav="usage">${esc(t("details"))}</span></div>
      <div class="card row" style="gap:14px">
        ${window.UI.ring(pct, t("token_estimate"), null, 96)}
        <div class="grow">
          <div class="bold" style="font-size:var(--fs-lg)">${nfmt(used)} / ${nfmt(limit)}</div>
          <div class="small muted">${esc(t("used_today"))}</div>
          <div class="divider"></div>
          <div class="row-between small">
            <span class="muted">${esc(t("chats_label"))}</span><span class="bold">${s.chats.length}</span>
          </div>
          <div class="row-between small mt-s">
            <span class="muted">${esc(t("agents"))}</span><span class="bold">${s.agents.filter(a => a.enabled).length}/${s.agents.length}</span>
          </div>
        </div>
      </div>

      <div class="card mt" style="padding:12px 10px 6px">
        <div class="row-between" style="padding:0 6px 8px">
          <span class="small muted">${esc(t("usage_chart"))}</span>
          <span class="badge acc">${esc(window.Store.state.settings.lang === "ar" ? "أسبوع" : "week")}</span>
        </div>
        <svg class="chart" viewBox="0 0 300 110" preserveAspectRatio="none">
          ${series.map((d, i) => {
            const h = Math.round((d.tokens / maxTok) * 74) + 4;
            const x = 8 + i * 41;
            return `<rect x="${x}" y="${96 - h}" width="22" height="${h}" rx="6" fill="${i === series.length - 1 ? "#f97316" : "#2a2a38"}"/>`;
          }).join("")}
          ${series.map((d, i) => `<text x="${19 + i * 41}" y="107" font-size="7" fill="#6b7280" text-anchor="middle">${d.day.slice(8)}/${d.day.slice(5, 7)}</text>`).join("")}
        </svg>
      </div>

      <div class="section-title"><span>${esc(t("my_agents"))}</span>
        <span class="hint" data-act="nav" data-nav="agents">${esc(t("all_agents"))}</span></div>
      <div class="grid grid-2" style="gap:10px">
        ${agents.map((a) => {
          const p = a.limit ? Math.round((a.tokens / a.limit) * 100) : 0;
          return `<button class="card tight" style="text-align:start" data-act="nav" data-nav="agents">
            <div class="row">
              <span class="li-ico" style="background:${a.color}22;border-color:${a.color}44;color:${a.color}">
                <span style="font-size:17px">${esc(a.glyph || "◆")}</span></span>
              <div class="grow">
                <div class="row-between"><span class="bold small">${esc(a.name)}</span>
                  <span class="dot ${a.enabled ? "" : "off"}"></span></div>
                <div class="xsmall muted nowrap">${esc(a.sub)}</div>
              </div>
            </div>
            <div class="bar thin mt-s"><i style="width:${p}%;background:${a.color}"></i></div>
            <div class="xsmall faint">${nfmt(a.tokens)} / ${nfmt(a.limit)}</div>
          </button>`;
        }).join("")}
        <button class="card tight center" style="min-height:96px;flex-direction:column;gap:6px" data-act="add-agent">
          <span class="icon-btn accent">${I()("plus")}</span>
          <span class="small muted">${esc(t("add_agent"))}</span>
        </button>
      </div>

      <div class="section-title"><span>${esc(t("recent_activity"))}</span>
        <span class="hint" data-act="nav" data-nav="reports">${esc(t("view_all"))}</span></div>
      <div class="list">
        ${(s.activity.length ? s.activity.slice(0, 5) : [
          { text: window.Store.state.settings.lang === "ar" ? "ابدأ محادثة جديدة لتبدأ العمل" : "Start a chat to get going", glyph: "✦", color: "#f97316", ts: Date.now() },
        ]).map((a) => `
          <div class="list-item">
            <span class="li-ico" style="background:${a.color}1f;border-color:${a.color}3d;color:${a.color}">${esc(a.glyph)}</span>
            <div class="grow"><div class="li-ttl small">${esc(a.text)}</div>
              <div class="li-sub">${esc(window.UI.timeAgo(a.ts))}</div></div>
          </div>`).join("")}
      </div>
    </div>`;
  }

  /* ============================================================== chats */
  function chats() {
    const s = window.Store.state;
    return `
    <div class="fade-in">
      <div class="row-between">
        <div class="search grow">${I()("search")}<input id="chat-search" placeholder="${esc(t("search_ph"))}" data-act="chat-filter"></div>
        <button class="icon-btn accent" data-act="new-chat">${I()("plus")}</button>
      </div>
      <div id="chat-list" class="list mt">
        ${s.chats.length ? s.chats.map(chatRow).join("") : emptyState("chat", t("chat_empty"), t("chat_empty_hint"))}
      </div>
    </div>`;
  }

  function chatRow(c) {
    const last = c.messages[c.messages.length - 1];
    const prov = window.Store.state.settings.providers.find((p) => p.id === c.providerId);
    return `<div class="list-item" data-act="open-chat" data-id="${c.id}">
      <span class="li-ico" style="color:var(--accent-2)">${I()("chat")}</span>
      <div class="grow">
        <div class="li-ttl nowrap">${esc(c.title || t("new_chat"))}</div>
        <div class="li-sub nowrap">${esc(last ? last.content.slice(0, 60) : t("nothing_here"))}</div>
      </div>
      <div class="li-end"><span class="badge">${esc((prov && prov.name) || "—")}</span>
        <span class="xsmall faint">${esc(window.UI.timeAgo(c.updatedAt))}</span></div>
    </div>`;
  }

  /* =============================================================== chat */
  function chat() {
    const s = window.Store.state;
    let c = window.Store.chat(s.activeChatId);
    if (!c) c = window.Store.newChat();
    const prov = s.settings.providers.find((p) => p.id === c.providerId) || window.Api.provider();
    const running = window.App.router.helper.isStreaming(c.id);

    return `
    <div class="fade-in" style="display:flex;flex-direction:column;min-height:100%">
      <div class="card tight row-between" style="position:sticky;top:0;z-index:5;backdrop-filter:var(--blur)">
        <div class="row grow" style="min-width:0">
          <span class="li-ico" style="background:var(--accent-soft);border-color:rgba(249,115,22,.35);color:var(--accent-2)">${I()("brain")}</span>
          <div class="grow" style="min-width:0">
            <div class="bold small nowrap">${esc(prov ? prov.name : "So-key Ai")}</div>
            <div class="xsmall muted nowrap">${esc(c.model || (prov && prov.model) || "auto")}</div>
          </div>
        </div>
        <span class="dot ${prov && prov.status === "ok" ? "" : "off"}" title="${esc(prov && prov.status === "ok" ? t("connected") : t("disconnected"))}"></span>
        <button class="icon-btn ghost" data-act="chat-menu">${I()("more")}</button>
      </div>

      <div class="seg mt-s" id="chat-mode">
        <button class="${(window.App.router.helper.mode(c.id) === "chat") ? "active" : ""}" data-act="chat-mode" data-mode="chat">${esc(t("chat_mode"))}</button>
        <button class="${(window.App.router.helper.mode(c.id) === "workflow") ? "active" : ""}" data-act="chat-mode" data-mode="workflow">${esc(t("workflow_mode"))}</button>
      </div>

      <div id="messages" class="grow mt">${c.messages.length ? c.messages.map(msgHtml).join("") : chatEmpty()}</div>

      <div class="composer">
        <div class="col grow" style="gap:6px">
          <div class="quick-tools">
            <button data-act="quick" data-text="${esc(t("chat_placeholder"))}">${I()("bolt")} ${esc(t("quick_actions"))}</button>
            <button data-act="quick" data-text="اشرح لي هذا الكود وحسّنه">${I()("code")} code</button>
            <button data-act="quick" data-text="اكتب تقريرًا موجزًا عن آخر أعمالي">${I()("report")} report</button>
          </div>
          <div class="c-box">
            <button class="icon-btn ghost" data-act="attach">${I()("plus")}</button>
            <textarea id="composer" rows="1" placeholder="${esc(t("your_message_ph"))}" data-act="composer-input"></textarea>
            <button class="icon-btn ghost" data-act="open-browser-frame" data-url="https://github.com/ahmedsykoo/So-key-ai">${I()("globe")}</button>
            <button class="send ${running ? "stop" : ""}" id="send-btn" data-act="${running ? "stop-stream" : "send"}">${I()(running ? "stop" : "send")}</button>
          </div>
        </div>
      </div>
    </div>`;
  }

  function chatEmpty() {
    return `<div class="empty">${I()("sparkles")}
      <div class="bold">${esc(t("chat_empty"))}</div>
      <div class="small">${esc(t("chat_empty_hint"))}</div>
      <div class="col mt" style="gap:8px;max-width:420px;margin-inline:auto">
        ${(window.Store.state.settings.lang === "ar" ? [
          "لخّص لي حالة مشروع Super Driver",
          "اكتب دالة Kotlin لحساب المسافة بين نقطتين",
          "ما هي أفضل إعدادات OmniRoute لدي؟",
        ] : [
          "Summarise the Super Driver project status",
          "Write a Kotlin function to compute a route distance",
          "What is my best OmniRoute setup?",
        ]).map((q) => `<button class="btn ghost-lg block" data-act="quick" data-text="${esc(q)}">${esc(q)}</button>`).join("")}
      </div>
    </div>`;
  }

  function msgHtml(m, streaming) {
    const isUser = m.role === "user";
    const who = isUser ? t("you") : t("ai");
    const glyph = isUser ? "🙂" : "◆";
    return `<div class="msg ${isUser ? "user" : "ai"}" data-mid="${m.id}">
      <span class="avatar sm">${glyph}</span>
      <div style="min-width:0">
        <div class="bubble ${streaming ? "typing" : ""}" id="b-${m.id}">${window.UI.mdToHtml(m.content || "")}</div>
        <div class="meta row" style="gap:8px">
          <span>${esc(who)} · ${esc(window.UI.clock(m.ts))}</span>
          ${m.tokens ? `<span>· ${nfmt(m.tokens)} tok</span>` : ""}
        </div>
        <div class="actions">
          <button data-act="copy-msg" data-id="${m.id}">${esc(t("copy"))}</button>
          <button data-act="regen-msg" data-id="${m.id}">${esc(t("regenerate"))}</button>
        </div>
      </div>
    </div>`;
  }

  /* =========================================================== projects */
  const PROJECT_TABS = [
    { id: "all", ar: "الكل", en: "All" },
    { id: "dev", ar: "التطوير", en: "Development" },
    { id: "study", ar: "الدراسة", en: "Study" },
    { id: "design", ar: "التصميم", en: "Design" },
    { id: "work", ar: "العمل", en: "Work" },
  ];

  function projects() {
    const s = window.Store.state;
    const ar = s.settings.lang === "ar";
    return `
    <div class="fade-in">
      <div class="row-between">
        <div><div class="bold" style="font-size:var(--fs-lg)">${esc(t("projects"))}</div>
          <div class="xsmall muted">${esc(t("projects_hint"))}</div></div>
        <button class="btn primary sm" data-act="new-project">${I()("plus")} ${esc(t("new_project"))}</button>
      </div>
      <div class="chips mt">
        ${PROJECT_TABS.map((tb) => `<button class="chip ${window.App.router.params.tag === tb.id || (!window.App.router.params.tag && tb.id === "all") ? "active" : ""}"
          data-act="project-tab" data-tag="${tb.id}">${esc(ar ? tb.ar : tb.en)}</button>`).join("")}
      </div>
      <div class="grid grid-auto mt">
        ${s.projects.map((p) => `
          <button class="tile" style="--tile-accent:${p.color}" data-act="project-open" data-id="${p.id}">
            <div class="row-between">
              <span class="t-ico" style="background:${p.color}22;border-color:${p.color}44;color:${p.color}">${I()("folder")}</span>
              <span class="xsmall faint">${esc(window.UI.timeAgo(Date.now() - 86400000 * 2))}</span>
            </div>
            <div class="t-name">${esc(p.name)}</div>
            <div class="t-sub">${esc(p.sub)}</div>
            <div class="bar thin"><i style="width:${p.progress}%;background:linear-gradient(90deg,${p.color},var(--accent))"></i></div>
            <div class="t-foot"><span>${p.files} ${esc(t("files_count"))}</span><span>${p.done} ${esc(t("done_count"))}</span>
              <span class="bold" style="color:${p.color}">${p.progress}%</span></div>
          </button>`).join("")}
        <button class="tile center" style="min-height:150px;flex-direction:column;gap:8px" data-act="new-project">
          <span class="icon-btn accent">${I()("plus")}</span>
          <span class="small muted">${esc(t("new_project"))}</span>
        </button>
      </div>
    </div>`;
  }

  /* ============================================================= agents */
  function agents() {
    const s = window.Store.state;
    return `
    <div class="fade-in">
      <div class="row-between">
        <div><div class="bold" style="font-size:var(--fs-lg)">${esc(t("agents"))}</div>
          <div class="xsmall muted">${esc(t("deps_note"))}</div></div>
        <button class="btn primary sm" data-act="add-agent">${I()("plus")} ${esc(t("add_agent"))}</button>
      </div>
      <div class="card mt">
        <div class="row-between small"><span class="muted">${esc(t("today_usage"))}</span>
          <span class="bold">${nfmt(window.Api.Native.usageToday())} tok</span></div>
        <div class="bar mt-s"><i style="width:${Math.min(100, (window.Api.Native.usageToday() / Math.max(1, window.Api.Native.tokenLimit())) * 100)}%"></i></div>
      </div>
      <div class="list mt">
        ${s.agents.map((a) => {
          const p = a.limit ? Math.round((a.tokens / a.limit) * 100) : 0;
          return `<div class="list-item">
            <span class="li-ico" style="background:${a.color}22;border-color:${a.color}44;color:${a.color};font-size:17px">${esc(a.glyph)}</span>
            <div class="grow">
              <div class="row-between"><span class="li-ttl">${esc(a.name)}</span>
                <span class="xsmall muted">${p}%</span></div>
              <div class="li-sub">${esc(a.sub)} · ${nfmt(a.tokens)} / ${nfmt(a.limit)}</div>
              <div class="bar thin mt-s"><i style="width:${p}%;background:${a.color}"></i></div>
            </div>
            <button class="switch ${a.enabled ? "on" : ""}" data-act="toggle-agent" data-id="${a.id}"></button>
          </div>`;
        }).join("")}
      </div>
      <div class="card mt">
        <div class="card-title">${esc(t("agent_task"))}</div>
        <div class="small muted mt-s">${esc(t("simulate_note"))}</div>
        <div class="field mt"><textarea class="input" id="agent-task" placeholder="${esc(t("agent_task_ph"))}"></textarea></div>
        <button class="btn primary block mt" data-act="agent-run">${I()("play")} ${esc(t("run"))}</button>
      </div>
    </div>`;
  }

  function emptyState(iconName, title, sub) {
    return `<div class="empty">${I()(iconName)}<div class="bold">${esc(title)}</div>
      <div class="small">${esc(sub || "")}</div></div>`;
  }

  window.Screens = window.Screens || {};
  Object.assign(window.Screens, { home, chats, chat, chatRow, msgHtml, projects, agents, emptyState, chatEmpty });
})();
