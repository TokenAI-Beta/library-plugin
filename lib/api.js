// Client for the library shelf. Files and notes stay on this plugin.

export const MAX_UPLOAD = 50 * 1024 * 1024;

export function canDeleteNote(role) {
  return role === "admin";
}

export function portalErrorText(err, lang) {
  var msg = err && err.message ? String(err.message) : String(err || "");
  var status = err && err.status;
  var text = msg || "读取失败";
  if (status === 404) text = "资料库还没挂到这个工作台。装上插件后重启一次再打开。";
  else if (status === 401 || /login required/i.test(msg)) text = "读不到资料库。请先登录这个工作台再试。";
  if (lang === "en") {
    var en = {
      "资料库还没挂到这个工作台。装上插件后重启一次再打开。": "The library isn't on this workbench yet. Install the plugin, restart, then open it again.",
      "读不到资料库。请先登录这个工作台再试。": "Can't read the library. Sign in to this workbench and try again.",
      "读取失败": "Couldn't load it",
    };
    return en[text] || text;
  }
  return text;
}

function readBody(response) {
  return response.text().then(function (text) {
    var data = null;
    if (text) {
      try { data = JSON.parse(text); } catch (e) { data = null; }
    }
    if (!response.ok) {
      var err = new Error((data && data.error) || text || ("HTTP " + response.status));
      err.status = response.status;
      throw err;
    }
    return data == null ? {} : data;
  });
}

export function createPortalApi(getFetch) {
  function doFetch(url, options) {
    var fetchImpl = typeof getFetch === "function" ? getFetch() : getFetch;
    if (typeof fetchImpl !== "function") {
      var err = new Error("fetch 不可用");
      err.status = 0;
      return Promise.reject(err);
    }
    var opts = options || {};
    opts.credentials = opts.credentials || "same-origin";
    return Promise.resolve(fetchImpl(url, opts)).then(readBody);
  }

  return {
    listDrive: function (path) {
      return doFetch("/plugins/anywork-library-plugin/drive/list?path=" + encodeURIComponent(path || ""), {
        headers: { accept: "application/json" },
      });
    },
    upload: function (path, file) {
      return doFetch(
        "/plugins/anywork-library-plugin/drive/upload?path=" + encodeURIComponent(path || "") + "&name=" + encodeURIComponent(file.name),
        { method: "POST", body: file, headers: { accept: "application/json" } }
      );
    },
    mkdir: function (path, name) {
      return doFetch("/plugins/anywork-library-plugin/drive/mkdir", {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({ path: path || "", name: name }),
      });
    },
    rm: function (path) {
      return doFetch("/plugins/anywork-library-plugin/drive/rm", {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({ path: path }),
      });
    },
    mv: function (from, to) {
      return doFetch("/plugins/anywork-library-plugin/drive/mv", {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({ from: from, to: to || "" }),
      });
    },
    downloadUrl: function (path) {
      return "/plugins/anywork-library-plugin/drive/download?path=" + encodeURIComponent(path);
    },
    listNotes: function () {
      return doFetch("/plugins/anywork-library-plugin/kb/list", { headers: { accept: "application/json" } });
    },
    searchNotes: function (q) {
      return doFetch("/plugins/anywork-library-plugin/kb/search?q=" + encodeURIComponent(q), { headers: { accept: "application/json" } });
    },
    readNote: function (name) {
      return doFetch("/plugins/anywork-library-plugin/kb/note?name=" + encodeURIComponent(name), { headers: { accept: "application/json" } });
    },
    saveNote: function (input, lang) {
      return doFetch("/plugins/anywork-library-plugin/kb/save?lang=" + encodeURIComponent(lang || "zh"), {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({
          title: input.title || "",
          tags: input.tags || "",
          content: input.content || "",
        }),
      });
    },
    checkUpdate: function () {
      return doFetch("/plugins/anywork-library-plugin/update", { headers: { accept: "application/json" } });
    },
    installUpdate: function (version) {
      return doFetch("/plugins/anywork-library-plugin/update", {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({ version: version }),
      });
    },
    removeNote: function (name, lang) {
      return doFetch("/plugins/anywork-library-plugin/kb/rm?lang=" + encodeURIComponent(lang || "zh"), {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({ name: name }),
      });
    },
  };
}
