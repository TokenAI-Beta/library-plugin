(function () {
  var params = new URLSearchParams(location.search);
  var auto = params.get("auto") === "1";
  var shot = params.get("shot") || "";
  var result = document.getElementById("result");
  window.confirm = function () { return true; };

  function fail(msg) {
    result.textContent = "FAIL " + msg;
    document.title = "FAIL";
  }
  function pass(msg) {
    result.textContent = msg || "PASS";
    document.title = msg && msg.indexOf("SHOT") === 0 ? "SHOT" : "PASS";
  }

  var mod = window.__zlkMod;
  if (!mod || !window.React || !window.ReactDOM) {
    fail("module missing");
    return;
  }
  var registered = null;
  mod.apply({
    slots: {
      inject: function (_name, fn) { return fn(); },
      register: function (meta, Comp) {
        registered = { meta: meta, Comp: Comp };
        return function () {};
      },
    },
  });
  if (!registered || registered.meta.id !== "ziliaoku") {
    fail("slot id " + (registered && registered.meta && registered.meta.id));
    return;
  }
  if (!Array.isArray(mod.inject) || mod.inject.indexOf("slots") < 0) {
    fail("inject");
    return;
  }

  var root = window.ReactDOM.createRoot(document.getElementById("app"));
  root.render(window.React.createElement(registered.Comp, { wide: true }));

  function q(sel) { return document.querySelector(sel); }
  function text() { return document.body.innerText; }
  function flush() { return new Promise(function (resolve) { setTimeout(resolve, 30); }); }
  function setVal(el, value) {
    var proto = el.tagName === "TEXTAREA" ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, "value").set.call(el, value);
    el.dispatchEvent(new Event("input", { bubbles: true }));
  }
  async function clickSel(sel) {
    var el = q(sel);
    if (!el) throw new Error("missing " + sel);
    el.click();
    await flush();
  }

  setTimeout(function () {
    (async function () {
      try {
        await clickSel("[data-zlk-open]");
        if (shot) {
          if (shot === "files") await clickSel("[data-zlk-tab='files']");
          if (shot === "compose") await clickSel("[data-zlk-compose]");
          var hide = document.createElement("style");
          hide.textContent = ".zlk-nav{display:none!important}#result{display:none!important}";
          document.head.appendChild(hide);
          pass("SHOT");
          return;
        }
        if (!auto) {
          result.textContent = "OPEN";
          return;
        }
        var body = text();
        if (body.indexOf("资料库") < 0) throw new Error("title");
        if (body.indexOf("文件 + 笔记 · 放进来 = 全员可见") < 0) throw new Error("subtitle");
        if (body.indexOf("← 返回对话") < 0) throw new Error("back");
        if (body.indexOf("记结论和经验，搜一下就能找到 —— AI 助理也能直接引用") < 0) throw new Error("hint");
        if (body.indexOf("本机暂存") < 0) throw new Error("stub");
        if (q("[data-zlk-search]").getAttribute("placeholder").indexOf("印尼") < 0) throw new Error("placeholder");
        if (!q("[data-zlk-tab='notes']").classList.contains("on")) throw new Error("notes tab");
        if (body.indexOf("+ 记一条") < 0) throw new Error("compose");
        if (body.indexOf("印尼算力中心市场前景（2027-2035）与中美对比 · 结论摘要") < 0) throw new Error("sample");
        if (body.indexOf("2026-09-27 03:58 · agent") < 0) throw new Error("meta");
        await clickSel("[data-zlk-view='sample-indonesia']");
        if (text().indexOf("示例笔记，写在本机暂存里") < 0) throw new Error("view");
        await clickSel("[data-zlk-view='sample-indonesia']");
        if (text().indexOf("示例笔记，写在本机暂存里") >= 0) throw new Error("collapsed");
        setVal(q("[data-zlk-search]"), "不存在的词xyz");
        await clickSel("[data-zlk-search-btn]");
        if (text().indexOf("没有命中") < 0) throw new Error("miss");
        setVal(q("[data-zlk-search]"), "印尼");
        await clickSel("[data-zlk-search-btn]");
        if (text().indexOf("印尼算力中心市场前景") < 0) throw new Error("hit");
        if (text().indexOf("没有命中") >= 0) throw new Error("false miss");
        setVal(q("[data-zlk-search]"), "");
        await clickSel("[data-zlk-search-btn]");
        await clickSel("[data-zlk-compose]");
        setVal(q("[data-zlk-title]"), "报价口径");
        setVal(q("[data-zlk-body]"), "含税价按到岸算。");
        await clickSel("[data-zlk-save]");
        if (text().indexOf("报价口径") < 0) throw new Error("saved");
        if (text().indexOf("已记下") < 0) throw new Error("toast");
        var del = q("[data-zlk-del]:not([data-zlk-del='sample-indonesia'])");
        if (!del) throw new Error("delete button");
        del.click();
        await flush();
        if (text().indexOf("报价口径") >= 0) throw new Error("still listed");
        await clickSel("[data-zlk-tab='files']");
        if (!q("[data-zlk-tab='files']").classList.contains("on")) throw new Error("files tab");
        if (text().indexOf("还没有文件") < 0) throw new Error("files empty");
        if (!q("[data-zlk-upload]")) throw new Error("upload");
        var input = q("[data-zlk-file-input]");
        var upload = new File(["到岸价口径"], "口径.txt", { type: "text/plain" });
        var transfer = new DataTransfer();
        transfer.items.add(upload);
        input.files = transfer.files;
        input.dispatchEvent(new Event("change", { bubbles: true }));
        await new Promise(function (resolve) { setTimeout(resolve, 100); });
        if (text().indexOf("口径.txt") < 0) throw new Error("uploaded");
        await clickSel("[data-zlk-view-file]");
        if (text().indexOf("到岸价口径") < 0) throw new Error("file body");
        await clickSel("[data-zlk-del-file]");
        if (text().indexOf("口径.txt") >= 0) throw new Error("file remains");
        if (text().indexOf("还没有文件") < 0) throw new Error("files empty again");
        await clickSel("[data-zlk-back]");
        if (q("[data-zlk-panel]")) throw new Error("still open");
        pass("PASS");
      } catch (e) {
        fail(e && e.message ? e.message : String(e));
      }
    })();
  }, 0);
})();
