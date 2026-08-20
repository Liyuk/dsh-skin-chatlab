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

// 会话头像 seed：语义必须与聊天顶栏(decorateHeader)完全同源，保证左侧列表
// 头像与聊天头标一一对应。有 id 用 id；当前会话回退用 current(id)；
// 再不行才用标题文本兜底。
export function resolveSidebarSeed(id, title, current, currentDisplay) {
  return id ||
    (current && currentDisplay && currentDisplay === title ? current : null) ||
    title ||
    "dsh";
}

// 会话行 id 分配(两段式纯逻辑，供 decorateSidebar 调用)。
// rows 需为形如 [{_id, title, selected}] 的数组；返回分配后的 [{_id, seed}] 数组。
// 关键：当前会话若无法通过 title 反查(blank"新会话"行)，就靠唯一可靠的
// selected 信号强制认领 current，保证与 header 的 current(id) 同源。
// - _id      本轮已解析出的 id(来自 data-cl 或 title 反查)，可为 null
// - title    该行标题文本(norm 后)
// - selected 该行是否带 React 选中态类名
// - current  快照的 snap.current(会话 id)
export function assignRowIds(rows, current) {
  var claimed = false;
  var out = [];
  var i, row;
  // 第一轮：尽量用已有 id。
  for (i = 0; i < rows.length; i++) {
    row = rows[i];
    var rid = row._id || null;
    if (rid && current && rid === current) claimed = true;
    out.push({ _id: rid, title: row.title || "", selected: !!row.selected });
  }
  // 第二轮：current 尚未被认领 → 付给 selected 且无 id 的那行。
  if (current && !claimed) {
    for (i = 0; i < out.length; i++) {
      if (!out[i]._id && out[i].selected) {
        out[i]._id = current;
        claimed = true;
        break;
      }
    }
  }
  return out;
}
export function buildIdByTitle(snap) {
  var out = {};
  var ambiguous = {};
  if (!snap || !snap.byId || !Array.isArray(snap.ids)) return out;
  for (var i = 0; i < snap.ids.length; i++) {
    var id = snap.ids[i];
    var s = snap.byId[id];
    var title = norm(s && s.displayTitle);
    if (!title) continue;
    // 重复标题无法从 DOM 唯一反查 session，宁可不装饰也不能映射到错误会话。
    if (out[title] && out[title] !== id) {
      delete out[title];
      ambiguous[title] = true;
    } else if (!ambiguous[title]) {
      out[title] = id;
    }
  }
  return out;
}


// 会话预览文本：折叠空白 + 超长截断(单行，飞书风格一两行即可)。
export function clipPreview(text) {
  var s = norm(text);
  if (s.length > 90) s = s.slice(0, 90) + "…";
  return s;
}

// 未读红点决策(纯函数，供 applyUnread 调用)。
// readSeq：已读到的消息 seq(无记录时传 0，表示"从未读过"=未读)；lastSeq 最新消息 seq。
// 返回 { unread, markReadTo }：unread 是否显示红点；markReadTo 非 null 表示要推进已读到该 seq。
// 决策(与蓝点/运行状态联动，优先级从上到下)：
// 1. isActive(运行中/等交互/子代理在跑)→ 不显示红点(蓝点已表达动静)，且不推进已读(跑完补红点)。
// 2. isCurrent(正在看)→ 不显示红点，并把已读推进到 lastSeq(自动已读)。
// 3. 其余→ lastSeq > readSeq 就显示红点(有未读)。
export function unreadDecision(readSeq, lastSeq, isActive, isCurrent) {
  if (isActive) return { unread: false, markReadTo: null };
  if (isCurrent) {
    var to = (typeof lastSeq === "number" && lastSeq > readSeq) ? lastSeq : null;
    return { unread: false, markReadTo: to };
  }
  var unread = typeof lastSeq === "number" && lastSeq > readSeq;
  return { unread: unread, markReadTo: null };
}

// 从会话列表快照构建"活跃"会话集合(键为原始 session id，值为 true)。
// 活跃判定：running 或 pendingInteraction(等批准/审阅/问答)自身活跃；
// 主会话派子代理去跑时父会话 running 可能为 false，但子代理(running/pending)在工作，
// 沿 parentId 把活跃传导到祖先行——与 DSH 原生 runningSubagentCount 同语义，
// 避免只靠 running 漏掉子代理驱动的任务。
// runningOf(id)：可选回调，用于用"实时 running"(如 ctx.sessions.get(id).running，推送型)
// 覆盖快照里的 running(拉取型，有延迟)；缺省时回退 s.running。
export function buildActiveSet(snapFull, runningOf) {  var out = {};  if (!snapFull || !snapFull.byId) return out;
  var direct = {};
  var ids = snapFull.ids || [];
  for (var i = 0; i < ids.length; i++) {
    var id = ids[i];
    var s = snapFull.byId[id];
    var r = runningOf ? runningOf(id) : !!(s && s.running);
    if (s && (r || s.pendingInteraction)) direct[id] = true;
  }
  for (var id2 in direct) {
    out[id2] = true;
    var p = snapFull.byId[id2];
    var anc = p ? p.parentId : null;
    var guard = 0;
    while (anc && !out[anc] && guard++ < 1000) {
      out[anc] = true;
      var a = snapFull.byId[anc];
      anc = a ? a.parentId : null;
    }
  }
  return out;
}

// 从会话列表快照构建"正在运行"会话集合(只 running + 子代理传导，不含 pendingInteraction)。
// 用途：压未读红点。pendingInteraction(等批准/审阅/问答)是"会话停下来等你处理"，
// 不是"正在运行"，它最需要红点提醒，不该被压掉——故与蓝点的 active 集(含 pendingInteraction)分开。
// runningOf(id)：同 buildActiveSet，可选实时 running 回调。
export function buildRunningSet(snapFull, runningOf) {
  var out = {};
  if (!snapFull || !snapFull.byId) return out;
  var direct = {};
  var ids = snapFull.ids || [];
  for (var i = 0; i < ids.length; i++) {
    var id = ids[i];
    var s = snapFull.byId[id];
    var r = runningOf ? runningOf(id) : !!(s && s.running);
    if (s && r) direct[id] = true;
  }
  for (var id2 in direct) {
    out[id2] = true;
    var p = snapFull.byId[id2];
    var anc = p ? p.parentId : null;
    var guard = 0;
    while (anc && !out[anc] && guard++ < 1000) {
      out[anc] = true;
      var a = snapFull.byId[anc];
      anc = a ? a.parentId : null;
    }
  }
  return out;
}
