// 通用小工具：字符串归一化 + 确定性 hue（供头像/项目方块取色）。
export function norm(text) {
  return String(text == null ? "" : text).replace(/\s+/g, " ").trim();
}

export function hashHue(text) {
  var s = norm(text);
  var h = 0;
  for (var i = 0; i < s.length; i++) { h = (h * 31 + s.charCodeAt(i)) >>> 0; }
  return h % 360;
}
