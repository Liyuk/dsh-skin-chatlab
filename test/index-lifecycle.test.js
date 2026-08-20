import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

function createStorage() {
  const values = new Map([["dsh-skin-chatlab.skin", "none"]]);
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
});
