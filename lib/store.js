// Browser-local stub for 资料库. Not the team backend.
// Key: library-plugin:ziliaoku. Seeded once; an empty list stays empty.

export const STORAGE_KEY = "library-plugin:ziliaoku";

export function nowStamp(date) {
  var d = date || new Date();
  function p(n) { return String(n).padStart(2, "0"); }
  return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate())
    + "T" + p(d.getHours()) + ":" + p(d.getMinutes()) + ":" + p(d.getSeconds());
}

export function formatMtime(value) {
  var m = /^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2})/.exec(String(value || ""));
  if (m) return m[1] + " " + m[2];
  return "";
}

export function sampleNote() {
  return {
    id: "sample-indonesia",
    title: "印尼算力中心市场前景（2027-2035）与中美对比 · 结论摘要",
    body: "示例笔记，写在本机暂存里。印尼算力中心到 2035 的需求还在抬，和中美的差距主要在电力和落地速度，不在单卡纸面算力。结论先记这一句，细节以后补。",
    author: "agent",
    mtime: "2026-09-27T03:58:00",
  };
}

export function searchNotes(notes, query) {
  var list = Array.isArray(notes) ? notes : [];
  var q = String(query || "").trim().toLowerCase();
  if (!q) return list.slice();
  return list.filter(function (n) {
    return (String(n && n.title || "") + "\n" + String(n && n.body || "")).toLowerCase().indexOf(q) !== -1;
  });
}

export function browserStorage() {
  try {
    if (typeof localStorage !== "undefined" && localStorage) return localStorage;
  } catch (e) { /* private mode */ }
  return null;
}

function rid() {
  return "id-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
}

function seed() {
  return { version: 1, backend: "local-stub", notes: [sampleNote()], files: [] };
}

export function createLibraryStore(storage) {
  var mem = { raw: null };
  var box = storage || {
    getItem: function () { return mem.raw; },
    setItem: function (_k, v) { mem.raw = String(v); },
  };

  function save(state) {
    state.version = 1;
    state.backend = "local-stub";
    var saveError = null;
    try {
      box.setItem(STORAGE_KEY, JSON.stringify({
        version: state.version,
        backend: state.backend,
        notes: state.notes,
        files: state.files,
      }));
    } catch (e) {
      saveError = "本机暂存写不进去（可能超出浏览器容量）";
    }
    state.saveError = saveError;
    return state;
  }

  function load() {
    var raw = null;
    try { raw = box.getItem(STORAGE_KEY); } catch (e) { raw = null; }
    if (raw == null || raw === "") return save(seed());
    var parsed = null;
    try { parsed = JSON.parse(raw); } catch (e) { parsed = null; }
    if (!parsed || !Array.isArray(parsed.notes) || !Array.isArray(parsed.files)) return save(seed());
    parsed.version = 1;
    parsed.backend = "local-stub";
    parsed.saveError = null;
    return parsed;
  }

  function addNote(input) {
    input = input || {};
    var body = String(input.body || "").trim();
    if (!body) {
      var err = new Error("正文不能为空");
      err.code = "empty";
      throw err;
    }
    var title = String(input.title || "").trim();
    if (!title) title = body.split("\n")[0].slice(0, 36);
    var state = load();
    state.notes = [{
      id: input.id || rid(),
      title: title,
      body: body,
      author: String(input.author || "local").trim() || "local",
      mtime: input.mtime || nowStamp(),
    }].concat(state.notes);
    return save(state);
  }

  function removeNote(id) {
    var state = load();
    state.notes = state.notes.filter(function (n) { return n.id !== id; });
    return save(state);
  }

  function addFile(input) {
    input = input || {};
    var name = String(input.name || "").trim();
    if (!name) {
      var err = new Error("没有文件名");
      err.code = "empty";
      throw err;
    }
    var text = input.text == null ? null : String(input.text);
    var truncated = false;
    if (text != null && text.length > 80000) {
      text = text.slice(0, 80000);
      truncated = true;
    }
    var state = load();
    state.files = [{
      id: input.id || rid(),
      name: name,
      size: Number(input.size) || 0,
      type: String(input.type || ""),
      text: text,
      truncated: truncated || !!input.truncated,
      author: String(input.author || "local").trim() || "local",
      mtime: input.mtime || nowStamp(),
    }].concat(state.files);
    return save(state);
  }

  function removeFile(id) {
    var state = load();
    state.files = state.files.filter(function (f) { return f.id !== id; });
    return save(state);
  }

  return { load: load, addNote: addNote, removeNote: removeNote, addFile: addFile, removeFile: removeFile };
}
