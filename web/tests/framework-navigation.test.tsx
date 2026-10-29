import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

const entries = [
  { id: "file", title: "sample.py 文件", section: "文件检查", summary: "组件样例与返回值", href: "/framework-preview#files--file--sample-py", preview: true },
  { id: "code", title: "代码阅读", section: "基础展示", summary: "sample.py 与路径匹配", href: "/framework-preview#code", preview: true },
  { id: "flow", title: "响应流程", section: "请求检查", summary: "JSON 返回值", href: "/framework-preview#flow", preview: true },
];

test("search requires every token and handles case-insensitive file names", async () => {
  const path = "../src/lib/framework/search.ts";
  const { searchEntries } = await import(path);
  assert.deepEqual(searchEntries(entries, "SAMPLE.PY 返回值").map((entry: { id: string }) => entry.id), ["file"]);
  assert.equal(searchEntries(entries, "sample.py 响应").length, 0);
  assert.deepEqual(searchEntries(entries, "sample.py").map((entry: { id: string }) => entry.id), ["file", "code"]);
  assert.deepEqual(entries.map((entry) => entry.id), ["file", "code", "flow"]);
});

test("registry isolates returned indexes and all destinations are registered", async () => {
  const path = "../src/lib/framework/registry.ts";
  const { getSearchEntries, isSearchHrefAllowed, previewTargets } = await import(path);
  const index = getSearchEntries(true);
  assert.ok(index.every((entry: { href: string }) => isSearchHrefAllowed(entry.href)));
  assert.ok(previewTargets.some((target: { id: string }) => target.id === "files--file--sample-py"));
  assert.ok(previewTargets.some((target: { id: string }) => target.id === "flow--node--handler"));
  assert.equal(isSearchHrefAllowed("https://example.org"), false);
  assert.equal(isSearchHrefAllowed("/framework-preview#not-registered"), false);
  index[0].title = "changed";
  assert.notEqual(getSearchEntries(true)[0].title, "changed");
});

test("fragments decode once and cannot escape the explicit target list", async () => {
  const path = "../src/lib/framework/navigation.ts";
  const { resolveFragment } = await import(path);
  const targets = [{ id: "中文", title: "说明", level: 2 }, { id: "code", title: "代码", level: 2 }];
  assert.equal(resolveFragment("#%E4%B8%AD%E6%96%87", targets)?.id, "中文");
  assert.equal(resolveFragment("#%63ode", targets)?.id, "code");
  for (const hash of ["", "code", "#", "#%2563ode", "#code?next=else", "#code%00", "#%E0%A4%A"]) {
    assert.equal(resolveFragment(hash, targets), null);
  }
});

test("table of contents prerenders every section as a real fragment link", async () => {
  const path = "../src/components/docs/table-of-contents.tsx";
  const { TableOfContents } = await import(path);
  const targets = [{ id: "first", title: "第一节", level: 2 }, { id: "last", title: "最后一节", level: 3 }];
  const html = renderToStaticMarkup(<TableOfContents targets={targets} />);
  assert.match(html, /href="#first"/);
  assert.match(html, /href="#last"/);
  assert.match(html, /第一节/);
  assert.match(html, /最后一节/);
});

test("search prerenders accessible trigger and only registered navigation entries", async () => {
  const path = "../src/components/docs/search-dialog.tsx";
  const { SearchDialog } = await import(path);
  const html = renderToStaticMarkup(<SearchDialog entries={[...entries, { ...entries[0], id: "bad", title: "UNSAFE", href: "https://example.org" }]} />);
  assert.match(html, /搜索文档/);
  assert.match(html, /<dialog/);
  assert.match(html, /sample.py 文件/);
  assert.doesNotMatch(html, /UNSAFE|https:\/\/example.org/);
});
