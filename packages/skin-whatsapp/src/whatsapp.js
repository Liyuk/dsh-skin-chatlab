import { makeTokens } from "../../skin-shared/src/tokens.js";
import { makeComposerCss } from "../../skin-shared/src/composer.js";

export const WHATSAPP_BRAND_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><rect x="1" y="1" width="22" height="22" rx="7" fill="#25d366"></rect><path d="M5 7h3l2 8 2-6h2l2 6 2-8h3l-3.5 11h-2.8L13 13l-1.7 5H8.5L5 7Z" fill="#fff"></path></svg>';

export const WHATSAPP_TOKENS = makeTokens({
  light: {
    accent: "#25d366", accentHover: "#1da851", accentMuted: "#e2f7e9", canvas: "#efeae2",
    surface1: "#ffffff", surface2: "#f7f4ef", surface3: "#e8e3db", textPrimary: "#202c33",
    textSecondary: "#667781", textTertiary: "#8696a0", border1: "#e1e7e9", border2: "#d4dcdf",
    border3: "#bdc9ce", hover: "#f0f2f3", active: "#e1f3e7", success: "#25d366", error: "#ea4d58",
    warning: "#f0b323", tooltip: "#202c33"
  },
  dark: {
    accent: "#53d769", accentHover: "#72e585", accentMuted: "#244b31", canvas: "#111b21",
    surface1: "#202c33", surface2: "#26343b", surface3: "#34434a", textPrimary: "#e9edef",
    textSecondary: "#b8c5ca", textTertiary: "#86969e", border1: "#37444a", border2: "#46545a",
    border3: "#59686e", hover: "#29383e", active: "#2d4736", success: "#53d769", error: "#ff7180",
    warning: "#f5c15b", tooltip: "#0b141a"
  }
});

export const WHATSAPP_CSS = `
html[data-chatlab-skin="whatsapp"] [class*="brand"] { display: inline-flex; align-items: center; gap: 8px; }
html[data-chatlab-skin="whatsapp"] .cl-brand-skin { display: inline-flex; align-items: center; gap: 6px; height: 24px; box-sizing: border-box; padding: 0 8px 0 4px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 7px; color: var(--dsw-alias-brand-primary); background: var(--dsw-alias-interactive-bg-hover-accent); font-size: 12px; font-weight: 600; line-height: 1; white-space: nowrap; }
html[data-chatlab-skin="whatsapp"] .cl-brand-mark { display: inline-flex; width: 18px; height: 18px; flex: none; }
html[data-chatlab-skin="whatsapp"] .cl-brand-mark img { display: block; width: 18px; height: 18px; }
html[data-chatlab-skin="whatsapp"] .cl-brand-label { display: inline-block; transform: translateY(-.5px); }
html[data-chatlab-skin="whatsapp"] [class*="projectRow"],
html[data-chatlab-skin="whatsapp"] [class*="sessionRow"] { border-radius: 6px; margin: 1px 6px; }
html[data-chatlab-skin="whatsapp"] [class*="projectText"] { font-size: 13px; font-weight: 600; }
html[data-chatlab-skin="whatsapp"] [class*="folder"],
html[data-chatlab-skin="whatsapp"] [class*="folderActive"] { color: #25d366 !important; }
html[data-chatlab-skin="whatsapp"] [class*="sessionRow"] { --cl-session-avatar-col: 32px; --cl-session-title-row: 20px; --cl-session-preview-row: 16px; --cl-session-column-gap: 8px; --cl-session-row-gap: 3px; min-height: 52px !important; padding: 6px 9px; }
html[data-chatlab-skin="whatsapp"] [class*="sessionRow"]:hover { background: var(--dsw-alias-interactive-bg-hover); }
html[data-chatlab-skin="whatsapp"] [class*="sessionRow"][class*="selected"], html[data-chatlab-skin="whatsapp"] [class*="sessionRow"][class*="active"] { background: var(--dsw-alias-interactive-bg-hover-accent); }
html[data-chatlab-skin="whatsapp"] [class*="projectRow"][class*="selected"], html[data-chatlab-skin="whatsapp"] [class*="projectRow"][class*="active"] { background: var(--dsw-alias-interactive-bg-hover-accent); box-shadow: inset 2px 0 #25d366; }
html[data-chatlab-skin="whatsapp"] [class*="sessionRow"] [class*="title"] { font-size: 14px; font-weight: 500; }
html[data-chatlab-skin="whatsapp"] .cl-avatar { width: 32px; height: 32px; border-radius: 50%; }
html[data-chatlab-skin="whatsapp"] .cl-preview { font-size: 12px; }
html[data-chatlab-skin="whatsapp"] .cl-unread-dot { position: absolute; top: 4px; left: 35px; display: block; width: 8px; height: 8px; border-radius: 50%; background: #25d366; box-shadow: 0 0 0 2px var(--dsw-alias-bg-base); z-index: 1; }
html[data-chatlab-skin="whatsapp"] .cl-running-dot { position: absolute; bottom: 4px; left: 36px; display: block; width: 9px; height: 9px; border-radius: 50%; background: #25d366; box-shadow: 0 0 0 2px var(--dsw-alias-bg-base); z-index: 1; }
html[data-chatlab-skin="whatsapp"] [class*="titleCluster"] [class*="crumbCurrent"] { font-size: 15px; font-weight: 600; }
html[data-chatlab-skin="whatsapp"] .cl-header-avatar { width: 32px; height: 32px; border-radius: 50%; }
html[data-chatlab-skin="whatsapp"] [class*="userStack"] [class*="bubble"] { background: #d9fdd3 !important; color: #202c33 !important; border-radius: 8px 2px 8px 8px; padding: 8px 12px; box-shadow: 0 1px 1px rgba(32,44,51,.12); font-size: 15px; line-height: 22px; }
html[data-chatlab-skin="whatsapp"] [class*="userStack"] { max-width: min(510px, 78%); }
html[data-chatlab-skin="whatsapp"] [class*="userRow"] [class*="bubble"]::after { content: "✓✓"; margin-left: 8px; font-size: 10px; color: #53bdeb; letter-spacing: -2px; }
html[data-chatlab-skin="whatsapp"] [data-chat-flow-kind="assistant-step"] [class*="body"] { font-size: 15px; line-height: 23px; }
${makeComposerCss({ id: "whatsapp", cardRadius: "10px", toolbarRadius: "6px", sendRadius: "6px", motionName: "cl-whatsapp-composer-focus", focusDuration: ".18s", sendTransition: "background .16s ease, box-shadow .16s ease, transform .16s ease;", sendHover: " box-shadow: 0 2px 5px rgba(37,211,102,.24); transform: translateY(-1px);", motionFrom: "box-shadow: 0 0 0 0 rgba(37,211,102,0);", motionTo: "box-shadow: 0 0 0 2px rgba(37,211,102,.14);" })}
html[data-chatlab-skin="whatsapp"] .cl-project-icon { border-radius: 50%; }
html[data-chatlab-skin="whatsapp"] .cl-project-icon { background: hsl(var(--cl-project-hue, 145), 55%, 48%); }
`;
