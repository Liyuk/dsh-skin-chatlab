import { SLACK_CSS, SLACK_BRAND_SVG, SLACK_TOKENS } from "./slack.js";

window.__ModuleLoader__.load({
  id: "@liyuk/dsh-skin-slack",
  factory: function () {
    function apply(ctx) {
      var chatlab = ctx.chatlab;
      if (!chatlab || typeof chatlab.registerSkin !== "function") return;
      chatlab.registerSkin({
        id: "slack",
        name: "Slack 风格",
        desc: "紧凑工作区 · 频道感侧栏 · 平面消息",
        ready: true,
        tokens: SLACK_TOKENS,
        brand: { svg: SLACK_BRAND_SVG },
        css: SLACK_CSS
      });
    }
    return { name: "@liyuk/dsh-skin-slack", inject: ["chatlab"], apply: apply };
  }
});
