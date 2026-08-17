// 共享的 client bundle 打包目标，供 build.mjs（一次性）与 dev.mjs（watch）复用。
// 每个目标把某个包的 src/*.js 打成该包的 lib/client.js IIFE bundle：
// dsh 把它 serve 给浏览器，内置的 dsh-client-hmr 在文件变化时热重载皮肤。
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const root = resolve(__dirname, "..");

export const targets = [
  {
    entry: "packages/core/src/index.js",
    outfile: "packages/core/lib/client.js",
    external: ["react"] // core 的 settings 面板以 react 作参数注入，不打包 react
  },
  {
    entry: "packages/skin-feishu/src/index.js",
    outfile: "packages/skin-feishu/lib/client.js",
    external: [] // skin-feishu 纯 token + CSS，无 react 依赖
  }
];
