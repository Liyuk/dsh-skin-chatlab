---
title: "dsh-skin-chatlab 2.x: A Switchable Chat Workbench for DSH Web"
description: Six independently published skins, aggregate bundle loading, avatar identity convergence, partial-install fallback, and a clean uninstall boundary for DSH Web.
locale: en
translationStatus: reviewed
createdAt: 2026-08-21
publishedAt: 2026-08-21
status: active
repositoryUrl: https://github.com/Liyuk/dsh-skin-chatlab
hero:
  src: /images/projects/dsh-skin-chatlab/overview-light.webp
  alt: DSH Web running the Feishu skin as a chat workbench
  caption: Project groups, contact-like sessions, and a branded composer under the Feishu skin.
draft: false
tags: [technology, agent-systems, developer-productivity]
translationKey: 2026/08/dsh-skin-chatlab-upgrade
---

[View the project and installation guide on GitHub ↗](https://github.com/Liyuk/dsh-skin-chatlab)

This release moves dsh-skin-chatlab beyond a single Feishu adaptation. DSH Web can now switch between six independently published visual skins: Feishu, Slack, WeCom, DingTalk, Telegram, and WhatsApp.

## What the upgrade delivers

- A base-plus-skin boundary: core owns registration, switching, DOM decoration, previews, unread state, and lifecycle cleanup; skins own tokens, CSS, and brand marks.
- Six independent npm skin packages, installable together or selectively.
- An aggregate bundle patch: `@liyuk/dsh-skin-chatlab` now adds core and all six skins to `dsh.profile.bundles`.
- Project-group and contact-like navigation, with skin-specific project icons, avatars, latest-reply previews, unread indicators, and running state.
- Branded composers: borders, toolbars, send controls, focus, hover, and active motion vary by skin without overriding host geometry or padding.
- A real uninstall path: selecting “No skin” removes owned styles, nodes, state classes, and HTML markers.
- Partial-load safety: a preference pointing at an unavailable skin falls back to an installed ready skin, while late skin registration activates automatically.

![The running Feishu skin with project groups, contacts, unread state, and composer](/images/projects/dsh-skin-chatlab/runtime-feishu.png)

## Six skins, not six copies

The packages share DSH’s data boundary, but express different product grammars:

| Skin | Visual direction | Composer motion |
| --- | --- | --- |
| Feishu | restrained blue, compact editor, light focus ring | send control lifts slightly |
| Slack | squared controls, purple workspace feel | hover brightens without displacement |
| WeCom | green enterprise density | soft green hover shadow |
| DingTalk | blue, card-like hierarchy | subtle press scale |
| Telegram | large radii and circular controls | send control slides right |
| WhatsApp | warm gray surfaces and green attention | lift plus green shadow |

![The settings surface with all six skins loaded](/images/projects/dsh-skin-chatlab/settings-all-skins.png)

These are visual projections. They do not claim to implement native channels, threads, reactions, presence, delivery receipts, or calls. The underlying data remains DSH’s existing session, turn, and loopback RPC model.

## Why clicking an avatar used to change it

That was an identity-convergence issue, not uncontrolled randomness.

A blank session row can initially lack a reliable session id, so the skin generates a temporary avatar from its title. After the user clicks it, React marks the row selected and core can associate it with the current session id. Regenerating the URL from that id made the avatar jump.

When a blank row is first bound to a real session id, core now carries the existing image URL into the persistent `sessionId → avatar URL` map. The sidebar and chat header then read the same mapping, so clicking does not change the face. If React reuses a row for another session, old identity state is cleared first.

## React boundaries and performance

DSH Web is a React application. The skins do not install a global MutationObserver or move React-owned nodes. Core only appends owned nodes; CSS Grid and skin CSS handle placement.

The runtime constraints are:

1. Only the selected skin’s CSS is injected; all six bundles are not mounted as active styles at once.
2. Registry and session-list refreshes are coalesced through a 300ms timer. Preview RPC uses single-flight and an 8-second timeout.
3. Avatar persistence is flushed once per refresh batch and capped at 200 entries.

The test suite now covers 101 assertions, including core-only mode, partial skin loading, unavailable-skin fallback, late registration, React row reuse, and avatar identity convergence. All six client bundles and the aggregate bundle patch pass build checks.

## Install

The recommended install is the aggregate package:

```sh
dsh plugin --profile web add @liyuk/dsh-skin-chatlab
```

It installs and loads core plus all six skins. For local development, use `link:` dependencies, run `npm run build`, and restart `dsh web` after source changes.

To load only a subset:

```sh
dsh plugin --profile web add \
  @liyuk/dsh-skin-chatlab-core \
  @liyuk/dsh-skin-feishu \
  @liyuk/dsh-skin-slack
```

## Release order

The dependency order is:

```text
core → feishu → slack → wecom → dingtalk → telegram → whatsapp → chatlab
```

Build and run a dry-run before publishing. The repository’s `scripts/publish.mjs` already publishes in that order.

The core capability is not pretending that DSH is one particular messenger. It is separating data from visual expression so the same sessions, previews, unread state, and running state can be safely reinterpreted by multiple skins without modifying the React host or existing plugins.
