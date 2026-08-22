# dsh-skin-chatlab

简体中文 · [English](./README.en.md)

> **Note**: This project's primary documentation is the [Chinese README](./README.md). This English copy mirrors it — when editing, keep both in sync.

An extensible chat-skin **monorepo** for the [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness) Web GUI. A **core base + skin packages** architecture: the base provides the registry and switcher, each skin is an independent npm package that plugs in without touching anything else.

## Packages

| Package | Version | Role |
|---|---|---|
| [`@liyuk/dsh-skin-chatlab-core`](./packages/core/README.md) | 1.0.3 | **Base**: skin registry service, switcher, decoration logic, preview/unread RPC |
| [`@liyuk/dsh-skin-feishu`](./packages/skin-feishu/README.md) | 1.0.2 | **Feishu skin**: workspaces→project groups, sessions→contacts, bubbled chat |
| [`@liyuk/dsh-skin-slack`](./packages/skin-slack/README.md) | 1.0.0 | **Slack-style**: dense workspace, flat messages |
| [`@liyuk/dsh-skin-wecom`](./packages/skin-wecom/README.md) | 1.0.0 | **WeCom-style**: enterprise directory density, green bubbles |
| [`@liyuk/dsh-skin-dingtalk`](./packages/skin-dingtalk/README.md) | 1.0.0 | **DingTalk-style**: blue enterprise hierarchy, selected cards |
| [`@liyuk/dsh-skin-telegram`](./packages/skin-telegram/README.md) | 1.0.0 | **Telegram-style**: airy blue, rounded bubbles |
| [`@liyuk/dsh-skin-whatsapp`](./packages/skin-whatsapp/README.md) | 1.0.0 | **WhatsApp-style**: green messenger, circular avatars |
| [`@liyuk/dsh-skin-chatlab`](./packages/chatlab/README.md) | 2.1.0 | **Aggregate**: core + six skins |

Each skin owns only **appearance** (layout / palette / bubbles) and **never touches DSH chat logic** or any existing plugin.

## Install

### Option 1: Aggregate package (base + six skins)

```sh
dsh plugin --profile web add @liyuk/dsh-skin-chatlab
```

The aggregate package ships a profile patch that adds core and all six skins to `dsh.profile.bundles` automatically; you do not need to add them one by one.

### Option 2: Install one skin independently

```sh
dsh plugin --profile web add @liyuk/dsh-skin-chatlab-core @liyuk/dsh-skin-slack
```

Add core and the chosen skin to `dsh.profile.bundles`; replace `slack` with `wecom`, `dingtalk`, `telegram`, or `whatsapp` as needed.

### Option 3: Feishu only

```sh
dsh plugin --profile web add @liyuk/dsh-skin-chatlab-core @liyuk/dsh-skin-feishu
```

### Option 4: Base only (no skin, default look)

```sh
dsh plugin --profile web add @liyuk/dsh-skin-chatlab-core
```

> **Key**: the aggregate package injects the complete bundle list; with individual packages, add core and the selected skins to the profile's `bundles` manually.

Restart DSH Web, open Settings → "ChatLab 皮肤" → choose any installed skin.

---

## Features

- **Base + skin packages**: skins are independent npm packages registered via `ctx.chatlab.registerSkin`; adding a skin = creating a new package, no base changes
- **Settings switcher**: pill buttons; switching auto-refreshes, dark mode hot-switches
- **Six independently installable skins**: Feishu, Slack-style, WeCom-style, DingTalk-style, Telegram-style, and WhatsApp-style
- **Original marks**: the five new styles use original abstract inline marks rather than official brand assets
- **Last-message preview + unread**: loopback RPC reads session logs (live + cold), data layer decoupled from skins
- **Purely additive**: "无皮肤" fully unloads and restores DSH defaults

---

## Usage

Open Settings → "**ChatLab 皮肤**" in the left nav.

### Switching skins

- Row of **pill buttons**: 无皮肤 / 飞书 / …
- Clicking shows a refresh notice and auto-reloads
- Every installed skin with `ready: true` appears as a selectable option
- "无皮肤" fully restores defaults

### Dark mode

- "深色模式" toggle hot-switches (no reload)
- Delegates to DSH's theme system, light/dark follow automatically

### Feishu skin effects

| Area | Effect |
|---|---|
| Left workspaces | "项目组": colored rounded-square + initial |
| Left session list | "联系人": round avatar + last-message preview |
| Unread | Red dot on avatar top-right, cleared on open |
| Chat window | Blue bubbles + read check; AI replies gray |
| Top brand | DeepSeek brand + skin-name badge |

---

## Developing a skin

**Create a new skin package** (recommended):

1. Copy the `packages/skin-feishu` package shape (do not copy generated `lib/client.js`)
2. Add `src/<id>.js` with light/dark tokens, an original inline SVG mark, and CSS scoped to `html[data-chatlab-skin="<id>"]`
3. In `src/index.js`, inject `chatlab` and call `ctx.chatlab.registerSkin({ id, name, desc, ready, tokens, css, brand })`
4. Add a unique target in `scripts/bundles.mjs`, a Cordis patch, host no-op, README, and publish-order entry
5. Write contract tests first, then run `npm run build` and `npm pack --dry-run`

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
packages/
  core/          base: registry + switcher + decoration + preview/unread RPC
  skin-feishu/   Feishu skin package
  skin-slack/    Slack-style skin package
  skin-wecom/    WeCom-style skin package
  skin-dingtalk/ DingTalk-style skin package
  skin-telegram/ Telegram-style skin package
  skin-whatsapp/ WhatsApp-style skin package
  skin-shared/   private build-time token mapper (not published/runtime)
  chatlab/       aggregate package (core + six skins)
```

**Cross-plugin registration**:

```js
// core: expose service
ctx.provide("chatlab", skinRegistry);

// skin-feishu: inject service and register
inject: ["chatlab"],
apply(ctx) { ctx.chatlab.registerSkin({ id:"feishu", name:"飞书", css: FEISHU_CSS }); }
```

**Key implementation constraints** (DSH is a React app):

- **Never observe the whole `body` with MutationObserver** (cripples React reconcile)
- **Never `innerHTML=""` a React node, never `insertBefore` before a React node** (triggers `removeChild` crashes)
- Decoration only `appendChild`s its own nodes, positions them with CSS Grid/flex, never moves React nodes
- Dark mode delegates to DSH's `ctx.theme.setTheme()`
- **Skin packages register after core**: core subscribes to registration events and rebuilds CSS on skin register (otherwise skin styles are lost)

---

## Contributing

Welcome — let's turn more chat apps into skins!

- **Getting started**: [CONTRIBUTING.md](./CONTRIBUTING.md)
- **Releasing**: [RELEASING.md](./RELEASING.md)
- **Adding a skin**: copy `packages/skin-feishu` to start a new package

Ideas and skin suggestions are welcome — open an Issue or PR.

---

## License

[MIT](./LICENSE)
