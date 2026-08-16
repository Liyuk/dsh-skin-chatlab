# dsh-skin-chatlab

简体中文 · [English](./README.en.md)

> **Note**: This project's primary documentation is the [Chinese README](./README.md). This English copy mirrors it — when editing, keep both in sync.

An extensible chat-skin **monorepo** for the [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness) Web GUI. A **core base + skin packages** architecture: the base provides the registry and switcher, each skin is an independent npm package that plugs in without touching anything else.

## Packages

| Package | Version | Role |
|---|---|---|
| [`@liyuk/dsh-skin-chatlab-core`](./packages/core/README.md) | 1.0.0 | **Base**: skin registry service, switcher, decoration logic, preview/unread RPC |
| [`@liyuk/dsh-skin-feishu`](./packages/skin-feishu/README.md) | 1.0.0 | **Feishu skin**: workspaces→project groups, sessions→contacts, bubbled chat |
| [`@liyuk/dsh-skin-chatlab`](./packages/chatlab/README.md) | 2.0.0 | **Aggregate**: depends on core + feishu |

Each skin owns only **appearance** (layout / palette / bubbles) and **never touches DSH chat logic** or any existing plugin.

## Install

### Option 1: Aggregate package (base + Feishu in one)

```sh
dsh plugin --profile web add @liyuk/dsh-skin-chatlab
```

Then add to `dsh.profile.bundles` in your profile `package.json`:

```jsonc
"@liyuk/dsh-skin-chatlab-core",
"@liyuk/dsh-skin-feishu"
```

### Option 2: Feishu only

```sh
dsh plugin --profile web add @liyuk/dsh-skin-chatlab-core @liyuk/dsh-skin-feishu
```

### Option 3: Base only (no skin, default look)

```sh
dsh plugin --profile web add @liyuk/dsh-skin-chatlab-core
```

> **Key**: whichever way you install, add the packages you want to the profile's `bundles` list — DSH only loads bundles listed there.

Restart DSH Web, open Settings → "ChatLab 皮肤" → pick "飞书".

---

## Features

- **Base + skin packages**: skins are independent npm packages registered via `ctx.chatlab.registerSkin`; adding a skin = creating a new package, no base changes
- **Settings switcher**: pill buttons; switching auto-refreshes, dark mode hot-switches
- **Feishu skin**:
  - Workspaces → "项目组" (colored rounded-square + initial)
  - Sessions → "联系人" (round avatar + last-message preview + unread dot, auto-clears)
  - Bubbled chat: blue bubbles + read check for you, gray for the assistant
  - Top brand: DeepSeek brand kept + skin-name badge
- **Last-message preview + unread**: loopback RPC reads session logs (live + cold), data layer decoupled from skins
- **Purely additive**: "无皮肤" fully unloads and restores DSH defaults

---

## Usage

Open Settings → "**ChatLab 皮肤**" in the left nav.

### Switching skins

- Row of **pill buttons**: 无皮肤 / 飞书 / …
- Clicking shows a refresh notice and auto-reloads
- Unimplemented skins are grayed out ("待做"), unclickable
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

1. Copy `packages/skin-feishu` → `packages/skin-slack`
2. Change `package.json` name to `@liyuk/dsh-skin-slack`
3. In `src/index.js`, `ctx.chatlab.registerSkin({ id, name, desc, ready, tokens, css })`
4. Replace `css`/`tokens` with the target skin's style
5. `npm run build`, then `node scripts/publish.mjs` to publish

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
  core/          base: registry service + switcher + decoration + preview/unread RPC
  skin-feishu/   Feishu skin package (independent plugin, registers via chatlab service)
  chatlab/       aggregate package (depends on core + feishu)
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
