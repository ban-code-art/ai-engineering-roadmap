import assert from "node:assert/strict";
import test from "node:test";

test("preview entries never appear in the production search index", async () => {
  const path = "../src/lib/framework/registry.ts";
  const { getSearchEntries } = await import(path);
  assert.ok(getSearchEntries(false).every((entry: {preview?: boolean}) => !entry.preview));
  assert.ok(getSearchEntries(true).some((entry: {preview?: boolean}) => entry.preview));
});

test("Chinese terms and file symbols find context targets", async () => {
  const path = "../src/lib/framework/search.ts";
  const { searchEntries } = await import(path);
  const entries = [
    {id:"code",title:"局部代码",section:"文档组件",summary:"sample.py 组件 源码与返回值",href:"/framework-preview#code",preview:true},
    {id:"flow",title:"请求流程",section:"文档组件",summary:"连接、路径匹配、JSON 响应",href:"/framework-preview#flow",preview:true},
  ];
  assert.equal(searchEntries(entries,"返回值")[0]?.id,"code");
  assert.equal(searchEntries(entries,"sample.py")[0]?.id,"code");
  assert.equal(searchEntries(entries,"不存在线索").length,0);
  assert.equal(searchEntries(entries," ").length,0);
});

test("unknown fragments do not resolve arbitrary targets", async () => {
  const path = "../src/lib/framework/navigation.ts";
  const { resolveFragment } = await import(path);
  const targets = [{id:"code",title:"代码",level:2}];
  assert.equal(resolveFragment("#code",targets)?.id,"code");
  assert.equal(resolveFragment("#../../sample.py",targets),null);
  assert.equal(resolveFragment("#%invalid",targets),null);
});
