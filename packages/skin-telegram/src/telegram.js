import { makeTokens } from "../../skin-shared/src/tokens.js";
import { makeComposerCss } from "../../skin-shared/src/composer.js";

export const TELEGRAM_BRAND_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><rect x="1" y="1" width="22" height="22" rx="7" fill="#2aabee"></rect><path d="M6 6h12v3h-4.5v9h-3V9H6V6Z" fill="#fff"></path><circle cx="18" cy="18" r="2" fill="#b9e6fb"></circle></svg>';

export const TELEGRAM_TOKENS = makeTokens({
  light: {
    accent: "#2aabee", accentHover: "#168dcc", accentMuted: "#e4f5fc", canvas: "#eef6fb",
    surface1: "#ffffff", surface2: "#f5f9fc", surface3: "#e5eff5", textPrimary: "#17212b",
    textSecondary: "#68808f", textTertiary: "#8da1ad", border1: "#d9e7ee", border2: "#c6d9e3",
    border3: "#aec6d3", hover: "#e8f4fa", active: "#dff0f8", success: "#32b77a", error: "#e85d75",
    warning: "#e6a23c", tooltip: "#17212b"
  },
  dark: {
    accent: "#64b5e8", accentHover: "#83c6ef", accentMuted: "#25465b", canvas: "#17212b",
    surface1: "#202b36", surface2: "#283642", surface3: "#34434f", textPrimary: "#f1f5f8",
    textSecondary: "#b1c0ca", textTertiary: "#81929d", border1: "#384956", border2: "#465865",
    border3: "#576a77", hover: "#253a49", active: "#2b4659", success: "#45d494", error: "#ff7188",
    warning: "#f3ba63", tooltip: "#0f171e"
  }
});

export const TELEGRAM_CSS = `
html[data-chatlab-skin="telegram"] [class*="brand"] { display: inline-flex; align-items: center; gap: 8px; }
html[data-chatlab-skin="telegram"] .cl-brand-skin { display: inline-flex; align-items: center; gap: 6px; height: 24px; box-sizing: border-box; padding: 0 8px 0 4px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 7px; color: var(--dsw-alias-brand-primary); background: var(--dsw-alias-interactive-bg-hover-accent); font-size: 12px; font-weight: 600; line-height: 1; white-space: nowrap; }
html[data-chatlab-skin="telegram"] .cl-brand-mark { display: inline-flex; width: 18px; height: 18px; flex: none; }
html[data-chatlab-skin="telegram"] .cl-brand-mark img { display: block; width: 18px; height: 18px; }
html[data-chatlab-skin="telegram"] .cl-brand-label { display: inline-block; transform: translateY(-.5px); }
html[data-chatlab-skin="telegram"] [class*="projectRow"],
html[data-chatlab-skin="telegram"] [class*="sessionRow"] { border-radius: 10px; margin: 2px 8px; }
html[data-chatlab-skin="telegram"] [class*="projectText"] { font-size: 13px; font-weight: 600; }
html[data-chatlab-skin="telegram"] [class*="folder"],
html[data-chatlab-skin="telegram"] [class*="folderActive"] { color: #2aabee !important; }
html[data-chatlab-skin="telegram"] [class*="sessionRow"] { --cl-session-avatar-col: 34px; --cl-session-title-row: 21px; --cl-session-preview-row: 16px; --cl-session-column-gap: 9px; --cl-session-row-gap: 3px; min-height: 56px !important; padding: 7px 10px; }
html[data-chatlab-skin="telegram"] [class*="sessionRow"]:hover { background: var(--dsw-alias-interactive-bg-hover); }
html[data-chatlab-skin="telegram"] [class*="sessionRow"][class*="selected"], html[data-chatlab-skin="telegram"] [class*="sessionRow"][class*="active"] { background: var(--dsw-alias-interactive-bg-hover-accent); }
html[data-chatlab-skin="telegram"] [class*="projectRow"][class*="selected"], html[data-chatlab-skin="telegram"] [class*="projectRow"][class*="active"] { background: var(--dsw-alias-interactive-bg-hover-accent); box-shadow: inset 2px 0 #2aabee; }
html[data-chatlab-skin="telegram"] [class*="sessionRow"] [class*="title"] { font-size: 14px; font-weight: 500; }
html[data-chatlab-skin="telegram"] .cl-avatar { width: 34px; height: 34px; border-radius: 50%; }
html[data-chatlab-skin="telegram"] .cl-preview { font-size: 12px; }
html[data-chatlab-skin="telegram"] .cl-unread-dot { position: absolute; top: 4px; left: 37px; display: block; width: 8px; height: 8px; border-radius: 50%; background: #2aabee; box-shadow: 0 0 0 2px var(--dsw-alias-bg-base); z-index: 1; }
html[data-chatlab-skin="telegram"] .cl-running-dot { position: absolute; bottom: 4px; left: 38px; display: block; width: 9px; height: 9px; border-radius: 50%; background: #2aabee; box-shadow: 0 0 0 2px var(--dsw-alias-bg-base); z-index: 1; }
html[data-chatlab-skin="telegram"] [class*="titleCluster"] [class*="crumbCurrent"] { font-size: 15px; font-weight: 600; }
html[data-chatlab-skin="telegram"] .cl-header-avatar { width: 34px; height: 34px; border-radius: 50%; }
html[data-chatlab-skin="telegram"] [class*="userStack"] [class*="bubble"] { background: #effdde !important; color: #17212b !important; border-radius: 18px 4px 18px 18px; padding: 9px 14px; box-shadow: 0 1px 2px rgba(38,70,90,.1); font-size: 15px; line-height: 23px; }
html[data-chatlab-skin="telegram"] [class*="userStack"] { max-width: min(540px, 78%); }
html[data-chatlab-skin="telegram"] [data-chat-flow-kind="assistant-step"] [class*="body"] { font-size: 15px; line-height: 24px; }
${makeComposerCss({ id: "telegram", cardRadius: "18px", toolbarRadius: "50%", sendRadius: "50%", motionName: "cl-telegram-composer-focus", focusDuration: ".16s", focusEasing: "cubic-bezier(.2,.8,.2,1)", sendTransition: "background .14s ease, transform .14s cubic-bezier(.2,.8,.2,1);", sendHover: " transform: translateX(2px);", motionFrom: "box-shadow: 0 0 0 0 rgba(42,171,238,0);", motionTo: "box-shadow: 0 0 0 2px rgba(42,171,238,.14);" })}
html[data-chatlab-skin="telegram"] .cl-project-icon { border-radius: 50%; }
html[data-chatlab-skin="telegram"] .cl-project-icon { background: hsl(var(--cl-project-hue, 200), 62%, 54%); }
`;
