import { describe, it, expect } from "vitest";
import { norm, hashHue, resolveSidebarSeed, buildActiveSet, buildRunningSet, clipPreview, assignRowIds, unreadDecision } from "../packages/core/src/utils.js";

describe("norm", () => {
  it("去除首尾空白并把连续空白折叠为单个空格", () => {
    expect(norm("  hello   world  ")).toBe("hello world");
    expect(norm("a\t\n b")).toBe("a b");
  });

  it("null/undefined 返回空串", () => {
    expect(norm(null)).toBe("");
    expect(norm(undefined)).toBe("");
    expect(norm(123)).toBe("123");
  });
});

describe("hashHue", () => {
  it("确定性：同一输入返回同一 hue", () => {
    expect(hashHue("feishu")).toBe(hashHue("feishu"));
  });

  it("返回 0-359 之间的整数", () => {
    const h = hashHue("anything");
    expect(Number.isInteger(h)).toBe(true);
    expect(h).toBeGreaterThanOrEqual(0);
    expect(h).toBeLessThan(360);
  });

  it("空串返回 0(兜底)", () => {
    expect(hashHue("")).toBe(0);
  });
});

// 头像 seed 必须与聊天顶栏(decorateHeader)同源，保证左侧列表头像与聊天头一一对应。
describe("resolveSidebarSeed", () => {
  it("有 id 时用 id(即与 header 的 snap.current 相同 seed)", () => {
    expect(resolveSidebarSeed("sess-abc", "标题", "sess-abc", "标题")).toBe("sess-abc");
    expect(resolveSidebarSeed("sess-abc", "标题", "sess-xyz", "其他")).toBe("sess-abc");
  });

  it("blank 行 id 一旦被解析成 current，seed 即为该 id(与 header 同源)", () => {
    // 新建空会话：行标题=“新会话”，displayTitle=cwd 名/原始 id → 标题反查必 miss，
    // 该 id 由 decorateSidebar 的 isCurrentRow(选中态/回写 data-cl-session-id)解析。
    expect(resolveSidebarSeed("sess-new", "新会话", "sess-new", "/repo/foo")).toBe("sess-new");
    // 反查 miss 且 id 未解析时的兜底是标题(非当前行场景)，此时不应错用其他 id。
    expect(resolveSidebarSeed("", "新会话", "sess-other", "/repo/foo")).toBe("新会话");
  });

  it("无 id 但行标题等于当前 displayTitle 时用 current", () => {
    expect(resolveSidebarSeed("", "某项目", "sess-1", "某项目")).toBe("sess-1");
  });

  it("非当前会话且无法反查时用标题兜底", () => {
    expect(resolveSidebarSeed("", "旧会话", "sess-1", "某项目")).toBe("旧会话");
  });

  it("全空时回退 dsh", () => {
    expect(resolveSidebarSeed("", "", "", "")).toBe("dsh");
  });
});

// 进行中指示的活跃判定：running/pendingInteraction 自身活跃，子代理活跃传导到祖先。
describe("buildActiveSet", () => {
  const snap = (byId, ids) => ({ byId, ids });

  it("running 的会话直接活跃", () => {
    const s = snap({ a: { running: true, blank: false } }, ["a"]);
    expect(buildActiveSet(s)).toEqual({ a: true });
  });

  it("pendingInteraction(等批准/审阅/问答)也算活跃", () => {
    const s = snap({ a: { running: false, pendingInteraction: "approval" } }, ["a"]);
    expect(buildActiveSet(s)).toEqual({ a: true });
  });

  it("空闲会话不在活跃集", () => {
    const s = snap({ a: { running: false, blank: false } }, ["a"]);
    expect(buildActiveSet(s)).toEqual({});
  });

  it("子代理运行，但父会话 running=false 时，父会话仍被传导为活跃(不遗漏子代理驱动的任务)", () => {
    const s = snap({
      parent: { running: false, blank: false },
      child: { running: true, parentId: "parent", origin: "subagent", blank: false }
    }, ["parent", "child"]);
    const set = buildActiveSet(s);
    expect(set.child).toBe(true);
    expect(set.parent).toBe(true); // 子代理在工作 → 父会话圆点也该亮
  });

  it("多级子代理把活跃传导到最顶层祖先", () => {
    const s = snap({
      top: { running: false, blank: false },
      child: { running: true, parentId: "top", origin: "subagent", blank: false },
      grand: { running: false, pendingInteraction: "question", parentId: "child", origin: "subagent", blank: false }
    }, ["top", "child", "grand"]);
    const set = buildActiveSet(s);
    expect(set.grand && set.child && set.top).toBe(true);
  });

  it("空/无效快照返回空集", () => {
    expect(buildActiveSet(null)).toEqual({});
    expect(buildActiveSet({})).toEqual({});
  });
});

// 压红点的 running 集：不含 pendingInteraction(等批准/审阅/问答是"等你处理"，该亮红点)。
describe("buildRunningSet", () => {
  it("running 的会话在 running 集里", () => {
    const s = { byId: { a: { running: true, blank: false } }, ids: ["a"] };
    expect(buildRunningSet(s)).toEqual({ a: true });
  });

  it("pendingInteraction(等批准/审阅/问答)不在 running 集里(不该压红点)", () => {
    const s = { byId: { a: { running: false, pendingInteraction: "approval" } }, ids: ["a"] };
    expect(buildRunningSet(s)).toEqual({});
  });

  it("running 的会话与 pendingInteraction 的会话区分：前者压红点，后者不压", () => {
    const s = {
      byId: {
        run: { running: true, blank: false },
        wait: { running: false, pendingInteraction: "question", blank: false }
      },
      ids: ["run", "wait"]
    };
    const r = buildRunningSet(s);
    expect(r.run).toBe(true);
    expect(r.wait).toBe(undefined); // pendingInteraction 不压红点
  });

  it("子代理 running 传导到父会话(压红点)，但子代理 pendingInteraction 不传导为 running", () => {
    const s = {
      byId: {
        parent: { running: false, blank: false },
        childRun: { running: true, parentId: "parent", origin: "subagent", blank: false },
        childWait: { running: false, pendingInteraction: "approval", parentId: "parent", origin: "subagent", blank: false }
      },
      ids: ["parent", "childRun", "childWait"]
    };
    const r = buildRunningSet(s);
    expect(r.parent).toBe(true); // childRun 传导
    expect(r.childRun).toBe(true);
    expect(r.childWait).toBe(undefined); // 只 pending，不算 running
  });

  it("空/无效快照返回空集", () => {
    expect(buildRunningSet(null)).toEqual({});
    expect(buildRunningSet({})).toEqual({});
  });
});

// 会话预览文本裁剪：折叠空白 + 超长截断，避免把整段长文本塞进列表。
describe("clipPreview", () => {
  it("短文本原样返回(折叠空白)", () => {
    expect(clipPreview("  你好   世界  ")).toBe("你好 世界");
  });

  it("超长文本截断到 90 字符并加省略号", () => {
    const long = "x".repeat(200);
    const got = clipPreview(long);
    expect(got.length).toBe(91);
    expect(got.endsWith("…")).toBe(true);
    expect(got.startsWith("x".repeat(90))).toBe(true);
  });

  it("空/null 返回空串", () => {
    expect(clipPreview("")).toBe("");
    expect(clipPreview(null)).toBe("");
  });

  it("刚好 90 字符不截断", () => {
    expect(clipPreview("y".repeat(90)).length).toBe(90);
  });
});

// 未读红点决策：与蓝点/运行状态联动，保证"运行中压红点、跑完补红点、当前会话自动已读"。
describe("unreadDecision", () => {
  it("运行中(isActive)压红点且不推进已读", () => {
    expect(unreadDecision(0, 10, true, false)).toEqual({ unread: false, markReadTo: null });
    // 即使当前会话运行中，也压红点(蓝点替代)
    expect(unreadDecision(0, 10, true, true)).toEqual({ unread: false, markReadTo: null });
  });

  it("当前会话(isCurrent)自动已读，不显示红点", () => {
    expect(unreadDecision(0, 10, false, true)).toEqual({ unread: false, markReadTo: 10 });
    // 已读位置已等于 lastSeq 则不重复推进
    expect(unreadDecision(10, 10, false, true)).toEqual({ unread: false, markReadTo: null });
  });

  it("非运行、非当前、有未读 → 显示红点(核心修复：跑完后补红点)", () => {
    // 运行过的新会话：readSeq=0(从未读过)，lastSeq=10，跑完后应亮红点
    expect(unreadDecision(0, 10, false, false)).toEqual({ unread: true, markReadTo: null });
  });

  it("非运行、非当前、无未读 → 不显示", () => {
    expect(unreadDecision(10, 10, false, false)).toEqual({ unread: false, markReadTo: null });
    expect(unreadDecision(0, 0, false, false)).toEqual({ unread: false, markReadTo: null });
    // lastSeq=-1(无消息)不亮
    expect(unreadDecision(0, -1, false, false)).toEqual({ unread: false, markReadTo: null });
  });

  it("历史会话首次加载(lastSeq>0 但无已读记录 readSeq=0) → 显示红点(飞书语义)", () => {
    expect(unreadDecision(0, 5, false, false)).toEqual({ unread: true, markReadTo: null });
  });
});

// 会话行 id 分配(根治 blank"新会话"行反查 miss 导致的两端头像分叉)。
describe("assignRowIds", () => {
  it("已解析出 id 的行保留原 id", () => {
    const out = assignRowIds([{ _id: "s1", title: "/a", selected: false }], "s1");
    expect(out[0]._id).toBe("s1");
  });

  it("current 已被某行认领时，不再把 current 塞给其他行", () => {
    const out = assignRowIds([
      { _id: "s1", title: "/a", selected: false },
      { _id: "s2", title: "work", selected: true }
    ], "s2");
    expect(out[0]._id).toBe("s1");
    expect(out[1]._id).toBe("s2");
  });

  it("current 未被认领且存在 selected 行 → 强制归给该行(修复 blank 盲点)", () => {
    const out = assignRowIds([
      { _id: null, title: "新会话", selected: true }
    ], "s-new");
    expect(out[0]._id).toBe("s-new");
  });

  it("selected 行也解析不出 id 时，选第一个 selected 行认领 current", () => {
    const out = assignRowIds([
      { _id: null, title: "新会话A", selected: true },
      { _id: null, title: "新会话B", selected: false }
    ], "s-new");
    expect(out[0]._id).toBe("s-new");
    expect(out[1]._id).toBe(null);
  });

  it("无 selected 行且都解析不出 id → 保持 null(走 title 兜底)", () => {
    const out = assignRowIds([{ _id: null, title: "某会话", selected: false }], "s-a");
    expect(out[0]._id).toBe(null);
  });

  it("空数组安全返回空", () => {
    expect(assignRowIds([], "s-a")).toEqual([]);
  });
});
