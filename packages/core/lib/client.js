(() => {
  // packages/core/src/registry.js
  function createSkinRegistry() {
    const skins = [];
    const byId = {};
    const listeners = [];
    function notify(def) {
      for (let i = 0; i < listeners.length; i++) {
        try {
          listeners[i](def);
        } catch (e) {
        }
      }
    }
    function registerSkin(def) {
      if (!def || typeof def.id !== "string" || !def.id) return;
      const normalized = {
        id: def.id,
        name: def.name || def.id,
        desc: def.desc || "",
        ready: def.ready !== false,
        // 缺省 true
        tokens: def.tokens || { light: {}, dark: {} },
        css: def.css || "",
        brand: def.brand || null
      };
      var exists = !!byId[def.id];
      byId[def.id] = normalized;
      if (exists) {
        for (var i = 0; i < skins.length; i++) {
          if (skins[i].id === def.id) {
            skins[i] = normalized;
            break;
          }
        }
      } else {
        skins.push(normalized);
      }
      notify(normalized);
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
  var REGISTRY_KEY = "__dshSkinChatlabRegistry";
  var root = typeof globalThis !== "undefined" ? globalThis : {};
  var singleton = root[REGISTRY_KEY] || (root[REGISTRY_KEY] = createSkinRegistry());

  // packages/core/src/prefs.js
  var KEY_SKIN = "dsh-skin-chatlab.skin";
  var KEY_THEME = "dsh-skin-chatlab.theme";
  var KEY_READ = "dsh-skin-chatlab.read";
  var KEY_AVATAR_MAP = "dsh-skin-chatlab.avatar";
  function readSkin() {
    try {
      var v = localStorage.getItem(KEY_SKIN);
      if (v === "none") return "none";
      var selected = v && singleton.get(v);
      if (selected && selected.ready) return v;
      return firstReadySkin();
    } catch (e) {
      return firstReadySkin();
    }
  }
  function firstReadySkin() {
    var skins = singleton.list();
    for (var i = 0; i < skins.length; i++) {
      if (skins[i].ready) return skins[i].id;
    }
    return "none";
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
      var registryState = react.useState(0);
      var registryVersion = registryState[0], setRegistryVersion = registryState[1];
      react.useEffect(function() {
        return singleton.subscribe(function() {
          setSkin(readSkin());
          setRegistryVersion(function(v) {
            return v + 1;
          });
        });
      }, []);
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
    var light = tokenCss(def.tokens && def.tokens.light);
    if (light) blocks.push("html[data-chatlab-skin] { " + light + " }");
    var dark = tokenCss(def.tokens && def.tokens.dark);
    if (dark) blocks.push("html[data-chatlab-skin] body[data-ds-dark-theme] { " + dark + " }");
    if (def.css) blocks.push(def.css);
    return blocks.join("\n");
  }
  function tokenCss(tokens) {
    if (!tokens || typeof tokens !== "object") return "";
    var keys = Object.keys(tokens);
    var parts = [];
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var value = tokens[key];
      if (typeof value === "string" && value) parts.push("--dsw-alias-" + key + ": " + value + ";");
    }
    return parts.join(" ");
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
  function buildIdByTitle(snap) {
    var out = {};
    var ambiguous = {};
    if (!snap || !snap.byId || !Array.isArray(snap.ids)) return out;
    for (var i = 0; i < snap.ids.length; i++) {
      var id = snap.ids[i];
      var s = snap.byId[id];
      var title = norm(s && s.displayTitle);
      if (!title) continue;
      if (out[title] && out[title] !== id) {
        delete out[title];
        ambiguous[title] = true;
      } else if (!ambiguous[title]) {
        out[title] = id;
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
  var opaqueSeeds = {};
  function opaqueSeed(seed) {
    var key = norm(seed) || "dsh";
    if (opaqueSeeds[key]) return opaqueSeeds[key];
    var token;
    try {
      var bytes = new Uint32Array(2);
      crypto.getRandomValues(bytes);
      token = bytes[0].toString(36) + bytes[1].toString(36);
    } catch (e) {
      token = hashHue(key).toString(36) + Math.random().toString(36).slice(2);
    }
    opaqueSeeds[key] = token;
    return token;
  }
  function avatarUrl(seed) {
    return AVATAR_BASE + encodeURIComponent(opaqueSeed(seed));
  }
  function installAvatarFallback(img, seed) {
    img.onerror = function() {
      if (img._failed) return;
      img._failed = true;
      var span = document.createElement("span");
      span.className = img.className + " cl-avatar-initial";
      span.setAttribute("data-seed", seed);
      span.style.background = "hsl(" + hashHue(seed) + ", 60%, 52%)";
      span.textContent = (seed.charAt(0) || "?").toUpperCase();
      if (img.parentNode) img.parentNode.replaceChild(span, img);
    };
  }
  function configureAvatarImage(img, seed, src, extraClass) {
    img.className = "cl-avatar" + (extraClass ? " " + extraClass : "");
    img.setAttribute("data-seed", seed);
    img.alt = "";
    img.loading = "lazy";
    img.setAttribute("fetchpriority", "low");
    img.decoding = "async";
    img.style.backgroundColor = "hsl(" + hashHue(seed) + ", 42%, 88%)";
    img.draggable = false;
    img._failed = false;
    installAvatarFallback(img, seed);
    if (img.getAttribute("src") !== src) img.src = src;
    return img;
  }
  function makeAvatar(seed, extraClass) {
    var s = norm(seed) || "dsh";
    var img = document.createElement("img");
    return configureAvatarImage(img, s, avatarUrl(s), extraClass);
  }
  function updateAvatar(existing, seed, src, extraClass) {
    var s = norm(seed) || "dsh";
    if (existing && existing.tagName === "IMG") {
      return configureAvatarImage(existing, s, src, extraClass);
    }
    if (existing && existing.classList.contains("cl-avatar-initial") && existing.getAttribute("data-seed") === s) {
      return existing;
    }
    var fresh = makeAvatar(s, extraClass);
    if (fresh.getAttribute("src") !== src) fresh.src = src;
    if (existing && existing.parentNode) existing.parentNode.replaceChild(fresh, existing);
    return fresh;
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
      var value = JSON.parse(raw);
      return value && typeof value === "object" && !Array.isArray(value) ? value : {};
    } catch (e) {
      return {};
    }
  }
  function writeSeqs(seqs) {
    try {
      localStorage.setItem(KEY_READ, JSON.stringify(seqs));
    } catch (e) {
    }
  }
  function advanceRead(seqs, id, seq) {
    if (!seqs || typeof seq !== "number" || seq <= 0) return false;
    if ((seqs[id] || 0) >= seq) return false;
    seqs[id] = seq;
    return true;
  }
  function markRead(id, seq) {
    var seqs = readSeqs();
    if (advanceRead(seqs, id, seq)) writeSeqs(seqs);
  }

  // packages/core/src/dom.js
  function titleOf(row) {
    var t = row.querySelector('[class*="title"]');
    return t ? t.textContent : row.textContent;
  }
  function isSelectedRow(row) {
    return /(^|[\s_])selected([\s_]|$)/.test(row.className || "");
  }
  function rowId(row, idByTitle, current) {
    var id = row.getAttribute("data-session-id") || row.getAttribute("data-id") || row.getAttribute("data-key");
    if (id) return id;
    id = idByTitle[norm(titleOf(row))];
    if (id) return id;
    if (!isSelectedRow(row)) return null;
    var bound = row.getAttribute("data-cl-session-id");
    var boundTitle = row.getAttribute("data-cl-session-title");
    return bound && bound === current && boundTitle === norm(titleOf(row)) ? bound : null;
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
  function clearPreview(row) {
    var preview = row.querySelector(".cl-preview");
    if (preview) preview.remove();
  }
  function clearUnread(row) {
    row.classList.remove("cl-unread");
    var badge = row.querySelector(".cl-unread-dot");
    if (badge) badge.remove();
  }
  function applyUnread(row, id, lastSeq, current, active, readMap) {
    var m = readMap || readSeqs();
    var readSeq = id in m ? m[id] : 0;
    var isActive = active && active[String(id)];
    var isCurrent = id === current;
    var d = unreadDecision(readSeq, lastSeq, isActive, isCurrent);
    var changed = false;
    if (d.markReadTo !== null && d.markReadTo !== void 0) {
      if (readMap) changed = advanceRead(m, id, d.markReadTo);
      else markRead(id, d.markReadTo);
    }
    row.classList.toggle("cl-unread", d.unread);
    var badge = row.querySelector(".cl-unread-dot");
    if (d.unread && !badge) {
      badge = document.createElement("span");
      badge.className = "cl-unread-dot";
      row.appendChild(badge);
    } else if (!d.unread && badge) {
      badge.remove();
    }
    return changed;
  }

  // packages/core/src/avatarStore.js
  var MAX_ENTRIES = 200;
  var avatarMap = null;
  var avatarUse = {};
  var avatarDirty = false;
  function touchAvatar(id) {
    avatarUse[id] = Date.now();
  }
  function loadAvatarMap() {
    if (avatarMap) return avatarMap;
    try {
      var raw = localStorage.getItem(KEY_AVATAR_MAP);
      var value = raw ? JSON.parse(raw) : {};
      avatarMap = value && typeof value === "object" && !Array.isArray(value) ? value : {};
    } catch (e) {
      avatarMap = {};
    }
    return avatarMap;
  }
  function isLegacyUrl(url, seed) {
    if (typeof url !== "string" || !url) return true;
    return url.indexOf("seed=" + encodeURIComponent(seed)) >= 0;
  }
  function persistAvatarMap(map) {
    try {
      localStorage.setItem(KEY_AVATAR_MAP, JSON.stringify(map));
      avatarDirty = false;
      return true;
    } catch (e) {
      return false;
    }
  }
  function flushAvatarMap() {
    if (!avatarDirty || !avatarMap) return false;
    return persistAvatarMap(avatarMap);
  }
  function avatarUrlForId(id) {
    if (!id) return null;
    var entry = loadAvatarMap()[id];
    if (!entry || !entry.url || isLegacyUrl(entry.url, entry.seed || id)) return null;
    touchAvatar(id);
    return entry.url;
  }
  function rememberAvatar(id, seed, url, deferPersist) {
    if (!id) return null;
    var finalSeed = seed || id;
    var map = loadAvatarMap();
    var previous = map[id];
    if (previous && previous.seed === finalSeed && !isLegacyUrl(previous.url, finalSeed)) {
      touchAvatar(id);
      return previous.url;
    }
    var finalUrl = url || avatarUrl(finalSeed);
    map[id] = { seed: finalSeed, url: finalUrl, at: Date.now() };
    avatarDirty = true;
    touchAvatar(id);
    var keys = Object.keys(map);
    if (keys.length > MAX_ENTRIES) {
      keys.sort(function(a, b) {
        var aUsed = avatarUse[a] || (map[a] && map[a].at || 0);
        var bUsed = avatarUse[b] || (map[b] && map[b].at || 0);
        return aUsed - bUsed;
      });
      var drop = keys.length - MAX_ENTRIES;
      for (var i = 0; i < drop; i++) {
        delete avatarUse[keys[i]];
        delete map[keys[i]];
        avatarDirty = true;
      }
    }
    if (!deferPersist) persistAvatarMap(map);
    return finalUrl;
  }
  function exposeAvatarMap() {
    try {
      window.__chatlabAvatarMap = loadAvatarMap();
    } catch (e) {
    }
  }

  // packages/core/src/decorators.js
  function appendBrandMark(container, svg) {
    if (!svg) return;
    var mark = document.createElement("span");
    mark.className = "cl-brand-mark";
    mark.setAttribute("aria-hidden", "true");
    var image = document.createElement("img");
    image.className = "cl-brand-mark-image";
    image.setAttribute("alt", "");
    image.setAttribute("aria-hidden", "true");
    image.setAttribute("draggable", "false");
    image.setAttribute("src", "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg));
    mark.appendChild(image);
    container.appendChild(mark);
  }
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
      existing.textContent = "";
      appendBrandMark(existing, def.brand && typeof def.brand.svg === "string" ? def.brand.svg : "");
      var existingLabel = document.createElement("span");
      existingLabel.className = "cl-brand-label";
      existingLabel.textContent = label;
      existing.appendChild(existingLabel);
      existing.setAttribute("aria-label", label);
      existing.setAttribute("title", label);
      return;
    }
    var badge = document.createElement("span");
    badge.className = "cl-brand-skin";
    badge.setAttribute("aria-label", label);
    badge.setAttribute("title", label);
    if (def.brand && typeof def.brand.svg === "string" && def.brand.svg) {
      appendBrandMark(badge, def.brand.svg);
    }
    var wordmark = document.createElement("span");
    wordmark.className = "cl-brand-label";
    wordmark.textContent = label;
    badge.appendChild(wordmark);
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
        _id: rowId(row, idByTitle, current),
        title: norm(titleOf(row)),
        selected: isSelectedRow(row)
      });
    }
    var assigned = assignRowIds(descs, current);
    for (i = 0; i < rows.length; i++) {
      var r = rows[i];
      var info = assigned[i];
      var id = info._id;
      var previousId = r.getAttribute("data-cl-session-id");
      if (id && previousId !== id) clearRowIdentityState(r);
      if (id) {
        r.setAttribute("data-cl-session-id", id);
        r.setAttribute("data-cl-session-title", info.title);
      } else {
        clearRowIdentityState(r);
        r.removeAttribute("data-cl-session-id");
        r.removeAttribute("data-cl-session-title");
      }
      var av = r.querySelector(".cl-avatar");
      var seed = id ? id : resolveSidebarSeed(null, info.title, current, currentDisplay);
      var src = id ? rememberAvatar(id, id, null, true) : avatarUrl(seed);
      var nextAvatar = updateAvatar(av, seed, src);
      if (!av) {
        r.appendChild(nextAvatar);
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
  function clearRowIdentityState(row) {
    clearPreview(row);
    clearUnread(row);
    var dot = row.querySelector(".cl-running-dot");
    if (dot) dot.remove();
  }
  function decorateProjects() {
    var rows = document.querySelectorAll('[class*="projectRow"]');
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var folderSlot = row.querySelector('[class*="folder"]');
      if (!folderSlot) continue;
      var title = row.querySelector('[class*="projectText"] [class*="title"], [class*="projectText"]');
      var text = norm(title ? title.textContent : row.textContent);
      var initial = (text.charAt(0) || "?").toUpperCase();
      var hue = hashHue(text);
      var block = folderSlot.querySelector(".cl-project-icon");
      if (!block) {
        block = document.createElement("span");
        block.className = "cl-project-icon";
        folderSlot.appendChild(block);
      }
      block.textContent = initial;
      block.style.background = "hsl(" + hue + ", 70%, 55%)";
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
    var nextAvatar = updateAvatar(existing, seed, src, "cl-header-avatar");
    if (!existing) {
      cluster.appendChild(nextAvatar);
    }
  }
  var previewStates = /* @__PURE__ */ new WeakMap();
  var PREVIEW_TIMEOUT_MS = 8e3;
  function previewStateFor(ctx) {
    var state = previewStates.get(ctx);
    if (!state) {
      state = { generation: 0, inFlight: false, queued: null, disposed: false, connection: null, timeout: null };
      previewStates.set(ctx, state);
    }
    return state;
  }
  function rowStillMatchesPreview(ctx, item, latest, latestIdByTitle) {
    if (item.row.isConnected === false) return false;
    latest = latest || listSnapshot(ctx);
    if (!latest) return false;
    latestIdByTitle = latestIdByTitle || buildIdByTitle(latest);
    if (isSelectedRow(item.row) && latest.current !== item.current) return false;
    if (item.row.getAttribute("data-cl-session-id") !== item.id) return false;
    if (item.row.getAttribute("data-cl-session-title") !== norm(titleOf(item.row))) return false;
    if (item.row.querySelector('[class*="title"]') !== item.titleNode) return false;
    return rowId(item.row, latestIdByTitle, latest.current) === item.id;
  }
  function finishPreviewRequest(ctx, state) {
    state.inFlight = false;
    var queued = state.queued;
    state.queued = null;
    if (queued && !state.disposed) startPreviewRequest(ctx, state, queued);
  }
  function startPreviewRequest(ctx, state, request) {
    state.inFlight = true;
    var settled = false;
    var timeout = setTimeout(function() {
      if (settled) return;
      request.expired = true;
      settled = true;
      if (state.timeout === timeout) state.timeout = null;
      finishPreviewRequest(ctx, state);
    }, PREVIEW_TIMEOUT_MS);
    state.timeout = timeout;
    function settle() {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      if (state.timeout === timeout) state.timeout = null;
      finishPreviewRequest(ctx, state);
    }
    var promise;
    try {
      promise = request.connection.rpc.call("/dsh-skin-chatlab", "previews", { ids: request.ids });
    } catch (e) {
      settle();
      return;
    }
    Promise.resolve(promise).then(function(res) {
      if (request.expired) return;
      if (state.disposed || request.generation !== state.generation || state.connection !== request.connection) {
        settle();
        return;
      }
      try {
        if (!res || !res.ok) return;
        var map = res.value || {};
        var latest = listSnapshot(ctx);
        var latestIdByTitle = buildIdByTitle(latest);
        var readMap = readSeqs();
        var readChanged = false;
        for (var i = 0; i < request.items.length; i++) {
          var item = request.items[i];
          if (!rowStillMatchesPreview(ctx, item, latest, latestIdByTitle)) continue;
          if (!Object.prototype.hasOwnProperty.call(map, item.id)) continue;
          var info = map[item.id];
          if (info && info.unavailable) continue;
          if (!info) continue;
          if (info.text) addPreview(item.row, info.text);
          else clearPreview(item.row);
          if (applyUnread(item.row, item.id, info.lastSeq, request.current, request.active, readMap)) {
            readChanged = true;
          }
        }
        if (readChanged) writeSeqs(readMap);
      } finally {
        settle();
      }
    }).catch(function() {
      settle();
    });
  }
  function disposePreviews(ctx) {
    var state = previewStates.get(ctx);
    if (!state) return;
    state.disposed = true;
    state.generation += 1;
    state.queued = null;
    state.inFlight = false;
    if (state.timeout) clearTimeout(state.timeout);
    state.timeout = null;
    previewStates.delete(ctx);
  }
  function applyPreviews(ctx, snap, idByTitle, active) {
    var state = previewStateFor(ctx);
    state.disposed = false;
    var connection = ctx.connection;
    state.connection = connection;
    if (!connection || !connection.rpc || typeof connection.rpc.call !== "function") return;
    var current = snap && snap.current;
    var rows = document.querySelectorAll('[class*="sessionRow"]');
    var items = [];
    for (var i = 0; i < rows.length; i++) {
      var id = rowId(rows[i], idByTitle, current);
      if (id) {
        items.push({
          row: rows[i],
          id,
          idByTitle,
          current,
          titleNode: rows[i].querySelector('[class*="title"]')
        });
      }
    }
    if (!items.length) return;
    var request = {
      generation: state.generation,
      connection,
      ids: items.map(function(item) {
        return item.id;
      }),
      items,
      current,
      active
    };
    if (state.inFlight) {
      state.queued = request;
      return;
    }
    startPreviewRequest(ctx, state, request);
  }
  function decorateTurnStatus() {
    var status = document.querySelector('[class*="turnStatus"]:not([class*="turnStatusClock"])');
    if (!status) return;
    if (status.querySelector(".cl-turn-typing")) return;
    var wrap = document.createElement("span");
    wrap.className = "cl-turn-typing";
    wrap.innerHTML = '<span>\u6B63\u5728\u8F93\u5165</span><span class="cl-typing-dot"></span><span class="cl-typing-dot"></span><span class="cl-typing-dot"></span>';
    status.appendChild(wrap);
  }
  function refresh(ctx) {
    var snap = listSnapshot(ctx);
    var idByTitle = buildIdByTitle(snap);
    var runningOf = null;
    if (ctx.sessions && typeof ctx.sessions.get === "function") {
      runningOf = function(id) {
        var sess = ctx.sessions.get(id);
        if (sess) return !!sess.running;
        var s = snap && snap.byId ? snap.byId[id] : null;
        return !!(s && s.running);
      };
    }
    var active = buildActiveSet(snap, runningOf);
    var running = buildRunningSet(snap, runningOf);
    decorateBrand();
    decorateSidebar(snap, idByTitle, active);
    decorateProjects();
    decorateHeader(ctx, snap);
    flushAvatarMap();
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
        SettingsPanel.setCtx(ctx);
        ctx.slots.inject("settings.section", function() {
          return ctx.slots.register(
            { name: "settings.section", id: "chatlab", order: 40, label: "ChatLab \u76AE\u80A4" },
            SettingsPanel
          );
        });
        function clearDecorations(removeStyle) {
          disposePreviews(ctx);
          if (removeStyle) {
            var s = document.getElementById(STYLE_ID);
            if (s && s.parentNode) s.parentNode.removeChild(s);
          }
          var nodes = document.querySelectorAll(".cl-avatar, .cl-preview, .cl-unread-dot, .cl-running-dot, .cl-project-icon, .cl-brand-skin, .cl-typing, .cl-turn-typing");
          for (var i = 0; i < nodes.length; i++) {
            var n = nodes[i];
            if (n.parentNode) n.parentNode.removeChild(n);
          }
          var unread = document.querySelectorAll(".cl-unread");
          for (var j = 0; j < unread.length; j++) unread[j].classList.remove("cl-unread");
          var rows = document.querySelectorAll("[data-cl-session-id], [data-cl-session-title]");
          for (var k = 0; k < rows.length; k++) {
            rows[k].removeAttribute("data-cl-session-id");
            rows[k].removeAttribute("data-cl-session-title");
          }
          document.documentElement.removeAttribute("data-chatlab-skin");
          document.documentElement.removeAttribute("data-chatlab-theme");
        }
        ctx.effect(function() {
          return function() {
            clearDecorations(true);
          };
        });
        var appliedSkin = null;
        function syncSkin(force) {
          var skin = readSkin();
          if (force || skin !== appliedSkin) {
            var wasEnabled = appliedSkin && appliedSkin !== "none";
            applyHtml(skin, "light");
            rebuildCss(skin, "light");
            appliedSkin = skin;
            if (wasEnabled && skin === "none") clearDecorations(false);
          }
          return skin !== "none";
        }
        function refreshIfEnabled(forceSkinSync2) {
          if (!syncSkin(forceSkinSync2)) return;
          refresh(ctx);
        }
        var refreshTimer = null;
        var forceSkinSync = false;
        function scheduleRefresh(force) {
          if (force) forceSkinSync = true;
          if (refreshTimer) return;
          refreshTimer = setTimeout(function() {
            refreshTimer = null;
            var force2 = forceSkinSync;
            forceSkinSync = false;
            refreshIfEnabled(force2);
          }, 300);
        }
        var unsubscribeRegistry = singleton.subscribe(function() {
          scheduleRefresh(true);
        });
        refreshIfEnabled();
        var unsubscribe = null;
        if (ctx.sessions && ctx.sessions.list && typeof ctx.sessions.list.subscribe === "function") {
          try {
            unsubscribe = ctx.sessions.list.subscribe(function() {
              scheduleRefresh(false);
            });
          } catch (e) {
          }
        }
        var fallback = setInterval(function() {
          var rows = document.querySelectorAll('[class*="sessionRow"]');
          if (rows.length === 0) return;
          refreshIfEnabled();
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
