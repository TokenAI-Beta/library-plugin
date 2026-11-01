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
.zlk-t1 { font-size:18px; font-weight:700; line-height:1.3; letter-spacing:.2px; }
.zlk-t2 { margin-top:3px; font-size:12px; line-height:1.45; color:#8b919a; }
.zlk-back { margin-left:auto; flex:0 0 auto; height:34px; padding:0 14px; border:1px solid #d5d5d5; border-radius:999px; background:#fff; color:#3a3a3a; font:500 12.5px/1 inherit; cursor:pointer; white-space:nowrap; }
.zlk-back:hover { background:#f6f6f6; }
.zlk-bd { padding:14px 16px 72px; }
.zlk-stub { margin:0 2px 12px; font-size:12px; line-height:1.5; color:#9aa0a6; }
.zlk-tabs { display:flex; gap:4px; padding:4px; margin:0 0 14px; background:#fff; border-radius:12px; box-shadow:0 1px 2px rgba(16,24,40,.04); }
.zlk-tab { flex:1; display:flex; align-items:center; justify-content:center; gap:6px; height:36px; border:0; border-radius:9px; background:transparent; color:#6b7280; font:500 14px/1 inherit; cursor:pointer; }
.zlk-tab.on { background:#fff; color:#1c1e21; font-weight:650; box-shadow:0 1px 3px rgba(16,24,40,.14); }
.zlk-hint { margin:0 2px 12px; font-size:13px; line-height:1.65; color:#8b9098; }
.zlk-row { display:flex; gap:8px; align-items:center; }
.zlk-row + .zlk-row, .zlk-hint + .zlk-row, .zlk-row + .zlk-form, .zlk-form + .zlk-msg, .zlk-list { margin-top:12px; }
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
.zlk-ico { width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center; background:#fff; border:1px solid #ececec; color:#6b7280; flex:0 0 auto; }
.zlk-gr { flex:1; min-width:0; }
.zlk-top { display:flex; align-items:flex-start; gap:10px; }
.zlk-title { flex:1; min-width:0; font-size:15px; font-weight:650; line-height:1.45; color:#222; }
.zlk-meta { margin-top:6px; font-size:13px; line-height:1.4; color:#9aa0a6; }
.zlk-acts { display:flex; flex-direction:column; gap:8px; flex:0 0 auto; }
.zlk-mini { min-width:64px; height:32px; padding:0 12px; border:1px solid #d8d8d8; border-radius:8px; background:#fff; color:#3a3a3a; font:400 13px/1 inherit; cursor:pointer; }
.zlk-mini:hover { background:#f7f7f7; }
.zlk-body { margin-top:10px; padding:10px 12px; border-radius:10px; background:#fff; border:1px solid #ececec; font-size:13.5px; line-height:1.65; white-space:pre-wrap; word-break:break-word; color:#333; }
.zlk-empty { margin-top:8px; padding:18px 14px; border:1.5px dashed #cfd3d8; border-radius:12px; background:#f7f8fa; color:#4f7cf7; }
.zlk-empty b { display:block; font-size:14px; }
.zlk-empty span { display:block; margin-top:4px; font-size:12px; color:#8b9098; font-weight:400; }
.zlk-file { position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0 0 0 0); }
`;

function ensureCss() {
  if (typeof document === "undefined") return;
  if (document.getElementById("library-plugin-css")) return;
  var st = document.createElement("style");
  st.id = "library-plugin-css";
  st.textContent = ZLK_CSS;
  (document.head || document.documentElement).appendChild(st);
}

function svg(size) {
  var props = {
    viewBox: "0 0 24 24",
    width: size,
    height: size,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
  };
  var args = ["svg", props];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  return h.apply(null, args);
}

function iconFolder(size) {
  return svg(size, h("path", { d: "M3.5 7.5A1.5 1.5 0 0 1 5 6h4l2 2h8a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 19 19H5a1.5 1.5 0 0 1-1.5-1.5v-10z" }));
}

function iconNote(size) {
  return svg(size,
    h("path", { d: "M7 3.5h7.2L19 8.2V20.5H7z" }),
    h("path", { d: "M14 3.8V8.5h5" }),
    h("path", { d: "M9.2 13h6.2M9.2 16.4h4" })
  );
}

function h(type, props) {
  var args = [type, props];
  for (var i = 2; i < arguments.length; i++) args.push(arguments[i]);
  return React.createElement.apply(React, args);
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

function formatSize(n) {
  n = Number(n) || 0;
  if (n < 1024) return n + " B";
  if (n < 1048576) return (n / 1024).toFixed(n < 10240 ? 1 : 0) + " KB";
  return (n / 1048576).toFixed(1) + " MB";
}

function isTextFile(file) {
  if (!file) return false;
  if (file.type && String(file.type).indexOf("text/") === 0) return true;
  return /\.(md|txt|json|csv|log|yml|yaml)$/i.test(file.name || "");
}

function LibraryPanel(props) {
  var wide = !!(props && props.wide);
  var openPair = React.useState(false);
  var open = openPair[0];
  var setOpen = openPair[1];
  var tabPair = React.useState("notes");
  var tab = tabPair[0];
  var setTab = tabPair[1];
  var dataPair = React.useState(null);
  var data = dataPair[0];
  var setData = dataPair[1];
  var qPair = React.useState("");
  var q = qPair[0];
  var setQ = qPair[1];
  var composingPair = React.useState(false);
  var composing = composingPair[0];
  var setComposing = composingPair[1];
  var openNotePair = React.useState("");
  var openNote = openNotePair[0];
  var setOpenNote = openNotePair[1];
  var openFilePair = React.useState("");
  var openFile = openFilePair[0];
  var setOpenFile = openFilePair[1];
  var msgPair = React.useState(null);
  var msg = msgPair[0];
  var setMsg = msgPair[1];
  var storeRef = React.useRef(null);
  var idRef = React.useRef("");
  var fileRef = React.useRef(null);
  var qRef = React.useRef(null);
  var titleRef = React.useRef(null);
  var bodyRef = React.useRef(null);
  var openRef = React.useRef(false);
  if (!idRef.current) idRef.current = "ziliaoku-" + (++ZLK_SEQ);
  if (!storeRef.current) storeRef.current = createLibraryStore(browserStorage());
  openRef.current = open;

  React.useEffect(function () {
    function onFv(e) {
      var who = e && e.detail ? e.detail.id : null;
      if (who !== idRef.current) setOpen(false);
    }
    function onKey(e) {
      if (e.key === "Escape" && openRef.current) setOpen(false);
    }
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
  }, [open]);

  function toggle() {
    if (!open) setData(storeRef.current.load());
    setOpen(function (v) { return !v; });
  }
  function close() { setOpen(false); }

  function showError(e) {
    setMsg({ kind: "err", text: (e && e.message) || "没有写成" });
  }

  function runSearch() {
    var value = qRef.current ? String(qRef.current.value || "").trim() : "";
    setQ(value);
  }

  function onSave() {
    var noteTitle = titleRef.current ? titleRef.current.value : "";
    var noteBody = bodyRef.current ? bodyRef.current.value : "";
    try {
      var next = storeRef.current.addNote({ title: noteTitle, body: noteBody, author: "local" });
      setData(next);
      setComposing(false);
      setQ("");
      if (qRef.current) qRef.current.value = "";
      setMsg({ kind: "ok", text: "已记下" });
    } catch (e) { showError(e); }
  }

  function onDeleteNote(id) {
    if (typeof window !== "undefined" && window.confirm && !window.confirm("删除这条笔记？")) return;
    setData(storeRef.current.removeNote(id));
    if (openNote === id) setOpenNote("");
  }

  function onDeleteFile(id) {
    if (typeof window !== "undefined" && window.confirm && !window.confirm("删除这个文件？")) return;
    setData(storeRef.current.removeFile(id));
    if (openFile === id) setOpenFile("");
  }

  function onPickFile(file) {
    if (!file) return;
    function commit(text) {
      try {
        var next = storeRef.current.addFile({
          name: file.name,
          size: file.size,
          type: file.type || "",
          text: text,
          author: "local",
        });
        setData(next);
        setMsg({ kind: "ok", text: "已放入本机暂存" });
      } catch (e) { showError(e); }
    }
    if (file.size > 200000 || !isTextFile(file)) {
      commit(null);
      return;
    }
    var reader = new FileReader();
    reader.onload = function () { commit(String(reader.result || "")); };
    reader.onerror = function () { setMsg({ kind: "err", text: "读取文件失败" }); };
    reader.readAsText(file);
  }

  var trigger = h("button", {
    type: "button",
    className: "zlk-nav" + (open ? " on" : ""),
    onClick: toggle,
    title: "资料库",
    "data-zlk-open": "1",
  }, h("span", { className: "ic" }, iconFolder(16)), wide ? h("span", { className: "lbl" }, "资料库") : null);

  if (!open) return h("div", { "data-zlk-root": "1" }, trigger);

  var state = data || { notes: [], files: [], backend: "local-stub" };
  var notes = searchNotes(state.notes, q);
  var bodyKids = [
    h("div", { key: "stub", className: "zlk-stub" }, "本机暂存 · 尚未接入团队后端，只有这个浏览器看得到"),
    h("div", { key: "tabs", className: "zlk-tabs" },
      h("button", {
        type: "button",
        className: "zlk-tab" + (tab === "files" ? " on" : ""),
        "data-zlk-tab": "files",
        onClick: function () { setTab("files"); setMsg(null); },
      }, iconFolder(15), h("span", null, "文件")),
      h("button", {
        type: "button",
        className: "zlk-tab" + (tab === "notes" ? " on" : ""),
        "data-zlk-tab": "notes",
        onClick: function () { setTab("notes"); setMsg(null); },
      }, iconNote(15), h("span", null, "笔记"))
    ),
  ];

  if (tab === "notes") {
    bodyKids.push(h("div", { key: "hint", className: "zlk-hint" }, "记结论和经验，搜一下就能找到 —— AI 助理也能直接引用"));
    bodyKids.push(h("div", { key: "search", className: "zlk-row" },
      h("input", {
        ref: qRef,
        className: "zlk-inp zlk-search",
        "data-zlk-search": "1",
        placeholder: "搜笔记，比如「印尼」「定价」…",
        onKeyDown: function (e) { if (e.key === "Enter") runSearch(); },
      }),
      h("button", {
        type: "button",
        className: "zlk-btn gh",
        "data-zlk-search-btn": "1",
        onClick: runSearch,
      }, "搜索")
    ));
    bodyKids.push(h("div", { key: "compose", className: "zlk-row" },
      h("button", {
        type: "button",
        className: "zlk-btn",
        "data-zlk-compose": "1",
        onClick: function () { setComposing(function (v) { return !v; }); setMsg(null); },
      }, "+ 记一条")
    ));
    if (composing) {
      bodyKids.push(h("div", { key: "form", className: "zlk-form" },
        h("input", {
          ref: titleRef,
          className: "zlk-inp",
          "data-zlk-title": "1",
          placeholder: "标题（不填就用第一行）",
        }),
        h("textarea", {
          ref: bodyRef,
          className: "zlk-inp zlk-ta",
          "data-zlk-body": "1",
          placeholder: "想到什么写什么…… 一句话也算",
        }),
        h("div", { className: "zlk-row" },
          h("button", { type: "button", className: "zlk-btn", "data-zlk-save": "1", onClick: onSave }, "保存"),
          h("button", { type: "button", className: "zlk-btn gh", onClick: function () { setComposing(false); } }, "取消")
        )
      ));
    }
    if (msg) bodyKids.push(h("div", { key: "msg", className: "zlk-msg " + (msg.kind || "") }, msg.text));
    if (state.saveError) bodyKids.push(h("div", { key: "se", className: "zlk-msg err" }, state.saveError));
    if (q) {
      bodyKids.push(h("div", { key: "hits", className: "zlk-hint" }, "命中 " + notes.length + " 条"));
    }
    if (!notes.length) {
      bodyKids.push(h("div", { key: "empty", className: "zlk-empty" },
        h("b", null, q ? "没有命中" : "还没有笔记"),
        h("span", null, q ? "换个短一点的词试试" : "点「+ 记一条」写第一句")
      ));
    } else {
      bodyKids.push(h("div", { key: "list", className: "zlk-list" }, notes.map(function (note) {
        var shown = openNote === note.id;
        return h("div", { key: note.id, className: "zlk-it", "data-zlk-note": note.id },
          h("span", { className: "zlk-ico" }, iconNote(18)),
          h("div", { className: "zlk-gr" },
            h("div", { className: "zlk-top" },
              h("div", { className: "zlk-title" }, note.title),
              h("div", { className: "zlk-acts" },
                h("button", {
                  type: "button",
                  className: "zlk-mini",
                  "data-zlk-view": note.id,
                  onClick: function () { setOpenNote(shown ? "" : note.id); },
                }, shown ? "收起" : "查看"),
                h("button", {
                  type: "button",
                  className: "zlk-mini",
                  "data-zlk-del": note.id,
                  onClick: function () { onDeleteNote(note.id); },
                }, "删除")
              )
            ),
            h("div", { className: "zlk-meta" }, formatMtime(note.mtime) + (note.author ? " · " + note.author : "")),
            shown ? h("div", { className: "zlk-body" }, note.body) : null
          )
        );
      })));
    }
  } else {
    bodyKids.push(h("div", { key: "hint", className: "zlk-hint" }, "放原始文件。文本会留一份在本机，方便查看。"));
    bodyKids.push(h("div", { key: "up", className: "zlk-row" },
      h("button", {
        type: "button",
        className: "zlk-btn",
        "data-zlk-upload": "1",
        onClick: function () { if (fileRef.current) fileRef.current.click(); },
      }, "上传"),
      h("input", {
        ref: fileRef,
        className: "zlk-file",
        type: "file",
        "data-zlk-file-input": "1",
        onChange: function (e) {
          var f = e.target.files && e.target.files[0];
          onPickFile(f);
          e.target.value = "";
        },
      })
    ));
    if (msg) bodyKids.push(h("div", { key: "msg", className: "zlk-msg " + (msg.kind || "") }, msg.text));
    var files = state.files || [];
    if (!files.length) {
      bodyKids.push(h("div", { key: "empty", className: "zlk-empty" },
        h("b", null, "还没有文件"),
        h("span", null, "点「上传」放进本机暂存")
      ));
    } else {
      bodyKids.push(h("div", { key: "list", className: "zlk-list" }, files.map(function (file) {
        var shown = openFile === file.id;
        var preview = file.text
          ? file.text
          : "本机暂存只留了文件名和大小，没有保存这份内容。";
        if (file.truncated) preview += "\n（正文已截断）";
        return h("div", { key: file.id, className: "zlk-it", "data-zlk-file": file.id },
          h("span", { className: "zlk-ico" }, iconFolder(18)),
          h("div", { className: "zlk-gr" },
            h("div", { className: "zlk-top" },
              h("div", { className: "zlk-title" }, file.name),
              h("div", { className: "zlk-acts" },
                h("button", {
                  type: "button",
                  className: "zlk-mini",
                  "data-zlk-view-file": file.id,
                  onClick: function () { setOpenFile(shown ? "" : file.id); },
                }, shown ? "收起" : "查看"),
                h("button", {
                  type: "button",
                  className: "zlk-mini",
                  "data-zlk-del-file": file.id,
                  onClick: function () { onDeleteFile(file.id); },
                }, "删除")
              )
            ),
            h("div", { className: "zlk-meta" }, formatSize(file.size) + " · " + formatMtime(file.mtime) + (file.author ? " · " + file.author : "")),
            shown ? h("div", { className: "zlk-body" }, preview) : null
          )
        );
      })));
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
