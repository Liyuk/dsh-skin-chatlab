// DOM helpers：会话行标题/id 反查 + 预览注入 + 未读红点。
import { norm, clipPreview, unreadDecision } from "./utils.js";
import { readSeqs, markRead } from "./session.js";

export function titleOf(row) {
  var t = row.querySelector('[class*="title"]');
  return t ? t.textContent : row.textContent;
}

export function rowId(row, idByTitle) {
  // 我们 decorateSidebar 会让出的 id 落回自己加的 data-cl-session-id，优先它。
  var id = row.getAttribute("data-cl-session-id") ||
    row.getAttribute("data-session-id") || row.getAttribute("data-id") || row.getAttribute("data-key");
  if (id) return id;
  return idByTitle[norm(titleOf(row))];
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

export function applyUnread(row, id, lastSeq, current, active) {
  var m = readSeqs();
  // 无已读记录 = 从未读过(readSeq 0)，符合飞书"没读过的消息就亮红点"语义。
  var readSeq = (id in m) ? m[id] : 0;
  var isActive = active && active[String(id)];
  var isCurrent = id === current;

  var d = unreadDecision(readSeq, lastSeq, isActive, isCurrent);

  // 决策要求推进已读(仅 isCurrent 分支)才写 localStorage。
  if (d.markReadTo !== null && d.markReadTo !== undefined) markRead(id, d.markReadTo);

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
}
