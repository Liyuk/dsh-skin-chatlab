# 贡献指南 / Contributing

感谢你有兴趣共建 `dsh-skin-chatlab`。这份指南讲清分支分工、如何开发、如何提 PR，以及中文/英文文档的同步约定。

## 分支策略

```
dev  日常开发分支：功能开发、样式调试、bug 修复都在这里，随便推
        │  合入
main  稳定分支：打 vX.Y.Z tag 才会触发 npm 发布
```

- **开发**：从 `dev` 拉分支，改完推 `dev`，或直接推 `dev`。
- **发布**：`dev` 稳定后合入 `main`，打 tag 自动发 npm（见 [RELEASING.md](./RELEASING.md)）。

## 代码结构（monorepo）

```
packages/
  core/                基座 @liyuk/dsh-skin-chatlab-core
    src/
      index.js         core 入口(factory + apply + ctx.provide("chatlab"))
      registry.js      皮肤注册服务(registerSkin + 订阅)
      prefs.js         偏好读写
      utils.js         norm/hashHue
      avatar.js        makeAvatar
      session.js       会话数据
      dom.js           DOM helpers
      decorators.js    装饰逻辑
      settings.js      设置面板(react 作参数)
      theme.js         CSS 构建
    lib/
      client.js        esbuild 打包产物（勿手改，改 src/ 后 npm run build）
      index.js         host 端（预览/未读 RPC）
  skin-feishu/          飞书皮肤包 @liyuk/dsh-skin-feishu
    src/
      feishu.js         飞书 token + CSS（纯数据）
      index.js          皮肤插件入口（注入 chatlab 服务注册自己）
    lib/
      client.js         打包产物
      index.js          host 端（no-op）
  skin-slack/           Slack 风格皮肤包 @liyuk/dsh-skin-slack
  skin-wecom/           企业微信风格皮肤包 @liyuk/dsh-skin-wecom
  skin-dingtalk/        钉钉风格皮肤包 @liyuk/dsh-skin-dingtalk
  skin-telegram/        Telegram 风格皮肤包 @liyuk/dsh-skin-telegram
  skin-whatsapp/        WhatsApp 风格皮肤包 @liyuk/dsh-skin-whatsapp
  skin-shared/          私有 build-time token mapper（仅 src/tokens.js，不发布）
  chatlab/              聚合包 @liyuk/dsh-skin-chatlab(仅依赖声明)
scripts/
  build.mjs            esbuild 多包打包
  publish.mjs          按依赖顺序发布
```

## 开发流程

### 一次性准备（装 dsh-hot-reload）

热重载依赖 dsh 里的两个机制：

- **client 端（皮肤 CSS/DOM）**：dsh 内置的 `dsh-client-hmr` 会 stat-poll 各包的
  `lib/client.js`，重打包后自动热重载浏览器，无需重启 dsh、无需刷页面。
- **host 端（`lib/index.js` 的预览/未读 RPC）**：dsh 内置 HMR 会刻意忽略 node_modules，
  所以用社区插件 `dsh-hot-reload` 补上——它监听 profile 的 `pnpm-lock.yaml`，插件版本
  一变就把运行中的 host fiber 就地换掉（失败自动回滚旧版）。

装一次，之后开发就不用再动了：

```sh
dsh plugin --profile web add dsh-hot-reload@0.2.1
# 重启一次 dsh web 让 bundle patch 生效（仅此一次）
```

### 日常开发

```sh
npm install
# 改皮肤：编辑 packages/*/src/ → 保存即热重载
npm run dev          # watch 模式：自动重打包 lib/client.js，client-hmr 热重载皮肤
# 改了 host 侧（lib/index.js 的 RPC）→ 手动触发一次 host 热重载
npm run reload:host  # bump 版本 + touch lockfile，dsh-hot-reload 就地换 host fiber
npm test             # 跑单测
```

**重要**：`lib/client.js` 是构建产物，**不要手改**。改 `packages/*/src/` 后用
`npm run dev`（watch）或 `npm run build`（一次性）重新打包。

**边界**：`dsh-hot-reload` 只使入口模块（`lib/index.js`）失效，不会递归失效它 import
的兄弟模块——所以改 `lib/projection.js`（被 index.js import）得重启一次 dsh。这种情况
很少，先记着即可。

## 加一套新皮肤

**新建一个皮肤包**（推荐）——按 `packages/skin-feishu` 的包结构新建 `packages/skin-<id>`，为每个皮肤保留独立的 `src/<id>.js`、`src/index.js`、host no-op、Cordis patch、README 和 manifest；不要依赖 core 源码，也不要把私有 `skin-shared` 声明成运行时依赖。

每个 client entry 必须通过 `inject: ["chatlab"]` 注册一个唯一的 `{ id, name, desc, ready, tokens: { light, dark }, css, brand }` 定义；CSS 必须限定到自己的 `html[data-chatlab-skin="<id>"]`，并只使用稳定语义选择器。

关键：皮肤通过 `inject: ["chatlab"]` 拿到 core 的服务，**不 import core 的模块**（两个独立 bundle，运行时靠 cordis 服务通信）。

## 几条硬约束（改样式前必读）

DSH 是 React 应用，装饰逻辑必须遵守：

1. **绝不用 MutationObserver 观察整个 body**（会拖垮 React reconcile）
2. **绝不用 `innerHTML=""` 删 React 节点、绝不 insertBefore 到 React 节点前**（会触发 `removeChild` 崩溃）
3. 装饰只 `appendChild` 自己的节点，用 CSS Grid/flex 排位，不移动 React 的节点
4. 深色模式交给 DSH 的 `ctx.theme.setTheme()`，不自己维护 theme

## 文档约定

- 中文为主 `README.md`，英文副本 `README.en.md`。
- **改 README 时中英文同步更新**，保持结构一致。

## 提交规范

建议用 Conventional Commits：

- `feat: 新增皮肤 xxx`
- `fix: 修复未读红点错位`
- `refactor: 拆分 client.js`
- `docs: 补充使用指南`

## 迁入第三方代码

迁入第三方代码必须保留其 LICENSE 与署名；活跃且有上游的优先 fork 或依赖引用，不直接搬代码。

## 许可证

本项目以 [MIT](./LICENSE) 授权。你的贡献默认以 MIT 授权。
