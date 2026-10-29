import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { ReactFlow } from "@xyflow/react";
import { codeToHtml } from "shiki";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

// This probes real package entry points and the highlighter. It does not claim
// that the document renderer or a browser diagram has been implemented/tested.
assert.ok(ReactFlow);
assert.equal(renderToStaticMarkup(createElement("p", null, "中文阅读")), "<p>中文阅读</p>");
const highlighted = await codeToHtml('print("中文")', { lang: "python", theme: "catppuccin-latte" });
assert.ok(highlighted.includes("shiki") && highlighted.includes("中文"));
const pkg = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
const lock = JSON.parse(await readFile(new URL("../package-lock.json", import.meta.url), "utf8"));
for (const [name, version] of Object.entries({ ...pkg.dependencies, ...pkg.devDependencies })) {
  assert.equal(lock.packages[`node_modules/${name}`]?.version, version, `${name} does not match the direct pin`);
}
console.log(JSON.stringify({ status: "pass", node: process.version, directPins: pkg.dependencies,
  checks: ["React server text rendering", "React Flow module/types", "Shiki bundled Python grammar/theme", "direct pins match lock"],
  notCovered: ["browser diagram", "lesson/source linkage", "Node 24 runtime"] }));
