# ChatLab 多皮肤实现设计

## 目标与边界

新增五个可独立安装和发布的 npm 皮肤包：Slack 风格、企业微信风格、钉钉风格、Telegram 风格、WhatsApp 风格；聚合包一次依赖 core、飞书和五个新包。

本期只实现 DSH 已有界面和状态的视觉投影：工作区/会话列表、头像、预览、未读、运行中、消息、输入区、顶栏和明暗主题。研究报告中出现的频道、线程、反应、在线状态、真实送达/已读、审批、会议和通话不由当前 host 数据模型提供，因此不伪造。

## 深模块与 seam

外部 seam 保持不变：

```js
inject: ["chatlab"]
ctx.chatlab.registerSkin({
  id,
  name,
  desc,
  ready: true,
  tokens: { light, dark },
  css,
  brand: { svg }
})
```

这是皮肤调用方唯一需要理解的 interface。`packages/core` 继续集中承担：

- 注册、替换和延迟加载通知；
- 设置页和当前选择；
- DSH alias token 注入；
- React-safe append-only DOM 装饰；
- 头像一致性与持久化；
- 最近消息 RPC、未读序列和竞态保护；
- running / pendingInteraction / current read 状态；
- typing 包装和统一清理。

每个皮肤包只承担 tokens、CSS、显示名称和原创 abstract SVG。皮肤不得 import core、不得访问 sessions/connection、不得引入 React、不得用 MutationObserver，也不得移动或删除 React 管理的节点。

## 内部 build-time token module

`packages/skin-shared/src/tokens.js` 提供一个纯函数 `makeTokens({ light, dark })`，将小型语义 palette 映射到 core 需要的完整 `--dsw-alias-*` key 集（包含历史 alias `brand-primary-new-colorprimary-new-color`）。

该 module 是 private workspace source，只在构建期由各皮肤 source 相对 import；esbuild 将实现内联到每个 `lib/client.js`。发布包没有第七个运行时依赖。CSS 和品牌图形仍属于各皮肤本地，避免建立浅层 CSS factory。

飞书保持现有显式 token，回归测试锁定关键值，避免为了统一而改变已发布视觉。

## 包布局

```text
packages/
  skin-slack/
  skin-wecom/
  skin-dingtalk/
  skin-telegram/
  skin-whatsapp/
    package.json
    README.md
    cordis.patch.yml
    src/index.js
    src/<id>.js
    lib/index.js       # Cordis 要求的 host no-op
    lib/client.js      # esbuild 生成
```

每个 manifest 与 `skin-feishu` 保持一致：host main、client/patch/package exports、发布 files、Node 20、Cordis/core peer dependencies、DSH client runtime injection。Cordis patch ID 和注册 ID 全部唯一。

## 状态模型映射

| Core 状态/节点 | 皮肤可变部分 | 不可改变的语义 |
|---|---|---|
| `tokens.light/dark` | 配色、surface、文字、边框、状态色 | 明暗切换仍由 DSH theme service 驱动 |
| `.cl-avatar` | 尺寸、圆角、位置 | 同 session id 的侧栏/顶栏头像一致 |
| `.cl-preview` | 字号、颜色、grid 位置 | 文本来自 preview RPC，竞态保护不变 |
| `.cl-unread-dot` | 颜色、尺寸、位置 | current 自动推进已读；running 时压制 |
| `.cl-running-dot` | 颜色、尺寸、动画 | 只表达 core 实时 running/active |
| `.cl-turn-typing` | 字体、颜色、动效 | 不伪造远端用户输入状态 |
| user/assistant selectors | 气泡、间距、圆角、阴影 | 消息角色和 DSH 发送逻辑不变 |
| composer/header selectors | 外观 | 不增加产品专属发送/通话行为 |

## 五套视觉 projection

- **Slack 风格**：密集四列会话 grid、柔和方形头像、深紫 workspace 层级、平面消息块。
- **企业微信风格**：紧凑企业联系人列表、圆形头像、绿色发送气泡、克制灰色 surface。
- **钉钉风格**：蓝色强调、方圆头像、左侧选中条和轻卡片层级。
- **Telegram 风格**：更松的列表行、圆形头像、浅蓝 surface、较大气泡圆角。
- **WhatsApp 风格**：绿色 attention、暖灰聊天底色、圆形头像、轻量双勾装饰（明确不代表真实回执）。

所有 rule 必须从精确的 `html[data-chatlab-skin="<id>"]` 开始，只使用已有稳定语义 selector；禁止依赖构建 hash。

## TDD 和验收 seam

测试通过用户可观察的 package/runtime seam：

1. `makeTokens` 输出完整 light/dark alias contract，且飞书关键 token 不变。
2. 六个视觉定义都有唯一 ID、完整 token、精确 CSS scope、inline SVG、无外部资源和 hash selector。
3. 六个 client entry 经 `window.__ModuleLoader__.load` 暴露准确 module name、`inject: ["chatlab"]`、一次注册及 core 缺失 no-op。
4. 每个 package 的 manifest、exports、published files、peer dependencies、Cordis patch 和 host no-op 完整；不声明 shared runtime dependency。
5. `scripts/bundles.mjs` 覆盖 core + 六皮肤，entry/output 唯一；生成 IIFE 无 runtime import。
6. 现有 lifecycle/decorator/preview/unread/avatar 测试继续通过。
7. 真实 DSH Web 验证设置页、六皮肤切换、明暗主题、none 清理、会话行复用、running/pending/unread 和 console/React 安全。

## 发布顺序

`core → feishu → slack → wecom → dingtalk → telegram → whatsapp → chatlab aggregate`。

Core 的 fallback 会优先选择已注册且 ready 的 `feishu`，只有飞书未安装时才回退到其他 ready 皮肤，因此不依赖 DSH 对 bundle 的实际排序。

只运行 `npm pack --dry-run` 检查 tarball；本次不执行真实 npm publish。现有用户未提交的 `pnpm-workspace.yaml` 和 `pnpm-lock.yaml` 不在本功能中覆盖或清理。
