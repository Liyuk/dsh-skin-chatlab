// 偏好读写 + 皮肤/主题反射到 <html>。
import { skinRegistry } from "./registry.js";

export const KEY_SKIN = "dsh-skin-chatlab.skin";   // 当前皮肤 id（"none" = 关闭）
export const KEY_THEME = "dsh-skin-chatlab.theme"; // "light" | "dark"
export const KEY_READ = "dsh-skin-chatlab.read";   // { [sessionId]: lastSeq 已读 }
export const KEY_AVATAR_MAP = "dsh-skin-chatlab.avatar"; // { [sessionId]: {seed,url,at} } id→头像 映射表(根治两端头像不一致)

export function readSkin() {
  try {
    var v = localStorage.getItem(KEY_SKIN);
    // "none" 是合法的"关闭皮肤"偏好，不是皮肤 id，必须放行。
    if (v === "none") return "none";
    var selected = v && skinRegistry.get(v);
    if (selected && selected.ready) return v;
    // core 可以独立安装；没有已注册的可用皮肤时必须保持默认外观。皮肤包晚到时，
    // registry 订阅会再次读取此偏好并自动激活相应皮肤。
    return firstReadySkin();
  }
  catch (e) { return firstReadySkin(); }
}

function firstReadySkin() {
  var skins = skinRegistry.list();
  for (var i = 0; i < skins.length; i++) {
    if (skins[i].ready) return skins[i].id;
  }
  return "none";
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
