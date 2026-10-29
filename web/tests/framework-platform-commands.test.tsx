import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { LessonCommands } from "../src/components/docs/lesson-commands";
import { materializeLesson } from "../src/lib/course/materialize";
import { exportDocumentText } from "../src/lib/framework/document-export";
import { createElement } from "react";

test("platform commands default to explicitly labeled Windows PowerShell and keep the POSIX alternative", async () => {
  const props = { id:"platform-run",title:"运行 functions.py",windows:{source:"f03-windows",start:5,end:5},posix:{source:"f03-posix",start:6,end:6} };
  const body = await materializeLesson(createElement(LessonCommands,props));
  const html = renderToStaticMarkup(body);
  assert.match(html,/role="tab"[^>]*aria-selected="true"[^>]*>Windows · PowerShell<\/button>/);
  assert.match(html,/macOS · Linux/);
  assert.match(html,/aria-label="运行 functions\.py：操作系统"/);
  assert.match(html,/查看其他系统命令/);
  const visible = html.match(/<div[^>]*class="docs-code-panel"[^>]*tabindex="0"[^>]*>([\s\S]*?)<\/div>/)?.[1];
  assert.ok(visible?.includes("Scripts"));
  assert.ok(!visible?.includes(".venv/bin"));
  const text = exportDocumentText(body);
  assert.ok(text.includes("Windows · PowerShell"));
  assert.ok(text.includes(".\\.venv\\Scripts\\python.exe python-basics\\functions.py"));
  assert.ok(!text.includes("./.venv/bin/python"));
  const command = await LessonCommands(props);
  const samples = command.props.samples;
  assert.equal(samples[0].code,".\\.venv\\Scripts\\python.exe python-basics\\functions.py\n");
  assert.equal(samples[1].code,"./.venv/bin/python python-basics/functions.py\n");
});
