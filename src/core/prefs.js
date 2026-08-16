// 偏好读写 + 皮肤/主题反射到 <html>。
import { SKIN_BY_ID } from "../skins/registry.js";

export const KEY_SKIN = "dsh-skin-chatlab.skin";   // 当前皮肤 id（"none" = 关闭）
export const KEY_THEME = "dsh-skin-chatlab.theme"; // "light" | "dark"
export const KEY_READ = "dsh-skin-chatlab.read";   // { [sessionId]: lastSeq 已读 }

export function readSkin() {
  try {
    var v = localStorage.getItem(KEY_SKIN);
    // "none" 是合法的"关闭皮肤"偏好，不是皮肤 id，必须放行；其余未知值回落 feishu。
    if (v === "none") return "none";
    return SKIN_BY_ID[v] ? v : "feishu";
  }
  catch (e) { return "feishu"; }
}

export function readTheme() {
  try { return localStorage.getItem(KEY_THEME) === "dark" ? "dark" : "light"; }
  catch (e) { return "light"; }
}

export function applyHtml(skin, theme) {
  var el = document.documentElement;
  // 只标记"哪个皮肤"，不再标记 theme —— 深色交给 DSH 的 ctx.theme 服务
  // (它写 body[data-ds-dark-theme] + color-scheme，并切换 --dsw-alias-* token)。
  if (skin === "none") {
    el.removeAttribute("data-chatlab-skin");
    el.removeAttribute("data-chatlab-theme");
  } else {
    el.setAttribute("data-chatlab-skin", skin);
    // 兼容旧数据，但主题真实状态由 DSH 决定
    el.removeAttribute("data-chatlab-theme");
  }
}
