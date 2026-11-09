import assert from "node:assert/strict";
import test from "node:test";
import { compareVersions, planUpdate } from "../lib/update.js";

test("github update only when the library package is newer", () => {
  assert.equal(compareVersions("0.2.12", "0.2.11") > 0, true);
  assert.equal(compareVersions("0.2.11", "0.2.12") > 0, false);
  assert.equal(compareVersions("0.2.11", "0.2.11"), 0);
  const older = planUpdate({ name: "library-plugin", version: "0.1.0" }, "0.2.12");
  assert.equal(older.update, false);
  assert.equal(older.error, undefined);
  const wrongName = planUpdate({ name: "library-plugin", version: "9.0.0" }, "0.2.12");
  assert.equal(wrongName.update, false);
  assert.match(wrongName.error, /包名/);
  const newer = planUpdate({ name: "anywork-library-plugin", version: "0.3.0" }, "0.2.12");
  assert.equal(newer.update, true);
  assert.equal(newer.latest, "0.3.0");
});
