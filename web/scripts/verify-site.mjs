import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const web=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const preview=process.argv.includes('--preview');
const base=process.env.SITE_URL||`http://127.0.0.1:${preview?3001:3000}`;
let connected=false;
for(let attempt=0;attempt<30;attempt++) {
  try {const response=await fetch(base,{signal:AbortSignal.timeout(1000)});if(response.ok){connected=true;break;}}catch{}
  await new Promise(resolve=>setTimeout(resolve,500));
}
assert.ok(connected,`Site did not start: ${base}`);
const routes=[];
for(const path of ['/','/learn','/project']) {
  const response=await fetch(base+path,{signal:AbortSignal.timeout(10000)});
  assert.equal(response.status,200,path);
  const html=await response.text();
  assert.ok(html.includes('docs-frame'),`${path} must share the documentation template`);
  if(path!=='/')assert.ok(html.includes('重新编写')||html.includes('待编写'),`${path} must state the empty content status`);
  assert.ok(!html.includes('/learn/06-first-api'),`Retired lesson link in ${path}`);
  const assets=new Set([...html.matchAll(/(?:src|href)="(\/_next\/static\/[^\"]+|\/fonts\/[^\"]+)"/g)].map(m=>m[1].replaceAll('&amp;','&')));
  for(const asset of assets) assert.equal((await fetch(base+asset)).status,200,asset);
  routes.push({path,status:response.status,sharedTemplate:true,assets:assets.size});
}
for(const path of ['/learn/06-first-api','/project/g2']) assert.equal((await fetch(base+path)).status,404,path);
assert.equal((await fetch(base+'/framework-preview')).status,preview?200:404);
const css=await (await fetch(base+'/fonts/fonts.css')).text();
const fonts=[...css.matchAll(/url\('([^']+)'\)/g)].map(m=>m[1]);
assert.equal(fonts.length,106);
for(const path of fonts) assert.ok((await readFile(resolve(web,'public',path.slice(1)))).length>0);
if(preview) {
  const html=await (await fetch(base+'/framework-preview')).text();
  assert.ok(html.includes('内部组件预览')&&html.includes('fixtures/code/base/sample.py'));
  assert.ok(!html.includes('examples/first-api'));
}
console.log(JSON.stringify({status:'pass',mode:preview?'preview':'production',routes,retiredLessons404:true,previewEnabled:preview,localFonts:fonts.length}));
