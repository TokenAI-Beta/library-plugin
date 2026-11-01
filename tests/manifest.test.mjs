import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("package is an installable web client plugin", () => {
  const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
  assert.equal(pkg.name, "library-plugin");
  assert.equal(pkg.version, "0.1.0");
  assert.equal(pkg.exports["./client"], "./lib/client.js");
  assert.equal(pkg.dsh.bundle.patch, "./cordis.patch.yml");
  assert.equal(pkg.dsh.client.platform, "web");
  assert.deepEqual(pkg.dsh.client.inject, [
    "@deepseek-ai/dsh-client-ui-slots",
    "@deepseek-ai/dsh-client-ui-sidebar",
  ]);
  assert.equal(pkg.peerDependencies["@deepseek-ai/cordis"], "^4.0.1");
  assert.equal(pkg.exports["./icon"], "./icon.svg");
  assert.match(pkg.engines.dsh, /^>=0\.2\.1-rc\.3 <0\.3\.0$/);
  const yml = readFileSync(new URL("../cordis.patch.yml", import.meta.url), "utf8");
  assert.match(yml, /id:\s*ziliaoku/);
  assert.match(yml, /name:\s*'library-plugin'/);
  assert.doesNotMatch(yml, /id:\s*desk-hub/);
  const client = readFileSync(new URL("../lib/client.js", import.meta.url), "utf8");
  assert.match(client, /id:\s*"ziliaoku"/);
  assert.match(client, /资料库/);
  assert.match(client, /文件 \+ 笔记 · 放进来 = 全员可见/);
  assert.match(client, /＋ 记一条/);
  assert.match(client, /\/portal\/api\/drive\/list/);
  assert.match(client, /\/portal\/api\/kb\/list/);
  assert.doesNotMatch(client, /id:\s*"desk-hub"/);
  assert.doesNotMatch(client, /localStorage/);
  assert.equal(client.includes("sidebar.footer.action"), true);
});
