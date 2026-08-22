import { TELEGRAM_CSS, TELEGRAM_BRAND_SVG, TELEGRAM_TOKENS } from "./telegram.js";

window.__ModuleLoader__.load({
  id: "@liyuk/dsh-skin-telegram",
  factory: function () {
    function apply(ctx) {
      var chatlab = ctx.chatlab;
      if (!chatlab || typeof chatlab.registerSkin !== "function") return;
      chatlab.registerSkin({
        id: "telegram",
        name: "Telegram 风格",
        desc: "轻盈蓝色 · 大圆角气泡 · 宽松留白",
        ready: true,
        tokens: TELEGRAM_TOKENS,
        brand: { svg: TELEGRAM_BRAND_SVG },
        css: TELEGRAM_CSS
      });
    }
    return { name: "@liyuk/dsh-skin-telegram", inject: ["chatlab"], apply: apply };
  }
});
