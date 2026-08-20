// DOM helpers：会话行标题/id 反查 + 预览注入 + 未读红点。
import { norm, clipPreview, unreadDecision } from "./utils.js";
import { readSeqs, markRead, advanceRead } from "./session.js";

export function titleOf(row) {
  var t = row.querySelector('[class*="title"]');
  return t ? t.textContent : row.textContent;
}

export function isSelectedRow(row) {
  return /(^|[\s_])selected([\s_]|$)/.test(row.className || "");
}

export function rowId(row, idByTitle, current) {
  // 宿主自己的属性最可信，其次仅使用唯一标题映射。
  var id = row.getAttribute("data-session-id") || row.getAttribute("data-id") || row.getAttribute("data-key");
  if (id) return id;
  id = idByTitle[norm(titleOf(row))];
  if (id) return id;
  // 自定义 binding 只用于当前 selected 的 blank 行。非当前行宁可暂时不装饰，
  // 也不能把 React 复用后的旧 session id 当成新行身份。
  if (!isSelectedRow(row)) return null;
  var bound = row.getAttribute("data-cl-session-id");
  var boundTitle = row.getAttribute("data-cl-session-title");
  return bound && bound === current && boundTitle === norm(titleOf(row)) ? bound : null;
}

export function addPreview(row, text) {
  // 预览单行，长了截断，避免把整段长文本塞进 DOM(飞书预览一两行即可)。
  var clipped = clipPreview(text);
  if (!clipped) return;
  var existing = row.querySelector(".cl-preview");
  if (existing) {
    // 已有 preview 就更新文本(新回复来了内容会变)，不重复建节点。
    if (existing.textContent !== clipped) existing.textContent = clipped;
    return;
  }
  var preview = document.createElement("div");
  preview.className = "cl-preview";
  preview.textContent = clipped;
  // 只 append 到行尾，绝不移/包 React 的 title 节点(移动 React 节点会导致后续
  // reconcile 的 removeChild 崩溃)。
  row.appendChild(preview);
}

export function clearPreview(row) {
  var preview = row.querySelector(".cl-preview");
  if (preview) preview.remove();
}

export function clearUnread(row) {
  row.classList.remove("cl-unread");
  var badge = row.querySelector(".cl-unread-dot");
  if (badge) badge.remove();
}

export function applyUnread(row, id, lastSeq, current, active, readMap) {
  var m = readMap || readSeqs();
  // 无已读记录 = 从未读过(readSeq 0)，符合飞书"没读过的消息就亮红点"语义。
  var readSeq = (id in m) ? m[id] : 0;
  var isActive = active && active[String(id)];
  var isCurrent = id === current;

  var d = unreadDecision(readSeq, lastSeq, isActive, isCurrent);

  // 决策要求推进已读(仅 isCurrent 分支)才写 localStorage。
  var changed = false;
  if (d.markReadTo !== null && d.markReadTo !== undefined) {
    if (readMap) changed = advanceRead(m, id, d.markReadTo);
    else markRead(id, d.markReadTo);
  }

  row.classList.toggle("cl-unread", d.unread);
  var badge = row.querySelector(".cl-unread-dot");
  if (d.unread && !badge) {
    badge = document.createElement("span");
    badge.className = "cl-unread-dot";
    // 飞书风格：未读红点放头像右上角，绝对定位不占 grid 格子。
    row.appendChild(badge);
  } else if (!d.unread && badge) {
    badge.remove();
  }
  return changed;
}
