// 皮肤注册表：SKINS 数组 + 查询表 + token 合并逻辑。
// 飞书皮肤资产来自 ./feishu.js；其余为占位(ready=false，UI 置灰)。
import { DEFAULT_TOKENS_LIGHT, DEFAULT_TOKENS_DARK, FEISHU_CSS } from "./feishu.js";

export const SKINS = [
  {
    id: "feishu", name: "飞书", desc: "工作区=项目组 · 会话=联系人 · 气泡化聊天",
    ready: true, tokens: { light: {}, dark: {} }, css: FEISHU_CSS
  },
  {
    id: "slack", name: "Slack", desc: "占位：待做",
    ready: false,
    tokens: {
      light: { "brand-primary": "#611F69", "brand-text": "#611F69", "brand-primary-invert": "#FFFFFF", "button-primary-fill": "#611F69", "button-primary-hover": "#4A154B", "state-business-primary": "#611F69", "label-primary-bluish": "#611F69" },
      dark: { "brand-primary": "#9C4AA8", "brand-text": "#9C4AA8", "brand-primary-invert": "#1A1A1A", "button-primary-fill": "#9C4AA8", "state-business-primary": "#9C4AA8", "label-primary-bluish": "#9C4AA8" }
    },
    css: ""
  },
  {
    id: "wechat", name: "微信", desc: "占位：待做",
    ready: false,
    tokens: {
      light: { "brand-primary": "#07C160", "brand-text": "#07C160", "brand-primary-invert": "#FFFFFF", "button-primary-fill": "#07C160", "button-primary-hover": "#06AD56", "state-business-primary": "#07C160", "state-success-primary": "#07C160", "label-primary-bluish": "#07C160" },
      dark: { "brand-primary": "#07C160", "brand-text": "#07C160", "brand-primary-invert": "#1A1A1A", "button-primary-fill": "#07C160", "state-business-primary": "#07C160", "state-success-primary": "#07C160", "label-primary-bluish": "#07C160" }
    },
    css: ""
  },
  {
    id: "imessage", name: "iMessage", desc: "占位：待做",
    ready: false,
    tokens: {
      light: { "brand-primary": "#0A84FF", "brand-text": "#0A84FF", "brand-primary-invert": "#FFFFFF", "button-primary-fill": "#0A84FF", "state-business-primary": "#0A84FF", "label-primary-bluish": "#0A84FF" },
      dark: { "brand-primary": "#0A84FF", "brand-text": "#0A84FF", "brand-primary-invert": "#1A1A1A", "button-primary-fill": "#0A84FF", "state-business-primary": "#0A84FF", "label-primary-bluish": "#0A84FF" }
    },
    css: ""
  },
  {
    id: "whatsapp", name: "WhatsApp", desc: "占位：待做",
    ready: false,
    tokens: {
      light: { "brand-primary": "#25D366", "brand-text": "#25D366", "brand-primary-invert": "#FFFFFF", "button-primary-fill": "#25D366", "state-business-primary": "#25D366", "state-success-primary": "#25D366", "label-primary-bluish": "#25D366" },
      dark: { "brand-primary": "#25D366", "brand-text": "#25D366", "brand-primary-invert": "#1A1A1A", "button-primary-fill": "#25D366", "state-business-primary": "#25D366", "state-success-primary": "#25D366", "label-primary-bluish": "#25D366" }
    },
    css: ""
  },
  {
    id: "discord", name: "Discord", desc: "占位：待做",
    ready: false,
    tokens: {
      light: { "brand-primary": "#5865F2", "brand-text": "#5865F2", "brand-primary-invert": "#FFFFFF", "button-primary-fill": "#5865F2", "button-primary-hover": "#4752C4", "state-business-primary": "#5865F2", "label-primary-bluish": "#5865F2" },
      dark: { "brand-primary": "#6D7DFF", "brand-text": "#6D7DFF", "brand-primary-invert": "#1A1A1A", "button-primary-fill": "#6D7DFF", "state-business-primary": "#6D7DFF", "label-primary-bluish": "#6D7DFF" }
    },
    css: ""
  },
  {
    id: "telegram", name: "Telegram", desc: "占位：待做",
    ready: false,
    tokens: {
      light: { "brand-primary": "#2AABEE", "brand-text": "#2AABEE", "brand-primary-invert": "#FFFFFF", "button-primary-fill": "#2AABEE", "button-primary-hover": "#1E9BD6", "state-business-primary": "#2AABEE", "label-primary-bluish": "#2AABEE" },
      dark: { "brand-primary": "#5EB5F7", "brand-text": "#5EB5F7", "brand-primary-invert": "#1A1A1A", "button-primary-fill": "#5EB5F7", "state-business-primary": "#5EB5F7", "label-primary-bluish": "#5EB5F7" }
    },
    css: ""
  },
  {
    id: "irc", name: "IRC 终端", desc: "占位：待做",
    ready: false,
    tokens: {
      light: { "brand-primary": "#22A55A", "brand-text": "#22A55A", "brand-primary-invert": "#FFFFFF", "button-primary-fill": "#22A55A", "button-primary-hover": "#1B8A49", "state-business-primary": "#22A55A", "label-primary-bluish": "#22A55A" },
      dark: { "brand-primary": "#4ADE80", "brand-text": "#4ADE80", "brand-primary-invert": "#1A1A1A", "button-primary-fill": "#4ADE80", "state-business-primary": "#4ADE80", "label-primary-bluish": "#4ADE80" }
    },
    css: ""
  },
  {
    id: "msn", name: "MSN Messenger", desc: "占位：待做",
    ready: false,
    tokens: {
      light: { "brand-primary": "#7BC043", "brand-text": "#7BC043", "brand-primary-invert": "#FFFFFF", "button-primary-fill": "#7BC043", "button-primary-hover": "#6BA93A", "state-business-primary": "#7BC043", "state-success-primary": "#7BC043", "label-primary-bluish": "#7BC043" },
      dark: { "brand-primary": "#9ED121", "brand-text": "#9ED121", "brand-primary-invert": "#1A1A1A", "button-primary-fill": "#9ED121", "state-business-primary": "#9ED121", "state-success-primary": "#9ED121", "label-primary-bluish": "#9ED121" }
    },
    css: ""
  },
  {
    id: "kakaotalk", name: "KakaoTalk", desc: "占位：待做",
    ready: false,
    tokens: {
      light: { "brand-primary": "#FEE500", "brand-text": "#FEE500", "brand-primary-invert": "#191919", "button-primary-fill": "#FEE500", "button-primary-hover": "#F2DB00", "state-business-primary": "#FEE500", "label-primary-bluish": "#FEE500" },
      dark: { "brand-primary": "#FEE500", "brand-text": "#FEE500", "brand-primary-invert": "#191919", "button-primary-fill": "#FEE500", "state-business-primary": "#FEE500", "label-primary-bluish": "#FEE500" }
    },
    css: ""
  },
  {
    id: "line", name: "LINE", desc: "占位：待做",
    ready: false,
    tokens: {
      light: { "brand-primary": "#06C755", "brand-text": "#06C755", "brand-primary-invert": "#FFFFFF", "button-primary-fill": "#06C755", "button-primary-hover": "#05A847", "state-business-primary": "#06C755", "state-success-primary": "#06C755", "label-primary-bluish": "#06C755" },
      dark: { "brand-primary": "#06C755", "brand-text": "#06C755", "brand-primary-invert": "#1A1A1A", "button-primary-fill": "#06C755", "state-business-primary": "#06C755", "state-success-primary": "#06C755", "label-primary-bluish": "#06C755" }
    },
    css: ""
  }
];

export const SKIN_BY_ID = {};
SKINS.forEach(function (s) { SKIN_BY_ID[s.id] = s; });

export function tokenBlock(tokens, theme) {
  var base = theme === "dark" ? DEFAULT_TOKENS_DARK : DEFAULT_TOKENS_LIGHT;
  var merged = {};
  var k;
  for (k in base) merged[k] = base[k];
  if (tokens && tokens[theme]) for (k in tokens[theme]) merged[k] = tokens[theme][k];
  var lines = [];
  for (k in merged) lines.push("  --dsw-alias-" + k + ": " + merged[k] + ";");
  return lines.join("\n");
}
