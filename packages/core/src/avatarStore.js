// 头像持久化存储：以「会话 id」为 key 维护一张 id→头像URL 的映射表。
// 为什么需要它：聊天顶栏(decorateHeader)与左侧用户列表(decorateSidebar)各自由不同的
// 推导链解析 seed(end-to-end 靠 data-cl 回写/title 反查/selected 类名)，blank 新会话时
// 推导链可能断，同一 id 两处算出不同 seed → 头像不一致。本表把「已有 id 时」的
// seed→URL 结果落盘为唯一权威来源，任何位置都按 id 从这张表取同一张头像，从根上保证同源。
//
// 注意：这张表只覆盖"能拿到 session id"的会话。对侧栏里某个暂无法解析 id 的行(极端 blank
// 盲点)，仍走 resolveSidebarSeed 的 title 兜底；但只要该行后续一旦解析出 id，下一次 refresh
// 就会用 id 覆盖写入本表，从而收敛到与 header 同源。
import { KEY_AVATAR_MAP } from "./prefs.js";

var MAX_ENTRIES = 200; // 防止无限膨胀：超出按时间戳淘汰最旧的。

/** 读整张映射表(id → {seed, url, at})。 */
export function readAvatarMap() {
  try {
    var raw = localStorage.getItem(KEY_AVATAR_MAP);
    if (!raw) return {};
    var v = JSON.parse(raw);
    return (v && typeof v === "object" && !Array.isArray(v)) ? v : {};
  } catch (e) { return {}; }
}

/** 按 id 取头像 URL：命中缓存直接回、否则回 null(调用方决定是否生成)。 */
export function avatarUrlForId(id) {
  if (!id) return null;
  var map = readAvatarMap();
  var e = map[id];
  return (e && e.url) ? e.url : null;
}

/**
 * 固化某会话 id 的头像到映射表。seed 优先取调用方给的外部值(与 header 同源时的 id)，
 * 没有则用 id 本身。返回最终 URL(调用方可直接用它设 img.src)。
 */
export function rememberAvatar(id, seed, url) {
  if (!id) return null;
  var finalSeed = seed || id;
  var finalUrl = url || "https://api.dicebear.com/9.x/avataaars/svg?radius=50&size=32&seed=" + encodeURIComponent(finalSeed);
  var map = readAvatarMap();
  map[id] = { seed: finalSeed, url: finalUrl, at: Date.now() };
  // 淘汰最旧，避免 localStorage 无限膨胀。
  var keys = Object.keys(map);
  if (keys.length > MAX_ENTRIES) {
    keys.sort(function (a, b) { return ((map[a] && map[a].at) || 0) - ((map[b] && map[b].at) || 0); });
    var drop = keys.length - MAX_ENTRIES;
    for (var i = 0; i < drop; i++) delete map[keys[i]];
  }
  try { localStorage.setItem(KEY_AVATAR_MAP, JSON.stringify(map)); } catch (e) {}
  return finalUrl;
}

/** 调试用：把整张表挂到 window.__chatlabAvatarMap(方便 reload 后看 id→url 对应关系)。 */
export function exposeAvatarMap() {
  try {
    var map = readAvatarMap();
    window.__chatlabAvatarMap = map;
  } catch (e) {}
}
