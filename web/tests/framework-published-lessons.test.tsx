import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { fastapiChapters, chapterHref } from "../src/content/fastapi/course";
import { sidebarGroups, siteSearchEntries } from "../src/content/site";
import { getSearchEntries, isSearchHrefAllowed } from "../src/lib/framework/registry";
import HttpRequestResponse, * as http from "../src/content/fastapi/chapters/http-request-response";
import EnvironmentAndProjectRoot, * as environment from "../src/content/fastapi/chapters/environment-and-project-root";
import PythonForApi, * as python from "../src/content/fastapi/chapters/python-for-api";
import { materializeLesson } from "../src/lib/course/materialize";
import { getSourceSample } from "../src/lib/course/sources";
import { exportDocumentText } from "../src/lib/framework/document-export";
import { DocsAccordion } from "../src/components/docs/document-primitives";

test("only the first completed batch is published in chapter routes, sidebar and search", () => {
  assert.deepEqual(fastapiChapters.map(chapter => chapter.id), ["F01", "F02", "F03"]);
  const sidebar = sidebarGroups.learn.flatMap(group => group.links);
  for (const chapter of fastapiChapters) {
    const href = chapterHref(chapter.slug);
    assert.ok(sidebar.some(link => link.href === href));
    assert.ok(siteSearchEntries.some(entry => entry.href === href));
    assert.ok(getSearchEntries(false).some(entry => entry.href === href));
    assert.ok(isSearchHrefAllowed(href));
  }
  assert.ok(!isSearchHrefAllowed("/learn/fastapi/first-application"));
});

test("all chapter sections, default code, pinned links and accessible diagrams render without client JS", async () => {
  for (const lesson of [{render:HttpRequestResponse,...http},{render:EnvironmentAndProjectRoot,...environment},{render:PythonForApi,...python}]) {
    const body = await materializeLesson(lesson.render());
    const html = renderToStaticMarkup(body);
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(new Set(ids).size, ids.length, "all code tabs, SVG markers, headings must have unique IDs");
    for (const target of lesson.targets) assert.ok(html.includes(`id="${target.id}"`), `Missing heading ${target.id}`);
    assert.match(html, /<pre/);
    assert.match(html, /<svg[\s\S]*?role="img"/);
    assert.match(html, /<desc/);
    assert.match(html, /查看流程的文字说明/);
    const links = [...html.matchAll(/href="(https:\/\/github.com\/ban-code-art\/ai-engineering-roadmap\/blob\/[^\"]+)"/g)].map(match=>match[1]);
    assert.ok(links.length > 0);
    assert.ok(links.every(link => /\/blob\/[a-f0-9]{40}\/courses\/fastapi\/labs\//.test(link)));
    const text = exportDocumentText(body, {excludeTypes:[DocsAccordion]});
    assert.ok(text.includes(lesson.targets[0].title) && text.includes(lesson.targets.at(-1)!.title));
    assert.ok(!text.includes("SHA-256"));
  }
});

test("copying a displayed source excerpt retains indentation, newline and version line range", async () => {
  const sample = await getSourceSample("f03-functions");
  assert.ok(sample.code.includes("    return"));
  assert.ok(sample.code.endsWith("\n"));
  assert.match(sample.sourceUrl, /#[L]1-L\d+$/);
  const command = await getSourceSample("f02-windows", {start:23,end:23});
  assert.equal(command.code, ".\\.venv\\Scripts\\python.exe -m pip install -r requirements.lock.txt\n");
});

test("HTTP highlighting retains the blank boundary between headers and an empty body", async () => {
  const sample = await getSourceSample("f01-request", {start:1,end:6});
  assert.ok(sample.code.endsWith("\n\n"));
  assert.equal(sample.lines.length, sample.code.split("\n").length);
  assert.equal(sample.lines.at(-1)!.html, "");
});
