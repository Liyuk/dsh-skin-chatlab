// DOM helpers：会话行标题/id 反查 + 预览注入 + 未读红点。
import { norm } from "./utils.js";
import { readSeqs, markRead } from "./session.js";

export function titleOf(row) {
  var t = row.querySelector('[class*="title"]');
  return t ? t.textContent : row.textContent;
}

export function rowId(row, idByTitle) {
  var id = row.getAttribute("data-session-id") || row.getAttribute("data-id") || row.getAttribute("data-key");
  if (id) return id;
  return idByTitle[norm(titleOf(row))];
}

export function addPreview(row, text) {
  if (!text) return;
  var existing = row.querySelector(".cl-preview");
  if (existing) {
    // 已有 preview 就更新文本(新回复来了内容会变)，不重复建节点。
    if (existing.textContent !== text) existing.textContent = text;
    return;
  }
  var preview = document.createElement("div");
  preview.className = "cl-preview";
  preview.textContent = text;
  // 只 append 到行尾，绝不移/包 React 的 title 节点(移动 React 节点会导致后续
  // reconcile 的 removeChild 崩溃)。
  row.appendChild(preview);
}

export function applyUnread(row, id, lastSeq, current) {
  var m = readSeqs();
  if (!(id in m)) {
    if (typeof lastSeq === "number" && lastSeq > 0) markRead(id, lastSeq);
    row.classList.remove("cl-unread");
    var d0 = row.querySelector(".cl-unread-dot");
    if (d0) d0.remove();
    return;
  }
  var readSeq = m[id];
  var isCurrent = id === current;
  if (isCurrent) {
    if (lastSeq > readSeq) markRead(id, lastSeq);
    row.classList.remove("cl-unread");
    var b0 = row.querySelector(".cl-unread-dot");
    if (b0) b0.remove();
    return;
  }
  var unread = typeof lastSeq === "number" && lastSeq > readSeq;
  row.classList.toggle("cl-unread", unread);
  var badge = row.querySelector(".cl-unread-dot");
  if (unread && !badge) {
    badge = document.createElement("span");
    badge.className = "cl-unread-dot";
    // 飞书风格：未读红点放头像右上角，绝对定位不占 grid 格子。
    row.appendChild(badge);
  } else if (!unread && badge) {
    badge.remove();
  }
}
