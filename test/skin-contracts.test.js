import { describe, expect, it } from "vitest";
import { FEISHU_CSS, FEISHU_BRAND_SVG, DEFAULT_TOKENS_LIGHT, DEFAULT_TOKENS_DARK } from "../packages/skin-feishu/src/feishu.js";
import { SLACK_CSS, SLACK_BRAND_SVG, SLACK_TOKENS } from "../packages/skin-slack/src/slack.js";
import { WECOM_CSS, WECOM_BRAND_SVG, WECOM_TOKENS } from "../packages/skin-wecom/src/wecom.js";
import { DINGTALK_CSS, DINGTALK_BRAND_SVG, DINGTALK_TOKENS } from "../packages/skin-dingtalk/src/dingtalk.js";
import { TELEGRAM_CSS, TELEGRAM_BRAND_SVG, TELEGRAM_TOKENS } from "../packages/skin-telegram/src/telegram.js";
import { WHATSAPP_CSS, WHATSAPP_BRAND_SVG, WHATSAPP_TOKENS } from "../packages/skin-whatsapp/src/whatsapp.js";
import { COMMON_CSS } from "../packages/core/src/theme.js";

const skins = [
  { id: "feishu", css: FEISHU_CSS, svg: FEISHU_BRAND_SVG, tokens: { light: DEFAULT_TOKENS_LIGHT, dark: DEFAULT_TOKENS_DARK } },
  { id: "slack", css: SLACK_CSS, svg: SLACK_BRAND_SVG, tokens: SLACK_TOKENS },
  { id: "wecom", css: WECOM_CSS, svg: WECOM_BRAND_SVG, tokens: WECOM_TOKENS },
  { id: "dingtalk", css: DINGTALK_CSS, svg: DINGTALK_BRAND_SVG, tokens: DINGTALK_TOKENS },
  { id: "telegram", css: TELEGRAM_CSS, svg: TELEGRAM_BRAND_SVG, tokens: TELEGRAM_TOKENS },
  { id: "whatsapp", css: WHATSAPP_CSS, svg: WHATSAPP_BRAND_SVG, tokens: WHATSAPP_TOKENS }
];

describe("skin visual adapter contracts", () => {
  it("provides shared layout primitives for injected brand and header avatar nodes", () => {
    expect(COMMON_CSS).toMatch(/\.cl-brand-skin\s*\{[^}]*display:\s*inline-flex/s);
    expect(COMMON_CSS).toMatch(/\.cl-brand-mark\s*\{[^}]*width:\s*18px/s);
    expect(COMMON_CSS).toMatch(/\.cl-brand-mark img\s*\{[^}]*width:\s*18px/s);
    expect(COMMON_CSS).toMatch(/\.cl-header-avatar\s*\{[^}]*order:\s*-1/s);
    expect(COMMON_CSS).toMatch(/\[class\*="projectRow"\].*\[class\*="folder"\].*> svg\s*\{[^}]*display:\s*none/s);
    expect(COMMON_CSS).toMatch(/\.cl-project-icon\s*\{[^}]*width:\s*16px[^}]*height:\s*16px/s);
    expect(COMMON_CSS).toMatch(/\[class\*="sessionRow"\]\s*\{[^}]*display:\s*grid/s);
    expect(COMMON_CSS).toMatch(/\[class\*="sessionRow"\].*\[class\*="slot"\]\s*\{[^}]*display:\s*none/s);
    expect(COMMON_CSS).toMatch(/\[class\*="sessionRow"\] \.cl-avatar\s*\{[^}]*grid-column:\s*1/s);
    expect(COMMON_CSS).toMatch(/\[class\*="sessionRow"\] \.cl-preview\s*\{[^}]*grid-column:\s*2/s);
  });

  it("defines one complete, distinct visual adapter per skin", () => {
    expect(new Set(skins.map((skin) => skin.id)).size).toBe(skins.length);
    for (const skin of skins) {
      expect(skin.css).toContain(`html[data-chatlab-skin="${skin.id}"]`);
      expect(skin.css).not.toMatch(/https?:\/\//);
      expect(skin.css).not.toMatch(/[A-Za-z0-9]{5,}_[A-Za-z0-9]{5,}_/);
      expect(skin.svg).toMatch(/^<svg\b/);
      expect(skin.svg).not.toMatch(/(?:href|src)=["']https?:\/\//i);
      expect(Object.keys(skin.tokens.light).length).toBeGreaterThan(20);
      expect(Object.keys(skin.tokens.dark).length).toBe(Object.keys(skin.tokens.light).length);
      expect(skin.css).toMatch(/\[class\*=["']sessionRow["']\]/);
      expect(skin.css).toContain("[data-composer-card]");
      expect(skin.css).toContain(".cl-preview");
      expect(skin.css).toContain(".cl-unread-dot");
      expect(skin.css).toMatch(/\.cl-brand-skin\s*\{[^}]*height:\s*24px/s);
      expect(skin.css).toMatch(/\.cl-brand-mark\s*\{[^}]*width:\s*18px/s);
      expect(skin.css).toMatch(/\.cl-brand-mark img\s*\{[^}]*width:\s*18px/s);
      expect(skin.css).toMatch(/\.cl-avatar\s*\{[^}]*width:/s);
      expect(skin.css).toMatch(/\.cl-preview\s*\{/s);
      expect(skin.css).toMatch(/\.cl-header-avatar\s*\{[^}]*width:/s);
      expect(skin.css).toMatch(/\.cl-unread-dot\s*\{[^}]*position:\s*absolute[^}]*border-radius:\s*50%/s);
      expect(skin.css).toMatch(/\.cl-running-dot\s*\{[^}]*position:\s*absolute[^}]*border-radius:\s*50%/s);
      expect(skin.css).toContain('[class*="projectRow"][class*="selected"]');
      expect(skin.css).toMatch(/\[class\*="sessionRow"\].*\[class\*="selected"\]/s);
    }
  });

  it("gives Feishu composer a focused editor and toolbar treatment", () => {
    expect(FEISHU_CSS).toMatch(/\[data-composer-card\]\s*\{[^}]*border-radius:\s*8px[^}]*box-shadow:\s*none/s);
    expect(FEISHU_CSS).toMatch(/\[data-composer-card\]:focus-within\s*\{[^}]*border-color:\s*var\(--dsw-alias-brand-primary\)/s);
    expect(FEISHU_CSS).toMatch(/\[data-composer-card\]\s*\[contenteditable="true"\][^}]*color:\s*var\(--dsw-alias-label-primary\)/s);
    expect(FEISHU_CSS).toMatch(/\[data-composer-card\]\s*\[class\*="toolbar"\][^}]*color:\s*var\(--dsw-alias-label-secondary\)/s);
    expect(FEISHU_CSS).toMatch(/\[data-composer-card\]\s*button:disabled[^}]*opacity:\s*\.45/s);
    expect(FEISHU_CSS).not.toContain("min-height: 112px");
    expect(FEISHU_CSS).not.toContain("min-height: 64px");
    expect(FEISHU_CSS).not.toContain("padding: 8px 10px 7px");
    expect(FEISHU_CSS).not.toContain("padding: 6px 4px");
  });

  it("gives every non-Feishu composer skin-only visual states", () => {
    for (const skin of skins.filter((item) => item.id !== "feishu")) {
      expect(skin.css).toMatch(/\[data-composer-card\]\s*\{[^}]*border-radius:/s);
      expect(skin.css).toMatch(/\[data-composer-card\]:focus-within\s*\{[^}]*border-color:\s*var\(--dsw-alias-brand-primary\)/s);
      expect(skin.css).toMatch(/\[data-composer-card\]\s*\[contenteditable="true"\][^}]*color:\s*var\(--dsw-alias-label-primary\)/s);
      expect(skin.css).toMatch(/\[data-composer-card\]\s*\[class\*="toolbar"\][^}]*color:\s*var\(--dsw-alias-label-secondary\)/s);
      expect(skin.css).toMatch(/\[data-composer-card\]\s*button:disabled[^}]*opacity:\s*\.45/s);
      expect(skin.css).not.toMatch(/\[data-composer-card\][^}]*\b(?:min-height|height|padding|width):/s);
      expect(skin.css).toMatch(/\[data-composer-card\].*\[aria-label\*="(?:send|发送)"/s);
    }
  });

  it("keeps composer interaction motion distinct per product", () => {
    const motionNames = skins.map((skin) => {
      expect(skin.css).toMatch(new RegExp(`cl-${skin.id}-composer`));
      return skin.css.match(new RegExp(`cl-${skin.id}-composer-[a-z-]+`))?.[0];
    });
    expect(new Set(motionNames).size).toBe(skins.length);
  });
});
