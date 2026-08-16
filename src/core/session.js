// session 数据：读 sessions.list 快照 + 已读 seq 的 localStorage 读写。
import { KEY_READ } from "./prefs.js";

export function listSnapshot(ctx) {
  try {
    var list = ctx.sessions && ctx.sessions.list;
    if (!list || typeof list.getSnapshot !== "function") return null;
    var snap = list.getSnapshot();
    if (!snap || !Array.isArray(snap.ids)) return null;
    return snap;
  } catch (e) { return null; }
}

export function readSeqs() {
  try {
    var raw = localStorage.getItem(KEY_READ);
    if (!raw) return {};
    var v = JSON.parse(raw);
    return (v && typeof v === "object" && !Array.isArray(v)) ? v : {};
  } catch (e) { return {}; }
}

export function markRead(id, seq) {
  if (typeof seq !== "number" || seq <= 0) return;
  var m = readSeqs();
  if ((m[id] || 0) >= seq) return;
  m[id] = seq;
  try { localStorage.setItem(KEY_READ, JSON.stringify(m)); } catch (e) {}
}
