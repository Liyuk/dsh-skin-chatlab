// decorators：注入品牌 logo、头像、项目方块、预览、未读；以及刷新入口。
// 关键约束：DSH 是 React 应用，这里只 appendChild 自己的节点、绝不动 React 的节点。
import { norm, hashHue, resolveSidebarSeed, buildActiveSet, buildRunningSet, assignRowIds, buildIdByTitle } from "./utils.js";
import { avatarUrl, updateAvatar } from "./avatar.js";
import { listSnapshot, readSeqs, writeSeqs } from "./session.js";
import { titleOf, rowId, addPreview, applyUnread, clearPreview, clearUnread, isSelectedRow } from "./dom.js";
import { skinRegistry } from "./registry.js";
import { readSkin } from "./prefs.js";
import { avatarUrlForId, rememberAvatar, flushAvatarMap, exposeAvatarMap } from "./avatarStore.js";

// 品牌：保留原 DeepSeek 鲸鱼 icon，只在旁边追加当前皮肤名徽章(跟随皮肤走)。
function appendBrandMark(container, svg) {
  if (!svg) return;
  var mark = document.createElement("span");
  mark.className = "cl-brand-mark";
  mark.setAttribute("aria-hidden", "true");
  var image = document.createElement("img");
  image.className = "cl-brand-mark-image";
  image.setAttribute("alt", "");
  image.setAttribute("aria-hidden", "true");
  image.setAttribute("draggable", "false");
  image.setAttribute("src", "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg));
  mark.appendChild(image);
  container.appendChild(mark);
}

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
    existing.textContent = "";
    appendBrandMark(existing, def.brand && typeof def.brand.svg === "string" ? def.brand.svg : "");
    var existingLabel = document.createElement("span");
    existingLabel.className = "cl-brand-label";
    existingLabel.textContent = label;
    existing.appendChild(existingLabel);
    existing.setAttribute("aria-label", label);
    existing.setAttribute("title", label);
    return;
  }
  // 采用皮肤自带的轻量 logo + 字标，而不是通用文字胶囊；SVG 来自受信任的皮肤定义，
  // 不请求图片资源，也不会覆盖 React 管理的原始鲸鱼图标。
  var badge = document.createElement("span");
  badge.className = "cl-brand-skin";
  badge.setAttribute("aria-label", label);
  badge.setAttribute("title", label);

  if (def.brand && typeof def.brand.svg === "string" && def.brand.svg) {
    appendBrandMark(badge, def.brand.svg);
  }

  var wordmark = document.createElement("span");
  wordmark.className = "cl-brand-label";
  wordmark.textContent = label;
  badge.appendChild(wordmark);
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
      _id: rowId(row, idByTitle, current),
      title: norm(titleOf(row)),
      selected: isSelectedRow(row)
    });
  }
  var assigned = assignRowIds(descs, current);
  for (i = 0; i < rows.length; i++) {
    var r = rows[i];
    var info = assigned[i];
    var id = info._id;
    var previousId = r.getAttribute("data-cl-session-id");
    if (id && previousId !== id) clearRowIdentityState(r);
    if (id) {
      r.setAttribute("data-cl-session-id", id);
      r.setAttribute("data-cl-session-title", info.title);
    } else {
      // 没有可靠身份时清掉旧 binding，避免 React 复用行泄漏上一会话状态。
      clearRowIdentityState(r);
      r.removeAttribute("data-cl-session-id");
      r.removeAttribute("data-cl-session-title");
    }
    var av = r.querySelector(".cl-avatar");
    // 统一 seed：有 id 一律用 id(与 header 同源)；真正 parse 不出的极端盲点
    // 才回退 resolveSidebarSeed 的 title 兜底。seed/id 写入持久化映射表，保证
    // 任何位置按同一 id 拿到同一 URL。
    var seed = id ? id : resolveSidebarSeed(null, info.title, current, currentDisplay);
    var src = id ? rememberAvatar(id, id, null, true) : avatarUrl(seed);
    var nextAvatar = updateAvatar(av, seed, src);
    if (!av) {
      // 只 append 到行尾，不 insertBefore 到 React 节点前(避免干扰 React reconcile)。
      r.appendChild(nextAvatar);
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

function clearRowIdentityState(row) {
  clearPreview(row);
  clearUnread(row);
  var dot = row.querySelector(".cl-running-dot");
  if (dot) dot.remove();
}

// 项目组图标：在原有文件夹 SVG 旁叠加彩色圆角方块 + 首字母。
export function decorateProjects() {
  var rows = document.querySelectorAll('[class*="projectRow"]');
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    var folderSlot = row.querySelector('[class*="folder"]');
    if (!folderSlot) continue;
    var title = row.querySelector('[class*="projectText"] [class*="title"], [class*="projectText"]');
    var text = norm(title ? title.textContent : row.textContent);
    var initial = (text.charAt(0) || "?").toUpperCase();
    var hue = hashHue(text);
    var block = folderSlot.querySelector(".cl-project-icon");
    if (!block) {
      block = document.createElement("span");
      block.className = "cl-project-icon";
      folderSlot.appendChild(block); // 只 append，不删原 SVG
    }
    // React 可复用项目行；每轮同步文字和颜色，避免保留上一项目的图标。
    block.textContent = initial;
    block.style.background = "hsl(" + hue + ", 70%, 55%)";
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
  var nextAvatar = updateAvatar(existing, seed, src, "cl-header-avatar");
  if (!existing) {
    // append 到末尾，不 insertBefore 到 React 节点前(避免干扰 React 的节点顺序)
    cluster.appendChild(nextAvatar);
  }
}

var previewStates = new WeakMap();
var PREVIEW_TIMEOUT_MS = 8000;

function previewStateFor(ctx) {
  var state = previewStates.get(ctx);
  if (!state) {
    state = { generation: 0, inFlight: false, queued: null, disposed: false, connection: null, timeout: null };
    previewStates.set(ctx, state);
  }
  return state;
}

function rowStillMatchesPreview(ctx, item, latest, latestIdByTitle) {
  if (item.row.isConnected === false) return false;
  // 用最新 session snapshot 重建 title 映射；非选中行若被 React 复用为另一会话，
  // 不能继续用请求发起时的映射确认身份。latest/id map 由一次 RPC 响应共享，
  // 避免 N 行重复 getSnapshot + buildIdByTitle 的 O(N²) 开销。
  latest = latest || listSnapshot(ctx);
  if (!latest) return false;
  latestIdByTitle = latestIdByTitle || buildIdByTitle(latest);
  if (isSelectedRow(item.row) && latest.current !== item.current) return false;
  // 请求开始后 React 可能复用同一 DOM 行；必须同时验证本轮写入的 id、标题绑定
  // 和 React 标题节点身份，不能只拿旧快照再反查一次。
  if (item.row.getAttribute("data-cl-session-id") !== item.id) return false;
  if (item.row.getAttribute("data-cl-session-title") !== norm(titleOf(item.row))) return false;
  if (item.row.querySelector('[class*="title"]') !== item.titleNode) return false;
  return rowId(item.row, latestIdByTitle, latest.current) === item.id;
}

function finishPreviewRequest(ctx, state) {
  state.inFlight = false;
  var queued = state.queued;
  state.queued = null;
  if (queued && !state.disposed) startPreviewRequest(ctx, state, queued);
}

function startPreviewRequest(ctx, state, request) {
  state.inFlight = true;
  var settled = false;
  var timeout = setTimeout(function () {
    if (settled) return;
    request.expired = true;
    settled = true;
    if (state.timeout === timeout) state.timeout = null;
    // transport 卡住时释放 single-flight，让后续轮询可以恢复预览更新。
    finishPreviewRequest(ctx, state);
  }, PREVIEW_TIMEOUT_MS);
  state.timeout = timeout;
  function settle() {
    if (settled) return;
    settled = true;
    clearTimeout(timeout);
    if (state.timeout === timeout) state.timeout = null;
    finishPreviewRequest(ctx, state);
  }
  var promise;
  try {
    promise = request.connection.rpc.call("/dsh-skin-chatlab", "previews", { ids: request.ids });
  } catch (e) {
    // 临时 RPC 失败保留上一次已确认的预览/未读状态，后续轮询会重试。
    settle();
    return;
  }
  Promise.resolve(promise).then(function (res) {
    if (request.expired) return;
    if (state.disposed || request.generation !== state.generation || state.connection !== request.connection) {
      settle();
      return;
    }
    try {
      if (!res || !res.ok) return;
      var map = res.value || {};
      var latest = listSnapshot(ctx);
      var latestIdByTitle = buildIdByTitle(latest);
      var readMap = readSeqs();
      var readChanged = false;
      for (var i = 0; i < request.items.length; i++) {
        var item = request.items[i];
        if (!rowStillMatchesPreview(ctx, item, latest, latestIdByTitle)) continue;
        if (!Object.prototype.hasOwnProperty.call(map, item.id)) continue;
        var info = map[item.id];
        if (info && info.unavailable) continue;
        if (!info) continue;
        if (info.text) addPreview(item.row, info.text);
        else clearPreview(item.row);
        if (applyUnread(item.row, item.id, info.lastSeq, request.current, request.active, readMap)) {
          readChanged = true;
        }
      }
      if (readChanged) writeSeqs(readMap);
    } finally {
      settle();
    }
  }).catch(function () {
    // 临时 RPC/磁盘失败保留已确认状态；下一轮会重试。
    settle();
  });
}

export function disposePreviews(ctx) {
  var state = previewStates.get(ctx);
  if (!state) return;
  state.disposed = true;
  state.generation += 1;
  state.queued = null;
  state.inFlight = false;
  if (state.timeout) clearTimeout(state.timeout);
  state.timeout = null;
  previewStates.delete(ctx);
}

export function applyPreviews(ctx, snap, idByTitle, active) {
  var state = previewStateFor(ctx);
  state.disposed = false;
  var connection = ctx.connection;
  state.connection = connection;
  if (!connection || !connection.rpc || typeof connection.rpc.call !== "function") return;
  var current = snap && snap.current;
  var rows = document.querySelectorAll('[class*="sessionRow"]');
  var items = [];
  for (var i = 0; i < rows.length; i++) {
    var id = rowId(rows[i], idByTitle, current);
    if (id) {
      items.push({
        row: rows[i],
        id: id,
        idByTitle: idByTitle,
        current: current,
        titleNode: rows[i].querySelector('[class*="title"]')
      });
    }
  }
  if (!items.length) return;
  var request = {
    generation: state.generation,
    connection: connection,
    ids: items.map(function (item) { return item.id; }),
    items: items,
    current: current,
    active: active
  };
  // 慢的 cold-session 读取只能保留一个在途请求；刷新期间只保留最新快照，
  // 避免 1.5 秒轮询把磁盘读取和乱序响应叠加起来。
  if (state.inFlight) {
    state.queued = request;
    return;
  }
  startPreviewRequest(ctx, state, request);
}

export function decorateTurnStatus() {
  // 原生回合状态("Deep diving...")→ 飞书"正在输入"+三点错峰跳动。
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
  // 只 append 自己的节点；视觉顺序交给 skin CSS 的 flex/order，绝不移动 React 的时钟节点。
  status.appendChild(wrap);
}

// 当前会话是否处于"正在思考/输出"状态(原生 turnStatus 元素存在)。
// 已废弃：turnStatus 的渲染条件就是 session.running(与蓝点同源)，running=false 时
// turnStatus 也不存在，故此兜底无效。改用实时的 ctx.sessions.get(id).running(见 refresh)。
export function hasTurnStatus() {
  return !!document.querySelector('[class*="turnStatus"]:not([class*="turnStatusClock"])');
}

export function refresh(ctx) {
  var snap = listSnapshot(ctx);
  var idByTitle = buildIdByTitle(snap);
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
  // 侧栏和顶栏会在本轮各自补齐头像映射；结束时一次性落盘，避免逐行同步写 storage。
  flushAvatarMap();
  decorateTurnStatus();
  applyPreviews(ctx, snap, idByTitle, running);
}
