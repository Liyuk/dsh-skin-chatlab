import { afterEach, describe, expect, it, vi } from "vitest";

const cases = [
  ["feishu", "../packages/skin-feishu/src/index.js", "@liyuk/dsh-skin-feishu"],
  ["slack", "../packages/skin-slack/src/index.js", "@liyuk/dsh-skin-slack"],
  ["wecom", "../packages/skin-wecom/src/index.js", "@liyuk/dsh-skin-wecom"],
  ["dingtalk", "../packages/skin-dingtalk/src/index.js", "@liyuk/dsh-skin-dingtalk"],
  ["telegram", "../packages/skin-telegram/src/index.js", "@liyuk/dsh-skin-telegram"],
  ["whatsapp", "../packages/skin-whatsapp/src/index.js", "@liyuk/dsh-skin-whatsapp"]
];

afterEach(() => {
  delete globalThis.window;
  vi.resetModules();
});

describe("skin client entrypoint contract", () => {
  it.each(cases)("registers %s through the chatlab seam", async (_id, path, moduleName) => {
    let definition;
    globalThis.window = {
      __ModuleLoader__: { load(value) { definition = value; } }
    };

    await import(path);
    expect(definition.id).toBe(moduleName);
    const plugin = definition.factory();
    expect(plugin.inject).toEqual(["chatlab"]);

    const registrations = [];
    plugin.apply({ chatlab: { registerSkin(def) { registrations.push(def); } } });
    expect(registrations).toHaveLength(1);
    expect(registrations[0].id).toBe(_id);
    expect(registrations[0].ready).toBe(true);
    expect(registrations[0].css).toContain(`html[data-chatlab-skin="${_id}"]`);
  });

  it.each(cases)("does not throw when %s loads without core", async (_id, path) => {
    let definition;
    globalThis.window = {
      __ModuleLoader__: { load(value) { definition = value; } }
    };
    await import(path);
    const plugin = definition.factory();
    expect(() => plugin.apply({})).not.toThrow();
  });
});
