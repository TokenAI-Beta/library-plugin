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
  function flush() { return new Promise(function (resolve) { setTimeout(resolve, 80); }); }
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
        if (body.indexOf("丢进来，全员就能看见") < 0) throw new Error("subtitle");
        if (body.indexOf("返回") < 0) throw new Error("back");
        if (body.indexOf("丢进来") < 0) throw new Error("intake");
        if ((window.__zlkCalls || []).join("\n").indexOf("GET /plugins/anywork-library-plugin/kb/list") < 0) throw new Error("kb list");
        if (q("[data-zlk-line]").getAttribute("placeholder").indexOf("或写一句") < 0) throw new Error("line");
        if (body.indexOf("示例笔记") >= 0 || body.indexOf("2026-09-27-sample") >= 0) throw new Error("demo data");
        setVal(q("[data-zlk-line]"), "含税价按到岸算。");
        await clickSel("[data-zlk-save]");
        if (text().indexOf("含税价按到岸算") < 0 && text().indexOf("报价") < 0) throw new Error("saved");
        if (text().indexOf("已记下") < 0) throw new Error("toast");
        await clickSel("[data-zlk-view='note-0.md']");
        if (text().indexOf("含税价按到岸算。") < 0) throw new Error("view");
        await clickSel("[data-zlk-view='note-0.md']");
        setVal(q("[data-zlk-search]"), "不存在的词xyz");
        await clickSel("[data-zlk-search-btn]");
        if (text().indexOf("没有这句话") < 0) throw new Error("miss");
        setVal(q("[data-zlk-search]"), "");
        await clickSel("[data-zlk-search-btn]");
        var del = q("[data-zlk-del='note-0.md']");
        if (!del) throw new Error("delete button");
        del.click();
        await flush();
        await clickSel("[data-zlk-mkdir]");
        setVal(q("[data-zlk-folder-name]"), "客户A");
        await clickSel("[data-zlk-mkdir-save]");
        if (text().indexOf("客户A") < 0) throw new Error("folder");
        var input = q("[data-zlk-file-input]");
        var upload = new File(["到岸价口径"], "口径.txt", { type: "text/plain" });
        var transfer = new DataTransfer();
        transfer.items.add(upload);
        input.files = transfer.files;
        input.dispatchEvent(new Event("change", { bubbles: true }));
        await flush();
        if (text().indexOf("口径.txt") < 0) throw new Error("uploaded");
        q("[data-zlk-del-file='口径.txt']").click();
        await flush();
        if (text().indexOf("口径.txt") >= 0) throw new Error("file remains");
        if ((window.__zlkCalls || []).join("\n").indexOf("GET /plugins/anywork-library-plugin/drive/list") < 0) throw new Error("drive list");
        await clickSel("[data-zlk-back]");
        if (q("[data-zlk-panel]")) throw new Error("still open");
        pass("PASS");
      } catch (e) {
        fail(e && e.message ? e.message : String(e));
      }
    })();
  }, 0);
})();
