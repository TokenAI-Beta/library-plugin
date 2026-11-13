import assert from "node:assert/strict";
import test from "node:test";
import { MAX_UPLOAD, canDeleteNote, createPortalApi, portalErrorText } from "../lib/api.js";

function mockFetch(routes) {
  const calls = [];
  const impl = (url, options) => {
    const u = new URL(url, "http://portal.local");
    calls.push({ url: u.pathname + u.search, method: (options && options.method) || "GET", body: options && options.body });
    const hit = routes(u, options || {});
    const status = hit.status || 200;
    const payload = hit.body;
    return Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      text: () => Promise.resolve(JSON.stringify(payload)),
    });
  };
  return { impl, calls };
}

test("notes and drive calls use this plugin", async () => {
  const { impl, calls } = mockFetch((url, options) => {
    if (url.pathname === "/plugins/anywork-library-plugin/kb/list") return { body: { notes: [{ name: "a.md", title: "甲", author: "agent", mtime: "2026-09-27 03:58" }], role: "admin" } };
    if (url.pathname === "/plugins/anywork-library-plugin/kb/search") return { body: { q: url.searchParams.get("q"), hits: [{ file: "notes/a.md", line: 2, text: "印尼" }] } };
    if (url.pathname === "/plugins/anywork-library-plugin/kb/note") return { body: { ok: true, name: "a.md", content: "正文" } };
    if (url.pathname === "/plugins/anywork-library-plugin/kb/save") {
      const sent = JSON.parse(options.body);
      assert.equal(sent.content, "含税价按到岸算。");
      assert.equal(sent.tags, "");
      assert.equal(url.searchParams.get("lang"), "zh");
      return { body: { ok: true, name: "n.md" } };
    }
    if (url.pathname === "/plugins/anywork-library-plugin/kb/rm") return { body: { ok: true } };
    if (url.pathname === "/plugins/anywork-library-plugin/drive/list") return { body: { path: url.searchParams.get("path"), entries: [] } };
    if (url.pathname === "/plugins/anywork-library-plugin/drive/mkdir") return { body: { ok: true, path: "客户A" } };
    if (url.pathname === "/plugins/anywork-library-plugin/drive/rm") return { body: { ok: true } };
    if (url.pathname === "/plugins/anywork-library-plugin/drive/mv") {
      const sent = JSON.parse(options.body);
      assert.equal(sent.from, "客户A/报价.txt");
      assert.equal(sent.to, "归档");
      return { body: { ok: true, path: "归档/报价.txt" } };
    }
    if (url.pathname === "/plugins/anywork-library-plugin/drive/upload") return { body: { ok: true, path: "报价.txt", size: 3 } };
    return { status: 404, body: { error: "not found" } };
  });
  const api = createPortalApi(() => impl);
  const listed = await api.listNotes();
  assert.equal(listed.role, "admin");
  assert.equal(canDeleteNote(listed.role), true);
  assert.equal(canDeleteNote("member"), false);
  const hits = await api.searchNotes("印尼");
  assert.equal(hits.hits[0].text, "印尼");
  assert.equal((await api.readNote("a.md")).content, "正文");
  await api.saveNote({ title: "报价口径", content: "含税价按到岸算。" }, "zh");
  await api.removeNote("n.md", "zh");
  assert.deepEqual((await api.listDrive("")).entries, []);
  await api.mkdir("", "客户A");
  await api.upload("客户A", { name: "报价.txt" });
  await api.mv("客户A/报价.txt", "归档");
  await api.rm("归档/报价.txt");
  assert.equal(api.downloadUrl("归档/报价.txt"), "/plugins/anywork-library-plugin/drive/download?path=" + encodeURIComponent("归档/报价.txt"));
  assert.equal(MAX_UPLOAD, 50 * 1024 * 1024);
  const paths = calls.map((c) => c.method + " " + c.url.split("?")[0]);
  assert.deepEqual(paths, [
    "GET /plugins/anywork-library-plugin/kb/list",
    "GET /plugins/anywork-library-plugin/kb/search",
    "GET /plugins/anywork-library-plugin/kb/note",
    "POST /plugins/anywork-library-plugin/kb/save",
    "POST /plugins/anywork-library-plugin/kb/rm",
    "GET /plugins/anywork-library-plugin/drive/list",
    "POST /plugins/anywork-library-plugin/drive/mkdir",
    "POST /plugins/anywork-library-plugin/drive/upload",
    "POST /plugins/anywork-library-plugin/drive/mv",
    "POST /plugins/anywork-library-plugin/drive/rm",
  ]);
});

test("login errors stay readable", async () => {
  const api = createPortalApi(() => () => Promise.resolve({
    ok: false,
    status: 401,
    text: () => Promise.resolve(JSON.stringify({ error: "login required" })),
  }));
  await assert.rejects(api.listNotes(), (err) => {
    assert.equal(err.status, 401);
    assert.match(portalErrorText(err), /登录/);
    assert.match(portalErrorText(err, "en"), /Sign in/);
    return true;
  });
});
