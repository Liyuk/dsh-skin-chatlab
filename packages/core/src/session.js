// 会话数据：读 sessions.list 快照 + 已读 seq 的 localStorage 读写。
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
    var value = JSON.parse(raw);
    return (value && typeof value === "object" && !Array.isArray(value)) ? value : {};
  } catch (e) { return {}; }
}

export function writeSeqs(seqs) {
  try { localStorage.setItem(KEY_READ, JSON.stringify(seqs)); } catch (e) {}
}

export function advanceRead(seqs, id, seq) {
  if (!seqs || typeof seq !== "number" || seq <= 0) return false;
  if ((seqs[id] || 0) >= seq) return false;
  seqs[id] = seq;
  return true;
}

// 兼容单点调用；批量预览路径应传递共享 map，并在完成后统一 writeSeqs。
export function markRead(id, seq) {
  var seqs = readSeqs();
  if (advanceRead(seqs, id, seq)) writeSeqs(seqs);
}
