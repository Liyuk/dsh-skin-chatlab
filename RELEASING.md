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

## 发布到 npm

发布由 GitHub Actions 自动完成，**打 tag 即发布**：

```sh
git checkout main
git pull origin main

# 自动 bump 版本号 + 打 tag（patch / minor / major）
npm version patch    # 1.0.0 → 1.0.1
npm version minor    # 1.0.0 → 1.1.0
npm version major    # 1.0.0 → 2.0.0

# 推分支 + tag（tag 触发 workflow 自动 npm publish）
git push origin main --follow-tags
```

`npm version` 会：
1. 改 `package.json` 的 `version`
2. 打一个 `vX.Y.Z` 的 tag
3. 提交这个改动

推 tag 后，`.github/workflows/publish.yml` 会自动运行并 `npm publish`，无需手动发包。

## 一次性配置（仓库 owner）

1. 在 [npm](https://www.npmjs.com/settings/tokens) 生成一个 **Automation** 类型的 access token（仅发布权限，免 2FA）。
2. GitHub 仓库 → **Settings → Secrets and variables → Actions → New repository secret**：
   - Name: `NPM_TOKEN`
   - Value: 刚才的 npm token
3. 之后发布全自动。

> ⚠️ scope 注意：包名是 `@liyuk/dsh-skin-chatlab`，发布账号必须拥有 `@liyuk` 这个 scope，否则会 403。
