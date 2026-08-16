# @liyuk/dsh-skin-chatlab

ChatLab 聚合包:一键安装可扩展聊天皮肤(基座 + 飞书)。

安装本包会通过依赖自动带上:
- `@liyuk/dsh-skin-chatlab-core`(基座)
- `@liyuk/dsh-skin-feishu`(飞书皮肤)

在 profile 的 `bundles` 列表加入 `@liyuk/dsh-skin-chatlab-core` 和 `@liyuk/dsh-skin-feishu` 即可生效。

如需更多皮肤,单独安装 `@liyuk/dsh-skin-<name>` 并加入 bundles。

## 安装

```sh
dsh plugin --profile web add @liyuk/dsh-skin-chatlab
```

然后在 profile `package.json` 的 `dsh.profile.bundles` 里加入:

```json
"@liyuk/dsh-skin-chatlab-core",
"@liyuk/dsh-skin-feishu"
```

## License

[MIT](./LICENSE)
