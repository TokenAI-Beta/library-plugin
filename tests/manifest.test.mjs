import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("package is an installable web client plugin", () => {
  const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
  assert.equal(pkg.name, "anywork-library-plugin");
  assert.equal(pkg.version, "0.2.14");
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
  assert.match(yml, /name:\s*'anywork-library-plugin'/);
  assert.doesNotMatch(yml, /id:\s*desk-hub/);
  const client = readFileSync(new URL("../lib/client.js", import.meta.url), "utf8");
  assert.match(client, /id:\s*"ziliaoku"/);
  assert.match(client, /资料库/);
  assert.match(client, /丢进来，全员就能看见/);
  assert.match(client, /或写一句，回车记下/);
  assert.match(client, /function joinPath\(/);
  assert.match(client, /检查更新/);
  assert.match(client, /My files/);
  assert.match(client, /Check for updates/);
  assert.match(client, /documentElement.lang/);
  assert.match(client, /data-zlk-theme/);
  assert.match(client, /#151517/);
  assert.match(client, /\/plugins\/anywork-library-plugin\/update/);
  assert.doesNotMatch(client, /data-zlk-update/);
  assert.match(client, /\/plugins\/anywork-library-plugin\/drive\/list/);
  assert.match(client, /\/plugins\/anywork-library-plugin\/kb\/list/);
  assert.doesNotMatch(client, /id:\s*"desk-hub"/);
  assert.doesNotMatch(client, /localStorage/);
  assert.equal(client.includes("sidebar.footer.action"), true);
});
