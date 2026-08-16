// @liyuk/dsh-skin-chatlab-core — 基座入口。
// 提供 chatlab 皮肤注册服务(ctx.provide)，并负责切换器/装饰/设置面板。
// 皮肤数据由各皮肤包(如 @liyuk/dsh-skin-feishu)通过 ctx.chatlab.registerSkin 注入。
import { readSkin, applyHtml } from "./prefs.js";
import { makeSettingsPanel } from "./settings.js";
import { makeRebuildCss, STYLE_ID } from "./theme.js";
import { refresh } from "./decorators.js";
import { skinRegistry } from "./registry.js";

window.__ModuleLoader__.load({
  id: "@liyuk/dsh-skin-chatlab-core",
  factory: function (require) {
    var react = require("react");

    var name = "@liyuk/dsh-skin-chatlab-core";
    var inject = ["slots", "sessions", "connection"];
    var rebuildCss = makeRebuildCss();
    var SettingsPanel = makeSettingsPanel(react);

    function apply(ctx) {
      // 暴露皮肤注册服务给皮肤包(inject: ["chatlab"])。
      ctx.provide("chatlab", skinRegistry);

      var skin = readSkin();
      SettingsPanel.setCtx(ctx);

      // 设置面板在"无皮肤"状态下也必须注册。
      ctx.slots.inject("settings.section", function () {
        return ctx.slots.register(
          { name: "settings.section", id: "chatlab", order: 40, label: "ChatLab 皮肤" },
          SettingsPanel);
      });

      // 统一清理。
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

      // "无皮肤"：注入设置面板 UI 样式，但不打标记、不做装饰。
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
        refreshTimer = setTimeout(function () {
          refreshTimer = null;
          // 皮肤包可能在 core 之后注册 → 皮肤 css 此时才可拿到，需要重建。
          // 重新读 skin(皮肤注册可能改变当前皮肤的可解析性)，再重建 CSS + 装饰。
          var cur = readSkin();
          rebuildCss(cur, "light");
          refresh(ctx);
        }, 300);
      }

      // 皮肤包可能在 core 之后注册 → 订阅 registry，有新皮肤时重建 CSS + 重渲染。
      var unsubscribeRegistry = skinRegistry.subscribe(function () { scheduleRefresh(); });

      refresh(ctx);

      // sessions.list 是列表渲染的合法信号。
      var unsubscribe = null;
      if (ctx.sessions && ctx.sessions.list && typeof ctx.sessions.list.subscribe === "function") {
        try { unsubscribe = ctx.sessions.list.subscribe(scheduleRefresh); } catch (e) {}
      }

      // 低频兜底：周期性刷新，让预览/未读/typing 跟随新消息。
      var fallback = setInterval(function () {
        var rows = document.querySelectorAll('[class*="sessionRow"]');
        if (rows.length === 0) return;
        refresh(ctx);
      }, 1500);

      ctx.effect(function () {
        return function () {
          if (unsubscribe) unsubscribe();
          unsubscribeRegistry();
          clearInterval(fallback);
          if (refreshTimer) clearTimeout(refreshTimer);
        };
      });
    }

    return { apply: apply, inject: inject, name: name };
  }
});
