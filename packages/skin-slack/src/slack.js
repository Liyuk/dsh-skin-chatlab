import { makeTokens } from "../../skin-shared/src/tokens.js";
import { makeComposerCss } from "../../skin-shared/src/composer.js";

export const SLACK_BRAND_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="6" fill="#26343b"></rect><path d="M7 7.5c0-1.4 1.1-2.5 2.5-2.5H17v3h-7v2.5h4.5A2.5 2.5 0 0 1 17 13v3.5c0 1.4-1.1 2.5-2.5 2.5H7v-3h7v-2.5H9.5A2.5 2.5 0 0 1 7 11V7.5Z" fill="#72c3cc"></path><circle cx="18.5" cy="5.5" r="1.5" fill="#f28b82"></circle></svg>';

export const SLACK_TOKENS = makeTokens({
  light: {
    accent: "#611f69", accentHover: "#4a154b", accentMuted: "#f1e8f3", canvas: "#ffffff",
    surface1: "#f8f7fa", surface2: "#f1eef3", surface3: "#e5e0e7", textPrimary: "#1d1c1d",
    textSecondary: "#616061", textTertiary: "#868486", border1: "#ddd9df", border2: "#c9c4cc",
    border3: "#aaa4ae", hover: "#f1eef3", active: "#e8e0ea", success: "#2bac76", error: "#e01e5a",
    warning: "#ecb22e", tooltip: "#1d1c1d"
  },
  dark: {
    accent: "#c98bd7", accentHover: "#e0a7eb", accentMuted: "#422d4b", canvas: "#1a1d21",
    surface1: "#222529", surface2: "#2b2f33", surface3: "#353a40", textPrimary: "#f8f8f8",
    textSecondary: "#c5c7c9", textTertiary: "#96999d", border1: "#3d4248", border2: "#474d54",
    border3: "#5b626b", hover: "#2b2f33", active: "#38323a", success: "#36c58a", error: "#f15b83",
    warning: "#f0b83f", tooltip: "#111315"
  }
});

export const SLACK_CSS = `
html[data-chatlab-skin="slack"] [class*="brand"] { display: inline-flex; align-items: center; gap: 8px; }
html[data-chatlab-skin="slack"] .cl-brand-skin { display: inline-flex; align-items: center; gap: 6px; height: 24px; box-sizing: border-box; padding: 0 8px 0 4px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 7px; color: var(--dsw-alias-brand-primary); background: var(--dsw-alias-interactive-bg-hover-accent); font-size: 12px; font-weight: 600; line-height: 1; white-space: nowrap; }
html[data-chatlab-skin="slack"] .cl-brand-mark { display: inline-flex; width: 18px; height: 18px; flex: none; }
html[data-chatlab-skin="slack"] .cl-brand-mark img { display: block; width: 18px; height: 18px; }
html[data-chatlab-skin="slack"] .cl-brand-label { display: inline-block; transform: translateY(-.5px); }
html[data-chatlab-skin="slack"] { --cl-slack-sidebar: #f1eef3; --cl-slack-project-text: #1d1c1d; --cl-slack-row-hover: rgba(97,31,105,.08); --cl-slack-row-selected: #e8e0ea; }
html[data-chatlab-skin="slack"] body[data-ds-dark-theme] { --cl-slack-sidebar: #34213f; --cl-slack-project-text: #ffffff; --cl-slack-row-hover: rgba(255,255,255,.08); --cl-slack-row-selected: #4a154b; }
html[data-chatlab-skin="slack"] [class*="projectRow"],
html[data-chatlab-skin="slack"] [class*="sessionRow"] { border-radius: 4px; margin: 1px 6px; }
html[data-chatlab-skin="slack"] [class*="projectRow"] { color: var(--cl-slack-project-text); background: var(--cl-slack-sidebar); }
html[data-chatlab-skin="slack"] [class*="projectRow"]:hover { filter: brightness(.98); }
html[data-chatlab-skin="slack"] [class*="projectRow"][class*="selected"], html[data-chatlab-skin="slack"] [class*="projectRow"][class*="active"] { background: var(--cl-slack-row-selected); box-shadow: inset 2px 0 #611f69; }
html[data-chatlab-skin="slack"] [class*="projectText"] { font-size: 12px; font-weight: 700; letter-spacing: .02em; }
html[data-chatlab-skin="slack"] [class*="folder"],
html[data-chatlab-skin="slack"] [class*="folderActive"] { color: #f8c54f !important; }
html[data-chatlab-skin="slack"] [class*="sessionRow"] { --cl-session-avatar-col: 28px; --cl-session-title-row: 20px; --cl-session-preview-row: 15px; --cl-session-column-gap: 8px; --cl-session-row-gap: 2px; min-height: 46px !important; padding: 5px 8px; }
html[data-chatlab-skin="slack"] [class*="sessionRow"]:hover { background: var(--cl-slack-row-hover); }
html[data-chatlab-skin="slack"] [class*="sessionRow"][class*="selected"], html[data-chatlab-skin="slack"] [class*="sessionRow"][class*="active"] { background: var(--cl-slack-row-selected); box-shadow: inset 2px 0 #611f69; }
html[data-chatlab-skin="slack"] [class*="sessionRow"] [class*="title"] { font-size: 13px; font-weight: 600; }
html[data-chatlab-skin="slack"] .cl-avatar { width: 28px; height: 28px; border-radius: 4px; }
html[data-chatlab-skin="slack"] .cl-preview { font-size: 11px; opacity: .72; }
html[data-chatlab-skin="slack"] .cl-unread-dot { position: absolute; top: 4px; left: 31px; display: block; width: 7px; height: 7px; border-radius: 50%; background: var(--dsw-alias-state-error-primary); box-shadow: 0 0 0 2px var(--dsw-alias-bg-base); z-index: 1; }
html[data-chatlab-skin="slack"] .cl-running-dot { position: absolute; bottom: 4px; left: 31px; display: block; width: 9px; height: 9px; border-radius: 50%; background: #36c58a; box-shadow: 0 0 0 2px var(--dsw-alias-bg-base); z-index: 1; }
html[data-chatlab-skin="slack"] [class*="titleCluster"] { gap: 6px; }
html[data-chatlab-skin="slack"] [class*="titleCluster"] [class*="crumbCurrent"] { font-size: 14px; font-weight: 700; }
html[data-chatlab-skin="slack"] .cl-header-avatar { width: 28px; height: 28px; border-radius: 4px; }
html[data-chatlab-skin="slack"] .cl-project-icon { border-radius: 3px; background: hsl(var(--cl-project-hue, 210), 45%, 42%); border: 1px solid rgba(255,255,255,.18); }
html[data-chatlab-skin="slack"] [class*="userStack"] [class*="bubble"] { background: #e8f5ff !important; color: #1d1c1d !important; border-radius: 5px; padding: 8px 12px; box-shadow: none; font-size: 14px; line-height: 21px; }
html[data-chatlab-skin="slack"] [class*="userStack"] { max-width: min(560px, 78%); }
html[data-chatlab-skin="slack"] [data-chat-flow-kind="assistant-step"] [class*="body"] { font-size: 14px; line-height: 22px; }
${makeComposerCss({ id: "slack", cardRadius: "6px", toolbarRadius: "4px", sendRadius: "4px", sendWeight: "600", motionName: "cl-slack-composer-focus", focusDuration: ".12s", motionFrom: "border-color: var(--dsw-alias-border-l1);", motionTo: "border-color: var(--dsw-alias-brand-primary);", sendTransition: "background .12s ease, filter .12s ease;", sendHover: " filter: brightness(1.08);" })}
html[data-chatlab-skin="slack"] .cl-turn-typing { font-size: 11px; }
html[data-chatlab-skin="slack"] .cl-project-icon { border-radius: 3px; }
`;
