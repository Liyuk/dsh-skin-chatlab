// 热重载 host 侧（lib/index.js 的 RPC 半），无需重启 dsh web。
//
// dsh-hot-reload 监听 profile 的 pnpm-lock.yaml：lockfile 一变，就对比已加载插件
// 的版本（读 node_modules/<pkg>/package.json），版本变了就把运行中的 host fiber
// 就地换成新版。本脚本做的两件事正好触发它：
//   1. 给 host 包的 package.json 版本号加一个递增的 -dev.N 后缀（link 依赖不按版本
//      安装，改版本只当「代码变了」的信号，不影响实际解析路径）；
//   2. touch profile 的 pnpm-lock.yaml（改 mtime 即触发 chokidar 的 change）。
//
// 注意：dsh-hot-reload 只使「入口模块」失效（lib/index.js），不会递归失效它 import
// 的兄弟模块。所以改 lib/projection.js 这种被 index.js import 的文件，得重启一次 dsh。
// client 端（皮肤）不在这里——那是 `npm run build` / `npm run dev` 的 client-hmr 在管。
import { readFileSync, writeFileSync, existsSync, utimesSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";
import { homedir } from "node:os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

// 有 host 半的包（皮肤包 host 是 no-op，但也是 loader entry，一起 bump 保持一致）。
const HOST_PACKAGES = ["packages/core", "packages/skin-feishu"];

// web profile 的 lockfile（dsh-hot-reload 监听的对象）。
// 可用环境变量 DSH_WEB_PROFILE 覆盖 profile 目录。
const profileDir = process.env.DSH_WEB_PROFILE || join(homedir(), ".dsh", "profiles", "web");
const lockfile = join(profileDir, "pnpm-lock.yaml");

// 必须在改写任何版本/本地状态前确认目标 profile 存在，失败不留下半成品。
if (!existsSync(lockfile)) {
  console.error(`✗ 没找到 lockfile：${lockfile}\n   web profile 在这里吗？可用 DSH_WEB_PROFILE 覆盖。`);
  process.exit(1);
}

// 单调递增的 dev 版本号，存在 .devrev（已 gitignore），避免污染正式版本号。
const revFile = join(root, ".devrev");
let rev = 0;
try {
  rev = parseInt(readFileSync(revFile, "utf8"), 10) || 0;
} catch {
  /* 首次运行，从 0 开始 */
}
rev += 1;

for (const dir of HOST_PACKAGES) {
  const pkgPath = resolve(root, dir, "package.json");
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  const base = pkg.version.split("-dev.")[0];
  const next = `${base}-dev.${rev}`;
  pkg.version = next;
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  console.log(`✓ ${pkg.name} -> ${next}`);
}
writeFileSync(revFile, String(rev) + "\n");

const now = new Date();
utimesSync(lockfile, now, now);
console.log(`✓ touched ${lockfile}`);
console.log("dsh-hot-reload 将就地热重载 host 半（lib/index.js）；浏览器端皮肤不受影响。");
console.log("提示：改了 lib/projection.js 需重启 dsh（详见 CONTRIBUTING.md）。");
