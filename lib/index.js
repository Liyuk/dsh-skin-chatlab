// dsh-skin-chatlab — host half.
//
// The skins themselves are client-only (CSS + DOM decoration, see lib/client.js), but the
// "最近回复预览 + 未读" features need data the browser can't read directly: the last
// message text and the latest event seq of each session. This half exposes that over a
// single loopback RPC channel (`/dsh-skin-chatlab`) that the client half calls.
//
// Data source note: the sidebar lists both LIVE sessions (`ctx.sessions`, in memory)
// and COLD sessions (persisted but not loaded this boot — merged from `sessionPersistence`).
// `ctx.sessions.get(id)` only finds live ones, so for cold ids we fall back to
// `ctx.sessionQuery.readSession(id)` which reads the durable log off disk. Both share the
// same `SessionEvent[]` shape, so `lastActivity` handles either.
//
// It is deliberately thin and additive:
//   - no existing plugin is patched;
//   - the channel only serves read-only projections, so it can't mutate state;
//   - `authority: "loopback"` keeps it reachable only from the local web GUI.
const name = "dsh-skin-chatlab";

// Host services this plugin reads. `connection` is injected lazily (inside apply) so a
// non-web deployment that never composes a connection still boots cleanly. `sessionQuery`
// is read via `ctx.get` because it is optional in minimal profiles (absent → cold fallback
// is skipped and only live sessions get previews).
const inject = ["sessions"];

// Pull the plain-text payload out of a frozen ContentBlock[]. Only `text` blocks carry
// readable prose; reasoning / tool blocks are skipped.
function textOf(content) {
  if (!Array.isArray(content)) return "";
  const parts = [];
  for (let i = 0; i < content.length; i++) {
    const block = content[i];
    if (block && block.type === "text" && typeof block.text === "string") {
      const t = block.text.trim();
      if (t) parts.push(t);
    }
  }
  return parts.join(" ");
}

// Walk a session's frozen event log backwards and return the last REAL conversation
// message (assistant reply preferred, else the last human prompt) plus the seq of the
// most recent such event — the "lastSeq" the client uses for the unread badge.
//
// `user/message` events also carry injected system/context snapshots whose
// `source.kind === "plugin"` — those are NOT conversation, so they are skipped. Only
// `source.kind === "user"` (a real human prompt) counts as a user message.
function lastActivity(events) {
  if (!Array.isArray(events)) return { text: "", lastSeq: -1 };
  let lastText = "";
  let lastSeq = -1;
  for (let i = events.length - 1; i >= 0; i--) {
    const ev = events[i];
    if (!ev || typeof ev !== "object") continue;
    const type = ev.type;
    if (type === "assistant/message") {
      if (ev.seq > lastSeq) lastSeq = ev.seq;
      if (!lastText) {
        const text = textOf(ev.data && ev.data.message && ev.data.message.content);
        if (text) lastText = text;
      }
    } else if (type === "user/message") {
      const src = ev.data && ev.data.source;
      if (src && src.kind !== "user") continue; // injected context/snapshot, not a prompt
      if (ev.seq > lastSeq) lastSeq = ev.seq;
      if (!lastText) {
        const text = textOf(ev.data && ev.data.content);
        if (text) lastText = text;
      }
    }
  }
  return { text: lastText, lastSeq };
}

// Resolve a session's events whether it is live in memory or cold on disk.
async function readEvents(ctx, id) {
  const live = ctx.sessions.get(id);
  if (live && Array.isArray(live.events)) return live.events;
  const query = ctx.get("sessionQuery");
  if (query && typeof query.readSession === "function") {
    try {
      const snap = await query.readSession(id);
      if (snap && Array.isArray(snap.events)) return snap.events;
    } catch (e) {
      // cold read can fail (missing backend, corrupt log) — treat as no data.
    }
  }
  return null;
}

// RPC handler: `(endpoint, payload, signal) => RpcResult`.
//   endpoint "previews": { ids: SessionId[] } -> { [id]: { text, lastSeq } }
//
// 性能关键：sidebar 的会话列表大多是从磁盘持久化读回来的"cold session"，
// 读一次 = 磁盘 IO + zstd 解压 + JSON 解析。client 之前会反复请求，把 Node 事件循环堵死。
// 这里对 cold session 的结果做内存缓存：cold 会话的日志不变，缓存永久有效；
// live 会话每次读内存 events(便宜)并刷新缓存。任何 live 会话 append 事件时失效对应缓存。
async function handler(ctx, endpoint, payload, cache) {
  if (endpoint === "previews") {
    const ids = payload && Array.isArray(payload.ids) ? payload.ids : [];
    const out = {};
    await Promise.all(ids.map(async function (raw) {
      const id = String(raw);
      const live = ctx.sessions.get(id);
      // cold session：命中缓存直接返回，不碰磁盘。
      if (!live) {
        if (cache.has(id)) { out[id] = cache.get(id); return; }
        const events = await readEvents(ctx, id);
        const info = lastActivity(events);
        cache.set(id, info);
        out[id] = info;
        return;
      }
      // live session：读内存 events(便宜)，并刷新缓存。
      const info = lastActivity(live.events);
      cache.set(id, info);
      out[id] = info;
    }));
    return { ok: true, value: out };
  }
  return {
    ok: false,
    error: { code: "not-found", message: "unknown endpoint: " + endpoint, details: {} }
  };
}

function apply(ctx) {
  const cache = new Map(); // sessionId -> { text, lastSeq }(cold 会话的不可变结果)
  // live 会话 append 事件时失效缓存，避免旧 lastSeq 残留。
  ctx.on("session/event", function (session) {
    cache.delete(session.id);
  });
  // The web connection may not exist (non-web profile): inject it so a missing service
  // doesn't abort boot.
  ctx.inject(["connection"], function (web) {
    const dispose = web.connection.rpc.handle(
      "/dsh-skin-chatlab",
      function (endpoint, payload) { return handler(ctx, endpoint, payload, cache); },
      { authority: "loopback" }
    );
    ctx.effect(function () { return dispose; });
  });
}

export { apply, inject, name };
