import { describe, expect, it } from "vitest";
import { makeTokens, REQUIRED_TOKEN_KEYS } from "../packages/skin-shared/src/tokens.js";
import { DEFAULT_TOKENS_LIGHT, DEFAULT_TOKENS_DARK } from "../packages/skin-feishu/src/feishu.js";

describe("skin token contract", () => {
  it("maps semantic light and dark palettes to the complete DSH alias contract", () => {
    const tokens = makeTokens({
      light: {
        accent: "#112233",
        accentHover: "#223344",
        accentMuted: "#ddeeff",
        canvas: "#ffffff",
        surface1: "#f7f7f7",
        surface2: "#eeeeee",
        surface3: "#dddddd",
        textPrimary: "#111111",
        textSecondary: "#555555",
        textTertiary: "#888888",
        border1: "#e5e5e5",
        border2: "#d5d5d5",
        border3: "#c5c5c5",
        hover: "#f0f0f0",
        active: "#e8e8e8",
        success: "#00aa55",
        error: "#dd3344",
        warning: "#ee9900",
        tooltip: "#222222"
      },
      dark: {
        accent: "#88aaff",
        accentHover: "#7799ee",
        accentMuted: "#243047",
        canvas: "#171717",
        surface1: "#1d1d1d",
        surface2: "#252525",
        surface3: "#303030",
        textPrimary: "#f4f4f4",
        textSecondary: "#bbbbbb",
        textTertiary: "#888888",
        border1: "#3b3b3b",
        border2: "#444444",
        border3: "#505050",
        hover: "#292929",
        active: "#333333",
        success: "#33cc77",
        error: "#ff6677",
        warning: "#ffb347",
        tooltip: "#303030"
      }
    });

    expect(Object.keys(tokens.light).sort()).toEqual([...REQUIRED_TOKEN_KEYS].sort());
    expect(Object.keys(tokens.dark).sort()).toEqual([...REQUIRED_TOKEN_KEYS].sort());
    expect(tokens.light["brand-primary"]).toBe("#112233");
    expect(tokens.light["brand-primary-new-colorprimary-new-color"]).toBe("#112233");
    expect(tokens.light["button-primary-hover"]).toBe("#223344");
    expect(tokens.light["interactive-bg-hover-accent"]).toBe("#ddeeff");
    expect(tokens.dark["bg-base"]).toBe("#171717");
    expect(tokens.dark["label-primary-inverted"]).toBe("#171717");
    expect(tokens.dark["toast-bg"]).toBe("#303030");
  });

  it("keeps Feishu's established token values unchanged", () => {
    expect(DEFAULT_TOKENS_LIGHT["brand-primary"]).toBe("#1456F0");
    expect(DEFAULT_TOKENS_LIGHT["bg-layer-1"]).toBe("#F5F6F7");
    expect(DEFAULT_TOKENS_LIGHT["label-primary"]).toBe("#1F2329");
    expect(DEFAULT_TOKENS_DARK["brand-primary"]).toBe("#4C88FF");
    expect(DEFAULT_TOKENS_DARK["bg-base"]).toBe("#1A1A1A");
    expect(DEFAULT_TOKENS_DARK["label-primary"]).toBe("#E8EAED");
  });
});
