// 多包发布：按依赖顺序 build + npm publish。
// 顺序：core → 六套皮肤 → chatlab(聚合，依赖前述包)。
// 用法：node scripts/publish.mjs [--dry-run]
// dry-run 使用 npm pack，避免 npm 对已发布版本执行重复发布校验。
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const dryRun = process.argv.includes("--dry-run");

const packages = [
  "packages/core",
  "packages/skin-feishu",
  "packages/skin-slack",
  "packages/skin-wecom",
  "packages/skin-dingtalk",
  "packages/skin-telegram",
  "packages/skin-whatsapp",
  "packages/chatlab"
];

for (const pkg of packages) {
  const dir = resolve(root, pkg);
  console.log(`\n=== ${pkg} ===`);
  const command = dryRun ? "npm pack --dry-run" : "npm publish --access public";
  execSync(command, { cwd: dir, stdio: "inherit" });
}

console.log("\n✅ 发布完成");
