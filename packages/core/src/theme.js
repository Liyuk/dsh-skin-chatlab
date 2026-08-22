// 样式表构建：通用骨架 CSS + 当前皮肤 css + 注入/重建 <style>。
import { skinRegistry } from "./registry.js";

export const STYLE_ID = "dsh-skin-chatlab-css";

// 设置面板自身的 UI 样式：插件的自有用界面，与"哪个皮肤"无关，
// 选择器不依赖 data-chatlab-skin，这样"无皮肤"时设置面板仍有样式。
export const UI_CSS = [
  '.cl-settings { display: flex; flex-direction: column; gap: 14px; max-width: 560px; }',
  '.cl-settings-head { display: flex; flex-direction: column; gap: 4px; margin-bottom: 4px; }',
  '.cl-settings-title { font-size: 16px; font-weight: 600; color: var(--dsw-alias-label-primary); }',
  '.cl-settings-sub { font-size: 12.5px; color: var(--dsw-alias-label-tertiary); }',
  '.cl-notice { padding: 8px 12px; border-radius: 8px; background: var(--dsw-alias-interactive-bg-hover-accent); color: var(--dsw-alias-brand-primary); font-size: 13px; }',
  '.cl-chips { display: flex; flex-wrap: wrap; gap: 8px; }',
  '.cl-chip { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 999px; background: var(--dsw-alias-bg-base); color: var(--dsw-alias-label-secondary); font-size: 13px; cursor: pointer; }',
  'button.cl-chip:hover { background: var(--dsw-alias-interactive-bg-hover); }',
  '.cl-chip-on { border-color: var(--dsw-alias-brand-primary); color: var(--dsw-alias-brand-primary); background: var(--dsw-alias-interactive-bg-hover-accent); }',
  '.cl-chip-check { font-size: 12px; }',
  '.cl-chip-disabled { opacity: .45; cursor: not-allowed; }',
  '.cl-chip-soon { font-size: 11px; color: var(--dsw-alias-label-tertiary); }',
  '.cl-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 12px 14px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 8px; cursor: pointer; }',
  '.cl-row-body { display: flex; flex-direction: column; gap: 3px; }',
  '.cl-row-title { font-size: 14px; font-weight: 500; color: var(--dsw-alias-label-primary); }',
  '.cl-row-desc { font-size: 12px; color: var(--dsw-alias-label-tertiary); }',
  '.cl-switch { position: relative; width: 40px; height: 22px; flex: none; }',
  '.cl-switch input { position: absolute; inset: 0; opacity: 0; margin: 0; cursor: pointer; }',
  '.cl-knob { position: absolute; inset: 0; border-radius: 11px; background: var(--dsw-alias-bg-layer-3); border: 1px solid var(--dsw-alias-border-l2); transition: background .15s ease; }',
  '.cl-knob::after { content: ""; position: absolute; top: 1px; left: 1px; width: 18px; height: 18px; border-radius: 50%; background: #FFFFFF; box-shadow: 0 1px 2px rgba(0,0,0,.2); transition: transform .15s ease; }',
  '.cl-switch.cl-on .cl-knob { background: var(--dsw-alias-brand-primary); border-color: var(--dsw-alias-brand-primary); }',
  '.cl-switch.cl-on .cl-knob::after { transform: translateX(18px); }'
].join("\n");

export const COMMON_CSS = [
  'html[data-chatlab-skin] { --dsw-font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue", "Microsoft YaHei", "Segoe UI", sans-serif; }',
  'html[data-chatlab-skin] [class*="brand"] { display: inline-flex; align-items: center; gap: 8px; }',
  'html[data-chatlab-skin] .cl-brand-skin { display: inline-flex; align-items: center; gap: 6px; height: 24px; box-sizing: border-box; padding: 0 8px 0 4px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 7px; color: var(--dsw-alias-brand-primary); background: var(--dsw-alias-interactive-bg-hover-accent); font-size: 12px; font-weight: 600; line-height: 1; letter-spacing: .01em; white-space: nowrap; }',
  'html[data-chatlab-skin] .cl-brand-mark { display: inline-flex; width: 18px; height: 18px; flex: none; color: var(--dsw-alias-brand-primary); }',
  'html[data-chatlab-skin] .cl-brand-mark img { display: block; width: 18px; height: 18px; }',
  'html[data-chatlab-skin] .cl-brand-label { display: inline-block; transform: translateY(-.5px); }',
  'html[data-chatlab-skin] .cl-avatar { flex: none; align-self: center; object-fit: cover; background: var(--dsw-alias-bg-layer-3); display: block; }',
  'html[data-chatlab-skin] .cl-header-avatar { flex: none; align-self: center; margin-left: 8px; order: -1; }',
  'html[data-chatlab-skin] [class*="projectRow"] [class*="folder"] > svg { display: none; }',
  'html[data-chatlab-skin] .cl-project-icon { width: 16px; height: 16px; border-radius: 4px; flex: none; display: inline-flex; align-items: center; justify-content: center; box-sizing: border-box; color: #FFFFFF; font-size: 11px; font-weight: 600; line-height: 1; background: hsl(var(--cl-project-hue, 210), 70%, 55%); }',
  'html[data-chatlab-skin] [class*="sessionRow"] { display: grid; grid-template-columns: var(--cl-session-avatar-col, 32px) minmax(0, 1fr) auto auto; grid-template-rows: var(--cl-session-title-row, 20px) var(--cl-session-preview-row, 16px); column-gap: var(--cl-session-column-gap, 8px); row-gap: var(--cl-session-row-gap, 3px); align-items: center; position: relative; box-sizing: border-box; }',
  'html[data-chatlab-skin] [class*="sessionRow"] [class*="slot"] { display: none !important; }',
  'html[data-chatlab-skin] [class*="sessionRow"] .cl-avatar { grid-column: 1; grid-row: 1 / span 2; justify-self: start; align-self: center; }',
  'html[data-chatlab-skin] [class*="sessionRow"] .cl-preview { grid-column: 2 / span 3; grid-row: 2; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }',
  'html[data-chatlab-skin] [class*="sessionRow"] [class*="title"] { grid-column: 2; grid-row: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }',
  'html[data-chatlab-skin] .cl-avatar-initial { display: inline-flex; align-items: center; justify-content: center; color: #FFFFFF; font-size: 15px; font-weight: 600; }',
  'html[data-chatlab-skin] .cl-unread-dot { flex: none; width: 8px; height: 8px; margin-left: 2px; border-radius: 50%; background: var(--dsw-alias-state-error-primary); box-shadow: 0 0 0 2px var(--dsw-alias-bg-base); }'
].join("\n");

export function buildCss(skin, theme) {
  // 设置面板 UI 样式始终注入(插件自有界面，与皮肤无关)。
  var blocks = [UI_CSS];
  // 无皮肤：只保留设置面板 UI 样式，不注入任何皮肤/装饰相关样式，真正回到默认外观。
  if (skin === "none") return blocks.join("\n");
  var def = skinRegistry.get(skin);
  if (!def) return blocks.join("\n");
  blocks.push(COMMON_CSS);
  // 皮肤定义的 token 覆盖 DSH alias。明色写在 html，深色跟随 DSH 自己写到 body
  // 的 data-ds-dark-theme 标记；后者在 body 上的值会覆盖从 html 继承下来的明色值。
  var light = tokenCss(def.tokens && def.tokens.light);
  if (light) blocks.push('html[data-chatlab-skin] { ' + light + ' }');
  var dark = tokenCss(def.tokens && def.tokens.dark);
  if (dark) blocks.push('html[data-chatlab-skin] body[data-ds-dark-theme] { ' + dark + ' }');
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

export function makeRebuildCss() {
  var currentStyleEl = null;
  return function rebuildCss(skin, theme) {
    if (currentStyleEl && currentStyleEl.parentNode) currentStyleEl.parentNode.removeChild(currentStyleEl);
    var text = buildCss(skin, theme);
    if (!text) { currentStyleEl = null; return; }
    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = text;
    document.head.appendChild(style);
    currentStyleEl = style;
  };
}
