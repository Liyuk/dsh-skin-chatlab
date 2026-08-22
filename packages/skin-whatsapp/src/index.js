import { WHATSAPP_CSS, WHATSAPP_BRAND_SVG, WHATSAPP_TOKENS } from "./whatsapp.js";

window.__ModuleLoader__.load({
  id: "@liyuk/dsh-skin-whatsapp",
  factory: function () {
    function apply(ctx) {
      var chatlab = ctx.chatlab;
      if (!chatlab || typeof chatlab.registerSkin !== "function") return;
      chatlab.registerSkin({
        id: "whatsapp",
        name: "WhatsApp 风格",
        desc: "绿色聊天感 · 圆形头像 · 轻量勾选装饰",
        ready: true,
        tokens: WHATSAPP_TOKENS,
        brand: { svg: WHATSAPP_BRAND_SVG },
        css: WHATSAPP_CSS
      });
    }
    return { name: "@liyuk/dsh-skin-whatsapp", inject: ["chatlab"], apply: apply };
  }
});
