import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

function createStorage(initial = "none") {
  const values = new Map([["dsh-skin-chatlab.skin", initial]]);
  return {
    getItem(key) { return values.get(key) || null; },
    setItem(key, value) { values.set(key, String(value)); }
  };
}

describe("core refresh scheduling", () => {
  let originalWindow;
  let originalDocument;
  let originalStorage;
  let originalRegistry;

  beforeEach(() => {
    originalWindow = globalThis.window;
    originalDocument = globalThis.document;
    originalStorage = globalThis.localStorage;
    originalRegistry = globalThis.__dshSkinChatlabRegistry;
    delete globalThis.__dshSkinChatlabRegistry;
    vi.useFakeTimers();
    vi.resetModules();
  });

  afterEach(() => {
    vi.useRealTimers();
    if (originalWindow === undefined) delete globalThis.window;
    else globalThis.window = originalWindow;
    if (originalDocument === undefined) delete globalThis.document;
    else globalThis.document = originalDocument;
    globalThis.localStorage = originalStorage;
    if (originalRegistry === undefined) delete globalThis.__dshSkinChatlabRegistry;
    else globalThis.__dshSkinChatlabRegistry = originalRegistry;
  });

  it("ignores truthy session-list payloads when deciding CSS rebuilds", async () => {
    let registration;
    let listSubscriber;
    let styleAdds = 0;
    const effects = [];
    const root = {
      setAttribute() {},
      removeAttribute() {}
    };
    const head = {
      appendChild(style) { style.parentNode = this; styleAdds += 1; },
      removeChild(style) { style.parentNode = null; }
    };

    globalThis.window = {
      __ModuleLoader__: { load(definition) { registration = definition; } }
    };
    globalThis.localStorage = createStorage();
    globalThis.document = {
      documentElement: root,
      head,
      getElementById() { return null; },
      createElement() { return { parentNode: null, id: "", textContent: "" }; },
      querySelectorAll() { return []; }
    };

    await import("../packages/core/src/index.js");
    const plugin = registration.factory(function () { return {}; });
    const ctx = {
      provide() {},
      slots: { inject() {}, register() {} },
      effect(factory) {
        const cleanup = factory();
        if (typeof cleanup === "function") effects.push(cleanup);
      },
      sessions: {
        list: {
          getSnapshot() { return { ids: [], byId: {}, current: null }; },
          subscribe(callback) { listSubscriber = callback; return function () {}; }
        }
      }
    };
    plugin.apply(ctx);
    expect(styleAdds).toBe(1);

    listSubscriber({ ids: ["truthy-payload"] });
    await vi.advanceTimersByTimeAsync(300);
    expect(styleAdds).toBe(1);

    const { skinRegistry } = await import("../packages/core/src/registry.js");
    skinRegistry.registerSkin({ id: "test-registry-rebuild", css: ".test {}" });
    await vi.advanceTimersByTimeAsync(300);
    expect(styleAdds).toBe(2);

    effects.forEach((cleanup) => cleanup());
  });

  it("switches across all registered skins and removes owned state for none", async () => {
    let registration;
    let listSubscriber;
    let currentStyle = null;
    const attrs = new Map();
    const effects = [];
    const storage = createStorage("feishu");
    const owned = {
      parentNode: { removeChild(node) { node.parentNode = null; } }
    };
    const root = {
      setAttribute(name, value) { attrs.set(name, String(value)); },
      removeAttribute(name) { attrs.delete(name); }
    };
    const head = {
      appendChild(style) { style.parentNode = this; currentStyle = style; },
      removeChild(style) { style.parentNode = null; if (currentStyle === style) currentStyle = null; }
    };

    globalThis.window = {
      __ModuleLoader__: { load(definition) { registration = definition; } }
    };
    globalThis.localStorage = storage;
    globalThis.document = {
      documentElement: root,
      head,
      getElementById() { return currentStyle; },
      createElement() { return { parentNode: null, id: "", textContent: "" }; },
      querySelector() { return null; },
      querySelectorAll(selector) {
        if (selector.startsWith(".cl-avatar")) return owned.parentNode ? [owned] : [];
        return [];
      }
    };

    await import("../packages/core/src/index.js");
    const { skinRegistry } = await import("../packages/core/src/registry.js");
    const ids = ["feishu", "slack", "wecom", "dingtalk", "telegram", "whatsapp"];
    for (const id of ids) skinRegistry.registerSkin({ id, css: `.skin-${id} {}` });

    const plugin = registration.factory(function () { return {}; });
    const ctx = {
      provide() {},
      slots: { inject() {}, register() {} },
      effect(factory) {
        const cleanup = factory();
        if (typeof cleanup === "function") effects.push(cleanup);
      },
      sessions: {
        list: {
          getSnapshot() { return { ids: [], byId: {}, current: null }; },
          subscribe(callback) { listSubscriber = callback; return function () {}; }
        }
      }
    };
    plugin.apply(ctx);

    for (const id of ids) {
      storage.setItem("dsh-skin-chatlab.skin", id);
      listSubscriber();
      await vi.advanceTimersByTimeAsync(300);
      expect(attrs.get("data-chatlab-skin")).toBe(id);
      expect(currentStyle.textContent).toContain(`.skin-${id}`);
    }

    storage.setItem("dsh-skin-chatlab.skin", "none");
    listSubscriber();
    await vi.advanceTimersByTimeAsync(300);
    expect(attrs.has("data-chatlab-skin")).toBe(false);
    expect(currentStyle.textContent).not.toContain(".skin-");
    expect(owned.parentNode).toBeNull();

    effects.forEach((cleanup) => cleanup());
  });
});
