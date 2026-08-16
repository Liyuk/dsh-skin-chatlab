// 设置面板 UI：皮肤切换器 + 深色开关。
// react 作为参数传入(不 import)，因为 DSH 的 react 只能通过 factory 的 require 拿到。
import { readSkin } from "./prefs.js";
import { KEY_SKIN, KEY_THEME } from "./prefs.js";
import { SKINS, SKIN_BY_ID } from "../skins/registry.js";

export function makeSettingsPanel(react) {
  function SwitchRow(props) {
    return react.createElement("label", { className: "cl-row" },
      react.createElement("span", { className: "cl-row-body" },
        react.createElement("span", { className: "cl-row-title" }, props.title),
        react.createElement("span", { className: "cl-row-desc" }, props.desc)),
      react.createElement("span", { className: "cl-switch" + (props.checked ? " cl-on" : "") },
        react.createElement("input", {
          type: "checkbox",
          checked: props.checked,
          onChange: function (e) { props.onChange(e.target.checked); }
        }),
        react.createElement("span", { className: "cl-knob" })));
  }

  function SkinChip(props) {
    if (props.disabled) {
      return react.createElement("span", {
        className: "cl-chip cl-chip-disabled",
        title: props.desc
      },
      react.createElement("span", { className: "cl-chip-name" }, props.name),
      react.createElement("span", { className: "cl-chip-soon" }, "待做"));
    }
    return react.createElement("button", {
      type: "button",
      className: "cl-chip" + (props.active ? " cl-chip-on" : ""),
      onClick: function () { props.onPick(props.id); }
    },
    react.createElement("span", { className: "cl-chip-name" }, props.name),
    props.active ? react.createElement("span", { className: "cl-chip-check" }, "✓") : null);
  }

  // 模块级持有当前 ctx(深色切换要调 theme 服务)。settings 面板用闭包读它。
  var pluginCtx = null;

  function SettingsPanel() {
    var ctx = pluginCtx;
    var skinState = react.useState(readSkin());
    var skin = skinState[0], setSkin = skinState[1];
    // 深色状态直接读 DSH 主题服务，而不是自己维护的 KEY_THEME。
    var themeSvc = null;
    try { themeSvc = ctx ? ctx.get("theme") : null; } catch (e) {}
    var initialTheme = "light";
    try {
      if (themeSvc && typeof themeSvc.getTheme === "function") {
        initialTheme = themeSvc.getTheme().active.colorScheme;
      }
    } catch (e) {}
    var themeState = react.useState(initialTheme);
    var theme = themeState[0], setTheme = themeState[1];
    var noticeState = react.useState(null);
    var notice = noticeState[0], setNotice = noticeState[1];

    var commitSkin = function (v) {
      // 切皮肤动布局：写偏好 → 弹提示 → 自动刷新。
      setSkin(v);
      try { localStorage.setItem(KEY_SKIN, v); } catch (e) {}
      setNotice("已切换到「" + (v === "none" ? "无皮肤" : SKIN_BY_ID[v].name) + "」，正在刷新…");
      setTimeout(function () { window.location.reload(); }, 600);
    };
    var commitTheme = function (v) {
      var next = v ? "dark" : "light";
      setTheme(next);
      try { localStorage.setItem(KEY_THEME, next); } catch (e) {}
      // 调用 DSH 的主题服务切明暗。
      var themeSvc2 = null;
      try { themeSvc2 = ctx ? ctx.get("theme") : null; } catch (e) {}
      if (themeSvc2 && typeof themeSvc2.setTheme === "function") {
        try { themeSvc2.setTheme(next); } catch (e) {}
      }
    };

    return react.createElement("div", { className: "cl-settings" },
      react.createElement("div", { className: "cl-settings-head" },
        react.createElement("div", { className: "cl-settings-title" }, "ChatLab 皮肤"),
        react.createElement("div", { className: "cl-settings-sub" }, "可扩展聊天皮肤：飞书首发，其余待做")),
      notice ? react.createElement("div", { className: "cl-notice" }, notice) : null,
      react.createElement("div", { className: "cl-chips" },
        react.createElement(SkinChip, { id: "none", name: "无皮肤", active: skin === "none", onPick: commitSkin }),
        SKINS.map(function (s) {
          return react.createElement(SkinChip, {
            key: s.id, id: s.id, name: s.name, desc: s.desc,
            active: skin === s.id, disabled: !s.ready, onPick: commitSkin
          });
        })),
      react.createElement(SwitchRow, {
        title: "深色模式",
        desc: "调用 DSH 主题系统，热切换",
        checked: theme === "dark",
        onChange: commitTheme
      }));
  }

  // 暴露 setCtx 供 apply 里赋值
  SettingsPanel.setCtx = function (ctx) { pluginCtx = ctx; };

  return SettingsPanel;
}
