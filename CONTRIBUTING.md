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
      feishu.js        飞书 token + CSS（纯数据）
      index.js         皮肤插件入口(注入 chatlab 服务注册自己)
    lib/
      client.js        打包产物
      index.js         host 端(no-op)
  chatlab/              聚合包 @liyuk/dsh-skin-chatlab(仅依赖声明)
scripts/
  build.mjs            esbuild 多包打包
  publish.mjs          按依赖顺序发布
```

## 开发流程

```sh
npm install
# 改 packages/ 下各包的 src/
npm run build        # 重新打包各包 lib/client.js
npm test             # 跑单测
```

**重要**：`lib/client.js` 是构建产物，**不要手改**。改 `packages/*/src/` 后必须 `npm run build`。

## 加一套新皮肤

**新建一个皮肤包**（推荐）——复制 `packages/skin-feishu` 为 `packages/skin-xxx`，改 `package.json` name 和 `src/` 里的皮肤数据，再 `ctx.chatlab.registerSkin({ id, name, desc, ready, tokens, css })` 注册。

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
