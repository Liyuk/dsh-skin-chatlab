import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { applyPreviews, decorateSidebar, disposePreviews } from "../packages/core/src/decorators.js";

function flush() {
  return Promise.resolve().then(() => Promise.resolve()).then(() => Promise.resolve());
}

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
}

function createClassList(node) {
  return {
    contains(name) { return node.className.split(/\s+/).includes(name); },
    toggle(name, on) {
      const names = node.className.split(/\s+/).filter(Boolean).filter((item) => item !== name);
      if (on) names.push(name);
      node.className = names.join(" ");
    },
    remove(name) {
      node.className = node.className.split(/\s+/).filter((item) => item && item !== name).join(" ");
    }
  };
}

function createNode(tagName) {
  const attrs = {};
  const node = {
    tagName: tagName.toUpperCase(),
    className: "",
    textContent: "",
    style: {},
    parentNode: null,
    getAttribute(name) { return attrs[name] || null; },
    setAttribute(name, value) { attrs[name] = String(value); },
    removeAttribute(name) { delete attrs[name]; },
    remove() {
      if (this.parentNode) this.parentNode.removeChild(this);
    }
  };
  node.classList = createClassList(node);
  return node;
}

function createRow(title, selected) {
  const row = createNode("div");
  row.className = "sessionRow" + (selected ? " selected" : "");
  row.isConnected = true;
  row.children = [];
  row.titleNode = { textContent: title };
  row.appendChild = function (node) {
    this.children.push(node);
    node.parentNode = this;
    return node;
  };
  row.removeChild = function (node) {
    this.children = this.children.filter((child) => child !== node);
    node.parentNode = null;
  };
  row.querySelector = function (selector) {
    if (selector.includes("title")) return this.titleNode;
    const className = selector.startsWith(".") ? selector.slice(1) : null;
    return this.children.find((child) => className && child.classList.contains(className)) || null;
  };
  return row;
}

function createStorage() {
  const values = new Map();
  const counts = { get: 0, set: 0 };
  return {
    getItem(key) { counts.get += 1; return values.get(key) || null; },
    setItem(key, value) { counts.set += 1; values.set(key, String(value)); },
    resetCounts() { counts.get = 0; counts.set = 0; },
    counts() { return { ...counts }; }
  };
}

describe("preview RPC reconciliation", () => {
  let originalDocument;

  beforeEach(() => {
    originalDocument = globalThis.document;
    globalThis.localStorage = createStorage();
  });

  afterEach(() => {
    vi.useRealTimers();
    if (originalDocument === undefined) delete globalThis.document;
    else globalThis.document = originalDocument;
  });

  it("keeps one RPC in flight and only applies the latest queued session state", async () => {
    const row = createRow("会话 A", true);
    row.setAttribute("data-cl-session-id", "a");
    row.setAttribute("data-cl-session-title", "会话 A");
    globalThis.document = {
      createElement: createNode,
      querySelectorAll(selector) { return selector.includes("sessionRow") ? [row] : []; }
    };
    const first = deferred();
    const second = deferred();
    const calls = [];
    let currentSession = "a";
    const ctx = {
      sessions: { list: { getSnapshot() { return { current: currentSession, ids: [] }; } } },
      connection: {
        rpc: {
          call(_path, _method, payload) {
            calls.push(payload.ids);
            return calls.length === 1 ? first.promise : second.promise;
          }
        }
      }
    };

    applyPreviews(ctx, { current: "a" }, { "会话 A": "a" }, {});
    row.titleNode.textContent = "会话 B";
    row.setAttribute("data-cl-session-id", "b");
    row.setAttribute("data-cl-session-title", "会话 B");
    currentSession = "b";
    applyPreviews(ctx, { current: "b" }, { "会话 B": "b" }, {});
    expect(calls).toEqual([["a"]]);

    first.resolve({ ok: true, value: { a: { text: "过期预览", lastSeq: 1 } } });
    await flush();
    expect(calls).toEqual([["a"], ["b"]]);
    expect(row.querySelector(".cl-preview")).toBeNull();

    second.resolve({ ok: true, value: { b: { text: "最新预览", lastSeq: 2 } } });
    await flush();
    expect(row.querySelector(".cl-preview").textContent).toBe("最新预览");
    disposePreviews(ctx);
  });

  it("轮询期间慢响应仍能应用，不会因刷新代数持续变化而饿死", async () => {
    const row = createRow("会话 A", false);
    row.setAttribute("data-cl-session-id", "a");
    row.setAttribute("data-cl-session-title", "会话 A");
    globalThis.document = {
      createElement: createNode,
      querySelectorAll(selector) { return selector.includes("sessionRow") ? [row] : []; }
    };
    const first = deferred();
    const second = deferred();
    const calls = [];
    const ctx = {
      sessions: { list: { getSnapshot() { return { current: "other", ids: ["a"], byId: { a: { displayTitle: "会话 A" } } }; } } },
      connection: {
        rpc: {
          call(_path, _method, payload) {
            calls.push(payload.ids);
            return calls.length === 1 ? first.promise : second.promise;
          }
        }
      }
    };

    applyPreviews(ctx, { current: "other" }, { "会话 A": "a" }, {});
    applyPreviews(ctx, { current: "other" }, { "会话 A": "a" }, {});
    applyPreviews(ctx, { current: "other" }, { "会话 A": "a" }, {});
    first.resolve({ ok: true, value: { a: { text: "慢响应预览", lastSeq: 1 } } });
    await flush();

    expect(row.querySelector(".cl-preview").textContent).toBe("慢响应预览");
    expect(calls).toEqual([["a"], ["a"]]);
    second.resolve({ ok: true, value: { a: { text: "最新预览", lastSeq: 2 } } });
    await flush();
    expect(row.querySelector(".cl-preview").textContent).toBe("最新预览");
    disposePreviews(ctx);
  });

  it("每次 RPC 响应只读取一次最新 session snapshot", async () => {
    const rows = ["A", "B", "C"].map((title, index) => {
      const row = createRow(title, false);
      row.setAttribute("data-cl-session-id", String.fromCharCode(97 + index));
      row.setAttribute("data-cl-session-title", title);
      return row;
    });
    let snapshotReads = 0;
    globalThis.document = {
      createElement: createNode,
      querySelectorAll(selector) { return selector.includes("sessionRow") ? rows : []; }
    };
    const response = deferred();
    const ctx = {
      sessions: { list: { getSnapshot() {
        snapshotReads += 1;
        return {
          current: "other",
          ids: ["a", "b", "c"],
          byId: { a: { displayTitle: "A" }, b: { displayTitle: "B" }, c: { displayTitle: "C" } }
        };
      } } },
      connection: { rpc: { call() { return response.promise; } } }
    };

    applyPreviews(ctx, { current: "other" }, { A: "a", B: "b", C: "c" }, {});
    expect(snapshotReads).toBe(0);
    response.resolve({ ok: true, value: {
      a: { text: "A", lastSeq: 1 }, b: { text: "B", lastSeq: 2 }, c: { text: "C", lastSeq: 3 }
    } });
    await flush();
    expect(snapshotReads).toBe(1);
    disposePreviews(ctx);
  });

  it("在下一次 refresh 前也会拒绝已被 React 复用的行", async () => {
    const row = createRow("会话 A", true);
    row.setAttribute("data-cl-session-id", "a");
    row.setAttribute("data-cl-session-title", "会话 A");
    globalThis.document = {
      createElement: createNode,
      querySelectorAll(selector) { return selector.includes("sessionRow") ? [row] : []; }
    };
    const response = deferred();
    const ctx = {
      sessions: { list: { getSnapshot() { return { current: "a", ids: [] }; } } },
      connection: { rpc: { call() { return response.promise; } } }
    };

    applyPreviews(ctx, { current: "a" }, { "会话 A": "a" }, {});
    row.titleNode.textContent = "会话 B"; // React 复用同一个 row，但尚未触发下一次 refresh。
    response.resolve({ ok: true, value: { a: { text: "A 的旧预览", lastSeq: 1 } } });
    await flush();
    expect(row.querySelector(".cl-preview")).toBeNull();
    disposePreviews(ctx);
  });

  it("同名 selected 行切换会话时拒绝旧响应", async () => {
    const row = createRow("新会话", true);
    row.setAttribute("data-cl-session-id", "a");
    row.setAttribute("data-cl-session-title", "新会话");
    globalThis.document = {
      createElement: createNode,
      querySelectorAll(selector) { return selector.includes("sessionRow") ? [row] : []; }
    };
    const response = deferred();
    let currentSession = "a";
    const ctx = {
      sessions: { list: { getSnapshot() { return { current: currentSession, ids: [] }; } } },
      connection: { rpc: { call() { return response.promise; } } }
    };

    applyPreviews(ctx, { current: "a" }, { "新会话": "a" }, {});
    // 两个 blank session 都可显示“新会话”；即使 React 复用同一个标题节点，
    // 宿主 current 已从 A 切到 B，旧响应也不能写回。
    currentSession = "b";
    response.resolve({ ok: true, value: { a: { text: "A 的旧预览", lastSeq: 1 } } });
    await flush();
    expect(row.querySelector(".cl-preview")).toBeNull();
    disposePreviews(ctx);
  });

  it("每个 preview 批次只读取一次已读表，且至多写回一次", async () => {
    const storage = createStorage();
    globalThis.localStorage = storage;
    const currentRow = createRow("会话 A", true);
    currentRow.setAttribute("data-cl-session-id", "a");
    currentRow.setAttribute("data-cl-session-title", "会话 A");
    const otherRow = createRow("会话 B", false);
    otherRow.setAttribute("data-cl-session-id", "b");
    otherRow.setAttribute("data-cl-session-title", "会话 B");
    globalThis.document = {
      createElement: createNode,
      querySelectorAll(selector) { return selector.includes("sessionRow") ? [currentRow, otherRow] : []; }
    };
    const response = deferred();
    const ctx = {
      sessions: { list: { getSnapshot() { return { current: "a", ids: [] }; } } },
      connection: { rpc: { call() { return response.promise; } } }
    };

    applyPreviews(ctx, { current: "a" }, { "会话 A": "a", "会话 B": "b" }, {});
    response.resolve({ ok: true, value: {
      a: { text: "当前消息", lastSeq: 5 },
      b: { text: "其他消息", lastSeq: 5 }
    } });
    await flush();

    expect(storage.counts()).toEqual({ get: 1, set: 1 });
    disposePreviews(ctx);
  });

  it("已读位置没有推进时不写回 localStorage", async () => {
    const storage = createStorage();
    globalThis.localStorage = storage;
    storage.setItem("dsh-skin-chatlab.read", JSON.stringify({ a: 5 }));
    storage.resetCounts();
    const row = createRow("会话 A", true);
    row.setAttribute("data-cl-session-id", "a");
    row.setAttribute("data-cl-session-title", "会话 A");
    globalThis.document = {
      createElement: createNode,
      querySelectorAll(selector) { return selector.includes("sessionRow") ? [row] : []; }
    };
    const response = deferred();
    const ctx = {
      sessions: { list: { getSnapshot() { return { current: "a", ids: [] }; } } },
      connection: { rpc: { call() { return response.promise; } } }
    };

    applyPreviews(ctx, { current: "a" }, { "会话 A": "a" }, {});
    response.resolve({ ok: true, value: { a: { text: "同一条消息", lastSeq: 5 } } });
    await flush();

    expect(storage.counts()).toEqual({ get: 1, set: 0 });
    disposePreviews(ctx);
  });

  it("非 selected 同名行复用后拒绝旧 preview", async () => {
    const row = createRow("同名会话", false);
    row.setAttribute("data-cl-session-id", "a");
    row.setAttribute("data-cl-session-title", "同名会话");
    globalThis.document = {
      createElement: createNode,
      querySelectorAll(selector) { return selector.includes("sessionRow") ? [row] : []; }
    };
    const response = deferred();
    const ctx = {
      sessions: { list: { getSnapshot() {
        return {
          current: "other",
          ids: ["a", "b"],
          byId: { a: { displayTitle: "同名会话" }, b: { displayTitle: "同名会话" } }
        };
      } } },
      connection: { rpc: { call() { return response.promise; } } }
    };

    applyPreviews(ctx, { current: "other" }, { "同名会话": "a" }, {});
    response.resolve({ ok: true, value: { a: { text: "A 的旧预览", lastSeq: 1 } } });
    await flush();
    expect(row.querySelector(".cl-preview")).toBeNull();
    disposePreviews(ctx);
  });

  it("超时后释放 single-flight，让后续请求继续执行", async () => {
    vi.useFakeTimers();
    const row = createRow("会话 A", true);
    row.setAttribute("data-cl-session-id", "a");
    row.setAttribute("data-cl-session-title", "会话 A");
    globalThis.document = {
      createElement: createNode,
      querySelectorAll(selector) { return selector.includes("sessionRow") ? [row] : []; }
    };
    const first = deferred();
    const second = deferred();
    const calls = [];
    const ctx = {
      sessions: { list: { getSnapshot() { return { current: "a", ids: ["a"] , byId: { a: { displayTitle: "会话 A" } } }; } } },
      connection: { rpc: { call(_path, _method, payload) {
        calls.push(payload.ids);
        return calls.length === 1 ? first.promise : second.promise;
      } } }
    };

    applyPreviews(ctx, { current: "a" }, { "会话 A": "a" }, {});
    applyPreviews(ctx, { current: "a" }, { "会话 A": "a" }, {});
    expect(calls).toEqual([["a"]]);
    await vi.advanceTimersByTimeAsync(8000);
    expect(calls).toEqual([["a"], ["a"]]);

    second.resolve({ ok: true, value: { a: { text: "恢复", lastSeq: 1 } } });
    await flush();
    disposePreviews(ctx);
  });

  it("partial/unavailable 响应保留已有 preview", async () => {
    const row = createRow("会话 A", false);
    row.setAttribute("data-cl-session-id", "a");
    row.setAttribute("data-cl-session-title", "会话 A");
    const preview = createNode("div");
    preview.className = "cl-preview";
    preview.textContent = "已确认预览";
    row.appendChild(preview);
    globalThis.document = {
      createElement: createNode,
      querySelectorAll(selector) { return selector.includes("sessionRow") ? [row] : []; }
    };
    const response = deferred();
    const ctx = {
      sessions: { list: { getSnapshot() { return { current: "other", ids: ["a"], byId: { a: { displayTitle: "会话 A" } } }; } } },
      connection: { rpc: { call() { return response.promise; } } }
    };

    applyPreviews(ctx, { current: "other" }, { "会话 A": "a" }, {});
    response.resolve({ ok: true, value: { a: { unavailable: true } } });
    await flush();
    expect(row.querySelector(".cl-preview").textContent).toBe("已确认预览");
    disposePreviews(ctx);
  });

  it("临时 RPC 失败保留上一次已确认的预览", async () => {
    const row = createRow("会话 A", false);
    row.setAttribute("data-cl-session-id", "a");
    row.setAttribute("data-cl-session-title", "会话 A");
    const preview = createNode("div");
    preview.className = "cl-preview";
    preview.textContent = "已确认预览";
    row.appendChild(preview);
    globalThis.document = {
      createElement: createNode,
      querySelectorAll(selector) { return selector.includes("sessionRow") ? [row] : []; }
    };
    const response = deferred();
    const ctx = { connection: { rpc: { call() { return response.promise; } } } };

    applyPreviews(ctx, { current: "other" }, { "会话 A": "a" }, {});
    response.reject(new Error("temporary failure"));
    await flush();
    expect(row.querySelector(".cl-preview").textContent).toBe("已确认预览");
    disposePreviews(ctx);
  });

  it("不会把空预览或已脱离 DOM 的响应写回行", async () => {
    const row = createRow("会话 A", false);
    row.setAttribute("data-cl-session-id", "a");
    row.setAttribute("data-cl-session-title", "会话 A");
    const stale = createNode("div");
    stale.className = "cl-preview";
    stale.textContent = "旧预览";
    row.appendChild(stale);
    globalThis.document = {
      createElement: createNode,
      querySelectorAll(selector) { return selector.includes("sessionRow") ? [row] : []; }
    };
    const response = deferred();
    const ctx = {
      sessions: { list: { getSnapshot() { return { current: "other", ids: ["a"], byId: { a: { displayTitle: "会话 A" } } }; } } },
      connection: { rpc: { call() { return response.promise; } } }
    };

    applyPreviews(ctx, { current: "other" }, { "会话 A": "a" }, {});
    response.resolve({ ok: true, value: { a: { text: "", lastSeq: -1 } } });
    await flush();
    expect(row.querySelector(".cl-preview")).toBeNull();

    const detached = deferred();
    ctx.connection.rpc.call = () => detached.promise;
    applyPreviews(ctx, { current: "other" }, { "会话 A": "a" }, {});
    row.isConnected = false;
    detached.resolve({ ok: true, value: { a: { text: "不应写入", lastSeq: 3 } } });
    await flush();
    expect(row.querySelector(".cl-preview")).toBeNull();
    disposePreviews(ctx);
  });
});

describe("preview lifecycle cleanup", () => {
  let originalDocument;

  beforeEach(() => {
    originalDocument = globalThis.document;
    globalThis.localStorage = createStorage();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    if (originalDocument === undefined) delete globalThis.document;
    else globalThis.document = originalDocument;
  });

  it("销毁插件时会取消挂起预览请求的超时计时器", () => {
    const row = createRow("会话 A", true);
    row.setAttribute("data-cl-session-id", "a");
    row.setAttribute("data-cl-session-title", "会话 A");
    globalThis.document = {
      createElement: createNode,
      querySelectorAll(selector) { return selector.includes("sessionRow") ? [row] : []; }
    };
    const response = deferred();
    const ctx = {
      connection: { rpc: { call() { return response.promise; } } }
    };

    applyPreviews(ctx, { current: "a" }, { "会话 A": "a" }, {});
    expect(vi.getTimerCount()).toBe(1);

    disposePreviews(ctx);
    expect(vi.getTimerCount()).toBe(0);
  });
});


describe("sidebar identity reuse", () => {
  let originalDocument;
  let originalWindow;

  beforeEach(() => {
    originalDocument = globalThis.document;
    originalWindow = globalThis.window;
    globalThis.localStorage = createStorage();
    globalThis.window = {};
  });

  afterEach(() => {
    if (originalDocument === undefined) delete globalThis.document;
    else globalThis.document = originalDocument;
    if (originalWindow === undefined) delete globalThis.window;
    else globalThis.window = originalWindow;
  });

  it("React 复用未解析行且标题变化时清除旧会话装饰", () => {
    const row = createRow("新会话", false);
    row.setAttribute("data-cl-session-id", "old-session");
    row.setAttribute("data-cl-session-title", "旧会话");
    row.classList.toggle("cl-unread", true);
    const preview = createNode("div");
    preview.className = "cl-preview";
    row.appendChild(preview);
    const unread = createNode("span");
    unread.className = "cl-unread-dot";
    row.appendChild(unread);
    globalThis.document = {
      createElement: createNode,
      querySelectorAll(selector) { return selector.includes("sessionRow") ? [row] : []; }
    };

    decorateSidebar({ current: null, ids: [], byId: {} }, {}, {});

    expect(row.getAttribute("data-cl-session-id")).toBeNull();
    expect(row.getAttribute("data-cl-session-title")).toBeNull();
    expect(row.querySelector(".cl-preview")).toBeNull();
    expect(row.querySelector(".cl-unread-dot")).toBeNull();
    expect(row.classList.contains("cl-unread")).toBe(false);
  });
});
