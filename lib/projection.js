// 会话日志投影：从冻结的事件日志里提取"最近一条真实消息"的文本和 seq。
// 纯函数，无副作用，可单元测试。host 端 lib/index.js 复用这里。

// 从 ContentBlock[] 提取纯文本。只认 text 块；reasoning / tool-call 跳过。
export function textOf(content) {
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

// 从事件日志(倒序)找最后一条真实对话消息：
// - assistant/message 优先
// - user/message 只在 source.kind === "user" 才算(排除 plugin/skill-catalog 注入)
// 返回 { text, lastSeq }，lastSeq 是最近一条消息事件(不管 text 是否为空)的 seq。
export function lastActivity(events) {
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
      if (src && src.kind !== "user") continue; // 注入的上下文/快照，不是真人输入
      if (ev.seq > lastSeq) lastSeq = ev.seq;
      if (!lastText) {
        const text = textOf(ev.data && ev.data.content);
        if (text) lastText = text;
      }
    }
  }
  return { text: lastText, lastSeq };
}
