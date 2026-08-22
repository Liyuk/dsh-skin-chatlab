export const REQUIRED_TOKEN_KEYS = [
  "brand-primary", "brand-text", "brand-primary-invert",
  "brand-primary-new-colorprimary-new-color",
  "bg-base", "bg-layer-1", "bg-layer-2", "bg-layer-3",
  "label-primary", "label-secondary", "label-tertiary",
  "label-primary-foreground", "label-primary-inverted",
  "label-primary-bluish", "label-primary-dimmed", "label-caption", "label-dimmed",
  "border-l1", "border-l2", "border-l3",
  "interactive-bg-hover", "interactive-bg-active", "interactive-bg-hover-accent",
  "button-primary-fill", "button-primary-hover", "button-primary-dimmed",
  "state-success-primary", "state-error-primary", "state-warn-primary", "state-business-primary",
  "tooltip-bg", "toast-bg"
];

const DEFAULTS = {
  accent: "#4c88ff",
  accentHover: "#3d7bff",
  accentMuted: "#d9e4ff",
  canvas: "#ffffff",
  surface1: "#f5f6f7",
  surface2: "#eff0f1",
  surface3: "#e8eaed",
  textPrimary: "#1f2329",
  textSecondary: "#646a73",
  textTertiary: "#8f959e",
  border1: "#dee0e3",
  border2: "#d0d3d6",
  border3: "#bbbfc4",
  hover: "#eff0f1",
  active: "#e8eaed",
  success: "#34c724",
  error: "#f54a45",
  warning: "#ff8800",
  tooltip: "#1f2329"
};

function value(palette, key) {
  const candidate = palette && palette[key];
  return typeof candidate === "string" && candidate ? candidate : DEFAULTS[key];
}

function mapPalette(palette, dark) {
  const p = palette || {};
  const accent = value(p, "accent");
  const textPrimary = value(p, "textPrimary");
  const canvas = value(p, "canvas");
  return {
    "brand-primary": accent,
    "brand-text": accent,
    "brand-primary-invert": "#FFFFFF",
    "brand-primary-new-colorprimary-new-color": accent,
    "bg-base": canvas,
    "bg-layer-1": value(p, "surface1"),
    "bg-layer-2": value(p, "surface2"),
    "bg-layer-3": value(p, "surface3"),
    "label-primary": textPrimary,
    "label-secondary": value(p, "textSecondary"),
    "label-tertiary": value(p, "textTertiary"),
    "label-primary-foreground": "#FFFFFF",
    "label-primary-inverted": dark ? canvas : "#FFFFFF",
    "label-primary-bluish": accent,
    "label-primary-dimmed": value(p, "textTertiary"),
    "label-caption": value(p, "textTertiary"),
    "label-dimmed": value(p, "border3"),
    "border-l1": value(p, "border1"),
    "border-l2": value(p, "border2"),
    "border-l3": value(p, "border3"),
    "interactive-bg-hover": value(p, "hover"),
    "interactive-bg-active": value(p, "active"),
    "interactive-bg-hover-accent": value(p, "accentMuted"),
    "button-primary-fill": accent,
    "button-primary-hover": value(p, "accentHover"),
    "button-primary-dimmed": value(p, "accentMuted"),
    "state-success-primary": value(p, "success"),
    "state-error-primary": value(p, "error"),
    "state-warn-primary": value(p, "warning"),
    "state-business-primary": accent,
    "tooltip-bg": value(p, "tooltip"),
    "toast-bg": value(p, "tooltip")
  };
}

export function makeTokens(input) {
  const source = input || {};
  return {
    light: mapPalette(source.light, false),
    dark: mapPalette(source.dark, true)
  };
}
