// core 的皮肤注册服务：运行时收集皮肤包注册进来的皮肤定义。
// 皮肤包通过 ctx.chatlab.registerSkin({...}) 注册；core 各模块通过这个服务读皮肤列表。
// 这是多包架构的核心：皮肤数据不再硬编码在 core，而是由各皮肤包在 apply 时注入。

// 皮肤定义契约：{ id, name, desc, ready, tokens: {light,dark}, css, brand: { svg? } }
export function createSkinRegistry() {
  const skins = [];
  const byId = {};
  const listeners = [];

  function notify(def) {
    // 通知订阅者(皮肤包在 core apply 之后注册/热更新时，core 要重渲染)。
    for (let i = 0; i < listeners.length; i++) {
      try { listeners[i](def); } catch (e) {}
    }
  }

  function registerSkin(def) {
    if (!def || typeof def.id !== "string" || !def.id) return;
    const normalized = {
      id: def.id,
      name: def.name || def.id,
      desc: def.desc || "",
      ready: def.ready !== false, // 缺省 true
      tokens: def.tokens || { light: {}, dark: {} },
      css: def.css || "",
      brand: def.brand || null
    };
    var exists = !!byId[def.id];
    byId[def.id] = normalized;
    if (exists) {
      for (var i = 0; i < skins.length; i++) {
        if (skins[i].id === def.id) {
          skins[i] = normalized;
          break;
        }
      }
    } else {
      skins.push(normalized);
    }
    // client HMR 会重新执行同一个 skin 包；此时必须更新已有定义，不能静默忽略。
    notify(normalized);
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

// 模块级单例：存到全局运行时，core client bundle 单独 HMR 后仍能复用
// 已由 skin bundle 注册的数据。各模块(theme/settings/decorators)通过它读皮肤列表。
const REGISTRY_KEY = "__dshSkinChatlabRegistry";
const root = typeof globalThis !== "undefined" ? globalThis : {};
const singleton = root[REGISTRY_KEY] || (root[REGISTRY_KEY] = createSkinRegistry());
export default singleton;
export { singleton as skinRegistry };
