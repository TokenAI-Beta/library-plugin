var inject = ["slots"];
var ZLK_SEQ = 0;

var ZLK_CSS = `
.zlk-nav { display:flex; align-items:center; gap:10px; width:100%; padding:7px 10px; border:0; border-radius:10px; background:transparent; color:inherit; cursor:pointer; font:400 14px/22px -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Noto Sans SC", "Microsoft YaHei", sans-serif; text-align:left; }
.zlk-nav:hover { background:rgba(127,127,127,.12); }
.zlk-nav.on { background:rgba(79,124,247,.13); }
.zlk-nav .ic { width:16px; height:16px; display:flex; align-items:center; justify-content:center; flex:0 0 auto; }
.zlk-nav .lbl { flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.zlk-fv { position:fixed; left:var(--zlk-fv-left, 0px); top:0; right:0; bottom:0; z-index:9999; display:flex; flex-direction:column; background:#e6e6e6; color:#1c1e21; overflow:auto; font-family:-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Noto Sans SC", "Microsoft YaHei", sans-serif; }
.zlk-hd { position:sticky; top:0; z-index:2; display:flex; align-items:center; gap:12px; padding:16px 16px 14px; background:#fff; }
.zlk-mark { width:44px; height:44px; border-radius:12px; display:flex; align-items:center; justify-content:center; background:#fff; border:1px solid #e4e4e4; color:#4b5563; flex:0 0 auto; }
.zlk-hd-text { flex:1; min-width:0; }
.zlk-t1 { font-size:18px; font-weight:700; line-height:1.3; }
.zlk-t2 { margin-top:3px; font-size:12px; line-height:1.45; color:#8b919a; }
.zlk-back { margin-left:auto; flex:0 0 auto; height:34px; padding:0 14px; border:1px solid #d5d5d5; border-radius:999px; background:#fff; color:#3a3a3a; font:500 12.5px/1 inherit; cursor:pointer; white-space:nowrap; }
.zlk-back:hover { background:#f6f6f6; }
.zlk-bd { padding:14px 16px 72px; }
.zlk-tabs { display:flex; gap:4px; padding:4px; margin:0 0 14px; background:#fff; border-radius:12px; box-shadow:0 1px 2px rgba(16,24,40,.04); }
.zlk-tab { flex:1; display:flex; align-items:center; justify-content:center; gap:6px; height:36px; border:0; border-radius:9px; background:transparent; color:#6b7280; font:500 14px/1 inherit; cursor:pointer; }
.zlk-tab.on { background:#fff; color:#1c1e21; font-weight:650; box-shadow:0 1px 3px rgba(16,24,40,.14); }
.zlk-hint { margin:0 2px 12px; font-size:13px; line-height:1.65; color:#8b9098; }
.zlk-row { display:flex; gap:8px; align-items:center; margin-top:12px; flex-wrap:wrap; }
.zlk-inp { width:100%; min-width:0; height:40px; box-sizing:border-box; border:1px solid #e1e1e1; border-radius:10px; padding:0 12px; background:#fff; color:inherit; font:400 14px/1.4 inherit; outline:none; }
.zlk-inp::placeholder { color:#c5c8ce; }
.zlk-inp:focus { border-color:#4f7cf7; box-shadow:0 0 0 3px rgba(79,124,247,.15); }
.zlk-ta { height:auto; min-height:88px; padding:10px 12px; resize:vertical; }
.zlk-search { flex:1; }
.zlk-btn { height:36px; padding:0 16px; border:0; border-radius:10px; background:#3478f6; color:#fff; font:600 14px/1 inherit; cursor:pointer; }
.zlk-btn:hover { background:#2d6ae0; }
.zlk-btn.gh { background:#fff; border:1px solid #e1e1e1; color:#3a3a3a; font-weight:500; }
.zlk-btn.gh:hover { background:#f7f7f7; }
.zlk-form { display:flex; flex-direction:column; gap:8px; margin-top:12px; }
.zlk-msg { margin-top:8px; font-size:12.5px; color:#8b9098; }
.zlk-msg.ok { color:#248a3d; }
.zlk-msg.err { color:#d64545; }
.zlk-it { display:flex; gap:10px; align-items:flex-start; padding:8px 2px 14px; }
.zlk-ico { width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center; background:#fff; border:1px solid #ececec; color:#6b7280; flex:0 0 auto; font-size:16px; }
.zlk-gr { flex:1; min-width:0; }
.zlk-top { display:flex; align-items:flex-start; gap:10px; }
.zlk-title { flex:1; min-width:0; font-size:15px; font-weight:650; line-height:1.45; color:#222; word-break:break-word; }
.zlk-title.link { cursor:pointer; }
.zlk-meta { margin-top:6px; font-size:13px; line-height:1.4; color:#9aa0a6; }
.zlk-acts { display:flex; flex-direction:column; gap:8px; flex:0 0 auto; }
.zlk-acts.row { flex-direction:row; flex-wrap:wrap; justify-content:flex-end; }
.zlk-mini { min-width:64px; height:32px; padding:0 12px; border:1px solid #d8d8d8; border-radius:8px; background:#fff; color:#3a3a3a; font:400 13px/1 inherit; cursor:pointer; text-decoration:none; display:inline-flex; align-items:center; justify-content:center; box-sizing:border-box; }
.zlk-mini:hover { background:#f7f7f7; }
.zlk-body { margin-top:10px; padding:10px 12px; border-radius:10px; background:#fff; border:1px solid #ececec; font-size:13.5px; line-height:1.65; white-space:pre-wrap; word-break:break-word; color:#333; }
.zlk-empty { margin-top:12px; padding:18px 14px; border:1.5px dashed #cfd3d8; border-radius:12px; background:#f7f8fa; color:#4f7cf7; cursor:pointer; }
.zlk-empty b { display:block; font-size:14px; }
.zlk-empty span { display:block; margin-top:4px; font-size:12px; color:#8b9098; font-weight:400; }
.zlk-file { position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0 0 0 0); }
.zlk-bc { font-size:13px; margin:2px 0 4px; color:#4b5563; }
.zlk-bc .lk { color:#3478f6; cursor:pointer; }
.zlk-drop { margin-top:12px; border:1.5px dashed #cfd3d8; border-radius:12px; background:#f7f8fa; text-align:center; padding:14px 10px; }
.zlk-drop.on { border-color:#3478f6; background:#f3f7ff; }
.zlk-drop b { display:block; color:#3478f6; font-size:14px; }
.zlk-drop span { display:block; margin-top:4px; font-size:12px; color:#8b9098; }
.zlk-pick { margin-top:12px; padding:12px; border-radius:12px; background:#fff; border:1px solid #e6e6e6; }
`;

function ensureCss() {
  if (typeof document === "undefined") return;
  if (document.getElementById("library-plugin-css")) return;
  var st = document.createElement("style");
  st.id = "library-plugin-css";
  st.textContent = ZLK_CSS;
  (document.head || document.documentElement).appendChild(st);
}

function h(type, props) {
  var args = [type, props];
  for (var i = 2; i < arguments.length; i++) args.push(arguments[i]);
  return React.createElement.apply(React, args);
}

function svg(size) {
  var props = {
    viewBox: "0 0 24 24", width: size, height: size, fill: "none", stroke: "currentColor",
    strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true",
  };
  var args = ["svg", props];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  return h.apply(null, args);
}

function iconFolder(size) {
  return svg(size, h("path", { d: "M3.5 7.5A1.5 1.5 0 0 1 5 6h4l2 2h8a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 19 19H5a1.5 1.5 0 0 1-1.5-1.5v-10z" }));
}

function measureFv() {
  var left = 0;
  try {
    if (!(window.matchMedia && window.matchMedia("(max-width: 820px)").matches)) {
      var sc = document.querySelector('[class*="sidebarCol"]');
      if (sc) {
        var r = sc.getBoundingClientRect();
        if (r && r.right > 40 && r.right < window.innerWidth * 0.6) left = Math.round(r.right);
      }
    }
    document.documentElement.style.setProperty("--zlk-fv-left", left + "px");
  } catch (e) { /* ignore */ }
}

function notifyFv(id) {
  try { window.dispatchEvent(new CustomEvent("desk-fv", { detail: { id: id } })); } catch (e) { /* ignore */ }
}

function deskLang() {
  try {
    var lang = (document.documentElement && document.documentElement.lang) || (navigator.language || "zh");
    return String(lang).toLowerCase().indexOf("en") === 0 ? "en" : "zh";
  } catch (e) { return "zh"; }
}

function formatSize(n) {
  n = Number(n) || 0;
  if (n < 1024) return n + " B";
  if (n < 1048576) return (n / 1024).toFixed(n < 10240 ? 1 : 0) + " KB";
  return (n / 1048576).toFixed(1) + " MB";
}

function formatWhen(value) {
  var m = /^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2})/.exec(String(value || ""));
  if (m) return m[1] + " " + m[2];
  return String(value || "");
}

function joinPath(dir, name) {
  return dir ? dir + "/" + name : name;
}

function LibraryPanel(props) {
  var wide = !!(props && props.wide);
  var openPair = React.useState(false);
  var open = openPair[0];
  var setOpen = openPair[1];
  var tabPair = React.useState("notes");
  var tab = tabPair[0];
  var setTab = tabPair[1];
  var fsPair = React.useState({ phase: "idle", path: "", entries: [], message: "", newFolder: false, pick: null, drag: false });
  var fs = fsPair[0];
  var setFs = fsPair[1];
  var nsPair = React.useState({ phase: "idle", role: "member", notes: [], q: "", hits: [], message: "", expanded: "", content: "", composing: false });
  var ns = nsPair[0];
  var setNs = nsPair[1];
  var apiRef = React.useRef(null);
  var idRef = React.useRef("");
  var openRef = React.useRef(false);
  var fileRef = React.useRef(null);
  var qRef = React.useRef(null);
  var titleRef = React.useRef(null);
  var bodyRef = React.useRef(null);
  var folderRef = React.useRef(null);
  var pathRef = React.useRef("");
  if (!idRef.current) idRef.current = "ziliaoku-" + (++ZLK_SEQ);
  if (!apiRef.current) apiRef.current = createPortalApi(function () { return window.fetch.bind(window); });
  openRef.current = open;
  pathRef.current = fs.path;

  function patchFs(p) { setFs(function (prev) { return Object.assign({}, prev, p); }); }
  function patchNs(p) { setNs(function (prev) { return Object.assign({}, prev, p); }); }

  function loadFiles(path) {
    var p = String(path == null ? "" : path);
    patchFs({ phase: "loading", path: p, entries: [], message: "", pick: null, newFolder: false });
    apiRef.current.listDrive(p).then(function (d) {
      patchFs({ phase: "ready", path: d.path != null ? d.path : p, entries: d.entries || [], message: "" });
    }).catch(function (e) {
      patchFs({ phase: "error", message: portalErrorText(e) });
    });
  }

  function loadNotes() {
    patchNs({ phase: "loading", message: "" });
    apiRef.current.listNotes().then(function (d) {
      patchNs({ phase: "ready", role: d.role || "member", notes: d.notes || [], message: "", tone: "" });
    }).catch(function (e) {
      patchNs({ phase: "error", tone: "err", message: portalErrorText(e) });
    });
  }

  React.useEffect(function () {
    function onFv(e) {
      var who = e && e.detail ? e.detail.id : null;
      if (who !== idRef.current) setOpen(false);
    }
    function onKey(e) { if (e.key === "Escape" && openRef.current) setOpen(false); }
    function onDown(e) {
      if (!openRef.current) return;
      var t = e.target;
      if (t && t.closest && (t.closest(".zlk-fv") || t.closest(".zlk-nav"))) return;
      setOpen(false);
    }
    window.addEventListener("desk-fv", onFv);
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown, true);
    return function () {
      window.removeEventListener("desk-fv", onFv);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown, true);
    };
  }, []);

  React.useEffect(function () {
    if (!open) return;
    measureFv();
    notifyFv(idRef.current);
    loadFiles("");
    loadNotes();
  }, [open]);

  function toggle() { setOpen(function (v) { return !v; }); }
  function close() { setOpen(false); }

  function uploadFiles(list) {
    var files = [];
    if (list) for (var i = 0; i < list.length; i++) files.push(list[i]);
    var cursor = 0;
    function next() {
      if (cursor >= files.length) { loadFiles(pathRef.current); return; }
      var f = files[cursor++];
      if (f.size > MAX_UPLOAD) {
        patchFs({ message: "上传失败：" + f.name + " 超过 50MB" });
        next();
        return;
      }
      patchFs({ message: "上传中：" + f.name + " …" });
      apiRef.current.upload(pathRef.current, f).then(next).catch(function (e) {
        patchFs({ message: "上传失败：" + portalErrorText(e) });
      });
    }
    if (files.length) next();
  }

  function createFolder() {
    var name = folderRef.current ? String(folderRef.current.value || "").trim() : "";
    if (!name) { if (folderRef.current) folderRef.current.focus(); return; }
    apiRef.current.mkdir(fs.path, name).then(function () { loadFiles(fs.path); }).catch(function (e) {
      patchFs({ message: portalErrorText(e) });
    });
  }

  function removeEntry(full, isDir) {
    var label = (isDir ? "删除文件夹「" : "删除文件「") + full.split("/").pop() + "」？此操作不可恢复。";
    if (window.confirm && !window.confirm(label)) return;
    apiRef.current.rm(full).then(function () { loadFiles(fs.path); }).catch(function (e) {
      patchFs({ message: portalErrorText(e) });
    });
  }

  function openPicker(name) {
    patchFs({ pick: { name: name, path: "", entries: [] } });
    apiRef.current.listDrive("").then(function (d) {
      patchFs({ pick: { name: name, path: d.path != null ? d.path : "", entries: d.entries || [] } });
    }).catch(function (e) { patchFs({ message: portalErrorText(e), pick: null }); });
  }

  function pickerGo(path) {
    apiRef.current.listDrive(path).then(function (d) {
      setFs(function (prev) {
        var pick = prev.pick || { name: "" };
        return Object.assign({}, prev, { pick: { name: pick.name, path: d.path != null ? d.path : path, entries: d.entries || [] } });
      });
    }).catch(function (e) { patchFs({ message: portalErrorText(e) }); });
  }

  function moveHere() {
    if (!fs.pick) return;
    var from = joinPath(fs.path, fs.pick.name);
    apiRef.current.mv(from, fs.pick.path).then(function () { loadFiles(fs.path); }).catch(function (e) {
      patchFs({ message: portalErrorText(e) });
    });
  }

  function runSearch() {
    var q = qRef.current ? String(qRef.current.value || "").trim() : "";
    if (!q) { patchNs({ q: "", hits: [] }); return; }
    apiRef.current.searchNotes(q).then(function (d) {
      patchNs({ q: q, hits: (d && d.hits) || [], message: "" });
    }).catch(function (e) { patchNs({ message: portalErrorText(e) }); });
  }

  function saveNote() {
    var title = titleRef.current ? String(titleRef.current.value || "").trim() : "";
    var body = bodyRef.current ? String(bodyRef.current.value || "").trim() : "";
    if (!body) { if (bodyRef.current) bodyRef.current.focus(); return; }
    if (!title) title = body.split("\n")[0].slice(0, 36);
    apiRef.current.saveNote({ title: title, content: body }, deskLang()).then(function () {
      if (qRef.current) qRef.current.value = "";
      return apiRef.current.listNotes();
    }).then(function (d) {
      patchNs({ phase: "ready", role: (d && d.role) || "member", notes: (d && d.notes) || [], composing: false, q: "", hits: [], message: "已记下 ✓", tone: "ok" });
    }).catch(function (e) { patchNs({ message: portalErrorText(e), tone: "err" }); });
  }

  function toggleNote(name) {
    if (ns.expanded === name) { patchNs({ expanded: "", content: "" }); return; }
    patchNs({ expanded: name, content: "读取中…" });
    apiRef.current.readNote(name).then(function (d) {
      patchNs({ expanded: name, content: d && d.ok ? d.content : ((d && d.error) || "读取失败") });
    }).catch(function (e) { patchNs({ expanded: name, content: portalErrorText(e) }); });
  }

  function deleteNote(name) {
    if (window.confirm && !window.confirm("删除笔记：" + name + "？")) return;
    apiRef.current.removeNote(name, deskLang()).then(function () {
      patchNs({ expanded: "", content: "" });
      loadNotes();
    }).catch(function (e) { patchNs({ message: portalErrorText(e) }); });
  }

  var trigger = h("button", {
    type: "button", className: "zlk-nav" + (open ? " on" : ""), onClick: toggle, title: "资料库", "data-zlk-open": "1",
  }, h("span", { className: "ic" }, iconFolder(16)), wide ? h("span", { className: "lbl" }, "资料库") : null);
  if (!open) return h("div", { "data-zlk-root": "1" }, trigger);

  var bodyKids = [
    h("div", { key: "tabs", className: "zlk-tabs" },
      h("button", { type: "button", className: "zlk-tab" + (tab === "files" ? " on" : ""), "data-zlk-tab": "files", onClick: function () { setTab("files"); } }, "📁 文件"),
      h("button", { type: "button", className: "zlk-tab" + (tab === "notes" ? " on" : ""), "data-zlk-tab": "notes", onClick: function () { setTab("notes"); } }, "📝 笔记")
    ),
  ];

  if (tab === "files") {
    bodyKids.push(h("div", { key: "hint", className: "zlk-hint" }, "放原始文件；按项目或客户建文件夹，找起来最快"));
    var segs = String(fs.path || "").split("/").filter(Boolean);
    var bc = [h("span", { key: "root", className: "lk", onClick: function () { loadFiles(""); } }, "🏠 根目录")];
    var acc = "";
    segs.forEach(function (seg, i) {
      acc = acc ? acc + "/" + seg : seg;
      var here = acc;
      bc.push(h("span", { key: "s" + i }, " / "));
      bc.push(h("span", { key: "c" + i, className: "lk", onClick: function () { loadFiles(here); } }, seg));
    });
    bodyKids.push(h("div", { key: "bc", className: "zlk-bc" }, bc));
    bodyKids.push(h("div", { key: "bar", className: "zlk-row" },
      h("button", { type: "button", className: "zlk-btn gh", "data-zlk-mkdir": "1", onClick: function () { patchFs({ newFolder: !fs.newFolder, pick: null }); } }, "＋ 新建文件夹"),
      h("button", { type: "button", className: "zlk-btn", "data-zlk-upload": "1", onClick: function () { if (fileRef.current) fileRef.current.click(); } }, "⬆ 上传"),
      h("input", { ref: fileRef, className: "zlk-file", type: "file", multiple: true, "data-zlk-file-input": "1", onChange: function (e) { uploadFiles(e.target.files); e.target.value = ""; } })
    ));
    if (fs.newFolder) {
      bodyKids.push(h("div", { key: "nf", className: "zlk-row" },
        h("input", { ref: folderRef, className: "zlk-inp zlk-search", "data-zlk-folder-name": "1", placeholder: "文件夹名字，比如「客户A」「2026报价」", onKeyDown: function (e) { if (e.key === "Enter") createFolder(); } }),
        h("button", { type: "button", className: "zlk-btn", "data-zlk-mkdir-save": "1", onClick: createFolder }, "创建"),
        h("button", { type: "button", className: "zlk-btn gh", onClick: function () { patchFs({ newFolder: false }); } }, "取消")
      ));
    }
    bodyKids.push(h("div", {
      key: "drop",
      className: "zlk-drop" + (fs.drag ? " on" : ""),
      "data-zlk-drop": "1",
      onDragOver: function (e) { e.preventDefault(); if (!fs.drag) patchFs({ drag: true }); },
      onDragLeave: function () { patchFs({ drag: false }); },
      onDrop: function (e) { e.preventDefault(); patchFs({ drag: false }); uploadFiles(e.dataTransfer && e.dataTransfer.files); },
    }, h("b", null, "⬆ 拖文件到这里上传"), h("span", null, "上传到当前文件夹 · 单个 ≤50MB")));
    if (fs.message) bodyKids.push(h("div", { key: "msg", className: "zlk-msg" + (fs.phase === "error" || fs.message.indexOf("失败") >= 0 ? " err" : "") }, fs.message));
    if (fs.phase === "loading") bodyKids.push(h("div", { key: "ld", className: "zlk-hint" }, "读取中…"));
    if (fs.pick) {
      var pk = fs.pick;
      var psegs = String(pk.path || "").split("/").filter(Boolean);
      var pbc = [h("span", { key: "pr", className: "lk", onClick: function () { pickerGo(""); } }, "🏠 根目录")];
      var pacc = "";
      psegs.forEach(function (seg, i) {
        pacc = pacc ? pacc + "/" + seg : seg;
        var there = pacc;
        pbc.push(h("span", { key: "ps" + i }, " / "));
        pbc.push(h("span", { key: "pc" + i, className: "lk", onClick: function () { pickerGo(there); } }, seg));
      });
      var folders = (pk.entries || []).filter(function (en) { return en.dir; }).map(function (en) {
        var next = joinPath(pk.path, en.name);
        return h("div", { key: en.name, className: "zlk-it", onClick: function () { pickerGo(next); } },
          h("span", { className: "zlk-ico" }, "📁"),
          h("div", { className: "zlk-title link" }, en.name)
        );
      });
      bodyKids.push(h("div", { key: "pick", className: "zlk-pick" },
        h("div", { className: "zlk-hint" }, "把「" + pk.name + "」移动到："),
        h("div", { className: "zlk-bc" }, pbc),
        folders.length ? h("div", null, folders) : h("div", { className: "zlk-hint" }, "（没有子文件夹，可直接「移到这里」）"),
        h("div", { className: "zlk-row" },
          h("button", { type: "button", className: "zlk-btn", "data-zlk-move-here": "1", onClick: moveHere }, "移到这里"),
          h("button", { type: "button", className: "zlk-btn gh", onClick: function () { patchFs({ pick: null }); } }, "取消")
        )
      ));
    }
    var rootEmpty = !fs.path && !(fs.entries && fs.entries.length) && fs.phase !== "error";
    (fs.entries || []).forEach(function (en) {
      var full = joinPath(fs.path, en.name);
      var acts = [];
      if (en.dir) acts.push(h("button", { key: "o", type: "button", className: "zlk-mini", onClick: function () { loadFiles(full); } }, "打开"));
      else acts.push(h("a", { key: "d", className: "zlk-mini", href: apiRef.current.downloadUrl(full) }, "下载"));
      acts.push(h("button", { key: "m", type: "button", className: "zlk-mini", "data-zlk-move": en.name, onClick: function () { openPicker(en.name); } }, "移动到…"));
      acts.push(h("button", { key: "x", type: "button", className: "zlk-mini", "data-zlk-del-file": en.name, onClick: function () { removeEntry(full, en.dir); } }, "删除"));
      bodyKids.push(h("div", { key: "f-" + en.name, className: "zlk-it", "data-zlk-file": en.name },
        h("span", { className: "zlk-ico" }, en.dir ? "📁" : "📄"),
        h("div", { className: "zlk-gr" },
          h("div", { className: "zlk-top" },
            h("div", { className: "zlk-title" + (en.dir ? " link" : ""), onClick: en.dir ? function () { loadFiles(full); } : null }, en.name),
            h("div", { className: "zlk-acts row" }, acts)
          ),
          h("div", { className: "zlk-meta" }, (en.dir ? "文件夹" : formatSize(en.size)) + (en.mtime ? " · " + formatWhen(en.mtime) : ""))
        )
      ));
    });
    if (rootEmpty) {
      bodyKids.push(h("div", { key: "ea", className: "zlk-empty", onClick: function () { if (fileRef.current) fileRef.current.click(); } },
        h("b", null, "① 建个文件夹，把文件传进来"), h("span", null, "比如「客户A」「2026报价」—— 拖进去就行")));
      bodyKids.push(h("div", { key: "eb", className: "zlk-empty", onClick: function () { setTab("notes"); patchNs({ composing: true }); } },
        h("b", null, "② 记第一条笔记"), h("span", null, "今天有什么结论？写一句话也算")));
    }
  } else {
    bodyKids.push(h("div", { key: "hint", className: "zlk-hint" }, "记结论和经验，搜一下就能找到 —— AI 助理也能直接引用"));
    bodyKids.push(h("div", { key: "search", className: "zlk-row" },
      h("input", { ref: qRef, className: "zlk-inp zlk-search", "data-zlk-search": "1", placeholder: "搜笔记，比如「印尼」「定价」…", onKeyDown: function (e) { if (e.key === "Enter") runSearch(); } }),
      h("button", { type: "button", className: "zlk-btn gh", "data-zlk-search-btn": "1", onClick: runSearch }, "搜索")
    ));
    bodyKids.push(h("div", { key: "compose", className: "zlk-row" },
      h("button", { type: "button", className: "zlk-btn", "data-zlk-compose": "1", onClick: function () { patchNs({ composing: !ns.composing }); } }, "＋ 记一条")
    ));
    if (ns.composing) {
      bodyKids.push(h("div", { key: "form", className: "zlk-form" },
        h("input", { ref: titleRef, className: "zlk-inp", "data-zlk-title": "1", placeholder: "标题（不填就用第一行）" }),
        h("textarea", { ref: bodyRef, className: "zlk-inp zlk-ta", "data-zlk-body": "1", placeholder: "想到什么写什么…… 一句话也算" }),
        h("div", { className: "zlk-row" },
          h("button", { type: "button", className: "zlk-btn", "data-zlk-save": "1", onClick: saveNote }, "保存 ✓"),
          h("button", { type: "button", className: "zlk-btn gh", onClick: function () { patchNs({ composing: false }); } }, "取消")
        )
      ));
    }
    if (ns.message) bodyKids.push(h("div", { key: "nm", className: "zlk-msg" + (ns.tone === "err" || ns.phase === "error" ? " err" : " ok") }, ns.message));
    if (ns.phase === "loading") bodyKids.push(h("div", { key: "ld", className: "zlk-hint" }, "读取中…"));
    if (ns.q) {
      bodyKids.push(h("div", { key: "hc", className: "zlk-hint" }, "命中 " + ns.hits.length));
      if (!ns.hits.length) bodyKids.push(h("div", { key: "miss", className: "zlk-empty" }, h("b", null, "没有命中，换个短点的词试试")));
      ns.hits.forEach(function (hit, i) {
        bodyKids.push(h("div", { key: "h" + i, className: "zlk-it" },
          h("span", { className: "zlk-ico" }, "🔎"),
          h("div", { className: "zlk-gr" },
            h("div", { className: "zlk-meta" }, hit.file + " : " + hit.line),
            h("div", { className: "zlk-body" }, hit.text)
          )
        ));
      });
      bodyKids.push(h("div", { key: "back", className: "zlk-row" },
        h("button", { type: "button", className: "zlk-btn gh", "data-zlk-back-list": "1", onClick: function () { if (qRef.current) qRef.current.value = ""; patchNs({ q: "", hits: [] }); } }, "返回笔记列表")
      ));
    } else if (ns.phase === "ready") {
      if (!ns.notes.length) {
        bodyKids.push(h("div", { key: "empty", className: "zlk-empty", onClick: function () { patchNs({ composing: true }); } },
          h("b", null, "还没有笔记 —— 点「＋ 记一条」写第一句"),
          h("span", null, "结论、口径、经验，一句话也算")
        ));
      }
      ns.notes.forEach(function (note) {
        var shown = ns.expanded === note.name;
        var acts = [h("button", { key: "v", type: "button", className: "zlk-mini", "data-zlk-view": note.name, onClick: function () { toggleNote(note.name); } }, shown ? "收起" : "查看")];
        if (canDeleteNote(ns.role)) {
          acts.push(h("button", { key: "x", type: "button", className: "zlk-mini", "data-zlk-del": note.name, onClick: function () { deleteNote(note.name); } }, "删除"));
        }
        bodyKids.push(h("div", { key: note.name, className: "zlk-it", "data-zlk-note": note.name },
          h("span", { className: "zlk-ico" }, "📝"),
          h("div", { className: "zlk-gr" },
            h("div", { className: "zlk-top" },
              h("div", { className: "zlk-title" }, note.title || note.name),
              h("div", { className: "zlk-acts" }, acts)
            ),
            h("div", { className: "zlk-meta" }, formatWhen(note.mtime) + (note.author ? " · " + note.author : "")),
            shown ? h("div", { className: "zlk-body" }, ns.content) : null
          )
        ));
      });
    }
  }

  return h("div", { "data-zlk-root": "1" },
    trigger,
    h("section", { className: "zlk-fv", "data-zlk-panel": "1" },
      h("header", { className: "zlk-hd" },
        h("span", { className: "zlk-mark" }, iconFolder(22)),
        h("div", { className: "zlk-hd-text" },
          h("div", { className: "zlk-t1" }, "资料库"),
          h("div", { className: "zlk-t2" }, "文件 + 笔记 · 放进来 = 全员可见")
        ),
        h("button", { type: "button", className: "zlk-back", "data-zlk-back": "1", onClick: close }, "← 返回对话")
      ),
      h("div", { className: "zlk-bd" }, bodyKids)
    )
  );
}

function apply(ctx) {
  ctx.slots.inject("sidebar.footer.action", function () {
    return ctx.slots.register(
      {
        name: "sidebar.footer.action",
        id: "ziliaoku",
        order: 91,
        label: function () { return "资料库"; },
      },
      LibraryPanel
    );
  });
}

ensureCss();
