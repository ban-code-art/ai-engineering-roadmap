import assert from "node:assert/strict";
import test from "node:test";
import { createElement, Fragment } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { CodeSample } from "../src/lib/framework/types.ts";

const samples: CodeSample[] = [
  {
    id: "initial",
    label: "初始版本",
    code: "value = '<tag>'\nprint(value)\n",
    lines: [
      { number: 1, html: '<span style="color:var(--syntax-string)">value = &#39;&lt;tag&gt;&#39;</span>' },
      { number: 2, html: "print(value)" },
    ],
    sourcePath: "examples/initial.py",
    sourceHash: "sha256:initial-source-hash",
    checkpoint: "checkpoint-1",
  },
  {
    id: "revised",
    label: "修订版本",
    code: "value = 2\nprint(value)",
    lines: [
      { number: 1, html: '<span style="color:var(--syntax-number)">value = 2</span>' },
      { number: 2, html: "print(value)" },
    ],
    sourcePath: "examples/revised.py",
    sourceHash: "sha256:revised-source-hash",
  },
];

async function loadCodeGroup() {
  const modulePath = "../src/components/docs/code-group.tsx";
  const module = await import(modulePath).catch((error: unknown) => {
    assert.fail(`CodeGroup is not available: ${String(error)}`);
  });
  assert.equal(typeof module.CodeGroup, "function");
  return module.CodeGroup;
}

async function loadPrimitives() {
  const modulePath = "../src/components/docs/document-primitives.tsx";
  return import(modulePath).catch((error: unknown) => {
    assert.fail(`Document primitives are not available: ${String(error)}`);
  });
}

function activePanel(markup: string): string {
  return markup.match(/<div\b[^>]*role="tabpanel"(?=[^>]*\btabindex="0")(?=[^>]*\baria-labelledby="[^"]+")[^>]*>([\s\S]*?)<\/div>/)?.[1] ?? "";
}

test("server-rendered code selects the requested sample and keeps every alternate available without JavaScript", async () => {
  const CodeGroup = await loadCodeGroup();
  const markup = renderToStaticMarkup(createElement(CodeGroup, {
    id: "group-one",
    title: "代码示例",
    samples,
    defaultSampleId: "revised",
  }));

  assert.match(activePanel(markup), /value = 2/);
  assert.match(markup, /role="tab"[^>]*aria-selected="true"[^>]*>修订版本<\/button>/);
  assert.match(markup, /<details\b[^>]*class="docs-code-fallback"/);
  assert.match(markup, /<summary[^>]*>查看其他版本<\/summary>/);
  assert.match(markup, /初始版本/);
  assert.match(markup, /examples\/initial\.py/);
  assert.match(markup, /sha256:initial-source-hash/);
  assert.match(markup, /sha256:revised-source-hash/);
});

test("highlighted HTML, source text and provenance survive rendering without mutation", async () => {
  const CodeGroup = await loadCodeGroup();
  const frozenSamples = structuredClone(samples);
  frozenSamples.forEach((sample) => {
    sample.lines.forEach(Object.freeze);
    Object.freeze(sample.lines);
    Object.freeze(sample);
  });
  Object.freeze(frozenSamples);
  const before = JSON.stringify(frozenSamples);
  const markup = renderToStaticMarkup(createElement(CodeGroup, { id: "original", samples: frozenSamples }));

  assert.ok(markup.includes(samples[0].lines[0].html));
  assert.match(activePanel(markup), /print\(value\)<\/span>\n<\/code>/);
  assert.match(markup, /aria-label="复制代码"/);
  assert.doesNotMatch(markup, /docs-line-number|line-number/);
  assert.equal(JSON.stringify(frozenSamples), before);
});

test("plain source is escaped when highlighting is absent", async () => {
  const CodeGroup = await loadCodeGroup();
  const code = '<script>alert("sample")</script>\n  keep_indentation()';
  const markup = renderToStaticMarkup(createElement(CodeGroup, {
    id: "plain",
    samples: [{ id: "plain", label: "纯文本", code, lines: [] }],
  }));

  assert.match(activePanel(markup), /&lt;script&gt;alert\(&quot;sample&quot;\)&lt;\/script&gt;\n  keep_indentation\(\)/);
  assert.doesNotMatch(markup, /<script>alert/);
});

test("two code groups retain independent defaults and distinct tab-panel relationships", async () => {
  const CodeGroup = await loadCodeGroup();
  const first = renderToStaticMarkup(createElement(CodeGroup, { id: "first", samples, defaultSampleId: "initial" }));
  const second = renderToStaticMarkup(createElement(CodeGroup, { id: "second", samples, defaultSampleId: "revised" }));
  const markup = renderToStaticMarkup(createElement(Fragment, null,
    createElement(CodeGroup, { id: "first", samples, defaultSampleId: "initial" }),
    createElement(CodeGroup, { id: "second", samples, defaultSampleId: "revised" }),
  ));
  const elementIds = [...markup.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);

  assert.match(activePanel(first), /&lt;tag&gt;/);
  assert.match(activePanel(second), /value = 2/);
  assert.equal(new Set(elementIds).size, elementIds.length);
  for (const control of markup.matchAll(/\baria-controls="([^"]+)"/g)) {
    assert.ok(elementIds.includes(control[1]), `missing controlled panel ${control[1]}`);
  }
});

test("invalid default falls back to the first sample and an empty group renders safely", async () => {
  const CodeGroup = await loadCodeGroup();
  const markup = renderToStaticMarkup(createElement(CodeGroup, { id: "invalid", samples, defaultSampleId: "unknown" }));
  const empty = renderToStaticMarkup(createElement(CodeGroup, { id: "empty", samples: [] }));

  assert.match(activePanel(markup), /&lt;tag&gt;/);
  assert.match(empty, /暂无代码/);
  assert.doesNotMatch(empty, /role="tab"/);
});

test("document primitives preserve readable content and native disclosure semantics", async () => {
  const { DocsSection, DocsAccordion, DocsCallout, DocsSteps, CopyPageButton } = await loadPrimitives();
  const markup = renderToStaticMarkup(createElement(DocsSection, { id: "section-one", title: "组件预览" },
    createElement(DocsCallout, { kind: "tip", title: "提示" }, "正文保持连续。"),
    createElement(DocsAccordion, { title: "展开细节", id: "details-one" }, "原生折叠内容"),
    createElement(DocsSteps, { items: [{ title: "第一步", body: "步骤正文" }] }),
    createElement(CopyPageButton, { text: "组件预览\n正文保持连续。" }),
  ));

  assert.match(markup, /<h2\b[^>]*id="section-one"[^>]*tabindex="-1"/);
  assert.match(markup, /href="#section-one"/);
  assert.match(markup, /class="docs-callout"[^>]*data-kind="tip"/);
  assert.match(markup, /<details\b[^>]*id="details-one"[^>]*class="docs-accordion"/);
  assert.match(markup, /<summary[^>]*>展开细节<\/summary>/);
  assert.match(markup, /<ol class="docs-steps">/);
  assert.match(markup, /原生折叠内容/);
  assert.match(markup, /步骤正文/);
  assert.match(markup, /aria-label="复制页面"/);
});
