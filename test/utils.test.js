import { describe, it, expect } from "vitest";
import { norm, hashHue } from "../src/core/utils.js";

describe("norm", () => {
  it("去除首尾空白并把连续空白折叠为单个空格", () => {
    expect(norm("  hello   world  ")).toBe("hello world");
    expect(norm("a\t\n b")).toBe("a b");
  });

  it("null/undefined 返回空串", () => {
    expect(norm(null)).toBe("");
    expect(norm(undefined)).toBe("");
    expect(norm(123)).toBe("123");
  });
});

describe("hashHue", () => {
  it("确定性：同一输入返回同一 hue", () => {
    expect(hashHue("feishu")).toBe(hashHue("feishu"));
  });

  it("返回 0-359 之间的整数", () => {
    const h = hashHue("anything");
    expect(Number.isInteger(h)).toBe(true);
    expect(h).toBeGreaterThanOrEqual(0);
    expect(h).toBeLessThan(360);
  });

  it("空串返回 0(兜底)", () => {
    expect(hashHue("")).toBe(0);
  });
});
