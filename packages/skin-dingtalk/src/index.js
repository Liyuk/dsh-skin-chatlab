import { DINGTALK_CSS, DINGTALK_BRAND_SVG, DINGTALK_TOKENS } from "./dingtalk.js";

window.__ModuleLoader__.load({
  id: "@liyuk/dsh-skin-dingtalk",
  factory: function () {
    function apply(ctx) {
      var chatlab = ctx.chatlab;
      if (!chatlab || typeof chatlab.registerSkin !== "function") return;
      chatlab.registerSkin({
        id: "dingtalk",
        name: "钉钉风格",
        desc: "蓝色企业感 · 卡片选中态 · 任务密度",
        ready: true,
        tokens: DINGTALK_TOKENS,
        brand: { svg: DINGTALK_BRAND_SVG },
        css: DINGTALK_CSS
      });
    }
    return { name: "@liyuk/dsh-skin-dingtalk", inject: ["chatlab"], apply: apply };
  }
});
