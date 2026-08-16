// dsh-skin-chatlab — client 入口。esbuild 打成单文件 lib/client.js。
// 架构：src/skins(皮肤资产) + src/core(通用骨架)，见 README「架构」章节。
import { readSkin, applyHtml } from "./core/prefs.js";
import { makeSettingsPanel } from "./core/settings.js";
import { makeRebuildCss, STYLE_ID } from "./core/theme.js";
import { refresh } from "./core/decorators.js";

window.__ModuleLoader__.load({
  id: "dsh-skin-chatlab",
  factory: function (require) {
    var react = require("react");

    var NAME = "dsh-skin-chatlab";
    var inject = ["slots", "sessions", "connection"];
    var rebuildCss = makeRebuildCss();
    var SettingsPanel = makeSettingsPanel(react);

    function apply(ctx) {
      var skin = readSkin();
      SettingsPanel.setCtx(ctx);

      // 设置面板在"无皮肤"状态下也必须注册，否则用户切到无皮肤就再也回不来了。
      ctx.slots.inject("settings.section", function () {
        return ctx.slots.register(
          { name: "settings.section", id: "chatlab", order: 40, label: "ChatLab 皮肤" },
          SettingsPanel);
      });

      // 统一清理：无论有无皮肤，插件卸载时都移除注入的 style 与 DOM 节点。
      ctx.effect(function () {
        return function () {
          var s = document.getElementById(STYLE_ID);
          if (s && s.parentNode) s.parentNode.removeChild(s);
          var nodes = document.querySelectorAll(".cl-avatar, .cl-preview, .cl-unread-dot, .cl-project-icon, .cl-brand-skin, .cl-typing");
          for (var i = 0; i < nodes.length; i++) {
            var n = nodes[i];
            if (n.parentNode) n.parentNode.removeChild(n);
          }
          var unread = document.querySelectorAll(".cl-unread");
          for (var j = 0; j < unread.length; j++) unread[j].classList.remove("cl-unread");
          document.documentElement.removeAttribute("data-chatlab-skin");
          document.documentElement.removeAttribute("data-chatlab-theme");
        };
      });

      // "无皮肤"：注入设置面板 UI 样式，但不打 data-chatlab-skin 标记、
      // 不做任何 DOM 装饰，保留设置面板(否则用户切到无皮肤就回不来了)。
      if (skin === "none") {
        applyHtml("none", "light");
        rebuildCss("none", "light");
        return;
      }

      applyHtml(skin, "light");
      rebuildCss(skin, "light");

      var refreshTimer = null;
      function scheduleRefresh() {
        if (refreshTimer) return;
        refreshTimer = setTimeout(function () { refreshTimer = null; refresh(ctx); }, 300);
      }

      refresh(ctx);

      // 为什么不用 MutationObserver：
      // DSH 是 React 应用，观察整个 body 会收到海量 mutation records 并拖垮 reconcile。
      // 正确做法：sessions.list 的 subscribe 是列表渲染的合法信号；再加低频兜底轮询。
      var unsubscribe = null;
      if (ctx.sessions && ctx.sessions.list && typeof ctx.sessions.list.subscribe === "function") {
        try { unsubscribe = ctx.sessions.list.subscribe(scheduleRefresh); } catch (e) {}
      }

      // 低频兜底：周期性刷新，让"最近回复预览 + 未读红点"跟随新消息更新。
      // refresh 内部幂等(已有头像跳过、已有 preview 只更新文本)，且 RPC 有 host 缓存，
      // 所以 1.5s 一次的 setInterval 很便宜，不会反复读盘。
      var fallback = setInterval(function () {
        var rows = document.querySelectorAll('[class*="sessionRow"]');
        if (rows.length === 0) return;
        refresh(ctx);
      }, 1500);

      ctx.effect(function () {
        return function () {
          if (unsubscribe) unsubscribe();
          clearInterval(fallback);
          if (refreshTimer) clearTimeout(refreshTimer);
        };
      });
    }

    return { apply: apply, inject: inject, name: NAME };
  }
});
