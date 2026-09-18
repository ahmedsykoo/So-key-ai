/* ==========================================================================
   So-key Ai — persistent state store (localStorage backed) + tiny helpers
   ========================================================================== */
(function () {
  "use strict";

  const KEY = "sokey.state.v1";
  const uid = (p) => (p || "id") + "_" + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-3);
  const clone = (o) => JSON.parse(JSON.stringify(o));

  const DEFAULTS = {
    settings: {
      lang: "ar",
      theme: "default",
      font: "system",
      customFonts: [],          // [{name, file, size}]
      textScale: 1.0,
      streaming: true,
      toolsEnabled: true,
      githubToken: "",
      githubUser: "ahmedsykoo",
      activeProviderId: "omniroute",
      providers: [
        {
          id: "omniroute", name: "OmniRoute", builtin: true, enabled: true,
          baseUrl: "http://127.0.0.1:20128", apiKey: "", model: "auto",
          models: ["auto"], modelsFetchedAt: 0, status: "unknown",
          note: "OpenAI-compatible gateway — edit the URL for localhost / LAN / tunnel",
        },
        {
          id: "ollama", name: "Ollama", enabled: false,
          baseUrl: "http://127.0.0.1:11434/v1", apiKey: "ollama", model: "llama3.1",
          models: [], status: "unknown", note: "Local models on this device or your LAN",
        },
        {
          id: "openai", name: "OpenAI", enabled: false,
          baseUrl: "https://api.openai.com/v1", apiKey: "", model: "gpt-4o-mini",
          models: [], status: "unknown", note: "Cloud provider — needs an API key",
        },
        {
          id: "custom", name: "مزوّد مخصّص", enabled: false,
          baseUrl: "", apiKey: "", model: "", models: [], status: "unknown",
          note: "Any OpenAI-compatible endpoint",
        },
      ],
    },
    chats: [],
    activeChatId: null,
    projects: [
      { id: "p_super", name: "Super Driver", sub: "تطبيق إدارة الرحلات", files: 18, done: 3, progress: 72, color: "#3b82f6" },
      { id: "p_research", name: "AI Research", sub: "أبحاث وتجارب الذكاء الاصطناعي", files: 42, done: 5, progress: 45, color: "#22c55e" },
      { id: "p_mobile", name: "Mobile Apps", sub: "تطبيقات أندرويد", files: 28, done: 4, progress: 68, color: "#ef4444" },
      { id: "p_web", name: "Web Development", sub: "مواقع وتطبيقات ويب", files: 36, done: 4, progress: 55, color: "#a855f7" },
      { id: "p_design", name: "Design System", sub: "تصميم واجهات المستخدم", files: 12, done: 2, progress: 30, color: "#f59e0b" },
      { id: "p_study", name: "Study & Learning", sub: "مشاريع التعلم والدراسة", files: 24, done: 2, progress: 25, color: "#0ea5e9" },
    ],
    agents: [
      { id: "a_codex", name: "Codex", sub: "توليد الكود", tokens: 90000, limit: 300000, enabled: true, color: "#f97316", glyph: "◆" },
      { id: "a_chatgpt", name: "ChatGPT", sub: "محادثة عامة", tokens: 44000, limit: 200000, enabled: true, color: "#10b981", glyph: "✦" },
      { id: "a_claude", name: "Claude", sub: "مراجعة الكود", tokens: 36000, limit: 200000, enabled: true, color: "#f59e0b", glyph: "✳" },
      { id: "a_gemini", name: "Gemini", sub: "تحليل البيانات", tokens: 24000, limit: 200000, enabled: false, color: "#3b82f6", glyph: "✧" },
      { id: "a_deepseek", name: "DeepSeek", sub: "استدلال", tokens: 16000, limit: 200000, enabled: false, color: "#6366f1", glyph: "◈" },
      { id: "a_qwen", name: "Qwen", sub: "متعدد اللغات", tokens: 12000, limit: 200000, enabled: false, color: "#8b5cf6", glyph: "❖" },
    ],
    skills: [
      { id: "s_android", name: "Android Development", nameAr: "تطوير تطبيقات أندرويد", glyph: "🤖", installed: true, default: true },
      { id: "s_review", name: "Code Review", nameAr: "مراجعة وتحسين الكود", glyph: "</>", installed: true, default: true },
      { id: "s_github", name: "GitHub Expert", nameAr: "إدارة مستودعات GitHub", glyph: "⌥", installed: true, default: true },
      { id: "s_uiux", name: "UI/UX Design", nameAr: "تصميم واجهات المستخدم", glyph: "🎨", installed: true, default: true },
      { id: "s_problem", name: "Problem Solving", nameAr: "تحليل وحل المشكلات", glyph: "💡", installed: true, default: true },
      { id: "s_exec", name: "Exec", nameAr: "تنفيذ أوامر داخل مساحة العمل", glyph: "▶", installed: true, default: true },
      { id: "s_testing", name: "Testing", nameAr: "كتابة واختبار الأكواد", glyph: "🧪", installed: false },
      { id: "s_docs", name: "Documentation", nameAr: "إنشاء وتحديث التوثيق", glyph: "📘", installed: false },
      { id: "s_devops", name: "DevOps", nameAr: "CI/CD والنشر", glyph: "∞", installed: false },
      { id: "s_data", name: "Data Analysis", nameAr: "تحليل البيانات والتقارير", glyph: "📊", installed: false },
    ],
    plugins: [
      { id: "pl_files", name: "File System", sub: "قراءة وكتابة ملفات مساحة العمل", enabled: true },
      { id: "pl_http", name: "HTTP Client", sub: "طلبات شبكة للوكلاء", enabled: true },
      { id: "pl_notify", name: "Notifications", sub: "إشعارات النظام", enabled: true },
      { id: "pl_share", name: "Share Sheet", sub: "مشاركة الملفات والنصوص", enabled: true },
      { id: "pl_clip", name: "Clipboard", sub: "النسخ واللصق", enabled: true },
    ],
    workflows: [
      { id: "w_report", name: "تقرير الحالة الأسبوعي", steps: 3, lastRun: 0, enabled: true,
        script: [
          { type: "note", text: "تجميع ملخص من مساحة العمل" },
          { type: "http", url: "https://api.github.com/repos/ahmedsykoo/So-key-ai", label: "فحص المستودع" },
          { type: "file", path: "reports/weekly.md", label: "حفظ التقرير" },
        ] },
      { id: "w_backup", name: "نسخ احتياطي للمحادثات", steps: 2, lastRun: 0, enabled: true,
        script: [
          { type: "note", text: "تصدير المحادثات" },
          { type: "file", path: "backups/chats.json", label: "كتابة النسخة" },
        ] },
      { id: "w_check", name: "فحص حالة المزوّدين", steps: 2, lastRun: 0, enabled: false,
        script: [
          { type: "http", url: "", label: "اختبار OmniRoute" },
          { type: "note", text: "تسجيل النتيجة" },
        ] },
    ],
    mcp: [
      { id: "m_local", name: "workspace-fs", transport: "stdio", endpoint: "builtin://fs", enabled: true },
      { id: "m_http", name: "omniroute-tools", transport: "http", endpoint: "http://127.0.0.1:20128/mcp", enabled: false },
    ],
    usageDaily: {},   // "YYYY-MM-DD": tokens
    activity: [],
  };

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return clone(DEFAULTS);
      const parsed = JSON.parse(raw);
      const merged = Object.assign(clone(DEFAULTS), parsed);
      merged.settings = Object.assign(clone(DEFAULTS.settings), parsed.settings || {});
      if (!Array.isArray(merged.settings.providers) || !merged.settings.providers.length) {
        merged.settings.providers = clone(DEFAULTS.settings.providers);
      }
      merged.settings.providers = merged.settings.providers.map((p) => {
        const base = DEFAULTS.settings.providers.find((d) => d.id === p.id);
        return Object.assign({}, base || {}, p);
      });
      return merged;
    } catch (e) {
      console.warn("state load failed", e);
      return clone(DEFAULTS);
    }
  }

  let saveTimer = null;
  function save(state) {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try {
        localStorage.setItem(KEY, JSON.stringify(state));
      } catch (e) {
        console.warn("state save failed", e);
      }
    }, 120);
  }

  window.Store = {
    state: load(),
    uid,
    DEFAULT_PROVIDERS: DEFAULTS.settings.providers,
    persist() { save(this.state); },
    reset() {
      this.state = clone(DEFAULTS);
      save(this.state);
      return this.state;
    },
    set(path, value) {
      const parts = String(path).split(".");
      let obj = this.state;
      for (let i = 0; i < parts.length - 1; i++) {
        if (obj[parts[i]] == null) obj[parts[i]] = {};
        obj = obj[parts[i]];
      }
      obj[parts[parts.length - 1]] = value;
      save(this.state);
      return value;
    },
    get(path) {
      return String(path).split(".").reduce((o, k) => (o == null ? o : o[k]), this.state);
    },
    /* ------------------------------------------------------------ chats */
    newChat(title) {
      const id = uid("chat");
      const chat = {
        id, title: title || t("new_chat").replace("+ ", ""),
        providerId: this.state.settings.activeProviderId,
        model: "",
        messages: [], createdAt: Date.now(), updatedAt: Date.now(),
      };
      this.state.chats.unshift(chat);
      this.state.activeChatId = id;
      save(this.state);
      return chat;
    },
    chat(id) {
      return this.state.chats.find((c) => c.id === (id || this.state.activeChatId)) || null;
    },
    deleteChat(id) {
      this.state.chats = this.state.chats.filter((c) => c.id !== id);
      if (this.state.activeChatId === id) this.state.activeChatId = this.state.chats[0] ? this.state.chats[0].id : null;
      save(this.state);
    },
    addMessage(chatId, msg) {
      const chat = this.chat(chatId);
      if (!chat) return null;
      const m = Object.assign({ id: uid("m"), ts: Date.now() }, msg);
      chat.messages.push(m);
      chat.updatedAt = Date.now();
      if (chat.messages.length === 1 && msg.role === "user") {
        chat.title = msg.content.slice(0, 42) + (msg.content.length > 42 ? "…" : "");
      }
      save(this.state);
      return m;
    },
    /* ----------------------------------------------------------- usage */
    addUsage(tokens) {
      const day = new Date().toISOString().slice(0, 10);
      this.state.usageDaily[day] = (this.state.usageDaily[day] || 0) + tokens;
      save(this.state);
    },
    logActivity(text, glyph, color) {
      this.state.activity.unshift({ id: uid("act"), text, glyph: glyph || "•", color: color || "#f97316", ts: Date.now() });
      this.state.activity = this.state.activity.slice(0, 40);
      save(this.state);
    },
    todayTokens() {
      const day = new Date().toISOString().slice(0, 10);
      return this.state.usageDaily[day] || 0;
    },
    weekSeries() {
      const out = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(Date.now() - i * 86400000);
        const key = d.toISOString().slice(0, 10);
        out.push({ day: key, tokens: this.state.usageDaily[key] || 0 });
      }
      return out;
    },
  };
})();
