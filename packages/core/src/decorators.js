// decorators：注入品牌 logo、头像、项目方块、预览、未读；以及刷新入口。
// 关键约束：DSH 是 React 应用，这里只 appendChild 自己的节点、绝不动 React 的节点。
import { norm, hashHue } from "./utils.js";
import { makeAvatar } from "./avatar.js";
import { listSnapshot } from "./session.js";
import { titleOf, rowId, addPreview, applyUnread } from "./dom.js";
import { skinRegistry } from "./registry.js";
import { readSkin } from "./prefs.js";

// 品牌：保留原 DeepSeek 鲸鱼 icon，只在旁边追加当前皮肤名徽章(跟随皮肤走)。
export function decorateBrand() {
  var brand = document.querySelector('[class*="brand"]');
  if (!brand) return;
  var existing = brand.querySelector(".cl-brand-skin");
  var skin = readSkin();
  var def = skin === "none" ? null : skinRegistry.get(skin);
  var label = def ? def.name : "";
  if (!label) {
    // 无皮肤/未知：移除徽章
    if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
    return;
  }
  if (existing) {
    if (existing.textContent !== label) existing.textContent = label;
    return;
  }
  var badge = document.createElement("span");
  badge.className = "cl-brand-skin";
  badge.textContent = label;
  brand.appendChild(badge);
}

export function decorateSidebar(idByTitle) {
  var rows = document.querySelectorAll('[class*="sessionRow"]');
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    if (row.querySelector(".cl-avatar")) continue;
    var id = rowId(row, idByTitle);
    var seed = id || norm(titleOf(row)) || "dsh";
    var av = makeAvatar(seed);
    // 只 append 到行尾，不 insertBefore 到 React 节点前(避免干扰 React reconcile)。
    row.appendChild(av);
  }
}

// 项目组图标：在原有文件夹 SVG 旁叠加彩色圆角方块 + 首字母。
export function decorateProjects() {
  var rows = document.querySelectorAll('[class*="projectRow"]');
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    var folderSlot = row.querySelector('[class*="folder"]');
    if (!folderSlot) continue;
    if (folderSlot.querySelector(".cl-project-icon")) continue;
    var title = row.querySelector('[class*="projectText"] [class*="title"], [class*="projectText"]');
    var text = norm(title ? title.textContent : row.textContent);
    var initial = (text.charAt(0) || "?").toUpperCase();
    var hue = hashHue(text);
    var block = document.createElement("span");
    block.className = "cl-project-icon";
    block.textContent = initial;
    block.style.background = "hsl(" + hue + ", 70%, 55%)";
    folderSlot.appendChild(block); // 只 append，不删原 SVG
  }
}

export function decorateHeader(ctx, snap) {
  var cluster = document.querySelector('[class*="titleCluster"]');
  if (!cluster) return;
  var current = snap && snap.current;
  var summary = current ? (snap.byId && snap.byId[current]) : null;
  var seed = current || (summary && summary.displayTitle) || "dsh";
  var existing = cluster.querySelector(".cl-avatar");
  if (existing) {
    if (existing.getAttribute("data-seed") === seed) return;
    // 更新已有头像(我自己 append 的节点，安全)
    existing.setAttribute("data-seed", seed);
    existing.src = "https://api.dicebear.com/9.x/avataaars/svg?radius=50&size=64&seed=" + encodeURIComponent(seed);
    return;
  }
  // append 到末尾，不 insertBefore 到 React 节点前(避免干扰 React 的节点顺序)
  cluster.appendChild(makeAvatar(seed, "cl-header-avatar"));
}

export function applyPreviews(ctx, snap, idByTitle) {
  var connection = ctx.connection;
  if (!connection || !connection.rpc || typeof connection.rpc.call !== "function") return;
  var rows = document.querySelectorAll('[class*="sessionRow"]');
  var need = [];
  for (var i = 0; i < rows.length; i++) {
    var id = rowId(rows[i], idByTitle);
    if (id) need.push({ row: rows[i], id: id });
  }
  if (!need.length) return;
  var ids = need.map(function (x) { return x.id; });
  var current = snap && snap.current;
  connection.rpc.call("/dsh-skin-chatlab", "previews", { ids: ids }).then(function (res) {
    if (!res || !res.ok) return;
    var map = res.value || {};
    for (var k = 0; k < need.length; k++) {
      var info = map[need[k].id] || { text: "", lastSeq: -1 };
      if (info.text) addPreview(need[k].row, info.text);
      applyUnread(need[k].row, need[k].id, info.lastSeq, current);
    }
  }).catch(function () {});
}

export function decorateTurnStatus() {
  // 原生回合状态("Deep diving...")→ 飞书"正在输入"+三点错峰跳动。
  // 注入到时钟(turnStatusClock)之前，顺序为：正在输入 ● ● ● 31秒。
  // 圆点复用 .cl-typing-dot 的错峰动效(皮肤 CSS 已定义)。1.5s 兜底轮询会补上晚出现的状态。
  var status = document.querySelector('[class*="turnStatus"]:not([class*="turnStatusClock"])');
  if (!status) return;
  if (status.querySelector(".cl-turn-typing")) return; // 已注入
  var wrap = document.createElement("span");
  wrap.className = "cl-turn-typing";
  wrap.innerHTML =
    '<span>正在输入</span>' +
    '<span class="cl-typing-dot"></span>' +
    '<span class="cl-typing-dot"></span>' +
    '<span class="cl-typing-dot"></span>';
  var clock = status.querySelector('[class*="turnStatusClock"]');
  if (clock) status.insertBefore(wrap, clock);
  else status.appendChild(wrap);
}

export function refresh(ctx) {
  var snap = listSnapshot(ctx);
  var idByTitle = {};
  if (snap && snap.byId) {
    for (var i = 0; i < snap.ids.length; i++) {
      var s = snap.byId[snap.ids[i]];
      if (s && s.displayTitle) idByTitle[norm(s.displayTitle)] = s.id;
    }
  }
  decorateBrand();
  decorateSidebar(idByTitle);
  decorateProjects();
  decorateHeader(ctx, snap);
  decorateTurnStatus();
  applyPreviews(ctx, snap, idByTitle);
}
