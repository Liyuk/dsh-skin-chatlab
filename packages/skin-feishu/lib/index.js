// @liyuk/dsh-skin-feishu — host half (no-op).
// 皮肤包是纯 client 插件：只在浏览器里注册皮肤数据到 core 的 chatlab 服务。
// host 端无逻辑，但 cordis 需要这个入口文件存在。
const name = "@liyuk/dsh-skin-feishu";
const inject = [];
function apply() {}

export { apply, inject, name };
