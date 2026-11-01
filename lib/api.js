// Portal client for 资料库. Drive and notes stay on the Anywork host.

export const MAX_UPLOAD = 50 * 1024 * 1024;

export function canDeleteNote(role) {
  return role === "admin";
}

export function portalErrorText(err) {
  var msg = err && err.message ? String(err.message) : String(err || "");
  var status = err && err.status;
  if (status === 401 || /login required/i.test(msg)) {
    return "读不到资料库（需要门户登录）。请从门户地址打开工作台后再试。";
  }
  return msg || "读取失败";
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
      return doFetch("/portal/api/drive/list?path=" + encodeURIComponent(path || ""), {
        headers: { accept: "application/json" },
      });
    },
    upload: function (path, file) {
      return doFetch(
        "/portal/api/drive/upload?path=" + encodeURIComponent(path || "") + "&name=" + encodeURIComponent(file.name),
        { method: "POST", body: file, headers: { accept: "application/json" } }
      );
    },
    mkdir: function (path, name) {
      return doFetch("/portal/api/drive/mkdir", {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({ path: path || "", name: name }),
      });
    },
    rm: function (path) {
      return doFetch("/portal/api/drive/rm", {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({ path: path }),
      });
    },
    mv: function (from, to) {
      return doFetch("/portal/api/drive/mv", {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({ from: from, to: to || "" }),
      });
    },
    downloadUrl: function (path) {
      return "/portal/api/drive/download?path=" + encodeURIComponent(path);
    },
    listNotes: function () {
      return doFetch("/portal/api/kb/list", { headers: { accept: "application/json" } });
    },
    searchNotes: function (q) {
      return doFetch("/portal/api/kb/search?q=" + encodeURIComponent(q), { headers: { accept: "application/json" } });
    },
    readNote: function (name) {
      return doFetch("/portal/api/kb/note?name=" + encodeURIComponent(name), { headers: { accept: "application/json" } });
    },
    saveNote: function (input, lang) {
      return doFetch("/portal/api/kb/save?lang=" + encodeURIComponent(lang || "zh"), {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({
          title: input.title || "",
          tags: input.tags || "",
          content: input.content || "",
        }),
      });
    },
    removeNote: function (name, lang) {
      return doFetch("/portal/api/kb/rm?lang=" + encodeURIComponent(lang || "zh"), {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({ name: name }),
      });
    },
  };
}
