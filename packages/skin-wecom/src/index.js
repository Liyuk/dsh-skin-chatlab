import { WECOM_CSS, WECOM_BRAND_SVG, WECOM_TOKENS } from "./wecom.js";

window.__ModuleLoader__.load({
  id: "@liyuk/dsh-skin-wecom",
  factory: function () {
    function apply(ctx) {
      var chatlab = ctx.chatlab;
      if (!chatlab || typeof chatlab.registerSkin !== "function") return;
      chatlab.registerSkin({
        id: "wecom",
        name: "企业微信风格",
        desc: "企业通讯录感 · 绿色气泡 · 克制密度",
        ready: true,
        tokens: WECOM_TOKENS,
        brand: { svg: WECOM_BRAND_SVG },
        css: WECOM_CSS
      });
    }
    return { name: "@liyuk/dsh-skin-wecom", inject: ["chatlab"], apply: apply };
  }
});
