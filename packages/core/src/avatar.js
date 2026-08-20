// 头像：确定性 DiceBear 扁平小人。
// 性能：size=32(贴合 32px 显示尺寸，省 4 倍带宽) + lazy + fetchpriority=low
// (不抢占关键资源) + decoding=async(异步解码不阻塞主线程) + 按 seed 占位底色
// (SVG 落地前先显示同色圆，避免网络慢时空白闪烁)。失败仍回退彩色首字母块。
import { norm, hashHue } from "./utils.js";

var AVATAR_BASE = "https://api.dicebear.com/9.x/avataaars/svg?radius=50&size=32&seed=";
var opaqueSeeds = {};

function opaqueSeed(seed) {
  var key = norm(seed) || "dsh";
  if (opaqueSeeds[key]) return opaqueSeeds[key];
  var token;
  try {
    var bytes = new Uint32Array(2);
    crypto.getRandomValues(bytes);
    token = bytes[0].toString(36) + bytes[1].toString(36);
  } catch (e) {
    // 极简浏览器的兜底也不发送原始 id/title，只会降低 token 的不可预测性。
    token = hashHue(key).toString(36) + Math.random().toString(36).slice(2);
  }
  opaqueSeeds[key] = token;
  return token;
}

export function avatarUrl(seed) {
  // DiceBear 是第三方服务；不能把会话 id 或标题直接放进请求 URL。
  return AVATAR_BASE + encodeURIComponent(opaqueSeed(seed));
}

function installAvatarFallback(img, seed) {
  img.onerror = function () {
    if (img._failed) return;
    img._failed = true;
    var span = document.createElement("span");
    span.className = img.className + " cl-avatar-initial";
    span.setAttribute("data-seed", seed);
    span.style.background = "hsl(" + hashHue(seed) + ", 60%, 52%)";
    span.textContent = (seed.charAt(0) || "?").toUpperCase();
    if (img.parentNode) img.parentNode.replaceChild(span, img);
  };
}

function configureAvatarImage(img, seed, src, extraClass) {
  img.className = "cl-avatar" + (extraClass ? " " + extraClass : "");
  img.setAttribute("data-seed", seed);
  img.alt = "";
  img.loading = "lazy";
  img.setAttribute("fetchpriority", "low");
  img.decoding = "async";
  img.style.backgroundColor = "hsl(" + hashHue(seed) + ", 42%, 88%)";
  img.draggable = false;
  img._failed = false;
  installAvatarFallback(img, seed);
  if (img.getAttribute("src") !== src) img.src = src;
  return img;
}

export function makeAvatar(seed, extraClass) {
  var s = norm(seed) || "dsh";
  var img = document.createElement("img");
  return configureAvatarImage(img, s, avatarUrl(s), extraClass);
}

export function updateAvatar(existing, seed, src, extraClass) {
  var s = norm(seed) || "dsh";
  if (existing && existing.tagName === "IMG") {
    // React 不管理这个节点，但轮询会复用它；必须同步 seed、失败回退闭包和占位色，
    // 否则从会话 A 切到 B 后，B 的网络失败仍会显示 A 的首字母。
    return configureAvatarImage(existing, s, src, extraClass);
  }
  // 同一失败 seed 保持回退首字母，避免 1.5 秒轮询持续重试网络；但换会话/seed 时
  // 必须恢复一个真正的 <img>，不能给 span 写无效的 .src。
  if (existing && existing.classList.contains("cl-avatar-initial") && existing.getAttribute("data-seed") === s) {
    return existing;
  }
  var fresh = makeAvatar(s, extraClass);
  if (fresh.getAttribute("src") !== src) fresh.src = src;
  if (existing && existing.parentNode) existing.parentNode.replaceChild(fresh, existing);
  return fresh;
}
