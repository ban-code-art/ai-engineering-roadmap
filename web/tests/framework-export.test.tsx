import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";

test("document export includes continuous sections and defaults without hidden alternatives", async () => {
  const path="../src/lib/framework/document-export.ts";
  const { exportDocumentText }=await import(path);
  const sample={id:"current",label:"当前块",code:"return current\n"};
  const tree=createElement('article',null,
    createElement('h1',null,'文档'),
    createElement('section',null,createElement('h2',null,'章节一'),createElement('p',null,'解释一')),
    createElement('div',{samples:[sample,{id:'future',code:'return future\n'}]}),
    createElement('details',null,createElement('summary',null,'完整文件'),createElement('p',null,'hidden answer')),
    createElement('section',null,createElement('h2',null,'章节二'),createElement('p',null,'解释二')),
  );
  const text=exportDocumentText(tree);
  assert.ok(text.includes('章节一')&&text.includes('解释一')&&text.includes('章节二')&&text.includes('解释二'));
  assert.ok(text.includes('return current\n'));
  assert.ok(!text.includes('return future')&&!text.includes('hidden answer'));
});
