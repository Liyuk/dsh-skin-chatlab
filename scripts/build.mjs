// monorepo build：esbuild 打包各包的 client bundle。
// 产物放到各包的 lib/client.js。打包目标见 bundles.mjs。
import { build } from "esbuild";
import { resolve } from "node:path";
import { root, targets } from "./bundles.mjs";

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
