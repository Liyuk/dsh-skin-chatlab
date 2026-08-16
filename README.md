# dsh-skin-chatlab

一个为 [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness) Web GUI 打造的可扩展聊天皮肤插件。核心是一套**皮肤注册机制 + 切换器**，把聊天界面一键换成飞书 / Slack / 微信 / iMessage / WhatsApp 等任意聊天软件的样式。

飞书皮肤是首发皮肤；其余为占位口子。每套皮肤只负责**外观**（布局 / 配色 / 气泡样式），**绝不侵入 DSH 的聊天逻辑**，也不改动任何现有插件。

---

## 特性

- **皮肤注册表**：`SKINS[]` 数组，每套皮肤只声明 `{ id, name, desc, tokens, css }`，加新皮肤不改任何通用逻辑
- **设置面板切换器**：设置页新增「ChatLab 皮肤」区块，胶囊按钮一键切换；切皮肤自动刷新，深色模式热切换
- **飞书皮肤**（首发，完整实现）：
  - 工作区 = 项目组（Meego 风彩色方块 + 首字母）
  - 会话 = 联系人（确定性头像 + 最近回复预览 + 未读红点，读后自动消除）
  - 聊天气泡化：自己蓝色气泡 + 已读标记，对方灰色气泡
  - 品牌 logo：飞书双鸟 + "DeepSeek HARNESS" + 「飞书皮肤」徽章
- **最近回复预览 + 未读**：通过 loopback RPC 读取会话日志（live + 冷会话都支持），数据层与皮肤解耦
- **纯增量**：切到「无皮肤」彻底卸载，恢复 DSH 默认外观

---

## 安装

```sh
dsh plugin --profile web add @liyuk/dsh-skin-chatlab
```

或在 profile 的 `package.json` 中手动挂载：

```jsonc
{
  "dependencies": {
    "@liyuk/dsh-skin-chatlab": "^1.0.0"
  },
  "dsh": {
    "profile": {
      "bundles": [
        // ... 其它 bundle
        "dsh-skin-chatlab"
      ]
    }
  }
}
```

然后重启 DSH Web：

```sh
dsh --profile web
```

打开设置 → 左侧找到「ChatLab 皮肤」，选择「飞书」即可。

---

## 使用指南

安装并重启后，打开 DSH Web 左下角「设置」，在左侧导航找到「**ChatLab 皮肤**」。

### 切换皮肤

- 设置面板里是一排**胶囊按钮**：无皮肤 / 飞书 / Slack / 微信 / … / WhatsApp
- 点击某个皮肤 → 弹提示「正在刷新」→ 页面自动刷新 → 生效
- 未实现的占位皮肤显示为灰色「待做」，不可点击
- 选「无皮肤」彻底卸载皮肤，恢复 DSH 默认外观

### 深色模式

- 设置面板里的「深色模式」开关，**热切换**（不刷新页面）
- 底层调用 DSH 自己的主题系统，明暗两套配色自动跟随

### 飞书皮肤的效果（当前唯一完整皮肤）

| 区域 | 效果 |
|---|---|
| 左侧工作区 | 变成「项目组」：彩色圆角方块 + 项目名首字母 |
| 左侧会话列表 | 变成「联系人」：每个会话一个**圆形头像**，第二行显示**最近一条消息预览** |
| 未读消息 | 头像右上角红点；点开该会话后红点自动消失（读后即已读） |
| 聊天窗口 | 自己发的消息是**蓝色气泡 + 已读标记**，AI 回复是灰色正文 |
| 顶部品牌 | DeepSeek 鲸鱼换成「飞书双鸟 + DeepSeek HARNESS + 飞书皮肤」徽章 |

> 说明：皮肤只改外观，不动 DSH 的聊天数据、会话逻辑或任何现有插件；切到「无皮肤」即完整还原。

### 首次使用注意

- 首次加载皮肤时，所有历史会话会以**当前最后一条消息为「已读基线」**，不会满屏红点
- 之后只有真正的新消息才会亮红点，点开即消除

---

## 皮肤开发：加一套新皮肤

在 `lib/client.js` 的 `SKINS` 数组里加一项即可，无需改动通用逻辑：

```js
{
  id: "slack",
  name: "Slack",
  desc: "Slack 风格",
  ready: true,               // false = 占位(置灰不可点)，true = 可切换
  tokens: {                  // 覆盖 --dsw-alias-* 设计 token
    light: { "brand-primary": "#611F69" },
    dark:  { "brand-primary": "#9C4AA8" }
  },
  css: ""                    // 皮肤专属规则(气泡形状/圆角/头像尺寸等)
}
```

### 皮肤契约

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | localStorage 唯一 key，也写进 `data-chatlab-skin` |
| `name` | string | 设置面板显示名 |
| `desc` | string | 一句话说明 |
| `ready` | boolean | `false` = 占位(置灰)；`true` = 可切换 |
| `tokens` | `{light, dark}` | 覆盖 `--dsw-alias-*` 设计 token |
| `css` | string | 皮肤专属附加规则 |

---

## 架构

```
SKINS[]            每套皮肤只声明"外观"：token(明/暗) + CSS
common layer       与皮肤无关的骨架：
                   - 偏好读写(localStorage)
                   - data-chatlab-skin 反射到 <html>
                   - 最近回复预览 + 未读红点 + 头像注入(数据逻辑皮肤无关)
                   - 设置面板切换器
host half          注册 /dsh-skin-chatlab loopback RPC，读会话日志供预览/未读
```

关键实现约束（DSH 是 React 应用）：

- **绝不用 MutationObserver 观察整个 body**（会拖垮 React reconcile）
- **绝不用 `innerHTML=""` 删 React 节点、绝不 insertBefore 到 React 节点前**（会触发 `removeChild` 崩溃）
- 装饰只 `appendChild` 自己的节点，用 CSS Grid/flex 排位，不移动 React 的节点
- 深色模式交给 DSH 的 `ctx.theme.setTheme()`，不自己维护 theme

---

## License

[MIT](./LICENSE)
