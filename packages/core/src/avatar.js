// 头像：确定性 DiceBear 扁平小人。
// 性能：size=32(贴合 32px 显示尺寸，省 4 倍带宽) + lazy + fetchpriority=low
// (不抢占关键资源) + decoding=async(异步解码不阻塞主线程) + 按 seed 占位底色
// (SVG 落地前先显示同色圆，避免网络慢时空白闪烁)。失败仍回退彩色首字母块。
import { norm, hashHue } from "./utils.js";

var AVATAR_BASE = "https://api.dicebear.com/9.x/avataaars/svg?radius=50&size=32&seed=";

export function avatarUrl(seed) {
  return AVATAR_BASE + encodeURIComponent(norm(seed) || "dsh");
}

export function makeAvatar(seed, extraClass) {
  var s = norm(seed) || "dsh";
  var img = document.createElement("img");
  img.className = "cl-avatar" + (extraClass ? " " + extraClass : "");
  img.setAttribute("data-seed", s);
  img.alt = "";
  img.loading = "lazy";
  img.setAttribute("fetchpriority", "low");
  img.decoding = "async";
  img.style.backgroundColor = "hsl(" + hashHue(s) + ", 42%, 88%)";
  img.draggable = false;
  img.src = avatarUrl(s);
  img.onerror = function () {
    if (img._failed) return;
    img._failed = true;
    var span = document.createElement("span");
    span.className = img.className + " cl-avatar-initial";
    span.setAttribute("data-seed", s);
    span.style.background = "hsl(" + hashHue(s) + ", 60%, 52%)";
    span.textContent = (s.charAt(0) || "?").toUpperCase();
    if (img.parentNode) img.parentNode.replaceChild(span, img);
  };
  return img;
}
