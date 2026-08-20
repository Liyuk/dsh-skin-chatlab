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
import { avatarUrl } from "./avatar.js";

var MAX_ENTRIES = 200; // 防止无限膨胀：超出按时间戳淘汰最旧的。
var avatarMap = null;
var avatarUse = {}; // 运行时 LRU，不为每次 refresh 额外写 localStorage。
var avatarDirty = false;

function touchAvatar(id) {
  avatarUse[id] = Date.now();
}

function loadAvatarMap() {
  if (avatarMap) return avatarMap;
  try {
    var raw = localStorage.getItem(KEY_AVATAR_MAP);
    var value = raw ? JSON.parse(raw) : {};
    avatarMap = (value && typeof value === "object" && !Array.isArray(value)) ? value : {};
  } catch (e) {
    avatarMap = {};
  }
  return avatarMap;
}

function isLegacyUrl(url, seed) {
  if (typeof url !== "string" || !url) return true;
  return url.indexOf("seed=" + encodeURIComponent(seed)) >= 0;
}

function persistAvatarMap(map) {
  try {
    localStorage.setItem(KEY_AVATAR_MAP, JSON.stringify(map));
    avatarDirty = false;
    return true;
  } catch (e) {
    // 保持 dirty：临时配额/隐私模式错误恢复后，后续刷新仍可重试写入。
    return false;
  }
}

// decorateSidebar 会在单次 refresh 内处理多行。延后到 refresh 尾部统一写入，
// 避免首次加载几十/上百条会话时反复同步 JSON.stringify + localStorage.setItem。
export function flushAvatarMap() {
  if (!avatarDirty || !avatarMap) return false;
  return persistAvatarMap(avatarMap);
}

/** 读整张映射表(id → {seed, url, at})。 */
export function readAvatarMap() {
  return loadAvatarMap();
}

/** 按 id 取头像 URL：命中缓存直接回、否则回 null(调用方决定是否生成)。 */
export function avatarUrlForId(id) {
  if (!id) return null;
  var entry = loadAvatarMap()[id];
  // 旧版本曾将原始 id/title 放到 DiceBear URL。首次刷新时强制迁移到不透明 token。
  if (!entry || !entry.url || isLegacyUrl(entry.url, entry.seed || id)) return null;
  touchAvatar(id);
  return entry.url;
}

/**
 * 固化某会话 id 的头像到映射表。seed 优先取调用方给的外部值(与 header 同源时的 id)，
 * 没有则用 id 本身。返回最终 URL(调用方可直接用它设 img.src)。
 */
export function rememberAvatar(id, seed, url, deferPersist) {
  if (!id) return null;
  var finalSeed = seed || id;
  var map = loadAvatarMap();
  var previous = map[id];
  if (previous && previous.seed === finalSeed && !isLegacyUrl(previous.url, finalSeed)) {
    touchAvatar(id);
    return previous.url;
  }
  var finalUrl = url || avatarUrl(finalSeed);
  map[id] = { seed: finalSeed, url: finalUrl, at: Date.now() };
  avatarDirty = true;
  touchAvatar(id);
  // 淘汰最旧，避免 localStorage 无限膨胀。
  var keys = Object.keys(map);
  if (keys.length > MAX_ENTRIES) {
    keys.sort(function (a, b) {
      var aUsed = avatarUse[a] || ((map[a] && map[a].at) || 0);
      var bUsed = avatarUse[b] || ((map[b] && map[b].at) || 0);
      return aUsed - bUsed;
    });
    var drop = keys.length - MAX_ENTRIES;
    for (var i = 0; i < drop; i++) {
      delete avatarUse[keys[i]];
      delete map[keys[i]];
      avatarDirty = true;
    }
  }
  if (!deferPersist) persistAvatarMap(map);
  return finalUrl;
}

/** 调试用：把整张表挂到 window.__chatlabAvatarMap(方便 reload 后看 id→url 对应关系)。 */
export function exposeAvatarMap() {
  try { window.__chatlabAvatarMap = loadAvatarMap(); } catch (e) {}
}
