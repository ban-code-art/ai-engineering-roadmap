import test from "node:test";
import assert from "node:assert/strict";
import { sections, siteSearchEntries } from "../src/content/site";
import { getSearchEntries } from "../src/lib/framework/registry";

test("course navigation exposes distinct tutorial and practice entry pages", () => {
  assert.deepEqual(sections.map(({title,href})=>({title,href})), [
    {title:"FastAPI 教程",href:"/learn"},
    {title:"FastAPI 项目实战",href:"/project"},
    {title:"LangChain 项目实战",href:"/project/langchain"},
    {title:"RAG 项目实战",href:"/project/rag"},
  ]);
  assert.equal(new Set(sections.map(section=>section.href)).size,4);
});

test("every course entry can be found without including component preview content", () => {
  const production = getSearchEntries(false);
  for(const title of ["FastAPI 教程","FastAPI 项目实战","LangChain 项目实战","RAG 项目实战"]) {
    const entry = siteSearchEntries.find(entry=>entry.title===title);
    assert.ok(entry,`Missing course entry: ${title}`);
    assert.ok(production.some(result=>result.href===entry.href));
  }
  assert.ok(production.every(entry=>!entry.preview));
});
