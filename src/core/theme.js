// 样式表构建：通用骨架 CSS + 当前皮肤 css + 注入/重建 <style>。
import { SKIN_BY_ID } from "../skins/registry.js";

export const STYLE_ID = "dsh-skin-chatlab-css";

export const COMMON_CSS = [
  'html[data-chatlab-skin] { --dsw-font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue", "Microsoft YaHei", "Segoe UI", sans-serif; }',
  'html[data-chatlab-skin] .cl-avatar { flex: none; align-self: center; object-fit: cover; background: var(--dsw-alias-bg-layer-3); display: block; }',
  'html[data-chatlab-skin] .cl-avatar-initial { display: inline-flex; align-items: center; justify-content: center; color: #FFFFFF; font-size: 15px; font-weight: 600; }',
  'html[data-chatlab-skin] .cl-unread-dot { flex: none; width: 8px; height: 8px; margin-left: 2px; border-radius: 50%; background: var(--dsw-alias-state-error-primary); box-shadow: 0 0 0 2px var(--dsw-alias-bg-base); }',
  'html[data-chatlab-skin] .cl-settings { display: flex; flex-direction: column; gap: 14px; max-width: 560px; }',
  'html[data-chatlab-skin] .cl-settings-head { display: flex; flex-direction: column; gap: 4px; margin-bottom: 4px; }',
  'html[data-chatlab-skin] .cl-settings-title { font-size: 16px; font-weight: 600; color: var(--dsw-alias-label-primary); }',
  'html[data-chatlab-skin] .cl-settings-sub { font-size: 12.5px; color: var(--dsw-alias-label-tertiary); }',
  'html[data-chatlab-skin] .cl-notice { padding: 8px 12px; border-radius: 8px; background: var(--dsw-alias-interactive-bg-hover-accent); color: var(--dsw-alias-brand-primary); font-size: 13px; }',
  'html[data-chatlab-skin] .cl-chips { display: flex; flex-wrap: wrap; gap: 8px; }',
  'html[data-chatlab-skin] .cl-chip { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 999px; background: var(--dsw-alias-bg-base); color: var(--dsw-alias-label-secondary); font-size: 13px; cursor: pointer; }',
  'html[data-chatlab-skin] button.cl-chip:hover { background: var(--dsw-alias-interactive-bg-hover); }',
  'html[data-chatlab-skin] .cl-chip-on { border-color: var(--dsw-alias-brand-primary); color: var(--dsw-alias-brand-primary); background: var(--dsw-alias-interactive-bg-hover-accent); }',
  'html[data-chatlab-skin] .cl-chip-check { font-size: 12px; }',
  'html[data-chatlab-skin] .cl-chip-disabled { opacity: .45; cursor: not-allowed; }',
  'html[data-chatlab-skin] .cl-chip-soon { font-size: 11px; color: var(--dsw-alias-label-tertiary); }',
  'html[data-chatlab-skin] .cl-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 12px 14px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 8px; cursor: pointer; }',
  'html[data-chatlab-skin] .cl-row-body { display: flex; flex-direction: column; gap: 3px; }',
  'html[data-chatlab-skin] .cl-row-title { font-size: 14px; font-weight: 500; color: var(--dsw-alias-label-primary); }',
  'html[data-chatlab-skin] .cl-row-desc { font-size: 12px; color: var(--dsw-alias-label-tertiary); }',
  'html[data-chatlab-skin] .cl-switch { position: relative; width: 40px; height: 22px; flex: none; }',
  'html[data-chatlab-skin] .cl-switch input { position: absolute; inset: 0; opacity: 0; margin: 0; cursor: pointer; }',
  'html[data-chatlab-skin] .cl-knob { position: absolute; inset: 0; border-radius: 11px; background: var(--dsw-alias-bg-layer-3); border: 1px solid var(--dsw-alias-border-l2); transition: background .15s ease; }',
  'html[data-chatlab-skin] .cl-knob::after { content: ""; position: absolute; top: 1px; left: 1px; width: 18px; height: 18px; border-radius: 50%; background: #FFFFFF; box-shadow: 0 1px 2px rgba(0,0,0,.2); transition: transform .15s ease; }',
  'html[data-chatlab-skin] .cl-switch.cl-on .cl-knob { background: var(--dsw-alias-brand-primary); border-color: var(--dsw-alias-brand-primary); }',
  'html[data-chatlab-skin] .cl-switch.cl-on .cl-knob::after { transform: translateX(18px); }'
].join("\n");

export function buildCss(skin, theme) {
  // 无皮肤：不注入任何东西(连 COMMON_CSS 也不注入)，真正回到默认。
  if (skin === "none") return "";
  var def = SKIN_BY_ID[skin];
  if (!def) return "";
  var blocks = [COMMON_CSS];
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
