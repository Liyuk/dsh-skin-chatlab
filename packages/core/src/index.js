// @liyuk/dsh-skin-chatlab-core — 基座入口。
// 提供 chatlab 皮肤注册服务(ctx.provide)，并负责切换器/装饰/设置面板。
// 皮肤数据由各皮肤包(如 @liyuk/dsh-skin-feishu)通过 ctx.chatlab.registerSkin 注入。
import { readSkin, applyHtml } from "./prefs.js";
import { makeSettingsPanel } from "./settings.js";
import { makeRebuildCss, STYLE_ID } from "./theme.js";
import { refresh, disposePreviews } from "./decorators.js";
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

      SettingsPanel.setCtx(ctx);

      // 设置面板在"无皮肤"状态下也必须注册。
      ctx.slots.inject("settings.section", function () {
        return ctx.slots.register(
          { name: "settings.section", id: "chatlab", order: 40, label: "ChatLab 皮肤" },
          SettingsPanel);
      });

      // 统一清理。
      function clearDecorations(removeStyle) {
        disposePreviews(ctx);
        if (removeStyle) {
          var s = document.getElementById(STYLE_ID);
          if (s && s.parentNode) s.parentNode.removeChild(s);
        }
        var nodes = document.querySelectorAll(".cl-avatar, .cl-preview, .cl-unread-dot, .cl-running-dot, .cl-project-icon, .cl-brand-skin, .cl-typing, .cl-turn-typing");
        for (var i = 0; i < nodes.length; i++) {
          var n = nodes[i];
          if (n.parentNode) n.parentNode.removeChild(n);
        }
        var unread = document.querySelectorAll(".cl-unread");
        for (var j = 0; j < unread.length; j++) unread[j].classList.remove("cl-unread");
        var rows = document.querySelectorAll("[data-cl-session-id], [data-cl-session-title]");
        for (var k = 0; k < rows.length; k++) {
          rows[k].removeAttribute("data-cl-session-id");
          rows[k].removeAttribute("data-cl-session-title");
        }
        document.documentElement.removeAttribute("data-chatlab-skin");
        document.documentElement.removeAttribute("data-chatlab-theme");
      }

      ctx.effect(function () {
        return function () { clearDecorations(true); };
      });

      // 皮肤可能在 core 之后注册。始终保留 registry 订阅，而不是在无皮肤时提前 return。
      var appliedSkin = null;
      function syncSkin(force) {
        var skin = readSkin();
        if (force || skin !== appliedSkin) {
          var wasEnabled = appliedSkin && appliedSkin !== "none";
          applyHtml(skin, "light");
          rebuildCss(skin, "light");
          appliedSkin = skin;
          if (wasEnabled && skin === "none") clearDecorations(false);
        }
        return skin !== "none";
      }

      function refreshIfEnabled(forceSkinSync) {
        if (!syncSkin(forceSkinSync)) return;
        refresh(ctx);
      }

      var refreshTimer = null;
      var forceSkinSync = false;
      function scheduleRefresh(force) {
        if (force) forceSkinSync = true;
        if (refreshTimer) return;
        refreshTimer = setTimeout(function () {
          refreshTimer = null;
          var force = forceSkinSync;
          forceSkinSync = false;
          refreshIfEnabled(force);
        }, 300);
      }

      // 皮肤包可能在 core 之后注册，也可能在 HMR 后重新注册 → 重建 CSS + 重渲染。
      var unsubscribeRegistry = skinRegistry.subscribe(function () { scheduleRefresh(true); });

      refreshIfEnabled();

      // sessions.list 是列表渲染的合法信号。
      var unsubscribe = null;
      if (ctx.sessions && ctx.sessions.list && typeof ctx.sessions.list.subscribe === "function") {
        // 不透传 subscription payload：snapshot/event 可能是 truthy，不能误当成强制重建 CSS。
        try { unsubscribe = ctx.sessions.list.subscribe(function () { scheduleRefresh(false); }); } catch (e) {}
      }

      // 低频兜底：周期性刷新，让预览/未读/typing 跟随新消息。
      var fallback = setInterval(function () {
        var rows = document.querySelectorAll('[class*="sessionRow"]');
        if (rows.length === 0) return;
        refreshIfEnabled();
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
