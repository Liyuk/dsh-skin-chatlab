// 多包发布：按依赖顺序 build + npm publish。
// 顺序：core → skin-feishu → chatlab(聚合，依赖前两者)。
// 用法：node scripts/publish.mjs [--dry-run]
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const dryRun = process.argv.includes("--dry-run");

const packages = [
  "packages/core",
  "packages/skin-feishu",
  "packages/chatlab"
];

for (const pkg of packages) {
  const dir = resolve(root, pkg);
  console.log(`\n=== ${pkg} ===`);
  const flags = dryRun ? " --dry-run" : "";
  execSync(`npm publish${flags} --access public`, { cwd: dir, stdio: "inherit" });
}

console.log("\n✅ 发布完成");
