# ChatLab 运行验收记录

日期：2026-08-21

## 自动化结果

- `npm test`：9 个测试文件、95 个测试全部通过。
- `npm run build`：core、飞书及五个新皮肤共 7 个 client IIFE bundle 全部成功生成。
- `npm pack --dry-run --json`：core 6 files；六个皮肤包各 5 files；aggregate 2 files。没有执行真实 npm publish。
- `git diff --check`：通过。
- 主要文字与 canvas 对比度：五个新皮肤 light/dark 均高于 11.9:1。

## 真实 DSH Web 验证

使用本机 `/usr/local/bin/dsh` 启动真实 web profile，并使用本机 Chrome + Playwright Core 驱动：

- 页面启动成功，HTTP 200，标题为 `DeepSeek Harness`。
- 当前已安装的发布版 profile 只包含 core 1.0.1 + Feishu 1.0.1；飞书皮肤实际加载为 `html[data-chatlab-skin="feishu"]`，ChatLab style element 只有一个，浏览器 console/page 均无错误。
- 打开设置 → ChatLab 皮肤成功；当前发布版显示「无皮肤 / 飞书」。
- 主题开关成功令页面 computed `color-scheme` 变为 dark，皮肤 style 保留，console 无错误。
- 将偏好设为 `none` 并重新加载后：root skin attribute 被移除、Feishu CSS 不再注入、ChatLab-owned DOM 节点数为 0、console 无错误；随后恢复本机偏好为 `feishu`。
- 会话列表、头像、预览和消息区域在当前飞书发布版中实际渲染；截图生成于 `/tmp/chatlab-initial.png`、`/tmp/chatlab-feishu-settings.png`（临时验收文件，未纳入仓库）。

## 五个新包的隔离 DSH 验证

为避免修改用户的 `~/.dsh/profiles/web`，使用 `DSH_HOME=/tmp/dsh-chatlab-isolated.*` 初始化了全新的临时 web profile，并从本地 `npm pack` tarball 安装 core 1.0.2、飞书 1.0.2 和五个新皮肤 1.0.0。真实 DSH + Chrome/Playwright 验证结果：

- 设置页同时显示「无皮肤 / 飞书 / Slack 风格 / 企业微信风格 / 钉钉风格 / Telegram 风格 / WhatsApp 风格」。
- 六个皮肤均可点击切换；每次刷新后 `html[data-chatlab-skin]` 都与目标 id 一致，唯一 ChatLab style element 包含该皮肤的精确 scoped rule。
- 对六套皮肤逐一在真实浏览器插入语义一致的 session-row fixture 并读取 computed style：所有 `.cl-unread-dot` / `.cl-running-dot` 均为 `position:absolute`、可见块级圆点，头像进入 grid 第 1 列，预览进入 `2 / span 3`；无 console/page error。
- 初次无偏好时曾因 DSH bundle 规范化顺序默认选择 `dingtalk`；据此修复 core，让可用的 `feishu` 成为显式默认，而不再依赖注册顺序。重打包并更新隔离 profile 后默认正确恢复为 `feishu`。
- 在 WhatsApp 皮肤下切换深色模式后，computed `color-scheme` 为 `dark`、`body[data-ds-dark-theme]` 存在且 style 保留。
- `none` 选项通过真实设置 UI 点击后即时写入 `localStorage` 并显示「已切换到「无皮肤」，正在刷新…」；刷新后 root skin attribute 为 null、style 中无 skin rule、ChatLab-owned DOM 节点为 0。
- 全流程 browser console/page error 均为空。
- 六套页面截图生成于 `/tmp/chatlab-isolated-{feishu,slack,wecom,dingtalk,telegram,whatsapp}.png`，设置页截图为 `/tmp/chatlab-isolated-settings.png`（临时验收文件，未纳入仓库）。

该隔离 profile 没有真实持久会话数据，因此侧栏 row reuse、preview RPC、running/pending/unread 的真实数据转换仍以仓库的 DOM/lifecycle/RPC 测试为主；本次真实浏览器已覆盖 Cordis composition、ModuleLoader 注册、设置可见性、六皮肤切换、明暗主题和 `none` 清理。

## 未纳入本功能的已有工作树状态

会话开始时 `pnpm-workspace.yaml` 已含未提交的 `allowBuilds.esbuild: set this to true or false`，且 `pnpm-lock.yaml` 已是未跟踪、版本过期的文件。实现未覆盖、删除或修复这些用户已有改动；它们会阻止可靠的 pnpm frozen-lockfile 安装，应在独立的包管理器清理任务中处理。
