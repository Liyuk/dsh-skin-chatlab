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

  // packages/skin-whatsapp/src/whatsapp.js
  var WHATSAPP_BRAND_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><rect x="1" y="1" width="22" height="22" rx="7" fill="#25d366"></rect><path d="M5 7h3l2 8 2-6h2l2 6 2-8h3l-3.5 11h-2.8L13 13l-1.7 5H8.5L5 7Z" fill="#fff"></path></svg>';
  var WHATSAPP_TOKENS = makeTokens({
    light: {
      accent: "#25d366",
      accentHover: "#1da851",
      accentMuted: "#e2f7e9",
      canvas: "#efeae2",
      surface1: "#ffffff",
      surface2: "#f7f4ef",
      surface3: "#e8e3db",
      textPrimary: "#202c33",
      textSecondary: "#667781",
      textTertiary: "#8696a0",
      border1: "#e1e7e9",
      border2: "#d4dcdf",
      border3: "#bdc9ce",
      hover: "#f0f2f3",
      active: "#e1f3e7",
      success: "#25d366",
      error: "#ea4d58",
      warning: "#f0b323",
      tooltip: "#202c33"
    },
    dark: {
      accent: "#53d769",
      accentHover: "#72e585",
      accentMuted: "#244b31",
      canvas: "#111b21",
      surface1: "#202c33",
      surface2: "#26343b",
      surface3: "#34434a",
      textPrimary: "#e9edef",
      textSecondary: "#b8c5ca",
      textTertiary: "#86969e",
      border1: "#37444a",
      border2: "#46545a",
      border3: "#59686e",
      hover: "#29383e",
      active: "#2d4736",
      success: "#53d769",
      error: "#ff7180",
      warning: "#f5c15b",
      tooltip: "#0b141a"
    }
  });
  var WHATSAPP_CSS = `
html[data-chatlab-skin="whatsapp"] [class*="brand"] { display: inline-flex; align-items: center; gap: 8px; }
html[data-chatlab-skin="whatsapp"] .cl-brand-skin { display: inline-flex; align-items: center; gap: 6px; height: 24px; box-sizing: border-box; padding: 0 8px 0 4px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 7px; color: var(--dsw-alias-brand-primary); background: var(--dsw-alias-interactive-bg-hover-accent); font-size: 12px; font-weight: 600; line-height: 1; white-space: nowrap; }
html[data-chatlab-skin="whatsapp"] .cl-brand-mark { display: inline-flex; width: 18px; height: 18px; flex: none; }
html[data-chatlab-skin="whatsapp"] .cl-brand-mark img { display: block; width: 18px; height: 18px; }
html[data-chatlab-skin="whatsapp"] .cl-brand-label { display: inline-block; transform: translateY(-.5px); }
html[data-chatlab-skin="whatsapp"] [class*="projectRow"],
html[data-chatlab-skin="whatsapp"] [class*="sessionRow"] { border-radius: 6px; margin: 1px 6px; }
html[data-chatlab-skin="whatsapp"] [class*="projectText"] { font-size: 13px; font-weight: 600; }
html[data-chatlab-skin="whatsapp"] [class*="folder"],
html[data-chatlab-skin="whatsapp"] [class*="folderActive"] { color: #25d366 !important; }
html[data-chatlab-skin="whatsapp"] [class*="sessionRow"] { --cl-session-avatar-col: 32px; --cl-session-title-row: 20px; --cl-session-preview-row: 16px; --cl-session-column-gap: 8px; --cl-session-row-gap: 3px; min-height: 52px !important; padding: 6px 9px; }
html[data-chatlab-skin="whatsapp"] [class*="sessionRow"]:hover { background: var(--dsw-alias-interactive-bg-hover); }
html[data-chatlab-skin="whatsapp"] [class*="sessionRow"][class*="selected"], html[data-chatlab-skin="whatsapp"] [class*="sessionRow"][class*="active"] { background: var(--dsw-alias-interactive-bg-hover-accent); }
html[data-chatlab-skin="whatsapp"] [class*="projectRow"][class*="selected"], html[data-chatlab-skin="whatsapp"] [class*="projectRow"][class*="active"] { background: var(--dsw-alias-interactive-bg-hover-accent); box-shadow: inset 2px 0 #25d366; }
html[data-chatlab-skin="whatsapp"] [class*="sessionRow"] [class*="title"] { font-size: 14px; font-weight: 500; }
html[data-chatlab-skin="whatsapp"] .cl-avatar { width: 32px; height: 32px; border-radius: 50%; }
html[data-chatlab-skin="whatsapp"] .cl-preview { font-size: 12px; }
html[data-chatlab-skin="whatsapp"] .cl-unread-dot { position: absolute; top: 4px; left: 35px; display: block; width: 8px; height: 8px; border-radius: 50%; background: #25d366; box-shadow: 0 0 0 2px var(--dsw-alias-bg-base); z-index: 1; }
html[data-chatlab-skin="whatsapp"] .cl-running-dot { position: absolute; bottom: 4px; left: 36px; display: block; width: 9px; height: 9px; border-radius: 50%; background: #25d366; box-shadow: 0 0 0 2px var(--dsw-alias-bg-base); z-index: 1; }
html[data-chatlab-skin="whatsapp"] [class*="titleCluster"] [class*="crumbCurrent"] { font-size: 15px; font-weight: 600; }
html[data-chatlab-skin="whatsapp"] .cl-header-avatar { width: 32px; height: 32px; border-radius: 50%; }
html[data-chatlab-skin="whatsapp"] [class*="userStack"] [class*="bubble"] { background: #d9fdd3 !important; color: #202c33 !important; border-radius: 8px 2px 8px 8px; padding: 8px 12px; box-shadow: 0 1px 1px rgba(32,44,51,.12); font-size: 15px; line-height: 22px; }
html[data-chatlab-skin="whatsapp"] [class*="userStack"] { max-width: min(510px, 78%); }
html[data-chatlab-skin="whatsapp"] [class*="userRow"] [class*="bubble"]::after { content: "\u2713\u2713"; margin-left: 8px; font-size: 10px; color: #53bdeb; letter-spacing: -2px; }
html[data-chatlab-skin="whatsapp"] [data-chat-flow-kind="assistant-step"] [class*="body"] { font-size: 15px; line-height: 23px; }
${makeComposerCss({ id: "whatsapp", cardRadius: "10px", toolbarRadius: "6px", sendRadius: "6px", motionName: "cl-whatsapp-composer-focus", focusDuration: ".18s", sendTransition: "background .16s ease, box-shadow .16s ease, transform .16s ease;", sendHover: " box-shadow: 0 2px 5px rgba(37,211,102,.24); transform: translateY(-1px);", motionFrom: "box-shadow: 0 0 0 0 rgba(37,211,102,0);", motionTo: "box-shadow: 0 0 0 2px rgba(37,211,102,.14);" })}
html[data-chatlab-skin="whatsapp"] .cl-project-icon { border-radius: 50%; }
html[data-chatlab-skin="whatsapp"] .cl-project-icon { background: hsl(var(--cl-project-hue, 145), 55%, 48%); }
`;

  // packages/skin-whatsapp/src/index.js
  window.__ModuleLoader__.load({
    id: "@liyuk/dsh-skin-whatsapp",
    factory: function() {
      function apply(ctx) {
        var chatlab = ctx.chatlab;
        if (!chatlab || typeof chatlab.registerSkin !== "function") return;
        chatlab.registerSkin({
          id: "whatsapp",
          name: "WhatsApp \u98CE\u683C",
          desc: "\u7EFF\u8272\u804A\u5929\u611F \xB7 \u5706\u5F62\u5934\u50CF \xB7 \u8F7B\u91CF\u52FE\u9009\u88C5\u9970",
          ready: true,
          tokens: WHATSAPP_TOKENS,
          brand: { svg: WHATSAPP_BRAND_SVG },
          css: WHATSAPP_CSS
        });
      }
      return { name: "@liyuk/dsh-skin-whatsapp", inject: ["chatlab"], apply };
    }
  });
})();
