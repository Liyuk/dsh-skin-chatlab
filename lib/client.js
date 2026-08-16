(() => {
  // src/skins/feishu.js
  var FEISHU_CSS = [
    // ===================== 品牌 logo：飞书双鸟 + "DeepSeek HARNESS · 飞书皮肤" =====================
    // 隐藏原 DeepSeek 鲸鱼 wordmark，改由 decorateBrand() 注入飞书 SVG + 文字。
    'html[data-chatlab-skin="feishu"] [class*="brand"] svg { display: none !important; }',
    'html[data-chatlab-skin="feishu"] [class*="brand"] { display: inline-flex; align-items: center; gap: 8px; }',
    'html[data-chatlab-skin="feishu"] .cl-brand { display: inline-flex; align-items: center; gap: 7px; }',
    'html[data-chatlab-skin="feishu"] .cl-brand-logo { width: 20px; height: 12px; flex: none; }',
    'html[data-chatlab-skin="feishu"] .cl-brand-name { font-size: 14px; font-weight: 700; letter-spacing: .01em; color: var(--dsw-alias-label-primary); white-space: nowrap; }',
    'html[data-chatlab-skin="feishu"] .cl-brand-skin { font-size: 11px; font-weight: 500; color: #1456F0; background: var(--dsw-alias-interactive-bg-hover-accent); border-radius: 4px; padding: 1px 6px; white-space: nowrap; }',
    // ===================== 左侧：项目组(Meego 风) =====================
    'html[data-chatlab-skin="feishu"] [class*="projectRow"] { margin: 1px 8px; border-radius: 8px; transition: background .15s ease; }',
    'html[data-chatlab-skin="feishu"] [class*="projectRow"]:hover { background: var(--dsw-alias-interactive-bg-hover); }',
    'html[data-chatlab-skin="feishu"] [class*="projectText"] { font-size: 13px; font-weight: 600; color: var(--dsw-alias-label-primary); }',
    // folder 图标用 currentColor，但依赖 var(--dsw-alias-brand-primary) 在 sidebar 作用域里
    // 解析不稳定(实测不生效)，和气泡一样硬编码飞书蓝。
    'html[data-chatlab-skin="feishu"] [class*="folder"], html[data-chatlab-skin="feishu"] [class*="folderActive"] { color: #1456F0 !important; }',
    'html[data-chatlab-skin="feishu"] [class*="chevron"], html[data-chatlab-skin="feishu"] [class*="arrow"] { color: var(--dsw-alias-label-tertiary); }',
    'html[data-chatlab-skin="feishu"] [class*="sectionHeader"] { background: transparent; }',
    'html[data-chatlab-skin="feishu"] [class*="sectionLabel"] { font-size: 12px; font-weight: 600; color: var(--dsw-alias-label-tertiary); letter-spacing: .02em; background: none; }',
    // 左侧：会话行(联系人 / IM)
    // 用 CSS Grid 实现：头像跨两行垂直居中，标题/时间在第一行，预览在第二行。
    // grid 不移动任何 React 节点(避免 reconcile 崩溃)，纯布局重排。
    // 列：头像 | 标题(自适应) | 时间 | 三点；行：标题行 / 预览行。
    'html[data-chatlab-skin="feishu"] [class*="sessionRow"] { display: grid; grid-template-columns: 32px minmax(0, 1fr) auto auto; grid-template-rows: 20px 16px; column-gap: 8px; row-gap: 3px; align-items: center; height: auto !important; min-height: 52px; padding: 6px 10px; margin: 1px 8px; border-radius: 8px; box-sizing: border-box; }',
    'html[data-chatlab-skin="feishu"] [class*="sessionRow"]:hover { background: var(--dsw-alias-interactive-bg-hover); }',
    'html[data-chatlab-skin="feishu"] [class*="sessionRow"][class*="selected"] { background: var(--dsw-alias-interactive-bg-hover-accent); }',
    // 标题：第一行第 2 列，占满剩余宽度
    'html[data-chatlab-skin="feishu"] [class*="sessionRow"] [class*="title"] { grid-column: 2; grid-row: 1; min-width: 0; margin: 0; font-size: 14px; font-weight: 500; line-height: 20px; color: var(--dsw-alias-label-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }',
    // 时间：第一行第 3 列
    'html[data-chatlab-skin="feishu"] [class*="sessionRow"] [class*="time"] { grid-column: 3; grid-row: 1; font-size: 11px; line-height: 20px; color: var(--dsw-alias-label-tertiary); font-variant-numeric: tabular-nums; }',
    // 三点操作：第一行第 4 列(hover 才显示，默认 display:none 不占格)
    'html[data-chatlab-skin="feishu"] [class*="sessionRow"] [class*="rowActions"] { grid-column: 4; grid-row: 1; }',
    'html[data-chatlab-skin="feishu"] [class*="sessionRow"].cl-unread [class*="title"] { font-weight: 600; }',
    // 未读红点：头像右上角(绝对定位，不占 grid 格子)。
    'html[data-chatlab-skin="feishu"] .cl-unread-dot { position: absolute; top: 4px; left: 36px; width: 8px; height: 8px; border-radius: 50%; background: var(--dsw-alias-state-error-primary); box-shadow: 0 0 0 2px var(--dsw-alias-bg-base); z-index: 1; }',
    // sessionRow 需要相对定位供红点锚定
    'html[data-chatlab-skin="feishu"] [class*="sessionRow"] { position: relative; }',
    // 预览：第二行，从第 2 列跨到第 4 列(对齐标题列)
    'html[data-chatlab-skin="feishu"] .cl-preview { grid-column: 2 / span 3; grid-row: 2; min-width: 0; margin: 0; font-size: 12px; line-height: 16px; color: var(--dsw-alias-label-tertiary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }',
    // 搜索框：只碰展开态
    'html[data-chatlab-skin="feishu"] [class*="searchExpanded"] { background: var(--dsw-alias-bg-layer-2); border-color: var(--dsw-alias-border-l2); border-radius: 10px; gap: 4px; }',
    'html[data-chatlab-skin="feishu"] [class*="searchExpanded"]:hover { border-color: var(--dsw-alias-border-l3); }',
    'html[data-chatlab-skin="feishu"] [class*="searchInput"] { font-size: 13px; color: var(--dsw-alias-label-primary); }',
    'html[data-chatlab-skin="feishu"] [class*="searchInput"]::placeholder { color: var(--dsw-alias-label-tertiary); }',
    'html[data-chatlab-skin="feishu"] [class*="searchButton"], html[data-chatlab-skin="feishu"] [class*="clearButton"] { color: var(--dsw-alias-label-tertiary); background: transparent; }',
    // 聊天：消息气泡
    // 真实结构：用户消息 = [data-chat-flow-kind="user"] → .gdEzaW_bubble(原生已右对齐)
    //           assistant = [data-chat-flow-kind="assistant-step"] → .Sxvs8a_body(通栏正文)
    // 飞书：用户气泡蓝色白字 + 已读✓；assistant 保持通栏正文(飞书 bot 回复不套气泡)。
    'html[data-chatlab-skin="feishu"] [class*="gdEzaW_bubble"] { background: #1456F0 !important; color: #FFFFFF !important; border-radius: 18px 4px 18px 18px; padding: 9px 14px; font-size: 15px; line-height: 22px; box-shadow: 0 1px 2px rgba(0,0,0,.08); }',
    'html[data-chatlab-skin="feishu"] [class*="gdEzaW_userStack"] { max-width: min(480px, 78%); }',
    // 用户气泡右下角"已读✓"(飞书私聊)
    'html[data-chatlab-skin="feishu"] [class*="gdEzaW_userRow"] [class*="gdEzaW_bubble"]::after { content: "\u5DF2\u8BFB"; margin-left: 8px; font-size: 11px; color: rgba(255,255,255,.7); }',
    // assistant 正文：通栏，飞书 bot 回复风格
    'html[data-chatlab-skin="feishu"] [class*="Sxvs8a_body"] { font-size: 15px; line-height: 24px; }',
    // 输入框(composer)
    'html[data-chatlab-skin="feishu"] [data-composer-card] { border: 1px solid var(--dsw-alias-border-l1); border-radius: 12px; background: var(--dsw-alias-bg-base); box-shadow: 0 1px 4px rgba(0,0,0,.05); }',
    // 聊天：顶栏
    'html[data-chatlab-skin="feishu"] [class*="titleCluster"] [class*="crumbCurrent"] { font-size: 15px; font-weight: 600; color: var(--dsw-alias-label-primary); }',
    'html[data-chatlab-skin="feishu"] [class*="tabs"] { gap: 28px; }',
    'html[data-chatlab-skin="feishu"] [class*="tab"] { font-size: 13px; font-weight: 500; color: var(--dsw-alias-label-tertiary); }',
    'html[data-chatlab-skin="feishu"] [class*="tabActive"] { color: #1456F0 !important; }',
    'html[data-chatlab-skin="feishu"] [class*="tabActive"]::after { background: #1456F0 !important; }',
    // 头像：grid 第 1 列、跨两行，垂直居中。
    'html[data-chatlab-skin="feishu"] .cl-avatar { width: 32px; height: 32px; border-radius: 50%; grid-column: 1; grid-row: 1 / span 2; justify-self: start; align-self: center; }',
    // 会话行里那个 16px 空状态槽(slot)在飞书风格里不需要，display:none 彻底移除。
    'html[data-chatlab-skin="feishu"] [class*="sessionRow"] [class*="slot"] { display: none !important; }',
    // 顶部头像：order:-1 排到面包屑前。margin 归零，靠 titleCluster 原生 gap:10px 提供间距。
    'html[data-chatlab-skin="feishu"] .cl-header-avatar { width: 28px; height: 28px; border-radius: 50%; margin: 0; flex: none; align-self: center; order: -1; }',
    // 项目组彩色方块图标(Meego 风)。原文件夹 SVG 用 CSS 隐藏(不删节点)，只显示叠加的彩色方块。
    'html[data-chatlab-skin="feishu"] [class*="projectRow"] [class*="folder"] > svg { display: none; }',
    'html[data-chatlab-skin="feishu"] .cl-project-icon { width: 16px; height: 16px; border-radius: 4px; flex: none; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 600; color: #FFFFFF; line-height: 1; }'
  ].join("\n");
  var BRAND_LOGO_SVG = '<svg class="cl-brand-logo" viewBox="0 0 48 29" xmlns="http://www.w3.org/2000/svg" fill="none"><path fill="#00D6B9" d="M18.43 15.043l.088-.087q.086-.087.177-.174l.122-.117.36-.356.495-.481.42-.417.395-.39.412-.408.378-.373.53-.52q.15-.15.307-.291.288-.26.59-.508a13 13 0 0 1 1.414-.976q.425-.247.868-.469a12 12 0 0 1 1.345-.55q.123-.042.252-.083A20.8 20.8 0 0 0 22.648.947a1.9 1.9 0 0 0-1.48-.707H5.962a.286.286 0 0 0-.17.516 44.4 44.4 0 0 1 12.604 14.326l.035-.04z"/><path fill="#3370FF" d="M12.386 28.427c7.853 0 14.695-4.334 18.261-10.738q.189-.337.364-.681a8.4 8.4 0 0 1-.837 1.31 9 9 0 0 1-.581.677 7.5 7.5 0 0 1-.911.815 7 7 0 0 1-.412.295 8 8 0 0 1-.555.343 8 8 0 0 1-1.754.72 8 8 0 0 1-.932.2c-.226.035-.46.06-.69.078q-.365.024-.738.022a9 9 0 0 1-.824-.052 10 10 0 0 1-.612-.087 8 8 0 0 1-.533-.113c-.096-.022-.187-.048-.282-.074a57 57 0 0 1-.781-.217c-.13-.039-.26-.073-.386-.112a22 22 0 0 1-.578-.178q-.234-.073-.468-.152c-.148-.048-.3-.096-.447-.148l-.304-.104-.368-.13-.26-.095a19 19 0 0 1-.517-.191c-.1-.04-.2-.074-.3-.113l-.398-.156-.421-.17-.274-.112-.338-.14-.26-.107-.27-.118-.234-.104-.212-.095-.217-.1-.221-.104-.282-.13-.295-.14-.313-.151-.264-.13A43.9 43.9 0 0 1 .495 8.665.287.287 0 0 0 0 8.86l.009 13.42v1.089c0 .633.312 1.223.837 1.575a20.7 20.7 0 0 0 11.54 3.484z"/></svg>';

  // src/skins/registry.js
  var SKINS = [
    {
      id: "feishu",
      name: "\u98DE\u4E66",
      desc: "\u5DE5\u4F5C\u533A=\u9879\u76EE\u7EC4 \xB7 \u4F1A\u8BDD=\u8054\u7CFB\u4EBA \xB7 \u6C14\u6CE1\u5316\u804A\u5929",
      ready: true,
      tokens: { light: {}, dark: {} },
      css: FEISHU_CSS
    },
    {
      id: "slack",
      name: "Slack",
      desc: "\u5360\u4F4D\uFF1A\u5F85\u505A",
      ready: false,
      tokens: {
        light: { "brand-primary": "#611F69", "brand-text": "#611F69", "brand-primary-invert": "#FFFFFF", "button-primary-fill": "#611F69", "button-primary-hover": "#4A154B", "state-business-primary": "#611F69", "label-primary-bluish": "#611F69" },
        dark: { "brand-primary": "#9C4AA8", "brand-text": "#9C4AA8", "brand-primary-invert": "#1A1A1A", "button-primary-fill": "#9C4AA8", "state-business-primary": "#9C4AA8", "label-primary-bluish": "#9C4AA8" }
      },
      css: ""
    },
    {
      id: "wechat",
      name: "\u5FAE\u4FE1",
      desc: "\u5360\u4F4D\uFF1A\u5F85\u505A",
      ready: false,
      tokens: {
        light: { "brand-primary": "#07C160", "brand-text": "#07C160", "brand-primary-invert": "#FFFFFF", "button-primary-fill": "#07C160", "button-primary-hover": "#06AD56", "state-business-primary": "#07C160", "state-success-primary": "#07C160", "label-primary-bluish": "#07C160" },
        dark: { "brand-primary": "#07C160", "brand-text": "#07C160", "brand-primary-invert": "#1A1A1A", "button-primary-fill": "#07C160", "state-business-primary": "#07C160", "state-success-primary": "#07C160", "label-primary-bluish": "#07C160" }
      },
      css: ""
    },
    {
      id: "imessage",
      name: "iMessage",
      desc: "\u5360\u4F4D\uFF1A\u5F85\u505A",
      ready: false,
      tokens: {
        light: { "brand-primary": "#0A84FF", "brand-text": "#0A84FF", "brand-primary-invert": "#FFFFFF", "button-primary-fill": "#0A84FF", "state-business-primary": "#0A84FF", "label-primary-bluish": "#0A84FF" },
        dark: { "brand-primary": "#0A84FF", "brand-text": "#0A84FF", "brand-primary-invert": "#1A1A1A", "button-primary-fill": "#0A84FF", "state-business-primary": "#0A84FF", "label-primary-bluish": "#0A84FF" }
      },
      css: ""
    },
    {
      id: "whatsapp",
      name: "WhatsApp",
      desc: "\u5360\u4F4D\uFF1A\u5F85\u505A",
      ready: false,
      tokens: {
        light: { "brand-primary": "#25D366", "brand-text": "#25D366", "brand-primary-invert": "#FFFFFF", "button-primary-fill": "#25D366", "state-business-primary": "#25D366", "state-success-primary": "#25D366", "label-primary-bluish": "#25D366" },
        dark: { "brand-primary": "#25D366", "brand-text": "#25D366", "brand-primary-invert": "#1A1A1A", "button-primary-fill": "#25D366", "state-business-primary": "#25D366", "state-success-primary": "#25D366", "label-primary-bluish": "#25D366" }
      },
      css: ""
    },
    {
      id: "discord",
      name: "Discord",
      desc: "\u5360\u4F4D\uFF1A\u5F85\u505A",
      ready: false,
      tokens: {
        light: { "brand-primary": "#5865F2", "brand-text": "#5865F2", "brand-primary-invert": "#FFFFFF", "button-primary-fill": "#5865F2", "button-primary-hover": "#4752C4", "state-business-primary": "#5865F2", "label-primary-bluish": "#5865F2" },
        dark: { "brand-primary": "#6D7DFF", "brand-text": "#6D7DFF", "brand-primary-invert": "#1A1A1A", "button-primary-fill": "#6D7DFF", "state-business-primary": "#6D7DFF", "label-primary-bluish": "#6D7DFF" }
      },
      css: ""
    },
    {
      id: "telegram",
      name: "Telegram",
      desc: "\u5360\u4F4D\uFF1A\u5F85\u505A",
      ready: false,
      tokens: {
        light: { "brand-primary": "#2AABEE", "brand-text": "#2AABEE", "brand-primary-invert": "#FFFFFF", "button-primary-fill": "#2AABEE", "button-primary-hover": "#1E9BD6", "state-business-primary": "#2AABEE", "label-primary-bluish": "#2AABEE" },
        dark: { "brand-primary": "#5EB5F7", "brand-text": "#5EB5F7", "brand-primary-invert": "#1A1A1A", "button-primary-fill": "#5EB5F7", "state-business-primary": "#5EB5F7", "label-primary-bluish": "#5EB5F7" }
      },
      css: ""
    },
    {
      id: "irc",
      name: "IRC \u7EC8\u7AEF",
      desc: "\u5360\u4F4D\uFF1A\u5F85\u505A",
      ready: false,
      tokens: {
        light: { "brand-primary": "#22A55A", "brand-text": "#22A55A", "brand-primary-invert": "#FFFFFF", "button-primary-fill": "#22A55A", "button-primary-hover": "#1B8A49", "state-business-primary": "#22A55A", "label-primary-bluish": "#22A55A" },
        dark: { "brand-primary": "#4ADE80", "brand-text": "#4ADE80", "brand-primary-invert": "#1A1A1A", "button-primary-fill": "#4ADE80", "state-business-primary": "#4ADE80", "label-primary-bluish": "#4ADE80" }
      },
      css: ""
    },
    {
      id: "msn",
      name: "MSN Messenger",
      desc: "\u5360\u4F4D\uFF1A\u5F85\u505A",
      ready: false,
      tokens: {
        light: { "brand-primary": "#7BC043", "brand-text": "#7BC043", "brand-primary-invert": "#FFFFFF", "button-primary-fill": "#7BC043", "button-primary-hover": "#6BA93A", "state-business-primary": "#7BC043", "state-success-primary": "#7BC043", "label-primary-bluish": "#7BC043" },
        dark: { "brand-primary": "#9ED121", "brand-text": "#9ED121", "brand-primary-invert": "#1A1A1A", "button-primary-fill": "#9ED121", "state-business-primary": "#9ED121", "state-success-primary": "#9ED121", "label-primary-bluish": "#9ED121" }
      },
      css: ""
    },
    {
      id: "kakaotalk",
      name: "KakaoTalk",
      desc: "\u5360\u4F4D\uFF1A\u5F85\u505A",
      ready: false,
      tokens: {
        light: { "brand-primary": "#FEE500", "brand-text": "#FEE500", "brand-primary-invert": "#191919", "button-primary-fill": "#FEE500", "button-primary-hover": "#F2DB00", "state-business-primary": "#FEE500", "label-primary-bluish": "#FEE500" },
        dark: { "brand-primary": "#FEE500", "brand-text": "#FEE500", "brand-primary-invert": "#191919", "button-primary-fill": "#FEE500", "state-business-primary": "#FEE500", "label-primary-bluish": "#FEE500" }
      },
      css: ""
    },
    {
      id: "line",
      name: "LINE",
      desc: "\u5360\u4F4D\uFF1A\u5F85\u505A",
      ready: false,
      tokens: {
        light: { "brand-primary": "#06C755", "brand-text": "#06C755", "brand-primary-invert": "#FFFFFF", "button-primary-fill": "#06C755", "button-primary-hover": "#05A847", "state-business-primary": "#06C755", "state-success-primary": "#06C755", "label-primary-bluish": "#06C755" },
        dark: { "brand-primary": "#06C755", "brand-text": "#06C755", "brand-primary-invert": "#1A1A1A", "button-primary-fill": "#06C755", "state-business-primary": "#06C755", "state-success-primary": "#06C755", "label-primary-bluish": "#06C755" }
      },
      css: ""
    }
  ];
  var SKIN_BY_ID = {};
  SKINS.forEach(function(s) {
    SKIN_BY_ID[s.id] = s;
  });

  // src/core/prefs.js
  var KEY_SKIN = "dsh-skin-chatlab.skin";
  var KEY_THEME = "dsh-skin-chatlab.theme";
  var KEY_READ = "dsh-skin-chatlab.read";
  function readSkin() {
    try {
      var v = localStorage.getItem(KEY_SKIN);
      if (v === "none") return "none";
      return SKIN_BY_ID[v] ? v : "feishu";
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

  // src/core/settings.js
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
        setNotice("\u5DF2\u5207\u6362\u5230\u300C" + (v === "none" ? "\u65E0\u76AE\u80A4" : SKIN_BY_ID[v].name) + "\u300D\uFF0C\u6B63\u5728\u5237\u65B0\u2026");
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
          SKINS.map(function(s) {
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

  // src/core/theme.js
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
    var def = SKIN_BY_ID[skin];
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

  // src/core/utils.js
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

  // src/core/avatar.js
  var AVATAR_BASE = "https://api.dicebear.com/9.x/avataaars/svg?radius=50&size=64&seed=";
  function makeAvatar(seed, extraClass) {
    var s = norm(seed) || "dsh";
    var img = document.createElement("img");
    img.className = "cl-avatar" + (extraClass ? " " + extraClass : "");
    img.setAttribute("data-seed", s);
    img.alt = "";
    img.loading = "lazy";
    img.draggable = false;
    img.src = AVATAR_BASE + encodeURIComponent(s);
    img.onerror = function() {
      img.onerror = null;
      var span = document.createElement("span");
      span.className = img.className + " cl-avatar-initial";
      span.setAttribute("data-seed", s);
      span.style.background = "hsl(" + hashHue(s) + ", 60%, 52%)";
      span.textContent = (s.charAt(0) || "?").toUpperCase();
      if (img.parentNode) img.parentNode.replaceChild(span, img);
    };
    return img;
  }

  // src/core/session.js
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

  // src/core/dom.js
  function titleOf(row) {
    var t = row.querySelector('[class*="title"]');
    return t ? t.textContent : row.textContent;
  }
  function rowId(row, idByTitle) {
    var id = row.getAttribute("data-session-id") || row.getAttribute("data-id") || row.getAttribute("data-key");
    if (id) return id;
    return idByTitle[norm(titleOf(row))];
  }
  function addPreview(row, text) {
    if (!text || row.querySelector(".cl-preview")) return;
    var preview = document.createElement("div");
    preview.className = "cl-preview";
    preview.textContent = text;
    row.appendChild(preview);
  }
  function applyUnread(row, id, lastSeq, current) {
    var m = readSeqs();
    if (!(id in m)) {
      if (typeof lastSeq === "number" && lastSeq > 0) markRead(id, lastSeq);
      row.classList.remove("cl-unread");
      var d0 = row.querySelector(".cl-unread-dot");
      if (d0) d0.remove();
      return;
    }
    var readSeq = m[id];
    var isCurrent = id === current;
    if (isCurrent) {
      if (lastSeq > readSeq) markRead(id, lastSeq);
      row.classList.remove("cl-unread");
      var b0 = row.querySelector(".cl-unread-dot");
      if (b0) b0.remove();
      return;
    }
    var unread = typeof lastSeq === "number" && lastSeq > readSeq;
    row.classList.toggle("cl-unread", unread);
    var badge = row.querySelector(".cl-unread-dot");
    if (unread && !badge) {
      badge = document.createElement("span");
      badge.className = "cl-unread-dot";
      row.appendChild(badge);
    } else if (!unread && badge) {
      badge.remove();
    }
  }

  // src/core/decorators.js
  function decorateBrand() {
    var brand = document.querySelector('[class*="brand"]');
    if (!brand) return;
    if (brand.querySelector(".cl-brand")) return;
    var wrap = document.createElement("span");
    wrap.className = "cl-brand";
    wrap.innerHTML = BRAND_LOGO_SVG + '<span class="cl-brand-name">DeepSeek HARNESS</span><span class="cl-brand-skin">\u98DE\u4E66\u76AE\u80A4</span>';
    brand.appendChild(wrap);
  }
  function decorateSidebar(idByTitle) {
    var rows = document.querySelectorAll('[class*="sessionRow"]');
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      if (row.querySelector(".cl-avatar")) continue;
      var id = rowId(row, idByTitle);
      var seed = id || norm(titleOf(row)) || "dsh";
      var av = makeAvatar(seed);
      row.appendChild(av);
    }
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
    var existing = cluster.querySelector(".cl-avatar");
    if (existing) {
      if (existing.getAttribute("data-seed") === seed) return;
      existing.setAttribute("data-seed", seed);
      existing.src = "https://api.dicebear.com/9.x/avataaars/svg?radius=50&size=64&seed=" + encodeURIComponent(seed);
      return;
    }
    cluster.appendChild(makeAvatar(seed, "cl-header-avatar"));
  }
  function applyPreviews(ctx, snap, idByTitle) {
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
        applyUnread(need[k].row, need[k].id, info.lastSeq, current);
      }
    }).catch(function() {
    });
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
    decorateBrand();
    decorateSidebar(idByTitle);
    decorateProjects();
    decorateHeader(ctx, snap);
    applyPreviews(ctx, snap, idByTitle);
  }

  // src/index.js
  window.__ModuleLoader__.load({
    id: "dsh-skin-chatlab",
    factory: function(require2) {
      var react = require2("react");
      var NAME = "dsh-skin-chatlab";
      var inject = ["slots", "sessions", "connection"];
      var rebuildCss = makeRebuildCss();
      var SettingsPanel = makeSettingsPanel(react);
      function apply(ctx) {
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
            var nodes = document.querySelectorAll(".cl-avatar, .cl-preview, .cl-unread-dot, .cl-project-icon, .cl-brand");
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
            refresh(ctx);
          }, 300);
        }
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
          var decorated = 0;
          for (var i = 0; i < rows.length; i++) {
            if (rows[i].querySelector(".cl-avatar")) decorated++;
          }
          if (decorated !== rows.length) refresh(ctx);
        }, 1500);
        ctx.effect(function() {
          return function() {
            if (unsubscribe) unsubscribe();
            clearInterval(fallback);
            if (refreshTimer) clearTimeout(refreshTimer);
          };
        });
      }
      return { apply, inject, name: NAME };
    }
  });
})();
