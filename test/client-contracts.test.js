import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { avatarUrl, updateAvatar } from "../packages/core/src/avatar.js";
import { rowId } from "../packages/core/src/dom.js";
import { createSkinRegistry, skinRegistry } from "../packages/core/src/registry.js";
import { buildCss } from "../packages/core/src/theme.js";
import { decorateBrand } from "../packages/core/src/decorators.js";

function makeStorage() {
  const data = new Map();
  let writes = 0;
  return {
    getItem(key) { return data.has(key) ? data.get(key) : null; },
    setItem(key, value) { writes += 1; data.set(key, String(value)); },
    removeItem(key) { data.delete(key); },
    writes() { return writes; }
  };
}

function makeRow(options = {}) {
  const attrs = { ...(options.attrs || {}) };
  return {
    className: options.className || "",
    getAttribute(name) { return attrs[name] || null; },
    querySelector(selector) {
      if (selector.includes("title")) return { textContent: options.title || "" };
      return null;
    }
  };
}

describe("skin registry contract", () => {
  it("同 id 重新注册会更新定义并通知订阅者", () => {
    const registry = createSkinRegistry();
    const seen = [];
    registry.subscribe((def) => seen.push(def.css));
    registry.registerSkin({ id: "demo", css: ".first {}" });
    registry.registerSkin({ id: "demo", css: ".second {}" });

    expect(registry.list()).toHaveLength(1);
    expect(registry.list()[0].css).toBe(".second {}");
    expect(registry.get("demo").css).toBe(".second {}");
    expect(seen).toEqual([".first {}", ".second {}"]);
  });

  it("将 skin light/dark tokens 输出为宿主 alias 覆盖", () => {
    const id = "test-token-contract";
    skinRegistry.registerSkin({
      id,
      tokens: {
        light: { "brand-primary": "#123456" },
        dark: { "brand-primary": "#abcdef" }
      }
    });
    const css = buildCss(id, "light");

    expect(css).toContain("html[data-chatlab-skin] { --dsw-alias-brand-primary: #123456;");
    expect(css).toContain("body[data-ds-dark-theme] { --dsw-alias-brand-primary: #abcdef;");
  });

  it("只注册部分皮肤时，已注册皮肤仍可独立生成完整样式", () => {
    const id = "partial-load-slack";
    skinRegistry.registerSkin({
      id,
      tokens: { light: { "brand-primary": "#611f69" }, dark: { "brand-primary": "#c98bd7" } },
      css: 'html[data-chatlab-skin="partial-load-slack"] .composer { color: #611f69; }'
    });

    const css = buildCss(id, "light");
    expect(css).toContain(".composer { color: #611f69; }");
    expect(css).toContain(".cl-brand-skin");
    expect(buildCss("skin-not-installed", "light")).not.toContain(".cl-brand-skin");
  });
});

describe("brand decoration", () => {
  it("渲染皮肤提供的 logo 标记和可访问字标，而不是单独的文字胶囊", () => {
    const originalDocument = globalThis.document;
    const originalStorage = globalThis.localStorage;
    const storage = makeStorage();
    const attrs = {};
    const children = [];
    const makeElement = (tagName) => {
      const node = {
        tagName: tagName.toUpperCase(),
        className: "",
        textContent: "",
        innerHTML: "",
        parentNode: null,
        children: [],
        setAttribute(name, value) { attrs[name] = String(value); this[name] = String(value); },
        getAttribute(name) { return this[name] || null; },
        appendChild(child) { this.children.push(child); child.parentNode = this; return child; },
        querySelector(selector) {
          const wanted = selector.startsWith(".") ? selector.slice(1) : selector;
          return this.children.find((child) => (child.className || "").split(/\s+/).includes(wanted)) || null;
        }
      };
      return node;
    };
    const brand = makeElement("div");
    brand.className = "brand";
    brand.querySelector = function (selector) {
      if (selector === ".cl-brand-skin") return children.find((child) => child.className === "cl-brand-skin") || null;
      return null;
    };
    brand.appendChild = function (child) { children.push(child); child.parentNode = brand; return child; };
    globalThis.localStorage = storage;
    storage.setItem("dsh-skin-chatlab.skin", "brand-test");
    skinRegistry.registerSkin({ id: "brand-test", name: "测试皮肤", brand: { svg: "<svg></svg>" } });
    globalThis.document = {
      querySelector(selector) { return selector.includes("brand") ? brand : null; },
      createElement: makeElement
    };

    try {
      decorateBrand();
      const badge = brand.querySelector(".cl-brand-skin");
      expect(badge.getAttribute("aria-label")).toBe("测试皮肤");
      expect(badge.querySelector(".cl-brand-mark").querySelector(".cl-brand-mark-image").getAttribute("src")).toContain("data:image/svg+xml");
      expect(badge.querySelector(".cl-brand-label").textContent).toBe("测试皮肤");
    } finally {
      globalThis.document = originalDocument;
      globalThis.localStorage = originalStorage;
    }
  });
});

describe("session row binding", () => {
  it("不会让未选中的旧 ChatLab binding 覆盖最新标题映射", () => {
    const row = makeRow({
      title: "新会话",
      attrs: { "data-cl-session-id": "old-session" }
    });
    expect(rowId(row, { "新会话": "new-session" }, "new-session")).toBe("new-session");
    expect(rowId(row, {}, "new-session")).toBeNull();
  });

  it("仅为当前 selected 的 blank 行保留自己的 binding", () => {
    const row = makeRow({
      title: "新会话",
      className: "sessionRow selected",
      attrs: {
        "data-cl-session-id": "current-session",
        "data-cl-session-title": "新会话"
      }
    });
    expect(rowId(row, {}, "current-session")).toBe("current-session");
  });
});

describe("avatar persistence", () => {
  let originalDocument;

  beforeEach(() => {
    originalDocument = globalThis.document;
    globalThis.localStorage = makeStorage();
    vi.resetModules();
  });

  afterEach(() => {
    if (originalDocument === undefined) delete globalThis.document;
    else globalThis.document = originalDocument;
  });

  it("第三方头像 URL 不包含原始 session id 或标题", () => {
    const sensitive = "private/project title@example.com";
    const url = avatarUrl(sensitive);
    expect(url).not.toContain(sensitive);
    expect(url).not.toContain(encodeURIComponent(sensitive));
  });

  it("复用 img 切换会话时更新失败回退闭包和占位色", () => {
    const image = {
      tagName: "IMG",
      className: "cl-avatar",
      style: {},
      _failed: true,
      setAttribute(name, value) { this[name] = String(value); },
      getAttribute(name) { return this[name] || null; }
    };
    const oldError = image.onerror;
    const next = updateAvatar(image, "new-session", "https://avatar.example/new");
    expect(next).toBe(image);
    expect(next.getAttribute("data-seed")).toBe("new-session");
    expect(next._failed).toBe(false);
    expect(next.onerror).not.toBe(oldError);
    expect(next.style.backgroundColor).toContain("hsl(");
  });

  it("失败的首字母回退在换会话时恢复为 img", () => {
    const attrs = { "data-seed": "old-session" };
    const parent = {
      child: null,
      replaceChild(next, previous) { this.child = next; next.parentNode = this; previous.parentNode = null; }
    };
    const fallback = {
      tagName: "SPAN",
      parentNode: parent,
      classList: { contains(name) { return name === "cl-avatar-initial"; } },
      getAttribute(name) { return attrs[name] || null; }
    };
    globalThis.document = {
      createElement(tagName) {
        const nodeAttrs = {};
        return {
          tagName: tagName.toUpperCase(),
          style: {},
          setAttribute(name, value) { nodeAttrs[name] = String(value); },
          getAttribute(name) { return nodeAttrs[name] || null; }
        };
      }
    };

    const next = updateAvatar(fallback, "new-session", "https://avatar.example/new", "cl-header-avatar");
    expect(next.tagName).toBe("IMG");
    expect(next.getAttribute("data-seed")).toBe("new-session");
    expect(parent.child).toBe(next);
  });

  it("同一头像映射只持久化一次，并迁移旧的原始 seed URL", async () => {
    const storage = globalThis.localStorage;
    const { rememberAvatar } = await import("../packages/core/src/avatarStore.js");
    const first = rememberAvatar("session-1", "session-1", null);
    const second = rememberAvatar("session-1", "session-1", null);
    expect(second).toBe(first);
    expect(storage.writes()).toBe(1);

    storage.setItem("dsh-skin-chatlab.avatar", JSON.stringify({
      legacy: { seed: "secret-title", url: "https://api.dicebear.com/x?seed=secret-title", at: 1 }
    }));
    vi.resetModules();
    const migrated = await import("../packages/core/src/avatarStore.js");
    expect(migrated.avatarUrlForId("legacy")).toBeNull();
  });
});

describe("skin preference resolution", () => {
  let originalRegistry;
  let originalStorage;

  beforeEach(() => {
    originalRegistry = globalThis.__dshSkinChatlabRegistry;
    originalStorage = globalThis.localStorage;
    delete globalThis.__dshSkinChatlabRegistry;
    globalThis.localStorage = makeStorage();
    vi.resetModules();
  });

  afterEach(() => {
    if (originalRegistry === undefined) delete globalThis.__dshSkinChatlabRegistry;
    else globalThis.__dshSkinChatlabRegistry = originalRegistry;
    globalThis.localStorage = originalStorage;
    vi.resetModules();
  });

  it("core-only 保持无皮肤，延迟注册后会激活已保存的选择", async () => {
    globalThis.localStorage.setItem("dsh-skin-chatlab.skin", "feishu");
    const { readSkin } = await import("../packages/core/src/prefs.js");
    const { skinRegistry: isolatedRegistry } = await import("../packages/core/src/registry.js");
    isolatedRegistry.registerSkin({ id: "placeholder", ready: false });
    expect(readSkin()).toBe("none");

    isolatedRegistry.registerSkin({ id: "feishu" });
    expect(readSkin()).toBe("feishu");
  });

  it("uses aggregate registration order for the first ready fallback", async () => {
    const { readSkin } = await import("../packages/core/src/prefs.js");
    const { skinRegistry: isolatedRegistry } = await import("../packages/core/src/registry.js");
    isolatedRegistry.registerSkin({ id: "slack", ready: true });
    isolatedRegistry.registerSkin({ id: "dingtalk", ready: true });
    isolatedRegistry.registerSkin({ id: "feishu", ready: true });
    expect(readSkin()).toBe("feishu");
  });

  it("selected skin is absent but another skin is installed时回退到已安装皮肤", async () => {
    globalThis.localStorage.setItem("dsh-skin-chatlab.skin", "feishu");
    const { readSkin } = await import("../packages/core/src/prefs.js");
    const { skinRegistry: isolatedRegistry } = await import("../packages/core/src/registry.js");
    isolatedRegistry.registerSkin({ id: "slack", ready: true });
    expect(readSkin()).toBe("slack");
  });
});

describe("avatar store write batching", () => {
  beforeEach(() => {
    globalThis.localStorage = makeStorage();
    vi.resetModules();
  });

  it("多个头像变更只在 flush 时持久化一次", async () => {
    const { rememberAvatar, flushAvatarMap } = await import("../packages/core/src/avatarStore.js");
    rememberAvatar("session-a", "session-a", null, true);
    rememberAvatar("session-b", "session-b", null, true);

    expect(globalThis.localStorage.writes()).toBe(0);
    expect(flushAvatarMap()).toBe(true);
    expect(globalThis.localStorage.writes()).toBe(1);
    expect(flushAvatarMap()).toBe(false);
    expect(globalThis.localStorage.writes()).toBe(1);
  });
});
