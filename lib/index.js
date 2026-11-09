import { createReadStream } from "node:fs";
import {
  MAX_UPLOAD,
  fileForDownload,
  listDrive,
  listNotes,
  makeDir,
  movePath,
  readNote,
  removeNote,
  removePath,
  saveFile,
  saveNote,
  searchNotes,
} from "./store.js";
import { checkLatest, currentVersion, installLatest } from "./update.js";

export const name = "anywork-library-plugin";

const PREFIX = "/plugins/anywork-library-plugin";

function send(res, status, body) {
  const payload = Buffer.from(JSON.stringify(body));
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "content-length": payload.length,
  });
  res.end(payload);
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > 1024 * 1024) {
        reject(Object.assign(new Error("too large"), { status: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      if (!chunks.length) return resolve({});
      try { resolve(JSON.parse(Buffer.concat(chunks).toString("utf8"))); }
      catch { reject(Object.assign(new Error("bad json"), { status: 400 })); }
    });
    req.on("error", reject);
  });
}

function readRaw(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_UPLOAD) {
        reject(Object.assign(new Error("too large"), { status: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function statusFor(result) {
  if (!result || !result.error) return 200;
  if (/不存在|not found/.test(result.error)) return 404;
  return 400;
}

async function handle(req, res) {
  const url = new URL(req.url || "/", "http://library.local");
  const pathname = url.pathname;
  if (req.method === "GET" && pathname === PREFIX + "/drive/list") {
    const result = listDrive(url.searchParams.get("path") || "");
    return send(res, statusFor(result), result);
  }
  if (req.method === "POST" && pathname === PREFIX + "/drive/upload") {
    const data = await readRaw(req);
    const result = saveFile(url.searchParams.get("path") || "", url.searchParams.get("name") || "", data);
    return send(res, statusFor(result), result);
  }
  if (req.method === "POST" && pathname === PREFIX + "/drive/mkdir") {
    const body = await readJson(req);
    const result = makeDir(body.path || "", body.name || "");
    return send(res, statusFor(result), result);
  }
  if (req.method === "POST" && pathname === PREFIX + "/drive/rm") {
    const body = await readJson(req);
    const result = removePath(body.path || "");
    return send(res, statusFor(result), result);
  }
  if (req.method === "POST" && pathname === PREFIX + "/drive/mv") {
    const body = await readJson(req);
    const result = movePath(body.from || "", body.to || "");
    return send(res, statusFor(result), result);
  }
  if (req.method === "GET" && pathname === PREFIX + "/drive/download") {
    const result = fileForDownload(url.searchParams.get("path") || "");
    if (result.error) return send(res, statusFor(result), result);
    res.writeHead(200, {
      "content-type": "application/octet-stream",
      "content-length": result.size,
      "content-disposition": "attachment; filename*=UTF-8''" + encodeURIComponent(result.name),
      "cache-control": "no-store",
    });
    createReadStream(result.abs).pipe(res);
    return;
  }
  if (req.method === "GET" && pathname === PREFIX + "/kb/list") {
    return send(res, 200, listNotes());
  }
  if (req.method === "GET" && pathname === PREFIX + "/kb/search") {
    return send(res, 200, searchNotes(url.searchParams.get("q") || ""));
  }
  if (req.method === "GET" && pathname === PREFIX + "/kb/note") {
    const result = readNote(url.searchParams.get("name") || "");
    return send(res, statusFor(result), result);
  }
  if (req.method === "POST" && pathname === PREFIX + "/kb/save") {
    const body = await readJson(req);
    const result = saveNote(body);
    return send(res, statusFor(result), result);
  }
  if (req.method === "POST" && pathname === PREFIX + "/kb/rm") {
    const body = await readJson(req);
    const result = removeNote(body.name || "");
    return send(res, statusFor(result), result);
  }
  if (req.method === "GET" && pathname === PREFIX + "/update") {
    try {
      return send(res, 200, await checkLatest());
    } catch {
      return send(res, 502, { error: "连不上 GitHub", current: currentVersion() });
    }
  }
  if (req.method === "POST" && pathname === PREFIX + "/update") {
    const body = await readJson(req);
    try {
      return send(res, 200, await installLatest(body.version));
    } catch (err) {
      return send(res, err.status || 500, { error: err.publicMessage || "升级没有完成" });
    }
  }
  send(res, 404, { error: "not found" });
}

function routes() {
  return [
    "/drive/list",
    "/drive/upload",
    "/drive/mkdir",
    "/drive/rm",
    "/drive/mv",
    "/drive/download",
    "/kb/list",
    "/kb/search",
    "/kb/note",
    "/kb/save",
    "/kb/rm",
    "/update",
  ].map((suffix) => ({
    kind: "exact",
    path: PREFIX + suffix,
    handler: (req, res) => handle(req, res).catch((err) => {
      if (res.headersSent) return;
      send(res, err.status || 500, { error: err.message || "failed" });
    }),
  }));
}

function bindRoutes(ctx) {
  const web = ctx.get?.("webServer") ?? ctx.get?.("httpServer");
  if (!web || typeof web.register !== "function") return null;
  const stops = [];
  for (const route of routes()) {
    const stop = web.register(route);
    if (typeof stop === "function") stops.push(stop);
  }
  return () => {
    for (const stop of stops) stop();
  };
}

export function apply(ctx) {
  if (!ctx || typeof ctx.effect !== "function") return;
  ctx.effect(() => {
    let unbind = bindRoutes(ctx);
    let alive = true;
    const onService = (name) => {
      if (!alive || unbind) return;
      if (name === "webServer" || name === "httpServer") unbind = bindRoutes(ctx);
    };
    if (typeof ctx.on === "function") ctx.on("internal/service", onService);
    return () => {
      alive = false;
      if (unbind) unbind();
    };
  });
}
