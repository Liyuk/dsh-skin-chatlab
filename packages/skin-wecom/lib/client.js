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

  // packages/skin-wecom/src/wecom.js
  var WECOM_BRAND_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="7" fill="#18b875"></rect><path d="M5.5 11.2c0-2.5 2.5-4.5 5.6-4.5 3.2 0 5.7 2 5.7 4.5s-2.5 4.5-5.7 4.5c-.6 0-1.2-.1-1.7-.2L6 17l.8-2.2c-.8-.9-1.3-2.2-1.3-3.6Zm4.1-.3h1.2V9.7H9.6v1.2Zm2.5 0h1.2V9.7h-1.2v1.2Z" fill="#fff"></path></svg>';
  var WECOM_TOKENS = makeTokens({
    light: {
      accent: "#07c160",
      accentHover: "#06ad56",
      accentMuted: "#e5f7ed",
      canvas: "#f5f6f7",
      surface1: "#ffffff",
      surface2: "#f0f2f3",
      surface3: "#e2e6e8",
      textPrimary: "#202124",
      textSecondary: "#667079",
      textTertiary: "#9aa3a8",
      border1: "#e0e4e6",
      border2: "#d2d8da",
      border3: "#c1c9cc",
      hover: "#eef8f2",
      active: "#e2f4e9",
      success: "#07c160",
      error: "#fa5151",
      warning: "#f2a900",
      tooltip: "#202124"
    },
    dark: {
      accent: "#35d77f",
      accentHover: "#5de394",
      accentMuted: "#1f4934",
      canvas: "#181a1b",
      surface1: "#202323",
      surface2: "#292d2e",
      surface3: "#34393a",
      textPrimary: "#edf0f0",
      textSecondary: "#b1b9bb",
      textTertiary: "#7f898c",
      border1: "#394041",
      border2: "#454d4e",
      border3: "#566061",
      hover: "#28332d",
      active: "#2d4035",
      success: "#35d77f",
      error: "#ff6b6b",
      warning: "#f6bd4c",
      tooltip: "#111313"
    }
  });
  var WECOM_CSS = `
html[data-chatlab-skin="wecom"] [class*="brand"] { display: inline-flex; align-items: center; gap: 8px; }
html[data-chatlab-skin="wecom"] .cl-brand-skin { display: inline-flex; align-items: center; gap: 6px; height: 24px; box-sizing: border-box; padding: 0 8px 0 4px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 7px; color: var(--dsw-alias-brand-primary); background: var(--dsw-alias-interactive-bg-hover-accent); font-size: 12px; font-weight: 600; line-height: 1; white-space: nowrap; }
html[data-chatlab-skin="wecom"] .cl-brand-mark { display: inline-flex; width: 18px; height: 18px; flex: none; }
html[data-chatlab-skin="wecom"] .cl-brand-mark img { display: block; width: 18px; height: 18px; }
html[data-chatlab-skin="wecom"] .cl-brand-label { display: inline-block; transform: translateY(-.5px); }
html[data-chatlab-skin="wecom"] [class*="projectRow"],
html[data-chatlab-skin="wecom"] [class*="sessionRow"] { border-radius: 6px; margin: 1px 6px; }
html[data-chatlab-skin="wecom"] [class*="projectText"] { font-size: 13px; font-weight: 600; }
html[data-chatlab-skin="wecom"] [class*="folder"],
html[data-chatlab-skin="wecom"] [class*="folderActive"] { color: #07c160 !important; }
html[data-chatlab-skin="wecom"] [class*="sessionRow"] { --cl-session-avatar-col: 32px; --cl-session-title-row: 20px; --cl-session-preview-row: 16px; --cl-session-column-gap: 8px; --cl-session-row-gap: 3px; min-height: 50px !important; padding: 6px 9px; }
html[data-chatlab-skin="wecom"] [class*="sessionRow"]:hover { background: var(--dsw-alias-interactive-bg-hover); }
html[data-chatlab-skin="wecom"] [class*="sessionRow"][class*="selected"], html[data-chatlab-skin="wecom"] [class*="sessionRow"][class*="active"] { background: var(--dsw-alias-interactive-bg-hover-accent); }
html[data-chatlab-skin="wecom"] [class*="projectRow"][class*="selected"], html[data-chatlab-skin="wecom"] [class*="projectRow"][class*="active"] { background: var(--dsw-alias-interactive-bg-hover-accent); box-shadow: inset 2px 0 #07c160; }
html[data-chatlab-skin="wecom"] [class*="sessionRow"] [class*="title"] { font-size: 14px; font-weight: 500; }
html[data-chatlab-skin="wecom"] .cl-avatar { width: 32px; height: 32px; border-radius: 50%; }
html[data-chatlab-skin="wecom"] .cl-preview { font-size: 12px; color: var(--dsw-alias-label-tertiary); }
html[data-chatlab-skin="wecom"] .cl-unread-dot { position: absolute; top: 4px; left: 35px; display: block; width: 8px; height: 8px; border-radius: 50%; background: var(--dsw-alias-state-error-primary); box-shadow: 0 0 0 2px var(--dsw-alias-bg-base); z-index: 1; }
html[data-chatlab-skin="wecom"] .cl-running-dot { position: absolute; bottom: 4px; left: 36px; display: block; width: 9px; height: 9px; border-radius: 50%; background: #07c160; box-shadow: 0 0 0 2px var(--dsw-alias-bg-base); z-index: 1; }
html[data-chatlab-skin="wecom"] [class*="titleCluster"] [class*="crumbCurrent"] { font-size: 15px; font-weight: 600; }
html[data-chatlab-skin="wecom"] .cl-header-avatar { width: 32px; height: 32px; border-radius: 50%; }
html[data-chatlab-skin="wecom"] [class*="userStack"] [class*="bubble"] { background: #95ec69 !important; color: #1f2a20 !important; border-radius: 5px 5px 2px 5px; padding: 8px 12px; box-shadow: 0 1px 2px rgba(0,0,0,.08); font-size: 15px; line-height: 22px; }
html[data-chatlab-skin="wecom"] [class*="userStack"] { max-width: min(500px, 76%); }
html[data-chatlab-skin="wecom"] [data-chat-flow-kind="assistant-step"] [class*="body"] { font-size: 15px; line-height: 23px; }
${makeComposerCss({ id: "wecom", cardRadius: "8px", toolbarRadius: "5px", sendRadius: "5px", motionName: "cl-wecom-composer-focus", focusDuration: ".2s", focusShadow: "0 0 0 2px color-mix(in srgb, var(--dsw-alias-brand-primary) 12%, transparent)", sendTransition: "background .16s ease, box-shadow .16s ease;", sendHover: " box-shadow: 0 1px 4px rgba(7,193,96,.25);", motionFrom: "box-shadow: 0 0 0 0 rgba(7,193,96,0);", motionTo: "box-shadow: 0 0 0 2px rgba(7,193,96,.12);" })}
html[data-chatlab-skin="wecom"] .cl-project-icon { border-radius: 4px; }
html[data-chatlab-skin="wecom"] .cl-project-icon { background: hsl(var(--cl-project-hue, 145), 55%, 46%); }
`;

  // packages/skin-wecom/src/index.js
  window.__ModuleLoader__.load({
    id: "@liyuk/dsh-skin-wecom",
    factory: function() {
      function apply(ctx) {
        var chatlab = ctx.chatlab;
        if (!chatlab || typeof chatlab.registerSkin !== "function") return;
        chatlab.registerSkin({
          id: "wecom",
          name: "\u4F01\u4E1A\u5FAE\u4FE1\u98CE\u683C",
          desc: "\u4F01\u4E1A\u901A\u8BAF\u5F55\u611F \xB7 \u7EFF\u8272\u6C14\u6CE1 \xB7 \u514B\u5236\u5BC6\u5EA6",
          ready: true,
          tokens: WECOM_TOKENS,
          brand: { svg: WECOM_BRAND_SVG },
          css: WECOM_CSS
        });
      }
      return { name: "@liyuk/dsh-skin-wecom", inject: ["chatlab"], apply };
    }
  });
})();
