# @liyuk/dsh-skin-chatlab-core

ChatLab 基座:DeepSeek Harness (DSH) 的可扩展聊天皮肤插件核心。

提供:
- 皮肤注册服务(`ctx.chatlab.registerSkin`),皮肤包通过它注册
- 皮肤切换器 + 设置面板
- 侧边栏装饰(头像/预览/未读/项目方块)
- 预览/未读 RPC(host 端)

**需要装皮肤包才有效果**,例如 `@liyuk/dsh-skin-feishu`。

## 安装

```sh
dsh plugin --profile web add @liyuk/dsh-skin-chatlab-core @liyuk/dsh-skin-feishu
```

或直接装聚合包 `@liyuk/dsh-skin-chatlab`(自动带上 core + feishu)。

## 开发皮肤

皮肤包通过 `ctx.chatlab.registerSkin({ id, name, desc, ready, tokens, css })` 注册自己,见 `@liyuk/dsh-skin-feishu` 源码示例。

## License

[MIT](./LICENSE)
