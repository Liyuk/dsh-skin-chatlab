// 头像：确定性 DiceBear 扁平小人。
import { norm, hashHue } from "./utils.js";

var AVATAR_BASE = "https://api.dicebear.com/9.x/avataaars/svg?radius=50&size=64&seed=";

export function makeAvatar(seed, extraClass) {
  var s = norm(seed) || "dsh";
  var img = document.createElement("img");
  img.className = "cl-avatar" + (extraClass ? " " + extraClass : "");
  img.setAttribute("data-seed", s);
  img.alt = "";
  img.loading = "lazy";
  img.draggable = false;
  img.src = AVATAR_BASE + encodeURIComponent(s);
  img.onerror = function () {
    img.onerror = null;
    var span = document.createElement("span");
    span.className = img.className + " cl-avatar-initial";
    span.setAttribute("data-seed", s);
    span.style.background = "hsl(" + hashHue(s) + ", 60%, 52%)";
    span.textContent = (s.charAt(0) || "?").toUpperCase();
    if (img.parentNode) img.parentNode.replaceChild(span, img);
  };
  return img;
}
