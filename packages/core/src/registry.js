// core 的皮肤注册服务：运行时收集皮肤包注册进来的皮肤定义。
// 皮肤包通过 ctx.chatlab.registerSkin({...}) 注册；core 各模块通过这个服务读皮肤列表。
// 这是多包架构的核心：皮肤数据不再硬编码在 core，而是由各皮肤包在 apply 时注入。

// 皮肤定义契约：{ id, name, desc, ready, tokens: {light,dark}, css }
export function createSkinRegistry() {
  const skins = [];
  const byId = {};
  const listeners = [];

  function registerSkin(def) {
    if (!def || typeof def.id !== "string" || !def.id) return;
    if (byId[def.id]) return; // 已注册，幂等忽略
    const normalized = {
      id: def.id,
      name: def.name || def.id,
      desc: def.desc || "",
      ready: def.ready !== false, // 缺省 true
      tokens: def.tokens || { light: {}, dark: {} },
      css: def.css || ""
    };
    byId[def.id] = normalized;
    skins.push(normalized);
    // 通知订阅者(皮肤包在 core apply 之后注册时，core 要重渲染)
    for (let i = 0; i < listeners.length; i++) {
      try { listeners[i](normalized); } catch (e) {}
    }
  }

  function subscribe(fn) {
    listeners.push(fn);
    return function () {
      const i = listeners.indexOf(fn);
      if (i >= 0) listeners.splice(i, 1);
    };
  }

  function list() { return skins.slice(); }
  function get(id) { return byId[id]; }
  function has(id) { return !!byId[id]; }

  return { registerSkin, subscribe, list, get, has };
}

// 模块级单例：client 运行时只有一个 core 实例，各模块(theme/settings/decorators)
// 通过它读皮肤列表，皮肤包通过 ctx.chatlab.registerSkin 注册到这里。
const singleton = createSkinRegistry();
export default singleton;
export { singleton as skinRegistry };
