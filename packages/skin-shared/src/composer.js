// Composer CSS factory: build-time only. It centralizes the host DOM seam while
// leaving radius, motion, and brand-specific hover treatment to each skin.
const EDITOR = '[contenteditable="true"], textarea';
const TOOLBAR_BUTTON = '[class*="toolbar"] button, [class*="toolBar"] button, [class*="composerActions"] button';
const SEND_TARGET = '[aria-label*="发送" i], [aria-label*="send" i], [title*="发送" i], [title*="send" i], [class*="send" i], [class*="submit" i]';

export function makeComposerCss(options) {
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
