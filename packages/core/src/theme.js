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
  'html[data-chatlab-skin] .cl-avatar { flex: none; align-self: center; object-fit: cover; background: var(--dsw-alias-bg-layer-3); display: block; }',
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
  // 深色由 DSH 的 ctx.theme 服务管理 token，皮肤不再按 theme 覆盖 token。
  // 皮肤专属的"品牌蓝"已在 def.css 里硬编码(#1456F0)，不依赖 token 解析。
  if (def.css) blocks.push(def.css);
  return blocks.join("\n");
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
