import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { listDrive, listNotes, makeDir, readNote, removeNote, saveFile, saveNote } from "../lib/store.js";

const dir = mkdtempSync(join(tmpdir(), "zlk-"));
process.env.ANYWORK_LIBRARY_DIR = dir;

test("shelf stores a sentence and a file without a portal", () => {
  const empty = listNotes();
  assert.equal(empty.notes.length, 0);
  assert.equal(empty.role, "admin");
  const saved = saveNote({ title: "报价口径", content: "含税价按到岸算。" });
  assert.equal(saved.ok, true);
  const notes = listNotes();
  assert.equal(notes.notes[0].title, "报价口径");
  assert.match(readNote(saved.name).content, /到岸/);
  assert.equal(removeNote(saved.name).ok, true);
  assert.equal(listNotes().notes.length, 0);

  const file = saveFile("", "口径.txt", Buffer.from("到岸价"));
  assert.equal(file.ok, true);
  const listed = listDrive("");
  assert.equal(listed.entries[0].name, "口径.txt");
  assert.equal(makeDir("", "客户A").ok, true);
  assert.equal(listDrive("").entries.some((entry) => entry.name === "客户A" && entry.dir), true);
});

test.after(() => {
  rmSync(dir, { recursive: true, force: true });
});
