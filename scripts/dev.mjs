// 开发模式（client 端）：esbuild watch 各包 src/*.js → lib/client.js。
//
// 编辑 packages/*/src/*.js 会自动重打包；dsh 内置的 dsh-client-hmr 会 stat-poll
// 每个包的 lib/client.js，检测到变化后把「rebuilt」帧推给浏览器，就地热重载皮肤
// —— 无需重启 dsh web、无需手动刷页面。
//
// host 侧改动（lib/index.js 的 RPC 半）走另一条路：另开终端跑 `npm run reload:host`。
import { context } from "esbuild";
import { resolve } from "node:path";
import { root, targets } from "./bundles.mjs";

const contexts = await Promise.all(
  targets.map((t) =>
    context({
      entryPoints: [resolve(root, t.entry)],
      outfile: resolve(root, t.outfile),
      bundle: true,
      format: "iife",
      platform: "browser",
      external: t.external,
      logLevel: "info"
    })
  )
);

await Promise.all(contexts.map((c) => c.watch()));

console.log("\n👀 dsh-skin-chatlab dev watch 已启动");
console.log("   - 编辑 packages/*/src/*.js → 自动重打包 lib/client.js");
console.log("   - dsh 内置 client-hmr → 浏览器里热重载皮肤（无需重启 / 刷页面）");
console.log("   - 改了 host 侧（lib/index.js）→ 另开终端跑 `npm run reload:host`\n");
