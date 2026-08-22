(() => {
  // packages/skin-shared/src/tokens.js
  var DEFAULTS = {
    accent: "#4c88ff",
    accentHover: "#3d7bff",
    accentMuted: "#d9e4ff",
    canvas: "#ffffff",
    surface1: "#f5f6f7",
    surface2: "#eff0f1",
    surface3: "#e8eaed",
    textPrimary: "#1f2329",
    textSecondary: "#646a73",
    textTertiary: "#8f959e",
    border1: "#dee0e3",
    border2: "#d0d3d6",
    border3: "#bbbfc4",
    hover: "#eff0f1",
    active: "#e8eaed",
    success: "#34c724",
    error: "#f54a45",
    warning: "#ff8800",
    tooltip: "#1f2329"
  };
  function value(palette, key) {
    const candidate = palette && palette[key];
    return typeof candidate === "string" && candidate ? candidate : DEFAULTS[key];
  }
  function mapPalette(palette, dark) {
    const p = palette || {};
    const accent = value(p, "accent");
    const textPrimary = value(p, "textPrimary");
    const canvas = value(p, "canvas");
    return {
      "brand-primary": accent,
      "brand-text": accent,
      "brand-primary-invert": "#FFFFFF",
      "brand-primary-new-colorprimary-new-color": accent,
      "bg-base": canvas,
      "bg-layer-1": value(p, "surface1"),
      "bg-layer-2": value(p, "surface2"),
      "bg-layer-3": value(p, "surface3"),
      "label-primary": textPrimary,
      "label-secondary": value(p, "textSecondary"),
      "label-tertiary": value(p, "textTertiary"),
      "label-primary-foreground": "#FFFFFF",
      "label-primary-inverted": dark ? canvas : "#FFFFFF",
      "label-primary-bluish": accent,
      "label-primary-dimmed": value(p, "textTertiary"),
      "label-caption": value(p, "textTertiary"),
      "label-dimmed": value(p, "border3"),
      "border-l1": value(p, "border1"),
      "border-l2": value(p, "border2"),
      "border-l3": value(p, "border3"),
      "interactive-bg-hover": value(p, "hover"),
      "interactive-bg-active": value(p, "active"),
      "interactive-bg-hover-accent": value(p, "accentMuted"),
      "button-primary-fill": accent,
      "button-primary-hover": value(p, "accentHover"),
      "button-primary-dimmed": value(p, "accentMuted"),
      "state-success-primary": value(p, "success"),
      "state-error-primary": value(p, "error"),
      "state-warn-primary": value(p, "warning"),
      "state-business-primary": accent,
      "tooltip-bg": value(p, "tooltip"),
      "toast-bg": value(p, "tooltip")
    };
  }
  function makeTokens(input) {
    const source = input || {};
    return {
      light: mapPalette(source.light, false),
      dark: mapPalette(source.dark, true)
    };
  }

  // packages/skin-shared/src/composer.js
  var EDITOR = '[contenteditable="true"], textarea';
  var TOOLBAR_BUTTON = '[class*="toolbar"] button, [class*="toolBar"] button, [class*="composerActions"] button';
  var SEND_TARGET = '[aria-label*="\u53D1\u9001" i], [aria-label*="send" i], [title*="\u53D1\u9001" i], [title*="send" i], [class*="send" i], [class*="submit" i]';
  function makeComposerCss(options) {
    const scope = `html[data-chatlab-skin="${options.id}"]`;
    const send = `${scope} [data-composer-card] ${SEND_TARGET}`;
    const sendHover = `${send}:hover`;
    const sendActive = `${send}:active`;
    const focusShadow = options.focusShadow || "0 0 0 2px color-mix(in srgb, var(--dsw-alias-brand-primary) 14%, transparent)";
    const editorExtra = options.editorExtra || "";
    return [
      `${scope} [data-composer-card] { border: 1px solid var(--dsw-alias-border-l1); border-radius: ${options.cardRadius}; background: var(--dsw-alias-bg-base); box-shadow: none; transition: border-color ${options.cardTransition || ".15s"} ease, background ${options.cardTransition || ".15s"} ease; }`,
      `${scope} [data-composer-card]:focus-within { border-color: var(--dsw-alias-brand-primary); background: var(--dsw-alias-bg-base); box-shadow: ${focusShadow}; animation: ${options.motionName} ${options.focusDuration || ".16s"} ${options.focusEasing || "ease-out"}; }`,
      `${scope} [data-composer-card] ${EDITOR} { border: 0; outline: 0; background: transparent; color: var(--dsw-alias-label-primary); font: inherit; font-size: 14px;${editorExtra} }`,
      `${scope} [data-composer-card] ${EDITOR}::placeholder { color: var(--dsw-alias-label-tertiary); }`,
      `${scope} [data-composer-card] ${TOOLBAR_BUTTON} { border: 0; border-radius: ${options.toolbarRadius}; background: transparent; color: var(--dsw-alias-label-secondary); }`,
      `${scope} [data-composer-card] ${TOOLBAR_BUTTON}:hover { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-brand-primary); }`,
      `${scope} [data-composer-card] button:disabled { opacity: .45; cursor: default; }`,
      `${scope} [data-composer-card] [class*="send"] button, ${scope} [data-composer-card] button[type="submit"], ${send} { border: 0; border-radius: ${options.sendRadius}; background: var(--dsw-alias-brand-primary); color: var(--dsw-alias-label-primary-foreground); font-size: 13px; font-weight: ${options.sendWeight || "500"}; transition: ${options.sendTransition || "background .15s ease"}; }`,
      `${scope} [data-composer-card] [class*="send"] button:hover, ${scope} [data-composer-card] button[type="submit"]:hover, ${sendHover} { background: var(--dsw-alias-button-primary-hover);${options.sendHover || ""} }`,
      `${sendActive} {${options.sendActive || ""} }`,
      `@keyframes ${options.motionName} { from { ${options.motionFrom || "box-shadow: 0 0 0 0 rgba(0,0,0,0);"} } to { ${options.motionTo || "box-shadow: 0 0 0 2px color-mix(in srgb, var(--dsw-alias-brand-primary) 14%, transparent);"} } }`
    ].join("\n");
  }

  // packages/skin-dingtalk/src/dingtalk.js
  var DINGTALK_BRAND_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="6" fill="#1677ff"></rect><circle cx="8" cy="8" r="2" fill="#fff"></circle><path d="M7 12h4.5a5 5 0 0 1 0 10H7V12Zm3 3v4h1.4a2 2 0 0 0 0-4H10Zm4-10h3v8h-3V5Z" fill="#fff"></path></svg>';
  var DINGTALK_TOKENS = makeTokens({
    light: {
      accent: "#1677ff",
      accentHover: "#0958d9",
      accentMuted: "#e6f4ff",
      canvas: "#f5f7fa",
      surface1: "#ffffff",
      surface2: "#f0f4f8",
      surface3: "#e2e8f0",
      textPrimary: "#1f2d3d",
      textSecondary: "#5d6b7a",
      textTertiary: "#8b98a7",
      border1: "#dbe2ea",
      border2: "#c7d1dc",
      border3: "#aebbc8",
      hover: "#edf5ff",
      active: "#e1efff",
      success: "#2eb85c",
      error: "#e5484d",
      warning: "#f5a623",
      tooltip: "#1f2d3d"
    },
    dark: {
      accent: "#69a7ff",
      accentHover: "#8bbcff",
      accentMuted: "#213a5c",
      canvas: "#171b21",
      surface1: "#202630",
      surface2: "#29313c",
      surface3: "#343e4a",
      textPrimary: "#eef3f8",
      textSecondary: "#b4c0cc",
      textTertiary: "#7e8c9a",
      border1: "#3a4653",
      border2: "#465361",
      border3: "#566574",
      hover: "#26364b",
      active: "#2c4058",
      success: "#43d17a",
      error: "#ff6b70",
      warning: "#ffc15c",
      tooltip: "#101418"
    }
  });
  var DINGTALK_CSS = `
html[data-chatlab-skin="dingtalk"] [class*="brand"] { display: inline-flex; align-items: center; gap: 8px; }
html[data-chatlab-skin="dingtalk"] .cl-brand-skin { display: inline-flex; align-items: center; gap: 6px; height: 24px; box-sizing: border-box; padding: 0 8px 0 4px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 7px; color: var(--dsw-alias-brand-primary); background: var(--dsw-alias-interactive-bg-hover-accent); font-size: 12px; font-weight: 600; line-height: 1; white-space: nowrap; }
html[data-chatlab-skin="dingtalk"] .cl-brand-mark { display: inline-flex; width: 18px; height: 18px; flex: none; }
html[data-chatlab-skin="dingtalk"] .cl-brand-mark img { display: block; width: 18px; height: 18px; }
html[data-chatlab-skin="dingtalk"] .cl-brand-label { display: inline-block; transform: translateY(-.5px); }
html[data-chatlab-skin="dingtalk"] [class*="projectRow"],
html[data-chatlab-skin="dingtalk"] [class*="sessionRow"] { border-radius: 8px; margin: 2px 8px; }
html[data-chatlab-skin="dingtalk"] [class*="projectRow"] { padding-top: 2px; padding-bottom: 2px; }
html[data-chatlab-skin="dingtalk"] [class*="projectText"] { font-size: 13px; font-weight: 600; }
html[data-chatlab-skin="dingtalk"] [class*="folder"],
html[data-chatlab-skin="dingtalk"] [class*="folderActive"] { color: #1677ff !important; }
html[data-chatlab-skin="dingtalk"] [class*="sessionRow"] { --cl-session-avatar-col: 32px; --cl-session-title-row: 20px; --cl-session-preview-row: 16px; --cl-session-column-gap: 9px; --cl-session-row-gap: 3px; min-height: 52px !important; padding: 6px 10px; box-shadow: 0 1px 0 rgba(31,45,61,.04); }
html[data-chatlab-skin="dingtalk"] [class*="sessionRow"]:hover { background: var(--dsw-alias-interactive-bg-hover); }
html[data-chatlab-skin="dingtalk"] [class*="sessionRow"][class*="selected"], html[data-chatlab-skin="dingtalk"] [class*="sessionRow"][class*="active"] { background: var(--dsw-alias-interactive-bg-hover-accent); box-shadow: inset 3px 0 #1677ff; }
html[data-chatlab-skin="dingtalk"] [class*="projectRow"][class*="selected"], html[data-chatlab-skin="dingtalk"] [class*="projectRow"][class*="active"] { background: var(--dsw-alias-interactive-bg-hover-accent); box-shadow: inset 3px 0 #1677ff; }
html[data-chatlab-skin="dingtalk"] [class*="sessionRow"] [class*="title"] { font-size: 14px; font-weight: 600; }
html[data-chatlab-skin="dingtalk"] .cl-avatar { width: 32px; height: 32px; border-radius: 8px; }
html[data-chatlab-skin="dingtalk"] .cl-preview { font-size: 12px; }
html[data-chatlab-skin="dingtalk"] .cl-unread-dot { position: absolute; top: 4px; left: 35px; display: block; width: 8px; height: 8px; border-radius: 50%; background: #e5484d; box-shadow: 0 0 0 2px var(--dsw-alias-bg-base); z-index: 1; }
html[data-chatlab-skin="dingtalk"] .cl-running-dot { position: absolute; bottom: 4px; left: 36px; display: block; width: 9px; height: 9px; border-radius: 50%; background: #1677ff; box-shadow: 0 0 0 2px var(--dsw-alias-bg-base); z-index: 1; }
html[data-chatlab-skin="dingtalk"] [class*="titleCluster"] [class*="crumbCurrent"] { font-size: 15px; font-weight: 650; }
html[data-chatlab-skin="dingtalk"] .cl-header-avatar { width: 32px; height: 32px; border-radius: 8px; }
html[data-chatlab-skin="dingtalk"] [class*="userStack"] [class*="bubble"] { background: #1677ff !important; color: #fff !important; border-radius: 12px 4px 12px 12px; padding: 9px 14px; box-shadow: 0 2px 5px rgba(22,119,255,.18); font-size: 15px; line-height: 22px; }
html[data-chatlab-skin="dingtalk"] [class*="userStack"] { max-width: min(520px, 78%); }
html[data-chatlab-skin="dingtalk"] [data-chat-flow-kind="assistant-step"] [class*="body"] { font-size: 15px; line-height: 24px; }
${makeComposerCss({ id: "dingtalk", cardRadius: "10px", toolbarRadius: "6px", sendRadius: "6px", motionName: "cl-dingtalk-composer-focus", focusDuration: ".14s", focusEasing: "cubic-bezier(.2,.8,.2,1)", sendTransition: "background .14s ease, transform .14s ease, box-shadow .14s ease;", sendHover: " box-shadow: 0 2px 5px rgba(22,119,255,.22);", sendActive: " transform: scale(.96);", motionFrom: "box-shadow: 0 0 0 0 rgba(22,119,255,0);", motionTo: "box-shadow: 0 0 0 2px rgba(22,119,255,.14);" })}
html[data-chatlab-skin="dingtalk"] .cl-project-icon { border-radius: 5px; }
html[data-chatlab-skin="dingtalk"] .cl-project-icon { background: hsl(var(--cl-project-hue, 215), 72%, 52%); }
`;

  // packages/skin-dingtalk/src/index.js
  window.__ModuleLoader__.load({
    id: "@liyuk/dsh-skin-dingtalk",
    factory: function() {
      function apply(ctx) {
        var chatlab = ctx.chatlab;
        if (!chatlab || typeof chatlab.registerSkin !== "function") return;
        chatlab.registerSkin({
          id: "dingtalk",
          name: "\u9489\u9489\u98CE\u683C",
          desc: "\u84DD\u8272\u4F01\u4E1A\u611F \xB7 \u5361\u7247\u9009\u4E2D\u6001 \xB7 \u4EFB\u52A1\u5BC6\u5EA6",
          ready: true,
          tokens: DINGTALK_TOKENS,
          brand: { svg: DINGTALK_BRAND_SVG },
          css: DINGTALK_CSS
        });
      }
      return { name: "@liyuk/dsh-skin-dingtalk", inject: ["chatlab"], apply };
    }
  });
})();
