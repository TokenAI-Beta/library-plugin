import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const reactUmd = join(root, "node_modules/react/umd/react.development.js");
const reactDomUmd = join(root, "node_modules/react-dom/umd/react-dom.development.js");
const puppeteerPath = join(root, "node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js");
const chrome = spawnSync("bash", ["-lc", "command -v google-chrome || command -v google-chrome-stable || true"], { encoding: "utf8" }).stdout.trim();

function startServer() {
  const server = createServer((req, res) => {
    const url = new URL(req.url || "/", "http://127.0.0.1");
    const routes = {
      "/": join(root, "preview/index.html"),
      "/preview/run.js": join(root, "preview/run.js"),
      "/lib/client.js": join(root, "lib/client.js"),
      "/vendor/react.development.js": reactUmd,
      "/vendor/react-dom.development.js": reactDomUmd,
    };
    const file = routes[url.pathname];
    if (!file || !existsSync(file)) {
      res.writeHead(404);
      res.end("missing " + url.pathname);
      return;
    }
    const body = readFileSync(file);
    const type = file.endsWith(".html") ? "text/html; charset=utf-8" : "text/javascript; charset=utf-8";
    res.writeHead(200, { "content-type": type, "cache-control": "no-store" });
    res.end(body);
  });
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => resolve(server));
  });
}

test("browser harness exercises 资料库 notes and files", {
  skip: !chrome || !existsSync(reactUmd) || !existsSync(reactDomUmd) || !existsSync(puppeteerPath),
}, async () => {
  const { default: puppeteer } = await import(pathToFileURL(puppeteerPath));
  const server = await startServer();
  const port = server.address().port;
  const browser = await puppeteer.launch({
    executablePath: chrome,
    headless: true,
    args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
    const errors = [];
    page.on("pageerror", (err) => errors.push(String(err)));
    await page.goto(`http://127.0.0.1:${port}/?auto=1`, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => document.title === "PASS" || document.title === "FAIL", { timeout: 8000 });
    const title = await page.title();
    const result = await page.$eval("#result", (el) => el.textContent);
    assert.equal(title, "PASS", result + "\n" + errors.join("\n"));
    const shotDir = join("/tmp", "zlk-shots");
    mkdirSync(shotDir, { recursive: true });
    await page.goto(`http://127.0.0.1:${port}/?shot=notes`, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => document.title === "SHOT", { timeout: 8000 });
    await page.screenshot({ path: join(shotDir, "notes.png") });
    await page.goto(`http://127.0.0.1:${port}/?shot=files`, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => document.title === "SHOT", { timeout: 8000 });
    await page.screenshot({ path: join(shotDir, "files.png") });
    await page.goto(`http://127.0.0.1:${port}/?shot=compose`, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => document.title === "SHOT", { timeout: 8000 });
    await page.screenshot({ path: join(shotDir, "compose.png") });
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
});
