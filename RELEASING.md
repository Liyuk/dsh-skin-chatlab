# 发布流程

本项目用 **tag 触发** 的方式发布到 npm，分支分工如下：

```
dev  日常开发分支：随便推，不触发任何发布
        │  合入
main  稳定分支：打 vX.Y.Z tag 才会触发 npm 发布
```

## 分支策略

- **dev**：功能开发、样式调试、bug 修复都在这里。随时 push，不影响发布。
- **main**：只有稳定、待发布的代码才合入。

```sh
# 切到 dev 干活
git checkout dev
# ... 改代码、commit ...
git push origin dev

# 稳定后合入 main
git checkout main
git merge dev
git push origin main
```

## 发布到 npm（monorepo 多包）

发布由 GitHub Actions 自动完成，**打 tag 即发布全部包**（core → skin-feishu → chatlab）：

```sh
git checkout main
git pull origin main

# 手动 bump 各包版本号（monorepo 无单一 package.json 版本）
# 需要更新哪个包就改哪个包的 packages/<name>/package.json 的 version，
# 并打 tag 如 v2.0.2 / v1.0.2
git add -A && git commit -m "chore: release vX.Y.Z"

# 推分支 + tag（tag 触发 workflow 自动跑 node scripts/publish.mjs）
git push origin main --follow-tags
```

推 tag 后，`.github/workflows/publish.yml` 会：
1. `npm install`
2. `npm run build`（esbuild 多包打包）
3. `node scripts/publish.mjs`（按依赖顺序发布 core → skin-feishu → chatlab）

也可手动本地发布：

```sh
node scripts/publish.mjs          # 正式发布
node scripts/publish.mjs --dry-run  # 只检查不发布
```

## 版本号约定

三个包独立版本号，但**建议保持同步**（改一个就一起 bump）：

| 包 | 当前 |
|---|---|
| `@liyuk/dsh-skin-chatlab-core` | 1.0.2 |
| `@liyuk/dsh-skin-feishu` | 1.0.2 |
| `@liyuk/dsh-skin-chatlab` | 2.0.2 |

## 一次性配置（仓库 owner）

1. 在 [npm](https://www.npmjs.com/settings/tokens) 生成一个 **Automation** 类型的 access token（仅发布权限，免 2FA）。
2. GitHub 仓库 → **Settings → Secrets and variables → Actions → New repository secret**：
   - Name: `NPM_TOKEN`
   - Value: 刚才的 npm token
3. 之后发布全自动。

> ⚠️ scope 注意：包名是 `@liyuk/dsh-skin-chatlab`，发布账号必须拥有 `@liyuk` 这个 scope，否则会 403。
