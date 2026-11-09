(function () {
  var notes = [];
  var role = "admin";
  var drive = { "": [] };
  window.__zlkCalls = [];

  function json(status, body) {
    return {
      ok: status >= 200 && status < 300,
      status: status,
      text: function () { return Promise.resolve(JSON.stringify(body)); },
    };
  }

  function readJson(body) {
    if (!body) return Promise.resolve({});
    if (typeof body === "string") return Promise.resolve(JSON.parse(body));
    if (typeof body.text === "function") return body.text().then(function (t) { return t ? JSON.parse(t) : {}; });
    return Promise.resolve({});
  }

  window.fetch = function (input, init) {
    var url = new URL(String(input), "http://portal.local");
    var method = (init && init.method) || "GET";
    window.__zlkCalls.push(method + " " + url.pathname);
    var path = url.pathname;
    if (method === "GET" && path === "/plugins/anywork-library-plugin/kb/list") {
      return Promise.resolve(json(200, {
        role: role,
        notes: notes.map(function (n) { return { name: n.name, title: n.title, author: n.author, mtime: n.mtime, size: n.size }; }),
      }));
    }
    if (method === "GET" && path === "/plugins/anywork-library-plugin/kb/search") {
      var q = (url.searchParams.get("q") || "").toLowerCase();
      var hits = [];
      notes.forEach(function (n) {
        if ((n.title + "\n" + n.content).toLowerCase().indexOf(q) >= 0) {
          hits.push({ file: "notes/" + n.name, line: 2, text: n.title });
        }
      });
      return Promise.resolve(json(200, { q: q, hits: hits, truncated: false }));
    }
    if (method === "GET" && path === "/plugins/anywork-library-plugin/kb/note") {
      var name = url.searchParams.get("name");
      var found = notes.filter(function (n) { return n.name === name; })[0];
      if (!found) return Promise.resolve(json(404, { error: "笔记不存在" }));
      return Promise.resolve(json(200, { ok: true, name: found.name, content: found.content }));
    }
    if (method === "POST" && path === "/plugins/anywork-library-plugin/kb/save") {
      return readJson(init && init.body).then(function (payload) {
        if (!String(payload.content || "").trim()) return json(400, { error: "内容不能为空" });
        var title = String(payload.title || "").trim() || String(payload.content).split("\n")[0].slice(0, 36);
        var item = { name: "note-" + notes.length + ".md", title: title, author: "local", mtime: "2026-11-01 12:00", size: String(payload.content).length, content: payload.content };
        notes = [item].concat(notes);
        return json(200, { ok: true, name: item.name });
      });
    }
    if (method === "POST" && path === "/plugins/anywork-library-plugin/kb/rm") {
      return readJson(init && init.body).then(function (payload) {
        if (role !== "admin") return json(403, { error: "admin only" });
        notes = notes.filter(function (n) { return n.name !== payload.name; });
        return json(200, { ok: true });
      });
    }
    if (method === "GET" && path === "/plugins/anywork-library-plugin/drive/list") {
      var dir = url.searchParams.get("path") || "";
      return Promise.resolve(json(200, { path: dir, entries: (drive[dir] || []).slice() }));
    }
    if (method === "POST" && path === "/plugins/anywork-library-plugin/drive/mkdir") {
      return readJson(init && init.body).then(function (payload) {
        var dir = payload.path || "";
        var folder = { name: payload.name, dir: true, size: 0, mtime: "2026-11-01T12:00:00.000Z" };
        drive[dir] = drive[dir] || [];
        drive[dir].push(folder);
        var child = dir ? dir + "/" + payload.name : payload.name;
        drive[child] = drive[child] || [];
        return json(200, { ok: true, path: child });
      });
    }
    if (method === "POST" && path === "/plugins/anywork-library-plugin/drive/upload") {
      var upDir = url.searchParams.get("path") || "";
      var upName = url.searchParams.get("name") || "file";
      drive[upDir] = drive[upDir] || [];
      drive[upDir].push({ name: upName, dir: false, size: 12, mtime: "2026-11-01T12:00:00.000Z" });
      return Promise.resolve(json(200, { ok: true, path: upDir ? upDir + "/" + upName : upName, size: 12 }));
    }
    if (method === "POST" && path === "/plugins/anywork-library-plugin/drive/rm") {
      return readJson(init && init.body).then(function (payload) {
        var rel = String(payload.path || "");
        var slash = rel.lastIndexOf("/");
        var parent = slash >= 0 ? rel.slice(0, slash) : "";
        var base = slash >= 0 ? rel.slice(slash + 1) : rel;
        drive[parent] = (drive[parent] || []).filter(function (en) { return en.name !== base; });
        return json(200, { ok: true });
      });
    }
    if (method === "POST" && path === "/plugins/anywork-library-plugin/drive/mv") {
      return readJson(init && init.body).then(function () { return json(200, { ok: true, path: "" }); });
    }
    return Promise.resolve(json(404, { error: "not found " + path }));
  };
})();
