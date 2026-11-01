import assert from "node:assert/strict";
import test from "node:test";
import {
  STORAGE_KEY,
  createLibraryStore,
  formatMtime,
  sampleNote,
  searchNotes,
} from "../lib/store.js";

function memory() {
  const box = new Map();
  return {
    getItem(k) { return box.has(k) ? box.get(k) : null; },
    setItem(k, v) { box.set(k, String(v)); },
  };
}

test("seeds one sample note the first time", () => {
  const store = createLibraryStore(memory());
  const state = store.load();
  assert.equal(state.backend, "local-stub");
  assert.equal(state.notes.length, 1);
  assert.equal(state.notes[0].title, sampleNote().title);
  assert.equal(formatMtime(state.notes[0].mtime), "2026-09-27 03:58");
  assert.equal(state.notes[0].author, "agent");
  assert.deepEqual(state.files, []);
});

test("empty lists stay empty", () => {
  const box = memory();
  const store = createLibraryStore(box);
  store.removeNote("sample-indonesia");
  const again = createLibraryStore(box).load();
  assert.equal(again.notes.length, 0);
});

test("search, add, and delete notes", () => {
  const box = memory();
  const store = createLibraryStore(box);
  assert.equal(searchNotes(store.load().notes, "印尼").length, 1);
  assert.equal(searchNotes(store.load().notes, "不存在").length, 0);
  const next = store.addNote({ title: "", body: "含税价按到岸算。\n第二行", author: "local" });
  assert.equal(next.notes[0].title, "含税价按到岸算。");
  assert.equal(next.notes.length, 2);
  assert.throws(() => store.addNote({ body: "  " }), /正文不能为空/);
  const gone = store.removeNote(next.notes[0].id);
  assert.equal(gone.notes.length, 1);
  assert.equal(gone.notes[0].id, "sample-indonesia");
  const raw = JSON.parse(box.getItem(STORAGE_KEY));
  assert.equal(raw.backend, "local-stub");
});

test("files keep text and can be removed", () => {
  const store = createLibraryStore(memory());
  const next = store.addFile({ name: "口径.txt", size: 12, type: "text/plain", text: "到岸价", author: "local" });
  assert.equal(next.files[0].name, "口径.txt");
  assert.equal(next.files[0].text, "到岸价");
  const huge = "x".repeat(80010);
  const cut = store.addFile({ name: "long.txt", size: huge.length, type: "text/plain", text: huge });
  assert.equal(cut.files[0].text.length, 80000);
  assert.equal(cut.files[0].truncated, true);
  assert.equal(store.removeFile(cut.files[0].id).files.length, 1);
  assert.throws(() => store.addFile({ name: "  " }), /没有文件名/);
});
