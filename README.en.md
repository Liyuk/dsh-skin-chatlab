# dsh-skin-chatlab

简体中文 · [English](./README.en.md)

> **Note**: This project's primary documentation is the [Chinese README](./README.md). This English copy mirrors it — when editing, keep both in sync.

An extensible chat-skin plugin for the [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness) Web GUI. At its core is a **skin registry + switcher** that restyles the chat UI into Feishu / Slack / WeChat / iMessage / WhatsApp and more.

Feishu ships first; the rest are placeholders. Each skin owns only **appearance** (layout / palette / bubbles) and **never touches DSH chat logic** or any existing plugin.

---

## Features

- **Skin registry**: a `SKINS[]` array where each skin declares only `{ id, name, desc, tokens, css }` — adding a skin changes no shared logic
- **Settings switcher**: a "ChatLab 皮肤" section with pill buttons; switching a skin auto-refreshes, dark mode hot-switches
- **Feishu skin** (first, fully implemented):
  - Workspaces become "项目组" (project groups with colored rounded-square initials)
  - Sessions become "联系人" (contacts: deterministic avatar + last-message preview + unread dot, auto-clears on open)
  - Bubbled chat: blue bubbles with a read check for you, gray for the assistant
  - Brand logo: Feishu birds + "DeepSeek HARNESS" + a "飞书皮肤" badge
- **Last-message preview + unread**: reads session logs via a loopback RPC (live + cold sessions), data layer decoupled from skins
- **Purely additive**: switching to "无皮肤" fully unloads and restores DSH defaults

---

## Install

```sh
dsh plugin --profile web add @liyuk/dsh-skin-chatlab
```

Or mount manually in your profile's `package.json`:

```jsonc
{
  "dependencies": {
    "@liyuk/dsh-skin-chatlab": "^1.0.0"
  },
  "dsh": {
    "profile": {
      "bundles": [
        // ... other bundles
        "dsh-skin-chatlab"
      ]
    }
  }
}
```

Then restart DSH Web:

```sh
dsh --profile web
```

Open Settings → find "ChatLab 皮肤" in the left nav → pick "飞书".

---

## Usage

After installing and restarting, open DSH Web settings (bottom-left gear) and find "**ChatLab 皮肤**" in the left navigation.

### Switching skins

- The settings panel shows a row of **pill buttons**: 无皮肤 / 飞书 / Slack / WeChat / … / WhatsApp
- Clicking a skin shows "正在刷新…" and the page auto-reloads
- Unimplemented placeholder skins are grayed out ("待做") and unclickable
- "无皮肤" fully unloads the skin and restores DSH defaults

### Dark mode

- The "深色模式" toggle hot-switches (no page reload)
- It delegates to DSH's own theme system, so light/dark palettes follow automatically

### Feishu skin effects (the only complete skin today)

| Area | Effect |
|---|---|
| Left workspaces | Become "项目组": colored rounded-square + initial |
| Left session list | Become "联系人": each session has a **round avatar** and a **last-message preview** line |
| Unread | Red dot on the avatar's top-right; it auto-clears once you open the session |
| Chat window | Your messages are **blue bubbles with a read check**; AI replies are gray text |
| Top brand | The DeepSeek whale becomes "Feishu birds + DeepSeek HARNESS + 飞书皮肤" badge |

> Note: skins only change appearance — they never touch DSH chat data, session logic, or existing plugins. "无皮肤" fully restores defaults.

### First-use note

- On first load, all historical sessions use their **current last message as the "read" baseline**, so you won't see a wall of red dots
- After that, only genuinely new messages light the dot, cleared on open

---

## Developing a skin

Add an entry to the `SKINS` array in `src/skins/registry.js` — no shared logic changes needed:

```js
{
  id: "slack",
  name: "Slack",
  desc: "Slack style",
  ready: true,               // false = placeholder (grayed out), true = switchable
  tokens: {                  // overrides --dsw-alias-* design tokens
    light: { "brand-primary": "#611F69" },
    dark:  { "brand-primary": "#9C4AA8" }
  },
  css: ""                    // skin-specific rules (bubble shape/radius/avatar size...)
}
```

### Skin contract

| Field | Type | Meaning |
|---|---|---|
| `id` | string | unique localStorage key, also written to `data-chatlab-skin` |
| `name` | string | display name in settings |
| `desc` | string | one-line description |
| `ready` | boolean | `false` = placeholder (grayed); `true` = switchable |
| `tokens` | `{light, dark}` | overrides `--dsw-alias-*` design tokens |
| `css` | string | skin-specific rules |

---

## Architecture

```
SKINS[]            each skin declares "appearance": tokens (light/dark) + CSS
common layer       skin-agnostic skeleton:
                   - preference read/write (localStorage)
                   - reflect data-chatlab-skin onto <html>
                   - last-message preview + unread dot + avatar injection (data logic shared)
                   - settings switcher
host half          registers /dsh-skin-chatlab loopback RPC, reads session logs for preview/unread
```

Key implementation constraints (DSH is a React app):

- **Never observe the whole `body` with MutationObserver** (cripples React reconcile)
- **Never `innerHTML=""` a React node, never `insertBefore` before a React node** (triggers `removeChild` crashes)
- Decoration only `appendChild`s its own nodes, positions them with CSS Grid/flex, never moves React nodes
- Dark mode delegates to DSH's `ctx.theme.setTheme()`; we don't maintain our own theme

---

## Contributing

Welcome — let's turn more chat apps into skins!

- **Getting started**: branch workflow, code layout, and how to add a skin — see [CONTRIBUTING.md](./CONTRIBUTING.md)
- **Releasing**: dev/main branches + tag-triggered publish — see [RELEASING.md](./RELEASING.md)
- **Adding a skin**: add one entry to `src/skins/registry.js`, no core changes

Ideas and skin suggestions are welcome — open an Issue or PR.

---

## License

[MIT](./LICENSE)
