import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CodeGroup } from "../src/components/docs/code-group";
import type { CodeSample } from "../src/lib/framework/types";

const original: CodeSample = {
  id: "functions", label: "functions.py", code: "def greet():\r\n    return 'Hello'\r\n\r\nprint(greet())\r\n",
  lines: [
    {number:1,html:"def greet():"}, {number:2,html:"    return &#39;Hello&#39;"},
    {number:3,html:""}, {number:4,html:"print(greet())"},
  ],
  sourcePath:"courses/fastapi/labs/f03-python/functions.py", sourceHash:"123456789abcdef",
  checkpoint:"W01 · 739a064 · L1–L4", sourceUrl:"https://github.com/ban-code-art/ai-engineering-roadmap/blob/739a0646e7a07a05f29e8316773f0fc5adb4d23b/courses/fastapi/labs/f03-python/functions.py#L1-L4",
};

function codeFrame(html: string) {
  const start = html.search(/<div\b[^>]*\bclass="docs-code-group"/);
  assert.ok(start >= 0, "pure code frame must exist");
  let depth = 0;
  for (const token of html.slice(start).matchAll(/<div\b[^>]*>|<\/div>/g)) {
    depth += token[0].startsWith("</") ? -1 : 1;
    if (depth === 0) return html.slice(start, start + token.index! + token[0].length);
  }
  assert.fail("unclosed code frame");
}

test("single sample code frame contains code and copy only, with provenance after the frame", () => {
  const html = renderToStaticMarkup(createElement(CodeGroup,{id:"single",title:"重复标题",samples:[original]}));
  const frame = codeFrame(html);
  assert.match(frame, /aria-label="复制代码"/);
  assert.match(frame, /<pre/);
  assert.doesNotMatch(frame, /<p\b|<details|<a\b|role="tablist"|W01|SHA-256|版本与来源|functions\.py<\/p>/);
  assert.doesNotMatch(html, /role="tab"|role="tablist"|docs-code-title|docs-code-meta/);
  assert.match(frame, /role="tabpanel"[^>]*aria-label="functions\.py"/);
  assert.match(html, /class="docs-code-reference"[\s\S]*查看源码 ↗/);
  assert.match(html, /<summary>版本与来源<\/summary>/);
  assert.ok(html.indexOf('class="docs-code-reference"') > html.indexOf(frame) + frame.length - 1);
});

test("multiple sample tabs and native alternatives stay outside the pure code frame", () => {
  const alternate = {...original,id:"changed",label:"改变输入",code:"print('Mei')\n",lines:[]};
  const html = renderToStaticMarkup(createElement(CodeGroup,{id:"multi",samples:[original,alternate],defaultSampleId:"changed"}));
  const frame = codeFrame(html);
  assert.ok(html.indexOf('role="tablist"') < html.indexOf(frame));
  assert.match(frame,/print\(&#x27;Mei&#x27;\)|print\(&#39;Mei&#39;\)/);
  assert.match(frame,/aria-labelledby="multi-tab-changed"/);
  assert.doesNotMatch(frame, /<details|<a\b|role="tablist"/);
  assert.ok(html.indexOf('class="docs-code-fallback"') > html.indexOf(frame)+frame.length-1);
});

test("focus line decoration preserves source indentation and CRLF boundaries", () => {
  const sample = {...original,highlightLines:[2]};
  const before = JSON.stringify(sample);
  const html = renderToStaticMarkup(createElement(CodeGroup,{id:"focus",samples:[sample]}));
  const frame = codeFrame(html);
  assert.match(frame,/data-highlighted="true"[^>]*>    return &#39;Hello&#39;<\/span>\r\n/);
  assert.match(frame, /<\/span>\r\n<span class="docs-code-line"[^>]*><\/span>\r\n/);
  assert.equal(JSON.stringify(sample),before);
});
