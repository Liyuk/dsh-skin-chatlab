(() => {
  // packages/core/src/registry.js
  function createSkinRegistry() {
    const skins = [];
    const byId = {};
    const listeners = [];
    function registerSkin(def) {
      if (!def || typeof def.id !== "string" || !def.id) return;
      if (byId[def.id]) return;
      const normalized = {
        id: def.id,
        name: def.name || def.id,
        desc: def.desc || "",
        ready: def.ready !== false,
        // 缺省 true
        tokens: def.tokens || { light: {}, dark: {} },
        css: def.css || ""
      };
      byId[def.id] = normalized;
      skins.push(normalized);
      for (let i = 0; i < listeners.length; i++) {
        try {
          listeners[i](normalized);
        } catch (e) {
        }
      }
    }
    function subscribe(fn) {
      listeners.push(fn);
      return function() {
        const i = listeners.indexOf(fn);
        if (i >= 0) listeners.splice(i, 1);
      };
    }
    function list() {
      return skins.slice();
    }
    function get(id) {
      return byId[id];
    }
    function has(id) {
      return !!byId[id];
    }
    return { registerSkin, subscribe, list, get, has };
  }
  var singleton = createSkinRegistry();

  // packages/core/src/prefs.js
  var KEY_SKIN = "dsh-skin-chatlab.skin";
  var KEY_THEME = "dsh-skin-chatlab.theme";
  var KEY_READ = "dsh-skin-chatlab.read";
  var KEY_AVATAR_MAP = "dsh-skin-chatlab.avatar";
  function readSkin() {
    try {
      var v = localStorage.getItem(KEY_SKIN);
      if (v === "none") return "none";
      return singleton.has(v) ? v : "feishu";
    } catch (e) {
      return "feishu";
    }
  }
  function applyHtml(skin, theme) {
    var el = document.documentElement;
    if (skin === "none") {
      el.removeAttribute("data-chatlab-skin");
      el.removeAttribute("data-chatlab-theme");
    } else {
      el.setAttribute("data-chatlab-skin", skin);
      el.removeAttribute("data-chatlab-theme");
    }
  }

  // packages/core/src/settings.js
  function makeSettingsPanel(react) {
    function SwitchRow(props) {
      return react.createElement(
        "label",
        { className: "cl-row" },
        react.createElement(
          "span",
          { className: "cl-row-body" },
          react.createElement("span", { className: "cl-row-title" }, props.title),
          react.createElement("span", { className: "cl-row-desc" }, props.desc)
        ),
        react.createElement(
          "span",
          { className: "cl-switch" + (props.checked ? " cl-on" : "") },
          react.createElement("input", {
            type: "checkbox",
            checked: props.checked,
            onChange: function(e) {
              props.onChange(e.target.checked);
            }
          }),
          react.createElement("span", { className: "cl-knob" })
        )
      );
    }
    function SkinChip(props) {
      if (props.disabled) {
        return react.createElement(
          "span",
          {
            className: "cl-chip cl-chip-disabled",
            title: props.desc
          },
          react.createElement("span", { className: "cl-chip-name" }, props.name),
          react.createElement("span", { className: "cl-chip-soon" }, "\u5F85\u505A")
        );
      }
      return react.createElement(
        "button",
        {
          type: "button",
          className: "cl-chip" + (props.active ? " cl-chip-on" : ""),
          onClick: function() {
            props.onPick(props.id);
          }
        },
        react.createElement("span", { className: "cl-chip-name" }, props.name),
        props.active ? react.createElement("span", { className: "cl-chip-check" }, "\u2713") : null
      );
    }
    var pluginCtx = null;
    function SettingsPanel() {
      var ctx = pluginCtx;
      var skinState = react.useState(readSkin());
      var skin = skinState[0], setSkin = skinState[1];
      var themeSvc = null;
      try {
        themeSvc = ctx ? ctx.get("theme") : null;
      } catch (e) {
      }
      var initialTheme = "light";
      try {
        if (themeSvc && typeof themeSvc.getTheme === "function") {
          initialTheme = themeSvc.getTheme().active.colorScheme;
        }
      } catch (e) {
      }
      var themeState = react.useState(initialTheme);
      var theme = themeState[0], setTheme = themeState[1];
      var noticeState = react.useState(null);
      var notice = noticeState[0], setNotice = noticeState[1];
      var commitSkin = function(v) {
        setSkin(v);
        try {
          localStorage.setItem(KEY_SKIN, v);
        } catch (e) {
        }
        var def = v === "none" ? null : singleton.get(v);
        setNotice("\u5DF2\u5207\u6362\u5230\u300C" + (def ? def.name : "\u65E0\u76AE\u80A4") + "\u300D\uFF0C\u6B63\u5728\u5237\u65B0\u2026");
        setTimeout(function() {
          window.location.reload();
        }, 600);
      };
      var commitTheme = function(v) {
        var next = v ? "dark" : "light";
        setTheme(next);
        try {
          localStorage.setItem(KEY_THEME, next);
        } catch (e) {
        }
        var themeSvc2 = null;
        try {
          themeSvc2 = ctx ? ctx.get("theme") : null;
        } catch (e) {
        }
        if (themeSvc2 && typeof themeSvc2.setTheme === "function") {
          try {
            themeSvc2.setTheme(next);
          } catch (e) {
          }
        }
      };
      return react.createElement(
        "div",
        { className: "cl-settings" },
        react.createElement(
          "div",
          { className: "cl-settings-head" },
          react.createElement("div", { className: "cl-settings-title" }, "ChatLab \u76AE\u80A4"),
          react.createElement("div", { className: "cl-settings-sub" }, "\u53EF\u6269\u5C55\u804A\u5929\u76AE\u80A4\uFF1A\u98DE\u4E66\u9996\u53D1\uFF0C\u5176\u4F59\u5F85\u505A")
        ),
        notice ? react.createElement("div", { className: "cl-notice" }, notice) : null,
        react.createElement(
          "div",
          { className: "cl-chips" },
          react.createElement(SkinChip, { id: "none", name: "\u65E0\u76AE\u80A4", active: skin === "none", onPick: commitSkin }),
          singleton.list().map(function(s) {
            return react.createElement(SkinChip, {
              key: s.id,
              id: s.id,
              name: s.name,
              desc: s.desc,
              active: skin === s.id,
              disabled: !s.ready,
              onPick: commitSkin
            });
          })
        ),
        react.createElement(SwitchRow, {
          title: "\u6DF1\u8272\u6A21\u5F0F",
          desc: "\u8C03\u7528 DSH \u4E3B\u9898\u7CFB\u7EDF\uFF0C\u70ED\u5207\u6362",
          checked: theme === "dark",
          onChange: commitTheme
        })
      );
    }
    SettingsPanel.setCtx = function(ctx) {
      pluginCtx = ctx;
    };
    return SettingsPanel;
  }

  // packages/core/src/theme.js
  var STYLE_ID = "dsh-skin-chatlab-css";
  var UI_CSS = [
    ".cl-settings { display: flex; flex-direction: column; gap: 14px; max-width: 560px; }",
    ".cl-settings-head { display: flex; flex-direction: column; gap: 4px; margin-bottom: 4px; }",
    ".cl-settings-title { font-size: 16px; font-weight: 600; color: var(--dsw-alias-label-primary); }",
    ".cl-settings-sub { font-size: 12.5px; color: var(--dsw-alias-label-tertiary); }",
    ".cl-notice { padding: 8px 12px; border-radius: 8px; background: var(--dsw-alias-interactive-bg-hover-accent); color: var(--dsw-alias-brand-primary); font-size: 13px; }",
    ".cl-chips { display: flex; flex-wrap: wrap; gap: 8px; }",
    ".cl-chip { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 999px; background: var(--dsw-alias-bg-base); color: var(--dsw-alias-label-secondary); font-size: 13px; cursor: pointer; }",
    "button.cl-chip:hover { background: var(--dsw-alias-interactive-bg-hover); }",
    ".cl-chip-on { border-color: var(--dsw-alias-brand-primary); color: var(--dsw-alias-brand-primary); background: var(--dsw-alias-interactive-bg-hover-accent); }",
    ".cl-chip-check { font-size: 12px; }",
    ".cl-chip-disabled { opacity: .45; cursor: not-allowed; }",
    ".cl-chip-soon { font-size: 11px; color: var(--dsw-alias-label-tertiary); }",
    ".cl-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 12px 14px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 8px; cursor: pointer; }",
    ".cl-row-body { display: flex; flex-direction: column; gap: 3px; }",
    ".cl-row-title { font-size: 14px; font-weight: 500; color: var(--dsw-alias-label-primary); }",
    ".cl-row-desc { font-size: 12px; color: var(--dsw-alias-label-tertiary); }",
    ".cl-switch { position: relative; width: 40px; height: 22px; flex: none; }",
    ".cl-switch input { position: absolute; inset: 0; opacity: 0; margin: 0; cursor: pointer; }",
    ".cl-knob { position: absolute; inset: 0; border-radius: 11px; background: var(--dsw-alias-bg-layer-3); border: 1px solid var(--dsw-alias-border-l2); transition: background .15s ease; }",
    '.cl-knob::after { content: ""; position: absolute; top: 1px; left: 1px; width: 18px; height: 18px; border-radius: 50%; background: #FFFFFF; box-shadow: 0 1px 2px rgba(0,0,0,.2); transition: transform .15s ease; }',
    ".cl-switch.cl-on .cl-knob { background: var(--dsw-alias-brand-primary); border-color: var(--dsw-alias-brand-primary); }",
    ".cl-switch.cl-on .cl-knob::after { transform: translateX(18px); }"
  ].join("\n");
  var COMMON_CSS = [
    'html[data-chatlab-skin] { --dsw-font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue", "Microsoft YaHei", "Segoe UI", sans-serif; }',
    "html[data-chatlab-skin] .cl-avatar { flex: none; align-self: center; object-fit: cover; background: var(--dsw-alias-bg-layer-3); display: block; }",
    "html[data-chatlab-skin] .cl-avatar-initial { display: inline-flex; align-items: center; justify-content: center; color: #FFFFFF; font-size: 15px; font-weight: 600; }",
    "html[data-chatlab-skin] .cl-unread-dot { flex: none; width: 8px; height: 8px; margin-left: 2px; border-radius: 50%; background: var(--dsw-alias-state-error-primary); box-shadow: 0 0 0 2px var(--dsw-alias-bg-base); }"
  ].join("\n");
  function buildCss(skin, theme) {
    var blocks = [UI_CSS];
    if (skin === "none") return blocks.join("\n");
    var def = singleton.get(skin);
    if (!def) return blocks.join("\n");
    blocks.push(COMMON_CSS);
    if (def.css) blocks.push(def.css);
    return blocks.join("\n");
  }
  function makeRebuildCss() {
    var currentStyleEl = null;
    return function rebuildCss(skin, theme) {
      if (currentStyleEl && currentStyleEl.parentNode) currentStyleEl.parentNode.removeChild(currentStyleEl);
      var text = buildCss(skin, theme);
      if (!text) {
        currentStyleEl = null;
        return;
      }
      var style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = text;
      document.head.appendChild(style);
      currentStyleEl = style;
    };
  }

  // packages/core/src/utils.js
  function norm(text) {
    return String(text == null ? "" : text).replace(/\s+/g, " ").trim();
  }
  function hashHue(text) {
    var s = norm(text);
    var h = 0;
    for (var i = 0; i < s.length; i++) {
      h = h * 31 + s.charCodeAt(i) >>> 0;
    }
    return h % 360;
  }
  function resolveSidebarSeed(id, title, current, currentDisplay) {
    return id || (current && currentDisplay && currentDisplay === title ? current : null) || title || "dsh";
  }
  function assignRowIds(rows, current) {
    var claimed = false;
    var out = [];
    var i, row;
    for (i = 0; i < rows.length; i++) {
      row = rows[i];
      var rid = row._id || null;
      if (rid && current && rid === current) claimed = true;
      out.push({ _id: rid, title: row.title || "", selected: !!row.selected });
    }
    if (current && !claimed) {
      for (i = 0; i < out.length; i++) {
        if (!out[i]._id && out[i].selected) {
          out[i]._id = current;
          claimed = true;
          break;
        }
      }
    }
    return out;
  }
  function clipPreview(text) {
    var s = norm(text);
    if (s.length > 90) s = s.slice(0, 90) + "\u2026";
    return s;
  }
  function unreadDecision(readSeq, lastSeq, isActive, isCurrent) {
    if (isActive) return { unread: false, markReadTo: null };
    if (isCurrent) {
      var to = typeof lastSeq === "number" && lastSeq > readSeq ? lastSeq : null;
      return { unread: false, markReadTo: to };
    }
    var unread = typeof lastSeq === "number" && lastSeq > readSeq;
    return { unread, markReadTo: null };
  }
  function buildActiveSet(snapFull, runningOf) {
    var out = {};
    if (!snapFull || !snapFull.byId) return out;
    var direct = {};
    var ids = snapFull.ids || [];
    for (var i = 0; i < ids.length; i++) {
      var id = ids[i];
      var s = snapFull.byId[id];
      var r = runningOf ? runningOf(id) : !!(s && s.running);
      if (s && (r || s.pendingInteraction)) direct[id] = true;
    }
    for (var id2 in direct) {
      out[id2] = true;
      var p = snapFull.byId[id2];
      var anc = p ? p.parentId : null;
      var guard = 0;
      while (anc && !out[anc] && guard++ < 1e3) {
        out[anc] = true;
        var a = snapFull.byId[anc];
        anc = a ? a.parentId : null;
      }
    }
    return out;
  }
  function buildRunningSet(snapFull, runningOf) {
    var out = {};
    if (!snapFull || !snapFull.byId) return out;
    var direct = {};
    var ids = snapFull.ids || [];
    for (var i = 0; i < ids.length; i++) {
      var id = ids[i];
      var s = snapFull.byId[id];
      var r = runningOf ? runningOf(id) : !!(s && s.running);
      if (s && r) direct[id] = true;
    }
    for (var id2 in direct) {
      out[id2] = true;
      var p = snapFull.byId[id2];
      var anc = p ? p.parentId : null;
      var guard = 0;
      while (anc && !out[anc] && guard++ < 1e3) {
        out[anc] = true;
        var a = snapFull.byId[anc];
        anc = a ? a.parentId : null;
      }
    }
    return out;
  }

  // packages/core/src/avatar.js
  var AVATAR_BASE = "https://api.dicebear.com/9.x/avataaars/svg?radius=50&size=32&seed=";
  function avatarUrl(seed) {
    return AVATAR_BASE + encodeURIComponent(norm(seed) || "dsh");
  }
  function makeAvatar(seed, extraClass) {
    var s = norm(seed) || "dsh";
    var img = document.createElement("img");
    img.className = "cl-avatar" + (extraClass ? " " + extraClass : "");
    img.setAttribute("data-seed", s);
    img.alt = "";
    img.loading = "lazy";
    img.setAttribute("fetchpriority", "low");
    img.decoding = "async";
    img.style.backgroundColor = "hsl(" + hashHue(s) + ", 42%, 88%)";
    img.draggable = false;
    img.src = avatarUrl(s);
    img.onerror = function() {
      if (img._failed) return;
      img._failed = true;
      var span = document.createElement("span");
      span.className = img.className + " cl-avatar-initial";
      span.setAttribute("data-seed", s);
      span.style.background = "hsl(" + hashHue(s) + ", 60%, 52%)";
      span.textContent = (s.charAt(0) || "?").toUpperCase();
      if (img.parentNode) img.parentNode.replaceChild(span, img);
    };
    return img;
  }

  // packages/core/src/session.js
  function listSnapshot(ctx) {
    try {
      var list = ctx.sessions && ctx.sessions.list;
      if (!list || typeof list.getSnapshot !== "function") return null;
      var snap = list.getSnapshot();
      if (!snap || !Array.isArray(snap.ids)) return null;
      return snap;
    } catch (e) {
      return null;
    }
  }
  function readSeqs() {
    try {
      var raw = localStorage.getItem(KEY_READ);
      if (!raw) return {};
      var v = JSON.parse(raw);
      return v && typeof v === "object" && !Array.isArray(v) ? v : {};
    } catch (e) {
      return {};
    }
  }
  function markRead(id, seq) {
    if (typeof seq !== "number" || seq <= 0) return;
    var m = readSeqs();
    if ((m[id] || 0) >= seq) return;
    m[id] = seq;
    try {
      localStorage.setItem(KEY_READ, JSON.stringify(m));
    } catch (e) {
    }
  }

  // packages/core/src/dom.js
  function titleOf(row) {
    var t = row.querySelector('[class*="title"]');
    return t ? t.textContent : row.textContent;
  }
  function rowId(row, idByTitle) {
    var id = row.getAttribute("data-cl-session-id") || row.getAttribute("data-session-id") || row.getAttribute("data-id") || row.getAttribute("data-key");
    if (id) return id;
    return idByTitle[norm(titleOf(row))];
  }
  function addPreview(row, text) {
    var clipped = clipPreview(text);
    if (!clipped) return;
    var existing = row.querySelector(".cl-preview");
    if (existing) {
      if (existing.textContent !== clipped) existing.textContent = clipped;
      return;
    }
    var preview = document.createElement("div");
    preview.className = "cl-preview";
    preview.textContent = clipped;
    row.appendChild(preview);
  }
  function applyUnread(row, id, lastSeq, current, active) {
    var m = readSeqs();
    var readSeq = id in m ? m[id] : 0;
    var isActive = active && active[String(id)];
    var isCurrent = id === current;
    var d = unreadDecision(readSeq, lastSeq, isActive, isCurrent);
    if (d.markReadTo !== null && d.markReadTo !== void 0) markRead(id, d.markReadTo);
    row.classList.toggle("cl-unread", d.unread);
    var badge = row.querySelector(".cl-unread-dot");
    if (d.unread && !badge) {
      badge = document.createElement("span");
      badge.className = "cl-unread-dot";
      row.appendChild(badge);
    } else if (!d.unread && badge) {
      badge.remove();
    }
  }

  // packages/core/src/avatarStore.js
  var MAX_ENTRIES = 200;
  function readAvatarMap() {
    try {
      var raw = localStorage.getItem(KEY_AVATAR_MAP);
      if (!raw) return {};
      var v = JSON.parse(raw);
      return v && typeof v === "object" && !Array.isArray(v) ? v : {};
    } catch (e) {
      return {};
    }
  }
  function avatarUrlForId(id) {
    if (!id) return null;
    var map = readAvatarMap();
    var e = map[id];
    return e && e.url ? e.url : null;
  }
  function rememberAvatar(id, seed, url) {
    if (!id) return null;
    var finalSeed = seed || id;
    var finalUrl = url || "https://api.dicebear.com/9.x/avataaars/svg?radius=50&size=32&seed=" + encodeURIComponent(finalSeed);
    var map = readAvatarMap();
    map[id] = { seed: finalSeed, url: finalUrl, at: Date.now() };
    var keys = Object.keys(map);
    if (keys.length > MAX_ENTRIES) {
      keys.sort(function(a, b) {
        return (map[a] && map[a].at || 0) - (map[b] && map[b].at || 0);
      });
      var drop = keys.length - MAX_ENTRIES;
      for (var i = 0; i < drop; i++) delete map[keys[i]];
    }
    try {
      localStorage.setItem(KEY_AVATAR_MAP, JSON.stringify(map));
    } catch (e) {
    }
    return finalUrl;
  }
  function exposeAvatarMap() {
    try {
      var map = readAvatarMap();
      window.__chatlabAvatarMap = map;
    } catch (e) {
    }
  }

  // packages/core/src/decorators.js
  function decorateBrand() {
    var brand = document.querySelector('[class*="brand"]');
    if (!brand) return;
    var existing = brand.querySelector(".cl-brand-skin");
    var skin = readSkin();
    var def = skin === "none" ? null : singleton.get(skin);
    var label = def ? def.name : "";
    if (!label) {
      if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
      return;
    }
    if (existing) {
      if (existing.textContent !== label) existing.textContent = label;
      return;
    }
    var badge = document.createElement("span");
    badge.className = "cl-brand-skin";
    badge.textContent = label;
    brand.appendChild(badge);
  }
  function decorateSidebar(snap, idByTitle, active) {
    var current = snap && snap.current;
    var currentDisplay = current ? (snap.byId && snap.byId[current] || {}).displayTitle : null;
    var rows = document.querySelectorAll('[class*="sessionRow"]');
    var descs = [];
    var i;
    for (i = 0; i < rows.length; i++) {
      var row = rows[i];
      descs.push({
        _id: rowId(row, idByTitle),
        title: norm(titleOf(row)),
        selected: current && isCurrentRow(row, current, idByTitle)
      });
    }
    var assigned = assignRowIds(descs, current);
    for (i = 0; i < rows.length; i++) {
      var r = rows[i];
      var info = assigned[i];
      var id = info._id;
      var av = r.querySelector(".cl-avatar");
      if (id) r.setAttribute("data-cl-session-id", id);
      var seed = id ? id : resolveSidebarSeed(null, info.title, current, currentDisplay);
      var src = id ? rememberAvatar(id, id, null) : avatarUrl(seed);
      if (av) {
        if (av.getAttribute("data-seed") !== seed) {
          av.setAttribute("data-seed", seed);
          av.src = src;
        }
      } else {
        var fresh = makeAvatar(seed);
        fresh.src = src;
        r.appendChild(fresh);
      }
      applyAvatarStatus(r, active[String(id)], snap, id);
    }
    exposeAvatarMap();
  }
  function applyAvatarStatus(row, running, snap, id) {
    var dot = row.querySelector(".cl-running-dot");
    if (id && snap && snap.byId) {
      var rec = window.__chatlabDebug = window.__chatlabDebug || {};
      var s = snap.byId[id];
      rec[id] = { running: !!(s && s.running), pending: s && s.pendingInteraction || null, dot: running };
    }
    if (running && !dot) {
      dot = document.createElement("span");
      dot.className = "cl-running-dot";
      row.appendChild(dot);
    } else if (!running && dot) {
      dot.remove();
    }
  }
  function isCurrentRow(row, current, idByTitle) {
    var stored = row.getAttribute("data-cl-session-id");
    if (stored) return stored === current;
    if (idByTitle[norm(titleOf(row))] === current) return true;
    return /(^|[\s_])selected([\s_]|$)/.test(row.className || "");
  }
  function decorateProjects() {
    var rows = document.querySelectorAll('[class*="projectRow"]');
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var folderSlot = row.querySelector('[class*="folder"]');
      if (!folderSlot) continue;
      if (folderSlot.querySelector(".cl-project-icon")) continue;
      var title = row.querySelector('[class*="projectText"] [class*="title"], [class*="projectText"]');
      var text = norm(title ? title.textContent : row.textContent);
      var initial = (text.charAt(0) || "?").toUpperCase();
      var hue = hashHue(text);
      var block = document.createElement("span");
      block.className = "cl-project-icon";
      block.textContent = initial;
      block.style.background = "hsl(" + hue + ", 70%, 55%)";
      folderSlot.appendChild(block);
    }
  }
  function decorateHeader(ctx, snap) {
    var cluster = document.querySelector('[class*="titleCluster"]');
    if (!cluster) return;
    var current = snap && snap.current;
    var summary = current ? snap.byId && snap.byId[current] : null;
    var seed = current || summary && summary.displayTitle || "dsh";
    var src;
    if (current) {
      src = avatarUrlForId(current) || rememberAvatar(current, current, null);
    } else {
      src = avatarUrl(seed);
    }
    var existing = cluster.querySelector(".cl-avatar");
    if (existing) {
      if (existing.getAttribute("data-seed") === seed) return;
      existing.setAttribute("data-seed", seed);
      existing.src = src;
      return;
    }
    var fresh = makeAvatar(seed, "cl-header-avatar");
    fresh.src = src;
    cluster.appendChild(fresh);
  }
  function applyPreviews(ctx, snap, idByTitle, active) {
    var connection = ctx.connection;
    if (!connection || !connection.rpc || typeof connection.rpc.call !== "function") return;
    var rows = document.querySelectorAll('[class*="sessionRow"]');
    var need = [];
    for (var i = 0; i < rows.length; i++) {
      var id = rowId(rows[i], idByTitle);
      if (id) need.push({ row: rows[i], id });
    }
    if (!need.length) return;
    var ids = need.map(function(x) {
      return x.id;
    });
    var current = snap && snap.current;
    connection.rpc.call("/dsh-skin-chatlab", "previews", { ids }).then(function(res) {
      if (!res || !res.ok) return;
      var map = res.value || {};
      for (var k = 0; k < need.length; k++) {
        var info = map[need[k].id] || { text: "", lastSeq: -1 };
        if (info.text) addPreview(need[k].row, info.text);
        applyUnread(need[k].row, need[k].id, info.lastSeq, current, active);
      }
    }).catch(function() {
    });
  }
  function decorateTurnStatus() {
    var status = document.querySelector('[class*="turnStatus"]:not([class*="turnStatusClock"])');
    if (!status) return;
    if (status.querySelector(".cl-turn-typing")) return;
    var wrap = document.createElement("span");
    wrap.className = "cl-turn-typing";
    wrap.innerHTML = '<span>\u6B63\u5728\u8F93\u5165</span><span class="cl-typing-dot"></span><span class="cl-typing-dot"></span><span class="cl-typing-dot"></span>';
    var clock = status.querySelector('[class*="turnStatusClock"]');
    if (clock) status.insertBefore(wrap, clock);
    else status.appendChild(wrap);
  }
  function refresh(ctx) {
    var snap = listSnapshot(ctx);
    var idByTitle = {};
    if (snap && snap.byId) {
      for (var i = 0; i < snap.ids.length; i++) {
        var s = snap.byId[snap.ids[i]];
        if (s && s.displayTitle) idByTitle[norm(s.displayTitle)] = s.id;
      }
    }
    var runningOf = null;
    if (ctx.sessions && typeof ctx.sessions.get === "function") {
      runningOf = function(id) {
        var sess = ctx.sessions.get(id);
        if (sess) return !!sess.running;
        var s2 = snap && snap.byId ? snap.byId[id] : null;
        return !!(s2 && s2.running);
      };
    }
    var active = buildActiveSet(snap, runningOf);
    var running = buildRunningSet(snap, runningOf);
    decorateBrand();
    decorateSidebar(snap, idByTitle, active);
    decorateProjects();
    decorateHeader(ctx, snap);
    decorateTurnStatus();
    applyPreviews(ctx, snap, idByTitle, running);
  }

  // packages/core/src/index.js
  window.__ModuleLoader__.load({
    id: "@liyuk/dsh-skin-chatlab-core",
    factory: function(require2) {
      var react = require2("react");
      var name = "@liyuk/dsh-skin-chatlab-core";
      var inject = ["slots", "sessions", "connection"];
      var rebuildCss = makeRebuildCss();
      var SettingsPanel = makeSettingsPanel(react);
      function apply(ctx) {
        ctx.provide("chatlab", singleton);
        var skin = readSkin();
        SettingsPanel.setCtx(ctx);
        ctx.slots.inject("settings.section", function() {
          return ctx.slots.register(
            { name: "settings.section", id: "chatlab", order: 40, label: "ChatLab \u76AE\u80A4" },
            SettingsPanel
          );
        });
        ctx.effect(function() {
          return function() {
            var s = document.getElementById(STYLE_ID);
            if (s && s.parentNode) s.parentNode.removeChild(s);
            var nodes = document.querySelectorAll(".cl-avatar, .cl-preview, .cl-unread-dot, .cl-running-dot, .cl-project-icon, .cl-brand-skin, .cl-typing, .cl-turn-typing");
            for (var i = 0; i < nodes.length; i++) {
              var n = nodes[i];
              if (n.parentNode) n.parentNode.removeChild(n);
            }
            var unread = document.querySelectorAll(".cl-unread");
            for (var j = 0; j < unread.length; j++) unread[j].classList.remove("cl-unread");
            document.documentElement.removeAttribute("data-chatlab-skin");
            document.documentElement.removeAttribute("data-chatlab-theme");
          };
        });
        if (skin === "none") {
          applyHtml("none", "light");
          rebuildCss("none", "light");
          return;
        }
        applyHtml(skin, "light");
        rebuildCss(skin, "light");
        var refreshTimer = null;
        function scheduleRefresh() {
          if (refreshTimer) return;
          refreshTimer = setTimeout(function() {
            refreshTimer = null;
            var cur = readSkin();
            rebuildCss(cur, "light");
            refresh(ctx);
          }, 300);
        }
        var unsubscribeRegistry = singleton.subscribe(function() {
          scheduleRefresh();
        });
        refresh(ctx);
        var unsubscribe = null;
        if (ctx.sessions && ctx.sessions.list && typeof ctx.sessions.list.subscribe === "function") {
          try {
            unsubscribe = ctx.sessions.list.subscribe(scheduleRefresh);
          } catch (e) {
          }
        }
        var fallback = setInterval(function() {
          var rows = document.querySelectorAll('[class*="sessionRow"]');
          if (rows.length === 0) return;
          refresh(ctx);
        }, 1500);
        ctx.effect(function() {
          return function() {
            if (unsubscribe) unsubscribe();
            unsubscribeRegistry();
            clearInterval(fallback);
            if (refreshTimer) clearTimeout(refreshTimer);
          };
        });
      }
      return { apply, inject, name };
    }
  });
})();
