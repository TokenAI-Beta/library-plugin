import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export const MAX_UPLOAD = 50 * 1024 * 1024;

export function libraryRoot() {
  if (process.env.ANYWORK_LIBRARY_DIR) return path.resolve(process.env.ANYWORK_LIBRARY_DIR);
  const home = process.env.DSH_HOME || path.join(os.homedir(), ".dsh");
  return path.join(home, "anywork-library-plugin");
}

function driveRoot() {
  return path.join(libraryRoot(), "drive");
}

function notesDir() {
  return path.join(libraryRoot(), "notes");
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function resolveIn(root, rel) {
  if (String(rel || "").includes("\0")) return { error: "bad path" };
  const base = path.resolve(root);
  const abs = path.resolve(base, path.normalize(rel || "."));
  if (abs !== base && !abs.startsWith(base + path.sep)) return { error: "path escapes" };
  return { abs, rel: abs === base ? "" : abs.slice(base.length + 1).split(path.sep).join("/") };
}

export function safeName(name) {
  const value = String(name || "");
  if (!value || value.includes("/") || value.includes("\\") || value.includes("\0")) return null;
  if (value === "." || value === "..") return null;
  if (value.length > 150) return null;
  return value;
}

function stamp(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate()) + " " + pad(date.getHours()) + ":" + pad(date.getMinutes());
}

export function listDrive(rel) {
  ensureDir(driveRoot());
  const found = resolveIn(driveRoot(), rel);
  if (found.error) return found;
  if (!fs.existsSync(found.abs)) return { path: found.rel, entries: [] };
  const stat = fs.statSync(found.abs);
  if (!stat.isDirectory()) return { error: "not a directory" };
  const entries = [];
  for (const name of fs.readdirSync(found.abs)) {
    if (name.startsWith(".")) continue;
    let size = 0;
    let mtime = "";
    let dir = false;
    try {
      const item = fs.statSync(path.join(found.abs, name));
      dir = item.isDirectory();
      size = item.isFile() ? item.size : 0;
      mtime = item.mtime.toISOString();
    } catch {
      continue;
    }
    entries.push({ name, dir, size, mtime });
  }
  entries.sort((a, b) => (a.dir === b.dir ? a.name.localeCompare(b.name, "zh") : a.dir ? -1 : 1));
  return { path: found.rel, entries };
}

export function makeDir(rel, name) {
  const safe = safeName(name);
  if (!safe) return { error: "bad name" };
  ensureDir(driveRoot());
  const found = resolveIn(driveRoot(), rel ? rel + "/" + safe : safe);
  if (found.error) return found;
  if (fs.existsSync(found.abs)) return { error: "exists" };
  fs.mkdirSync(found.abs, { recursive: false });
  return { ok: true, path: found.rel };
}

export function saveFile(rel, name, data) {
  const safe = safeName(name);
  if (!safe) return { error: "bad name" };
  if (!Buffer.isBuffer(data)) return { error: "bad body" };
  if (data.length > MAX_UPLOAD) return { error: "too large" };
  ensureDir(driveRoot());
  const found = resolveIn(driveRoot(), rel ? rel + "/" + safe : safe);
  if (found.error) return found;
  fs.mkdirSync(path.dirname(found.abs), { recursive: true });
  fs.writeFileSync(found.abs, data);
  return { ok: true, path: found.rel, size: data.length };
}

export function fileForDownload(rel) {
  const found = resolveIn(driveRoot(), rel);
  if (found.error) return found;
  if (!fs.existsSync(found.abs) || !fs.statSync(found.abs).isFile()) return { error: "not found" };
  return { ok: true, abs: found.abs, name: path.basename(found.abs), size: fs.statSync(found.abs).size };
}

export function removePath(rel) {
  if (!rel) return { error: "bad path" };
  const found = resolveIn(driveRoot(), rel);
  if (found.error) return found;
  if (found.abs === path.resolve(driveRoot())) return { error: "cannot remove drive root" };
  if (!fs.existsSync(found.abs)) return { error: "not found" };
  fs.rmSync(found.abs, { recursive: true, force: true });
  return { ok: true };
}

export function movePath(from, toDir) {
  if (!from) return { error: "bad path" };
  const source = resolveIn(driveRoot(), from);
  if (source.error) return source;
  const destDir = resolveIn(driveRoot(), toDir || "");
  if (destDir.error) return destDir;
  if (!fs.existsSync(source.abs)) return { error: "not found" };
  const dest = resolveIn(driveRoot(), destDir.rel ? destDir.rel + "/" + path.basename(source.abs) : path.basename(source.abs));
  if (dest.error) return dest;
  if (dest.abs === source.abs || dest.abs.startsWith(source.abs + path.sep)) return { error: "cannot move into itself" };
  if (fs.existsSync(dest.abs)) return { error: "target exists" };
  fs.mkdirSync(destDir.abs, { recursive: true });
  fs.renameSync(source.abs, dest.abs);
  return { ok: true, path: dest.rel };
}

function noteName(name) {
  const value = String(name || "");
  if (!value || value !== path.basename(value) || value.startsWith(".") || !/\.md$/i.test(value)) return null;
  return value;
}

function noteMeta(name) {
  const full = path.join(notesDir(), name);
  const stat = fs.statSync(full);
  const head = fs.readFileSync(full, "utf8").slice(0, 400);
  const title = /^title:\s*(.+)$/m.exec(head)?.[1]?.trim() || name.replace(/\.md$/i, "");
  const author = /^author:\s*(.+)$/m.exec(head)?.[1]?.trim() || "";
  return { name, title, author, size: stat.size, mtime: stamp(stat.mtime) };
}

export function listNotes() {
  ensureDir(notesDir());
  const notes = [];
  for (const name of fs.readdirSync(notesDir())) {
    if (!/\.md$/i.test(name) || name.startsWith(".") || /^readme/i.test(name)) continue;
    try { notes.push(noteMeta(name)); } catch { /* skip unreadable */ }
  }
  notes.sort((a, b) => (a.mtime < b.mtime ? 1 : -1));
  return { notes, role: "admin" };
}

export function saveNote(input) {
  const title = String(input.title || "").trim().slice(0, 120);
  const content = String(input.content || "").trim();
  if (!content) return { error: "内容不能为空" };
  if (content.length > 100000) return { error: "内容过长" };
  ensureDir(notesDir());
  const now = new Date();
  const slug = (title || content.split("\n")[0] || "note").replace(/[^\w\u4e00-\u9fff-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "note";
  const pad = (n) => String(n).padStart(2, "0");
  const fileStamp = now.getFullYear() + pad(now.getMonth() + 1) + pad(now.getDate()) + "-" + pad(now.getHours()) + pad(now.getMinutes()) + pad(now.getSeconds());
  let name = fileStamp + "-" + slug + ".md";
  let n = 2;
  while (fs.existsSync(path.join(notesDir(), name))) {
    name = fileStamp + "-" + slug + "-" + n + ".md";
    n += 1;
  }
  const body = "---\ntitle: " + (title || slug) + "\nauthor: 工作台\ntime: " + stamp(now) + "\n---\n\n" + content + "\n";
  fs.writeFileSync(path.join(notesDir(), name), body, "utf8");
  return { ok: true, name };
}

export function readNote(name) {
  const safe = noteName(name);
  if (!safe) return { error: "名称不合法" };
  const full = path.join(notesDir(), safe);
  if (!fs.existsSync(full)) return { error: "笔记不存在" };
  const raw = fs.readFileSync(full, "utf8");
  const content = raw.replace(/^---\n[\s\S]*?\n---\n*/, "").trim();
  return { ok: true, name: safe, content };
}

export function removeNote(name) {
  const safe = noteName(name);
  if (!safe) return { error: "名称不合法" };
  const full = path.join(notesDir(), safe);
  if (!fs.existsSync(full)) return { error: "笔记不存在" };
  fs.unlinkSync(full);
  return { ok: true };
}

export function searchNotes(query) {
  const q = String(query || "").trim().toLowerCase();
  const hits = [];
  const listed = listNotes();
  for (const note of listed.notes) {
    const read = readNote(note.name);
    const text = note.title + "\n" + (read.ok ? read.content : "");
    if (!q || text.toLowerCase().includes(q)) {
      hits.push({ file: "notes/" + note.name, line: 1, text: note.title });
    }
    if (hits.length >= 20) break;
  }
  return { q, hits, truncated: false };
}
