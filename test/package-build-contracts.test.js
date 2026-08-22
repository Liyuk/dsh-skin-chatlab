import { describe, expect, it } from "vitest";
import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { targets } from "../scripts/bundles.mjs";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const skinDirs = ["skin-feishu", "skin-slack", "skin-wecom", "skin-dingtalk", "skin-telegram", "skin-whatsapp"];
const aggregatePackages = [
  "@liyuk/dsh-skin-chatlab-core",
  "@liyuk/dsh-skin-feishu",
  "@liyuk/dsh-skin-slack",
  "@liyuk/dsh-skin-wecom",
  "@liyuk/dsh-skin-dingtalk",
  "@liyuk/dsh-skin-telegram",
  "@liyuk/dsh-skin-whatsapp"
];

describe("build target contract", () => {
  it("builds core plus every independently published skin to a unique output", async () => {
    expect(targets).toHaveLength(7);
    expect(new Set(targets.map((target) => target.entry)).size).toBe(targets.length);
    expect(new Set(targets.map((target) => target.outfile)).size).toBe(targets.length);

    for (const target of targets) {
      await access(resolve(root, target.entry));
      const output = await readFile(resolve(root, target.outfile), "utf8");
      expect(output).not.toMatch(/(^|\n)\s*import\s/m);
      expect(output).not.toMatch(/\bfrom\s+["']/);
    }
    for (const dir of skinDirs) {
      expect(targets.some((target) => target.entry === `packages/${dir}/src/index.js`)).toBe(true);
    }
  });
});

describe("publish script contract", () => {
  it("uses npm pack for dry-run so an already published version is still preflightable", async () => {
    const source = await readFile(resolve(root, "scripts/publish.mjs"), "utf8");
    expect(source).toContain('const command = dryRun ? "npm pack --dry-run" : "npm publish --access public";');
    expect(source).not.toContain("npm publish --dry-run");
  });
});

describe("skin package metadata contract", () => {
  it("ships every skin as a self-contained client-only plugin", async () => {
    const patchIds = [];
    for (const dir of skinDirs) {
      const base = resolve(root, "packages", dir);
      const pkg = JSON.parse(await readFile(resolve(base, "package.json"), "utf8"));
      expect(pkg.main).toBe("lib/index.js");
      expect(pkg.exports["./client"]).toBe("./lib/client.js");
      expect(pkg.files).toEqual(expect.arrayContaining(["lib", "cordis.patch.yml", "README.md"]));
      expect(pkg.peerDependencies["@liyuk/dsh-skin-chatlab-core"]).toBeTruthy();
      expect(pkg.dependencies && pkg.dependencies["@liyuk/dsh-skin-shared-internal"]).toBeFalsy();
      expect(pkg.dsh.client.inject).toEqual(["@deepseek-ai/dsh-client-runtime"]);
      const source = await readFile(resolve(base, "src/index.js"), "utf8");
      const dataSource = await readFile(resolve(base, "src", `${dir.replace("skin-", "")}.js`), "utf8");
      expect(source).toMatch(/inject(?:\s*=|\s*:)[^\n]*\["chatlab"\]/);
      expect(source).not.toMatch(/packages\/core|skin-shared\/src/);
      expect(dataSource).not.toMatch(/packages\/core|MutationObserver/);
      await access(resolve(base, "lib/index.js"));
      const patch = await readFile(resolve(base, "cordis.patch.yml"), "utf8");
      const match = patch.match(/id:\s*([^\s]+)/);
      expect(match).toBeTruthy();
      patchIds.push(match[1]);
    }
    expect(new Set(patchIds).size).toBe(patchIds.length);
  });

  it("keeps the aggregate package complete and dependency-only", async () => {
    const pkg = JSON.parse(await readFile(resolve(root, "packages/chatlab/package.json"), "utf8"));
    expect(Object.keys(pkg.dependencies).sort()).toEqual([...aggregatePackages].sort());
    expect(pkg.files).toEqual(["README.md", "cordis.patch.yml"]);
    expect(pkg.main).toBeUndefined();
    expect(pkg.exports).toBeUndefined();
    expect(pkg.dsh.bundle.patch).toBe("./cordis.patch.yml");
    const patch = await readFile(resolve(root, "packages/chatlab/cordis.patch.yml"), "utf8");
    for (const name of aggregatePackages) expect(patch).toContain(`name: '${name}'`);
  });
});
