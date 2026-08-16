import { describe, it, expect } from "vitest";
import { textOf, lastActivity } from "../lib/projection.js";

describe("textOf", () => {
  it("提取多个 text 块并用空格连接", () => {
    const content = [
      { type: "text", text: "  你好  " },
      { type: "text", text: "世界" }
    ];
    expect(textOf(content)).toBe("你好 世界");
  });

  it("跳过 reasoning / tool-call 块", () => {
    const content = [
      { type: "reasoning", text: "先想想" },
      { type: "tool-call", id: "c1", name: "read", arguments: "{}" },
      { type: "text", text: "结论" }
    ];
    expect(textOf(content)).toBe("结论");
  });

  it("非数组返回空串", () => {
    expect(textOf(null)).toBe("");
    expect(textOf(undefined)).toBe("");
    expect(textOf("abc")).toBe("");
  });
});

describe("lastActivity", () => {
  it("空/非法输入返回 -1 和空文本", () => {
    expect(lastActivity(null)).toEqual({ text: "", lastSeq: -1 });
    expect(lastActivity([])).toEqual({ text: "", lastSeq: -1 });
  });

  it("优先返回最后一条 assistant 文本", () => {
    const events = [
      { type: "user/message", seq: 1, data: { content: [{ type: "text", text: "问题" }], source: { kind: "user" } } },
      { type: "assistant/message", seq: 2, data: { message: { content: [{ type: "text", text: "回答" }] } } }
    ];
    expect(lastActivity(events)).toEqual({ text: "回答", lastSeq: 2 });
  });

  it("跳过 source.kind 非 user 的 user/message(注入上下文)", () => {
    const events = [
      { type: "user/message", seq: 1, data: { content: [{ type: "text", text: "真实问题" }], source: { kind: "user" } } },
      { type: "user/message", seq: 2, data: { content: [{ type: "text", text: "运行时上下文快照" }], source: { kind: "plugin" } } }
    ];
    // 最后一条是 plugin 注入，应忽略，返回真实问题
    expect(lastActivity(events)).toEqual({ text: "真实问题", lastSeq: 1 });
  });

  it("skill-catalog 注入也被跳过", () => {
    const events = [
      { type: "user/message", seq: 1, data: { content: [{ type: "text", text: "真实输入" }], source: { kind: "user" } } },
      { type: "user/message", seq: 2, data: { content: [{ type: "text", text: "技能目录" }], source: { kind: "skill-catalog" } } }
    ];
    expect(lastActivity(events)).toEqual({ text: "真实输入", lastSeq: 1 });
  });

  it("assistant 是纯 tool-call(无文本)时回退到最后一条 user 文本", () => {
    const events = [
      { type: "user/message", seq: 1, data: { content: [{ type: "text", text: "帮我查" }], source: { kind: "user" } } },
      { type: "assistant/message", seq: 2, data: { message: { content: [{ type: "tool-call", id: "c1", name: "read", arguments: "{}" }] } } }
    ];
    // assistant 没有 text，lastText 回退到 user 文本，但 lastSeq 仍是 assistant 的 seq 2
    expect(lastActivity(events)).toEqual({ text: "帮我查", lastSeq: 2 });
  });
});
