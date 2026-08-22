# @liyuk/dsh-skin-chatlab

ChatLab 聚合包：一键安装基座和六套互相独立的视觉皮肤。

安装本包会带上：

- `@liyuk/dsh-skin-chatlab-core`
- `@liyuk/dsh-skin-feishu`
- `@liyuk/dsh-skin-slack`
- `@liyuk/dsh-skin-wecom`
- `@liyuk/dsh-skin-dingtalk`
- `@liyuk/dsh-skin-telegram`
- `@liyuk/dsh-skin-whatsapp`

## 安装

```sh
dsh plugin --profile web add @liyuk/dsh-skin-chatlab
```

聚合包自带 profile bundle patch，会把 core 与六个皮肤一起加入 `dsh.profile.bundles`；安装后重启 DSH Web，打开设置 →「ChatLab 皮肤」即可切换。任一皮肤也可作为独立 npm 包单独安装。

Slack、企业微信、钉钉、Telegram、WhatsApp 皮肤均为非官方视觉适配，使用原创抽象标记，只映射 DSH 已有会话、预览、未读、运行状态和输入区，不声称实现对应产品的频道、线程、反应、在线状态、送达/已读回执、审批或通话能力。

## License

MIT
