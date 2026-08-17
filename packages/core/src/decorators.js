// decorators：注入品牌 logo、头像、项目方块、预览、未读；以及刷新入口。
// 关键约束：DSH 是 React 应用，这里只 appendChild 自己的节点、绝不动 React 的节点。
import { norm, hashHue, resolveSidebarSeed, buildActiveSet, buildRunningSet, assignRowIds } from "./utils.js";
import { makeAvatar, avatarUrl } from "./avatar.js";
import { listSnapshot } from "./session.js";
import { titleOf, rowId, addPreview, applyUnread } from "./dom.js";
import { skinRegistry } from "./registry.js";
import { readSkin } from "./prefs.js";
import { avatarUrlForId, rememberAvatar, exposeAvatarMap } from "./avatarStore.js";

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

export function decorateSidebar(snap, idByTitle, active) {
  // 头像 seed 必须与聊天顶栏(decorateHeader)一致，一一对应。
  // 关键：DSH 的 sessionRow 上没有任何 data-session-id/data-id/data-key
  // (React 只渲染 role/aria-selected 和 CSS-module 类名)，rowId 只能靠
  // displayTitle→id 反查；而 blank(新建)会话行显示的是本地化"新会话"，
  // 与快照里 displayTitle(=cwd 名或原始 id)对不上 → 反查必然 miss。
  // 根治：id 分配交给 assignRowIds(纯函数，可测)——能解析出 id 的行用 id；
  // 若 current 尚未被认领，就靠唯一的 selected 信号强制归给"选中且缺 id"的行，
  // 让它与 header 铁定同源；最终统一写入持久化 id→头像 映射表。
  var current = snap && snap.current;
  var currentDisplay = current
    ? ((snap.byId && snap.byId[current]) || {}).displayTitle
    : null;
  var rows = document.querySelectorAll('[class*="sessionRow"]');
  var descs = [];
  var i;
  for (i = 0; i < rows.length; i++) {
    var row = rows[i];
    descs.push({
      _id: rowId(row, idByTitle),
      title: norm(titleOf(row)),
      selected: current && isCurrentRow(row, current, idByTitle)
    });
  }
  var assigned = assignRowIds(descs, current);
  for (i = 0; i < rows.length; i++) {
    var r = rows[i];
    var info = assigned[i];
    var id = info._id;
    var av = r.querySelector(".cl-avatar");
    if (id) r.setAttribute("data-cl-session-id", id);
    // 统一 seed：有 id 一律用 id(与 header 同源)；真正 parse 不出的极端盲点
    // 才回退 resolveSidebarSeed 的 title 兜底。seed/id 写入持久化映射表，保证
    // 任何位置按同一 id 拿到同一 URL。
    var seed = id ? id : resolveSidebarSeed(null, info.title, current, currentDisplay);
    var src = id ? rememberAvatar(id, id, null) : avatarUrl(seed);
    if (av) {
      // 已有头像而 seed 变了才更新(标题重命名等场景)；种子一致则不动。
      if (av.getAttribute("data-seed") !== seed) {
        av.setAttribute("data-seed", seed);
        av.src = src;
      }
    } else {
      var fresh = makeAvatar(seed);
      fresh.src = src;
      // 只 append 到行尾，不 insertBefore 到 React 节点前(避免干扰 React reconcile)。
      r.appendChild(fresh);
    }
    // 每次 refresh 都重算进行中状态，让圆点随 running 出现/消失(低频轮询驱动)。
    applyAvatarStatus(r, active[String(id)], snap, id);
  }

  // 把当前 id→url 映射表挂到 window，方便 reload 后一眼核对两侧是否同源。
  exposeAvatarMap();
}

// 头像右下角"进行中"呼吸圆点：会话正在跑任务时显示，空闲/完成即移除。
// 复用未读红点的定位套路(对行绝对定位)，只 append 自己的节点、不动 React。
export function applyAvatarStatus(row, running, snap, id) {
  var dot = row.querySelector(".cl-running-dot");
  // 轻量调试钩子：仅在有 id 时记录，供排查(reload 后 window.__chatlabDebug 可见)。
  if (id && snap && snap.byId) {
    var rec = window.__chatlabDebug = window.__chatlabDebug || {};
    var s = snap.byId[id];
    rec[id] = { running: !!(s && s.running), pending: (s && s.pendingInteraction) || null, dot: running };
  }
  if (running && !dot) {
    dot = document.createElement("span");
    dot.className = "cl-running-dot";
    row.appendChild(dot);
  } else if (!running && dot) {
    dot.remove();
  }
}

// 行是否为当前会话：优先用显式 data-cl-session-id，其次靠标题反查，
// 最后看行是否带 React 的选中态类名([class*="selected"]，与当前会话等价)。
function isCurrentRow(row, current, idByTitle) {
  var stored = row.getAttribute("data-cl-session-id");
  if (stored) return stored === current;
  if (idByTitle[norm(titleOf(row))] === current) return true;
  return /(^|[\s_])selected([\s_]|$)/.test(row.className || "");
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
  // 与侧栏共用 id→头像 映射表：有 current(id) 一律从表取/写同一 URL，
  // 保证聊天头与左侧该会话行的头像铁定同源(同一 id 同一图)。
  var src;
  if (current) {
    src = avatarUrlForId(current) || rememberAvatar(current, current, null);
  } else {
    src = avatarUrl(seed);
  }
  var existing = cluster.querySelector(".cl-avatar");
  if (existing) {
    if (existing.getAttribute("data-seed") === seed) return;
    // 更新已有头像(我自己 append 的节点，安全)
    existing.setAttribute("data-seed", seed);
    existing.src = src;
    return;
  }
  var fresh = makeAvatar(seed, "cl-header-avatar");
  fresh.src = src;
  // append 到末尾，不 insertBefore 到 React 节点前(避免干扰 React 的节点顺序)
  cluster.appendChild(fresh);
}

export function applyPreviews(ctx, snap, idByTitle, active) {
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
      applyUnread(need[k].row, need[k].id, info.lastSeq, current, active);
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

// 当前会话是否处于"正在思考/输出"状态(原生 turnStatus 元素存在)。
// 已废弃：turnStatus 的渲染条件就是 session.running(与蓝点同源)，running=false 时
// turnStatus 也不存在，故此兜底无效。改用实时的 ctx.sessions.get(id).running(见 refresh)。
export function hasTurnStatus() {
  return !!document.querySelector('[class*="turnStatus"]:not([class*="turnStatusClock"])');
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
  // 活跃会话集(running/pendingInteraction/子代理)：decorateSidebar 用它亮蓝点。
  // 压红点则用 running 集(不含 pendingInteraction)——等批准/审阅/问答的会话
  // 是"等你处理"，不该被压红点，反而该亮红点提醒。
  // 关键：running 用实时的 ctx.sessions.get(id).running(推送型，status 帧驱动)，
  // 而不是 snap.byId.running(拉取型，refreshList 才有)——后者在 agent 起步/结束瞬间
  // 有延迟，导致蓝点"时有时无"。
  var runningOf = null;
  if (ctx.sessions && typeof ctx.sessions.get === "function") {
    runningOf = function (id) {
      var sess = ctx.sessions.get(id);
      if (sess) return !!sess.running; // live session：实时 running
      var s = snap && snap.byId ? snap.byId[id] : null;
      return !!(s && s.running); // cold：回退快照
    };
  }
  var active = buildActiveSet(snap, runningOf);
  var running = buildRunningSet(snap, runningOf);
  decorateBrand();
  decorateSidebar(snap, idByTitle, active);
  decorateProjects();
  decorateHeader(ctx, snap);
  decorateTurnStatus();
  applyPreviews(ctx, snap, idByTitle, running);
}
