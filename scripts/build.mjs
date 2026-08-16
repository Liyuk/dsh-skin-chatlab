// monorepo build：esbuild 打包 core 和 skin-feishu 的 client bundle。
// 产物放到各包的 lib/client.js。
import { build } from "esbuild";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const targets = [
  {
    entry: "packages/core/src/index.js",
    outfile: "packages/core/lib/client.js",
    external: ["react"]
  },
  {
    entry: "packages/skin-feishu/src/index.js",
    outfile: "packages/skin-feishu/lib/client.js",
    external: [] // skin-feishu 不依赖 react
  }
];

for (const t of targets) {
  await build({
    entryPoints: [resolve(root, t.entry)],
    outfile: resolve(root, t.outfile),
    bundle: true,
    format: "iife",
    platform: "browser",
    external: t.external,
    logLevel: "info"
  });
  console.log(`✓ ${t.outfile}`);
}
