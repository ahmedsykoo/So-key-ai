/* ==========================================================================
   So-key Ai — icons, shell chrome, toast, modal, small UI helpers
   ========================================================================== */
(function () {
  "use strict";

  /* --------------------------------------------------------------- icons */
  const P = {
    home: "M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",
    chat: "M21 11.5a8.4 8.4 0 0 1-9 8.4 9.6 9.6 0 0 1-2.8-.4L4 21l1.4-4.2A8.3 8.3 0 0 1 3.6 11.5 8.4 8.4 0 0 1 12 3.1a8.4 8.4 0 0 1 9 8.4z",
    folder: "M3 7a2 2 0 0 1 2-2h3.5l2 2H19a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
    cpu: "M6 6h12v12H6zM9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3",
    sparkles: "M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8zM19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z",
    plug: "M9 3v6M15 3v6M7 9h10v3a5 5 0 0 1-10 0zM12 17v4",
    wrench: "M15 3a5 5 0 0 0-4.6 7L3 17.4V21h3.6L14 13.6A5 5 0 1 0 15 3z",
    terminal: "M4 4h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zM7 9l3 3-3 3M13 15h4",
    git: "M12 2l10 10-10 10L2 12zM12 8.5A1.5 1.5 0 1 0 12 11.5a1.5 1.5 0 0 0 0-3zM12 3v4M12 17v4",
    clock: "M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM12 7v5l3.5 2",
    chart: "M5 21V10M12 21V4M19 21v-7",
    report: "M6 3h9l4 4v14H6zM15 3v4h4M9 12h6M9 16h6",
    settings: "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2v.2a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-2.9-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 2.5 14H2a2 2 0 1 1 0-4h.2A1.7 1.7 0 0 0 3.4 7l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 9 3.5V3a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0 1.2 2.9h.2a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1.5 1z",
    palette: "M12 3a9 9 0 0 0 0 18 2 2 0 0 0 1.6-3.2 2 2 0 0 1 1.6-3.2h1.3A4.5 4.5 0 0 0 21 10 7 7 0 0 0 12 3zM7.5 10.5h.01M10 7.5h.01M14.5 7.5h.01M17 10.5h.01",
    globe: "M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z",
    help: "M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM9.6 9.2a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1.1 1-1.1 1.8v.4M12 16.8h.01",
    menu: "M4 7h16M4 12h16M4 17h16",
    bell: "M18 15V10a6 6 0 1 0-12 0v5l-2 3h16zM10 21h4",
    sun: "M12 5V3M12 21v-2M5 12H3M21 12h-2M6.3 6.3 4.9 4.9M19.1 19.1l-1.4-1.4M17.7 6.3l1.4-1.4M4.9 19.1l1.4-1.4M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8z",
    moon: "M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z",
    plus: "M12 5v14M5 12h14",
    search: "M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14zM20 20l-4-4",
    send: "M4 12l16-8-6 8 6 8z",
    mic: "M12 4a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0V7a3 3 0 0 1 3-3zM6 11v1a6 6 0 0 0 12 0v-1M12 19v3",
    close: "M6 6l12 12M18 6L6 18",
    chevron: "M9 6l6 6-6 6",
    back: "M15 6l-6 6 6 6",
    more: "M12 6h.01M12 12h.01M12 18h.01",
    check: "M5 13l4 4L19 7",
    trash: "M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13M10 11v6M14 11v6",
    edit: "M4 20h4L20 8l-4-4L4 16z",
    copy: "M9 9h11v11H9zM4 15V4h11",
    refresh: "M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6",
    play: "M7 4l12 8-12 8z",
    stop: "M6 6h12v12H6z",
    external: "M14 4h6v6M20 4l-8 8M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5",
    download: "M12 4v11M7 11l5 5 5-5M5 20h14",
    upload: "M12 20V9M7 13l5-5 5 5M5 4h14",
    key: "M15 3a6 6 0 1 0-5.4 8.6L4 17v3h3l1-1h2v-2h2l1.4-1.4A6 6 0 0 0 15 3zm1.5 4.5h.01",
    server: "M4 4h16v6H4zM4 14h16v6H4zM8 7h.01M8 17h.01",
    shield: "M12 3l8 3v6c0 5-3.4 8.3-8 9-4.6-.7-8-4-8-9V6z",
    info: "M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM12 11v5M12 8h.01",
    file: "M7 3h7l5 5v13H7zM14 3v5h5",
    files: "M9 3h6l4 4v10H9zM6 7v14h10",
    code: "M9 8l-4 4 4 4M15 8l4 4-4 4",
    star: "M12 3l2.8 6 6.2.7-4.6 4.2 1.3 6.1L12 17l-5.7 3 1.3-6.1L3 9.7 9.2 9z",
    alert: "M12 4l9 17H3zM12 10v4M12 18h.01",
    wifi: "M5 12a10 10 0 0 1 14 0M8.5 15.5a5 5 0 0 1 7 0M12 19h.01",
    database: "M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3",
    book: "M4 5a2 2 0 0 1 2-2h13v18H6a2 2 0 0 1-2-2zM8 7h7M8 11h7",
    bolt: "M13 3L5 14h6l-1 7 8-11h-6z",
    flask: "M9 3h6M10 3v6L5 19a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 19L14 9V3M7.5 15h9",
    image: "M4 5h16v14H4zM4 15l4-4 5 5 3-3 4 4M9.5 9h.01",
    link: "M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1",
    grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
    logout: "M10 5H6a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h4M16 8l4 4-4 4M20 12H9",
    users: "M9 8a3 3 0 1 1 0 6 3 3 0 0 1 0-6zM3 20c0-3 2.7-5 6-5s6 2 6 5M16 6.5a3 3 0 0 1 0 5.8M18 20c0-2-.6-3.6-1.6-4.8",
    brain: "M9 4a3 3 0 0 0-3 3 3 3 0 0 0-1 5.8V15a3 3 0 0 0 3 3h1V4zM15 4a3 3 0 0 1 3 3 3 3 0 0 1 1 5.8V15a3 3 0 0 1-3 3h-1V4zM12 4v16",
  };

  function icon(name, cls) {
    const d = P[name] || P.info;
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" ' +
      'stroke-linecap="round" stroke-linejoin="round"' + (cls ? ' class="' + cls + '"' : "") + "><path d=\"" + d + "\"/></svg>";
  }

  /* ------------------------------------------------------------- helpers */
  const esc = (s) => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

  function nfmt(n) {
    n = Number(n) || 0;
    if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
    if (n >= 1e3) return (n / 1e3).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, "") + "k";
    return String(Math.round(n));
  }

  function timeAgo(ts) {
    if (!ts) return "—";
    const s = Math.floor((Date.now() - ts) / 1000);
    if (s < 60) return window.Store.state.settings.lang === "ar" ? "الآن" : "now";
    const m = Math.floor(s / 60);
    if (m < 60) return m + (window.Store.state.settings.lang === "ar" ? " دقيقة" : "m");
    const h = Math.floor(m / 60);
    if (h < 24) return h + (window.Store.state.settings.lang === "ar" ? " ساعة" : "h");
    const d = Math.floor(h / 24);
    return d + (window.Store.state.settings.lang === "ar" ? " يوم" : "d");
  }

  function clock(ts) {
    const d = new Date(ts || Date.now());
    return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
  }

  function ring(pct, label, value, size) {
    const r = (size || 98) / 2 - 7;
    const c = 2 * Math.PI * r;
    const off = c * (1 - Math.min(1, Math.max(0, pct / 100)));
    return '<div class="ring" style="width:' + (size || 98) + "px;height:" + (size || 98) + 'px">' +
      '<svg width="' + (size || 98) + '" height="' + (size || 98) + '">' +
      '<defs><linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0%" stop-color="#f97316"/><stop offset="100%" stop-color="#fb923c"/></linearGradient></defs>' +
      '<circle class="r-bg" cx="' + (size || 98) / 2 + '" cy="' + (size || 98) / 2 + '" r="' + r + '" fill="none" stroke-width="8"/>' +
      '<circle class="r-fg" cx="' + (size || 98) / 2 + '" cy="' + (size || 98) / 2 + '" r="' + r + '" fill="none" stroke-width="8" ' +
      'stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + off.toFixed(1) + '"/></svg>' +
      '<div class="r-txt"><b>' + esc(value != null ? value : Math.round(pct) + "%") + "</b>" +
      (label ? "<span>" + esc(label) + "</span>" : "") + "</div></div>";
  }

  /* ---------------------------------------------------------------- toast */
  function toast(msg, kind) {
    const root = document.getElementById("toast-root");
    if (!root) return;
    const el = document.createElement("div");
    el.className = "toast " + (kind || "");
    el.textContent = msg;
    root.appendChild(el);
    setTimeout(() => { el.style.opacity = "0"; el.style.transition = "opacity .25s"; }, 2200);
    setTimeout(() => el.remove(), 2600);
  }

  /* ---------------------------------------------------------------- modal */
  function modal(title, bodyHtml, footerHtml, opts) {
    const root = document.getElementById("modal-root");
    opts = opts || {};
    root.innerHTML =
      '<div class="sheet-scrim" data-act="modal-close-bg">' +
      '<div class="sheet" role="dialog" aria-modal="true">' +
      '<div class="sheet-head"><h3>' + esc(title) + "</h3>" +
      '<button class="icon-btn ghost" data-act="modal-close">' + icon("close") + "</button></div>" +
      "<div>" + bodyHtml + "</div>" +
      (footerHtml ? '<div class="btn-row mt">' + footerHtml + "</div>" : "") +
      "</div></div>";
    root.style.pointerEvents = "auto";
    if (opts.onMount) opts.onMount(root.firstElementChild);
    return root;
  }

  function closeModal() {
    const root = document.getElementById("modal-root");
    if (root) { root.innerHTML = ""; root.style.pointerEvents = "none"; }
  }

  function confirmDialog(message, onYes, yesLabel) {
    modal(t("confirm"), '<p class="muted">' + esc(message) + "</p>",
      '<button class="btn grow" data-act="modal-close">' + esc(t("cancel")) + "</button>" +
      '<button class="btn danger grow" id="confirm-yes">' + esc(yesLabel || t("confirm")) + "</button>",
      {
        onMount: (root) => {
          root.querySelector("#confirm-yes").addEventListener("click", () => { closeModal(); onYes(); });
        },
      });
  }

  /* ------------------------------------------------------- markdown mini */
  function mdToHtml(src) {
    let s = esc(src || "");
    // fenced code
    const codes = [];
    s = s.replace(/```(\w+)?\n([\s\S]*?)```/g, (m, lang, code) => {
      codes.push(code.replace(/\n$/, ""));
      return "\u0000CODE" + (codes.length - 1) + "\u0000";
    });
    s = s.replace(/`([^`\n]+)`/g, "<code>$1</code>");
    s = s.replace(/^### (.*)$/gm, "<h3>$1</h3>")
         .replace(/^## (.*)$/gm, "<h2>$1</h2>")
         .replace(/^# (.*)$/gm, "<h1>$1</h1>");
    s = s.replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>").replace(/(^|\s)\*([^*\n]+)\*/g, "$1<i>$2</i>");
    s = s.replace(/^\s*[-*•]\s+(.*)$/gm, "<li>$1</li>");
    s = s.replace(/(<li>[\s\S]*?<\/li>)(?!\s*<li>)/g, "<ul>$1</ul>");
    s = s.replace(/^\s*(\d+)\.\s+(.*)$/gm, "<li>$2</li>");
    s = s.replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" data-act="open-link" data-url="$2">$1</a>');
    s = s.replace(/\n{2,}/g, "</p><p>").replace(/\n/g, "<br>");
    s = "<p>" + s + "</p>";
    s = s.replace(/<p>\s*(<h[123]|<ul|<pre)/g, "$1").replace(/(<\/h[123]>|<\/ul>|<\/pre>)\s*<\/p>/g, "$1");
    s = s.replace(/\u0000CODE(\d+)\u0000/g, (m, i) =>
      '<pre><code>' + esc(codes[Number(i)]) + "</code></pre>");
    return s;
  }

  window.UI = { icon, esc, nfmt, timeAgo, clock, ring, toast, modal, closeModal, confirmDialog, mdToHtml };
})();
