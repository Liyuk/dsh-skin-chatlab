// @liyuk/dsh-skin-feishu — 飞书皮肤包(独立 DSH 插件)。
// 依赖 core 基座(@liyuk/dsh-skin-chatlab-core)提供的 chatlab 服务，
// 在 apply 时把飞书皮肤数据注册进 core 的皮肤注册表。
import { FEISHU_CSS } from "./feishu.js";

window.__ModuleLoader__.load({
  id: "@liyuk/dsh-skin-feishu",
  factory: function () {
    var name = "@liyuk/dsh-skin-feishu";
    var inject = ["chatlab"];

    function apply(ctx) {
      // ctx.chatlab 由 core 提供；缺失时静默跳过(core 未装)。
      var chatlab = ctx.chatlab;
      if (!chatlab || typeof chatlab.registerSkin !== "function") return;
      chatlab.registerSkin({
        id: "feishu",
        name: "飞书",
        desc: "工作区=项目组 · 会话=联系人 · 气泡化聊天",
        ready: true,
        tokens: { light: {}, dark: {} },
        css: FEISHU_CSS
      });
    }

    return { name: name, inject: inject, apply: apply };
  }
});
