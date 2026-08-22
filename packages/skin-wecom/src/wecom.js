import { makeTokens } from "../../skin-shared/src/tokens.js";
import { makeComposerCss } from "../../skin-shared/src/composer.js";

export const WECOM_BRAND_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="7" fill="#18b875"></rect><path d="M5.5 11.2c0-2.5 2.5-4.5 5.6-4.5 3.2 0 5.7 2 5.7 4.5s-2.5 4.5-5.7 4.5c-.6 0-1.2-.1-1.7-.2L6 17l.8-2.2c-.8-.9-1.3-2.2-1.3-3.6Zm4.1-.3h1.2V9.7H9.6v1.2Zm2.5 0h1.2V9.7h-1.2v1.2Z" fill="#fff"></path></svg>';

export const WECOM_TOKENS = makeTokens({
  light: {
    accent: "#07c160", accentHover: "#06ad56", accentMuted: "#e5f7ed", canvas: "#f5f6f7",
    surface1: "#ffffff", surface2: "#f0f2f3", surface3: "#e2e6e8", textPrimary: "#202124",
    textSecondary: "#667079", textTertiary: "#9aa3a8", border1: "#e0e4e6", border2: "#d2d8da",
    border3: "#c1c9cc", hover: "#eef8f2", active: "#e2f4e9", success: "#07c160", error: "#fa5151",
    warning: "#f2a900", tooltip: "#202124"
  },
  dark: {
    accent: "#35d77f", accentHover: "#5de394", accentMuted: "#1f4934", canvas: "#181a1b",
    surface1: "#202323", surface2: "#292d2e", surface3: "#34393a", textPrimary: "#edf0f0",
    textSecondary: "#b1b9bb", textTertiary: "#7f898c", border1: "#394041", border2: "#454d4e",
    border3: "#566061", hover: "#28332d", active: "#2d4035", success: "#35d77f", error: "#ff6b6b",
    warning: "#f6bd4c", tooltip: "#111313"
  }
});

export const WECOM_CSS = `
html[data-chatlab-skin="wecom"] [class*="brand"] { display: inline-flex; align-items: center; gap: 8px; }
html[data-chatlab-skin="wecom"] .cl-brand-skin { display: inline-flex; align-items: center; gap: 6px; height: 24px; box-sizing: border-box; padding: 0 8px 0 4px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 7px; color: var(--dsw-alias-brand-primary); background: var(--dsw-alias-interactive-bg-hover-accent); font-size: 12px; font-weight: 600; line-height: 1; white-space: nowrap; }
html[data-chatlab-skin="wecom"] .cl-brand-mark { display: inline-flex; width: 18px; height: 18px; flex: none; }
html[data-chatlab-skin="wecom"] .cl-brand-mark img { display: block; width: 18px; height: 18px; }
html[data-chatlab-skin="wecom"] .cl-brand-label { display: inline-block; transform: translateY(-.5px); }
html[data-chatlab-skin="wecom"] [class*="projectRow"],
html[data-chatlab-skin="wecom"] [class*="sessionRow"] { border-radius: 6px; margin: 1px 6px; }
html[data-chatlab-skin="wecom"] [class*="projectText"] { font-size: 13px; font-weight: 600; }
html[data-chatlab-skin="wecom"] [class*="folder"],
html[data-chatlab-skin="wecom"] [class*="folderActive"] { color: #07c160 !important; }
html[data-chatlab-skin="wecom"] [class*="sessionRow"] { --cl-session-avatar-col: 32px; --cl-session-title-row: 20px; --cl-session-preview-row: 16px; --cl-session-column-gap: 8px; --cl-session-row-gap: 3px; min-height: 50px !important; padding: 6px 9px; }
html[data-chatlab-skin="wecom"] [class*="sessionRow"]:hover { background: var(--dsw-alias-interactive-bg-hover); }
html[data-chatlab-skin="wecom"] [class*="sessionRow"][class*="selected"], html[data-chatlab-skin="wecom"] [class*="sessionRow"][class*="active"] { background: var(--dsw-alias-interactive-bg-hover-accent); }
html[data-chatlab-skin="wecom"] [class*="projectRow"][class*="selected"], html[data-chatlab-skin="wecom"] [class*="projectRow"][class*="active"] { background: var(--dsw-alias-interactive-bg-hover-accent); box-shadow: inset 2px 0 #07c160; }
html[data-chatlab-skin="wecom"] [class*="sessionRow"] [class*="title"] { font-size: 14px; font-weight: 500; }
html[data-chatlab-skin="wecom"] .cl-avatar { width: 32px; height: 32px; border-radius: 50%; }
html[data-chatlab-skin="wecom"] .cl-preview { font-size: 12px; color: var(--dsw-alias-label-tertiary); }
html[data-chatlab-skin="wecom"] .cl-unread-dot { position: absolute; top: 4px; left: 35px; display: block; width: 8px; height: 8px; border-radius: 50%; background: var(--dsw-alias-state-error-primary); box-shadow: 0 0 0 2px var(--dsw-alias-bg-base); z-index: 1; }
html[data-chatlab-skin="wecom"] .cl-running-dot { position: absolute; bottom: 4px; left: 36px; display: block; width: 9px; height: 9px; border-radius: 50%; background: #07c160; box-shadow: 0 0 0 2px var(--dsw-alias-bg-base); z-index: 1; }
html[data-chatlab-skin="wecom"] [class*="titleCluster"] [class*="crumbCurrent"] { font-size: 15px; font-weight: 600; }
html[data-chatlab-skin="wecom"] .cl-header-avatar { width: 32px; height: 32px; border-radius: 50%; }
html[data-chatlab-skin="wecom"] [class*="userStack"] [class*="bubble"] { background: #95ec69 !important; color: #1f2a20 !important; border-radius: 5px 5px 2px 5px; padding: 8px 12px; box-shadow: 0 1px 2px rgba(0,0,0,.08); font-size: 15px; line-height: 22px; }
html[data-chatlab-skin="wecom"] [class*="userStack"] { max-width: min(500px, 76%); }
html[data-chatlab-skin="wecom"] [data-chat-flow-kind="assistant-step"] [class*="body"] { font-size: 15px; line-height: 23px; }
${makeComposerCss({ id: "wecom", cardRadius: "8px", toolbarRadius: "5px", sendRadius: "5px", motionName: "cl-wecom-composer-focus", focusDuration: ".2s", focusShadow: "0 0 0 2px color-mix(in srgb, var(--dsw-alias-brand-primary) 12%, transparent)", sendTransition: "background .16s ease, box-shadow .16s ease;", sendHover: " box-shadow: 0 1px 4px rgba(7,193,96,.25);", motionFrom: "box-shadow: 0 0 0 0 rgba(7,193,96,0);", motionTo: "box-shadow: 0 0 0 2px rgba(7,193,96,.12);" })}
html[data-chatlab-skin="wecom"] .cl-project-icon { border-radius: 4px; }
html[data-chatlab-skin="wecom"] .cl-project-icon { background: hsl(var(--cl-project-hue, 145), 55%, 46%); }
`;
