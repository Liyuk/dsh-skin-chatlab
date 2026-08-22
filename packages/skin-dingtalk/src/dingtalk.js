import { makeTokens } from "../../skin-shared/src/tokens.js";
import { makeComposerCss } from "../../skin-shared/src/composer.js";

export const DINGTALK_BRAND_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="6" fill="#1677ff"></rect><circle cx="8" cy="8" r="2" fill="#fff"></circle><path d="M7 12h4.5a5 5 0 0 1 0 10H7V12Zm3 3v4h1.4a2 2 0 0 0 0-4H10Zm4-10h3v8h-3V5Z" fill="#fff"></path></svg>';

export const DINGTALK_TOKENS = makeTokens({
  light: {
    accent: "#1677ff", accentHover: "#0958d9", accentMuted: "#e6f4ff", canvas: "#f5f7fa",
    surface1: "#ffffff", surface2: "#f0f4f8", surface3: "#e2e8f0", textPrimary: "#1f2d3d",
    textSecondary: "#5d6b7a", textTertiary: "#8b98a7", border1: "#dbe2ea", border2: "#c7d1dc",
    border3: "#aebbc8", hover: "#edf5ff", active: "#e1efff", success: "#2eb85c", error: "#e5484d",
    warning: "#f5a623", tooltip: "#1f2d3d"
  },
  dark: {
    accent: "#69a7ff", accentHover: "#8bbcff", accentMuted: "#213a5c", canvas: "#171b21",
    surface1: "#202630", surface2: "#29313c", surface3: "#343e4a", textPrimary: "#eef3f8",
    textSecondary: "#b4c0cc", textTertiary: "#7e8c9a", border1: "#3a4653", border2: "#465361",
    border3: "#566574", hover: "#26364b", active: "#2c4058", success: "#43d17a", error: "#ff6b70",
    warning: "#ffc15c", tooltip: "#101418"
  }
});

export const DINGTALK_CSS = `
html[data-chatlab-skin="dingtalk"] [class*="brand"] { display: inline-flex; align-items: center; gap: 8px; }
html[data-chatlab-skin="dingtalk"] .cl-brand-skin { display: inline-flex; align-items: center; gap: 6px; height: 24px; box-sizing: border-box; padding: 0 8px 0 4px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 7px; color: var(--dsw-alias-brand-primary); background: var(--dsw-alias-interactive-bg-hover-accent); font-size: 12px; font-weight: 600; line-height: 1; white-space: nowrap; }
html[data-chatlab-skin="dingtalk"] .cl-brand-mark { display: inline-flex; width: 18px; height: 18px; flex: none; }
html[data-chatlab-skin="dingtalk"] .cl-brand-mark img { display: block; width: 18px; height: 18px; }
html[data-chatlab-skin="dingtalk"] .cl-brand-label { display: inline-block; transform: translateY(-.5px); }
html[data-chatlab-skin="dingtalk"] [class*="projectRow"],
html[data-chatlab-skin="dingtalk"] [class*="sessionRow"] { border-radius: 8px; margin: 2px 8px; }
html[data-chatlab-skin="dingtalk"] [class*="projectRow"] { padding-top: 2px; padding-bottom: 2px; }
html[data-chatlab-skin="dingtalk"] [class*="projectText"] { font-size: 13px; font-weight: 600; }
html[data-chatlab-skin="dingtalk"] [class*="folder"],
html[data-chatlab-skin="dingtalk"] [class*="folderActive"] { color: #1677ff !important; }
html[data-chatlab-skin="dingtalk"] [class*="sessionRow"] { --cl-session-avatar-col: 32px; --cl-session-title-row: 20px; --cl-session-preview-row: 16px; --cl-session-column-gap: 9px; --cl-session-row-gap: 3px; min-height: 52px !important; padding: 6px 10px; box-shadow: 0 1px 0 rgba(31,45,61,.04); }
html[data-chatlab-skin="dingtalk"] [class*="sessionRow"]:hover { background: var(--dsw-alias-interactive-bg-hover); }
html[data-chatlab-skin="dingtalk"] [class*="sessionRow"][class*="selected"], html[data-chatlab-skin="dingtalk"] [class*="sessionRow"][class*="active"] { background: var(--dsw-alias-interactive-bg-hover-accent); box-shadow: inset 3px 0 #1677ff; }
html[data-chatlab-skin="dingtalk"] [class*="projectRow"][class*="selected"], html[data-chatlab-skin="dingtalk"] [class*="projectRow"][class*="active"] { background: var(--dsw-alias-interactive-bg-hover-accent); box-shadow: inset 3px 0 #1677ff; }
html[data-chatlab-skin="dingtalk"] [class*="sessionRow"] [class*="title"] { font-size: 14px; font-weight: 600; }
html[data-chatlab-skin="dingtalk"] .cl-avatar { width: 32px; height: 32px; border-radius: 8px; }
html[data-chatlab-skin="dingtalk"] .cl-preview { font-size: 12px; }
html[data-chatlab-skin="dingtalk"] .cl-unread-dot { position: absolute; top: 4px; left: 35px; display: block; width: 8px; height: 8px; border-radius: 50%; background: #e5484d; box-shadow: 0 0 0 2px var(--dsw-alias-bg-base); z-index: 1; }
html[data-chatlab-skin="dingtalk"] .cl-running-dot { position: absolute; bottom: 4px; left: 36px; display: block; width: 9px; height: 9px; border-radius: 50%; background: #1677ff; box-shadow: 0 0 0 2px var(--dsw-alias-bg-base); z-index: 1; }
html[data-chatlab-skin="dingtalk"] [class*="titleCluster"] [class*="crumbCurrent"] { font-size: 15px; font-weight: 650; }
html[data-chatlab-skin="dingtalk"] .cl-header-avatar { width: 32px; height: 32px; border-radius: 8px; }
html[data-chatlab-skin="dingtalk"] [class*="userStack"] [class*="bubble"] { background: #1677ff !important; color: #fff !important; border-radius: 12px 4px 12px 12px; padding: 9px 14px; box-shadow: 0 2px 5px rgba(22,119,255,.18); font-size: 15px; line-height: 22px; }
html[data-chatlab-skin="dingtalk"] [class*="userStack"] { max-width: min(520px, 78%); }
html[data-chatlab-skin="dingtalk"] [data-chat-flow-kind="assistant-step"] [class*="body"] { font-size: 15px; line-height: 24px; }
${makeComposerCss({ id: "dingtalk", cardRadius: "10px", toolbarRadius: "6px", sendRadius: "6px", motionName: "cl-dingtalk-composer-focus", focusDuration: ".14s", focusEasing: "cubic-bezier(.2,.8,.2,1)", sendTransition: "background .14s ease, transform .14s ease, box-shadow .14s ease;", sendHover: " box-shadow: 0 2px 5px rgba(22,119,255,.22);", sendActive: " transform: scale(.96);", motionFrom: "box-shadow: 0 0 0 0 rgba(22,119,255,0);", motionTo: "box-shadow: 0 0 0 2px rgba(22,119,255,.14);" })}
html[data-chatlab-skin="dingtalk"] .cl-project-icon { border-radius: 5px; }
html[data-chatlab-skin="dingtalk"] .cl-project-icon { background: hsl(var(--cl-project-hue, 215), 72%, 52%); }
`;
