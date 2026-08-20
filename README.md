# dsh-skin-chatlab

[English](./README.en.md) · 简体中文

为 [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness) Web GUI 打造的可扩展聊天皮肤 **monorepo**。核心是「基座 + 皮肤包」的架构：基座提供注册表与切换器，每套皮肤是独立 npm 包，即插即用、互不干扰。

## 包结构

| 包 | 版本 | 作用 |
|---|---|---|
| [`@liyuk/dsh-skin-chatlab-core`](./packages/core/README.md) | 1.0.2 | **基座**：皮肤注册服务、切换器、装饰逻辑、预览/未读 RPC |
| [`@liyuk/dsh-skin-feishu`](./packages/skin-feishu/README.md) | 1.0.2 | **飞书皮肤**：工作区=项目组、会话=联系人、聊天气泡化 |
| [`@liyuk/dsh-skin-chatlab`](./packages/chatlab/README.md) | 2.0.2 | **聚合包**：一键依赖 core + feishu |

每套皮肤只负责**外观**（布局 / 配色 / 气泡样式），**绝不侵入 DSH 的聊天逻辑**，也不改动任何现有插件。

## 安装

### 方式一：装聚合包（一键带基座 + 飞书）

```sh
dsh plugin --profile web add @liyuk/dsh-skin-chatlab
```

然后在 profile `package.json` 的 `dsh.profile.bundles` 加入：

```jsonc
"@liyuk/dsh-skin-chatlab-core",
"@liyuk/dsh-skin-feishu"
```

### 方式二：只装飞书

```sh
dsh plugin --profile web add @liyuk/dsh-skin-chatlab-core @liyuk/dsh-skin-feishu
```

### 方式三：只装基座（无皮肤，默认外观）

```sh
dsh plugin --profile web add @liyuk/dsh-skin-chatlab-core
```

> **关键**：无论哪种方式，都要把「要用到的包」加进 profile 的 `bundles` 列表，DSH 才会加载它们。

装完重启 DSH Web，打开设置 → 「ChatLab 皮肤」→ 选「飞书」。

---

## 特性

- **基座 + 皮肤包架构**：皮肤是独立 npm 包，通过 `ctx.chatlab.registerSkin` 注册到基座，加新皮肤 = 新建一个包，不改基座
- **设置面板切换器**：胶囊按钮一键切换；切皮肤自动刷新，深色模式热切换
- **飞书皮肤**：
  - 工作区 = 项目组（彩色方块 + 首字母）
  - 会话 = 联系人（圆形头像 + 最近回复预览 + 未读红点，读后消除）
  - 聊天气泡化：自己蓝色气泡 + 已读标记，对方灰色正文
  - 顶部保留 DeepSeek 品牌 + 皮肤名徽章
- **最近回复预览 + 未读**：loopback RPC 读会话日志（live + 冷会话），数据层与皮肤解耦
- **纯增量**：切「无皮肤」彻底卸载，恢复 DSH 默认外观

---

## 使用指南

打开设置 → 左侧「**ChatLab 皮肤**」。

### 切换皮肤

- 一排**胶囊按钮**：无皮肤 / 飞书 / …
- 点皮肤 → 提示刷新 → 页面自动刷新生效
- 未实现的皮肤显示灰色「待做」，不可点
- 选「无皮肤」彻底卸载，恢复默认

### 深色模式

- 「深色模式」开关**热切换**（不刷新）
- 底层调 DSH 主题系统，明暗自动跟随

### 飞书皮肤效果

| 区域 | 效果 |
|---|---|
| 左侧工作区 | 「项目组」：彩色圆角方块 + 首字母 |
| 左侧会话列表 | 「联系人」：圆形头像 + 最近消息预览 |
| 未读消息 | 头像右上角红点，点开消除 |
| 聊天窗口 | 蓝色气泡 + 已读标记；AI 回复灰色正文 |
| 顶部品牌 | DeepSeek 品牌 + 皮肤名徽章 |

---

## 皮肤开发：加一套新皮肤

**新建一个皮肤包**（推荐）：

1. 复制 `packages/skin-feishu` 为 `packages/skin-slack`
2. 改 `package.json` 的 name 为 `@liyuk/dsh-skin-slack`
3. 在 `src/index.js` 里 `ctx.chatlab.registerSkin({ id, name, desc, ready, tokens, css })`
4. 把 `css`/`tokens` 换成目标皮肤的风格
5. `npm run build` 打包，`node scripts/publish.mjs` 发布

### 皮肤契约

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | localStorage 唯一 key，也写进 `data-chatlab-skin` |
| `name` | string | 设置面板显示名 |
| `desc` | string | 一句话说明 |
| `ready` | boolean | `false` = 占位（置灰）；`true` = 可切换 |
| `tokens` | `{light, dark}` | 覆盖 `--dsw-alias-*` 设计 token |
| `css` | string | 皮肤专属规则 |

---

## 架构

```
packages/
  core/          基座：注册服务 + 切换器 + 装饰 + 预览/未读 RPC
  skin-feishu/   飞书皮肤包（独立插件，注入 chatlab 服务注册自己）
  chatlab/       聚合包（依赖 core + feishu）
```

**跨插件注册机制**：

```js
// core：暴露服务
ctx.provide("chatlab", skinRegistry);

// skin-feishu：注入服务并注册
inject: ["chatlab"],
apply(ctx) { ctx.chatlab.registerSkin({ id:"feishu", name:"飞书", css: FEISHU_CSS }); }
```

**关键实现约束**（DSH 是 React 应用）：

- **绝不用 MutationObserver 观察整个 body**（会拖垮 React reconcile）
- **绝不用 `innerHTML=""` 删 React 节点、绝不 insertBefore 到 React 节点前**（会触发 `removeChild` 崩溃）
- 装饰只 `appendChild` 自己的节点，用 CSS Grid/flex 排位，不移动 React 的节点
- 深色模式交给 DSH 的 `ctx.theme.setTheme()`
- **皮肤包在 core 之后注册**：core 订阅注册事件，皮肤注册后重建 CSS（否则皮肤样式丢失）

---

## 贡献 / 一起共建

欢迎把更多聊天软件做成皮肤！

- **开发入门**：[CONTRIBUTING.md](./CONTRIBUTING.md)
- **发布流程**：[RELEASING.md](./RELEASING.md)
- **加皮肤**：复制 `packages/skin-feishu` 起一个新包

有任何想法或皮肤创意，欢迎提 Issue / PR。

---

## License

[MIT](./LICENSE)
